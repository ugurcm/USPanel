<?php namespace App\Libraries;

class PanelLib{

  
  static function createTable($tableName = ''){
    //$tableName = 'xx';
    $forge = \Config\Database::forge();
    $db = \Config\Database::connect();

    $data['sonuc'] = 'err';
    if($tableName == ''){
      $data['aciklama'] = "Tablo ismi giriniz.";
      return $data;
    }
    $sql = "show tables like '".$tableName."'";
    $listeArr = $db->query($sql)->getRowArray();
    
    if(is_array($listeArr)){
      $data['aciklama'] = "Tablo daha önce eklenmiş.";
    }else{
      
      $forge->addKey('id', TRUE);
      $fields = array(
        'id' => array(
          'type' => 'INT',
          'constraint' => 11,
          'unsigned' => TRUE,
          'auto_increment' => TRUE,
        )
      );
      $forge->addField($fields);
      $attributes = array('ENGINE' => 'InnoDB');
      $forge->createTable($tableName, FALSE, $attributes);
      $data['sonuc'] = 'ok';
      $data['aciklama'] = 'Tablo oluşturuldu';
    }

    return $data;
  }


  public function findParents($tableName = '', $parentId = 0, $count = 0, $parentColumnName = 'parent', $reset = true) {
    static $breadcrumbs;
    $db = \Config\Database::connect();
    if ($reset == true) {
      $breadcrumbs = array();
    }
    $sql = "SELECT * FROM ".$tableName." t WHERE t.id = '".$parentId."'    ";
    //echo $sql;
    //return false;
    $q = $db->query($sql);
    if($q->getResultArray()){
      foreach ($q->getResultArray() as $key => $value) {
        $breadcrumbs[] = $value;
        //echo $parentColumnName;
        //echo "ic-";
        //echo $tableName.' '.$value[$parentColumnName].' '.$count.' '.$parentColumnName;
        $this->findParents($tableName, $value[$parentColumnName], $count, $parentColumnName, false);
      }
    }
    if($breadcrumbs)$sonuc = array_reverse($breadcrumbs);
    return @$sonuc;
  }


  public function addTableField($tableName='', $columnName = '', $columnDataType='VARCHAR', $type_length = '255', $type_default_value = ''){

    $forge = \Config\Database::forge();
    $db = \Config\Database::connect();
    
    //echo $tableName;
    $data['sonuc'] = 'err';
    if($columnName == ''){
      $data['aciklama'] = "Sütun ismi giriniz.";
      return $data;
    }
    //echo $tableName;
    $sql = "SHOW COLUMNS FROM `".$tableName."` LIKE '".$columnName."'";
    $tabloVarmi = $db->query($sql)->getRowArray();
    
    if($tabloVarmi){
      $data['aciklama'] = "Sütun daha önce eklenmiş.";
    }else{
      
      $fields = array(
        $columnName =>
          array(
            'type' => $columnDataType,
            'constraint' => $type_length,
            'default' => $type_default_value
          )
      );
      //$this->dbforge->add_column($tableName, $fields);
      $forge->addColumn($tableName, $fields);
      
      $data['sonuc'] = 'ok';
      $data['aciklama'] = 'Sütun oluşturuldu';
    }
    return $data;
  }
  
  public function modifyTableField($tableName='', $columnName = '', $oldColumnName = '', $columnDataType='VARCHAR', $type_length = '255', $type_default_value = ''){

    $forge = \Config\Database::forge();
    $db = \Config\Database::connect();
    
    //echo $tableName;
    $data['sonuc'] = 'err';
    if($columnName == ''){
      $data['aciklama'] = "Sütun ismi giriniz.";
      return $data;
    }
    //echo $tableName;
    $sql = "SHOW COLUMNS FROM `".$tableName."` LIKE '".$columnName."'";
    $tabloVarmi = $db->query($sql)->getRowArray();
    
    if($tabloVarmi){
      $data['aciklama'] = "Sütun daha önce eklenmiş.";
    }else{
      
      $fields = array(
        $oldColumnName =>
          array(
            'name' => $columnName,
            'type' => $columnDataType,
            'constraint' => $type_length,
            'default' => $type_default_value
          )
      );
      //$this->dbforge->add_column($tableName, $fields);
      //$forge->addColumn($tableName, $fields);
      //$this->dbforge->modify_column($tableName, $fields);
      $forge->modifyColumn($tableName, $fields);
      
      $data['sonuc'] = 'ok';
      $data['aciklama'] = 'Sütun oluşturuldu';
    }
    return $data;
  }
  
  public function modifyTableFieldOld($tableName='', $columnName = '', $oldColumnName = '', $columnDataType='VARCHAR', $type_length = '255', $type_default_value = ''){

    $data['sonuc'] = 'err';
    if($columnName == ''){
      $data['aciklama'] = "Sütun ismi giriniz.";
      return $data;
    }

    if(!$this->db->field_exists($oldColumnName, $tableName)){
      $data['aciklama'] = "Sütun daha önce eklenmemiş.";
    }else{

      $fields = array(
        $oldColumnName => array(
          'name' => $columnName,
          'type' => $columnDataType,
          'constraint' => $type_length,
          'default' => $type_default_value
        ),
      );
      //echo $columnDataType;
      $this->dbforge->modify_column($tableName, $fields);



      /*$fields = array(
        $columnName =>
          array('type' => 'VARCHAR', 'constraint' => 255, 'default' => '')
      );
      $this->dbforge->add_column($tableName, $fields);*/
      $data['sonuc'] = 'ok';
      $data['aciklama'] = 'Sütun güncellendi.';
    }
    return $data;
  }
}