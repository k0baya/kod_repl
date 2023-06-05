kodReady.push(function(){
	Events.bind('explorer.kodApp.before',function(appList){
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
		kodApp.appSupportSet('aceEditor','drawio,pos,vsd,vsdx,vdx,graphml');
	});
	Events.bind('explorer.lightApp.load',function(listData){
		listData['{{package.id}}'] = {
			name:"{{package.name}}",
			desc:"{{package.description}}",
			category:"{{package.category}}",
			appUrl:'{{pluginApi}}',
			openWith:"{{config.openWith}}",
			icon:'{{pluginHost}}static/images/icon.png'
		}
	});

		
	// 新建处理;
	Events.bind('rightMenu.newFileAdd',function(menuList){
		menuList.push({type:'drawio',name:'{{package.name}}',createOpen:1,appName:'{{package.id}}'});
	});
	Router.mapIframe({page:'{{package.id}}',title:'{{package.name}}',url:'{{pluginApi}}',ignoreLogin:1});
	Events.bind('main.menu.loadBefore',function(listData){ //添加到左侧菜单栏
		listData['{{package.id}}'] = {
			name:"{{package.menu}}",
			url:'{{pluginApi}}',
			target:'{{config.openWith}}',
			subMenu:'{{config.menuSubMenu}}',
			menuAdd:'{{config.menuAdd}}',
			icon:'{{pluginHost}}static/images/icon.png'
			// icon:'ri-organization-chart bg-yellow-6'
		}
	});
	
	Events.bind('aceEditor.fileOpenModeInit',function(modeList){
		var xml = 'drawio,vsd,vsdx,vdx,graphml'
		modeList.xml = modeList.xml ? modeList.xml + ','+xml:xml;
		modeList.json = modeList.json ? modeList.json + ',pos':'pos';
	});
	$.addStyle("\
	.x-item-icon.x-pos{background-image:url('{{staticPath}}images/file_icon/icon_app/on.png');}\
	.x-item-icon.x-xmind{background-image:url('{{pluginHost}}static/images/xmind.png');}\
	.x-item-icon.x-graphml{background-image:url('{{pluginHost}}static/images/graphml.png');}\
	.x-item-icon.x-drawio{background-image:url('{{pluginHost}}static/images/icon.png');}\
	");
});
