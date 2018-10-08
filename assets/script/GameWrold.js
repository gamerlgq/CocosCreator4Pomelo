/**
 * 初始化游戏一些全局对象
 */
const QUICK_TICK = 0.2//快tick
const SLOW_TICK = 1//慢tick
//全局的一个对象
let GameWorld = cc.Class({
    extends: cc.Component,
    /**
     * @inner
     */
    onLoad:function(){
        cc.log("Load GameWorld success!") 
        window.GameWorld = this   
        this._init()
    },

    /**
     * 内部初始化
     * @inner
     */
    _init:function(){
        try {
            this.quickTime = 0 //快tick计时
            this.slowTime = 0 //慢tick计时
            this._serverConfig = null;
            this._initServerConfig();
        } catch (error) {
            Log.logErrorMsg(error)
        }     
    },
    /**
     *  读取serverConfig
     * @inner
     */
    _initServerConfig:function(){
        if (!this._serverConfig) {
            let jsonUrl = "data/ServerConfig";
            cc.loader.loadRes(jsonUrl,(error,results) => {
                if (error) {
                    Log.logErrorMsg(error)
                    return
                }
                cc.log("Load serverConfig success !");
                this._serverConfig = results.json
                this._initGameWorld()
            })
        }else{
            return this._serverConfig
        }
    },

    /**
     * 初始化游戏层一些公共函数
     * @inner
     */
    _initGameWorld:function(){
        // setLog
        Log.setLog(4)
        // 注册gameSimulator
        GameSimulator.getInstance().init()
        // 注册model
        ModelRegister.getInstance().registAll()
        // 注册creator
        ViewCreatorRegister.getInstance().registAll()
        // 初始化socket
        SocketMgr.getInstance().init()
        // 初始化httpMgr
        HttpMgr.getInstance().init()
        // 初始化广播
        BroadcastMgr.getInstance().init()
    },

    /**
     * 获取服务器配置表
     * @public
     */
    getServerConfig:function(){
        return this._serverConfig
    },

    /**
     * update per frame(每帧刷新全局tick计时器)
     * @inner
     */
    update:function(dt){
        this._quickTickHandler(dt)
        this._slowTickHandler(dt)
    },

    /**
     * 快tick
     * @inner
     */
    _quickTickHandler:function(dt){
        this.quickTime = this.quickTime + dt
        // 快tick
        if (this.quickTime >= QUICK_TICK) {
            GameSimulator.getInstance().tick()
            this.quickTime = 0
        }
    },

    /**
     * 慢tick
     * @inner
     */
    _slowTickHandler:function(dt){
        this.slowTime = this.slowTime + dt
        // 慢tick
        if (this.slowTime >= SLOW_TICK) {
            // GameSimulator.getInstance().receiveMsgEvent()
            this.slowTime = 0
        }
    },

})