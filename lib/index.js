'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exec = exports.parse = undefined;
exports.default = parse;

var _lodash = require('lodash');

var _xml2js = require('xml2js');

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isNumeric = function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var mapValue = function mapValue(value) {
  var ret = Array.isArray(value) ? value[0] : value;
  return isNumeric(ret) ? ret * 1 : ret;
};

var transformResponse = function transformResponse(res) {
  /* eslint-disable no-param-reassign */
  if (res && res.file) {
    var tracks = Array.isArray(res.file.track) ? res.file.track : [res.file.track];
    res.file.track = tracks.map(function (track) {
      return (0, _lodash.mapValues)(track, mapValue);
    });
  }
  return res;
};

function parse(buffer) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  (0, _xml2js.parseString)(buffer, {
    attrNameProcessors: [function (name) {
      return '_' + name;
    }],
    explicitArray: false,
    explicitRoot: false,
    mergeAttrs: true,
    normalizeTags: true,
    tagNameProcessors: [_lodash.camelCase]
  }, function (err, obj) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, transformResponse(obj));
  });
}

function exec(mediaPath) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  var mediainfo = _child_process2.default.spawn(require('path').dirname(require.main.filename)+'/../mediainfo', ['--Full', '--Output=XML', mediaPath]);

  var output = '';
  mediainfo.stdout.on('data', function (data) {
    output += data.toString('utf8');
  });
  mediainfo.on('close', function () {
    return parse(output, callback);
  });
}

exports.parse = parse;
exports.exec = exec;
//# sourceMappingURL=index.js.map
