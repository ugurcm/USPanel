import React, {useState, useContext, useEffect} from 'react';
import {useParams, Switch, Route} from 'react-router-dom';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';
import queryString from 'query-string';

import doAjax from '../../libraries/doAjax';
import TableRows from './TableRows';
import TableControls from './TableControls'

import Text from '../../components/form/Text'
import Checkbox from '../../components/form/Checkbox';
import CheckboxGroup from '../../components/form/CheckboxGroup';
import Radio from '../../components/form/Radio';
import Select from '../../components/form/Select';
import UploadComp from '../../components/form/UploadComp'
//import Dropzone from 'react-dropzone-uploader'
import Modal from '../../components/form/Modal'



export default function CrudFormEdit (props) {
  const appContext = useContext(AppContext);
  let { slug } = useParams(); 
  //console.log(slug);
  //console.log(props);
  
  const [pageData, setPageData] = useState({
    title: '',
    slug: slug,
  })
  const [crudColumns, setCrudColumns] = useState([])
  const [formId, setFormId] = useState(0);
  const [formType, setFormType] = useState('add');
  const [parentPathList, setParentPathList ] = useState([]);
  const [pageReady, setPageReady] = useState(0);
  const [values, setValues] = useState({});



  
  const onChange = (e) => {
    //console.log(values)
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues({...values, [e.target.name]: value});
  }
  const onCheckboxGroupChange = (e , arrName = '') => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    let degisenCheckBoxes = values[arrName];
    degisenCheckBoxes[e.target.name] = value;
    setValues({...values, [arrName]: degisenCheckBoxes});
  }
  const formSubmit = (e) => {
    e.preventDefault();
    console.log(values);
    const data = doAjax(
      appContext.api_url + 'ApiCrudForm/saveForm',
      'POST',
      {formData: values, formType: formType, formId: formId, tableSlug:pageData.slug}
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
          let yonlendirilecekUrl = '/CrudList/' + pageData.slug;
          /*if(values.parent > 0){
            yonlendirilecekUrl += '?id=' + values.parent;
          }*/
          props.history.push(yonlendirilecekUrl);          
        }, 1500)
        
      }

      
    })
  }
  const formValuesInit = (crudColumns) => {
    const valuesInitObj = {};
    crudColumns.map((value, key)=>{
      valuesInitObj[value.slug] = '';
    })
    setValues(valuesInitObj);
  }

  const editFormLoadData = () => {
    const parsed = queryString.parse(location.search);
    if(parsed.id){
      setFormType('update');
      setFormId(parsed.id);
      const data = doAjax(
        appContext.api_url + 'ApiCrudForm/getFormData',
        'GET',
        {id: parsed.id, tableSlug: slug}
      );
      data.then((res)=>{
        const gelen = JSON.parse(res);
        if(gelen.formData){
          //console.log(gelen.formData);
          setValues(gelen.formData);
        }
      })
    }
  }
  useEffect(()=>{

    const data = doAjax(
      appContext.api_url + 'ApiCrudForm/getCrudData',
      'GET',
      {tableSlug: pageData.slug,}
    );
    data.then((res)=>{
      const gelen = JSON.parse(res);
      //console.log(gelen.crudData);
      setPageData(gelen.pageData);
      setCrudColumns(gelen.crudColumns);
      formValuesInit(gelen.crudColumns);

      editFormLoadData();
    })


    
    
  },[])
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
        <div className="desc">{pageData.title} - Ekle/Düzenle</div>
      </div>
      
      <div className="form-cont">
        <form action="" method="POST" onSubmit={e=>formSubmit(e)} autoComplete="off">

          {crudColumns.map((value, key)=>
            <div key={key} className="frow">
              <div className="flabel">
                {value.title}
              </div>
              <div className="fval">
                <div className="input-text">
                  <Text name={value.slug} value={values[value.slug] || ''} onChange={onChange} />
                </div>
                
              </div>
            </div>
          )}

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
