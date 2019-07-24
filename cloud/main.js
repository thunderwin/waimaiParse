let item = require('./item')
let user = require('./user')
let order = require('./order')
let business = require('./business')
let category = require('./category')
let desk = require('./desk')
let tag = require('./tag')


for (x in item) { Parse.Cloud.define(x, item[x]) }
for (x in user) { Parse.Cloud.define(x, user[x]) }
for (x in order) { Parse.Cloud.define(x, order[x]) }
for (x in business) { Parse.Cloud.define(x, business[x]) }
for (x in category) { Parse.Cloud.define(x, category[x]) }
for (x in desk) { Parse.Cloud.define(x, desk[x]) }
for (x in tag) { Parse.Cloud.define(x, tag[x]) }


// Parse.Cloud.define('hello', function(req, res) {
//   return 'Hi';
// });
