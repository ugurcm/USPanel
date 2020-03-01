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
      $this->db->select('ptc.id, ptc.title, ptc.slug, 
      pt.slug tableName, 
      ptc.panel_table_column_input_id,
      ptc.relation_type_id, ptc.relation_panel_table_id,
      ptc.relation_panel_table_column_slug as, ptj.slug joinTable,
      ptci.componentName componentName');
			$this->db->from('panel_table_column ptc');
			$this->db->join('panel_table pt', 'pt.id = ptc.panel_table_id', 'left');
			$this->db->join('panel_table ptj', 'ptj.id = ptc.relation_panel_table_id', 'left');
			$this->db->join('panel_table_column_input ptci', 'ptci.id = ptc.panel_table_column_input_id', 'left');
			$this->db->where('ptc.panel_table_id', $panelTable['id']);
			$this->db->where('ptc.show_in_crud', 1);
      $this->db->order_by('ptc.count', 'asc');
      $tabloKolonlar = $this->db->get()->result_array();

      $data['crudData']['crudColumns'] = array();
			//$data['crudData']['crudColumns'][] = array('title' => 'Id', 'slug' => 'id');
			if($tabloKolonlar){
        foreach ($tabloKolonlar as $keyt => $satir) {
          //$data['crudData']['crudColumns'][] = $satir;
          if($satir['relation_type_id'] == 2){
            
            /*$this->db->select('pt.*');
            $this->db->from('panel_table pt');
            $this->db->where('pt.id', $satir['relation_panel_table_id']);
            $relationPanelTable = $this->db->get()->row_array();
            
            //print_r($relationPanelTable);
            //$satir['relationRow'] = $relationPanelTable;
            if($relationPanelTable){
              $satir['joinTable'] = $relationPanelTable['slug'];
              //$satir['as'] = $satir['relation_panel_table_slug'];
            }*/


            /*if($relationPanelTable){
              
              $this->db->select('t.*');
              $this->db->from($relationPanelTable['slug'].' t');  
              $satir['relationList'] = $this->db->get()->result_array();
            }*/




            
          }
          //print_r($satir);
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
		$tableListData['pageData'] = $gets['pageData'];
		$tableListData['table'] = $gets['tableSlug'];
		$tableListData['sayfaNo'] = $gets['sayfaNo'];
		$tableListData['kacar'] = $gets['kacar'];
		$tableListData['nereden'] = $gets['nereden'];
		$tableListData['sayfaSayisi'] = $gets['sayfaSayisi'];
		$tableListData['toplam'] = $gets['toplam'];
		$tableListData['selectColumns'] = $gets['crudColumns'];
		//print_r($tableListData);
    //print_r($gets['crudColumns']);
    
    $tableJoins = array();
    if($gets['crudColumns']){
      foreach ($gets['crudColumns'] as $key => $value) {
        $item = array();
        if(!empty($value['joinTable']) && !empty($value['tableName'])){
          $item['tableName'] = $value['tableName'];
          $item['sourceCol'] = $value['slug'];
          $item['targetTable'] = $value['joinTable'];
          $item['targetCol'] = $value['as'];
          $item['selectSlug'] = $item['sourceCol'].'_'.$item['targetCol'];
          $tableJoins []=$item;
        }
        /*$item['sourceCol'] = $value['slug'];
        $item['targetCol'] = $value['slug'];
        $item['selectSlug'] = $value['slug'];*/
        
      }
    }
    //print_r($tableJoins);
    /*$tableJoins = array(
      array(
        'tableName' => 'panel_table_column_input',
        'sourceCol' => 'id', 
        'targetCol' => 'panel_table_column_input_id',
        'selectSlug' => 'panel_table_column_input_title' 
      ),
      array(
        'tableName' => 'panel_table_column_type',
        'sourceCol' => 'id', 
        'targetCol' => 'panel_table_column_type_id',
        'selectSlug' => 'panel_table_column_type_title' 
      )
    );*/

    //print_r($tableListData);
    $parent = '';
    if(!empty($tableListData['selectColumns'])){
      foreach ($tableListData['selectColumns'] as $key => $value) {
        if(!empty($value['panel_table_column_input_id'])){
          if($value['panel_table_column_input_id'] == 8){
            $parent = $value;
          }
        }
        
      }
    }
    //print_r($tableListData['selectColumns']);
    //print_r($parent);
    //print_r($gets);
    /*$whereItem = array(
      array(
        'name' => 'id',
        'value' => '2'
      )
    );*/
    //print_r($gets);
    //echo $gets['pageId'];
    $parentId = 0;

    if($gets['pageId']){
      $parentId = $gets['pageId'];
    }

    if($parent){
      //print_r($parent);
      //echo "parent var";
      //print_r($parent);
      $whereItem = array(
        array(
          'name' => $parent['slug'],
          'value' => $parentId
        )
      );
      $tableListData['where'] = $whereItem;
    }

    //print_r($parent);

    //print_r($gets);
    //print_r($whereItem);

		$data = $this->getTableList($tableListData,$gets['crudColumns'],$tableJoins);
    

		echo json_encode($data);
  }
  

  public function findPageParent(){
    $gets = $this->input->get();
    if(!$gets) return false;
    $data['gets'] = $gets;
    $parent = '';
    if(!empty($gets['crudColumns'])){
      foreach ($gets['crudColumns'] as $key => $value) {
        if(!empty($value['panel_table_column_input_id'])){
          if($value['panel_table_column_input_id'] == 8){
            $parent = $value;
          }
        }
        
      }
    }
    $data['parent'] = $parent;
    $this->db->select('t.*');
    $this->db->from($gets['table'].' t');
    $this->db->where('t.id', $gets['pageId']);
    $data['secilenPage'] = $this->db->get()->row_array();
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

    /*$groupBy = 't.id';
    if($gets['pageData']['language_active'] == 1){
      //$groupBy = 't.content_id';
    }*/


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
        //echo $joinRow['targetTable'].' '.$joinRow['targetTable'], $joinRow['targetTable'].'.'.$joinRow['sourceCol'].'= t.'.$joinRow['sourceCol'],'left';

        //echo '-------------\n';
        $this->db->join($joinRow['targetTable'].' '.$joinRow['targetTable'], $joinRow['targetTable'].'.id = t.'.$joinRow['sourceCol'],'left');
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
    if($gets['pageData']['language_active'] == 1){
      //$groupBy = 't.content_id';
      $this->db->where('t.language_id', 1);
    }

    $this->db->group_by('t.id');
    $kayitSayisi = $this->db->get()->row_array();


    $sSayisi = ceil($kayitSayisi['toplam'] / $kacar);
    $nereden = ($sayfaNo * $kacar) - $kacar;
		
    $dbSelectStr = '';
    if($crudColumns){
      foreach ($crudColumns as $keyc => $valuec) {
        if(!empty($valuec['slug'])){
          $selectedTable = 't';
          if(!empty($valuec['joinTable'])){
            $dbSelectStr .= $valuec['joinTable'].'.'.$valuec['as'].' as '.$valuec['as'].', ';//.'_'.$valuec['as'].', '
          }
          $dbSelectStr .= $selectedTable.'.'.$valuec['slug'].', ';
        }
      }
    }
    //echo $dbSelectStr;
    $this->db->select($dbSelectStr.'');
    $this->db->from($gets['table'] . ' t');

    if($tableJoins){
      foreach ($tableJoins as $keyj => $joinRow) {
        $this->db->join($joinRow['targetTable'].' '.$joinRow['targetTable'], $joinRow['targetTable'].'.id = t.'.$joinRow['sourceCol'],'left');
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

    //$this->db->where('t.language_id', 1);
    
    //$this->db->group_by(array('t.id', 't.content_id'));
    if($gets['pageData']['language_active'] == 1){
      $this->db->where('t.language_id', 1);
    }
    
    $this->db->group_by('t.id');
    $this->db->limit($kacar, $nereden);
    $data['crudList'] = $this->db->get()->result_array();
		$data['crudData']['sayfaSayisi'] = $sSayisi;
		$data['crudData']['nereden'] = $nereden;
    $data['crudData']['toplam'] = $kayitSayisi['toplam'];
    

    if($data['crudList']){
      foreach ($data['crudList'] as $keyList => $valueList) {
        if($valueList){
          foreach ($valueList as $key => $value) {
            if($crudColumns){
              foreach ($crudColumns as $keyc => $column) {
                if(!empty($column['slug'])){
                  if($key == $column['slug'] && $column['panel_table_column_input_id'] == 17){
                    /*$liste = '';
                    if($value){
                      $values = json_decode($value, true);
                      $listeYazisi = '';
                      $data['crudList'][$keyList][$key] = '';
                      foreach ($values as $icListe => $listeItem) {
                        $data['crudList'][$keyList][$key] .= $listeItem['title'].($icListe+1 < count($values)?', ':'');
                      }
                    }*/

                    //print_r($valueList);
                    //print_r($column);
                  
                      $itemler = array();
                      $cokluTableAdi = $column['tableName'].'_to_'.$column['joinTable'];
                      $mevcutTableId = $column['tableName'].'_id';
                      
                      $this->db->select('*');
                      $this->db->where($mevcutTableId, $valueList['id']);
                      $this->db->from($cokluTableAdi);
                      $liste = $this->db->get()->result_array();
                      //print_r($liste);
                      if($liste){
                        foreach ($liste as $key => $value) {
                          $this->db->select('t.'.$column['as'].' title');
                          $this->db->from($column['joinTable'].' t');
                          $this->db->where('t.id', $value[$column['joinTable'].'_id']);
                          $item = $this->db->get()->row_array();
                          //print_r($item);
                          if($item){
                            $itemler []= $item;
                          }
                        }
                      }
                      $listeYazisi = '';
                      $data['crudList'][$keyList][$column['slug']] = '';
                      foreach ($itemler as $icListe => $listeItem) {
                        $data['crudList'][$keyList][$column['slug']] .= $listeItem['title'].($icListe+1 < count($itemler)?', ':'');
                      }

                      //print_r($itemler);

                      //$data['crudList'][$keyList][$key] = $itemler;
                      
                      //$data['formData'][$column['slug']] = $itemler;
               




                  }
                }
               
              }
            }
          }
        }
      }
    }

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
