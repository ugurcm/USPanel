<?php namespace App\Controllers;

class Home extends BaseController
{
	public function index()
	{
		$request = \Config\Services::request();

		$gelen = $request->getGet();
		//print_r($gelen);

		$data['title'] = "Sayfa Başlığı";
		$data['liste'] = array(
			array('isim' => 'ugur', 'no' => '25'),
			array('isim' => 'cemil', 'no' => '29'),
		);
		return view('home', $data);
		//return $this->response->setXML($data);
	}
	public function sayfa($slug, $ekSlug){		
		echo "sayfa çağrıldı. Slug: ".$slug." Ek: ".$ekSlug;
	}


}
