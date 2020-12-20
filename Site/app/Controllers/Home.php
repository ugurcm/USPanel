<?php namespace App\Controllers;

class Home extends BaseController
{
	public function index()
	{
		return view('welcome_message');
	}
	public function iletisim()
	{
		//echo "iletisim";
		echo FCPATH;
		//mkdir(FCPATH.'assets/deneme',0777,true);
	}
	//--------------------------------------------------------------------

}
