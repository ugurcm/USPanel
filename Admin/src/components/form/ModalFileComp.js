import React, {useState, useContext, useEffect} from 'react';
import Text from '../../components/form/Text'


export default function ModalFileComp (props) {
  const {uploadListData, selectedItem} = props.modalData;
 
  const [values, setValues] = useState({
    name: ""
  });
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
    
    setValues(uploadListData[selectedItem]);
  },[])
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
          <div className="cancel">
            <button onClick={props.modalClose}>Kapat</button>
          </div>
        </div>
      </div>
    </form>
    </div>
  )
}