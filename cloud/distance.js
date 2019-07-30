﻿var Parse = require('parse/node')
const Desk = Parse.Object.extend('Desk')



module.exports = {
    nearestShop: async req=> {
        let p = req.params
        console.log("shjop:",p.shop)

        console.log('test')
       
        let ShopList = Parse.Object.extend("ShopList")
        let shopList = new ShopList()
        let point = new Parse.GeoPoint({latitude: 3.0002, longitude: 4.0002});
        
        
        // shopList.set({
        //     "shopName":"有喜屋",
        //     "url":"https://img.meituan.net/msmerchant/e074d1bc0479dfb532a68199b1c35221125464.png%40280w_212h_1e_1c_1l%7Cwatermark%3D0",
        //     "average":150,
        //     "comment":"味道好！",
        //     "location": point
        // }).save()
        
        const distance = 2;
        const sorted = true;
        const query = new Parse.Query(ShopList);
        // query.near("location", userGeoPoint);
        query.withinKilometers("location", point, distance, sorted);
        // query.limit(3);
        const placesObjects = await query.find();
        console.log("placesObjects",placesObjects)
        let idarr = placesObjects.map((x,index)=>{    //取出id idarr
            return x.id
        })
        console.log('idarr ',idarr) 
        placesObjects.map((x,index)=>{
            // for(let key in idarr){
                let key = 0
                if(x.id == idarr[key]){
                    // console.log("details",placesObjects.map(x=>x._toFullJSON()))
                    
                }
            // }
        })
        // console.log((placesObjects.map(x=>x._toFullJSON()))[0].shopName)
        //return placesObjects.map(x=>x._toFullJSON())
        let temp = placesObjects.map(x=>x._toFullJSON())
        let afterSortedShopList = []
        for(let key in temp){
            //console.log(temp[key].shopName)
            var shop = {}
            shop.shopName = temp[key].shopName
            shop.url = temp[key].url
            shop.average = temp[key].average
            shop.comment = temp[key].comment
            afterSortedShopList.push(shop)
        }
        //console.log(afterSortedShopList)
        return afterSortedShopList

        //console.log('details', r.map(x=>x._toFullJSON()))
        
        
        // console.log(shopList[0].shopName)
    },

    showShop: async req=> {
        let p = req.params
        let ShopList = Parse.Object.extend("ShopList")
        let shopList = new ShopList()
        let point = new Parse.GeoPoint({latitude: 3.0003, longitude: 4.0003});
        const query = new Parse.Query(ShopList);
        query.near("location", point);
        const placesObjects = await query.find();
        console.log("placesObjects",placesObjects)
        let temp = placesObjects.map(x=>x._toFullJSON())
        console.log("temp",temp)
        let afterShopList = []
        for(let key in temp){
            //console.log(temp[key].shopName)
            var shop = {}
            shop.shopName = temp[key].shopName
            shop.url = temp[key].url
            shop.average = temp[key].average
            shop.comment = temp[key].comment
            afterShopList.push(shop)
        }
        return afterShopList
    },

    sortShopOfAvrhigh: async req=> {
        let p = req.params
        let ShopList = Parse.Object.extend("ShopList")
        let shopList = new ShopList()
        let point = new Parse.GeoPoint({latitude: 3.0003, longitude: 4.0003});
        const distance = 2;
        const sorted = false;
        const query = new Parse.Query(ShopList);
        query.withinKilometers("location", point, distance, sorted);
        query.descending("average");
        const placesObjects = await query.find();
        let temp = placesObjects.map(x=>x._toFullJSON())
        let afterShopList = []
        for(let key in temp){
            //console.log(temp[key].shopName)
            var shop = {}
            shop.shopName = temp[key].shopName
            shop.url = temp[key].url
            shop.average = temp[key].average
            shop.comment = temp[key].comment
            afterShopList.push(shop)
        }
        return afterShopList
    },


    sortShopOfAvrlow: async req=> {
        let p = req.params
        let ShopList = Parse.Object.extend("ShopList")
        let shopList = new ShopList()
        let point = new Parse.GeoPoint({latitude: 3.0003, longitude: 4.0003});
        const distance = 2;
        const sorted = false;
        const query = new Parse.Query(ShopList);
        query.withinKilometers("location", point, distance, sorted);
        query.ascending("average");
        const placesObjects = await query.find();
        let temp = placesObjects.map(x=>x._toFullJSON())
        let afterShopList = []
        for(let key in temp){
            //console.log(temp[key].shopName)
            var shop = {}
            shop.shopName = temp[key].shopName
            shop.url = temp[key].url
            shop.average = temp[key].average
            shop.comment = temp[key].comment
            afterShopList.push(shop)
        }
        return afterShopList
    },



    leadToStoreHome: async req =>{
        let ShopList = Parse.Object.extend("ShopList")
        const query = new Parse.Query("ShopList")
        const shopList = await query.find();
        let temp = shopList.map(x=>x._toFullJSON())
        let tempO = temp[2]
        // console.log(tempO.objectId)
        //console.log(tempO)


        let r = await new Parse.Query('mapShopCatgItem').find()

        const q = new Parse.Query('mapShopCatgItem')
        let qq = await q.include("itemPointer").find()


        console.log("************",qq)
        //console.log(r.map(x=>x._toFullJSON())) 
        let rr = r.map(x=>x._toFullJSON())
        var getCategoryPointer = []
        for (let key in rr){
            //console.log(rr[key].shopPointer)
            if(rr[key].shopPointer.objectId == tempO.objectId){
                //获得ParseObject { _objCount: 26, className: 'mapShopCatgItem', id: 'i4A5OXlpN1' }
                //var getColumn = await new Parse.Query('mapShopCatgItem').equalTo('ShopPointer',rr[key].ShopPointer).find()
                //获得中间表中符合的ShopPointer那些行的CategoryPointer的字符串
                getCategoryPointer.push(rr[key].categoryPointer.objectId)
            }
        }
        getCategoryPointer = new Set(getCategoryPointer)
        console.log("cat",getCategoryPointer)
        for(let x of getCategoryPointer){
            console.log(x)
        }

        let shopMenuList = []
        let catr = await new Parse.Query('Categories').find()
        let catrr = catr.map(x=>x._toFullJSON())
        let itemr = await new Parse.Query('Items').find()
        let itemrr = itemr.map(x=>x._toFullJSON())
        for(let x of getCategoryPointer){ 
            for (let key in catrr){
                if(catrr[key].objectId == x && catrr[key].catgStatus == 1){
                    let shopMenu = {}
                    shopMenu.id =  catrr[key].catgPosition
                    shopMenu.name = catrr[key].categoryName
                    // for(let index in itemrr){
                    //     if(itemrr[index].itToCatPointer.objectId == x && itemrr[index].itemStatus == 1){
                    //         let items = []
                    //         items.itemId = itemrr[index].itemPosition
                    //         items.itemName = itemrr[index].itemName
                    //         items.itemPrice = itemrr[index].itemPrice
                    //         console.log("----------",items)
                    //         shopMenu.items = items
                    //     }
                    // }
                    shopMenuList.push(shopMenu)
                }
            }
        }
        var by = function (prop) {
            return function(obj1, obj2) {
                var val1 = obj1[prop];
                var val2 = obj2[prop];
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }            
            }
        }
        shopMenuList.sort(by("id"));
        console.log("+++++++++++",shopMenuList)


        // var getCategoryName = []
        // for (let key in getCategoryPointer){
        //     console.log(getCategoryPointer[key])
        //     var CategoryName = await new Parse.Query("Categories").equalTo('objectId',getCategoryPointer[key]).find()
        //     getCategoryName.push(CategoryName)
        //     console.log(getCategoryName)
        // }
        // console.log("catname",getCategoryName)
        
        //console.log(test[0].ItemPointer)
        console.log("---------------",temp[2]._toFullJSON())
        // console.log(shopList[0]._toFullJSON())
        return(shopList.map(x=>x._toFullJSON()))

        
        for(let key in shopList){
            console.log(Json.stringify(shopList[6]))
            console.log("++++++++++",shopList[6].get("shopToMap"))
            let tempPointer =shopList[6].get("ItemPointer")
            console.log(JSON.stringify(tempPointer.get("bala")))
        }
        var user = Parse.User.current();
        var relation = user.relation("likes");
        relation.add(post);
        user.save();
    }, 


    



    addDesk: async req => {
        let p = req.params
        
        let businessId = req.user.id

        let businessPointer = Parse.User.createWithoutData(businessId)

        let desk = new Desk()
        return await desk.set({
            id: p.id,
            business:businessPointer,
            note:p.note
        }).save()
        
    },

    deskList: async req => {
        return await new Parse.Query('Desk').equalTo('business',req.params.businessId).equalTo('status',0).descending('createdAt').find()
    },

    editDesk: async req => {
        let p = req.params

        let deskId = p.deskId
        let newNote = p.note
        let deskPointer = Parse.Object.extend('Desk').createWithoutData(deskId)

       return await deskPointer.set({
            note:newNote
        }).save()
        
    }
    
}

