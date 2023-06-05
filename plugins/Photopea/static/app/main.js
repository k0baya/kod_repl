kodReady.push(function(){
	Events.bind('explorer.kodApp.before',function(appList,parentView){
		if(parentView && parentView.sharePage) return;
		appList.push({
			name:'{{package.id}}',
			title:'{{package.name}}',
			ext:"{{config.fileExt}}",
			sort:"{{config.fileSort}}",
			icon:'{{pluginHost}}static/images/icon.png',
			callback:function(){
				core.openFile('{{pluginApi}}',"{{config.openWith}}",_.toArray(arguments));
			}
		});
	});
	Events.bind('explorer.lightApp.load',function(listData){
		listData['{{package.id}}'] = {
			name:"{{package.menu}}",
			desc:"{{package.description}}",
			category:"{{package.category}}",
			appUrl:'{{pluginApi}}',
			openWith:"{{config.openWith}}",
			icon:'{{pluginHost}}static/images/icon.png'
		}
	});
	
	Router.mapIframe({page:'{{package.id}}',title:'{{package.name}}',url:'{{pluginApi}}',ignoreLogin:1});
	Events.bind('main.menu.loadBefore',function(listData){ //添加到左侧菜单栏
		listData['{{package.id}}'] = {
			name:"{{package.menu}}",
			url:'{{pluginApi}}',
			subMenu:'{{config.menuSubMenu}}',
			menuAdd:'{{config.menuAdd}}',
			target:'{{config.openWith}}',
			icon:'{{pluginHost}}static/images/icon.png'
		}
	});
	
	// 新建处理;
	// Events.bind('rightMenu.newFileAdd',function(menuList){
	// 	menuList.push({type:'psd',name:'psd Photopea',createOpen:1,appName:appName});
	// });
});
