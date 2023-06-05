Menus.prototype.pickColor = function(key, cmd, defaultValue){
	var graph = this.editorUi.editor.graph;
	var self  = this;			
	if (graph.cellEditor.isContentEditing()  && cmd != null){
		var selState = graph.cellEditor.saveSelection();
		kodPickerColor(function(color){
			var theColor = color != mxConstants.NONE ? color:'transparent';
			graph.cellEditor.restoreSelection(selState);
			document.execCommand(cmd, false,theColor);
		});
		//graph.cellEditor.restoreSelection(selState);//cancle;
	}else{
		var state = graph.getView().getState(graph.getSelectionCell());
		var defaultColor =  state ? state.style[key] :"#444";
		kodPickerColor(function(color){
			var theColor = color || defaultColor;
			graph.getModel().beginUpdate();
			try {
				var cells = graph.getSelectionCells();
				var eve   = new mxEventObject("styleChanged","keys",[key],"values",[theColor],"cells",cells);
				// console.log(2222,key,color,theColor,state,cells,eve);
				graph.setCellStyles(key,theColor);
				self.editorUi.fireEvent(eve);
			}finally{
				graph.getModel().endUpdate()
			}
		},defaultColor);
	}
};
var kodPickerColor = function(callback,theColor) {
	var $target = $(window.event.target);
	var changeCallback = function(color,thePicker){
		callback(color.toHEXA().toString());
		// thePicker.hide();
	}
	
	// 已绑定则不再初始化;// 
	var picker  = kodPickerColorInit();
	var $picker = $(picker._root.app);
	// changeCallback = _.throttle(changeCallback,50);
	picker.setColor(theColor||'#444',false);
	picker.on('change',changeCallback);
	picker.show();
	picker.changeCallback = changeCallback;
	picker.$target = $target;
	
	//默认位置; 右上角定位在点击元素的右下角; 元素不存在则居中;
	var pickerWidth  = $picker.outerWidth(),
		pickerHeight = $picker.outerHeight(),
		winWidth     = $(window).width(),
		winHeight    = $(window).height(),
		targetWidth  = $target.outerWidth(),
		targetHeight = $target.outerHeight(),
		targetOffset = $target.offset();
	var centerLeft   = (winWidth  - pickerWidth)/2;
	var centerTop    = (winHeight - pickerHeight)/2;
	
	// 默认$picker位于元素左对齐下面; 
	// 当右侧超出屏幕则$picker右对齐元素;
	// 当下面超出屏幕则$picker底部位于元素上面;
	var marginTop = 10;
	var pose = {
		left:targetOffset.left,
		top: targetOffset.top + targetHeight,
	};
	if(pose.left + pickerWidth > winWidth ){
		pose.left = targetOffset.left + targetWidth - pickerWidth;
	}
	if(pose.top + targetHeight + pickerHeight > winHeight ){
		pose.top = targetOffset.top - pickerHeight;
		marginTop = - marginTop;
	}
	// 元素已删除的情况;
	if( targetOffset.left == 0  && targetOffset.top == 0){
		pose = {
			left:window.event.pageX,
			top: window.event.pageY
		};
	}
	// 上下左右超出边界处理;
	pose.top  = pose.top + pickerHeight >= winHeight ? winHeight - pickerHeight : pose.top;
	pose.top  = pose.top <= 0 ? 0:pose.top;
	pose.left = pose.left + pickerWidth >= winWidth ? winWidth - pickerWidth : pose.left;
	pose.left = pose.left <= 0 ? 0:pose.left;
	
	pose.top += marginTop;
	var style = "left:"+pose.left+"px !important;top:"+pose.top+"px !important"
	$picker.attr('style',style);
	setTimeout(function(){$picker.attr('style',style);},0);
	// console.log(123123,theColor,$target.length,pose,$target,window.event,
	// 	[targetOffset,[targetWidth,targetHeight],[pickerWidth,pickerHeight] ]);
}

var kodPickerColorInit = function(){
	if(window.kodPickerColorObject){
		return window.kodPickerColorObject;
	}
	var $pickerAt = $('<div style="display:none;"><div>').appendTo('body');
	var picker = Pickr.create({
		el:$pickerAt.get(0),
		theme: 'nano',
		position:'top-start',
		useAsButton:true,// 不替换原按钮;
		autoReposition:false,
		swatches:[
			'#FFFFFF', '#cfd8dc', '#ffccbc', '#ffecb3', '#fff9c4', '#dcedc8', '#b2ebf2', '#e6f7ff', '#d1c4e9',
			'#D9D9D9', '#90a4ae', '#ff8a65', '#ffd54f', '#fff176', '#aed581', '#4dd0e1', '#91d5ff', '#9575cd',
			'#969696', '#607d8b', '#ff5722', '#ffc107', '#ffeb3b', '#8bc34a', '#00bcd4', '#40a9ff', '#673ab7',
			'#525252', '#455a64', '#e64a19', '#ffa000', '#fbc02d', '#689f38', '#0097a7', '#1890ff', '#512da8',
			'#000000', '#263238', '#bf360c', '#ff6f00', '#f57f17', '#33691e', '#006064', '#006dd2', '#311b92',
		],
		components: {
			preview: true,
			opacity: true,
			hue: true,
			interaction: {hex:1,rgba:1,hsla:0,hsva:0,cmyk:0,input:1,clear:0,save:0}
		}
	});
	picker.on('hide',function(){ // 隐藏解除上一次事件绑定;
		if(!picker.changeCallback) return;
		picker.off('change',picker.changeCallback);
	});
	window.kodPickerColorObject = picker;
	return picker;
}

EditorUi.prototype.pickColor = function(color,apply){
	var graph = this.editor.graph;
	var selState = graph.cellEditor.saveSelection();
	kodPickerColor(function(color){
		graph.cellEditor.restoreSelection(selState);
		apply(color);
	},color || 'none');
};