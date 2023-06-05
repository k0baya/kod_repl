kodReady.push(function(){
	if('{{config.open}}' == '0') return;
	Events.bind('editor.tab.add',function(editor){
		requireAsync('{{pluginHost}}static/code-blast.js',function(cc){
			codeBlastAce(ace);
			var effect = parseInt('{{config.style}}');
			var shakeTimes = parseInt('{{config.shakeTimes}}');
			editor.setOption('blastCode',{effect:effect,shakeTimes:shakeTimes});
		});
	});
});