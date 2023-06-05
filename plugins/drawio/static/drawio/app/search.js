window.drawSearchLoad = function(){
	// 左侧图形列表绘制; 名称,svg对应
	// functionHook(Sidebar.prototype,'createVertexTemplateEntry',function(){
	// 	var pose = 'line-'+(parseInt(shapeIndex / 5)+1) +";col-"+((shapeIndex % 5)+1);shapeIndex++;
	// 	console.error(301,pose,arguments[4],arguments[0]);
	// });var shapeIndex = 0;
	
	// var shapeTags = [];window.shapeTags = shapeTags
	// functionHook(Sidebar.prototype,'addEntryForTag',function(tagName){
	// 	if(!tagName.match(/^[a-zA-Z]{3,10}$/)) return;
	// 	if(shapeTags.length > 1000) return;
	// 	if(shapeTags.indexOf(tagName) !== -1) return;
	// 	shapeTags.push(tagName);
	// });	
	
	
	// 搜索
	var loading = '<img src="'+KOD_STATIC_PATH+'images/common/loading.gif" class="loading"/>';
	functionHook(Sidebar.prototype,'searchEntries',function(word,count,page,success,error){
		var successCallback = success;
		arguments[3] = function(){
			if(arguments[0].length == 0){
				arguments[0] = searchChinese(word);
				arguments[1] = arguments[0].length;
				arguments[2] = false;
			}
			// console.error(101,arguments);
			if(arguments[0]){
				window.theShape = arguments[0][0];
			}
			return successCallback.apply(this,arguments);
		}
		// console.error(100,arguments,this); // 点击加载不处理;
		if(arguments[2] >= 1) return arguments;
		searchServer(this,word);
		return arguments;
	});
	
	// 拖拽图标: 拖拽中显示元素图形;
	functionHook(Sidebar.prototype,'createDragSource',false,function(dragSource,args){
		var self = this;
		var makeDragShape = function(dragNode){
			var cells = self.graph.cloneCells(args[3]);
			var width = $(dragNode).width() + 3, height = $(dragNode).height() + 3; // 偏移量优化;

			self.createThumb(cells,width,height,dragNode,'xxx',null,null);
			$(dragNode).find('svg').css('overflow','visible');
			$(dragNode).find('g').css('visibility','');
			// $(dragNode).find('svg').css({'left':'-'+(width / 2 -1)+'px','top':'-'+(height / 2 - 1) + 'px'});
			// console.error(1002,self,arguments,args);
			// setTimeout(() => {$(dragNode).clone().css({left:300,top:300,'z-index':999}).appendTo('body');},500);
		}

		functionHook(dragSource,'createPreviewElement',false,function(dragNode){
			makeDragShape(dragNode);
		});		
		var isLoad = false;
		functionHook(dragSource,'mouseMove',false,function(res){
			if(!this.dragElement || isLoad) return res;
			isLoad = true;makeDragShape(this.dragElement);
		});
	});

	functionHook(Sidebar.prototype,'addSearchPalette',false,function(){
		var self = this;
		var searchParent = this.palettes.search[1];
		var $searchBox   = $($(searchParent).children('.geSidebar'));
		$searchBox.addClass('search-icon-content');
		$searchBox.parent().addClass('search-icon-view');

		var html= 
		"<div class='search-web hidden'>\
			<div class='title'>网络图标</div>\
			<div class='list geSidebar'></div>\
			<button class='list-load-more hidden'>加载更多</button>\
		</div>";
		$(html).insertAfter($searchBox);
		this.$searchWeb = $searchBox.next();
		this.$searchWebResult = this.$searchWeb.find('.list');
		this.$searchLoadMore  = this.$searchWeb.find('.list-load-more');
		$searchBox.find('input').next().bind('click',function(){
			searchResultRender(self,null);
		});
		this.$searchLoadMore.bind('click',function(){
			var word = self.$searchLoadMore.data('word');
			var page = self.$searchLoadMore.data('page') + 1;
			self.$searchLoadMore.html("加载中..."+loading);
			searchServerRequest(self,word,page,function(){
				self.$searchLoadMore.html("加载更多");
			});
		});
		// console.error(1004,$searchBox,arguments,this.$searchWeb,this);
	});
	
	
	// 中文搜索处理;
	var searchChinese = function(word){
		var tagList = appMain.sidebar.taglist;
		var searchMax = 20;
		var result  = [];
		for (var key in drawShapeLangMap) {
			var addKey = drawShapeLangMap[key];
			if( addKey.indexOf(word) !== -1 || word.indexOf(addKey) !== -1){
				result = result.concat(tagList[key].entries);
			}
		}
		if(result.length > searchMax){
			result = result.slice(0,searchMax);
		}
		return result;
	}
	

	var searchServer = function(view,word){
		view.$searchWeb.removeClass('hidden');
		view.$searchLoadMore.addClass('hidden');
		view.$searchWebResult.html("<div class='tips loading'>正在搜索网络图标..."+loading+"</div>");
		searchServerRequest(view,word,1);
	}
	var searchServerRequest = function(view,word,page,callback){
		var url = ICON_SEARCH_API;
		var page = isNaN(parseInt(page)) ? 1:parseInt(page);
		var url = url + '&query='+urlEncode(word)+'&page='+page;
		$.getJSON(url,function(res){
			if(typeof(res) != 'object'){
				return searchResultRender(view,null);
			}
			if(url.indexOf('iconSearchAli') != -1){
				var result = {
					page:page,
					pageTotal:res.data.count / 50,	// 总页数
					pageSize:50,					// 每页条数
					total:res.data.count,			// 总结果数
					listData:res.data.icons,
				};
			}else{
				var result = {
					page:page,
					pageTotal:res.pages.pageCount,	// 总页数
					pageSize:res.pages.pageSize,	// 每页条数
					total:res.pages.elementsCount,	// 总结果数
					listData:res.pages.elements,
				};
			}
			searchResultRender(view,word,result);
			callback && callback(result);
		});
	}
	
	var searchResultRender = function(view,word,result){
		if(word === null) return view.$searchWeb.addClass('hidden');
		if(result.page == 1){view.$searchWebResult.html("");}
		if(!result.listData || result.total == 0 && result.page == 1){
			return view.$searchWebResult.html("<div class='tips'>没有结果.<br/>建议更换搜索词后再试!</div>");
		}

		view.$searchLoadMore.data('word',word);
		view.$searchLoadMore.data('page',result.page);
		if(result.page >= result.pageTotal){
			view.$searchLoadMore.addClass('hidden');
		}else{
			view.$searchLoadMore.removeClass('hidden');
		}

		for (var i = 0; i < result.listData.length; i++){
			var item = result.listData[i];
			if(item.url){
				var node = makeCell(item.url,item.iconName);
			}else{//aliicon
				var node = makeCell(item.show_svg,item.name,true);
			}
			$(node).appendTo(view.$searchWebResult);
		}
	};
	var makeCell = function(src,title,isSvg){
		if(isSvg){
			src = 'data:image/svg+xml,'+base64Encode(src);
		}
		var shapeAttr = 'strokeColor=none;verticalLabelPosition=bottom;verticalAlign=top;whiteSpace=wrap;html=1;imageAspect=0';
		var shape = appMain.sidebar.createVertexTemplateEntry('shape=image;image='+src+';'+shapeAttr,100,100,'',title);
		return shape();
	}
	
	
	
	
	// 图标处理;(优化部分图标,新增一些图标)
	functionHook(Sidebar.prototype,'addPaletteFunctions',function(type,title,expand,iconList){
		var self = this;
		var addAcion = function(shape,width,height,title,showLabel){
			var style = shape+'whiteSpace=wrap;html=1;';
			showLabel = showLabel || '';
			iconList.push(self.createVertexTemplateEntry(style,width,height,showLabel,title,null,null,title));
		}
		if(type == 'general'){
			addAcion('shape=mxgraph.basic.oval_callout;spacingLeft=10;spacingTop=-10;spacingRight=15;',150,100,'comment');
			addAcion('shape=mxgraph.basic.pentagon;',100,100,'polygon');
			addAcion('shape=hexagon;',100,100,'hexagon');
			addAcion('shape=mxgraph.basic.octagon2;dx=10',100,100,'octagon');
			addAcion('shape=mxgraph.basic.star;',100,100,'pentagon');
			addAcion('shape=note2;boundedLbl=1;fillColor=#FFFFAA;strokeColor=#0000001A;strokeWidth=1;spacing=10;',120,150,'note');

			addAcion('shape=braceLeft;',80,120,'Left brace','');
			addAcion('shape=braceRight;',80,120,'Right brace','');
			addAcion('shape=braceGroup;',160,120,'Brace group','label');
			
			var commonStyle = 'shape=mxgraph.basic.polygon;polyline=1;fillColor=none;';
			var textSytle   = 'verticalLabelPosition=middle;verticalAlign=middle;html=1;labelPosition=center;'
			addAcion(commonStyle+textSytle+'polyCoords=[[0.2,1],[0,0.93],[0,0.07],[0.2,0]];align=left;spacingLeft=5;',100,100,'Left polygon brace','');
			// addAcion(commonStyle+textSytle+'polyCoords=[[0.2,1],[0,1],[0,0],[0.2,0]];align=left;spacingLeft=5;',100,100,'Left square brace','');
		}
		// if(type == "flowchart"){}
	});
	
	
	var braceWidth = 16;
	var shapeAssign = {};
	var brace = 'shape=mxgraph.mockup.markup.curlyBrace;editable=0;rotatable=0;resizeHeight=1;movable=0;allowArrows=0;connectable=0;';
	var braceBox = 'whiteSpace=wrap;html=1;strokeColor=none;fillColor=none;'
	shapeAssign.braceLeft = function(cell){
		cell.style  = braceBox+'spacingRight=20;align=right;';
		var left 	= new mxCell('',new mxGeometry(0, 0, braceWidth,cell.geometry.height),brace+'direction=north;');
		left.vertex = true;left.geometry.relative = true;left.geometry.x = 1;left.geometry.offset = new mxPoint(- braceWidth,0);
		cell.insert(left);
	}
	shapeAssign.braceRight = function(cell){
		cell.style  = braceBox+'spacingLeft=20;align=left;';
		var right 	= new mxCell('',new mxGeometry(0, 0, braceWidth,cell.geometry.height),brace+'direction=south;flipV=1;');
		right.vertex= true;right.geometry.relative = true;
		cell.insert(right);
	}
	shapeAssign.braceGroup = function(cell){
		cell.style  = braceBox+'spacingLeft=15;spacingRight=15;';
		var left 	= new mxCell('',new mxGeometry(0, 0, braceWidth,cell.geometry.height),brace+'direction=north;');
		var right 	= new mxCell('',new mxGeometry(0, 0, braceWidth,cell.geometry.height),brace+'direction=south;flipV=1;');
		left.vertex = true;left.geometry.relative = true;
		right.vertex= true;right.geometry.relative = true;right.geometry.x = 1;right.geometry.offset = new mxPoint(-braceWidth,0);
		cell.insert(left);
		cell.insert(right);
	}
	
	// 图标cell替换;
	var checkShapeCell = function(cell){
		var match = cell.style.match(/(^|;)shape=(.*?)(;|$)/);
		if(!match || match.length != 4) return;
		var shapeType = match[2];
		if(!shapeType || !shapeAssign[shapeType]) return;
		shapeAssign[shapeType](cell);
		// console.error(1001,cell);
	}
	
	functionHook(mxGraph.prototype,'addCells',function(cells){
		if(cells && cells.length == 1 && cells[0].style){
			checkShapeCell(cells[0]);
		}
	});
};drawSearchLoad();