// 2014-8-31
// pageView.js
// 按页码查看
// 用法：
// 1 添加插件相应的css文件 pageView.css
// 2 按顺序添加 jquery.js 和 pageView.js
// 3 调用插件
// $page.pageView({
//  'start': 1,
//	'current': '1', // 默认选中页
//	'count': '4',  // 总页数
//  'onchange': getDataByPage // 页数变化调用函数
// });

;(function ($, win) {
	// sniff for mobile
	var gTouchable = true;
	if (!('ontouchstart' in document.documentElement)) {
		$('html').addClass('no-touch');
		gTouchable = false;
	}
	/*else {
	    $('html').addClass('touch');
	}*/

    $.fn.pageView = function pageView(options) {

		var $page = this/*.hide()*/; // 加载页码的父容器

		// 载入pageView.css - 太抖了，加入hide和show
		/*if (typeof pageView.first === 'undefined') {
			win.legend.jquery.pluginUtil.insertCSS('js/jquery/plugins/css/pageView.css');
			pageView.first = false;
		}*/

		var settings = $.extend({}, $.fn.pageView.defaults, options);
		// 整体框架搭好了，设计具体逻辑

		var onchange = settings.onchange,
			start = +settings.start,
			count = +settings.count,
			lastPage,
			curPage = +settings.current,
			callback = settings.callback;

		// 1 限制范围
		// 限制 count lastPage >= 1 
		count < 1 && (count = 1);
		lastPage = count;
		// 限制 start 在 1 和 lastPage 之间
		!(1 <= start && start <= lastPage) && (start = 1);
		// 限制 curPage 在 start 和 lastPage 之间
		!(start <= curPage && curPage <= lastPage) && (curPage = 1);
		
		// 2 插入页码 html
		var pageHtml = ['<ul class="page"><li class="page-num interactive prev">上一页</li>'];
		// 拼接页码
		for (var i = 1; i <= count; ++i) { 
			pageHtml[i] = '<li class="page-num interactive num" data-num="'+i+'">'+i+'</li>';
		}
		pageHtml.push('<li class="page-num interactive next">下一页</li></ul>');
		$page[0].innerHTML = pageHtml.join('');

		// 以及插入css和html，节点已经ready
		//$page.show();
		callback && callback();
		var $nums = $page.find('.num');

		// $prev和$next，一定要放在插入页码 html后面
		var $prev = $('.prev'),
			$next = $('.next');

		// 3 高亮当前页码 
		var $cur = hilight($($nums[curPage-1]));

		// 4 使上一页和下一页无效
		(curPage === start) && disable($prev);
		(curPage === lastPage)  && disable($next);
		
		// 5 点击
		if (gTouchable) {
			// 5.1 点击上一页
			$page.on('touchstart', '.prev.interactive', function () {
			    hilight($(this));
			});
			$page.on('touchend', '.prev', function (e) {
			    dim($(this));
				prev(e);
			});

			// 5.2 点击下一页
			$page.on('touchstart', '.next.interactive', function (e) {
				hilight($(this));			    
			});
			$page.on('touchend', '.next', function (e) {
				dim($(this));
				next(e);
			});

			// 5.3 点击页码
			$page.on('touchstart', '.num', changeTo);
		}
		else {
			$page.on('click', '.prev', prev);
		    $page.on('click', '.next', next);
			$page.on('click', '.num', changeTo);
		}
		
		
		function prev(e) {
			// 当前页等于第一页，点击【上一页】不起作用
			if (curPage === start) {
				return ;
			}
			// 当前页是第二页，点击【上一页】后，【上一页】失效
			if (curPage - 1 === start) {
				disable($prev);
			}
			// 当前页是最后一页，使得由于最后一页变成失效状态的【下一页】按钮变成生效
			if (curPage === lastPage) {
				able($next);
			}
			
			// 不高亮之前页
			dim($($nums[curPage-1]));

			// 更新并高亮当前页
			hilight($cur = $($nums[--curPage-1])); 

			// 获取新页码数据
			onchange(curPage, e.target);
		}

		function next(e) {
			// 当前页等于最后一页，点击【下一页】不起作用
			if (curPage === lastPage) {
				return ;
			}
			// 当前页是最后一页的上一页，点击之后，【下一页】变为无效
			if (curPage + 1 === lastPage) {
				disable($next);
			}
			// 当前页等于第一页，将由于第一页失效的【上一页】按钮变为生效状态
			if (curPage === start) {
				able($prev);
			}
			
			// 不高亮之前页
			dim($($nums[curPage-1]));
			// 高亮并更新当前页
			hilight($cur = $($nums[curPage++]));
			
			// 获取新页码数据
			onchange(curPage, e.target);
		}
		
		function changeTo(e) {
			// 点击同一页码，直接返回
			var num = Number(this.getAttribute('data-num'));
			if (num === curPage) {
				return ;
			}

			// 更新并获取新页码数据
			onchange(curPage = num, e.target);

			// 不高亮前一页
			dim($cur);

			// 更新并高亮当前页
			hilight($cur = $(this));

			// 如果当前页等于第一页，【前一页】按钮失效；否则生效
			curPage === start? disable($prev): able($prev);
			// 如过当前页等于最后页，【后一页】按钮失效；否则生效
			curPage === lastPage? disable($next): able($next);
		}
		
		return this; // 保持链式不中断
	};
	
	/*
	$.fn.pageView.setCurrent = function (page, $cur, ) {
	    // 3 高亮当前页码 
		var $cur = hilight($('[data-num='+page+']'));

		// 4 使上一页和下一页无效
		(page === start) && disable($prev);
		(page === lastPage) && disable($next);
	};*/

	$.fn.pageView.defaults = {
		current: 1,
		start: 1,
		count: 4,
		onchange: function (page) {
		    console.log('从第' + page + '页获取数据');
		}/*,
		callback: function () {
		    console.log('page view load suuccessfully');
		}*/
	};

	// 扩展 4 个函数，处理jQuery节点
	function hilight($node) { // 高亮
		return $node.addClass('cur-page');
	}
	function dim($node) { // 不高亮
		return $node.removeClass('cur-page');
	}
	function disable($node) { // 使得上一页或下一页无效
		//return $node.addClass('disabled-btn');
		return $node.removeClass('interactive');
	}
	function able($node) { // 使得上一页或下一页有效
		//return $node.removeClass('disabled-btn');
		return $node.addClass('interactive');
	}

})(jQuery, window);