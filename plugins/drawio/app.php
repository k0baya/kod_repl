<?php
/**
 * drawio 流程图绘制
 * 
 * 更新:https://github.com/jgraph/drawio/releases 14.8.0(2021.6.17)
 * https://github.com/jgraph/drawio/blob/dev/ChangeLog
 * console.log([EditorUi.VERSION,mxClient.VERSION])
 * 
 * 处理:src/main/webapp/  (移除META-INF,*.map,package.json,yarn.lock,*.html)
 * 打包: 可移除(stencils,shapes,js/diagramly,js/grapheditor)
 */
class drawioPlugin extends PluginBase{
	function __construct(){
		parent::__construct();
	}
	public function regist(){
		$this->hookRegist(array(
			'user.commonJs.insert' 		=> 'drawioPlugin.echoJs',
			'explorer.list.itemParse'	=> 'drawioPlugin.itemParse',
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
		$this->applyOptions($assign);
		$this->assign($assign);
		$this->display($this->pluginPath.'/static/drawio/index.html');
	}
	
	
	private function applyOptions(&$assign){
		$config = $this->getConfig();
		// 图标网络搜索api;
		$assign['searchApi'] = $this->pluginApi.'iconSearchAli';
		if($config['iconSearch'] == 'iconsapi'){
			$assign['searchApi'] = "https://iconsapi.com/api/search?appkey=60d05c29e4b06f796908fd79";
			if($config['staticSearchProxy'] == 'yes'){
				$assign['searchApi'] = $this->pluginApi.'iconSearch';
			}
		}
		// 静态资源CDN;
		$assign['staticCDN'] = $this->pluginHost."static/drawio/";
	}
	
	
	public function itemParse($pathInfo){
		$allowCover = array("drawio",'pos');
		if($pathInfo['type'] == 'folder') return;
		if(!in_array($pathInfo['ext'],$allowCover)) return;
		$coverStatus = Cache::get('fileCover_'.KodIO::hashPath($pathInfo));
		if($coverStatus == 'no') return;

		$param  = '&path='.rawurlencode($pathInfo['path']).'&etag='.$pathInfo['size'].'_'.$pathInfo['modifyTime'];;
		$pathInfo['fileThumb'] = APP_HOST.'?plugin/drawio/cover'.$param;
		return $pathInfo;
	}
	public function cover(){
		$path = $this->filePath($this->in['path']);
		$pathInfo = IO::info($path);
		$coverKey = 'fileCover_'.KodIO::hashPath($pathInfo);
		
		if($pathInfo['ext'] == 'drawio'){$this->coverDrawio($path,$coverKey,$pathInfo);}
		if($pathInfo['ext'] == 'pos'){$this->coverPos($path,$coverKey,$pathInfo);}
	}
	private function coverDrawio($path,$coverKey,$pathInfo){
		$pre  = '<mxfile cover="';
		$head = IO::fileSubstr($path,0,100);
		if(!strstr($head,$pre)) return Cache::set($coverKey,'no');
		
		preg_match("/mxfile cover=\"(\d+);/",$head,$match);
		$readStart = strlen($pre) + strlen($match[1]) + 1;
		$image = IO::fileSubstr($path,$readStart,intval($match[1]));
		if(!$image) return Cache::set($coverKey,'no');
		
		Cache::set($coverKey,'yes');
		$this->showImage(base64_decode($image));
	}
	private function coverPos($path,$coverKey,$pathInfo){
		$pre  = '"pngdata":"';
		if($pathInfo['size'] >= 1024*1024*2) return Cache::set($coverKey,'no');
		$head = IO::fileSubstr($path,0,100);
		if(!strstr($head,$pre)) return Cache::set($coverKey,'no');
		
		$jsonData = IO::getContent($path);
		$jsonData = json_decode($jsonData, true);
		if(isset($jsonData['diagram']['image']['pngdata'])){
			$image = $jsonData['diagram']['image']['pngdata'];
		}
		if(!$image) return Cache::set($coverKey,'no');
		Cache::set($coverKey,'yes');
		$this->showImage(base64_decode($image));
	}
	
	public function showImage($content){
		header('Content-Type: image/jpeg');
		header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 3600 * 24 * 30) . ' GMT');
		header('Cache-Pragma: public');
		header('Pragma: public');
		header('Cache-Control: cache, must-revalidate');
		echo $content;
	}
	

	public function iconSearch(){
		$apiKey = '60d05c29e4b06f796908fd79';
		$api = "https://iconsapi.com/api/search";
		$page = intval($this->in['page']) <= 0 ? 1 : intval($this->in['page']);
		$url  = $api.'?appkey='.$apiKey.'&query='.rawurlencode($this->in['query']).'&page='.$page;
		$result = curl_get_contents($url,10);
		echo $result;
	}
	public function iconSearchAli(){
		$api = 'https://www.iconfont.cn/api/icon/search.json';
		$ctoken = 'OHPVlyAdHGaO_6MMA9P-VH22';
		$page = intval($this->in['page']) <= 0 ? 1 : intval($this->in['page']);
		$data = array(
			"page"=>$page,'q'=>$this->in['query'],"t"=>time()."000",
			'pageSize'=>50,"sortType"=>'updated_at',"fromCollection"=>"1",
		);
		$header = array(
            "cookie: ctoken=".$ctoken,
            "x-csrf-token: ".$ctoken,
			"content-type: application/x-www-form-urlencoded; charset=UTF-8"
		);
		$result = url_request($api,"POST",$data,$header,false,false,10);
		header('Content-Type: application/json; charset=utf-8');
		echo isset($result['data']) ? $result['data'] : '';
	}
}