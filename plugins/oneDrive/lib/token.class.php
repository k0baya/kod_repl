<?php 

/**
 * 世纪互联版，token获取和刷新
 */
class token {

    private $plugin;
    public function __construct($plugin){
        $this->plugin = $plugin;
    }

    /**
     * OneDrive
     * 获取、刷新token
     * @param [type] $data
     * @return void
     */
    public function index($data) {
        // 根据code获取token
        if(isset($data['code'])) {
	        $res = $this->getToken($data['code']);
            $uri = http_build_query($res, null, '&', PHP_QUERY_RFC3986);
            header("Location:" . $data['link'] . "?" . $uri);
	        exit;
	    }
		// 获取应用client_id
		if(isset($data['client_id'])) {
			$this->getClientID();
		}
	    // 根据refresh_token，刷新token
	    if(empty($data['refresh_token'])) {
	        show_json('参数错误:refresh_token', false);
	    }
	    $res = $this->refreshToken($data['refresh_token']);
	    show_json($res['data'], $res['code']);
    }

    /**
	 * 获取accessToken
	 * @param [type] $config
	 * @return void
	 */
	public function getToken($code) {
        $config = $this->getCnConfig();
        if(empty($config)) show_json('应用获取失败', false);
	    $data = array(
	        'grant_type'	=> 'authorization_code',
	        'code'			=> $code,
	        'client_id'		=> $config['appid'],
	        'client_secret' => $config['appsecret'],
			// 'redirect_uri'	=> "oob",
			'redirect_uri'	=> $config['redirecturl'],
	    );
		return $this->graph_request($data);
	}

    /**
	 * 刷新accessToken
	 * https://docs.microsoft.com/zh-cn/onedrive/developer/rest-api/getting-started/graph-oauth?view=odsp-graph-online
	 * @return void
	 */
	public function refreshToken($refresh_token){
	    $config = $this->getCnConfig();
        if(empty($config)) show_json('应用获取失败', false);
		$data = array(
			'grant_type'	=> 'refresh_token',
			'refresh_token'	=> $refresh_token,
			'client_id'		=> $config['appid'],
	        'client_secret' => $config['appsecret'],
		);
		return $this->graph_request($data);
	}

    // 解析获取token请求结果
    private function graph_request($data){
		$url = 'https://login.partner.microsoftonline.cn/common/oauth2/v2.0/token';
		$result = url_request($url, 'POST', $data);
		if (!$result['status'] || empty($result['data'])) {
			if($data = json_decode($result['data'], true)) {
				$msg = isset($data['error_description']) ? $data['error_description'] : (isset($data['error']) ? $data['error'] : LNG('explorer.error'));
                return array('data' => $msg, 'code' => false);
			}
            return array('data' => $result['data'], 'code' => false);
		}
		$data = $this->parseToken($result['data']);
        return array('data' => $data, 'code' => true);
	}

    // 解析token结果，确保(服务器上)过期时间一致
    private function parseToken($data){
        $data = json_decode($data, true);
        $token = array(
			'access_token'		=> $data['access_token'],
			'refresh_token'		=> $data['refresh_token'],
			'token_expire_time'	=> $data['expires_in'] + time()	// token过期时间
		);
		return json_encode($token);
    }

    private function getCnConfig(){
        $config = $this->plugin->getConfig();
        return array(
            'appid'         => $config['cnClientID'],
            'appsecret'     => $config['cnClientSecret'],
            // 'redirecturl'   => str_replace('?', 'index.php/', $this->plugin->pluginApi) . 'callback',
            'redirecturl'   => APP_HOST . 'index.php/plugin/' . $this->plugin->pluginName . '/callback',
        );
    }
}