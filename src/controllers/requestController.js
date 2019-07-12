const Requests = require('../models/request');
var uniqid = require('uniqid');
var filter = function(req, cb)
{
    var c= undefined, ct, st, title, form;
    if (req.body.category)
        c = req.body.category.split(',');
    if (req.body.contentType)
        ct = req.body.contentType.split(',');
    if (req.body.status)
        st = req.body.status.split(',');
    if (req.body.title)
        title = req.body.title;
    if (req.body.formId)
        form = req.body.formId.split(',');
    var flt = {
        'sys.spaceId' : req.spaceId,
        title : title ,
        category : { $in : c} ,
        contentType : { $in : ct},
        status : { $in : st},
        formId : { $in : form} 
    };
    if (!req.body.title)
        delete flt.title;
    if (!req.body.category)
        delete flt.category;
    if (!req.body.contentType)
        delete flt.contentType;
    if (!req.body.status)
        delete flt.status;
    if (!req.body.formId)
        delete flt.formId;
    console.log(flt);
    Requests.find(flt).populate('contentType', "title").populate('category', 'name').populate('company').exec(function(err, contents){
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

var findAll = function(req, cb)
{
    Requests.find({"sys.spaceId" : req.spaceId}).populate('contentType', "title").populate('company', "orgNumber, name").populate('category', 'name').exec(function(err, contents){
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
    Requests.findById(req.body.id).populate('contentType').populate('company', "orgNumber, name").populate('category').exec(function(err, request){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (request)
        {
            result.success = true;
            result.error = undefined;
            result.data =  request;
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
    Requests.findOne({"sys.link" : req.body.link}).populate('contentType').populate('company', "orgNumber, name").populate('category').populate("sys.issuer").exec(function(err, request){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (request)
        {
            result.success = true;
            result.error = undefined;

            result.data =  request;
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
var submitRequest = function(req, cb)
{
    console.log(req.body);
    var request = new Requests({
        sys : {},
        contentType : req.body.contentType,
        category : req.body.category,
        formId : req.body.formId,
        fields : req.body.fields,
        status : "created",
        statusLog : [],
        contact : req.body.contact,
        account : req.body.account
    });

    var newStatus = {}
    newStatus.code = "created";
    newStatus.applyDate = new Date();
    newStatus.user = req.userId;
    newStatus.description = "Item created";
    request.status = "created";
    request.statusLog.push(newStatus);

    request.sys.type = "request";
    request.sys.link = uniqid();
    request.sys.issuer = req.userId;
    request.sys.issueDate = new Date();
    request.sys.spaceId = req.spaceId;
    request.save(function(err){
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
        result.data =  request;
        cb(result); 
    });
};

var deleteRequest = function(req, cb)
{
     Requests.findById(req.body.id).exec(function(err, request){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (request)
        {
            Requests.remove({_id : request._id}, function(err){
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

var updateRequest = function(req, cb)
{
    if (!req.body)
    {
        var result = {success : false, data : null, error : null };
            if (err)
            {
                result.success = false;
                result.data =  undefined;
                result.error = "Invalid request";
                cb(result);       
                return; 
            }
    }
     Requests.findById(req.body.id).exec(function(err, request){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (request)
        {
            request.category = req.body.category;
            request.contentType = req.body.contentType;
            request.fields = req.body.fields;
            if (request.status != "created")
            {
                var newStatus = {}
                newStatus.code = "changed";
                newStatus.applyDate = new Date();
                newStatus.user = req.userId;
                newStatus.description = "Item updated";
                request.status = "changed";
                request.statusLog.push(newStatus);
            }
            request.sys.lastUpdater = req.userId;
             if (req.body.contentType)
                request.contentType = req.body.contentType;
            request.sys.lastUpdateTime = new Date();
            request.save(function(err){
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
                Requests.findById(req.body.id).exec(function(err, request){
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
                    result.data =  request;
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

var setStatus = function(req, cb)
{
     Requests.findById(req.body.id).exec(function(err, request){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (request)
        {
            console.log(req);
            request.setstatus(req.body.userId, req.body.status, req.body.description, function(err){
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
                    result.data =  request;
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
exports.submit = submitRequest;
exports.delete = deleteRequest;
exports.update = updateRequest;
exports.setstatus = setStatus;