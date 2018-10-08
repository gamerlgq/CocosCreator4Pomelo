/**
 * 服务器主推的广播消息封装
 * @class
 */

let BroadcastMgr = cc.Class({
    extends:cc.Component,
    /**
     * @constructor
     */
    ctor:function() {
        this.broadcastRouteId = "onMessageData"
    },

    /**
     * @public
     */
    init:function(){
        this.socketMgr = SocketMgr.getInstance()
        // 接收服务器广播消息
        this._recieveBroadcast()
    },

    /**
     * @static
     */
    statics:{
        // 保存单实例，静态变量
        _instance:null,
        // 获取单实例
        getInstance(){
            if (!BroadcastMgr._instance){
                cc.log("BroadcastMgr new ok")
                BroadcastMgr._instance = new BroadcastMgr()
            }
            return BroadcastMgr._instance
        }
    },

    /**
     * 接收服务器广播消息
     * @inner
     */
    _recieveBroadcast:function(){
        this.socketMgr.onBroadcastMsgData(this.broadcastRouteId)
    }
})
cc.log("Load window.BroadcastMgr success!")
window.BroadcastMgr = BroadcastMgr