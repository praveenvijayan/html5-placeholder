
/*
 *  Project: Crossbrowser html5 input placeholder
 *  Description: HTML5 form 'placeholder' attribute shows text on the fields until the control get focus. 
 *  Author: 
 *  License: 
 */

// the semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, undefined ) {
    
    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.
    
    // window is passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'placeholder',
        document = window.document,
        defaults = {
            behavior: "remove", //remove, overlay
            color:0 // color or none, 0
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or 
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
    }

    Plugin.prototype.init = function () {
        // Place initialization logic here
        // You already have access to the DOM element and the options via the instance, 
        // e.g., this.element and this.options

        "use strict";

        var behavior = this.options.behavior,
            color   = this.options.color,
            isPlaceholder = "placeholder" in document.createElement('input');

    if(!isPlaceholder){

        var placeholderFocus = function(elem,evt){

            var placeholder = $(elem).attr('placeholder'),
                val = $(elem).val();

            if(evt === 'focus'){

                return function(){
                    val = $(elem).val();

                    if(behavior === 'overlay'){
                        $(elem).on('keyup', function(e){
                            if(placeholder === val){
                                val = $(elem).val();
                                var lastChar = val.substring(val.length, val.length-1);
                                $(elem).val(''+lastChar);
                                $(elem).removeClass('placeholderColor');
                            }   
                        });

                        return;
                    }

                    if(behavior === 'remove' && placeholder ===  val){
                        $(elem).val('');
                        $(elem).removeClass('placeholderColor');
                    }   
                }

            }else{
                return function(){
                    if($(elem).val() === ''){
                        $(elem).val(placeholder);
                        $(elem).addClass('placeholderColor');
                    }       
                }
            }
        } 

        $('[placeholder]').each(function(i,val){

            $(val).val($(val).attr('placeholder'));
            $(val).addClass('placeholderColor');  
                        
            $(val).on({
                'focus':placeholderFocus(this,"focus"),
                'blur':placeholderFocus(this,"blur")
            });
        });

        $('form').submit(function(){
            $("[placeholder]", this).each(function(index, elem){
                $(elem).val('');
            });
        });
    }

   
    var sheet = document.createElement('style'), styleRule='';
    if(color !== 'none' || !color){
        styleRule += "[placeholder]::-webkit-input-placeholder {color:"+color+";} [placeholder]:-moz-placeholder {color:"+color+";} [placeholder].placeholderColor{color:"+color+";}";
    }
        
    if(behavior !== 'overlay'){
        styleRule += "[placeholder]:focus::-webkit-input-placeholder {color:transparent;} [placeholder]:focus:-moz-placeholder {color:transparent;}";
    }

    $(sheet).html(styleRule);
    document.head.appendChild(sheet);
 
    };

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
    };

}(jQuery, window));