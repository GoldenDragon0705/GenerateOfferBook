$(() => {
  "use strict";

  electron.loadFileNames(filenames => {
    if(!filenames.length) return;
    const itemsContainer = $('#home .content-items .row');
    filenames.forEach(filename => {
      itemsContainer.append('');
    });
  });

  $('#btn_load_images').on("click", function() {
    const dialogConfig = {
      title: 'Select image files.',
      buttonLabel: 'Select',
      properties: ['openFile', 'multiSelections']
    };
    electron.openDialog('showOpenDialogSync', dialogConfig);
  });
  
});

