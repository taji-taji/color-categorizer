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

				var data = this.self.data('colorCategorizer');

				if (!data) {

					this.self.data('colorCategorizer', {
						target: this.self
					});

					this.opt = $.extend(true, {}, $.fn.colorCategorizer.defaults, options);

					methods._bind.call(this);
					methods._getNearTrigger.call(this, '_afterGetNear.cc');

				}

			});

		},

		_bind: function() {

			this.self.on('_afterGetNear.cc', function(e, data) {

				methods._afterGetNear.call(this, e, this.self, data);

			});

			this.self.on('_getNear.cc', function(e, data) {

				console.log(data);
				return data;

			});

		},

		_getNearTrigger: function( eventName ) {

			var that = this;

			var thisColors = that.opt.colors;

			var img = that.self.attr('src');

			RGBaster.colors(img, function(colors) {

				var dominantRgb = colors.dominant;
				var palette = colors.palette;

				var dominantColor = dominantRgb.replace('rgb(', '')
										.replace(')', '')
										.split(',');

				var distance = new Object();
				var minValue = Infinity;
				var minIndex = "";

				for (var i in thisColors) {
					distance[i] = Math.sqrt( Math.pow( thisColors[i][0] - parseInt(dominantColor[0]), 2 ) + Math.pow( thisColors[i][1] - parseInt(dominantColor[1]), 2 ) + Math.pow( thisColors[i][2] - parseInt(dominantColor[2]), 2 ) );
					if (minValue > distance[i]) {
						minValue = distance[i];
						minIndex = i;
					}
				}

				var closestColor = thisColors[minIndex];
				that.self.trigger(eventName, { closest: {  label: minIndex, color: closestColor, palette: palette } });

			}, 10);

		},

		_afterGetNear: function( e, target, data ) {

			this.self.data('colorCategorizer')['closest'] = data;

			if (this.opt.afterGetNear != undefined) {

				return this.opt.afterGetNear(e, target, data);

			} else {

				this.self.after('<span style="background:rgb('+data['closest']['color'][0]+','+data['closest']['color'][1]+','+data['closest']['color'][2]+')">'+data['closest']['label']+'</span>');
			
			}

		},

		afterGetNear: function() {

			this.each(function() {

				methods._getNearTrigger.call(this, '_afterGetNear.cc');

			});

		},

		getNear: function() {

			return this.data('colorCategorizer')['closest'];

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
		colors: {
					'black'     : [0, 0, 0],
					'white'     : [255, 255, 255],
					'red'       : [255, 0, 0],
					'green'     : [0, 255, 0],
					'blue'      : [0, 0, 255],
					'yellow'    : [255, 255, 0],
					'magenta'   : [255, 0, 255],
					'cyan'      : [0, 255, 255],
					'skyblue'   : [135, 206, 235],
					'pink'      : [255, 192, 203],
					'lightgreen': [144, 238, 144],
					'purple'    : [128, 0, 128],
					'lightblue' : [173, 216, 230],
					'orange'    : [255, 165, 0],
					'brown'     : [165, 42, 42],
					'cornsilk'  : [255, 248, 220]
				},
		afterGetNear: undefined // function
	};

})(jQuery);