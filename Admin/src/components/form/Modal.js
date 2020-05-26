import React, {useState, useContext, useEffect} from 'react';
import ModalFileComp from '../form/ModalFileComp';
import ModalGalleryComp from '../form/ModalGalleryComp';
import AppContext from '../../context/AppContext'

export default function Modal (props) {
  const [loading, setLoading] = useState(false);
  const [contLoading, setContLoading] = useState(false);
  
  const appContext = useContext(AppContext);
  
  const {modalData} = props;
  if(!modalData.show){
    
    return null;
  }
  
  //console.log(modalData.uploadListData);
  
  useEffect(()=>{

    setLoading(false);
    setTimeout(()=>{setLoading(true);}, 20)
    setTimeout(()=>{setContLoading(true);}, 550)
    
    
    const handleKeyb = props => {
      if (event.keyCode === 27) {
        setLoading(false);
        setContLoading(false);
        setTimeout(()=>{
          appContext.setModalData({...appContext.modalData, show: false, innerComp: null});
        }, 200)
      }
    }
    window.addEventListener('keydown', handleKeyb);
    return () =>{
      window.removeEventListener('keydown', handleKeyb);
    }
  },[]);
 

  
  const components = {
    ModalFileComp: ModalFileComp,
    ModalGalleryComp: ModalGalleryComp
  }
  const modalClose = (e) => {
    e.preventDefault();
    setLoading(false);
    setContLoading(false);
    setTimeout(()=>{
      appContext.setModalData({...appContext.modalData, show: false, innerComp: null});
    }, 200)
  }
  const modalSave = (e, formData) => {
    modalData.uploadCompChange(modalData.compName, formData, 'update', modalData.selectedItem);
    modalClose(e);
  }

  const LoadingComp = props => {
    return (
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    )
  }


  const SecilenComp = components[modalData.innerComp];
  return(
    <div className={'usModal ' + (loading?'active':'')}>
      <div className={'modal-loading ' + (contLoading?'':'active')}>
        <LoadingComp />
      </div>
      <div className={'modal-main ' + (contLoading?'active':'')}>
        <SecilenComp modalClose={modalClose} modalSave={modalSave} modalData={props.modalData} />
      </div>      
    </div>
  )
}