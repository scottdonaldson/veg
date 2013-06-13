jQuery(document).ready(function($){
	
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
	bot = details.hasClass('shown') ? -600 : 80;
	details.toggleClass('shown').animate({
		bottom: bot
	});
	i++;
}
more.click(theDeets);

// Showing descriptions for each photo
var row = $('.row'),
	isOneOpen = false,
	newHeight,
	theOpen,
	happening = false;
$('section').hide();	
function openOrHideSame(photo) {
	happening = true;
	newHeight = photo.parent().height();
	newHeight += photo.parent().hasClass('opened') ? -photo.next().outerHeight() : photo.next().outerHeight();

	isOneOpen = true;
	if (photo.next().is(':visible')) {
		isOneOpen = false;
	}

	photo.next().show().siblings('section').hide();
	photo.parent().toggleClass('opened').animate({
		height: newHeight
	}, 500, function() {
		happening = false;
		if (!photo.parent().hasClass('opened')) {
			photo.parent().removeAttr('style');
		}
	});
}
function openSameRow(photo, theOpen) {
	if (!happening) {
		happening = true;

		photo.parent().append('<div id="border-fake" style="height: ' + parseInt(theOpen.css('border-top')) + 'px;  top: ' + (photo.height() + 2) + 'px;"></div>').animate({
			height: photo.parent().height() - theOpen.outerHeight() + parseInt(theOpen.css('border-top'))
		}, 500);

		setTimeout(function() {
			photo.next().show().siblings('section').hide();
			photo.parent().animate({
				height: photo.parent().height() + photo.next().outerHeight() - parseInt(theOpen.css('border-top'))
			}, 500, function() {
				happening = false;
				$('#border-fake').remove();
			});
		}, 750);
	}
}
function openDifferentRow(photo, theOpen) {
	if (!happening) {
		happening = true;
		photo.next().show();

		photo.parent().addClass('opened').animate({
			height: photo.parent().height() + photo.next().outerHeight()
		}, 500);

		theOpen.parent().removeClass('opened').animate({
			height: theOpen.parent().height() - theOpen.outerHeight()
		}, 500, function() {
			theOpen.hide().parent().removeAttr('style');
			happening = false;
		});
	}
}
function theDescription(photo) {
	if (!happening) {
		// If no descriptions are open or we're closing the same one
		if (!isOneOpen || photo.next().is(':visible')) {
			openOrHideSame(photo);
		// If one is already opened (and it's not the same one)
		} else {
			theOpen = $('section:visible');
			// Same row
			if (photo.parent().hasClass('opened')) {
				openSameRow(photo, theOpen);
			// Different row
			} else {
				openDifferentRow(photo, theOpen);
			}
		}
	}
}
$('.restaurant-group').on('click', function(){
	theDescription($(this));
});

function closeDescription(closer) {
	if (!happening) {
		happening = true;
		isOneOpen = false;
		closer.closest('.row').removeClass('opened').animate({
			height: closer.closest('.row').height() - closer.closest('section').outerHeight()
		}, 500, function(){
			closer.closest('section').hide();
			happening = false;
		});
		closer.closest(details).removeClass('shown').animate({
			bottom: -600
		}, 500, function(){
			happening = false;
		});
	}
}
$('.closer').click(function(){
	closeDescription($(this));
});

var visibleDescription;
function resizeDescription() {
	var opened = $('.opened');
	if (opened.length > 0) {
		opened.css({
			height: opened.find('section:visible').prev().outerHeight() + opened.find('section:visible').outerHeight()
		});
	}
}
$(window).on('resize', resizeDescription);

});

