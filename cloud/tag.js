let Parse = require('parse/node');
const MapTagBusiness = Parse.Object.extend('MapTagBusiness')
module.exports = {

    addtTag: async req => {
        let mapTagBusiness = new MapTagBusiness()
        let tagPointer = Parse.Object.extend('Tag').createWithoutData(req.params.tagId)
        let businessPointer = Parse.Object.extend('Business').createWithoutData(req.params.businessId)
        return await mapTagBusiness.set({
            tag:tagPointer,
            business:businessPointer
        }).save()
    },

    getBusinessTag: async req => {
       
        let businessPointer = Parse.Object.extend('Business').createWithoutData(req.params.businessId)
        return await new Parse.Query('MapTagBusiness').equalTo('business',businessPointer).find()
    }
}
