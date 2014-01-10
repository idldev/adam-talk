/**
*
* Form UI demo and experiments...
*
*/



$('select#initialMultiple')
	.popover({
		placement: 'left',
		trigger: 'hover',
	})

$('select#dropSelect')
	.popover({
		placement: 'left',
		trigger: 'hover',
	})
	.change( function() {
		choice = $(this).val()

		html = "<select class='subSelect'><option value='-1'>Select One...</option><option value='choice1'>A related " + choice + " choice</option> <option value='choice2'>Another " + choice + " choice</option> <option value='choice3'>A Third " + choice + " choice</option>"

		$(this).parent().siblings('div').html(html)

	})

$('select.subSelect')
	.popover({
		placement: 'left',
		trigger: 'hover',
	})
	.change( function() {
		choice = $(this).val()
		console.log(choice)
		if( choice != '-1' ) {
			//append with "add" button
			$(this).append('<a href="">Add</a>');
		}

	})

/*
function checkUrl(evt, obj) {
    // You will need to standardize the "evt" variable because there are differences in browsers

    var value = obj.value;
    var isUrl = false;

    var words = value.split(" ");

    // Loop through words, if we match a tag, add it to the target div:
    var newArray = $(words).map(function(i) {
    	return $('#event' + i, response).html();
	});
*/

$('.dropdown-toggle').dropdown();







