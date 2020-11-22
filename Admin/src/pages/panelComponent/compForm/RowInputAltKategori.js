import React, {useState, useContext, useEffect} from 'react';
import Select from '../../../components/form/Select'

export default function RowInputAltKategori (
  {values, label, slug, onChange, inputList,itemKeyValue, itemKeyName, hasDefault, defaultValue}
  ){
  //console.log(values)
  return(
    <div className="frow">
      <div className="flabel">
        {label}
      </div>
      <div className="fval">
        <div className="input-text">
          alt kategori
        </div>              
      </div>
    </div>
  )
}

//  itemKeyName="title" hasDefault={1}