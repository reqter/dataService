var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var country = new Schema({
    code : {type:Number, required :true, unique:true},
    name : {type : Object, max:100, required:true}
});

module.exports = mongoose.model("Country", country);