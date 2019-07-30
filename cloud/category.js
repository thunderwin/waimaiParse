//商家上传菜品 分类
let Parse = require('parse/node')
const Food = Parse.Object.extend("food")
const Categories = Parse.Object.extend("Categories")
const MapShopCategory = Parse.Object.extend("MapShopCategory")


module.exports = {
    postCategory: async req=>{
        
        let p = req.params   //{ category: '甜点', shop: '1' }
        console.log("params:",p)
       
        let category = new Categories()
        let mapShopCategory = new MapShopCategory()

        let r = await category.set({
            categoryName:p.categoryName,  //如果表里面有这个分类了 理应去重 还没做
            categoryPosition:p.categoryPosition,
            categoryStatus:1
        }).save()

        console.log("rr:",r.id)
        let categoryId = r.id
        let categoryPointer = Parse.Object.extend("Categories").createWithoutData(categoryId)

        let d = await mapShopCategory.set({
            categoryPointer:categoryPointer
        }).save()

       
       


       console.log("p.shop:",Number(p.shop))
        

    }

}