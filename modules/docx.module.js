const fs = require('fs')
const { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableCell, TableRow, WidthType, Media, TableOfContents, File, StyleLevel, HeadingLevel, SectionType, HeightType, ImageFit } =  require('docx')
const { nativeImage } = require('electron')

const DocxModule = () => {
    const defaultImageCellWidth = 4500
    const defaultImageCellHeight = 6000

    const generateDocx = (productInfo, fileName) => {

    let alltables = [];
    productInfo.forEach(byBrand => {
      byBrand.forEach(oneProductInfo => {
        const keys = Object.keys(oneProductInfo)
        if(keys.length > 0){
          const brandName = keys[0];
          const products = oneProductInfo[brandName];
          products.forEach(individualProductInfo => {
            let table = getProductContent(individualProductInfo)
  
            alltables.push(table)
          })
        }
      })
    });
  
  
    const data = alltables.reduce((acc, val, i) => {
      if (i % 2 === 0) {
        acc.push([]);
      }
      acc[acc.length - 1].push(val);
      return acc;
    }, []);
  
    const result = {
      rows: data.map(rowData => (
        new TableRow({
          children: rowData.map(cellData => (
            new TableCell({
              children: [cellData],
            })
          )),
        })
      )),
    };
  
    const doc = new Document({
      sections: [
        {
          properties: {
            type: SectionType.NEXT_COLUMN
          },
          children: [
            new Paragraph({ text: "Brand Name" }),
            new Table(
              result
            )
          ],
        },
      ],
    });
  
    // Used to export the file into a .docx file
    Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync(fileName + ".docx", buffer);
    });
    console.log('DOCX file created successfully!');
  }
  
  const getProductContent = (individualProductInfo) => {
  
    const tempImage = nativeImage.createFromPath(individualProductInfo.imagePath)
    const size = tempImage.getSize()
  
    const widthRatio =  size.width / defaultImageCellWidth
    const heightRatio =  size.height / defaultImageCellHeight
    const realRatio = Math.min(widthRatio, heightRatio)
  
    const realImageWidth = size.width * realRatio
    const realImageHeight = size.height * realRatio
  
    console.log(individualProductInfo)
  
    let image = new ImageRun({
      data: fs.readFileSync(individualProductInfo.imagePath),
      transformation : {
        width: 100,
        height: 100
      }
    });
  
  
    let table = new Table({
      rows: [
        new TableRow({
            children: [
                new TableCell({
                    width: {
                      size: defaultImageCellWidth,
                      type: WidthType.DXA
                    },
                    height: {
                      size: defaultImageCellHeight,
                      rule: 'exact'
                    },
                    children: [new Paragraph({children: [image]})],
                }),
            ],
            
        }),
        new TableRow({
            children: [
                new TableCell({
                    width: {
                        size: defaultImageCellWidth,
                    },
                    children: [new Paragraph(individualProductInfo.name)],
                }),
            ],
        }),
        new TableRow({
          children: [
              new TableCell({
                  width: {
                      size: defaultImageCellWidth,
                  },
                  children: [new Paragraph(individualProductInfo.symbol)],
              }),
          ],
        }),
        new TableRow({
          children: [
              new TableCell({
                  width: {
                      size: 3,
                  },
                  children: [new Paragraph(individualProductInfo.price)],
              }),
          ],
        }),
      ],
    }); 
  
  
  
    return table
  } 

  return  {
    generateDocx : generateDocx
  }
}

module.exports = DocxModule()