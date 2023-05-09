var wn = Object.create;
var Ht = Object.defineProperty;
var yn = Object.getOwnPropertyDescriptor;
var kn = Object.getOwnPropertyNames;
var xn = Object.getPrototypeOf,
    An = Object.prototype.hasOwnProperty;
var Kt = (D, V) => () => (V || D((V = {
    exports: {}
}).exports, V), V.exports);
var Cn = (D, V, ge, xe) => {
    if (V && typeof V == "object" || typeof V == "function")
        for (let ue of kn(V)) !An.call(D, ue) && ue !== ge && Ht(D, ue, {
            get: () => V[ue],
            enumerable: !(xe = yn(V, ue)) || xe.enumerable
        });
    return D
};
var Zt = (D, V, ge) => (ge = D != null ? wn(xn(D)) : {}, Cn(V || !D || !D.__esModule ? Ht(ge, "default", {
    value: D,
    enumerable: !0
}) : ge, D));
var Qt = Kt((Gt, St) => {
    var Nn = function() {
        "use strict";
        var D = {
            exports: {}
        };

        function V(e) {
            return e instanceof Map ? e.clear = e.delete = e.set = () => {
                throw Error("map is read-only")
            } : e instanceof Set && (e.add = e.clear = e.delete = () => {
                throw Error("set is read-only")
            }), Object.freeze(e), Object.getOwnPropertyNames(e).forEach(n => {
                var o = e[n];
                typeof o != "object" || Object.isFrozen(o) || V(o)
            }), e
        }
        D.exports = V, D.exports.default = V;
        class ge {
            constructor(n) {
                n.data === void 0 && (n.data = {}), this.data = n.data, this.isMatchIgnored = !1
            }
            ignoreMatch() {
                this.isMatchIgnored = !0
            }
        }

        function xe(e) {
            return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;")
        }

        function ue(e, ...n) {
            let o = Object.create(null);
            for (let u in e) o[u] = e[u];
            return n.forEach(u => {
                for (let h in u) o[h] = u[h]
            }), o
        }
        let Qe = e => !!e.scope || e.sublanguage && e.language;
        class nt {
            constructor(n, o) {
                this.buffer = "", this.classPrefix = o.classPrefix, n.walk(this)
            }
            addText(n) {
                this.buffer += xe(n)
            }
            openNode(n) {
                if (!Qe(n)) return;
                let o = "";
                o = n.sublanguage ? "language-" + n.language : ((u, {
                    prefix: h
                }) => {
                    if (u.includes(".")) {
                        let l = u.split(".");
                        return [`${h}${l.shift()}`, ...l.map((b, m) => `${b}${"_".repeat(m+1)}`)].join(" ")
                    }
                    return `${h}${u}`
                })(n.scope, {
                    prefix: this.classPrefix
                }), this.span(o)
            }
            closeNode(n) {
                Qe(n) && (this.buffer += "</span>")
            }
            value() {
                return this.buffer
            }
            span(n) {
                this.buffer += `<span class="${n}">`
            }
        }
        let We = (e = {}) => {
            let n = {
                children: []
            };
            return Object.assign(n, e), n
        };
        class Ae {
            constructor() {
                this.rootNode = We(), this.stack = [this.rootNode]
            }
            get top() {
                return this.stack[this.stack.length - 1]
            }
            get root() {
                return this.rootNode
            }
            add(n) {
                this.top.children.push(n)
            }
            openNode(n) {
                let o = We({
                    scope: n
                });
                this.add(o), this.stack.push(o)
            }
            closeNode() {
                if (this.stack.length > 1) return this.stack.pop()
            }
            closeAllNodes() {
                for (; this.closeNode(););
            }
            toJSON() {
                return JSON.stringify(this.rootNode, null, 4)
            }
            walk(n) {
                return this.constructor._walk(n, this.rootNode)
            }
            static _walk(n, o) {
                return typeof o == "string" ? n.addText(o) : o.children && (n.openNode(o), o.children.forEach(u => this._walk(n, u)), n.closeNode(o)), n
            }
            static _collapse(n) {
                typeof n != "string" && n.children && (n.children.every(o => typeof o == "string") ? n.children = [n.children.join("")] : n.children.forEach(o => {
                    Ae._collapse(o)
                }))
            }
        }
        class ct extends Ae {
            constructor(n) {
                super(), this.options = n
            }
            addKeyword(n, o) {
                n !== "" && (this.openNode(o), this.addText(n), this.closeNode())
            }
            addText(n) {
                n !== "" && this.add(n)
            }
            addSublanguage(n, o) {
                let u = n.root;
                u.sublanguage = !0, u.language = o, this.add(u)
            }
            toHTML() {
                return new nt(this, this.options).value()
            }
            finalize() {
                return !0
            }
        }

        function Be(e) {
            return e ? typeof e == "string" ? e : e.source : null
        }

        function X(e) {
            return H("(?=", e, ")")
        }

        function at(e) {
            return H("(?:", e, ")*")
        }

        function st(e) {
            return H("(?:", e, ")?")
        }

        function H(...e) {
            return e.map(n => Be(n)).join("")
        }

        function L(...e) {
            return "(" + ((o => {
                let u = o[o.length - 1];
                return typeof u == "object" && u.constructor === Object ? (o.splice(o.length - 1, 1), u) : {}
            })(e).capture ? "" : "?:") + e.map(o => Be(o)).join("|") + ")"
        }

        function Ve(e) {
            return RegExp(e.toString() + "|").exec("").length - 1
        }
        let Xe = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;

        function f(e, {
            joinWith: n
        }) {
            let o = 0;
            return e.map(u => {
                o += 1;
                let h = o,
                    l = Be(u),
                    b = "";
                for (; l.length > 0;) {
                    let m = Xe.exec(l);
                    if (!m) {
                        b += l;
                        break
                    }
                    b += l.substring(0, m.index), l = l.substring(m.index + m[0].length), m[0][0] === "\\" && m[1] ? b += "\\" + (Number(m[1]) + h) : (b += m[0], m[0] === "(" && o++)
                }
                return b
            }).map(u => `(${u})`).join(n)
        }
        let d = "[a-zA-Z]\\w*",
            O = "[a-zA-Z_]\\w*",
            oe = "\\b\\d+(\\.\\d+)?",
            ye = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
            se = "\\b(0b[01]+)",
            fe = {
                begin: "\\\\[\\s\\S]",
                relevance: 0
            },
            Oe = {
                scope: "string",
                begin: "'",
                end: "'",
                illegal: "\\n",
                contains: [fe]
            },
            Te = {
                scope: "string",
                begin: '"',
                end: '"',
                illegal: "\\n",
                contains: [fe]
            },
            Fe = (e, n, o = {}) => {
                let u = ue({
                    scope: "comment",
                    begin: e,
                    end: n,
                    contains: []
                }, o);
                u.contains.push({
                    scope: "doctag",
                    begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
                    end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
                    excludeBegin: !0,
                    relevance: 0
                });
                let h = L("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
                return u.contains.push({
                    begin: H(/[ ]+/, "(", h, /[.]?[:]?([.][ ]|[ ])/, "){3}")
                }), u
            },
            it = Fe("//", "$"),
            $e = Fe("/\\*", "\\*/"),
            F = Fe("#", "$");
        var y = Object.freeze({
            __proto__: null,
            MATCH_NOTHING_RE: /\b\B/,
            IDENT_RE: d,
            UNDERSCORE_IDENT_RE: O,
            NUMBER_RE: oe,
            C_NUMBER_RE: ye,
            BINARY_NUMBER_RE: se,
            RE_STARTERS_RE: "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
            SHEBANG: (e = {}) => {
                let n = /^#![ ]*\//;
                return e.binary && (e.begin = H(n, /.*\b/, e.binary, /\b.*/)), ue({
                    scope: "meta",
                    begin: n,
                    end: /$/,
                    relevance: 0,
                    "on:begin": (o, u) => {
                        o.index !== 0 && u.ignoreMatch()
                    }
                }, e)
            },
            BACKSLASH_ESCAPE: fe,
            APOS_STRING_MODE: Oe,
            QUOTE_STRING_MODE: Te,
            PHRASAL_WORDS_MODE: {
                begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
            },
            COMMENT: Fe,
            C_LINE_COMMENT_MODE: it,
            C_BLOCK_COMMENT_MODE: $e,
            HASH_COMMENT_MODE: F,
            NUMBER_MODE: {
                scope: "number",
                begin: oe,
                relevance: 0
            },
            C_NUMBER_MODE: {
                scope: "number",
                begin: ye,
                relevance: 0
            },
            BINARY_NUMBER_MODE: {
                scope: "number",
                begin: se,
                relevance: 0
            },
            REGEXP_MODE: {
                begin: /(?=\/[^/\n]*\/)/,
                contains: [{
                    scope: "regexp",
                    begin: /\//,
                    end: /\/[gimuy]*/,
                    illegal: /\n/,
                    contains: [fe, {
                        begin: /\[/,
                        end: /\]/,
                        relevance: 0,
                        contains: [fe]
                    }]
                }]
            },
            TITLE_MODE: {
                scope: "title",
                begin: d,
                relevance: 0
            },
            UNDERSCORE_TITLE_MODE: {
                scope: "title",
                begin: O,
                relevance: 0
            },
            METHOD_GUARD: {
                begin: "\\.\\s*[a-zA-Z_]\\w*",
                relevance: 0
            },
            END_SAME_AS_BEGIN: e => Object.assign(e, {
                "on:begin": (n, o) => {
                    o.data._beginMatch = n[1]
                },
                "on:end": (n, o) => {
                    o.data._beginMatch !== n[1] && o.ignoreMatch()
                }
            })
        });

        function ut(e, n) {
            e.input[e.index - 1] === "." && n.ignoreMatch()
        }

        function le(e, n) {
            e.className !== void 0 && (e.scope = e.className, delete e.className)
        }

        function _e(e, n) {
            n && e.beginKeywords && (e.begin = "\\b(" + e.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", e.__beforeBegin = ut, e.keywords = e.keywords || e.beginKeywords, delete e.beginKeywords, e.relevance === void 0 && (e.relevance = 0))
        }

        function Me(e, n) {
            Array.isArray(e.illegal) && (e.illegal = L(...e.illegal))
        }

        function Ie(e, n) {
            if (e.match) {
                if (e.begin || e.end) throw Error("begin & end are not supported with match");
                e.begin = e.match, delete e.match
            }
        }

        function Re(e, n) {
            e.relevance === void 0 && (e.relevance = 1)
        }
        let ve = (e, n) => {
                if (!e.beforeMatch) return;
                if (e.starts) throw Error("beforeMatch cannot be used with starts");
                let o = Object.assign({}, e);
                Object.keys(e).forEach(u => {
                    delete e[u]
                }), e.keywords = o.keywords, e.begin = H(o.beforeMatch, X(o.begin)), e.starts = {
                    relevance: 0,
                    contains: [Object.assign(o, {
                        endsParent: !0
                    })]
                }, e.relevance = 0, delete o.beforeMatch
            },
            S = ["of", "and", "for", "in", "not", "or", "if", "then", "parent", "list", "value"];

        function ze(e, n, o = "keyword") {
            let u = Object.create(null);
            return typeof e == "string" ? h(o, e.split(" ")) : Array.isArray(e) ? h(o, e) : Object.keys(e).forEach(l => {
                Object.assign(u, ze(e[l], n, l))
            }), u;

            function h(l, b) {
                n && (b = b.map(m => m.toLowerCase())), b.forEach(m => {
                    let E = m.split("|");
                    u[E[0]] = [l, vt(E[0], E[1])]
                })
            }
        }

        function vt(e, n) {
            return n ? Number(n) : (o => S.includes(o.toLowerCase()))(e) ? 0 : 1
        }
        let gt = {},
            je = e => {
                console.error(e)
            },
            pt = (e, ...n) => {
                console.log("WARN: " + e, ...n)
            },
            He = (e, n) => {
                gt[`${e}/${n}`] || (console.log(`Deprecated as of ${e}. ${n}`), gt[`${e}/${n}`] = !0)
            },
            rt = Error();

        function mt(e, n, {
            key: o
        }) {
            let u = 0,
                h = e[o],
                l = {},
                b = {};
            for (let m = 1; m <= n.length; m++) b[m + u] = h[m], l[m + u] = !0, u += Ve(n[m - 1]);
            e[o] = b, e[o]._emit = l, e[o]._multi = !0
        }

        function p(e) {
            (n => {
                n.scope && typeof n.scope == "object" && n.scope !== null && (n.beginScope = n.scope, delete n.scope)
            })(e), typeof e.beginScope == "string" && (e.beginScope = {
                _wrap: e.beginScope
            }), typeof e.endScope == "string" && (e.endScope = {
                _wrap: e.endScope
            }), (n => {
                if (Array.isArray(n.begin)) {
                    if (n.skip || n.excludeBegin || n.returnBegin) throw je("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), rt;
                    if (typeof n.beginScope != "object" || n.beginScope === null) throw je("beginScope must be object"), rt;
                    mt(n, n.begin, {
                        key: "beginScope"
                    }), n.begin = f(n.begin, {
                        joinWith: ""
                    })
                }
            })(e), (n => {
                if (Array.isArray(n.end)) {
                    if (n.skip || n.excludeEnd || n.returnEnd) throw je("skip, excludeEnd, returnEnd not compatible with endScope: {}"), rt;
                    if (typeof n.endScope != "object" || n.endScope === null) throw je("endScope must be object"), rt;
                    mt(n, n.end, {
                        key: "endScope"
                    }), n.end = f(n.end, {
                        joinWith: ""
                    })
                }
            })(e)
        }

        function c(e) {
            function n(h, l) {
                return RegExp(Be(h), "m" + (e.case_insensitive ? "i" : "") + (e.unicodeRegex ? "u" : "") + (l ? "g" : ""))
            }
            class o {
                constructor() {
                    this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0
                }
                addRule(l, b) {
                    b.position = this.position++, this.matchIndexes[this.matchAt] = b, this.regexes.push([b, l]), this.matchAt += Ve(l) + 1
                }
                compile() {
                    this.regexes.length === 0 && (this.exec = () => null);
                    let l = this.regexes.map(b => b[1]);
                    this.matcherRe = n(f(l, {
                        joinWith: "|"
                    }), !0), this.lastIndex = 0
                }
                exec(l) {
                    this.matcherRe.lastIndex = this.lastIndex;
                    let b = this.matcherRe.exec(l);
                    if (!b) return null;
                    let m = b.findIndex((v, w) => w > 0 && v !== void 0),
                        E = this.matchIndexes[m];
                    return b.splice(0, m), Object.assign(b, E)
                }
            }
            class u {
                constructor() {
                    this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0
                }
                getMatcher(l) {
                    if (this.multiRegexes[l]) return this.multiRegexes[l];
                    let b = new o;
                    return this.rules.slice(l).forEach(([m, E]) => b.addRule(m, E)), b.compile(), this.multiRegexes[l] = b, b
                }
                resumingScanAtSamePosition() {
                    return this.regexIndex !== 0
                }
                considerAll() {
                    this.regexIndex = 0
                }
                addRule(l, b) {
                    this.rules.push([l, b]), b.type === "begin" && this.count++
                }
                exec(l) {
                    let b = this.getMatcher(this.regexIndex);
                    b.lastIndex = this.lastIndex;
                    let m = b.exec(l);
                    if (this.resumingScanAtSamePosition() && !(m && m.index === this.lastIndex)) {
                        let E = this.getMatcher(0);
                        E.lastIndex = this.lastIndex + 1, m = E.exec(l)
                    }
                    return m && (this.regexIndex += m.position + 1, this.regexIndex === this.count && this.considerAll()), m
                }
            }
            if (e.compilerExtensions || (e.compilerExtensions = []), e.contains && e.contains.includes("self")) throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
            return e.classNameAliases = ue(e.classNameAliases || {}),
                function h(l, b) {
                    let m = l;
                    if (l.isCompiled) return m;
                    [le, Ie, p, ve].forEach(v => v(l, b)), e.compilerExtensions.forEach(v => v(l, b)), l.__beforeBegin = null, [_e, Me, Re].forEach(v => v(l, b)), l.isCompiled = !0;
                    let E = null;
                    return typeof l.keywords == "object" && l.keywords.$pattern && (l.keywords = Object.assign({}, l.keywords), E = l.keywords.$pattern, delete l.keywords.$pattern), E = E || /\w+/, l.keywords && (l.keywords = ze(l.keywords, e.case_insensitive)), m.keywordPatternRe = n(E, !0), b && (l.begin || (l.begin = /\B|\b/), m.beginRe = n(m.begin), l.end || l.endsWithParent || (l.end = /\B|\b/), l.end && (m.endRe = n(m.end)), m.terminatorEnd = Be(m.end) || "", l.endsWithParent && b.terminatorEnd && (m.terminatorEnd += (l.end ? "|" : "") + b.terminatorEnd)), l.illegal && (m.illegalRe = n(l.illegal)), l.contains || (l.contains = []), l.contains = [].concat(...l.contains.map(v => (w => (w.variants && !w.cachedVariants && (w.cachedVariants = w.variants.map(C => ue(w, {
                        variants: null
                    }, C))), w.cachedVariants ? w.cachedVariants : a(w) ? ue(w, {
                        starts: w.starts ? ue(w.starts) : null
                    }) : Object.isFrozen(w) ? ue(w) : w))(v === "self" ? l : v))), l.contains.forEach(v => {
                        h(v, m)
                    }), l.starts && h(l.starts, b), m.matcher = (v => {
                        let w = new u;
                        return v.contains.forEach(C => w.addRule(C.begin, {
                            rule: C,
                            type: "begin"
                        })), v.terminatorEnd && w.addRule(v.terminatorEnd, {
                            type: "end"
                        }), v.illegal && w.addRule(v.illegal, {
                            type: "illegal"
                        }), w
                    })(m), m
                }(e)
        }

        function a(e) {
            return !!e && (e.endsWithParent || a(e.starts))
        }
        class s extends Error {
            constructor(n, o) {
                super(n), this.name = "HTMLInjectionError", this.html = o
            }
        }
        let t = xe,
            i = ue,
            r = Symbol("nomatch");
        var _ = (e => {
            let n = Object.create(null),
                o = Object.create(null),
                u = [],
                h = !0,
                l = "Could not find the language '{}', did you forget to load/include a language module?",
                b = {
                    disableAutodetect: !0,
                    name: "Plain text",
                    contains: []
                },
                m = {
                    ignoreUnescapedHTML: !1,
                    throwUnescapedHTML: !1,
                    noHighlightRe: /^(no-?highlight)$/i,
                    languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
                    classPrefix: "hljs-",
                    cssSelector: "pre code",
                    languages: null,
                    __emitter: ct
                };

            function E(k) {
                return m.noHighlightRe.test(k)
            }

            function v(k, M, q) {
                let ne = "",
                    W = "";
                typeof M == "object" ? (ne = k, q = M.ignoreIllegals, W = M.language) : (He("10.7.0", "highlight(lang, code, ...args) has been deprecated."), He("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), W = k, ne = M), q === void 0 && (q = !0);
                let K = {
                    code: ne,
                    language: W
                };
                de("before:highlight", K);
                let Y = K.result ? K.result : w(K.language, K.code, q);
                return Y.code = K.code, de("after:highlight", Y), Y
            }

            function w(k, M, q, ne) {
                let W = Object.create(null);

                function K() {
                    if (!z.keywords) return void me.addText(ie);
                    let N = 0;
                    z.keywordPatternRe.lastIndex = 0;
                    let $ = z.keywordPatternRe.exec(ie),
                        ae = "";
                    for (; $;) {
                        ae += ie.substring(N, $.index);
                        let re = G.case_insensitive ? $[0].toLowerCase() : $[0],
                            be = (te = re, z.keywords[te]);
                        if (be) {
                            let [qe, Nt] = be;
                            if (me.addText(ae), ae = "", W[re] = (W[re] || 0) + 1, W[re] <= 7 && (bt += Nt), qe.startsWith("_")) ae += $[0];
                            else {
                                let ft = G.classNameAliases[qe] || qe;
                                me.addKeyword($[0], ft)
                            }
                        } else ae += $[0];
                        N = z.keywordPatternRe.lastIndex, $ = z.keywordPatternRe.exec(ie)
                    }
                    var te;
                    ae += ie.substring(N), me.addText(ae)
                }

                function Y() {
                    z.subLanguage != null ? (() => {
                        if (ie === "") return;
                        let N = null;
                        if (typeof z.subLanguage == "string") {
                            if (!n[z.subLanguage]) return void me.addText(ie);
                            N = w(z.subLanguage, ie, !0, qt[z.subLanguage]), qt[z.subLanguage] = N._top
                        } else N = C(ie, z.subLanguage.length ? z.subLanguage : null);
                        z.relevance > 0 && (bt += N.relevance), me.addSublanguage(N._emitter, N.language)
                    })() : K(), ie = ""
                }

                function ce(N, $) {
                    let ae = 1,
                        te = $.length - 1;
                    for (; ae <= te;) {
                        if (!N._emit[ae]) {
                            ae++;
                            continue
                        }
                        let re = G.classNameAliases[N[ae]] || N[ae],
                            be = $[ae];
                        re ? me.addKeyword(be, re) : (ie = be, K(), ie = ""), ae++
                    }
                }

                function ee(N, $) {
                    return N.scope && typeof N.scope == "string" && me.openNode(G.classNameAliases[N.scope] || N.scope), N.beginScope && (N.beginScope._wrap ? (me.addKeyword(ie, G.classNameAliases[N.beginScope._wrap] || N.beginScope._wrap), ie = "") : N.beginScope._multi && (ce(N.beginScope, $), ie = "")), z = Object.create(N, {
                        parent: {
                            value: z
                        }
                    }), z
                }

                function pe(N, $, ae) {
                    let te = ((re, be) => {
                        let qe = re && re.exec(be);
                        return qe && qe.index === 0
                    })(N.endRe, ae);
                    if (te) {
                        if (N["on:end"]) {
                            let re = new ge(N);
                            N["on:end"]($, re), re.isMatchIgnored && (te = !1)
                        }
                        if (te) {
                            for (; N.endsParent && N.parent;) N = N.parent;
                            return N
                        }
                    }
                    if (N.endsWithParent) return pe(N.parent, $, ae)
                }

                function Je(N) {
                    return z.matcher.regexIndex === 0 ? (ie += N[0], 1) : (Ct = !0, 0)
                }

                function Ye(N) {
                    let $ = N[0],
                        ae = M.substring(N.index),
                        te = pe(z, N, ae);
                    if (!te) return r;
                    let re = z;
                    z.endScope && z.endScope._wrap ? (Y(), me.addKeyword($, z.endScope._wrap)) : z.endScope && z.endScope._multi ? (Y(), ce(z.endScope, N)) : re.skip ? ie += $ : (re.returnEnd || re.excludeEnd || (ie += $), Y(), re.excludeEnd && (ie = $));
                    do z.scope && me.closeNode(), z.skip || z.subLanguage || (bt += z.relevance), z = z.parent; while (z !== te.parent);
                    return te.starts && ee(te.starts, N), re.returnEnd ? 0 : $.length
                }
                let Pe = {};

                function et(N, $) {
                    let ae = $ && $[0];
                    if (ie += N, ae == null) return Y(), 0;
                    if (Pe.type === "begin" && $.type === "end" && Pe.index === $.index && ae === "") {
                        if (ie += M.slice($.index, $.index + 1), !h) {
                            let te = Error(`0 width match regex (${k})`);
                            throw te.languageName = k, te.badRule = Pe.rule, te
                        }
                        return 1
                    }
                    if (Pe = $, $.type === "begin") return (te => {
                        let re = te[0],
                            be = te.rule,
                            qe = new ge(be),
                            Nt = [be.__beforeBegin, be["on:begin"]];
                        for (let ft of Nt)
                            if (ft && (ft(te, qe), qe.isMatchIgnored)) return Je(re);
                        return be.skip ? ie += re : (be.excludeBegin && (ie += re), Y(), be.returnBegin || be.excludeBegin || (ie = re)), ee(be, te), be.returnBegin ? 0 : re.length
                    })($);
                    if ($.type === "illegal" && !q) {
                        let te = Error('Illegal lexeme "' + ae + '" for mode "' + (z.scope || "<unnamed>") + '"');
                        throw te.mode = z, te
                    }
                    if ($.type === "end") {
                        let te = Ye($);
                        if (te !== r) return te
                    }
                    if ($.type === "illegal" && ae === "") return 1;
                    if (At > 1e5 && At > 3 * $.index) throw Error("potential infinite loop, way more iterations than matches");
                    return ie += ae, ae.length
                }
                let G = J(k);
                if (!G) throw je(l.replace("{}", k)), Error('Unknown language: "' + k + '"');
                let ot = c(G),
                    lt = "",
                    z = ne || ot,
                    qt = {},
                    me = new m.__emitter(m);
                (() => {
                    let N = [];
                    for (let $ = z; $ !== G; $ = $.parent) $.scope && N.unshift($.scope);
                    N.forEach($ => me.openNode($))
                })();
                let ie = "",
                    bt = 0,
                    tt = 0,
                    At = 0,
                    Ct = !1;
                try {
                    for (z.matcher.considerAll();;) {
                        At++, Ct ? Ct = !1 : z.matcher.considerAll(), z.matcher.lastIndex = tt;
                        let N = z.matcher.exec(M);
                        if (!N) break;
                        let $ = et(M.substring(tt, N.index), N);
                        tt = N.index + $
                    }
                    return et(M.substring(tt)), me.closeAllNodes(), me.finalize(), lt = me.toHTML(), {
                        language: k,
                        value: lt,
                        relevance: bt,
                        illegal: !1,
                        _emitter: me,
                        _top: z
                    }
                } catch (N) {
                    if (N.message && N.message.includes("Illegal")) return {
                        language: k,
                        value: t(M),
                        illegal: !0,
                        relevance: 0,
                        _illegalBy: {
                            message: N.message,
                            index: tt,
                            context: M.slice(tt - 100, tt + 100),
                            mode: N.mode,
                            resultSoFar: lt
                        },
                        _emitter: me
                    };
                    if (h) return {
                        language: k,
                        value: t(M),
                        illegal: !1,
                        relevance: 0,
                        errorRaised: N,
                        _emitter: me,
                        _top: z
                    };
                    throw N
                }
            }

            function C(k, M) {
                M = M || m.languages || Object.keys(n);
                let q = (ee => {
                        let pe = {
                            value: t(ee),
                            illegal: !1,
                            relevance: 0,
                            _top: b,
                            _emitter: new m.__emitter(m)
                        };
                        return pe._emitter.addText(ee), pe
                    })(k),
                    ne = M.filter(J).filter(we).map(ee => w(ee, k, !1));
                ne.unshift(q);
                let W = ne.sort((ee, pe) => {
                        if (ee.relevance !== pe.relevance) return pe.relevance - ee.relevance;
                        if (ee.language && pe.language) {
                            if (J(ee.language).supersetOf === pe.language) return 1;
                            if (J(pe.language).supersetOf === ee.language) return -1
                        }
                        return 0
                    }),
                    [K, Y] = W,
                    ce = K;
                return ce.secondBest = Y, ce
            }

            function P(k) {
                let M = null,
                    q = (K => {
                        let Y = K.className + " ";
                        Y += K.parentNode ? K.parentNode.className : "";
                        let ce = m.languageDetectRe.exec(Y);
                        if (ce) {
                            let ee = J(ce[1]);
                            return ee || (pt(l.replace("{}", ce[1])), pt("Falling back to no-highlight mode for this block.", K)), ee ? ce[1] : "no-highlight"
                        }
                        return Y.split(/\s+/).find(ee => E(ee) || J(ee))
                    })(k);
                if (E(q)) return;
                if (de("before:highlightElement", {
                        el: k,
                        language: q
                    }), k.children.length > 0 && (m.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(k)), m.throwUnescapedHTML)) throw new s("One of your code blocks includes unescaped HTML.", k.innerHTML);
                M = k;
                let ne = M.textContent,
                    W = q ? v(ne, {
                        language: q,
                        ignoreIllegals: !0
                    }) : C(ne);
                k.innerHTML = W.value, ((K, Y, ce) => {
                    let ee = Y && o[Y] || ce;
                    K.classList.add("hljs"), K.classList.add("language-" + ee)
                })(k, q, W.language), k.result = {
                    language: W.language,
                    re: W.relevance,
                    relevance: W.relevance
                }, W.secondBest && (k.secondBest = {
                    language: W.secondBest.language,
                    relevance: W.secondBest.relevance
                }), de("after:highlightElement", {
                    el: k,
                    result: W,
                    text: ne
                })
            }
            let Z = !1;

            function R() {
                document.readyState !== "loading" ? document.querySelectorAll(m.cssSelector).forEach(P) : Z = !0
            }

            function J(k) {
                return k = (k || "").toLowerCase(), n[k] || n[o[k]]
            }

            function De(k, {
                languageName: M
            }) {
                typeof k == "string" && (k = [k]), k.forEach(q => {
                    o[q.toLowerCase()] = M
                })
            }

            function we(k) {
                let M = J(k);
                return M && !M.disableAutodetect
            }

            function de(k, M) {
                let q = k;
                u.forEach(ne => {
                    ne[q] && ne[q](M)
                })
            }
            typeof window < "u" && window.addEventListener && window.addEventListener("DOMContentLoaded", () => {
                Z && R()
            }, !1), Object.assign(e, {
                highlight: v,
                highlightAuto: C,
                highlightAll: R,
                highlightElement: P,
                highlightBlock: k => (He("10.7.0", "highlightBlock will be removed entirely in v12.0"), He("10.7.0", "Please use highlightElement now."), P(k)),
                configure: k => {
                    m = i(m, k)
                },
                initHighlighting: () => {
                    R(), He("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.")
                },
                initHighlightingOnLoad: () => {
                    R(), He("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.")
                },
                registerLanguage: (k, M) => {
                    let q = null;
                    try {
                        q = M(e)
                    } catch (ne) {
                        if (je("Language definition for '{}' could not be registered.".replace("{}", k)), !h) throw ne;
                        je(ne), q = b
                    }
                    q.name || (q.name = k), n[k] = q, q.rawDefinition = M.bind(null, e), q.aliases && De(q.aliases, {
                        languageName: k
                    })
                },
                unregisterLanguage: k => {
                    delete n[k];
                    for (let M of Object.keys(o)) o[M] === k && delete o[M]
                },
                listLanguages: () => Object.keys(n),
                getLanguage: J,
                registerAliases: De,
                autoDetection: we,
                inherit: i,
                addPlugin: k => {
                    (M => {
                        M["before:highlightBlock"] && !M["before:highlightElement"] && (M["before:highlightElement"] = q => {
                            M["before:highlightBlock"](Object.assign({
                                block: q.el
                            }, q))
                        }), M["after:highlightBlock"] && !M["after:highlightElement"] && (M["after:highlightElement"] = q => {
                            M["after:highlightBlock"](Object.assign({
                                block: q.el
                            }, q))
                        })
                    })(k), u.push(k)
                }
            }), e.debugMode = () => {
                h = !1
            }, e.safeMode = () => {
                h = !0
            }, e.versionString = "11.7.0", e.regex = {
                concat: H,
                lookahead: X,
                either: L,
                optional: st,
                anyNumberOfTimes: at
            };
            for (let k in y) typeof y[k] == "object" && D.exports(y[k]);
            return Object.assign(e, y), e
        })({});
        let x = e => ({
                IMPORTANT: {
                    scope: "meta",
                    begin: "!important"
                },
                BLOCK_COMMENT: e.C_BLOCK_COMMENT_MODE,
                HEXCOLOR: {
                    scope: "number",
                    begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
                },
                FUNCTION_DISPATCH: {
                    className: "built_in",
                    begin: /[\w-]+(?=\()/
                },
                ATTRIBUTE_SELECTOR_MODE: {
                    scope: "selector-attr",
                    begin: /\[/,
                    end: /\]/,
                    illegal: "$",
                    contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
                },
                CSS_NUMBER_MODE: {
                    scope: "number",
                    begin: e.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
                    relevance: 0
                },
                CSS_VARIABLE: {
                    className: "attr",
                    begin: /--[A-Za-z][A-Za-z0-9_-]*/
                }
            }),
            A = ["a", "abbr", "address", "article", "aside", "audio", "b", "blockquote", "body", "button", "canvas", "caption", "cite", "code", "dd", "del", "details", "dfn", "div", "dl", "dt", "em", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "mark", "menu", "nav", "object", "ol", "p", "q", "quote", "samp", "section", "span", "strong", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "ul", "var", "video"],
            B = ["any-hover", "any-pointer", "aspect-ratio", "color", "color-gamut", "color-index", "device-aspect-ratio", "device-height", "device-width", "display-mode", "forced-colors", "grid", "height", "hover", "inverted-colors", "monochrome", "orientation", "overflow-block", "overflow-inline", "pointer", "prefers-color-scheme", "prefers-contrast", "prefers-reduced-motion", "prefers-reduced-transparency", "resolution", "scan", "scripting", "update", "width", "min-width", "max-width", "min-height", "max-height"],
            g = ["active", "any-link", "blank", "checked", "current", "default", "defined", "dir", "disabled", "drop", "empty", "enabled", "first", "first-child", "first-of-type", "fullscreen", "future", "focus", "focus-visible", "focus-within", "has", "host", "host-context", "hover", "indeterminate", "in-range", "invalid", "is", "lang", "last-child", "last-of-type", "left", "link", "local-link", "not", "nth-child", "nth-col", "nth-last-child", "nth-last-col", "nth-last-of-type", "nth-of-type", "only-child", "only-of-type", "optional", "out-of-range", "past", "placeholder-shown", "read-only", "read-write", "required", "right", "root", "scope", "target", "target-within", "user-invalid", "valid", "visited", "where"],
            T = ["after", "backdrop", "before", "cue", "cue-region", "first-letter", "first-line", "grammar-error", "marker", "part", "placeholder", "selection", "slotted", "spelling-error"],
            j = ["align-content", "align-items", "align-self", "all", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "backface-visibility", "background", "background-attachment", "background-blend-mode", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-repeat", "background-size", "block-size", "border", "border-block", "border-block-color", "border-block-end", "border-block-end-color", "border-block-end-style", "border-block-end-width", "border-block-start", "border-block-start-color", "border-block-start-style", "border-block-start-width", "border-block-style", "border-block-width", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-inline", "border-inline-color", "border-inline-end", "border-inline-end-color", "border-inline-end-style", "border-inline-end-width", "border-inline-start", "border-inline-start-color", "border-inline-start-style", "border-inline-start-width", "border-inline-style", "border-inline-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "caret-color", "clear", "clip", "clip-path", "clip-rule", "color", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "contain", "content", "content-visibility", "counter-increment", "counter-reset", "cue", "cue-after", "cue-before", "cursor", "direction", "display", "empty-cells", "filter", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "flow", "font", "font-display", "font-family", "font-feature-settings", "font-kerning", "font-language-override", "font-size", "font-size-adjust", "font-smoothing", "font-stretch", "font-style", "font-synthesis", "font-variant", "font-variant-caps", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-variation-settings", "font-weight", "gap", "glyph-orientation-vertical", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-start", "grid-gap", "grid-row", "grid-row-end", "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns", "grid-template-rows", "hanging-punctuation", "height", "hyphens", "icon", "image-orientation", "image-rendering", "image-resolution", "ime-mode", "inline-size", "isolation", "justify-content", "left", "letter-spacing", "line-break", "line-height", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-block", "margin-block-end", "margin-block-start", "margin-bottom", "margin-inline", "margin-inline-end", "margin-inline-start", "margin-left", "margin-right", "margin-top", "marks", "mask", "mask-border", "mask-border-mode", "mask-border-outset", "mask-border-repeat", "mask-border-slice", "mask-border-source", "mask-border-width", "mask-clip", "mask-composite", "mask-image", "mask-mode", "mask-origin", "mask-position", "mask-repeat", "mask-size", "mask-type", "max-block-size", "max-height", "max-inline-size", "max-width", "min-block-size", "min-height", "min-inline-size", "min-width", "mix-blend-mode", "nav-down", "nav-index", "nav-left", "nav-right", "nav-up", "none", "normal", "object-fit", "object-position", "opacity", "order", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-block", "padding-block-end", "padding-block-start", "padding-bottom", "padding-inline", "padding-inline-end", "padding-inline-start", "padding-left", "padding-right", "padding-top", "page-break-after", "page-break-before", "page-break-inside", "pause", "pause-after", "pause-before", "perspective", "perspective-origin", "pointer-events", "position", "quotes", "resize", "rest", "rest-after", "rest-before", "right", "row-gap", "scroll-margin", "scroll-margin-block", "scroll-margin-block-end", "scroll-margin-block-start", "scroll-margin-bottom", "scroll-margin-inline", "scroll-margin-inline-end", "scroll-margin-inline-start", "scroll-margin-left", "scroll-margin-right", "scroll-margin-top", "scroll-padding", "scroll-padding-block", "scroll-padding-block-end", "scroll-padding-block-start", "scroll-padding-bottom", "scroll-padding-inline", "scroll-padding-inline-end", "scroll-padding-inline-start", "scroll-padding-left", "scroll-padding-right", "scroll-padding-top", "scroll-snap-align", "scroll-snap-stop", "scroll-snap-type", "scrollbar-color", "scrollbar-gutter", "scrollbar-width", "shape-image-threshold", "shape-margin", "shape-outside", "speak", "speak-as", "src", "tab-size", "table-layout", "text-align", "text-align-all", "text-align-last", "text-combine-upright", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-style", "text-emphasis", "text-emphasis-color", "text-emphasis-position", "text-emphasis-style", "text-indent", "text-justify", "text-orientation", "text-overflow", "text-rendering", "text-shadow", "text-transform", "text-underline-position", "top", "transform", "transform-box", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "unicode-bidi", "vertical-align", "visibility", "voice-balance", "voice-duration", "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress", "voice-volume", "white-space", "widows", "width", "will-change", "word-break", "word-spacing", "word-wrap", "writing-mode", "z-index"].reverse(),
            Q = g.concat(T);
        var U = "\\.([0-9](_*[0-9])*)",
            I = "[0-9a-fA-F](_*[0-9a-fA-F])*",
            Ee = {
                className: "number",
                variants: [{
                    begin: `(\\b([0-9](_*[0-9])*)((${U})|\\.)?|(${U}))[eE][+-]?([0-9](_*[0-9])*)[fFdD]?\\b`
                }, {
                    begin: `\\b([0-9](_*[0-9])*)((${U})[fFdD]?\\b|\\.([fFdD]\\b)?)`
                }, {
                    begin: `(${U})[fFdD]?\\b`
                }, {
                    begin: "\\b([0-9](_*[0-9])*)[fFdD]\\b"
                }, {
                    begin: `\\b0[xX]((${I})\\.?|(${I})?\\.(${I}))[pP][+-]?([0-9](_*[0-9])*)[fFdD]?\\b`
                }, {
                    begin: "\\b(0|[1-9](_*[0-9])*)[lL]?\\b"
                }, {
                    begin: `\\b0[xX](${I})[lL]?\\b`
                }, {
                    begin: "\\b0(_*[0-7])*[lL]?\\b"
                }, {
                    begin: "\\b0[bB][01](_*[01])*[lL]?\\b"
                }],
                relevance: 0
            };

        function ke(e, n, o) {
            return o === -1 ? "" : e.replace(n, u => ke(e, n, o - 1))
        }
        let Le = "[A-Za-z$_][0-9A-Za-z$_]*",
            he = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends"],
            Ke = ["true", "false", "null", "undefined", "NaN", "Infinity"],
            Ce = ["Object", "Function", "Boolean", "Symbol", "Math", "Date", "Number", "BigInt", "String", "RegExp", "Array", "Float32Array", "Float64Array", "Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Int32Array", "Uint16Array", "Uint32Array", "BigInt64Array", "BigUint64Array", "Set", "Map", "WeakSet", "WeakMap", "ArrayBuffer", "SharedArrayBuffer", "Atomics", "DataView", "JSON", "Promise", "Generator", "GeneratorFunction", "AsyncFunction", "Reflect", "Proxy", "Intl", "WebAssembly"],
            Ne = ["Error", "EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"],
            dt = ["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"],
            Se = ["arguments", "this", "super", "console", "window", "document", "localStorage", "module", "global"],
            Ze = [].concat(dt, Ce, Ne);

        function Tt(e) {
            let n = e.regex,
                o = Le,
                u = {
                    begin: /<[A-Za-z0-9\\._:-]+/,
                    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
                    isTrulyOpeningTag: (ce, ee) => {
                        let pe = ce[0].length + ce.index,
                            Je = ce.input[pe];
                        if (Je === "<" || Je === ",") return void ee.ignoreMatch();
                        let Ye;
                        Je === ">" && (((et, {
                            after: G
                        }) => {
                            let ot = "</" + et[0].slice(1);
                            return et.input.indexOf(ot, G) !== -1
                        })(ce, {
                            after: pe
                        }) || ee.ignoreMatch());
                        let Pe = ce.input.substring(pe);
                        ((Ye = Pe.match(/^\s*=/)) || (Ye = Pe.match(/^\s+extends\s+/)) && Ye.index === 0) && ee.ignoreMatch()
                    }
                },
                h = {
                    $pattern: Le,
                    keyword: he,
                    literal: Ke,
                    built_in: Ze,
                    "variable.language": Se
                },
                l = "\\.([0-9](_?[0-9])*)",
                b = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",
                m = {
                    className: "number",
                    variants: [{
                        begin: `(\\b(${b})((${l})|\\.)?|(${l}))[eE][+-]?([0-9](_?[0-9])*)\\b`
                    }, {
                        begin: `\\b(${b})\\b((${l})\\b|\\.)?|(${l})\\b`
                    }, {
                        begin: "\\b(0|[1-9](_?[0-9])*)n\\b"
                    }, {
                        begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"
                    }, {
                        begin: "\\b0[bB][0-1](_?[0-1])*n?\\b"
                    }, {
                        begin: "\\b0[oO][0-7](_?[0-7])*n?\\b"
                    }, {
                        begin: "\\b0[0-7]+n?\\b"
                    }],
                    relevance: 0
                },
                E = {
                    className: "subst",
                    begin: "\\$\\{",
                    end: "\\}",
                    keywords: h,
                    contains: []
                },
                v = {
                    begin: "html`",
                    end: "",
                    starts: {
                        end: "`",
                        returnEnd: !1,
                        contains: [e.BACKSLASH_ESCAPE, E],
                        subLanguage: "xml"
                    }
                },
                w = {
                    begin: "css`",
                    end: "",
                    starts: {
                        end: "`",
                        returnEnd: !1,
                        contains: [e.BACKSLASH_ESCAPE, E],
                        subLanguage: "css"
                    }
                },
                C = {
                    className: "string",
                    begin: "`",
                    end: "`",
                    contains: [e.BACKSLASH_ESCAPE, E]
                },
                P = {
                    className: "comment",
                    variants: [e.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
                        relevance: 0,
                        contains: [{
                            begin: "(?=@[A-Za-z]+)",
                            relevance: 0,
                            contains: [{
                                className: "doctag",
                                begin: "@[A-Za-z]+"
                            }, {
                                className: "type",
                                begin: "\\{",
                                end: "\\}",
                                excludeEnd: !0,
                                excludeBegin: !0,
                                relevance: 0
                            }, {
                                className: "variable",
                                begin: o + "(?=\\s*(-)|$)",
                                endsParent: !0,
                                relevance: 0
                            }, {
                                begin: /(?=[^\n])\s/,
                                relevance: 0
                            }]
                        }]
                    }), e.C_BLOCK_COMMENT_MODE, e.C_LINE_COMMENT_MODE]
                },
                Z = [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, v, w, C, {
                    match: /\$\d+/
                }, m];
            E.contains = Z.concat({
                begin: /\{/,
                end: /\}/,
                keywords: h,
                contains: ["self"].concat(Z)
            });
            let R = [].concat(P, E.contains),
                J = R.concat([{
                    begin: /\(/,
                    end: /\)/,
                    keywords: h,
                    contains: ["self"].concat(R)
                }]),
                De = {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    keywords: h,
                    contains: J
                },
                we = {
                    variants: [{
                        match: [/class/, /\s+/, o, /\s+/, /extends/, /\s+/, n.concat(o, "(", n.concat(/\./, o), ")*")],
                        scope: {
                            1: "keyword",
                            3: "title.class",
                            5: "keyword",
                            7: "title.class.inherited"
                        }
                    }, {
                        match: [/class/, /\s+/, o],
                        scope: {
                            1: "keyword",
                            3: "title.class"
                        }
                    }]
                },
                de = {
                    relevance: 0,
                    match: n.either(/\bJSON/, /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/, /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/, /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),
                    className: "title.class",
                    keywords: {
                        _: [...Ce, ...Ne]
                    }
                },
                k = {
                    variants: [{
                        match: [/function/, /\s+/, o, /(?=\s*\()/]
                    }, {
                        match: [/function/, /\s*(?=\()/]
                    }],
                    className: {
                        1: "keyword",
                        3: "title.function"
                    },
                    label: "func.def",
                    contains: [De],
                    illegal: /%/
                },
                M = {
                    match: n.concat(/\b/, (q = [...dt, "super", "import"], n.concat("(?!", q.join("|"), ")")), o, n.lookahead(/\(/)),
                    className: "title.function",
                    relevance: 0
                };
            var q;
            let ne = {
                    begin: n.concat(/\./, n.lookahead(n.concat(o, /(?![0-9A-Za-z$_(])/))),
                    end: o,
                    excludeBegin: !0,
                    keywords: "prototype",
                    className: "property",
                    relevance: 0
                },
                W = {
                    match: [/get|set/, /\s+/, o, /(?=\()/],
                    className: {
                        1: "keyword",
                        3: "title.function"
                    },
                    contains: [{
                        begin: /\(\)/
                    }, De]
                },
                K = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>",
                Y = {
                    match: [/const|var|let/, /\s+/, o, /\s*/, /=\s*/, /(async\s*)?/, n.lookahead(K)],
                    keywords: "async",
                    className: {
                        1: "keyword",
                        3: "title.function"
                    },
                    contains: [De]
                };
            return {
                name: "Javascript",
                aliases: ["js", "jsx", "mjs", "cjs"],
                keywords: h,
                exports: {
                    PARAMS_CONTAINS: J,
                    CLASS_REFERENCE: de
                },
                illegal: /#(?![$_A-z])/,
                contains: [e.SHEBANG({
                    label: "shebang",
                    binary: "node",
                    relevance: 5
                }), {
                    label: "use_strict",
                    className: "meta",
                    relevance: 10,
                    begin: /^\s*['"]use (strict|asm)['"]/
                }, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, v, w, C, P, {
                    match: /\$\d+/
                }, m, de, {
                    className: "attr",
                    begin: o + n.lookahead(":"),
                    relevance: 0
                }, Y, {
                    begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
                    keywords: "return throw case",
                    relevance: 0,
                    contains: [P, e.REGEXP_MODE, {
                        className: "function",
                        begin: K,
                        returnBegin: !0,
                        end: "\\s*=>",
                        contains: [{
                            className: "params",
                            variants: [{
                                begin: e.UNDERSCORE_IDENT_RE,
                                relevance: 0
                            }, {
                                className: null,
                                begin: /\(\s*\)/,
                                skip: !0
                            }, {
                                begin: /\(/,
                                end: /\)/,
                                excludeBegin: !0,
                                excludeEnd: !0,
                                keywords: h,
                                contains: J
                            }]
                        }]
                    }, {
                        begin: /,/,
                        relevance: 0
                    }, {
                        match: /\s+/,
                        relevance: 0
                    }, {
                        variants: [{
                            begin: "<>",
                            end: "</>"
                        }, {
                            match: /<[A-Za-z0-9\\._:-]+\s*\/>/
                        }, {
                            begin: u.begin,
                            "on:begin": u.isTrulyOpeningTag,
                            end: u.end
                        }],
                        subLanguage: "xml",
                        contains: [{
                            begin: u.begin,
                            end: u.end,
                            skip: !0,
                            contains: ["self"]
                        }]
                    }]
                }, k, {
                    beginKeywords: "while if switch catch for"
                }, {
                    begin: "\\b(?!function)" + e.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
                    returnBegin: !0,
                    label: "func.def",
                    contains: [De, e.inherit(e.TITLE_MODE, {
                        begin: o,
                        className: "title.function"
                    })]
                }, {
                    match: /\.\.\./,
                    relevance: 0
                }, ne, {
                    match: "\\$" + o,
                    relevance: 0
                }, {
                    match: [/\bconstructor(?=\s*\()/],
                    className: {
                        1: "title.function"
                    },
                    contains: [De]
                }, M, {
                    relevance: 0,
                    match: /\b[A-Z][A-Z_0-9]+\b/,
                    className: "variable.constant"
                }, we, W, {
                    match: /\$[(.]/
                }]
            }
        }
        let wt = e => H(/\b/, e, /\w$/.test(e) ? /\b/ : /\B/),
            bn = ["Protocol", "Type"].map(wt),
            It = ["init", "self"].map(wt),
            fn = ["Any", "Self"],
            yt = ["actor", "any", "associatedtype", "async", "await", /as\?/, /as!/, "as", "break", "case", "catch", "class", "continue", "convenience", "default", "defer", "deinit", "didSet", "distributed", "do", "dynamic", "else", "enum", "extension", "fallthrough", /fileprivate\(set\)/, "fileprivate", "final", "for", "func", "get", "guard", "if", "import", "indirect", "infix", /init\?/, /init!/, "inout", /internal\(set\)/, "internal", "in", "is", "isolated", "nonisolated", "lazy", "let", "mutating", "nonmutating", /open\(set\)/, "open", "operator", "optional", "override", "postfix", "precedencegroup", "prefix", /private\(set\)/, "private", "protocol", /public\(set\)/, "public", "repeat", "required", "rethrows", "return", "set", "some", "static", "struct", "subscript", "super", "switch", "throws", "throw", /try\?/, /try!/, "try", "typealias", /unowned\(safe\)/, /unowned\(unsafe\)/, "unowned", "var", "weak", "where", "while", "willSet"],
            Rt = ["false", "nil", "true"],
            _n = ["assignment", "associativity", "higherThan", "left", "lowerThan", "none", "right"],
            En = ["#colorLiteral", "#column", "#dsohandle", "#else", "#elseif", "#endif", "#error", "#file", "#fileID", "#fileLiteral", "#filePath", "#function", "#if", "#imageLiteral", "#keyPath", "#line", "#selector", "#sourceLocation", "#warn_unqualified_access", "#warning"],
            Lt = ["abs", "all", "any", "assert", "assertionFailure", "debugPrint", "dump", "fatalError", "getVaList", "isKnownUniquelyReferenced", "max", "min", "numericCast", "pointwiseMax", "pointwiseMin", "precondition", "preconditionFailure", "print", "readLine", "repeatElement", "sequence", "stride", "swap", "swift_unboxFromSwiftValueWithType", "transcode", "type", "unsafeBitCast", "unsafeDowncast", "withExtendedLifetime", "withUnsafeMutablePointer", "withUnsafePointer", "withVaList", "withoutActuallyEscaping", "zip"],
            $t = L(/[/=\-+!*%<>&|^~?]/, /[\u00A1-\u00A7]/, /[\u00A9\u00AB]/, /[\u00AC\u00AE]/, /[\u00B0\u00B1]/, /[\u00B6\u00BB\u00BF\u00D7\u00F7]/, /[\u2016-\u2017]/, /[\u2020-\u2027]/, /[\u2030-\u203E]/, /[\u2041-\u2053]/, /[\u2055-\u205E]/, /[\u2190-\u23FF]/, /[\u2500-\u2775]/, /[\u2794-\u2BFF]/, /[\u2E00-\u2E7F]/, /[\u3001-\u3003]/, /[\u3008-\u3020]/, /[\u3030]/),
            zt = L($t, /[\u0300-\u036F]/, /[\u1DC0-\u1DFF]/, /[\u20D0-\u20FF]/, /[\uFE00-\uFE0F]/, /[\uFE20-\uFE2F]/),
            kt = H($t, zt, "*"),
            jt = L(/[a-zA-Z_]/, /[\u00A8\u00AA\u00AD\u00AF\u00B2-\u00B5\u00B7-\u00BA]/, /[\u00BC-\u00BE\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/, /[\u0100-\u02FF\u0370-\u167F\u1681-\u180D\u180F-\u1DBF]/, /[\u1E00-\u1FFF]/, /[\u200B-\u200D\u202A-\u202E\u203F-\u2040\u2054\u2060-\u206F]/, /[\u2070-\u20CF\u2100-\u218F\u2460-\u24FF\u2776-\u2793]/, /[\u2C00-\u2DFF\u2E80-\u2FFF]/, /[\u3004-\u3007\u3021-\u302F\u3031-\u303F\u3040-\uD7FF]/, /[\uF900-\uFD3D\uFD40-\uFDCF\uFDF0-\uFE1F\uFE30-\uFE44]/, /[\uFE47-\uFEFE\uFF00-\uFFFD]/),
            ht = L(jt, /\d/, /[\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/),
            Ue = H(jt, ht, "*"),
            xt = H(/[A-Z]/, ht, "*"),
            Dn = ["autoclosure", H(/convention\(/, L("swift", "block", "c"), /\)/), "discardableResult", "dynamicCallable", "dynamicMemberLookup", "escaping", "frozen", "GKInspectable", "IBAction", "IBDesignable", "IBInspectable", "IBOutlet", "IBSegueAction", "inlinable", "main", "nonobjc", "NSApplicationMain", "NSCopying", "NSManaged", H(/objc\(/, Ue, /\)/), "objc", "objcMembers", "propertyWrapper", "requires_stored_property_inits", "resultBuilder", "testable", "UIApplicationMain", "unknown", "usableFromInline"],
            vn = ["iOS", "iOSApplicationExtension", "macOS", "macOSApplicationExtension", "macCatalyst", "macCatalystApplicationExtension", "watchOS", "watchOSApplicationExtension", "tvOS", "tvOSApplicationExtension", "swift"];
        var Ut = Object.freeze({
            __proto__: null,
            grmr_bash: e => {
                let n = e.regex,
                    o = {},
                    u = {
                        begin: /\$\{/,
                        end: /\}/,
                        contains: ["self", {
                            begin: /:-/,
                            contains: [o]
                        }]
                    };
                Object.assign(o, {
                    className: "variable",
                    variants: [{
                        begin: n.concat(/\$[\w\d#@][\w\d_]*/, "(?![\\w\\d])(?![$])")
                    }, u]
                });
                let h = {
                        className: "subst",
                        begin: /\$\(/,
                        end: /\)/,
                        contains: [e.BACKSLASH_ESCAPE]
                    },
                    l = {
                        begin: /<<-?\s*(?=\w+)/,
                        starts: {
                            contains: [e.END_SAME_AS_BEGIN({
                                begin: /(\w+)/,
                                end: /(\w+)/,
                                className: "string"
                            })]
                        }
                    },
                    b = {
                        className: "string",
                        begin: /"/,
                        end: /"/,
                        contains: [e.BACKSLASH_ESCAPE, o, h]
                    };
                h.contains.push(b);
                let m = {
                        begin: /\$?\(\(/,
                        end: /\)\)/,
                        contains: [{
                            begin: /\d+#[0-9a-f]+/,
                            className: "number"
                        }, e.NUMBER_MODE, o]
                    },
                    E = e.SHEBANG({
                        binary: "(fish|bash|zsh|sh|csh|ksh|tcsh|dash|scsh)",
                        relevance: 10
                    }),
                    v = {
                        className: "function",
                        begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
                        returnBegin: !0,
                        contains: [e.inherit(e.TITLE_MODE, {
                            begin: /\w[\w\d_]*/
                        })],
                        relevance: 0
                    };
                return {
                    name: "Bash",
                    aliases: ["sh"],
                    keywords: {
                        $pattern: /\b[a-z][a-z0-9._-]+\b/,
                        keyword: ["if", "then", "else", "elif", "fi", "for", "while", "in", "do", "done", "case", "esac", "function"],
                        literal: ["true", "false"],
                        built_in: ["break", "cd", "continue", "eval", "exec", "exit", "export", "getopts", "hash", "pwd", "readonly", "return", "shift", "test", "times", "trap", "umask", "unset", "alias", "bind", "builtin", "caller", "command", "declare", "echo", "enable", "help", "let", "local", "logout", "mapfile", "printf", "read", "readarray", "source", "type", "typeset", "ulimit", "unalias", "set", "shopt", "autoload", "bg", "bindkey", "bye", "cap", "chdir", "clone", "comparguments", "compcall", "compctl", "compdescribe", "compfiles", "compgroups", "compquote", "comptags", "comptry", "compvalues", "dirs", "disable", "disown", "echotc", "echoti", "emulate", "fc", "fg", "float", "functions", "getcap", "getln", "history", "integer", "jobs", "kill", "limit", "log", "noglob", "popd", "print", "pushd", "pushln", "rehash", "sched", "setcap", "setopt", "stat", "suspend", "ttyctl", "unfunction", "unhash", "unlimit", "unsetopt", "vared", "wait", "whence", "where", "which", "zcompile", "zformat", "zftp", "zle", "zmodload", "zparseopts", "zprof", "zpty", "zregexparse", "zsocket", "zstyle", "ztcp", "chcon", "chgrp", "chown", "chmod", "cp", "dd", "df", "dir", "dircolors", "ln", "ls", "mkdir", "mkfifo", "mknod", "mktemp", "mv", "realpath", "rm", "rmdir", "shred", "sync", "touch", "truncate", "vdir", "b2sum", "base32", "base64", "cat", "cksum", "comm", "csplit", "cut", "expand", "fmt", "fold", "head", "join", "md5sum", "nl", "numfmt", "od", "paste", "ptx", "pr", "sha1sum", "sha224sum", "sha256sum", "sha384sum", "sha512sum", "shuf", "sort", "split", "sum", "tac", "tail", "tr", "tsort", "unexpand", "uniq", "wc", "arch", "basename", "chroot", "date", "dirname", "du", "echo", "env", "expr", "factor", "groups", "hostid", "id", "link", "logname", "nice", "nohup", "nproc", "pathchk", "pinky", "printenv", "printf", "pwd", "readlink", "runcon", "seq", "sleep", "stat", "stdbuf", "stty", "tee", "test", "timeout", "tty", "uname", "unlink", "uptime", "users", "who", "whoami", "yes"]
                    },
                    contains: [E, e.SHEBANG(), v, m, e.HASH_COMMENT_MODE, l, {
                        match: /(\/[a-z._-]+)+/
                    }, b, {
                        className: "",
                        begin: /\\"/
                    }, {
                        className: "string",
                        begin: /'/,
                        end: /'/
                    }, o]
                }
            },
            grmr_c: e => {
                let n = e.regex,
                    o = e.COMMENT("//", "$", {
                        contains: [{
                            begin: /\\\n/
                        }]
                    }),
                    u = "[a-zA-Z_]\\w*::",
                    h = "(decltype\\(auto\\)|" + n.optional(u) + "[a-zA-Z_]\\w*" + n.optional("<[^<>]+>") + ")",
                    l = {
                        className: "type",
                        variants: [{
                            begin: "\\b[a-z\\d_]*_t\\b"
                        }, {
                            match: /\batomic_[a-z]{3,6}\b/
                        }]
                    },
                    b = {
                        className: "string",
                        variants: [{
                            begin: '(u8?|U|L)?"',
                            end: '"',
                            illegal: "\\n",
                            contains: [e.BACKSLASH_ESCAPE]
                        }, {
                            begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
                            end: "'",
                            illegal: "."
                        }, e.END_SAME_AS_BEGIN({
                            begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
                            end: /\)([^()\\ ]{0,16})"/
                        })]
                    },
                    m = {
                        className: "number",
                        variants: [{
                            begin: "\\b(0b[01']+)"
                        }, {
                            begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)"
                        }, {
                            begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
                        }],
                        relevance: 0
                    },
                    E = {
                        className: "meta",
                        begin: /#\s*[a-z]+\b/,
                        end: /$/,
                        keywords: {
                            keyword: "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
                        },
                        contains: [{
                            begin: /\\\n/,
                            relevance: 0
                        }, e.inherit(b, {
                            className: "string"
                        }), {
                            className: "string",
                            begin: /<.*?>/
                        }, o, e.C_BLOCK_COMMENT_MODE]
                    },
                    v = {
                        className: "title",
                        begin: n.optional(u) + e.IDENT_RE,
                        relevance: 0
                    },
                    w = n.optional(u) + e.IDENT_RE + "\\s*\\(",
                    C = {
                        keyword: ["asm", "auto", "break", "case", "continue", "default", "do", "else", "enum", "extern", "for", "fortran", "goto", "if", "inline", "register", "restrict", "return", "sizeof", "struct", "switch", "typedef", "union", "volatile", "while", "_Alignas", "_Alignof", "_Atomic", "_Generic", "_Noreturn", "_Static_assert", "_Thread_local", "alignas", "alignof", "noreturn", "static_assert", "thread_local", "_Pragma"],
                        type: ["float", "double", "signed", "unsigned", "int", "short", "long", "char", "void", "_Bool", "_Complex", "_Imaginary", "_Decimal32", "_Decimal64", "_Decimal128", "const", "static", "complex", "bool", "imaginary"],
                        literal: "true false NULL",
                        built_in: "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr"
                    },
                    P = [E, l, o, e.C_BLOCK_COMMENT_MODE, m, b],
                    Z = {
                        variants: [{
                            begin: /=/,
                            end: /;/
                        }, {
                            begin: /\(/,
                            end: /\)/
                        }, {
                            beginKeywords: "new throw return else",
                            end: /;/
                        }],
                        keywords: C,
                        contains: P.concat([{
                            begin: /\(/,
                            end: /\)/,
                            keywords: C,
                            contains: P.concat(["self"]),
                            relevance: 0
                        }]),
                        relevance: 0
                    },
                    R = {
                        begin: "(" + h + "[\\*&\\s]+)+" + w,
                        returnBegin: !0,
                        end: /[{;=]/,
                        excludeEnd: !0,
                        keywords: C,
                        illegal: /[^\w\s\*&:<>.]/,
                        contains: [{
                            begin: "decltype\\(auto\\)",
                            keywords: C,
                            relevance: 0
                        }, {
                            begin: w,
                            returnBegin: !0,
                            contains: [e.inherit(v, {
                                className: "title.function"
                            })],
                            relevance: 0
                        }, {
                            relevance: 0,
                            match: /,/
                        }, {
                            className: "params",
                            begin: /\(/,
                            end: /\)/,
                            keywords: C,
                            relevance: 0,
                            contains: [o, e.C_BLOCK_COMMENT_MODE, b, m, l, {
                                begin: /\(/,
                                end: /\)/,
                                keywords: C,
                                relevance: 0,
                                contains: ["self", o, e.C_BLOCK_COMMENT_MODE, b, m, l]
                            }]
                        }, l, o, e.C_BLOCK_COMMENT_MODE, E]
                    };
                return {
                    name: "C",
                    aliases: ["h"],
                    keywords: C,
                    disableAutodetect: !0,
                    illegal: "</",
                    contains: [].concat(Z, R, P, [E, {
                        begin: e.IDENT_RE + "::",
                        keywords: C
                    }, {
                        className: "class",
                        beginKeywords: "enum class struct union",
                        end: /[{;:<>=]/,
                        contains: [{
                            beginKeywords: "final class struct"
                        }, e.TITLE_MODE]
                    }]),
                    exports: {
                        preprocessor: E,
                        strings: b,
                        keywords: C
                    }
                }
            },
            grmr_cpp: e => {
                let n = e.regex,
                    o = e.COMMENT("//", "$", {
                        contains: [{
                            begin: /\\\n/
                        }]
                    }),
                    u = "[a-zA-Z_]\\w*::",
                    h = "(?!struct)(decltype\\(auto\\)|" + n.optional(u) + "[a-zA-Z_]\\w*" + n.optional("<[^<>]+>") + ")",
                    l = {
                        className: "type",
                        begin: "\\b[a-z\\d_]*_t\\b"
                    },
                    b = {
                        className: "string",
                        variants: [{
                            begin: '(u8?|U|L)?"',
                            end: '"',
                            illegal: "\\n",
                            contains: [e.BACKSLASH_ESCAPE]
                        }, {
                            begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
                            end: "'",
                            illegal: "."
                        }, e.END_SAME_AS_BEGIN({
                            begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
                            end: /\)([^()\\ ]{0,16})"/
                        })]
                    },
                    m = {
                        className: "number",
                        variants: [{
                            begin: "\\b(0b[01']+)"
                        }, {
                            begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)"
                        }, {
                            begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
                        }],
                        relevance: 0
                    },
                    E = {
                        className: "meta",
                        begin: /#\s*[a-z]+\b/,
                        end: /$/,
                        keywords: {
                            keyword: "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
                        },
                        contains: [{
                            begin: /\\\n/,
                            relevance: 0
                        }, e.inherit(b, {
                            className: "string"
                        }), {
                            className: "string",
                            begin: /<.*?>/
                        }, o, e.C_BLOCK_COMMENT_MODE]
                    },
                    v = {
                        className: "title",
                        begin: n.optional(u) + e.IDENT_RE,
                        relevance: 0
                    },
                    w = n.optional(u) + e.IDENT_RE + "\\s*\\(",
                    C = {
                        type: ["bool", "char", "char16_t", "char32_t", "char8_t", "double", "float", "int", "long", "short", "void", "wchar_t", "unsigned", "signed", "const", "static"],
                        keyword: ["alignas", "alignof", "and", "and_eq", "asm", "atomic_cancel", "atomic_commit", "atomic_noexcept", "auto", "bitand", "bitor", "break", "case", "catch", "class", "co_await", "co_return", "co_yield", "compl", "concept", "const_cast|10", "consteval", "constexpr", "constinit", "continue", "decltype", "default", "delete", "do", "dynamic_cast|10", "else", "enum", "explicit", "export", "extern", "false", "final", "for", "friend", "goto", "if", "import", "inline", "module", "mutable", "namespace", "new", "noexcept", "not", "not_eq", "nullptr", "operator", "or", "or_eq", "override", "private", "protected", "public", "reflexpr", "register", "reinterpret_cast|10", "requires", "return", "sizeof", "static_assert", "static_cast|10", "struct", "switch", "synchronized", "template", "this", "thread_local", "throw", "transaction_safe", "transaction_safe_dynamic", "true", "try", "typedef", "typeid", "typename", "union", "using", "virtual", "volatile", "while", "xor", "xor_eq"],
                        literal: ["NULL", "false", "nullopt", "nullptr", "true"],
                        built_in: ["_Pragma"],
                        _type_hints: ["any", "auto_ptr", "barrier", "binary_semaphore", "bitset", "complex", "condition_variable", "condition_variable_any", "counting_semaphore", "deque", "false_type", "future", "imaginary", "initializer_list", "istringstream", "jthread", "latch", "lock_guard", "multimap", "multiset", "mutex", "optional", "ostringstream", "packaged_task", "pair", "promise", "priority_queue", "queue", "recursive_mutex", "recursive_timed_mutex", "scoped_lock", "set", "shared_future", "shared_lock", "shared_mutex", "shared_timed_mutex", "shared_ptr", "stack", "string_view", "stringstream", "timed_mutex", "thread", "true_type", "tuple", "unique_lock", "unique_ptr", "unordered_map", "unordered_multimap", "unordered_multiset", "unordered_set", "variant", "vector", "weak_ptr", "wstring", "wstring_view"]
                    },
                    P = {
                        className: "function.dispatch",
                        relevance: 0,
                        keywords: {
                            _hint: ["abort", "abs", "acos", "apply", "as_const", "asin", "atan", "atan2", "calloc", "ceil", "cerr", "cin", "clog", "cos", "cosh", "cout", "declval", "endl", "exchange", "exit", "exp", "fabs", "floor", "fmod", "forward", "fprintf", "fputs", "free", "frexp", "fscanf", "future", "invoke", "isalnum", "isalpha", "iscntrl", "isdigit", "isgraph", "islower", "isprint", "ispunct", "isspace", "isupper", "isxdigit", "labs", "launder", "ldexp", "log", "log10", "make_pair", "make_shared", "make_shared_for_overwrite", "make_tuple", "make_unique", "malloc", "memchr", "memcmp", "memcpy", "memset", "modf", "move", "pow", "printf", "putchar", "puts", "realloc", "scanf", "sin", "sinh", "snprintf", "sprintf", "sqrt", "sscanf", "std", "stderr", "stdin", "stdout", "strcat", "strchr", "strcmp", "strcpy", "strcspn", "strlen", "strncat", "strncmp", "strncpy", "strpbrk", "strrchr", "strspn", "strstr", "swap", "tan", "tanh", "terminate", "to_underlying", "tolower", "toupper", "vfprintf", "visit", "vprintf", "vsprintf"]
                        },
                        begin: n.concat(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!switch)/, /(?!while)/, e.IDENT_RE, n.lookahead(/(<[^<>]+>|)\s*\(/))
                    },
                    Z = [P, E, l, o, e.C_BLOCK_COMMENT_MODE, m, b],
                    R = {
                        variants: [{
                            begin: /=/,
                            end: /;/
                        }, {
                            begin: /\(/,
                            end: /\)/
                        }, {
                            beginKeywords: "new throw return else",
                            end: /;/
                        }],
                        keywords: C,
                        contains: Z.concat([{
                            begin: /\(/,
                            end: /\)/,
                            keywords: C,
                            contains: Z.concat(["self"]),
                            relevance: 0
                        }]),
                        relevance: 0
                    },
                    J = {
                        className: "function",
                        begin: "(" + h + "[\\*&\\s]+)+" + w,
                        returnBegin: !0,
                        end: /[{;=]/,
                        excludeEnd: !0,
                        keywords: C,
                        illegal: /[^\w\s\*&:<>.]/,
                        contains: [{
                            begin: "decltype\\(auto\\)",
                            keywords: C,
                            relevance: 0
                        }, {
                            begin: w,
                            returnBegin: !0,
                            contains: [v],
                            relevance: 0
                        }, {
                            begin: /::/,
                            relevance: 0
                        }, {
                            begin: /:/,
                            endsWithParent: !0,
                            contains: [b, m]
                        }, {
                            relevance: 0,
                            match: /,/
                        }, {
                            className: "params",
                            begin: /\(/,
                            end: /\)/,
                            keywords: C,
                            relevance: 0,
                            contains: [o, e.C_BLOCK_COMMENT_MODE, b, m, l, {
                                begin: /\(/,
                                end: /\)/,
                                keywords: C,
                                relevance: 0,
                                contains: ["self", o, e.C_BLOCK_COMMENT_MODE, b, m, l]
                            }]
                        }, l, o, e.C_BLOCK_COMMENT_MODE, E]
                    };
                return {
                    name: "C++",
                    aliases: ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
                    keywords: C,
                    illegal: "</",
                    classNameAliases: {
                        "function.dispatch": "built_in"
                    },
                    contains: [].concat(R, J, P, Z, [E, {
                        begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function)\\s*<(?!<)",
                        end: ">",
                        keywords: C,
                        contains: ["self", l]
                    }, {
                        begin: e.IDENT_RE + "::",
                        keywords: C
                    }, {
                        match: [/\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/, /\s+/, /\w+/],
                        className: {
                            1: "keyword",
                            3: "title.class"
                        }
                    }])
                }
            },
            grmr_csharp: e => {
                let n = {
                        keyword: ["abstract", "as", "base", "break", "case", "catch", "class", "const", "continue", "do", "else", "event", "explicit", "extern", "finally", "fixed", "for", "foreach", "goto", "if", "implicit", "in", "interface", "internal", "is", "lock", "namespace", "new", "operator", "out", "override", "params", "private", "protected", "public", "readonly", "record", "ref", "return", "scoped", "sealed", "sizeof", "stackalloc", "static", "struct", "switch", "this", "throw", "try", "typeof", "unchecked", "unsafe", "using", "virtual", "void", "volatile", "while"].concat(["add", "alias", "and", "ascending", "async", "await", "by", "descending", "equals", "from", "get", "global", "group", "init", "into", "join", "let", "nameof", "not", "notnull", "on", "or", "orderby", "partial", "remove", "select", "set", "unmanaged", "value|0", "var", "when", "where", "with", "yield"]),
                        built_in: ["bool", "byte", "char", "decimal", "delegate", "double", "dynamic", "enum", "float", "int", "long", "nint", "nuint", "object", "sbyte", "short", "string", "ulong", "uint", "ushort"],
                        literal: ["default", "false", "null", "true"]
                    },
                    o = e.inherit(e.TITLE_MODE, {
                        begin: "[a-zA-Z](\\.?\\w)*"
                    }),
                    u = {
                        className: "number",
                        variants: [{
                            begin: "\\b(0b[01']+)"
                        }, {
                            begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"
                        }, {
                            begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
                        }],
                        relevance: 0
                    },
                    h = {
                        className: "string",
                        begin: '@"',
                        end: '"',
                        contains: [{
                            begin: '""'
                        }]
                    },
                    l = e.inherit(h, {
                        illegal: /\n/
                    }),
                    b = {
                        className: "subst",
                        begin: /\{/,
                        end: /\}/,
                        keywords: n
                    },
                    m = e.inherit(b, {
                        illegal: /\n/
                    }),
                    E = {
                        className: "string",
                        begin: /\$"/,
                        end: '"',
                        illegal: /\n/,
                        contains: [{
                            begin: /\{\{/
                        }, {
                            begin: /\}\}/
                        }, e.BACKSLASH_ESCAPE, m]
                    },
                    v = {
                        className: "string",
                        begin: /\$@"/,
                        end: '"',
                        contains: [{
                            begin: /\{\{/
                        }, {
                            begin: /\}\}/
                        }, {
                            begin: '""'
                        }, b]
                    },
                    w = e.inherit(v, {
                        illegal: /\n/,
                        contains: [{
                            begin: /\{\{/
                        }, {
                            begin: /\}\}/
                        }, {
                            begin: '""'
                        }, m]
                    });
                b.contains = [v, E, h, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, u, e.C_BLOCK_COMMENT_MODE], m.contains = [w, E, l, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, u, e.inherit(e.C_BLOCK_COMMENT_MODE, {
                    illegal: /\n/
                })];
                let C = {
                        variants: [v, E, h, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
                    },
                    P = {
                        begin: "<",
                        end: ">",
                        contains: [{
                            beginKeywords: "in out"
                        }, o]
                    },
                    Z = e.IDENT_RE + "(<" + e.IDENT_RE + "(\\s*,\\s*" + e.IDENT_RE + ")*>)?(\\[\\])?",
                    R = {
                        begin: "@" + e.IDENT_RE,
                        relevance: 0
                    };
                return {
                    name: "C#",
                    aliases: ["cs", "c#"],
                    keywords: n,
                    illegal: /::/,
                    contains: [e.COMMENT("///", "$", {
                        returnBegin: !0,
                        contains: [{
                            className: "doctag",
                            variants: [{
                                begin: "///",
                                relevance: 0
                            }, {
                                begin: "<!--|-->"
                            }, {
                                begin: "</?",
                                end: ">"
                            }]
                        }]
                    }), e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, {
                        className: "meta",
                        begin: "#",
                        end: "$",
                        keywords: {
                            keyword: "if else elif endif define undef warning error line region endregion pragma checksum"
                        }
                    }, C, u, {
                        beginKeywords: "class interface",
                        relevance: 0,
                        end: /[{;=]/,
                        illegal: /[^\s:,]/,
                        contains: [{
                            beginKeywords: "where class"
                        }, o, P, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
                    }, {
                        beginKeywords: "namespace",
                        relevance: 0,
                        end: /[{;=]/,
                        illegal: /[^\s:]/,
                        contains: [o, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
                    }, {
                        beginKeywords: "record",
                        relevance: 0,
                        end: /[{;=]/,
                        illegal: /[^\s:]/,
                        contains: [o, P, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
                    }, {
                        className: "meta",
                        begin: "^\\s*\\[(?=[\\w])",
                        excludeBegin: !0,
                        end: "\\]",
                        excludeEnd: !0,
                        contains: [{
                            className: "string",
                            begin: /"/,
                            end: /"/
                        }]
                    }, {
                        beginKeywords: "new return throw await else",
                        relevance: 0
                    }, {
                        className: "function",
                        begin: "(" + Z + "\\s+)+" + e.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
                        returnBegin: !0,
                        end: /\s*[{;=]/,
                        excludeEnd: !0,
                        keywords: n,
                        contains: [{
                            beginKeywords: "public private protected static internal protected abstract async extern override unsafe virtual new sealed partial",
                            relevance: 0
                        }, {
                            begin: e.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
                            returnBegin: !0,
                            contains: [e.TITLE_MODE, P],
                            relevance: 0
                        }, {
                            match: /\(\)/
                        }, {
                            className: "params",
                            begin: /\(/,
                            end: /\)/,
                            excludeBegin: !0,
                            excludeEnd: !0,
                            keywords: n,
                            relevance: 0,
                            contains: [C, u, e.C_BLOCK_COMMENT_MODE]
                        }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
                    }, R]
                }
            },
            grmr_css: e => {
                let n = e.regex,
                    o = x(e),
                    u = [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE];
                return {
                    name: "CSS",
                    case_insensitive: !0,
                    illegal: /[=|'\$]/,
                    keywords: {
                        keyframePosition: "from to"
                    },
                    classNameAliases: {
                        keyframePosition: "selector-tag"
                    },
                    contains: [o.BLOCK_COMMENT, {
                        begin: /-(webkit|moz|ms|o)-(?=[a-z])/
                    }, o.CSS_NUMBER_MODE, {
                        className: "selector-id",
                        begin: /#[A-Za-z0-9_-]+/,
                        relevance: 0
                    }, {
                        className: "selector-class",
                        begin: "\\.[a-zA-Z-][a-zA-Z0-9_-]*",
                        relevance: 0
                    }, o.ATTRIBUTE_SELECTOR_MODE, {
                        className: "selector-pseudo",
                        variants: [{
                            begin: ":(" + g.join("|") + ")"
                        }, {
                            begin: ":(:)?(" + T.join("|") + ")"
                        }]
                    }, o.CSS_VARIABLE, {
                        className: "attribute",
                        begin: "\\b(" + j.join("|") + ")\\b"
                    }, {
                        begin: /:/,
                        end: /[;}{]/,
                        contains: [o.BLOCK_COMMENT, o.HEXCOLOR, o.IMPORTANT, o.CSS_NUMBER_MODE, ...u, {
                            begin: /(url|data-uri)\(/,
                            end: /\)/,
                            relevance: 0,
                            keywords: {
                                built_in: "url data-uri"
                            },
                            contains: [...u, {
                                className: "string",
                                begin: /[^)]/,
                                endsWithParent: !0,
                                excludeEnd: !0
                            }]
                        }, o.FUNCTION_DISPATCH]
                    }, {
                        begin: n.lookahead(/@/),
                        end: "[{;]",
                        relevance: 0,
                        illegal: /:/,
                        contains: [{
                            className: "keyword",
                            begin: /@-?\w[\w]*(-\w+)*/
                        }, {
                            begin: /\s/,
                            endsWithParent: !0,
                            excludeEnd: !0,
                            relevance: 0,
                            keywords: {
                                $pattern: /[a-z-]+/,
                                keyword: "and or not only",
                                attribute: B.join(" ")
                            },
                            contains: [{
                                begin: /[a-z-]+(?=:)/,
                                className: "attribute"
                            }, ...u, o.CSS_NUMBER_MODE]
                        }]
                    }, {
                        className: "selector-tag",
                        begin: "\\b(" + A.join("|") + ")\\b"
                    }]
                }
            },
            grmr_diff: e => {
                let n = e.regex;
                return {
                    name: "Diff",
                    aliases: ["patch"],
                    contains: [{
                        className: "meta",
                        relevance: 10,
                        match: n.either(/^@@ +-\d+,\d+ +\+\d+,\d+ +@@/, /^\*\*\* +\d+,\d+ +\*\*\*\*$/, /^--- +\d+,\d+ +----$/)
                    }, {
                        className: "comment",
                        variants: [{
                            begin: n.either(/Index: /, /^index/, /={3,}/, /^-{3}/, /^\*{3} /, /^\+{3}/, /^diff --git/),
                            end: /$/
                        }, {
                            match: /^\*{15}$/
                        }]
                    }, {
                        className: "addition",
                        begin: /^\+/,
                        end: /$/
                    }, {
                        className: "deletion",
                        begin: /^-/,
                        end: /$/
                    }, {
                        className: "addition",
                        begin: /^!/,
                        end: /$/
                    }]
                }
            },
            grmr_go: e => {
                let n = {
                    keyword: ["break", "case", "chan", "const", "continue", "default", "defer", "else", "fallthrough", "for", "func", "go", "goto", "if", "import", "interface", "map", "package", "range", "return", "select", "struct", "switch", "type", "var"],
                    type: ["bool", "byte", "complex64", "complex128", "error", "float32", "float64", "int8", "int16", "int32", "int64", "string", "uint8", "uint16", "uint32", "uint64", "int", "uint", "uintptr", "rune"],
                    literal: ["true", "false", "iota", "nil"],
                    built_in: ["append", "cap", "close", "complex", "copy", "imag", "len", "make", "new", "panic", "print", "println", "real", "recover", "delete"]
                };
                return {
                    name: "Go",
                    aliases: ["golang"],
                    keywords: n,
                    illegal: "</",
                    contains: [e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, {
                        className: "string",
                        variants: [e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, {
                            begin: "`",
                            end: "`"
                        }]
                    }, {
                        className: "number",
                        variants: [{
                            begin: e.C_NUMBER_RE + "[i]",
                            relevance: 1
                        }, e.C_NUMBER_MODE]
                    }, {
                        begin: /:=/
                    }, {
                        className: "function",
                        beginKeywords: "func",
                        end: "\\s*(\\{|$)",
                        excludeEnd: !0,
                        contains: [e.TITLE_MODE, {
                            className: "params",
                            begin: /\(/,
                            end: /\)/,
                            endsParent: !0,
                            keywords: n,
                            illegal: /["']/
                        }]
                    }]
                }
            },
            grmr_graphql: e => {
                let n = e.regex;
                return {
                    name: "GraphQL",
                    aliases: ["gql"],
                    case_insensitive: !0,
                    disableAutodetect: !1,
                    keywords: {
                        keyword: ["query", "mutation", "subscription", "type", "input", "schema", "directive", "interface", "union", "scalar", "fragment", "enum", "on"],
                        literal: ["true", "false", "null"]
                    },
                    contains: [e.HASH_COMMENT_MODE, e.QUOTE_STRING_MODE, e.NUMBER_MODE, {
                        scope: "punctuation",
                        match: /[.]{3}/,
                        relevance: 0
                    }, {
                        scope: "punctuation",
                        begin: /[\!\(\)\:\=\[\]\{\|\}]{1}/,
                        relevance: 0
                    }, {
                        scope: "variable",
                        begin: /\$/,
                        end: /\W/,
                        excludeEnd: !0,
                        relevance: 0
                    }, {
                        scope: "meta",
                        match: /@\w+/,
                        excludeEnd: !0
                    }, {
                        scope: "symbol",
                        begin: n.concat(/[_A-Za-z][_0-9A-Za-z]*/, n.lookahead(/\s*:/)),
                        relevance: 0
                    }],
                    illegal: [/[;<']/, /BEGIN/]
                }
            },
            grmr_ini: e => {
                let n = e.regex,
                    o = {
                        className: "number",
                        relevance: 0,
                        variants: [{
                            begin: /([+-]+)?[\d]+_[\d_]+/
                        }, {
                            begin: e.NUMBER_RE
                        }]
                    },
                    u = e.COMMENT();
                u.variants = [{
                    begin: /;/,
                    end: /$/
                }, {
                    begin: /#/,
                    end: /$/
                }];
                let h = {
                        className: "variable",
                        variants: [{
                            begin: /\$[\w\d"][\w\d_]*/
                        }, {
                            begin: /\$\{(.*?)\}/
                        }]
                    },
                    l = {
                        className: "literal",
                        begin: /\bon|off|true|false|yes|no\b/
                    },
                    b = {
                        className: "string",
                        contains: [e.BACKSLASH_ESCAPE],
                        variants: [{
                            begin: "'''",
                            end: "'''",
                            relevance: 10
                        }, {
                            begin: '"""',
                            end: '"""',
                            relevance: 10
                        }, {
                            begin: '"',
                            end: '"'
                        }, {
                            begin: "'",
                            end: "'"
                        }]
                    },
                    m = {
                        begin: /\[/,
                        end: /\]/,
                        contains: [u, l, h, b, o, "self"],
                        relevance: 0
                    },
                    E = n.either(/[A-Za-z0-9_-]+/, /"(\\"|[^"])*"/, /'[^']*'/);
                return {
                    name: "TOML, also INI",
                    aliases: ["toml"],
                    case_insensitive: !0,
                    illegal: /\S/,
                    contains: [u, {
                        className: "section",
                        begin: /\[+/,
                        end: /\]+/
                    }, {
                        begin: n.concat(E, "(\\s*\\.\\s*", E, ")*", n.lookahead(/\s*=\s*[^#\s]/)),
                        className: "attr",
                        starts: {
                            end: /$/,
                            contains: [u, m, l, h, b, o]
                        }
                    }]
                }
            },
            grmr_java: e => {
                let n = e.regex,
                    o = "[\xC0-\u02B8a-zA-Z_$][\xC0-\u02B8a-zA-Z_$0-9]*",
                    u = o + ke("(?:<" + o + "~~~(?:\\s*,\\s*" + o + "~~~)*>)?", /~~~/g, 2),
                    h = {
                        keyword: ["synchronized", "abstract", "private", "var", "static", "if", "const ", "for", "while", "strictfp", "finally", "protected", "import", "native", "final", "void", "enum", "else", "break", "transient", "catch", "instanceof", "volatile", "case", "assert", "package", "default", "public", "try", "switch", "continue", "throws", "protected", "public", "private", "module", "requires", "exports", "do", "sealed", "yield", "permits"],
                        literal: ["false", "true", "null"],
                        type: ["char", "boolean", "long", "float", "int", "byte", "short", "double"],
                        built_in: ["super", "this"]
                    },
                    l = {
                        className: "meta",
                        begin: "@" + o,
                        contains: [{
                            begin: /\(/,
                            end: /\)/,
                            contains: ["self"]
                        }]
                    },
                    b = {
                        className: "params",
                        begin: /\(/,
                        end: /\)/,
                        keywords: h,
                        relevance: 0,
                        contains: [e.C_BLOCK_COMMENT_MODE],
                        endsParent: !0
                    };
                return {
                    name: "Java",
                    aliases: ["jsp"],
                    keywords: h,
                    illegal: /<\/|#/,
                    contains: [e.COMMENT("/\\*\\*", "\\*/", {
                        relevance: 0,
                        contains: [{
                            begin: /\w+@/,
                            relevance: 0
                        }, {
                            className: "doctag",
                            begin: "@[A-Za-z]+"
                        }]
                    }), {
                        begin: /import java\.[a-z]+\./,
                        keywords: "import",
                        relevance: 2
                    }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, {
                        begin: /"""/,
                        end: /"""/,
                        className: "string",
                        contains: [e.BACKSLASH_ESCAPE]
                    }, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, {
                        match: [/\b(?:class|interface|enum|extends|implements|new)/, /\s+/, o],
                        className: {
                            1: "keyword",
                            3: "title.class"
                        }
                    }, {
                        match: /non-sealed/,
                        scope: "keyword"
                    }, {
                        begin: [n.concat(/(?!else)/, o), /\s+/, o, /\s+/, /=(?!=)/],
                        className: {
                            1: "type",
                            3: "variable",
                            5: "operator"
                        }
                    }, {
                        begin: [/record/, /\s+/, o],
                        className: {
                            1: "keyword",
                            3: "title.class"
                        },
                        contains: [b, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
                    }, {
                        beginKeywords: "new throw return else",
                        relevance: 0
                    }, {
                        begin: ["(?:" + u + "\\s+)", e.UNDERSCORE_IDENT_RE, /\s*(?=\()/],
                        className: {
                            2: "title.function"
                        },
                        keywords: h,
                        contains: [{
                            className: "params",
                            begin: /\(/,
                            end: /\)/,
                            keywords: h,
                            relevance: 0,
                            contains: [l, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, Ee, e.C_BLOCK_COMMENT_MODE]
                        }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
                    }, Ee, l]
                }
            },
            grmr_javascript: Tt,
            grmr_json: e => {
                let n = ["true", "false", "null"],
                    o = {
                        scope: "literal",
                        beginKeywords: n.join(" ")
                    };
                return {
                    name: "JSON",
                    keywords: {
                        literal: n
                    },
                    contains: [{
                        className: "attr",
                        begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
                        relevance: 1.01
                    }, {
                        match: /[{}[\],:]/,
                        className: "punctuation",
                        relevance: 0
                    }, e.QUOTE_STRING_MODE, o, e.C_NUMBER_MODE, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE],
                    illegal: "\\S"
                }
            },
            grmr_kotlin: e => {
                let n = {
                        keyword: "abstract as val var vararg get set class object open private protected public noinline crossinline dynamic final enum if else do while for when throw try catch finally import package is in fun override companion reified inline lateinit init interface annotation data sealed internal infix operator out by constructor super tailrec where const inner suspend typealias external expect actual",
                        built_in: "Byte Short Char Int Long Boolean Float Double Void Unit Nothing",
                        literal: "true false null"
                    },
                    o = {
                        className: "symbol",
                        begin: e.UNDERSCORE_IDENT_RE + "@"
                    },
                    u = {
                        className: "subst",
                        begin: /\$\{/,
                        end: /\}/,
                        contains: [e.C_NUMBER_MODE]
                    },
                    h = {
                        className: "variable",
                        begin: "\\$" + e.UNDERSCORE_IDENT_RE
                    },
                    l = {
                        className: "string",
                        variants: [{
                            begin: '"""',
                            end: '"""(?=[^"])',
                            contains: [h, u]
                        }, {
                            begin: "'",
                            end: "'",
                            illegal: /\n/,
                            contains: [e.BACKSLASH_ESCAPE]
                        }, {
                            begin: '"',
                            end: '"',
                            illegal: /\n/,
                            contains: [e.BACKSLASH_ESCAPE, h, u]
                        }]
                    };
                u.contains.push(l);
                let b = {
                        className: "meta",
                        begin: "@(?:file|property|field|get|set|receiver|param|setparam|delegate)\\s*:(?:\\s*" + e.UNDERSCORE_IDENT_RE + ")?"
                    },
                    m = {
                        className: "meta",
                        begin: "@" + e.UNDERSCORE_IDENT_RE,
                        contains: [{
                            begin: /\(/,
                            end: /\)/,
                            contains: [e.inherit(l, {
                                className: "string"
                            }), "self"]
                        }]
                    },
                    E = Ee,
                    v = e.COMMENT("/\\*", "\\*/", {
                        contains: [e.C_BLOCK_COMMENT_MODE]
                    }),
                    w = {
                        variants: [{
                            className: "type",
                            begin: e.UNDERSCORE_IDENT_RE
                        }, {
                            begin: /\(/,
                            end: /\)/,
                            contains: []
                        }]
                    },
                    C = w;
                return C.variants[1].contains = [w], w.variants[1].contains = [C], {
                    name: "Kotlin",
                    aliases: ["kt", "kts"],
                    keywords: n,
                    contains: [e.COMMENT("/\\*\\*", "\\*/", {
                        relevance: 0,
                        contains: [{
                            className: "doctag",
                            begin: "@[A-Za-z]+"
                        }]
                    }), e.C_LINE_COMMENT_MODE, v, {
                        className: "keyword",
                        begin: /\b(break|continue|return|this)\b/,
                        starts: {
                            contains: [{
                                className: "symbol",
                                begin: /@\w+/
                            }]
                        }
                    }, o, b, m, {
                        className: "function",
                        beginKeywords: "fun",
                        end: "[(]|$",
                        returnBegin: !0,
                        excludeEnd: !0,
                        keywords: n,
                        relevance: 5,
                        contains: [{
                            begin: e.UNDERSCORE_IDENT_RE + "\\s*\\(",
                            returnBegin: !0,
                            relevance: 0,
                            contains: [e.UNDERSCORE_TITLE_MODE]
                        }, {
                            className: "type",
                            begin: /</,
                            end: />/,
                            keywords: "reified",
                            relevance: 0
                        }, {
                            className: "params",
                            begin: /\(/,
                            end: /\)/,
                            endsParent: !0,
                            keywords: n,
                            relevance: 0,
                            contains: [{
                                begin: /:/,
                                end: /[=,\/]/,
                                endsWithParent: !0,
                                contains: [w, e.C_LINE_COMMENT_MODE, v],
                                relevance: 0
                            }, e.C_LINE_COMMENT_MODE, v, b, m, l, e.C_NUMBER_MODE]
                        }, v]
                    }, {
                        begin: [/class|interface|trait/, /\s+/, e.UNDERSCORE_IDENT_RE],
                        beginScope: {
                            3: "title.class"
                        },
                        keywords: "class interface trait",
                        end: /[:\{(]|$/,
                        excludeEnd: !0,
                        illegal: "extends implements",
                        contains: [{
                            beginKeywords: "public protected internal private constructor"
                        }, e.UNDERSCORE_TITLE_MODE, {
                            className: "type",
                            begin: /</,
                            end: />/,
                            excludeBegin: !0,
                            excludeEnd: !0,
                            relevance: 0
                        }, {
                            className: "type",
                            begin: /[,:]\s*/,
                            end: /[<\(,){\s]|$/,
                            excludeBegin: !0,
                            returnEnd: !0
                        }, b, m]
                    }, l, {
                        className: "meta",
                        begin: "^#!/usr/bin/env",
                        end: "$",
                        illegal: `
`
                    }, E]
                }
            },
            grmr_less: e => {
                let n = x(e),
                    o = Q,
                    u = "([\\w-]+|@\\{[\\w-]+\\})",
                    h = [],
                    l = [],
                    b = we => ({
                        className: "string",
                        begin: "~?" + we + ".*?" + we
                    }),
                    m = (we, de, k) => ({
                        className: we,
                        begin: de,
                        relevance: k
                    }),
                    E = {
                        $pattern: /[a-z-]+/,
                        keyword: "and or not only",
                        attribute: B.join(" ")
                    },
                    v = {
                        begin: "\\(",
                        end: "\\)",
                        contains: l,
                        keywords: E,
                        relevance: 0
                    };
                l.push(e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, b("'"), b('"'), n.CSS_NUMBER_MODE, {
                    begin: "(url|data-uri)\\(",
                    starts: {
                        className: "string",
                        end: "[\\)\\n]",
                        excludeEnd: !0
                    }
                }, n.HEXCOLOR, v, m("variable", "@@?[\\w-]+", 10), m("variable", "@\\{[\\w-]+\\}"), m("built_in", "~?`[^`]*?`"), {
                    className: "attribute",
                    begin: "[\\w-]+\\s*:",
                    end: ":",
                    returnBegin: !0,
                    excludeEnd: !0
                }, n.IMPORTANT, {
                    beginKeywords: "and not"
                }, n.FUNCTION_DISPATCH);
                let w = l.concat({
                        begin: /\{/,
                        end: /\}/,
                        contains: h
                    }),
                    C = {
                        beginKeywords: "when",
                        endsWithParent: !0,
                        contains: [{
                            beginKeywords: "and not"
                        }].concat(l)
                    },
                    P = {
                        begin: u + "\\s*:",
                        returnBegin: !0,
                        end: /[;}]/,
                        relevance: 0,
                        contains: [{
                            begin: /-(webkit|moz|ms|o)-/
                        }, n.CSS_VARIABLE, {
                            className: "attribute",
                            begin: "\\b(" + j.join("|") + ")\\b",
                            end: /(?=:)/,
                            starts: {
                                endsWithParent: !0,
                                illegal: "[<=$]",
                                relevance: 0,
                                contains: l
                            }
                        }]
                    },
                    Z = {
                        className: "keyword",
                        begin: "@(import|media|charset|font-face|(-[a-z]+-)?keyframes|supports|document|namespace|page|viewport|host)\\b",
                        starts: {
                            end: "[;{}]",
                            keywords: E,
                            returnEnd: !0,
                            contains: l,
                            relevance: 0
                        }
                    },
                    R = {
                        className: "variable",
                        variants: [{
                            begin: "@[\\w-]+\\s*:",
                            relevance: 15
                        }, {
                            begin: "@[\\w-]+"
                        }],
                        starts: {
                            end: "[;}]",
                            returnEnd: !0,
                            contains: w
                        }
                    },
                    J = {
                        variants: [{
                            begin: "[\\.#:&\\[>]",
                            end: "[;{}]"
                        }, {
                            begin: u,
                            end: /\{/
                        }],
                        returnBegin: !0,
                        returnEnd: !0,
                        illegal: `[<='$"]`,
                        relevance: 0,
                        contains: [e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, C, m("keyword", "all\\b"), m("variable", "@\\{[\\w-]+\\}"), {
                            begin: "\\b(" + A.join("|") + ")\\b",
                            className: "selector-tag"
                        }, n.CSS_NUMBER_MODE, m("selector-tag", u, 0), m("selector-id", "#" + u), m("selector-class", "\\." + u, 0), m("selector-tag", "&", 0), n.ATTRIBUTE_SELECTOR_MODE, {
                            className: "selector-pseudo",
                            begin: ":(" + g.join("|") + ")"
                        }, {
                            className: "selector-pseudo",
                            begin: ":(:)?(" + T.join("|") + ")"
                        }, {
                            begin: /\(/,
                            end: /\)/,
                            relevance: 0,
                            contains: w
                        }, {
                            begin: "!important"
                        }, n.FUNCTION_DISPATCH]
                    },
                    De = {
                        begin: `[\\w-]+:(:)?(${o.join("|")})`,
                        returnBegin: !0,
                        contains: [J]
                    };
                return h.push(e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, Z, R, De, P, J, C, n.FUNCTION_DISPATCH), {
                    name: "Less",
                    case_insensitive: !0,
                    illegal: `[=>'/<($"]`,
                    contains: h
                }
            },
            grmr_lua: e => {
                let n = "\\[=*\\[",
                    o = "\\]=*\\]",
                    u = {
                        begin: n,
                        end: o,
                        contains: ["self"]
                    },
                    h = [e.COMMENT("--(?!\\[=*\\[)", "$"), e.COMMENT("--\\[=*\\[", o, {
                        contains: [u],
                        relevance: 10
                    })];
                return {
                    name: "Lua",
                    keywords: {
                        $pattern: e.UNDERSCORE_IDENT_RE,
                        literal: "true false nil",
                        keyword: "and break do else elseif end for goto if in local not or repeat return then until while",
                        built_in: "_G _ENV _VERSION __index __newindex __mode __call __metatable __tostring __len __gc __add __sub __mul __div __mod __pow __concat __unm __eq __lt __le assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall arg self coroutine resume yield status wrap create running debug getupvalue debug sethook getmetatable gethook setmetatable setlocal traceback setfenv getinfo setupvalue getlocal getregistry getfenv io lines write close flush open output type read stderr stdin input stdout popen tmpfile math log max acos huge ldexp pi cos tanh pow deg tan cosh sinh random randomseed frexp ceil floor rad abs sqrt modf asin min mod fmod log10 atan2 exp sin atan os exit setlocale date getenv difftime remove time clock tmpname rename execute package preload loadlib loaded loaders cpath config path seeall string sub upper len gfind rep find match char dump gmatch reverse byte format gsub lower table setn insert getn foreachi maxn foreach concat sort remove"
                    },
                    contains: h.concat([{
                        className: "function",
                        beginKeywords: "function",
                        end: "\\)",
                        contains: [e.inherit(e.TITLE_MODE, {
                            begin: "([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"
                        }), {
                            className: "params",
                            begin: "\\(",
                            endsWithParent: !0,
                            contains: h
                        }].concat(h)
                    }, e.C_NUMBER_MODE, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, {
                        className: "string",
                        begin: n,
                        end: o,
                        contains: [u],
                        relevance: 5
                    }])
                }
            },
            grmr_makefile: e => {
                let n = {
                        className: "variable",
                        variants: [{
                            begin: "\\$\\(" + e.UNDERSCORE_IDENT_RE + "\\)",
                            contains: [e.BACKSLASH_ESCAPE]
                        }, {
                            begin: /\$[@%<?\^\+\*]/
                        }]
                    },
                    o = {
                        className: "string",
                        begin: /"/,
                        end: /"/,
                        contains: [e.BACKSLASH_ESCAPE, n]
                    },
                    u = {
                        className: "variable",
                        begin: /\$\([\w-]+\s/,
                        end: /\)/,
                        keywords: {
                            built_in: "subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value"
                        },
                        contains: [n]
                    },
                    h = {
                        begin: "^" + e.UNDERSCORE_IDENT_RE + "\\s*(?=[:+?]?=)"
                    },
                    l = {
                        className: "section",
                        begin: /^[^\s]+:/,
                        end: /$/,
                        contains: [n]
                    };
                return {
                    name: "Makefile",
                    aliases: ["mk", "mak", "make"],
                    keywords: {
                        $pattern: /[\w-]+/,
                        keyword: "define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath"
                    },
                    contains: [e.HASH_COMMENT_MODE, n, o, u, h, {
                        className: "meta",
                        begin: /^\.PHONY:/,
                        end: /$/,
                        keywords: {
                            $pattern: /[\.\w]+/,
                            keyword: ".PHONY"
                        }
                    }, l]
                }
            },
            grmr_xml: e => {
                let n = e.regex,
                    o = n.concat(/[\p{L}_]/u, n.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u),
                    u = {
                        className: "symbol",
                        begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
                    },
                    h = {
                        begin: /\s/,
                        contains: [{
                            className: "keyword",
                            begin: /#?[a-z_][a-z1-9_-]+/,
                            illegal: /\n/
                        }]
                    },
                    l = e.inherit(h, {
                        begin: /\(/,
                        end: /\)/
                    }),
                    b = e.inherit(e.APOS_STRING_MODE, {
                        className: "string"
                    }),
                    m = e.inherit(e.QUOTE_STRING_MODE, {
                        className: "string"
                    }),
                    E = {
                        endsWithParent: !0,
                        illegal: /</,
                        relevance: 0,
                        contains: [{
                            className: "attr",
                            begin: /[\p{L}0-9._:-]+/u,
                            relevance: 0
                        }, {
                            begin: /=\s*/,
                            relevance: 0,
                            contains: [{
                                className: "string",
                                endsParent: !0,
                                variants: [{
                                    begin: /"/,
                                    end: /"/,
                                    contains: [u]
                                }, {
                                    begin: /'/,
                                    end: /'/,
                                    contains: [u]
                                }, {
                                    begin: /[^\s"'=<>`]+/
                                }]
                            }]
                        }]
                    };
                return {
                    name: "HTML, XML",
                    aliases: ["html", "xhtml", "rss", "atom", "xjb", "xsd", "xsl", "plist", "wsf", "svg"],
                    case_insensitive: !0,
                    unicodeRegex: !0,
                    contains: [{
                        className: "meta",
                        begin: /<![a-z]/,
                        end: />/,
                        relevance: 10,
                        contains: [h, m, b, l, {
                            begin: /\[/,
                            end: /\]/,
                            contains: [{
                                className: "meta",
                                begin: /<![a-z]/,
                                end: />/,
                                contains: [h, l, m, b]
                            }]
                        }]
                    }, e.COMMENT(/<!--/, /-->/, {
                        relevance: 10
                    }), {
                        begin: /<!\[CDATA\[/,
                        end: /\]\]>/,
                        relevance: 10
                    }, u, {
                        className: "meta",
                        end: /\?>/,
                        variants: [{
                            begin: /<\?xml/,
                            relevance: 10,
                            contains: [m]
                        }, {
                            begin: /<\?[a-z][a-z0-9]+/
                        }]
                    }, {
                        className: "tag",
                        begin: /<style(?=\s|>)/,
                        end: />/,
                        keywords: {
                            name: "style"
                        },
                        contains: [E],
                        starts: {
                            end: /<\/style>/,
                            returnEnd: !0,
                            subLanguage: ["css", "xml"]
                        }
                    }, {
                        className: "tag",
                        begin: /<script(?=\s|>)/,
                        end: />/,
                        keywords: {
                            name: "script"
                        },
                        contains: [E],
                        starts: {
                            end: /<\/script>/,
                            returnEnd: !0,
                            subLanguage: ["javascript", "handlebars", "xml"]
                        }
                    }, {
                        className: "tag",
                        begin: /<>|<\/>/
                    }, {
                        className: "tag",
                        begin: n.concat(/</, n.lookahead(n.concat(o, n.either(/\/>/, />/, /\s/)))),
                        end: /\/?>/,
                        contains: [{
                            className: "name",
                            begin: o,
                            relevance: 0,
                            starts: E
                        }]
                    }, {
                        className: "tag",
                        begin: n.concat(/<\//, n.lookahead(n.concat(o, />/))),
                        contains: [{
                            className: "name",
                            begin: o,
                            relevance: 0
                        }, {
                            begin: />/,
                            relevance: 0,
                            endsParent: !0
                        }]
                    }]
                }
            },
            grmr_markdown: e => {
                let n = {
                        begin: /<\/?[A-Za-z_]/,
                        end: ">",
                        subLanguage: "xml",
                        relevance: 0
                    },
                    o = {
                        variants: [{
                            begin: /\[.+?\]\[.*?\]/,
                            relevance: 0
                        }, {
                            begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
                            relevance: 2
                        }, {
                            begin: e.regex.concat(/\[.+?\]\(/, /[A-Za-z][A-Za-z0-9+.-]*/, /:\/\/.*?\)/),
                            relevance: 2
                        }, {
                            begin: /\[.+?\]\([./?&#].*?\)/,
                            relevance: 1
                        }, {
                            begin: /\[.*?\]\(.*?\)/,
                            relevance: 0
                        }],
                        returnBegin: !0,
                        contains: [{
                            match: /\[(?=\])/
                        }, {
                            className: "string",
                            relevance: 0,
                            begin: "\\[",
                            end: "\\]",
                            excludeBegin: !0,
                            returnEnd: !0
                        }, {
                            className: "link",
                            relevance: 0,
                            begin: "\\]\\(",
                            end: "\\)",
                            excludeBegin: !0,
                            excludeEnd: !0
                        }, {
                            className: "symbol",
                            relevance: 0,
                            begin: "\\]\\[",
                            end: "\\]",
                            excludeBegin: !0,
                            excludeEnd: !0
                        }]
                    },
                    u = {
                        className: "strong",
                        contains: [],
                        variants: [{
                            begin: /_{2}(?!\s)/,
                            end: /_{2}/
                        }, {
                            begin: /\*{2}(?!\s)/,
                            end: /\*{2}/
                        }]
                    },
                    h = {
                        className: "emphasis",
                        contains: [],
                        variants: [{
                            begin: /\*(?![*\s])/,
                            end: /\*/
                        }, {
                            begin: /_(?![_\s])/,
                            end: /_/,
                            relevance: 0
                        }]
                    },
                    l = e.inherit(u, {
                        contains: []
                    }),
                    b = e.inherit(h, {
                        contains: []
                    });
                u.contains.push(b), h.contains.push(l);
                let m = [n, o];
                return [u, h, l, b].forEach(E => {
                    E.contains = E.contains.concat(m)
                }), m = m.concat(u, h), {
                    name: "Markdown",
                    aliases: ["md", "mkdown", "mkd"],
                    contains: [{
                        className: "section",
                        variants: [{
                            begin: "^#{1,6}",
                            end: "$",
                            contains: m
                        }, {
                            begin: "(?=^.+?\\n[=-]{2,}$)",
                            contains: [{
                                begin: "^[=-]*$"
                            }, {
                                begin: "^",
                                end: "\\n",
                                contains: m
                            }]
                        }]
                    }, n, {
                        className: "bullet",
                        begin: "^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",
                        end: "\\s+",
                        excludeEnd: !0
                    }, u, h, {
                        className: "quote",
                        begin: "^>\\s+",
                        contains: m,
                        end: "$"
                    }, {
                        className: "code",
                        variants: [{
                            begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*"
                        }, {
                            begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*"
                        }, {
                            begin: "```",
                            end: "```+[ ]*$"
                        }, {
                            begin: "~~~",
                            end: "~~~+[ ]*$"
                        }, {
                            begin: "`.+?`"
                        }, {
                            begin: "(?=^( {4}|\\t))",
                            contains: [{
                                begin: "^( {4}|\\t)",
                                end: "(\\n)$"
                            }],
                            relevance: 0
                        }]
                    }, {
                        begin: "^[-\\*]{3,}",
                        end: "$"
                    }, o, {
                        begin: /^\[[^\n]+\]:/,
                        returnBegin: !0,
                        contains: [{
                            className: "symbol",
                            begin: /\[/,
                            end: /\]/,
                            excludeBegin: !0,
                            excludeEnd: !0
                        }, {
                            className: "link",
                            begin: /:\s*/,
                            end: /$/,
                            excludeBegin: !0
                        }]
                    }]
                }
            },
            grmr_objectivec: e => {
                let n = /[a-zA-Z@][a-zA-Z0-9_]*/,
                    o = {
                        $pattern: n,
                        keyword: ["@interface", "@class", "@protocol", "@implementation"]
                    };
                return {
                    name: "Objective-C",
                    aliases: ["mm", "objc", "obj-c", "obj-c++", "objective-c++"],
                    keywords: {
                        "variable.language": ["this", "super"],
                        $pattern: n,
                        keyword: ["while", "export", "sizeof", "typedef", "const", "struct", "for", "union", "volatile", "static", "mutable", "if", "do", "return", "goto", "enum", "else", "break", "extern", "asm", "case", "default", "register", "explicit", "typename", "switch", "continue", "inline", "readonly", "assign", "readwrite", "self", "@synchronized", "id", "typeof", "nonatomic", "IBOutlet", "IBAction", "strong", "weak", "copy", "in", "out", "inout", "bycopy", "byref", "oneway", "__strong", "__weak", "__block", "__autoreleasing", "@private", "@protected", "@public", "@try", "@property", "@end", "@throw", "@catch", "@finally", "@autoreleasepool", "@synthesize", "@dynamic", "@selector", "@optional", "@required", "@encode", "@package", "@import", "@defs", "@compatibility_alias", "__bridge", "__bridge_transfer", "__bridge_retained", "__bridge_retain", "__covariant", "__contravariant", "__kindof", "_Nonnull", "_Nullable", "_Null_unspecified", "__FUNCTION__", "__PRETTY_FUNCTION__", "__attribute__", "getter", "setter", "retain", "unsafe_unretained", "nonnull", "nullable", "null_unspecified", "null_resettable", "class", "instancetype", "NS_DESIGNATED_INITIALIZER", "NS_UNAVAILABLE", "NS_REQUIRES_SUPER", "NS_RETURNS_INNER_POINTER", "NS_INLINE", "NS_AVAILABLE", "NS_DEPRECATED", "NS_ENUM", "NS_OPTIONS", "NS_SWIFT_UNAVAILABLE", "NS_ASSUME_NONNULL_BEGIN", "NS_ASSUME_NONNULL_END", "NS_REFINED_FOR_SWIFT", "NS_SWIFT_NAME", "NS_SWIFT_NOTHROW", "NS_DURING", "NS_HANDLER", "NS_ENDHANDLER", "NS_VALUERETURN", "NS_VOIDRETURN"],
                        literal: ["false", "true", "FALSE", "TRUE", "nil", "YES", "NO", "NULL"],
                        built_in: ["dispatch_once_t", "dispatch_queue_t", "dispatch_sync", "dispatch_async", "dispatch_once"],
                        type: ["int", "float", "char", "unsigned", "signed", "short", "long", "double", "wchar_t", "unichar", "void", "bool", "BOOL", "id|0", "_Bool"]
                    },
                    illegal: "</",
                    contains: [{
                        className: "built_in",
                        begin: "\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\w+"
                    }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, e.C_NUMBER_MODE, e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, {
                        className: "string",
                        variants: [{
                            begin: '@"',
                            end: '"',
                            illegal: "\\n",
                            contains: [e.BACKSLASH_ESCAPE]
                        }]
                    }, {
                        className: "meta",
                        begin: /#\s*[a-z]+\b/,
                        end: /$/,
                        keywords: {
                            keyword: "if else elif endif define undef warning error line pragma ifdef ifndef include"
                        },
                        contains: [{
                            begin: /\\\n/,
                            relevance: 0
                        }, e.inherit(e.QUOTE_STRING_MODE, {
                            className: "string"
                        }), {
                            className: "string",
                            begin: /<.*?>/,
                            end: /$/,
                            illegal: "\\n"
                        }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
                    }, {
                        className: "class",
                        begin: "(" + o.keyword.join("|") + ")\\b",
                        end: /(\{|$)/,
                        excludeEnd: !0,
                        keywords: o,
                        contains: [e.UNDERSCORE_TITLE_MODE]
                    }, {
                        begin: "\\." + e.UNDERSCORE_IDENT_RE,
                        relevance: 0
                    }]
                }
            },
            grmr_perl: e => {
                let n = e.regex,
                    o = /[dualxmsipngr]{0,12}/,
                    u = {
                        $pattern: /[\w.]+/,
                        keyword: "abs accept alarm and atan2 bind binmode bless break caller chdir chmod chomp chop chown chr chroot close closedir connect continue cos crypt dbmclose dbmopen defined delete die do dump each else elsif endgrent endhostent endnetent endprotoent endpwent endservent eof eval exec exists exit exp fcntl fileno flock for foreach fork format formline getc getgrent getgrgid getgrnam gethostbyaddr gethostbyname gethostent getlogin getnetbyaddr getnetbyname getnetent getpeername getpgrp getpriority getprotobyname getprotobynumber getprotoent getpwent getpwnam getpwuid getservbyname getservbyport getservent getsockname getsockopt given glob gmtime goto grep gt hex if index int ioctl join keys kill last lc lcfirst length link listen local localtime log lstat lt ma map mkdir msgctl msgget msgrcv msgsnd my ne next no not oct open opendir or ord our pack package pipe pop pos print printf prototype push q|0 qq quotemeta qw qx rand read readdir readline readlink readpipe recv redo ref rename require reset return reverse rewinddir rindex rmdir say scalar seek seekdir select semctl semget semop send setgrent sethostent setnetent setpgrp setpriority setprotoent setpwent setservent setsockopt shift shmctl shmget shmread shmwrite shutdown sin sleep socket socketpair sort splice split sprintf sqrt srand stat state study sub substr symlink syscall sysopen sysread sysseek system syswrite tell telldir tie tied time times tr truncate uc ucfirst umask undef unless unlink unpack unshift untie until use utime values vec wait waitpid wantarray warn when while write x|0 xor y|0"
                    },
                    h = {
                        className: "subst",
                        begin: "[$@]\\{",
                        end: "\\}",
                        keywords: u
                    },
                    l = {
                        begin: /->\{/,
                        end: /\}/
                    },
                    b = {
                        variants: [{
                            begin: /\$\d/
                        }, {
                            begin: n.concat(/[$%@](\^\w\b|#\w+(::\w+)*|\{\w+\}|\w+(::\w*)*)/, "(?![A-Za-z])(?![@$%])")
                        }, {
                            begin: /[$%@][^\s\w{]/,
                            relevance: 0
                        }]
                    },
                    m = [e.BACKSLASH_ESCAPE, h, b],
                    E = [/!/, /\//, /\|/, /\?/, /'/, /"/, /#/],
                    v = (P, Z, R = "\\1") => {
                        let J = R === "\\1" ? R : n.concat(R, Z);
                        return n.concat(n.concat("(?:", P, ")"), Z, /(?:\\.|[^\\\/])*?/, J, /(?:\\.|[^\\\/])*?/, R, o)
                    },
                    w = (P, Z, R) => n.concat(n.concat("(?:", P, ")"), Z, /(?:\\.|[^\\\/])*?/, R, o),
                    C = [b, e.HASH_COMMENT_MODE, e.COMMENT(/^=\w/, /=cut/, {
                        endsWithParent: !0
                    }), l, {
                        className: "string",
                        contains: m,
                        variants: [{
                            begin: "q[qwxr]?\\s*\\(",
                            end: "\\)",
                            relevance: 5
                        }, {
                            begin: "q[qwxr]?\\s*\\[",
                            end: "\\]",
                            relevance: 5
                        }, {
                            begin: "q[qwxr]?\\s*\\{",
                            end: "\\}",
                            relevance: 5
                        }, {
                            begin: "q[qwxr]?\\s*\\|",
                            end: "\\|",
                            relevance: 5
                        }, {
                            begin: "q[qwxr]?\\s*<",
                            end: ">",
                            relevance: 5
                        }, {
                            begin: "qw\\s+q",
                            end: "q",
                            relevance: 5
                        }, {
                            begin: "'",
                            end: "'",
                            contains: [e.BACKSLASH_ESCAPE]
                        }, {
                            begin: '"',
                            end: '"'
                        }, {
                            begin: "`",
                            end: "`",
                            contains: [e.BACKSLASH_ESCAPE]
                        }, {
                            begin: /\{\w+\}/,
                            relevance: 0
                        }, {
                            begin: "-?\\w+\\s*=>",
                            relevance: 0
                        }]
                    }, {
                        className: "number",
                        begin: "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",
                        relevance: 0
                    }, {
                        begin: "(\\/\\/|" + e.RE_STARTERS_RE + "|\\b(split|return|print|reverse|grep)\\b)\\s*",
                        keywords: "split return print reverse grep",
                        relevance: 0,
                        contains: [e.HASH_COMMENT_MODE, {
                            className: "regexp",
                            variants: [{
                                begin: v("s|tr|y", n.either(...E, {
                                    capture: !0
                                }))
                            }, {
                                begin: v("s|tr|y", "\\(", "\\)")
                            }, {
                                begin: v("s|tr|y", "\\[", "\\]")
                            }, {
                                begin: v("s|tr|y", "\\{", "\\}")
                            }],
                            relevance: 2
                        }, {
                            className: "regexp",
                            variants: [{
                                begin: /(m|qr)\/\//,
                                relevance: 0
                            }, {
                                begin: w("(?:m|qr)?", /\//, /\//)
                            }, {
                                begin: w("m|qr", n.either(...E, {
                                    capture: !0
                                }), /\1/)
                            }, {
                                begin: w("m|qr", /\(/, /\)/)
                            }, {
                                begin: w("m|qr", /\[/, /\]/)
                            }, {
                                begin: w("m|qr", /\{/, /\}/)
                            }]
                        }]
                    }, {
                        className: "function",
                        beginKeywords: "sub",
                        end: "(\\s*\\(.*?\\))?[;{]",
                        excludeEnd: !0,
                        relevance: 5,
                        contains: [e.TITLE_MODE]
                    }, {
                        begin: "-\\w\\b",
                        relevance: 0
                    }, {
                        begin: "^__DATA__$",
                        end: "^__END__$",
                        subLanguage: "mojolicious",
                        contains: [{
                            begin: "^@@.*",
                            end: "$",
                            className: "comment"
                        }]
                    }];
                return h.contains = C, l.contains = C, {
                    name: "Perl",
                    aliases: ["pl", "pm"],
                    keywords: u,
                    contains: C
                }
            },
            grmr_php: e => {
                let n = e.regex,
                    o = /(?![A-Za-z0-9])(?![$])/,
                    u = n.concat(/[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/, o),
                    h = n.concat(/(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/, o),
                    l = {
                        scope: "variable",
                        match: "\\$+" + u
                    },
                    b = {
                        scope: "subst",
                        variants: [{
                            begin: /\$\w+/
                        }, {
                            begin: /\{\$/,
                            end: /\}/
                        }]
                    },
                    m = e.inherit(e.APOS_STRING_MODE, {
                        illegal: null
                    }),
                    E = `[ 	
]`,
                    v = {
                        scope: "string",
                        variants: [e.inherit(e.QUOTE_STRING_MODE, {
                            illegal: null,
                            contains: e.QUOTE_STRING_MODE.contains.concat(b)
                        }), m, e.END_SAME_AS_BEGIN({
                            begin: /<<<[ \t]*(\w+)\n/,
                            end: /[ \t]*(\w+)\b/,
                            contains: e.QUOTE_STRING_MODE.contains.concat(b)
                        })]
                    },
                    w = {
                        scope: "number",
                        variants: [{
                            begin: "\\b0[bB][01]+(?:_[01]+)*\\b"
                        }, {
                            begin: "\\b0[oO][0-7]+(?:_[0-7]+)*\\b"
                        }, {
                            begin: "\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b"
                        }, {
                            begin: "(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?"
                        }],
                        relevance: 0
                    },
                    C = ["false", "null", "true"],
                    P = ["__CLASS__", "__DIR__", "__FILE__", "__FUNCTION__", "__COMPILER_HALT_OFFSET__", "__LINE__", "__METHOD__", "__NAMESPACE__", "__TRAIT__", "die", "echo", "exit", "include", "include_once", "print", "require", "require_once", "array", "abstract", "and", "as", "binary", "bool", "boolean", "break", "callable", "case", "catch", "class", "clone", "const", "continue", "declare", "default", "do", "double", "else", "elseif", "empty", "enddeclare", "endfor", "endforeach", "endif", "endswitch", "endwhile", "enum", "eval", "extends", "final", "finally", "float", "for", "foreach", "from", "global", "goto", "if", "implements", "instanceof", "insteadof", "int", "integer", "interface", "isset", "iterable", "list", "match|0", "mixed", "new", "never", "object", "or", "private", "protected", "public", "readonly", "real", "return", "string", "switch", "throw", "trait", "try", "unset", "use", "var", "void", "while", "xor", "yield"],
                    Z = ["Error|0", "AppendIterator", "ArgumentCountError", "ArithmeticError", "ArrayIterator", "ArrayObject", "AssertionError", "BadFunctionCallException", "BadMethodCallException", "CachingIterator", "CallbackFilterIterator", "CompileError", "Countable", "DirectoryIterator", "DivisionByZeroError", "DomainException", "EmptyIterator", "ErrorException", "Exception", "FilesystemIterator", "FilterIterator", "GlobIterator", "InfiniteIterator", "InvalidArgumentException", "IteratorIterator", "LengthException", "LimitIterator", "LogicException", "MultipleIterator", "NoRewindIterator", "OutOfBoundsException", "OutOfRangeException", "OuterIterator", "OverflowException", "ParentIterator", "ParseError", "RangeException", "RecursiveArrayIterator", "RecursiveCachingIterator", "RecursiveCallbackFilterIterator", "RecursiveDirectoryIterator", "RecursiveFilterIterator", "RecursiveIterator", "RecursiveIteratorIterator", "RecursiveRegexIterator", "RecursiveTreeIterator", "RegexIterator", "RuntimeException", "SeekableIterator", "SplDoublyLinkedList", "SplFileInfo", "SplFileObject", "SplFixedArray", "SplHeap", "SplMaxHeap", "SplMinHeap", "SplObjectStorage", "SplObserver", "SplPriorityQueue", "SplQueue", "SplStack", "SplSubject", "SplTempFileObject", "TypeError", "UnderflowException", "UnexpectedValueException", "UnhandledMatchError", "ArrayAccess", "BackedEnum", "Closure", "Fiber", "Generator", "Iterator", "IteratorAggregate", "Serializable", "Stringable", "Throwable", "Traversable", "UnitEnum", "WeakReference", "WeakMap", "Directory", "__PHP_Incomplete_Class", "parent", "php_user_filter", "self", "static", "stdClass"],
                    R = {
                        keyword: P,
                        literal: (W => {
                            let K = [];
                            return W.forEach(Y => {
                                K.push(Y), Y.toLowerCase() === Y ? K.push(Y.toUpperCase()) : K.push(Y.toLowerCase())
                            }), K
                        })(C),
                        built_in: Z
                    },
                    J = W => W.map(K => K.replace(/\|\d+$/, "")),
                    De = {
                        variants: [{
                            match: [/new/, n.concat(E, "+"), n.concat("(?!", J(Z).join("\\b|"), "\\b)"), h],
                            scope: {
                                1: "keyword",
                                4: "title.class"
                            }
                        }]
                    },
                    we = n.concat(u, "\\b(?!\\()"),
                    de = {
                        variants: [{
                            match: [n.concat(/::/, n.lookahead(/(?!class\b)/)), we],
                            scope: {
                                2: "variable.constant"
                            }
                        }, {
                            match: [/::/, /class/],
                            scope: {
                                2: "variable.language"
                            }
                        }, {
                            match: [h, n.concat(/::/, n.lookahead(/(?!class\b)/)), we],
                            scope: {
                                1: "title.class",
                                3: "variable.constant"
                            }
                        }, {
                            match: [h, n.concat("::", n.lookahead(/(?!class\b)/))],
                            scope: {
                                1: "title.class"
                            }
                        }, {
                            match: [h, /::/, /class/],
                            scope: {
                                1: "title.class",
                                3: "variable.language"
                            }
                        }]
                    },
                    k = {
                        scope: "attr",
                        match: n.concat(u, n.lookahead(":"), n.lookahead(/(?!::)/))
                    },
                    M = {
                        relevance: 0,
                        begin: /\(/,
                        end: /\)/,
                        keywords: R,
                        contains: [k, l, de, e.C_BLOCK_COMMENT_MODE, v, w, De]
                    },
                    q = {
                        relevance: 0,
                        match: [/\b/, n.concat("(?!fn\\b|function\\b|", J(P).join("\\b|"), "|", J(Z).join("\\b|"), "\\b)"), u, n.concat(E, "*"), n.lookahead(/(?=\()/)],
                        scope: {
                            3: "title.function.invoke"
                        },
                        contains: [M]
                    };
                M.contains.push(q);
                let ne = [k, de, e.C_BLOCK_COMMENT_MODE, v, w, De];
                return {
                    case_insensitive: !1,
                    keywords: R,
                    contains: [{
                        begin: n.concat(/#\[\s*/, h),
                        beginScope: "meta",
                        end: /]/,
                        endScope: "meta",
                        keywords: {
                            literal: C,
                            keyword: ["new", "array"]
                        },
                        contains: [{
                            begin: /\[/,
                            end: /]/,
                            keywords: {
                                literal: C,
                                keyword: ["new", "array"]
                            },
                            contains: ["self", ...ne]
                        }, ...ne, {
                            scope: "meta",
                            match: h
                        }]
                    }, e.HASH_COMMENT_MODE, e.COMMENT("//", "$"), e.COMMENT("/\\*", "\\*/", {
                        contains: [{
                            scope: "doctag",
                            match: "@[A-Za-z]+"
                        }]
                    }), {
                        match: /__halt_compiler\(\);/,
                        keywords: "__halt_compiler",
                        starts: {
                            scope: "comment",
                            end: e.MATCH_NOTHING_RE,
                            contains: [{
                                match: /\?>/,
                                scope: "meta",
                                endsParent: !0
                            }]
                        }
                    }, {
                        scope: "meta",
                        variants: [{
                            begin: /<\?php/,
                            relevance: 10
                        }, {
                            begin: /<\?=/
                        }, {
                            begin: /<\?/,
                            relevance: .1
                        }, {
                            begin: /\?>/
                        }]
                    }, {
                        scope: "variable.language",
                        match: /\$this\b/
                    }, l, q, de, {
                        match: [/const/, /\s/, u],
                        scope: {
                            1: "keyword",
                            3: "variable.constant"
                        }
                    }, De, {
                        scope: "function",
                        relevance: 0,
                        beginKeywords: "fn function",
                        end: /[;{]/,
                        excludeEnd: !0,
                        illegal: "[$%\\[]",
                        contains: [{
                            beginKeywords: "use"
                        }, e.UNDERSCORE_TITLE_MODE, {
                            begin: "=>",
                            endsParent: !0
                        }, {
                            scope: "params",
                            begin: "\\(",
                            end: "\\)",
                            excludeBegin: !0,
                            excludeEnd: !0,
                            keywords: R,
                            contains: ["self", l, de, e.C_BLOCK_COMMENT_MODE, v, w]
                        }]
                    }, {
                        scope: "class",
                        variants: [{
                            beginKeywords: "enum",
                            illegal: /[($"]/
                        }, {
                            beginKeywords: "class interface trait",
                            illegal: /[:($"]/
                        }],
                        relevance: 0,
                        end: /\{/,
                        excludeEnd: !0,
                        contains: [{
                            beginKeywords: "extends implements"
                        }, e.UNDERSCORE_TITLE_MODE]
                    }, {
                        beginKeywords: "namespace",
                        relevance: 0,
                        end: ";",
                        illegal: /[.']/,
                        contains: [e.inherit(e.UNDERSCORE_TITLE_MODE, {
                            scope: "title.class"
                        })]
                    }, {
                        beginKeywords: "use",
                        relevance: 0,
                        end: ";",
                        contains: [{
                            match: /\b(as|const|function)\b/,
                            scope: "keyword"
                        }, e.UNDERSCORE_TITLE_MODE]
                    }, v, w]
                }
            },
            grmr_php_template: e => ({
                name: "PHP template",
                subLanguage: "xml",
                contains: [{
                    begin: /<\?(php|=)?/,
                    end: /\?>/,
                    subLanguage: "php",
                    contains: [{
                        begin: "/\\*",
                        end: "\\*/",
                        skip: !0
                    }, {
                        begin: 'b"',
                        end: '"',
                        skip: !0
                    }, {
                        begin: "b'",
                        end: "'",
                        skip: !0
                    }, e.inherit(e.APOS_STRING_MODE, {
                        illegal: null,
                        className: null,
                        contains: null,
                        skip: !0
                    }), e.inherit(e.QUOTE_STRING_MODE, {
                        illegal: null,
                        className: null,
                        contains: null,
                        skip: !0
                    })]
                }]
            }),
            grmr_plaintext: e => ({
                name: "Plain text",
                aliases: ["text", "txt"],
                disableAutodetect: !0
            }),
            grmr_python: e => {
                let n = e.regex,
                    o = /[\p{XID_Start}_]\p{XID_Continue}*/u,
                    u = ["and", "as", "assert", "async", "await", "break", "case", "class", "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "match", "nonlocal|10", "not", "or", "pass", "raise", "return", "try", "while", "with", "yield"],
                    h = {
                        $pattern: /[A-Za-z]\w+|__\w+__/,
                        keyword: u,
                        built_in: ["__import__", "abs", "all", "any", "ascii", "bin", "bool", "breakpoint", "bytearray", "bytes", "callable", "chr", "classmethod", "compile", "complex", "delattr", "dict", "dir", "divmod", "enumerate", "eval", "exec", "filter", "float", "format", "frozenset", "getattr", "globals", "hasattr", "hash", "help", "hex", "id", "input", "int", "isinstance", "issubclass", "iter", "len", "list", "locals", "map", "max", "memoryview", "min", "next", "object", "oct", "open", "ord", "pow", "print", "property", "range", "repr", "reversed", "round", "set", "setattr", "slice", "sorted", "staticmethod", "str", "sum", "super", "tuple", "type", "vars", "zip"],
                        literal: ["__debug__", "Ellipsis", "False", "None", "NotImplemented", "True"],
                        type: ["Any", "Callable", "Coroutine", "Dict", "List", "Literal", "Generic", "Optional", "Sequence", "Set", "Tuple", "Type", "Union"]
                    },
                    l = {
                        className: "meta",
                        begin: /^(>>>|\.\.\.) /
                    },
                    b = {
                        className: "subst",
                        begin: /\{/,
                        end: /\}/,
                        keywords: h,
                        illegal: /#/
                    },
                    m = {
                        begin: /\{\{/,
                        relevance: 0
                    },
                    E = {
                        className: "string",
                        contains: [e.BACKSLASH_ESCAPE],
                        variants: [{
                            begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
                            end: /'''/,
                            contains: [e.BACKSLASH_ESCAPE, l],
                            relevance: 10
                        }, {
                            begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
                            end: /"""/,
                            contains: [e.BACKSLASH_ESCAPE, l],
                            relevance: 10
                        }, {
                            begin: /([fF][rR]|[rR][fF]|[fF])'''/,
                            end: /'''/,
                            contains: [e.BACKSLASH_ESCAPE, l, m, b]
                        }, {
                            begin: /([fF][rR]|[rR][fF]|[fF])"""/,
                            end: /"""/,
                            contains: [e.BACKSLASH_ESCAPE, l, m, b]
                        }, {
                            begin: /([uU]|[rR])'/,
                            end: /'/,
                            relevance: 10
                        }, {
                            begin: /([uU]|[rR])"/,
                            end: /"/,
                            relevance: 10
                        }, {
                            begin: /([bB]|[bB][rR]|[rR][bB])'/,
                            end: /'/
                        }, {
                            begin: /([bB]|[bB][rR]|[rR][bB])"/,
                            end: /"/
                        }, {
                            begin: /([fF][rR]|[rR][fF]|[fF])'/,
                            end: /'/,
                            contains: [e.BACKSLASH_ESCAPE, m, b]
                        }, {
                            begin: /([fF][rR]|[rR][fF]|[fF])"/,
                            end: /"/,
                            contains: [e.BACKSLASH_ESCAPE, m, b]
                        }, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
                    },
                    v = "[0-9](_?[0-9])*",
                    w = `(\\b(${v}))?\\.(${v})|\\b(${v})\\.`,
                    C = "\\b|" + u.join("|"),
                    P = {
                        className: "number",
                        relevance: 0,
                        variants: [{
                            begin: `(\\b(${v})|(${w}))[eE][+-]?(${v})[jJ]?(?=${C})`
                        }, {
                            begin: `(${w})[jJ]?`
                        }, {
                            begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${C})`
                        }, {
                            begin: `\\b0[bB](_?[01])+[lL]?(?=${C})`
                        }, {
                            begin: `\\b0[oO](_?[0-7])+[lL]?(?=${C})`
                        }, {
                            begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${C})`
                        }, {
                            begin: `\\b(${v})[jJ](?=${C})`
                        }]
                    },
                    Z = {
                        className: "comment",
                        begin: n.lookahead(/# type:/),
                        end: /$/,
                        keywords: h,
                        contains: [{
                            begin: /# type:/
                        }, {
                            begin: /#/,
                            end: /\b\B/,
                            endsWithParent: !0
                        }]
                    },
                    R = {
                        className: "params",
                        variants: [{
                            className: "",
                            begin: /\(\s*\)/,
                            skip: !0
                        }, {
                            begin: /\(/,
                            end: /\)/,
                            excludeBegin: !0,
                            excludeEnd: !0,
                            keywords: h,
                            contains: ["self", l, P, E, e.HASH_COMMENT_MODE]
                        }]
                    };
                return b.contains = [E, P, l], {
                    name: "Python",
                    aliases: ["py", "gyp", "ipython"],
                    unicodeRegex: !0,
                    keywords: h,
                    illegal: /(<\/|->|\?)|=>/,
                    contains: [l, P, {
                        begin: /\bself\b/
                    }, {
                        beginKeywords: "if",
                        relevance: 0
                    }, E, Z, e.HASH_COMMENT_MODE, {
                        match: [/\bdef/, /\s+/, o],
                        scope: {
                            1: "keyword",
                            3: "title.function"
                        },
                        contains: [R]
                    }, {
                        variants: [{
                            match: [/\bclass/, /\s+/, o, /\s*/, /\(\s*/, o, /\s*\)/]
                        }, {
                            match: [/\bclass/, /\s+/, o]
                        }],
                        scope: {
                            1: "keyword",
                            3: "title.class",
                            6: "title.class.inherited"
                        }
                    }, {
                        className: "meta",
                        begin: /^[\t ]*@/,
                        end: /(?=#)|$/,
                        contains: [P, R, E]
                    }]
                }
            },
            grmr_python_repl: e => ({
                aliases: ["pycon"],
                contains: [{
                    className: "meta.prompt",
                    starts: {
                        end: / |$/,
                        starts: {
                            end: "$",
                            subLanguage: "python"
                        }
                    },
                    variants: [{
                        begin: /^>>>(?=[ ]|$)/
                    }, {
                        begin: /^\.\.\.(?=[ ]|$)/
                    }]
                }]
            }),
            grmr_r: e => {
                let n = e.regex,
                    o = /(?:(?:[a-zA-Z]|\.[._a-zA-Z])[._a-zA-Z0-9]*)|\.(?!\d)/,
                    u = n.either(/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/, /0[xX][0-9a-fA-F]+(?:[pP][+-]?\d+)?[Li]?/, /(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[Li]?/),
                    h = /[=!<>:]=|\|\||&&|:::?|<-|<<-|->>|->|\|>|[-+*\/?!$&|:<=>@^~]|\*\*/,
                    l = n.either(/[()]/, /[{}]/, /\[\[/, /[[\]]/, /\\/, /,/);
                return {
                    name: "R",
                    keywords: {
                        $pattern: o,
                        keyword: "function if in break next repeat else for while",
                        literal: "NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10",
                        built_in: "LETTERS letters month.abb month.name pi T F abs acos acosh all any anyNA Arg as.call as.character as.complex as.double as.environment as.integer as.logical as.null.default as.numeric as.raw asin asinh atan atanh attr attributes baseenv browser c call ceiling class Conj cos cosh cospi cummax cummin cumprod cumsum digamma dim dimnames emptyenv exp expression floor forceAndCall gamma gc.time globalenv Im interactive invisible is.array is.atomic is.call is.character is.complex is.double is.environment is.expression is.finite is.function is.infinite is.integer is.language is.list is.logical is.matrix is.na is.name is.nan is.null is.numeric is.object is.pairlist is.raw is.recursive is.single is.symbol lazyLoadDBfetch length lgamma list log max min missing Mod names nargs nzchar oldClass on.exit pos.to.env proc.time prod quote range Re rep retracemem return round seq_along seq_len seq.int sign signif sin sinh sinpi sqrt standardGeneric substitute sum switch tan tanh tanpi tracemem trigamma trunc unclass untracemem UseMethod xtfrm"
                    },
                    contains: [e.COMMENT(/#'/, /$/, {
                        contains: [{
                            scope: "doctag",
                            match: /@examples/,
                            starts: {
                                end: n.lookahead(n.either(/\n^#'\s*(?=@[a-zA-Z]+)/, /\n^(?!#')/)),
                                endsParent: !0
                            }
                        }, {
                            scope: "doctag",
                            begin: "@param",
                            end: /$/,
                            contains: [{
                                scope: "variable",
                                variants: [{
                                    match: o
                                }, {
                                    match: /`(?:\\.|[^`\\])+`/
                                }],
                                endsParent: !0
                            }]
                        }, {
                            scope: "doctag",
                            match: /@[a-zA-Z]+/
                        }, {
                            scope: "keyword",
                            match: /\\[a-zA-Z]+/
                        }]
                    }), e.HASH_COMMENT_MODE, {
                        scope: "string",
                        contains: [e.BACKSLASH_ESCAPE],
                        variants: [e.END_SAME_AS_BEGIN({
                            begin: /[rR]"(-*)\(/,
                            end: /\)(-*)"/
                        }), e.END_SAME_AS_BEGIN({
                            begin: /[rR]"(-*)\{/,
                            end: /\}(-*)"/
                        }), e.END_SAME_AS_BEGIN({
                            begin: /[rR]"(-*)\[/,
                            end: /\](-*)"/
                        }), e.END_SAME_AS_BEGIN({
                            begin: /[rR]'(-*)\(/,
                            end: /\)(-*)'/
                        }), e.END_SAME_AS_BEGIN({
                            begin: /[rR]'(-*)\{/,
                            end: /\}(-*)'/
                        }), e.END_SAME_AS_BEGIN({
                            begin: /[rR]'(-*)\[/,
                            end: /\](-*)'/
                        }), {
                            begin: '"',
                            end: '"',
                            relevance: 0
                        }, {
                            begin: "'",
                            end: "'",
                            relevance: 0
                        }]
                    }, {
                        relevance: 0,
                        variants: [{
                            scope: {
                                1: "operator",
                                2: "number"
                            },
                            match: [h, u]
                        }, {
                            scope: {
                                1: "operator",
                                2: "number"
                            },
                            match: [/%[^%]*%/, u]
                        }, {
                            scope: {
                                1: "punctuation",
                                2: "number"
                            },
                            match: [l, u]
                        }, {
                            scope: {
                                2: "number"
                            },
                            match: [/[^a-zA-Z0-9._]|^/, u]
                        }]
                    }, {
                        scope: {
                            3: "operator"
                        },
                        match: [o, /\s+/, /<-/, /\s+/]
                    }, {
                        scope: "operator",
                        relevance: 0,
                        variants: [{
                            match: h
                        }, {
                            match: /%[^%]*%/
                        }]
                    }, {
                        scope: "punctuation",
                        relevance: 0,
                        match: l
                    }, {
                        begin: "`",
                        end: "`",
                        contains: [{
                            begin: /\\./
                        }]
                    }]
                }
            },
            grmr_ruby: e => {
                let n = e.regex,
                    o = "([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)",
                    u = n.either(/\b([A-Z]+[a-z0-9]+)+/, /\b([A-Z]+[a-z0-9]+)+[A-Z]+/),
                    h = n.concat(u, /(::\w+)*/),
                    l = {
                        "variable.constant": ["__FILE__", "__LINE__", "__ENCODING__"],
                        "variable.language": ["self", "super"],
                        keyword: ["alias", "and", "begin", "BEGIN", "break", "case", "class", "defined", "do", "else", "elsif", "end", "END", "ensure", "for", "if", "in", "module", "next", "not", "or", "redo", "require", "rescue", "retry", "return", "then", "undef", "unless", "until", "when", "while", "yield", "include", "extend", "prepend", "public", "private", "protected", "raise", "throw"],
                        built_in: ["proc", "lambda", "attr_accessor", "attr_reader", "attr_writer", "define_method", "private_constant", "module_function"],
                        literal: ["true", "false", "nil"]
                    },
                    b = {
                        className: "doctag",
                        begin: "@[A-Za-z]+"
                    },
                    m = {
                        begin: "#<",
                        end: ">"
                    },
                    E = [e.COMMENT("#", "$", {
                        contains: [b]
                    }), e.COMMENT("^=begin", "^=end", {
                        contains: [b],
                        relevance: 10
                    }), e.COMMENT("^__END__", e.MATCH_NOTHING_RE)],
                    v = {
                        className: "subst",
                        begin: /#\{/,
                        end: /\}/,
                        keywords: l
                    },
                    w = {
                        className: "string",
                        contains: [e.BACKSLASH_ESCAPE, v],
                        variants: [{
                            begin: /'/,
                            end: /'/
                        }, {
                            begin: /"/,
                            end: /"/
                        }, {
                            begin: /`/,
                            end: /`/
                        }, {
                            begin: /%[qQwWx]?\(/,
                            end: /\)/
                        }, {
                            begin: /%[qQwWx]?\[/,
                            end: /\]/
                        }, {
                            begin: /%[qQwWx]?\{/,
                            end: /\}/
                        }, {
                            begin: /%[qQwWx]?</,
                            end: />/
                        }, {
                            begin: /%[qQwWx]?\//,
                            end: /\//
                        }, {
                            begin: /%[qQwWx]?%/,
                            end: /%/
                        }, {
                            begin: /%[qQwWx]?-/,
                            end: /-/
                        }, {
                            begin: /%[qQwWx]?\|/,
                            end: /\|/
                        }, {
                            begin: /\B\?(\\\d{1,3})/
                        }, {
                            begin: /\B\?(\\x[A-Fa-f0-9]{1,2})/
                        }, {
                            begin: /\B\?(\\u\{?[A-Fa-f0-9]{1,6}\}?)/
                        }, {
                            begin: /\B\?(\\M-\\C-|\\M-\\c|\\c\\M-|\\M-|\\C-\\M-)[\x20-\x7e]/
                        }, {
                            begin: /\B\?\\(c|C-)[\x20-\x7e]/
                        }, {
                            begin: /\B\?\\?\S/
                        }, {
                            begin: n.concat(/<<[-~]?'?/, n.lookahead(/(\w+)(?=\W)[^\n]*\n(?:[^\n]*\n)*?\s*\1\b/)),
                            contains: [e.END_SAME_AS_BEGIN({
                                begin: /(\w+)/,
                                end: /(\w+)/,
                                contains: [e.BACKSLASH_ESCAPE, v]
                            })]
                        }]
                    },
                    C = "[0-9](_?[0-9])*",
                    P = {
                        className: "number",
                        relevance: 0,
                        variants: [{
                            begin: `\\b([1-9](_?[0-9])*|0)(\\.(${C}))?([eE][+-]?(${C})|r)?i?\\b`
                        }, {
                            begin: "\\b0[dD][0-9](_?[0-9])*r?i?\\b"
                        }, {
                            begin: "\\b0[bB][0-1](_?[0-1])*r?i?\\b"
                        }, {
                            begin: "\\b0[oO][0-7](_?[0-7])*r?i?\\b"
                        }, {
                            begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b"
                        }, {
                            begin: "\\b0(_?[0-7])+r?i?\\b"
                        }]
                    },
                    Z = {
                        variants: [{
                            match: /\(\)/
                        }, {
                            className: "params",
                            begin: /\(/,
                            end: /(?=\))/,
                            excludeBegin: !0,
                            endsParent: !0,
                            keywords: l
                        }]
                    },
                    R = [w, {
                        variants: [{
                            match: [/class\s+/, h, /\s+<\s+/, h]
                        }, {
                            match: [/\b(class|module)\s+/, h]
                        }],
                        scope: {
                            2: "title.class",
                            4: "title.class.inherited"
                        },
                        keywords: l
                    }, {
                        match: [/(include|extend)\s+/, h],
                        scope: {
                            2: "title.class"
                        },
                        keywords: l
                    }, {
                        relevance: 0,
                        match: [h, /\.new[. (]/],
                        scope: {
                            1: "title.class"
                        }
                    }, {
                        relevance: 0,
                        match: /\b[A-Z][A-Z_0-9]+\b/,
                        className: "variable.constant"
                    }, {
                        relevance: 0,
                        match: u,
                        scope: "title.class"
                    }, {
                        match: [/def/, /\s+/, o],
                        scope: {
                            1: "keyword",
                            3: "title.function"
                        },
                        contains: [Z]
                    }, {
                        begin: e.IDENT_RE + "::"
                    }, {
                        className: "symbol",
                        begin: e.UNDERSCORE_IDENT_RE + "(!|\\?)?:",
                        relevance: 0
                    }, {
                        className: "symbol",
                        begin: ":(?!\\s)",
                        contains: [w, {
                            begin: o
                        }],
                        relevance: 0
                    }, P, {
                        className: "variable",
                        begin: "(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])"
                    }, {
                        className: "params",
                        begin: /\|/,
                        end: /\|/,
                        excludeBegin: !0,
                        excludeEnd: !0,
                        relevance: 0,
                        keywords: l
                    }, {
                        begin: "(" + e.RE_STARTERS_RE + "|unless)\\s*",
                        keywords: "unless",
                        contains: [{
                            className: "regexp",
                            contains: [e.BACKSLASH_ESCAPE, v],
                            illegal: /\n/,
                            variants: [{
                                begin: "/",
                                end: "/[a-z]*"
                            }, {
                                begin: /%r\{/,
                                end: /\}[a-z]*/
                            }, {
                                begin: "%r\\(",
                                end: "\\)[a-z]*"
                            }, {
                                begin: "%r!",
                                end: "![a-z]*"
                            }, {
                                begin: "%r\\[",
                                end: "\\][a-z]*"
                            }]
                        }].concat(m, E),
                        relevance: 0
                    }].concat(m, E);
                v.contains = R, Z.contains = R;
                let J = [{
                    begin: /^\s*=>/,
                    starts: {
                        end: "$",
                        contains: R
                    }
                }, {
                    className: "meta.prompt",
                    begin: "^([>?]>|[\\w#]+\\(\\w+\\):\\d+:\\d+[>*]|(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>)(?=[ ])",
                    starts: {
                        end: "$",
                        keywords: l,
                        contains: R
                    }
                }];
                return E.unshift(m), {
                    name: "Ruby",
                    aliases: ["rb", "gemspec", "podspec", "thor", "irb"],
                    keywords: l,
                    illegal: /\/\*/,
                    contains: [e.SHEBANG({
                        binary: "ruby"
                    })].concat(J).concat(E).concat(R)
                }
            },
            grmr_rust: e => {
                let n = e.regex,
                    o = {
                        className: "title.function.invoke",
                        relevance: 0,
                        begin: n.concat(/\b/, /(?!let\b)/, e.IDENT_RE, n.lookahead(/\s*\(/))
                    },
                    u = "([ui](8|16|32|64|128|size)|f(32|64))?",
                    h = ["drop ", "Copy", "Send", "Sized", "Sync", "Drop", "Fn", "FnMut", "FnOnce", "ToOwned", "Clone", "Debug", "PartialEq", "PartialOrd", "Eq", "Ord", "AsRef", "AsMut", "Into", "From", "Default", "Iterator", "Extend", "IntoIterator", "DoubleEndedIterator", "ExactSizeIterator", "SliceConcatExt", "ToString", "assert!", "assert_eq!", "bitflags!", "bytes!", "cfg!", "col!", "concat!", "concat_idents!", "debug_assert!", "debug_assert_eq!", "env!", "panic!", "file!", "format!", "format_args!", "include_bytes!", "include_str!", "line!", "local_data_key!", "module_path!", "option_env!", "print!", "println!", "select!", "stringify!", "try!", "unimplemented!", "unreachable!", "vec!", "write!", "writeln!", "macro_rules!", "assert_ne!", "debug_assert_ne!"],
                    l = ["i8", "i16", "i32", "i64", "i128", "isize", "u8", "u16", "u32", "u64", "u128", "usize", "f32", "f64", "str", "char", "bool", "Box", "Option", "Result", "String", "Vec"];
                return {
                    name: "Rust",
                    aliases: ["rs"],
                    keywords: {
                        $pattern: e.IDENT_RE + "!?",
                        type: l,
                        keyword: ["abstract", "as", "async", "await", "become", "box", "break", "const", "continue", "crate", "do", "dyn", "else", "enum", "extern", "false", "final", "fn", "for", "if", "impl", "in", "let", "loop", "macro", "match", "mod", "move", "mut", "override", "priv", "pub", "ref", "return", "self", "Self", "static", "struct", "super", "trait", "true", "try", "type", "typeof", "unsafe", "unsized", "use", "virtual", "where", "while", "yield"],
                        literal: ["true", "false", "Some", "None", "Ok", "Err"],
                        built_in: h
                    },
                    illegal: "</",
                    contains: [e.C_LINE_COMMENT_MODE, e.COMMENT("/\\*", "\\*/", {
                        contains: ["self"]
                    }), e.inherit(e.QUOTE_STRING_MODE, {
                        begin: /b?"/,
                        illegal: null
                    }), {
                        className: "string",
                        variants: [{
                            begin: /b?r(#*)"(.|\n)*?"\1(?!#)/
                        }, {
                            begin: /b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/
                        }]
                    }, {
                        className: "symbol",
                        begin: /'[a-zA-Z_][a-zA-Z0-9_]*/
                    }, {
                        className: "number",
                        variants: [{
                            begin: "\\b0b([01_]+)" + u
                        }, {
                            begin: "\\b0o([0-7_]+)" + u
                        }, {
                            begin: "\\b0x([A-Fa-f0-9_]+)" + u
                        }, {
                            begin: "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)" + u
                        }],
                        relevance: 0
                    }, {
                        begin: [/fn/, /\s+/, e.UNDERSCORE_IDENT_RE],
                        className: {
                            1: "keyword",
                            3: "title.function"
                        }
                    }, {
                        className: "meta",
                        begin: "#!?\\[",
                        end: "\\]",
                        contains: [{
                            className: "string",
                            begin: /"/,
                            end: /"/
                        }]
                    }, {
                        begin: [/let/, /\s+/, /(?:mut\s+)?/, e.UNDERSCORE_IDENT_RE],
                        className: {
                            1: "keyword",
                            3: "keyword",
                            4: "variable"
                        }
                    }, {
                        begin: [/for/, /\s+/, e.UNDERSCORE_IDENT_RE, /\s+/, /in/],
                        className: {
                            1: "keyword",
                            3: "variable",
                            5: "keyword"
                        }
                    }, {
                        begin: [/type/, /\s+/, e.UNDERSCORE_IDENT_RE],
                        className: {
                            1: "keyword",
                            3: "title.class"
                        }
                    }, {
                        begin: [/(?:trait|enum|struct|union|impl|for)/, /\s+/, e.UNDERSCORE_IDENT_RE],
                        className: {
                            1: "keyword",
                            3: "title.class"
                        }
                    }, {
                        begin: e.IDENT_RE + "::",
                        keywords: {
                            keyword: "Self",
                            built_in: h,
                            type: l
                        }
                    }, {
                        className: "punctuation",
                        begin: "->"
                    }, o]
                }
            },
            grmr_scss: e => {
                let n = x(e),
                    o = T,
                    u = g,
                    h = "@[a-z-]+",
                    l = {
                        className: "variable",
                        begin: "(\\$[a-zA-Z-][a-zA-Z0-9_-]*)\\b",
                        relevance: 0
                    };
                return {
                    name: "SCSS",
                    case_insensitive: !0,
                    illegal: "[=/|']",
                    contains: [e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, n.CSS_NUMBER_MODE, {
                        className: "selector-id",
                        begin: "#[A-Za-z0-9_-]+",
                        relevance: 0
                    }, {
                        className: "selector-class",
                        begin: "\\.[A-Za-z0-9_-]+",
                        relevance: 0
                    }, n.ATTRIBUTE_SELECTOR_MODE, {
                        className: "selector-tag",
                        begin: "\\b(" + A.join("|") + ")\\b",
                        relevance: 0
                    }, {
                        className: "selector-pseudo",
                        begin: ":(" + u.join("|") + ")"
                    }, {
                        className: "selector-pseudo",
                        begin: ":(:)?(" + o.join("|") + ")"
                    }, l, {
                        begin: /\(/,
                        end: /\)/,
                        contains: [n.CSS_NUMBER_MODE]
                    }, n.CSS_VARIABLE, {
                        className: "attribute",
                        begin: "\\b(" + j.join("|") + ")\\b"
                    }, {
                        begin: "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b"
                    }, {
                        begin: /:/,
                        end: /[;}{]/,
                        relevance: 0,
                        contains: [n.BLOCK_COMMENT, l, n.HEXCOLOR, n.CSS_NUMBER_MODE, e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, n.IMPORTANT, n.FUNCTION_DISPATCH]
                    }, {
                        begin: "@(page|font-face)",
                        keywords: {
                            $pattern: h,
                            keyword: "@page @font-face"
                        }
                    }, {
                        begin: "@",
                        end: "[{;]",
                        returnBegin: !0,
                        keywords: {
                            $pattern: /[a-z-]+/,
                            keyword: "and or not only",
                            attribute: B.join(" ")
                        },
                        contains: [{
                            begin: h,
                            className: "keyword"
                        }, {
                            begin: /[a-z-]+(?=:)/,
                            className: "attribute"
                        }, l, e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, n.HEXCOLOR, n.CSS_NUMBER_MODE]
                    }, n.FUNCTION_DISPATCH]
                }
            },
            grmr_shell: e => ({
                name: "Shell Session",
                aliases: ["console", "shellsession"],
                contains: [{
                    className: "meta.prompt",
                    begin: /^\s{0,3}[/~\w\d[\]()@-]*[>%$#][ ]?/,
                    starts: {
                        end: /[^\\](?=\s*$)/,
                        subLanguage: "bash"
                    }
                }]
            }),
            grmr_sql: e => {
                let n = e.regex,
                    o = e.COMMENT("--", "$"),
                    u = ["true", "false", "unknown"],
                    h = ["bigint", "binary", "blob", "boolean", "char", "character", "clob", "date", "dec", "decfloat", "decimal", "float", "int", "integer", "interval", "nchar", "nclob", "national", "numeric", "real", "row", "smallint", "time", "timestamp", "varchar", "varying", "varbinary"],
                    l = ["abs", "acos", "array_agg", "asin", "atan", "avg", "cast", "ceil", "ceiling", "coalesce", "corr", "cos", "cosh", "count", "covar_pop", "covar_samp", "cume_dist", "dense_rank", "deref", "element", "exp", "extract", "first_value", "floor", "json_array", "json_arrayagg", "json_exists", "json_object", "json_objectagg", "json_query", "json_table", "json_table_primitive", "json_value", "lag", "last_value", "lead", "listagg", "ln", "log", "log10", "lower", "max", "min", "mod", "nth_value", "ntile", "nullif", "percent_rank", "percentile_cont", "percentile_disc", "position", "position_regex", "power", "rank", "regr_avgx", "regr_avgy", "regr_count", "regr_intercept", "regr_r2", "regr_slope", "regr_sxx", "regr_sxy", "regr_syy", "row_number", "sin", "sinh", "sqrt", "stddev_pop", "stddev_samp", "substring", "substring_regex", "sum", "tan", "tanh", "translate", "translate_regex", "treat", "trim", "trim_array", "unnest", "upper", "value_of", "var_pop", "var_samp", "width_bucket"],
                    b = ["create table", "insert into", "primary key", "foreign key", "not null", "alter table", "add constraint", "grouping sets", "on overflow", "character set", "respect nulls", "ignore nulls", "nulls first", "nulls last", "depth first", "breadth first"],
                    m = l,
                    E = ["abs", "acos", "all", "allocate", "alter", "and", "any", "are", "array", "array_agg", "array_max_cardinality", "as", "asensitive", "asin", "asymmetric", "at", "atan", "atomic", "authorization", "avg", "begin", "begin_frame", "begin_partition", "between", "bigint", "binary", "blob", "boolean", "both", "by", "call", "called", "cardinality", "cascaded", "case", "cast", "ceil", "ceiling", "char", "char_length", "character", "character_length", "check", "classifier", "clob", "close", "coalesce", "collate", "collect", "column", "commit", "condition", "connect", "constraint", "contains", "convert", "copy", "corr", "corresponding", "cos", "cosh", "count", "covar_pop", "covar_samp", "create", "cross", "cube", "cume_dist", "current", "current_catalog", "current_date", "current_default_transform_group", "current_path", "current_role", "current_row", "current_schema", "current_time", "current_timestamp", "current_path", "current_role", "current_transform_group_for_type", "current_user", "cursor", "cycle", "date", "day", "deallocate", "dec", "decimal", "decfloat", "declare", "default", "define", "delete", "dense_rank", "deref", "describe", "deterministic", "disconnect", "distinct", "double", "drop", "dynamic", "each", "element", "else", "empty", "end", "end_frame", "end_partition", "end-exec", "equals", "escape", "every", "except", "exec", "execute", "exists", "exp", "external", "extract", "false", "fetch", "filter", "first_value", "float", "floor", "for", "foreign", "frame_row", "free", "from", "full", "function", "fusion", "get", "global", "grant", "group", "grouping", "groups", "having", "hold", "hour", "identity", "in", "indicator", "initial", "inner", "inout", "insensitive", "insert", "int", "integer", "intersect", "intersection", "interval", "into", "is", "join", "json_array", "json_arrayagg", "json_exists", "json_object", "json_objectagg", "json_query", "json_table", "json_table_primitive", "json_value", "lag", "language", "large", "last_value", "lateral", "lead", "leading", "left", "like", "like_regex", "listagg", "ln", "local", "localtime", "localtimestamp", "log", "log10", "lower", "match", "match_number", "match_recognize", "matches", "max", "member", "merge", "method", "min", "minute", "mod", "modifies", "module", "month", "multiset", "national", "natural", "nchar", "nclob", "new", "no", "none", "normalize", "not", "nth_value", "ntile", "null", "nullif", "numeric", "octet_length", "occurrences_regex", "of", "offset", "old", "omit", "on", "one", "only", "open", "or", "order", "out", "outer", "over", "overlaps", "overlay", "parameter", "partition", "pattern", "per", "percent", "percent_rank", "percentile_cont", "percentile_disc", "period", "portion", "position", "position_regex", "power", "precedes", "precision", "prepare", "primary", "procedure", "ptf", "range", "rank", "reads", "real", "recursive", "ref", "references", "referencing", "regr_avgx", "regr_avgy", "regr_count", "regr_intercept", "regr_r2", "regr_slope", "regr_sxx", "regr_sxy", "regr_syy", "release", "result", "return", "returns", "revoke", "right", "rollback", "rollup", "row", "row_number", "rows", "running", "savepoint", "scope", "scroll", "search", "second", "seek", "select", "sensitive", "session_user", "set", "show", "similar", "sin", "sinh", "skip", "smallint", "some", "specific", "specifictype", "sql", "sqlexception", "sqlstate", "sqlwarning", "sqrt", "start", "static", "stddev_pop", "stddev_samp", "submultiset", "subset", "substring", "substring_regex", "succeeds", "sum", "symmetric", "system", "system_time", "system_user", "table", "tablesample", "tan", "tanh", "then", "time", "timestamp", "timezone_hour", "timezone_minute", "to", "trailing", "translate", "translate_regex", "translation", "treat", "trigger", "trim", "trim_array", "true", "truncate", "uescape", "union", "unique", "unknown", "unnest", "update", "upper", "user", "using", "value", "values", "value_of", "var_pop", "var_samp", "varbinary", "varchar", "varying", "versioning", "when", "whenever", "where", "width_bucket", "window", "with", "within", "without", "year", "add", "asc", "collation", "desc", "final", "first", "last", "view"].filter(w => !l.includes(w)),
                    v = {
                        begin: n.concat(/\b/, n.either(...m), /\s*\(/),
                        relevance: 0,
                        keywords: {
                            built_in: m
                        }
                    };
                return {
                    name: "SQL",
                    case_insensitive: !0,
                    illegal: /[{}]|<\//,
                    keywords: {
                        $pattern: /\b[\w\.]+/,
                        keyword: ((w, {
                            exceptions: C,
                            when: P
                        } = {}) => {
                            let Z = P;
                            return C = C || [], w.map(R => R.match(/\|\d+$/) || C.includes(R) ? R : Z(R) ? R + "|0" : R)
                        })(E, {
                            when: w => w.length < 3
                        }),
                        literal: u,
                        type: h,
                        built_in: ["current_catalog", "current_date", "current_default_transform_group", "current_path", "current_role", "current_schema", "current_transform_group_for_type", "current_user", "session_user", "system_time", "system_user", "current_time", "localtime", "current_timestamp", "localtimestamp"]
                    },
                    contains: [{
                        begin: n.either(...b),
                        relevance: 0,
                        keywords: {
                            $pattern: /[\w\.]+/,
                            keyword: E.concat(b),
                            literal: u,
                            type: h
                        }
                    }, {
                        className: "type",
                        begin: n.either("double precision", "large object", "with timezone", "without timezone")
                    }, v, {
                        className: "variable",
                        begin: /@[a-z0-9]+/
                    }, {
                        className: "string",
                        variants: [{
                            begin: /'/,
                            end: /'/,
                            contains: [{
                                begin: /''/
                            }]
                        }]
                    }, {
                        begin: /"/,
                        end: /"/,
                        contains: [{
                            begin: /""/
                        }]
                    }, e.C_NUMBER_MODE, e.C_BLOCK_COMMENT_MODE, o, {
                        className: "operator",
                        begin: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
                        relevance: 0
                    }]
                }
            },
            grmr_swift: e => {
                let n = {
                        match: /\s+/,
                        relevance: 0
                    },
                    o = e.COMMENT("/\\*", "\\*/", {
                        contains: ["self"]
                    }),
                    u = [e.C_LINE_COMMENT_MODE, o],
                    h = {
                        match: [/\./, L(...bn, ...It)],
                        className: {
                            2: "keyword"
                        }
                    },
                    l = {
                        match: H(/\./, L(...yt)),
                        relevance: 0
                    },
                    b = yt.filter(G => typeof G == "string").concat(["_|0"]),
                    m = {
                        variants: [{
                            className: "keyword",
                            match: L(...yt.filter(G => typeof G != "string").concat(fn).map(wt), ...It)
                        }]
                    },
                    E = {
                        $pattern: L(/\b\w+/, /#\w+/),
                        keyword: b.concat(En),
                        literal: Rt
                    },
                    v = [h, l, m],
                    w = [{
                        match: H(/\./, L(...Lt)),
                        relevance: 0
                    }, {
                        className: "built_in",
                        match: H(/\b/, L(...Lt), /(?=\()/)
                    }],
                    C = {
                        match: /->/,
                        relevance: 0
                    },
                    P = [C, {
                        className: "operator",
                        relevance: 0,
                        variants: [{
                            match: kt
                        }, {
                            match: `\\.(\\.|${zt})+`
                        }]
                    }],
                    Z = "([0-9a-fA-F]_*)+",
                    R = {
                        className: "number",
                        relevance: 0,
                        variants: [{
                            match: "\\b(([0-9]_*)+)(\\.(([0-9]_*)+))?([eE][+-]?(([0-9]_*)+))?\\b"
                        }, {
                            match: `\\b0x(${Z})(\\.(${Z}))?([pP][+-]?(([0-9]_*)+))?\\b`
                        }, {
                            match: /\b0o([0-7]_*)+\b/
                        }, {
                            match: /\b0b([01]_*)+\b/
                        }]
                    },
                    J = (G = "") => ({
                        className: "subst",
                        variants: [{
                            match: H(/\\/, G, /[0\\tnr"']/)
                        }, {
                            match: H(/\\/, G, /u\{[0-9a-fA-F]{1,8}\}/)
                        }]
                    }),
                    De = (G = "") => ({
                        className: "subst",
                        match: H(/\\/, G, /[\t ]*(?:[\r\n]|\r\n)/)
                    }),
                    we = (G = "") => ({
                        className: "subst",
                        label: "interpol",
                        begin: H(/\\/, G, /\(/),
                        end: /\)/
                    }),
                    de = (G = "") => ({
                        begin: H(G, /"""/),
                        end: H(/"""/, G),
                        contains: [J(G), De(G), we(G)]
                    }),
                    k = (G = "") => ({
                        begin: H(G, /"/),
                        end: H(/"/, G),
                        contains: [J(G), we(G)]
                    }),
                    M = {
                        className: "string",
                        variants: [de(), de("#"), de("##"), de("###"), k(), k("#"), k("##"), k("###")]
                    },
                    q = {
                        match: H(/`/, Ue, /`/)
                    },
                    ne = [q, {
                        className: "variable",
                        match: /\$\d+/
                    }, {
                        className: "variable",
                        match: `\\$${ht}+`
                    }],
                    W = [{
                        match: /(@|#(un)?)available/,
                        className: "keyword",
                        starts: {
                            contains: [{
                                begin: /\(/,
                                end: /\)/,
                                keywords: vn,
                                contains: [...P, R, M]
                            }]
                        }
                    }, {
                        className: "keyword",
                        match: H(/@/, L(...Dn))
                    }, {
                        className: "meta",
                        match: H(/@/, Ue)
                    }],
                    K = {
                        match: X(/\b[A-Z]/),
                        relevance: 0,
                        contains: [{
                            className: "type",
                            match: H(/(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)/, ht, "+")
                        }, {
                            className: "type",
                            match: xt,
                            relevance: 0
                        }, {
                            match: /[?!]+/,
                            relevance: 0
                        }, {
                            match: /\.\.\./,
                            relevance: 0
                        }, {
                            match: H(/\s+&\s+/, X(xt)),
                            relevance: 0
                        }]
                    },
                    Y = {
                        begin: /</,
                        end: />/,
                        keywords: E,
                        contains: [...u, ...v, ...W, C, K]
                    };
                K.contains.push(Y);
                let ce = {
                        begin: /\(/,
                        end: /\)/,
                        relevance: 0,
                        keywords: E,
                        contains: ["self", {
                            match: H(Ue, /\s*:/),
                            keywords: "_|0",
                            relevance: 0
                        }, ...u, ...v, ...w, ...P, R, M, ...ne, ...W, K]
                    },
                    ee = {
                        begin: /</,
                        end: />/,
                        contains: [...u, K]
                    },
                    pe = {
                        begin: /\(/,
                        end: /\)/,
                        keywords: E,
                        contains: [{
                            begin: L(X(H(Ue, /\s*:/)), X(H(Ue, /\s+/, Ue, /\s*:/))),
                            end: /:/,
                            relevance: 0,
                            contains: [{
                                className: "keyword",
                                match: /\b_\b/
                            }, {
                                className: "params",
                                match: Ue
                            }]
                        }, ...u, ...v, ...P, R, M, ...W, K, ce],
                        endsParent: !0,
                        illegal: /["']/
                    },
                    Je = {
                        match: [/func/, /\s+/, L(q.match, Ue, kt)],
                        className: {
                            1: "keyword",
                            3: "title.function"
                        },
                        contains: [ee, pe, n],
                        illegal: [/\[/, /%/]
                    },
                    Ye = {
                        match: [/\b(?:subscript|init[?!]?)/, /\s*(?=[<(])/],
                        className: {
                            1: "keyword"
                        },
                        contains: [ee, pe, n],
                        illegal: /\[|%/
                    },
                    Pe = {
                        match: [/operator/, /\s+/, kt],
                        className: {
                            1: "keyword",
                            3: "title"
                        }
                    },
                    et = {
                        begin: [/precedencegroup/, /\s+/, xt],
                        className: {
                            1: "keyword",
                            3: "title"
                        },
                        contains: [K],
                        keywords: [..._n, ...Rt],
                        end: /}/
                    };
                for (let G of M.variants) {
                    let ot = G.contains.find(z => z.label === "interpol");
                    ot.keywords = E;
                    let lt = [...v, ...w, ...P, R, M, ...ne];
                    ot.contains = [...lt, {
                        begin: /\(/,
                        end: /\)/,
                        contains: ["self", ...lt]
                    }]
                }
                return {
                    name: "Swift",
                    keywords: E,
                    contains: [...u, Je, Ye, {
                        beginKeywords: "struct protocol class extension enum actor",
                        end: "\\{",
                        excludeEnd: !0,
                        keywords: E,
                        contains: [e.inherit(e.TITLE_MODE, {
                            className: "title.class",
                            begin: /[A-Za-z$_][\u00C0-\u02B80-9A-Za-z$_]*/
                        }), ...v]
                    }, Pe, et, {
                        beginKeywords: "import",
                        end: /$/,
                        contains: [...u],
                        relevance: 0
                    }, ...v, ...w, ...P, R, M, ...ne, ...W, K, ce]
                }
            },
            grmr_typescript: e => {
                let n = Tt(e),
                    o = ["any", "void", "number", "boolean", "string", "object", "never", "symbol", "bigint", "unknown"],
                    u = {
                        beginKeywords: "namespace",
                        end: /\{/,
                        excludeEnd: !0,
                        contains: [n.exports.CLASS_REFERENCE]
                    },
                    h = {
                        beginKeywords: "interface",
                        end: /\{/,
                        excludeEnd: !0,
                        keywords: {
                            keyword: "interface extends",
                            built_in: o
                        },
                        contains: [n.exports.CLASS_REFERENCE]
                    },
                    l = {
                        $pattern: Le,
                        keyword: he.concat(["type", "namespace", "interface", "public", "private", "protected", "implements", "declare", "abstract", "readonly", "enum", "override"]),
                        literal: Ke,
                        built_in: Ze.concat(o),
                        "variable.language": Se
                    },
                    b = {
                        className: "meta",
                        begin: "@[A-Za-z$_][0-9A-Za-z$_]*"
                    },
                    m = (E, v, w) => {
                        let C = E.contains.findIndex(P => P.label === v);
                        if (C === -1) throw Error("can not find mode to replace");
                        E.contains.splice(C, 1, w)
                    };
                return Object.assign(n.keywords, l), n.exports.PARAMS_CONTAINS.push(b), n.contains = n.contains.concat([b, u, h]), m(n, "shebang", e.SHEBANG()), m(n, "use_strict", {
                    className: "meta",
                    relevance: 10,
                    begin: /^\s*['"]use strict['"]/
                }), n.contains.find(E => E.label === "func.def").relevance = 0, Object.assign(n, {
                    name: "TypeScript",
                    aliases: ["ts", "tsx"]
                }), n
            },
            grmr_vbnet: e => {
                let n = e.regex,
                    o = /\d{1,2}\/\d{1,2}\/\d{4}/,
                    u = /\d{4}-\d{1,2}-\d{1,2}/,
                    h = /(\d|1[012])(:\d+){0,2} *(AM|PM)/,
                    l = /\d{1,2}(:\d{1,2}){1,2}/,
                    b = {
                        className: "literal",
                        variants: [{
                            begin: n.concat(/# */, n.either(u, o), / *#/)
                        }, {
                            begin: n.concat(/# */, l, / *#/)
                        }, {
                            begin: n.concat(/# */, h, / *#/)
                        }, {
                            begin: n.concat(/# */, n.either(u, o), / +/, n.either(h, l), / *#/)
                        }]
                    },
                    m = e.COMMENT(/'''/, /$/, {
                        contains: [{
                            className: "doctag",
                            begin: /<\/?/,
                            end: />/
                        }]
                    }),
                    E = e.COMMENT(null, /$/, {
                        variants: [{
                            begin: /'/
                        }, {
                            begin: /([\t ]|^)REM(?=\s)/
                        }]
                    });
                return {
                    name: "Visual Basic .NET",
                    aliases: ["vb"],
                    case_insensitive: !0,
                    classNameAliases: {
                        label: "symbol"
                    },
                    keywords: {
                        keyword: "addhandler alias aggregate ansi as async assembly auto binary by byref byval call case catch class compare const continue custom declare default delegate dim distinct do each equals else elseif end enum erase error event exit explicit finally for friend from function get global goto group handles if implements imports in inherits interface into iterator join key let lib loop me mid module mustinherit mustoverride mybase myclass namespace narrowing new next notinheritable notoverridable of off on operator option optional order overloads overridable overrides paramarray partial preserve private property protected public raiseevent readonly redim removehandler resume return select set shadows shared skip static step stop structure strict sub synclock take text then throw to try unicode until using when where while widening with withevents writeonly yield",
                        built_in: "addressof and andalso await directcast gettype getxmlnamespace is isfalse isnot istrue like mod nameof new not or orelse trycast typeof xor cbool cbyte cchar cdate cdbl cdec cint clng cobj csbyte cshort csng cstr cuint culng cushort",
                        type: "boolean byte char date decimal double integer long object sbyte short single string uinteger ulong ushort",
                        literal: "true false nothing"
                    },
                    illegal: "//|\\{|\\}|endif|gosub|variant|wend|^\\$ ",
                    contains: [{
                        className: "string",
                        begin: /"(""|[^/n])"C\b/
                    }, {
                        className: "string",
                        begin: /"/,
                        end: /"/,
                        illegal: /\n/,
                        contains: [{
                            begin: /""/
                        }]
                    }, b, {
                        className: "number",
                        relevance: 0,
                        variants: [{
                            begin: /\b\d[\d_]*((\.[\d_]+(E[+-]?[\d_]+)?)|(E[+-]?[\d_]+))[RFD@!#]?/
                        }, {
                            begin: /\b\d[\d_]*((U?[SIL])|[%&])?/
                        }, {
                            begin: /&H[\dA-F_]+((U?[SIL])|[%&])?/
                        }, {
                            begin: /&O[0-7_]+((U?[SIL])|[%&])?/
                        }, {
                            begin: /&B[01_]+((U?[SIL])|[%&])?/
                        }]
                    }, {
                        className: "label",
                        begin: /^\w+:/
                    }, m, E, {
                        className: "meta",
                        begin: /[\t ]*#(const|disable|else|elseif|enable|end|externalsource|if|region)\b/,
                        end: /$/,
                        keywords: {
                            keyword: "const disable else elseif enable end externalsource if region then"
                        },
                        contains: [E]
                    }]
                }
            },
            grmr_wasm: e => {
                e.regex;
                let n = e.COMMENT(/\(;/, /;\)/);
                return n.contains.push("self"), {
                    name: "WebAssembly",
                    keywords: {
                        $pattern: /[\w.]+/,
                        keyword: ["anyfunc", "block", "br", "br_if", "br_table", "call", "call_indirect", "data", "drop", "elem", "else", "end", "export", "func", "global.get", "global.set", "local.get", "local.set", "local.tee", "get_global", "get_local", "global", "if", "import", "local", "loop", "memory", "memory.grow", "memory.size", "module", "mut", "nop", "offset", "param", "result", "return", "select", "set_global", "set_local", "start", "table", "tee_local", "then", "type", "unreachable"]
                    },
                    contains: [e.COMMENT(/;;/, /$/), n, {
                        match: [/(?:offset|align)/, /\s*/, /=/],
                        className: {
                            1: "keyword",
                            3: "operator"
                        }
                    }, {
                        className: "variable",
                        begin: /\$[\w_]+/
                    }, {
                        match: /(\((?!;)|\))+/,
                        className: "punctuation",
                        relevance: 0
                    }, {
                        begin: [/(?:func|call|call_indirect)/, /\s+/, /\$[^\s)]+/],
                        className: {
                            1: "keyword",
                            3: "title.function"
                        }
                    }, e.QUOTE_STRING_MODE, {
                        match: /(i32|i64|f32|f64)(?!\.)/,
                        className: "type"
                    }, {
                        className: "keyword",
                        match: /\b(f32|f64|i32|i64)(?:\.(?:abs|add|and|ceil|clz|const|convert_[su]\/i(?:32|64)|copysign|ctz|demote\/f64|div(?:_[su])?|eqz?|extend_[su]\/i32|floor|ge(?:_[su])?|gt(?:_[su])?|le(?:_[su])?|load(?:(?:8|16|32)_[su])?|lt(?:_[su])?|max|min|mul|nearest|neg?|or|popcnt|promote\/f32|reinterpret\/[fi](?:32|64)|rem_[su]|rot[lr]|shl|shr_[su]|store(?:8|16|32)?|sqrt|sub|trunc(?:_[su]\/f(?:32|64))?|wrap\/i64|xor))\b/
                    }, {
                        className: "number",
                        relevance: 0,
                        match: /[+-]?\b(?:\d(?:_?\d)*(?:\.\d(?:_?\d)*)?(?:[eE][+-]?\d(?:_?\d)*)?|0x[\da-fA-F](?:_?[\da-fA-F])*(?:\.[\da-fA-F](?:_?[\da-fA-D])*)?(?:[pP][+-]?\d(?:_?\d)*)?)\b|\binf\b|\bnan(?::0x[\da-fA-F](?:_?[\da-fA-D])*)?\b/
                    }]
                }
            },
            grmr_yaml: e => {
                let n = "true false yes no null",
                    o = "[\\w#;/?:@&=+$,.~*'()[\\]]+",
                    u = {
                        className: "string",
                        relevance: 0,
                        variants: [{
                            begin: /'/,
                            end: /'/
                        }, {
                            begin: /"/,
                            end: /"/
                        }, {
                            begin: /\S+/
                        }],
                        contains: [e.BACKSLASH_ESCAPE, {
                            className: "template-variable",
                            variants: [{
                                begin: /\{\{/,
                                end: /\}\}/
                            }, {
                                begin: /%\{/,
                                end: /\}/
                            }]
                        }]
                    },
                    h = e.inherit(u, {
                        variants: [{
                            begin: /'/,
                            end: /'/
                        }, {
                            begin: /"/,
                            end: /"/
                        }, {
                            begin: /[^\s,{}[\]]+/
                        }]
                    }),
                    l = {
                        end: ",",
                        endsWithParent: !0,
                        excludeEnd: !0,
                        keywords: n,
                        relevance: 0
                    },
                    b = {
                        begin: /\{/,
                        end: /\}/,
                        contains: [l],
                        illegal: "\\n",
                        relevance: 0
                    },
                    m = {
                        begin: "\\[",
                        end: "\\]",
                        contains: [l],
                        illegal: "\\n",
                        relevance: 0
                    },
                    E = [{
                        className: "attr",
                        variants: [{
                            begin: "\\w[\\w :\\/.-]*:(?=[ 	]|$)"
                        }, {
                            begin: '"\\w[\\w :\\/.-]*":(?=[ 	]|$)'
                        }, {
                            begin: "'\\w[\\w :\\/.-]*':(?=[ 	]|$)"
                        }]
                    }, {
                        className: "meta",
                        begin: "^---\\s*$",
                        relevance: 10
                    }, {
                        className: "string",
                        begin: "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"
                    }, {
                        begin: "<%[%=-]?",
                        end: "[%-]?%>",
                        subLanguage: "ruby",
                        excludeBegin: !0,
                        excludeEnd: !0,
                        relevance: 0
                    }, {
                        className: "type",
                        begin: "!\\w+!" + o
                    }, {
                        className: "type",
                        begin: "!<" + o + ">"
                    }, {
                        className: "type",
                        begin: "!" + o
                    }, {
                        className: "type",
                        begin: "!!" + o
                    }, {
                        className: "meta",
                        begin: "&" + e.UNDERSCORE_IDENT_RE + "$"
                    }, {
                        className: "meta",
                        begin: "\\*" + e.UNDERSCORE_IDENT_RE + "$"
                    }, {
                        className: "bullet",
                        begin: "-(?=[ ]|$)",
                        relevance: 0
                    }, e.HASH_COMMENT_MODE, {
                        beginKeywords: n,
                        keywords: {
                            literal: n
                        }
                    }, {
                        className: "number",
                        begin: "\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\.[0-9]*)?([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\b"
                    }, {
                        className: "number",
                        begin: e.C_NUMBER_RE + "\\b",
                        relevance: 0
                    }, b, m, u],
                    v = [...E];
                return v.pop(), v.push(h), l.contains = v, {
                    name: "YAML",
                    case_insensitive: !0,
                    aliases: ["yml"],
                    contains: E
                }
            }
        });
        let Pt = _;
        for (let e of Object.keys(Ut)) {
            let n = e.replace("grmr_", "").replace("_", "-");
            Pt.registerLanguage(n, Ut[e])
        }
        return Pt
    }();
    typeof Gt == "object" && typeof St < "u" && (St.exports = Nn)
});
var Vt = Kt((_t, Wt) => {
    (function(D, V) {
        typeof _t == "object" && typeof Wt < "u" ? V(_t) : typeof define == "function" && define.amd ? define(["exports"], V) : V((D = typeof globalThis < "u" ? globalThis : D || self).marked = {})
    })(_t, function(D) {
        "use strict";

        function V(p, c) {
            for (var a = 0; a < c.length; a++) {
                var s = c[a];
                s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(p, function(t) {
                    return t = function(i, r) {
                        if (typeof i != "object" || i === null) return i;
                        var _ = i[Symbol.toPrimitive];
                        if (_ === void 0) return (r === "string" ? String : Number)(i);
                        if (_ = _.call(i, r || "default"), typeof _ != "object") return _;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }(t, "string"), typeof t == "symbol" ? t : String(t)
                }(s.key), s)
            }
        }

        function ge(p, c) {
            (c == null || c > p.length) && (c = p.length);
            for (var a = 0, s = new Array(c); a < c; a++) s[a] = p[a];
            return s
        }

        function xe(p, c) {
            var a, s = typeof Symbol < "u" && p[Symbol.iterator] || p["@@iterator"];
            if (s) return (s = s.call(p)).next.bind(s);
            if (Array.isArray(p) || (s = function(t, i) {
                    var r;
                    if (t) return typeof t == "string" ? ge(t, i) : (r = (r = Object.prototype.toString.call(t).slice(8, -1)) === "Object" && t.constructor ? t.constructor.name : r) === "Map" || r === "Set" ? Array.from(t) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? ge(t, i) : void 0
                }(p)) || c && p && typeof p.length == "number") return s && (p = s), a = 0,
                function() {
                    return a >= p.length ? {
                        done: !0
                    } : {
                        done: !1,
                        value: p[a++]
                    }
                };
            throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)
        }

        function ue() {
            return {
                async: !1,
                baseUrl: null,
                breaks: !1,
                extensions: null,
                gfm: !0,
                headerIds: !0,
                headerPrefix: "",
                highlight: null,
                langPrefix: "language-",
                mangle: !0,
                pedantic: !1,
                renderer: null,
                sanitize: !1,
                sanitizer: null,
                silent: !1,
                smartypants: !1,
                tokenizer: null,
                walkTokens: null,
                xhtml: !1
            }
        }
        D.defaults = ue();

        function Qe(p) {
            return Be[p]
        }
        var nt = /[&<>"']/,
            We = new RegExp(nt.source, "g"),
            Ae = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
            ct = new RegExp(Ae.source, "g"),
            Be = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

        function X(p, c) {
            if (c) {
                if (nt.test(p)) return p.replace(We, Qe)
            } else if (Ae.test(p)) return p.replace(ct, Qe);
            return p
        }
        var at = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;

        function st(p) {
            return p.replace(at, function(c, a) {
                return (a = a.toLowerCase()) === "colon" ? ":" : a.charAt(0) === "#" ? a.charAt(1) === "x" ? String.fromCharCode(parseInt(a.substring(2), 16)) : String.fromCharCode(+a.substring(1)) : ""
            })
        }
        var H = /(^|[^\[])\^/g;

        function L(p, c) {
            p = typeof p == "string" ? p : p.source, c = c || "";
            var a = {
                replace: function(s, t) {
                    return t = (t = t.source || t).replace(H, "$1"), p = p.replace(s, t), a
                },
                getRegex: function() {
                    return new RegExp(p, c)
                }
            };
            return a
        }
        var Ve = /[^\w:]/g,
            Xe = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

        function f(p, c, a) {
            if (p) {
                try {
                    s = decodeURIComponent(st(a)).replace(Ve, "").toLowerCase()
                } catch {
                    return null
                }
                if (s.indexOf("javascript:") === 0 || s.indexOf("vbscript:") === 0 || s.indexOf("data:") === 0) return null
            }
            var s;
            c && !Xe.test(a) && (p = a, d[" " + (s = c)] || (O.test(s) ? d[" " + s] = s + "/" : d[" " + s] = Oe(s, "/", !0)), c = (s = d[" " + s]).indexOf(":") === -1, a = p.substring(0, 2) === "//" ? c ? p : s.replace(oe, "$1") + p : p.charAt(0) === "/" ? c ? p : s.replace(ye, "$1") + p : s + p);
            try {
                a = encodeURI(a).replace(/%25/g, "%")
            } catch {
                return null
            }
            return a
        }
        var d = {},
            O = /^[^:]+:\/*[^/]*$/,
            oe = /^([^:]+:)[\s\S]*$/,
            ye = /^([^:]+:\/*[^/]*)[\s\S]*$/,
            ze = {
                exec: function() {}
            };

        function se(p) {
            for (var c, a, s = 1; s < arguments.length; s++)
                for (a in c = arguments[s]) Object.prototype.hasOwnProperty.call(c, a) && (p[a] = c[a]);
            return p
        }

        function fe(p, c) {
            var a = p.replace(/\|/g, function(t, i, r) {
                    for (var _ = !1, x = i; 0 <= --x && r[x] === "\\";) _ = !_;
                    return _ ? "|" : " |"
                }).split(/ \|/),
                s = 0;
            if (a[0].trim() || a.shift(), 0 < a.length && !a[a.length - 1].trim() && a.pop(), a.length > c) a.splice(c);
            else
                for (; a.length < c;) a.push("");
            for (; s < a.length; s++) a[s] = a[s].trim().replace(/\\\|/g, "|");
            return a
        }

        function Oe(p, c, a) {
            var s = p.length;
            if (s === 0) return "";
            for (var t = 0; t < s;) {
                var i = p.charAt(s - t - 1);
                if ((i !== c || a) && (i === c || !a)) break;
                t++
            }
            return p.slice(0, s - t)
        }

        function Te(p) {
            p && p.sanitize && !p.silent && console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options")
        }

        function Fe(p, c) {
            if (c < 1) return "";
            for (var a = ""; 1 < c;) 1 & c && (a += p), c >>= 1, p += p;
            return a + p
        }

        function it(p, i, a, s) {
            var t = i.href,
                i = i.title ? X(i.title) : null,
                r = p[1].replace(/\\([\[\]])/g, "$1");
            return p[0].charAt(0) !== "!" ? (s.state.inLink = !0, p = {
                type: "link",
                raw: a,
                href: t,
                title: i,
                text: r,
                tokens: s.inlineTokens(r)
            }, s.state.inLink = !1, p) : {
                type: "image",
                raw: a,
                href: t,
                title: i,
                text: X(r)
            }
        }
        var $e = function() {
                function p(a) {
                    this.options = a || D.defaults
                }
                var c = p.prototype;
                return c.space = function(a) {
                    if (a = this.rules.block.newline.exec(a), a && 0 < a[0].length) return {
                        type: "space",
                        raw: a[0]
                    }
                }, c.code = function(t) {
                    var s, t = this.rules.block.code.exec(t);
                    if (t) return s = t[0].replace(/^ {1,4}/gm, ""), {
                        type: "code",
                        raw: t[0],
                        codeBlockStyle: "indented",
                        text: this.options.pedantic ? s : Oe(s, `
`)
                    }
                }, c.fences = function(_) {
                    var s, t, i, r, _ = this.rules.block.fences.exec(_);
                    if (_) return s = _[0], t = s, i = _[3] || "", t = (t = s.match(/^(\s+)(?:```)/)) === null ? i : (r = t[1], i.split(`
`).map(function(x) {
                        var A = x.match(/^\s+/);
                        return A !== null && A[0].length >= r.length ? x.slice(r.length) : x
                    }).join(`
`)), {
                        type: "code",
                        raw: s,
                        lang: _[2] && _[2].trim().replace(this.rules.inline._escapes, "$1"),
                        text: t
                    }
                }, c.heading = function(i) {
                    var s, t, i = this.rules.block.heading.exec(i);
                    if (i) return s = i[2].trim(), /#$/.test(s) && (t = Oe(s, "#"), !this.options.pedantic && t && !/ $/.test(t) || (s = t.trim())), {
                        type: "heading",
                        raw: i[0],
                        depth: i[1].length,
                        text: s,
                        tokens: this.lexer.inline(s)
                    }
                }, c.hr = function(a) {
                    if (a = this.rules.block.hr.exec(a), a) return {
                        type: "hr",
                        raw: a[0]
                    }
                }, c.blockquote = function(r) {
                    var s, t, i, r = this.rules.block.blockquote.exec(r);
                    if (r) return s = r[0].replace(/^ *>[ \t]?/gm, ""), t = this.lexer.state.top, this.lexer.state.top = !0, i = this.lexer.blockTokens(s), this.lexer.state.top = t, {
                        type: "blockquote",
                        raw: r[0],
                        tokens: i,
                        text: s
                    }
                }, c.list = function(a) {
                    var s = this.rules.block.list.exec(a);
                    if (s) {
                        var t, i, r, _, x, A, B, g, T, j, Q, U = 1 < (Ee = s[1].trim()).length,
                            I = {
                                type: "list",
                                raw: "",
                                ordered: U,
                                start: U ? +Ee.slice(0, -1) : "",
                                loose: !1,
                                items: []
                            },
                            Ee = U ? "\\d{1,9}\\" + Ee.slice(-1) : "\\" + Ee;
                        this.options.pedantic && (Ee = U ? Ee : "[*+-]");
                        for (var ke = new RegExp("^( {0,3}" + Ee + ")((?:[	 ][^\\n]*)?(?:\\n|$))"); a && (Q = !1, s = ke.exec(a)) && !this.rules.block.hr.test(a);) {
                            if (t = s[0], a = a.substring(t.length), B = s[2].split(`
`, 1)[0].replace(/^\t+/, function(Ze) {
                                    return " ".repeat(3 * Ze.length)
                                }), g = a.split(`
`, 1)[0], this.options.pedantic ? (_ = 2, j = B.trimLeft()) : (_ = s[2].search(/[^ ]/), j = B.slice(_ = 4 < _ ? 1 : _), _ += s[1].length), x = !1, !B && /^ *$/.test(g) && (t += g + `
`, a = a.substring(g.length + 1), Q = !0), !Q)
                                for (var Le = new RegExp("^ {0," + Math.min(3, _ - 1) + "}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))"), he = new RegExp("^ {0," + Math.min(3, _ - 1) + "}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)"), Ke = new RegExp("^ {0," + Math.min(3, _ - 1) + "}(?:```|~~~)"), Ce = new RegExp("^ {0," + Math.min(3, _ - 1) + "}#"); a && (g = T = a.split(`
`, 1)[0], this.options.pedantic && (g = g.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ")), !Ke.test(g)) && !Ce.test(g) && !Le.test(g) && !he.test(a);) {
                                    if (g.search(/[^ ]/) >= _ || !g.trim()) j += `
` + g.slice(_);
                                    else {
                                        if (x || 4 <= B.search(/[^ ]/) || Ke.test(B) || Ce.test(B) || he.test(B)) break;
                                        j += `
` + g
                                    }
                                    x || g.trim() || (x = !0), t += T + `
`, a = a.substring(T.length + 1), B = g.slice(_)
                                }
                            I.loose || (A ? I.loose = !0 : /\n *\n *$/.test(t) && (A = !0)), this.options.gfm && (i = /^\[[ xX]\] /.exec(j)) && (r = i[0] !== "[ ] ", j = j.replace(/^\[[ xX]\] +/, "")), I.items.push({
                                type: "list_item",
                                raw: t,
                                task: !!i,
                                checked: r,
                                loose: !1,
                                text: j
                            }), I.raw += t
                        }
                        I.items[I.items.length - 1].raw = t.trimRight(), I.items[I.items.length - 1].text = j.trimRight(), I.raw = I.raw.trimRight();
                        for (var Ne, dt = I.items.length, Se = 0; Se < dt; Se++) this.lexer.state.top = !1, I.items[Se].tokens = this.lexer.blockTokens(I.items[Se].text, []), I.loose || (Ne = 0 < (Ne = I.items[Se].tokens.filter(function(Ze) {
                            return Ze.type === "space"
                        })).length && Ne.some(function(Ze) {
                            return /\n.*\n/.test(Ze.raw)
                        }), I.loose = Ne);
                        if (I.loose)
                            for (Se = 0; Se < dt; Se++) I.items[Se].loose = !0;
                        return I
                    }
                }, c.html = function(t) {
                    var s, t = this.rules.block.html.exec(t);
                    if (t) return s = {
                        type: "html",
                        raw: t[0],
                        pre: !this.options.sanitizer && (t[1] === "pre" || t[1] === "script" || t[1] === "style"),
                        text: t[0]
                    }, this.options.sanitize && (t = this.options.sanitizer ? this.options.sanitizer(t[0]) : X(t[0]), s.type = "paragraph", s.text = t, s.tokens = this.lexer.inline(t)), s
                }, c.def = function(r) {
                    var s, t, i, r = this.rules.block.def.exec(r);
                    if (r) return s = r[1].toLowerCase().replace(/\s+/g, " "), t = r[2] ? r[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline._escapes, "$1") : "", i = r[3] && r[3].substring(1, r[3].length - 1).replace(this.rules.inline._escapes, "$1"), {
                        type: "def",
                        tag: s,
                        raw: r[0],
                        href: t,
                        title: i
                    }
                }, c.table = function(a) {
                    if (a = this.rules.block.table.exec(a), a) {
                        var s = {
                            type: "table",
                            header: fe(a[1]).map(function(A) {
                                return {
                                    text: A
                                }
                            }),
                            align: a[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
                            rows: a[3] && a[3].trim() ? a[3].replace(/\n[ \t]*$/, "").split(`
`) : []
                        };
                        if (s.header.length === s.align.length) {
                            s.raw = a[0];
                            for (var t, i, r, _ = s.align.length, x = 0; x < _; x++) /^ *-+: *$/.test(s.align[x]) ? s.align[x] = "right" : /^ *:-+: *$/.test(s.align[x]) ? s.align[x] = "center" : /^ *:-+ *$/.test(s.align[x]) ? s.align[x] = "left" : s.align[x] = null;
                            for (_ = s.rows.length, x = 0; x < _; x++) s.rows[x] = fe(s.rows[x], s.header.length).map(function(A) {
                                return {
                                    text: A
                                }
                            });
                            for (_ = s.header.length, t = 0; t < _; t++) s.header[t].tokens = this.lexer.inline(s.header[t].text);
                            for (_ = s.rows.length, t = 0; t < _; t++)
                                for (r = s.rows[t], i = 0; i < r.length; i++) r[i].tokens = this.lexer.inline(r[i].text);
                            return s
                        }
                    }
                }, c.lheading = function(a) {
                    if (a = this.rules.block.lheading.exec(a), a) return {
                        type: "heading",
                        raw: a[0],
                        depth: a[2].charAt(0) === "=" ? 1 : 2,
                        text: a[1],
                        tokens: this.lexer.inline(a[1])
                    }
                }, c.paragraph = function(t) {
                    var s, t = this.rules.block.paragraph.exec(t);
                    if (t) return s = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1], {
                        type: "paragraph",
                        raw: t[0],
                        text: s,
                        tokens: this.lexer.inline(s)
                    }
                }, c.text = function(a) {
                    if (a = this.rules.block.text.exec(a), a) return {
                        type: "text",
                        raw: a[0],
                        text: a[0],
                        tokens: this.lexer.inline(a[0])
                    }
                }, c.escape = function(a) {
                    if (a = this.rules.inline.escape.exec(a), a) return {
                        type: "escape",
                        raw: a[0],
                        text: X(a[1])
                    }
                }, c.tag = function(a) {
                    if (a = this.rules.inline.tag.exec(a), a) return !this.lexer.state.inLink && /^<a /i.test(a[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && /^<\/a>/i.test(a[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(a[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(a[0]) && (this.lexer.state.inRawBlock = !1), {
                        type: this.options.sanitize ? "text" : "html",
                        raw: a[0],
                        inLink: this.lexer.state.inLink,
                        inRawBlock: this.lexer.state.inRawBlock,
                        text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(a[0]) : X(a[0]) : a[0]
                    }
                }, c.link = function(a) {
                    if (a = this.rules.inline.link.exec(a), a) {
                        var s = a[2].trim();
                        if (!this.options.pedantic && /^</.test(s)) {
                            if (!/>$/.test(s)) return;
                            var i = Oe(s.slice(0, -1), "\\");
                            if ((s.length - i.length) % 2 == 0) return
                        } else i = function(_, x) {
                            if (_.indexOf(x[1]) !== -1) {
                                for (var A = _.length, B = 0, g = 0; g < A; g++)
                                    if (_[g] === "\\") g++;
                                    else if (_[g] === x[0]) B++;
                                else if (_[g] === x[1] && --B < 0) return g
                            }
                            return -1
                        }(a[2], "()"), -1 < i && (r = (a[0].indexOf("!") === 0 ? 5 : 4) + a[1].length + i, a[2] = a[2].substring(0, i), a[0] = a[0].substring(0, r).trim(), a[3] = "");
                        var t, i = a[2],
                            r = "";
                        return this.options.pedantic ? (t = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(i)) && (i = t[1], r = t[3]) : r = a[3] ? a[3].slice(1, -1) : "", i = i.trim(), it(a, {
                            href: (i = /^</.test(i) ? this.options.pedantic && !/>$/.test(s) ? i.slice(1) : i.slice(1, -1) : i) && i.replace(this.rules.inline._escapes, "$1"),
                            title: r && r.replace(this.rules.inline._escapes, "$1")
                        }, a[0], this.lexer)
                    }
                }, c.reflink = function(a, s) {
                    var t;
                    if (t = (t = this.rules.inline.reflink.exec(a)) || this.rules.inline.nolink.exec(a)) return (a = s[(a = (t[2] || t[1]).replace(/\s+/g, " ")).toLowerCase()]) ? it(t, a, t[0], this.lexer) : {
                        type: "text",
                        raw: s = t[0].charAt(0),
                        text: s
                    }
                }, c.emStrong = function(a, s, t) {
                    t === void 0 && (t = "");
                    var i = this.rules.inline.emStrong.lDelim.exec(a);
                    if (i && (!i[3] || !t.match(/(?:[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0966-\u096F\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09F9\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AE6-\u0AEF\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B71-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0BE6-\u0BF2\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C66-\u0C6F\u0C78-\u0C7E\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D58-\u0D61\u0D66-\u0D78\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DE6-\u0DEF\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F20-\u0F33\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F-\u1049\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1090-\u1099\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A20-\u1A54\u1A80-\u1A89\u1A90-\u1A99\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B50-\u1B59\u1B83-\u1BA0\u1BAE-\u1BE5\u1C00-\u1C23\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA830-\uA835\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uA9E0-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDE80-\uDE9C\uDEA0-\uDED0\uDEE1-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE40-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE4\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD23\uDD30-\uDD39\uDE60-\uDE7E\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF27\uDF30-\uDF45\uDF51-\uDF54\uDF70-\uDF81\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC52-\uDC6F\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD03-\uDD26\uDD36-\uDD3F\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDD0-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDEF0-\uDEF9\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC50-\uDC59\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE50-\uDE59\uDE80-\uDEAA\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF30-\uDF3B\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF2\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDE70-\uDEBE\uDEC0-\uDEC9\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE96\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD834[\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD40-\uDD49\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB\uDEF0-\uDEF9]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF\uDD00-\uDD43\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/))) {
                        var r = i[1] || i[2] || "";
                        if (!r || t === "" || this.rules.inline.punctuation.exec(t)) {
                            var _ = i[0].length - 1,
                                x = _,
                                A = 0,
                                B = i[0][0] === "*" ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
                            for (B.lastIndex = 0, s = s.slice(-1 * a.length + _);
                                (i = B.exec(s)) != null;) {
                                var g, T = i[1] || i[2] || i[3] || i[4] || i[5] || i[6];
                                if (T) {
                                    if (g = T.length, i[3] || i[4]) x += g;
                                    else if ((i[5] || i[6]) && _ % 3 && !((_ + g) % 3)) A += g;
                                    else if (!(0 < (x -= g))) return g = Math.min(g, g + x + A), T = a.slice(0, _ + i.index + (i[0].length - T.length) + g), Math.min(_, g) % 2 ? (g = T.slice(1, -1), {
                                        type: "em",
                                        raw: T,
                                        text: g,
                                        tokens: this.lexer.inlineTokens(g)
                                    }) : (g = T.slice(2, -2), {
                                        type: "strong",
                                        raw: T,
                                        text: g,
                                        tokens: this.lexer.inlineTokens(g)
                                    })
                                }
                            }
                        }
                    }
                }, c.codespan = function(r) {
                    var s, t, i, r = this.rules.inline.code.exec(r);
                    if (r) return i = r[2].replace(/\n/g, " "), s = /[^ ]/.test(i), t = /^ /.test(i) && / $/.test(i), i = X(i = s && t ? i.substring(1, i.length - 1) : i, !0), {
                        type: "codespan",
                        raw: r[0],
                        text: i
                    }
                }, c.br = function(a) {
                    if (a = this.rules.inline.br.exec(a), a) return {
                        type: "br",
                        raw: a[0]
                    }
                }, c.del = function(a) {
                    if (a = this.rules.inline.del.exec(a), a) return {
                        type: "del",
                        raw: a[0],
                        text: a[2],
                        tokens: this.lexer.inlineTokens(a[2])
                    }
                }, c.autolink = function(i, s) {
                    var t, i = this.rules.inline.autolink.exec(i);
                    if (i) return s = i[2] === "@" ? "mailto:" + (t = X(this.options.mangle ? s(i[1]) : i[1])) : t = X(i[1]), {
                        type: "link",
                        raw: i[0],
                        text: t,
                        href: s,
                        tokens: [{
                            type: "text",
                            raw: t,
                            text: t
                        }]
                    }
                }, c.url = function(a, s) {
                    var t, i, r, _;
                    if (t = this.rules.inline.url.exec(a)) {
                        if (t[2] === "@") r = "mailto:" + (i = X(this.options.mangle ? s(t[0]) : t[0]));
                        else {
                            for (; _ = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])[0], _ !== t[0];);
                            i = X(t[0]), r = t[1] === "www." ? "http://" + t[0] : t[0]
                        }
                        return {
                            type: "link",
                            raw: t[0],
                            text: i,
                            href: r,
                            tokens: [{
                                type: "text",
                                raw: i,
                                text: i
                            }]
                        }
                    }
                }, c.inlineText = function(a, s) {
                    if (a = this.rules.inline.text.exec(a), a) return s = this.lexer.state.inRawBlock ? this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(a[0]) : X(a[0]) : a[0] : X(this.options.smartypants ? s(a[0]) : a[0]), {
                        type: "text",
                        raw: a[0],
                        text: s
                    }
                }, p
            }(),
            F = {
                newline: /^(?: *(?:\n|$))+/,
                code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
                fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
                hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
                heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
                blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
                list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,
                html: "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",
                def: /^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,
                table: ze,
                lheading: /^((?:.|\n(?!\n))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
                _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
                text: /^[^\n]+/,
                _label: /(?!\s*\])(?:\\.|[^\[\]\\])+/,
                _title: /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/
            },
            y = (F.def = L(F.def).replace("label", F._label).replace("title", F._title).getRegex(), F.bullet = /(?:[*+-]|\d{1,9}[.)])/, F.listItemStart = L(/^( *)(bull) */).replace("bull", F.bullet).getRegex(), F.list = L(F.list).replace(/bull/g, F.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + F.def.source + ")").getRegex(), F._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", F._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/, F.html = L(F.html, "i").replace("comment", F._comment).replace("tag", F._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), F.paragraph = L(F._paragraph).replace("hr", F.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", F._tag).getRegex(), F.blockquote = L(F.blockquote).replace("paragraph", F.paragraph).getRegex(), F.normal = se({}, F), F.gfm = se({}, F.normal, {
                table: "^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
            }), F.gfm.table = L(F.gfm.table).replace("hr", F.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", F._tag).getRegex(), F.gfm.paragraph = L(F._paragraph).replace("hr", F.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("table", F.gfm.table).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", F._tag).getRegex(), F.pedantic = se({}, F.normal, {
                html: L(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", F._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
                def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
                heading: /^(#{1,6})(.*)(?:\n+|$)/,
                fences: ze,
                lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
                paragraph: L(F.normal._paragraph).replace("hr", F.hr).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", F.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex()
            }), {
                escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
                autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
                url: ze,
                tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
                link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
                reflink: /^!?\[(label)\]\[(ref)\]/,
                nolink: /^!?\[(ref)\](?:\[\])?/,
                reflinkSearch: "reflink|nolink(?!\\()",
                emStrong: {
                    lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
                    rDelimAst: /^(?:[^_*\\]|\\.)*?\_\_(?:[^_*\\]|\\.)*?\*(?:[^_*\\]|\\.)*?(?=\_\_)|(?:[^*\\]|\\.)+(?=[^*])|[punct_](\*+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|(?:[^punct*_\s\\]|\\.)(\*+)(?=[^punct*_\s])/,
                    rDelimUnd: /^(?:[^_*\\]|\\.)*?\*\*(?:[^_*\\]|\\.)*?\_(?:[^_*\\]|\\.)*?(?=\*\*)|(?:[^_\\]|\\.)+(?=[^_])|[punct*](\_+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/
                },
                code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
                br: /^( {2,}|\\)\n(?!\s*$)/,
                del: ze,
                text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
                punctuation: /^([\spunctuation])/
            });

        function ut(p) {
            return p.replace(/---/g, "\u2014").replace(/--/g, "\u2013").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018").replace(/'/g, "\u2019").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C").replace(/"/g, "\u201D").replace(/\.{3}/g, "\u2026")
        }

        function le(p) {
            for (var c, a = "", s = p.length, t = 0; t < s; t++) c = p.charCodeAt(t), a += "&#" + (c = .5 < Math.random() ? "x" + c.toString(16) : c) + ";";
            return a
        }
        y._punctuation = "!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~", y.punctuation = L(y.punctuation).replace(/punctuation/g, y._punctuation).getRegex(), y.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g, y.escapedEmSt = /(?:^|[^\\])(?:\\\\)*\\[*_]/g, y._comment = L(F._comment).replace("(?:-->|$)", "-->").getRegex(), y.emStrong.lDelim = L(y.emStrong.lDelim).replace(/punct/g, y._punctuation).getRegex(), y.emStrong.rDelimAst = L(y.emStrong.rDelimAst, "g").replace(/punct/g, y._punctuation).getRegex(), y.emStrong.rDelimUnd = L(y.emStrong.rDelimUnd, "g").replace(/punct/g, y._punctuation).getRegex(), y._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g, y._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/, y._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/, y.autolink = L(y.autolink).replace("scheme", y._scheme).replace("email", y._email).getRegex(), y._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/, y.tag = L(y.tag).replace("comment", y._comment).replace("attribute", y._attribute).getRegex(), y._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, y._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/, y._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/, y.link = L(y.link).replace("label", y._label).replace("href", y._href).replace("title", y._title).getRegex(), y.reflink = L(y.reflink).replace("label", y._label).replace("ref", F._label).getRegex(), y.nolink = L(y.nolink).replace("ref", F._label).getRegex(), y.reflinkSearch = L(y.reflinkSearch, "g").replace("reflink", y.reflink).replace("nolink", y.nolink).getRegex(), y.normal = se({}, y), y.pedantic = se({}, y.normal, {
            strong: {
                start: /^__|\*\*/,
                middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
                endAst: /\*\*(?!\*)/g,
                endUnd: /__(?!_)/g
            },
            em: {
                start: /^_|\*/,
                middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
                endAst: /\*(?!\*)/g,
                endUnd: /_(?!_)/g
            },
            link: L(/^!?\[(label)\]\((.*?)\)/).replace("label", y._label).getRegex(),
            reflink: L(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", y._label).getRegex()
        }), y.gfm = se({}, y.normal, {
            escape: L(y.escape).replace("])", "~|])").getRegex(),
            _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
            url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
            _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
            del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
            text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
        }), y.gfm.url = L(y.gfm.url, "i").replace("email", y.gfm._extended_email).getRegex(), y.breaks = se({}, y.gfm, {
            br: L(y.br).replace("{2,}", "*").getRegex(),
            text: L(y.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
        });
        var _e = function() {
                function p(t) {
                    this.tokens = [], this.tokens.links = Object.create(null), this.options = t || D.defaults, this.options.tokenizer = this.options.tokenizer || new $e, this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, (this.tokenizer.lexer = this).inlineQueue = [], this.state = {
                        inLink: !1,
                        inRawBlock: !1,
                        top: !0
                    }, t = {
                        block: F.normal,
                        inline: y.normal
                    }, this.options.pedantic ? (t.block = F.pedantic, t.inline = y.pedantic) : this.options.gfm && (t.block = F.gfm, this.options.breaks ? t.inline = y.breaks : t.inline = y.gfm), this.tokenizer.rules = t
                }
                p.lex = function(t, i) {
                    return new p(i).lex(t)
                }, p.lexInline = function(t, i) {
                    return new p(i).inlineTokens(t)
                };
                var c, a, s = p.prototype;
                return s.lex = function(t) {
                    var i;
                    for (t = t.replace(/\r\n|\r/g, `
`), this.blockTokens(t, this.tokens); i = this.inlineQueue.shift();) this.inlineTokens(i.src, i.tokens);
                    return this.tokens
                }, s.blockTokens = function(t, i) {
                    var r, _, x, A, B = this;
                    for (i === void 0 && (i = []), t = this.options.pedantic ? t.replace(/\t/g, "    ").replace(/^ +$/gm, "") : t.replace(/^( *)(\t+)/gm, function(T, j, Q) {
                            return j + "    ".repeat(Q.length)
                        }); t;)
                        if (!(this.options.extensions && this.options.extensions.block && this.options.extensions.block.some(function(T) {
                                return !!(r = T.call({
                                    lexer: B
                                }, t, i)) && (t = t.substring(r.raw.length), i.push(r), !0)
                            }))) {
                            if (r = this.tokenizer.space(t)) t = t.substring(r.raw.length), r.raw.length === 1 && 0 < i.length ? i[i.length - 1].raw += `
` : i.push(r);
                            else if (r = this.tokenizer.code(t)) t = t.substring(r.raw.length), !(_ = i[i.length - 1]) || _.type !== "paragraph" && _.type !== "text" ? i.push(r) : (_.raw += `
` + r.raw, _.text += `
` + r.text, this.inlineQueue[this.inlineQueue.length - 1].src = _.text);
                            else if (r = this.tokenizer.fences(t)) t = t.substring(r.raw.length), i.push(r);
                            else if (r = this.tokenizer.heading(t)) t = t.substring(r.raw.length), i.push(r);
                            else if (r = this.tokenizer.hr(t)) t = t.substring(r.raw.length), i.push(r);
                            else if (r = this.tokenizer.blockquote(t)) t = t.substring(r.raw.length), i.push(r);
                            else if (r = this.tokenizer.list(t)) t = t.substring(r.raw.length), i.push(r);
                            else if (r = this.tokenizer.html(t)) t = t.substring(r.raw.length), i.push(r);
                            else if (r = this.tokenizer.def(t)) t = t.substring(r.raw.length), !(_ = i[i.length - 1]) || _.type !== "paragraph" && _.type !== "text" ? this.tokens.links[r.tag] || (this.tokens.links[r.tag] = {
                                href: r.href,
                                title: r.title
                            }) : (_.raw += `
` + r.raw, _.text += `
` + r.raw, this.inlineQueue[this.inlineQueue.length - 1].src = _.text);
                            else if (r = this.tokenizer.table(t)) t = t.substring(r.raw.length), i.push(r);
                            else if (r = this.tokenizer.lheading(t)) t = t.substring(r.raw.length), i.push(r);
                            else if (x = t, this.options.extensions && this.options.extensions.startBlock && function() {
                                    var T = 1 / 0,
                                        j = t.slice(1),
                                        Q = void 0;
                                    B.options.extensions.startBlock.forEach(function(U) {
                                        typeof(Q = U.call({
                                            lexer: this
                                        }, j)) == "number" && 0 <= Q && (T = Math.min(T, Q))
                                    }), T < 1 / 0 && 0 <= T && (x = t.substring(0, T + 1))
                                }(), this.state.top && (r = this.tokenizer.paragraph(x))) _ = i[i.length - 1], A && _.type === "paragraph" ? (_.raw += `
` + r.raw, _.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = _.text) : i.push(r), A = x.length !== t.length, t = t.substring(r.raw.length);
                            else if (r = this.tokenizer.text(t)) t = t.substring(r.raw.length), (_ = i[i.length - 1]) && _.type === "text" ? (_.raw += `
` + r.raw, _.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = _.text) : i.push(r);
                            else if (t) {
                                var g = "Infinite loop on byte: " + t.charCodeAt(0);
                                if (this.options.silent) {
                                    console.error(g);
                                    break
                                }
                                throw new Error(g)
                            }
                        } return this.state.top = !0, i
                }, s.inline = function(t, i) {
                    return this.inlineQueue.push({
                        src: t,
                        tokens: i = i === void 0 ? [] : i
                    }), i
                }, s.inlineTokens = function(t, i) {
                    var r, _, x, A, B, g, T = this,
                        j = (i === void 0 && (i = []), t);
                    if (this.tokens.links) {
                        var Q = Object.keys(this.tokens.links);
                        if (0 < Q.length)
                            for (;
                                (A = this.tokenizer.rules.inline.reflinkSearch.exec(j)) != null;) Q.includes(A[0].slice(A[0].lastIndexOf("[") + 1, -1)) && (j = j.slice(0, A.index) + "[" + Fe("a", A[0].length - 2) + "]" + j.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))
                    }
                    for (;
                        (A = this.tokenizer.rules.inline.blockSkip.exec(j)) != null;) j = j.slice(0, A.index) + "[" + Fe("a", A[0].length - 2) + "]" + j.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
                    for (;
                        (A = this.tokenizer.rules.inline.escapedEmSt.exec(j)) != null;) j = j.slice(0, A.index + A[0].length - 2) + "++" + j.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex), this.tokenizer.rules.inline.escapedEmSt.lastIndex--;
                    for (; t;)
                        if (B || (g = ""), B = !1, !(this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some(function(I) {
                                return !!(r = I.call({
                                    lexer: T
                                }, t, i)) && (t = t.substring(r.raw.length), i.push(r), !0)
                            }))) {
                            if (r = this.tokenizer.escape(t)) t = t.substring(r.raw.length), i.push(r);
                            else if (r = this.tokenizer.tag(t)) t = t.substring(r.raw.length), (_ = i[i.length - 1]) && r.type === "text" && _.type === "text" ? (_.raw += r.raw, _.text += r.text) : i.push(r);
                            else if (r = this.tokenizer.link(t)) t = t.substring(r.raw.length), i.push(r);
                            else if (r = this.tokenizer.reflink(t, this.tokens.links)) t = t.substring(r.raw.length), (_ = i[i.length - 1]) && r.type === "text" && _.type === "text" ? (_.raw += r.raw, _.text += r.text) : i.push(r);
                            else if (r = this.tokenizer.emStrong(t, j, g)) t = t.substring(r.raw.length), i.push(r);
                            else if (r = this.tokenizer.codespan(t)) t = t.substring(r.raw.length), i.push(r);
                            else if (r = this.tokenizer.br(t)) t = t.substring(r.raw.length), i.push(r);
                            else if (r = this.tokenizer.del(t)) t = t.substring(r.raw.length), i.push(r);
                            else if (r = this.tokenizer.autolink(t, le)) t = t.substring(r.raw.length), i.push(r);
                            else if (!this.state.inLink && (r = this.tokenizer.url(t, le))) t = t.substring(r.raw.length), i.push(r);
                            else if (x = t, this.options.extensions && this.options.extensions.startInline && function() {
                                    var I = 1 / 0,
                                        Ee = t.slice(1),
                                        ke = void 0;
                                    T.options.extensions.startInline.forEach(function(Le) {
                                        typeof(ke = Le.call({
                                            lexer: this
                                        }, Ee)) == "number" && 0 <= ke && (I = Math.min(I, ke))
                                    }), I < 1 / 0 && 0 <= I && (x = t.substring(0, I + 1))
                                }(), r = this.tokenizer.inlineText(x, ut)) t = t.substring(r.raw.length), r.raw.slice(-1) !== "_" && (g = r.raw.slice(-1)), B = !0, (_ = i[i.length - 1]) && _.type === "text" ? (_.raw += r.raw, _.text += r.text) : i.push(r);
                            else if (t) {
                                var U = "Infinite loop on byte: " + t.charCodeAt(0);
                                if (this.options.silent) {
                                    console.error(U);
                                    break
                                }
                                throw new Error(U)
                            }
                        } return i
                }, s = p, a = [{
                    key: "rules",
                    get: function() {
                        return {
                            block: F,
                            inline: y
                        }
                    }
                }], (c = null) && V(s.prototype, c), a && V(s, a), Object.defineProperty(s, "prototype", {
                    writable: !1
                }), p
            }(),
            Me = function() {
                function p(a) {
                    this.options = a || D.defaults
                }
                var c = p.prototype;
                return c.code = function(a, r, t) {
                    var i, r = (r || "").match(/\S*/)[0];
                    return this.options.highlight && (i = this.options.highlight(a, r)) != null && i !== a && (t = !0, a = i), a = a.replace(/\n$/, "") + `
`, r ? '<pre><code class="' + this.options.langPrefix + X(r) + '">' + (t ? a : X(a, !0)) + `</code></pre>
` : "<pre><code>" + (t ? a : X(a, !0)) + `</code></pre>
`
                }, c.blockquote = function(a) {
                    return `<blockquote>
` + a + `</blockquote>
`
                }, c.html = function(a) {
                    return a
                }, c.heading = function(a, s, t, i) {
                    return this.options.headerIds ? "<h" + s + ' id="' + (this.options.headerPrefix + i.slug(t)) + '">' + a + "</h" + s + `>
` : "<h" + s + ">" + a + "</h" + s + `>
`
                }, c.hr = function() {
                    return this.options.xhtml ? `<hr/>
` : `<hr>
`
                }, c.list = function(a, s, t) {
                    var i = s ? "ol" : "ul";
                    return "<" + i + (s && t !== 1 ? ' start="' + t + '"' : "") + `>
` + a + "</" + i + `>
`
                }, c.listitem = function(a) {
                    return "<li>" + a + `</li>
`
                }, c.checkbox = function(a) {
                    return "<input " + (a ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> "
                }, c.paragraph = function(a) {
                    return "<p>" + a + `</p>
`
                }, c.table = function(a, s) {
                    return `<table>
<thead>
` + a + `</thead>
` + (s = s && "<tbody>" + s + "</tbody>") + `</table>
`
                }, c.tablerow = function(a) {
                    return `<tr>
` + a + `</tr>
`
                }, c.tablecell = function(a, s) {
                    var t = s.header ? "th" : "td";
                    return (s.align ? "<" + t + ' align="' + s.align + '">' : "<" + t + ">") + a + "</" + t + `>
`
                }, c.strong = function(a) {
                    return "<strong>" + a + "</strong>"
                }, c.em = function(a) {
                    return "<em>" + a + "</em>"
                }, c.codespan = function(a) {
                    return "<code>" + a + "</code>"
                }, c.br = function() {
                    return this.options.xhtml ? "<br/>" : "<br>"
                }, c.del = function(a) {
                    return "<del>" + a + "</del>"
                }, c.link = function(a, s, t) {
                    return (a = f(this.options.sanitize, this.options.baseUrl, a)) === null ? t : (a = '<a href="' + a + '"', s && (a += ' title="' + s + '"'), a + ">" + t + "</a>")
                }, c.image = function(a, s, t) {
                    return (a = f(this.options.sanitize, this.options.baseUrl, a)) === null ? t : (a = '<img src="' + a + '" alt="' + t + '"', s && (a += ' title="' + s + '"'), a + (this.options.xhtml ? "/>" : ">"))
                }, c.text = function(a) {
                    return a
                }, p
            }(),
            Ie = function() {
                function p() {}
                var c = p.prototype;
                return c.strong = function(a) {
                    return a
                }, c.em = function(a) {
                    return a
                }, c.codespan = function(a) {
                    return a
                }, c.del = function(a) {
                    return a
                }, c.html = function(a) {
                    return a
                }, c.text = function(a) {
                    return a
                }, c.link = function(a, s, t) {
                    return "" + t
                }, c.image = function(a, s, t) {
                    return "" + t
                }, c.br = function() {
                    return ""
                }, p
            }(),
            Re = function() {
                function p() {
                    this.seen = {}
                }
                var c = p.prototype;
                return c.serialize = function(a) {
                    return a.toLowerCase().trim().replace(/<[!\/a-z].*?>/gi, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-")
                }, c.getNextSafeSlug = function(a, s) {
                    var t = a,
                        i = 0;
                    if (this.seen.hasOwnProperty(t))
                        for (i = this.seen[a]; t = a + "-" + ++i, this.seen.hasOwnProperty(t););
                    return s || (this.seen[a] = i, this.seen[t] = 0), t
                }, c.slug = function(a, s) {
                    return s === void 0 && (s = {}), a = this.serialize(a), this.getNextSafeSlug(a, s.dryrun)
                }, p
            }(),
            ve = function() {
                function p(a) {
                    this.options = a || D.defaults, this.options.renderer = this.options.renderer || new Me, this.renderer = this.options.renderer, this.renderer.options = this.options, this.textRenderer = new Ie, this.slugger = new Re
                }
                p.parse = function(a, s) {
                    return new p(s).parse(a)
                }, p.parseInline = function(a, s) {
                    return new p(s).parseInline(a)
                };
                var c = p.prototype;
                return c.parse = function(a, s) {
                    s === void 0 && (s = !0);
                    for (var t, i, r, _, x, A, B, g, T, j, Q, U, I, Ee, ke, Le, he = "", Ke = a.length, Ce = 0; Ce < Ke; Ce++)
                        if (g = a[Ce], this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[g.type] && ((Le = this.options.extensions.renderers[g.type].call({
                                parser: this
                            }, g)) !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(g.type))) he += Le || "";
                        else switch (g.type) {
                            case "space":
                                continue;
                            case "hr":
                                he += this.renderer.hr();
                                continue;
                            case "heading":
                                he += this.renderer.heading(this.parseInline(g.tokens), g.depth, st(this.parseInline(g.tokens, this.textRenderer)), this.slugger);
                                continue;
                            case "code":
                                he += this.renderer.code(g.text, g.lang, g.escaped);
                                continue;
                            case "table":
                                for (A = T = "", r = g.header.length, t = 0; t < r; t++) A += this.renderer.tablecell(this.parseInline(g.header[t].tokens), {
                                    header: !0,
                                    align: g.align[t]
                                });
                                for (T += this.renderer.tablerow(A), B = "", r = g.rows.length, t = 0; t < r; t++) {
                                    for (A = "", _ = (x = g.rows[t]).length, i = 0; i < _; i++) A += this.renderer.tablecell(this.parseInline(x[i].tokens), {
                                        header: !1,
                                        align: g.align[i]
                                    });
                                    B += this.renderer.tablerow(A)
                                }
                                he += this.renderer.table(T, B);
                                continue;
                            case "blockquote":
                                B = this.parse(g.tokens), he += this.renderer.blockquote(B);
                                continue;
                            case "list":
                                for (T = g.ordered, Ne = g.start, j = g.loose, r = g.items.length, B = "", t = 0; t < r; t++) I = (U = g.items[t]).checked, Ee = U.task, Q = "", U.task && (ke = this.renderer.checkbox(I), j ? 0 < U.tokens.length && U.tokens[0].type === "paragraph" ? (U.tokens[0].text = ke + " " + U.tokens[0].text, U.tokens[0].tokens && 0 < U.tokens[0].tokens.length && U.tokens[0].tokens[0].type === "text" && (U.tokens[0].tokens[0].text = ke + " " + U.tokens[0].tokens[0].text)) : U.tokens.unshift({
                                    type: "text",
                                    text: ke
                                }) : Q += ke), Q += this.parse(U.tokens, j), B += this.renderer.listitem(Q, Ee, I);
                                he += this.renderer.list(B, T, Ne);
                                continue;
                            case "html":
                                he += this.renderer.html(g.text);
                                continue;
                            case "paragraph":
                                he += this.renderer.paragraph(this.parseInline(g.tokens));
                                continue;
                            case "text":
                                for (B = g.tokens ? this.parseInline(g.tokens) : g.text; Ce + 1 < Ke && a[Ce + 1].type === "text";) B += `
` + ((g = a[++Ce]).tokens ? this.parseInline(g.tokens) : g.text);
                                he += s ? this.renderer.paragraph(B) : B;
                                continue;
                            default:
                                var Ne = 'Token with "' + g.type + '" type was not found.';
                                if (this.options.silent) return void console.error(Ne);
                                throw new Error(Ne)
                        }
                    return he
                }, c.parseInline = function(a, s) {
                    s = s || this.renderer;
                    for (var t, i, r = "", _ = a.length, x = 0; x < _; x++)
                        if (t = a[x], this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[t.type] && ((i = this.options.extensions.renderers[t.type].call({
                                parser: this
                            }, t)) !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(t.type))) r += i || "";
                        else switch (t.type) {
                            case "escape":
                                r += s.text(t.text);
                                break;
                            case "html":
                                r += s.html(t.text);
                                break;
                            case "link":
                                r += s.link(t.href, t.title, this.parseInline(t.tokens, s));
                                break;
                            case "image":
                                r += s.image(t.href, t.title, t.text);
                                break;
                            case "strong":
                                r += s.strong(this.parseInline(t.tokens, s));
                                break;
                            case "em":
                                r += s.em(this.parseInline(t.tokens, s));
                                break;
                            case "codespan":
                                r += s.codespan(t.text);
                                break;
                            case "br":
                                r += s.br();
                                break;
                            case "del":
                                r += s.del(this.parseInline(t.tokens, s));
                                break;
                            case "text":
                                r += s.text(t.text);
                                break;
                            default:
                                var A = 'Token with "' + t.type + '" type was not found.';
                                if (this.options.silent) return void console.error(A);
                                throw new Error(A)
                        }
                    return r
                }, p
            }();

        function S(p, c, a) {
            if (p == null) throw new Error("marked(): input parameter is undefined or null");
            if (typeof p != "string") throw new Error("marked(): input parameter is of type " + Object.prototype.toString.call(p) + ", string expected");
            if (typeof c == "function" && (a = c, c = null), Te(c = se({}, S.defaults, c || {})), a) {
                var s, t = c.highlight;
                try {
                    s = _e.lex(p, c)
                } catch (A) {
                    return a(A)
                }
                var i, r = function(A) {
                    var B;
                    if (!A) try {
                        c.walkTokens && S.walkTokens(s, c.walkTokens), B = ve.parse(s, c)
                    } catch (g) {
                        A = g
                    }
                    return c.highlight = t, A ? a(A) : a(null, B)
                };
                return !t || t.length < 3 ? r() : (delete c.highlight, s.length ? (i = 0, S.walkTokens(s, function(A) {
                    A.type === "code" && (i++, setTimeout(function() {
                        t(A.text, A.lang, function(B, g) {
                            if (B) return r(B);
                            g != null && g !== A.text && (A.text = g, A.escaped = !0), --i === 0 && r()
                        })
                    }, 0))
                }), void(i === 0 && r())) : r())
            }

            function _(A) {
                if (A.message += `
Please report this to https://github.com/markedjs/marked.`, c.silent) return "<p>An error occurred:</p><pre>" + X(A.message + "", !0) + "</pre>";
                throw A
            }
            try {
                var x = _e.lex(p, c);
                if (c.walkTokens) {
                    if (c.async) return Promise.all(S.walkTokens(x, c.walkTokens)).then(function() {
                        return ve.parse(x, c)
                    }).catch(_);
                    S.walkTokens(x, c.walkTokens)
                }
                return ve.parse(x, c)
            } catch (A) {
                _(A)
            }
        }
        S.options = S.setOptions = function(p) {
            return se(S.defaults, p), p = S.defaults, D.defaults = p, S
        }, S.getDefaults = ue, S.defaults = D.defaults, S.use = function() {
            for (var p = S.defaults.extensions || {
                    renderers: {},
                    childTokens: {}
                }, c = arguments.length, a = new Array(c), s = 0; s < c; s++) a[s] = arguments[s];
            a.forEach(function(t) {
                var i, r = se({}, t);
                if (r.async = S.defaults.async || r.async, t.extensions && (t.extensions.forEach(function(g) {
                        if (!g.name) throw new Error("extension name required");
                        var T;
                        if (g.renderer && (T = p.renderers[g.name], p.renderers[g.name] = T ? function() {
                                for (var j = arguments.length, Q = new Array(j), U = 0; U < j; U++) Q[U] = arguments[U];
                                var I = g.renderer.apply(this, Q);
                                return I = I === !1 ? T.apply(this, Q) : I
                            } : g.renderer), g.tokenizer) {
                            if (!g.level || g.level !== "block" && g.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
                            p[g.level] ? p[g.level].unshift(g.tokenizer) : p[g.level] = [g.tokenizer], g.start && (g.level === "block" ? p.startBlock ? p.startBlock.push(g.start) : p.startBlock = [g.start] : g.level === "inline" && (p.startInline ? p.startInline.push(g.start) : p.startInline = [g.start]))
                        }
                        g.childTokens && (p.childTokens[g.name] = g.childTokens)
                    }), r.extensions = p), t.renderer) {
                    var _, x = S.defaults.renderer || new Me;
                    for (_ in t.renderer)(function(g) {
                        var T = x[g];
                        x[g] = function() {
                            for (var j = arguments.length, Q = new Array(j), U = 0; U < j; U++) Q[U] = arguments[U];
                            var I = t.renderer[g].apply(x, Q);
                            return I = I === !1 ? T.apply(x, Q) : I
                        }
                    })(_);
                    r.renderer = x
                }
                if (t.tokenizer) {
                    var A, B = S.defaults.tokenizer || new $e;
                    for (A in t.tokenizer)(function(g) {
                        var T = B[g];
                        B[g] = function() {
                            for (var j = arguments.length, Q = new Array(j), U = 0; U < j; U++) Q[U] = arguments[U];
                            var I = t.tokenizer[g].apply(B, Q);
                            return I = I === !1 ? T.apply(B, Q) : I
                        }
                    })(A);
                    r.tokenizer = B
                }
                t.walkTokens && (i = S.defaults.walkTokens, r.walkTokens = function(g) {
                    var T = [];
                    return T.push(t.walkTokens.call(this, g)), T = i ? T.concat(i.call(this, g)) : T
                }), S.setOptions(r)
            })
        }, S.walkTokens = function(p, c) {
            for (var a, s = [], t = xe(p); !(a = t()).done;)(function() {
                var i = a.value;
                switch (s = s.concat(c.call(S, i)), i.type) {
                    case "table":
                        for (var r = xe(i.header); !(_ = r()).done;) {
                            var _ = _.value;
                            s = s.concat(S.walkTokens(_.tokens, c))
                        }
                        for (var x, A = xe(i.rows); !(x = A()).done;)
                            for (var B = xe(x.value); !(g = B()).done;) {
                                var g = g.value;
                                s = s.concat(S.walkTokens(g.tokens, c))
                            }
                        break;
                    case "list":
                        s = s.concat(S.walkTokens(i.items, c));
                        break;
                    default:
                        S.defaults.extensions && S.defaults.extensions.childTokens && S.defaults.extensions.childTokens[i.type] ? S.defaults.extensions.childTokens[i.type].forEach(function(T) {
                            s = s.concat(S.walkTokens(i[T], c))
                        }) : i.tokens && (s = s.concat(S.walkTokens(i.tokens, c)))
                }
            })();
            return s
        }, S.parseInline = function(p, c) {
            if (p == null) throw new Error("marked.parseInline(): input parameter is undefined or null");
            if (typeof p != "string") throw new Error("marked.parseInline(): input parameter is of type " + Object.prototype.toString.call(p) + ", string expected");
            Te(c = se({}, S.defaults, c || {}));
            try {
                var a = _e.lexInline(p, c);
                return c.walkTokens && S.walkTokens(a, c.walkTokens), ve.parseInline(a, c)
            } catch (s) {
                if (s.message += `
Please report this to https://github.com/markedjs/marked.`, c.silent) return "<p>An error occurred:</p><pre>" + X(s.message + "", !0) + "</pre>";
                throw s
            }
        }, S.Parser = ve, S.parser = ve.parse, S.Renderer = Me, S.TextRenderer = Ie, S.Lexer = _e, S.lexer = _e.lex, S.Tokenizer = $e, S.Slugger = Re;
        var ze = (S.parse = S).options,
            vt = S.setOptions,
            gt = S.use,
            je = S.walkTokens,
            pt = S.parseInline,
            He = S,
            rt = ve.parse,
            mt = _e.lex;
        D.Lexer = _e, D.Parser = ve, D.Renderer = Me, D.Slugger = Re, D.TextRenderer = Ie, D.Tokenizer = $e, D.getDefaults = ue, D.lexer = mt, D.marked = S, D.options = ze, D.parse = He, D.parseInline = pt, D.parser = rt, D.setOptions = vt, D.use = gt, D.walkTokens = je
    })
});
var hn = Zt(Qt()),
    Ge = Zt(Vt());
var Et = D => `<svg xmlns="http://www.w3.org/2000/svg" x="0px" fill="currentColor" y="0px" width="128px" height="128px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve" class="${D}"><g><path d="M35.893,15.88c0-2.24-1.799-4.165-4.242-4.733c0.239-0.315,0.383-0.706,0.383-1.13c0-1.037-0.841-1.876-1.877-1.876c-1.035,0-1.875,0.839-1.875,1.876c0,0.413,0.135,0.793,0.361,1.104c-2.434,0.479-4.223,2.141-4.223,4.76v4.445h11.473V15.88z"/><path d="M51.807,26.371c0,0-4.389,1.309-6.396,1.682c-2.01,0.374-6.914-0.466-9.67-5.604H24.531c0,0-4.096,8.19-15.75,7.965c-0.081-0.002-1.109,0.04-1.96-0.359c-1.189-0.559-4.983-2.37-3.958-8.82c0,0-4.555,4.768-0.641,9.891c0,0,1.897,2.295,5.071,3.503c-0.002,0.001-0.009,0.001-0.009,0.001s2.771,0.891,3.969,2.837v-0.004c1.996,3.091,5.44,6.512,11.384,8.729c0,0,2.516,0.648,1.409,4.02c-1.034,3.154-3.811,3.062-3.811,3.062v0.025h-1.133c-0.707,0-1.279,0.574-1.279,1.281s0.572,1.279,1.279,1.279h21.469c0.707,0,1.279-0.572,1.279-1.279s-0.572-1.281-1.279-1.281h-1.141l-0.375-0.041c0,0-2.066-0.275-3.061-3.395c0,0-0.951-2.207,0.951-3.223c0,0,3.828-1.611,6.061-3.217c0,0,3.799-2.393,7.834-7.345c1.193-1.464,2.945-3.035,4.508-4.319c-0.141,0.04-0.281,0.081-0.422,0.124c-0.639,0.191-1.299,0.414-1.979,0.665c-0.682,0.253-1.385,0.536-2.105,0.844c-1.443,0.618-2.965,1.347-4.574,2.104c-1.607,0.757-3.309,1.531-5.092,2.217c-1.779,0.688-3.639,1.283-5.527,1.736c-0.943,0.227-1.895,0.422-2.843,0.586c-0.239,0.039-0.48,0.078-0.72,0.117c-0.234,0.035-0.469,0.07-0.703,0.104c-0.238,0.029-0.476,0.057-0.714,0.086c-0.237,0.027-0.475,0.047-0.712,0.072c-1.897,0.176-3.782,0.217-5.598,0.08c-1.813-0.133-3.557-0.441-5.154-0.918c-1.598-0.473-3.049-1.109-4.294-1.846c-1.249-0.732-2.29-1.561-3.13-2.368c-0.838-0.812-1.475-1.604-1.947-2.287c-0.473-0.683-0.782-1.258-0.977-1.656C8.666,31.023,8.59,30.8,8.588,30.8c0,0,0.098,0.215,0.322,0.594c0.227,0.377,0.582,0.918,1.105,1.549c0.52,0.629,1.209,1.348,2.088,2.061c0.877,0.713,1.945,1.418,3.192,2.01c1.243,0.6,2.665,1.08,4.206,1.395c1.54,0.316,3.199,0.465,4.913,0.443c1.715-0.021,3.484-0.211,5.258-0.533c0.223-0.043,0.444-0.08,0.666-0.127c0.223-0.046,0.444-0.092,0.667-0.139c0.225-0.047,0.451-0.096,0.676-0.145c0.219-0.051,0.439-0.103,0.658-0.152c0.889-0.215,1.771-0.457,2.643-0.729c1.744-0.542,3.441-1.209,5.076-1.966c1.635-0.754,3.205-1.598,4.742-2.446c1.533-0.848,3.039-1.696,4.527-2.452c0.742-0.378,1.48-0.733,2.209-1.06c0.727-0.323,1.445-0.619,2.145-0.881c1.4-0.525,2.725-0.918,3.914-1.205c1.188-0.287,2.238-0.474,3.104-0.603c0.867-0.128,1.549-0.197,2.016-0.243c0.113-0.01,0.213-0.019,0.299-0.026c0.182-0.11,0.303-0.177,0.352-0.191C62.994,25.879,58.916,24.529,51.807,26.371z"/></g></svg>`,
    Xt = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
    Ft = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>',
    Dt = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" /></svg>',
    Mt = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>',
    Jt = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3 mr-1"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>',
    Yt = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3 mr-1"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>',
    Bt = (D = "w-4 h-4") => `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="${D}"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>`,
    Ot = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>',
    en = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" /></svg>',
    tn = '<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" ><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
    nn = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>',
    an = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>',
    sn = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>',
    rn = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>',
    on = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082" /></svg>',
    ln = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>',
    cn = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>',
    un = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>',
    dn = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" /></svg>',
    gn = D => `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="${D}"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"></path></svg>`,
    pn = (D = "w-4 h-4") => `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="${D}"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>`,
    mn = (D = "w-4 h-4") => `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="${D}"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" /></svg>`;
(function() {
    let D = acquireVsCodeApi();
    Ge.setOptions({
        renderer: new Ge.Renderer,
        highlight: function(f, d) {
            return hn.highlightAuto(f).value
        },
        langPrefix: "hljs language-",
        pedantic: !1,
        gfm: !0,
        breaks: !0,
        sanitize: !1,
        smartypants: !1,
        xhtml: !1
    });
    let V = !1,
        ge = !0;
    window.addEventListener("load", () => {
        xe(!1), document.getElementById("main").style.display = "flex", D.postMessage({
            type: "populateOneShotShortcuts"
        })
    });
    let xe = f => {
        f ? document.getElementById("skeleton").style.display = "flex" : document.getElementById("skeleton").style.display = "none"
    };
    window.addEventListener("message", f => {
        let d = f.data,
            O = document.getElementById("qa-list");
        switch (d.type) {
            case "showSkeleton":
                xe(d.show);
                break;
            case "showInProgress":
                V = !!d.inProgress, d.showStopButton ? document.getElementById("stop-button").classList.remove("hidden") : document.getElementById("stop-button").classList.add("hidden"), d.inProgress ? (document.getElementById("in-progress").classList.remove("hidden"), document.getElementById("question-input-buttons").classList.add("hidden"), document.getElementById("oneshot-question-shortcut-button").classList.add("hidden")) : (document.getElementById("in-progress").classList.add("hidden"), document.getElementById("question-input-buttons").classList.remove("hidden"), document.getElementById("oneshot-question-shortcut-button").classList.remove("hidden"));
                break;
            case "addQuestion":
                ge = !0, O.classList.remove("hidden"), document.getElementById("introduction")?.classList?.add("hidden"), document.getElementById("conversation-list").classList.add("hidden");
                let oe = Ge.parse(We(d.value)),
                    ye = d.code ? "\n\n```" + (d.language || "") + `
` + d.code + "\n```" : "",
                    se = Ae(d.value + ye);
                O.innerHTML += `<div class="p-4 self-end mt-4 question-element-gnc relative input-background">
                        <div class="flex items-center justify-between relative tooltip-right-0">
                            <h2 class="mb-5 flex">${Xt}You</h2>
                            <div class="flex gap-2">
                                <button class="copy-raw-button rounded-md tooltip" data-tooltip="Copy the question in raw markdown" data-rawid="${d.id}">${Dt}</button>
                                <button class="resend-element-gnc rounded-md tooltip" data-tooltip="Edit and resend this prompt" data-rawid="${d.id}">${Bt()}</button>
                            </div>
                        </div>
                        <div class="hidden send-cancel-elements-gnc flex gap-2 mb-2" id="${d.id}-edit">
                            <button title="Send this prompt" class="send-element-gnc p-1 pr-2 flex items-center" data-rawid="${d.id}">${Yt}&nbsp;Send</button>
                            <button title="Cancel" class="cancel-element-gnc p-1 pr-2 flex items-center" data-rawid="${d.id}">${Jt}&nbsp;Cancel</button>
                        </div>
                        <div class="overflow-y-auto question" id="${d.id}-message">${oe}</div>
                        <textarea class="raw hidden" data-role="You" id="${d.id}-raw">${se}</textarea>
                    </div>`, Xe(d.autoScroll);
                break;
            case "addResponse":
                if (!d.value) return;
                let fe = d.id && document.getElementById(`${d.id}-message`),
                    Oe = d.id && document.getElementById(`${d.id}-raw`),
                    Te = "";
                d.responseInMarkdown ? Te = d.value.split("```").length % 2 === 1 ? d.value : d.value + `

\`\`\`

` : Te = "```\r\n" + We(d.value) + " \r\n ```";
                let Fe = Ge.parse(Te);
                fe ? (fe.innerHTML = Fe, Oe.innerHTML = Te) : O.innerHTML += `<div class="p-4 self-end mt-4 pb-8 answer-element-gnc">
                        <div class="flex items-center justify-between relative tooltip-right-0">
                            <h2 class="mb-5 flex">${Et("h-5 w-5")}<span class="flex ml-2 items-center">${d.assistantName}<span></h2>
                            <button class="flex items-center ml-4 rounded-md text-xs copy-raw-button tooltip" data-tooltip="Copy the whole response in raw markdown" data-rawid="${d.id}">${Dt}</button>
                        </div>
                        <div class="result-streaming response" id="${d.id}-message">${Fe}</div>
                        <textarea class="raw hidden" id="${d.id}-raw" data-role="${d.assistantName}">${Te}</textarea>
                    </div>`, d.done && (O.lastChild.querySelectorAll("pre > code").forEach(_e => {
                    _e.classList.add("input-background", "p-4", "pb-2", "block", "whitespace-pre", "overflow-x-scroll"), _e.parentElement.classList.add("pre-code-element", "relative");
                    let Me = document.createElement("no-export");
                    Me.classList.add("code-actions-wrapper", "flex", "gap-3", "px-2", "pt-1", "pb-1", "flex-wrap", "items-center", "justify-end", "rounded-t-lg", "input-background");
                    let Ie = document.createElement("button");
                    Ie.title = "Copy to clipboard", Ie.innerHTML = `${Ft} Copy`, Ie.classList.add("code-element-gnc", "p-1", "pr-2", "flex", "items-center", "rounded-lg", "gap-1");
                    let Re = document.createElement("button");
                    Re.title = "Insert the below code to the current file", Re.innerHTML = `${en} Insert`, Re.classList.add("edit-element-gnc", "p-1", "pr-2", "flex", "items-center", "rounded-lg", "gap-1");
                    let ve = document.createElement("button");
                    ve.title = "Create a new file with the below code", ve.innerHTML = `${Ot} New`, ve.classList.add("new-code-element-gnc", "p-1", "pr-2", "flex", "items-center", "rounded-lg", "gap-1");
                    let S = document.createElement("button");
                    S.dataset.tooltip = "Show diff with selected code or file", S.innerHTML = `${sn} Diff`, S.classList.add("diff-element-gnc", "p-1", "pr-2", "flex", "items-center", "rounded-lg", "gap-1", "tooltip"), Me.append(S, Ie, Re, ve), _e.parentNode.previousSibling ? _e.parentNode.parentNode.insertBefore(Me, _e.parentNode.previousSibling) : _e.parentNode.parentNode.prepend(Me)
                }), document.getElementById(`${d.id}-message`).classList.remove("result-streaming")), Xe(d.autoScroll && (d.done || Fe.endsWith(`
`)), d.done ? "smooth" : "auto");
                break;
            case "addError":
                if (!O.innerHTML || !d.value) return;
                let it = d.value || "An error occurred. If this issue persists please clear your session token with `Genie: Reset session` command and/or restart your Visual Studio Code. If you still experience issues, it may be due to outage on https://openai.com services.";
                O.innerHTML += `<div class="p-4 self-end mt-4 pb-8 error-element-gnc">
                        <h2 class="mb-5 flex">${Et("h-5 w-5")}<span class="flex ml-2 items-center">${d.assistantName}<span></h2>
                        <div class="text-red-400">${Ge.parse(it)}</div>
                    </div>`, Xe(d.autoScroll);
                break;
            case "clearConversation":
                X();
                break;
            case "exportConversation":
                at();
                break;
            case "listConversations":
                O.classList.add("hidden"), document.getElementById("introduction")?.classList?.add("hidden");
                let $e = document.getElementById("conversation-list");
                $e.classList.remove("hidden");
                let F = d.conversations.items.map(le => `<div class="relative flex flex-row items-center gap-2 pr-8"><button id="show-conversation-button" data-id="${le.id}" data-uri="${le.uri}" data-created-date="${le.create_time}" data-model="${le.model}" data-modified-date="${le.modified_time}" data-title="${Ae(le.title)}" class="flex py-3 px-3 items-center gap-3 relative rounded-lg input-background cursor-pointer break-all group w-full">${tn}<div class="flex flex-col items-start gap-1 truncate"><span class="text-left font-bold">${le.title}</span><div><div class="opacity-75 text-xs text-left">Last model used: ${le.model}</div><div class="opacity-75 text-xs text-left">Modified: ${new Date(le.modified_time).toLocaleString()}</div><div class="opacity-75 text-xs text-left">Created: ${new Date(le.create_time).toLocaleString()}</div></div></div></button><div class="flex flex-col items-center gap-4 absolute right-0"><button class="rename-history-entry rounded-md tooltip tooltip-left" data-tooltip="Rename conversation" data-id="${le.id}" data-name="${Ae(le.title)}">${Bt()}</button><button class="remove-history-entry rounded-md tooltip tooltip-left" data-tooltip="Remove conversation" data-id="${le.id}" data-name="${Ae(le.title)}">${pn()}</button></div></div>`);
                $e.innerHTML = `<div class="flex flex-col gap-4 text-sm relative overflow-y-auto p-3">
                    <div class="flex justify-end gap-4">
                        <button id="refresh-conversations-button" title="Reload conversations" class="p-1 flex items-center rounded-lg">${an}</button>
                        <button id="close-conversations-button" title="Close conversations panel" class="p-1 flex items-center rounded-lg">${nn}</button>
                    </div>
                    ${ue(F,d.assistantName)}
                </div>`;
                break;
            case "toggleOneShot":
                d.visible ? (document.getElementById("oneshot-question-wrapper").classList.remove("hidden"), document.getElementById("conversational-wrapper").classList.add("hidden")) : (document.getElementById("oneshot-question-wrapper").classList.add("hidden"), document.getElementById("conversational-wrapper").classList.remove("hidden"));
                break;
            case "updateOneShotShortcuts":
                let ut = document.getElementById("oneshot-shortcuts");
                ut.innerHTML = d.prompts.map(le => nt(le)).join("");
                break;
            default:
                break
        }
    });
    let ue = (f, d) => f?.length > 0 ? `<div class="text-xs">Your conversation history with ${d} in "genie.json" files stored locally. You may import, rename or remove your conversations here.</div><div class="flex flex-col gap-4">${f.join("")}</div>` : `<div class="flex flex-col gap-2 items-center mt-10">${gn("w-6 h-6")}<strong>No conversations found</strong><div class="text-xs text-center">Start a new conversation to begin storing them locally.</div><button class="flex gap-2 items-center justify-start mt-3 p-1 px-3 rounded-lg" id="clear-button">${Ot}New chat</button></div>`,
        Qe = f => {
            if (f?.indexOf(" ") >= 0) return f;
            if (f) {
                let d = f.replace(/([A-Z])/g, " $1");
                return d[0].toUpperCase() + d.substring(1).toLowerCase()
            }
            return ""
        },
        nt = f => {
            let d;
            switch (f.id) {
                case "addTests":
                    d = rn;
                    break;
                case "findProblems":
                    d = on;
                    break;
                case "optimize":
                    d = ln;
                    break;
                case "explain":
                    d = cn;
                    break;
                case "addComments":
                    d = un;
                    break;
                case "completeCode":
                    d = dn;
                    break;
                default:
                    d = Et("w-6 h-6");
                    break
            }
            return `<div class="flex flex-col w-16 h-24 items-center justify-start oneshot-shortcut-button-wrapper relative ${f.custom?"custom-shortcut":""}"><button title="${f.text}: [Selected code in editor]" data-prompt="${f.text}" data-temperature="${f.temperature}" class="oneshot-shortcut-button w-14 h-14 rounded-lg flex flex-col items-center justify-center p-4">${d}</button><span class="shortcut-button-label text-xs font-semibold pt-2 text-center overflow-anywhere">${Ae(Qe(f.id))}</span><a href="#" data-key="${f.key}" title="Remove this shortcut" class="oneshot-shortcut-remove-button"></a></div>`
        },
        We = f => String(f).replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&#039;", "'"),
        Ae = f => String(f).replaceAll(/&/g, "&amp;").replaceAll(/>/g, "&gt;").replaceAll(/</g, "&lt;").replaceAll(/"/g, "&quot;"),
        ct = () => {
            let f = document.getElementById("icebreakers-list");
            f && (f.innerHTML = st())
        },
        Be = () => {
            let f = document.getElementById("question-input");
            f.value?.length > 0 && (D.postMessage({
                type: "addFreeTextQuestion",
                value: f.value
            }), f.value = "", f.parentElement.dataset.replicatedValue = "")
        },
        X = (f = !0) => {
            document.getElementById("qa-list").innerHTML = "", document.getElementById("introduction")?.classList?.remove("hidden"), f && setTimeout(function() {
                document.getElementById("question-input").focus()
            }, 50), D.postMessage({
                type: "clearConversation"
            }), ct()
        },
        at = () => {
            let f = document.getElementById("conversation-title")?.innerHTML,
                d = document.getElementById("conversation-created-date")?.innerHTML,
                O = document.getElementById("conversation-modified-date")?.innerHTML,
                ye = `---
Crafted by [Genie](https://marketplace.visualstudio.com/items?itemName=genieai.chatgpt-vscode)
${document.getElementById("conversation-id")?.innerHTML||""}
---

`,
                se = ye;
            f && d && (se += `# ${f}

*${d}*

*${O}*

`), document.querySelectorAll(".raw").forEach(fe => {
                se += `## ${fe.dataset.role}

${fe.value}

`
            }), se !== ye && D.postMessage({
                type: "openNew",
                value: se,
                language: "markdown"
            })
        },
        st = () => {
            let f = ["How can I solve this question: https://leetcode.com/problems/intersection-of-two-linked-lists", "How can I solve this question: https://leetcode.com/problems/longest-palindromic-substring/", "How can I implement an algorithm for this question: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", "Implement Dijkstra's shortest path algorithm", "Given the root of a binary tree, return its maximum depth", "Merge two sorted lists", "How can I serialize and deserialize binary tree", "How can I check if parentheses are matching", "How do I implement Fibonacci sequence without recursion", "How can I implement a hash table", "Write a program that solves the FizzBuzz game", "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked - lists into one sorted linked - list and return it. Solve this problem"],
                d = ["Python", "Java", "JavaScript", "C#", "PHP", "C++", "Ruby", "Swift", "Kotlin", "Go", "Rust", "R", "C"],
                O = [];
            for (let oe = 0; oe < 3; oe++) {
                let ye = Math.floor(Math.random() * (12 - oe)),
                    se = Math.floor(Math.random() * (13 - oe)),
                    fe = f.splice(ye, 1),
                    Oe = d.splice(se, 1);
                O.push(`<button class="fav-prompt mb-4 flex gap-2 justify-center px-3 rounded-md ${ye<=2?"break-all":""}">${fe} in ${Oe}</button>`)
            }
            return O.join("")
        };
    document.getElementById("question-input").addEventListener("keydown", function(f) {
        if (f.key == "Enter" && !f.shiftKey && !f.isComposing && !V) {
            f.preventDefault(), Be();
            let d = this;
            setTimeout(function() {
                d.focus()
            }, 50)
        }
    });
    let H = (f = !1) => {
            let d = document.getElementById("oneshot-question-input");
            D.postMessage({
                type: "oneShotQuestion",
                value: d.value,
                shortcut: f
            })
        },
        L = () => {
            let f = document.getElementById("oneshot-question-input").value;
            if (f) {
                let d = Number(document.getElementsByClassName("temperature-radio-selected")[0].dataset.temperature);
                D.postMessage({
                    type: "saveOneShotShortcut",
                    text: f,
                    temperature: d
                }), D.postMessage({
                    type: "populateOneShotShortcuts"
                })
            }
        },
        Ve = f => {
            D.postMessage({
                type: "changeOneShotTemperature",
                value: f
            }), document.querySelectorAll(".temperature-radio").forEach(d => d.classList.remove("temperature-radio-selected")), document.querySelector(`[data-temperature="${f}"]`).classList.add("temperature-radio-selected")
        };
    document.getElementById("oneshot-question-input").addEventListener("keydown", function(f) {
        if (f.key == "Enter" && (f.ctrlKey || f.shiftKey) && !f.isComposing && !V) {
            f.preventDefault(), H();
            let d = this;
            setTimeout(function() {
                d.focus()
            }, 50)
        }
    }), document.addEventListener("click", f => {
        let d = f.target.closest("button");
        if (d?.id === "more-button") {
            f.preventDefault(), document.getElementById("chat-button-wrapper")?.classList.toggle("hidden");
            return
        } else document.getElementById("chat-button-wrapper")?.classList.add("hidden");
        if (f.target?.id === "settings-button") {
            f.preventDefault(), D.postMessage({
                type: "openSettings"
            });
            return
        }
        if (f.target?.id === "api-key-button") {
            f.preventDefault(), D.postMessage({
                type: "enterApiKey"
            });
            return
        }
        if (f.target?.id === "oneshot-question-button") {
            f.preventDefault(), H();
            return
        }
        if (f.target?.id === "oneshot-add-shortcut-button") {
            f.preventDefault(), L();
            return
        }
        if (f.target?.id === "settings-prompt-button") {
            f.preventDefault(), D.postMessage({
                type: "openSettingsPrompt"
            });
            return
        }
        if (f.target?.classList.contains("oneshot-shortcut-remove-button")) {
            f.preventDefault();
            let O = f.target.dataset.key;
            D.postMessage({
                type: "removeOneShotShortcut",
                key: O
            })
        }
        if (d?.id === "show-oneshot-button") {
            f.preventDefault(), D.postMessage({
                type: "showOneShotView"
            });
            return
        }
        if (d?.id === "dismiss-oneshot-info") {
            f.preventDefault(), D.postMessage({
                type: "hideOneShotInfo"
            }), document.getElementById("oneshot-info").classList.add("hidden");
            return
        }
        if (d?.id === "ask-button") {
            f.preventDefault(), Be();
            return
        }
        if (d?.id === "clear-button") {
            f.preventDefault(), X();
            return
        }
        if (d?.id === "renew-icebreakers-button") {
            f.preventDefault(), X(!1);
            return
        }
        if (d?.id === "export-button") {
            f.preventDefault(), at();
            return
        }
        if (d?.id === "list-conversations-button" || d?.id === "list-conversations-link") {
            f.preventDefault(), D.postMessage({
                type: "listConversations"
            });
            return
        }
        if (d?.id === "show-conversation-button") {
            f.preventDefault(), D.postMessage({
                type: "showConversation",
                value: d.getAttribute("data-id")
            }), document.getElementById("qa-list").innerHTML = `<div class="flex flex-col p-3 pt-2">
                <h1 class="text-lg" id="conversation-title">${d.getAttribute("data-title")}</h1>
                <div class="text-xs opacity-75 text-left" id="conversation-model">Last model used: ${d.getAttribute("data-model")}</div>
                <div class="text-xs opacity-75 text-left" id="conversation-modified-date">Modified: ${new Date(d.getAttribute("data-modified-date")).toLocaleString()}</div>
                <div class="text-xs opacity-75 text-left" id="conversation-created-date">Created: ${new Date(d.getAttribute("data-created-date")).toLocaleString()}</div>
                <div class="text-xs opacity-75 text-left" id="conversation-id">ID: ${d.getAttribute("data-id")}</div>
                <button data-uri="${d.getAttribute("data-uri")}" class="flex items-center justify-center mt-3 open-file-uri p-2 rounded-md text-xs">${mn()}&nbsp;Open file in editor</button>
            </div>`, document.getElementById("qa-list").classList.remove("hidden"), document.getElementById("introduction").classList.add("hidden"), document.getElementById("conversation-list").classList.add("hidden");
            return
        }
        if (d?.id === "refresh-conversations-button") {
            f.preventDefault(), D.postMessage({
                type: "listConversations"
            });
            return
        }
        if (d?.id === "close-conversations-button") {
            f.preventDefault();
            let O = document.getElementById("qa-list");
            O.classList.add("hidden"), document.getElementById("conversation-list").classList.add("hidden"), document.getElementById("introduction").classList.add("hidden"), O.innerHTML?.length > 0 ? O.classList.remove("hidden") : document.getElementById("introduction").classList.remove("hidden");
            return
        }
        if (d?.id === "stop-button") {
            f.preventDefault(), D.postMessage({
                type: "stopGenerating"
            });
            return
        }
        if (d?.classList?.contains("open-file-uri")) {
            f.preventDefault(), D.postMessage({
                type: "openFileById",
                value: d.dataset.uri
            });
            return
        }
        if (d?.classList?.contains("temperature-radio")) {
            f.preventDefault();
            let O = Number(d.dataset.temperature);
            Ve(O);
            return
        }
        if (d?.classList?.contains("fav-prompt")) {
            f.preventDefault(), D.postMessage({
                type: "addFreeTextQuestion",
                value: d.innerHTML,
                fav: !0
            });
            return
        }
        if (d?.classList?.contains("resend-element-gnc")) {
            f.preventDefault();
            let O = d.dataset.rawid;
            document.getElementById(`${O}-edit`).classList.remove("hidden"), document.getElementById(`${O}-message`).setAttribute("contenteditable", !0);
            return
        }
        if (d?.classList?.contains("send-element-gnc")) {
            f.preventDefault();
            let O = d.dataset.rawid;
            document.getElementById(`${O}-edit`).classList.add("hidden"), document.getElementById(`${O}-message`).setAttribute("contenteditable", !1), document.getElementById(`${O}-message`).textContent?.length > 0 && D.postMessage({
                type: "addFreeTextQuestion",
                value: document.getElementById(`${O}-message`).textContent
            });
            return
        }
        if (d?.classList?.contains("cancel-element-gnc")) {
            f.preventDefault();
            let O = d.dataset.rawid;
            document.getElementById(`${O}-edit`).classList.add("hidden"), document.getElementById(`${O}-message`).setAttribute("contenteditable", !1);
            return
        }
        if (d?.classList?.contains("code-element-gnc")) {
            f.preventDefault(), navigator.clipboard.writeText(d.parentElement?.nextElementSibling?.lastChild?.textContent).then(() => {
                d.innerHTML = `${Mt} Copied`, setTimeout(() => {
                    d.innerHTML = `${Ft} Copy`
                }, 1500)
            });
            return
        }
        if (d?.classList?.contains("edit-element-gnc")) {
            f.preventDefault(), D.postMessage({
                type: "editCode",
                value: d.parentElement?.nextElementSibling?.lastChild?.textContent
            });
            return
        }
        if (d?.classList?.contains("new-code-element-gnc")) {
            f.preventDefault(), D.postMessage({
                type: "openNew",
                value: d.parentElement?.nextElementSibling?.lastChild?.textContent
            });
            return
        }
        if (d?.classList?.contains("diff-element-gnc")) {
            f.preventDefault(), D.postMessage({
                type: "viewDiff",
                value: d.parentElement?.nextElementSibling?.lastChild?.textContent
            });
            return
        }
        if (d?.classList?.contains("copy-raw-button")) {
            f.preventDefault();
            let O = d.dataset.rawid;
            navigator.clipboard.writeText(document.getElementById(`${O}-raw`).value).then(() => {
                d.innerHTML = `${Mt}`, setTimeout(() => {
                    d.innerHTML = `${Dt}`
                }, 1500)
            });
            return
        }
        if (d?.classList?.contains("oneshot-shortcut-button") && !V) {
            f.preventDefault();
            let O = document.getElementById("oneshot-question-input");
            O.value = d.dataset.prompt;
            let oe = Number(d.dataset.temperature);
            oe >= 0 && Ve(oe), H(!0)
        }
        if (d?.classList?.contains("rename-history-entry")) {
            f.preventDefault();
            let O = String(d.dataset.name),
                oe = String(d.dataset.id);
            D.postMessage({
                type: "renameConversation",
                name: O,
                id: oe
            });
            return
        }
        if (d?.classList?.contains("remove-history-entry")) {
            f.preventDefault();
            let O = String(d.dataset.id),
                oe = String(d.dataset.name);
            D.postMessage({
                type: "removeConversation",
                name: oe,
                id: O
            });
            return
        }
    }), document.getElementById("qa-list").addEventListener("scroll", f => {
        if (f?.target) {
            let {
                scrollTop: d,
                scrollHeight: O,
                clientHeight: oe
            } = f.target, ye = ge && d < O - oe, se = !ge && d >= O - oe;
            ye ? ge = !1 : se && (ge = !0)
        }
    });
    let Xe = (f, d = "auto") => {
        if (f && ge) {
            let O = document.getElementById("qa-list");
            O?.scrollTo({
                top: O.scrollHeight,
                behavior: d
            })
        }
    }
})();
/*!
  Highlight.js v11.7.0 (git: 82688fad18)
  (c) 2006-2022 undefined and other contributors
  License: BSD-3-Clause
 */
/**
 * @author Genie AI
 * https://github.com/ai-genie/chatgpt-vscode
 *
 * @license
 * Copyright (c) 2022 - Present, Genie AI
 *
 * All rights reserved. Code licensed under the MIT license
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 */