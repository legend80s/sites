/*
 * tab.js
 * 2014/11/14 
 * legend80s-bupt
 * 
 * 2014/11/30 18:44 进一步减少全局变量
 */

(function () {
	var win = window,
		doc = document,
		min = win.Math.min, 
		eq2ch = win.legend.string.engQuotationToCh, 
		picerr = win.legend.pic.err,
		createNS = win.legend.createNS,
		loadScript = win.legend.html.loadScript, 
		ftm = win.legend.number.formatTime,
		makeAnchor = win.legend.html.makeAnchor,
		storage = legend.storage,

		cb = legend.cb = legend.cb || {}, // 所有的jsonp回调函数挂载于此

		YK_SRCH_ADDRESS = "http://www.soku.com/search_video",

		tab = {
			news: (function () {
			    var _number = 2;
				return {
					left: 0,
					load: loadNews,
					// 获取尝试请求的新闻条数
					getRequestNumber: function () {
						return _number;
					},
					// 设置尝试请求的新闻条数
					setRequestNumber: function (number) {
					    _number = number;
					},
					// 获取实际展现的新闻条数
					getDisplayedNumber: function () {
					    return $news.find('.article').length;
					}
				};
			}()),
			video: {
				max: 12
			},
			hasVideoLoaded: false,
			hasNewsLoaded: false
		},
		videoMax = tab.video.max,
		$site = $('#site'), 
		$video = $('#video'), 
		$news = $('#news'), 
		$videoTop = $('.ps-container .video-top'),
		rankedVideosBody, // 在 initBottomVideo 处初始化

		cb = legend.cb = legend.cb || {}; // 所有的jsonp回调函数挂载于此
	
	function hasTopVideos() {
	    return $videoTop.children().length !== 0;
	}
	function hasNewsDisplayed() {
	    return $news.find('.article').length !== 0;
	}

	// 暴露 tab.news 给 setRequestNumber.js
	createNS('legend.tab.news');
	var news = window.legend.tab.news = tab.news;

	var Resource = (function (resrc) {
		// private
	    function showVideoFromLocalStorage() {
	        //alert('showVideoFromLocalStorage');
			//console.log('video from localStorage'); // shit! 360 又挂了，
			var lvi = storage('videoInfos');
			if (hasTopVideos()) {
				return true;
			}
			if (!lvi) {
				return false;
			}
			$videoTop.append(lvi);
			console.log('_t: video from localStorage'); // shit! 360 又挂了，

			return true;
	    }

		// 新增 360搜索综艺排行榜
		// 提供两个接口360综艺排行榜和百度综艺排行榜
		// http://opendata.baidu.com/api.php?resource_id=6864&from_mid=1&&format=json&ie=utf-8&oe=utf-8&query=%E7%BB%BC%E8%89%BA%E6%8E%92%E8%A1%8C%E6%A6%9C&sort_key=16&sort_type=1&stat0=&stat1=&stat2=&stat3=&pn=0&rn=8&cb=jQuery110209678341255057603_1415769194668&_=1415769194671

		var video360Rank = (function () {
			// 数据来源：360搜索综艺排行榜 
			var program = {}, // 保存上一次查询的节目数据，用于错误恢复
				outerCallback = function () {}, // 外部数据处理回调函数
				srcRecentHrefNameReg = /<img src=\"([^\"]+)\".*?info-up\">([^<]+)<.*?<p class=\"name aline\"><a href=\"([^\"]+)\"[^>]*>([^<]+)</g,
				htmls = []; // 保存按照页数查询的视频的HTML字符串，减少实时quest

			function get360EncodeFormat(ch) {
				return ch; // encodeURIComponent(ch).replace(/%/g, '%25'); // ch
			}
			var query = get360EncodeFormat('综艺'),//
				url = get360EncodeFormat('综艺排行'), // limit:10一页展现10条结果
				addInfo = get360EncodeFormat('types:全部|region:全部|year:全部|limit:10'), 
				tpl = '2', // 1是json数据，tpl=1是html数据
				params = 'query='+query+'&url='+url+
				'&type=relation_variety_rank&src=onebox&num=1&addInfo=',
				completeUrl = 'http://open.onebox.so.com/dataApi?&tpl='+tpl+'&callback=legend.cb.get360RankedVideos'+'&_'+(new Date()).getTime()+'&'+params;
			// tpl = 1 html 
			// tpl = 2 json
			function request(_outerCallback, _page) {
				var tempAddInfo = addInfo + (isFinite(_page) ? get360EncodeFormat('|page:'+_page) : ''); // 避免影响 addInfo，新建了一个变量 tempAddInfo
				$('.video-bottom-jsonp').remove();
				loadScript(completeUrl + tempAddInfo, null, 'video-bottom-jsonp');
				outerCallback = _outerCallback;
			}
			function errorForHtml(v) {
				//console.log(v);
				if (!v || v.ajaxinfo.length !== 0) {
					console.error('360搜索综艺排行榜 无法得到数据');
					return true;
				}
				return false;
			}
			function errorJson(v) {
				try {
					return v.display.hot.length === 0;
				}
				catch (e) {
					return true;
				}
			}
			// 内部回调函数 html 格式和 json 数据格式
			cb.get360RankedVideos = function (v) {
				var hasError = (tpl === '2' ? errorJson(v) : errorForHtml(v));
				if (hasError) {
					outerCallback(program); // 返回上一次查询的节目数据
					return ;
				}
				//console.log(v);
				//program = {}; // 清空节目数据

				var img = {};
				img.src = [];
				img.link = [];
				program.name = [];
				program.recent = [];

				// 格式化数据
				if (tpl === '2') { // 处理 json 数据
					var hots = v.display.hot,
						len = hots.length,
						i,
						hot;

					for (var i = 0; i < len; ++i) {
						hot = hots[i];
						img.src.push(hot.imgurl); // src
						program.recent.push(hot.lastperiod); // 第几期
						img.link.push(hot.url); // 跳转链接
						program.name.push(hot.moviename); // 节目名字
					}
				}
				else { // 1 处理 html 数据
				    while ((result = srcRecentHrefNameReg.exec(html)) != null)  {
						img.src.push(result[1]); // src
						program.recent.push(result[2]); // 第几期
						img.link.push(result[3]); // 跳转链接
						program.name.push(result[4]); // 节目名字
					}
				}

				program.img = img;
				program.itemLength = program.name.length;
				outerCallback(program);
				//console.log(program);
			}
			// 返回外部调用接口
			return {
				url: completeUrl,
				request: request,
				htmls: htmls
			};
		})();
		// video360Top: 'http://www.so.com/home/getCardDatas?fmt=web&callback=Video.setVideoData&_abversion=c&_='+(new Date().getTime()),
		// http://opendata.baidu.com/api.php?resource_id=6864&from_mid=1&&format=json&ie=utf-8&oe=utf-8&query=%E7%BB%BC%E8%89%BA%E6%8E%92%E8%A1%8C%E6%A6%9C&sort_key=16&sort_type=1&stat0=&stat1=&stat2=&stat3=&pn=0&rn=8&cb=jQuery110209678341255057603_1415769194668&_=1415769194671
		// http://opendata.baidu.com/api.php?resource_id=6864&from_mid=1&&format=json&ie=utf-8&oe=utf-8&query=综艺&sort_key=16&sort_type=1&pn=0&rn=10&cb=mycb&_=1415769194671
		// 'http://rec.api.so.com/mod_recommend_search/GetRemindMessage?from=so_home&callback=Video.setVideoData&count=0&start=0&mid=h3f66c71409496332464f39e63b3a073db0233cda0215af.5&guid=10ZUXwICml383v36KTLWqAwIkMGrOcTVjXI78NkG578sM%3D&_='+(new Date()).getTime(),
		// http://rec.api.so.com/mod_recommend_search/GetRemindMessage?from=so_home&callback=So.web.card.setData&count=0&start=0&mid=h3f66c71409496332464f39e63b3a073db0233cda0215af.5&guid=10ZUXwICml383v36KTLWqAwIkMGrOcTVjXI78NkG578sM%3D&_=1409717736297
		var urls = {//Video.setVideoData
			video360Top: 'http://www.so.com/home/getCardDatas?fmt=web&callback=legend.cb.setVideoData&_abversion=c&_='+(new Date().getTime()),
			rankedVideosUrls: {
				360: video360Rank.url,
				baidu: 'http://opendata.baidu.com/api.php?resource_id=6864&from_mid=1&&format=json&ie=utf-8&oe=utf-8&query=综艺&sort_key=16&sort_type=1&pn=0&rn=10&cb=mycb&_='+(new Date().getTime())
			},
			
			/*
			iqiyi: 'http://qiyu.iqiyi.com/p13n?cids=-1_13&area=lizard&callback=legend.cb.addIqiyiVideo',
			*/
			/*youku: {
				recommend: 'http://ykrec.youku.com/personal/packed/list.json?apptype=1&pg=8&module=1&pl=12&picSize=1&module=1&callback=Youku.getUserRecommend', 
				userInfo: 'http://nc.youku.com/index/getUserinfo?nu=1&__callback=Youku.getUserinfo',
				userId: '', 
				userName: ''
			},
			youkuRecord: 'http://www.youku.com/index_cookielist/s/jsonp?callback=CloudRecords.getRecordsData&timestamp=14053567327141vmki908bv',*/ 
			news360: 'http://tjapi.news.so.com/youlike?callback=legend.cb.setNewsData&f=jsonp&n='
			// http://zy.youku.com/
			// 360娱乐新闻 http://tjapi.news.so.com/youlike?callback=gSetNewsData&f=jsonp&c=fun
			// 新浪新闻 2014/11/7 12:12
			//http://cre.mix.sina.com.cn/api/v3/get?rfunc=103&fields=url&feed_fmt=1&cateid=1o_1p&merge=3&this_page=1&dedup=32&pageurl=http://news.sina.com.cn/c/2014-11-07/102731109906.shtml&offset=0&length=5&lid=-2000&callback=feedCardJsonpCallback&_=1415330630050
			//http://top.news.sina.com.cn/ws/GetTopDataList.php?top_channel=news&top_type=day&top_cat=www_all&top_time=today&top_show_num=8&top_order=ASC&js_var=data&callback=hncb_all_list_01
		};
		// public
		// load resoures 
		function load(type, process, callback, cls) {
			process = process || loadScript;
			callback = callback || function () {};
			if (type !== 'youku') {
				process(urls[type], function () {
				    //alert('shit 360');
					// show video info from local storage when 360 video is forbidden
					//alert('news url: ' + urls[type]);
					if (!hasTopVideos()) {
						console.log(type);
						//alert('error，无法从网上获取视频信息');
            console.error('360不给力，无法从网上获取视频信息');
						showVideoFromLocalStorage();
					}
					callback();
				}, cls);
			}
			else {
			    process(urls.youku.userInfo, function () {
			        process(urls.youku.recommend + '&uid=' + urls.youku.userId, callback);
			    });
			}
		};
		// 新添加的方法和属性
		resrc.load = load;
		resrc.showVideoFromLocalStorage = showVideoFromLocalStorage;
		resrc.urls = urls;
		resrc.video360Rank = video360Rank;
		return resrc;
	})(Resource || {});
	var rankedVideosUrls = Resource.urls.rankedVideosUrls;

	/*win.Youku = {};
	Youku.getUserinfo = function (u) {
		//console.log('getUserinfo');console.log(u);
	    Resource.urls.youku.userId = u.userId || '', Resource.urls.youku.userName = u.userName || '';
	};*/
	function fta(n) {
	    if (n < 10000) {
			return n;
	    }
		var w1 = n * 0.0001, w2 = w1 | 0, q = (w1 - w2) * 1000 | 0;
		return w2 + '万' + q;
	}
	/*
	Youku.getUserRecommend = function (video) {
		//console.log('youku recommend:');console.log(r.data);
		//var fv = formatVideoData(vs);

		var vs = video.data, banner, v, linkcls = 'i-title', desc, 
			u = Resource.urls.youku.userName, user = u ? '您好 ' + u : '',
			r = ['<div class="videos"><p class="from">来自优酷 '+ user +'</p><ul>'];
		Resource.urls.youku.userName = '';
		// tab.video.config.MAX_VIDEO_COUNT
		for (var i = 0, len = min(vs.length, videoMax); i < len; ++i) {
			v = vs[i];
			totalTime = ftm(v.totalTime);
			playAmount = fta(v.playAmount);
			banner = '<div class="banner"><p class="left-banner">播放'+playAmount+'次</p><p class="right-banner">'+totalTime+'</p></div>';
			desc = (v.desc || v.title).slice(0, 47);
			r.push(['<li><div><a href="', v.playLink, '" title="', desc, '"><img width="180" height="101" src="', v.picUrl, '" alt="', v.title, '"/>', banner, '</a></div><div class="', linkcls, '"><p class="ellipsis"><a href="', v.playLink, '" title="', v.title, '">', v.title, '</a></p></div></li>'].join(''));
		}
		r.push('</div></ul>');
		$('#video').find('.videos').remove();
	    $videoTop.after(r.join(''));
	};
	*/

	// 增加360搜索综艺排行榜
	function fillBottomVideo(data, page) {
		var r = '',
			imgs = data.img,
			leftBanners = data.imgBottomBanner.left,
			rightBanners = data.imgBottomBanner.right,
			briefIntros = data.briefIntros,
			banner,
			p, // 添加页数 2014/8/29 0:11
			htmls = Resource.video360Rank.htmls;
			
		$('.from')[0].innerHTML = data.site.slogon;

	    for (var i = 0, len = data.len; i < len; ++i) {
			banner = '<div class="banner">'+(rightBanners[i]||'')+'</div>';
			
	        r += ('<li class="video-li"><div><a href="' + imgs.link[i] + 
				'"><img class="video-img" width="124" height="160" src="' + imgs.src[i] + '" alt="' + briefIntros[i] + '"/>' + banner + '</a></div><div class="i-title"><p class="ellipsis"><a href="' + imgs.link[i] + '" title="' + briefIntros[i] + '">' + data.name[i] + '</a></p></div></li>');
	    }
		p = win.parseInt(page ? page : 1);
		//console.log('缓存第'+p+'页');
		(1<= p && p <= 3) && (htmls[p] = r); // 缓存前三页数据(考虑内存), 无需online查
		rankedVideosBody.innerHTML = r;

		// 为综艺排行榜图片容错
		$('.video-img').on('error', function () {
		    picerr(this, 7);
			// 解决切换页面，出错图片重复加载 - 2014/11/12 20:06
			htmls[p] = rankedVideosBody.innerHTML;
		});
	}
	function getFormatedData(len, siteObj, imgBottomBannerObj, 
			imgObj, name, briefIntros) {

		var left = [], 
			right = [];
		
		//console.log('name:' + name);

	    return {
			len: len,
			site: siteObj, // slogon, link
			imgBottomBanner: {
				left: imgBottomBannerObj.left, 
				right: imgBottomBannerObj.right
			}, // left, right
			img: imgObj, // src link
			name: name,
			briefIntros: briefIntros
		};
	}
	function addBottomVideoByPage(page) {
		//console.log('get video from page: ' + page);
		Resource.load(rankedVideosUrls['360'], function () {
			var html = Resource.video360Rank.htmls[page];
			//console.log('addBottomVideoByPage, page: ', page, ' html: ', html);
			if (html) {
				//console.log('从缓存中取出第 ' + page + ' 页数据');
				rankedVideosBody.innerHTML = html;
				return ;
			}
			//console.log('get bottom video from online of page ' + page);
			//console.log('从在线中取出第 ' + page + ' 页数据');
			Resource.video360Rank.request(function (data) {
				//console.log(data);
				var briefIntros = [];
				for (var i = 0, len = data.itemLength; i < len; ++i) {
					briefIntros.push(data.name[i] + '更新至' + data.recent[i]);
				}

				//tab.video.config.MAX_VIDEO_COUNT
				var ftd = getFormatedData(
					min(data.itemLength, videoMax), 
					{
						slogon: '来自360搜索综艺排行榜', 
						link: 'http://www.so.com/s?q=%E7%BB%BC%E8%89%BA'
					},
					{
						left: [], 
						right: data.recent
					},
					data.img,
					data.name,
					briefIntros
				);
				//console.log(ftd);
				fillBottomVideo(ftd, page);
			}, page);
		});
	}
	cb.addBottomVideoByPage = addBottomVideoByPage;

	function addTopVideos(topVideoCallback) {
		if (tab.hasVideoLoaded) {
			return ;
		}
		tab.hasVideoLoaded = true; // 阻止首次自动加载和切tab，重复加载2次的问题
		// 保证只出现一条
		$('.video360Top-jsonp').remove();
		Resource.load('video360Top', null, function () {
			topVideoCallback && topVideoCallback();
		    //win.setTimeout(function () {
				//addBottomVideoByPage(1);
			//}, 100);
		}, 'video360Top-jsonp');
		//Resource.load('iqiyi');
		//Resource.load('youku');
		
	}

	function switchTab() {
		var prevTab = $site, 
			prevTitle = $('li[data-key=site]'), 
			key;

		$('#menus').on('click', '.menu', function (e) {

				key = e.target.getAttribute('data-key');
				if (key === prevTab.attr('id')) {
					return ;
				}

				// 只有第一次切tab 才 load online
				//(key === 'video') && !hasTopVideos() && addTopVideos();
				(key === 'news') && !hasNewsDisplayed() && loadNews(news.getRequestNumber());

				prevTitle.removeClass('active');
				prevTitle = $('li[data-key=' + key + ']').addClass('active');

				prevTab.removeClass('cur');
				prevTab = $('#' + key).addClass('cur');
			//}
		});
	}

	/* 2014/11/30 19:42
	cb.addIqiyiVideo = function (video) {
		var vs = video.channel_rec[0].selected_album, v, banner, r, linkcontent, linkcls;
		//console.log(vs); tab.video.config.MAX_VIDEO_COUNT
		r = ['<div class="iqiyi-videos"><p class="from">来自爱奇艺</p><ul>'];
		for (var i = 0, len = min(vs.length, videoMax); i < len; ++i) {
		    v = vs[i];
			linkcls = 'i-title';
			// 普通视频
			if (v.channel_id !== 6 && v.channel_id !== 2) {
				banner = '';
				linkcls = '';
			} // 电视剧
			else if (v.channel_id === 2){
				if (v.current_set_num < v.total_set_num) {
					banner = '<div class="banner"><p class="left-banner">更新至'+v.current_set_num+'/共'+v.total_set_num+'集</p>';
				}
				else {
				    banner = '<div class="banner"><p class="left-banner">'+v.total_set_num+'集全部</p>';
				}
			    
			} // 综艺
			else if (v.channel_id === 6){
				banner = '<div class="banner"><p class="left-banner">'+v.focus+'</p><p class="right-banner">'+v.prem_date.substring(5)+'期</p></div>';
			}
			linkcontent = v.source ? v.source : v.short_title;
			r.push(['<li><div><a href="', v.play_url, '" title="', v.album_name, '"><img width="180" height="101" src="', v.pic_url.replace('.jpg','_180_101.jpg'), '" alt="', v.album_name, '"/>', banner, '</a></div><div class="', linkcls, '"><p class="ellipsis"><a href="', v.play_url, '" title="', v.album_name, '">', linkcontent, '</a></p></div></li>'].join(''));
		}
		r.push('</div></ul>');
		
		// channel_id = 6 综艺 focus = focus + prem_date 2014-06-27 06-27期
		// channel_id = 2 电视剧 focus = 更新至current_set_num/共29集
		$('#video').find('.iqiyi-videos').remove();
	    $videoTop.after(r.join(''));
	};
	*/

	// 优化 2014/7/28 20:22
	// http://v.youku.com
	// http://www.tudou.com
	// http://tv.sohu.com
	// 视频模块
	var video = (function (v) {
		var _src = {
				'youku': '优酷视频', 'sohu': '搜狐视频', 'qq': '腾讯视频', 
				'tudou': '土豆视频', 'hunantv': '芒果台视频', 'iqiyi': '爱奇艺', 
				'wasu': '华数视频', 'cntv': 'cntv(中国网络电视台)', 'letv': '乐视tv',
				'kankan': '迅雷看看', 'pptv': 'PPTV', 'biquge': '笔趣阁'
			},
			// 提取 http://www.youku.com 中的 youku
			_srcRegx = /^http:\/\/[\w]+\.([\w]+)\.[\w]+/, 
			_host;

	    function _videoFrom(url) {
			_host = '';
			var matches = url.match(_srcRegx);
			if (matches === null) {
				return _videoSoureUnidentified(url);
			}
			_host = matches[1];
			return _src[_host] || _videoSoureUnidentified(url);
		}
		function _videoSoureUnidentified(url) {
			console.warn('视频来源未知，请管理员根据播放地址确认来源，地址为：' + url);
			return _host || '未知';
		}
		// 跨文件扩展功能
		v.videoFrom = _videoFrom;
		return v;
	}(video || {}));
	
	// 可恶的360视频 现在360视频已经更换json接口，已稳定
	// 又更换了新的接口 2014/9/3 12:26
	//win.Video = {};
	cb.setVideoData = function (v) { // v.onebox.data.length === 0
		if (v.error == 1 || v.msg != 'succ' || !v.data.onebox) {
			if (Resource.showVideoFromLocalStorage() === false) {
				//$videoTop.html('<div class="no-info">暂时没有视频信息</div>');
				$('.settings').addClass('no-video');
			}
			console.log('_t: no 360 video data:', v);
			return ;
		}

		console.log('_t: 360 video updated online');
		//$videoTop.empty();
	
		var data = v.data.onebox, title, upinfo, videoInfos,
			encode = win.encodeURIComponent,
			searchHost = YK_SRCH_ADDRESS + '/q_',
			first = data[0],
			searchUrl = searchHost + encode(first.kw),
			playUrl = first.upurl || first.pdurl || searchUrl,
			playLink;

		// fill data for the first one
		upinfo = '第' + (first.pd ? first.pd + '期' : first.upinfo + '集');
		title = eq2ch((first.pdname || first.title)) + ' 更新至' + upinfo;

		videoInfos = '<li class="first others1">' + makeAnchor('立即播放', playUrl, 'play orange-color', '播放'+upinfo+' - 来自' + video.videoFrom(playUrl)) + '<a href="' + searchHost + encode(first.kw) + '" class="area" title="' + title + '"></a><img onerror="legend.pic.err(this,4)" src="' + first.cover + '" alt="' + first.title + '"/><div class="con"><h4>[' + first.type + '] ' + first.title + '</h4><p>更新至：<strong>' + upinfo + '</strong></p></div></li>';
		
		// fill data for others
		var dataCount = data.length,
			d,
			i;
		for (i = 1; i < dataCount; ++i) {
			d = data[i];
			upinfo = '第' + (d.pd ? d.pd + '期' : d.upinfo + '集');
			playUrl = d.upurl || d.pdurl;			
			playLink = playUrl ? 
				makeAnchor('立即播放', playUrl, 'play orange-color', '播放'+upinfo+' - 来自'+video.videoFrom(playUrl))
				: '';

			title = (d.pdname || d.title) + ' 更新至' + upinfo;
			videoInfos += ('<li class="list" title="' + title + '"><a href="' + searchHost + encode(d.kw) + '"><span class="title">[' + d.type + '] ' + d.title + '</span>' + playLink + '<span class="info">更新至：<strong>' + upinfo + '</strong></span></a></li>');
		}
		//$videoTop.append(videoInfos);
		$videoTop[0].innerHTML = videoInfos;
		storage('videoInfos', videoInfos);
	};	

	function refreshVideos() {
		tab.hasVideoLoaded = false; // 阻止首次自动加载和切tab，重复加载2次的问题
		//rankedVideosBody.innerHTML = ''; // 清除上一次的视频
		Resource.video360Rank.htmls = [];// 清空 bottom video 缓存
		var cont = $('.ps-container');
		var c = cont.css('background-color');

		cont.css('background-color', 'rgba(0, 0, 0, 0.5)');
		addTopVideos();
		setTimeout(function () {
			//console.log(cont.css('background-color'));
			//console.log(c);
			cont.css('background-color', c);
			//console.log(cont.css('background-color'));
		}, 500);
	}

	;(function (news) {
		var _med,
			_chn,
			_media = {
				sina: '新浪',
				ifeng: '凤凰网',
				163: '网易',
				sohu: '搜狐',
				bjnews: '新京报',
				huxiu: '虎嗅网',
				xinhuanet: '新华网',
				cnr: '央广网',
				youth: '中青网',
				zol: '中关村在线',
				people: '人民网',
				huanqiu: '环球网',
				chinanews: '中国新闻网',
				chinadaily: '中国日报',
				southcn: '南方',
				cankaoxiaoxi: '参考消息',
				china: '中华网',
				reuters: '路透中文网',
				xinmin: '新民网',
				'21cn': '21CN',
				cqnews: '重庆华龙网',
				ce: '中国经济网',
				cri: '国际在线',
				mydrivers: '驱动之家',
				taiwan: '中國台灣網',
				xinjunshi: '环球新军事',
				workercn: '中国工人网',
				carschina: '汽车中国',
				ahwang: '安徽',
				cqwb: '重庆晚报',
				'517japan': '日本通',
				sznews: '深圳新闻网',
				caijing: '财经网',
				techweb: 'TechWeb',
				chexun: '车讯网',
				jrj: '金融界',
				ynet: '北青网',
				sootoo: '速途网（sootoo.com）',
				iresearch: '艾瑞',
				xcar: '爱卡汽车',
				focus: '搜狐焦点',
				gmw: '光明网',
				cyol: '中青在线',
				guancha: '观察者',
				pedaily: '投资界（PEdaily.cn）',
				changsha: '长沙星辰在线',
				legaldaily: '法制网',
				guokr: '果壳网',
				iheima: '黑马（创业）',
				dahebao: '大河报',
				jinghua: '京华时报',
				bitauto: '易车网',
				mtime: 'Mtime时光网',
				cnstock: '中国证券网',
				wallstreetcn: '华尔街见闻',
				infzm: '南方周末',
				gxnews: '广西新闻网'
			},
			_channels = {
				news: '新闻频道',
				ent: '娱乐频道',
				yule: '娱乐频道',
				et: '娱乐频道', // 'et.21cn.com': '21CN娱乐'
				fun: '娱乐频道', // 'fun.youth.cn': '中青网娱乐频道'
				video: '视频',
				tech: '科技频道',
				it: 'IT',
				intl: '国际经济', // 'intl.ce.cn': '中国经济网国际经济'
				fashion: '时尚频道', // 'fashion.ce.cn': '中国经济网时尚频道'
				sports: '体育频道',
				edu: '教育频道',
				science: '科技频道',
				business: '财经频道',
				finance: '财经频道',
				lady: '女性频道',
				shipin: '食品频道',
				sp: '食品频道',
				health: '健康频道',
				house: '房产频道',
				politics: '时政',
				baobao: '母婴频道',
				war: '军事',
				www: ' ',
				gb: '娱乐频道',
				mil: '军事',
				legal: '',
				world: ' ',
				info: ' ',
				she: '女人帮',
				politics: '时政',
				fj: '（福建）',
				ec: '电子商务',
				newshtml: ' ', // newshtml.iheima
				epaper: ' ', // epaper.jinghua
				pe: ' ',
				game: '游戏',
				gx: '广西',
				jl: '吉林',
				hb: '（湖北）'
			},
			_rootRegExp = /^(net|com|cn)$/, // a more effective one - 2014/11/13 11:15
			_partsRegExp = /(?:\w+\.)+\w+/;
		// http://news.cnr.com.cn/native/gd/201411/t20141111_516763978.shtml
		// input: http://world.people.com.cn/n/2014/1110/c157278-26000444.html 
		// output: ['people', 'world']
		// [medium, channel]
		function _getHostParts(url) {
			return url.match(_partsRegExp)[0].split('.').filter(function (v) { 
				return !(_rootRegExp.test(v)); 
			}).reverse();
		}

		function newsFrom(url) {
			var parts = _getHostParts(url);

			if (parts.length === 0) {
				console.log(parts);
				return _newsSoureUnidentified(url);
			}
			else {
				_med = parts[0]; // 'mydrivers'
				_chn = parts[1]; // 'news'
				
				return (_media[_med] || ' '+_med) + (_chn && (_channels[_chn] || '（'+_chn+'）') || '');
			}
		}

		function _newsSoureUnidentified(url) {
			console.warn('新闻来源未知，请管理员根据新闻地址确认来源，地址为：' + url);
			//console.log(_med, _chn);
			return '"未知"';
		}
		// 提供外部接口
		//return {
			//from: newsFrom
		//};
		news.from = newsFrom;
	}(news)); // 立即执行

	cb.setNewsData = function (n) {
	    //console.log(n);
		//alert('gSetNewsData');
		if (n.length === 0) {
			console.log('error: no news available now');
			$news.html('<div class="no-info">暂时没有最新新闻</div>');
			return ;
		}

		var articles = '', 
			src, 
			picClass = '', 
			picStr = '', 
			link,
			i,
			newsCount,
			title,
			prompt;

		for (i = 0, newsCount = n.length; i < newsCount; ++i) {
			title = eq2ch(n[i].t); // 防止属性被截断
			src = n[i].i.split('?')[0];
			link = n[i].u;
			prompt = title + '\n- 来自' + news.from(link);
			//console.log('src ' + i + ': ' + src);
			if (src !== '') {
				picClass = ' pic';//
				picStr = '<figure class="img-box"><img onerror="legend.pic.err(this,9)" src="'+src+'" alt="'+title+'"/></figure>';
			}
			
		    articles += ('<article class="article' + picClass + '"><h4 class="article-title"><a href="' + link + '" title="' + prompt + '" class="article-title-link">'+ title + picStr +'</a></h4><a href="javascript:void(0);" class="del" title="删除该条新闻"></a><p class="brief">' + n[i].s + '</p></article>');
			
			//articles += ('<article class="article' + picClass + '"><h4 class="article-title"><a href="' + link + '" title="' + prompt + '" class="article-title-link">' + title + '</a></h4><a href="javascript:void(0);" class="del" title="删除该条新闻"></a>' + picStr + '<p class="brief">' + n[i].s + '<a href="' + link + '">[详情]</a></p></article>');
			
			picClass = '';
			picStr = '';
		}
		$news.find('.article').remove();
		$news.append(articles);
		//initArticleEvents();
	}

	function initArticleEvents() {
	    addEffectToNewsArticleHeaders();
		deleteWhenClick();
	}
	function deleteWhenClick() {
		$news.on('click', '.del', function () {
			var requestNumber = news.getRequestNumber();
			
			// 第一次点击或全部删除后的第一次点击
			if (news.left === 0) {
				news.left = news.getDisplayedNumber();
			}

			//console.log('_t: deleteWhenClick', requestNumber, news.left);

		    $(this).parent('.article').slideUp(500, function () {
				$(this).remove();

				//console.log('_t: before', requestNumber, news.left);
				--news.left === 0 && loadNews(requestNumber);
				//console.log('_t: after', requestNumber, news.left);
		    });

		});
	}
	// hover ... , 点击 出现【已读】，并调整至最后一条
	// css 取代js hover添加省略号的功能
	function addEffectToNewsArticleHeaders() {
		$news.on('click', '.article-title-link', toLast);
		$news.on('click', '.img', function () {
		    toLast.call(this, true);
		});
	}
	function toLast(img) {
		if (typeof this.firstClick === 'undefined') {
			this.firstClick = true;
		}

		if (this.firstClick === true) {
			this.firstClick = false;

			/*$(this).before('<span class="done"><i>√</i>已读</span>').
				parent().siblings('.brief').addClass('read');
			sinktoLast($(this).parents('.article'));*/
			var $title = img? $(this).parent().find('.article-title-link'): $(this);
			sinktoLast($title.before('<span class="done"><i>√</i>已读</span>').
				parents('.article').addClass('read'));
		}
	}
	function sinktoLast($target) {
		// $target.remove(); 
		// 除了节点本身以外，节点绑定的事件和该节点相关的JQuery数据，也会被同时清除, 
		// 所以原先绑定的click事件也被删除了
		//$news.append($target.detach());
		//$news.append($target.remove());

		// :not is faster than .not() if querySelectorAll is supported
		// http://jsperf.com/jquery-css3-not-vs-not
		// eq($collection.length - 1) > .last() > :last-child
		var $unreadNews = $news.find('.article:not(.read)');
		$unreadNews.length && $unreadNews.last().after($target.remove());
	}

	function loadNews(number) {
		tab.hasNewsLoaded = true;
		$('.news360').remove();
		//requestNumber = number;
		loadScript(Resource.urls['news360'] + number, null, 'news360');
	}

	/*function showNews() {
		if (tab.hasNewsLoaded) {
			return ;
		}
		loadNews();
	}*/
	/*
	win.toNoPicVersion = function (that) {
		console.log('img error: ', that.alt || that.title);
		var imgBox = that.parentNode.parentNode,
			article = imgBox.parentNode;

	    imgBox.style.display = 'none'; // p.img
		article.className = article.className.replace('pic', ''); // article.article.pic
		that.onerror = null;
	}; // 这个分号不能少
	*/
	// 增加 page num begin
	function checkMore() {
		var videoBottomBox = doc.getElementById('video-bottom'),
			videoUnfold;

	    if ($('.video-top')[0].innerHTML.length === 0) {
			videoBottomBox.style.display = 'block';
		}
		else {
		    $('.ps-container').append('<p class="video-unfold" id="video-unfold">查看更多视频</p>')
			// 增加点击查看更多
			videoUnfold = doc.getElementById('video-unfold');

			videoUnfold.onclick = function () {
				if (videoBottomBox.style.display === 'none') {
					if (typeof checkMore.firstUnfold === 'undefined') {
						addBottomVideoByPage(1);
						checkMore.firstUnfold = false;
					}
					videoBottomBox.style.display = 'block';
					videoUnfold.textContent = '收起全部视频';
				}
				else {
					videoBottomBox.style.display = 'none';
					videoUnfold.textContent = '查看更多视频';
				}
			};
		}
	}
	function initBottomVideoAndPageView() {
		var str = '<div class="video-bottom" id="video-bottom" style="display:none;"><p class="from"></p><nav id="page-box"></nav><ul class="video-body"></ul></div>';
	    $('.ps-container').append(str);
		rankedVideosBody = $('.video-body')[0];
	}
	// // 增加 page num end
	// 小工具 tab
	// 七天天气 汇率转换
	// http://open.onebox.so.com/index/getCurr?callback=currencyConverter&query=%E4%BA%BA%E6%B0%91%E5%B8%81%E5%AF%B9%E7%BE%8E%E5%85%83&url=%E4%BA%BA%E6%B0%91%E5%B8%81%E5%AF%B9%E7%BE%8E%E5%85%83&kw=1%7CUSD%7CCNY&type=curr&src=onebox&tpl=0&_=1404145610371

	// http://open.onebox.so.com/index/getCurr?callback=jQuery18309499116216320544_1404145563872&query=%E4%BA%BA%E6%B0%91%E5%B8%81%E5%AF%B9%E7%BE%8E%E5%85%83&url=%E4%BA%BA%E6%B0%91%E5%B8%81%E5%AF%B9%E7%BE%8E%E5%85%83&kw=1%7CUSD%7CCNY&type=curr&src=onebox&tpl=0&_=1404145610371
	// http://open.onebox.so.com/dataApi?query=%25E7%25BB%25BC%25E8%2589%25BA&url=%25E7%25BB%25BC%25E8%2589%25BA%25E6%258E%2592%25E8%25A1%258C&type=relation_variety_rank&src=onebox&num=1&tpl=2&addInfo=types%3A%25E5%2585%25A8%25E9%2583%25A8%7Cregion%3A%25E5%2585%25A8%25E9%2583%25A8%7Cyear%3A%25E5%2585%25A8%25E9%2583%25A8%7Climit%3A8%7Cpage%3A2&callback=jQuery183028261993965134025_1409496670830&_=1409496690971
	// http://open.onebox.so.com/dataApi?&tpl=2&callback=get360RankedVideos&_1409497375085&query=综艺&url=综艺排行&type=relation_variety_rank&src=onebox&num=1&addInfo=types:全部|region:全部|year:全部|page:2|limit:10

	// http://finance.yahoo.com/connection/currency-converter-cache?date=

	// start it
	// 这个闭包没有加分号[;]导致 error: undefined is not a function
	;(function init() {
		initBottomVideoAndPageView();
		// 因为每次都要查看视频tab，不如待页面其他元素加载完成后自动加载视频
		// 第一次从本地存储加载
		if (!Resource.showVideoFromLocalStorage()) {
			win.setTimeout(function () {
				addTopVideos(checkMore);
			}, 1000); // 防止两次加载
		}
		else {
		    checkMore();
		}
		//win.setTimeout(showNews, 1000);
	    switchTab();
		$('.settings').on('click', '.refresh', refreshVideos);
		$('.unread').on('click', function () {
		    loadNews(news.getRequestNumber());
		});
		initArticleEvents();
		// showPlayButtonOnHover
		$videoTop.on({
			mouseenter: function () {
				$(this).find('.play').css('opacity', 1);
			},
			mouseleave: function () {
				$(this).find('.play').css('opacity', 0);
			}
		}, '.list');
	})();
})();
// tab.js end