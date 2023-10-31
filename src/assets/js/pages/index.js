$(() => {

  "use strict";

  electron.loadFileNames(filenames => {
    console.log(filenames);
  });

  $('#btn_load_images').on("click", function() {
    const dialogConfig = {
      title: 'Select a file',
      buttonLabel: 'This one will do',
      properties: ['openFile']
    };
    electron.openDialog('showOpenDialogSync', dialogConfig)
        .then(result => {
          result.then(rss => {
            
          })
        }).catch(err => {
          
        });
    
  });
  
});

