<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Dosya Yöneticisi</title>

		<!-- jQuery and jQuery UI (REQUIRED) -->
		<link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>assets/plugins/jquery-ui-1.12.1/jquery-ui.min.css">
		<script type="text/javascript" src="<?php echo base_url(); ?>assets/plugins/jquery-3.4.1.min.js" ></script>
		<script type="text/javascript" src="<?php echo base_url(); ?>assets/plugins/jquery-ui-1.12.1/jquery-ui.min.js" ></script>


		<link rel="stylesheet" type="text/css" media="screen" href="<?php echo base_url(); ?>assets/plugins/us-elfinder/css/elfinder.min.css">
		<link rel="stylesheet" type="text/css" media="screen" href="<?php echo base_url(); ?>assets/plugins/us-elfinder/css/theme.css">


		<script type="text/javascript" src="<?php echo base_url(); ?>assets/plugins/us-elfinder/js/elfinder.min.js"></script>




		<!-- elFinder translation (OPTIONAL)
		<script type="text/javascript" src="js/i18n/elfinder.ru.js"></script> -->

		<!-- elFinder initialization (REQUIRED) -->
		<script type="text/javascript" charset="utf-8">
		
		 // Helper function to get parameters from the query string.
			function getUrlParam(paramName) {
				var reParam = new RegExp('(?:[\?&]|&amp;)' + paramName + '=([^&]+)', 'i') ;
				var match = window.location.search.match(reParam) ;
				
				return (match && match.length > 1) ? match[1] : '' ;
			}

			$().ready(function() {
				var funcNum = getUrlParam('CKEditorFuncNum');

				var elf = $('#elfinder').elfinder({
					url : '<?php echo base_url(); ?>ApiAdmin/elfinder_init',
					/*getFileCallback : function(file) {
						window.opener.CKEDITOR.tools.callFunction(funcNum, file.url);
						window.close();
					},*/
					getFileCallback: function( file, el ){

						var gonder = {type: "editorPopupKapat", file:file };
						
						parent.postMessage(JSON.stringify(gonder), "*");
						
						/*var windowManager = top != undefined && top.tinymceWindowManager != undefined ? top.tinymceWindowManager : '';

						if (windowManager != '') {
								if (top.tinymceCallBackURL != undefined)
									top.tinymceCallBackURL = file;
									top.tinymceCallBackFm = el;
									windowManager.close();
						}*/


						//console.log("seçildi");
						//console.log(file['path']);
						//console.log(window.opener);
						//$('.tox-tbtn.tox-browse-url').parent().find('.tox-textfield').val(file['path']);						
					},
					/*commandsOptions: {
						getfile: {
							onlyURL: false,
							folders: false,
							multiple: false,
							oncomplete: "destroy"
						}
					},*/
					resizable: false,
					uiOptions: {
	                    toolbar : [
	                        // toolbar configuration
	                        ['open'],
	                        ['back', 'forward'],
	                        ['reload'],
	                        ['home', 'up'],
	                        ['mkdir', 'mkfile', 'upload'],
	                        ['info'],
	                        ['quicklook'],
	                        ['copy', 'cut', 'paste'],
	                        ['rm'],
	                        ['duplicate', 'rename', 'edit'],
	                        ['extract', 'archive'],
	                        ['search'],
	                        ['view','sort']//,
	                        //['help']
	                    ]
	                }
				}).elfinder('instance');
			});
		</script>
		
	</head>
	<body>

		<!-- Element where elFinder will be created (REQUIRED) -->
		<div id="elfinder"></div>
		
		
	</body>
</html>
