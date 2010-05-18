/*
 * NfaSimulator
 *
 */
function NfaSimulator(nfa) {
	this.startState     = nfa.getStartState();
    this.acceptingState = nfa.getAcceptingState();
}

NfaSimulator.prototype.getStartState = function() { return this.startState }
NfaSimulator.prototype.getAcceptingState = function() { return this.acceptingState }

NfaSimulator.prototype.simulate = function(word) {
	var a = '';
	var accepted = false;
    this.p = new Stack();
    this.q = new Stack();
    this.getStartState().mark(true);
    this.q.push(this.getStartState());
    word += REDELIMITER;
    for (var i = 0; i < word.length; i++) {	
        accepted = this.epsclosure();
		a = word.substring(i, i+1);
		this.move(a);
    }
    return accepted;
}

NfaSimulator.prototype.epsclosure = function() {
    var s = null;
    var t = null;
	var accepted = false;

    while(!this.q.isEmpty()) {
        s = this.q.pop();
        this.p.push(s);
        accepted = accepted || s == this.getAcceptingState();

        if(s.symbol == EPSILON) {
            for (var i = 0; i < 2; i++) {
                t = s.getFollowUp(i);
                if (t!=null) {
                    if(!t.marked) {
                        t.mark(true);
                        this.q.push(t);
                    }
                }
            }
        }
    }
    return accepted;
}

NfaSimulator.prototype.move = function(str) {
    var s = null;

    while(!this.p.isEmpty()) {
        s = this.p.pop();
        s.mark(false);
        if (s.symbol == str) {
            s.getFollowUp(0).mark(true);
            this.q.push(s.getFollowUp(0));
        }
    }
}
