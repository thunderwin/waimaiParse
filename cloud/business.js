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
        let r = await new Parse.Query('shop').descending('price').find()   
        return r.map(x=>x._toFullJSON())
    },
    getShopList_avrlowest: async req =>{
        let r = await new Parse.Query('shop').ascending('price').find()  
        return r.map(x=>x._toFullJSON())
    },
    getShopList_tagFiltered: async req =>{
        let p = req.params
        console.log("rrrrrrForTag:",p)
        // console.log(r[3])
        //JSON.s
        let customerTags = []
        for(let key in p){
            customerTags.push(Number(p[key]))
        }
        console.log("customerTags:",customerTags)   //tagsArr: [ 0, 4, 1, 2, 3 ]

        let shopInfos = await new Parse.Query('shop').find()
        console.log("shopTags:",shopInfos)
        console.log("allShopArr",shopInfos.map(x=>x._toFullJSON()))
        let allShopArr = shopInfos.map(x=>x._toFullJSON())
        //onsole.log(shopTags.map(x=>x._toFullJSON()))
        let allShopTagArr = allShopArr.map(x =>{     //所有商家tag列表的列表
            return x.shopTagList
        })





        console.log("allShopTagArr:",allShopTagArr)
        console.log("customerTags:",customerTags)   //tagsArr: [ 0, 4, 1, 2, 3 ]
        
        let isContainedList = []    //满足要求的商家列表

        for(index in allShopArr){
            let isContained = true      //比较customerTag是否为shopTag的子集
            // console.log(allShopTagArr[index])  
            let thisShopTag = allShopTagArr[index]
            //要判断  customertags 是 thisshoptag 的子集 每一个shoptag是thisShopTag
            console.log("thisShopTag:",thisShopTag)
            console.log("customerTags:",customerTags)
          
            console.log("thisShopTag.length:",thisShopTag.length) //1,2,5

            for (var i = 0 ;i < customerTags.length;i++) {
                if(thisShopTag.indexOf(customerTags[i]) < 0) 
                isContained = false;
                console.log("res:",isContained)
            }
            if(isContained == true){isContainedList.push(index)}        
        }
        console.log("isContainedList:",isContainedList)


        




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

