<?php namespace App\Controllers\Admin;
use App\Controllers\BaseController;
use App\Libraries\GenelLib;
use App\Libraries\PanelLib;
class CrudForm extends BaseController
{

	public function __construct(){
		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
	}

	public function index(){}

  public function getFormData(){
    //sleep(4);
    $gets = $this->request->getGet(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();
    
    $dbo = $db->table('panel p');
    $dbo->select('p.*');
    $dbo->where('p.slug', $gets['table']);
    $data['panel'] = $dbo->get()->getRowArray();
    //print_r($panel);
    $dbo = $db->table('column c');
    $dbo->select('c.*');
    $dbo->where('c.panel_id', $data['panel']['id']);
    $dbo->where('c.form_edit', 1);
    $data['columns'] = $dbo->get()->getResultArray();
    //print_r($data['columns']);
    $data['formData'] = array();
    
    if($data['columns']){
      foreach ($data['columns'] as $key => $value) {
        $item[$value['slug']] = '';
      }
      $data['formData'] = $item;
    }

    if(!empty($gets['id'])){

      $dbSelectStr = '';
      if($data['columns']){
        foreach ($data['columns'] as $keyc => $valuec) {
          $selectedTable = 't';
          if(!empty($valuec['slug'])){
            $dbSelectStr .= $selectedTable.'.'.$valuec['slug'].'';       
            $dbSelectStr .= ', ';
          }
        }
      }
      $dbSelectStr = rtrim($dbSelectStr, ', ');
      //echo $dbSelectStr;

      $dbo = $db->table($data['panel']['slug'].' t');
      $dbo->select($dbSelectStr, false);
      $dbo->where('t.id',$gets['id']);
      $data['formData'] = $dbo->get()->getRowArray();
      //print_r($data['formData']);

      $dbo = $db->table('column c');
      $dbo->select('c.*');
      $dbo->where('c.panel_id', $data['panel']['id']);
      $dbo->where('c.form_edit', 1);
      $dbo->where('c.component_id', 2);
      $data['altKategoriColumn'] = $dbo->get()->getRowArray();

    }




    

   

    echo json_encode($data);
  }
  public function getTekliSelectList(){
    $gets = $this->request->getGet(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();

    //print_r($gets);
    $dbo = $db->table($gets['table'].' t');
    $dbo->select('t.id, t.'.$gets['target_table_title']);
    $data['tableList'] = $dbo->get()->getResultArray();
    //print_r($data['tableList']);
    echo json_encode($data);
  }

  public function saveForm(){
    $gets = $this->request->getPost(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();

    if(empty($gets['formData'])){
      echo "formData yok";
      return false;
    }
    $dbo = $db->table('panel p');
    $dbo->select('p.*');
    $dbo->where('p.id', $gets['panelId']);
    $panel = $dbo->get()->getRowArray();

    //print_r($panel);
    
    $data['sonuc'] = 'ok';
    $data['aciklama'] = 'Kayıt Eklenmiştir. Yönlendiriliyorsunuz...';
    $gonder = $gets['formData'];
    if($gets['formType'] == 'add'){
      $db->table($panel['slug'])->insert($gonder);
    }
    if($gets['formType'] == 'update'){
      $db->table($panel['slug'])->where('id', $gets['id'])->update($gonder);
    }

    echo json_encode($data);
  }

  public function testUstKategoriBulma(){
    //($tableName = '', $parentId = 0, $count = 0, $parentColumnName = 'parent', $reset = true)
    $db = \Config\Database::connect();
    $panelLib = new PanelLib();
    $breadCrumbList = $panelLib->findParents('siniflar', 3, 0, 'alt_siniflar');
    //print_r($breadCrumbList);
    $parentLists = array();
    if($breadCrumbList){
      foreach ($breadCrumbList as $key => $value) {
        $parentLists[$key]['selected'] = 0;
        $parentLists[$key]['liste'] = $db->table('siniflar s')
          ->select('s.id, s.baslik, s.alt_siniflar')
          ->where('s.alt_siniflar',$value['alt_siniflar'])->get()->getResultArray();
        
      }
    }
    print_r($parentLists);
  }
  public function getKategoriBread(){
    $gets = $this->request->getGet(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();
    
    //print_r($gets);
    $data['gets'] = $gets;
    $panelLib = new PanelLib();
    $breadCrumbList = $panelLib->findParents($gets['table'], $gets['id'], 0, $gets['name']);
    //print_r($breadCrumbList);
    $parentList = array();
    if($breadCrumbList){
      foreach ($breadCrumbList as $key => $value) {
        $selected = $value['id'];
        if($gets['idCikar'] == 'evet'){
          if($gets['id'] == $value['id']){
            $selected = 0;
          }
        }
        $parentList[$key]['selected'] = $selected;   
        

        $parentList[$key]['liste'] = $db->table('siniflar s')
          ->select('s.id, s.'.$gets['target_table_title'].', s.'.$gets['name'].'')
          ->where('s.'.$gets['name'],$value[$gets['name']])->get()->getResultArray();        
      }
    }
    
    if($gets['idCikar'] == 'hayir'){  //eger crudlistten geldiyse alt kategoriyide almamız lazım.
      $item['selected'] = 0;
      $item['liste'] = $db->table('siniflar s')
          ->select('s.id, s.'.$gets['target_table_title'].', s.'.$gets['name'].'')
          ->where('s.'.$gets['name'],$gets['id'])->get()->getResultArray();   
      //print_r($parentList);
      /*if($parentList){
        $sonItem = end($parentList);
        //print_r($sonItem);
        if($sonItem[])
      }*/
      $parentList[] = $item;
    }

    


    $data['parentList'] = $parentList;
    
    echo json_encode($data);
  }



  public function getAltKategori(){
    $gets = $this->request->getGet(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();

    //print_r($gets);return;
    
    //$data['selected'] = $gets['id'];
    $data['liste'] = array();
    
    
    $data['liste'] = $db->table($gets['table'].' t')
      ->select('t.id, t.'.$gets['target_table_title'])
      ->where( 't.'.$gets['name'], $gets['id'] )->get()->getResultArray();
    

    //print_r($liste);

    echo json_encode($data);

  }
	//--------------------------------------------------------------------

}
