/**
 * 返回的数据结构:{msgId:xxxx,msg{code,{data}}}
 * @class
 */
let MsgEvent = class MsgEvent{
    constructor(data){
        this._data = data || {msgId:-1,msg:{}}
    }
    getMsgId(){
        return this._data.msgId
    }
    getMsg(){
        return this._data.msg
    }
    getResultCode(){
        return this._data.msg[0]
    }
    getMsgData(){
        return this._data.msg[1]
    }
}
cc.log("Load window.MsgEvent success!")
window.MsgEvent = MsgEvent