/*
 * RegexParser
 *
 */
function RegexParser(str) {
    this.str = str;
}

RegexParser.prototype.parse = function() {
    for (var i = 0; i < this.str.length; i++) {
        switch(this.str[i]) {
            case '(':
                break;
            case '|':
                break;
            case ')':
                break
            case '*':
                break
            
            default:
                //alert(this.str[i]);
        }
    };
}


/*
 * State
 *
 */
function State(symbol) {
    if(!symbol) {
        symbol = '#';
    }
    this.symbol    = symbol;
    this.followUps = [];
    this.marked    = false;
}

State.prototype.mark = function(b) {
    this.marked = b;
}

State.prototype.setFollowUp = function(index, state) {
    if (!((index == 0) || (index==1)) ) return;
    this.followUps[index] = state;
}


/*
 * Nfa
 *
 */
function Nfa(symbol) {
    this.startState;
    this.endState;
    if (symbol) {
        this.startState = new State(symbol);
        this.endState   = new State(false);
        this.startState.setFollowUp(0, this.endState);
    }
}

Nfa.prototype.concatination = function(nfa) {
    this.endState.setFollowUp(0, nfa);
    this.endState = nfa.endState;
}

Nfa.prototype.union = function(nfa) {
    var s0 = new State();
    var s1 = new State();

    s0.setFollowUp(0, );
    s1.setFollowUp(1, );
}

