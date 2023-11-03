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
        const num = $(node).find('input[name="num"]').val();
        const symbol = $(node).find('input[name="symbol"]').val();
        const price = $(node).find('input[name="price"]').val();
        goods.push({ imagePath, num, symbol, price });
      });
      offerdata.push({ brand, goods });
    });
    
    // let sampleOfferData = [{ 
    //   "brand": "Gucci",
    //   "goods": [
    //     { "imagePath": "C:/Users/111/Pictures/items/61VeA-UsG0L.__AC_SY300_SX300_QL70_FMwebp_.jpg", "num": "12-1", "symbol": "M, L , XL, 2XL", "price": "20 $" },
    //     { "imagePath": "C:/Users/111/Pictures/items/71aX1gxLgrS._AC_UL480_FMwebp_QL65_.jpg", "num": "12-2", "symbol": "160-170, 170-200, 170-230", "price": "1220 $" },
    //     { "imagePath": "C:/Users/111/Pictures/items/91TnbO11-bS._AC_UL480_FMwebp_QL65_.jpg", "num": "12-3", "symbol": "38, 39, 40, 41, 42", "price": "120 $" },
    //     { "imagePath": "C:/Users/111/Pictures/items/download.jpg", "num": "12-4", "symbol": "230, 235, 240", "price": "5 $" },
    //     { "imagePath": "C:/Users/111/Pictures/items/images.jpg", "num": "12-5", "symbol": "98, 100, 102, 104", "price": "121212 $" }
    //   ] 
    // }];
    
    // offerdata = sampleOfferData;
   
    generatePdf("", offerdata);
    console.log(offerdata);
  };

  const generatePdf = (offername, data) => {
    electron.pdf({ offername, data });
  };

  // public functions
  return {
    preview: createPreviewContent
  };
};