// http://61.4.185.48:81/g/
// weather.js
// 2014/6/18 22:38
// 七天天气 http://tianqi.2345.com/t/7day_tq_js/54511.js
// cityid http://tianqi.2345.com/t/shikuang/54511.js?1434292820058
(function () {
	var win = window,
		today = new Date(),
		cityId,
		city,
		staticWthUrl,
		legend = win.legend,
		localStorage = win.localStorage,
		loadScript = legend.html.loadScript,
		formatDate = legend.calendar.date.formatDate,
		isNewDay = legend.calendar.date.isNewDay,
		storage = legend.storage,
		SEPARATOR = '|separator|',

		cb = legend.cb = legend.cb || {}; // 所有的jsonp回调函数挂载于此

	// legend.weather 添加方法
	var weather = legend.weather = legend.weather || {};
	weather.checkWeather = checkWeather;

	// win['id_callback'] = function () {
	//     //alert('online city id = ' + id);
	// 	loadWeatherInfo(id);
	// 	storage('cityId', id);
	// };

	function getWeather() {
		// if (localStorage && localStorage.cityId) {
		// 	//alert('from localStorage, city id = ' + localStorage.cityId);
		// 	loadWeatherInfo(localStorage.cityId);
		// }
		// else {
			// http://news.sina.com.cn/c/2014-11-07/102731109906.shtml
			// http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js
			// http://tianqi.2345.com/t/shikuang/54511.js
		  // loadScript('http://61.4.185.48:81/g/');
		  // loadScript('http://tianqi.2345.com/t/shikuang/54511.js', function () {
		  // 	var id = window.weatherinfovar.weatherinfo.cityid;
		  //   loadWeatherInfo(id);
				// storage('cityId', id);
		  // });

		  $.getScript('http://tianqi.2345.com/t/shikuang/54511.js', function () {
		    var id = window.weatherinfovar.weatherinfo.cityid;
		    city = window.weatherinfovar.weatherinfo.city;
		    loadWeatherInfo(id);
				//storage('cityId', id);
		  });

		// }
	}

	function fillWeather(w) {
		var imgSrc,
			description,
			prompt,
			today,
			tomorrow;

		if (typeof w === 'object') {
			today = w[0];
			tomorrow = w[1];

			// imgSrc = 'images/weather/' + today.code + '.png',
			imgSrc = 'http://p1.qhimg.com/d/_hao360/weather/' + today.code + '.png';

			description = '今 ' + today.status + ' ' + today.low + ' ~ ' + today.high + '℃<br />明 ' +
				tomorrow.status + ' ' + tomorrow.low + ' ~ ' + tomorrow.high + '℃<br />' + city,

			prompt = '今天白天 ' + today.status + ' ' + today.low + '~' + today.high + '℃ ' +		today.wind + '\n明天白天 ' + tomorrow.status + ' ' + tomorrow.low + '~' + tomorrow.high + '℃ ' + tomorrow.wind + '\n获取时间：' + today.date;
		}
		else {
		  imgSrc = arguments[0];
			description = arguments[1];
			prompt = arguments[2];
		}

	    $('#weather-today').attr({
			'src': imgSrc,
			'alt': description
		}).parent().attr('title', prompt);

		$('#weather-info').html(description);
		today && saveWeatherInfo(imgSrc, description, prompt/*, today.date*/);
	}

	function isNight(date) {
		// 从下午五点到次日凌晨五点，认为是晚上
		return date.getHours() >= 17 || date.getHours() <= 5;
	}
	function isFirstGetAfterNight(date) {
		if (isNight(date)) {
			if (storage('wFirstGet') === 'false') {
				return false;
			}
			storage('wFirstGet', 'false');
			//alert('_w: first get after night');
			return true;
		}
		return false;
	}

	function loadWeatherInfo(cid) {
		var timerId = 0,
			INTERVAL_MILLISECONDS = 5000,
			weatherInfo;

		cityId = cid;

		if (isNewDay(today)) {
			storage('wFirstGet', 'true');
			console.log('_w: a new day, load weather online');
		}
		else {
			console.log('_w: not a new day');
		    if (isFirstGetAfterNight(today)) {
					console.log('_w: this is the first time to get weather after night，so load weather online');
		    }
			else {
				console.log('_w: weather from localStorage');
				weatherInfo = storage('weatherInfo').split(SEPARATOR);

				//fillWeather(storage('wIconSrc'), storage('wDescription'),
					//storage('wPrompt'));
				fillWeather(weatherInfo[0], weatherInfo[1], weatherInfo[2])
				return ; // 函数退出
			}
		}
		// http://news.sina.com.cn/
		// http://php.weather.sina.com.cn/iframe/index/w_cl.php?day=2&code=js&cbf=show&city=%B1%B1%BE%A9
	    staticWthUrl = 'http://cdn.weather.hao.360.cn/sed_api_weather_info.php?code='+cid+'&v=2&param=weather&app=hao360&_jsonp=legend.cb.processWeather&t=';

		tryToLoadWeather(); // 第一次立即调用
		timerId = setInterval(function () {
		    tryToLoadWeather(timerId);
		}, INTERVAL_MILLISECONDS); // 加载 MAX_TIMES 次，每隔 INTERVAL_MILLISECONDS 毫秒
		// 有温度范围
		// http://open.onebox.so.com/dataApi?callback=jQuery1830558791354065761_1404225892215&query=%E5%8C%97%E4%BA%AC%E5%A4%A9%E6%B0%94&url=http%3A%2F%2Fcdn.weather.hao.360.cn%2Fsed_api_weather_info.php%3Fapp%3DguideEngine%26fmt%3Djson%26code%3D101020100&type=weather&src=onebox&tpl=1&_=1404225956299
	}
	function tryToLoadWeather(timerId) {
		//alert('reLoad');
		var undef,
			dynamicWthUrl = staticWthUrl + (new Date()).getTime(),
			MAX_TIMES = 2;

		tryToLoadWeather.loadTimes === undef && (tryToLoadWeather.loadTimes = 0);

		if ($('#weather-today[src*=loading]').length === 1 && tryToLoadWeather.loadTimes < MAX_TIMES) {
			$('.legend_cb_processWeather').remove();
			loadScript(dynamicWthUrl, null, 'legend_cb_processWeather');
			++tryToLoadWeather.loadTimes;
			//console.log('loading weather ' + loadTimes + ', ' + (MAX_TIMES - loadTimes) + ' times left');
		}
		else {
			 clearInterval(timerId);
			 if (tryToLoadWeather.loadTimes === MAX_TIMES) {
				 !weatherFromLastGet() && weatherError();
			 }
		}
	}
	function weatherFromLastGet() {
		var rawWeather = storage('weatherRawData');
		if (!rawWeather) { // 防止JSON.parse(undefined)抛错
			return false;
		}

	    var ws = JSON.parse(rawWeather.split(SEPARATOR)[1]).weather,
					w,
					i,
					upper = ws.length - 1, // 数据中的最后一天因为没有下一天的数据，所以舍弃
					formattedToday = formatDate(today, '-'),
					day,
					nightTemperatrue,
					tomorrow,
					tomorrowNightTemperatrue;

		for (i = 0; i < upper; ++i) {
			w = ws[i];
		    if (w.date === formattedToday) {
					day = w.info.day;
					nightTemperatrue = w.info.night[2];
					tomorrow = ws[i + 1].info.day;
					tomorrowNightTemperatrue = ws[i + 1].info.night[2];
					break;
		    }
		}

		if (i === upper) {
			return false;
		}

		fillWeather(adaptor(formattedToday, day, nightTemperatrue, tomorrow, tomorrowNightTemperatrue));
		console.log('_w: weather from the last get in localStorage');

		return true;
	}
	function adaptor(formattedDate, day, nightTemperatrue, tomorrow, tomorrowNightTemperatrue) {

		var todayObj = {
				status: day[1],
				code: day[0],
				low: nightTemperatrue,
				high: day[2],
				wind: day[4],
				date: formattedDate
			},
			tomorrowObj = {
				status: tomorrow[1],
				code: tomorrow[0],
				low: tomorrowNightTemperatrue,
				high: tomorrow[2],
				wind: tomorrow[4]
			};

		return [todayObj, tomorrowObj];
	}
	function weatherError() {
	    console.warn('天气加载失败，请确认网络是否已经连接！');
		fillWeather('images/weather/0.png', '天气加载失败', '天气加载失败，请确认网络是否已经连接！');
	}

	function saveWeatherInfo(imgSrc, description, prompt/*, date*/) {
		/*storage({
			wIconSrc: imgSrc,
			wDescription: description,
			wPrompt: prompt//,
			//wPublish: date
		});*/
		storage('weatherInfo', [imgSrc, description, prompt].join(SEPARATOR));
	}

	function checkWeather() {
		var weatherRawData = storage('weatherRawData').split(SEPARATOR);
	    //console.log('第一次获取天气的时间是：' + storage('wRetrieveTime'));
		//console.log(JSON.parse(storage('wJsonData')));
		console.log('第一次获取天气的时间是：' + weatherRawData[0]);
		console.log(JSON.parse(weatherRawData[1]));
	}

	function processWeather(w) {
		// 加计数器防止多次填充 2014/10/17 19:44
		processWeather.count = processWeather.count || 0;
		++processWeather.count;
		if (processWeather.count === 1) {
			//console.log('360天气(可以用checkWeather查看第一次获取天气的时间和JSON数据)');
			// 用于调试 - 2014/10/30 22:13
			//storage('wRetrieveTime', new Date().toLocaleString());
			//storage('wJsonData', JSON.stringify(w));
			storage('weatherRawData', new Date().toLocaleString() + SEPARATOR + JSON.stringify(w));

			var day = w.weather[0].info.day,
				nightTemperatrue = w.weather[0].info.night[2],
				tomorrow = w.weather[1].info.day,
				tomorrowNightTemperatrue = w.weather[1].info.night[2];

			fillWeather(adaptor(w.weather[0].date, day, nightTemperatrue, tomorrow, tomorrowNightTemperatrue));
		}
		else {
		    console.log('request processWeather:', processWeather.count);
		}
	}
	cb['processWeather'] = processWeather;

	/*function hoverEffect() {
		var $wpic = $('#weather-doday'), w = $wpic.width(), h = $wpic.height();
	    $('.today a').hover(function () {
	        $wpic.animate({
				'width': w * 1.05,
				'height': h * 1.05
			}, 150);
	    }, function () {
	        $wpic.animate({
				'width': w,
				'height': h
			}, 150);
	    });
	}*/

	;(function init() {
		$('#weather-today').on('error', function () {
		    this.onerror = null;
			this.src = 'images/weather/0.png';
		});
	    getWeather();
		//hoverEffect();
	}());

})();
