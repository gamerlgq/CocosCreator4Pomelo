let LoginProtocol = {
    req : {
        register_req : "",
        login_gete_req    :  "gate.gateHandler.queryEntry",
        login_connector_req : "connector.entryHandler.entry"
    },
    resp : {
        register_resp  			: 110,
        login_gete_resp			: 111,
        login_connector_resp    : 112
    }
}

let ServerProtocol = {
    req : {

    },
    resp : {

    }
}

let ResuleCode = {
    SERVER_ERROR:-1,
    OK: 200, 
	FAIL: 500,
}

let ErrorMsg = {
    [-1]:"未知错误!",
    [500]:"服务器错误!"
}
cc.log("Load window.LoginProtocol success!")
window.LoginProtocol = LoginProtocol
cc.log("Load window.ServerProtocol success!")
window.ServerProtocol = ServerProtocol
cc.log("Load window.ResuleCode success!")
window.ResuleCode = ResuleCode
cc.log("Load window.ErrorMsg success!")
window.ErrorMsg = ErrorMsg