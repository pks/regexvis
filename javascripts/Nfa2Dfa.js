/*
 * Nfa2Dfa
 *
 */
function StateCmp(a, b) {
	if (a.id == b.id) {
		return true
	}
	return false
}

function NfaStackCmp(x, y) {
	var ret = true;
	if (x.length != y.length) { return false }
	for (var i=0; i < x.length; i++) {
		ret = ret && StateCmp(x.get(i), y.get(i));
	}
	return ret;
}

function Nfa2Dfa(nfa) {
	this.startState     = nfa.getStartState();
    this.acceptingState = nfa.getAcceptingState();
}

Nfa2Dfa.prototype.getStartState = function() { return this.startState }
Nfa2Dfa.prototype.getAcceptingState = function() { return this.acceptingState }

ttable = new Object();
Nfa2Dfa.prototype.do = function() {
	var dfaStates = new Stack();
	var q = new Stack();
	q.push(this.getStartState());
	var p = this.epsclosure(q)
	var q = p.copy();
	dfaStates.push(p);
	document.write('S '+p.str()+'<br />');
	
	var done = new Array();
	
	//var ttable = new Object();
	
	var ds = null;
	var j = 0;
	while (!dfaStates.isEmpty()) {
		ds = dfaStates.pop();
		
		for (var i = 0; i < ALPHABET.length; i++) {
			a = ALPHABET.substring(i, i+1);
			var ds2 = ds.copy();
			x = this.epsclosure(this.move(a, ds));
			ds = ds2;

			var adone = false;
			for (var w=0; w < done.length; w++) {
				if(NfaStackCmp(done[w], x)) {
					adone = true;
					break;
				}
			}
			
			var q = ds.str().replace(/ /g, '_');
			var qq = x.str().replace(/ /g, '_');
			
			if (!ttable[q]) {
				ttable[q] = new Object();
				if(q.split('_').indexOf(''+this.getAcceptingState().id) >= 0) {
					ttable[q].isFinal = true;
				} else {
					ttable[q].isFinal = false;
				}	
			}
			
			
			
			ttable[q][a] = qq;
			
			if (x.length > 0 && !adone) {
				for (var h=0; h < j; h++) {
					document.write("\t");
				}
				
				document.write(a+' '+x.str()+'<br />');
				dfaStates.push(x);
			}
	    }
		done.push(ds);
		j++;
	}
}

Nfa2Dfa.prototype.epsclosure = function(q) {
    var s = null;
    var t = null;

	var p = new Stack();

    while(!q.isEmpty()) {
        s = q.pop();
        p.push(s);

        if(s.symbol == EPSILON) {
            for (var i = 0; i < 2; i++) {
                t = s.getFollowUp(i);
                if (t!=null) {
 					q.push(t);
                }
            }
        }
    }
	return p;
}


Nfa2Dfa.prototype.move = function(str, p) {
	var s = null;
	
	var q = new Stack();

    while(!p.isEmpty()) {
        s = p.pop();
        s.mark(false);
        if (s.symbol == str) {
            s.getFollowUp(0).mark(true);
            q.push(s.getFollowUp(0));
        }
    }
	return q;
}


/*
 * DfaStates
 *
 */
function DfaState(nfaStates) {
	this.nfaStates = nfaStates;
	this.marked = false;
}

DfaState.prototype.compare = function(b) {
	
}

DfaState.prototype.str = function() {
	res = '';
	for (var i=0; i < this.nfaStates.length; i++) {
		res += this.nfaStates[i].id + ' '
	}
	return res
}