var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// Encoder.js
var require_Encoder = __commonJS({
  "Encoder.js"(exports2, module2) {
    var fs = require("fs");
    var path = require("path");
    var encoder = JSON.parse(fs.readFileSync(path.join(__dirname, "./encoder.json")));
    var bpe_file = fs.readFileSync(path.join(__dirname, "./vocab.bpe"), "utf-8");
    var range = (x, y) => {
      const res = Array.from(Array(y).keys()).slice(x);
      return res;
    };
    var ord = (x) => {
      return x.charCodeAt(0);
    };
    var chr = (x) => {
      return String.fromCharCode(x);
    };
    var textEncoder = new TextEncoder("utf-8");
    var encodeStr = (str) => {
      return Array.from(textEncoder.encode(str)).map((x) => x.toString());
    };
    var textDecoder = new TextDecoder("utf-8");
    var decodeStr = (arr) => {
      return textDecoder.decode(new Uint8Array(arr));
    };
    var dictZip = (x, y) => {
      const result = {};
      x.map((_, i) => {
        result[x[i]] = y[i];
      });
      return result;
    };
    function bytes_to_unicode() {
      const bs = range(ord("!"), ord("~") + 1).concat(range(ord("\xA1"), ord("\xAC") + 1), range(ord("\xAE"), ord("\xFF") + 1));
      let cs = bs.slice();
      let n = 0;
      for (let b = 0; b < 2 ** 8; b++) {
        if (!bs.includes(b)) {
          bs.push(b);
          cs.push(2 ** 8 + n);
          n = n + 1;
        }
      }
      cs = cs.map((x) => chr(x));
      const result = {};
      bs.map((_, i) => {
        result[bs[i]] = cs[i];
      });
      return result;
    }
    function get_pairs(word) {
      const pairs = /* @__PURE__ */ new Set();
      let prev_char = word[0];
      for (let i = 1; i < word.length; i++) {
        const char = word[i];
        pairs.add([prev_char, char]);
        prev_char = char;
      }
      return pairs;
    }
    var pat = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;
    var decoder = {};
    Object.keys(encoder).map((x) => {
      decoder[encoder[x]] = x;
    });
    var lines = bpe_file.split("\n");
    var bpe_merges = lines.slice(1, lines.length - 1).map((x) => {
      return x.split(/(\s+)/).filter(function(e) {
        return e.trim().length > 0;
      });
    });
    var byte_encoder = bytes_to_unicode();
    var byte_decoder = {};
    Object.keys(byte_encoder).map((x) => {
      byte_decoder[byte_encoder[x]] = x;
    });
    var bpe_ranks = dictZip(bpe_merges, range(0, bpe_merges.length));
    var cache = /* @__PURE__ */ new Map();
    function bpe(token) {
      if (cache.has(token)) {
        return cache.get(token);
      }
      ``;
      let word = token.split("");
      let pairs = get_pairs(word);
      if (!pairs) {
        return token;
      }
      while (true) {
        const minPairs = {};
        Array.from(pairs).map((pair) => {
          const rank = bpe_ranks[pair];
          minPairs[isNaN(rank) ? 1e11 : rank] = pair;
        });
        const bigram = minPairs[Math.min(...Object.keys(minPairs).map(
          (x) => {
            return parseInt(x);
          }
        ))];
        if (!(bigram in bpe_ranks)) {
          break;
        }
        const first = bigram[0];
        const second = bigram[1];
        let new_word = [];
        let i = 0;
        while (i < word.length) {
          const j = word.indexOf(first, i);
          if (j === -1) {
            new_word = new_word.concat(word.slice(i));
            break;
          }
          new_word = new_word.concat(word.slice(i, j));
          i = j;
          if (word[i] === first && i < word.length - 1 && word[i + 1] === second) {
            new_word.push(first + second);
            i = i + 2;
          } else {
            new_word.push(word[i]);
            i = i + 1;
          }
        }
        word = new_word;
        if (word.length === 1) {
          break;
        } else {
          pairs = get_pairs(word);
        }
      }
      word = word.join(" ");
      cache.set(token, word);
      return word;
    }
    function encode2(text) {
      let bpe_tokens = [];
      const matches = Array.from(text.matchAll(pat)).map((x) => x[0]);
      for (let token of matches) {
        token = encodeStr(token).map((x) => {
          return byte_encoder[x];
        }).join("");
        const new_tokens = bpe(token).split(" ").map((x) => encoder[x]);
        bpe_tokens = bpe_tokens.concat(new_tokens);
      }
      return bpe_tokens;
    }
    function decode2(tokens) {
      let text = tokens.map((x) => decoder[x]).join("");
      text = decodeStr(text.split("").map((x) => byte_decoder[x]));
      return text;
    }
    module2.exports = {
      encode: encode2,
      decode: decode2
    };
  }
});

// index.js
var { encode, decode } = require_Encoder();
module.exports = {
  encode,
  decode
};
