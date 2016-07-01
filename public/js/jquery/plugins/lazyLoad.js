/*
 * lazyLoad.js
 * 2014/12/25
 * legend80s-bupt
 * jquery插件
 */

;(function ($) {
    $.fn.lazyLoad = function (opt) {

        var settings = $.extend({}, $.fn.lazyLoad.defaults, opt),
			cls = settings.cls,
			src = settings.src,
			$selectors = this;

		$selectors.each(function (i, v) {
			_lazyLoad($(v), cls, src);
		});

		return $selectors; // 保持级联
		
		// _lazyLoad
		function _lazyLoad($this, settings) {
			
		}
	};
	
	var lazyLoad = $.fn.setNumber;

	lazyLoad.defaults = {
		replaceSrc: 'example.jpg',
		originalSrc: 'lazy-src'
	};

	// 上面defaults中的参数可以被覆盖，toString用来说明defaults，请勿覆盖
	lazyLoad.defaults.toString = function () {
		var str = '',
			k,
			hasOwn = Object.prototype.hasOwnProperty;

		for (k in this) {
			if (hasOwn.call(this, k) && k !== 'toString') {
				str += k + ': ' + this[k] + '\n';
			}
		}

		return str;
	};

	function log(message) {
	    if (console && console.log) {
			console.log.apply(console, arguments);
	    }
		else {
		    alert(message);
		}
	}

	lazyLoad.author = 'legend80s-bupt';
	lazyLoad.date = '2014/11/13 农历(闰)九月廿一';
	lazyLoad.name = 'lazyLoad';
	lazyLoad.description = 'jquery插件 - ' + lazyLoad.name + ': 设置数字（采用HTML5的type="range"的input元素）,默认设置是：\n' + lazyLoad.defaults.toString() + '\n%c- by ' + lazyLoad.author + ' ' + lazyLoad.date, 'color:red;';

	lazyLoad.help = lazyLoad.toString = function () {
	    log(lazyLoad.description);
	};

}(jQuery));