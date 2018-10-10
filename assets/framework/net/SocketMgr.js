/**
 * 
 * #### API简介
 * 无论是socket.io的还是websocket的，都提供了统一的API，下面对这些API进行简单的介绍。
 * pomelo.init(params, cb)
 * parms = {
 *      host:,
 *      port:,
 *      maxReconnectAttempts,
 *      reconnect,
 *      encrypt,
 *      handshakeCallback,
 *      log,
 * }
 * 
 * 这是往往是客户端的第一次调用，params中应该指出要连接的服务器的ip和端口号，cb会在连接成功后进行回调;
 * pomelo.request(route, msg, cb)
 * 
 * 请求服务，route为服务端的路由，格式为"..", msg为请求的内容，cb会响应回来后的回调;
 * pomelo.notify(route, msg)
 * 
 * 发送notify，不需要服务器回响应的，因此没有对响应的回调，其他参数含义同request;
 * pomelo.on(route, cb)
 * 
 * 这个是从EventEmmiter继承过来的方法，用来对服务端的推送作出响应的。route会用户自定义的，格式一般为"onXXX";
 * pomelo.disconnect()
 * 这个是pomelo主动断开连接的方法。
 */

let SocketMgr = cc.Class({
    /**
     * @constructor
     */
    ctor:function(){
        this._serverConfig = null;
    },

    /**
     * @static
     */
    statics:{
        // 保存单实例，静态变量
        _instance:null,
        // 获取单实例
        getInstance(){
            if (!SocketMgr._instance){
                cc.log("SocketMgr new ok")
                SocketMgr._instance = new SocketMgr()
            }
            return SocketMgr._instance
        }
    },

    /**
     * 初始化 pomelo client，外部接口
     * @public
     */
    init:function(){
        // 服务器配置
        this._serverConfig = GameWorld.getServerConfig()
        // 初始化pomelo client
        this._initPomelo()
    },

    /**
     * 初始化链接pomelo
     * @inner 
     */
    _initPomelo:function(){
        try {
            Log.netMsgReqLog(["Gate Server","host:",this._serverConfig.host,"port:",this._serverConfig.port])
            //  先连接Gate服务器
            this._loginGateServer()
        } catch (error) {
            Log.logErrorMsg(error) 
        }
    },

    /**
     * login gate server,均衡负载后返回connector服务器host,port
     * @inner
     */
    _loginGateServer:function(){
        let params = {
            host : this._serverConfig.host,
            port : this._serverConfig.port,
            reconnect : true,
            log:true,
            encrypt:true,
            wss:true
        }
        // init pomelo client
        this._initPomeloClient(params,() => {
            let serverId = LoginProtocol.req.login_gete_req
            let msg = {uid:12345,openId:67890}
            this.sendMsg(serverId,msg,(msgEvent)=>{
                if (Log.showErrorRespMsg(msgEvent)){
                    Log.netMsgReqLog("连接Gate服务器成功!")
                    this._loginConnectorServer(msgEvent)
                }
            })
        })
    },

    /**
     * login connector server
     * @inner
     * @param msgData {code:200,host:xxxx,port:xxxx}
     */
    _loginConnectorServer:function(msgEvent){
        // 断开gate服务器连接
        this.disconnect(()=>{
            // 均衡负载后返回connector服务器host,port
            let msgData = msgEvent.getMsgData()
            let h = msgData.host === 'localhost' ? this._serverConfig.host : msgData.host
            let p = msgData.port
            // 连接connector服务器
            let params = {
                host : h,
                port : p,
                reconnect : true,
                log:true,
                wss:true,
                encrypt:true
            }
            this._initPomeloClient(params,()=>{
                let serverId = LoginProtocol.req.login_connector_req
                let msg = {uid:12345,openId:67890}
                this.sendMsg(serverId,msg,(msgData)=>{
                    if (Log.showErrorRespMsg(msgData)){
                        Log.netMsgReqLog("连接Connector服务器成功!")
                    }
                })
            })
        })
    },

    /**
     * init pomelo client
     * @inner
     * @param parms = {
     *      host:,
     *      port:,
     *      maxReconnectAttempts,
     *      reconnect,
     *      encrypt,
     *      handshakeCallback,
     *      log,
     * } = 
     * @param cb callback
     */
    _initPomeloClient:(params,cb) =>{
        try {
            Log.netMsgReqLog("初始化pomelo client成功!")
            pomelo.init(params, cb)
        } catch (error) {
            Log.logErrorMsg(error) 
        }
    },

    /**
     * 发送数据到pomelo服务器
     * @public
     * @param serverId 协议id
     * @param msg 传输内容 type object
     * @param cb 传输成功回调,返回msgEvent
     */
    sendMsg:(serverId,msg,cb) => {
        try {
            Log.netMsgReqLog(["send msg:",serverId,msg])
            pomelo.request(serverId,msg,(onMessageData)=>{
                let msgEvent = new MsgEvent(onMessageData)
                GameSimulator.getInstance().addNetMessage(msgEvent)
                if (cb) {
                    cb(msgEvent)
                }
            });   
        } catch (error) {
            Log.logErrorMsg(error) 
        }
    },

    /**
     * 收到服务器广播消息(只接受广播消息)
     * @public
     */
    onBroadcastMsgData:(serverId) =>{
        try {
            pomelo.on(serverId, function(msgData){
                Log.netMsgRespLog(["收到广播服务器信息:",msgData])
                let msgEvent = new MsgEvent(msgData)
                GameSimulator.getInstance().addNetMessage(msgEvent)
            })
        } catch (error) {
            Log.logErrorMsg(error)
        }
    },

    /**
     * 关闭连接
     * @public
     * @param {*} cb callback
     */
    disconnect:(cb) =>{
        try {
            Log.netMsgReqLog("Try to Disconnect Pomelo Client!")
            pomelo.disconnect(function(){
                Log.netMsgReqLog("Pomelo Client Disconnet Success!")
                if (cb) {
                    cb()
                }
            });
        } catch (error) {
            Log.logErrorMsg(error) 
        }
    }
})
cc.log("Load window.SocketMgr success!")
window.SocketMgr = SocketMgr