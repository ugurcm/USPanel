import React, {useState, useContext, useEffect} from 'react';
import Text from '../../../components/form/Text'
import Radio from '../../../components/form/Radio'




export default function RowInputRadio ({values, label, slug, onChange, radioList}){
  //console.log(radioList);
  return(
    <div className="frow">
      <div className="flabel">
        {label}
      </div>
      <div className="fval">
        <div className="input-text">
          {radioList.map((value, key)=>
            <Radio key={key} name={slug} value={value.value} checkedValue={values[slug]} onChange={onChange} label={value.label}/>   
          )}
        </div>              
      </div>
    </div>
  )
}
//<Text name={'title'} value={values.title} onChange={onChange} />