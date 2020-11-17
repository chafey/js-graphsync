//https://gist.github.com/tyru/29360dfa475d2fefaf6c4655a93c2cb0
function delay(msec, value) {
    return new Promise(done => setTimeout((() => done(value)), msec));
}
  
function isResolved(promise) {
    return Promise.race([delay(0, false), promise.then(() => true, () => false)]);
}

function isRejected(promise) {
    return Promise.race([delay(0, false), promise.then(() => false, () => true)]);
}

function isFinished(promise) {
    return Promise.race([delay(0, false), promise.then(() => true, () => true)]);
}

module.exports = {
    isResolved,
    isRejected,
    isFinished
}