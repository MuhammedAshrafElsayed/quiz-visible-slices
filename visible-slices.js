'use strict'
const range = 2147483648;
const validateInput = (task) => {
    if (task.end <= task.start) throw ('bogus slice')
    if (!Number.isInteger(task.start)) throw ('start must be integer')
    if (!Number.isInteger(task.end)) throw ('end must be integer')
    if (!Number.isInteger(task.rank)) throw ('rank must be integer')
    if (task.start < -range || task.start >= range) throw ('start out of range')
    if (task.end < -range || task.end >= range) throw ('end out of range')
    if (task.rank < -range || task.rank >= range) throw ('rank out of range')
}
const compareFn = (a, b) => {
    return (a.start - b.start) || (a.rank - b.rank);
}
const getMaxRank = (task1, task2) => {
    if (task1.in) {
        if (task2.in) return task1.in.rank <= task2.in.rank ? task1 : task2;
        return task1.in.rank <= task2.rank ? task1 : task2;
    }
    if(task2.in) return task1.rank <= task2.in.rank ? task1 : task2;
    return task1.rank <= task2.rank ? task1 : task2;
}
const getLeadingTask = (task1, task2) => {
    // return task1.start < task2.start ? task1 : task2
    if (task1.start === task2.start) return null;
    return task1.start < task2.start ? task1 : task2
}
const isIntersected = (task1, task2) => {
    return !(task1.end <= task2.start || task2.end <= task1.start);
}
const validTask = (task) => {
    return task.start < task.end;
}
/**
 * @param {*} task1 first task with the earliest start 
 * @param {*} task2 the new task in the sorted array
 * @returns 
 * we have 7 possible cases
     * case1: task1 and task2 does not intersect and task2 is the leader task then task1 will win
     * case2: task1 and task2 does not intersect and task1 is the leader task then task1 and task2 will win
     * case3: task1 is the leader task and task2 has higher rank
     * case4: task1 is the leader task and higher rank
     * case5: task2 is the leader task and higher rank
     * case6: task2 is the leader task and task1 has higher rank
     * case7: both tasks has the same starting time then the higherrank task will be applied
 */
const placetasks = (task1, task2) => {
    let tasks = [];
    let newTask = {};
    /** if the task starts and ends on the same time then it is not valid */
    if (!validTask(task1)) return []
    /** task1 will be applied if task2 ends before task1 starts is it has lower rank in the sorted array */
    if (task1.start >= task2.end) return [task1]
    /** get the task with the highest rank */
    let highRank = getMaxRank(task1, task2);
    /** get the task wich starts early it retuns null if the two tasks start time is equal */
    let leadingTask = getLeadingTask(task1, task2);
    let intersected = isIntersected(task1, task2);
    /** task1 and task2 does not intersect and task2 is the leader task then task1 will be applied */
    if (!intersected && task2 === leadingTask) return [task1]
    /** task1 and task2 does not intersect and task1 is the leader task then task1 will be applied */
    if (!intersected && task1 === leadingTask) {
        newTask.start = task2.start;
        newTask.end = task2.end;
        newTask.in = task2.in || task2;
        return [task1, newTask];
    }
    if (task1 === leadingTask && highRank === task2) {
        newTask.start = task1.start;
        newTask.end = Math.max(task1.start, task2.start);
        newTask.in = task1.in || task1;
    } else if (task1 === leadingTask && highRank === task1) {
        newTask.start = task1.start;
        newTask.end = task1.end;
        newTask.in = task1.in || task1;
    } else if (task2 === leadingTask && highRank === task2) {
        newTask.start = task1.start;
        newTask.end = task2.end;
        newTask.in = task2.in || task2;
    } else if (task2 === leadingTask && highRank === task1) {
        newTask.start = task1.start;
        newTask.end = task1.end;
        newTask.in = task1.in || task1;
    } else {
        newTask.start = task1.start;
        newTask.end = highRank.end;
        newTask.in = highRank.in || highRank;
    }
    if (validTask(newTask)) tasks.push(newTask);
    /** next task should start from the end of the new task */
    let restTask1 = { ...task1, start: newTask.end }
    /** recur the proccess */
    let subTasks = placetasks(restTask1, task2);
    tasks.push(...subTasks)
    return tasks;
}

const solution = (input) => {
    if (input.length < 1) return [];
    const visibleSlice = [];

    /** sort by minimum start and highest rank */
    input.sort(compareFn);

    let task1 = { start: input[0].start, end: input[0].end, in: input[0] };
    validateInput(input[0]);
    for (let index = 1; index < input.length; index++) {
        const task2 = input[index];
        validateInput(task2);
        /** place each 2 tasks in the timeline */
        const slots = placetasks(task1, task2);
        /** last task needs to be merged with the next task if exists */
        task1 = slots.pop();
        visibleSlice.push(...slots);
    }
    visibleSlice.push(task1);
    return visibleSlice;
}

module.exports = solution;