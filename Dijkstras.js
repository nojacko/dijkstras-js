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
		
		var queue = [];	
		var distance = [];
		var previous = [];
			
		// Reset all previous values
		for (var name in this.graph) {	
			distance[name] = Infinity;
			previous[name] = null;
			queue[queue.length] = name;
		}
		
		// Set up
		distance[source] = 0;		
		
		// Loop all nodes
		while (queue.length > 0) {
			// Keep Queue in order
			queue.sort(function(a, b) { return distance[a] > distance[b]; })
			
			var u = queue.shift();
			
			// Reached taget!
			if (u === target) {
				var path = [];
				while (previous[u] !== null) {
					path.unshift(u);
					u = previous[u];
				}
				return path;
			}
			
			if (distance[u] == Infinity) {
				break; // all remaining vertices are inaccessible from source
			}
			
			for (var neighbour in this.graph[u]) {
				var alt = distance[u] + this.graph[u][neighbour];
				if (alt < distance[neighbour]) {
					distance[neighbour] = alt;
					previous[neighbour] = u;
				}
			}	
		}
		
		return [];		
	}
}