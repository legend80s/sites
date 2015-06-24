/*
 * _calendar.js
 * 2014/6/2
 * legend80s-bupt
 *
 * including solar terms (24节气), gregorian days and chinese traditional days (to be included)
 */

;(function () {
	// 使calendar接口public
	var win = window,
		doc = document,
		l = win.legend,
		calendar = l.calendar,
		isNewDay = l.calendar.date.isNewDay,
		loadScript = l.html.loadScript,
		makeAnchor = l.html.makeAnchor,
		makeImgStr = l.html.makeImgStr,
		storage = l.storage,
		changeBackground = l.siteTab.changeBackground,
		setBackground = l.siteTab.setBackground,
		addZero = l.number.addZero,
		SEPARATOR = '|separator|',

		_calendar = {};

	// 日期 begin
	_calendar.date = {};
	_calendar.date.today = null;
	_calendar.date.getDate = function (date) {
		//alert(date);
		date = date || new Date();
		//(date.getFullYear() > 100? date.getFullYear(): date.getFullYear()+1900)
		return date.getFullYear()+'年' + (date.getMonth()+1)+'月' + date.getDate()+'日';
	}
	_calendar.date.getWeekday = function (date) {
		date = date || new Date();
		var days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
		return days[date.getDay()];
	};
	_calendar.date.lunar = '';
	_calendar.date.getLunar = function (e){var t=function(e){this.dateObj=e!=undefined?e:new Date,this.SY=this.dateObj.getFullYear(),this.SM=this.dateObj.getMonth(),this.SD=this.dateObj.getDate(),this.lunarInfo=[19416,19168,42352,21717,53856,55632,91476,22176,39632,21970,19168,42422,42192,53840,119381,46400,54944,44450,38320,84343,18800,42160,46261,27216,27968,109396,11104,38256,21234,18800,25958,54432,59984,28309,23248,11104,100067,37600,116951,51536,54432,120998,46416,22176,107956,9680,37584,53938,43344,46423,27808,46416,86869,19872,42416,83315,21168,43432,59728,27296,44710,43856,19296,43748,42352,21088,62051,55632,23383,22176,38608,19925,19152,42192,54484,53840,54616,46400,46752,103846,38320,18864,43380,42160,45690,27216,27968,44870,43872,38256,19189,18800,25776,29859,59984,27480,21952,43872,38613,37600,51552,55636,54432,55888,30034,22176,43959,9680,37584,51893,43344,46240,47780,44368,21977,19360,42416,86390,21168,43312,31060,27296,44368,23378,19296,42726,42208,53856,60005,54576,23200,30371,38608,19415,19152,42192,118966,53840,54560,56645,46496,22224,21938,18864,42359,42160,43600,111189,27936,44448,84835],this.leapMonth=function(e){return this.lunarInfo[e-1900]&15},this.monthDays=function(e,t){return this.lunarInfo[e-1900]&65536>>t?30:29},this.leapDays=function(e){return this.leapMonth(e)?this.lunarInfo[e-1900]&65536?30:29:0},this.lYearDays=function(e){var t,n=348;for(t=32768;t>8;t>>=1)n+=this.lunarInfo[e-1900]&t?1:0;return n+this.leapDays(e)},this.Lunar=function(e){var t,n=0,r=0,i={},s=new Date(1900,0,31),o=(e-s)/864e5;i.dayCyl=o+40,i.monCyl=14;for(t=1900;t<2050&&o>0;t++)r=this.lYearDays(t),o-=r,i.monCyl+=12;o<0&&(o+=r,t--,i.monCyl-=12),i.year=t,i.yearCyl=t-1864,n=this.leapMonth(t),i.isLeap=!1;for(t=1;t<13&&o>0;t++)n>0&&t==n+1&&i.isLeap==0?(--t,i.isLeap=!0,r=this.leapDays(i.year)):r=this.monthDays(i.year,t),i.isLeap==1&&t==n+1&&(i.isLeap=!1),o-=r,i.isLeap==0&&i.monCyl++;return o==0&&n>0&&t==n+1&&(i.isLeap?i.isLeap=!1:(i.isLeap=!0,--t,--i.monCyl)),o<0&&(o+=r,--t,--i.monCyl),i.month=t,i.day=o+1,i},this.cDay=function(e,t){var n=['\u65e5','\u4e00','\u4e8c','\u4e09','\u56db','\u4e94','\u516d','\u4e03','\u516b','\u4e5d','\u5341'],r=['\u521d','\u5341','\u5eff','\u5345','\u3000'],i;e>10?i='\u5341'+n[e-10]:e===1?i='\u6b63':i=n[e],i+='\u6708';switch(t){case 10:i+='\u521d\u5341';break;case 20:i+='\u4e8c\u5341';break;case 30:i+='\u4e09\u5341';break;default:i+=r[Math.floor(t/10)],i+=n[t%10]}return i},this.solarDay2=function(){var e=new Date(this.SY,this.SM,this.SD),t=this.Lunar(e),n=this.cDay(t.month,parseInt(t.day,10));return t=null,n}},n=new t(e);return n.solarDay2()};
	_calendar.date.twelveZodiacs = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
	_calendar.date.getYearZodiac = function (d) {
		var year = (typeof d === 'number')? d: d.getFullYear(),
			index = (year - 2008) % 12;

		index < 0 && (index += 12);
		return _calendar.date.twelveZodiacs[index]; // 2008年是鼠年
	};
	// 日期 end
	// 24节气 begin
	_calendar.solar = {};

	_calendar.solar.getSolarTermIndex = function (date) {
		date = date || new Date();
		var i = 0, d = date.getDate(), m = date.getMonth();
		// 小寒 1月5日～7日 大寒 1月20日～21日
		var termStartDay = [[5, 20], [3, 18], [5, 21], [5, 19], [5, 20], [5, 20], 
			[6, 22], [7, 22], [7, 22], [8, 23], [7, 22], [6, 21]];

		i = termStartDay[m][0] <= d && d <= termStartDay[m][0] + 2 && '0' || 
			termStartDay[m][1] <= d && d <= termStartDay[m][1] + 2 && 1 || 
			3;
		
		return i;
		//return _calendar.solar.terms[m][i] || null;
	};
	// 24节气 end
	// 节日 begin
	_calendar.holidays = {};
	//_calendar.holidays.greHolidays = {};
	//_calendar.holidays.lunarHolidays = {};
	// 母亲节 5月的第2个星期日
	// 父亲节 6月的第3个星期日
	_calendar.holidays.weekHolidays = ['母亲节', '父亲节'];
	_calendar.holidays.getWeekHoliday = function (d) {
		
	};
	function getWeekHolidayDate(year, startMonth, nthSunday) {
		var nWeekDay = 7;
		var startDate = new Date(year, startMonth-1, 1);
		for (var i = 1; i <= nWeekDay; ++i) {
			startDate.setDate(i);
			if (startDate.getDay() === 0) {
				startDate.setDate(i + (nthSunday - 1) * nWeekDay);
				break;
			}
		}
		return startDate;
	}
	function getFathersDayDate(year) {
		return getWeekHolidayDate(year, 6, 3);
	}
	function getMothersDayDate(year) {
		return getWeekHolidayDate(year, 5, 2);
	}
	// 节日 end
	// 140602 - 添加日期
	function mark(str, match) {
		return str.replace(match, '<mark>$&</mark>');
	}
	function emphasize(str, match) {
		return str.replace(match, '<em>$&</em>');
	}
	
	function showDate(d) {
		//alert(d);
		var $calendar = $('#calendar');
		var dateStr = '今天是 ' + _calendar.date.getYearZodiac(d) + '年' + _calendar.date.getDate(d);
		dateStr += ' ' + _calendar.date.getWeekday(d);
		$('#date').html(emphasize(dateStr, /\d+/g));

		var lunarStr = '农历' + getLunarDate(d);
		$('#lunar-date').html(lunarStr);
	}
	// 优先级
	// 本地内存 _calendar.date.lunar
	// 从 localStorage
	// 重新计算 _calendar.date.getLunar
	function getLunarDate(d) {
		var lunarDate = _calendar.date.lunar;
		//alert('lunarDate from memory: ' + lunarDate);
		if (!lunarDate) {
			if (localStorage) {

				if (localStorage.lunarDate && !isNewDay(d)) {
					//alert('lunar date from localStorage');
					lunarDate = localStorage.lunarDate;
				}
				else {
					//alert('lunar date not in localStorage or is a new, get it from calculation function, stored it to mem and localStorage');
					lunarDate = _calendar.date.getLunar(d);
					localStorage.lunarDate = lunarDate;
				}
			}
			else {
				//alert('localStorage not supported, from calculation function');
				lunarDate = _calendar.date.getLunar(d);
			}
			//alert(' stored it to mem');
			_calendar.date.lunar = lunarDate;
		}
		return lunarDate;
	}

	function fillLunarHoliday(lunarHoliday) {
		if (!lunarHoliday) {
			return false;
		}
		// 添加 农历节日
		var poem = '';
		var $lunarDate = $('#lunar-date');
		var lunarStr = $lunarDate.html();

		lunarStr += ' ' + makeAnchor(lunarHoliday.name, lunarHoliday.url);
		$lunarDate.html(lunarStr);
		// 添加 节日图标
		if (lunarHoliday.icon) {
			$lunarDate.after(makeImgStr({
				src: lunarHoliday.icon, 
				height: '100', 
				alt: lunarHoliday.name, 
				title: lunarHoliday.name})
			);
		}
		
		// 更换为节日背景图片
		if (lunarHoliday.bgimg) {
			setBackground(lunarHoliday.bgimg);
		}
		else {
		    changeBackground(true);
			console.warn(lunarHoliday.name + '没有背景图片，改用普通背景图片');
		}
		
		var brief = lunarHoliday.brief;
		// 添加 农历节日简介
		if (brief) {
			$('#lunar').append('<p class="tl">'+makeAnchor(lunarHoliday.name, lunarHoliday.url)+'：'+lunarHoliday.brief+'</p>');
		}
		// 添加 农历节日诗词
		poem = l.html.addClassToLetter(lunarHoliday.poem, 0, 'cap');

		if (poem) {
			$('#lunar').append('<div class="lunar-poem" id="lunar-poem">' + 
				/*makeImgStr(
					{
						'src': lunarHoliday.icon, 
						'width': '32px', 
						'alt': lunarHoliday.name, 
						'title': lunarHoliday.name
					}
				) + */poem + '</div>');
			
			// hover 隐藏或显示诗词
			var $lunarPoem = $('#lunar-poem');
			$lunarPoem.hide();
			$('#lunar').hover(function () {
				//$lunarPoem.show(500);
				$lunarPoem.addClass('bottom-line');
				$lunarPoem.slideDown(500);
			},
			function () {
				//$lunarPoem.hide(500);
				$lunarPoem.removeClass('bottom-line');
				$lunarPoem.slideUp(400);
			});
		}
		localStorage && (localStorage.lunarHoliday = JSON.stringify(lunarHoliday));
		return true;
	}

	function showLunarHoliday(lunarHolidays) {
		var lunarDate = getLunarDate(_calendar.date.today);// new Date(2014,5,2) 
		//console.log('in: ' + lunarDate);
		//console.log(gLunarHolidays);
		//_calendar.holidays.lunarHolidays = gLunarHolidays
		//var lunarHoliday = calendar.holidays.lunarHolidays[lunarDate];
		//console.log(lunarHoliday);
		var lunarHoliday = lunarHolidays[lunarDate];
		return fillLunarHoliday(lunarHoliday);
	}

	function fillGreHoliday(greHoliday) {
		if (!greHoliday) {
			return false;
		}

		if (greHoliday.bgimg) {
			setBackground(greHoliday.bgimg);
		}
		else {
			console.warn('_c: ' + greHoliday.name + '没有背景图片');
			changeBackground(true);
		}
			
		$('#calendar').append('<p class="tl">' + makeAnchor(greHoliday.name, greHoliday.url) + '：' + greHoliday.brief + '</p>');
		return true;
	}

	function storeGreHoliday(greHoliday) {
		greHoliday && localStorage && (localStorage.greHoliday = JSON.stringify(greHoliday));    
	}

	function showGreHoliday(greHolidays) {
		var isTodayHoliday = false;
		var t = _calendar.date.today; // || new Date()
		//_calendar.holidays.greHolidays = gGreHolidays;
		//var greHoliday = calendar.holidays.greHolidays[t.getMonth()+1 + '' + t.getDate()] || null;
		var greHoliday = greHolidays[addZero(t.getMonth()+1) + addZero(t.getDate())] || null;

		//storeGreHoliday(greHoliday);
		return fillGreHoliday(greHoliday);
	}
	/*
	var rollPic = function () {
		var $pic = $('#no-activities img');
		var pics = ['beer.gif', 'rice.png', 'tea.png', 'toufu.png', 'zongzi.png'];
		var picCount = pics.length;
		var startIndex = Math.random() * picCount | 0;
		var finalSrc = 'img/festivals/icons/' + pics[Math.random() * picCount | 0];
		var count = 0;
		var timer = setInterval(function () {
			$pic.fadeTo(400, .2, function () {
				$pic.attr('src', 'img/festivals/icons/' + pics[startIndex]);
				startIndex = (startIndex + 1) % picCount;
				if (++count === picCount) {
					clearInterval(timer);
					$pic.attr('src', finalSrc);
				}
				$pic.fadeTo(350, 1);
			});
			
			//alert(count);
		}, 1000);
	};
	$('#no-activities').mouseenter(function () {
	   rollPic();
	});*/
	// 显示阳历、阴历节日
	// 增加两个函数 isLunarHoliday 和 isGreHoliday，只有当有节日才 load holiday-data.js
	function isLunarHoliday(d) {
		//alert('农历：' + getLunarDate(d));
		return ' 正月初一 正月十五 五月初五 七月初七 七月十五 八月十五 九月初九 十二月初八 '.indexOf(' ' + getLunarDate(d) + ' ') !== -1;
	}

	function isGreHoliday(d) {
		return ' 0101 0214 0305 0307 0308 0312 0315 0401 0405 0501 0504 0601 0701 0801 0910 1001 1031 1101 1201 1224 1225 '.indexOf(' '+addZero(d.getMonth()+1) + addZero(d.getDate())+' ') !== -1;
	}

	function showHolidaysAndSolarTerm(d) {
		//d = d || new Date();
		_calendar.date.today = d; // 缓存

		var isTodayLunarHoliday = isLunarHoliday(d), 
			isTodayGreHoliday = isGreHoliday(d),
			solarIndex = _calendar.solar.getSolarTermIndex(d),
			isSolarTerm = (solarIndex !== 3);

		if (isSolarTerm) {
			showSolarTerm(d.getMonth(), solarIndex);
		}
		
		if (!isTodayLunarHoliday && !isTodayGreHoliday) {
			if (!isSolarTerm) {
				//$('#no-activities').show();
				changeBackground(true);
			}
			//alert('no holidays, no need to load holiday-data.js');
			return ;
		}
		//alert('today is a holiday, get holiday info by load holiday-data.js');
		/*if (!isNewDay() && localStorage) {
			var greHoliday = JSON.parse(localStorage.greHoliday);
			var lunarHoliday = JSON.parse(localStorage.lunarHoliday);
			lunarHoliday && fillLunarHoliday(lunarHoliday);
			greHoliday && fillGreHoliday(greHoliday);
		}*/
		loadScript('js/data/holiday-data.js'/*, function () {
			showLunarHoliday();
			//alert('isTodayLunarHoliday ? ' + isTodayLunarHoliday);
			showGreHoliday();
			//if (!isTodayLunarHoliday && !isTodayGreHoliday && !isSolarTerm) {
				//$('#no-activities').show();
				//rollPic();
			//}
		}*/);
	}
	function showSolarTerm(month, index) {
		var localSolarTerm;
		
		if (isNewDay(_calendar.date.today)) {
			console.log('_c: new day load 24jieqi.js and clear the "solarTerm" from localStrorage');
			storage('solarTerm', '');
			loadScript('js/data/24jieqi.js', function () {
				fillSolarTerm(month, index);
			});
		}
		else {
			localSolarTerm = (storage('solarTerm') || '').split(SEPARATOR);
			if (localSolarTerm.length === 2) {
				console.log('_c: not new day, solar term from localStorage');
				
				setBackground(localSolarTerm[0]);
				
				$('#term')[0].innerHTML = localSolarTerm[1];
				hoverSolarTerm();
			}
			else {

			    console.log('_c: not new day but "solarTerm" is empty, so load 24jieqi.js');

				loadScript('js/data/24jieqi.js', function () {
					fillSolarTerm(month, index);
				});
			}
		}

		//console.log(isNewDay);
		
	}
	function fillSolarTerm(month, index) {
		var term = legend.calendar.solar.terms[month][index],
			poem = legend.calendar.solar.poem,
			html;
		
		setBackground(term.bgimg);
		//alert(term.bgimg);

		html = '<p class="solar-term">'+'二十四节气之'+
			makeAnchor(term.name, term.url||'javascript:void(0);')+'<br/>'+
			mark(term.brief, term.name)+'...</p>';

		if (month !== 0) {
			poem[month-1] = '<mark>' + poem[month-1] + '</mark>';
		}
		else {
			poem[11] = '<mark>' + poem[11] + '</mark>';
		}
		

		html += '<p class="solar-poem" id="solar-poem">'+poem.join('<br />')+'</p>';
		$('#term')[0].innerHTML = html;
		
		hoverSolarTerm();
		storage('solarTerm', term.bgimg + SEPARATOR + html);
	}
	function hoverSolarTerm() {
	    var $poem = $('#solar-poem');

		$('#term').hover(
			function () {
				$poem.slideDown(500);
			},
			function () {
				$poem.slideUp(400);
		});
	}	

	;(function init() {
		//$('#calendar').append('<p class='date' id='date'></p><div id='lunar'><p class='lunar-date' id='lunar-date'>查询中...</p></div><div id='term'></div>');
		$('#no-activities').hide();
		var today = new Date(); // 2014,5,2
		
		// 回调函数
		var holidays = calendar.holidays;
		holidays || (holidays = calendar.holidays = {});
		holidays.showLunarHoliday = showLunarHoliday;
		holidays.showGreHoliday = showGreHoliday;

		showDate(today);
		showHolidaysAndSolarTerm(today);
	})();

}());