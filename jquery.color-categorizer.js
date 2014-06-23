/*
 * jQuery Color Categorizer
 *
 * @author  : Yutaka Tajika
 *
 */

;
(function($) {

	'use strict';

	// Include RGBaster
	/*!  rgbaster - https://github.com/briangonzalez/rgbaster.js - 14-01-2014 */
	!function(a){"use strict";var b=function(){return document.createElement("canvas").getContext("2d")},c=function(a,c){var d=new Image,e=a.src||a;"data:"!==e.substring(0,5)&&(d.crossOrigin="Anonymous"),d.onload=function(){var a=b();a.drawImage(d,0,0);var e=a.getImageData(0,0,d.width,d.height);c&&c(e.data)},d.src=e},d=function(a){return["rgb(",a,")"].join("")},e=function(a){return a.map(function(a){return d(a.name)})},f=5,g=10,h={};h.colors=function(a,b,h){c(a,function(a){for(var c=a.length,i={},j="",k=[],l={dominant:{name:"",count:0},palette:Array.apply(null,Array(h||g)).map(Boolean).map(function(){return{name:"0,0,0",count:0}})},m=0;c>m;){if(k[0]=a[m],k[1]=a[m+1],k[2]=a[m+2],j=k.join(","),i[j]=j in i?i[j]+1:1,"0,0,0"!==j&&"255,255,255"!==j){var n=i[j];n>l.dominant.count?(l.dominant.name=j,l.dominant.count=n):l.palette.some(function(a){return n>a.count?(a.name=j,a.count=n,!0):void 0})}m+=4*f}b&&b({dominant:d(l.dominant.name),palette:e(l.palette)})})},a.RGBaster=a.RGBaster||h}(window);

	var methods = {

		init : function( options ) {

			return this.each(function() {
				
				this.self = $(this);

				console.log(this.self[0],this.self);

				var data = this.self.data('colorCategorizer');

				if (!data) {

					this.self.data('colorCategorizer', {
						target: this.self
					});

					this.opt = $.extend(true, {}, $.fn.colorCategorizer.defaults, options);

					methods.getClosest.call(this);

				}

			});

		},

		getClosest: function() {

			var thisColors = this.opt.colors;

			var img = this.self.attr('src');

			var dominantRgb, palette;

			RGBaster.colors(img, function(colors) {

				dominantRgb = colors.dominant;
				palette = colors.palette;

				var dominantColor = dominantRgb.replace('rgb(', '');
				dominantColor = dominantColor.replace(')', '');
				dominantColor = dominantColor.split(',');

				var distance = new Array();

				for (var i = 0; i < thisColors.length; i++) {
					distance[i] = Math.sqrt( Math.pow( thisColors[i][0] - parseInt(dominantColor[0]), 2 ) + Math.pow( thisColors[i][1] - parseInt(dominantColor[1]), 2 ) + Math.pow( thisColors[i][2] - parseInt(dominantColor[2]), 2 ) );
				}

				console.log(distance);

				var minIndex = distance.indexOf( Math.min.apply(Math, distance) );
				var minValue = Math.min.apply(Math, distance);
				var closest = thisColors[minIndex];

				console.log(closest);

			}, 20);

		}

	};

	$.fn.colorCategorizer = function( method ) {

		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist!' );
		}

	};

	// default
	$.fn.colorCategorizer.defaults = {
		colors: [[0, 0, 0], [255, 255, 255], [255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0], [255, 0, 255], [0, 255, 255]]
	};

})(jQuery);