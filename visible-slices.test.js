const getVisibleSlices = require('./visible-slices');

test('visible-slices: empty', () => {
  const res = getVisibleSlices([]);
  expect(res).toStrictEqual([]);
});

test('visible-slices: start out of range', () => {
  const res = () => getVisibleSlices([
    {start: 1, end: 3, rank: 0},
    {start: -3e9, end: 4, rank: 0},
    {start: 3, end: 8, rank: 0}
  ]);

  expect(res).toThrow('start out of range');
});

test('visible-slices: end out of range', () => {
  const res = () => getVisibleSlices([
    {start: 2, end: 4, rank: 0},
    {start: 1, end: 3, rank: 0},
    {start: 3, end: 5e10, rank: 0}
  ]);

  expect(res).toThrow('end out of range');
});

test('visible-slices: rank out of range', () => {
  const res = () => getVisibleSlices([
    {start: 2, end: 4, rank: 0},
    {start: 1, end: 3, rank: -4e9},
    {start: 3, end: 5, rank: 0}
  ]);

  expect(res).toThrow('rank out of range');
});

test('visible-slices: start must be integer', () => {
  const res = () => getVisibleSlices([{start: '1', end: 3, rank: 0}]);
  expect(res).toThrow('start must be integer');
});

test('visible-slices: end must be integer', () => {
  const res = () => getVisibleSlices([{start: 1, end: [3], rank: 0}]);
  expect(res).toThrow('end must be integer');
});

test('visible-slices: rank must be integer', () => {
  const res = () => getVisibleSlices([{start: 1, end: 3}]);
  expect(res).toThrow('rank must be integer');
});

test('visible-slices: bogus slice: start = end', () => {
  const res = () => getVisibleSlices([{start: 4, end: 4, rank: 0}]);
  expect(res).toThrow('bogus slice');
});

test('visible-slices: bogus slice: start > end', () => {
  const res = () => getVisibleSlices([{start: 20, end: 4, rank: 0}]);
  expect(res).toThrow('bogus slice');
});

test('visible-slices: get visible slices', () => {
  const S = [
    {start: 13, end: 15, rank: 1}, // S[0] -- pale red
    {start: 12, end: 15, rank: 2}, // S[1] -- pale orange
    {start: 2, end: 5, rank: 1}, // S[2] -- pale yellow
    {start: 7, end: 9, rank: 2}, // S[3] -- pale green 1
    {start: 7, end: 9, rank: 2}, // S[4] -- pale green 2
    {start: 6, end: 8, rank: 2}, // S[5] -- fresh green
    {start: 2, end: 5, rank: 4}, // S[6] -- pale gray
    {start: 5, end: 11, rank: 4}, // S[7] -- air blue
    {start: 9, end: 10, rank: 1}, // S[8] -- cyan blue
    {start: 1, end: 11, rank: 3}, // S[9] -- magenta purple
  ];

  const R = [
    {start: 1, end: 2, in: S[9]},
    {start: 2, end: 5, in: S[2]},
    {start: 5, end: 6, in: S[9]},
    {start: 6, end: 8, in: S[5]},
    {start: 8, end: 9, in: S[3]},
    {start: 9, end: 10, in: S[8]},
    {start: 10, end: 11, in: S[9]},
    {start: 12, end: 13, in: S[1]},
    {start: 13, end: 15, in: S[0]},
  ];

  const res = getVisibleSlices(S);
  expect(res).toStrictEqual(R);
});

function rand(from, to) {
  const value = Math.floor(Math.random() * (to - from) + from);
  return value;
}

function randRanges(from, to, count) {
  const ranges = [];

  for (let i = 0; i < count; i++) {
    const start = rand(from, to);
    const end = rand(from, to);
    const rank = rand(-100, 100);
    if (start === end) continue;
    if (start > end) ranges.push({start: end, end: start, rank});
    else ranges.push({start, end, rank});
  }

  return ranges;
}

test('visible-slices: crash test', () => {
  const N = 100000;
  const start = -100;

  const time = process.hrtime.bigint();
  const end = N + start;
  const S = randRanges(start, end, N);
  const res = getVisibleSlices(S);
  const diff = process.hrtime.bigint() - time;
  console.log('visible-slices: crash test time for', N, 'slices:', (Number(diff) / 1e9).toFixed(3), 's');
  expect(res.length).toBeGreaterThan(0);
});
