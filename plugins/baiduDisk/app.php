<?php

/**
 * 百度网盘存储对接
 * http://developer.baidu.com/console#app/project
 * https://pan.baidu.com/union/document/entrance
 */
class baiduDiskPlugin extends PluginBase{
	function __construct(){
		parent::__construct();
	}
	
	public function regist(){
		$this->hookRegist(array(
			'globalRequest'					=> 'baiduDiskPlugin.autoRun',
			'user.commonJs.insert'			=> 'baiduDiskPlugin.echoJs',
			// 'admin.plugin.setconfig.before'	=> 'baiduDiskPlugin.appSetBefore',
			'admin.storage.add.before'		=> 'baiduDiskPlugin.storeBefore',
			'admin.storage.edit.before'		=> 'baiduDiskPlugin.storeBefore',
			'baidu.refresh.token'			=> 'baiduDiskPlugin.refreshToken',
		));
	}
	public function autoRun(){
		include_once($this->pluginPath.'lib/PathDriverBaidu.class.php');
	}
	public function echoJs(){
		$this->echoFile('static/main.js');
	}
	// 切换插件状态
	public function onChangeStatus($status){
		if(!_get($GLOBALS,'isRoot')) show_json(LNG('explorer.noPermissionAction'),false);
		if($status != '1') return;
		$this->refreshClient();
	}
	
	public function appSetBefore(){
		if($this->in['app'] != $this->pluginName) return;
		if(!_get($GLOBALS,'isRoot')) show_json(LNG('explorer.noPermissionAction'),false);
	}
	
	// 每次启用时，重新获取client_id
	private function refreshClient(){
		$data = array(
			'state' => json_encode(array(
				'type'		=> 'baidu',
				'client_id' => '',
			))
		);
		$url = $GLOBALS['config']['settings']['kodApiServer'] . 'plugin/platform/';
		$res = url_request($url, 'POST', $data);
		$data = json_decode($res['data'], true);

		$clientID = $data['code'] ? $data['data'] : '';
		$this->setConfig(array('client_id' => $clientID));
	}

	// 获取网盘应用client_id（AppKey）
	public function clientId(){
		$config = $this->getConfig();
		$clientID = isset($config['client_id']) ? $config['client_id'] : '';
		if(!$clientID){$this->refreshClient();}
		show_json($clientID);
	}

	/**
	 * 存储新增/编辑前，数据处理
	 * @return void
	 */
	public function storeBefore(){
		$driver = Input::get('driver');
		if(!$driver || strtolower($driver) != 'baidu') return;

		$config = Input::get('config', 'json');
		if($config['auth'] != '1') show_json('未开启账号授权！', false);
		$valids = array('access_token', 'refresh_token', 'token_expire_time');
		foreach($valids as $name) {
			if(empty($config[$name])) show_json('授权信息有误，请尝试重新授权', false);
		}
		$name = Input::get('name', 'require');
		$config['name'] = $name;	// 存储中触发刷新token时，name作为查找条件
		// $config['ioUploadServer']	= 1;
		// $config['ioFileOutServer']	= 1;

		// 编辑
		if (isset($this->in['editForce'])) {
			unset($this->in['editForce']);
		}
		$this->in['config'] = json_encode($config);
	}

	/**
	 * 刷新accessToken
	 * @param [type] $name
	 * @return void
	 */
	public function refreshToken($name){
		$model = Model('Storage');
		$store = $model->findByName($name);
		if(!$store) return;
		$config = $model->getConfig($store['id']);

		// api请求刷新access_token
		$data = array(
			'state' => json_encode(array(
				'type'			=> 'baidu',
				'refresh_token'	=> $config['refresh_token'],
			))
		);
		$url = $GLOBALS['config']['settings']['kodApiServer'] . 'plugin/platform/';
		$res = url_request($url, 'POST', $data);

		$data = json_decode($res['data'], true);
		if(!$data['code'] || !$data['data']) return;	// 刷新失败
		$token = json_decode($data['data'], true);
		if(!$token) return;

		$valids = array('access_token', 'refresh_token', 'token_expire_time');
		foreach($valids as $name) {
			if(empty($token[$name])) return;
			$config[$name] = $token[$name];
		}
		// 更新存储
		$store['config'] = json_encode($config);
		$model->update($store['id'], $store);

		return $token;
	}
}