import React, {useState, useContext, useEffect} from 'react';
import doAjax from '../../libraries/doAjax';

import Select from './Select';

export default function TekliSelect (props) {
  //name={item.slug} value={values[item.slug] || ''}
  //console.log(props);
  const {item, values, onChange, state, setState, appContext, id} = props;
  const name = item.slug; //siniflar_id
  const value = values[item.slug] || '';
  //console.log(item);
  /*const [stateComp,setStateComp] = useState({
    liste: []
  })*/

  useEffect(()=>{
    //console.log(item);
    const data = doAjax(
      appContext.api_url + 'Admin/CrudForm/getTekliSelectList',
      'GET',
      {
        table: item.target_table,
        target_table_title: item.target_table_title,
      }
    );
    data.then((res)=>{
      let gelen = JSON.parse(res);
      //console.log(gelen);
      if(gelen['tableList']){
        //setStateComp((state)=>({...stateComp, liste: gelen['tableList']}))
        
        setState((state)=>({...state, stateComp: 
          {...state.stateComp, ['state_'+item.id]: {liste:gelen['tableList']}}
        }))
      }

    });
  },[])
  const stateYazdir = (e) => {
    e.preventDefault();
    console.log(stateComp);
  }
  return(
    <>
    {(['state_'+item.id] in state.stateComp?
    <Select name={name} value={value} onChange={onChange} 
      hasDefault={1} defaultValue={0} inputList={state.stateComp['state_'+item.id].liste} 
      itemKeyValue={'id'} itemKeyName={item.target_table_title}
      />
    :null)} 
    </>
  )
}

/* 

*/