let Parse = require('parse/node');
const MapTagBusiness = Parse.Object.extend('MapTagBusiness')
const ShopInfo = Parse.Object.extend("shopInfo")

module.exports = {
    getBusiness : req => {    //获得商家信息
        let businesses = new Parse.Query('Business').limit(10).find()
        // let 
        let promises = businesses.map( x => {
            let businessPointer = Parse.Object.extend('Business').createWithoutData(x.id)
            return new Parse.Query('mapTagBusiness').equalTo('business',businessPointer).find()
        })

       let tags = Promise.all( promises ).then()

       return businesses.map( (x,index) => {
           x.tags = tags[index]
       })

    },

    uploadShop: req =>{
        let shopInfo = new ShopInfo()   //新建商家信息
        let p = req.params
        console.log('uploadedParams:',p)
        


    }
}