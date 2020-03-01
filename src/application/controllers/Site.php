<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Site extends CI_Controller {
	public function __construct(){
		parent::__construct();
		$this->load->helper('url');
	}

	public function index(){
		
		$data = array();


		

		$this->load->view('pages/header',$data);
		$this->load->view('pages/static/home',$data);
		$this->load->view('pages/footer',$data);
	}
}
