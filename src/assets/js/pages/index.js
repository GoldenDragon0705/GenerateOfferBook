$(() => {
  "use strict";

  let selectedBrandName = "";

  let inputNewBrandName = $('#new_brand_name');
  let btnCreateBrand = $('#btn_create_brand');

  try {
    electron.loadFileNames(filenames => {
      // if none selected brand, loading images don't need
      if(!selectedBrandName || !selectedBrandName.length) return;

      if(!filenames.length) return;
      const itemsContainer = $('#home .content-items[data-brandname="' + selectedBrandName + '"] .row');
      filenames.forEach(filename => {
        filename = filename.replaceAll("\\", "\/");
        itemsContainer.append('<div class="col-lg-2 col-md-3 col-sm-4 col-xs-6 item-block">\
                                <div class="img-container">\
                                </div>\
                                <div class="form-group">\
                                  <label for="">* Name:</label>\
                                  <input type="text" class="form-control form-control-sm" placeholder="Ex: Short Shirt">\
                                </div>\
                                <div class="form-group">\
                                  <label for="">Symbol:</label>\
                                  <input type="text" class="form-control form-control-sm" placeholder="Ex: M, L, XL, 2XL">\
                                </div>\
                                <div class="form-group">\
                                  <label for="">* Price:</label>\
                                  <input type="text" class="form-control form-control-sm" placeholder="Ex: $ 23.4">\
                                </div>\
                              </div>');
        itemsContainer.find('.item-block:last .img-container').css('background-image', 'url(' + filename + ')');
      });
    });
  } catch (e) {
    console.log(e);
    console.log("This is web mode, not electron mode.");
  }
  

  const createBrandContainer = (brandName) => {
    $('.content-items:last').before('<div class="content-items container-fluid" data-brandname="' + brandName + '">\
                                      <div>\
                                        <input type="text" class="brand-name text-center" value="' + brandName + '">\
                                      </div>\
                                      <div class="row">\
                                      </div>\
                                      <div class="d-flex justify-content-center my-3">\
                                        <button type="button" class="btn btn-primary btn_load_images">Import new images to this brand.</button>\
                                      </div>\
                                    </div>');

    $('.content-items[data-brandname="' + brandName + '"] button.btn_load_images').on("click", function() {
      selectedBrandName = brandName;
      const dialogConfig = {
        title: 'Select image files.',
        buttonLabel: 'Select',
        properties: ['openFile', 'multiSelections']
      };
      try {
        electron.openDialog('showOpenDialogSync', dialogConfig);
      } catch (e) {
        console.log(e);
      }
    });
  };
  
  inputNewBrandName.on('input', (e) => {
    let value = e.target.value;
    btnCreateBrand.attr('disabled', value.length?false:true);
  });

  inputNewBrandName.on("keypress", (e) => {
    const code = e.keyCode || e.charCode;
    if(code === 13 && e.target.value.length)  btnCreateBrand.click();
  });

  btnCreateBrand.on("click", (e) => {
    // get new brand name and validate it
    let newBrandName = inputNewBrandName.val();
    if(!newBrandName.length) return;

    createBrandContainer(newBrandName);
    // delete value of new brand name input and close this dialog
    inputNewBrandName.val('');
    btnCreateBrand.attr('disabled', true);
    $(e.target).parent().find('button[data-bs-dismiss]').click();
  });

  $('button[data-bs-target="#create-new-brand"]').on("click", () => {
    setTimeout(() => {
      inputNewBrandName.focus();
    }, 500)
  });
});

