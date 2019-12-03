<?php
defined('BASEPATH') OR exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

class ApiUser extends CI_Controller {

	public $oturumIzinVerilenDakika = '30 min';
	public $suan = '';

	public function __construct(){
		parent::__construct();
		$this->load->helper(['jwt', 'authorization']);
		$this->load->model('UserModel');
	}
	public function createTokenTest(){
		//echo "Anasayfa";
		//phpinfo();
		$tokenData = array();
		$tokenData['userId'] = 25;
		$tokenData['email'] = 'ugur@uydusoft.com';
		$tokenData['tokenCreatedDate'] = strtotime("now");
		// Create a token
		$token = AUTHORIZATION::generateToken($tokenData);
		//echo $token;
		$data['status'] = 'SUCCESS';
		$data['token'] = $token;
		
		echo json_encode($data);
	}
	
	
	public function formLogin(){
		$gelen = $this->input->post();
		if(!$gelen) return false;
		$fd = $gelen['formData'];
		//print_r($fd);
		//return false;
		$this->db->select('cu.*');
		$this->db->from('cms_users cu');
		$this->db->where('cu.userName',$fd['userName']);
		$this->db->where('cu.password',$fd['password']);
		$dbUser = $this->db->get()->row_array();
		if(!$dbUser){
			$data['code'] = 1;
			$data['sonuc'] = 'Kullanıcı adı veya şifre bulunamadı';
		}
		if($dbUser){
			$data['code'] = 2;
			$data['sonuc'] = 'Giriş Başarılı';
			$data['userData'] = $dbUser;
			$data['userData']['tokenCreatedDate'] = strtotime("now");
			unset($data['userData']['password']);
			$token = AUTHORIZATION::generateToken($data['userData']);
			$data['userToken'] = $token;
			
			//$liste = $this->findSub(0);
		}	 
		
		echo json_encode($data);
	}
	public function loadDashboard(){
		$gelen = $this->input->post();
		$data = array();
		$data['veriler'] = array('verilerdeneme' => "deneme veri 1");
		$data['userData'] = $this->UserModel->userCheck($gelen);
		echo json_encode($data);
	}
	public function getCrudData(){
		$gets = $this->input->get();

		$data = array();

		if(!isset($gets)){
			echo "Veriler Girilmedi";
			return false;
		}
		if(!isset($gets['panelTable'])){
			echo "Tablo Adı Girilmedi";
			return false;
		}

		$this->db->select('pt.*');
    $this->db->from('panel_table pt');
    $this->db->where('pt.title', $gets['panelTable']);
    $panelTable = $this->db->get()->row_array();
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
			$data['crudData']['crudColumns'] = $this->db->get()->result_array();
			$data['crudData']['crudColumns'][] = array('title' => 'İşlemler');

			$data['crudData']['crudColumnSlugs'] = array();
			if($data['crudData']['crudColumns']){
				foreach ($data['crudData']['crudColumns'] as $keyc => $column) {
					if(isset($column['slug'])){
						$data['crudData']['crudColumnSlugs'] [] = $column['slug'];
					}
					
				}
			}
			
			$tableListData = array();
			$tableListData['table'] = $panelTable['slug'];
			$tableListData['sayfaNo'] = $gets['sayfaNo'];
			$tableListData['kacar'] = $gets['kacar'];
			$tableListData['selectColumns'] = $data['crudData']['crudColumns'];
			$data['crudData']['crudList'] = $this->getTableList($tableListData);
			//print_r($data['crudList']);
		}
		

		echo json_encode($data);

	}
	public function getTableList($gets = array()){
		//$gets = $this->input->get();

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
    
    
    
    $this->db->select('COUNT(t.id) toplam');
    $this->db->from($gets['table'] . ' t');
    $kayitSayisi = $this->db->get()->row_array();


    $sSayisi = ceil($kayitSayisi['toplam'] / $kacar);
    
    
    $nereden = ($sayfaNo * $kacar) - $kacar;
		
		$secilecekler = '';
		/*if($gets['selectColumns']){
			//print_r($gets['selectColumns']);
			foreach ($gets['selectColumns'] as $keys => $colItem) {
				if(isset($colItem['slug']))
					$secilecekler .= 't.'.$colItem['slug'].', ';
			}
		}*-
		echo $secilecekler;*/
    $this->db->select('*');
    //$this->db->select($secilecekler);
    $this->db->from($gets['table'] . ' t');
    $this->db->group_by("t.id");
    $this->db->limit($kacar, $nereden);
    $data['listData'] = $this->db->get()->result_array();

		$data['sayfaSayisi'] = $sSayisi;
    //$data['kacar']   = $kacar;
		$data['nereden'] = $nereden;
		$data['toplam'] = $kayitSayisi['toplam'];
		//print_r($data);
		//echo json_encode($data);
		return $data;
	}

	public function testCall(){
		$data = array();
		$data['veriler'] = array('verilerdeneme' => "deneme veri 1");
		//echo "ll1";
		echo json_encode($data);
	}
	
}
