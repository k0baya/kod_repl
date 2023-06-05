kodReady.push(function(){
	var name = '{{package.name}}';
	Events.bind('main.menu.loadBefore',function(listData){ //添加到左侧菜单栏
		listData['{{package.id}}'] = {
			name:name,
			url:'{{pluginHost}}lib/',
			subMenu:'{{config.menuSubMenu}}',
			target:'{{config.openWith}}',
			icon:'ri-terminal-box-fill bg-grey-10'
		}
	});
	Router.mapIframe({page:name,title:name,url:'{{pluginHost}}lib/',ignoreLogin:false});
	Router.mapIframe({page:'zhongduan',title:name,url:'{{pluginHost}}lib/',ignoreLogin:false});
});