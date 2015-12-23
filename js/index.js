/*
 * 2014/1/20
 * legend80s-bupt
 * 整顿var，改成单var形式
 * 闭包保卫全局作用域不被tainted
 */

;(function (win, doc, $) {
	var storage = win.legend.storage,
			id = win.legend.html.id,
			errHide = win.legend.pic.errHide,

			localStorage = win.localStorage,
			isNewDay = win.legend.calendar.date.isNewDay,
			SITE_URL = location.href;

	var BAIDU_PAN_SUFFIX = ' site:pan.baidu.com',
		W3SCHOOL_SUFFIX = ' site:w3school.com.cn',
		BAIDU_PAN = 0,
		W3SCHOOL = 1,

		/*BAIDU_ADDRESS = 'http://www.baidu.com/s',
		BAIDU_NAME = 'word',

		GOOGLE_ADDRESS = 'http://www.google.com/search',
		GOOGLE_NAME = 'q',

		YOUDAO_ADDRESS = 'http://dict.youdao.com/search',
		YOUDAO_NAME = 'q',

		// 发现新的搜索地址：http://www.soku.com/v?keyword=tara 2014/12/20 12:53
		YOUKU_ADDRESS = 'http://www.soku.com/search_video',
		YOUKU_NAME = 'q',

		SOHU_ADDRESS = 'http://so.tv.sohu.com/mts',
		SOHU_NAME = 'wd',

		W3_ADDRESS = GOOGLE_ADDRESS,
		W3_NAME = GOOGLE_NAME,

		BUPT_ADDRESS = 'http://211.68.68.211/opac_two/search2/searchout.jsp?srctop=top2&suchen_match=qx&recordtype=all&suchen_type=1&snumber_type=Y&search_no_type=Y&library_id=all&show_type=wenzi&client_id=web_search',
		IQIYI_ADDRESS = 'http://so.iqiyi.com/so/q_',
		*/
		google = {
			url: 'https://www.google.com.hk/search',
			name: 'q'
		},

		searches = {
			baidu: {
				url: 'http://www.baidu.com/s',
				name: 'word'
			},
			google: google,
			youdao: {
				url: 'http://dict.youdao.com/search',
				name: 'q'
			},
			youku: {
				url: 'http://www.soku.com/v',
				name: 'keyword'
			},
			sohu: {
				url: 'http://so.tv.sohu.com/mts',
				name: 'wd'
			},
			buptBt: {
				url: 'http://bt.byr.cn/torrents.php',
				name: 'search'
			},
			baiduPan: google,
			w3school: google,
			iqiyi: {
				url: 'http://so.iqiyi.com/so/q_'
			},
			buptLib: {
				url: 'http://211.68.68.211/opac_two/search2/searchout.jsp?srctop=top2&suchen_match=qx&recordtype=all&suchen_type=1&snumber_type=Y&search_no_type=Y&library_id=all&show_type=wenzi&client_id=web_search'
			}
		},

		DEFAULT_WORDS = 'Enter a term...',
		gTimerID = null,

		searchForm = doc.forms['search-form'],
		formElements = searchForm.elements,
		searchInput = formElements['real-search-kw'],
		displayInput = formElements['display-search-kw'],
		youdaoLangParam = formElements['youdao-params'];

	function setBackground(src) {
		document.body.style.backgroundImage = 'url(' + src + ')';
		//id('bgimg').src = src;
	}

	var changeBackground = (function () {
		var imgs = [
			'qq-boat.jpg', 'yellow1.jpg', 'determination.jpg', 'kor1.jpg',
			'chocolate1.jpg', 'swan2.jpg', 'qq2.jpg', 'qq-balloon.jpg','qq-egg.jpg',
			'pool.jpg', 'qq-1.jpg', 'qq-3.jpg', 'qq-4.jpg', 'qq-5.jpg', 'qq-6.jpg',
			'qq-7.jpg', 'daddy-huangLei.jpg', 'CrayonPop.jpg',
			'cartoonGirl.jpg', 'aurora.jpg',
			'shore.jpg', 'blue-starring.jpg', 'mountain-water.jpg', 'NGM-mountain-water.jpg',
			// 游戏壁纸
			'game/tropico-1.jpg', 'game/tropico-2.jpg'
		], // background/game/the-light-of-darkness-03.jpg
		imgCount = imgs.length,
		//bodyStyle = doc.body.style,
		day = new Date().getDate();

		function varyBackgroundImageByDay() {
			setBackground('images/background/' + imgs[day % imgCount]);
		}

		function varyBackgroundImageByRandom() {
			setBackground('images/background/' + imgs[(Math.random()*imgCount)|0]);
		}

		function isSetToFestival() {
		    //return bodyStyle.backgroundImage.indexOf('festivals') !== -1;
			//return id('bgimg').src.indexOf('festivals') !== -1;
			return false;
		}

		return function (byDay) {
			// 节日维持固定背景图片
			if (isSetToFestival()) {
				return ;
			}
			byDay? varyBackgroundImageByDay(): varyBackgroundImageByRandom();
		};
	}());

	var sniff = (function () {
		var urls = {
				'news': {
					url:'http://news.baidu.com/ns',
					word : '?ie=utf-8&word=',
					name : 'word'
				},
				'www': {
					url : 'http://www.baidu.com/s',
					word : '?ie=utf-8&wd=',
					name : 'wd'
				},
				'tieba': {
					url : 'http://tieba.baidu.com/f',
					word : '?ie=utf-8&kw=',
					name : 'kw'
				},
				'zhidao': {
					url : 'http://zhidao.baidu.com/search',
					word : '?ie=utf-8&word=',
					name : 'word'
				},
				'music': {
					url : 'http://music.baidu.com/search',
					word : '?ie=utf-8&key=',
					name : 'key'
				},
				'image': {
					url : 'http://image.baidu.com/i',
					word : '?ie=utf-8&word=',
					name : 'word'
				},
				'video': {
					url : 'http://video.baidu.com/v',
					word : '?ie=utf-8&word=',
					name : 'word'
				},
				'map': {
					url : 'http://map.baidu.com/',
					word : '?newmap=1&ie=utf-8&s=s%26wd%3D',
					name : 'wd'
				}/*,  // belowers not listed in 我的网站导航
				'baike': {
					url: 'http://baike.baidu.com/search',
					word : '/word?enc=utf8&word=',
					name : 'word'
				},
				'wenku': {
					url : 'http://wenku.baidu.com/search',
					word : '?ie=utf-8&word=',
					name : 'word'
				}*/
			},
			reg1 = /^http:\/\/([^.]+)\./,
			encURIComp = win.encodeURIComponent;

		return function (catalog) {
			var domain1,
				value = displayInput.value.trim(),
				href = catalog.href;

			if (value) {
				domain1 = href.match(reg1)[1];
				value = encURIComp(value);
				catalog.href = urls[domain1].url + urls[domain1].word + value;
			}
			else { // http://www.baidu.com/s?ie=utf-8&wd=currency -> http://www.baidu.com/
			    catalog.href = href.slice(0, href.lastIndexOf('/') + 1);
			}
		};
	}());

	function recordPageViewedTimes() {
		var pageViewed = storage('site-tab-js_pv');
		// 840  - 2014/12/08 20:34
		// 1273 - 2015/01/03 18:11
		// 1566 - 2015/2/7 19:28

		if (pageViewed !== void 0) {
			storage('site-tab-js_pv', Number(pageViewed) + 1);
		}
		else {
			storage('site-tab-js_pv', 0);
		}
	}

	// 仿照北邮搜索
	function toBuptLibSearch(searchWord) {
		searchWord = encodeURI(searchWord);
		win.open(searches.buptLib.url + '&suchen_word=' + searchWord);
	}
	// 爱奇艺搜索 http://so.iqiyi.com/so/q_%E7%88%B8%E7%88%B8
	// 特殊情况
	function toIqiyiSearch(searchWord) {
		searchWord = encodeURI(searchWord);
		win.open(searches.iqiyi.url + searchWord);
	}

		// 为有道定制：不是日语、韩语、英语三者之一，返回英语eng
	var whichLanguage = (function () {
		var langs = ['jap', 'ko'/*, '中文'*/,'eng'], // 法语 fr
			regs = [
				{'jap': /[\u0800-\u4e00]/},
				{'ko': /[\u3130-\u318F\uAC00-\uD7A3]/},
				/* {'中文': /[\u4e00-\u9fa5]/}, // 简体中文+繁体 */ // [u4E00-u9FFF]
				{'eng': /[0-9a-zA-Z]/}
			];

		return function (text) {
			if (text == void 0) {
				throw new SyntaxError('error in whichLanguage, argument is undefined');
			}

			var i = 0,
				lang;

			while ( (lang = langs[i]) && !regs[i][lang].test(text) ) {
				++i;
			}

			return lang || 'eng';
		};
	}());
	// displayInput 输入"世界 日语" 返回 jap
	function getYoudaoLangParam(text) {
	    switch (text.slice(-2)) {
			case '日语':
				return 'jap';
				break;
			case '韩语':
				return 'ko';
				break;
			case '法语':
				return 'fr';
				break;
			default:
				return whichLanguage(text);
	    }
	}
	// 输入"世界 日语" 输出 "世界"
	// 输入"世界日语" 输出 "世界"
	// 输入"日语" 输出 "日语"
	var slimInput = (function () {
		var langReg = /([^\s])\s*(韩语|日语|法语)$/;

		return function (text) {
			return text.replace(langReg, '$1');
		};
	}());

	// 根据搜索引擎调整参数
	function adjustHost(host) {
		var srchName,
			srchAddress,
			inputValue = displayInput.value.trim();

		youdaoLangParam.disabled = true;

		switch (host) {
			case 'youdao': // 有道翻译 - 英语
				youdaoLangParam.disabled = false;
				youdaoLangParam.value = getYoudaoLangParam(inputValue);
				inputValue = slimInput(inputValue);
				break;
			case 'buptLib': // 北邮图书馆搜索
				inputValue && toBuptLibSearch(inputValue);
				return false;
			case 'iqiyi': // 爱奇艺
				inputValue && toIqiyiSearch(inputValue);
				return false;
			//default: // 默认 百度搜索
		}

		searchInput.value = cleanInputValue(inputValue, host);
		searchInput.name = searches[host].name; // srchName;
		searchForm.action = searches[host].url; // srchAddress;

		return true;
	}

	// 北邮 -> 北邮 site:pan.baidu.com
	function cleanInputValue(keywords, host) {
		switch (host) {
			case 'baiduPan': // 百度网盘搜索 添加 ' site:pan.baidu.com'
				keywords = trimKey(keywords, W3SCHOOL);
				keywords = AddOneSuffix(keywords, BAIDU_PAN);
			break;

			case 'w3school': // 百度网盘搜索 添加 ' site:pan.baidu.com'
				keywords = trimKey(keywords, BAIDU_PAN);
				keywords = AddOneSuffix(keywords, W3SCHOOL);
			break;

			case 'baidu': // 百度搜索
			case 'google': // 谷歌搜索
			case 'youdao':  // 有道翻译
			case 'youku': // 优酷
			case 'sohu': // 土豆 去除 ' site:pan.baidu.com'
			case 'buptLib': // 北邮图书馆
			case 'iqiyi': // 爱奇艺
				keywords = trimSuffix(keywords); // fall through
			default:
		}
		return keywords;
	}

	function trimSuffix(keywords) {
		var srcTemp = '';
		srcTemp = trimKey(keywords, BAIDU_PAN);
		return trimKey(srcTemp, W3SCHOOL);
	}

	function trimKey(keywords, searchSite) {
		var suffixToTrim = '';
		switch (searchSite) {
			case BAIDU_PAN:
				suffixToTrim = BAIDU_PAN_SUFFIX;
				break;
			case W3SCHOOL:
				suffixToTrim = W3SCHOOL_SUFFIX;
				break;
			default:
				alert('Error in trimKey(searchSite)');
		}

		var index = keywords.indexOf(suffixToTrim);
		if (index == -1) {
			return keywords;
		}
		return keywords.substring(0, index);
	}

	function AddOneSuffix(src, direction) {
		if (!src) {
			return '';
		}
		var suffix = '';
		switch (direction) {
			case BAIDU_PAN :
				suffix = BAIDU_PAN_SUFFIX;
				break;
			case W3SCHOOL :
				suffix = W3SCHOOL_SUFFIX;
				break;
			default:
				/*console.warn('Error in AddOneSuffix, src should be BAIDU_PAN or W3SCHOOL');*/
		}

		if (src.indexOf(suffix) === -1) {
			return src += suffix;
		}

		return src;
	}

	var getSearchHost = (function () {
		var searches = formElements['search-select'],
			options = searches.options;

	    return function () {
			/*var selectedOpt = options[searches.selectedIndex];
	        return {
				value: selectedOpt.value,
				text: selectedOpt.test
			};*/
			return options[searches.selectedIndex].value;
	    };
	}());
	// select
	function optionSbmtTo() {
		var canBeSubmitted = adjustHost(getSearchHost());
		canBeSubmitted && searchForm.submit();
		return canBeSubmitted;
	}

	function getUrlFilename(url) {
	    return url.slice(url.lastIndexOf('/') + 1);
	}

	function isNineAm(now) {
	  return now.getHours() === 9;
	}
	function reloadPage() {
	  window.history.go(0);
	}


	;(function init() {
		//changeBackground(true);
		/*id('bgimg').onerror = function () {
		    errHide(this);
		};*/

		recordPageViewedTimes();
		// reload at every 9:00 AM only once
		var now = new Date();
		if (isNewDay(now)) {
			win.setInterval(function reload() {
			  if (isNineAm(now)) {
			  	alert('new day at 9 AM, reload the page');
			  	reloadPage();
			  }
			}, 10 * 60);
		}

		// 标题栏点击进入相关主题搜索
		$('.titles').on('mouseover', 'a', function () {
		    sniff(this);
		});
		$('.bg').on('click', function () {
		    changeBackground(false);
		});

		$('#searchSelect').on('change', function () {
			adjustHost(getSearchHost());
		});

		$(displayInput).on({
			'mouseover': function () {
				this.focus();
			},
			'focus': function () {
			  this.select();
			},
			'keydown': function (e) {
		    if(e.keyCode === 13) {
		    	e.preventDefault();
					if (displayInput.value === '') {
						return false;
					}
					return optionSbmtTo();
				}
			},
			'change': function () {
			    if (getSearchHost() === 'youdao') {
					youdaoLangParam.value = getYoudaoLangParam(displayInput.value);
			    }
			}
		});

		// scroll-top.js begin
		var $scrollItems = $('#scroll-items');
		$(win).scroll(function () {
			if ($(this).scrollTop() >= 200) {
				$scrollItems.show(); // fadeIn
			}
			else {
				$scrollItems.hide(); // fadeOut
			}
		});
		$('#toTop').click(function () {
			$('body').animate({'scroll-top': '0'}, 300);
		});
		// scroll-top.js end

		// [optionSbmtTo, getSearchHost] pulic to sugar.js
		// [changeBackground, setBackground]  pulic to calendar.js
		var siteTab = siteTab || {};
		siteTab.submit = optionSbmtTo;
		siteTab.getSearchHost = getSearchHost;
		siteTab.changeBackground = changeBackground;
		siteTab.setBackground = setBackground;

		win.legend.siteTab = siteTab;

		// 确保localStorage不被其他页面篡改, ['onlineToDoApp.html']
		//disableOtherPageStorage(true);
		//disableEditExistingKeys(['websites_tab.html', 'websites_140220.html', 'test-drawer.html', 'imageViewer.html']);
	}());

}(window, document, jQuery));
