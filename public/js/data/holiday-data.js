/*
 * holiday-data.js
 * 公立和农历节日
 * 2014/12/1 18:05
 * 2014/12/1 18:22 减少全局变量
 * 加入内嵌回调函数 showLunarHoliday 因为loadScript回调不给力
 */

;(function (win) {
	var holidays = win.legend.createNS('calendar.holidays'),
		path = 'images/background/festivals/';

	holidays.lunarHolidays = {
		'正月初一' : {name: '春节', brief: '春节 (The Spring Festival)，俗称“过年”，是我国民间最隆重、最热闹的一个传统节日。中国古时候有一种叫"年"的怪兽，头长触角，凶猛异常。"年"长年深居海底，每到除夕才爬上岸，吞食牲畜伤害百姓...', url: 'http://baike.baidu.com/view/20424.htm#2_1', icon: path + 'reverse-fu.png', poem: '爆竹声中一岁除 春风送暖入屠苏<br/>千门万户瞳瞳日，总把新桃换旧符<p class="sign">——(宋)王安石 元日 </p>', bgimg: path + 'chunjie-02.jpg'},

		'正月十五' : {name: '元宵节', brief: '元宵节(The Lantern Festival)中国一个重要的传统节日。正月十五日是一年中第一个月圆之夜，也是一元复始，大地回春的夜晚，人们对此加以庆祝，也是庆贺新春的延续，因此又称“上元节”...', url: 'http://baike.baidu.com/view/20424.htm#3_2', icon: path + 'jiaozi-01.png', poem: '去年元夜时，花市灯如昼<br/>月到柳梢头，人约黄昏后<br/>今年元夜时，月与灯依旧<br/>不见去年人，泪湿春衫袖。', bgimg: path+'yuanxiaojie.jpg'},

		'五月初五' : {name: '端午节', brief: '端午节(Dragon Boat Festival)，是中国一个古老的传统节日。传说屈原死后，楚国百姓哀痛异常，纷纷涌到汨罗江边去凭吊屈原...', url: 'http://baike.baidu.com/subview/2567/5060532.htm?fr=aladdin', icon: path + 'chinese-rice-pudding.png', poem: '梅霖初歇乍绛蕊海榴, 争开时节<br/>角黍包金, 香蒲切玉<br/>是处玳筵罗列<br/>斗巧尽输少年, 玉腕彩丝双结<br/>舣彩舫, 看龙舟两两<br/>波心齐发, 奇绝<br/>难画处, 激起浪花, 飞作湖间雪<br/>画鼓喧雷, 红旗闪电<br/>夺罢锦标方彻<br/>望中水天日暮, 犹见朱帘高揭<br/>归棹晚, 载菏花十里, 一钩新月<br/><p class="sign">——(宋)黄裳 喜迁莺 </p>', bgimg: path + 'duanwujie-01.jpg'},

		'七月初七' : {name: '七夕节', brief: '七夕节(July 7th day or Chinese Valentine\'s Day)，阴历七月七日的晚上称“七夕”。中国民间传说牛郎织女此夜在天河鹊桥相会。所谓乞巧，即在月光对着织女星用彩线穿针，如能穿过七枚大小不同的针眼，就算很“巧”了...', url: 'http://baike.baidu.com/view/20424.htm#2_7', icon: path + 'July-7th-day.png', poem: '纤云弄巧, 飞星传恨<br/>银汉迢迢暗渡<br/>金风玉露一相逢, 便胜却人间无数<br/>柔情似水, 佳期如梦, 忍顾鹊桥归路<br/>两情若是长久时, 又岂在朝朝暮暮<br><p class="sign">——(宋)秦观 鹊桥仙</p>', bgimg: path + 'qixijie-03.jpg'},

		'七月十五' : {name: '中元节', brief: '中元节(Spirit Festival)，在农历七月十五日，俗称七月半。传说该日地府放出全部鬼魂，民间普遍进行祭祀鬼魂的活动。凡有新丧的人家，例要上新坟，而一般在地方上都要祭孤魂野鬼，所以，它整个儿是以祀鬼为中心的节日，成了中国民间最大的鬼节...', url: 'http://baike.baidu.com/view/57902.htm', icon: '', poem: '南阳太守清狂发，未到中秋先赏月。<br/>百花洲里夜忘归，绿梧无声露光滑。<br/>天学碧海吐明珠，寒辉射宝星斗疏。<br/>西楼下看人间世，莹然都在清玉壼。<br/>从来酷署不可避，今夕凉生岂天意。<br/>一笛吹销万里云，主人高歌客大醉。<br/>客醉起舞逐我歌，弗歌弗舞如老何。<br/><p class="sign">——(宋)范仲淹《中元夜百花洲作》</p>', bgimg: ''},

		'八月十五' : {name: '中秋节', brief: '中秋节(the Mid-autumn Festival)，阴历八月十五日，这一天正当秋季的正中，故称“中秋”。到了晚上，月圆桂香，旧俗人们把它看作大团圆的象征，要备上各种瓜果和熟食品，是赏月的佳节。中秋节还要吃月饼...', url: 'http://baike.baidu.com/view/20424.htm#2_8', icon: path + 'moon_cake1.jpg', poem: '明月几时有？把酒问青天。<br/>不知天上宫阙，今夕是何年。<br/>我欲乘风归去，又恐琼楼玉宇，高处不胜寒。<br/>起舞弄清影，何事长向别时圆？<br/>人有悲欢离合，月有阴晴圆缺，此事古难全。<br/>但愿人长久，千里共婵娟。<br/><p class="sign">——(宋)苏东坡《水调歌头》</p>', bgimg: ''},

		'九月初九' : {name: '重阳节', brief: '重阳节(The Double Ninth Festival)，又称“老人节”。因为《易经》中把“六”定为阴数，把“九”定为阳数，九月九日，日月并阳，两九相重，故而叫重阳，也叫重九...', url: 'http://baike.baidu.com/view/2572.htm?', icon: '', poem: '独在异乡为异客，每逢佳节倍思亲。<br/>遥知兄弟登高处，遍插茱萸少一人<br/><p class="sign">——(唐)王维《九月九日忆山东兄弟》</p>', bgimg: ''},

		'阳历节日' : {name: '冬至', brief: "每年的四月一日，是西方的民间传统节日——愚人节(April Fool's Day)，也称万愚节。对于它的起源众说纷纭：一种说法认为这一习俗源自印度的“诠俚节”。该节规定，每年三月三十一日的节日这天，不分男女老幼，可以互开玩笑、互相愚弄欺骗以换得娱乐...", url: 'http://baike.baidu.com/subview/1710/13219647.htm#viewPageContent', icon: '', poem: '一九二九不出手；三九四九冰上走；<br/>五九六九沿河看柳；七九河开八九雁来；<br/>九九加一九，耕牛遍地走。<br/>p class="sign">——九九歌</p>', bgimg: ''},

		'十二月初八' : {name: '腊八节', brief: '腊八节(The Laba Rice Porridge Festival)，俗称“腊八”。汉族传统节日，民间流传着吃“腊八粥”，泡腊八蒜(有的地方是“腊八饭”)的风俗。在河南等地，腊八粥又称“大家饭”，是纪念民族英雄岳飞的一种节日食俗...', url: 'http://baike.baidu.com/view/22439.htm', icon: '', poem: '腊月八日粥，传自梵王国。<br/>七宝美调和，五味香糁入。<br/>用以供伊蒲，籍之作功德...<br/><p class="sign">——(清)李福 腊八粥</p>', bgimg: path+'labajie.jpg'},

		/*'51' : {name: '小年', brief: "国际劳动节又称“五一国际劳动节”、“国际示威游行日”(International Workers' Day或者May Day)，是世界上80多个国家的全国性节日。定在每年的五月一日。它是全世界劳...", url: 'http://baike.baidu.com/subview/15128/11122908.htm', icon: '', poem: '', bgimg: ''},

		'54' : {name: '除夕', brief: '五四青年节源于中国1919年反帝爱国的“五四运动”，五四爱国运动是一次彻底的反对帝国主义和封建主义的爱国运动，也是中国新民主主义革命的开始...', url: 'http://baike.baidu.com/view/27635.htm?from_id=456321&type=syn&fromtitle=%E9%9D%92%E5%B9%B4%E8%8A%82&fr=aladdin', icon: '', poem: '', bgimg: ''}*/
	};
	// 提供回调函数
	holidays.showLunarHoliday(holidays.lunarHolidays);
	// 阳历节日
	holidays.greHolidays = {
		'0101' : {name: '元旦节', brief: '元旦，中国节日，即世界多数国家通称的“新年”，是公历新一年开始的第一天。“元旦”一词最早出现于《晋书》...', url: 'http://baike.baidu.com/view/3116.htm', icon: '', poem: '', bgimg: path + 'yuandan.jpg'},
		'0214' : {name: '情人节', brief: '情人节又叫圣瓦伦丁节或圣华伦泰节，即每年的2月14日，是西方的传统节日之一。这是一个关于爱、浪漫以及花、巧克力、贺卡的节日，男女在这一天互送礼物用以表达爱意或友好...', url: 'http://baike.baidu.com/subview/2533/7683709.htm', icon: '', poem: '', bgimg: ''},
		'0305' : {name: '学雷锋纪念日', brief: '学雷锋纪念日是为了纪念雷锋叔叔助人为乐的精神,为了发扬这个精神,把每年的3月5日定为学雷锋纪念日。在这天,大家都可以向有需要帮助的人伸出援手...', url: 'http://baike.baidu.com/view/165596.htm', icon: '', poem: '', bgimg: ''},
		'0307' : {name: '女生节', brief: '女生节，起源于20世纪90年代初，由山东大学发起，后发展于中国各高校，是一个关爱女生、展现高校女生风采的节日，通过开展高品位、高格调的人文活动，引导女生关注自身思想素质...', url: 'http://baike.baidu.com/view/710408.htm', icon: '', poem: '', bgimg: ''},
		'0308' : {name: '妇女节', brief: '国际劳动妇女节的全称是“联合国妇女权益和国际和平日”，在中国又称“国际妇女节”、“三八节”和“三八妇女节”。从1909年3月8日，美国芝加哥妇女争取“男女平等”游行集会以...', url: 'http://baike.baidu.com/view/328605.htm', icon: '', poem: '', bgimg: path+'funvjie.jpg'},
		'0312' : {name: '植树节', brief: '中国植树节定于每年的3月12日，是中国为激发人们爱林、造林的热情，促进国土绿化，保护人类赖以生存的生态环境，通过立法确定的节日...', url: 'http://www.baidu.com/link?url=Cyp6QR2MZjMtCvytTkt_doa-WrEVDyBIDtUFe17EOv5FFt6TsWhxl845DwCENKo_', icon: '', poem: '', bgimg: path+'zhishujie.jpg'},
		'0315' : {name: '消费者权益日', brief: '每年的3月15日是“国际消费者权益日” (World Consumer Rights Day) ，由国际消费者联盟组织于1983年确定，目的在于扩大消费者权益保护的宣传...', url: 'http://baike.baidu.com/view/2552.htm', icon: '', poem: '', bgimg: ''},
		'0401' : {name: '愚人节', brief: '每年的四月一日，是西方的民间传统节日——愚人节(April Fool\'s Day)，也称万愚节。对于它的起源众说纷纭：一种说法认为这一习俗源自印度的“诠俚节”。该节规定，每年三月三十一日的节日这天，不分男女老幼，可以互开玩笑...', url: 'http://baike.baidu.com/subview/1710/13219647.htm#viewPageContent', icon: '', poem: '', bgimg: path+'April-Fools-Day.jpg'},
		'0405' : {name: '清明节', brief: '清明节又叫踏青节，在仲春与暮春之交，也就是冬至后的第108天。是中国传统节日，也是最重要的祭祀节日之一，是祭祖和扫墓的日子。中国汉族传统的清明节大约始于周代，距今已有二千五百多年的历史...', url: 'http://baike.baidu.com/view/3148.htm', icon: '', poem: '', bgimg: ''},
		'0501' : {name: '劳动节', brief: '国际劳动节又称“五一国际劳动节”、“国际示威游行日”(International Workers\' Day或者May Day)，是世界上80多个国家的全国性节日。定在每年的五月一日。它是全世界劳...', url: 'http://baike.baidu.com/view/44253.htm', icon: '', poem: '', bgimg: path+'May1st.jpg'},
		'0504' : {name: '五四青年节', brief: '五四青年节源于中国1919年反帝爱国的“五四运动”，五四爱国运动是一次彻底的反对帝国主义和封建主义的爱国运动，也是中国新民主主义革命的开始...', url: 'http://baike.baidu.com/view/27635.htm', icon: '', poem: '', bgimg: ''},
		'0601' : {name: '儿童节', brief: '国际儿童节(又称儿童节，International Children\'s Day)定于每年的6月1日。为了悼念利迪策惨案和全世界所有在战争中死难的儿童，反对虐杀和毒害儿童，以及保障儿童权利...', url: 'http://baike.baidu.com/view/16194.htm', icon: '', poem: '', bgimg: ''},
		'0701' : {name: '建党节, 香港回归日', brief: '1921年盛夏的一个晚上，上海法租界望志路106号一幢砖木结构的两层小楼里，透出明亮的灯光，一张长方桌周围13位代表在开会。他们代表着全国50多名党员，成就了中国历史上开天辟地的大事件...', url: 'http://baike.baidu.com/view/108833.htm', icon: '', poem: '', bgimg: ''},
		'0801' : {name: '建军节', brief: '每年的八月一日是中国人民解放军建军纪念日，因此也叫“八一”建军节。1933年7月11日，中华苏维埃共和国临时中央政府根据中央革命军事委员会6月30日的建议，决定8月1日为中国工...', url: 'http://baike.baidu.com/view/27204.htm', icon: '', poem: '', bgimg: ''},
		'0910' : {name: '教师节', brief: '尊师重教是中国的优良传统，早在公元前11世纪的西周时期，就提出“弟子事师，敬同于父”。教师节，旨在肯定教师为教育事业所做的贡献。1985年，第六届全国人大常委会第九次会议...', url: 'http://baike.baidu.com/view/25833.htm', icon: '', poem: '', bgimg: ''},
		'1001' : {name: '国庆节', brief: '也称国庆日、国庆纪念日，是指由一个国家制定的用来纪念国家本身的法定节日，通常是这个国家的独立、宪法的签署、或其他有重大意义的周年纪念日。在这个日子里国家都会举行各种各样的庆典活动。在中国，国庆节特指中华人民共和国正式宣告成立的10月1日...', url: 'http://baike.baidu.com/view/14446.htm?fr=aladdin', icon: '', poem: '', bgimg: ''},
		'1031' : {name: '万圣节前夕', brief: 'Trick or Treat，万圣夜的象征物是南瓜灯(也叫杰克灯、杰克灯笼)，另外还有南瓜雕空当灯笼的故事。这又是源于古代爱尔兰。故事是说一个名叫杰克(英文：JACK) 的人，是个醉汉且爱恶作剧。一天杰克 把恶魔骗上了树，随即在树桩上刻了个十字...', url: 'http://baike.baidu.com/subview/253689/11311718.htm', icon: '', poem: '', bgimg: path + 'halloween-sogou.jpg'},
		'1101' : {name: '万圣节', brief: '万圣节源自古代凯尔特民族(Celtic)的新年节庆，此时也是祭祀亡魂的时刻，在避免恶灵干扰的同时，也以食物祭拜祖灵及善灵以祈平安渡过严冬。当晚小孩会穿上化妆服，戴上面具，挨家挨户收集糖果...', url: 'http://baike.baidu.com/subview/2532/6892077.htm?fr=aladdin', icon: '', poem: '', bgimg: ''},
		'1201' : {name: '世界爱滋病日', brief: '为提高人们对艾滋病的认识，世界卫生组织于1988年1月将每年的12月1日定为世界艾滋病日，号召世界各国和国际组织在这一天举办相关活动，宣传和普及预防艾滋病的知识。2011年11月...', url: 'http://www.baidu.com/link?url=3s5Evfq3vXP8et186kT0FMAFeGOc7zqtT4PHE81zZccsVaTGtYoB6suNX5VxUxEM', icon: '', poem: '', bgimg: ''},
		'1224' : {name: '平安夜', brief: '圣诞节前夕也就是俗说的平安夜，当晚，全家人会团聚在客厅中，围绕在圣诞树旁唱圣诞歌曲，互相交换礼物，彼此分享一年来生活中的喜怒哀乐，表达内心的祝福及爱...', url: 'http://baike.baidu.com/subview/28259/7303348.htm?fr=aladdin', icon: '', poem: '', bgimg: path + 'christmas_eve.jpg'},
		'1225' : {name: '圣诞节', brief: '圣诞节(Christmas)又称耶诞节，译名为“基督弥撒”，西方传统节日，在每年12月25日。弥撒是教会的一种礼拜仪式。圣诞节是一个宗教节，因为把它当作耶稣的诞辰来庆祝，故名“...', url: 'http://baike.baidu.com/view/2547.htm?fr=aladdin', icon: '', poem: '', bgimg: path + 'christmas.jpg'}
	};	
	holidays.showGreHoliday(holidays.greHolidays);

}(window));

