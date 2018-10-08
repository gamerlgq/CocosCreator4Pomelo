/**
 * Game管理器
 * @class
 */
let GameSimulator = cc.Class({
    extends:cc.Component,
    /**
     * @constructor
     */
    ctor:function () {
        this.isServerMsgQueueReverse = false
        this.nameModelMap = new Map() //model名字对应 model 的Map表
        this.idModelMap = new Map() //事件id 对应处理 model 的Map表
        this._creaters = new Array() //界面创建者集合
        this.serverMessageQueue_ = new Array()//服务端消息队列
    },

    /**
     * @static
     */
    statics:{
        // 保存单实例，静态变量
        _instance:null,
        // 获取单实例
        getInstance(){
            if (!GameSimulator._instance){
                cc.log("GameSimulator new ok")
                GameSimulator._instance = new GameSimulator()
            }
            return GameSimulator._instance
        }
    },

    /**
     * @public
     */
    init:function(){

    },
    /**
     * @public 注册model
     * @param model_cls model类 
     * @param model_name model名称
     * @param protocol_id_List 监听model的协议列表
     */
    register_model:function(model_cls, model_name, protocol_id_List){
        let model = new model_cls()
        this.nameModelMap.set(model_name,model)
        if (typeof(protocol_id_List) == "object" || typeof(protocol_id_List) == "array") {
            protocol_id_List.forEach(protocol_id => {
                this.idModelMap.set(protocol_id,model)
            });
        }
    },
    /**
     * @public
     * @param key model key
     */
    getModel:function(key){
        if (!this.nameModelMap.has(key)){
            cc.error("===>>> Can't find model,key:"+key)
        }else{
            return this.nameModelMap.get(key)
        }
    },
    /**
     * @public
     * 注册view creator
     */
    register_view_creater:function(creator_package_path){
        let creater = new require(creator_package_path)
        this._creaters.push(creater)
    },

    /**
     * @public
     * 添加网络消息
     */
    addNetMessage:function(msgEvent){
        this.serverMessageQueue_.push(msgEvent)
    },

    /**
     * @public
     * 0.2秒tick 一次，分发server msg
     */
    tick:function(){
        // 反转message queue
        if (!this.isServerMsgQueueReverse){
            this.serverMessageQueue_.reverse()
            this.isServerMsgQueueReverse = true
        }
        // 分发 server msg
        while (this.serverMessageQueue_.length > 0 ){
            let msgEvent = this.serverMessageQueue_.pop()
            this._receiveMsgEvent(msgEvent)
        }

        this.isServerMsgQueueReverse = false
    },

    /**
     * @inner 分派msgEvent 到 model receiveMsg方法
     * @param msgEvent 自封装的msgEvent
     */
    _receiveMsgEvent:function(msgEvent){
        let msgId = msgEvent.getMsgId()
        cc.log("msgId",msgId)
        if (this.idModelMap.has(msgId)) {
            let model = this.idModelMap.get(msgId)
            model.receiveMsg(msgEvent)
        }
        MsgEventMgr.getInstance().dispatchEvent(msgEvent)
        
    },
})
window.GameSimulator = GameSimulator