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
var Dijkstras = function () {
    this.graph = [];
    this.queue;
    this.distance = [];
    this.previous = []

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
    this.setGraph = function (graph)
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
    this.getPath = function (source, target)
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
        this.queue = new Queue();
        for (var name in this.graph) {
            this.distance[name] = Infinity;
            this.previous[name] = null;
            this.queue.update(name, Infinity);
        }

        // Set up
        this.distance[source] = 0;
        this.queue.update(source, 0);

        // Loop all nodes
        while (this.queue.count > 0) {
            var u = this.queue.shift().node;

            // Reached taget!
            if (u === target) {
                var path = [];
                while (this.previous[u] !== null) {
                    path.unshift(u);
                    u = this.previous[u];
                }
                return path;
            }

            // all remaining vertices are inaccessible from source
            if (this.distance[u] == Infinity) {
                break;
            }

            for (var neighbour in this.graph[u]) {
                var alt = this.distance[u] + this.graph[u][neighbour];
                if (alt < this.distance[neighbour]) {
                    this.distance[neighbour] = alt;
                    this.previous[neighbour] = u;
                    this.queue.update(neighbour, alt);
                }
            }
        }

        return [];
    }

    /**
    * @class Queue
    **/
    var Queue = function () {
        this.queue = {};
        this.count = 0;
        this.first = null;

        this.shift = function ()
        {
            return this.remove(this.first);
        }

        this.remove = function (node)
        {
            if (typeof this.queue[node] === 'undefined') {
                return null;
            }

            var element = this.queue[node];
            delete this.queue[node];
            this.count--;

            // Removing the first, we should update first
            if (element.prev == null) {
                this.first = null;
                if (typeof this.queue[element.next] !== 'undefined') {
                    this.first = this.queue[element.next].node;
                }
            }

            if (typeof this.queue[element.prev] !== 'undefined') {
                this.queue[element.prev].next = element.next;
            }

            if (typeof this.queue[element.next] !== 'undefined') {
                this.queue[element.next].prev = element.prev;
            }

            return element;
        }

        this.update = function (node, distance)
        {
            var update = false;

            // Add node
            var addition = typeof this.queue[node] === 'undefined';

            // Update if it's new or the distance has changed
            if (addition || !(this.queue[node].distance == distance)) {
                if (addition) {
                    this.count++;
                } else {
                    // Temporarily remove
                    var prev = this.queue[node].prev;
                    if (prev !== null) {
                        this.queue[prev].next = this.queue[node].next;
                    }
                    var next = this.queue[node].next;
                    if (next !== null) {
                        this.queue[next].prev = this.queue[node].prev;
                    }
                }

                // Add/update
                this.queue[node] = { node: node, distance: distance, next: null, prev: null	};
            } else {
                return; // No change
            }

            // This is the first node
            if (this.first === null) {
                this.first = node;
                return;
            }

            // Order
            var prev = null;
            var next = this.first;

            while (next !== null) {
                // Stop when next distance is equal or greater
                if (this.queue[node].distance <= this.queue[next].distance) {

                    // Nothing before, so it's the first.
                    if (prev == null) {
                        this.first = node;
                    }

                    // has previous, who's next should point to this
                    if (typeof this.queue[prev] !== 'undefined'){
                        this.queue[prev].next = node;
                    }

                    // has next, who's previous should point to this
                    if (typeof this.queue[next] !== 'undefined'){
                        this.queue[next].prev = node;
                    }

                    this.queue[node].prev = prev;
                    this.queue[node].next = next;
                    return;
                }
                prev = next;
                next = (typeof this.queue[next] === 'undefined') ? null : this.queue[next].next;
            }

            // Add at the end
            this.queue[node].prev = prev;
            this.queue[node].next = next;
            // Point current last to this
            this.queue[prev].next = node;
        }
    }
}
