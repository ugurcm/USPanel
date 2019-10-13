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
	
	public function tokenCoz($token=''){
		//$token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjI1LCJlbWFpbCI6InVndXJAdXlkdXNvZnQuY29tIiwidG9rZW5DcmVhdGVkRGF0ZSI6MTU2OTY3NjQyNH0.zW6jnRcdbEgCbdTYrqpgy659NUt2yjlMYcfPuHHXM7Y';
		$data = array();
		try {
			$tokenData = AUTHORIZATION::validateToken($token);
			if($tokenData === false){
				$data['status'] = 'error';
				$data['statusDescription'] = 'TOKEN HATALI';

			}else{
				//echo $tokenData;
				//print_r($tokenData);
				//echo $tokenData->userId;
				$data['status'] = 'success';
				$data['tokenData'] = $tokenData;

				//$date = date('d.m.Y H:i:s', $tokenData->tokenCreatedDate);

				//echo $date;

			}
		} catch (Exception $e) {
			//throw $th;
			//echo "hata";
			$data['status'] = 'error';
			$data['statusDescription'] = 'TOKEN HATALI COZULEMEDI';
		}
		//print_r($data);
		return $data;
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
		//print_r($gelen['token']);
		//$hata = 0;
		$data = array();
		$data['sonuc'] = 'error';
		if(!$gelen){
			//$hata = 1;
			$data['sonuc'] = 'error';
			$data['description'] = 'Token Bulunamadı.';
		}

		if(isset($gelen['token'])){
			$tokenData = $this->tokenCoz($gelen['token']);
			//print_r($tokenData);
			if($tokenData['status'] == 'success'){
				$suan = date('Y-m-d H:i:s');
				//$getDate = $tokenData['tokenData']->tokenCreatedDate;
				//echo "token geçti";
				//echo $this->oturumIzinVerilenDakika;
				if(strtotime('-'.$this->oturumIzinVerilenDakika) > $tokenData['tokenData']->tokenCreatedDate){
					//echo "süre doldu";
					$data['sonuc'] = 'error';
					$data['description'] = 'Token Süresi Doldu';
				}else{
					$data['sonuc'] = 'success';
					$data['veriler'] = array('verilerdeneme' => "deneme veri 1");
				}
				
				
			}
		}else{
			$data['sonuc'] = 'error';
			$data['description'] = 'Token Bulunamadı.';
		}

		echo json_encode($data);


	}
	
}
