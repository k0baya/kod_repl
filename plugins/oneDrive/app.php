<?php

/**
 * OneDrive存储对接
 * https://docs.microsoft.com/zh-cn/onedrive/developer/rest-api/getting-started/graph-oauth?view=odsp-graph-online
 * https://github.com/dotnet/AspNetCore.Docs/issues/19795
 * https://docs.microsoft.com/zh-cn/azure/active-directory/develop/supported-accounts-validation
 */
class oneDrivePlugin extends PluginBase{
	function __construct(){
		parent::__construct();
	}
	
	public function regist(){
		$this->hookRegist(array(
			'globalRequest'					=> 'oneDrivePlugin.autoRun',
			'user.commonJs.insert'			=> 'oneDrivePlugin.echoJs',
			// 'admin.plugin.setconfig.before'	=> 'oneDrivePlugin.appSetBefore',
			'admin.storage.add.before'		=> 'oneDrivePlugin.storeBefore',
			'admin.storage.edit.before'		=> 'oneDrivePlugin.storeBefore',
			'onedrive.refresh.token'		=> 'oneDrivePlugin.refreshToken',
		));
	}
	public function autoRun(){
		include_once($this->pluginPath.'lib/PathDriverOneDrive.class.php');
	}
	public function echoJs(){
		$this->echoFile('static/main.js');
	}

	public function onSetConfig($config){
		if (empty($config['intClientID'])) {
			$config['intClientID'] = $this->getIntClient();
		}
		return $config;
	}

	// 国际版client_id获取
	public function getIntClient(){
		$data = array(
			'state' => json_encode(array(
				'type'		=> 'onedrive',
				'client_id'	=> '',
			))
		);
		$url = $this->callbackUrl();
		$res = url_request($url, 'POST', $data);
		$data = json_decode($res['data'], true);
		return $data['code'] ? $data['data'] : '';
	}

	// 切换插件状态，更新int.client_id
	public function onChangeStatus($status){
		if(!_get($GLOBALS,'isRoot')) show_json(LNG('explorer.noPermissionAction'),false);
		if($status != '1') return;
		// 更新int.client_id
		if ($client_id = $this->getIntClient()) {
			$this->setConfig(array('intClientID' => $client_id));
		}
	}
	public function appSetBefore(){
		if($this->in['app'] != $this->pluginName) return;
		if(!_get($GLOBALS,'isRoot')) show_json(LNG('explorer.noPermissionAction'),false);
	}

	// 获取网盘应用client_id（AppKey）
	public function clientId(){
		$type = Input::get('type', 'require', 'int');
		$config = $this->getConfig();
		$clientID = $type.'ClientID';
		$client_id = isset($config[$clientID]) ? $config[$clientID] : '';
		// 国际版没有时更新
		if ($type == 'int' && !$client_id) {
			if ($client_id = $this->getIntClient()) {
				$this->setConfig(array($clientID => $client_id));
			}
		}
		if (!$client_id) show_json('OneDrive信息异常，请检查插件配置', false);
		show_json($client_id);
	}

	/**
	 * 存储新增/编辑前，数据处理
	 * @return void
	 */
	public function storeBefore(){
		$driver = Input::get('driver');
		if(!$driver || strtolower($driver) != 'onedrive') return;

		$config = Input::get('config', 'json');
		if($config['auth'] != '1') show_json('未开启账号授权！', false);
		$valids = array('access_token', 'refresh_token', 'token_expire_time');
		foreach($valids as $name) {
			if(empty($config[$name])) show_json('授权信息有误，请尝试重新授权', false);
		}
		$name = Input::get('name', 'require');
		$config['name'] = $name;	// 存储中触发刷新token时，name作为查找条件

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
				'type'			=> 'onedrive',
				'refresh_token' => $config['refresh_token'],
			))
		);
		$type = isset($config['type']) ? $config['type'] : 'int';	// 区分版本，用不同的方式刷新
		$url = $this->callbackUrl($type);
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

	// 回调地址，为pathInfo模式
	private function callbackUrl($type = 'int'){
		if ($type == 'int') { // 国际版
			return rtrim($GLOBALS['config']['settings']['kodApiServer'], '?') . 'index.php/plugin/platform';
		}
		return $this->pluginApi . 'callback';	// 世纪互联
	}

	/**
	 * 世纪互联版回调地址
	 * @return void
	 */
	public function callback(){
		$in = $this->in;
		if (isset($in['state'])) {
			$state = json_decode($in['state'], true);
			if($state && isset($state['type'])) {
				if(isset($in['code'])) {
					$state['code'] = $in['code'];
				}
				$in = $state;
				$type = strtolower($state['type']);
			}
		}
		include_once($this->pluginPath.'lib/odrvToken.class.php');
		$token = new odrvToken($this);
		$token->index($in);
	}
}