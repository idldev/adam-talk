
var smart = (function() {
    var self = {},
        $e = {},
        debug = true,
        matchwords = (function () {
            var json = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': '/static/js/data/matchwords.json',
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

    function _keywords(word) {

        var filters = [
            "web site",
            "website",
            "social media( campaign)?",
            "web design",
            "((content )?marketing )?strategy",
            "strategy",
            "e[\- ]?commerce",
            "user experience",
            "user interface",
            "pro(duct|ject) manage(r|ment)",
            "(re(-)?)?design(er)?",
            "((teaser|web) )?video(s)?",
            "\\bapp\\b",
            "\\bios\\b",
            "android",
            "mobile",
            "seo/sem",
            "\\bseo\\b",
            "\\bsem\\b",
            "brand(ing)?",
            "ux/ui",
            "ui/ux",
            "\\bux\\b",
            "\\bui\\b"
        ]

        var re = new RegExp(filters.join("|"), "gi");
        //log( word.match( re ) )

        return(word.match( re ) );
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

    /* Set Ups */
    function setupDeliverableButtons() {
        $('#console').on('click', '.drop', function() {
            $(this).toggleClass('dropped')
        });
    }


    function readInRealTime() {

        $('.readme').keyup(function () {
            $('#typeconsole').text($(this).val());
        });

    }

    function setupSmartInput() {
        $('.readme').keypress(function(e) {
            if(e.which == 13) {
                _parseContent()
            }
        });
    }

    function setupProcessButton() {
        $('a.process').on('click', function() {
            _parseContent()
            return false;
        })
    }

    function _parseContent() {

        $('#console').hide()

        //clear #console
        $('#console #extractions').html('')

        //get the text input 
        var clientInput = $('.readme').val()

        //match with matchwords
        //var matches = _.intersection(matchwords, clientItems);
        var matches = _keywords(clientInput)

        //populate console
        _.each(matches, _populateButton);
        _.each(matches, _populateMatches);

        $('.readme').val('');
        $('#console').fadeIn()
    }



    function _populateButton(word) {
        var _button = '<div class="drop dropped">' + word + '</div>';
        $('#console #extractions').append(_button)
    }

    function _populateMatches(word) {

    }

    function _inArray(needle,haystack) {
        var count=haystack.length;
        for(var i=0;i<count;i++) {
            if( haystack[i].toLowerCase() === needle.toLowerCase() ) { 
                return true;
            }
        }
        return false;
    }


    

    /**
    * INIT FUNCTION 
    */
    self.init = function() {

        log('--- Smart Scripts Init ---')
        //console.log(matchwords)
        $('#console').hide()

        setupSmartInput()
        setupProcessButton()
        //readInRealTime()
        setupDeliverableButtons()


    }

    return self

})()

//init
$(function () {
    smart.init()
});

