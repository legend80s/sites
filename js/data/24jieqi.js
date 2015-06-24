/*
 * 24jieqi.js
 * 2014/11/22 20:52
 * legend80s-bupt
 * 当今天是24节气之一时，为calendar.js提供有关24节气的数据
 */

;(function () {
	var calendar = window.legend.calendar = window.legend.calendar || {},
		solar = calendar.solar = calendar.solar || {},
		poem,
		PATH = 'images/background/24jieqi/';

	solar.poem = [
		'立春梅花分外艳，雨水红杏花开鲜', '惊蛰芦林闻雷报，春分蝴蝶舞花间',
		'清明风筝放断线，谷雨嫩茶翡翠连', '立夏桑果象樱桃，小满养蚕又种田', 
		'芒种玉秧放庭前，夏至稻花如白练', '小暑风催早豆熟，大暑池畔赏红莲',
		'立秋知了催人眠，处暑葵花笑开颜', '白露燕归又来雁，秋分丹桂香满园', 
		'寒露菜苗田间绿，霜降芦花飘满天', '立冬报喜献三瑞，小雪鹅毛片片飞',
		'大雪寒梅迎风狂，冬至瑞雪兆丰年', '小寒游子思乡归，大寒岁底庆团圆'
	];

	poem = solar.poem; // 中间变量

	solar.terms = [
		[{name: '小寒', brief: poem[11], url:'http://baike.baidu.com/view/25902.htm', icon: '', bgimg: PATH+'xiaohan.jpg'},{name: '大寒', brief: poem[11], url:'http://baike.baidu.com/view/25921.htm', icon:'', bgimg: PATH+'dahan.jpg'}],
		[{name: '立春', brief: poem[0], url:'http://baike.baidu.com/view/25702.htm', icon:'', bgimg: PATH+'lichun.jpg'}, {name: '雨水', brief: poem[0], url:'http://baike.baidu.com/view/10790.htm', icon:'', bgimg: PATH+'yushui.jpg'}],
		[{name: '惊蛰', brief: poem[1], url:'', icon:'', bgimg: PATH+'jingzhe2.jpg'}, {name: '春分', brief: poem[1], url:'', icon:'', bgimg: PATH+'chunfen.jpg'}],
		[{name: '清明', brief: poem[2], url:'http://baike.baidu.com/view/294.htm', icon:'', bgimg: PATH+'qingming.jpg'}, {name: '谷雨', brief: poem[2], url:'', icon:'', bgimg: PATH+'guyu.jpg'}],
		[{name: '立夏', brief: poem[3], url:'', icon:'', bgimg: PATH+'lixia.jpg'}, {name: '小满', brief: poem[3], url:'', icon:'', bgimg: PATH+'xiaoman.jpg'}],
		[{name: '芒种', brief: poem[4], url:'', icon:'', bgimg: PATH+'mangzhong.jpg'}, {name: '夏至', brief: poem[4], url:'', icon:'', bgimg:PATH+'xiazhi.png'}],
		[{name: '小暑', brief: poem[5], url:'', icon:'', bgimg:PATH+'xiaoshu.png'}, {name: '大暑', brief: poem[5], url:'', icon:'', bgimg:PATH+'dashu.jpg'}],
		[{name: '立秋', brief: poem[6], url:'', icon:'', bgimg:PATH+'liqiu.png'}, {name: '处暑', brief: poem[6], url:'', icon:'', bgimg:PATH+'chushu.jpg'}],
		[{name: '白露', brief: poem[7], url:'', icon:'', bgimg:PATH+'bailu.jpg'}, {name: '秋分', brief: poem[7], url:'', icon:'', bgimg:PATH+'qiufen.jpg'}],
		[{name: '寒露', brief: poem[8], url:'', icon:'', bgimg:PATH+'hanlu.jpg'}, {name: '霜降', brief: poem[8], url:'', icon:'', bgimg:PATH+'shuangjiang.jpg'}],
		[{name: '立冬', brief: poem[9], url:'', icon:'', bgimg:PATH+'lidong.jpg'}, {name: '小雪', brief: poem[9], url:'', icon:'', bgimg:PATH+'xiaoxue.jpg'}],
		[{name: '大雪', brief: poem[10], url:'', icon:'', bgimg:PATH+'daxue.jpg'},{name: '冬至', brief: poem[10], url:'', icon:'', bgimg:PATH+'dongzhi.jpg'}]
	];

}());
