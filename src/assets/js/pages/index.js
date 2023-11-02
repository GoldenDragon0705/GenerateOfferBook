const inputNewBrandName = $('#new_brand_name');
const btnCreateBrand = $('#btn_create_brand');
const inputNewOfferName = $('#new_offer_name');
const btnCreateOffer = $('#btn_create_offer');

$(() => {
  "use strict";

  let selectedBrandName = "";
  let selectedOfferId = "";

  try {
    electron.loadFileNames(filenames => {
      // if none selected brand, loading images don't need
      if(!selectedBrandName || !selectedBrandName.length) return;

      if(!filenames.length) return;

      console.log(selectedOfferId);
      const itemsContainer = $('#' + selectedOfferId + ' .content-items[data-brandname="' + selectedBrandName + '"] .row');
      filenames.forEach(filename => {
        filename = filename.replaceAll("\\", "\/");
        itemsContainer.append('<div class="col-lg-2 col-md-3 col-sm-4 col-xs-6 item-block">\
                                <div class="img-container" dataPath="">\
                                  <div class="img-overlay">\
                                    <span class="img-avatar">\
                                      <i class="fa fa-plus-circle avatar-plus"></i>\
                                    </span>\
                                  </div>\
                                </div>\
                                <div class="form-group">\
                                  <label for="">* Name:</label>\
                                  <input type="text" class="form-control form-control-sm" name="name" placeholder="Ex: Short Shirt">\
                                </div>\
                                <div class="form-group">\
                                  <label for="">Symbol:</label>\
                                  <input type="text" class="form-control form-control-sm" name="symbol" placeholder="Ex: M, L, XL, 2XL">\
                                </div>\
                                <div class="form-group">\
                                  <label for="">* Price:</label>\
                                  <input type="text" class="form-control form-control-sm" name="price" placeholder="Ex: $ 23.4">\
                                </div>\
                              </div>');
<<<<<<< HEAD
        itemsContainer.find('.item-block:last .img-container').css('background-image', 'url(' + filename + ')');
        itemsContainer.find('.item-block:last .img-container').attr('dataPath', filename);
=======
        itemsContainer.find('.item-block:last .img-container').css('background-image', 'url(' + filename + ')').attr('data-imagepath', filename);
>>>>>>> aafd36460d55947abf7fea976cbfb26b82286976
      });
      itemsContainer.append('<div class="img-modal">\
                              <span class="img-close">&times;</span>\
                              <img class="img-bigShow"/>\
                              </div>\
                            </div>');

      const imgContainer = $('.img-container');
      const imgAvatar = $('.img-avatar');
      const imgModal = $('.img-modal');
      const imgBigShow = $('.img-bigShow');
      const imgClose = $('.img-close');

      imgAvatar.click((e) => {
        const imagePath = $(e.target.parentNode.parentNode.parentNode).attr('dataPath');
        imgBigShow.attr("src", imagePath);
        imgModal.show();
      });

      

      imgClose.click(() => {
        imgModal.hide();
      });


      
    });
  } catch (e) {
    console.log(e);
    console.log("This is web mode, not electron mode.");
  }
  

  const createBrandContainer = (brandName) => {
    const activeOfferId = $('#offer-contents .tab-pane.active').attr('id');
    $('#' + activeOfferId + ' .content-items:last').before('<div class="content-items container-fluid" data-brandname="' + brandName + '">\
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
      selectedOfferId = activeOfferId;
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

  const createOfferContainer = (newOfferName) => {
    const id = Date.now();
    $('#offer-tabs').append('<li class="nav-item">\
                              <a class="nav-link" data-bs-toggle="tab" href="#' + id + '">' + newOfferName + ' *</a>\
                            </li>');

    $('#offer-contents').append('<div class="tab-pane container-fluid" id="' + id + '" role="tabpanel">\
                                  <div class="d-flex py-3">\
                                    <div class="alert alert-success py-1 my-0 flex-grow-1 me-2">\
                                      <strong>2.</strong> Create new brand.\
                                    </div>\
                                    <button class="btn btn-sm btn-primary me-1 btn-offer-save">Save this offer</button>\
                                    <button class="btn btn-sm btn-danger me-1 btn-offer-pdf" data-bs-toggle="modal" data-bs-target="#create-pdf-preview">Generate PDF</button>\
                                    <button class="btn btn-sm btn-secondary btn-offer-close">Close</button>\
                                  </div>\
                                  <div class="content-items container-fluid">\
                                    <div class="d-flex justify-content-center">\
                                      <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#create-new-brand">Create new brand</button>\
                                    </div>\
                                  </div>\
                                </div>');

    $('button[data-bs-target="#create-new-brand"]').on("click", () => {
      setTimeout(() => {
        inputNewBrandName.focus();
      }, 500)
    });

    $('button[data-bs-target="#create-pdf-preview"]').on("click", () => {
      PDFUtil().preview(id);
    });

    // open this offer by default
    $('#offer-tabs a.nav-link.active').removeClass("active");
    $('#offer-tabs a.nav-link[href="#' + id + '"]').addClass("active");

    $('#offer-contents div.tab-pane.active').removeClass("active");
    $('#' + id + '').addClass("active");
  };
  
  inputNewBrandName.on('input', (e) => {
    let value = e.target.value;
    btnCreateBrand.attr('disabled', value.length?false:true);
  });
  
  inputNewOfferName.on('input', (e) => {
    let value = e.target.value;
    btnCreateOffer.attr('disabled', value.length?false:true);
  });

  inputNewBrandName.on("keypress", (e) => {
    const code = e.keyCode || e.charCode;
    if(code === 13 && e.target.value.length)  btnCreateBrand.click();
  });

  inputNewOfferName.on("keypress", (e) => {
    const code = e.keyCode || e.charCode;
    if(code === 13 && e.target.value.length)  btnCreateOffer.click();
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
    console.log('ok');
  });

  btnCreateOffer.on("click", (e) => {
    // get new offer name and validate it
    let newOfferName = inputNewOfferName.val();
    if(!newOfferName.length) return;

    createOfferContainer(newOfferName);
    // delete value of new offer name input and close this dialog
    inputNewOfferName.val('');
    btnCreateOffer.attr('disabled', true);
    $(e.target).parent().find('button[data-bs-dismiss]').click();
  });
  
  $('button[data-bs-target="#create-new-offer"]').on("click", () => {
    setTimeout(() => {
      inputNewOfferName.focus();
    }, 500)
  });

<<<<<<< HEAD
  

=======
 
>>>>>>> aafd36460d55947abf7fea976cbfb26b82286976

  // init functions
  createOfferContainer("My new offer");


});