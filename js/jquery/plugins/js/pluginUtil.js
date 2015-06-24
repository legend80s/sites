/*
 * pluginUtil.js
 * 2015/1/7
 * legend80s-bupt
 * jquery插件required，包含制作jquery插件必须的一些方法
 */

;(function () {

	var pluginUtil = _createNS('legend.jquery.pluginUtil');
	//pluginUtil.insertCSS = insertCSS;
	pluginUtil.help = help;

	// functions
	function _createNS(ns) {
		var nss = ns.split('.'),
			length = nss.length,
			i,
			n,
			obj = window;

		for (i = 0; i < length; ++i) {
			n = nss[i];

			if (typeof obj[n] === 'undefined') { // 不存在
				obj[n] = {};
			}
			obj = obj[n];
		}
		
		return obj;
	}

    /*function insertCSS(href) {

		if (typeof href !== 'string') {
			console.error('argument is not a string type');
			return ;
		}

	    var doc = document,
			css = doc.createElement('link');

		css.href = href;
		css.rel = 'stylesheet';

		var head = doc.head || doc.getElementsByTagName('head')[0];
		if (head) {
			head.appendChild(css);
		}
		else {
			var fileName = href.slice(href.lastIndexOf('/') + 1);
		    console.error(fileName + ' load failed: no "head" element exists in the HTML document');
		}
	}*/

	function _toString(obj) {
	    var str = '',
			k,
			hasOwn = Object.prototype.hasOwnProperty;

		for (k in obj) {
			if (hasOwn.call(obj, k)) {
				str += k + ': ' + obj[k] + '\n';
			}
		}

		return str;
	}
	function _log(message) {
	    if (console && console.log) {
			console.log.apply(console, arguments);
	    }
		else {
		    alert(message);
		}
	}
	
	function help(info) {

		var defaults = _toString(info.defaults),
			defaultStr = defaults? '默认设置是：\n' + defaults + '\n': '',

			description = 'jquery插件 - ' + info.name + ': ' + info.brief + '。\n' + defaultStr + '%c- by ' + info.author + ' ' + info.date;

		_log(description, 'color:red;');
	}
}());