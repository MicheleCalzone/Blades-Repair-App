<?php
add_action('rest_api_init', function () {
    register_rest_route('blades/v1', '/image', [
        'methods' => 'GET',
        'callback' => 'blades_get_image_url',
        'permission_callback' => '__return_true',
    ]);
});

function blades_get_image_url($request) {
    $id = intval($request->get_param('id'));
    if (!$id) {
        return new WP_Error('invalid_id', 'ID non valido', ['status' => 400]);
    }

    // Verifica attachment
    if (get_post_type($id) !== 'attachment') {
        return new WP_Error('not_found', 'Non è un media', ['status' => 404]);
    }

    // Path relativo (Media Cloud lo usa SEMPRE)
    $relative_path = get_post_meta($id, '_wp_attached_file', true);
    if (!$relative_path) {
        return new WP_Error('not_found', 'Path file non trovato', ['status' => 404]);
    }

    // 🔴 BASE URL DEL TUO BUCKET (UNA SOLA VOLTA)
    $bucket_base_url = 'https://mito-obj01.vhostingcloud.com/bucket-blades-repair/';

    return [
        'id'   => $id,
        'path' => $relative_path,
        'url'  => $bucket_base_url . $relative_path,
    ];
}
