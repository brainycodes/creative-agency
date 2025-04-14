jQuery(document).ready (function () {

	// Display panels after delay
	if ( TRX_DEMO_STORAGE['tabs_delay'] > 0 && TRX_DEMO_STORAGE['tabs_layout'] != '' ) {
		setTimeout( function() {
			jQuery('body').append(TRX_DEMO_STORAGE['tabs_layout']);
			trx_demo_init();
		}, TRX_DEMO_STORAGE['tabs_delay'] );
	} else {
		trx_demo_init();
	}
} );


function trx_demo_init() {

	var $demo_panels = jQuery( '.trx_demo_panels' ),
		multi_filters = $demo_panels.hasClass( 'trx_demo_panels_with_multi_filters' );

	// Switch panels on tab click
	$demo_panels.find('.trx_demo_tabs a:not([data-type="link"])')
		.on('click', function(e) {
			var tab = jQuery(this),
				panels = tab.parents('.trx_demo_panels'),
				new_panel = panels.find(tab.attr('href'));
			// Replace bg image placeholders
			if ( ! new_panel.hasClass( 'trx_demo_images_init' ) ) {
				new_panel
					.addClass( 'trx_demo_images_init' )
					.find( '[data-style^="background-image"]' )
						.each( function() {
							var $self = jQuery( this );
							$self
								.attr( 'style', $self.data('style') )
								.removeAttr( 'data-style' );

						} );
			}
			// Open panel
			if ( panels.hasClass('open') ) {
				if ( ! tab.hasClass('trx_demo_tab_active') ) {
					panels.find('.trx_demo_panel_active').fadeOut(function() {
						jQuery(this).removeClass('trx_demo_panel_active');
						new_panel.fadeIn().addClass('trx_demo_panel_active');
					});
				}
			} else {
				if ( ! tab.hasClass('trx_demo_tab_active') ) {
					panels.find('.trx_demo_panel_active').hide();
					new_panel.show().addClass('trx_demo_panel_active');
				}
				panels.addClass('open');
				jQuery('html').addClass('trx_demo_panels_open');
			}
			if ( ! tab.hasClass('trx_demo_tab_active') ) {
				tab.siblings().removeClass('trx_demo_tab_active');
				tab.addClass('trx_demo_tab_active');
			}
			e.preventDefault();
			return false;
		});

	// Close panels
	$demo_panels.find('.trx_demo_button_close,.trx_demo_panels_mask')
		.on('click', function(e) {
			$demo_panels
				.removeClass('open')
				.find('.trx_demo_panel_active').fadeOut(function() { jQuery(this).removeClass('trx_demo_panel_active'); }).end()
				.find('.trx_demo_tab_active').removeClass('trx_demo_tab_active');
			jQuery('html').removeClass('trx_demo_panels_open');
			e.preventDefault();
			return false;		
		});

	// Add classes to body
	$demo_panels.find('.trx_demo_panel_list_item[data-body-class] a')
		.on('click', function(e) {
			jQuery('body').toggleClass( jQuery(this).parents('.trx_demo_panel_list_item').data('body-class') );
			e.preventDefault();
			return false;		
		});

	// Subscribe email
	$demo_panels.find('.trx_demo_subscribe_email')
		.on('keypress', function(e) {
			jQuery(this).removeClass('trx_demo_field_error');
		} );
	$demo_panels.find('.trx_demo_subscribe_button')
		.on('click', function(e) {
			jQuery(this).parents('form').submit();
			e.preventDefault();
			return false;		
		});
	$demo_panels.find('.trx_demo_subscribe form')
		.on('submit', function(e) {
			var form = jQuery(this),
				fld = form.find('.trx_demo_subscribe_email'),
				email = fld.val(),
				url = form.attr('action'),
				nonce = form.find('[name="trx_demo_subscribe_nonce"]').val();
			var regexp = new RegExp( '^([a-z0-9_\\-]+\\.)*[a-z0-9_\\-]+@[a-z0-9_\\-]+(\\.[a-z0-9_\\-]+)*\\.[a-z]{2,6}$' );
			if ( url === '' || email === '' || email.length < 7 || ! regexp.test( email ) ) {
				fld.addClass( 'trx_demo_field_error' );
			} else {
				form.addClass('trx_demo_loading');
				jQuery.post(url, {
					action: "trx_demo_subscribe",
					nonce: nonce,
					email: email
				}).done(function(response) {
					var rez = {};
					try {
						rez = JSON.parse(response);
					} catch(e) {
						rez = { error: TRX_DEMO_STORAGE['msg_ajax_error'] };
						console.log(response);
					}
					form.removeClass('trx_demo_loading');
					var result = form.siblings(".trx_demo_message_box").removeClass("trx_demo_message_box_error").removeClass("trx_demo_message_box_success");
					if (rez.error === '') {
						form.get(0).reset();
						result.addClass("trx_demo_message_box_success").html( rez.success );
					} else {
						result.addClass("trx_demo_message_box_error").html( rez.error );
					}
					result.fadeIn().delay(5000).fadeOut();
				});
			}
			e.preventDefault();
			return false;		
		});


	// Block submit form with search field
	$demo_panels.find( '.trx_demo_panel_filters_form' )
		.on( 'submit', function() {
			return false;
		} );

	// Search items by part of slug (title)
	$demo_panels.find( '.trx_demo_panel_filters_search' )
		.on( 'keyup', function(e) {
			filter_items( jQuery( this ).parents( '.trx_demo_panel' ), false );
		} );

	// Filter items by tag
	$demo_panels.find( '.trx_demo_panel_filters_list' )
		.on( 'click', 'a', function(e) {
			var $item = jQuery( this ).parent();
			if ( ! multi_filters ) {
				$item.siblings().removeClass( 'filter_active' );
				$item.addClass( 'filter_active' );
			} else {
				$item.toggleClass( 'filter_active' );
				if ( $item.data( 'filter' ) && $item.data( 'filter' ).toLowerCase() == 'all' ) {
					if ( $item.hasClass( 'filter_active' ) ) {
						$item.siblings().removeClass( 'filter_active' );
					}
				} else {
					$item.parent().find( '[data-filter="All"]' ).removeClass( 'filter_active' );
				}
				if ( $item.parent().find( '.filter_active' ).length === 0 ) {
					$item.parent().find( '[data-filter="All"]' ).addClass( 'filter_active' );
				}
			}
			filter_items( jQuery( this ).parents( '.trx_demo_panel' ), true );
			e.preventDefault();
			return false;
		} );

	// Show/Hide items
	var filter_items_busy = false,
		filter_show_timer = 300;
	function filter_items( section, hide_all ) {
		if ( filter_items_busy ) {
			setTimeout( function() {
				filter_items( section, hide_all );
			}, filter_show_timer + 10 );
			return;
		}
		filter_items_busy = true;
		var txt  = section.find( '.trx_demo_panel_filters_search' ).val(),
			flt  = '',
			list = section.find( '.trx_demo_panel_list' ),
			mh   = 0;
		if ( ! multi_filters ) {
			flt = section.find( '.trx_demo_panel_filters_list_item.filter_active' ).eq(0).data( 'filter' ) || '';
			flt = flt.trim();
		} else {
			section.find( '.trx_demo_panel_filters_list_item.filter_active' ).each( function() {
				if ( jQuery( this ).data( 'filter' ) ) {
					flt += ( flt ? ',' : '' ) + jQuery( this ).data( 'filter' ).trim();
				}
			} );
		}
		if ( hide_all ) {
			mh = list.css( 'min-height' );
			list.css( 'min-height', section.outerHeight() + 'px' )
			section.find( '[data-filter-value]:visible' ).stop().fadeOut( filter_show_timer );
		}
		txt = txt.toLowerCase();
		flt = flt.toLowerCase();
		setTimeout( function() {
			var once = true;
			section.find( ( flt != '' ? '[data-filter-value]' : '[data-search-value]' ) + ( hide_all ? ':hidden' : '' ) ).each( function() {
				var $self = jQuery( this ),
					flt_val = $self.data( 'filter-value' ) || '',
					search_val = $self.data( 'search-value' ) || '';
				if ( ( txt === '' || search_val.toLowerCase().indexOf( txt ) >= 0 )
					&& ( flt == 'all' || flt == '' || filter_compare( flt, flt_val.trim().toLowerCase() ) )
				) {
					$self.stop().fadeIn( filter_show_timer );
					if ( hide_all && once ) {
						once = false;
						list.css( 'min-height', mh );
					}
				} else if ( ! hide_all && $self.is( ':visible' ) ) {
					$self.stop().fadeOut( filter_show_timer );
				}
			} );
			setTimeout( function() {
				filter_items_busy = false;
			}, filter_show_timer + 10 );
		}, hide_all ? filter_show_timer + 10 : 0 );
	}

	function filter_compare( s1, s2 ) {
		var a1 = s1.split(','),
			a2 = s2.split(',');
		return a1.filter( function( item ) {
    		return a2.indexOf( item ) !== -1;
		} ).length > 0;
	}
	
	// Mark active skin
	var skin_name = jQuery('body').attr('class').match(/\bskin_\S+/);
	if ( skin_name ) {
		skin_name = skin_name.toString().substring(5).replace(/-/g, ' ');
		$demo_panels.find( '.trx_demo_panel_skins .trx_demo_panel_list_item').each( function() {
			var $self = jQuery(this);
			if ( $self.find( '.trx_demo_panel_list_item_title > a' ).text().trim().toLowerCase() == skin_name ) {
				$self.addClass( 'trx_demo_panel_list_item_active' );
			}
		} );
	}
}