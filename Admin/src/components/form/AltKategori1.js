import React, {useState, useContext, useEffect} from 'react';
import propTypes from 'prop-types';
import Select from './Select';
import doAjax from '../../libraries/doAjax';
import AppContext from '../../context/AppContext';


export default function AltKategori1 (props) {
  const {parentPath, pageReady, formId} = props;
  const appContext = useContext(AppContext);

  const [parentPathList, setParentPathList] = useState([]);
  //console.log(props);
  //console.log(props.pageData);
  
  useEffect(()=>{
    //console.log("alt kategoris");
    //console.log(parentPath);
    
    if(pageReady == 1){
      //console.log(props.valueSlug);
      
      //console.log(parentPath);
      const data = doAjax(
        appContext.api_url + 'ApiCrudForm/getParentList',
        'GET',
        {
          parentPath: parentPath, 
          table: props.pageData.slug, 
          secilenTitle: props.altKategoriSlug,
          currentComponent: props.valueSlug
        }
      );
      data.then((res)=>{
        //console.log(res);
        //return false;
        const gelen = JSON.parse(res);
        if(gelen.parentPathList){
          //console.log(gelen.parentPathList);
          
          setParentPathList(gelen.parentPathList);
        }
      })
    }
  },[props.parentPath , props.pageReady]);

  const parentWrapper = parentPathList.map((liste, keyl)=>{
    //console.log(keyl);
    
    liste = liste.filter((item) => item.id !== formId );
    //console.log(parentPath[keyl+1]);
  
    return (
      <Select key={keyl} name={[name + '_path']} value={parentPath[keyl+1]} inputList={liste} onChange={(e)=>props.onChangeParent(e, keyl, props.valueSlug)} itemKeyValue="id" itemKeyName={props.altKategoriSlug} defaultValue={0} hasDefault={1} />
    )
    //}
  })
    
  
  return(
    <div className="parentComp">
      {parentWrapper}
    </div>

  )
}


