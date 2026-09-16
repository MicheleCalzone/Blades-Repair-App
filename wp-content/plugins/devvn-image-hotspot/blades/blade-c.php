<?php
  /**
   * Created by PhpStorm.
   * User: mike
   * Date: 26/05/22
   * Time: 15.00
   */



  /* Blade C - define point default */
  define('DEVVN_IHOTSPOT_POINT_DEFAULT_C', serialize(array(
    'countPoint_c' => '',
    'content_c' => '',
    'left_c' => '',
    'top_c' => '',
    'linkpins_c' => '',
    'radius_c' => '',
    'link_target_c' => '',
    'placement_c' => '',
    'placement_2_c' => '',
    'pins_id_c' => '',
    'pins_class_c' => ''
  )));

  /* Blade C - define pins default */
  define('DEVVN_IHOTSPOT_PINS_DEFAULT_C', serialize(array(
    'countPoint_c' => '',
    'imgPoint_c' => '',
    'top_c' => '',
    'left_c' => ''
  )));

  /* Blade C - metabox */
  function devvn_ihotspot_meta_box_c()
  {
    //post type
    $screens = array('points_image');

    foreach ($screens as $screen) {
      // meta box Blade B
      add_meta_box(
        'devvn-ihotspot-metabox_c',
        __('Blade C', 'devvn-image-hotspot'),
        'devvn_ihotspot_meta_box_callback_c',
        $screen,
        'normal',
        'high'
      );
    }
  }
  add_action('add_meta_boxes', 'devvn_ihotspot_meta_box_c');

  /* Blade C - Editor */
  function devvn_wp_default_editor_c()
  {
    return "tinymce";
  }

  /* BLade C - CallBack */
  function devvn_ihotspot_meta_box_callback_c($post)
  {
    add_filter('wp_default_editor', 'devvn_wp_default_editor_c');
    //add none field
    wp_nonce_field('maps_points_save_meta_box_data_c', 'maps_points_meta_box_nonce_c');

    $data_post_c = get_post_meta($post->ID, 'hotspot_content_c', true);

    if (!$data_post_c) {
      $data_post_c = maybe_unserialize($post->post_content);
    }

    $blade_number_c = (isset($data_post_c['blade_number_c'])) ? $data_post_c['blade_number_c'] : '';
    $maps_images_c = (isset($data_post_c['maps_images_c'])) ? $data_post_c['maps_images_c'] : 'https://www.blades-repair.com/wp-content/uploads/2022/05/pala_report_ispezioni.jpg';
    $maps_images_enercon_c = (isset($data_post_c['maps_images_enercon_c'])) ? $data_post_c['maps_images_enercon_c'] : 'https://www.blades-repair.com/wp-content/uploads/2023/05/pala_enercon.jpg';
    $data_points_c = (isset($data_post_c['data_points_c'])) ? $data_post_c['data_points_c'] : '';
    $pins_image_c = (isset($data_post_c['pins_image_c'])) ? $data_post_c['pins_image_c'] : 'https://www.blades-repair.com/wp-content/uploads/2022/05/pins_rosso.svg';
    $pins_image_hover_c = (isset($data_post_c['pins_image_hover_c'])) ? $data_post_c['pins_image_hover_c'] : '';
    $pins_more_option_c = (isset($data_post_c['pins_more_option_c'])) ? $data_post_c['pins_more_option_c'] : array();
    $pins_more_option_c = wp_parse_args($pins_more_option_c, array(
      'position_c' => 'center_center_c',
      'custom_top_c' => 0,
      'custom_left_c' => 0,
      'custom_hover_top_c' => 0,
      'custom_hover_left_c' => 0,
      'pins_animation_c' => 'none'
    ));
    ?>

    <!-- Blade C -->
    <div class="blade-c">
      <table class="svl-table" style="display:none;">
        <tbody>

        <tr>
          <td class="svl-label"><?php _e('Pins Image', 'devvn-image-hotspot') ?></td>
          <td class="svl-input">
            <div class="svl-upload-image_c has-image">
              <div class="view-has-value">
                <input type="hidden" name="pins_image_c" class="pins_image_c" value="<?php echo $pins_image_c; ?>"/>
                <img src="<?= $pins_image_c ?>" class="image_view_c pins_img_c"/>
                <!--<img src="https://www.blades-repair.com/wp-content/uploads/2022/03/pins.svg" class="image_view pins_img"/>-->
                <!--<a href="#" class="svl-delete-image">x</a>-->
              </div>
              <div class="hidden-has-value"><input type="button" class="button-upload_c button" value="<?php _e('Select pins', 'devvn-image-hotspot') ?>"/></div>
            </div>
          </td>
        </tr>

        <tr>
          <td class="svl-label"><?php _e('Pins Hover Image', 'devvn-image-hotspot') ?></td>
          <td class="svl-input">
            <div class="svl-upload-image_c <?= ($pins_image_hover_c) ? 'has-image' : '' ?>">
              <div class="view-has-value">
                <input type="hidden" name="pins_image_hover_c" class="pins_image_hover_c" value="<?php echo $pins_image_hover_c; ?>"/>
                <img src="<?= $pins_image_hover_c ?>" class="image_view_c pins_img_hover_c"/>
                <a href="#" class="svl-delete-image_c">x</a>
              </div>
              <div class="hidden-has-value"><input type="button" class="button-upload_c button" value="<?php _e('Select pins hover', 'devvn-image-hotspot') ?>"/></div>
            </div>
          </td>
        </tr>

        <tr>
          <td class="svl-label"><?php _e('Pins Center Position', 'devvn-image-hotspot') ?></td>
          <td class="svl-input">
            <div class="pins-position-wrap">
              <p>
                <label><input type="radio" name="choose_type_c" value="center_center_c" <?= ($pins_more_option_c['position_c'] == 'center_center_c' ? 'checked="checked"' : '') ?>><?php _e('Center center', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type_c" value="top_left_c" <?= ($pins_more_option_c['position_c'] == 'top_left_c' ? 'checked="checked"' : 'checked="checked"') ?>><?php _e('Top Left', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type_c" value="top_center_c" <?= ($pins_more_option_c['position_c'] == 'top_center_c' ? 'checked="checked"' : '') ?>><?php _e('Top Center', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type_c" value="top_right_c" <?= ($pins_more_option_c['position_c'] == 'top_right_c' ? 'checked="checked"' : '') ?>><?php _e('Top Right', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type_c" value="right_center_c" <?= ($pins_more_option_c['position_c'] == 'right_center_c' ? 'checked="checked"' : '') ?>><?php _e('Right Center', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type_c" value="bottom_right_c" <?= ($pins_more_option_c['position_c'] == 'bottom_right_c' ? 'checked="checked"' : '') ?>><?php _e('Bottom Right', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type_c" value="bottom_center_c" <?= ($pins_more_option_c['position_c'] == 'bottom_center_c' ? 'checked="checked"' : '') ?>><?php _e('Bottom Center', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type_c" value="bottom_left_c" <?= ($pins_more_option_c['position_c'] == 'bottom_left_c' ? 'checked="checked"' : '') ?>><?php _e('Bottom Left', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type_c" value="left_center_c" <?= ($pins_more_option_c['position_c'] == 'left_center_c' ? 'checked="checked"' : '') ?>><?php _e('Left Center', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type_c" value="custom_center_c" <?= ($pins_more_option_c['position_c'] == 'custom_center_c' ? 'checked="checked"' : '') ?>><?php _e('Custom', 'devvn-image-hotspot') ?></label>
                <label><?php _e('Top: -', 'devvn-image-hotspot') ?> <input type="number" name="custom_top_c" value="<?= $pins_more_option_c['custom_top_c'] ?>" min="0" step="any"> px</label>
                <label><?php _e('Left: -', 'devvn-image-hotspot') ?> <input type="number" name="custom_left_c" value="<?= $pins_more_option_c['custom_left_c'] ?>" min="0" step="any"> px</label>
                <input type="hidden" name="custom_hover_top_c" value="<?= $pins_more_option_c['custom_hover_top_c'] ?>" min="0" step="any">
                <input type="hidden" name="custom_hover_left_c" value="<?= $pins_more_option_c['custom_hover_left_c'] ?>" min="0" step="any">
              </p>
            </div>
          </td>
        </tr>

        <tr>
          <td class="svl-label"><?php _e('Pins Animation', 'devvn-image-hotspot') ?></td>
          <td class="svl-input">
            <div class="pins-position-wrap">
              <p>
                <label><input type="radio" name="pins_animation_c" value="none" <?= ($pins_more_option_c['pins_animation_c'] == 'none' ? 'checked="checked"' : '') ?>><?php _e('None', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="pins_animation_c" value="pulse" <?= ($pins_more_option_c['pins_animation_c'] == 'pulse' ? 'checked="checked"' : '') ?>><?php _e('Pulse', 'devvn-image-hotspot') ?></label>
              </p>
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="box-number">
        <label class="blade-number">
          <span class="blade-number-text">Number</span>
          <input class="input" type="text" name="blade_number_c" value="<?php echo $blade_number_c ?>" placeholder="Enter the number of the blade"/>
        </label>
      </div>

      <div class="svl-image-wrap_c <?= ($maps_images_c) ? 'has-image' : 'has-image' ?>">
        <div class="svl-control">
          <input type="button" id="meta-image-button_c" class="button hidden" value="<?php _e('Upload Image', 'devvn-image-hotspot') ?>"/>
          <input type="hidden" name="maps_images_c" class="maps_images_c" id="maps_images_c" value="<?php echo $maps_images_c; ?>"/>
          <input type="hidden" name="maps_images_enercon_c" class="maps_images_c" id="maps_images_enercon_c" value="<?php echo $maps_images_enercon_c; ?>"/>
          <input type="button" name="add_point_c" class="add_point_c button view-has-value" value="<?php _e('Add Point', 'devvn-image-hotspot'); ?>"/>
          <span class="spinner"></span>
        </div>
        <div class="wrap_svl_c view-has-value" id="body_drag_c">
          <div class="images_wrap_c">
            <?php if ($maps_images_c): ?>
              <img class="maps-image-other" src="<?php echo $maps_images_c; ?>">
              <img class="maps-image-enercon hidden"  src="<?php echo $maps_images_enercon_c; ?>">
            <?php endif; ?>
          </div>
          <?php if (is_array($data_points_c)): ?>
            <?php $stt_c = 1;
            foreach ($data_points_c as $point_c): ?>
              <?php
              $data_input_c = array(
                'countPoint_c' => $stt_c,
                'imgPoint_c' => $pins_image_c,
                'top_c' => $point_c['top_c'],
                'left_c' => $point_c['left_c'],
                //'linkpins'		            =>	isset($point['linkpins'])?esc_url($point['linkpins']):'',
                'linkpins_c' => isset($point_c['linkpins_c']) ? $point_c['linkpins_c'] : '',
                'radius_c' => isset($point_c['radius_c']) ? $point_c['radius_c'] : '',
                'link_target_c' => isset($point_c['link_target_c']) ? esc_attr($point_c['link_target_c']) : '_self',
                'pins_image_custom_c' => isset($point_c['pins_image_custom_c']) ? $point_c['pins_image_custom_c'] : '',
                'pins_image_hover_custom_c' => isset($point_c['pins_image_hover_custom_c']) ? $point_c['pins_image_hover_custom_c'] : '',
                'pins_image_hover_custom_2_c' => isset($point_c['pins_image_hover_custom_2_c']) ? $point_c['pins_image_hover_custom_2_c'] : '',
                'pins_image_hover_custom_3_c' => isset($point_c['pins_image_hover_custom_3_c']) ? $point_c['pins_image_hover_custom_3_c'] : '',
                'pins_image_hover_custom_4_c' => isset($point_c['pins_image_hover_custom_4_c']) ? $point_c['pins_image_hover_custom_4_c'] : '',
                'pins_image_hover_custom_5_c' => isset($point_c['pins_image_hover_custom_5_c']) ? $point_c['pins_image_hover_custom_5_c'] : '',
                'placement_c' => isset($point_c['placement_c']) ? $point_c['placement_c'] : '',
                'placement_2_c' => isset($point_c['placement_2_c']) ? $point_c['placement_2_c'] : '',
                'pins_id_c' => isset($point_c['pins_id_c']) ? $point_c['pins_id_c'] : '',
                'pins_class_c' => isset($point_c['pins_class_c']) ? $point_c['pins_class_c'] : ''
              );
              echo devvn_ihotspot_get_pins_default_c($data_input_c); ?>
              <?php $stt_c++;endforeach; ?>
          <?php endif; ?>
        </div>
        <div class="all_points_c">
          <?php if (is_array($data_points_c)): ?>
            <?php $stt_c = 1;
            foreach ($data_points_c as $point_c): ?>
              <?php
              $data_input_c = array(
                'countPoint_c' => $stt_c,
                'content_c' => $point_c['content_c'],
                'left_c' => $point_c['left_c'],
                'top_c' => $point_c['top_c'],
                //'linkpins'		              =>	isset($point['linkpins'])?esc_url($point['linkpins']):'',
                'linkpins_c' => isset($point_c['linkpins_c']) ? $point_c['linkpins_c'] : '',
                'radius_c' => isset($point_c['radius_c']) ? $point_c['radius_c'] : '',
                'link_target_c' => isset($point_c['link_target_c']) ? esc_attr($point_c['link_target_c']) : '_self',
                'pins_image_custom_c' => isset($point_c['pins_image_custom_c']) ? $point_c['pins_image_custom_c'] : '',
                'pins_image_hover_custom_c' => isset($point_c['pins_image_hover_custom_c']) ? $point_c['pins_image_hover_custom_c'] : '',
                'pins_image_hover_custom_2_c' => isset($point_c['pins_image_hover_custom_2_c']) ? $point_c['pins_image_hover_custom_2_c'] : '',
                'pins_image_hover_custom_3_c' => isset($point_c['pins_image_hover_custom_3_c']) ? $point_c['pins_image_hover_custom_3_c'] : '',
                'pins_image_hover_custom_4_c' => isset($point_c['pins_image_hover_custom_4_c']) ? $point_c['pins_image_hover_custom_4_c'] : '',
                'pins_image_hover_custom_5_c' => isset($point_c['pins_image_hover_custom_5_c']) ? $point_c['pins_image_hover_custom_5_c'] : '',
                'placement_c' => isset($point_c['placement_c']) ? $point_c['placement_c'] : '',
                'placement_2_c' => isset($point_c['placement_2_c']) ? $point_c['placement_2_c'] : '',
                'pins_id_c' => isset($point_c['pins_id_c']) ? $point_c['pins_id_c'] : '',
                'pins_class_c' => isset($point_c['pins_class_c']) ? $point_c['pins_class_c'] : ''
              );
              echo devvn_ihotspot_get_input_point_default_c($data_input_c); ?>
              <?php $stt_c++;endforeach; ?>
          <?php else: ?>
            <div style="display: none;"><?php wp_editor('', '_devvn_ihotspot_default_content_c'); ?></div>
          <?php endif; ?>
        </div>

      </div>
    </div>

    <?php
  }

  /* BLade C - Get input info fault - modal fault */
  function devvn_ihotspot_get_input_point_default_c($data_c = array())
  {
    if (!is_array($data_c)) $data_c = array();
    $data_c = wp_parse_args($data_c, unserialize(DEVVN_IHOTSPOT_POINT_DEFAULT_C));

    $countPoint_c = isset($data_c['countPoint_c']) ? $data_c['countPoint_c'] : '';
    $pointContent_c = isset($data_c['content_c']) ? $data_c['content_c'] : '';
    $pointLeft_c = isset($data_c['left_c']) ? $data_c['left_c'] : '';
    $pointTop_c = isset($data_c['top_c']) ? $data_c['top_c'] : '';
    $pointLink_c = isset($data_c['linkpins_c']) ? $data_c['linkpins_c'] : '';
    $pointRadius_c = isset($data_c['radius_c']) ? $data_c['radius_c'] : '';
    $link_target_c = isset($data_c['link_target_c']) ? $data_c['link_target_c'] : '_self';
    $pins_image_custom_c = isset($data_c['pins_image_custom_c']) ? $data_c['pins_image_custom_c'] : '';
    $pins_image_hover_custom_c = isset($data_c['pins_image_hover_custom_c']) ? $data_c['pins_image_hover_custom_c'] : '';
    $pins_image_hover_custom_2_c = isset($data_c['pins_image_hover_custom_2_c']) ? $data_c['pins_image_hover_custom_2_c'] : '';
    $pins_image_hover_custom_3_c = isset($data_c['pins_image_hover_custom_3_c']) ? $data_c['pins_image_hover_custom_3_c'] : '';
    $pins_image_hover_custom_4_c = isset($data_c['pins_image_hover_custom_4_c']) ? $data_c['pins_image_hover_custom_4_c'] : '';
    $pins_image_hover_custom_5_c = isset($data_c['pins_image_hover_custom_5_c']) ? $data_c['pins_image_hover_custom_5_c'] : '';
    $placement_c = isset($data_c['placement_c']) ? $data_c['placement_c'] : '';
    $placement_2_c = isset($data_c['placement_2_c']) ? $data_c['placement_2_c'] : '';
    $pins_id_c = isset($data_c['pins_id_c']) ? $data_c['pins_id_c'] : '';
    $pins_class_c = isset($data_c['pins_class_c']) ? $data_c['pins_class_c'] : '';
    ob_start();
    ?>

    <div class="devvn-hotspot-popup list_points_c" tabindex="-1" role="dialog" id="info_draggable_c<?php echo $countPoint_c ?>" data-popup="info_draggable_c<?php echo $countPoint_c ?>" data-points="<?php echo $countPoint_c ?>">
      <div class="devvn-hotspot-popup-inner">
        <div class="devvn-hotspot-popup-modal-content">
          <div class="devvn-hotspot-popup-modal-header">
            <h3 class="modal-title">Info Fault Number <?php echo $countPoint_c ?></h3>
          </div>
          <div class="devvn-hotspot-popup-modal-body">
            <?php
              add_filter('wp_default_editor', 'devvn_wp_default_editor_c');
              $settings_c = array(
                'textarea_name' => 'pointdata_c[content_c][]',
                'tabindex' => 4,
                'tinymce' => array(
                  'min_height' => 200,
                  'toolbar1' => 'bold,italic,underline,bullist,numlist,link,unlink,forecolor,undo,redo,wp_more',
                ),
              );
              wp_editor($pointContent_c, 'point_content_c' . $countPoint_c, $settings_c);
            ?>
            <div class="devvn_row">

              <div class="devvn_col_3">
                <label>Short Description<br>
                  <input type="text" name="pointdata_c[linkpins_c][]" value="<?php echo $pointLink_c ?>" placeholder=""/>
                </label><br>
                <label class="hidden">Link target<br>
                  <select name="pointdata_c[link_target_c][]">
                    <option value="_self" <?php selected('_self', $link_target_c); ?>>Open curent window</option>
                    <option value="_blank" <?php selected('_blank', $link_target_c); ?>>Open new window</option>
                  </select>
                </label>
              </div>

              <div class="devvn_col_3 priority-altre">
                <label>Priority<br></label>
                <select name="pointdata_c[placement_c][]">
                  <?php
                    $allPlacement_c = array(
                      'No Damage' => 'No Damage',
                      '1 - Cosmetic' => '1 - Cosmetic',
                      '2 - Not Rilevant Damage' => '2 - Not Rilevant Damage',
                      '3 - Damage' => '3 - Damage',
                      '4 - Serious Damage' => '4 - Serious Damage',
                      '5 - Critical Damage' => '5 - Critical Damage',
                    );
                    foreach ($allPlacement_c as $k_c => $v_c) {
                      ?>
                      <option value="<?php echo $k_c; ?>" <?php selected($k_c, $placement_c) ?>><?php echo $v_c; ?></option>
                      <?php
                    } ?>
                </select>
              </div>

              <div class="devvn_col_3 priority-enercon">
                <label>Priority<br></label>
                <select name="pointdata_c[placement_2_c][]">
                  <?php
                    $allPlacement_2_c = array(
                            'No Damage' => 'No Damage',
                            '1 - Cosmetic' => '1 - Cosmetic',
                            '2 - Not Rilevant Damage' => '2 - Not Rilevant Damage',
                            '3 - Damage' => '3 - Damage',
                            '4 - Serious Damage' => '4 - Serious Damage',
                            '5 - Critical Damage' => '5 - Critical Damage',
                    );
                    foreach ($allPlacement_2_c as $k_2_c => $v_2_c) {
                      ?>
                      <option value="<?php echo $k_2_c; ?>" <?php selected($k_2_c, $placement_2_c) ?>><?php echo $v_2_c; ?></option>
                      <?php
                    } ?>
                </select>
              </div>

              <div class="devvn_col_3">
                <label>Radius<br>
                  <input type="text" name="pointdata_c[radius_c][]" value="<?php echo $pointRadius_c ?>" placeholder=""/>
                </label>
              </div>

              <div class="devvn_col_3 hidden">
                <label><?php _e('Pin Image Custom', 'devvn-image-hotspot'); ?></label>
                <div class="svl-upload-image_c <?= ($pins_image_custom_c) ? 'has-image' : '' ?>">
                  <div class="view-has-value">
                    <input type="hidden" name="pointdata_c[pins_image_custom_c][]" class="pins_image_c" value="<?php echo $pins_image_custom_c; ?>"/>
                    <img src="<?= $pins_image_custom_c ?>" class="image_view_c pins_img_c"/>
                    <a href="#" class="svl-delete-image_c">x</a>
                  </div>
                  <div class="hidden-has-value"><input type="button" class="button-upload_c button" value="<?php _e('Select pins', 'devvn-image-hotspot') ?>"/></div>
                </div>
              </div>

            </div>

            <div class="devvn_row">

              <div class="devvn_col_3">
                <label>Location of fault<br>
                  <input type="text" name="pointdata_c[pins_class_c][]" value="<?php echo $pins_class_c ?>" placeholder=""/>
                </label>
              </div>

              <div class="devvn_col_3">
                <label>Dimension (Length x Width)<br>
                  <input type="text" name="pointdata_c[pins_id_c][]" value="<?php echo $pins_id_c ?>" placeholder=""/>
                </label>
              </div>

            </div>

            <label class="title-foto">Photo</label>
            <div class="devvn_row">

              <div class="devvn_col_5">
                <div class="svl-upload-image_c <?= ($pins_image_hover_custom_c) ? 'has-image' : '' ?>">
                  <div class="view-has-value">
                    <input type="hidden" name="pointdata_c[pins_image_hover_custom_c][]" class="pins_image_hover_c" value="<?php echo $pins_image_hover_custom_c; ?>"/>
                    <img src="<?= $pins_image_hover_custom_c ?>" class="image_view_c pins_img_hover_c"/>
                    <a href="#" class="svl-delete-image_c">x</a>
                  </div>
                  <div class="hidden-has-value"><input type="button" class="button-upload_c button" value="<?php _e('Seleziona le foto del danno', 'devvn-image-hotspot') ?>"/></div>
                </div>
              </div>

              <div class="devvn_col_5">
                <div class="svl-upload-image_c <?= ($pins_image_hover_custom_2_c) ? 'has-image' : '' ?>">
                  <div class="view-has-value">
                    <input type="hidden" name="pointdata_c[pins_image_hover_custom_2_c][]" class="pins_image_hover_c" value="<?php echo $pins_image_hover_custom_2_c; ?>"/>
                    <img src="<?= $pins_image_hover_custom_2_c ?>" class="image_view_c pins_img_hover_c"/>
                    <a href="#" class="svl-delete-image_c">x</a>
                  </div>
                  <div class="hidden-has-value"><input type="button" class="button-upload_2_c button" value="<?php _e('Seleziona le foto del danno', 'devvn-image-hotspot') ?>"/></div>
                </div>
              </div>

              <div class="devvn_col_5">
                <div class="svl-upload-image_c <?= ($pins_image_hover_custom_3_c) ? 'has-image' : '' ?>">
                  <div class="view-has-value">
                    <input type="hidden" name="pointdata_c[pins_image_hover_custom_3_c][]" class="pins_image_hover_c" value="<?php echo $pins_image_hover_custom_3_c; ?>"/>
                    <img src="<?= $pins_image_hover_custom_3_c ?>" class="image_view_c pins_img_hover_c"/>
                    <a href="#" class="svl-delete-image_c">x</a>
                  </div>
                  <div class="hidden-has-value"><input type="button" class="button-upload_3_c button" value="<?php _e('Seleziona le foto del danno', 'devvn-image-hotspot') ?>"/></div>
                </div>
              </div>

              <div class="devvn_col_5">
                <div class="svl-upload-image_c <?= ($pins_image_hover_custom_4_c) ? 'has-image' : '' ?>">
                  <div class="view-has-value">
                    <input type="hidden" name="pointdata_c[pins_image_hover_custom_4_c][]" class="pins_image_hover_c" value="<?php echo $pins_image_hover_custom_4_c; ?>"/>
                    <img src="<?= $pins_image_hover_custom_4_c ?>" class="image_view_c pins_img_hover_c"/>
                    <a href="#" class="svl-delete-image_c">x</a>
                  </div>
                  <div class="hidden-has-value"><input type="button" class="button-upload_4_c button" value="<?php _e('Seleziona le foto del danno', 'devvn-image-hotspot') ?>"/></div>
                </div>
              </div>

              <div class="devvn_col_5">
                <div class="svl-upload-image_c <?= ($pins_image_hover_custom_5_c) ? 'has-image' : '' ?>">
                  <div class="view-has-value">
                    <input type="hidden" name="pointdata_c[pins_image_hover_custom_5_c][]" class="pins_image_hover_c" value="<?php echo $pins_image_hover_custom_5_c; ?>"/>
                    <img src="<?= $pins_image_hover_custom_5_c ?>" class="image_view_c pins_img_hover_c"/>
                    <a href="#" class="svl-delete-image_c">x</a>
                  </div>
                  <div class="hidden-has-value"><input type="button" class="button-upload_5_c button" value="<?php _e('Seleziona le foto del danno', 'devvn-image-hotspot') ?>"/></div>
                </div>
              </div>

            </div>


            <p>
              <input type="hidden" name="pointdata_c[top_c][]" min="0" max="100" step="any" value="<?php echo $pointTop_c ?>"/>
            </p>
            <p>
              <input type="hidden" name="pointdata_c[left_c][]" min="0" max="100" step="any" value="<?php echo $pointLeft_c ?>"/>
            </p>
          </div>

          <div class="devvn-hotspot-popup-modal-footer">
            <button type="button" class="button button-danger button-large button_delete_c"><?php _e('Delete', 'devvn-image-hotspot') ?></button>
            <button type="button" class="button button-primary button-large" data-popup-close="info_draggable_c<?php echo $countPoint_c ?>"><?php _e('Done', 'devvn-image-hotspot') ?></button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    <?php
    return ob_get_clean();
  }

  /* BLade C - Get pins info */
  function devvn_ihotspot_get_pins_default_c($datapin_c = array())
  {
    if (!is_array($datapin_c)) $datapin_c = array();
    $datapin_c = wp_parse_args($datapin_c, unserialize(DEVVN_IHOTSPOT_PINS_DEFAULT_C));
    $countPoint_c = $datapin_c['countPoint_c'];
    $imgPin_c = $datapin_c['imgPoint_c'];
    $topPin_c = $datapin_c['top_c'];
    $leftPin_c = $datapin_c['left_c'];
    $pins_image_custom_c = $datapin_c['pins_image_custom_c'];
    if ($pins_image_custom_c) $imgPin_c = $pins_image_custom_c;
    ob_start();
    ?>
    <div id="draggable_c<?php echo $countPoint_c ?>" data-points="<?php echo $countPoint_c ?>" class="drag_element_c" <?php if ($topPin_c && $leftPin_c): ?> style="top:<?php echo $topPin_c ?>%; left:<?php echo $leftPin_c ?>%;"<?php endif; ?>>
      <div class="point_style_c">
        <a href="#" class="pins_click_to_edit" data-popup-open="info_draggable_c<?php echo $countPoint_c ?>" data-target="#info_draggable_c<?php echo $countPoint_c ?>">
          <img src="<?php echo $imgPin_c ?>">
          <span class="number"><?php echo $countPoint_c ?></span>
        </a>
      </div>
    </div>
    <?php
    return ob_get_clean();
  }

  /* Blade C - Salva i meta dati */
  function devvn_ihotspot_save_meta_box_data_c($post_id)
  {

    if (!isset($_POST['maps_points_meta_box_nonce_c'])) {
      return;
    }
    if (!wp_verify_nonce($_POST['maps_points_meta_box_nonce_c'], 'maps_points_save_meta_box_data_c')) {
      return;
    }


    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
      return;
    }
    if (isset($_POST['post_type']) && 'points_image' == $_POST['post_type']) {
      if (!current_user_can('edit_page', $post_id)) {
        return;
      }
    } else {
      if (!current_user_can('edit_post', $post_id)) {
        return;
      }
    }
    if (!isset($_POST['maps_images'])) {
      return;
    }
      if (!isset($_POST['maps_images_enercon'])) {
          return;
      }

    $blade_number_c = sanitize_text_field((isset($_POST['blade_number_c'])) ? $_POST['blade_number_c'] : '');

    $my_data_c = esc_url((isset($_POST['maps_images'])) ? $_POST['maps_images'] : '');
    $my_data_enercon_c = esc_url((isset($_POST['maps_images_enercon'])) ? $_POST['maps_images_enercon'] : '');

    $dataPoints_c = array();

    /*sanitize in devvn_ihotspot_convert_array_data*/
    $pointdata_c = (isset($_POST['pointdata_c'])) ? $_POST['pointdata_c'] : '';

    $choose_type_c = sanitize_text_field((isset($_POST['choose_type_c'])) ? $_POST['choose_type_c'] : '');

    $custom_top_c = sanitize_text_field((isset($_POST['custom_top_c'])) ? $_POST['custom_top_c'] : '');
    $custom_left_c = sanitize_text_field((isset($_POST['custom_left_c'])) ? $_POST['custom_left_c'] : '');

    $custom_hover_top_c = sanitize_text_field((isset($_POST['custom_hover_top_c'])) ? $_POST['custom_hover_top_c'] : '');
    $custom_hover_left_c = sanitize_text_field((isset($_POST['custom_hover_left_c'])) ? $_POST['custom_hover_left_c'] : '');

    $pins_animation_c = sanitize_text_field((isset($_POST['pins_animation_c'])) ? $_POST['pins_animation_c'] : '');

    $pins_more_option_c = array(
      'position_c' => $choose_type_c,
      'custom_top_c' => $custom_top_c,
      'custom_left_c' => $custom_left_c,
      'custom_hover_top_c' => $custom_hover_top_c,
      'custom_hover_left_c' => $custom_hover_left_c,
      'pins_animation_c' => $pins_animation_c
    );
    if (is_array($pointdata_c)) {
      $dataPoints_c = devvn_ihotspot_convert_array_data_c($pointdata_c);
    }
    $data_post_c = array(
      'blade_number_c' => $blade_number_c,
      'maps_images_c' => $my_data_c,
      'maps_images_enercon_c' => $my_data_enercon_c,
      'pins_image_c' => sanitize_text_field((isset($_POST['pins_image_c'])) ? $_POST['pins_image_c'] : ''),
      'pins_image_hover_c' => sanitize_text_field(isset($_POST['pins_image_hover_c']) ? $_POST['pins_image_hover_c'] : ''),
      'pins_more_option_c' => $pins_more_option_c,
      'data_points_c' => $dataPoints_c
    );
    update_post_meta($post_id, 'hotspot_content_c', $data_post_c);
    /*remove_action( 'save_post', 'devvn_ihotspot_save_meta_box_data' );
    wp_update_post(array(
      'ID'			=>	$post_id,
      'post_content'	=>	maybe_serialize(wp_unslash($data_post)),
      'post_type'		=>	'points_image'
    ));
    add_action( 'save_post', 'devvn_ihotspot_save_meta_box_data' );*/
  }
  add_action('save_post', 'devvn_ihotspot_save_meta_box_data_c');

  /* Blade C - Clone Point */
  add_action('wp_ajax_devvn_ihotspot_clone_point_c', 'devvn_ihotspot_clone_point_func_c');
  function devvn_ihotspot_clone_point_func_c()
  {
    if (!wp_verify_nonce($_REQUEST['nonce'], "maps_points_save_meta_box_data_c")) {
      exit();
    }

    if (!is_user_logged_in()) {
      wp_send_json_error();
    }
    $countPoint_c = intval($_POST['countpoint_c']);
    $imgPin_c = esc_url($_POST['img_pins_c']);
    $countPoint_c = (isset($countPoint_c) && !empty($countPoint_c)) ? $countPoint_c : mt_rand();
    $datapin_c = array(
      'countPoint_c' => $countPoint_c,
      'imgPoint_c' => $imgPin_c
    );
    $data_input_c = array(
      'countPoint_c' => $countPoint_c,
    );
    wp_send_json_success(array(
      'point_pins_c' => devvn_ihotspot_get_pins_default_c($datapin_c),
      'point_data_c' => devvn_ihotspot_get_input_point_default_c($data_input_c)
    ));
    die();
  }

  /* Blade C - Convert data array */
  function devvn_ihotspot_convert_array_data_c($inputArray_c = array())
  {
    $aOutput_c = array();
    $firstKey_c = null;
    foreach ($inputArray_c as $key_c => $value_c) {
      $firstKey_c = $key_c;
      break;
    }
    $nCountKey_c = count($inputArray_c[$firstKey_c]);
    for ($i_c = 0; $i_c < $nCountKey_c; $i_c++) {
      $element_c = array();
      foreach ($inputArray_c as $key_c => $value_c) {
        $element_c[$key_c] = wp_kses_post($value_c[$i_c]);
      }
      array_push($aOutput_c, $element_c);
    }
    return $aOutput_c;
  }
/*
   * by TanND
   * https://gist.github.com/levantoan/2a66dafad7a9a3a88468170ecce0cdab
*/

