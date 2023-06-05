define(function(require, exports) {
    return {
        "name":{
            "type":"input",
            "value":"",	
            "display":LNG['common.name'],
            "desc":LNG['admin.storage.nameDesc'],
            "require":1
        },
        "sizeMax":{
            "type":"number",
            "value":1024,
            "display":LNG['admin.member.spaceSize'],
            "desc":LNG['admin.storage.sizeDesc'],
            "require":1
        },
        "client_id": {
            "type":"input",
            "value":"",	
            "className": "hidden",
            "display":"AppKey",
        },
        "access_token": {
            "type":"input",
            "value":"",	
            "className": "hidden",
        },
        "refresh_token": {
            "type":"input",
            "value":"",	
            "className": "hidden",
        },
        "token_expire_time": {
            "type":"input",
            "value":"",	
            "className": "hidden",
        },
        "auth": {
            "type":"switch",
			"value":0,
			"display":"账号授权",
			"desc":"百度账号授权",
			"require":1
        },
        "basePath":{
            "type":"input",
            // "value":"/apps/kodbox/",
            "value":"/",
            "display":LNG['admin.storage.path'],
            "desc":LNG['admin.storage.pathDesc'],
            "require":1
        },
    };
});