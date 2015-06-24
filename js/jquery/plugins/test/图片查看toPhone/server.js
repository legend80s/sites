/*
 * server.js
 * 2015/1/13
 * 驱动imageViewer.html
 */

;(function () {
    var http = require('http'),
		fs = require('fs'),
		path = require('path'),
		extname = path.extname,
		
		tempPort = process.argv[2],
		port = typeof tempPort === 'undefined'? 80: tempPort,

		indexHTML = 'imageViewer.html',
		file,
		contentTypes = {
			'.html': 'text/html; charset=utf-8',
			'.css': 'text/css; charset=utf-8',
			'.js': 'application/javascript; charset=utf-8'
		},
		contentType,
		header,
		pathName,
		cache = {};

	http.createServer(function (req, res) {
		/* 
			/
			/css/imageViewer.css
			/css/pager.css
			/js/jquery/jquery-1.11.0.min.js
			/js/frms/angular-1.2.23.min.js
			/js/jquery/plugins/pager.js
			/js/imageViewer.js
			/favicon.ico
		*/
		//console.log(req.url);
		pathName = req.url;
		file = 'public' + (pathName === '/'? '/'+indexHTML: pathName);
		
		contentType = contentTypes[path.extname(file)];

		//console.log('MIME TYPE for: ', path.basename(file), contentType);
		header = contentType? {
			'Content-Type': contentType, 
			'Cache-Control': 'max-age=3600'
		}: {
			'Cache-Control': 'max-age=3600'
		};

		serveStatic(res, file, header);

	}).listen(port, function () {
	    console.log('Server running at http://127.0.0.1:'+ port +'/');
	});
	
	
	// functions 
	function serveStatic(res, file, header) {

		if (cache[file]) {
			console.log('\nfrom cache: ' + file);
			sendFile(res, cache[file], header);
			return ;
		}

	    fs.readFile(file, function (err, content) {

			if (err) {
				send404(res, file, header);
			}
			else {
				sendFile(res, content, header);
				cache[file] = content;
				console.log('cache file: ' + file);
			}

		});
	}

	function send404(res, file, header) {
	    res.writeHead(404, header);
		res.end(file + ': no such file\n');
		console.log(file + ': no such file\n');
	}

	function sendFile(res, content, header) {
	    res.writeHead(200, header);
		res.end(content);
	}
}());
/*

And you must made `fs.readFile` wrapped by a closure, otherwise some file (especially the last file) will be read more than once, and others will not be read at all. And the `contentType`will not be set as you wish. This is because of the callback strategy used by `fs.readFile`. The problem does not appear when the html file just load one external file, but as the external files(css, js, png) loaded more than one it will appear as i pointed out above. (I came upoon this by myself)

So your code should make a little change as follows:

    ;(function (filename, contentType) {

	    fs.readFile(filename, function(err, file) {
		    // do the left stuff here
	    });

    }(filename, contentType)); 
*/