/*
 * NfaSimulator
 * Simulate a NFA with a word. Check if regular expression produces word.
 */


function NfaSimulator(nfa) {
	this.startState = nfa.getStartState();
    this.finalState = nfa.getFinalState();
};

// Accessor functions.
NfaSimulator.prototype.getStartState = function() { return this.startState; };
NfaSimulator.prototype.getFinalState = function() { return this.finalState; };

// Main simulate function.
NfaSimulator.prototype.simulate = function(word) {
	var a, accepted = false;
    this.p = new Stack();
    this.q = new Stack();
    this.getStartState().mark(true);
    this.q.push(this.getStartState());
    word += REDELIMITER;  
	for (var i = 0; i < word.length; i++) {	
        accepted = this.epsclosure();
		a = word.substring(i, i+1);
		this.move(a);
    };
    return accepted;
};

// Get reachable states through epsilon transitions.
NfaSimulator.prototype.epsclosure = function() {
    var s, t, accepted = false;

    while(!this.q.isEmpty()) {
        s = this.q.pop();
        this.p.push(s);
        accepted = accepted || s == this.getFinalState();

        if(s.symbol == EPSILON) {
            for (var i = 0; i < 2; i++) {
                t = s.getFollowUp(i);
                if (t!=null) {
                    if(!t.marked) {
                        t.mark(true);
                        this.q.push(t);
                    };
                };
            };
        };
    };
    return accepted;
};

// Get reachable states through transitions with symbol.
NfaSimulator.prototype.move = function(symbol) {
    var s;

    while(!this.p.isEmpty()) {
        s = this.p.pop();
        s.mark(false);
        if (s.symbol == symbol) {
            s.getFollowUp(0).mark(true);
            this.q.push(s.getFollowUp(0));
        };
    };
};

