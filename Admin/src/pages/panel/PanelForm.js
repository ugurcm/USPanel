import React, {useState, useContext, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import Swal from 'sweetalert2';
import queryString from 'query-string';

import AppContext from '../../context/AppContext';
import doAjax from '../../libraries/doAjax';
import Text from '../../components/form/Text'
import Checkbox from '../../components/form/Checkbox';
import CheckboxGroup from '../../components/form/CheckboxGroup';
import Radio from '../../components/form/Radio';
import Select from '../../components/form/Select';
import UploadComp from '../../components/form/UploadComp'
//import Dropzone from 'react-dropzone-uploader'
import Modal from '../../components/form/Modal'
import ParentComp from '../../components/form/ParentComp';
import FormButton from '../../components/form/FormButton';



export default function CrudForm (props) {
  const appContext = useContext(AppContext);

   
  const [pageData, setPageData] = useState({
    panelTable: "Panel Sayfası",
  });
  const [tableName, setTableName] = useState('panel_table')
  const [formId, setFormId] = useState(0);
  const [formType, setFormType] = useState('add');
  const [values, setValues] = useState({
    title: '',
    parent: 0,
    parent_path: ["0"],
    has_table : 1,
    language_active : 0,
    component_name: '',
    icon: '',
    list_type: 2,
    show_sidebar: 1,
    order_column: 'id',
    order_type: 'asc',
    order_drag: 0,
    drag_column: ''
  });
  
  const [parentPathList, setParentPathList ] = useState([]);
  const [pageReady, setPageReady] = useState(0);
  const [formLock, setFormLock] = useState(0);


  

  useEffect(()=>{
    const parsed = queryString.parse(location.search);
    
    if(parsed.id){
      setFormType('update');
      setFormId(parsed.id);
      const data = doAjax(
        appContext.api_url + 'Admin/Panel/getFormData',
        'GET',
        {id: parsed.id, parent: parsed.parent}
      );
      data.then((res)=>{
        const gelen = JSON.parse(res);
        if(gelen.formData){
          if(!gelen.formData.parent_path){
            gelen.formData.parent_path = ["0"];
          }
          setValues(gelen.formData);
          setPageReady(1);
        }
      })
    }
    if(parsed.parent){
      //console.log("parent var");
      const data = doAjax(
        appContext.api_url + 'Admin/Panel/getParentPath',
        'GET',
        {parent: parsed.parent}
      );
      data.then((res)=>{
        //console.log(res);
        const gelen = JSON.parse(res);
        if(gelen.formData.parentPath){
          console.log(gelen.formData.parentPath);
          
          setValues({...values, parent_path: gelen.formData.parentPath, parent: parsed.parent});
          setPageReady(1);
        }
      })

    }else if(!parsed.id){
      setPageReady(1);
    }
    if(!parsed.id && !parsed.parent){
      setPageReady(1);
    }

  },[])
  
  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    //console.log(e.target.name);  
    setValues({...values, [e.target.name]: value});
  }
  const formSubmit = (e) => {
    e.preventDefault();

    if(formLock == 1){return false;}
    setFormLock( x => x = 1);
    
    const data = doAjax(
      appContext.api_url + 'Admin/Panel/saveForm',
      'POST',
      {formData: values, formType: formType, formId: formId}
    );
    data.then((res)=>{
      //console.log(res);
      //return false;

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
          let yonlendirilecekUrl = 'panel';
          if(values.parent > 0){
            yonlendirilecekUrl += '?id=' + values.parent;
          }
          props.history.push(yonlendirilecekUrl);          
          //props.history.push('Panel');
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
  const onChangeParent = (e, index) => {
    let value = e.target.value;
    const newArr = [...values.parent_path];
    newArr.length = index + 1;
    //console.log(value)
    if(value){
      newArr.push(value);
      /*console.log("ekledik");
      console.log(newArr);*/
    }
    if(newArr[newArr.length-1] == 0 && newArr.length > 1 ){
      /*console.log("evet burası");
      console.log(newArr);
      console.log(newArr.length);
      console.log(newArr[newArr.length-1]);*/
      newArr.splice(-1,1);
      /*console.log(newArr);
      console.log(value);*/
    }
    if(value == 0){
      value = newArr[newArr.length-1];
    }
    setValues({...values, parent_path: newArr, parent: value});
  }

  return (
    <div className="page-content">      
      <div className="page-title">
        <div className="icon">
          <i className="fa fa-user"></i>
        </div>
        <div className="desc">{pageData.panelTable} - Ekle/Düzenle</div>
      </div>
      
      <div className="form-cont">
        <form action="" method="POST" onSubmit={e=>formSubmit(e)} autoComplete="off">
          <input type="hidden" name={'parent'} value={values.parent} />
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

          {<div className="frow">
            <div className="flabel">
              Üst Kategori
            </div>
            <div className="fval">
              <div className="input-text">
                <ParentComp parentPath={values.parent_path} onChangeParent={onChangeParent} pageReady={pageReady} formId={formId} />
              </div>              
            </div>
          </div>}


          <div className="frow">
            <div className="flabel">
              Tablo Var mı?
            </div>
            <div className="fval">
              <div className="radio-cont">
                <Radio name={'has_table'} value={'1'} checkedValue={values.has_table} onChange={onChange} label={'Var'}/> 
                <Radio name={'has_table'} value={'0'} checkedValue={values.has_table} onChange={onChange} label={'Yok'}/>   
                   
              </div>      
            </div>
          </div>

          <div className="frow">
            <div className="flabel">
              Dil Seçimi
            </div>
            <div className="fval">
              <div className="radio-cont">
                <Radio name={'language_active'} value={'0'} checkedValue={values.language_active} onChange={onChange} label={'Pasif'}/>   
                <Radio name={'language_active'} value={'1'} checkedValue={values.language_active} onChange={onChange} label={'Aktif'}/>    
              </div>      
            </div>
          </div>

          <div className="frow">
            <div className="flabel">
              Özel Bileşen Adı
            </div>
            <div className="fval">
              <div className="input-text">
                <Text name={'component_name'} value={values.component_name} onChange={onChange} />
              </div>              
            </div>
          </div>

          <div className="frow">
            <div className="flabel">
              İkon Adı
            </div>
            <div className="fval">
              <div className="input-text">
                <Text name={'icon'} value={values.icon} onChange={onChange} />
              </div>              
            </div>
          </div>

          <div className="frow">
            <div className="flabel">
              Ana Kategorimi (Başlık Alanı)
            </div>
            <div className="fval">
              <div className="radio-cont">
                <Radio name={'list_type'} value={'2'} checkedValue={values.list_type} onChange={onChange} label={'Hayır'} />    
                <Radio name={'list_type'} value={'1'} checkedValue={values.list_type} onChange={onChange} label={'Evet'} />   
              </div>      
            </div>
          </div>

          <div className="frow">
            <div className="flabel">
              Sidebarda Görünüm
            </div>
            <div className="fval">
              <div className="radio-cont">
                <Radio name={'show_sidebar'} value={'1'} checkedValue={values.show_sidebar} onChange={onChange} label={'Evet'}/>   
                <Radio name={'show_sidebar'} value={'0'} checkedValue={values.show_sidebar} onChange={onChange} label={'Hayır'}/>    
              </div>      
            </div>            
          </div>

          <div className="frow">
            <div className="flabel">
              Sıralama Kolonu
            </div>
            <div className="fval">
              <div className="input-text">
                <Text name={'order_column'} value={values.order_column} onChange={onChange} />
              </div>              
            </div>
          </div>
          <div className="frow">
            <div className="flabel">
              Sıralama Türü
            </div>
            <div className="fval">
              <div className="input-text">
                <Text name={'order_type'} value={values.order_type} onChange={onChange} />
              </div>              
            </div>
          </div>

          <div className="frow">
            <div className="flabel">
              Sıralama Sürükleme Aktifmi
            </div>
            <div className="fval">
              <div className="radio-cont">
                <Radio name={'order_drag'} value={'0'} checkedValue={values.order_drag} onChange={onChange} label={'Hayır'}/>   
                <Radio name={'order_drag'} value={'1'} checkedValue={values.order_drag} onChange={onChange} label={'Evet'}/>    
              </div>      
            </div>            
          </div>


          <div className="frow">
            <div className="flabel">
              Drag Column
            </div>
            <div className="fval">
              <div className="input-text">
                <Text name={'drag_column'} value={values.drag_column} onChange={onChange} />
              </div>              
            </div>
          </div>
          

          <div className="frow fsubmit">
            <div className="flabel">&nbsp;</div>
            <div className="fval">
              <div className="buttons">
                <button type="submit" className="form-submit-ok">
                  <FormButton formLock={formLock} />
                </button>
                <button className="form-iptal-btn" onClick={formCancel}>İptal</button>
              </div>
            </div>
            
            
          </div>
        </form>
      </div>
      
    </div>
  )
}
