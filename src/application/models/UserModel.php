<?php 
class UserModel extends CI_Model {

  public function __construct(){
		parent::__construct();
		$this->load->helper(['jwt', 'authorization']);
  }

  public function tokenCoz($token=''){
    

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
  public function userCheck($gelen){
    $data = array();
    $data['sonuc'] = 'error';
    $data['description'] = 'Güvenlik Tokeni Hatalı.';
		if(!$gelen){
			//$hata = 1;
			$data['sonuc'] = 'error';
			$data['description'] = 'Token Bulunamadı.';
		}

		if(isset($gelen['token'])){
			
			$tokenData = $this->UserModel->tokenCoz($gelen['token']);
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
    return $data;
  }
}