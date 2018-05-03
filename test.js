let test = require('tape');

let makeMockCallbag = require('./index');

test('it works with full signature', t => {
  let history = [];
  const reporter = (name, t, d, dir) => history.push([name,dir,t,typeof d]);

  const source = makeMockCallbag(reporter.bind(null,'fakeSource'), true);
  const sink = makeMockCallbag(reporter.bind(null,'fakeSink'));

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

test('the receivedData method works', t => {
  let history = [];

  const source = makeMockCallbag(true);
  const sink = makeMockCallbag();

  source(0, sink);

  source.emit(1, 'foo');
  source.emit(1, 'bar');

  t.deepEqual(
    sink.getReceivedData(),
    ['foo', 'bar'],
    'values are registered as expected'
  );

  t.end();
});
