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

import Column from './compForm/Column';

import queryString from 'query-string';
import update from 'immutability-helper';


export default function CrudForm (props) {
  const appContext = useContext(AppContext);
  let { table, id } = useParams(); 
  let params = queryString.parse(props.location.search)
  //console.log(params);
  const [state, setState] = useState({
    pageTitle : '',
    formType: (!id?'add':'update'),
    panel: {},
    columns: [],    
    values: {},
    altKategori:[],
    parent:0,
    params: params,
    stateComp: {}
  });


  useEffect(()=>{
    pageLoad({ appContext, table, id, state, setState, params });
  },[])

  
  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    let myNewValues = {...state.values, [e.target.name]: value};
    setState((state) => ({...state, values: myNewValues }));
  }
  const formCancel = (e) => {
    e.preventDefault();
    //props.history.goBack();
    console.log(state);
  }
  
  return (
    <div className="page-content">      
      <div className="page-title">
        <div className="icon">
          <i className="fa fa-user"></i>
        </div>
        <div className="desc">{state.pageTitle}</div>
      </div>
      
      <div className="form-cont">
        <form action="" method="POST"  autoComplete="off" onSubmit={(e)=>formSubmit({ appContext, e, state, props, id })}>
          {/* eğer alt özellik ise özellik idsini yazalım. */}
          {/*(state.params.parentName?<input type="hidden" name={state.params.parentName} value={state.params.parentValue} />:null)*/}
          
          {state.columns.map((val, key)=>
            <Column key={key} state={state} setState={setState} item={val} onChange={onChange} appContext={appContext} id={id} />)} 
          
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
  


