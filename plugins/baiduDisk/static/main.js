kodReady.push(function(){
	var staticPath = "{{pluginHost}}static/";
	// var version = '?v={{package.version}}';

	var baiduPkg = {};
	Events.bind('storage.init.load', function(self){
		requireAsync(staticPath+'package.js', function(package){
			baiduPkg = package;
		});
		// 添加菜单
		var key = 'baidu';
		if(_.isUndefined(self.typeList[key])) {
			self.typeList[key] = '百度网盘';
			self.iconList[key] = '<i class="path-ico name-kod-baidu"><img src="{{pluginHost}}static/images/icon.png"></i>';
		}
	});
	// 存储form赋值
	Events.bind('storage.config.form.load', function(type, formData){
		if(type != 'baidu') return;
		_.extend(formData, $.objClone(baiduPkg));
	});
	Events.bind('storage.config.view.load', function(self, type, action){
		if(type != 'baidu') return;
		// 开启授权
		self.formMaker.$("[name='auth']").click(function(){
			var canOpen = true;
			if(action == 'edit') {
				canOpen = self.$(".store-type-box input[name=editForce]:checked").val() ? true : false;
			}
			if(!canOpen) return;
			if($(this).is(":checked")) {
				$.ajax({
					url: '{{pluginApi}}clientId',
					dataType:'json',
					success:function(result){
						var client_id = result.data;
						self.formMaker.setValue('client_id', client_id);
						doAppAuth(client_id);
					}
				});
			}
		});
	});
	// 屏蔽设为默认
	Events.bind('storage.list.view.load', function(self){
		var storeList = self.parent.storeListAll || {};
		_.each(storeList, function(item){
			if(_.toLower(item.driver) == 'baidu') {
				self.$(".app-list [data-id='"+item.id+"'] .dropdown-menu li").eq(0).hide();
			}
		});
	});

	// 账号授权dg
	var doAppAuth = function(client_id){
		if(!client_id) return Tips.tips('插件异常', false);
		var url = '//openapi.baidu.com/oauth/2.0/authorize';
		var redirect_uri = _.get(G, 'system.settings.kodApiServer') + 'plugin/platform';	// 公网有效
        var param = [
            'client_id=' + client_id,
			'response_type=code',
			// 'redirect_uri=oob',
			'redirect_uri=' + urlEncode(redirect_uri),
			'scope=' + urlEncode('basic,netdisk'),
			'display=' + ($.isWap ? 'mobile' : 'page'),
			'state=' + jsonEncode({link: staticPath + 'auth.html', type: 'baidu'}),
			'force_login=1'	// 强制输入账号密码，而不从cookie读取
        ];
        url += '?' + _.join(param, '&');
		$.dialog.open(url,{
			id:"baidu-auth-dg",
			ico:"",
			title:'账号授权',
			fixed:true,
			resize:true,
			width:'688px',
			height:'428px'
		});
	}

	if($.hasKey('plugin.baiduDisk.style')) return;
	requireAsync("{{pluginHost}}static/main.css");
});