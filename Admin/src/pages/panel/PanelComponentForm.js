import React, {useState, useContext, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';

import doAjax from '../../libraries/doAjax';

import Text from '../../components/form/Text'
import Checkbox from '../../components/form/Checkbox';
import CheckboxGroup from '../../components/form/CheckboxGroup';
import Radio from '../../components/form/Radio';
import Select from '../../components/form/Select';
import UploadComp from '../../components/form/UploadComp'
//import Dropzone from 'react-dropzone-uploader'
import Modal from '../../components/form/Modal'

import queryString from 'query-string';


export default function PanelComponentForm (props) {
  const appContext = useContext(AppContext);

  const [pageTitle, setPageTitle] = useState('Tablo Düzenleme');
  const [panelId, setPanelId] = useState(0);
  const [formId, setFormId] = useState(0);
  const [formType, setFormType] = useState('add');
  const [tableName, setTableName] = useState('panel_table_column')
  const [values, setValues] = useState({
    panel_table_id: 0,
    title: '',
    panel_table_column_input_id: '',
    panel_table_column_type_id: '',
    type_length: '',
    type_default_value: '',
  });
  const [panelTable, setPanelTable] = useState({});
  const [panelTableColumnInputs, setPanelTableColumnInputs] = useState([]);
  const [panelTableColumnTypes, setPanelTableColumnTypes] = useState([]);
  
  useEffect(()=>{
    const parsed = queryString.parse(location.search);
    if(parsed.id){
      setFormType('update');
      setFormId(parsed.id);
    }
    if(parsed.id || parsed.panelId){
      
      

      //setPanelId(parsed.panelId);
      //setValues({...values, 'panel_table_id': parsed.panelId});
      const data = doAjax(
        appContext.api_url + 'ApiPanel/getFormDataPanelComponent',
        'GET',
        {id: parsed.id, panel_table_id: parsed.panelId}
      );
      data.then((res)=>{
        //console.log(res);
        const gelen = JSON.parse(res);
        //console.log(gelen);
        
        if(gelen.formData){
          //console.log(gelen.formData);
          setValues({...values, ...gelen['formData']});
        }
        if(gelen.panelTable){
          setPanelId(gelen.panelTable.id);
        }
        setPanelTable(gelen.panelTable);
        setPageTitle(gelen.panelTable.title + ' Tablosuna Sütun Ekle / Düzenle');
       
        if(gelen.panelTableColumnInputs){
          setPanelTableColumnInputs(gelen.panelTableColumnInputs);
        }
        if(gelen.panelTableColumnTypes){
          setPanelTableColumnTypes(gelen.panelTableColumnTypes);
        }
      })
    }
    

  },[])


  const onChange = (e) => {
    //console.log(values)
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues({...values, [e.target.name]: value});
  }
  const formSubmit = (e) => {
    e.preventDefault();
    
    //console.log(values);
    //return false;
    
    const data = doAjax(
      appContext.api_url + 'ApiPanel/saveFormPanelComponent',
      'POST',
      {formData: values, formType: formType, formId: formId, panelId: panelId, tableName:tableName}
    );
    data.then((res)=>{
      console.log(res);
      
      const gelen = JSON.parse(res);
      if(gelen.sonuc == 'err'){
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: gelen.aciklama,
          showConfirmButton: false,
          allowOutsideClick: false,
          timer:1500
        })
      }
      if(gelen.sonuc == 'ok'){
        Swal.fire({
          icon: 'success',
          title: 'İşlem Başarılı',
          text: gelen.aciklama,
          showConfirmButton: false,
          allowOutsideClick: false,
          timer:1500
        })
        setTimeout(()=>{ 
          props.history.push('PanelComponent?id=' + panelId);
        }, 1500)
        
      }else{
        
      }

      
    })

  }

  const formCancel = (e) => {
    e.preventDefault();
    props.history.goBack();
  }



  
  return (
    <div className="page-content">      
      <div className="page-title">
        <div className="icon">
          <i className="fa fa-user"></i>
        </div>
        <div className="desc">{pageTitle}</div>
      </div>
      
      <div className="form-cont">
        <form action="" method="POST" onSubmit={e=>formSubmit(e)} autoComplete="off">

          <input type="hidden" name="panel_table_id" value={values.panel_table_id} />
          <div className="frow">
            <div className="flabel">
              Başlık
            </div>
            <div className="fval">
              <div className="input-text">
                <Text name={'title'} value={values.title} onChange={onChange} />
              </div>              
            </div>
          </div>

         

          <div className="frow">
            <div className="flabel">
              Input Türü Seçiniz
            </div>
            <div className="fval">
              <Select name={'panel_table_column_input_id'} inputList={panelTableColumnInputs} value={values.panel_table_column_input_id} onChange={onChange} itemKeyValue="id" itemKeyName="title"/>
            </div>
          </div>

          <div className="frow">
            <div className="flabel">
              Input Veri Tipi Seçiniz
            </div>
            <div className="fval">
              <Select name={'panel_table_column_type_id'} inputList={panelTableColumnTypes} value={values.panel_table_column_type_id} onChange={onChange} itemKeyValue="id" itemKeyName="title"/>
            </div>
          </div>
          <div className="frow">
            <div className="flabel">
              Input Veri Uzunluğu
            </div>
            <div className="fval">
              <div className="input-text">
                <Text name={'type_length'} value={values.type_length} onChange={onChange} />
              </div>
            </div>
          </div>
          <div className="frow">
            <div className="flabel">
              Input Default Veri
            </div>
            <div className="fval">
              <div className="input-text">
                <Text name={'type_default_value'} value={values.type_default_value} onChange={onChange} />
              </div>
            </div>
          </div>



          <div className="frow fsubmit">
            <div className="flabel">&nbsp;</div>
            <div className="fval">
              <div className="buttons">
                <button type="submit" className="form-submit-ok">Kaydet</button>
                <button className="form-iptal-btn" onClick={formCancel}>İptal</button>
              </div>
            </div>
            
            
          </div>
        </form>
      </div>
      
    </div>
  )
}
