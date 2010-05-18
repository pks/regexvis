/*
 * Nfa
 *
 */
function Nfa(symbol) {
	this.startState     = null;
	this.acceptingState = null;
	
    if (symbol) {
        this.setStartState(new NfaState(symbol));
        this.setAcceptingState(new NfaState(false));
        this.getStartState().setFollowUp(0, this.getAcceptingState());
    }
}

Nfa.prototype.getStartState     = function() { return this.startState }
Nfa.prototype.setStartState     = function(s) { this.startState = s }
Nfa.prototype.getAcceptingState = function() { return this.acceptingState }
Nfa.prototype.setAcceptingState = function(s) { this.acceptingState = s }

Nfa.prototype.concat = function(nfa) {
    this.getAcceptingState().setFollowUp(0, nfa.getStartState());
    this.setAcceptingState(nfa.getAcceptingState());
    
	return this;
}

Nfa.prototype.union = function(nfa) {
    var s = new NfaState();
    var t = new NfaState();

    s.setFollowUp(0, this.getStartState());
    s.setFollowUp(1, nfa.getStartState());
    
    this.getAcceptingState().setFollowUp(0, t);
    nfa.getAcceptingState().setFollowUp(0, t);
    
    this.setStartState(s);
    this.setAcceptingState(t);

	return this;
}

Nfa.prototype.kleene = function() {
    var s = new NfaState();
    var t = new NfaState();

    s.setFollowUp(0, this.getStartState());
    s.setFollowUp(1, t);

    this.getAcceptingState().setFollowUp(0, this.getStartState());
    this.getAcceptingState().setFollowUp(1, t);

    this.setStartState(s);
    this.setAcceptingState(t);

    return this;
}
