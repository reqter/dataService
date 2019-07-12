var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var city = new Schema({
    country : {type: Schema.Types.ObjectId, ref: 'Country'},
    code : {type:Number, required :true, unique:true},
    name : {type : Object, max:100, required:true}
});

module.exports = mongoose.model("City", city);