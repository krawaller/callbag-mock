# callbag-mock

[Callbag](https://github.com/callbag/callbag) mock with manual emitting and signal tapping.

Useful for unit testing other callbag packages, or for triggering signals in callbag chains from non-callbag code.

`npm install callbag-map-to`

## usage

```typescript
(name: string, reporter: function, isSource: boolean) => mock
```

The `name` is used in the reporter call. The `isSource` boolean decides whether the mock will handshake back when initialised.

The `reporter` will be called each time the mock receives a signal:

```typescript
(name: string, in: 'body' | 'talkback', t: 0 | 1 | 2, d: any) => void
```

The mock instance has an `.emit` method for manually triggering `(t,d)`signals:

```typescript
(t: 0 | 1 | 2, d: any)
```

## example

```js
const mock = require('callbag-mock');

const reporter = (name, dir, t, d) => {
  if (t !== 0) console.log(name, dir, t, d);
}

const source = mock('source', reporter, true);
const sink = mock('sink', reporter);

source(0, sink);

source.emit(1, 'foo'); // 'sink', 'body', 1, 'foo'
sink.emit(1, 'bar'); // 'source', 'talkback', 1, 'bar'
```
