import React, {useState, useContext, useEffect} from 'react';
import doAjax from '../../libraries/doAjax';

import Select from './Select';

export default function TekliSelectAltKategori (props) {
  const {item, values, state, setState, appContext, id} = props;
  const name = item.slug; //siniflar_id
  const value = values[item.slug] || '';
  useEffect(()=>{
    parentListesiGetir({id: value, idCikar:'hayir'})
  },[])

  const parentListesiGetir = ({id,idCikar}) => {
    const data = doAjax(
      appContext.api_url + 'Admin/CrudForm/getKategoriBread',
      'GET',
      {
        table: item.target_table,
        name: item.target_table_secilen_kolon,
        target_table_title: item.target_table_title,
        id: id,
        idCikar: idCikar
      }
    );
    data.then((res)=>{
      //console.log(res);
      const gelen = JSON.parse(res);
      //console.log(gelen.parentList);
      //Liste kontrol ediliyor. Modül listesinde select box seçilecek.
      if(gelen.parentList.length){
        if(idCikar == 'hayir'){
          /*setState((state) => ({...state, 
            stateComp: {['state_'+item.id]:{list:gelen.parentList}},
            values: {...state.values, [name]: id}
          }))*/

          setState((state)=>({...state, 
            stateComp: {...state.stateComp, ['state_'+item.id]: {liste:gelen.parentList}},
            values: {...state.values, [name]: id}
          }))
          
        }
      }
    })
  }
  

  const onChange = ({key,e})=> {

    let myVal = parseInt(e.target.value);
    //console.log(myVal);
    secimYap({key, value:myVal})
    
  }

  const secimYap = ({key,value}) => {
    //console.log("secim yapildi");
    const data = doAjax(
      appContext.api_url + 'Admin/CrudForm/getAltKategori',
      'GET',
      {
        table: item.target_table,
        name: item.target_table_secilen_kolon,
        target_table_title: item.target_table_title,
        id: value,
        key:key
      }
    );
    data.then((res)=>{
      let gelen = JSON.parse(res);
      //console.log(gelen);
      let myo = {};
      myo.selected = 0;
      myo.liste = gelen.liste;
      //console.log(id);
      //console.log(myo)
      //eger id var ise gelen listeden kendisini cikartalim kendisini seçemesin.
      if(id){
        let newList = myo.liste.filter(item => (item.id !== id));
        myo.liste = newList;
      }
      //console.log(myo);
      //console.log(myo.liste.length);
      
      
      let stateValue = 0;
      //let myarr = [...state.altKategori];
      let myarr = [...state['stateComp']['state_'+item.id]['liste']];
      //console.log(state['stateComp']);
      //console.log(key);

      if(key in state['stateComp']['state_'+item.id]['liste']){
        //console.log("key var "+key);
        myarr[key].selected = value; 
        myarr.length = key+1;
        
        stateValue = value; 
        if(gelen.liste.length && key == 0 && value == 0){
          myarr.push(myo);
          myarr.length = key+1;
          //console.log("key 0 value 0");
        }
        //Eger gelen listede eleman varsa, secilen id 0 degilse ve yeni listedeki elemanlar 0dan büyük ise ekle.
        if(gelen.liste.length && value > 0 && myo.liste.length > 0){
          myarr.push(myo);
          //console.log("value 0 dan büyük");
        }
        if(stateValue == 0){  //eger alt kategoride 0 seçilirse value olarak bir öncekini seçsin.
          if((key-1) in state['stateComp']['state_'+item.id]['liste']){
            //stateValue = state[item.target_table]['comp'+item.id][key-1].selected;
            stateValue = state['stateComp']['state_'+item.id]['liste'][key-1].selected;
          }
        }

        

      }else{
        //console.log("key yok "+key);
        myarr.push(myo);
      }
      //console.log(myarr);
   
      /*setState((state) => ({...state, 
        stateComp: {['state_'+item.id]:{list:myarr}},
        values: {...state.values, [name]: stateValue}
      }))*/

      setState((state)=>({...state, stateComp: 
        {...state.stateComp, ['state_'+item.id]: {liste:myarr}},
        values: {...state.values, [name]: stateValue}
      }))


    })
  }
  


  return(
    <>
      {(['state_'+item.id] in state.stateComp ? 
          state.stateComp['state_'+item.id].liste.map((val, key)=>
            <Select key={key} name={name} value={val.selected} inputList={val.liste} itemKeyValue="id" itemKeyName={item.target_table_title} defaultValue={0} hasDefault={1} onChange={(e)=>onChange({key,e})} />
          )
        :null)} 
    </>
  )
}



