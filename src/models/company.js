
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sysfld = require('./sys');
/**
 * Schema definitions.
 */

 const company = new Schema({
    sys : {type:sysfld, required : true},
    name : {type : Object, required : true, max : 150},
    orgNumber : {type : String},
    email : {type : String},
    emailVerified : {type : Boolean},
    phoneNumberVerified : {type : Boolean},
    annualRevenue : {type : Number, default : 0},
    country : {type: Schema.Types.ObjectId, ref: 'Country'},
    city : {type: Schema.Types.ObjectId, ref: 'City'},
    reqistrationNo : {type : String},
    reqistrationNo : {type : String},
    numberOfEmployees : {type : Number, default : 0},
    phoneNumber : {type : String},
    fax : {type : String},
    industryName : {type : String},
    industryCode : {type : String},
    address : {type : Object},
    postalCode : {type :String},
    notification : {type : Boolean},
    location : {type : Object},
    logo : {type : Object},
    homepage : {type : String},
    relationType : {type : String, enum : ["supplier", "referral", "customer", "guarantor"], default : "customer"},
    rate : {type:Number,  default : 1},
    rules : [Object],
    owner : {type: Object},
    companyStatus : {type : String, default : 'active'},
    blacklisted : {type : Boolean},
    companyType : {type : String},//"Limited liability", ...
    companyTypeName : {type : String},//"Limited liability", ...
    creationDocument : {type: Schema.Types.ObjectId, ref: 'Asset'},
    latestBalanceSheet : {type: Schema.Types.ObjectId, ref: 'Asset'},
    latestBankAccountReport : {type: Schema.Types.ObjectId, ref: 'Asset'},
    latestChanges : {type: Schema.Types.ObjectId, ref: 'Asset'},//Last changes on legal registration office
    totalAssets : {type : Number},
    total_Equity : {type : Number},
    annual_revenue : {type : Number},
    net_margin : {type : Number},
    turnover : {type : Number},
    signatory_rights : {type : String},
    boardMembers : [Object],
    ceo : {type : Object},
    description : {type : String},
    cash_liquidity : {type : Number}
});

module.exports = mongoose.model('Company', company);