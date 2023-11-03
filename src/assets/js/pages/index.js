const inputNewBrandName = $('#new_brand_name');
const btnCreateBrand = $('#btn_create_brand');
const inputNewOfferName = $('#new_offer_name');
const btnCreateOffer = $('#btn_create_offer');
const inputNewDocName = $('#new_doc_name');
const btnCreateDoc = $('#btn_create_doc');



$(() => {
  "use strict";

  let selectedBrandName = "";
  let selectedOfferId = "";
  let productOfferInfo = [];

  try {
    electron.loadFileNames(filenames => {
      // if none selected brand, loading images don't need
      if(!selectedBrandName || !selectedBrandName.length) return;

      if(!filenames.length) return;

      console.log(selectedOfferId);
      const itemsContainer = $('#' + selectedOfferId + ' .content-items[data-brandname="' + selectedBrandName + '"] .row');
      filenames.forEach((filename, index) => {
        filename = filename.replaceAll("\\", "\/");
        itemsContainer.append('<div class="col-lg-2 col-md-3 col-sm-4 col-xs-6 item-block" data-productNumber="' + selectedBrandName + index + '">\
                                <div class="img-container" dataPath="">\
                                  <div class="img-overlay">\
                                    <span class="img-avatar">\
                                      <i class="fa fa-plus-circle avatar-plus"></i>\
                                    </span>\
                                  </div>\
                                </div>\
                                <div class="form-group">\
                                  <label for="">* Name:</label>\
                                  <input type="text" class="form-control form-control-sm" name="num" placeholder="Ex: Short Shirt">\
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
        itemsContainer.find('.item-block:last .img-container').css('background-image', 'url(' + filename + ')');
        itemsContainer.find('.item-block:last .img-container').attr('dataPath', filename);
        itemsContainer.find('.item-block:last .img-container').css('background-image', 'url(' + filename + ')').attr('data-imagepath', filename);
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

      const getProductOfferInfo = () => {
        productOfferInfo = [];
      

        $('.content-items').each(function(){
          // Get the brand name from the data-brandname attribute
          const brandName = $(this).data('brandname');
          if(brandName !== undefined)
          {
            // Create an object to hold product data
            const productInfo = [];

            // Loop through each item block
            $(this).find('.item-block').each(function() {
              const productNumber = $(this).data('productnumber');
              const imagePath = $(this).find('.img-container').attr('datapath');

              const name = $(this).find('input[name="num"]').val();
              const symbol = $(this).find('input[name="symbol"]').val();
              const price = $(this).find('input[name="price"]').val();
              
              // Create itemData
              const itemData = {
                productNumber,
                imagePath,
                name,
                symbol,
                price
              };

              // Add the item data to the product number key in the productInfo object
              productInfo.push(itemData);
            });
            const productAllInfo = [{[brandName] : productInfo}];
            productOfferInfo.push(productAllInfo);
          }
          
        });

        console.log(productOfferInfo);
      }

      getProductOfferInfo();

      $('.content-items input').change((e) => {
        getProductOfferInfo();
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
                              <a class="nav-link" data-bs-toggle="tab" href="#' + id + '" data-offername="' + newOfferName + '">' + newOfferName + ' *</a>\
                            </li>');

    $('#offer-contents').append('<div class="tab-pane container-fluid" id="' + id + '" role="tabpanel">\
                                  <div class="d-flex py-3">\
                                    <div class="alert alert-success py-1 my-0 flex-grow-1 me-2">\
                                      <strong>2.</strong> Create new brand.\
                                    </div>\
                                    <button class="btn btn-sm btn-primary me-1 btn-offer-save">Save this offer</button>\
                                    <button class="btn btn-sm btn-warning me-1 btn-offer-doc" data-bs-toggle="modal" data-bs-target="#create-doc-file">Generate Doc</button>\
                                    <button class="btn btn-sm btn-danger me-1 btn-offer-pdf">Generate PDF</button>\
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

    $('#' + id + ' button.btn-offer-pdf').on("click", () => {
      PDFUtil().generate(id);
    });
    
    $('button[data-bs-target="#create-doc-file"]').on('click', () => {
      setTimeout(() => {
        inputNewDocName.focus();
      }, 500)
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

  inputNewDocName.on('input', (e) => {
    let value = e.target.value;
    btnCreateDoc.attr('disabled', value.length?false:true);
  })

  inputNewBrandName.on("keypress", (e) => {
    const code = e.keyCode || e.charCode;
    if(code === 13 && e.target.value.length)  btnCreateBrand.click();
  });

  inputNewOfferName.on("keypress", (e) => {
    const code = e.keyCode || e.charCode;
    if(code === 13 && e.target.value.length)  btnCreateOffer.click();
  });

  inputNewDocName.on('keypress', (e) => {
    const code = e.keyCode || e.charCode;
    if(code === 13 && e.target.value.length) btnCreateDoc.click();
  })

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

  btnCreateDoc.on('click', (e) => {
    let newDocName = inputNewDocName.val();
    if(!newDocName.length) return;

    inputNewDocName.val('');
    btnCreateDoc.attr('disabled', true);
    $(e.target).parent().find('button[data-bs-dismiss]').click();
    window.electron.saveDocFileName(productOfferInfo, newDocName);
  })
  
  $('button[data-bs-target="#create-new-offer"]').on("click", () => {
    setTimeout(() => {
      inputNewOfferName.focus();
    }, 500)
  });

  // init functions
  createOfferContainer("My new offer");

});