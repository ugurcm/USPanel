import React, {useState, useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import queryString from 'query-string';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';

import doAjax from '../../libraries/doAjax';
import TableRows from '../crud/TableRows';
import TableControls from '../crud/TableControls'
//import TableRows from '../crud/TableRows'


export default function Language (props) {
  const appContext = useContext(AppContext);
  const [pageId, setPageId] = useState('');
  const [formLink, setFormLink] = useState('LanguageForm');
  const [pageReady, setPageReady] = useState(0);


  const [pageData, setPageData] = useState({
    title: 'Dil Yönetimi',
    slug: 'language',
  })
  const [tableName, setTableName] = useState('language')

  const [crudData, setCrudData] = useState({
    crudColumns: [
      {title: 'ID', slug:'id'},
      {title: 'Başlık', slug:'title'},
      {title: 'Code', slug:'code'},
      {title: 'Durumu', slug:'status', listComponent: 'AktifPasif'},
      {title: 'Düzenle'}
    ],
    //crudColumnSlugs: [],
    sayfaNo: 1, 
    kacar: 15,
    nereden: 0,
    sayfaSayisi: 0,
    toplam: 0,
  })
  const [crudList, setCrudList] = useState([])

   

  useEffect(()=>{
    /*const data = doAjax(
      appContext.api_url + 'ApiPanel/getCrudDataDynamic',
      'GET',
      {tableSlug: pageData.slug,crudData: crudData}
    );
    data.then((res)=>{
      //console.log(res);
      //return false;
      
      const gelen = JSON.parse(res);
      //console.log(gelen.crudData);
      //setPageData(gelen.pageData);
      setCrudData(
        {...crudData, 
          crudColumns: gelen.crudData.crudColumns,
          //crudColumnSlugs:gelen.crudData.crudColumnSlugs 
        }
      );
    })*/
    
  },[]);
  const refreshTable = () => {
    if(pageReady == 1 && crudData.crudColumns.length){
      const data = doAjax(
        appContext.api_url + 'ApiPanel/getCrudListDynamic',
        'GET',
        {
          pageId: pageId, 
          table: pageData.slug,
          sayfaNo: crudData.sayfaNo,
          kacar: crudData.kacar,
          crudColumns: (crudData.crudColumns),
          nereden: crudData.nereden,
          sayfaSayisi: crudData.sayfaSayisi,
          toplam: crudData.toplam,
        }
      );
      data.then((res)=>{
        //console.log(res);
        
        const gelen = JSON.parse(res);
        setCrudList(gelen.crudList)
        setCrudData({...crudData, ...gelen.crudData})       
      })
    }
  }
  const yenile = (e) => {
    e.preventDefault();
    refreshTable();
  }
  const yukari = (e) => {
    e.preventDefault();
    const data = doAjax(
      appContext.api_url + 'ApiPanel/findPageParent',
      'GET',{pageId: pageId, table: pageData.slug }
    );
    data.then((res)=>{
      //console.log(res);      
      const gelen = JSON.parse(res);
      //console.log(gelen);
      if(gelen.secilenPage){
        let yonlendirilecekUrl = 'Panel';
        let panelFormLinki = 'PanelForm';
        if(gelen.secilenPage.parent > 0){
          yonlendirilecekUrl += '?id=' + gelen.secilenPage.parent;
          panelFormLinki += 'PanelForm?parent=' + gelen.secilenPage.parent;
        }
        //setPageId(gelen.secilenPage.parent);
        setFormLink(panelFormLinki);
        props.history.push(yonlendirilecekUrl);
      }
      
      //setPageData({ ...pageData, crudData: gelen.crudData});
    })
  }
  useEffect(()=>{
    const parsed = queryString.parse(location.search);
    if(!parsed.id){
      setPageReady(1);
      setPageId(0);
    }
    if(parsed.id){
      setPageReady(1);
      setPageId(parsed.id);
      setFormLink('PanelForm?parent=' + parsed.id);
    }
  })
  useEffect(()=>{
    refreshTable();
  },[crudData.sayfaNo, crudData.kacar, crudData.crudColumns, pageId]);

  const crudGoNextPage = () => {
    if(crudData.sayfaNo < crudData.sayfaSayisi){
      setCrudData({...crudData, sayfaNo: crudData.sayfaNo + 1})
    }
  }
  const crudGoPrevPage = () => {
    if(crudData.sayfaNo > 1){
      setCrudData({...crudData, sayfaNo: crudData.sayfaNo - 1})
    }
  }
  const crudGoLastPage = () => {
    setCrudData({...crudData, sayfaNo: crudData.sayfaSayisi})
  }
  const crudGoFirstPage = () => {
    setCrudData({...crudData, sayfaNo: 1})
  }
  const crudSayfaNoChange = (e) => {
    setCrudData({...crudData, sayfaNo: parseInt(e.target.value) })
  }
  const kacarChange = (e) => {
    setCrudData({...crudData, kacar: parseInt(e.target.value), sayfaNo: 1 })
  }
  const CrudColumns = (props) => {
    const items = props.crudData.crudColumns.map((value, key)=>
      <th key={key}>{value.title}</th>
    );
    return(
      <tr>{items}</tr>
    )
  }
  const deleteRow = (e, itemId) => {
    e.preventDefault();
    let c = confirm('Tablo ve içindeki tüm veriler silinecek. Emin misiniz?');
    if(!c) return false;
    const data = doAjax(
      appContext.api_url + 'ApiPanel/deleteRowDynamic',
      'POST',
      {
        tableName: tableName,
        itemId: itemId
      }
    );
    data.then((res)=>{
      //console.log(res);      
      const gelen = JSON.parse(res);
      if(gelen.sonuc == 'ok'){
        Swal.fire({
          icon: 'success',
          title: 'İşlem Başarılı',
          text: gelen.aciklama,
          showConfirmButton: false,
          allowOutsideClick: false,
          timer:1000
        })
        refreshTable()
      }
    })
  }

  
  const tableRowButtons = [
    {
      name: 'Düzenle',
      type: 'LinkWidthId',
      link: '/LanguageForm',
      icon: 'far fa-edit'
    },
    {
      name: 'Sil',
      type: 'ClickEvent',
      link: '',
      icon: 'fa fa-times',
      eventFunction: deleteRow
    }
  ]

  
  return (
    <div className="page-content">      
      <div className="page-title">
        <div className="icon">
          <i className="fa fa-user"></i>
        </div>
        <div className="desc">{pageData.title}</div>
      </div>
      <div className="page-filter"></div>
      <div className="page-list">
        <div className="list-control">
          <div className="control-left">
            <a href="#" onClick={yenile} className="refreshBtn">Yenile</a>
            <Link to={formLink} className="addBtn">Ekle</Link>
            {(pageId>0?<a href="#" onClick={yukari} className="refreshBtn">Yukarı Git</a>:null)}
            
          </div>
          <div className="control-right">
            <TableControls crudData={crudData} 
              kacarChange={kacarChange} 
              crudGoFirstPage={crudGoFirstPage} crudGoPrevPage={crudGoPrevPage}
              crudGoNextPage={crudGoNextPage} crudGoLastPage={crudGoLastPage} 
              crudSayfaNoChange={crudSayfaNoChange}
            />  
          </div>
        </div>
        <div className="list-table">          
          <table>
            <thead>
              <CrudColumns crudData={crudData} />
            </thead>
            <tbody>      
              <TableRows crudList={crudList} crudData={crudData} deleteRow={deleteRow} tableRowButtons={tableRowButtons} tableName={tableName} />
            </tbody>
          </table>
        </div>

        <div className="list-control bottom">
          <div className="control-left">
            <a href="#" onClick={yenile} className="refreshBtn">Yenile</a>
            <Link to={formLink} className="addBtn">Ekle</Link>
          </div>
          <div className="control-right">
            <TableControls crudData={crudData} 
              kacarChange={kacarChange} 
              crudGoFirstPage={crudGoFirstPage} crudGoPrevPage={crudGoPrevPage}
              crudGoNextPage={crudGoNextPage} crudGoLastPage={crudGoLastPage} 
              crudSayfaNoChange={crudSayfaNoChange}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
