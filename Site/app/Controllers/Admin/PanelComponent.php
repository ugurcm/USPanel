<?php namespace App\Controllers\Admin;
use App\Controllers\BaseController;
use App\Libraries\GenelLib;
use App\Libraries\PanelLib;

class PanelComponent extends BaseController {
	public function __construct(){
		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    
	}
	public function index(){}

  public function pageInit(){
    
    $gelen = $this->request->getPost(null, FILTER_SANITIZE_STRING);
    if(!$gelen) return false;

    $db = \Config\Database::connect();

    $panelId = $gelen['pageId'];
    $data['sonuc'] = 'ok';

    /*$data['panelTable'] = $this->db->select('*')
    ->from('panel_table pt')
    ->where('pt.id', $panelTableId)
    ->get()->row_array();*/
    $dbo = $db->table('panel pt');
    $dbo->select('pt.*');
    $dbo->where('pt.id', $panelId);
    $data['panel'] = $dbo->get()->getRowArray();


    echo json_encode($data);
  }

  public function getListData(){
		//$this->response->setContentType('Content-Type: application/json');
		$gets = $this->request->getGet(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();
    //print_r($gets);
    //return false;
		
    $data['crudColumns'] = array(
      array('title' => 'ID', 'slug' => 'id', 'show_in_crud'=> 1, 'db_select' => 1),
      array('title' => 'Başlık', 'slug' => 'title' , 'show_in_crud'=> 1, 'db_select' => 1),
      array('title' => 'Input Türü', 'slug' => 'title', 'show_in_crud'=> 1, 'joinTable' => 'component', 'as' => 'component_title', 'db_select' => 1),
      array('title' => 'Kolon Tipi', 'slug' => 'title', 'show_in_crud'=> 1, 'joinTable' => 'column_type', 'as' => 'column_type_title', 'db_select' => 1),
      array('title' => 'Düzenle','show_in_crud'=> 1, 'db_select' => 1)
    );

    $data['tableJoins'] = array(
      array(
        'tableName' => 'component',
        'sourceCol' => 'id',
        'targetCol' => 'component_id',
        'selectSlug' => 'component_title'
      ),
      array(
        'tableName' => 'column_type',
        'sourceCol' => 'id',
        'targetCol' => 'column_type_id',
        'selectSlug' => 'column_type_title'
      )
    );
    $data['where'] = array(array('name'=>'panel_id', 'value'=>$gets['pageId']));
    //print_r($data);
    //return false;
    
    
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
      $sayfaNo = (int)$gets['sayfaNo'];
    }
    if (empty($gets['kacar']) || !is_numeric($gets['kacar'])) {
      $kacar = 15;
    } else {
      $kacar = (int)$gets['kacar'];
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

    
  

    $dbSelectStr = '';
    if($data['crudColumns']){
      foreach ($data['crudColumns'] as $keyc => $valuec) {
        if(!empty($valuec['slug'])){
          $selectedTable = 't';
          if(isset($valuec['joinTable'])){
            $selectedTable = $valuec['joinTable'];
            $dbSelectStr .= $selectedTable.'.'.$valuec['slug'].' as '.$valuec['as'].'';
          }else{
            if($valuec['db_select'] == 1){
              $dbSelectStr .= $selectedTable.'.'.$valuec['slug'].'';
            }
					}
					$dbSelectStr .= ', ';
        }
      }
		}
    $dbSelectStr = rtrim($dbSelectStr, ', ');
    //echo $dbSelectStr;
    //return false;
    //print_r($gets);

    $joinStr = '';
    if($data['tableJoins']){
      foreach ($data['tableJoins'] as $keyj => $joinRow) {
        $joinStr .= " 
          LEFT JOIN ".$joinRow['tableName']." ".$joinRow['tableName']." 
          ON (".$joinRow['tableName'].".".$joinRow['sourceCol']." = t.".$joinRow['targetCol']." ) 
        ";

      }
    }

    $whereStr = '';
    if(isset($data['where']) && $data['where']){
      foreach ($data['where'] as $keyw => $itemWhere) {
        //$this->db->where('t.'.$itemWhere['name'], $itemWhere['value']);
        $whereCommand = "WHERE";
        if($keyw > 0){$whereCommand = "AND"; }
        $whereStr .= " ".$whereCommand." t.".$itemWhere['name']." = ".$itemWhere['value']." ";
      }
    }
    //echo $whereStr;
    //return false;
    
    $kayitSayisi = $db->query("
      SELECT COUNT(t.id) toplam from `".$gets['table']."` t
      ".$whereStr."
    ")->getRowArray();

   
    

    $sSayisi = ceil($kayitSayisi['toplam'] / $kacar);
    $nereden = ($sayfaNo * $kacar) - $kacar;


    
    
    $query = "
      SELECT ".$dbSelectStr." FROM `".$gets['table']."` t
      ".$joinStr."
      ".$whereStr."
      GROUP BY t.id
      ORDER BY ".$orderby." ".$orderType." 
      LIMIT ".$nereden.", ".$kacar."
    ";


    


    //echo $query;

    $data['crudList'] = $db->query($query)->getResultArray();


    //return false;
    
    /*if($data['crudList']){
      foreach ($data['crudList'] as $keyl => $item) {
        $data['crudList'][$keyl]['has_tableText'] = ($item['has_table'] == 0 ? 'Tablo Yok':'Tablo Var');
      }
    }*/


    $data['crudData']['sayfaSayisi'] = $sSayisi;
    $data['crudData']['sayfaNo']   = $sayfaNo;
    $data['crudData']['kacar']   = $kacar;
		$data['crudData']['nereden'] = $nereden;
		$data['crudData']['toplam'] = $kayitSayisi['toplam'];
    
    

		echo json_encode($data);
  }

  public function deleteRow(){
    $gets = $this->request->getPost(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();
    $forge = \Config\Database::forge();
    //print_r($gets);
    $itemId = $gets['itemId'];

    $data['sonuc'] = 'err';
    $data['aciklama'] = 'Kayıt bulunamadı';

    $column = $db->table('column c')->select('c.*')->where('c.id', $itemId)->get()->getRowArray();
  
    //$data['panelTableColumn'] = $panelTableColumn;
    if($column){

      $panel = $db->table('panel p')->select('p.*')->where('p.id', $column['panel_id'])->get()->getRowArray();
      //print_r($panel);

      $sql = "SHOW COLUMNS FROM `".$panel['slug']."` LIKE '".$column['slug']."'";
      $tabloVarmi = $db->query($sql)->getRowArray();

      if ($tabloVarmi){
        $forge->dropColumn($panel['slug'], $column['slug']);
      }

      $db->table('column')->where('id', $itemId)->delete();

      $data['sonuc'] = 'ok';
      $data['aciklama'] = 'Kayıt Silinmiştir.';
    }

    echo json_encode($data);
  }

  public function getFormData(){
    $gets = $this->request->getGet(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();
    
    
    $data['panel'] = array();
    
    if(!empty($gets['id'])){
      $dbo = $db->table('column c');
      $dbo->select('c.*');
      $dbo->where('c.id', $gets['id']);
      $data['formData'] = $dbo->get()->getRowArray();
      
      $dbo = $db->table('panel c');
      $dbo->select('c.*');
      $dbo->where('c.id', $data['formData']['panel_id']);
      $data['panel'] = $dbo->get()->getRowArray();
    }
    if(!empty($gets['panel_id'])){

      $dbo = $db->table('panel p');
      $dbo->select('p.*');
      $dbo->where('p.id', $gets['panel_id']);
      $data['panel'] = $dbo->get()->getRowArray();

      $data['formData']['panel_id'] = $data['panel']['id'];
    }
    
    $dbo = $db->table('component c');
    $dbo->select('c.*');
    $dbo->orderBy('c.id', 'asc');
    $data['componentList'] = $dbo->get()->getResultArray();

    $dbo = $db->table('column_type c');
    $dbo->select('c.*');
    $dbo->orderBy('c.id', 'asc');
    $data['columnTypeList'] = $dbo->get()->getResultArray();




    echo json_encode($data);
  }


  public function saveForm(){
    $gelen = $this->request->getPost(null, FILTER_SANITIZE_STRING);
    if(!$gelen) return false;
    $db = \Config\Database::connect();
    $panelLib = new PanelLib();

    //print_r($gelen);
    //return false;
      
    $data['sonuc'] = 'ok';
    $selectedMysqlColumnType = $db->table('column_type ct')
      ->select('ct.*')
      ->where('ct.id', $gelen['formData']['column_type_id'])
      ->get()->getRowArray();
    //print_r($selectedMysqlColumnType);

    

    if($gelen['formType'] == 'add'){
      $panelId = $gelen['formData']['panel_id'];
      $panel = $db->table('panel p')->select('*')->where('p.id', $panelId)->get()->getRowArray();

      $gonder = array();

      $gonder['slug'] = GenelLib::temizle($gelen['formData']['title'],array('delimiter'=> '_'));
      if($gelen['formData']['slug']){
        $gonder['slug'] = $gelen['formData']['slug'];
      }
      
      $tabloSonucArr = $panelLib->addTableField($panel['slug'], $gonder['slug'], $selectedMysqlColumnType['slug'], $gelen['formData']['type_length'], $gelen['formData']['type_default_value']);
      
      if($gelen['formData']['component_id'] == 19){ //eger component alt kategori ise _parent sütunu oluştur.

      }

      if($tabloSonucArr['sonuc'] == 'err'){
        $data['sonuc'] = 'err';
        $data['aciklama'] = $tabloSonucArr['aciklama'];
      }
      if($tabloSonucArr['sonuc'] == 'ok'){
        $data['aciklama'] = 'Tablo Sütunu Eklenmiştir. Yönlendiriliyorsunuz...';


        $gonder['panel_id'] = $panelId;
        $gonder['title'] = $gelen['formData']['title'];
        $gonder['component_id'] = $gelen['formData']['component_id']; 
        $gonder['column_type_id'] = $gelen['formData']['column_type_id']; 
        $gonder['type_length'] = $gelen['formData']['type_length']; 
        $gonder['type_default_value'] = $gelen['formData']['type_default_value']; 

        $gonder['show_in_crud'] = $gelen['formData']['show_in_crud'];
        $gonder['form_edit'] = $gelen['formData']['form_edit'];
        if(!empty($gelen['formData']['target_table'])){
          $gonder['target_table'] = $gelen['formData']['target_table'];
        }
        if(!empty($gelen['formData']['target_table_title'])){
          $gonder['target_table_title'] = $gelen['formData']['target_table_title'];
        }
        if(!empty($gelen['formData']['target_table_secilen_kolon'])){
          $gonder['target_table_secilen_kolon'] = $gelen['formData']['target_table_secilen_kolon'];
        }

        $db->table('column')->insert($gonder);



      }





    }

    if($gelen['formType'] == 'update'){

      //print_r($gelen);
      $panelId = $gelen['formData']['panel_id'];
      $panel = $db->table('panel p')->select('*')->where('p.id', $panelId)->get()->getRowArray();

      //print_r($panel);
      
      $gonder = array();


      
      

      $column = $db->table('column c')->select('c.*')        
        ->where('c.id', $gelen['formData']['id'])
        ->get()->getRowArray();

      //print_r($column);
      
      $gonder = array();
      $gonder['slug'] = GenelLib::temizle($gelen['formData']['title'],array('delimiter'=> '_'));

      if($gelen['formData']['slug']){
        $gonder['slug'] = $gelen['formData']['slug'];
      }

  
      $tabloSonucArr = $panelLib->modifyTableField($panel['slug'], $gonder['slug'], $column['slug'], $selectedMysqlColumnType['slug'], $gelen['formData']['type_length'], $gelen['formData']['type_default_value']);
      
      if($tabloSonucArr['sonuc'] == 'err'){
        $data['sonuc'] = 'err';
        $data['aciklama'] = $tabloSonucArr['aciklama'];
      }
      if($tabloSonucArr['sonuc'] == 'ok'){
        $data['aciklama'] = 'Tablo Sütunu Güncellenmiştir. Yönlendiriliyorsunuz...';
        

        $gonder['panel_id'] = $panelId;
        $gonder['title'] = $gelen['formData']['title'];
        $gonder['component_id'] = $gelen['formData']['component_id']; 
        $gonder['column_type_id'] = $gelen['formData']['column_type_id']; 
        $gonder['type_length'] = $gelen['formData']['type_length']; 
        $gonder['type_default_value'] = $gelen['formData']['type_default_value']; 
        $gonder['show_in_crud'] = $gelen['formData']['show_in_crud'];
        $gonder['form_edit'] = $gelen['formData']['form_edit'];
        if(!empty($gelen['formData']['target_table'])){
          $gonder['target_table'] = $gelen['formData']['target_table'];
        }
        if(!empty($gelen['formData']['target_table_title'])){
          $gonder['target_table_title'] = $gelen['formData']['target_table_title'];
        }
        if(!empty($gelen['formData']['target_table_secilen_kolon'])){
          $gonder['target_table_secilen_kolon'] = $gelen['formData']['target_table_secilen_kolon'];
        }
        
        $db->table('column')->where('id', $gelen['formData']['id'])->update($gonder);
        

        /*$gonder['title'] = $gelen['formData']['title'];
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
        $this->db->update('panel_table_column', $gonder);*/
      }
      

    }

    // Eğer çoklu seçimse to tablosunu oluşturalım
    if($gelen['formData']['component_id'] == 5){
      $birlesimTablosu = $panel['slug'].'_to_'.$gelen['formData']['target_table'];
      $kolon1isim = $panel['slug'].'_id';
      $kolon2isim = $gelen['formData']['target_table'].'_id';
      $panelLib->createTableNToN($birlesimTablosu, $kolon1isim, $kolon2isim);
    }
    if($gelen['formData']['component_id'] == 6){
      $birlesimTablosu = $panel['slug'].'_to_'.$gelen['formData']['target_table'];
      $kolon1isim = $panel['slug'].'_id';
      $kolon2isim = $gelen['formData']['target_table'].'_id';
      $panelLib->createTableNToN($birlesimTablosu, $kolon1isim, $kolon2isim);
    }
    


    echo json_encode($data);
  }


}
