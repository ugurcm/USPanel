<?php
defined('BASEPATH') OR exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: X-Requested-With");


class ApiCrudList extends CI_Controller {
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
      //echo $gets['tableSlug'];
			$this->db->select('pt.*');
			$this->db->from('panel_table pt');
			$this->db->where('pt.slug', $gets['tableSlug']);
			$panelTable = $this->db->get()->row_array();
      //print_r($panelTable);
      $panelTable['pageTitle'] = $panelTable['title'].' Yönetimi';
			$data['pageData'] = $panelTable;
		}
		//print_r($panelTable);
		if(!$panelTable){
			$data['error'] = 'Panel Tablo Bulunamadı';
		}
		if($panelTable){
			$this->db->select('ptc.id, ptc.title, ptc.slug');
			$this->db->from('panel_table_column ptc');
			$this->db->where('ptc.panel_table_id', $panelTable['id']);
			$this->db->where('ptc.show_in_crud', 1);
      $this->db->order_by('ptc.count', 'asc');
      $tabloKolonlar = $this->db->get()->result_array();

      $data['crudData']['crudColumns'] = array();
			$data['crudData']['crudColumns'][] = array('title' => 'Id', 'slug' => 'id');
			if($tabloKolonlar){
        foreach ($tabloKolonlar as $keyt => $satir) {
          $data['crudData']['crudColumns'][] = $satir;
        }
      }
			$data['crudData']['crudColumns'][] = array('title' => 'İşlemler');
		}
		echo json_encode($data);
	}

	public function getCrudList(){
		$gets = $this->input->get();

		$data = array();
    //print_r($gets);
    //$data['gets'] = $gets;
		if(!isset($gets)){
			$data['error'] = "Veriler Girilmedi";
			//return false;
		}
		if(!isset($gets['tableSlug'])){
			$data['error'] = "Tablo Adı Girilmedi";
			//return false;
		}
		$tableListData = array();
		$tableListData['table'] = $gets['tableSlug'];
		$tableListData['sayfaNo'] = $gets['sayfaNo'];
		$tableListData['kacar'] = $gets['kacar'];
		$tableListData['nereden'] = $gets['nereden'];
		$tableListData['sayfaSayisi'] = $gets['sayfaSayisi'];
		$tableListData['toplam'] = $gets['toplam'];
		$tableListData['selectColumns'] = $gets['crudColumns'];
		//print_r($tableListData);
		$data = $this->getTableList($tableListData,$gets['crudColumns']);
    

		echo json_encode($data);
	}

	public function getTableList($gets = array(), $crudColumns = array(), $tableJoins = array()){
		//$gets = $this->input->get();
		//print_r($crudColumns);
    if(!$gets) return false;
    
		if(!isset($gets)){
			echo "Veriler Girilmedi";
			return false;
		}
		if(!isset($gets['table'])){
			echo "Tablo Adı Girilmedi";
			return false;
		}

    if (empty($gets['sayfaNo']) || !is_numeric($gets['sayfaNo'])) {
      $sayfaNo = 1;
    } else {
      $sayfaNo = $gets['sayfaNo'];
    }
    if (empty($gets['kacar']) || !is_numeric($gets['kacar'])) {
      $kacar = 2;
    } else {
      $kacar = $gets['kacar'];
    }
    if (empty($gets['orderby'])) {
      $orderby = 't.count';
    } else {
      $orderby = $gets['orderby'];
    }
    if (empty($gets['orderType'])) {
      $orderType = 'asc';
    } else {
      $orderType = $gets['orderType'];
    }
    if(!isset($gets['pageId'])){
      //$gets['pageId'] = 0;
    }

    //print_r($gets);
    
    $selectStr = '';
    /*if($tableJoins){
      foreach ($tableJoins as $keyj => $joinRow) {
        $selectStr .= '';
      }
    }*/
    //print_r($gets['where']);
    $this->db->select('COUNT(t.id) toplam');
    $this->db->from($gets['table'] . ' t');
    if($tableJoins){
      foreach ($tableJoins as $keyj => $joinRow) {
        //echo $joinRow['tableName'].' '.$joinRow['tableName'], $joinRow['tableName'].'.'.$joinRow['sourceCol'].'= t.'.$joinRow['targetCol'],'left';

        //echo '-------------\n';
        $this->db->join($joinRow['tableName'].' '.$joinRow['tableName'], $joinRow['tableName'].'.'.$joinRow['sourceCol'].'= t.'.$joinRow['targetCol'],'left');
      }
    }
    if(isset($gets['where']) && $gets['where']){
      foreach ($gets['where'] as $keyw => $itemWhere) {
        $this->db->where('t.'.$itemWhere['name'], $itemWhere['value']);
      }
    }
    if(isset($gets['pageId'])){
      if($gets['pageId'] || $gets['pageId'] == 0){
        $this->db->where('t.parent', $gets['pageId']);
      }      
    }

    
    $kayitSayisi = $this->db->get()->row_array();


    $sSayisi = ceil($kayitSayisi['toplam'] / $kacar);
    $nereden = ($sayfaNo * $kacar) - $kacar;
		
    //print_r($crudColumns);
    $dbSelectStr = '';
    if($crudColumns){
      foreach ($crudColumns as $keyc => $valuec) {
        //print_r($valuec);
        if(isset($valuec['slug']) && $valuec['slug']){
          $selectedTable = 't';
          
          if(isset($valuec['joinTable'])){
            $selectedTable = $valuec['joinTable'];
            $dbSelectStr .= $selectedTable.'.'.$valuec['slug'].' as '.$valuec['as'].', ';
          }else{
            $dbSelectStr .= $selectedTable.'.'.$valuec['slug'].', ';
          }

          //$dbSelectStr.= $selectedTable.'.'.$valuec['slug'].' as '.$valuec['as'];
        }
      }
    }

    //echo $dbSelectStr;
		//echo '----';
		//echo $gets['table'];
    $this->db->select($dbSelectStr);
    $this->db->from($gets['table'] . ' t');

    //print_r($tableJoins);
    if($tableJoins){
      foreach ($tableJoins as $keyj => $joinRow) {
        //echo $joinRow['tableName'].' '.$joinRow['tableName'], $joinRow['tableName'].'.'.$joinRow['sourceCol'].'= t.'.$joinRow['targetCol'],'left';

        //echo '-------------\n';
        $this->db->join($joinRow['tableName'].' '.$joinRow['tableName'], $joinRow['tableName'].'.'.$joinRow['sourceCol'].'= t.'.$joinRow['targetCol'],'left');
      }
    }
    if(isset($gets['where']) && $gets['where']){
      foreach ($gets['where'] as $keyw => $itemWhere) {
        $this->db->where('t.'.$itemWhere['name'], $itemWhere['value']);
      }
    }
    
    if(isset($gets['pageId'])){
      if($gets['pageId'] || $gets['pageId'] == 0){
        $this->db->where('t.parent', $gets['pageId']);
      }      
    }


    $this->db->group_by("t.id");
    $this->db->limit($kacar, $nereden);
    $data['crudList'] = $this->db->get()->result_array();
    //print_r($gets);
		$data['crudData']['sayfaSayisi'] = $sSayisi;
    //$data['kacar']   = $kacar;
		$data['crudData']['nereden'] = $nereden;
    $data['crudData']['toplam'] = $kayitSayisi['toplam'];
    
    //$data['crudData']['sayfaNo'] = $sayfaNo;
    //$data['crudData']['kacar'] = $kacar;
    //$data['toplam']
    /*
    sayfaNo: 1, 
    kacar: 30,
    listData: [],
    nereden: 0,
    sayfaSayisi: 0,
    toplam: 0,
    */
		//print_r($data);
		//echo json_encode($data);
		return $data;
  }

  public function deleteRow(){
    $gelen = $this->input->post();
    if(!$gelen) return false;
    //print_r($gelen);

    $tableRow = $this->db->select('*')
    ->from($gelen['tableSlug'].' pt')
    ->where('pt.id', $gelen['itemId'])
    ->get()->row_array();
    
    $data['sonuc'] = 'err';
    $data['aciklama'] = 'Kayıt bulunamadı';

    if($tableRow){

      $this->db->where('id', $gelen['itemId']);
      $this->db->delete($gelen['tableSlug']);
      $data['sonuc'] = 'ok';
      $data['aciklama'] = 'Kayıt Silinmiştir.';
    }

    echo json_encode($data);
  }

}
