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
	bot = i%2 === 0 ? 80 : -600;
	details.animate({
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
	});
}
function openSameRow(photo, theOpen) {
	happening = true;
	photo.parent().animate({
		height: photo.parent().height() - theOpen.outerHeight() + parseInt(theOpen.css('border-top'))
	}, 500);

	setTimeout(function() {
		photo.next().show().siblings('section').hide();
		photo.parent().animate({
			height: photo.parent().height() + photo.next().outerHeight() - parseInt(theOpen.css('border-top'))
		}, 500, function() {
			happening = false;
		});
	}, 750);
}
function openDifferentRow(photo, theOpen) {
	happening = true;
	photo.next().show();

	photo.parent().animate({
		height: photo.parent().height() + photo.next().outerHeight()
	}, 500);

	theOpen.parent().animate({
		height: theOpen.parent().height() - theOpen.outerHeight()
	}, 500, function() {
		theOpen.hide();
		happening = false;
	});
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
	// console.log($(this).parent().hasClass('opened'));
	theDescription($(this));
});

});

