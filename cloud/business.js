let Parse = require('parse/node');
const MapTagBusiness = Parse.Object.extend('MapTagBusiness')

module.exports = {
    getBusiness : req => {
        let businesses = await new Parse.Query('Business').limit(10).find()
        // let 
        let promises = businesses.map( x => {
            let businessPointer = Parse.Object.extend('Business').createWithoutData(x.id)
            return new Parse.Query('mapTagBusiness').equalTo('business',businessPointer).find()
        })

       let tags =  await Promise.all( promises ).then()

       return businesses.map( (x,index) => {
           x.tags = tags[index]
       })

    }
}