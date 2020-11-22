import React, {useState, useContext, useEffect} from 'react';
import {useParams, withRouter, Link} from 'react-router-dom';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';
import doAjax from '../../libraries/doAjax';
import TableRows from './compList/TableRow';
import TableControls from './compList/TableControls'
import {pageInitWork, refreshTableWork, deleteRow} from './compList/CrudLib';

import queryString from 'query-string';
import TableRow from './compList/TableRow';

export default function CrudList (props) {
  const [pageId, setPageId] = useState(0);
  let { slug } = useParams();
  useEffect(()=>{
    const parsed = queryString.parse(location.search);
    if(parsed.id){setPageId(parsed.id);}
  })
  return(
    <CrudListComp slug={slug} pageId={pageId} history={props.history} />
  )
}

function CrudListComp (props) {
  const {slug, pageId, history} = props;
  const appContext = useContext(AppContext);
  const [formLink, setFormLink] = useState('');
  const [panel, setPanel] = useState({});
  const [title, setTitle] = useState('Panel Bileşenleri');

  const [crudData, setCrudData] = useState({
    table: "xxx",
    sayfaNo: 1,
    kacar: 100,
    sayfaSayisi: 0,
    toplam: 0,
  })
  const [crudColumns, setCrudColumns] = useState([]);
  const [crudList, setCrudList] = useState([]);
 
  useEffect(()=>{
    pageInit({table: slug});
  },[slug])
  useEffect(() => {
    if(panel.id>0){
      refreshTable();
    }
  }, [crudData.sayfaNo, crudData.kacar]); 


  useEffect(()=>{
    if(panel.id>0){
      refreshTable();
    }
  },[crudData.table])

  const pageInit = ({table}) => {
    pageInitWork({table, appContext, panel,setPanel,title,setTitle,setFormLink,crudData, setCrudData })
  }
  const refreshTable = () => {
    refreshTableWork({appContext,panel,crudData,setCrudColumns,setCrudList, setCrudData})
  }
  
  const yenile = (e) => {
    e.preventDefault();
    refreshTable();
    console.log(title);
    console.log(panel);
    console.log(crudList);
    console.log(crudData);
  }
  const yukari = (e) => {
    e.preventDefault();
    const data = doAjax(
      appContext.api_url + 'ApiCrudList/findPageParent',
      'GET',{pageId: props.pageId, table: slug, crudColumns: crudData.crudColumns}
    );
    data.then((res)=>{
      const gelen = JSON.parse(res);
      if(gelen.secilenPage){
        let yonlendirilecekUrl = '/CrudList/' + slug + '';
        if(gelen.secilenPage[gelen.parent.slug] > 0){
          yonlendirilecekUrl += '?id=' + gelen.secilenPage[gelen.parent.slug];
        }   
        history.push(yonlendirilecekUrl);
      }
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
  

  return (
    <div className="page-content">      
      <div className="page-title">
        <div className="icon">
          <i className="fa fa-user"></i>
        </div>
        <div className="desc">{title}</div>
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
            <TableControls crudData={crudData} kacarChange={kacarChange} crudGoFirstPage={crudGoFirstPage} crudGoPrevPage={crudGoPrevPage} crudGoNextPage={crudGoNextPage}crudGoLastPage={crudGoLastPage} crudSayfaNoChange={crudSayfaNoChange} />
          </div>
        </div>
        <div className="list-table">          
          <table>
            <thead>
              <tr>
                {crudColumns.map((value, key) => {
                  if (value.show_in_crud == 1) {
                    return <th key={key}>{value.title}</th>;
                  }
                })}
              </tr>
            </thead>
            <tbody>
              {crudList.map((item,key)=>
                <TableRow key={key} item={item} crudColumns={crudColumns} deleteRow={deleteRow} crudData={crudData} setCrudData={setCrudData} appContext={appContext}  />
              )}
            </tbody>
          </table>
        </div>

        <div className="list-control bottom">
          <div className="control-left">
            <a href="#" onClick={yenile} className="refreshBtn">Yenile</a>
            <Link to={formLink} className="addBtn">Ekle</Link>
          </div>
          <div className="control-right">
            <TableControls crudData={crudData} kacarChange={kacarChange} crudGoFirstPage={crudGoFirstPage} crudGoPrevPage={crudGoPrevPage} crudGoNextPage={crudGoNextPage}crudGoLastPage={crudGoLastPage} crudSayfaNoChange={crudSayfaNoChange} />
          </div>
        </div>

      </div>
    </div>
  )
}
//<TableRows crudList={crudList} crudData={crudData} crudColumns={crudColumns} deleteRow={deleteRow} tableRowButtons={tableRowButtons} tableName={slug} />

