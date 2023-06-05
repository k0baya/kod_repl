<?php
class webConsolePlugin extends PluginBase{
	function __construct(){
		parent::__construct();
	}
	public function regist(){
		$this->hookRegist(array('user.commonJs.insert'=> 'webConsolePlugin.echoJs'));
	}
	public function echoJs(){
		if(_get($GLOBALS,'isRoot') != 1) return;
		$this->echoFile('static/main.js');
	}
}