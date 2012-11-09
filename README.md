# dijkstras-js

Javascript implementation of Dijkstra's algorithm 

## Sample Usage

	var d = new Dijkstras();
	d.setGraph(
		[
			['A', [['B', 20], ['C', 20]] ], 
			['B', [['A', 30], ['C', 100]] ], 
			['C', [['D', 10], ['A', 20]] ], 
			['D', [['C', 10], ['B', 20]] ]
		]
	);
	var path = d.getPath('A', 'D');
	
## Resources
http://en.wikipedia.org/wiki/Dijkstra's_algorithm

## Fork!
Please fork and improve!