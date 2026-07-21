<?php
add_action('rest_api_init', function () {
    register_rest_route('blades/v1', '/report', [
        'methods' => 'POST',
        'callback' => 'blades_sync_report',
        'permission_callback' => 'is_user_logged_in', // oppure JWT
    ]);
});

function blades_sync_report($request) {
    $body = $request->get_json_params();

    if (!$body || empty($body['data'])) {
        return new WP_Error('invalid', 'Payload non valido', ['status' => 400]);
    }

    $local_id = !empty($body['localId']) ? intval($body['localId']) : (!empty($body['reportId']) ? intval($body['reportId']) : 0);
    $report_id = !empty($body['reportId']) ? intval($body['reportId']) : 0;
    $data = $body['data'];
    $incoming_modified = !empty($body['lastModified']) ? strtotime($body['lastModified']) : time();
    $existing_post = $report_id ? get_post($report_id) : null;
    $is_existing_report = $existing_post && $existing_post->post_type === 'report-tecnici';

    if ($is_existing_report) {
        $server_modified = strtotime(get_post_modified_time('c', false, $report_id));

        // 🔐 REGOLA CONFLITTI
        if ($server_modified && $incoming_modified < $server_modified) {
            return [
                'success' => false,
                'conflict' => true,
                'message' => 'Versione server più recente',
            ];
        }
    }

    $post_args = [
        'post_type' => 'report-tecnici',
        'post_title' => !empty($data['title']) ? sanitize_text_field($data['title']) : 'Report tecnici',
        'post_content' => wp_json_encode($data),
        'post_status' => 'publish',
    ];

    if ($is_existing_report) {
        $post_args['ID'] = $report_id;
        $saved_id = wp_update_post($post_args, true);
    } else {
        $saved_id = wp_insert_post($post_args, true);
    }

    if (is_wp_error($saved_id)) {
        return $saved_id;
    }

    update_post_meta($saved_id, '_blades_report_data', wp_json_encode($data));

    // 📷 Salvataggio immagini (se presenti)
    if (!empty($data['images'])) {
        foreach ($data['images'] as $img) {
            // qui:
            // - decodifica base64
            // - upload su cloud
            // - salva riferimento
        }
    }

    return [
        'success' => true,
        'reportId' => intval($saved_id),
        'localId' => $local_id ?: intval($saved_id),
        'lastModified' => current_time('mysql'),
    ];
}
