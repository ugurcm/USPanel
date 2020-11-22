import React, {useState, useContext, useEffect} from 'react';
import {useParams, Switch, Route} from 'react-router-dom';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';
import queryString from 'query-string';

import doAjax from '../../libraries/doAjax';

import Text from '../../components/form/Text'
import Textarea from '../../components/form/Textarea'
import Checkbox from '../../components/form/Checkbox';
import CheckboxGroup from '../../components/form/CheckboxGroup';
import Radio from '../../components/form/Radio';
import Select from '../../components/form/Select';
import UploadComp from '../../components/form/UploadComp'
//import Dropzone from 'react-dropzone-uploader'
import Modal from '../../components/form/Modal'
import CokluSecim from '../../components/form/CokluSecim';
import AltKategori from '../../components/form/AltKategori';
import AktifPasif from '../../components/form/AktifPasif';
//import CrudFormLangTab from './CrudFormLangTab';

import Editor from '../../components/form/Editor';
import ResimTekli from '../../components/form/ResimTekli';

import ResimGaleri from '../../components/form/ResimGaleri';
import DosyaGaleri from '../../components/form/DosyaGaleri';
import DosyaTekli from '../../components/form/DosyaTekli';


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
  const [languages, setLanguages] = useState([]);
  const [cokluSelectList, setCokluSelectList ] = useState({});
  const [pageReady, setPageReady] = useState(0);
  const [values, setValues] = useState({});
  const [valuesLang, setValuesLang] = useState({});
  const [valuesEditor, setValuesEditor] = useState({});
  const [valuesEditorLang, setValuesEditorLang] = useState({});
  const [formAktifmi, setFormAktifmi] = useState(1);
  //const [parentCol, setParentCol] = useState({});
  const formComponents = {
    Text: Text,
    Textarea: Textarea,
    Select: Select,
    CokluSecim: CokluSecim,
    AltKategori: AltKategori,
    AktifPasif: AktifPasif,
    Editor: Editor,
    ResimGaleri: ResimGaleri,
    DosyaGaleri: DosyaGaleri,
    DosyaTekli: DosyaTekli,
    ResimTekli: ResimTekli,
  }

  
  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues({...values, [e.target.name]: value});
  }

  const onChangeEditor = (gelen) => {
    setValuesEditor({...valuesEditor, [gelen.name]: gelen.value})
  }
  useEffect(()=>{
    setValues({...values, ...valuesEditor})
  },[valuesEditor])

  const onChangeLangEditor = (e, languageId, slug) => {
    const value = e.value;
    let obj = {};
    obj[languageId] = {};
    obj[languageId][slug] = value;
    //console.log(obj);
    //setValuesEditorLang({...valuesEditorLang, ...obj})
    setValuesEditorLang({
      languageId: languageId,
      slug: slug,
      value: value
    })
  }
  useEffect(()=>{
    let langObj = {...valuesLang[valuesEditorLang.languageId]};
    langObj[valuesEditorLang.slug] = valuesEditorLang.value;
    setValuesLang({...valuesLang, [valuesEditorLang.languageId]: langObj });
  },[valuesEditorLang])
  const onChangeLang = (e, languageId, slug) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    let langObj = {...valuesLang[languageId]};
    langObj[slug] = value;
    setValuesLang({...valuesLang, [languageId]: langObj });
  }
  const onCheckboxGroupChange = (e , arrName = '') => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    let degisenCheckBoxes = values[arrName];
    degisenCheckBoxes[e.target.name] = value;
    setValues({...values, [arrName]: degisenCheckBoxes});
  }
  const onChangeParent = (e, index, secilenComp) => {
    let value = e.target.value;
    const newArr = [...values[secilenComp + '_path']];
    newArr.length = index + 1;
    if(value){
      newArr.push(value);
    }
    if(newArr[newArr.length-1] == 0 && newArr.length > 1 ){
      newArr.splice(-1,1);
    }
    if(value == 0){
      value = newArr[newArr.length-1];
    }
    setValues({...values, [secilenComp + '_path']: newArr, [secilenComp]: value});
  }
  const onChangeCoklu = (e, secilenIndex, crudColumn) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    if(!crudColumn.relation_panel_table_altkategori_slug){
      let copyCokluSelectList = {...cokluSelectList}
      copyCokluSelectList['item' + crudColumn['id']][secilenIndex].secilenItem = value;
      setCokluSelectList({...cokluSelectList, ...copyCokluSelectList})
    }else{  
      let copyCokluSelectList = {...cokluSelectList}
      copyCokluSelectList['item' + crudColumn['id']].length = secilenIndex + 1;
      copyCokluSelectList['item' + crudColumn['id']][secilenIndex].secilenItem = value;
      const data = doAjax(
        appContext.api_url + 'ApiCrudForm/getSubRowsList',
        'GET',
        {
          tableName: pageData.slug,
          crudColumn: crudColumn,
          relationSelectId: e.target.value,
        }
      );
      data.then((res)=>{
        const gelen = JSON.parse(res);
        if(value > 0){
          let eklenecekCokluSelectListItem = {
            secilenItem: 0,
            selectIcListe: gelen.altKategoriler
          }
          copyCokluSelectList['item' + crudColumn['id']].push(eklenecekCokluSelectListItem);
        }
        setCokluSelectList({...cokluSelectList, ...copyCokluSelectList})
      })
    }

  }
  const cokluSecimKaldir = (e, name, item) => {
    e.preventDefault();
    let cokluArrValue = [...values[name]];
    let newArr = cokluArrValue.filter((satir)=>{
      return satir.id != item.id
    })
    setValues({...values, [name]: newArr})
  }
  const cokluEkleUstKategoriKontrol = (secilenItem, crudColumn) => {
    const data = doAjax(
      appContext.api_url + 'ApiCrudForm/ustKategoriGetir',
      'GET',
      {crudColumn: crudColumn, secilenItem:secilenItem}
    );
    return data;
  }
  const cokluSecimItemEkle = (name, secilenItem, secilenItemText) => {
    let cokluArrValue = [...values[name]];   
    let secilenSatir = {
      id: secilenItem,
      title: secilenItemText
    }    
    if(values[name].length){
      if(!values[name].filter(function (satir) { return satir.id == parseInt(secilenItem) }).length && secilenItem > 0){
        cokluArrValue.push(secilenSatir)
        setValues({...values, [name]: cokluArrValue})

      }else{
        console.log("Bu item daha önce eklenmiş.");
      }
    }else{
      if(secilenItem > 0){
        cokluArrValue.push(secilenSatir)
        setValues({...values, [name]: cokluArrValue})
      
      }
    }
  }
  const cokluSecimEkle = async (e,name, secilenItem, secilenItemText, crudColumn) => {
    e.preventDefault();
    let copyCokluSelectList = cokluSelectList['item' + crudColumn['id']].map(a=>{return({...a})});  //seçilen kategorileri başa al.
    copyCokluSelectList.map(a=> a.secilenItem = 0);
    copyCokluSelectList.length = 1;
    setCokluSelectList({...cokluSelectList, ['item' + crudColumn['id']]: copyCokluSelectList})
    let eklenecekListe = [];
    if(crudColumn.relation_panel_table_altkategori_slug){ //üst kategorileri varmı kontrol, eğer varsa otomatik eklenecekler.
      let res = await cokluEkleUstKategoriKontrol(secilenItem, crudColumn);
      if(res){
        let gelen = JSON.parse(res);
        if(gelen.liste.length){
          gelen.liste.map((val,key)=>{
            eklenecekListe.push({
              id: val.id,
              title: val[crudColumn['relation_panel_table_column_slug']]
            })
          });
        }
      }
    }
    if(!crudColumn.relation_panel_table_altkategori_slug){
      eklenecekListe.push({
        id: secilenItem,
        title: secilenItemText
      })
    }
    let cokluArrValue = [...values[name]];  
    if(eklenecekListe){
      eklenecekListe.map((val,key) => {
        let secilenSatir = {
          id: val.id,
          title: val.title
        }    
        if(values[name].length && secilenItem > 0){
          if(!values[name].filter(function (satir) { return satir.id == secilenSatir.id }).length 
            ){
            cokluArrValue.push(secilenSatir);
          }else{
            console.log("Bu item daha önce eklenmiş.");
          }
        }else{
          console.log("alt eklendi");
          
          cokluArrValue.push(secilenSatir)       
        }       
      })
    }
    setValues({...values, [name]: cokluArrValue})
  }

  const formSubmit = (e) => {
    e.preventDefault();
    const data = doAjax(
      appContext.api_url + 'ApiCrudForm/saveForm',
      'POST',
      {
        formData: JSON.stringify(values), 
        formType: formType, 
        formId: formId, 
        tableSlug:pageData.slug, 
        crudColumns:crudColumns,
        langData: JSON.stringify(valuesLang),
        pageData: pageData,
      }
    );
    data.then((res)=>{
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
          let myParentColName = '';
          crudColumns.map((value, key)=>{
            if(value.panel_table_column_input_id == '8'){
              myParentColName = value.slug;
            }
          })
          if(values[myParentColName] > 0){
            yonlendirilecekUrl += '?id=' + values[myParentColName];
          }
          setFormAktifmi(0);
          props.history.push(yonlendirilecekUrl);
        }, 1500)
        
      }

      
    })
  }
  const formValuesInit = (crudColumns) => {
    const valuesInitObj = {};
    let cokluSelectListInit = {}
    crudColumns.map((value, key)=>{
      let ozelTanim = 0;
      if(value.form_type == 'Array'){  //çoklu seçimde array listesi alınıyor.
        ozelTanim = 1;
        valuesInitObj[value.slug] = [];
      }
      if(value.form_type == 'Array'){
        ozelTanim = 1;
        valuesInitObj[value.slug] = [];
      }
      if(value.panel_table_column_input_id == '13'){  //eğer çoklu file upload ise default sütunu açalım.
        ozelTanim = 1;
        valuesInitObj[value.slug + '_default'] = '';
      }

      if(value.panel_table_column_input_id == '8'){
        ozelTanim = 1;
        valuesInitObj[value.slug + '_path'] = ["0"];
      }
      if(value.panel_table_column_input_id == '17'){        
        cokluSelectListInit["item" + [value.id]] = [{
          secilenItem: 0,
          selectIcListe: value.relationList
        }];
        valuesInitObj[value.slug] = [];
      }
      if(ozelTanim == 0){
        valuesInitObj[value.slug] = '';
      }
      
    })
    //console.log(cokluSelectListInit);
    setCokluSelectList({...cokluSelectList, ...cokluSelectListInit})
    //console.log(valuesInitObj);
    //console.log("init oldu");
    
    setValues(valuesInitObj);
    
  }
  const editFormLoadData = () => {
    const parsed = queryString.parse(location.search);
    let yuklemeOk = 0;
    if(parsed.id){
      setFormType('update');
      setFormId(parsed.id);
      yuklemeOk = 1;
      const data = doAjax(
        appContext.api_url + 'ApiCrudForm/getFormData',
        'POST',
        {id: parsed.id, tableSlug: slug}
      );
      data.then((res)=>{
        const gelen = JSON.parse(res);
        if(gelen.formData){
          setValues(gelen.formData);
          setValuesLang(gelen.lang);
          setPageReady(1);
        }
      })
    }
    if(parsed.parent){
      yuklemeOk = 1;
      setPageReady(1);
    }
    if(yuklemeOk == 0){
      setPageReady(1);
    }
  }
  const parentDataLoad = () => {
    const parsed = queryString.parse(location.search);
    if(parsed.parent){
      const data = doAjax(
        appContext.api_url + 'ApiCrudForm/getParentPath',
        'POST',
        {parent: parsed.parent, pageData:pageData, crudColumns: crudColumns}
      );
      data.then((res)=>{
        const gelen = JSON.parse(res);
        let myParentCol = gelen.parentCol;
        if(gelen.formData[myParentCol.slug + '_path']){
          setValues({...values, [myParentCol.slug + '_path']: gelen.formData[myParentCol.slug + '_path'], [myParentCol.slug]: parsed.parent});
          setPageReady(1);
        }
      })
    }
  }

  useEffect(()=>{
    if(crudColumns.length && pageReady == 1){
      parentDataLoad();
    }
  },[pageData, crudColumns, pageReady])
  
  useEffect(()=>{
    const data = doAjax(
      appContext.api_url + 'ApiCrudForm/getCrudData',
      'GET',
      {tableSlug: pageData.slug,}
    );
    data.then((res) => {
      const gelen = JSON.parse(res);
      //console.log(gelen)
      setLanguages(gelen.languages);
      setPageData(gelen.pageData);
      setCrudColumns(gelen.crudColumns);
      formValuesInit(gelen.crudColumns);
      setValuesLang(gelen.lang);
      editFormLoadData();
    })
  },[])

  const uploadCompChange = (compName, gelen, type, selectedItem = 0) => {
    if(values.hasOwnProperty(compName)){
      let news = values[compName];
      if(type == 'add'){
        news.push({name:gelen['name'], value:gelen['filename']})
      }
      if(type == 'update'){
        news[selectedItem] = gelen;
      }
      setValues(currentValues => ({...currentValues, [compName]: news}))
    }
  }
  const uploadCompChangeOneFile = (compName, gelen) => {
    setValues(currentValues => ({...currentValues, [compName]: gelen.filename}))
  }

  const listSortEnd = (compName, newData) => {
    setValues({...values, [compName]: newData});
  }

  const uploadDeleteItem = (props) => {
    const {compName,itemKey} = props;
    let fakeValuesCompName = [...values[compName]];
    fakeValuesCompName.splice(itemKey,1);
    setValues(currentValues => ({...currentValues, [compName]: fakeValuesCompName}));
  }
  const uploadMakeDefault = (props) => {
    const {compName,itemKey} = props;
    let fakeValuesCompName = [...values[compName]];
    setValues(currentValues => ({...currentValues, [compName + '_default']: fakeValuesCompName[itemKey].value}));
  }
  const setMyValueEmpty = (props) => { 
    const {e, compName, myValue} = props;
    e.preventDefault();
    setValues(currentValues => ({...currentValues, [compName]: ''}));
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
        <div className="desc">{pageData.title} - Ekle/Düzenle</div>
      </div>
      
      <div className="form-cont">
        <form action="" method="POST" onSubmit={e=>formSubmit(e)} autoComplete="off">
          {pageData.language_active == 1?
            <CrudFormLangTab languages={languages} crudColumns={crudColumns} onChangeLang={onChangeLang} formComponents={formComponents} values={values} valuesLang={valuesLang} onChangeLangEditor={onChangeLangEditor} pageReady={pageReady} />
          :null }
          {crudColumns.map((item, key)=>{
            const SecilenComponent = formComponents[item.componentName];
            if(item.language_active == 0){
              return(
                <div key={key} className="frow">
                  <div className="flabel">
                    {item.title}
                  </div>
                  <div className="fval">
                    <div className="input-text">                  
                      <SecilenComponent 
                      item={item}
                      componentId={item.id} 
                      name={item.slug} 
                      value={values[item.slug] || ''} 
                      onChange={onChange} 
                      onChangeEditor={onChangeEditor} 
                      formAktifmi={formAktifmi} 
                      inputList={item.relationList}
                      itemKeyValue="id" 
                      itemKeyName={item.relation_panel_table_column_slug} 
                      hasDefault={1} 
                      cokluSecimEkle={cokluSecimEkle} 
                      cokluSecimKaldir={cokluSecimKaldir} 
                      cokluSelectList={cokluSelectList} 
                      onChangeCoklu={onChangeCoklu} 
                      parentPath={values[item.slug + '_path']} 
                      pageReady={pageReady} 
                      pageData={pageData} 
                      altKategoriSlug={item.altkategori_slug} 
                      valueSlug={item.slug} 
                      onChangeParent={onChangeParent} 
                      crudColumn={item}
                      compName={item.slug}
                      url={appContext.api_url + 'ApiUser/fileUploadChunk'} 
                      uploadFolderName={item.slug} 
                      uploadCompChange={uploadCompChange} 
                      uploadListData={values[item.slug]}
                      listSortEnd={listSortEnd}
                      maxFiles={50}
                      uploadDeleteItem={uploadDeleteItem}
                      uploadMakeDefault={uploadMakeDefault}
                      uploadCompChangeOneFile={uploadCompChangeOneFile}
                      setMyValueEmpty={setMyValueEmpty}
                      values={values}
                      appContext={appContext}
                      />
                    </div>
                    
                  </div>
                </div>
              )
            }
          })}
          <div className="frow fsubmit">
            <div className="flabel">&nbsp;</div>
            <div className="fval">
              <div className="buttons">
                <button type="submit" className="form-submit-ok">Kaydet</button>
                <button type="button" className="form-iptal-btn" onClick={formCancel}>İptal</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
