const Quotes = require('../models/quote');
var uniqid = require('uniqid');
var filter = function(req, cb)
{
    var c= undefined, ct, st, title, form, request;
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
    if (req.body.requestId)
        form = req.body.requestId;
    var flt = {
        'sys.spaceId' : req.spaceId,
        title : title ,
        category : { $in : c} ,
        contentType : { $in : ct},
        status : { $in : st},
        formId : { $in : form} ,
        request : request
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
    if (!req.body.requestId)
        delete flt.request;
    console.log(flt);
    Quotes.find(flt).populate('contentType', "title").populate('category', 'name').populate('company').exec(function(err, contents){
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
    Quotes.find({"sys.spaceId" : req.spaceId}).populate('contentType', "title").populate('company', "orgNumber, name").populate('category', 'name').exec(function(err, contents){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (Quotes)
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
    Quotes.findById(req.body.id).populate('contentType').populate('company', "orgNumber, name").populate('category').exec(function(err, quote){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (quote)
        {
            result.success = true;
            result.error = undefined;
            result.data =  quote;
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
    Quotes.findOne({"sys.link" : req.body.link}).populate('contentType').populate('company', "orgNumber, name").populate('category').populate("sys.issuer").exec(function(err, quote){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (quote)
        {
            result.success = true;
            result.error = undefined;

            result.data =  quote;
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

var findByRequestId = function(req, cb)
{
    console.log(req);
    Quotes.findOne({"request" : req.body.requestId}).populate('contentType').populate('company', "orgNumber, name").populate('category').populate("sys.issuer").exec(function(err, quotes){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (quotes)
        {
            result.success = true;
            result.error = undefined;

            result.data =  quotes;
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
var addQuote = function(req, cb)
{
    console.log(req.body);
    var quote = new Quotes({
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
    quote.status = "created";
    quote.statusLog.push(newStatus);

    quote.sys.type = "quote";
    quote.sys.link = uniqid();
    quote.sys.issuer = req.userId;
    quote.sys.issueDate = new Date();
    quote.sys.spaceId = req.spaceId;
    quote.save(function(err){
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
        result.data =  quote;
        cb(result); 
    });
};

var deleteQuote = function(req, cb)
{
     Quotes.findById(req.body.id).exec(function(err, quote){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (quote)
        {
            Quotes.remove({_id : quote._id}, function(err){
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

var updateQuote = function(req, cb)
{
    if (!req.body)
    {
        var result = {success : false, data : null, error : null };
            if (err)
            {
                result.success = false;
                result.data =  undefined;
                result.error = "Invalid quote";
                cb(result);       
                return; 
            }
    }
     Quotes.findById(req.body.id).exec(function(err, quote){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (quote)
        {
            quote.category = req.body.category;
            quote.contentType = req.body.contentType;
            quote.fields = req.body.fields;
            
            if (quote.status != "created")
            {
                var newStatus = {}
                newStatus.code = "changed";
                newStatus.applyDate = new Date();
                newStatus.user = req.userId;
                newStatus.description = "Item updated";
                quote.status = "changed";
                quote.statusLog.push(newStatus);
            }
            quote.sys.lastUpdater = req.userId;
             if (req.body.contentType)
                quote.contentType = req.body.contentType;
            quote.sys.lastUpdateTime = new Date();
            quote.save(function(err){
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
                Quotes.findById(req.body.id).exec(function(err, quote){
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
                    result.data =  quote;
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
     Quotes.findById(req.body.id).exec(function(err, quote){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (quote)
        {
            console.log(req);
            quote.setstatus(req.body.userId, req.body.status, req.body.description, function(err){
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
                    result.data =  quote;
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
exports.findByRequest = findByRequestId;
exports.add = addQuote;
exports.delete = deleteQuote;
exports.update = updateQuote;
exports.setstatus = setStatus;