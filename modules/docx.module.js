const fs = require('fs')
const { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableCell, TableRow, WidthType, Media, TableOfContents, File, StyleLevel, HeadingLevel, SectionType, HeightRule, ImageFit, TableRowHeight, VerticalAlign } =  require('docx')
const { nativeImage } = require('electron')

const DocxModule = () => {
    const defaultImageCellWidth = 4500
    const defaultImageCellHeight = 5800
    const textHeight = 300


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
  
    const fillWidth = 300
    const fillHeight = 385

    const widthRatio = fillWidth / size.width;
    const heightRatio = fillHeight / size.height;

    const realRatio = size.width > size.height ? widthRatio : heightRatio

    let realImageWidth = realRatio * size.width
    let realImageHeight = realRatio * size.height

    if(realImageWidth > fillWidth) realImageWidth = fillWidth
    if(realImageHeight > fillHeight) realImageHeight = fillHeight

  
    console.log(individualProductInfo)
  
    let image = new ImageRun({
      data: fs.readFileSync(individualProductInfo.imagePath),
      transformation : {
        width: realImageWidth,
        height:realImageHeight
      }
    });
  
  
    let table = new Table({
      rows: [
        new TableRow({
            children: [
                new TableCell({
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: defaultImageCellWidth,
                      type: WidthType.DXA
                    },
                    children: [new Paragraph({
                        alignment: 'center',
                        children: [image]})
                    ],
                }),
            ],
            height: {
                value: defaultImageCellHeight,
                rule: 'exact'
            },
            
        }),
        new TableRow({
            children: [
                new TableCell({
                    width: {
                        size: defaultImageCellWidth,
                    },
                    children: [new Paragraph({
                        alignment: 'center',
                        text: individualProductInfo.name
                    })],
                }),
            ],
            height: {
                value : textHeight,
                rule: 'exact'
            }
        }),
        new TableRow({
          children: [
              new TableCell({
                  width: {
                      size: defaultImageCellWidth,
                  },
                  children: [new Paragraph({
                    alignment: 'center',
                    text : individualProductInfo.symbol
                  })],
              }),
          ],
          height: {
            value : textHeight,
            rule: 'exact'
          }
        }),
        new TableRow({
          children: [
              new TableCell({
                  width: {
                      size: 3,
                  },
                  children: [new Paragraph({
                    alignment: 'center',
                    text : individualProductInfo.price
                  })],
              }),
          ],
          height: {
            value : textHeight,
            rule: 'exact'
          }
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