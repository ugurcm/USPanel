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
import ParentComp from '../../components/form/ParentComp';

import queryString from 'query-string';


export default function LanguageForm (props) {
  const appContext = useContext(AppContext);

  const [pageData, setPageData] = useState({
    panelTable: "Dil Sayfası",
  });
  
  const [tableName, setTableName] = useState('language')
  const [formId, setFormId] = useState(0);
  const [formType, setFormType] = useState('add');
  const [values, setValues] = useState({
    title: '',
    code: '',
    status: false,
  });
  const [parentPathList, setParentPathList ] = useState([]);
  const [pageReady, setPageReady] = useState(0);
  useEffect(()=>{
    const parsed = queryString.parse(location.search);
    if(parsed.id){
      setFormType('update');
      setFormId(parsed.id);
      const data = doAjax(
        appContext.api_url + 'ApiPanel/getFormDataDynamic',
        'GET',
        {tableName:tableName, id: parsed.id, parent: parsed.parent}
      );
      data.then((res)=>{
        //console.log(res);
        //return false;
        
        const gelen = JSON.parse(res);
        if(gelen.formData){
      
          setValues(gelen.formData);
          setPageReady(1);
        }
      })
    }
    if(parsed.parent){
      //console.log("parent var");
      const data = doAjax(
        appContext.api_url + 'ApiPanel/getParentPath',
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
    //console.log(values);
    
    //return false;
    const data = doAjax(
      appContext.api_url + 'ApiPanel/saveFormDynamic',
      'POST',
      {tableName: tableName, formData: JSON.stringify(values), formType: formType, formId: formId}
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
          let yonlendirilecekUrl = tableName;
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

          <div className="frow">
            <div className="flabel">
              Code
            </div>
            <div className="fval">
              <div className="input-text">
                <Text name={'code'} value={values.code} onChange={onChange} />
              </div>              
            </div>
          </div>

          <div className="frow">
            <div className="flabel">
              Durumu
            </div>
            <div className="fval">
              <div className="input-text">
                <Checkbox name={'status'} value={values.status} onChange={onChange} />
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
