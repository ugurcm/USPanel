import React, {useState, useContext, useEffect} from 'react';


const CrudSayfaNoSelectInput = (props) => {
  let items = [];
  //console.log(props.crudData.sayfaSayisi);
  items.push(<option key={1} value={1} >{1}</option>)
  for (let i = 2; i <= props.crudData.sayfaSayisi; i++) {
    items.push(<option key={i} value={i} >{i}</option>)
  }
  return (
    <select onChange={(e)=>props.crudSayfaNoChange(e)} value={props.crudData.sayfaNo}>
      {items}          
    </select>
  )
}





export default function TableControls({state,setState}){
  const kayitSayilari = [15, 30, 50, 75, 100 ];

  const panelActions = {
    kacarChange (e) {
      let kacar = parseInt(e.target.value);
      setState(state => ({...state, crudData: {...state.crudData, kacar: kacar}}));
    },
    crudGoFirstPage () {
      setState(state => ({...state, crudData: {...state.crudData, sayfaNo: 1}}));
    },
    crudGoPrevPage () {
      if(state.crudData.sayfaNo > 1){
        setState(state => ({...state, crudData: {...state.crudData, sayfaNo: state.crudData.sayfaNo - 1}}));
      }
    },
    crudSayfaNoChange (e) {
      let sayfaNo = parseInt(e.target.value);
      setState(state => ({...state, crudData: {...state.crudData, sayfaNo: sayfaNo}}));
    },
    crudGoNextPage () {
      if(state.crudData.sayfaNo < state.crudData.sayfaSayisi){
        setState(state => ({...state, crudData: {...state.crudData, sayfaNo: state.crudData.sayfaNo + 1}}));
      }
    },
    crudGoLastPage () {
      setState(state => ({...state, crudData: {...state.crudData, sayfaNo: state.crudData.sayfaSayisi}}));
    }
  }
  
  return(
    <div className="tbl-controls">
      <div className="icol">
        <span>Kayıt Sayısı</span>
        <select onChange={panelActions.kacarChange} value={state.crudData.kacar}>
          {kayitSayilari.map((value, key)=><option key={key} value={value}>{value}</option>)}
        </select>
      </div>
      <div className="icol">
        <a href="#" onClick={panelActions.crudGoFirstPage}><i className="fa fa-step-backward"></i></a>
      </div>
      <div className="icol">
        <a href="#" onClick={panelActions.crudGoPrevPage}><i className="fa fa-angle-left"></i></a>
      </div>
      <div className="icol">
        <span>Sayfa</span>
        <CrudSayfaNoSelectInput crudData={state.crudData} crudSayfaNoChange={panelActions.crudSayfaNoChange} />
      </div>
      <div className="icol">
        <span>({state.crudData.nereden} - {state.crudData.kacar} / {state.crudData.toplam})</span>
      </div>
      <div className="icol">
        <a href="#" onClick={panelActions.crudGoNextPage}><i className="fa fa-angle-right"></i></a>
      </div>
      <div className="icol">
        <a href="#" onClick={panelActions.crudGoLastPage}><i className="fa fa-step-forward"></i></a>
      </div>
    </div>
  )
}

