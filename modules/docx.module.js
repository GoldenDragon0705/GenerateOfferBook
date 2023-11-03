const fs = require('fs')
const { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableCell, TableRow, WidthType, Media, TableOfContents, File, StyleLevel, HeadingLevel, SectionType, HeightRule, ImageFit, TableRowHeight, VerticalAlign, PageBreak } =  require('docx')
const { nativeImage } = require('electron')
const yargs = require('yargs')

const DocxModule = () => {
    const defaultImageCellWidth = 4500
    const defaultImageCellHeight = 5800
    const textHeight = 300


    const generateDocx = (productInfo, fileName) => {

        let allTables = [];
        let tempTables = [];
        let resultProducts = [];
        let temp = []
        let showResult = []

        productInfo.forEach((brandObj, index) => {
            const { brand, goods } = brandObj
            const nGoods = goods.length

            

            for(let i = 0;i < nGoods;i++){
                let table = getProductContent(goods[i])
                tempTables.push(table)
            }

            allTables.push({brand, tempTables})
            tempTables = []
        })
        
        allTables.forEach((byBrandObject, index) => {
            const { brand, tempTables } = byBrandObject
            const data = tempTables.reduce((acc, val, i) => {
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
            showResult = [
                new Paragraph({ text : brand}),
                new Table(result),
            ];
            resultProducts.push(new Paragraph({ text : brand}))
            resultProducts.push(new Table(result))
        })
        
        

    
        

        
    
        const doc = new Document({
            sections: [
                {
                properties: {
                    type: SectionType.NEXT_COLUMN
                },
                children: showResult
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
                        text: individualProductInfo.num
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
                    text : individualProductInfo.price,
                    
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