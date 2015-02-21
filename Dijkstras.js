/**
* Javascript implementation of Dijkstra's algorithm
* Based on: http://en.wikipedia.org/wiki/Dijkstra's_algorithm
* Author: James Jackson (www.jamesdavidjackson.com)
* Source: http://github.com/nojacko/dijkstras-js/tree/
*
* Useage:
*	var d = new Dijkstras();
*	d.setGraph(
*		[
*			['A', [['B', 20], ['C', 20]] ],
*			['B', [['A', 30], ['C', 100]] ],
*			['C', [['D', 10], ['A', 20]] ],
*			['D', [['C', 10], ['B', 20]] ]
*		]
*	);
*	var path = d.getPath('A', 'D');
*
*/

/**
* @class Dijkstras
**/
var Dijkstras = (function () {

    var Dijkstras = function () {
        this.graph = [];
        this.queue;
        this.distance = [];
        this.previous = []
    }

    /**
    * Creates a graph from array.
    * Each element in the array should be in the format:
    * 	[NODE NAME, [[NODE NAME, COST], ...] ]
    *
    * For example: 	[
    *		['A', [['B', 20], ['C', 20]] ],
    *		['B', [['A', 30], ['C', 100]] ],
    *		['C', [['D', 10], ['A', 20]] ],
    *		['D', [['C', 10], ['B', 20]] ]
    *	]
    *
    * @param graphy Array of nodes and vertices.
    **/
    Dijkstras.prototype.setGraph = function (graph)
    {
        // Error check graph
        if (typeof graph !== 'object') {
            throw "graph isn't an object (" + typeof graph + ")";
        }

        if (graph.length < 1) {
            throw "graph is empty";
        }

        for (var index in graph) {
            // Error check each node
            var node = graph[index];
            if (typeof node !== 'object' || node.length !== 2) {
                throw "node must be an array and contain 2 values (name, vertices). Failed at index: " + index;
            }

            var nodeName = node[0];
            var vertices = node[1];
            this.graph[nodeName] = [];

            for (var v in vertices) {
                // Error check each node
                var vertex = vertices[v];
                if (typeof vertex !== 'object' || vertex.length !== 2) {
                    throw "vertex must be an array and contain 2 values (name, vertices). Failed at index: " + index + "[" + v + "]" ;
                }
                var vertexName = vertex[0];
                var vertexCost = vertex[1];
                this.graph[nodeName][vertexName] = vertexCost;
            }
        }
    }

    /**
    * Find shortest path
    *
    * @param source The starting node.
    * @param target The target node.
    * @return array Path to target, or empty array if unable to find path.
    */
    Dijkstras.prototype.getPath = function (source, target)
    {
        // Check source and target exist
        if (typeof this.graph[source] === 'undefined') {
            throw "source " + source + " doesn't exist";
        }
        if (typeof this.graph[target] === 'undefined') {
            throw "target " + target + " doesn't exist";
        }

        // Already at target
        if (source === target) {
            return [];
        }

        // Reset all previous values
        this.queue = new MinHeap();
        this.queue.add(source, 0);
        this.previous[source] = null;

        // Loop all nodes
        var u = null
        while (u = this.queue.shift()) {
            // Reached taget!
            if (u === target) {
                var path = [];
                while (this.previous[u] != null) {
                    path.unshift(u);
                    u = this.previous[u];
                }
                return path;
            }

            // all remaining vertices are inaccessible from source
            if (this.queue.getDistance(u) == Infinity) {
                return [];
            }

            for (var neighbour in this.graph[u]) {
                var uDistance = this.queue.getDistance(u),
                    nDistance = this.queue.getDistance(neighbour),
                    aDistance = uDistance + this.graph[u][neighbour];

                if (aDistance < nDistance) {
                    this.queue.update(neighbour, aDistance);
                    this.previous[neighbour] = u;
                }
            }
        }

        return [];
    }



    // Fibonacci Heap (min first)
    var MinHeap = (function() {
        var MinHeap = function () {
            this.min = null;
            this.roots = [];
            this.nodes = [];
            this.depthCache = [ [], [], [], [], [], [], [] ];
            this.depthMax = this.depthCache.length - 1; // 0-index
        }

        MinHeap.prototype.shift = function()
        {
            var minNode = this.min;

            // Current min is null or no more after it
            if (minNode == null || this.roots.length < 1) {
                this.min = null;
                return minNode
            }

            // Remove it
            this.remove(minNode);

            // Consolidate
            this.consolidate();

            // Get next min
            var lowestValue = Infinity,
                length = this.roots.length;

            for (var i = 0; i < length; i++) {
                var node = this.roots[i],
                    distance = this.getDistance(node);

                if (distance < lowestValue) {
                    lowestValue = distance;
                    this.min = node;
                }
            }

            return minNode;
        }

        MinHeap.prototype.consolidate = function()
        {
            // Consolidate
            var removeFromRoots = [];

            for (var depth = 0; depth <= this.depthMax; depth++) {
                while (this.depthCache[depth].length > 1) {

                    var first = this.depthCache[depth].shift(),
                        second = this.depthCache[depth].shift(),
                        newDepth = depth + 1,
                        pos = -1;

                    if (this.nodes[first].distance < this.nodes[second].distance) {
                        this.nodes[first].depth = newDepth;
                        this.nodes[first].children.push(second);
                        this.nodes[second].parent = first;

                        if (newDepth <= this.depthMax) {
                            this.depthCache[newDepth].push(first);
                        }

                        // Find position in roots where adopted node is
                        pos = this.roots.indexOf(second);

                    } else {
                        this.nodes[second].depth = newDepth;
                        this.nodes[second].children.push(first);
                        this.nodes[first].parent = second;

                        if (newDepth <= this.depthMax) {
                            this.depthCache[newDepth].push(second);
                        }

                        // Find position in roots where adopted node is
                        pos = this.roots.indexOf(first);
                    }

                    // Remove roots that have been made children
                    if (pos > -1) {
                        this.roots.splice(pos, 1);
                    }
                }
            }
        }

        MinHeap.prototype.add = function(node, distance)
        {
            // Add the node
            this.nodes[node] = {
                node: node,
                distance: distance,
                depth: 0,
                parent: null,
                children: []
            };

            // Is it the minimum?
            if (!this.min || this.nodes[node].distance < this.nodes[this.min].distance) {
                this.min = node;
            }

            // Root and Depth
            this.roots.push(node);
            this.depthCache[0].push(node);
        }

        MinHeap.prototype.update = function(node, distance)
        {
            this.remove(node);
            this.add(node, distance);
        }

        MinHeap.prototype.remove = function(node)
        {
            if (!this.nodes[node]) {
                return;
            }

            var nodeObj = this.nodes[node];

            // Remove self from depths cache
            if (nodeObj.parent == null) {
                var depth = nodeObj.depth;

                if (depth <= this.depthMax) {
                    var pos = this.depthCache[depth].indexOf(node);
                    if (pos > -1) {
                        this.depthCache[depth].splice(pos, 1);
                    }
                }
            }

            // Move children to be children of the parent
            var numOfChildren = nodeObj.children.length;
            if (numOfChildren > 0) {
                for (var i = 0; i < numOfChildren; i++) {
                    var child = nodeObj.children[i];
                    this.nodes[child].parent = nodeObj.parent;

                    // No parent, then add to roots
                    if (nodeObj.parent == null) {
                        this.roots.push(child);
                    }

                    // Add to depth cache.
                    // - Wouldn't be in depth as it's wasn't root
                    var depth = this.nodes[child].depth;
                    if (depth <= this.depthMax) {
                        this.depthCache[depth].push(child);
                    }
                }
            }

            // Node was a root element, remove it
            if (nodeObj.parent == null) {
                var pos = this.roots.indexOf(node);
                if (pos > -1) {
                    this.roots.splice(pos, 1);
                }
            } else {
                // Go up the parents and decrease their depth
                var nextParent = nodeObj.parent,
                    lastParent = null;

                while (nextParent) {
                    lastParent = nextParent;

                    // Reduce depth, get next parent
                    this.nodes[nextParent].depth--;
                    nextParent = this.nodes[nextParent].parent;
                }

                // Add last parent to depth cache.
                // - Wouldn't be in depth as it's wasn't root
                var depth = this.nodes[lastParent].depth;
                if (depth <= this.depthMax) {
                    this.depthCache[depth].push(lastParent);
                }
            }
        }

        MinHeap.prototype.getDistance = function(node)
        {
            if (this.nodes[node]) {
                return this.nodes[node].distance;
            }
            return Infinity;
        }

        return MinHeap;
    })();

    return Dijkstras;
})();
