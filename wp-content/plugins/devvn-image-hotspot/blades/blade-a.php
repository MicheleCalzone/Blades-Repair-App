<?php
  /**
   * Created by PhpStorm.
   * User: mike
   * Date: 26/05/22
   * Time: 15.00
   */

  /* Blade A - define point default */
  define('DEVVN_IHOTSPOT_POINT_DEFAULT', serialize(array(
    'countPoint' => '',
    'content' => '',
    'left' => '',
    'top' => '',
    'linkpins' => '',
    'radius' => '',
    'link_target' => '',
    'placement' => '',
    'placement_2' => '',
    'pins_id' => '',
    'pins_class' => ''
  )));

  /* Blade A - define pins default */
  define('DEVVN_IHOTSPOT_PINS_DEFAULT', serialize(array(
    'countPoint' => '',
    'imgPoint' => '',
    'top' => '',
    'left' => ''
  )));

  /* Blade A - metabox */
  function devvn_ihotspot_meta_box()
  {
    //post type
    $screens = array('points_image');

    foreach ($screens as $screen) {
      // meta box Blade A
      add_meta_box(
        'devvn-ihotspot-metabox',
        __('Blade A', 'devvn-image-hotspot'),
        'devvn_ihotspot_meta_box_callback',
        $screen,
        'normal',
        'high'
      );

      // Schortcode Blade A
      add_meta_box(
        'devvn-ihotspot-shortcode',
        __('Image Hotspot Shortcode', 'devvn-image-hotspot'),
        'devvn_ihotspot_shortcode_callback',
        $screen,
        'side',
        'high'
      );
    }
  }
  add_action('add_meta_boxes', 'devvn_ihotspot_meta_box');

  /* Blade A - Editor */
  function devvn_wp_default_editor()
  {
    return "tinymce";
  }

  /* BLade A - CallBack */
  function devvn_ihotspot_meta_box_callback($post)
  {
    add_filter('wp_default_editor', 'devvn_wp_default_editor');
    //add none field
    wp_nonce_field('maps_points_save_meta_box_data', 'maps_points_meta_box_nonce');

    $data_post = get_post_meta($post->ID, 'hotspot_content', true);

    if (!$data_post) {
      $data_post = maybe_unserialize($post->post_content);
    }

    $blade_number = (isset($data_post['blade_number'])) ? $data_post['blade_number'] : '';
    $maps_images = (isset($data_post['maps_images'])) ? $data_post['maps_images'] : 'https://www.blades-repair.com/wp-content/uploads/2022/05/pala_report_ispezioni.jpg';
    $maps_images_enercon = (isset($data_post['maps_images_enercon'])) ? $data_post['maps_images_enercon'] : 'https://www.blades-repair.com/wp-content/uploads/2023/05/pala_enercon.jpg';
    $data_points = (isset($data_post['data_points'])) ? $data_post['data_points'] : '';
    $pins_image = (isset($data_post['pins_image'])) ? $data_post['pins_image'] : 'https://www.blades-repair.com/wp-content/uploads/2022/05/pins_rosso.svg';
    $pins_image_hover = (isset($data_post['pins_image_hover'])) ? $data_post['pins_image_hover'] : '';
    $pins_more_option = (isset($data_post['pins_more_option'])) ? $data_post['pins_more_option'] : array();
    $pins_more_option = wp_parse_args($pins_more_option, array(
      'position' => 'center_center',
      'custom_top' => 0,
      'custom_left' => 0,
      'custom_hover_top' => 0,
      'custom_hover_left' => 0,
      'pins_animation' => 'none'
    ));
    ?>

    <!-- Blade A -->
    <div class="blade-a">
      <table class="svl-table" style="display:none;">
        <tbody>

        <tr>
          <td class="svl-label"><?php _e('Pins Image', 'devvn-image-hotspot') ?></td>
          <td class="svl-input">
            <div class="svl-upload-image has-image">
              <div class="view-has-value">
                <input type="hidden" name="pins_image" class="pins_image" value="<?php echo $pins_image; ?>"/>
                <img src="<?= $pins_image ?>" class="image_view pins_img"/>
                <!--<img src="https://www.blades-repair.com/wp-content/uploads/2022/03/pins.svg" class="image_view pins_img"/>-->
                <!--<a href="#" class="svl-delete-image">x</a>-->
              </div>
              <div class="hidden-has-value"><input type="button" class="button-upload button" value="<?php _e('Select pins', 'devvn-image-hotspot') ?>"/></div>
            </div>
          </td>
        </tr>

        <tr>
          <td class="svl-label"><?php _e('Pins Hover Image', 'devvn-image-hotspot') ?></td>
          <td class="svl-input">
            <div class="svl-upload-image <?= ($pins_image_hover) ? 'has-image' : '' ?>">
              <div class="view-has-value">
                <input type="hidden" name="pins_image_hover" class="pins_image_hover" value="<?php echo $pins_image_hover; ?>"/>
                <img src="<?= $pins_image_hover ?>" class="image_view pins_img_hover"/>
                <a href="#" class="svl-delete-image">x</a>
              </div>
              <div class="hidden-has-value"><input type="button" class="button-upload button" value="<?php _e('Select pins hover', 'devvn-image-hotspot') ?>"/></div>
            </div>
          </td>
        </tr>

        <tr>
          <td class="svl-label"><?php _e('Pins Center Position', 'devvn-image-hotspot') ?></td>
          <td class="svl-input">
            <div class="pins-position-wrap">
              <p>
                <label><input type="radio" name="choose_type" value="center_center" <?= ($pins_more_option['position'] == 'center_center' ? 'checked="checked"' : '') ?>><?php _e('Center center', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type" value="top_left" <?= ($pins_more_option['position'] == 'top_left' ? 'checked="checked"' : 'checked="checked"') ?>><?php _e('Top Left', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type" value="top_center" <?= ($pins_more_option['position'] == 'top_center' ? 'checked="checked"' : '') ?>><?php _e('Top Center', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type" value="top_right" <?= ($pins_more_option['position'] == 'top_right' ? 'checked="checked"' : '') ?>><?php _e('Top Right', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type" value="right_center" <?= ($pins_more_option['position'] == 'right_center' ? 'checked="checked"' : '') ?>><?php _e('Right Center', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type" value="bottom_right" <?= ($pins_more_option['position'] == 'bottom_right' ? 'checked="checked"' : '') ?>><?php _e('Bottom Right', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type" value="bottom_center" <?= ($pins_more_option['position'] == 'bottom_center' ? 'checked="checked"' : '') ?>><?php _e('Bottom Center', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type" value="bottom_left" <?= ($pins_more_option['position'] == 'bottom_left' ? 'checked="checked"' : '') ?>><?php _e('Bottom Left', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type" value="left_center" <?= ($pins_more_option['position'] == 'left_center' ? 'checked="checked"' : '') ?>><?php _e('Left Center', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="choose_type" value="custom_center" <?= ($pins_more_option['position'] == 'custom_center' ? 'checked="checked"' : '') ?>><?php _e('Custom', 'devvn-image-hotspot') ?></label>
                <label><?php _e('Top: -', 'devvn-image-hotspot') ?> <input type="number" name="custom_top" value="<?= $pins_more_option['custom_top'] ?>" min="0" step="any"> px</label>
                <label><?php _e('Left: -', 'devvn-image-hotspot') ?> <input type="number" name="custom_left" value="<?= $pins_more_option['custom_left'] ?>" min="0" step="any"> px</label>
                <input type="hidden" name="custom_hover_top" value="<?= $pins_more_option['custom_hover_top'] ?>" min="0" step="any">
                <input type="hidden" name="custom_hover_left" value="<?= $pins_more_option['custom_hover_left'] ?>" min="0" step="any">
              </p>
            </div>
          </td>
        </tr>

        <tr>
          <td class="svl-label"><?php _e('Pins Animation', 'devvn-image-hotspot') ?></td>
          <td class="svl-input">
            <div class="pins-position-wrap">
              <p>
                <label><input type="radio" name="pins_animation" value="none" <?= ($pins_more_option['pins_animation'] == 'none' ? 'checked="checked"' : '') ?>><?php _e('None', 'devvn-image-hotspot') ?></label>
                <label><input type="radio" name="pins_animation" value="pulse" <?= ($pins_more_option['pins_animation'] == 'pulse' ? 'checked="checked"' : '') ?>><?php _e('Pulse', 'devvn-image-hotspot') ?></label>
              </p>
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="box-number">
        <label class="blade-number">
          <span class="blade-number-text">Number</span>
          <input class="input" type="text" name="blade_number" value="<?php echo $blade_number ?>" placeholder="Enter the number of the blade"/>
        </label>
      </div>

      <div class="svl-image-wrap <?= ($maps_images) ? 'has-image' : 'has-image' ?>">
        <div class="svl-control">
          <input type="button" id="meta-image-button" class="button hidden" value="<?php _e('Upload Image', 'devvn-image-hotspot') ?>"/>
          <input type="hidden" name="maps_images" class="maps_images" id="maps_images" value="<?php echo $maps_images; ?>"/>
          <input type="hidden" name="maps_images_enercon" class="maps_images" id="maps_images_enercon" value="<?php echo $maps_images_enercon; ?>"/>
          <input type="button" name="add_point" class="add_point button view-has-value" value="<?php _e('Add Point', 'devvn-image-hotspot'); ?>"/>
          <span class="spinner"></span>
        </div>



          <div class="wrap_svl view-has-value" id="body_drag">
          <div class="images_wrap">
            <?php if ($maps_images): ?>
              <img class="maps-image-other" src="<?php echo $maps_images; ?>">
              <img class="maps-image-enercon hidden" src="<?php echo $maps_images_enercon; ?>">
            <?php endif; ?>
          </div>
          <?php if (is_array($data_points)): ?>
            <?php $stt = 1;
            foreach ($data_points as $point): ?>
              <?php
              $data_input = array(
                'countPoint' => $stt,
                'imgPoint' => $pins_image,
                'top' => $point['top'],
                'left' => $point['left'],
                //'linkpins'		            =>	isset($point['linkpins'])?esc_url($point['linkpins']):'',
                'linkpins' => isset($point['linkpins']) ? $point['linkpins'] : '',
                'radius' => isset($point['radius']) ? $point['radius'] : '',
                'link_target' => isset($point['link_target']) ? esc_attr($point['link_target']) : '_self',
                'pins_image_custom' => isset($point['pins_image_custom']) ? $point['pins_image_custom'] : '',
                'pins_image_hover_custom' => isset($point['pins_image_hover_custom']) ? $point['pins_image_hover_custom'] : '',
                'pins_image_hover_custom_2' => isset($point['pins_image_hover_custom_2']) ? $point['pins_image_hover_custom_2'] : '',
                'pins_image_hover_custom_3' => isset($point['pins_image_hover_custom_3']) ? $point['pins_image_hover_custom_3'] : '',
                'pins_image_hover_custom_4' => isset($point['pins_image_hover_custom_4']) ? $point['pins_image_hover_custom_4'] : '',
                'pins_image_hover_custom_5' => isset($point['pins_image_hover_custom_5']) ? $point['pins_image_hover_custom_5'] : '',
                'placement' => isset($point['placement']) ? $point['placement'] : '',
                'placement_2' => isset($point['placement_2']) ? $point['placement_2'] : '',
                'pins_id' => isset($point['pins_id']) ? $point['pins_id'] : '',
                'pins_class' => isset($point['pins_class']) ? $point['pins_class'] : ''
              );
              echo devvn_ihotspot_get_pins_default($data_input); ?>
              <?php $stt++;endforeach; ?>
          <?php endif; ?>
        </div>
          <div class="all_points">
          <?php if (is_array($data_points)): ?>
            <?php $stt = 1;
            foreach ($data_points as $point): ?>
              <?php
              $data_input = array(
                'countPoint' => $stt,
                'content' => $point['content'],
                'left' => $point['left'],
                'top' => $point['top'],
                //'linkpins'		              =>	isset($point['linkpins'])?esc_url($point['linkpins']):'',
                'linkpins' => isset($point['linkpins']) ? $point['linkpins'] : '',
                'radius' => isset($point['radius']) ? $point['radius'] : '',
                'link_target' => isset($point['link_target']) ? esc_attr($point['link_target']) : '_self',
                'pins_image_custom' => isset($point['pins_image_custom']) ? $point['pins_image_custom'] : '',
                'pins_image_hover_custom' => isset($point['pins_image_hover_custom']) ? $point['pins_image_hover_custom'] : '',
                'pins_image_hover_custom_2' => isset($point['pins_image_hover_custom_2']) ? $point['pins_image_hover_custom_2'] : '',
                'pins_image_hover_custom_3' => isset($point['pins_image_hover_custom_3']) ? $point['pins_image_hover_custom_3'] : '',
                'pins_image_hover_custom_4' => isset($point['pins_image_hover_custom_4']) ? $point['pins_image_hover_custom_4'] : '',
                'pins_image_hover_custom_5' => isset($point['pins_image_hover_custom_5']) ? $point['pins_image_hover_custom_5'] : '',
                'placement' => isset($point['placement']) ? $point['placement'] : '',
                'placement_2' => isset($point['placement_2']) ? $point['placement_2'] : '',
                'pins_id' => isset($point['pins_id']) ? $point['pins_id'] : '',
                'pins_class' => isset($point['pins_class']) ? $point['pins_class'] : ''
              );
              echo devvn_ihotspot_get_input_point_default($data_input); ?>
              <?php $stt++;endforeach; ?>
          <?php else: ?>
            <div style="display: none;"><?php wp_editor('', '_devvn_ihotspot_default_content'); ?></div>
          <?php endif; ?>
        </div>



      </div>
    </div>

    <?php
  }

  /* BLade A - Get input info fault - modal fault */
  function devvn_ihotspot_get_input_point_default($data = array())
  {
    if (!is_array($data)) $data = array();
    $data = wp_parse_args($data, unserialize(DEVVN_IHOTSPOT_POINT_DEFAULT));

    $countPoint = isset($data['countPoint']) ? $data['countPoint'] : '';
    $pointContent = isset($data['content']) ? $data['content'] : '';
    $pointLeft = isset($data['left']) ? $data['left'] : '';
    $pointTop = isset($data['top']) ? $data['top'] : '';
    $pointLink = isset($data['linkpins']) ? $data['linkpins'] : '';
    $pointRadius = isset($data['radius']) ? $data['radius'] : '';
    $link_target = isset($data['link_target']) ? $data['link_target'] : '_self';
    $pins_image_custom = isset($data['pins_image_custom']) ? $data['pins_image_custom'] : '';
    $pins_image_hover_custom = isset($data['pins_image_hover_custom']) ? $data['pins_image_hover_custom'] : '';
    $pins_image_hover_custom_2 = isset($data['pins_image_hover_custom_2']) ? $data['pins_image_hover_custom_2'] : '';
    $pins_image_hover_custom_3 = isset($data['pins_image_hover_custom_3']) ? $data['pins_image_hover_custom_3'] : '';
    $pins_image_hover_custom_4 = isset($data['pins_image_hover_custom_4']) ? $data['pins_image_hover_custom_4'] : '';
    $pins_image_hover_custom_5 = isset($data['pins_image_hover_custom_5']) ? $data['pins_image_hover_custom_5'] : '';
    $placement = isset($data['placement']) ? $data['placement'] : '';
    $placement_2 = isset($data['placement_2']) ? $data['placement_2'] : '';
    $pins_id = isset($data['pins_id']) ? $data['pins_id'] : '';
    $pins_class = isset($data['pins_class']) ? $data['pins_class'] : '';
    ob_start();
    ?>

    <div class="devvn-hotspot-popup list_points" tabindex="-1" role="dialog" id="info_draggable<?php echo $countPoint ?>" data-popup="info_draggable<?php echo $countPoint ?>" data-points="<?php echo $countPoint ?>">
      <div class="devvn-hotspot-popup-inner">
        <div class="devvn-hotspot-popup-modal-content">
          <div class="devvn-hotspot-popup-modal-header">
            <h3 class="modal-title">Info Fault Number <?php echo $countPoint ?></h3>
          </div>
          <div class="devvn-hotspot-popup-modal-body">
            <?php
              add_filter('wp_default_editor', 'devvn_wp_default_editor');
              $settings = array(
                'textarea_name' => 'pointdata[content][]',
                'tabindex' => 4,
                'tinymce' => array(
                  'min_height' => 200,
                  'toolbar1' => 'bold,italic,underline,bullist,numlist,link,unlink,forecolor,undo,redo,wp_more',
                ),
              );
              wp_editor($pointContent, 'point_content' . $countPoint, $settings);
            ?>
            <div class="devvn_row">

              <div class="devvn_col_3">
                <label>Short Description<br>
                  <input type="text" name="pointdata[linkpins][]" value="<?php echo $pointLink ?>" placeholder=""/>
                </label><br>
                <label class="hidden">Link target<br>
                  <select name="pointdata[link_target][]">
                    <option value="_self" <?php selected('_self', $link_target); ?>>Open curent window</option>
                    <option value="_blank" <?php selected('_blank', $link_target); ?>>Open new window</option>
                  </select>
                </label>
              </div>

              <div class="devvn_col_3 priority-altre">
                <label>Priority<br></label>
                <select name="pointdata[placement][]">
                  <?php
                    $allPlacement = array(
                      'No Damage' => 'No Damage',
                      '1 - Cosmetic' => '1 - Cosmetic',
                      '2 - Not Rilevant Damage' => '2 - Not Rilevant Damage',
                      '3 - Damage' => '3 - Damage',
                      '4 - Serious Damage' => '4 - Serious Damage',
                      '5 - Critical Damage' => '5 - Critical Damage',
                    );
                    foreach ($allPlacement as $k => $v) {
                      ?>
                      <option value="<?php echo $k; ?>" <?php selected($k, $placement) ?>><?php echo $v; ?></option>
                      <?php
                    } ?>
                </select>
              </div>

              <div class="devvn_col_3 priority-enercon">
                <label>Priority<br></label>
                <select name="pointdata[placement_2][]">
                  <?php
                    $allPlacement_2 = array(
                      'No Damage' => 'No Damage',
                      '1 - Cosmetic' => '1 - Cosmetic',
                      '2 - Not Rilevant Damage' => '2 - Not Rilevant Damage',
                      '3 - Damage' => '3 - Damage',
                      '4 - Serious Damage' => '4 - Serious Damage',
                      '5 - Critical Damage' => '5 - Critical Damage',
                    );
                    foreach ($allPlacement_2 as $k_2 => $v_2) {
                      ?>
                      <option value="<?php echo $k_2; ?>" <?php selected($k_2, $placement_2) ?>><?php echo $v_2; ?></option>
                      <?php
                    } ?>
                </select>
              </div>

              <div class="devvn_col_3">
                <label>Radius<br>
                  <input type="text" name="pointdata[radius][]" value="<?php echo $pointRadius ?>" placeholder=""/>
                </label>
              </div>

              <div class="devvn_col_3 hidden">
                <label><?php _e('Pin Image Custom', 'devvn-image-hotspot'); ?></label>
                <div class="svl-upload-image <?= ($pins_image_custom) ? 'has-image' : '' ?>">
                  <div class="view-has-value">
                    <input type="hidden" name="pointdata[pins_image_custom][]" class="pins_image" value="<?php echo $pins_image_custom; ?>"/>
                    <img src="<?= $pins_image_custom ?>" class="image_view pins_img"/>
                    <a href="#" class="svl-delete-image">x</a>
                  </div>
                  <div class="hidden-has-value"><input type="button" class="button-upload button" value="<?php _e('Select pins', 'devvn-image-hotspot') ?>"/></div>
                </div>
              </div>

            </div>

            <div class="devvn_row">

              <div class="devvn_col_3">
                <label>Location of fault<br>
                  <input type="text" name="pointdata[pins_class][]" value="<?php echo $pins_class ?>" placeholder=""/>
                </label>
              </div>

              <div class="devvn_col_3">
                <label>Dimension (Length x Width)<br>
                  <input type="text" name="pointdata[pins_id][]" value="<?php echo $pins_id ?>" placeholder=""/>
                </label>
              </div>

            </div>

            <label class="title-foto">Photo</label>

            <div class="devvn_row">
              <div class="devvn_col_5">
                <div class="svl-upload-image <?= ($pins_image_hover_custom) ? 'has-image' : '' ?>">
                  <div class="view-has-value">
                    <input type="hidden" name="pointdata[pins_image_hover_custom][]" class="pins_image_hover" value="<?php echo $pins_image_hover_custom; ?>"/>
                    <img src="<?= $pins_image_hover_custom ?>" class="image_view pins_img_hover"/>
                    <a href="#" class="svl-delete-image">x</a>
                  </div>
                  <div class="hidden-has-value"><input type="button" class="button-upload button" value="<?php _e('Seleziona le foto del danno', 'devvn-image-hotspot') ?>"/></div>
                </div>
              </div>

              <div class="devvn_col_5">
                <div class="svl-upload-image <?= ($pins_image_hover_custom_2) ? 'has-image' : '' ?>">
                  <div class="view-has-value">
                    <input type="hidden" name="pointdata[pins_image_hover_custom_2][]" class="pins_image_hover" value="<?php echo $pins_image_hover_custom_2; ?>"/>
                    <img src="<?= $pins_image_hover_custom_2 ?>" class="image_view pins_img_hover"/>
                    <a href="#" class="svl-delete-image">x</a>
                  </div>
                  <div class="hidden-has-value"><input type="button" class="button-upload_2 button" value="<?php _e('Seleziona le foto del danno', 'devvn-image-hotspot') ?>"/></div>
                </div>
              </div>

              <div class="devvn_col_5">
                <div class="svl-upload-image <?= ($pins_image_hover_custom_3) ? 'has-image' : '' ?>">
                  <div class="view-has-value">
                    <input type="hidden" name="pointdata[pins_image_hover_custom_3][]" class="pins_image_hover" value="<?php echo $pins_image_hover_custom_3; ?>"/>
                    <img src="<?= $pins_image_hover_custom_3 ?>" class="image_view pins_img_hover"/>
                    <a href="#" class="svl-delete-image">x</a>
                  </div>
                  <div class="hidden-has-value"><input type="button" class="button-upload_3 button" value="<?php _e('Seleziona le foto del danno', 'devvn-image-hotspot') ?>"/></div>
                </div>
              </div>

              <div class="devvn_col_5">
                <div class="svl-upload-image <?= ($pins_image_hover_custom_4) ? 'has-image' : '' ?>">
                  <div class="view-has-value">
                    <input type="hidden" name="pointdata[pins_image_hover_custom_4][]" class="pins_image_hover" value="<?php echo $pins_image_hover_custom_4; ?>"/>
                    <img src="<?= $pins_image_hover_custom_4 ?>" class="image_view pins_img_hover"/>
                    <a href="#" class="svl-delete-image">x</a>
                  </div>
                  <div class="hidden-has-value"><input type="button" class="button-upload_4 button" value="<?php _e('Seleziona le foto del danno', 'devvn-image-hotspot') ?>"/></div>
                </div>
              </div>

              <div class="devvn_col_5">
                <div class="svl-upload-image <?= ($pins_image_hover_custom_5) ? 'has-image' : '' ?>">
                  <div class="view-has-value">
                    <input type="hidden" name="pointdata[pins_image_hover_custom_5][]" class="pins_image_hover" value="<?php echo $pins_image_hover_custom_5; ?>"/>
                    <img src="<?= $pins_image_hover_custom_5 ?>" class="image_view pins_img_hover"/>
                    <a href="#" class="svl-delete-image">x</a>
                  </div>
                  <div class="hidden-has-value"><input type="button" class="button-upload_5 button" value="<?php _e('Seleziona le foto del danno', 'devvn-image-hotspot') ?>"/></div>
                </div>
              </div>

            </div>


            <p>
              <input type="hidden" name="pointdata[top][]" min="0" max="100" step="any" value="<?php echo $pointTop ?>"/>
            </p>
            <p>
              <input type="hidden" name="pointdata[left][]" min="0" max="100" step="any" value="<?php echo $pointLeft ?>"/>
            </p>
          </div>

          <div class="devvn-hotspot-popup-modal-footer">
            <button type="button" class="button button-danger button-large button_delete"><?php _e('Delete', 'devvn-image-hotspot') ?></button>
            <button type="button" class="button button-primary button-large" data-popup-close="info_draggable<?php echo $countPoint ?>"><?php _e('Done', 'devvn-image-hotspot') ?></button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    <?php
    return ob_get_clean();
  }

  /* BLade A - Get pins info */
  function devvn_ihotspot_get_pins_default($datapin = array())
  {
    if (!is_array($datapin)) $datapin = array();
    $datapin = wp_parse_args($datapin, unserialize(DEVVN_IHOTSPOT_PINS_DEFAULT));
    $countPoint = $datapin['countPoint'];
    $imgPin = $datapin['imgPoint'];
    $topPin = $datapin['top'];
    $leftPin = $datapin['left'];
    $pins_image_custom = $datapin['pins_image_custom'];
    if ($pins_image_custom) $imgPin = $pins_image_custom;
    ob_start();
    ?>
    <div id="draggable<?php echo $countPoint ?>" data-points="<?php echo $countPoint ?>" class="drag_element" <?php if ($topPin && $leftPin): ?> style="top:<?php echo $topPin ?>%; left:<?php echo $leftPin ?>%;"<?php endif; ?>>
      <div class="point_style">
        <a href="#" class="pins_click_to_edit" data-popup-open="info_draggable<?php echo $countPoint ?>" data-target="#info_draggable<?php echo $countPoint ?>">
          <img src="<?php echo $imgPin ?>">
          <span class="number"><?php echo $countPoint ?></span>
        </a>
      </div>
    </div>
    <?php
    return ob_get_clean();
  }

  /* Blade A - Salva i meta dati */
  function devvn_ihotspot_save_meta_box_data($post_id)
  {

    if (!isset($_POST['maps_points_meta_box_nonce'])) {
      return;
    }
    if (!wp_verify_nonce($_POST['maps_points_meta_box_nonce'], 'maps_points_save_meta_box_data')) {
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

    $blade_number = sanitize_text_field((isset($_POST['blade_number'])) ? $_POST['blade_number'] : '');

    $my_data = esc_url((isset($_POST['maps_images'])) ? $_POST['maps_images'] : '');
    $my_data_enercon = esc_url((isset($_POST['maps_images_enercon'])) ? $_POST['maps_images_enercon'] : '');

    $dataPoints = array();

    /*sanitize in devvn_ihotspot_convert_array_data*/
    $pointdata = (isset($_POST['pointdata'])) ? $_POST['pointdata'] : '';

    $choose_type = sanitize_text_field((isset($_POST['choose_type'])) ? $_POST['choose_type'] : '');

    $custom_top = sanitize_text_field((isset($_POST['custom_top'])) ? $_POST['custom_top'] : '');
    $custom_left = sanitize_text_field((isset($_POST['custom_left'])) ? $_POST['custom_left'] : '');

    $custom_hover_top = sanitize_text_field((isset($_POST['custom_hover_top'])) ? $_POST['custom_hover_top'] : '');
    $custom_hover_left = sanitize_text_field((isset($_POST['custom_hover_left'])) ? $_POST['custom_hover_left'] : '');

    $pins_animation = sanitize_text_field((isset($_POST['pins_animation'])) ? $_POST['pins_animation'] : '');

    $pins_more_option = array(
      'position' => $choose_type,
      'custom_top' => $custom_top,
      'custom_left' => $custom_left,
      'custom_hover_top' => $custom_hover_top,
      'custom_hover_left' => $custom_hover_left,
      'pins_animation' => $pins_animation
    );
    if (is_array($pointdata)) {
      $dataPoints = devvn_ihotspot_convert_array_data($pointdata);
    }
    $data_post = array(
      'blade_number'=> $blade_number,
      'maps_images' => $my_data,
      'maps_images_enercon' => $my_data_enercon,
      'pins_image' => sanitize_text_field((isset($_POST['pins_image'])) ? $_POST['pins_image'] : ''),
      'pins_image_hover' => sanitize_text_field(isset($_POST['pins_image_hover']) ? $_POST['pins_image_hover'] : ''),
      'pins_more_option' => $pins_more_option,
      'data_points' => $dataPoints
    );
    update_post_meta($post_id, 'hotspot_content', $data_post);
    /*remove_action( 'save_post', 'devvn_ihotspot_save_meta_box_data' );
    wp_update_post(array(
      'ID'			=>	$post_id,
      'post_content'	=>	maybe_serialize(wp_unslash($data_post)),
      'post_type'		=>	'points_image'
    ));
    add_action( 'save_post', 'devvn_ihotspot_save_meta_box_data' );*/
  }
  add_action('save_post', 'devvn_ihotspot_save_meta_box_data');

  /* Blade A - Clone Point */
  add_action('wp_ajax_devvn_ihotspot_clone_point', 'devvn_ihotspot_clone_point_func');
  function devvn_ihotspot_clone_point_func()
  {
    if (!wp_verify_nonce($_REQUEST['nonce'], "maps_points_save_meta_box_data")) {
      exit();
    }

    if (!is_user_logged_in()) {
      wp_send_json_error();
    }
    $countPoint = intval($_POST['countpoint']);
    $imgPin = esc_url($_POST['img_pins']);
    $countPoint = (isset($countPoint) && !empty($countPoint)) ? $countPoint : mt_rand();
    $datapin = array(
      'countPoint' => $countPoint,
      'imgPoint' => $imgPin
    );
    $data_input = array(
      'countPoint' => $countPoint,
    );
    wp_send_json_success(array(
      'point_pins' => devvn_ihotspot_get_pins_default($datapin),
      'point_data' => devvn_ihotspot_get_input_point_default($data_input)
    ));
    die();
  }

  /* Blade A - Convert data array */
  function devvn_ihotspot_convert_array_data($inputArray = array())
  {
    $aOutput = array();
    $firstKey = null;
    foreach ($inputArray as $key => $value) {
      $firstKey = $key;
      break;
    }
    $nCountKey = count($inputArray[$firstKey]);
    for ($i = 0; $i < $nCountKey; $i++) {
      $element = array();
      foreach ($inputArray as $key => $value) {
        $element[$key] = wp_kses_post($value[$i]);
      }
      array_push($aOutput, $element);
    }
    return $aOutput;
  }
/*
   * by TanND
   * https://gist.github.com/levantoan/2a66dafad7a9a3a88468170ecce0cdab
*/