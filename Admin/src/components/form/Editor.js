import React, {useState, useContext, useEffect} from 'react';
import tinymce from 'tinymce/tinymce';


// A theme is also required
import 'tinymce/themes/silver';

// Any plugins you want to use has to be imported
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';
import 'tinymce/plugins/image';
import 'tinymce/plugins/media';


export default function Editor (props) {

  const [loaded, setLoaded] = useState(0);

  useEffect(()=>{
    if(props.pageReady == 1){
      //console.log("form yüklendi ekle");
      setLoaded(1);
    }
  },[props.pageReady]);

  useEffect(()=>{
    if(loaded == 1){
      //console.log(loaded);
      editorInit();
    }
    
  },[loaded]);

  useEffect(()=>{
    //console.log(props.formAktifmi);
    if(props.formAktifmi == 0){
      console.log("form kapandı");
      tinymce.remove();
    }
    /*return () => {
      if(loaded == 1){
        tinymce.remove();
        //console.log("kaldırıldı"); 
        console.log("editör kapat");
      }
    }*/
    
  },[props.formAktifmi])

  useEffect(()=>{
    //console.log("okok")
    //console.log(props.appContext.api_url);
    window.addEventListener("message", receiveMessage);
    return () => {
      window.removeEventListener("message", receiveMessage);
    }
  },[])

  const receiveMessage = (event) => {
    //if (event.origin !== "http://192.168.99.103:8081")
    //console.log(event.origin);
    //console.log(props.appContext.api_url);
    if (event.origin+'/' !== props.appContext.api_url)
    return;
    if(event.data){
      var gelen = JSON.parse(event.data);
      //console.log(gelen);
      if(gelen.type == 'editorPopupKapat'){
        tinymce.activeEditor.windowManager.close();
        $('.tox-browse-url').parent().find('.tox-textfield').val(gelen.file.url);
        //$('.tox-textfield').val("234232342");
      }
    }
    //console.log(event);
  }


  const elFinderBrowser = (callback, value, meta) => {
      var managerUrl = props.appContext.api_url + 'ApiAdmin/DosyaYonetim';
      var windowManagerCSS = '<style type="text/css">' +
          '.tox-dialog {max-width: 100%!important; width:80%!important; overflow: hidden; height:75%!important; border-radius:0.25em;}' +
          //'.tox-dialog__header{ display:none!important; }' +// for custom header in filemanage
          '.tox-dialog__footer { display: none!important; }' +// for custom footer in filemanage
          '.tox-dialog__body { padding: 0!important; }' +
          '.tox-dialog__body-content > div { height: 100%; overflow:hidden}' + 
          '</style > ';

          window.tinymceCallBackURL = '';
          window.tinymceCallBackFm = '';
          window.tinymceWindowManager = tinymce.activeEditor.windowManager;
          tinymceWindowManager.open(
              
              {
                  
                  title: 'File Manager',
                  body: {
                      type: 'panel',
                      items: [{
                          type: 'htmlpanel',
                          html: windowManagerCSS + '<iframe src="'+managerUrl+'"  frameborder="0" style="width:100%; height:500px;"></iframe>'
                      }]
                  },
                  buttons: [] ,
                  onClose: function () {}
              }
          );
  }
  const editorInit = () => {
    //console.log(props);
    
    tinymce.init({
      selector: 'div.tinyEditor' + (props.name?props.name:props.langId + '_' + props.valueSlug),
      plugins: ['paste', 'link', 'lists', 'table', 'image', 'media'],
      branding: false,
      menubar: false,
      statusbar: true,
      toolbar: `formatselect | bold italic underline strikethrough | 
      numlist bullist checklist pagebreak | 
      alignleft aligncenter alignright alignjustify | 
      link image imagetools table `,
      height: 300,
      //resize: 'both',
      //skin: false,
      //skin_url: '/styles/'
      style_formats: [
        {title: 'Paragraph', format: 'p'},
        {title: 'Header 1', format: 'h1'},
        {title: 'Header 2', format: 'h2'},
        {title: 'Header 3', format: 'h3'},
        {title: 'Header 4', format: 'h4'},
        {title: 'Header 5', format: 'h5'},
        {title: 'Header 6', format: 'h6'}        
      ],
      remove_script_host: false,
      file_picker_callback : elFinderBrowser,
      setup: function (ed) {
        ed.on('init', function () {
          //console.log(props.name);
          //console.log(props.value);
          //console.log(props.valueSlug);
          
          //var content = "<p>Hello World </p>";
          ed.setContent(props.value);
        });
        ed.on("change", function () {
          
          let gonder = {
            name: props.name,
            value: ed.getBody().innerHTML,
          }
          props.onChangeEditor(gonder);
          
          //console.log(ed.getBody().innerHTML);  
        })
      }
    });
    
    //console.log("eklendi");
    //tinyMCE.activeEditor.setContent(props.value);

    
  }


  const editorOnChange = () => {}
  //console.log(props.value);
  
  return(
    <div className={'tinyEditor' + (props.name?props.name:props.langId + '_' + props.valueSlug)} name={props.name}  ></div>
  )
}