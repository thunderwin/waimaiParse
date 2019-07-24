var Parse = require('parse/node')
const Desk = Parse.Object.extend('Desk')



module.exports = {
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

