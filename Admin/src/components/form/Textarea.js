import React, {useState, useContext, useEffect} from 'react';


export default function Textarea (props) {
  //console.log(props.name);
  //console.log(props.value);
  
  return(
    <textarea name={props.name} value={props.value} onChange={(e) => props.onChange(e)}></textarea>
  )
}