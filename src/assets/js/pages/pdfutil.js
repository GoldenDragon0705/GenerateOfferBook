const PDFUtil = () => {

  const generateOfferData = offerId => {
    let offerdata = [];
    let goods = [];
    const brands = $('#' + offerId + ' [data-brandname]').map((index, node) => $(node).attr('data-brandname'));
    const nBrands = brands.length;
    brands.each((index, brand) => {
      goods = [];
      $('[data-brandname="' + brand + '"] div.item-block').each((index, node) => {
        const imagePath = $(node).find('.img-container').attr('data-imagepath');
        const num = $(node).find('input[name="num"]').val();
        const symbol = $(node).find('input[name="symbol"]').val();
        const price = $(node).find('input[name="price"]').val();
        goods.push({ imagePath, num, symbol, price });
      });
      offerdata.push({ brand, goods });
    });
    
    
    return offerdata;
    
  };

  // public functions
  return {
    generate: (id) => {
      const offerdata = generateOfferData(id);
      const offername = $('[href="#' + id + '"]').attr('data-offername');
      const dialogConfig = {
        title: 'Select path for save.',
        buttonLabel: 'Save',
        properties: ['saveFile'],
        filters: [{
          name: "PDF file", extensions: ["pdf"]
        }, { name: 'All Files', extensions: ['*'] }]
      };
      electron.saveDialog(dialogConfig, { offername, offerdata });
    }
  };
};