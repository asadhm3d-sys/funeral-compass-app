var app = (function ()
{
    const me = {};
	me.vmSubMenu = null;
	me.vmMenuItem = null;

    let cache = [];

	let subMenu = null;
	let subMenuOpen = false;
	let btnVmPrint = null;
	let divOverlay = null;
	let priceChgDlg = null;
    let favStars = null;
	let wishlistBtnA = null;
	let wishlistBtnB = null;
	let vaBox = null;
	let vaFrame = null;
	let vaEdit = null;
	
	const notif = {
		wrapper: null,
		$box: null,
		$p: null
	};

	function toggleSubMenu(e) {
		if (typeof e !== "undefined") {
			e.preventDefault();
			e.stopPropagation();	
		}
		if (subMenuOpen) {
			subMenu.style.display = "none";
			subMenuOpen = false;
		}
		else {
			subMenu.style.display = "block";
			subMenuOpen = true;
			$(document).one('click',function(){
				if (subMenuOpen) toggleSubMenu();
			});
		}
	}

    function toggleFavorite(e) {
		const elm = e.target;
        let box = elm.parentElement;
        const data = {
            "id": elm.getAttribute("data-id"),
            "kaid": elm.getAttribute("data-kaid")
        }
        app.rq("vendor_map", data, function(resp) {
			let remove = false;
            if (box.classList.contains("active")) {
                //von Mappe entfernt
				remove = true;
                box.classList.remove("active");
                box.firstElementChild.innerText = "library_add";
            }
            else {
                //auf Mappe gesetzt
                box.classList.add("active");
                box.firstElementChild.innerText = "library_add_check";
            }    
            elm.setAttribute("data-kaid", resp.kaId);

			//Konfigurator: Buttons synchronisieren
			if (elm.hasAttribute("data-mobile")) {
				const append = (elm.getAttribute("data-mobile") == 0) ? "-mob" : "-dsk";
				const oppElm = document.getElementById("vmb" + append);
				if (oppElm !== null) {
					box = oppElm.parentElement;
					if (remove) {
						box.classList.remove("active");
						box.firstElementChild.innerText = "library_add";
					}
					else {
						box.classList.add("active");
						box.firstElementChild.innerText = "library_add_check";
					}    
					oppElm.setAttribute("data-kaid", resp.kaId);		
				}
			}

        }, "get");
    }

	function printVendorMap(e) {
		e.preventDefault();
		e.stopPropagation();
		toggleSubMenu();
        me.rq("map_print", null, function(resp) {
            //in neuem Fenster/Reiter öffnen
            window.open(resp.url, "_blank");
        }, "get");
	}

	function showAdminFrame(fromMenu) {
		if (vaFrame !== null) {
			vaBox.style.display = "block";
			let cont = vaEdit.getAttribute("data-content");
			if (fromMenu) {
				if (cont.indexOf("vm") == 0) toggleSubMenu();
			}
			else {
				cont = "sp" + cont.slice(2);
			}
			//const url = me.home + "admin/#/shop/" + cont;
			const url = me.home + "admin/index251008.html#/shop/" + cont;
			if (vaFrame.src.length == 0) {
				vaFrame.src = url;
			}
			else {
				//send message to app
				vaFrame.contentWindow.postMessage("refresh");
			}
		}
	}

    me.init = function() {
        if(window.location.href.indexOf("http://server") === 0) {
            me.home = "http://server/beck-pietaetsbedarf/";
        }
        else if (window.location.href.indexOf("https://beck.tma") === 0) {
            me.home = "https://beck.tma-pure.de/";
		}
		else {
            me.home = "https://www.beck-pietaetsbedarf.de/";
        }

		divOverlay = document.getElementById("overlay");
		
		$('#main-menu').smartmenus({
			/*showOnClick: true,
			noMouseOver: true,*/
			subMenusSubOffsetX: 1,
			subMenusSubOffsetY: -8
		});	
		
		//Formular
		$( ".form span.empty" ).click(function() {
			$(this).addClass("inhalt");
			$(this).children('input').focus();
		});
		$( ".form span.empty input, .form span.empty textarea" ).focus(function() {
			$(this).parent('span').addClass("inhalt");
		});
		
		//$(".auswahl").hide();
		$("input#fo_auswahl_telefon").change(function(){
			var check = $(this).prop( "checked" );
			if(check){
				$(".auswahl").show();
			}else{
				$(".auswahl").hide();
			}
		});
		
        //Navigation mobil
        $( '.nav-show' ).click(function(){
            $( '.main-nav' ).show();
            $( '.nav-hide' ).css('display', 'inline-block');
            //$( '.nav-show' ).hide();
			$( 'body' ).toggleClass('menu-open');
        });
        $( '.nav-hide' ).click(function(event){
			event.preventDefault();
            $( '.main-nav' ).hide();
            $( '.nav-hide' ).hide();
            $( '.nav-show' ).css('display', 'inline-block');
			$( 'body' ).removeClass('menu-open');
        });
		
		//Anzeige MA-Texte
        $( '.text-show' ).click(function(){
			$(this).parent().parent().parent().parent().parent().next('.text-box' ).addClass('show');
            //$('.tma-heighti').next('.text-box' ).addClass('show');
            $( '.text-hide' ).css('display', 'inline-block');
			$( 'body' ).toggleClass('text-open');
        });
        $( '.text-hide' ).click(function(){
            $( '.text-box' ).removeClass('show');
            $( '.text-hide' ).hide();
            $( '.text-show' ).css('display', 'inline-block');
			$( 'body' ).removeClass('text-open');
    	});
		
		//Menü + Filter auf Artikelliste
		$( '.btn-close' ).click(function(){
			$(this).parent().slideToggle();
			$( '#button-filter' ).removeClass('btn-active');
			$( '#button-produkte' ).removeClass('btn-active');
			$( '#button-sortierung' ).removeClass('btn-active');
		}); 
		$( '#button-produkte' ).click(function(event){
			event.preventDefault();
			event.stopPropagation();
			$( '#button-filter' ).removeClass('btn-active');
			$( '#button-sortierung' ).removeClass('btn-active');
			$(this).toggleClass('btn-active');
			$( '#show-filter' ).slideUp();
			$( '#show-sortierung' ).slideUp();
			$( '#show-produkte' ).slideToggle();
		});
		$( '#button-filter' ).click(function(event){
			event.preventDefault();
			event.stopPropagation();
			$( '#button-produkte' ).removeClass('btn-active');
			$( '#button-sortierung' ).removeClass('btn-active');
			$(this).toggleClass('btn-active');
			$( '#show-produkte' ).slideUp();
			$( '#show-sortierung' ).slideUp();
			$( '#show-filter' ).slideToggle();
		});
		$( '#button-sortierung' ).click(function(event){
			event.preventDefault();
			event.stopPropagation();
			$( '#button-produkte' ).removeClass('btn-active');
			$( '#button-filter' ).removeClass('btn-active');
			$(this).toggleClass('btn-active');
			$( '#show-produkte' ).slideUp();
			$( '#show-filter' ).slideUp();
			$( '#show-sortierung' ).slideToggle();
		});

		//Beratungsmappe
		const artikelDiv = document.getElementById("artikel");
		const konfDiv = document.getElementById("konfmain"); //incl. konfmobil
		const arhlDiv = document.getElementById("hl-row");
		if  (artikelDiv || konfDiv || arhlDiv) {
			favStars = document.querySelectorAll('span[data-role="fav"]');
			if (favStars) {
				for (let i = 0; i < favStars.length; i++) {
					favStars[i].addEventListener("click", toggleFavorite);
				}
			}
		}
		//Menü
		me.vmMenuItem = document.querySelector('a[data-role="vendor-map"]');
		if (me.vmMenuItem !== null) {
			me.vmSubMenu = document.querySelector("div.usm-wrap");
		}

		//Merkzettel
		wishlistBtnA = new WishlistButton("wishlist-btn");
		wishlistBtnB = new WishlistButton("km-wishlist-btn");
		if (wishlistBtnA.exists) {
			if (wishlistBtnB.exists) {
				wishlistBtnA.syncButton = wishlistBtnB;
				wishlistBtnB.syncButton = wishlistBtnA;
			}
		}

		//Notification
		notif.wrapper = document.getElementById("notif-wrap");
		notif.$box = $("#notification");
		notif.$p = notif.$box.find("p");

		//User-Unter-Menü
		subMenu = document.getElementById("user-sub-menu");
		const btnVendorMap = document.querySelector('a[data-role="vendor-map"]');
		if (btnVendorMap) {
			btnVendorMap.addEventListener("click", toggleSubMenu);
			btnVmPrint = document.getElementById("vendormap-print");
			if (btnVmPrint) btnVmPrint.addEventListener("click", printVendorMap);
		}

		//Admin-App (Beratungsmappe bearbeiten)
		vaBox = document.getElementById("vendor-admin-box");
		vaEdit = document.getElementById("vendormap-admin");
		if (vaEdit !== null && vaBox !== null) {
			vaFrame = vaBox.querySelector("iframe");
			vaEdit.addEventListener("click", function(e) {
				e.preventDefault();
				e.stopPropagation();
				showAdminFrame(true);
			});	
			const closeImg = document.getElementById("vendor-admin-close").querySelector("img");
			closeImg.addEventListener("click", function() {
				vaBox.style.display = "none";
			});
		}
		
		if (document.body.getAttribute("data-price-change") == "1") {
			priceChgDlg = document.getElementById("price-chg-dlg");
			me.overlay(true);
			priceChgDlg.style.display = "block";
			document.getElementById("price-chg-cancel").addEventListener("click", function() {
				priceChgDlg.style.display = "none";
				me.overlay(false);
			});
			document.getElementById("price-chg-open").addEventListener("click", function() {
				priceChgDlg.style.display = "none";
				me.overlay(false);
				app.rq("pricechg_dlg_off", null, function(resp) {
					showAdminFrame("");
				}, "get");
			});
			document.getElementById("price-chg-ok").addEventListener("click", function() {
				app.rq("pricechg_dlg_off", null, function(resp) {
					//console.log(resp);
				}, "get");
				priceChgDlg.style.display = "none";
				me.overlay(false);
			});
		}

		// Owl Carousela
		const owl = $('.slider-start');
		if (owl.length) {
			owl.owlCarousel({
				items:1,
				loop:true,
				margin:10,
				autoplay:true,
				autoplaySpeed: 2500, //5000
				smartSpeed:750,
				autoplayTimeout: 10000, //6000
				autoplayHoverPause:true,
				dots:true,
				mouseDrag: false,
				touchDrag: false,
				pullDrag: false,
				freeDrag: false,
				nav:false,
			});	
		}

		// Owl Carousel Logo Slider
		const logoslider = $('.logoslider');
		if (logoslider.length) {
			logoslider.owlCarousel({
				loop:true,
				margin:0,
				autoplay:true,
				autoplaySpeed: 3500, //5000
				smartSpeed:1000,
				autoplayTimeout: 4000, //6000
				autoplayHoverPause:true,
				dots:false,
				mouseDrag: true,
				touchDrag: true,
				pullDrag: false,
				freeDrag: false,
				nav:false,
				responsive : {
					0 : {
						items:2,
					},
					// breakpoint from 384 up
					384 : {
						items:3,
					},
					// breakpoint from 512 up
					512 : {
						items:4,
					},
					// breakpoint from 768 up
					768 : {
						items:5,
					},
					// breakpoint from 1024 up
					1024 : {
						items:6,
					},
					// breakpoint from 1280 up
					1280 : {
						items:7,
					},
					// breakpoint from 1536 up
					1536 : {
						items:8,
					},
					// breakpoint from 1792 up
					1792 : {
						items:9,
					},
				}
			});
		}

    };

    me.subscribe = function(eventName, callback)
    {
        if(!cache[eventName]){
            cache[eventName] = [];
        }
        cache[eventName].push(callback);
    };

    me.publish = function(eventName, args)
    {
        if (typeof cache[eventName] != "undefined") {
            $.each(cache[eventName], function(){
                this.apply(null, args || []);
            });
        }
    };

	me.overlay = function(show) {
		if (show) {
			divOverlay.style.display = "block";
		}
		else {
			divOverlay.style.display = "none";
		}
	}

    //input erlaubt nur die Eingabe von Zahlen
    me.numbersOnly = function(event)
    {
        // Allow: backspace, delete, tab, escape, and enter
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
            // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
            // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        else {
            // Ensure that it is a number and stop the keypress
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault();
            }
        }
    };

    me.alphaNumericOnly = function(event)
    {
        // Allow: backspace, delete, tab, escape, and enter
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || event.keyCode == 32 ||
            // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
            // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        else {
            // Ensure that it is a number and stop the keypress
            var notANumber = (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 ));
            var notALetter = !(event.keyCode >= 65 && event.keyCode <= 90);
            if (notANumber && notALetter) {
                event.preventDefault();
            }
        }
    };

	me.rq = function(dest, data, onSuccess, method) {
		if (typeof method === "undefined") method = "post";
		let url = me.home + "xhr/" + dest + ".php";
		if (method === "get") {
			if (data !== null) {
				let c = 0;
				for (let prop in data) {
					url += (c === 0) ? "?" : "&";
					url += prop + "=" + data[prop];
					c++;
				}	
			}
			fetch(url, {
				method: "GET",
				cache: "no-cache",
				headers: { "Content-Type": "application/json" },
				referrerPolicy: "no-referrer",
			}).then(res => res.json()).then( data => onSuccess(data));
		}
		else if (method === "post") {
			fetch(url, {
				method: "POST",
				cache: "no-cache",
				headers: { "Content-Type": "application/json" },
				referrerPolicy: "no-referrer",
				body: JSON.stringify(data)
			}).then(res => res.json()).then( data => onSuccess(data));	
		}
	};

	me.notify = function(text, ms) {
		notif.$p.text(text);
		notif.wrapper.style.display = "flex";
		notif.$box.fadeIn("slow", function() {
			setTimeout(function() {
				notif.$box.fadeOut("slow", function() {
					notif.wrapper.style.display = "none";
				});
			}, ms);
		});
	};

	//wenn clientseitig der Artikel wechselt...
	me.wishlistChange = function(arId) {
		let xst = wishlistBtnA.exists || wishlistBtnB.exists;
		if (xst) {
			if (wishlistBtnA.exists) wishlistBtnA.articleId = arId;
			if (wishlistBtnB.exists) wishlistBtnB.articleId = arId;
			//... ist der auf dem Merkzettel?
			app.rq("on_wishlist", {
				"id": arId
			}, function(resp) { 
				if (wishlistBtnA.exists) wishlistBtnA.onWishlist(resp.mzId);
				if (wishlistBtnB.exists) wishlistBtnB.onWishlist(resp.mzId);
			}, "get");
		}
	};

    return me;
})();

//Show Content
var $ = jQuery;
$(function() {
	//console.log("hier!!");
	var timelineBlocks = $('main > div > *, main > div > div > *'), offset = 0.95;
	hideBlocks(timelineBlocks, offset);
	//showBlocks(timelineBlocks, offset);

	$(window).on('scroll', function(){
		(!window.requestAnimationFrame) 
			? setTimeout(function(){ showBlocks(timelineBlocks, offset); }, 50)
			: window.requestAnimationFrame(function(){ showBlocks(timelineBlocks, offset); });
	});

	function hideBlocks(blocks, offset) {
		//alert("hide");
		blocks.each(function(){
			( $(this).offset().top > $(window).scrollTop()+$(window).height()*offset ) && $(this).addClass('is-hidden');
		});
	}

	function showBlocks(blocks, offset) {
		//alert("show");
		blocks.each(function(){		
			( $(this).offset().top <= $(window).scrollTop()+$(window).height()*offset && $(this).hasClass('is-hidden') ) && $(this).addClass('bounce-in');
		});
	}
	
});

//Reaktion auf window resize
function tma_height(){
	//Untermenü Beratungsmappe
	if (app.vmSubMenu !== null) {
		setTimeout(function() {
			app.vmSubMenu.style.marginLeft = app.vmMenuItem.offsetLeft + "px";	
		}, 1000);	
	}
	//Nach größter Höhe bestimmen
	var tma_div = $('.tma-height');
	if (tma_div.length) {
		var tma_div_inner = $('.tma-heighti');

		tma_div_inner.each(function () {
			$(this).removeAttr('style');
		});

		tma_div.each(function (index) {
			//Höhe sammeln
			var highest_element = 0;
			$(this).find('.tma-heighti').each(function (index2) {
				if ($(this).height() > highest_element) {
					highest_element = $(this).height();
				}
			});

			//Höhe überschreiben
			$(this).find('.tma-heighti').each(function (index2) {
				$(this).height(highest_element);
			});
		});
	}
}

var resizeTimerTabelle;
$(window).resize(function() {
	clearTimeout(resizeTimerTabelle);
	resizeTimerTabelle = setTimeout(tma_height, 100);
});

//Header fixed
$( window ).scroll(function() {
	if ($(this).scrollTop() > 1) {
		$('body').addClass("header-fix");
	} else {
		$('body').removeClass("header-fix");
	}	
});
//Scroll to top
$(function() {
	$('#totop').click(function(event) {
		event.preventDefault();
		$('html,body').animate({ scrollTop: $("body").offset().top }, 1000 );
	});
});
$( window ).scroll(function() {
	if ($(this).scrollTop() > 100) { $('#totop').fadeIn(); }else{ $('#totop').fadeOut(); }
});
//Scroll to Anker
$(function() {
	$('a[href*="#"]').bind("click", function(event) {
		var href = $(this).attr('href');
		var href_ex = href.split('#');
		var scroll_to = false;

		if(href.charAt(0) == "#"){ //Erster Buchstabe  #
			scroll_to = true;
			if(href == "#"){ //Leerer Link
				scroll_to = false;
			}
		}else{ // Evtl. kompletter Link mit #
			var aktu_url = $(location).attr('href');
			var aktu_url_ex = aktu_url.split('#'); //# entfernen

			if(href_ex[0] == aktu_url_ex[0]){ //Link auf gleicher Seite?
				scroll_to = true;
			}
		}

		if(scroll_to){
			event.preventDefault();

			var ziel = "#"+href_ex[1];
			var zielElm = $(ziel);
			if (zielElm.length) {
				$('html,body').animate({
					scrollTop: $(ziel).offset().top-120
				}, 1000 );	
			}
		}
	});
});
//Stoerer
$(document).ready(function(){
	app.init();
	if (document.body.getAttribute("data-popup") == "1" || document.body.getAttribute("data-popup") == "2") {
		$("#show-theke").click(function () {
			$("#stoerer-theke").toggleClass('show');
			if ($('#stoerer-theke').hasClass('show')) {
				show_theke();
			} else {
				$('#stoerer-theke').animate({'width': '0', 'right': '0', 'max-height': '300px'}, 1000, function () {
					$('#hide-theke').hide();
				});
				sessionStorage.setItem('stoerer_katalog', 'F');
			}
		});
		//Show nach ca. 5-6 Sekunden
		setTimeout(function () {
			if (sessionStorage.getItem("stoerer_katalog") != "F") {
				$("#stoerer-theke").addClass('show');
				show_theke();
			}
		}, 5000);	
	}
	tma_height();
	//Scroll Anker
	/*
	$('#artikel').scrollAnimate({
		startScroll: 800,
		endScroll: 1500,
		cssProperty: 'margin-top',
		before: 550,
		after: 150
	});*/
});
function show_theke() {
	$('#stoerer-theke').animate({'width': '310px', 'right': '0px', 'max-height': '800px'}, 1000);
	$('#hide-theke').show();
}
//Loop Video
$(function() {
	function replay() {
		document.getElementsByTagName('video').currentTime = 0;
		document.getElementsByTagName('video')[0].play();
	}
});
// Swipebox
$( function( $ ) {
	$( '.swipebox' ).swipebox();
});
