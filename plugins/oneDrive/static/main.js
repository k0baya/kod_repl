kodReady.push(function(){
	var staticPath = "{{pluginHost}}static/";
	// var version = '?v={{package.version}}';

	var onedrivePkg = {};
	Events.bind('storage.init.load', function(self){
		requireAsync(staticPath+'package.js', function(package){
			onedrivePkg = package;
		});
		// 添加菜单
		var key = 'onedrive';
		if(_.isUndefined(self.typeList[key])) {
			self.typeList[key] = 'OneDrive';
			self.iconList[key] = '<i class="path-ico name-kod-onedrive"><img src="{{pluginHost}}static/images/icon.png"></i>';
		}
	});
	// 存储form赋值
	Events.bind('storage.config.form.load', function(type, formData){
		if(type != 'onedrive') return;
		_.extend(formData, $.objClone(onedrivePkg));
	});
	Events.bind('storage.config.view.load', function(self, type, action){
		if(type != 'onedrive') return;
		// 授权失败或切换版本时，清除已填充的client信息
		var cancelAuth = function(){
			var items = ['access_token', 'refresh_token', 'token_expire_time'];
			for(var i in items) {
				self.formMaker.setValue(items[i], '');
			}
		}
		// 开启授权
		self.formMaker.$("[name='auth']").click(function(){
			var canOpen = true;
			if(action == 'edit') {
				canOpen = self.$(".store-type-box input[name=editForce]:checked").val() ? true : false;
			}
			if(!canOpen) return false;
			var type = self.formMaker.$("[name='type']").val();
			if($(this).is(":checked")) {
				getClientID(type, function(result){
					if (!result.code) {
						cancelAuth();
						return Tips.tips(result.data, false, 3000);
					}
					var client_id = result.data;
					self.formMaker.setValue('client_id', client_id);
					doAppAuth(type, client_id);
				});
			}
		});
		self.formMaker.$("[name='type']").change(function(){
			if (self.formMaker.$("[name='auth']:checked").val()) {
				cancelAuth();
				self.formMaker.$("[name='auth']").prop('checked', false);
			}
			var type = $(this).val();
			if (type == 'cn') {
				getClientID(type, function(result){
					if (result.code) return;
					var desc = '<span style="color:#ff4949">当前版本不可用，请检查插件配置</span>';
					self.formMaker.$(".form-row.item-type .desc").html(desc);
				});
			} else {
				self.formMaker.$(".form-row.item-type .desc").html('');
			}
		});
	});
	Events.bind('storage.list.view.load', function(self){
		var storeList = self.parent.storeListAll || {};
		_.each(storeList, function(item){
			if(_.toLower(item.driver) == 'onedrive') {
				self.$(".app-list [data-id='"+item.id+"'] .dropdown-menu li").eq(0).hide();
			}
		});
	});

	// 从后台获取clientID
	var getClientID = function(type, callback){
		$.ajax({
			url: '{{pluginApi}}clientId',
			dataType:'json',
			data: {type: type},
			success:function(result){
				callback(result);
			}
		});
	}

	// 去授权
	var doAppAuth = function(type, client_id){
		if (type == 'int') { // 国际版
			var url = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
			var redirect_uri = _.trimEnd(_.get(G, 'system.settings.kodApiServer'), '?') + 'index.php/plugin/platform';
		} else { // 世纪互联
			var url = 'https://login.partner.microsoftonline.cn/common/oauth2/v2.0/authorize';
			var redirect_uri = _.replace("{{pluginApi}}", '?','index.php/') + 'callback';
		}
        var param = [
            'client_id=' + client_id,
			'response_type=code',
			'redirect_uri=' + urlEncode(redirect_uri),
			'state=' + jsonEncode({link: staticPath + 'auth.html', type: 'onedrive'}),
			'scope=' + urlEncode('files.readwrite.all offline_access')
        ];
        url += '?' + _.join(param, '&');
		return window.open(url);
	}

	if($.hasKey('plugin.oneDrive.style')) return;
	requireAsync("{{pluginHost}}static/main.css");
});