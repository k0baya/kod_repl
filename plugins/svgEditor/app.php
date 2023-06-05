<?php

/**
 * svg编辑器:
 * Method-Draw源码: https://github.com/methodofaction/Method-Draw
 * demo: https://editor.method.ac/
 * 
 * 下载最新源码,删除font字体; 从头demo下载all.css和all.js
 * all.js更改: 
 * 		new $.SvgCanvas(...前加入 $BODY.trigger('pageLoad');//add by warlee;
 * 		var categories 定义后加入 $BODY.trigger('shapeListMake',categories);//add by warlee;
 */
class svgEditorPlugin extends PluginBase{
	function __construct(){
		parent::__construct();
	}
	public function regist(){
		$this->hookRegist(array(
			'user.commonJs.insert'		=> 'svgEditorPlugin.echoJs'
		));
	}
	public function echoJs(){
		$this->echoFile('static/main.js');
	}
	public function index(){
		$path   = $this->in['path'];
		$assign = array(
			"fileUrl"	=>'','savePath'	=>'','canWrite'	=>false,
			'fileName'	=> $this->in['name']
		);
		if($path){
			if(substr($path,0,4) == 'http'){
				$assign['fileUrl'] = $path;
			}else{
				$assign['fileUrl']  = $this->filePathLink($path);
				if(ActionCall('explorer.auth.fileCanWrite',$path)){
					$assign['savePath'] = $path;
					$assign['canWrite'] = true;
				}
			}
		}
		$this->assign($assign);
		$this->display($this->pluginPath.'static/template.html');
	}
}