/**
 * Created by zp on 16/10/14.
 */
var assert = require("assert");
var ConsistentHashing = require("../lib/consistent_hashing")
var _ = require('underscore');


var servers = new ConsistentHashing(["192.168.1.1","192.168.1.3","192.168.1.2"]);

var server1 = servers.getNode(1);
var i;


servers.addNode("192.168.1.12");
servers.addNode("192.168.1.13");


servers.removeNode(server1);
servers.removeNode("192.168.1.12");

var result = [];

for( i=0;i<20000;i++){

    var  server = servers.getNode(i);

    assert(server!=undefined);
    result.push(server);
}
console.log(_.countBy(result,function (server) {
    return server;
}));
