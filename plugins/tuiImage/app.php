<?php

/**
 * 图片编辑器:
 * 源码: https://github.com/nhn/tui.image-editor
 * demo: http://ui.toast.com/tui-image-editor
 */
class tuiImagePlugin extends PluginBase{
	function __construct(){
		parent::__construct();
	}
	public function regist(){
		$this->hookRegist(array(
			'user.commonJs.insert'		=> 'tuiImagePlugin.echoJs'
		));
	}
	public function echoJs(){
		$this->echoFile('static/app/main.js');
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
		$this->display($this->pluginPath.'static/app/template.html');
	}
}