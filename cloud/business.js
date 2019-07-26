let Parse = require('parse/node');
const MapTagBusiness = Parse.Object.extend('MapTagBusiness')
const Shop = Parse.Object.extend("shop")

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

    getShopList: async req =>{
        let r = await new Parse.Query('shop').find()
        return r.map(x=>x._toFullJSON())
    },

    getShopList_avrhighest: async req =>{
        let r = await new Parse.Query('shop').descending('price').find()   //因为price是字符串所以排序不是按照数字大小排
        return r.map(x=>x._toFullJSON())
    },
    getShopList_avrlowest: async req =>{
        let r = await new Parse.Query('shop').ascending('price').find()  
        return r.map(x=>x._toFullJSON())
    },

    uploadShop: req =>{    //商家上传 新建商家信息

        let shop = new Shop()   
        let p = req.params

        console.log('uploadedParams:',p)
        console.log("type:",typeof(Number(p.price)))


        return shop.set({
            shopName:p.shopName,
			phoneNumber: p.phoneNumber,					
			openTime:p.openTime,
			closeTime:p.closeTime,
            region:p.region,
            address:p.address,
            price:Number(p.price),
            shopTagList:p.shopTagList
            
        }).save()
        

        //console.log(shopInfo.shopName)
    }
    


}

