# callbag-mock

[Callbag](https://github.com/callbag/callbag) mock with manual emitting and signal tapping.

Useful for unit testing other callbag packages, or for triggering signals in callbag chains from non-callbag code.

`npm install callbag-mock`

## usage

```typescript
(isSource?: boolean, reporter?: function) => mock
```

The `isSource` boolean decides whether the mock will handshake back when initialised (meaning it is a source).

A `reporter`, if provided, will be called each time the mock receives a signal:

```typescript
(t: 0 | 1 | 2, d: any, in: 'body' | 'talkback') => void
```

The third `in` parameter tells you whether the signal was received in the function body or the talkback.

The mock instance has an `.emit(t,d)` method for manually triggering signals:

```typescript
(t: 0 | 1 | 2, d: any)
```

There is a `.getReceivedData()` method to get all received data so far.

Use `.getMessages()` if you want *all* messages as `[t, d]` tuples.

Get references to sent talkbacks through `.getTalkback()` and received talkbacks through `.getPartnerTalkback()`.

You can also `.checkConnection()` to see whether or not the callbag has a live connection.

## example

```js
const mock = require('callbag-mock');

const reporter = (name, dir, t, d) => {
  if (t !== 0) console.log(name, dir, t, d);
}

const source = mock('source', reporter, true);
const sink = mock('sink', reporter);

source.checkConnection(); // false
sink.checkConnection(); // false

source(0, sink);

source.getTalkback() === sink.getPartnerTalkback() // true
sink === source.getPartnerTalkback() // true

source.emit(1, 'foo'); // 'sink', 'body', 1, 'foo'
sink.emit(1, 'bar'); // 'source', 'talkback', 1, 'bar'

sink.getReceivedData(); // ['foo']

source.checkConnection(); // true
sink.checkConnection(); // true
```
