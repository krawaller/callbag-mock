function makeMockCallbag(...args) {
  let isSource = false;
  let report = ()=>{};
  args.forEach(a => {
    if (typeof a === 'boolean') isSource = a;
    else if (typeof a === 'function') report = a;
  });

  let talkback;
  let receivedData = [];
  let mock = (t, d) => {
    report(t, d, 'body');
    if (t === 0){
      talkback = d;
      if (isSource) talkback(0, (st, sd) => {
        report(st, sd, 'talkback');
        if (st === 1 && sd !== undefined) {
          receivedData.push(sd);
        }
      });
    } else if (t === 1 && d !== undefined) {
      receivedData.push(d);
    }
  };
  mock.emit = (t, d) => {
    if (!talkback) throw new Error(`Can't emit before anyone has connected`);
    talkback(t, d);
  };
  mock.getReceivedData = () => receivedData;
  return mock;
}

module.exports = makeMockCallbag;
