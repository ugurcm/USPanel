import React, {useState, useContext, useEffect} from 'react';


export default function Text (props) {
  return(
    <input type="text" name={props.name} value={props.value} onChange={e=> props.onChange(e)} />
  )
}