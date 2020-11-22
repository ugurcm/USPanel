import { parse } from 'query-string';
import React, {useState, useContext, useEffect} from 'react';
import doAjax from '../../libraries/doAjax';
import Select from './Select';

export default function AltKategori (props) {

  const {item, values, state, setState, appContext, id} = props;
  const name = item.slug;
  const value = values[item.slug] || '';

  useEffect(()=>{
    //console.log(item);
    //console.log(state.params);
    //console.log(values);
    //console.log(item);
    if(state.params.parent){
      //console.log("parent var " + state.params.parent);
      parentListesiGetir({id:state.params.parent,idCikar:'hayir'})
    }

    if(value == 0 && !state.params.parent){
      secimYap({key:0,value})
    }
    if(value >0){ //parent kategorisi 0dan büyükse tüm parent listesini aliyoruz.
      parentListesiGetir({id:id,idCikar:'evet'})
    }
  },[]);

  const parentListesiGetir = ({id,idCikar}) => {
    //console.log(id);
    const data = doAjax(
      appContext.api_url + 'Admin/CrudForm/getKategoriBread',
      'GET',
      {
        table: state.panel.slug,
        name: name,
        target_table_title: item.target_table_title,
        id: id,
        idCikar: idCikar
      }
    );
    data.then((res)=>{
      //console.log(res);
      const gelen = JSON.parse(res);
      //console.log(gelen);
      //Liste kontrol ediliyor. Modül listesinde select box seçilecek.
      if(gelen.parentList.length){
        gelen.parentList.map((value, key)=>{
          //console.log(value);
          //console.log(state.values[item.slug]);
          /*let kontrol = value.liste.filter(function (listitem) { return listitem.id == state.values[item.slug] });
          if(kontrol.length){
            //console.log("bulundu");
            //console.log(value.liste);
            //console.log(key);
            gelen.parentList[key].selected = 1;
          }*/
          //console.log(idCikar);
          if(idCikar == 'evet'){  // eger formdan geliyorsa listeden kendisini çıkarıyoruz
            // gelen listeden mevcut idyi cikartalim kendisini eklemesin.
            let newList = value.liste.filter(item => (item.id !== id));
            //console.log(newList);
            //gelen.parentList[key].selected = 0;
            gelen.parentList[key].liste = newList;
            //console.log(gelen.parentList);
            if(newList.length == 0){
              let newParentList = gelen.parentList.filter((item, itemkey) => (itemkey !== key));
              //console.log(newParentList);
              gelen.parentList = newParentList;
            }
            
            //console.log("id evet");
          }

          if(idCikar == 'hayir'){ // eğer crud listeden ekle dediysek listeden çıkartmamıza gerek yok çünkü seçilen yok.
            //console.log("id hayir");
            
          }


          

          
          //console.log(gelen);

        })
        //console.log(gelen.parentList);

        if(idCikar == 'evet'){
          setState((state) => ({...state, 
            altKategori: gelen.parentList,
          }));
        }
        if(idCikar == 'hayir'){
          setState((state) => ({...state, 
            altKategori: gelen.parentList,
            values: {...state.values, [name]:id}
          }));
        }
        

      }

      


    })
  }

  const secimYap = ({key,value}) => {
    //console.log("secim yapildi");
    const data = doAjax(
      appContext.api_url + 'Admin/CrudForm/getAltKategori',
      'GET',
      {
        table: state.panel.slug,
        name: name,
        target_table_title: item.target_table_title,
        id: value,
        key:key
      }
    );
    data.then((res)=>{
      let gelen = JSON.parse(res);
      let myo = {};
      myo.selected = 0;
      myo.liste = gelen.liste;
      
      //console.log(myo)
      //eger id var ise gelen listeden kendisini cikartalim kendisini seçemesin.
      if(id){
        let newList = myo.liste.filter(item => (item.id !== id));
        myo.liste = newList;
      }
      //console.log(myo.liste.length);
      
      
 
      

      
      let stateValue = 0;
      let myarr = [...state.altKategori];

      if(key in state.altKategori){
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
          if((key-1) in state.altKategori){
            stateValue = state.altKategori[key-1].selected;
          }
        }

        



      }else{
        //console.log("key yok "+key);
        myarr.push(myo);
      }
      
      

      setState((state) => ({...state, 
        altKategori: myarr, 
        values: {...state.values, [name]: stateValue},
        parent: stateValue
      }));

    })
  }
  
  const onChange = ({key,e})=> {

    let myVal = parseInt(e.target.value);
    //console.log("key "+key + " value " +myVal);
    //if(myVal>0){
      secimYap({key, value:myVal})
    //}
  }

  

  return(
  <>
    {state.altKategori.map((value,key)=>
      <Select key={key} name={name} value={value.selected} inputList={value.liste} itemKeyValue="id" itemKeyName={item.target_table_title} defaultValue={0} hasDefault={1} onChange={(e)=>onChange({key,e})} />
    )}
  </>
  )
}


