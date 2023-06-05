<?php

class emlViewerPlugin extends PluginBase{
	function __construct(){
		parent::__construct();
	}
	public function regist(){
		$this->hookRegist(array(
			'user.commonJs.insert' => 'emlViewerPlugin.echoJs',
		));
	}
	public function echoJs(){
		$this->echoFile('static/app/main.js');
	}
	public function index(){
		$fileUrl  = $this->filePathLink($this->in['path']);
		$fileName = $this->in['name'].' - '.LNG('common.copyright.name').LNG('common.copyright.powerBy');
		include($this->pluginPath.'/php/index.html');
	}
}