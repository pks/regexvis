/*
 * NfaSimulator
 *
 */
function NfaSimulator(nfa) {
    this.q = new Queue;
    this.p = new Queue;
    this.startState = nfa.getStartState();
    this.acceptingState = nfa.getAcceptingState();
}

NfaSimulator.prototype.getStartState = function() {
    return this.startState;   
}

NfaSimulator.prototype.getAcceptingState = function() {
    return this.acceptingState;
}

NfaSimulator.prototype.run = function(word) {
    this.word = word;
    this.str  = '';
    this.accepted = false;
    
    this.getStartState().mark(true);
    this.q.push(this.getStartState());

    this.str += '$';
    
    for (var i = 0; i < word.length; i++) {
        this.accepted = this.epsclosure();
        this.str = this.word.substring(i, i+1);
        this.move(this.str);
    }

    return accepted;
}


NfaSimulator.prototype.epsclosure = function() {
    var s, t;
    accepted = false;

    while(!this.q.empty()) {
        s = this.q.pop();
        this.p.push(s);
        accepted = accepted || s == this.getAcceptingState();

        if(s.symbol == '&') {
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
    var s;

    while(!this.p.empty()) {
        s = this.q.pop();
        s.mark(false);
        if (s.symbol == str) {
            s.getFollowUp(0).mark(true);
            this.q.push(s.getFollowUp(0));
        }
    }
}

