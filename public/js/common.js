/*
 * common.js
 * 2014/11/14 22:24
 * legend80s-bupt
 */

;(function (win, doc) {
	var legend = win.legend = win.legend || {};
	
	// legend 添加方法
	legend.createNS = createNS;
	legend.storage = storage;
	// legend.number 添加方法
	var number = legend.number = legend.number || {};
	number.addZero = addZero;
	number.formatTime = formatTime;
	number.formatAmount = formatAmount;
	// legend.string 添加方法
	var string = legend.string = legend.string || {};
	//string.trim = _trim;
	string.engQuotationToCh = engQuotationToCh();
	// legend.html 添加方法
	var html = legend.html = legend.html || {};
	html.loadScript = loadScript();
	html.makeAnchor = makeAnchor;
	html.makeImgStr = makeImgStr;
	html.addClassToLetter = addClassToLetter;
	html.id = id;
	// legend.calendar.date 添加方法
	var calendar = legend.calendar = legend.calendar || {},
		dateModule = calendar.date = calendar.date = {};
	dateModule.isNewDay = isNewDay;
	dateModule.formatDate = formatDate;
	// legend.pic 添加方法
	var pic = legend.pic = legend.pic || {};
	pic.err = errReplace;
	pic.errHide = errHide;
	// legend.array 添加方法
	var array = legend.array = legend.array || {};
	array.some = some;
	// 私有方法
	function createNS(ns) {
		var nss = ns.split('.'),
			length = nss.length,
			i,
			n,
			obj = this; // window

		for (i = 0; i < length; ++i) {
			n = nss[i];

			if (typeof obj[n] === 'undefined') { // 不存在
				obj[n] = {};
			}
			obj = obj[n];
		}
		
		return obj;
	}

	function storage(key, value) {
	    if ('localStorage' in window) { // ie8+
			storage = function (key, value) {
				var localStorage = window.localStorage,
					k;

				if (!key) {
					//throw new TypeError('need 1 or 2 arguments!');
					return ;
				}

				if (typeof key === 'object') {
					var k;
					for (k in key) {
					    localStorage[k] = key[k];
					}
				}

				if (value === undefined) {
					return localStorage[key];
				}

			    localStorage[key] = value;
				return true;
			}
	    }
		else {
		    storage = function (key, value) {
				console.error('localStorage not supported!');
				return false;
			}
		}

		return storage(key, value);
	}

	// base.js begin
	function id(str, wrapper) {
		return typeof str === 'string' ? (wrapper || doc).getElementById(str) : str;
	};

	function engQuotationToCh() {
		var engQuatationRegExp = /[\"\']([^\"\']*)[\"\']/g;

		return function (str) {
			return str.replace(engQuatationRegExp, '“$1”');
		};
	}

	/*
	“uninitialized” – 原始状态 
	“loading” – 下载数据中..
	“loaded” – 下载完成
	“interactive” – 还未执行完毕.
	“complete” – 脚本执行完毕.
	*/
	// 改善 loadScript：http://www.cnblogs.com/_franky/archive/2010/06/20/1761370.html
	function loadScript() {
		var otherScript = doc.getElementsByTagName('script')[0];
		
		return function (url, succ, cls) {
      //console.log('load url: ' + url);
			var script = doc.createElement("script");
			script.async = true;

			if (!url) {
				return ;
			}

			cls && (script.className = cls);
			
			// onreadystatechange 注册必须在 appendChild 之前
			// 否则无法监测到 onreadystatechange 事件
			if (succ) {
				if (script.readyState) {  //IE            
					script.onreadystatechange = function () {           
						if ("loaded" === script.readyState || "complete" === script.readyState) { 
							script.onreadystatechange = null; // 防止 ie < 6 内存泄漏        
							succ(script);
						}
						
					}
				} 
				else { //others        
					script.onload = function() {              
						succ(script);
					}
				}
			}
			script.src = url;
			// 要是dom没有head元素怎么办
			// doc.getElementsByTagName("head")[0].appendChild(script);
			// 根据 Google Analytics 的经验
			//otherScript = doc.getElementsByTagName('script')[0];
			//otherScript.parentNode.insertBefore(script, otherScript);
			otherScript.parentNode.appendChild(script);
		};
	}

	function makeAnchor(content, url, className, title, openInNewWindow) {
		if (!content) {
			return '';
		}
		typeof openInNewWindow === 'undefined' && (openInNewWindow = true);

		if (typeof content === 'string') {
			return '<a ' + (openInNewWindow ? 'target="_blank" ' : '') + 'href="' + url + '"' + (className ? ' class="' + className + '"': '') + ''+ (title ? ' title="' + title + '"' : '') +'>' + content + '</a>';
		}
		else { // obj
			var a = ['<a'],
				attrs = arguments[0],
				linkcontent = arguments[1] || '',
				safeObjHasOwn = Object.prototype.hasOwnProperty;

			for (var attrName in attrs) {
				if (safeObjHasOwn.call(attrs, attrName)) {
					a.push(' ' + attrName + '="' + attrs[attrName] + '"');
				}
			}
			// 增加 target="_blank"
			if (!(attrs['target'] === '_blank')) {
				a.push(openInNewWindow ? ' target="_blank"' : '');
			}

			a.push('>'+linkcontent+'</a>');

			return a.join('');
		}
	}
	
	// 形参 attrs: { src: , width: , height: , alt: , title: , class: } 	
	function makeImgStr(attrs) {
		var img = '<img ';
		for (var attr in attrs) {
			if (attrs.hasOwnProperty(attr)) {
				img += (attr + '="' + attrs[attr] + '" ');
			}
		}
		img += '></img>';
		return img;
	}

	function addClassToLetter(s, i, c) {
		if (0 <= i && i < s.length) {
			s = s.substring(0, i) + '<span class="' + c + '">' + s.charAt(i) + '</span>' + s.substring(i+1);
		}
		return s;
	}

	// parent 没有测试
	function _parent(node) {
		if (!node) {
			return null;
		}

		var p = node.parentNode;

		while (p.nodeType !== 1) {
			p = node.parentNode;
		}

		return p;
	}

	//阻止浏览器的默认行为 
	function stopDefault(e) { 
		//阻止默认浏览器动作(W3C) 
		if ( e && e.preventDefault ) {
			e.preventDefault();
			//alert('w3c');
		}
		//IE中阻止函数器默认动作的方式 
		else if (window.event.returnValue) {
			//alert('ie');
			window.event.returnValue = false; 
		}
		return false; 
	}
	// legend.html end

	function some(arr, fn) {
		if (arr.some) {
			return arr.some(function (v) {
			    return !!(fn ? fn(v): v);
			});
		}
		else {
		    for (var i = 0, len = arr.length; i < len; ++i) {
				if ( fn ? fn(arr[i]) : arr[i]) {
					return true;
				}
			}

			return false;
		}
		
	}

	function stopBubble(e) {
		if (e.stopPropagation) {
			e.stopPropagation();
		}
		else {
			e.cancelBubble = true;
		}
	}
	var bind = function (elem, evt, func){
		if (!elem) {
			return ;
		}

		if (elem.addEventListener) {
			bind = function (elem, evt, func) {
				elem.addEventListener(evt, func, false);
			};
		}
		else if (elem.attachEvent) {
			bind = function (elem, evt, func) {
				elem.attachEvent("on" + evt, function () {
					func.call(elem, arguments);
				});
			};
		}
		else {
			bind = function (elem, evt, func) {
				elem["on" + evt] = function () {
					func.call(elem, arguments);
				};
			};
		}
		bind(elem, evt, func);
	};
	function getEventTarget(e) {
	  e = e || window.event;
	  return e.target || e.srcElement;
	}
	// legend.html end

	// legend.calendar.date begin	
	function isNewDay(d) {
		var undef,
			isNew;
		/*if (isNewDay.id === undef) {
			isNewDay.id = 1;
		}
		else {
		    isNewDay.id++;
		}*/
		//alert('calling isNewDay, caller: ' + isNewDay.caller.name);
		//console.log('calling isNewDay, caller: ' + isNewDay.caller.name);

		if (!localStorage) {
			isNewDay = function () {
				return true;
			}
			return true;
		}

		if (isNewDay.isNew !== undef) {
			//console.log('in if ' + isNewDay.caller.name + ': ' + isNewDay.isNew);
			return isNewDay.isNew;
		}

		d = d || new Date;
		var date = (d.getMonth()+1)+''+d.getDate(), 
			newDay,
			uniqDateID = '_isNewDay_date';// + isNewDay.caller.name; // '_isNewDay_date_' + isNewDay.id;//

		//console.log(uniqDateID + ' calling isNewDay.');
		//alert(uniqDateID + ' calling isNewDay.');

		if (localStorage[uniqDateID]) {

			if (localStorage[uniqDateID] !== date) {
				//newDay = true;
				localStorage[uniqDateID] = date;
				//console.log(uniqDateID + ': true'); // isNewDay.caller.name
				isNew = true;
			}
			else {
				//newDay = false;
				//console.log(uniqDateID + ': false');
				isNew = false;
			}
		}
		else {
			//newDay = true;
			localStorage[uniqDateID] = date;
			
			//console.log(uniqDateID + ': true');
			isNew = true;
		}

		// 第二次和第二次之后的每次调用都返回第一次的结果
		isNewDay.isNew = isNew;
		
		return isNew;
	}

	function formatDate(date, seperator) {

		return [date.getFullYear(), addZero(date.getMonth() + 1), 
			addZero(date.getDate())].join(seperator);
	}
	// legend.calendar.date end

	// legend.number begin
	function addZero(i) {
		return i < 10 ? '0' + i : i.toString();
	}
	// 126 -> 02:06
	function formatTime(s) {
	   return addZero(s / 60 | 0) + ':' + addZero(s % 60);
	}
	// 13245 -> 1万3245  19850083 -> "1985万8"
	// 1985.0083000000002 1985 8
	// 19850083 * 0.0001 = 1985.0083000000002
	// 19850083 / 10000 = 1985.0083
	function formatAmount(n) {
		if (n < 10000) {
			return n;
		}
		var w1 = n * 0.0001, 
			w2 = w1 | 0, 
			q = (w1 - w2) * 10000 | 0;
		//console.log(w1, w2, q);
		return w2 + '万' + q;
	}
	// legend.number end

	//legend.pic begin - 2014/11/12 13:52
	function errReplace(pic, i) {
		_errReplaceSrc(pic, 'images/nopic/' + (i || 1) + '.jpg');
	}
	function _errReplaceSrc(pic, src) {
		pic.onerror = null;
		pic.src = src;
	}
	function errHide(that) {

		//console.log('img error: ', that.alt || that.title);

		that.style.display = 'none'; // p.img
		that.onerror = null;
	}
	//legend.pic end

	// common.js end
}(window, window.document));

