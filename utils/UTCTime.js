function getCurrentUTCTime() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = ('0' + (now.getUTCMonth() + 1)).slice(-2); // Add leading zero if single digit
  const day = ('0' + now.getUTCDate()).slice(-2); // Add leading zero if single digit
  const hour = ('0' + now.getUTCHours()).slice(-2); // Add leading zero if single digit
  const minute = ('0' + now.getUTCMinutes()).slice(-2); // Add leading zero if single digit
  const second = ('0' + now.getUTCSeconds()).slice(-2); // Add leading zero if single digit

  const isoTime = `${year}/${month}/${day} ${hour}:${minute}:${second}`;

  return isoTime;
}

// console.log(getCurrentUTCTime());

  module.exports = getCurrentUTCTime;
