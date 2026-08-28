<?php
/**
 * Create clean-room synthetic products for the Advanced Bundles browser demo.
 */

declare(strict_types=1);

use AIMPlugins\AdvancedBundles\Contracts\BundleComponent;
use AIMPlugins\AdvancedBundles\WooCommerce\AimBundleProduct;
use AIMPlugins\AdvancedBundles\WooCommerce\Persistence\BundleDefinitionRepository;

if ( ! defined( 'ABSPATH' ) || ! class_exists( 'WooCommerce' ) ) {
	throw new RuntimeException( 'WooCommerce must be active before demo fixtures run.' );
}

if ( ! class_exists( AimBundleProduct::class ) ) {
	throw new RuntimeException( 'Advanced Bundles Free must be active before demo fixtures run.' );
}

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

function we_wp_demo_import_image( string $source, string $title, string $alt ): int {
	if ( ! is_readable( $source ) ) {
		throw new RuntimeException( 'Synthetic demo image is missing: ' . basename( $source ) );
	}

	$temporary = wp_tempnam( basename( $source ) );

	if ( ! is_string( $temporary ) || '' === $temporary || ! copy( $source, $temporary ) ) {
		throw new RuntimeException( 'Could not stage synthetic demo image.' );
	}

	$attachment_id = media_handle_sideload(
		array(
			'name'     => basename( $source ),
			'tmp_name' => $temporary,
		),
		0,
		$title
	);

	if ( is_wp_error( $attachment_id ) ) {
		@unlink( $temporary );
		throw new RuntimeException( $attachment_id->get_error_message() );
	}

	update_post_meta( $attachment_id, '_wp_attachment_image_alt', $alt );

	return (int) $attachment_id;
}

function we_wp_demo_create_page( string $slug, string $title, string $content ): int {
	$existing = get_page_by_path( $slug, OBJECT, 'page' );

	if ( $existing instanceof WP_Post ) {
		return (int) $existing->ID;
	}

	$page_id = wp_insert_post(
		array(
			'post_name'    => $slug,
			'post_title'   => $title,
			'post_content' => $content,
			'post_status'  => 'publish',
			'post_type'    => 'page',
		),
		true
	);

	if ( is_wp_error( $page_id ) ) {
		throw new RuntimeException( $page_id->get_error_message() );
	}

	return (int) $page_id;
}

if ( get_page_by_path( 'workshop-starter-bundle', OBJECT, 'product' ) instanceof WP_Post ) {
	return;
}

update_option( 'blogname', 'we-wp Advanced Bundles demo' );
update_option( 'blogdescription', 'Synthetic WooCommerce store for a private browser demo.' );
update_option( 'woocommerce_currency', 'EUR' );
update_option( 'woocommerce_default_country', 'LT' );
update_option( 'woocommerce_enable_guest_checkout', 'yes' );
update_option( 'woocommerce_enable_checkout_login_reminder', 'no' );
update_option( 'woocommerce_allow_tracking', 'no' );
update_option( 'woocommerce_coming_soon', 'no' );
update_option( 'woocommerce_store_pages_only', 'no' );
update_option( 'woocommerce_feature_site_visibility_badge_enabled', 'no' );
update_option(
	'woocommerce_cod_settings',
	array(
		'enabled'      => 'yes',
		'title'        => 'Demo order',
		'description'  => 'No payment is collected. This order exists only in your temporary browser demo.',
		'instructions' => '',
	)
);

$cart_id = we_wp_demo_create_page( 'cart', 'Cart', '<!-- wp:woocommerce/cart /-->' );
$checkout_id = we_wp_demo_create_page( 'checkout', 'Checkout', '<!-- wp:woocommerce/checkout /-->' );
update_option( 'woocommerce_cart_page_id', $cart_id );
update_option( 'woocommerce_checkout_page_id', $checkout_id );

$category = term_exists( 'starter-kits', 'product_cat' );

if ( ! is_array( $category ) ) {
	$category = wp_insert_term( 'Starter Kits', 'product_cat', array( 'slug' => 'starter-kits' ) );
}

if ( is_wp_error( $category ) ) {
	throw new RuntimeException( $category->get_error_message() );
}

$category_id = (int) $category['term_id'];
$asset_root = '/tmp/we-wp-demo/images';
$guide_image_id = we_wp_demo_import_image( $asset_root . '/guides.png', 'Essential Workshop Guide', 'Two cobalt workshop guides.' );
$case_image_id = we_wp_demo_import_image( $asset_root . '/case.png', 'Workshop Carry Case', 'Cobalt workshop carry case.' );
$bundle_image_id = we_wp_demo_import_image( $asset_root . '/bundle.png', 'Workshop Starter Bundle', 'Workshop guides and carry case shown together.' );

$guide = new WC_Product_Simple();
$guide->set_name( 'Essential Workshop Guide' );
$guide->set_slug( 'essential-workshop-guide' );
$guide->set_status( 'publish' );
$guide->set_catalog_visibility( 'visible' );
$guide->set_regular_price( '12.50' );
$guide->set_price( '12.50' );
$guide->set_manage_stock( true );
$guide->set_stock_quantity( 20 );
$guide->set_stock_status( 'instock' );
$guide->set_image_id( $guide_image_id );
$guide->set_category_ids( array( $category_id ) );
$guide->set_short_description( 'A practical printed guide for focused workshops.' );
$guide_id = $guide->save();

$colour = new WC_Product_Attribute();
$colour->set_id( 0 );
$colour->set_name( 'Colour' );
$colour->set_options( array( 'Cobalt' ) );
$colour->set_position( 0 );
$colour->set_visible( true );
$colour->set_variation( true );

$case = new WC_Product_Variable();
$case->set_name( 'Workshop Carry Case' );
$case->set_slug( 'workshop-carry-case' );
$case->set_status( 'publish' );
$case->set_catalog_visibility( 'visible' );
$case->set_attributes( array( $colour ) );
$case->set_image_id( $case_image_id );
$case->set_category_ids( array( $category_id ) );
$case->set_short_description( 'A durable case for workshop materials and everyday tools.' );
$case_id = $case->save();

$case_variation = new WC_Product_Variation();
$case_variation->set_parent_id( $case_id );
$case_variation->set_attributes( array( 'colour' => 'Cobalt' ) );
$case_variation->set_regular_price( '7.50' );
$case_variation->set_price( '7.50' );
$case_variation->set_manage_stock( true );
$case_variation->set_stock_quantity( 10 );
$case_variation->set_stock_status( 'instock' );
$case_variation->set_status( 'publish' );
$case_variation->set_image_id( $case_image_id );
$case_variation_id = $case_variation->save();
WC_Product_Variable::sync( $case_id );

$bundle = new AimBundleProduct();
$bundle->set_name( 'Workshop Starter Bundle' );
$bundle->set_slug( 'workshop-starter-bundle' );
$bundle->set_status( 'publish' );
$bundle->set_catalog_visibility( 'visible' );
$bundle->set_regular_price( '32.50' );
$bundle->set_price( '32.50' );
$bundle->set_stock_status( 'instock' );
$bundle->set_image_id( $bundle_image_id );
$bundle->set_category_ids( array( $category_id ) );
$bundle->set_short_description( 'Get two workshop guides and one cobalt carry case in one fixed bundle.' );
$bundle->set_description( 'Each component keeps its own WooCommerce price, tax, stock, shipping, and order record.' );
$bundle_id = $bundle->save();

$repository = new BundleDefinitionRepository();
$repository->stageComponents(
	$bundle,
	array(
		new BundleComponent( 'workshop-guides', $guide_id, null, 2, 0 ),
		new BundleComponent( 'cobalt-carry-case', $case_id, $case_variation_id, 1, 1 ),
	)
);
$bundle->save();

if ( 32.5 !== (float) $bundle->get_price() ) {
	throw new RuntimeException( 'Unexpected synthetic bundle total.' );
}

update_option( 'permalink_structure', '/%postname%/' );
flush_rewrite_rules( false );
