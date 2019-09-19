<?php namespace App\Controllers;

class Profil extends BaseController
{
	public function index()
	{
		echo "Profil index yüklendi";
	}
	public function metodlar($method)
	{
		//echo "Profil metodlar yüklendi. ".$method;
		if($method){
			//echo $method;
			//method();
			$this->{$method}();
		}
	}
	public function Bilgilerim()
	{
		echo "bilgilerim yüklendi";
	}
	public function Cilgilerim()
	{
		echo "Cilgilerim yüklendi";
	}
}
