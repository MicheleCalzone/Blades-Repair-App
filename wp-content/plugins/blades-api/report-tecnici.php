<?php

function blades_technical_register_post_type() {
    register_post_type('report-tecnici', [
        'labels' => [
            'name' => __('Report tecnici', 'blades-api'),
            'singular_name' => __('Report tecnico', 'blades-api'),
            'add_new_item' => __('Aggiungi report tecnico', 'blades-api'),
            'edit_item' => __('Modifica report tecnico', 'blades-api'),
        ],
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_nav_menus' => true,
        'show_in_rest' => true,
        'rest_base' => 'report-tecnici',
        'supports' => ['title'],
        'has_archive' => false,
        'rewrite' => ['slug' => 'report-tecnici'],
        'capability_type' => 'post',
    ]);

    if (function_exists('register_post_meta')) {
        $meta_keys = [
            'name', 'customer', 'windfarm', 'wtg-id-nr', 'wtg_type', 'hub_height', 'repair_completed_by',
            'service_technician', 'start_date', 'end_date', 'report_issue_date', 'uuid', 'last_modified',
            'items_of_blade_a', 'items_of_blade_b', 'items_of_blade_c',
            'editor_a', 'editor_b', 'editor_c', 'photo_a', 'photo_b', 'photo_c',
        ];

        foreach ($meta_keys as $key) {
            $is_array_key = in_array($key, ['items_of_blade_a', 'items_of_blade_b', 'items_of_blade_c', 'editor_a', 'editor_b', 'editor_c', 'photo_a', 'photo_b', 'photo_c'], true);
            register_post_meta('report-tecnici', $key, [
                'show_in_rest' => true,
                'single' => !$is_array_key,
                'type' => $is_array_key ? 'array' : 'string',
                'sanitize_callback' => function ($value) use ($is_array_key) {
                    return $is_array_key ? blades_technical_sanitize_recursive($value) : sanitize_text_field((string) $value);
                },
                'auth_callback' => function () { return true; },
            ]);
        }
    }
}
add_action('init', 'blades_technical_register_post_type', 0);

function blades_technical_sanitize_recursive($value) {
    if (is_array($value)) {
        foreach ($value as $key => $item) {
            $value[$key] = blades_technical_sanitize_recursive($item);
        }
        return $value;
    }

    if (is_object($value)) {
        foreach ($value as $key => $item) {
            $value->{$key} = blades_technical_sanitize_recursive($item);
        }
        return $value;
    }

    if (is_string($value)) {
        return sanitize_text_field($value);
    }

    return $value;
}

add_action('rest_api_init', function () {
    register_rest_route('blades/v1', '/report', [
        'methods' => 'POST',
        'callback' => 'blades_sync_report',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('blades/v1', '/inspection-report', [
        'methods' => 'POST',
        'callback' => 'blades_sync_inspection_report',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('blades/v1', '/technical-reports', [
        'methods' => 'GET',
        'callback' => 'blades_get_technical_reports',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('blades/v1', '/technical-report/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => 'blades_get_technical_report',
        'permission_callback' => '__return_true',
    ]);
});

function blades_get_technical_reports($request) {
    $per_page = max(1, intval($request->get_param('per_page')) ?: 10);
    $query = new WP_Query([
        'post_type' => 'report-tecnici',
        'post_status' => 'publish',
        'posts_per_page' => $per_page,
        'orderby' => 'modified',
        'order' => 'DESC',
        'fields' => 'ids',
    ]);

    $reports = array_map('blades_build_technical_report', $query->posts);
    return rest_ensure_response($reports);
}

function blades_get_technical_report($request) {
    $id = intval($request['id']);
    if (!$id || get_post_type($id) !== 'report-tecnici') {
        return new WP_Error('not_found', 'Report tecnico non trovato', ['status' => 404]);
    }

    return rest_ensure_response(blades_build_technical_report($id));
}

function blades_build_technical_report($post_id) {
    $meta = get_post_meta($post_id);

    $info = [
        'name' => blades_technical_meta_value($meta, 'name') ?: get_the_title($post_id),
        'customer' => blades_technical_meta_value($meta, 'customer'),
        'windfarm' => blades_technical_meta_value($meta, 'windfarm'),
        'wtgId' => blades_technical_meta_value($meta, 'wtg-id-nr'),
        'wtgType' => blades_technical_meta_value($meta, 'wtg_type'),
        'hubHeight' => blades_technical_meta_value($meta, 'hub_height'),
        'repairBy' => blades_technical_meta_value($meta, 'repair_completed_by') ?: 'Blades Repair Srl',
        'technician' => blades_technical_meta_value($meta, 'service_technician'),
        'startDate' => blades_technical_meta_value($meta, 'start_date'),
        'endDate' => blades_technical_meta_value($meta, 'end_date'),
        'reportDate' => blades_technical_meta_value($meta, 'report_issue_date'),
    ];

    return [
        'id' => intval($post_id),
        'title' => get_the_title($post_id),
        'modified' => get_post_modified_time('c', false, $post_id),
        'lastModified' => blades_technical_meta_value($meta, 'last_modified') ?: get_post_modified_time('c', false, $post_id),
        'info' => $info,
        'blades' => [
            'A' => blades_technical_parse_items(blades_technical_meta_value($meta, 'items_of_blade_a'), 'A'),
            'B' => blades_technical_parse_items(blades_technical_meta_value($meta, 'items_of_blade_b'), 'B'),
            'C' => blades_technical_parse_items(blades_technical_meta_value($meta, 'items_of_blade_c'), 'C'),
        ],
        'synced' => true,
    ];
}

function blades_technical_meta_value($meta, $key) {
    if (!isset($meta[$key][0])) {
        return null;
    }

    $value = $meta[$key][0];
    return is_string($value) ? maybe_unserialize($value) : $value;
}

function blades_technical_parse_items($items, $bladeLetter) {
    if (is_object($items)) {
        $items = get_object_vars($items);
    }

    if (!is_array($items)) {
        return [];
    }

    $list = $items;
    if (isset($items['radius']) || isset($items['position']) || isset($items['completed_task']) || isset($items['task'])) {
        $list = [$items];
    }

    $results = [];
    $photoKey = 'photo_' . strtolower($bladeLetter);
    $editorKey = 'editor_' . strtolower($bladeLetter);

    foreach ($list as $item) {
        if (!is_array($item) && !is_object($item)) {
            continue;
        }

        $itemArray = is_object($item) ? get_object_vars($item) : $item;
        $photos = $itemArray[$photoKey] ?? ($itemArray['photos'] ?? ($itemArray['photo'] ?? []));
        $photoList = is_array($photos) ? $photos : ($photos ? [$photos] : []);

        $results[] = [
            'radius' => $itemArray['radius'] ?? '',
            'position' => $itemArray['position'] ?? '',
            'task' => $itemArray['completed_task'] ?? ($itemArray['task'] ?? ''),
            'description' => $itemArray[$editorKey] ?? ($itemArray['description'] ?? ''),
            'photos' => blades_technical_collect_photos($photoList),
        ];
    }

    return $results;
}

function blades_technical_collect_photos($rawPhotos) {
    if (!is_array($rawPhotos)) {
        $rawPhotos = $rawPhotos ? [$rawPhotos] : [];
    }

    $photos = [];
    foreach ($rawPhotos as $photo) {
        if (!empty($photo) && is_string($photo)) {
            $photos[] = $photo;
        }
    }

    return $photos;
}

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
    blades_save_technical_report_meta($saved_id, $data);

    return [
        'success' => true,
        'reportId' => intval($saved_id),
        'localId' => $local_id ?: intval($saved_id),
        'lastModified' => current_time('mysql'),
    ];
}

function blades_save_technical_report_meta($post_id, $data) {
    $info = is_array($data['info'] ?? null) ? $data['info'] : [];

    $meta = [
        'name' => !empty($data['title']) ? sanitize_text_field($data['title']) : '',
        'customer' => $info['customer'] ?? '',
        'windfarm' => $info['windfarm'] ?? '',
        'wtg-id-nr' => $info['wtgId'] ?? '',
        'wtg_type' => $info['wtgType'] ?? '',
        'hub_height' => $info['hubHeight'] ?? '',
        'repair_completed_by' => $info['repairBy'] ?? 'Blades Repair Srl',
        'service_technician' => $info['technician'] ?? '',
        'start_date' => $info['startDate'] ?? '',
        'end_date' => $info['endDate'] ?? '',
        'report_issue_date' => $info['reportDate'] ?? '',
        'uuid' => $data['uuid'] ?? '',
        'last_modified' => current_time('mysql'),
    ];

    foreach ($meta as $key => $value) {
        update_post_meta($post_id, $key, $value);
    }

    foreach (['A', 'B', 'C'] as $blade) {
        blades_save_technical_blade_meta($post_id, $blade, $data['blades'][ $blade ] ?? []);
    }
}

function blades_save_technical_blade_meta($post_id, $bladeLetter, $items) {
    $list = is_array($items) ? $items : ($items ? [$items] : []);
    $normalized = [];

    foreach ($list as $item) {
        if (!is_array($item)) {
            continue;
        }

        $photoKey = 'photo_' . strtolower($bladeLetter);
        $editorKey = 'editor_' . strtolower($bladeLetter);
        $photos = $item['photos'] ?? ($item[$photoKey] ?? ($item['photo'] ?? []));
        $photoList = is_array($photos) ? $photos : [$photos];
        $normalizedPhotos = [];

        foreach ($photoList as $photo) {
            if (null === $photo || '' === $photo) {
                continue;
            }

            if (is_array($photo) && !empty($photo['url'])) {
                $converted = blades_technical_photo_to_media_id($photo['url']);
                if ($converted !== null) {
                    $normalizedPhotos[] = $converted;
                } else {
                    $normalizedPhotos[] = $photo['url'];
                }
                continue;
            }

            if (is_object($photo) && !empty($photo->url)) {
                $converted = blades_technical_photo_to_media_id($photo->url);
                if ($converted !== null) {
                    $normalizedPhotos[] = $converted;
                } else {
                    $normalizedPhotos[] = $photo->url;
                }
                continue;
            }

            $converted = blades_technical_photo_to_media_id((string) $photo);
            if ($converted !== null) {
                $normalizedPhotos[] = $converted;
            } else {
                $normalizedPhotos[] = (string) $photo;
            }
        }

        $description = $item['description'] ?? ($item[$editorKey] ?? '');
        $taskValue = $item['task'] ?? $item['completed_task'] ?? '';
        $photoValues = array_values(array_unique($normalizedPhotos));

        $normalized[] = [
            'radius' => $item['radius'] ?? '',
            'position' => $item['position'] ?? '',
            'completed_task' => $taskValue,
            'task' => $taskValue,
            'description' => $description,
            $editorKey => $description,
            'photo' => $photoValues,
            'photos' => $photoValues,
            $photoKey => $photoValues,
        ];
    }

    $metaValue = count($normalized) === 1 ? $normalized[0] : $normalized;
    update_post_meta($post_id, 'items_of_blade_' . strtolower($bladeLetter), $metaValue);
}

function blades_technical_photo_to_media_id($photo) {
    if (empty($photo)) {
        return null;
    }

    if (is_numeric($photo)) {
        return intval($photo);
    }

    if (!is_string($photo)) {
        return null;
    }

    $photo = trim($photo);
    if ($photo === '') {
        return null;
    }

    if (preg_match('/^\d+$/', $photo)) {
        return intval($photo);
    }

    if (strpos($photo, 'data:') === 0) {
        return null;
    }

    if (stripos($photo, 'http') !== 0) {
        return null;
    }

    $mediaId = attachment_url_to_postid($photo);
    return $mediaId ? intval($mediaId) : null;
}

function blades_sync_inspection_report($request) {
    $body = $request->get_json_params();

    if (!$body || empty($body['data'])) {
        return new WP_Error('invalid', 'Payload non valido', ['status' => 400]);
    }

    $local_id = !empty($body['localId']) ? intval($body['localId']) : (!empty($body['reportId']) ? intval($body['reportId']) : 0);
    $report_id = !empty($body['reportId']) ? intval($body['reportId']) : 0;
    $data = $body['data'];
    $incoming_modified = !empty($body['lastModified']) ? strtotime($body['lastModified']) : time();
    $existing_post = $report_id ? get_post($report_id) : null;
    $is_existing_report = $existing_post && $existing_post->post_type === 'points_image';

    if ($is_existing_report) {
        $server_modified = strtotime(get_post_modified_time('c', false, $report_id));
        if ($server_modified && $incoming_modified < $server_modified) {
            return [
                'success' => false,
                'conflict' => true,
                'message' => 'Versione server più recente',
            ];
        }
    }

    $post_args = [
        'post_type' => 'points_image',
        'post_title' => !empty($data['title']) ? sanitize_text_field($data['title']) : 'Report ispezioni',
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

    update_post_meta($saved_id, 'wind_farm', $data['info']['windFarm'] ?? '');
    update_post_meta($saved_id, 'customer', $data['info']['customer'] ?? '');
    update_post_meta($saved_id, 'data', $data['info']['date'] ?? '');
    update_post_meta($saved_id, 'wind_turbine', $data['info']['windTurbine'] ?? '');
    update_post_meta($saved_id, 'blade_type', $data['info']['bladeType'] ?? '');
    update_post_meta($saved_id, 'blade_number', $data['info']['bladeNumber'] ?? '');
    update_post_meta($saved_id, 'nome', $data['info']['inspector'] ?? '');
    update_post_meta($saved_id, 'last_modified', current_time('mysql'));
    update_post_meta($saved_id, 'uuid', $data['uuid'] ?? '');
    blades_save_inspection_hotspots($saved_id, $data['blades']['A'] ?? [], '');
    blades_save_inspection_hotspots($saved_id, $data['blades']['B'] ?? [], '_b');
    blades_save_inspection_hotspots($saved_id, $data['blades']['C'] ?? [], '_c');

    return [
        'success' => true,
        'reportId' => intval($saved_id),
        'localId' => $local_id ?: intval($saved_id),
        'lastModified' => current_time('mysql'),
    ];
}

function blades_save_inspection_hotspots($post_id, $blades, $suffix) {
    $payload = [];

    foreach ((array) $blades as $blade) {
        if (!is_array($blade)) {
            continue;
        }

        $photos = array_values(array_filter((array) ($blade['photos'] ?? []), 'strlen'));

        $payload[] = [
            'content' . $suffix => $blade['description'] ?? '',
            'left' . $suffix => isset($blade['x']) ? (float) $blade['x'] : 0,
            'top' . $suffix => isset($blade['y']) ? (float) $blade['y'] : 0,
            'linkpins' . $suffix => $blade['shortDescription'] ?? '',
            'radius' . $suffix => $blade['radius'] ?? '',
            'placement' . $suffix => $blade['location'] ?? '',
            'placement_2' . $suffix => $blade['priority'] ?? '',
            'pins_image_custom' . $suffix => '',
            'pins_image_hover_custom' . $suffix => $photos[0] ?? '',
            'pins_image_hover_custom_2' . $suffix => $photos[1] ?? '',
            'pins_image_hover_custom_3' . $suffix => $photos[2] ?? '',
            'pins_image_hover_custom_4' . $suffix => $photos[3] ?? '',
            'pins_image_hover_custom_5' . $suffix => $photos[4] ?? '',
            'pins_id' . $suffix => '',
            'pins_class' . $suffix => '',
        ];
    }

    $root_key = 'hotspot_content' . $suffix;
    $data_key = 'data_points' . $suffix;
    $pins_key = 'pins_image' . $suffix;
    $pins_hover_key = 'pins_image_hover' . $suffix;
    $maps_key = 'maps_images' . $suffix;
    $maps_enercon_key = 'maps_images_enercon' . $suffix;
    $pins_more_key = 'pins_more_option' . $suffix;

    $root_data = [
        'blade_number' . $suffix => '',
        'maps_images' . $suffix => 'https://www.blades-repair.com/wp-content/uploads/2022/05/pala_report_ispezioni.jpg',
        'maps_images_enercon' . $suffix => 'https://www.blades-repair.com/wp-content/uploads/2023/05/pala_enercon.jpg',
        'pins_image' . $suffix => 'https://www.blades-repair.com/wp-content/uploads/2022/05/pins_rosso.svg',
        'pins_image_hover' . $suffix => '',
        'pins_more_option' . $suffix => [
            'position' . $suffix => 'center_center',
            'custom_top' . $suffix => 0,
            'custom_left' . $suffix => 0,
            'custom_hover_top' . $suffix => 0,
            'custom_hover_left' . $suffix => 0,
            'pins_animation' . $suffix => 'none',
        ],
        'data_points' . $suffix => $payload,
    ];

    update_post_meta($post_id, $root_key, $root_data);
    update_post_meta($post_id, $data_key, $payload);
    update_post_meta($post_id, $pins_key, 'https://www.blades-repair.com/wp-content/uploads/2022/05/pins_rosso.svg');
    update_post_meta($post_id, $pins_hover_key, '');
    update_post_meta($post_id, $maps_key, 'https://www.blades-repair.com/wp-content/uploads/2022/05/pala_report_ispezioni.jpg');
    update_post_meta($post_id, $maps_enercon_key, 'https://www.blades-repair.com/wp-content/uploads/2023/05/pala_enercon.jpg');
    update_post_meta($post_id, $pins_more_key, [
        'position' . $suffix => 'center_center',
        'custom_top' . $suffix => 0,
        'custom_left' . $suffix => 0,
        'custom_hover_top' . $suffix => 0,
        'custom_hover_left' . $suffix => 0,
        'pins_animation' . $suffix => 'none',
    ]);
}
