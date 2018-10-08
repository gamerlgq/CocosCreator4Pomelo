/**
 * 注册model
 * @class
 */

let ModelRegister = cc.Class({
    /**
     * @constructor
     */
    ctor:function() {
        
    },

    /**
     * 注册全局model
     * @public
     */
    registAll:function(){
        _registAll.call(this)
    },

    /**
     * @static
     */
    statics:{
        // 保存单实例，静态变量
        _instance:null,
        // 获取单实例
        getInstance(){
            if (!ModelRegister._instance){
                cc.log("ModelRegister new ok")
                ModelRegister._instance = new ModelRegister()
            }
            return ModelRegister._instance
        }
    },
})

window.ModelRegister = ModelRegister

function _registAll(){
    let simulator = GameSimulator.getInstance()
    let loginResp = LoginProtocol.resp
    let serverResp = ServerProtocol.resp
   //登录相关
    simulator.register_model(require("Model_Login"), "Model_Login",[
        loginResp.login_gete_resp,
        loginResp.login_connector_resp
    ])
}
