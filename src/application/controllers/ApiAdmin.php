<?php
defined('BASEPATH') OR exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: X-Requested-With");


class ApiAdmin extends CI_Controller {
	public function __construct(){
		parent::__construct();
		$this->load->helper(['jwt', 'authorization']);
		$this->load->model('UserModel');
    $this->load->model('PanelModel');
    $this->load->dbforge();
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
		$this->db->order_by('pt.parent', 'asc');
		$liste = $this->db->get()->result_array();
		//print_r($liste);

		


		$new = array();
		foreach ($liste as $a){
				$new[$a['parent']][] = $a;
		}
		$tree = $this->createTree($new, $new[0]);
		//print_r($tree);

		echo json_encode($tree);
		
	}
}
