import React, {useState, useContext, useEffect} from 'react';
import {useParams, withRouter, Link} from 'react-router-dom';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';
import doAjax from '../../libraries/doAjax';
import TableRows from './compList/TableRow';
import TableControls from './compList/TableControls'
import {pageInitWork, refreshTableWork, deleteRow, yukariGit} from './compList/CrudLib';

import queryString from 'query-string';
import TableRow from './compList/TableRow';
import { func } from 'prop-types';

/*export default function CrudList (props) {
  const [pageId, setPageId] = useState(0);
  let { slug,id } = useParams();
  useEffect(()=>{
    const parsed = queryString.parse(location.search);
    if(parsed.id){setPageId(parsed.id);}
  })
  return(
    <CrudListComp slug={slug} pageId={pageId} history={props.history} />
  )
}*/

export default function CrudList (props) {
  //const {slug, pageId, history} = props;
  let { slug,id } = useParams();
  let { history } = props;
  
  const appContext = useContext(AppContext);
  const [state, setState] = useState({
    id: (id?id:undefined),
    slug: slug,
    initWorkLoading: false,
    panel: {},
    title: 'Panel Bileşenleri',
    formLink: '',
    crudData: {
      table: "xxx",
      sayfaNo: 1,
      kacar: 15,
      sayfaSayisi: 0,
      toplam: 0,
    },
    crudColumns: [],
    crudList: []
  });

  useEffect(()=>{
    setState((state)=>({...state, id:id,slug:slug}))
  },[slug,id])
  useEffect(()=>{
    pageInitWork({appContext, state, setState });
  },[state.slug,state.id])
  useEffect(()=>{
    if(state.initWorkLoading == true){
      refreshTableWork({ appContext, state, setState });
    }
  },[state.initWorkLoading, state.crudData.sayfaNo, state.crudData.kacar])

  const yenile = (e) => {
    e.preventDefault();
    //refreshTableWork({table:slug, appContext, state, setState });
    //console.log(history);
    //history.push('/crudList/siniflar');
  }
  
  

  return (
    <div className="page-content">    
      <div className="page-title">
        <div className="icon">
          <i className="fa fa-user"></i>
        </div>
        <div className="desc">{state.title}</div>
      </div>
      <div className="page-filter"></div>
      <div className="page-list">
        <div className="list-control">
          <div className="control-left">
            <a href="#" onClick={yenile} className="refreshBtn">Yenile</a>
            <Link to={state.formLink} className="addBtn">Ekle</Link>
            {(state.id>0?<a href="#" onClick={(e=>yukariGit({e,state,appContext, history}))} className="refreshBtn">Yukarı Git</a>:null)}
          </div>
          <div className="control-right">
            <TableControls state={state} setState={setState} />
          </div>
        </div>

        <div className="list-table">          
          <table>
            <thead>
              <tr>
                {state.crudColumns.map((value, key) => {
                  if (value.show_in_crud == 1) {
                    return <th key={key}>{value.title}</th>;
                  }
                })}
              </tr>
            </thead>
            <tbody>
              {state.crudList.map((item,key)=>
                <TableRow key={key} item={item} state={state} setState={setState} appContext={appContext} deleteRow={deleteRow}/>
              )}
            </tbody>
          </table>
        </div>

        
        <div className="list-control bottom">
          <div className="control-left">
            <a href="#" onClick={yenile} className="refreshBtn">Yenile</a>
            <Link to={state.formLink} className="addBtn">Ekle</Link>
          </div>
          <div className="control-right">
            <TableControls state={state} setState={setState} />
          </div>
        </div>        


        


      </div>

    </div>
  )
}
//<TableRows crudList={crudList} crudData={crudData} crudColumns={crudColumns} deleteRow={deleteRow} tableRowButtons={tableRowButtons} tableName={slug} />

