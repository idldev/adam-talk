
var smart = (function() {
    var self = {},
        $e = {},
        debug = true,
        global_matches = [],
        filters = [],
        relations = [
            { pattern: "web site", parent: "Website" },
            { pattern: "website", parent: "Website" },
            { pattern: "social media( campaign)?", parent: "Social Media Campaign" },
            { pattern: "web design", parent: "Web Design" },
            { pattern: "((content )?marketing )?strategy", parent: "Content Marketing Strategy" },
            { pattern: "strategy", parent: "Strategy" },
            { pattern: "e[\- ]?commerce", parent: "ECommerce" },
            { pattern: "user experience", parent: "User Experience" },
            { pattern: "user interface", parent: "User Interface" },
            { pattern: "project manage(r|ment)", parent: "Project Management" },
            { pattern: "product manage(r|ment)", parent: "Product Management" },
            { pattern: "(re(-)?)?design(er)?", parent: "Design" },
            { pattern: "((teaser|web) )?video(s)?", parent: "Teaser Video" },
            { pattern: "\\bapp\\b", parent: "App" },
            { pattern: "\\bios\\b", parent: "iOS" },
            { pattern: "android", parent: "Android" },
            { pattern: "mobile", parent: "Mobile" },
            { pattern: "seo/sem", parent: "SEO/SEM" },
            { pattern: "\\bseo\\b", parent: "SEO/SEM" },
            { pattern: "\\bsem\\b", parent: "SEO/SEM" },
            { pattern: "brand(ing)?", parent: "Branding" },
            { pattern: "ux/ui", parent: "UI/UX" },
            { pattern: "ui/ux", parent: "UI/UX" },
            { pattern: "\\bux\\b", parent: "UI/UX" },
            { pattern: "\\bui\\b", parent: "UI/UX" },
        ],
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

    
    /* General Helper Functions:
    =================================================== */
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

    /* Set Up Scripts:
    =================================================== */

    function  _createRegexFilters() {
        _.each(relations, function(list) {
            filters.push(list.pattern)
        });


    }

    function setupProcessButton() {
        $('#step1').on('click', 'a.process', function() {
            log('process me!')
            _parseContent()
            return false;
        })
    }

    function setupDeliverableButtons() {
        $('#console').on('click', '.drop', function() {
            $(this).remove();
        });
    }

    function setupSmartInput() {
        $('.readme').keyup(function(event) {

            if(!event) var event = window.event; // cross-browser shenanigans
            if(event.keyCode === 32) { // this is the spacebar
                _parseContent()
            }

            if(event.which == 13) {
                //_parseFullContent()
            }

            return true; // treat all other keys normally;
        });
    }

    /* Workhorse Scripts:
    =================================================== */

    function _keywords(word) {

        //getting our filters from the _createRegexFilters()
        var re = new RegExp(filters.join("|"), "gi");
        //log( word.match( re ) )

        return(word.match( re ) );
    }


    function _parseContent() {

        //get the text input 
        var clientInput = $('.readme').val()

        if(clientInput == '' ||  clientInput == ' ' ) { 
            $('#console #extractions').html(''); 
            global_matches.length = 0; 
        }

        //match with matchwords
        //var matches = _.intersection(matchwords, clientItems);
        var matches = _keywords(clientInput)
        //log(matches)

        matches = _.uniq(matches)
        log(matches)

        _.each(matches, _populateButton);
        _.each(matches, _populateMatches);
    }



    function _populateButton(word) {
        //check if the keyword is already matched?
        if(!_inArray(word, global_matches)) {
            log(word + ": wasn't in array! let's populate")
            var _button = '<div class="drop dropped">' + word + '</div>';
            $('#console #extractions').append(_button)
            //add to global array 
            global_matches.push(word)
        }  else {
            log(word + ": was already in array")
        }
    }

    function _populateMatches(word) {
        //nothing yet...
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
        _createRegexFilters()
        setupSmartInput()
        setupProcessButton()
        setupDeliverableButtons()


    }

    return self

})()

//init
$(function () {
    smart.init()
});

