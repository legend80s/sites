/*
 * setNumber.js
 * 2014/11/14
 * legend80s-bupt
 * jquery插件 - 设置数字、页码等
 */

;(function ($, win, doc) {

	var parseInt = win.parseInt,
		pluginUtil = win.legend.jquery.pluginUtil;

    $.fn.setNumber = function setNumber(opt) {

		// 载入 setNumber.css
		/*if (typeof setNumber.first === 'undefined') {
			pluginUtil.insertCSS('file:///D:/Code_140211/html_140211/Sites/js/jquery/plugins/css/setNumber.css');
			setNumber.first = false;
		}*/

		var $selectors = this;

		$selectors.each(function (i, v) {
			setNumber($(v), opt);
		});

		return $selectors; // 保持级联
		
		// functoion body
		function setNumber($this, opt) {
			var $box = $this,
				box = $box[0],
				// unique class name
				boxCls ='jquery-set-number-201411141328', 
				form,
				number,
				numberInput,
				oldNumber,
			
				settings = $.extend({}, $.fn.setNumber.defaults, opt),
				onchange = settings.onchange,

				html = '<label for="'+boxCls+'-count">'+settings.text1+'<span>'+settings.current+'</span></label><form><input type="number" id="'+boxCls+'-count" min="'+settings.min+'" max="'+settings.max+'" value="'+settings.current+'" /><input type="submit" value="'+settings.text2+'" /></form>';

			// 1 填充 html
			$box.addClass(boxCls);
			box.innerHTML += html;
			
			// 2 注册事件
			form = $box.find('form')[0];
			number = $box.find('span')[0];
			numberInput = $('#'+boxCls+'-count')[0];
			oldNumber = parseInt(numberInput.value);

			hide(form);

			$box.children('label')[0].onclick = function () {
				hide(number);
				show(form);
			};

			form.onsubmit = function (e) {
				show(number);
				hide(form);
				
				// oldNumber 防止input输入为空
				oldNumber = parseInt(numberInput.value) || oldNumber;
				onchange(number.textContent = oldNumber);

				//e.preventDefault();
				return false;
			};
		}
    };

	function hide(element) {
		element.style.display = 'none';
	}
	function show(element) {
		element.style.display = ''; 
	}

	var setNumber = $.fn.setNumber;

	setNumber.defaults = {
		min: 1,
		max: 20,
		current: 4,
		text1: '设置数字为: ', // 提示按钮文字
		text2: '确定', // 提交按钮文字
		onchange: function (number) { // 提交回调函数
		    console.log('设置为：' + number);
		}
	};
	
	setNumber.help = setNumber.toString = function () {
	    pluginUtil.help({
			author: 'legend80s-bupt',
			date: '2014/11/13 农历(闰)九月廿一',
			name: 'setNumber',
			brief: '设置数字、页码等',
			defaults: setNumber.defaults
		});
	};

}(jQuery, window, document));