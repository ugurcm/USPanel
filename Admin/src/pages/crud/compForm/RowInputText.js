import React, {useState, useContext, useEffect} from 'react';
import Text from '../../../components/form/Text'

export default function RowInputText ({values, label, slug, onChange}){
  //console.log(values)
  return(
    <div className="frow">
      <div className="flabel">
        {label}
      </div>
      <div className="fval">
        <div className="input-text">
          <Text name={slug} value={values[slug]} onChange={onChange} />
        </div>              
      </div>
    </div>
  )
}
//<Text name={'title'} value={values.title} onChange={onChange} />