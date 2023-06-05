window.processShapeMap = { //{style..}, [{styles...},{attr...}]
	// 通用
	text:{text:null,align:'center',verticalAlign:'middle',fillColor:'none',strokeColor:"none"},
	standardText:{text:null,align:'center',verticalAlign:'middle',fillColor:'none',strokeWidth:0},
	note:{shape:"note2",boundedLbl:1,strokeColor:"#0000001A",strokeWidth:1,spacingLeft:5,spacingTop:-5,size:10},
	linker:{},
	round:{ellipse:null,aspect:'fixed'},
	rectangle:{rounded:0},
	roundRectangle:{rounded:1,absoluteArcSize:1,arcSize:10}, // 圆角矩形,圆角设置
	triangle:{triangle:null,direction:"north"},
	diamond:{rhombus:null},
	datastore:{shape:'datastore'},
	polygon:{shape:"mxgraph.basic.pentagon"},
	hexagon:{shape:"hexagon"},
	octagon:{shape:"mxgraph.basic.octagon2",dx:10},
	pentagon:{shape:"mxgraph.basic.star"},
	sector:{shape:"mxgraph.basic.cone2",dx:0.5,dy:0.8,direction:"west"},
	sector2:{shape:"or",direction:"north"},
	cross:{shape:"cross"},
	cloud:{shape:"cloud"},
	comment:{shape:"mxgraph.basic.oval_callout"},
	braces:{shape:"braceGroup"},//=----
	parentheses:{shape:"partialRectangle",fillColor:'none',top:0,bottom:0},
	// 左右花括号;
	leftBrace:{shape:"braceLeft"},
	rightBrace:{shape:"braceRight"},
	
	apqc:{shape:"delay",direction:"north"},
	teardrop:{shape:"mxgraph.basic.three_corner_round_rect",dx:20,direction:"west"},
	singleLeftArrow:{shape:"mxgraph.arrows2.arrow",dy:0.6,dx:15,direction:"west"},
	singleRightArrow:{shape:"mxgraph.arrows2.arrow",dy:0.6,dx:15},
	doubleHorizontalArrow:{shape:"mxgraph.arrows2.twoWayArrow",dy:0.6,dx:20},
	singleUpArrow:{shape:"mxgraph.arrows2.arrow",dy:0.6,dx:15,direction:"north"},
	singleDownArrow:{shape:"mxgraph.arrows2.arrow",dy:0.6,dx:15,direction:"south"},
	doubleVerticalArrow:{shape:"mxgraph.arrows2.twoWayArrow",dy:0.6,dx:20,direction:"north"},
	backArrow:{shape:"mxgraph.arrows2.uTurnArrow",dy:10,arrowHead:50,dx2:40,direction:'south'},
	rightBackArrow:{shape:"mxgraph.arrows2.uTurnArrow",dy:10,arrowHead:50,dx2:40,direction:'north',flipV:1},
	corner:{shape:"mxgraph.basic.frame_corner",dx:10},
	basic_container:{shape:"mxgraph.basic.rect",verticalAlign:'top',rounded:1,absoluteArcSize:1,arcSize:10,_vAlign:true},

	//流程图
	process:{rounded:0},flow_process:{shape:'',},
	decision:{rhombus:null},
	terminator:{shape:"mxgraph.dfd.start"},
	flow_terminator:{shape:"mxgraph.dfd.start"},
	document:{shape:"document"},
	data:{shape:"parallelogram",perimeter:'parallelogramPerimeter',arcSize:12,size:0.25},
	predefinedProcess:{shape:"process"},
	storedData:{shape:'dataStorage'},
	internalStorage:{shape:"internalStorage",backgroundOutline:1,dx:15,dy:10,spacingLeft:18,spacingTop:10},
	sequentialData:{shape:"tapeData",perimeter:"ellipsePerimeter"},
	directData:{shape:"mxgraph.flowchart.direct_data"},
	manualInput:{shape:"manualInput"},
	card:{shape:"card"},
	paperTape:{shape:"tape"},
	display:{shape:"display"},
	manualOperation:{shape:"trapezoid",perimeter:"trapezoidPerimeter",flipV:1},
	preparation:{shape:"hexagon",perimeter:"hexagonPerimeter2",arcSize:6,size:0.2},
	parallelMode:{shape:"partialRectangle",right:0,left:0,fillColor:'none'}, // 并行模式;
	loopLimit:{shape:"loopLimit"},
	onPageReference:{shape:"mxgraph.flowchart.on-page_reference"},
	offPageReference:{shape:"offPageConnector",size:0.15},
	annotation:{shape:"mxgraph.flowchart.annotation_1",pointerEvents:1},

	actor:{shape:'umlActor',outlineConnect:0},
	useCase:{ellipse:null,},
	ovalContainer:{ellipse:null,},
	rectangleContainer:{rounded:1,absoluteArcSize:1,arcSize:10},				
	
	verticalLane:{swimlane:null,fillColor:"none",verticalAlign:"top",_fillColor:true,_vAlign:true,startSize:30,collapsible:0},
	verticalPool:{swimlane:null,verticalAlign:"top",startSize:40,spacingTop:5,_vAlign:true,collapsible:0},
	horizontalPool:{swimlane:null,horizontal:0,verticalAlign:"top",collapsible:0,startSize:30},
	verticalSeparator:{fillColor:"none",verticalAlign:"top"},
	horizontalSeparator:{fillColor:"none",verticalAlign:"top"},
	verticalSeparatorBar:{fillColor:"none",verticalAlign:"top"},
	horizontalSeparatorBar:{fillColor:"none",verticalAlign:"top"},
	group:[{group:null},{vertex:1,connectable:0}], 	// 分组
	
	// ui组件; 线条;
	ui_uiHLine:[{line:null},{vertex:1}],
	ui_uiVLine:[{line:null,direction:"south"},{vertex:1}],
	ui_uiLink:[{fillColor:"none",align:'left',whiteSpace:"wrap"},{vertex:1}],
	ui_input_uiInput:{fillColor:"#ffffff",spacingLeft:5},
	ui_uiHeading:{onlyText:true},
	ui_uiLabel:{onlyText:true},
	ui_uiTooltip:{shape:'callout',size:10,position:0.5,rounded:1},
	ui_uiBrowser:{
		swimlane:null,fillColor:"#eeeeee",verticalAlign:"top",_fillColor:true,_vAlign:true,rounded:1,
		startSize:30,collapsible:0,align:'left',spacingLeft:10,strokeWidth:1,spacingTop:2,swimlaneFillColor:'#ffffff',
	},
	ui_uiVScroll:[{
		shape:'mxgraph.mockup.navigation.scrollBar',barPos:20,direction:'north',strokeColor:'#aaaaaa',fillColor:'#ffffff',fillColor2:'#dddddd',
		verticalLabelPosition:'bottom',verticalAlign:"top",align:'center',strokeWidth:1,
	},{vertex:1}],
	ui_uiHScroll:[{
		shape:'mxgraph.mockup.navigation.scrollBar',barPos:20,strokeColor:'#aaaaaa',fillColor:'#ffffff',fillColor2:'#dddddd',
		verticalLabelPosition:'bottom',verticalAlign:"top",align:'center',strokeWidth:1,
	},{vertex:1}],
	
	ui_uiImage:[{shape:'mxgraph.mockup.graphics.simpleIcon',fillColor:'#ffffff',strokeColor:'#bbbbbb',_strokeColor:1},{vertex:1}],
	ui_uiVideo:[{shape:'mxgraph.mockup.graphics.simpleIcon',fillColor:'#ffffff',strokeColor:'#bbbbbb',_strokeColor:1},{vertex:1}],
	// ui_input_uiRadio:[{ellipse:null},{vertex:1}],

	ui_uiPieChart:{shape:'mxgraph.mockup.graphics.pieChart',verticalLabelPosition:'top',verticalAlign:"bottom"},
	ui_uiColumnChart:{shape:'mxgraph.mockup.graphics.columnChart',verticalLabelPosition:'top',verticalAlign:"bottom"},
	ui_uiLineChart:{shape:'mxgraph.mockup.graphics.lineChart',verticalLabelPosition:'top',verticalAlign:"bottom"},
	ui_uiBarChart:{shape:'mxgraph.mockup.graphics.barChart',verticalLabelPosition:'top',verticalAlign:"bottom"},
	ui_uiBubbleChart:{shape:'mxgraph.mockup.graphics.bubbleChart',verticalLabelPosition:'top',verticalAlign:"bottom"},
	
	epc_event:{shape:'hexagon'},
	// bpmn_textAnnotation:{shape:'mxgraph.flowchart.annotation_1'},
	bpmn_textAnnotation:{shape:'mxgraph.basic.polygon',polyline:1,verticalLabelPosition:'middle',verticalAlign:'middle',
		labelPosition:'center',polyCoords:'[[0.2,1],[0,1],[0,0],[0.2,0]]',align:'center',fillColor:'none',_fillColor:true,
	},
	bpmn_task:{rounded:1,absoluteArcSize:1,arcSize:10},

	// weizhu_bm_company:{},
	weizhu_bm_external_refer:{ellipse:null,fillColor:"#eeeeee"},
	weizhu_bm_external_refer_cg:{ellipse:null,fillColor:"#eeeeee"},
	weizhu_bm_external_refer_kg:{ellipse:null,fillColor:"#eeeeee"},
	weizhu_bm_external_refer_zy:{ellipse:null},
	weizhu_bm_company_jy:{rhombus:null,fillColor:"#eeeeee"},
	// weizhu_bm_company_nbly:{},
	// weizhu_bm_company_jihe:{},
	// weizhu_bm_company_tlx:{},
	
	group_bpmn:{rounded:1,absoluteArcSize:1,arcSize:10,dashed:1,fillColor:"none",strokeColor:"#666666"},
	"aws_general_user":{aws:1,shape:'mxgraph.aws3.user',fillColor:"#dddddd",verticalLabelPosition:'bottom',verticalAlign:"top"},
	"aws_general_users":{aws:1,shape:'mxgraph.aws3.users',fillColor:"#dddddd",verticalLabelPosition:'bottom',verticalAlign:"top"},
	"aws_workforce_workers":{aws:1,shape:'mxgraph.aws3.users',fillColor:"#dddddd",verticalLabelPosition:'bottom',verticalAlign:"top"},
	"aws_groups_auto scaling container":{aws:1,rounded:1,absoluteArcSize:1,arcSize:10,dashed:1,fillColor:"none",strokeColor:"#666666",strokeWidth:2},
	"aws_groups_region container":{aws:1,rounded:1,absoluteArcSize:1,arcSize:10,dashed:1,fillColor:"none",strokeColor:"#666666",strokeWidth:2},
	"aws_groups_availability zone":{aws:1,rounded:1,absoluteArcSize:1,arcSize:10,dashed:1,fillColor:"none",strokeColor:"#f58b16",strokeWidth:2},
	
	"aws_sdk_ios":{aws:1,shape:'mxgraph.aws3.android',fillColor:"#5A69A4",verticalLabelPosition:'bottom',verticalAlign:"top"},
	"aws_sdk_.net":{aws:1,shape:'mxgraph.aws3.android',fillColor:"#5A69A4",verticalLabelPosition:'bottom',verticalAlign:"top"},
	"aws_sdk_php":{aws:1,shape:'mxgraph.aws3.android',fillColor:"#5A69A4",verticalLabelPosition:'bottom',verticalAlign:"top"},
	"aws_sdk_javascript":{aws:1,shape:'mxgraph.aws3.android',fillColor:"#205E00",verticalLabelPosition:'bottom',verticalAlign:"top"},
	"aws_sdk_java":{aws:1,shape:'mxgraph.aws3.android',fillColor:"#EE472A",verticalLabelPosition:'bottom',verticalAlign:"top"},
	"aws_sdk_ruby":{aws:1,shape:'mxgraph.aws3.android',fillColor:"#AE1F23",verticalLabelPosition:'bottom',verticalAlign:"top"},
	"aws_sdk_python":{aws:1,shape:'mxgraph.aws3.android',fillColor:"#FFD44F",verticalLabelPosition:'bottom',verticalAlign:"top"},
	"aws_sdk_python (boto)":{aws:1,shape:'mxgraph.aws3.android',fillColor:"#FFD44F",verticalLabelPosition:'bottom',verticalAlign:"top"},
	"aws_sdk_xamarin":{aws:1,shape:'mxgraph.aws3.android',fillColor:"#FFD44F",verticalLabelPosition:'bottom',verticalAlign:"top"},
	
	// network
	database:{shape:"cylinder3",size:6,stokeWidth:1.5},
	"network_access point":{shape:"mxgraph.networks.wireless_modem"},
	"network_antenna":{shape:"mxgraph.networks.radio_tower"},
	"network_adsl":{shape:"mxgraph.networks.modem"},
	"network_building":{shape:"mxgraph.networks.community"},
	"network_bus":{shape:"mxgraph.networks.bus"},
	"network_network cloud":{shape:"cloud"},
	"network_comm":{shape:"mxgraph.networks.comm_link"},
	"network_dish antenna":{shape:"mxgraph.networks.satellite_dish"},
	"network_ethernet":{shape:"mxgraph.networks.switch"},
	"network_firewall":{shape:"mxgraph.networks.firewall"},
	"network_globe":{shape:"shape=mxgraph.gcp2.globe_world"},
	"network_hub":{shape:"mxgraph.networks.hub"},
	"network_ip phone":{shape:"mxgraph.networks.phone_1"},
	"network_iphone":{shape:"mxgraph.networks.mobile"},
	"network_isp":{shape:"mxgraph.networks.community"},
	"network_mac":{shape:"mxgraph.networks.terminal"},
	"network_macbook":{shape:"mxgraph.networks.laptop"},
	"network_monitor":{shape:"mxgraph.networks.monitor"},
	"network_notebook":{shape:"mxgraph.networks.laptop"},
	"network_office":{shape:"mxgraph.networks.business_center"},
	"network_pc":{shape:"mxgraph.networks.pc"},
	"network_phone":{shape:"mxgraph.networks.mobile"},
	"network_printer":{shape:"mxgraph.networks.printer"},
	"network_router":{shape:"mxgraph.networks.router"},
	"network_satellite":{shape:"mxgraph.networks.satellite"},
	"network_scanner":{shape:"mxgraph.networks.scanner"},
	"network_server":{shape:"mxgraph.networks.server"},
	// "network_signal":{shape:"mxgraph.networks."},//
	"network_tab":{shape:"mxgraph.networks.tablet"},
	
	"bpmn_group":{rounded:1,dashed:1,fillColor:'none',verticalAlign:'top'},
		
	//花括号 25,35,56 花括号处理(加入,到基础图形)
	"uml_common_package":{shape:'folder',spacingTop:10,tabWidth:90,tabHeight:26,tabPosition:'left',overflow:"fill"},//a11 ===
	"uml_common_combinedFragment":{shape:'folder',spacingTop:10,tabWidth:90,tabHeight:26,tabPosition:'left',overflow:"fill"},//a12===
	"uml_common_umlNote":{shape:"note2",boundedLbl:1,strokeWidth:2,size:15},//a13
	"uml_common_umlText":{text:null,align:'center',verticalAlign:'middle',fillColor:'none',strokeColor:"none"},//a14
	"uml_usecase_actor":{shape:"umlActor",verticalLabelPosition:"bottom",verticalAlign:"top"},//a15
	// "uml_usecase_useCase":{},//a16
	// "uml_usecase_ovalContainer":{},//a17
	"uml_usecase_rectangleContainer":{verticalAlign:"top"},//a19
	
	"uml_sequence_sequenceObject":{},//a20
	"uml_sequence_sequenceEntity":{ellipse:null,shape:"umlEntity",verticalLabelPosition:"bottom",verticalAlign:"top"},//a21
	"uml_sequence_sequenceControl":{ellipse:null,shape:"umlControl",verticalLabelPosition:"bottom",verticalAlign:"top"},//a22
	"uml_sequence_sequenceBoundary":{shape:"umlBoundary",verticalLabelPosition:"bottom",verticalAlign:"top"},//a23
	"uml_sequence_sequenceTimerSignal":[{shape:"mxgraph.flowchart.collate",verticalAlign:"top",verticalLabelPosition:"bottom"},{vertex:1}],//a24,
	"uml_sequence_sequenceConstraint":{shape:"braceGroup"},//a25
	"uml_sequence_sequenceActivation":[{rounded:1},{vertex:1}],//a26,
	"uml_sequence_sequenceLifeLine":{shape:'umlLifeline',perimeter:'lifelinePerimeter'},//a27
	"uml_sequence_sequenceDeletion":[{shape:"umlDestroy",strokeWidth:4},{vertex:1}],//a28,
	"uml_class_simpleClass":{rounded:1},//a29
	"uml_class_interface":{rounded:1,verticalAlign:"top",align:"left",overflow:"fill"},//a30
	"uml_class_cls":{rounded:1,verticalAlign:"top",align:"left",overflow:"fill"},//a31
	"uml_class_activeClass":{shape:"process",rounded:1,size:0.14,arcSize:6},//a32
	"uml_class_multiplictyClass":{rounded:1,shape:"mxgraph.basic.layered_rect",dx:8,direction:"west",flipH:1},//a33
	"uml_class_simpleInterface":{rounded:1,},//a34
	"uml_class_constraint":{shape:"braceGroup"},//a35
	"uml_class_port":[{},{vertex:1}],//a36,
	"uml_stateactivity_umlObject":{},//a37
	"uml_stateactivity_umlState":{rounded:1},//a38
	"uml_stateactivity_umlStart":{ellipse:null,fillColor:"#666666",verticalLabelPosition:"bottom",verticalAlign:"top"},//a39
	"uml_stateactivity_umlEnd":{ellipse:null,shape:"endState",fillColor:"#222222",
		strokeColor:"#222222",verticalLabelPosition:"bottom",verticalAlign:"top"},//a40
	"uml_stateactivity_flowFinal":[{shape:"sumEllipse",perimeter:"ellipsePerimeter"},{vertex:1}],//a41,
	"uml_stateactivity_simpleHistory":[{ellipse:null,fontSize:20},{vertex:1,value:"H"}],//a42,
	"uml_stateactivity_detialHistory":[{ellipse:null,fontSize:20},{vertex:1,value:"H*"}],//a43,
	"uml_stateactivity_sendSignal":{shape:"offPageConnector",size:0.25,flipV:1,flipH:0,direction:"north"},//a44
	"uml_stateactivity_receiveSignal":{shape:"mxgraph.arrows2.arrow",dy:0,dx:0,notch:20,flipH:1},//a45
	"uml_stateactivity_branchMerge":[{rhombus:null},{vertex:1}],//a46,
	"uml_stateactivity_Synchronization":[{rounded:1,fillColor:"#4E4E4E",strokeColor:"none"},{vertex:1}],//a47,
	"uml_stateactivity_stateRectangleContainer":{rounded:1,verticalAlign:"top"},//a48
	"uml_stateactivity_swimlane":{shape:"swimlane"},//a49
	"uml_stateactivity_horizontalSwimlane":{swimlane:null,horizontal:0},//a50
	"uml_deployment_devComponentNonInstance":{shape:'module',jettyWidth:18,jettyHeight:14},//a51
	"uml_deployment_devComponent":{shape:'module',jettyWidth:18,jettyHeight:14},//a52
	"uml_deployment_devNodeNonInstance":{shape:"cube",darkOpacity:0.05,darkOpacity2:0.1,fillColor:"none",direction:'south'},//a53
	"uml_deployment_devNodeInstance":{shape:"cube",darkOpacity:0.05,darkOpacity2:0.1,fillColor:"none",direction:'south'},//a54
	"uml_deployment_uml_deploymentObject":{},//a55
	"uml_deployment_uml_deploymentConstraint":{shape:"braceGroup"},//a56
	"uml_component_component":{shape:'module',jettyWidth:18,jettyHeight:14},//a57
	"uml_component_componentNodeNonInstance":{shape:"cube",darkOpacity:0.05,darkOpacity2:0.1,fillColor:"none",direction:'south'},//a58
	"uml_component_componentStart":{ellipse:null,verticalLabelPosition:"bottom",verticalAlign:"top"},//a59
	
	
	ios_icons_ios7ArrowUp:[{shape:'mxgraph.ios7.misc.up'},{vertex:1}],
	ios_icons_ios7ArrowDown:[{shape:'mxgraph.ios7.misc.down'},{vertex:1}],
	ios_icons_ios7ArrowLeft:[{shape:'mxgraph.ios7.misc.left'},{vertex:1}],
	ios_icons_ios7ArrowRight:[{shape:'mxgraph.ios7.misc.right'},{vertex:1}],
	ios_icons_ios7Arrow:[{shape:'mxgraph.ios7.misc.right'},{vertex:1}],
	ios_icons_ios7Wifi:[{shape:'mxgraph.ios7.icons.wifi'},{vertex:1}],
	ios_icons_ios7Bluetooth:[{shape:'mxgraph.ios7.icons.bluetooth'},{vertex:1}],
	ios_icons_ios7Battery:[{shape:'mxgraph.ios7.icons.battery'},{vertex:1}],
	ios_icons_ios7Siri:[{shape:'mxgraph.ios7.icons.microphone'},{vertex:1}],
};

var text2html = function(text){
	if(text.indexOf('<br>') != -1 || text.indexOf('&nbsp;') != -1) return text;
	text = htmlEncode(text);
	text = text.replace(/[\n\r]/g,'<br>');
	text = text.replace(/ /g,'&nbsp;');
	text = text.replace(/\t/g,'&nbsp;&nbsp;&nbsp;&nbsp;');
	return text;
}
window.processShapeParse = function(node,attr,style,createNodeHtml){
	var typeKey = node.category + '_' + node.name;
	if(typeKey == 'uml_common_package'){
		var title   = text2html(node.textBlock[0].text);
		var content = text2html(node.textBlock[1].text);
		node.fontStyle.bold = false;style.fontStyle = 0;
		attr.value = 
		'<p style="margin:0px;margin-top:5px;margin-left:8px;text-align:left;"><b>'+title+'</b></p>\
		<p style="margin:0px;margin-top:10px;margin-left:8px;">'+content+'</p>';
		attr.value = htmlEncode(attr.value);
	}
		
	if(typeKey == 'uml_common_combinedFragment'){
		var title   = text2html(node.textBlock[1].text);
		var content = text2html(node.textBlock[0].text);
		node.fontStyle.bold = false;style.fontStyle = 0;
		attr.value = 
		'<p style="margin:0px;margin-top:5px;margin-left:8px;text-align:left;"><b>'+title+'</b></p>\
		<p style="margin:0px;margin-top:10px;margin-left:8px;">'+content+'</p>';
		attr.value = htmlEncode(attr.value);
	}
	
	// uml 类图
	if(typeKey == 'uml_class_interface'){
		var title   = text2html(node.textBlock[0].text);
		var content = text2html(node.textBlock[1].text);
		node.fontStyle.bold = false;style.fontStyle = 0;
		attr.value = 
		'<p style="margin:0px;margin-top:5px;text-align:center;"><b>'+title+'</b></p>\
		<hr size="2"/><p style="margin:0px;margin-left:8px;">'+content+'</p>';
		attr.value = htmlEncode(attr.value);
	}
	if(typeKey == 'uml_class_cls'){
		var title   = text2html(node.textBlock[0].text);
		var content = text2html(node.textBlock[1].text);
		var content2 = text2html(node.textBlock[2].text);
		node.fontStyle.bold = false;style.fontStyle = 0;
		attr.value = 
		'<p style="margin:0px;margin-top:5px;text-align:center;"><b>'+title+'</b></p>\
		<hr size="2"/><p style="margin:0px;margin-left:8px;">'+content+'</p>\
		<hr size="2"/><p style="margin:0px;margin-left:8px;">'+content2+'</p>';
		attr.value = htmlEncode(attr.value);
	}
	
	var braceWidth = 16;
	var brace = 'shape=mxgraph.mockup.markup.curlyBrace;editable=0;deletable=0;rotatable=0;resizeHeight=1;movable=0;allowArrows=0;connectable=0;';
	if( style.shape == 'braceLeft' ){
		style.strokeColor='none';style.fillColor = 'none';style.spacingRight=20;style.align = 'right';delete style.shape;
		var theNode = {props:{x:1,y:0,w:braceWidth,h:node.props.h,relative:1,offsetX:-braceWidth}};
		var theAttr = {id:node.id+"001",value:"",vertex:"1",parent:node.id};
		node.appenNode = createNodeHtml(theNode,brace+'direction=north;',theAttr);
	}
	if( style.shape == 'braceRight' ){
		style.strokeColor='none';style.fillColor = 'none';style.spacingLeft=20;style.align = 'left';delete style.shape;
		var theNode = {props:{x:0,y:0,w:braceWidth,h:node.props.h,relative:1,offsetX:0}};
		var theAttr = {id:node.id+"001",value:"",vertex:"1",parent:node.id};
		node.appenNode = createNodeHtml(theNode,brace+'direction=south;flipV=1;',theAttr);
	}
	if( style.shape == 'braceGroup' ){
		style.strokeColor='none';style.fillColor = 'none';style.spacingLeft=15;style.spacingRight=15;delete style.shape;
		var theNode = {props:{x:0,y:0,w:braceWidth,h:node.props.h,relative:1,offsetX:0}};
		var theAttr = {id:node.id+"001",value:"",vertex:"1",parent:node.id};
		node.appenNode = createNodeHtml(theNode,brace+'direction=north;',theAttr);
		
		var theNode = {props:{x:1,y:0,w:braceWidth,h:node.props.h,relative:1,offsetX:-braceWidth}};
		var theAttr = {id:node.id+"002",value:"",vertex:"1",parent:node.id};
		node.appenNode += createNodeHtml(theNode,brace+'direction=south;flipV=1;',theAttr);
	}
}


var addShapeGroup = function(groupName,group){
	for (var key in group) {
		processShapeMap[key] = [{
			shape:"image",aspect:"fixed",align:'center',strokeColor:'none',
			verticalLabelPosition:"bottom",verticalAlign:"top",
			image:'app/icons/'+groupName + '/'+group[key],
		},{vertex:1,imageAspect:0}];
	}
}

//初始化network图标;
var addShapeGroupSlider = function(groupName,group,iconGroupMethod,iconGroupName){
	functionHook(Sidebar.prototype,iconGroupMethod,false,function(){
		var icons = [];
		var style = 'shape=image;aspect=fixed;align=center;strokeColor=none;verticalAlign=top;';
		style += 'verticalLabelPosition=bottom;imageAspect=0;image=app/icons/'+groupName+'/';
		for (var key in group) {
			var title = group[key].replace('.svg','');
			icons.push(this.createVertexTemplateEntry(style+group[key],100,100,'',title,null, null,''));
		}
		this.addPaletteFunctions(iconGroupName,groupName,false,icons);
		// console.error(123,this,arguments,groupName);
	});
}

var iconGroupAliyun = {
	// "network_server":"ECS.svg",
	
	"ali_app_service_CAS":"CAS.svg",
	"ali_app_service_MAS":"MAS.svg",
	"ali_app_service_MTS":"MTS.svg",
	"ali_app_service_OpenSearch":"OpenSearch.svg",
	"ali_app_service_PTS":"PTS.svg",
	"ali_app_service_SLS":"SLS.svg",
	"ali_database_ADS":"ADS.svg",
	"ali_database_datamanagement":"datamanagement.svg",
	"ali_database_DTS":"DTS.svg",
	"ali_database_KVStore":"KVStore.svg",
	"ali_database_mongodb":"mongodb.svg",
	"ali_database_OCS":"OCS.svg",
	"ali_database_OTS":"OTS.svg",
	"ali_database_RDS":"RDS.svg",
	"ali_devel_resource_API":"API.svg",
	"ali_devel_resource_CLI":"CLI.svg",
	"ali_devel_resource_Plugin Eclipse":"PluginEclipse.svg",
	"ali_devel_resource_Plugin Visual Studio":"PluginVisual.svg",
	"ali_domain_website_ACM":"ACM.svg",
	"ali_domain_website_AEE":"AEE.svg",
	"ali_domain_website_CVH":"CVH.svg",
	"ali_domain_website_DAW":"DAW.svg",
	"ali_domain_website_DNS":"DNS.svg",
	"ali_domain_website_FWH":"FWH.svg",
	"ali_domain_website_Website":"Website.svg",
	"ali_elastic_calc_ACE":"ACE.svg",
	"ali_elastic_calc_ECS":"ECS.svg",
	"ali_elastic_calc_ESS":"ESS.svg",
	"ali_elastic_calc_ROS":"ROS.svg",
	"ali_industry_cloud_AFC":"AFC.svg",
	"ali_industry_cloud_AGC":"AGC.svg",
	"ali_industry_cloud_AMC":"AMC.svg",
	"ali_industry_cloud_ARC":"ARC.svg",
	"ali_industry_cloud_ASC":"ASC.svg",
	"ali_industry_cloud_AWC":"AWC.svg",
	"ali_industry_cloud_GAME":"GAME.svg",
	"ali_industry_cloud_IOT":"IOT.svg",
	"ali_industry_cloud_MULTIMEDIA":"MULTIMEDIA.svg",
	"ali_industry_cloud_O2O":"O2O.svg",
	"ali_industry_cloud_STORAGE":"STORAGE.svg",
	"ali_industry_cloud_WS":"WS.svg",
	"ali_internet_midd_DRDS":"DRDS.svg",
	"ali_internet_midd_EDAS":"EDAS.svg",
	"ali_internet_midd_ONS":"ONS.svg",
	"ali_large_scale_calc_BCS":"BCS.svg",
	"ali_large_scale_calc_CDP":"CDP.svg",
	"ali_large_scale_calc_DPC":"DPC.svg",
	"ali_large_scale_calc_ODPS":"ODPS.svg",
	"ali_manage_monitor_CloudMonitoring":"CloudMonitoring.svg",
	"ali_manage_monitor_RAM":"RAM.svg",
	"ali_mobile_service_CPS":"CPS.svg",
	"ali_network_havip":"havip.svg",
	"ali_network_SLB":"SLB.svg",
	"ali_network_HSA":"HSA.svg",
	"ali_network_ACS_ali":"ACS.svg",
	"ali_network_VPC":"VPC.svg",
	"ali_other_products_ResilientNetworkIP":"ResilientNetworkIP.svg",
	"ali_other_products_Tools Image":"ToolsImage.svg",
	"ali_other_products_SAC":"SAC.svg",
	"ali_other_products_DPA":"DPA.svg",
	"ali_other_products_YSF":"YSF.svg",
	"ali_security_DDOS Basic":"DDOSBasic.svg",
	"ali_security_DDOS IP":"DDOSIP.svg",
	"ali_security_ATS":"ATS.svg",
	"ali_security_MSS":"MSS.svg",
	"ali_security_ESN":"ESN.svg",
	"ali_security_MSS2":"MSS2.svg",
	"ali_security_AGW":"AGW.svg",
	"ali_security_HSM":"HSM.svg",
	"ali_security_SCAN":"SCAN.svg",
	"ali_security_APS":"APS.svg",
	"ali_security_SAS":"SAS.svg",
	"ali_security_WAF":"WAF.svg",
	"ali_security_AYD":"AYD.svg",
	"ali_security_YPP":"YPP.svg",
	"ali_storage_cdn_OSS":"OSS.svg",
	"ali_storage_cdn_OAS":"OAS.svg",
	"ali_storage_cdn_CDN":"CDN.svg",
	"ali_storage_cdn_MNS":"MNS.svg"
};

var iconGroupAzure = {
	"azure_add ons":"Add-Ons.svg",
	"azure_alert":"Alert.svg",
	"azure_api management":"APIManagement.svg",
	"azure_automation":"Automation.svg",
	"azure_autoscale":"Autoscale.svg",
	"azure_active directory":"AzureActiveDirectory_AAD.svg",
	"azure_access control services":"AzureActiveDirectoryAccessControlServices_ACS.svg",
	"azure_load balancer":"AzureLoadBalancer.svg",
	"azure_marketplace":"AzureMarketplace.svg",
	"azure_sdk":"AzureSDK.svg",
	"azure_subscription":"AzureSubscription.svg",
	"azure_backup service":"BackupService.svg",
	"azure_batch services":"BatchServices.svg",
	"azure_bitbucket":"BitBucket_CodeSource.svg",
	"azure_biztalk services":"BizTalkServices.svg",
	"azure_cache":"Cache.svg",
	"azure_cdn":"CDN.svg",
	"azure_certificate":"Certificate.svg",
	"azure_cloud service":"CloudService.svg",
	"azure_azure cloud":"Cloud.svg",
	"azure_code file":"CodeFile.svg",
	"azure_codeplex":"Codeplex_CodeSource.svg",
	"azure_computer":"Computer.svg",
	"azure_cloud service configuration file":"CSCFG_CloudServiceConfiguration_File.svg",
	"azure_cloud service definition file":"CSDEF_CloudServiceDefinition_File.svg",
	"azure_cloud service package":"CSPKG_CloudServicePackage.svg",
	"azure_database generic":"DatabaseGeneric.svg",
	"azure_dropbox":"Dropbox_CodeSource.svg",
	"azure_enterprise":"Enterprise.svg",
	"azure_event hub":"EventHub.svg",
	"azure_express route":"ExpressRoute.svg",
	"azure_file (black)":"File_Black.svg",
	"azure_file":"File.svg",
	"azure_git deployment":"GitDeployment.svg",
	"azure_github":"GitHub_CodeSource.svg",
	"azure_hdinsight old":"HDInsightOLD.svg",
	"azure_HDInsight":"HDInsight.svg",
	"azure_health monitoring":"HealthMonitoring.svg",
	"azure_healthy":"Healthy.svg",
	"azure_laptop":"Laptop.svg",
	"azure_load balancer (generic)":"LoadBalancer_Generic.svg",
	"azure_azure machine learning":"MachineLearning.svg",
	"azure_management service":"ManagementService.svg",
	"azure_media services":"MediaServices.svg",
	"azure_azure message":"Message.svg",
	"azure_microsoft azure":"MicrosoftAzure.svg",
	"azure_mobile services":"MobileServices.svg",
	"azure_mobile":"Mobile.svg",
	"azure_multi factor authentication":"Multi-factorAuthentication_MFA.svg",
	"azure_mysql database":"MySQLDatabase.svg",
	"azure_network":"Network.svg",
	"azure_notification hub":"NotificationHub.svg",
	"azure_notification topic":"NotificationTopic.svg",
	"azure_operating system image":"OperatingSystemImage.svg",
	"azure_operational insights":"OperationalInsights.svg",
	"azure_powershell file":"PowerShellFile.svg",
	"azure_queue":"Queue.svg",
	"azure_rdp (remoteing file)":"RDP_RemoteingFile.svg",
	"azure_recovery services":"RecoveryServices.svg",
	"azure_remoteapp":"RemoteApp.svg",
	"azure_scheduler":"Scheduler.svg",
	"azure_script file":"ScriptFIle.svg",
	"azure_server rack":"ServerRack.svg",
	"azure_azure server":"Server.svg",
	"azure_service bus queues":"ServiceBusQueues.svg",
	"azure_service bus Relay":"ServiceBusRelay.svg",
	"azure_service bus topics and subscriptions":"ServiceBusTopicsandSubscriptions.svg",
	"azure_service bus":"ServiceBus.svg",
	"azure_service endpoint":"ServiceEndpoint.svg",
	"azure_service fabric":"ServiceFabric.svg",
	"azure_sql azure":"SQLAzure.svg",
	"azure_sql database (Generic)":"SQLDatabase_Generic.svg",
	"azure_sql database (sql azure)":"SQLDatabase_SQLAzure.svg",
	"azure_sql datasync":"SQLDataSync.svg",
	"azure_sql reporting":"SQLReporting.svg",
	"azure_startup file":"StartupFile.svg",
	"azure_storage blob":"StorageBlob.svg",
	"azure_storage queue":"StorageQueue.svg",
	"azure_storage table":"StorageTable.svg",
	"azure_storsimple":"StorSimple.svg",
	"azure_stream analytics":"StreamAnalytics.svg",
	"azure_table storage":"TableStorage.svg",
	"azure_tablet":"Tablet.svg",
	"azure_traffic manager":"TrafficManager.svg",
	"azure_unidentified code object":"UnidentifiedCodeObject_UFO.svg",
	"azure_User":"User.svg",
	"azure_vhd data disk":"VHDDataDisk.svg",
	"azure_vhd":"VHD.svg",
	"azure_virtual machine elasticSearch":"VirtualMachine-ElasticSearch.svg",
	"azure_virtual machine":"VirtualMachine.svg",
	"azure_virtual machines":"VirtualMachines.svg",
	"azure_visual studio":"VisualStudio.svg",
	"azure_wad (diagnostics) config (sdk 2.5)":"WAD_Diagnostics_Config_SDK2.5.svg",
	"azure_wad (diagnostics) config (sdk 2.6+)":"WAD_Diagnostics_Config_SDK2.6.svg",
	"azure_web role":"WebRole.svg",
	"azure_web roles":"WebRoles.svg",
	"azure_web sites":"WebSites.svg",
	"azure_website (generic)":"Website_Generic.svg",
	"azure_windows azure":"WindowsAzure.svg",
	"azure_worker role":"WorkerRole.svg",
	"azure_worker roles":"WorkerRoles.svg"
}
var iconGroupIOS = {
    "ios_devices_iPhone5Black": "iphone_black.png",
    "ios_devices_iPhoneGold": "iphone_gold.png",
    "ios_devices_iPhoneWhite": "iphone_white.png",
    "ios_devices_ios7DefaultBg": "bg_default.png",
    "ios_devices_ios7SpaceBg": "bg_space.png",
    "ios_devices_ios7GrassBg": "bg_grass.png",
    "ios_devices_ios7MountainBg": "bg_mountain.png",
    "ios_controls_ios7SwitchOn": "switch_on.png",
    "ios_controls_ios7SwitchOff": "switch_off.png",
    "ios_controls_ios7Sort": "sort.png",
    "ios_icons_ios7AddBlack": "add_black.svg",
    "ios_icons_ios7AddBlackLight": "add_black_light.svg",
    "ios_icons_ios7AddGreen": "add_green.svg",
    "ios_icons_ios7AddNormal": "add.svg",
    "ios_icons_ios7RemoveBlack": "remove_black.svg",
    "ios_icons_ios7RemoveBlackLight": "remove_black_light.svg",
    "ios_icons_ios7RemoveRed": "remove_red.svg",
    "ios_icons_ios7AddSmall": "add_small.svg",
    "ios_icons_ios7Close1": "close1.svg",
    "ios_icons_ios7Close2": "close2.svg",
    "ios_icons_ios7Close3": "close3.svg",
    "ios_icons_ios7Close4": "close4.svg",
    "ios_icons_ios7Refresh": "refresh.svg",
    "ios_icons_ios7SearchIcon": "search.svg",
    "ios_icons_ios7SearchBig": "search_big.svg",
    "ios_icons_ios7Info1": "info1.svg",
    "ios_icons_ios7Info2": "info2.svg",
    "ios_icons_ios7Info3": "info3.svg",
    "ios_icons_ios7Check1": "check1.svg",
    "ios_icons_ios7Check2": "check2.svg",
    "ios_icons_ios7Check3": "check3.svg",
    "ios_icons_ios7Check4": "check4.svg",
    "ios_icons_ios7Check5": "check5.svg",
    "ios_icons_ios7Play1": "play1.svg",
    "ios_icons_ios7Play2": "play2.svg",
    "ios_icons_ios7Pause1": "pause1.svg",
    "ios_icons_ios7Pause2": "pause2.svg",
    "ios_icons_ios7Stop2": "stop2.svg",
    "ios_icons_ios7Stop3": "stop3.svg",
    "ios_icons_ios7Stop1": "stop1.svg",
    "ios_icons_ios7Favourite": "favourite.svg",
    "ios_icons_ios7Favourite1": "favourite1.svg",
    "ios_icons_ios7Heart": "heart.svg",
    "ios_icons_ios7Bookmark": "bookmark.svg",
    "ios_icons_ios7Profile": "profile.svg",
    "ios_icons_ios7Copy": "copy.svg",
    "ios_icons_ios7Upload": "action.svg",
    "ios_icons_ios7Wifi": "wifi.svg",
    "ios_icons_ios7Bluetooth": "bluetooth.svg",
    "ios_icons_ios7Battery": "battery.svg",
    "ios_icons_ios7Lock": "lock.svg",
    "ios_icons_ios7Camera": "camera.svg",
    "ios_icons_ios7Sound": "sound.svg",
    "ios_icons_ios7Download": "download.svg",
    "ios_icons_ios7Video": "face.svg",
    "ios_icons_ios7ListIcon": "list.svg",
    "ios_icons_ios7Locate": "locate.svg",
    "ios_icons_ios7Trash": "trash.svg",
    "ios_icons_ios7Help": "help.svg",
    "ios_icons_ios7AlertIcon": "alert.svg",
    "ios_icons_ios7Clock": "clock.svg",
    "ios_icons_ios7Phone": "phone.svg",
    "ios_icons_ios7Message": "message.svg",
    "ios_icons_ios7Mail": "mail.svg"
};

var iconGroupCisco = {
    "cisco_bulidings_branch office": "branchOffice.svg",
    "cisco_bulidings_end office": "endOffice.svg",
    "cisco_bulidings_generic building": "genericBuilding.svg",
    "cisco_bulidings_government building": "governmentBuilding.svg",
    "cisco_bulidings_mdu": "mdu.svg",
    "cisco_bulidings_small business": "smallBusiness.svg",
    "cisco_bulidings_telecommuter house": "telecommuterHouse.svg",
    "cisco_bulidings_telecommuter house pc": "telecommuterHousePC.svg",
    "cisco_bulidings_university": "university.svg",
    "cisco_computers_peripherals_ibm mainframe": "ibmMainframe.svg",
    "cisco_computers_peripherals_ibm mini as400": "ibmMiniAS400.svg",
    "cisco_computers_peripherals_ibm tower": "ibmTower.svg",
    "cisco_computers_peripherals_cisco laptop": "laptop.svg",
    "cisco_computers_peripherals_macintosh": "macintosh.svg",
    "cisco_computers_peripherals_microphone": "microphone.svg",
    "cisco_computers_peripherals_cisco pc": "pc.svg",
    "cisco_computers_peripherals_pc adapter card": "pcAdapterCard.svg",
    "cisco_computers_peripherals_pc routercard": "pcRoutercard.svg",
    "cisco_computers_peripherals_cisco printer": "printer.svg",
    "cisco_computers_peripherals_cisco scanner": "scanner.svg",
    "cisco_computers_peripherals_speaker": "speaker.svg",
    "cisco_computers_peripherals_sun workstation": "sunWorkstation.svg",
    "cisco_computers_peripherals_supercomputer": "supercomputer.svg",
    "cisco_computers_peripherals_cisco tablet": "tablet.svg",
    "cisco_computers_peripherals_terminal": "terminal.svg",
    "cisco_computers_peripherals_upc": "upc.svg",
    "cisco_computers_peripherals_video camera": "videoCamera.svg",
    "cisco_computers_peripherals_web browser": "webBrowser.svg",
    "cisco_computers_peripherals_workstation": "workstation.svg",
    "cisco_control_module_10ge fcoe": "10GE_FCoE.svg",
    "cisco_control_module_3174 (desktop)": "3174_desktop.svg",
    "cisco_control_module_3x74 (floor)": "3x74_floor.svg",
    "cisco_control_module_content switch module": "contentSwitchModule.svg",
    "cisco_control_module_firewall service module (fwsm)": "firewallServiceModule_fwsm.svg",
    "cisco_control_module_service module": "ServiceModule.svg",
    "cisco_control_module_system controller": "systemController.svg",
    "cisco_control_module_virtual switch controller (vsc3000)": "virtualSwitchController_vsc3000.svg",
    "cisco_directors_content engine (cache director)": "contentEngine_cacheDirector.svg",
    "cisco_directors_director-class fibre channel director": "director-classFibreChannelDirector.svg",
    "cisco_directors_distributed director": "distributedDirector.svg",
    "cisco_directors_localdirector": "localdirector.svg",
    "cisco_directors_workgroup director": "workgroupDirector.svg",
    "cisco_hubs_gateways_100baset hub": "100basetHub.svg",
    "cisco_hubs_gateways_access gateway": "accessGateway.svg",
    "cisco_hubs_gateways_cisco hub": "ciscoHub.svg",
    "cisco_hubs_gateways_generic gateway": "genericGateway.svg",
    "cisco_hubs_gateways_cisco_hub": "hub.svg",
    "cisco_hubs_gateways_mas gateway": "masGateway.svg",
    "cisco_hubs_gateways_small hub": "smallHub.svg",
    "cisco_hubs_gateways_universal gateway": "universalGateway.svg",
    "cisco_hubs_gateways_cisco vpn gateway": "vpnGateway.svg",
    "cisco_misc_15200": "15200.svg",
    "cisco_misc_7500ars (7513)": "7500ars_7513.svg",
    "cisco_misc_6700 series": "6700Series.svg",
    "cisco_misc_cisco access point": "accesspoint.svg",
    "cisco_misc_ace": "ace.svg",
    "cisco_misc_ACS": "ACS.svg",
    "cisco_misc_adm": "adm.svg",
    "cisco_misc_cisco asa 5500": "ciscoAsa5500.svg",
    "cisco_misc_asic processor": "asicProcessor.svg",
    "cisco_misc_asr 1000 series": "ASR1000Series.svg",
    "cisco_misc_ata": "ata.svg",
    "cisco_misc_atm 3800": "atm3800.svg",
    "cisco_misc_avs": "avs.svg",
    "cisco_misc_axp": "AXP.svg",
    "cisco_misc_bbsm": "bbsm.svg",
    "cisco_misc_breakout box": "breakoutBox.svg",
    "cisco_misc_bridge": "bridge.svg",
    "cisco_misc_bts 10200": "bts10200.svg",
    "cisco_misc_call manager": "callmanager.svg",
    "cisco_misc_car": "car.svg",
    "cisco_misc_carrier routing system": "carrierRoutingSystem.svg",
    "cisco_misc_cddi fddi": "cddi-fddi.svg",
    "cisco_misc_cdm": "cdm.svg",
    "cisco_misc_cisco 1000": "cisco1000.svg",
    "cisco_misc_cisco ca": "ciscoCa.svg",
    "cisco_misc_cisco unityexpress": "ciscoUnityexpress.svg",
    "cisco_misc_cisco works": "ciscoworks.svg",
    "cisco_misc_contact center": "contactCenter.svg",
    "cisco_misc_content transformation engine (cte)": "contentTransformationEngine_cte.svg",
    "cisco_misc_CS MARS": "cs-mars.svg",
    "cisco_misc_CSM S": "csm-s.svg",
    "cisco_misc_CSU DSU": "csu_dsu.svg",
    "cisco_misc_CUBE": "CUBE.svg",
    "cisco_misc_detector": "detector.svg",
    "cisco_misc_dot-dot": "dot-dot.svg",
    "cisco_misc_dpt": "dpt.svg",
    "cisco_misc_dslam": "dslam.svg",
    "cisco_misc_dual mode": "dualModeAp.svg",
    "cisco_misc_dwdm filter": "dwdmFilter.svg",
    "cisco_misc_fddi ring": "fddiRing.svg",
    "cisco_misc_front end processor": "frontEndProcessor.svg",
    "cisco_misc_general applicance": "generalApplicance.svg",
    "cisco_misc_generic processor": "genericProcessor.svg",
    "cisco_misc_h 323": "h.323.svg",
    "cisco_misc_handheld": "handheld.svg",
    "cisco_misc_hp mini": "hpMini.svg",
    "cisco_misc_icm": "icm.svg",
    "cisco_misc_ics": "ics.svg",
    "cisco_misc_internet streamer": "internetStreamer.svg",
    "cisco_misc_ios slb": "iosSlb.svg",
    "cisco_misc_ip": "ip.svg",
    "cisco_misc_iptc": "iptc.svg",
    "cisco_misc_iptv content manager": "iptvContentManager.svg",
    "cisco_misc_ip communicator": "ipCommunicator.svg",
    "cisco_misc_ip dsl": "ipDsl.svg",
    "cisco_misc_itp": "itp.svg",
    "cisco_misc_jbod": "jbod.svg",
    "cisco_misc_key": "key.svg",
    "cisco_misc_keys": "keys.svg",
    "cisco_misc_lan to lan": "lanToLan.svg",
    "cisco_misc_lightweight ap": "lightweightAp.svg",
    "cisco_misc_longreach cpe": "longreachCpe.svg",
    "cisco_misc_MAU": "mau.svg",
    "cisco_misc_mcu": "mcu.svg",
    "cisco_misc_me 1100": "me1100.svg",
    "cisco_misc_mediator": "Mediator.svg",
    "cisco_misc_meetingplace": "meetingplace.svg",
    "cisco_misc_mesh ap": "meshAp.svg",
    "cisco_misc_metro 1500": "metro1500.svg",
    "cisco_misc_mini vax": "miniVax.svg",
    "cisco_misc_mobile streamer": "mobileStreamer.svg",
    "cisco_misc_mse": "MSE.svg",
    "cisco_misc_mux": "mux.svg",
    "cisco_misc_mxe": "MXE.svg",
    "cisco_misc_nac appliance": "nacAppliance.svg",
    "cisco_misc_nce": "NCE.svg",
    "cisco_misc_netranger": "netranger.svg",
    "cisco_misc_netsonar": "netsonar.svg",
    "cisco_misc_network management": "networkManagement.svg",
    "cisco_misc_nexus 1000": "Nexus1000.svg",
    "cisco_misc_nexus 2000": "Nexus2000.svg",
    "cisco_misc_nexus 5000": "Nexus5000.svg",
    "cisco_misc_nexus 7000": "Nexus7000.svg",
    "cisco_misc_octel": "octel.svg",
    "cisco_misc_ons15500": "ons15500.svg",
    "cisco_misc_optical amplifier": "opticalAmplifier.svg",
    "cisco_misc_optical transport": "opticalTransport.svg",
    "cisco_misc_pad 1": "padX.28.svg",
    "cisco_misc_pad 2": "pad.svg",
    "cisco_misc_page icon": "pageIcon.svg",
    "cisco_misc_pbx": "pbx.svg",
    "cisco_misc_pc software": "pcSoftware.svg",
    "cisco_misc_pc video": "pcVideo.svg",
    "cisco_misc_pda": "pda.svg",
    "cisco_misc_pmc": "pmc.svg",
    "cisco_misc_protocol translator": "protocolTranslator.svg",
    "cisco_misc_pxf": "pxf.svg",
    "cisco_misc_ratemux": "ratemux.svg",
    "cisco_misc_repeater": "repeater.svg",
    "cisco_misc_route switch processor": "routeSwitchProcessor.svg",
    "cisco_misc_rpsrps": "rpsrps.svg",
    "cisco_misc_safeharbor icon": "safeharborIcon.svg",
    "cisco_misc_service control": "serviceControl.svg",
    "cisco_misc_services": "Services.svg",
    "cisco_misc_set top box": "SetTopBox.svg",
    "cisco_misc_ssc": "ssc.svg",
    "cisco_misc_ssl terminator": "sslTerminator.svg",
    "cisco_misc_stb": "stb.svg",
    "cisco_misc_stp": "stp.svg",
    "cisco_misc_streamer": "streamer.svg",
    "cisco_misc_svx": "svx.svg",
    "cisco_misc_telecommuter icon": "telecommuterIcon.svg",
    "cisco_misc_token": "token.svg",
    "cisco_misc_tp mcu": "TPMCU.svg",
    "cisco_misc_transpath": "transpath.svg",
    "cisco_misc_truck": "truck.svg",
    "cisco_misc_turret": "turret.svg",
    "cisco_misc_tv": "tv.svg",
    "cisco_misc_ubr910": "ubr910.svg",
    "cisco_misc_umg series": "umgSeries.svg",
    "cisco_misc_ups": "ups.svg",
    "cisco_misc_vault": "vault.svg",
    "cisco_misc_vip": "vip.svg",
    "cisco_misc_vpn concentrator": "vpnConcentrator.svg",
    "cisco_misc_vsd": "VSD.svg",
    "cisco_misc_vss": "VSS.svg",
    "cisco_misc_wae": "wae.svg",
    "cisco_misc_wism": "wism.svg",
    "cisco_modems_phones_cable modem": "cableModem.svg",
    "cisco_modems_phones_cellular phone": "cellularPhone.svg",
    "cisco_modems_phones_fax": "fax.svg",
    "cisco_modems_phones_hootphone": "hootphone.svg",
    "cisco_modems_phones_cisco ip phone": "ipPhone.svg",
    "cisco_modems_phones_mobile access ip phone": "mobileAccessIpPhone.svg",
    "cisco_modems_phones_modem": "modem.svg",
    "cisco_modems_phones_cisco phone": "phone.svg",
    "cisco_modems_phones_phone fax": "phone_fax.svg",
    "cisco_modems_phones_RF modem": "RFModem.svg",
    "cisco_modems_phones_softphone": "softphone.svg",
    "cisco_people_androgenous person": "androgenousPerson.svg",
    "cisco_people_mac woman": "macWoman.svg",
    "cisco_people_man woman": "man_woman.svg",
    "cisco_people_pc man": "pcMan.svg",
    "cisco_people_running man": "runningMan.svg",
    "cisco_people_sitting woman": "sittingWoman.svg",
    "cisco_people_standing man": "standingMan.svg",
    "cisco_people_standing woman": "standingWoman.svg",
    "cisco_routers_10700": "10700.svg",
    "cisco_routers_3200 mobile access router": "3200MobileAccessRouter.svg",
    "cisco_routers_atm router": "atmRouter.svg",
    "cisco_routers_atm tag switch router": "atmTagSwitchRouter.svg",
    "cisco_routers_broadband router": "broadbandRouter.svg",
    "cisco_routers_content service router": "contentServiceRouter.svg",
    "cisco_routers_gigabit switch atm tag router": "gigabitSwitchAtmTagRouter.svg",
    "cisco_routers_iad router": "iadRouter.svg",
    "cisco_routers_ip telephony router": "ipTelephonyRouter.svg",
    "cisco_routers_iscsi router": "iscsiRouter.svg",
    "cisco_routers_mobile access router": "mobileAccessRouter.svg",
    "cisco_routers_nce router": "NCERouter.svg",
    "cisco_routers_netflow router": "netflowRouter.svg",
    "cisco_routers_optical services router": "opticalServicesRouter.svg",
    "cisco_routers_router with silicon switch": "routerWithSiliconSwitch.svg",
    "cisco_routers_cisco router": "router.svg",
    "cisco_routers_router in building": "routerinBuilding.svg",
    "cisco_routers_service router": "ServiceRouter.svg",
    "cisco_routers_space router": "SpaceRouter.svg",
    "cisco_routers_storage router": "storageRouter.svg",
    "cisco_routers_tdm router": "tdmRouter.svg",
    "cisco_routers_voice router": "voiceRouter.svg",
    "cisco_routers_wavelength router": "wavelengthRouter.svg",
    "cisco_routers_wireless router": "wirelessRouter.svg",
    "cisco_security_centri firewall": "centriFirewall.svg",
    "cisco_security_cisco security": "ciscosecurity.svg",
    "cisco_security_cisco firewall": "firewall.svg",
    "cisco_security_gatekeeper": "gatekeeper.svg",
    "cisco_security_guard": "guard.svg",
    "cisco_security_ios firewall": "iosFirewall.svg",
    "cisco_security_lock": "lock.svg",
    "cisco_security_pix firewall": "pixFirewall.svg",
    "cisco_security_router Firewall": "router_firewall.svg",
    "cisco_servers_cisco unified presence server": "ciscoUnifiedPresenceServer.svg",
    "cisco_servers_communications server": "communicationsServer.svg",
    "cisco_servers_directory server": "directoryServer.svg",
    "cisco_servers_file server": "fileServer2.svg",
    "cisco_servers_fileserver": "fileserver.svg",
    "cisco_servers_host": "host.svg",
    "cisco_servers_iptv server": "iptvServer.svg",
    "cisco_servers_microwebserver": "microwebserver.svg",
    "cisco_servers_moh server": "mohServer.svg",
    "cisco_servers_server with router": "serverWithRouter.svg",
    "cisco_servers_sip proxy werver": "sipProxyWerver.svg",
    "cisco_servers_software based server": "softwareBasedServer.svg",
    "cisco_servers_standard host": "standardHost.svg",
    "cisco_servers_storage server": "storageServer.svg",
    "cisco_servers_unity server": "unityServer.svg",
    "cisco_servers_voice commserver": "voiceCommserver.svg",
    "cisco_servers_www server": "wwwServer.svg",
    "cisco_storage_cisco file engine": "ciscoFileEngine.svg",
    "cisco_storage_cisco cloud": "cloud.svg",
    "cisco_storage_diskette": "diskette.svg",
    "cisco_storage_fc storage": "fcStorage.svg",
    "cisco_storage_fibre channel disk subsystem": "fibreChannelDiskSubsystem.svg",
    "cisco_storage_file cabinet": "fileCabinet.svg",
    "cisco_storage_relational database": "relationalDatabase.svg",
    "cisco_storage_tape array": "tapeArray.svg",
    "cisco_storage_web cluster": "webCluster.svg",
    "cisco_switches_atm fast gigabit etherswitch": "atmFastGigabitEtherswitch.svg",
    "cisco_switches_atm switch": "atmSwitch.svg",
    "cisco_switches_class 4 5 switch": "class4_5Switch.svg",
    "cisco_switches_content service switch 1100": "contentServiceSwitch1100.svg",
    "cisco_switches_content switch": "contentSwitch.svg",
    "cisco_switches_fibre channel fabric switch": "fibreChannelFabricSwitch.svg",
    "cisco_switches_generic softswitch": "genericSoftswitch.svg",
    "cisco_switches_intelliswitch stack": "intelliswitchStack.svg",
    "cisco_switches_isdn switch": "isdnSwitch.svg",
    "cisco_switches_layer 2 remote switch": "layer2RemoteSwitch.svg",
    "cisco_switches_layer 3 switch": "layer3Switch.svg",
    "cisco_switches_mgx 8000 multiservice switch": "mgx8000MultiserviceSwitch.svg",
    "cisco_switches_mulitswitch device": "mulitswitchDevice.svg",
    "cisco_switches_multi-fabric server switch": "multi-fabricServerSwitch.svg",
    "cisco_switches_multilayer remote switch": "multilayerRemoteSwitch.svg",
    "cisco_switches_pbx switch": "pbxSwitch.svg",
    "cisco_switches_programmable switch": "programmableSwitch.svg",
    "cisco_switches_server switch": "serverSwitch.svg",
    "cisco_switches_simulitlayer switch": "simulitlayerSwitch.svg",
    "cisco_switches_softswitch pgw mgc": "softswitchPgwMgc.svg",
    "cisco_switches_virtual layer switch": "virtualLayerSwitch.svg",
    "cisco_switches_voice atm switch": "voiceAtmSwitch.svg",
    "cisco_switches_voice switch": "voiceSwitch.svg",
    "cisco_switches_workgroup switch": "workgroupSwitch.svg",
    "cisco_wireless_cisco antenna": "antenna.svg",
    "cisco_wireless_ground terminal": "GroundTerminal.svg",
    "cisco_wireless_radio tower": "radioTower.svg",
    "cisco_wireless_sattelite dish": "satteliteDish.svg",
    "cisco_wireless_sattelite": "sattelite.svg",
    "cisco_wireless_wi-fi tag": "wi-fiTag.svg",
    "cisco_wireless_wireless bridge": "wirelessBridge.svg",
    "cisco_wireless_wireless location appliance": "wirelessLocationAppliance.svg",
    "cisco_wireless_wireless transport": "wirelessTransport.svg",
    "cisco_wireless_wireless": "wireless.svg",
    "cisco_wireless_wlan controller": "wlanController.svg"
};

addShapeGroup('aliyun',iconGroupAliyun);
// addShapeGroupSlider('Aliyun',iconGroupAliyun,'addNetworkPalette','network1');

addShapeGroup('azure',iconGroupAzure);
// addShapeGroupSlider('Azure',iconGroupAzure,'addNetworkPalette','network1');

addShapeGroup('ios',iconGroupIOS);
addShapeGroup('cisco',iconGroupCisco);
// addShapeGroupSlider('IOS',iconGroupAzure,'addNetworkPalette','network1');