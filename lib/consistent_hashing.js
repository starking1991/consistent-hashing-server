
/**
 * Created by zp on 16/10/13.
 */

var _ = require('underscore');
var SortedArray = require('./sorted-array');


/**
 *
 * @param nodes,you can  init form array like ["192.168.1.127:7081","192.168.1.127:7082","192.168.1.127:7083"] or
 * init from map like {"0":"192.168.1.127:7081","200":"192.168.1.127:7082","400":"192.168.1.127:7083","600":"192.168.1.127:7084","800":"192.168.1.127:7085"}
 *
 * @param capacity counts of virtual server, default 1000
 * @constructor
 */

var ConsistentHashing = function(nodes, capacity) {
    this.capacity  = capacity||1000;

    if(_.isArray(nodes)){
        this.map  = {};
        nodes.sort();
        var tmp =[];
        var  index = 0;
        var inc =parseInt(this.capacity/nodes.length);

        for (var i = 0; i < nodes.length; i++) {
            tmp.push(index);
            this.map[index] = nodes[i];
            index =index+inc;
        }
        this.indexArray = new SortedArray(tmp);
    }else{
        this.map = nodes;
        this.indexArray = new SortedArray(_.keys(this.map));
    }

};

/**
 *
 * @param node , a server node,like "192.168.1.127:7081"
 * @returns {number} inserted position
 */
ConsistentHashing.prototype.addNode = function(node) {
    var indexArray = this.indexArray.getArray();
    var first = indexArray[0];
    var last = indexArray[indexArray.length-1];
    var start =-1;
    var maxSpace = first+this.capacity-last;

    for(var i=0;i<indexArray.length-1;i++){
        var space = indexArray[i+1]-indexArray[i];
        if(space>maxSpace){
            maxSpace = space;
            start = i;
        }
    }
    var position = 0;

    if(start==-1){//when the node in ring  range from last to first
        position = parseInt((first+this.capacity+last)/2);
    }else{
        position = parseInt((indexArray[start+1]+indexArray[start])/2);
    }
    this.indexArray.insert(position);
    this.map[position] = node;
    return position;
};


/**
 * remove a node
 * @param node
 */
ConsistentHashing.prototype.removeNode = function(node) {
    var map = this.map;
    var indexArray = this.indexArray;
    _.each(this.map,function (value,key) {
        if(value==node){
            indexArray.remove(key);
            delete map[key];
        }
    });
};

/**
 * get node from consistentHashing with a integer key
 * @param key
 * @returns {*}
 */
ConsistentHashing.prototype.getNode = function(key) {
    var indexArray = this.indexArray.getArray();
    if(key<this.capacity){
        key = key*(parseInt(this.capacity/indexArray.length-1));// this way can force serial number(like 1,2,3,4) hash to dif server
    }
    var index = key%this.capacity;
    var first = indexArray[0];
    var last = indexArray[indexArray.length-1];
    if(index<first||index>last||index==last){
        return this.map[last];
    }

    for(var i=0;i<indexArray.length-1;i++){
        if(indexArray[i+1]>index){
            return this.map[indexArray[i]];
        }

    }
};

ConsistentHashing.prototype.getMap = function() {
    return this.map;
};

ConsistentHashing.prototype.getIndexes = function() {
    return this.indexArray;
};

module.exports = ConsistentHashing;
