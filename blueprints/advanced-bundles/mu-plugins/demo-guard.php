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

/**
 * Build the short-lived option name used to verify one guided demo route.
 */
function we_wp_demo_route_option_name( string $request_id ): string {
	return 'we_wp_demo_route_' . $request_id;
}

/**
 * Return bounded, non-personal cart proof for the guided demo shell.
 *
 * @return array<string, bool|int>
 */
function we_wp_demo_cart_evidence(): array {
	$cart = function_exists( 'WC' ) && WC() instanceof WooCommerce ? WC()->cart : null;

	if ( ! $cart instanceof WC_Cart ) {
		return array(
			'cartEmpty'           => true,
			'cartItemCount'       => 0,
			'bundleGroups'        => 0,
			'bundleQuantity'      => 0,
			'componentLines'      => 0,
			'componentQuantity'   => 0,
			'componentTotalMinor' => 0,
		);
	}

	$bundle_groups        = array();
	$bundle_quantity      = 0;
	$component_lines      = 0;
	$component_quantity   = 0;
	$component_total_minor = 0;
	$cart_items           = $cart->get_cart();

	foreach ( $cart_items as $cart_item ) {
		if ( ! is_array( $cart_item ) ) {
			continue;
		}

		$role     = $cart_item['_aim_bundle_role'] ?? null;
		$quantity = isset( $cart_item['quantity'] ) ? (int) $cart_item['quantity'] : 0;
		$product  = $cart_item['data'] ?? null;

		if ( 'parent' === $role ) {
			$group_id = $cart_item['_aim_bundle_group_id'] ?? null;
			if ( is_string( $group_id ) && '' !== $group_id ) {
				$bundle_groups[ $group_id ] = true;
			}
			$bundle_quantity += $quantity;
		}

		if ( 'component' === $role && $product instanceof WC_Product ) {
			++$component_lines;
			$component_quantity += $quantity;
			$component_total_minor += (int) round( (float) $product->get_price() * $quantity * 100 );
		}
	}

	return array(
		'cartEmpty'           => $cart->is_empty(),
		'cartItemCount'       => count( $cart_items ),
		'bundleGroups'        => count( $bundle_groups ),
		'bundleQuantity'      => $bundle_quantity,
		'componentLines'      => $component_lines,
		'componentQuantity'   => $component_quantity,
		'componentTotalMinor' => $component_total_minor,
	);
}

/**
 * Create one example bundle only for an empty temporary cart, then redirect to
 * the requested WooCommerce page. Existing carts remain unchanged.
 */
add_action(
	'template_redirect',
	static function (): void {
		if ( is_admin() || ! isset( $_GET['we_wp_demo_example'], $_GET['we_wp_demo_request'] ) ) {
			return;
		}

		// This GET action changes only the current disposable Playground store.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$requested_route = sanitize_key( wp_unslash( $_GET['we_wp_demo_example'] ) );
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$request_id = sanitize_key( wp_unslash( $_GET['we_wp_demo_request'] ) );

		if ( ! in_array( $requested_route, array( 'cart', 'checkout' ), true ) || 24 !== strlen( $request_id ) || ! ctype_xdigit( $request_id ) ) {
			return;
		}

		$result = array(
			'requestId'      => $request_id,
			'requestedRoute' => $requested_route,
			'state'          => 'error',
			'message'        => 'The temporary WooCommerce cart is unavailable. Retry or reset the store.',
		);
		$cart   = function_exists( 'WC' ) && WC() instanceof WooCommerce ? WC()->cart : null;

		if ( $cart instanceof WC_Cart ) {
			if ( $cart->is_empty() ) {
				$bundle_post = get_page_by_path( 'workshop-starter-bundle', OBJECT, 'product' );
				$bundle      = $bundle_post instanceof WP_Post ? wc_get_product( $bundle_post->ID ) : false;

				if ( $bundle instanceof WC_Product && $bundle->is_type( 'aim_bundle' ) ) {
					try {
						$added_key = $cart->add_to_cart( $bundle->get_id(), 1 );
						$cart->calculate_totals();
						$cart->set_session();
						if ( WC()->session instanceof WC_Session ) {
							WC()->session->set_customer_session_cookie( true );
						}

						$evidence = we_wp_demo_cart_evidence();
						$valid    = is_string( $added_key )
							&& '' !== $added_key
							&& 3 === $evidence['cartItemCount']
							&& 1 === $evidence['bundleGroups']
							&& 1 === $evidence['bundleQuantity']
							&& 2 === $evidence['componentLines']
							&& 3 === $evidence['componentQuantity']
							&& 3250 === $evidence['componentTotalMinor'];

						if ( $valid ) {
							$result['state']   = 'loaded';
							$result['message'] = 'Example cart loaded.';
						} else {
							$cart->empty_cart();
							$result['message'] = 'The example bundle could not be verified. The temporary cart was cleared.';
						}
					} catch ( Throwable ) {
						$cart->empty_cart();
						$result['message'] = 'The example bundle could not be added. The temporary cart was cleared.';
					}
				} else {
					$result['message'] = 'The synthetic example bundle is unavailable. Retry or reset the store.';
				}
			} else {
				$result['state']   = 'preserved';
				$result['message'] = 'Existing demo cart kept.';
			}
		}

		$result = array_merge( $result, we_wp_demo_cart_evidence() );
		update_option( we_wp_demo_route_option_name( $request_id ), $result, false );

		if ( 'error' === $result['state'] ) {
			$bundle_post = get_page_by_path( 'workshop-starter-bundle', OBJECT, 'product' );
			$target_url  = $bundle_post instanceof WP_Post ? get_permalink( $bundle_post ) : home_url( '/' );
		} else {
			$target_url = 'checkout' === $requested_route ? wc_get_checkout_url() : wc_get_cart_url();
		}

		wp_safe_redirect( add_query_arg( 'we_wp_demo_result', $request_id, $target_url ) );
		exit;
	},
	1
);

/**
 * Record where WooCommerce actually rendered after the guided route. Running
 * after WooCommerce redirects means an empty-checkout redirect never reports a
 * false success to the parent shell.
 */
add_action(
	'template_redirect',
	static function (): void {
		if ( is_admin() || ! isset( $_GET['we_wp_demo_result'] ) ) {
			return;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only proof for the disposable demo route.
		$request_id = sanitize_key( wp_unslash( $_GET['we_wp_demo_result'] ) );
		if ( 24 !== strlen( $request_id ) || ! ctype_xdigit( $request_id ) ) {
			return;
		}

		$option_name = we_wp_demo_route_option_name( $request_id );
		$result      = get_option( $option_name, null );
		if ( ! is_array( $result ) ) {
			return;
		}

		$actual_route = is_cart() ? 'cart' : ( is_checkout() ? 'checkout' : ( is_product() ? 'product' : 'other' ) );
		$result       = array_merge(
			$result,
			we_wp_demo_cart_evidence(),
			array(
				'actualRoute' => $actual_route,
			)
		);
		update_option( $option_name, $result, false );
	},
	PHP_INT_MAX
);

// Playground enables cross-document transitions on the storefront but removes
// them from wp-admin in Chrome. Navigating between those documents rejects the
// browser transition promise, so keep this disposable demo transition-free.
add_action(
	'muplugins_loaded',
	static function (): void {
		remove_action( 'wp_head', 'playground_enable_view_transitions', 0 );
		remove_action( 'admin_print_styles', 'playground_enable_view_transitions', 0 );
		remove_action( 'login_head', 'playground_enable_view_transitions', 0 );
	},
	PHP_INT_MAX
);

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
