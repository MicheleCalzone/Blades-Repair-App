<?php
  /**
   * Created by PhpStorm.
   * User: mike
   * Date: 26/05/22
   * Time: 15.00
   */

  /* Blade B - define point default */
  define('DEVVN_IHOTSPOT_POINT_DEFAULT_B', serialize(array(
    'countPoint_b' => '',
    'content_b' => '',
    'left_b' => '',
    'top_b' => '',
    'linkpins_b' => '',
    'radius_b' => '',
    'link_target_b' => '',
    'placement_b' => '',
    'placement_2_b' => '',
    'pins_id_b' => '',
    'pins_class_b' => ''
  )));

  /* Blade B - define pins default */
  define('DEVVN_IHOTSPOT_PINS_DEFAULT_B', serialize(array(
    'countPoint_b' => '',
    'imgPoint_b' => '',
    'top_b' => '',
    'left_b' => ''
  )));

  /* Blade B - metabox */
  function devvn_ihotspot_meta_box_b()
  {
    //post type
    $screens = array('points_image');

    foreach ($screens as $screen) {
      // meta box Blade B
      add_meta_box(
        'devvn-ihotspot-metabox_b',
        __('Blade B', 'devvn-image-hotspot'),
        'devvn_ihotspot_meta_box_callback_b',
        $screen,
        'normal',
        'high'
      );
    }
  }
  add_action('add_meta_boxes', 'devvn_ihotspot_meta_box_b');

  /* Blade B - Editor */
  function devvn_wp_default_editor_b()
  {
    return "tinymce";
  }

  /* BLade B - CallBack */
  function devvn_ihotspot_meta_box_callback_b($post)
  {
    add_filter('wp_default_editor', 'devvn_wp_default_editor_b');
    //add none field
    wp_nonce_field('maps_points_save_meta_box_data_b', 'maps_points_meta_box_nonce_b');

    $data_post_b = get_post_meta($post->ID, 'hotspot_content_b', true);

    if (!$data_post_b) {
      $data_post_b = maybe_unserialize($post->post_content);
    }

    $blade_number_b = (isset($data_post_b['blade_number_b'])) ? $data_post_b['blade_number_b'] : '';
    $maps_images_b = (isset($data_post_b['maps_images_b'])) ? $data_post_b['maps_images_b'] : 'https://www.blades-repair.com/wp-content/uploads/2022/05/pala_report_ispezioni.jpg';
    $maps_images_enercon_b = (isset($data_post_b['maps_images_enercon_b'])) ? $data_post_b['maps_images_enercon_b'] : 'https://www.blades-repair.com/wp-content/uploads/2023/05/pala_enercon.jpg';
    $data_points_b = (isset($data_post_b['data_points_b'])) ? $data_post_b['data_points_b'] : '';
    $pins_image_b = (isset($data_post_b['pins_image_b'])) ? $data_post_b['pins_image_b'] : 'https://www.blades-repair.com/wp-content/uploads/2022/05/pins_rosso.svg';
    $pins_image_hover_b = (isset($data_post_b['pins_image_hover_b'])) ? $data_post_b['pins_image_hover_b'] : '';
    $pins_more_option_b = (isset($data_post_b['pins_more_option_b'])) ? $data_post_b['pins_more_option_b'] : array();
    $pins_more_option_b = wp_parse_args($pins_more_option_b, array(
      'position_b' => 'center_center_b',
      'custom_top_b' => 0,
      'custom_left_b' => 0,
      'custom_hover_top_b' => 0,
      'custom_hover_left_b' => 0,
      'pins_animation_b' => 'none'
    ));
    ?>

    <!-- Blade B -->
    <div class="blade-b">
      <table class="svl-table" style="display:none;">
        <tbody>

        <tr>
          <td class="svl-label"><?php _e('Pins Image', 'devvn-image-hotspot') ?></td>
          <td class="svl-input">
            <div class="svl-upload-image_b has-image">
              <div class="view-has-value">
                <input type="hidden" name="pins_image_b" class="pins_image_b" value="<?php echo $pins_image_b; ?>"/>
                <img src="<?= $pins_image_b ?>" class="image_view_b pins_img_b"/>
                <!--<img src="https://www.blades-repair.com/wp-content/uploads/2022/03/pins.svg" class="image_view pins_img"/>-->
                <!--<a href="#" class="svl-delete-image">x</a>-->
              </div>
              <div class="hidden-has-value"><input type="button" class="button-upload_b button" value="<?php _e('Select pins', 'devvn-image-hotspot') ?>"/></div>
            </div>
          </td>
        </tr>

        <tr>
          <td class="svl-label"><?php _e('Pins Hover Image', 'devvn-image-hotspot') ?></td>
          <td class="svl-input">
            <div class="svl-upload-image_b <?= ($pins_image_hover_b) ? 'has-image' : '' ?>">
              <div class="view-has-value">
                <input type="hidden" name="pins_image_hover_b" class="pins_image_hover_b" value="<?php echo $pins_image_hover_b; ?>"/>
                <img src="<?= $pins_image_hover_b ?>" class="image_view_b pins_img_hover_b"/>
                <a href="#" class="svl-delete-image_b">x</a>
              </div>
              <div class="hidden-has-value"><input type="button" class="button-upload_b button" value="<?php _e('Select pins hover', 'devvn-image-hotspot') ?>"/></div>
            </div>
          </td>
        </tr>

        <tr>
          <td class="svl-label"><?php _e('Pins Center Position', 'devvn-image-hotspot') ?></td>
          <td class="svl-input">
            <div class="pins-position-wrap">
              <p>
                <label><input type="radio" name="choose_type_b" value="center_center_b" <?= ($pins_more_option_b['position_b'] == 'center_center_b' ? 'checked="checked"' : '') ?>><?php _e('Center center', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type_b" value="top_left_b" <?= ($pins_more_option_b['position_b'] == 'top_left_b' ? 'checked="checked"' : 'checked="checked"') ?>><?php _e('Top Left', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type_b" value="top_center_b" <?= ($pins_more_option_b['position_b'] == 'top_center_b' ? 'checked="checked"' : '') ?>><?php _e('Top Center', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type_b" value="top_right_b" <?= ($pins_more_option_b['position_b'] == 'top_right_b' ? 'checked="checked"' : '') ?>><?php _e('Top Right', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type_b" value="right_center_b" <?= ($pins_more_option_b['position_b'] == 'right_center_b' ? 'checked="checked"' : '') ?>><?php _e('Right Center', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type_b" value="bottom_right_b" <?= ($pins_more_option_b['position_b'] == 'bottom_right_b' ? 'checked="checked"' : '') ?>><?php _e('Bottom Right', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type_b" value="bottom_center_b" <?= ($pins_more_option_b['position_b'] == 'bottom_center_b' ? 'checked="checked"' : '') ?>><?php _e('Bottom Center', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type_b" value="bottom_left_b" <?= ($pins_more_option_b['position_b'] == 'bottom_left_b' ? 'checked="checked"' : '') ?>><?php _e('Bottom Left', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type_b" value="left_center_b" <?= ($pins_more_option_b['position_b'] == 'left_center_b' ? 'checked="checked"' : '') ?>><?php _e('Left Center', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type_b" value="custom_center_b" <?= ($pins_more_option_b['position_b'] == 'custom_center_b' ? 'checked="checked"' : '') ?>><?php _e('Custom', 'devvn-image-hotspot') ?></label>
                <label><?php _e('Top: -', 'devvn-image-hotspot') ?> <input type="number" name="custom_top_b" value="<?= $pins_more_option_b['custom_top_b'] ?>" min="0" step="any"> px</label>
                <label><?php _e('Left: -', 'devvn-image-hotspot') ?> <input type="number" name="custom_left_b" value="<?= $pins_more_option_b['custom_left_b'] ?>" min="0" step="any"> px</label>
                <input type="hidden" name="custom_hover_top_b" value="<?= $pins_more_option_b['custom_hover_top_b'] ?>" min="0" step="any">
                <input type="hidden" name="custom_hover_left_b" value="<?= $pins_more_option_b['custom_hover_left_b'] ?>" min="0" step="any">
              </p>
            </div>
          </td>
        </tr>

        <tr>
          <td class="svl-label"><?php _e('Pins Animation', 'devvn-image-hotspot') ?></td>
          <td class="svl-input">
            <div class="pins-position-wrap">
              <p>
                <label><input type="radio" name="pins_animation_b" value="none" <?= ($pins_more_option_b['pins_animation_b'] == 'none' ? 'checked="checked"' : '') ?>><?php _e('None', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="pins_animation_b" value="pulse" <?= ($pins_more_option_b['pins_animation_b'] == 'pulse' ? 'checked="checked"' : '') ?>><?php _e('Pulse', 'devvn-image-hotspot') ?></label>
              </p>
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="box-number">
        <label class="blade-number">
          <span class="blade-number-text">Number</span>
          <input class="input" type="text" name="blade_number_b" value="<?php echo $blade_number_b ?>" placeholder="Enter the number of the blade"/>
        </label>
      </div>

      <div class="svl-image-wrap_b <?= ($maps_images_b) ? 'has-image' : 'has-image' ?>">
        <div class="svl-control">
          <input type="button" id="meta-image-button_b" class="button hidden" value="<?php _e('Upload Image', 'devvn-image-hotspot') ?>"/>
          <input type="hidden" name="maps_images_b" class="maps_images_b" id="maps_images_b" value="<?php echo $maps_images_b; ?>"/>
          <input type="hidden" name="maps_images_enercon_b" class="maps_images_b" id="maps_images_enercon_b" value="<?php echo $maps_images_enercon_b; ?>"/>
          <input type="button" name="add_point_b" class="add_point_b button view-has-value" value="<?php _e('Add Point', 'devvn-image-hotspot'); ?>"/>
          <span class="spinner"></span>
        </div>
        <div class="wrap_svl_b view-has-value" id="body_drag_b">
          <div class="images_wrap_b">
            <?php if ($maps_images_b): ?>
              <img class="maps-image-other"  src="<?php echo $maps_images_b; ?>">
              <img class="maps-image-enercon hidden"  src="<?php echo $maps_images_enercon_b; ?>">
            <?php endif; ?>
          </div>
          <?php if (is_array($data_points_b)): ?>
            <?php $stt_b = 1;
            foreach ($data_points_b as $point_b): ?>
              <?php
              $data_input_b = array(
                'countPoint_b' => $stt_b,
                'imgPoint_b' => $pins_image_b,
                'top_b' => $point_b['top_b'],
                'left_b' => $point_b['left_b'],
                //'linkpins'		            =>	isset($point['linkpins'])?esc_url($point['linkpins']):'',
                'linkpins_b' => isset($point_b['linkpins_b']) ? $point_b['linkpins_b'] : '',
                'radius_b' => isset($point_b['radius_b']) ? $point_b['radius_b'] : '',
                'link_target_b' => isset($point_b['link_target_b']) ? esc_attr($point_b['link_target_b']) : '_self',
                'pins_image_custom_b' => isset($point_b['pins_image_custom_b']) ? $point_b['pins_image_custom_b'] : '',
                'pins_image_hover_custom_b' => isset($point_b['pins_image_hover_custom_b']) ? $point_b['pins_image_hover_custom_b'] : '',
                'pins_image_hover_custom_2_b' => isset($point_b['pins_image_hover_custom_2_b']) ? $point_b['pins_image_hover_custom_2_b'] : '',
                'pins_image_hover_custom_3_b' => isset($point_b['pins_image_hover_custom_3_b']) ? $point_b['pins_image_hover_custom_3_b'] : '',
                'pins_image_hover_custom_4_b' => isset($point_b['pins_image_hover_custom_4_b']) ? $point_b['pins_image_hover_custom_4_b'] : '',
                'pins_image_hover_custom_5_b' => isset($point_b['pins_image_hover_custom_5_b']) ? $point_b['pins_image_hover_custom_5_b'] : '',
                'placement_b' => isset($point_b['placement_b']) ? $point_b['placement_b'] : '',
                'placement_2_b' => isset($point_b['placement_2_b']) ? $point_b['placement_2_b'] : '',
                'pins_id_b' => isset($point_b['pins_id_b']) ? $point_b['pins_id_b'] : '',
                'pins_class_b' => isset($point_b['pins_class_b']) ? $point_b['pins_class_b'] : ''
              );
              echo devvn_ihotspot_get_pins_default_b($data_input_b); ?>
              <?php $stt_b++;endforeach; ?>
          <?php endif; ?>
        </div>
        <div class="all_points_b">
          <?php if (is_array($data_points_b)): ?>
            <?php $stt_b = 1;
            foreach ($data_points_b as $point_b): ?>
              <?php
              $data_input_b = array(
                'countPoint_b' => $stt_b,
                'content_b' => $point_b['content_b'],
                'left_b' => $point_b['left_b'],
                'top_b' => $point_b['top_b'],
                //'linkpins'		              =>	isset($point['linkpins'])?esc_url($point['linkpins']):'',
                'linkpins_b' => isset($point_b['linkpins_b']) ? $point_b['linkpins_b'] : '',
                'radius_b' => isset($point_b['radius_b']) ? $point_b['radius_b'] : '',
                'link_target_b' => isset($point_b['link_target_b']) ? esc_attr($point_b['link_target_b']) : '_self',
                'pins_image_custom_b' => isset($point_b['pins_image_custom_b']) ? $point_b['pins_image_custom_b'] : '',
                'pins_image_hover_custom_b' => isset($point_b['pins_image_hover_custom_b']) ? $point_b['pins_image_hover_custom_b'] : '',
                'pins_image_hover_custom_2_b' => isset($point_b['pins_image_hover_custom_2_b']) ? $point_b['pins_image_hover_custom_2_b'] : '',
                'pins_image_hover_custom_3_b' => isset($point_b['pins_image_hover_custom_3_b']) ? $point_b['pins_image_hover_custom_3_b'] : '',
                'pins_image_hover_custom_4_b' => isset($point_b['pins_image_hover_custom_4_b']) ? $point_b['pins_image_hover_custom_4_b'] : '',
                'pins_image_hover_custom_5_b' => isset($point_b['pins_image_hover_custom_5_b']) ? $point_b['pins_image_hover_custom_5_b'] : '',
                'placement_b' => isset($point_b['placement_b']) ? $point_b['placement_b'] : '',
                'placement_2_b' => isset($point_b['placement_2_b']) ? $point_b['placement_2_b'] : '',
                'pins_id_b' => isset($point_b['pins_id_b']) ? $point_b['pins_id_b'] : '',
                'pins_class_b' => isset($point_b['pins_class_b']) ? $point_b['pins_class_b'] : ''
              );
              echo devvn_ihotspot_get_input_point_default_b($data_input_b); ?>
              <?php $stt_b++;endforeach; ?>
          <?php else: ?>
            <div style="display: none;"><?php wp_editor('', '_devvn_ihotspot_default_content_b'); ?></div>
          <?php endif; ?>
        </div>

      </div>
    </div>

    <?php
  }

  /* BLade B - Get input info fault - modal fault */
  function devvn_ihotspot_get_input_point_default_b($data_b = array())
  {
    if (!is_array($data_b)) $data_b = array();
    $data_b = wp_parse_args($data_b, unserialize(DEVVN_IHOTSPOT_POINT_DEFAULT_B));

    $countPoint_b = isset($data_b['countPoint_b']) ? $data_b['countPoint_b'] : '';
    $pointContent_b = isset($data_b['content_b']) ? $data_b['content_b'] : '';
    $pointLeft_b = isset($data_b['left_b']) ? $data_b['left_b'] : '';
    $pointTop_b = isset($data_b['top_b']) ? $data_b['top_b'] : '';
    $pointLink_b = isset($data_b['linkpins_b']) ? $data_b['linkpins_b'] : '';
    $pointRadius_b = isset($data_b['radius_b']) ? $data_b['radius_b'] : '';
    $link_target_b = isset($data_b['link_target_b']) ? $data_b['link_target_b'] : '_self';
    $pins_image_custom_b = isset($data_b['pins_image_custom_b']) ? $data_b['pins_image_custom_b'] : '';
    $pins_image_hover_custom_b = isset($data_b['pins_image_hover_custom_b']) ? $data_b['pins_image_hover_custom_b'] : '';
    $pins_image_hover_custom_2_b = isset($data_b['pins_image_hover_custom_2_b']) ? $data_b['pins_image_hover_custom_2_b'] : '';
    $pins_image_hover_custom_3_b = isset($data_b['pins_image_hover_custom_3_b']) ? $data_b['pins_image_hover_custom_3_b'] : '';
    $pins_image_hover_custom_4_b = isset($data_b['pins_image_hover_custom_4_b']) ? $data_b['pins_image_hover_custom_4_b'] : '';
    $pins_image_hover_custom_5_b = isset($data_b['pins_image_hover_custom_5_b']) ? $data_b['pins_image_hover_custom_5_b'] : '';
    $placement_b = isset($data_b['placement_b']) ? $data_b['placement_b'] : '';
    $placement_2_b = isset($data_b['placement_2_b']) ? $data_b['placement_2_b'] : '';
    $pins_id_b = isset($data_b['pins_id_b']) ? $data_b['pins_id_b'] : '';
    $pins_class_b = isset($data_b['pins_class_b']) ? $data_b['pins_class_b'] : '';
    ob_start();
    ?>

    <div class="devvn-hotspot-popup list_points_b" tabindex="-1" role="dialog" id="info_draggable_b<?php echo $countPoint_b ?>" data-popup="info_draggable_b<?php echo $countPoint_b ?>" data-points="<?php echo $countPoint_b ?>">
      <div class="devvn-hotspot-popup-inner">
        <div class="devvn-hotspot-popup-modal-content">
          <div class="devvn-hotspot-popup-modal-header">
            <h3 class="modal-title">Info Fault Number <?php echo $countPoint_b ?></h3>
          </div>
          <div class="devvn-hotspot-popup-modal-body">
            <?php
              add_filter('wp_default_editor', 'devvn_wp_default_editor_b');
              $settings_b = array(
                'textarea_name' => 'pointdata_b[content_b][]',
                'tabindex' => 4,
                'tinymce' => array(
                  'min_height' => 200,
                  'toolbar1' => 'bold,italic,underline,bullist,numlist,link,unlink,forecolor,undo,redo,wp_more',
                ),
              );
              wp_editor($pointContent_b, 'point_content_b' . $countPoint_b, $settings_b);
            ?>
            <div class="devvn_row">

              <div class="devvn_col_3">
                <label>Short Description<br>
                  <input type="text" name="pointdata_b[linkpins_b][]" value="<?php echo $pointLink_b ?>" placeholder="Es. Erosione Tip"/>
                </label><br>
                <label class="hidden">Link target<br>
                  <select name="pointdata_b[link_target_b][]">
                    <option value="_self" <?php selected('_self', $link_target_b); ?>>Open curent window</option>
                    <option value="_blank" <?php selected('_blank', $link_target_b); ?>>Open new window</option>
                  </select>
                </label>
              </div>

              <div class="devvn_col_3 priority-altre">
                <label>Priority<br></label>
                <select name="pointdata_b[placement_b][]">
                  <?php
                    $allPlacement_b = array(
                      'No Damage' => 'No Damage',
                      '1 - Cosmetic' => '1 - Cosmetic',
                      '2 - Not Rilevant Damage' => '2 - Not Rilevant Damage',
                      '3 - Damage' => '3 - Damage',
                      '4 - Serious Damage' => '4 - Serious Damage',
                      '5 - Critical Damage' => '5 - Critical Damage',
                    );
                    foreach ($allPlacement_b as $k_b => $v_b) {
                      ?>
                      <option value="<?php echo $k_b; ?>" <?php selected($k_b, $placement_b) ?>><?php echo $v_b; ?></option>
                      <?php
                    } ?>
                </select>
              </div>

                        <div class="devvn_col_3 priority-enercon">
                            <label>Priority<br></label>
                            <select name="pointdata_b[placement_2_b][]">
                                <?php
                                $allPlacement_2_b = array(
                                        'No Damage' => 'No Damage',
                                        '1 - Cosmetic' => '1 - Cosmetic',
                                        '2 - Not Rilevant Damage' => '2 - Not Rilevant Damage',
                                        '3 - Damage' => '3 - Damage',
                                        '4 - Serious Damage' => '4 - Serious Damage',
                                        '5 - Critical Damage' => '5 - Critical Damage',
                                );
                                foreach ($allPlacement_2_b as $k_2_b => $v_2_b) {
                                    ?>
                                    <option value="<?php echo $k_2_b; ?>" <?php selected($k_2_b, $placement_2_b) ?>><?php echo $v_2_b; ?></option>
                                    <?php
                                } ?>
                            </select>
                        </div>

              <div class="devvn_col_3">
                <label>Radius<br>
                  <input type="text" name="pointdata_b[radius_b][]" value="<?php echo $pointRadius_b ?>" placeholder=""/>
                </label>
              </div>

              <div class="devvn_col_3 hidden">
                <label><?php _e('Pin Image Custom', 'devvn-image-hotspot'); ?></label>
                <div class="svl-upload-image_b <?= ($pins_image_custom_b) ? 'has-image' : '' ?>">
                  <div class="view-has-value">
                    <input type="hidden" name="pointdata_b[pins_image_custom_b][]" class="pins_image_b" value="<?php echo $pins_image_custom_b; ?>"/>
                    <img src="<?= $pins_image_custom_b ?>" class="image_view_b pins_img_b"/>
                    <a href="#" class="svl-delete-image_b">x</a>
                  </div>
                  <div class="hidden-has-value"><input type="button" class="button-upload_b button" value="<?php _e('Select pins', 'devvn-image-hotspot') ?>"/></div>
                </div>
              </div>

            </div>

            <div class="devvn_row">

              <div class="devvn_col_3">
                <label>Location of fault<br>
                  <input type="text" name="pointdata_b[pins_class_b][]" value="<?php echo $pins_class_b ?>" placeholder=""/>
                </label>
              </div>

              <div class="devvn_col_3">
                <label>Dimension (Length x Width)<br>
                  <input type="text" name="pointdata_b[pins_id_b][]" value="<?php echo $pins_id_b ?>" placeholder=""/>
                </label>
              </div>

            </div>

            <label class="title-foto">Photo</label>
            <div class="devvn_row">

              <div class="devvn_col_5">
                <div class="svl-upload-image_b <?= ($pins_image_hover_custom_b) ? 'has-image' : '' ?>">
                  <div class="view-has-value">
                    <input type="hidden" name="pointdata_b[pins_image_hover_custom_b][]" class="pins_image_hover_b" value="<?php echo $pins_image_hover_custom_b; ?>"/>
                    <img src="<?= $pins_image_hover_custom_b ?>" class="image_view_b pins_img_hover_b"/>
                    <a href="#" class="svl-delete-image_b">x</a>
                  </div>
                  <div class="hidden-has-value"><input type="button" class="button-upload_b button" value="<?php _e('Seleziona le foto del danno', 'devvn-image-hotspot') ?>"/></div>
                </div>
              </div>

              <div class="devvn_col_5">
                <div class="svl-upload-image_b <?= ($pins_image_hover_custom_2_b) ? 'has-image' : '' ?>">
                  <div class="view-has-value">
                    <input type="hidden" name="pointdata_b[pins_image_hover_custom_2_b][]" class="pins_image_hover_b" value="<?php echo $pins_image_hover_custom_2_b; ?>"/>
                    <img src="<?= $pins_image_hover_custom_2_b ?>" class="image_view_b pins_img_hover_b"/>
                    <a href="#" class="svl-delete-image_b">x</a>
                  </div>
                  <div class="hidden-has-value"><input type="button" class="button-upload_2_b button" value="<?php _e('Seleziona le foto del danno', 'devvn-image-hotspot') ?>"/></div>
                </div>
              </div>

              <div class="devvn_col_5">
                <div class="svl-upload-image_b <?= ($pins_image_hover_custom_3_b) ? 'has-image' : '' ?>">
                  <div class="view-has-value">
                    <input type="hidden" name="pointdata_b[pins_image_hover_custom_3_b][]" class="pins_image_hover_b" value="<?php echo $pins_image_hover_custom_3_b; ?>"/>
                    <img src="<?= $pins_image_hover_custom_3_b ?>" class="image_view_b pins_img_hover_b"/>
                    <a href="#" class="svl-delete-image_b">x</a>
                  </div>
                  <div class="hidden-has-value"><input type="button" class="button-upload_3_b button" value="<?php _e('Seleziona le foto del danno', 'devvn-image-hotspot') ?>"/></div>
                </div>
              </div>

              <div class="devvn_col_5">
                <div class="svl-upload-image_b <?= ($pins_image_hover_custom_4_b) ? 'has-image' : '' ?>">
                  <div class="view-has-value">
                    <input type="hidden" name="pointdata_b[pins_image_hover_custom_4_b][]" class="pins_image_hover_b" value="<?php echo $pins_image_hover_custom_4_b; ?>"/>
                    <img src="<?= $pins_image_hover_custom_4_b ?>" class="image_view_b pins_img_hover_b"/>
                    <a href="#" class="svl-delete-image_b">x</a>
                  </div>
                  <div class="hidden-has-value"><input type="button" class="button-upload_4_b button" value="<?php _e('Seleziona le foto del danno', 'devvn-image-hotspot') ?>"/></div>
                </div>
              </div>

              <div class="devvn_col_5">
                <div class="svl-upload-image_b <?= ($pins_image_hover_custom_5_b) ? 'has-image' : '' ?>">
                  <div class="view-has-value">
                    <input type="hidden" name="pointdata_b[pins_image_hover_custom_5_b][]" class="pins_image_hover_b" value="<?php echo $pins_image_hover_custom_5_b; ?>"/>
                    <img src="<?= $pins_image_hover_custom_5_b ?>" class="image_view_b pins_img_hover_b"/>
                    <a href="#" class="svl-delete-image_b">x</a>
                  </div>
                  <div class="hidden-has-value"><input type="button" class="button-upload_5_b button" value="<?php _e('Seleziona le foto del danno', 'devvn-image-hotspot') ?>"/></div>
                </div>
              </div>

            </div>


            <p>
              <input type="hidden" name="pointdata_b[top_b][]" min="0" max="100" step="any" value="<?php echo $pointTop_b ?>"/>
            </p>
            <p>
              <input type="hidden" name="pointdata_b[left_b][]" min="0" max="100" step="any" value="<?php echo $pointLeft_b ?>"/>
            </p>
          </div>

          <div class="devvn-hotspot-popup-modal-footer">
            <button type="button" class="button button-danger button-large button_delete_b"><?php _e('Delete', 'devvn-image-hotspot') ?></button>
            <button type="button" class="button button-primary button-large" data-popup-close="info_draggable_b<?php echo $countPoint_b ?>"><?php _e('Done', 'devvn-image-hotspot') ?></button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    <?php
    return ob_get_clean();
  }

  /* BLade B - Get pins info */
  function devvn_ihotspot_get_pins_default_b($datapin_b = array())
  {
    if (!is_array($datapin_b)) $datapin_b = array();
    $datapin_b = wp_parse_args($datapin_b, unserialize(DEVVN_IHOTSPOT_PINS_DEFAULT_B));
    $countPoint_b = $datapin_b['countPoint_b'];
    $imgPin_b = $datapin_b['imgPoint_b'];
    $topPin_b = $datapin_b['top_b'];
    $leftPin_b = $datapin_b['left_b'];
    $pins_image_custom_b = $datapin_b['pins_image_custom_b'];
    if ($pins_image_custom_b) $imgPin_b = $pins_image_custom_b;
    ob_start();
    ?>
    <div id="draggable_b<?php echo $countPoint_b ?>" data-points="<?php echo $countPoint_b ?>" class="drag_element_b" <?php if ($topPin_b && $leftPin_b): ?> style="top:<?php echo $topPin_b ?>%; left:<?php echo $leftPin_b ?>%;"<?php endif; ?>>
      <div class="point_style_b">
        <a href="#" class="pins_click_to_edit" data-popup-open="info_draggable_b<?php echo $countPoint_b ?>" data-target="#info_draggable_b<?php echo $countPoint_b ?>">
          <img src="<?php echo $imgPin_b ?>">
          <span class="number"><?php echo $countPoint_b ?></span>
        </a>
      </div>
    </div>
    <?php
    return ob_get_clean();
  }

  /* Blade B - Salva i meta dati */
  function devvn_ihotspot_save_meta_box_data_b($post_id)
  {

    if (!isset($_POST['maps_points_meta_box_nonce_b'])) {
      return;
    }
    if (!wp_verify_nonce($_POST['maps_points_meta_box_nonce_b'], 'maps_points_save_meta_box_data_b')) {
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

    $blade_number_b = sanitize_text_field((isset($_POST['blade_number_b'])) ? $_POST['blade_number_b'] : '');

    $my_data_b = esc_url((isset($_POST['maps_images'])) ? $_POST['maps_images'] : '');
    $my_data_enercon_b = esc_url((isset($_POST['maps_images_enercon'])) ? $_POST['maps_images_enercon'] : '');

    $dataPoints_b = array();

    /*sanitize in devvn_ihotspot_convert_array_data*/
    $pointdata_b = (isset($_POST['pointdata_b'])) ? $_POST['pointdata_b'] : '';

    $choose_type_b = sanitize_text_field((isset($_POST['choose_type_b'])) ? $_POST['choose_type_b'] : '');

    $custom_top_b = sanitize_text_field((isset($_POST['custom_top_b'])) ? $_POST['custom_top_b'] : '');
    $custom_left_b = sanitize_text_field((isset($_POST['custom_left_b'])) ? $_POST['custom_left_b'] : '');

    $custom_hover_top_b = sanitize_text_field((isset($_POST['custom_hover_top_b'])) ? $_POST['custom_hover_top_b'] : '');
    $custom_hover_left_b = sanitize_text_field((isset($_POST['custom_hover_left_b'])) ? $_POST['custom_hover_left_b'] : '');

    $pins_animation_b = sanitize_text_field((isset($_POST['pins_animation_b'])) ? $_POST['pins_animation_b'] : '');

    $pins_more_option_b = array(
      'position_b' => $choose_type_b,
      'custom_top_b' => $custom_top_b,
      'custom_left_b' => $custom_left_b,
      'custom_hover_top_b' => $custom_hover_top_b,
      'custom_hover_left_b' => $custom_hover_left_b,
      'pins_animation_b' => $pins_animation_b
    );
    if (is_array($pointdata_b)) {
      $dataPoints_b = devvn_ihotspot_convert_array_data_b($pointdata_b);
    }
    $data_post_b = array(
      'blade_number_b' => $blade_number_b,
      'maps_images_b' => $my_data_b,
      'maps_images_enercon_b' => $my_data_enercon_b,
      'pins_image_b' => sanitize_text_field((isset($_POST['pins_image_b'])) ? $_POST['pins_image_b'] : ''),
      'pins_image_hover_b' => sanitize_text_field(isset($_POST['pins_image_hover_b']) ? $_POST['pins_image_hover_b'] : ''),
      'pins_more_option_b' => $pins_more_option_b,
      'data_points_b' => $dataPoints_b
    );
    update_post_meta($post_id, 'hotspot_content_b', $data_post_b);
    /*remove_action( 'save_post', 'devvn_ihotspot_save_meta_box_data' );
    wp_update_post(array(
      'ID'			=>	$post_id,
      'post_content'	=>	maybe_serialize(wp_unslash($data_post)),
      'post_type'		=>	'points_image'
    ));
    add_action( 'save_post', 'devvn_ihotspot_save_meta_box_data' );*/
  }
  add_action('save_post', 'devvn_ihotspot_save_meta_box_data_b');

  /* Blade B - Clone Point */
  add_action('wp_ajax_devvn_ihotspot_clone_point_b', 'devvn_ihotspot_clone_point_func_b');
  function devvn_ihotspot_clone_point_func_b()
  {
    if (!wp_verify_nonce($_REQUEST['nonce'], "maps_points_save_meta_box_data_b")) {
      exit();
    }

    if (!is_user_logged_in()) {
      wp_send_json_error();
    }
    $countPoint_b = intval($_POST['countpoint_b']);
    $imgPin_b = esc_url($_POST['img_pins_b']);
    $countPoint_b = (isset($countPoint_b) && !empty($countPoint_b)) ? $countPoint_b : mt_rand();
    $datapin_b = array(
      'countPoint_b' => $countPoint_b,
      'imgPoint_b' => $imgPin_b
    );
    $data_input_b = array(
      'countPoint_b' => $countPoint_b,
    );
    wp_send_json_success(array(
      'point_pins_b' => devvn_ihotspot_get_pins_default_b($datapin_b),
      'point_data_b' => devvn_ihotspot_get_input_point_default_b($data_input_b)
    ));
    die();
  }

  /* Blade B - Convert data array */
  function devvn_ihotspot_convert_array_data_b($inputArray_b = array())
  {
    $aOutput_b = array();
    $firstKey_b = null;
    foreach ($inputArray_b as $key_b => $value_b) {
      $firstKey_b = $key_b;
      break;
    }
    $nCountKey_b = count($inputArray_b[$firstKey_b]);
    for ($i_b = 0; $i_b < $nCountKey_b; $i_b++) {
      $element_b = array();
      foreach ($inputArray_b as $key_b => $value_b) {
        $element_b[$key_b] = wp_kses_post($value_b[$i_b]);
      }
      array_push($aOutput_b, $element_b);
    }
    return $aOutput_b;
  }
/*
   * by TanND
   * https://gist.github.com/levantoan/2a66dafad7a9a3a88468170ecce0cdab
*/

