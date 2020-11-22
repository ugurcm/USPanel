import React, {useState, useContext, useEffect} from 'react';
import Dropzone from 'dropzone';
import {SortableContainer, SortableElement, sortableHandle} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import AppContext from '../../context/AppContext';

export default function ResimTekli (props) {
  const appContext = useContext(AppContext);
  const [myRealDropzone, setMyRealDropzone] = useState({});
  const [fileUrl, setFileUrl] = useState('');

  useEffect(()=>{
    Dropzone.autoDiscover = false;
    
    var myDropzone = new Dropzone("div." + props.compName, { 
      url: props.url,
      maxFiles: props.maxFiles,
      headers: {
        'Cache-Control': null,
        'X-Requested-With': null
      },
      chunking: true,
      forceChunking: true
    });
    //
    setMyRealDropzone(myDropzone);
    
    
  }, [])
  
  useEffect(()=>{
    //console.log(myRealDropzone);
    //if ('key' in myObj)
    //console.log(props.pageReady);
    
    if(myRealDropzone.hasOwnProperty('element')){
      //console.log(myRealDropzone);
      myRealDropzone.hiddenFileInput.removeAttribute("multiple");
      myRealDropzone.on('sending', function(file, xhr, formData){
        formData.append('uploadFolderName', props.uploadFolderName);
      });
      myRealDropzone.on('uploadprogress', (file, progress, bytesSent) => {
        progress = bytesSent / file.size * 100;
        if (file.upload.chunked && progress === 100) return
        if(progress > 100) progress = 100;
        $(file.previewElement).find('.dz-upload').width(progress + "%");  
      })
      myRealDropzone.on("success", function(file){ 
        //console.log(file);
        var response = JSON.parse(file.xhr.response);
        var filename = '';
        if(response.newFileName){
          filename = response.newFileName.replace(/^.*[\\\/]/, '');
          //console.log(filename)
        }
        $(file.previewElement).find(".dz-filename span").text(filename);
        $(file.previewElement).find(".dz-success-mark").addClass('active');
  
        let gonder = {name: "", filename: filename};
        props.uploadCompChangeOneFile(props.compName, gonder);

        setFileUrl(appContext.api_url + 'assets/upload/' + props.compName + '/' + filename);

        setTimeout(()=>{
          $(file.previewElement).fadeOut();
        }, 2000);
      });
    }

    setFileUrl(appContext.api_url + 'assets/upload/' + props.compName + '/' + props.value);
    //console.log(props);
  },[props.pageReady]);



  //console.log(props);
  

  return(
    <React.Fragment>
      <div className={props.compName}>
        <div className="dz-default dz-message " data="">
          <span className="us-btn us-btn-blue">Fotoğraf Seçiniz</span>
        </div>
      </div>
      {props.value?
        <div className="uploadDosyaTek">
          <div className="ilabel">Yüklenen Fotoğraf:</div>
          <div className="val"><a href={fileUrl} target="_blank">{props.value}</a></div>
          <div className="sil">
            <a href="#" onClick={(e) => props.setMyValueEmpty({e:e, compName: props.compName, myValue: props.value})}>Dosyayı Sil</a>
          </div>
        </div>
      :null}
      
    </React.Fragment>
  )
}