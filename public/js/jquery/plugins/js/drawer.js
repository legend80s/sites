/*
 * drawer.js
 * 2014/12/25 2015/1/5 2015/1/7
 * 2015/1/8 增加可增加条目
 * legend80s-bupt
 * jquery插件
 */

;(function ($, doc, win) {

	var gPluginUtil = win.legend.jquery.pluginUtil,
		gItems,
		gHasAdded,
		gUndef,
		gAddCommand,
		localStorage = win.localStorage,
		JSON = win.JSON;

    $.fn.drawer = function drawer(opt) {
		// 载入drawer.css 获取用户新增的条目
		/*if (drawer.first === gUndef) {
			gPluginUtil.insertCSS('file:///D:/Code_140211/html_140211/Sites/js/jquery/plugins/css/drawer.css');
			drawer.first = false;
		}*/

		var settings = $.extend({}, $.fn.drawer.defaults, opt),
			links = settings.links,
			len = links.length,
			addable = settings.addable,
			icon = settings.icon;

		if (!addable && len === 0) {
			return ;
		}
		
		// 填充 ul 的 li
		var i,
			link,
			lis = '';

		for (i = 0; i < len; ++i) {
			link = links[i];
			lis += '<li><a target="_blank" href="'+ link.href +'">' + link.name + '</a></li>';
		} // data-i="'+i+'" 

		if (addable) {

			if (gItems === gUndef) {
				gItems = getItems();
				
				gAddCommand = '<li class="jquery-drawer-add"><input type="text" style="display: none;" placeholder="名称 网址" title="&quot;名称 网址&quot;空格间开 Enter确定 ESC取消"></li>';

				//alert('i can alert only once');

				//console.log('gAddCommand:', gAddCommand);

			}
			
			$(window).on('beforeunload', function () {
				saveItems();
			})
		}
		
		// 循环处理选中项
		var onclick = settings.onclick,
			major = ( drawer.id !== gUndef? ++drawer.id: (drawer.id = 0) ) + '-';

		this.each(function (i, v) {
			_drawer(major + i, $(v), links, lis, onclick, addable);
		});

		// 设置背景图案
		if (addable && icon) {
			$('.jquery-drawer-add').css('background-image', 'url(' + icon + ')');
		}
		
		return this; // 保持级联

	};

	// main body: function _drawer
	function _drawer(i, $this, links, lis, onclick, addable) {
		
		// 填充html
		var cls = 'jquery-drawer-201412252127', // cls和drawer.css的cls保持一致
			id = 'jquery-drawer-' + i;
		
		//gItems && console.log('id: ' + id + '\n' + 'gItems[id]: ' + gItems[id]);
		if (addable) {
			 gItems[id] && (lis += gItems[id]);
			 
			 lis += gAddCommand;
		}


		var html = '<ul id="' + id + '" class="' + cls + '" style="display: none;">' + lis + '</ul>';

		$this[0].innerHTML += html;

		// 监听事件
		var ul = doc.getElementById(id),
			index,
			anchor = '#' + id + ' a';
		
		onclick && $this.on('click', anchor, function () {
			//index = this.getAttribute('data-i');
			index = $(this).parent().index();
			console.log(index);
			onclick(index, links[index].name);
		});

		$this.hover(
			function () {
				show(ul);
			},
			function () {
				hide(ul);
			}
		);

		if (addable) {
			$this.on('click', '.jquery-drawer-add', function () {
			    $(this).find('input').show().focus();
			});

			$this.find('.jquery-drawer-add input').on({
				keydown: function (e) {
					if (e.which === 13) { // Enter
						//console.log('add an item');
						var item = this.value.split(' '),
							name = item[0],
							href = item[1],
							duplicate = lis.indexOf('>'+name+'<') !== -1;

						item.length === 2 && addItemBefore($(this).parent(), name, href, id, duplicate);
					}
					if (e.which === 27) { //ESC
						//console.log('do nothing and quit');
						hide(this);
					}
				}
			});

		}
	}

	function hide(element) {
		element.style.display = 'none';
	}
	function show(element) {
		element.style.display = 'block'; 
	}
	
	function addItemBefore($node, name, href, id, duplicate) {
		var newItem,
			oldItems = gItems[id] || '',
			duplicate2 = duplicate || oldItems.indexOf('>'+name+'<') !== -1;
				
		if (name && href && !duplicate2) {
			var newItem = '<li><a target="_blank" href="'+ href +'">'+ name +'</a></li>';
			$node.before(newItem);

			gItems[id] = oldItems + newItem;

			gHasAdded = true;
		}
		else { // 修改 TODO
		    console.log('1网址名称和链接不能为空 2必须以一个空格隔开 3不能重复添加');
		}
	}
	function saveItems() {
	    gHasAdded && (localStorage.jquery_drawer_adds = JSON.stringify(gItems));
	}
	function getItems() {
		var adds = localStorage.jquery_drawer_adds;
	    return adds === gUndef? {}: JSON.parse(adds);
	}

	var drawer = $.fn.drawer;

	drawer.defaults = {
		/*'links': [{name: '', href: ''}],
		onclick: function () {
		    
		},*/
		addable: false/*,
		icon: '../images/add_24.png'*/
	};

	drawer.help = drawer.toString = function () {
	    gPluginUtil.help({
			author: 'legend80s-bupt',
			date: '2015/1/6 农历十一月十六',
			name: 'drawer',
			brief: '鼠标停留显示更多链接',
			defaults: drawer.defaults
		});
	};

}(jQuery, document, window));