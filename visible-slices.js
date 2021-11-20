'use strict'
const range = 2147483648;
const validateInput = (task) => {
    if (task.end <= task.start) throw ('bogus slice')
    if (!Number.isInteger(task.start) || typeof (task.start) !== 'number') throw ('start must be integer')
    if (!Number.isInteger(task.end)) throw ('end must be integer')
    if (!Number.isInteger(task.rank)) throw ('rank must be integer')
    if (task.start < -1 * range || task.start >= range) throw ('start out of range')
    if (task.end < -1 * range || task.end >= range) throw ('end out of range')
    if (task.rank < -1 * range || task.rank >= range) throw ('rank out of range')
}
const compareFn = (a, b) => {
    return (a.rank - b.rank) || (a.start - b.start)
}
const solution = (input) => {
    if (input.length < 1) return [];
    const visibleSlice = [];
    const slots = {};
    input.sort(compareFn);

    input.forEach((task) => {
        validateInput(task)
        for (let start = task.start - 1; start < task.end - 1; start++) {
            const slot = slots[start];
            if (!slot || slot.rank > task.rank) {
                slots[start] = { in: task, rank: task.rank }
            }
        }
    });
    let T = 0;
    Object.keys(slots).forEach((key) => {
        T++;
        let lastKey = visibleSlice[visibleSlice.length - 1]
        if (lastKey && slots[key].in === slots[key - 1]?.in) {
            lastKey.end = (+key + 2);
        } else {
            visibleSlice.push({ start: +key + 1, end: +key + 2, in: slots[key].in })
        }
    })
    return visibleSlice;
}

module.exports = solution;