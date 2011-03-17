var crc32 = require('./hash').crc32;

var Consistent = exports.Consistent = function(nodes, numReplicas, hashfunc) {
    this.numReplicas = numReplicas || 300;
    this.nodes = [];
    this.hashfunc = hashfunc || md5hashcode;
    this.circle = [];
    if (nodes != null) {
        for (var i = 0; i < nodes.length; i++) {
            this.add(nodes[i]);
        }
    }
};

Consistent.prototype = {
    add: function(node, id) {
        this.nodes[this.nodes.length] = node;
        var buff, i;
        for (i = 0; i < this.numReplicas; i++) {
            this.addVNode(this.hashfunc((id || node.id) + '#' + i), node);
        }
    },

    getVNodeIndex: function(hash) {
        var left = 0,
            right = this.circle.length - 1,
            current,
            vnode;

        if (right < 0)
            return 0;

        while (right >= left) {
            current = Math.floor((left + right) / 2);
            vnode = this.circle[current];
            if (hash < vnode.hash) {
                if (left == right) {
                    return current;
                }
                right = current;
            }else if (hash > vnode.hash) {
                ++current;
                if (left == right) {
                    return current;
                }
                left = current;
            }else {
                return current;
            }
        }

        return current;
    },

    addVNode: function(hash, node) {
        var pos = this.getVNodeIndex(hash, true);
        this.circle.splice(pos, 0, {hash: hash, node: node});
        this.numCircle++;
    },

    remove: function(node) {
        for (var i = 0; i < numberOfReplicas; i++) {
            circle.remove(hashfunc(node.toString() + i));
        }
    },

    get: function(key) {
        var vnodeIndex = this.getVNodeIndex(this.hashfunc(key));
        return this.circle[vnodeIndex >= this.circle.length ? 0 : vnodeIndex].node;
    }
};

var buff2hash = function(buff, part) {
    var hash = buff[part * 4 + 3] << 24 |
            buff[part * 4 + 2] << 16 |
            buff[part * 4 + 1] << 8 |
            buff[part * 4];
    return hash;
};

var crypto = require('crypto');
var md5 = function(key,encoding) {
    return crypto.createHash('md5').update(key).digest(encoding);
};

var md5hashcode = exports.md5hashcode = function(key) {
    return buff2hash(new Buffer(md5(key)), 0);
};

