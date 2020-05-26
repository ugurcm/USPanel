<?php
defined('BASEPATH') OR exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: X-Requested-With");


class ApiAdmin extends CI_Controller {
	public function __construct(){
		parent::__construct();
		$this->load->helper(['jwt', 'authorization', 'url']);
		$this->load->model('UserModel');
    $this->load->model('PanelModel');
		$this->load->dbforge();
		$this->output->set_header('Access-Control-Allow-Origin: *');
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
	public function loadSidebars(){
		
		$this->db->select('pt.*');
		$this->db->from('panel_table pt');
		//$this->db->order_by('pt.parent', 'asc');
		$this->db->order_by('pt.count ASC, pt.parent ASC');
		$liste = $this->db->get()->result_array();
		//print_r($liste);

		
		$tree = array();

		$new = array();
		foreach ($liste as $a){
				$new[$a['parent']][] = $a;
		}
		if($new){
			$tree = $this->createTree($new, $new[0]);
		}
		//print_r($tree);
		/*if(empty($tree)){
			$tree = array();
		}*/

		echo json_encode($tree);
		
	}
	
	public function elfinder_init() {
    $this->load->helper('path');
    $opts = array(
      // 'debug' => true, 
      'roots' => array(
        array(
          'driver' => 'LocalFileSystem',
          'path' => rtrim(set_realpath('assets/upload/user_files'), "\/"),
          'URL' => site_url('assets/upload/user_files') . '/'
          // more elFinder options here
          // C:\wamp\www\ozc\webanya_eticaret\assets
        )
      )
    );
    $this->load->library('elfinder_lib', $opts);
	}
	
	public function dosyaYonetim(){
		$this->load->view("dosyayonetim/index");
	}
}
