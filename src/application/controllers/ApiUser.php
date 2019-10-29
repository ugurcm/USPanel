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
	
}
