<?php
add_action('rest_api_init', function () {
    register_rest_route('blades/v1', '/image', [
        'methods' => 'GET',
        'callback' => 'blades_get_image_url',
        'permission_callback' => 'blades_auth_require_token',
    ]);

    register_rest_route('blades/v1', '/media', [
        'methods' => ['GET', 'POST'],
        'callback' => 'blades_handle_media',
        'permission_callback' => 'blades_auth_require_token',
    ]);
});

function blades_get_image_url($request) {
    $id = intval($request->get_param('id'));
    if (!$id) {
        return new WP_Error('invalid_id', 'ID non valido', ['status' => 400]);
    }

    if (get_post_type($id) !== 'attachment') {
        return new WP_Error('not_found', 'Non è un media', ['status' => 404]);
    }

    $relative_path = get_post_meta($id, '_wp_attached_file', true);
    if (!$relative_path) {
        return new WP_Error('not_found', 'Path file non trovato', ['status' => 404]);
    }

    $bucket_base_url = 'https://mito-obj01.vhostingcloud.com/bucket-blades-repair/';

    return [
        'id' => $id,
        'path' => $relative_path,
        'url' => $bucket_base_url . $relative_path,
    ];
}

function blades_handle_media($request) {
    if ($request->get_method() === 'GET') {
        $parent = intval($request->get_param('parent'));

        $query = new WP_Query([
            'post_type' => 'attachment',
            'post_status' => 'inherit',
            'posts_per_page' => -1,
            'post_parent' => $parent ?: 0,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);

        $items = array_map(function ($attachment) {
            $url = wp_get_attachment_url($attachment->ID);
            return [
                'id' => intval($attachment->ID),
                'title' => $attachment->post_title,
                'source_url' => $url,
                'guid' => ['rendered' => $url],
            ];
        }, $query->posts);

        return rest_ensure_response($items);
    }

    $body = $request->get_json_params();
    if (!empty($body['url'])) {
        $remote_url = esc_url_raw((string) $body['url']);
        if ($remote_url === '') {
            return new WP_Error('invalid_url', 'URL remoto non valido', ['status' => 400]);
        }

        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';

        $tmp = download_url($remote_url);
        if (is_wp_error($tmp)) {
            return new WP_Error('remote_import_failed', 'Impossibile importare l’immagine remota', ['status' => 400]);
        }

        $file_array = [
            'name' => basename(parse_url($remote_url, PHP_URL_PATH)) ?: 'remote-photo.jpg',
            'tmp_name' => $tmp,
        ];

        $attachment_id = media_handle_sideload($file_array, 0, null, ['post_status' => 'inherit']);
        @unlink($tmp);

        if (is_wp_error($attachment_id)) {
            return $attachment_id;
        }

        $url = wp_get_attachment_url($attachment_id);
        return rest_ensure_response([
            'id' => intval($attachment_id),
            'source_url' => $url,
            'sourceUrl' => $url,
            'guid' => ['rendered' => $url],
            'url' => $url,
        ]);
    }

    if (empty($_FILES['file']['tmp_name'])) {
        return new WP_Error('missing_file', 'Nessun file uploadato', ['status' => 400]);
    }

    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';

    $file = $_FILES['file'];
    $attachment_id = media_handle_sideload($file, 0, null, ['post_status' => 'inherit']);

    if (is_wp_error($attachment_id)) {
        return $attachment_id;
    }

    $url = wp_get_attachment_url($attachment_id);

    return rest_ensure_response([
        'id' => intval($attachment_id),
        'source_url' => $url,
        'sourceUrl' => $url,
        'guid' => ['rendered' => $url],
        'url' => $url,
    ]);
}
