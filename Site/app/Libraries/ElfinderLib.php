<?php namespace App\Libraries;

use elFinder;
use elFinderConnector;

//use App\Libraries\Elfinder\elFinderConnector;
//use elFinder as GlobalElFinder;
//use elFinderConnector as GlobalElFinderConnector;

include_once APPPATH.'Libraries/Elfinder/elFinderConnector.class.php';
include_once APPPATH.'Libraries/Elfinder/elFinder.class.php';
include_once APPPATH.'Libraries/Elfinder/elFinderVolumeDriver.class.php';
include_once APPPATH.'Libraries/Elfinder/elFinderVolumeLocalFileSystem.class.php';
//require APPPATH.'Libraries/Elfinder/autoload.php';

/*include_once dirname(__FILE__).DIRECTORY_SEPARATOR.'elfinder/elFinderConnector.class.php';
include_once dirname(__FILE__).DIRECTORY_SEPARATOR.'elfinder/elFinder.class.php';
include_once dirname(__FILE__).DIRECTORY_SEPARATOR.'elfinder/elFinderVolumeDriver.class.php';
include_once dirname(__FILE__).DIRECTORY_SEPARATOR.'elfinder/elFinderVolumeLocalFileSystem.class.php';*/

class ElfinderLib{
  public function __construct($opts){
    //print_r($opts);
    //$connector = new GlobalElFinderConnector(new GlobalElFinder($opts));
    //$connector->run();
    //print_r($opts);
    $connector = new elFinderConnector(new elFinder($opts));
    $connector->run();

    //echo "123";
    //print_r($opts);
    

  }

  

}
