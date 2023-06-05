<?php

/**
 * 百度网盘文件管理类
 * https://pan.baidu.com/union/doc/nksg0sbfs?menuKey=union-support-document
 */
class PathDriverBaidu extends PathDriverBase {
	protected $accessToken = '';
	protected $refreshToken = '';
	protected $tokenExpireTime = '';
	protected $name = '';	// 存储名称，用于刷新token

	public $ioUploadServer = 1;
	public $ioFileOutServer = 1;	// 前端输出直链被限制，暂时先统一改为后端

	public function __construct($config) {
		parent::__construct();
		$this->_init($config);
		$this->checkToken();
	}
	// 初始化配置信息
	private function _init($data = array()){
		$list = array(
			// 'name'				=> 'name',
			'accessToken'		=> 'access_token',
			'refreshToken'		=> 'refresh_token',
			'tokenExpireTime'	=> 'token_expire_time',
		);
		foreach($list as $key => $name) {
			if(empty($data[$name])) {
				$this->showError('百度网盘配置参数异常！');
			}
			$this->$key = $data[$name];
		}
		if(isset($data['name'])) $this->name = $data['name'];	// 刷新时没有携带
	}
	// 检查accessToken
	public function checkToken(){
		// 提前2小时刷新
		if($this->tokenExpireTime > time() + 7200) return;
		$data = Hook::trigger("baidu.refresh.token",$this->name);
		if (empty($data)) return $this->showError('百度网盘授权异常，请尝试在存储管理重新授权！');
		$this->_init($data);
	}

	/**
	 * curl请求api接口
	 * @param [type] $url
	 * @param string $method
	 * @param boolean $data
	 * @param boolean $headers
	 * @param boolean $options
	 * @param boolean $return 为true时，如果结果失败，直接返回data
	 * @return void
	 */
	public function bdRequest($url, $method='GET', $data=false, $headers=false, $options=false, $return=false){
		if($method == 'GET') {
			$data['access_token'] = $this->accessToken;
		}
		if(substr($url,0,4) != 'http') {
			$url = 'https://pan.baidu.com/' . $url;
		}
		$res = url_request($url,  $method, $data, $headers, $options);
		
		// 解析结果
		$msg = LNG('explorer.networkError');
		if(!$res) $this->showError($msg);
		if(!$res['status'] && $return) {
			return isset($res['data']) ? $res['data'] : '';
		}
		if(!$res['data']) $this->showError($msg);
		// 获取文件内容
		if($res['code'] == '206') return $res['data'];

		$data = json_decode($res['data'], true);
		if(!$data || (isset($data['errno']) && $data['errno'] != '0')) {
			if (!empty($data['errno'])) {
				$msg = $this->codeError($data['errno']);
			} else if (!empty($data['errmsg'])) {
				$msg = $data['errmsg'];
			} else {
				$msg .= !empty($res['code']) ? $res['code'] : '';
			}
			$this->showError($msg);
		}
		if(isset($data['error_code']) && $data['error_code'] != '0') {
			$msg = isset($data['error_msg']) ? $data['error_msg'] : LNG('explorer.error') . ': error_code(' . $data['error_code'] . ')';
			$this->showError($msg);
		}
		return $data;
	}
	// 抛出异常
	private function showError($msg){
		throw new Exception($msg);
	}

	// 错误列表
	public function codeError($code){
		$list = array(
			'2'		=> '参数错误',
			'-6'	=> '身份验证失败',
			'31034'	=> '访问过于频繁，请稍后再试',
			'42000'	=> '访问过于频繁',
			'42001'	=> 'rand校验失败',
			'42999'	=> '功能下线',
			'9100'	=> '一级封禁',
			'9200'	=> '二级封禁',
			'9300'	=> '三级封禁',
			'9400'	=> '四级封禁',
			'9500'	=> '五级封禁',

			'-7'	=> '文件或目录名错误或无权访问',
			'-8'	=> '文件或目录已存在',
			'-10'	=> '云端容量已满',
			'10'	=> '创建文件的superfile失败',
			'31024' => '没有申请上传权限',
			'31299' => '第一个分片的大小小于4MB',
			'31364' => '超出分片大小限制',
		);
		return isset($list[$code]) ? $list[$code] : LNG('explorer.error') . ': errno(' . $code . ')';
	}

	/**
	 * 用户信息
	 * @return void
	 */
	public function userInfo(){
		return $this->bdRequest('rest/2.0/xpan/nas?method=uinfo');
	}

	/**
	 * 网盘容量信息
	 * https://pan.baidu.com/union/document/basic#获取网盘容量信息
	 * {"errno":0,"used":1720839525296,"total":2206539448320,"request_id":9048281600181199460}
	 * @return void
	 */
	public function diskInfo(){
		$data = $this->bdRequest('api/quota');
		return array('total' => $data['total'], 'used' => $data['used']);
	}

	/**
	 * 创建文件	本地生成+上传
	 * @param type $path
	 * @param type $name
	 * @return boolean
	 */
	public function mkfile($path,$content='',$repeat = REPEAT_RENAME) {
		if($this->setContent($path,$content,$repeat)){
			return $this->getPathOuter($path);
		}
		return false;
	}

	/**
	 * 创建文件夹
	 * @param type $path
	 * @param type $name
	 * @return boolean
	 */
	public function mkdir($dir,$repeat=REPEAT_SKIP) {
		$path = '/' . trim($dir, '/');
		if ($this->_isFolder($path)) {
			return $this->getPathOuter($path);
		}
		$this->createFile($path);
		return $this->getPathOuter($path);
	}

	/**
	 * 文件管理：copy/move/rename/delete
	 * https://pan.baidu.com/union/document/basic#%E7%AE%A1%E7%90%86%E6%96%87%E4%BB%B6
	 * @return void
	 */
	private function fileManager($fileList, $action){
		$query = array(
			'method' => 'filemanager',
			'access_token' => $this->accessToken,
			'opera' => $action,
			'async' => 1	// 0同步；1自适应；2异步
		);
		$query = http_build_query($query);
		$param = array('filelist' => json_encode($fileList));
		$data = $this->bdRequest('rest/2.0/xpan/file?'.$query, 'POST', $param);
		return $data['errno'] == '0' ? true : false;
	}

	/**
	 * 复制
	 * @param type $from
	 * @param type $to
	 * @return boolean
	 */
	public function copyFile($from,$to) {
		$dest = get_path_father($to);
		$fileList = array(
			'path'		=> $from,
			'dest'		=> '/' . trim($dest, '/'),
			'newname'	=> get_path_this($to)
		);
		return $this->fileManager(array($fileList), 'copy');
	}

	/**
	 * 移动
	 * @param type $from
	 * @param type $to
	 * @return boolean
	 */
	public function moveFile($from, $to) {
		$dest = get_path_father($to);
		$fileList = array(
			'path'		=> $from,
			'dest'		=> '/' . trim($dest, '/'),
			'newname'	=> get_path_this($to)
		);
		return $this->fileManager(array($fileList), 'move');
	}

	/**
	 * 删除文件(文件夹需要加'/')
	 * @param type $path
	 * @return boolean
	 */
	public function delFile($path) {
		return $this->fileManager(array($path), 'delete');
	}

	/**
	 * 删除文件夹，和删除文件相同（同一目录下不会存在文件/夹名相同的情况）
	 * @param type $path
	 * @return boolean
	 */
	public function delFolder($path) {
		return $this->delFile($path);
	}

	/**
	 * 重命名
	 * @param type $from
	 * @param type $to
	 * @return type
	 */
	public function rename($from, $to) {
		$fileList = array(
			'path'		=> $from,
			'newname'	=> get_path_this($to)
		);
		return $this->fileManager(array($fileList), 'rename');
	}

	/**
	 * 文件信息
	 * @param type $file
	 * @param type $fileInfo
	 * @return type
	 */
	public function fileInfo($file,$simple=false,$fileInfo = array()) {
		if($simple){
			return array(
				'name'		=> $this->pathThis($file),
				'path'		=> $this->getPathOuter('/' . $file),
				'type'		=> 'file',
				'size'		=> isset($fileInfo['size']) ?$fileInfo['size']:0,
				'ext'		=> $this->ext($file),
			);
		}
		$info = array(
			'name'			 => $this->pathThis($file),
			'path'			 => $this->getPathOuter('/' . $file),
			'type'			 => 'file',
			'createTime'	 => isset($fileInfo['server_ctime']) ? $fileInfo['server_ctime'] : 0, //创建时间
			'modifyTime' 	 => isset($fileInfo['server_mtime']) ? $fileInfo['server_mtime'] : 0, //最后修改时间
			'size'			 => isset($fileInfo['size']) ?$fileInfo['size']:0,
			'ext'			 => $this->ext($file), // text/php,
			'isReadable'	 => true,
			'isWriteable'	 => true,			
		);
		if(empty($fileInfo)){
			$fileInfo = $this->objectMeta($file);
			if(isset($fileInfo['server_mtime'])) {
				$info['createTime'] = $fileInfo['server_ctime'];
				$info['modifyTime'] = $fileInfo['server_mtime'];
				$info['size'] = $fileInfo['size'];
			}
		}
		if($thumb = $this->_thumbUrl($file)) {
			$info['fileThumb'] = $thumb;
		}
		return $info;
	}

	/**
	 * 文件夹信息
	 * @param type $path
	 * @return type
	 */
	public function folderInfo($path,$simple=false,$itemInfo=array()) {
		if($simple){
			return array(
				'name'		=> $this->pathThis($path),
				'path'		=> $this->getPathOuter('/' . $path),
				'type'		=> 'folder',
			);
		}
		$info = array(
			'name'		 => $this->pathThis($path),
			'path'		 => $this->getPathOuter('/' . $path),
			'type'		 => 'folder',
			'createTime' => isset($itemInfo['server_ctime']) ? $itemInfo['server_ctime'] : 0, //创建时间
			'modifyTime' => isset($itemInfo['server_mtime']) ? $itemInfo['server_mtime'] : 0, //最后修改时间
			"isReadable"	=> true,
			"isWriteable"	=> true
		);
		if (empty($itemInfo)) {
			$path = rtrim($path,'/'). '/';
			$itemInfo = $this->objectMeta($path);
			if(isset($itemInfo['server_ctime'])){
				$info['createTime'] = $itemInfo['server_ctime'];
				$info['modifyTime'] = $itemInfo['server_mtime'];
			}
		}
		return $info;
	}

	/**
	 * 获取文件列表
	 * https://pan.baidu.com/union/document/basic#%E8%8E%B7%E5%8F%96%E6%96%87%E4%BB%B6%E5%88%97%E8%A1%A8
	 * @param [type] $path
	 * @param integer $start
	 * @param integer $limit
	 * @return void
	 */
	public function fileList($path, $start = 0, $limit = 1000){
		$path = '/' . trim($path, '/');
		$param = array(
			'dir'	=> $path,
			'start' => $start,
			'limit' => $limit,
			'web'	=> 'web'
		);
		$data = $this->bdRequest('rest/2.0/xpan/file?method=list', 'GET', $param);
		$this->_setPathMeta($path, $data['list']);
		return !empty($data['list']) ? $data['list'] : array();
	}

	// 文件列表缓存，减少objectMeta请求
	private function _setPathMeta($path, $list = array()){
		$key = $this->_pathMetaKey($path);
		if(!$cache = Cache::get($key)) $cache = array();
		foreach($list as $item) {
			$tmp = array(
				'fs_id'				=> $item['fs_id'],
				'server_filename'	=> $item['server_filename'],
				'path'				=> $item['path'],
				'size'				=> $item['size'],
				'isdir'				=> $item['isdir'],
				'server_ctime'		=> $item['server_ctime'],
				'server_mtime'		=> $item['server_mtime'],
			);
			if(isset($item['md5'])) $tmp['md5'] = $item['md5'];
			if(isset($item['thumbs'])) $tmp['thumb_url'] = $item['thumbs']['url1'];
			$cache[md5($item['path'])] = $tmp;
		}
		// write_log(array('缩略图缓存', $path, $key, $cache));
		Cache::set($key, $cache);
	}
	private function _getPathMeta($path) {
		$dir = get_path_father($path);
		$key = $this->_pathMetaKey($dir);
		$cache = Cache::get($key);
		$pathKey = md5($path);
		// write_log(array('读缩略图缓存', $path, $dir, $key, $pathKey, $cache));
		return (!$cache || !isset($cache[$pathKey])) ? null : $cache[$pathKey];
	}
	private function _clearPathMeta($path){
		$key = $this->_pathMetaKey($path);
		$cache = Cache::remove($key);
	}
	private function _pathMetaKey($path){
		$path = '/' . trim($path, '/');
		return 'baidu_path_' . md5($path);
	}

	// 根据path获取缩略图
	private function _thumbUrl($path, $width = 800, $url = ''){
		if(!$url) {
			$info = $this->objectMeta($path);
			if(!$info || !isset($info['thumb_url'])) return '';
			$url = $info['thumb_url'];
		}
		$data = explode('&', $url);
		$size = 'size=';
		foreach($data as &$val) {
			if(substr($val,0,strlen($size)) == $size) {
				$val = 'size=c'.$width.'_u'.$width;
			}
		}
		return implode('&', $data);
	}

	/**
	 * 列举当前目录下的文件/夹信息
	 * @param type $path
	 * @return type
	 */
	public function listPath($path,$simple=false) {
		$this->_clearPathMeta($path);
		$start = 0;// 起始位置
		$limit = 1000;
		$folderList = $fileList = array();
		while (true) {
			// 列举文件
			$list = $this->fileList($path, $start, $limit);
			foreach($list as $info) {
				if($info['isdir'] == '1') {
					$folderList[] = $this->folderInfo($info['path'], $simple, $info);
				}else{
					$fileList[] = $this->fileInfo($info['path'], $simple, $info);
				}
			}
			if(count($list) < $limit) break;
		}
		return array('folderList' => $folderList, 'fileList' => $fileList);
	}

	/**
	 * 是否有子文件/夹
	 */
	public function has($path,$count=false,$checkFile = true){
		$this->_clearPathMeta($path);
		$start = 0;// 起始位置
		$limit = 1000;
		$hasFile = 0;$hasFolder = 0;
		while (true) {
			// 列举文件
			$list = $this->fileList($path, $start, $limit);
			$total = count($list);

			$data = array_to_keyvalue($list, '', 'isdir');
			$dirs = array_sum($data);
			$file = (count($data) - $dirs);
			if($count) {
				$hasFolder += $dirs;
				$hasFile += $file;
				if($total < $limit) break;
				continue;
			}
			if($checkFile){
				if($file) return true;
			}else {
				if($dirs) return true;
			}
			if($total < $limit) break;
		}
		if($count){return array('hasFile'=>$hasFile,'hasFolder'=>$hasFolder);}
		return false;
	}

	/**
	 * 返回所有子项:目录及文件
	 * [{"path":"/a/", "folder":1,"size":0},{"path":"/test.txt", "folder":0,"size":"1234"}]
	 */
	public function listAll($path) {
		$start = 0;// 起始位置
		$limit = 1000;
		$result = array();
		while (true) {
			$param = array(
				'path'		=> '/' . trim($path, '/'),
				'start'		=> $start,
				'limit'		=> $limit,
				'recursion' => 1,
			);
			$data = $this->bdRequest('rest/2.0/xpan/multimedia?method=listall', 'GET', $param);
			$start = $data['cursor'];
			foreach($data['list'] as $item) {
				$result[] = array(
					'path'		=> $this->getPathOuter($item['path']),
					'folder'	=> $item['isdir'],
					'size'		=> isset($item['size']) ? $item['size'] : 0,
				);
			}
			if($data['has_more'] != '1') break;
		}
		return $result;
	}
	
	/**
	 * 可读
	 * @param type $path
	 * @return type
	 */
	public function canRead($path) {
		return $this->exist($path) ? true : false;
	}

	/**
	 * 可写
	 * @param type $path
	 * @return type
	 */
	public function canWrite($path) {
		return $this->exist($path) ? true : false;
	}

	/**
	 * 读取内容
	 * @param type $file
	 * @return type
	 */
	public function getContent($file) {
		return $this->fileSubstr($file, 0, -1);	// 获(截)取全部内容
	}

	/**
	 * 写入内容	下载到服务器+写入内容+上传
	 * @param type $file
	 * @param type $data
	 * @return type
	 */
	public function setContent($file, $data = '',$repeat=REPEAT_REPLACE) {
		// 同名文件上传会重命名，在保存文件内容时，会导致创建新文件，故先删除
		if($repeat==REPEAT_REPLACE) {
			$this->delFile($file);
		}
		// 创建本地临时文件,并上传
		$tempFile = $this->tempFile($this->pathThis($file));
		file_put_contents($tempFile, $data);
		if ($this->upload($file, $tempFile)) {
			$this->tempFileRemve($tempFile);
			return true;
		}
		return false;
	}

	/**
	 * range
	 * https://blog.csdn.net/weixin_34014555/article/details/85863114
	 * @param type $file
	 * @param type $start
	 * @param type $length
	 * @return type
	 */
	public function fileSubstr($file, $start, $length) {
		$query = array(
			'method' => 'download',
			'path'	 => '/' . trim($file, '/')
		);
		$url = 'rest/2.0/xpan/file?'. http_build_query($query);
		$options = false;
		if($length > 0) {
			$end = $start + $length - 1;
			$options = array(CURLOPT_RANGE => $start.'-'.$end);
		}
		return $this->bdRequest($url, 'GET', false, false, $options, true);
	}

	/**
	 * 用户上传分片大小限制
	 * @param [type] $vipType
	 * @param [type] $size
	 * @return void
	 */
	private function chunkSize($vipType, $size){
		$MB = 1024 * 1024;
		$GB = 1024 * 1024 * 1024;
		$vipList = array(
			'0' => array('chunkSize' => 4 * $MB, 'totalSize' => 4 * $GB),	// 普通用户
			'1' => array('chunkSize' => 16 * $MB, 'totalSize' => 10 * $GB),	// 普通会员
			'2' => array('chunkSize' => 32 * $MB, 'totalSize' => 20 * $GB),	// 超级会员
		);
		$info = $vipList[$vipType];
		return $info['totalSize'] < $size ? false : $info['chunkSize'];
	}
	// 获取文件分片md5
	private function blockList($file, $size, $chunkSize){
		// 不分片
		if($size <= $chunkSize) {
			return array(@md5_file($file));
		}
		$start = 0;
		$length = $chunkSize;
		$blockList = array();
		if(!$fp = fopen($file, 'r')) return false;
		do {
			$surplus = $size - $start;
			if($surplus < $length) {
				$length = $surplus;
			}
			fseek($fp, $start);
			$blockList[] = @md5(fread($fp, $length));
			$start += $length;
		}while($size > $start);
		fclose($fp);
		return $blockList;
	}

	/**
	 * 上传文件
	 * @param [type] $destPath
	 * @param [type] $localPath
	 * @param boolean $moveFile
	 * @param [type] $repeat
	 * @return void
	 */
	public function upload($destPath,$localPath,$moveFile=false,$repeat=REPEAT_REPLACE) {
		// // 上传目录权限判断
		// if(strpos($destPath, '/apps/'.$this->appName.'/') !== 0) {
		// 	show_json('非授权目录禁止上传', false);
		// }
		$path = '/' . trim($destPath, '/');
		$size = @filesize($localPath);

		// 0.获取用户信息——不同级别上传限制不同
		$vipInfo = $this->userInfo();
		$vipType = isset($vipInfo['vip_type']) ? $vipInfo['vip_type'] : 0;
		if(!$chunkSize = $this->chunkSize($vipType, $size)) {
			// show_json('文件大小超过限制', false);
			return false;
		}

		// 获取分片md5
		$blockList = $this->blockList($localPath, $size, $chunkSize);
		if($blockList === false) return false;

		// 1.预上传——获取uploadid
		$query = array(
			'method'		=> 'precreate',
			'access_token'	=> $this->accessToken
		);
		$param = array(
			'path'			=> $path,
			'size'			=> $size,
			'isdir'			=> 0,
			'autoinit'		=> 1,
			'block_list'	=> json_encode($blockList),	// 各分片md5，不分片时可为空
			// 'rtype'			=> $repeat == REPEAT_REPLACE ? 3 : 0	// 命名策略，默认为0（返回冲突）
		);
		$query = http_build_query($query);
		$data = $this->bdRequest('rest/2.0/xpan/file?'.$query, 'POST', $param);
		if(isset($data['return_type']) && $data['return_type'] == 2) {
			return $this->getPathOuter($path);
		}
		$uploadid = $data['uploadid'];
		$block_list = !empty($data['block_list']) ? $data['block_list'] : array(0);	// [0,1,2]

		// 2.分片上传
		$start = 0;
		$length = $chunkSize;
		$blockList = array();
		$fp = fopen($localPath, 'r');
		foreach($block_list as $partseq) {
			$surplus = $size - $start;
			if($surplus < $length) {
				$length = $surplus;
			}
			$content = '';
			if ($length > 0) {
    			fseek($fp, $start);
    			$content = fread($fp, $length);
			}
			$retry = 0;
			do {
				$retry++;
				$data = $this->uploadPart($path, $uploadid, $partseq, $content);
			} while (!$data && $retry < 3); // 重试3次
			if (!$data || !isset($data['md5'])) return false;

			$blockList[] = $data['md5'];
			$start += $length;
		}
		fclose($fp);

		// 3.创建文件
		$param = array(
			'size'		=> $size,
			'isdir' 	=> 0,
			'uploadid'	=> $uploadid,
			'block_list'=> $blockList,
			// 'rtype'		=> $repeat == REPEAT_REPLACE ? 3 : 1	// 命名策略，默认为1（重命名），3为覆盖
		);
		$data = $this->createFile($path, $param);

		return $this->getPathOuter($path);
	}

	// 分片上传
	private function uploadPart($path, $uploadid, $partseq, &$content){
		$query = array(
			'method'		=> 'upload',
			'access_token'	=> $this->accessToken,
			'type'			=> 'tmpfile',
			'path'			=> $path,
			'uploadid'		=> $uploadid,
			'partseq'		=> $partseq,	// 分片位置序号，参考block_list
		);
		$query = http_build_query($query);
		$url = 'https://d.pcs.baidu.com/rest/2.0/pcs/superfile2?' . $query;

		$delimiter = '-------------' . uniqid();
		$data = array(
			"--" . $delimiter . "\r\n",
			'Content-Disposition: form-data; name="file"; filename="file"' . "\r\n\r\n",
			$content . "\r\n",
			"--" . $delimiter . "--\r\n"
		);
		$data = implode('', $data);
		$options =  array(
			CURLOPT_POST => true,
			CURLOPT_HTTPHEADER => array(
				'Content-Type: multipart/form-data; boundary=' . $delimiter,
				'Content-Length: ' . strlen($data)
			),
			CURLOPT_POSTFIELDS => $data
		);
		return $this->bdRequest($url, 'POST', false, false, $options, true);
	}
	// 创建文件(夹)
	private function createFile($path, $data = array()){
		$query = array(
			'method'			=> 'create',
			'access_token'		=> $this->accessToken
		);
		$param = array(
			'path'				=> $path,
			'size'				=> isset($data['size']) ? $data['size'] : 0,
			'isdir'				=> isset($data['isdir']) ? $data['isdir'] : 1
		);
		if(isset($data['uploadid'])) {
			$param['uploadid'] = $data['uploadid'];
			$param['block_list'] = json_encode($data['block_list']);	// 各分片md5，此参数随uploadid传递
		}
		$query = http_build_query($query);
		return $this->bdRequest('rest/2.0/xpan/file?'.$query, 'POST', $param);
	}

	/**
	 * 下载	——单文件
	 * @param type $file
	 * @param type $destFile
	 * @return type
	 */
	public function download($file, $destFile) {
		$tempFile = IO::getPathInner(IO::mkfile($destFile));

		$start = 0;
		$length = 1024 * 200;
		$handle = fopen($tempFile, 'w');
		while (true) {
			$param = array(
				'start'	 => $start,
				'length' => $length
			);
			$content = $this->fileSubstr($file, $start, $length);
			fwrite($handle, $content);
			$start += $length;
			if (strlen($content) < $length) {
				break;
			}
		}
		fclose($handle);
		return $destFile;
	}

	/**
	 * 链接	[image/music/movie/ | download]
	 * @param type $path
	 * @param type $options	// url额外参数
	 * @return type
	 */
	public function link($path, $options = '') {
		// 获取文件fsid
		$info = $this->objectMeta($path);
		if(!isset($info['fs_id'])) return false;
		// 根据fsid获取dlink
		$param = array(
			'fsids' => json_encode(array($info['fs_id'])),
			'thumb' => 1,
			'dlink' => 1
		);
		$data = $this->bdRequest('rest/2.0/xpan/multimedia?method=filemetas', 'GET', $param);
		if(!isset($data['list'][0]['dlink'])) return false;

		$token = '&access_token=' . $this->accessToken;
		$info = $data['list'][0];
		if($options) {
			return !empty($info['thumbs']) ? $info['thumbs'] : $info['dlink'].$token;
		}
		// dlink需要+access_token、user-agent，再请求，302跳转获取真正的下载地址
		return $info['dlink'].$token;
	}

	public function fileOut($path, $download = false, $downFilename = false, $etag='') {
		if ($this->isFileOutServer()) {
			return $this->fileOutServer($path, $download, $downFilename, $etag);
		}
		$link = $this->link($path);
		$this->fileOutLink($link);
	}
	public function fileOutServer($path, $download = false, $downFilename = false, $etag=''){
		parent::fileOut($path, $download, $downFilename, $etag);
	}

	public function fileOutImage($path,$width=250){
		if(!$link = $this->_thumbUrl($path, $width)) {
			$link = $this->link($path, $width);
		}
		// 缩略图 [icon/url1/url2/url3/url4]
		if(is_array($link)) {
			$link = $this->_thumbUrl($path, $width, $link['url1']);
		}
		$this->fileOutLink($link);
	}
	// 后端输出图片
	public function fileOutImageServer($path,$width=250){
		if($link = $this->_thumbUrl($path, $width)) {
			$this->fileOutLink($link);
		}
		parent::fileOutImage($path,$width);
	}

	/**
	 * 文件MD5
	 * @param type $path
	 * @return boolean
	 */
	public function hashMd5($path){
		$info = $this->objectMeta($path);
		return isset($info['md5']) ? $info['md5'] : false;	// 文件类型才有md5
	}

	public function size($file){
		$info = $this->objectMeta($file);
		return $info ? $info['size']:0;
	}
	public function info($path){
		if($this->isFolder($path)){
			return $this->folderInfo($path);
		}else if($this->isFile($path)) {
			return $this->fileInfo($path);
		}
		return false;
	}

	public function exist($path){return $this->isFile($path) || $this->isFolder($path);}
	public function isFile($path){return !$this->isFolder($path) && $this->objectMeta($path);}
	public function isFolder($path){return $this->cacheMethod('_isFolder',$path);}
	protected function objectMeta($path){return $this->cacheMethod('_objectMeta',$path);}
	protected function _objectMeta($path){
		if($path == '' || $path == '/') return array();
		if($info = $this->_getPathMeta($path)) return $info;

		$name = get_path_this($path);
		$param = array(
			'key' => $name,
			'dir' => '/' . trim(get_path_father($path), '/')
		);
		$data = $this->bdRequest('rest/2.0/xpan/file?method=search', 'GET', $param);	// TODO 下一页
		if(empty($data['list'])) return false;
		$info = false;
		foreach($data['list'] as $item) {
			if($item['server_filename'] = $name) {
				$info = $item;
				break;
			}
		}
		if($info) $this->_setPathMeta($path, array($info));
		return $info;
	}
	protected function _isFolder($path){
		if($path =='' || $path == '/') return true;
		$info = $this->objectMeta($path);
		return (isset($info['isdir']) && $info['isdir'] == '1') ? true : false;
	}
}
