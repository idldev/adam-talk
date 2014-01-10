_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

var smart = (function() {
    var self = {},
        $e = {},
        debug = true,
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

        if( word.match( re ) === null)  { alert('Sorry we have no match') }
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

        $('#total').html(running_total)
    }

    /* Set Ups */
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
                console.log('Old Cost: ' + _oldcost)

                cart_packages[_cart_package_id] -= _oldcost

                // remove all active states
                $(this).siblings('.drop').removeClass('dropped');

                //add it to this
                $(this).addClass('dropped');
                var _newcost = $(this).data('cost')
                console.log('new Cost: ' + _newcost)

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
            console.log('Package Total: ' +  cart_packages[_cart_package_id] )

            //populate item in sidebar:
            $('#cart_' + _cart_package_id + ' > .item_pricing .item_price_sum').html( "$" + cart_packages[_cart_package_id] )
            $('#cart_' + _cart_package_id + ' > .item_pricing a.sidebar_cart_add_specs').hide()

            //refresh totals
            _calculateTotals()
        });

        /* Process Buttons */
        $('a.process').on('click', function() {
            _parseContent()
            return false;
        })

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

        /* Open Add Specs from Cart */
        $(document).on('click', '.sidebar_cart_add_specs', function() {
            console.log('click')

            _target = $(this).attr('href') + ' > .inner_content'
            console.log(_target)

            $(_target ).show()
            return false
        })

    }

    function setupCartButtons() {

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

    function setupSidebar() {
        var $sidebar   = $("#shopping_cart"), 
        $window    = $(window),
        offset     = $sidebar.offset(),
        topPadding = 55;

        $window.scroll(function() {
            if ($window.scrollTop() > offset.top) {
                $sidebar.stop().animate({
                    marginTop: $window.scrollTop() - offset.top + topPadding
                });
            } else {
                $sidebar.stop().animate({
                    marginTop: 0
                });
            }
        });

    }

    function setupSmartInput() {
        $('.readme').keypress(function(event) {

            console.log(event.which)
            
            if(!event) var event = window.event; // cross-browser shenanigans

            if(event.which == 13 || event.which == 32 ) {
                _parseContent()
            }
            return true;

        });
    }

    function setupSubMenu() {
        
        $('.submenu_input').focus(function() {
            $.pageslide({ href: '#submenu', direction: "left", modal: true });
        }).blur(function() {

        })

        $('#submenu ul li').on('click', 'a', function() {
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

        //populate console
        _.each(matches, _populateCart);
        //_.each(matches, _populateMatches);

        $('.readme').val('');
        $('.submenu').fadeOut()

    }


    function _populateCart(item) {
        //find the template & info for each word/match
        var _fullmatch = _.findWhere(match2deliverables, { match: item })
        var _template = _fullmatch.template
        var _slug = _fullmatch.slug

        //create a unique id for this cart item, in case of multiples? and for removing... later... 
        var _unique_id = makeid()
        console.log(_unique_id)
        var _data = { deliverable_name: _fullmatch.canonical, unique_id: _unique_id }

        //create a package for the running total
        cart_packages[_unique_id] = 0;

        //if we can't find? .. do x


        //else, let's render the matched template
        EJS.config({cache: false});
        var html = new EJS({url: '/static/js/ejs_templates/' + _template + '.ejs'}).render(_data);
        //add item to Console/Cart...
        $('#console #extractions').append( html )
        setupSliders()


        //add item to sidebar cart:
        var cart_html = '<div class="sidebar_cart_item" id="cart_' + _unique_id + '"><div class="item_title">' + _fullmatch.canonical + '</div>'
        cart_html += '<span class="item_pricing"><span class="item_price_sum">$Unknown</span><a href="#' + _unique_id + '" class="sidebar_cart_add_specs">Add Specs</a></span>'
        cart_html += '</div><!--// end item -->'


        $('#shopping_cart_cart').append(cart_html)




    }

    function _populateMatches(item) {

    }



    /*
    * INIT() Function
    * =============================================================== */
    self.init = function() {

        log('--- Smart Scripts Init ---')
        /* clean up open ('.inner_content') */

        setupSmartInput()
        setupButtons()
        setupSidebar()
        setupCartButtons()
        setupSubMenu()

        
            

    }

    return self

})()

//init
$(function () {
    smart.init()
});



