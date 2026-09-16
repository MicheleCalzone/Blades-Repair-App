<?php
  /*
  Plugin Name: Image Hotspot by DevVN
  Plugin URI: https://levantoan.com/devvn-image-hotspot
  Description: Image Hotspot help you add hotspot to your images.
  Author: Le Van Toan
  Version: 1.2.2
  Author URI: https://levantoan.com/
  Text Domain: devvn-image-hotspot
  Domain Path: /languages
  License: GPLv3
  License URI: http://www.gnu.org/licenses/gpl-3.0

  Image Hotspot by DevVN

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
  */

  defined('ABSPATH') or die('No script kiddies please!');


  define('DEVVN_IHOTSPOT_VER', '1.2.2');
  define('DEVVN_IHOTSPOT_DEV_MOD', true);
  if (!defined('DEVVN_IHOTSPOT_BASENAME'))
    define('DEVVN_IHOTSPOT_BASENAME', plugin_basename(__FILE__));

  //include
  include 'admin/inc/cpt-ihotspot.php';
  include 'admin/inc/add_shortcode_devvn_ihotspot.php';
  include 'admin/inc/metabox-donate.php';
  include 'admin/inc/settings.php';

  load_textdomain('devvn-image-hotspot', dirname(__FILE__) . '/languages/devvn-image-hotspot-' . get_locale() . '.mo');
  load_plugin_textdomain('devvn-image-hotspot', false, plugin_basename(dirname(__FILE__)) . '/i18n/languages');



  // includo html e funzioni delle singole blade
  include 'blades/blade-a.php';
  include 'blades/blade-b.php';
  include 'blades/blade-c.php';







  /* shortcode */
  function devvn_ihotspot_shortcode_callback($post)
  {
    if (get_post_status($post->ID) == "publish"):
      ?>
      <span><?php _e('Copy shortcode to view', 'devvn-image-hotspot') ?></span>
      <input readonly="readonly" class="shortcodemap" value='[devvn_ihotspot id="<?= $post->ID ?>"]'/>
    <?php else: ?>
      <span><?php _e('Publish to view shortcode', 'devvn-image-hotspot') ?></span>
    <?php
    endif;
  }

  /*Add editor Style*/
  function devvn_ihotspot_editor_styles()
  {

    global $wp_version;

    $baseurl = includes_url('js/tinymce');

    $suffix = SCRIPT_DEBUG ? '' : '.min';
    $version = 'ver=' . $wp_version;
    $dashicons = includes_url("css/dashicons$suffix.css?$version");

    // WordPress default stylesheet and dashicons
    $mce_css = array(
      $dashicons,
      $baseurl . '/skins/wordpress/wp-content.css?' . $version
    );

    $editor_styles = get_editor_stylesheets();
    if (!empty($editor_styles)) {
      foreach ($editor_styles as $style) {
        $mce_css[] = $style;
      }
    }

    $mce_css = trim(apply_filters('devvn_ihotspot_mce_css', implode(',', $mce_css)), ' ,');

    if (!empty($mce_css))
      return $mce_css;
    else
      return false;

  }

  /*Add admin script*/
  function devvn_ihotspot_admin_script()
  {
    global $typenow;
    if ($typenow == 'points_image') {
      wp_enqueue_media();

      wp_enqueue_script('jquery-ui-core');
      wp_enqueue_script('jquery-ui-droppable');

      /*wp_register_script( 'bootstrap-js', plugin_dir_url( __FILE__ ) . 'admin/js/bootstrap.min.js', array( 'jquery' ), DEVVN_IHOTSPOT_VER, true );
      wp_enqueue_script( 'bootstrap-js' );*/

      wp_register_script('maps_points', plugin_dir_url(__FILE__) . 'admin/js/maps_points.js', array('jquery'), DEVVN_IHOTSPOT_VER, true);
      wp_localize_script('maps_points', 'meta_image',
        array(
          'title' => __('Select image', 'devvn-image-hotspot'),
          'button' => __('Select', 'devvn-image-hotspot'),
          'site_url' => home_url(),
          'ajaxurl' => admin_url('admin-ajax.php'),
          'editor_style' => devvn_ihotspot_editor_styles()
        )
      );
      wp_enqueue_script('maps_points');
    }
  }

  add_action('admin_enqueue_scripts', 'devvn_ihotspot_admin_script');

  /*Add admin style*/
  function devvn_ihotspot_admin_styles()
  {
    global $typenow;
    if ($typenow == 'points_image') {
      wp_enqueue_style('bootstrap', plugin_dir_url(__FILE__) . 'admin/css/bootstrap.css', array(), DEVVN_IHOTSPOT_VER, 'all');
      wp_enqueue_style('maps_points', plugin_dir_url(__FILE__) . 'admin/css/maps_points_style.css', array(), DEVVN_IHOTSPOT_VER, 'all');
    }
  }

  add_action('admin_print_styles', 'devvn_ihotspot_admin_styles');

  /*Add frontend scripts*/
  function devvn_ihotspot_frontend_scripts()
  {
    if (DEVVN_IHOTSPOT_DEV_MOD) {
      wp_enqueue_style('powertip', plugin_dir_url(__FILE__) . 'frontend/css/jquery.powertip.min.css', array(), '1.2.0', 'all');
      wp_enqueue_script('powertip', plugin_dir_url(__FILE__) . 'frontend/js/jquery.powertip.min.js', array('jquery'), '1.2.0', true);

      wp_enqueue_style('maps-points', plugin_dir_url(__FILE__) . 'frontend/css/maps_points.css', array(), DEVVN_IHOTSPOT_VER, 'all');
      wp_enqueue_script('maps-points', plugin_dir_url(__FILE__) . 'frontend/js/maps_points.js', array('jquery'), DEVVN_IHOTSPOT_VER, true);
    } else {
      wp_enqueue_style('ihotspot', plugin_dir_url(__FILE__) . 'frontend/css/ihotspot.min.css', array(), DEVVN_IHOTSPOT_VER, 'all');
      wp_enqueue_script('ihotspot-js', plugin_dir_url(__FILE__) . 'frontend/js/jquery.ihotspot.min.js', array('jquery'), DEVVN_IHOTSPOT_VER, true);
    }
  }

  /*Add quicktags scripts altrimenti se cancelli tutti i punti poi va in errore*/
  wp_enqueue_script( 'quicktags' );

  add_action('wp_enqueue_scripts', 'devvn_ihotspot_frontend_scripts');

