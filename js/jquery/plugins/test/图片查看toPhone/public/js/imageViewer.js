/*/
 * imageViewer.js
 * 2014/8/30 19:54
 * imageViewer.html配套 js 文件，手动插入
/*/

;(function ($, win) {
	/*function ImageViewer(initialPage, initialStart) {
	    
	}*/


	var setTimeout = win.setTimeout,
		clearTimeout = win.clearTimeout,
		max = win.Math.max,
		JSON = win.JSON,

		storedInfo = JSON.parse(storage('imageViewer_info') || '{}'),
		initialPage = 1,
		initialStart = 26179,

		curPage = storedInfo.page || initialPage,
		number = 8,
		start = calculateStart(curPage), //initialStart + (curPage - 1) * number, // 0
		stop = start + number, // curPage * number,
		timer = 0,
		hoverTimeInMS = 600,
		$target,
		
		//viewedMax = storedInfo.max || stop - 1,
		viewedPages = storedInfo.viewedPages || [curPage],
		$pageBox = $('.page-box'),
		$nums,
		hasClearedHistory = false,
		$historyClearer = $('.clear-viwed-history'),
		historyClearerClasses = $historyClearer[0].classList,
		pageBoxInterfaces,
		add = false;

	// angular begin
	// angular处理html
	function lgGalleryController($scope) {
		$scope.range = makeRange(start, stop);
		$scope.loadImages = function (page) {
			start = calculateStart(page);
			stop = start + number;
			$scope.range = makeRange(start, stop);
			//console.log('load image of page #' + page + ' from ' + start + ' to ' + (stop - 1));
		};
	}

	function lgPagerDirective() {
	    return {
			restrict: 'A',
			link: function ($scope, elem, attrs) {
			    pageBoxInterfaces = $(elem).pager({
					count: 8, 
					current: curPage,
					storable: true,
					onchange: function (page) {
						$scope.$apply(function () {
							var classes = $nums[page-1].classList;
							
							if (!classes.contains('page-read')) {
								classes.add('page-read');
								viewedPages.push(page);
							}
							
							$scope.loadImages(page);
							curPage = page;
						});
					},
					/*,
					relative: true*/
					callback: function () {
					    markPages($nums = $pageBox.find('.num'));
					}
				});
			}
		};
	}
	
	// 注册 controller 和 directive
	angular.module('Gallery', []).
		controller('lgGalleryController', ['$scope', lgGalleryController]).
		directive('lgPager', lgPagerDirective);
	// angular end
		

	// 监听事件
	if ('ontouchstart' in document.documentElement) {
		// 模拟点击“清除浏览历史记录”hover效果
		$historyClearer.on({
			touchstart: function () {
			    historyClearerClasses.add('clear-viwed-history-hover');
			},
			touchend: function () {
			    clearHistory();
				historyClearerClasses.remove('clear-viwed-history-hover');
			}
		});
		
		// li添加 touchend 事件
		$('#gallery').on({
			touchend: function () { // 只能是touchend否则无法移动
				this.classList.toggle('mobile-psudo-hover-shadow-zoom');
			}
		}, 'li');
	}
	else {
	    $historyClearer.on('click', clearHistory);

		// li添加 touchend 事件
		$('#gallery').on({
			mouseenter: function () {
				$target = $(this);

				if (timer) {
					clearTimeout(timer);
				}

				timer = setTimeout(function () {
					$target.addClass('pc-hover-shadow-zoom');
				}, hoverTimeInMS)
			},
			mouseleave: function () {
				$target = $(this);
				clearTimeout(timer);
				if ($target.hasClass('pc-hover-shadow-zoom')) {
					$target.removeClass('pc-hover-shadow-zoom');
				}
			}
		}, 'li');
	}
	
	
	// store viewedMax and page
	window.onbeforeunload = function () {
		!hasClearedHistory && storage('imageViewer_info', JSON.stringify({
			page: curPage,
			viewedPages: viewedPages
		}));
	};

	// functions
	function calculateStart(page) {
	    return initialStart + (page - 1) * number;
	}

	function markPages($pages) {
		viewedPages.forEach(function (v, i) {
			$pages[v-1].classList.add('page-read');
		});
	}
	// 简单的localStorage存取函数
	function storage(key, value) {
		var localStorage = window.localStorage;
		if (localStorage) {
			storage = function (key, value) {
			    if (typeof value === 'undefined') {
					return localStorage[key];
				}
				
				localStorage[key] = value;
				return true;
			}
			
		}
		else {
		    storage = function () {
		        return false;
		    }
		}

		return storage(key, value);
	}

	function makeRange(low, high) {
		var range = [],
			i = 0;

		while (low < high) {
			range[i++] = low++;
		}

		return range;
	}

	function clearHistory() {
		
		if (window.confirm('确定清除浏览历史记录？')) {
			$nums.removeClass('page-read');
			pageBoxInterfaces.setCurrent(initialPage);
			storage('imageViewer_info', '');
			hasClearedHistory = true;
		}
	}

}(jQuery, window));