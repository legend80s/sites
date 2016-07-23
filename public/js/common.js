;(function ($, win, doc) {
	var legend = win.legend = win.legend || {};
	var html = legend.html = legend.html || {};

	html.loadScript = loadScript();

	function loadScript() {
	  var otherScript = doc.getElementsByTagName('script')[0];

	  return function (url, succ, cls) {
	    //console.log('load url: ' + url);
	    var script = doc.createElement("script");
	    script.async = true;

	    if (!url) {
	      return ;
	    }

	    cls && (script.className = cls);
	    
	    if (succ) {
	      script.onload = function() {              
	        succ(script);
	      }
	    }

	    script.src = url;
	    otherScript.parentNode.appendChild(script);
	  };
	}
}(jQuery, window, document));
