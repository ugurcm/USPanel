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
  public function clusterTest(){
    /*$db_server_count = 4;
    $db_servers = Array(
      'db-1','db-2','db-3','db-4'
        //you get the idea
    );
    $full_table = 'mydatabase.mytable'; //just an example...obviously
    $hash = sprintf('%u', crc32($full_table));
    //echo $hash;
    //echo crc32($full_table);
    $host = $db_servers[($hash % $db_server_count)];
    //echo $host;*/

    for ($i=0; $i < 500000; $i++) { 
      for ($j=0; $j <= 10 ; $j++) { 
        $gonder = array();
        $gonder['board_id'] = $i;
        $gonder['pin_id'] = $j;
        $this->db->insert('board_has_pins',$gonder);
      }
      

    }
    

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

  public function getCrudDataDynamic(){
    $gets = $this->input->get();
    if(!$gets) return false;
    //$data = $this->getTableList($gets);
    //print_r($gets);
    
    $data['crudData']['crudColumns'] = $gets['crudData']['crudColumns'];
    
    //$data = $this->getTableList($gets, $data['crudData']['crudColumns']);
    //$data['gets'] = $gets;
    echo json_encode($data);
  }

  public function getCrudListDynamic(){
    $gets = $this->input->get();
    if(!$gets) return false;
    //$data = $this->getTableList($gets);
    //print_r($gets);
    
    /*$data['crudData']['crudColumns'] = array(
      array('title' => 'ID', 'slug' => 'id'),
      array('title' => 'Başlık', 'slug' => 'title'),
      array('title' => 'Tablo Adı', 'slug' => 'slug'),
      array('title' => 'Düzenle')
    );*/
    
    $data = $this->getTableList($gets, $gets['crudColumns'], array(), 0);
    //$data['gets'] = $gets;
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
	public function getTableList($gets = array(), $crudColumns = array(), $tableJoins = array(), $parentVarmi = 1){
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
    if($parentVarmi == 1){
      if(isset($gets['pageId'])){
        if($gets['pageId'] || $gets['pageId'] == 0){
          $this->db->where('t.parent', $gets['pageId']);
        }      
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
    
    if($parentVarmi == 1){
      if(isset($gets['pageId'])){
        if($gets['pageId'] || $gets['pageId'] == 0){
          $this->db->where('t.parent', $gets['pageId']);
        }      
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

  public function saveFormDynamic(){
    $gelen = $this->input->post();
    if(!$gelen) return false;
    if($gelen['formData']){
      $gelen['formData'] = json_decode($gelen['formData'], true);
    }
    //print_r($gelen['formData']);
    //return false;
    //print_r($gelen['crudColumns']);
    //return false;
    //echo $gelen['formData']['title'];
    
    $formId = 0;
    //print_r($gelen['formData']);
    //return false;

    if(!empty($gelen['formData'])){
      foreach ($gelen['formData'] as $key => $value) {
        if(is_array($value)){
          $gelen['formData'][$key] = json_encode($value);
        }
      }
    }
    $data['sonuc'] = 'ok';
		$gonder = $gelen['formData'];
    if($gelen['formType'] == 'add'){
      $this->db->insert($gelen['tableName'], $gonder);
      $formId = $this->db->insert_id();
			$data['aciklama'] = 'Kayıt Eklenmiştir. Yönlendiriliyorsunuz...';
		}
		if($gelen['formType'] == 'update'){
			$this->db->where('id', $gelen['formId']);
      $this->db->update($gelen['tableName'], $gonder);
      $formId = $gelen['formId'];
			$data['aciklama'] = 'Kayıt Güncellenmiştir. Yönlendiriliyorsunuz...';
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
        $gonder['language_active'] = $gelen['formData']['language_active'];
        if($gelen['formData']['parent_path']){
          $gonder['parent_path'] = json_encode($gelen['formData']['parent_path']);
        }
        $this->db->insert('panel_table', $gonder);

        //tablo eklendi, id kolonunu ekleyelim.
        $panel_table_id = $this->db->insert_id();
        $selectedPanelTable = $this->db->select('pt.*')
          ->from('panel_table pt')
          ->where('pt.id', $panel_table_id)
          ->get()->row_array();

        $gonderCol['panel_table_id'] = $selectedPanelTable['id'];
        $gonderCol['title'] = 'ID';
        $gonderCol['slug'] = 'id';
        $gonderCol['panel_table_column_input_id'] = 1;
        $gonderCol['panel_table_column_type_id'] = 2;
        $gonderCol['type_length'] = 11;
        $gonderCol['type_default_value'] = 0;
        $gonderCol['edit_form'] = 0;
        $gonderCol['show_in_crud'] = 1;
        $gonderCol['relation_type_id'] = 0;
        $this->db->insert('panel_table_column', $gonderCol);
      }
      
    }
    //print_r($gelen);
    if($gelen['formType'] == 'update'){
      $data['aciklama'] = 'Kayıt Güncellenmiştir. Yönlendiriliyorsunuz...';
      $gonder['title'] = $gelen['formData']['title'];
      $gonder['parent'] = $gelen['formData']['parent'];
      $gonder['hasTable'] = $gelen['formData']['hasTable'];
      $gonder['language_active'] = $gelen['formData']['language_active'];
      //print_r($gonder);
      if($gelen['formData']['parent_path']){
        $gonder['parent_path'] = json_encode($gelen['formData']['parent_path']);
      }
      
      $this->db->where('id', $gelen['formId']);
      $this->db->update('panel_table', $gonder);
      $panel_table_id = $gelen['formId'];
    }

    if($gelen['formData']['language_active'] == 1){
      //$panel_table_id
      $selectedPanelTable = $this->db->select('pt.*')
        ->from('panel_table pt')
        ->where('pt.id', $panel_table_id)
        ->get()->row_array();
      //print_r($selectedPanelTable);
      $tabloAdi = $selectedPanelTable['slug'];

      $eklenecekIsim = 'language_id';
      if(!$this->db->field_exists($eklenecekIsim, $tabloAdi)){
        $fields = array(
          $eklenecekIsim => 
            array('type' => 'INT', 'constraint' => 11, 'default' => '1', 'unsigned' => TRUE)
        );
        $this->dbforge->add_column($tabloAdi, $fields);

        $gonderCol['panel_table_id'] = $selectedPanelTable['id'];
        $gonderCol['title'] = $eklenecekIsim;
        $gonderCol['slug'] = $eklenecekIsim;
        $gonderCol['panel_table_column_input_id'] = 1;
        $gonderCol['panel_table_column_type_id'] = 2;
        $gonderCol['type_length'] = 11;
        $gonderCol['type_default_value'] = 1;     //1 türkçe
        $gonderCol['edit_form'] = 0;
        $gonderCol['show_in_crud'] = 0;
        $gonderCol['relation_type_id'] = 0;
        $gonderCol['form_type'] = 'Int';
        $this->db->insert('panel_table_column', $gonderCol);
      }

      $eklenecekIsim = 'content_id';
      if(!$this->db->field_exists($eklenecekIsim, $tabloAdi)){
        $fields = array(
          $eklenecekIsim => 
            array('type' => 'INT', 'constraint' => 11, 'default' => '0', 'unsigned' => TRUE)
        );
        $this->dbforge->add_column($tabloAdi, $fields);

        $gonderCol['panel_table_id'] = $selectedPanelTable['id'];
        $gonderCol['title'] = $eklenecekIsim;
        $gonderCol['slug'] = $eklenecekIsim;
        $gonderCol['panel_table_column_input_id'] = 1;
        $gonderCol['panel_table_column_type_id'] = 2;
        $gonderCol['type_length'] = 11;
        $gonderCol['type_default_value'] = 0;     //1 türkçe
        $gonderCol['edit_form'] = 0;
        $gonderCol['show_in_crud'] = 0;
        $gonderCol['relation_type_id'] = 0;
        $gonderCol['form_type'] = 'Int';
        $this->db->insert('panel_table_column', $gonderCol);
      }

      $selectedLangTable = $this->db->select('pt.*')
        ->from($tabloAdi.' pt')
        ->get()->result_array();
      if($selectedLangTable){
        foreach ($selectedLangTable as $key => $value) {
          $gonderContentId['content_id'] = $value['id'];
          $this->db->where('id', $value['id'])->update($tabloAdi, $gonderContentId);
          
        }
      }
        //print_r($selectedPanelTable);

      
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


  public function getPanelTableRow(){
    $gets = $this->input->get();
    $data = $this->db->select('ptc.*')
        ->from('panel_table_column ptc')
        ->where('ptc.panel_table_id', $gets['panelTableId'])
        ->get()->result_array();

    echo json_encode($data);
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
        $gonder['form_type'] = $gelen['formData']['form_type'];
        $gonder['show_in_crud'] = $gelen['formData']['show_in_crud'];
        $gonder['relation_type_id'] = $gelen['formData']['relation_type_id'];
        $gonder['relation_panel_table_id'] = $gelen['formData']['relation_panel_table_id'];
        $gonder['relation_panel_table_column_slug'] = $gelen['formData']['relation_panel_table_column_slug'];
        $gonder['relation_panel_table_altkategori_slug'] = $gelen['formData']['relation_panel_table_altkategori_slug'];
        $gonder['altkategori_slug'] = $gelen['formData']['altkategori_slug'];
        $gonder['language_active'] = $gelen['formData']['language_active'];
        $gonder['slug_kolon'] = $gelen['formData']['slug_kolon'];
        $gonder['edit_form'] = $gelen['formData']['edit_form'];
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
        $gonder['form_type'] = $gelen['formData']['form_type'];
        $gonder['show_in_crud'] = $gelen['formData']['show_in_crud'];
        $gonder['relation_type_id'] = $gelen['formData']['relation_type_id'];
        $gonder['relation_panel_table_id'] = $gelen['formData']['relation_panel_table_id'];
        $gonder['relation_panel_table_column_slug'] = $gelen['formData']['relation_panel_table_column_slug'];
        $gonder['relation_panel_table_altkategori_slug'] = $gelen['formData']['relation_panel_table_altkategori_slug'];
        $gonder['altkategori_slug'] = $gelen['formData']['altkategori_slug'];
        $gonder['language_active'] = $gelen['formData']['language_active'];
        $gonder['slug_kolon'] = $gelen['formData']['slug_kolon'];
        $gonder['edit_form'] = $gelen['formData']['edit_form'];
        $this->db->where('id', $gelen['formId']);
        $this->db->update('panel_table_column', $gonder);
      }

        
    }

    if($gelen['formData']['panel_table_column_input_id'] == 17){  // çoklu ilişki tablosu

      $panelTableRelation = $this->db->select('*')
        ->from('panel_table pt')
        ->where('pt.id', $gelen['formData']['relation_panel_table_id'])
        ->get()->row_array();
      $cokluTabloIsim = $panelTable['slug'].'_to_'.$panelTableRelation['slug'];
      if(!$this->db->table_exists($cokluTabloIsim)){
          
        $this->dbforge->add_key($panelTable['slug'].'_id', TRUE);
        $this->dbforge->add_key($panelTableRelation['slug'].'_id', TRUE);
        $fields = array(
          $panelTable['slug'].'_id' => array(
            'type' => 'INT',
            'constraint' => 11,
            'unsigned' => TRUE,
            'auto_increment' => FALSE,
            'default' => 0
          ),
          $panelTableRelation['slug'].'_id' => array(
            'type' => 'INT',
            'constraint' => 11,
            'unsigned' => TRUE,
            'auto_increment' => FALSE,
            'default' => 0
          )
        );

        $this->dbforge->add_field($fields);
        $attributes = array('ENGINE' => 'InnoDB');
        $this->dbforge->create_table($cokluTabloIsim, FALSE, $attributes);

      }

    }
    if($gelen['formData']['panel_table_column_input_id'] == 8){

      if($gelen['formType'] == 'add'){
        $tabloSonucArr = $this->addTableField($panelTable['slug'], $gonder['slug'].'_path', 'VARCHAR','2000', '["0"]' );
      }
      if($gelen['formType'] == 'update'){
        $tabloSonucArr = $this->modifyTableField($panelTable['slug'], $gonder['slug'].'_path', $panelTableColumn['slug'].'_path', 'VARCHAR', '2000', '["0"]');

        //public function addTableField($tableName='', $columnName = '', $columnDataType='VARCHAR', $type_length = '255', $type_default_value = ''){
        //public function modifyTableField($tableName='', $columnName = '', $oldColumnName = '', $columnDataType='VARCHAR', $type_length = '255', $type_default_value = ''){
          
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

    $this->db->select('crt.*');
    $this->db->from('panel_table_component_relation_type crt');
    $this->db->order_by('crt.id', 'asc');
    $data['componentRelationTypes'] = $this->db->get()->result_array();

    
  
    $data['panelTable'] = array();

    if(!empty($gets['id'])){
      $this->db->select('pt.*');
      $this->db->from('panel_table_column pt');
      $this->db->where('pt.id', $gets['id']);
      $data['formData'] = $this->db->get()->row_array();
      $this->db->select('pt.*');
      $this->db->from('panel_table pt');
      $this->db->where('pt.id', $data['formData']['panel_table_id']);
      $data['panelTable'] = $this->db->get()->row_array();
    }
    if(!empty($gets['panel_table_id'])){
      $this->db->select('pt.*');
      $this->db->from('panel_table pt');
      $this->db->where('pt.id', $gets['panel_table_id']);
      $data['panelTable'] = $this->db->get()->row_array();
      $data['formData']['panel_table_id'] = $data['panelTable']['id'];
    }
    if($data['panelTable']){
      $this->db->select('pt.*');
      $this->db->from('panel_table pt');
      $this->db->where('pt.hasTable', '1');   
      if($data['panelTable']['id']){
        $this->db->where('pt.id != ', $data['panelTable']['id']); 
      } 
      $this->db->order_by('pt.id', 'asc');
      $data['panelTableList'] = $this->db->get()->result_array();


      /*if($data['panelTable']['language_active'] == 1){
        $this->db->select('l.*');
        $this->db->from('language l');
        $this->db->order_by('l.id', 'asc');
        $data['language'] = $this->db->get()->result_array();
        //print_r($data['language']);
      }*/

    }

    

    echo json_encode($data);
  }
  public function findParentsTest(){
    //echo "fp test";
    $liste = $this->PanelModel->findParents('panel_table', 16);
    print_r($liste);

  }
  public function getSlugKolonListesi(){
    $gets = $this->input->get();
    //print_r($gets);
    if($gets['panelTableId']){
      $this->db->select('pt.id, pt.title, pt.slug');
      $this->db->from('panel_table_column pt');
      $this->db->where('pt.panel_table_id', $gets['panelTableId']);
      $data['slugKolonList'] = $this->db->get()->result_array();
      
    }
    echo json_encode($data);
  }

  public function altKategoriSlugList(){
    $gets = $this->input->get();
    //print_r($gets);
    if($gets['panelTableId']){
      //echo $gets['panelTableId'];
      $this->db->select('pt.id, pt.title, pt.slug');
      $this->db->from('panel_table_column pt');
      $this->db->where('pt.panel_table_id', $gets['panelTableId']);
      $data['parentPathList'] = $this->db->get()->result_array();
    }
    echo json_encode($data);
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

  public function getFormDataDynamic(){
    $gets = $this->input->get();
    //if(!$gets) return false;
    //if(!$gets['id']) return false;
    //print_r($gets);
    $data = array();
    if($gets['id']){
      $this->db->select('pt.*');
      $this->db->from($gets['tableName'].' pt');
      $this->db->where('pt.id', $gets['id']);
      $data['formData'] = $this->db->get()->row_array();
      if(!empty($data['formData']['parent_path'])){
        $data['formData']['parent_path'] = json_decode($data['formData']['parent_path'], true);
      }
      
    }
    echo json_encode($data);

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
  public function setRowStatus(){
    $gets = $this->input->get();
    //print_r($gets);
    $rowId = $gets['row']['id'];
    $tableName = $gets['tableName'];
    $colSlug = $gets['column']['slug'];

    //echo $gets['value'];
    $gonder[$colSlug] = ($gets['value']=="true"?1:0);
    $this->db->where('id', $rowId)->update($tableName, $gonder);  

  }
  public function deleteRowDynamic(){
    $gelen = $this->input->post();
    if(!$gelen) return false;
    //print_r($gelen);

    $panelTable = $this->db->select('*')
    ->from($gelen['tableName'].' pt')
    ->where('pt.id', $gelen['itemId'])
    ->get()->row_array();
    
    $data['sonuc'] = 'err';
    $data['aciklama'] = 'Kayıt bulunamadı';

    if($panelTable){
      
      $this->db->where('id', $gelen['itemId']);
      $this->db->delete($gelen['tableName']);

      $data['sonuc'] = 'ok';
      $data['aciklama'] = 'Kayıt Silinmiştir.';
    }

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

      $this->db->where('panel_table_id', $gelen['itemId']);
      $this->db->delete('panel_table_column');

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

      if($panelTableColumn['panel_table_column_input_id'] == 8){
        if ($this->db->field_exists($panelTableColumn['slug'].'_path', $panelTable['slug'])){
          $this->dbforge->drop_column($panelTable['slug'], $panelTableColumn['slug'].'_path');
        }
      }
      

      $this->db->where('id', $gelen['itemId']);
      $this->db->delete('panel_table_column');
      $data['sonuc'] = 'ok';
      $data['aciklama'] = 'Kayıt Silinmiştir.';
      
    }

    echo json_encode($data);
  }

  


}