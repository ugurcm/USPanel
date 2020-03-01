import React, {useState, useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';


export default function CrudFormLangTab (props) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [langComponents, setLangComponents] = useState([]);
  const {languages, crudColumns, onChangeLang, formComponents, values, valuesLang} = props;
  //console.log(languages);

  const btnTabClick = (e, index) => {
    e.preventDefault();
    setSelectedTab(index);
    //console.log(langComponents);
    
  }
  useEffect(() => {
    //console.log(props);
    
    let filtrelenmis = crudColumns.filter(x => x.language_active == 1);
    setLangComponents(filtrelenmis);
  },[crudColumns])
  
  return(
    <div className="form-lang-tab">
      {languages?
        <div className="tab-wrapper">
          <div className="tab-head">
            {languages.map((value,key)=>
              <div key={key} className={'item ' + (selectedTab == key ? 'active' : '')}><button type="button" onClick={(e)=>btnTabClick(e, key)}>{value.title}</button></div>
            )}
          </div>
          <div className="tab-cont">
            {languages.map((valueLang,keyLang)=>
              <div key={keyLang} className={'tab-page ' + (selectedTab == keyLang ? 'active' : '')}>

                {langComponents.map((value, key)=>{
                  const SecilenComponent = formComponents[value.componentName];
                  //value['lang'][valueLang.id][value.slug]
                  //console.log(value);
                  //console.log(valuesLang);
                  if([1] in valuesLang){
                    //console.log(valuesLang);
                    //console.log(valueLang);
                    //console.log(valuesLang[1][value.slug]);
                    //console.log(valueLang.id[value.slug]);
                    //console.log(valuesLang[valueLang.id][value.slug]);
                    //console.log('valuesLang['+valueLang.id+']['+value.slug+']');
                    //'valuesLang['+valueLang.id+']['+value.slug+']'
                    return(
                      <div key={key} className="frow">
                        <div className="flabel">
                          {value.title} - {valueLang.title}
                        </div>
                        <div className="fval">
                          <div className="input-text">                  
                            <SecilenComponent componentId={value.id} value={valuesLang[valueLang.id][value.slug] || ''} onChange={(e) => onChangeLang(e, valueLang.id, value.slug)} inputList={value.relationList} itemKeyValue="id" itemKeyName={value.relation_panel_table_column_slug} hasDefault={1} pageReady={1} valueSlug={value.slug} crudColumn={value} onChangeEditor={(e) => props.onChangeLangEditor(e, valueLang.id, value.slug)} pageReady={props.pageReady} langId={valueLang.id} />
                          </div>
                          
                        </div>
                      </div>
                    )
                  }
                    
                })}

              
              </div>
            )}
            
            
          </div>
        </div>
        :null
      }
    </div>
  )
}