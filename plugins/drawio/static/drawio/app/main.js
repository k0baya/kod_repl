(function(){
	var appMain = false;
	var linkFilter = function(key,value){
		if(!value) return value;
		if( (key == 'src' && this.nodeName == "SCRIPT") ||
			(key == 'src' && this.nodeName == "IMG")  ||
			(key == 'xlink:href' && this.nodeName == "IMG")  ||
			(key == 'href' && this.nodeName == "LINK")  ||
			(key == 'href' && this.nodeName == "STYLE") ){
			value = linkParse(value);
		}
		return value;
	}
	var linkParse = function(link){
		if(!link) return link;
		var before = link;
		if( link.substr(0,10) == 'proxy?url='){link =urlDecode(link.substr(10));}
		if( link.substr(0,4) != 'http' && link.substr(0,5)!='data:'){link = BASE_URL_CDN+link;}
		// if(before != link){console.error(3001,before,link);}
		return link;
	}
	functionHook(Element.prototype,'setAttribute',function(key,value){
		return [key,linkFilter.apply(this,[key,value])];
	});
	functionHook(Element.prototype,'setAttributeNS',function(ns,key,value){
		return [ns,key,linkFilter.apply(this,[key,value])];
	});
	
	var isFirstRun = true;
	var fileLoadStart = function(result){
		if(!appMain) return result;
		if(!isFirstRun) return result;
		if(!FILE_INFO.fileUrl){
			FILE_INFO.fileName = appMain.defaultFilename+'.drawio';
		}
		
		$('body').addClass('page-loaded');
		isFirstRun = false;
		appMain.createFile(FILE_INFO.fileName,null,null,null,null,null,null,true);
		fileReload();
	}

	var fileOpen = function(url,name,filePath,canWrite){
		FILE_INFO = {
			fileUrl:url,
			fileName:name,
			savePath:filePath,
			canWrite:canWrite
		};
		fileReload();
	};
	
	var tipsLoading = false;
	var fileReload = function(){
		fileReloadInfo();
		if(!FILE_INFO.fileUrl) return false;
		tipsLoading = Tips.loadingMask(false,false,0.5);
		$.ajax({
			url:FILE_INFO.fileUrl,
			type: "GET",
			dataType:"binary",
			processDownload:function(percent){tipsLoading.title(Math.round(percent*100)+'%');},
			success: function(data){
				if(!data){tipsLoading.close();tipsLoading = false;return;};
				fileSetContent(data);
			}
		});
		// appMain.setFileData("xxx");				// 设置文件内容;
		// appMain.getCurrentFile().data; 			// 获取文件内容;
		// appMain.editor.graph.setEnabled(false);	// 读写模式切换;
		// appMain.isDiagramEmpty(); (是否内容为空)
	}
	var fileSaveCreate = function(content){
		var fileName = FILE_INFO.fileName;
		var ext = fileExt(fileName);
		if( ext != 'drawio'){
			fileName = fileName.substr(0,fileName.length - ext.length - 1) + '.drawio';
			Tips.tips("另存为可编辑的drawo文件!",true,3000);
		}		
		kodApi.fileCreate(fileName,content,function(data){
			FILE_INFO.fileUrl  = '---';
			FILE_INFO.fileName = data.name,
			FILE_INFO.savePath = data.path,
			FILE_INFO.canWrite = true;
			appMain.currentFile.setModified(false);
			fileReloadInfo();		
			fileChangeStatus();
	   });
	}
	
	
	var fileReloadInfo = function(){
		var fileInfo = FILE_INFO;
		var name = fileInfo.fileName;
		var savePath = fileInfo.savePath || fileInfo._savePath;
		if(!savePath){//未保存文件;
			if(!fileInfo.fileUrl){name = name ? '*' + name : '';}
			$('.file-title').removeClass('true-file');
		}else{
			$('.file-title').addClass('true-file');
		}
		
		$(appMain.fname).html(htmlEncode(name)).attr('title',htmlEncode(name));
		appMain.currentFile.title = name;
		appMain.updateDocumentTitle();
		
		$('.file-title span').html(htmlEncode(name));
		$('.file-title .folder').attr('data-path',savePath);
	}
	var blobToString = function(blob,callback){
		if(typeof(blob) == 'string') return callback(blob);
		var reader = new FileReader();
		reader.onload = function(event){
			callback(reader.result);
		};
		reader.readAsText(blob);
	}
	var stringToBlob = function(str,mime){
		mime = mime || 'text/plain';
		return new Blob([str],{type:mime});
	}
	var fileExt =  function(thePath) {
		var ext = thePath.substr(thePath.lastIndexOf(".") + 1) || '';
		return ext.toLowerCase();
	}
	var fileSetContent = function(blob){
		var ext = fileExt(FILE_INFO.fileName);
		if( ext == 'vsd' || ext == 'vsdx' || ext == 'vdx'){return fileSetContentVsd(blob);}
		if( ext == 'graphml' ){return blobToString(blob,fileSetContentGraphml);}
		if( ext == 'pos' ){return blobToString(blob,fileSetContentPos);}
		blobToString(blob,fileSetContentXml);
	}
	var fileSetContentXml = function(data){
		if(data){appMain.setFileData(data);}
		appMain.currentFile.setModified(false);
		appMain.editor.undoManager.clear();
		fileChangeStatus();
		fileReloadInfo();
		if(tipsLoading){tipsLoading.close();tipsLoading = false;}
	}

	var fileSetContentVsd = function(blob){
		FILE_INFO._savePath = FILE_INFO.savePath;FILE_INFO.savePath = false;
		appMain.importVisio(blob,function(result){
			fileSetContentXml(result);
		},function(e){
			fileSetContentErr(e);
		},FILE_INFO.fileName);
	}
	var fileSetContentGraphml = function(data){
		FILE_INFO._savePath = FILE_INFO.savePath;FILE_INFO.savePath = false;
		appMain.importGraphML(data,function(result){
			fileSetContentXml(result);
		},function(e){
			fileSetContentErr(e);
		},FILE_INFO.fileName);
	}
	var fileSetContentPos = function(data){
		FILE_INFO._savePath = FILE_INFO.savePath;FILE_INFO.savePath = false;
		var result = posDataToXml(data);
		fileSetContentXml(result);
	}
	var fileSetContentErr = function(e){
	    if(tipsLoading){tipsLoading.close();tipsLoading = false;}
	    Tips.tips('解析失败，检查文件是否正常。', false, 3000);
	}
	
	// 文件保存状态处理;
	var fileChangeStatus = function(){
		var isChange = appMain.currentFile ? appMain.currentFile.modified:false;
		var $save = $('.draw-file-save');
		if( !$save.length ){
			var $topbar  = $(".geMenubarContainer .geMenubar");
			var htmlSave = "<div class='draw-file-save' title='保存(ctrl+s)'><span>保存</span></div>";
			$save = $(htmlSave).insertBefore(".geToolbarContainer .geToolbar");
			$('<div class="file-title"><span></span><i class="ri-folder-fill-3 folder"></i></div>').appendTo($topbar);
			$('.file-title .folder').bind('click',function(){
				var filePath = $(this).attr('data-path');
				filePath && kodApi.folderView(filePath);
			});
			
			$save.bind('click',function(){appMain.saveFile();});
			setTimeout(function(){
				$('.geNotification-box').next('.gePrimaryBtn').remove();
			},200);
		}
		if(FILE_INFO.savePath){
			$save.removeClass('hidden');
		}else{
			$save.addClass('hidden');
		}
		if(isChange){
			$save.removeClass('disabled');
		}else{
			$save.addClass('disabled');
		}
	}
	
	var fileThumb = function(callback,scale){
		scale = scale || 0.2;
		appMain.editor.exportToCanvas(function(canvas){
			var self = appMain.actions.editorUi;
			var data = self.createImageDataUri(canvas,null,'jpeg',null);
			// console.error(111,[canvas,self,data,typeof(data)]);
			callback(data.substr(23));
		},null,{},null,function(){
			callback('');// console.error(1112,arguments);
		},null,true,scale,false,false,null,null,"0",true,false,null,'diagram');
	}
	var fileThumbAppend = function(xml,callback){
		fileThumb(function(image){
			var prev = '<mxfile ';
			if(xml.substr(0,prev.length) == prev && image){
				xml = xml.replace(/<mxfile cover=".*?"/,'<mxfile');
				xml = prev + 'cover="'+image.length+';'+image+'" '+xml.substr(prev.length);
			}
			callback(xml);
		});
	};
	
	// 语言处理;
	var languageReset = function(){
		var langKey = false;
		var langKeyReset = {
			basic:"基本图形",
			blockquote:"区块引言",
			center:"居中",
			commentsNotes:"评论/备注",
			connecting:"连接中",
			description:"说明",
			diamond:"菱形",
			diamondThin:"菱形(细)",
			hideIt:"隐藏{1}",
			line:"线型",
			lineheight:"行高",
			lineJumps:"线条调整",
			link:"链接",
			links:"链接",
			width:"宽度",
			waypoints:"连接线样式",
			addWaypoint:"添加坐标",
			clearWaypoints:"清除坐标",
			removeWaypoint:"移除坐标",
			north:"上",
			south:"下",
			west:"左",
			east:"右",
			height:"高度",
			left:"左侧",
			constrainProportions:"保持高宽比",
			
			top:"顶部",
			bottom:"底部",
			topAlign:"顶部对齐",
			topLeft:"左上方",
			topRight:"右上方",
			bottomAlign:"底部对齐",
			bottomLeft:"左下方",
			bottomRight:"右下方",
			backgroundImage:"背景图片",
			
			connect:"连接线",
			connection:"连接线",
			copySize:"复制尺寸",
			pasteSize:"粘贴尺寸",
			pasteStyle:"应用样式",
			pasteHere:"粘贴至此处",
			selectEdges:"选择连接线",
			gap:"间隔",
			line:"线",
			laneColor:"通道颜色",
			lineheight:"行间距",
			misc:"其他选项",
			orthogonal:"直角",
			selectSiblings:"选择相邻节点",
			selectVertices:"选择图形",
			copyData:"复制数据",
			device:'本地打开',
			url:"URL链接",
			
			toBack:"置于底层",
			toFront:"置于顶层",
			bringForward:"移到上层",
			sendBackward:"移到下层",
			
			replFind:"查找替换",
			replaceWith: "替换为",
			replaceAll: "全部替换"
		};
		if(!window.mxLangChinese){langKeyReset = {};}
		mxResources.getKey  = function(value){
			if(!value) return '';
			return langKey[value] || '';
		}
		functionHook(mxResources,'parse',false,function(){
			$.extend(true,mxResources.resources,langKeyReset);
			langKey = {};
			for(var key in mxResources.resources){
				langKey[mxResources.resources[key]] = key;
			}
		});
	}
	
	var viewInitAfter = function(){
		$('.geMenubarContainer').prev('.geItem').addClass('menu-language');
		$('.geToolbarContainer').children("a:eq(0)").addClass('toggle-fullscreen');
		$('.geToolbarContainer').children("a:eq(1)").addClass('toggle-panel');
		$('.geToolbarContainer').children("a:eq(2)").addClass('toggle-header');
	}
	
	var menuReload = function(){
		// 追加样式
		functionHook(BaseFormatPanel.prototype,'createStepper',function(dom){
			if(dom){$(dom).addClass('form-step-input');}
		},function(result){
			if(result){$(result).addClass('form-step-btn');};
		});
		
		// 菜单处理;
		functionHook(Menus.prototype,'addMenuItem',function(){
			if(!menuFilterItem(arguments[1])) return false;
		},function(result,args){
			// console.log(2003,result,arguments);
			if(result && args[1]){$(result).attr('item',args[1]);};
		});			
		functionHook(Menus.prototype,'addSubmenu',function(){
			if(!menuFilterItem(arguments[0])) return false;
		});

		functionHook(Menus.prototype,'addMenuItems',function(menu,keys){
			arguments[1] = menuFilter(keys);
			return arguments[1] ? arguments:false;
		});
		functionHook(mxPopupMenu.prototype,'addItem',false,function(result,args){
			var className = mxResources.getKey(args[0]);
			className = className.replace(/ /g,'-');
			if(result && className){$(result).attr('item',className);};
		});
		
		// 菜单追加样式class;
		functionHook(Menus.prototype,'put',function(menuType,menu){
			functionHook(menu,'funct',function(theMenu,menuTarget){
				var table = arguments[0].div;
				if(!table) return;
				if(!menuTarget){ //一级菜单;
					$(table).addClass('menu-content-'+menuType);
					setTimeout(function(){ // 子菜单初始化延迟处理i;
						if(menuType == 'file'){menuFileLoad($(table).parent());}
					},0);
				}else{
					setTimeout(function(){ // 子菜单初始化延迟处理i;
						$(menuTarget.div).addClass('menu-content-'+menuType);
					},10);
				}
				// console.log(102,[theMenu,menuTarget,arguments,this]);
			});
		});
		// 菜单选中样式优化;
		functionHook(mxPopupMenu.prototype,'addCheckmark',function(dom,image){
			$(dom).attr('check','checked');return false;
		});
		
		// 工具栏下拉菜单标记; 连线样式,连线箭头...;
		functionHook(Toolbar.prototype,'addMenuFunctionInContainer',function(dom,menuType,text){
			var beforeFunc = arguments[4];
			var self = this,args = arguments;
			var className = (menuType || mxResources.getKey(text)) + '';
			className = className ? 'submenu-'+className.replace(/ /g,'-') : '';
			arguments[4] = function(theMenu){
				// console.log(101,[args,className,arguments,this]);
				if(theMenu && className){$(theMenu.div).addClass(className);}
				return beforeFunc.apply(self,arguments);
			}
			// console.log(102,arguments,this);
			return arguments;
		});
		
		var menuFileLoad = function(dom){
			var html = 
			'<tr class="mxPopupMenuItem menu-add" item="open">\
				<td class="mxPopupMenuIcon"></td>\
				<td class="mxPopupMenuItem" align="left">打开</td>\
				<td class="mxPopupMenuItem" style=""></td>\
			</tr>';
			var $open = $(html).insertAfter($(dom).find('[item="new"]'));
			$open.bind('mousedown',function(e){
				e.preventDefault && e.preventDefault();
				return false;
			}).bind('mouseup',function(e){
				appMain.hideCurrentMenu();
				kodApi.fileSelect({
					title:"打开文件",
					allowExt:'drawio,pos,vsd,vsdx,vdx,graphml',
					callback:function(result){  // 回调地址;
						if(FILE_INFO.fileUrl){
							var param = '&path='+urlEncode(result.path)+'&name='+urlEncode(result.name);
							return window.open(BASE_URL_API + param);
						}
						fileOpen(result.downloadPath,result.name,result.path,true);
					}
				});
			});
		}

		// 工具栏处理;
		// functionHook(EditorUi.prototype,'init',function(){
		// 	var graph = this.editor.graph;
		// 	console.log(123,[graph,graph.cellEditor,this,this.toolbar,$('.geToolbar').children()]);
			
		// 	var toolbar = this.toolbar;
		// 	functionHook(graph.cellEditor,'startEditing',function(){
		// 		this.toolbar = null;console.log(123,[this,this.toolbar]);
		// 	},function(){
		// 		this.toolbar = toolbar;
		// 	});
		// 	functionHook(graph.cellEditor,'stopEditing',function(cell, trigger){
		// 		this.toolbar = null;console.log(123,[this,this.toolbar]);
		// 	},function(){
		// 		this.toolbar = toolbar;
		// 	});
		// });
		

		// 菜单构造加入菜单名;
		functionHook(Menus.prototype,'addMenu',function(){
			if(arguments[0] && arguments[2]){$(arguments[2]).attr('item',arguments[0]);}
		});
		// 头部菜单展开处理: 加入下拉菜单className;
		functionHook(App.prototype,'setCurrentMenu',function(theMenu,menuItem){
			if(menuItem && $(menuItem).attr("menu")){
				$(".geMenubarContainer .geMenubar .geItem").removeClass('this');
				$(menuItem).addClass("this");
			}
		});
		functionHook(App.prototype,'resetCurrentMenu',function(theMenu,menuItem){
			$(".geMenubarContainer .geMenubar .geItem").removeClass('this');
		});
				
		Menus.prototype.createMenubar = function(container){
			var menubar = new Menubar(this.editorUi, container);
			var menus = this.defaultMenuItems;
			for (var i = 0; i < menus.length; i++){
				(mxUtils.bind(this, function(menu){
					var elt = menubar.addMenu(mxResources.get(menus[i]), mxUtils.bind(this, function(){
						menu.funct.apply(this, arguments);
					}));
					this.menuCreated(menu, elt);
					$(elt).attr('menu',menus[i]);
				}))(this.get(menus[i]));
			}
			return menubar;
		};
		
		// 过滤菜单内容;
		var menuReset = {
			saveAs:'save,-',
			pageSetup:"pageSetup",
			exportAs:"export",// exportAs:[exportPng,exportJpg,exportSvg,exportPdf]
			properties:false,
			googleDocs:false,
			keyboardShortcuts:false,
			configuration:'-,configuration,keyboardShortcuts',
			embedImage:"publishLink,embedImage,embedSvg,-,embedHtml",
		};
		var menuFind = Object.keys(menuReset);
		var menuFilter = function(menuArr){
			// console.error(3001,menuArr);
			for (var i = 0; i < menuArr.length; i++){
				if(menuFind.indexOf(menuArr[i]) != -1){
					var menuNew = menuReset[menuArr[i]];
					return menuNew ? menuNew.split(',') : false;
				}
			}
			return menuArr
		}
		
		var menuResetItem  = {
			openRecent:false,share:false,rename:false,
			makeCopy:false,googleDocs:false,
			openFrom:false,
			importFrom:false, //导入;
			openLibraryFrom:false,
			newLibrary:false,
			publish:false,
			close:false,plugins:false,
		}
		var menuFilterItem = function(menuItem){
			return menuResetItem[menuItem] === false ? false : true;
		}
	}
	
	var appMainBeforeLoad = function(){
		urlParams['gapi'] 		= '0';
		urlParams['gh'] 		= '0';
		urlParams['gl'] 		= '0';
		urlParams['math'] 		= '1';
		urlParams['browser']    = '0';

		window.DriveClient 		= null;
		window.DropboxClient 	= null;
		window.OneDriveClient 	= null;
		window.TrelloClient 	= null;
		window.DRAWIO_VIEWER_URL= BASE_URL_CDN + 'js/viewer-static.min.js';
		window.VIEWER_URL 		= window.DRAWIO_VIEWER_URL;
		window.DRAWIO_BASE_URL	= BASE_URL_API;
		Editor.compressXml 		= false;
		EditorUi.drawHost 		= BASE_URL_API.substr(0,BASE_URL_API.length - 1);
		EditorUi.lightboxHost 	= EditorUi.drawHost;
		Editor.GOOGLE_FONTS 	= '----';
		EditorUi.prototype.maxImageBytes= 1024*1024*5; //5M
		EditorUi.prototype.maxTextBytes = 1024*1024*2; //2M
		EditorUi.prototype.maxImageSize = 2048;
		EditorUi.prototype.maxTextWidth = 2048;
		
		var blackColor   = "#444";// #000000;
		var defaultValueMap = {
			fillColor:"#ffffff", 				//填充
			gradientColor:"#eeeeee", 			//渐变终止颜色
			strokeColor:blackColor,  			//线条颜色
			labelBackgroundColor:"#ffffff",		//背景色"
			labelBorderColor:blackColor,		//边框颜色
			fontColor:blackColor,				//字体颜色
			fontSize:13,						//字体
			strokeWidth:1.5, 					//线宽度;
			fontFamily:'微软雅黑' 				 //字体样式;
		};
		
		// 圆角时: 默认相对位置;
		functionHook(mxUtils,'getValue',function(obj,key,defaultValue){
			if(key == 'absoluteArcSize' && defaultValue == false){arguments[2] = 1;}
			if(key == 'strokeWidth' && defaultValue == 1){arguments[2] = defaultValueMap.strokeWidth;}
			return arguments;
		});
		functionHook(mxUtils,'getNumber',function(obj,key,defaultValue){
			if(key == 'strokeWidth' && defaultValue == 1){arguments[2] = defaultValueMap.strokeWidth;}
			return arguments;
		});
		
		Editor.prototype.appName= "Drawio";
		Menus.prototype.defaultFontSize = defaultValueMap.fontSize;		
		Menus.prototype.defaultFont = defaultValueMap.fontFamily;
		if(window.mxLangChinese){
			Editor.prototype.appName= "draowio流程图";
			Menus.prototype.defaultFonts = [
				'Arial', 'Verdana', 'Times New Roman', 'Garamond', 'Comic Sans MS',
				   'Courier New','Impact','Georgia', 'Lucida Console', 'Tahoma',
				'微软雅黑','宋体','黑体','楷体'
			];
		}
		
		mxConstants.LINE_ARCSIZE = 15;
		mxConstants.DEFAULT_FONTSIZE = defaultValueMap.fontSize;
		mxConstants.DEFAULT_FONTFAMILY = defaultValueMap.fontFamily;
		// mxConstants.VERTEX_SELECTION_STROKEWIDTH = defaultValueMap.strokeWidth;
    	// mxConstants.EDGE_SELECTION_STROKEWIDTH = defaultValueMap.strokeWidth;		
		
		functionHook(mxStylesheet.prototype,'getDefaultEdgeStyle',false,function(result,args){
			result.fontSize = defaultValueMap.fontSize;
			result.fontColor = defaultValueMap.fontColor;
			result.strokeColor = defaultValueMap.fontColor;
		});
		functionHook(mxStylesheet.prototype,'getDefaultVertexStyle',false,function(result,args){
			result.fontSize = defaultValueMap.fontSize;
			result.fontColor = defaultValueMap.fontColor;
			result.strokeColor = defaultValueMap.fontColor;
		});

		
		// 选中元素 调整尺寸图标
		// functionHook(mxVertexHandler.prototype,'createSizer',false,function(result,args){
		// 	// result.image = "";
		// 	console.error(11,arguments,result.node);
		// 	if(result.node){$(result.node).attr('cursor-box-select',args[0]);}
		// 	return result;
		// });
		// functionHook(mxVertexHandler.prototype,'init',false,function(result,args){
		// 	console.error(11,arguments,this);
		// });

		
		// 连接线拉出处理
		// functionHook(HoverIcons.prototype,'init',false,function(){return;
		// 	var self = this;
		// 	var currentState = false;
		// 	this.graph.addMouseListener({
		// 		mouseDown:function(sender, me){},
		// 		mouseMove:function(sender, me){},
		// 		mouseUp:function(sender, me){
		// 			if(!currentState) return;
		// 			self.execute(currentState,self.getDirection(),me);
		// 			me.consume();
		// 		}
		// 	});
		// 	functionHook(HoverIcons.prototype,'setCurrentState',false,function(res,args){
		// 		currentState = args[0];
		// 	});
		// });
		// // 图形选择EditorUi.prototype.createShapePicker;(双击连接线tips);
		// functionHook(EditorUi.prototype,'createShapePicker',function(){
		// 	console.error(11,arguments,this);
		// });
		
		// 允许加载外部资源;
		Editor.prototype.isCorsEnabledForUrl = function(url){return true;}
		// functionHook(App.prototype,'loadTemplate',console.error);
		
		languageReset();
		menuReload();
		functionHook(Menus.prototype,'init',false,function(){
			setTimeout(viewInitAfter,0);
		});
		App.prototype.showDownloadDesktopBanner = function(){}
		App.prototype.alert = function(msg){
			Tips.tips(msg,'success',3000);
		}
		App.prototype.saveFile = function(){
			var drawFile = appMain.currentFile;
			drawFile.isCompressed
			drawFile.updateFileData();
			drawFile.clearAutosave();

			fileThumbAppend(drawFile.getData(),function(content){
				if(!FILE_INFO.savePath) return fileSaveCreate(content);
				kodApi.fileSave(FILE_INFO.savePath,content,function(){
					drawFile.setModified(false);
					fileChangeStatus();
				});
			});
		}

		// 关闭草稿功能;
		DrawioFile.prototype.saveDraft = function(){
			this.removeDraft();
		}
		DrawioFile.prototype.addUnsavedStatus=function(){
			fileChangeStatus();
		};
		App.prototype.onBeforeUnload = function(){
			var file = this.currentFile;
			if (file.isModified()) return mxResources.get('allChangesLost');
			file.close(true);
		}
		functionHook(App.prototype,'handleError',function(){
			console.error('handleError',arguments);
		});
		// DrawioFile.prototype.getHash = function(){return 'hash';}
		
		// svg中图片url处理;
		functionHook(mxSvgCanvas2D.prototype,'image',function(){
			arguments[4] = linkParse(arguments[4]);
			return arguments;
		});
		
		// 从模板新建,替换当前内容;
		functionHook(App.prototype,'fileCreated',function(file, libs, replace){
			if(arguments[1]){arguments[2] = true;};
			return arguments;
		});
		

		// 不显示打开位置;
		functionHook(EditorUi.prototype,'fileLoaded',function(file,noDialog){
			if(!file){noDialog = true;}
			fileChangeStatus();
			return [file,noDialog];
		},function(result){
			return fileLoadStart(result);
		});
		
		var urlRepair = function(str){
			// console.error('urlRepair',str);
			return str.replace("?plugin/drawio/?",'?plugin/drawio&');
		}
		
		// url兼容处理; 嵌入--链接--url;
		functionHook(EditorUi.prototype,'createLink',0,function(result,args){
			return urlRepair(result);
		});
		// url兼容处理; 嵌入--图片;
		functionHook(EditorUi.prototype,'createEmbedImage',function(){
			var theFunc = arguments[6],self = this;
			arguments[6] = function(html){
				return theFunc.apply(self,[urlRepair(html)]);
			}
			return arguments;
		});
		functionHook(EditorUi.prototype,'createEmbedSvg',function(){
			var theFunc = arguments[6],self = this;
			arguments[6] = function(html){
				return theFunc.apply(self,[urlRepair(html)]);
			}
			return arguments;
		});
		
		// 取消显示header;
		functionHook(App.prototype,'toggleCompactMode',function(){
			arguments[0] = false;
			return arguments;
		});
		
		
		// 对话框显示; 加入对话框名称;
		functionHook(EditorUi.prototype,'showDialog',false,function(res,args){
			if(args[0]){
				var stack = (new Error()).stack.split("\n");
				var callLine = (stack[3]||"").trim().split(" ");
				var dialogName = callLine[1] || 'showDialog-info';
				var className = 'dialog-'+dialogName.replace(/[\s\.]/g,'-');
				// console.error(101,className,arguments,stack);
				$(args[0]).parent().addClass(className);
			}
		});
		functionHook(PrintDialog.prototype,'create',false,function(){
			$(this.container).addClass('content-print');
		});
		functionHook(EditorUi.prototype,'exportImage',function(){
			// console.error(111,arguments);
		});

		
		// 预览模式;工具栏dom处理;
		functionHook(EditorUi.prototype,'initCanvas',false,function(){
			if(!this.chromelessToolbar) return;
			var $toolbar = $(this.chromelessToolbar);
			$toolbar.addClass('preview-toolbar');
			$toolbar.children('span:eq(0)').addClass('toolbar-item toolbar-page-prev');
			$toolbar.children('span:eq(1)').addClass('toolbar-item toolbar-page-next');
			$toolbar.children('span:eq(2)').addClass('toolbar-item toolbar-zoomin');
			$toolbar.children('span:eq(3)').addClass('toolbar-item toolbar-zoomout');
			$toolbar.children('span:eq(4)').addClass('toolbar-item toolbar-page-fit');
			$toolbar.children('span:eq(5)').addClass('toolbar-item toolbar-export');
			$toolbar.children('span:eq(6)').addClass('toolbar-item toolbar-print');
			$toolbar.find(".toolbar-page-prev + div").addClass("page-num");
			$('body').addClass('draw-view-only');
		});
	}
	
	var resetActions = function(){
		if(!appMain || !appMain.actions.actions) return;
		var keyboardShortcuts = appMain.actions.actions.keyboardShortcuts;
		keyboardShortcuts.funct = function(){
			var div = '<div style="width:100%;height:100%;overflow:auto;position:absolute;">';
			$.dialog({
				content:div+'<img src="'+BASE_URL_CDN+'shortcuts.svg" draggable="false"/></div>',
				fixed:true,resize:true,width:'80%',height:'80%'
			});
		}		
		if(urlParams['lightbox'] == '1'){
			fileLoadStart();
		}
		var $view = $(".geDiagramBackdrop");
		if($view.length){
			setTimeout(function(){
				$view.scrollTop($view.scrollTop()-8);
				$view.scrollLeft($view.scrollLeft()-8);
			},100);
		}
	}
	
	
	var appMainLoad = function(app){
		appMain = app;
		window.appMain = appMain;
		if(app.toggleElement){
			app.toggleCompactMode(false);
		}
		resetActions();
	}

	window.addEventListener('load',function(){
		// mxStencilRegistry.loadStencilSet(BASE_URL+'app/icons/shape.xml');//自定义图形;	
		var pathBase = BASE_URL_CDN+'app/';
		mxscript(pathBase+'color.js');
		mxscript(pathBase+'processon-icon.js');
		mxscript(pathBase+'processon.js');
		mxscript(pathBase+'search-lang.js');
		mxscript(pathBase+'search.js');
		functionHook(mxXmlRequest.prototype,'send',function(){
			this.url = linkParse(this.url);
		});
		functionHook(App,'main',function(callback,editorUi){
			appMainBeforeLoad();
			if(!callback){callback = appMainLoad;}
			return [callback,editorUi];
		});
	});
})();