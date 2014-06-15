/*
 * UI
 * functions, intialization
 */


// initialization of ui
$(function() {
    // #alphabet
    $('#alphabet').html(ALPHABET.substr(0,ALPHABET.length-1));
    // #regex
    $('#regex').change(function() { checkLength(this, "#parseButton"); });
    $('#regex').keypress(function(event) { return getKey(event, ALPHABETS); });
    $('#regex').mouseout(function() { checkLength(this, "#parseButton"); });
    // #parseButton
    $('#parseButton').click(function() {
        uiParse();
        alphabetEditable=false;
    });
    // #word
    $('#word').change(function() { checkLength(this, "#checkButton"); });
    $('#word').keypress(function(event) { return graphMoveByInput(event, ALPHABET); });
    $('#word').mouseout(function() { checkLength(this, "#checkButton"); });
    // #checkButton
    $('#checkButton').click(function() { uiSimulate(); });
    // #graphit
    $('#graphit').change(function() { graphit = this.checked; });
    // #reloadButton
    $('#reloadButton').click(function() { window.location.reload(); });
    // #descButton
    $('#descButton').click(function() { $('#desc').toggle(); });
    // in place edit of alphabet
    $('body').click(function() {
        if (alphabetEdit) {
            ALPHABET = $('#alphabetInput').attr('value').replace(/\s/g,'').replace(/%/g, '').replace(/\*/g, '');
            ALPHABET = ALPHABET.replace(/\(/g, '').replace(/\)/g, '').replace(/\|/g, '')+STOPSYMBOL;
            ALPHABETS = ALPHABET+SPECIALS;
            $('#alphabetInput').remove();
            $('#alphabet').html('<strong class="grayc">'+ALPHABET.substr(0, ALPHABET.length-1)+'</strong>');
            alphabetEdit = false;
        }
    });
    $('#alphabet').dblclick(function() {
        if (alphabetEditable) {
            alphabetEdit = true;
            $(this).html('<input id="alphabetInput" type="text" value="'+ALPHABET.substr(0,ALPHABET.length-1)+'" />');
            $('#alphabetInput').click(function(event) {
                event.stopPropagation();
            });
        }
    });
    // tooltips
    $('*.help').tooltip({showBody: " - "});
});

// Enable/disable if input length is > 0.
function checkLength(el, bId) {
	if (graphit && (el.id == 'word')) return;
	if(el.value.length > 0) {
		enable(bId);
	} else {
		disable(bId);
	};
};

// Enable/disable a enabled/disabled form item.
function enable(id) { $(id).removeAttr("disabled"); };
function disable(id) { $(id).attr("disabled","disabled"); };

// UI messages.
function graph_inprogress() {
	$('#checkMessage').html('...');
	$('#checkMessage').removeClass('success');
	$('#checkMessage').removeClass('failure');
	$('#word').removeClass('success');
	$('#word').removeClass('failure');
	$('#word').addClass('inprogress');
	window.g.mover.attr({fill: 'yellow'});//'#ffff88'});
};
function graph_success() {
	$('#checkMessage').html('Word accepted');
	$('#checkMessage').removeClass('failure');
	$('#checkMessage').addClass('success');
	$('#word').removeClass('failure');
	$('#word').removeClass('inprogress');
	$('#word').addClass('success');
	$('#checkMessage').effect("highlight", {}, 1000);
    if(graphit) {
	    window.g.mover.attr({fill: 'green'});//'#cdeb8b'});
    }
};
function graph_failure() {
	$('#checkMessage').html('Word not accepted');
	$('#checkMessage').removeClass('success');
	$('#checkMessage').addClass('failure');
	$('#word').removeClass('success');
	$('#word').removeClass('inprogress');
	$('#word').addClass('failure');
	$('#checkMessage').effect("highlight", {}, 1000);
	window.g.mover.animate({fill: 'red'});//'#b02b2c'}, 250);
};

// Call of RegexParser.parse() from UI.
function uiParse() {
    var regex = $('#regex').attr('value');
    if (regex.match(/\*(\(|\))*\*/)) {
        alert("Supernumerous * symbol(s), please correct regular expression.");
        return;
    }
	disable('#graphit');
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
		var ttable = dfa.convert();
		disable('#regex');
		disable('#parseButton');
		if(!graphit) return;
		window.g = graph();
		disable('#checkButton');
	};
	$('#parseMessage').effect("highlight", {}, 1000);
	
	// preparing graph movements
	window.gCurrentState = g.nodes[0];
	window.gPrevStates = [];
	gPrevStates.push(gCurrentState);
	window.inSameState = [];
	window.failedInputs = [];
	window.gPrevState = gCurrentState;
	g.mover = g.paper.circle(
		gCurrentState.node[1][0].cx.baseVal.value,
		gCurrentState.node[1][0].cy.baseVal.value, 30
	).attr({fill:'#ffff88', stroke: '#ccc', 'stroke-width': 4,  opacity: 0.5});
	graph_inprogress();
	
};

// Call of NfaSimulator.simulate() from UI.
function uiSimulate() {
	var simulator = new NfaSimulator(nfa);
	var check = simulator.simulate($('#word').attr('value'));
	if (!check) {
		graph_failure();
	} else {
		graph_success();
	};
};

// Filter input.
function getKey(e, set) {
	var key = String.fromCharCode(e.which);
	if (e.which == 13) return true;
	if (set.indexOf(key) >= 0 || e.which == 8) {
		return true;
	};
	return false;
};

// Moving inside the graph by input symbols.
function graphMoveByInput(e) {
    if (lock) {
        if (failedInputs) {
            lock = false;
        } else {
            //var w = $('#word').attr('value');
            //$('#word').attr('value', w.substr(0, w.length-1));
            lock = false;
            return false;
        }
    } else {
        lock = true;
    }

	// no graph
	if(!graphit) return;
	
	// we are at the beginning
	if (!gCurrentState || !gPrevState) {
		gPrevStates.push(g.nodes[0]);
		gPrevState =  g.nodes[0];
		gCurrentState = g.nodes[0];
	};
	
	// backspace
	if (e.which == 8) {
		// step over failed inputs.
		if (window.failedInputs.length > 0) {
			if(window.failedInputs.length == 1) {
				if (ttable[gCurrentState.name].isFinal) {
					graph_success();
				} else {
					graph_inprogress();
				};
			};
			window.failedInputs.pop();
			return;
		}
		
		// no state change
		if (window.inSameState.length > 0) {
			var mx = g.mover.attr('cx');
			var my = g.mover.attr('cy');
			var ll = g.paper.path('M'+mx+','+my+' '+mx+','+(my-25)+'Z').attr({stroke: 0});
			window.setTimeout(function() { g.mover.animateAlong(ll, 250, "bounce"); }, 250);
			window.inSameState.pop();
			if (ttable[window.gCurrentState.name].isFinal) {
				graph_success();
			} else {
				graph_inprogress();
			}
			return;
		}
		
		// go back one state
		window.gPrevState = gPrevStates.pop();
        if (!window.gPrevState) return; // none of word left
		window.setTimeout(function() {
            if (!window.gPrevState) return; // none of word left
            g.mover.animate({cx:gPrevState.node[1][0].cx.baseVal.value, cy:gPrevState.node[1][0].cy.baseVal.value}, 250);
            lock = false;
        }, 250);
		window.gCurrentState = gPrevState;
		if (ttable[window.gCurrentState.name].isFinal) {
			graph_success();
		} else {
			graph_inprogress();
		};
		return;
	};
	
	// getting input
	var key = String.fromCharCode(e.which);
	var gNextState = g.graphNodeByName[window.ttable[window.gCurrentState.name][key]];

	graph_inprogress();
	
	// --> failure
	if (!gNextState) {
		window.failedInputs.push(true);
		graph_failure();
		return;
	};
	
	// no state change
	if(gNextState.name == gCurrentState.name) {
		window.setTimeout(function() {
            g.mover.animateAlong(gCurrentState.node[4], 350);lock = false;
        }, 125);
		window.inSameState.push(true);
        if (ttable[window.gCurrentState.name].isFinal) {
			graph_success();
		} else {
			graph_inprogress();
		};
		return;
	} else {
		// state change
		var theConn;
		for (var c in g.connections) {
			if ((window.gCurrentState.name == g.connections[c].name1)  && (gNextState.name == g.connections[c].name2)) {
				theConn = g.connections[c];
				break;
			};
		};
		var x = gCurrentState.node[1][0].cx.baseVal.value;
		var y = gCurrentState.node[1][0].cy.baseVal.value;
		line = g.paper.path(
			'M'+x+gCurrentState.node[1][0].r.baseVal.value+','+y+' '+theConn.line.attr('path').toString().substring(1)
			+'L'+(gNextState.node[1][0].cx.baseVal.value)+','+gNextState.node[1][0].cy.baseVal.value
			).attr({stroke:'none'});
	   (function(g, line) {
	        setTimeout(function() {
	          	g.mover.animateAlong(line, 250);
                lock = false;
				return line;
			}, 250);
	    })(g, line);
	};
	window.gPrevStates.push(gCurrentState);
	window.gPrevState = gCurrentState;
	window.gCurrentState = gNextState;
	if (ttable[window.gCurrentState.name].isFinal) {
		graph_success();
	};
};

