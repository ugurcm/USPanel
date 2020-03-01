import React, {useState, useContext, useEffect} from 'react';
import tinymce from 'tinymce/tinymce';


// A theme is also required
import 'tinymce/themes/silver';

// Any plugins you want to use has to be imported
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';


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

  const editorInit = () => {
    //console.log(props);
    
    tinymce.init({
      selector: 'div.tinyEditor' + (props.name?props.name:props.langId + '_' + props.valueSlug),
      plugins: ['paste', 'link', 'lists', 'table'],
      branding: false,
      menubar: false,
      statusbar: true,
      toolbar: 'formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | forecolor backcolor casechange permanentpen formatpainter removeformat | numlist bullist checklist pagebreak | outdent indent | table ',
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