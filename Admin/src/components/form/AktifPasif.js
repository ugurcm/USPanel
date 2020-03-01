import React, {useState, useContext, useEffect} from 'react';

import Checkbox from './Checkbox';

export default function AktifPasif (props) {
  const {name, onChange, value, label, checkedValue} = props;
  
  return(
    <Checkbox name={props.name} value={props.value} onChange={e=> props.onChange(e)} />
  )
}
