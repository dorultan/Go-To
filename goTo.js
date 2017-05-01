'use strict';

(function($){
	$.fn.goTo = function(options){

		var settings = $.extend(this.goTo.defaults, options);

		return this.each(function(){
			var api = new API($(this), settings);
			api.init();
		})
	}

	$.fn.goTo.defaults = {
		mobileHA: false,
		speed: 0,
		easeing: 'ease-in-out',
		parentOffset: 80,
		autoScroll: true,
		detect: true
	};

	function API(elem, settings) {
		this.elem = elem;
		this.opts = settings;
		this.links = [];
	}
//The button wich was click it will have data-goTo="nr"
//The element where it has to go it will have data-arrive="nr"

	API.prototype = {
		init: function() {
			var that = this;
			this.elem.on('click', function(e){
				that.goo($(this))
				e.preventDefault();
			})

			$(window).on('scroll load', function(){
				that.scrollDetect(that.elem.parent())
			})

			this.getNavlinks();
		},

		goo: function(elem){
			var val = elem.attr('data-goTo');
			var dataVal = parseInt(val);
			var element = findElement(dataVal);
			var offS = 0 - this.opts.parentOffset;
			this.transition({
				offset: offS,
				mobileHA: this.opts.mobileHA,
				speed: this.opts.speed,
				elem: element
			})
		},

		getOffsets: function(elem) {
			var viewTop;
			var viewBottom;

			if(elem !== undefined) {
				viewTop = elem.offset().top;
				viewBottom = viewTop + elem.height();
			}
			
			return {
				Top: viewTop,
				Bottom: viewBottom
			}
		},

		getNavlinks: function() {
			var container = this.elem.parent();

			if(container !== undefined) {
				var array = $.makeArray(container.children())
				this.links = array;
			}
		},

		scrollDetect: function(elem) {
			var that = this;
			var win = $(window);
			var winOffT = win.scrollTop();
			var winOffB = winOffT + win.height();
			var elems = findElement();
			var current = 0;
			var ancors = $(that.links).children();

			$.each($(elems), function(idx){
				 if((that.getOffsets($(this)).Bottom - that.opts.parentOffset) <= winOffB) {
				 	
				 	if(_hasAttr(ancors.parent(), 'data-lightOn')) {
				 		ancors.eq(idx).addClass('linkActive');
						ancors.eq(idx -1).removeClass('linkActive');
						ancors.eq(idx +1).removeClass('linkActive');
				 	}
				 }
				 
			})
		},

		transition: function(context) {
			var element;

			if(context.elem !== undefined) {
				element = context.elem;
			}

			element.velocity('scroll', {
				offset: context.offset,
				mobileHA: context.mobileHA,
				duration: context.speed
			})
		}
	}

	//filter the element wich hasData of a number and if it has return the element

	function findElement(dataVal) {
		var element;

		if(arguments.length) {
			$('body').children().filter(function(){
				if(_hasData($(this), 'arrive', dataVal)) {
					element = $(this);
				}
			})
		} else if(!arguments.length) {
			element = [];
			$('body').children().filter(function(){
				if(_hasAttr($(this), 'data-detect', "")) {
					element.push(this);
				}
			})
		}

		return element;
	}



	function _hasData(element, type, value) {
		var elem;
		var has = false;

		if(!arguments.length) {
			return;
		}

		if($.type(element) !== 'null') {
			elem = element;
			
			 if(element.data()[type] === value) {
				has = true;
			}
		}
		return has;
	}

	function _hasAttr(elem, attrType, attrVal) {

		if(elem !== undefined) {
			if(arguments.length === 3) {
				if(elem.attr(attrType) === attrVal) {
					return true;
				}
			} else {
			
				if(elem.attr(attrType)) {
					return true;
				}
			}
		}

		return false;
	}
})(jQuery);