var generateGraph = function(x, y) {

    var i, j, name, graph = [], totalConnections = 0;

    i = 1;
    while (i <= x) {
        j = 1;
        while (j <= y) {
            var name = i + 'x' + j;
            var connections = [];

            var n = (i) + 'x' + (j+1),
                ne = (i+1) + 'x' + (j+1),
                e = (i+1) + 'x' + (j),
                se = (i+1) + 'x' + (j-1),
                s = (i) + 'x' + (j-1),
                sw = (i-1) + 'x' + (j-1),
                w = (i-1) + 'x' + (j),
                nw = (i-1) + 'x' + (j+1);


            if (i == x && j == y) {
                // No EAST or NORTH
                connections.push([s, 1]);
                connections.push([sw, 1]);
                connections.push([w, 1]);
            } else if (i == x) {
                // No EAST
                connections.push([se, 1]);
                connections.push([s, 1]);
                connections.push([sw, 1]);
                connections.push([w, 1]);
                connections.push([nw, 1]);
            } else if (j == y) {
                // No NORTH
                connections.push([e, 1]);
                connections.push([se, 1]);
                connections.push([s, 1]);
                connections.push([sw, 1]);
                connections.push([w, 1]);
            } else if (i == 1 && j == 1 ) {
                // No WEST or SOUTH
                connections.push([n, 1]);
                connections.push([ne, 1]);
                connections.push([e, 1]);
            } else if (i == 1) {
                // No WEST
                connections.push([n, 1]);
                connections.push([ne, 1]);
                connections.push([e, 1]);
                connections.push([se, 1]);
                connections.push([s, 1]);
            } else if (j == 1) {
                // No SOUTH
                connections.push([n, 1]);
                connections.push([ne, 1]);
                connections.push([e, 1]);
                connections.push([w, 1]);
                connections.push([nw, 1]);
            } else {
                // ALL allowed
                connections.push([n, 1]);
                connections.push([ne, 1]);
                connections.push([e, 1]);
                connections.push([se, 1]);
                connections.push([s, 1]);
                connections.push([sw, 1]);
                connections.push([w, 1]);
                connections.push([nw, 1]);
            }

            graph.push([name, connections]);

            totalConnections += connections.length;

            j++;
        }

        i++;
    }
/*
    console.log('Cells: ' + graph.length);
    console.log('Connections: ' + totalConnections);
*/

    return graph;
}
