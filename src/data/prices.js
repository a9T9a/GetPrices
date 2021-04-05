// Güncel fiyatlar

const axios = require("axios")
const cheerio = require("cheerio")

export default async function getPrices(products,brands){
    let newProducts=[]
    products.forEach(product=>{                
        let brnd=brands.find(f=>{return f.id==product.brand})
        let price


        axios.get(product.link).then(res=>{
            const $ = cheerio.load(res.data)
            price = $(brnd.item[0]).find(brnd.item[1]).text()
            let n_price=""

            // alınan fiyatın eklerden temizlenmesi
            for(let i=0;i<price.length;i++){
                if(Number.isInteger(parseInt(price[i]))==true || price[i]=="." || price[i]==","){
                    if(price[i]==","){
                        n_price+="."
                    }else{
                        n_price+=price[i]
                    }
                }
            }

            //yeni fiyatın ürüne eklenmesi
            product.newPrice=parseFloat(n_price)
            if(product.newPrice<product.price){
                product.indirim=true
            }
            newProducts.push(product)
        }).catch(()=>{
            product.newPrice=product.price
            product.tukendi=true
            
            newProducts.push(product)
        })
        
    })
    return newProducts
}

