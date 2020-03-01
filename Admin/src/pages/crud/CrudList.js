import React, {useState, useContext, useEffect} from 'react';
import {useParams, withRouter, Link} from 'react-router-dom';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';

import doAjax from '../../libraries/doAjax';
import TableRows from './TableRows';
import TableControls from './TableControls'
import queryString from 'query-string';


export default function CrudList (props) {
  const [pageId, setPageId] = useState(0);
  
  let { slug } = useParams();
  //console.log(slug);
  //console.log(slug);
  useEffect(()=>{
    const parsed = queryString.parse(location.search);
    if(!parsed.id){
      //setPageReady(1);
      setPageId(0);
      //console.log("sıfırlandı");
      
    }
    if(parsed.id){
      //setPageReady(1);
      setPageId(parsed.id);
      //setFormLink('PanelForm?parent=' + parsed.id);
    }
  })
  
  return(
    <CrudListComp slug={slug} pageId={pageId} history={props.history} />
  )
}

function CrudListComp (props) {

  const slug = props.slug;
  //console.log(slug);
  //return false;
  
  //let { slug } = useParams();  // props.match.params tada geliyor.
  //console.log(slug);
  // console.log(props);
  const [formLink, setFormLink] = useState('');
  const appContext = useContext(AppContext);
  const [pageReady, setPageReady] = useState(0);
  const [pageSlug, setPageSlug] = useState(0);

  const [pageData, setPageData] = useState({
    title: '',
    pageTitle: '',
    slug: slug,
  })
  const [crudData, setCrudData] = useState({
    crudColumns: [],
    //crudColumnSlugs: [],
    sayfaNo: 1, 
    kacar: 15,
    nereden: 0,
    sayfaSayisi: 0,
    toplam: 0,
  })
  const [crudList, setCrudList] = useState([])
  
  

  useEffect(()=>{
    getCrudData();
    setPageReady(0);
  },[slug]);
  
  useEffect(()=>{
    refreshTable();
  },[crudData.sayfaNo, crudData.kacar, crudData.crudColumns]);

  const getCrudData = () => {
    //setPageId(0);
    const data = doAjax(
      appContext.api_url + 'ApiCrudList/getCrudData',
      'GET',
      {tableSlug: slug,}
    );
    data.then((res)=>{
      const gelen = JSON.parse(res);
      //console.log(gelen);
      setFormLink('/CrudList/' + gelen.pageData.slug)
      
      setPageData(gelen.pageData);
      setCrudData(
        {...crudData, 
          crudColumns: gelen.crudData.crudColumns,
        }
      );
    })
  }

  const refreshTable = () => {
    //console.log(pageReady + " " + props.pageId);
    //console.log(props.pageId);
    
    //if(pageReady == 1){
    if(crudData.crudColumns.length){
      //console.log(crudData);
      
      const data = doAjax(
        appContext.api_url + 'ApiCrudList/getCrudList',
        'GET',
        {
          pageData: pageData,
          tableSlug: pageData.slug,
          sayfaNo: crudData.sayfaNo,
          kacar: crudData.kacar,
          crudColumns: (crudData.crudColumns),
          nereden: crudData.nereden,
          sayfaSayisi: crudData.sayfaSayisi,
          toplam: crudData.toplam,
          pageId: props.pageId,
        }
      );
      data.then((res)=>{
        //console.log("refresh");
        //console.log(res);
        const gelen = JSON.parse(res);
        //console.log(gelen.crudList);
        
        if(gelen.error){
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: gelen.error,
          })
        }else{
          //console.log(gelen);

          setFormLink('/CrudForm/' + pageData.slug + (props.pageId?'?parent=' + props.pageId :''))

          setCrudList(gelen.crudList)
          //console.log(gelen.crudList);
          setCrudData({...crudData, ...gelen.crudData})
          setPageReady(1);
        }
        
      })
    }
  }
  
  useEffect(()=>{
    //console.log(props.pageId); 
    //refreshTable();
    if(props.pageId > 0){
      refreshTable();
      console.log("pageId Değişti 0dan büyük");
    }
    if(pageReady == 1 && props.pageId == 0){
      refreshTable();
      console.log("pageid 0 ve sayfa yüklendi");
    }
    //console.log("sayfa id ");
    


  },[props.pageId])

  
  const yenile = (e) => {
    e.preventDefault();
    //console.log(props.pageId);
    
    refreshTable();
  }
  const yukari = (e) => {
    e.preventDefault();
    //console.log(props.pageId);
    //console.log(pageData);
    
    
    const data = doAjax(
      appContext.api_url + 'ApiCrudList/findPageParent',
      'GET',{pageId: props.pageId, table: pageData.slug, crudColumns: crudData.crudColumns}
    );
    data.then((res)=>{
      //console.log(res);      
      const gelen = JSON.parse(res);
      //console.log(gelen);
      
      if(gelen.secilenPage){
        let yonlendirilecekUrl = '/CrudList/' + pageData.slug + '';
        //let panelFormLinki = 'PanelForm';
        //console.log(gelen.secilenPage);
        //console.log(gelen.parent.slug);
        
        if(gelen.secilenPage[gelen.parent.slug] > 0){
          yonlendirilecekUrl += '?id=' + gelen.secilenPage[gelen.parent.slug];
        }   
        //console.log(yonlendirilecekUrl);
        //console.log(props);
        
        props.history.push(yonlendirilecekUrl);
      }
      
      //setPageData({ ...pageData, crudData: gelen.crudData});
    })
  }
  
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

  const deleteRow = (e, itemId) => {
    e.preventDefault();
    let c = confirm('Seçilen satır silinecek. Emin misiniz?');
    if(!c) return false;
    const data = doAjax(
      appContext.api_url + 'ApiCrudList/deleteRow',
      'POST',
      {
        itemId: itemId,
        tableSlug: slug
      }
    );
    data.then((res)=>{
      console.log(res);      
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
      link: '/CrudForm/' + pageData.slug + '/',
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
        <div className="desc">{pageData.pageTitle}</div>
      </div>
      <div className="page-filter"></div>
      <div className="page-list">
        <div className="list-control">
          <div className="control-left">
            <a href="#" onClick={yenile} className="refreshBtn">Yenile</a>
            <Link to={formLink} className="addBtn">Ekle</Link>
            {(props.pageId>0?<a href="#" onClick={yukari} className="refreshBtn">Yukarı Git</a>:null)}
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
              <tr>
                {crudData.crudColumns.map((value, key)=>
                  <th key={key}>{value.title}</th>
                )}
              </tr>
            </thead>
            <tbody>
              <TableRows crudList={crudList} crudData={crudData} deleteRow={deleteRow} tableRowButtons={tableRowButtons} tableName={slug} />
            </tbody>
          </table>
        </div>

        <div className="list-control bottom">
          <div className="control-left">
            <a href="#" onClick={yenile} className="refreshBtn">Yenile</a>
            <Link to={'/CrudForm/' + pageData.slug + '/'} className="addBtn">Ekle</Link>
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

