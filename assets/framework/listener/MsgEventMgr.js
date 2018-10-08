
const EventProtocol = require("EventProtocol")
let MsgEventMgr = cc.Class({
    extends:EventProtocol,
    /**
     * @constructor
     */
    ctor:function(){
        
    },
    /**
     * @static
     */
    statics:{
        // 保存单实例，静态变量
        _instance:null,
        // 获取单实例
        getInstance(){
            if (!MsgEventMgr._instance){
                cc.log("MsgEventMgr new ok")
                MsgEventMgr._instance = new MsgEventMgr()
            }
            return MsgEventMgr._instance
        }
    }
})
cc.log("Load window.MsgEventMgr success!")
window.MsgEventMgr = MsgEventMgr