
/**
 * Created by zp on 16/10/18.
 */
var assert = require("assert");
var ServerFactory = require("../index");
var path = "/connectors";
var min_servers = 5;
var zookeeper_url = "192.168.1.100:2182,192.168.1.100:2183,192.168.1.100:2184";

var serverFactory =new ServerFactory(process.env.HOST+":"+process.env.PORT,path,min_servers,zookeeper_url);