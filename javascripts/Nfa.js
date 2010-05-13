/*
 * Nfa
 *
 */
function Nfa(symbol) {
    this.startState;
    this.acceptingState;

    if (symbol) {
        this.setStartState(new State(symbol));
        this.setAcceptingState(new State(false));
        this.getStartState().setFollowUp(0, this.getAcceptingState());
    }
}

Nfa.prototype.getStartState     = function() { return this.startState }
Nfa.prototype.setStartState     = function(s) { this.startState = s }
Nfa.prototype.getAcceptingState = function() { return this.acceptingState }
Nfa.prototype.setAcceptingState = function(s) { this.acceptingState = s }

Nfa.prototype.concatenation = function(nfa) {
    this.getAcceptingState().setFollowUp(0, nfa.getStartState());
    this.setAcceptingState(nfa.getAcceptingState());
    return this;
}

Nfa.prototype.union = function(nfa) {
    var s = new State();
    var t = new State();

    s.setFollowUp(0, this.getStartState());
    s.setFollowUp(1, nfa.getStartState());
    
    this.getAcceptingState().setFollowUp(0, t);
    nfa.getAcceptingState().setFollowUp(0, t);
    
    this.setStartState(s);
    this.setAcceptingState(t);
}

Nfa.prototype.star = function() {
    var s = new State();
    var t = new State();

    s.setFollowUp(0, this.getStartState());
    s.setFollowUp(1, t);

    this.getAcceptingState().setFollowUp(0, this.getStartState());
    this.getAcceptingState().setFollowUp(1, t);

    this.setStartState(s);
    this.setAcceptingState(t);

    return this;
}

