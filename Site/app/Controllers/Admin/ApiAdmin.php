<?php namespace App\Controllers\Admin;
use App\Controllers\BaseController;
use App\Libraries\GenelLib;
use App\Libraries\PanelLib;
use App\Libraries\ElfinderLib;
class ApiAdmin extends BaseController
{

	public function __construct(){
		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
		$this->request = \Config\Services::request();
	}
	private function createTree(&$list, $parent){
		$tree = array();
		foreach ($parent as $k=>$l){
				if(isset($list[$l['id']])){
						$l['children'] = $this->createTree($list, $list[$l['id']]);
				}
				$tree[] = $l;
		} 
		return $tree;
	}
	private function recursive_array_search($needle, $haystack, $currentKey = '') {
		$bulundumu = 0;
		foreach($haystack as $key=>$value) {
			if($value['slug'] == $needle){
				$bulundumu = 1;
				return $value;
			}
			if($value['component_name'] == $needle){
				$bulundumu = 1;
				return $value;
			}
			
			if($bulundumu == 0 && !empty($value['children'])){
				$sonuc = $this->recursive_array_search($needle, $value['children']);
				if ($sonuc !== false){
					return $sonuc;
				}
			}
			
		}
		return false;
	}

	public function loadSidebars(){
		//$this->response->setContentType('Content-Type: application/json');
		$db = \Config\Database::connect();
		
		/*$gets = $this->request->getVar(null, FILTER_SANITIZE_STRING);
		//print_r($gets);
		$aranan = '';
		if(!empty($gets['url'])){
			$liste = explode('/', $gets['url']);
			$aranan = end($liste);	// sondaki parametre aranıyor.  /home gibi
		}*/

		
		$liste = $db->query('select p.id, p.title, p.parent,
			p.slug,p.list_type,p.icon,p.has_table, 
			p.component_name
			from panel p 
			where p.show_sidebar = 1
			order by p.count asc, p.parent asc')->getResultArray();
		//print_r($liste);
		//return false;

		$tree = array();

		$new = array();
		foreach ($liste as $a){
			$new[$a['parent']][] = $a;
		}
		
		if($new){
			$tree = $this->createTree($new, $new[0]);
		}
		//print_r($tree);
		//return;
		
		/*$sonuc = $this->recursive_array_search($aranan, $tree);
		//print_r($sonuc);
		if(!empty($sonuc['parent_path'])){
			$liste = json_decode($sonuc['parent_path'], true);	
			//print_r($liste);	
			$menuSecilenIdler = array();
			if(!empty($liste)){
				foreach ($liste as $keyi => $item) {
					if($item > 0){
						$menuSecilenIdler []= (int)$item;
					}
				}
			}
			$menuSecilenIdler []= (int)$sonuc['id'];
			//print_r($menuSecilenIdler);
			$data['menuSecilenIdler'] = $menuSecilenIdler;
			$data['menuDerinlik'] = count($menuSecilenIdler);
		}*/
		
		$data['tree'] = $tree;
		echo json_encode($data);
		//print_r($sonuc);

	}

	public function elfinder_init() {
		$opts = array(
      'debug' => true, 
      'roots' => array(
        array(
          'driver' => 'LocalFileSystem',
          'path' => FCPATH.'assets/upload/user_files',
          //'path' => WRITEPATH.'uploads',
          'URL' => site_url('assets/upload/user_files') . '/'
        )
      )
		);
		//print_r($opts);
		$elfinder = new ElfinderLib($opts);
	}

	public function dosyaYonetim(){
		return view("dosyayonetim/index");
	}
	




}
