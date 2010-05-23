/*
 * NfaState
 * Represents a state of a NFA (following Thompson's algorithm).
 */
function NfaState(symbol) {
    if(!symbol) {
        this.symbol = EPSILON;
    } else {
		this.symbol = symbol;
	};
    this.followUps = [];
    this.marked    = false;
	this.id		   = NEXTSTATE++;
};

// Accessor functions.
NfaState.prototype.mark = function(bool) { this.marked = bool; };
NfaState.prototype.getFollowUp = function(index) { return this.followUps[index]; };
NfaState.prototype.setFollowUp = function(index, state) {
    if (! ((index == 0) || (index==1)) ) return;
    this.followUps[index] = state;
};
