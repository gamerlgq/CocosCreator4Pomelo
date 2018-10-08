let EventProtocol = cc.Class({
    ctor:function () {
        this.listeners_ = new Map()
        this.listenerHandleIndex_ = 0
        this.isDispatchEventing = false
        this.waitAddListeners_ = new Array()
        this.waitDelListeners_ = new Array()
    },
    /**
     * 添加监听事件
     * @public
     * @param eventName 事件id
     * @param listener 回调函数
     */
    addEventListener:function(eventName, listener){
        if (!this.listeners_.has(eventName)){
            this.listeners_.set(eventName,new Map())
        }
        this.listenerHandleIndex_ = this.listenerHandleIndex_ + 1
        let handle = "HANDLE_"+this.listenerHandleIndex_

        if (this.isDispatchEventing) {
            this.waitAddListeners_.push({eventName,listener,handle})
            return handle
        }
        let newMap = this.listeners_.get(eventName)
        newMap.set(handle,listener)
        return handle
    },

    /**
     * 分派监听事件
     * @param msgEvent 事件event对象
     */
    dispatchEvent:function(msgEvent){
        this.isDispatchEventing = true

        let eventName = msgEvent.getMsgId()
        if (!this.listeners_.has(eventName)) {
            this.isDispatchEventing = false
            return
        }

        let listener_map = this.listeners_.get(eventName)
        cc.log("listener_map:",this.listeners_.has(eventName))
        listener_map.forEach((listener, handleId, map)=>{
            //is wait del== 0 callback
            if (this.waitDelListeners_.length == 0) {
                listener(msgEvent)
            }else{
                cc.log("wait Del eventName:"+eventName+",handleId"+handleId)
            }
        });

        this.isDispatchEventing = false

        // 添加待加入listener队列
        for (let index = 0; index < this.waitAddListeners_.length; index++) {
            const element = this.waitDelListeners_[index]
            if (element){
                if(!this.listeners_.has(element.eventName)){
                    this.listeners_.set(element.eventName,new Map())
                }
                let listener_map = his.listeners_.get(element.eventName)
                listener_map.set(element.handleId,element.listener)
            }
        }

        // 删除等待删除队列中的事件
        for (let index = 0; index < this.waitDelListeners_.length; index++) {
            const element = this.waitDelListeners_[index];
            if (element){
                this.removeEventListener(element,index)
            }
        }

        this.waitAddListeners_ = []
        this.waitDelListeners_ = []
    },

    /**
     * 移除监听事件
     * @param eventName 监听事件名称
     * @param handlerId 回调函数id(同一个事件名称支持多个回调函数)
     * @public
     */
    removeEventListener:function(eventName, handleId){
        // 如果正在分派中加入等待删除队列
        if (this.isDispatchEventing) {
            this.waitDelListeners_[handleId] = eventName
            return 
        }
        // 如果没有这个监听事件
        if (!this.listeners_.has(eventName)) {
            return
        }
        let listener_map = this.listeners_.get(eventName)
        listener_map.forEach((value,key,map)=>{
            if (key == handleId || key == value){
                listener_map.delete(key)
                return
            }
        })
    },

    /**
     * 移除eventName下的所有listener
     * @param eventName 监听事件名称
     */
    removeAllEventListenersForEvent:function(eventName){
        let listener_map = this.listeners_.get(eventName)
        listener_map.clear()
        listener_map = null
    },

    /**
     * 移除所有listener
     */
    removeAllEventListeners:function(){
        this.listeners_.clear()
        this.listeners_ = null
    }
})
cc.log("Load window.EventProtocol success!")
module.exports = EventProtocol