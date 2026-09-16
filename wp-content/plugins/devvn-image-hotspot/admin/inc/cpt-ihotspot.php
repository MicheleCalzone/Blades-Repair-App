<?php defined( 'ABSPATH' ) or die( 'No script kiddies please!' );?>
<?php
// Register Custom Post Type
function devvn_ihotspot_cpt_func() {

	$labels = array(
		'name'                  => _x( 'Report Ispezioni', 'Post Type General Name', 'devvn-image-hotspot' ),
		'singular_name'         => _x( 'Report Ispezioni', 'Post Type Singular Name', 'devvn-image-hotspot' ),
		'menu_name'             => __( 'Report Ispezioni', 'devvn-image-hotspot' ),
		'name_admin_bar'        => __( 'Report Ispezioni', 'devvn-image-hotspot' ),
		'archives'              => __( 'Item Archives', 'devvn-image-hotspot' ),
		'parent_item_colon'     => __( 'Parent Item:', 'devvn-image-hotspot' ),
		'all_items'             => __( 'All Report', 'devvn-image-hotspot' ),
		'add_new_item'          => __( 'Add New Report', 'devvn-image-hotspot' ),
		'add_new'               => __( 'Add New', 'devvn-image-hotspot' ),
		'new_item'              => __( 'New Report', 'devvn-image-hotspot' ),
		'edit_item'             => __( 'Edit Report', 'devvn-image-hotspot' ),
		'update_item'           => __( 'Update Report', 'devvn-image-hotspot' ),
		'view_item'             => __( 'View Report', 'devvn-image-hotspot' ),
		'search_items'          => __( 'Search Report', 'devvn-image-hotspot' ),
		'not_found'             => __( 'Not found', 'devvn-image-hotspot' ),
		'not_found_in_trash'    => __( 'Not found in Trash', 'devvn-image-hotspot' ),
		'featured_image'        => __( 'Featured Image', 'devvn-image-hotspot' ),
		'set_featured_image'    => __( 'Set featured image', 'devvn-image-hotspot' ),
		'remove_featured_image' => __( 'Remove featured image', 'devvn-image-hotspot' ),
		'use_featured_image'    => __( 'Use as featured image', 'devvn-image-hotspot' ),
		'insert_into_item'      => __( 'Insert into item', 'devvn-image-hotspot' ),
		'uploaded_to_this_item' => __( 'Uploaded to this item', 'devvn-image-hotspot' ),
		'items_list'            => __( 'Items list', 'devvn-image-hotspot' ),
		'items_list_navigation' => __( 'Items list navigation', 'devvn-image-hotspot' ),
		'filter_items_list'     => __( 'Filter items list', 'devvn-image-hotspot' ),
	);
	$args = array(
		'label'                 => __( 'Report Ispezioni', 'devvn-image-hotspot' ),
		'labels'                => $labels,
		'supports'              => array( 'title' ),
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 5,
		'menu_icon'             => 'dashicons-visibility',
		'show_in_admin_bar'     => true,
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => true,
		'exclude_from_search'   => true,
		'publicly_queryable'    => true,
    'rewrite'               => array('slug' => 'report-ispezioni'),
		'capability_type'       => 'post',
    'supports' => array( //consente di attivare una serie di funzionalità
      'title',
      //'editor',
      //'excerpt',
      //'custom-fields',
      //'thumbnail',
      //'page-attributes'
    ),

	);
	register_post_type( 'points_image', $args );

}
add_action( 'init', 'devvn_ihotspot_cpt_func', 0 );

//Add admin inline style
function devvn_ihotspot_admin_css() {
	global $post_type;
	$post_types = array(
		'points_image'
	);
	if(in_array($post_type, $post_types))
		echo '<style type="text/css"></style>';
}
add_action( 'admin_head-post-new.php', 'devvn_ihotspot_admin_css' );
add_action( 'admin_head-post.php', 'devvn_ihotspot_admin_css' );

//Add row to admin column
add_filter( 'page_row_actions', 'devvn_ihotspot_row_actions', 10, 2 );
add_filter( 'post_row_actions', 'devvn_ihotspot_row_actions', 10, 2 );
function devvn_ihotspot_row_actions( $actions, $post ) {
	if($post->post_type == 'points_image'){
	    unset( $actions['inline hide-if-no-js'] );
	    //unset( $actions['view'] );
	}
    return $actions;
}

//Add new column
function devvn_ihotspot_cpt_admin_columns( $columns ) {
	$columns = array(
		'cb' 			=> '<input type="checkbox" />',
		'title' 		=> __( 'Title','devvn-image-hotspot' ),
		'shortcode' 	=> __( 'Shortcode','devvn-image-hotspot' ),
		'date' 			=> __( 'Date','devvn-image-hotspot' ),
	);
	return $columns;
}
add_filter( 'manage_edit-points_image_columns', 'devvn_ihotspot_cpt_admin_columns' ) ;

//Add content to colum
function devvn_ihotspot_manage_points_image_columns( $column, $post_id ) {
	global $post;
	switch( $column ) {
		case 'shortcode' :
			echo '[devvn_ihotspot id="'.$post->ID.'"]';
			break;
		default :
			break;
	}
}
add_action( 'manage_points_image_posts_custom_column', 'devvn_ihotspot_manage_points_image_columns', 10, 2 );