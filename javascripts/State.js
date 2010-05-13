/*
 * State
 *
 */
function State(symbol) {
    if(!symbol) {
        symbol = EPSILON;
    }
    this.symbol    = symbol;
    this.followUps = [];
    this.marked    = false;
}

State.prototype.mark = function(mark) { this.marked = mark }
State.prototype.getFollowUp = function(index) { return this.followUps[index] }
State.prototype.setFollowUp = function(index, state) {
    if (!((index == 0) || (index==1)) ) return;
    this.followUps[index] = state;
}

