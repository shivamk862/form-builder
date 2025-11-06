const { parse } = require('@json2csv/node');

exports.exportToCsv = (data, fields) => {
  const opts = { fields };
  try {
    const csv = parse(data, opts);
    return csv;
  } catch (err) {
    console.error(err);
  }
};