
var wizard = (function() {
    var self = {},
        $e = {},
        debug = true,
        dataUrl = "/static/js/data/sow.json",
        items = [],
        summary = {},
        json = (function () {
		    var json = null;
		    $.ajax({
		        'async': false,
		        'global': false,
		        'url': dataUrl,
		        'dataType': "json",
		        'success': function (data) {
		            json = data;
		        }
		    });
		    return json;
		})();

    
    /*
    * Helper Functions 
    */
    function log() {
        if (debug) {
            try {
                console.log.apply(console, arguments)
            } catch(e){}
        }
    }


    function scrollToSection(section){
        var offset_num = 45; //header height here...

        // calculate position of the target div
        pos = $(section).offset().top - offset_num

        // animate
        $('html, body').animate (
             {scrollTop: pos }, 500
        ); 
    }

    /**
    * Generalized Setup 
    */
    function setupButtons() {
        setupServiceButtons()
        setupDeliverableButtons()
        setupComplexityButtons()
        setupAddonsButtons()
        setupExperienceButtons()
        setupIndustriesButtons()
        setupLocationButtons()
    }

    
    /*
    * Set Up Button Scripts
    */

    function setupServiceButtons() {
    	$('.services').on('click', '.service', function() {
            //close all .sub-wrapper
            $('.sub-wrapper').hide()
            $('div').removeClass('dropped')


			// remove all active states
			$('.service').removeClass('active')

			//add it to this
			$(this).addClass('active')

			//call up this tabs data:
            _target = $(this).data('target')
            getDeliverables(_target)
		});
    }

    function setupDeliverableButtons() {
        $('.service-deliverable-items').on('click', '.drop', function() {
            // remove all active states
            $('.service-deliverable-items .drop').removeClass('dropped');
            //add it to this
            $(this).addClass('dropped');
            //call up this tabs data:
            _target = $(this).data('target')
            _discipline = $(this).data('discipline')

            summary.deliverable = _target

            getComplexity(_discipline, _target)

        });
    }

    function setupComplexityButtons() {
        $('.service-complexity-items').on('click', '.drop', function() {
            $('.service-complexity-items .drop').removeClass('dropped')
            $(this).addClass('dropped')
            //no dependent data on complexity
            //but we need to show next section:
            summary.complexity = $(this).data("complexity")

            $('.service-addons-items-wrapper').fadeIn()
            scrollToSection('.service-addons-items-wrapper')
        });
    }

    function setupAddonsButtons() {
        $('.service-addons-items').on('click', '.drop', function() {
            $(this).toggleClass('dropped')
        });
    }

    function setupExperienceButtons() {
        $('.service-experience-items').on('click', '.drop', function() {
            $('.service-experience-items .drop').removeClass('dropped')
            $(this).addClass('dropped')
            $('.service-location-items-wrapper').fadeIn()

            scrollToSection('.service-location-items-wrapper')
        });
    }

    function setupIndustriesButtons() {
        $('.service-industries-items').on('click', '.drop', function() {
            $(this).toggleClass('dropped')
        });
    }

    function setupLocationButtons() {
        $('.service-location-items').on('click', '.drop', function() {
            $('.service-location-items .drop').removeClass('dropped')
            $(this).addClass('dropped')

            //assemble the finish:
            $('#sow-summary').val(summary.intro + summary.deliverable + " of complexity " + summary.complexity )
            $('.service-summary-wrapper').fadeIn()
        });
    }

    function setupLinks() {
        $('.service-addons-items-wrapper').on('click', 'a.btn', function(e) {
            e.preventDefault();
            $('.service-examples-items-wrapper').fadeIn()
            scrollToSection('.service-examples-items-wrapper')
        })

        $('.service-examples-items-wrapper').on('click', 'a.btn', function(e) {
            e.preventDefault();
            $('.service-industries-items-wrapper').fadeIn()
            scrollToSection('.service-industries-items-wrapper')

        })

        $('.service-industries-items-wrapper').on('click', 'a.btn', function(e) {
            e.preventDefault();
            $('.service-experience-items-wrapper').fadeIn()
            scrollToSection('.service-experience-items-wrapper')

        })

    }

    function getDeliverables(discipline_slug) {
    	deliverableHTML = '';
		$.each(json[0][discipline_slug], function(key, item) {
			deliverableHTML += '<div class="drop" data-discipline="' + discipline_slug + '" data-target="' + item.slug + '">' + item.name + '</div>';
			$('.service-deliverable-items').html(deliverableHTML);
		});
        $('.service-deliverable-items-wrapper').fadeIn();
        scrollToSection('.service-deliverable-items-wrapper');
    }

    function getComplexity(discipline_slug, deliverable_slug) {
        //log('Discipline: ' + discipline_slug)
        //log('Deliverable: ' + deliverable_slug)
    	complexityHTML = ''; addonsHTML = '';
        //log('Complexity function:');
		$.each(json[0][discipline_slug][deliverable_slug]['complexity'], function(key, item) {
			complexityHTML += '<div class="drop" data-complexity="' + item.slug + '">' + item.name + '</div>';
			$('.service-complexity-items').html(complexityHTML);
		});
        //also, get add ons at this stage:
        $.each(json[0][discipline_slug][deliverable_slug]['addons'], function(key, item) {
            addonsHTML += '<div class="drop">' + item.name + '</div>';
            $('.service-addons-items').html(addonsHTML);
        });

        //fade in _only_ the complexity for now
        $('.service-complexity-items-wrapper').fadeIn();
        scrollToSection('.service-complexity-items-wrapper');
    }

    /**
    * INIT FUNCTION 
    */
    self.init = function() {

        log('--- Scripts Init ---')
        summary.intro = "We want to create a "

        // animate
        $('html, body').animate (
             {scrollTop: 0 }, 500
        );

        $('.sub-wrapper').hide();

        setupButtons()
        setupLinks()

    }

    return self

})()

//init
$(function () {
    wizard.init()
});



$(document).ready(function() {


});
