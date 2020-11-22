import React, {useState, useContext, useEffect} from 'react';
import Dropzone from 'dropzone';
import {SortableContainer, SortableElement, sortableHandle} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import AppContext from '../../context/AppContext';

export default function UploadComp (props) {
  const appContext = useContext(AppContext);
  
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
    myDropzone.on('sending', function(file, xhr, formData){
      formData.append('uploadFolderName', props.uploadFolderName);
    });
    myDropzone.on('uploadprogress', (file, progress, bytesSent) => {
      progress = bytesSent / file.size * 100;
      if (file.upload.chunked && progress === 100) return
      if(progress > 100) progress = 100;
      $(file.previewElement).find('.dz-upload').width(progress + "%");  
    })
    myDropzone.on("success", function(file){ 
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
      props.uploadCompChange(props.compName, gonder, 'add');

      setTimeout(()=>{
        $(file.previewElement).fadeOut();
      }, 2000);
    });
  }, [])


  const onSortEnd = ({oldIndex, newIndex}) => {
    let newItems = arrayMove(props.uploadListData, oldIndex, newIndex)
    props.listSortEnd(props.compName, newItems);
  };
  const itemClick = (e, index) => {
    
    e.preventDefault();
    appContext.setModalData({...appContext.modalData, show: true, innerComp: 'ModalFileComp', uploadListData: props.uploadListData, selectedItem: index, compName: props.compName, uploadCompChange: props.uploadCompChange });
    
    //let gonder = {name: "", filename: filename};
    //props.uploadCompChange(props.compName, gonder);

  }
  const SortableItem = SortableElement(({value, sortIndex}) => (
    <div className="item">
      <a href="#" onClick={(e)=> itemClick(e, sortIndex)}>{(value.name?value.name:value.value)}</a>
    </div>
  ));
  const SortableList = SortableContainer(({items}) => {
    return (
      <div className="uploadDosyaListCont">
        {items.map((value, index) => (
          <SortableItem
            key={`item-${index}`}
            index={index}
            sortIndex={index}
            value={value}
          />
        ))}
      </div>
    );
  });

  return(
    <React.Fragment>
      <div className={props.compName}>
        <div className="dz-default dz-message" data="">
          <span>Dosya Seçiniz</span>
        </div>
      </div>
      <div className="uploadDosyaList">
        <SortableList 
          distance={2} 
          helperClass="dragging-helper-class-dosya-list-item" 
          items={props.uploadListData} onSortEnd={onSortEnd} />
      </div>
    </React.Fragment>
  )
}