var ui = (e) => {
  throw TypeError(e);
};
var di = (e, t, s) => t.has(e) || ui("Cannot " + s);
var Us = (e, t, s) => (di(e, t, "read from private field"), s ? s.call(e) : t.get(e)), js = (e, t, s) => t.has(e) ? ui("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, s), qs = (e, t, s, i) => (di(e, t, "write to private field"), i ? i.call(e, s) : t.set(e, s), s);
function zo(e) {
  return e && "read" in e && typeof e.read == "function";
}
async function Yo(e) {
  if (typeof e == "string") {
    let i;
    try {
      i = JSON.parse(e);
    } catch {
      throw new Error("Raw JSON input must be valid JSON.");
    }
    if (!i || typeof i != "object" || Array.isArray(i))
      throw new Error(
        "Raw JSON input must contain a Blueprint declaration object."
      );
    return i;
  }
  if (!zo(e))
    return e;
  const s = await (await e.read("blueprint.json")).text();
  return JSON.parse(s);
}
class mr {
  static async create(t) {
    const s = await Yo(t), i = zo(t) ? t : void 0;
    return mr.createFromDeclaration(s, i);
  }
  static createFromDeclaration(t, s = void 0) {
    return new mr(
      t,
      s,
      t.version || 1
    );
  }
  constructor(t, s, i) {
    this.declaration = t, this.bundle = s, this.version = i;
  }
  getVersion() {
    return this.version;
  }
  getDeclaration() {
    return this.declaration;
  }
  isBundle() {
    return this.bundle !== void 0;
  }
  getBundle() {
    return this.bundle;
  }
  getBlueprint() {
    return this.getBundle() || this.getDeclaration();
  }
}
const Wl = "playground-log", mi = (e, ...t) => {
  ue.dispatchEvent(
    new CustomEvent(Wl, {
      detail: {
        log: e,
        args: t
      }
    })
  );
}, Ml = (e, ...t) => {
  switch (typeof e.message == "string" ? Reflect.set(e, "message", _n(e.message)) : e.message.message && typeof e.message.message == "string" && Reflect.set(
    e.message,
    "message",
    _n(e.message.message)
  ), e.severity) {
    case He.Debug:
      console.debug(e.message, ...t);
      break;
    case He.Info:
      console.info(e.message, ...t);
      break;
    case He.Warn:
      console.warn(e.message, ...t);
      break;
    case He.Error:
      console.error(e.message, ...t);
      break;
    case He.Fatal:
      console.error(e.message, ...t);
      break;
    default:
      console.log(e.message, ...t);
  }
}, Bl = (e) => e instanceof Error ? [e.message, e.stack].join(`
`) : JSON.stringify(e, null, 2), Go = [], hi = (e) => {
  Go.push(e);
}, gn = (e) => {
  if (e.raw === !0)
    hi(e.message);
  else {
    const t = Yl(
      typeof e.message == "object" ? Bl(e.message) : e.message,
      e.severity,
      e.prefix ?? Ut.JS
    );
    hi(t);
  }
};
let Ws = 0;
const yi = "/wordpress/wp-content/debug.log", Hl = async (e) => await e.fileExists(yi) ? await e.readFileAsText(yi) : "", Zo = (e, t) => {
  t.addEventListener("request.end", async () => {
    const s = await Hl(t);
    if (s.length > Ws) {
      const i = s.substring(Ws);
      e.logMessage({
        message: i,
        severity: He.Log,
        raw: !0
      }), Ws = s.length;
    }
  }), t.addEventListener("request.error", (s) => {
    s = s, s.error && (e.logMessage({
      message: `${s.error.message} ${s.error.stack}`,
      severity: He.Fatal,
      prefix: s.source === "request" ? Ut.PHP : Ut.WASM
    }), e.dispatchEvent(
      new CustomEvent(e.fatalErrorEvent, {
        detail: {
          logs: e.getLogs(),
          source: s.source
        }
      })
    ));
  });
}, He = {
  Fatal: { name: "fatal", level: 0 },
  Error: { name: "error", level: 1 },
  Warn: { name: "warn", level: 2 },
  Log: { name: "log", level: 3 },
  Info: { name: "info", level: 4 },
  Debug: { name: "debug", level: 5 }
}, Ut = {
  WASM: "Wasm Crash",
  PHP: "PHP",
  JS: "JavaScript"
};
class Vl extends EventTarget {
  // constructor
  constructor(t = []) {
    super(), this.fatalErrorEvent = "playground-fatal-error", this.severity = He.Info, this.handlers = t;
  }
  /**
   * Get all logs.
   * @returns string[]
   */
  getLogs() {
    return this.handlers.includes(gn) ? [...Go] : (this.error(`Logs aren't stored because the logToMemory handler isn't registered.
				If you're using a custom logger instance, make sure to register logToMemory handler.
			`), []);
  }
  /**
   * Log message with severity.
   *
   * @param log Log
   * @param args any
   */
  logMessage(t, ...s) {
    const i = {
      ...t,
      severity: t.severity ?? He.Log
    };
    for (const o of this.handlers)
      i.severity.level <= this.severity.level && o(i, ...s);
  }
  /**
   * Filter message based on severity
   * @param severity LogSeverity
   */
  setSeverityFilterLevel(t) {
    this.severity = t;
  }
  /**
   * Log message
   *
   * @param message any
   * @param args any
   */
  log(t, ...s) {
    this.logMessage(
      {
        message: t,
        severity: He.Log,
        prefix: Ut.JS,
        raw: !1
      },
      ...s
    );
  }
  /**
   * Log debug message
   *
   * @param message any
   * @param args any
   */
  debug(t, ...s) {
    this.logMessage(
      {
        message: t,
        severity: He.Debug,
        prefix: Ut.JS,
        raw: !1
      },
      ...s
    );
  }
  /**
   * Log info message
   *
   * @param message any
   * @param args any
   */
  info(t, ...s) {
    this.logMessage(
      {
        message: t,
        severity: He.Info,
        prefix: Ut.JS,
        raw: !1
      },
      ...s
    );
  }
  /**
   * Log warning message
   *
   * @param message any
   * @param args any
   */
  warn(t, ...s) {
    this.logMessage(
      {
        message: t,
        severity: He.Warn,
        prefix: Ut.JS,
        raw: !1
      },
      ...s
    );
  }
  /**
   * Log error message
   *
   * @param message any
   * @param args any
   */
  error(t, ...s) {
    this.logMessage(
      {
        message: t,
        severity: He.Error,
        prefix: Ut.JS,
        raw: !1
      },
      ...s
    );
  }
}
const zl = () => {
  try {
    if (process.env.NODE_ENV === "test")
      return [gn, mi];
  } catch {
  }
  return [gn, Ml, mi];
}, ue = new Vl(zl()), _n = (e) => e.replace(/\t/g, ""), Yl = (e, t, s) => {
  const i = /* @__PURE__ */ new Date(), o = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC"
  }).format(i).replace(/ /g, "-"), n = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1,
    timeZone: "UTC",
    timeZoneName: "short"
  }).format(i), r = o + " " + n;
  return e = _n(e), `[${r}] ${s} ${t.name}: ${e}`;
}, Gl = 5 * 1024 * 1024;
function Zl(e, t) {
  const s = e.headers.get("content-length") || "", i = parseInt(s, 10) || Gl;
  return new Response(
    Jo(e.body, i, t),
    {
      status: e.status,
      statusText: e.statusText,
      headers: e.headers
    }
  );
}
function Jo(e, t, s) {
  let i = 0;
  function o(n, r, l) {
    const p = performance.now();
    !l && p - i < 500 || (i = p, s(
      new CustomEvent("progress", {
        detail: {
          loaded: n,
          total: r
        }
      })
    ));
  }
  return new ReadableStream({
    async start(n) {
      if (!e) {
        n.close();
        return;
      }
      const r = e.getReader();
      let l = 0;
      for (; ; )
        try {
          const { done: p, value: c } = await r.read();
          if (c && (l += c.byteLength), p) {
            o(l, l, p), n.close();
            break;
          } else
            o(l, t, p), n.enqueue(c);
        } catch (p) {
          ue.error({ e: p }), n.error(p);
          break;
        }
    }
  });
}
const Ms = 1e-5;
class Ts extends EventTarget {
  constructor({
    weight: t = 1,
    caption: s = "",
    fillTime: i = 4
  } = {}) {
    super(), this._selfWeight = 1, this._selfDone = !1, this._selfProgress = 0, this._selfCaption = "", this._isFilling = !1, this._subTrackers = [], this._weight = t, this._selfCaption = s, this._fillTime = i;
  }
  /**
   * Creates a new sub-tracker with a specific weight.
   *
   * The weight determines what percentage of the overall progress
   * the sub-tracker represents. For example, if the main tracker is
   * monitoring a process that has two stages, and the first stage
   * is expected to take twice as long as the second stage, you could
   * create the first sub-tracker with a weight of 0.67 and the second
   * sub-tracker with a weight of 0.33.
   *
   * The caption is an optional string that describes the current stage
   * of the operation. If provided, it will be used as the progress caption
   * for the sub-tracker. If not provided, the main tracker will look for
   * the next sub-tracker with a non-empty caption and use that as the progress
   * caption instead.
   *
   * Returns the newly-created sub-tracker.
   *
   * @throws {Error} If the weight of the new stage would cause the total weight of all stages to exceed 1.
   *
   * @param weight The weight of the new stage, as a decimal value between 0 and 1.
   * @param caption The caption for the new stage, which will be used as the progress caption for the sub-tracker.
   *
   * @example
   * ```ts
   * const tracker = new ProgressTracker();
   * const subTracker1 = tracker.stage(0.67, 'Slow stage');
   * const subTracker2 = tracker.stage(0.33, 'Fast stage');
   *
   * subTracker2.set(50);
   * subTracker1.set(75);
   * subTracker2.set(100);
   * subTracker1.set(100);
   * ```
   */
  stage(t, s = "") {
    if (t || (t = this._selfWeight), this._selfWeight - t < -Ms)
      throw new Error(
        `Cannot add a stage with weight ${t} as the total weight of registered stages would exceed 1.`
      );
    this._selfWeight -= t;
    const i = new Ts({
      caption: s,
      weight: t,
      fillTime: this._fillTime
    });
    return this._subTrackers.push(i), i.addEventListener("progress", () => this.notifyProgress()), i.addEventListener("done", () => {
      this.done && this.notifyDone();
    }), i;
  }
  /**
   * Fills the progress bar slowly over time, simulating progress.
   *
   * The progress bar is filled in a 100 steps, and each step, the progress
   * is increased by 1. If `stopBeforeFinishing` is true, the progress bar
   * will stop filling when it reaches 99% so that you can call `finish()`
   * explicitly.
   *
   * If the progress bar is filling or already filled, this method does nothing.
   *
   * @example
   * ```ts
   * const progress = new ProgressTracker({ caption: 'Processing...' });
   * progress.fillSlowly();
   * ```
   *
   * @param options Optional options.
   */
  fillSlowly({ stopBeforeFinishing: t = !0 } = {}) {
    if (this._isFilling)
      return;
    this._isFilling = !0;
    const i = this._fillTime / 100;
    this._fillInterval = setInterval(() => {
      this.set(this._selfProgress + 1), t && this._selfProgress >= 99 && clearInterval(this._fillInterval);
    }, i);
  }
  set(t) {
    this._selfProgress = Math.min(t, 100), this.notifyProgress(), this._selfProgress + Ms >= 100 && this.finish();
  }
  finish() {
    this._fillInterval && clearInterval(this._fillInterval), this._selfDone = !0, this._selfProgress = 100, this._isFilling = !1, this._fillInterval = void 0, this.notifyProgress(), this.notifyDone();
  }
  get caption() {
    for (let t = this._subTrackers.length - 1; t >= 0; t--)
      if (!this._subTrackers[t].done) {
        const s = this._subTrackers[t].caption;
        if (s)
          return s;
      }
    return this._selfCaption;
  }
  setCaption(t) {
    this._selfCaption = t, this.notifyProgress();
  }
  get done() {
    return this.progress + Ms >= 100;
  }
  get progress() {
    if (this._selfDone)
      return 100;
    const t = this._subTrackers.reduce(
      (s, i) => s + i.progress * i.weight,
      this._selfProgress * this._selfWeight
    );
    return Math.round(t * 1e4) / 1e4;
  }
  get weight() {
    return this._weight;
  }
  get observer() {
    return this._progressObserver || (this._progressObserver = (t) => {
      this.set(t);
    }), this._progressObserver;
  }
  get loadingListener() {
    return this._loadingListener || (this._loadingListener = (t) => {
      this.set(t.detail.loaded / t.detail.total * 100);
    }), this._loadingListener;
  }
  pipe(t) {
    t.setProgress({
      progress: this.progress,
      caption: this.caption
    }), this.addEventListener("progress", (s) => {
      t.setProgress({
        progress: s.detail.progress,
        caption: s.detail.caption
      });
    }), this.addEventListener("done", () => {
      t.setLoaded();
    });
  }
  addEventListener(t, s) {
    super.addEventListener(t, s);
  }
  removeEventListener(t, s) {
    super.removeEventListener(t, s);
  }
  notifyProgress() {
    const t = this;
    this.dispatchEvent(
      new CustomEvent("progress", {
        detail: {
          get progress() {
            return t.progress;
          },
          get caption() {
            return t.caption;
          }
        }
      })
    );
  }
  notifyDone() {
    this.dispatchEvent(new CustomEvent("done"));
  }
}
const Ko = Symbol("SleepFinished");
function Jl(e) {
  return new Promise((t) => {
    setTimeout(() => t(Ko), e);
  });
}
class Kl extends Error {
  constructor() {
    super("Acquiring lock timed out");
  }
}
class Dr {
  constructor({ concurrency: t, timeout: s }) {
    this._running = 0, this.concurrency = t, this.timeout = s, this.queue = [];
  }
  get remaining() {
    return this.concurrency - this.running;
  }
  get running() {
    return this._running;
  }
  async acquire() {
    if (this._running >= this.concurrency) {
      const s = new Promise((i) => {
        this.queue.push(i);
      });
      if (this.timeout !== void 0) {
        const i = this.queue.at(-1);
        if (await Promise.race([
          s,
          Jl(this.timeout)
        ]) === Ko)
          throw this.queue.splice(this.queue.indexOf(i), 1), new Kl();
      } else
        await s;
    }
    this._running++;
    let t = !1;
    return () => {
      t || (t = !0, this._running--, this.queue.length > 0 && this.queue.shift()());
    };
  }
  async run(t) {
    const s = await this.acquire();
    try {
      return await t();
    } finally {
      s();
    }
  }
}
function ne(...e) {
  function t(n) {
    return n.substring(n.length - 1) === "/";
  }
  let s = e.join("/");
  const i = s[0] === "/", o = t(s);
  return s = dt(s), !s && !i && (s = "."), s && o && !t(s) && (s += "/"), s;
}
function Xo(e, t) {
  if (e.includes("\0") || t.includes("\0"))
    return;
  const s = dt(t);
  if (!s)
    return;
  const i = dt(
    e.startsWith("/") ? e : ne(s, e)
  );
  if (!(i === s || !Ql(s, i)))
    return i;
}
function hr(e) {
  if (e === "/")
    return "/";
  e = dt(e);
  const t = e.lastIndexOf("/");
  return t === -1 ? "" : t === 0 ? "/" : e.substr(0, t);
}
function Et(e) {
  if (e === "/")
    return "/";
  e = dt(e);
  const t = e.lastIndexOf("/");
  return t === -1 ? e : e.substr(t + 1);
}
function dt(e) {
  const t = e[0] === "/";
  return e = Xl(
    e.split("/").filter((s) => !!s),
    !t
  ).join("/"), (t ? "/" : "") + e.replace(/\/$/, "");
}
function Xl(e, t) {
  let s = 0;
  for (let i = e.length - 1; i >= 0; i--) {
    const o = e[i];
    o === "." ? e.splice(i, 1) : o === ".." ? (e.splice(i, 1), s++) : s && (e.splice(i, 1), s--);
  }
  if (t)
    for (; s; s--)
      e.unshift("..");
  return e;
}
function Ql(e, t) {
  return e === "/" ? !0 : (e = dt(e), t = dt(t), t.startsWith(e + "/") || t === e);
}
const Bs = Symbol.for(
  "@php-wasm/php-event-stdin-transfer"
);
function Qo(e = 36, t = "!@#$%^&*()_+=-[]/.,<>?") {
  const s = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" + t;
  let i = "";
  for (let o = e; o > 0; --o)
    i += s[Math.floor(Math.random() * s.length)];
  return i;
}
function ds(e) {
  if (e < 1024)
    return `${e} B`;
  const t = e / 1024 / 1024;
  return t >= 1 ? `${t.toFixed(1)} MB` : `${(e / 1024).toFixed(0)} KB`;
}
function Tr() {
  return Qo(36, "-_");
}
function ep(e) {
  return tp(new TextEncoder().encode(e));
}
function tp(e) {
  const s = [];
  for (let i = 0; i < e.length; i += 65536)
    s.push(String.fromCharCode(...e.subarray(i, i + 65536)));
  return btoa(s.join(""));
}
function Ce(e) {
  return `json_decode(base64_decode('${ep(
    JSON.stringify(e)
  )}'), true)`;
}
function Ur(e) {
  const t = {};
  for (const s in e)
    t[s] = Ce(e[s]);
  return t;
}
(function() {
  var e;
  return typeof process < "u" && ((e = process.release) == null ? void 0 : e.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? "WORKER" : "NODE";
})();
const rp = {
  500: "Internal Server Error",
  502: "Bad Gateway",
  404: "Not Found",
  403: "Forbidden",
  401: "Unauthorized",
  400: "Bad Request",
  301: "Moved Permanently",
  302: "Found",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  204: "No Content",
  201: "Created",
  200: "OK"
};
var Ir, Fr;
const Os = class Os {
  constructor(t, s, i, o) {
    /**
     * Headers stream that doesn't get locked when the consumer
     * reads the parsed headers. api.ts transfers the obj.getHeadersStream(),
     * and boot-playground-remote.ts copies the streamedResponse.headers.
     * Both streams must be readable when the StreamedPHPResponse is transferred
     * from the worker thread into the service worker.
     */
    js(this, Ir);
    /**
     * Headers stream reserved for internal parsing.
     */
    js(this, Fr);
    this.cachedParsedHeaders = null, this.cachedStdoutBytes = null, this.cachedStderrText = null;
    const [n, r] = t.tee();
    qs(this, Ir, n), qs(this, Fr, r), this.stdout = s, this.stderr = i, this.exitCode = o;
  }
  /**
   * Creates a StreamedPHPResponse from a buffered PHPResponse.
   * Useful for unifying response handling when both types may be returned.
   */
  static fromPHPResponse(t) {
    const s = new ReadableStream({
      start(l) {
        l.enqueue(t.bytes), l.close();
      }
    }), i = [];
    for (const [l, p] of Object.entries(t.headers))
      for (const c of p)
        i.push(`${l}: ${c}`);
    const o = JSON.stringify({
      status: t.httpStatusCode,
      headers: i
    }), n = new ReadableStream({
      start(l) {
        l.enqueue(new TextEncoder().encode(o)), l.close();
      }
    }), r = new ReadableStream({
      start(l) {
        t.errors.length > 0 && l.enqueue(
          new TextEncoder().encode(t.errors)
        ), l.close();
      }
    });
    return new Os(
      n,
      s,
      r,
      Promise.resolve(t.exitCode)
    );
  }
  /**
   * Creates a StreamedPHPResponse for a given HTTP status code.
   * Shorthand for `StreamedPHPResponse.fromPHPResponse(PHPResponse.forHttpCode(...))`.
   */
  static forHttpCode(t, s = "") {
    return Os.fromPHPResponse(
      fr.forHttpCode(t, s)
    );
  }
  /**
   * Returns the raw headers stream for serialization purposes.
   * For parsed headers, use the `headers` property instead.
   */
  getHeadersStream() {
    return Us(this, Ir);
  }
  /**
   * True if the response is successful (HTTP status code 200-399),
   * false otherwise.
   */
  async ok() {
    try {
      const t = await this.httpStatusCode;
      return t >= 200 && t < 400;
    } catch {
      return !1;
    }
  }
  /**
   * Resolves when the response has finished processing – either successfully or not.
   */
  get finished() {
    return Promise.allSettled([this.exitCode.finally(() => {
    })]).then(
      () => {
      }
    );
  }
  /**
   * Resolves once HTTP headers are available.
   */
  get headers() {
    return this.getParsedHeaders().then((t) => t.headers);
  }
  /**
   * Resolves once HTTP status code is available.
   */
  get httpStatusCode() {
    return this.getParsedHeaders().then((t) => t.httpStatusCode).then((t) => t !== void 0 ? t : this.getParsedHeaders().then(
      (s) => s.httpStatusCode,
      () => 200
    )).catch(() => 500);
  }
  /**
   * Exposes the stdout bytes as they're produced by the PHP instance
   */
  get stdoutText() {
    return this.stdoutBytes.then(
      (t) => new TextDecoder().decode(t)
    );
  }
  /**
   * Exposes the stdout bytes as they're produced by the PHP instance
   */
  get stdoutBytes() {
    return this.cachedStdoutBytes || (this.cachedStdoutBytes = np(this.stdout)), this.cachedStdoutBytes;
  }
  /**
   * Exposes the stderr bytes as they're produced by the PHP instance
   */
  get stderrText() {
    return this.cachedStderrText || (this.cachedStderrText = ea(this.stderr)), this.cachedStderrText;
  }
  async getParsedHeaders() {
    return this.cachedParsedHeaders || (this.cachedParsedHeaders = sp(
      Us(this, Fr)
    )), await this.cachedParsedHeaders;
  }
};
Ir = new WeakMap(), Fr = new WeakMap();
let kr = Os;
async function sp(e) {
  const t = await ea(e);
  let s;
  try {
    s = JSON.parse(t);
  } catch {
    return { headers: {}, httpStatusCode: 200 };
  }
  const i = {};
  for (const o of s.headers) {
    if (!o.includes(": "))
      continue;
    const n = o.indexOf(": "), r = o.substring(0, n).toLowerCase(), l = o.substring(n + 2);
    r in i || (i[r] = []), i[r].push(l);
  }
  return {
    headers: i,
    httpStatusCode: s.status
  };
}
async function ea(e) {
  const t = e.pipeThrough(new TextDecoderStream()).getReader(), s = [];
  for (; ; ) {
    const { done: i, value: o } = await t.read();
    if (i)
      return s.join("");
    o && s.push(o);
  }
}
async function np(e) {
  const t = e.getReader(), s = [];
  for (; ; ) {
    const { done: i, value: o } = await t.read();
    if (i) {
      const n = s.reduce(
        (p, c) => p + c.byteLength,
        0
      ), r = new Uint8Array(n);
      let l = 0;
      for (const p of s)
        r.set(p, l), l += p.byteLength;
      return r;
    }
    o && s.push(o);
  }
}
class fr {
  constructor(t, s, i, o = "", n = 0) {
    this.httpStatusCode = t, this.headers = s, this.bytes = i, this.exitCode = n, this.errors = o;
  }
  static forHttpCode(t, s = "") {
    return new fr(
      t,
      {},
      new TextEncoder().encode(
        s || rp[t] || ""
      )
    );
  }
  static fromRawData(t) {
    return new fr(
      t.httpStatusCode,
      t.headers,
      t.bytes,
      t.errors,
      t.exitCode
    );
  }
  static async fromStreamedResponse(t) {
    return await t.finished, new fr(
      await t.httpStatusCode,
      await t.headers,
      await t.stdoutBytes,
      await t.stderrText,
      await t.exitCode
    );
  }
  /**
   * True if the response is successful (HTTP status code 200-399),
   * false otherwise.
   */
  ok() {
    return this.httpStatusCode >= 200 && this.httpStatusCode < 400;
  }
  toRawData() {
    return {
      headers: this.headers,
      bytes: this.bytes,
      errors: this.errors,
      exitCode: this.exitCode,
      httpStatusCode: this.httpStatusCode
    };
  }
  /**
   * Response body as JSON.
   */
  get json() {
    return JSON.parse(this.text);
  }
  /**
   * Response body as text.
   */
  get text() {
    return new TextDecoder().decode(this.bytes);
  }
}
const gi = "/internal/shared/php.ini", { hasOwnProperty: Hs } = Object.prototype, ta = (e, t = {}) => {
  typeof t == "string" && (t = { section: t }), t.align = t.align === !0, t.newline = t.newline === !0, t.sort = t.sort === !0, t.whitespace = t.whitespace === !0 || t.align === !0, t.platform = t.platform || typeof process < "u" && process.platform, t.bracketedArray = t.bracketedArray !== !1;
  const s = t.platform === "win32" ? `\r
` : `
`, i = t.whitespace ? " = " : "=", o = [], n = t.sort ? Object.keys(e).sort() : Object.keys(e);
  let r = 0;
  t.align && (r = Rt(
    n.filter((c) => e[c] === null || Array.isArray(e[c]) || typeof e[c] != "object").map((c) => Array.isArray(e[c]) ? `${c}[]` : c).concat([""]).reduce((c, f) => Rt(c).length >= Rt(f).length ? c : f)
  ).length);
  let l = "";
  const p = t.bracketedArray ? "[]" : "";
  for (const c of n) {
    const f = e[c];
    if (f && Array.isArray(f))
      for (const u of f)
        l += Rt(`${c}${p}`).padEnd(r, " ") + i + Rt(u) + s;
    else f && typeof f == "object" ? o.push(c) : l += Rt(c).padEnd(r, " ") + i + Rt(f) + s;
  }
  t.section && l.length && (l = "[" + Rt(t.section) + "]" + (t.newline ? s + s : s) + l);
  for (const c of o) {
    const f = ra(c, ".").join("\\."), u = (t.section ? t.section + "." : "") + f, g = ta(e[c], {
      ...t,
      section: u
    });
    l.length && g.length && (l += s), l += g;
  }
  return l;
};
function ra(e, t) {
  var s = 0, i = 0, o = 0, n = [];
  do
    if (o = e.indexOf(t, s), o !== -1) {
      if (s = o + t.length, o > 0 && e[o - 1] === "\\")
        continue;
      n.push(e.slice(i, o)), i = o + t.length;
    }
  while (o !== -1);
  return n.push(e.slice(i)), n;
}
const ip = (e, t = {}) => {
  t.bracketedArray = t.bracketedArray !== !1;
  const s = /* @__PURE__ */ Object.create(null);
  let i = s, o = null;
  const n = /^\[([^\]]*)\]\s*$|^([^=]+)(=(.*))?$/i, r = e.split(/[\r\n]+/g), l = {};
  for (const c of r) {
    if (!c || c.match(/^\s*[;#]/) || c.match(/^\s*$/))
      continue;
    const f = c.match(n);
    if (!f)
      continue;
    if (f[1] !== void 0) {
      if (o = Vs(f[1]), o === "__proto__") {
        i = /* @__PURE__ */ Object.create(null);
        continue;
      }
      i = s[o] = s[o] || /* @__PURE__ */ Object.create(null);
      continue;
    }
    const u = Vs(f[2]);
    let g;
    t.bracketedArray ? g = u.length > 2 && u.slice(-2) === "[]" : (l[u] = ((l == null ? void 0 : l[u]) || 0) + 1, g = l[u] > 1);
    const w = g ? u.slice(0, -2) : u;
    if (w === "__proto__")
      continue;
    const O = f[3] ? Vs(f[4]) : !0, m = O === "true" || O === "false" || O === "null" ? JSON.parse(O) : O;
    g && (Hs.call(i, w) ? Array.isArray(i[w]) || (i[w] = [i[w]]) : i[w] = []), Array.isArray(i[w]) ? i[w].push(m) : i[w] = m;
  }
  const p = [];
  for (const c of Object.keys(s)) {
    if (!Hs.call(s, c) || typeof s[c] != "object" || Array.isArray(s[c]))
      continue;
    const f = ra(c, ".");
    i = s;
    const u = f.pop(), g = u.replace(/\\\./g, ".");
    for (const w of f)
      w !== "__proto__" && ((!Hs.call(i, w) || typeof i[w] != "object") && (i[w] = /* @__PURE__ */ Object.create(null)), i = i[w]);
    i === s && g === u || (i[g] = s[c], p.push(c));
  }
  for (const c of p)
    delete s[c];
  return s;
}, sa = (e) => e.startsWith('"') && e.endsWith('"') || e.startsWith("'") && e.endsWith("'"), Rt = (e) => typeof e != "string" || e.match(/[=\r\n]/) || e.match(/^\[/) || e.length > 1 && sa(e) || e !== e.trim() ? JSON.stringify(e) : e.split(";").join("\\;").split("#").join("\\#"), Vs = (e) => {
  if (e = (e || "").trim(), sa(e)) {
    e.charAt(0) === "'" && (e = e.slice(1, -1));
    try {
      e = JSON.parse(e);
    } catch {
    }
  } else {
    let t = !1, s = "";
    for (let i = 0, o = e.length; i < o; i++) {
      const n = e.charAt(i);
      if (t)
        "\\;#".indexOf(n) !== -1 ? s += n : s += "\\" + n, t = !1;
      else {
        if (";#".indexOf(n) !== -1)
          break;
        n === "\\" ? t = !0 : s += n;
      }
    }
    return t && (s += "\\"), s.trim();
  }
  return e;
};
var _i = {
  parse: ip,
  stringify: ta
};
async function cy(e, t) {
  const s = _i.parse(await e.readFileAsText(gi));
  for (const [i, o] of Object.entries(t))
    o == null ? delete s[i] : s[i] = o;
  await e.writeFile(gi, _i.stringify(s));
}
function op(...e) {
  const t = new Uint8Array(
    e.reduce((i, o) => i + o.length, 0)
  );
  let s = 0;
  for (const i of e)
    t.set(i, s), s += i.length;
  return t;
}
function ap(e) {
  {
    let t = new Uint8Array();
    return new TransformStream({
      transform(s) {
        t = op(t, s);
      },
      flush(s) {
        s.enqueue(t);
      }
    });
  }
}
async function Dn(e, t) {
  return await e.pipeThrough(ap()).getReader().read().then(({ value: s }) => s);
}
async function lp(e, t) {
  return new File([await Dn(t)], e);
}
function pp(e) {
  if (e instanceof ReadableStream)
    return e;
  let t;
  return Symbol.asyncIterator in e ? t = e[Symbol.asyncIterator]() : Symbol.iterator in e ? t = e[Symbol.iterator]() : t = e, new ReadableStream({
    async pull(s) {
      const { done: i, value: o } = await t.next();
      if (i) {
        s.close();
        return;
      }
      s.enqueue(o);
    }
  });
}
class Xt extends File {
  static fromArrayBuffer(t, s, i) {
    return new Xt(
      new ReadableStream({
        start(o) {
          o.enqueue(new Uint8Array(t)), o.close();
        }
      }),
      s,
      i
    );
  }
  /**
   * Creates a new StreamedFile instance.
   *
   * @param readableStream The readable stream containing the file data.
   * @param name The name of the file.
   * @param options An object containing options such as the MIME type and file size.
   */
  constructor(t, s, i) {
    super([], s, { type: i == null ? void 0 : i.type }), this.readableStream = t, this.filesize = i == null ? void 0 : i.filesize;
  }
  /**
   * Overrides the slice() method of the File class.
   *
   * @returns A Blob representing a portion of the file.
   */
  slice() {
    throw new Error("slice() is not possible on a StreamedFile");
  }
  /**
   * Returns the readable stream associated with the file.
   *
   * @returns The readable stream.
   */
  stream() {
    return this.readableStream;
  }
  /**
   * Loads the file data into memory and then returns it as a string.
   *
   * @returns File data as text.
   */
  async text() {
    return new TextDecoder().decode(await this.arrayBuffer());
  }
  /**
   * Loads the file data into memory and then returns it as an ArrayBuffer.
   *
   * @returns File data as an ArrayBuffer.
   */
  async arrayBuffer() {
    return await Dn(this.stream());
  }
}
ReadableStream.prototype[Symbol.asyncIterator] || (ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
  const e = this.getReader();
  try {
    for (; ; ) {
      const { done: t, value: s } = await e.read();
      if (t)
        return;
      yield s;
    }
  } finally {
    e.releaseLock();
  }
}, ReadableStream.prototype.iterate = // @ts-ignore
ReadableStream.prototype[Symbol.asyncIterator]);
const cp = 67324752, fp = 33639248, up = 101010256, dp = 0, mp = 8;
new Dr({ concurrency: 10 });
function hp(e) {
  return pp(e).pipeThrough(yp());
}
function yp() {
  const e = /* @__PURE__ */ new Map();
  let t = 0;
  return new TransformStream({
    async transform(s, i) {
      const o = new Uint8Array(await s.arrayBuffer());
      let n = await Dn(
        new Blob([o]).stream().pipeThrough(new CompressionStream("gzip"))
      );
      const r = new DataView(n.buffer).getUint32(
        n.byteLength - 8,
        !0
      );
      n = n.slice(10, n.byteLength - 8);
      const l = new TextEncoder().encode(s.name), p = {
        signature: cp,
        version: 2,
        generalPurpose: 0,
        compressionMethod: s.type === "directory" || n.byteLength === 0 ? dp : mp,
        lastModifiedTime: 0,
        lastModifiedDate: 0,
        crc: r,
        compressedSize: n.byteLength,
        uncompressedSize: o.byteLength,
        path: l,
        extra: new Uint8Array(0)
      };
      e.set(t, p);
      const c = gp(p);
      i.enqueue(c), t += c.byteLength, i.enqueue(n), t += n.byteLength;
    },
    flush(s) {
      const i = t;
      let o = 0;
      for (const [
        l,
        p
      ] of e.entries()) {
        const c = {
          ...p,
          signature: fp,
          fileComment: new Uint8Array(0),
          diskNumber: 0,
          internalAttributes: 0,
          externalAttributes: 0
        }, f = _p(
          c,
          l
        );
        s.enqueue(f), o += f.byteLength;
      }
      const n = {
        signature: up,
        numberOfDisks: 0,
        centralDirectoryOffset: i,
        centralDirectorySize: o,
        centralDirectoryStartDisk: 0,
        numberCentralDirectoryRecordsOnThisDisk: e.size,
        numberCentralDirectoryRecords: e.size,
        comment: new Uint8Array(0)
      }, r = wp(n);
      s.enqueue(r), e.clear();
    }
  });
}
function gp(e) {
  const t = new ArrayBuffer(
    30 + e.path.byteLength + e.extra.byteLength
  ), s = new DataView(t);
  s.setUint32(0, e.signature, !0), s.setUint16(4, e.version, !0), s.setUint16(6, e.generalPurpose, !0), s.setUint16(8, e.compressionMethod, !0), s.setUint16(10, e.lastModifiedDate, !0), s.setUint16(12, e.lastModifiedTime, !0), s.setUint32(14, e.crc, !0), s.setUint32(18, e.compressedSize, !0), s.setUint32(22, e.uncompressedSize, !0), s.setUint16(26, e.path.byteLength, !0), s.setUint16(28, e.extra.byteLength, !0);
  const i = new Uint8Array(t);
  return i.set(e.path, 30), i.set(e.extra, 30 + e.path.byteLength), i;
}
function _p(e, t) {
  const s = new ArrayBuffer(
    46 + e.path.byteLength + e.extra.byteLength
  ), i = new DataView(s);
  i.setUint32(0, e.signature, !0), i.setUint16(4, e.versionCreated, !0), i.setUint16(6, e.versionNeeded, !0), i.setUint16(8, e.generalPurpose, !0), i.setUint16(10, e.compressionMethod, !0), i.setUint16(12, e.lastModifiedDate, !0), i.setUint16(14, e.lastModifiedTime, !0), i.setUint32(16, e.crc, !0), i.setUint32(20, e.compressedSize, !0), i.setUint32(24, e.uncompressedSize, !0), i.setUint16(28, e.path.byteLength, !0), i.setUint16(30, e.extra.byteLength, !0), i.setUint16(32, e.fileComment.byteLength, !0), i.setUint16(34, e.diskNumber, !0), i.setUint16(36, e.internalAttributes, !0), i.setUint32(38, e.externalAttributes, !0), i.setUint32(42, t, !0);
  const o = new Uint8Array(s);
  return o.set(e.path, 46), o.set(e.extra, 46 + e.path.byteLength), o;
}
function wp(e) {
  const t = new ArrayBuffer(22 + e.comment.byteLength), s = new DataView(t);
  s.setUint32(0, e.signature, !0), s.setUint16(4, e.numberOfDisks, !0), s.setUint16(6, e.centralDirectoryStartDisk, !0), s.setUint16(8, e.numberCentralDirectoryRecordsOnThisDisk, !0), s.setUint16(10, e.numberCentralDirectoryRecords, !0), s.setUint32(12, e.centralDirectorySize, !0), s.setUint32(16, e.centralDirectoryOffset, !0), s.setUint16(20, e.comment.byteLength, !0);
  const i = new Uint8Array(t);
  return i.set(e.comment, 22), i;
}
const bp = "next", Un = [
  "8.5",
  "8.4",
  "8.3",
  "8.2",
  "8.1",
  "8.0",
  "7.4"
], jn = Un[0], fy = Un, vp = ["5.2"], Sr = [
  bp,
  ...Un,
  ...vp
];
async function qn(e, t, s, { rmRoot: i = !1 } = {}) {
  const o = na(t, s);
  i && await e.isDir(t) && await e.rmdir(t, { recursive: !0 });
  for (const [n, r] of o)
    await e.fileExists(hr(n)) || await e.mkdir(hr(n)), await e.writeFile(n, r);
}
function na(e, t) {
  return Object.entries(t).flatMap(([s, i]) => {
    const o = Xo(s, e);
    if (!o)
      throw new Error(
        `Invalid file tree path ${JSON.stringify(
          s
        )}: it must resolve inside ${JSON.stringify(e)}.`
      );
    return i instanceof Uint8Array || typeof i == "string" ? [[o, i]] : na(o, i);
  });
}
/**
 * Original, unmodified Comlink library from Google:
 *
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const ia = Symbol("Comlink.proxy"), oa = Symbol("Comlink.endpoint"), Pp = Symbol("Comlink.releaseProxy"), zs = Symbol("Comlink.finalizer"), os = Symbol("Comlink.thrown");
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const ms = {
  RAW: "RAW",
  HANDLER: "HANDLER"
}, Qe = {
  GET: "GET",
  SET: "SET",
  APPLY: "APPLY",
  CONSTRUCT: "CONSTRUCT",
  ENDPOINT: "ENDPOINT",
  RELEASE: "RELEASE"
}, aa = (e) => typeof e == "object" && e !== null || typeof e == "function", xp = {
  canHandle: (e) => aa(e) && e[ia],
  serialize(e) {
    const { port1: t, port2: s } = new MessageChannel();
    return Wn(e, t), [s, [s]];
  },
  deserialize(e) {
    return e.start(), hs(e);
  }
}, $p = {
  canHandle: (e) => aa(e) && os in e,
  serialize({ value: e }) {
    let t;
    return e instanceof Error ? t = {
      isError: !0,
      value: {
        message: e.message,
        name: e.name,
        stack: e.stack
      }
    } : t = { isError: !1, value: e }, [t, []];
  },
  deserialize(e) {
    throw e.isError ? Object.assign(
      new Error(e.value.message),
      e.value
    ) : e.value;
  }
}, nt = /* @__PURE__ */ new Map([
  ["proxy", xp],
  ["throw", $p]
]);
function kp(e, t) {
  for (const s of e)
    if (t === s || s === "*" || s instanceof RegExp && s.test(t))
      return !0;
  return !1;
}
function Wn(e, t = globalThis, s = ["*"], i) {
  t.addEventListener("message", function o(n) {
    if (!n || !n.data)
      return;
    if (!kp(s, n.origin)) {
      console.warn(`Invalid origin '${n.origin}' for comlink proxy`);
      return;
    }
    const { id: r, type: l, path: p } = {
      path: [],
      ...n.data
    }, c = (n.data.argumentList || []).map(Gt);
    let f;
    try {
      const u = p.slice(0, -1).reduce((w, O) => w[O], e), g = p.reduce((w, O) => w[O], e);
      switch (l) {
        case Qe.GET:
          f = g;
          break;
        case Qe.SET:
          u[p.slice(-1)[0]] = Gt(
            n.data.value
          ), f = !0;
          break;
        case Qe.APPLY:
          f = g.apply(u, c);
          break;
        case Qe.CONSTRUCT:
          {
            const w = new g(...c);
            f = fa(w);
          }
          break;
        case Qe.ENDPOINT:
          {
            const { port1: w, port2: O } = new MessageChannel();
            Wn(e, O), f = Ap(w, [w]);
          }
          break;
        case Qe.RELEASE:
          f = void 0;
          break;
        default:
          return;
      }
    } catch (u) {
      f = { value: u, [os]: 0 };
    }
    Promise.resolve(f).catch((u) => ({ value: u, [os]: 0 })).then((u) => {
      const [g, w] = _s(u);
      t.postMessage({ ...g, id: r }, w), l === Qe.RELEASE && (t.removeEventListener("message", o), la(t), zs in e && typeof e[zs] == "function" && e[zs]());
    }).catch(() => {
      const [u, g] = _s({
        value: new TypeError("Unserializable return value"),
        [os]: 0
      });
      t.postMessage({ ...u, id: r }, g);
    }).finally(() => {
    });
  }), t.start && t.start();
}
function Ep(e) {
  return e.constructor.name === "MessagePort";
}
function la(e) {
  Ep(e) && e.close();
}
function hs(e, t) {
  const s = /* @__PURE__ */ new Map();
  return e.addEventListener("message", function(o) {
    const { data: n } = o;
    if (!n || !n.id)
      return;
    const r = s.get(n.id);
    if (r)
      try {
        r(n);
      } finally {
        s.delete(n.id);
      }
  }), wn(e, s, [], t);
}
function Yr(e) {
  if (e)
    throw new Error("Proxy has been released and is not useable");
}
function pa(e) {
  return lr(e, /* @__PURE__ */ new Map(), {
    type: Qe.RELEASE
  }).then(() => {
    la(e);
  });
}
const ys = /* @__PURE__ */ new WeakMap(), gs = "FinalizationRegistry" in globalThis && new FinalizationRegistry((e) => {
  const t = (ys.get(e) || 0) - 1;
  ys.set(e, t), t === 0 && pa(e);
});
function Op(e, t) {
  const s = (ys.get(t) || 0) + 1;
  ys.set(t, s), gs && gs.register(e, t, e);
}
function Tp(e) {
  gs && gs.unregister(e);
}
function wn(e, t, s = [], i = function() {
}) {
  let o = !1;
  const n = new Proxy(i, {
    get(r, l) {
      if (Yr(o), l === Pp)
        return () => {
          Tp(n), pa(e), t.clear(), o = !0;
        };
      if (l === "then") {
        if (s.length === 0)
          return { then: () => n };
        const p = lr(e, t, {
          type: Qe.GET,
          path: s.map((c) => c.toString())
        }).then(Gt);
        return p.then.bind(p);
      }
      return wn(e, t, [...s, l]);
    },
    set(r, l, p) {
      Yr(o);
      const [c, f] = _s(p);
      return lr(
        e,
        t,
        {
          type: Qe.SET,
          path: [...s, l].map((u) => u.toString()),
          value: c
        },
        f
      ).then(Gt);
    },
    apply(r, l, p) {
      Yr(o);
      const c = s[s.length - 1];
      if (c === oa)
        return lr(e, t, {
          type: Qe.ENDPOINT
        }).then(Gt);
      if (c === "bind")
        return wn(e, t, s.slice(0, -1));
      const [f, u] = wi(p);
      return lr(
        e,
        t,
        {
          type: Qe.APPLY,
          path: s.map((g) => g.toString()),
          argumentList: f
        },
        u
      ).then(Gt);
    },
    construct(r, l) {
      Yr(o);
      const [p, c] = wi(l);
      return lr(
        e,
        t,
        {
          type: Qe.CONSTRUCT,
          path: s.map((f) => f.toString()),
          argumentList: p
        },
        c
      ).then(Gt);
    }
  });
  return Op(n, e), n;
}
function Sp(e) {
  return Array.prototype.concat.apply([], e);
}
function wi(e) {
  const t = e.map(_s);
  return [t.map((s) => s[0]), Sp(t.map((s) => s[1]))];
}
const ca = /* @__PURE__ */ new WeakMap();
function Ap(e, t) {
  return ca.set(e, t), e;
}
function fa(e) {
  return Object.assign(e, { [ia]: !0 });
}
function Rp(e, t = globalThis, s = "*") {
  return {
    postMessage: (i, o) => e.postMessage(i, s, o),
    addEventListener: t.addEventListener.bind(t),
    removeEventListener: t.removeEventListener.bind(t)
  };
}
function _s(e) {
  for (const [t, s] of nt)
    if (s.canHandle(e)) {
      const [i, o] = s.serialize(e);
      return [
        {
          type: ms.HANDLER,
          name: t,
          value: i
        },
        o
      ];
    }
  return [
    {
      type: ms.RAW,
      value: e
    },
    ca.get(e) || []
  ];
}
function Gt(e) {
  switch (e.type) {
    case ms.HANDLER:
      return nt.get(e.name).deserialize(e.value);
    case ms.RAW:
      return e.value;
  }
}
function lr(e, t, s, i) {
  return new Promise((o) => {
    const n = Lp();
    t.set(n, o), e.start && e.start(), e.postMessage({ id: n, ...s }, i);
  });
}
function Lp() {
  return new Array(4).fill(0).map(
    () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)
  ).join("-");
}
function Cp(e) {
  const t = /* @__PURE__ */ new WeakMap();
  return {
    postMessage: e.postMessage.bind(e),
    addEventListener: (s, i) => {
      const o = (n) => {
        "handleEvent" in i ? i.handleEvent({ data: n }) : i({ data: n });
      };
      e.on("message", o), t.set(i, o);
    },
    removeEventListener: (s, i) => {
      const o = t.get(i);
      o && (e.off("message", o), t.delete(i));
    },
    start: e.start && e.start.bind(e)
  };
}
const Ys = /* @__PURE__ */ new WeakMap();
function Np(e) {
  const t = e || process;
  if (typeof t.send != "function")
    throw new Error(
      "IPC channel is not available. Did you forget to fork the process?"
    );
  const s = t;
  return {
    postMessage(i, o) {
      var n;
      if (o && o.length > 0)
        throw new Error(
          "Transferable objects are not supported for nodeProcessEndpoint"
        );
      (n = s.send) == null || n.call(s, i);
    },
    addEventListener(i, o) {
      const n = typeof o == "function" ? (r) => o({ data: r }) : (r) => o.handleEvent({ data: r });
      Ys.set(o, n), s.addListener(i, n);
    },
    removeEventListener(i, o) {
      const n = Ys.get(o);
      n && (Ys.delete(o), s.removeListener(i, n));
    },
    start() {
    }
  };
}
const Ip = [
  // Native ES errors https://262.ecma-international.org/12.0/#sec-well-known-intrinsic-objects
  Error,
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,
  AggregateError,
  // Built-in errors
  globalThis.DOMException,
  // Node-specific errors
  // https://nodejs.org/api/errors.html
  globalThis.AssertionError,
  globalThis.SystemError
].filter(Boolean).map((e) => [e.name, e]), Fp = new Map(Ip);
class Mn extends Error {
  constructor(t) {
    super(Mn._prepareSuperMessage(t)), this.name = "NonError";
  }
  static _prepareSuperMessage(t) {
    try {
      return JSON.stringify(t);
    } catch {
      return String(t);
    }
  }
}
const Dp = [
  {
    property: "name",
    enumerable: !1
  },
  {
    property: "message",
    enumerable: !1
  },
  {
    property: "stack",
    enumerable: !1
  },
  {
    property: "code",
    enumerable: !0
  },
  {
    property: "cause",
    enumerable: !1
  },
  {
    property: "errors",
    enumerable: !1
  }
], bn = /* @__PURE__ */ new WeakSet(), Up = (e) => {
  bn.add(e);
  const t = e.toJSON();
  return bn.delete(e), t;
}, ua = (e) => {
  const t = Fp.get(e) ?? Error;
  return t === AggregateError ? new t([]) : new t();
}, Bn = ({
  from: e,
  seen: t,
  to: s,
  forceEnumerable: i,
  maxDepth: o,
  depth: n,
  useToJSON: r,
  serialize: l
}) => {
  if (s || (Array.isArray(e) ? s = [] : !l && bi(e) ? s = ua(e.name) : s = {}), t.push(e), n >= o)
    return s;
  if (r && typeof e.toJSON == "function" && !bn.has(e))
    return Up(e);
  const p = (c) => Bn({
    from: c,
    seen: [...t],
    forceEnumerable: i,
    maxDepth: o,
    depth: n,
    useToJSON: r,
    serialize: l
  });
  for (const [c, f] of Object.entries(e)) {
    if (f && f instanceof Uint8Array && f.constructor.name === "Buffer") {
      s[c] = "[object Buffer]";
      continue;
    }
    if (f !== null && typeof f == "object" && typeof f.pipe == "function") {
      s[c] = "[object Stream]";
      continue;
    }
    if (typeof f != "function") {
      if (!f || typeof f != "object") {
        try {
          s[c] = f;
        } catch {
        }
        continue;
      }
      if (!t.includes(e[c])) {
        n++, s[c] = p(e[c]);
        continue;
      }
      s[c] = "[Circular]";
    }
  }
  if (l || s instanceof Error)
    for (const { property: c, enumerable: f } of Dp)
      e[c] !== void 0 && e[c] !== null && Object.defineProperty(s, c, {
        value: bi(e[c]) || Array.isArray(e[c]) ? p(e[c]) : e[c],
        enumerable: i ? !0 : f,
        configurable: !0,
        writable: !0
      });
  return s;
};
function jp(e, t = {}) {
  const { maxDepth: s = Number.POSITIVE_INFINITY, useToJSON: i = !0 } = t;
  return typeof e == "object" && e !== null ? Bn({
    from: e,
    seen: [],
    forceEnumerable: !0,
    maxDepth: s,
    depth: 0,
    useToJSON: i,
    serialize: !0
  }) : typeof e == "function" ? `[Function: ${e.name || "anonymous"}]` : e;
}
function qp(e, t = {}) {
  const { maxDepth: s = Number.POSITIVE_INFINITY } = t;
  return e instanceof Error ? e : Wp(e) ? Bn({
    from: e,
    seen: [],
    to: ua(e.name),
    maxDepth: s,
    depth: 0,
    serialize: !1
  }) : new Mn(e);
}
function bi(e) {
  return !!e && typeof e == "object" && typeof e.name == "string" && typeof e.message == "string" && typeof e.stack == "string";
}
function Wp(e) {
  return !!e && typeof e == "object" && typeof e.message == "string" && !Array.isArray(e);
}
function Hn(e, t = void 0) {
  Hp();
  let s;
  if (typeof process < "u" && typeof process.versions < "u" && typeof process.versions.node < "u")
    if ("postMessage" in e)
      s = Cp(e);
    else if ("send" in e && "addListener" in e)
      s = Np(e);
    else
      throw new Error(
        "consumeAPI: remote does not look like a Worker, MessagePort, or Process"
      );
  else if (e instanceof Worker)
    s = e;
  else {
    const r = Rp(
      e,
      t
    ), l = hs(r);
    s = Bp(
      Mp(l)
    );
  }
  const o = hs(s), n = ma(o);
  return new Proxy(n, {
    get: (r, l) => l === "isConnected" ? async () => {
      for (; ; )
        try {
          await da(o.isConnected(), 200);
          break;
        } catch {
        }
    } : o[l]
  });
}
async function Mp(e) {
  for (; ; )
    try {
      return await da(e.isConnected(), 200), await e[oa]();
    } catch {
    }
}
function Bp(e) {
  let t, s = !1;
  const i = [], o = [];
  return e.then((n) => {
    t = n;
    for (const { type: r, listener: l, options: p } of i)
      t.addEventListener(r, l, p);
    s && t.start();
    for (const { message: r, transfer: l } of o)
      l ? t.postMessage(r, l) : t.postMessage(r);
    o.length = 0;
  }), {
    postMessage(n, r) {
      t ? r ? t.postMessage(n, r) : t.postMessage(n) : o.push({ message: n, transfer: r });
    },
    addEventListener(n, r, l) {
      t ? t.addEventListener(n, r, l) : i.push({ type: n, listener: r, options: l });
    },
    removeEventListener(n, r, l) {
      if (t) {
        t.removeEventListener(n, r, l);
        return;
      }
      const p = i.findIndex(
        (c) => c.type === n && c.listener === r && c.options === l
      );
      p !== -1 && i.splice(p, 1);
    },
    start() {
      t ? t.start() : s = !0;
    }
  };
}
async function da(e, t) {
  return new Promise((s, i) => {
    const o = setTimeout(i, t);
    e.then(
      (n) => {
        clearTimeout(o), s(n);
      },
      (n) => {
        clearTimeout(o), i(n);
      }
    );
  });
}
let vi = !1;
function Hp() {
  if (vi)
    return;
  vi = !0, nt.set("EVENT", {
    canHandle: (o) => o instanceof CustomEvent,
    serialize: (o) => [
      {
        detail: o.detail
      },
      []
    ],
    deserialize: (o) => o
  }), nt.set("FUNCTION", {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    canHandle: (o) => typeof o == "function",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    serialize(o) {
      const { port1: n, port2: r } = new MessageChannel();
      return Wn(o, n), [r, [r]];
    },
    deserialize(o) {
      return o.start(), hs(o);
    }
  }), nt.set("MESSAGE_PORT", {
    canHandle: (o) => o instanceof MessagePort,
    serialize(o) {
      return [o, [o]];
    },
    deserialize(o) {
      return o;
    }
  });
  const e = {
    canHandle: (o) => typeof ReadableStream < "u" && o instanceof ReadableStream,
    serialize(o) {
      if (Pi())
        return [{ stream: o }, [o]];
      const n = Gr(o);
      return [{ port: n }, [n]];
    },
    deserialize(o) {
      return o.stream || Zr(o.port);
    }
  };
  nt.set(
    "READABLE_STREAM",
    e
  );
  const t = {
    canHandle: (o) => typeof o == "object" && o !== null && Bs in o && o[Bs] === !0 && "type" in o && typeof o.type == "string" && "stdin" in o && e.canHandle(o.stdin),
    serialize(o) {
      const [n, r] = e.serialize(o.stdin);
      return [{ ...o, stdin: n }, r];
    },
    deserialize(o) {
      return {
        ...o,
        stdin: e.deserialize(o.stdin),
        [Bs]: !0
      };
    }
  };
  nt.set(
    "EVENT_WITH_READABLE_STDIN",
    t
  ), nt.set("PHPResponse", {
    canHandle: (o) => typeof o == "object" && o !== null && "headers" in o && "bytes" in o && "errors" in o && "exitCode" in o && "httpStatusCode" in o,
    serialize(o) {
      const n = o.toRawData(), r = [];
      return n.bytes.buffer.byteLength > 0 && r.push(n.bytes.buffer), [n, r];
    },
    deserialize(o) {
      return fr.fromRawData(o);
    }
  });
  const s = nt.get("throw"), i = s == null ? void 0 : s.serialize;
  s.serialize = ({ value: o }) => {
    const n = i({ value: o });
    return o.response && (n[0].value.response = o.response), o.source && (n[0].value.source = o.source), n;
  }, nt.set("StreamedPHPResponse", {
    canHandle: (o) => o instanceof kr,
    serialize(o) {
      const n = Pi(), r = Vp(o.exitCode), l = o.getHeadersStream();
      if (n)
        return [
          {
            __type: "StreamedPHPResponse",
            headers: l,
            stdout: o.stdout,
            stderr: o.stderr,
            exitCodePort: r
          },
          [
            l,
            o.stdout,
            o.stderr,
            r
          ]
        ];
      const p = Gr(l), c = Gr(o.stdout), f = Gr(o.stderr);
      return [
        {
          __type: "StreamedPHPResponse",
          headersPort: p,
          stdoutPort: c,
          stderrPort: f,
          exitCodePort: r
        },
        [p, c, f, r]
      ];
    },
    deserialize(o) {
      if (o.headers && o.stdout && o.stderr) {
        const c = xi(
          o.exitCodePort
        );
        return new kr(
          o.headers,
          o.stdout,
          o.stderr,
          c
        );
      }
      const n = Zr(o.headersPort), r = Zr(o.stdoutPort), l = Zr(o.stderrPort), p = xi(o.exitCodePort);
      return new kr(n, r, l, p);
    }
  });
}
let _r;
function Pi() {
  if (typeof ReadableStream > "u" && (_r = !1), _r === void 0)
    try {
      const { port1: e } = new MessageChannel(), t = new ReadableStream();
      e.postMessage(t, [t]);
      try {
        e.close();
      } catch {
      }
      _r = !0;
    } catch {
      _r = !1;
    }
  return _r;
}
function Gr(e) {
  const { port1: t, port2: s } = new MessageChannel(), i = e.getReader(), o = (n) => {
    var r;
    ((r = n.data) == null ? void 0 : r.t) === "cancel" && i.cancel().catch(() => {
    });
  };
  return t.addEventListener("message", o), t.start(), (async () => {
    try {
      for (; ; ) {
        const { done: n, value: r } = await i.read();
        if (n) {
          try {
            t.postMessage({ t: "close" });
          } catch {
          }
          try {
            t.close();
          } catch {
          }
          break;
        }
        if (r) {
          const l = r.slice(), p = l.buffer;
          try {
            t.postMessage({ t: "chunk", b: p }, [
              p
            ]);
          } catch {
            t.postMessage({
              t: "chunk",
              b: l.buffer.slice(0)
            });
          }
        }
      }
    } catch (n) {
      try {
        t.postMessage({ t: "error", m: (n == null ? void 0 : n.message) || String(n) });
      } catch {
      }
    } finally {
      t.removeEventListener("message", o);
      try {
        t.close();
      } catch {
      }
    }
  })(), s;
}
function Zr(e) {
  return new ReadableStream({
    start(t) {
      const s = (o) => {
        const n = o.data;
        if (n)
          switch (n.t) {
            case "chunk":
              try {
                t.enqueue(new Uint8Array(n.b));
              } catch {
                i();
              }
              break;
            case "close":
              Zp(t), i();
              break;
            case "error":
              Gp(
                t,
                new Error(n.m || "Stream error")
              ), i();
              break;
          }
      }, i = () => {
        var o;
        try {
          (o = e.removeEventListener) == null || o.call(e, "message", s);
        } catch {
        }
        try {
          e.onmessage = null;
        } catch {
        }
        try {
          e.close();
        } catch {
        }
      };
      e.addEventListener ? e.addEventListener("message", s) : e.on ? e.on(
        "message",
        (o) => s({ data: o })
      ) : e.onmessage = s, typeof e.start == "function" && e.start();
    },
    cancel() {
      try {
        e.postMessage({ t: "cancel" });
      } catch {
      }
      try {
        e.close();
      } catch {
      }
    }
  });
}
function Vp(e) {
  const { port1: t, port2: s } = new MessageChannel();
  return e.then((i) => {
    try {
      t.postMessage({ t: "resolve", v: i });
    } catch {
    }
  }).catch((i) => {
    try {
      t.postMessage({
        t: "reject",
        m: (i == null ? void 0 : i.message) || String(i)
      });
    } catch {
    }
  }).finally(() => {
    try {
      t.close();
    } catch {
    }
  }), s;
}
function xi(e) {
  return new Promise((t, s) => {
    const i = (n) => {
      const r = n.data;
      r && (r.t === "resolve" ? (o(), t(r.v)) : r.t === "reject" && (o(), s(new Error(r.m || ""))));
    }, o = () => {
      var n;
      try {
        (n = e.removeEventListener) == null || n.call(e, "message", i);
      } catch {
      }
      try {
        e.onmessage = null;
      } catch {
      }
      try {
        e.close();
      } catch {
      }
    };
    e.addEventListener ? e.addEventListener("message", i) : e.on ? e.on(
      "message",
      (n) => i({ data: n })
    ) : e.onmessage = i, typeof e.start == "function" && e.start();
  });
}
const zp = nt.get(
  "throw"
), Yp = {
  canHandle: zp.canHandle,
  serialize: ({ value: e }) => {
    let t;
    return e instanceof Error ? (t = {
      isError: !0,
      value: jp(e)
    }, t.value.originalErrorClassName = e.constructor.name) : t = { isError: !1, value: e }, [t, []];
  },
  deserialize: (e) => {
    if (e.isError) {
      const t = qp(e.value), s = new Error("Comlink method call failed");
      let i = t;
      for (; i.cause; )
        i = i.cause;
      throw i.cause = s, t;
    }
    throw e.value;
  }
};
nt.set("throw", Yp);
function ma(e) {
  return new Proxy(e, {
    get(t, s) {
      switch (typeof t[s]) {
        case "function":
          return (...i) => t[s](...i);
        case "object":
          return t[s] === null ? t[s] : ma(t[s]);
        case "undefined":
        case "number":
        case "string":
          return t[s];
        default:
          return fa(t[s]);
      }
    }
  });
}
function Gp(e, t) {
  try {
    e.error(t);
  } catch {
  }
}
function Zp(e) {
  try {
    e.close();
  } catch {
  }
}
BigInt(Number.MAX_SAFE_INTEGER);
new Dr({ concurrency: 15 });
new Dr({ concurrency: 10 });
function Jp(e, t) {
  t = dt(t);
  const s = ["", ".", "/"].includes(t);
  let i = e;
  if (s)
    t = "";
  else {
    const r = t.split("/");
    for (const l of r) {
      const p = i == null ? void 0 : i.find(
        (c) => c.name === l
      );
      if ((p == null ? void 0 : p.type) === "folder")
        i = p.children;
      else return p ? [p.name] : [];
    }
  }
  const o = [], n = [{ tree: i, path: t }];
  for (; n.length > 0; ) {
    const { tree: r, path: l } = n.pop();
    for (const p of r) {
      const c = `${l}${l ? "/" : ""}${p.name}`;
      p.type === "folder" ? n.push({
        tree: p.children,
        path: c
      }) : o.push(c);
    }
  }
  return o;
}
const Ar = 15, vn = 30, Pn = 19, Kp = 29, ws = 256, Vn = ws + 1 + Kp, $i = 2 * Vn + 1, wr = 256, Xp = 7, ki = 16, Ei = 17, Oi = 18, Gs = 8 * 2, bs = -1, Qp = 1, Jr = 2, ec = 0, pr = 0, Ti = 1, tc = 3, We = 4, pt = 0, ha = 1, Kr = 2, ut = -2, rc = -3, ir = -5;
function Ss(e) {
  return As(e.map(([t, s]) => new Array(t).fill(s, 0, t)));
}
function As(e) {
  return e.reduce((t, s) => t.concat(Array.isArray(s) ? As(s) : s), []);
}
const Si = [0, 1, 2, 3].concat(...Ss([
  [2, 4],
  [2, 5],
  [4, 6],
  [4, 7],
  [8, 8],
  [8, 9],
  [16, 10],
  [16, 11],
  [32, 12],
  [32, 13],
  [64, 14],
  [64, 15],
  [2, 0],
  [1, 16],
  [1, 17],
  [2, 18],
  [2, 19],
  [4, 20],
  [4, 21],
  [8, 22],
  [8, 23],
  [16, 24],
  [16, 25],
  [32, 26],
  [32, 27],
  [64, 28],
  [64, 29]
]));
function he() {
  const e = this;
  function t(o) {
    const n = e.dyn_tree, r = e.stat_desc.static_tree, l = e.stat_desc.extra_bits, p = e.stat_desc.extra_base, c = e.stat_desc.max_length;
    let f, u, g, w, O, m, h = 0;
    for (w = 0; w <= Ar; w++)
      o.bl_count[w] = 0;
    for (n[o.heap[o.heap_max] * 2 + 1] = 0, f = o.heap_max + 1; f < $i; f++)
      u = o.heap[f], w = n[n[u * 2 + 1] * 2 + 1] + 1, w > c && (w = c, h++), n[u * 2 + 1] = w, !(u > e.max_code) && (o.bl_count[w]++, O = 0, u >= p && (O = l[u - p]), m = n[u * 2], o.opt_len += m * (w + O), r && (o.static_len += m * (r[u * 2 + 1] + O)));
    if (h !== 0) {
      do {
        for (w = c - 1; o.bl_count[w] === 0; )
          w--;
        o.bl_count[w]--, o.bl_count[w + 1] += 2, o.bl_count[c]--, h -= 2;
      } while (h > 0);
      for (w = c; w !== 0; w--)
        for (u = o.bl_count[w]; u !== 0; )
          g = o.heap[--f], !(g > e.max_code) && (n[g * 2 + 1] != w && (o.opt_len += (w - n[g * 2 + 1]) * n[g * 2], n[g * 2 + 1] = w), u--);
    }
  }
  function s(o, n) {
    let r = 0;
    do
      r |= o & 1, o >>>= 1, r <<= 1;
    while (--n > 0);
    return r >>> 1;
  }
  function i(o, n, r) {
    const l = [];
    let p = 0, c, f, u;
    for (c = 1; c <= Ar; c++)
      l[c] = p = p + r[c - 1] << 1;
    for (f = 0; f <= n; f++)
      u = o[f * 2 + 1], u !== 0 && (o[f * 2] = s(l[u]++, u));
  }
  e.build_tree = function(o) {
    const n = e.dyn_tree, r = e.stat_desc.static_tree, l = e.stat_desc.elems;
    let p, c, f = -1, u;
    for (o.heap_len = 0, o.heap_max = $i, p = 0; p < l; p++)
      n[p * 2] !== 0 ? (o.heap[++o.heap_len] = f = p, o.depth[p] = 0) : n[p * 2 + 1] = 0;
    for (; o.heap_len < 2; )
      u = o.heap[++o.heap_len] = f < 2 ? ++f : 0, n[u * 2] = 1, o.depth[u] = 0, o.opt_len--, r && (o.static_len -= r[u * 2 + 1]);
    for (e.max_code = f, p = Math.floor(o.heap_len / 2); p >= 1; p--)
      o.pqdownheap(n, p);
    u = l;
    do
      p = o.heap[1], o.heap[1] = o.heap[o.heap_len--], o.pqdownheap(n, 1), c = o.heap[1], o.heap[--o.heap_max] = p, o.heap[--o.heap_max] = c, n[u * 2] = n[p * 2] + n[c * 2], o.depth[u] = Math.max(o.depth[p], o.depth[c]) + 1, n[p * 2 + 1] = n[c * 2 + 1] = u, o.heap[1] = u++, o.pqdownheap(n, 1);
    while (o.heap_len >= 2);
    o.heap[--o.heap_max] = o.heap[1], t(o), i(n, e.max_code, o.bl_count);
  };
}
he._length_code = [0, 1, 2, 3, 4, 5, 6, 7].concat(...Ss([
  [2, 8],
  [2, 9],
  [2, 10],
  [2, 11],
  [4, 12],
  [4, 13],
  [4, 14],
  [4, 15],
  [8, 16],
  [8, 17],
  [8, 18],
  [8, 19],
  [16, 20],
  [16, 21],
  [16, 22],
  [16, 23],
  [32, 24],
  [32, 25],
  [32, 26],
  [31, 27],
  [1, 28]
]));
he.base_length = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 0];
he.base_dist = [
  0,
  1,
  2,
  3,
  4,
  6,
  8,
  12,
  16,
  24,
  32,
  48,
  64,
  96,
  128,
  192,
  256,
  384,
  512,
  768,
  1024,
  1536,
  2048,
  3072,
  4096,
  6144,
  8192,
  12288,
  16384,
  24576
];
he.d_code = function(e) {
  return e < 256 ? Si[e] : Si[256 + (e >>> 7)];
};
he.extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
he.extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
he.extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];
he.bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
function Le(e, t, s, i, o) {
  const n = this;
  n.static_tree = e, n.extra_bits = t, n.extra_base = s, n.elems = i, n.max_length = o;
}
const sc = [
  12,
  140,
  76,
  204,
  44,
  172,
  108,
  236,
  28,
  156,
  92,
  220,
  60,
  188,
  124,
  252,
  2,
  130,
  66,
  194,
  34,
  162,
  98,
  226,
  18,
  146,
  82,
  210,
  50,
  178,
  114,
  242,
  10,
  138,
  74,
  202,
  42,
  170,
  106,
  234,
  26,
  154,
  90,
  218,
  58,
  186,
  122,
  250,
  6,
  134,
  70,
  198,
  38,
  166,
  102,
  230,
  22,
  150,
  86,
  214,
  54,
  182,
  118,
  246,
  14,
  142,
  78,
  206,
  46,
  174,
  110,
  238,
  30,
  158,
  94,
  222,
  62,
  190,
  126,
  254,
  1,
  129,
  65,
  193,
  33,
  161,
  97,
  225,
  17,
  145,
  81,
  209,
  49,
  177,
  113,
  241,
  9,
  137,
  73,
  201,
  41,
  169,
  105,
  233,
  25,
  153,
  89,
  217,
  57,
  185,
  121,
  249,
  5,
  133,
  69,
  197,
  37,
  165,
  101,
  229,
  21,
  149,
  85,
  213,
  53,
  181,
  117,
  245,
  13,
  141,
  77,
  205,
  45,
  173,
  109,
  237,
  29,
  157,
  93,
  221,
  61,
  189,
  125,
  253,
  19,
  275,
  147,
  403,
  83,
  339,
  211,
  467,
  51,
  307,
  179,
  435,
  115,
  371,
  243,
  499,
  11,
  267,
  139,
  395,
  75,
  331,
  203,
  459,
  43,
  299,
  171,
  427,
  107,
  363,
  235,
  491,
  27,
  283,
  155,
  411,
  91,
  347,
  219,
  475,
  59,
  315,
  187,
  443,
  123,
  379,
  251,
  507,
  7,
  263,
  135,
  391,
  71,
  327,
  199,
  455,
  39,
  295,
  167,
  423,
  103,
  359,
  231,
  487,
  23,
  279,
  151,
  407,
  87,
  343,
  215,
  471,
  55,
  311,
  183,
  439,
  119,
  375,
  247,
  503,
  15,
  271,
  143,
  399,
  79,
  335,
  207,
  463,
  47,
  303,
  175,
  431,
  111,
  367,
  239,
  495,
  31,
  287,
  159,
  415,
  95,
  351,
  223,
  479,
  63,
  319,
  191,
  447,
  127,
  383,
  255,
  511,
  0,
  64,
  32,
  96,
  16,
  80,
  48,
  112,
  8,
  72,
  40,
  104,
  24,
  88,
  56,
  120,
  4,
  68,
  36,
  100,
  20,
  84,
  52,
  116,
  3,
  131,
  67,
  195,
  35,
  163,
  99,
  227
], nc = Ss([[144, 8], [112, 9], [24, 7], [8, 8]]);
Le.static_ltree = As(sc.map((e, t) => [e, nc[t]]));
const ic = [0, 16, 8, 24, 4, 20, 12, 28, 2, 18, 10, 26, 6, 22, 14, 30, 1, 17, 9, 25, 5, 21, 13, 29, 3, 19, 11, 27, 7, 23], oc = Ss([[30, 5]]);
Le.static_dtree = As(ic.map((e, t) => [e, oc[t]]));
Le.static_l_desc = new Le(Le.static_ltree, he.extra_lbits, ws + 1, Vn, Ar);
Le.static_d_desc = new Le(Le.static_dtree, he.extra_dbits, 0, vn, Ar);
Le.static_bl_desc = new Le(null, he.extra_blbits, 0, Pn, Xp);
const ac = 9, lc = 8;
function _t(e, t, s, i, o) {
  const n = this;
  n.good_length = e, n.max_lazy = t, n.nice_length = s, n.max_chain = i, n.func = o;
}
const ya = 0, as = 1, Yt = 2, lt = [
  new _t(0, 0, 0, 0, ya),
  new _t(4, 4, 8, 4, as),
  new _t(4, 5, 16, 8, as),
  new _t(4, 6, 32, 32, as),
  new _t(4, 4, 16, 16, Yt),
  new _t(8, 16, 32, 32, Yt),
  new _t(8, 16, 128, 128, Yt),
  new _t(8, 32, 128, 256, Yt),
  new _t(32, 128, 258, 1024, Yt),
  new _t(32, 258, 258, 4096, Yt)
], Xr = [
  "need dictionary",
  // Z_NEED_DICT
  // 2
  "stream end",
  // Z_STREAM_END 1
  "",
  // Z_OK 0
  "",
  // Z_ERRNO (-1)
  "stream error",
  // Z_STREAM_ERROR (-2)
  "data error",
  // Z_DATA_ERROR (-3)
  "",
  // Z_MEM_ERROR (-4)
  "buffer error",
  // Z_BUF_ERROR (-5)
  "",
  // Z_VERSION_ERROR (-6)
  ""
], st = 0, Qr = 1, br = 2, es = 3, pc = 32, Zs = 42, ts = 113, vr = 666, Js = 8, cc = 0, Ks = 1, fc = 2, ge = 3, ls = 258, Je = ls + ge + 1;
function Ai(e, t, s, i) {
  const o = e[t * 2], n = e[s * 2];
  return o < n || o == n && i[t] <= i[s];
}
function uc() {
  const e = this;
  let t, s, i, o, n, r, l, p, c, f, u, g, w, O, m, h, _, k, v, R, E, A, C, b, S, P, $, L, x, I, q, N, z;
  const B = new he(), H = new he(), U = new he();
  e.depth = [];
  let Y, J, M, te, se, X;
  e.bl_count = [], e.heap = [], q = [], N = [], z = [];
  function _e() {
    c = 2 * n, u[w - 1] = 0;
    for (let D = 0; D < w - 1; D++)
      u[D] = 0;
    P = lt[$].max_lazy, x = lt[$].good_length, I = lt[$].nice_length, S = lt[$].max_chain, E = 0, _ = 0, C = 0, k = b = ge - 1, R = 0, g = 0;
  }
  function we() {
    let D;
    for (D = 0; D < Vn; D++)
      q[D * 2] = 0;
    for (D = 0; D < vn; D++)
      N[D * 2] = 0;
    for (D = 0; D < Pn; D++)
      z[D * 2] = 0;
    q[wr * 2] = 1, e.opt_len = e.static_len = 0, J = M = 0;
  }
  function xe() {
    B.dyn_tree = q, B.stat_desc = Le.static_l_desc, H.dyn_tree = N, H.stat_desc = Le.static_d_desc, U.dyn_tree = z, U.stat_desc = Le.static_bl_desc, se = 0, X = 0, te = 8, we();
  }
  e.pqdownheap = function(D, W) {
    const j = e.heap, V = j[W];
    let K = W << 1;
    for (; K <= e.heap_len && (K < e.heap_len && Ai(D, j[K + 1], j[K], e.depth) && K++, !Ai(D, V, j[K], e.depth)); )
      j[W] = j[K], W = K, K <<= 1;
    j[W] = V;
  };
  function mt(D, W) {
    let j = -1, V, K = D[0 * 2 + 1], Q = 0, ae = 7, ke = 4;
    K === 0 && (ae = 138, ke = 3), D[(W + 1) * 2 + 1] = 65535;
    for (let Ie = 0; Ie <= W; Ie++)
      V = K, K = D[(Ie + 1) * 2 + 1], !(++Q < ae && V == K) && (Q < ke ? z[V * 2] += Q : V !== 0 ? (V != j && z[V * 2]++, z[ki * 2]++) : Q <= 10 ? z[Ei * 2]++ : z[Oi * 2]++, Q = 0, j = V, K === 0 ? (ae = 138, ke = 3) : V == K ? (ae = 6, ke = 3) : (ae = 7, ke = 4));
  }
  function tt() {
    let D;
    for (mt(q, B.max_code), mt(N, H.max_code), U.build_tree(e), D = Pn - 1; D >= 3 && z[he.bl_order[D] * 2 + 1] === 0; D--)
      ;
    return e.opt_len += 3 * (D + 1) + 5 + 5 + 4, D;
  }
  function Ne(D) {
    e.pending_buf[e.pending++] = D;
  }
  function Ae(D) {
    Ne(D & 255), Ne(D >>> 8 & 255);
  }
  function ht(D) {
    Ne(D >> 8 & 255), Ne(D & 255 & 255);
  }
  function me(D, W) {
    let j;
    const V = W;
    X > Gs - V ? (j = D, se |= j << X & 65535, Ae(se), se = j >>> Gs - X, X += V - Gs) : (se |= D << X & 65535, X += V);
  }
  function $e(D, W) {
    const j = D * 2;
    me(W[j] & 65535, W[j + 1] & 65535);
  }
  function Pt(D, W) {
    let j, V = -1, K, Q = D[0 * 2 + 1], ae = 0, ke = 7, Ie = 4;
    for (Q === 0 && (ke = 138, Ie = 3), j = 0; j <= W; j++)
      if (K = Q, Q = D[(j + 1) * 2 + 1], !(++ae < ke && K == Q)) {
        if (ae < Ie)
          do
            $e(K, z);
          while (--ae !== 0);
        else K !== 0 ? (K != V && ($e(K, z), ae--), $e(ki, z), me(ae - 3, 2)) : ae <= 10 ? ($e(Ei, z), me(ae - 3, 3)) : ($e(Oi, z), me(ae - 11, 7));
        ae = 0, V = K, Q === 0 ? (ke = 138, Ie = 3) : K == Q ? (ke = 6, Ie = 3) : (ke = 7, Ie = 4);
      }
  }
  function er(D, W, j) {
    let V;
    for (me(D - 257, 5), me(W - 1, 5), me(j - 4, 4), V = 0; V < j; V++)
      me(z[he.bl_order[V] * 2 + 1], 3);
    Pt(q, D - 1), Pt(N, W - 1);
  }
  function yt() {
    X == 16 ? (Ae(se), se = 0, X = 0) : X >= 8 && (Ne(se & 255), se >>>= 8, X -= 8);
  }
  function tr() {
    me(Ks << 1, 3), $e(wr, Le.static_ltree), yt(), 1 + te + 10 - X < 9 && (me(Ks << 1, 3), $e(wr, Le.static_ltree), yt()), te = 7;
  }
  function ze(D, W) {
    let j, V, K;
    if (e.dist_buf[J] = D, e.lc_buf[J] = W & 255, J++, D === 0 ? q[W * 2]++ : (M++, D--, q[(he._length_code[W] + ws + 1) * 2]++, N[he.d_code(D) * 2]++), !(J & 8191) && $ > 2) {
      for (j = J * 8, V = E - _, K = 0; K < vn; K++)
        j += N[K * 2] * (5 + he.extra_dbits[K]);
      if (j >>>= 3, M < Math.floor(J / 2) && j < Math.floor(V / 2))
        return !0;
    }
    return J == Y - 1;
  }
  function Wt(D, W) {
    let j, V, K = 0, Q, ae;
    if (J !== 0)
      do
        j = e.dist_buf[K], V = e.lc_buf[K], K++, j === 0 ? $e(V, D) : (Q = he._length_code[V], $e(Q + ws + 1, D), ae = he.extra_lbits[Q], ae !== 0 && (V -= he.base_length[Q], me(V, ae)), j--, Q = he.d_code(j), $e(Q, W), ae = he.extra_dbits[Q], ae !== 0 && (j -= he.base_dist[Q], me(j, ae)));
      while (K < J);
    $e(wr, D), te = D[wr * 2 + 1];
  }
  function Mt() {
    X > 8 ? Ae(se) : X > 0 && Ne(se & 255), se = 0, X = 0;
  }
  function xt(D, W, j) {
    Mt(), te = 8, Ae(W), Ae(~W), e.pending_buf.set(p.subarray(D, D + W), e.pending), e.pending += W;
  }
  function Bt(D, W, j) {
    me((cc << 1) + (j ? 1 : 0), 3), xt(D, W);
  }
  function $t(D, W, j) {
    let V, K, Q = 0;
    $ > 0 ? (B.build_tree(e), H.build_tree(e), Q = tt(), V = e.opt_len + 3 + 7 >>> 3, K = e.static_len + 3 + 7 >>> 3, K <= V && (V = K)) : V = K = W + 5, W + 4 <= V && D != -1 ? Bt(D, W, j) : K == V ? (me((Ks << 1) + (j ? 1 : 0), 3), Wt(Le.static_ltree, Le.static_dtree)) : (me((fc << 1) + (j ? 1 : 0), 3), er(B.max_code + 1, H.max_code + 1, Q + 1), Wt(q, N)), we(), j && Mt();
  }
  function Ye(D) {
    $t(_ >= 0 ? _ : -1, E - _, D), _ = E, t.flush_pending();
  }
  function Re() {
    let D, W, j, V;
    do {
      if (V = c - C - E, V === 0 && E === 0 && C === 0)
        V = n;
      else if (V == -1)
        V--;
      else if (E >= n + n - Je) {
        p.set(p.subarray(n, n + n), 0), A -= n, E -= n, _ -= n, D = w, j = D;
        do
          W = u[--j] & 65535, u[j] = W >= n ? W - n : 0;
        while (--D !== 0);
        D = n, j = D;
        do
          W = f[--j] & 65535, f[j] = W >= n ? W - n : 0;
        while (--D !== 0);
        V += n;
      }
      if (t.avail_in === 0)
        return;
      D = t.read_buf(p, E + C, V), C += D, C >= ge && (g = p[E] & 255, g = (g << h ^ p[E + 1] & 255) & m);
    } while (C < Je && t.avail_in !== 0);
  }
  function rr(D) {
    let W = 65535, j;
    for (W > i - 5 && (W = i - 5); ; ) {
      if (C <= 1) {
        if (Re(), C === 0 && D == pr)
          return st;
        if (C === 0)
          break;
      }
      if (E += C, C = 0, j = _ + W, (E === 0 || E >= j) && (C = E - j, E = j, Ye(!1), t.avail_out === 0) || E - _ >= n - Je && (Ye(!1), t.avail_out === 0))
        return st;
    }
    return Ye(D == We), t.avail_out === 0 ? D == We ? br : st : D == We ? es : Qr;
  }
  function Ge(D) {
    let W = S, j = E, V, K, Q = b;
    const ae = E > n - Je ? E - (n - Je) : 0;
    let ke = I;
    const Ie = l, at = E + ls;
    let nr = p[j + Q - 1], le = p[j + Q];
    b >= x && (W >>= 2), ke > C && (ke = C);
    do
      if (V = D, !(p[V + Q] != le || p[V + Q - 1] != nr || p[V] != p[j] || p[++V] != p[j + 1])) {
        j += 2, V++;
        do
          ;
        while (p[++j] == p[++V] && p[++j] == p[++V] && p[++j] == p[++V] && p[++j] == p[++V] && p[++j] == p[++V] && p[++j] == p[++V] && p[++j] == p[++V] && p[++j] == p[++V] && j < at);
        if (K = ls - (at - j), j = at - ls, K > Q) {
          if (A = D, Q = K, K >= ke)
            break;
          nr = p[j + Q - 1], le = p[j + Q];
        }
      }
    while ((D = f[D & Ie] & 65535) > ae && --W !== 0);
    return Q <= C ? Q : C;
  }
  function sr(D) {
    let W = 0, j;
    for (; ; ) {
      if (C < Je) {
        if (Re(), C < Je && D == pr)
          return st;
        if (C === 0)
          break;
      }
      if (C >= ge && (g = (g << h ^ p[E + (ge - 1)] & 255) & m, W = u[g] & 65535, f[E & l] = u[g], u[g] = E), W !== 0 && (E - W & 65535) <= n - Je && L != Jr && (k = Ge(W)), k >= ge)
        if (j = ze(E - A, k - ge), C -= k, k <= P && C >= ge) {
          k--;
          do
            E++, g = (g << h ^ p[E + (ge - 1)] & 255) & m, W = u[g] & 65535, f[E & l] = u[g], u[g] = E;
          while (--k !== 0);
          E++;
        } else
          E += k, k = 0, g = p[E] & 255, g = (g << h ^ p[E + 1] & 255) & m;
      else
        j = ze(0, p[E] & 255), C--, E++;
      if (j && (Ye(!1), t.avail_out === 0))
        return st;
    }
    return Ye(D == We), t.avail_out === 0 ? D == We ? br : st : D == We ? es : Qr;
  }
  function rt(D) {
    let W = 0, j, V;
    for (; ; ) {
      if (C < Je) {
        if (Re(), C < Je && D == pr)
          return st;
        if (C === 0)
          break;
      }
      if (C >= ge && (g = (g << h ^ p[E + (ge - 1)] & 255) & m, W = u[g] & 65535, f[E & l] = u[g], u[g] = E), b = k, v = A, k = ge - 1, W !== 0 && b < P && (E - W & 65535) <= n - Je && (L != Jr && (k = Ge(W)), k <= 5 && (L == Qp || k == ge && E - A > 4096) && (k = ge - 1)), b >= ge && k <= b) {
        V = E + C - ge, j = ze(E - 1 - v, b - ge), C -= b - 1, b -= 2;
        do
          ++E <= V && (g = (g << h ^ p[E + (ge - 1)] & 255) & m, W = u[g] & 65535, f[E & l] = u[g], u[g] = E);
        while (--b !== 0);
        if (R = 0, k = ge - 1, E++, j && (Ye(!1), t.avail_out === 0))
          return st;
      } else if (R !== 0) {
        if (j = ze(0, p[E - 1] & 255), j && Ye(!1), E++, C--, t.avail_out === 0)
          return st;
      } else
        R = 1, E++, C--;
    }
    return R !== 0 && (j = ze(0, p[E - 1] & 255), R = 0), Ye(D == We), t.avail_out === 0 ? D == We ? br : st : D == We ? es : Qr;
  }
  function Ht(D) {
    return D.total_in = D.total_out = 0, D.msg = null, e.pending = 0, e.pending_out = 0, s = ts, o = pr, xe(), _e(), pt;
  }
  e.deflateInit = function(D, W, j, V, K, Q) {
    return V || (V = Js), K || (K = lc), Q || (Q = ec), D.msg = null, W == bs && (W = 6), K < 1 || K > ac || V != Js || j < 9 || j > 15 || W < 0 || W > 9 || Q < 0 || Q > Jr ? ut : (D.dstate = e, r = j, n = 1 << r, l = n - 1, O = K + 7, w = 1 << O, m = w - 1, h = Math.floor((O + ge - 1) / ge), p = new Uint8Array(n * 2), f = [], u = [], Y = 1 << K + 6, e.pending_buf = new Uint8Array(Y * 4), i = Y * 4, e.dist_buf = new Uint16Array(Y), e.lc_buf = new Uint8Array(Y), $ = W, L = Q, Ht(D));
  }, e.deflateEnd = function() {
    return s != Zs && s != ts && s != vr ? ut : (e.lc_buf = null, e.dist_buf = null, e.pending_buf = null, u = null, f = null, p = null, e.dstate = null, s == ts ? rc : pt);
  }, e.deflateParams = function(D, W, j) {
    let V = pt;
    return W == bs && (W = 6), W < 0 || W > 9 || j < 0 || j > Jr ? ut : (lt[$].func != lt[W].func && D.total_in !== 0 && (V = D.deflate(Ti)), $ != W && ($ = W, P = lt[$].max_lazy, x = lt[$].good_length, I = lt[$].nice_length, S = lt[$].max_chain), L = j, V);
  }, e.deflateSetDictionary = function(D, W, j) {
    let V = j, K, Q = 0;
    if (!W || s != Zs)
      return ut;
    if (V < ge)
      return pt;
    for (V > n - Je && (V = n - Je, Q = j - V), p.set(W.subarray(Q, Q + V), 0), E = V, _ = V, g = p[0] & 255, g = (g << h ^ p[1] & 255) & m, K = 0; K <= V - ge; K++)
      g = (g << h ^ p[K + (ge - 1)] & 255) & m, f[K & l] = u[g], u[g] = K;
    return pt;
  }, e.deflate = function(D, W) {
    let j, V, K, Q, ae;
    if (W > We || W < 0)
      return ut;
    if (!D.next_out || !D.next_in && D.avail_in !== 0 || s == vr && W != We)
      return D.msg = Xr[Kr - ut], ut;
    if (D.avail_out === 0)
      return D.msg = Xr[Kr - ir], ir;
    if (t = D, Q = o, o = W, s == Zs && (V = Js + (r - 8 << 4) << 8, K = ($ - 1 & 255) >> 1, K > 3 && (K = 3), V |= K << 6, E !== 0 && (V |= pc), V += 31 - V % 31, s = ts, ht(V)), e.pending !== 0) {
      if (t.flush_pending(), t.avail_out === 0)
        return o = -1, pt;
    } else if (t.avail_in === 0 && W <= Q && W != We)
      return t.msg = Xr[Kr - ir], ir;
    if (s == vr && t.avail_in !== 0)
      return D.msg = Xr[Kr - ir], ir;
    if (t.avail_in !== 0 || C !== 0 || W != pr && s != vr) {
      switch (ae = -1, lt[$].func) {
        case ya:
          ae = rr(W);
          break;
        case as:
          ae = sr(W);
          break;
        case Yt:
          ae = rt(W);
          break;
      }
      if ((ae == br || ae == es) && (s = vr), ae == st || ae == br)
        return t.avail_out === 0 && (o = -1), pt;
      if (ae == Qr) {
        if (W == Ti)
          tr();
        else if (Bt(0, 0, !1), W == tc)
          for (j = 0; j < w; j++)
            u[j] = 0;
        if (t.flush_pending(), t.avail_out === 0)
          return o = -1, pt;
      }
    }
    return W != We ? pt : ha;
  };
}
function ga() {
  const e = this;
  e.next_in_index = 0, e.next_out_index = 0, e.avail_in = 0, e.total_in = 0, e.avail_out = 0, e.total_out = 0;
}
ga.prototype = {
  deflateInit(e, t) {
    const s = this;
    return s.dstate = new uc(), t || (t = Ar), s.dstate.deflateInit(s, e, t);
  },
  deflate(e) {
    const t = this;
    return t.dstate ? t.dstate.deflate(t, e) : ut;
  },
  deflateEnd() {
    const e = this;
    if (!e.dstate)
      return ut;
    const t = e.dstate.deflateEnd();
    return e.dstate = null, t;
  },
  deflateParams(e, t) {
    const s = this;
    return s.dstate ? s.dstate.deflateParams(s, e, t) : ut;
  },
  deflateSetDictionary(e, t) {
    const s = this;
    return s.dstate ? s.dstate.deflateSetDictionary(s, e, t) : ut;
  },
  // Read a new buffer from the current input stream, update the
  // total number of bytes read. All deflate() input goes through
  // this function so some applications may wish to modify it to avoid
  // allocating a large strm->next_in buffer and copying from it.
  // (See also flush_pending()).
  read_buf(e, t, s) {
    const i = this;
    let o = i.avail_in;
    return o > s && (o = s), o === 0 ? 0 : (i.avail_in -= o, e.set(i.next_in.subarray(i.next_in_index, i.next_in_index + o), t), i.next_in_index += o, i.total_in += o, o);
  },
  // Flush as much pending output as possible. All deflate() output goes
  // through this function so some applications may wish to modify it
  // to avoid allocating a large strm->next_out buffer and copying into it.
  // (See also read_buf()).
  flush_pending() {
    const e = this;
    let t = e.dstate.pending;
    t > e.avail_out && (t = e.avail_out), t !== 0 && (e.next_out.set(e.dstate.pending_buf.subarray(e.dstate.pending_out, e.dstate.pending_out + t), e.next_out_index), e.next_out_index += t, e.dstate.pending_out += t, e.total_out += t, e.avail_out -= t, e.dstate.pending -= t, e.dstate.pending === 0 && (e.dstate.pending_out = 0));
  }
};
function dc(e) {
  const t = this, s = new ga(), i = mc(e && e.chunkSize ? e.chunkSize : 64 * 1024), o = pr, n = new Uint8Array(i);
  let r = e ? e.level : bs;
  typeof r > "u" && (r = bs), s.deflateInit(r), s.next_out = n, t.append = function(l, p) {
    let c, f, u = 0, g = 0, w = 0;
    const O = [];
    if (l.length) {
      s.next_in_index = 0, s.next_in = l, s.avail_in = l.length;
      do {
        if (s.next_out_index = 0, s.avail_out = i, c = s.deflate(o), c != pt)
          throw new Error("deflating: " + s.msg);
        s.next_out_index && (s.next_out_index == i ? O.push(new Uint8Array(n)) : O.push(n.subarray(0, s.next_out_index))), w += s.next_out_index, p && s.next_in_index > 0 && s.next_in_index != u && (p(s.next_in_index), u = s.next_in_index);
      } while (s.avail_in > 0 || s.avail_out === 0);
      return O.length > 1 ? (f = new Uint8Array(w), O.forEach(function(m) {
        f.set(m, g), g += m.length;
      })) : f = O[0] ? new Uint8Array(O[0]) : new Uint8Array(), f;
    }
  }, t.flush = function() {
    let l, p, c = 0, f = 0;
    const u = [];
    do {
      if (s.next_out_index = 0, s.avail_out = i, l = s.deflate(We), l != ha && l != pt)
        throw new Error("deflating: " + s.msg);
      i - s.avail_out > 0 && u.push(n.slice(0, s.next_out_index)), f += s.next_out_index;
    } while (s.avail_in > 0 || s.avail_out === 0);
    return s.deflateEnd(), p = new Uint8Array(f), u.forEach(function(g) {
      p.set(g, c), c += g.length;
    }), p;
  };
}
function mc(e) {
  return e + 5 * (Math.floor(e / 16383) + 1);
}
const hc = 15, fe = 0, Ot = 1, yc = 2, Be = -2, ye = -3, Ri = -4, Tt = -5, Ke = [
  0,
  1,
  3,
  7,
  15,
  31,
  63,
  127,
  255,
  511,
  1023,
  2047,
  4095,
  8191,
  16383,
  32767,
  65535
], _a = 1440, gc = 0, _c = 4, wc = 9, bc = 5, vc = [
  96,
  7,
  256,
  0,
  8,
  80,
  0,
  8,
  16,
  84,
  8,
  115,
  82,
  7,
  31,
  0,
  8,
  112,
  0,
  8,
  48,
  0,
  9,
  192,
  80,
  7,
  10,
  0,
  8,
  96,
  0,
  8,
  32,
  0,
  9,
  160,
  0,
  8,
  0,
  0,
  8,
  128,
  0,
  8,
  64,
  0,
  9,
  224,
  80,
  7,
  6,
  0,
  8,
  88,
  0,
  8,
  24,
  0,
  9,
  144,
  83,
  7,
  59,
  0,
  8,
  120,
  0,
  8,
  56,
  0,
  9,
  208,
  81,
  7,
  17,
  0,
  8,
  104,
  0,
  8,
  40,
  0,
  9,
  176,
  0,
  8,
  8,
  0,
  8,
  136,
  0,
  8,
  72,
  0,
  9,
  240,
  80,
  7,
  4,
  0,
  8,
  84,
  0,
  8,
  20,
  85,
  8,
  227,
  83,
  7,
  43,
  0,
  8,
  116,
  0,
  8,
  52,
  0,
  9,
  200,
  81,
  7,
  13,
  0,
  8,
  100,
  0,
  8,
  36,
  0,
  9,
  168,
  0,
  8,
  4,
  0,
  8,
  132,
  0,
  8,
  68,
  0,
  9,
  232,
  80,
  7,
  8,
  0,
  8,
  92,
  0,
  8,
  28,
  0,
  9,
  152,
  84,
  7,
  83,
  0,
  8,
  124,
  0,
  8,
  60,
  0,
  9,
  216,
  82,
  7,
  23,
  0,
  8,
  108,
  0,
  8,
  44,
  0,
  9,
  184,
  0,
  8,
  12,
  0,
  8,
  140,
  0,
  8,
  76,
  0,
  9,
  248,
  80,
  7,
  3,
  0,
  8,
  82,
  0,
  8,
  18,
  85,
  8,
  163,
  83,
  7,
  35,
  0,
  8,
  114,
  0,
  8,
  50,
  0,
  9,
  196,
  81,
  7,
  11,
  0,
  8,
  98,
  0,
  8,
  34,
  0,
  9,
  164,
  0,
  8,
  2,
  0,
  8,
  130,
  0,
  8,
  66,
  0,
  9,
  228,
  80,
  7,
  7,
  0,
  8,
  90,
  0,
  8,
  26,
  0,
  9,
  148,
  84,
  7,
  67,
  0,
  8,
  122,
  0,
  8,
  58,
  0,
  9,
  212,
  82,
  7,
  19,
  0,
  8,
  106,
  0,
  8,
  42,
  0,
  9,
  180,
  0,
  8,
  10,
  0,
  8,
  138,
  0,
  8,
  74,
  0,
  9,
  244,
  80,
  7,
  5,
  0,
  8,
  86,
  0,
  8,
  22,
  192,
  8,
  0,
  83,
  7,
  51,
  0,
  8,
  118,
  0,
  8,
  54,
  0,
  9,
  204,
  81,
  7,
  15,
  0,
  8,
  102,
  0,
  8,
  38,
  0,
  9,
  172,
  0,
  8,
  6,
  0,
  8,
  134,
  0,
  8,
  70,
  0,
  9,
  236,
  80,
  7,
  9,
  0,
  8,
  94,
  0,
  8,
  30,
  0,
  9,
  156,
  84,
  7,
  99,
  0,
  8,
  126,
  0,
  8,
  62,
  0,
  9,
  220,
  82,
  7,
  27,
  0,
  8,
  110,
  0,
  8,
  46,
  0,
  9,
  188,
  0,
  8,
  14,
  0,
  8,
  142,
  0,
  8,
  78,
  0,
  9,
  252,
  96,
  7,
  256,
  0,
  8,
  81,
  0,
  8,
  17,
  85,
  8,
  131,
  82,
  7,
  31,
  0,
  8,
  113,
  0,
  8,
  49,
  0,
  9,
  194,
  80,
  7,
  10,
  0,
  8,
  97,
  0,
  8,
  33,
  0,
  9,
  162,
  0,
  8,
  1,
  0,
  8,
  129,
  0,
  8,
  65,
  0,
  9,
  226,
  80,
  7,
  6,
  0,
  8,
  89,
  0,
  8,
  25,
  0,
  9,
  146,
  83,
  7,
  59,
  0,
  8,
  121,
  0,
  8,
  57,
  0,
  9,
  210,
  81,
  7,
  17,
  0,
  8,
  105,
  0,
  8,
  41,
  0,
  9,
  178,
  0,
  8,
  9,
  0,
  8,
  137,
  0,
  8,
  73,
  0,
  9,
  242,
  80,
  7,
  4,
  0,
  8,
  85,
  0,
  8,
  21,
  80,
  8,
  258,
  83,
  7,
  43,
  0,
  8,
  117,
  0,
  8,
  53,
  0,
  9,
  202,
  81,
  7,
  13,
  0,
  8,
  101,
  0,
  8,
  37,
  0,
  9,
  170,
  0,
  8,
  5,
  0,
  8,
  133,
  0,
  8,
  69,
  0,
  9,
  234,
  80,
  7,
  8,
  0,
  8,
  93,
  0,
  8,
  29,
  0,
  9,
  154,
  84,
  7,
  83,
  0,
  8,
  125,
  0,
  8,
  61,
  0,
  9,
  218,
  82,
  7,
  23,
  0,
  8,
  109,
  0,
  8,
  45,
  0,
  9,
  186,
  0,
  8,
  13,
  0,
  8,
  141,
  0,
  8,
  77,
  0,
  9,
  250,
  80,
  7,
  3,
  0,
  8,
  83,
  0,
  8,
  19,
  85,
  8,
  195,
  83,
  7,
  35,
  0,
  8,
  115,
  0,
  8,
  51,
  0,
  9,
  198,
  81,
  7,
  11,
  0,
  8,
  99,
  0,
  8,
  35,
  0,
  9,
  166,
  0,
  8,
  3,
  0,
  8,
  131,
  0,
  8,
  67,
  0,
  9,
  230,
  80,
  7,
  7,
  0,
  8,
  91,
  0,
  8,
  27,
  0,
  9,
  150,
  84,
  7,
  67,
  0,
  8,
  123,
  0,
  8,
  59,
  0,
  9,
  214,
  82,
  7,
  19,
  0,
  8,
  107,
  0,
  8,
  43,
  0,
  9,
  182,
  0,
  8,
  11,
  0,
  8,
  139,
  0,
  8,
  75,
  0,
  9,
  246,
  80,
  7,
  5,
  0,
  8,
  87,
  0,
  8,
  23,
  192,
  8,
  0,
  83,
  7,
  51,
  0,
  8,
  119,
  0,
  8,
  55,
  0,
  9,
  206,
  81,
  7,
  15,
  0,
  8,
  103,
  0,
  8,
  39,
  0,
  9,
  174,
  0,
  8,
  7,
  0,
  8,
  135,
  0,
  8,
  71,
  0,
  9,
  238,
  80,
  7,
  9,
  0,
  8,
  95,
  0,
  8,
  31,
  0,
  9,
  158,
  84,
  7,
  99,
  0,
  8,
  127,
  0,
  8,
  63,
  0,
  9,
  222,
  82,
  7,
  27,
  0,
  8,
  111,
  0,
  8,
  47,
  0,
  9,
  190,
  0,
  8,
  15,
  0,
  8,
  143,
  0,
  8,
  79,
  0,
  9,
  254,
  96,
  7,
  256,
  0,
  8,
  80,
  0,
  8,
  16,
  84,
  8,
  115,
  82,
  7,
  31,
  0,
  8,
  112,
  0,
  8,
  48,
  0,
  9,
  193,
  80,
  7,
  10,
  0,
  8,
  96,
  0,
  8,
  32,
  0,
  9,
  161,
  0,
  8,
  0,
  0,
  8,
  128,
  0,
  8,
  64,
  0,
  9,
  225,
  80,
  7,
  6,
  0,
  8,
  88,
  0,
  8,
  24,
  0,
  9,
  145,
  83,
  7,
  59,
  0,
  8,
  120,
  0,
  8,
  56,
  0,
  9,
  209,
  81,
  7,
  17,
  0,
  8,
  104,
  0,
  8,
  40,
  0,
  9,
  177,
  0,
  8,
  8,
  0,
  8,
  136,
  0,
  8,
  72,
  0,
  9,
  241,
  80,
  7,
  4,
  0,
  8,
  84,
  0,
  8,
  20,
  85,
  8,
  227,
  83,
  7,
  43,
  0,
  8,
  116,
  0,
  8,
  52,
  0,
  9,
  201,
  81,
  7,
  13,
  0,
  8,
  100,
  0,
  8,
  36,
  0,
  9,
  169,
  0,
  8,
  4,
  0,
  8,
  132,
  0,
  8,
  68,
  0,
  9,
  233,
  80,
  7,
  8,
  0,
  8,
  92,
  0,
  8,
  28,
  0,
  9,
  153,
  84,
  7,
  83,
  0,
  8,
  124,
  0,
  8,
  60,
  0,
  9,
  217,
  82,
  7,
  23,
  0,
  8,
  108,
  0,
  8,
  44,
  0,
  9,
  185,
  0,
  8,
  12,
  0,
  8,
  140,
  0,
  8,
  76,
  0,
  9,
  249,
  80,
  7,
  3,
  0,
  8,
  82,
  0,
  8,
  18,
  85,
  8,
  163,
  83,
  7,
  35,
  0,
  8,
  114,
  0,
  8,
  50,
  0,
  9,
  197,
  81,
  7,
  11,
  0,
  8,
  98,
  0,
  8,
  34,
  0,
  9,
  165,
  0,
  8,
  2,
  0,
  8,
  130,
  0,
  8,
  66,
  0,
  9,
  229,
  80,
  7,
  7,
  0,
  8,
  90,
  0,
  8,
  26,
  0,
  9,
  149,
  84,
  7,
  67,
  0,
  8,
  122,
  0,
  8,
  58,
  0,
  9,
  213,
  82,
  7,
  19,
  0,
  8,
  106,
  0,
  8,
  42,
  0,
  9,
  181,
  0,
  8,
  10,
  0,
  8,
  138,
  0,
  8,
  74,
  0,
  9,
  245,
  80,
  7,
  5,
  0,
  8,
  86,
  0,
  8,
  22,
  192,
  8,
  0,
  83,
  7,
  51,
  0,
  8,
  118,
  0,
  8,
  54,
  0,
  9,
  205,
  81,
  7,
  15,
  0,
  8,
  102,
  0,
  8,
  38,
  0,
  9,
  173,
  0,
  8,
  6,
  0,
  8,
  134,
  0,
  8,
  70,
  0,
  9,
  237,
  80,
  7,
  9,
  0,
  8,
  94,
  0,
  8,
  30,
  0,
  9,
  157,
  84,
  7,
  99,
  0,
  8,
  126,
  0,
  8,
  62,
  0,
  9,
  221,
  82,
  7,
  27,
  0,
  8,
  110,
  0,
  8,
  46,
  0,
  9,
  189,
  0,
  8,
  14,
  0,
  8,
  142,
  0,
  8,
  78,
  0,
  9,
  253,
  96,
  7,
  256,
  0,
  8,
  81,
  0,
  8,
  17,
  85,
  8,
  131,
  82,
  7,
  31,
  0,
  8,
  113,
  0,
  8,
  49,
  0,
  9,
  195,
  80,
  7,
  10,
  0,
  8,
  97,
  0,
  8,
  33,
  0,
  9,
  163,
  0,
  8,
  1,
  0,
  8,
  129,
  0,
  8,
  65,
  0,
  9,
  227,
  80,
  7,
  6,
  0,
  8,
  89,
  0,
  8,
  25,
  0,
  9,
  147,
  83,
  7,
  59,
  0,
  8,
  121,
  0,
  8,
  57,
  0,
  9,
  211,
  81,
  7,
  17,
  0,
  8,
  105,
  0,
  8,
  41,
  0,
  9,
  179,
  0,
  8,
  9,
  0,
  8,
  137,
  0,
  8,
  73,
  0,
  9,
  243,
  80,
  7,
  4,
  0,
  8,
  85,
  0,
  8,
  21,
  80,
  8,
  258,
  83,
  7,
  43,
  0,
  8,
  117,
  0,
  8,
  53,
  0,
  9,
  203,
  81,
  7,
  13,
  0,
  8,
  101,
  0,
  8,
  37,
  0,
  9,
  171,
  0,
  8,
  5,
  0,
  8,
  133,
  0,
  8,
  69,
  0,
  9,
  235,
  80,
  7,
  8,
  0,
  8,
  93,
  0,
  8,
  29,
  0,
  9,
  155,
  84,
  7,
  83,
  0,
  8,
  125,
  0,
  8,
  61,
  0,
  9,
  219,
  82,
  7,
  23,
  0,
  8,
  109,
  0,
  8,
  45,
  0,
  9,
  187,
  0,
  8,
  13,
  0,
  8,
  141,
  0,
  8,
  77,
  0,
  9,
  251,
  80,
  7,
  3,
  0,
  8,
  83,
  0,
  8,
  19,
  85,
  8,
  195,
  83,
  7,
  35,
  0,
  8,
  115,
  0,
  8,
  51,
  0,
  9,
  199,
  81,
  7,
  11,
  0,
  8,
  99,
  0,
  8,
  35,
  0,
  9,
  167,
  0,
  8,
  3,
  0,
  8,
  131,
  0,
  8,
  67,
  0,
  9,
  231,
  80,
  7,
  7,
  0,
  8,
  91,
  0,
  8,
  27,
  0,
  9,
  151,
  84,
  7,
  67,
  0,
  8,
  123,
  0,
  8,
  59,
  0,
  9,
  215,
  82,
  7,
  19,
  0,
  8,
  107,
  0,
  8,
  43,
  0,
  9,
  183,
  0,
  8,
  11,
  0,
  8,
  139,
  0,
  8,
  75,
  0,
  9,
  247,
  80,
  7,
  5,
  0,
  8,
  87,
  0,
  8,
  23,
  192,
  8,
  0,
  83,
  7,
  51,
  0,
  8,
  119,
  0,
  8,
  55,
  0,
  9,
  207,
  81,
  7,
  15,
  0,
  8,
  103,
  0,
  8,
  39,
  0,
  9,
  175,
  0,
  8,
  7,
  0,
  8,
  135,
  0,
  8,
  71,
  0,
  9,
  239,
  80,
  7,
  9,
  0,
  8,
  95,
  0,
  8,
  31,
  0,
  9,
  159,
  84,
  7,
  99,
  0,
  8,
  127,
  0,
  8,
  63,
  0,
  9,
  223,
  82,
  7,
  27,
  0,
  8,
  111,
  0,
  8,
  47,
  0,
  9,
  191,
  0,
  8,
  15,
  0,
  8,
  143,
  0,
  8,
  79,
  0,
  9,
  255
], Pc = [
  80,
  5,
  1,
  87,
  5,
  257,
  83,
  5,
  17,
  91,
  5,
  4097,
  81,
  5,
  5,
  89,
  5,
  1025,
  85,
  5,
  65,
  93,
  5,
  16385,
  80,
  5,
  3,
  88,
  5,
  513,
  84,
  5,
  33,
  92,
  5,
  8193,
  82,
  5,
  9,
  90,
  5,
  2049,
  86,
  5,
  129,
  192,
  5,
  24577,
  80,
  5,
  2,
  87,
  5,
  385,
  83,
  5,
  25,
  91,
  5,
  6145,
  81,
  5,
  7,
  89,
  5,
  1537,
  85,
  5,
  97,
  93,
  5,
  24577,
  80,
  5,
  4,
  88,
  5,
  769,
  84,
  5,
  49,
  92,
  5,
  12289,
  82,
  5,
  13,
  90,
  5,
  3073,
  86,
  5,
  193,
  192,
  5,
  24577
], xc = [
  // Copy lengths for literal codes 257..285
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  13,
  15,
  17,
  19,
  23,
  27,
  31,
  35,
  43,
  51,
  59,
  67,
  83,
  99,
  115,
  131,
  163,
  195,
  227,
  258,
  0,
  0
], $c = [
  // Extra bits for literal codes 257..285
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  112,
  112
  // 112==invalid
], kc = [
  // Copy offsets for distance codes 0..29
  1,
  2,
  3,
  4,
  5,
  7,
  9,
  13,
  17,
  25,
  33,
  49,
  65,
  97,
  129,
  193,
  257,
  385,
  513,
  769,
  1025,
  1537,
  2049,
  3073,
  4097,
  6145,
  8193,
  12289,
  16385,
  24577
], Ec = [
  // Extra bits for distance codes
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13
], Lt = 15;
function xn() {
  const e = this;
  let t, s, i, o, n, r;
  function l(c, f, u, g, w, O, m, h, _, k, v) {
    let R, E, A, C, b, S, P, $, L, x, I, q, N, z, B;
    x = 0, b = u;
    do
      i[c[f + x]]++, x++, b--;
    while (b !== 0);
    if (i[0] == u)
      return m[0] = -1, h[0] = 0, fe;
    for ($ = h[0], S = 1; S <= Lt && i[S] === 0; S++)
      ;
    for (P = S, $ < S && ($ = S), b = Lt; b !== 0 && i[b] === 0; b--)
      ;
    for (A = b, $ > b && ($ = b), h[0] = $, z = 1 << S; S < b; S++, z <<= 1)
      if ((z -= i[S]) < 0)
        return ye;
    if ((z -= i[b]) < 0)
      return ye;
    for (i[b] += z, r[1] = S = 0, x = 1, N = 2; --b !== 0; )
      r[N] = S += i[x], N++, x++;
    b = 0, x = 0;
    do
      (S = c[f + x]) !== 0 && (v[r[S]++] = b), x++;
    while (++b < u);
    for (u = r[A], r[0] = b = 0, x = 0, C = -1, q = -$, n[0] = 0, I = 0, B = 0; P <= A; P++)
      for (R = i[P]; R-- !== 0; ) {
        for (; P > q + $; ) {
          if (C++, q += $, B = A - q, B = B > $ ? $ : B, (E = 1 << (S = P - q)) > R + 1 && (E -= R + 1, N = P, S < B))
            for (; ++S < B && !((E <<= 1) <= i[++N]); )
              E -= i[N];
          if (B = 1 << S, k[0] + B > _a)
            return ye;
          n[C] = I = /* hp+ */
          k[0], k[0] += B, C !== 0 ? (r[C] = b, o[0] = /* (byte) */
          S, o[1] = /* (byte) */
          $, S = b >>> q - $, o[2] = /* (int) */
          I - n[C - 1] - S, _.set(o, (n[C - 1] + S) * 3)) : m[0] = I;
        }
        for (o[1] = /* (byte) */
        P - q, x >= u ? o[0] = 192 : v[x] < g ? (o[0] = /* (byte) */
        v[x] < 256 ? 0 : 96, o[2] = v[x++]) : (o[0] = /* (byte) */
        O[v[x] - g] + 16 + 64, o[2] = w[v[x++] - g]), E = 1 << P - q, S = b >>> q; S < B; S += E)
          _.set(o, (I + S) * 3);
        for (S = 1 << P - 1; b & S; S >>>= 1)
          b ^= S;
        for (b ^= S, L = (1 << q) - 1; (b & L) != r[C]; )
          C--, q -= $, L = (1 << q) - 1;
      }
    return z !== 0 && A != 1 ? Tt : fe;
  }
  function p(c) {
    let f;
    for (t || (t = [], s = [], i = new Int32Array(Lt + 1), o = [], n = new Int32Array(Lt), r = new Int32Array(Lt + 1)), s.length < c && (s = []), f = 0; f < c; f++)
      s[f] = 0;
    for (f = 0; f < Lt + 1; f++)
      i[f] = 0;
    for (f = 0; f < 3; f++)
      o[f] = 0;
    n.set(i.subarray(0, Lt), 0), r.set(i.subarray(0, Lt + 1), 0);
  }
  e.inflate_trees_bits = function(c, f, u, g, w) {
    let O;
    return p(19), t[0] = 0, O = l(c, 0, 19, 19, null, null, u, f, g, t, s), O == ye ? w.msg = "oversubscribed dynamic bit lengths tree" : (O == Tt || f[0] === 0) && (w.msg = "incomplete dynamic bit lengths tree", O = ye), O;
  }, e.inflate_trees_dynamic = function(c, f, u, g, w, O, m, h, _) {
    let k;
    return p(288), t[0] = 0, k = l(u, 0, c, 257, xc, $c, O, g, h, t, s), k != fe || g[0] === 0 ? (k == ye ? _.msg = "oversubscribed literal/length tree" : k != Ri && (_.msg = "incomplete literal/length tree", k = ye), k) : (p(288), k = l(u, c, f, 0, kc, Ec, m, w, h, t, s), k != fe || w[0] === 0 && c > 257 ? (k == ye ? _.msg = "oversubscribed distance tree" : k == Tt ? (_.msg = "incomplete distance tree", k = ye) : k != Ri && (_.msg = "empty distance tree with lengths", k = ye), k) : fe);
  };
}
xn.inflate_trees_fixed = function(e, t, s, i) {
  return e[0] = wc, t[0] = bc, s[0] = vc, i[0] = Pc, fe;
};
const rs = 0, Li = 1, Ci = 2, Ni = 3, Ii = 4, Fi = 5, Di = 6, Xs = 7, Ui = 8, ss = 9;
function Oc() {
  const e = this;
  let t, s = 0, i, o = 0, n = 0, r = 0, l = 0, p = 0, c = 0, f = 0, u, g = 0, w, O = 0;
  function m(h, _, k, v, R, E, A, C) {
    let b, S, P, $, L, x, I, q, N, z, B, H, U, Y, J, M;
    I = C.next_in_index, q = C.avail_in, L = A.bitb, x = A.bitk, N = A.write, z = N < A.read ? A.read - N - 1 : A.end - N, B = Ke[h], H = Ke[_];
    do {
      for (; x < 20; )
        q--, L |= (C.read_byte(I++) & 255) << x, x += 8;
      if (b = L & B, S = k, P = v, M = (P + b) * 3, ($ = S[M]) === 0) {
        L >>= S[M + 1], x -= S[M + 1], A.win[N++] = /* (byte) */
        S[M + 2], z--;
        continue;
      }
      do {
        if (L >>= S[M + 1], x -= S[M + 1], $ & 16) {
          for ($ &= 15, U = S[M + 2] + /* (int) */
          (L & Ke[$]), L >>= $, x -= $; x < 15; )
            q--, L |= (C.read_byte(I++) & 255) << x, x += 8;
          b = L & H, S = R, P = E, M = (P + b) * 3, $ = S[M];
          do
            if (L >>= S[M + 1], x -= S[M + 1], $ & 16) {
              for ($ &= 15; x < $; )
                q--, L |= (C.read_byte(I++) & 255) << x, x += 8;
              if (Y = S[M + 2] + (L & Ke[$]), L >>= $, x -= $, z -= U, N >= Y)
                J = N - Y, N - J > 0 && 2 > N - J ? (A.win[N++] = A.win[J++], A.win[N++] = A.win[J++], U -= 2) : (A.win.set(A.win.subarray(J, J + 2), N), N += 2, J += 2, U -= 2);
              else {
                J = N - Y;
                do
                  J += A.end;
                while (J < 0);
                if ($ = A.end - J, U > $) {
                  if (U -= $, N - J > 0 && $ > N - J)
                    do
                      A.win[N++] = A.win[J++];
                    while (--$ !== 0);
                  else
                    A.win.set(A.win.subarray(J, J + $), N), N += $, J += $, $ = 0;
                  J = 0;
                }
              }
              if (N - J > 0 && U > N - J)
                do
                  A.win[N++] = A.win[J++];
                while (--U !== 0);
              else
                A.win.set(A.win.subarray(J, J + U), N), N += U, J += U, U = 0;
              break;
            } else if (!($ & 64))
              b += S[M + 2], b += L & Ke[$], M = (P + b) * 3, $ = S[M];
            else
              return C.msg = "invalid distance code", U = C.avail_in - q, U = x >> 3 < U ? x >> 3 : U, q += U, I -= U, x -= U << 3, A.bitb = L, A.bitk = x, C.avail_in = q, C.total_in += I - C.next_in_index, C.next_in_index = I, A.write = N, ye;
          while (!0);
          break;
        }
        if ($ & 64)
          return $ & 32 ? (U = C.avail_in - q, U = x >> 3 < U ? x >> 3 : U, q += U, I -= U, x -= U << 3, A.bitb = L, A.bitk = x, C.avail_in = q, C.total_in += I - C.next_in_index, C.next_in_index = I, A.write = N, Ot) : (C.msg = "invalid literal/length code", U = C.avail_in - q, U = x >> 3 < U ? x >> 3 : U, q += U, I -= U, x -= U << 3, A.bitb = L, A.bitk = x, C.avail_in = q, C.total_in += I - C.next_in_index, C.next_in_index = I, A.write = N, ye);
        if (b += S[M + 2], b += L & Ke[$], M = (P + b) * 3, ($ = S[M]) === 0) {
          L >>= S[M + 1], x -= S[M + 1], A.win[N++] = /* (byte) */
          S[M + 2], z--;
          break;
        }
      } while (!0);
    } while (z >= 258 && q >= 10);
    return U = C.avail_in - q, U = x >> 3 < U ? x >> 3 : U, q += U, I -= U, x -= U << 3, A.bitb = L, A.bitk = x, C.avail_in = q, C.total_in += I - C.next_in_index, C.next_in_index = I, A.write = N, fe;
  }
  e.init = function(h, _, k, v, R, E) {
    t = rs, c = /* (byte) */
    h, f = /* (byte) */
    _, u = k, g = v, w = R, O = E, i = null;
  }, e.proc = function(h, _, k) {
    let v, R, E, A = 0, C = 0, b = 0, S, P, $, L;
    for (b = _.next_in_index, S = _.avail_in, A = h.bitb, C = h.bitk, P = h.write, $ = P < h.read ? h.read - P - 1 : h.end - P; ; )
      switch (t) {
        case rs:
          if ($ >= 258 && S >= 10 && (h.bitb = A, h.bitk = C, _.avail_in = S, _.total_in += b - _.next_in_index, _.next_in_index = b, h.write = P, k = m(c, f, u, g, w, O, h, _), b = _.next_in_index, S = _.avail_in, A = h.bitb, C = h.bitk, P = h.write, $ = P < h.read ? h.read - P - 1 : h.end - P, k != fe)) {
            t = k == Ot ? Xs : ss;
            break;
          }
          n = c, i = u, o = g, t = Li;
        case Li:
          for (v = n; C < v; ) {
            if (S !== 0)
              k = fe;
            else
              return h.bitb = A, h.bitk = C, _.avail_in = S, _.total_in += b - _.next_in_index, _.next_in_index = b, h.write = P, h.inflate_flush(_, k);
            S--, A |= (_.read_byte(b++) & 255) << C, C += 8;
          }
          if (R = (o + (A & Ke[v])) * 3, A >>>= i[R + 1], C -= i[R + 1], E = i[R], E === 0) {
            r = i[R + 2], t = Di;
            break;
          }
          if (E & 16) {
            l = E & 15, s = i[R + 2], t = Ci;
            break;
          }
          if (!(E & 64)) {
            n = E, o = R / 3 + i[R + 2];
            break;
          }
          if (E & 32) {
            t = Xs;
            break;
          }
          return t = ss, _.msg = "invalid literal/length code", k = ye, h.bitb = A, h.bitk = C, _.avail_in = S, _.total_in += b - _.next_in_index, _.next_in_index = b, h.write = P, h.inflate_flush(_, k);
        case Ci:
          for (v = l; C < v; ) {
            if (S !== 0)
              k = fe;
            else
              return h.bitb = A, h.bitk = C, _.avail_in = S, _.total_in += b - _.next_in_index, _.next_in_index = b, h.write = P, h.inflate_flush(_, k);
            S--, A |= (_.read_byte(b++) & 255) << C, C += 8;
          }
          s += A & Ke[v], A >>= v, C -= v, n = f, i = w, o = O, t = Ni;
        case Ni:
          for (v = n; C < v; ) {
            if (S !== 0)
              k = fe;
            else
              return h.bitb = A, h.bitk = C, _.avail_in = S, _.total_in += b - _.next_in_index, _.next_in_index = b, h.write = P, h.inflate_flush(_, k);
            S--, A |= (_.read_byte(b++) & 255) << C, C += 8;
          }
          if (R = (o + (A & Ke[v])) * 3, A >>= i[R + 1], C -= i[R + 1], E = i[R], E & 16) {
            l = E & 15, p = i[R + 2], t = Ii;
            break;
          }
          if (!(E & 64)) {
            n = E, o = R / 3 + i[R + 2];
            break;
          }
          return t = ss, _.msg = "invalid distance code", k = ye, h.bitb = A, h.bitk = C, _.avail_in = S, _.total_in += b - _.next_in_index, _.next_in_index = b, h.write = P, h.inflate_flush(_, k);
        case Ii:
          for (v = l; C < v; ) {
            if (S !== 0)
              k = fe;
            else
              return h.bitb = A, h.bitk = C, _.avail_in = S, _.total_in += b - _.next_in_index, _.next_in_index = b, h.write = P, h.inflate_flush(_, k);
            S--, A |= (_.read_byte(b++) & 255) << C, C += 8;
          }
          p += A & Ke[v], A >>= v, C -= v, t = Fi;
        case Fi:
          for (L = P - p; L < 0; )
            L += h.end;
          for (; s !== 0; ) {
            if ($ === 0 && (P == h.end && h.read !== 0 && (P = 0, $ = P < h.read ? h.read - P - 1 : h.end - P), $ === 0 && (h.write = P, k = h.inflate_flush(_, k), P = h.write, $ = P < h.read ? h.read - P - 1 : h.end - P, P == h.end && h.read !== 0 && (P = 0, $ = P < h.read ? h.read - P - 1 : h.end - P), $ === 0)))
              return h.bitb = A, h.bitk = C, _.avail_in = S, _.total_in += b - _.next_in_index, _.next_in_index = b, h.write = P, h.inflate_flush(_, k);
            h.win[P++] = h.win[L++], $--, L == h.end && (L = 0), s--;
          }
          t = rs;
          break;
        case Di:
          if ($ === 0 && (P == h.end && h.read !== 0 && (P = 0, $ = P < h.read ? h.read - P - 1 : h.end - P), $ === 0 && (h.write = P, k = h.inflate_flush(_, k), P = h.write, $ = P < h.read ? h.read - P - 1 : h.end - P, P == h.end && h.read !== 0 && (P = 0, $ = P < h.read ? h.read - P - 1 : h.end - P), $ === 0)))
            return h.bitb = A, h.bitk = C, _.avail_in = S, _.total_in += b - _.next_in_index, _.next_in_index = b, h.write = P, h.inflate_flush(_, k);
          k = fe, h.win[P++] = /* (byte) */
          r, $--, t = rs;
          break;
        case Xs:
          if (C > 7 && (C -= 8, S++, b--), h.write = P, k = h.inflate_flush(_, k), P = h.write, $ = P < h.read ? h.read - P - 1 : h.end - P, h.read != h.write)
            return h.bitb = A, h.bitk = C, _.avail_in = S, _.total_in += b - _.next_in_index, _.next_in_index = b, h.write = P, h.inflate_flush(_, k);
          t = Ui;
        case Ui:
          return k = Ot, h.bitb = A, h.bitk = C, _.avail_in = S, _.total_in += b - _.next_in_index, _.next_in_index = b, h.write = P, h.inflate_flush(_, k);
        case ss:
          return k = ye, h.bitb = A, h.bitk = C, _.avail_in = S, _.total_in += b - _.next_in_index, _.next_in_index = b, h.write = P, h.inflate_flush(_, k);
        default:
          return k = Be, h.bitb = A, h.bitk = C, _.avail_in = S, _.total_in += b - _.next_in_index, _.next_in_index = b, h.write = P, h.inflate_flush(_, k);
      }
  }, e.free = function() {
  };
}
const ji = [
  // Order of the bit length code lengths
  16,
  17,
  18,
  0,
  8,
  7,
  9,
  6,
  10,
  5,
  11,
  4,
  12,
  3,
  13,
  2,
  14,
  1,
  15
], or = 0, Qs = 1, qi = 2, Wi = 3, Mi = 4, Bi = 5, ns = 6, is = 7, Hi = 8, Vt = 9;
function Tc(e, t) {
  const s = this;
  let i = or, o = 0, n = 0, r = 0, l;
  const p = [0], c = [0], f = new Oc();
  let u = 0, g = new Int32Array(_a * 3);
  const w = 0, O = new xn();
  s.bitk = 0, s.bitb = 0, s.win = new Uint8Array(t), s.end = t, s.read = 0, s.write = 0, s.reset = function(m, h) {
    h && (h[0] = w), i == ns && f.free(m), i = or, s.bitk = 0, s.bitb = 0, s.read = s.write = 0;
  }, s.reset(e, null), s.inflate_flush = function(m, h) {
    let _, k, v;
    return k = m.next_out_index, v = s.read, _ = /* (int) */
    (v <= s.write ? s.write : s.end) - v, _ > m.avail_out && (_ = m.avail_out), _ !== 0 && h == Tt && (h = fe), m.avail_out -= _, m.total_out += _, m.next_out.set(s.win.subarray(v, v + _), k), k += _, v += _, v == s.end && (v = 0, s.write == s.end && (s.write = 0), _ = s.write - v, _ > m.avail_out && (_ = m.avail_out), _ !== 0 && h == Tt && (h = fe), m.avail_out -= _, m.total_out += _, m.next_out.set(s.win.subarray(v, v + _), k), k += _, v += _), m.next_out_index = k, s.read = v, h;
  }, s.proc = function(m, h) {
    let _, k, v, R, E, A, C, b;
    for (R = m.next_in_index, E = m.avail_in, k = s.bitb, v = s.bitk, A = s.write, C = /* (int) */
    A < s.read ? s.read - A - 1 : s.end - A; ; ) {
      let S, P, $, L, x, I, q, N;
      switch (i) {
        case or:
          for (; v < 3; ) {
            if (E !== 0)
              h = fe;
            else
              return s.bitb = k, s.bitk = v, m.avail_in = E, m.total_in += R - m.next_in_index, m.next_in_index = R, s.write = A, s.inflate_flush(m, h);
            E--, k |= (m.read_byte(R++) & 255) << v, v += 8;
          }
          switch (_ = /* (int) */
          k & 7, u = _ & 1, _ >>> 1) {
            case 0:
              k >>>= 3, v -= 3, _ = v & 7, k >>>= _, v -= _, i = Qs;
              break;
            case 1:
              S = [], P = [], $ = [[]], L = [[]], xn.inflate_trees_fixed(S, P, $, L), f.init(S[0], P[0], $[0], 0, L[0], 0), k >>>= 3, v -= 3, i = ns;
              break;
            case 2:
              k >>>= 3, v -= 3, i = Wi;
              break;
            case 3:
              return k >>>= 3, v -= 3, i = Vt, m.msg = "invalid block type", h = ye, s.bitb = k, s.bitk = v, m.avail_in = E, m.total_in += R - m.next_in_index, m.next_in_index = R, s.write = A, s.inflate_flush(m, h);
          }
          break;
        case Qs:
          for (; v < 32; ) {
            if (E !== 0)
              h = fe;
            else
              return s.bitb = k, s.bitk = v, m.avail_in = E, m.total_in += R - m.next_in_index, m.next_in_index = R, s.write = A, s.inflate_flush(m, h);
            E--, k |= (m.read_byte(R++) & 255) << v, v += 8;
          }
          if ((~k >>> 16 & 65535) != (k & 65535))
            return i = Vt, m.msg = "invalid stored block lengths", h = ye, s.bitb = k, s.bitk = v, m.avail_in = E, m.total_in += R - m.next_in_index, m.next_in_index = R, s.write = A, s.inflate_flush(m, h);
          o = k & 65535, k = v = 0, i = o !== 0 ? qi : u !== 0 ? is : or;
          break;
        case qi:
          if (E === 0 || C === 0 && (A == s.end && s.read !== 0 && (A = 0, C = /* (int) */
          A < s.read ? s.read - A - 1 : s.end - A), C === 0 && (s.write = A, h = s.inflate_flush(m, h), A = s.write, C = /* (int) */
          A < s.read ? s.read - A - 1 : s.end - A, A == s.end && s.read !== 0 && (A = 0, C = /* (int) */
          A < s.read ? s.read - A - 1 : s.end - A), C === 0)))
            return s.bitb = k, s.bitk = v, m.avail_in = E, m.total_in += R - m.next_in_index, m.next_in_index = R, s.write = A, s.inflate_flush(m, h);
          if (h = fe, _ = o, _ > E && (_ = E), _ > C && (_ = C), s.win.set(m.read_buf(R, _), A), R += _, E -= _, A += _, C -= _, (o -= _) !== 0)
            break;
          i = u !== 0 ? is : or;
          break;
        case Wi:
          for (; v < 14; ) {
            if (E !== 0)
              h = fe;
            else
              return s.bitb = k, s.bitk = v, m.avail_in = E, m.total_in += R - m.next_in_index, m.next_in_index = R, s.write = A, s.inflate_flush(m, h);
            E--, k |= (m.read_byte(R++) & 255) << v, v += 8;
          }
          if (n = _ = k & 16383, (_ & 31) > 29 || (_ >> 5 & 31) > 29)
            return i = Vt, m.msg = "too many length or distance symbols", h = ye, s.bitb = k, s.bitk = v, m.avail_in = E, m.total_in += R - m.next_in_index, m.next_in_index = R, s.write = A, s.inflate_flush(m, h);
          if (_ = 258 + (_ & 31) + (_ >> 5 & 31), !l || l.length < _)
            l = [];
          else
            for (b = 0; b < _; b++)
              l[b] = 0;
          k >>>= 14, v -= 14, r = 0, i = Mi;
        case Mi:
          for (; r < 4 + (n >>> 10); ) {
            for (; v < 3; ) {
              if (E !== 0)
                h = fe;
              else
                return s.bitb = k, s.bitk = v, m.avail_in = E, m.total_in += R - m.next_in_index, m.next_in_index = R, s.write = A, s.inflate_flush(m, h);
              E--, k |= (m.read_byte(R++) & 255) << v, v += 8;
            }
            l[ji[r++]] = k & 7, k >>>= 3, v -= 3;
          }
          for (; r < 19; )
            l[ji[r++]] = 0;
          if (p[0] = 7, _ = O.inflate_trees_bits(l, p, c, g, m), _ != fe)
            return h = _, h == ye && (l = null, i = Vt), s.bitb = k, s.bitk = v, m.avail_in = E, m.total_in += R - m.next_in_index, m.next_in_index = R, s.write = A, s.inflate_flush(m, h);
          r = 0, i = Bi;
        case Bi:
          for (; _ = n, !(r >= 258 + (_ & 31) + (_ >> 5 & 31)); ) {
            let z, B;
            for (_ = p[0]; v < _; ) {
              if (E !== 0)
                h = fe;
              else
                return s.bitb = k, s.bitk = v, m.avail_in = E, m.total_in += R - m.next_in_index, m.next_in_index = R, s.write = A, s.inflate_flush(m, h);
              E--, k |= (m.read_byte(R++) & 255) << v, v += 8;
            }
            if (_ = g[(c[0] + (k & Ke[_])) * 3 + 1], B = g[(c[0] + (k & Ke[_])) * 3 + 2], B < 16)
              k >>>= _, v -= _, l[r++] = B;
            else {
              for (b = B == 18 ? 7 : B - 14, z = B == 18 ? 11 : 3; v < _ + b; ) {
                if (E !== 0)
                  h = fe;
                else
                  return s.bitb = k, s.bitk = v, m.avail_in = E, m.total_in += R - m.next_in_index, m.next_in_index = R, s.write = A, s.inflate_flush(m, h);
                E--, k |= (m.read_byte(R++) & 255) << v, v += 8;
              }
              if (k >>>= _, v -= _, z += k & Ke[b], k >>>= b, v -= b, b = r, _ = n, b + z > 258 + (_ & 31) + (_ >> 5 & 31) || B == 16 && b < 1)
                return l = null, i = Vt, m.msg = "invalid bit length repeat", h = ye, s.bitb = k, s.bitk = v, m.avail_in = E, m.total_in += R - m.next_in_index, m.next_in_index = R, s.write = A, s.inflate_flush(m, h);
              B = B == 16 ? l[b - 1] : 0;
              do
                l[b++] = B;
              while (--z !== 0);
              r = b;
            }
          }
          if (c[0] = -1, x = [], I = [], q = [], N = [], x[0] = 9, I[0] = 6, _ = n, _ = O.inflate_trees_dynamic(257 + (_ & 31), 1 + (_ >> 5 & 31), l, x, I, q, N, g, m), _ != fe)
            return _ == ye && (l = null, i = Vt), h = _, s.bitb = k, s.bitk = v, m.avail_in = E, m.total_in += R - m.next_in_index, m.next_in_index = R, s.write = A, s.inflate_flush(m, h);
          f.init(x[0], I[0], g, q[0], g, N[0]), i = ns;
        case ns:
          if (s.bitb = k, s.bitk = v, m.avail_in = E, m.total_in += R - m.next_in_index, m.next_in_index = R, s.write = A, (h = f.proc(s, m, h)) != Ot)
            return s.inflate_flush(m, h);
          if (h = fe, f.free(m), R = m.next_in_index, E = m.avail_in, k = s.bitb, v = s.bitk, A = s.write, C = /* (int) */
          A < s.read ? s.read - A - 1 : s.end - A, u === 0) {
            i = or;
            break;
          }
          i = is;
        case is:
          if (s.write = A, h = s.inflate_flush(m, h), A = s.write, C = /* (int) */
          A < s.read ? s.read - A - 1 : s.end - A, s.read != s.write)
            return s.bitb = k, s.bitk = v, m.avail_in = E, m.total_in += R - m.next_in_index, m.next_in_index = R, s.write = A, s.inflate_flush(m, h);
          i = Hi;
        case Hi:
          return h = Ot, s.bitb = k, s.bitk = v, m.avail_in = E, m.total_in += R - m.next_in_index, m.next_in_index = R, s.write = A, s.inflate_flush(m, h);
        case Vt:
          return h = ye, s.bitb = k, s.bitk = v, m.avail_in = E, m.total_in += R - m.next_in_index, m.next_in_index = R, s.write = A, s.inflate_flush(m, h);
        default:
          return h = Be, s.bitb = k, s.bitk = v, m.avail_in = E, m.total_in += R - m.next_in_index, m.next_in_index = R, s.write = A, s.inflate_flush(m, h);
      }
    }
  }, s.free = function(m) {
    s.reset(m, null), s.win = null, g = null;
  }, s.set_dictionary = function(m, h, _) {
    s.win.set(m.subarray(h, h + _), 0), s.read = s.write = _;
  }, s.sync_point = function() {
    return i == Qs ? 1 : 0;
  };
}
const Sc = 32, Ac = 8, Rc = 0, Vi = 1, zi = 2, Yi = 3, Gi = 4, Zi = 5, en = 6, Pr = 7, Ji = 12, Ct = 13, Lc = [0, 0, 255, 255];
function Cc() {
  const e = this;
  e.mode = 0, e.method = 0, e.was = [0], e.need = 0, e.marker = 0, e.wbits = 0;
  function t(s) {
    return !s || !s.istate ? Be : (s.total_in = s.total_out = 0, s.msg = null, s.istate.mode = Pr, s.istate.blocks.reset(s, null), fe);
  }
  e.inflateEnd = function(s) {
    return e.blocks && e.blocks.free(s), e.blocks = null, fe;
  }, e.inflateInit = function(s, i) {
    return s.msg = null, e.blocks = null, i < 8 || i > 15 ? (e.inflateEnd(s), Be) : (e.wbits = i, s.istate.blocks = new Tc(s, 1 << i), t(s), fe);
  }, e.inflate = function(s, i) {
    let o, n;
    if (!s || !s.istate || !s.next_in)
      return Be;
    const r = s.istate;
    for (i = i == _c ? Tt : fe, o = Tt; ; )
      switch (r.mode) {
        case Rc:
          if (s.avail_in === 0)
            return o;
          if (o = i, s.avail_in--, s.total_in++, ((r.method = s.read_byte(s.next_in_index++)) & 15) != Ac) {
            r.mode = Ct, s.msg = "unknown compression method", r.marker = 5;
            break;
          }
          if ((r.method >> 4) + 8 > r.wbits) {
            r.mode = Ct, s.msg = "invalid win size", r.marker = 5;
            break;
          }
          r.mode = Vi;
        case Vi:
          if (s.avail_in === 0)
            return o;
          if (o = i, s.avail_in--, s.total_in++, n = s.read_byte(s.next_in_index++) & 255, ((r.method << 8) + n) % 31 !== 0) {
            r.mode = Ct, s.msg = "incorrect header check", r.marker = 5;
            break;
          }
          if (!(n & Sc)) {
            r.mode = Pr;
            break;
          }
          r.mode = zi;
        case zi:
          if (s.avail_in === 0)
            return o;
          o = i, s.avail_in--, s.total_in++, r.need = (s.read_byte(s.next_in_index++) & 255) << 24 & 4278190080, r.mode = Yi;
        case Yi:
          if (s.avail_in === 0)
            return o;
          o = i, s.avail_in--, s.total_in++, r.need += (s.read_byte(s.next_in_index++) & 255) << 16 & 16711680, r.mode = Gi;
        case Gi:
          if (s.avail_in === 0)
            return o;
          o = i, s.avail_in--, s.total_in++, r.need += (s.read_byte(s.next_in_index++) & 255) << 8 & 65280, r.mode = Zi;
        case Zi:
          return s.avail_in === 0 ? o : (o = i, s.avail_in--, s.total_in++, r.need += s.read_byte(s.next_in_index++) & 255, r.mode = en, yc);
        case en:
          return r.mode = Ct, s.msg = "need dictionary", r.marker = 0, Be;
        case Pr:
          if (o = r.blocks.proc(s, o), o == ye) {
            r.mode = Ct, r.marker = 0;
            break;
          }
          if (o == fe && (o = i), o != Ot)
            return o;
          o = i, r.blocks.reset(s, r.was), r.mode = Ji;
        case Ji:
          return s.avail_in = 0, Ot;
        case Ct:
          return ye;
        default:
          return Be;
      }
  }, e.inflateSetDictionary = function(s, i, o) {
    let n = 0, r = o;
    if (!s || !s.istate || s.istate.mode != en)
      return Be;
    const l = s.istate;
    return r >= 1 << l.wbits && (r = (1 << l.wbits) - 1, n = o - r), l.blocks.set_dictionary(i, n, r), l.mode = Pr, fe;
  }, e.inflateSync = function(s) {
    let i, o, n, r, l;
    if (!s || !s.istate)
      return Be;
    const p = s.istate;
    if (p.mode != Ct && (p.mode = Ct, p.marker = 0), (i = s.avail_in) === 0)
      return Tt;
    for (o = s.next_in_index, n = p.marker; i !== 0 && n < 4; )
      s.read_byte(o) == Lc[n] ? n++ : s.read_byte(o) !== 0 ? n = 0 : n = 4 - n, o++, i--;
    return s.total_in += o - s.next_in_index, s.next_in_index = o, s.avail_in = i, p.marker = n, n != 4 ? ye : (r = s.total_in, l = s.total_out, t(s), s.total_in = r, s.total_out = l, p.mode = Pr, fe);
  }, e.inflateSyncPoint = function(s) {
    return !s || !s.istate || !s.istate.blocks ? Be : s.istate.blocks.sync_point();
  };
}
function wa() {
}
wa.prototype = {
  inflateInit(e) {
    const t = this;
    return t.istate = new Cc(), e || (e = hc), t.istate.inflateInit(t, e);
  },
  inflate(e) {
    const t = this;
    return t.istate ? t.istate.inflate(t, e) : Be;
  },
  inflateEnd() {
    const e = this;
    if (!e.istate)
      return Be;
    const t = e.istate.inflateEnd(e);
    return e.istate = null, t;
  },
  inflateSync() {
    const e = this;
    return e.istate ? e.istate.inflateSync(e) : Be;
  },
  inflateSetDictionary(e, t) {
    const s = this;
    return s.istate ? s.istate.inflateSetDictionary(s, e, t) : Be;
  },
  read_byte(e) {
    return this.next_in[e];
  },
  read_buf(e, t) {
    return this.next_in.subarray(e, e + t);
  }
};
function Nc(e) {
  const t = this, s = new wa(), i = e && e.chunkSize ? Math.floor(e.chunkSize * 2) : 128 * 1024, o = gc, n = new Uint8Array(i);
  let r = !1;
  s.inflateInit(), s.next_out = n, t.append = function(l, p) {
    const c = [];
    let f, u, g = 0, w = 0, O = 0;
    if (l.length !== 0) {
      s.next_in_index = 0, s.next_in = l, s.avail_in = l.length;
      do {
        if (s.next_out_index = 0, s.avail_out = i, s.avail_in === 0 && !r && (s.next_in_index = 0, r = !0), f = s.inflate(o), r && f === Tt) {
          if (s.avail_in !== 0)
            throw new Error("inflating: bad input");
        } else if (f !== fe && f !== Ot)
          throw new Error("inflating: " + s.msg);
        if ((r || f === Ot) && s.avail_in === l.length)
          throw new Error("inflating: bad input");
        s.next_out_index && (s.next_out_index === i ? c.push(new Uint8Array(n)) : c.push(n.subarray(0, s.next_out_index))), O += s.next_out_index, p && s.next_in_index > 0 && s.next_in_index != g && (p(s.next_in_index), g = s.next_in_index);
      } while (s.avail_in > 0 || s.avail_out === 0);
      return c.length > 1 ? (u = new Uint8Array(O), c.forEach(function(m) {
        u.set(m, w), w += m.length;
      })) : u = c[0] ? new Uint8Array(c[0]) : new Uint8Array(), u;
    }
  }, t.flush = function() {
    s.inflateEnd();
  };
}
const Jt = 4294967295, Ft = 65535, Ic = 8, Fc = 0, Dc = 99, Uc = 67324752, jc = 134695760, Ki = 33639248, qc = 101010256, Xi = 101075792, Wc = 117853008, ar = 22, tn = 20, rn = 56, Mc = 1, Bc = 39169, Hc = 10, Vc = 1, zc = 21589, Yc = 28789, Gc = 25461, Zc = 6534, Qi = 1, Jc = 6, eo = 8, to = 2048, ro = 16, so = 16384, no = 73, io = "/", qe = void 0, jt = "undefined", jr = "function";
class oo {
  constructor(t) {
    return class extends TransformStream {
      constructor(s, i) {
        const o = new t(i);
        super({
          transform(n, r) {
            r.enqueue(o.append(n));
          },
          flush(n) {
            const r = o.flush();
            r && n.enqueue(r);
          }
        });
      }
    };
  }
}
const Kc = 64;
let ba = 2;
try {
  typeof navigator != jt && navigator.hardwareConcurrency && (ba = navigator.hardwareConcurrency);
} catch {
}
const Xc = {
  chunkSize: 512 * 1024,
  maxWorkers: ba,
  terminateWorkerTimeout: 5e3,
  useWebWorkers: !0,
  useCompressionStream: !0,
  workerScripts: qe,
  CompressionStreamNative: typeof CompressionStream != jt && CompressionStream,
  DecompressionStreamNative: typeof DecompressionStream != jt && DecompressionStream
}, Dt = Object.assign({}, Xc);
function Qc() {
  return Dt;
}
function ef(e) {
  return Math.max(e.chunkSize, Kc);
}
function zn(e) {
  const {
    baseURL: t,
    chunkSize: s,
    maxWorkers: i,
    terminateWorkerTimeout: o,
    useCompressionStream: n,
    useWebWorkers: r,
    Deflate: l,
    Inflate: p,
    CompressionStream: c,
    DecompressionStream: f,
    workerScripts: u
  } = e;
  if (Nt("baseURL", t), Nt("chunkSize", s), Nt("maxWorkers", i), Nt("terminateWorkerTimeout", o), Nt("useCompressionStream", n), Nt("useWebWorkers", r), l && (Dt.CompressionStream = new oo(l)), p && (Dt.DecompressionStream = new oo(p)), Nt("CompressionStream", c), Nt("DecompressionStream", f), u !== qe) {
    const { deflate: g, inflate: w } = u;
    if ((g || w) && (Dt.workerScripts || (Dt.workerScripts = {})), g) {
      if (!Array.isArray(g))
        throw new Error("workerScripts.deflate must be an array");
      Dt.workerScripts.deflate = g;
    }
    if (w) {
      if (!Array.isArray(w))
        throw new Error("workerScripts.inflate must be an array");
      Dt.workerScripts.inflate = w;
    }
  }
}
function Nt(e, t) {
  t !== qe && (Dt[e] = t);
}
const sn = {
  application: {
    "andrew-inset": "ez",
    annodex: "anx",
    "atom+xml": "atom",
    "atomcat+xml": "atomcat",
    "atomserv+xml": "atomsrv",
    bbolin: "lin",
    "cu-seeme": "cu",
    "davmount+xml": "davmount",
    dsptype: "tsp",
    ecmascript: [
      "es",
      "ecma"
    ],
    futuresplash: "spl",
    hta: "hta",
    "java-archive": "jar",
    "java-serialized-object": "ser",
    "java-vm": "class",
    m3g: "m3g",
    "mac-binhex40": "hqx",
    mathematica: [
      "nb",
      "ma",
      "mb"
    ],
    msaccess: "mdb",
    msword: [
      "doc",
      "dot",
      "wiz"
    ],
    mxf: "mxf",
    oda: "oda",
    ogg: "ogx",
    pdf: "pdf",
    "pgp-keys": "key",
    "pgp-signature": [
      "asc",
      "sig"
    ],
    "pics-rules": "prf",
    postscript: [
      "ps",
      "ai",
      "eps",
      "epsi",
      "epsf",
      "eps2",
      "eps3"
    ],
    rar: "rar",
    "rdf+xml": "rdf",
    "rss+xml": "rss",
    rtf: "rtf",
    "xhtml+xml": [
      "xhtml",
      "xht"
    ],
    xml: [
      "xml",
      "xsl",
      "xsd",
      "xpdl"
    ],
    "xspf+xml": "xspf",
    zip: "zip",
    "vnd.android.package-archive": "apk",
    "vnd.cinderella": "cdy",
    "vnd.google-earth.kml+xml": "kml",
    "vnd.google-earth.kmz": "kmz",
    "vnd.mozilla.xul+xml": "xul",
    "vnd.ms-excel": [
      "xls",
      "xlb",
      "xlt",
      "xlm",
      "xla",
      "xlc",
      "xlw"
    ],
    "vnd.ms-pki.seccat": "cat",
    "vnd.ms-pki.stl": "stl",
    "vnd.ms-powerpoint": [
      "ppt",
      "pps",
      "pot",
      "ppa",
      "pwz"
    ],
    "vnd.oasis.opendocument.chart": "odc",
    "vnd.oasis.opendocument.database": "odb",
    "vnd.oasis.opendocument.formula": "odf",
    "vnd.oasis.opendocument.graphics": "odg",
    "vnd.oasis.opendocument.graphics-template": "otg",
    "vnd.oasis.opendocument.image": "odi",
    "vnd.oasis.opendocument.presentation": "odp",
    "vnd.oasis.opendocument.presentation-template": "otp",
    "vnd.oasis.opendocument.spreadsheet": "ods",
    "vnd.oasis.opendocument.spreadsheet-template": "ots",
    "vnd.oasis.opendocument.text": "odt",
    "vnd.oasis.opendocument.text-master": [
      "odm",
      "otm"
    ],
    "vnd.oasis.opendocument.text-template": "ott",
    "vnd.oasis.opendocument.text-web": "oth",
    "vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "vnd.openxmlformats-officedocument.spreadsheetml.template": "xltx",
    "vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "vnd.openxmlformats-officedocument.presentationml.slideshow": "ppsx",
    "vnd.openxmlformats-officedocument.presentationml.template": "potx",
    "vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "vnd.openxmlformats-officedocument.wordprocessingml.template": "dotx",
    "vnd.smaf": "mmf",
    "vnd.stardivision.calc": "sdc",
    "vnd.stardivision.chart": "sds",
    "vnd.stardivision.draw": "sda",
    "vnd.stardivision.impress": "sdd",
    "vnd.stardivision.math": [
      "sdf",
      "smf"
    ],
    "vnd.stardivision.writer": [
      "sdw",
      "vor"
    ],
    "vnd.stardivision.writer-global": "sgl",
    "vnd.sun.xml.calc": "sxc",
    "vnd.sun.xml.calc.template": "stc",
    "vnd.sun.xml.draw": "sxd",
    "vnd.sun.xml.draw.template": "std",
    "vnd.sun.xml.impress": "sxi",
    "vnd.sun.xml.impress.template": "sti",
    "vnd.sun.xml.math": "sxm",
    "vnd.sun.xml.writer": "sxw",
    "vnd.sun.xml.writer.global": "sxg",
    "vnd.sun.xml.writer.template": "stw",
    "vnd.symbian.install": [
      "sis",
      "sisx"
    ],
    "vnd.visio": [
      "vsd",
      "vst",
      "vss",
      "vsw",
      "vsdx",
      "vssx",
      "vstx",
      "vssm",
      "vstm"
    ],
    "vnd.wap.wbxml": "wbxml",
    "vnd.wap.wmlc": "wmlc",
    "vnd.wap.wmlscriptc": "wmlsc",
    "vnd.wordperfect": "wpd",
    "vnd.wordperfect5.1": "wp5",
    "x-123": "wk",
    "x-7z-compressed": "7z",
    "x-abiword": "abw",
    "x-apple-diskimage": "dmg",
    "x-bcpio": "bcpio",
    "x-bittorrent": "torrent",
    "x-cbr": [
      "cbr",
      "cba",
      "cbt",
      "cb7"
    ],
    "x-cbz": "cbz",
    "x-cdf": [
      "cdf",
      "cda"
    ],
    "x-cdlink": "vcd",
    "x-chess-pgn": "pgn",
    "x-cpio": "cpio",
    "x-csh": "csh",
    "x-director": [
      "dir",
      "dxr",
      "cst",
      "cct",
      "cxt",
      "w3d",
      "fgd",
      "swa"
    ],
    "x-dms": "dms",
    "x-doom": "wad",
    "x-dvi": "dvi",
    "x-httpd-eruby": "rhtml",
    "x-font": "pcf.Z",
    "x-freemind": "mm",
    "x-gnumeric": "gnumeric",
    "x-go-sgf": "sgf",
    "x-graphing-calculator": "gcf",
    "x-gtar": [
      "gtar",
      "taz"
    ],
    "x-hdf": "hdf",
    "x-httpd-php": [
      "phtml",
      "pht",
      "php"
    ],
    "x-httpd-php-source": "phps",
    "x-httpd-php3": "php3",
    "x-httpd-php3-preprocessed": "php3p",
    "x-httpd-php4": "php4",
    "x-httpd-php5": "php5",
    "x-ica": "ica",
    "x-info": "info",
    "x-internet-signup": [
      "ins",
      "isp"
    ],
    "x-iphone": "iii",
    "x-iso9660-image": "iso",
    "x-java-jnlp-file": "jnlp",
    "x-jmol": "jmz",
    "x-killustrator": "kil",
    "x-latex": "latex",
    "x-lyx": "lyx",
    "x-lzx": "lzx",
    "x-maker": [
      "frm",
      "fb",
      "fbdoc"
    ],
    "x-ms-wmd": "wmd",
    "x-msdos-program": [
      "com",
      "exe",
      "bat",
      "dll"
    ],
    "x-netcdf": [
      "nc"
    ],
    "x-ns-proxy-autoconfig": [
      "pac",
      "dat"
    ],
    "x-nwc": "nwc",
    "x-object": "o",
    "x-oz-application": "oza",
    "x-pkcs7-certreqresp": "p7r",
    "x-python-code": [
      "pyc",
      "pyo"
    ],
    "x-qgis": [
      "qgs",
      "shp",
      "shx"
    ],
    "x-quicktimeplayer": "qtl",
    "x-redhat-package-manager": [
      "rpm",
      "rpa"
    ],
    "x-ruby": "rb",
    "x-sh": "sh",
    "x-shar": "shar",
    "x-shockwave-flash": [
      "swf",
      "swfl"
    ],
    "x-silverlight": "scr",
    "x-stuffit": "sit",
    "x-sv4cpio": "sv4cpio",
    "x-sv4crc": "sv4crc",
    "x-tar": "tar",
    "x-tex-gf": "gf",
    "x-tex-pk": "pk",
    "x-texinfo": [
      "texinfo",
      "texi"
    ],
    "x-trash": [
      "~",
      "%",
      "bak",
      "old",
      "sik"
    ],
    "x-ustar": "ustar",
    "x-wais-source": "src",
    "x-wingz": "wz",
    "x-x509-ca-cert": [
      "crt",
      "der",
      "cer"
    ],
    "x-xcf": "xcf",
    "x-xfig": "fig",
    "x-xpinstall": "xpi",
    applixware: "aw",
    "atomsvc+xml": "atomsvc",
    "ccxml+xml": "ccxml",
    "cdmi-capability": "cdmia",
    "cdmi-container": "cdmic",
    "cdmi-domain": "cdmid",
    "cdmi-object": "cdmio",
    "cdmi-queue": "cdmiq",
    "docbook+xml": "dbk",
    "dssc+der": "dssc",
    "dssc+xml": "xdssc",
    "emma+xml": "emma",
    "epub+zip": "epub",
    exi: "exi",
    "font-tdpfr": "pfr",
    "gml+xml": "gml",
    "gpx+xml": "gpx",
    gxf: "gxf",
    hyperstudio: "stk",
    "inkml+xml": [
      "ink",
      "inkml"
    ],
    ipfix: "ipfix",
    "jsonml+json": "jsonml",
    "lost+xml": "lostxml",
    "mads+xml": "mads",
    marc: "mrc",
    "marcxml+xml": "mrcx",
    "mathml+xml": [
      "mathml",
      "mml"
    ],
    mbox: "mbox",
    "mediaservercontrol+xml": "mscml",
    "metalink+xml": "metalink",
    "metalink4+xml": "meta4",
    "mets+xml": "mets",
    "mods+xml": "mods",
    mp21: [
      "m21",
      "mp21"
    ],
    mp4: "mp4s",
    "oebps-package+xml": "opf",
    "omdoc+xml": "omdoc",
    onenote: [
      "onetoc",
      "onetoc2",
      "onetmp",
      "onepkg"
    ],
    oxps: "oxps",
    "patch-ops-error+xml": "xer",
    "pgp-encrypted": "pgp",
    pkcs10: "p10",
    "pkcs7-mime": [
      "p7m",
      "p7c"
    ],
    "pkcs7-signature": "p7s",
    pkcs8: "p8",
    "pkix-attr-cert": "ac",
    "pkix-crl": "crl",
    "pkix-pkipath": "pkipath",
    pkixcmp: "pki",
    "pls+xml": "pls",
    "prs.cww": "cww",
    "pskc+xml": "pskcxml",
    "reginfo+xml": "rif",
    "relax-ng-compact-syntax": "rnc",
    "resource-lists+xml": "rl",
    "resource-lists-diff+xml": "rld",
    "rls-services+xml": "rs",
    "rpki-ghostbusters": "gbr",
    "rpki-manifest": "mft",
    "rpki-roa": "roa",
    "rsd+xml": "rsd",
    "sbml+xml": "sbml",
    "scvp-cv-request": "scq",
    "scvp-cv-response": "scs",
    "scvp-vp-request": "spq",
    "scvp-vp-response": "spp",
    sdp: "sdp",
    "set-payment-initiation": "setpay",
    "set-registration-initiation": "setreg",
    "shf+xml": "shf",
    "sparql-query": "rq",
    "sparql-results+xml": "srx",
    srgs: "gram",
    "srgs+xml": "grxml",
    "sru+xml": "sru",
    "ssdl+xml": "ssdl",
    "ssml+xml": "ssml",
    "tei+xml": [
      "tei",
      "teicorpus"
    ],
    "thraud+xml": "tfi",
    "timestamped-data": "tsd",
    "vnd.3gpp.pic-bw-large": "plb",
    "vnd.3gpp.pic-bw-small": "psb",
    "vnd.3gpp.pic-bw-var": "pvb",
    "vnd.3gpp2.tcap": "tcap",
    "vnd.3m.post-it-notes": "pwn",
    "vnd.accpac.simply.aso": "aso",
    "vnd.accpac.simply.imp": "imp",
    "vnd.acucobol": "acu",
    "vnd.acucorp": [
      "atc",
      "acutc"
    ],
    "vnd.adobe.air-application-installer-package+zip": "air",
    "vnd.adobe.formscentral.fcdt": "fcdt",
    "vnd.adobe.fxp": [
      "fxp",
      "fxpl"
    ],
    "vnd.adobe.xdp+xml": "xdp",
    "vnd.adobe.xfdf": "xfdf",
    "vnd.ahead.space": "ahead",
    "vnd.airzip.filesecure.azf": "azf",
    "vnd.airzip.filesecure.azs": "azs",
    "vnd.amazon.ebook": "azw",
    "vnd.americandynamics.acc": "acc",
    "vnd.amiga.ami": "ami",
    "vnd.anser-web-certificate-issue-initiation": "cii",
    "vnd.anser-web-funds-transfer-initiation": "fti",
    "vnd.antix.game-component": "atx",
    "vnd.apple.installer+xml": "mpkg",
    "vnd.apple.mpegurl": "m3u8",
    "vnd.aristanetworks.swi": "swi",
    "vnd.astraea-software.iota": "iota",
    "vnd.audiograph": "aep",
    "vnd.blueice.multipass": "mpm",
    "vnd.bmi": "bmi",
    "vnd.businessobjects": "rep",
    "vnd.chemdraw+xml": "cdxml",
    "vnd.chipnuts.karaoke-mmd": "mmd",
    "vnd.claymore": "cla",
    "vnd.cloanto.rp9": "rp9",
    "vnd.clonk.c4group": [
      "c4g",
      "c4d",
      "c4f",
      "c4p",
      "c4u"
    ],
    "vnd.cluetrust.cartomobile-config": "c11amc",
    "vnd.cluetrust.cartomobile-config-pkg": "c11amz",
    "vnd.commonspace": "csp",
    "vnd.contact.cmsg": "cdbcmsg",
    "vnd.cosmocaller": "cmc",
    "vnd.crick.clicker": "clkx",
    "vnd.crick.clicker.keyboard": "clkk",
    "vnd.crick.clicker.palette": "clkp",
    "vnd.crick.clicker.template": "clkt",
    "vnd.crick.clicker.wordbank": "clkw",
    "vnd.criticaltools.wbs+xml": "wbs",
    "vnd.ctc-posml": "pml",
    "vnd.cups-ppd": "ppd",
    "vnd.curl.car": "car",
    "vnd.curl.pcurl": "pcurl",
    "vnd.dart": "dart",
    "vnd.data-vision.rdz": "rdz",
    "vnd.dece.data": [
      "uvf",
      "uvvf",
      "uvd",
      "uvvd"
    ],
    "vnd.dece.ttml+xml": [
      "uvt",
      "uvvt"
    ],
    "vnd.dece.unspecified": [
      "uvx",
      "uvvx"
    ],
    "vnd.dece.zip": [
      "uvz",
      "uvvz"
    ],
    "vnd.denovo.fcselayout-link": "fe_launch",
    "vnd.dna": "dna",
    "vnd.dolby.mlp": "mlp",
    "vnd.dpgraph": "dpg",
    "vnd.dreamfactory": "dfac",
    "vnd.ds-keypoint": "kpxx",
    "vnd.dvb.ait": "ait",
    "vnd.dvb.service": "svc",
    "vnd.dynageo": "geo",
    "vnd.ecowin.chart": "mag",
    "vnd.enliven": "nml",
    "vnd.epson.esf": "esf",
    "vnd.epson.msf": "msf",
    "vnd.epson.quickanime": "qam",
    "vnd.epson.salt": "slt",
    "vnd.epson.ssf": "ssf",
    "vnd.eszigno3+xml": [
      "es3",
      "et3"
    ],
    "vnd.ezpix-album": "ez2",
    "vnd.ezpix-package": "ez3",
    "vnd.fdf": "fdf",
    "vnd.fdsn.mseed": "mseed",
    "vnd.fdsn.seed": [
      "seed",
      "dataless"
    ],
    "vnd.flographit": "gph",
    "vnd.fluxtime.clip": "ftc",
    "vnd.framemaker": [
      "fm",
      "frame",
      "maker",
      "book"
    ],
    "vnd.frogans.fnc": "fnc",
    "vnd.frogans.ltf": "ltf",
    "vnd.fsc.weblaunch": "fsc",
    "vnd.fujitsu.oasys": "oas",
    "vnd.fujitsu.oasys2": "oa2",
    "vnd.fujitsu.oasys3": "oa3",
    "vnd.fujitsu.oasysgp": "fg5",
    "vnd.fujitsu.oasysprs": "bh2",
    "vnd.fujixerox.ddd": "ddd",
    "vnd.fujixerox.docuworks": "xdw",
    "vnd.fujixerox.docuworks.binder": "xbd",
    "vnd.fuzzysheet": "fzs",
    "vnd.genomatix.tuxedo": "txd",
    "vnd.geogebra.file": "ggb",
    "vnd.geogebra.tool": "ggt",
    "vnd.geometry-explorer": [
      "gex",
      "gre"
    ],
    "vnd.geonext": "gxt",
    "vnd.geoplan": "g2w",
    "vnd.geospace": "g3w",
    "vnd.gmx": "gmx",
    "vnd.grafeq": [
      "gqf",
      "gqs"
    ],
    "vnd.groove-account": "gac",
    "vnd.groove-help": "ghf",
    "vnd.groove-identity-message": "gim",
    "vnd.groove-injector": "grv",
    "vnd.groove-tool-message": "gtm",
    "vnd.groove-tool-template": "tpl",
    "vnd.groove-vcard": "vcg",
    "vnd.hal+xml": "hal",
    "vnd.handheld-entertainment+xml": "zmm",
    "vnd.hbci": "hbci",
    "vnd.hhe.lesson-player": "les",
    "vnd.hp-hpgl": "hpgl",
    "vnd.hp-hpid": "hpid",
    "vnd.hp-hps": "hps",
    "vnd.hp-jlyt": "jlt",
    "vnd.hp-pcl": "pcl",
    "vnd.hp-pclxl": "pclxl",
    "vnd.hydrostatix.sof-data": "sfd-hdstx",
    "vnd.ibm.minipay": "mpy",
    "vnd.ibm.modcap": [
      "afp",
      "listafp",
      "list3820"
    ],
    "vnd.ibm.rights-management": "irm",
    "vnd.ibm.secure-container": "sc",
    "vnd.iccprofile": [
      "icc",
      "icm"
    ],
    "vnd.igloader": "igl",
    "vnd.immervision-ivp": "ivp",
    "vnd.immervision-ivu": "ivu",
    "vnd.insors.igm": "igm",
    "vnd.intercon.formnet": [
      "xpw",
      "xpx"
    ],
    "vnd.intergeo": "i2g",
    "vnd.intu.qbo": "qbo",
    "vnd.intu.qfx": "qfx",
    "vnd.ipunplugged.rcprofile": "rcprofile",
    "vnd.irepository.package+xml": "irp",
    "vnd.is-xpr": "xpr",
    "vnd.isac.fcs": "fcs",
    "vnd.jam": "jam",
    "vnd.jcp.javame.midlet-rms": "rms",
    "vnd.jisp": "jisp",
    "vnd.joost.joda-archive": "joda",
    "vnd.kahootz": [
      "ktz",
      "ktr"
    ],
    "vnd.kde.karbon": "karbon",
    "vnd.kde.kchart": "chrt",
    "vnd.kde.kformula": "kfo",
    "vnd.kde.kivio": "flw",
    "vnd.kde.kontour": "kon",
    "vnd.kde.kpresenter": [
      "kpr",
      "kpt"
    ],
    "vnd.kde.kspread": "ksp",
    "vnd.kde.kword": [
      "kwd",
      "kwt"
    ],
    "vnd.kenameaapp": "htke",
    "vnd.kidspiration": "kia",
    "vnd.kinar": [
      "kne",
      "knp"
    ],
    "vnd.koan": [
      "skp",
      "skd",
      "skt",
      "skm"
    ],
    "vnd.kodak-descriptor": "sse",
    "vnd.las.las+xml": "lasxml",
    "vnd.llamagraphics.life-balance.desktop": "lbd",
    "vnd.llamagraphics.life-balance.exchange+xml": "lbe",
    "vnd.lotus-1-2-3": "123",
    "vnd.lotus-approach": "apr",
    "vnd.lotus-freelance": "pre",
    "vnd.lotus-notes": "nsf",
    "vnd.lotus-organizer": "org",
    "vnd.lotus-screencam": "scm",
    "vnd.lotus-wordpro": "lwp",
    "vnd.macports.portpkg": "portpkg",
    "vnd.mcd": "mcd",
    "vnd.medcalcdata": "mc1",
    "vnd.mediastation.cdkey": "cdkey",
    "vnd.mfer": "mwf",
    "vnd.mfmp": "mfm",
    "vnd.micrografx.flo": "flo",
    "vnd.micrografx.igx": "igx",
    "vnd.mif": "mif",
    "vnd.mobius.daf": "daf",
    "vnd.mobius.dis": "dis",
    "vnd.mobius.mbk": "mbk",
    "vnd.mobius.mqy": "mqy",
    "vnd.mobius.msl": "msl",
    "vnd.mobius.plc": "plc",
    "vnd.mobius.txf": "txf",
    "vnd.mophun.application": "mpn",
    "vnd.mophun.certificate": "mpc",
    "vnd.ms-artgalry": "cil",
    "vnd.ms-cab-compressed": "cab",
    "vnd.ms-excel.addin.macroenabled.12": "xlam",
    "vnd.ms-excel.sheet.binary.macroenabled.12": "xlsb",
    "vnd.ms-excel.sheet.macroenabled.12": "xlsm",
    "vnd.ms-excel.template.macroenabled.12": "xltm",
    "vnd.ms-fontobject": "eot",
    "vnd.ms-htmlhelp": "chm",
    "vnd.ms-ims": "ims",
    "vnd.ms-lrm": "lrm",
    "vnd.ms-officetheme": "thmx",
    "vnd.ms-powerpoint.addin.macroenabled.12": "ppam",
    "vnd.ms-powerpoint.presentation.macroenabled.12": "pptm",
    "vnd.ms-powerpoint.slide.macroenabled.12": "sldm",
    "vnd.ms-powerpoint.slideshow.macroenabled.12": "ppsm",
    "vnd.ms-powerpoint.template.macroenabled.12": "potm",
    "vnd.ms-project": [
      "mpp",
      "mpt"
    ],
    "vnd.ms-word.document.macroenabled.12": "docm",
    "vnd.ms-word.template.macroenabled.12": "dotm",
    "vnd.ms-works": [
      "wps",
      "wks",
      "wcm",
      "wdb"
    ],
    "vnd.ms-wpl": "wpl",
    "vnd.ms-xpsdocument": "xps",
    "vnd.mseq": "mseq",
    "vnd.musician": "mus",
    "vnd.muvee.style": "msty",
    "vnd.mynfc": "taglet",
    "vnd.neurolanguage.nlu": "nlu",
    "vnd.nitf": [
      "ntf",
      "nitf"
    ],
    "vnd.noblenet-directory": "nnd",
    "vnd.noblenet-sealer": "nns",
    "vnd.noblenet-web": "nnw",
    "vnd.nokia.n-gage.data": "ngdat",
    "vnd.nokia.n-gage.symbian.install": "n-gage",
    "vnd.nokia.radio-preset": "rpst",
    "vnd.nokia.radio-presets": "rpss",
    "vnd.novadigm.edm": "edm",
    "vnd.novadigm.edx": "edx",
    "vnd.novadigm.ext": "ext",
    "vnd.oasis.opendocument.chart-template": "otc",
    "vnd.oasis.opendocument.formula-template": "odft",
    "vnd.oasis.opendocument.image-template": "oti",
    "vnd.olpc-sugar": "xo",
    "vnd.oma.dd2+xml": "dd2",
    "vnd.openofficeorg.extension": "oxt",
    "vnd.openxmlformats-officedocument.presentationml.slide": "sldx",
    "vnd.osgeo.mapguide.package": "mgp",
    "vnd.osgi.dp": "dp",
    "vnd.osgi.subsystem": "esa",
    "vnd.palm": [
      "pdb",
      "pqa",
      "oprc"
    ],
    "vnd.pawaafile": "paw",
    "vnd.pg.format": "str",
    "vnd.pg.osasli": "ei6",
    "vnd.picsel": "efif",
    "vnd.pmi.widget": "wg",
    "vnd.pocketlearn": "plf",
    "vnd.powerbuilder6": "pbd",
    "vnd.previewsystems.box": "box",
    "vnd.proteus.magazine": "mgz",
    "vnd.publishare-delta-tree": "qps",
    "vnd.pvi.ptid1": "ptid",
    "vnd.quark.quarkxpress": [
      "qxd",
      "qxt",
      "qwd",
      "qwt",
      "qxl",
      "qxb"
    ],
    "vnd.realvnc.bed": "bed",
    "vnd.recordare.musicxml": "mxl",
    "vnd.recordare.musicxml+xml": "musicxml",
    "vnd.rig.cryptonote": "cryptonote",
    "vnd.rn-realmedia": "rm",
    "vnd.rn-realmedia-vbr": "rmvb",
    "vnd.route66.link66+xml": "link66",
    "vnd.sailingtracker.track": "st",
    "vnd.seemail": "see",
    "vnd.sema": "sema",
    "vnd.semd": "semd",
    "vnd.semf": "semf",
    "vnd.shana.informed.formdata": "ifm",
    "vnd.shana.informed.formtemplate": "itp",
    "vnd.shana.informed.interchange": "iif",
    "vnd.shana.informed.package": "ipk",
    "vnd.simtech-mindmapper": [
      "twd",
      "twds"
    ],
    "vnd.smart.teacher": "teacher",
    "vnd.solent.sdkm+xml": [
      "sdkm",
      "sdkd"
    ],
    "vnd.spotfire.dxp": "dxp",
    "vnd.spotfire.sfs": "sfs",
    "vnd.stepmania.package": "smzip",
    "vnd.stepmania.stepchart": "sm",
    "vnd.sus-calendar": [
      "sus",
      "susp"
    ],
    "vnd.svd": "svd",
    "vnd.syncml+xml": "xsm",
    "vnd.syncml.dm+wbxml": "bdm",
    "vnd.syncml.dm+xml": "xdm",
    "vnd.tao.intent-module-archive": "tao",
    "vnd.tcpdump.pcap": [
      "pcap",
      "cap",
      "dmp"
    ],
    "vnd.tmobile-livetv": "tmo",
    "vnd.trid.tpt": "tpt",
    "vnd.triscape.mxs": "mxs",
    "vnd.trueapp": "tra",
    "vnd.ufdl": [
      "ufd",
      "ufdl"
    ],
    "vnd.uiq.theme": "utz",
    "vnd.umajin": "umj",
    "vnd.unity": "unityweb",
    "vnd.uoml+xml": "uoml",
    "vnd.vcx": "vcx",
    "vnd.visionary": "vis",
    "vnd.vsf": "vsf",
    "vnd.webturbo": "wtb",
    "vnd.wolfram.player": "nbp",
    "vnd.wqd": "wqd",
    "vnd.wt.stf": "stf",
    "vnd.xara": "xar",
    "vnd.xfdl": "xfdl",
    "vnd.yamaha.hv-dic": "hvd",
    "vnd.yamaha.hv-script": "hvs",
    "vnd.yamaha.hv-voice": "hvp",
    "vnd.yamaha.openscoreformat": "osf",
    "vnd.yamaha.openscoreformat.osfpvg+xml": "osfpvg",
    "vnd.yamaha.smaf-audio": "saf",
    "vnd.yamaha.smaf-phrase": "spf",
    "vnd.yellowriver-custom-menu": "cmp",
    "vnd.zul": [
      "zir",
      "zirz"
    ],
    "vnd.zzazz.deck+xml": "zaz",
    "voicexml+xml": "vxml",
    widget: "wgt",
    winhlp: "hlp",
    "wsdl+xml": "wsdl",
    "wspolicy+xml": "wspolicy",
    "x-ace-compressed": "ace",
    "x-authorware-bin": [
      "aab",
      "x32",
      "u32",
      "vox"
    ],
    "x-authorware-map": "aam",
    "x-authorware-seg": "aas",
    "x-blorb": [
      "blb",
      "blorb"
    ],
    "x-bzip": "bz",
    "x-bzip2": [
      "bz2",
      "boz"
    ],
    "x-cfs-compressed": "cfs",
    "x-chat": "chat",
    "x-conference": "nsc",
    "x-dgc-compressed": "dgc",
    "x-dtbncx+xml": "ncx",
    "x-dtbook+xml": "dtb",
    "x-dtbresource+xml": "res",
    "x-eva": "eva",
    "x-font-bdf": "bdf",
    "x-font-ghostscript": "gsf",
    "x-font-linux-psf": "psf",
    "x-font-pcf": "pcf",
    "x-font-snf": "snf",
    "x-font-ttf": [
      "ttf",
      "ttc"
    ],
    "x-font-type1": [
      "pfa",
      "pfb",
      "pfm",
      "afm"
    ],
    "x-freearc": "arc",
    "x-gca-compressed": "gca",
    "x-glulx": "ulx",
    "x-gramps-xml": "gramps",
    "x-install-instructions": "install",
    "x-lzh-compressed": [
      "lzh",
      "lha"
    ],
    "x-mie": "mie",
    "x-mobipocket-ebook": [
      "prc",
      "mobi"
    ],
    "x-ms-application": "application",
    "x-ms-shortcut": "lnk",
    "x-ms-xbap": "xbap",
    "x-msbinder": "obd",
    "x-mscardfile": "crd",
    "x-msclip": "clp",
    "application/x-ms-installer": "msi",
    "x-msmediaview": [
      "mvb",
      "m13",
      "m14"
    ],
    "x-msmetafile": [
      "wmf",
      "wmz",
      "emf",
      "emz"
    ],
    "x-msmoney": "mny",
    "x-mspublisher": "pub",
    "x-msschedule": "scd",
    "x-msterminal": "trm",
    "x-mswrite": "wri",
    "x-nzb": "nzb",
    "x-pkcs12": [
      "p12",
      "pfx"
    ],
    "x-pkcs7-certificates": [
      "p7b",
      "spc"
    ],
    "x-research-info-systems": "ris",
    "x-silverlight-app": "xap",
    "x-sql": "sql",
    "x-stuffitx": "sitx",
    "x-subrip": "srt",
    "x-t3vm-image": "t3",
    "x-tex-tfm": "tfm",
    "x-tgif": "obj",
    "x-xliff+xml": "xlf",
    "x-xz": "xz",
    "x-zmachine": [
      "z1",
      "z2",
      "z3",
      "z4",
      "z5",
      "z6",
      "z7",
      "z8"
    ],
    "xaml+xml": "xaml",
    "xcap-diff+xml": "xdf",
    "xenc+xml": "xenc",
    "xml-dtd": "dtd",
    "xop+xml": "xop",
    "xproc+xml": "xpl",
    "xslt+xml": "xslt",
    "xv+xml": [
      "mxml",
      "xhvml",
      "xvml",
      "xvm"
    ],
    yang: "yang",
    "yin+xml": "yin",
    envoy: "evy",
    fractals: "fif",
    "internet-property-stream": "acx",
    olescript: "axs",
    "vnd.ms-outlook": "msg",
    "vnd.ms-pkicertstore": "sst",
    "x-compress": "z",
    "x-perfmon": [
      "pma",
      "pmc",
      "pmr",
      "pmw"
    ],
    "ynd.ms-pkipko": "pko",
    gzip: [
      "gz",
      "tgz"
    ],
    "smil+xml": [
      "smi",
      "smil"
    ],
    "vnd.debian.binary-package": [
      "deb",
      "udeb"
    ],
    "vnd.hzn-3d-crossword": "x3d",
    "vnd.sqlite3": [
      "db",
      "sqlite",
      "sqlite3",
      "db-wal",
      "sqlite-wal",
      "db-shm",
      "sqlite-shm"
    ],
    "vnd.wap.sic": "sic",
    "vnd.wap.slc": "slc",
    "x-krita": [
      "kra",
      "krz"
    ],
    "x-perl": [
      "pm",
      "pl"
    ],
    yaml: [
      "yaml",
      "yml"
    ]
  },
  audio: {
    amr: "amr",
    "amr-wb": "awb",
    annodex: "axa",
    basic: [
      "au",
      "snd"
    ],
    flac: "flac",
    midi: [
      "mid",
      "midi",
      "kar",
      "rmi"
    ],
    mpeg: [
      "mpga",
      "mpega",
      "mp3",
      "m4a",
      "mp2a",
      "m2a",
      "m3a"
    ],
    mpegurl: "m3u",
    ogg: [
      "oga",
      "ogg",
      "spx"
    ],
    "prs.sid": "sid",
    "x-aiff": "aifc",
    "x-gsm": "gsm",
    "x-ms-wma": "wma",
    "x-ms-wax": "wax",
    "x-pn-realaudio": "ram",
    "x-realaudio": "ra",
    "x-sd2": "sd2",
    adpcm: "adp",
    mp4: "mp4a",
    s3m: "s3m",
    silk: "sil",
    "vnd.dece.audio": [
      "uva",
      "uvva"
    ],
    "vnd.digital-winds": "eol",
    "vnd.dra": "dra",
    "vnd.dts": "dts",
    "vnd.dts.hd": "dtshd",
    "vnd.lucent.voice": "lvp",
    "vnd.ms-playready.media.pya": "pya",
    "vnd.nuera.ecelp4800": "ecelp4800",
    "vnd.nuera.ecelp7470": "ecelp7470",
    "vnd.nuera.ecelp9600": "ecelp9600",
    "vnd.rip": "rip",
    webm: "weba",
    "x-caf": "caf",
    "x-matroska": "mka",
    "x-pn-realaudio-plugin": "rmp",
    xm: "xm",
    aac: "aac",
    aiff: [
      "aiff",
      "aif",
      "aff"
    ],
    opus: "opus",
    wav: "wav"
  },
  chemical: {
    "x-alchemy": "alc",
    "x-cache": [
      "cac",
      "cache"
    ],
    "x-cache-csf": "csf",
    "x-cactvs-binary": [
      "cbin",
      "cascii",
      "ctab"
    ],
    "x-cdx": "cdx",
    "x-chem3d": "c3d",
    "x-cif": "cif",
    "x-cmdf": "cmdf",
    "x-cml": "cml",
    "x-compass": "cpa",
    "x-crossfire": "bsd",
    "x-csml": [
      "csml",
      "csm"
    ],
    "x-ctx": "ctx",
    "x-cxf": [
      "cxf",
      "cef"
    ],
    "x-embl-dl-nucleotide": [
      "emb",
      "embl"
    ],
    "x-gamess-input": [
      "inp",
      "gam",
      "gamin"
    ],
    "x-gaussian-checkpoint": [
      "fch",
      "fchk"
    ],
    "x-gaussian-cube": "cub",
    "x-gaussian-input": [
      "gau",
      "gjc",
      "gjf"
    ],
    "x-gaussian-log": "gal",
    "x-gcg8-sequence": "gcg",
    "x-genbank": "gen",
    "x-hin": "hin",
    "x-isostar": [
      "istr",
      "ist"
    ],
    "x-jcamp-dx": [
      "jdx",
      "dx"
    ],
    "x-kinemage": "kin",
    "x-macmolecule": "mcm",
    "x-macromodel-input": "mmod",
    "x-mdl-molfile": "mol",
    "x-mdl-rdfile": "rd",
    "x-mdl-rxnfile": "rxn",
    "x-mdl-sdfile": "sd",
    "x-mdl-tgf": "tgf",
    "x-mmcif": "mcif",
    "x-mol2": "mol2",
    "x-molconn-Z": "b",
    "x-mopac-graph": "gpt",
    "x-mopac-input": [
      "mop",
      "mopcrt",
      "zmt"
    ],
    "x-mopac-out": "moo",
    "x-ncbi-asn1": "asn",
    "x-ncbi-asn1-ascii": [
      "prt",
      "ent"
    ],
    "x-ncbi-asn1-binary": "val",
    "x-rosdal": "ros",
    "x-swissprot": "sw",
    "x-vamas-iso14976": "vms",
    "x-vmd": "vmd",
    "x-xtel": "xtel",
    "x-xyz": "xyz"
  },
  font: {
    otf: "otf",
    woff: "woff",
    woff2: "woff2"
  },
  image: {
    gif: "gif",
    ief: "ief",
    jpeg: [
      "jpeg",
      "jpg",
      "jpe",
      "jfif",
      "jfif-tbnl",
      "jif"
    ],
    pcx: "pcx",
    png: "png",
    "svg+xml": [
      "svg",
      "svgz"
    ],
    tiff: [
      "tiff",
      "tif"
    ],
    "vnd.djvu": [
      "djvu",
      "djv"
    ],
    "vnd.wap.wbmp": "wbmp",
    "x-canon-cr2": "cr2",
    "x-canon-crw": "crw",
    "x-cmu-raster": "ras",
    "x-coreldraw": "cdr",
    "x-coreldrawpattern": "pat",
    "x-coreldrawtemplate": "cdt",
    "x-corelphotopaint": "cpt",
    "x-epson-erf": "erf",
    "x-icon": "ico",
    "x-jg": "art",
    "x-jng": "jng",
    "x-nikon-nef": "nef",
    "x-olympus-orf": "orf",
    "x-portable-anymap": "pnm",
    "x-portable-bitmap": "pbm",
    "x-portable-graymap": "pgm",
    "x-portable-pixmap": "ppm",
    "x-rgb": "rgb",
    "x-xbitmap": "xbm",
    "x-xpixmap": "xpm",
    "x-xwindowdump": "xwd",
    bmp: "bmp",
    cgm: "cgm",
    g3fax: "g3",
    ktx: "ktx",
    "prs.btif": "btif",
    sgi: "sgi",
    "vnd.dece.graphic": [
      "uvi",
      "uvvi",
      "uvg",
      "uvvg"
    ],
    "vnd.dwg": "dwg",
    "vnd.dxf": "dxf",
    "vnd.fastbidsheet": "fbs",
    "vnd.fpx": "fpx",
    "vnd.fst": "fst",
    "vnd.fujixerox.edmics-mmr": "mmr",
    "vnd.fujixerox.edmics-rlc": "rlc",
    "vnd.ms-modi": "mdi",
    "vnd.ms-photo": "wdp",
    "vnd.net-fpx": "npx",
    "vnd.xiff": "xif",
    webp: "webp",
    "x-3ds": "3ds",
    "x-cmx": "cmx",
    "x-freehand": [
      "fh",
      "fhc",
      "fh4",
      "fh5",
      "fh7"
    ],
    "x-pict": [
      "pic",
      "pct"
    ],
    "x-tga": "tga",
    "cis-cod": "cod",
    avif: "avifs",
    heic: [
      "heif",
      "heic"
    ],
    pjpeg: [
      "pjpg"
    ],
    "vnd.adobe.photoshop": "psd",
    "x-adobe-dng": "dng",
    "x-fuji-raf": "raf",
    "x-icns": "icns",
    "x-kodak-dcr": "dcr",
    "x-kodak-k25": "k25",
    "x-kodak-kdc": "kdc",
    "x-minolta-mrw": "mrw",
    "x-panasonic-raw": [
      "raw",
      "rw2",
      "rwl"
    ],
    "x-pentax-pef": [
      "pef",
      "ptx"
    ],
    "x-sigma-x3f": "x3f",
    "x-sony-arw": "arw",
    "x-sony-sr2": "sr2",
    "x-sony-srf": "srf"
  },
  message: {
    rfc822: [
      "eml",
      "mime",
      "mht",
      "mhtml",
      "nws"
    ]
  },
  model: {
    iges: [
      "igs",
      "iges"
    ],
    mesh: [
      "msh",
      "mesh",
      "silo"
    ],
    vrml: [
      "wrl",
      "vrml"
    ],
    "x3d+vrml": [
      "x3dv",
      "x3dvz"
    ],
    "x3d+xml": "x3dz",
    "x3d+binary": [
      "x3db",
      "x3dbz"
    ],
    "vnd.collada+xml": "dae",
    "vnd.dwf": "dwf",
    "vnd.gdl": "gdl",
    "vnd.gtw": "gtw",
    "vnd.mts": "mts",
    "vnd.usdz+zip": "usdz",
    "vnd.vtu": "vtu"
  },
  text: {
    "cache-manifest": [
      "manifest",
      "appcache"
    ],
    calendar: [
      "ics",
      "icz",
      "ifb"
    ],
    css: "css",
    csv: "csv",
    h323: "323",
    html: [
      "html",
      "htm",
      "shtml",
      "stm"
    ],
    iuls: "uls",
    plain: [
      "txt",
      "text",
      "brf",
      "conf",
      "def",
      "list",
      "log",
      "in",
      "bas",
      "diff",
      "ksh"
    ],
    richtext: "rtx",
    scriptlet: [
      "sct",
      "wsc"
    ],
    texmacs: "tm",
    "tab-separated-values": "tsv",
    "vnd.sun.j2me.app-descriptor": "jad",
    "vnd.wap.wml": "wml",
    "vnd.wap.wmlscript": "wmls",
    "x-bibtex": "bib",
    "x-boo": "boo",
    "x-c++hdr": [
      "h++",
      "hpp",
      "hxx",
      "hh"
    ],
    "x-c++src": [
      "c++",
      "cpp",
      "cxx",
      "cc"
    ],
    "x-component": "htc",
    "x-dsrc": "d",
    "x-diff": "patch",
    "x-haskell": "hs",
    "x-java": "java",
    "x-literate-haskell": "lhs",
    "x-moc": "moc",
    "x-pascal": [
      "p",
      "pas",
      "pp",
      "inc"
    ],
    "x-pcs-gcd": "gcd",
    "x-python": "py",
    "x-scala": "scala",
    "x-setext": "etx",
    "x-tcl": [
      "tcl",
      "tk"
    ],
    "x-tex": [
      "tex",
      "ltx",
      "sty",
      "cls"
    ],
    "x-vcalendar": "vcs",
    "x-vcard": "vcf",
    n3: "n3",
    "prs.lines.tag": "dsc",
    sgml: [
      "sgml",
      "sgm"
    ],
    troff: [
      "t",
      "tr",
      "roff",
      "man",
      "me",
      "ms"
    ],
    turtle: "ttl",
    "uri-list": [
      "uri",
      "uris",
      "urls"
    ],
    vcard: "vcard",
    "vnd.curl": "curl",
    "vnd.curl.dcurl": "dcurl",
    "vnd.curl.scurl": "scurl",
    "vnd.curl.mcurl": "mcurl",
    "vnd.dvb.subtitle": "sub",
    "vnd.fly": "fly",
    "vnd.fmi.flexstor": "flx",
    "vnd.graphviz": "gv",
    "vnd.in3d.3dml": "3dml",
    "vnd.in3d.spot": "spot",
    "x-asm": [
      "s",
      "asm"
    ],
    "x-c": [
      "c",
      "h",
      "dic"
    ],
    "x-fortran": [
      "f",
      "for",
      "f77",
      "f90"
    ],
    "x-opml": "opml",
    "x-nfo": "nfo",
    "x-sfv": "sfv",
    "x-uuencode": "uu",
    webviewhtml: "htt",
    javascript: "js",
    json: "json",
    markdown: [
      "md",
      "markdown",
      "mdown",
      "markdn"
    ],
    "vnd.wap.si": "si",
    "vnd.wap.sl": "sl"
  },
  video: {
    avif: "avif",
    "3gpp": "3gp",
    annodex: "axv",
    dl: "dl",
    dv: [
      "dif",
      "dv"
    ],
    fli: "fli",
    gl: "gl",
    mpeg: [
      "mpeg",
      "mpg",
      "mpe",
      "m1v",
      "m2v",
      "mp2",
      "mpa",
      "mpv2"
    ],
    mp4: [
      "mp4",
      "mp4v",
      "mpg4"
    ],
    quicktime: [
      "qt",
      "mov"
    ],
    ogg: "ogv",
    "vnd.mpegurl": [
      "mxu",
      "m4u"
    ],
    "x-flv": "flv",
    "x-la-asf": [
      "lsf",
      "lsx"
    ],
    "x-mng": "mng",
    "x-ms-asf": [
      "asf",
      "asx",
      "asr"
    ],
    "x-ms-wm": "wm",
    "x-ms-wmv": "wmv",
    "x-ms-wmx": "wmx",
    "x-ms-wvx": "wvx",
    "x-msvideo": "avi",
    "x-sgi-movie": "movie",
    "x-matroska": [
      "mpv",
      "mkv",
      "mk3d",
      "mks"
    ],
    "3gpp2": "3g2",
    h261: "h261",
    h263: "h263",
    h264: "h264",
    jpeg: "jpgv",
    jpm: [
      "jpm",
      "jpgm"
    ],
    mj2: [
      "mj2",
      "mjp2"
    ],
    "vnd.dece.hd": [
      "uvh",
      "uvvh"
    ],
    "vnd.dece.mobile": [
      "uvm",
      "uvvm"
    ],
    "vnd.dece.pd": [
      "uvp",
      "uvvp"
    ],
    "vnd.dece.sd": [
      "uvs",
      "uvvs"
    ],
    "vnd.dece.video": [
      "uvv",
      "uvvv"
    ],
    "vnd.dvb.file": "dvb",
    "vnd.fvt": "fvt",
    "vnd.ms-playready.media.pyv": "pyv",
    "vnd.uvvu.mp4": [
      "uvu",
      "uvvu"
    ],
    "vnd.vivo": "viv",
    webm: "webm",
    "x-f4v": "f4v",
    "x-m4v": "m4v",
    "x-ms-vob": "vob",
    "x-smv": "smv",
    mp2t: "ts"
  },
  "x-conference": {
    "x-cooltalk": "ice"
  },
  "x-world": {
    "x-vrml": [
      "vrm",
      "flr",
      "wrz",
      "xaf",
      "xof"
    ]
  }
};
(() => {
  const e = {};
  for (const t of Object.keys(sn))
    for (const s of Object.keys(sn[t])) {
      const i = sn[t][s];
      if (typeof i == "string")
        e[i] = t + "/" + s;
      else
        for (let o = 0; o < i.length; o++)
          e[i[o]] = t + "/" + s;
    }
  return e;
})();
const va = [];
for (let e = 0; e < 256; e++) {
  let t = e;
  for (let s = 0; s < 8; s++)
    t & 1 ? t = t >>> 1 ^ 3988292384 : t = t >>> 1;
  va[e] = t;
}
class vs {
  constructor(t) {
    this.crc = t || -1;
  }
  append(t) {
    let s = this.crc | 0;
    for (let i = 0, o = t.length | 0; i < o; i++)
      s = s >>> 8 ^ va[(s ^ t[i]) & 255];
    this.crc = s;
  }
  get() {
    return ~this.crc;
  }
}
class Pa extends TransformStream {
  constructor() {
    let t;
    const s = new vs();
    super({
      transform(i, o) {
        s.append(i), o.enqueue(i);
      },
      flush() {
        const i = new Uint8Array(4);
        new DataView(i.buffer).setUint32(0, s.get()), t.value = i;
      }
    }), t = this;
  }
}
function tf(e) {
  if (typeof TextEncoder == jt) {
    e = unescape(encodeURIComponent(e));
    const t = new Uint8Array(e.length);
    for (let s = 0; s < t.length; s++)
      t[s] = e.charCodeAt(s);
    return t;
  } else
    return new TextEncoder().encode(e);
}
const je = {
  /**
   * Concatenate two bit arrays.
   * @param {bitArray} a1 The first array.
   * @param {bitArray} a2 The second array.
   * @return {bitArray} The concatenation of a1 and a2.
   */
  concat(e, t) {
    if (e.length === 0 || t.length === 0)
      return e.concat(t);
    const s = e[e.length - 1], i = je.getPartial(s);
    return i === 32 ? e.concat(t) : je._shiftRight(t, i, s | 0, e.slice(0, e.length - 1));
  },
  /**
   * Find the length of an array of bits.
   * @param {bitArray} a The array.
   * @return {Number} The length of a, in bits.
   */
  bitLength(e) {
    const t = e.length;
    if (t === 0)
      return 0;
    const s = e[t - 1];
    return (t - 1) * 32 + je.getPartial(s);
  },
  /**
   * Truncate an array.
   * @param {bitArray} a The array.
   * @param {Number} len The length to truncate to, in bits.
   * @return {bitArray} A new array, truncated to len bits.
   */
  clamp(e, t) {
    if (e.length * 32 < t)
      return e;
    e = e.slice(0, Math.ceil(t / 32));
    const s = e.length;
    return t = t & 31, s > 0 && t && (e[s - 1] = je.partial(t, e[s - 1] & 2147483648 >> t - 1, 1)), e;
  },
  /**
   * Make a partial word for a bit array.
   * @param {Number} len The number of bits in the word.
   * @param {Number} x The bits.
   * @param {Number} [_end=0] Pass 1 if x has already been shifted to the high side.
   * @return {Number} The partial word.
   */
  partial(e, t, s) {
    return e === 32 ? t : (s ? t | 0 : t << 32 - e) + e * 1099511627776;
  },
  /**
   * Get the number of bits used by a partial word.
   * @param {Number} x The partial word.
   * @return {Number} The number of bits used by the partial word.
   */
  getPartial(e) {
    return Math.round(e / 1099511627776) || 32;
  },
  /** Shift an array right.
   * @param {bitArray} a The array to shift.
   * @param {Number} shift The number of bits to shift.
   * @param {Number} [carry=0] A byte to carry in
   * @param {bitArray} [out=[]] An array to prepend to the output.
   * @private
   */
  _shiftRight(e, t, s, i) {
    for (i === void 0 && (i = []); t >= 32; t -= 32)
      i.push(s), s = 0;
    if (t === 0)
      return i.concat(e);
    for (let r = 0; r < e.length; r++)
      i.push(s | e[r] >>> t), s = e[r] << 32 - t;
    const o = e.length ? e[e.length - 1] : 0, n = je.getPartial(o);
    return i.push(je.partial(t + n & 31, t + n > 32 ? s : i.pop(), 1)), i;
  }
}, Ps = {
  bytes: {
    /** Convert from a bitArray to an array of bytes. */
    fromBits(e) {
      const s = je.bitLength(e) / 8, i = new Uint8Array(s);
      let o;
      for (let n = 0; n < s; n++)
        n & 3 || (o = e[n / 4]), i[n] = o >>> 24, o <<= 8;
      return i;
    },
    /** Convert from an array of bytes to a bitArray. */
    toBits(e) {
      const t = [];
      let s, i = 0;
      for (s = 0; s < e.length; s++)
        i = i << 8 | e[s], (s & 3) === 3 && (t.push(i), i = 0);
      return s & 3 && t.push(je.partial(8 * (s & 3), i)), t;
    }
  }
}, xa = {};
xa.sha1 = class {
  constructor(e) {
    const t = this;
    t.blockSize = 512, t._init = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], t._key = [1518500249, 1859775393, 2400959708, 3395469782], e ? (t._h = e._h.slice(0), t._buffer = e._buffer.slice(0), t._length = e._length) : t.reset();
  }
  /**
   * Reset the hash state.
   * @return this
   */
  reset() {
    const e = this;
    return e._h = e._init.slice(0), e._buffer = [], e._length = 0, e;
  }
  /**
   * Input several words to the hash.
   * @param {bitArray|String} data the data to hash.
   * @return this
   */
  update(e) {
    const t = this;
    typeof e == "string" && (e = Ps.utf8String.toBits(e));
    const s = t._buffer = je.concat(t._buffer, e), i = t._length, o = t._length = i + je.bitLength(e);
    if (o > 9007199254740991)
      throw new Error("Cannot hash more than 2^53 - 1 bits");
    const n = new Uint32Array(s);
    let r = 0;
    for (let l = t.blockSize + i - (t.blockSize + i & t.blockSize - 1); l <= o; l += t.blockSize)
      t._block(n.subarray(16 * r, 16 * (r + 1))), r += 1;
    return s.splice(0, 16 * r), t;
  }
  /**
   * Complete hashing and output the hash value.
   * @return {bitArray} The hash value, an array of 5 big-endian words. TODO
   */
  finalize() {
    const e = this;
    let t = e._buffer;
    const s = e._h;
    t = je.concat(t, [je.partial(1, 1)]);
    for (let i = t.length + 2; i & 15; i++)
      t.push(0);
    for (t.push(Math.floor(e._length / 4294967296)), t.push(e._length | 0); t.length; )
      e._block(t.splice(0, 16));
    return e.reset(), s;
  }
  /**
   * The SHA-1 logical functions f(0), f(1), ..., f(79).
   * @private
   */
  _f(e, t, s, i) {
    if (e <= 19)
      return t & s | ~t & i;
    if (e <= 39)
      return t ^ s ^ i;
    if (e <= 59)
      return t & s | t & i | s & i;
    if (e <= 79)
      return t ^ s ^ i;
  }
  /**
   * Circular left-shift operator.
   * @private
   */
  _S(e, t) {
    return t << e | t >>> 32 - e;
  }
  /**
   * Perform one cycle of SHA-1.
   * @param {Uint32Array|bitArray} words one block of words.
   * @private
   */
  _block(e) {
    const t = this, s = t._h, i = Array(80);
    for (let c = 0; c < 16; c++)
      i[c] = e[c];
    let o = s[0], n = s[1], r = s[2], l = s[3], p = s[4];
    for (let c = 0; c <= 79; c++) {
      c >= 16 && (i[c] = t._S(1, i[c - 3] ^ i[c - 8] ^ i[c - 14] ^ i[c - 16]));
      const f = t._S(5, o) + t._f(c, n, r, l) + p + i[c] + t._key[Math.floor(c / 20)] | 0;
      p = l, l = r, r = t._S(30, n), n = o, o = f;
    }
    s[0] = s[0] + o | 0, s[1] = s[1] + n | 0, s[2] = s[2] + r | 0, s[3] = s[3] + l | 0, s[4] = s[4] + p | 0;
  }
};
const $a = {};
$a.aes = class {
  constructor(e) {
    const t = this;
    t._tables = [[[], [], [], [], []], [[], [], [], [], []]], t._tables[0][0][0] || t._precompute();
    const s = t._tables[0][4], i = t._tables[1], o = e.length;
    let n, r, l, p = 1;
    if (o !== 4 && o !== 6 && o !== 8)
      throw new Error("invalid aes key size");
    for (t._key = [r = e.slice(0), l = []], n = o; n < 4 * o + 28; n++) {
      let c = r[n - 1];
      (n % o === 0 || o === 8 && n % o === 4) && (c = s[c >>> 24] << 24 ^ s[c >> 16 & 255] << 16 ^ s[c >> 8 & 255] << 8 ^ s[c & 255], n % o === 0 && (c = c << 8 ^ c >>> 24 ^ p << 24, p = p << 1 ^ (p >> 7) * 283)), r[n] = r[n - o] ^ c;
    }
    for (let c = 0; n; c++, n--) {
      const f = r[c & 3 ? n : n - 4];
      n <= 4 || c < 4 ? l[c] = f : l[c] = i[0][s[f >>> 24]] ^ i[1][s[f >> 16 & 255]] ^ i[2][s[f >> 8 & 255]] ^ i[3][s[f & 255]];
    }
  }
  // public
  /* Something like this might appear here eventually
  name: "AES",
  blockSize: 4,
  keySizes: [4,6,8],
  */
  /**
   * Encrypt an array of 4 big-endian words.
   * @param {Array} data The plaintext.
   * @return {Array} The ciphertext.
   */
  encrypt(e) {
    return this._crypt(e, 0);
  }
  /**
   * Decrypt an array of 4 big-endian words.
   * @param {Array} data The ciphertext.
   * @return {Array} The plaintext.
   */
  decrypt(e) {
    return this._crypt(e, 1);
  }
  /**
   * Expand the S-box tables.
   *
   * @private
   */
  _precompute() {
    const e = this._tables[0], t = this._tables[1], s = e[4], i = t[4], o = [], n = [];
    let r, l, p, c;
    for (let f = 0; f < 256; f++)
      n[(o[f] = f << 1 ^ (f >> 7) * 283) ^ f] = f;
    for (let f = r = 0; !s[f]; f ^= l || 1, r = n[r] || 1) {
      let u = r ^ r << 1 ^ r << 2 ^ r << 3 ^ r << 4;
      u = u >> 8 ^ u & 255 ^ 99, s[f] = u, i[u] = f, c = o[p = o[l = o[f]]];
      let g = c * 16843009 ^ p * 65537 ^ l * 257 ^ f * 16843008, w = o[u] * 257 ^ u * 16843008;
      for (let O = 0; O < 4; O++)
        e[O][f] = w = w << 24 ^ w >>> 8, t[O][u] = g = g << 24 ^ g >>> 8;
    }
    for (let f = 0; f < 5; f++)
      e[f] = e[f].slice(0), t[f] = t[f].slice(0);
  }
  /**
   * Encryption and decryption core.
   * @param {Array} input Four words to be encrypted or decrypted.
   * @param dir The direction, 0 for encrypt and 1 for decrypt.
   * @return {Array} The four encrypted or decrypted words.
   * @private
   */
  _crypt(e, t) {
    if (e.length !== 4)
      throw new Error("invalid aes block size");
    const s = this._key[t], i = s.length / 4 - 2, o = [0, 0, 0, 0], n = this._tables[t], r = n[0], l = n[1], p = n[2], c = n[3], f = n[4];
    let u = e[0] ^ s[0], g = e[t ? 3 : 1] ^ s[1], w = e[2] ^ s[2], O = e[t ? 1 : 3] ^ s[3], m = 4, h, _, k;
    for (let v = 0; v < i; v++)
      h = r[u >>> 24] ^ l[g >> 16 & 255] ^ p[w >> 8 & 255] ^ c[O & 255] ^ s[m], _ = r[g >>> 24] ^ l[w >> 16 & 255] ^ p[O >> 8 & 255] ^ c[u & 255] ^ s[m + 1], k = r[w >>> 24] ^ l[O >> 16 & 255] ^ p[u >> 8 & 255] ^ c[g & 255] ^ s[m + 2], O = r[O >>> 24] ^ l[u >> 16 & 255] ^ p[g >> 8 & 255] ^ c[w & 255] ^ s[m + 3], m += 4, u = h, g = _, w = k;
    for (let v = 0; v < 4; v++)
      o[t ? 3 & -v : v] = f[u >>> 24] << 24 ^ f[g >> 16 & 255] << 16 ^ f[w >> 8 & 255] << 8 ^ f[O & 255] ^ s[m++], h = u, u = g, g = w, w = O, O = h;
    return o;
  }
};
const rf = {
  /** 
   * Generate random words with pure js, cryptographically not as strong & safe as native implementation.
   * @param {TypedArray} typedArray The array to fill.
   * @return {TypedArray} The random values.
   */
  getRandomValues(e) {
    const t = new Uint32Array(e.buffer), s = (i) => {
      let o = 987654321;
      const n = 4294967295;
      return function() {
        return o = 36969 * (o & 65535) + (o >> 16) & n, i = 18e3 * (i & 65535) + (i >> 16) & n, (((o << 16) + i & n) / 4294967296 + 0.5) * (Math.random() > 0.5 ? 1 : -1);
      };
    };
    for (let i = 0, o; i < e.length; i += 4) {
      const n = s((o || Math.random()) * 4294967296);
      o = n() * 987654071, t[i / 4] = n() * 4294967296 | 0;
    }
    return e;
  }
}, ka = {};
ka.ctrGladman = class {
  constructor(e, t) {
    this._prf = e, this._initIv = t, this._iv = t;
  }
  reset() {
    this._iv = this._initIv;
  }
  /** Input some data to calculate.
   * @param {bitArray} data the data to process, it must be intergral multiple of 128 bits unless it's the last.
   */
  update(e) {
    return this.calculate(this._prf, e, this._iv);
  }
  incWord(e) {
    if ((e >> 24 & 255) === 255) {
      let t = e >> 16 & 255, s = e >> 8 & 255, i = e & 255;
      t === 255 ? (t = 0, s === 255 ? (s = 0, i === 255 ? i = 0 : ++i) : ++s) : ++t, e = 0, e += t << 16, e += s << 8, e += i;
    } else
      e += 1 << 24;
    return e;
  }
  incCounter(e) {
    (e[0] = this.incWord(e[0])) === 0 && (e[1] = this.incWord(e[1]));
  }
  calculate(e, t, s) {
    let i;
    if (!(i = t.length))
      return [];
    const o = je.bitLength(t);
    for (let n = 0; n < i; n += 4) {
      this.incCounter(s);
      const r = e.encrypt(s);
      t[n] ^= r[0], t[n + 1] ^= r[1], t[n + 2] ^= r[2], t[n + 3] ^= r[3];
    }
    return je.clamp(t, o);
  }
};
const Qt = {
  importKey(e) {
    return new Qt.hmacSha1(Ps.bytes.toBits(e));
  },
  pbkdf2(e, t, s, i) {
    if (s = s || 1e4, i < 0 || s < 0)
      throw new Error("invalid params to pbkdf2");
    const o = (i >> 5) + 1 << 2;
    let n, r, l, p, c;
    const f = new ArrayBuffer(o), u = new DataView(f);
    let g = 0;
    const w = je;
    for (t = Ps.bytes.toBits(t), c = 1; g < (o || 1); c++) {
      for (n = r = e.encrypt(w.concat(t, [c])), l = 1; l < s; l++)
        for (r = e.encrypt(r), p = 0; p < r.length; p++)
          n[p] ^= r[p];
      for (l = 0; g < (o || 1) && l < n.length; l++)
        u.setInt32(g, n[l]), g += 4;
    }
    return f.slice(0, i / 8);
  }
};
Qt.hmacSha1 = class {
  constructor(e) {
    const t = this, s = t._hash = xa.sha1, i = [[], []];
    t._baseHash = [new s(), new s()];
    const o = t._baseHash[0].blockSize / 32;
    e.length > o && (e = new s().update(e).finalize());
    for (let n = 0; n < o; n++)
      i[0][n] = e[n] ^ 909522486, i[1][n] = e[n] ^ 1549556828;
    t._baseHash[0].update(i[0]), t._baseHash[1].update(i[1]), t._resultHash = new s(t._baseHash[0]);
  }
  reset() {
    const e = this;
    e._resultHash = new e._hash(e._baseHash[0]), e._updated = !1;
  }
  update(e) {
    const t = this;
    t._updated = !0, t._resultHash.update(e);
  }
  digest() {
    const e = this, t = e._resultHash.finalize(), s = new e._hash(e._baseHash[1]).update(t).finalize();
    return e.reset(), s;
  }
  encrypt(e) {
    if (this._updated)
      throw new Error("encrypt on already updated hmac called!");
    return this.update(e), this.digest(e);
  }
};
const sf = typeof crypto != jt && typeof crypto.getRandomValues == jr, Ea = "Invalid password", Oa = "Invalid signature", Yn = "zipjs-abort-check-password";
function Ta(e) {
  return sf ? crypto.getRandomValues(e) : rf.getRandomValues(e);
}
const cr = 16, nf = "raw", Sa = { name: "PBKDF2" }, of = { name: "HMAC" }, af = "SHA-1", lf = Object.assign({ hash: of }, Sa), $n = Object.assign({ iterations: 1e3, hash: { name: af } }, Sa), pf = ["deriveBits"], Rr = [8, 12, 16], xr = [16, 24, 32], It = 10, cf = [0, 0, 0, 0], Rs = typeof crypto != jt, qr = Rs && crypto.subtle, Aa = Rs && typeof qr != jt, bt = Ps.bytes, ff = $a.aes, uf = ka.ctrGladman, df = Qt.hmacSha1;
let ao = Rs && Aa && typeof qr.importKey == jr, lo = Rs && Aa && typeof qr.deriveBits == jr;
class mf extends TransformStream {
  constructor({ password: t, rawPassword: s, signed: i, encryptionStrength: o, checkPasswordOnly: n }) {
    super({
      start() {
        Object.assign(this, {
          ready: new Promise((r) => this.resolveReady = r),
          password: Ca(t, s),
          signed: i,
          strength: o - 1,
          pending: new Uint8Array()
        });
      },
      async transform(r, l) {
        const p = this, {
          password: c,
          strength: f,
          resolveReady: u,
          ready: g
        } = p;
        c ? (await yf(p, f, c, it(r, 0, Rr[f] + 2)), r = it(r, Rr[f] + 2), n ? l.error(new Error(Yn)) : u()) : await g;
        const w = new Uint8Array(r.length - It - (r.length - It) % cr);
        l.enqueue(Ra(p, r, w, 0, It, !0));
      },
      async flush(r) {
        const {
          signed: l,
          ctr: p,
          hmac: c,
          pending: f,
          ready: u
        } = this;
        if (c && p) {
          await u;
          const g = it(f, 0, f.length - It), w = it(f, f.length - It);
          let O = new Uint8Array();
          if (g.length) {
            const m = Cr(bt, g);
            c.update(m);
            const h = p.update(m);
            O = Lr(bt, h);
          }
          if (l) {
            const m = it(Lr(bt, c.digest()), 0, It);
            for (let h = 0; h < It; h++)
              if (m[h] != w[h])
                throw new Error(Oa);
          }
          r.enqueue(O);
        }
      }
    });
  }
}
class hf extends TransformStream {
  constructor({ password: t, rawPassword: s, encryptionStrength: i }) {
    let o;
    super({
      start() {
        Object.assign(this, {
          ready: new Promise((n) => this.resolveReady = n),
          password: Ca(t, s),
          strength: i - 1,
          pending: new Uint8Array()
        });
      },
      async transform(n, r) {
        const l = this, {
          password: p,
          strength: c,
          resolveReady: f,
          ready: u
        } = l;
        let g = new Uint8Array();
        p ? (g = await gf(l, c, p), f()) : await u;
        const w = new Uint8Array(g.length + n.length - n.length % cr);
        w.set(g, 0), r.enqueue(Ra(l, n, w, g.length, 0));
      },
      async flush(n) {
        const {
          ctr: r,
          hmac: l,
          pending: p,
          ready: c
        } = this;
        if (l && r) {
          await c;
          let f = new Uint8Array();
          if (p.length) {
            const u = r.update(Cr(bt, p));
            l.update(u), f = Lr(bt, u);
          }
          o.signature = Lr(bt, l.digest()).slice(0, It), n.enqueue(Gn(f, o.signature));
        }
      }
    }), o = this;
  }
}
function Ra(e, t, s, i, o, n) {
  const {
    ctr: r,
    hmac: l,
    pending: p
  } = e, c = t.length - o;
  p.length && (t = Gn(p, t), s = bf(s, c - c % cr));
  let f;
  for (f = 0; f <= c - cr; f += cr) {
    const u = Cr(bt, it(t, f, f + cr));
    n && l.update(u);
    const g = r.update(u);
    n || l.update(g), s.set(Lr(bt, g), f + i);
  }
  return e.pending = it(t, f), s;
}
async function yf(e, t, s, i) {
  const o = await La(e, t, s, it(i, 0, Rr[t])), n = it(i, Rr[t]);
  if (o[0] != n[0] || o[1] != n[1])
    throw new Error(Ea);
}
async function gf(e, t, s) {
  const i = Ta(new Uint8Array(Rr[t])), o = await La(e, t, s, i);
  return Gn(i, o);
}
async function La(e, t, s, i) {
  e.password = null;
  const o = await _f(nf, s, lf, !1, pf), n = await wf(Object.assign({ salt: i }, $n), o, 8 * (xr[t] * 2 + 2)), r = new Uint8Array(n), l = Cr(bt, it(r, 0, xr[t])), p = Cr(bt, it(r, xr[t], xr[t] * 2)), c = it(r, xr[t] * 2);
  return Object.assign(e, {
    keys: {
      key: l,
      authentication: p,
      passwordVerification: c
    },
    ctr: new uf(new ff(l), Array.from(cf)),
    hmac: new df(p)
  }), c;
}
async function _f(e, t, s, i, o) {
  if (ao)
    try {
      return await qr.importKey(e, t, s, i, o);
    } catch {
      return ao = !1, Qt.importKey(t);
    }
  else
    return Qt.importKey(t);
}
async function wf(e, t, s) {
  if (lo)
    try {
      return await qr.deriveBits(e, t, s);
    } catch {
      return lo = !1, Qt.pbkdf2(t, e.salt, $n.iterations, s);
    }
  else
    return Qt.pbkdf2(t, e.salt, $n.iterations, s);
}
function Ca(e, t) {
  return t === qe ? tf(e) : t;
}
function Gn(e, t) {
  let s = e;
  return e.length + t.length && (s = new Uint8Array(e.length + t.length), s.set(e, 0), s.set(t, e.length)), s;
}
function bf(e, t) {
  if (t && t > e.length) {
    const s = e;
    e = new Uint8Array(t), e.set(s, 0);
  }
  return e;
}
function it(e, t, s) {
  return e.subarray(t, s);
}
function Lr(e, t) {
  return e.fromBits(t);
}
function Cr(e, t) {
  return e.toBits(t);
}
const ur = 12;
class vf extends TransformStream {
  constructor({ password: t, passwordVerification: s, checkPasswordOnly: i }) {
    super({
      start() {
        Object.assign(this, {
          password: t,
          passwordVerification: s
        }), Na(this, t);
      },
      transform(o, n) {
        const r = this;
        if (r.password) {
          const l = po(r, o.subarray(0, ur));
          if (r.password = null, l[ur - 1] != r.passwordVerification)
            throw new Error(Ea);
          o = o.subarray(ur);
        }
        i ? n.error(new Error(Yn)) : n.enqueue(po(r, o));
      }
    });
  }
}
class Pf extends TransformStream {
  constructor({ password: t, passwordVerification: s }) {
    super({
      start() {
        Object.assign(this, {
          password: t,
          passwordVerification: s
        }), Na(this, t);
      },
      transform(i, o) {
        const n = this;
        let r, l;
        if (n.password) {
          n.password = null;
          const p = Ta(new Uint8Array(ur));
          p[ur - 1] = n.passwordVerification, r = new Uint8Array(i.length + p.length), r.set(co(n, p), 0), l = ur;
        } else
          r = new Uint8Array(i.length), l = 0;
        r.set(co(n, i), l), o.enqueue(r);
      }
    });
  }
}
function po(e, t) {
  const s = new Uint8Array(t.length);
  for (let i = 0; i < t.length; i++)
    s[i] = Ia(e) ^ t[i], Zn(e, s[i]);
  return s;
}
function co(e, t) {
  const s = new Uint8Array(t.length);
  for (let i = 0; i < t.length; i++)
    s[i] = Ia(e) ^ t[i], Zn(e, t[i]);
  return s;
}
function Na(e, t) {
  const s = [305419896, 591751049, 878082192];
  Object.assign(e, {
    keys: s,
    crcKey0: new vs(s[0]),
    crcKey2: new vs(s[2])
  });
  for (let i = 0; i < t.length; i++)
    Zn(e, t.charCodeAt(i));
}
function Zn(e, t) {
  let [s, i, o] = e.keys;
  e.crcKey0.append([t]), s = ~e.crcKey0.get(), i = fo(Math.imul(fo(i + Fa(s)), 134775813) + 1), e.crcKey2.append([i >>> 24]), o = ~e.crcKey2.get(), e.keys = [s, i, o];
}
function Ia(e) {
  const t = e.keys[2] | 2;
  return Fa(Math.imul(t, t ^ 1) >>> 8);
}
function Fa(e) {
  return e & 255;
}
function fo(e) {
  return e & 4294967295;
}
const uo = "deflate-raw";
class xf extends TransformStream {
  constructor(t, { chunkSize: s, CompressionStream: i, CompressionStreamNative: o }) {
    super({});
    const { compressed: n, encrypted: r, useCompressionStream: l, zipCrypto: p, signed: c, level: f } = t, u = this;
    let g, w, O = Da(super.readable);
    (!r || p) && c && (g = new Pa(), O = vt(O, g)), n && (O = ja(O, l, { level: f, chunkSize: s }, o, i)), r && (p ? O = vt(O, new Pf(t)) : (w = new hf(t), O = vt(O, w))), Ua(u, O, () => {
      let m;
      r && !p && (m = w.signature), (!r || p) && c && (m = new DataView(g.value.buffer).getUint32(0)), u.signature = m;
    });
  }
}
class $f extends TransformStream {
  constructor(t, { chunkSize: s, DecompressionStream: i, DecompressionStreamNative: o }) {
    super({});
    const { zipCrypto: n, encrypted: r, signed: l, signature: p, compressed: c, useCompressionStream: f } = t;
    let u, g, w = Da(super.readable);
    r && (n ? w = vt(w, new vf(t)) : (g = new mf(t), w = vt(w, g))), c && (w = ja(w, f, { chunkSize: s }, o, i)), (!r || n) && l && (u = new Pa(), w = vt(w, u)), Ua(this, w, () => {
      if ((!r || n) && l) {
        const O = new DataView(u.value.buffer);
        if (p != O.getUint32(0, !1))
          throw new Error(Oa);
      }
    });
  }
}
function Da(e) {
  return vt(e, new TransformStream({
    transform(t, s) {
      t && t.length && s.enqueue(t);
    }
  }));
}
function Ua(e, t, s) {
  t = vt(t, new TransformStream({ flush: s })), Object.defineProperty(e, "readable", {
    get() {
      return t;
    }
  });
}
function ja(e, t, s, i, o) {
  try {
    const n = t && i ? i : o;
    e = vt(e, new n(uo, s));
  } catch {
    if (t)
      try {
        e = vt(e, new o(uo, s));
      } catch {
        return e;
      }
    else
      return e;
  }
  return e;
}
function vt(e, t) {
  return e.pipeThrough(t);
}
const kf = "message", Ef = "start", Of = "pull", mo = "data", Tf = "ack", ho = "close", Sf = "deflate", qa = "inflate";
class Af extends TransformStream {
  constructor(t, s) {
    super({});
    const i = this, { codecType: o } = t;
    let n;
    o.startsWith(Sf) ? n = xf : o.startsWith(qa) && (n = $f);
    let r = 0, l = 0;
    const p = new n(t, s), c = super.readable, f = new TransformStream({
      transform(g, w) {
        g && g.length && (l += g.length, w.enqueue(g));
      },
      flush() {
        Object.assign(i, {
          inputSize: l
        });
      }
    }), u = new TransformStream({
      transform(g, w) {
        g && g.length && (r += g.length, w.enqueue(g));
      },
      flush() {
        const { signature: g } = p;
        Object.assign(i, {
          signature: g,
          outputSize: r,
          inputSize: l
        });
      }
    });
    Object.defineProperty(i, "readable", {
      get() {
        return c.pipeThrough(f).pipeThrough(p).pipeThrough(u);
      }
    });
  }
}
class Rf extends TransformStream {
  constructor(t) {
    let s;
    super({
      transform: i,
      flush(o) {
        s && s.length && o.enqueue(s);
      }
    });
    function i(o, n) {
      if (s) {
        const r = new Uint8Array(s.length + o.length);
        r.set(s), r.set(o, s.length), o = r, s = null;
      }
      o.length > t ? (n.enqueue(o.slice(0, t)), i(o.slice(t), n)) : s = o;
    }
  }
}
let Wa = typeof Worker != jt;
class nn {
  constructor(t, { readable: s, writable: i }, { options: o, config: n, streamOptions: r, useWebWorkers: l, transferStreams: p, scripts: c }, f) {
    const { signal: u } = r;
    return Object.assign(t, {
      busy: !0,
      readable: s.pipeThrough(new Rf(n.chunkSize)).pipeThrough(new Lf(s, r), { signal: u }),
      writable: i,
      options: Object.assign({}, o),
      scripts: c,
      transferStreams: p,
      terminate() {
        return new Promise((g) => {
          const { worker: w, busy: O } = t;
          w ? (O ? t.resolveTerminated = g : (w.terminate(), g()), t.interface = null) : g();
        });
      },
      onTaskFinished() {
        const { resolveTerminated: g } = t;
        g && (t.resolveTerminated = null, t.terminated = !0, t.worker.terminate(), g()), t.busy = !1, f(t);
      }
    }), (l && Wa ? Cf : Ma)(t, n);
  }
}
class Lf extends TransformStream {
  constructor(t, { onstart: s, onprogress: i, size: o, onend: n }) {
    let r = 0;
    super({
      async start() {
        s && await on(s, o);
      },
      async transform(l, p) {
        r += l.length, i && await on(i, r, o), p.enqueue(l);
      },
      async flush() {
        t.size = r, n && await on(n, r);
      }
    });
  }
}
async function on(e, ...t) {
  try {
    await e(...t);
  } catch {
  }
}
function Ma(e, t) {
  return {
    run: () => Nf(e, t)
  };
}
function Cf(e, t) {
  const { baseURL: s, chunkSize: i } = t;
  if (!e.interface) {
    let o;
    try {
      o = Df(e.scripts[0], s, e);
    } catch {
      return Wa = !1, Ma(e, t);
    }
    Object.assign(e, {
      worker: o,
      interface: {
        run: () => If(e, { chunkSize: i })
      }
    });
  }
  return e.interface;
}
async function Nf({ options: e, readable: t, writable: s, onTaskFinished: i }, o) {
  try {
    const n = new Af(e, o);
    await t.pipeThrough(n).pipeTo(s, { preventClose: !0, preventAbort: !0 });
    const {
      signature: r,
      inputSize: l,
      outputSize: p
    } = n;
    return {
      signature: r,
      inputSize: l,
      outputSize: p
    };
  } finally {
    i();
  }
}
async function If(e, t) {
  let s, i;
  const o = new Promise((g, w) => {
    s = g, i = w;
  });
  Object.assign(e, {
    reader: null,
    writer: null,
    resolveResult: s,
    rejectResult: i,
    result: o
  });
  const { readable: n, options: r, scripts: l } = e, { writable: p, closed: c } = Ff(e.writable), f = ps({
    type: Ef,
    scripts: l.slice(1),
    options: r,
    config: t,
    readable: n,
    writable: p
  }, e);
  f || Object.assign(e, {
    reader: n.getReader(),
    writer: p.getWriter()
  });
  const u = await o;
  return f || await p.getWriter().close(), await c, u;
}
function Ff(e) {
  let t;
  const s = new Promise((o) => t = o);
  return { writable: new WritableStream({
    async write(o) {
      const n = e.getWriter();
      await n.ready, await n.write(o), n.releaseLock();
    },
    close() {
      t();
    },
    abort(o) {
      return e.getWriter().abort(o);
    }
  }), closed: s };
}
let yo = !0, go = !0;
function Df(e, t, s) {
  const i = { type: "module" };
  let o, n;
  typeof e == jr && (e = e());
  try {
    o = new URL(e, t);
  } catch {
    o = e;
  }
  if (yo)
    try {
      n = new Worker(o);
    } catch {
      yo = !1, n = new Worker(o, i);
    }
  else
    n = new Worker(o, i);
  return n.addEventListener(kf, (r) => Uf(r, s)), n;
}
function ps(e, { worker: t, writer: s, onTaskFinished: i, transferStreams: o }) {
  try {
    const { value: n, readable: r, writable: l } = e, p = [];
    if (n && (n.byteLength < n.buffer.byteLength ? e.value = n.buffer.slice(0, n.byteLength) : e.value = n.buffer, p.push(e.value)), o && go ? (r && p.push(r), l && p.push(l)) : e.readable = e.writable = null, p.length)
      try {
        return t.postMessage(e, p), !0;
      } catch {
        go = !1, e.readable = e.writable = null, t.postMessage(e);
      }
    else
      t.postMessage(e);
  } catch (n) {
    throw s && s.releaseLock(), i(), n;
  }
}
async function Uf({ data: e }, t) {
  const { type: s, value: i, messageId: o, result: n, error: r } = e, { reader: l, writer: p, resolveResult: c, rejectResult: f, onTaskFinished: u } = t;
  try {
    if (r) {
      const { message: w, stack: O, code: m, name: h } = r, _ = new Error(w);
      Object.assign(_, { stack: O, code: m, name: h }), g(_);
    } else {
      if (s == Of) {
        const { value: w, done: O } = await l.read();
        ps({ type: mo, value: w, done: O, messageId: o }, t);
      }
      s == mo && (await p.ready, await p.write(new Uint8Array(i)), ps({ type: Tf, messageId: o }, t)), s == ho && g(null, n);
    }
  } catch (w) {
    ps({ type: ho, messageId: o }, t), g(w);
  }
  function g(w, O) {
    w ? f(w) : c(O), p && p.releaseLock(), u();
  }
}
let Zt = [];
const an = [];
let _o = 0;
async function jf(e, t) {
  const { options: s, config: i } = t, { transferStreams: o, useWebWorkers: n, useCompressionStream: r, codecType: l, compressed: p, signed: c, encrypted: f } = s, { workerScripts: u, maxWorkers: g } = i;
  t.transferStreams = o || o === qe;
  const w = !p && !c && !f && !t.transferStreams;
  return t.useWebWorkers = !w && (n || n === qe && i.useWebWorkers), t.scripts = t.useWebWorkers && u ? u[l] : [], s.useCompressionStream = r || r === qe && i.useCompressionStream, (await O()).run();
  async function O() {
    const h = Zt.find((_) => !_.busy);
    if (h)
      return wo(h), new nn(h, e, t, m);
    if (Zt.length < g) {
      const _ = { indexWorker: _o };
      return _o++, Zt.push(_), new nn(_, e, t, m);
    } else
      return new Promise((_) => an.push({ resolve: _, stream: e, workerOptions: t }));
  }
  function m(h) {
    if (an.length) {
      const [{ resolve: _, stream: k, workerOptions: v }] = an.splice(0, 1);
      _(new nn(h, k, v, m));
    } else h.worker ? (wo(h), qf(h, t)) : Zt = Zt.filter((_) => _ != h);
  }
}
function qf(e, t) {
  const { config: s } = t, { terminateWorkerTimeout: i } = s;
  Number.isFinite(i) && i >= 0 && (e.terminated ? e.terminated = !1 : e.terminateTimeout = setTimeout(async () => {
    Zt = Zt.filter((o) => o != e);
    try {
      await e.terminate();
    } catch {
    }
  }, i));
}
function wo(e) {
  const { terminateTimeout: t } = e;
  t && (clearTimeout(t), e.terminateTimeout = null);
}
function Wf(e, t = {}) {
  const s = `const{Array:e,Object:t,Number:n,Math:r,Error:s,Uint8Array:i,Uint16Array:o,Uint32Array:c,Int32Array:f,Map:a,DataView:l,Promise:u,TextEncoder:w,crypto:h,postMessage:d,TransformStream:p,ReadableStream:y,WritableStream:m,CompressionStream:b,DecompressionStream:g}=self,k=void 0,v="undefined",S="function";class z{constructor(e){return class extends p{constructor(t,n){const r=new e(n);super({transform(e,t){t.enqueue(r.append(e))},flush(e){const t=r.flush();t&&e.enqueue(t)}})}}}}const C=[];for(let e=0;256>e;e++){let t=e;for(let e=0;8>e;e++)1&t?t=t>>>1^3988292384:t>>>=1;C[e]=t}class x{constructor(e){this.t=e||-1}append(e){let t=0|this.t;for(let n=0,r=0|e.length;r>n;n++)t=t>>>8^C[255&(t^e[n])];this.t=t}get(){return~this.t}}class A extends p{constructor(){let e;const t=new x;super({transform(e,n){t.append(e),n.enqueue(e)},flush(){const n=new i(4);new l(n.buffer).setUint32(0,t.get()),e.value=n}}),e=this}}const _={concat(e,t){if(0===e.length||0===t.length)return e.concat(t);const n=e[e.length-1],r=_.i(n);return 32===r?e.concat(t):_.o(t,r,0|n,e.slice(0,e.length-1))},l(e){const t=e.length;if(0===t)return 0;const n=e[t-1];return 32*(t-1)+_.i(n)},u(e,t){if(32*e.length<t)return e;const n=(e=e.slice(0,r.ceil(t/32))).length;return t&=31,n>0&&t&&(e[n-1]=_.h(t,e[n-1]&2147483648>>t-1,1)),e},h:(e,t,n)=>32===e?t:(n?0|t:t<<32-e)+1099511627776*e,i:e=>r.round(e/1099511627776)||32,o(e,t,n,r){for(void 0===r&&(r=[]);t>=32;t-=32)r.push(n),n=0;if(0===t)return r.concat(e);for(let s=0;s<e.length;s++)r.push(n|e[s]>>>t),n=e[s]<<32-t;const s=e.length?e[e.length-1]:0,i=_.i(s);return r.push(_.h(t+i&31,t+i>32?n:r.pop(),1)),r}},I={bytes:{p(e){const t=_.l(e)/8,n=new i(t);let r;for(let s=0;t>s;s++)3&s||(r=e[s/4]),n[s]=r>>>24,r<<=8;return n},m(e){const t=[];let n,r=0;for(n=0;n<e.length;n++)r=r<<8|e[n],3&~n||(t.push(r),r=0);return 3&n&&t.push(_.h(8*(3&n),r)),t}}},P=class{constructor(e){const t=this;t.blockSize=512,t.k=[1732584193,4023233417,2562383102,271733878,3285377520],t.v=[1518500249,1859775393,2400959708,3395469782],e?(t.S=e.S.slice(0),t.C=e.C.slice(0),t.A=e.A):t.reset()}reset(){const e=this;return e.S=e.k.slice(0),e.C=[],e.A=0,e}update(e){const t=this;"string"==typeof e&&(e=I._.m(e));const n=t.C=_.concat(t.C,e),r=t.A,i=t.A=r+_.l(e);if(i>9007199254740991)throw new s("Cannot hash more than 2^53 - 1 bits");const o=new c(n);let f=0;for(let e=t.blockSize+r-(t.blockSize+r&t.blockSize-1);i>=e;e+=t.blockSize)t.I(o.subarray(16*f,16*(f+1))),f+=1;return n.splice(0,16*f),t}P(){const e=this;let t=e.C;const n=e.S;t=_.concat(t,[_.h(1,1)]);for(let e=t.length+2;15&e;e++)t.push(0);for(t.push(r.floor(e.A/4294967296)),t.push(0|e.A);t.length;)e.I(t.splice(0,16));return e.reset(),n}D(e,t,n,r){return e>19?e>39?e>59?e>79?void 0:t^n^r:t&n|t&r|n&r:t^n^r:t&n|~t&r}V(e,t){return t<<e|t>>>32-e}I(t){const n=this,s=n.S,i=e(80);for(let e=0;16>e;e++)i[e]=t[e];let o=s[0],c=s[1],f=s[2],a=s[3],l=s[4];for(let e=0;79>=e;e++){16>e||(i[e]=n.V(1,i[e-3]^i[e-8]^i[e-14]^i[e-16]));const t=n.V(5,o)+n.D(e,c,f,a)+l+i[e]+n.v[r.floor(e/20)]|0;l=a,a=f,f=n.V(30,c),c=o,o=t}s[0]=s[0]+o|0,s[1]=s[1]+c|0,s[2]=s[2]+f|0,s[3]=s[3]+a|0,s[4]=s[4]+l|0}},D={getRandomValues(e){const t=new c(e.buffer),n=e=>{let t=987654321;const n=4294967295;return()=>(t=36969*(65535&t)+(t>>16)&n,(((t<<16)+(e=18e3*(65535&e)+(e>>16)&n)&n)/4294967296+.5)*(r.random()>.5?1:-1))};for(let s,i=0;i<e.length;i+=4){const e=n(4294967296*(s||r.random()));s=987654071*e(),t[i/4]=4294967296*e()|0}return e}},V={importKey:e=>new V.R(I.bytes.m(e)),B(e,t,n,r){if(n=n||1e4,0>r||0>n)throw new s("invalid params to pbkdf2");const i=1+(r>>5)<<2;let o,c,f,a,u;const w=new ArrayBuffer(i),h=new l(w);let d=0;const p=_;for(t=I.bytes.m(t),u=1;(i||1)>d;u++){for(o=c=e.encrypt(p.concat(t,[u])),f=1;n>f;f++)for(c=e.encrypt(c),a=0;a<c.length;a++)o[a]^=c[a];for(f=0;(i||1)>d&&f<o.length;f++)h.setInt32(d,o[f]),d+=4}return w.slice(0,r/8)},R:class{constructor(e){const t=this,n=t.M=P,r=[[],[]];t.U=[new n,new n];const s=t.U[0].blockSize/32;e.length>s&&(e=(new n).update(e).P());for(let t=0;s>t;t++)r[0][t]=909522486^e[t],r[1][t]=1549556828^e[t];t.U[0].update(r[0]),t.U[1].update(r[1]),t.K=new n(t.U[0])}reset(){const e=this;e.K=new e.M(e.U[0]),e.N=!1}update(e){this.N=!0,this.K.update(e)}digest(){const e=this,t=e.K.P(),n=new e.M(e.U[1]).update(t).P();return e.reset(),n}encrypt(e){if(this.N)throw new s("encrypt on already updated hmac called!");return this.update(e),this.digest(e)}}},R=typeof h!=v&&typeof h.getRandomValues==S,B="Invalid password",E="Invalid signature",M="zipjs-abort-check-password";function U(e){return R?h.getRandomValues(e):D.getRandomValues(e)}const K=16,N={name:"PBKDF2"},O=t.assign({hash:{name:"HMAC"}},N),T=t.assign({iterations:1e3,hash:{name:"SHA-1"}},N),W=["deriveBits"],j=[8,12,16],H=[16,24,32],L=10,F=[0,0,0,0],q=typeof h!=v,G=q&&h.subtle,J=q&&typeof G!=v,Q=I.bytes,X=class{constructor(e){const t=this;t.O=[[[],[],[],[],[]],[[],[],[],[],[]]],t.O[0][0][0]||t.T();const n=t.O[0][4],r=t.O[1],i=e.length;let o,c,f,a=1;if(4!==i&&6!==i&&8!==i)throw new s("invalid aes key size");for(t.v=[c=e.slice(0),f=[]],o=i;4*i+28>o;o++){let e=c[o-1];(o%i==0||8===i&&o%i==4)&&(e=n[e>>>24]<<24^n[e>>16&255]<<16^n[e>>8&255]<<8^n[255&e],o%i==0&&(e=e<<8^e>>>24^a<<24,a=a<<1^283*(a>>7))),c[o]=c[o-i]^e}for(let e=0;o;e++,o--){const t=c[3&e?o:o-4];f[e]=4>=o||4>e?t:r[0][n[t>>>24]]^r[1][n[t>>16&255]]^r[2][n[t>>8&255]]^r[3][n[255&t]]}}encrypt(e){return this.W(e,0)}decrypt(e){return this.W(e,1)}T(){const e=this.O[0],t=this.O[1],n=e[4],r=t[4],s=[],i=[];let o,c,f,a;for(let e=0;256>e;e++)i[(s[e]=e<<1^283*(e>>7))^e]=e;for(let l=o=0;!n[l];l^=c||1,o=i[o]||1){let i=o^o<<1^o<<2^o<<3^o<<4;i=i>>8^255&i^99,n[l]=i,r[i]=l,a=s[f=s[c=s[l]]];let u=16843009*a^65537*f^257*c^16843008*l,w=257*s[i]^16843008*i;for(let n=0;4>n;n++)e[n][l]=w=w<<24^w>>>8,t[n][i]=u=u<<24^u>>>8}for(let n=0;5>n;n++)e[n]=e[n].slice(0),t[n]=t[n].slice(0)}W(e,t){if(4!==e.length)throw new s("invalid aes block size");const n=this.v[t],r=n.length/4-2,i=[0,0,0,0],o=this.O[t],c=o[0],f=o[1],a=o[2],l=o[3],u=o[4];let w,h,d,p=e[0]^n[0],y=e[t?3:1]^n[1],m=e[2]^n[2],b=e[t?1:3]^n[3],g=4;for(let e=0;r>e;e++)w=c[p>>>24]^f[y>>16&255]^a[m>>8&255]^l[255&b]^n[g],h=c[y>>>24]^f[m>>16&255]^a[b>>8&255]^l[255&p]^n[g+1],d=c[m>>>24]^f[b>>16&255]^a[p>>8&255]^l[255&y]^n[g+2],b=c[b>>>24]^f[p>>16&255]^a[y>>8&255]^l[255&m]^n[g+3],g+=4,p=w,y=h,m=d;for(let e=0;4>e;e++)i[t?3&-e:e]=u[p>>>24]<<24^u[y>>16&255]<<16^u[m>>8&255]<<8^u[255&b]^n[g++],w=p,p=y,y=m,m=b,b=w;return i}},Y=class{constructor(e,t){this.j=e,this.H=t,this.L=t}reset(){this.L=this.H}update(e){return this.F(this.j,e,this.L)}q(e){if(255&~(e>>24))e+=1<<24;else{let t=e>>16&255,n=e>>8&255,r=255&e;255===t?(t=0,255===n?(n=0,255===r?r=0:++r):++n):++t,e=0,e+=t<<16,e+=n<<8,e+=r}return e}G(e){0===(e[0]=this.q(e[0]))&&(e[1]=this.q(e[1]))}F(e,t,n){let r;if(!(r=t.length))return[];const s=_.l(t);for(let s=0;r>s;s+=4){this.G(n);const r=e.encrypt(n);t[s]^=r[0],t[s+1]^=r[1],t[s+2]^=r[2],t[s+3]^=r[3]}return _.u(t,s)}},Z=V.R;let $=q&&J&&typeof G.importKey==S,ee=q&&J&&typeof G.deriveBits==S;class te extends p{constructor({password:e,rawPassword:n,signed:r,encryptionStrength:o,checkPasswordOnly:c}){super({start(){t.assign(this,{ready:new u((e=>this.J=e)),password:ie(e,n),signed:r,X:o-1,pending:new i})},async transform(e,t){const n=this,{password:r,X:o,J:f,ready:a}=n;r?(await(async(e,t,n,r)=>{const i=await se(e,t,n,ce(r,0,j[t])),o=ce(r,j[t]);if(i[0]!=o[0]||i[1]!=o[1])throw new s(B)})(n,o,r,ce(e,0,j[o]+2)),e=ce(e,j[o]+2),c?t.error(new s(M)):f()):await a;const l=new i(e.length-L-(e.length-L)%K);t.enqueue(re(n,e,l,0,L,!0))},async flush(e){const{signed:t,Y:n,Z:r,pending:o,ready:c}=this;if(r&&n){await c;const f=ce(o,0,o.length-L),a=ce(o,o.length-L);let l=new i;if(f.length){const e=ae(Q,f);r.update(e);const t=n.update(e);l=fe(Q,t)}if(t){const e=ce(fe(Q,r.digest()),0,L);for(let t=0;L>t;t++)if(e[t]!=a[t])throw new s(E)}e.enqueue(l)}}})}}class ne extends p{constructor({password:e,rawPassword:n,encryptionStrength:r}){let s;super({start(){t.assign(this,{ready:new u((e=>this.J=e)),password:ie(e,n),X:r-1,pending:new i})},async transform(e,t){const n=this,{password:r,X:s,J:o,ready:c}=n;let f=new i;r?(f=await(async(e,t,n)=>{const r=U(new i(j[t]));return oe(r,await se(e,t,n,r))})(n,s,r),o()):await c;const a=new i(f.length+e.length-e.length%K);a.set(f,0),t.enqueue(re(n,e,a,f.length,0))},async flush(e){const{Y:t,Z:n,pending:r,ready:o}=this;if(n&&t){await o;let c=new i;if(r.length){const e=t.update(ae(Q,r));n.update(e),c=fe(Q,e)}s.signature=fe(Q,n.digest()).slice(0,L),e.enqueue(oe(c,s.signature))}}}),s=this}}function re(e,t,n,r,s,o){const{Y:c,Z:f,pending:a}=e,l=t.length-s;let u;for(a.length&&(t=oe(a,t),n=((e,t)=>{if(t&&t>e.length){const n=e;(e=new i(t)).set(n,0)}return e})(n,l-l%K)),u=0;l-K>=u;u+=K){const e=ae(Q,ce(t,u,u+K));o&&f.update(e);const s=c.update(e);o||f.update(s),n.set(fe(Q,s),u+r)}return e.pending=ce(t,u),n}async function se(n,r,s,o){n.password=null;const c=await(async(e,t,n,r,s)=>{if(!$)return V.importKey(t);try{return await G.importKey("raw",t,n,!1,s)}catch(e){return $=!1,V.importKey(t)}})(0,s,O,0,W),f=await(async(e,t,n)=>{if(!ee)return V.B(t,e.salt,T.iterations,n);try{return await G.deriveBits(e,t,n)}catch(r){return ee=!1,V.B(t,e.salt,T.iterations,n)}})(t.assign({salt:o},T),c,8*(2*H[r]+2)),a=new i(f),l=ae(Q,ce(a,0,H[r])),u=ae(Q,ce(a,H[r],2*H[r])),w=ce(a,2*H[r]);return t.assign(n,{keys:{key:l,$:u,passwordVerification:w},Y:new Y(new X(l),e.from(F)),Z:new Z(u)}),w}function ie(e,t){return t===k?(e=>{if(typeof w==v){const t=new i((e=unescape(encodeURIComponent(e))).length);for(let n=0;n<t.length;n++)t[n]=e.charCodeAt(n);return t}return(new w).encode(e)})(e):t}function oe(e,t){let n=e;return e.length+t.length&&(n=new i(e.length+t.length),n.set(e,0),n.set(t,e.length)),n}function ce(e,t,n){return e.subarray(t,n)}function fe(e,t){return e.p(t)}function ae(e,t){return e.m(t)}class le extends p{constructor({password:e,passwordVerification:n,checkPasswordOnly:r}){super({start(){t.assign(this,{password:e,passwordVerification:n}),de(this,e)},transform(e,t){const n=this;if(n.password){const t=we(n,e.subarray(0,12));if(n.password=null,t[11]!=n.passwordVerification)throw new s(B);e=e.subarray(12)}r?t.error(new s(M)):t.enqueue(we(n,e))}})}}class ue extends p{constructor({password:e,passwordVerification:n}){super({start(){t.assign(this,{password:e,passwordVerification:n}),de(this,e)},transform(e,t){const n=this;let r,s;if(n.password){n.password=null;const t=U(new i(12));t[11]=n.passwordVerification,r=new i(e.length+t.length),r.set(he(n,t),0),s=12}else r=new i(e.length),s=0;r.set(he(n,e),s),t.enqueue(r)}})}}function we(e,t){const n=new i(t.length);for(let r=0;r<t.length;r++)n[r]=ye(e)^t[r],pe(e,n[r]);return n}function he(e,t){const n=new i(t.length);for(let r=0;r<t.length;r++)n[r]=ye(e)^t[r],pe(e,t[r]);return n}function de(e,n){const r=[305419896,591751049,878082192];t.assign(e,{keys:r,ee:new x(r[0]),te:new x(r[2])});for(let t=0;t<n.length;t++)pe(e,n.charCodeAt(t))}function pe(e,t){let[n,s,i]=e.keys;e.ee.append([t]),n=~e.ee.get(),s=be(r.imul(be(s+me(n)),134775813)+1),e.te.append([s>>>24]),i=~e.te.get(),e.keys=[n,s,i]}function ye(e){const t=2|e.keys[2];return me(r.imul(t,1^t)>>>8)}function me(e){return 255&e}function be(e){return 4294967295&e}const ge="deflate-raw";class ke extends p{constructor(e,{chunkSize:t,CompressionStream:n,CompressionStreamNative:r}){super({});const{compressed:s,encrypted:i,useCompressionStream:o,zipCrypto:c,signed:f,level:a}=e,u=this;let w,h,d=Se(super.readable);i&&!c||!f||(w=new A,d=xe(d,w)),s&&(d=Ce(d,o,{level:a,chunkSize:t},r,n)),i&&(c?d=xe(d,new ue(e)):(h=new ne(e),d=xe(d,h))),ze(u,d,(()=>{let e;i&&!c&&(e=h.signature),i&&!c||!f||(e=new l(w.value.buffer).getUint32(0)),u.signature=e}))}}class ve extends p{constructor(e,{chunkSize:t,DecompressionStream:n,DecompressionStreamNative:r}){super({});const{zipCrypto:i,encrypted:o,signed:c,signature:f,compressed:a,useCompressionStream:u}=e;let w,h,d=Se(super.readable);o&&(i?d=xe(d,new le(e)):(h=new te(e),d=xe(d,h))),a&&(d=Ce(d,u,{chunkSize:t},r,n)),o&&!i||!c||(w=new A,d=xe(d,w)),ze(this,d,(()=>{if((!o||i)&&c){const e=new l(w.value.buffer);if(f!=e.getUint32(0,!1))throw new s(E)}}))}}function Se(e){return xe(e,new p({transform(e,t){e&&e.length&&t.enqueue(e)}}))}function ze(e,n,r){n=xe(n,new p({flush:r})),t.defineProperty(e,"readable",{get:()=>n})}function Ce(e,t,n,r,s){try{e=xe(e,new(t&&r?r:s)(ge,n))}catch(r){if(!t)return e;try{e=xe(e,new s(ge,n))}catch(t){return e}}return e}function xe(e,t){return e.pipeThrough(t)}const Ae="data",_e="close";class Ie extends p{constructor(e,n){super({});const r=this,{codecType:s}=e;let i;s.startsWith("deflate")?i=ke:s.startsWith("inflate")&&(i=ve);let o=0,c=0;const f=new i(e,n),a=super.readable,l=new p({transform(e,t){e&&e.length&&(c+=e.length,t.enqueue(e))},flush(){t.assign(r,{inputSize:c})}}),u=new p({transform(e,t){e&&e.length&&(o+=e.length,t.enqueue(e))},flush(){const{signature:e}=f;t.assign(r,{signature:e,outputSize:o,inputSize:c})}});t.defineProperty(r,"readable",{get:()=>a.pipeThrough(l).pipeThrough(f).pipeThrough(u)})}}class Pe extends p{constructor(e){let t;super({transform:function n(r,s){if(t){const e=new i(t.length+r.length);e.set(t),e.set(r,t.length),r=e,t=null}r.length>e?(s.enqueue(r.slice(0,e)),n(r.slice(e),s)):t=r},flush(e){t&&t.length&&e.enqueue(t)}})}}const De=new a,Ve=new a;let Re,Be=0,Ee=!0;async function Me(e){try{const{options:t,scripts:r,config:s}=e;if(r&&r.length)try{Ee?importScripts.apply(k,r):await Ue(r)}catch(e){Ee=!1,await Ue(r)}self.initCodec&&self.initCodec(),s.CompressionStreamNative=self.CompressionStream,s.DecompressionStreamNative=self.DecompressionStream,self.Deflate&&(s.CompressionStream=new z(self.Deflate)),self.Inflate&&(s.DecompressionStream=new z(self.Inflate));const i={highWaterMark:1},o=e.readable||new y({async pull(e){const t=new u((e=>De.set(Be,e)));Ke({type:"pull",messageId:Be}),Be=(Be+1)%n.MAX_SAFE_INTEGER;const{value:r,done:s}=await t;e.enqueue(r),s&&e.close()}},i),c=e.writable||new m({async write(e){let t;const r=new u((e=>t=e));Ve.set(Be,t),Ke({type:Ae,value:e,messageId:Be}),Be=(Be+1)%n.MAX_SAFE_INTEGER,await r}},i),f=new Ie(t,s);Re=new AbortController;const{signal:a}=Re;await o.pipeThrough(f).pipeThrough(new Pe(s.chunkSize)).pipeTo(c,{signal:a,preventClose:!0,preventAbort:!0}),await c.getWriter().close();const{signature:l,inputSize:w,outputSize:h}=f;Ke({type:_e,result:{signature:l,inputSize:w,outputSize:h}})}catch(e){Ne(e)}}async function Ue(e){for(const t of e)await import(t)}function Ke(e){let{value:t}=e;if(t)if(t.length)try{t=new i(t),e.value=t.buffer,d(e,[e.value])}catch(t){d(e)}else d(e);else d(e)}function Ne(e=new s("Unknown error")){const{message:t,stack:n,code:r,name:i}=e;d({error:{message:t,stack:n,code:r,name:i}})}addEventListener("message",(({data:e})=>{const{type:t,messageId:n,value:r,done:s}=e;try{if("start"==t&&Me(e),t==Ae){const e=De.get(n);De.delete(n),e({value:new i(r),done:s})}if("ack"==t){const e=Ve.get(n);Ve.delete(n),e()}t==_e&&Re.abort()}catch(e){Ne(e)}}));const Oe=-2;function Te(t){return We(t.map((([t,n])=>new e(t).fill(n,0,t))))}function We(t){return t.reduce(((t,n)=>t.concat(e.isArray(n)?We(n):n)),[])}const je=[0,1,2,3].concat(...Te([[2,4],[2,5],[4,6],[4,7],[8,8],[8,9],[16,10],[16,11],[32,12],[32,13],[64,14],[64,15],[2,0],[1,16],[1,17],[2,18],[2,19],[4,20],[4,21],[8,22],[8,23],[16,24],[16,25],[32,26],[32,27],[64,28],[64,29]]));function He(){const e=this;function t(e,t){let n=0;do{n|=1&e,e>>>=1,n<<=1}while(--t>0);return n>>>1}e.ne=n=>{const s=e.re,i=e.ie.se,o=e.ie.oe;let c,f,a,l=-1;for(n.ce=0,n.fe=573,c=0;o>c;c++)0!==s[2*c]?(n.ae[++n.ce]=l=c,n.le[c]=0):s[2*c+1]=0;for(;2>n.ce;)a=n.ae[++n.ce]=2>l?++l:0,s[2*a]=1,n.le[a]=0,n.ue--,i&&(n.we-=i[2*a+1]);for(e.he=l,c=r.floor(n.ce/2);c>=1;c--)n.de(s,c);a=o;do{c=n.ae[1],n.ae[1]=n.ae[n.ce--],n.de(s,1),f=n.ae[1],n.ae[--n.fe]=c,n.ae[--n.fe]=f,s[2*a]=s[2*c]+s[2*f],n.le[a]=r.max(n.le[c],n.le[f])+1,s[2*c+1]=s[2*f+1]=a,n.ae[1]=a++,n.de(s,1)}while(n.ce>=2);n.ae[--n.fe]=n.ae[1],(t=>{const n=e.re,r=e.ie.se,s=e.ie.pe,i=e.ie.ye,o=e.ie.me;let c,f,a,l,u,w,h=0;for(l=0;15>=l;l++)t.be[l]=0;for(n[2*t.ae[t.fe]+1]=0,c=t.fe+1;573>c;c++)f=t.ae[c],l=n[2*n[2*f+1]+1]+1,l>o&&(l=o,h++),n[2*f+1]=l,f>e.he||(t.be[l]++,u=0,i>f||(u=s[f-i]),w=n[2*f],t.ue+=w*(l+u),r&&(t.we+=w*(r[2*f+1]+u)));if(0!==h){do{for(l=o-1;0===t.be[l];)l--;t.be[l]--,t.be[l+1]+=2,t.be[o]--,h-=2}while(h>0);for(l=o;0!==l;l--)for(f=t.be[l];0!==f;)a=t.ae[--c],a>e.he||(n[2*a+1]!=l&&(t.ue+=(l-n[2*a+1])*n[2*a],n[2*a+1]=l),f--)}})(n),((e,n,r)=>{const s=[];let i,o,c,f=0;for(i=1;15>=i;i++)s[i]=f=f+r[i-1]<<1;for(o=0;n>=o;o++)c=e[2*o+1],0!==c&&(e[2*o]=t(s[c]++,c))})(s,e.he,n.be)}}function Le(e,t,n,r,s){const i=this;i.se=e,i.pe=t,i.ye=n,i.oe=r,i.me=s}He.ge=[0,1,2,3,4,5,6,7].concat(...Te([[2,8],[2,9],[2,10],[2,11],[4,12],[4,13],[4,14],[4,15],[8,16],[8,17],[8,18],[8,19],[16,20],[16,21],[16,22],[16,23],[32,24],[32,25],[32,26],[31,27],[1,28]])),He.ke=[0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0],He.ve=[0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576],He.Se=e=>256>e?je[e]:je[256+(e>>>7)],He.ze=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],He.Ce=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],He.xe=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],He.Ae=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];const Fe=Te([[144,8],[112,9],[24,7],[8,8]]);Le._e=We([12,140,76,204,44,172,108,236,28,156,92,220,60,188,124,252,2,130,66,194,34,162,98,226,18,146,82,210,50,178,114,242,10,138,74,202,42,170,106,234,26,154,90,218,58,186,122,250,6,134,70,198,38,166,102,230,22,150,86,214,54,182,118,246,14,142,78,206,46,174,110,238,30,158,94,222,62,190,126,254,1,129,65,193,33,161,97,225,17,145,81,209,49,177,113,241,9,137,73,201,41,169,105,233,25,153,89,217,57,185,121,249,5,133,69,197,37,165,101,229,21,149,85,213,53,181,117,245,13,141,77,205,45,173,109,237,29,157,93,221,61,189,125,253,19,275,147,403,83,339,211,467,51,307,179,435,115,371,243,499,11,267,139,395,75,331,203,459,43,299,171,427,107,363,235,491,27,283,155,411,91,347,219,475,59,315,187,443,123,379,251,507,7,263,135,391,71,327,199,455,39,295,167,423,103,359,231,487,23,279,151,407,87,343,215,471,55,311,183,439,119,375,247,503,15,271,143,399,79,335,207,463,47,303,175,431,111,367,239,495,31,287,159,415,95,351,223,479,63,319,191,447,127,383,255,511,0,64,32,96,16,80,48,112,8,72,40,104,24,88,56,120,4,68,36,100,20,84,52,116,3,131,67,195,35,163,99,227].map(((e,t)=>[e,Fe[t]])));const qe=Te([[30,5]]);function Ge(e,t,n,r,s){const i=this;i.Ie=e,i.Pe=t,i.De=n,i.Ve=r,i.Re=s}Le.Be=We([0,16,8,24,4,20,12,28,2,18,10,26,6,22,14,30,1,17,9,25,5,21,13,29,3,19,11,27,7,23].map(((e,t)=>[e,qe[t]]))),Le.Ee=new Le(Le._e,He.ze,257,286,15),Le.Me=new Le(Le.Be,He.Ce,0,30,15),Le.Ue=new Le(null,He.xe,0,19,7);const Je=[new Ge(0,0,0,0,0),new Ge(4,4,8,4,1),new Ge(4,5,16,8,1),new Ge(4,6,32,32,1),new Ge(4,4,16,16,2),new Ge(8,16,32,32,2),new Ge(8,16,128,128,2),new Ge(8,32,128,256,2),new Ge(32,128,258,1024,2),new Ge(32,258,258,4096,2)],Qe=["need dictionary","stream end","","","stream error","data error","","buffer error","",""],Xe=113,Ye=666,Ze=262;function $e(e,t,n,r){const s=e[2*t],i=e[2*n];return i>s||s==i&&r[t]<=r[n]}function et(){const e=this;let t,n,s,c,f,a,l,u,w,h,d,p,y,m,b,g,k,v,S,z,C,x,A,_,I,P,D,V,R,B,E,M,U;const K=new He,N=new He,O=new He;let T,W,j,H,L,F;function q(){let t;for(t=0;286>t;t++)E[2*t]=0;for(t=0;30>t;t++)M[2*t]=0;for(t=0;19>t;t++)U[2*t]=0;E[512]=1,e.ue=e.we=0,W=j=0}function G(e,t){let n,r=-1,s=e[1],i=0,o=7,c=4;0===s&&(o=138,c=3),e[2*(t+1)+1]=65535;for(let f=0;t>=f;f++)n=s,s=e[2*(f+1)+1],++i<o&&n==s||(c>i?U[2*n]+=i:0!==n?(n!=r&&U[2*n]++,U[32]++):i>10?U[36]++:U[34]++,i=0,r=n,0===s?(o=138,c=3):n==s?(o=6,c=3):(o=7,c=4))}function J(t){e.Ke[e.pending++]=t}function Q(e){J(255&e),J(e>>>8&255)}function X(e,t){let n;const r=t;F>16-r?(n=e,L|=n<<F&65535,Q(L),L=n>>>16-F,F+=r-16):(L|=e<<F&65535,F+=r)}function Y(e,t){const n=2*e;X(65535&t[n],65535&t[n+1])}function Z(e,t){let n,r,s=-1,i=e[1],o=0,c=7,f=4;for(0===i&&(c=138,f=3),n=0;t>=n;n++)if(r=i,i=e[2*(n+1)+1],++o>=c||r!=i){if(f>o)do{Y(r,U)}while(0!=--o);else 0!==r?(r!=s&&(Y(r,U),o--),Y(16,U),X(o-3,2)):o>10?(Y(18,U),X(o-11,7)):(Y(17,U),X(o-3,3));o=0,s=r,0===i?(c=138,f=3):r==i?(c=6,f=3):(c=7,f=4)}}function $(){16==F?(Q(L),L=0,F=0):8>F||(J(255&L),L>>>=8,F-=8)}function ee(t,n){let s,i,o;if(e.Ne[W]=t,e.Oe[W]=255&n,W++,0===t?E[2*n]++:(j++,t--,E[2*(He.ge[n]+256+1)]++,M[2*He.Se(t)]++),!(8191&W)&&D>2){for(s=8*W,i=C-k,o=0;30>o;o++)s+=M[2*o]*(5+He.Ce[o]);if(s>>>=3,j<r.floor(W/2)&&s<r.floor(i/2))return!0}return W==T-1}function te(t,n){let r,s,i,o,c=0;if(0!==W)do{r=e.Ne[c],s=e.Oe[c],c++,0===r?Y(s,t):(i=He.ge[s],Y(i+256+1,t),o=He.ze[i],0!==o&&(s-=He.ke[i],X(s,o)),r--,i=He.Se(r),Y(i,n),o=He.Ce[i],0!==o&&(r-=He.ve[i],X(r,o)))}while(W>c);Y(256,t),H=t[513]}function ne(){F>8?Q(L):F>0&&J(255&L),L=0,F=0}function re(t,n,r){X(0+(r?1:0),3),((t,n)=>{ne(),H=8,Q(n),Q(~n),e.Ke.set(u.subarray(t,t+n),e.pending),e.pending+=n})(t,n)}function se(n){((t,n,r)=>{let s,i,o=0;D>0?(K.ne(e),N.ne(e),o=(()=>{let t;for(G(E,K.he),G(M,N.he),O.ne(e),t=18;t>=3&&0===U[2*He.Ae[t]+1];t--);return e.ue+=14+3*(t+1),t})(),s=e.ue+3+7>>>3,i=e.we+3+7>>>3,i>s||(s=i)):s=i=n+5,n+4>s||-1==t?i==s?(X(2+(r?1:0),3),te(Le._e,Le.Be)):(X(4+(r?1:0),3),((e,t,n)=>{let r;for(X(e-257,5),X(t-1,5),X(n-4,4),r=0;n>r;r++)X(U[2*He.Ae[r]+1],3);Z(E,e-1),Z(M,t-1)})(K.he+1,N.he+1,o+1),te(E,M)):re(t,n,r),q(),r&&ne()})(0>k?-1:k,C-k,n),k=C,t.Te()}function ie(){let e,n,r,s;do{if(s=w-A-C,0===s&&0===C&&0===A)s=f;else if(-1==s)s--;else if(C>=f+f-Ze){u.set(u.subarray(f,f+f),0),x-=f,C-=f,k-=f,e=y,r=e;do{n=65535&d[--r],d[r]=f>n?0:n-f}while(0!=--e);e=f,r=e;do{n=65535&h[--r],h[r]=f>n?0:n-f}while(0!=--e);s+=f}if(0===t.We)return;e=t.je(u,C+A,s),A+=e,3>A||(p=255&u[C],p=(p<<g^255&u[C+1])&b)}while(Ze>A&&0!==t.We)}function oe(e){let t,n,r=I,s=C,i=_;const o=C>f-Ze?C-(f-Ze):0;let c=B;const a=l,w=C+258;let d=u[s+i-1],p=u[s+i];R>_||(r>>=2),c>A&&(c=A);do{if(t=e,u[t+i]==p&&u[t+i-1]==d&&u[t]==u[s]&&u[++t]==u[s+1]){s+=2,t++;do{}while(u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&w>s);if(n=258-(w-s),s=w-258,n>i){if(x=e,i=n,n>=c)break;d=u[s+i-1],p=u[s+i]}}}while((e=65535&h[e&a])>o&&0!=--r);return i>A?A:i}e.le=[],e.be=[],e.ae=[],E=[],M=[],U=[],e.de=(t,n)=>{const r=e.ae,s=r[n];let i=n<<1;for(;i<=e.ce&&(i<e.ce&&$e(t,r[i+1],r[i],e.le)&&i++,!$e(t,s,r[i],e.le));)r[n]=r[i],n=i,i<<=1;r[n]=s},e.He=(t,S,x,W,j,G)=>(W||(W=8),j||(j=8),G||(G=0),t.Le=null,-1==S&&(S=6),1>j||j>9||8!=W||9>x||x>15||0>S||S>9||0>G||G>2?Oe:(t.Fe=e,a=x,f=1<<a,l=f-1,m=j+7,y=1<<m,b=y-1,g=r.floor((m+3-1)/3),u=new i(2*f),h=[],d=[],T=1<<j+6,e.Ke=new i(4*T),s=4*T,e.Ne=new o(T),e.Oe=new i(T),D=S,V=G,(t=>(t.qe=t.Ge=0,t.Le=null,e.pending=0,e.Je=0,n=Xe,c=0,K.re=E,K.ie=Le.Ee,N.re=M,N.ie=Le.Me,O.re=U,O.ie=Le.Ue,L=0,F=0,H=8,q(),(()=>{w=2*f,d[y-1]=0;for(let e=0;y-1>e;e++)d[e]=0;P=Je[D].Pe,R=Je[D].Ie,B=Je[D].De,I=Je[D].Ve,C=0,k=0,A=0,v=_=2,z=0,p=0})(),0))(t))),e.Qe=()=>42!=n&&n!=Xe&&n!=Ye?Oe:(e.Oe=null,e.Ne=null,e.Ke=null,d=null,h=null,u=null,e.Fe=null,n==Xe?-3:0),e.Xe=(e,t,n)=>{let r=0;return-1==t&&(t=6),0>t||t>9||0>n||n>2?Oe:(Je[D].Re!=Je[t].Re&&0!==e.qe&&(r=e.Ye(1)),D!=t&&(D=t,P=Je[D].Pe,R=Je[D].Ie,B=Je[D].De,I=Je[D].Ve),V=n,r)},e.Ze=(e,t,r)=>{let s,i=r,o=0;if(!t||42!=n)return Oe;if(3>i)return 0;for(i>f-Ze&&(i=f-Ze,o=r-i),u.set(t.subarray(o,o+i),0),C=i,k=i,p=255&u[0],p=(p<<g^255&u[1])&b,s=0;i-3>=s;s++)p=(p<<g^255&u[s+2])&b,h[s&l]=d[p],d[p]=s;return 0},e.Ye=(r,i)=>{let o,w,m,I,R;if(i>4||0>i)return Oe;if(!r.$e||!r.et&&0!==r.We||n==Ye&&4!=i)return r.Le=Qe[4],Oe;if(0===r.tt)return r.Le=Qe[7],-5;var B;if(t=r,I=c,c=i,42==n&&(w=8+(a-8<<4)<<8,m=(D-1&255)>>1,m>3&&(m=3),w|=m<<6,0!==C&&(w|=32),w+=31-w%31,n=Xe,J((B=w)>>8&255),J(255&B)),0!==e.pending){if(t.Te(),0===t.tt)return c=-1,0}else if(0===t.We&&I>=i&&4!=i)return t.Le=Qe[7],-5;if(n==Ye&&0!==t.We)return r.Le=Qe[7],-5;if(0!==t.We||0!==A||0!=i&&n!=Ye){switch(R=-1,Je[D].Re){case 0:R=(e=>{let n,r=65535;for(r>s-5&&(r=s-5);;){if(1>=A){if(ie(),0===A&&0==e)return 0;if(0===A)break}if(C+=A,A=0,n=k+r,(0===C||C>=n)&&(A=C-n,C=n,se(!1),0===t.tt))return 0;if(C-k>=f-Ze&&(se(!1),0===t.tt))return 0}return se(4==e),0===t.tt?4==e?2:0:4==e?3:1})(i);break;case 1:R=(e=>{let n,r=0;for(;;){if(Ze>A){if(ie(),Ze>A&&0==e)return 0;if(0===A)break}if(3>A||(p=(p<<g^255&u[C+2])&b,r=65535&d[p],h[C&l]=d[p],d[p]=C),0===r||(C-r&65535)>f-Ze||2!=V&&(v=oe(r)),3>v)n=ee(0,255&u[C]),A--,C++;else if(n=ee(C-x,v-3),A-=v,v>P||3>A)C+=v,v=0,p=255&u[C],p=(p<<g^255&u[C+1])&b;else{v--;do{C++,p=(p<<g^255&u[C+2])&b,r=65535&d[p],h[C&l]=d[p],d[p]=C}while(0!=--v);C++}if(n&&(se(!1),0===t.tt))return 0}return se(4==e),0===t.tt?4==e?2:0:4==e?3:1})(i);break;case 2:R=(e=>{let n,r,s=0;for(;;){if(Ze>A){if(ie(),Ze>A&&0==e)return 0;if(0===A)break}if(3>A||(p=(p<<g^255&u[C+2])&b,s=65535&d[p],h[C&l]=d[p],d[p]=C),_=v,S=x,v=2,0!==s&&P>_&&f-Ze>=(C-s&65535)&&(2!=V&&(v=oe(s)),5>=v&&(1==V||3==v&&C-x>4096)&&(v=2)),3>_||v>_)if(0!==z){if(n=ee(0,255&u[C-1]),n&&se(!1),C++,A--,0===t.tt)return 0}else z=1,C++,A--;else{r=C+A-3,n=ee(C-1-S,_-3),A-=_-1,_-=2;do{++C>r||(p=(p<<g^255&u[C+2])&b,s=65535&d[p],h[C&l]=d[p],d[p]=C)}while(0!=--_);if(z=0,v=2,C++,n&&(se(!1),0===t.tt))return 0}}return 0!==z&&(n=ee(0,255&u[C-1]),z=0),se(4==e),0===t.tt?4==e?2:0:4==e?3:1})(i)}if(2!=R&&3!=R||(n=Ye),0==R||2==R)return 0===t.tt&&(c=-1),0;if(1==R){if(1==i)X(2,3),Y(256,Le._e),$(),9>1+H+10-F&&(X(2,3),Y(256,Le._e),$()),H=7;else if(re(0,0,!1),3==i)for(o=0;y>o;o++)d[o]=0;if(t.Te(),0===t.tt)return c=-1,0}}return 4!=i?0:1}}function tt(){const e=this;e.nt=0,e.rt=0,e.We=0,e.qe=0,e.tt=0,e.Ge=0}function nt(e){const t=new tt,n=(o=e&&e.chunkSize?e.chunkSize:65536)+5*(r.floor(o/16383)+1);var o;const c=new i(n);let f=e?e.level:-1;void 0===f&&(f=-1),t.He(f),t.$e=c,this.append=(e,r)=>{let o,f,a=0,l=0,u=0;const w=[];if(e.length){t.nt=0,t.et=e,t.We=e.length;do{if(t.rt=0,t.tt=n,o=t.Ye(0),0!=o)throw new s("deflating: "+t.Le);t.rt&&(t.rt==n?w.push(new i(c)):w.push(c.subarray(0,t.rt))),u+=t.rt,r&&t.nt>0&&t.nt!=a&&(r(t.nt),a=t.nt)}while(t.We>0||0===t.tt);return w.length>1?(f=new i(u),w.forEach((e=>{f.set(e,l),l+=e.length}))):f=w[0]?new i(w[0]):new i,f}},this.flush=()=>{let e,r,o=0,f=0;const a=[];do{if(t.rt=0,t.tt=n,e=t.Ye(4),1!=e&&0!=e)throw new s("deflating: "+t.Le);n-t.tt>0&&a.push(c.slice(0,t.rt)),f+=t.rt}while(t.We>0||0===t.tt);return t.Qe(),r=new i(f),a.forEach((e=>{r.set(e,o),o+=e.length})),r}}tt.prototype={He(e,t){const n=this;return n.Fe=new et,t||(t=15),n.Fe.He(n,e,t)},Ye(e){const t=this;return t.Fe?t.Fe.Ye(t,e):Oe},Qe(){const e=this;if(!e.Fe)return Oe;const t=e.Fe.Qe();return e.Fe=null,t},Xe(e,t){const n=this;return n.Fe?n.Fe.Xe(n,e,t):Oe},Ze(e,t){const n=this;return n.Fe?n.Fe.Ze(n,e,t):Oe},je(e,t,n){const r=this;let s=r.We;return s>n&&(s=n),0===s?0:(r.We-=s,e.set(r.et.subarray(r.nt,r.nt+s),t),r.nt+=s,r.qe+=s,s)},Te(){const e=this;let t=e.Fe.pending;t>e.tt&&(t=e.tt),0!==t&&(e.$e.set(e.Fe.Ke.subarray(e.Fe.Je,e.Fe.Je+t),e.rt),e.rt+=t,e.Fe.Je+=t,e.Ge+=t,e.tt-=t,e.Fe.pending-=t,0===e.Fe.pending&&(e.Fe.Je=0))}};const rt=-2,st=-3,it=-5,ot=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535],ct=[96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,192,80,7,10,0,8,96,0,8,32,0,9,160,0,8,0,0,8,128,0,8,64,0,9,224,80,7,6,0,8,88,0,8,24,0,9,144,83,7,59,0,8,120,0,8,56,0,9,208,81,7,17,0,8,104,0,8,40,0,9,176,0,8,8,0,8,136,0,8,72,0,9,240,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,200,81,7,13,0,8,100,0,8,36,0,9,168,0,8,4,0,8,132,0,8,68,0,9,232,80,7,8,0,8,92,0,8,28,0,9,152,84,7,83,0,8,124,0,8,60,0,9,216,82,7,23,0,8,108,0,8,44,0,9,184,0,8,12,0,8,140,0,8,76,0,9,248,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,196,81,7,11,0,8,98,0,8,34,0,9,164,0,8,2,0,8,130,0,8,66,0,9,228,80,7,7,0,8,90,0,8,26,0,9,148,84,7,67,0,8,122,0,8,58,0,9,212,82,7,19,0,8,106,0,8,42,0,9,180,0,8,10,0,8,138,0,8,74,0,9,244,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,204,81,7,15,0,8,102,0,8,38,0,9,172,0,8,6,0,8,134,0,8,70,0,9,236,80,7,9,0,8,94,0,8,30,0,9,156,84,7,99,0,8,126,0,8,62,0,9,220,82,7,27,0,8,110,0,8,46,0,9,188,0,8,14,0,8,142,0,8,78,0,9,252,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,194,80,7,10,0,8,97,0,8,33,0,9,162,0,8,1,0,8,129,0,8,65,0,9,226,80,7,6,0,8,89,0,8,25,0,9,146,83,7,59,0,8,121,0,8,57,0,9,210,81,7,17,0,8,105,0,8,41,0,9,178,0,8,9,0,8,137,0,8,73,0,9,242,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,202,81,7,13,0,8,101,0,8,37,0,9,170,0,8,5,0,8,133,0,8,69,0,9,234,80,7,8,0,8,93,0,8,29,0,9,154,84,7,83,0,8,125,0,8,61,0,9,218,82,7,23,0,8,109,0,8,45,0,9,186,0,8,13,0,8,141,0,8,77,0,9,250,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,198,81,7,11,0,8,99,0,8,35,0,9,166,0,8,3,0,8,131,0,8,67,0,9,230,80,7,7,0,8,91,0,8,27,0,9,150,84,7,67,0,8,123,0,8,59,0,9,214,82,7,19,0,8,107,0,8,43,0,9,182,0,8,11,0,8,139,0,8,75,0,9,246,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,206,81,7,15,0,8,103,0,8,39,0,9,174,0,8,7,0,8,135,0,8,71,0,9,238,80,7,9,0,8,95,0,8,31,0,9,158,84,7,99,0,8,127,0,8,63,0,9,222,82,7,27,0,8,111,0,8,47,0,9,190,0,8,15,0,8,143,0,8,79,0,9,254,96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,193,80,7,10,0,8,96,0,8,32,0,9,161,0,8,0,0,8,128,0,8,64,0,9,225,80,7,6,0,8,88,0,8,24,0,9,145,83,7,59,0,8,120,0,8,56,0,9,209,81,7,17,0,8,104,0,8,40,0,9,177,0,8,8,0,8,136,0,8,72,0,9,241,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,201,81,7,13,0,8,100,0,8,36,0,9,169,0,8,4,0,8,132,0,8,68,0,9,233,80,7,8,0,8,92,0,8,28,0,9,153,84,7,83,0,8,124,0,8,60,0,9,217,82,7,23,0,8,108,0,8,44,0,9,185,0,8,12,0,8,140,0,8,76,0,9,249,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,197,81,7,11,0,8,98,0,8,34,0,9,165,0,8,2,0,8,130,0,8,66,0,9,229,80,7,7,0,8,90,0,8,26,0,9,149,84,7,67,0,8,122,0,8,58,0,9,213,82,7,19,0,8,106,0,8,42,0,9,181,0,8,10,0,8,138,0,8,74,0,9,245,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,205,81,7,15,0,8,102,0,8,38,0,9,173,0,8,6,0,8,134,0,8,70,0,9,237,80,7,9,0,8,94,0,8,30,0,9,157,84,7,99,0,8,126,0,8,62,0,9,221,82,7,27,0,8,110,0,8,46,0,9,189,0,8,14,0,8,142,0,8,78,0,9,253,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,195,80,7,10,0,8,97,0,8,33,0,9,163,0,8,1,0,8,129,0,8,65,0,9,227,80,7,6,0,8,89,0,8,25,0,9,147,83,7,59,0,8,121,0,8,57,0,9,211,81,7,17,0,8,105,0,8,41,0,9,179,0,8,9,0,8,137,0,8,73,0,9,243,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,203,81,7,13,0,8,101,0,8,37,0,9,171,0,8,5,0,8,133,0,8,69,0,9,235,80,7,8,0,8,93,0,8,29,0,9,155,84,7,83,0,8,125,0,8,61,0,9,219,82,7,23,0,8,109,0,8,45,0,9,187,0,8,13,0,8,141,0,8,77,0,9,251,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,199,81,7,11,0,8,99,0,8,35,0,9,167,0,8,3,0,8,131,0,8,67,0,9,231,80,7,7,0,8,91,0,8,27,0,9,151,84,7,67,0,8,123,0,8,59,0,9,215,82,7,19,0,8,107,0,8,43,0,9,183,0,8,11,0,8,139,0,8,75,0,9,247,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,207,81,7,15,0,8,103,0,8,39,0,9,175,0,8,7,0,8,135,0,8,71,0,9,239,80,7,9,0,8,95,0,8,31,0,9,159,84,7,99,0,8,127,0,8,63,0,9,223,82,7,27,0,8,111,0,8,47,0,9,191,0,8,15,0,8,143,0,8,79,0,9,255],ft=[80,5,1,87,5,257,83,5,17,91,5,4097,81,5,5,89,5,1025,85,5,65,93,5,16385,80,5,3,88,5,513,84,5,33,92,5,8193,82,5,9,90,5,2049,86,5,129,192,5,24577,80,5,2,87,5,385,83,5,25,91,5,6145,81,5,7,89,5,1537,85,5,97,93,5,24577,80,5,4,88,5,769,84,5,49,92,5,12289,82,5,13,90,5,3073,86,5,193,192,5,24577],at=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],lt=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,112,112],ut=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],wt=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];function ht(){let e,t,n,r,s,i;function o(e,t,o,c,f,a,l,u,w,h,d){let p,y,m,b,g,k,v,S,z,C,x,A,_,I,P;C=0,g=o;do{n[e[t+C]]++,C++,g--}while(0!==g);if(n[0]==o)return l[0]=-1,u[0]=0,0;for(S=u[0],k=1;15>=k&&0===n[k];k++);for(v=k,k>S&&(S=k),g=15;0!==g&&0===n[g];g--);for(m=g,S>g&&(S=g),u[0]=S,I=1<<k;g>k;k++,I<<=1)if(0>(I-=n[k]))return st;if(0>(I-=n[g]))return st;for(n[g]+=I,i[1]=k=0,C=1,_=2;0!=--g;)i[_]=k+=n[C],_++,C++;g=0,C=0;do{0!==(k=e[t+C])&&(d[i[k]++]=g),C++}while(++g<o);for(o=i[m],i[0]=g=0,C=0,b=-1,A=-S,s[0]=0,x=0,P=0;m>=v;v++)for(p=n[v];0!=p--;){for(;v>A+S;){if(b++,A+=S,P=m-A,P=P>S?S:P,(y=1<<(k=v-A))>p+1&&(y-=p+1,_=v,P>k))for(;++k<P&&(y<<=1)>n[++_];)y-=n[_];if(P=1<<k,h[0]+P>1440)return st;s[b]=x=h[0],h[0]+=P,0!==b?(i[b]=g,r[0]=k,r[1]=S,k=g>>>A-S,r[2]=x-s[b-1]-k,w.set(r,3*(s[b-1]+k))):l[0]=x}for(r[1]=v-A,o>C?d[C]<c?(r[0]=256>d[C]?0:96,r[2]=d[C++]):(r[0]=a[d[C]-c]+16+64,r[2]=f[d[C++]-c]):r[0]=192,y=1<<v-A,k=g>>>A;P>k;k+=y)w.set(r,3*(x+k));for(k=1<<v-1;g&k;k>>>=1)g^=k;for(g^=k,z=(1<<A)-1;(g&z)!=i[b];)b--,A-=S,z=(1<<A)-1}return 0!==I&&1!=m?it:0}function c(o){let c;for(e||(e=[],t=[],n=new f(16),r=[],s=new f(15),i=new f(16)),t.length<o&&(t=[]),c=0;o>c;c++)t[c]=0;for(c=0;16>c;c++)n[c]=0;for(c=0;3>c;c++)r[c]=0;s.set(n.subarray(0,15),0),i.set(n.subarray(0,16),0)}this.st=(n,r,s,i,f)=>{let a;return c(19),e[0]=0,a=o(n,0,19,19,null,null,s,r,i,e,t),a==st?f.Le="oversubscribed dynamic bit lengths tree":a!=it&&0!==r[0]||(f.Le="incomplete dynamic bit lengths tree",a=st),a},this.it=(n,r,s,i,f,a,l,u,w)=>{let h;return c(288),e[0]=0,h=o(s,0,n,257,at,lt,a,i,u,e,t),0!=h||0===i[0]?(h==st?w.Le="oversubscribed literal/length tree":-4!=h&&(w.Le="incomplete literal/length tree",h=st),h):(c(288),h=o(s,n,r,0,ut,wt,l,f,u,e,t),0!=h||0===f[0]&&n>257?(h==st?w.Le="oversubscribed distance tree":h==it?(w.Le="incomplete distance tree",h=st):-4!=h&&(w.Le="empty distance tree with lengths",h=st),h):0)}}function dt(){const e=this;let t,n,r,s,i=0,o=0,c=0,f=0,a=0,l=0,u=0,w=0,h=0,d=0;function p(e,t,n,r,s,i,o,c){let f,a,l,u,w,h,d,p,y,m,b,g,k,v,S,z;d=c.nt,p=c.We,w=o.ot,h=o.ct,y=o.write,m=y<o.read?o.read-y-1:o.end-y,b=ot[e],g=ot[t];do{for(;20>h;)p--,w|=(255&c.ft(d++))<<h,h+=8;if(f=w&b,a=n,l=r,z=3*(l+f),0!==(u=a[z]))for(;;){if(w>>=a[z+1],h-=a[z+1],16&u){for(u&=15,k=a[z+2]+(w&ot[u]),w>>=u,h-=u;15>h;)p--,w|=(255&c.ft(d++))<<h,h+=8;for(f=w&g,a=s,l=i,z=3*(l+f),u=a[z];;){if(w>>=a[z+1],h-=a[z+1],16&u){for(u&=15;u>h;)p--,w|=(255&c.ft(d++))<<h,h+=8;if(v=a[z+2]+(w&ot[u]),w>>=u,h-=u,m-=k,v>y){S=y-v;do{S+=o.end}while(0>S);if(u=o.end-S,k>u){if(k-=u,y-S>0&&u>y-S)do{o.lt[y++]=o.lt[S++]}while(0!=--u);else o.lt.set(o.lt.subarray(S,S+u),y),y+=u,S+=u,u=0;S=0}}else S=y-v,y-S>0&&2>y-S?(o.lt[y++]=o.lt[S++],o.lt[y++]=o.lt[S++],k-=2):(o.lt.set(o.lt.subarray(S,S+2),y),y+=2,S+=2,k-=2);if(y-S>0&&k>y-S)do{o.lt[y++]=o.lt[S++]}while(0!=--k);else o.lt.set(o.lt.subarray(S,S+k),y),y+=k,S+=k,k=0;break}if(64&u)return c.Le="invalid distance code",k=c.We-p,k=k>h>>3?h>>3:k,p+=k,d-=k,h-=k<<3,o.ot=w,o.ct=h,c.We=p,c.qe+=d-c.nt,c.nt=d,o.write=y,st;f+=a[z+2],f+=w&ot[u],z=3*(l+f),u=a[z]}break}if(64&u)return 32&u?(k=c.We-p,k=k>h>>3?h>>3:k,p+=k,d-=k,h-=k<<3,o.ot=w,o.ct=h,c.We=p,c.qe+=d-c.nt,c.nt=d,o.write=y,1):(c.Le="invalid literal/length code",k=c.We-p,k=k>h>>3?h>>3:k,p+=k,d-=k,h-=k<<3,o.ot=w,o.ct=h,c.We=p,c.qe+=d-c.nt,c.nt=d,o.write=y,st);if(f+=a[z+2],f+=w&ot[u],z=3*(l+f),0===(u=a[z])){w>>=a[z+1],h-=a[z+1],o.lt[y++]=a[z+2],m--;break}}else w>>=a[z+1],h-=a[z+1],o.lt[y++]=a[z+2],m--}while(m>=258&&p>=10);return k=c.We-p,k=k>h>>3?h>>3:k,p+=k,d-=k,h-=k<<3,o.ot=w,o.ct=h,c.We=p,c.qe+=d-c.nt,c.nt=d,o.write=y,0}e.init=(e,i,o,c,f,a)=>{t=0,u=e,w=i,r=o,h=c,s=f,d=a,n=null},e.ut=(e,y,m)=>{let b,g,k,v,S,z,C,x=0,A=0,_=0;for(_=y.nt,v=y.We,x=e.ot,A=e.ct,S=e.write,z=S<e.read?e.read-S-1:e.end-S;;)switch(t){case 0:if(z>=258&&v>=10&&(e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,m=p(u,w,r,h,s,d,e,y),_=y.nt,v=y.We,x=e.ot,A=e.ct,S=e.write,z=S<e.read?e.read-S-1:e.end-S,0!=m)){t=1==m?7:9;break}c=u,n=r,o=h,t=1;case 1:for(b=c;b>A;){if(0===v)return e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);m=0,v--,x|=(255&y.ft(_++))<<A,A+=8}if(g=3*(o+(x&ot[b])),x>>>=n[g+1],A-=n[g+1],k=n[g],0===k){f=n[g+2],t=6;break}if(16&k){a=15&k,i=n[g+2],t=2;break}if(!(64&k)){c=k,o=g/3+n[g+2];break}if(32&k){t=7;break}return t=9,y.Le="invalid literal/length code",m=st,e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);case 2:for(b=a;b>A;){if(0===v)return e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);m=0,v--,x|=(255&y.ft(_++))<<A,A+=8}i+=x&ot[b],x>>=b,A-=b,c=w,n=s,o=d,t=3;case 3:for(b=c;b>A;){if(0===v)return e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);m=0,v--,x|=(255&y.ft(_++))<<A,A+=8}if(g=3*(o+(x&ot[b])),x>>=n[g+1],A-=n[g+1],k=n[g],16&k){a=15&k,l=n[g+2],t=4;break}if(!(64&k)){c=k,o=g/3+n[g+2];break}return t=9,y.Le="invalid distance code",m=st,e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);case 4:for(b=a;b>A;){if(0===v)return e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);m=0,v--,x|=(255&y.ft(_++))<<A,A+=8}l+=x&ot[b],x>>=b,A-=b,t=5;case 5:for(C=S-l;0>C;)C+=e.end;for(;0!==i;){if(0===z&&(S==e.end&&0!==e.read&&(S=0,z=S<e.read?e.read-S-1:e.end-S),0===z&&(e.write=S,m=e.wt(y,m),S=e.write,z=S<e.read?e.read-S-1:e.end-S,S==e.end&&0!==e.read&&(S=0,z=S<e.read?e.read-S-1:e.end-S),0===z)))return e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);e.lt[S++]=e.lt[C++],z--,C==e.end&&(C=0),i--}t=0;break;case 6:if(0===z&&(S==e.end&&0!==e.read&&(S=0,z=S<e.read?e.read-S-1:e.end-S),0===z&&(e.write=S,m=e.wt(y,m),S=e.write,z=S<e.read?e.read-S-1:e.end-S,S==e.end&&0!==e.read&&(S=0,z=S<e.read?e.read-S-1:e.end-S),0===z)))return e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);m=0,e.lt[S++]=f,z--,t=0;break;case 7:if(A>7&&(A-=8,v++,_--),e.write=S,m=e.wt(y,m),S=e.write,z=S<e.read?e.read-S-1:e.end-S,e.read!=e.write)return e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);t=8;case 8:return m=1,e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);case 9:return m=st,e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);default:return m=rt,e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m)}},e.ht=()=>{}}ht.dt=(e,t,n,r)=>(e[0]=9,t[0]=5,n[0]=ct,r[0]=ft,0);const pt=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];function yt(e,t){const n=this;let r,s=0,o=0,c=0,a=0;const l=[0],u=[0],w=new dt;let h=0,d=new f(4320);const p=new ht;n.ct=0,n.ot=0,n.lt=new i(t),n.end=t,n.read=0,n.write=0,n.reset=(e,t)=>{t&&(t[0]=0),6==s&&w.ht(e),s=0,n.ct=0,n.ot=0,n.read=n.write=0},n.reset(e,null),n.wt=(e,t)=>{let r,s,i;return s=e.rt,i=n.read,r=(i>n.write?n.end:n.write)-i,r>e.tt&&(r=e.tt),0!==r&&t==it&&(t=0),e.tt-=r,e.Ge+=r,e.$e.set(n.lt.subarray(i,i+r),s),s+=r,i+=r,i==n.end&&(i=0,n.write==n.end&&(n.write=0),r=n.write-i,r>e.tt&&(r=e.tt),0!==r&&t==it&&(t=0),e.tt-=r,e.Ge+=r,e.$e.set(n.lt.subarray(i,i+r),s),s+=r,i+=r),e.rt=s,n.read=i,t},n.ut=(e,t)=>{let i,f,y,m,b,g,k,v;for(m=e.nt,b=e.We,f=n.ot,y=n.ct,g=n.write,k=g<n.read?n.read-g-1:n.end-g;;){let S,z,C,x,A,_,I,P;switch(s){case 0:for(;3>y;){if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);t=0,b--,f|=(255&e.ft(m++))<<y,y+=8}switch(i=7&f,h=1&i,i>>>1){case 0:f>>>=3,y-=3,i=7&y,f>>>=i,y-=i,s=1;break;case 1:S=[],z=[],C=[[]],x=[[]],ht.dt(S,z,C,x),w.init(S[0],z[0],C[0],0,x[0],0),f>>>=3,y-=3,s=6;break;case 2:f>>>=3,y-=3,s=3;break;case 3:return f>>>=3,y-=3,s=9,e.Le="invalid block type",t=st,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t)}break;case 1:for(;32>y;){if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);t=0,b--,f|=(255&e.ft(m++))<<y,y+=8}if((~f>>>16&65535)!=(65535&f))return s=9,e.Le="invalid stored block lengths",t=st,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);o=65535&f,f=y=0,s=0!==o?2:0!==h?7:0;break;case 2:if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);if(0===k&&(g==n.end&&0!==n.read&&(g=0,k=g<n.read?n.read-g-1:n.end-g),0===k&&(n.write=g,t=n.wt(e,t),g=n.write,k=g<n.read?n.read-g-1:n.end-g,g==n.end&&0!==n.read&&(g=0,k=g<n.read?n.read-g-1:n.end-g),0===k)))return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);if(t=0,i=o,i>b&&(i=b),i>k&&(i=k),n.lt.set(e.je(m,i),g),m+=i,b-=i,g+=i,k-=i,0!=(o-=i))break;s=0!==h?7:0;break;case 3:for(;14>y;){if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);t=0,b--,f|=(255&e.ft(m++))<<y,y+=8}if(c=i=16383&f,(31&i)>29||(i>>5&31)>29)return s=9,e.Le="too many length or distance symbols",t=st,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);if(i=258+(31&i)+(i>>5&31),!r||r.length<i)r=[];else for(v=0;i>v;v++)r[v]=0;f>>>=14,y-=14,a=0,s=4;case 4:for(;4+(c>>>10)>a;){for(;3>y;){if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);t=0,b--,f|=(255&e.ft(m++))<<y,y+=8}r[pt[a++]]=7&f,f>>>=3,y-=3}for(;19>a;)r[pt[a++]]=0;if(l[0]=7,i=p.st(r,l,u,d,e),0!=i)return(t=i)==st&&(r=null,s=9),n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);a=0,s=5;case 5:for(;i=c,258+(31&i)+(i>>5&31)>a;){let o,w;for(i=l[0];i>y;){if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);t=0,b--,f|=(255&e.ft(m++))<<y,y+=8}if(i=d[3*(u[0]+(f&ot[i]))+1],w=d[3*(u[0]+(f&ot[i]))+2],16>w)f>>>=i,y-=i,r[a++]=w;else{for(v=18==w?7:w-14,o=18==w?11:3;i+v>y;){if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);t=0,b--,f|=(255&e.ft(m++))<<y,y+=8}if(f>>>=i,y-=i,o+=f&ot[v],f>>>=v,y-=v,v=a,i=c,v+o>258+(31&i)+(i>>5&31)||16==w&&1>v)return r=null,s=9,e.Le="invalid bit length repeat",t=st,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);w=16==w?r[v-1]:0;do{r[v++]=w}while(0!=--o);a=v}}if(u[0]=-1,A=[],_=[],I=[],P=[],A[0]=9,_[0]=6,i=c,i=p.it(257+(31&i),1+(i>>5&31),r,A,_,I,P,d,e),0!=i)return i==st&&(r=null,s=9),t=i,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);w.init(A[0],_[0],d,I[0],d,P[0]),s=6;case 6:if(n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,1!=(t=w.ut(n,e,t)))return n.wt(e,t);if(t=0,w.ht(e),m=e.nt,b=e.We,f=n.ot,y=n.ct,g=n.write,k=g<n.read?n.read-g-1:n.end-g,0===h){s=0;break}s=7;case 7:if(n.write=g,t=n.wt(e,t),g=n.write,k=g<n.read?n.read-g-1:n.end-g,n.read!=n.write)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);s=8;case 8:return t=1,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);case 9:return t=st,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);default:return t=rt,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t)}}},n.ht=e=>{n.reset(e,null),n.lt=null,d=null},n.yt=(e,t,r)=>{n.lt.set(e.subarray(t,t+r),0),n.read=n.write=r},n.bt=()=>1==s?1:0}const mt=13,bt=[0,0,255,255];function gt(){const e=this;function t(e){return e&&e.gt?(e.qe=e.Ge=0,e.Le=null,e.gt.mode=7,e.gt.kt.reset(e,null),0):rt}e.mode=0,e.method=0,e.vt=[0],e.St=0,e.marker=0,e.zt=0,e.Ct=t=>(e.kt&&e.kt.ht(t),e.kt=null,0),e.xt=(n,r)=>(n.Le=null,e.kt=null,8>r||r>15?(e.Ct(n),rt):(e.zt=r,n.gt.kt=new yt(n,1<<r),t(n),0)),e.At=(e,t)=>{let n,r;if(!e||!e.gt||!e.et)return rt;const s=e.gt;for(t=4==t?it:0,n=it;;)switch(s.mode){case 0:if(0===e.We)return n;if(n=t,e.We--,e.qe++,8!=(15&(s.method=e.ft(e.nt++)))){s.mode=mt,e.Le="unknown compression method",s.marker=5;break}if(8+(s.method>>4)>s.zt){s.mode=mt,e.Le="invalid win size",s.marker=5;break}s.mode=1;case 1:if(0===e.We)return n;if(n=t,e.We--,e.qe++,r=255&e.ft(e.nt++),((s.method<<8)+r)%31!=0){s.mode=mt,e.Le="incorrect header check",s.marker=5;break}if(!(32&r)){s.mode=7;break}s.mode=2;case 2:if(0===e.We)return n;n=t,e.We--,e.qe++,s.St=(255&e.ft(e.nt++))<<24&4278190080,s.mode=3;case 3:if(0===e.We)return n;n=t,e.We--,e.qe++,s.St+=(255&e.ft(e.nt++))<<16&16711680,s.mode=4;case 4:if(0===e.We)return n;n=t,e.We--,e.qe++,s.St+=(255&e.ft(e.nt++))<<8&65280,s.mode=5;case 5:return 0===e.We?n:(n=t,e.We--,e.qe++,s.St+=255&e.ft(e.nt++),s.mode=6,2);case 6:return s.mode=mt,e.Le="need dictionary",s.marker=0,rt;case 7:if(n=s.kt.ut(e,n),n==st){s.mode=mt,s.marker=0;break}if(0==n&&(n=t),1!=n)return n;n=t,s.kt.reset(e,s.vt),s.mode=12;case 12:return e.We=0,1;case mt:return st;default:return rt}},e._t=(e,t,n)=>{let r=0,s=n;if(!e||!e.gt||6!=e.gt.mode)return rt;const i=e.gt;return s<1<<i.zt||(s=(1<<i.zt)-1,r=n-s),i.kt.yt(t,r,s),i.mode=7,0},e.It=e=>{let n,r,s,i,o;if(!e||!e.gt)return rt;const c=e.gt;if(c.mode!=mt&&(c.mode=mt,c.marker=0),0===(n=e.We))return it;for(r=e.nt,s=c.marker;0!==n&&4>s;)e.ft(r)==bt[s]?s++:s=0!==e.ft(r)?0:4-s,r++,n--;return e.qe+=r-e.nt,e.nt=r,e.We=n,c.marker=s,4!=s?st:(i=e.qe,o=e.Ge,t(e),e.qe=i,e.Ge=o,c.mode=7,0)},e.Pt=e=>e&&e.gt&&e.gt.kt?e.gt.kt.bt():rt}function kt(){}function vt(e){const t=new kt,n=e&&e.chunkSize?r.floor(2*e.chunkSize):131072,o=new i(n);let c=!1;t.xt(),t.$e=o,this.append=(e,r)=>{const f=[];let a,l,u=0,w=0,h=0;if(0!==e.length){t.nt=0,t.et=e,t.We=e.length;do{if(t.rt=0,t.tt=n,0!==t.We||c||(t.nt=0,c=!0),a=t.At(0),c&&a===it){if(0!==t.We)throw new s("inflating: bad input")}else if(0!==a&&1!==a)throw new s("inflating: "+t.Le);if((c||1===a)&&t.We===e.length)throw new s("inflating: bad input");t.rt&&(t.rt===n?f.push(new i(o)):f.push(o.subarray(0,t.rt))),h+=t.rt,r&&t.nt>0&&t.nt!=u&&(r(t.nt),u=t.nt)}while(t.We>0||0===t.tt);return f.length>1?(l=new i(h),f.forEach((e=>{l.set(e,w),w+=e.length}))):l=f[0]?new i(f[0]):new i,l}},this.flush=()=>{t.Ct()}}kt.prototype={xt(e){const t=this;return t.gt=new gt,e||(e=15),t.gt.xt(t,e)},At(e){const t=this;return t.gt?t.gt.At(t,e):rt},Ct(){const e=this;if(!e.gt)return rt;const t=e.gt.Ct(e);return e.gt=null,t},It(){const e=this;return e.gt?e.gt.It(e):rt},_t(e,t){const n=this;return n.gt?n.gt._t(n,e,t):rt},ft(e){return this.et[e]},je(e,t){return this.et.subarray(e,e+t)}},self.initCodec=()=>{self.Deflate=nt,self.Inflate=vt};
`, i = () => t.useDataURI ? "data:text/javascript," + encodeURIComponent(s) : URL.createObjectURL(new Blob([s], { type: "text/javascript" }));
  e({ workerScripts: { inflate: [i], deflate: [i] } });
}
const Mf = "Writer iterator completed too soon", Bf = "Content-Type", Hf = 64 * 1024, Ba = "writable";
class Jn {
  constructor() {
    this.size = 0;
  }
  init() {
    this.initialized = !0;
  }
}
class Ha extends Jn {
  get readable() {
    const t = this, { chunkSize: s = Hf } = t, i = new ReadableStream({
      start() {
        this.chunkOffset = 0;
      },
      async pull(o) {
        const { offset: n = 0, size: r, diskNumberStart: l } = i, { chunkOffset: p } = this;
        o.enqueue(await Fe(t, n + p, Math.min(s, r - p), l)), p + s > r ? o.close() : this.chunkOffset += s;
      }
    });
    return i;
  }
}
class kn extends Ha {
  constructor(t) {
    super(), Object.assign(this, {
      blob: t,
      size: t.size
    });
  }
  async readUint8Array(t, s) {
    const i = this, o = t + s;
    let r = await (t || o < i.size ? i.blob.slice(t, o) : i.blob).arrayBuffer();
    return r.byteLength > s && (r = r.slice(t, o)), new Uint8Array(r);
  }
}
class Vf extends Jn {
  constructor(t) {
    super();
    const s = this, i = new TransformStream(), o = [];
    t && o.push([Bf, t]), Object.defineProperty(s, Ba, {
      get() {
        return i.writable;
      }
    }), s.blob = new Response(i.readable, { headers: o }).blob();
  }
  getData() {
    return this.blob;
  }
}
class zf extends Ha {
  constructor(t) {
    super(), this.readers = t;
  }
  async init() {
    const t = this, { readers: s } = t;
    t.lastDiskNumber = 0, t.lastDiskOffset = 0, await Promise.all(s.map(async (i, o) => {
      await i.init(), o != s.length - 1 && (t.lastDiskOffset += i.size), t.size += i.size;
    })), super.init();
  }
  async readUint8Array(t, s, i = 0) {
    const o = this, { readers: n } = this;
    let r, l = i;
    l == -1 && (l = n.length - 1);
    let p = t;
    for (; p >= n[l].size; )
      p -= n[l].size, l++;
    const c = n[l], f = c.size;
    if (p + s <= f)
      r = await Fe(c, p, s);
    else {
      const u = f - p;
      r = new Uint8Array(s), r.set(await Fe(c, p, u)), r.set(await o.readUint8Array(t + u, s - u, i), u);
    }
    return o.lastDiskNumber = Math.max(l, o.lastDiskNumber), r;
  }
}
class bo extends Jn {
  constructor(t, s = 4294967295) {
    super();
    const i = this;
    Object.assign(i, {
      diskNumber: 0,
      diskOffset: 0,
      size: 0,
      maxSize: s,
      availableSize: s
    });
    let o, n, r;
    const l = new WritableStream({
      async write(f) {
        const { availableSize: u } = i;
        if (r)
          f.length >= u ? (await p(f.slice(0, u)), await c(), i.diskOffset += o.size, i.diskNumber++, r = null, await this.write(f.slice(u))) : await p(f);
        else {
          const { value: g, done: w } = await t.next();
          if (w && !g)
            throw new Error(Mf);
          o = g, o.size = 0, o.maxSize && (i.maxSize = o.maxSize), i.availableSize = i.maxSize, await xs(o), n = g.writable, r = n.getWriter(), await this.write(f);
        }
      },
      async close() {
        await r.ready, await c();
      }
    });
    Object.defineProperty(i, Ba, {
      get() {
        return l;
      }
    });
    async function p(f) {
      const u = f.length;
      u && (await r.ready, await r.write(f), o.size += u, i.size += u, i.availableSize -= u);
    }
    async function c() {
      n.size = o.size, await r.close();
    }
  }
}
async function xs(e, t) {
  if (e.init && !e.initialized)
    await e.init(t);
  else
    return Promise.resolve();
}
function Yf(e) {
  return Array.isArray(e) && (e = new zf(e)), e instanceof ReadableStream && (e = {
    readable: e
  }), e;
}
function Gf(e) {
  e.writable === qe && typeof e.next == jr && (e = new bo(e)), e instanceof WritableStream && (e = {
    writable: e
  });
  const { writable: t } = e;
  return t.size === qe && (t.size = 0), e instanceof bo || Object.assign(e, {
    diskNumber: 0,
    diskOffset: 0,
    availableSize: 1 / 0,
    maxSize: 1 / 0
  }), e;
}
function Fe(e, t, s, i) {
  return e.readUint8Array(t, s, i);
}
const Va = "\0☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ".split(""), Zf = Va.length == 256;
function Jf(e) {
  if (Zf) {
    let t = "";
    for (let s = 0; s < e.length; s++)
      t += Va[e[s]];
    return t;
  } else
    return new TextDecoder().decode(e);
}
function cs(e, t) {
  return t && t.trim().toLowerCase() == "cp437" ? Jf(e) : new TextDecoder(t).decode(e);
}
const za = "filename", Ya = "rawFilename", Ga = "comment", Za = "rawComment", Ja = "uncompressedSize", Ka = "compressedSize", Xa = "offset", En = "diskNumberStart", On = "lastModDate", Tn = "rawLastModDate", Qa = "lastAccessDate", Kf = "rawLastAccessDate", el = "creationDate", Xf = "rawCreationDate", Qf = "internalFileAttribute", eu = "internalFileAttributes", tu = "externalFileAttribute", ru = "externalFileAttributes", su = "msDosCompatible", nu = "zip64", iu = "encrypted", ou = "version", au = "versionMadeBy", lu = "zipCrypto", pu = "directory", cu = "executable", fu = [
  za,
  Ya,
  Ka,
  Ja,
  On,
  Tn,
  Ga,
  Za,
  Qa,
  el,
  Xa,
  En,
  En,
  Qf,
  eu,
  tu,
  ru,
  su,
  nu,
  iu,
  ou,
  au,
  lu,
  pu,
  cu,
  "bitFlag",
  "signature",
  "filenameUTF8",
  "commentUTF8",
  "compressionMethod",
  "extraField",
  "rawExtraField",
  "extraFieldZip64",
  "extraFieldUnicodePath",
  "extraFieldUnicodeComment",
  "extraFieldAES",
  "extraFieldNTFS",
  "extraFieldExtendedTimestamp"
];
class vo {
  constructor(t) {
    fu.forEach((s) => this[s] = t[s]);
  }
}
const ln = "File format is not recognized", uu = "End of central directory not found", du = "End of Zip64 central directory locator not found", mu = "Central directory header not found", hu = "Local file header not found", yu = "Zip64 extra field not found", gu = "File contains encrypted entry", _u = "Encryption method not supported", Po = "Compression method not supported", xo = "Split zip file", $o = "utf-8", ko = "cp437", wu = [
  [Ja, Jt],
  [Ka, Jt],
  [Xa, Jt],
  [En, Ft]
], bu = {
  [Ft]: {
    getValue: be,
    bytes: 4
  },
  [Jt]: {
    getValue: fs,
    bytes: 8
  }
};
class Eo {
  constructor(t, s = {}) {
    Object.assign(this, {
      reader: Yf(t),
      options: s,
      config: Qc()
    });
  }
  async *getEntriesGenerator(t = {}) {
    const s = this;
    let { reader: i } = s;
    const { config: o } = s;
    if (await xs(i), (i.size === qe || !i.readUint8Array) && (i = new kn(await new Response(i.readable).blob()), await xs(i)), i.size < ar)
      throw new Error(ln);
    i.chunkSize = ef(o);
    const n = await Eu(i, qc, i.size, ar, Ft * 16);
    if (!n) {
      const P = await Fe(i, 0, 4), $ = Se(P);
      throw be($) == jc ? new Error(xo) : new Error(uu);
    }
    const r = Se(n);
    let l = be(r, 12), p = be(r, 16);
    const c = n.offset, f = Te(r, 20), u = c + ar + f;
    let g = Te(r, 4);
    const w = i.lastDiskNumber || 0;
    let O = Te(r, 6), m = Te(r, 8), h = 0, _ = 0;
    if (p == Jt || l == Jt || m == Ft || O == Ft) {
      const P = await Fe(i, n.offset - tn, tn), $ = Se(P);
      if (be($, 0) == Wc) {
        p = fs($, 8);
        let L = await Fe(i, p, rn, -1), x = Se(L);
        const I = n.offset - tn - rn;
        if (be(x, 0) != Xi && p != I) {
          const q = p;
          p = I, h = p - q, L = await Fe(i, p, rn, -1), x = Se(L);
        }
        if (be(x, 0) != Xi)
          throw new Error(du);
        g == Ft && (g = be(x, 16)), O == Ft && (O = be(x, 20)), m == Ft && (m = fs(x, 32)), l == Jt && (l = fs(x, 40)), p -= l;
      }
    }
    if (p >= i.size && (h = i.size - p - l - ar, p = i.size - l - ar), w != g)
      throw new Error(xo);
    if (p < 0)
      throw new Error(ln);
    let k = 0, v = await Fe(i, p, l, O), R = Se(v);
    if (l) {
      const P = n.offset - l;
      if (be(R, k) != Ki && p != P) {
        const $ = p;
        p = P, h += p - $, v = await Fe(i, p, l, O), R = Se(v);
      }
    }
    const E = n.offset - p - (i.lastDiskOffset || 0);
    if (l != E && E >= 0 && (l = E, v = await Fe(i, p, l, O), R = Se(v)), p < 0 || p >= i.size)
      throw new Error(ln);
    const A = Ue(s, t, "filenameEncoding"), C = Ue(s, t, "commentEncoding");
    for (let P = 0; P < m; P++) {
      const $ = new vu(i, o, s.options);
      if (be(R, k) != Ki)
        throw new Error(mu);
      tl($, R, k + 6);
      const L = !!$.bitFlag.languageEncodingFlag, x = k + 46, I = x + $.filenameLength, q = I + $.extraFieldLength, N = Te(R, k + 4), z = N >> 8 == 0, B = N >> 8 == 3, H = v.subarray(x, I), U = Te(R, k + 32), Y = q + U, J = v.subarray(q, Y), M = L, te = L, se = be(R, k + 38), X = z && (dr(R, k + 38) & ro) == ro || B && (se >> 16 & so) == so || H.length && H[H.length - 1] == io.charCodeAt(0), _e = B && (se >> 16 & no) == no, we = be(R, k + 42) + h;
      Object.assign($, {
        versionMadeBy: N,
        msDosCompatible: z,
        compressedSize: 0,
        uncompressedSize: 0,
        commentLength: U,
        directory: X,
        offset: we,
        diskNumberStart: Te(R, k + 34),
        internalFileAttributes: Te(R, k + 36),
        externalFileAttributes: se,
        rawFilename: H,
        filenameUTF8: M,
        commentUTF8: te,
        rawExtraField: v.subarray(I, q),
        executable: _e
      }), $.internalFileAttribute = $.internalFileAttributes, $.externalFileAttribute = $.externalFileAttributes;
      const xe = Ue(s, t, "decodeText") || cs, mt = M ? $o : A || ko, tt = te ? $o : C || ko;
      let Ne = xe(H, mt);
      Ne === qe && (Ne = cs(H, mt));
      let Ae = xe(J, tt);
      Ae === qe && (Ae = cs(J, tt)), Object.assign($, {
        rawComment: J,
        filename: Ne,
        comment: Ae,
        directory: X || Ne.endsWith(io)
      }), _ = Math.max(we, _), rl($, $, R, k + 6), $.zipCrypto = $.encrypted && !$.extraFieldAES;
      const ht = new vo($);
      ht.getData = ($e, Pt) => $.getData($e, ht, Pt), k = Y;
      const { onprogress: me } = t;
      if (me)
        try {
          await me(P + 1, m, new vo($));
        } catch {
        }
      yield ht;
    }
    const b = Ue(s, t, "extractPrependedData"), S = Ue(s, t, "extractAppendedData");
    return b && (s.prependedData = _ > 0 ? await Fe(i, 0, _) : new Uint8Array()), s.comment = f ? await Fe(i, c + ar, f) : new Uint8Array(), S && (s.appendedData = u < i.size ? await Fe(i, u, i.size - u) : new Uint8Array()), !0;
  }
  async getEntries(t = {}) {
    const s = [];
    for await (const i of this.getEntriesGenerator(t))
      s.push(i);
    return s;
  }
  async close() {
  }
}
class vu {
  constructor(t, s, i) {
    Object.assign(this, {
      reader: t,
      config: s,
      options: i
    });
  }
  async getData(t, s, i = {}) {
    const o = this, {
      reader: n,
      offset: r,
      diskNumberStart: l,
      extraFieldAES: p,
      compressionMethod: c,
      config: f,
      bitFlag: u,
      signature: g,
      rawLastModDate: w,
      uncompressedSize: O,
      compressedSize: m
    } = o, h = s.localDirectory = {}, _ = await Fe(n, r, 30, l), k = Se(_);
    let v = Ue(o, i, "password"), R = Ue(o, i, "rawPassword");
    const E = Ue(o, i, "passThrough");
    if (v = v && v.length && v, R = R && R.length && R, p && p.originalCompressionMethod != Dc)
      throw new Error(Po);
    if (c != Fc && c != Ic && !E)
      throw new Error(Po);
    if (be(k, 0) != Uc)
      throw new Error(hu);
    tl(h, k, 4), h.rawExtraField = h.extraFieldLength ? await Fe(n, r + 30 + h.filenameLength, h.extraFieldLength, l) : new Uint8Array(), rl(o, h, k, 4, !0), Object.assign(s, {
      lastAccessDate: h.lastAccessDate,
      creationDate: h.creationDate
    });
    const A = o.encrypted && h.encrypted && !E, C = A && !p;
    if (E || (s.zipCrypto = C), A) {
      if (!C && p.strength === qe)
        throw new Error(_u);
      if (!v && !R)
        throw new Error(gu);
    }
    const b = r + 30 + h.filenameLength + h.extraFieldLength, S = m, P = n.readable;
    Object.assign(P, {
      diskNumberStart: l,
      offset: b,
      size: S
    });
    const $ = Ue(o, i, "signal"), L = Ue(o, i, "checkPasswordOnly");
    L && (t = new WritableStream()), t = Gf(t), await xs(t, E ? m : O);
    const { writable: x } = t, { onstart: I, onprogress: q, onend: N } = i, z = {
      options: {
        codecType: qa,
        password: v,
        rawPassword: R,
        zipCrypto: C,
        encryptionStrength: p && p.strength,
        signed: Ue(o, i, "checkSignature") && !E,
        passwordVerification: C && (u.dataDescriptor ? w >>> 8 & 255 : g >>> 24 & 255),
        signature: g,
        compressed: c != 0 && !E,
        encrypted: o.encrypted && !E,
        useWebWorkers: Ue(o, i, "useWebWorkers"),
        useCompressionStream: Ue(o, i, "useCompressionStream"),
        transferStreams: Ue(o, i, "transferStreams"),
        checkPasswordOnly: L
      },
      config: f,
      streamOptions: { signal: $, size: S, onstart: I, onprogress: q, onend: N }
    };
    let B = 0;
    try {
      ({ outputSize: B } = await jf({ readable: P, writable: x }, z));
    } catch (H) {
      if (!L || H.message != Yn)
        throw H;
    } finally {
      const H = Ue(o, i, "preventClose");
      x.size += B, !H && !x.locked && await x.getWriter().close();
    }
    return L ? qe : t.getData ? t.getData() : x;
  }
}
function tl(e, t, s) {
  const i = e.rawBitFlag = Te(t, s + 2), o = (i & Qi) == Qi, n = be(t, s + 6);
  Object.assign(e, {
    encrypted: o,
    version: Te(t, s),
    bitFlag: {
      level: (i & Jc) >> 1,
      dataDescriptor: (i & eo) == eo,
      languageEncodingFlag: (i & to) == to
    },
    rawLastModDate: n,
    lastModDate: Ou(n),
    filenameLength: Te(t, s + 22),
    extraFieldLength: Te(t, s + 24)
  });
}
function rl(e, t, s, i, o) {
  const { rawExtraField: n } = t, r = t.extraField = /* @__PURE__ */ new Map(), l = Se(new Uint8Array(n));
  let p = 0;
  try {
    for (; p < n.length; ) {
      const _ = Te(l, p), k = Te(l, p + 2);
      r.set(_, {
        type: _,
        data: n.slice(p + 4, p + 4 + k)
      }), p += 4 + k;
    }
  } catch {
  }
  const c = Te(s, i + 4);
  Object.assign(t, {
    signature: be(s, i + 10),
    uncompressedSize: be(s, i + 18),
    compressedSize: be(s, i + 14)
  });
  const f = r.get(Mc);
  f && (Pu(f, t), t.extraFieldZip64 = f);
  const u = r.get(Yc);
  u && (Oo(u, za, Ya, t, e), t.extraFieldUnicodePath = u);
  const g = r.get(Gc);
  g && (Oo(g, Ga, Za, t, e), t.extraFieldUnicodeComment = g);
  const w = r.get(Bc);
  w ? (xu(w, t, c), t.extraFieldAES = w) : t.compressionMethod = c;
  const O = r.get(Hc);
  O && ($u(O, t), t.extraFieldNTFS = O);
  const m = r.get(zc);
  m && (ku(m, t, o), t.extraFieldExtendedTimestamp = m);
  const h = r.get(Zc);
  h && (t.extraFieldUSDZ = h);
}
function Pu(e, t) {
  t.zip64 = !0;
  const s = Se(e.data), i = wu.filter(([o, n]) => t[o] == n);
  for (let o = 0, n = 0; o < i.length; o++) {
    const [r, l] = i[o];
    if (t[r] == l) {
      const p = bu[l];
      t[r] = e[r] = p.getValue(s, n), n += p.bytes;
    } else if (e[r])
      throw new Error(yu);
  }
}
function Oo(e, t, s, i, o) {
  const n = Se(e.data), r = new vs();
  r.append(o[s]);
  const l = Se(new Uint8Array(4));
  l.setUint32(0, r.get(), !0);
  const p = be(n, 1);
  Object.assign(e, {
    version: dr(n, 0),
    [t]: cs(e.data.subarray(5)),
    valid: !o.bitFlag.languageEncodingFlag && p == be(l, 0)
  }), e.valid && (i[t] = e[t], i[t + "UTF8"] = !0);
}
function xu(e, t, s) {
  const i = Se(e.data), o = dr(i, 4);
  Object.assign(e, {
    vendorVersion: dr(i, 0),
    vendorId: dr(i, 2),
    strength: o,
    originalCompressionMethod: s,
    compressionMethod: Te(i, 5)
  }), t.compressionMethod = e.compressionMethod;
}
function $u(e, t) {
  const s = Se(e.data);
  let i = 4, o;
  try {
    for (; i < e.data.length && !o; ) {
      const n = Te(s, i), r = Te(s, i + 2);
      n == Vc && (o = e.data.slice(i + 4, i + 4 + r)), i += 4 + r;
    }
  } catch {
  }
  try {
    if (o && o.length == 24) {
      const n = Se(o), r = n.getBigUint64(0, !0), l = n.getBigUint64(8, !0), p = n.getBigUint64(16, !0);
      Object.assign(e, {
        rawLastModDate: r,
        rawLastAccessDate: l,
        rawCreationDate: p
      });
      const c = pn(r), f = pn(l), u = pn(p), g = { lastModDate: c, lastAccessDate: f, creationDate: u };
      Object.assign(e, g), Object.assign(t, g);
    }
  } catch {
  }
}
function ku(e, t, s) {
  const i = Se(e.data), o = dr(i, 0), n = [], r = [];
  s ? ((o & 1) == 1 && (n.push(On), r.push(Tn)), (o & 2) == 2 && (n.push(Qa), r.push(Kf)), (o & 4) == 4 && (n.push(el), r.push(Xf))) : e.data.length >= 5 && (n.push(On), r.push(Tn));
  let l = 1;
  n.forEach((p, c) => {
    if (e.data.length >= l + 4) {
      const f = be(i, l);
      t[p] = e[p] = new Date(f * 1e3);
      const u = r[c];
      e[u] = f;
    }
    l += 4;
  });
}
async function Eu(e, t, s, i, o) {
  const n = new Uint8Array(4), r = Se(n);
  Tu(r, 0, t);
  const l = i + o;
  return await p(i) || await p(Math.min(l, s));
  async function p(c) {
    const f = s - c, u = await Fe(e, f, c);
    for (let g = u.length - i; g >= 0; g--)
      if (u[g] == n[0] && u[g + 1] == n[1] && u[g + 2] == n[2] && u[g + 3] == n[3])
        return {
          offset: f + g,
          buffer: u.slice(g, g + i).buffer
        };
  }
}
function Ue(e, t, s) {
  return t[s] === qe ? e.options[s] : t[s];
}
function Ou(e) {
  const t = (e & 4294901760) >> 16, s = e & 65535;
  try {
    return new Date(1980 + ((t & 65024) >> 9), ((t & 480) >> 5) - 1, t & 31, (s & 63488) >> 11, (s & 2016) >> 5, (s & 31) * 2, 0);
  } catch {
  }
}
function pn(e) {
  return new Date(Number(e / BigInt(1e4) - BigInt(116444736e5)));
}
function dr(e, t) {
  return e.getUint8(t);
}
function Te(e, t) {
  return e.getUint16(t, !0);
}
function be(e, t) {
  return e.getUint32(t, !0);
}
function fs(e, t) {
  return Number(e.getBigUint64(t, !0));
}
function Tu(e, t, s) {
  e.setUint32(t, s, !0);
}
function Se(e) {
  return new DataView(e.buffer);
}
let sl;
try {
  sl = import.meta.url;
} catch {
}
zn({ baseURL: sl });
Wf(zn);
zn({ Deflate: dc, Inflate: Nc });
class Su {
  constructor(t) {
    this.fileTree = t;
  }
  async read(t) {
    let s = this.getEntryAtPath(t);
    if (typeof s == "string")
      s = new TextEncoder().encode(s);
    else if (!(s instanceof Uint8Array))
      throw new Error(`Unsupported content type: ${typeof s}`);
    const i = new ReadableStream({
      start(o) {
        o.enqueue(s), o.close();
      }
    });
    return new Xt(i, t, {
      filesize: s.byteLength
    });
  }
  getEntryAtPath(t) {
    let s = t.replace(/^\//, ""), i = this.fileTree;
    for (; s; ) {
      if (i[s])
        return i[s];
      const o = s.split("/"), n = o.shift();
      if (!n || !i[n])
        break;
      i = i[n], s = o.join("/");
    }
    throw new Error(`File not found at ${t}`);
  }
}
class $s {
  constructor(t) {
    this.entries = /* @__PURE__ */ new Map(), this.zipReader = t;
  }
  static fromStream(t) {
    const s = new Eo(
      new kn(new Xt(t, "archive.zip"))
    );
    return new $s(s);
  }
  static fromArrayBuffer(t) {
    const s = new Eo(
      new kn(new Blob([t]))
    );
    return new $s(s);
  }
  async read(t) {
    const s = await this.getEntry(t), i = await s.getData(new Vf());
    return new Xt(i.stream(), t, {
      filesize: s.uncompressedSize
    });
  }
  async getEntry(t) {
    const s = await this.getEntries(), i = dt(t).replace(/^\//, ""), o = s.get(i);
    if (!o)
      throw new Error(`File ${t} not found in the zip.`);
    return o;
  }
  async getEntries() {
    if (this.entries.size === 0) {
      const t = await this.zipReader.getEntries();
      for (const s of t)
        this.entries.set(s.filename, s);
    }
    return this.entries;
  }
  /**
   * Returns the paths of all entries in the zip (file and directory names).
   */
  async getAllFilePaths() {
    const t = await this.getEntries();
    return Array.from(t.keys());
  }
}
class Au {
  constructor(t, s) {
    this.chroot = t, this.backend = s;
  }
  async read(t) {
    const s = ne(this.chroot, t);
    return this.backend.read(s);
  }
}
class Ru {
  /**
   * Creates a new OverlayFilesystem.
   *
   * @param filesystems An array of Filesystem instances to cascade through.
   *                    The order determines the priority - earlier filesystems
   *                    are checked first.
   */
  constructor(t) {
    if (!t.length)
      throw new Error(
        "OverlayFilesystem requires at least one filesystem"
      );
    this.filesystems = t;
  }
  /**
   * Reads a file by trying each filesystem in order until one succeeds.
   *
   * @param path The path to the file to read.
   * @returns A Promise that resolves to a StreamedFile from the first
   *          filesystem that successfully resolves the path.
   * @throws Error if all filesystems fail to resolve the path.
   */
  async read(t) {
    const s = [];
    for (const o of this.filesystems)
      try {
        return await o.read(t);
      } catch (n) {
        s.push(
          n instanceof Error ? n : new Error(String(n))
        );
      }
    const i = s.map((o) => o.message).join("; ");
    throw new Error(
      `Failed to read ${t} from any filesystem: ${i}`,
      { cause: s }
    );
  }
}
class Lu {
  constructor(t) {
    if (this.baseUrl = "", this.options = t, this.isDataUrl = t.baseUrl.startsWith("data:"), this.isDataUrl)
      return;
    const s = new URL("./", t.baseUrl);
    if (s.protocol !== "http:" && s.protocol !== "https:")
      throw new Error(
        "Unsupported protocol: " + s.protocol + ". Only HTTP and HTTPS are supported."
      );
    this.baseUrl = s.origin + s.pathname;
  }
  async read(t) {
    if (this.isDataUrl)
      throw new Error(
        "FetchFilesystem cannot fetch files from data URLs"
      );
    t = dt(t);
    const s = t.replace(/^\//, ""), i = new URL(s, this.baseUrl).toString();
    if (!i.startsWith(this.baseUrl))
      throw new Error(
        `Refused to read a file outside of the base URL: ${i}`
      );
    const o = this.options.corsProxy ? `${this.options.corsProxy}${encodeURIComponent(i)}` : i, n = await fetch(o);
    if (!n.ok)
      throw new Error(
        `Failed to fetch file at ${t}: ${n.statusText}`
      );
    const r = n.headers.get("content-length") ? parseInt(n.headers.get("content-length"), 10) : void 0;
    return new Xt(n.body, t, { filesize: r });
  }
}
class To extends Error {
  constructor(t, s) {
    super(
      `Authentication required to access private repository: ${t}`
    ), this.name = "GitAuthenticationError", this.repoUrl = t, this.status = s;
  }
}
function Kn() {
  return import("./git-sparse-checkout-DVyRV261.js");
}
function Cu() {
  return import("./git-create-dotgit-directory-Bq8LQROs.js");
}
async function Nu(...e) {
  return (await Kn()).sparseCheckout(...e);
}
async function Iu(...e) {
  return (await Kn()).listGitFiles(...e);
}
async function Fu(...e) {
  return (await Kn()).resolveCommitHash(...e);
}
async function Du(...e) {
  return (await Cu()).createDotGitDirectory(
    ...e
  );
}
function Ls(e) {
  const t = e.split(".").shift().replace(/-/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}
async function Sn(e, t) {
  let s;
  return ["GET", "HEAD"].includes(e.method) ? s = void 0 : "body" in t ? s = t.body : !e.bodyUsed && e.body ? s = e.body : s = await e.arrayBuffer(), new Request(t.url || e.url, {
    body: s,
    method: e.method,
    headers: e.headers,
    referrer: e.referrer,
    referrerPolicy: e.referrerPolicy,
    mode: e.mode === "navigate" ? "same-origin" : e.mode,
    credentials: e.credentials,
    cache: e.cache,
    redirect: e.redirect,
    integrity: e.integrity,
    /**
     * Infer the duplex value in a way that's consistent across browsers. Web browsers
     * only support 'half' as of January 2026, but other values may be supported in the future.
     * Unfortunately, also as of January 2026, we cannot read the duplex value directly from the
     * request object:
     *
     * > Although duplex can be passed as an option when constructing a Request,
     * > it is not currently exposed as a readable property on the resulting Request
     * > object in all browsers.
     *
     * See MDN: https://developer.mozilla.org/en-US/docs/Web/API/Request/duplex
     */
    ...s instanceof ReadableStream && { duplex: "half" },
    ...t
  });
}
let $r;
async function Uu() {
  if ($r !== void 0)
    return $r;
  try {
    const e = new ReadableStream({
      start(t) {
        t.close();
      }
    });
    await fetch("data:,", {
      method: "POST",
      body: e,
      duplex: "half"
    }), $r = !0;
  } catch {
    $r = !1;
  }
  return $r;
}
class ju extends Error {
  constructor(t, s, i) {
    super(
      `Could not fetch ${t} – your network appears to be blocking this request (HTTP ${s}). This often happens on school, university, or corporate networks. Try switching to a different network or using a VPN.`
    ), this.name = "FirewallInterferenceError", this.url = t, this.status = s, this.statusText = i;
  }
}
const qu = "X-Playground-Cors-Proxy", nl = /* @__PURE__ */ new Map([
  [
    "api.anthropic.com",
    {
      "anthropic-dangerous-direct-browser-access": "true"
    }
  ],
  ["api.openai.com", {}],
  ["generativelanguage.googleapis.com", {}]
]);
async function Wu(e, t, s, i) {
  var p;
  let o = typeof e == "string" ? new Request(e, t) : e;
  const n = i ? new URL(i) : null;
  let r = n ? new URL(o.url, n) : new URL(o.url);
  if (Mu(r))
    return await fetch(o);
  if (Bu(r))
    return o = await Hu(
      o,
      r
    ), await fetch(o);
  if (r.protocol === "http:") {
    r.protocol = "https:";
    const c = r.toString();
    o = await Sn(o, { url: c }), r = new URL(c);
  }
  if (!s)
    return await fetch(o);
  if (n && r.protocol === n.protocol && r.hostname === n.hostname && r.port === n.port && r.pathname.startsWith(n.pathname))
    return await fetch(o);
  const l = o.clone();
  try {
    return await fetch(o);
  } catch {
    const c = new Headers(o.headers), f = ((p = c.get("x-cors-proxy-allowed-request-headers")) == null ? void 0 : p.split(",")) || [], u = f.includes("authorization") || f.includes("cookie"), g = c.get("content-type");
    g && g.toLowerCase().includes("multipart/form-data") && (c.set("x-cors-proxy-content-type", g), c.set("content-type", "application/octet-stream"));
    let w = null;
    const O = o.method.toUpperCase();
    O !== "GET" && O !== "HEAD" && (await Uu() ? w = l.body : w = await l.arrayBuffer()), w instanceof ReadableStream && new URL(s, import.meta.url).protocol === "http:" && (w = await new Response(w).arrayBuffer());
    const m = await Sn(o, {
      url: `${s}${o.url}`,
      headers: c,
      body: w,
      ...u && { credentials: "include" }
    }), h = await fetch(m);
    if (!h.headers.has(qu))
      throw new ju(
        o.url,
        h.status,
        h.statusText
      );
    return h;
  }
}
function Mu(e) {
  return e.hostname === "localhost" || e.hostname === "127.0.0.1" || e.hostname === "[::1]" || e.hostname === "::1";
}
function Bu(e) {
  return e.protocol === "https:" && nl.has(e.hostname);
}
async function Hu(e, t) {
  const s = nl.get(t.hostname);
  if (!s)
    return e;
  const i = new Headers(e.headers);
  for (const [o, n] of Object.entries(s))
    i.has(o) || i.set(o, n);
  return await Sn(e, {
    headers: i
  });
}
const Vu = `Blueprint resource of type "bundled" requires a filesystem.

This Blueprint refers to files that should be bundled with it (like images, plugins, or themes), but the filesystem needed to access these files is not available. This usually happens when:

1. You're trying to load a Blueprint as a standalone JSON file that was meant to be part of a bundle
2. The Blueprint was not packaged correctly as a blueprint.zip file

To fix this:
• If you're loading from a URL, make sure all referenced files are accessible relative to the Blueprint file
• If you're using a blueprint.zip file, ensure it contains all the files referenced in the Blueprint
• Check that the "resource": "bundled" references in your Blueprint match actual files in your bundle

Learn more about Blueprint resources: https://wordpress.github.io/wordpress-playground/blueprints/data-format#resources`;
class zu extends Error {
  constructor(t = Vu) {
    super(t), this.name = "BlueprintFilesystemRequiredError";
  }
}
class cn extends Error {
  constructor(t, s, i) {
    super(t, i), this.name = "ResourceDownloadError", this.url = s;
  }
}
const Yu = [
  "vfs",
  "literal",
  "wordpress.org/themes",
  "wordpress.org/plugins",
  "url",
  "git:directory",
  "bundled",
  "zip"
];
function Gu(e) {
  return e && typeof e == "object" && typeof e.resource == "string" && Yu.includes(e.resource);
}
function Zu(e) {
  try {
    return new URL(e).hostname === "github-proxy.com";
  } catch {
    return !1;
  }
}
function Ju(e) {
  let t;
  try {
    t = new URL(e);
  } catch {
    return null;
  }
  if (t.hostname !== "github-proxy.com")
    return null;
  const s = t.pathname.slice(1);
  if (s.startsWith("https://github.com/") || s.startsWith("http://github.com/"))
    return { resource: "url", url: s };
  const i = t.searchParams, o = i.get("repo");
  if (!o)
    return null;
  const n = i.get("release"), r = i.get("asset");
  if (n && r) {
    const O = n === "latest" ? "releases/latest/download" : `releases/download/${n}`;
    return {
      resource: "url",
      url: `https://github.com/${o}/${O}/${r}`
    };
  }
  let l, p;
  const c = i.get("pr"), f = i.get("commit"), u = i.get("branch");
  c ? l = `refs/pull/${c}/head` : f ? (l = f, p = "commit") : n ? (l = n, p = "tag") : l = u || "HEAD";
  const g = i.get("directory");
  return {
    resource: "zip",
    inner: {
      resource: "git:directory",
      url: `https://github.com/${o}`,
      ref: l,
      ...p && { refType: p },
      ...g && { path: g }
    }
  };
}
class Ve {
  get progress() {
    return this._progress;
  }
  set progress(t) {
    this._progress = t;
  }
  setPlayground(t) {
    this.playground = t;
  }
  /** Whether this Resource is loaded asynchronously */
  get isAsync() {
    return !1;
  }
  /**
   * Creates a new Resource based on the given file reference
   *
   * @param ref The file reference to create the Resource for
   * @param options Additional options for the Resource
   * @returns A new Resource instance
   */
  static create(t, {
    semaphore: s,
    progress: i,
    corsProxy: o,
    streamBundledFile: n,
    gitAdditionalHeadersCallback: r
  }) {
    if (t.resource === "url" && Zu(t.url)) {
      const p = Ju(t.url);
      p && (console.warn(
        `[Blueprints] github-proxy.com is deprecated and will stop working soon. The URL "${t.url}" has been automatically converted to a ${p.resource} resource. Please update your Blueprint to use native resource types. See: https://wordpress.github.io/wordpress-playground/blueprints/steps/resources`
      ), t = p);
    }
    let l;
    switch (t.resource) {
      case "vfs":
        l = new Ku(t, i);
        break;
      case "literal":
        l = new Xu(t, i);
        break;
      case "wordpress.org/themes":
        l = new id(t, i);
        break;
      case "wordpress.org/plugins":
        l = new od(t, i);
        break;
      case "url":
        l = new td(t, i, { corsProxy: o });
        break;
      case "git:directory":
        l = new rd(t, i, {
          corsProxy: o,
          additionalHeaders: r
        });
        break;
      case "literal:directory":
        l = new nd(t, i);
        break;
      case "bundled":
        if (!n)
          throw new zu();
        l = new pd(
          t,
          n,
          i
        );
        break;
      case "zip": {
        const p = Ve.create(t.inner, {
          semaphore: s,
          progress: i,
          corsProxy: o,
          streamBundledFile: n,
          gitAdditionalHeadersCallback: r
        });
        l = new cd(t, p, i);
        break;
      }
      default:
        throw new Error(
          `Unknown resource type: ${t.resource}`
        );
    }
    return s && (l = new ld(l, s)), new ad(l);
  }
}
class il extends Ve {
  constructor(t) {
    super(), this.resource = t;
  }
  /** @inheritDoc */
  get progress() {
    return this.resource.progress;
  }
  /** @inheritDoc */
  set progress(t) {
    this.resource.progress = t;
  }
  /** @inheritDoc */
  get name() {
    return this.resource.name;
  }
  /** @inheritDoc */
  get isAsync() {
    return this.resource.isAsync;
  }
  /** @inheritDoc */
  setPlayground(t) {
    this.resource.setPlayground(t);
  }
}
class Ku extends Ve {
  /**
   * Creates a new instance of `VFSResource`.
   * @param playground The playground client.
   * @param resource The VFS reference.
   * @param progress The progress tracker.
   */
  constructor(t, s) {
    super(), this.resource = t, this._progress = s;
  }
  /** @inheritDoc */
  async resolve() {
    var s;
    const t = await this.playground.readFileAsBuffer(
      this.resource.path
    );
    return (s = this.progress) == null || s.set(100), new File([t], this.name);
  }
  /** @inheritDoc */
  get name() {
    return this.resource.path.split("/").pop() || "";
  }
}
class Xu extends Ve {
  /**
   * Creates a new instance of `LiteralResource`.
   * @param resource The literal reference.
   * @param progress The progress tracker.
   */
  constructor(t, s) {
    super(), this.resource = t, this._progress = s;
  }
  /** @inheritDoc */
  async resolve() {
    var t;
    return (t = this.progress) == null || t.set(100), new File([this.resource.contents], this.resource.name);
  }
  /** @inheritDoc */
  get name() {
    return this.resource.name;
  }
}
class Xn extends Ve {
  /**
   * Creates a new instance of `FetchResource`.
   * @param progress The progress tracker.
   */
  constructor(t, s) {
    super(), this._progress = t, this.corsProxy = s;
  }
  /** @inheritDoc */
  async resolve() {
    var s, i, o;
    (s = this.progress) == null || s.setCaption(this.caption);
    const t = this.getURL();
    try {
      let n = await Wu(
        t,
        void 0,
        this.corsProxy,
        await ((i = this.playground) == null ? void 0 : i.absoluteUrl)
      );
      if (!n.ok)
        throw new cn(
          `Could not download "${t}"`,
          t
        );
      if (n = await Zl(
        n,
        ((o = this.progress) == null ? void 0 : o.loadingListener) ?? ed
      ), n.status !== 200)
        throw new cn(
          `Could not download "${t}"`,
          t
        );
      const r = this.name || Qu(
        n.headers.get("content-disposition") || ""
      ) || encodeURIComponent(t);
      return new File([await n.arrayBuffer()], r);
    } catch (n) {
      throw new cn(
        `Could not download "${t}".

Confirm that the URL is correct, the server is reachable, and the file is actually served at that URL. Original error: 
 ${n}`,
        t,
        { cause: n }
      );
    }
  }
  /**
   * Gets the caption for the progress tracker.
   * @returns The caption.
   */
  get caption() {
    return `Downloading ${this.name}`;
  }
  /** @inheritDoc */
  get name() {
    try {
      return new URL(this.getURL(), "http://example.com").pathname.split("/").pop();
    } catch {
      return this.getURL();
    }
  }
  /** @inheritDoc */
  get isAsync() {
    return !0;
  }
}
function Qu(e) {
  if (!e)
    return null;
  const t = e.match(/filename\*?=([^;]+)/i);
  if (!t)
    return null;
  let s = t[1].trim();
  if ((s.startsWith('"') && s.endsWith('"') || s.startsWith("'") && s.endsWith("'")) && (s = s.slice(1, -1)), t[0].includes("filename*")) {
    const i = s.match(/^[^']*'[^']*'(.+)$/);
    if (i)
      try {
        s = decodeURIComponent(i[1]);
      } catch {
      }
  }
  return s;
}
const ed = () => {
};
class td extends Xn {
  /**
   * Creates a new instance of `UrlResource`.
   * @param resource The URL reference.
   * @param progress The progress tracker.
   */
  constructor(t, s, i) {
    if (super(s, i == null ? void 0 : i.corsProxy), this.resource = t, this.options = i, this.resource.url.startsWith("https://github.com/")) {
      const o = this.resource.url.match(
        /^https:\/\/github\.com\/(?<owner>[^/]+)\/(?<repo>[^/]+)\/(?:blob|raw)\/(?<branch>[^/]+)\/(?<path>.+[^/])$/
      );
      o != null && o.groups && (this.resource = {
        ...this.resource,
        url: `https://raw.githubusercontent.com/${o.groups.owner}/${o.groups.repo}/${o.groups.branch}/${o.groups.path}`
      });
    }
  }
  /** @inheritDoc */
  getURL() {
    return this.resource.url;
  }
  /** @inheritDoc */
  get caption() {
    return this.resource.caption ?? super.caption;
  }
}
class rd extends Ve {
  constructor(t, s, i) {
    super(), this.reference = t, this._progress = s, this.options = i;
  }
  async resolve() {
    var i, o, n;
    const t = ((o = (i = this.options) == null ? void 0 : i.additionalHeaders) == null ? void 0 : o.call(i, this.reference.url)) ?? {}, s = (n = this.options) != null && n.corsProxy ? `${this.options.corsProxy}${this.reference.url}` : this.reference.url;
    try {
      const r = await Fu(
        s,
        {
          value: this.reference.ref,
          type: this.reference.refType ?? "infer"
        },
        t
      ), l = await Iu(
        s,
        r,
        t
      ), p = (this.reference.path ?? "").replace(
        /^\/+/,
        ""
      ), c = Jp(l, p), f = await Nu(
        s,
        r,
        c,
        {
          withObjects: this.reference[".git"],
          additionalHeaders: t
        }
      );
      let u = f.files;
      return u = sd(
        u,
        (g) => g.substring(p.length).replace(/^\/+/, "")
      ), this.reference[".git"] && (u = {
        ...await Du({
          repoUrl: this.reference.url,
          commitHash: r,
          ref: this.reference.ref,
          refType: this.reference.refType,
          objects: f.objects ?? [],
          fileOids: f.fileOids ?? {},
          pathPrefix: p
        }),
        ...u
      }), {
        name: this.filename,
        files: u
      };
    } catch (r) {
      throw r instanceof To ? new To(
        this.reference.url,
        r.status
      ) : r;
    }
  }
  /**
   * Generate a nice, non-empty filename – the installPlugin step depends on it.
   */
  get filename() {
    return this.name.replaceAll(/[^a-zA-Z0-9-.]/g, "-").replaceAll(/-+/g, "-").replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "") || Tr();
  }
  /** @inheritDoc */
  get name() {
    var t;
    return [
      this.reference.url,
      this.reference.ref ? `(${this.reference.ref})` : "",
      (t = this.reference.path) != null && t.replace(/^\/+/, "") ? `at ${this.reference.path}` : ""
    ].filter((s) => s.length > 0).join(" ");
  }
}
function sd(e, t) {
  return Object.fromEntries(
    Object.entries(e).map(([s, i]) => [t(s), i])
  );
}
class nd extends Ve {
  constructor(t, s) {
    super(), this.reference = t, this._progress = s;
  }
  async resolve() {
    return this.reference;
  }
  /** @inheritDoc */
  get name() {
    return this.reference.name;
  }
}
class id extends Xn {
  constructor(t, s) {
    super(s), this.resource = t;
  }
  get name() {
    return Ls(this.resource.slug);
  }
  getURL() {
    return `https://downloads.wordpress.org/theme/${ol(this.resource.slug)}`;
  }
}
class od extends Xn {
  constructor(t, s) {
    super(s), this.resource = t;
  }
  /** @inheritDoc */
  get name() {
    return Ls(this.resource.slug);
  }
  /** @inheritDoc */
  getURL() {
    return `https://downloads.wordpress.org/plugin/${ol(this.resource.slug)}`;
  }
}
function ol(e) {
  return !e || e.endsWith(".zip") ? e : e + ".latest-stable.zip";
}
class ad extends il {
  /** @inheritDoc */
  async resolve() {
    return this.promise || (this.promise = this.resource.resolve()), this.promise;
  }
}
class ld extends il {
  constructor(t, s) {
    super(t), this.semaphore = s;
  }
  /** @inheritDoc */
  async resolve() {
    return this.isAsync ? this.semaphore.run(() => this.resource.resolve()) : this.resource.resolve();
  }
}
class pd extends Ve {
  /**
   * Creates a new instance of `BlueprintResource`.
   * @param resource The blueprint reference.
   * @param filesystem The filesystem to read from.
   * @param progress The progress tracker.
   */
  constructor(t, s, i) {
    if (!s)
      throw new Error(
        `You are trying to run a Blueprint that refers to a bundled file ("blueprint" resource type), but you did not provide the rest of the bundle. This Blueprint won't work as a standalone JSON file. You'll need to load the entire bundle, e.g. a blueprint.zip file. Alternatively, you may try loading it directly from a URL or a local directory and Playground will try (with your permission) to source the missing files from paths relative to the blueprint file.`
      );
    super(), this.resource = t, this.streamBundledFile = s, this._progress = i;
  }
  /** @inheritDoc */
  async resolve() {
    var t, s, i;
    (t = this.progress) == null || t.set(0);
    try {
      const o = await this.streamBundledFile(this.resource.path), n = o.filesize;
      if (!n)
        return (s = this.progress) == null || s.set(100), o;
      const r = Jo(
        o.stream(),
        n,
        (l) => {
          var p;
          (p = this.progress) == null || p.set(
            l.detail.loaded / l.detail.total * 100
          );
        }
      );
      return new Xt(r, this.name, {
        filesize: n
      });
    } catch (o) {
      throw (i = this.progress) == null || i.set(100), new Error(
        `Failed to read file from blueprint. This Blueprint refers to a resource of type "bundled" with path "${this.resource.path}" that was not available. Please ensure that the entire bundle, such as a blueprint.zip file, is loaded. If you are trying to load the Blueprint directly from a URL or a local directory, make sure that all the necessary files are accessible and located relative to the blueprint file. 

Error details: ${o instanceof Error ? o.message : String(o)}`,
        { cause: o }
      );
    }
  }
  /** @inheritDoc */
  get name() {
    return this.resource.path.split("/").pop() || "";
  }
  /** @inheritDoc */
  get isAsync() {
    return !0;
  }
}
class cd extends Ve {
  constructor(t, s, i) {
    super(), this.reference = t, this.innerResource = s, this._progress = i;
  }
  /** @inheritDoc */
  async resolve() {
    var n, r;
    (n = this.progress) == null || n.setCaption(`Creating ZIP: ${this.name}`);
    const t = await this.innerResource.resolve();
    let s;
    t instanceof File ? s = [t] : s = fd(t.files, t.name);
    const i = hp(s), o = await lp(this.name, i);
    return (r = this.progress) == null || r.set(100), o;
  }
  /** @inheritDoc */
  get name() {
    if (this.reference.name)
      return this.reference.name;
    const t = this.innerResource.name;
    return t.endsWith(".zip") ? t : `${t}.zip`;
  }
  /** @inheritDoc */
  get isAsync() {
    return !0;
  }
}
function fd(e, t) {
  const s = [];
  function i(o, n) {
    for (const [r, l] of Object.entries(o)) {
      const p = n ? `${n}/${r}` : r;
      l instanceof Uint8Array ? s.push(new File([l], `${t}/${p}`)) : typeof l == "string" ? s.push(
        new File(
          [new TextEncoder().encode(l)],
          `${t}/${p}`
        )
      ) : i(l, p);
    }
  }
  return i(e, ""), s;
}
const al = async (e, { pluginPath: t, pluginName: s }, i) => {
  i == null || i.tracker.setCaption(`Activating ${s || t}`);
  const o = await e.documentRoot, n = ne(
    "/tmp",
    `playground-activate-plugin-${Qo(20, "")}.log`
  );
  let r = "";
  const p = await e.run({
    code: `<?php
			define( 'WP_ADMIN', true );
			require_once( getenv('DOCROOT') . "/wp-load.php" );
			require_once( getenv('DOCROOT') . "/wp-admin/includes/plugin.php" );

			// Force PHP errors to our scratch log for this request so the
			// JS caller can surface them when activation fails. This wins
			// over whatever WP_DEBUG_LOG resolved to during bootstrap.
			ini_set('log_errors', '1');
			ini_set('error_log', getenv('ACTIVATION_LOG'));

			// Set current user to admin
			wp_set_current_user( get_users(array('role' => 'Administrator') )[0]->ID );

			$plugin_path = getenv('PLUGIN_PATH');
			$response = false;
			if ( ! is_dir( $plugin_path)) {
				$response = activate_plugin($plugin_path);
			}

			// Activate plugin by name if activation by path wasn't successful
			if ( null !== $response ) {
				foreach ( ( glob( $plugin_path . '/*.php' ) ?: array() ) as $file ) {
					$info = get_plugin_data( $file, false, false );
					if ( ! empty( $info['Name'] ) ) {
						$response = activate_plugin( $file );
						break;
					}
				}
			}

			if ( is_wp_error($response) ) {
				die( $response->get_error_message() );
			} else if ( false === $response ) {
				die( "The activatePlugin step wasn't able to find the plugin $plugin_path." );
			}
		`,
    env: {
      PLUGIN_PATH: t,
      DOCROOT: o,
      ACTIVATION_LOG: n
    }
  }).finally(async () => {
    try {
      await e.fileExists(n) && (r = (await e.readFileAsText(n)).trim(), await e.unlink(n));
    } catch (w) {
      if (!dd(w))
        throw w;
    }
  });
  p.text && ue.warn(
    `Plugin ${t} activation printed the following bytes: ${p.text}`
  );
  const f = ((await e.run({
    code: `<?php
			ob_start();
			require_once( getenv( 'DOCROOT' ) . "/wp-load.php" );

			$plugin_directory = rtrim( WP_PLUGIN_DIR, '/' ) . '/';
			$relative_plugin_path = getenv( 'PLUGIN_PATH' );
			if (strpos($relative_plugin_path, $plugin_directory) === 0) {
				$relative_plugin_path = substr($relative_plugin_path, strlen($plugin_directory));
			}

			if ( is_dir( $plugin_directory . $relative_plugin_path ) ) {
				$relative_plugin_path = rtrim( $relative_plugin_path, '/' ) . '/';
			}

			$active_plugins = get_option( 'active_plugins' );
			if ( ! is_array( $active_plugins ) ) {
				$active_plugins = array();
			}
			ob_end_clean();

			/**
			 * Use a shutdown function to ensure the activation-related output comes
			 * last in stdout.
			 */
			register_shutdown_function( function() use ( $relative_plugin_path, $active_plugins ) {
				foreach ( $active_plugins as $plugin ) {
					if ( substr( $plugin, 0, strlen( $relative_plugin_path ) ) === $relative_plugin_path ) {
						die('{"success": true}');
						break;
					}
				}
				die('{"success": false}');
			});
		`,
    env: {
      DOCROOT: o,
      PLUGIN_PATH: t
    }
  })).text ?? "").trim();
  if (f.endsWith('{"success": true}'))
    return;
  f !== '{"success": false}' && ue.debug(f);
  const u = [], g = (p.text ?? "").trim();
  throw g && u.push(`WordPress said: ${g}`), r && u.push(`PHP error log:
${r}`), u.push(
    `Response headers: ${JSON.stringify(
      p.headers,
      null,
      2
    )}`
  ), u.push(
    "If you need more context, check the Playground console (browser DevTools) or the CLI output where this Blueprint was run."
  ), new Error(
    `Plugin ${t} could not be activated.

${u.join(`

`)}`
  );
}, ud = 44;
function dd(e) {
  const t = e;
  return t.code === "ENOENT" || t.errno === ud;
}
const ll = async (e, { themeFolderName: t }, s) => {
  s == null || s.tracker.setCaption(`Activating ${t}`);
  const i = await e.documentRoot, o = `${i}/wp-content/themes/${t}`;
  if (!await e.fileExists(o))
    throw new Error(`
			Couldn't activate theme ${t}.
			Theme not found at the provided theme path: ${o}.
			Check the theme path to ensure it's correct.
			If the theme is not installed, you can install it using the installTheme step.
			More info can be found in the Blueprint documentation: https://wordpress.github.io/wordpress-playground/blueprints/steps/#ActivateThemeStep
		`);
  const n = await e.run({
    code: `<?php
			define( 'WP_ADMIN', true );
			require_once( getenv('docroot') . "/wp-load.php" );

			// Set current user to admin
			wp_set_current_user( get_users(array('role' => 'Administrator') )[0]->ID );

			switch_theme( getenv('themeFolderName') );

			if( wp_get_theme()->get_stylesheet() !== getenv('themeFolderName') ) {
				throw new Exception( 'Theme ' . getenv('themeFolderName') . ' could not be activated.' );				
			}
			die('Theme activated successfully');
		`,
    env: {
      docroot: i,
      themeFolderName: t
    }
  });
  if (n.text !== "Theme activated successfully")
    throw ue.debug(n), new Error(
      `Theme ${t} could not be activated - WordPress exited with exit code ${n.exitCode}. Inspect the "debug" logs in the console for more details. Output headers: ${JSON.stringify(
        n.headers,
        null,
        2
      )}`
    );
}, md = async (e, { code: t }) => {
  let s = typeof t == "string" ? t : t.content;
  return (s.includes('"wordpress/wp-load.php"') || s.includes("'wordpress/wp-load.php'")) && (ue.error(
    `
It looks like you're trying to load WordPress using a relative path 'wordpress/wp-load.php'.

Playground recently changed the working directory from '/' to '/wordpress' to better mimic
how real web servers work. This means relative paths that used to work may no longer
point to the correct location.

Playground automatically updated the path for you, but at one point path rewriting will be removed. Please
update your code to use an absolute path instead:

Instead of:  require_once 'wordpress/wp-load.php';
Use:         require_once '/wordpress/wp-load.php';

This will ensure your code works reliably regardless of the current working directory.
		`.trim()
  ), s = s.replace(
    "'wordpress/wp-load.php'",
    "'/wordpress/wp-load.php'"
  ), s = s.replace(
    '"wordpress/wp-load.php"',
    '"/wordpress/wp-load.php"'
  )), await e.run({ code: s });
}, hd = async (e, { options: t }) => await e.run(t), An = async (e, { path: t }) => {
  t.startsWith("/") || (ue.error(
    `
The rm() step in your Blueprint refers to a relative path.

Playground recently changed the working directory from '/' to '/wordpress' to better mimic 
how real web servers work. This means relative paths that used to work may no longer 
point to the correct location.

Playground automatically updated the path for you, but at one point path rewriting will be removed. Please
update your code to use an absolute path instead:

Instead of:  rm({ path: 'wordpress/wp-load.php' });
Use:         rm({ path: '/wordpress/wp-load.php' });

This will ensure your code works reliably regardless of the current working directory.
		`.trim()
  ), t = `/${t}`), await e.unlink(t);
}, yd = `<?php

/**
 * Naively splits an SQL string into a sequence of queries. It
 * streams the data so you can process very large chunks of SQL
 * without running out of memory.
 * 
 * This class is **naive** because it doesn't understand what a
 * valid query is. The lexer does not provide a way to distinguish
 * between a syntax error and an incomplete input yet. Lacking this
 * information, we assume that no SQL query is larger than 2MB and,
 * failing to extract a query from a 2MB buffer, we fail. This heuristic
 * is often sufficient, but may fail in pathological cases.
 * 
 * Usage:
 * 
 *     $stream = new WP_MySQL_Naive_Query_Stream();
 *     $stream->append_sql( 'SELECT id FROM users; SELECT * FROM posts;' );
 *     while ( $stream->next_query() ) {
 *         $sql_string = $stream->get_query();
 *         // Process the query.
 *     }
 *     $stream->append_sql( 'CREATE TABLE users (id INT, name VARCHAR(255));' );
 *     while ( $stream->next_query() ) {
 *         $sql_string = $stream->get_query();
 *         // Process the query.
 *     }
 *     $stream->mark_input_complete();
 *     $stream->next_query(); // returns false
 */
class WP_MySQL_Naive_Query_Stream {

	private $sql_buffer = '';
	private $input_complete = false;
	private $state = true;
	private $last_query = false;

	const STATE_QUERY = 'valid';
	const STATE_SYNTAX_ERROR = 'syntax_error';
	const STATE_PAUSED_ON_INCOMPLETE_INPUT = 'paused_on_incomplete_input';
	const STATE_FINISHED = 'finished';

	/**
	 * The maximum size of the buffer to store the SQL input. We don't
	 * have enough information from the lexer to distinguish between
	 * an incomplete input and a syntax error so we use a heuristic –
	 * if we've accumulated more than this amount of SQL input, we assume
	 * it's a syntax error. That's why this class is called a "naive" query
	 * stream.
	 */
	const MAX_SQL_BUFFER_SIZE = 1024 * 1024 * 15;

	public function __construct() {}

	public function append_sql( string $sql ) {
		if($this->input_complete) {
			return false;
		}
		$this->sql_buffer .= $sql;
		$this->state = self::STATE_QUERY;
		return true;
	}

	public function is_paused_on_incomplete_input(): bool {
		return $this->state === self::STATE_PAUSED_ON_INCOMPLETE_INPUT;
	}

	public function mark_input_complete() {
		$this->input_complete = true;
	}

	public function next_query() {
		$this->last_query = false;
		if($this->state === self::STATE_PAUSED_ON_INCOMPLETE_INPUT) {
			return false;
		}

		$result = $this->do_next_query();
		if(!$result && strlen($this->sql_buffer) > self::MAX_SQL_BUFFER_SIZE) {
			$this->state = self::STATE_SYNTAX_ERROR;
			return false;
		}
		return $result;
	}

	private function do_next_query() {
		$query = [];
		$lexer = new WP_MySQL_Lexer( $this->sql_buffer );
		while ( $lexer->next_token() ) {
			$token = $lexer->get_token();
			$query[] = $token;
			if ( $token->id === WP_MySQL_Lexer::SEMICOLON_SYMBOL ) {
				// Got a complete query!
				break;
			}
		}

		// @TODO: expose this method from the lexer
		// if($lexer->get_state() === WP_MySQL_Lexer::STATE_SYNTAX_ERROR) {
		// 	return false;
		// }

		if(!count($query)) {
			if ( $this->input_complete ) {
				$this->state = self::STATE_FINISHED;
			} else {
				$this->state = self::STATE_PAUSED_ON_INCOMPLETE_INPUT;
			}
			return false;
		}

		// The last token either needs to end with a semicolon, or be the
		// last token in the input.
		$last_token = $query[count($query) - 1];
		if ( 
			$last_token->id !== WP_MySQL_Lexer::SEMICOLON_SYMBOL &&
			! $this->input_complete
		) {
			$this->state = self::STATE_PAUSED_ON_INCOMPLETE_INPUT;
			return false;
		}

		// See if the query has any meaningful tokens. We don't want to return
		// to give the caller a comment disguised as a query.
		$has_meaningful_tokens = false;
		foreach($query as $token) {
			if ( 
				$token->id !== WP_MySQL_Lexer::WHITESPACE && 
				$token->id !== WP_MySQL_Lexer::COMMENT &&
				$token->id !== WP_MySQL_Lexer::MYSQL_COMMENT_START &&
				$token->id !== WP_MySQL_Lexer::MYSQL_COMMENT_END &&
				$token->id !== WP_MySQL_Lexer::EOF
			) {
				$has_meaningful_tokens = true;
				break;
			}
		}
		if(!$has_meaningful_tokens) {
			if ( $this->input_complete ) {
				$this->state = self::STATE_FINISHED;
			} else {
				$this->state = self::STATE_PAUSED_ON_INCOMPLETE_INPUT;
			}
			return false;
		}

		// Remove the query from the input buffer and return it.
		$last_byte = $last_token->start + $last_token->length;
		$query = substr($this->sql_buffer, 0, $last_byte);
		$this->sql_buffer = substr($this->sql_buffer, $last_byte);
		$this->last_query = $query;
		$this->state = self::STATE_QUERY;
		return true;
	}

	public function get_query() {
		return $this->last_query;
	}

	public function get_state() {
		return $this->state;
	}

}`, gd = async (e, { sql: t }, s) => {
  s == null || s.tracker.setCaption("Executing SQL Queries");
  const i = `/tmp/${Tr()}.sql`, o = `/tmp/${Tr()}.php`;
  await e.writeFile(
    i,
    new Uint8Array(await t.arrayBuffer())
  ), await e.writeFile(
    o,
    new TextEncoder().encode(yd)
  );
  const n = await e.documentRoot, r = Ur({ docroot: n, sqlFilename: i, streamClassFilename: o }), l = await e.run({
    code: `<?php
		define('WP_SQLITE_AST_DRIVER', true);
		require_once ${r.docroot} . '/wp-load.php';

		// Load WP_MySQL_Naive_Query_Stream from the bundled file
		require_once ${r.streamClassFilename};

		global $wpdb;

		do_action('run_sql_step');

		$stream = new WP_MySQL_Naive_Query_Stream();

		// Open the SQL file for streaming
		$handle = fopen(${r.sqlFilename}, 'r');
		if (!$handle) {
			throw new Exception('Failed to open SQL file');
		}

		// Read and process the file in 8KB chunks
		$chunk_size = 8192;
		while (!feof($handle)) {
			$chunk = fread($handle, $chunk_size);
			if ($chunk === false) {
				break;
			}

			$stream->append_sql($chunk);

			// Process any complete queries in the stream
			while ($stream->next_query()) {
				$query = $stream->get_query();
				$wpdb->query($query);
			}
		}

		fclose($handle);

		// Mark input as complete and process any remaining queries
		$stream->mark_input_complete();
		while ($stream->next_query()) {
			$query = $stream->get_query();
			$wpdb->query($query);
		}
	`
  });
  return await An(e, { path: i }), await An(e, { path: o }), l;
}, _d = async (e, { request: t }) => {
  ue.warn(
    'Deprecated: The Blueprint step "request" is deprecated and will be removed in a future release.'
  );
  const s = await e.request(t);
  if (s.httpStatusCode > 399 || s.httpStatusCode < 200)
    throw ue.warn("WordPress response was", { response: s }), new Error(
      `Request failed with status ${s.httpStatusCode}`
    );
  return s;
};
function pl(e = fetch) {
  const t = {};
  return async function(i, o) {
    if (!t[i]) {
      t[i] = {
        responsePromise: e(i, o),
        async nextResponse() {
          const r = await t[i].responsePromise, [l, p] = t[i].unlockedBodyStream.tee();
          return t[i].unlockedBodyStream = l, new Response(p, {
            status: r.status,
            statusText: r.statusText,
            headers: r.headers
          });
        }
      };
      const n = await t[i].responsePromise;
      t[i].unlockedBodyStream = n.body;
    }
    return t[i].nextResponse();
  };
}
const Rn = "8.3", wd = 100, bd = 400 * 1024, Ln = "PLAYGROUND_UNZIP_PROGRESS:", Qn = async (e, t, s, i = !0, o) => {
  const n = `/tmp/file-${Math.random()}.zip`;
  let r = !1;
  try {
    if (t instanceof File) {
      const c = t;
      t = n, r = !0, await e.writeFile(
        t,
        new Uint8Array(await c.arrayBuffer())
      );
    }
    const p = {
      code: `<?php
		$zipPath = getenv('PLAYGROUND_UNZIP_ZIP_PATH');
		$extractTo = getenv('PLAYGROUND_UNZIP_EXTRACT_TO_PATH');
		$overwriteFiles =
			getenv('PLAYGROUND_UNZIP_OVERWRITE_FILES') === '1';
		$reportProgress =
			getenv('PLAYGROUND_UNZIP_REPORT_PROGRESS') === '1';
		$filesInterval =
			intval(getenv('PLAYGROUND_UNZIP_FILES_INTERVAL'));
		$uncompressedBytesInterval = intval(
			getenv('PLAYGROUND_UNZIP_UNCOMPRESSED_BYTES_INTERVAL')
		);
		$linePrefix = getenv('PLAYGROUND_UNZIP_LINE_PREFIX');

		if (!is_dir($extractTo)) {
			mkdir($extractTo, 0777, true);
		}
		$zip = new ZipArchive;
		$res = $zip->open($zipPath);
		if ($res !== TRUE) {
			$fileSize = file_exists($zipPath) ? filesize($zipPath) : 'unknown';
			throw new Exception(
				"Could not unzip file. Error code: " . $res .
				". File size: " . $fileSize . " bytes."
			);
		}

		try {
			$totalFiles = 0;
			$totalUncompressedBytes = 0;
			if ($reportProgress) {
				for ($i = 0; $i < $zip->numFiles; $i++) {
					$stat = $zip->statIndex($i);
					if ($stat === false) {
						throw new Exception(
							"Could not inspect ZIP entry " . $i . "."
						);
					}
					if (substr($stat['name'], -1) !== '/') {
						$totalFiles++;
						$totalUncompressedBytes += $stat['size'];
					}
				}
			}

			// Keep one extraction path for all callers. Progress reporting only
			// adds the totals scan above and emits an update between batches.
			$filesProcessed = 0;
			$uncompressedBytesProcessed = 0;
			$filesSinceUpdate = 0;
			$uncompressedBytesSinceUpdate = 0;
			$lastProgressYieldAt = 0;
			$entriesToExtract = array();
			for ($i = 0; $i < $zip->numFiles; $i++) {
				$stat = $zip->statIndex($i);
				if ($stat === false) {
					throw new Exception(
						"Could not inspect ZIP entry " . $i . "."
					);
				}
				$filename = $stat['name'];
				$isDirectory = substr($filename, -1) === '/';
				$extractFilePath =
					rtrim($extractTo, '/') . '/' . $filename;
				// Leave existing paths out when $overwriteFiles is false.
				if ($overwriteFiles || !file_exists($extractFilePath)) {
					$entriesToExtract[] = $filename;
				}
				if ($isDirectory) {
					continue;
				}

				$filesProcessed++;
				$uncompressedBytesProcessed += $stat['size'];
				$filesSinceUpdate++;
				$uncompressedBytesSinceUpdate += $stat['size'];
				if (
					$filesSinceUpdate >= $filesInterval ||
					$uncompressedBytesSinceUpdate >=
						$uncompressedBytesInterval
				) {
					extractZipBatch($zip, $extractTo, $entriesToExtract);
					if ($reportProgress) {
						reportUnzipProgress(
							$linePrefix,
							$filesProcessed,
							$totalFiles,
							$uncompressedBytesProcessed,
							$totalUncompressedBytes,
							$lastProgressYieldAt
						);
					}
					$filesSinceUpdate = 0;
					$uncompressedBytesSinceUpdate = 0;
				}
			}
			extractZipBatch($zip, $extractTo, $entriesToExtract);
			if (
				$reportProgress &&
				($filesSinceUpdate > 0 ||
					$uncompressedBytesSinceUpdate > 0 ||
					$totalFiles === 0)
			) {
				reportUnzipProgress(
					$linePrefix,
					$filesProcessed,
					$totalFiles,
					$uncompressedBytesProcessed,
					$totalUncompressedBytes,
					$lastProgressYieldAt
				);
			}
		} catch (Exception $e) {
			// PHP 5.2 does not support finally.
			$zip->close();
			throw $e;
		}
		$zip->close();
		chmod($extractTo, 0777);

		/**
		 * Extracts and clears the queued ZIP entries.
		 *
		 * @param ZipArchive $zip       Open archive containing the entries.
		 * @param string     $extractTo Destination directory.
		 * @param array      $entries   Entry names to extract.
		 * @return void
		 * @throws Exception When ZipArchive cannot extract the queued entries.
		 */
		function extractZipBatch($zip, $extractTo, &$entries)
		{
			if (count($entries) === 0) {
				return;
			}
			if (!$zip->extractTo($extractTo, $entries)) {
				throw new Exception("Could not extract ZIP entries.");
			}
			$entries = array();
		}

		/**
		 * Writes and flushes one prefixed JSON progress record.
		 *
		 * @param string $linePrefix                Progress record prefix.
		 * @param int    $filesProcessed             Files processed so far.
		 * @param int    $totalFiles                 Total files in the archive.
		 * @param int    $uncompressedBytesProcessed Bytes processed so far.
		 * @param int    $totalUncompressedBytes     Total uncompressed bytes.
		 * @param float  $lastProgressYieldAt        Last event-loop yield time.
		 * @return void
		 */
		function reportUnzipProgress(
			$linePrefix,
			$filesProcessed,
			$totalFiles,
			$uncompressedBytesProcessed,
			$totalUncompressedBytes,
			&$lastProgressYieldAt
		) {
			$now = microtime(true);
			// Limit event-loop yields to keep large imports fast.
			$shouldYield =
				$lastProgressYieldAt === 0 ||
				$filesProcessed === $totalFiles ||
				$now - $lastProgressYieldAt >= 0.05;
			echo $linePrefix . json_encode(array(
				'filesProcessed' => $filesProcessed,
				'totalFiles' => $totalFiles,
				'uncompressedBytesProcessed' => $uncompressedBytesProcessed,
				'totalUncompressedBytes' => $totalUncompressedBytes,
			)) . "\\n";
			flush();
			// PHP 5.2's Asyncify build cannot suspend from a nested function call.
			if ($shouldYield && PHP_MAJOR_VERSION >= 7) {
				// PHP runs synchronously inside the worker. Yield so stdout can cross
				// the worker boundary before extraction finishes.
				usleep(0);
				$lastProgressYieldAt = microtime(true);
			}
		}
		`,
      env: {
        PLAYGROUND_UNZIP_ZIP_PATH: t,
        PLAYGROUND_UNZIP_EXTRACT_TO_PATH: s,
        PLAYGROUND_UNZIP_OVERWRITE_FILES: i ? "1" : "0",
        PLAYGROUND_UNZIP_REPORT_PROGRESS: o ? "1" : "0",
        PLAYGROUND_UNZIP_FILES_INTERVAL: String(
          wd
        ),
        PLAYGROUND_UNZIP_UNCOMPRESSED_BYTES_INTERVAL: String(
          bd
        ),
        PLAYGROUND_UNZIP_LINE_PREFIX: Ln
      }
    };
    o ? await vd(e, p, o) : await e.run(p);
  } finally {
    if (r)
      try {
        await e.fileExists(n) && await e.unlink(n);
      } catch {
      }
  }
};
async function vd(e, t, s) {
  const i = await e.runStream(t), o = i.stderrText, n = i.stdout.getReader(), r = new TextDecoder();
  let l = "", p;
  const c = (g) => {
    if (g.startsWith(Ln))
      try {
        s(
          JSON.parse(
            g.slice(Ln.length)
          )
        );
      } catch (w) {
        p ?? (p = w);
      }
  };
  try {
    for (; ; ) {
      const { done: g, value: w } = await n.read();
      l += r.decode(w, { stream: !g });
      let O = l.indexOf(`
`);
      for (; O !== -1; )
        c(l.slice(0, O)), l = l.slice(O + 1), O = l.indexOf(`
`);
      if (g)
        break;
    }
  } finally {
    n.releaseLock();
  }
  l && c(l);
  const [f, u] = await Promise.all([
    i.exitCode,
    o
  ]);
  if (f !== 0)
    throw new Error(
      u.trim() || `Could not unzip file. PHP exited with code ${f}.`
    );
  if (p)
    throw p;
}
const Pd = "@playground-managed";
new TextDecoder();
const cl = `<?php

/**
 * Transforms the "wp-config.php" file.
 *
 * This parses the "wp-config.php" file contents into a token array and provides
 * methods to modify it and serialize it back to a string with the modifications.
 */
class WP_Config_Transformer {
	/**
	 * The tokens of the wp-config.php file.
	 *
	 * @var array<array|string>
	 */
	private $tokens;

	/**
	 * Constructor.
	 *
	 * @param string $content The contents of the wp-config.php file.
	 */
	public function __construct( string $content ) {
		$this->tokens = token_get_all( $content );

		// Check if the file is a valid PHP file.
		$is_valid_php_file = false;
		foreach ( $this->tokens as $token ) {
			if ( is_array( $token ) && T_OPEN_TAG === $token[0] ) {
				$is_valid_php_file = true;
				break;
			}
		}
		if ( ! $is_valid_php_file ) {
			throw new Exception( "The 'wp-config.php' file is not a valid PHP file." );
		}
	}

	/**
	 * Create a new config transformer instance from a file.
	 *
	 * @param string $path The path to the wp-config.php file.
	 * @return self        The new config transformer instance.
	 */
	public static function from_file( string $path ): self {
		if ( ! is_file( $path ) ) {
			throw new Exception( sprintf( "The '%s' file does not exist.", $path ) );
		}
		return new self( file_get_contents( $path ) );
	}

	/**
	 * Get the transformed wp-config.php file contents.
	 *
	 * @return string The transformed wp-config.php file contents.
	 */
	public function to_string(): string {
		$output = '';
		foreach ( $this->tokens as $token ) {
			$output .= is_array( $token ) ? $token[1] : $token;
		}
		return $output;
	}

	/**
	 * Save the transformed wp-config.php file contents to a file.
	 *
	 * @param string $path The path to the wp-config.php file.
	 */
	public function to_file( string $path ): void {
		$result = file_put_contents( $path, $this->to_string() );
		if ( false === $result ) {
			throw new Exception( sprintf( "Failed to write to the '%s' file.", $path ) );
		}
	}

	/**
	 * Check if a constant is defined in the wp-config.php file.
	 *
	 * @param  string $name The name of the constant.
	 * @return bool         True if the constant is defined, false otherwise.
	 */
	public function constant_exists( string $name ): bool {
		foreach ( $this->tokens as $i => $token ) {
			$is_string_token = is_array( $token ) && T_STRING === $token[0];
			if ( $is_string_token && 'define' === strtolower( $token[1] ) ) {
				$args       = $this->collect_function_call_argument_locations( $i );
				$const_name = $this->evaluate_constant_name(
					array_slice( $this->tokens, $args[0][0], $args[0][1] )
				);
				if ( $name === $const_name ) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Define a constant in the wp-config.php file.
	 *
	 * @param string $name  The name of the constant.
	 * @param mixed  $value The value of the constant.
	 */
	public function define_constant( string $name, $value ): void {
		// Tokenize the new constant value for insertion in the tokens array.
		$definition_tokens = token_get_all(
			sprintf(
				"<?php define( %s, %s );\\n",
				var_export( $name, true ),
				var_export( $value, true )
			)
		);

		// Full constant definition statement, e.g.: define( 'WP_DEBUG', true );\\n
		$define_tokens = array_slice( $definition_tokens, 1 );

		// The value of the constant, e.g.: "my-database-name"
		$value_tokens = array_slice( $definition_tokens, 7, -4 );

		// Collect all locations where the constant value needs to be updated.
		$updates = array();
		foreach ( $this->tokens as $i => $token ) {
			$is_string_token = is_array( $token ) && T_STRING === $token[0];
			if ( $is_string_token && 'define' === strtolower( $token[1] ) ) {
				$args       = $this->collect_function_call_argument_locations( $i );
				$const_name = $this->evaluate_constant_name(
					array_slice( $this->tokens, $args[0][0], $args[0][1] )
				);

				if ( $name === $const_name ) {
					$updates[] = $args[1];
				}
			}
		}

		// Modify the token array to define the constant. Apply updates in reverse
		// order, so splices at earlier positions don't shift indices after them.
		for ( $i = count( $updates ) - 1; $i >= 0; $i -= 1 ) {
			list ( $value_start, $value_length ) = $updates[ $i ];
			array_splice( $this->tokens, $value_start, $value_length, $value_tokens );
		}

		// If it's a new constant, inject it at the anchor location.
		if ( 0 === count( $updates ) ) {
			$anchor = $this->get_new_constant_location();
			array_splice( $this->tokens, $anchor, 0, $define_tokens );

			/*
			 * Ensure at least one newline (one "\\n") before the new constant.
			 * This must be done after inserting the constant definition in order
			 * to avoid shifting the anchor location when a new token is inserted.
			 */
			$this->ensure_newlines( $anchor - 1, 1 );
		}
	}

	/**
	 * Define multiple constants in the wp-config.php file.
	 *
	 * @param array<string, mixed> $constants An array of name-value pairs of constants to define.
	 */
	public function define_constants( array $constants ): void {
		foreach ( $constants as $name => $value ) {
			$this->define_constant( $name, $value );
		}
	}

	/**
	 * Inject code block into the wp-config.php file.
	 *
	 * @param string $code The code to inject.
	 */
	public function inject_code_block( string $code ): void {
		// Tokenize the injected code for insertion in the token array.
		$tokens      = token_get_all( sprintf( '<?php %s', trim( $code ) ) );
		$code_tokens = array_slice( $tokens, 1 );

		// Inject the code at the anchor location.
		$anchor = $this->get_injected_code_location();
		array_splice( $this->tokens, $anchor, 0, $code_tokens );

		/*
		 * Ensure empty line before and after the code block (at least two "\\n").
		 * This must be done after inserting the injected code, and the location
		 * AFTER must be updated prior to the location BEFORE, in order to avoid
		 * shifting the anchor location when a new token is inserted.
		 */
		$this->ensure_newlines( $anchor + count( $code_tokens ), 2 );
		$this->ensure_newlines( $anchor - 1, 2 );
	}

	/**
	 * Remove code block defined by two comment fragments from the wp-config.php file.
	 *
	 * @param string $from_comment_fragment A comment fragment from which to remove the code.
	 * @param string $to_comment_fragment   A comment fragment to which to remove the code.
	 */
	public function remove_code_block( string $from_comment_fragment, string $to_comment_fragment ): void {
		$start = $this->find_first_token_location( T_COMMENT, $from_comment_fragment );
		$end   = $this->find_first_token_location( T_COMMENT, $to_comment_fragment );
		if ( null === $start || null === $end ) {
			return;
		}

		// Remove the code, including the comment fragments.
		array_splice( $this->tokens, $start, $end - $start + 1 );

		// If previous and next tokens are whitespace, merge them.
		$prev = $this->tokens[ $start - 1 ];
		$next = $this->tokens[ $start ] ?? null;
		if (
			is_array( $prev ) && T_WHITESPACE === $prev[0]
			&& is_array( $next ) && T_WHITESPACE === $next[0]
		) {
			$this->tokens[ $start - 1 ][1] = $prev[1] . $next[1];
			array_splice( $this->tokens, $start, 1 );
		}

		// Remove up to two empty lines (before & after), keeping at least one.
		$token = $this->tokens[ $start - 1 ];
		if ( is_array( $token ) && T_WHITESPACE === $token[0] ) {
			$newlines = substr_count( $token[1], "\\n" );
			if ( $newlines > 2 ) {
				$limit = min( $newlines - 2, 4 );
				$value = $token[1];
				for ( $i = 0; $limit > 0; $i += 1 ) {
					if ( "\\n" === $value[ $i ] ) {
						$value  = substr_replace( $value, '', $i, 1 );
						$limit -= 1;
					}
				}
				$this->tokens[ $start - 1 ][1] = $value;
			}
		}
	}

	/**
	 * Parse arguments of a function call and collect their locations.
	 *
	 * @param  int $start             The location of the first token of the function call.
	 * @return array<array<int, int>> The arguments of the function call.
	 */
	private function collect_function_call_argument_locations( int $start ): array {
		// Find location of the opening parenthesis after the function name.
		$i = $start;
		while ( '(' !== $this->tokens[ $i ] ) {
			$i += 1;
		}
		$i += 1;

		// Collect all function call argument locations.
		$args         = array();
		$arg_start    = $this->skip_whitespace_and_comments( $i );
		$parens_level = 0;
		for ( $i = $arg_start; $i < count( $this->tokens ); $i += 1 ) {
			// Skip whitespace and comments, but preserve the index of the last
			// non-whitespace token to calculate the exact argument boundaries.
			$prev_i = $i;
			$i      = $this->skip_whitespace_and_comments( $i );
			$token  = $this->tokens[ $i ];

			if ( 0 === $parens_level && ( ',' === $token || ')' === $token ) ) {
				$args[] = array( $arg_start, $prev_i - $arg_start );
				if ( ',' === $token ) {
					// Start of the next argument.
					$arg_start = $this->skip_whitespace_and_comments( $i + 1 );
					$i         = $arg_start;
				} else {
					// End of the argument list.
					break;
				}
			} elseif ( '(' === $token || '[' === $token || '{' === $token ) {
				$parens_level += 1;
			} elseif ( ')' === $token || ']' === $token || '}' === $token ) {
				$parens_level -= 1;
			}
		}
		return $args;
	}

	/**
	 * Evaluate the constant name value from its tokens.
	 *
	 * @param  array $name_tokens The tokens containing the constant name.
	 * @return string|null        The evaluated constant name.
	 */
	private function evaluate_constant_name( array $name_tokens ): ?string {
		// Decide whether the array represents a constant name or an expression.
		$name_token = null;
		foreach ( $name_tokens as $token ) {
			if ( $this->is_whitespace( $token ) ) {
				continue;
			}
			if ( is_array( $token ) ) {
				if ( T_STRING === $token[0] || T_CONSTANT_ENCAPSED_STRING === $token[0] ) {
					$name_token = $token;
				} else {
					return null;
				}
			} elseif ( '(' !== $token && ')' !== $token ) {
				return null;
			}
		}

		if ( null === $name_token ) {
			return null;
		}

		// Get the constant name value.
		return eval( 'return ' . $name_token[1] . ';' );
	}

	/**
	 * Skip whitespace and comment tokens and return the location of the first
	 * non-whitespace and non-comment token after the specified start location.
	 *
	 * @param  int $start The start location in the token array.
	 * @return int        The location of the first non-whitespace and non-comment token.
	 */
	private function skip_whitespace_and_comments( int $start ): int {
		for ( $i = $start; $i < count( $this->tokens ); $i += 1 ) {
			if ( $this->is_whitespace( $this->tokens[ $i ] ) ) {
				continue;
			}
			break;
		}
		return $i;
	}

	/**
	 * Ensure minimum number of newlines are present at the given index.
	 *
	 * @param int $index The index of the token to ensure newlines.
	 * @param int $count The number of newlines that should be present.
	 */
	private function ensure_newlines( int $index, int $count ): void {
		$token = $this->tokens[ $index ] ?? null;
		if ( is_array( $token ) && ( T_WHITESPACE === $token[0] || T_OPEN_TAG === $token[0] ) ) {
			$newlines = substr_count( $token[1], "\\n" );
			if ( $newlines < $count ) {
				$this->tokens[ $index ][1] .= str_repeat( "\\n", $count - $newlines );
			}
		} else {
			$new_token = array( T_WHITESPACE, str_repeat( "\\n", $count ) );
			array_splice( $this->tokens, $index, 0, array( $new_token ) );
		}
	}

	/**
	 * Get the location to inject new constant definitions in the token array.
	 *
	 * @return int The location for new constant definitions in the token array.
	 */
	private function get_new_constant_location(): int {
		// First try to find the "That's all, stop editing!" comment.
		$anchor = $this->find_first_token_location( T_COMMENT, "That's all, stop editing!" );
		if ( null !== $anchor ) {
			return $anchor;
		}

		// If not found, try the "Absolute path to the WordPress directory." doc comment.
		$anchor = $this->find_first_token_location( T_DOC_COMMENT, 'Absolute path to the WordPress directory.' );
		if ( null !== $anchor ) {
			return $anchor;
		}

		// If not found, try the "Sets up WordPress vars and included files." doc comment.
		$anchor = $this->find_first_token_location( T_DOC_COMMENT, 'Sets up WordPress vars and included files.' );
		if ( null !== $anchor ) {
			return $anchor;
		}

		// If not found, try "require_once ABSPATH . 'wp-settings.php';".
		$anchor = $this->find_first_token_location( T_REQUIRE_ONCE );
		if ( null !== $anchor ) {
			return $anchor;
		}

		// If not found, fall back to the PHP opening tag.
		$open_tag_anchor = $this->find_first_token_location( T_OPEN_TAG );
		if ( null !== $open_tag_anchor ) {
			return $open_tag_anchor + 1;
		}

		// If we still don't have an anchor, the file is not a valid PHP file.
		throw new Exception( "The 'wp-config.php' file is not a valid PHP file." );
	}

	/**
	 * Get the location to inject new code in the token array.
	 *
	 * @return int The location for injected code in the token array.
	 */
	private function get_injected_code_location(): int {
		// First try to find the "/** Sets up WordPress vars and included files. */" comment.
		$anchor = $this->find_first_token_location( T_DOC_COMMENT, 'Sets up WordPress vars and included files.' );
		if ( null !== $anchor ) {
			return $anchor;
		}

		// If not found, try "require_once ABSPATH . 'wp-settings.php';".
		$anchor = $this->find_require_wp_settings_location();
		if ( null !== $anchor ) {
			return $anchor;
		}

		// If not found, fall back to the PHP opening tag.
		$open_tag_anchor = $this->find_first_token_location( T_OPEN_TAG );
		if ( null !== $open_tag_anchor ) {
			return $open_tag_anchor + 1;
		}

		// If we still don't have an anchor, the file is not a valid PHP file.
		throw new Exception( "The 'wp-config.php' file is not a valid PHP file." );
	}

	/**
	 * Find location of the "wp-settings.php" require statement in the token array.
	 *
	 * This method searches for the following statement:
	 *
	 *   require_once ABSPATH . 'wp-settings.php';
	 *
	 * @return int|null The location of the require statement.
	 */
	private function find_require_wp_settings_location(): ?int {
		$require_anchor = $this->find_first_token_location( T_REQUIRE_ONCE );
		if ( null === $require_anchor ) {
			return null;
		}

		$abspath = $this->tokens[ $require_anchor + 2 ] ?? null;
		$path    = $this->tokens[ $require_anchor + 6 ] ?? null;
		if (
			( is_array( $abspath ) && 'ABSPATH' === $abspath[1] )
			&& ( is_array( $path ) && "'wp-settings.php'" === $path[1] )
		) {
			return $require_anchor;
		}
		return null;
	}

	/**
	 * Find location of the first token of a given type in the token array.
	 *
	 * @param  int    $type   The type of the token.
	 * @param  string $search Optional. A search string to match against the token content.
	 * @return int|null       The location of the first token.
	 */
	private function find_first_token_location( int $type, ?string $search = null ): ?int {
		foreach ( $this->tokens as $i => $token ) {
			if ( is_array( $token ) && $type === $token[0] ) {
				if ( null === $search || false !== strpos( $token[1], $search ) ) {
					return $i;
				}
			}
		}
		return null;
	}

	/**
	 * Check if a token is whitespace or a comment.
	 *
	 * @param  array|string $token The token to check.
	 * @return bool                True if the token is whitespace or a comment.
	 */
	private function is_whitespace( $token ): bool {
		return is_array( $token )
			&& ( T_WHITESPACE === $token[0] || T_COMMENT === $token[0] || T_DOC_COMMENT === $token[0] );
	}
}
`;
async function xd(e, t) {
  const s = ne(t, "wp-config.php");
  !e.fileExists(s) && e.fileExists(ne(t, "wp-config-sample.php")) && await e.writeFile(
    s,
    await e.readFileAsBuffer(
      ne(t, "wp-config-sample.php")
    )
  ), e.fileExists(s) && await kd(e, s, {
    DB_NAME: "wordpress"
  });
}
async function $d(e, t, s) {
  const i = Ur({ wpConfigPath: t, constants: s });
  if ((await e.run({
    code: `${cl}
		$wp_config_path = ${i.wpConfigPath};
		$transformer = WP_Config_Transformer::from_file($wp_config_path);
		$transformer->define_constants(${i.constants});
		$transformer->to_file($wp_config_path);
		`
  })).errors.length > 0)
    throw new Error("Failed to rewrite constants in wp-config.php.");
}
async function kd(e, t, s) {
  const i = Object.keys(s), o = Ur({ wpConfigPath: t, constantNames: i }), n = await e.run({
    code: `${cl}
		$transformer = WP_Config_Transformer::from_file(${o.wpConfigPath});
		$missing = [];
		foreach (${o.constantNames} as $name) {
			if (!$transformer->constant_exists($name)) {
				$missing[] = $name;
			}
		}
		echo json_encode($missing);
		`
  });
  if (n.errors.length > 0)
    throw new Error("Failed to check wp-config.php for constants.");
  let r;
  try {
    r = JSON.parse(n.text);
  } catch {
    throw new Error(
      `Failed to parse wp-config.php constant check output: ${n.text}`
    );
  }
  for (const l of r)
    await e.defineConstant(l, s[l]);
}
const Ed = "https://api.wordpress.org/core/stable-check/1.0/";
let So;
async function Od() {
  So ?? (So = pl(globalThis.fetch));
  const e = await So(
    Ed
  );
  if (!e.ok)
    throw new Error(
      "Could not load the WordPress release catalog: " + `${e.status} ${e.statusText}`.trim()
    );
  const t = await e.json();
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error("The WordPress release catalog returned invalid data.");
  return Object.keys(t);
}
const Td = pl(fetch), Sd = "https://github.com/WordPress/WordPress/archive/refs/heads/master.zip";
async function Ad(e = "latest") {
  if (e === null)
    e = "latest";
  else if (e.startsWith("https://") || e.startsWith("http://")) {
    const i = await crypto.subtle.digest(
      "SHA-1",
      new TextEncoder().encode(e)
    ), o = Array.from(new Uint8Array(i)).map((n) => n.toString(16).padStart(2, "0")).join("");
    return {
      releaseUrl: e,
      version: "custom-" + o.substring(0, 8),
      source: "inferred"
    };
  } else if (e === "trunk" || e === "nightly") {
    const i = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    return {
      releaseUrl: `${Sd}?ts=${i}`,
      version: "trunk",
      source: "inferred"
    };
  }
  let s = await (await Td(
    "https://api.wordpress.org/core/version-check/1.7/?channel=beta"
  )).json();
  s = s.offers.filter(
    (i) => i.response === "autoupdate"
  );
  for (const i of s) {
    if (e === "beta" && (i.version.includes("beta") || i.version.includes("RC")))
      return {
        releaseUrl: i.download,
        version: i.version,
        source: "api"
      };
    if (e === "latest" && !i.version.includes("beta") && !i.version.includes("RC"))
      return {
        releaseUrl: i.download,
        version: i.version,
        source: "api"
      };
    if (i.version.substring(0, e.length) === e)
      return {
        releaseUrl: i.download,
        version: i.version,
        source: "api"
      };
  }
  return e.match(/^\d+\.\d+\.0$/) && (e = e.split(".").slice(0, 2).join(".")), {
    releaseUrl: `https://wordpress.org/wordpress-${e}.zip`,
    version: e,
    source: "inferred"
  };
}
const ei = async (e, { consts: t, method: s = "define-before-run" }) => {
  switch (s) {
    case "define-before-run":
      await Rd(e, t);
      break;
    case "rewrite-wp-config": {
      const i = await e.documentRoot, o = ne(i, "/wp-config.php");
      await $d(e, o, t);
      break;
    }
    default:
      throw new Error(`Invalid method: ${s}`);
  }
};
async function Rd(e, t) {
  for (const s in t)
    await e.defineConstant(s, t[s]);
}
const fl = async (e, { options: t }) => {
  const s = await e.documentRoot;
  await e.run({
    code: `<?php
		include ${Ce(s)} . '/wp-load.php';
		$site_options = ${Ce(t)};
		$flush_rewrite_rules = (
			is_array($site_options) &&
			array_key_exists('permalink_structure', $site_options)
		) || (
			is_object($site_options) &&
			property_exists($site_options, 'permalink_structure')
		);
		foreach($site_options as $name => $value) {
			update_option($name, $value);
		}
		if ($flush_rewrite_rules) {
			flush_rewrite_rules(false);
		}
		echo "Success";
		`
  });
}, Ld = async (e, { meta: t, userId: s }) => {
  const i = await e.documentRoot;
  await e.run({
    code: `<?php
		include ${Ce(i)} . '/wp-load.php';
		$meta = ${Ce(t)};
		foreach($meta as $name => $value) {
			update_user_meta(${Ce(s)}, $name, $value);
		}
		`
  });
}, Cs = "/tmp/wp-cli.phar", ul = {
  resource: "url",
  /**
   * Use compression for downloading the wp-cli.phar file.
   * The official release, hosted at raw.githubusercontent.com, is ~7MB
   * and the transfer is uncompressed. playground.wordpress.net supports
   * transfer compression and only transmits ~1.4MB.
   *
   * @TODO: minify the wp-cli.phar file. It can be as small as 1MB when all the
   *        whitespaces and are removed, and even 500KB when libraries
   *        like the JavaScript parser or Composer are removed.
   */
  url: "https://playground.wordpress.net/wp-cli.phar"
}, fn = "This WP-CLI command tried to read from STDIN, but the wp-cli Blueprint step does not support interactive input. Provide all required arguments.", Ao = "/tmp/playground-wp-cli-overrides.php", Cd = `<?php
if ( ! class_exists( 'WP_CLI' ) ) {
	return;
}

WP_CLI::add_command(
	'db query',
	function ( $args, $assoc_args ) {
		global $wpdb;

		$sql = isset( $args[0] ) ? trim( $args[0] ) : '';
		if ( '' === $sql ) {
			WP_CLI::error(
				'Pass the SQL query as an argument. Reading it from STDIN ' .
				'is not supported in Playground.'
			);
		}

		$suppressed = $wpdb->suppress_errors( true );
		$rows       = $wpdb->get_results( $sql, ARRAY_A );
		$wpdb->suppress_errors( $suppressed );
		if ( '' !== $wpdb->last_error ) {
			// The SQLite driver reports errors as an HTML debug dump. Surface
			// only the underlying database error message.
			$error = $wpdb->last_error;
			if ( preg_match( '/class="error_message"[^>]*>(.*?)<\\/div>/s', $error, $m ) ) {
				$error = $m[1];
			}
			WP_CLI::error( trim( wp_strip_all_tags( $error ) ) );
		}

		if ( ! empty( $rows ) ) {
			WP_CLI\\Utils\\format_items( 'table', $rows, array_keys( $rows[0] ) );
		} elseif ( ! preg_match( '/^(SELECT|SHOW|DESCRIBE|DESC|EXPLAIN|PRAGMA)\\b/i', $sql ) ) {
			WP_CLI::success(
				sprintf( 'Query OK, %d rows affected.', $wpdb->rows_affected )
			);
		}
	},
	array(
		'shortdesc' => 'Executes a query against the database.',
		'synopsis'  => array(
			array(
				'type'     => 'positional',
				'name'     => 'sql',
				'optional' => false,
			),
		),
		'when'      => 'after_wp_load',
	)
);
`, ti = async (e, t = Cs) => {
  if (!await e.fileExists(t))
    throw new Error(`wp-cli.phar not found at ${t}.
			You can enable wp-cli support by adding "wp-cli" to the list of extra libraries in your blueprint as follows:
			{
				"extraLibraries": [ "wp-cli" ]
			}
			Read more about it in the documentation.
			https://wordpress.github.io/wordpress-playground/blueprints/data-format#extra-libraries`);
}, dl = async (e, { command: t, wpCliPath: s = Cs }) => {
  await ti(e, s);
  let i;
  if (typeof t == "string" ? (t = t.trim(), i = Nd(t)) : i = t, i.shift() !== "wp")
    throw new Error('The first argument must be "wp".');
  let n = !1;
  const r = i.map((c) => c.startsWith("wordpress/") ? (n = !0, `/${c}`) : c);
  n && ue.error(
    `
The wp-cli step in your Blueprint refers to a relative path.

Playground recently changed the working directory from '/' to '/wordpress' to better mimic 
how real web servers work. This means relative paths that used to work may no longer 
point to the correct location.

Playground automatically updated the path for you, but at one point path rewriting will be removed. Please
update your code to use an absolute path instead:

Instead of:

        {
            "step": "wp-cli",
            "command": "wp media import wordpress/wp-content/Select-storage-method.png --post_id=4 --title='Select your storage method' --featured_image"
        }

Use:

        {
            "step": "wp-cli",
            "command": "wp media import /wordpress/wp-content/Select-storage-method.png --post_id=4 --title='Select your storage method' --featured_image"
        }

This will ensure your code works reliably regardless of the current working directory.
        `.trim()
  );
  const l = await e.documentRoot;
  await e.writeFile("/tmp/stdout", ""), await e.writeFile("/tmp/stderr", ""), await e.writeFile(Ao, Cd), await e.writeFile(
    ne(l, "run-cli.php"),
    `<?php
		// Set up the environment to emulate a shell script
		// call.

		// Set SHELL_PIPE to 0 to ensure WP-CLI formats
		// the output as ASCII tables.
		// @see https://github.com/wp-cli/wp-cli/issues/1102
		putenv( 'SHELL_PIPE=0' );

		// Set the argv global.
		$GLOBALS['argv'] = array_merge([
		  "/tmp/wp-cli.phar",
		  "--path=${l}",
		  "--require=${Ao}"
		], ${Ce(r)});

		// Fail before a command can treat missing interactive input as an empty
		// value. The Blueprint step has no way to provide STDIN.
		class Playground_No_Stdin_Stream {
			public $context;

			public function stream_open($path, $mode, $options, &$opened_path) {
				return true;
			}

			public function stream_eof() {
				throw new RuntimeException(
					${Ce(fn)}
				);
			}

			public function stream_read($count) {
				return $this->stream_eof();
			}

			public function stream_stat() {
				return [];
			}
		}

		$playground_no_stdin_scheme =
			'playground-no-stdin-' . str_replace('.', '-', uniqid('', true));
		if (
			!stream_wrapper_register(
				$playground_no_stdin_scheme,
				Playground_No_Stdin_Stream::class
			)
		) {
			throw new RuntimeException(${Ce(fn)});
		}
		$playground_no_stdin = fopen(
			$playground_no_stdin_scheme . '://input',
			'rb'
		);
		if (!is_resource($playground_no_stdin)) {
			throw new RuntimeException(${Ce(fn)});
		}
		define('STDIN', $playground_no_stdin);

		// Provide stdout and stderr streams outside of the CLI SAPI.
		define('STDOUT', fopen('php://stdout', 'wb'));
		define('STDERR', fopen('php://stderr', 'wb'));

		require( ${Ce(s)} );
		`
  );
  const p = await e.run({
    scriptPath: ne(l, "run-cli.php")
  });
  if (p.exitCode !== 0)
    throw new Error(p.errors);
  return p;
};
function Nd(e) {
  let i = 0, o = "";
  const n = [];
  let r = "";
  for (let l = 0; l < e.length; l++) {
    const p = e[l];
    i === 0 ? p === '"' || p === "'" ? (i = 1, o = p) : p.match(/\s/) ? (r && n.push(r), r = "") : r += p : i === 1 && (p === "\\" ? (l++, r += e[l]) : p === o ? (i = 0, o = "") : r += p);
  }
  return r && n.push(r), n;
}
const Id = async (e, { wpCliPath: t }) => {
  await ti(e, t), await ei(e, {
    consts: {
      WP_ALLOW_MULTISITE: 1
    }
  });
  const s = new URL(await e.absoluteUrl);
  if (s.port !== "") {
    let c = `The current host is ${s.host}, but WordPress multisites do not support custom ports.`;
    throw s.hostname === "localhost" && (c += " For development, you can set up a playground.test domain using the instructions at https://wordpress.github.io/wordpress-playground/contributing/code."), new Error(c);
  }
  const i = s.pathname.replace(/\/$/, "") + "/", o = `${s.protocol}//${s.hostname}${i}`;
  await fl(e, {
    options: {
      siteurl: o,
      home: o
    }
  }), await dl(e, {
    command: `wp core multisite-convert --base="${i}"`
  });
  const r = `${await e.documentRoot}/wp-config.php`, l = await e.readFileAsText(r);
  let p = l;
  l.includes("$_SERVER['HTTP_HOST']") || (p = l.replace(
    /^<\?php\s*/i,
    `<?php
$_SERVER['HTTP_HOST'] = ${Ce(s.hostname)};
`
  )), await e.writeFile(r, p);
}, Fd = async (e, { fromPath: t, toPath: s }) => {
  (!t.startsWith("/") || !s.startsWith("/")) && ue.error(
    `
The cp() step in your Blueprint refers to a relative path.

Playground recently changed the working directory from '/' to '/wordpress' to better mimic 
how real web servers work. This means relative paths that used to work may no longer 
point to the correct location.

Playground automatically updated the path for you, but at one point path rewriting will be removed. Please
update your code to use an absolute path instead:

Instead of:  cp({ fromPath: 'wordpress/wp-load.php', toPath: 'wordpress/wp-load.php' });
Use:         cp({ fromPath: '/wordpress/wp-load.php', toPath: '/wordpress/wp-load.php' });

This will ensure your code works reliably regardless of the current working directory.
		`.trim()
  ), t.startsWith("/") || (t = `/${t}`), s.startsWith("/") || (s = `/${s}`), await e.writeFile(
    s,
    await e.readFileAsBuffer(t)
  );
}, Dd = async (e, { fromPath: t, toPath: s }) => {
  (!t.startsWith("/") || !s.startsWith("/")) && ue.error(
    `
The mv() step in your Blueprint refers to a relative path.

Playground recently changed the working directory from '/' to '/wordpress' to better mimic 
how real web servers work. This means relative paths that used to work may no longer 
point to the correct location.

Playground automatically updated the path for you, but at one point path rewriting will be removed. Please
update your code to use an absolute path instead:

Instead of:  mv({ fromPath: 'wordpress/wp-load.php', toPath: 'wordpress/wp-load.php' });
Use:         mv({ fromPath: '/wordpress/wp-load.php', toPath: '/wordpress/wp-load.php' });

This will ensure your code works reliably regardless of the current working directory.
		`.trim()
  ), t.startsWith("/") || (t = `/${t}`), s.startsWith("/") || (s = `/${s}`), await e.mv(t, s);
}, Ud = async (e, { path: t }) => {
  t.startsWith("/") || ue.error(
    `
The mkdir() step in your Blueprint refers to a relative path.

Playground recently changed the working directory from '/' to '/wordpress' to better mimic 
how real web servers work. This means relative paths that used to work may no longer 
point to the correct location.

Playground automatically updated the path for you, but at one point path rewriting will be removed. Please
update your code to use an absolute path instead:

Instead of:  mkdir({ path: 'wordpress/my-new-folder' });
Use:         mkdir({ path: '/wordpress/my-new-folder' });

This will ensure your code works reliably regardless of the current working directory.
		`.trim()
  ), await e.mkdir(t);
}, jd = async (e, { path: t }) => {
  t.startsWith("/") || (ue.error(
    `
The rmdir() step in your Blueprint refers to a relative path.

Playground recently changed the working directory from '/' to '/wordpress' to better mimic 
how real web servers work. This means relative paths that used to work may no longer 
point to the correct location.

Playground automatically updated the path for you, but at one point path rewriting will be removed. Please
update your code to use an absolute path instead:

Instead of:  rmdir({ path: 'wordpress/wp-load.php' });
Use:         rmdir({ path: '/wordpress/wp-load.php' });

This will ensure your code works reliably regardless of the current working directory.
		`.trim()
  ), t = `/${t}`), await e.rmdir(t);
}, ri = async (e, { path: t, data: s }) => {
  s instanceof File && (s = new Uint8Array(await s.arrayBuffer())), t.startsWith("/") || (ue.error(
    `
The writeFile() step in your Blueprint refers to a relative path.

Playground recently changed the working directory from '/' to '/wordpress' to better mimic 
how real web servers work. This means relative paths that used to work may no longer 
point to the correct location.

Playground automatically updated the path for you, but at one point path rewriting will be removed. Please
update your code to use an absolute path instead:

Instead of:  writeFile({ path: 'wordpress/wp-load.php', data: '<?php echo "Hello World!"; ?>' });
Use:         writeFile({ path: '/wordpress/wp-load.php', data: '<?php echo "Hello World!"; ?>' });

This will ensure your code works reliably regardless of the current working directory.
		`.trim()
  ), t = `/${t}`), t.startsWith("/wordpress/wp-content/mu-plugins") && !await e.fileExists("/wordpress/wp-content/mu-plugins") && await e.mkdir("/wordpress/wp-content/mu-plugins"), await e.writeFile(t, s);
}, qd = async (e, { writeToPath: t, filesTree: s }) => {
  t.startsWith("/") || (ue.error(
    `
The writeFiles() step in your Blueprint refers to a relative path.

Playground recently changed the working directory from '/' to '/wordpress' to better mimic 
how real web servers work. This means relative paths that used to work may no longer
point to the correct location.

Playground automatically updated the path for you, but at one point path rewriting will be removed. Please
update your code to use an absolute path instead:

Instead of:  writeFiles({ writeToPath: 'wordpress/wp-content/plugins/my-plugin', filesTree: { name: 'style.css': 'a { color: red; }' });
Use:         writeFiles({ writeToPath: '/wordpress/wp-content/plugins/my-plugin', filesTree: { name: 'style.css': 'a { color: red; }' });

This will ensure your code works reliably regardless of the current working directory.
		`.trim()
  ), t = `/${t}`), await qn(e, t, s.files);
}, ml = async (e, { siteUrl: t }) => {
  await ei(e, {
    consts: {
      WP_HOME: t,
      WP_SITEURL: t
    }
  });
}, Wd = async (e, {
  file: t,
  fetchAttachments: s = !0,
  rewriteUrls: i = !0,
  urlMapping: o = {},
  importComments: n = !0,
  defaultAuthorUsername: r = "admin",
  authorsMode: l = "default-author",
  authorsMap: p = {},
  importUsers: c = !1
}, f) => {
  const u = r.trim() || "admin";
  await Md(e, t, f, {
    fetchAttachments: s,
    rewriteUrls: i,
    urlMapping: o,
    importComments: n,
    fallbackAuthorUsername: u,
    authorsMode: l,
    authorsMap: p,
    importUsers: c
  });
};
async function Md(e, t, s, i) {
  var o;
  (o = s == null ? void 0 : s.tracker) == null || o.setCaption("Importing content"), await ri(e, {
    path: "/tmp/import.wxr",
    data: t
  }), await e.run({
    $_SERVER: {
      /**
       * get_site_url() infers the protocol from $_SERVER['HTTPS'] instead of
       * using the stored siteurl option. The importer relies on that behavior
       * when rewriting links in the WXR payload, so we populate the flag here
       * just as the web request layer would.
       */
      HTTPS: (await e.absoluteUrl).startsWith("https://") ? "on" : ""
    },
    code: `<?php
	define('WP_LOAD_IMPORTERS', true);
	require 'wp-load.php';
	require 'wp-admin/includes/admin.php';

	/**
	 * Disable all kses filters to prevent content sanitization during import.
	 * It messes up Playground URL scheme by mangling transforming code such as:
	 *
	 *     <a href="/scope:kind-quiet-lake/index.php">Test</a>
	 *
	 * into:
	 *
	 *     <a href="kind-quiet-lake/index.php">Test</a>
	 */
	kses_remove_filters();

	// The WordPress importer assigns unmapped imported authors to the current
	// user, so set it to the requested fallback author before importing.
	$fallback_author_username = getenv('FALLBACK_AUTHOR_USERNAME');
	$fallback_author          = get_user_by('login', $fallback_author_username);
	if (!$fallback_author) {
		throw new Exception(
			sprintf('Could not find fallback WXR import author "%s".', $fallback_author_username)
		);
	}
	wp_set_current_user( $fallback_author->ID );

	$wp_import                  = new WP_Import();
	$import_data                = $wp_import->parse( getenv('IMPORT_FILE') );
	$authors_map                = json_decode(getenv('AUTHORS_MAP') ?: '{}', true);
	if (!is_array($authors_map)) {
		throw new Exception('Invalid WXR authors map payload.');
	}

	// Prepare the data to be used in process_author_mapping();
	$wp_import->get_authors_from_import( $import_data );
	$author_mapping_form = blueprint_prepare_wxr_author_mapping(
		$wp_import->authors,
		getenv('AUTHORS_MODE') ?: 'default-author',
		$authors_map,
		getenv('IMPORT_USERS') === 'true',
		(int) $fallback_author->ID
	);

	$url_mapping_payload = getenv('URL_MAPPING') ?: '{}';
	$url_mapping         = json_decode($url_mapping_payload, true);
	if (!is_array($url_mapping)) {
		throw new Exception(
			sprintf(
				'Invalid WXR URL mapping payload (%d bytes): %s.',
				strlen($url_mapping_payload),
				json_last_error_msg()
			)
		);
	}
	if (!empty($url_mapping) && getenv('REWRITE_URLS') === 'true') {
		add_filter('wp_import_post_data_raw', function($post) use ($url_mapping) {
			return blueprint_apply_wxr_url_mapping($post, $url_mapping);
		});
	}

	if (getenv('IMPORT_COMMENTS') === 'false') {
		add_filter('wp_import_post_comments', '__return_empty_array');
	}

	// We no longer need the original data, so unset to avoid using excess
	// memory.
	unset( $import_data );

	// Drive the import
	$wp_import->fetch_attachments = getenv('FETCH_ATTACHMENTS') === 'true';

	$_GET  = array(
		'import' => 'wordpress',
		'step'   => 2,
	);
	$_POST = array(
		'imported_authors'  => $author_mapping_form['imported_authors'],
		'user_map'          => $author_mapping_form['user_map'],
		'user_new'          => $author_mapping_form['user_new'],
		'fetch_attachments' => $wp_import->fetch_attachments,
	);

	$GLOBALS['wpcli_import_current_file'] = basename( $file );
	$wp_import->import( getenv('IMPORT_FILE'), [
		'rewrite_urls' => getenv('REWRITE_URLS') === 'true',
	] );

	/**
	 * Builds the importer form payload for WXR author assignment.
	 */
	function blueprint_prepare_wxr_author_mapping(
		array $authors,
		string $authors_mode,
		array $authors_map,
		bool $import_users,
		int $fallback_author_id
	): array {
		$imported_authors = array();
		$user_map         = array();
		$user_new         = array();

		foreach ($authors as $index => $author) {
			$remote_username = $author['author_login'] ?? '';
			if (!is_string($remote_username) || $remote_username === '') {
				continue;
			}

			$imported_authors[$index] = $remote_username;
			if (array_key_exists($remote_username, $authors_map)) {
				$user_map[$index] = blueprint_wxr_author_id_for_username(
					$authors_map[$remote_username],
					$remote_username
				);
				continue;
			}

			if ($authors_mode === 'map') {
				throw new Exception(
					sprintf('Missing local user mapping for WXR author "%s".', $remote_username)
				);
			}

			if ($authors_mode === 'create' && $import_users) {
				$user_new[$index] = $remote_username;
				continue;
			}

			$user_map[$index] = $fallback_author_id;
		}

		return array(
			'imported_authors' => $imported_authors,
			'user_map'         => $user_map,
			'user_new'         => $user_new,
		);
	}

	/**
	 * Finds the local user ID for an explicit WXR author map entry.
	 */
	function blueprint_wxr_author_id_for_username(string $local_username, string $remote_username): int {
		if ($local_username === '') {
			throw new Exception(
				sprintf('Invalid local user mapping for WXR author "%s".', $remote_username)
			);
		}

		$local_user = get_user_by('login', $local_username);
		if (!$local_user) {
			throw new Exception(
				sprintf(
					'Could not find local user "%s" mapped from WXR author "%s".',
					$local_username,
					$remote_username
				)
			);
		}
		return (int) $local_user->ID;
	}

	/**
	 * Applies explicit Blueprint URL replacements to parsed WXR data.
	 */
	function blueprint_apply_wxr_url_mapping($value, array $url_mapping) {
		if (is_string($value)) {
			return strtr($value, $url_mapping);
		}
		if (is_array($value)) {
			foreach ($value as $key => $item) {
				$value[$key] = blueprint_apply_wxr_url_mapping($item, $url_mapping);
			}
		}
		return $value;
	}
	`,
    env: {
      IMPORT_FILE: "/tmp/import.wxr",
      FETCH_ATTACHMENTS: i.fetchAttachments ? "true" : "false",
      REWRITE_URLS: i.rewriteUrls ? "true" : "false",
      URL_MAPPING: JSON.stringify(i.urlMapping),
      IMPORT_COMMENTS: i.importComments ? "true" : "false",
      FALLBACK_AUTHOR_USERNAME: i.fallbackAuthorUsername,
      AUTHORS_MODE: i.authorsMode,
      AUTHORS_MAP: JSON.stringify(i.authorsMap),
      IMPORT_USERS: i.importUsers ? "true" : "false"
    }
  });
}
const hl = async (e, { themeSlug: t = "" }, s) => {
  var o;
  (o = s == null ? void 0 : s.tracker) == null || o.setCaption("Importing theme starter content");
  const i = await e.documentRoot;
  await e.run({
    code: `<?php

		/**
		 * Ensure that the customizer loads as an admin user.
		 *
		 * For compatibility with themes, this MUST be run prior to theme inclusion, which is why this is a plugins_loaded filter instead
		 * of running _wp_customize_include() manually after load.
		 */
		function importThemeStarterContent_plugins_loaded() {
			// Set as the admin user, this ensures we can customize the site.
			wp_set_current_user(
				get_users( [ 'role' => 'Administrator' ] )[0]
			);

			// Force the site to be fresh, although it should already be.
			add_filter( 'pre_option_fresh_site', '__return_true' );

			/*
			 * Simulate this request as the customizer loading with the current theme in preview mode.
			 *
			 * See _wp_customize_include()
			 */
			$_REQUEST['wp_customize']    = 'on';
			$_REQUEST['customize_theme'] = ${Ce(t)} ?: get_stylesheet();

			/*
			 * Claim this is a ajax request saving settings, to avoid the preview filters being applied.
			 */
			$_REQUEST['action'] = 'customize_save';
			add_filter( 'wp_doing_ajax', '__return_true' );

			$_GET = $_REQUEST;
		}
		playground_add_filter( 'plugins_loaded', 'importThemeStarterContent_plugins_loaded', 0 );

		require ${Ce(i)} . '/wp-load.php';

		// Return early if there's no starter content.
		if ( ! get_theme_starter_content() ) {
			return;
		}

		// Import the Starter Content.
		$wp_customize->import_theme_starter_content();

		// Publish the changeset, which publishes the starter content.
		wp_publish_post( $wp_customize->changeset_post_id() );
		`
  });
}, Bd = [
  "mu-plugins/sqlite-database-integration",
  "mu-plugins/playground-includes",
  "mu-plugins/0-playground.php",
  "mu-plugins/0-sqlite.php"
];
async function Cn(e, t) {
  const s = [...Bd], i = ne(t, "db.php");
  return await e.fileExists(i) && !await e.isDir(i) && (await e.readFileAsText(i)).includes(
    Pd
  ) && s.push("db.php"), s;
}
const Hd = [
  "plugins/akismet",
  "plugins/hello.php",
  "plugins/wordpress-importer",
  "themes/twentytwenty",
  "themes/twentytwentyone",
  "themes/twentytwentytwo",
  "themes/twentytwentythree",
  "themes/twentytwentyfour",
  "themes/twentytwentyfive",
  "themes/twentytwentysix"
], Vd = async (e, { wordPressFilesZip: t, pathInZip: s = "" }, i) => {
  const o = await e.documentRoot;
  i == null || i.tracker.setCaption("Unpacking archive");
  const n = ne(
    "/tmp",
    `import-wordpress-files-${Tr()}`
  );
  let r = !1, l = null;
  try {
    await e.mkdir(n);
    let f;
    i && (f = ({
      filesProcessed: h,
      totalFiles: _,
      uncompressedBytesProcessed: k,
      totalUncompressedBytes: v
    }) => {
      i.tracker.setCaption(
        `Extracting ${h}/${_}`
      );
      let R = h / Math.max(_, 1);
      v > 0 && (R = k / v), i.tracker.set(R * 30);
    }), await Qn(
      e,
      t,
      n,
      !0,
      f
    );
    let u = ne(n, s);
    u = await Zd(e, u) || u, i == null || i.tracker.setCaption("Installing WordPress files"), i == null || i.tracker.set(30);
    const g = ne(u, "playground-export.json");
    let w = null;
    if (await e.fileExists(g))
      try {
        const h = await e.readFileAsText(g), _ = JSON.parse(h);
        typeof _.siteUrl == "string" && (l = _.siteUrl), typeof _.formatVersion == "number" && (w = _.formatVersion), await e.unlink(g);
      } catch {
      }
    const O = ne(u, "wp-content");
    if (await e.fileExists(O)) {
      const h = ne(o, "wp-content"), _ = await Cn(
        e,
        O
      ), k = await Cn(
        e,
        h
      );
      for (const v of _)
        await un(
          e,
          ne(O, v)
        );
      for (const v of k) {
        const R = ne(
          O,
          v
        ), E = ne(
          h,
          v
        );
        !await e.fileExists(R) && await e.fileExists(E) && (await e.mkdir(hr(R)), await e.cp(
          E,
          R
        ));
      }
      if (w === null || w < 2) {
        for (const E of Hd) {
          const A = ne(
            O,
            E
          ), C = ne(h, E);
          !await e.fileExists(A) && await e.fileExists(C) && (await e.mkdir(hr(A)), await e.cp(C, A));
        }
        const v = ne(
          O,
          "database"
        ), R = ne(h, "database");
        !await e.fileExists(v) && await e.fileExists(R) && await e.cp(R, v);
      }
    }
    const m = await e.listFiles(u);
    r = m.length > 0;
    for (const h of m)
      await un(e, ne(o, h)), await e.mv(
        ne(u, h),
        ne(o, h)
      );
    r = !1;
  } finally {
    r ? ue.warn(
      `WordPress file import failed while replacing live files. The remaining staged files were preserved for recovery at ${n}.`
    ) : await un(e, n);
  }
  i == null || i.tracker.setCaption("Updating WordPress configuration"), i == null || i.tracker.set(60), await xd(e, o);
  const p = await e.absoluteUrl;
  l || (l = await Yd(e, o)), await ml(e, {
    siteUrl: p
  }), i == null || i.tracker.setCaption("Upgrading the WordPress database"), i == null || i.tracker.set(75);
  const c = Ce(
    ne(o, "wp-admin", "upgrade.php")
  );
  await e.run({
    code: `<?php
            $_GET['step'] = 'upgrade_db';
            require ${c};
            `
  }), l && l !== p && (i == null || i.tracker.setCaption("Updating site URLs"), i == null || i.tracker.set(90), await zd(e, o, l, p)), i == null || i.tracker.setCaption("WordPress files imported"), i == null || i.tracker.finish();
};
function Ro(e) {
  const t = e.match(/\/scope:[^/]+\/?/);
  return t ? t[0].replace(/\/?$/, "/") : null;
}
async function zd(e, t, s, i) {
  const o = Ro(s), n = Ro(i);
  !o || !n || o !== n && await e.run({
    code: `<?php
		require_once getenv('DOCUMENT_ROOT') . '/wp-load.php';
		global $wpdb;

		$old_scope = getenv('OLD_SCOPE');
		$new_scope = getenv('NEW_SCOPE');

		// Update URLs in posts content, excerpts, and GUIDs
		$wpdb->query($wpdb->prepare(
			"UPDATE {$wpdb->posts} SET post_content = REPLACE(post_content, %s, %s)",
			$old_scope, $new_scope
		));
		$wpdb->query($wpdb->prepare(
			"UPDATE {$wpdb->posts} SET post_excerpt = REPLACE(post_excerpt, %s, %s)",
			$old_scope, $new_scope
		));
		$wpdb->query($wpdb->prepare(
			"UPDATE {$wpdb->posts} SET guid = REPLACE(guid, %s, %s)",
			$old_scope, $new_scope
		));

		// Update URLs in post meta
		$wpdb->query($wpdb->prepare(
			"UPDATE {$wpdb->postmeta} SET meta_value = REPLACE(meta_value, %s, %s) WHERE meta_value LIKE %s",
			$old_scope, $new_scope, '%' . $wpdb->esc_like($old_scope) . '%'
		));

		// Update URLs in options (handles both regular and serialized data)
		$wpdb->query($wpdb->prepare(
			"UPDATE {$wpdb->options} SET option_value = REPLACE(option_value, %s, %s) WHERE option_value LIKE %s",
			$old_scope, $new_scope, '%' . $wpdb->esc_like($old_scope) . '%'
		));

		// Update URLs in user meta
		$wpdb->query($wpdb->prepare(
			"UPDATE {$wpdb->usermeta} SET meta_value = REPLACE(meta_value, %s, %s) WHERE meta_value LIKE %s",
			$old_scope, $new_scope, '%' . $wpdb->esc_like($old_scope) . '%'
		));

		// Update URLs in term meta
		$wpdb->query($wpdb->prepare(
			"UPDATE {$wpdb->termmeta} SET meta_value = REPLACE(meta_value, %s, %s) WHERE meta_value LIKE %s",
			$old_scope, $new_scope, '%' . $wpdb->esc_like($old_scope) . '%'
		));

		// Update URLs in comments
		$wpdb->query($wpdb->prepare(
			"UPDATE {$wpdb->comments} SET comment_content = REPLACE(comment_content, %s, %s) WHERE comment_content LIKE %s",
			$old_scope, $new_scope, '%' . $wpdb->esc_like($old_scope) . '%'
		));
		$wpdb->query($wpdb->prepare(
			"UPDATE {$wpdb->comments} SET comment_author_url = REPLACE(comment_author_url, %s, %s) WHERE comment_author_url LIKE %s",
			$old_scope, $new_scope, '%' . $wpdb->esc_like($old_scope) . '%'
		));
		`,
    env: {
      DOCUMENT_ROOT: t,
      OLD_SCOPE: o,
      NEW_SCOPE: n
    }
  });
}
async function Yd(e, t) {
  const s = Ur({ documentRoot: t });
  return (await e.run({
    code: `<?php
		require_once ${s.documentRoot} . '/wp-load.php';
		global $wpdb;
		$row = $wpdb->get_row("SELECT option_value FROM {$wpdb->options} WHERE option_name = 'siteurl'");
		echo $row ? $row->option_value : '';
		`
  })).text.trim() || null;
}
const Gd = [
  "wp-content",
  "wp-admin",
  "wp-includes",
  "wp-config.php",
  "wp-config-sample.php"
];
async function Zd(e, t) {
  if (await Lo(e, t))
    return t;
  const s = await e.listFiles(t);
  if (s.length !== 1)
    return null;
  const i = ne(t, s[0]);
  return await e.isDir(i) && await Lo(e, i) ? i : null;
}
async function Lo(e, t) {
  for (const s of Gd)
    if (await e.fileExists(ne(t, s)))
      return !0;
  return !1;
}
async function un(e, t) {
  await e.fileExists(t) && (await e.isDir(t) ? await e.rmdir(t) : await e.unlink(t));
}
async function Jd(e) {
  const t = await e.request({
    url: "/wp-admin/export.php?download=true&content=all"
  });
  return new File([t.bytes], "export.xml");
}
const yl = async (e, { zipFile: t, zipPath: s, extractToPath: i }) => {
  if (s)
    ue.warn(
      'The "zipPath" option of the unzip() Blueprint step is deprecated and will be removed. Use "zipFile" instead.'
    );
  else if (!t)
    throw new Error("Either zipPath or zipFile must be provided");
  await Qn(e, t || s, i);
};
async function gl(e, {
  targetPath: t,
  zipFile: s,
  ifAlreadyInstalled: i = "overwrite",
  targetFolderName: o = ""
}) {
  const r = s.name.replace(/\.zip$/, ""), l = ne(await e.documentRoot, "wp-content"), p = ne(l, Tr()), c = ne(p, "assets", r);
  await e.fileExists(c) && await e.rmdir(p, {
    recursive: !0
  }), await e.mkdir(p);
  try {
    await yl(e, {
      zipFile: s,
      extractToPath: c
    });
    let f = await e.listFiles(c, {
      prependPath: !0
    });
    f = f.filter((m) => !m.endsWith("/__MACOSX"));
    const u = f.length === 1 && await e.isDir(f[0]);
    let g, w = "";
    u ? (w = f[0], g = f[0].split("/").pop()) : (w = c, g = r), o && o.length && (g = o);
    const O = `${t}/${g}`;
    if (await e.fileExists(O)) {
      if (!await e.isDir(O))
        throw new Error(
          `Cannot install asset ${g} to ${O} because a file with the same name already exists. Note it's a file, not a directory! Is this by mistake?`
        );
      if (i === "overwrite")
        await e.rmdir(O, {
          recursive: !0
        });
      else {
        if (i === "skip")
          return {
            assetFolderPath: O,
            assetFolderName: g
          };
        throw new Error(
          `Cannot install asset ${g} to ${t} because it already exists and the ifAlreadyInstalled option was set to ${i}`
        );
      }
    }
    return await e.mv(w, O), {
      assetFolderPath: O,
      assetFolderName: g
    };
  } finally {
    await e.rmdir(p, {
      recursive: !0
    });
  }
}
const Nn = "PLAYGROUND_ACTIVATION_OPTIONS:", Kd = async (e, { pluginData: t, pluginZipFile: s, ifAlreadyInstalled: i, options: o = {} }, n) => {
  s && (t = s, ue.warn(
    'The "pluginZipFile" option is deprecated. Use "pluginData" instead.'
  ));
  let r = "", l = "";
  const p = () => o.humanReadableName || l, c = async (f) => {
    if (f.name.toLowerCase().endsWith(".zip"))
      return !0;
    const u = new Uint8Array(await f.arrayBuffer(), 0, 4);
    return u[0] === 80 && u[1] === 75 && u[2] === 3 && u[3] === 4;
  };
  try {
    const f = ne(
      await e.documentRoot,
      "wp-content",
      "plugins"
    ), u = "targetFolderName" in o ? o.targetFolderName : "";
    if (t instanceof File)
      if (await c(t)) {
        const w = t.name.split("/").pop() || "plugin.zip";
        l = Ls(w), n == null || n.tracker.setCaption(
          `Installing the ${p()} plugin`
        );
        const O = await gl(e, {
          ifAlreadyInstalled: i,
          zipFile: t,
          targetPath: `${await e.documentRoot}/wp-content/plugins`,
          targetFolderName: u
        });
        r = O.assetFolderPath, l = O.assetFolderName;
      } else if (t.name.endsWith(".php")) {
        const w = ne(
          f,
          t.name
        );
        await ri(e, {
          path: w,
          data: t
        }), r = w, l = t.name;
      } else
        throw new Error(
          "pluginData looks like a file but does not look like a .zip or .php file."
        );
    else if (t) {
      l = t.name, n == null || n.tracker.setCaption(
        `Installing the ${p()} plugin`
      );
      const w = ne(
        f,
        u || t.name
      );
      await qn(
        e,
        w,
        t.files,
        {
          rmRoot: !0
        }
      ), r = w;
    }
    if ("activate" in o ? o.activate : !0) {
      let w;
      o.activationOptions !== void 0 && (w = await Xd(
        e,
        r,
        o.activationOptions
      ));
      try {
        await al(
          e,
          {
            pluginPath: r,
            pluginName: p()
          },
          n
        );
      } finally {
        w && await Qd(
          e,
          w
        );
      }
    }
  } catch (f) {
    if (o.onError === "skip-plugin") {
      const u = p() || "unknown plugin";
      ue.warn(
        `Skipping plugin installation for ${u} after failure: ${f instanceof Error ? f.message : String(f)}`
      );
      return;
    }
    throw f;
  }
};
async function Xd(e, t, s) {
  const i = await e.documentRoot, o = await e.run({
    code: `<?php
ob_start();
define('WP_ADMIN', true);
require_once getenv('DOCROOT') . "/wp-load.php";
require_once getenv('DOCROOT') . "/wp-admin/includes/plugin.php";

$payload_prefix = getenv('ACTIVATION_OPTIONS_PAYLOAD_PREFIX');
$plugin_path = getenv('PLUGIN_PATH');
$plugin_file = '';
if (is_dir($plugin_path)) {
	foreach ((glob(rtrim($plugin_path, '/') . '/*.php') ?: array()) as $file) {
		$info = get_plugin_data($file, false, false);
		if (!empty($info['Name'])) {
			$plugin_file = $file;
			break;
		}
	}
} else {
	$plugin_dir = rtrim(WP_PLUGIN_DIR, '/');
	$plugin_file = $plugin_path;
	if (strpos($plugin_file, $plugin_dir . '/') !== 0 && file_exists($plugin_dir . '/' . $plugin_file)) {
		$plugin_file = $plugin_dir . '/' . $plugin_file;
	}
}

if (!$plugin_file || !file_exists($plugin_file)) {
	ob_end_clean();
	// Prefix the JSON payload so JS can find it even if plugin bootstrap
	// code prints notices or other output during this request.
	echo $payload_prefix . json_encode(array('error' => 'Could not find plugin file for activation options.'));
	exit;
}

$options_json = getenv('ACTIVATION_OPTIONS_JSON');
$options = json_decode($options_json ?: '', true);
if (!is_array($options)) {
	ob_end_clean();
	// Prefix the JSON payload so JS can find it even if plugin bootstrap
	// code prints notices or other output during this request.
	echo $payload_prefix . json_encode(array('error' => 'Could not decode plugin activation options.'));
	exit;
}
$option_name = 'blueprint_activation_' . plugin_basename($plugin_file);
update_option($option_name, $options);
ob_end_clean();
// Prefix the JSON payload so JS can find it even if plugin bootstrap
// code prints notices or other output during this request.
echo $payload_prefix . json_encode(array('optionName' => $option_name));
`,
    env: {
      DOCROOT: i,
      PLUGIN_PATH: t,
      ACTIVATION_OPTIONS_JSON: JSON.stringify(s),
      ACTIVATION_OPTIONS_PAYLOAD_PREFIX: Nn
    }
  }), n = em(o.text);
  if (n != null && n.error)
    throw new Error(String(n.error));
  if (!(n != null && n.optionName) || typeof n.optionName != "string")
    throw new Error("Could not determine plugin activation options name.");
  return n.optionName;
}
async function Qd(e, t) {
  await e.run({
    code: `<?php
require_once getenv('DOCROOT') . "/wp-load.php";
delete_option(getenv('OPTION_NAME'));
`,
    env: {
      DOCROOT: await e.documentRoot,
      OPTION_NAME: t
    }
  });
}
function em(e) {
  const t = e || "", s = t.lastIndexOf(Nn);
  if (s === -1)
    return;
  const i = t.slice(s + Nn.length).trimStart().split(/\r?\n/, 1)[0].trim();
  if (i)
    try {
      return JSON.parse(i);
    } catch {
      throw new Error("Could not parse plugin activation options payload.");
    }
}
const tm = async (e, { themeData: t, themeZipFile: s, ifAlreadyInstalled: i, options: o = {} }, n) => {
  s && (t = s, ue.warn(
    'The "themeZipFile" option is deprecated. Use "themeData" instead.'
  ));
  const r = o.onError ?? "throw";
  let l = "";
  const p = () => o.humanReadableName || l;
  try {
    const c = "targetFolderName" in o ? o.targetFolderName : "";
    let f = "";
    if (t instanceof File) {
      const w = t.name.split("/").pop() || "theme.zip";
      l = Ls(w), n == null || n.tracker.setCaption(
        `Installing the ${p()} theme`
      ), f = (await gl(e, {
        ifAlreadyInstalled: i,
        zipFile: t,
        targetPath: `${await e.documentRoot}/wp-content/themes`,
        targetFolderName: c
      })).assetFolderName;
    } else {
      if (l = t.name, f = c || l, !f || Et(f) !== f)
        throw new Error(
          "Theme folder name must be a single directory name."
        );
      n == null || n.tracker.setCaption(
        `Installing the ${p()} theme`
      );
      const w = ne(
        await e.documentRoot,
        "wp-content",
        "themes",
        f
      );
      let O = !0;
      if (await e.fileExists(w)) {
        if (!await e.isDir(w))
          throw new Error(
            `Cannot install theme ${f} to ${w} because a file with the same name already exists. Note it's a file, not a directory! Is this by mistake?`
          );
        if ((i ?? "overwrite") === "skip")
          O = !1;
        else if (i === "error")
          throw new Error(
            `Cannot install theme ${f} to ${w} because it already exists and the ifAlreadyInstalled option was set to ${i}`
          );
      }
      O && await qn(
        e,
        w,
        t.files,
        {
          rmRoot: !0
        }
      );
    }
    ("activate" in o ? o.activate : !0) && await ll(
      e,
      {
        themeFolderName: f
      },
      n
    ), ("importStarterContent" in o ? o.importStarterContent : !1) && await hl(
      e,
      {
        themeSlug: f
      },
      n
    );
  } catch (c) {
    if (r === "skip-theme") {
      const f = p() || "unknown theme";
      ue.warn(
        `Skipping theme installation for ${f} after failure: ${c instanceof Error ? c.message : String(c)}`
      );
      return;
    }
    throw c;
  }
}, rm = async (e, { username: t = "admin" } = {}, s) => {
  s == null || s.tracker.setCaption((s == null ? void 0 : s.initialCaption) || "Logging in"), e.defineConstant("PLAYGROUND_AUTO_LOGIN_AS_USER", t);
}, sm = async (e, t, s) => {
  var c;
  (c = s == null ? void 0 : s.tracker) == null || c.setCaption("Resetting WordPress data");
  const i = await e.documentRoot, o = new Set(t.contentTypes ?? []), n = t.contentTypes === void 0, r = [
    o.has("posts") ? "post" : void 0,
    o.has("pages") ? "page" : void 0
  ].filter((f) => f !== void 0), l = n || o.has("posts"), p = o.has("comments");
  await e.run({
    env: {
      DOCROOT: i,
      PLAYGROUND_RESET_ALL_POST_TYPES: n ? "1" : "0",
      PLAYGROUND_RESET_POST_TYPES: JSON.stringify(r),
      PLAYGROUND_RESET_POSTS: l ? "1" : "0",
      PLAYGROUND_RESET_COMMENTS: n || p ? "1" : "0"
    },
    code: `<?php
		require getenv('DOCROOT') . '/wp-load.php';

		$remove_all_post_types = getenv('PLAYGROUND_RESET_ALL_POST_TYPES') === '1';
		$post_types = json_decode(getenv('PLAYGROUND_RESET_POST_TYPES'), true);
		if (!is_array($post_types)) {
			throw new RuntimeException('Invalid post types passed to resetData.');
		}

		if ($remove_all_post_types) {
			$post_ids = $wpdb->get_col(
				"SELECT ID FROM {$wpdb->posts} ORDER BY ID DESC"
			);
		} elseif (count($post_types) > 0) {
			$placeholders = implode(', ', array_fill(0, count($post_types), '%s'));
			$post_ids = $wpdb->get_col($wpdb->prepare(
				"SELECT ID FROM {$wpdb->posts} " .
				"WHERE post_type IN ($placeholders) ORDER BY ID DESC",
				...$post_types
			));
		} else {
			$post_ids = [];
		}

		foreach ($post_ids as $post_id) {
			wp_delete_post((int) $post_id, true);
		}

		// WordPress refreshes this cache before deleting the post row, so removing
		// the last published post leaves the cache set to true.
		if (getenv('PLAYGROUND_RESET_POSTS') === '1') {
			delete_option('wp_calendar_block_has_published_posts');
		}

		$remove_comments = getenv('PLAYGROUND_RESET_COMMENTS') === '1';
		if ($remove_comments) {
			$comment_ids = $wpdb->get_col(
				"SELECT comment_ID FROM {$wpdb->comments}"
			);
			foreach ($comment_ids as $comment_id) {
				wp_delete_comment((int) $comment_id, true);
			}
		}

		$reset_sequence_if_empty = static function($table_name) use ($wpdb) {
			$count = $wpdb->get_var("SELECT COUNT(*) FROM {$table_name}");
			if ((int) $count !== 0) {
				return;
			}
			if (isset($GLOBALS['@pdo'])) {
				$statement = $GLOBALS['@pdo']->prepare(
					'DELETE FROM SQLITE_SEQUENCE WHERE NAME = :table_name'
				);
				$statement->execute([':table_name' => $table_name]);
				return;
			}
			$wpdb->query("ALTER TABLE {$table_name} AUTO_INCREMENT = 1");
		};

		if ($remove_all_post_types || count($post_types) > 0) {
			$reset_sequence_if_empty($wpdb->posts);
			$reset_sequence_if_empty($wpdb->postmeta);
		}
		if ($remove_comments || $remove_all_post_types || count($post_types) > 0) {
			$reset_sequence_if_empty($wpdb->comments);
			$reset_sequence_if_empty($wpdb->commentmeta);
		}
		`
  });
}, nm = async (e, { options: t }) => {
  await e.request({
    url: "/wp-admin/install.php?step=2",
    method: "POST",
    body: {
      language: "en",
      prefix: "wp_",
      weblog_title: "My WordPress Website",
      user_name: t.adminPassword || "admin",
      admin_password: t.adminPassword || "password",
      // The installation wizard demands typing the same password twice
      admin_password2: t.adminPassword || "password",
      Submit: "Install WordPress",
      pw_weak: "1",
      admin_email: "admin@localhost.com"
    }
  });
}, im = async (e) => {
  const t = "/tmp/wordpress-playground.zip", s = "/tmp/playground-export.json", i = await e.documentRoot, o = ne(i, "wp-content"), n = await e.absoluteUrl;
  await e.writeFile(
    s,
    new TextEncoder().encode(JSON.stringify({ formatVersion: 2, siteUrl: n }))
  );
  const r = {
    [s]: "playground-export.json",
    [ne(i, "wp-config.php")]: "wp-config.php"
  }, l = (await Cn(
    e,
    o
  )).map((f) => ne(o, f)), p = Ur({
    zipPath: t,
    wpContentPath: o,
    documentRoot: i,
    excludedPaths: l,
    additionalPaths: r
  });
  await am(
    e,
    `zipDir(${p.wpContentPath}, ${p.zipPath}, array(
			'exclude_paths' => ${p.excludedPaths},
			'zip_root'      => ${p.documentRoot},
			'additional_paths' => ${p.additionalPaths}
		));`
  );
  const c = await e.readFileAsBuffer(t);
  return e.unlink(t), e.unlink(s), c;
}, om = `<?php

function zipDir($root, $output, $options = array())
{
    $root = rtrim($root, '/');
    $additionalPaths = array_key_exists('additional_paths', $options) ? $options['additional_paths'] : array();
    $excludePaths = array_key_exists('exclude_paths', $options) ? $options['exclude_paths'] : array();
    $zip_root = array_key_exists('zip_root', $options) ? $options['zip_root'] : $root;

    $zip = new ZipArchive;
    $res = $zip->open($output, ZipArchive::CREATE);
    if ($res === TRUE) {
        $directories = array(
            $root . '/'
        );
        while (sizeof($directories)) {
            $current_dir = array_pop($directories);

            if ($handle = opendir($current_dir)) {
                while (false !== ($entry = readdir($handle))) {
                    if ($entry == '.' || $entry == '..') {
                        continue;
                    }

                    $entry = join_paths($current_dir, $entry);
                    if (in_array($entry, $excludePaths)) {
                        continue;
                    }
                    if (is_dir($entry)) {
                        $directory_path = $entry . '/';
                        array_push($directories, $directory_path);
                    } else if (is_file($entry)) {
                        // ensure compliance with zip spec by only using relative paths for files
                        $zip->addFile($entry, ltrim(substr($entry, strlen($zip_root)), '/'));
                    }
                }
                closedir($handle);
            }
        }
        foreach ($additionalPaths as $disk_path => $zip_path) {
            $zip->addFile($disk_path, $zip_path);
        }
        $zip->close();
        chmod($output, 0777);
    }
}

function join_paths()
{
    $paths = array();

    foreach (func_get_args() as $arg) {
        if ($arg !== '') {
            $paths[] = $arg;
        }
    }

    return preg_replace('#/+#', '/', join('/', $paths));
}
`;
async function am(e, t) {
  return await e.run({
    code: om + t
  });
}
const lm = async (e, t) => {
  const o = (await (await fetch(
    `https://api.wordpress.org/translations/core/1.0/?version=${e}`
  )).json()).translations.find(
    (n) => n.language.toLowerCase() === t.toLowerCase()
  );
  if (!o)
    throw new Error(
      `Failed to get ${t} translation package for WordPress ${e}.`
    );
  return o.package;
}, pm = async (e, { language: t }, s) => {
  s == null || s.tracker.setCaption((s == null ? void 0 : s.initialCaption) || "Translating");
  const i = await e.documentRoot;
  await e.defineConstant("WPLANG", t), await e.run({
    code: `<?php
		require_once ${Ce(i)} . '/wp-load.php';
		update_option('WPLANG', ${Ce(t)});
		`
  });
  const o = (await e.run({
    code: `<?php
			require '${i}/wp-includes/version.php';
			echo $wp_version;
		`
  })).text, n = [
    {
      url: await lm(o, t),
      type: "core"
    }
  ], l = (await e.run({
    code: `<?php
		require_once('${i}/wp-load.php');
		require_once('${i}/wp-admin/includes/plugin.php');
		echo json_encode(
			array_values(
				array_map(
					function($plugin) {
						return [
							'slug'    => $plugin['TextDomain'],
							'version' => $plugin['Version']
						];
					},
					array_filter(
						get_plugins(),
						function($plugin) {
							return !empty($plugin['TextDomain']);
						}
					)
				)
			)
		);`
  })).json;
  for (const { slug: g, version: w } of l)
    n.push({
      url: `https://downloads.wordpress.org/translation/plugin/${g}/${w}/${t}.zip`,
      type: "plugin"
    });
  const c = (await e.run({
    code: `<?php
		require_once('${i}/wp-load.php');
		require_once('${i}/wp-admin/includes/theme.php');
		echo json_encode(
			array_values(
				array_map(
					function($theme) {
						return [
							'slug'    => $theme->get('TextDomain'),
							'version' => $theme->get('Version')
						];
					},
					wp_get_themes()
				)
			)
		);`
  })).json;
  for (const { slug: g, version: w } of c)
    n.push({
      url: `https://downloads.wordpress.org/translation/theme/${g}/${w}/${t}.zip`,
      type: "theme"
    });
  await e.isDir(`${i}/wp-content/languages/plugins`) || await e.mkdir(`${i}/wp-content/languages/plugins`), await e.isDir(`${i}/wp-content/languages/themes`) || await e.mkdir(`${i}/wp-content/languages/themes`);
  const f = new Dr({ concurrency: 5 }), u = n.map(
    ({ url: g, type: w }) => f.run(async () => {
      try {
        const O = await fetch(g);
        if (!O.ok)
          throw new Error(
            `Failed to download translations for ${w}: ${O.statusText}`
          );
        let m = `${i}/wp-content/languages`;
        w === "plugin" ? m += "/plugins" : w === "theme" && (m += "/themes"), await Qn(
          e,
          new File(
            [await O.arrayBuffer()],
            `${t}-${w}.zip`
          ),
          m
        );
      } catch (O) {
        if (w === "core")
          throw new Error(
            `Failed to download translations for WordPress. Please check if the language code ${t} is correct. You can find all available languages and translations on https://translate.wordpress.org/.`
          );
        ue.warn(
          `Error downloading translations for ${w}: ${O}`
        );
      }
    })
  );
  await Promise.all(u);
}, cm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  activatePlugin: al,
  activateTheme: ll,
  assertWpCli: ti,
  cp: Fd,
  defaultWpCliPath: Cs,
  defaultWpCliResource: ul,
  defineSiteUrl: ml,
  defineWpConfigConsts: ei,
  enableMultisite: Id,
  exportWXR: Jd,
  importThemeStarterContent: hl,
  importWordPressFiles: Vd,
  importWxr: Wd,
  installPlugin: Kd,
  installTheme: tm,
  login: rm,
  mkdir: Ud,
  mv: Dd,
  request: _d,
  resetData: sm,
  rm: An,
  rmdir: jd,
  runPHP: md,
  runPHPWithOptions: hd,
  runSql: gd,
  runWpInstallationWizard: nm,
  setSiteLanguage: pm,
  setSiteOptions: fl,
  unzip: yl,
  updateUserMeta: Ld,
  wpCLI: dl,
  writeFile: ri,
  writeFiles: qd,
  zipWpContent: im
}, Symbol.toStringTag, { value: "Module" })), fm = {
  properties: {
    landingPage: {
      type: "string",
      description: "The URL to navigate to after the blueprint has been run."
    },
    description: {
      type: "string",
      description: "Optional description. It doesn't do anything but is exposed as a courtesy to developers who may want to document which blueprint file does what.",
      deprecated: "Use meta.description instead."
    },
    meta: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "A clear and concise name for your Blueprint."
        },
        description: {
          type: "string",
          description: "A brief explanation of what your Blueprint offers."
        },
        author: {
          type: "string",
          description: "A GitHub username of the author of this Blueprint."
        },
        categories: {
          type: "array",
          items: { type: "string" },
          description: "Relevant categories to help users find your Blueprint in the future Blueprints section on WordPress.org."
        }
      },
      required: ["title", "author"],
      additionalProperties: !1,
      description: "Optional metadata. Used by the Blueprints gallery at https://github.com/WordPress/blueprints"
    },
    preferredVersions: {
      type: "object",
      properties: {
        php: {
          anyOf: [
            { $ref: "#/definitions/BlueprintPHPVersion" },
            { type: "string", const: "latest" }
          ],
          description: `The preferred PHP version to use. If not specified, the latest supported version will be used.

Note: PHP 7.2 and 7.3 are deprecated and will be automatically upgraded to 7.4.`
        },
        wp: {
          anyOf: [
            { type: "string" },
            { type: "string", const: "latest" },
            { type: "boolean", const: !1 }
          ],
          description: "The preferred WordPress version to use, or `false` to boot a PHP-only Playground without downloading or installing WordPress. If not specified, the latest supported version will be used.\n\nWhen set to `false`, WordPress-specific Blueprint fields (`plugins`, `siteOptions`, `login`, and WordPress-only steps) are rejected at compile time."
        }
      },
      required: ["php", "wp"],
      additionalProperties: !1,
      description: "The preferred PHP and WordPress versions to use."
    },
    features: {
      type: "object",
      properties: {
        intl: {
          type: "boolean",
          description: "Should boot with support for Intl dynamic extension"
        },
        networking: {
          type: "boolean",
          description: "Should boot with support for network request via wp_safe_remote_get?"
        }
      },
      additionalProperties: !1
    },
    extraLibraries: {
      type: "array",
      items: { $ref: "#/definitions/ExtraLibrary" },
      description: "Extra libraries to preload into the Playground instance."
    },
    constants: {
      $ref: "#/definitions/PHPConstants",
      description: "PHP Constants to define on every request"
    },
    plugins: {
      type: "array",
      items: {
        anyOf: [
          { type: "string" },
          { $ref: "#/definitions/FileReference" }
        ]
      },
      description: "WordPress plugins to install and activate"
    },
    siteOptions: {
      type: "object",
      additionalProperties: { type: "string" },
      properties: {
        blogname: { type: "string", description: "The site title" }
      },
      description: "WordPress site options to define"
    },
    login: {
      anyOf: [
        { type: "boolean" },
        {
          type: "object",
          properties: {
            username: { type: "string" },
            password: { type: "string" }
          },
          required: ["username", "password"],
          additionalProperties: !1
        }
      ],
      description: "User to log in as. If true, logs the user in as admin/password."
    },
    phpExtensionBundles: {
      deprecated: "No longer used. Feel free to remove it from your Blueprint."
    },
    steps: {
      type: "array",
      items: {
        anyOf: [
          { $ref: "#/definitions/StepDefinition" },
          { type: "string" },
          { not: {} },
          { type: "boolean", const: !1 },
          { type: "null" }
        ]
      },
      description: "The steps to run after every other operation in this Blueprint was executed."
    },
    $schema: { type: "string" }
  }
}, um = {
  additionalProperties: { type: ["string", "boolean", "number"] }
}, si = Object.prototype.hasOwnProperty, dm = {
  enum: ["8.5", "8.4", "8.3", "8.2", "8.1", "8.0", "7.4"]
}, mm = { enum: ["5.2"] };
function Er(e, { instancePath: t = "", parentData: s, parentDataProperty: i, rootData: o = e } = {}) {
  let n = null, r = 0;
  const l = r;
  let p = !1;
  const c = r;
  if (typeof e != "string") {
    const u = {
      instancePath: t,
      schemaPath: "#/definitions/PHPNextVersion/type",
      keyword: "type",
      params: { type: "string" },
      message: "must be string"
    };
    n === null ? n = [u] : n.push(u), r++;
  }
  if (e !== "next") {
    const u = {
      instancePath: t,
      schemaPath: "#/definitions/PHPNextVersion/const",
      keyword: "const",
      params: { allowedValue: "next" },
      message: "must be equal to constant"
    };
    n === null ? n = [u] : n.push(u), r++;
  }
  var f = c === r;
  if (p = p || f, !p) {
    const u = r;
    if (typeof e != "string") {
      const w = {
        instancePath: t,
        schemaPath: "#/definitions/SupportedPHPVersion/type",
        keyword: "type",
        params: { type: "string" },
        message: "must be string"
      };
      n === null ? n = [w] : n.push(w), r++;
    }
    if (!(e === "8.5" || e === "8.4" || e === "8.3" || e === "8.2" || e === "8.1" || e === "8.0" || e === "7.4")) {
      const w = {
        instancePath: t,
        schemaPath: "#/definitions/SupportedPHPVersion/enum",
        keyword: "enum",
        params: { allowedValues: dm.enum },
        message: "must be equal to one of the allowed values"
      };
      n === null ? n = [w] : n.push(w), r++;
    }
    var f = u === r;
    if (p = p || f, !p) {
      const w = r;
      if (typeof e != "string") {
        const m = {
          instancePath: t,
          schemaPath: "#/definitions/LegacyPHPVersion/type",
          keyword: "type",
          params: { type: "string" },
          message: "must be string"
        };
        n === null ? n = [m] : n.push(m), r++;
      }
      if (e !== "5.2") {
        const m = {
          instancePath: t,
          schemaPath: "#/definitions/LegacyPHPVersion/enum",
          keyword: "enum",
          params: { allowedValues: mm.enum },
          message: "must be equal to one of the allowed values"
        };
        n === null ? n = [m] : n.push(m), r++;
      }
      var f = w === r;
      p = p || f;
    }
  }
  if (p)
    r = l, n !== null && (l ? n.length = l : n = null);
  else {
    const u = {
      instancePath: t,
      schemaPath: "#/anyOf",
      keyword: "anyOf",
      params: {},
      message: "must match a schema in anyOf"
    };
    return n === null ? n = [u] : n.push(u), r++, Er.errors = n, !1;
  }
  return Er.errors = n, r === 0;
}
function Or(e, { instancePath: t = "", parentData: s, parentDataProperty: i, rootData: o = e } = {}) {
  let n = null, r = 0;
  const l = r;
  let p = !1;
  const c = r;
  Er(e, {
    instancePath: t,
    parentData: s,
    parentDataProperty: i,
    rootData: o
  }) || (n = n === null ? Er.errors : n.concat(Er.errors), r = n.length);
  var f = c === r;
  if (p = p || f, !p) {
    const u = r;
    if (typeof e != "string") {
      const w = {
        instancePath: t,
        schemaPath: "#/anyOf/1/type",
        keyword: "type",
        params: { type: "string" },
        message: "must be string"
      };
      n === null ? n = [w] : n.push(w), r++;
    }
    if (e !== "7.2") {
      const w = {
        instancePath: t,
        schemaPath: "#/anyOf/1/const",
        keyword: "const",
        params: { allowedValue: "7.2" },
        message: "must be equal to constant"
      };
      n === null ? n = [w] : n.push(w), r++;
    }
    var f = u === r;
    if (p = p || f, !p) {
      const w = r;
      if (typeof e != "string") {
        const m = {
          instancePath: t,
          schemaPath: "#/anyOf/2/type",
          keyword: "type",
          params: { type: "string" },
          message: "must be string"
        };
        n === null ? n = [m] : n.push(m), r++;
      }
      if (e !== "7.3") {
        const m = {
          instancePath: t,
          schemaPath: "#/anyOf/2/const",
          keyword: "const",
          params: { allowedValue: "7.3" },
          message: "must be equal to constant"
        };
        n === null ? n = [m] : n.push(m), r++;
      }
      var f = w === r;
      p = p || f;
    }
  }
  if (p)
    r = l, n !== null && (l ? n.length = l : n = null);
  else {
    const u = {
      instancePath: t,
      schemaPath: "#/anyOf",
      keyword: "anyOf",
      params: {},
      message: "must match a schema in anyOf"
    };
    return n === null ? n = [u] : n.push(u), r++, Or.errors = n, !1;
  }
  return Or.errors = n, r === 0;
}
const dn = { validate: ce }, hm = {
  enum: ["branch", "tag", "commit", "refname"]
};
function De(e, { instancePath: t = "", parentData: s, parentDataProperty: i, rootData: o = e } = {}) {
  let n = null, r = 0;
  if (e && typeof e == "object" && !Array.isArray(e)) {
    let p;
    if (e.resource === void 0 && (p = "resource") || e.url === void 0 && (p = "url") || e.ref === void 0 && (p = "ref"))
      return De.errors = [
        {
          instancePath: t,
          schemaPath: "#/required",
          keyword: "required",
          params: { missingProperty: p },
          message: "must have required property '" + p + "'"
        }
      ], !1;
    for (const c in e)
      if (!(c === "resource" || c === "url" || c === "ref" || c === "refType" || c === "path" || c === ".git"))
        return De.errors = [
          {
            instancePath: t,
            schemaPath: "#/additionalProperties",
            keyword: "additionalProperties",
            params: { additionalProperty: c },
            message: "must NOT have additional properties"
          }
        ], !1;
    {
      if (e.resource !== void 0) {
        let c = e.resource;
        const f = r;
        if (typeof c != "string")
          return De.errors = [
            {
              instancePath: t + "/resource",
              schemaPath: "#/properties/resource/type",
              keyword: "type",
              params: { type: "string" },
              message: "must be string"
            }
          ], !1;
        if (c !== "git:directory")
          return De.errors = [
            {
              instancePath: t + "/resource",
              schemaPath: "#/properties/resource/const",
              keyword: "const",
              params: { allowedValue: "git:directory" },
              message: "must be equal to constant"
            }
          ], !1;
        var l = f === r;
      } else
        var l = !0;
      if (l) {
        if (e.url !== void 0) {
          const c = r;
          if (typeof e.url != "string")
            return De.errors = [
              {
                instancePath: t + "/url",
                schemaPath: "#/properties/url/type",
                keyword: "type",
                params: { type: "string" },
                message: "must be string"
              }
            ], !1;
          var l = c === r;
        } else
          var l = !0;
        if (l) {
          if (e.ref !== void 0) {
            const c = r;
            if (typeof e.ref != "string")
              return De.errors = [
                {
                  instancePath: t + "/ref",
                  schemaPath: "#/properties/ref/type",
                  keyword: "type",
                  params: { type: "string" },
                  message: "must be string"
                }
              ], !1;
            var l = c === r;
          } else
            var l = !0;
          if (l) {
            if (e.refType !== void 0) {
              let c = e.refType;
              const f = r;
              if (typeof c != "string")
                return De.errors = [
                  {
                    instancePath: t + "/refType",
                    schemaPath: "#/definitions/GitDirectoryRefType/type",
                    keyword: "type",
                    params: { type: "string" },
                    message: "must be string"
                  }
                ], !1;
              if (!(c === "branch" || c === "tag" || c === "commit" || c === "refname"))
                return De.errors = [
                  {
                    instancePath: t + "/refType",
                    schemaPath: "#/definitions/GitDirectoryRefType/enum",
                    keyword: "enum",
                    params: {
                      allowedValues: hm.enum
                    },
                    message: "must be equal to one of the allowed values"
                  }
                ], !1;
              var l = f === r;
            } else
              var l = !0;
            if (l) {
              if (e.path !== void 0) {
                const c = r;
                if (typeof e.path != "string")
                  return De.errors = [
                    {
                      instancePath: t + "/path",
                      schemaPath: "#/properties/path/type",
                      keyword: "type",
                      params: { type: "string" },
                      message: "must be string"
                    }
                  ], !1;
                var l = c === r;
              } else
                var l = !0;
              if (l)
                if (e[".git"] !== void 0) {
                  const c = r;
                  if (typeof e[".git"] != "boolean")
                    return De.errors = [
                      {
                        instancePath: t + "/.git",
                        schemaPath: "#/properties/.git/type",
                        keyword: "type",
                        params: {
                          type: "boolean"
                        },
                        message: "must be boolean"
                      }
                    ], !1;
                  var l = c === r;
                } else
                  var l = !0;
            }
          }
        }
      }
    }
  } else
    return De.errors = [
      {
        instancePath: t,
        schemaPath: "#/type",
        keyword: "type",
        params: { type: "object" },
        message: "must be object"
      }
    ], !1;
  return De.errors = n, r === 0;
}
const ym = {
  additionalProperties: {
    anyOf: [
      { $ref: "#/definitions/FileTree" },
      { type: ["object", "string"] }
    ]
  }
}, mn = { validate: Kt };
function Kt(e, { instancePath: t = "", parentData: s, parentDataProperty: i, rootData: o = e } = {}) {
  let n = null, r = 0;
  if (r === 0)
    if (e && typeof e == "object" && !Array.isArray(e))
      for (const c in e) {
        let f = e[c];
        const u = r, g = r;
        let w = !1;
        const O = r;
        mn.validate(f, {
          instancePath: t + "/" + c.replace(/~/g, "~0").replace(/\//g, "~1"),
          parentData: e,
          parentDataProperty: c,
          rootData: o
        }) || (n = n === null ? mn.validate.errors : n.concat(mn.validate.errors), r = n.length);
        var l = O === r;
        if (w = w || l, !w) {
          const m = r;
          if (!(f && typeof f == "object" && !Array.isArray(f)) && typeof f != "string") {
            const _ = {
              instancePath: t + "/" + c.replace(/~/g, "~0").replace(/\//g, "~1"),
              schemaPath: "#/additionalProperties/anyOf/1/type",
              keyword: "type",
              params: {
                type: ym.additionalProperties.anyOf[1].type
              },
              message: "must be object,string"
            };
            n === null ? n = [_] : n.push(_), r++;
          }
          var l = m === r;
          w = w || l;
        }
        if (w)
          r = g, n !== null && (g ? n.length = g : n = null);
        else {
          const m = {
            instancePath: t + "/" + c.replace(/~/g, "~0").replace(/\//g, "~1"),
            schemaPath: "#/additionalProperties/anyOf",
            keyword: "anyOf",
            params: {},
            message: "must match a schema in anyOf"
          };
          return n === null ? n = [m] : n.push(m), r++, Kt.errors = n, !1;
        }
        var p = u === r;
        if (!p)
          break;
      }
    else
      return Kt.errors = [
        {
          instancePath: t,
          schemaPath: "#/type",
          keyword: "type",
          params: { type: "object" },
          message: "must be object"
        }
      ], !1;
  return Kt.errors = n, r === 0;
}
function wt(e, { instancePath: t = "", parentData: s, parentDataProperty: i, rootData: o = e } = {}) {
  let n = null, r = 0;
  if (r === 0)
    if (e && typeof e == "object" && !Array.isArray(e)) {
      let p;
      if (e.files === void 0 && (p = "files") || e.name === void 0 && (p = "name") || e.resource === void 0 && (p = "resource"))
        return wt.errors = [
          {
            instancePath: t,
            schemaPath: "#/required",
            keyword: "required",
            params: { missingProperty: p },
            message: "must have required property '" + p + "'"
          }
        ], !1;
      {
        const c = r;
        for (const f in e)
          if (!(f === "resource" || f === "files" || f === "name"))
            return wt.errors = [
              {
                instancePath: t,
                schemaPath: "#/additionalProperties",
                keyword: "additionalProperties",
                params: { additionalProperty: f },
                message: "must NOT have additional properties"
              }
            ], !1;
        if (c === r) {
          if (e.resource !== void 0) {
            let f = e.resource;
            const u = r;
            if (typeof f != "string")
              return wt.errors = [
                {
                  instancePath: t + "/resource",
                  schemaPath: "#/properties/resource/type",
                  keyword: "type",
                  params: { type: "string" },
                  message: "must be string"
                }
              ], !1;
            if (f !== "literal:directory")
              return wt.errors = [
                {
                  instancePath: t + "/resource",
                  schemaPath: "#/properties/resource/const",
                  keyword: "const",
                  params: {
                    allowedValue: "literal:directory"
                  },
                  message: "must be equal to constant"
                }
              ], !1;
            var l = u === r;
          } else
            var l = !0;
          if (l) {
            if (e.files !== void 0) {
              const f = r;
              Kt(e.files, {
                instancePath: t + "/files",
                parentData: e,
                parentDataProperty: "files",
                rootData: o
              }) || (n = n === null ? Kt.errors : n.concat(Kt.errors), r = n.length);
              var l = f === r;
            } else
              var l = !0;
            if (l)
              if (e.name !== void 0) {
                const f = r;
                if (typeof e.name != "string")
                  return wt.errors = [
                    {
                      instancePath: t + "/name",
                      schemaPath: "#/properties/name/type",
                      keyword: "type",
                      params: { type: "string" },
                      message: "must be string"
                    }
                  ], !1;
                var l = f === r;
              } else
                var l = !0;
          }
        }
      }
    } else
      return wt.errors = [
        {
          instancePath: t,
          schemaPath: "#/type",
          keyword: "type",
          params: { type: "object" },
          message: "must be object"
        }
      ], !1;
  return wt.errors = n, r === 0;
}
function Me(e, { instancePath: t = "", parentData: s, parentDataProperty: i, rootData: o = e } = {}) {
  let n = null, r = 0;
  const l = r;
  let p = !1;
  const c = r;
  De(e, {
    instancePath: t,
    parentData: s,
    parentDataProperty: i,
    rootData: o
  }) || (n = n === null ? De.errors : n.concat(De.errors), r = n.length);
  var f = c === r;
  if (p = p || f, !p) {
    const u = r;
    wt(e, {
      instancePath: t,
      parentData: s,
      parentDataProperty: i,
      rootData: o
    }) || (n = n === null ? wt.errors : n.concat(wt.errors), r = n.length);
    var f = u === r;
    p = p || f;
  }
  if (p)
    r = l, n !== null && (l ? n.length = l : n = null);
  else {
    const u = {
      instancePath: t,
      schemaPath: "#/anyOf",
      keyword: "anyOf",
      params: {},
      message: "must match a schema in anyOf"
    };
    return n === null ? n = [u] : n.push(u), r++, Me.errors = n, !1;
  }
  return Me.errors = n, r === 0;
}
function ct(e, { instancePath: t = "", parentData: s, parentDataProperty: i, rootData: o = e } = {}) {
  let n = null, r = 0;
  if (r === 0)
    if (e && typeof e == "object" && !Array.isArray(e)) {
      let c;
      if (e.resource === void 0 && (c = "resource") || e.inner === void 0 && (c = "inner"))
        return ct.errors = [
          {
            instancePath: t,
            schemaPath: "#/required",
            keyword: "required",
            params: { missingProperty: c },
            message: "must have required property '" + c + "'"
          }
        ], !1;
      {
        const f = r;
        for (const u in e)
          if (!(u === "resource" || u === "inner" || u === "name"))
            return ct.errors = [
              {
                instancePath: t,
                schemaPath: "#/additionalProperties",
                keyword: "additionalProperties",
                params: { additionalProperty: u },
                message: "must NOT have additional properties"
              }
            ], !1;
        if (f === r) {
          if (e.resource !== void 0) {
            let u = e.resource;
            const g = r;
            if (typeof u != "string")
              return ct.errors = [
                {
                  instancePath: t + "/resource",
                  schemaPath: "#/properties/resource/type",
                  keyword: "type",
                  params: { type: "string" },
                  message: "must be string"
                }
              ], !1;
            if (u !== "zip")
              return ct.errors = [
                {
                  instancePath: t + "/resource",
                  schemaPath: "#/properties/resource/const",
                  keyword: "const",
                  params: { allowedValue: "zip" },
                  message: "must be equal to constant"
                }
              ], !1;
            var l = g === r;
          } else
            var l = !0;
          if (l) {
            if (e.inner !== void 0) {
              let u = e.inner;
              const g = r, w = r;
              let O = !1;
              const m = r;
              dn.validate(u, {
                instancePath: t + "/inner",
                parentData: e,
                parentDataProperty: "inner",
                rootData: o
              }) || (n = n === null ? dn.validate.errors : n.concat(
                dn.validate.errors
              ), r = n.length);
              var p = m === r;
              if (O = O || p, !O) {
                const _ = r;
                Me(u, {
                  instancePath: t + "/inner",
                  parentData: e,
                  parentDataProperty: "inner",
                  rootData: o
                }) || (n = n === null ? Me.errors : n.concat(Me.errors), r = n.length);
                var p = _ === r;
                O = O || p;
              }
              if (O)
                r = w, n !== null && (w ? n.length = w : n = null);
              else {
                const _ = {
                  instancePath: t + "/inner",
                  schemaPath: "#/properties/inner/anyOf",
                  keyword: "anyOf",
                  params: {},
                  message: "must match a schema in anyOf"
                };
                return n === null ? n = [_] : n.push(_), r++, ct.errors = n, !1;
              }
              var l = g === r;
            } else
              var l = !0;
            if (l)
              if (e.name !== void 0) {
                const u = r;
                if (typeof e.name != "string")
                  return ct.errors = [
                    {
                      instancePath: t + "/name",
                      schemaPath: "#/properties/name/type",
                      keyword: "type",
                      params: { type: "string" },
                      message: "must be string"
                    }
                  ], !1;
                var l = u === r;
              } else
                var l = !0;
          }
        }
      }
    } else
      return ct.errors = [
        {
          instancePath: t,
          schemaPath: "#/type",
          keyword: "type",
          params: { type: "object" },
          message: "must be object"
        }
      ], !1;
  return ct.errors = n, r === 0;
}
function ce(e, { instancePath: t = "", parentData: s, parentDataProperty: i, rootData: o = e } = {}) {
  let n = null, r = 0;
  const l = r;
  let p = !1;
  const c = r;
  if (r === r)
    if (e && typeof e == "object" && !Array.isArray(e)) {
      let E;
      if (e.resource === void 0 && (E = "resource") || e.path === void 0 && (E = "path")) {
        const A = {
          instancePath: t,
          schemaPath: "#/definitions/VFSReference/required",
          keyword: "required",
          params: { missingProperty: E },
          message: "must have required property '" + E + "'"
        };
        n === null ? n = [A] : n.push(A), r++;
      } else {
        const A = r;
        for (const C in e)
          if (!(C === "resource" || C === "path")) {
            const b = {
              instancePath: t,
              schemaPath: "#/definitions/VFSReference/additionalProperties",
              keyword: "additionalProperties",
              params: { additionalProperty: C },
              message: "must NOT have additional properties"
            };
            n === null ? n = [b] : n.push(b), r++;
            break;
          }
        if (A === r) {
          if (e.resource !== void 0) {
            let C = e.resource;
            const b = r;
            if (typeof C != "string") {
              const S = {
                instancePath: t + "/resource",
                schemaPath: "#/definitions/VFSReference/properties/resource/type",
                keyword: "type",
                params: { type: "string" },
                message: "must be string"
              };
              n === null ? n = [S] : n.push(S), r++;
            }
            if (C !== "vfs") {
              const S = {
                instancePath: t + "/resource",
                schemaPath: "#/definitions/VFSReference/properties/resource/const",
                keyword: "const",
                params: { allowedValue: "vfs" },
                message: "must be equal to constant"
              };
              n === null ? n = [S] : n.push(S), r++;
            }
            var u = b === r;
          } else
            var u = !0;
          if (u)
            if (e.path !== void 0) {
              const C = r;
              if (typeof e.path != "string") {
                const S = {
                  instancePath: t + "/path",
                  schemaPath: "#/definitions/VFSReference/properties/path/type",
                  keyword: "type",
                  params: { type: "string" },
                  message: "must be string"
                };
                n === null ? n = [S] : n.push(S), r++;
              }
              var u = C === r;
            } else
              var u = !0;
        }
      }
    } else {
      const E = {
        instancePath: t,
        schemaPath: "#/definitions/VFSReference/type",
        keyword: "type",
        params: { type: "object" },
        message: "must be object"
      };
      n === null ? n = [E] : n.push(E), r++;
    }
  var g = c === r;
  if (p = p || g, !p) {
    const E = r;
    if (r === r)
      if (e && typeof e == "object" && !Array.isArray(e)) {
        let b;
        if (e.resource === void 0 && (b = "resource") || e.name === void 0 && (b = "name") || e.contents === void 0 && (b = "contents")) {
          const S = {
            instancePath: t,
            schemaPath: "#/definitions/LiteralReference/required",
            keyword: "required",
            params: { missingProperty: b },
            message: "must have required property '" + b + "'"
          };
          n === null ? n = [S] : n.push(S), r++;
        } else {
          const S = r;
          for (const P in e)
            if (!(P === "resource" || P === "name" || P === "contents")) {
              const $ = {
                instancePath: t,
                schemaPath: "#/definitions/LiteralReference/additionalProperties",
                keyword: "additionalProperties",
                params: { additionalProperty: P },
                message: "must NOT have additional properties"
              };
              n === null ? n = [$] : n.push($), r++;
              break;
            }
          if (S === r) {
            if (e.resource !== void 0) {
              let P = e.resource;
              const $ = r;
              if (typeof P != "string") {
                const L = {
                  instancePath: t + "/resource",
                  schemaPath: "#/definitions/LiteralReference/properties/resource/type",
                  keyword: "type",
                  params: { type: "string" },
                  message: "must be string"
                };
                n === null ? n = [L] : n.push(L), r++;
              }
              if (P !== "literal") {
                const L = {
                  instancePath: t + "/resource",
                  schemaPath: "#/definitions/LiteralReference/properties/resource/const",
                  keyword: "const",
                  params: { allowedValue: "literal" },
                  message: "must be equal to constant"
                };
                n === null ? n = [L] : n.push(L), r++;
              }
              var w = $ === r;
            } else
              var w = !0;
            if (w) {
              if (e.name !== void 0) {
                const P = r;
                if (typeof e.name != "string") {
                  const L = {
                    instancePath: t + "/name",
                    schemaPath: "#/definitions/LiteralReference/properties/name/type",
                    keyword: "type",
                    params: { type: "string" },
                    message: "must be string"
                  };
                  n === null ? n = [L] : n.push(L), r++;
                }
                var w = P === r;
              } else
                var w = !0;
              if (w)
                if (e.contents !== void 0) {
                  let P = e.contents;
                  const $ = r, L = r;
                  let x = !1;
                  const I = r;
                  if (typeof P != "string") {
                    const N = {
                      instancePath: t + "/contents",
                      schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/0/type",
                      keyword: "type",
                      params: { type: "string" },
                      message: "must be string"
                    };
                    n === null ? n = [N] : n.push(N), r++;
                  }
                  var O = I === r;
                  if (x = x || O, !x) {
                    const N = r;
                    if (r === N)
                      if (P && typeof P == "object" && !Array.isArray(P)) {
                        let B;
                        if (P.BYTES_PER_ELEMENT === void 0 && (B = "BYTES_PER_ELEMENT") || P.buffer === void 0 && (B = "buffer") || P.byteLength === void 0 && (B = "byteLength") || P.byteOffset === void 0 && (B = "byteOffset") || P.length === void 0 && (B = "length")) {
                          const H = {
                            instancePath: t + "/contents",
                            schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/required",
                            keyword: "required",
                            params: {
                              missingProperty: B
                            },
                            message: "must have required property '" + B + "'"
                          };
                          n === null ? n = [H] : n.push(H), r++;
                        } else {
                          const H = r;
                          for (const U in P)
                            if (!(U === "BYTES_PER_ELEMENT" || U === "buffer" || U === "byteLength" || U === "byteOffset" || U === "length")) {
                              let Y = P[U];
                              const J = r;
                              if (!(typeof Y == "number" && isFinite(
                                Y
                              ))) {
                                const M = {
                                  instancePath: t + "/contents/" + U.replace(
                                    /~/g,
                                    "~0"
                                  ).replace(
                                    /\//g,
                                    "~1"
                                  ),
                                  schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/additionalProperties/type",
                                  keyword: "type",
                                  params: {
                                    type: "number"
                                  },
                                  message: "must be number"
                                };
                                n === null ? n = [
                                  M
                                ] : n.push(
                                  M
                                ), r++;
                              }
                              var m = J === r;
                              if (!m)
                                break;
                            }
                          if (H === r) {
                            if (P.BYTES_PER_ELEMENT !== void 0) {
                              let U = P.BYTES_PER_ELEMENT;
                              const Y = r;
                              if (!(typeof U == "number" && isFinite(
                                U
                              ))) {
                                const J = {
                                  instancePath: t + "/contents/BYTES_PER_ELEMENT",
                                  schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/properties/BYTES_PER_ELEMENT/type",
                                  keyword: "type",
                                  params: {
                                    type: "number"
                                  },
                                  message: "must be number"
                                };
                                n === null ? n = [
                                  J
                                ] : n.push(
                                  J
                                ), r++;
                              }
                              var h = Y === r;
                            } else
                              var h = !0;
                            if (h) {
                              if (P.buffer !== void 0) {
                                let U = P.buffer;
                                const Y = r;
                                if (r === Y)
                                  if (U && typeof U == "object" && !Array.isArray(
                                    U
                                  )) {
                                    let M;
                                    if (U.byteLength === void 0 && (M = "byteLength")) {
                                      const te = {
                                        instancePath: t + "/contents/buffer",
                                        schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/properties/buffer/required",
                                        keyword: "required",
                                        params: {
                                          missingProperty: M
                                        },
                                        message: "must have required property '" + M + "'"
                                      };
                                      n === null ? n = [
                                        te
                                      ] : n.push(
                                        te
                                      ), r++;
                                    } else {
                                      const te = r;
                                      for (const se in U)
                                        if (se !== "byteLength") {
                                          const X = {
                                            instancePath: t + "/contents/buffer",
                                            schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/properties/buffer/additionalProperties",
                                            keyword: "additionalProperties",
                                            params: {
                                              additionalProperty: se
                                            },
                                            message: "must NOT have additional properties"
                                          };
                                          n === null ? n = [
                                            X
                                          ] : n.push(
                                            X
                                          ), r++;
                                          break;
                                        }
                                      if (te === r && U.byteLength !== void 0) {
                                        let se = U.byteLength;
                                        if (!(typeof se == "number" && isFinite(
                                          se
                                        ))) {
                                          const X = {
                                            instancePath: t + "/contents/buffer/byteLength",
                                            schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/properties/buffer/properties/byteLength/type",
                                            keyword: "type",
                                            params: {
                                              type: "number"
                                            },
                                            message: "must be number"
                                          };
                                          n === null ? n = [
                                            X
                                          ] : n.push(
                                            X
                                          ), r++;
                                        }
                                      }
                                    }
                                  } else {
                                    const M = {
                                      instancePath: t + "/contents/buffer",
                                      schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/properties/buffer/type",
                                      keyword: "type",
                                      params: {
                                        type: "object"
                                      },
                                      message: "must be object"
                                    };
                                    n === null ? n = [
                                      M
                                    ] : n.push(
                                      M
                                    ), r++;
                                  }
                                var h = Y === r;
                              } else
                                var h = !0;
                              if (h) {
                                if (P.byteLength !== void 0) {
                                  let U = P.byteLength;
                                  const Y = r;
                                  if (!(typeof U == "number" && isFinite(
                                    U
                                  ))) {
                                    const M = {
                                      instancePath: t + "/contents/byteLength",
                                      schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/properties/byteLength/type",
                                      keyword: "type",
                                      params: {
                                        type: "number"
                                      },
                                      message: "must be number"
                                    };
                                    n === null ? n = [
                                      M
                                    ] : n.push(
                                      M
                                    ), r++;
                                  }
                                  var h = Y === r;
                                } else
                                  var h = !0;
                                if (h) {
                                  if (P.byteOffset !== void 0) {
                                    let U = P.byteOffset;
                                    const Y = r;
                                    if (!(typeof U == "number" && isFinite(
                                      U
                                    ))) {
                                      const M = {
                                        instancePath: t + "/contents/byteOffset",
                                        schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/properties/byteOffset/type",
                                        keyword: "type",
                                        params: {
                                          type: "number"
                                        },
                                        message: "must be number"
                                      };
                                      n === null ? n = [
                                        M
                                      ] : n.push(
                                        M
                                      ), r++;
                                    }
                                    var h = Y === r;
                                  } else
                                    var h = !0;
                                  if (h)
                                    if (P.length !== void 0) {
                                      let U = P.length;
                                      const Y = r;
                                      if (!(typeof U == "number" && isFinite(
                                        U
                                      ))) {
                                        const M = {
                                          instancePath: t + "/contents/length",
                                          schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/properties/length/type",
                                          keyword: "type",
                                          params: {
                                            type: "number"
                                          },
                                          message: "must be number"
                                        };
                                        n === null ? n = [
                                          M
                                        ] : n.push(
                                          M
                                        ), r++;
                                      }
                                      var h = Y === r;
                                    } else
                                      var h = !0;
                                }
                              }
                            }
                          }
                        }
                      } else {
                        const B = {
                          instancePath: t + "/contents",
                          schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf/1/type",
                          keyword: "type",
                          params: { type: "object" },
                          message: "must be object"
                        };
                        n === null ? n = [B] : n.push(B), r++;
                      }
                    var O = N === r;
                    x = x || O;
                  }
                  if (x)
                    r = L, n !== null && (L ? n.length = L : n = null);
                  else {
                    const N = {
                      instancePath: t + "/contents",
                      schemaPath: "#/definitions/LiteralReference/properties/contents/anyOf",
                      keyword: "anyOf",
                      params: {},
                      message: "must match a schema in anyOf"
                    };
                    n === null ? n = [N] : n.push(N), r++;
                  }
                  var w = $ === r;
                } else
                  var w = !0;
            }
          }
        }
      } else {
        const b = {
          instancePath: t,
          schemaPath: "#/definitions/LiteralReference/type",
          keyword: "type",
          params: { type: "object" },
          message: "must be object"
        };
        n === null ? n = [b] : n.push(b), r++;
      }
    var g = E === r;
    if (p = p || g, !p) {
      const b = r;
      if (r === r)
        if (e && typeof e == "object" && !Array.isArray(e)) {
          let $;
          if (e.resource === void 0 && ($ = "resource") || e.slug === void 0 && ($ = "slug")) {
            const L = {
              instancePath: t,
              schemaPath: "#/definitions/CoreThemeReference/required",
              keyword: "required",
              params: { missingProperty: $ },
              message: "must have required property '" + $ + "'"
            };
            n === null ? n = [L] : n.push(L), r++;
          } else {
            const L = r;
            for (const x in e)
              if (!(x === "resource" || x === "slug")) {
                const I = {
                  instancePath: t,
                  schemaPath: "#/definitions/CoreThemeReference/additionalProperties",
                  keyword: "additionalProperties",
                  params: { additionalProperty: x },
                  message: "must NOT have additional properties"
                };
                n === null ? n = [I] : n.push(I), r++;
                break;
              }
            if (L === r) {
              if (e.resource !== void 0) {
                let x = e.resource;
                const I = r;
                if (typeof x != "string") {
                  const q = {
                    instancePath: t + "/resource",
                    schemaPath: "#/definitions/CoreThemeReference/properties/resource/type",
                    keyword: "type",
                    params: { type: "string" },
                    message: "must be string"
                  };
                  n === null ? n = [q] : n.push(q), r++;
                }
                if (x !== "wordpress.org/themes") {
                  const q = {
                    instancePath: t + "/resource",
                    schemaPath: "#/definitions/CoreThemeReference/properties/resource/const",
                    keyword: "const",
                    params: {
                      allowedValue: "wordpress.org/themes"
                    },
                    message: "must be equal to constant"
                  };
                  n === null ? n = [q] : n.push(q), r++;
                }
                var _ = I === r;
              } else
                var _ = !0;
              if (_)
                if (e.slug !== void 0) {
                  const x = r;
                  if (typeof e.slug != "string") {
                    const q = {
                      instancePath: t + "/slug",
                      schemaPath: "#/definitions/CoreThemeReference/properties/slug/type",
                      keyword: "type",
                      params: { type: "string" },
                      message: "must be string"
                    };
                    n === null ? n = [q] : n.push(q), r++;
                  }
                  var _ = x === r;
                } else
                  var _ = !0;
            }
          }
        } else {
          const $ = {
            instancePath: t,
            schemaPath: "#/definitions/CoreThemeReference/type",
            keyword: "type",
            params: { type: "object" },
            message: "must be object"
          };
          n === null ? n = [$] : n.push($), r++;
        }
      var g = b === r;
      if (p = p || g, !p) {
        const $ = r;
        if (r === r)
          if (e && typeof e == "object" && !Array.isArray(e)) {
            let I;
            if (e.resource === void 0 && (I = "resource") || e.slug === void 0 && (I = "slug")) {
              const q = {
                instancePath: t,
                schemaPath: "#/definitions/CorePluginReference/required",
                keyword: "required",
                params: { missingProperty: I },
                message: "must have required property '" + I + "'"
              };
              n === null ? n = [q] : n.push(q), r++;
            } else {
              const q = r;
              for (const N in e)
                if (!(N === "resource" || N === "slug")) {
                  const z = {
                    instancePath: t,
                    schemaPath: "#/definitions/CorePluginReference/additionalProperties",
                    keyword: "additionalProperties",
                    params: { additionalProperty: N },
                    message: "must NOT have additional properties"
                  };
                  n === null ? n = [z] : n.push(z), r++;
                  break;
                }
              if (q === r) {
                if (e.resource !== void 0) {
                  let N = e.resource;
                  const z = r;
                  if (typeof N != "string") {
                    const B = {
                      instancePath: t + "/resource",
                      schemaPath: "#/definitions/CorePluginReference/properties/resource/type",
                      keyword: "type",
                      params: { type: "string" },
                      message: "must be string"
                    };
                    n === null ? n = [B] : n.push(B), r++;
                  }
                  if (N !== "wordpress.org/plugins") {
                    const B = {
                      instancePath: t + "/resource",
                      schemaPath: "#/definitions/CorePluginReference/properties/resource/const",
                      keyword: "const",
                      params: {
                        allowedValue: "wordpress.org/plugins"
                      },
                      message: "must be equal to constant"
                    };
                    n === null ? n = [B] : n.push(B), r++;
                  }
                  var k = z === r;
                } else
                  var k = !0;
                if (k)
                  if (e.slug !== void 0) {
                    const N = r;
                    if (typeof e.slug != "string") {
                      const B = {
                        instancePath: t + "/slug",
                        schemaPath: "#/definitions/CorePluginReference/properties/slug/type",
                        keyword: "type",
                        params: { type: "string" },
                        message: "must be string"
                      };
                      n === null ? n = [B] : n.push(B), r++;
                    }
                    var k = N === r;
                  } else
                    var k = !0;
              }
            }
          } else {
            const I = {
              instancePath: t,
              schemaPath: "#/definitions/CorePluginReference/type",
              keyword: "type",
              params: { type: "object" },
              message: "must be object"
            };
            n === null ? n = [I] : n.push(I), r++;
          }
        var g = $ === r;
        if (p = p || g, !p) {
          const I = r;
          if (r === r)
            if (e && typeof e == "object" && !Array.isArray(e)) {
              let z;
              if (e.resource === void 0 && (z = "resource") || e.url === void 0 && (z = "url")) {
                const B = {
                  instancePath: t,
                  schemaPath: "#/definitions/UrlReference/required",
                  keyword: "required",
                  params: { missingProperty: z },
                  message: "must have required property '" + z + "'"
                };
                n === null ? n = [B] : n.push(B), r++;
              } else {
                const B = r;
                for (const H in e)
                  if (!(H === "resource" || H === "url" || H === "caption")) {
                    const U = {
                      instancePath: t,
                      schemaPath: "#/definitions/UrlReference/additionalProperties",
                      keyword: "additionalProperties",
                      params: {
                        additionalProperty: H
                      },
                      message: "must NOT have additional properties"
                    };
                    n === null ? n = [U] : n.push(U), r++;
                    break;
                  }
                if (B === r) {
                  if (e.resource !== void 0) {
                    let H = e.resource;
                    const U = r;
                    if (typeof H != "string") {
                      const Y = {
                        instancePath: t + "/resource",
                        schemaPath: "#/definitions/UrlReference/properties/resource/type",
                        keyword: "type",
                        params: { type: "string" },
                        message: "must be string"
                      };
                      n === null ? n = [Y] : n.push(Y), r++;
                    }
                    if (H !== "url") {
                      const Y = {
                        instancePath: t + "/resource",
                        schemaPath: "#/definitions/UrlReference/properties/resource/const",
                        keyword: "const",
                        params: { allowedValue: "url" },
                        message: "must be equal to constant"
                      };
                      n === null ? n = [Y] : n.push(Y), r++;
                    }
                    var v = U === r;
                  } else
                    var v = !0;
                  if (v) {
                    if (e.url !== void 0) {
                      const H = r;
                      if (typeof e.url != "string") {
                        const Y = {
                          instancePath: t + "/url",
                          schemaPath: "#/definitions/UrlReference/properties/url/type",
                          keyword: "type",
                          params: { type: "string" },
                          message: "must be string"
                        };
                        n === null ? n = [Y] : n.push(Y), r++;
                      }
                      var v = H === r;
                    } else
                      var v = !0;
                    if (v)
                      if (e.caption !== void 0) {
                        const H = r;
                        if (typeof e.caption != "string") {
                          const Y = {
                            instancePath: t + "/caption",
                            schemaPath: "#/definitions/UrlReference/properties/caption/type",
                            keyword: "type",
                            params: {
                              type: "string"
                            },
                            message: "must be string"
                          };
                          n === null ? n = [Y] : n.push(Y), r++;
                        }
                        var v = H === r;
                      } else
                        var v = !0;
                  }
                }
              }
            } else {
              const z = {
                instancePath: t,
                schemaPath: "#/definitions/UrlReference/type",
                keyword: "type",
                params: { type: "object" },
                message: "must be object"
              };
              n === null ? n = [z] : n.push(z), r++;
            }
          var g = I === r;
          if (p = p || g, !p) {
            const z = r;
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let U;
                if (e.resource === void 0 && (U = "resource") || e.path === void 0 && (U = "path")) {
                  const Y = {
                    instancePath: t,
                    schemaPath: "#/definitions/BundledReference/required",
                    keyword: "required",
                    params: { missingProperty: U },
                    message: "must have required property '" + U + "'"
                  };
                  n === null ? n = [Y] : n.push(Y), r++;
                } else {
                  const Y = r;
                  for (const J in e)
                    if (!(J === "resource" || J === "path")) {
                      const M = {
                        instancePath: t,
                        schemaPath: "#/definitions/BundledReference/additionalProperties",
                        keyword: "additionalProperties",
                        params: {
                          additionalProperty: J
                        },
                        message: "must NOT have additional properties"
                      };
                      n === null ? n = [M] : n.push(M), r++;
                      break;
                    }
                  if (Y === r) {
                    if (e.resource !== void 0) {
                      let J = e.resource;
                      const M = r;
                      if (typeof J != "string") {
                        const te = {
                          instancePath: t + "/resource",
                          schemaPath: "#/definitions/BundledReference/properties/resource/type",
                          keyword: "type",
                          params: { type: "string" },
                          message: "must be string"
                        };
                        n === null ? n = [te] : n.push(te), r++;
                      }
                      if (J !== "bundled") {
                        const te = {
                          instancePath: t + "/resource",
                          schemaPath: "#/definitions/BundledReference/properties/resource/const",
                          keyword: "const",
                          params: {
                            allowedValue: "bundled"
                          },
                          message: "must be equal to constant"
                        };
                        n === null ? n = [te] : n.push(te), r++;
                      }
                      var R = M === r;
                    } else
                      var R = !0;
                    if (R)
                      if (e.path !== void 0) {
                        const J = r;
                        if (typeof e.path != "string") {
                          const te = {
                            instancePath: t + "/path",
                            schemaPath: "#/definitions/BundledReference/properties/path/type",
                            keyword: "type",
                            params: {
                              type: "string"
                            },
                            message: "must be string"
                          };
                          n === null ? n = [te] : n.push(te), r++;
                        }
                        var R = J === r;
                      } else
                        var R = !0;
                  }
                }
              } else {
                const U = {
                  instancePath: t,
                  schemaPath: "#/definitions/BundledReference/type",
                  keyword: "type",
                  params: { type: "object" },
                  message: "must be object"
                };
                n === null ? n = [U] : n.push(U), r++;
              }
            var g = z === r;
            if (p = p || g, !p) {
              const U = r;
              ct(e, {
                instancePath: t,
                parentData: s,
                parentDataProperty: i,
                rootData: o
              }) || (n = n === null ? ct.errors : n.concat(ct.errors), r = n.length);
              var g = U === r;
              p = p || g;
            }
          }
        }
      }
    }
  }
  if (p)
    r = l, n !== null && (l ? n.length = l : n = null);
  else {
    const E = {
      instancePath: t,
      schemaPath: "#/anyOf",
      keyword: "anyOf",
      params: {},
      message: "must match a schema in anyOf"
    };
    return n === null ? n = [E] : n.push(E), r++, ce.errors = n, !1;
  }
  return ce.errors = n, r === 0;
}
const zt = {
  oneOf: [
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "activatePlugin" },
        pluginPath: {
          type: "string",
          description: "Path to the plugin directory as absolute path (/wordpress/wp-content/plugins/plugin-name); or the plugin entry file relative to the plugins directory (plugin-name/plugin-name.php)."
        },
        pluginName: {
          type: "string",
          description: "Optional. Plugin name to display in the progress bar."
        }
      },
      required: ["pluginPath", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "activateTheme" },
        themeFolderName: {
          type: "string",
          description: "The name of the theme folder inside wp-content/themes/"
        }
      },
      required: ["step", "themeFolderName"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "cp" },
        fromPath: { type: "string", description: "Source path" },
        toPath: { type: "string", description: "Target path" }
      },
      required: ["fromPath", "step", "toPath"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "defineWpConfigConsts" },
        consts: {
          type: "object",
          additionalProperties: {},
          description: "The constants to define"
        },
        method: {
          type: "string",
          enum: ["rewrite-wp-config", "define-before-run"],
          description: `The method of defining the constants in wp-config.php. Possible values are:

- rewrite-wp-config: Default. Rewrites the wp-config.php file to                      explicitly call define() with the requested                      name and value. This method alters the file                      on the disk, but it doesn't conflict with                      existing define() calls in wp-config.php.

- define-before-run: Defines the constant before running the requested                      script. It doesn't alter any files on the disk, but                      constants defined this way may conflict with existing                      define() calls in wp-config.php.`
        },
        virtualize: {
          type: "boolean",
          deprecated: `This option is noop and will be removed in a future version.
This option is only kept in here to avoid breaking Blueprint schema validation
for existing apps using this option.`
        }
      },
      required: ["consts", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "defineSiteUrl" },
        siteUrl: { type: "string", description: "The URL" }
      },
      required: ["siteUrl", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "enableMultisite" },
        wpCliPath: { type: "string", description: "wp-cli.phar path" }
      },
      required: ["step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "importWxr" },
        file: {
          $ref: "#/definitions/FileReference",
          description: "The file to import"
        },
        fetchAttachments: {
          type: "boolean",
          description: "Whether to fetch and import attachment files referenced by the WXR file.",
          default: !0
        },
        rewriteUrls: {
          type: "boolean",
          description: "Whether to rewrite imported URLs to the current site URL.",
          default: !0
        },
        urlMapping: {
          type: "object",
          additionalProperties: { type: "string" },
          description: "Explicit URL replacements to apply when URL rewriting is enabled."
        },
        importComments: {
          type: "boolean",
          description: "Whether to import comments from the WXR file.",
          default: !0
        },
        defaultAuthorUsername: {
          type: "string",
          description: "The fallback local user for imported authors that cannot be mapped.",
          default: "admin"
        },
        authorsMode: {
          type: "string",
          enum: ["create", "default-author", "map"],
          description: "How to assign imported WXR authors to local WordPress users.",
          default: "default-author"
        },
        authorsMap: {
          type: "object",
          additionalProperties: { type: "string" },
          description: "Remote WXR author usernames keyed to existing local usernames."
        },
        importUsers: {
          type: "boolean",
          description: "Whether to create local users for imported WXR authors.",
          default: !1
        },
        importer: {
          type: "string",
          enum: ["data-liberation", "default"],
          description: "The importer to use. Possible values:\n\n- `default`: The importer from https://github.com/humanmade/WordPress-Importer\n- `data-liberation`: The experimental Data Liberation WXR importer developed at                      https://github.com/WordPress/wordpress-playground/issues/1894\n\nThis option is deprecated. The syntax will not be removed, but once the Data Liberation importer matures, it will become the only supported importer and the `importer` option will be ignored.",
          deprecated: !0
        }
      },
      required: ["file", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: {
          type: "string",
          const: "importThemeStarterContent",
          description: "The step identifier."
        },
        themeSlug: {
          type: "string",
          description: "The name of the theme to import content from."
        }
      },
      required: ["step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "importWordPressFiles" },
        wordPressFilesZip: {
          $ref: "#/definitions/FileReference",
          description: "The zip file containing the top-level WordPress files and directories."
        },
        pathInZip: {
          type: "string",
          description: "The path inside the zip file where the WordPress files are."
        }
      },
      required: ["step", "wordPressFilesZip"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        ifAlreadyInstalled: {
          type: "string",
          enum: ["overwrite", "skip", "error"],
          description: "What to do if the asset already exists."
        },
        step: {
          type: "string",
          const: "installPlugin",
          description: "The step identifier."
        },
        pluginData: {
          anyOf: [
            { $ref: "#/definitions/FileReference" },
            { $ref: "#/definitions/DirectoryReference" }
          ],
          description: "The plugin files to install. It can be a plugin zip file, a single PHP file, or a directory containing all the plugin files at its root."
        },
        pluginZipFile: {
          $ref: "#/definitions/FileReference",
          deprecated: ". Use 'pluginData' instead."
        },
        options: {
          $ref: "#/definitions/InstallPluginOptions",
          description: "Optional installation options."
        }
      },
      required: ["pluginData", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        ifAlreadyInstalled: {
          type: "string",
          enum: ["overwrite", "skip", "error"],
          description: "What to do if the asset already exists."
        },
        step: {
          type: "string",
          const: "installTheme",
          description: "The step identifier."
        },
        themeData: {
          anyOf: [
            { $ref: "#/definitions/FileReference" },
            { $ref: "#/definitions/DirectoryReference" }
          ],
          description: "The theme files to install. It can be either a theme zip file, or a directory containing all the theme files at its root."
        },
        themeZipFile: {
          $ref: "#/definitions/FileReference",
          deprecated: ". Use 'themeData' instead."
        },
        options: {
          $ref: "#/definitions/InstallThemeOptions",
          description: "Optional installation options."
        }
      },
      required: ["step", "themeData"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "login" },
        username: {
          type: "string",
          description: "The user to log in as. Defaults to 'admin'."
        },
        password: {
          type: "string",
          deprecated: `The password field is deprecated and will be removed in a future version.
Only the username field is required for user authentication.`
        }
      },
      required: ["step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "mkdir" },
        path: {
          type: "string",
          description: "The path of the directory you want to create"
        }
      },
      required: ["path", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "mv" },
        fromPath: { type: "string", description: "Source path" },
        toPath: { type: "string", description: "Target path" }
      },
      required: ["fromPath", "step", "toPath"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "resetData" },
        contentTypes: {
          type: "array",
          items: {
            type: "string",
            enum: ["posts", "pages", "comments"]
          },
          description: "Content types to remove. When omitted, all posts, pages, custom post types, and comments are removed."
        }
      },
      required: ["step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "request" },
        request: {
          $ref: "#/definitions/PHPRequest",
          description: "Request details (See /wordpress-playground/api/universal/interface/PHPRequest)"
        }
      },
      required: ["request", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "rm" },
        path: { type: "string", description: "The path to remove" }
      },
      required: ["path", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "rmdir" },
        path: { type: "string", description: "The path to remove" }
      },
      required: ["path", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: {
          type: "string",
          const: "runPHP",
          description: "The step identifier."
        },
        code: {
          anyOf: [
            { type: "string" },
            {
              type: "object",
              properties: {
                filename: {
                  type: "string",
                  description: "This property is ignored during Blueprint v1 execution but exists so the same runPHP step structure can be used for Blueprints v1 and v2."
                },
                content: { type: "string" }
              },
              required: ["filename", "content"],
              additionalProperties: !1
            }
          ],
          description: "The PHP code to run."
        }
      },
      required: ["code", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "runPHPWithOptions" },
        options: {
          $ref: "#/definitions/PHPRunOptions",
          description: "Run options (See /wordpress-playground/api/universal/interface/PHPRunOptions/))"
        }
      },
      required: ["options", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "runWpInstallationWizard" },
        options: { $ref: "#/definitions/WordPressInstallationOptions" }
      },
      required: ["options", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: {
          type: "string",
          const: "runSql",
          description: "The step identifier."
        },
        sql: {
          $ref: "#/definitions/FileReference",
          description: "The SQL to run. Each non-empty line must contain a valid SQL query."
        }
      },
      required: ["sql", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: {
          type: "string",
          const: "setSiteOptions",
          description: 'The name of the step. Must be "setSiteOptions".'
        },
        options: {
          type: "object",
          additionalProperties: {},
          description: "The options to set on the site."
        }
      },
      required: ["options", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "unzip" },
        zipFile: {
          $ref: "#/definitions/FileReference",
          description: "The zip file to extract"
        },
        zipPath: {
          type: "string",
          description: "The path of the zip file to extract",
          deprecated: "Use zipFile instead."
        },
        extractToPath: {
          type: "string",
          description: "The path to extract the zip file to"
        }
      },
      required: ["extractToPath", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "updateUserMeta" },
        meta: {
          type: "object",
          additionalProperties: {},
          description: 'An object of user meta values to set, e.g. { "first_name": "John" }'
        },
        userId: { type: "number", description: "User ID" }
      },
      required: ["meta", "step", "userId"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "writeFile" },
        path: {
          type: "string",
          description: "The path of the file to write to"
        },
        data: {
          anyOf: [
            { $ref: "#/definitions/FileReference" },
            { type: "string" },
            {
              type: "object",
              properties: {
                BYTES_PER_ELEMENT: { type: "number" },
                buffer: {
                  type: "object",
                  properties: {
                    byteLength: { type: "number" }
                  },
                  required: ["byteLength"],
                  additionalProperties: !1
                },
                byteLength: { type: "number" },
                byteOffset: { type: "number" },
                length: { type: "number" }
              },
              required: [
                "BYTES_PER_ELEMENT",
                "buffer",
                "byteLength",
                "byteOffset",
                "length"
              ],
              additionalProperties: { type: "number" }
            }
          ],
          description: "The data to write"
        }
      },
      required: ["data", "path", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "writeFiles" },
        writeToPath: {
          type: "string",
          description: "The path of the file to write to"
        },
        filesTree: {
          $ref: "#/definitions/DirectoryReference",
          description: "The 'filesTree' defines the directory structure, supporting 'literal:directory' or 'git:directory' types. The 'name' represents the root directory, while 'files' is an object where keys are file paths, and values contain either file content as a string or nested objects for subdirectories."
        }
      },
      required: ["filesTree", "step", "writeToPath"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: {
          type: "string",
          const: "wp-cli",
          description: "The step identifier."
        },
        command: {
          anyOf: [
            { type: "string" },
            { type: "array", items: { type: "string" } }
          ],
          description: "The WP CLI command to run."
        },
        wpCliPath: { type: "string", description: "wp-cli.phar path" }
      },
      required: ["command", "step"]
    },
    {
      type: "object",
      additionalProperties: !1,
      properties: {
        progress: {
          type: "object",
          properties: {
            weight: { type: "number" },
            caption: { type: "string" }
          },
          additionalProperties: !1
        },
        step: { type: "string", const: "setSiteLanguage" },
        language: {
          type: "string",
          description: "The language to set, e.g. 'en_US'"
        }
      },
      required: ["language", "step"]
    }
  ]
}, gm = {
  properties: {
    onError: {
      enum: ["skip-plugin", "throw"]
    }
  }
}, _m = {
  properties: {
    onError: {
      enum: ["skip-theme", "throw"]
    }
  }
}, _l = {
  enum: ["GET", "POST", "HEAD", "OPTIONS", "PATCH", "PUT", "DELETE"]
};
function Xe(e, { instancePath: t = "", parentData: s, parentDataProperty: i, rootData: o = e } = {}) {
  let n = null, r = 0;
  if (r === 0)
    if (e && typeof e == "object" && !Array.isArray(e)) {
      let _;
      if (e.url === void 0 && (_ = "url"))
        return Xe.errors = [
          {
            instancePath: t,
            schemaPath: "#/required",
            keyword: "required",
            params: { missingProperty: _ },
            message: "must have required property '" + _ + "'"
          }
        ], !1;
      {
        const k = r;
        for (const v in e)
          if (!(v === "method" || v === "url" || v === "headers" || v === "body"))
            return Xe.errors = [
              {
                instancePath: t,
                schemaPath: "#/additionalProperties",
                keyword: "additionalProperties",
                params: { additionalProperty: v },
                message: "must NOT have additional properties"
              }
            ], !1;
        if (k === r) {
          if (e.method !== void 0) {
            let v = e.method;
            const R = r;
            if (typeof v != "string")
              return Xe.errors = [
                {
                  instancePath: t + "/method",
                  schemaPath: "#/definitions/HTTPMethod/type",
                  keyword: "type",
                  params: { type: "string" },
                  message: "must be string"
                }
              ], !1;
            if (!(v === "GET" || v === "POST" || v === "HEAD" || v === "OPTIONS" || v === "PATCH" || v === "PUT" || v === "DELETE"))
              return Xe.errors = [
                {
                  instancePath: t + "/method",
                  schemaPath: "#/definitions/HTTPMethod/enum",
                  keyword: "enum",
                  params: { allowedValues: _l.enum },
                  message: "must be equal to one of the allowed values"
                }
              ], !1;
            var l = R === r;
          } else
            var l = !0;
          if (l) {
            if (e.url !== void 0) {
              const v = r;
              if (typeof e.url != "string")
                return Xe.errors = [
                  {
                    instancePath: t + "/url",
                    schemaPath: "#/properties/url/type",
                    keyword: "type",
                    params: { type: "string" },
                    message: "must be string"
                  }
                ], !1;
              var l = v === r;
            } else
              var l = !0;
            if (l) {
              if (e.headers !== void 0) {
                let v = e.headers;
                const R = r;
                if (r === r)
                  if (v && typeof v == "object" && !Array.isArray(v))
                    for (const C in v) {
                      const b = r;
                      if (typeof v[C] != "string")
                        return Xe.errors = [
                          {
                            instancePath: t + "/headers/" + C.replace(
                              /~/g,
                              "~0"
                            ).replace(
                              /\//g,
                              "~1"
                            ),
                            schemaPath: "#/definitions/PHPRequestHeaders/additionalProperties/type",
                            keyword: "type",
                            params: {
                              type: "string"
                            },
                            message: "must be string"
                          }
                        ], !1;
                      var p = b === r;
                      if (!p)
                        break;
                    }
                  else
                    return Xe.errors = [
                      {
                        instancePath: t + "/headers",
                        schemaPath: "#/definitions/PHPRequestHeaders/type",
                        keyword: "type",
                        params: { type: "object" },
                        message: "must be object"
                      }
                    ], !1;
                var l = R === r;
              } else
                var l = !0;
              if (l)
                if (e.body !== void 0) {
                  let v = e.body;
                  const R = r, E = r;
                  let A = !1;
                  const C = r;
                  if (typeof v != "string") {
                    const S = {
                      instancePath: t + "/body",
                      schemaPath: "#/properties/body/anyOf/0/type",
                      keyword: "type",
                      params: { type: "string" },
                      message: "must be string"
                    };
                    n === null ? n = [S] : n.push(S), r++;
                  }
                  var c = C === r;
                  if (A = A || c, !A) {
                    const S = r;
                    if (r === S)
                      if (v && typeof v == "object" && !Array.isArray(v)) {
                        let $;
                        if (v.BYTES_PER_ELEMENT === void 0 && ($ = "BYTES_PER_ELEMENT") || v.buffer === void 0 && ($ = "buffer") || v.byteLength === void 0 && ($ = "byteLength") || v.byteOffset === void 0 && ($ = "byteOffset") || v.length === void 0 && ($ = "length")) {
                          const L = {
                            instancePath: t + "/body",
                            schemaPath: "#/properties/body/anyOf/1/required",
                            keyword: "required",
                            params: {
                              missingProperty: $
                            },
                            message: "must have required property '" + $ + "'"
                          };
                          n === null ? n = [L] : n.push(L), r++;
                        } else {
                          const L = r;
                          for (const x in v)
                            if (!(x === "BYTES_PER_ELEMENT" || x === "buffer" || x === "byteLength" || x === "byteOffset" || x === "length")) {
                              let I = v[x];
                              const q = r;
                              if (!(typeof I == "number" && isFinite(
                                I
                              ))) {
                                const N = {
                                  instancePath: t + "/body/" + x.replace(
                                    /~/g,
                                    "~0"
                                  ).replace(
                                    /\//g,
                                    "~1"
                                  ),
                                  schemaPath: "#/properties/body/anyOf/1/additionalProperties/type",
                                  keyword: "type",
                                  params: {
                                    type: "number"
                                  },
                                  message: "must be number"
                                };
                                n === null ? n = [
                                  N
                                ] : n.push(
                                  N
                                ), r++;
                              }
                              var f = q === r;
                              if (!f)
                                break;
                            }
                          if (L === r) {
                            if (v.BYTES_PER_ELEMENT !== void 0) {
                              let x = v.BYTES_PER_ELEMENT;
                              const I = r;
                              if (!(typeof x == "number" && isFinite(
                                x
                              ))) {
                                const q = {
                                  instancePath: t + "/body/BYTES_PER_ELEMENT",
                                  schemaPath: "#/properties/body/anyOf/1/properties/BYTES_PER_ELEMENT/type",
                                  keyword: "type",
                                  params: {
                                    type: "number"
                                  },
                                  message: "must be number"
                                };
                                n === null ? n = [
                                  q
                                ] : n.push(
                                  q
                                ), r++;
                              }
                              var u = I === r;
                            } else
                              var u = !0;
                            if (u) {
                              if (v.buffer !== void 0) {
                                let x = v.buffer;
                                const I = r;
                                if (r === I)
                                  if (x && typeof x == "object" && !Array.isArray(
                                    x
                                  )) {
                                    let N;
                                    if (x.byteLength === void 0 && (N = "byteLength")) {
                                      const z = {
                                        instancePath: t + "/body/buffer",
                                        schemaPath: "#/properties/body/anyOf/1/properties/buffer/required",
                                        keyword: "required",
                                        params: {
                                          missingProperty: N
                                        },
                                        message: "must have required property '" + N + "'"
                                      };
                                      n === null ? n = [
                                        z
                                      ] : n.push(
                                        z
                                      ), r++;
                                    } else {
                                      const z = r;
                                      for (const B in x)
                                        if (B !== "byteLength") {
                                          const H = {
                                            instancePath: t + "/body/buffer",
                                            schemaPath: "#/properties/body/anyOf/1/properties/buffer/additionalProperties",
                                            keyword: "additionalProperties",
                                            params: {
                                              additionalProperty: B
                                            },
                                            message: "must NOT have additional properties"
                                          };
                                          n === null ? n = [
                                            H
                                          ] : n.push(
                                            H
                                          ), r++;
                                          break;
                                        }
                                      if (z === r && x.byteLength !== void 0) {
                                        let B = x.byteLength;
                                        if (!(typeof B == "number" && isFinite(
                                          B
                                        ))) {
                                          const H = {
                                            instancePath: t + "/body/buffer/byteLength",
                                            schemaPath: "#/properties/body/anyOf/1/properties/buffer/properties/byteLength/type",
                                            keyword: "type",
                                            params: {
                                              type: "number"
                                            },
                                            message: "must be number"
                                          };
                                          n === null ? n = [
                                            H
                                          ] : n.push(
                                            H
                                          ), r++;
                                        }
                                      }
                                    }
                                  } else {
                                    const N = {
                                      instancePath: t + "/body/buffer",
                                      schemaPath: "#/properties/body/anyOf/1/properties/buffer/type",
                                      keyword: "type",
                                      params: {
                                        type: "object"
                                      },
                                      message: "must be object"
                                    };
                                    n === null ? n = [
                                      N
                                    ] : n.push(
                                      N
                                    ), r++;
                                  }
                                var u = I === r;
                              } else
                                var u = !0;
                              if (u) {
                                if (v.byteLength !== void 0) {
                                  let x = v.byteLength;
                                  const I = r;
                                  if (!(typeof x == "number" && isFinite(
                                    x
                                  ))) {
                                    const N = {
                                      instancePath: t + "/body/byteLength",
                                      schemaPath: "#/properties/body/anyOf/1/properties/byteLength/type",
                                      keyword: "type",
                                      params: {
                                        type: "number"
                                      },
                                      message: "must be number"
                                    };
                                    n === null ? n = [
                                      N
                                    ] : n.push(
                                      N
                                    ), r++;
                                  }
                                  var u = I === r;
                                } else
                                  var u = !0;
                                if (u) {
                                  if (v.byteOffset !== void 0) {
                                    let x = v.byteOffset;
                                    const I = r;
                                    if (!(typeof x == "number" && isFinite(
                                      x
                                    ))) {
                                      const N = {
                                        instancePath: t + "/body/byteOffset",
                                        schemaPath: "#/properties/body/anyOf/1/properties/byteOffset/type",
                                        keyword: "type",
                                        params: {
                                          type: "number"
                                        },
                                        message: "must be number"
                                      };
                                      n === null ? n = [
                                        N
                                      ] : n.push(
                                        N
                                      ), r++;
                                    }
                                    var u = I === r;
                                  } else
                                    var u = !0;
                                  if (u)
                                    if (v.length !== void 0) {
                                      let x = v.length;
                                      const I = r;
                                      if (!(typeof x == "number" && isFinite(
                                        x
                                      ))) {
                                        const N = {
                                          instancePath: t + "/body/length",
                                          schemaPath: "#/properties/body/anyOf/1/properties/length/type",
                                          keyword: "type",
                                          params: {
                                            type: "number"
                                          },
                                          message: "must be number"
                                        };
                                        n === null ? n = [
                                          N
                                        ] : n.push(
                                          N
                                        ), r++;
                                      }
                                      var u = I === r;
                                    } else
                                      var u = !0;
                                }
                              }
                            }
                          }
                        }
                      } else {
                        const $ = {
                          instancePath: t + "/body",
                          schemaPath: "#/properties/body/anyOf/1/type",
                          keyword: "type",
                          params: { type: "object" },
                          message: "must be object"
                        };
                        n === null ? n = [$] : n.push($), r++;
                      }
                    var c = S === r;
                    if (A = A || c, !A) {
                      const $ = r;
                      if (r === $)
                        if (v && typeof v == "object" && !Array.isArray(v))
                          for (const x in v) {
                            let I = v[x];
                            const q = r, N = r;
                            let z = !1;
                            const B = r;
                            if (typeof I != "string") {
                              const H = {
                                instancePath: t + "/body/" + x.replace(
                                  /~/g,
                                  "~0"
                                ).replace(
                                  /\//g,
                                  "~1"
                                ),
                                schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/0/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              };
                              n === null ? n = [
                                H
                              ] : n.push(
                                H
                              ), r++;
                            }
                            var g = B === r;
                            if (z = z || g, !z) {
                              const H = r;
                              if (r === H)
                                if (I && typeof I == "object" && !Array.isArray(
                                  I
                                )) {
                                  let Y;
                                  if (I.BYTES_PER_ELEMENT === void 0 && (Y = "BYTES_PER_ELEMENT") || I.buffer === void 0 && (Y = "buffer") || I.byteLength === void 0 && (Y = "byteLength") || I.byteOffset === void 0 && (Y = "byteOffset") || I.length === void 0 && (Y = "length")) {
                                    const J = {
                                      instancePath: t + "/body/" + x.replace(
                                        /~/g,
                                        "~0"
                                      ).replace(
                                        /\//g,
                                        "~1"
                                      ),
                                      schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/required",
                                      keyword: "required",
                                      params: {
                                        missingProperty: Y
                                      },
                                      message: "must have required property '" + Y + "'"
                                    };
                                    n === null ? n = [
                                      J
                                    ] : n.push(
                                      J
                                    ), r++;
                                  } else {
                                    const J = r;
                                    for (const M in I)
                                      if (!(M === "BYTES_PER_ELEMENT" || M === "buffer" || M === "byteLength" || M === "byteOffset" || M === "length")) {
                                        let te = I[M];
                                        const se = r;
                                        if (!(typeof te == "number" && isFinite(
                                          te
                                        ))) {
                                          const X = {
                                            instancePath: t + "/body/" + x.replace(
                                              /~/g,
                                              "~0"
                                            ).replace(
                                              /\//g,
                                              "~1"
                                            ) + "/" + M.replace(
                                              /~/g,
                                              "~0"
                                            ).replace(
                                              /\//g,
                                              "~1"
                                            ),
                                            schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/additionalProperties/type",
                                            keyword: "type",
                                            params: {
                                              type: "number"
                                            },
                                            message: "must be number"
                                          };
                                          n === null ? n = [
                                            X
                                          ] : n.push(
                                            X
                                          ), r++;
                                        }
                                        var w = se === r;
                                        if (!w)
                                          break;
                                      }
                                    if (J === r) {
                                      if (I.BYTES_PER_ELEMENT !== void 0) {
                                        let M = I.BYTES_PER_ELEMENT;
                                        const te = r;
                                        if (!(typeof M == "number" && isFinite(
                                          M
                                        ))) {
                                          const se = {
                                            instancePath: t + "/body/" + x.replace(
                                              /~/g,
                                              "~0"
                                            ).replace(
                                              /\//g,
                                              "~1"
                                            ) + "/BYTES_PER_ELEMENT",
                                            schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/properties/BYTES_PER_ELEMENT/type",
                                            keyword: "type",
                                            params: {
                                              type: "number"
                                            },
                                            message: "must be number"
                                          };
                                          n === null ? n = [
                                            se
                                          ] : n.push(
                                            se
                                          ), r++;
                                        }
                                        var O = te === r;
                                      } else
                                        var O = !0;
                                      if (O) {
                                        if (I.buffer !== void 0) {
                                          let M = I.buffer;
                                          const te = r;
                                          if (r === te)
                                            if (M && typeof M == "object" && !Array.isArray(
                                              M
                                            )) {
                                              let X;
                                              if (M.byteLength === void 0 && (X = "byteLength")) {
                                                const _e = {
                                                  instancePath: t + "/body/" + x.replace(
                                                    /~/g,
                                                    "~0"
                                                  ).replace(
                                                    /\//g,
                                                    "~1"
                                                  ) + "/buffer",
                                                  schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/properties/buffer/required",
                                                  keyword: "required",
                                                  params: {
                                                    missingProperty: X
                                                  },
                                                  message: "must have required property '" + X + "'"
                                                };
                                                n === null ? n = [
                                                  _e
                                                ] : n.push(
                                                  _e
                                                ), r++;
                                              } else {
                                                const _e = r;
                                                for (const we in M)
                                                  if (we !== "byteLength") {
                                                    const xe = {
                                                      instancePath: t + "/body/" + x.replace(
                                                        /~/g,
                                                        "~0"
                                                      ).replace(
                                                        /\//g,
                                                        "~1"
                                                      ) + "/buffer",
                                                      schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/properties/buffer/additionalProperties",
                                                      keyword: "additionalProperties",
                                                      params: {
                                                        additionalProperty: we
                                                      },
                                                      message: "must NOT have additional properties"
                                                    };
                                                    n === null ? n = [
                                                      xe
                                                    ] : n.push(
                                                      xe
                                                    ), r++;
                                                    break;
                                                  }
                                                if (_e === r && M.byteLength !== void 0) {
                                                  let we = M.byteLength;
                                                  if (!(typeof we == "number" && isFinite(
                                                    we
                                                  ))) {
                                                    const xe = {
                                                      instancePath: t + "/body/" + x.replace(
                                                        /~/g,
                                                        "~0"
                                                      ).replace(
                                                        /\//g,
                                                        "~1"
                                                      ) + "/buffer/byteLength",
                                                      schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/properties/buffer/properties/byteLength/type",
                                                      keyword: "type",
                                                      params: {
                                                        type: "number"
                                                      },
                                                      message: "must be number"
                                                    };
                                                    n === null ? n = [
                                                      xe
                                                    ] : n.push(
                                                      xe
                                                    ), r++;
                                                  }
                                                }
                                              }
                                            } else {
                                              const X = {
                                                instancePath: t + "/body/" + x.replace(
                                                  /~/g,
                                                  "~0"
                                                ).replace(
                                                  /\//g,
                                                  "~1"
                                                ) + "/buffer",
                                                schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/properties/buffer/type",
                                                keyword: "type",
                                                params: {
                                                  type: "object"
                                                },
                                                message: "must be object"
                                              };
                                              n === null ? n = [
                                                X
                                              ] : n.push(
                                                X
                                              ), r++;
                                            }
                                          var O = te === r;
                                        } else
                                          var O = !0;
                                        if (O) {
                                          if (I.byteLength !== void 0) {
                                            let M = I.byteLength;
                                            const te = r;
                                            if (!(typeof M == "number" && isFinite(
                                              M
                                            ))) {
                                              const X = {
                                                instancePath: t + "/body/" + x.replace(
                                                  /~/g,
                                                  "~0"
                                                ).replace(
                                                  /\//g,
                                                  "~1"
                                                ) + "/byteLength",
                                                schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/properties/byteLength/type",
                                                keyword: "type",
                                                params: {
                                                  type: "number"
                                                },
                                                message: "must be number"
                                              };
                                              n === null ? n = [
                                                X
                                              ] : n.push(
                                                X
                                              ), r++;
                                            }
                                            var O = te === r;
                                          } else
                                            var O = !0;
                                          if (O) {
                                            if (I.byteOffset !== void 0) {
                                              let M = I.byteOffset;
                                              const te = r;
                                              if (!(typeof M == "number" && isFinite(
                                                M
                                              ))) {
                                                const X = {
                                                  instancePath: t + "/body/" + x.replace(
                                                    /~/g,
                                                    "~0"
                                                  ).replace(
                                                    /\//g,
                                                    "~1"
                                                  ) + "/byteOffset",
                                                  schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/properties/byteOffset/type",
                                                  keyword: "type",
                                                  params: {
                                                    type: "number"
                                                  },
                                                  message: "must be number"
                                                };
                                                n === null ? n = [
                                                  X
                                                ] : n.push(
                                                  X
                                                ), r++;
                                              }
                                              var O = te === r;
                                            } else
                                              var O = !0;
                                            if (O)
                                              if (I.length !== void 0) {
                                                let M = I.length;
                                                const te = r;
                                                if (!(typeof M == "number" && isFinite(
                                                  M
                                                ))) {
                                                  const X = {
                                                    instancePath: t + "/body/" + x.replace(
                                                      /~/g,
                                                      "~0"
                                                    ).replace(
                                                      /\//g,
                                                      "~1"
                                                    ) + "/length",
                                                    schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/properties/length/type",
                                                    keyword: "type",
                                                    params: {
                                                      type: "number"
                                                    },
                                                    message: "must be number"
                                                  };
                                                  n === null ? n = [
                                                    X
                                                  ] : n.push(
                                                    X
                                                  ), r++;
                                                }
                                                var O = te === r;
                                              } else
                                                var O = !0;
                                          }
                                        }
                                      }
                                    }
                                  }
                                } else {
                                  const Y = {
                                    instancePath: t + "/body/" + x.replace(
                                      /~/g,
                                      "~0"
                                    ).replace(
                                      /\//g,
                                      "~1"
                                    ),
                                    schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/1/type",
                                    keyword: "type",
                                    params: {
                                      type: "object"
                                    },
                                    message: "must be object"
                                  };
                                  n === null ? n = [
                                    Y
                                  ] : n.push(
                                    Y
                                  ), r++;
                                }
                              var g = H === r;
                              if (z = z || g, !z) {
                                const Y = r;
                                if (r === Y)
                                  if (I && typeof I == "object" && !Array.isArray(
                                    I
                                  )) {
                                    let M;
                                    if (I.lastModified === void 0 && (M = "lastModified") || I.name === void 0 && (M = "name") || I.size === void 0 && (M = "size") || I.type === void 0 && (M = "type") || I.webkitRelativePath === void 0 && (M = "webkitRelativePath")) {
                                      const te = {
                                        instancePath: t + "/body/" + x.replace(
                                          /~/g,
                                          "~0"
                                        ).replace(
                                          /\//g,
                                          "~1"
                                        ),
                                        schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/2/required",
                                        keyword: "required",
                                        params: {
                                          missingProperty: M
                                        },
                                        message: "must have required property '" + M + "'"
                                      };
                                      n === null ? n = [
                                        te
                                      ] : n.push(
                                        te
                                      ), r++;
                                    } else {
                                      const te = r;
                                      for (const se in I)
                                        if (!(se === "size" || se === "type" || se === "lastModified" || se === "name" || se === "webkitRelativePath")) {
                                          const X = {
                                            instancePath: t + "/body/" + x.replace(
                                              /~/g,
                                              "~0"
                                            ).replace(
                                              /\//g,
                                              "~1"
                                            ),
                                            schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/2/additionalProperties",
                                            keyword: "additionalProperties",
                                            params: {
                                              additionalProperty: se
                                            },
                                            message: "must NOT have additional properties"
                                          };
                                          n === null ? n = [
                                            X
                                          ] : n.push(
                                            X
                                          ), r++;
                                          break;
                                        }
                                      if (te === r) {
                                        if (I.size !== void 0) {
                                          let se = I.size;
                                          const X = r;
                                          if (!(typeof se == "number" && isFinite(
                                            se
                                          ))) {
                                            const _e = {
                                              instancePath: t + "/body/" + x.replace(
                                                /~/g,
                                                "~0"
                                              ).replace(
                                                /\//g,
                                                "~1"
                                              ) + "/size",
                                              schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/2/properties/size/type",
                                              keyword: "type",
                                              params: {
                                                type: "number"
                                              },
                                              message: "must be number"
                                            };
                                            n === null ? n = [
                                              _e
                                            ] : n.push(
                                              _e
                                            ), r++;
                                          }
                                          var m = X === r;
                                        } else
                                          var m = !0;
                                        if (m) {
                                          if (I.type !== void 0) {
                                            const se = r;
                                            if (typeof I.type != "string") {
                                              const _e = {
                                                instancePath: t + "/body/" + x.replace(
                                                  /~/g,
                                                  "~0"
                                                ).replace(
                                                  /\//g,
                                                  "~1"
                                                ) + "/type",
                                                schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/2/properties/type/type",
                                                keyword: "type",
                                                params: {
                                                  type: "string"
                                                },
                                                message: "must be string"
                                              };
                                              n === null ? n = [
                                                _e
                                              ] : n.push(
                                                _e
                                              ), r++;
                                            }
                                            var m = se === r;
                                          } else
                                            var m = !0;
                                          if (m) {
                                            if (I.lastModified !== void 0) {
                                              let se = I.lastModified;
                                              const X = r;
                                              if (!(typeof se == "number" && isFinite(
                                                se
                                              ))) {
                                                const we = {
                                                  instancePath: t + "/body/" + x.replace(
                                                    /~/g,
                                                    "~0"
                                                  ).replace(
                                                    /\//g,
                                                    "~1"
                                                  ) + "/lastModified",
                                                  schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/2/properties/lastModified/type",
                                                  keyword: "type",
                                                  params: {
                                                    type: "number"
                                                  },
                                                  message: "must be number"
                                                };
                                                n === null ? n = [
                                                  we
                                                ] : n.push(
                                                  we
                                                ), r++;
                                              }
                                              var m = X === r;
                                            } else
                                              var m = !0;
                                            if (m) {
                                              if (I.name !== void 0) {
                                                const se = r;
                                                if (typeof I.name != "string") {
                                                  const _e = {
                                                    instancePath: t + "/body/" + x.replace(
                                                      /~/g,
                                                      "~0"
                                                    ).replace(
                                                      /\//g,
                                                      "~1"
                                                    ) + "/name",
                                                    schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/2/properties/name/type",
                                                    keyword: "type",
                                                    params: {
                                                      type: "string"
                                                    },
                                                    message: "must be string"
                                                  };
                                                  n === null ? n = [
                                                    _e
                                                  ] : n.push(
                                                    _e
                                                  ), r++;
                                                }
                                                var m = se === r;
                                              } else
                                                var m = !0;
                                              if (m)
                                                if (I.webkitRelativePath !== void 0) {
                                                  const se = r;
                                                  if (typeof I.webkitRelativePath != "string") {
                                                    const _e = {
                                                      instancePath: t + "/body/" + x.replace(
                                                        /~/g,
                                                        "~0"
                                                      ).replace(
                                                        /\//g,
                                                        "~1"
                                                      ) + "/webkitRelativePath",
                                                      schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/2/properties/webkitRelativePath/type",
                                                      keyword: "type",
                                                      params: {
                                                        type: "string"
                                                      },
                                                      message: "must be string"
                                                    };
                                                    n === null ? n = [
                                                      _e
                                                    ] : n.push(
                                                      _e
                                                    ), r++;
                                                  }
                                                  var m = se === r;
                                                } else
                                                  var m = !0;
                                            }
                                          }
                                        }
                                      }
                                    }
                                  } else {
                                    const M = {
                                      instancePath: t + "/body/" + x.replace(
                                        /~/g,
                                        "~0"
                                      ).replace(
                                        /\//g,
                                        "~1"
                                      ),
                                      schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf/2/type",
                                      keyword: "type",
                                      params: {
                                        type: "object"
                                      },
                                      message: "must be object"
                                    };
                                    n === null ? n = [
                                      M
                                    ] : n.push(
                                      M
                                    ), r++;
                                  }
                                var g = Y === r;
                                z = z || g;
                              }
                            }
                            if (z)
                              r = N, n !== null && (N ? n.length = N : n = null);
                            else {
                              const H = {
                                instancePath: t + "/body/" + x.replace(
                                  /~/g,
                                  "~0"
                                ).replace(
                                  /\//g,
                                  "~1"
                                ),
                                schemaPath: "#/properties/body/anyOf/2/additionalProperties/anyOf",
                                keyword: "anyOf",
                                params: {},
                                message: "must match a schema in anyOf"
                              };
                              n === null ? n = [
                                H
                              ] : n.push(
                                H
                              ), r++;
                            }
                            var h = q === r;
                            if (!h)
                              break;
                          }
                        else {
                          const x = {
                            instancePath: t + "/body",
                            schemaPath: "#/properties/body/anyOf/2/type",
                            keyword: "type",
                            params: {
                              type: "object"
                            },
                            message: "must be object"
                          };
                          n === null ? n = [x] : n.push(x), r++;
                        }
                      var c = $ === r;
                      A = A || c;
                    }
                  }
                  if (A)
                    r = E, n !== null && (E ? n.length = E : n = null);
                  else {
                    const S = {
                      instancePath: t + "/body",
                      schemaPath: "#/properties/body/anyOf",
                      keyword: "anyOf",
                      params: {},
                      message: "must match a schema in anyOf"
                    };
                    return n === null ? n = [S] : n.push(S), r++, Xe.errors = n, !1;
                  }
                  var l = R === r;
                } else
                  var l = !0;
            }
          }
        }
      }
    } else
      return Xe.errors = [
        {
          instancePath: t,
          schemaPath: "#/type",
          keyword: "type",
          params: { type: "object" },
          message: "must be object"
        }
      ], !1;
  return Xe.errors = n, r === 0;
}
const wm = {
  properties: {
    relativeUri: {
      type: "string",
      description: "Request path following the domain:port part – after any URL rewriting rules (e.g. apache .htaccess) have been applied."
    },
    scriptPath: {
      type: "string",
      description: "Path of the .php file to execute."
    },
    protocol: { type: "string", description: "Request protocol." },
    method: {
      $ref: "#/definitions/HTTPMethod",
      description: "Request method. Default: `GET`."
    },
    headers: {
      $ref: "#/definitions/PHPRequestHeaders",
      description: "Request headers."
    },
    body: {
      anyOf: [
        { type: "string" },
        {
          type: "object",
          properties: {
            BYTES_PER_ELEMENT: { type: "number" },
            buffer: {
              type: "object",
              properties: { byteLength: { type: "number" } },
              required: ["byteLength"],
              additionalProperties: !1
            },
            byteLength: { type: "number" },
            byteOffset: { type: "number" },
            length: { type: "number" }
          },
          required: [
            "BYTES_PER_ELEMENT",
            "buffer",
            "byteLength",
            "byteOffset",
            "length"
          ],
          additionalProperties: { type: "number" }
        }
      ],
      description: "Request body."
    },
    env: {
      type: "object",
      additionalProperties: { type: "string" },
      description: "Environment variables to set for this run."
    },
    $_SERVER: {
      type: "object",
      additionalProperties: { type: "string" },
      description: "$_SERVER entries to set for this run."
    },
    code: {
      type: "string",
      description: "The code snippet to eval instead of a php file."
    }
  }
};
function Pe(e, { instancePath: t = "", parentData: s, parentDataProperty: i, rootData: o = e } = {}) {
  let n = null, r = 0;
  if (r === 0)
    if (e && typeof e == "object" && !Array.isArray(e)) {
      const O = r;
      for (const m in e)
        if (!si.call(wm.properties, m))
          return Pe.errors = [
            {
              instancePath: t,
              schemaPath: "#/additionalProperties",
              keyword: "additionalProperties",
              params: { additionalProperty: m },
              message: "must NOT have additional properties"
            }
          ], !1;
      if (O === r) {
        if (e.relativeUri !== void 0) {
          const m = r;
          if (typeof e.relativeUri != "string")
            return Pe.errors = [
              {
                instancePath: t + "/relativeUri",
                schemaPath: "#/properties/relativeUri/type",
                keyword: "type",
                params: { type: "string" },
                message: "must be string"
              }
            ], !1;
          var l = m === r;
        } else
          var l = !0;
        if (l) {
          if (e.scriptPath !== void 0) {
            const m = r;
            if (typeof e.scriptPath != "string")
              return Pe.errors = [
                {
                  instancePath: t + "/scriptPath",
                  schemaPath: "#/properties/scriptPath/type",
                  keyword: "type",
                  params: { type: "string" },
                  message: "must be string"
                }
              ], !1;
            var l = m === r;
          } else
            var l = !0;
          if (l) {
            if (e.protocol !== void 0) {
              const m = r;
              if (typeof e.protocol != "string")
                return Pe.errors = [
                  {
                    instancePath: t + "/protocol",
                    schemaPath: "#/properties/protocol/type",
                    keyword: "type",
                    params: { type: "string" },
                    message: "must be string"
                  }
                ], !1;
              var l = m === r;
            } else
              var l = !0;
            if (l) {
              if (e.method !== void 0) {
                let m = e.method;
                const h = r;
                if (typeof m != "string")
                  return Pe.errors = [
                    {
                      instancePath: t + "/method",
                      schemaPath: "#/definitions/HTTPMethod/type",
                      keyword: "type",
                      params: { type: "string" },
                      message: "must be string"
                    }
                  ], !1;
                if (!(m === "GET" || m === "POST" || m === "HEAD" || m === "OPTIONS" || m === "PATCH" || m === "PUT" || m === "DELETE"))
                  return Pe.errors = [
                    {
                      instancePath: t + "/method",
                      schemaPath: "#/definitions/HTTPMethod/enum",
                      keyword: "enum",
                      params: {
                        allowedValues: _l.enum
                      },
                      message: "must be equal to one of the allowed values"
                    }
                  ], !1;
                var l = h === r;
              } else
                var l = !0;
              if (l) {
                if (e.headers !== void 0) {
                  let m = e.headers;
                  const h = r;
                  if (r === r)
                    if (m && typeof m == "object" && !Array.isArray(m))
                      for (const v in m) {
                        const R = r;
                        if (typeof m[v] != "string")
                          return Pe.errors = [
                            {
                              instancePath: t + "/headers/" + v.replace(
                                /~/g,
                                "~0"
                              ).replace(
                                /\//g,
                                "~1"
                              ),
                              schemaPath: "#/definitions/PHPRequestHeaders/additionalProperties/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        var p = R === r;
                        if (!p)
                          break;
                      }
                    else
                      return Pe.errors = [
                        {
                          instancePath: t + "/headers",
                          schemaPath: "#/definitions/PHPRequestHeaders/type",
                          keyword: "type",
                          params: { type: "object" },
                          message: "must be object"
                        }
                      ], !1;
                  var l = h === r;
                } else
                  var l = !0;
                if (l) {
                  if (e.body !== void 0) {
                    let m = e.body;
                    const h = r, _ = r;
                    let k = !1;
                    const v = r;
                    if (typeof m != "string") {
                      const E = {
                        instancePath: t + "/body",
                        schemaPath: "#/properties/body/anyOf/0/type",
                        keyword: "type",
                        params: { type: "string" },
                        message: "must be string"
                      };
                      n === null ? n = [E] : n.push(E), r++;
                    }
                    var c = v === r;
                    if (k = k || c, !k) {
                      const E = r;
                      if (r === E)
                        if (m && typeof m == "object" && !Array.isArray(m)) {
                          let C;
                          if (m.BYTES_PER_ELEMENT === void 0 && (C = "BYTES_PER_ELEMENT") || m.buffer === void 0 && (C = "buffer") || m.byteLength === void 0 && (C = "byteLength") || m.byteOffset === void 0 && (C = "byteOffset") || m.length === void 0 && (C = "length")) {
                            const b = {
                              instancePath: t + "/body",
                              schemaPath: "#/properties/body/anyOf/1/required",
                              keyword: "required",
                              params: {
                                missingProperty: C
                              },
                              message: "must have required property '" + C + "'"
                            };
                            n === null ? n = [b] : n.push(b), r++;
                          } else {
                            const b = r;
                            for (const S in m)
                              if (!(S === "BYTES_PER_ELEMENT" || S === "buffer" || S === "byteLength" || S === "byteOffset" || S === "length")) {
                                let P = m[S];
                                const $ = r;
                                if (!(typeof P == "number" && isFinite(
                                  P
                                ))) {
                                  const L = {
                                    instancePath: t + "/body/" + S.replace(
                                      /~/g,
                                      "~0"
                                    ).replace(
                                      /\//g,
                                      "~1"
                                    ),
                                    schemaPath: "#/properties/body/anyOf/1/additionalProperties/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  };
                                  n === null ? n = [
                                    L
                                  ] : n.push(
                                    L
                                  ), r++;
                                }
                                var f = $ === r;
                                if (!f)
                                  break;
                              }
                            if (b === r) {
                              if (m.BYTES_PER_ELEMENT !== void 0) {
                                let S = m.BYTES_PER_ELEMENT;
                                const P = r;
                                if (!(typeof S == "number" && isFinite(
                                  S
                                ))) {
                                  const $ = {
                                    instancePath: t + "/body/BYTES_PER_ELEMENT",
                                    schemaPath: "#/properties/body/anyOf/1/properties/BYTES_PER_ELEMENT/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  };
                                  n === null ? n = [
                                    $
                                  ] : n.push(
                                    $
                                  ), r++;
                                }
                                var u = P === r;
                              } else
                                var u = !0;
                              if (u) {
                                if (m.buffer !== void 0) {
                                  let S = m.buffer;
                                  const P = r;
                                  if (r === P)
                                    if (S && typeof S == "object" && !Array.isArray(
                                      S
                                    )) {
                                      let L;
                                      if (S.byteLength === void 0 && (L = "byteLength")) {
                                        const x = {
                                          instancePath: t + "/body/buffer",
                                          schemaPath: "#/properties/body/anyOf/1/properties/buffer/required",
                                          keyword: "required",
                                          params: {
                                            missingProperty: L
                                          },
                                          message: "must have required property '" + L + "'"
                                        };
                                        n === null ? n = [
                                          x
                                        ] : n.push(
                                          x
                                        ), r++;
                                      } else {
                                        const x = r;
                                        for (const I in S)
                                          if (I !== "byteLength") {
                                            const q = {
                                              instancePath: t + "/body/buffer",
                                              schemaPath: "#/properties/body/anyOf/1/properties/buffer/additionalProperties",
                                              keyword: "additionalProperties",
                                              params: {
                                                additionalProperty: I
                                              },
                                              message: "must NOT have additional properties"
                                            };
                                            n === null ? n = [
                                              q
                                            ] : n.push(
                                              q
                                            ), r++;
                                            break;
                                          }
                                        if (x === r && S.byteLength !== void 0) {
                                          let I = S.byteLength;
                                          if (!(typeof I == "number" && isFinite(
                                            I
                                          ))) {
                                            const q = {
                                              instancePath: t + "/body/buffer/byteLength",
                                              schemaPath: "#/properties/body/anyOf/1/properties/buffer/properties/byteLength/type",
                                              keyword: "type",
                                              params: {
                                                type: "number"
                                              },
                                              message: "must be number"
                                            };
                                            n === null ? n = [
                                              q
                                            ] : n.push(
                                              q
                                            ), r++;
                                          }
                                        }
                                      }
                                    } else {
                                      const L = {
                                        instancePath: t + "/body/buffer",
                                        schemaPath: "#/properties/body/anyOf/1/properties/buffer/type",
                                        keyword: "type",
                                        params: {
                                          type: "object"
                                        },
                                        message: "must be object"
                                      };
                                      n === null ? n = [
                                        L
                                      ] : n.push(
                                        L
                                      ), r++;
                                    }
                                  var u = P === r;
                                } else
                                  var u = !0;
                                if (u) {
                                  if (m.byteLength !== void 0) {
                                    let S = m.byteLength;
                                    const P = r;
                                    if (!(typeof S == "number" && isFinite(
                                      S
                                    ))) {
                                      const L = {
                                        instancePath: t + "/body/byteLength",
                                        schemaPath: "#/properties/body/anyOf/1/properties/byteLength/type",
                                        keyword: "type",
                                        params: {
                                          type: "number"
                                        },
                                        message: "must be number"
                                      };
                                      n === null ? n = [
                                        L
                                      ] : n.push(
                                        L
                                      ), r++;
                                    }
                                    var u = P === r;
                                  } else
                                    var u = !0;
                                  if (u) {
                                    if (m.byteOffset !== void 0) {
                                      let S = m.byteOffset;
                                      const P = r;
                                      if (!(typeof S == "number" && isFinite(
                                        S
                                      ))) {
                                        const L = {
                                          instancePath: t + "/body/byteOffset",
                                          schemaPath: "#/properties/body/anyOf/1/properties/byteOffset/type",
                                          keyword: "type",
                                          params: {
                                            type: "number"
                                          },
                                          message: "must be number"
                                        };
                                        n === null ? n = [
                                          L
                                        ] : n.push(
                                          L
                                        ), r++;
                                      }
                                      var u = P === r;
                                    } else
                                      var u = !0;
                                    if (u)
                                      if (m.length !== void 0) {
                                        let S = m.length;
                                        const P = r;
                                        if (!(typeof S == "number" && isFinite(
                                          S
                                        ))) {
                                          const L = {
                                            instancePath: t + "/body/length",
                                            schemaPath: "#/properties/body/anyOf/1/properties/length/type",
                                            keyword: "type",
                                            params: {
                                              type: "number"
                                            },
                                            message: "must be number"
                                          };
                                          n === null ? n = [
                                            L
                                          ] : n.push(
                                            L
                                          ), r++;
                                        }
                                        var u = P === r;
                                      } else
                                        var u = !0;
                                  }
                                }
                              }
                            }
                          }
                        } else {
                          const C = {
                            instancePath: t + "/body",
                            schemaPath: "#/properties/body/anyOf/1/type",
                            keyword: "type",
                            params: {
                              type: "object"
                            },
                            message: "must be object"
                          };
                          n === null ? n = [C] : n.push(C), r++;
                        }
                      var c = E === r;
                      k = k || c;
                    }
                    if (k)
                      r = _, n !== null && (_ ? n.length = _ : n = null);
                    else {
                      const E = {
                        instancePath: t + "/body",
                        schemaPath: "#/properties/body/anyOf",
                        keyword: "anyOf",
                        params: {},
                        message: "must match a schema in anyOf"
                      };
                      return n === null ? n = [E] : n.push(E), r++, Pe.errors = n, !1;
                    }
                    var l = h === r;
                  } else
                    var l = !0;
                  if (l) {
                    if (e.env !== void 0) {
                      let m = e.env;
                      const h = r;
                      if (r === h)
                        if (m && typeof m == "object" && !Array.isArray(m))
                          for (const k in m) {
                            const v = r;
                            if (typeof m[k] != "string")
                              return Pe.errors = [
                                {
                                  instancePath: t + "/env/" + k.replace(
                                    /~/g,
                                    "~0"
                                  ).replace(
                                    /\//g,
                                    "~1"
                                  ),
                                  schemaPath: "#/properties/env/additionalProperties/type",
                                  keyword: "type",
                                  params: {
                                    type: "string"
                                  },
                                  message: "must be string"
                                }
                              ], !1;
                            var g = v === r;
                            if (!g)
                              break;
                          }
                        else
                          return Pe.errors = [
                            {
                              instancePath: t + "/env",
                              schemaPath: "#/properties/env/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var l = h === r;
                    } else
                      var l = !0;
                    if (l) {
                      if (e.$_SERVER !== void 0) {
                        let m = e.$_SERVER;
                        const h = r;
                        if (r === h)
                          if (m && typeof m == "object" && !Array.isArray(m))
                            for (const k in m) {
                              const v = r;
                              if (typeof m[k] != "string")
                                return Pe.errors = [
                                  {
                                    instancePath: t + "/$_SERVER/" + k.replace(
                                      /~/g,
                                      "~0"
                                    ).replace(
                                      /\//g,
                                      "~1"
                                    ),
                                    schemaPath: "#/properties/%24_SERVER/additionalProperties/type",
                                    keyword: "type",
                                    params: {
                                      type: "string"
                                    },
                                    message: "must be string"
                                  }
                                ], !1;
                              var w = v === r;
                              if (!w)
                                break;
                            }
                          else
                            return Pe.errors = [
                              {
                                instancePath: t + "/$_SERVER",
                                schemaPath: "#/properties/%24_SERVER/type",
                                keyword: "type",
                                params: {
                                  type: "object"
                                },
                                message: "must be object"
                              }
                            ], !1;
                        var l = h === r;
                      } else
                        var l = !0;
                      if (l)
                        if (e.code !== void 0) {
                          const m = r;
                          if (typeof e.code != "string")
                            return Pe.errors = [
                              {
                                instancePath: t + "/code",
                                schemaPath: "#/properties/code/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          var l = m === r;
                        } else
                          var l = !0;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else
      return Pe.errors = [
        {
          instancePath: t,
          schemaPath: "#/type",
          keyword: "type",
          params: { type: "object" },
          message: "must be object"
        }
      ], !1;
  return Pe.errors = n, r === 0;
}
function d(e, { instancePath: t = "", parentData: s, parentDataProperty: i, rootData: o = e } = {}) {
  let n = null, r = 0;
  if (r === 0)
    if (e && typeof e == "object" && !Array.isArray(e)) {
      let nr;
      if (e.step === void 0 && (nr = "step"))
        return d.errors = [
          {
            instancePath: t,
            schemaPath: "#/required",
            keyword: "required",
            params: { missingProperty: nr },
            message: "must have required property '" + nr + "'"
          }
        ], !1;
      {
        const le = e.step;
        if (typeof le == "string")
          if (le === "activatePlugin") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.pluginPath === void 0 && (F = "pluginPath") || e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/0/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "pluginPath" || a === "pluginName"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/0/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/0/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/0/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var l = G === r;
                            } else
                              var l = !0;
                            if (l)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/0/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var l = y === r;
                              } else
                                var l = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/0/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var p = T === r;
                    } else
                      var p = !0;
                    if (p) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/0/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "activatePlugin")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/0/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "activatePlugin"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var p = T === r;
                      } else
                        var p = !0;
                      if (p) {
                        if (e.pluginPath !== void 0) {
                          const a = r;
                          if (typeof e.pluginPath != "string")
                            return d.errors = [
                              {
                                instancePath: t + "/pluginPath",
                                schemaPath: "#/oneOf/0/properties/pluginPath/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          var p = a === r;
                        } else
                          var p = !0;
                        if (p)
                          if (e.pluginName !== void 0) {
                            const a = r;
                            if (typeof e.pluginName != "string")
                              return d.errors = [
                                {
                                  instancePath: t + "/pluginName",
                                  schemaPath: "#/oneOf/0/properties/pluginName/type",
                                  keyword: "type",
                                  params: {
                                    type: "string"
                                  },
                                  message: "must be string"
                                }
                              ], !1;
                            var p = a === r;
                          } else
                            var p = !0;
                      }
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/0/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "activateTheme") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.step === void 0 && (F = "step") || e.themeFolderName === void 0 && (F = "themeFolderName"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/1/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "themeFolderName"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/1/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/1/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/1/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var c = G === r;
                            } else
                              var c = !0;
                            if (c)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/1/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var c = y === r;
                              } else
                                var c = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/1/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var f = T === r;
                    } else
                      var f = !0;
                    if (f) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/1/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "activateTheme")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/1/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "activateTheme"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var f = T === r;
                      } else
                        var f = !0;
                      if (f)
                        if (e.themeFolderName !== void 0) {
                          const a = r;
                          if (typeof e.themeFolderName != "string")
                            return d.errors = [
                              {
                                instancePath: t + "/themeFolderName",
                                schemaPath: "#/oneOf/1/properties/themeFolderName/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          var f = a === r;
                        } else
                          var f = !0;
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/1/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "cp") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.fromPath === void 0 && (F = "fromPath") || e.step === void 0 && (F = "step") || e.toPath === void 0 && (F = "toPath"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/2/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "fromPath" || a === "toPath"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/2/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/2/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/2/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var u = G === r;
                            } else
                              var u = !0;
                            if (u)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/2/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var u = y === r;
                              } else
                                var u = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/2/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var g = T === r;
                    } else
                      var g = !0;
                    if (g) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/2/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "cp")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/2/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "cp"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var g = T === r;
                      } else
                        var g = !0;
                      if (g) {
                        if (e.fromPath !== void 0) {
                          const a = r;
                          if (typeof e.fromPath != "string")
                            return d.errors = [
                              {
                                instancePath: t + "/fromPath",
                                schemaPath: "#/oneOf/2/properties/fromPath/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          var g = a === r;
                        } else
                          var g = !0;
                        if (g)
                          if (e.toPath !== void 0) {
                            const a = r;
                            if (typeof e.toPath != "string")
                              return d.errors = [
                                {
                                  instancePath: t + "/toPath",
                                  schemaPath: "#/oneOf/2/properties/toPath/type",
                                  keyword: "type",
                                  params: {
                                    type: "string"
                                  },
                                  message: "must be string"
                                }
                              ], !1;
                            var g = a === r;
                          } else
                            var g = !0;
                      }
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/2/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "defineWpConfigConsts") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.consts === void 0 && (F = "consts") || e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/3/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "consts" || a === "method" || a === "virtualize"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/3/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/3/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/3/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var w = G === r;
                            } else
                              var w = !0;
                            if (w)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/3/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var w = y === r;
                              } else
                                var w = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/3/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var O = T === r;
                    } else
                      var O = !0;
                    if (O) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/3/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "defineWpConfigConsts")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/3/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "defineWpConfigConsts"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var O = T === r;
                      } else
                        var O = !0;
                      if (O) {
                        if (e.consts !== void 0) {
                          let a = e.consts;
                          const T = r;
                          if (r === T && !(a && typeof a == "object" && !Array.isArray(
                            a
                          )))
                            return d.errors = [
                              {
                                instancePath: t + "/consts",
                                schemaPath: "#/oneOf/3/properties/consts/type",
                                keyword: "type",
                                params: {
                                  type: "object"
                                },
                                message: "must be object"
                              }
                            ], !1;
                          var O = T === r;
                        } else
                          var O = !0;
                        if (O) {
                          if (e.method !== void 0) {
                            let a = e.method;
                            const T = r;
                            if (typeof a != "string")
                              return d.errors = [
                                {
                                  instancePath: t + "/method",
                                  schemaPath: "#/oneOf/3/properties/method/type",
                                  keyword: "type",
                                  params: {
                                    type: "string"
                                  },
                                  message: "must be string"
                                }
                              ], !1;
                            if (!(a === "rewrite-wp-config" || a === "define-before-run"))
                              return d.errors = [
                                {
                                  instancePath: t + "/method",
                                  schemaPath: "#/oneOf/3/properties/method/enum",
                                  keyword: "enum",
                                  params: {
                                    allowedValues: zt.oneOf[3].properties.method.enum
                                  },
                                  message: "must be equal to one of the allowed values"
                                }
                              ], !1;
                            var O = T === r;
                          } else
                            var O = !0;
                          if (O)
                            if (e.virtualize !== void 0) {
                              const a = r;
                              if (typeof e.virtualize != "boolean")
                                return d.errors = [
                                  {
                                    instancePath: t + "/virtualize",
                                    schemaPath: "#/oneOf/3/properties/virtualize/type",
                                    keyword: "type",
                                    params: {
                                      type: "boolean"
                                    },
                                    message: "must be boolean"
                                  }
                                ], !1;
                              var O = a === r;
                            } else
                              var O = !0;
                        }
                      }
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/3/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "defineSiteUrl") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.siteUrl === void 0 && (F = "siteUrl") || e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/4/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "siteUrl"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/4/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/4/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/4/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var m = G === r;
                            } else
                              var m = !0;
                            if (m)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/4/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var m = y === r;
                              } else
                                var m = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/4/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var h = T === r;
                    } else
                      var h = !0;
                    if (h) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/4/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "defineSiteUrl")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/4/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "defineSiteUrl"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var h = T === r;
                      } else
                        var h = !0;
                      if (h)
                        if (e.siteUrl !== void 0) {
                          const a = r;
                          if (typeof e.siteUrl != "string")
                            return d.errors = [
                              {
                                instancePath: t + "/siteUrl",
                                schemaPath: "#/oneOf/4/properties/siteUrl/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          var h = a === r;
                        } else
                          var h = !0;
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/4/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "enableMultisite") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/5/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "wpCliPath"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/5/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/5/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/5/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var _ = G === r;
                            } else
                              var _ = !0;
                            if (_)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/5/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var _ = y === r;
                              } else
                                var _ = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/5/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var k = T === r;
                    } else
                      var k = !0;
                    if (k) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/5/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "enableMultisite")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/5/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "enableMultisite"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var k = T === r;
                      } else
                        var k = !0;
                      if (k)
                        if (e.wpCliPath !== void 0) {
                          const a = r;
                          if (typeof e.wpCliPath != "string")
                            return d.errors = [
                              {
                                instancePath: t + "/wpCliPath",
                                schemaPath: "#/oneOf/5/properties/wpCliPath/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          var k = a === r;
                        } else
                          var k = !0;
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/5/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "importWxr") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.file === void 0 && (F = "file") || e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/6/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!si.call(
                      zt.oneOf[6].properties,
                      a
                    ))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/6/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/6/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/6/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var v = G === r;
                            } else
                              var v = !0;
                            if (v)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/6/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var v = y === r;
                              } else
                                var v = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/6/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var R = T === r;
                    } else
                      var R = !0;
                    if (R) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/6/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "importWxr")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/6/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "importWxr"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var R = T === r;
                      } else
                        var R = !0;
                      if (R) {
                        if (e.file !== void 0) {
                          const a = r;
                          ce(e.file, {
                            instancePath: t + "/file",
                            parentData: e,
                            parentDataProperty: "file",
                            rootData: o
                          }) || (n = n === null ? ce.errors : n.concat(
                            ce.errors
                          ), r = n.length);
                          var R = a === r;
                        } else
                          var R = !0;
                        if (R) {
                          if (e.fetchAttachments !== void 0) {
                            const a = r;
                            if (typeof e.fetchAttachments != "boolean")
                              return d.errors = [
                                {
                                  instancePath: t + "/fetchAttachments",
                                  schemaPath: "#/oneOf/6/properties/fetchAttachments/type",
                                  keyword: "type",
                                  params: {
                                    type: "boolean"
                                  },
                                  message: "must be boolean"
                                }
                              ], !1;
                            var R = a === r;
                          } else
                            var R = !0;
                          if (R) {
                            if (e.rewriteUrls !== void 0) {
                              const a = r;
                              if (typeof e.rewriteUrls != "boolean")
                                return d.errors = [
                                  {
                                    instancePath: t + "/rewriteUrls",
                                    schemaPath: "#/oneOf/6/properties/rewriteUrls/type",
                                    keyword: "type",
                                    params: {
                                      type: "boolean"
                                    },
                                    message: "must be boolean"
                                  }
                                ], !1;
                              var R = a === r;
                            } else
                              var R = !0;
                            if (R) {
                              if (e.urlMapping !== void 0) {
                                let a = e.urlMapping;
                                const T = r;
                                if (r === T)
                                  if (a && typeof a == "object" && !Array.isArray(
                                    a
                                  ))
                                    for (const y in a) {
                                      const G = r;
                                      if (typeof a[y] != "string")
                                        return d.errors = [
                                          {
                                            instancePath: t + "/urlMapping/" + y.replace(
                                              /~/g,
                                              "~0"
                                            ).replace(
                                              /\//g,
                                              "~1"
                                            ),
                                            schemaPath: "#/oneOf/6/properties/urlMapping/additionalProperties/type",
                                            keyword: "type",
                                            params: {
                                              type: "string"
                                            },
                                            message: "must be string"
                                          }
                                        ], !1;
                                      var E = G === r;
                                      if (!E)
                                        break;
                                    }
                                  else
                                    return d.errors = [
                                      {
                                        instancePath: t + "/urlMapping",
                                        schemaPath: "#/oneOf/6/properties/urlMapping/type",
                                        keyword: "type",
                                        params: {
                                          type: "object"
                                        },
                                        message: "must be object"
                                      }
                                    ], !1;
                                var R = T === r;
                              } else
                                var R = !0;
                              if (R) {
                                if (e.importComments !== void 0) {
                                  const a = r;
                                  if (typeof e.importComments != "boolean")
                                    return d.errors = [
                                      {
                                        instancePath: t + "/importComments",
                                        schemaPath: "#/oneOf/6/properties/importComments/type",
                                        keyword: "type",
                                        params: {
                                          type: "boolean"
                                        },
                                        message: "must be boolean"
                                      }
                                    ], !1;
                                  var R = a === r;
                                } else
                                  var R = !0;
                                if (R) {
                                  if (e.defaultAuthorUsername !== void 0) {
                                    const a = r;
                                    if (typeof e.defaultAuthorUsername != "string")
                                      return d.errors = [
                                        {
                                          instancePath: t + "/defaultAuthorUsername",
                                          schemaPath: "#/oneOf/6/properties/defaultAuthorUsername/type",
                                          keyword: "type",
                                          params: {
                                            type: "string"
                                          },
                                          message: "must be string"
                                        }
                                      ], !1;
                                    var R = a === r;
                                  } else
                                    var R = !0;
                                  if (R) {
                                    if (e.authorsMode !== void 0) {
                                      let a = e.authorsMode;
                                      const T = r;
                                      if (typeof a != "string")
                                        return d.errors = [
                                          {
                                            instancePath: t + "/authorsMode",
                                            schemaPath: "#/oneOf/6/properties/authorsMode/type",
                                            keyword: "type",
                                            params: {
                                              type: "string"
                                            },
                                            message: "must be string"
                                          }
                                        ], !1;
                                      if (!(a === "create" || a === "default-author" || a === "map"))
                                        return d.errors = [
                                          {
                                            instancePath: t + "/authorsMode",
                                            schemaPath: "#/oneOf/6/properties/authorsMode/enum",
                                            keyword: "enum",
                                            params: {
                                              allowedValues: zt.oneOf[6].properties.authorsMode.enum
                                            },
                                            message: "must be equal to one of the allowed values"
                                          }
                                        ], !1;
                                      var R = T === r;
                                    } else
                                      var R = !0;
                                    if (R) {
                                      if (e.authorsMap !== void 0) {
                                        let a = e.authorsMap;
                                        const T = r;
                                        if (r === T)
                                          if (a && typeof a == "object" && !Array.isArray(
                                            a
                                          ))
                                            for (const y in a) {
                                              const G = r;
                                              if (typeof a[y] != "string")
                                                return d.errors = [
                                                  {
                                                    instancePath: t + "/authorsMap/" + y.replace(
                                                      /~/g,
                                                      "~0"
                                                    ).replace(
                                                      /\//g,
                                                      "~1"
                                                    ),
                                                    schemaPath: "#/oneOf/6/properties/authorsMap/additionalProperties/type",
                                                    keyword: "type",
                                                    params: {
                                                      type: "string"
                                                    },
                                                    message: "must be string"
                                                  }
                                                ], !1;
                                              var A = G === r;
                                              if (!A)
                                                break;
                                            }
                                          else
                                            return d.errors = [
                                              {
                                                instancePath: t + "/authorsMap",
                                                schemaPath: "#/oneOf/6/properties/authorsMap/type",
                                                keyword: "type",
                                                params: {
                                                  type: "object"
                                                },
                                                message: "must be object"
                                              }
                                            ], !1;
                                        var R = T === r;
                                      } else
                                        var R = !0;
                                      if (R) {
                                        if (e.importUsers !== void 0) {
                                          const a = r;
                                          if (typeof e.importUsers != "boolean")
                                            return d.errors = [
                                              {
                                                instancePath: t + "/importUsers",
                                                schemaPath: "#/oneOf/6/properties/importUsers/type",
                                                keyword: "type",
                                                params: {
                                                  type: "boolean"
                                                },
                                                message: "must be boolean"
                                              }
                                            ], !1;
                                          var R = a === r;
                                        } else
                                          var R = !0;
                                        if (R)
                                          if (e.importer !== void 0) {
                                            let a = e.importer;
                                            const T = r;
                                            if (typeof a != "string")
                                              return d.errors = [
                                                {
                                                  instancePath: t + "/importer",
                                                  schemaPath: "#/oneOf/6/properties/importer/type",
                                                  keyword: "type",
                                                  params: {
                                                    type: "string"
                                                  },
                                                  message: "must be string"
                                                }
                                              ], !1;
                                            if (!(a === "data-liberation" || a === "default"))
                                              return d.errors = [
                                                {
                                                  instancePath: t + "/importer",
                                                  schemaPath: "#/oneOf/6/properties/importer/enum",
                                                  keyword: "enum",
                                                  params: {
                                                    allowedValues: zt.oneOf[6].properties.importer.enum
                                                  },
                                                  message: "must be equal to one of the allowed values"
                                                }
                                              ], !1;
                                            var R = T === r;
                                          } else
                                            var R = !0;
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/6/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "importThemeStarterContent") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/7/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "themeSlug"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/7/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/7/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/7/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var C = G === r;
                            } else
                              var C = !0;
                            if (C)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/7/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var C = y === r;
                              } else
                                var C = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/7/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var b = T === r;
                    } else
                      var b = !0;
                    if (b) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/7/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "importThemeStarterContent")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/7/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "importThemeStarterContent"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var b = T === r;
                      } else
                        var b = !0;
                      if (b)
                        if (e.themeSlug !== void 0) {
                          const a = r;
                          if (typeof e.themeSlug != "string")
                            return d.errors = [
                              {
                                instancePath: t + "/themeSlug",
                                schemaPath: "#/oneOf/7/properties/themeSlug/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          var b = a === r;
                        } else
                          var b = !0;
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/7/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "importWordPressFiles") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.step === void 0 && (F = "step") || e.wordPressFilesZip === void 0 && (F = "wordPressFilesZip"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/8/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "wordPressFilesZip" || a === "pathInZip"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/8/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/8/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/8/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var S = G === r;
                            } else
                              var S = !0;
                            if (S)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/8/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var S = y === r;
                              } else
                                var S = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/8/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var P = T === r;
                    } else
                      var P = !0;
                    if (P) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/8/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "importWordPressFiles")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/8/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "importWordPressFiles"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var P = T === r;
                      } else
                        var P = !0;
                      if (P) {
                        if (e.wordPressFilesZip !== void 0) {
                          const a = r;
                          ce(
                            e.wordPressFilesZip,
                            {
                              instancePath: t + "/wordPressFilesZip",
                              parentData: e,
                              parentDataProperty: "wordPressFilesZip",
                              rootData: o
                            }
                          ) || (n = n === null ? ce.errors : n.concat(
                            ce.errors
                          ), r = n.length);
                          var P = a === r;
                        } else
                          var P = !0;
                        if (P)
                          if (e.pathInZip !== void 0) {
                            const a = r;
                            if (typeof e.pathInZip != "string")
                              return d.errors = [
                                {
                                  instancePath: t + "/pathInZip",
                                  schemaPath: "#/oneOf/8/properties/pathInZip/type",
                                  keyword: "type",
                                  params: {
                                    type: "string"
                                  },
                                  message: "must be string"
                                }
                              ], !1;
                            var P = a === r;
                          } else
                            var P = !0;
                      }
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/8/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "installPlugin") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.pluginData === void 0 && (F = "pluginData") || e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/9/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "ifAlreadyInstalled" || a === "step" || a === "pluginData" || a === "pluginZipFile" || a === "options"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/9/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/9/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/9/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var $ = G === r;
                            } else
                              var $ = !0;
                            if ($)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/9/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var $ = y === r;
                              } else
                                var $ = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/9/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var L = T === r;
                    } else
                      var L = !0;
                    if (L) {
                      if (e.ifAlreadyInstalled !== void 0) {
                        let a = e.ifAlreadyInstalled;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/ifAlreadyInstalled",
                              schemaPath: "#/oneOf/9/properties/ifAlreadyInstalled/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (!(a === "overwrite" || a === "skip" || a === "error"))
                          return d.errors = [
                            {
                              instancePath: t + "/ifAlreadyInstalled",
                              schemaPath: "#/oneOf/9/properties/ifAlreadyInstalled/enum",
                              keyword: "enum",
                              params: {
                                allowedValues: zt.oneOf[9].properties.ifAlreadyInstalled.enum
                              },
                              message: "must be equal to one of the allowed values"
                            }
                          ], !1;
                        var L = T === r;
                      } else
                        var L = !0;
                      if (L) {
                        if (e.step !== void 0) {
                          let a = e.step;
                          const T = r;
                          if (typeof a != "string")
                            return d.errors = [
                              {
                                instancePath: t + "/step",
                                schemaPath: "#/oneOf/9/properties/step/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          if (a !== "installPlugin")
                            return d.errors = [
                              {
                                instancePath: t + "/step",
                                schemaPath: "#/oneOf/9/properties/step/const",
                                keyword: "const",
                                params: {
                                  allowedValue: "installPlugin"
                                },
                                message: "must be equal to constant"
                              }
                            ], !1;
                          var L = T === r;
                        } else
                          var L = !0;
                        if (L) {
                          if (e.pluginData !== void 0) {
                            let a = e.pluginData;
                            const T = r, Z = r;
                            let y = !1;
                            const G = r;
                            ce(
                              a,
                              {
                                instancePath: t + "/pluginData",
                                parentData: e,
                                parentDataProperty: "pluginData",
                                rootData: o
                              }
                            ) || (n = n === null ? ce.errors : n.concat(
                              ce.errors
                            ), r = n.length);
                            var x = G === r;
                            if (y = y || x, !y) {
                              const ie = r;
                              Me(
                                a,
                                {
                                  instancePath: t + "/pluginData",
                                  parentData: e,
                                  parentDataProperty: "pluginData",
                                  rootData: o
                                }
                              ) || (n = n === null ? Me.errors : n.concat(
                                Me.errors
                              ), r = n.length);
                              var x = ie === r;
                              y = y || x;
                            }
                            if (y)
                              r = Z, n !== null && (Z ? n.length = Z : n = null);
                            else {
                              const ie = {
                                instancePath: t + "/pluginData",
                                schemaPath: "#/oneOf/9/properties/pluginData/anyOf",
                                keyword: "anyOf",
                                params: {},
                                message: "must match a schema in anyOf"
                              };
                              return n === null ? n = [
                                ie
                              ] : n.push(
                                ie
                              ), r++, d.errors = n, !1;
                            }
                            var L = T === r;
                          } else
                            var L = !0;
                          if (L) {
                            if (e.pluginZipFile !== void 0) {
                              const a = r;
                              ce(
                                e.pluginZipFile,
                                {
                                  instancePath: t + "/pluginZipFile",
                                  parentData: e,
                                  parentDataProperty: "pluginZipFile",
                                  rootData: o
                                }
                              ) || (n = n === null ? ce.errors : n.concat(
                                ce.errors
                              ), r = n.length);
                              var L = a === r;
                            } else
                              var L = !0;
                            if (L)
                              if (e.options !== void 0) {
                                let a = e.options;
                                const T = r;
                                if (r === r)
                                  if (a && typeof a == "object" && !Array.isArray(
                                    a
                                  )) {
                                    const G = r;
                                    for (const re in a)
                                      if (!(re === "activate" || re === "activationOptions" || re === "onError" || re === "targetFolderName" || re === "humanReadableName"))
                                        return d.errors = [
                                          {
                                            instancePath: t + "/options",
                                            schemaPath: "#/definitions/InstallPluginOptions/additionalProperties",
                                            keyword: "additionalProperties",
                                            params: {
                                              additionalProperty: re
                                            },
                                            message: "must NOT have additional properties"
                                          }
                                        ], !1;
                                    if (G === r) {
                                      if (a.activate !== void 0) {
                                        const re = r;
                                        if (typeof a.activate != "boolean")
                                          return d.errors = [
                                            {
                                              instancePath: t + "/options/activate",
                                              schemaPath: "#/definitions/InstallPluginOptions/properties/activate/type",
                                              keyword: "type",
                                              params: {
                                                type: "boolean"
                                              },
                                              message: "must be boolean"
                                            }
                                          ], !1;
                                        var I = re === r;
                                      } else
                                        var I = !0;
                                      if (I) {
                                        if (a.activationOptions !== void 0) {
                                          let re = a.activationOptions;
                                          const ie = r;
                                          if (r === ie && !(re && typeof re == "object" && !Array.isArray(
                                            re
                                          )))
                                            return d.errors = [
                                              {
                                                instancePath: t + "/options/activationOptions",
                                                schemaPath: "#/definitions/InstallPluginOptions/properties/activationOptions/type",
                                                keyword: "type",
                                                params: {
                                                  type: "object"
                                                },
                                                message: "must be object"
                                              }
                                            ], !1;
                                          var I = ie === r;
                                        } else
                                          var I = !0;
                                        if (I) {
                                          if (a.onError !== void 0) {
                                            let re = a.onError;
                                            const ie = r;
                                            if (typeof re != "string")
                                              return d.errors = [
                                                {
                                                  instancePath: t + "/options/onError",
                                                  schemaPath: "#/definitions/InstallPluginOptions/properties/onError/type",
                                                  keyword: "type",
                                                  params: {
                                                    type: "string"
                                                  },
                                                  message: "must be string"
                                                }
                                              ], !1;
                                            if (!(re === "skip-plugin" || re === "throw"))
                                              return d.errors = [
                                                {
                                                  instancePath: t + "/options/onError",
                                                  schemaPath: "#/definitions/InstallPluginOptions/properties/onError/enum",
                                                  keyword: "enum",
                                                  params: {
                                                    allowedValues: gm.properties.onError.enum
                                                  },
                                                  message: "must be equal to one of the allowed values"
                                                }
                                              ], !1;
                                            var I = ie === r;
                                          } else
                                            var I = !0;
                                          if (I) {
                                            if (a.targetFolderName !== void 0) {
                                              const re = r;
                                              if (typeof a.targetFolderName != "string")
                                                return d.errors = [
                                                  {
                                                    instancePath: t + "/options/targetFolderName",
                                                    schemaPath: "#/definitions/InstallPluginOptions/properties/targetFolderName/type",
                                                    keyword: "type",
                                                    params: {
                                                      type: "string"
                                                    },
                                                    message: "must be string"
                                                  }
                                                ], !1;
                                              var I = re === r;
                                            } else
                                              var I = !0;
                                            if (I)
                                              if (a.humanReadableName !== void 0) {
                                                const re = r;
                                                if (typeof a.humanReadableName != "string")
                                                  return d.errors = [
                                                    {
                                                      instancePath: t + "/options/humanReadableName",
                                                      schemaPath: "#/definitions/InstallPluginOptions/properties/humanReadableName/type",
                                                      keyword: "type",
                                                      params: {
                                                        type: "string"
                                                      },
                                                      message: "must be string"
                                                    }
                                                  ], !1;
                                                var I = re === r;
                                              } else
                                                var I = !0;
                                          }
                                        }
                                      }
                                    }
                                  } else
                                    return d.errors = [
                                      {
                                        instancePath: t + "/options",
                                        schemaPath: "#/definitions/InstallPluginOptions/type",
                                        keyword: "type",
                                        params: {
                                          type: "object"
                                        },
                                        message: "must be object"
                                      }
                                    ], !1;
                                var L = T === r;
                              } else
                                var L = !0;
                          }
                        }
                      }
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/9/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "installTheme") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.step === void 0 && (F = "step") || e.themeData === void 0 && (F = "themeData"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/10/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "ifAlreadyInstalled" || a === "step" || a === "themeData" || a === "themeZipFile" || a === "options"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/10/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/10/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/10/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var q = G === r;
                            } else
                              var q = !0;
                            if (q)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/10/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var q = y === r;
                              } else
                                var q = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/10/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var N = T === r;
                    } else
                      var N = !0;
                    if (N) {
                      if (e.ifAlreadyInstalled !== void 0) {
                        let a = e.ifAlreadyInstalled;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/ifAlreadyInstalled",
                              schemaPath: "#/oneOf/10/properties/ifAlreadyInstalled/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (!(a === "overwrite" || a === "skip" || a === "error"))
                          return d.errors = [
                            {
                              instancePath: t + "/ifAlreadyInstalled",
                              schemaPath: "#/oneOf/10/properties/ifAlreadyInstalled/enum",
                              keyword: "enum",
                              params: {
                                allowedValues: zt.oneOf[10].properties.ifAlreadyInstalled.enum
                              },
                              message: "must be equal to one of the allowed values"
                            }
                          ], !1;
                        var N = T === r;
                      } else
                        var N = !0;
                      if (N) {
                        if (e.step !== void 0) {
                          let a = e.step;
                          const T = r;
                          if (typeof a != "string")
                            return d.errors = [
                              {
                                instancePath: t + "/step",
                                schemaPath: "#/oneOf/10/properties/step/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          if (a !== "installTheme")
                            return d.errors = [
                              {
                                instancePath: t + "/step",
                                schemaPath: "#/oneOf/10/properties/step/const",
                                keyword: "const",
                                params: {
                                  allowedValue: "installTheme"
                                },
                                message: "must be equal to constant"
                              }
                            ], !1;
                          var N = T === r;
                        } else
                          var N = !0;
                        if (N) {
                          if (e.themeData !== void 0) {
                            let a = e.themeData;
                            const T = r, Z = r;
                            let y = !1;
                            const G = r;
                            ce(
                              a,
                              {
                                instancePath: t + "/themeData",
                                parentData: e,
                                parentDataProperty: "themeData",
                                rootData: o
                              }
                            ) || (n = n === null ? ce.errors : n.concat(
                              ce.errors
                            ), r = n.length);
                            var z = G === r;
                            if (y = y || z, !y) {
                              const ie = r;
                              Me(
                                a,
                                {
                                  instancePath: t + "/themeData",
                                  parentData: e,
                                  parentDataProperty: "themeData",
                                  rootData: o
                                }
                              ) || (n = n === null ? Me.errors : n.concat(
                                Me.errors
                              ), r = n.length);
                              var z = ie === r;
                              y = y || z;
                            }
                            if (y)
                              r = Z, n !== null && (Z ? n.length = Z : n = null);
                            else {
                              const ie = {
                                instancePath: t + "/themeData",
                                schemaPath: "#/oneOf/10/properties/themeData/anyOf",
                                keyword: "anyOf",
                                params: {},
                                message: "must match a schema in anyOf"
                              };
                              return n === null ? n = [
                                ie
                              ] : n.push(
                                ie
                              ), r++, d.errors = n, !1;
                            }
                            var N = T === r;
                          } else
                            var N = !0;
                          if (N) {
                            if (e.themeZipFile !== void 0) {
                              const a = r;
                              ce(
                                e.themeZipFile,
                                {
                                  instancePath: t + "/themeZipFile",
                                  parentData: e,
                                  parentDataProperty: "themeZipFile",
                                  rootData: o
                                }
                              ) || (n = n === null ? ce.errors : n.concat(
                                ce.errors
                              ), r = n.length);
                              var N = a === r;
                            } else
                              var N = !0;
                            if (N)
                              if (e.options !== void 0) {
                                let a = e.options;
                                const T = r;
                                if (r === r)
                                  if (a && typeof a == "object" && !Array.isArray(
                                    a
                                  )) {
                                    const G = r;
                                    for (const re in a)
                                      if (!(re === "activate" || re === "importStarterContent" || re === "onError" || re === "targetFolderName" || re === "humanReadableName"))
                                        return d.errors = [
                                          {
                                            instancePath: t + "/options",
                                            schemaPath: "#/definitions/InstallThemeOptions/additionalProperties",
                                            keyword: "additionalProperties",
                                            params: {
                                              additionalProperty: re
                                            },
                                            message: "must NOT have additional properties"
                                          }
                                        ], !1;
                                    if (G === r) {
                                      if (a.activate !== void 0) {
                                        const re = r;
                                        if (typeof a.activate != "boolean")
                                          return d.errors = [
                                            {
                                              instancePath: t + "/options/activate",
                                              schemaPath: "#/definitions/InstallThemeOptions/properties/activate/type",
                                              keyword: "type",
                                              params: {
                                                type: "boolean"
                                              },
                                              message: "must be boolean"
                                            }
                                          ], !1;
                                        var B = re === r;
                                      } else
                                        var B = !0;
                                      if (B) {
                                        if (a.importStarterContent !== void 0) {
                                          const re = r;
                                          if (typeof a.importStarterContent != "boolean")
                                            return d.errors = [
                                              {
                                                instancePath: t + "/options/importStarterContent",
                                                schemaPath: "#/definitions/InstallThemeOptions/properties/importStarterContent/type",
                                                keyword: "type",
                                                params: {
                                                  type: "boolean"
                                                },
                                                message: "must be boolean"
                                              }
                                            ], !1;
                                          var B = re === r;
                                        } else
                                          var B = !0;
                                        if (B) {
                                          if (a.onError !== void 0) {
                                            let re = a.onError;
                                            const ie = r;
                                            if (typeof re != "string")
                                              return d.errors = [
                                                {
                                                  instancePath: t + "/options/onError",
                                                  schemaPath: "#/definitions/InstallThemeOptions/properties/onError/type",
                                                  keyword: "type",
                                                  params: {
                                                    type: "string"
                                                  },
                                                  message: "must be string"
                                                }
                                              ], !1;
                                            if (!(re === "skip-theme" || re === "throw"))
                                              return d.errors = [
                                                {
                                                  instancePath: t + "/options/onError",
                                                  schemaPath: "#/definitions/InstallThemeOptions/properties/onError/enum",
                                                  keyword: "enum",
                                                  params: {
                                                    allowedValues: _m.properties.onError.enum
                                                  },
                                                  message: "must be equal to one of the allowed values"
                                                }
                                              ], !1;
                                            var B = ie === r;
                                          } else
                                            var B = !0;
                                          if (B) {
                                            if (a.targetFolderName !== void 0) {
                                              const re = r;
                                              if (typeof a.targetFolderName != "string")
                                                return d.errors = [
                                                  {
                                                    instancePath: t + "/options/targetFolderName",
                                                    schemaPath: "#/definitions/InstallThemeOptions/properties/targetFolderName/type",
                                                    keyword: "type",
                                                    params: {
                                                      type: "string"
                                                    },
                                                    message: "must be string"
                                                  }
                                                ], !1;
                                              var B = re === r;
                                            } else
                                              var B = !0;
                                            if (B)
                                              if (a.humanReadableName !== void 0) {
                                                const re = r;
                                                if (typeof a.humanReadableName != "string")
                                                  return d.errors = [
                                                    {
                                                      instancePath: t + "/options/humanReadableName",
                                                      schemaPath: "#/definitions/InstallThemeOptions/properties/humanReadableName/type",
                                                      keyword: "type",
                                                      params: {
                                                        type: "string"
                                                      },
                                                      message: "must be string"
                                                    }
                                                  ], !1;
                                                var B = re === r;
                                              } else
                                                var B = !0;
                                          }
                                        }
                                      }
                                    }
                                  } else
                                    return d.errors = [
                                      {
                                        instancePath: t + "/options",
                                        schemaPath: "#/definitions/InstallThemeOptions/type",
                                        keyword: "type",
                                        params: {
                                          type: "object"
                                        },
                                        message: "must be object"
                                      }
                                    ], !1;
                                var N = T === r;
                              } else
                                var N = !0;
                          }
                        }
                      }
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/10/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "login") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/11/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "username" || a === "password"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/11/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/11/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/11/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var H = G === r;
                            } else
                              var H = !0;
                            if (H)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/11/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var H = y === r;
                              } else
                                var H = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/11/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var U = T === r;
                    } else
                      var U = !0;
                    if (U) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/11/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "login")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/11/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "login"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var U = T === r;
                      } else
                        var U = !0;
                      if (U) {
                        if (e.username !== void 0) {
                          const a = r;
                          if (typeof e.username != "string")
                            return d.errors = [
                              {
                                instancePath: t + "/username",
                                schemaPath: "#/oneOf/11/properties/username/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          var U = a === r;
                        } else
                          var U = !0;
                        if (U)
                          if (e.password !== void 0) {
                            const a = r;
                            if (typeof e.password != "string")
                              return d.errors = [
                                {
                                  instancePath: t + "/password",
                                  schemaPath: "#/oneOf/11/properties/password/type",
                                  keyword: "type",
                                  params: {
                                    type: "string"
                                  },
                                  message: "must be string"
                                }
                              ], !1;
                            var U = a === r;
                          } else
                            var U = !0;
                      }
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/11/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "mkdir") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.path === void 0 && (F = "path") || e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/12/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "path"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/12/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/12/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/12/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var Y = G === r;
                            } else
                              var Y = !0;
                            if (Y)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/12/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var Y = y === r;
                              } else
                                var Y = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/12/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var J = T === r;
                    } else
                      var J = !0;
                    if (J) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/12/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "mkdir")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/12/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "mkdir"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var J = T === r;
                      } else
                        var J = !0;
                      if (J)
                        if (e.path !== void 0) {
                          const a = r;
                          if (typeof e.path != "string")
                            return d.errors = [
                              {
                                instancePath: t + "/path",
                                schemaPath: "#/oneOf/12/properties/path/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          var J = a === r;
                        } else
                          var J = !0;
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/12/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "mv") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.fromPath === void 0 && (F = "fromPath") || e.step === void 0 && (F = "step") || e.toPath === void 0 && (F = "toPath"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/13/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "fromPath" || a === "toPath"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/13/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/13/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/13/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var M = G === r;
                            } else
                              var M = !0;
                            if (M)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/13/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var M = y === r;
                              } else
                                var M = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/13/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var te = T === r;
                    } else
                      var te = !0;
                    if (te) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/13/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "mv")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/13/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "mv"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var te = T === r;
                      } else
                        var te = !0;
                      if (te) {
                        if (e.fromPath !== void 0) {
                          const a = r;
                          if (typeof e.fromPath != "string")
                            return d.errors = [
                              {
                                instancePath: t + "/fromPath",
                                schemaPath: "#/oneOf/13/properties/fromPath/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          var te = a === r;
                        } else
                          var te = !0;
                        if (te)
                          if (e.toPath !== void 0) {
                            const a = r;
                            if (typeof e.toPath != "string")
                              return d.errors = [
                                {
                                  instancePath: t + "/toPath",
                                  schemaPath: "#/oneOf/13/properties/toPath/type",
                                  keyword: "type",
                                  params: {
                                    type: "string"
                                  },
                                  message: "must be string"
                                }
                              ], !1;
                            var te = a === r;
                          } else
                            var te = !0;
                      }
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/13/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "resetData") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/14/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "contentTypes"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/14/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/14/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/14/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var se = G === r;
                            } else
                              var se = !0;
                            if (se)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/14/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var se = y === r;
                              } else
                                var se = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/14/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var X = T === r;
                    } else
                      var X = !0;
                    if (X) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/14/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "resetData")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/14/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "resetData"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var X = T === r;
                      } else
                        var X = !0;
                      if (X)
                        if (e.contentTypes !== void 0) {
                          let a = e.contentTypes;
                          const T = r;
                          if (r === T)
                            if (Array.isArray(
                              a
                            )) {
                              var _e = !0;
                              const y = a.length;
                              for (let G = 0; G < y; G++) {
                                let re = a[G];
                                const ie = r;
                                if (typeof re != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/contentTypes/" + G,
                                      schemaPath: "#/oneOf/14/properties/contentTypes/items/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                if (!(re === "posts" || re === "pages" || re === "comments"))
                                  return d.errors = [
                                    {
                                      instancePath: t + "/contentTypes/" + G,
                                      schemaPath: "#/oneOf/14/properties/contentTypes/items/enum",
                                      keyword: "enum",
                                      params: {
                                        allowedValues: zt.oneOf[14].properties.contentTypes.items.enum
                                      },
                                      message: "must be equal to one of the allowed values"
                                    }
                                  ], !1;
                                var _e = ie === r;
                                if (!_e)
                                  break;
                              }
                            } else
                              return d.errors = [
                                {
                                  instancePath: t + "/contentTypes",
                                  schemaPath: "#/oneOf/14/properties/contentTypes/type",
                                  keyword: "type",
                                  params: {
                                    type: "array"
                                  },
                                  message: "must be array"
                                }
                              ], !1;
                          var X = T === r;
                        } else
                          var X = !0;
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/14/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "request") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.request === void 0 && (F = "request") || e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/15/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "request"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/15/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/15/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/15/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var we = G === r;
                            } else
                              var we = !0;
                            if (we)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/15/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var we = y === r;
                              } else
                                var we = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/15/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var xe = T === r;
                    } else
                      var xe = !0;
                    if (xe) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/15/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "request")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/15/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "request"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var xe = T === r;
                      } else
                        var xe = !0;
                      if (xe)
                        if (e.request !== void 0) {
                          const a = r;
                          Xe(
                            e.request,
                            {
                              instancePath: t + "/request",
                              parentData: e,
                              parentDataProperty: "request",
                              rootData: o
                            }
                          ) || (n = n === null ? Xe.errors : n.concat(
                            Xe.errors
                          ), r = n.length);
                          var xe = a === r;
                        } else
                          var xe = !0;
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/15/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "rm") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.path === void 0 && (F = "path") || e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/16/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "path"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/16/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/16/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/16/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var mt = G === r;
                            } else
                              var mt = !0;
                            if (mt)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/16/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var mt = y === r;
                              } else
                                var mt = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/16/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var tt = T === r;
                    } else
                      var tt = !0;
                    if (tt) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/16/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "rm")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/16/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "rm"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var tt = T === r;
                      } else
                        var tt = !0;
                      if (tt)
                        if (e.path !== void 0) {
                          const a = r;
                          if (typeof e.path != "string")
                            return d.errors = [
                              {
                                instancePath: t + "/path",
                                schemaPath: "#/oneOf/16/properties/path/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          var tt = a === r;
                        } else
                          var tt = !0;
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/16/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "rmdir") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.path === void 0 && (F = "path") || e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/17/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "path"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/17/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/17/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/17/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var Ne = G === r;
                            } else
                              var Ne = !0;
                            if (Ne)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/17/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var Ne = y === r;
                              } else
                                var Ne = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/17/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var Ae = T === r;
                    } else
                      var Ae = !0;
                    if (Ae) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/17/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "rmdir")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/17/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "rmdir"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var Ae = T === r;
                      } else
                        var Ae = !0;
                      if (Ae)
                        if (e.path !== void 0) {
                          const a = r;
                          if (typeof e.path != "string")
                            return d.errors = [
                              {
                                instancePath: t + "/path",
                                schemaPath: "#/oneOf/17/properties/path/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          var Ae = a === r;
                        } else
                          var Ae = !0;
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/17/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "runPHP") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.code === void 0 && (F = "code") || e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/18/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "code"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/18/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/18/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/18/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var ht = G === r;
                            } else
                              var ht = !0;
                            if (ht)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/18/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var ht = y === r;
                              } else
                                var ht = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/18/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var me = T === r;
                    } else
                      var me = !0;
                    if (me) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/18/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "runPHP")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/18/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "runPHP"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var me = T === r;
                      } else
                        var me = !0;
                      if (me)
                        if (e.code !== void 0) {
                          let a = e.code;
                          const T = r, Z = r;
                          let y = !1;
                          const G = r;
                          if (typeof a != "string") {
                            const ie = {
                              instancePath: t + "/code",
                              schemaPath: "#/oneOf/18/properties/code/anyOf/0/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            };
                            n === null ? n = [ie] : n.push(ie), r++;
                          }
                          var $e = G === r;
                          if (y = y || $e, !y) {
                            const ie = r;
                            if (r === ie)
                              if (a && typeof a == "object" && !Array.isArray(
                                a
                              )) {
                                let Ee;
                                if (a.filename === void 0 && (Ee = "filename") || a.content === void 0 && (Ee = "content")) {
                                  const kt = {
                                    instancePath: t + "/code",
                                    schemaPath: "#/oneOf/18/properties/code/anyOf/1/required",
                                    keyword: "required",
                                    params: {
                                      missingProperty: Ee
                                    },
                                    message: "must have required property '" + Ee + "'"
                                  };
                                  n === null ? n = [
                                    kt
                                  ] : n.push(
                                    kt
                                  ), r++;
                                } else {
                                  const kt = r;
                                  for (const ve in a)
                                    if (!(ve === "filename" || ve === "content")) {
                                      const gt = {
                                        instancePath: t + "/code",
                                        schemaPath: "#/oneOf/18/properties/code/anyOf/1/additionalProperties",
                                        keyword: "additionalProperties",
                                        params: {
                                          additionalProperty: ve
                                        },
                                        message: "must NOT have additional properties"
                                      };
                                      n === null ? n = [
                                        gt
                                      ] : n.push(
                                        gt
                                      ), r++;
                                      break;
                                    }
                                  if (kt === r) {
                                    if (a.filename !== void 0) {
                                      const ve = r;
                                      if (typeof a.filename != "string") {
                                        const gt = {
                                          instancePath: t + "/code/filename",
                                          schemaPath: "#/oneOf/18/properties/code/anyOf/1/properties/filename/type",
                                          keyword: "type",
                                          params: {
                                            type: "string"
                                          },
                                          message: "must be string"
                                        };
                                        n === null ? n = [
                                          gt
                                        ] : n.push(
                                          gt
                                        ), r++;
                                      }
                                      var Pt = ve === r;
                                    } else
                                      var Pt = !0;
                                    if (Pt)
                                      if (a.content !== void 0) {
                                        const ve = r;
                                        if (typeof a.content != "string") {
                                          const pe = {
                                            instancePath: t + "/code/content",
                                            schemaPath: "#/oneOf/18/properties/code/anyOf/1/properties/content/type",
                                            keyword: "type",
                                            params: {
                                              type: "string"
                                            },
                                            message: "must be string"
                                          };
                                          n === null ? n = [
                                            pe
                                          ] : n.push(
                                            pe
                                          ), r++;
                                        }
                                        var Pt = ve === r;
                                      } else
                                        var Pt = !0;
                                  }
                                }
                              } else {
                                const Ee = {
                                  instancePath: t + "/code",
                                  schemaPath: "#/oneOf/18/properties/code/anyOf/1/type",
                                  keyword: "type",
                                  params: {
                                    type: "object"
                                  },
                                  message: "must be object"
                                };
                                n === null ? n = [
                                  Ee
                                ] : n.push(
                                  Ee
                                ), r++;
                              }
                            var $e = ie === r;
                            y = y || $e;
                          }
                          if (y)
                            r = Z, n !== null && (Z ? n.length = Z : n = null);
                          else {
                            const ie = {
                              instancePath: t + "/code",
                              schemaPath: "#/oneOf/18/properties/code/anyOf",
                              keyword: "anyOf",
                              params: {},
                              message: "must match a schema in anyOf"
                            };
                            return n === null ? n = [ie] : n.push(ie), r++, d.errors = n, !1;
                          }
                          var me = T === r;
                        } else
                          var me = !0;
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/18/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "runPHPWithOptions") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.options === void 0 && (F = "options") || e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/19/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "options"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/19/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/19/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/19/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var er = G === r;
                            } else
                              var er = !0;
                            if (er)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/19/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var er = y === r;
                              } else
                                var er = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/19/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var yt = T === r;
                    } else
                      var yt = !0;
                    if (yt) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/19/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "runPHPWithOptions")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/19/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "runPHPWithOptions"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var yt = T === r;
                      } else
                        var yt = !0;
                      if (yt)
                        if (e.options !== void 0) {
                          const a = r;
                          Pe(
                            e.options,
                            {
                              instancePath: t + "/options",
                              parentData: e,
                              parentDataProperty: "options",
                              rootData: o
                            }
                          ) || (n = n === null ? Pe.errors : n.concat(
                            Pe.errors
                          ), r = n.length);
                          var yt = a === r;
                        } else
                          var yt = !0;
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/19/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "runWpInstallationWizard") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.options === void 0 && (F = "options") || e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/20/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "options"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/20/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/20/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/20/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var tr = G === r;
                            } else
                              var tr = !0;
                            if (tr)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/20/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var tr = y === r;
                              } else
                                var tr = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/20/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var ze = T === r;
                    } else
                      var ze = !0;
                    if (ze) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/20/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "runWpInstallationWizard")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/20/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "runWpInstallationWizard"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var ze = T === r;
                      } else
                        var ze = !0;
                      if (ze)
                        if (e.options !== void 0) {
                          let a = e.options;
                          const T = r;
                          if (r === r)
                            if (a && typeof a == "object" && !Array.isArray(
                              a
                            )) {
                              const G = r;
                              for (const re in a)
                                if (!(re === "adminUsername" || re === "adminPassword"))
                                  return d.errors = [
                                    {
                                      instancePath: t + "/options",
                                      schemaPath: "#/definitions/WordPressInstallationOptions/additionalProperties",
                                      keyword: "additionalProperties",
                                      params: {
                                        additionalProperty: re
                                      },
                                      message: "must NOT have additional properties"
                                    }
                                  ], !1;
                              if (G === r) {
                                if (a.adminUsername !== void 0) {
                                  const re = r;
                                  if (typeof a.adminUsername != "string")
                                    return d.errors = [
                                      {
                                        instancePath: t + "/options/adminUsername",
                                        schemaPath: "#/definitions/WordPressInstallationOptions/properties/adminUsername/type",
                                        keyword: "type",
                                        params: {
                                          type: "string"
                                        },
                                        message: "must be string"
                                      }
                                    ], !1;
                                  var Wt = re === r;
                                } else
                                  var Wt = !0;
                                if (Wt)
                                  if (a.adminPassword !== void 0) {
                                    const re = r;
                                    if (typeof a.adminPassword != "string")
                                      return d.errors = [
                                        {
                                          instancePath: t + "/options/adminPassword",
                                          schemaPath: "#/definitions/WordPressInstallationOptions/properties/adminPassword/type",
                                          keyword: "type",
                                          params: {
                                            type: "string"
                                          },
                                          message: "must be string"
                                        }
                                      ], !1;
                                    var Wt = re === r;
                                  } else
                                    var Wt = !0;
                              }
                            } else
                              return d.errors = [
                                {
                                  instancePath: t + "/options",
                                  schemaPath: "#/definitions/WordPressInstallationOptions/type",
                                  keyword: "type",
                                  params: {
                                    type: "object"
                                  },
                                  message: "must be object"
                                }
                              ], !1;
                          var ze = T === r;
                        } else
                          var ze = !0;
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/20/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "runSql") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.sql === void 0 && (F = "sql") || e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/21/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "sql"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/21/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/21/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/21/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var Mt = G === r;
                            } else
                              var Mt = !0;
                            if (Mt)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/21/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var Mt = y === r;
                              } else
                                var Mt = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/21/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var xt = T === r;
                    } else
                      var xt = !0;
                    if (xt) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/21/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "runSql")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/21/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "runSql"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var xt = T === r;
                      } else
                        var xt = !0;
                      if (xt)
                        if (e.sql !== void 0) {
                          const a = r;
                          ce(e.sql, {
                            instancePath: t + "/sql",
                            parentData: e,
                            parentDataProperty: "sql",
                            rootData: o
                          }) || (n = n === null ? ce.errors : n.concat(
                            ce.errors
                          ), r = n.length);
                          var xt = a === r;
                        } else
                          var xt = !0;
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/21/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "setSiteOptions") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.options === void 0 && (F = "options") || e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/22/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "options"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/22/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/22/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/22/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var Bt = G === r;
                            } else
                              var Bt = !0;
                            if (Bt)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/22/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var Bt = y === r;
                              } else
                                var Bt = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/22/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var $t = T === r;
                    } else
                      var $t = !0;
                    if ($t) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/22/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "setSiteOptions")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/22/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "setSiteOptions"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var $t = T === r;
                      } else
                        var $t = !0;
                      if ($t)
                        if (e.options !== void 0) {
                          let a = e.options;
                          const T = r;
                          if (r === T && !(a && typeof a == "object" && !Array.isArray(
                            a
                          )))
                            return d.errors = [
                              {
                                instancePath: t + "/options",
                                schemaPath: "#/oneOf/22/properties/options/type",
                                keyword: "type",
                                params: {
                                  type: "object"
                                },
                                message: "must be object"
                              }
                            ], !1;
                          var $t = T === r;
                        } else
                          var $t = !0;
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/22/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "unzip") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.extractToPath === void 0 && (F = "extractToPath") || e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/23/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "zipFile" || a === "zipPath" || a === "extractToPath"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/23/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/23/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/23/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var Ye = G === r;
                            } else
                              var Ye = !0;
                            if (Ye)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/23/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var Ye = y === r;
                              } else
                                var Ye = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/23/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var Re = T === r;
                    } else
                      var Re = !0;
                    if (Re) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/23/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "unzip")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/23/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "unzip"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var Re = T === r;
                      } else
                        var Re = !0;
                      if (Re) {
                        if (e.zipFile !== void 0) {
                          const a = r;
                          ce(
                            e.zipFile,
                            {
                              instancePath: t + "/zipFile",
                              parentData: e,
                              parentDataProperty: "zipFile",
                              rootData: o
                            }
                          ) || (n = n === null ? ce.errors : n.concat(
                            ce.errors
                          ), r = n.length);
                          var Re = a === r;
                        } else
                          var Re = !0;
                        if (Re) {
                          if (e.zipPath !== void 0) {
                            const a = r;
                            if (typeof e.zipPath != "string")
                              return d.errors = [
                                {
                                  instancePath: t + "/zipPath",
                                  schemaPath: "#/oneOf/23/properties/zipPath/type",
                                  keyword: "type",
                                  params: {
                                    type: "string"
                                  },
                                  message: "must be string"
                                }
                              ], !1;
                            var Re = a === r;
                          } else
                            var Re = !0;
                          if (Re)
                            if (e.extractToPath !== void 0) {
                              const a = r;
                              if (typeof e.extractToPath != "string")
                                return d.errors = [
                                  {
                                    instancePath: t + "/extractToPath",
                                    schemaPath: "#/oneOf/23/properties/extractToPath/type",
                                    keyword: "type",
                                    params: {
                                      type: "string"
                                    },
                                    message: "must be string"
                                  }
                                ], !1;
                              var Re = a === r;
                            } else
                              var Re = !0;
                        }
                      }
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/23/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "updateUserMeta") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.meta === void 0 && (F = "meta") || e.step === void 0 && (F = "step") || e.userId === void 0 && (F = "userId"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/24/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "meta" || a === "userId"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/24/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/24/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/24/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var rr = G === r;
                            } else
                              var rr = !0;
                            if (rr)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/24/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var rr = y === r;
                              } else
                                var rr = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/24/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var Ge = T === r;
                    } else
                      var Ge = !0;
                    if (Ge) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/24/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "updateUserMeta")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/24/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "updateUserMeta"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var Ge = T === r;
                      } else
                        var Ge = !0;
                      if (Ge) {
                        if (e.meta !== void 0) {
                          let a = e.meta;
                          const T = r;
                          if (r === T && !(a && typeof a == "object" && !Array.isArray(
                            a
                          )))
                            return d.errors = [
                              {
                                instancePath: t + "/meta",
                                schemaPath: "#/oneOf/24/properties/meta/type",
                                keyword: "type",
                                params: {
                                  type: "object"
                                },
                                message: "must be object"
                              }
                            ], !1;
                          var Ge = T === r;
                        } else
                          var Ge = !0;
                        if (Ge)
                          if (e.userId !== void 0) {
                            let a = e.userId;
                            const T = r;
                            if (!(typeof a == "number" && isFinite(
                              a
                            )))
                              return d.errors = [
                                {
                                  instancePath: t + "/userId",
                                  schemaPath: "#/oneOf/24/properties/userId/type",
                                  keyword: "type",
                                  params: {
                                    type: "number"
                                  },
                                  message: "must be number"
                                }
                              ], !1;
                            var Ge = T === r;
                          } else
                            var Ge = !0;
                      }
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/24/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "writeFile") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.data === void 0 && (F = "data") || e.path === void 0 && (F = "path") || e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/25/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "path" || a === "data"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/25/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/25/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/25/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var sr = G === r;
                            } else
                              var sr = !0;
                            if (sr)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/25/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var sr = y === r;
                              } else
                                var sr = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/25/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var rt = T === r;
                    } else
                      var rt = !0;
                    if (rt) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/25/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "writeFile")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/25/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "writeFile"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var rt = T === r;
                      } else
                        var rt = !0;
                      if (rt) {
                        if (e.path !== void 0) {
                          const a = r;
                          if (typeof e.path != "string")
                            return d.errors = [
                              {
                                instancePath: t + "/path",
                                schemaPath: "#/oneOf/25/properties/path/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          var rt = a === r;
                        } else
                          var rt = !0;
                        if (rt)
                          if (e.data !== void 0) {
                            let a = e.data;
                            const T = r, Z = r;
                            let y = !1;
                            const G = r;
                            ce(
                              a,
                              {
                                instancePath: t + "/data",
                                parentData: e,
                                parentDataProperty: "data",
                                rootData: o
                              }
                            ) || (n = n === null ? ce.errors : n.concat(
                              ce.errors
                            ), r = n.length);
                            var Ht = G === r;
                            if (y = y || Ht, !y) {
                              const ie = r;
                              if (typeof a != "string") {
                                const Ee = {
                                  instancePath: t + "/data",
                                  schemaPath: "#/oneOf/25/properties/data/anyOf/1/type",
                                  keyword: "type",
                                  params: {
                                    type: "string"
                                  },
                                  message: "must be string"
                                };
                                n === null ? n = [
                                  Ee
                                ] : n.push(
                                  Ee
                                ), r++;
                              }
                              var Ht = ie === r;
                              if (y = y || Ht, !y) {
                                const Ee = r;
                                if (r === Ee)
                                  if (a && typeof a == "object" && !Array.isArray(
                                    a
                                  )) {
                                    let ve;
                                    if (a.BYTES_PER_ELEMENT === void 0 && (ve = "BYTES_PER_ELEMENT") || a.buffer === void 0 && (ve = "buffer") || a.byteLength === void 0 && (ve = "byteLength") || a.byteOffset === void 0 && (ve = "byteOffset") || a.length === void 0 && (ve = "length")) {
                                      const gt = {
                                        instancePath: t + "/data",
                                        schemaPath: "#/oneOf/25/properties/data/anyOf/2/required",
                                        keyword: "required",
                                        params: {
                                          missingProperty: ve
                                        },
                                        message: "must have required property '" + ve + "'"
                                      };
                                      n === null ? n = [
                                        gt
                                      ] : n.push(
                                        gt
                                      ), r++;
                                    } else {
                                      const gt = r;
                                      for (const pe in a)
                                        if (!(pe === "BYTES_PER_ELEMENT" || pe === "buffer" || pe === "byteLength" || pe === "byteOffset" || pe === "length")) {
                                          let Ze = a[pe];
                                          const Vr = r;
                                          if (!(typeof Ze == "number" && isFinite(
                                            Ze
                                          ))) {
                                            const Oe = {
                                              instancePath: t + "/data/" + pe.replace(
                                                /~/g,
                                                "~0"
                                              ).replace(
                                                /\//g,
                                                "~1"
                                              ),
                                              schemaPath: "#/oneOf/25/properties/data/anyOf/2/additionalProperties/type",
                                              keyword: "type",
                                              params: {
                                                type: "number"
                                              },
                                              message: "must be number"
                                            };
                                            n === null ? n = [
                                              Oe
                                            ] : n.push(
                                              Oe
                                            ), r++;
                                          }
                                          var D = Vr === r;
                                          if (!D)
                                            break;
                                        }
                                      if (gt === r) {
                                        if (a.BYTES_PER_ELEMENT !== void 0) {
                                          let pe = a.BYTES_PER_ELEMENT;
                                          const Ze = r;
                                          if (!(typeof pe == "number" && isFinite(
                                            pe
                                          ))) {
                                            const Vr = {
                                              instancePath: t + "/data/BYTES_PER_ELEMENT",
                                              schemaPath: "#/oneOf/25/properties/data/anyOf/2/properties/BYTES_PER_ELEMENT/type",
                                              keyword: "type",
                                              params: {
                                                type: "number"
                                              },
                                              message: "must be number"
                                            };
                                            n === null ? n = [
                                              Vr
                                            ] : n.push(
                                              Vr
                                            ), r++;
                                          }
                                          var W = Ze === r;
                                        } else
                                          var W = !0;
                                        if (W) {
                                          if (a.buffer !== void 0) {
                                            let pe = a.buffer;
                                            const Ze = r;
                                            if (r === Ze)
                                              if (pe && typeof pe == "object" && !Array.isArray(
                                                pe
                                              )) {
                                                let Oe;
                                                if (pe.byteLength === void 0 && (Oe = "byteLength")) {
                                                  const zr = {
                                                    instancePath: t + "/data/buffer",
                                                    schemaPath: "#/oneOf/25/properties/data/anyOf/2/properties/buffer/required",
                                                    keyword: "required",
                                                    params: {
                                                      missingProperty: Oe
                                                    },
                                                    message: "must have required property '" + Oe + "'"
                                                  };
                                                  n === null ? n = [
                                                    zr
                                                  ] : n.push(
                                                    zr
                                                  ), r++;
                                                } else {
                                                  const zr = r;
                                                  for (const yr in pe)
                                                    if (yr !== "byteLength") {
                                                      const gr = {
                                                        instancePath: t + "/data/buffer",
                                                        schemaPath: "#/oneOf/25/properties/data/anyOf/2/properties/buffer/additionalProperties",
                                                        keyword: "additionalProperties",
                                                        params: {
                                                          additionalProperty: yr
                                                        },
                                                        message: "must NOT have additional properties"
                                                      };
                                                      n === null ? n = [
                                                        gr
                                                      ] : n.push(
                                                        gr
                                                      ), r++;
                                                      break;
                                                    }
                                                  if (zr === r && pe.byteLength !== void 0) {
                                                    let yr = pe.byteLength;
                                                    if (!(typeof yr == "number" && isFinite(
                                                      yr
                                                    ))) {
                                                      const gr = {
                                                        instancePath: t + "/data/buffer/byteLength",
                                                        schemaPath: "#/oneOf/25/properties/data/anyOf/2/properties/buffer/properties/byteLength/type",
                                                        keyword: "type",
                                                        params: {
                                                          type: "number"
                                                        },
                                                        message: "must be number"
                                                      };
                                                      n === null ? n = [
                                                        gr
                                                      ] : n.push(
                                                        gr
                                                      ), r++;
                                                    }
                                                  }
                                                }
                                              } else {
                                                const Oe = {
                                                  instancePath: t + "/data/buffer",
                                                  schemaPath: "#/oneOf/25/properties/data/anyOf/2/properties/buffer/type",
                                                  keyword: "type",
                                                  params: {
                                                    type: "object"
                                                  },
                                                  message: "must be object"
                                                };
                                                n === null ? n = [
                                                  Oe
                                                ] : n.push(
                                                  Oe
                                                ), r++;
                                              }
                                            var W = Ze === r;
                                          } else
                                            var W = !0;
                                          if (W) {
                                            if (a.byteLength !== void 0) {
                                              let pe = a.byteLength;
                                              const Ze = r;
                                              if (!(typeof pe == "number" && isFinite(
                                                pe
                                              ))) {
                                                const Oe = {
                                                  instancePath: t + "/data/byteLength",
                                                  schemaPath: "#/oneOf/25/properties/data/anyOf/2/properties/byteLength/type",
                                                  keyword: "type",
                                                  params: {
                                                    type: "number"
                                                  },
                                                  message: "must be number"
                                                };
                                                n === null ? n = [
                                                  Oe
                                                ] : n.push(
                                                  Oe
                                                ), r++;
                                              }
                                              var W = Ze === r;
                                            } else
                                              var W = !0;
                                            if (W) {
                                              if (a.byteOffset !== void 0) {
                                                let pe = a.byteOffset;
                                                const Ze = r;
                                                if (!(typeof pe == "number" && isFinite(
                                                  pe
                                                ))) {
                                                  const Oe = {
                                                    instancePath: t + "/data/byteOffset",
                                                    schemaPath: "#/oneOf/25/properties/data/anyOf/2/properties/byteOffset/type",
                                                    keyword: "type",
                                                    params: {
                                                      type: "number"
                                                    },
                                                    message: "must be number"
                                                  };
                                                  n === null ? n = [
                                                    Oe
                                                  ] : n.push(
                                                    Oe
                                                  ), r++;
                                                }
                                                var W = Ze === r;
                                              } else
                                                var W = !0;
                                              if (W)
                                                if (a.length !== void 0) {
                                                  let pe = a.length;
                                                  const Ze = r;
                                                  if (!(typeof pe == "number" && isFinite(
                                                    pe
                                                  ))) {
                                                    const Oe = {
                                                      instancePath: t + "/data/length",
                                                      schemaPath: "#/oneOf/25/properties/data/anyOf/2/properties/length/type",
                                                      keyword: "type",
                                                      params: {
                                                        type: "number"
                                                      },
                                                      message: "must be number"
                                                    };
                                                    n === null ? n = [
                                                      Oe
                                                    ] : n.push(
                                                      Oe
                                                    ), r++;
                                                  }
                                                  var W = Ze === r;
                                                } else
                                                  var W = !0;
                                            }
                                          }
                                        }
                                      }
                                    }
                                  } else {
                                    const ve = {
                                      instancePath: t + "/data",
                                      schemaPath: "#/oneOf/25/properties/data/anyOf/2/type",
                                      keyword: "type",
                                      params: {
                                        type: "object"
                                      },
                                      message: "must be object"
                                    };
                                    n === null ? n = [
                                      ve
                                    ] : n.push(
                                      ve
                                    ), r++;
                                  }
                                var Ht = Ee === r;
                                y = y || Ht;
                              }
                            }
                            if (y)
                              r = Z, n !== null && (Z ? n.length = Z : n = null);
                            else {
                              const ie = {
                                instancePath: t + "/data",
                                schemaPath: "#/oneOf/25/properties/data/anyOf",
                                keyword: "anyOf",
                                params: {},
                                message: "must match a schema in anyOf"
                              };
                              return n === null ? n = [
                                ie
                              ] : n.push(
                                ie
                              ), r++, d.errors = n, !1;
                            }
                            var rt = T === r;
                          } else
                            var rt = !0;
                      }
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/25/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "writeFiles") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.filesTree === void 0 && (F = "filesTree") || e.step === void 0 && (F = "step") || e.writeToPath === void 0 && (F = "writeToPath"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/26/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "writeToPath" || a === "filesTree"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/26/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/26/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/26/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var j = G === r;
                            } else
                              var j = !0;
                            if (j)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/26/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var j = y === r;
                              } else
                                var j = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/26/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var V = T === r;
                    } else
                      var V = !0;
                    if (V) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/26/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "writeFiles")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/26/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "writeFiles"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var V = T === r;
                      } else
                        var V = !0;
                      if (V) {
                        if (e.writeToPath !== void 0) {
                          const a = r;
                          if (typeof e.writeToPath != "string")
                            return d.errors = [
                              {
                                instancePath: t + "/writeToPath",
                                schemaPath: "#/oneOf/26/properties/writeToPath/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          var V = a === r;
                        } else
                          var V = !0;
                        if (V)
                          if (e.filesTree !== void 0) {
                            const a = r;
                            Me(
                              e.filesTree,
                              {
                                instancePath: t + "/filesTree",
                                parentData: e,
                                parentDataProperty: "filesTree",
                                rootData: o
                              }
                            ) || (n = n === null ? Me.errors : n.concat(
                              Me.errors
                            ), r = n.length);
                            var V = a === r;
                          } else
                            var V = !0;
                      }
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/26/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "wp-cli") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.command === void 0 && (F = "command") || e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/27/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "command" || a === "wpCliPath"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/27/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/27/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/27/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var K = G === r;
                            } else
                              var K = !0;
                            if (K)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/27/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var K = y === r;
                              } else
                                var K = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/27/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var Q = T === r;
                    } else
                      var Q = !0;
                    if (Q) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/27/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "wp-cli")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/27/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "wp-cli"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var Q = T === r;
                      } else
                        var Q = !0;
                      if (Q) {
                        if (e.command !== void 0) {
                          let a = e.command;
                          const T = r, Z = r;
                          let y = !1;
                          const G = r;
                          if (typeof a != "string") {
                            const ie = {
                              instancePath: t + "/command",
                              schemaPath: "#/oneOf/27/properties/command/anyOf/0/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            };
                            n === null ? n = [ie] : n.push(ie), r++;
                          }
                          var ae = G === r;
                          if (y = y || ae, !y) {
                            const ie = r;
                            if (r === ie)
                              if (Array.isArray(
                                a
                              )) {
                                var ke = !0;
                                const Ee = a.length;
                                for (let kt = 0; kt < Ee; kt++) {
                                  const ve = r;
                                  if (typeof a[kt] != "string") {
                                    const pe = {
                                      instancePath: t + "/command/" + kt,
                                      schemaPath: "#/oneOf/27/properties/command/anyOf/1/items/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    };
                                    n === null ? n = [
                                      pe
                                    ] : n.push(
                                      pe
                                    ), r++;
                                  }
                                  var ke = ve === r;
                                  if (!ke)
                                    break;
                                }
                              } else {
                                const Ee = {
                                  instancePath: t + "/command",
                                  schemaPath: "#/oneOf/27/properties/command/anyOf/1/type",
                                  keyword: "type",
                                  params: {
                                    type: "array"
                                  },
                                  message: "must be array"
                                };
                                n === null ? n = [
                                  Ee
                                ] : n.push(
                                  Ee
                                ), r++;
                              }
                            var ae = ie === r;
                            y = y || ae;
                          }
                          if (y)
                            r = Z, n !== null && (Z ? n.length = Z : n = null);
                          else {
                            const ie = {
                              instancePath: t + "/command",
                              schemaPath: "#/oneOf/27/properties/command/anyOf",
                              keyword: "anyOf",
                              params: {},
                              message: "must match a schema in anyOf"
                            };
                            return n === null ? n = [ie] : n.push(ie), r++, d.errors = n, !1;
                          }
                          var Q = T === r;
                        } else
                          var Q = !0;
                        if (Q)
                          if (e.wpCliPath !== void 0) {
                            const a = r;
                            if (typeof e.wpCliPath != "string")
                              return d.errors = [
                                {
                                  instancePath: t + "/wpCliPath",
                                  schemaPath: "#/oneOf/27/properties/wpCliPath/type",
                                  keyword: "type",
                                  params: {
                                    type: "string"
                                  },
                                  message: "must be string"
                                }
                              ], !1;
                            var Q = a === r;
                          } else
                            var Q = !0;
                      }
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/27/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else if (le === "setSiteLanguage") {
            if (r === r)
              if (e && typeof e == "object" && !Array.isArray(e)) {
                let F;
                if (e.language === void 0 && (F = "language") || e.step === void 0 && (F = "step"))
                  return d.errors = [
                    {
                      instancePath: t,
                      schemaPath: "#/oneOf/28/required",
                      keyword: "required",
                      params: {
                        missingProperty: F
                      },
                      message: "must have required property '" + F + "'"
                    }
                  ], !1;
                {
                  const ee = r;
                  for (const a in e)
                    if (!(a === "progress" || a === "step" || a === "language"))
                      return d.errors = [
                        {
                          instancePath: t,
                          schemaPath: "#/oneOf/28/additionalProperties",
                          keyword: "additionalProperties",
                          params: {
                            additionalProperty: a
                          },
                          message: "must NOT have additional properties"
                        }
                      ], !1;
                  if (ee === r) {
                    if (e.progress !== void 0) {
                      let a = e.progress;
                      const T = r;
                      if (r === T)
                        if (a && typeof a == "object" && !Array.isArray(a)) {
                          const Z = r;
                          for (const y in a)
                            if (!(y === "weight" || y === "caption"))
                              return d.errors = [
                                {
                                  instancePath: t + "/progress",
                                  schemaPath: "#/oneOf/28/properties/progress/additionalProperties",
                                  keyword: "additionalProperties",
                                  params: {
                                    additionalProperty: y
                                  },
                                  message: "must NOT have additional properties"
                                }
                              ], !1;
                          if (Z === r) {
                            if (a.weight !== void 0) {
                              let y = a.weight;
                              const G = r;
                              if (!(typeof y == "number" && isFinite(
                                y
                              )))
                                return d.errors = [
                                  {
                                    instancePath: t + "/progress/weight",
                                    schemaPath: "#/oneOf/28/properties/progress/properties/weight/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number"
                                  }
                                ], !1;
                              var Ie = G === r;
                            } else
                              var Ie = !0;
                            if (Ie)
                              if (a.caption !== void 0) {
                                const y = r;
                                if (typeof a.caption != "string")
                                  return d.errors = [
                                    {
                                      instancePath: t + "/progress/caption",
                                      schemaPath: "#/oneOf/28/properties/progress/properties/caption/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var Ie = y === r;
                              } else
                                var Ie = !0;
                          }
                        } else
                          return d.errors = [
                            {
                              instancePath: t + "/progress",
                              schemaPath: "#/oneOf/28/properties/progress/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var at = T === r;
                    } else
                      var at = !0;
                    if (at) {
                      if (e.step !== void 0) {
                        let a = e.step;
                        const T = r;
                        if (typeof a != "string")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/28/properties/step/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        if (a !== "setSiteLanguage")
                          return d.errors = [
                            {
                              instancePath: t + "/step",
                              schemaPath: "#/oneOf/28/properties/step/const",
                              keyword: "const",
                              params: {
                                allowedValue: "setSiteLanguage"
                              },
                              message: "must be equal to constant"
                            }
                          ], !1;
                        var at = T === r;
                      } else
                        var at = !0;
                      if (at)
                        if (e.language !== void 0) {
                          const a = r;
                          if (typeof e.language != "string")
                            return d.errors = [
                              {
                                instancePath: t + "/language",
                                schemaPath: "#/oneOf/28/properties/language/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          var at = a === r;
                        } else
                          var at = !0;
                    }
                  }
                }
              } else
                return d.errors = [
                  {
                    instancePath: t,
                    schemaPath: "#/oneOf/28/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object"
                  }
                ], !1;
          } else
            return d.errors = [
              {
                instancePath: t,
                schemaPath: "#/discriminator",
                keyword: "discriminator",
                params: {
                  error: "mapping",
                  tag: "step",
                  tagValue: le
                },
                message: 'value of tag "step" must be in oneOf'
              }
            ], !1;
        else
          return d.errors = [
            {
              instancePath: t,
              schemaPath: "#/discriminator",
              keyword: "discriminator",
              params: {
                error: "tag",
                tag: "step",
                tagValue: le
              },
              message: 'tag "step" must be string'
            }
          ], !1;
      }
    } else
      return d.errors = [
        {
          instancePath: t,
          schemaPath: "#/type",
          keyword: "type",
          params: { type: "object" },
          message: "must be object"
        }
      ], !1;
  return d.errors = n, r === 0;
}
function oe(e, { instancePath: t = "", parentData: s, parentDataProperty: i, rootData: o = e } = {}) {
  let n = null, r = 0;
  if (r === 0)
    if (e && typeof e == "object" && !Array.isArray(e)) {
      const C = r;
      for (const b in e)
        if (!si.call(fm.properties, b))
          return oe.errors = [
            {
              instancePath: t,
              schemaPath: "#/additionalProperties",
              keyword: "additionalProperties",
              params: { additionalProperty: b },
              message: "must NOT have additional properties"
            }
          ], !1;
      if (C === r) {
        if (e.landingPage !== void 0) {
          const b = r;
          if (typeof e.landingPage != "string")
            return oe.errors = [
              {
                instancePath: t + "/landingPage",
                schemaPath: "#/properties/landingPage/type",
                keyword: "type",
                params: { type: "string" },
                message: "must be string"
              }
            ], !1;
          var l = b === r;
        } else
          var l = !0;
        if (l) {
          if (e.description !== void 0) {
            const b = r;
            if (typeof e.description != "string")
              return oe.errors = [
                {
                  instancePath: t + "/description",
                  schemaPath: "#/properties/description/type",
                  keyword: "type",
                  params: { type: "string" },
                  message: "must be string"
                }
              ], !1;
            var l = b === r;
          } else
            var l = !0;
          if (l) {
            if (e.meta !== void 0) {
              let b = e.meta;
              const S = r;
              if (r === S)
                if (b && typeof b == "object" && !Array.isArray(b)) {
                  let $;
                  if (b.title === void 0 && ($ = "title") || b.author === void 0 && ($ = "author"))
                    return oe.errors = [
                      {
                        instancePath: t + "/meta",
                        schemaPath: "#/properties/meta/required",
                        keyword: "required",
                        params: {
                          missingProperty: $
                        },
                        message: "must have required property '" + $ + "'"
                      }
                    ], !1;
                  {
                    const L = r;
                    for (const x in b)
                      if (!(x === "title" || x === "description" || x === "author" || x === "categories"))
                        return oe.errors = [
                          {
                            instancePath: t + "/meta",
                            schemaPath: "#/properties/meta/additionalProperties",
                            keyword: "additionalProperties",
                            params: {
                              additionalProperty: x
                            },
                            message: "must NOT have additional properties"
                          }
                        ], !1;
                    if (L === r) {
                      if (b.title !== void 0) {
                        const x = r;
                        if (typeof b.title != "string")
                          return oe.errors = [
                            {
                              instancePath: t + "/meta/title",
                              schemaPath: "#/properties/meta/properties/title/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string"
                            }
                          ], !1;
                        var p = x === r;
                      } else
                        var p = !0;
                      if (p) {
                        if (b.description !== void 0) {
                          const x = r;
                          if (typeof b.description != "string")
                            return oe.errors = [
                              {
                                instancePath: t + "/meta/description",
                                schemaPath: "#/properties/meta/properties/description/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          var p = x === r;
                        } else
                          var p = !0;
                        if (p) {
                          if (b.author !== void 0) {
                            const x = r;
                            if (typeof b.author != "string")
                              return oe.errors = [
                                {
                                  instancePath: t + "/meta/author",
                                  schemaPath: "#/properties/meta/properties/author/type",
                                  keyword: "type",
                                  params: {
                                    type: "string"
                                  },
                                  message: "must be string"
                                }
                              ], !1;
                            var p = x === r;
                          } else
                            var p = !0;
                          if (p)
                            if (b.categories !== void 0) {
                              let x = b.categories;
                              const I = r;
                              if (r === I)
                                if (Array.isArray(
                                  x
                                )) {
                                  var c = !0;
                                  const N = x.length;
                                  for (let z = 0; z < N; z++) {
                                    const B = r;
                                    if (typeof x[z] != "string")
                                      return oe.errors = [
                                        {
                                          instancePath: t + "/meta/categories/" + z,
                                          schemaPath: "#/properties/meta/properties/categories/items/type",
                                          keyword: "type",
                                          params: {
                                            type: "string"
                                          },
                                          message: "must be string"
                                        }
                                      ], !1;
                                    var c = B === r;
                                    if (!c)
                                      break;
                                  }
                                } else
                                  return oe.errors = [
                                    {
                                      instancePath: t + "/meta/categories",
                                      schemaPath: "#/properties/meta/properties/categories/type",
                                      keyword: "type",
                                      params: {
                                        type: "array"
                                      },
                                      message: "must be array"
                                    }
                                  ], !1;
                              var p = I === r;
                            } else
                              var p = !0;
                        }
                      }
                    }
                  }
                } else
                  return oe.errors = [
                    {
                      instancePath: t + "/meta",
                      schemaPath: "#/properties/meta/type",
                      keyword: "type",
                      params: { type: "object" },
                      message: "must be object"
                    }
                  ], !1;
              var l = S === r;
            } else
              var l = !0;
            if (l) {
              if (e.preferredVersions !== void 0) {
                let b = e.preferredVersions;
                const S = r;
                if (r === S)
                  if (b && typeof b == "object" && !Array.isArray(b)) {
                    let $;
                    if (b.php === void 0 && ($ = "php") || b.wp === void 0 && ($ = "wp"))
                      return oe.errors = [
                        {
                          instancePath: t + "/preferredVersions",
                          schemaPath: "#/properties/preferredVersions/required",
                          keyword: "required",
                          params: {
                            missingProperty: $
                          },
                          message: "must have required property '" + $ + "'"
                        }
                      ], !1;
                    {
                      const L = r;
                      for (const x in b)
                        if (!(x === "php" || x === "wp"))
                          return oe.errors = [
                            {
                              instancePath: t + "/preferredVersions",
                              schemaPath: "#/properties/preferredVersions/additionalProperties",
                              keyword: "additionalProperties",
                              params: {
                                additionalProperty: x
                              },
                              message: "must NOT have additional properties"
                            }
                          ], !1;
                      if (L === r) {
                        if (b.php !== void 0) {
                          let x = b.php;
                          const I = r, q = r;
                          let N = !1;
                          const z = r;
                          Or(x, {
                            instancePath: t + "/preferredVersions/php",
                            parentData: b,
                            parentDataProperty: "php",
                            rootData: o
                          }) || (n = n === null ? Or.errors : n.concat(
                            Or.errors
                          ), r = n.length);
                          var f = z === r;
                          if (N = N || f, !N) {
                            const B = r;
                            if (typeof x != "string") {
                              const U = {
                                instancePath: t + "/preferredVersions/php",
                                schemaPath: "#/properties/preferredVersions/properties/php/anyOf/1/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              };
                              n === null ? n = [
                                U
                              ] : n.push(
                                U
                              ), r++;
                            }
                            if (x !== "latest") {
                              const U = {
                                instancePath: t + "/preferredVersions/php",
                                schemaPath: "#/properties/preferredVersions/properties/php/anyOf/1/const",
                                keyword: "const",
                                params: {
                                  allowedValue: "latest"
                                },
                                message: "must be equal to constant"
                              };
                              n === null ? n = [
                                U
                              ] : n.push(
                                U
                              ), r++;
                            }
                            var f = B === r;
                            N = N || f;
                          }
                          if (N)
                            r = q, n !== null && (q ? n.length = q : n = null);
                          else {
                            const B = {
                              instancePath: t + "/preferredVersions/php",
                              schemaPath: "#/properties/preferredVersions/properties/php/anyOf",
                              keyword: "anyOf",
                              params: {},
                              message: "must match a schema in anyOf"
                            };
                            return n === null ? n = [B] : n.push(B), r++, oe.errors = n, !1;
                          }
                          var u = I === r;
                        } else
                          var u = !0;
                        if (u)
                          if (b.wp !== void 0) {
                            let x = b.wp;
                            const I = r, q = r;
                            let N = !1;
                            const z = r;
                            if (typeof x != "string") {
                              const H = {
                                instancePath: t + "/preferredVersions/wp",
                                schemaPath: "#/properties/preferredVersions/properties/wp/anyOf/0/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              };
                              n === null ? n = [
                                H
                              ] : n.push(
                                H
                              ), r++;
                            }
                            var g = z === r;
                            if (N = N || g, !N) {
                              const H = r;
                              if (typeof x != "string") {
                                const Y = {
                                  instancePath: t + "/preferredVersions/wp",
                                  schemaPath: "#/properties/preferredVersions/properties/wp/anyOf/1/type",
                                  keyword: "type",
                                  params: {
                                    type: "string"
                                  },
                                  message: "must be string"
                                };
                                n === null ? n = [
                                  Y
                                ] : n.push(
                                  Y
                                ), r++;
                              }
                              if (x !== "latest") {
                                const Y = {
                                  instancePath: t + "/preferredVersions/wp",
                                  schemaPath: "#/properties/preferredVersions/properties/wp/anyOf/1/const",
                                  keyword: "const",
                                  params: {
                                    allowedValue: "latest"
                                  },
                                  message: "must be equal to constant"
                                };
                                n === null ? n = [
                                  Y
                                ] : n.push(
                                  Y
                                ), r++;
                              }
                              var g = H === r;
                              if (N = N || g, !N) {
                                const Y = r;
                                if (typeof x != "boolean") {
                                  const M = {
                                    instancePath: t + "/preferredVersions/wp",
                                    schemaPath: "#/properties/preferredVersions/properties/wp/anyOf/2/type",
                                    keyword: "type",
                                    params: {
                                      type: "boolean"
                                    },
                                    message: "must be boolean"
                                  };
                                  n === null ? n = [
                                    M
                                  ] : n.push(
                                    M
                                  ), r++;
                                }
                                if (x !== !1) {
                                  const M = {
                                    instancePath: t + "/preferredVersions/wp",
                                    schemaPath: "#/properties/preferredVersions/properties/wp/anyOf/2/const",
                                    keyword: "const",
                                    params: {
                                      allowedValue: !1
                                    },
                                    message: "must be equal to constant"
                                  };
                                  n === null ? n = [
                                    M
                                  ] : n.push(
                                    M
                                  ), r++;
                                }
                                var g = Y === r;
                                N = N || g;
                              }
                            }
                            if (N)
                              r = q, n !== null && (q ? n.length = q : n = null);
                            else {
                              const H = {
                                instancePath: t + "/preferredVersions/wp",
                                schemaPath: "#/properties/preferredVersions/properties/wp/anyOf",
                                keyword: "anyOf",
                                params: {},
                                message: "must match a schema in anyOf"
                              };
                              return n === null ? n = [
                                H
                              ] : n.push(
                                H
                              ), r++, oe.errors = n, !1;
                            }
                            var u = I === r;
                          } else
                            var u = !0;
                      }
                    }
                  } else
                    return oe.errors = [
                      {
                        instancePath: t + "/preferredVersions",
                        schemaPath: "#/properties/preferredVersions/type",
                        keyword: "type",
                        params: { type: "object" },
                        message: "must be object"
                      }
                    ], !1;
                var l = S === r;
              } else
                var l = !0;
              if (l) {
                if (e.features !== void 0) {
                  let b = e.features;
                  const S = r;
                  if (r === S)
                    if (b && typeof b == "object" && !Array.isArray(b)) {
                      const $ = r;
                      for (const L in b)
                        if (!(L === "intl" || L === "networking"))
                          return oe.errors = [
                            {
                              instancePath: t + "/features",
                              schemaPath: "#/properties/features/additionalProperties",
                              keyword: "additionalProperties",
                              params: {
                                additionalProperty: L
                              },
                              message: "must NOT have additional properties"
                            }
                          ], !1;
                      if ($ === r) {
                        if (b.intl !== void 0) {
                          const L = r;
                          if (typeof b.intl != "boolean")
                            return oe.errors = [
                              {
                                instancePath: t + "/features/intl",
                                schemaPath: "#/properties/features/properties/intl/type",
                                keyword: "type",
                                params: {
                                  type: "boolean"
                                },
                                message: "must be boolean"
                              }
                            ], !1;
                          var w = L === r;
                        } else
                          var w = !0;
                        if (w)
                          if (b.networking !== void 0) {
                            const L = r;
                            if (typeof b.networking != "boolean")
                              return oe.errors = [
                                {
                                  instancePath: t + "/features/networking",
                                  schemaPath: "#/properties/features/properties/networking/type",
                                  keyword: "type",
                                  params: {
                                    type: "boolean"
                                  },
                                  message: "must be boolean"
                                }
                              ], !1;
                            var w = L === r;
                          } else
                            var w = !0;
                      }
                    } else
                      return oe.errors = [
                        {
                          instancePath: t + "/features",
                          schemaPath: "#/properties/features/type",
                          keyword: "type",
                          params: { type: "object" },
                          message: "must be object"
                        }
                      ], !1;
                  var l = S === r;
                } else
                  var l = !0;
                if (l) {
                  if (e.extraLibraries !== void 0) {
                    let b = e.extraLibraries;
                    const S = r;
                    if (r === S)
                      if (Array.isArray(b)) {
                        var O = !0;
                        const $ = b.length;
                        for (let L = 0; L < $; L++) {
                          let x = b[L];
                          const I = r;
                          if (typeof x != "string")
                            return oe.errors = [
                              {
                                instancePath: t + "/extraLibraries/" + L,
                                schemaPath: "#/definitions/ExtraLibrary/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              }
                            ], !1;
                          if (x !== "wp-cli")
                            return oe.errors = [
                              {
                                instancePath: t + "/extraLibraries/" + L,
                                schemaPath: "#/definitions/ExtraLibrary/const",
                                keyword: "const",
                                params: {
                                  allowedValue: "wp-cli"
                                },
                                message: "must be equal to constant"
                              }
                            ], !1;
                          var O = I === r;
                          if (!O)
                            break;
                        }
                      } else
                        return oe.errors = [
                          {
                            instancePath: t + "/extraLibraries",
                            schemaPath: "#/properties/extraLibraries/type",
                            keyword: "type",
                            params: {
                              type: "array"
                            },
                            message: "must be array"
                          }
                        ], !1;
                    var l = S === r;
                  } else
                    var l = !0;
                  if (l) {
                    if (e.constants !== void 0) {
                      let b = e.constants;
                      const S = r;
                      if (r === r)
                        if (b && typeof b == "object" && !Array.isArray(b))
                          for (const L in b) {
                            let x = b[L];
                            const I = r;
                            if (typeof x != "string" && typeof x != "boolean" && !(typeof x == "number" && isFinite(x)))
                              return oe.errors = [
                                {
                                  instancePath: t + "/constants/" + L.replace(
                                    /~/g,
                                    "~0"
                                  ).replace(
                                    /\//g,
                                    "~1"
                                  ),
                                  schemaPath: "#/definitions/PHPConstants/additionalProperties/type",
                                  keyword: "type",
                                  params: {
                                    type: um.additionalProperties.type
                                  },
                                  message: "must be string,boolean,number"
                                }
                              ], !1;
                            var m = I === r;
                            if (!m)
                              break;
                          }
                        else
                          return oe.errors = [
                            {
                              instancePath: t + "/constants",
                              schemaPath: "#/definitions/PHPConstants/type",
                              keyword: "type",
                              params: {
                                type: "object"
                              },
                              message: "must be object"
                            }
                          ], !1;
                      var l = S === r;
                    } else
                      var l = !0;
                    if (l) {
                      if (e.plugins !== void 0) {
                        let b = e.plugins;
                        const S = r;
                        if (r === S)
                          if (Array.isArray(b)) {
                            var h = !0;
                            const $ = b.length;
                            for (let L = 0; L < $; L++) {
                              let x = b[L];
                              const I = r, q = r;
                              let N = !1;
                              const z = r;
                              if (typeof x != "string") {
                                const H = {
                                  instancePath: t + "/plugins/" + L,
                                  schemaPath: "#/properties/plugins/items/anyOf/0/type",
                                  keyword: "type",
                                  params: {
                                    type: "string"
                                  },
                                  message: "must be string"
                                };
                                n === null ? n = [
                                  H
                                ] : n.push(
                                  H
                                ), r++;
                              }
                              var _ = z === r;
                              if (N = N || _, !N) {
                                const H = r;
                                ce(
                                  x,
                                  {
                                    instancePath: t + "/plugins/" + L,
                                    parentData: b,
                                    parentDataProperty: L,
                                    rootData: o
                                  }
                                ) || (n = n === null ? ce.errors : n.concat(
                                  ce.errors
                                ), r = n.length);
                                var _ = H === r;
                                N = N || _;
                              }
                              if (N)
                                r = q, n !== null && (q ? n.length = q : n = null);
                              else {
                                const H = {
                                  instancePath: t + "/plugins/" + L,
                                  schemaPath: "#/properties/plugins/items/anyOf",
                                  keyword: "anyOf",
                                  params: {},
                                  message: "must match a schema in anyOf"
                                };
                                return n === null ? n = [
                                  H
                                ] : n.push(
                                  H
                                ), r++, oe.errors = n, !1;
                              }
                              var h = I === r;
                              if (!h)
                                break;
                            }
                          } else
                            return oe.errors = [
                              {
                                instancePath: t + "/plugins",
                                schemaPath: "#/properties/plugins/type",
                                keyword: "type",
                                params: {
                                  type: "array"
                                },
                                message: "must be array"
                              }
                            ], !1;
                        var l = S === r;
                      } else
                        var l = !0;
                      if (l) {
                        if (e.siteOptions !== void 0) {
                          let b = e.siteOptions;
                          const S = r;
                          if (r === S)
                            if (b && typeof b == "object" && !Array.isArray(
                              b
                            )) {
                              const $ = r;
                              for (const L in b)
                                if (L !== "blogname") {
                                  const x = r;
                                  if (typeof b[L] != "string")
                                    return oe.errors = [
                                      {
                                        instancePath: t + "/siteOptions/" + L.replace(
                                          /~/g,
                                          "~0"
                                        ).replace(
                                          /\//g,
                                          "~1"
                                        ),
                                        schemaPath: "#/properties/siteOptions/additionalProperties/type",
                                        keyword: "type",
                                        params: {
                                          type: "string"
                                        },
                                        message: "must be string"
                                      }
                                    ], !1;
                                  var k = x === r;
                                  if (!k)
                                    break;
                                }
                              if ($ === r && b.blogname !== void 0 && typeof b.blogname != "string")
                                return oe.errors = [
                                  {
                                    instancePath: t + "/siteOptions/blogname",
                                    schemaPath: "#/properties/siteOptions/properties/blogname/type",
                                    keyword: "type",
                                    params: {
                                      type: "string"
                                    },
                                    message: "must be string"
                                  }
                                ], !1;
                            } else
                              return oe.errors = [
                                {
                                  instancePath: t + "/siteOptions",
                                  schemaPath: "#/properties/siteOptions/type",
                                  keyword: "type",
                                  params: {
                                    type: "object"
                                  },
                                  message: "must be object"
                                }
                              ], !1;
                          var l = S === r;
                        } else
                          var l = !0;
                        if (l) {
                          if (e.login !== void 0) {
                            let b = e.login;
                            const S = r, P = r;
                            let $ = !1;
                            const L = r;
                            if (typeof b != "boolean") {
                              const I = {
                                instancePath: t + "/login",
                                schemaPath: "#/properties/login/anyOf/0/type",
                                keyword: "type",
                                params: {
                                  type: "boolean"
                                },
                                message: "must be boolean"
                              };
                              n === null ? n = [
                                I
                              ] : n.push(
                                I
                              ), r++;
                            }
                            var v = L === r;
                            if ($ = $ || v, !$) {
                              const I = r;
                              if (r === I)
                                if (b && typeof b == "object" && !Array.isArray(
                                  b
                                )) {
                                  let N;
                                  if (b.username === void 0 && (N = "username") || b.password === void 0 && (N = "password")) {
                                    const z = {
                                      instancePath: t + "/login",
                                      schemaPath: "#/properties/login/anyOf/1/required",
                                      keyword: "required",
                                      params: {
                                        missingProperty: N
                                      },
                                      message: "must have required property '" + N + "'"
                                    };
                                    n === null ? n = [
                                      z
                                    ] : n.push(
                                      z
                                    ), r++;
                                  } else {
                                    const z = r;
                                    for (const B in b)
                                      if (!(B === "username" || B === "password")) {
                                        const H = {
                                          instancePath: t + "/login",
                                          schemaPath: "#/properties/login/anyOf/1/additionalProperties",
                                          keyword: "additionalProperties",
                                          params: {
                                            additionalProperty: B
                                          },
                                          message: "must NOT have additional properties"
                                        };
                                        n === null ? n = [
                                          H
                                        ] : n.push(
                                          H
                                        ), r++;
                                        break;
                                      }
                                    if (z === r) {
                                      if (b.username !== void 0) {
                                        const B = r;
                                        if (typeof b.username != "string") {
                                          const H = {
                                            instancePath: t + "/login/username",
                                            schemaPath: "#/properties/login/anyOf/1/properties/username/type",
                                            keyword: "type",
                                            params: {
                                              type: "string"
                                            },
                                            message: "must be string"
                                          };
                                          n === null ? n = [
                                            H
                                          ] : n.push(
                                            H
                                          ), r++;
                                        }
                                        var R = B === r;
                                      } else
                                        var R = !0;
                                      if (R)
                                        if (b.password !== void 0) {
                                          const B = r;
                                          if (typeof b.password != "string") {
                                            const U = {
                                              instancePath: t + "/login/password",
                                              schemaPath: "#/properties/login/anyOf/1/properties/password/type",
                                              keyword: "type",
                                              params: {
                                                type: "string"
                                              },
                                              message: "must be string"
                                            };
                                            n === null ? n = [
                                              U
                                            ] : n.push(
                                              U
                                            ), r++;
                                          }
                                          var R = B === r;
                                        } else
                                          var R = !0;
                                    }
                                  }
                                } else {
                                  const N = {
                                    instancePath: t + "/login",
                                    schemaPath: "#/properties/login/anyOf/1/type",
                                    keyword: "type",
                                    params: {
                                      type: "object"
                                    },
                                    message: "must be object"
                                  };
                                  n === null ? n = [
                                    N
                                  ] : n.push(
                                    N
                                  ), r++;
                                }
                              var v = I === r;
                              $ = $ || v;
                            }
                            if ($)
                              r = P, n !== null && (P ? n.length = P : n = null);
                            else {
                              const I = {
                                instancePath: t + "/login",
                                schemaPath: "#/properties/login/anyOf",
                                keyword: "anyOf",
                                params: {},
                                message: "must match a schema in anyOf"
                              };
                              return n === null ? n = [
                                I
                              ] : n.push(
                                I
                              ), r++, oe.errors = n, !1;
                            }
                            var l = S === r;
                          } else
                            var l = !0;
                          if (l) {
                            if (e.steps !== void 0) {
                              let b = e.steps;
                              const S = r;
                              if (r === S)
                                if (Array.isArray(
                                  b
                                )) {
                                  var E = !0;
                                  const $ = b.length;
                                  for (let L = 0; L < $; L++) {
                                    let x = b[L];
                                    const I = r, q = r;
                                    let N = !1;
                                    const z = r;
                                    d(
                                      x,
                                      {
                                        instancePath: t + "/steps/" + L,
                                        parentData: b,
                                        parentDataProperty: L,
                                        rootData: o
                                      }
                                    ) || (n = n === null ? d.errors : n.concat(
                                      d.errors
                                    ), r = n.length);
                                    var A = z === r;
                                    if (N = N || A, !N) {
                                      const H = r;
                                      if (typeof x != "string") {
                                        const Y = {
                                          instancePath: t + "/steps/" + L,
                                          schemaPath: "#/properties/steps/items/anyOf/1/type",
                                          keyword: "type",
                                          params: {
                                            type: "string"
                                          },
                                          message: "must be string"
                                        };
                                        n === null ? n = [
                                          Y
                                        ] : n.push(
                                          Y
                                        ), r++;
                                      }
                                      var A = H === r;
                                      if (N = N || A, !N) {
                                        const Y = r, J = {
                                          instancePath: t + "/steps/" + L,
                                          schemaPath: "#/properties/steps/items/anyOf/2/not",
                                          keyword: "not",
                                          params: {},
                                          message: "must NOT be valid"
                                        };
                                        n === null ? n = [
                                          J
                                        ] : n.push(
                                          J
                                        ), r++;
                                        var A = Y === r;
                                        if (N = N || A, !N) {
                                          const te = r;
                                          if (typeof x != "boolean") {
                                            const X = {
                                              instancePath: t + "/steps/" + L,
                                              schemaPath: "#/properties/steps/items/anyOf/3/type",
                                              keyword: "type",
                                              params: {
                                                type: "boolean"
                                              },
                                              message: "must be boolean"
                                            };
                                            n === null ? n = [
                                              X
                                            ] : n.push(
                                              X
                                            ), r++;
                                          }
                                          if (x !== !1) {
                                            const X = {
                                              instancePath: t + "/steps/" + L,
                                              schemaPath: "#/properties/steps/items/anyOf/3/const",
                                              keyword: "const",
                                              params: {
                                                allowedValue: !1
                                              },
                                              message: "must be equal to constant"
                                            };
                                            n === null ? n = [
                                              X
                                            ] : n.push(
                                              X
                                            ), r++;
                                          }
                                          var A = te === r;
                                          if (N = N || A, !N) {
                                            const X = r;
                                            if (x !== null) {
                                              const we = {
                                                instancePath: t + "/steps/" + L,
                                                schemaPath: "#/properties/steps/items/anyOf/4/type",
                                                keyword: "type",
                                                params: {
                                                  type: "null"
                                                },
                                                message: "must be null"
                                              };
                                              n === null ? n = [
                                                we
                                              ] : n.push(
                                                we
                                              ), r++;
                                            }
                                            var A = X === r;
                                            N = N || A;
                                          }
                                        }
                                      }
                                    }
                                    if (N)
                                      r = q, n !== null && (q ? n.length = q : n = null);
                                    else {
                                      const H = {
                                        instancePath: t + "/steps/" + L,
                                        schemaPath: "#/properties/steps/items/anyOf",
                                        keyword: "anyOf",
                                        params: {},
                                        message: "must match a schema in anyOf"
                                      };
                                      return n === null ? n = [
                                        H
                                      ] : n.push(
                                        H
                                      ), r++, oe.errors = n, !1;
                                    }
                                    var E = I === r;
                                    if (!E)
                                      break;
                                  }
                                } else
                                  return oe.errors = [
                                    {
                                      instancePath: t + "/steps",
                                      schemaPath: "#/properties/steps/type",
                                      keyword: "type",
                                      params: {
                                        type: "array"
                                      },
                                      message: "must be array"
                                    }
                                  ], !1;
                              var l = S === r;
                            } else
                              var l = !0;
                            if (l)
                              if (e.$schema !== void 0) {
                                const b = r;
                                if (typeof e.$schema != "string")
                                  return oe.errors = [
                                    {
                                      instancePath: t + "/$schema",
                                      schemaPath: "#/properties/%24schema/type",
                                      keyword: "type",
                                      params: {
                                        type: "string"
                                      },
                                      message: "must be string"
                                    }
                                  ], !1;
                                var l = b === r;
                              } else
                                var l = !0;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else
      return oe.errors = [
        {
          instancePath: t,
          schemaPath: "#/type",
          keyword: "type",
          params: { type: "object" },
          message: "must be object"
        }
      ], !1;
  return oe.errors = n, r === 0;
}
function us(e, { instancePath: t = "", parentData: s, parentDataProperty: i, rootData: o = e } = {}) {
  let n = null, r = 0;
  return oe(e, {
    instancePath: t,
    parentData: s,
    parentDataProperty: i,
    rootData: o
  }) || (n = n === null ? oe.errors : n.concat(oe.errors), r = n.length), us.errors = n, r === 0;
}
function wl(e) {
  const t = e.trim().replace(/\/+$/, "");
  return /^https:\/\/.+\.git$/.test(t) || /^https:\/\/github\.com\/[^/]+\/[^/]+$/.test(t) ? !0 : /^https:\/\/gitlab\.com\/[^/]+\/[^/]+(\/[^/]+)*$/.test(
    t
  );
}
class bl extends Error {
  constructor(t, s) {
    super(t), this.name = "InvalidBlueprintError", this.validationErrors = s;
  }
}
const { wpCLI: bm, ...Co } = cm, vm = {
  ...Co,
  "wp-cli": bm,
  importFile: Co.importWxr
};
class Pm extends Error {
  constructor(t) {
    const { stepNumber: s, step: i, cause: o } = t, n = o instanceof Error ? o : new Error(String(o)), r = `Error when executing the blueprint step #${s}`, l = n.message ? `${r}: ${n.message}` : r;
    super(l, { cause: n }), this.name = "BlueprintStepExecutionError", this.stepNumber = s, this.step = i, this.messages = (n.message || "").split(`
`).map((p) => p.trim()).filter(Boolean);
  }
}
async function Ns(e, t = {}) {
  const s = {
    ...t
  };
  let i;
  return qt(e) ? (i = await xm(e), s.streamBundledFile = function(...o) {
    return e.read(...o);
  }) : i = e, $m(i, s);
}
function qt(e) {
  return e && "read" in e && typeof e.read == "function";
}
async function xm(e) {
  if (!qt(e))
    return e;
  const s = await (await e.read("blueprint.json")).text();
  return JSON.parse(s);
}
function $m(e, {
  progress: t = new Ts(),
  semaphore: s = new Dr({ concurrency: 3 }),
  onStepCompleted: i = () => {
  },
  onBlueprintValidated: o = () => {
  },
  corsProxy: n,
  streamBundledFile: r,
  gitAdditionalHeadersCallback: l,
  additionalSteps: p
} = {}) {
  var m, h, _, k, v, R, E, A, C, b, S;
  e = structuredClone(e), e = {
    ...e,
    steps: (e.steps || []).filter(Om).filter(Tm)
  }, e.steps = [...e.steps || [], ...p || []], ((m = e.preferredVersions) == null ? void 0 : m.wp) === !1 && Cm(e);
  for (const P of e.steps)
    !P || typeof P != "object" || (P.step === "importFile" ? (P.step = "importWxr", ue.warn(
      'The "importFile" step is deprecated. Use "importWxr" instead.'
    )) : (P == null ? void 0 : P.step) === "installPlugin" && "pluginZipFile" in P ? (P.pluginData = P.pluginZipFile, ue.warn(
      'The "pluginZipFile" option of the "installPlugin" step is deprecated. Use "pluginData" instead.'
    )) : (P == null ? void 0 : P.step) === "installTheme" && "themeZipFile" in P && (P.themeData = P.themeZipFile, ue.warn(
      'The "themeZipFile" option of the "installTheme" step is deprecated. Use "themeData" instead.'
    )));
  if (e.constants && e.steps.unshift({
    step: "defineWpConfigConsts",
    consts: e.constants
  }), e.siteOptions && e.steps.unshift({
    step: "setSiteOptions",
    options: e.siteOptions
  }), e.plugins) {
    const P = e.plugins.map(($) => typeof $ == "string" ? wl($) ? {
      resource: "zip",
      inner: {
        resource: "git:directory",
        url: $.trim().replace(/\/+$/, ""),
        ref: "HEAD"
      }
    } : $.startsWith("https://") ? {
      resource: "url",
      url: $
    } : {
      resource: "wordpress.org/plugins",
      slug: $
    } : $).map(($) => ({
      step: "installPlugin",
      pluginData: $
    }));
    e.steps.unshift(...P);
  }
  e.login && e.steps.unshift({
    step: "login",
    ...e.login === !0 ? { username: "admin" } : e.login
  });
  const c = ((h = e.steps) == null ? void 0 : h.findIndex(
    (P) => typeof P == "object" && (P == null ? void 0 : P.step) && ["wp-cli", "enableMultisite"].includes(P.step)
  )) ?? -1;
  if ((_ = e == null ? void 0 : e.extraLibraries) != null && _.includes("wp-cli") || c !== -1) {
    const P = {
      step: "writeFile",
      data: ul,
      path: Cs
    };
    c === -1 ? (k = e.steps) == null || k.push(P) : (v = e.steps) == null || v.splice(
      c,
      0,
      P
    );
  }
  const f = (R = e.steps) == null ? void 0 : R.findIndex(
    (P) => typeof P == "object" && (P == null ? void 0 : P.step) === "importWxr"
  );
  f !== void 0 && f > -1 && ((E = e.steps) == null || E.splice(f, 0, {
    step: "installPlugin",
    pluginData: {
      resource: "wordpress.org/plugins",
      slug: "wordpress-importer"
    }
  }));
  const u = vl(e);
  if (!u.valid) {
    const { errors: P } = u, $ = km(e, P);
    throw new bl(
      `Invalid Blueprint: The Blueprint does not conform to the schema.

Found ${P.length} validation error(s):

${$}

Please review your Blueprint and fix these issues. Learn more about the Blueprint format: https://wordpress.github.io/wordpress-playground/blueprints/data-format`,
      P
    );
  }
  o(e);
  const g = e.steps || [], w = g.reduce(
    (P, $) => {
      var L;
      return P + (((L = $.progress) == null ? void 0 : L.weight) || 1);
    },
    0
  ), O = g.map(
    (P) => Sm(P, {
      semaphore: s,
      rootProgressTracker: t,
      totalProgressWeight: w,
      corsProxy: n,
      streamBundledFile: r,
      gitAdditionalHeadersCallback: l
    })
  );
  return {
    versions: {
      php: Em(
        (A = e.preferredVersions) == null ? void 0 : A.php,
        Sr,
        jn
      ),
      wp: ((C = e.preferredVersions) == null ? void 0 : C.wp) || "latest"
    },
    features: {
      // Disable intl by default to reduce the transfer size
      intl: ((b = e.features) == null ? void 0 : b.intl) ?? !1,
      // Enable network access by default
      networking: ((S = e.features) == null ? void 0 : S.networking) ?? !0
    },
    extraLibraries: e.extraLibraries || [],
    run: async (P) => {
      try {
        for (const { resources: $ } of O)
          for (const L of $)
            L.setPlayground(P), L.isAsync && L.resolve().catch(() => {
            });
        for (const [$, { run: L, step: x }] of Object.entries(O))
          try {
            const I = await L(P);
            i(I, x);
          } catch (I) {
            const q = Number($) + 1;
            throw new Pm({
              stepNumber: q,
              step: x,
              cause: I
            });
          }
      } finally {
        try {
          const $ = await P.pathToInternalUrl(e.landingPage || "/");
          await P.goTo(
            "/index.php?playground-redirection-handler&next=" + encodeURIComponent($)
          );
        } catch {
        }
        t.finish();
      }
    }
  };
}
function km(e, t) {
  return t.map((s, i) => {
    var l;
    const o = s.instancePath || "/";
    let n = s.message || "validation failed", r = "";
    if (n.includes("must NOT have additional properties")) {
      const p = (l = s.params) == null ? void 0 : l.additionalProperty;
      if (p) {
        n = `has unexpected property "${p}"`;
        try {
          const c = o.split("/").filter(Boolean);
          let f = e;
          for (const u of c)
            f && typeof f == "object" && (f = f[u]);
          if (f && typeof f == "object") {
            const u = f[p], g = JSON.stringify(u);
            r = `
  "${p}": ${g}
  ${"^".repeat(
              p.length + 2
            )} This property is not recognized`;
          }
        } catch {
        }
      }
    } else
      try {
        const p = o.split("/").filter(Boolean);
        let c = e;
        for (const f of p)
          c && typeof c == "object" && (c = c[f]);
        if (c !== void 0) {
          const f = JSON.stringify(c, null, 2);
          r = `
  Value: ${f.length > 200 ? f.substring(0, 200) + "..." : f}`;
        }
      } catch {
      }
    return `${i + 1}. At path "${o}": ${n}${r}`;
  }).join(`

`);
}
function vl(e) {
  var o;
  const t = us(e);
  if (t)
    return { valid: t };
  const s = /* @__PURE__ */ new Set();
  for (const n of us.errors)
    n.schemaPath.startsWith("#/properties/steps/items/anyOf") || s.add(n.instancePath);
  return {
    valid: !1,
    errors: ((o = us.errors) == null ? void 0 : o.filter(
      (n) => !(n.schemaPath.startsWith(
        "#/properties/steps/items/anyOf"
      ) && s.has(n.instancePath))
    )) ?? []
  };
}
function Em(e, t, s) {
  return (e === "7.2" || e === "7.3") && (ue.warn(
    `PHP ${e} is no longer supported. Automatically upgrading to PHP 7.4.`
  ), e = "7.4"), e && t.includes(e) ? e : s;
}
function Om(e) {
  return !!(typeof e == "object" && e);
}
function Tm(e) {
  return ["setPhpIniEntry", "request"].includes(e.step) ? (ue.warn(
    `The "${e.step}" Blueprint is no longer supported and you can remove it from your Blueprint.`
  ), !1) : !0;
}
function Sm(e, {
  semaphore: t,
  rootProgressTracker: s,
  totalProgressWeight: i,
  corsProxy: o,
  streamBundledFile: n,
  gitAdditionalHeadersCallback: r
}) {
  var w, O;
  const l = s.stage(
    (((w = e.progress) == null ? void 0 : w.weight) || 1) / i,
    (O = e.progress) == null ? void 0 : O.caption
  ), p = {};
  for (const m of Object.keys(e)) {
    let h = e[m];
    Gu(h) && (h = Ve.create(h, {
      semaphore: t,
      corsProxy: o,
      streamBundledFile: n,
      gitAdditionalHeadersCallback: r
    })), p[m] = h;
  }
  const c = async (m) => {
    var h, _;
    try {
      return (h = e.progress) != null && h.caption && l.setCaption(e.progress.caption), l.fillSlowly(), await vm[e.step](
        m,
        await Am(p),
        {
          tracker: l,
          initialCaption: (_ = e.progress) == null ? void 0 : _.caption
        }
      );
    } finally {
      l.finish();
    }
  }, f = No(p), u = No(p).filter(
    (m) => m.isAsync
  ), g = 1 / (u.length + 1);
  for (const m of u)
    m.progress = l.stage(g);
  return { run: c, step: e, resources: f };
}
function No(e) {
  const t = [];
  for (const s in e) {
    const i = e[s];
    i instanceof Ve && t.push(i);
  }
  return t;
}
async function Am(e) {
  const t = {};
  for (const s in e) {
    const i = e[s];
    i instanceof Ve ? t[s] = await i.resolve() : t[s] = i;
  }
  return t;
}
async function Rm(e, t) {
  await e.run(t);
}
const Lm = /* @__PURE__ */ new Set([
  "installPlugin",
  "installTheme",
  "activatePlugin",
  "activateTheme",
  "login",
  "setSiteOptions",
  "updateUserMeta",
  "importWxr",
  "importFile",
  "importWordPressFiles",
  "enableMultisite",
  "wp-cli",
  "resetData"
]);
function Cm(e) {
  var i, o;
  const t = [];
  (i = e.plugins) != null && i.length && t.push("plugins"), e.siteOptions && t.push("siteOptions"), e.login && t.push("login"), (o = e.extraLibraries) != null && o.includes("wp-cli") && t.push("extraLibraries includes 'wp-cli'");
  const s = (e.steps || []).filter(
    (n) => !!n && typeof n == "object" && "step" in n
  ).map((n) => n.step).filter((n) => Lm.has(n));
  if (s.length && t.push(`steps: ${[...new Set(s)].join(", ")}`), t.length)
    throw new bl(
      `Blueprint has \`preferredVersions.wp: false\` but uses WordPress-only features: ${t.join("; ")}. Remove these or drop \`preferredVersions.wp: false\`.`,
      []
    );
}
async function uy(e) {
  if (Nm(e)) {
    const { validateBlueprintV2Declaration: t } = await import("./validate-blueprint-v2-BatnYL-x.js");
    return t(e);
  }
  return vl(e);
}
function Nm(e) {
  return typeof e == "object" && e !== null && "version" in e && e.version === 2;
}
const Im = [
  "latest",
  "beta",
  "trunk",
  "nightly",
  "none"
], Pl = "custom", Fm = /^\d+\.\d+(?:\.\d+)?(?:-(?:beta|rc)\d+)?$/i, Dm = Sr.filter(
  (e) => e !== "next"
);
async function xl(e, t = "create-new-site", s) {
  var r, l;
  if (!Um(e))
    throw new Error("Expected a Blueprint v2 declaration.");
  const { assertValidBlueprintV2Declaration: i } = await import("./validate-blueprint-v2-BatnYL-x.js");
  i(e), s == null || s(e);
  const o = (r = e.applicationOptions) == null ? void 0 : r["wordpress-playground"], n = await Mm(
    e,
    t === "create-new-site"
  );
  return {
    phpVersion: jm(e),
    wpVersion: n,
    intl: ((l = o == null ? void 0 : o.loadPhpExtensions) == null ? void 0 : l.includes("intl")) ?? !1,
    networking: (o == null ? void 0 : o.networkAccess) ?? !1,
    constants: e.constants ?? {},
    extraLibraries: []
  };
}
async function dy(e, t) {
  const s = e.wordpressVersion;
  $l(s) && (ni(s), !Nr(
    t,
    s
  ) && Zm(
    t,
    s
  ));
}
function Um(e) {
  return e.version === 2;
}
function jm(e) {
  const t = e.phpVersion;
  if (typeof t == "string")
    return Io(t);
  const s = qm(t);
  if (s) {
    const o = Io(s);
    if (t && typeof t == "object" && In(
      o,
      t
    ))
      return o;
    throw new Error(
      `Blueprint v2 recommended PHP version "${s}" does not satisfy constraints ${JSON.stringify(t)}.`
    );
  }
  const i = Wm(t);
  if (i)
    return i;
  if (t && typeof t == "object")
    throw new Error(
      `Unsatisfiable Blueprint v2 PHP version constraints ${JSON.stringify(t)}. Supported versions: ${Sr.join(", ")}.`
    );
  return Rn;
}
function Io(e) {
  if (e === "latest")
    return jn;
  if (Sr.includes(e))
    return e;
  throw new Error(
    `Unsupported Blueprint v2 PHP version "${e}". Supported versions: ${Sr.join(", ")}.`
  );
}
function qm(e) {
  if (!(!e || typeof e != "object") && "recommended" in e)
    return typeof e.recommended == "string" ? e.recommended : void 0;
}
function Wm(e) {
  if (!(!e || typeof e != "object"))
    return In(Rn, e) ? Rn : Dm.find(
      (t) => In(t, e)
    );
}
function In(e, t) {
  if (e === "next")
    return !1;
  const s = Fo(t == null ? void 0 : t.min);
  if (s && Do(e, s) < 0)
    return !1;
  const i = Fo(t == null ? void 0 : t.max);
  return !(i && Do(e, i) > 0);
}
function Fo(e) {
  return e === "latest" ? jn : e;
}
function Do(e, t) {
  const s = Uo(e), i = Uo(t);
  for (let o = 0; o < 3; o++) {
    const n = s[o] - i[o];
    if (n !== 0)
      return n;
  }
  return 0;
}
function Uo(e) {
  const [t = 0, s = 0, i = 0] = e.split(".").map((o) => Number(o));
  return [t, s, i];
}
async function Mm(e, t) {
  const s = e.wordpressVersion;
  if (typeof s == "string")
    return Bm(s);
  if ($l(s)) {
    if (!t)
      return ni(s), "latest";
    const i = await Hm(s);
    if (i)
      return i;
    throw new Error(
      `Unsatisfiable Blueprint v2 WordPress version constraints ${JSON.stringify(s)}. No available WordPress release satisfies the declared bounds.`
    );
  }
  return s && typeof s == "object" ? Pl : "latest";
}
function Bm(e) {
  if (Km(e))
    return e;
  if (Xm(e))
    return Pl;
  if (Im.includes(e) || Fm.test(e))
    return e;
  throw new Error(
    `Unsupported Blueprint v2 WordPress version "${e}". Use latest, beta, trunk, nightly, or a version like 6.8, 6.8.1, 6.8-beta1, 6.8-rc1; or use none to boot PHP without WordPress.`
  );
}
function $l(e) {
  return !e || typeof e != "object" ? !1 : "min" in e;
}
async function Hm(e) {
  ni(e);
  const t = e.preferred, s = await Vm(e);
  if (t && t !== "latest") {
    const i = s.filter(
      (n) => Ym(n, t)
    );
    if (i.length === 0)
      throw new Error(
        `Blueprint v2 preferred WordPress version "${t}" is not available.`
      );
    const o = i.find(
      (n) => Nr(n, e)
    );
    if (o)
      return o;
    throw new Error(
      `Blueprint v2 preferred WordPress version "${t}" does not satisfy constraints ${JSON.stringify(e)}.`
    );
  }
  return s.find(
    (i) => Nr(i, e)
  );
}
function ni(e) {
  Jm(e), yn(
    "wordpressVersion.min",
    e.min
  ), e.max && yn(
    "wordpressVersion.max",
    e.max
  );
  const t = e.preferred;
  if (t && t !== "latest" && (yn(
    "wordpressVersion.preferred",
    t
  ), !Gm(
    t,
    e
  )))
    throw new Error(
      `Blueprint v2 preferred WordPress version "${t}" does not satisfy constraints ${JSON.stringify(e)}.`
    );
  if (!Nr(
    e.min,
    e
  ))
    throw new Error(
      `Unsatisfiable Blueprint v2 WordPress version constraints ${JSON.stringify(e)}. The minimum version exceeds the maximum version.`
    );
}
async function Vm(e) {
  const t = (await Od()).map(
    zm
  );
  if (e && [e.min, e.max, e.preferred].some(
    (s) => {
      var i;
      return s && ((i = ot(s)) == null ? void 0 : i.suffix) !== void 0;
    }
  )) {
    const s = await Ad("beta");
    t.push(s.version);
  }
  return Array.from(new Set(t)).filter(kl).sort((s, i) => ks(i, s));
}
function zm(e) {
  return /^\d+\.\d+$/.test(e) ? `${e}.0` : e;
}
function Ym(e, t) {
  const s = ot(e), i = ot(t);
  return !s || !i ? !1 : !i.patchSpecified && !i.suffix ? !s.suffix && s.parts[0] === i.parts[0] && s.parts[1] === i.parts[1] : ks(e, t) === 0;
}
function Gm(e, t) {
  const s = ot(e);
  if (!s)
    return !1;
  if (s.patchSpecified || s.suffix)
    return Nr(e, t);
  const i = ot(t.min), o = s.parts.slice(0, 2), n = i.parts.slice(0, 2);
  if (jo(o, n) < 0)
    return !1;
  if (!t.max)
    return !0;
  const r = ot(t.max), l = r.parts.slice(0, 2), p = jo(
    o,
    l
  );
  return p < 0 || p === 0 && !r.suffix;
}
function jo(e, t) {
  for (let s = 0; s < 2; s++) {
    const i = e[s] - t[s];
    if (i !== 0)
      return i;
  }
  return 0;
}
function Zm(e, t) {
  throw new Error(
    `Installed WordPress version "${e}" does not satisfy Blueprint v2 wordpressVersion ${JSON.stringify(t)}.`
  );
}
function Jm(e) {
  hn(
    "wordpressVersion.min",
    e.min
  ), e.max !== void 0 && hn(
    "wordpressVersion.max",
    e.max
  ), e.preferred !== void 0 && hn(
    "wordpressVersion.preferred",
    e.preferred
  );
}
function hn(e, t) {
  if (typeof t != "string")
    throw new Error(
      `Unsupported Blueprint v2 WordPress version constraint ${e} ${JSON.stringify(t)}. Use a version like 6.8, 6.8.1, 6.8-beta1, or 6.8-rc1.`
    );
}
function yn(e, t) {
  if (!kl(t))
    throw new Error(
      `Unsupported Blueprint v2 WordPress version constraint ${e} "${t}". Use a version like 6.8, 6.8.1, 6.8-beta1, or 6.8-rc1.`
    );
}
function Nr(e, t) {
  const s = ot(e), i = ot(t.min);
  if (!s || !i || ks(e, t.min) < 0)
    return !1;
  if (!t.max)
    return !0;
  const o = ot(t.max);
  return o ? !o.patchSpecified && !o.suffix && s.parts[0] === o.parts[0] && s.parts[1] === o.parts[1] ? !0 : ks(e, t.max) <= 0 : !1;
}
function ks(e, t) {
  const s = ot(e), i = ot(t);
  if (!s || !i)
    throw new Error(
      `Cannot compare WordPress versions "${e}" and "${t}".`
    );
  for (let o = 0; o < s.parts.length; o++) {
    const n = s.parts[o] - i.parts[o];
    if (n !== 0)
      return n;
  }
  return 0;
}
function kl(e) {
  return ot(e) !== null;
}
function ot(e) {
  const t = e.match(
    /^(\d+)\.(\d+)(?:\.(\d+))?(?:-(beta|rc)(\d+))?$/i
  );
  if (!t)
    return null;
  const [, s, i, o, n, r = "0"] = t, l = n == null ? void 0 : n.toLowerCase(), p = l ? l === "beta" ? 0 : 1 : 2;
  return {
    parts: [
      Number(s),
      Number(i),
      Number(o ?? "0"),
      p,
      Number(r)
    ],
    patchSpecified: o !== void 0,
    suffix: l
  };
}
function Km(e) {
  return e.startsWith("http://") || e.startsWith("https://");
}
function Xm(e) {
  return e.startsWith("/") || e.startsWith("./") || e.startsWith("../");
}
class et extends Error {
  constructor(t, s = "This Blueprint v2 feature is not supported by the TypeScript runner yet.") {
    super(`${t}: ${s}`), this.name = "UnsupportedBlueprintV2FeatureError", this.featurePath = t;
  }
}
const ii = [
  "posts",
  "pages",
  "comments"
];
async function Qm(e, t = {}) {
  const s = await xl(
    e,
    t.siteMode,
    t.onBlueprintValidated
  ), i = ih(e, t.siteMode), { steps: o, unsupportedPlan: n } = oh(i), r = th(
    e,
    s,
    o
  );
  return {
    runtime: s,
    applicationOptions: e.applicationOptions,
    plan: i,
    steps: o,
    unsupportedPlan: n,
    run: async (l) => {
      if (n.length > 0)
        throw new et(
          "executionPlan",
          rh(n)
        );
      await (await Ns(r, {
        progress: t.progress,
        streamBundledFile: t.streamBundledFile
      })).run(l);
    }
  };
}
async function eh(e, t = {}) {
  const { assertValidBlueprintV2Declaration: s } = await import("./validate-blueprint-v2-BatnYL-x.js");
  s(e);
  const i = Fh(
    e.wordpressVersion
  );
  if (!i)
    return;
  const o = ai(i, "wordpress");
  return await Ve.create(
    li(o) ? {
      resource: "zip",
      inner: o,
      name: "wordpress.zip"
    } : o,
    t
  ).resolve();
}
function th(e, t, s) {
  var o;
  const i = (o = e.applicationOptions) == null ? void 0 : o["wordpress-playground"];
  return {
    preferredVersions: {
      php: t.phpVersion,
      wp: e.wordpressVersion === "none" ? !1 : t.wpVersion
    },
    features: {
      intl: t.intl,
      networking: t.networking
    },
    extraLibraries: t.extraLibraries,
    landingPage: i == null ? void 0 : i.landingPage,
    login: i == null ? void 0 : i.login,
    steps: s
  };
}
function rh(e) {
  return `Blueprint v2 execution plan contains unsupported items: ${e.map(
    (s) => `${nh(s)} (${sh(s)})`
  ).join(", ")}.`;
}
function sh(e) {
  return e.type === "runStep" ? e.step.step : e.type;
}
function nh(e) {
  return "sourcePath" in e ? e.sourcePath : `/${e.type}`;
}
function ih(e, t = "create-new-site") {
  var o, n;
  const s = [], i = e.contentBaseline;
  if (t === "create-new-site" && i !== void 0) {
    const r = El(i);
    ii.some(
      (l) => !r.includes(l)
    ) && s.push({
      type: "applyContentBaseline",
      contentBaseline: i,
      sourcePath: "/contentBaseline"
    });
  }
  t === "create-new-site" && e.usersBaseline === "empty" && s.push({
    type: "applyUsersBaseline",
    sourcePath: "/usersBaseline"
  }), e.constants && Object.keys(e.constants).length > 0 && s.push({
    type: "defineWpConfigConsts",
    consts: e.constants
  }), e.siteOptions && Object.keys(e.siteOptions).length > 0 && s.push({
    type: "setSiteOptions",
    options: e.siteOptions
  });
  for (const [r, l] of (e.muPlugins ?? []).entries())
    s.push({
      type: "installMuPlugin",
      muPlugin: l,
      sourcePath: `/muPlugins/${r}`
    });
  for (const [r, l] of (e.themes ?? []).entries())
    s.push({
      type: "installTheme",
      theme: l,
      active: !1,
      sourcePath: `/themes/${r}`
    });
  e.activeTheme !== void 0 && s.push({
    type: "installTheme",
    theme: e.activeTheme,
    active: !0,
    sourcePath: "/activeTheme"
  });
  for (const [r, l] of (e.plugins ?? []).entries())
    s.push({
      type: "installPlugin",
      plugin: l,
      sourcePath: `/plugins/${r}`
    });
  e.fonts && Object.keys(e.fonts).length > 0 && s.push({
    type: "installFonts",
    fonts: e.fonts
  });
  for (const [r, l] of (e.media ?? []).entries())
    s.push({
      type: "importMedia",
      media: l,
      sourcePath: `/media/${r}`
    });
  e.siteLanguage && s.push({
    type: "setSiteLanguage",
    language: e.siteLanguage
  }), (o = e.roles) != null && o.length && s.push({
    type: "defineRoles",
    roles: e.roles
  }), (n = e.users) != null && n.length && s.push({
    type: "defineUsers",
    users: e.users
  }), e.postTypes && Object.keys(e.postTypes).length > 0 && s.push({
    type: "definePostTypes",
    postTypes: e.postTypes
  });
  for (const [r, l] of (e.content ?? []).entries())
    s.push({
      type: "importContent",
      content: l,
      sourcePath: `/content/${r}`
    });
  for (const [r, l] of (e.additionalStepsAfterExecution ?? []).entries())
    s.push({
      type: "runStep",
      step: l,
      sourcePath: `/additionalStepsAfterExecution/${r}`
    });
  return s;
}
function oh(e) {
  const t = [], s = [], i = {
    nextTempFileIndex: 0
  };
  for (const o of e) {
    const n = fh(
      o,
      i
    );
    n ? t.push(...ah(n, o)) : s.push(o);
  }
  return { steps: t, unsupportedPlan: s };
}
function ah(e, t) {
  if (e.length === 0)
    return e;
  const s = lh(t), i = 1 / e.length;
  return e.map((o) => {
    var n, r;
    return {
      ...o,
      progress: {
        ...o.progress,
        caption: ((n = o.progress) == null ? void 0 : n.caption) ?? s,
        weight: ((r = o.progress) == null ? void 0 : r.weight) ?? i
      }
    };
  });
}
function lh(e) {
  switch (e.type) {
    case "applyContentBaseline":
      return "Removing initial content";
    case "applyUsersBaseline":
      return "Removing initial users";
    case "defineWpConfigConsts":
      return "Defining constants";
    case "setSiteOptions":
      return "Setting site options";
    case "installMuPlugin":
      return "Installing must-use plugin";
    case "installTheme":
      return e.active ? "Installing active theme" : "Installing theme";
    case "installPlugin":
      return "Installing plugin";
    case "installFonts":
      return "Installing fonts";
    case "importMedia":
      return "Importing media";
    case "setSiteLanguage":
      return "Setting site language";
    case "defineRoles":
      return "Creating roles";
    case "defineUsers":
      return "Creating users";
    case "definePostTypes":
      return "Registering post types";
    case "importContent":
      return ph(e.content);
    case "runStep":
      return ch(e.step);
  }
  return oi(e);
}
function oi(e) {
  throw new Error(`Unexpected Blueprint v2 progress item: ${e}`);
}
function ph(e) {
  switch (e.type) {
    case "mysql-dump":
      return "Importing SQL content";
    case "posts":
      return "Importing posts";
    case "wxr":
      return "Importing WXR content";
  }
  return oi(e);
}
function ch(e) {
  switch (e.step) {
    case "activatePlugin":
      return "Activating plugin";
    case "activateTheme":
      return "Activating theme";
    case "cp":
      return "Copying files";
    case "defineConstants":
      return "Defining constants";
    case "enableMultisite":
      return "Enabling multisite";
    case "importContent":
      return "Importing content";
    case "importMedia":
      return "Importing media";
    case "importThemeStarterContent":
      return "Importing theme starter content";
    case "installPlugin":
      return "Installing plugin";
    case "installTheme":
      return "Installing theme";
    case "mkdir":
      return "Creating directory";
    case "mv":
      return "Moving files";
    case "rm":
      return "Removing file";
    case "rmdir":
      return "Removing directory";
    case "resetData":
      return "Resetting WordPress data";
    case "runPHP":
      return "Running PHP";
    case "runSQL":
      return "Executing SQL queries";
    case "setSiteLanguage":
      return "Setting site language";
    case "setSiteOptions":
      return "Setting site options";
    case "unzip":
      return "Extracting ZIP file";
    case "wp-cli":
      return "Running WP-CLI";
    case "writeFiles":
      return "Writing files";
  }
  return oi(e);
}
function fh(e, t) {
  switch (e.type) {
    case "applyContentBaseline":
      return [
        {
          step: "resetData",
          contentTypes: uh(
            e.contentBaseline
          )
        }
      ];
    case "applyUsersBaseline":
      return dh();
    case "defineWpConfigConsts":
      return [
        {
          step: "defineWpConfigConsts",
          consts: e.consts
        }
      ];
    case "setSiteOptions":
      return [
        {
          step: "setSiteOptions",
          options: e.options
        }
      ];
    case "installTheme":
      return [Al(e.theme, e.active)];
    case "installPlugin":
      return [Sl(e.plugin)];
    case "installMuPlugin":
      return wh(e.muPlugin, e.sourcePath);
    case "installFonts":
      return $h(e.fonts, t);
    case "importMedia":
      return Tl(
        [e.media],
        e.sourcePath,
        t
      );
    case "defineRoles":
      return [Ph(e.roles)];
    case "defineUsers":
      return [xh(e.users)];
    case "definePostTypes":
      return vh(e.postTypes);
    case "importContent":
      return Ol(
        e.content,
        e.sourcePath,
        t
      );
    case "setSiteLanguage":
      return [
        {
          step: "setSiteLanguage",
          language: e.language
        }
      ];
    case "runStep":
      return hh(
        e.step,
        e.sourcePath,
        t
      );
    default:
      return;
  }
}
function uh(e) {
  const t = El(e);
  return ii.filter(
    (s) => !t.includes(s)
  );
}
function El(e) {
  return e === "keep-all" ? ii : e === "empty" ? [] : ci(e);
}
function dh() {
  return [
    {
      step: "runPHP",
      code: `<?php
			require '/wordpress/wp-load.php';
			require_once ABSPATH . 'wp-admin/includes/user.php';

			$user_ids = get_users(['fields' => 'ID']);
			foreach ($user_ids as $user_id) {
				wp_delete_user((int) $user_id);
			}

			$reset_sequence_if_empty = static function($table_name) use ($wpdb) {
				$count = $wpdb->get_var("SELECT COUNT(*) FROM {$table_name}");
				if ((int) $count !== 0) {
					return;
				}
				if (isset($GLOBALS['@pdo'])) {
					$statement = $GLOBALS['@pdo']->prepare(
						'DELETE FROM SQLITE_SEQUENCE WHERE NAME = :table_name'
					);
					$statement->execute([':table_name' => $table_name]);
					return;
				}
				$wpdb->query("ALTER TABLE {$table_name} AUTO_INCREMENT = 1");
			};

			$reset_sequence_if_empty($wpdb->users);
			$reset_sequence_if_empty($wpdb->usermeta);
			`
    }
  ];
}
function Ol(e, t, s) {
  switch (e.type) {
    case "mysql-dump":
      return ci(e.source).map((i, o) => ({
        step: "runSql",
        sql: St(
          i,
          `${t}.source[${o}]`
        )
      }));
    case "wxr":
      return mh(e, t);
    case "posts":
      return bh(e, t, s);
    default:
      return;
  }
}
function mh(e, t) {
  const s = e.authorsMode ?? (e.importUsers ? "create" : "default-author"), i = e.importUsers ?? s === "create";
  return ci(e.source).map((o, n) => {
    const r = {
      step: "importWxr",
      file: St(
        o,
        `${t}.source[${n}]`
      ),
      fetchAttachments: e.staticAssets !== "hotlink",
      rewriteUrls: e.urlsMode !== "preserve",
      importComments: e.importComments ?? !1,
      authorsMode: s,
      importUsers: i
    };
    return e.urlsMap !== void 0 && (r.urlMapping = e.urlsMap), e.authorsMap !== void 0 && (r.authorsMap = e.authorsMap), e.defaultAuthorUsername !== void 0 && (r.defaultAuthorUsername = e.defaultAuthorUsername), r;
  });
}
function hh(e, t, s) {
  switch (e.step) {
    case "activatePlugin":
      return [
        {
          step: "activatePlugin",
          pluginPath: e.pluginPath,
          pluginName: e.humanReadableName
        }
      ];
    case "activateTheme":
      return [
        {
          step: "activateTheme",
          themeFolderName: e.themeDirectoryName
        }
      ];
    case "cp":
      return [
        {
          step: "cp",
          fromPath: ft(e.fromPath),
          toPath: ft(e.toPath)
        }
      ];
    case "defineConstants":
      return [
        {
          step: "defineWpConfigConsts",
          consts: e.constants
        }
      ];
    case "enableMultisite":
      return [
        {
          step: "enableMultisite"
        }
      ];
    case "importContent":
      return yh(e, s);
    case "importMedia":
      return _h(e, t, s);
    case "importThemeStarterContent":
      return [
        {
          step: "importThemeStarterContent",
          themeSlug: e.themeSlug
        }
      ];
    case "installPlugin":
      return [Sl(e)];
    case "installTheme":
      return [Al(e, e.active ?? !0)];
    case "mkdir":
      return [
        {
          step: "mkdir",
          path: ft(e.path)
        }
      ];
    case "mv":
      return [
        {
          step: "mv",
          fromPath: ft(e.fromPath),
          toPath: ft(e.toPath)
        }
      ];
    case "rm":
      return [
        {
          step: "rm",
          path: ft(e.path)
        }
      ];
    case "rmdir":
      return [
        {
          step: "rmdir",
          path: ft(e.path)
        }
      ];
    case "resetData":
      return [
        {
          step: "resetData",
          contentTypes: e.contentTypes
        }
      ];
    case "runPHP":
      return gh(e, t, s);
    case "runSQL":
      return [
        {
          step: "runSql",
          sql: St(
            e.source,
            "runSQL.source"
          )
        }
      ];
    case "setSiteLanguage":
      return [
        {
          step: "setSiteLanguage",
          language: e.language
        }
      ];
    case "setSiteOptions":
      return [
        {
          step: "setSiteOptions",
          options: e.options
        }
      ];
    case "wp-cli":
      return [
        {
          step: "wp-cli",
          command: e.command,
          wpCliPath: e.wpCliPath
        }
      ];
    case "unzip":
      return [
        {
          step: "unzip",
          zipFile: St(
            e.zipFile,
            "unzip.zipFile"
          ),
          extractToPath: ft(e.extractToPath)
        }
      ];
    case "writeFiles":
      return kh(e);
    default:
      return;
  }
}
function yh(e, t) {
  const s = [];
  for (const [i, o] of e.content.entries()) {
    const n = Ol(
      o,
      `importContent.content[${i}]`,
      t
    );
    if (!n)
      return;
    s.push(...n);
  }
  return s;
}
function gh(e, t, s) {
  if (At(e.code))
    return e.env ? [
      {
        step: "runPHPWithOptions",
        options: {
          code: e.code.content,
          env: e.env
        }
      }
    ] : [
      {
        step: "runPHP",
        code: e.code
      }
    ];
  const i = Is(s, "blueprint-run-php", "php");
  return [
    {
      step: "writeFile",
      path: i,
      data: St(
        e.code,
        `${t}/code`
      )
    },
    {
      step: "runPHPWithOptions",
      options: {
        code: `<?php require ${JSON.stringify(i)};`,
        env: e.env || {}
      }
    }
  ];
}
function _h(e, t, s) {
  return Tl(e.media, `${t}/media`, s);
}
function wh(e, t) {
  const s = Dh(e, t), i = Ll(e, t);
  return li(i) ? [
    {
      step: "writeFiles",
      writeToPath: s,
      filesTree: i
    }
  ] : [
    {
      step: "writeFile",
      path: s,
      data: i
    }
  ];
}
function bh(e, t, s) {
  const i = [], o = [], n = [], r = Array.isArray(e.source), l = r ? e.source : [e.source];
  for (const [p, c] of l.entries()) {
    const f = r ? `${t}.source[${p}]` : `${t}.source`;
    if (Cl(c)) {
      const u = Is(s, "blueprint-post-content");
      i.push({
        step: "writeFile",
        path: u,
        data: St(c, f)
      }), n.push({
        path: u,
        post_title: "Untitled Post",
        post_type: "post"
      });
      continue;
    }
    o.push({ ...c });
  }
  return o.length === 0 && n.length === 0 || i.push({
    step: "runPHPWithOptions",
    options: {
      code: Rh,
      env: {
        BLUEPRINT_POSTS: JSON.stringify(o),
        BLUEPRINT_POST_FILES: JSON.stringify(n),
        BLUEPRINT_URLS_MODE: e.urlsMode || "rewrite",
        BLUEPRINT_URLS_MAP: JSON.stringify(e.urlsMap || {})
      }
    }
  }), i;
}
function Tl(e, t, s) {
  const i = [], o = [];
  for (const [n, r] of e.entries()) {
    const l = r && typeof r == "object" && "source" in r ? r : { source: r }, p = `${t}[${n}]`, c = pi(l.source, p), f = Is(s, "blueprint-media");
    i.push({
      step: "writeFile",
      path: f,
      data: St(l.source, p)
    });
    const u = { path: f, filename: c };
    for (const g of ["title", "description", "alt", "caption"])
      l[g] !== void 0 && (u[g] = l[g]);
    o.push(u);
  }
  return o.length === 0 || i.push({
    step: "runPHPWithOptions",
    options: {
      code: Lh,
      env: {
        BLUEPRINT_MEDIA: JSON.stringify(o)
      }
    }
  }), i;
}
function vh(e) {
  return Object.entries(e).flatMap(([t, s], i) => {
    const o = `blueprint-post-type-${i}`, n = `/wordpress/wp-content/mu-plugins/${o}.php`;
    if (typeof s == "string") {
      const l = `/wordpress/wp-content/mu-plugins/${o}.json`;
      return [
        {
          step: "writeFile",
          path: l,
          data: St(
            s,
            `postTypes.${JSON.stringify(t)}`
          )
        },
        {
          step: "writeFile",
          path: n,
          data: {
            resource: "literal",
            name: `${o}.php`,
            contents: Th(t, l)
          }
        }
      ];
    }
    const r = { ...s };
    return r.label === void 0 && (r.label = Es(t)), [
      {
        step: "writeFile",
        path: n,
        data: {
          resource: "literal",
          name: `${o}.php`,
          contents: Oh(
            t,
            r
          )
        }
      }
    ];
  });
}
function Ph(e) {
  return {
    step: "runPHPWithOptions",
    options: {
      code: Sh,
      env: {
        BLUEPRINT_ROLES: JSON.stringify(e)
      }
    }
  };
}
function xh(e) {
  return {
    step: "runPHPWithOptions",
    options: {
      code: Ah,
      env: {
        BLUEPRINT_USERS: JSON.stringify(e)
      }
    }
  };
}
function $h(e, t) {
  const s = [], i = [], o = {};
  let n = 0;
  for (const [r, l] of Object.entries(e)) {
    const p = `fonts.${JSON.stringify(r)}`;
    if (Cl(l)) {
      const f = Fn(
        l,
        `${p}.source`,
        r,
        s,
        o,
        n++,
        t
      ), u = Es(r);
      i.push({
        slug: r,
        name: u,
        font_families: [
          {
            font_family_settings: {
              name: u,
              slug: r,
              fontFamily: u,
              fontFace: [
                {
                  fontFamily: u,
                  src: f
                }
              ]
            }
          }
        ]
      });
      continue;
    }
    const c = qo(l);
    c.slug = r, c.name = c.name || Es(r), c.font_families = (c.font_families || []).map(
      (f, u) => {
        const g = qo(f), w = {
          ...g.font_family_settings || {}
        };
        return Array.isArray(w.fontFace) && (w.fontFace = w.fontFace.map(
          (O, m) => {
            const h = { ...O };
            return h.src = Eh(
              h.src,
              `${p}.font_families[${u}].font_family_settings.fontFace[${m}].src`,
              w.slug || r,
              s,
              o,
              () => n++,
              t
            ), h;
          }
        )), g.font_family_settings = w, g;
      }
    ), i.push(c);
  }
  return i.length === 0 || s.push({
    step: "runPHPWithOptions",
    options: {
      code: Ch,
      env: {
        BLUEPRINT_FONT_COLLECTIONS: JSON.stringify(i),
        BLUEPRINT_FONT_FILES: JSON.stringify(o)
      }
    }
  }), s;
}
function kh(e) {
  const t = [];
  for (const [s, i] of Object.entries(e.files)) {
    const o = ft(s), n = Ll(
      i,
      `writeFiles.files[${JSON.stringify(s)}]`
    );
    li(n) ? t.push({
      step: "writeFiles",
      writeToPath: o,
      filesTree: n
    }) : t.push({
      step: "writeFile",
      path: o,
      data: n
    });
  }
  return t;
}
function Eh(e, t, s, i, o, n, r) {
  return Array.isArray(e) ? e.map(
    (l, p) => Fn(
      l,
      `${t}[${p}]`,
      s,
      i,
      o,
      n(),
      r
    )
  ) : Fn(
    e,
    t,
    s,
    i,
    o,
    n(),
    r
  );
}
function Fn(e, t, s, i, o, n, r) {
  const l = pi(e, t);
  if (!/\.(woff2|woff|ttf|otf)$/i.test(l))
    throw new et(
      t,
      "Blueprint v2 font sources must reference .woff2, .woff, .ttf, or .otf files."
    );
  const p = `font-${n}`, c = Is(r, "blueprint-font");
  return i.push({
    step: "writeFile",
    path: c,
    data: St(e, t)
  }), o[`blueprint-font-file:${p}`] = {
    path: c,
    filename: l
  }, `blueprint-font-file:${p}`;
}
function Oh(e, t) {
  return `<?php
add_action('init', function () {
	register_post_type(${JSON.stringify(e)}, json_decode(${JSON.stringify(
    JSON.stringify(t)
  )}, true));
}, 0);
`;
}
function Th(e, t) {
  return `<?php
add_action('init', function () {
	$args = json_decode(file_get_contents(__DIR__ . '/${Et(t)}'), true);
	if (!is_array($args)) {
		$args = array();
	}
	if (!isset($args['label'])) {
		$args['label'] = ${JSON.stringify(Es(e))};
	}
	register_post_type(${JSON.stringify(e)}, $args);
}, 0);
`;
}
const Sh = `<?php
require '/wordpress/wp-load.php';

$roles = json_decode(getenv('BLUEPRINT_ROLES') ?: '[]', true);
if (!is_array($roles)) {
	throw new Exception('Invalid Blueprint roles payload.');
}

foreach ($roles as $role) {
	if (empty($role['name']) || !is_string($role['name'])) {
		continue;
	}
	$role_name = $role['name'];
	$display_name = $role['display_name'] ?? ucfirst($role_name);
	$capabilities = $role['capabilities'] ?? array();
	if (!get_role($role_name)) {
		add_role($role_name, $display_name, array('read' => true));
	}
	$role_object = get_role($role_name);
	if (!$role_object) {
		throw new Exception('Could not create Blueprint role: ' . $role_name);
	}
	foreach ($capabilities as $capability => $grant) {
		if (filter_var($grant, FILTER_VALIDATE_BOOLEAN)) {
			$role_object->add_cap($capability);
		} else {
			$role_object->remove_cap($capability);
		}
	}
}
`, Ah = `<?php
require '/wordpress/wp-load.php';

$users = json_decode(getenv('BLUEPRINT_USERS') ?: '[]', true);
if (!is_array($users)) {
	throw new Exception('Invalid Blueprint users payload.');
}

foreach ($users as $user) {
	if (empty($user['username']) || !is_string($user['username'])) {
		continue;
	}
	$username = $user['username'];
	$existing = get_user_by('login', $username);
	if ($existing) {
		$user_id = $existing->ID;
	} else {
		$email = $user['email'] ?? $username . '@example.com';
		$password = $user['password'] ?? wp_generate_password(24, true, true);
		$user_id = wp_create_user($username, $password, $email);
		if (is_wp_error($user_id)) {
			throw new Exception($user_id->get_error_message());
		}
	}
	$user_object = new WP_User($user_id);
	if (!empty($user['role']) && is_string($user['role'])) {
		$user_object->set_role($user['role']);
	}
	foreach (($user['meta'] ?? array()) as $meta_key => $meta_value) {
		update_user_meta($user_id, $meta_key, $meta_value);
	}
}
`, Rh = `<?php
require '/wordpress/wp-load.php';

$posts = json_decode(getenv('BLUEPRINT_POSTS') ?: '[]', true);
$post_files = json_decode(getenv('BLUEPRINT_POST_FILES') ?: '[]', true);
$urls_mode = getenv('BLUEPRINT_URLS_MODE') ?: 'rewrite';
$urls_map = json_decode(getenv('BLUEPRINT_URLS_MAP') ?: '{}', true);

if (!is_array($posts) || !is_array($post_files) || !is_array($urls_map)) {
	throw new Exception('Invalid Blueprint posts payload.');
}

$blueprint_temp_files = array();
foreach ($post_files as $file) {
	if (is_array($file) && !empty($file['path']) && is_string($file['path'])) {
		$blueprint_temp_files[] = $file['path'];
	}
}

try {
	foreach ($post_files as $file) {
		$source_path = $file['path'] ?? '';
		if (!$source_path || !is_readable($source_path)) {
			throw new Exception('Post content source is not readable: ' . $source_path);
		}
		$posts[] = array(
			'post_title' => $file['post_title'] ?? 'Untitled Post',
			'post_content' => file_get_contents($source_path),
			'post_status' => 'publish',
			'post_type' => $file['post_type'] ?? 'post',
		);
	}

	$default_author = blueprint_default_post_author();
	wp_set_current_user($default_author);

	foreach ($posts as $post) {
		if (!is_array($post)) {
			throw new Exception('Each Blueprint post must be an object.');
		}

		$post = blueprint_prepare_post($post, $default_author, $urls_mode, $urls_map);
		$post_tags = $post['post_tags'] ?? null;
		$page_template = $post['page_template'] ?? null;
		$tax_input = $post['tax_input'] ?? null;
		unset($post['post_tags'], $post['page_template'], $post['tax_input']);

		$post_id = wp_insert_post(wp_slash($post), true);
		if (is_wp_error($post_id)) {
			throw new Exception($post_id->get_error_message());
		}

		if (is_array($post_tags)) {
			blueprint_set_terms($post_id, 'post_tag', $post_tags);
		}
		if (is_array($tax_input)) {
			foreach ($tax_input as $taxonomy => $terms) {
				if (taxonomy_exists($taxonomy) && is_array($terms)) {
					blueprint_set_terms($post_id, $taxonomy, $terms);
				}
			}
		}
		if ($page_template && ($post['post_type'] ?? 'post') === 'page') {
			update_post_meta($post_id, '_wp_page_template', $page_template);
		}
	}
} finally {
	blueprint_cleanup_post_temp_files($blueprint_temp_files);
}

/**
 * Builds the wp_insert_post() payload for one Blueprint post.
 */
function blueprint_prepare_post(array $post, int $default_author, string $urls_mode, array $urls_map): array {
	if (!isset($post['post_author'])) {
		$post['post_author'] = $default_author;
	} else {
		$post['post_author'] = (int) $post['post_author'];
		if ($post['post_author'] <= 0 || !get_userdata($post['post_author'])) {
			$post['post_author'] = $default_author;
		}
	}

	if (isset($post['post_parent_name']) && !isset($post['post_parent'])) {
		$post['post_parent'] = blueprint_find_parent_post_id(
			$post['post_parent_name'],
			$post['post_type'] ?? 'page'
		);
	}
	unset($post['post_parent_name']);

	if (isset($post['post_category']) && is_array($post['post_category'])) {
		$post['post_category'] = blueprint_ensure_terms('category', $post['post_category']);
	}

	foreach (array('post_content', 'post_excerpt', 'guid') as $field) {
		if (isset($post[$field]) && is_string($post[$field])) {
			$post[$field] = blueprint_rewrite_urls($post[$field], $urls_mode, $urls_map);
		}
	}
	if (isset($post['meta_input']) && is_array($post['meta_input'])) {
		$post['meta_input'] = blueprint_rewrite_urls($post['meta_input'], $urls_mode, $urls_map);
	}

	return $post;
}

/**
 * Returns the author used when imported post data omits one.
 */
function blueprint_default_post_author(): int {
	$admins = get_users(array(
		'role' => 'administrator',
		'number' => 1,
		'orderby' => 'ID',
		'order' => 'ASC',
		'fields' => 'ID',
	));
	if (!empty($admins)) {
		return (int) $admins[0];
	}

	$users = get_users(array(
		'number' => 1,
		'orderby' => 'ID',
		'order' => 'ASC',
		'fields' => 'ID',
	));
	if (!empty($users)) {
		return (int) $users[0];
	}

	$existing = get_user_by('login', 'blueprint-author');
	if ($existing) {
		return (int) $existing->ID;
	}

	$user_id = wp_create_user(
		'blueprint-author',
		wp_generate_password(24, true, true),
		'blueprint-author@example.com'
	);
	if (is_wp_error($user_id)) {
		throw new Exception($user_id->get_error_message());
	}
	return (int) $user_id;
}

/**
 * Resolves a parent post by title for hierarchical post declarations.
 */
function blueprint_find_parent_post_id(string $name, string $post_type): int {
	$parent = get_page_by_path(sanitize_title($name), OBJECT, $post_type);
	if (!$parent) {
		$parent = get_page_by_title($name, OBJECT, $post_type);
	}
	if (!$parent) {
		throw new Exception('Could not resolve post_parent_name: ' . $name);
	}
	return (int) $parent->ID;
}

/**
 * Ensures and assigns taxonomy terms for one imported post.
 */
function blueprint_set_terms(int $post_id, string $taxonomy, array $terms): void {
	$term_ids = blueprint_ensure_terms($taxonomy, $terms);
	if (!empty($term_ids)) {
		$result = wp_set_object_terms($post_id, $term_ids, $taxonomy, false);
		if (is_wp_error($result)) {
			throw new Exception($result->get_error_message());
		}
	}
}

/**
 * Creates missing terms and returns IDs ready for wp_set_post_terms().
 */
function blueprint_ensure_terms(string $taxonomy, array $terms): array {
	$term_ids = array();
	foreach ($terms as $term_name) {
		if (!is_string($term_name) || $term_name === '') {
			continue;
		}
		$term = get_term_by('slug', sanitize_title($term_name), $taxonomy);
		if (!$term) {
			$term = get_term_by('name', $term_name, $taxonomy);
		}
		if (!$term) {
			$created = wp_insert_term($term_name, $taxonomy, array(
				'slug' => sanitize_title($term_name),
			));
			if (is_wp_error($created)) {
				throw new Exception($created->get_error_message());
			}
			$term_ids[] = (int) $created['term_id'];
			continue;
		}
		$term_ids[] = (int) $term->term_id;
	}
	return $term_ids;
}

/**
 * Applies the requested URL-preservation or URL-rewrite policy recursively.
 */
function blueprint_rewrite_urls($value, string $urls_mode, array $urls_map) {
	if ($urls_mode === 'preserve' || empty($urls_map)) {
		return $value;
	}
	if (is_string($value)) {
		return strtr($value, $urls_map);
	}
	if (is_array($value)) {
		foreach ($value as $key => $item) {
			$value[$key] = blueprint_rewrite_urls($item, $urls_mode, $urls_map);
		}
		return $value;
	}
	return $value;
}

/**
 * Removes temporary files used while importing file-backed posts.
 */
function blueprint_cleanup_post_temp_files(array $paths): void {
	foreach (array_unique($paths) as $path) {
		if (is_string($path) && file_exists($path)) {
			@unlink($path);
		}
	}
}
`, Lh = `<?php
require '/wordpress/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';

$media_items = json_decode(getenv('BLUEPRINT_MEDIA') ?: '[]', true);
if (!is_array($media_items)) {
	throw new Exception('Invalid Blueprint media payload.');
}

$blueprint_temp_files = array();
foreach ($media_items as $item) {
	if (is_array($item) && !empty($item['path']) && is_string($item['path'])) {
		$blueprint_temp_files[] = $item['path'];
	}
}

try {
	foreach ($media_items as $item) {
		$source_path = $item['path'] ?? '';
		if (!$source_path || !is_readable($source_path)) {
			throw new Exception('Media source is not readable: ' . $source_path);
		}

		$uploads = wp_upload_dir();
		if (!empty($uploads['error'])) {
			throw new Exception($uploads['error']);
		}
		if (!wp_mkdir_p($uploads['path'])) {
			throw new Exception('Could not create uploads directory: ' . $uploads['path']);
		}

		$filename = basename($item['filename'] ?? $source_path);
		if (!is_string($filename) || basename($filename) !== $filename || sanitize_file_name($filename) !== $filename) {
			throw new Exception('Invalid Blueprint media filename: must already be a valid filename.');
		}
		$filename = wp_unique_filename($uploads['path'], $filename);
		$target_path = trailingslashit($uploads['path']) . $filename;
		if (!copy($source_path, $target_path)) {
			throw new Exception('Could not copy media file to uploads directory.');
		}

		$filetype = wp_check_filetype($filename, null);
		$attachment = array(
			'guid' => trailingslashit($uploads['url']) . $filename,
			'post_mime_type' => $filetype['type'] ?: 'application/octet-stream',
			'post_title' => $item['title'] ?? preg_replace('/\\.[^.]+$/', '', $filename),
			'post_content' => $item['description'] ?? '',
			'post_excerpt' => $item['caption'] ?? '',
			'post_status' => 'inherit',
		);

		$attachment_id = wp_insert_attachment($attachment, $target_path, 0, true);
		if (is_wp_error($attachment_id)) {
			throw new Exception($attachment_id->get_error_message());
		}

		$metadata = wp_generate_attachment_metadata($attachment_id, $target_path);
		if (!is_wp_error($metadata) && !empty($metadata)) {
			wp_update_attachment_metadata($attachment_id, $metadata);
		}
		if (array_key_exists('alt', $item)) {
			update_post_meta($attachment_id, '_wp_attachment_image_alt', $item['alt']);
		}
	}
} finally {
	blueprint_cleanup_media_temp_files($blueprint_temp_files);
}

/**
 * Removes temporary files used while importing media attachments.
 */
function blueprint_cleanup_media_temp_files(array $paths): void {
	foreach (array_unique($paths) as $path) {
		if (is_string($path) && file_exists($path)) {
			@unlink($path);
		}
	}
}
`, Ch = `<?php
require '/wordpress/wp-load.php';

$collections = json_decode(getenv('BLUEPRINT_FONT_COLLECTIONS') ?: '[]', true);
$files = json_decode(getenv('BLUEPRINT_FONT_FILES') ?: '{}', true);

if (!is_array($collections) || !is_array($files)) {
	throw new Exception('Invalid Blueprint fonts payload.');
}
if (!function_exists('wp_get_font_dir') || !post_type_exists('wp_font_family') || !post_type_exists('wp_font_face')) {
	throw new Exception('Blueprint fonts require WordPress 6.5 or newer.');
}

/**
 * Requires a Blueprint slug field to already be a WordPress slug.
 */
function blueprint_require_valid_slug(string $slug, string $field): string {
	if ($slug === '' || sanitize_title($slug) !== $slug) {
		throw new Exception('Invalid Blueprint ' . $field . ': must already be a valid slug.');
	}
	return $slug;
}

$blueprint_temp_files = blueprint_font_temp_files($files);
try {
	$font_dir = wp_get_font_dir();
	if (!empty($font_dir['error'])) {
		throw new Exception($font_dir['error']);
	}
	if (!wp_mkdir_p($font_dir['basedir'])) {
		throw new Exception('Could not create font directory: ' . $font_dir['basedir']);
	}

	$registered_collections = array();
	foreach ($collections as $collection) {
		if (!is_array($collection) || empty($collection['slug']) || !is_string($collection['slug'])) {
			throw new Exception('Each Blueprint font collection must have a slug.');
		}

		$slug = blueprint_require_valid_slug($collection['slug'], 'font collection slug');
		$families = isset($collection['font_families']) && is_array($collection['font_families'])
			? $collection['font_families']
			: array();

		foreach ($families as $family_index => $family) {
			if (!is_array($family) || !isset($family['font_family_settings']) || !is_array($family['font_family_settings'])) {
				throw new Exception('Each Blueprint font family must include font_family_settings.');
			}

			$settings = $family['font_family_settings'];
			$family_id = blueprint_upsert_font_family($settings);
			if (!empty($settings['fontFace']) && is_array($settings['fontFace'])) {
				foreach ($settings['fontFace'] as $face_index => $face) {
					if (!is_array($face)) {
						throw new Exception('Each Blueprint fontFace entry must be an object.');
					}
					$prepared_face = blueprint_prepare_font_face($face, $files, $font_dir);
					blueprint_upsert_font_face($family_id, $prepared_face['settings'], $prepared_face['files']);
					$settings['fontFace'][$face_index] = $prepared_face['settings'];
				}
			}
			$families[$family_index]['font_family_settings'] = $settings;
		}

		$collection_args = array(
			'name' => $collection['name'] ?? blueprint_default_display_name_from_slug($slug),
			'font_families' => $families,
		);
		$categories = blueprint_collect_font_categories($families);
		if (!empty($categories)) {
			$collection_args['categories'] = $categories;
		}
		$registered_collections[$slug] = $collection_args;
		blueprint_register_font_collection($slug, $collection_args);
	}

	blueprint_write_font_collections_mu_plugin($registered_collections);
} finally {
	blueprint_cleanup_font_temp_files($blueprint_temp_files);
}

/**
 * Creates or updates a WordPress font-family post for a font collection.
 */
function blueprint_upsert_font_family(array $settings): int {
	foreach (array('name', 'slug', 'fontFamily') as $field) {
		if (empty($settings[$field]) || !is_string($settings[$field])) {
			throw new Exception('Font family setting "' . $field . '" is required.');
		}
	}

	$slug = blueprint_require_valid_slug($settings['slug'], 'font family slug');
	$post_content = $settings;
	unset($post_content['name'], $post_content['slug']);

	$existing = get_posts(array(
		'post_type' => 'wp_font_family',
		'name' => $slug,
		'post_status' => 'any',
		'numberposts' => 1,
	));
	$post = array(
		'post_type' => 'wp_font_family',
		'post_status' => 'publish',
		'post_title' => $settings['name'],
		'post_name' => $slug,
		'post_content' => wp_json_encode($post_content),
	);
	if (!empty($existing)) {
		$post['ID'] = $existing[0]->ID;
	}

	$post_id = wp_insert_post(wp_slash($post), true);
	if (is_wp_error($post_id)) {
		throw new Exception($post_id->get_error_message());
	}
	return (int) $post_id;
}

/**
 * Converts Blueprint font-face settings into WordPress font-library fields.
 */
function blueprint_prepare_font_face(array $settings, array $files, array $font_dir): array {
	if (empty($settings['fontFamily']) || empty($settings['src'])) {
		throw new Exception('Font face settings require fontFamily and src.');
	}

	$srcs = is_array($settings['src']) ? $settings['src'] : array($settings['src']);
	$processed_srcs = array();
	$file_meta = array();

	foreach ($srcs as $src) {
		if (is_string($src) && isset($files[$src])) {
			$copied = blueprint_copy_font_file($files[$src], $font_dir);
			$processed_srcs[] = $copied['url'];
			$file_meta[] = $copied['relative'];
			continue;
		}
		$processed_srcs[] = $src;
	}

	$settings['src'] = count($processed_srcs) === 1 ? $processed_srcs[0] : $processed_srcs;
	return array(
		'settings' => $settings,
		'files' => $file_meta,
	);
}

/**
 * Copies one materialized font binary into the WordPress uploads directory.
 */
function blueprint_copy_font_file(array $file, array $font_dir): array {
	$source_path = $file['path'] ?? '';
	if (!$source_path || !is_readable($source_path)) {
		throw new Exception('Font source is not readable: ' . $source_path);
	}

	$filename = $file['filename'] ?? basename($source_path);
	if (!is_string($filename) || basename($filename) !== $filename || sanitize_file_name($filename) !== $filename) {
		throw new Exception('Invalid Blueprint font filename: must already be a valid filename.');
	}
	if (!preg_match('/\\.(woff2|woff|ttf|otf)$/i', $filename)) {
		throw new Exception('Unsupported font file extension: ' . $filename);
	}

	$unique_filename = wp_unique_filename($font_dir['basedir'], $filename);
	$target_path = trailingslashit($font_dir['basedir']) . $unique_filename;
	if (!copy($source_path, $target_path)) {
		throw new Exception('Could not copy font file to fonts directory.');
	}

	return array(
		'url' => trailingslashit($font_dir['baseurl']) . $unique_filename,
		'relative' => $unique_filename,
	);
}

/**
 * Creates or updates a font-face post belonging to a font family.
 */
function blueprint_upsert_font_face(int $family_id, array $settings, array $file_meta): int {
	$title = blueprint_font_face_slug($settings);
	$existing = get_posts(array(
		'post_type' => 'wp_font_face',
		'post_parent' => $family_id,
		'title' => $title,
		'post_status' => 'any',
		'numberposts' => 1,
	));

	$post = array(
		'post_type' => 'wp_font_face',
		'post_parent' => $family_id,
		'post_status' => 'publish',
		'post_title' => $title,
		'post_name' => sanitize_title($title),
		'post_content' => wp_json_encode($settings),
	);
	if (!empty($existing)) {
		$post['ID'] = $existing[0]->ID;
	}

	$post_id = wp_insert_post(wp_slash($post), true);
	if (is_wp_error($post_id)) {
		throw new Exception($post_id->get_error_message());
	}

	delete_post_meta($post_id, '_wp_font_face_file');
	foreach ($file_meta as $relative_path) {
		add_post_meta($post_id, '_wp_font_face_file', $relative_path);
	}
	return (int) $post_id;
}

/**
 * Builds the stable slug used to find an existing font-face post.
 */
function blueprint_font_face_slug(array $settings): string {
	if (class_exists('WP_Font_Utils') && method_exists('WP_Font_Utils', 'get_font_face_slug')) {
		return WP_Font_Utils::get_font_face_slug($settings);
	}
	$parts = array($settings['fontFamily'] ?? 'font');
	foreach (array('fontStyle', 'fontWeight', 'fontStretch') as $field) {
		if (!empty($settings[$field])) {
			$parts[] = (string) $settings[$field];
		}
	}
	return implode('-', $parts);
}

/**
 * Collects category slugs declared by all families in a collection.
 */
function blueprint_collect_font_categories(array $families): array {
	$categories = array();
	foreach ($families as $family) {
		foreach (($family['categories'] ?? array()) as $category) {
			if (!is_string($category) || $category === '') {
				continue;
			}
			$slug = blueprint_require_valid_slug($category, 'font category slug');
			$categories[$slug] = array(
				'name' => blueprint_default_display_name_from_slug($slug),
				'slug' => $slug,
			);
		}
	}
	return array_values($categories);
}

/**
 * Registers collection metadata after font posts have been imported.
 */
function blueprint_register_font_collection(string $slug, array $collection_args): void {
	if (!function_exists('wp_register_font_collection') || !class_exists('WP_Font_Library')) {
		return;
	}
	$library = WP_Font_Library::get_instance();
	if ($library->get_font_collection($slug) && function_exists('wp_unregister_font_collection')) {
		wp_unregister_font_collection($slug);
	}
	$result = wp_register_font_collection($slug, $collection_args);
	if (is_wp_error($result)) {
		throw new Exception($result->get_error_message());
	}
}

/**
 * Persists imported font collections so they are registered on every boot.
 */
function blueprint_write_font_collections_mu_plugin(array $collections): void {
	if (empty($collections)) {
		return;
	}
	$dir = WP_CONTENT_DIR . '/mu-plugins';
	if (!wp_mkdir_p($dir)) {
		throw new Exception('Could not create mu-plugins directory for font collections.');
	}
	$code = "<?php\\nadd_action('init', function () {\\n" .
		"\\tif (!function_exists('wp_register_font_collection') || !class_exists('WP_Font_Library')) {\\n\\t\\treturn;\\n\\t}\\n" .
		"\\t\\$collections = " . var_export($collections, true) . ";\\n" .
		"\\t\\$library = WP_Font_Library::get_instance();\\n" .
		"\\tforeach (\\$collections as \\$slug => \\$args) {\\n" .
		"\\t\\tif (\\$library->get_font_collection(\\$slug) && function_exists('wp_unregister_font_collection')) {\\n\\t\\t\\twp_unregister_font_collection(\\$slug);\\n\\t\\t}\\n" .
		"\\t\\twp_register_font_collection(\\$slug, \\$args);\\n" .
		"\\t}\\n" .
		"}, 0);\\n";
	file_put_contents($dir . '/blueprint-font-collections.php', $code);
}

/**
 * Converts a slug into the fallback label used by generated font settings.
 */
function blueprint_default_display_name_from_slug(string $slug): string {
	return ucwords(str_replace(array('-', '_'), ' ', $slug));
}

/**
 * Extracts temp paths from the materialized font-file map for cleanup.
 */
function blueprint_font_temp_files(array $files): array {
	$paths = array();
	foreach ($files as $file) {
		if (is_array($file) && !empty($file['path']) && is_string($file['path'])) {
			$paths[] = $file['path'];
		}
	}
	return $paths;
}

/**
 * Removes temporary files used while importing fonts.
 */
function blueprint_cleanup_font_temp_files(array $paths): void {
	foreach (array_unique($paths) as $path) {
		if (is_string($path) && file_exists($path)) {
			@unlink($path);
		}
	}
}
`;
function Sl(e) {
  const t = Rl(e), s = {
    step: "installPlugin",
    pluginData: ai(t.source, "plugin"),
    options: Nh(t)
  };
  return t.ifAlreadyInstalled && (s.ifAlreadyInstalled = t.ifAlreadyInstalled), s;
}
function Nh(e) {
  const t = {
    activate: e.active ?? !0
  };
  return e.activationOptions && (t.activationOptions = e.activationOptions), (e.onError === "skip-plugin" || e.onError === "throw") && (t.onError = e.onError), e.targetDirectoryName && (t.targetFolderName = e.targetDirectoryName), e.humanReadableName && (t.humanReadableName = e.humanReadableName), t;
}
function Al(e, t) {
  const s = Rl(e), i = {
    step: "installTheme",
    themeData: ai(s.source, "theme"),
    options: Ih(s, t)
  };
  return s.ifAlreadyInstalled && (i.ifAlreadyInstalled = s.ifAlreadyInstalled), i;
}
function Ih(e, t) {
  const s = {
    activate: t,
    importStarterContent: e.importStarterContent ?? !1
  };
  return e.targetDirectoryName && (s.targetFolderName = e.targetDirectoryName), (e.onError === "skip-theme" || e.onError === "throw") && (s.onError = e.onError), e.humanReadableName && (s.humanReadableName = e.humanReadableName), s;
}
function Rl(e) {
  return e && typeof e == "object" && "source" in e && !At(e) && !Br(e) && !Hr(e) ? e : { source: e };
}
function Fh(e) {
  if (typeof e == "string" && Wr(e) || At(e) || Br(e) || Hr(e))
    return e;
}
function ai(e, t) {
  if (typeof e == "string") {
    if (wl(e))
      return {
        resource: "zip",
        inner: {
          resource: "git:directory",
          url: e.trim().replace(/\/+$/, ""),
          ref: "HEAD"
        }
      };
    if (Fs(e))
      return { resource: "url", url: e };
    if (Wr(e))
      return {
        resource: "bundled",
        path: Mr(e)
      };
    if (t === "wordpress")
      throw new et(
        "wordpressVersion",
        "Unsupported Blueprint v2 WordPress data reference."
      );
    return jh(
      e,
      t === "plugin" ? "plugins" : "themes"
    );
  }
  if (At(e))
    return {
      resource: "literal",
      name: e.filename,
      contents: e.content
    };
  if (Br(e))
    return {
      resource: "literal:directory",
      name: e.directoryName,
      files: fi(e.files)
    };
  if (Hr(e))
    return {
      resource: "git:directory",
      url: e.gitRepository,
      ref: e.ref || "HEAD",
      path: e.pathInRepository || e.path || ""
    };
  throw new et(
    t,
    "Unsupported Blueprint v2 data reference."
  );
}
function St(e, t) {
  if (typeof e == "string") {
    if (Fs(e))
      return { resource: "url", url: e };
    if (Nl(e))
      return {
        resource: "vfs",
        path: ft(e, t)
      };
    if (Wr(e))
      return {
        resource: "bundled",
        path: Mr(e)
      };
    throw new et(
      t,
      "Blueprint v2 file references must be URLs, execution-context paths, or target-site paths."
    );
  }
  if (At(e))
    return {
      resource: "literal",
      name: e.filename,
      contents: e.content
    };
  throw new et(
    t,
    "Unsupported Blueprint v2 file reference."
  );
}
function Ll(e, t) {
  if (typeof e == "string") {
    if (Fs(e))
      return { resource: "url", url: e };
    if (Wr(e))
      return {
        resource: "bundled",
        path: Mr(e)
      };
    throw new et(
      t,
      "Blueprint v2 writable data references must be URLs or execution-context paths."
    );
  }
  if (At(e))
    return {
      resource: "literal",
      name: e.filename,
      contents: e.content
    };
  if (Br(e))
    return {
      resource: "literal:directory",
      name: e.directoryName,
      files: fi(e.files)
    };
  if (Hr(e))
    return {
      resource: "git:directory",
      url: e.gitRepository,
      ref: e.ref || "HEAD",
      path: e.pathInRepository || e.path || ""
    };
  throw new et(
    t,
    "Unsupported Blueprint v2 writable data reference."
  );
}
function li(e) {
  return e.resource === "literal:directory" || e.resource === "git:directory";
}
function Dh(e, t) {
  const s = "/wordpress/wp-content/mu-plugins";
  if (At(e))
    return ne(s, e.filename);
  if (Br(e))
    return ne(s, e.directoryName);
  if (Hr(e))
    return ne(
      s,
      Uh(e, t)
    );
  if (typeof e == "string")
    return ne(
      s,
      pi(e, t)
    );
  throw new et(
    t,
    "Unsupported Blueprint v2 mu-plugin data reference."
  );
}
function Cl(e) {
  return typeof e == "string" || At(e);
}
function Is(e, t, s) {
  const i = s ? `.${s}` : "";
  return `/tmp/${t}-${e.nextTempFileIndex++}${i}`;
}
function pi(e, t) {
  if (typeof e == "string") {
    if (Fs(e))
      return Et(new URL(e).pathname);
    if (Wr(e))
      return Et(Mr(e));
    if (Nl(e))
      return Et(ft(e, t));
  }
  if (At(e))
    return e.filename;
  throw new et(
    t,
    "Blueprint v2 file references must be URLs, execution-context paths, target-site paths, or inline files."
  );
}
function Uh(e, t) {
  const s = e.pathInRepository || e.path;
  if (s) {
    if (Il(s))
      throw new et(
        `${t}.pathInRepository`,
        "Blueprint v2 git paths must not contain parent directory segments."
      );
    return Et(s);
  }
  return Et(new URL(e.gitRepository).pathname);
}
function Es(e) {
  return e.replace(/[-_]+/g, " ").replace(/\b\w/g, (t) => t.toUpperCase());
}
function qo(e) {
  return JSON.parse(JSON.stringify(e));
}
function ci(e) {
  return Array.isArray(e) ? e : [e];
}
function ft(e, t = "path") {
  if (typeof e != "string" || e.trim() === "")
    throw new et(
      t,
      "Invalid Blueprint v2 path: must not be empty."
    );
  const s = e.startsWith("site:"), i = s ? e.slice(5) : e;
  if (!s && i === "/wordpress")
    return "/wordpress";
  const o = !s && i.startsWith("/wordpress/") ? i : ne("/wordpress", i), n = Xo(o, "/wordpress");
  if (!n)
    throw new et(
      t,
      `Invalid Blueprint v2 path "${e}": must stay within the target WordPress root.`
    );
  return n;
}
function Fs(e) {
  try {
    const t = new URL(e);
    return t.protocol === "http:" || t.protocol === "https:";
  } catch {
    return !1;
  }
}
function Nl(e) {
  return e.startsWith("site:");
}
function Wr(e) {
  return (e.startsWith("./") || e.startsWith("/")) && !Il(
    Mr(e)
  );
}
function Mr(e) {
  return e.replace(/^\.?\//, "");
}
function Il(e) {
  return (e.startsWith("site:") ? e.slice(5) : e).replace(/\\/g, "/").split("/").includes("..");
}
function jh(e, t) {
  const { slug: s, version: i } = qh(e);
  return i && i !== "latest" ? {
    resource: "url",
    url: `https://downloads.wordpress.org/${t === "plugins" ? "plugin" : "theme"}/${s}.${i}.zip`
  } : {
    resource: t === "plugins" ? "wordpress.org/plugins" : "wordpress.org/themes",
    slug: s
  };
}
function qh(e) {
  const t = e.lastIndexOf("@");
  if (t === -1)
    return { slug: e };
  const s = e.slice(t + 1);
  return Wh(s) ? {
    slug: e.slice(0, t),
    version: s
  } : { slug: e };
}
function Wh(e) {
  return e === "latest" || /^\d+\.\d+(?:\.\d+)?$/.test(e);
}
function At(e) {
  return e && typeof e == "object" && typeof e.filename == "string" && typeof e.content == "string";
}
function Br(e) {
  return e && typeof e == "object" && typeof e.directoryName == "string" && e.files && typeof e.files == "object";
}
function Hr(e) {
  return e && typeof e == "object" && typeof e.gitRepository == "string";
}
function fi(e) {
  const t = {};
  for (const [s, i] of Object.entries(e)) {
    const o = typeof i == "string" ? i : fi(i.files);
    Object.defineProperty(t, s, {
      value: o,
      enumerable: !0,
      configurable: !0,
      writable: !0
    });
  }
  return t;
}
class Mh extends Error {
  constructor(t, s, i) {
    super(t, i), this.name = "BlueprintFetchError", this.url = s;
  }
}
async function my(e, t = {}) {
  let s;
  try {
    const o = await (t.fetch || fetch)(e, {
      credentials: "omit"
    });
    if (!o.ok)
      throw new Error(`Failed to fetch blueprint from ${e}`);
    s = await o.arrayBuffer();
  } catch (i) {
    throw new Mh(
      `Blueprint file could not be resolved from ${e}: ${i instanceof Error ? i.message : String(i)}`,
      e,
      { cause: i }
    );
  }
  try {
    const i = new TextDecoder().decode(s);
    return JSON.parse(i), new Ru([
      new Su({
        "blueprint.json": i
      }),
      new Lu({
        baseUrl: e,
        corsProxy: t.corsProxy
      })
    ]);
  } catch (i) {
    if (await Vh(s))
      return Hh(s);
    throw new Error(
      `Blueprint file at ${e} is neither a valid JSON nor a ZIP file.`,
      { cause: i }
    );
  }
}
function Bh(e) {
  const t = e.map((i) => dt(i));
  if (t.some(
    (i) => Et(i) === "blueprint.json" && hr(i) === ""
  ))
    return "blueprint.json";
  const s = /* @__PURE__ */ new Set();
  for (const i of t) {
    const o = i.split("/")[0];
    o && o !== Et(i) && o !== "__MACOSX" && s.add(o);
  }
  if (s.size > 1)
    throw new Error(
      "ZIP contains multiple top-level directories. Bundle ZIPs must contain blueprint.json at the root or inside a single top-level directory."
    );
  if (s.size === 1) {
    const o = `${[...s][0]}/blueprint.json`;
    if (t.includes(o))
      return o;
  }
  throw new Error(
    "ZIP does not contain a blueprint.json. Place blueprint.json at the ZIP root or inside a single top-level directory."
  );
}
async function Hh(e) {
  const t = $s.fromArrayBuffer(e), s = await t.getAllFilePaths(), i = Bh(s), o = hr(i);
  return o === "" ? t : new Au(o, t);
}
async function Vh(e) {
  if (e.byteLength < 4)
    return !1;
  const t = new Uint8Array(e, 0, 4);
  return t[0] === 80 && t[1] === 75 && t[2] === 3 && t[3] === 4;
}
async function Fl(e, t = {}) {
  const s = await mr.create(e);
  if (s.getVersion() === 1) {
    const i = await Ns(
      e
    );
    return {
      wpVersion: i.versions.wp,
      phpVersion: i.versions.php,
      intl: i.features.intl,
      networking: i.features.networking,
      extraLibraries: i.extraLibraries,
      /*
       * Constants don't matter so much for temporary sites so let's
       * use an empty object here. We can't easily figure out which
       * additional constants were applied via playground.defineConstant()
       * at this stage anyway.
       *
       * This property is only relevant for stored sites to ensure they're
       * consistently applied across page reloads.
       */
      constants: {}
    };
  }
  return xl(
    s.getDeclaration(),
    t.siteMode
  );
}
async function zh(e, t = {}) {
  const s = typeof e == "string", i = await Yo(e);
  if (Zh(i))
    return Yh(
      s ? i : e,
      i,
      t
    );
  if (s)
    throw new Error(
      "Raw JSON input is only supported for Blueprint v2 declarations."
    );
  return Gh(e, i, t);
}
async function Yh(e, t, s) {
  const i = await Qm(t, {
    progress: s.progress,
    streamBundledFile: qt(e) ? (...o) => e.read(...o) : void 0,
    siteMode: s.siteMode,
    onBlueprintValidated: s.onBlueprintValidated
  });
  return {
    version: 2,
    declaration: t,
    compiled: i,
    run: i.run
  };
}
async function Gh(e, t, s) {
  const i = qt(e) ? e : t, o = await Ns(i, {
    ...s,
    onBlueprintValidated: s.onBlueprintValidated
  });
  return {
    version: 1,
    declaration: t,
    compiled: o,
    run: o.run
  };
}
function Zh(e) {
  return e.version === 2;
}
function hy() {
}
const Jh = [], Kh = "127.0.0.1", Xh = 4400;
class Qh {
  constructor(t) {
    this.options = t;
  }
  async bootPlayground(t, s) {
    var B;
    const {
      onBlueprintValidated: i,
      onBlueprintStepCompleted: o,
      corsProxy: n,
      gitAdditionalHeadersCallback: r,
      mounts: l,
      sapiName: p,
      scope: c,
      shouldInstallWordPress: f,
      sqliteDriverVersion: u,
      wordpressInstallMode: g,
      onClientConnected: w,
      pathAliases: O,
      disableProgressBar: m,
      detailedProgressCaptions: h
    } = this.options, _ = h ? (H) => s.setCaption(H) : () => {
    }, k = s.stage(0.5), v = s.stage(), R = this.options.blueprint || {}, E = Hn(
      t.contentWindow,
      t.ownerDocument.defaultView
    );
    _("Waiting for remote Playground runtime"), await E.isConnected(), _("Resolving Playground runtime versions"), m || s.pipe(E);
    const A = await Fl(R), C = A.intl ? ["intl"] : [];
    C.push(...this.options.extensions || []);
    let b, S;
    const P = () => {
      S && (clearInterval(S), S = void 0);
    }, $ = () => {
      S || !h || (S = setInterval(() => {
        if (!b || b.loaded >= b.total)
          return;
        const H = Date.now() - b.updatedAt;
        H < 5e3 || _(
          Wo(
            b.label,
            b.loaded,
            b.total,
            H
          )
        );
      }, 1e3));
    };
    await E.onDownloadProgress((H) => {
      v.loadingListener(H);
      const {
        loaded: U,
        total: Y,
        fileName: J,
        fileLoaded: M = U,
        fileTotal: te = Y
      } = H.detail || {};
      if (typeof U != "number" || typeof Y != "number" || Y <= 0) {
        _(Mo(J));
        return;
      }
      if (b = {
        label: Mo(J),
        loaded: M,
        total: te,
        updatedAt: Date.now()
      }, U >= Y) {
        P(), _(
          ty(b.label, Y)
        );
        return;
      }
      $(), _(
        Wo(
          b.label,
          b.loaded,
          b.total,
          0
        )
      );
    }), h && await E.addEventListener("boot.progress", (H) => {
      _(H.caption);
    });
    const L = !qt(R) && ((B = R.preferredVersions) == null ? void 0 : B.wp) === !1, x = g ?? (L ? "do-not-attempt-installing" : f === !1 ? "install-from-existing-files-if-needed" : "download-and-install");
    if (L && (f === !0 || g !== void 0 && g !== "do-not-attempt-installing"))
      throw new Error(
        "Conflicting options: WordPress was requested, but the Blueprint sets `preferredVersions.wp: false`. Pick one."
      );
    try {
      _("Booting PHP and WordPress"), await E.boot({
        mounts: l,
        sapiName: p,
        scope: c ?? Math.random().toFixed(16),
        wordpressInstallMode: x,
        phpVersion: A.phpVersion,
        wpVersion: A.wpVersion,
        extensions: C,
        withNetworking: A.networking,
        corsProxyUrl: n,
        sqliteDriverVersion: u,
        pathAliases: O
      }), _("Waiting for WordPress to be ready"), await E.isReady(), v.finish();
    } finally {
      P();
    }
    if (_("Connecting Playground client"), Zo(ue, E), w == null || w(E), _("Preparing blueprint steps"), (await mr.create(R)).getVersion() === 1) {
      const H = await Ns(R, {
        progress: k,
        onStepCompleted: o,
        onBlueprintValidated: i,
        corsProxy: n,
        gitAdditionalHeadersCallback: r
      });
      _("Running blueprint steps"), await Rm(H, E);
    }
    const q = parseFloat(A.wpVersion), N = Number.isFinite(q) && q < 5.1;
    if (A.networking && !N && x === "download-and-install")
      if (await ey(R))
        await E.prefetchUpdateChecks();
      else {
        const H = () => E.prefetchUpdateChecks();
        globalThis.requestIdleCallback ? globalThis.requestIdleCallback(H, { timeout: 5e3 }) : setTimeout(H, 0);
      }
    return E;
  }
}
async function ey(e) {
  if (!e)
    return !1;
  let t;
  if (qt(e)) {
    const n = await (await e.read("/blueprint.json")).text();
    e = JSON.parse(n), t = e;
  } else
    t = e;
  const s = t.landingPage;
  if (!s)
    return !1;
  let i;
  try {
    i = new URL(s, "http://playground.local").pathname;
  } catch {
    return !1;
  }
  return i === "/wp-admin" || i.startsWith("/wp-admin/");
}
function Wo(e, t, s, i) {
  const o = i >= 5e3 ? ` – stalled ${Math.floor(i / 1e3)}s, retrying` : "";
  return `${e} (${ds(t)} of ${ds(s)})${o}`;
}
function Mo(e) {
  return e ? e.endsWith(".wasm") || e.startsWith("php_") ? "Downloading PHP runtime" : e.includes("wordpress") ? "Downloading WordPress" : e.includes("sqlite") ? "Downloading SQLite integration" : `Downloading ${e}` : "Downloading files";
}
function ty(e, t) {
  return e === "Downloading PHP runtime" ? `Compiling PHP runtime (${ds(t)})` : `Preparing downloaded files (${ds(t)})`;
}
class ry {
  constructor(t) {
    this.options = t;
  }
  async bootPlayground(t, s) {
    const {
      onBlueprintValidated: i,
      onBlueprintStepCompleted: o,
      onClientConnected: n,
      corsProxy: r,
      gitAdditionalHeadersCallback: l,
      mounts: p,
      sapiName: c,
      scope: f,
      shouldInstallWordPress: u,
      sqliteDriverVersion: g,
      wordpressInstallMode: w,
      pathAliases: O,
      disableProgressBar: m
    } = this.options, h = s.stage(0.5), _ = s.stage(), k = this.options.blueprint || { version: 2 }, v = Hn(
      t.contentWindow,
      t.ownerDocument.defaultView
    );
    await v.isConnected(), m || s.pipe(v), await v.onDownloadProgress(_.loadingListener);
    const R = sy({
      shouldInstallWordPress: u,
      wordpressInstallMode: w
    }), E = await zh(k, {
      progress: h,
      onStepCompleted: o,
      onBlueprintValidated: i,
      corsProxy: r,
      gitAdditionalHeadersCallback: l,
      siteMode: Bo(R) ? "apply-to-existing-site" : "create-new-site"
    }), A = E.version === 2 ? E.compiled.runtime : await Fl(E.declaration), C = E.version === 2 && E.declaration.wordpressVersion === "none" ? "do-not-attempt-installing" : R, b = Bo(
      C
    ), S = E.version === 2 && C === "download-and-install" ? await eh(
      E.declaration,
      {
        progress: _,
        corsProxy: r,
        gitAdditionalHeadersCallback: l,
        streamBundledFile: qt(k) ? ($) => k.read($) : void 0
      }
    ) : void 0, P = A.intl ? ["intl"] : [];
    return P.push(...this.options.extensions || []), await v.boot({
      mounts: p,
      sapiName: c,
      scope: f ?? Math.random().toFixed(16),
      wordpressInstallMode: C,
      blueprint: E.version === 2 && b && typeof E.declaration.wordpressVersion == "object" && E.declaration.wordpressVersion !== null && "min" in E.declaration.wordpressVersion ? {
        version: 2,
        wordpressVersion: E.declaration.wordpressVersion
      } : void 0,
      phpVersion: A.phpVersion,
      wpVersion: A.wpVersion,
      wordPressZip: S,
      extensions: P,
      withNetworking: A.networking,
      corsProxyUrl: r,
      sqliteDriverVersion: g,
      pathAliases: O
    }), await v.isReady(), _.finish(), Zo(ue, v), n == null || n(v), await E.run(v), v;
  }
}
function sy({
  shouldInstallWordPress: e,
  wordpressInstallMode: t
}) {
  return t ?? (e === !1 ? "install-from-existing-files-if-needed" : "download-and-install");
}
function Bo(e) {
  return e === "install-from-existing-files" || e === "install-from-existing-files-if-needed";
}
const Ho = "with-admin-transitions";
async function yy(e) {
  const {
    iframe: t,
    progressTracker: s = new Ts(),
    disableProgressBar: i
  } = e;
  let { remoteUrl: o } = e;
  oy(o), Ul(t);
  const n = await ny(
    e.blueprint
  ), r = new URL(o, Ds);
  r.searchParams.delete("blueprints-runner"), o = ly(r.toString(), {
    progressbar: !i,
    [Ho]: new URL(
      globalThis.location.href
    ).searchParams.has(Ho) ? "1" : void 0
  });
  const { detailedProgressCaptions: l } = e;
  s.setCaption(
    l ? "Loading Playground iframe" : "Preparing WordPress"
  ), await Dl(t, o), l && s.setCaption("Connecting to Playground runtime");
  const c = await (n ? new ry(e) : new Qh(e)).bootPlayground(t, s);
  return s.finish(), c;
}
async function gy(e) {
  const { iframe: t, apiUrl: s } = e;
  ay(s), Ul(t);
  const i = new URL(s, Ds).toString();
  await Dl(t, i);
  const o = Hn(
    t.contentWindow,
    t.ownerDocument.defaultView
  );
  return await o.isConnected(), await o.isReady(), o;
}
function Dl(e, t) {
  return new Promise((s) => {
    e.addEventListener("load", () => s(), { once: !0 }), e.src = t;
  });
}
async function ny(e) {
  return e ? qt(e) ? (await mr.create(e)).getVersion() === 2 : "version" in e && e.version === 2 : !1;
}
function Ul(e) {
  var t, s;
  (t = e.sandbox) != null && t.length && !((s = e.sandbox) != null && s.contains("allow-storage-access-by-user-activation")) && e.sandbox.add("allow-storage-access-by-user-activation");
}
const jl = "https://playground.wordpress.net", iy = `http://${Kh}:${Xh}`, Vo = [
  jl,
  iy,
  // An older origin that's still used by some plugins.
  "https://wasm.wordpress.net",
  // Allow hosting remote from same origin
  location.origin,
  // Allow hosting remote from the same origin as the client library.
  new URL(import.meta.url).origin,
  "http://localhost",
  "http://localhost:5400",
  "https://localhost",
  "http://127.0.0.1",
  "http://127.0.0.1:5400",
  "https://127.0.0.1",
  ...Jh
], Ds = jl;
function oy(e) {
  ql(e, "/remote.html");
}
function ay(e) {
  ql(e, "/api.html");
}
function ql(e, t) {
  const s = new URL(e, Ds), i = t === "/api.html" ? "API" : "remote";
  if (!(Vo.includes(s.origin) && s.pathname === t))
    throw new Error(
      `Invalid ${i} URL: ${s}. Expected ${i} URL to have a path of "${t}" based on one of the following origins:
 ${Vo.join(
        `
`
      )}`
    );
}
function ly(e, t) {
  const s = new URL(e, Ds), i = new URLSearchParams(s.search);
  for (const [o, n] of Object.entries(t))
    if (n != null && n !== !1)
      if (Array.isArray(n))
        for (const r of n)
          i.append(o, r.toString());
      else
        i.set(o, n.toString());
  return s.search = i.toString(), s.toString();
}
export {
  hy as $,
  qt as A,
  Mh as B,
  Om as C,
  rm as D,
  Ud as E,
  Dd as F,
  To as G,
  Ce as H,
  bl as I,
  Ur as J,
  _d as K,
  jn as L,
  sm as M,
  eh as N,
  my as O,
  bp as P,
  Fl as Q,
  cn as R,
  Un as S,
  An as T,
  jd as U,
  Rm as V,
  md as W,
  hd as X,
  gd as Y,
  nm as Z,
  cy as _,
  zu as a,
  pm as a0,
  fl as a1,
  gy as a2,
  yy as a3,
  yl as a4,
  Ld as a5,
  vl as a6,
  uy as a7,
  dl as a8,
  ri as a9,
  qd as aa,
  im as ab,
  mr as b,
  Pm as c,
  fy as d,
  al as e,
  ll as f,
  dy as g,
  ti as h,
  Ns as i,
  zh as j,
  Qm as k,
  Fd as l,
  ih as m,
  Cs as n,
  ul as o,
  ml as p,
  ei as q,
  Id as r,
  Jd as s,
  xm as t,
  Cn as u,
  hl as v,
  Vd as w,
  Wd as x,
  Kd as y,
  tm as z
};
