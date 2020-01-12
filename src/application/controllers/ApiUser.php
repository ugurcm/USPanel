<?php
defined('BASEPATH') OR exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: X-Requested-With");


class ApiUser extends CI_Controller {

	public $oturumIzinVerilenDakika = '30 min';
	public $suan = '';

	public function __construct(){
		parent::__construct();
		$this->load->helper(['jwt', 'authorization']);
		$this->load->model('UserModel');
		$this->load->model('PanelModel');
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

		//$data['tokenValidate'] = AUTHORIZATION::validateToken($gelen['token']);
		//$data['token'] = $gelen['token'];
		$data['veriler'] = array('verilerdeneme' => "deneme veri 1");
		$data['userData'] = $this->UserModel->userCheck($gelen);
		echo json_encode($data);
	}
	public function getCrudData(){
		$gets = $this->input->get();

		$data = array();

		if(!isset($gets)){
			$data['error'] = "Veriler Girilmedi";
			return false;
		}
		if(!isset($gets['panelTable'])){
			$data['error'] = "Tablo Adı Girilmedi";
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

	public function fileUploadNormal(){

		$this->load->helper('url');

		$data = [];
		$data['sonuc'] = 'ok';
		$data['files'] = $_FILES;
		//print_r($_FILES);
		if(!empty($_FILES['file']['name'])){
			
			// Set preference
			$config['upload_path'] = 'uploads/'; 
			$config['allowed_types'] = 'jpg|jpeg|png|gif|rar';
			//$config['allowed_types'] = '*';
			$config['max_size'] = '10240000000'; // max_size in kb
			$config['file_name'] = $_FILES['file']['name'];
 
			//Load upload library
			$this->load->library('upload',$config); 
 
			// File upload
			if($this->upload->do_upload('file')){
				// Get data about the file
				$uploadData = $this->upload->data();
			}
		}
		//echo json_encode($_FILES);
		
		//return false;
		
	
		/*$count = count($_FILES['files']['name']);
	
		for($i=0;$i<$count;$i++){
	
			if(!empty($_FILES['files']['name'][$i])){
	
				$_FILES['file']['name'] = $_FILES['files']['name'][$i];
				$_FILES['file']['type'] = $_FILES['files']['type'][$i];
				$_FILES['file']['tmp_name'] = $_FILES['files']['tmp_name'][$i];
				$_FILES['file']['error'] = $_FILES['files']['error'][$i];
				$_FILES['file']['size'] = $_FILES['files']['size'][$i];

				$config['upload_path'] = 'uploads/'; 
				$config['allowed_types'] = 'jpg|jpeg|png|gif';
				$config['max_size'] = '5000';
				$config['file_name'] = $_FILES['files']['name'][$i];
	
				$this->load->library('upload',$config); 
	
				if($this->upload->do_upload('file')){
					$uploadData = $this->upload->data();
					$filename = $uploadData['file_name'];
	
					$data['totalFiles'][] = $filename;
				}
			}
	
		}*/
		
		echo json_encode($data);

		
	}

	public function seoTest(){
		echo $filename = $this->PanelModel->temizle("türkçe kad a fasdfasdf");
	}
	public function fileUploadChunk(){

		$uploadFolderName = 'whole_from_chunks';
		if($_POST['uploadFolderName']){
			$uploadFolderName = $_POST['uploadFolderName'];
		}


		function returnJson($arr){
				header('Content-type: application/json');
				print json_encode($arr);
				exit;
		}
		/**
		 *
		 * Delete a directory RECURSIVELY
		 * @param string $dir - directory path
		 * @link http://php.net/manual/en/function.rmdir.php
		 */
		function rrmdir($dir) {
			if (is_dir($dir)) {
					$objects = scandir($dir);
					foreach ($objects as $object) {
							if ($object != "." && $object != "..") {
									if (filetype("$dir/$object") == "dir") {
											rrmdir("$dir/$object");
									} else {
											unlink("$dir/$object");
									}
							}
					}
					reset($objects);
					rmdir($dir);
			}
		}
		function cleanUp($file_chunks_folder){
				// rename the temporary directory (to avoid access from other concurrent chunks uploads) and than delete it
				if (rename($file_chunks_folder, $file_chunks_folder.'_UNUSED')) {
						rrmdir($file_chunks_folder.'_UNUSED');
				} else {
						rrmdir($file_chunks_folder);
				}
		}
		function temizle($baslik) {
				$bul = array('Ç', 'Ş', 'Ğ', 'Ü', 'İ', 'Ö', 'ç', 'ş', 'ğ', 'ü', 'ö', 'ı', ' ');
				$yap = array('C', 'S', 'G', 'U', 'I', 'O', 'c', 's', 'g', 'u', 'o', 'i', '-');
				$perma = str_replace($bul, $yap, $baslik);
				$perma = preg_replace("@[^A-Za-z0-9\\-_]@i", '', $perma);
				$perma = strtolower($perma);
				return $perma;
		} 
		function resumableUpload($uploadFolderName, $tmp_file_path, $filename){
			$successes = array();
			$errors = array();
			$warnings = array();
			$dir = "uploads/tmp/";
			$identifier = ( isset($_POST['dzuuid']) )?  trim($_POST['dzuuid']) : '';
			$file_chunks_folder = "$dir$identifier";
			if (!is_dir($file_chunks_folder)) {
					mkdir($file_chunks_folder, 0777, true);
			}
			$filename = str_replace( array(' ','(', ')' ), '_', $filename ); # remove problematic symbols
			$info = pathinfo($filename);
			$extension = isset($info['extension'])? '.'.strtolower($info['extension']) : '';
			$filename = temizle($info['filename']);
			$totalSize =   (isset($_POST['dztotalfilesize']) )?    (int)$_POST['dztotalfilesize'] : 0;
			$totalChunks = (isset($_POST['dztotalchunkcount']) )?  (int)$_POST['dztotalchunkcount'] : 0;
			$chunkInd =  (isset($_POST['dzchunkindex']) )?         (int)$_POST['dzchunkindex'] : 0;
			$chunkSize = (isset($_POST['dzchunksize']) )?          (int)$_POST['dzchunksize'] : 0;
			$startByte = (isset($_POST['dzchunkbyteoffset']) )?    (int)$_POST['dzchunkbyteoffset'] : 0;
			$chunk_file = "$file_chunks_folder/{$filename}.part{$chunkInd}";
			if (!move_uploaded_file($tmp_file_path, $chunk_file)) {
					$errors[] = array( 'text'=>'Move error', 'name'=>$filename, 'index'=>$chunkInd );
			}
			if( count($errors) == 0 and $new_path = checkAllParts(  $uploadFolderName,
																															$file_chunks_folder,
																															$filename,
																															$extension,
																															$totalSize,
																															$totalChunks,
																															$successes, $errors, $warnings) and count($errors) == 0){
					return array('final'=>true, 'path'=>$new_path, 'successes'=>$successes, 'errors'=>$errors, 'warnings' =>$warnings);
			}
			return array('final'=>false, 'successes'=>$successes, 'errors'=>$errors, 'warnings' =>$warnings);
		}
		function checkAllParts( $uploadFolderName, 
														$file_chunks_folder,
														$filename,
														$extension,
														$totalSize,
														$totalChunks,
														&$successes, &$errors, &$warnings){
				// reality: count all the parts of this file
				$parts = glob("$file_chunks_folder/*");
				$successes[] = count($parts)." of $totalChunks parts done so far in $file_chunks_folder";
				// check if all the parts present, and create the final destination file
				if( count($parts) == $totalChunks ){
						$loaded_size = 0;
						foreach($parts as $file) {
								$loaded_size += filesize($file);
						}
						if ($loaded_size >= $totalSize and $new_path = createFileFromChunks(
																														$uploadFolderName,
																														$file_chunks_folder,
																														$filename,
																														$extension,
																														$totalSize,
																														$totalChunks,
																														$successes, $errors, $warnings) and count($errors) == 0){
								cleanUp($file_chunks_folder);
								return $new_path;
						}
				}
			return false;
		}
		/**
		 * Check if all the parts exist, and
		 * gather all the parts of the file together
		 * @param string $file_chunks_folder - the temporary directory holding all the parts of the file
		 * @param string $fileName - the original file name
		 * @param string $totalSize - original file size (in bytes)
		 */
		function createFileFromChunks($uploadFolderName, $file_chunks_folder, $fileName, $extension, $total_size, $total_chunks,
																						&$successes, &$errors, &$warnings) {
				$rel_path = "uploads/".$uploadFolderName."/";
				$saveName = getNextAvailableFilename( $rel_path, $fileName, $extension, $errors );
				if( !$saveName ){
						return false;
				}
				$fp = fopen("$rel_path$saveName$extension", 'w');
				if ($fp === false) {
						$errors[] = 'cannot create the destination file';
						return false;
				}
				for ($i=0; $i<$total_chunks; $i++) {
						fwrite($fp, file_get_contents($file_chunks_folder.'/'.$fileName.'.part'.$i));
				}
				fclose($fp);
				return "$rel_path$saveName$extension";
		}
		function getNextAvailableFilename( $rel_path, $orig_file_name, $extension, &$errors ){
			if( file_exists("$rel_path$orig_file_name$extension") ){
					$i=0;
					while(file_exists("$rel_path{$orig_file_name}_".(++$i).$extension) and $i<10000){}
					if( $i >= 10000 ){
							$errors[] = "Can not create unique name for saving file $orig_file_name$extension";
							return false;
					}
			return $orig_file_name."_".$i;
			}
			return $orig_file_name;
		}
		
		
		
		if (!empty($_FILES)){
				foreach ($_FILES as $file) {
						if ($file['error'] != 0) {
								$errors[] = array( 'text'=>'File error', 'error'=>$file['error'], 'name'=>$file['name']);
								continue;
						}
						if(!$file['tmp_name']){
								$errors[] = array( 'text'=>'Tmp file not found', 'name'=>$file['name']);
								continue;
						}
						$tmp_file_path = $file['tmp_name'];
						$filename =  (isset($file['filename']) )? $file['filename'] : $file['name'];
						if( isset($_POST['dzuuid'])){
								$chunks_res = resumableUpload($uploadFolderName, $tmp_file_path, $filename);
								if(!$chunks_res['final']){
										returnJson( $chunks_res );
								}
								$tmp_file_path = $chunks_res['path'];
								echo json_encode(array('sonuc' => 'ok', 'filename' => $filename , 'newFileName' => $chunks_res['path']));
						}
				}
		}


	}
	
}
