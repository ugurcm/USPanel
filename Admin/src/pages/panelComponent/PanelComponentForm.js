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
import {pageLoad} from './compForm/PageLoad';
import formSubmit from './compForm/formSubmit';

import RowInputText from './compForm/RowInputText';
import RowInputSelect from './compForm/RowInputSelect';
import RowInputRadio from './compForm/RowInputRadio';

import RowInputAltKategori from './compForm/RowInputAltKategori';
import queryString from 'query-string';



export default function PanelComponentForm (props) {
  const appContext = useContext(AppContext);
  const [pageTitle, setPageTitle] = useState('Tablo Düzenleme');
  const [formId, setFormId] = useState(0);
  const [formType, setFormType] = useState('add');
  const [pageReady, setPageReady] = useState(0);
  const [values, setValues] = useState({
    panel_id: 0,
    title: '',
    slug: '',
    component_id: 1,    //default input text secilsin
    column_type_id: 1,  //default varchar secilsin
    type_length: '',
    target_table:'',
    target_table_title: '',
    target_table_secilen_kolon: '',
    type_default_value: '',
    show_in_crud: 1,
    form_edit: 1,
    
  });
  const [panel, setPanel] = useState({});
  const [componentList, setComponentList] = useState([]);
  const [columnTypeList,setColumnTypeList] = useState([]);


  useEffect(()=>{
    const parsed = queryString.parse(location.search);
    pageLoad({appContext, parsed, setFormType, setFormId, values, setValues,setPanel,setPageTitle,setComponentList,setColumnTypeList,setPageReady});
  },[])
  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues({...values, [e.target.name]: value});
  }
  const formCancel = (e) => {
    e.preventDefault();
    //props.history.goBack();
    console.log(values);
    console.log(formType);
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
        <form action="" method="POST"  autoComplete="off" onSubmit={(e)=>formSubmit({appContext, e, values, formType, props})}>
          <input type="hidden" name="panel_table_id" value={values.panel_table_id} />
                    
          <RowInputText values={values} label={'Başlık'} slug={'title'} onChange={onChange} />
          <RowInputText values={values} label={'Başlık Slug (Opsionel)'} slug={'slug'} onChange={onChange} />


          <RowInputSelect values={values} label={'Component Türü'} slug={'component_id'} onChange={onChange} 
            inputList={componentList} itemKeyValue={'id'} itemKeyName={'title'} hasDefault={0} defaultValue={1}
           />
          {values.component_id == 2 ? <RowInputText values={values} label={'Alt Kategori Tablo Başlık Kolonu'} slug={'target_table_title'} onChange={onChange} />:null}
          {values.component_id == 3 ? 
          <div>
            <RowInputText values={values} label={'Bağlantı Kurulacak Tablo Adı'} slug={'target_table'} onChange={onChange} />
            <RowInputText values={values} label={'Bağlantı Kurulacak Tablo Başlık Kolonu'} slug={'target_table_title'} onChange={onChange} />
          </div>
          :null}
          {values.component_id == 4 ? 
          <div>
            <RowInputText values={values} label={'Bağlantı Kurulacak Tablo Adı'} slug={'target_table'} onChange={onChange} />
            <RowInputText values={values} label={'Bağlantı Kurulacak Tablo Başlık Kolonu'} slug={'target_table_title'} onChange={onChange} />
            <RowInputText values={values} label={'Bağlantı Kurulacak Tablo Seçilen Alt Kategori Kolonu'} slug={'target_table_secilen_kolon'} onChange={onChange} />
          </div>
          :null}
        

          <RowInputSelect values={values} label={'Mysql Column Type'} slug={'column_type_id'} onChange={onChange} 
            inputList={columnTypeList} itemKeyValue={'id'} itemKeyName={'title'} hasDefault={0} defaultValue={1}
          />
          <RowInputText values={values} label={'Mysql Veri Uzunluğu'} slug={'type_length'} onChange={onChange} />
          <RowInputText values={values} label={'Mysql Default Veri'} slug={'type_default_value'} onChange={onChange} />

          <RowInputRadio values={values} label={'Crudda Gözüksün mü?'} slug={'show_in_crud'} onChange={onChange} radioList={[{label:'Hayır Gözükmesin', value: 0}, {label:'Evet Gözüksün', value: 1}]} />
          
          <RowInputRadio values={values} label={'Formda Gözüksün mü?'} slug={'form_edit'} onChange={onChange} radioList={[{label:'Hayır Gözükmesin', value: 0}, {label:'Evet Gözüksün', value: 1}]} />

          
          
  


          
          <div className="frow fsubmit">
            <div className="flabel">&nbsp;</div>
            <div className="fval">
              <div className="buttons">
                <button type="submit" className="form-submit-ok" >Kaydet</button>
                <button className="form-iptal-btn" onClick={formCancel} >İptal</button>
              </div>
            </div>
          </div>

        </form>
      </div>
      
    </div>
  )
}



