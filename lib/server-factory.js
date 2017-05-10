/**
 * Created by zp on 16/10/13.
 */
var zookeeper = require('node-zookeeper-client');
var _ = require('underscore');
var ConsistentHashing = require("./consistent_hashing");

var _client;
var chServers;
var _url;
var _minServers = 5;
var _path;


var getConfigPromise = function()  {
    return new Promise(function (resolve,reject) {
        _client.getData(
            _path,
            function (error, data) {
                if (error) {
                    reject(error);
                    return;
                }
                data = data.toString('utf8');
                if(data=="init"){
                    resolve(null);
                    return;
                }
                chServers = new ConsistentHashing(JSON.parse(data));
                resolve(data);
            }
        );
    });
}

var setConfigPromise = function (data) {
    return new Promise(function (resolve,reject) {
        _client.setData(_path,data,function (error) {
            if(error){
                console.error("set Config error;"+error);
                reject(error);
                return;
            }

            resolve("success");
        });
    });

}

var configListener = function () {
    _client.getData(
        _path,function () {
            configListener();
        } ,
        function (error, data) {
            if (error) {
                console.error("get Config error;"+error);
                return;
            }
            data =  data.toString('utf8');
            try {
                JSON.parse(data);
                chServers = new ConsistentHashing(JSON.parse(data));
            } catch (e) {

            }
        }
    );
}
var initIng = false;

var registerServer = function () {
    if(initIng) return;
    initIng =true;
    _client.create(_path+"/"+_url,zookeeper.CreateMode.EPHEMERAL,function (error) {
        if(error){
            console.error("register "+_url+error);
        }
        initIng = false;
    });
}

function listServer() {
    _client.getChildren(
        _path,
        function () {
            listServer();
        },
        function (error, children) {
            if (error) {
                console.error('Failed to list children of %s due to: %s.', path, error);
            }
            children = children.sort();
            if(_url==children[0]){      //avoid Herd Effect
                if(children.length==_minServers){
                    chServers = new ConsistentHashing(children);
                    setConfigPromise(new Buffer(JSON.stringify(chServers.getMap())));
                }else{

                    if(children.length==1){
                        setConfigPromise(new Buffer("init"));
                        return;
                    }
                    getConfigPromise().then(function (data) {
                        if(data==null) return;
                        var map =JSON.parse(data);
                        var servers = _.values(map);

                        _.each(servers,function (s) {
                            if(!_.contains(children,s)){// server s Crash
                                chServers.removeNode(s);
                            }
                        });
                        _.each(children,function (c) {
                            if(!_.contains(servers,c)){// add new server c
                                chServers.addNode(c);
                            }
                        });
                        setConfigPromise(new Buffer(JSON.stringify(chServers.getMap())));
                    },function (error) {
                        console.error(error);
                    });
                }
            }
            
            if(!_.contains(children,_url)){//if this server not register then register it
                if(children.length==1){
                    setTimeout(function () {// waiting setConfigPromise(new Buffer("init"));
                        registerServer();
                    },500);
                }else{
                    registerServer();
                }
            }
        }
    );
}

var serverFactory = function (url,path,servers_min_num,zookeeper_url) {
    _url = url;
    _minServers = servers_min_num||5;
    _path = path;
    _client = zookeeper.createClient(zookeeper_url);

    _client.once('connected', function () {
        _client.mkdirp(path,
            function (error) {
                if (error) {
                    console.error("connect error "+error);
                    return;
                }
                listServer();
                configListener();
            });

    });
    _client.connect();
}



serverFactory.prototype.getServer=function (key) {
    return chServers.getNode(key);
}

module.exports = serverFactory;





