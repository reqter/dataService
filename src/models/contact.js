
/**
 * Module dependencies.
 */
var sysfld = require('./sys');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/**
 * Schema definitions.
 */

 const contact = new Schema({
    sys : {type:sysfld, required : true},
    company : {type : Schema.Types.ObjectId, ref="Company"},
    first_name : {type : Object, required : true},
    last_name : {type : Object, required : true},
    birth_info : {type : Object},
    personalNumber : {type : Number},
    phoneNumber : {type : String},
    homePhone : {type : String},
    citizenship : {type : String},
    email : {type : String},
    phoneNumberVerified : {type : Boolean},
    emailVerified : {type : Boolean},
    country : {type : Schema.Types.ObjectId, ref="Country"},
    city : {type : Schema.Types.ObjectId, ref="City"},
    postalCode : {type : Object},
    address : {type : Object},
    aml_kyc_hit : {type : Boolean},
    notification : {type : Boolean},
    location : {type : Object},
    avatar : {type : Object},
    favorites : [Object],
    info : {type : Object},
    owner : {type: Object},
    gender : {type: String, enum : ['male', 'female', 'other']},
    status : {type: String},
    description : {type: Object}
});

module.exports = mongoose.model('Contact', contact);