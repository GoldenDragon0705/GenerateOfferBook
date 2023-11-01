const PDFUtil = () => {

  const createPreviewContent = offerId => {
    let offerdata = [];
    let goods = [];
    const brands = $('#' + offerId + ' [data-brandname]').map((index, node) => $(node).attr('data-brandname'));
    const nBrands = brands.length;
    brands.each((index, brand) => {
      goods = [];
      $('[data-brandname="' + brand + '"] div.item-block').each((index, node) => {
        const imagePath = $(node).find('.img-container').attr('data-imagepath');
        const name = $(node).find('input[name="name"]').val();
        const symbol = $(node).find('input[name="symbol"]').val();
        const price = $(node).find('input[name="price"]').val();
        goods.push({ imagePath, name, symbol, price });
      });
      offerdata.push({ brand, goods });
    });
  };

  // public functions
  return {
    preview: createPreviewContent
  };
};