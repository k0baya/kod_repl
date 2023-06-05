kodReady.push(function(){
	if($.supportFlash()) return;
	if($.hasKey('createFlash')) return;
	$.createFlash = function(file,flashvars){
		if(!$.hasKey('createFlashLoad')){
			requireAsync('{{pluginHost}}static/ruffle/ruffle.js',function(){});
		}
		var uuid = 'swf_'+UUID();
		var html = '<object type="application/x-shockwave-flash" id="'+uuid+'"\
			data="'+file+'" width="100%" height="100%" tabindex="-1" >\
			<param name="movie" value="'+file+'"/>\
			<param name="allowfullscreen" value="true" />\
			<param name="allowscriptaccess" value="always" />\
			<param name="allowScriptAccess" value="always" />\
			<param name="flashvars" value="'+(flashvars||'')+'" />\
			<param name="wmode" value="transparent" />\
		</object>';
		setTimeout(function(){
			var $view = $('#'+uuid);
			if(!$view.length) return;
			var tips = Tips.loadingMask($view.parent());
			setTimeout(function(){
				tips.close();
			},600);
		},0);
		return html;
	}
});
