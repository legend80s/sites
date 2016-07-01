/*
 * sugar.js
 * 2014/11/14 22:24
 * legend80s-bupt
 */
// feature 1: suggestion - 2014/6/11 16:28
// 添加 百度 suggestion 和 其他搜索 suggestion
// add http://so.tv.sohu.com/mts?box=1&wd=ff
// 添加优酷 <p class="progress">已看到第21集的95%</p>
// 添加剧集选择 #FF7800 - 橘黄色，来自腾讯视频
// 修改footer 2014/12/10 11:25

// 2016-02-23 新闻推荐
// https://www.hao123.com/sugdata_s4.json?r=-808997
//

(function () {
	var win = window,
		legend = win.legend,
		anchor = legend.html.makeAnchor,
		min = win.Math.min,

		submit = legend.siteTab.submit,
		getSearchHost = legend.siteTab.getSearchHost,

		picerr = legend.pic.err,
		loadScript = legend.html.loadScript,
		some = legend.array.some,
		encURIComp = win.encodeURIComponent,
		id = legend.html.id,

		prevInput = '' + Math.random(),
		prevFlag = 'baidu',
		input = id('display-search-kw'),
		$sugar = $('#sugar'),
		$sugarUl = $('#sugar > ul'),
		sugarUrl = '',
		sugarCache = {}, // 所有的query为空的推荐缓存至sugarCache
		MAX_SUGAR_COUNT = 10,

		sugar = {
			'baidu': makeBaiduSuggestionUrl, // 百度搜索 百度
			// 'baiduPan': makeBaiduSuggestionUrl, // 百度网盘 百度
			// 'buptLib': makeBaiduSuggestionUrl, // 北邮人图书馆 百度
			// 'buptBt': makeBaiduSuggestionUrl, // 北邮人BT 百度

			'google': makeGoogleSuggestionUrl, // 谷歌搜索 谷歌
			'w3school': makeGoogleSuggestionUrl, // w3school 谷歌

			'youdao':  makeYoudaoSuggestionUrl,
			'youku':  makeYoukuSuggestionUrl,
			'sohu': makeSohuSuggestionUrl,
			'iqiyi': makeIqiyiSuggestionUrl
		},

		iqiyiSugar = 'http://suggest.video.iqiyi.com/?rltnum=10&callback=legend.cb.handleIqiyiSuggestion&key=',
		iqiyiHot = 'http://search.video.qiyi.com/qiso3/?if=hotQuery&p=10&cb=gIqiyiHotQueries',
		youkuSearchUrl = 'http://www.soku.com/v?keyword=',

		googleSugar = 'https://www.google.com.hk/complete/search?client=hp&hl=zh-CN&callback=legend.cb.handleGoogleSuggestion&q=',
		baiduSugar = 'http://suggestion.baidu.com/su?ie=utf-8&json=1&p=3&cb=legend.cb.handleBaiduSuggestion&wd=',
		// &_=new Date().getTime()
		youdaoSugar = 'http://dsuggest.ydstatic.com/suggest/suggest.s?query=',
		// keyfrom=dict.suggest&
		sohuSugar = 'http://tip.tv.sohu.com/s?callback=legend.cb.handleSohuSuggestion&encode=utf-8&key=',
		cb = legend.cb = legend.cb || {}; // 所有的jsonp回调函数挂载于此

	function show($node) {
		$node.removeClass('hidden');
	    //$node.show();
		//$node.slideDown(200);
	}
	function hide($node) {
		//console.log(hide.caller.name? hide.caller.name: hide.caller);
		$node.addClass('hidden');
	    //$node.hide();
	}
	function isHidden($node) {
	    return $node[0].className.indexOf('hidden') !== -1;
	}

	function fillDetails(d) {
		if (!d) {
			return ;
		}
		var infos = d.infos;
		if (some(infos)) {
			var item = '',
				$panel = null,
				$sugLis = $sugarUl.addClass('sg-minHeight').find('li'),
				catagories = {
					'default': ['类型', '主演', '年代', '播放'],
					movie: ['类型', '主演', '年代', '播放'],
					person: ['国籍', '职业', '生日', '详情'],
					music: ['类型', '歌手', '年代', '播放'],
					show: ['类型', '主持人', '年代', '播放'],
					tvDrama: ['类型', '主演', '年代', '播放'],
					comic: ['类型', '主演', '年代', '播放']
				},
				catagory;

			$('.panel').remove();

			var i, img, titles, info, actors;
			for (i = 0; i < MAX_SUGAR_COUNT; ++i) {
				img = d.imgs;
				if (img.link[i]) {
					$panel = $('<div class="panel"></div>');

					titles = d.titles;
					info = infos[i];

					catagory = catagories[info.tag || 'movie'];

					//console.log(info.tag);
					//console.log(catagory);

					actors = info.starring? info.starring: '暂无';

					item = '<div class="item"><div class="thumb"><a href="' + img.link[i] +
						'" target="_blank" title="' + titles.title[i] + '"><img width="70" height="105" src="' + img.src[i] + '" alt="' + img.alt[i] + '"></a></div><div class="title"><a href="' + titles.link[i] +

						'" target="_blank" title="' + titles.title[i] + '">' + titles.title[i] + '</a></div>' + (info.type?'<div class="pub">'+
							catagory[0]+': ' + info.type + '</div>':'') + '<div class="actor" title="' +

						actors + '">' +catagory[1] +': ' + actors + '</div>' + '<div class="period">' +catagory[2] +': ' + (info.year?info.year:'暂无') + '</div><div class="play"><a class="btn btn_play_s" href="' + info.playUrl + '" target="_blank" title="' + info.playPrompt + '"><em>'+(info.canPlay?'播放':'详情')+'</em><i class="ico_play"></i></a></div></div>';

					// 增加剧集 begin
					var recentEpsInfo = info.update || '',
						eps = info.episodes;

					if (eps && eps.length > 1) {
						item += '<ol class="eps">'; //增加 class="eps"为了剧集 mouseover 事件

						var epsLen = eps.length,
							MAX_EPISODE = 6,
							tempLen = min(MAX_EPISODE, epsLen) - 1,
							ep;

						// 展现 4 + 1 + 1 部
						// 最新5集
						recentEpsInfo = eps[0].desc;
						for (var epsIndex = 0; epsIndex < tempLen; ++epsIndex) {
							ep = eps[epsIndex];
						    item += '<li>' + anchor({
								'title': '第'+ep.num+'集',
								'href': ep.url,
								'class': 'episode',
								'eps-info': ep.desc
								}, ep.num) + '</li>';
						}
						// 最后1集
						ep = eps[epsLen - 1];
						item += '<li>' + anchor({'title': '第'+ep.num+'集', 'href': ep.url, 'class': 'episode', 'eps-info': ep.desc}, ep.num) + '</li></ol>';

						// 第5集特殊处理
						/*if (epsLen <= 6 && epsLen) {
							specialEps = anchor(eps[epsIndex].num, eps[epsIndex].url, 'episode', eps[epsIndex].desc);
						}*/
					}
					// 增加剧集信息, 随着 mouseover 剧集而变化
					item += '<p class="eps-info">'+recentEpsInfo+'</p>';
					// 增加剧集 end

					$panel.html(item);
					// 图片容错 - 2014-11-14
					$('.thumb img').on('error', function () {
					    picerr(this, 6);
					});
					// 增加小箭头
					$sugLis.eq(i).append('<span class="arrow">></span>');
					$sugLis[i].appendChild($panel[0]);
				}
			}
		}
	}
	// 设置推荐来自哪里
	function expandFirstPicItem() {
	    $sugar.find('li').has('.panel').first().addClass('cur');
	}
	var setSugarFooter = (function () {
	    var _footerLink = id('sg-footer-link'),
			_sgHosts = {
				'baidu': ['百度搜索', 'http://www.baidu.com/'],
				'google': ['谷歌搜索', 'https://www.google.com/'],
				'w3school': ['w3school', 'http://w3school.com.cn/'],
				'youdao'  : ['有道词典', 'http://dict.youdao.com/'],
				'buptLib': ['北邮图书', 'http://lib.bupt.edu.cn/'],
				'baiduPan': ['百度云盘', 'http://pan.baidu.com/'],
				'youku': ['优酷视频', 'http://www.youku.com/'],
				'sohu': ['搜狐视频', 'http://tv.sohu.com/'],
				'iqiyi'  : ['爱奇艺', 'http://www.iqiyi.com/']
			};

		return function (host) {
			var hostInfo = _sgHosts[host];
			_footerLink.textContent = hostInfo[0];
			_footerLink.href = hostInfo[1];
		}; // var host = getSearchHost().text;
	}());
	// handle suggestion begin
	// abstract the common used part into a function
	// items: string array; query: string
	// hasInitialSuggestions: 有起始推荐
	// videoInfor: video info - youku & sohu
	function handleSuggestion(host, items, query, hasInitialSuggestions, videoInfor) {
		if (items.length === 0) {
			hide($sugar);
			return ;
		}

		var lists = '',
			item,
			i,
			itemCount = min(items.length, MAX_SUGAR_COUNT);

		for (i = 0; i < itemCount; ++i) {
			item = items[i];
			if (query && item.indexOf(query) !== -1) { // query 为空也会进入
				lists += ('<li data-item="'+ item +'">' + query + '<b>' + item.replace(query, '') + '</b></li>');
			}
			else if (hasInitialSuggestions){
				lists += ('<li data-item="'+ item +'">' + '<span class="rank top'+(i+1)+'">'+(i+1)+'</span>' + item + '</li>');
			}
			else {
				lists += ('<li data-item="'+ item +'">' + item + '</li>');
			}
		}
		$sugarUl.html(lists);
		// baidu 等没有视频信息videoInfor不需要.video，不用控制min-height
		$sugarUl.removeClass('sg-minHeight');
		//($sugar.find('li').has('.panel').length === 0) && $sugarUl.removeClass('sg-minHeight');

		fillDetails(videoInfor);

		//alert('show it');
		show($sugar);

		// 自动hover第一个有视频信息的li
		// $($test[0]) > $test.eq(0) > $test.first()
		// [0], $([0]), .eq(0), .first(), .filter(":first"), :first
		// http://jsperf.com/jquery-first-vs-first-vs-eq-0-vs-0/2
		expandFirstPicItem();

		setSugarFooter(host);
		// 优酷等视频网站query为空时保存一份至内存，不必每次都请求
		if (query === '') {
			if (typeof sugarCache[host] === 'undefined') {
				sugarCache[host] = $sugarUl[0].innerHTML;
				//console.log('query为空，为' + host + '保留一份推荐至内存');
			}
		}
	}

	cb['handleBaiduSuggestion'] = function (sg) {
		handleSuggestion('baidu', sg.s, sg.q);
	};
	cb['handleGoogleSuggestion'] = function (sg) {
		var items = [];
		var r = sg[1];
		$.each(r, function (index, value) {
		    items.push(value[0]);
		});
		handleSuggestion('google', items, sg[0]);
	};
	function getVideoDetails(imgs, titles, infos) {

	}
	cb['handleYoukuSuggestion'] = function (sg) {
		//console.log(sg);
		var items = [];
		var r = sg.r;

		// imgs and titles's link is the same
		var imgs = {'src':['','','','','','','','','',''], 'link':['','','','','','','','','',''],'alt':['','','','','','','','','','']};
		var titles = {'title':['','','','','','','','','',''], 'link':['','','','','','','','','','']};
		//var info = {'type':'', 'starring':'', 'year':'', 'playLink':''};
		var infos = [{},{},{},{},{},{},{},{},{},{}], prompt, // 有必要的话，提供初始值
			i, value, itemCount = min(r.length, MAX_SUGAR_COUNT),
			hasPic;

		for (i = 0; i < itemCount; ++i) {
			items.push(r[i].c);
			if (r[i].u) {
				hasPic = true;
				value = r[i].u[0];

				prompt = value.m === '综艺'? '播放最新一期': '播放第一集';
				imgs.src[i] = value.a;
				imgs.link[i] = youkuSearchUrl + value.j; // youku呈现的是搜索结果不是value.d
				imgs.alt[i] = prompt;
				titles.title[i] = value.j;

				infos[i].type = (value.m && (value.m+'-'+value.w)) || '';
				infos[i].starring = value.p.replace(/,/g, ' ');
				infos[i].year = value.y;
				infos[i].update = r[i].z || '';
				infos[i].canPlay = true;//(value.c == 0); // 2014/7/16 0:37 解决没有视频播放资源的情况

				// 报警系统
				console.assert(value.k, 'value.k is empty in handleYoukuSuggestion and its value is', r[i].z);

				infos[i].playUrl = value.k; //value.c == 0 ? value.k : value.d;
				infos[i].playPrompt = prompt; //value.c == 0 ? '播放第一集' : '暂无播放源';
			}
		}

		titles.link = imgs.link;

		var videoInfor = hasPic? {'imgs': imgs, 'titles': titles, 'infos': infos}: null;

		//var videoInfor = getVideoDetails();

		//console.log(videoInfor);
		var q = sg.q;
		var hasInitialSuggestions = (items.length === MAX_SUGAR_COUNT && q === '');
		handleSuggestion('youku', items, q, hasInitialSuggestions, videoInfor);
	};
	// handleYoudaoSuggestion begin
	win['aa'] = win['aa'] || {};
	win.aa.setSearchMoreParams = function (lestr) {
	    //console.log(lestr);
		// 防止报错
	};
	/*win['handleYoudaoSuggestion'] = */win.aa.updateCall = function (sg) {
		var items = [];
		$(unescape(sg)).find('.remindtt75').each(function () {
		    items.push($(this).text());
		});
		handleSuggestion('youdao', items, input.value);
	};
	// handleYoudaoSuggestion end
	cb['handleSohuSuggestion'] = function (sg) {
		var items = [];
		var r = sg.r;
		//console.log('r');console.log(r);
		// enrich youku
		// imgs and titles's link is the same
		var imgs = {'src':['','','','','','','','','',''], 'link':['','','','','','','','','',''],'alt':['','','','','','','','','','']};
		var titles = {'title':['','','','','','','','','',''], 'link':['','','','','','','','','','']};
		//var info = {'type':'', 'starring':'', 'year':'', 'playLink':''};
		var infos = [{},{},{},{},{},{},{},{},{},{}]; // 有必要的话，提供初始值
		var desc = null, sohuSearchUrl = 'http://so.tv.sohu.com/mts?wd=',
			playLink, serial, prompt,
			types = {'100':'电影', '101':'电视剧', '106':'综艺',
			'115':'动漫', '121':'音乐', '200': '人物'},
			type,
			episodes,
			serialRecent,
			keyword,
			searchUrl,
			hasPic;

		$.each(r, function (i, value) {
		    value.t && items.push(value.t);
			value.n && items.push(value.n);
			//console.log('title');console.log(value.t);
			desc = value;
			infos[i].type = '';
			if (desc.pic) {
				//console.log(desc);
				hasPic = true;
				prompt = '';
				serialRecent = desc.serial && desc.serial[0];
				keyword = desc.t || desc.n;
				prompt = (serialRecent && serialRecent.t) || keyword;
				searchUrl = sohuSearchUrl + decodeURIComponent(keyword);
				type = types[desc.cid];

				imgs.src[i] = desc.pic;
				imgs.link[i] = desc.album || searchUrl;
				imgs.alt[i] = prompt;
				titles.title[i] = keyword;
				// vga 综艺 2 动漫 31 电视剧 21 电影 31 - 所以vga不能当做视频type
				// cid 电影 100 音乐 121 电视剧 101 动漫 115 综艺 106
				// 人物 200
				if (type !== '人物') {
					infos[i].type = types[desc.cid] + ((desc.language && ' (' + desc.language + ')') || '');
					infos[i].tag = (type !== '音乐' ? 'default' : 'music');
					infos[i].canPlay = true; // 2014/7/16 0:46
				} else {
				    infos[i].type = desc.c;
					infos[i].tag = 'person'; // 2014/8/5 21:19 人物
					infos[i].canPlay = false; // 2014/7/16 0:46
				}

				infos[i].starring = (desc.actors && desc.actors.replace(/;/g, ' ')) || desc.p;
				infos[i].year = desc.year || desc.b; // b for human's birthday

				playLink = (serialRecent && serialRecent.u) || desc.url || searchUrl; // serialRecent.length-1
				infos[i].playUrl = playLink;
				infos[i].playPrompt = prompt;
				// 增加剧集 serial: no t u
				episodes = desc.serial;
				if (episodes) {
					infos[i].episodes = [];
					for (var epsIndex = 0, epsLen = episodes.length; epsIndex < epsLen; ++epsIndex) {
					    infos[i].episodes.push({
							'num': episodes[epsIndex].no,
							'desc': episodes[epsIndex].t,
							'url': episodes[epsIndex].u
						});
					}
				}
				// 增加剧集 end
			}
		});
		//console.log('items');console.log(items);
		titles.link = imgs.link;

		var videoInfor = hasPic? {'imgs': imgs, 'titles': titles, 'infos': infos}: null;

		//var videoInfor = getVideoDetails();

		//console.log(videoInfor);


		var q = sg.q;
		var hasInitialSuggestions = (items.length === MAX_SUGAR_COUNT && q === '');
		handleSuggestion('sohu', items, q, hasInitialSuggestions, videoInfor);
	};
	cb['handleIqiyiSuggestion'] = function (sg) {
		var items = [],
			r = sg.data,
			imgs = {
				'src':['','','','','','','','','',''],
				'link':['','','','','','','','','',''],
				'alt':['','','','','','','','','','']
			},
			titles = {
				'title':['','','','','','','','','',''], 'link':['','','','','','','','','','']
			},
			infos = [{},{},{},{},{},{},{},{},{},{}], // 有必要的话，提供初始值
			desc, query, type,
			iqiyiSearchUrl = 'http://so.iqiyi.com/so/q_';
		// 增加剧集
		var linkAddrs,
			showTitles,
			title = '',
			dateRegExp = /(\d{8})/,
			num,
			i,
			value,
			itemCount = min(r.length, MAX_SUGAR_COUNT),
			playUrl,
			searchUrl,
			tags = {1: 'movie', 2: 'tvDrama', 4: 'comic', 6: 'show'},
			hasPic;

		//console.log('r');
			//console.log(r);

		for (i = 0; i < itemCount; ++i) {
		    value = r[i];
			query = value.name;
			items.push(query);

			//console.log('value ' + i);console.log(value);

			if (value.picture_url) {
				hasPic = true;
				imgs.src[i] = value.picture_url;
				imgs.link[i] = searchUrl = iqiyiSearchUrl + decodeURIComponent(query);

				//console.log('show_title');console.log(value.show_title);

				imgs.alt[i] = value.show_title ? value.normalize_query + '\n' + value.show_title[0] : value.normalize_query;
				titles.title[i] = query; // 添加
				type = value.cname;
				infos[i].type = (type && (type+'-'+value.region)) || '';
				//console.log('main_actor');console.log(value.main_actor);
				infos[i].starring = value.main_actor ? value.main_actor.join(' ') : '';
				infos[i].year = value.year;

				if (tags[value.cid] === void 0) {
					console.warn('爱奇艺类型不确定，id = ' + value.cid + '，type = ' + type + '，目前类型包括：', tags);
				}
				infos[i].tag = tags[value.cid] || 'movie'; // 为了和其他视频归一化

				playUrl = type === '综艺' ?
					value.recentLink:
					value.link_address && value.link_address[0];

				infos[i].canPlay = !!playUrl; // 2014/7/16 0:47 | 2014/12/19 22:14
				infos[i].playUrl = playUrl || searchUrl;
				infos[i].playPrompt = type === '综艺' ? '播放最新一期' : '播放第一集';

				// 增加剧集 serial:
				if (value.is_series) {
					linkAddrs = value.link_address;
					showTitles = value.show_title;
					//console.log('showTitles', showTitles);
					//console.log('linkAddrs', linkAddrs);
					infos[i].episodes = [];
					for (var epsIndex = 0, epsLen = linkAddrs.length; epsIndex < epsLen; ++epsIndex) {
						// 纯数字不展示下方 eps-info
						title = isFinite(showTitles[epsIndex]) ? '' : showTitles[epsIndex];
						num = (num = title.match(dateRegExp)) ? num[0]: epsIndex + 1;
						//console.log(epsIndex);
					    infos[i].episodes.push({
							'num': num,
							'desc': title,
							'url': linkAddrs[epsIndex]
						});
					}
					//console.log(infos[i].episodes);
				}
				// 增加剧集 end
			}
		}
		//console.log('items');console.log(items);
		titles.link = imgs.link;

		var videoInfor = hasPic? {'imgs': imgs, 'titles': titles, 'infos': infos}: null;

		//var videoInfor = getVideoDetails();

		//console.log(videoInfor);

		var q = sg.q;
		var hasInitialSuggestions = (items.length === MAX_SUGAR_COUNT && q === '');
		handleSuggestion('iqiyi', items, q, hasInitialSuggestions, videoInfor);
	};
	/*function handleIqiyiHotQueries() {

	}*/
	// handle suggestion end
  function makeBaiduSuggestionUrl(key) {
		return key ? baiduSugar + encURIComp(key): '';
  }
	function makeGoogleSuggestionUrl(key) {
		return key ? googleSugar + encURIComp(key) : '';
	}
	function makeYoudaoSuggestionUrl(key) {
		return key ? youdaoSugar + encURIComp(key) : '';
	}
	function makeYoukuSuggestionUrl(key) {
		return 'http://tip.soku.com/search_'+(key?'keys':'yun')+'?jsoncallback=legend.cb.handleYoukuSuggestion&query='+encURIComp(key)+'&site=2&t='+(new Date().getTime());
    }
	function makeSohuSuggestionUrl(key) {
		return sohuSugar + encURIComp(key) + (key? '': '&top=1');
    }
	function makeIqiyiSuggestionUrl(key) {
	    return key? iqiyiSugar + encURIComp(key): iqiyiHot;
	}
	// 如果有键按下和单击（适应优酷，搜狐）输入框，调用接口
	function callSuggest(host) {
		var val = input.value.trim(),
			cachedHtml;

		//console.log('val = ' + val, 'prevInput = ' + prevInput);
		if (val !== prevInput || host !== prevFlag) {
			//alert('in if');
			prevInput = val;
			prevFlag = host;

			// 从内存取出
			if (val === '') {
				cachedHtml = sugarCache[host];
				if (cachedHtml) {
					//console.log('query为空，'+ host +'的数据从内存取出');
					$sugarUl[0].innerHTML = cachedHtml;
					show($sugar);
					return ;
				}
			}

			$('.legend_cb_handleXSuggestion').remove(); // 效率高 可完全删除

			// 如果Google挂了，转到 http://unionsug.baidu.com/su?wd=anguar&cb=
			input.classList.remove('alert-danger');

			if(host === 'google') {
				// console.log('尝试Google搜索');
				// https://www.google.com.hk/complete/search?client=hp&hl=zh-CN&callback=legend.cb.handleGoogleSuggestion&q=
				jQuery.ajax({
					url: googleSugar,
					// type: 'GET',
					// data: { q: '' },
					// dataType: 'jsonp',
					// jsonp: 'callback',
					timeout: 3000
				})
				.then(function () {
			  	input.classList.remove('alert-danger');
			    // console.info('可以用Google');
				})
				.fail(function () {
			  	input.classList.add('alert-danger');
				  // console.error('Google暂时用不了');;
				});

				// jQuery.getScript(googleSugar, function() {
			 //    console.info('可以用Google');
			 //  })
			 //  .fail(function() {
			 //  	input.classList.add('alert-danger');
			 //    console.log('Google暂时用不了， 用 http://www.guge.link/ 或 http://www.baidu.com.se/ 吧');
			 //  });
			}

			sugarUrl = sugar[host] ? sugar[host](val) : makeBaiduSuggestionUrl(val);
			sugarUrl === '' && hide($sugar);

			loadScript(sugarUrl, function () {
				// 照顾爱奇艺 hot queries
				// 回调函数竟然是变量 gIqiyiHotQueries
				var undef,
					i,
					cur;

				if (win.gIqiyiHotQueries !== undef && val == '') {
					//console.log(gIqiyiHotQueries);
					var items = [],
						r = gIqiyiHotQueries.data,
						itemCount = min(r.length,MAX_SUGAR_COUNT);

					for (i = 0; i < itemCount; ++i) {
					    items.push(r[i].query);
					}

					handleSuggestion('iqiyi', items, val, true);
					gIqiyiHotQueries = undef;
				}

				cur = $sugarUl.find('li.cur').index();;
				upDownToSelectItem.cur = cur;
				(cur !== -1 ) && (upDownToSelectItem.autoHilight = true);
			}, 'legend_cb_handleXSuggestion');
		}
	}

	var sugarTimer;
	$(input).on({
		'keyup': function (e) {
			//console.log('keyup');
			if (upOrDownHit(e.which)) {
				return ;
			}

			if (sugarTimer) {
				clearTimeout(sugarTimer);
			}

			sugarTimer = setTimeout(function () {
			    callSuggest(getSearchHost());
			}, 350);
		},
		keydown: function (e) {
			//console.log('keydown');
			!isHidden($sugar) && upOrDownHit(e.which) && upDownToSelectItem(e.which);
		},
		click: function () {
			// 增加点击显示下拉
			callSuggest(getSearchHost());
			$sugarUl[0].textContent && show($sugar);
			expandFirstPicItem();
		}
	});

	$('#search-select').on('change', function () {
		callSuggest(getSearchHost());
		input.focus();
	});

	// 点击其他 隐藏推荐
	$(document).on('click', function (e) {
		var nodeName = e.target.nodeName;
		//console.log(nodeName);
		if (nodeName !== 'INPUT' && nodeName !== 'SELECT') {
			hide($sugar);
			//console.warn('hide it');
		}
	});

	// 上下按键控制下拉列表选中
	function upDownToSelectItem(key) { // children
		var $sugItems = $sugarUl.children('li'),
			len = $sugItems.length,
			cur = upDownToSelectItem.cur,
			prev = cur,
			prevItem;

		if (len > 10) {
			throw new RangError('下拉提示不应该超过10条');
		}

		if (upDownToSelectItem.autoHilight && down(key)) {
			upDownToSelectItem.autoHilight = false;

			console.log('prev', prev);
			prevItem = $sugItems[prev].getAttribute('data-item');

			if (prevItem !== input.value) {
				input.value = prevItem;
				return ;
			}
		}

		(prev !== -1) && $($sugItems[prev]).removeClass('cur');
		//$sugItems.removeClass('cur');

	  if (down(key)) {
			cur++;
	  }
		else if (up(key)) {
			cur--;
		}

		if (cur >= len) {
			cur = 0;
		}
		else if (cur < 0) {
			cur = len - 1;
		}
		upDownToSelectItem.cur = cur;

		//console.log(cur);

		input.value = $($sugItems[cur]).addClass('cur')[0].getAttribute('data-item');
	}

	function down(key) {
		return key === 40;
	}
	function up(key) {
		return key === 38;
	}

	function upOrDownHit(key) {
	    return key === 38 || key === 40;
	}

	// 给 ol#eps li 增加 mouseover 事件
	$sugar.on('mouseover', '.episode', function () {
		$(this).parents('.eps').next('.eps-info').text(this.getAttribute('eps-info'));
	});
	// 动态加载的li，用on提供的数据代理功能
	$sugarUl.on({
		mouseenter: function () {
			$(this).addClass('cur');
		},
		mouseleave: function () {
			$(this).removeClass('cur');
		},
		click: function (e) {
			input.value = this.getAttribute('data-item');
			e.target.nodeName !== 'A' && submit();
		}
	}, 'li');


})();