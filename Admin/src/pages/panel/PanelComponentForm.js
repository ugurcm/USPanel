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
  const [tableName, setTableName] = useState('panel_table_column');
  const [pageReady, setPageReady] = useState(0);
  const [values, setValues] = useState({
    panel_table_id: 0,
    title: '',
    panel_table_column_input_id: '',
    panel_table_column_type_id: '',
    type_length: '',
    type_default_value: '',
    show_in_crud: 0,
    relation_type_id: 0,
    relation_panel_table_id: 0,
    relation_panel_table_column_slug: '',
    relation_panel_table_altkategori_slug: '',
    altkategori_slug:'',
    form_type: '',
    language_active: 0,
    slug_kolon: '',
    edit_form: 0,
  });
  const [panelTable, setPanelTable] = useState({});
  const [panelTableColumnInputs, setPanelTableColumnInputs] = useState([]);
  const [panelTableColumnTypes, setPanelTableColumnTypes] = useState([]);
  const [componentRelationTypes, setComponentRelationTypes] = useState([]);

  const [panelTableList, setPanelTableList] = useState([]);
  const [panelTableComponentList, setPanelTableComponentList] = useState([]);
  const [altKategoriSlugList, setAltKategoriSlugList] = useState([]);
  const [slugKolonList, setSlugKolonList] = useState([]);
  
  const [formVeriTipleri, setFormVeriTipleri] = useState([
    {id:'String','title':'String'},
    {id:'Int','title':'Int'},
    {id:'Array','title':'Array'},
    {id:'Object','title':'Object'},
  ])
  


  useEffect(()=>{
    const parsed = queryString.parse(location.search);
    let yuklemeOk = 0;
    if(parsed.id){
      setFormType('update');
      setFormId(parsed.id);
    }
    if(parsed.id || parsed.panelId){
      
      yuklemeOk = 1;
      const data = doAjax(
        appContext.api_url + 'ApiPanel/getFormDataPanelComponent',
        'GET',
        {id: parsed.id, panel_table_id: parsed.panelId}
      );
      data.then((res)=>{
        //console.log(res);
        const gelen = JSON.parse(res);
        if(gelen.formData){
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
        if(gelen.componentRelationTypes){
          setComponentRelationTypes(gelen.componentRelationTypes);
        }
        if(gelen.panelTableList){
          setPanelTableList(gelen.panelTableList);
        }
        setPageReady(1);
        //altKategoriSlugListesi();
        
      })
    }
    
    if(yuklemeOk == 0){
      setPageReady(1);
      //altKategoriSlugListesi();
    }

  },[])

  useEffect(()=>{
    //console.log("degistirrr");
    //console.log(values.relation_panel_table_id);
    
    if(values.relation_panel_table_id <= 0 ){
      setValues({...values, 'relation_panel_table_column_slug': '', 'relation_panel_table_altkategori_slug': ''});
      //return false;
      setPanelTableComponentList([])
    }
    if(values.relation_panel_table_id > 0){
      const data = doAjax(
        appContext.api_url + 'ApiPanel/getPanelTableRow',
        'GET',
        {panelTableId: values.relation_panel_table_id}
      );
      data.then((res)=>{
        //console.log(res);
        let gelen = JSON.parse(res);
        //console.log(gelen);
        setPanelTableComponentList(gelen)
      });

      

    }
    

  }, [values.relation_panel_table_id])
  useEffect(()=>{
    if(values.panel_table_column_input_id == 8){
      altKategoriSlugListesi(); 
    }
    if(values.panel_table_column_input_id == 20){ //slug ise
      slugKolonListesi();
    }
    
  }, [values.panel_table_column_input_id]);
  useEffect(()=>{
    if(values.panel_table_column_input_id == 8){
      altKategoriSlugListesi(); 
    }
    if(values.panel_table_column_input_id == 20){
      slugKolonListesi(); 
    }
  }, [pageReady]);

  const slugKolonListesi = () => {
    if(pageReady == 1){
      //console.log("slug liste yükle");
      const data = doAjax(
        appContext.api_url + 'ApiPanel/getSlugKolonListesi',
        'GET',
        {panelTableId: panelTable.id}
      );
      data.then((res)=>{
        //console.log(res);
        let gelen = JSON.parse(res);
        setSlugKolonList(gelen.slugKolonList);
        console.log(gelen);
        //setAltKategoriSlugList(gelen.parentPathList);
        //setPanelTableComponentList(gelen)
      });
    }
  }

  const altKategoriSlugListesi = () => {
    //console.log(pageReady);
    
    if(pageReady == 1){
      //console.log("slug liste yükle");
      const data = doAjax(
        appContext.api_url + 'ApiPanel/altKategoriSlugList',
        'GET',
        {panelTableId: panelTable.id}
      );
      data.then((res)=>{
        //console.log(res);
        let gelen = JSON.parse(res);
        //console.log(gelen);
        setAltKategoriSlugList(gelen.parentPathList);
        //setPanelTableComponentList(gelen)
      });
    }
    
    
  }
  //console.log(pageReady);
  
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
    //console.log(values);
    
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
              <Select name={'panel_table_column_input_id'} inputList={panelTableColumnInputs} value={values.panel_table_column_input_id} onChange={onChange} itemKeyValue="id" itemKeyName="title" hasDefault={1}/>
            </div>
          </div>
          {values.panel_table_column_input_id == '8'?
          <div className="frow">
            <div className="flabel">
              Alt Kategori Seçilen Kolon Title
            </div>
            <div className="fval">
              <Select name={'altkategori_slug'} inputList={altKategoriSlugList} value={values.altkategori_slug} onChange={onChange} itemKeyValue="slug" itemKeyName="title" hasDefault={1} defaultValue={''} /> 
            </div>
          </div>
          :''}
          {values.panel_table_column_input_id == 20 ? 
            <div className="frow">
              <div className="flabel">
                Slug Yapılacak Kolon
              </div>
              <div className="fval">
                <Select name={'slug_kolon'} inputList={slugKolonList} value={values.slug_kolon} onChange={onChange} itemKeyValue="slug" itemKeyName="title" hasDefault={1} defaultValue={''} /> 
              </div>
            </div>
          :''}

          <div className="frow">
            <div className="flabel">
              Input Veri Tipi Seçiniz
            </div>
            <div className="fval">
              <Select name={'panel_table_column_type_id'} inputList={panelTableColumnTypes} value={values.panel_table_column_type_id} onChange={onChange} itemKeyValue="id" itemKeyName="title" hasDefault={1} />
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

          <div className="frow">
            <div className="flabel">
              Çoklu Dil Aktif mi?
            </div>
            <div className="fval">
              <div className="radio-cont">
                <Radio name={'language_active'} value={0} checkedValue={values.language_active} onChange={onChange} label={'Hayır'}/>   
                <Radio name={'language_active'} value={1} checkedValue={values.language_active} onChange={onChange} label={'Evet'}/>    
              </div>   
            </div>
          </div>


          <div className="frow">
            <div className="flabel">
              Form Veri Tipi Seçiniz
            </div>
            <div className="fval">
              <Select name={'form_type'} inputList={formVeriTipleri} value={values.form_type} onChange={onChange} itemKeyValue="id" itemKeyName="title" hasDefault={1} />
            </div>
          </div>


          <div className="frow">
            <div className="flabel">
              Crudda Gözüksün mü?
            </div>
            <div className="fval">
              <div className="radio-cont">
                <Radio name={'show_in_crud'} value={'0'} checkedValue={values.show_in_crud} onChange={onChange} label={'Hayır - Gözükmesin'}/>   
                <Radio name={'show_in_crud'} value={'1'} checkedValue={values.show_in_crud} onChange={onChange} label={'Evet - Gözüksün'}/>    
              </div>      
            </div>
          </div>

          <div className="frow">
            <div className="flabel">
              Formda Gözüksün mü?
            </div>
            <div className="fval">
              <div className="radio-cont">
                <Radio name={'edit_form'} value={'0'} checkedValue={values.edit_form} onChange={onChange} label={'Hayır - Gözükmesin'}/>   
                <Radio name={'edit_form'} value={'1'} checkedValue={values.edit_form} onChange={onChange} label={'Evet - Gözüksün'}/>    
              </div>      
            </div>
          </div>


          <div className="frow">
            <div className="flabel">
              Tablo İlişki Türü
            </div>
            <div className="fval">
              <Select name={'relation_type_id'} inputList={componentRelationTypes} value={values.relation_type_id} onChange={onChange} itemKeyValue="id" itemKeyName="title" hasDefault={1} /> 
            </div>
          </div>

          {values.relation_type_id == 2 || values.relation_type_id == 3
          || values.relation_type_id == 4 ? 
            <div className="frow">
              <div className="flabel">
                Bağlantı Tablosu
              </div>
              <div className="fval">
                <Select name={'relation_panel_table_id'} inputList={panelTableList} value={values.relation_panel_table_id} onChange={onChange} itemKeyValue="id" itemKeyName="title" hasDefault={1} defaultValue={0} /> 
              </div>
            </div>
           : ''}
           {values.relation_panel_table_id > 0 ? 
            <div className="frow">
              <div className="flabel">
                Bağlantı Tablosu Seçilen Kolon
              </div>
              <div className="fval">
                <Select name={'relation_panel_table_column_slug'} inputList={panelTableComponentList} value={values.relation_panel_table_column_slug} onChange={onChange} itemKeyValue="slug" itemKeyName="title" hasDefault={1} defaultValue={''} /> 
              </div>
            </div>
           : ''}
           {values.relation_panel_table_id > 0 ? 
            <div className="frow">
              <div className="flabel">
                Bağlantı Tablosu Alt Kategori Kolonu
              </div>
              <div className="fval">
                <Select name={'relation_panel_table_altkategori_slug'} inputList={panelTableComponentList} value={values.relation_panel_table_altkategori_slug} onChange={onChange} itemKeyValue="slug" itemKeyName="title" hasDefault={1} defaultValue={''} /> 
              </div>
            </div>
           : ''}

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



