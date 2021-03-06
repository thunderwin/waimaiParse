let Parse = require('parse/node');
const MapTagBusiness = Parse.Object.extend('MapTagBusiness')
const Shop = Parse.Object.extend("Shop")
// const MapShopCategory = Parse.Object.extend("Category")

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
    uploadShop: req =>{    //商家上传 新建商家信息
        // const Shop = Parse.Object.extend("shop")

        let shop = new Shop()   
        let p = req.params

        console.log('uploadedParams:',p)
        console.log("price_type:",typeof(Number(p.price)))

        let categoryId = 'QwfEQ3dZfS'  //test
        let categoryPointer = Parse.Object.extend("Category").createWithoutData(categoryId)   //pointer

        return shop.set({
            shopName:p.shopName,
			phoneNumber: p.phoneNumber,					
			openTime:p.openTime,
			closeTime:p.closeTime,
            region:p.region,
            address:p.address,
            price:Number(p.price),
            shopTagList:p.shopTagList,
            category:categoryPointer
            
        }).save()
               //console.log(shopInfo.shopName)
    },

    getShopList: async req =>{
        let r = await new Parse.Query('Shop').find()
        return r.map(x=>x._toFullJSON())
    },
    
    getShopList_avrhighest: async req =>{
        let r = await new Parse.Query('Shop').descending('price').find()  
        return r.map(x=>x._toFullJSON())
    },
    getShopList_avrlowest: async req =>{
        let r = await new Parse.Query('Shop').ascending('price').find()  
        return r.map(x=>x._toFullJSON())
    },

    getShopList_tag_sort: async req =>{   //既有人均排序又有tag过滤
        let p = req.params
        let resarr = []

        console.log("tag_sort_params:",p)

        let customerTags = []
        for(let key in p){
            if(key != 'sortType'){customerTags.push(Number(p[key]))}
        }
        let shopInfos = await new Parse.Query('Shop').find()
        let allShopArr = shopInfos.map(x=>x._toFullJSON())
        let allShopTagArr = allShopArr.map(x =>{     //所有商家tag列表的列表
            return x.shopTagList
        })
        let isContainedList = []    //满足要求的商家列表

        for(index in allShopArr){
            let isContained = true      //比较customerTag是否为shopTag的子集
            let thisShopTag = allShopTagArr[index]
            for (var i = 0 ;i < customerTags.length;i++) {
                if(thisShopTag.indexOf(customerTags[i]) < 0) 
                isContained = false;
            }
            if(isContained == true){isContainedList.push(index)}        
        }
        let sortedShops = []  //结果列表

        for(let j of isContainedList){
            console.log("resultShopItemId:",allShopArr[j])
            sortedShops.push(allShopArr[j])
        }
        
        console.log("sortedShops:",sortedShops)


        function compare(property,type){   //封装排序函数
            return function(obj1,obj2){
                var value1 = obj1[property]
                var value2 = obj2[property]
                if(type == 0){
                    return value1 - value2    // 升序
                }else if(type == 1){
                    return value2 - value1
                }

            }
        }
        if(p.sortType == 'avr_highest'){   //tag过滤之后价格从高往低排
            resarr = sortedShops.sort(compare("price",1)) 
        }else if(p.sortType == 'avr_lowest'){   //tag过滤之后价格从低往高排
            resarr = sortedShops.sort(compare("price",0))
        }else if(p.sortType == 'rating'){  //tag过滤之后按照评分排序
            console.log("rating...")
        }

        console.log("resarr:",resarr)
        return resarr

        
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

        let shopInfos = await new Parse.Query('Shop').find()
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
            }
            if(isContained == true){isContainedList.push(index)}        
        }
        console.log("isContainedList:",isContainedList)
        let sortedShops = []

        for(let j of isContainedList){
            console.log("resultShopItemId:",allShopArr[j])
            sortedShops.push(allShopArr[j])
        }
        
        console.log("sortedShops:",sortedShops)
        return sortedShops

    },


}

