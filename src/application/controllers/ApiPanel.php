<?php
defined('BASEPATH') OR exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: X-Requested-With");


class ApiPanel extends CI_Controller {

	public function __construct(){
		parent::__construct();
		$this->load->helper(['jwt', 'authorization']);
		$this->load->model('UserModel');
    $this->load->model('PanelModel');
    $this->load->dbforge();
	}
  public function panelComponentInit(){
    $gelen = $this->input->post();
    if(!$gelen) return false;
    $panelTableId = $gelen['pageId'];
    $data['sonuc'] = 'ok';

    $data['panelTable'] = $this->db->select('*')
    ->from('panel_table pt')
    ->where('pt.id', $panelTableId)
    ->get()->row_array();

    $data['crudData']['crudColumns'] = array(
      array('title' => 'ID', 'slug' => 'id'),
      array('title' => 'Başlık', 'slug' => 'title'),
      array('title' => 'İnput Türü', 'slug' => 'title', 'joinTable' => 'panel_table_column_input', 'as' => 'panel_table_column_input_title'),
      array('title' => 'Kolon Tipi', 'slug' => 'title', 'joinTable' => 'panel_table_column_type', 'as' => 'panel_table_column_type_title'),
      array('title' => 'Düzenle')
    );
    $tableJoins = array(
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
    );

    echo json_encode($data);
  }
	public function getComponentList(){
    $gets = $this->input->get();
    if(!$gets) return false;
    //$data = $this->getTableList($gets);
    //print_r($gets);
    
    $crudColumns = array(
      array('title' => 'ID', 'slug' => 'id'),
      array('title' => 'Başlık', 'slug' => 'title'),
      array('title' => 'İnput Türü', 'slug' => 'title', 'joinTable' => 'panel_table_column_input', 'as' => 'panel_table_column_input_title'),
      array('title' => 'Kolon Tipi', 'slug' => 'title', 'joinTable' => 'panel_table_column_type', 'as' => 'panel_table_column_type_title'),
      array('title' => 'Düzenle')
    );
    $tableJoins = array(
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
    );

    $data = $this->getTableList($gets, $crudColumns, $tableJoins);
    echo json_encode($data);
  }

	public function findPageParent(){
    $gets = $this->input->get();
    if(!$gets) return false;

    $this->db->select('t.*');
    $this->db->from($gets['table'].' t');
    $this->db->where('t.id', $gets['pageId']);
    $data['secilenPage'] = $this->db->get()->row_array();
    echo json_encode($data);
  }
	public function getCrudData(){
    $gets = $this->input->get();
    if(!$gets) return false;
    //$data = $this->getTableList($gets);
    //print_r($data);
    
    $data['crudData']['crudColumns'] = array(
      array('title' => 'ID', 'slug' => 'id'),
      array('title' => 'Başlık', 'slug' => 'title'),
      array('title' => 'Tablo Adı', 'slug' => 'slug'),
      array('title' => 'Düzenle')
    );
    
    //$data = $this->getTableList($gets, $data['crudData']['crudColumns']);
    //$data['gets'] = $gets;
    echo json_encode($data);
  }
  public function getCrudList(){
    $gets = $this->input->get();
    if(!$gets) return false;
    //$data = $this->getTableList($gets);
    //print_r($data);
    
    $data['crudData']['crudColumns'] = array(
      array('title' => 'ID', 'slug' => 'id'),
      array('title' => 'Başlık', 'slug' => 'title'),
      array('title' => 'Tablo Adı', 'slug' => 'slug'),
      array('title' => 'Düzenle')
    );
    
    $data = $this->getTableList($gets);
    //$data['gets'] = $gets;
    echo json_encode($data);
  }
	public function getTableList($gets = array(), $crudColumns = array(), $tableJoins = array()){
    $gets = $this->input->get();
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
    //print_r($gets);
    
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
		//print_r($data);
    //echo json_encode($data);
    
    //$data['crudData']['crudColumns'] = $crudColumns;
		return $data;
  }
  public function saveForm(){
    $gelen = $this->input->post();
    if(!$gelen) return false;
    //print_r($gelen);
    //return false;
    //echo $gelen['formData']['title'];
    $data['sonuc'] = 'ok';

    if($gelen['formType'] == 'add'){

      $gonder['slug'] = $this->PanelModel->temizle($gelen['formData']['title']);
      
      $tabloSonucArr['sonuc'] = 'ok';
      if($gelen['formData']['hasTable']){
        $tabloSonucArr = $this->createTable($gonder['slug']);
      }
      
      if($tabloSonucArr['sonuc'] == 'err'){
        $data['sonuc'] = 'err';
        $data['aciklama'] = $tabloSonucArr['aciklama'];
      }
      if($tabloSonucArr['sonuc'] == 'ok'){
        $data['aciklama'] = 'Tablo Eklenmiştir. Yönlendiriliyorsunuz...';
        
        $gonder['title'] = $gelen['formData']['title'];
        $gonder['parent'] = $gelen['formData']['parent'];
        $gonder['hasTable'] = $gelen['formData']['hasTable'];
        if($gelen['formData']['parent_path']){
          $gonder['parent_path'] = json_encode($gelen['formData']['parent_path']);
        }
        $this->db->insert('panel_table', $gonder);
      }

      

    }
    //print_r($gelen);
    if($gelen['formType'] == 'update'){
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
    }
    echo json_encode($data);    
  }

  public function createTable($tableName = ''){

    //$tableName = 'sayfalar';
    $data['sonuc'] = 'err';
    if($tableName == ''){
      $data['aciklama'] = "Tablo ismi giriniz.";
      return $data;
    }

    if($this->db->table_exists($tableName)){
      $data['aciklama'] = "Tablo daha önce eklenmiş.";
    }else{
      $this->dbforge->add_key('id', TRUE);
      $fields = array(
        'id' => array(
          'type' => 'INT',
          'constraint' => 11,
          'unsigned' => TRUE,
          'auto_increment' => TRUE,
        )
      );

      $this->dbforge->add_field($fields);
      $attributes = array('ENGINE' => 'InnoDB');
      $this->dbforge->create_table($tableName, FALSE, $attributes);
      
      $data['sonuc'] = 'ok';
      $data['aciklama'] = 'Tablo oluşturuldu';
    }


    return $data;
  }

  public function tableFieldAddTest(){
    /* 
      
        'title' => array(
          'type' => 'VARCHAR',
          'constraint' => '255',
          'default' => ''
        ) 
    */
    $eklenecekTable = 'sayfalar';
    $eklenecekIsim = 'yazi2';
    if($this->db->field_exists($eklenecekIsim, $eklenecekTable)){
      echo "bu alan eklenmiş";
    }else{

      
      $fields = array(
        $eklenecekIsim => 
          array('type' => 'VARCHAR', 'constraint' => 255, 'default' => '')
      );
      $this->dbforge->add_column($eklenecekTable, $fields);
    }
  }

  public function addTableField($tableName='', $columnName = '', $columnDataType='VARCHAR', $type_length = '255', $type_default_value = ''){

    $data['sonuc'] = 'err';
    if($columnName == ''){
      $data['aciklama'] = "Sütun ismi giriniz.";
      return $data;
    }

    if($this->db->field_exists($columnName, $tableName)){
      $data['aciklama'] = "Sütun daha önce eklenmiş.";
    }else{
      $fields = array(
        $columnName => 
          array(
            'type' => $columnDataType,
            'constraint' => $type_length, 
            'default' => $type_default_value
          )
      );
      $this->dbforge->add_column($tableName, $fields);
      $data['sonuc'] = 'ok';
      $data['aciklama'] = 'Sütun oluşturuldu';
    }
    return $data;
  }

  public function modifyTableField($tableName='', $columnName = '', $oldColumnName = '', $columnDataType='VARCHAR', $type_length = '255', $type_default_value = ''){

    $data['sonuc'] = 'err';
    if($columnName == ''){
      $data['aciklama'] = "Sütun ismi giriniz.";
      return $data;
    }

    if(!$this->db->field_exists($oldColumnName, $tableName)){
      $data['aciklama'] = "Sütun daha önce eklenmemiş.";
    }else{

      $fields = array(
        $oldColumnName => array(
          'name' => $columnName,
          'type' => $columnDataType,
          'constraint' => $type_length, 
          'default' => $type_default_value
        ),
      );
      //echo $columnDataType;
      $this->dbforge->modify_column($tableName, $fields);


      /*$fields = array(
        $columnName => 
          array('type' => 'VARCHAR', 'constraint' => 255, 'default' => '')
      );
      $this->dbforge->add_column($tableName, $fields);*/
      $data['sonuc'] = 'ok';
      $data['aciklama'] = 'Sütun güncellendi.';
    }
    return $data;
  }


  public function saveFormPanelComponent(){
    $gelen = $this->input->post();
    if(!$gelen) return false;
    //print_r($gelen);
    //echo $gelen['formData']['title'];
    $data['sonuc'] = 'ok';


    $selectedPanelTableColumnType = $this->db->select('ptct.*')
      ->from('panel_table_column_type ptct')
      ->where('ptct.id', $gelen['formData']['panel_table_column_type_id'])
      ->get()->row_array();


    if($gelen['formType'] == 'add'){

      $panelTableId = $gelen['formData']['panel_table_id'];

      $panelTable = $this->db->select('*')
        ->from('panel_table pt')
        ->where('pt.id', $panelTableId)
        ->get()->row_array();
      

      $gonder['slug'] = $this->PanelModel->temizle($gelen['formData']['title']);
      $tabloSonucArr = $this->addTableField($panelTable['slug'], $gonder['slug'], $selectedPanelTableColumnType['slug'],$gelen['formData']['type_length'], $gelen['formData']['type_default_value'] );
      if($tabloSonucArr['sonuc'] == 'err'){
        $data['sonuc'] = 'err';
        $data['aciklama'] = $tabloSonucArr['aciklama'];
      }
      if($tabloSonucArr['sonuc'] == 'ok'){
        $data['aciklama'] = 'Tablo Sütunu Eklenmiştir. Yönlendiriliyorsunuz...';
        $gonder['panel_table_id'] = $gelen['formData']['panel_table_id'];
        $gonder['title'] = $gelen['formData']['title'];
        $gonder['panel_table_column_input_id'] = $gelen['formData']['panel_table_column_input_id'];
        $gonder['panel_table_column_type_id'] = $gelen['formData']['panel_table_column_type_id'];
        $gonder['type_length'] = $gelen['formData']['type_length'];
        $gonder['type_default_value'] = $gelen['formData']['type_default_value'];
        $gonder['show_in_crud'] = $gelen['formData']['show_in_crud'];
        $this->db->insert('panel_table_column', $gonder);
      }

      

    }

    if($gelen['formType'] == 'update'){


      $panelTableId = $gelen['formData']['panel_table_id'];

      $panelTable = $this->db->select('*')
        ->from('panel_table pt')
        ->where('pt.id', $panelTableId)
        ->get()->row_array();

      
      $panelTableColumn = $this->db->select('*')
        ->from('panel_table_column pt')
        ->where('pt.id', $gelen['formId'])
        ->get()->row_array();

      

      $gonder['slug'] = $this->PanelModel->temizle($gelen['formData']['title']);

      $tabloSonucArr = $this->modifyTableField($panelTable['slug'], $gonder['slug'], $panelTableColumn['slug'], $selectedPanelTableColumnType['slug'], $gelen['formData']['type_length'], $gelen['formData']['type_default_value'] );
      if($tabloSonucArr['sonuc'] == 'err'){
        $data['sonuc'] = 'err';
        $data['aciklama'] = $tabloSonucArr['aciklama'];
      }
      if($tabloSonucArr['sonuc'] == 'ok'){
        $data['aciklama'] = 'Tablo Sütunu Güncellenmiştir. Yönlendiriliyorsunuz...';
        $gonder['title'] = $gelen['formData']['title'];
        $gonder['panel_table_id'] = $gelen['panelId'];
        $gonder['panel_table_column_input_id'] = $gelen['formData']['panel_table_column_input_id'];
        $gonder['panel_table_column_type_id'] = $gelen['formData']['panel_table_column_type_id'];
        $gonder['type_length'] = $gelen['formData']['type_length'];
        $gonder['type_default_value'] = $gelen['formData']['type_default_value'];
        $gonder['show_in_crud'] = $gelen['formData']['show_in_crud'];
        
        $this->db->where('id', $gelen['formId']);
        $this->db->update('panel_table_column', $gonder);
      }

        
    }
    echo json_encode($data);    
  }
  


  public function getFormDataPanelComponent(){
    $gets = $this->input->get();
    if(!$gets) return false;

    $this->db->select('ptci.*');
    $this->db->from('panel_table_column_input ptci');
    $this->db->order_by('ptci.id', 'asc');
    $data['panelTableColumnInputs'] = $this->db->get()->result_array();

    $this->db->select('ptct.*');
    $this->db->from('panel_table_column_type ptct');
    $this->db->order_by('ptct.id', 'asc');
    $data['panelTableColumnTypes'] = $this->db->get()->result_array();


    if(isset($gets['id']) && $gets['id']){
      $this->db->select('pt.*');
      $this->db->from('panel_table_column pt');
      $this->db->where('pt.id', $gets['id']);
      $data['formData'] = $this->db->get()->row_array();
      $this->db->select('pt.*');
      $this->db->from('panel_table pt');
      $this->db->where('pt.id', $data['formData']['panel_table_id']);
      $data['panelTable'] = $this->db->get()->row_array();
    }
    if(isset($gets['panel_table_id']) && $gets['panel_table_id']){
      $this->db->select('pt.*');
      $this->db->from('panel_table pt');
      $this->db->where('pt.id', $gets['panel_table_id']);
      $data['panelTable'] = $this->db->get()->row_array();
      $data['formData']['panel_table_id'] = $data['panelTable']['id'];
    }

    echo json_encode($data);
  }
  public function findParentsTest(){
    //echo "fp test";
    $liste = $this->PanelModel->findParents('panel_table', 16);
    print_r($liste);

  }
  public function getParentList(){
    $gets = $this->input->get();
    //print_r($gets);
    //return false;
    //echo $gets['parentPath'];
    $data = array();
    //$data['parentPathList'] = array();
    if(isset($gets['parentPath']) && $gets['parentPath'] != '[]' && $gets['parentPath']){
      //print_r($gets['parentPath']);
      //$gets['parentPath'] = json_decode($gets['parentPath'], true);
      if($gets['parentPath']){
        foreach ($gets['parentPath'] as $key => $value) {
          $this->db->select('pt.id, pt.title');
          $this->db->from('panel_table pt');
          $this->db->where('pt.parent', $value);
          $data['parentPathList'][] = $this->db->get()->result_array();
        }
      }
    }
    
    
    echo json_encode($data);
  }

  public function getParentPath(){
    $gets = $this->input->get();
    $data = array();
    $data['formData'] = array();
    $liste = $this->PanelModel->findParents('panel_table', $gets['parent']);
    if($liste){
      foreach ($liste as $key => $value) {
        $data['formData']['parentPath'][] = $value['parent'];
      }
    }
    $data['formData']['parentPath'][] = $gets['parent'];
    if(isset($data['formData']['parent_path']) && $data['formData']['parent_path'] && $data['formData']['parent_path'] != '[]'){
      $data['formData']['parent_path'] = json_decode($data['formData']['parent_path'], true);
    }
    echo json_encode($data);
    //print_r($liste);
  }


  public function getFormData(){
    $gets = $this->input->get();
    //if(!$gets) return false;
    //if(!$gets['id']) return false;

    $data = array();
    if($gets['id']){
      $this->db->select('pt.*');
      $this->db->from('panel_table pt');
      $this->db->where('pt.id', $gets['id']);
      $data['formData'] = $this->db->get()->row_array();
      if(isset($data['formData']['parent_path']) && $data['formData']['parent_path'] && $data['formData']['parent_path'] != '[]'){
        $data['formData']['parent_path'] = json_decode($data['formData']['parent_path'], true);
      }
      if(!$data['formData']['parent_path']){
        //$data['formData']['parent_path'] = array("0");
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
  public function deleteRow(){
    $gelen = $this->input->post();
    if(!$gelen) return false;
    //print_r($gelen);

    $panelTable = $this->db->select('*')
    ->from('panel_table pt')
    ->where('pt.id', $gelen['itemId'])
    ->get()->row_array();
    
    $data['sonuc'] = 'err';
    $data['aciklama'] = 'Kayıt bulunamadı';

    if($panelTable){
      
      if($this->db->table_exists($panelTable['slug'])){
        $this->dbforge->drop_table($panelTable['slug'],TRUE);
      }
      

      $this->db->where('id', $gelen['itemId']);
      $this->db->delete('panel_table');
      $data['sonuc'] = 'ok';
      $data['aciklama'] = 'Kayıt Silinmiştir.';
    }

    echo json_encode($data);
  }
  public function deleteRowTableColumn(){
    $gelen = $this->input->post();
    if(!$gelen) return false;
    //print_r($gelen);
    $data['gelen'] = $gelen;
    $data['sonuc'] = 'err';
    $data['aciklama'] = 'Kayıt bulunamadı';

    $panelTableColumn = $this->db->select('*')
    ->from('panel_table_column pt')
    ->where('pt.id', $gelen['itemId'])
    ->get()->row_array();
    //$data['panelTableColumn'] = $panelTableColumn;

    if($panelTableColumn){

      $panelTable = $this->db->select('*')
      ->from('panel_table pt')
      ->where('pt.id', $panelTableColumn['panel_table_id'])
      ->get()->row_array();

      if ($this->db->field_exists($panelTableColumn['slug'], $panelTable['slug'])){
        $this->dbforge->drop_column($panelTable['slug'], $panelTableColumn['slug']);
      }


      $this->db->where('id', $gelen['itemId']);
      $this->db->delete('panel_table_column');
      $data['sonuc'] = 'ok';
      $data['aciklama'] = 'Kayıt Silinmiştir.';
      
    }

    echo json_encode($data);
  }

  


}