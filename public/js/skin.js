/* global jQuery:false */
/* global SMARTSEO_STORAGE:false */

(function() {
	"use strict";

	function smartseo_skin_post_header_init() {
		var header = jQuery('.post_header_wrap_style_style-1.with_featured_image, .post_header_wrap_style_style-2.with_featured_image');
		header.find('.post_featured').css('min-height', 0);

		if ( jQuery(header).find('.post_featured.with_gallery').length > 0 ) {
			return;
		}
		if ( jQuery(header).find('.post_featured.with_thumb.post_featured_bg.with_video').length > 0 ) {
			return;
		}

		header.each(function() {
			var self = jQuery(this);
			var image_h = self.find('.post_featured').outerHeight();
			var info_h = self.find('.post_header').outerHeight();
			var x = 180;
			if ( jQuery('body').hasClass('mobile_layout') ) {
				x = 100;
			}

			info_h = info_h + x;
			if ( info_h >= image_h ) {
				self.find('.post_featured').css('min-height', info_h);
			}
		});
	}

	smartseo_add_filter( 'trx_addons_filter_skills_pie_options', function(opt) {
		opt.animateScale = false;
		return opt;
	} );

	smartseo_add_filter( 'smartseo_filter_select_container_selector', function(selector) {
		selector = selector + ':not([name*="paid-service"])';
		return selector;
	} );


	if ( typeof TRX_ADDONS_STORAGE != 'undefined' && TRX_ADDONS_STORAGE['mouse_helper'] > 0 && TRX_ADDONS_STORAGE['mouse_helper_in_swiper_slider'] > 0 ) {
		if (jQuery('body').find('.slider_container.slider_swiper:not(.go)').length > 0) {
			jQuery('body').find('.slider_container.slider_swiper:not(.go)').each(function () {
				jQuery(this).addClass('go');
				var check_helper = jQuery(this).closest('.elementor-widget').data('mouse-helper');
				if(!check_helper) {					
					jQuery(this).attr('data-mouse-helper-hide-cursor', '1');
					jQuery(this).attr('data-mouse-helper', 'hover');
					jQuery(this).attr('data-mouse-helper-centered', '1');
					jQuery(this).attr('data-mouse-helper-magnet', '0');
					jQuery(this).attr('data-mouse-helper-bg-color', 'rgba(0, 0, 0, 1)');
					jQuery(this).attr('data-mouse-helper-mode', 'normal');
					jQuery(this).attr('data-mouse-helper-axis', 'xy');
					jQuery(this).attr('data-mouse-helper-delay', '8');
					jQuery(this).attr('data-mouse-helper-text-round', '0');
					jQuery(this).attr('data-mouse-helper-layout', '<div class=custom-helper><span></span></div>');
					if(jQuery(this).hasClass('slider_direction_vertical')) {
						jQuery(this).attr('data-mouse-helper-class', 'direction_vertical');
					}
				}
			});
		}
	}

	// Create Swiper Controls - Title
	function skin_blogger_controls_title() {
		if (jQuery('body').find('.sc_slider_controls:not(.go)').length > 0) {
			jQuery('body').find('.sc_slider_controls:not(.go)')
				.each(function () {
					var controls = jQuery(this).addClass('go'),
						slider_id = controls.data('slider-id'),
						pagination_style = controls.data('pagination-style');
					if (!slider_id) return;
					slider_id = jQuery('#' + slider_id + ' .slider_swiper').attr('id');
					if (!slider_id) return;

					// Add pagination
					var s = typeof TRX_ADDONS_STORAGE['swipers'] != 'undefined' && typeof TRX_ADDONS_STORAGE['swipers'][slider_id] != 'undefined' ? TRX_ADDONS_STORAGE['swipers'][slider_id] : false,
						slides = jQuery('#' + slider_id + ' .swiper-slide'),
						spv = s
							? (s.params.loop
									? s.loopedSlides
									: 0
							)
							: 0;
					if (pagination_style == 'title') {
						var html = '';
						slides.each(function (idx) {
							var slide = jQuery(this);
							if (idx < spv || idx >= slides.length - spv) return;
							var title = (slide.data('title')
									? slide.data('title')
									: slide.find('[class*="_item_title"]').text()
							);
							html += '<span class="slider_pagination_bullet swiper-pagination-bullet" data-slide-number="' + (s ? jQuery(this).data('slide-number') : idx) + '">' + title + '</span>';
						});
						controls.find('.slider_pagination_wrap').html(html);

						jQuery('#' + slider_id).on('slider_init slide_change_start', function (e) {
							if (TRX_ADDONS_STORAGE['swipers'][slider_id]) {
								var s = TRX_ADDONS_STORAGE['swipers'][slider_id];
								var current = jQuery(s.slides[s.activeIndex]).data('slide-number') + 1,
									total = s.params.loop ? Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup) : s.snapGrid.length;
								if (total > 0) {
									controls.find('.slider_pagination_bullet')
										.removeClass('slider_pagination_bullet_active swiper-pagination-bullet-active')
										.eq(current - 1)
										.addClass('slider_pagination_bullet_active swiper-pagination-bullet-active');
								}
							}
						});
					}
				});
		}
	}


	// Init skin-specific actions on first run
	// Attention! Don't forget to add the class "inited" and check it to prevent re-initialize the elements

	// Change param "slides per" in exactly sliders
	smartseo_add_filter( 'trx_addons_filter_slider_init_args', function( $param, $init ) {
		if( $init.parents('.slider_width_auto').length > 0 && ( $init.parents('.sc_portfolio_extra').length > 0 || $init.parents('.sc_portfolio_default').length > 0 ) ) {
			$param.slidesPerView = 'auto';
		}
		return $param;
	} );


	// Toggle for Filter
	function skin_blogger_toggle_filter_add_element() {
		if ( jQuery('.content').find(".sc_style_toggle").length > 0 ) {
			jQuery(" .sc_style_toggle").each(function() {
				var toggle_title = SMARTSEO_STORAGE['toggle_title'];
				jQuery(this).find('.sc_item_filters').append('<div class="title_wrap"><span class="toggle_title"></span><span class="active_tab"></span></div>');
				jQuery(this).find('.sc_item_filters .sc_item_filters_tabs').wrap('<div class="list_wrap"></div>');
				jQuery(this).find('.sc_item_filters .toggle_title').text(toggle_title);

				jQuery(this).find('span.active_tab')
					.mouseenter( function() {
							jQuery(this).parents('.sc_item_filters').find('.sc_item_filters_tabs').addClass('active');
						}
					);
				jQuery(this).find('.sc_blogger_filters')
					.mouseleave( function() {
							jQuery(this).find('.sc_item_filters_tabs').removeClass('active');
						}
					);
			})
		}
	}
	function skin_blogger_toggle_filter_upd_value() {
		if ( jQuery('.content').find(".sc_style_toggle").length > 0 ) {
			jQuery(" .sc_style_toggle").each(function() {
				var text = jQuery(this).find('.sc_item_filters .sc_item_filters_tabs .sc_item_filters_tabs_active a').text();
				jQuery(this).find('.sc_item_filters .active_tab').text(text);
			})
		}
	}
	function skin_add_custom_width_filter_list() {
		if ( jQuery('.content').find(".sc_style_toggle").length > 0 ) {
			jQuery('.sc_style_toggle .sc_item_filters_wrap .sc_item_filters').each(function() {
				var check_element = jQuery(this).find('.list_wrap');
				var width = jQuery(this).find( '.title_wrap' ).outerWidth();
				jQuery(check_element).css('width', 'calc(100% - ' + (width + 10) + 'px)');
			})
		}
	}
	// Move title with cursor
	function mousemove_for_portfolio_small() {
		if (jQuery( window ).width() > 1279 ) {
			if ( jQuery('.content').find(".sc_blogger_lay_portfolio_grid_grid_style_7").length > 0 ) {
				jQuery(".sc_blogger_lay_portfolio_grid_grid_style_7 .sc_blogger_item").each(function() {
					let $Target = jQuery(this);
					let $TargetInner = $Target.find('.post_info_bl');
					$Target.mousemove(function(event){
						let y = event.pageY - $Target.offset().top + 20;
						let x = event.pageX - $Target.offset().left + 20;
						$TargetInner.css({'top': y,'left': x,'bottom': "auto",'right': "auto",'opacity': 1});

					})
					.mouseleave(function() {
						$TargetInner.css({'top': 'auto','left': 30,'bottom': 30,'right': "auto",'opacity': 0});
					});
				});
			}
		}
	}
	// Add wrap in portfolio style
	function add_portfolio_image_wrap() {
		if ( jQuery('.content').find(".sc_blogger_lay_portfolio_grid_grid_style_7").length > 0 ) {
			var $item = jQuery(".sc_blogger_lay_portfolio_grid_grid_style_7 .sc_blogger_item:not(.inited_item)");
			$item.each(function() {
				jQuery(this).addClass('inited_item');
				jQuery(this).find(".bg_in").wrap('<div class="bg_in_wrap"></div>');
			});
		}

		if ( jQuery('.content').find(".sc_blogger_lay_portfolio_grid_grid_style_9").length > 0 ) {
			var $item = jQuery(".sc_blogger_lay_portfolio_grid_grid_style_9 .sc_blogger_item:not(.inited_item)");
			$item.each(function() {
				jQuery(this).addClass('inited_item');
				jQuery(this).find(".bg_in").wrap('<div class="bg_in_wrap"></div>');
			});
		}
	}
	// Move title with cursor
	function mousemove_for_portfolio_large() {
		if (jQuery( window ).width() > 1279 ) {
			if ( jQuery('.content').find(".sc_blogger_lay_portfolio_grid_grid_style_9").length > 0 ) {
				jQuery(".sc_blogger_lay_portfolio_grid_grid_style_9 .sc_blogger_item").each(function() {
					let $Target = jQuery(this);
					let $TargetInner = $Target.find('.post_info_bl');
					$Target.mousemove(function(event){
						let y = event.pageY - $Target.offset().top + 20;
						let x = event.pageX - $Target.offset().left + 20;
						$TargetInner.css({'top': y,'left': x,'bottom': "auto",'right': "auto",'opacity': 1 });
					})
						.mouseleave(function() {
							$TargetInner.css({'top': "auto",'left': 30,'bottom': 30,'right': "auto",'opacity': 0 });
						});
				});
			}
		}
	}
	/* Add image background on wrap in portfolio Stretch */
	function background_image_portfolio_stretch() {
		if ( jQuery('.content').find(".sc_blogger_portmodern").length > 0 ) {

            jQuery(".sc_blogger_portmodern .sc_blogger_item .sc_blogger_item_title").on( 'mouseover', function() {
                jQuery(this).addClass('active_item');
                jQuery(this).parents('.sc_blogger_content').addClass('active_items');
            }).on( 'mouseleave', function() {
                jQuery(this).removeClass('active_item');
		jQuery(this).parents('.sc_blogger_content').removeClass('active_items');
            });
			if (jQuery( window ).width() > 1279 ) {
				jQuery(".sc_blogger_portmodern .sc_blogger_item:not(.inited_item)").each(function() {
					let $Target = jQuery(this).addClass('inited_item');
					let $TargetInner = $Target.find('.sc_blogger_item_title');
					let $TargetInnerId = $TargetInner.data('item-id');
					let $TargetInnerImg = $TargetInner.data('item-image');
					if ( $TargetInnerImg ) {
						var obj = new Image();
						obj.src = $TargetInnerImg;
					}
					let $WrapImage = jQuery( this ).parents(".sc_blogger_portmodern").find(".decor_image_wrap");

					if( jQuery($WrapImage).find('#' + $TargetInnerId ).length <= 0 ) {
						jQuery($WrapImage).append('<div id="' + $TargetInnerId + '" class="image_item" ></div>');
						jQuery($TargetInner).on('mouseover', function() {
							let $NewTarget = jQuery( this ).parents(".sc_blogger_portmodern").find(".decor_image_wrap");
							jQuery($NewTarget).find('div#' + $TargetInnerId + '').css({'background-image': 'url(' + $TargetInnerImg + ')'});
						})
					}
				});
			}

			jQuery(".sc_blogger_portmodern .sc_blogger_item").each(function() {
				let $Target = jQuery(this);
				let $TargetInner = $Target.find('.sc_blogger_item_title');
				let $TargetInnerId = $TargetInner.data('item-id');
				let $WrapImage = jQuery( this ).parents(".sc_blogger_portmodern").find(".decor_image_wrap");
				jQuery($TargetInner).on('mouseover', function() {
					jQuery($WrapImage).find('div#' + $TargetInnerId + '').addClass('active_image')
				}).on( 'mouseleave', function() {
					let $WrapImage = jQuery( this ).parents(".sc_blogger_portmodern").find(".image_item");
					jQuery($WrapImage).removeClass('active_image');
				});
			});

			jQuery(".sc_blogger_portmodern .sc_blogger_item").each(function() {
				//jQuery(this).addClass('inited_description');
				jQuery(this).find(".sc_blogger_item_title").on( 'click', function() {
					let $eachTitleItem = jQuery( this ).parents(".sc_blogger_portmodern").find(".sc_blogger_item").find(".sc_blogger_item_title");
					let $WrapPreview = jQuery( this ).parents(".sc_blogger_portmodern").find(".portfolio_preview");
					let $PreviewDescription = jQuery($WrapPreview).find(".portfolio_description");
					let $PreviewImage = jQuery($WrapPreview).find(".portfolio_image");
					let $PreviewClose = jQuery($WrapPreview).find(".close");
					let $TargetInnerDetails = jQuery( this ).data('details');
					let $TargetInnerImg = jQuery( this ).data('item-image');
					$PreviewImage.css({'background-image': 'url(' + $TargetInnerImg + ')'});
					$PreviewDescription.html($TargetInnerDetails);
					jQuery($eachTitleItem).addClass('anim_fade');
					jQuery($WrapPreview).addClass('portfolio_preview_show');

					if( $WrapPreview.hasClass('portfolio_preview_show') ) {
						jQuery('html').addClass('portfolio_preview_opened');
						$PreviewClose.on('click', function() {
							jQuery('html').removeClass('portfolio_preview_opened');
							jQuery($eachTitleItem).removeClass('anim_fade');
							jQuery($WrapPreview).removeClass('portfolio_preview_show');
							jQuery($PreviewDescription).empty();
						});
						jQuery( window ).on( 'keyup', function(e) {
								if (e.keyCode === 27) {
									jQuery('html').removeClass('portfolio_preview_opened');
									jQuery($WrapPreview).removeClass('portfolio_preview_show');
									jQuery($eachTitleItem).removeClass('anim_fade');
									jQuery($PreviewDescription).empty();
								}
						});
					}

					//jQuery(document).trigger( 'action.init_hidden_elements', [$WrapPreview] );

					// Socials share
					//----------------------------------------------
					var $share_items = $PreviewDescription.find('.socials_share .social_items:not(.inited)');
					if ($share_items.length > 0) {
						$share_items
							.addClass('inited')
							.on('click', '.social_item_popup', function(e) {
								var url = jQuery(this).data('link');
								window.open(url, '_blank', 'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=480, height=400, toolbar=0, status=0');
								e.preventDefault();
								return false;
							})
							.on('click', '.social_item[data-copy-link-url]', function(e) {
								var $self = jQuery(this),
									url = $self.data('copy-link-url');
								if ( url != '' ) {
									trx_addons_copy_to_clipboard( url );
									var msg = $self.data('message') ? $self.data('message') : SMARTSEO_STORAGE['msg_copied'];
									if ( msg ) {
										$self.attr('data-tooltip-text', msg);
										setTimeout( function() {
											$self.removeAttr('data-tooltip-text');
										}, 3000 );
									}
								}
								e.preventDefault();
								return false;
							});
					}
				});
			});
		}
	}
	// Audio
	function smartseo_skin_audio_init() {
		jQuery('[class*="single_style_style-"]:not(.single_style_style-1):not(.single_style_style-3) .post_header_wrap_in_header .post_featured.with_audio.with_thumb:not(.audio_inited)').addClass('audio_inited').each(function() {
			var featured = jQuery(this);
			var audio_wrap = featured.find('.post_audio');
			var btn = jQuery('<div class="post_audio_btn"></div>');
			featured.prepend(btn);
			btn.on('click', function() {				
				audio_wrap.toggleClass('show');
				audio_wrap.find('.mejs-playpause-button').click();			
			});
		});
	}


	jQuery( window ).load(function() {

		// Audio
		smartseo_skin_audio_init();

		// Toggle for Filter
		skin_add_custom_width_filter_list();

		// Add image background on wrap in portfolio Stretch
		background_image_portfolio_stretch();

		smartseo_skin_post_header_init();

	});

	jQuery( document ).on(
		'action.ready_smartseo', function() {
			extra_margin_top_video_popup_button();
			// Move title with cursor
			mousemove_for_portfolio_large();
			mousemove_for_portfolio_small();

			// Toggle for Filter
			skin_blogger_toggle_filter_add_element();

			skin_blogger_controls_title();

			// Anim for 404 page
			if ( typeof window.TweenMax != 'undefined' ) {
				if (jQuery('.post_item_404').length > 0) {
					var $layer_1 = jQuery('.post_item_404 .svg-1'),
						$layer_2 = jQuery('.post_item_404 .svg-2'),
						$layer_3 = jQuery('.post_item_404 .svg-3'),
						$layer_4 = jQuery('.post_item_404 .svg-4'),
						$container = jQuery('.error404 .page_content_wrap'),
						container_w = $container.width(),
						container_h = $container.height();

					if ($layer_1.length > 0 || $layer_2.length > 0 || $layer_3.length > 0 || $layer_4.length > 0) {
						jQuery(window).on('mousemove.parallax', function (event) {
							var pos_x = event.pageX,
								pos_y = event.pageY,
								left = 0,
								top = 0;
							left = container_w / 2 - pos_x;
							top = container_h / 2 - pos_y;
							if ($layer_1.length > 0) {
								TweenMax.to(
									$layer_1,
									1,
									{
										css: {
											transform: 'translateX(' + left / 25 + 'px) translateY(' + top / 25 + 'px)'
										},
										ease: Power2.easeOut,
										overwrite: 'all' //'none'
									}
								);
							}
							if ($layer_2.length > 0) {
								TweenMax.to(
									$layer_2,
									1,
									{
										css: {
											transform: 'translateX(' + left / 35 + 'px) translateY(' + top / 35 + 'px)'
										},
										ease: Power2.easeOut,
										overwrite: 'all'
									}
								);
							}
							if ($layer_3.length > 0) {
								TweenMax.to(
									$layer_3,
									1,
									{
										css: {
											transform: 'translateX(' + left / 55 + 'px) translateY(' + top / 55 + 'px)'
										},
										ease: Power2.easeOut,
										overwrite: 'all' //'none'
									}
								);
							}
							if ($layer_4.length > 0) {
								TweenMax.to(
									$layer_4,
									1,
									{
										css: {
											transform: 'translateX(' + left / 70 + 'px) translateY(' + top / 70 + 'px)'
										},
										ease: Power2.easeOut,
										overwrite: 'all' //'none'
									}
								);
							}
						});
					}
				}
			}

			// for woo tinv
			if(jQuery('.woocommerce-product-gallery__wrapper > .tinv-wraper').length > 0) {
				var tinv = jQuery('.woocommerce-product-gallery__wrapper > .tinv-wraper');
				jQuery('.woocommerce-product-gallery__wrapper').after(tinv);
			}

			//Tilt 3d hover for Class - VanillaTiltHover
			if (jQuery( '.VanillaTiltHover' ).length > 0) {
				VanillaTilt.init(document.querySelectorAll('.VanillaTiltHover'), {
					max: 8,
					speed: 1000,
					scale: 1.05,
					transition: true,
					easing: 'cubic-bezier(.03,.98,.52,.99)',
					perspective: 1200,
				});
			}
			//Tilt 3d hover for teams
			if (jQuery( '.start-inner-3d' ).length > 0) {
				VanillaTilt.init(document.querySelectorAll('.start-inner-3d'), {
					max: 5,
					speed: 1000,
					scale: 1,
					transition: true,
					easing: 'cubic-bezier(.03,.98,.52,.99)',
					perspective: 1500,
				});
			}

            //Tilt 3d hover
	        if (jQuery( '.tilt_action' ).length > 0) {
                VanillaTilt.init(document.querySelectorAll('.tilt_action'), {
                    max: 8,
                    speed: 1000,
                    scale: 1.05,
                    transition: true,
                    easing: 'cubic-bezier(.03,.98,.52,.99)',
                    perspective: 1400,
                });
            }

			//Tilt 3d hover for cat list
			if (jQuery( '.tilt_action_cat_list' ).length > 0) {
				VanillaTilt.init(document.querySelectorAll('.tilt_action_cat_list'), {
					max: 8,
					speed: 1500,
					scale: 1.02,
					transition: true,
					easing: 'cubic-bezier(.03,.98,.52,.99)',
					perspective: 2400,
				});
			}

            // Process Tribe Events view after it was reloaded by AJAX
			jQuery('.tribe-events-view').on( 'beforeAjaxComplete.tribeEvents beforeAjaxSuccess.tribeEvents beforeAjaxError.tribeEvents', smartseo_tribe_events_after_ajax );
			function smartseo_tribe_events_after_ajax( jqXHR, textStatus ) {
				setTimeout( function() {
					// Set up event handler again because .tribe-events-view was recreated after AJAX
					jQuery('.tribe-events-view').on( 'beforeAjaxComplete.tribeEvents beforeAjaxSuccess.tribeEvents beforeAjaxError.tribeEvents', smartseo_tribe_events_after_ajax );
					// ToDo: Any actions after the Tribe Events View is reloaded

				}, 10 );
			}

			jQuery('.wpcf7-submit').wrap("<span class='wpcf7-submit-style'></span>").after("<span class='submit-style-in'></span>");

			// style line
			if (jQuery( 'div.wpcf7 .style-line .wpcf7-form-control-wrap' ).length > 0) {
				jQuery( 'div.wpcf7 .style-line .wpcf7-form-control-wrap' ).each(
					function () {
						jQuery(this).append('<span class="line"></span>');
					}
				);
			}

			function textarea_auto_height(txt) {
				var hiddenDiv = jQuery(document.createElement('div')),
					content = null;
				txt.addClass('noscroll');
				hiddenDiv.addClass('hiddendiv');
				txt.after(hiddenDiv);
				if(txt.val()) {
					hiddenDiv.html(txt.val());
					txt.animate({ 'height' : hiddenDiv.outerHeight()
					},800);
				}
				txt.bind('keyup', function() {
					content = txt.val();
					content = content.replace(/\n/g, '<br>');
					hiddenDiv.html(content);
					txt.animate({ 'height' : hiddenDiv.outerHeight()
					},50);
				});
			}

			if (jQuery( 'div.wpcf7 .form-style-2 textarea' ).length > 0) {
				jQuery( 'div.wpcf7 .form-style-2 textarea' ).each(
					function () {
						textarea_auto_height(jQuery(this));
					});
			}

			// mc4wp - id
			if (jQuery( '.mc4wp-form-fields' ).length > 0) {
				var count_mc4wp = 1;
				jQuery( '.mc4wp-form-fields' ).each(
					function () {
						jQuery(this).find('input[type="checkbox"]').each(
							function () {
								var id = jQuery(this).attr( 'id' );
								if(id) {}
								else {
									id = 'go';
								}
								jQuery(this).attr('id', id + count_mc4wp);
								jQuery(this).next('label').attr('for', id + count_mc4wp);
								count_mc4wp++;
							});
					});
			}

			function mc4wpGO(form) {
				jQuery(form).each(function () {

					var form = jQuery(this),
						btn = form.find('button, input[type="submit"], input[type="button"]');
					var $i_agree = form.find('input[type="checkbox"][name="i_agree_privacy_policy"]:not(.inited)'
						+ ',input[type="checkbox"][name="gdpr_terms"]:not(.inited)'
						+ ',input[type="checkbox"][name="wpgdprc"]:not(.inited)'
						+ ',input[type="checkbox"][name="AGREE_TO_TERMS"]:not(.inited)'
					);
					form.addClass('inited_validation');

					if ( $i_agree.length > 0 ) {
						$i_agree.addClass( 'inited' );
					}

					btn.on( 'click', function(e) {
						form.find('.trx_addons_message_box').remove();

						if ( $i_agree.length > 0 ) {
							if ( ! $i_agree.get(0).checked ) {
								form.append( '<div class="trx_addons_message_box trx_addons_message_box_error">' + SMARTSEO_STORAGE['msg_i_agree_error'] + '</div>' );
								var error_msg = form.find('.trx_addons_message_box');
								error_msg.fadeIn(600);
								setTimeout( function() {
									error_msg.fadeOut( 600, function() {error_msg = form.find('.trx_addons_message_box');
										error_msg.remove();
									} );
								}, 3000 );

								e.preventDefault();
								return false;
							}
						}

						var rez = smartseo_form_validate(form, {
							error_message_show: true,
							error_message_time: 3000,
							error_message_class: 'trx_addons_message_box trx_addons_message_box_error',
							error_message_text: 'Global error text',
							error_fields_class: 'mc4wp_error_field',
							exit_after_first_error: true,
							rules: [
								{
									field: 'EMAIL',
									min_length: {value: 7, message: SMARTSEO_STORAGE['mc4wp_msg_email_min']},
									max_length: {value: 60, message: SMARTSEO_STORAGE['mc4wp_msg_email_max']},
									mask: {
										value: '^([a-zA-Z0-9_\\-]+\\.)*[a-zA-Z0-9_\\-]+@[a-zA-Z0-9_\\-]+(\\.[a-zA-Z0-9_\\-]+)*\\.[a-zA-Z]{2,6}$',
										message: 'Invalid email address'
									}
								},
							]
						});

						if (!rez) {
							jQuery(form).submit();
						}
						else {
							e.preventDefault();
							return rez;
						}

					});
				});
			}
			mc4wpGO(jQuery(".mc4wp-form:not(.inited_validation)"));

			var $document = jQuery(document),
				body = jQuery('body');

			// Open/Close mobile menu
			$document.on( 'action.mobile_menu_open', function(e, $menu) {
				$menu.find( '.menu_mobile_widgets_area a[href*="mailto"]').addClass( 'underline_anim' );
                setTimeout(
                    function() {
                        $menu.find( '.menu_mobile_widgets_area a[href*="mailto"]' ).addClass( 'underline_do_hover' );
                    }, 600
                );
			} );
			$document.on( 'action.mobile_menu_close', function(e, $menu) {
				$menu.addClass( 'out_anim' );
                setTimeout( function () {
                    $menu.removeClass('out_anim');
					jQuery('.menu_mobile_widgets_area a[href*="mailto"]').removeClass('underline_do_hover');
                }, 1000);
			} );
			smartseo_add_filter( 'smartseo_filter_mobile_menu_close_timeout', function( timeout, $menu ) {
				return 1000;
			} );

            // Open/Close panel menu
			// Prepare links to panel
            body.find('.sc_layouts_panel_menu:not(.inited)').each( function() {
				var self = jQuery(this),
					id = self.attr('id');
				if (!id) return;
				var link = jQuery('a[href="#'+id+'"]');
				if (link.length === 0) {
					body.append('<a href="#'+id+'" class="trx_addons_hidden"></a>');
					link = jQuery('a[href="#'+id+'"]');
				}
				link.addClass('trx_addons_panel_menu_link');
			});

            // Display panel on click on the panel link
            function smartseo_skin_open_panel( id ) {
                var $panel = jQuery( '#' + id ).addClass( 'opened' );
                $panel.prev('.sc_layouts_panel_menu_overlay' ).fadeIn();
                $panel.find( '[class*="trx_addons_title_with_link"] > a:not(.underline_anim)' ).addClass( 'underline_anim' );
                setTimeout(
                    function() {
                        $panel.find( '[class*="trx_addons_title_with_link"] > a.underline_anim' ).addClass( 'underline_do_hover' );
                    }, 600
                );
                body.addClass( 'sc_layouts_panel_menu_opened' );
                $document.trigger( 'action.stop_wheel_handlers' );
            }

            jQuery( '.trx_addons_panel_menu_link:not(.panel_inited)' )
				.addClass( 'panel_inited' )
				.on( 'click', function(e) {
					smartseo_skin_open_panel( jQuery(this).attr('href').substring(1) );
					e.preventDefault();
					return false;
				});

            // Close panel
            function smartseo_skin_close_panel() {

               var $panel = jQuery( '.sc_layouts_panel_menu.opened' ).addClass( 'out_anim' );

                jQuery( '.sc_layouts_panel_menu_close' ).parents( 'sc_layouts_panel_menu' ).addClass( 'out_anim' );

                setTimeout(function () {
                    $panel.prev( '.sc_layouts_panel_menu_overlay' ).fadeOut();
                    $panel.removeClass('out_anim').removeClass('opened');
                    $panel.find('[class*="trx_addons_title_with_link"] > a.underline_anim').removeClass('underline_do_hover');
                    body.removeClass( 'sc_layouts_panel_menu_opened' );
                    $document.trigger( 'action.start_wheel_handlers' );
                }, 1000);
            }
            $document
                .on( 'keyup', function(e) {
                	var $panel = jQuery( '.sc_layouts_panel_menu.opened');
					if (e.keyCode === 27) {
						if  ($panel.length === 1) {
							smartseo_skin_close_panel();
							e.preventDefault();
							return false;
						}
					}
                }
            );

            jQuery( '.sc_layouts_panel_menu_close, .sc_layouts_panel_menu_overlay' )
				.on( 'click', function(e) {
					smartseo_skin_close_panel();
					e.preventDefault();
					return false;
           		}
            );

            jQuery( '.sc_layouts_panel_menu_close' )
                .on( 'keyup', function(e) {
                    var $panel = jQuery( '.sc_layouts_panel_menu.opened');
                    if (e.keyCode === 13) {
                        if ($panel.length === 1) {
                            smartseo_skin_close_panel();
                            e.preventDefault();
                            return false;
                        }
                    }
                } )
                .on( 'focus', function() {
                    if ( ! body.hasClass( 'sc_layouts_panel_menu_opened' ) ) {
                        jQuery( '#content_skip_link_anchor' ).focus();
                    }
                } );

        }
	);

    // Search Modern -----------------
    //-------------------------------
	var $search_wrap = jQuery( '.search_modern .search_wrap:not(.inited)' );

    if ( $search_wrap.length > 0 ) {
        jQuery( $search_wrap.each( function() {
            var $body =  jQuery('body'),
				$search_wrap_init = jQuery(this).addClass( 'inited' ),
                search_field = $search_wrap_init.find( '.search_field' ),
           	    ajax_timer = null;

            // ESC is pressed
            search_field.on('keyup', function(e) {
                if (e.keyCode === 27) {
                    search_field.val('');
                    $body.addClass('search_out_anim');
                    setTimeout(function () {
                        smartseo_search_close($search_wrap_init);
                        $body.removeClass('search_open_anim');
                        $body.removeClass('search_out_anim');
                        $search_wrap_init.next( '.search_overlay' ).fadeOut();

                        e.preventDefault();
                        return false;
                    }, 800);

                    setTimeout(function () {
                        $search_wrap_init.parent().removeClass('search_active');
                        $body.removeClass('search_active');
                    }, 1200);
                }
                // AJAX search
                if ($search_wrap_init.hasClass('search_ajax')) {
                    var s = search_field.val();
                    if (ajax_timer) {
                        clearTimeout(ajax_timer);
                        ajax_timer = null;
                    }
                    if (s.length >= 4) {
                        ajax_timer = setTimeout(function () {
                            $search_wrap_init.addClass('search_progress');
                            jQuery.post(TRX_ADDONS_STORAGE['ajax_url'], {
                                action: 'ajax_search',
                                nonce: TRX_ADDONS_STORAGE['ajax_nonce'],
                                text: s,
                                post_types: $search_wrap_init.find('input[name="post_types"]').val()
                            }).done(function (response) {
                                clearTimeout(ajax_timer);
                                ajax_timer = null;
                                var rez = {};
                                if (response == '' || response == 0) {
                                    rez = {error: TRX_ADDONS_STORAGE['msg_search_error']};
                                } else {
                                    try {
                                        rez = JSON.parse(response);
                                    } catch (e) {
                                        rez = {error: TRX_ADDONS_STORAGE['msg_search_error']};
                                        console.log(response);
                                    }
                                }
                                var msg = rez.error === '' ? rez.data : rez.error;
                                $search_wrap_init.removeClass('search_progress');
                                search_field.parents('.search_ajax').find('.search_results_content').empty().append(msg);
                                search_field.parents('.search_ajax').find('.search_results').fadeIn();
                                jQuery(document).trigger('action.got_ajax_response', {
                                    action: 'ajax_search',
                                    result: rez
                                });
                            });
                        }, 500);
                    }
                }

            });

            //Search Submit
			var  $search = $search_wrap_init.prev('.search_submit');
            $search.on('click', function(e) {
                $search_wrap_init.parent().addClass('search_active');
                $body.addClass('search_active');
                if (!$search_wrap_init.hasClass('search_opened')) {
                    $search_wrap_init.addClass('search_opened');
                    $body.addClass('search_open_anim');
                    $search_wrap_init.next( '.search_overlay' ).fadeIn();
                    setTimeout(function() { search_field.get(0).focus(); }, 500);
                } else if (search_field.val() === '') {
                    if ($search_wrap_init.hasClass('search_opened'))
                            smartseo_search_close($search_wrap_init);
                    else
                        search_field.get(0).focus();
                } else {
                    $search_wrap_init.addClass('search_progress');
                    $search_wrap_init.find('form').get(0).submit();
                }
                e.preventDefault();
                return false;
            });

            // Click "Search close"
            $search_wrap_init.find('.search_close').add(
            $search_wrap_init.next('.search_overlay')
			).on('click', function(e) {
                $body.addClass('search_out_anim');

                setTimeout(function () {
                    smartseo_search_close($search_wrap_init);
                    $body.removeClass('search_open_anim');
                    $body.removeClass('search_out_anim');
                    $search_wrap_init.next( '.search_overlay' ).fadeOut();

                    e.preventDefault();
                    return false;
                }, 800);

                setTimeout(function () {
                    $search_wrap_init.parent().removeClass('search_active');
                    $body.removeClass('search_active');
                }, 1200);

            });

            // Click "Close search results"
            $search_wrap_init.find('.search_results_close').on('click', function(e) {
                jQuery(this).parent().fadeOut();
                e.preventDefault();
                return false;
            });
            // Click "More results"
            $search_wrap_init.on('click', '.search_more', function(e) {
                if (search_field.val() !== '')
                    $search_wrap_init.find('form').get(0).submit();
                e.preventDefault();
                return false;
            });
        }));
    }
    // Close search field (remove class 'search_opened' and close search results)
    function smartseo_search_close($search_wrap_init) {
        $search_wrap_init.removeClass('search_opened');
        $search_wrap_init.find('.search_results').fadeOut();
    }

	// Add skin specific styles to the Google map
	jQuery(document).on('action.add_googlemap_styles', function(e) {
		if (typeof TRX_ADDONS_STORAGE == 'undefined') return;
		TRX_ADDONS_STORAGE['googlemap_styles']['extra'] = [{"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#e9e9e9"}, {"lightness": 17}]}, {"featureType": "landscape", "elementType": "geometry", "stylers": [{"color": "#f5f5f5"}, {"lightness": 20}]}, {"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"color": "#ffffff"}, {"lightness": 17}]}, {"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"color": "#ffffff"}, {"lightness": 29}, {"weight": 0.2}]}, {"featureType": "road.arterial", "elementType": "geometry", "stylers": [{"color": "#ffffff"}, {"lightness": 18}]}, {"featureType": "road.local", "elementType": "geometry", "stylers": [{"color": "#ffffff"}, {"lightness": 16}]}, {"featureType": "poi", "elementType": "geometry", "stylers": [{"color": "#f5f5f5"}, {"lightness": 21}]}, {"featureType": "poi.park", "elementType": "geometry", "stylers": [{"color": "#dedede"}, {"lightness": 21}]}, {"elementType": "labels.text.stroke", "stylers": [{"visibility": "on"}, {"color": "#ffffff"}, {"lightness": 16}]}, {"elementType": "labels.text.fill", "stylers": [{"saturation": 36}, {"color": "#333333"}, {"lightness": 40}]}, {"elementType": "labels.icon", "stylers": [{"visibility": "off"}]}, {"featureType": "transit", "elementType": "geometry", "stylers": [{"color": "#f2f2f2"}, {"lightness": 19}]}, {"featureType": "administrative", "elementType": "geometry.fill", "stylers": [{"color": "#fefefe"}, {"lightness": 20}]}, {"featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{"color": "#fefefe"}, {"lightness": 17}, {"weight": 1.2}]}];
        TRX_ADDONS_STORAGE['googlemap_styles']['modern'] = [{"featureType": "all", "elementType": "labels.text.fill", "stylers": [{"color": "#928ec3"}]}, {"featureType": "administrative", "elementType": "all", "stylers": [{"visibility": "on"}]}, {"featureType": "landscape", "elementType": "geometry", "stylers": [{"visibility": "simplified"}, {"color": "#f0f4f6"}]}, {"featureType": "poi", "elementType": "geometry", "stylers": [{"visibility": "simplified"}, {"color": "#fcfcfc"}]}, {"featureType": "road.highway", "elementType": "geometry", "stylers": [{"visibility": "simplified"}, {"color": "#fffbfb"}]}, {"featureType": "road.arterial", "elementType": "geometry", "stylers": [{"visibility": "simplified"}, {"color": "#ffffff"}]}, {"featureType": "road.local", "elementType": "geometry", "stylers": [{"visibility": "simplified"}, {"color": "#eeeeee"}]}, {"featureType": "water", "elementType": "geometry", "stylers": [{"visibility": "simplified"}, {"color": "#dddddd"}]}];
	} );

    // Init skin-specific hidden elements when their parent container becomes visible
	// Attention! Don't forget to add the class "inited" and check it to prevent re-initialize the elements
	jQuery( document ).on(
		'action.init_hidden_elements', function() {
			skin_blogger_toggle_filter_upd_value();
			skin_add_custom_width_filter_list();
			// Move title with cursor
			mousemove_for_portfolio_large();
			mousemove_for_portfolio_small();

			add_portfolio_image_wrap();

			// Add image background on wrap in portfolio Stretch
			background_image_portfolio_stretch();

			skin_blogger_controls_title();
		}
	);

	// Skin-specific scroll actions
	jQuery( document ).on(
		'action.scroll_smartseo', function() {

		}
	);

	// Skin-specific resize actions
	jQuery( document ).on(
		'action.resize_smartseo', function() {
			extra_margin_top_video_popup_button();
			smartseo_skin_post_header_init();
			skin_add_custom_width_filter_list();
			max_same_height(".max-same-height");
			jQuery('.timetable-style').each(function () {
				max_same_height('.timetable-style .elementor-widget-heading');
			});
		}
	);

	function extra_margin_top_video_popup_button() {
		if (jQuery('.single-format-video .post_header_wrap_style_style-1 .post_featured.with_video.with_thumb.post_featured_bg + .post_header').length > 0) {
			var alter_height = jQuery('.single-format-video .post_header_wrap_style_style-1 .post_featured.with_video.with_thumb.post_featured_bg + .post_header').height();
			jQuery('.single-format-video .post_header_wrap_style_style-1 .post_featured.with_video.with_thumb.post_featured_bg .post_video_hover_popup').css({"margin-top": (- alter_height / 2 + 'px'), "opacity":1});
		}
	}

	// Maximum Same Height
	function max_same_height(block) {
		var mh = 0;
		if(jQuery(block).length > 0) {
			jQuery(block).height('auto');
			jQuery(block).each(function () {
				var h_block = parseInt(jQuery(this).height());
				if(h_block > mh) {
					mh = h_block;
				};
			});
			jQuery(block).height(mh);
		}
	}

	// Click woo filter button
	jQuery( '.smartseo_woocommerce_filters_button,.sidebar > .sidebar_close,.sidebar_overlay' ).on( 'click', function(e) {
		var sidebar_float = jQuery( '.sidebar.sidebar_float' );
		sidebar_float.addClass('float_anim');
		setTimeout(function () {
			sidebar_float.removeClass('float_anim');
			e.preventDefault();
			return false;
		}, 400);
	});
	
	// Button Slide
	jQuery('.sc_button_slide').each(function() {
		var $item = jQuery(this);
		$item.off('.button-slide')
		.on('mouseenter.button-slide', function() {
			if ($item.hasClass("hovered") || ($item.addClass("hovered"), setTimeout(function() {
					$item.removeClass("hovered");
				}, 1200))) {}
		});
	});

})();
