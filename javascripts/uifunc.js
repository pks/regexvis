// enable/disable if input length is > 0
function checkLength(el, bId) {
	if(el.value.length > 0) {
		enable(bId);
	} else {
		disable(bId);
	};
};

// enable a disabled form item
function enable(id) { $(id).removeAttr("disabled"); };
// disable a form item
function disable(id) { $(id).attr("disabled","disabled"); };

// call of RegexParser.parse() from UI
function uiParse() {
	var parser = new RegexParser();
	nfa = parser.parse($('#regex').attr('value'));
	$('#parseMessage').html('Parse: '+parser.getErrorMessage());
	if (parser.getErrorMessage() != 'Ok') {
		$('#parseMessage').removeClass('success');	
		$('#parseMessage').addClass('failure');	
		$('#regex').addClass('failure');
	} else {
		$('#parseMessage').removeClass('failure');
		$('#regex').removeClass('failure');
		$('#parseMessage').addClass('success');
		$('#regex').addClass('success');
		enable('#word');
		var dfa = new Nfa2Dfa(nfa);
		var ttable = dfa.do();
		window.g = graph();
		disable('#regex');
		disable('#parseButton');
	};
	$('#parseMessage').effect("highlight", {}, 1000);
	
	s = 'abc';
	/*g.mover = g.paper.circle(
		g.nodes[0][1][0].cx.baseVal.value,
		g.nodes[0][1][0].cy.baseVal.value, 30
	).attr({fill:'#00f', stroke: 'none', opacity: 0.5});
	for (var i=0; i < s.length; i++) {
        (function(g, i) {
            setTimeout(function() {
				var state = g.nodes[i];
				var x = state[1][0].cx.baseVal.value;
				var y = state[1][0].cy.baseVal.value;
              	g.mover.animateAlong(
					g.paper.path(
						'M'+x+state[1][0].r.baseVal.value+','+y+' '+g.connections[i].line.attr('path').toString().substring(1)
						+'L'+(g.nodes[i+1][1][0].cx.baseVal.value+(i*2))+','+g.nodes[i+1][1][0].cy.baseVal.value
						).attr({stroke:'none', 'stroke-width':4})
				, 2000)
			}, 2000*i);
        })(g, i);
	};*/
};

// call of NfaSimulator.simulate() from UI
function uiSimulate() {
	var simulator = new NfaSimulator(nfa);
	var check = simulator.simulate($('#word').attr('value'));
	if (!check) {
		$('#checkMessage').html('Word not accepted');
		$('#checkMessage').removeClass('success');
		$('#word').removeClass('success');	
		$('#checkMessage').addClass('failure');
		$('#word').addClass('failure');	
	} else {
		$('#checkMessage').html('Word accepted');
		$('#checkMessage').removeClass('failure');	
		$('#word').removeClass('failure');	
		$('#checkMessage').addClass('success');
		$('#word').addClass('success');
	};
	$('#checkMessage').effect("highlight", {}, 1000);	
};


function getKey(e, set) {
	var key = String.fromCharCode(e.which);
	if (set.indexOf(key) >= 0 || e.which == 8) {
		return true;
	}
	return false;
};

//
function graphMove(symbol) {
	true;
};
