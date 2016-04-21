import {camelCase, mapValues} from 'lodash';
import {parseString as xmlParseString} from 'xml2js';

const isNumeric = (n) =>
  !isNaN(parseFloat(n)) && isFinite(n);

const mapValue = (value) => {
  const ret = Array.isArray(value) ? value[0] : value;
  return isNumeric(ret) ? ret * 1 : ret;
};

const transformResponse = (res) => {
  /* eslint-disable no-param-reassign */
  res.file.track = res.file.track.map(track => mapValues(track, mapValue));
  return res;
};

export default function parse(buffer, callback = () => {}) {
  xmlParseString(buffer, {
    attrNameProcessors: [(name) => `$${name}`],
    explicitArray: false,
    explicitRoot: false,
    mergeAttrs: true,
    normalizeTags: true,
    tagNameProcessors: [camelCase]
  }, (err, obj) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, transformResponse(obj));
  });
}