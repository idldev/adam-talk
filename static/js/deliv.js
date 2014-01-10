
var deliverable = (function() {
    var self = {},
        $e = {},
        debug = true,
        expertise_base_values = { novice: 58212, pro: 124586.25, expert: 212387.07 }
        base_value = expertise_base_values.novice,
        running_total = base_value
        

    
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

    function commafyValue(nStr){
        nStr += '';
        x = nStr.split('.');
        x1 = x[0].replace('$', '');
        x2 = x.length > 1 ? '.' + x[1].replace('$', '') : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return '$' + x1 + x2;
    }

    function _calculate() {
        //hack: reset to base price before calculating... 
        running_total = base_value

        $('select').each( function(i) {
            //find data modifier type:
            modtype = $(this).find(':selected').data('modifier-type')

            if(modtype != 'none') {
                //then get the mod-value too:
                modval = parseFloat($(this).find(':selected').data('modifier'))
                console.log(modval)

                if( modtype == 'mult') {
                    running_total = running_total * modval
                } else if (modtype == 'add') {
                    running_total = running_total + modval
                }

                console.log(running_total)
            }
        })

        // then calc the quantity:
        vid_qty = $('input[name=quantity]').val();
        if(vid_qty > 1) {
            qty_mod_val = parseFloat(1.8 + (0.7 * (vid_qty - 2) ) )
            console.log(qty_mod_val)

            running_total = running_total * qty_mod_val
            console.log(running_total)
        }

        //then upddate:
        _updateRanges(running_total)

    }

    function _updateRanges(value) {
        $('.low-total').html( commafyValue( (value * 0.7).toFixed(2) ) )
        $('.core-total').html( "(" + commafyValue( parseFloat(value).toFixed(2) ) + ")" )
        $('.high-total').html( commafyValue( parseFloat(value * 1.3).toFixed(2) ) )
    }

    function _redrawCharts() {
        $('#container').highcharts({
        
            chart: {
                type: 'columnrange',
                inverted: true
            },
            
            title: {
                text: 'Budget Ranges'
            },
        
            xAxis: {
                categories: ['Novice', 'Pro', 'Expert']
            },
            
            yAxis: {
                title: {
                    text: 'Budget'
                }
            },
            
            plotOptions: {
                columnrange: {
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            //return this.y + '°C';
                        }
                    }
                }
            },
            
            legend: {
                enabled: false
            },
        
            series: [{
                name: 'Budget',
                data: [
                    [30000, 40000],
                    [35000, 55000],
                    [55000, 100000]
                ]
            }]
        
        });
    }

    /**
    * SET UP INPUT TRIGGERS
    */
    function setupInputTriggers() {

        // expertise level:
        $(document).on('change', 'input[name=expertise]', function() {

            _level = $(this).val()
            base_value = expertise_base_values[_level]
             _calculate()
        });

        // concept -> mfg 
        $(document).on('change', '#select-concept', function() {
            if( $(this).val() == 'no' ) {
                //disable select:
                $('#select-mgfx').prop('disabled', 'disabled');
                $('#wrapper-select-mgfx').addClass('disabled');

            } else {
                $('#wrapper-select-mgfx').removeClass('disabled');
                $('#select-mgfx').prop('disabled', false);
            }
        });

        // band dependencies
        $(document).on('change', '#select-band-in', function() {
            log($(this).val())

            if( $(this).val() == 'yes' ) {
                //disable select:
                $('#wrapper-select-band-perform').hide().removeClass('hidden').fadeIn();
            } else {
                $('#wrapper-select-band-perform').fadeOut();   
            }

        });

        //more-than-one-boolean
        $(document).on('change', 'input[name=more-than-one-boolean]', function() {

            if( $(this).val() == 'yes' ) {
                //disable select:
                $('#wrapper-select-quantity').hide().removeClass('hidden').fadeIn();
            } else {
                //set qty to 0
                $('input[name=quantity]').val(0)
                $('#wrapper-select-quantity').fadeOut();   
                _calculate();
            }

        });

    }

    /**
    * Set up Select-based Calculations
    */
    function setupCalculations() {
        //$(this).find(':selected').data('id')
        $(document).on('change', 'select', function() {
            _calculate()
        });

        $(document).on('change', 'input[name=quantity]', function() {
            _calculate()
        });
    }

    /**
    * INIT FUNCTION 
    */
    self.init = function() {

        log('--- Scripts Init ---')
         setupInputTriggers() 
         setupCalculations()

        // animate
        $('html, body').animate (
             {scrollTop: 0 }, 500
        );

        //update initial price
        _updateRanges(base_value)

        //_redrawCharts()


    }

    return self

})()

//init
$(function () {
    deliverable.init()
});


