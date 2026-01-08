if( window.navigator.userAgent.toLowerCase().indexOf("msie ") > -1 || !!navigator.userAgent.match(/Trident.*rv\:11\./) ) {
	//if internet Explorer
	document.body.innerHTML = document.getElementById('not-supported-html').innerHTML;
} else {
	//-------------------------------------------------------
	// Swiper only on Tablet or Mobile
	if(
		document.querySelectorAll('.swiper-on-desktop').length || 
		document.querySelectorAll('.swiper-on-tablet').length || 
		document.querySelectorAll('.swiper-on-mobile').length
	) {
		window.addEventListener('resize', function() {
			initMultiSwipers();
		});
	}
	// MULTI swiper
	initMultiSwipers();
	function initMultiSwipers() {
		window.multiSwipers = window.multiSwipers || [];
		document.querySelectorAll('.multi-swipers').length && (function(){
			document.querySelectorAll('.multi-swipers').forEach(function(e,i){
				let is_swiper_alive = window.multiSwipers[i] && ! window.multiSwipers[i].destroyed;
				if (
					( e.classList.contains('swiper-on-desktop') && window.innerWidth <= 767 ) ||
					( e.classList.contains('swiper-on-tablet') && window.innerWidth > 991 ) ||
					( e.classList.contains('swiper-on-mobile') && window.innerWidth > 767 )
				) {
					if( is_swiper_alive ) {
						window.multiSwipers[i].destroy(true, true);
					}
					return;
				}
				if( is_swiper_alive ) {
					return;
				}
				
				if( ! e.getAttribute('data-items') ) {
					alert('Missing swiper attribute data-items');
				}
				
				let itemNum				= ( e.getAttribute('data-items') != 'auto' ) ? parseInt( e.getAttribute('data-items') ) : 'auto';
				let autoplay			= e.getAttribute('data-autoplay') ? parseInt( e.getAttribute('data-autoplay'), 10 ) : false;
				let itemArrows			= e.getAttribute('data-arrows') ? true : false;
				let nested				= e.getAttribute('data-nested') ? true : false;
				let speed				= e.getAttribute('data-speed') ? parseInt( e.getAttribute('data-speed'), 10 ) : 600;
				let margin				= e.getAttribute('data-margin') ? parseInt( e.getAttribute('data-margin'), 10 ) : 0;
				let itemPagination		= e.getAttribute('data-pagination') ? true : false;
				let paginationType		= e.getAttribute('data-pagination-type') ? e.getAttribute('data-pagination-type') : 'bullets';
				let breakpoints_1025	= e.getAttribute('data-breakpoints-1025');
				let breakpoints_992		= e.getAttribute('data-breakpoints-992');
				let breakpoints_768		= e.getAttribute('data-breakpoints-768');
				let breakpoints_600		= e.getAttribute('data-breakpoints-600');
				let centeredSlides		= e.getAttribute('data-center-slides') ? true : false;
				let effect				= e.getAttribute('data-effect') || 'slide'; // "slide", "fade", "cube", "coverflow" or "flip"
				let startSlideFrom		= e.getAttribute('data-start') ? parseInt( e.getAttribute('data-start'), 10 ) : 0;
				let rtl 				= ( e.getAttribute('data-rtl') || document.querySelector('html').getAttribute('dir') === 'rtl' ) ? true : false;
				let loop				= e.getAttribute('data-loop') ? true : false;
				if( loop && itemNum != 'auto' && e.querySelectorAll('.swiper-slide').length <= itemNum ) {
					loop = false;
				}
				
				// breakpoints - לא כל הפרמטרים עובדים ב
				// effect / pagination / loopedSlides -> breakpoints - לא עובדים ב
				
				let breakpoints = {};
				if( breakpoints_1025 ) {  //min-width: 1025px
					breakpoints['1025'] = JSON.parse( breakpoints_1025 );
				}
				if( breakpoints_992 ) {  //min-width: 992px
					breakpoints['992'] = JSON.parse( breakpoints_992 );
				}
				if( breakpoints_768 ) {  //min-width: 768px
					breakpoints['768'] = JSON.parse( breakpoints_768 );
				}
				if( breakpoints_600 ) {  //min-width: 600px
					breakpoints['600'] = JSON.parse( breakpoints_600 );
				}
				
				let wrap = e.closest('.swiper-wrap') ? e.closest('.swiper-wrap') : e.parentElement;
				let next = wrap.querySelectorAll('.next');
				let prev = wrap.querySelectorAll('.prev');
				let pagination = wrap.querySelector('.swiper-pagination');
				let nextBtns = [];
				let prevBtns = [];
				for( let n = 0; n < next.length; n++ ) {
					nextBtns.push( next[n] );
				};
				for( let p = 0; p < prev.length; p++ ) {
					prevBtns.push( prev[p] );
				};
				let options = e.getAttribute('data-options') ? JSON.parse( e.getAttribute('data-options') ) : '';
				let swiperConfig = options || {
					slidesPerView			: itemNum,
					spaceBetween			: margin,
					autoplay				: autoplay ? {
												delay: autoplay,
												pauseOnMouseEnter: true
											} : false,
					speed					: speed,
					effect 					: effect,
					loop					: loop,
					rtl						: rtl,
					updateOnImagesReady		: true,
					preventClicks			: true,
					centerInsufficientSlides: true,
					touchMoveStopPropagation: true,
					watchSlidesProgress		: true,
					grabCursor				: true,
					keyboard				: true,
					nested					: nested,
					breakpoints				: breakpoints,
					centeredSlides			: centeredSlides,
					initialSlide			: startSlideFrom,
					pagination				: itemPagination ? {
												el 			 : pagination,
												clickable	 : true,
												renderBullet : function (i, className) {
													return '<button type="button" class="'+className+'" aria-label="לחצו כאן למעבר לשקופית '+(i+1)+'"></button>';
												},
												type : paginationType
											} : false,
					navigation				: itemArrows ? {
												nextEl : nextBtns,
												prevEl : prevBtns,
											} : false,
					a11y					: {
												prevSlideMessage: 'מעבר לשקופית הקודמת',
												nextSlideMessage: 'מעבר לשקופית הבאה',
											  },
					on						: {
												slideChange: function(swiper){
													// Accessibility
													if( e.querySelector('.swiper-pagination-bullet:focus') ) {
														e.querySelector('.swiper-pagination-bullet-active').focus();
													}
												}
											}
				};
				
				if( window.multiSwipers[i] ) {
					window.multiSwipers[i] = new Swiper(e,swiperConfig);
				} else {
					window.multiSwipers.push( new Swiper(e,swiperConfig) );
				}
			});
		}());
	};
	//-------------------------------------------------------
	
	jQuery('html').keyup( function( e ) {
		if( e.keyCode == 27 ) { //Esc
			close_main_menu();
			closeTopSearch();
		}
	});
	
	// Click overlay
	jQuery('.overlay-btn').on('click', function(){
		close_main_menu();
		closeTopSearch();
	});
	
	// Mobile menu button
	if( document.querySelector('#menu-btn') ) {
		document.querySelector('#menu-btn').addEventListener('click',function(){
			if( document.querySelector('.mobile-menu-is-open') ) {
				close_main_menu();
			} else {
				jQuery('body.search-is-open').removeClass('search-is-open');
				document.querySelector('body').classList.add('mobile-menu-is-open');
				jQuery('#menu-btn').attr({
					'aria-label': 'סגירת תפריט',
					'aria-expanded': true
				});
				setTimeout(function(){
					jQuery('#page-nav a').first().focus();
				}, 50);
			}
		});
	}
	//Close menu
	function close_main_menu() {
		if( document.querySelector('.mobile-menu-is-open') ) {
			document.querySelector('body').classList.remove('mobile-menu-is-open');
			jQuery('#menu-btn').attr({
				'aria-label': 'פתיחת תפריט',
				'aria-expanded': false
			});
			jQuery('#menu-btn').focus();
		}
	}
	if( jQuery('.menu-item-has-children > a').length ) {
		jQuery('.menu-item-has-children > a').attr({
			'rel': 'nofollow',
			'aria-expanded': 'false'
		});
	}
	//Accessibility - Focus on sub menu arrow
	jQuery(document).on('click', '.menu-item-has-children > a', function(e){
		e.preventDefault();
		openSubMenu({ self: jQuery(this) });
	});
	function openSubMenu( obj ){
		let ariaExpanded = obj.self.attr('aria-expanded') === 'true';
		jQuery('li.menu-item-has-children > a').not( obj.self ).attr('aria-expanded', false).closest('li').removeClass('focus');
		obj.self.attr('aria-expanded', ! ariaExpanded).closest('li').toggleClass('focus');
	}
	// Accessibility - Close sub menu on blur
	jQuery('li.menu-item-has-children > ul > li:first-child *, li.menu-item-has-children > ul > li:last-child *').blur(function(){
		if( blurTimeout ) {
			clearTimeout( blurTimeout );
		}
		let self = jQuery(this);
		let blurTimeout = setTimeout(function(){
			if( ! self.closest('ul').find('*:focus').length ) {
				self.closest('li.focus').removeClass('focus');
			}
		}, 200);
	});
	
	// accessible contact form 7 focus validation
	// list of contact form 7 DOM events: https://contactform7.com/dom-events/
	jQuery(".wpcf7").on("wpcf7invalid", function (event) {
		jQuery(this).find(".wpcf7-not-valid").first().focus();
	});
	
	// Open top search
	jQuery('#top-search-btn').click(function(){
		jQuery('body.mobile-menu-is-open').removeClass('mobile-menu-is-open');
		jQuery('body').addClass('search-is-open');
		jQuery('.menu-item-has-children.focus').removeClass('focus');
		setTimeout(function(){
			jQuery('#top-search-wrap .search-field').focus();
		}, 100);
	});
	// Close top search
	jQuery('.close-top-search').click(function(){
		closeTopSearch();
	});
	function closeTopSearch(){
		if( jQuery('body').hasClass('search-is-open') ) {
			jQuery('body').removeClass('search-is-open');
			jQuery('#top-search-btn').focus();
		}
	};
	
	// A11y - inner focus
	document.addEventListener('keydown', function (event) {
		const body = document.querySelector('body');
		let innerFocus = false;
		let boxWrap;
		
		// לשנות בהתאם
		if ( body.classList.contains('search-is-open') ) { 
			innerFocus = true;
			boxWrap = jQuery('#top-search-wrap');
		} else if ( body.classList.contains('mobile-menu-is-open') ) { 
			innerFocus = true;
			boxWrap = jQuery('#page-header');
		}
		
		if ( innerFocus ) {
			const focusableElements = boxWrap.find('button:visible, input:not(:disabled):not([type="hidden"]), a:visible, select');
			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			if (event.key === 'Tab') {
				if (event.shiftKey) { // Shift + Tab
					if (document.activeElement === firstElement) {
						event.preventDefault();
						lastElement.focus();
					}
				} else { // Tab
					if (document.activeElement === lastElement) {
						event.preventDefault();
						firstElement.focus();
					}
				}
			}
		}
	});
	//Commas
	Number.prototype.sumify = function( toFixed, minusBrackets, isDebugger ) {
		let that = this;
		let fixedPrasm = typeof toFixed == 'number' ? toFixed : 2;
		let putBrackets = minusBrackets && this < 0;
		if( putBrackets )
			that = that * -1;
		that = ( Math.round( that * Math.pow( 10, fixedPrasm ) ) ) / ( Math.pow( 10.0, fixedPrasm ) );
		if( isDebugger )
			throw new Error(that);
		if( toFixed ) {
			that = that.toFixed(fixedPrasm);
			if( that.endsWith('.00') ) {
				that = parseInt( that, 10 );
			}
		}else{
			that = parseInt(that); 
		}
		that = that.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		if( putBrackets ) {
			that = '(' + that + ')';
		}
		return that;
	}
	String.prototype.endsWith = function( suffix ) {
		return this.match( suffix + "$" ) == suffix;
	};
	
	
	function running_numbers( self ) {
		self.prop('Counter',0).animate({
			Counter: parseInt( self.attr('data-number').replace(/,/g,''), 10 )
		}, {
			duration: 3000,
			easing: 'swing',
			step: function ( now ) {
				self.text( Math.ceil( now ).sumify() ); // sumify() אם לא מעתיקים את הפונקציה של הפסיקים אז למחוק את
			}
		});
	}
	//waypoint numbers
	jQuery('.waypoint-numbers').each(function(i){
		let waypoint = new Waypoint({
			element	: jQuery('.waypoint-numbers')[i],
			offset	: '100%',
			handler	: function( direction ) {
				if( direction == 'down' ) {
					//Running numbers
					jQuery('.waypoint-numbers').eq(i).find('.js-numbers-counter').each(function () {
						running_numbers( jQuery(this) );
					});
				}
			}
		});
	});
	// Add labels to inputs
	add_labels_to_inputs();
	function add_labels_to_inputs(){
		if( ! document.querySelectorAll('.wpcf7-form-control:not(.wpcf7-submit):not(span):not([type="hidden"])').length ) {
			return false;
		}
		document.querySelectorAll('.wpcf7-form-control:not(.wpcf7-submit):not(span):not([type="hidden"])').forEach( function(e, i) {
			if( e.classList.contains('js-for-label') ) {
				return;
			}
			let placeholder = '';
			if( e.tagName === 'SELECT' ) {
				placeholder = e.querySelectorAll('option')[0].innerText;
			} else if( e.classList.contains('wpcf7-file') && e.parentElement.parentElement.querySelector('.file-input-val-text') ) {
				placeholder = e.parentElement.parentElement.querySelector('.file-input-val-text').getAttribute('data-default-text');
			} else {
				placeholder = e.getAttribute('placeholder');
			}
			let name = e.getAttribute('name');
			let id = name + 'Input' + i;
			e.classList.add('js-for-label');
			e.setAttribute('id', id);
			
			let label = document.createElement("label");
			label.innerHTML = '<span>' + placeholder + '</span>';
			label.className = 'inputs-label hide-inputs-label';
			label.setAttribute('for', id);
			
			if( e.classList.contains('wpcf7-file') )
				insertAfter(e.parentElement, label);
			else
				insertAfter(e, label);
		});
		showLabels();
	}
	function insertAfter(referenceNode, newNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	};
	// Placeholder
	function showLabels() {
		if( ! document.querySelectorAll('.js-for-label').length ) {
			return false;
		}
		document.querySelectorAll('.js-for-label').forEach( function(field, i) {
			field.addEventListener("change", function(){
				checkIfVal( field );
			});
			checkIfVal( field );
		});
		document.querySelectorAll('.hide-inputs-label').forEach( function(label, i) {
			label.classList.remove('hide-inputs-label');
		});
		
		for( let i = 0; i < document.querySelectorAll('.js-for-label:not(select)').length; i++ ) {
			let input = document.querySelectorAll('.js-for-label:not(select)')[i];
			input.setAttribute('data-default-placeholder', input.placeholder);
			input.addEventListener("focus", function(){
				this.setAttribute('placeholder', '');
			});
			input.addEventListener("blur", function(){
				this.setAttribute('placeholder', this.getAttribute('data-default-placeholder'));
			});
		};
	};
	function checkIfVal( field ) {
		if( field.tagName === 'SELECT' ) {
			if( field.value && field.value.length && field.firstElementChild.innerText != field.value ) {
				field.classList.remove('val-is-empty');
			} else {
				field.classList.add('val-is-empty');
			}
		} else {
			if( field.value && field.value.length ) {
				field.classList.remove('val-is-empty');
			} else {
				field.classList.add('val-is-empty');
			}
		}
	};
	// Wordpress - CF7 - Clear file input after submit
	document.addEventListener('wpcf7mailsent', function( event ) {
		setTimeout(showLabels, 500);
	}, false );
	//*************
	
	jQuery('.top-banner-item-title-inner1').each(function(){
		const $el = jQuery(this);
		const $img = $el.find('.top-banner-item-title-img');
		
		if( ! $img.length )
			return;
		
		const words = jQuery.trim( $el.clone().children().remove().end().text() ).split(/\s+/);
		
		if( words.length < 2 ) {
			$img.removeClass('hide');
			return;
		}

		$el.empty();
		$el.append( words.slice(0, -1).join(' ') + ' ' );
		$el.append( $img );
		$el.append( ' ' + words[words.length - 1] );
		
		$img.removeClass('hide');
	});
	galleryTabsSwiper();
	function galleryTabsSwiper( startIndex = 0 ) {
		document.querySelectorAll('.multi-tabs-swipers').length && (function() {
			document.querySelectorAll('.multi-tabs-swipers').forEach(function(e,i) {
				let galleryThumbs = new Swiper(e.querySelector('.multi-tabs-swipers-thumbs'), {
					slidesPerView			: 3,
					speed					: 1000,
					watchSlidesVisibility	: true,
					watchSlidesProgress		: true,
					updateOnImagesReady		: true,
					preventClicks			: true,
					grabCursor				: true,
					keyboard				: true,
					centerInsufficientSlides: true,
					a11y					: {
												prevSlideMessage: 'מעבר לשקופית הקודמת',
												nextSlideMessage: 'מעבר לשקופית הבאה',
												slideRole: 'tab',
											},
					on						: {
												init: function(swiper) {
													let firstSlide = e.querySelector('.multi-tabs-swipers-thumbs .swiper-slide');
													if (firstSlide) {
														firstSlide.setAttribute('aria-selected', 'true');
													}
												}
											},
					breakpoints				: {
												992: {
													slidesPerView: 6
												},
												600: {
													slidesPerView: 5
												},
												480: {
													slidesPerView: 4
												}
											}
				});
				let galleryTop = new Swiper(e.querySelector('.multi-tabs-swipers-content'), {
					initialSlide		: startIndex,
					speed				: 1000,
					watchSlidesProgress	: true,
					updateOnImagesReady	: true,
					preventClicks		: true,
					effect				: 'fade',
					grabCursor			: true,
					keyboard			: true,
					a11y				: {
											prevSlideMessage: 'מעבר לשקופית הקודמת',
											nextSlideMessage: 'מעבר לשקופית הבאה',
											slideRole: 'tabpanel',
										},
					navigation			: {
											nextEl	: e.querySelector('.multi-tabs-swipers-content-next'),
											prevEl	: e.querySelector('.multi-tabs-swipers-content-prev'),
										},
					thumbs				: {
											swiper	: galleryThumbs,
										},
					on					: {
											slideChange: function(swiper){
												if( e.querySelector('.multi-tabs-swipers-thumbs .swiper-slide:focus') ) {
													e.querySelector('.multi-tabs-swipers-thumbs .swiper-slide-thumb-active').focus();
												}
												let slides = e.querySelectorAll('.multi-tabs-swipers-thumbs .swiper-slide');
												if ( slides.length > 0 ) {
													slides.forEach(function(slide) {
														slide.setAttribute('aria-selected', 'false');
													});
												}
												let active_tab = e.querySelector('.multi-tabs-swipers-thumbs .swiper-slide[data-tab-index="'+swiper.realIndex+'"]');
												active_tab.setAttribute('aria-selected', 'true');
											}
										}
				});
				// Scroll the thumb to start
				galleryThumbs.on('click', function (e) {
					galleryThumbs.slideTo( galleryThumbs.clickedIndex );
				});
			});
		}());
	}
	function afterYboxOpen(self){
		let index = self.attr('data-slide-index') ? parseInt(self.attr('data-slide-index')) : 0;
		galleryTabsSwiper(index);
	}
	
	// Waypoint Loader - Load More Articles
	window.addEventListener("load", (event) => {
		jQuery('.waypoint-articles-loader').each(function(i){
			let loader = jQuery(this);
			let waypoint = new Waypoint({
				element	: loader[i],
				offset	: '100%',
				handler	: function( direction ) {
					if( direction == 'down' ) {
						let paged = jQuery('.load-more-articles-wrap').attr('data-paged'); //מספר דף
						get_articles_js({ paged: paged });
					}
				}
			});
		});
	});
	function get_articles_js( obj ) {
		// Loader
		let btn = jQuery('.js-load-more-articles');
		
		if( typeof window.articles_ajax !== 'undefined' ) {
			window.articles_ajax.abort();
		}
		if( ! jQuery('.articles-ajax-here').hasClass('loading') ) {
			btn.removeClass('hide');
			jQuery('.articles-ajax-here').addClass('loading');
		}
		
		//*****************************************************
		return false; // למחוק את השורה הזאת כשבונים על המערכת
		//*****************************************************
		
		let paged = 1;
		let new_call = false;
		if( obj && obj.paged ) {
			paged = obj.paged;
		}
		if( obj && obj.new_call ) {
			new_call = obj.new_call;
		}
		window.articles_ajax = jQuery.ajax({
			type	 : "post",
			dataType : "json",
			url		 : '',//site_settings.ajaxurl,
			data	 : {
				action	 : "get_articles",
				paged	 : paged,
				ajax	 : true,
				new_call : new_call,
			},
			success	: function(data, status, xhr) {
				if( typeof data.html != 'undefined' && data.html ) {
					if( new_call ) {
						jQuery('.articles-ajax-here').html( data.html );
					} else {
						jQuery('.articles-ajax-here').append( data.html );
					}
					btn.attr( 'data-paged', data.page_number );
					if( ! data.show_btn ) {
						jQuery('.waypoint-articles-loader').remove();
						btn.remove();
					}
				} else {
					if( new_call ) {
						jQuery('.articles-ajax-here').html('');
					}
				}
				btn.addClass('hide');
				Waypoint.refreshAll();
				jQuery('.articles-ajax-here').removeClass('loading');
			},
			error: function (xhr, status, error) {
				console.error('AJAX Error:', error);
			}
		});
	}
	// Waypoint Loader - Load More Projects
	window.addEventListener("load", (event) => {
		jQuery('.waypoint-projects-loader').each(function(i){
			let loader = jQuery(this);
			let waypoint = new Waypoint({
				element	: loader[i],
				offset	: '100%',
				handler	: function( direction ) {
					if( direction == 'down' ) {
						let paged = jQuery('.load-more-projects-wrap').attr('data-paged'); //מספר דף
						get_projects_js({ paged: paged });
					}
				}
			});
		});
	});
	function get_projects_js( obj ) {
		// Loader
		let btn = jQuery('.js-load-more-projects');
		
		if( typeof window.projects_ajax !== 'undefined' ) {
			window.projects_ajax.abort();
		}
		if( ! jQuery('.projects-ajax-here').hasClass('loading') ) {
			btn.removeClass('hide');
			jQuery('.projects-ajax-here').addClass('loading');
		}
		
		//*****************************************************
		return false; // למחוק את השורה הזאת כשבונים על המערכת
		//*****************************************************
		
		let paged = 1;
		let new_call = false;
		if( obj && obj.paged ) {
			paged = obj.paged;
		}
		if( obj && obj.new_call ) {
			new_call = obj.new_call;
		}
		window.projects_ajax = jQuery.ajax({
			type	 : "post",
			dataType : "json",
			url		 : '',//site_settings.ajaxurl,
			data	 : {
				action	 : "get_projects",
				paged	 : paged,
				ajax	 : true,
				new_call : new_call,
			},
			success	: function(data, status, xhr) {
				if( typeof data.html != 'undefined' && data.html ) {
					if( new_call ) {
						jQuery('.projects-ajax-here').html( data.html );
					} else {
						jQuery('.projects-ajax-here').append( data.html );
					}
					btn.attr( 'data-paged', data.page_number );
					if( ! data.show_btn ) {
						jQuery('.waypoint-projects-loader').remove();
						btn.remove();
					}
				} else {
					if( new_call ) {
						jQuery('.projects-ajax-here').html('');
					}
				}
				btn.addClass('hide');
				Waypoint.refreshAll();
				jQuery('.projects-ajax-here').removeClass('loading');
			},
			error: function (xhr, status, error) {
				console.error('AJAX Error:', error);
			}
		});
	}
	// Scroll to next section
	jQuery('.js-scroll-to-next-section').click( function() {
		let scrollTO = jQuery(this).closest('section').next('section').offset().top - jQuery('#page-header').height();
		jQuery('html, body').animate({scrollTop : scrollTO}, 1000);
	});
	// category - Add height to items hidden text
	function category_filter_item_text_height(){
		jQuery('.category-filter-item-text-inner').each(function(){
			let h = jQuery(this).height();
			jQuery(this).parent().css('max-height', h);
		});
	}
	category_filter_item_text_height();
	
	// Filter Categories
	jQuery('.categories-filter-combo').on('change', function(e){
		get_categories_js({ new_call: true });
	});
	// Waypoint Loader - Load More categories
	window.addEventListener("load", (event) => {
		jQuery('.waypoint-categories-loader').each(function(i){
			let loader = jQuery(this);
			let waypoint = new Waypoint({
				element	: loader[i],
				offset	: '100%',
				handler	: function( direction ) {
					if( direction == 'down' ) {
						let paged = jQuery('.load-more-categories-wrap').attr('data-paged'); //מספר דף
						get_categories_js({ paged: paged });
					}
				}
			});
		});
	});
	function get_categories_js( obj ) {
		let new_call = false;
		if( obj && obj.new_call ) {
			new_call = obj.new_call;
		}
		const FORM = jQuery('.categories-filter-form');
		//Loader
		let btn = jQuery('.js-load-more-categories');
		let btnClass = btn.attr('class');
		
		if( typeof window.categories_ajax !== 'undefined' ) {
			window.categories_ajax.abort();
		}
		if( btn.hasClass('hide') ) {
			btn.removeClass('hide');
			if( new_call )
				jQuery('.categories-ajax-list').addClass('loading');
		}
		
		//*****************************************************
		return false; // למחוק את השורה הזאת כשבונים על המערכת
		//*****************************************************
		
		let paged = 1;
		if( obj && obj.paged ) {
			paged = obj.paged;
		}
		window.categories_ajax = jQuery.ajax({
			type	 : "post",
			dataType : "json",
			url		 : '', //site_settings.ajaxurl,
			data	 : {
				action	 : "get_categories",
				paged	 : paged,
				ajax	 : true,
				new_call : new_call,
				form	 : FORM.serialize(),
			},
			success	: function(data, status, xhr) {
				if( typeof data.html != 'undefined' && data.html ) {
					if( new_call ) {
						jQuery('.categories-ajax-list').html( data.html );
					} else {
						jQuery('.categories-ajax-list').append( data.html );
					}
					btn.attr( 'data-paged', data.page_number );
					if( ! data.show_btn ) {
						jQuery('.waypoint-categories-loader').remove();
						btn.remove();
					}
				} else {
					if( new_call ) {
						jQuery('.categories-ajax-list').html('');
					}
				}
				btn.addClass('hide');
				Waypoint.refreshAll();
				jQuery('.categories-ajax-list').removeClass('loading');
			},
			error: function (xhr, status, error) {
				console.error('AJAX Error:', error);
			}
		});
	}
	function markFirstInRow() {
		let previousTop = -1;
		jQuery('.project-item-details li').each(function() {
			const $el = jQuery(this);
			
			$el.removeClass('first');
			
			const currentTop = $el.offset().top;

			if (currentTop > previousTop) {
				$el.addClass('first');
				previousTop = currentTop;
			}
		});
	}
	markFirstInRow();

	jQuery(window).on('resize', function(){
		markFirstInRow();
		category_filter_item_text_height();
	});
	
	//select2
	jQuery('.select2').each(function(){
		let seachField = jQuery(this).attr('data-select2-search-field') ? 1 : -1;
		let select2Class = jQuery(this).attr('data-select2-class');
		jQuery(this).select2({
			dir: "rtl",
			dropdownParent: jQuery(this).parent(), // Insert dropdown into Select parent
			minimumResultsForSearch: seachField, // Show search field
			selectionCssClass: select2Class,
			dropdownCssClass: select2Class
		}).on('change', function() {
			//$(this).valid();
		});
	});
}