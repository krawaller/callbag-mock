let test = require('tape');

let makeMockCallbag = require('.');

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

test('the connected method works', t => {
  const source = makeMockCallbag(true);
  const sink = makeMockCallbag();
  t.ok(!source.checkConnection());
  t.ok(!sink.checkConnection());
  source(0, sink);
  t.ok(source.checkConnection());
  t.ok(sink.checkConnection());
  sink.emit(2);
  t.ok(!source.checkConnection());
  t.ok(!sink.checkConnection());
  source(0, sink);
  source.emit(2);
  t.ok(!source.checkConnection());
  t.ok(!sink.checkConnection());
  t.end();
});

test('the talkback query methods work', t => {
  const source = makeMockCallbag(true);
  const sink = makeMockCallbag();
  source(0, sink);
  t.equal(source.getTalkback(), sink.getPartnerTalkback(), 'sink got source talkback');
  t.equal(sink, source.getPartnerTalkback(), 'source got sink as talkback');
  t.ok(!sink.getTalkback(), 'sink has no talkback');
  source.emit(2, 'error');
  t.ok(!source.getTalkback(), 'source talkback cleared after termination');
  t.ok(!source.getPartnerTalkback(), 'source partner talkback cleared after termination');
  t.ok(!sink.getPartnerTalkback(), 'sink partner talkback cleared after termination');
  t.end();
});

test('the getMessages method works', t => {
  const source = makeMockCallbag(true);
  const sink = makeMockCallbag();
  source(0, sink);
  const sourceTalkback = source.getTalkback();
  sink.emit(1);
  source.emit(1, 'foo');
  sink.emit(2);
  t.deepEqual(
    source.getMessages(),
    [
      [0, sink],
      [1, undefined],
      [2, undefined]
    ]
  );
  t.deepEqual(
    sink.getMessages(),
    [
      [0, sourceTalkback],
      [1, 'foo']
    ]
  );
  t.end();
});
