let CCNode = cc.Class({
    extends:cc.Component,
    ctor:function(){
        this._eventMsgListeners = new Map()
    },
    start:function(){
        this.addListener()
    },
    /**
     * 协议监听，子类重写方法
     * @public
     */
    addListener:function () {
        
    },  
    /**
     * 添加msgLintener
     * @public
     * @param eventName 添加事件监听名称
     * @param listener 回调函数
     */
    addMsgListener:function(eventName, listener){
        if (!eventName){
            return
        }
        let handleId = MsgEventMgr.getInstance().addEventListener(eventName, listener)
        if (!this._eventMsgListeners.has(handleId)){
            this._eventMsgListeners.set(handleId,eventName)
        }
    },
    /**
     *  移除对这个消息的监听,某些情况node里面需要动态加减某个消息监听
     * @public
     */
    removeMsgListener:function(eventName){
        this._eventMsgListeners.forEach((eventName, handleId, map)=>{
            if (key == eventName){
                MsgEventMgr.getInstance().removeEventListener(eventName, handleId)
                this._eventMsgListeners.delete(key)
            }
        })
    },
    /**
     * 去掉网络消息监听
     * @public
     */
    removeAllMsgListener:function(){
        this._eventMsgListeners.forEach((value, key, map)=>{
            MsgEventMgr.getInstance().removeEventListener(value, key)
        })
        self._eventMsgListeners.clear()
    },

    /**
     * node 移除
     */
    onDestroy:function(){
        this.removeAllMsgListener()
    }
})
cc.log("Load window.CCNode success!")
window.CCNode = CCNode