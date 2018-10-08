const TIMEOUT = 10000 // 链接超时10秒

// responseType
const RESPONSE_TYPE = {
    arrayBuffer:"arraybuffer",//arraybuffer
    json:"json",//json
    text:"text",//text string
}

// readyState
const READY_STATE = {
    UNSENT:0,//	open()方法还未被调用.
    OPENED:1,// open()方法已经被调用.
    HEADERS_RECEIVED:2,//send()方法已经被调用, 响应头和响应状态已经返回.
    LOADING:3,//响应体下载中; responseText中已经获取了部分数据.
    DONE:4//整个请求过程已经完毕
}

/**
 * status,
 * 只读属性，HTTP状态码，是一个三位数的整数。
 * 200,ok,响应成功。
 * 301，Moved Permanently,永久移动。
 * 302, Move temporarily，暂时移动
 * 304, Not Modified，未修改
 * 307, Temporary Redirect，暂时重定向
 * 401, Unauthorized，未授权
 * 403, Forbidden，禁止访问
 * 404, Not Found，未发现请求资源
 * 500, Internal Server Error，服务器发生错误
 */
const STATUS = {
    OK:200,
    SERVER_ERROR:500,
    NOT_FOUND:404,
    FORBIDDEN:403,
    UNAUTHORIZED:401,
    UNKNOW:400
}

/** 
 * request type
*/
const METHOD_TYPE = {
    GET:"GET",
    POST:"POST",
    PUT:"PUT",
    DELETE:"DELETE"
}

let HttpMgr = cc.Class({
    ctor:function(){
        this.xhr = null
        this.httpSendCallback = null
        this.httpRecieveCallback = null
    },

    /**
     * @public
     */
    init:function(){
        if (!this.xhr){
            this.xhr = createXMLHttpRequest()
        }
    },

    /**
     * @static
     */
    statics:{
        // 保存单实例，静态变量
        _instance:null,
        // 获取单实例
        getInstance(){
            if (!HttpMgr._instance){
                cc.log("HttpMgr new ok")
                HttpMgr._instance = new HttpMgr()
            }
            return HttpMgr._instance
        }
    },
        /**
     * 发送http request 回调函数(请求开始)
     * @public
     * @param cb callback
     */
    registerHttpSendCallback:function(cb){
        this.httpSendCallback = cb
    },

    /**
     * 接收到http response 回调函数(response开始)
     * @public
     * @param cb callback
     */
    registerHttpReceiveCallbakc:function(cb){
        this.httpRecieveCallback = cb
    },

    /**
     * 上传文件
     * @public
     * @param args {详细如下}
     * @param cb 回调方法
     * @param url 上传的地址
     * @param fileInfo 上传文件信息 {fileFieldName = "br", filePath="xxxxxx", contentType="application/octet-stream"}
     * fileFieldName 字段名字
     * filePath 文件路径
     * contentType 文件类型  详细对照表: http://tool.oschina.net/commons
     * @param extraData 额外表单
     * @param needLoading 是否显示loading界面
     * @param responseType 相应格式
     * @param errorCB request error callback
     * @param abortCB request cancel callback
     * @param loadStartCB upload start callback
     * @param progressCB request progress callbakc
     */
    upload:function(args){
        // URL
        if (!args.url){
            Log.netMsgReqLog("Http request needs an url!")
            return 
        }
        // XHR
        if (!this.xhr){
            this.xhr = createXMLHttpRequest()
        }
        // 设置needLoading
        if (!args.needLoading){
            args.needLoading = true
        }
        if (!args.timeout){
            args.timeout = TIMEOUT
        }
        if (!args.responseType){
            args.responseType = RESPONSE_TYPE.text
        }
        // OPEN
        xhr.open(METHOD_TYPE.POST, args.url, true)
        // 设置timeout
        this.xhr.timeout = args.timeout
        // 设置responseType
        this.xhr.responseType = args.responseType
        // 请求完成回调(loading界面消失)
        if (args.needLoading){
            xhr.onload = (url)=>{
                if (this.httpRecieveCallback){
                    this.httpRecieveCallback(url)
                }
            }
        }
        // 请求失败回调
        if (args.errorCB){            
            xhr.onerror = ()=>{
                args.errorCB()
            }
        }
        // 上传开始回调
        if (args.loadStartCB){
            xhr.upload.onloadstart = ()=>{
                loadStartCB()
            }
        }
        // 上传过程的回调
        if (args.progressCB){
            this.xhr.upload.onprogress = (event)=>{
                /**
                 * event {total:是需要传输的总字节,loaded:是已经传输的字节,lengthComputable:如果不为真不为真，则event.total等于0}
                 */
                args.progressCB(event)
            }
        }
        // FormData 对象
        let form = new FormData(); 
        let file = args.fileInfo.filePath + args.fileInfo.fileFieldName
        form.append("uploadFile",file)
        //开始上传，发送form数据
        this.xhr.send(form); 
        // 执行请求回调函数(显示loading界面)
        Log.netMsgReqLog("upload file to :"+args.url)
        if (this.httpSendCallback && args.needLoading){ 
            this.httpSendCallback(args.url)
        }
    },

     /**
     * @public
     * @param args{详情如下}
     * @param cb 回调函数
     * @param url request url
     * @param method "GET"/"POST"
     * @param data request data
     * @param needLoading 是否显示loading界面
     * @param timeout 连接超时时间(单位毫秒)
     * @param responseType 相应格式
     * @param errorCB request error callback
     * @param abortCB request cancel callback
     * @param progressCB request progress callbakc
     */
    request:function(args){
        if (!args.url){
            Log.netMsgReqLog("Http request needs an url!")
            return 
        }
        // XHR
        if (!this.xhr){
            this.xhr = createXMLHttpRequest()
        }
        // 设置默认method
        if (!args.method) {
            args.method = METHOD_TYPE.GET
        }
        // 设置默认data
        if (!args.data){
            args.data=""
        }
        if (typeof(args.data)=="object"){
            args.data = convertURLParm(args.data)
        }
        // 设置needLoading
        if (!args.needLoading){
            args.needLoading = true
        }
        // open  params:(method,url,[async,user,password])
        this.xhr.open(args.method, args.url,true)
        // 设置timeout
        this.xhr.timeout = args.timeout ? args.timeout : TIMEOUT
        // 设置responseType
        // this.xhr.responseType = args.responseType ? args.responseType : RESPONSE_TYPE.arrayBuffer
        // onreadystatechange
        this.xhr.onreadystatechange = onStateChange.bind(this,args.cb,args.url)
        // send
        this.xhr.send(args.data)
        Log.netMsgReqLog("请求"+args.url)
        // 执行请求回调函数
        if (this.httpSendCallback && args.needLoading){ 
            this.httpSendCallback(args.url)
        }
        // 请求错误回调
        if (args.errorCB){
            this.xhr.onerror = ()=>{
                args.errorCB()
            }
        }
        // 取消request回调
        if (args.abortCB){
            this.xhr.onabort = ()=>{
                args.abortCB()
            }
        }
        // 下载过程的回调
        if (args.progressCB){
            this.xhr.onprogress = (event)=>{
                /**
                 * event {total:是需要传输的总字节,loaded:是已经传输的字节,lengthComputable:如果不为真不为真，则event.total等于0}
                 */
                args.progressCB(event)
            }
        }
    },
});

/**
 * 创建Http请求对象
 */
function createXMLHttpRequest(){
    let xhr = cc.loader.getXMLHttpRequest();
    return xhr
}

/** 
 * onreadystatechange
*/
function onStateChange(cb,url){
    if (this.httpRecieveCallback){
        this.httpRecieveCallback(url)
    }
    if (this.xhr.readyState == READY_STATE.DONE && (this.xhr.status >= STATUS.OK && this.xhr.status < STATUS.UNKNOW)){
        let statusString = "Http Status Code:" + this.xhr.statusText
        Log.netMsgRespLog(statusString)
        cb(true,this.xhr.response,this.xhr.status)
    }else{
        let statusString = "[Error]:xhr.readyState is:" + this.xhr.readyState + "xhr.status is: " + this.xhr.status + "xhr.statusText is:" + this.xhr.statusText
        Log.netMsgRespLog(statusString)
        cb(false, "", this.xhr.status)
    }
}

/**
 * request url data restful
 * @param {*} data 
 */
function convertURLParm(data){
	let ret = ""
	let single = ""
    let first = true
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            if (first){
                single = key + "=" + value//string.format("%s=%s", key, value)
                first = false
            }else{
                single = "&" + key + "=" + value//string.format("&%s=%s", k, v)
            }
            ret = ret + single
        }
    }
	return ret
}

let loadNativeRes = function(url, callback){
    var dirpath = jsb.fileUtils.getWritablePath() + "img";
    var filepath = dirpath + 'abc.jpg';
    filepath = jsb.fileUtils.fullPathForFilename(filepath)
    function loadEnd(){
        cc.loader.load(filepath, function(err, tex){
            if( err ){
                cc.error(err);
            }else{
                var spriteFrame = new cc.SpriteFrame(tex);
                if( spriteFrame ){
                    spriteFrame.retain();
                    callback(spriteFrame);
                }
            }
        });

    }

    if( jsb.fileUtils.isFileExist(filepath) ){
        cc.log('Remote is find' + filepath);
        loadEnd();
        return;
    }

    var saveFile = function(data){
        if( typeof data !== 'undefined' ){
            if( !jsb.fileUtils.isDirectoryExist(dirpath) ){
                jsb.fileUtils.createDirectory(dirpath);
            }
            let fileData =  new Uint8Array(data)
            Log.dump(fileData)
            if( jsb.fileUtils.writeDataToFile(fileData, filepath) ){
                cc.log('Remote write file succeed.');
                loadEnd();
            }else{
                cc.log('Remote write file failed.');
            }
        }else{
            cc.log('Remote download file failed.');
        }
    };
    
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        cc.log("xhr.readyState  " +xhr.readyState);
        cc.log("xhr.status  " +xhr.status);
        if (xhr.readyState === 4 ) {
            if(xhr.status === 200){
                xhr.responseType = 'arraybuffer';
                saveFile(xhr.response);
            }else{
                saveFile(null);
            }
        }
    }.bind(this);
    xhr.open("GET", url, true);
    xhr.send();
};

cc.log("Load window.HttpMgr success!")
window.HttpMgr = HttpMgr