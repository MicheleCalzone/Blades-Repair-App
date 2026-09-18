<?php

function blades_auth_token_ttl() {
    return DAY_IN_SECONDS * 30;
}

function blades_auth_tokens_table_name() {
    global $wpdb;
    return $wpdb->prefix . 'blades_auth_tokens';
}

function blades_auth_schema_version() {
    return '1.0.0';
}

function blades_auth_install_schema() {
    global $wpdb;

    $table_name = blades_auth_tokens_table_name();
    $charset_collate = $wpdb->get_charset_collate();

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';

    $sql = "CREATE TABLE {$table_name} (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id BIGINT(20) UNSIGNED NOT NULL,
        token_hash VARCHAR(255) NOT NULL,
        device_name VARCHAR(191) DEFAULT '' NOT NULL,
        created_at DATETIME NOT NULL,
        expires_at DATETIME NOT NULL,
        last_used_at DATETIME NULL DEFAULT NULL,
        revoked_at DATETIME NULL DEFAULT NULL,
        PRIMARY KEY  (id),
        UNIQUE KEY token_hash (token_hash),
        KEY user_id (user_id),
        KEY expires_at (expires_at),
        KEY revoked_at (revoked_at)
    ) {$charset_collate};";

    dbDelta($sql);
    update_option('blades_auth_schema_version', blades_auth_schema_version(), false);
}

function blades_auth_maybe_upgrade_schema() {
    $installed_version = get_option('blades_auth_schema_version');

    if ($installed_version !== blades_auth_schema_version()) {
        blades_auth_install_schema();
    }
}

function blades_auth_now_mysql() {
    return current_time('mysql');
}

function blades_auth_expiration_mysql() {
    return gmdate('Y-m-d H:i:s', time() + blades_auth_token_ttl());
}

function blades_auth_hash_token($token) {
    return hash('sha256', wp_salt('auth') . '|' . $token);
}

function blades_auth_generate_token() {
    return wp_generate_password(64, false, false);
}

function blades_auth_normalize_device_name($device_name) {
    $value = is_string($device_name) ? trim($device_name) : '';
    return sanitize_text_field($value);
}

function blades_auth_extract_bearer_token($request = null) {
    $header = '';

    if ($request && method_exists($request, 'get_header')) {
        $header = (string) $request->get_header('authorization');
    }

    if ($header === '' && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $header = (string) $_SERVER['HTTP_AUTHORIZATION'];
    }

    if ($header === '' && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $header = (string) $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }

    if (!preg_match('/Bearer\s+(.+)/i', $header, $matches)) {
        return '';
    }

    return trim($matches[1]);
}

function blades_auth_build_user_payload($user) {
    return [
        'id' => intval($user->ID),
        'username' => (string) $user->user_login,
        'display_name' => (string) $user->display_name,
        'email' => (string) $user->user_email,
    ];
}

function blades_auth_validate_token($token) {
    if (!is_string($token) || trim($token) === '') {
        return new WP_Error('unauthorized', 'Token mancante', ['status' => 401]);
    }

    $record = blades_auth_get_token_record_by_hash(blades_auth_hash_token(trim($token)));
    if (!$record) {
        return new WP_Error('unauthorized', 'Token non valido', ['status' => 401]);
    }

    if (blades_auth_is_token_revoked($record)) {
        return new WP_Error('unauthorized', 'Token revocato', ['status' => 401]);
    }

    if (blades_auth_is_token_expired($record)) {
        return new WP_Error('unauthorized', 'Token scaduto', ['status' => 401]);
    }

    $user = get_user_by('id', intval($record['user_id']));
    if (!$user) {
        return new WP_Error('unauthorized', 'Utente token non trovato', ['status' => 401]);
    }

    return [
        'token_record' => $record,
        'user' => $user,
    ];
}

function blades_auth_require_token($request) {
    $validated = blades_auth_validate_token(blades_auth_extract_bearer_token($request));
    if (is_wp_error($validated)) {
        return $validated;
    }

    wp_set_current_user($validated['user']->ID);
    blades_auth_touch_token($validated['token_record']['id']);

    return true;
}

function blades_auth_login($request) {
    $params = $request->get_json_params();
    $username = sanitize_user($params['username'] ?? '');
    $password = isset($params['password']) ? (string) $params['password'] : '';
    $device_name = blades_auth_normalize_device_name($params['device_name'] ?? '');

    if ($username === '' || $password === '') {
        return new WP_Error('invalid_credentials', 'Username e password sono obbligatori', ['status' => 400]);
    }

    $user = wp_authenticate($username, $password);
    if (is_wp_error($user)) {
        return new WP_Error('invalid_credentials', 'Credenziali non valide', ['status' => 401]);
    }

    $token = blades_auth_generate_token();
    $stored = blades_auth_store_token_record($user->ID, blades_auth_hash_token($token), $device_name);
    if (is_wp_error($stored)) {
        return $stored;
    }

    return rest_ensure_response([
        'token' => $token,
        'expires_at' => $stored['expires_at'],
        'user' => blades_auth_build_user_payload($user),
    ]);
}

function blades_auth_me($request) {
    $validated = blades_auth_validate_token(blades_auth_extract_bearer_token($request));
    if (is_wp_error($validated)) {
        return $validated;
    }

    wp_set_current_user($validated['user']->ID);
    blades_auth_touch_token($validated['token_record']['id']);

    return rest_ensure_response([
        'user' => blades_auth_build_user_payload($validated['user']),
        'token' => [
            'expires_at' => $validated['token_record']['expires_at'],
            'last_used_at' => $validated['token_record']['last_used_at'],
        ],
    ]);
}

function blades_auth_logout($request) {
    $validated = blades_auth_validate_token(blades_auth_extract_bearer_token($request));
    if (is_wp_error($validated)) {
        return $validated;
    }

    wp_set_current_user($validated['user']->ID);
    blades_auth_revoke_token_by_id($validated['token_record']['id']);

    return rest_ensure_response([
        'success' => true,
    ]);
}

function blades_auth_store_token_record($user_id, $token_hash, $device_name = '') {
    global $wpdb;

    $table_name = blades_auth_tokens_table_name();
    $created_at = blades_auth_now_mysql();
    $expires_at = blades_auth_expiration_mysql();

    $inserted = $wpdb->insert(
        $table_name,
        [
            'user_id' => intval($user_id),
            'token_hash' => $token_hash,
            'device_name' => blades_auth_normalize_device_name($device_name),
            'created_at' => $created_at,
            'expires_at' => $expires_at,
            'last_used_at' => null,
            'revoked_at' => null,
        ],
        ['%d', '%s', '%s', '%s', '%s', '%s', '%s']
    );

    if (!$inserted) {
        return new WP_Error('token_store_failed', 'Impossibile salvare il token', ['status' => 500]);
    }

    return [
        'id' => intval($wpdb->insert_id),
        'user_id' => intval($user_id),
        'token_hash' => $token_hash,
        'device_name' => blades_auth_normalize_device_name($device_name),
        'created_at' => $created_at,
        'expires_at' => $expires_at,
        'last_used_at' => null,
        'revoked_at' => null,
    ];
}

function blades_auth_get_token_record_by_hash($token_hash) {
    global $wpdb;

    $table_name = blades_auth_tokens_table_name();
    $record = $wpdb->get_row(
        $wpdb->prepare(
            "SELECT * FROM {$table_name} WHERE token_hash = %s LIMIT 1",
            $token_hash
        ),
        ARRAY_A
    );

    return $record ?: null;
}

function blades_auth_is_token_expired($record) {
    if (empty($record['expires_at'])) {
        return true;
    }

    $expires_at = strtotime($record['expires_at']);
    return !$expires_at || $expires_at < time();
}

function blades_auth_is_token_revoked($record) {
    return !empty($record['revoked_at']);
}

function blades_auth_touch_token($token_id) {
    global $wpdb;

    if (!$token_id) {
        return;
    }

    $wpdb->update(
        blades_auth_tokens_table_name(),
        ['last_used_at' => blades_auth_now_mysql()],
        ['id' => intval($token_id)],
        ['%s'],
        ['%d']
    );
}

function blades_auth_revoke_token_by_id($token_id) {
    global $wpdb;

    if (!$token_id) {
        return false;
    }

    return false !== $wpdb->update(
        blades_auth_tokens_table_name(),
        ['revoked_at' => blades_auth_now_mysql()],
        ['id' => intval($token_id), 'revoked_at' => null],
        ['%s'],
        ['%d', '%s']
    );
}

function blades_auth_contract() {
    return [
        'transport' => 'https-only bearer token',
        'header' => 'Authorization: Bearer <token>',
        'token_ttl_seconds' => blades_auth_token_ttl(),
        'routes' => [
            'login' => [
                'method' => 'POST',
                'path' => '/wp-json/blades/v1/login',
                'body' => [
                    'username' => 'string|required',
                    'password' => 'string|required',
                    'device_name' => 'string|optional',
                ],
                'success' => [
                    'token' => 'string',
                    'expires_at' => 'mysql-datetime',
                    'user' => [
                        'id' => 'integer',
                        'username' => 'string',
                        'display_name' => 'string',
                        'email' => 'string',
                    ],
                ],
            ],
            'me' => [
                'method' => 'GET',
                'path' => '/wp-json/blades/v1/me',
                'auth' => 'required',
                'success' => [
                    'user' => [
                        'id' => 'integer',
                        'username' => 'string',
                        'display_name' => 'string',
                        'email' => 'string',
                    ],
                    'token' => [
                        'expires_at' => 'mysql-datetime',
                        'last_used_at' => 'mysql-datetime|null',
                    ],
                ],
            ],
            'logout' => [
                'method' => 'POST',
                'path' => '/wp-json/blades/v1/logout',
                'auth' => 'required',
                'success' => [
                    'success' => 'boolean',
                ],
            ],
        ],
        'storage' => [
            'table' => 'wp_blades_auth_tokens',
            'persist_only' => [
                'token_hash',
                'user_id',
                'device_name',
                'created_at',
                'expires_at',
                'last_used_at',
                'revoked_at',
            ],
        ],
        'rules' => [
            'server_never_stores_plain_token' => true,
            'frontend_stores_bearer_token_only' => true,
            'normal_wp_password_used_only_for_login' => true,
            'token_is_revocable' => true,
            'token_has_expiration' => true,
            'all_requests_must_use_https' => true,
        ],
    ];
}

add_action('rest_api_init', function () {
    register_rest_route('blades/v1', '/login', [
        'methods' => 'POST',
        'callback' => 'blades_auth_login',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('blades/v1', '/me', [
        'methods' => 'GET',
        'callback' => 'blades_auth_me',
        'permission_callback' => 'blades_auth_require_token',
    ]);

    register_rest_route('blades/v1', '/logout', [
        'methods' => 'POST',
        'callback' => 'blades_auth_logout',
        'permission_callback' => 'blades_auth_require_token',
    ]);
});

add_action('plugins_loaded', 'blades_auth_maybe_upgrade_schema');
