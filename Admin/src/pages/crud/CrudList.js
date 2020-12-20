import React, {useState, useContext, useEffect} from 'react';
import {useParams, withRouter, Link} from 'react-router-dom';

import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';


import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';
import doAjax from '../../libraries/doAjax';
import TableControls from './compList/TableControls'
import {pageInitWork, refreshTableWork, deleteRow, yukariGit, onSortEnd,ozellikYukari} from './compList/CrudLib';

import qs from 'query-string';
import TableRow from './compList/TableRow';





const SortableItem = SortableElement(({key,item,state,setState,appContext,deleteRow})=>
  <TableRow key={key} item={item} state={state} setState={setState} appContext={appContext} deleteRow={deleteRow}/>
)
const SortableList = SortableContainer(({state,setState,appContext,deleteRow})=>{
  return (
    <tbody>
      {state.crudList.map((item,key)=>
        <SortableItem key={key} item={item} state={state} setState={setState} appContext={appContext} deleteRow={deleteRow} index={key}   />
      )}
    </tbody>
  )
})


export default function CrudList (props) {
  //const {slug, pageId, history} = props;
  let { slug,id } = useParams();
  let { history } = props;
  //console.log(slug)
  const queryStringList = qs.parse(props.location.search);
  //console.log(queryStringList);
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
      order_column: '',
      order_drag: 0
    },
    crudColumns: [],
    crudList: [],
    queryStringList: {}
  });
  /*useEffect(()=>{
    console.log("search değişti");
  },[props.location.search])*/
  useEffect(()=>{
    //console.log("slug veya id değişti " + slug + " id= " +id);
    //console.log("effect güncelledi");
    //console.log(qs.parse(props.location.search));queryStringList:qs.parse(props.location.search)
    setState((state)=>({...state, id:id,slug:slug }))
  },[slug,id])

  useEffect(()=>{
    //console.log("bir defa");
    pageInitWork({appContext, state, setState, queryStringList });
  },[state.slug,state.id])
  useEffect(()=>{
    if(state.initWorkLoading == true){
      refreshTableWork({ appContext, state, setState });
    }
  },[state.initWorkLoading, state.crudData.sayfaNo, state.crudData.kacar])

  const yenile = (e) => {
    e.preventDefault();
    console.log(state);
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
            {(state.queryStringList.parentTable?<a href="#" onClick={(e)=>ozellikYukari({e,state,appContext, history})} className="refreshBtn">Geri Dön</a>:null)}
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
            {state.crudData.order_drag == 0 ?
            <tbody>
              {state.crudList.map((item,key)=>
                <TableRow key={key} item={item} state={state} setState={setState} appContext={appContext} deleteRow={deleteRow}/>
              )}
            </tbody>
            :<SortableList state={state} setState={setState} appContext={appContext} deleteRow={deleteRow} onSortEnd={(e)=>onSortEnd({e,state,setState,appContext})} helperClass="tasinacakTr" useDragHandle />}

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

