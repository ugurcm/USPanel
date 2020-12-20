<?php namespace App\Controllers\Admin;
use App\Controllers\BaseController;
use App\Libraries\GenelLib;
use App\Libraries\PanelLib;
class CrudList extends BaseController
{
  
	public function __construct(){
		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
	}

	public function index(){}

	public function pageInit(){
    $gets = $this->request->getGet(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();
    
    //print_r($gets);
    $data['gets'] = $gets;
    $dbo = $db->table('panel p');
    $dbo->select('p.id, p.title, p.slug,p.order_column,p.order_type');
    $dbo->where('p.slug', $gets['table']);
    $data['panel'] = $dbo->get()->getRowArray();
    
    $title = 'Panel Bileşenleri (' . $data['panel']['title'] . ')';

    if(!empty($gets['id'])){

      $altKategoriColumn = $db->table('column c')
      ->select('c.id,c.title, c.target_table_title, c.slug')
      ->where('c.panel_id', $data['panel']['id'])
      ->where('c.component_id', 2)->get()->getRowArray();
      $data['altKategoriColumn'] = $altKategoriColumn;

      $data['secilenAltKategori'] = $db->table($data['panel']['slug'].' t')
      ->select('t.id, t.'.$altKategoriColumn['target_table_title'])
      ->where('t.id', $gets['id'])
      ->get()->getRowArray();
      
      if($data['secilenAltKategori']){
        //$title = 'Panel Bileşenleri (' . $data['panel']['title'] . ' - '.$data['secilenAltKategori'][$altKategoriColumn['target_table_title']].')';        
        $panelLib = new \App\Libraries\PanelLib();
        $parentList = $panelLib->findParents($data['panel']['slug'], $gets['id'], 0, $altKategoriColumn['slug']);
        $breadCrumbs = '';
        if($parentList){
          foreach ($parentList as $key => $value) {
            $breadCrumbs .= $value[$altKategoriColumn['target_table_title']].(count($parentList)>$key+1?' - ':'');
          }
        }              

        $title = 'Panel Bileşenleri (' . $data['panel']['title'] . ' - '.$breadCrumbs.')';        
      }
      
      //print_r($data['column']);
      
    }
    $data['baslik'] = $title;

    echo json_encode($data);
  }
	public function getListData(){
		//$this->response->setContentType('Content-Type: application/json');
		$gets = $this->request->getGet(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();
    //print_r($gets);
    
    $dbo = $db->table('panel p');
    $dbo->select('p.id, p.title, p.slug,p.order_drag, p.drag_column');
    $dbo->where('p.id', $gets['panelId']);
    $panel = $dbo->get()->getRowArray();

    //print_r($panel);

    
    $dbo = $db->table('column c');
    $dbo->select('c.title, c.slug,c.show_in_crud, c.component_id, 
      c.target_table, c.target_table_title, c.target_table_secilen_kolon');
    $dbo->where('c.panel_id', $panel['id']);
    $dbo->where('c.show_in_crud', 1);
    $column = $dbo->get()->getResultArray();

    //print_r($column);
    if($panel['order_drag'] == 1 & $panel['drag_column'] != ''){
      $data['crudColumns'] [] = array(    // sürükle bırak butonu
        'title' => '',
        'show_in_crud' => 1,
        'db_select' => 0,
        'buttons' => array(
          array(
            'name' => 'Taşı',
            'type' => 'DragRow',            
          )
        )
      );
    }
    if($column){
      foreach ($column as $keyi => $item) {
        $item['db_select'] = 1;
        if($item['component_id'] == 2){   // eger alt kategori ise buton ekle.
          $buttonAltKategori = array(
            'name' => 'Alt Kategorileri',
            'type' => 'AltKategori',
            'link' => '/crudList/'.$panel['slug'].'',
            'icon' => ''
          );
          $item['buttons'] = array($buttonAltKategori);
        }
        if($item['component_id'] == 7){ // eger ozellik liste tablosunu acacak ise buton ekle
          $buttonAltKategori = array(
            'name' => $item['title'],
            'type' => 'AltKategoriOtherTable',
            'link' => '/crudList/'.$item['target_table'].'',
            'icon' => ''
          );
          $item['buttons'] = array($buttonAltKategori);
        } 
        $data['crudColumns'] [] = $item;
      }
    }
    //print_r($data['crudColumns']);
    $button1 = array(
      'name' => 'Düzenle',
      'type' => 'LinkWidthId',
      'link' => '/crudForm/'.$panel['slug'],
      'icon' => 'far fa-edit'
    );
    $button2 = array(
      'name' => 'Sil',
      'type' => 'ClickEvent',
      'icon' => 'fa fa-times',
      'eventFunction' => 'deleteRow'
    );

    $item = array(
      'title' => 'İşlem',
      'show_in_crud'=> 1,
      'db_select' => 0, 
      'buttons'=> array($button1,$button2)
    );

    

    $data['crudColumns'] [] = $item;

    

    //print_r($data['crudColumns']);

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
      $orderby = 't.'.$gets['orderby'];
    }
    if (empty($gets['orderType'])) {
      $orderType = 'asc';
    } else {
      $orderType = $gets['orderType'];
    }

    $whereStr = '';
    /*if(empty($gets['pageId'])){
      $whereStr .= "WHERE t.parent = '0' ";
    }
    if(!empty($gets['pageId'])){
      $whereStr .= "WHERE t.parent = '".$gets['pageId']."' ";
    }*/
    //print_r($data['crudColumns']);
    $joinStr = '';

    $altKategoriColumn = array();
    if($data['crudColumns']){
      foreach ($data['crudColumns'] as $key => $value) {
        if(!empty($value['component_id'])){
          if($value['component_id'] == 2){
            //print_r($value);
            $altKategoriColumn = $value;
          }
          if($value['component_id'] == 3){
            //print_r($value);
            $joinStr .= ' LEFT JOIN '.$value['target_table'].' ON ('.$value['target_table'].'.id = t.'.$value['slug'].') ';
          }
          if($value['component_id'] == 4){
            //print_r($value);
            $joinStr .= ' LEFT JOIN '.$value['target_table'].' ON ('.$value['target_table'].'.id = t.'.$value['slug'].') ';
          }
        }
      }
    }

    //LEFT JOIN ogrenciler
    //print_r($data['crudColumns']);
    //print_r($altKategoriColumn);
    if($altKategoriColumn){
      /*if(empty($gets[$altKategoriColumn['slug']])){
        $whereStr .= ' WHERE t.'.$altKategoriColumn['slug']." = '0' ";
      }*/
      /*if(!empty($gets[$altKategoriColumn['slug']])){
        $whereStr .= ' WHERE t.'.$altKategoriColumn['slug']." = '".$gets[$altKategoriColumn['slug']]."' ";
      }*/
      if(empty($gets['id'])){
        $whereStr .= ' WHERE t.'.$altKategoriColumn['slug']." = '0' ";
      }
      if(!empty($gets['id'])){        
        $whereStr .= ' WHERE t.'.$altKategoriColumn['slug']." = '".$gets['id']."' ";
      }
    }
    //print_r($gets);
    // query string ile bir kategori göstermek istiyorsak
    if(!empty($gets['queryStringList']['parentName'])){
      $whereStr .= "WHERE t.".$gets['queryStringList']['parentName']." = '".$gets['queryStringList']['parentValue']."'";
    }
    //echo $whereStr;
    $dbSelectStr = '';
    if($data['crudColumns']){
      foreach ($data['crudColumns'] as $keyc => $valuec) {
        if(!empty($valuec['slug'])){
          $selectedTable = 't';
          
          if($valuec['component_id'] == 1 || $valuec['component_id'] == 2 || $valuec['component_id'] == 3
          || $valuec['component_id'] == 4 || $valuec['component_id'] == 7){


            //selectbox tek seçim ve selectbox alt kategorili ise
            if($valuec['component_id'] == 3 || $valuec['component_id'] == 4){
              $dbSelectStr .= $valuec['target_table'].'.'.$valuec['target_table_title']. ' as '.$valuec['slug'].' ';
            }
            // düz input veya alt kategori modülü ise
            if($valuec['component_id'] == 1 || $valuec['component_id'] == 2 || $valuec['component_id'] == 7){
              if($valuec['db_select'] == 1){
                $dbSelectStr .= $selectedTable.'.'.$valuec['slug'].'';
              }
            }
            /*if($valuec['target_table']){
              
              $dbSelectStr .= $valuec['target_table'].'.'.$valuec['target_table_title']. ' as '.$valuec['slug'].' ';
            }else{
              if($valuec['db_select'] == 1){
                $dbSelectStr .= $selectedTable.'.'.$valuec['slug'].'';
              }
            }*/
          }
          
         
          /*if($valuec['target_table']){
            $dbSelectStr .= ','.$valuec['target_table'].'.'.$valuec['target_table_title'];
          }*/
					$dbSelectStr .= ', ';
        }
      }
		}
    $dbSelectStr = rtrim($dbSelectStr, ', ');
    
    //echo $dbSelectStr;
    
    

    $kayitSayisi = $db->query("
      SELECT COUNT(t.id) toplam from ".$gets['table']." t
      ".$joinStr." 
      ".$whereStr."   
    ")->getRowArray();
    

    $sSayisi = ceil($kayitSayisi['toplam'] / $kacar);
    $nereden = ($sayfaNo * $kacar) - $kacar;

    $query = "
      SELECT ".$dbSelectStr." FROM ".$gets['table']." t
      ".$joinStr." 
      ".$whereStr."
      GROUP BY t.id
      ORDER BY ".$orderby." ".$orderType." 
      LIMIT ".$nereden.", ".$kacar."
    ";
    //echo $query;
    //return false;
    $data['crudList'] = $db->query($query)->getResultArray();
    

    //echo $dbSelectStr;
    //return false;

  
    //print_r($data);
    //return false;
    
    /*if($data['crudList']){
      foreach ($data['crudList'] as $keyl => $item) {
        $data['crudList'][$keyl]['has_tableText'] = ($item['has_table'] == 0 ? 'Tablo Yok':'Tablo Var');
      }
    }*/

    /*if($altKategoriColumn){
      if($data['crudList']){
        foreach ($data['crudList'] as $keyl => $item) {
          $data['crudList'][$keyl][$altKategoriColumn['slug']] = $altKategoriColumn['title'];
        }
      }
    }*/

    
    


    $data['crudData']['sayfaSayisi'] = $sSayisi;
    $data['crudData']['sayfaNo']   = $sayfaNo;
    $data['crudData']['kacar']   = $kacar;
		$data['crudData']['nereden'] = $nereden;
		$data['crudData']['toplam'] = $kayitSayisi['toplam'];
		$data['crudData']['order_drag'] = $panel['order_drag'];
    
    

		echo json_encode($data);
  }

  public function deleteRow(){
    $gets = $this->request->getPost(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();
    //print_r($gets);

    $tableRow = $db->table($gets['table'].' t')->select('t.*')
    ->where('t.id', $gets['itemId'])
    ->get()->getRowArray();
    //print_r($tableRow);

    $data['sonuc'] = 'err';
    $data['aciklama'] = 'Kayıt bulunamadı';

    $panel = $db->table('panel p')->select('p.*')->where('p.slug',$gets['table'])->get()->getRowArray();
    $columns = $db->table('column p')->select('p.*')->where('p.panel_id',$panel['id'])->get()->getResultArray();
    //print_r($columns);
    if($columns){
      foreach ($columns as $keyc => $column) {
        if($column['component_id'] == 5 || $column['component_id'] == 6){
          $tabloAdi = $gets['table'].'_to_'.$column['target_table'];
          $kolon1Adi = $gets['table'].'_id';
          //$kolon2Adi = $column['target_table'].'_id';

          $db->table($tabloAdi.' t')->where('t.'.$kolon1Adi, $gets['itemId'])->delete();

        }
      }
    }
    //print_r($tableRow);
    if($tableRow){


      $db->table($gets['table'].' t')->where('t.id', $gets['itemId'])->delete();
      $data['sonuc'] = 'ok';
      $data['aciklama'] = 'Kayıt Silinmiştir.';
    }

    echo json_encode($data);
  }

  public function yukariGit(){
    $gets = $this->request->getGet(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();
    
    $dbo = $db->table('panel p');
    $dbo->select('p.id, p.title, p.slug');
    $dbo->where('p.slug', $gets['table']);
    $panel = $dbo->get()->getRowArray();

    $altKategoriColumn = $db->table('column c')
    ->select('c.id,c.title, c.target_table_title, c.slug')
    ->where('c.panel_id', $panel['id'])
    ->where('c.component_id', 2)->get()->getRowArray();
    
    $secilenRow = $db->table($gets['table'].' t')
    ->select('t.*')
    ->where('t.id', $gets['id'])->get()->getRowArray();

    //print_r($secilenRow);
    $data['gidilecekId'] = $secilenRow[$altKategoriColumn['slug']];

    echo json_encode($data);
  }

  public function saveOrder(){
    $gets = $this->request->getPost(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();
    //print_r($gets);
    //print_r($gets['ids']);

    if($gets['ids']){
      
      foreach ($gets['ids'] as $key => $id) {
        //echo $id.' ';
        $i = $key + 1;
        $sql = "UPDATE ".$gets['table']." t SET ".$gets['orderColumn']." = '".$i."' WHERE id='".$id."' ";
        $db->query($sql);
        //echo $sql;
        //echo '<br/>';
      }
    }
  }


  public function ozellikYukariGit(){
    $gets = $this->request->getGet(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();

    //print_r($gets);
    if($gets['params']){
      $params = $gets['params'];
      $kontrol = $db->table($params['parentTable'].' e')->select('e.*')->where('e.id',$params['parentValue'])->get()->getRowArray();
      //print_r($kontrol);
      $panel = $db->table('panel p')->select('p.*')->where('p.slug',$params['parentTable'])->get()->getRowArray();
      //print_r($panel);
      $ustKategoriKolonu = $db->table('column p')->select('p.*')->where('p.panel_id',$panel['id'])->where('p.component_id',2)->get()->getRowArray();
      //print_r($columns);
      if($ustKategoriKolonu){
        $data['ustKategoriId'] = $kontrol[$ustKategoriKolonu['slug']];
      }
      $data['method'] = $params['parentTable'];

      echo json_encode($data);
    }

  }


	//--------------------------------------------------------------------

}
