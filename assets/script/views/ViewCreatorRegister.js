/**
 * 界面注册全部写这里
 * @class
 */
let ViewCreatorRegister = cc.Class({
    /**
     * @constructor
     */
    ctor:function() {
        this.simulator = GameSimulator.getInstance()
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
            if (!ViewCreatorRegister._instance){
                cc.log("ViewCreatorRegister new ok")
                ViewCreatorRegister._instance = new ViewCreatorRegister()
            }
            return ViewCreatorRegister._instance
        }
    },
})

window.ViewCreatorRegister = ViewCreatorRegister

function _registAll(){
    // simulator:register_view_creater("./scripts/views/Test/Cretor.")
}
