exports.handleSqlError = (err) => {
  let return_message;
  if (err.sqlState) {
    return_message = `[${err.sqlState}] ${err.code}`;
  } else {
    return_message = err.message;
  }
  return return_message
};