<?php
/**
 * Plugin Name: we-wp Demo Guard
 * Description: Keeps the temporary browser demo synthetic, local, and non-delivering.
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter(
	'pre_http_request',
	static function () {
		return new WP_Error( 'we_wp_demo_network_blocked', 'External requests are disabled in this demo.' );
	},
	PHP_INT_MAX
);

add_filter( 'pre_wp_mail', '__return_false', PHP_INT_MAX );
add_filter( 'xmlrpc_enabled', '__return_false' );
add_filter( 'wp_is_application_passwords_available', '__return_false' );
add_filter( 'send_password_change_email', '__return_false' );
add_filter( 'send_email_change_email', '__return_false' );
add_filter( 'pre_option_users_can_register', '__return_zero' );
add_filter( 'pre_option_show_avatars', '__return_zero' );
add_filter( 'pre_option_woocommerce_allow_tracking', static fn (): string => 'no' );
add_filter( 'pre_option_woocommerce_feature_order_attribution_enabled', static fn (): string => 'no' );
add_filter( 'pre_option_woocommerce_show_marketplace_suggestions', static fn (): string => 'no' );
add_filter( 'upload_size_limit', static fn (): int => 2 * MB_IN_BYTES );
add_filter( 'emoji_svg_url', '__return_false' );

add_action(
	'init',
	static function (): void {
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
	}
);

/**
 * Keep both storefront and wp-admin pages embeddable by the isolated Playground
 * worker while refusing every non-local subresource.
 */
$we_wp_demo_send_headers = static function (): void {
	header( 'Cross-Origin-Embedder-Policy: require-corp' );
	header( 'Cross-Origin-Resource-Policy: same-origin' );
	header( "Content-Security-Policy: default-src 'self' data: blob:; connect-src 'self' data:; font-src 'self' data:; frame-src 'self' blob:; img-src 'self' data: blob:; object-src 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; base-uri 'self'; form-action 'self'" );
	header( 'Referrer-Policy: no-referrer' );
	header( 'X-Content-Type-Options: nosniff' );
};

$we_wp_demo_send_headers();
add_action( 'send_headers', $we_wp_demo_send_headers );
add_action( 'admin_init', $we_wp_demo_send_headers, PHP_INT_MIN );
add_action(
	'admin_init',
	static function () use ( $we_wp_demo_send_headers ): void {
		// Core adds SAMEORIGIN after the early hook. Playground uses a nested,
		// isolated frame, so remove that response header after core has added it.
		header_remove( 'X-Frame-Options' );
		$we_wp_demo_send_headers();
	},
	PHP_INT_MAX
);

add_filter(
	'upload_mimes',
	static fn (): array => array(
		'jpg|jpeg' => 'image/jpeg',
		'png'      => 'image/png',
		'webp'     => 'image/webp',
	)
);

add_filter(
	'woocommerce_available_payment_gateways',
	static function ( array $gateways ): array {
		return isset( $gateways['cod'] ) ? array( 'cod' => $gateways['cod'] ) : array();
	},
	PHP_INT_MAX
);

add_filter(
	'map_meta_cap',
	static function ( array $caps, string $cap ): array {
		$blocked = array(
			'activate_plugins',
			'create_users',
			'delete_plugins',
			'delete_themes',
			'delete_users',
			'edit_files',
			'edit_plugins',
			'edit_themes',
			'edit_users',
			'install_plugins',
			'install_themes',
			'promote_users',
			'remove_users',
			'update_core',
			'update_plugins',
			'update_themes',
		);

		return in_array( $cap, $blocked, true ) ? array( 'do_not_allow' ) : $caps;
	},
	PHP_INT_MAX,
	2
);

add_action(
	'admin_menu',
	static function (): void {
		remove_menu_page( 'plugins.php' );
		remove_menu_page( 'themes.php' );
		remove_menu_page( 'users.php' );
		remove_menu_page( 'tools.php' );
		remove_submenu_page( 'woocommerce', 'wc-addons' );
	},
	PHP_INT_MAX
);

add_action(
	'admin_notices',
	static function (): void {
		?>
		<div class="notice notice-info">
			<p><strong>Temporary browser demo.</strong> Use synthetic data only. Email, external requests, file changes, and real payment gateways are disabled. Reload the demo to reset.</p>
		</div>
		<?php
	}
);
