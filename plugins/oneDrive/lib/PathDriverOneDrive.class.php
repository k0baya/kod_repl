<?php

/**
 * OneDrive对接
 * https://docs.microsoft.com/zh-cn/onedrive/developer/rest-api/concepts/addressing-driveitems?view=odsp-graph-online
 */

class PathDriverOneDrive extends PathDriverBase {
	protected $accessToken = '';
	protected $refreshToken = '';
	protected $tokenExpireTime = '';
	protected $name = '';	// 存储名称，用于刷新token
	protected $type = 'int';	// 账号类型：int、cn

	public $ioUploadServer = 1;
	public $ioFileOutServer = 0;

	public function __construct($config) {
		parent::__construct();
		$this->_init($config);
		$this->checkToken();
	}
	// 初始化配置信息
	public function _init($data = array()){
		$list = array(
			// 'name'				=> 'name',
			'accessToken'		=> 'access_token',
			'refreshToken'		=> 'refresh_token',
			'tokenExpireTime'	=> 'token_expire_time',
		);
		foreach($list as $key => $name) {
			if(empty($data[$name])) {
				$this->showError('OneDrive配置参数异常！');
			}
			$this->$key = $data[$name];
		}
		if(isset($data['name'])) $this->name = $data['name'];	// 刷新时没有携带
		if(isset($data['type'])) $this->type = $data['type'];
	}
	// 检查accessToken
	public function checkToken(){
		// token有效期是1个小时，提前5分钟刷新
		if($this->tokenExpireTime > time() + 300) return;
		$data = Hook::trigger("onedrive.refresh.token",$this->name);
		if (empty($data)) return $this->showError('OneDrive授权异常，请尝试在存储管理重新授权！');
		$this->_init($data);
	}

	/**
	 * https://docs.microsoft.com/zh-cn/onedrive/developer/rest-api/concepts/addressing-driveitems?view=odsp-graph-online
	 * https://github.com/OneDrive/onedrive-api-docs/issues/845
	 * @param string $url
	 * @param array $data
	 * @param string $method
	 * @return void
	 */
	public function odrvRequest($url = '', $data = array(), $method = 'GET', $headers = array()){
		$headers[] = 'Authorization:bearer ' . $this->accessToken;
		if(substr($url,0,4) != 'http') {
			$urls = array(
				'int'	=> 'https://graph.microsoft.com/v1.0/me/drive/root',
				'cn'	=> 'https://microsoftgraph.chinacloudapi.cn/v1.0/me/drive/root',	// 世纪互联
			);
			$url = $urls[$this->type] . $url;
		}
		$res = url_request($url,  $method, $data, $headers);
		
		// 结果解析
		if($res['code'] == '404') return false;
		if(!$res) $this->showError(LNG('explorer.networkError'));

		$data = json_decode($res['data'], true);
		if($res['status']) {
			return !$data ? $res['data'] : $data;
		}
		$msg = 'api request error';
		if(isset($data['error']) && isset($data['error']['message'])) {
			$msg = $data['error']['message'];
		}
		$this->showError($msg);
	}
	// 抛出异常
	private function showError($msg){
		throw new Exception($msg);
	}

	/**
	 * 创建文件
	 * @param type $path
	 * @param type $name
	 * @return boolean
	 */
	public function mkfile($path,$content='',$repeat = REPEAT_RENAME) {
		if($this->setContent($path,$content)){
			return $this->getPathOuter($path);
		}
		return false;
	}

	private function _mkdir($path){
		$prefix = trim(get_path_father($path), '/');
		$prefix = empty($prefix) ? '' : ':/'.$this->pathEncode($prefix).':';
		$param = array(
			'name' => $this->pathThis($path),
			'folder' => (object) array()
		);
		$headers = array('Content-Type: application/json');
		return $this->odrvRequest($prefix . '/children', json_encode($param), 'POST', $headers);
	}
	/**
	 * 创建文件夹
	 * @param type $path
	 * @param type $name
	 * @return boolean
	 */
	public function mkdir($dir,$repeat=REPEAT_SKIP) {
		if ($this->_isFolder($dir)) {
			return $this->getPathOuter($dir);
		}
		$this->_mkdir($dir);
		return $this->getPathOuter($dir);
	}

	/**
	 * 复制
	 * @param type $from
	 * @param type $to
	 * @return boolean
	 */
	public function copyFile($from,$to) {
		$dest = rtrim(get_path_father($to),'/');
		$info = $this->_objectMeta($dest);
		if(!$info) $info = $this->_mkdir($dest);
		if(!$info) return false;
		$param = array(
			'parentReference' => array(
				'driveId' => $info['parentReference']['driveId'],
				'id' => $info['id']
			),
			'name' => $this->pathThis($to),
		);
		$headers = array('Content-Type: application/json');
		$this->odrvRequest(':'.$this->pathEncode($from).':/copy', json_encode($param), 'POST', $headers);
		return true;
	}

	/**
	 * 移动
	 * @param type $from
	 * @param type $to
	 * @return boolean
	 */
	public function moveFile($from, $to) {
		$dest = rtrim(get_path_father($to),'/');
		$info = $this->_objectMeta($dest);
		if(!$info) $info = $this->_mkdir($dest);
		if(!$info) return false;
		$param = array(
			'parentReference' => array(
				'id' => $info['id']
			),
			'name' => $this->pathThis($to),
		);
		$headers = array('Content-Type: application/json');
		$this->odrvRequest(':'.$this->pathEncode($from), json_encode($param), 'PATCH', $headers);
		return true;
	}

	/**
	 * 删除文件(文件夹需要加'/')
	 * @param type $path
	 * @return boolean
	 */
	public function delFile($path) {
		$path = trim($path, '/');
		$path = empty($path) ? '' : ':/'.$this->pathEncode($path);
		$this->odrvRequest($path, array(), 'DELETE');
		return true;
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
		$path = get_path_father($from) . $to;
		return $this->moveFile($from, $to);
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
			'createTime'	 => isset($fileInfo['createdDateTime']) ? strtotime($fileInfo['createdDateTime']) : 0, //创建时间
			'modifyTime' 	 => isset($fileInfo['lastModifiedDateTime']) ? strtotime($fileInfo['lastModifiedDateTime']) : 0, //最后修改时间
			'size'			 => isset($fileInfo['size']) ?$fileInfo['size']:0,
			'ext'			 => $this->ext($file), // text/php,
			'isReadable'	 => true,
			'isWriteable'	 => true,			
		);
		if(empty($fileInfo)){
			$fileInfo = $this->objectMeta($file);
			if(isset($fileInfo['lastModifiedDateTime'])) {
				$info['createTime'] = strtotime($fileInfo['createdDateTime']);
				$info['modifyTime'] = strtotime($fileInfo['lastModifiedDateTime']);
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
			'createTime' => isset($itemInfo['createdDateTime']) ? strtotime($itemInfo['createdDateTime']) : 0, //创建时间
			'modifyTime' => isset($itemInfo['lastModifiedDateTime']) ? strtotime($itemInfo['lastModifiedDateTime']) : 0, //最后修改时间
			"isReadable"	=> true,
			"isWriteable"	=> true
		);
		if (empty($itemInfo)) {
			$path = rtrim($path,'/'). '/';
			$itemInfo = $this->objectMeta($path);
			if(isset($itemInfo['createdDateTime'])){
				$info['createTime'] = strtotime($itemInfo['createdDateTime']);
				$info['modifyTime'] = strtotime($itemInfo['lastModifiedDateTime']);
			}
		}
		return $info;
	}

	// 文件列表缓存，减少objectMeta请求
	private function _setPathMeta($path, $list = array()){
		if(isset($list['value'])) $list = $list['value'];
		$key = $this->_pathMetaKey($path);
		if(!$cache = Cache::get($key)) $cache = array();

		$dir = rtrim($path, '/') . '/';
		foreach($list as $item) {
			$tmp = array(
				'id'					=> $item['id'],
				'name'					=> $item['name'],
				'size'					=> $item['size'],
				'parentReference'		=> $item['parentReference'],
				'createdDateTime'		=> $item['createdDateTime'],
				'lastModifiedDateTime'	=> $item['lastModifiedDateTime'],
			);
			if(isset($item['folder'])) $tmp['folder'] = 1;
			if(!empty($item['thumbnails'])) {
				$tmp['thumb_url'] = $item['thumbnails'][0]['small']['url'];
			}
			if(!empty($item['@microsoft.graph.downloadUrl'])) {
				$tmp['@microsoft.graph.downloadUrl'] = $item['@microsoft.graph.downloadUrl'];
			}
			$cache[md5($dir.$item['name'])] = $tmp;
		}
		Cache::set($key, $cache);
	}
	// 单文件信息
	private function _getPathMeta($path) {
		$dir = get_path_father($path);
		$key = $this->_pathMetaKey($dir);
		$cache = Cache::get($key);
		$pathKey = md5($path);
		return (!$cache || !isset($cache[$pathKey])) ? null : $cache[$pathKey];
	}
	// 清除列表缓存
	private function _clearPathMeta($path){
		$key = $this->_pathMetaKey($path);
		$cache = Cache::remove($key);
	}
	private function _pathMetaKey($path){
		$path = '/' . trim($path, '/');
		return 'onedrive_path_' . md5($path);
	}

	/**
	 * 递归获取(path下)文件列表
	 * @param [type] $path
	 * @param [type] $list
	 * @param [type] $result
	 * @return void
	 */
	private function recursionFiles($path,&$list, $result,$simple=false) {
		$this->_setPathMeta($path, $result);
		$fileList = !empty($result['value']) ? $result['value'] : array();
		$dir = rtrim($path, '/') . '/';
		foreach($fileList as $info) {
			if(isset($info['folder'])) {
				$list['folderList'][] = $this->folderInfo($dir.$info['name'], $simple, $info);
			}else{
				$list['fileList'][] = $this->fileInfo($dir.$info['name'], $simple, $info);
			}
		}
		if(isset($result['@odata.nextLink'])) {
			$result = $this->odrvRequest($result['@odata.nextLink']);
			$this->recursionFiles($path,$list, $result);
		}
	}
	/**
	 * 列举当前目录下的文件/夹信息
	 * 
	 * https://docs.microsoft.com/zh-cn/onedrive/developer/rest-api/api/driveitem_list_children?view=odsp-graph-online
	 * 根据path获取：GET /drives/{drive-id}/root:/{path-relative-to-root}:/children
	 * 根据id获取：GET /drives/{drive-id}/items/{item-id}/children
	 * @param [type] $path
	 * @param boolean $simple
	 * @return void
	 */
	public function listPath($path,$simple=false) {
		$this->_clearPathMeta($path);
		$result = $this->fileList($path);
		$list = array('folderList' => array(), 'fileList' => array());
		$this->recursionFiles($path,$list,$result,$simple);
		return $list;
	}

	// api获取文件列表
	private function fileList($path){
		$path = '/' . trim($path, '/') ;
		// 根目录：drive/root/children
		$prefix = !trim($path, '/') ? '' : ':'.$this->pathEncode($path).':';
		$limit = 200;
		$param = array('$top' => $limit);
		return $this->odrvRequest($prefix . '/children?$expand=thumbnails', $param);
		// return $this->odrvRequest($prefix . '/children', $param);
	}

	// 递归获取子文件/夹数
	private function hasChildren(&$list, $result, $count=false, $checkFile=true) {
		$vals = !empty($result['value']) ? $result['value'] : array();
		$tots = count($vals);
		$data = array_to_keyvalue($vals, '', 'folder');
		$dirs = count($data);
		$file = ($tots - $dirs);
		if(!$count) {
			if($checkFile){
				if($file) return true;
			}else {
				if($dirs) return true;
			}
			return false;
		}
		$list['hasFolder'] += $dirs;
		$list['hasFile'] += $file;
		if(isset($result['@odata.nextLink'])) {
			$result = $this->odrvRequest($result['@odata.nextLink']);
			$this->hasChildren($list, $result, $count, $checkFile);
		}
	}
	/**
	 * 是否有子文件/夹
	 */
	public function has($path,$count=false,$checkFile = true){
		$result = $this->fileList($path);
		$list = array('hasFile'=>0,'hasFolder'=>0);
		$res = $this->hasChildren($list,$result,$count,$checkFile);
		return !$count ? $res : $list;
	}

	/**
	 * 递归获取所有子孙项
	 * @param [type] $path
	 * @param [type] $list
	 * @param [type] $result
	 * @return void
	 */
	private function recursionAllFiles($path,&$list, $result) {
		$this->_setPathMeta($path, $result);
		$fileList = !empty($result['value']) ? $result['value'] : array();
		$dir = rtrim($path, '/') . '/';
		foreach($fileList as $item) {
			$tmpPath = $dir . $item['name'];
			$info = array(
				'path'		=> $this->getPathOuter($tmpPath),
				'folder'	=> isset($item['folder']) ? 1 : 0,
				'size'		=> isset($item['size']) ? $item['size'] : 0,
			);
			if(!$info['folder'] && $thumb = $this->_thumbUrl($tmpPath)) {
				$info['fileThumb'] = $thumb;
			}
			$list[] = $info;
			if(isset($item['folder']['childCount']) && $item['folder']['childCount'] > 0) {
				$this->_clearPathMeta($path);
				$result = $this->fileList($tmpPath);
				$this->recursionAllFiles($tmpPath,$list, $result);
			}
		}
		if(isset($result['@odata.nextLink'])) {
			$result = $this->odrvRequest($result['@odata.nextLink']);
			$this->recursionAllFiles($path,$list, $result);
		}
	}
	/**
	 * 返回所有子项:目录及文件
	 * [{"path":"/a/", "folder":1,"size":0},{"path":"/test.txt", "folder":0,"size":"1234"}]
	 */
	public function listAll($path) {
		$this->_clearPathMeta($path);
		$list = array();
		$result = $this->fileList($path);
		$this->recursionAllFiles($path,$list,$result);
		return $list;
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
	 * 写入内容
	 * @param type $file
	 * @param type $data
	 * @return type
	 */
	public function setContent($file, $data = '') {
		// size <= 4MB，单文件上传
		if(strlen($data) <= 1024*1024*4) {
			$headers = array('Content-Type: text/plain');
			$this->odrvRequest(':'.$this->pathEncode($file).':/content', $data, 'PUT', $headers);
			return true;
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
		$headers = array();
		if($length > 0) {
			$end = $start + $length - 1;
			$headers = array('Range: bytes='.$start.'-'.$end);
		}
		return $this->odrvRequest(':'.$this->pathEncode($file).':/content', array(), 'GET', $headers);
	}

	/**
	 * 文件上传
	 * https://docs.microsoft.com/zh-cn/onedrive/developer/rest-api/api/driveitem_createuploadsession?view=odsp-graph-online
	 * @param [type] $destPath
	 * @param [type] $localPath
	 * @param boolean $moveFile
	 * @param [type] $repeat
	 * @return void
	 */
	public function upload($destPath,$localPath,$moveFile=false,$repeat=REPEAT_REPLACE) {
		$path = '/' . trim($destPath, '/');
		$size = @filesize($localPath);
		// 1.创建上传会话
		$headers = array('Content-Type: application/json');
		$data = $this->odrvRequest(':'.$this->pathEncode($path) . ':/createUploadSession', array(), 'POST');
		if(!isset($data['uploadUrl'])) return false;

		// $expirationTime = $data['expirationDateTime'];
		// $nextRange = $data['nextExpectedRanges'][0];
		$uplaodUrl = $data['uploadUrl'];

		// 2.分片上传，分片大小需为320kb的倍数，且不得大于60MB
		$chunkSize = 1024*1024*10;	// 10Mb，320kb的32倍

		$data = array(
			'size'	 => $size,
			'range'  => '0-'.($chunkSize - 1),
			'length' => $chunkSize
		);
		// 2.1 单文件上传
		if($size <= $chunkSize) {
			$data['range'] = '0-' . ($size - 1);
			$data['length'] = $size;
			$this->uploadFile($uplaodUrl, $data, file_get_contents($localPath));
			return $this->getPathOuter($path);
		}
		// 2.2 分片上传
		$fp = fopen($localPath, 'r');
		if(!$fp) return false;
		$start = 0;
		$length = $chunkSize;
		do {
			$surplus = $size - $start;
			if($surplus < $length) {
				$length = $surplus;
			}
			fseek($fp, $start);
			$content = fread($fp, $length);

			$data['range'] = $start . '-' . ($start + $length - 1);
			$data['length'] = $length;
			$this->uploadFile($uplaodUrl, $data, $content);
			$start += $length;
		}while($size > $start);
		fclose($fp);

		return $this->getPathOuter($path);
	}

	// 单片上传
	private function uploadFile($url, $data, $content){
		$headers = array(
			'Content-Length: ' . $data['length'],
			'Content-Range: bytes '.$data['range'].'/'.$data['size']
		);
		return $this->odrvRequest($url, $content, 'PUT', $headers);
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
	 * 
	 * 无效(仅支持SharePoint 和 OneDrive for business)：https://docs.microsoft.com/zh-cn/onedrive/developer/rest-api/api/driveitem_preview?view=odsp-graph-online
	 * 缩略图：https://docs.microsoft.com/zh-cn/onedrive/developer/rest-api/api/driveitem_list_thumbnails?view=odsp-graph-online#requesting-custom-thumbnail-sizes
	 * @param type $path
	 * @param type $options	// url额外参数
	 * @return type
	 */
	public function link($path, $options = '') {
		$info = $this->objectMeta($path);
		return isset($info['@microsoft.graph.downloadUrl']) ? $info['@microsoft.graph.downloadUrl'] : false;
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

	// 根据path获取缩略图缓存
	private function _thumbUrl($path, $width = 800){
		$info = $this->objectMeta($path);
		if(!$info || !isset($info['thumb_url'])) return '';
		$url = $info['thumb_url'];
		$tmp = explode('?', $url);
		parse_str($tmp[1], $arr);
		$arr['width'] = $width;
		$arr['height'] = $width;
		return $tmp[0] . '?' . http_build_query($arr);
	}
	private function _thumbLink($path, $width=250){
		$select = 'c'.$width.'x'.$width;
		$info = $this->odrvRequest(':'.$this->pathEncode($path).':/thumbnails?select='.$select);
		if(!isset($info['value'][0][$select]['url'])) return false;
		return $info['value'][0][$select]['url'];
	}

	public function fileOutImage($path,$width=250){
		if(!$link = $this->_thumbUrl($path, $width)) {
			$link = $this->_thumbLink($path, $width);
		}
		if(!$link) return false;
		$this->fileOutLink($link);
	}
	// 后端输出图片
	public function fileOutImageServer($path,$width=250){
		parent::fileOutImage($path,$width);
	}

	/**
	 * 文件MD5
	 * @param type $path
	 * @return boolean
	 */
	public function hashMd5($path){
		return false;
		// return md5($this->getContent($path));	// 文件信息中没有MD5，但用此方式会很慢，暂不获取
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
		$tmpPath = $path;
		if($info = $this->_getPathMeta($tmpPath)) return $info;
		$path = !trim($path, '/') ? '' : ':'.$this->pathEncode($path);
		$info = $this->odrvRequest($path);
		// 这里获取的结果没有缩略图信息，故不存缓存
		return $info;
	}
	protected function _isFolder($path){
		if($path =='' || $path == '/') return true;
		$info = $this->objectMeta($path);
		return isset($info['folder']) ? true : false;
	}
}
