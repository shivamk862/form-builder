const { Parser } = require('@json2csv/plainjs');

exports.exportToCsv = (data, fields) => {
  const opts = { fields };
  try {
    const parser = new Parser(opts);
    const csv = parser.parse(data);
    return csv;
  } catch (err) {
    console.error(err);
  }
};