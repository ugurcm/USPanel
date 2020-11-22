import React, {useState, useContext, useEffect} from 'react';


export default function TextCrudForm (props) {
  //name={item.slug} value={values[item.slug] || ''}
  //console.log(props);
  const {item, values, onChange} = props;
  const name = item.slug;
  const value = values[item.slug] || '';

  return(
    <input type="text" name={name} value={value} onChange={e=> onChange(e)} />
  )
}
