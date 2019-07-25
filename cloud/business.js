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
        // console.log("r[0]",r[0])
        //console.log(r)   
          
        let idarr = r.map((x,index)=>{    //取出id idarr
            return x.id
        })
        console.log("idarr:",idarr) 
        return idarr

        // return r.map(x => x._toFullJSON())
    },


    uploadShop: req =>{    //商家上传 新建商家信息

        let shop = new Shop()   
        let p = req.params

        console.log('uploadedParams:',p)


        return shop.set({
            shopName:p.shopName,
			phoneNumber: p.phoneNumber,					
			openTime:p.openTime,
			closeTime:p.closeTime,
            region:p.region,
            address:p.address
            
        }).save()

        //console.log(shopInfo.shopName)
    }
    


}

