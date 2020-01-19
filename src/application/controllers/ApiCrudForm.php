<?php
defined('BASEPATH') OR exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: X-Requested-With");


class ApiCrudForm extends CI_Controller {
	public function __construct(){
		parent::__construct();
		$this->load->helper(['jwt', 'authorization']);
		$this->load->model('UserModel');
    $this->load->model('PanelModel');
    $this->load->dbforge();
  }
  
  public function getCrudData(){
		$gets = $this->input->get();

		$data = array();

		if(!isset($gets)){
			$data['error'] = "Veriler Girilmedi";
			//return false;
		}
		if(!isset($gets['tableSlug'])){
			$data['error'] = "Tablo Adı Girilmedi";
			//return false;
		}
		$panelTable = array();
		if(isset($gets['tableSlug'])){
			$this->db->select('pt.*');
			$this->db->from('panel_table pt');
			$this->db->where('pt.slug', $gets['tableSlug']);
			$panelTable = $this->db->get()->row_array();
			//print_r($panelTable);
			$data['pageData'] = $panelTable;
		}
		//print_r($panelTable);
		if(!$panelTable){
			$data['error'] = 'Panel Tablo Bulunamadı';
		}
		if($panelTable){
			$this->db->select('ptc.*, ptci.id ciId, ptci.title ciTitle, ptci.componentName ');
			$this->db->from('panel_table_column ptc');
			$this->db->join('panel_table_column_input ptci', 'ptci.id = ptc.panel_table_column_input_id', 'left');
			$this->db->where('ptc.panel_table_id', $panelTable['id']);
			$this->db->where('ptc.edit_form', 1);
      $this->db->order_by('ptc.count', 'asc');
      $tabloKolonlar = $this->db->get()->result_array();

      $data['crudColumns'] = array();
			//$data['crudColumns'][] = array('title' => 'Id', 'slug' => 'id');
			if($tabloKolonlar){
        foreach ($tabloKolonlar as $keyt => $satir) {
          $data['crudColumns'][] = $satir;
        }
      }
		
		}
		echo json_encode($data);
	}
	
	public function saveForm(){
    $gelen = $this->input->post();
    if(!$gelen) return false;
    //print_r($gelen);
    //return false;
    //echo $gelen['formData']['title'];
    $data['sonuc'] = 'ok';
		$gonder = $gelen['formData'];
    if($gelen['formType'] == 'add'){
			$this->db->insert($gelen['tableSlug'], $gonder);
			$data['aciklama'] = 'Kayıt Eklenmiştir. Yönlendiriliyorsunuz...';
		}
		if($gelen['formType'] == 'update'){
			$this->db->where('id', $gelen['formId']);
      $this->db->update($gelen['tableSlug'], $gonder);
			$data['aciklama'] = 'Kayıt Güncellenmiştir. Yönlendiriliyorsunuz...';
		}
      

    
    //print_r($gelen);
    /*if($gelen['formType'] == 'update'){
      $data['aciklama'] = 'Kayıt Güncellenmiştir. Yönlendiriliyorsunuz...';
      $gonder['title'] = $gelen['formData']['title'];
      $gonder['parent'] = $gelen['formData']['parent'];
      $gonder['hasTable'] = $gelen['formData']['hasTable'];
      //print_r($gonder);
      if($gelen['formData']['parent_path']){
        $gonder['parent_path'] = json_encode($gelen['formData']['parent_path']);
      }
      
      $this->db->where('id', $gelen['formId']);
      $this->db->update('panel_table', $gonder);
    }*/
    echo json_encode($data);    
	}
	
	public function getFormData(){
    $gets = $this->input->get();
    //if(!$gets) return false;
    //if(!$gets['id']) return false;

    $data = array();
    if($gets['id']){
      $this->db->select('pt.*');
      $this->db->from($gets['tableSlug'].' pt');
      $this->db->where('pt.id', $gets['id']);
      $data['formData'] = $this->db->get()->row_array();
      if(isset($data['formData']['parent_path'])){
				if($data['formData']['parent_path'] && $data['formData']['parent_path'] != '[]'){
					$data['formData']['parent_path'] = json_decode($data['formData']['parent_path'], true);
				}
      }
     
    }
  
    //$data['formData']['title'] = "ok then";
    //$data['formData']['parent_path'] = array("0", "13", "15", "16");

    /*$this->db->select('pt.id, pt.title');
    $this->db->from('panel_table pt');
    $this->db->where('pt.parent', 0);
    $data['parentPathList'] = $this->db->get()->result_array();*/


    echo json_encode($data);

  }

}
