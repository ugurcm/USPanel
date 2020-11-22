<?php namespace App\Controllers\Admin;
use App\Controllers\BaseController;
use \Firebase\JWT\JWT;
use \App\Libraries\UserLib;
class ApiUser extends BaseController{

	public $jwtKey = '';
	public function __construct(){
		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
		$this->request = \Config\Services::request();
		$this->jwtKey = 'ugurbaba5';
	}

	public function jwtTest(){
		//echo $this->jwtKey;
		
		$key = "example_key";
		$payload = array(
				"iss" => "http://example.org",
				"aud" => "http://example.com",
				"iat" => 1356999524,
				"nbf" => strtotime('now')
		);
		$jwt = JWT::encode($payload, $key);
		$decoded = JWT::decode($jwt, $key, array('HS256'));
		$decoded_array = (array) $decoded;
		//print_r($decoded_array);

	}
	public function formLogin(){
		
		
		//$this->response->setContentType('Content-Type: application/json');
		
		$gelen = $this->request->getVar(null, FILTER_SANITIZE_STRING);
		if(!$gelen) return false;
		$hata = 0;
		if(empty($gelen['formData']['user_name']) || empty($gelen['formData']['password'])){
			$data['code'] = 1;
			$data['sonuc'] = "Kullanıcı adı ve şifre giriniz.";
			$hata = 1;
		}

		if($hata == 0){
			$db = \Config\Database::connect();
			
			$fd = $gelen['formData'];
			//print_r($fd);
			//return false;
			$bu = $db->table('cms_users cu');
			$bu->select('cu.*');
			$bu->where('cu.user_name',$fd['user_name']);
			$bu->where('cu.password',$fd['password']);
			$dbUser = $bu->get()->getRowArray();
			
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
				
				$token = JWT::encode($data['userData'],$this->jwtKey);
				//$token = AUTHORIZATION::generateToken($data['userData']);
				$data['userToken'] = $token;
				
				//$liste = $this->findSub(0);
			}	 
		}	 
		
		echo json_encode($data);
	}

	public function token_test(){
		$userLib = new UserLib();
		$userData = $userLib->tokenCoz('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEiLCJ1c2VyTmFtZSI6InVndXIiLCJlbWFpbCI6InVndXJAb3pjLmNvbS50ciIsImNvdW50IjoiMSIsInRva2VuQ3JlYXRlZERhdGUiOjE1OTg5OTMwOTN9.-l3xqxhFSKCRyvUoJj4cqMYrZa3GAap5YKO4t7QRMrM');
		print_r($userData);
	}
	public function checkToken(){
		$this->response->setContentType('Content-Type: application/json');
		$gelen = $this->request->getVar(null, FILTER_SANITIZE_STRING);

		$data = array();
		$data['ad'] = "uğur";
		$userLib = new UserLib();
		//$userLib->userCheck($gelen);
		
		//$data['tokenValidate'] = AUTHORIZATION::validateToken($gelen['token']);
		//$data['token'] = $gelen['token'];
		//$data['veriler'] = array('verilerdeneme' => "deneme veri 1");
		
		//$data['userData'] = $this->UserModel->userCheck($gelen);
		$data['userData'] = $userLib->userCheck($gelen);
		//print_r($data['userData']);
		echo json_encode($data);
	}	
}
