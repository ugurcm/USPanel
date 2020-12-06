<?php namespace App\Controllers\Admin;
use App\Controllers\BaseController;
use App\Libraries\GenelLib;
use App\Libraries\PanelLib;
use mysqli;

class Panel extends BaseController {
	public function __construct(){
		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    
	}
	public function index(){}
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
      array('title' => 'Tablo Adı', 'slug' => 'slug', 'show_in_crud'=> 1, 'db_select' => 1),
      array('title' => 'Tablo Varmı', 'slug' => 'has_table', 'show_in_crud'=> 0, 'db_select' => 1),
      array('title' => 'Tablo Varmı', 'slug' => 'has_tableText', 'show_in_crud'=> 1, 'db_select' => 0),
      array('title' => 'Düzenle','show_in_crud'=> 1, 'db_select' => 0)
    );

    
    
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

    $whereStr = '';
    if(empty($gets['pageId'])){
      $whereStr .= "WHERE t.parent = '0' ";
    }
    if(!empty($gets['pageId'])){
      $whereStr .= "WHERE t.parent = '".$gets['pageId']."' ";
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
    
    $kayitSayisi = $db->query("
      SELECT COUNT(t.id) toplam from ".$gets['table']." t
      ".$whereStr."
    ")->getRowArray();

    $sSayisi = ceil($kayitSayisi['toplam'] / $kacar);
    $nereden = ($sayfaNo * $kacar) - $kacar;

    $query = "
      SELECT ".$dbSelectStr." FROM ".$gets['table']." t
      ".$whereStr."
      GROUP BY t.id
      ORDER BY ".$orderby." ".$orderType." 
      LIMIT ".$nereden.", ".$kacar."
    ";
    //echo $query;
    $data['crudList'] = $db->query($query)->getResultArray();
    
    if($data['crudList']){
      foreach ($data['crudList'] as $keyl => $item) {
        $data['crudList'][$keyl]['has_tableText'] = ($item['has_table'] == 0 ? 'Tablo Yok':'Tablo Var');
      }
    }


    $data['crudData']['sayfaSayisi'] = $sSayisi;
    $data['crudData']['sayfaNo']   = $sayfaNo;
    $data['crudData']['kacar']   = $kacar;
		$data['crudData']['nereden'] = $nereden;
		$data['crudData']['toplam'] = $kayitSayisi['toplam'];
    
    

		echo json_encode($data);
  }
  
  public function getParentList(){  // formda parent secmek icin

    $gets = $this->request->getGet(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();

    //print_r($gets);
    //return false;
    //echo $gets['parentPath'];
    $data = array();
    //$data['parentPathList'] = array();
    if(!empty($gets['parentPath']) && $gets['parentPath'] != '[]' && $gets['parentPath']){
      //print_r($gets['parentPath']);
      //$gets['parentPath'] = json_decode($gets['parentPath'], true);
      if($gets['parentPath']){
        foreach ($gets['parentPath'] as $key => $value) {
          /*$this->db->select('pt.id, pt.title');
          $this->db->from('panel pt');
          $this->db->where('pt.parent', $value);
          $data['parentPathList'][] = $this->db->get()->result_array();*/

          $dbo = $db->table('panel pt');
          $dbo->select('pt.id, pt.title');
          $dbo->where('pt.parent',$value);
          $data['parentPathList'][] = $dbo->get()->getResultArray();

        }
      }
    }


    echo json_encode($data);
  }

  public function getFormData(){
    
    $gets = $this->request->getGet(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();

    $data = array();
    if($gets['id']){
      
      $dbo = $db->table('panel pt');
      $dbo->select('pt.*');
      $dbo->where('pt.id',$gets['id']);
      $data['formData'] = $dbo->get()->getRowArray();
      
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
    $this->db->from('panel pt');
    $this->db->where('pt.parent', 0);
    $data['parentPathList'] = $this->db->get()->result_array();*/


    echo json_encode($data);

  }
  public function getParentPath(){
    $gets = $this->request->getGet(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    //$db = \Config\Database::connect();
    $panelLib = new PanelLib();
    
    $data = array();
    $data['formData'] = array();

    $liste = $panelLib->findParents('panel', $gets['parent']);

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


  

  public function findPageParent(){   // yukari cikmak icin
    $gets = $this->request->getGet(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();
    /*$this->db->select('t.*');
    $this->db->from($gets['table'].' t');
    $this->db->where('t.id', $gets['pageId']);
    $data['secilenPage'] = $this->db->get()->row_array();
    echo json_encode($data);*/
    $dbo = $db->table($gets['table'].' t');
    $dbo->where('t.id', $gets['pageId']);
    $data['secilenPage'] = $dbo->get()->getRowArray();
    echo json_encode($data);
  }

  public function saveFormTest(){
    $db = \Config\Database::connect();
    $bld = $db->table('panel pt');
    $liste = $bld->select('pt.*')->get()->getResultArray();
    print_r($liste);
  }
  public function saveForm(){
    //$gelen = $this->input->post();
    //if(!$gelen) return false;
    $PanelLib = new PanelLib();
    $db = \Config\Database::connect();

    $gelen = $this->request->getPost(null, FILTER_SANITIZE_STRING);
    if(!$gelen) return false;

    //print_r($gelen);

    //$panelLib->ptest1();

    //return false;
    //echo $gelen['formData']['title'];
    $data['sonuc'] = 'ok';

    if($gelen['formType'] == 'add'){

      $gonder['slug'] = GenelLib::temizle($gelen['formData']['title'],array('delimiter'=> '_'));

      //print_r(PanelLib::createTable());
      //print_r($gonder);
      
      $tabloSonucArr['sonuc'] = 'ok';
      if($gelen['formData']['has_table']){
        
        //$tabloSonucArr = $this->createTable($gonder['slug']);
        $tabloSonucArr = PanelLib::createTable($gonder['slug']);
      }
      //print_r($tabloSonucArr);

      if($tabloSonucArr['sonuc'] == 'err'){
        $data['sonuc'] = 'err';
        $data['aciklama'] = $tabloSonucArr['aciklama'];
      }
      if($tabloSonucArr['sonuc'] == 'ok'){
        $data['aciklama'] = 'Tablo Eklenmiştir. Yönlendiriliyorsunuz...';
        
        $gonder['title'] = $gelen['formData']['title'];
        $gonder['parent'] = $gelen['formData']['parent'];
        $gonder['has_table'] = $gelen['formData']['has_table'];

        $gonder['language_active'] = $gelen['formData']['language_active'];
        if($gelen['formData']['parent_path']){
          $gonder['parent_path'] = json_encode($gelen['formData']['parent_path']);
        }

        $gonder['component_name'] = $gelen['formData']['component_name'];
        $gonder['icon'] = $gelen['formData']['icon'];
        $gonder['list_type'] = $gelen['formData']['list_type']; //1 başlık, 2 açılır
        $gonder['show_sidebar'] = $gelen['formData']['show_sidebar']; //0 Gözükme, 1 Gözük
        $gonder['order_column'] = $gelen['formData']['order_column']; // siralama kolonu
        $gonder['order_type'] = $gelen['formData']['order_type']; // siralama turu
        $gonder['order_drag'] = $gelen['formData']['order_drag']; // siralama sürükleme aktifmi
        $gonder['drag_column'] = $gelen['formData']['drag_column']; // siralama sürükleme aktifmi
        
        //print_r($gonder);
        $db->table('panel')->insert($gonder);
        //echo $db->affectedRows();
        //$this->db->insert('panel', $gonder);

        //tablo eklendi, id kolonunu ekleyelim.
        $panel_id = $db->insertId();

        $selectedPanelTable = $db->table('panel pt')
          ->select('pt.*')
          ->where('pt.id', $panel_id)
          ->get()->getRowArray();

        $gonderCol['panel_id'] = $selectedPanelTable['id'];
        $gonderCol['title'] = 'ID';
        $gonderCol['slug'] = 'id';
        $gonderCol['language_active'] = 0;
        $gonderCol['component_id'] = 1;
        $gonderCol['column_type_id'] = 2;
        $gonderCol['type_length'] = 11;
        $gonderCol['type_default_value'] = 0;
        $gonderCol['form_data_type'] = 'Int';
        
        $gonderCol['required'] = 0;
        $gonderCol['count'] = 0;
        $gonderCol['show_in_crud'] = 1;
        $gonderCol['form_edit'] = 0;
        //$this->db->insert('column', $gonderCol);
        $db->table('column')->insert($gonderCol);

      }

    }

    if($gelen['formType'] == 'update'){
      $data['aciklama'] = 'Kayıt Güncellenmiştir. Yönlendiriliyorsunuz...';
      $gonder['title'] = $gelen['formData']['title'];
      $gonder['parent'] = $gelen['formData']['parent'];
      $gonder['has_table'] = $gelen['formData']['has_table'];
      $gonder['language_active'] = $gelen['formData']['language_active'];
      //print_r($gonder);
      if($gelen['formData']['parent_path']){
        $gonder['parent_path'] = json_encode($gelen['formData']['parent_path']);
      }

      $gonder['component_name'] = $gelen['formData']['component_name'];
      $gonder['icon'] = $gelen['formData']['icon'];
      $gonder['list_type'] = $gelen['formData']['list_type'];
      $gonder['show_sidebar'] = $gelen['formData']['show_sidebar']; //0 Gözükme, 1 Gözük
      $gonder['order_column'] = $gelen['formData']['order_column']; // siralama kolonu
      $gonder['order_type'] = $gelen['formData']['order_type']; // siralama turu
      $gonder['order_drag'] = $gelen['formData']['order_drag']; // siralama sürükleme aktifmi
      $gonder['drag_column'] = $gelen['formData']['drag_column']; // siralama sürükleme aktifmi

      $db->table('panel p')->where('id',$gelen['formId'])->update($gonder);
      /*$this->db->where('id', $gelen['formId']);
      $this->db->update('panel', $gonder);*/
      $panel_id = $gelen['formId'];
      
    }

    /*
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

      $gonder['componentName'] = $gelen['formData']['componentName'];
      $gonder['icon'] = $gelen['formData']['icon'];
      $gonder['list_type'] = $gelen['formData']['list_type'];

      $this->db->where('id', $gelen['formId']);
      $this->db->update('panel', $gonder);
      $panel_id = $gelen['formId'];
    }

    if($gelen['formData']['language_active'] == 1){
      //$panel_id
      $selectedPanelTable = $this->db->select('pt.*')
        ->from('panel pt')
        ->where('pt.id', $panel_id)
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

        $gonderCol['panel_id'] = $selectedPanelTable['id'];
        $gonderCol['title'] = $eklenecekIsim;
        $gonderCol['slug'] = $eklenecekIsim;
        $gonderCol['column_input_id'] = 1;
        $gonderCol['column_type_id'] = 2;
        $gonderCol['type_length'] = 11;
        $gonderCol['type_default_value'] = 1;     //1 türkçe
        $gonderCol['edit_form'] = 0;
        $gonderCol['show_in_crud'] = 0;
        $gonderCol['relation_type_id'] = 0;
        $gonderCol['form_type'] = 'Int';
        $this->db->insert('column', $gonderCol);
      }

      $eklenecekIsim = 'content_id';
      if(!$this->db->field_exists($eklenecekIsim, $tabloAdi)){
        $fields = array(
          $eklenecekIsim =>
            array('type' => 'INT', 'constraint' => 11, 'default' => '0', 'unsigned' => TRUE)
        );
        $this->dbforge->add_column($tabloAdi, $fields);

        $gonderCol['panel_id'] = $selectedPanelTable['id'];
        $gonderCol['title'] = $eklenecekIsim;
        $gonderCol['slug'] = $eklenecekIsim;
        $gonderCol['column_input_id'] = 1;
        $gonderCol['column_type_id'] = 2;
        $gonderCol['type_length'] = 11;
        $gonderCol['type_default_value'] = 0;     //1 türkçe
        $gonderCol['edit_form'] = 0;
        $gonderCol['show_in_crud'] = 0;
        $gonderCol['relation_type_id'] = 0;
        $gonderCol['form_type'] = 'Int';
        $this->db->insert('column', $gonderCol);
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


    }*/

    echo json_encode($data);
  }



}
