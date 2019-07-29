var Parse = require('parse/node')
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
        const shopList = await query.find()
        // let temp = shopList.map(x=>x._toFullJSON())
        //console.log("***************", temp)
        for(let key in shopList){
            console.log("++++++++++",JSON.stringify(shopList[6].get("ItemPointer")))
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

