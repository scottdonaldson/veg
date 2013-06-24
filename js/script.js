var header = $('header'),
	breakPoint = 600,
	delay = 500;

$(window).load(function(){
	$('.restaurant-group').each(function(){
		$(this).delay(4 * delay * Math.random() + 1000).animate({
			opacity: 1
		}, delay);
	});

	header.animate({
		opacity: 1
	}, delay);

	setTimeout(function(){
		$('.intro').fadeOut(delay, function(){
			$('.cover').remove();
		});
	}, 4 * delay + 1000);
});

$(document).ready(function(){
	
// Showing "according to Parsley & Sprouts"		
var hgroup = $('.hgroup'),
	hovering = false;
function hgroupHover() {
	if (!hovering) {

		hovering = true;
		hgroup.addClass('hovered');

		setTimeout(function(){
			hgroup.removeClass('hovered');
			hovering = false;
		}, 2500);
	}
}
hgroup.hover(hgroupHover);

// Showing the details
var more = $('.more'),
	details = $('.details'),
	bot, 
	i = 0;
function theDeets() {
	var opened = $('.opened');
	if (opened.length > 0 && !details.hasClass('shown')) {
		if ($(window).width() > breakPoint) {
			openOrHideSame(opened.find('section:visible').prev());
		} else {
			smallScreenClose(opened.find('section:visible').prev());
		}
	}

	if ($(window).width() > breakPoint) {
		bot = details.hasClass('shown') ? -600 : header.height();
	} else {
		bot = details.hasClass('shown') ? -600 : header.height() + more.height()
	}
	details.toggleClass('shown').animate({
		bottom: bot
	});
	i++;
	more.toggleClass('shown');
}
more.click(theDeets);
function posDeets() {
	if (details.hasClass('shown') && $(window).width() > breakPoint) {
		bot = header.height();
	} else if ($(window).width() <= breakPoint) {
		bot = header.height() + more.height();
	} else {
		bot = -600;
	}
	details.css({
		bottom: bot
	});
}
$(window).resize(posDeets);

// Showing descriptions for each photo
var row = $('.row'),
	newHeight,
	theOpen,
	pointer = $('<div class="pointer-container"><div class="pointer"></div></div>');
	happening = false;

// function to open or hide the same one when it is clicked on
function openOrHideSame(photo) {
	happening = true;
	newHeight = photo.parent().height();
	newHeight += photo.parent().hasClass('opened') ? -photo.next().outerHeight() : photo.next().outerHeight();

	// Insert the pointer
	if (photo.next().find('.pointer-container').length == 0) {
		photo.next().prepend(pointer);
		pointer.css({
			left: photo.offset().left + 0.5 * (photo.width() - pointer.width())
		});
	} else {
		setTimeout(function(){
			pointer.remove();
			resizeGroups();
		}, delay);
	}

	photo.next().show().siblings('section').hide();
	photo.parent().toggleClass('opened').animate({
		height: newHeight
	}, delay, function() {
		if (!photo.parent().hasClass('opened')) {
			photo.parent().removeAttr('style');
		}
		happening = false;
	});

}

// If we click on a different photo in the same row
function openSameRow(photo, theOpen) {

	photo.parent().append('<div id="border-fake" style="height: ' + parseInt(theOpen.css('border-top')) + 'px;  top: ' + (photo.height() + 2) + 'px;"></div>').animate({
		height: photo.parent().height() - theOpen.outerHeight() + 40
	}, delay);

	pointer.appendTo(photo.parent()).css({
		top: photo.outerHeight() + parseInt(theOpen.css('border-top'))
	}).animate({
		left: photo.offset().left + 0.5 * photo.width() - 40
	}, delay * 2, function(){
		photo.next().prepend(pointer);
		pointer.css({
			top: 0
		});
	});

	setTimeout(function() {
		photo.next().show().siblings('section').hide();
		photo.parent().animate({
			height: photo.parent().height() + photo.next().outerHeight() - 40
		}, delay, function() {
			$('#border-fake').remove();
			happening = false;
		});
	}, delay);
}

// If we click on a photo in a different row
function openDifferentRow(photo, theOpen) {
	photo.next().show();

	photo.parent().addClass('opened').animate({
		height: photo.parent().height() + photo.next().outerHeight()
	}, delay);

	photo.next().prepend(pointer);
	pointer.css({
		left: photo.offset().left + 0.5 * (photo.width() - pointer.width())
	});

	theOpen.parent().removeClass('opened').animate({
		height: theOpen.parent().height() - theOpen.outerHeight()
	}, delay, function() {
		theOpen.hide().parent().removeAttr('style');
		happening = false;
	});
}

// master function that determines which case we should go with (only for large screens)
function theDescription(photo) {
	var opened = $('.opened');
	happening = true;
	// If no descriptions are open or we're closing the same one
	if (opened.length === 0 || photo.next().is(':visible')) {
		openOrHideSame(photo);
	// If one is already opened (and it's not the same one)
	} else {
		// Same row
		if (photo.parent().hasClass('opened')) {
			openSameRow(photo, opened.find('section:visible'));
		// Different row
		} else {
			openDifferentRow(photo, opened.find('section:visible'));
		}
	}
}

// functions for small screens.
// First, just showing one
function smallScreenShow(photo) {
	photo.parent().addClass('opened').siblings().removeClass('opened');
	photo.next().prepend(pointer);

	photo.animate({
		marginBottom: photo.next().outerHeight()
	}, delay);
	photo.next().show().css({
		top: (0.5 * photo.index() + 1) * photo.outerHeight() - photo.next().outerHeight()
	}).animate({
		top: (0.5 * photo.index() + 1) * photo.outerHeight()
	}, delay, function(){
		happening = false;
	});
}
// closing one
function smallScreenClose(photo) {
	pointer.remove();
	photo.animate({
		marginBottom: 0
	}, delay);
	photo.next().animate({
		top: (0.5 * photo.index() + 1) * photo.outerHeight() - photo.next().outerHeight()
	}, delay, function(){
		photo.next().hide();
		photo.parent().removeClass('opened');
		happening = false;
	});
}
function theSmallDescription(photo) {
	happening = true;
	// If we're closing the same one
	if (photo.next().is(':visible')) {
		smallScreenClose(photo);
	// If we're opening a different one
	} else if ($('section:visible').length > 0) {
		smallScreenClose($('section:visible').prev());
		smallScreenShow(photo);
	// If we're opening a new one
	} else {
		smallScreenShow(photo);
	}
}

$('.restaurant-group').click(function(){
	if (!happening) {
		if ($(window).width() > 600) {
			theDescription($(this));
		} else {
			// small screens here
			theSmallDescription($(this));
		}
		if (details.hasClass('shown')) {
			theDeets();
		}
	}
});

// ESC to close things
window.addEventListener('keydown', function(e) {
	if (e.keyCode === 27) {
		var opened = $('.opened');
		if (opened.length > 0) {
			if ($(window).width() > breakPoint) {
				openOrHideSame(opened.find('section:visible').prev());
			} else {
				smallScreenClose(opened.find('section:visible').prev());
			}
		}
		if (details.hasClass('shown')) {
			theDeets();
		}
	}
});

// resize description on window resize, if one is visible
function resizeDescription() {
	var opened = $('.opened');
	if (opened.length > 0) {
		var photo = opened.find('section:visible').prev();
		if ($(window).width() > breakPoint) {
			opened.css({
				height: photo.outerHeight() + photo.next().outerHeight()
			}).find(pointer).css({
				left: photo.offset().left + 0.5 * (photo.width() - pointer.width())
			});
		} else {
			photo.css({
				marginBottom: photo.next().outerHeight()
			}).next().css({
				top: (0.5 * photo.index() + 1) * photo.outerHeight()
			});
		}
	}
}
$(window).on('resize', resizeDescription);

// Resizing if window is taller than it is wide (and wider than the break point)
function resizeGroups() {
	if ($('.opened').length === 0 && $(window).width() > breakPoint) {
		if ($(window).height() > $(window).width() + header.height()) {
			row.height(0.333 * ($(window).height() - header.height()))
				.find('.photo').css({
					height: row.height() - 1,
					left: -0.5 * (row.height() - 0.333 * row.width()),
					width: row.height() - 1
				});
		} else {
			row.height('auto').find('.photo').removeAttr('style');
		}
	} else if ($(window).width() > breakPoint) {
		row.find('.photo').removeAttr('style');
	} else if ($(window).width() <= breakPoint) {
		row.height('auto');
	}
	
}
$(window).on('load resize', resizeGroups);

});