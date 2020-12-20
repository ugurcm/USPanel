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
    

    //print_r($gets);


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



    if(!empty($gets['params']['parentName'])){
      $data['formData'][$gets['params']['parentName']] = $gets['params']['parentValue'];
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

  public function getCokluSelectList(){
    $gets = $this->request->getGet(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();
    //print_r($gets);
    $tabloAdi = $gets['table'].'_to_'.$gets['target_table'];
    //echo $tabloAdi;
    $kolon1Adi = $gets['table'].'_id';
    $kolon2Adi = $gets['target_table'].'_id';
    //echo $kolon1Adi.' '.$kolon2Adi;
    $dbo = $db->table($gets['target_table'].' t');
    $dbo->select('t.id, t.'.$gets['target_table_title']);
    $data['tableList'] = $dbo->get()->getResultArray();
    $data['itemList'] = array();
    if(!empty($gets['id'])){
      $query = "
        SELECT b.id, b.".$gets['target_table_title']." as text FROM ".$tabloAdi." t 
        LEFT JOIN ".$gets['target_table']." b ON (b.id = t.".$kolon2Adi.")
        WHERE t.".$kolon1Adi."='".$gets['id']."' 
        ";
      $data['itemList'] = $db->query($query)->getResultArray();
    }
    echo json_encode($data);
  }

  public function getCokluSelectListAltKategorili(){
    $gets = $this->request->getGet(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();

    //$gets['value'] = 0;
    /* if(empty($gets['value'])){
      $gets['value'] = 0;
    }*/
    //print_r($gets);
    $panelLib = new PanelLib();
    $breadCrumbList = $panelLib->findParents($gets['target_table'], $gets['value'], 0, $gets['target_table_secilen_kolon']);
 
   
    if($gets['idCikar'] == 'hayir'){  //eger crudlistten geldiyse alt kategoriyide almamız lazım.

      //echo "idcikar";
      $item['selected'] = 0;
      $item['liste'] = $db->table($gets['target_table'].' s')
          ->select('s.id, s.'.$gets['target_table_title'].', s.'.$gets['target_table_secilen_kolon'].'')
          ->where('s.'.$gets['target_table_secilen_kolon'], $gets['value'])->get()->getResultArray();   
  
      if($item['liste']){
        $parentList[] = $item;
      }
      
    }
    //print_r($parentList);
    $data['parentList'] = $parentList;

    $data['itemList'] = array();
    if(!empty($gets['id'])){
      $tabloAdi = $gets['table'].'_to_'.$gets['target_table'];
      $kolon1Adi = $gets['table'].'_id';
      $kolon2Adi = $gets['target_table'].'_id';
      $query = "
        SELECT b.id, b.".$gets['target_table_title']." as text FROM ".$tabloAdi." t 
        LEFT JOIN ".$gets['target_table']." b ON (b.id = t.".$kolon2Adi.")
        WHERE t.".$kolon1Adi."='".$gets['id']."' 
        ";
      $data['itemList'] = $db->query($query)->getResultArray();
    }
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

    

    $dbo = $db->table('column c');
    $dbo->select('c.*');
    $dbo->where('c.panel_id', $panel['id']);
    $dbo->where('c.form_edit', 1);
    $columns = $dbo->get()->getResultArray();

    //print_r($columns);

    //print_r($panel);
    //return ;
    
    $data['sonuc'] = 'ok';
    $data['aciklama'] = 'Kayıt Eklenmiştir. Yönlendiriliyorsunuz...';
    $gonder = $gets['formData'];
    if($gets['formType'] == 'add'){

      /* 
        Eğer sıralama aktif ise yeni eklenen kayitları en sona almamız lazım.
      */
      if($panel['order_drag'] == 1 && $panel['drag_column']){
        $sonSatir = $db->query("SELECT * FROM ".$panel['slug']." order by ".$panel['drag_column']." desc LIMIT 0,1 ")->getRowArray();
        //print_r($sonSatir);

        if($sonSatir){
          $gonder[$panel['drag_column']] = $sonSatir[$panel['drag_column']] +1;
        }
        //print_r($gonder);
      }
      

      $db->table($panel['slug'])->insert($gonder);
      $rowID = $db->insertID();
    }
    if($gets['formType'] == 'update'){
      $db->table($panel['slug'])->where('id', $gets['id'])->update($gonder);
      $rowID = $gets['id'];
    }
    
    /* 
      Kolonları arıyoruz, içlerinde çoklu seçim varsa kayıt edeceğiz.
    */
    if($columns){
      foreach ($columns as $keyc => $column) {
        if($column['component_id'] == 5){   
          $compState = $gets['stateComp']['state_'.$column['id']];
          //print_r($compState);
          if(!empty($compState['eklenenListe'])){
            $tabloAdi = $panel['slug'].'_to_'.$column['target_table'];

            $kolon1Adi = $panel['slug'].'_id';
            $kolon2Adi = $column['target_table'].'_id';
            $db->table($tabloAdi.' t')->where('t.'.$kolon1Adi, $rowID)->delete();
            foreach ($compState['eklenenListe'] as $keyi => $item) {
              $gonderCoklu = array();
              $gonderCoklu[$kolon1Adi] = $rowID;
              $gonderCoklu[$kolon2Adi] = $item['id'];
              $db->table($tabloAdi)->insert($gonderCoklu);
            }
          }
        }     
        if($column['component_id'] == 6){   
          $compState = $gets['stateComp']['state_'.$column['id']];
          //print_r($compState);
          if(!empty($compState['eklenenListe'])){
            $tabloAdi = $panel['slug'].'_to_'.$column['target_table'];
            
            $kolon1Adi = $panel['slug'].'_id';
            $kolon2Adi = $column['target_table'].'_id';
            $db->table($tabloAdi.' t')->where('t.'.$kolon1Adi, $rowID)->delete();
            foreach ($compState['eklenenListe'] as $keyi => $item) {
              $gonderCoklu = array();
              $gonderCoklu[$kolon1Adi] = $rowID;
              $gonderCoklu[$kolon2Adi] = $item['id'];
              $db->table($tabloAdi)->insert($gonderCoklu);
            }
          }
        }      
      }
    }

    
    //print_r($gets['stateComp']);


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
    //return false;
    
    $data['gets'] = $gets;
    $panelLib = new PanelLib();
    $breadCrumbList = $panelLib->findParents($gets['table'], $gets['id'], 0, $gets['name']);
    //echo $gets['table'].', '.$gets['id'].', 0 ,'. $gets['name'];
    //print_r($breadCrumbList);
    
    
    //print_r($data);
    //return false;

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
        

        $parentList[$key]['liste'] = $db->table($gets['table'].' s')
          ->select('s.id, s.'.$gets['target_table_title'].', s.'.$gets['name'].'')
          ->where('s.'.$gets['name'],$value[$gets['name']])->get()->getResultArray();        
      }
    }
    
    if($gets['idCikar'] == 'hayir'){  //eger crudlistten geldiyse alt kategoriyide almamız lazım.
      //echo "id cikar";
      $item['selected'] = 0;
      $item['liste'] = $db->table($gets['table'].' s')
          ->select('s.id, s.'.$gets['target_table_title'].', s.'.$gets['name'].'')
          ->where('s.'.$gets['name'],$gets['id'])->get()->getResultArray();   
      //print_r($parentList);
      /*if($parentList){
        $sonItem = end($parentList);
        //print_r($sonItem);
        if($sonItem[])
      }*/
      if($item['liste']){
        $parentList[] = $item;
      }
      
    }

    


    $data['parentList'] = $parentList;
    
    echo json_encode($data);
  }

  
  public function getAltKategori(){
    $gets = $this->request->getGet(null, FILTER_SANITIZE_STRING);
    if(!$gets) return false;
    $db = \Config\Database::connect();

    //print_r($gets);return;
    /* 
      table: siniflar, name: alt_siniflar, 
      target_table_title: baslik, id: 0, idCikar
    */
    
    $data['selected'] = $gets['id'];
    //$data['selected'] = 0;
    $data['liste'] = array();
    
    
    $data['liste'] = $db->table($gets['table'].' t')
      ->select('t.id, t.'.$gets['target_table_title'])
      ->where( 't.'.$gets['name'], $gets['id'] )->get()->getResultArray();
    

    //print_r($liste);

    //echo json_encode(array($data));
    echo json_encode($data);

  }



  public function isimler(){
    /*$domain = 'pehus.com';
    if ( gethostbyname($domain) != $domain ) {
      echo "DNS Record found";
    }
    else {
      echo "NO DNS Record found";
    }*/
    $sesli = array('a','e','i','o','u');
    $sessiz = array('b','c','d','f','g','h','j','k','l','m','n','p','r','s','t','v','x','y','z');

    $toplam = 5;
    

    $ci = 0;$vi = 0;
    /*$kelime = $sessiz[$ci].$sesli[$vi].$sessiz[$ci].$sesli[$vi].$sessiz[$ci];echo $kelime;echo '<br/>';
    $kelime = $sessiz[$ci].$sesli[$vi].$sessiz[$ci].$sesli[$vi].$sessiz[$ci+1];echo $kelime;echo '<br/>';
    $kelime = $sessiz[$ci].$sesli[$vi].$sessiz[$ci].$sesli[$vi].$sessiz[$ci+2];echo $kelime;echo '<br/>';
    $kelime = $sessiz[$ci].$sesli[$vi].$sessiz[$ci].$sesli[$vi].$sessiz[$ci+3];echo $kelime;echo '<br/>';
    $kelime = $sessiz[$ci].$sesli[$vi].$sessiz[$ci].$sesli[$vi+1].$sessiz[$ci];echo $kelime;echo '<br/>';
    $kelime = $sessiz[$ci].$sesli[$vi].$sessiz[$ci].$sesli[$vi+1].$sessiz[$ci+1];echo $kelime;echo '<br/>';
    $kelime = $sessiz[$ci].$sesli[$vi].$sessiz[$ci].$sesli[$vi+1].$sessiz[$ci+2];echo $kelime;echo '<br/>';*/
    echo "---go---".'<br/>';
    $i = 1;
    for ($k2=0; $k2 <= 4; $k2++) { 
      for ($k3=0; $k3 <= 18; $k3++) { 
        for ($k4=0; $k4 <= 4; $k4++) { 
          for ($k5=0; $k5 <= 18; $k5++) { 
            $kelime = 't'.$sesli[$k2].$sessiz[$k3].$sesli[$k4].$sessiz[$k5];
            //echo $kelime;
            $domain = $kelime.'.com';
            echo $domain.'<br/>';
            $i++;
            /*if ( gethostbyname($domain) != $domain ) {
              echo "DNS Record found - ".$domain." <br>";
            }
            else {
              //echo "NO DNS Record found";
            }*/

          }
        }
      }
    }
    
    /*$ci = 0;$vo = 1;
    $kelime = $sessiz[$ci].$sesli[$vo].$sessiz[$ci+1].$sesli[$vo+1].$sessiz[$ci+2];
    echo $kelime;echo '<br/>';

    echo count($sesli);*/
    /*for ($ci=0; $ci < count($sesli) ; $ci++) { 
      echo $sesli[$ci]; echo '-';
    }
    echo '------';*/
    /*for ($vi=0; $vi < count($sessiz); $vi++) { 
      echo $sessiz[$vi]; echo '-';
    }*/
    /*$sessizToplam = count($sessiz);
    $sesliToplam = count($sesli);
    for ($vi=0; $vi < $sessizToplam; $vi++) { 
      for ($ci=0; $ci < $sesliToplam-1 ; $ci++) {
        //$vi1 = $vi + 1; 
        //echo $vi1.' ';
        echo $sessiz[$vi].' ';
        //echo $sessiz[$vi].$sesli[$ci].$sessiz[$vi1].' <br/>';
        //$kelime = $sessiz[$vi].$sesli[$ci].$sessiz[$vi+1].$sesli[$ci+1].$sessiz[$vi+2];
        //echo $kelime.'--';
      }
    }*/
    
    
    
    

  }
	//--------------------------------------------------------------------

}
