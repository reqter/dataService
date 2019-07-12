var mongoose = require('mongoose');
var sysfld = require('./sys');
var request = require('./request');
var status = require('./status');
var Schema = mongoose.Schema;

var quote = new Schema({
    sys : {type:sysfld, required :true},
    formId : {type: Schema.Types.ObjectId, ref: 'Form' },
    request : {type: Schema.Types.ObjectId, ref: 'Request'},
    fields : {type : Object},
    status : {type : String, enum : ['created','published', 'approved', 'changed', 'accepted', 'closed'], default : 'created'},
    statusLog : [status],
    closeReason : {type : Object},
    versions : [Object],
    contentType : {type: Schema.Types.ObjectId, ref: 'ContentType' , required : true},
    category : {type: Schema.Types.ObjectId, ref: 'Category'},
    account : {type : Schema.Types.ObjectId, ref: 'Account'},
    contact : {type : Schema.Types.ObjectId, ref: 'Contact'}
});

quote.methods.setstatus = function(user, status, description, cb) {
  if (this.status != status)
  {
      var newStatus = {};
      newStatus.code = status;
      newStatus.applyDate = new Date();
      newStatus.user = user;
      newStatus.description = description;
      this.statusLog.push(newStatus);
      this.status = status;
      this.save(cb(undefined));
  }
  else
      cb("Quote already " + status + "!");
};

module.exports = mongoose.model("quote", quote);