<?php

class epubReaderPlugin extends PluginBase{
	function __construct(){
		parent::__construct();
	}
	public function regist(){
		$this->hookRegist(array(
			'user.commonJs.insert' 		=> 'epubReaderPlugin.echoJs',
			'explorer.list.itemParse'	=> 'epubReaderPlugin.itemParse',
		));
	}
	public function echoJs(){
		$this->echoFile('static/app/main.js');
	}
	public function itemParse($pathInfo){
		if($pathInfo['type'] == 'folder') return;
		if(!$pathInfo['size'] || $pathInfo['ext']!='epub') return;
		$param  = '&path='.rawurlencode($pathInfo['path']).'&size=800';
		$param .= '&etag='.$pathInfo['size'].'_'.$pathInfo['modifyTime'];
		$pathInfo['fileThumb'] = APP_HOST.'?plugin/epubReader/cover'.$param;
		return $pathInfo;
	}
	
	public function index(){
		$fileUrl = $this->filePathLink($this->in['path']);
		$fileName = $this->in['name'].' - '.LNG('common.copyright.name') . LNG('common.copyright.powerBy');
		$this->assign(array("fileUrl" =>$fileUrl,'fileName'=>$fileName));
		$this->display($this->pluginPath.'/php/template.html');
	}

	public function cover(){
		$path = $this->filePath($this->in['path']);
		$name = $this->fileInfo['name'];
		$coverName = 'cover_' . IO::hashSimple($path) . '.png';		// cover_abc.jpg.png
		if($sourceID = IO::fileNameExist($this->cachePath, $coverName)){
			return IO::fileOut(KodIO::make($sourceID));
		}
		$localFile = $this->pluginLocalFile($path);	// 下载到本地文件
		$check = array(
			'images/cover.jpg',
			'cover.jpg',
			'OEBPS/images/cover.jpg',
			'OEBPS/Images/cover.jpg'
		);
		foreach ($check as $value) {
			$this->tryImage($localFile,$value,$coverName);
		}
		//1.通过meta获取opf文件
		$meta  = KodArchive::extractZipFile($localFile,'META-INF/container.xml');
		if(!$meta){
			show_json('meta file not exist! '.$name);
		}
		$obj = obj2array(simplexml_load_file($meta));
		$opfFile = $obj["rootfiles"]["rootfile"]['@attributes']['full-path'];
		if(!$opfFile){
			show_json('meta data error! '.$name);
		}

		//2.获取并解析opf文件
		$opf = KodArchive::extractZipFile($localFile,$opfFile);
		if(!$opf){
			show_json('opf file not exist! '.$name);
		}
		$obj = obj2array(simplexml_load_file($opf));
		$manifest = $obj['manifest']['item'];
		$meta = $obj['metadata']['meta'];
		if(!$meta && !$manifest){
			show_json('opf data error! '.$name);
		}

		//3.查找封面;是否在meta中
		$cover = array();
		foreach ($manifest as $value) {
			$attr = $value["@attributes"];
			if( $attr && $attr['id'] == 'cover' && $attr['href']){
				$cover[] = $attr['href'];
				$cover[] = 'OEBPS/'.$attr['href'];
				break;
			}
		}
		foreach ($meta as $value) {
			$attr = $value["@attributes"];
			if( $attr && $attr['name'] == 'cover' && $attr['content']){
				$cover[] = $attr['content'];
				if(!strstr($attr['content'],'/')){
					$cover[] = 'OEBPS/Images/'.$attr['content'];
				}
				break;
			}
		}
		if(get_path_father($opfFile) != 'OEBPS/'){//根目录不是标准的
			$cover[] = get_path_father($opfFile).'images/cover.jpg';
		}
		foreach ($cover as $value) {
			$this->tryImage($localFile,$value,$coverName);
		}
		show_json('not found! '.$name);
	}

	private function tryImage($path,$value,$coverName){
		$imageThumb = TEMP_FILES . $coverName;
		if (!file_exists($imageThumb)){
			$file  = KodArchive::extractZipFile($path,$value,$coverName);
			if(!$file) return;
			$cm = new ImageThumb($file,'file');
			$cm->prorate($imageThumb,250,250);
		}
		if (!file_exists($imageThumb) || filesize($imageThumb)<100){
			$imageThumb = $file;
		}
		$cachePath  = IO::move($imageThumb,$this->cachePath);
		return IO::fileOut($cachePath);
	}
}