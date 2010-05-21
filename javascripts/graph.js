// spurce: http://raphaeljs.com/graffle.html
Raphael.fn.connection = function (obj1, obj2, line, bg, strokeColor) {	
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    };
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            };
        };
    };
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    };
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3),
				"C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
	
	if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : strokeColor;
        return {
            bg: bg && bg.split && this.path(path
				).attr({stroke: bg.split("|")[0],
						fill: "none", "stroke-width": bg.split("|")[1] || 3}),
            line: this.path(path).attr({stroke: color, fill: "none"}),
            from: obj1,
			to: obj2
        };
    };
};
// source: http://stackoverflow.com/questions/2627436/svg-animation-along-path-with-raphael
Raphael.fn.circlePath = function(x , y, r) {      
	return "M"+x+","+(y-r)+"A"+r+","+r+",0,1,1,"+(x-0.1)+","+(y-r)+" z";
};
// nodes
Raphael.fn.aNode = function(x, y, r, isFinal, hasSelfConn,
			strokeWidth, strokeColor,labelText, labelFontSize) {
	var res = this.set();
	// two circle element for dragging and binding connections
	var connector = this.circle(x, y, r).attr({stroke:0}).attr({fill: 'none'});
	res.push(connector);
	var dragger = this.circle(x, y, r).attr({stroke:0}).attr({fill: 'none'});
	res.push(dragger);
	// outer circle
	var co = this.path(this.circlePath(x, y, r)).attr({stroke:'none'});
	res.push(co);
	if (isFinal) {
		// inner circle
		var ci = this.path(this.circlePath(x, y, r/1.2)).attr({
					stroke:'#fff', 'stroke-width':strokeWidth});
	};
	// self connection
	if (hasSelfConn) {
		var p1 = co.getPointAtLength(co.getTotalLength()-r/3); 
		var p2 = co.getPointAtLength(r/3);
		var selfConn = this.path('M'+p1.x+','+p1.y+
			' C'+(p1.x-r)+','+(p1.y-2.5*r)+' '+
			(p2.x+r)+','+(p1.y-2.5*r)+' '+p2.x+','+p2.y);
		res.push(selfConn.attr({'stroke-width': strokeWidth,
								stroke: strokeColor}));
		// another path for animation (connected to the center of co)
		var selfConnAnimPath = this.path('M'+x+','+y+selfConn.attrs.path[1]+'z'
			).attr({stroke:0})
		res.push(selfConnAnimPath);
		// arrow head
		var ahSize 	= r/8;
		var ahRef 	= selfConn.getPointAtLength(selfConn.getTotalLength()-1)
		var ahAngle = Math.atan2(ahRef.x-p2.x,p2.x-ahRef.y);
	    ahAngle 	= (ahAngle / (2 * Math.PI)) * 360;
	    var ah = this.path("M" + ahRef.x + " " + ahRef.y +
			" L" + (ahRef.x - ahSize) + " " + (ahRef.y - ahSize) +
			" L" + (ahRef.x - ahSize) + " " + (ahRef.y + ahSize) +
			" L" + ahRef.x + " " + ahRef.y
			).attr({stroke:strokeColor, fill:strokeColor}
				).rotate((112+ahAngle), ahRef.x, ahRef.y);
		res.push(ah);
		// label on self connection
		var label = this.text(
			selfConn.getPointAtLength(
				selfConn.getTotalLength()/2).x,
			selfConn.getPointAtLength(
				selfConn.getTotalLength()/2).y-labelFontSize/1.25,
			labelText
			).attr({font: this.getFont("Helvetica"), 'font-size': labelFontSize});
		res.push(label);
	};
	if (isFinal) {
		res.push(ci);
	};
	return res;
};


function graph() {
	var nodeRadius 	 = 30;
	var nodeRadiusHi = nodeRadius + 10;
	var nodeOpacity   = 1;
	var nodeOpacityHi = .5;
	var labelFontSize = 16;
	var strokeWidth = 2;
	var strokeColor = '#ccc';
	
	r = Raphael("holder", 1024, 640);
	
	// dragging, see: http://raphaeljs.com/touches.html
	var start = function () {
		this.animate({r: nodeRadiusHi, opacity: nodeOpacityHi}, 500, ">");
	},
		move = function (dx, dy) {
			this.moveTo(dx, dy);
			for (var i = nodeById[this.id].length - 1; i >= 0; i--){
				nodeById[this.id][i].translate(dx, dy);
			};
			for (var i = connections.length; i--;) {
            	r.connection(connections[i]);
        	};
        	r.safari();
		},
		up = function () {
			this.animate({r:nodeRadius, opacity:nodeOpacity}, 500, ">");
		};
	// nodes
	var nodes 		= [];
	var nodeById	= [];
	var i = 0, n, color, isFinal, selfConn = false, selfConnSymbol;
	var nx 	     = 10;
	var nxOffset = 100;
	var ny 		 = 120;
	var nyOffset = 120;
	for (var state in ttable) {
		color = Raphael.getColor();
		if (ttable[state].isFinal) {
			isFinal = true;
		} else {
			isFinal = false;
		};	
		for (symbol in ttable[state]) {
			if (symbol == 'isFinal') { continue; };
			if (ttable[state][symbol] == state) {	
				selfConn = true;
				selfConnSymbol = symbol;
				break;
			} else {
				selfConn = false;
			};
		};		
		if (i % 2 == 0) {
			ny = nyOffset;
		} else {
			ny = ny + nyOffset;
		};
		n = r.aNode(nx+nxOffset, ny, nodeRadius, isFinal, selfConn,
					strokeWidth, strokeColor, symbol, labelFontSize);
		n[1].attr({fill:color, opacity:nodeOpacity, cursor:'move'});
		n[1].drag(move, start, up);
		nodes.push(n);
		nodeById[n[1].id] = nodes[i];
		nx = nx + nxOffset;
		i++;
	};
	// connections
	var connections = [];
	var k = l = 0;
	for (var state in ttable) {
		for (var i = 0; i < ALPHABET.length; i++) {
			l = 0;
			if(ttable[state][ALPHABET[i]]) {
				for (var statex in ttable) {
					if (ttable[state][ALPHABET[i]] == statex) {
						if (state == statex) {
							continue;
						} else {
							connections.push(r.connection(nodes[k][0], nodes[l][0], strokeWidth, strokeColor));								
						};
					};
					l++;
				};
			};
		};
		k++;
	};
};