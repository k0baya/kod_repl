<?php

class googleDocsPlugin extends PluginBase{
	function __construct(){
		parent::__construct();
	}
	public function regist(){
		$this->hookRegist(array(
			'user.commonJs.insert'	=> 'googleDocsPlugin.echoJs'
		));
	}
	public function echoJs(){
		$this->echoFile('static/main.js');
	}
	public function index(){
		$fileUrl  = $this->filePathLinkOut($this->in['path']);
		$api = "https://docs.google.com/viewer?url=";
		header('Location:'.$api.rawurlencode($fileUrl));
	}
}