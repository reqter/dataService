const Requests = require('../models/form');
var uniqid = require('uniqid');
var filter = function(req, cb)
{
    var c= undefined, ct, st, title;
    if (req.body.category)
        c = req.body.category.split(',');
    if (req.body.contentType)
        ct = req.body.contentType.split(',');
    if (req.body.status)
        st = req.body.status.split(',');
    if (req.body.title)
        title = req.body.title;
    var flt = {
        'sys.spaceId' : req.spaceId,
        title : title ,
        category : { $in : c} ,
        contentType : { $in : ct},
        status : { $in : st} 
    };
    if (!req.body.title)
        delete flt.title;
    if (!req.body.category)
        delete flt.category;
    if (!req.body.contentType)
        delete flt.contentType;
    if (!req.body.status)
        delete flt.status;
    console.log(flt);
    Requests.find(flt).populate('contentType', "title").populate('category', 'name').exec(function(err, contents){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (contents)
        {
            result.success = true;
            result.error = undefined;
            result.data =  contents;
            cb(result); 
        }
        else
        {
            result.success = false;
            result.data =  undefined;
            result.error = undefined;
            cb(result); 
        }
    });
};

var loadRequests = function(req, cb)
{
    Requests.find({"sys.spaceId" : req.spaceId}).populate('contentType', "title").populate('category', 'name')
    .exec(function(err, contents){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (Requests)
        {
            result.success = true;
            result.error = undefined;
            result.data =  contents;
            cb(result); 
        }
        else
        {
            result.success = false;
            result.data =  undefined;
            result.error = undefined;
            cb(result); 
        }
    });
};

var findAll = function(req, cb)
{
    Requests.find({"sys.spaceId" : req.spaceId}).populate('contentType', "title").populate('category', 'name').exec(function(err, contents){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (Requests)
        {
            result.success = true;
            result.error = undefined;
            result.data =  contents;
            cb(result); 
        }
        else
        {
            result.success = false;
            result.data =  undefined;
            result.error = undefined;
            cb(result); 
        }
    });
};
var findById = function(req, cb)
{
    Requests.findById(req.body.id).populate('contentType').populate('category').exec(function(err, form){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (form)
        {
            result.success = true;
            result.error = undefined;
            result.data =  form;
            cb(result); 
        }
        else
        {
            result.success = false;
            result.data =  undefined;
            result.error = undefined;
            cb(result); 
        }
    });
};

var findByLink = function(req, cb)
{
    console.log(req);
    Requests.findOne({"sys.link" : req.body.link}).populate('contentType').populate('category').populate("sys.issuer").exec(function(err, form){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (form)
        {
            result.success = true;
            result.error = undefined;

            result.data =  form;
            cb(result); 
        }
        else
        {
            result.success = false;
            result.data =  undefined;
            result.error = undefined;
            cb(result); 
        }
    });
};
var addContent = function(req, cb)
{
    console.log(req.body);
    var form = new Requests({
        sys : {},
        contentType : req.body.contentType,
        category : req.body.category,
        title : req.body.title,
        shortDesc : {},
        shortDesc : req.body.shortDesc,
        description : req.body.description,
        longDesc : {},
        longDesc : req.body.longDesc,
        thumbnail : req.body.thumbnail,
        attachments : req.body.attachments,
        partner : req.body.partner,
        type : req.body.type,
        startDate : req.body.startDate,
        endDate : req.body.endDate,
        featured : req.body.featured,
        status : "draft",
        statusLog : [],
        settings : req.body.settings
    });

    var newStatus = {}
    newStatus.code = "draft";
    newStatus.applyDate = new Date();
    newStatus.user = req.userId;
    newStatus.description = "Item created";
    form.status = "draft";
    form.statusLog.push(newStatus);

    form.sys.type = "form";
    form.sys.link = uniqid();
    form.sys.issuer = req.userId;
    form.sys.issueDate = new Date();
    form.sys.spaceId = req.spaceId;
    form.save(function(err){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        //Successfull. 
        //Publish user registered event
        result.success = true;
        result.error = undefined;
        result.data =  form;
        cb(result); 
    });
};

var deleteContent = function(req, cb)
{
     Requests.findById(req.body.id).exec(function(err, form){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (form)
        {
            Requests.remove({_id : form._id}, function(err){
                if(err)
                {
                    result.success = false;
                    result.data =  undefined;
                    result.error = err;
                    cb(result);       
                    return; 
                }
                //Successfull. 
                //Publish user account deleted event
                result.success = true;
                result.data =  {"message" : "Deleted successfully"};
                result.error = undefined;
                cb(result);       
                return; 
            });
            return;
        }
        else
        {
            result.success = false;
            result.data =  undefined;
            result.error = undefined;
            cb(result);       
            return; 
        }
    });
};

var updateContent = function(req, cb)
{
    if (!req.body)
    {
        var result = {success : false, data : null, error : null };
            if (err)
            {
                result.success = false;
                result.data =  undefined;
                result.error = "Invalid form";
                cb(result);       
                return; 
            }
    }
     Requests.findById(req.body.id).exec(function(err, form){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (form)
        {
            form.category = req.body.category;
            form.contentType = req.body.contentType;
            form.attachments = req.body.attachments;
            form.thumbnail = [];
            form.thumbnail = req.body.thumbnail;
            form.description = req.body.description;
            form.shortDesc = {};
            form.shortDesc = req.body.shortDesc;
            form.longDesc = {};
            form.longDesc = req.body.longDesc;
            form.title = req.body.title;
            form.partner = req.body.partner,
            form.type = req.body.type,
            form.startDate = req.body.startDate,
            form.endDate = req.body.endDate,
            form.featured = req.body.featured,
            form.settings = req.body.settings;
            if (form.status != "draft")
            {
                var newStatus = {}
                newStatus.code = "changed";
                newStatus.applyDate = new Date();
                newStatus.user = req.userId;
                newStatus.description = "Item updated";
                form.status = "changed";
                form.statusLog.push(newStatus);
            }
            form.sys.lastUpdater = req.userId;
             if (req.body.contentType)
                form.contentType = req.body.contentType;
            form.sys.lastUpdateTime = new Date();
            form.save(function(err){
                if(err)
                {
                    result.success = false;
                    result.data =  undefined;
                    result.error = err;
                    cb(result);       
                    return; 
                }
                //Successfull. 
                //Publish user profile updated event
                Requests.findById(req.body.id).exec(function(err, form){
                    if(err)
                    {
                        result.success = false;
                        result.data =  undefined;
                        result.error = err;
                        cb(result);       
                        return; 
                    }
                    result.success = true;
                    result.error = undefined;
                    result.data =  form;
                    cb(result); 
                    return
                });
            });
            return;
        }
        else
        {
            result.success = false;
            result.data =  undefined;
            result.error = undefined;
            cb(result);       
            return; 
        }
    });
};

var publishContent = function(req, cb)
{
     Requests.findById(req.body.id).exec(function(err, form){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (form)
        {
            console.log(req);
            form.publish(req.body.userId, req.body.description, function(err){
                if(err)
                {
                    result.success = false;
                    result.data =  undefined;
                    result.error = err;
                    cb(result);       
                    return; 
                }
                else
                {
                    result.success = true;
                    result.data =  form;
                    result.error = undefined;
                    cb(result);       
                    return; 
                }
            });
            return;
        }
        else
        {
            result.success = false;
            result.data =  undefined;
            result.error = undefined;
            cb(result);       
            return; 
        }
    });
};
var unPublishContent = function(req, cb)
{
     Requests.findById(req.body.id).exec(function(err, form){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (form)
        {
            form.unPublish(function(err){
                if(err)
                {
                    result.success = false;
                    result.data =  undefined;
                    result.error = err;
                    cb(result);       
                    return; 
                }
                else
                {
                    result.success = true;
                    result.data =  form;
                    result.error = undefined;
                    cb(result);       
                    return; 
                }
            });
            return;
        }
        else
        {
            result.success = false;
            result.data =  undefined;
            result.error = undefined;
            cb(result);       
            return; 
        }
    });
};
var archiveContent = function(req, cb)
{
     Requests.findById(req.body.id).exec(function(err, form){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (form)
        {
            form.archive(req.userId, req.body.description, function(err){
                if(err)
                {
                    result.success = false;
                    result.data =  undefined;
                    result.error = err;
                    cb(result);       
                    return; 
                }
                else
                {
                    result.success = true;
                    result.data =  form;
                    result.error = undefined;
                    cb(result);       
                    return; 
                }
            });
            return;
        }
        else
        {
            result.success = false;
            result.data =  undefined;
            result.error = undefined;
            cb(result);       
            return; 
        }
    });
};
var unArchiveContent = function(req, cb)
{
     Requests.findById(req.body.id).exec(function(err, form){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (form)
        {
            form.unArchive(function(err){
                if(err)
                {
                    result.success = false;
                    result.data =  undefined;
                    result.error = err;
                    cb(result);       
                    return; 
                }
                else
                {
                    result.success = true;
                    result.data =  form;
                    result.error = undefined;
                    cb(result);       
                    return; 
                }
            });
            return;
        }
        else
        {
            result.success = false;
            result.data =  undefined;
            result.error = undefined;
            cb(result);       
            return; 
        }
    });
};

exports.getAll = findAll;
exports.filter = filter;
exports.findById = findById;
exports.findByLink = findByLink;
exports.add = addContent;
exports.delete = deleteContent;
exports.update = updateContent;
exports.load = loadRequests;
exports.publish = publishContent;
exports.unPublish = unPublishContent;
exports.archive = archiveContent;
exports.unArchive = unArchiveContent;