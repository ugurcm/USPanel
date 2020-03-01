<?php
defined('BASEPATH') OR exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: X-Requested-With");


class ApiCrudForm extends CI_Controller {
	public function __construct(){
		parent::__construct();
		$this->load->helper(['jwt', 'authorization']);
		$this->load->model('UserModel');
    $this->load->model('PanelModel');
    $this->load->dbforge();
  }
  
  public function getCrudData(){
		$gets = $this->input->get();

		$data = array();

		if(!isset($gets)){
			$data['error'] = "Veriler Girilmedi";
			//return false;
		}
		if(!isset($gets['tableSlug'])){
			$data['error'] = "Tablo Adı Girilmedi";
			//return false;
    }
    $data['languages'] = array();
		$panelTable = array();
		if(!empty($gets['tableSlug'])){
			$this->db->select('pt.*');
			$this->db->from('panel_table pt');
			$this->db->where('pt.slug', $gets['tableSlug']);
			$panelTable = $this->db->get()->row_array();
			//print_r($panelTable);
			$data['pageData'] = $panelTable;
		}
		//print_r($panelTable);
		if(!$panelTable){
			$data['error'] = 'Panel Tablo Bulunamadı';
		}
		if($panelTable){

      if($panelTable['language_active']){
        $this->db->select('l.*');
        $this->db->from('language l');
        $this->db->order_by('l.id', 'asc');
        $data['languages'] = $this->db->get()->result_array();

        
      }
      
			$this->db->select('ptc.*, ptci.id ciId, ptci.title ciTitle, ptci.componentName ');
			$this->db->from('panel_table_column ptc');
			$this->db->join('panel_table_column_input ptci', 'ptci.id = ptc.panel_table_column_input_id', 'left');
			$this->db->where('ptc.panel_table_id', $panelTable['id']);
			$this->db->where('ptc.edit_form', 1);
      $this->db->order_by('ptc.count', 'asc');
      $tabloKolonlar = $this->db->get()->result_array();
      //print_r($tabloKolonlar);

      $data['crudColumns'] = array();
			//$data['crudColumns'][] = array('title' => 'Id', 'slug' => 'id');
			if($tabloKolonlar){
        foreach ($tabloKolonlar as $keyt => $satir) {
          
          if($satir['relation_type_id'] == 2 || $satir['relation_type_id'] == 3 || $satir['relation_type_id'] == 4){
            //echo "2";
            $this->db->select('pt.*');
            $this->db->from('panel_table pt');
            $this->db->where('pt.id', $satir['relation_panel_table_id']);
            $relationPanelTable = $this->db->get()->row_array();
            //echo $satir['relation_panel_table_id'];
            //print_r($relationPanelTable);
            if($relationPanelTable){
              //echo "relation var";
              //print_r($relationPanelTable);

              $this->db->select('ptc.*');
              $this->db->from('panel_table_column ptc');
              $this->db->where('ptc.panel_table_id', $satir['relation_panel_table_id']);
              $relationPanelTableColumnList = $this->db->get()->result_array();
              
              $relationParentColumn = '';
              if(!empty($relationPanelTableColumnList)){
                foreach ($relationPanelTableColumnList as $key => $value) {
                  if(!empty($value['panel_table_column_input_id'])){
                    if($value['panel_table_column_input_id'] == 8){
                      $relationParentColumn = $value;
                    }
                  }
                  
                }
              }
              //print_r($relationParentColumn);

              
              
              $this->db->select('t.*');
              $this->db->from($relationPanelTable['slug'].' t');  
              if($relationParentColumn){
                $this->db->where('t.'.$relationParentColumn['slug'], '0');
              }
              if($relationPanelTable['language_active'] == 1){
                $this->db->where('t.language_id', 1);
              }

              $satir['relationList'] = $this->db->get()->result_array();
            }
            
          }
          $data['crudColumns'][] = $satir;
          
        }
      }

      $data['lang'] = array();
      if($data['languages']){
        

        foreach ($data['languages'] as $key => $language) {
          /*if($panelTableColumn){
            foreach ($panelTableColumn as $keyc => $col) {
              if($col['language_active'] == 1){
                $data['lang'][$language['id']][$col['slug']] = $data['formData'][$col['slug']];
              }
            }
          }*/
          /*$this->db->select('pt.*');
          $this->db->from($gets['tableSlug'].' pt');
          $this->db->where('pt.content_id', $data['formData']['content_id']);
          $this->db->where('pt.language_id', $language['id']);
          $formDataLang = $this->db->get()->row_array();*/
          //print_r($formDataLang);
          if($tabloKolonlar){
            foreach ($tabloKolonlar as $keyc => $col) {
              if($col['language_active'] == 1){
                $data['lang'][$language['id']][$col['slug']] = '';
                
              }
            }
          }

        }
      }


      //print_r($data['crudColumns']);
		
		}
		echo json_encode($data);
  }
  
	public function getFormData(){
    $gets = $this->input->post();
    //if(!$gets) return false;
    //if(!$gets['id']) return false;
    //print_r($gets);
    //$gets['tableSlug'] = 'siniflar';
    //$gets['id'] = '1';
    $data = array();

    $this->db->select('pt.*');
    $this->db->from('panel_table pt');
    $this->db->where('pt.slug', $gets['tableSlug']);
    $panelTable = $this->db->get()->row_array();

    $this->db->select('pt.*');
    $this->db->from('panel_table_column pt');
    $this->db->where('pt.panel_table_id', $panelTable['id']);
    $this->db->where('pt.edit_form', 1);
    $panelTableColumn = $this->db->get()->result_array();
    //print_r($panelTableColumn);

    //print_r($panelTable);

    //print_r($gets);
    $languages = array();
    if($panelTable['language_active']){
      $this->db->select('l.*');
      $this->db->from('language l');
      $this->db->order_by('l.id', 'asc');
      $languages = $this->db->get()->result_array();
    }
    
    
    if($gets['id']){
      
      $this->db->select('pt.*');
      $this->db->from($gets['tableSlug'].' pt');
      $this->db->where('pt.id', $gets['id']);
      if($panelTable['language_active'] == 1){
        $this->db->where('pt.language_id', 1);
      }
      $data['formData'] = $this->db->get()->row_array();
      //print_r($data['formData']);
      if(!empty($data['formData'])){
        foreach ($data['formData'] as $key => $value) {
          //echo $key.' ';
          if($panelTableColumn){
            foreach ($panelTableColumn as $keyc => $column) {
              if($column['slug'] == $key){
                //print_r($column);
                if($column['panel_table_column_input_id'] == 17){
                  //$data['formData'][$key] = json_decode($data['formData'][$key], true);

                  //print_r($panelTable);
                  //print_r($column);
                  //print_r($data['formData']);

                  $this->db->select('pt.*');
                  $this->db->from('panel_table pt');
                  $this->db->where('pt.id', $column['relation_panel_table_id']);
                  $relationPanelTable = $this->db->get()->row_array();
                  //print_r($relationPanelTable);
                  //print_r($column);

                  $itemler = array();

                  $cokluTableAdi = $panelTable['slug'].'_to_'.$relationPanelTable['slug'];
                  $mevcutTableId = $panelTable['slug'].'_id';
                  $this->db->select('*');
                  $this->db->where($mevcutTableId, $data['formData']['id']);
                  $this->db->from($cokluTableAdi);
                  $liste = $this->db->get()->result_array();
                  if($liste){
                    foreach ($liste as $key => $value) {
                      $this->db->select('t.id, t.'.$column['relation_panel_table_column_slug'].' title');
                      $this->db->from($relationPanelTable['slug'].' t');
                      $this->db->where('t.id', $value[$relationPanelTable['slug'].'_id']);
                      $item = $this->db->get()->row_array();
                      //print_r($item);
                      if($item){
                        $itemler []= $item;
                      }
                    }
                  }
                    
                  $data['formData'][$column['slug']] = $itemler;
                  //print_r($data['formData'][$column['slug']]);
                  

                }

                
                if($column['panel_table_column_input_id'] == 8){
                  if( !empty($data['formData'][$key.'_path']) && $data['formData'][$key.'_path'] != '[]'){
                    $data['formData'][$key.'_path'] = json_decode($data['formData'][$key.'_path'], true);
                  }
                  if( empty($data['formData'][$key.'_path']) || $data['formData'][$key.'_path'] == '[]'){
                    $data['formData'][$key.'_path'] = json_decode('["0"]', true);
                  }
                }
              }
            }
          }
        }
      }
      //print_r($data['formData']);
      if(!empty($data['formData']['parent_path'])){
				if($data['formData']['parent_path'] && $data['formData']['parent_path'] != '[]'){
					$data['formData']['parent_path'] = json_decode($data['formData']['parent_path'], true);
				}
      }

      $data['lang'] = array();
      /*if($panelTableColumn){
        foreach ($panelTableColumn as $keyc => $col) {
          if($col['language_active'] == 1){
            $data['lang'][] = $col;
          }
        }
      }
      $data['lang'][1]['adi'] = 'sınıf 1'; */
      if($languages){
        

        foreach ($languages as $key => $language) {
          /*if($panelTableColumn){
            foreach ($panelTableColumn as $keyc => $col) {
              if($col['language_active'] == 1){
                $data['lang'][$language['id']][$col['slug']] = $data['formData'][$col['slug']];
              }
            }
          }*/
          $this->db->select('pt.*');
          $this->db->from($gets['tableSlug'].' pt');
          $this->db->where('pt.content_id', $data['formData']['content_id']);
          $this->db->where('pt.language_id', $language['id']);
          $formDataLang = $this->db->get()->row_array();
          //print_r($formDataLang);
          if($panelTableColumn){
            foreach ($panelTableColumn as $keyc => $col) {
              if($col['language_active'] == 1){
                $data['lang'][$language['id']][$col['slug']] = $formDataLang[$col['slug']];
                
              }
            }
          }

        }
      }
      //$data['formData']['lang'] = $data['lang'];
      //print_r($data['lang']);
      
     
    }
  
    //$data['formData']['title'] = "ok then";
    //$data['formData']['parent_path'] = array("0", "13", "15", "16");

    /*$this->db->select('pt.id, pt.title');
    $this->db->from('panel_table pt');
    $this->db->where('pt.parent', 0);
    $data['parentPathList'] = $this->db->get()->result_array();*/


    echo json_encode($data);

  }


	public function slugTest(){
    
    $baslik = 'Hakkımızda';
    //$liste = $this->PanelModel->findParents($gets['pageData']['slug'], $gets['parent'], 0, $parent['slug']);
    $slug = $this->PanelModel->temizle($baslik);
    print_r($slug);
  }
  
	public function saveForm(){
    $gelen = $this->input->post();
    if(!$gelen) return false;
    //print_r($gelen);
    //return false;
    //print_r($gelen['formData']);
    if(!empty($gelen['formData'])){
      $gelen['formData'] = json_decode($gelen['formData'], true);
    }
    if(!empty($gelen['langData'])){
      $gelen['langData'] = json_decode($gelen['langData'], true);
    }


    //print_r($gelen['langData']);
    //print_r($gelen['formData']);
    //return false;
    //print_r($gelen['pageData']);
    //return false;
    //print_r($gelen['crudColumns']);
    //return false;
    //echo $gelen['formData']['title'];
    
    $formId = 0;
    //print_r($gelen['formData']);
    //return false;

    if(!empty($gelen['formData'])){
      foreach ($gelen['formData'] as $key => $value) {
        if(is_array($value)){
          $gelen['formData'][$key] = json_encode($value);
        }
      }
    }
    $data['sonuc'] = 'ok';
		$gonder = $gelen['formData'];
    if($gelen['formType'] == 'add'){
      $this->db->insert($gelen['tableSlug'], $gonder);
      $formId = $this->db->insert_id();

      if($gelen['pageData']['language_active'] == 1){
        $gonder['content_id'] = $formId;
        $this->db->where('id', $formId)->update($gelen['tableSlug'], array('content_id' => $formId));
      }

      $data['aciklama'] = 'Kayıt Eklenmiştir. Yönlendiriliyorsunuz...';
            
		}
		if($gelen['formType'] == 'update'){
			$this->db->where('id', $gelen['formId']);
      $this->db->update($gelen['tableSlug'], $gonder);
      $formId = $gelen['formId'];
			$data['aciklama'] = 'Kayıt Güncellenmiştir. Yönlendiriliyorsunuz...';
    }


    $this->db->select('pt.*');
    $this->db->from('panel_table pt');
    $this->db->where('pt.slug', $gelen['tableSlug']);
    $panelTable = $this->db->get()->row_array();
    //print_r($panelTable);

    $this->db->select('pt.*');
    $this->db->from('panel_table_column pt');
    $this->db->where('pt.panel_table_id', $panelTable['id']);
    //$this->db->where('pt.edit_form', 1);
    $panelTableColumn = $this->db->get()->result_array();
    //print_r($panelTableColumn);
    if($panelTableColumn){
      foreach ($panelTableColumn as $keyc => $column) {
        if($column['panel_table_column_input_id'] == 20){ // Slug Olusturan Component
          
          $this->db->select('pt.*');
          $this->db->from('panel_table_column pt');
          $this->db->where('pt.panel_table_id', $panelTable['id']);
          $this->db->where('pt.panel_table_column_input_id', 8);
          $kategorisi = $this->db->get()->row_array();

          $seo = '';
          if($kategorisi){
            if(!empty($gelen['formData'][$kategorisi['slug']])){
              $liste = $this->PanelModel->findParents($gelen['tableSlug'], $gelen['formData'][$kategorisi['slug']], 0, $kategorisi['slug']);
              //print_r($liste);
              //echo $kategorisi['slug'];
              if($liste){
                foreach ($liste as $keys => $list) {
                  
                  $seo.= $this->PanelModel->temizle($list[$column['slug_kolon']]).'/';
                }
              }
            }
          }
                
          //
          $seo .= $this->PanelModel->temizle($gelen['formData'][$column['slug_kolon']]);
          //echo $seo;
          $gonderSlug = array();
          $gonderSlug[$column['slug']] = $seo;
          
          $this->db->where('id', $formId);
          $this->db->update($gelen['tableSlug'], $gonderSlug);
          
        }
        
      }
    }



    //print_r($gelen['formData']);
    //print_r($gelen['crudColumns']);
    if(!empty($gelen['formData'])){
      //echo "123";
      foreach ($gelen['formData'] as $key => $value) {
        //echo $key.' ';
        if($gelen['crudColumns']){
          foreach ($gelen['crudColumns'] as $keyc => $column) {
            //print_r($column);
            //echo $key.' ';
            if($column['slug'] == $key){
              //print_r($column);
              if($column['panel_table_column_input_id'] == 17 ){
                //echo $gelen['formData'][$key];
                //echo "123";
                $gelen['formData'][$key] = json_decode($gelen['formData'][$key], true);
                //print_r($gelen['formData'][$key]);
                
                $sourceTable = $this->db->select('pt.*')
                ->from('panel_table pt')
                ->where('pt.id', $column['panel_table_id'])
                ->get()->row_array();
                $relationTable = $this->db->select('pt.*')
                ->from('panel_table pt')
                ->where('pt.id', $column['relation_panel_table_id'])
                ->get()->row_array();
                $iliski_tablosu = $sourceTable['slug'].'_to_'.$relationTable['slug'];
                //echo $iliski_tablosu;
                //print_r($column);
                
                $sourceIdLabel = $sourceTable['slug'].'_id';
                $targetIdLabel = $relationTable['slug'].'_id';
                //echo $targetIdLabel;
                $this->db->where($sourceIdLabel, $formId)->delete($iliski_tablosu);
                //print_r($gelen['formData'][$key]);

                $sadeceIdlerArr = array();
                foreach ($gelen['formData'][$key] as $rKey => $rValue) {
                  $gonderIliski = array();
                  $gonderIliski[$sourceIdLabel] = $formId;
                  $gonderIliski[$targetIdLabel] = $rValue['id'];
                  $this->db->insert($iliski_tablosu, $gonderIliski);
                  $sadeceIdlerArr []= $rValue['id'];
                }
                //print_r($sadeceIdlerArr);
                $jsonCevir = json_encode($sadeceIdlerArr);
                $gonderJson[$column['slug']] = $jsonCevir;
                $this->db->where('id',$formId)->update($gelen['tableSlug'], $gonderJson);




              }

              
            }
          }
        }
      }
    }

    //print_r($kaydedilenAnaRow);
    if($gelen['pageData']['language_active'] == 1){

      if($formId){
        $this->db->select('p.*');
        $this->db->from($gelen['pageData']['slug'].' p');
        $this->db->where('p.content_id', $formId);
        $kaydedilenAnaRow = $this->db->get()->row_array();
      }


      if($gelen['langData']){
        //print_r($gelen['langData']);

        foreach ($gelen['langData'] as $languageId => $language) {
          

          $this->db->select('p.*');
          $this->db->from($gelen['pageData']['slug'].' p');
          $this->db->where('p.language_id', $languageId);
          $this->db->where('p.content_id', $kaydedilenAnaRow['content_id']);
          $langSatir = $this->db->get()->row_array();
          //print_r($langSatir);
          if($langSatir){
            $gonderLangCols = array();
            $gonderLangCols = $language;
            $gonderLangCols['language_id'] = $languageId;
            //print_r($gonderLangCols);
            //echo "gönderildi ".$languageId;
            $this->db->where('content_id', $kaydedilenAnaRow['content_id'])->where('language_id', $languageId)->update($gelen['pageData']['slug'], $gonderLangCols);
          }
          if(!$langSatir){
            $gonderLangCols = array();
            $gonderLangCols = $gonder;
            unset($gonderLangCols['id']);
            if($language){
              foreach ($language as $keyCol => $val) {
                $gonderLangCols[$keyCol] = $val;
              }
            }
            //$gonderLangCols = $language;
            $gonderLangCols['language_id'] = $languageId;
            $this->db->insert($gelen['pageData']['slug'], $gonderLangCols);
          }

 
          




        }
      }
    }
    //return false;
    
    echo json_encode($data);    
	}
	
	


  public function getParentList(){
    $gets = $this->input->get();
    //print_r($gets);
    //return false; 
    $this->db->select('pt.*');
    $this->db->from('panel_table pt');
    $this->db->where('pt.slug', $gets['table']);
    $panelTable = $this->db->get()->row_array();
    //print_r($panelTable);
    //echo $gets['table'];
    //echo $gets['parentPath'];
    $data = array();
    //$data['parentPathList'] = array();
    if(isset($gets['parentPath']) && $gets['parentPath'] != '[]' && $gets['parentPath']){
      //print_r($gets['parentPath']);
      //$gets['parentPath'] = json_decode($gets['parentPath'], true);
      if($gets['parentPath']){
        foreach ($gets['parentPath'] as $key => $value) {
          //echo $value.'---';
          $this->db->select('pt.id, pt.'.$gets['secilenTitle']);
          $this->db->from($gets['table'].' pt');
          $this->db->where('pt.'.$gets['currentComponent'], $value);
          if($panelTable['language_active'] == 1){
            $this->db->where('pt.language_id', 1);
          }
          $data['parentPathList'][] = $this->db->get()->result_array();
        }
      }
    }
    
    
    echo json_encode($data);
  }

  public function getParentPath(){
    $gets = $this->input->post();
    //print_r($gets);
    if(!$gets) return false;

    $parent = '';
    if(!empty($gets['crudColumns'])){
      foreach ($gets['crudColumns'] as $key => $value) {
        if(!empty($value['panel_table_column_input_id'])){
          if($value['panel_table_column_input_id'] == 8){
            $parent = $value;
          }
        }
        
      }
    }
    //print_r($parent);
    //return false;

    //echo $gets['pageData']['slug'].' '.$gets['parent'].' '.$parent['slug'];

    
    $data = array();
    $data['parentCol'] = $parent;
    $data['formData'] = array();
    $liste = $this->PanelModel->findParents($gets['pageData']['slug'], $gets['parent'], 0, $parent['slug']);
    //print_r($liste);
    if($liste){
      foreach ($liste as $key => $value) {
        $data['formData'][$parent['slug'].'_path'][] = $value[$parent['slug']];
      }
    }
    
    $data['formData'][$parent['slug'].'_path'][] = $gets['parent'];
    //print_r($data['formData']);
    /*if(isset($data['formData']['parent_path']) && $data['formData']['parent_path'] && $data['formData']['parent_path'] != '[]'){
      $data['formData']['parent_path'] = json_decode($data['formData']['parent_path'], true);
    }*/
    echo json_encode($data);
    //print_r($liste);
  }



  public function getSubRowsList(){
    $gets = $this->input->get();
    //print_r($gets);
    
    $this->db->select('t.*');
    $this->db->from($gets['crudColumn']['slug'].' t');
    $this->db->where('t.'.$gets['crudColumn']['relation_panel_table_altkategori_slug'], $gets['relationSelectId']);
    $data['altKategoriler'] = $this->db->get()->result_array();
    echo json_encode($data);

  }

  public function ustKategoriGetir(){
    $gets = $this->input->get();
    //print_r($gets);
    $this->db->select('pt.*');
    $this->db->from('panel_table pt');
    $this->db->where('pt.id', $gets['crudColumn']['relation_panel_table_id']);
    $panelTable = $this->db->get()->row_array();
    //print_r($panelTable);
    $liste = $this->PanelModel->findParents($panelTable['slug'], $gets['secilenItem'], 0, $gets['crudColumn']['relation_panel_table_altkategori_slug']);
    if(!$liste){
      $liste = array();
    }
    $data['liste'] = $liste;
    echo json_encode($data);
  }


}
