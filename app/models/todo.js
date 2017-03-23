// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

module.exports = mongoose.model('Todo', {
    text : String,
    done : Boolean,
    user_id : ObjectId
});