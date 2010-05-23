/*
 * Nfa2Dfa
 * Convert a NFA to a DFA utilizing epsilon closure.
 */

// Compare two NfaStates for equality.
function StateCmp(a, b) {
	if (a.id == b.id) {
		return true
	};
	return false
};

// Compare two stacks filled with NfaStates for euqality.
function NfaStackCmp(x, y) {
	var b = true;
	if (x.length != y.length) { return false }
	for (var i=0; i < x.length; i++) {
		b = b && StateCmp(x.get(i), y.get(i));
	};
	return b;
};

function Nfa2Dfa(nfa) {
	this.startState = nfa.getStartState();
    this.finalState = nfa.getFinalState();
}

// Accessor functions.
Nfa2Dfa.prototype.getStartState = function() { return this.startState; };
Nfa2Dfa.prototype.getFinalState = function() { return this.finalState; };

// Do conversion.
Nfa2Dfa.prototype.do = function() {
	var dfaStates = new Stack();
	var q = new Stack();
	q.push(this.getStartState());
	var p = this.epsclosure(q)
	var q = p.copy();
	dfaStates.push(p);
	
	var done = new Array();	
	var ds, j = 0;
	while (!dfaStates.isEmpty()) {
		ds = dfaStates.pop();
		
		for (var i = 0; i < ALPHABET.length; i++) {
			symbol = ALPHABET.substring(i, i+1);
			var dsCopy = ds.copy();
			next = this.epsclosure(this.move(symbol, ds));
			ds = dsCopy;

			var alreadyDone = false;
			for (var k = 0; k < done.length; k++) {
				if(NfaStackCmp(done[k], next)) {
					alreadyDone = true;
					break;
				};
			};
			
			var dsStr = ds.str().replace(/ /g, '_');			
			if (!ttable[dsStr]) {
				ttable[dsStr] = new Object();
				if(dsStr.split('_').indexOf(''+this.getFinalState().id) >= 0) {
					ttable[dsStr].isFinal = true;
				} else {
					ttable[dsStr].isFinal = false;
				};
			};
			
			var nextStr = next.str().replace(/ /g, '_');
			ttable[dsStr][symbol] = nextStr;
			
			if (next.length > 0 && !alreadyDone) {
				dfaStates.push(next);
			};
	    };
		done.push(ds);
		j++;
	};
};

// Reachable states over epsilon transitions.
Nfa2Dfa.prototype.epsclosure = function(q) {
    var s, t, p = new Stack();

    while(!q.isEmpty()) {
        s = q.pop();
        p.push(s);

        if(s.symbol == EPSILON) {
            for (var i = 0; i < 2; i++) {
                t = s.getFollowUp(i);
                if (t != null) {
 					q.push(t);
                };
            };
        };
    };
	return p;
};

// Reachable states over transitions with symbol.
Nfa2Dfa.prototype.move = function(str, p) {
	var s, q = new Stack();
	
    while(!p.isEmpty()) {
        s = p.pop();
        s.mark(false);
        if (s.symbol == str) {
            s.getFollowUp(0).mark(true);
            q.push(s.getFollowUp(0));
        };
    };
	return q;
};
