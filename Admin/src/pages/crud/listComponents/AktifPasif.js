import React, {useState, useContext, useEffect} from 'react';
import doAjax from '../../../libraries/doAjax';
import AppContext from '../../../context/AppContext';

export default function AktifPasif(props){
  const {name, onChangeP, value, label, column, tableName, row} = props;
  const appContext = useContext(AppContext);
  
  const [checkboxValue, setCheckboxValue] = useState(false)

  useEffect(()=>{
    if(value){
      setCheckboxValue(parseInt(value))
    }
  },[value])
  
  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setCheckboxValue(value)
    //console.log(value);
    const data = doAjax(
      appContext.api_url + 'ApiPanel/setRowStatus',
      'GET',
      {tableName: tableName, column: column, value: value, row:row}
    );
    data.then((res)=>{
      //console.log(res);    
    })
  }
  return(
    <div>
      <div className="checkbox" >
        <input type="checkbox" onChange={(e) => onChange(e)} checked={checkboxValue} />
        <span className="us-checkbox">
          <i className="fa fa-check"></i>
        </span>
      </div> 
    </div>
  )
}