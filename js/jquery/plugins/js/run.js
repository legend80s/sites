;(function () {
	// pageView - 2014/8/30 19:55
	var legend = window.legend,
		addBottomVideoByPage = legend.cb.addBottomVideoByPage;

	$('#page-box').pageView({
		'count': 6,
		'onchange': function (page) {
			addBottomVideoByPage(page);
		}
	});

	// setNumber - 2014/11/14 13:28
	var news = legend.tab.news,
		storage = legend.storage,
		cur = Number(storage('_news_display_count')) || 4;

	news.setRequestNumber(cur);

	$('#news-number-settings').setNumber({
		text1: '新闻条数: ',
		current: cur,
		onchange: function (number) {
			//console.log('设置新闻条数为：' + number);
			if (news.getRequestNumber() !== number) {
				//news.load(number);
				news.setRequestNumber(number);
			}
			storage('_news_display_count', number);
		}
	});

	// drawer - 2014/12/25
	$('#jquery-drawer-tvs').drawer({
		links: [
			{ name: 'IPv6清华大学', href: 'http://www.cernet2.edu.cn/resource/ipv6-shi-pin-dian-bo/' },
			{ name: 'IPv6之家', href: 'http://www.ipv6bbs.com/wall.php' },
			{ name: 'IPv6北京大学', href: 'http://ipv6.pku.edu.cn/' },
			{ name: 'IPv6北邮', href: 'http://iptv.bupt.edu.cn/' },
			// 'http://tv.byr.cn/'
			{ name: 'TPTV网页版', href: 'network/IPTV网页.html'}
		],
		addable: true
	});

	$('#jquery-drawer-blogs').drawer({
		links: [
			{ name: '外刊IT评论', href: 'http://www.vaikan.com/' },
			{ name: 'ITeye', href: 'http://www.iteye.com/' }
		],
		addable: true
	});

	$('#jquery-drawer-alibaba').drawer({
		links: [
			{ name: '内外', href: 'https://work.alibaba-inc.com/' },
			{ name: '周报', href: 'https://work.alibaba-inc.com/sns/workreportModify#!rep/modify/send' },
			{ name: '邮件', href: 'https://webmail.alibaba-inc.com/alimail/' }
		],
		addable: true
	});

}());
