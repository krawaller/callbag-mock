let test = require('tape');

let makeMockCallbag = require('./index');

test('it works with full signature', t => {
  let history = [];
  const reporter = (name,dir,t,d) => history.push([name,dir,t,typeof d]);

  const source = makeMockCallbag('fakeSource', reporter, true);
  const sink = makeMockCallbag('fakeSink', reporter);

  source(0, sink);

  source.emit(1, 'foo');
  sink.emit(1);

  t.deepEqual(history, [
    ['fakeSource', 'body', 0, 'function'],
    ['fakeSink', 'body', 0, 'function'],
    ['fakeSink', 'body', 1, 'string'],
    ['fakeSource', 'talkback', 1, 'undefined'],
  ], 'values are registered as expected');

  t.end();
});
