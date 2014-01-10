_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

var smart = (function() {
    var self = {},
        $e = {},
        debug = true,
        full_cart_data = { 'project_title': '', 'project_description': '', 'project_deliverables': [] },
        fake_cart_data = {
            'project_title': 'Build Website with Ecommerce for Fashion Brand',
            'project_description': 'We are looking for an expert to create a medium-sized website for the fashion industry. The website should feature a blog, CMS, art direction, and social media integration',
            'project_deliverables': [
                {   
                    'id': 'YOT2R',
                    'addons': [ { 'cost': 2000, 'name': 'User Accounts', 'slug': 'user-accounts' }, { 'cost': 3300, 'name': '10-20', 'slug': 'pages-ten-to-twenty' } ], 
                    'deliverable_name': 'Website', 
                    'deliverable_type': 'website', 
                    'deliverable_subtype': { 'name': 'Dynamic Site', 'type': 'dynamic-site', 'cost': 3000 },
                    'examples': ['http://www.google.com', 'http://www.hugeinc.com'] 
                },
                {   
                    'id': 'evvaI',
                    'addons': [ { 'cost': 2000, 'name': 'Script', 'slug': 'script' }, { 'cost': 3300, 'name': 'Motion Graphics', 'slug': 'motion-graphics' } ], 
                    'deliverable_name': 'Video', 
                    'deliverable_type': 'video', 
                    'deliverable_subtype': { 'name': 'Music Video', 'type': 'music-video', 'cost': 8000 }
                },
                {
                    'id': 'eifRS',
                    'deliverable_name': 'Bonzai Sculpting', 
                    'deliverable_type': 'unmatched', 
                    'examples': ['http://www.google.com', 'http://www.hugeinc.com'],
                    'price': 2000
                }
            ]

        },
        project_deliverables = {},
        addons = [],
        match2deliverables = [
            { match: "Web Site", canonical: "Website", template: "website", slug: "website" },
            { match: "Web site", canonical: "Website", template: "website", slug: "website" },
            { match: "web site", canonical: "Website", template: "website", slug: "website" },
            { match: "Website", canonical: "Website", template: "website", slug: "website" },
            { match: "website", canonical: "Website", template: "website", slug: "website" },
            { match: "web-site", canonical: "Website", template: "website", slug: "website" },
            { match: "Video", canonical: "Video", template: "video", slug: "video" },
            { match: "video", canonical: "Video", template: "video", slug: "video" },
            { match: "Teaser Video", canonical: "Video", template: "video", slug: "video" },
            { match: "teaser video", canonical: "Video", template: "video", slug: "video" },
            { match: "copywriting", canonical: "Copywriting", template: "copywriting", slug: "copywriting" },
            { match: "Copywriting", canonical: "Copywriting", template: "copywriting", slug: "copywriting" },
            { match: "copy writing", canonical: "Copywriting", template: "copywriting", slug: "copywriting" },
            { match: "Copy writing", canonical: "Copywriting", template: "copywriting", slug: "copywriting" },
            { match: "copy-writing", canonical: "Copywriting", template: "copywriting", slug: "copywriting" },
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
        })(),
        cart_packages = {},
        running_total = 0;


    

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

    function _inArray(needle,haystack) {
        var count=haystack.length;
        for(var i=0;i<count;i++) {
            if( haystack[i].toLowerCase() === needle.toLowerCase() ) { 
                return true;
            }
        }
        return false;
    }

    function findObjectById(id) {
        if (full_cart_data.project_deliverables) {
            for (var k in full_cart_data.project_deliverables) {
                if (full_cart_data.project_deliverables[k] == id) {
                    return full_cart_data.project_deliverables[k];
                }
                else if (full_cart_data.project_deliverables.length) {
                    return findObjectById(full_cart_data.project_deliverables[k], id);
                }
            }
        }
    }

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }


    function _keywords(word) {

        var filters = [
            "web site",
            "website",
            "social media( campaign)?",
            "((content )?marketing )?strategy",
            "strategy",
            "web design",
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
            "\\bui\\b",
            "copywriting",
        ]

        var re = new RegExp(filters.join("|"), "gi");
        //log( word.match( re ) )

        //if( word.match( re ) === null)  { alert('Sorry we have no match') }
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

    function _calculateTotals() {
        //sum all packages:
        running_total = _.reduce( cart_packages, function(memo, num) { return memo + num; }, 0 )
        //$('#total').html(running_total)
        log("Running Total: " + running_total)
    }



    /*
    * Main Set Ups for Buttons, Links, Clicks, etc.
    * =============================================================== */
    function setupButtons() {

        /* Deliverable Buttons */
        $('#console').on('click', '.drop', function() {

            //first, what unique cart we're in ...
            var _cart_package_id = $(this).parent().parent().parent().attr('id')

            //if this is a select_one_only...
            // we need to find which of the others is selected
            // then subtract *that* amount...
            if( $(this).parent().hasClass('select_one_only') ) {
                var _oldcost = $(this).siblings('.dropped').data('cost')
                cart_packages[_cart_package_id] -= _oldcost

                // remove all active states
                $(this).siblings('.drop').removeClass('dropped');

                //add it to this
                $(this).addClass('dropped');
                var _newcost = $(this).data('cost')
                //console.log('new Cost: ' + _newcost)

                cart_packages[_cart_package_id] += _newcost

            } else {
                //else, normal add/subtract
                $(this).toggleClass('dropped')
                var _cost = $(this).data('cost')

                if( $(this).hasClass('dropped') ) {
                     cart_packages[_cart_package_id] += _cost
                }

                if( !$(this).hasClass('dropped') ) {
                     cart_packages[_cart_package_id] -= _cost
                }
            }
            //check... 
            //console.log('Package Total: ' +  cart_packages[_cart_package_id] )

            //ok, let's get the data-slug and some innerHTML:
            var _nice = $(this).html();
            var _slug = $(this).data('slug')


            //populate data in full_cart:
            //console.log(full_cart_data.project_deliverables[_cart_package_id]['addons'])

            if(!addons[_cart_package_id]) { 
                addons[_cart_package_id] = []
                
            } 
            addons[_cart_package_id].push( { 'name' : _nice, 'slug' : _slug, 'cost': cart_packages[_cart_package_id] } )
             
            log(addons)
            //refresh totals
            _calculateTotals()
        });

        /* Process Buttons */
        $('a.process').on('click', function() {
            _parseContent()
            return false;
        })

        /* Step through form buttons */
        $(document).on('click', '.step a.btn', function() {
            var _nextDiv = $(this).parent().next()

            _nextDiv.fadeIn();
            scrollToSection(_nextDiv)

            return false
        })

        $('.sub-wrapper').on('click', '.drop', function() {
            if( $(this).parent().hasClass('select_one_only') ) { 
                // remove all active states
                $(this).siblings('.drop').removeClass('dropped');

                //add it to this
                $(this).addClass('dropped');
                
            } else {
                $(this).toggleClass('dropped')
            }
                
        });

        /* Add Specs Togggle */
        $(document).on('click', '.add_specs', function() {
            console.log('clicked add specs')
            $(this).parent().siblings('.inner_content').toggle()
        });

        /* close buttons on titlebar */
        $(document).on('click', '.close', function() {
            //get the unique ID
            id = $(this).parent().parent().attr('id')
            //assemble the unique cart item, in cart sidebar
            var cart_target = '#cart_' + id

            //remove the main cart item:
            $(this).parent().parent().remove()
            //remove the sidebar cart item:
            $(cart_target).remove()

            // remove the package:
            delete cart_packages[id]

            //recalculate the total
            _calculateTotals()

        });

        /* FINAL PREVIEW BUTTON */
        $(document).on('click', 'a.preview', function() {
            
            //1. Gather all data we need:
            full_cart_data['project_title'] = $('.project_title').val()
            full_cart_data['project_description'] = $('.project_description').val()
            
            for(var k in full_cart_data['project_deliverables']) {
                full_cart_data['project_deliverables'][k]['addons'].push(addons[k])
            }

            EJS.config({cache: false});
            var html = new EJS({url: '/static/js/lib/ejs_templates/post-preview.ejs'}).render(fake_cart_data);
            //console.log(html)

            //add item to Console/Cart...
            modal.open({content: html});

            return false
        })
    }


    function setupSliders() {
        /* Video % Slider */
        
        $( ".video_percent_slider" ).slider({
            value: 0,
            min: 0,
            max: 100,
            step: 25,
            slide: function( event, ui ) {
                $( ".video_percent_amount" ).val( ui.value +  "%" );
            }
        });
        $( ".video_percent_amount" ).val( $( ".video_percent_slider" ).slider( "value" )  + "%" );
        
    }


    function setupSmartInput() {
        $('.readme').keyup(function(event) {

            //console.log(event.which)
            
            if(!event) var event = window.event; // cross-browser shenanigans

            _parseContent()

            /*
            if(event.which == 13 || event.which == 32 ) {
                _parseContent()
            } else {
                //let's read the input and highlight in the .submenu
                var _currentInput = $('.readme').val();
                var _html = $('.submenu').html()

                var regex = new RegExp("(" + _currentInput + ")", "ig" );
                console.log( regex )

                var _newHTML = _html.replace(regex, "<strong>$1</strong>")

                $('.submenu').html(_newHTML)

            }
            */

            return true;

        });
    }


    function setupSubMenu() {

        $('.submenu_input').focus(function() {
            $('.submenu').fadeIn()
        }).blur(function() {
            $('.submenu').fadeOut()
        })

        $('.submenu ul li').on('click', 'a', function() {
            _item = $(this).data('item')
            _populateCart(_item)
            $('.readme').val('')

            return false
        })

    }




    /*
    * Parsing Functions
    * =============================================================== */
    function _parseContent() {

        //get the text input 
        var clientInput = $('.readme').val()

        //match with matchwords
        //var matches = _.intersection(matchwords, clientItems);
        var matches = _keywords(clientInput)

        if(!matches) {
            //console.log('no match yet!')
            return true;
        } else {
            //populate console
            _.each(matches, _populateCart);
            //_.each(matches, _populateMatches);

            $('.readme').val('');
            $('.submenu').fadeOut() 
        }
    }


    function _populateCart(item) {
        //find the template & info for each word/match
        var _fullmatch = _.findWhere(match2deliverables, { match: item })
        var _template = _fullmatch.template
        var _slug = _fullmatch.slug

        //create a unique id for this cart item, in case of multiples? and for removing... later... 
        var _unique_id = makeid()
        //console.log(_unique_id)
        var _data = { deliverable_name: _fullmatch.canonical, unique_id: _unique_id }

        //create a package for the running total
        cart_packages[_unique_id] = 0;

        //if we can't find? .. do x


        //else, let's render the matched template
        EJS.config({cache: false});
        var html = new EJS({url: '/static/js/lib/ejs_templates/' + _template + '.ejs'}).render(_data);
        //add item to Console/Cart...
        $('#console #extractions').append( html )
        setupSliders()

        //add item to full_cart_data object
        full_cart_data.project_deliverables[_unique_id] = { 'id': _unique_id, 'deliverable_name': _fullmatch.canonical, 'deliverable_type': _fullmatch.template, 'addons': [] }
        log( full_cart_data )
    }


    /*
    * INIT() Function
    * =============================================================== */
    self.init = function() {

        log('--- Smart Scripts Init ---')
        /* clean up open ('.inner_content') */

        // animate
        $('html, body').animate (
             {scrollTop: 0 }, 500
        );

        setupSmartInput()
        setupButtons()
        setupSubMenu()

        /** Slider **/
        $( "#slider-range" ).slider({
          range: true,
          min: 2000,
          max: 500000,
          values: [ 7500, 30000 ], //dynamic population...
          slide: function( event, ui ) {
            $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
          }
        });
        $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
          " - $" + $( "#slider-range" ).slider( "values", 1 ) );


        /** Datepicker **/
        $( ".datepicker" ).datepicker({});


    }

    return self

})()

//init
$(function () {
    smart.init()
});



