/*
 * Nfa
 * NFA consisting of several NfaStates, following Thompson's algorithm.
 */
function Nfa(symbol) {
	this.startState = null;
	this.finalState = null;
	
    if (symbol) {
        this.setStartState(new NfaState(symbol));
        this.setFinalState(new NfaState(false));
        this.getStartState().setFollowUp(0, this.getFinalState());
    };
};

// Accessor functions.
Nfa.prototype.getStartState = function()  { return this.startState; };
Nfa.prototype.setStartState = function(s) { this.startState = s; };
Nfa.prototype.getFinalState = function()  { return this.finalState; };
Nfa.prototype.setFinalState = function(s) { this.finalState = s; };

// Concatenations: ab
Nfa.prototype.concat = function(nfa) {
    this.getFinalState().setFollowUp(0, nfa.getStartState());
    this.setFinalState(nfa.getFinalState());
    
	return this;
};

// Union: (a|b)
Nfa.prototype.union = function(nfa) {
    var s = new NfaState();
    var t = new NfaState();

    s.setFollowUp(0, this.getStartState());
    s.setFollowUp(1, nfa.getStartState());
    
    this.getFinalState().setFollowUp(0, t);
    nfa.getFinalState().setFollowUp(0, t);
    
    this.setStartState(s);
    this.setFinalState(t);

	return this;
};

// Kleene Star: a*
Nfa.prototype.kleene = function() {
    var s = new NfaState();
    var t = new NfaState();

    s.setFollowUp(0, this.getStartState());
    s.setFollowUp(1, t);

    this.getFinalState().setFollowUp(0, this.getStartState());
    this.getFinalState().setFollowUp(1, t);

    this.setStartState(s);
    this.setFinalState(t);

    return this;
};
