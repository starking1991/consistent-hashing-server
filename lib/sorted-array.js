/**
 * Created by zp on 16/10/14.
 */


function compareDefault(a, b) {
    if (a == b) return 0;
    return a < b ? -1 : 1;
}

var SortedArray = function (array, compare) {
    this.array   = [];
    this.compare = compare || compareDefault;
    var length   = array.length;
    var index    = 0;
    while (index < length) this.insert(array[index++]);
}


SortedArray.prototype.insert = function (element) {
    var array   = this.array;
    var compare = this.compare;
    var index   = array.length;

    array.push(element);

    while (index > 0) {
        var i = index, j = --index;
        if (compare(array[i], array[j]) < 0) {
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    return this;
}

SortedArray.prototype.search=function (element) {
    var array   = this.array;
    var compare = this.compare;
    var high    = array.length;
    var low     = 0;

    while (high > low) {
        var index    = (high + low) / 2 >>> 0;
        var ordering = compare(array[index], element);

        if (ordering < 0) low  = index + 1;
        else if (ordering > 0) high = index;
        else return index;
    }

    return -1;
}

SortedArray.prototype.remove = function (element) {
    var index = this.search(element);
    if (index >= 0) this.array.splice(index, 1);
    return this;
}

SortedArray.prototype.getArray=function () {
    return this.array;
}

SortedArray.prototype.length=function () {
    return this.array.length;
}


module.exports = SortedArray;
