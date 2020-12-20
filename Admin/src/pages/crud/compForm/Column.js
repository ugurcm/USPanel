import React, {useState, useContext, useEffect} from 'react';
import TextCrudForm from '../../../components/form/TextCrudForm'
import AltKategori from '../../../components/form/AltKategori'
import TekliSelect from '../../../components/form/TekliSelect'
import TekliSelectAltKategori from '../../../components/form/TekliSelectAltKategori'
import CokluSelect from '../../../components/form/CokluSelect'
import CokluSelectAltKategorili from '../../../components/form/CokluSelectAltKategorili'
import TextEditor from '../../../components/form/TextEditor'

export default function Column ({state,setState, item, onChange, appContext,id}){
  //console.log(state.columns)
  const {columns,values} = state;
  let myComponent = null;
  if(item.component_id == 1){
    myComponent = <TextCrudForm item={item} values={values} onChange={onChange} />
  }
  if(item.component_id == 2){
    myComponent = <AltKategori item={item} values={values} state={state} 
      setState={setState} appContext={appContext} id={id} />
  }
  if(item.component_id == 3){
    myComponent = <TekliSelect item={item} values={values} onChange={onChange} state={state} 
      setState={setState} appContext={appContext} id={id} />
  }
  if(item.component_id == 4){
    myComponent = <TekliSelectAltKategori item={item} values={values} onChange={onChange} state={state} 
      setState={setState} appContext={appContext} id={id} />
  }
  if(item.component_id == 5){
    myComponent = <CokluSelect item={item} values={values} onChange={onChange} state={state} 
      setState={setState} appContext={appContext} id={id} />
  }
  if(item.component_id == 6){
    myComponent = <CokluSelectAltKategorili item={item} values={values} onChange={onChange} state={state} 
      setState={setState} appContext={appContext} id={id} />
  }
  if(item.component_id == 8){
    myComponent = <TextEditor item={item} values={values} onChange={onChange} state={state} 
    setState={setState} appContext={appContext} id={id} />
  }

  return(
    <div className="frow">
      <div className="flabel">
        {item.title} 
      </div>
      <div className="fval">
        <div className="input-text">
          {myComponent}
        </div>              
      </div>
    </div>
  )
}
//<Text name={'title'} value={values.title} onChange={onChange} />