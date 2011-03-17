var crc32 = require('../lib/hash').crc32;

var vows = require('vows'),
    assert = require('assert'),
    Consistent = require('../lib/consistent').Consistent;

var numNodes = 10,
    numVNodes = 300,
    numRequests = 100000,
    hashFunction = undefined;


vows.describe('consistent test').addBatch({
        'consistent balance' : {
            topic: function() {
                var nodes = [];
                for (var i = 0; i < numNodes; i++) {
                    nodes[i] = {
                        //id: 'long node#' + i,
                        count: 0,
                        cache: []
                    };
                }
                return nodes;
            },
            'after init nodes': {
                topic: function(nodes) {
                    //var cons = new Consistent(null, numVNodes, hashFunction);
                    var cons = new Consistent();
                    for (var i = 0; i < numNodes; i++) {
                        cons.add(nodes[i], 'long node#' + i);
                    }
                    return cons;
                },
                'circle should from small to large' : function(cons) {
                    var last = cons.circle[0];
                    for (var i = 1; i < cons.numCircle; i++) {
                        var curr = cons.circle[i];
                        assert.isTrue(curr.hash > last.hash, 'index:' + i + ' curr:hash' + curr.hash + ' last:hash:' + last.hash);
                        last = curr;
                    }
                },

                'could get nodes' : function(cons) {
                    for (var i = 0; i < numRequests; i++) {
                        var key = 'request#' + i;
                        var node = cons.get(key);
                        assert.isObject(node);
                        assert.isNotNull(node);
                        node.count = node.count + 1;
                        node.cache[node.cache.length] = key;
                    }
                },
                'node balance' : function(cons ) {
                    var avg = numRequests / numNodes;
                    var sum2 = 0;
                    var sum = 0;
                    for (var i = 0; i < numNodes; i++) {
                        var node = cons.nodes[i];
                        var delta = node.count - avg;
                        sum2 += delta * delta;
                        sum += node.count;
                        console.log('node#' + i + ':count:' + node.count + ' ' + (node.count * 100 / numRequests) + '%');
                    }
                    console.log('sum2 of delta:' + sum2);
                    assert.equal(numRequests, sum, 'numRequest and cache count mismatch');
                },
                'TODO: added node': function() {
                }
            }
        }

})
.export(module);

