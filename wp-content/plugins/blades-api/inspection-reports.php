<?php

add_action('rest_api_init', function () {
    register_rest_route('blades/v1', '/inspection-reports', [
        'methods' => 'GET',
        'callback' => 'blades_get_inspection_reports',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('blades/v1', '/inspection-report/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => 'blades_get_inspection_report',
        'permission_callback' => '__return_true',
    ]);
});

function blades_get_inspection_reports($request) {
    $per_page = intval($request->get_param('per_page'));
    if ($per_page <= 0) {
        $per_page = 20;
    }

    $query = new WP_Query([
        'post_type' => 'points_image',
        'post_status' => 'publish',
        'posts_per_page' => $per_page,
        'orderby' => 'modified',
        'order' => 'DESC',
        'fields' => 'ids',
    ]);

    $reports = array_map('blades_build_inspection_report', $query->posts);

    return rest_ensure_response($reports);
}

function blades_get_inspection_report($request) {
    $id = intval($request['id']);
    if (!$id || get_post_type($id) !== 'points_image') {
        return new WP_Error('not_found', 'Report ispezione non trovato', ['status' => 404]);
    }

    return rest_ensure_response(blades_build_inspection_report($id));
}

function blades_build_inspection_report($post_id) {
    $meta = get_post_meta($post_id);

    return [
        'id' => intval($post_id),
        'title' => get_the_title($post_id),
        'date' => get_post_time('c', false, $post_id),
        'modified' => get_post_modified_time('c', false, $post_id),
        'lastModified' => blades_meta_value($meta, 'last_modified') ?: get_post_modified_time('c', false, $post_id),
        'uuid' => blades_meta_value($meta, 'uuid'),
        'info' => [
            'windFarm' => blades_meta_value($meta, 'wind_farm'),
            'customer' => blades_meta_value($meta, 'customer'),
            'date' => blades_meta_value($meta, 'data'),
            'windTurbine' => blades_meta_value($meta, 'wind_turbine'),
            'bladeType' => blades_parse_blade_type(blades_meta_value($meta, 'blade_type')),
            'bladeNumber' => blades_meta_value($meta, 'blade_number'),
            'inspector' => blades_meta_value($meta, 'nome'),
        ],
        'blades' => [
            'A' => blades_parse_blade_hotspots(blades_meta_value($meta, 'hotspot_content'), ''),
            'B' => blades_parse_blade_hotspots(blades_meta_value($meta, 'hotspot_content_b'), '_b'),
            'C' => blades_parse_blade_hotspots(blades_meta_value($meta, 'hotspot_content_c'), '_c'),
        ],
        'synced' => true,
    ];
}

function blades_parse_blade_hotspots($raw, $suffix) {
    if (!$raw) {
        return [];
    }

    $hotspot = maybe_unserialize($raw);
    if (!is_array($hotspot)) {
        return [];
    }

    $data_points_key = 'data_points' . $suffix;
    $data_points = isset($hotspot[$data_points_key]) && is_array($hotspot[$data_points_key])
        ? $hotspot[$data_points_key]
        : [];

    $results = [];

    foreach ($data_points as $point) {
        if (!is_array($point)) {
            continue;
        }

        $photos = blades_collect_point_photos($point, $suffix);

        $results[] = [
            'description' => blades_arr_value($point, 'content' . $suffix),
            'shortDescription' => blades_arr_value($point, 'linkpins' . $suffix),
            'priority' => blades_arr_value($point, 'placement_2' . $suffix),
            'location' => blades_arr_value($point, 'placement' . $suffix),
            'radius' => blades_arr_value($point, 'radius' . $suffix),
            'x' => blades_float_value(blades_arr_value($point, 'left' . $suffix)),
            'y' => blades_float_value(blades_arr_value($point, 'top' . $suffix)),
            'photos' => $photos,
        ];
    }

    return $results;
}

function blades_collect_point_photos($point, $suffix) {
    $photos = [];

    $first = blades_arr_value($point, 'pins_image_hover_custom' . $suffix);
    if (!empty($first)) {
        $photos[] = $first;
    }

    for ($i = 2; $i <= 5; $i++) {
        $key = 'pins_image_hover_custom_' . $i . $suffix;
        $value = blades_arr_value($point, $key);
        if (!empty($value)) {
            $photos[] = $value;
        }
    }

    return $photos;
}

function blades_parse_blade_type($value) {
    if ($value === null || $value === '') {
        return '';
    }

    if ((string) $value === '1') {
        return 'Enercon';
    }

    return (string) $value;
}

function blades_meta_value($meta, $key) {
    return isset($meta[$key][0]) ? maybe_unserialize($meta[$key][0]) : null;
}

function blades_arr_value($arr, $key) {
    return isset($arr[$key]) ? $arr[$key] : '';
}

function blades_float_value($value) {
    if ($value === null || $value === '') {
        return 0;
    }

    return floatval(str_replace(',', '.', (string) $value));
}
