/* 
* Talent List Scripts :: NEW UI
*/

var talentlists = (function() {
    var self = {},
        $e = {},
        debug = true,
        toggled = false
    
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

    function setupActionButtons(){

        $(document).on('click', 'a.actions_button', function(){

            $(this).closest('.member_list').css('z-index', 500);

            $('div.actions_layer').fadeOut('fast');
            $(this).toggleClass('selected');
            $('a.actions_button').not(this).removeClass('selected');

            if( $(this).hasClass('selected') ){
                $(this).parent('.actions_container').children('div.actions_layer').fadeIn('fast');
            }
            return false;

        });
    }

    function setupSorting() {
        $( ".detail_right" ).sortable({
          placeholder: "ui-state-highlight",
          items: '.member_list',
          handle: '.caption',
          cursor: "move",
          
          forcePlaceholderSize: true
        });
        $( ".detail_right" ).disableSelection();

    }

    function collapseAllInnerContent() {
        $('.inner_content').hide();
        $('a.collapseall').text('{ expand all }');
        toggled = true;
    }

    function showAllInnerContent() {
        $('.inner_content').show();
        $('a.collapseall').text('{ collapse all }');
        toggled = false;
    }

    function setupToggleAll() {
        $('a.collapseall').on('click', function() {
            log('toggled=' + toggled)
            if(!toggled) {
                collapseAllInnerContent()
            } else {
                showAllInnerContent()
            }

            return false;
        });
    }

    function toggleIndividual( object ) {
            object.parent().find('.inner_content').toggle();
            //$(this).parent().siblings('.comments_top, .comments_mid').toggle();
            
    }

    self.init = function() {

        log('--- Scripts Init ---')

        setupActionButtons();
        setupSorting();
        setupToggleAll();

        $('a.collapse').on('click', function() {
            toggleIndividual( $(this) );
            return false;
        });

        $( ".member_tabs" ).tabs();
    }

    return self

})()

//init
$(function () {
    talentlists.init()
});



$(document).ready(function() {

    $('div.actions_layer a').click(function(){
        $(this).parents('div:first').fadeOut('fast');
        $('a.actions_button .selected').removeClass('selected');
        $(this).closest('.member_list').removeAttr('style');
    });

    $('body').click(function(){
       $('div.actions_layer').fadeOut('fast');
       $('a.actions_button').removeClass('selected');
       $('.member_list').removeAttr('style');
    });

    $('.trigger_search').click(function(){
        $(this).closest('form').submit();
        return false;
    });

    $('.trigger_ajax').on('click', function(){
        var $this = $(this);
        /*
        $.get($(this).attr('href'), function(data){
            var divs = $(data).filter(function(){ return $(this).is('div.view_list_detail'); });
            $('.view_list_detail').html($('> div', divs));
            $('.comments_module').hide();
        });
    	*/
    	if( $(this).hasClass('trigger_hide') ) {

    		$(this).parent().parent().parent().parent().parent().addClass('member_hidden');
    	}
        return false;
    });

    $('.trigger_edit_listmember').on('click', function(){
        $.ajax({
            type : 'POST',
            url : $(this).attr('href'),
            success: function(data){
                $('.modal_form, #fade_layer').fadeIn('fast',function(){
                    $('#modal_form_content').html(data);
                });
            }
        });

        return false;
    });
});


