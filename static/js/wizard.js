
var wizard = (function() {
    var self = {},
        $e = {},
        debug = true,
        dataUrl = "/static/js/data/sow.json",
        items = [],
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

    function setupServiceButtons() {
    	$('.services').on('click', '.service', function() {
			// remove all active states
			$('.service').removeClass('active');
			//add it to this
			$(this).addClass('active');
			//call up this tabs data:
            _target = $(this).data('target')
            log('Service Clicked: ' + _target)
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

            getComplexity(_discipline, _target)

        });
    }

    function setupComplexityButtons() {
        $('.service-complexity-items').on('click', '.drop', function() {
            $('.service-complexity-items .drop').removeClass('dropped')
            $(this).addClass('dropped')
            //no dependent data on complexity
            //but we need to show next section:
            $('.service-addons-items-wrapper').fadeIn()
            $('.service-examples-items-wrapper').fadeIn()
            $('.service-industries-items-wrapper').fadeIn()
            $('.service-experience-items-wrapper').fadeIn()


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
        });
    }

    function setupIndustriesButtons() {
        $('.service-industries-items').on('click', '.drop', function() {
            $(this).toggleClass('dropped')
        });
    }

    function setupButtons() {
        setupServiceButtons()
        setupDeliverableButtons()
        setupComplexityButtons()
        setupAddonsButtons()
        setupExperienceButtons()
        setupIndustriesButtons()
    }

    function getDeliverables(discipline_slug) {
    	deliverableHTML = '';
		$.each(json[0][discipline_slug], function(key, item) {
			deliverableHTML += '<div class="drop" data-discipline="' + discipline_slug + '" data-target="' + item.slug + '">' + item.name + '</div>';
			$('.service-deliverable-items').html(deliverableHTML);
		});
        $('.service-deliverable-items-wrapper').fadeIn();
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
    }

    /**
    * INIT FUNCTION 
    */
    self.init = function() {

        log('--- Scripts Init ---')

        $('.sub-wrapper').hide();

        setupButtons();

        /*
        setupActionButtons();
        setupSorting();
        setupToggleAll();

        $('a.collapse').on('click', function() {
            toggleIndividual( $(this) );
            return false;
        });

        $( ".member_tabs" ).tabs();
        */

        //init:
        //getDeliverables('webtech')
    }

    return self

})()

//init
$(function () {
    wizard.init()
});



$(document).ready(function() {


});
