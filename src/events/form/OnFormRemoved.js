var broker = require('../../rpcserver');
function OnFormRemoved(){
    var _onOkCallBack
    function _onOk (result) {
        if (_onOkCallBack) {
        _onOkCallBack(result)
        }
    }
    
    function _call(conntent) {
        console.log('event triggered.')
        broker.publish("dataservice", "formremoved", conntent);
        _onOk(conntent);
    }
    return {
            call: _call,
            onOk: function (callback) {
                _onOkCallBack = callback
                return this
            }
    }
}

exports.OnFormRemoved = OnFormRemoved;

