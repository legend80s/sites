/*
 * setNumber.js
 * jquery插件 - 2014/11/13 19:11
 */

;(function ($, parseInt) {
    $.fn.setNumber = function (opt) {

		this.each(function (i, v) {
			setNumber($(v), opt);
		});
		
		function setNumber($this, opt) {
			var $box = $this,
				box = $box[0],
				// unique class name
				boxCls ='jquery-set-number-' + (new Date()).getTime(), 
				form,
				number,
				newNumber,
			
				settings = $.extend({}, $.fn.setNumber.defaults, opt),
				onchange = settings.onchange,

				style = '<style>.'+boxCls+'>label{cursor: pointer;} .'+boxCls+' form{display: inline;} .'+boxCls+' input[type="submit"]{cursor:pointer;}</style>',

				html;
			
			function hide(element) {
				element.style.display = 'none';
			}
			function show(element) {
				element.style.display = ''; 
			}

			// 1 填充 css 和 html
			//inputHtml = '<input type="number" id="'+boxCls+'-count" min="'+settings.min+'" max="'+settings.max+'" value="'+settings.current+'" />';
			var inputHtml,
				min = settings.min,
				max = settings.max,
				cur = settings.current,
				i;

			inputHtml = '<select id="'+boxCls+'-count">';
			for (i = min; i <= max; ++i) {
			    if (i !== cur) {
					inputHtml += '<option value="'+i+'">'+i+'</option>';
			    }
				else {
				    inputHtml += '<option value="'+cur+'" selected="selected">'+cur+'</option>';
				}
			}
			inputHtml += '</select>';

			html = '<label for="'+boxCls+'-count">'+settings.text1+'<span>'+settings.current+'</span><form>'+inputHtml+'<input type="submit" value="'+settings.text2+'" /></form></label>';

			$box.addClass(boxCls);
			box.innerHTML += style + html;
			
			// 2 注册事件
			form = $box.find('form')[0];
			number = $box.find('span')[0];
			newNumber = $('#'+boxCls+'-count')[0];

			hide(form);

			$box.children('label')[0].onclick = function () {
				hide(number);
				show(form);
			};

			form.onsubmit = function (e) {
				show(number);
				hide(form);

				onchange(number.textContent = parseInt(newNumber.value));

				//e.preventDefault();
				return false;
			};
		}
    },
	$setNumber = $.fn.setNumber;

	$setNumber.defaults = {
		min: 1,
		max: 20,
		current: 4,
		text1: '设置数字为: ', // 提示按钮文字
		text2: '确定', // 提交按钮文字
		onchange: function (number) { // 提交回调函数
		    console.log('设置为：' + number);
		}
	};
	// 上面6个参数可以被覆盖，toString用来说明defaults，请勿覆盖
	/*function walk($defaults) {
		var str = '',
			k,
			hasOwn = Object.prototype.hasOwnProperty;

		for (k in $defaults) {
			if (hasOwn.call($defaults, k) && k !== 'toString') {
				str += k + ': ' + $defaults[k] + '\n';
			}
		}

		return str;
	}*/

	$setNumber.defaults.toString = function () {
	    //return walk(this);
		var str = '',
			k,
			hasOwn = Object.prototype.hasOwnProperty;

		for (k in this) {
			if (hasOwn.call(this, k) && k !== 'toString') {
				str += k + ': ' + this[k] + '\n';
			}
		}

		return str;
		//return "min: 1,\nmax: 20,\ncurrent: 4,\ntext1: '设置数字为: ', /* 提示按钮文字 */ \ntext2: '确定', /* 提交按钮文字 */ \nonchange: function (number) { /* 提交回调函数 */ \n\tconsole.log('设置为：' + number);\n}";
	};

	function log(message) {
	    if (console && console.log) {
			console.log.apply(console, arguments);
	    }
		else {
		    alert(message);
		}
	}

	$setNumber.author = 'legend80s-bupt';
	$setNumber.date = '2014/11/13 农历(闰)九月廿一';
	$setNumber.help = $setNumber.toString = function () {
	    log('jquery插件 - setNumber: 设置数字（采用HTML5的type="range"的input元素）,默认设置是：\n' + $setNumber.defaults.toString() + '\n%c- by ' + $setNumber.author + ' ' + $setNumber.date, 'color:red;');
	};

}(jQuery, window.parseInt));