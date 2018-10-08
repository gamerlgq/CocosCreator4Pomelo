// 简单遍历对象

let Log = {}

Log._logLevel = 4
// 设置输出等级
Log.setLog = (lvls) =>{
    Log._logLevel=lvls
}
/**
 * dump方法，用于打印对象
 * @param {*} obj 传入的对象 type [object]
 * @param {*} desc 描述，用于console标记，便于查找 type [string]
 * @param {*} nesting 嵌套层数,默认2层,如果遍历到时object，继续遍历打印输出
 */
Log.dump = (obj,desc,nesting) =>{
    if (Log._logLevel >= 4) {
        if (!obj){
            return cc.error("Error:dump arguments must be a object")
        }else{
            nesting = nesting || 2
            desc = desc || "dump"
            let keys = Reflect.ownKeys(obj)
            cc.log(desc+": {")
            keys.forEach(key => {
                if (nesting > 1){
                    if (typeof(obj[key]) == "object") {
                        nesting = nesting - 1
                        Log.dump(obj[key],"      \""+key+"\"",nesting)
                    }
                    else{
                        cc.log("      \""+key+"\""+" : "+"\""+obj[key]+"\"")
                    }
                }else{
                    cc.log("      \""+key+"\""+" : "+"\""+obj[key]+"\"")
                }
            });
            cc.log("}")
        }
    }
}

// 打印错误信息
/**
 * 
 * @param {*} error 自定义打印错误对象
 */
Log.logErrorMsg = error =>{
    if (Log._logLevel >= 2) {
        if (!error) {return cc.error("logErrorMsg:Error is nil!")}
        cc.error("\""+cc.js.getClassName(error)+"\" {")
        cc.error("\"message\" : "+error.message)
        cc.error("\"line\" : "+error.line)
        cc.error("\"column\" : "+error.column)
        cc.error("\"sourceURL\" : "+error.sourceURL)
        cc.error("\"stack\" : "+error.stack)
    }
}

// 网络请求输出
/**
 * 
 * @param {*} msgs string or array
 */
Log.netMsgReqLog = msgs =>{
    if (Log._logLevel >= 4) {
        if (typeof(msgs)== "string"){
            cc.log("[Message Req  Log]=======>:"+"["+msgs+"]")
        }else if (typeof(msgs)== "array" || typeof(msgs) == "object"){
            let msgStr = "["
            let objs = []
            for (let index = 0; index < msgs.length; index++) {
                const msg = msgs[index];
                if (typeof(msg) == "object") {
                    objs.push(msg)
                    if (index == msgs.length - 1){
                        msgStr = msgStr + msg
                    }else{
                        msgStr = msgStr + msg + " "
                    }
                }else{
                    if (index == msgs.length - 1){
                        msgStr = msgStr + msg
                    }else{
                        msgStr = msgStr + msg + " "
                    }
                }
            }
            cc.log("[Message Req  Log]=======>:"+msgStr+"]")
            if (objs.length != 0) {
                objs.forEach(obj => {
                    Log.dump(obj,"send msgData")
                });
            }
        }
    }
}

//网络反馈输出
/**
 * 
 * @param {*} msgs string or array
 */
Log.netMsgRespLog = (msgs) => {
    if (Log._logLevel >= 4) {
        if (typeof(msgs)== "string"){
            cc.log("[Message Resp Log]<=======:"+"["+msgs+"]")
        }else if (typeof(msgs)== "array" || typeof(msgs) == "object"){
            let msgStr = "["
            let objs = []
            for (let index = 0; index < msgs.length; index++) {
                const msg = msgs[index];
                if (typeof(msg) == "object") {
                    objs.push(msg)
                    if (index == msgs.length - 1){
                        msgStr = msgStr + msg
                    }else{
                        msgStr = msgStr + msg + " "
                    }
                }else{
                    if (index == msgs.length - 1){
                        msgStr = msgStr + msg
                    }else{
                        msgStr = msgStr + msg + " "
                    }
                }
            }
            cc.log("[Message Resp Log]<=======:"+msgStr+"]")
            if (objs.length != 0) {
                objs.forEach(obj => {
                    Log.dump(obj,"receive msgData")
                });
            }
        }
    }
}

// 筛选网络反馈数据
/**
 * 
 * @param {*} msgEvent msgEvent
 */
Log.showErrorRespMsg = (msgEvent) =>{
    if (Log._logLevel >= 4) {
        let resultCode = msgEvent.getResultCode() || -1
        if (resultCode === ResuleCode.OK) {
            Log.netMsgRespLog(['成功收到服务器数据{msgId:'+msgEvent.getMsgId()+',msg:[code '+resultCode+"]}",msgEvent.getMsgData()]);
            return true
        }else{
            Log.netMsgRespLog("Error:{msgId:"+msgEvent.getMsgId()+",Code:"+resultCode+',Error Msg:['+ErrorMsg[resultCode]+"]}");
            return false;
        }
    }
}
cc.log("Load window.Log success!")
window.Log = Log