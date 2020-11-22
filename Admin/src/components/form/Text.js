import React, {useState, useContext, useEffect} from 'react';


export default function Text (props) {
  //name={item.slug} value={values[item.slug] || ''}
  //console.log(props);
  const {name, value, onChange} = props;

  return(
    <input type="text" name={name} value={value} onChange={e=> onChange(e)} />
  )
}
