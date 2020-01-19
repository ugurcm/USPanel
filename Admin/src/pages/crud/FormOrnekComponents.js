import React, {useState, useContext, useEffect} from 'react';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';

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



export default function CrudForm (props) {
  const appContext = useContext(AppContext);

  const [pageData, setPageData] = useState({
    panelTable: "Şubeler",
  });
  const [values, setValues] = useState({
    baslik: '',
    telefon: '',
    konumCheckboxes:{
      "konum-sol": false,
      "konum-sag": false,
      "konum-alt": false
    },
    durumu: false,
    firmaTuru: 'tuzel',
    islemTipi: '',
    subelerUpload: [
      {name: "Dosya 1", value:"myfile1.pdf"},
      {name: "Dosya 2", value:"myfile2.pdf"},
      {name: "Dosya 3", value:"myfile3.pdf"},
    ],
    sayfalarUpload: []
  });
  
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
  }

  const konumCheckboxes = [
    {
      name: "konum-sol",
      label: "Konum Sol",
      checked: true,
    },
    {
      name: "konum-sag",
      label: "Konum Sağ",
      checked: false,
    },
    {
      name: "konum-alt",
      label: "Konum Alt Menü",
      checked: true,
    },
  ]
  const islemTipiList = [
    {
      value: 'doga',
      name: 'Doğa Kategorisi'
    },
    {
      value: 'sehir',
      name: 'Şehir Kategorisi'
    },
    {
      value: 'tarih',
      name: 'Tarih Kategorisi'
    }

  ];

  const uploadCompChange = (compName, gelen, type, selectedItem = 0) => {
    var isim = 'telefon';
    let news = values[compName];
    if(type == 'add'){
      news.push({name:gelen['name'], value:gelen['filename']})
    }
    if(type == 'update'){
      //news.push({name:gelen['name'], value:gelen['filename']})
      //console.log("update loll" + selectedItem);
      news[selectedItem] = gelen;
    }
    
    setValues({...values, [compName]: news});
  }
  const listSortEnd = (compName, newData) => {
    //console.log(compName);
    setValues({...values, [compName]: newData});
    
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

          <div className="frow">
            <div className="flabel">
              Dosya Yükleme Şubeler
            </div>
            <div className="fval">
              <UploadComp 
                compName={'subelerUpload'}
                url={appContext.api_url + 'ApiUser/fileUploadChunk'} 
                uploadFolderName={'subeler'} 
                uploadCompChange={uploadCompChange} 
                uploadListData={values.subelerUpload}
                listSortEnd={listSortEnd}
                maxFiles={50}
                />
            </div>
          </div>

          <div className="frow">
            <div className="flabel">
              Dosya Yükleme Sayfalar
            </div>
            <div className="fval">
              <UploadComp 
                compName={'sayfalarUpload'}
                url={appContext.api_url + 'ApiUser/fileUploadChunk'} 
                uploadFolderName={'sayfalar'} 
                uploadCompChange={uploadCompChange} 
                uploadListData={values.sayfalarUpload}
                listSortEnd={listSortEnd}
                maxFiles={1}
                />
            </div>
          </div>

          <div className="frow">
            <div className="flabel">
              Başlık
            </div>
            <div className="fval">
              <div className="input-text">
                <Text name={'baslik'} value={values.baslik} onChange={onChange} />
              </div>
              
            </div>
          </div>
          <div className="frow">
            <div className="flabel">
              Telefon
            </div>
            <div className="fval">
              <div className="input-text">
                <Text name={'telefon'} value={values.telefon} onChange={onChange} />
              </div>
            </div>
          </div>
          <div className="frow">
            <div className="flabel">
              Checkbox Multi
            </div>
            <div className="fval">
              <CheckboxGroup checkBoxes={konumCheckboxes} onChange={e=> onCheckboxGroupChange(e, 'konumCheckboxes')} value={values.konumCheckboxes}/>
            </div>
          </div>
          <div className="frow">
            <div className="flabel">
              Checkbox Single
            </div>
            <div className="fval">
              <Checkbox name={'durumu'} value={values.durumu} onChange={onChange} label={'Durumu'}/>
            </div>
          </div>

          <div className="frow">
            <div className="flabel">
              Radio Firma Türü
            </div>
            <div className="fval">
              <Radio name={'firmaTuru'} value={'ozel'} checkedValue={values.firmaTuru} onChange={onChange} label={'Özel Firma'}/>   
              <Radio name={'firmaTuru'} value={'tuzel'} checkedValue={values.firmaTuru} onChange={onChange} label={'Tüzel Firma'}/>          
            </div>
          </div>


          <div className="frow">
            <div className="flabel">
              Select İşlem Tipi
            </div>
            <div className="fval">
              <Select name={'islemTipi'} inputList={islemTipiList} value={values.islemTipi} onChange={onChange}  />
            </div>
          </div>


          <div className="frow fsubmit">
            <div className="flabel">&nbsp;</div>
            <div className="fval">
              <div className="buttons">
                <button type="submit" className="form-submit-ok">Kaydet</button>
                <button className="form-iptal-btn">İptal</button>
              </div>
            </div>
            
            
          </div>
        </form>
      </div>
      
    </div>
  )
}
