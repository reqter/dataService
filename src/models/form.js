var mongoose = require('mongoose');
var sysfld = require('./sys');
var field = require('./field');
var Status = require('./status');
var Schema = mongoose.Schema;
 
var form = new Schema({
    sys : {type : sysfld, required : true},
    title : {type : Object, required : true},
    shortDesc : {type : Object},
    description : {type : Object},
    longDesc : {type : Object},
    contentType : {type: Schema.Types.ObjectId, ref: 'ContentType' , required : true},
    category : {type: Schema.Types.ObjectId, ref: 'Category'},
    partner : {type : Schema.Types.ObjectId, ref : 'Partners'},
    thumbnail : [Object],
    attachments : [Object],
    featured : {type : Boolean, default : false},
    startDate : {type : Date},
    endDate : {type : Date},
    template : {type : Object},
    type : {type : String, enum : ['request', 'quote']},
    status : {type : String, enum : ['draft', 'published', 'changed', 'archived'], default : 'draft'},
    statusLog : [Status],
    fields : [Object],
    settings : {type : Object}
});

form.methods.publish = function(user, description, cb) {
    if (this.status != "published")
    {
        var newStatus = {}
        newStatus.code = "published";
        newStatus.applyDate = new Date();
        newStatus.user = user;
        newStatus.description = description;
        this.statusLog.push(newStatus);
        this.status = "published";
        this.save(cb(undefined));
    }
    else
        cb("Item already published!");
};

form.methods.unPublish = function(cb) {
    if (this.status === "published" && this.statusLog.length > 0)
    {
        this.statusLog.pop();
        this.status = this.statusLog[this.statusLog.length - 1].code;
        this.save(cb);
    }
    else
        cb("Error in unPublishing item!");
};

form.methods.archive = function(user, description, cb) {
    if (this.status != "archived")
    {
        var newStatus = {};
        newStatus.code = "archived";
        newStatus.applyDate = new Date();
        newStatus.user = user;
        newStatus.description = description;
        this.status = "archived";
        this.statusLog.push(newStatus);
        this.save(cb);
    }
    else
        cb("Item already archived!");
};

form.methods.unArchive = function(cb) {
    if (this.status === "archived" && this.statusLog.length > 0)
    {
        this.statusLog.pop();
        this.status = this.statusLog[this.statusLog.length - 1].code;
        this.save(cb);
    }
    else
        cb("Error in unArchiving item!");
};

module.exports = mongoose.model("form", form);