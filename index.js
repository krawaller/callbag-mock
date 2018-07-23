function makeMockCallbag(...args) {
  let isSource = false;
  let report = ()=>{};
  args.forEach(a => {
    if (typeof a === 'boolean') isSource = a;
    else if (typeof a === 'function') report = a;
  });

  let partnerTalkback;
  let myTalkback;
  let receivedData = [];
  let messages = [];
  let mock = (t, d) => {
    report(t, d, 'body');
    messages.push([t, d]);
    if (t === 0){
      partnerTalkback = d;
      if (isSource) {
        myTalkback = (st, sd) => {
          report(st, sd, 'talkback');
          messages.push([st, sd]);
          if (st === 1 && sd !== undefined) {
            receivedData.push(sd);
          } else if (st === 2) {
            partnerTalkback = undefined;
            myTalkback = undefined;
          }
        };
        partnerTalkback(0, myTalkback)
      };
    } else if (t === 1 && d !== undefined) {
      receivedData.push(d);
    } else if (t === 2) {
      partnerTalkback = undefined;
      myTalkback = undefined;
    }
  };
  mock.emit = (t, d) => {
    if (!partnerTalkback) throw new Error(`Can't emit before anyone has connected`);
    partnerTalkback(t, d);
    if (t === 2){
      myTalkback = undefined;
      partnerTalkback = undefined;
    }
  };
  mock.getReceivedData = () => receivedData;
  mock.checkConnection = () => !!partnerTalkback;
  mock.getTalkback = () => myTalkback;
  mock.getPartnerTalkback = () => partnerTalkback;
  mock.getMessages = () => messages;
  return mock;
}

export default makeMockCallbag;
