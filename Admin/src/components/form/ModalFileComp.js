import React, {useState, useContext, useEffect} from 'react';
import Text from '../../components/form/Text'
import AppContext from '../../context/AppContext';

export default function ModalFileComp (props) {
  const {uploadListData, selectedItem, compName, uploadDeleteItem, uploadMakeDefault, listDefaultValue, setMyValueEmpty} = props.modalData;
  const [values, setValues] = useState({
    name: ""
  });
  const [fileUrl, setFileUrl] = useState('');
  const appContext = useContext(AppContext);
  const onChange = (e) => {
    //console.log(values)
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues({...values, [e.target.name]: value});
  }
  const modalSave = (e) => {
    e.preventDefault();
    props.modalSave(e, values);
  }
  useEffect(()=>{
    //console.log(props);
    //console.log(uploadListData[selectedItem]);
    setFileUrl(appContext.api_url + 'assets/upload/' + compName + '/' + uploadListData[selectedItem].value)
    setValues(uploadListData[selectedItem]);
  },[])
  
  const deleteItem = (e) => {
    e.preventDefault();
    uploadDeleteItem({compName: compName, itemKey: selectedItem});
    props.modalClose(e);
  }
  const makeDefault = (e) => {
    e.preventDefault();
    //console.log("make default");
    uploadMakeDefault({compName: compName, itemKey: selectedItem});
    props.modalClose(e);
  }
  const removeDefault = (e) => {
    setMyValueEmpty({e:e, compName: compName + '_default' });
    props.modalClose(e);
  }
  //console.log(props);
  
  return (
    <div className="modal-cont">
    <form action="">
      <div className="us-modal-header">
        <div className="title">Dosya Düzenle</div>
      </div>
      <div className="us-modal-content">
        <div className="form-cont">
          
          <div className="frow">
            <div className="flabel">Dosya Başlığı</div>
            <div className="fval">
              <div className="input-text">
                <Text name={'name'} value={values.name} onChange={onChange} />
              </div>  
            </div>
          </div>
          
        </div>
      </div>
      <div className="us-modal-footer">
        <div className="buttons">
          <div className="loader"></div>
          <div className="save">
            <button onClick={modalSave}>Kaydet</button>
          </div>
          <div className="makeDefault">
          {(listDefaultValue == uploadListData[selectedItem].value?<button onClick={removeDefault}>Varsayılanı Kaldır</button>:<button onClick={makeDefault}>Varsayılan Yap</button>)}
            
          </div>
          <div className="openCont">
            <a href={fileUrl} target="_blank" >Dosyayı Aç</a>
          </div>
          <div className="deleteCont">
            <button onClick={deleteItem}>Dosyayı Sil</button>
          </div>
          <div className="cancel">
            <button onClick={props.modalClose}>Kapat</button>
          </div>
        </div>
      </div>
    </form>
    </div>
  )
}