var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value2) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
var __publicField = (obj, key, value2) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value2);
import { Scope, TFolder, Setting, Modal, PluginSettingTab, Notice, Plugin as Plugin$1 } from "obsidian";
var commonjsGlobal$1 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
function getAugmentedNamespace(n2) {
  if (n2.__esModule) return n2;
  var f = n2.default;
  if (typeof f == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        return Reflect.construct(f, arguments, this.constructor);
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n2).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n2, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n2[k];
      }
    });
  });
  return a;
}
var lib$1 = {};
Object.defineProperty(lib$1, "__esModule", { value: true });
let LuxonError$1 = class LuxonError extends Error {
};
let InvalidDateTimeError$1 = class InvalidDateTimeError extends LuxonError$1 {
  constructor(reason) {
    super(`Invalid DateTime: ${reason.toMessage()}`);
  }
};
let InvalidIntervalError$1 = class InvalidIntervalError extends LuxonError$1 {
  constructor(reason) {
    super(`Invalid Interval: ${reason.toMessage()}`);
  }
};
let InvalidDurationError$1 = class InvalidDurationError extends LuxonError$1 {
  constructor(reason) {
    super(`Invalid Duration: ${reason.toMessage()}`);
  }
};
let ConflictingSpecificationError$1 = class ConflictingSpecificationError extends LuxonError$1 {
};
let InvalidUnitError$1 = class InvalidUnitError extends LuxonError$1 {
  constructor(unit) {
    super(`Invalid unit ${unit}`);
  }
};
let InvalidArgumentError$1 = class InvalidArgumentError extends LuxonError$1 {
};
let ZoneIsAbstractError$1 = class ZoneIsAbstractError extends LuxonError$1 {
  constructor() {
    super("Zone is an abstract class");
  }
};
const n$1 = "numeric", s$2 = "short", l$1 = "long";
const DATE_SHORT$1 = {
  year: n$1,
  month: n$1,
  day: n$1
};
const DATE_MED$1 = {
  year: n$1,
  month: s$2,
  day: n$1
};
const DATE_MED_WITH_WEEKDAY$1 = {
  year: n$1,
  month: s$2,
  day: n$1,
  weekday: s$2
};
const DATE_FULL$1 = {
  year: n$1,
  month: l$1,
  day: n$1
};
const DATE_HUGE$1 = {
  year: n$1,
  month: l$1,
  day: n$1,
  weekday: l$1
};
const TIME_SIMPLE$1 = {
  hour: n$1,
  minute: n$1
};
const TIME_WITH_SECONDS$1 = {
  hour: n$1,
  minute: n$1,
  second: n$1
};
const TIME_WITH_SHORT_OFFSET$1 = {
  hour: n$1,
  minute: n$1,
  second: n$1,
  timeZoneName: s$2
};
const TIME_WITH_LONG_OFFSET$1 = {
  hour: n$1,
  minute: n$1,
  second: n$1,
  timeZoneName: l$1
};
const TIME_24_SIMPLE$1 = {
  hour: n$1,
  minute: n$1,
  hourCycle: "h23"
};
const TIME_24_WITH_SECONDS$1 = {
  hour: n$1,
  minute: n$1,
  second: n$1,
  hourCycle: "h23"
};
const TIME_24_WITH_SHORT_OFFSET$1 = {
  hour: n$1,
  minute: n$1,
  second: n$1,
  hourCycle: "h23",
  timeZoneName: s$2
};
const TIME_24_WITH_LONG_OFFSET$1 = {
  hour: n$1,
  minute: n$1,
  second: n$1,
  hourCycle: "h23",
  timeZoneName: l$1
};
const DATETIME_SHORT$1 = {
  year: n$1,
  month: n$1,
  day: n$1,
  hour: n$1,
  minute: n$1
};
const DATETIME_SHORT_WITH_SECONDS$1 = {
  year: n$1,
  month: n$1,
  day: n$1,
  hour: n$1,
  minute: n$1,
  second: n$1
};
const DATETIME_MED$1 = {
  year: n$1,
  month: s$2,
  day: n$1,
  hour: n$1,
  minute: n$1
};
const DATETIME_MED_WITH_SECONDS$1 = {
  year: n$1,
  month: s$2,
  day: n$1,
  hour: n$1,
  minute: n$1,
  second: n$1
};
const DATETIME_MED_WITH_WEEKDAY$1 = {
  year: n$1,
  month: s$2,
  day: n$1,
  weekday: s$2,
  hour: n$1,
  minute: n$1
};
const DATETIME_FULL$1 = {
  year: n$1,
  month: l$1,
  day: n$1,
  hour: n$1,
  minute: n$1,
  timeZoneName: s$2
};
const DATETIME_FULL_WITH_SECONDS$1 = {
  year: n$1,
  month: l$1,
  day: n$1,
  hour: n$1,
  minute: n$1,
  second: n$1,
  timeZoneName: s$2
};
const DATETIME_HUGE$1 = {
  year: n$1,
  month: l$1,
  day: n$1,
  weekday: l$1,
  hour: n$1,
  minute: n$1,
  timeZoneName: l$1
};
const DATETIME_HUGE_WITH_SECONDS$1 = {
  year: n$1,
  month: l$1,
  day: n$1,
  weekday: l$1,
  hour: n$1,
  minute: n$1,
  second: n$1,
  timeZoneName: l$1
};
let Zone$1 = class Zone {
  /**
   * The type of zone
   * @abstract
   * @type {string}
   */
  get type() {
    throw new ZoneIsAbstractError$1();
  }
  /**
   * The name of this zone.
   * @abstract
   * @type {string}
   */
  get name() {
    throw new ZoneIsAbstractError$1();
  }
  get ianaName() {
    return this.name;
  }
  /**
   * Returns whether the offset is known to be fixed for the whole year.
   * @abstract
   * @type {boolean}
   */
  get isUniversal() {
    throw new ZoneIsAbstractError$1();
  }
  /**
   * Returns the offset's common name (such as EST) at the specified timestamp
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to get the name
   * @param {Object} opts - Options to affect the format
   * @param {string} opts.format - What style of offset to return. Accepts 'long' or 'short'.
   * @param {string} opts.locale - What locale to return the offset name in.
   * @return {string}
   */
  offsetName(ts, opts) {
    throw new ZoneIsAbstractError$1();
  }
  /**
   * Returns the offset's value as a string
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to get the offset
   * @param {string} format - What style of offset to return.
   *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
   * @return {string}
   */
  formatOffset(ts, format2) {
    throw new ZoneIsAbstractError$1();
  }
  /**
   * Return the offset in minutes for this zone at the specified timestamp.
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to compute the offset
   * @return {number}
   */
  offset(ts) {
    throw new ZoneIsAbstractError$1();
  }
  /**
   * Return whether this Zone is equal to another zone
   * @abstract
   * @param {Zone} otherZone - the zone to compare
   * @return {boolean}
   */
  equals(otherZone) {
    throw new ZoneIsAbstractError$1();
  }
  /**
   * Return whether this Zone is valid.
   * @abstract
   * @type {boolean}
   */
  get isValid() {
    throw new ZoneIsAbstractError$1();
  }
};
let singleton$1$1 = null;
let SystemZone$1 = class SystemZone extends Zone$1 {
  /**
   * Get a singleton instance of the local zone
   * @return {SystemZone}
   */
  static get instance() {
    if (singleton$1$1 === null) {
      singleton$1$1 = new SystemZone();
    }
    return singleton$1$1;
  }
  /** @override **/
  get type() {
    return "system";
  }
  /** @override **/
  get name() {
    return new Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  /** @override **/
  get isUniversal() {
    return false;
  }
  /** @override **/
  offsetName(ts, { format: format2, locale }) {
    return parseZoneInfo$1(ts, format2, locale);
  }
  /** @override **/
  formatOffset(ts, format2) {
    return formatOffset$1(this.offset(ts), format2);
  }
  /** @override **/
  offset(ts) {
    return -new Date(ts).getTimezoneOffset();
  }
  /** @override **/
  equals(otherZone) {
    return otherZone.type === "system";
  }
  /** @override **/
  get isValid() {
    return true;
  }
};
let dtfCache$1 = {};
function makeDTF$1(zone) {
  if (!dtfCache$1[zone]) {
    dtfCache$1[zone] = new Intl.DateTimeFormat("en-US", {
      hour12: false,
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      era: "short"
    });
  }
  return dtfCache$1[zone];
}
const typeToPos$1 = {
  year: 0,
  month: 1,
  day: 2,
  era: 3,
  hour: 4,
  minute: 5,
  second: 6
};
function hackyOffset$1(dtf, date) {
  const formatted = dtf.format(date).replace(/\u200E/g, ""), parsed = /(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(formatted), [, fMonth, fDay, fYear, fadOrBc, fHour, fMinute, fSecond] = parsed;
  return [fYear, fMonth, fDay, fadOrBc, fHour, fMinute, fSecond];
}
function partsOffset$1(dtf, date) {
  const formatted = dtf.formatToParts(date);
  const filled = [];
  for (let i = 0; i < formatted.length; i++) {
    const { type, value: value2 } = formatted[i];
    const pos = typeToPos$1[type];
    if (type === "era") {
      filled[pos] = value2;
    } else if (!isUndefined$2(pos)) {
      filled[pos] = parseInt(value2, 10);
    }
  }
  return filled;
}
let ianaZoneCache$1 = {};
let IANAZone$1 = class IANAZone extends Zone$1 {
  /**
   * @param {string} name - Zone name
   * @return {IANAZone}
   */
  static create(name2) {
    if (!ianaZoneCache$1[name2]) {
      ianaZoneCache$1[name2] = new IANAZone(name2);
    }
    return ianaZoneCache$1[name2];
  }
  /**
   * Reset local caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCache() {
    ianaZoneCache$1 = {};
    dtfCache$1 = {};
  }
  /**
   * Returns whether the provided string is a valid specifier. This only checks the string's format, not that the specifier identifies a known zone; see isValidZone for that.
   * @param {string} s - The string to check validity on
   * @example IANAZone.isValidSpecifier("America/New_York") //=> true
   * @example IANAZone.isValidSpecifier("Sport~~blorp") //=> false
   * @deprecated This method returns false for some valid IANA names. Use isValidZone instead.
   * @return {boolean}
   */
  static isValidSpecifier(s2) {
    return this.isValidZone(s2);
  }
  /**
   * Returns whether the provided string identifies a real zone
   * @param {string} zone - The string to check
   * @example IANAZone.isValidZone("America/New_York") //=> true
   * @example IANAZone.isValidZone("Fantasia/Castle") //=> false
   * @example IANAZone.isValidZone("Sport~~blorp") //=> false
   * @return {boolean}
   */
  static isValidZone(zone) {
    if (!zone) {
      return false;
    }
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: zone }).format();
      return true;
    } catch (e) {
      return false;
    }
  }
  constructor(name2) {
    super();
    this.zoneName = name2;
    this.valid = IANAZone.isValidZone(name2);
  }
  /** @override **/
  get type() {
    return "iana";
  }
  /** @override **/
  get name() {
    return this.zoneName;
  }
  /** @override **/
  get isUniversal() {
    return false;
  }
  /** @override **/
  offsetName(ts, { format: format2, locale }) {
    return parseZoneInfo$1(ts, format2, locale, this.name);
  }
  /** @override **/
  formatOffset(ts, format2) {
    return formatOffset$1(this.offset(ts), format2);
  }
  /** @override **/
  offset(ts) {
    const date = new Date(ts);
    if (isNaN(date)) return NaN;
    const dtf = makeDTF$1(this.name);
    let [year, month, day, adOrBc, hour, minute, second] = dtf.formatToParts ? partsOffset$1(dtf, date) : hackyOffset$1(dtf, date);
    if (adOrBc === "BC") {
      year = -Math.abs(year) + 1;
    }
    const adjustedHour = hour === 24 ? 0 : hour;
    const asUTC = objToLocalTS$1({
      year,
      month,
      day,
      hour: adjustedHour,
      minute,
      second,
      millisecond: 0
    });
    let asTS = +date;
    const over = asTS % 1e3;
    asTS -= over >= 0 ? over : 1e3 + over;
    return (asUTC - asTS) / (60 * 1e3);
  }
  /** @override **/
  equals(otherZone) {
    return otherZone.type === "iana" && otherZone.name === this.name;
  }
  /** @override **/
  get isValid() {
    return this.valid;
  }
};
let intlLFCache$1 = {};
function getCachedLF$1(locString, opts = {}) {
  const key = JSON.stringify([locString, opts]);
  let dtf = intlLFCache$1[key];
  if (!dtf) {
    dtf = new Intl.ListFormat(locString, opts);
    intlLFCache$1[key] = dtf;
  }
  return dtf;
}
let intlDTCache$1 = {};
function getCachedDTF$1(locString, opts = {}) {
  const key = JSON.stringify([locString, opts]);
  let dtf = intlDTCache$1[key];
  if (!dtf) {
    dtf = new Intl.DateTimeFormat(locString, opts);
    intlDTCache$1[key] = dtf;
  }
  return dtf;
}
let intlNumCache$1 = {};
function getCachedINF$1(locString, opts = {}) {
  const key = JSON.stringify([locString, opts]);
  let inf = intlNumCache$1[key];
  if (!inf) {
    inf = new Intl.NumberFormat(locString, opts);
    intlNumCache$1[key] = inf;
  }
  return inf;
}
let intlRelCache$1 = {};
function getCachedRTF$1(locString, opts = {}) {
  const { base: base2, ...cacheKeyOpts } = opts;
  const key = JSON.stringify([locString, cacheKeyOpts]);
  let inf = intlRelCache$1[key];
  if (!inf) {
    inf = new Intl.RelativeTimeFormat(locString, opts);
    intlRelCache$1[key] = inf;
  }
  return inf;
}
let sysLocaleCache$1 = null;
function systemLocale$1() {
  if (sysLocaleCache$1) {
    return sysLocaleCache$1;
  } else {
    sysLocaleCache$1 = new Intl.DateTimeFormat().resolvedOptions().locale;
    return sysLocaleCache$1;
  }
}
function parseLocaleString$1(localeStr) {
  const xIndex = localeStr.indexOf("-x-");
  if (xIndex !== -1) {
    localeStr = localeStr.substring(0, xIndex);
  }
  const uIndex = localeStr.indexOf("-u-");
  if (uIndex === -1) {
    return [localeStr];
  } else {
    let options2;
    let selectedStr;
    try {
      options2 = getCachedDTF$1(localeStr).resolvedOptions();
      selectedStr = localeStr;
    } catch (e) {
      const smaller = localeStr.substring(0, uIndex);
      options2 = getCachedDTF$1(smaller).resolvedOptions();
      selectedStr = smaller;
    }
    const { numberingSystem, calendar } = options2;
    return [selectedStr, numberingSystem, calendar];
  }
}
function intlConfigString$1(localeStr, numberingSystem, outputCalendar) {
  if (outputCalendar || numberingSystem) {
    if (!localeStr.includes("-u-")) {
      localeStr += "-u";
    }
    if (outputCalendar) {
      localeStr += `-ca-${outputCalendar}`;
    }
    if (numberingSystem) {
      localeStr += `-nu-${numberingSystem}`;
    }
    return localeStr;
  } else {
    return localeStr;
  }
}
function mapMonths$1(f) {
  const ms = [];
  for (let i = 1; i <= 12; i++) {
    const dt = DateTime$1.utc(2009, i, 1);
    ms.push(f(dt));
  }
  return ms;
}
function mapWeekdays$1(f) {
  const ms = [];
  for (let i = 1; i <= 7; i++) {
    const dt = DateTime$1.utc(2016, 11, 13 + i);
    ms.push(f(dt));
  }
  return ms;
}
function listStuff$1(loc, length2, englishFn, intlFn) {
  const mode2 = loc.listingMode();
  if (mode2 === "error") {
    return null;
  } else if (mode2 === "en") {
    return englishFn(length2);
  } else {
    return intlFn(length2);
  }
}
function supportsFastNumbers$1(loc) {
  if (loc.numberingSystem && loc.numberingSystem !== "latn") {
    return false;
  } else {
    return loc.numberingSystem === "latn" || !loc.locale || loc.locale.startsWith("en") || new Intl.DateTimeFormat(loc.intl).resolvedOptions().numberingSystem === "latn";
  }
}
let PolyNumberFormatter$1 = class PolyNumberFormatter {
  constructor(intl, forceSimple, opts) {
    this.padTo = opts.padTo || 0;
    this.floor = opts.floor || false;
    const { padTo, floor: floor2, ...otherOpts } = opts;
    if (!forceSimple || Object.keys(otherOpts).length > 0) {
      const intlOpts = { useGrouping: false, ...opts };
      if (opts.padTo > 0) intlOpts.minimumIntegerDigits = opts.padTo;
      this.inf = getCachedINF$1(intl, intlOpts);
    }
  }
  format(i) {
    if (this.inf) {
      const fixed = this.floor ? Math.floor(i) : i;
      return this.inf.format(fixed);
    } else {
      const fixed = this.floor ? Math.floor(i) : roundTo$1(i, 3);
      return padStart$1(fixed, this.padTo);
    }
  }
};
let PolyDateFormatter$1 = class PolyDateFormatter {
  constructor(dt, intl, opts) {
    this.opts = opts;
    this.originalZone = void 0;
    let z = void 0;
    if (this.opts.timeZone) {
      this.dt = dt;
    } else if (dt.zone.type === "fixed") {
      const gmtOffset = -1 * (dt.offset / 60);
      const offsetZ = gmtOffset >= 0 ? `Etc/GMT+${gmtOffset}` : `Etc/GMT${gmtOffset}`;
      if (dt.offset !== 0 && IANAZone$1.create(offsetZ).valid) {
        z = offsetZ;
        this.dt = dt;
      } else {
        z = "UTC";
        this.dt = dt.offset === 0 ? dt : dt.setZone("UTC").plus({ minutes: dt.offset });
        this.originalZone = dt.zone;
      }
    } else if (dt.zone.type === "system") {
      this.dt = dt;
    } else if (dt.zone.type === "iana") {
      this.dt = dt;
      z = dt.zone.name;
    } else {
      z = "UTC";
      this.dt = dt.setZone("UTC").plus({ minutes: dt.offset });
      this.originalZone = dt.zone;
    }
    const intlOpts = { ...this.opts };
    intlOpts.timeZone = intlOpts.timeZone || z;
    this.dtf = getCachedDTF$1(intl, intlOpts);
  }
  format() {
    if (this.originalZone) {
      return this.formatToParts().map(({ value: value2 }) => value2).join("");
    }
    return this.dtf.format(this.dt.toJSDate());
  }
  formatToParts() {
    const parts = this.dtf.formatToParts(this.dt.toJSDate());
    if (this.originalZone) {
      return parts.map((part) => {
        if (part.type === "timeZoneName") {
          const offsetName = this.originalZone.offsetName(this.dt.ts, {
            locale: this.dt.locale,
            format: this.opts.timeZoneName
          });
          return {
            ...part,
            value: offsetName
          };
        } else {
          return part;
        }
      });
    }
    return parts;
  }
  resolvedOptions() {
    return this.dtf.resolvedOptions();
  }
};
let PolyRelFormatter$1 = class PolyRelFormatter {
  constructor(intl, isEnglish, opts) {
    this.opts = { style: "long", ...opts };
    if (!isEnglish && hasRelative$1()) {
      this.rtf = getCachedRTF$1(intl, opts);
    }
  }
  format(count, unit) {
    if (this.rtf) {
      return this.rtf.format(count, unit);
    } else {
      return formatRelativeTime$1(unit, count, this.opts.numeric, this.opts.style !== "long");
    }
  }
  formatToParts(count, unit) {
    if (this.rtf) {
      return this.rtf.formatToParts(count, unit);
    } else {
      return [];
    }
  }
};
let Locale$1 = class Locale {
  static fromOpts(opts) {
    return Locale.create(opts.locale, opts.numberingSystem, opts.outputCalendar, opts.defaultToEN);
  }
  static create(locale, numberingSystem, outputCalendar, defaultToEN = false) {
    const specifiedLocale = locale || Settings$1.defaultLocale;
    const localeR = specifiedLocale || (defaultToEN ? "en-US" : systemLocale$1());
    const numberingSystemR = numberingSystem || Settings$1.defaultNumberingSystem;
    const outputCalendarR = outputCalendar || Settings$1.defaultOutputCalendar;
    return new Locale(localeR, numberingSystemR, outputCalendarR, specifiedLocale);
  }
  static resetCache() {
    sysLocaleCache$1 = null;
    intlDTCache$1 = {};
    intlNumCache$1 = {};
    intlRelCache$1 = {};
  }
  static fromObject({ locale, numberingSystem, outputCalendar } = {}) {
    return Locale.create(locale, numberingSystem, outputCalendar);
  }
  constructor(locale, numbering, outputCalendar, specifiedLocale) {
    const [parsedLocale, parsedNumberingSystem, parsedOutputCalendar] = parseLocaleString$1(locale);
    this.locale = parsedLocale;
    this.numberingSystem = numbering || parsedNumberingSystem || null;
    this.outputCalendar = outputCalendar || parsedOutputCalendar || null;
    this.intl = intlConfigString$1(this.locale, this.numberingSystem, this.outputCalendar);
    this.weekdaysCache = { format: {}, standalone: {} };
    this.monthsCache = { format: {}, standalone: {} };
    this.meridiemCache = null;
    this.eraCache = {};
    this.specifiedLocale = specifiedLocale;
    this.fastNumbersCached = null;
  }
  get fastNumbers() {
    if (this.fastNumbersCached == null) {
      this.fastNumbersCached = supportsFastNumbers$1(this);
    }
    return this.fastNumbersCached;
  }
  listingMode() {
    const isActuallyEn = this.isEnglish();
    const hasNoWeirdness = (this.numberingSystem === null || this.numberingSystem === "latn") && (this.outputCalendar === null || this.outputCalendar === "gregory");
    return isActuallyEn && hasNoWeirdness ? "en" : "intl";
  }
  clone(alts) {
    if (!alts || Object.getOwnPropertyNames(alts).length === 0) {
      return this;
    } else {
      return Locale.create(
        alts.locale || this.specifiedLocale,
        alts.numberingSystem || this.numberingSystem,
        alts.outputCalendar || this.outputCalendar,
        alts.defaultToEN || false
      );
    }
  }
  redefaultToEN(alts = {}) {
    return this.clone({ ...alts, defaultToEN: true });
  }
  redefaultToSystem(alts = {}) {
    return this.clone({ ...alts, defaultToEN: false });
  }
  months(length2, format2 = false) {
    return listStuff$1(this, length2, months$1, () => {
      const intl = format2 ? { month: length2, day: "numeric" } : { month: length2 }, formatStr = format2 ? "format" : "standalone";
      if (!this.monthsCache[formatStr][length2]) {
        this.monthsCache[formatStr][length2] = mapMonths$1((dt) => this.extract(dt, intl, "month"));
      }
      return this.monthsCache[formatStr][length2];
    });
  }
  weekdays(length2, format2 = false) {
    return listStuff$1(this, length2, weekdays$1, () => {
      const intl = format2 ? { weekday: length2, year: "numeric", month: "long", day: "numeric" } : { weekday: length2 }, formatStr = format2 ? "format" : "standalone";
      if (!this.weekdaysCache[formatStr][length2]) {
        this.weekdaysCache[formatStr][length2] = mapWeekdays$1(
          (dt) => this.extract(dt, intl, "weekday")
        );
      }
      return this.weekdaysCache[formatStr][length2];
    });
  }
  meridiems() {
    return listStuff$1(
      this,
      void 0,
      () => meridiems$1,
      () => {
        if (!this.meridiemCache) {
          const intl = { hour: "numeric", hourCycle: "h12" };
          this.meridiemCache = [DateTime$1.utc(2016, 11, 13, 9), DateTime$1.utc(2016, 11, 13, 19)].map(
            (dt) => this.extract(dt, intl, "dayperiod")
          );
        }
        return this.meridiemCache;
      }
    );
  }
  eras(length2) {
    return listStuff$1(this, length2, eras$1, () => {
      const intl = { era: length2 };
      if (!this.eraCache[length2]) {
        this.eraCache[length2] = [DateTime$1.utc(-40, 1, 1), DateTime$1.utc(2017, 1, 1)].map(
          (dt) => this.extract(dt, intl, "era")
        );
      }
      return this.eraCache[length2];
    });
  }
  extract(dt, intlOpts, field) {
    const df = this.dtFormatter(dt, intlOpts), results = df.formatToParts(), matching = results.find((m) => m.type.toLowerCase() === field);
    return matching ? matching.value : null;
  }
  numberFormatter(opts = {}) {
    return new PolyNumberFormatter$1(this.intl, opts.forceSimple || this.fastNumbers, opts);
  }
  dtFormatter(dt, intlOpts = {}) {
    return new PolyDateFormatter$1(dt, this.intl, intlOpts);
  }
  relFormatter(opts = {}) {
    return new PolyRelFormatter$1(this.intl, this.isEnglish(), opts);
  }
  listFormatter(opts = {}) {
    return getCachedLF$1(this.intl, opts);
  }
  isEnglish() {
    return this.locale === "en" || this.locale.toLowerCase() === "en-us" || new Intl.DateTimeFormat(this.intl).resolvedOptions().locale.startsWith("en-us");
  }
  equals(other) {
    return this.locale === other.locale && this.numberingSystem === other.numberingSystem && this.outputCalendar === other.outputCalendar;
  }
};
let singleton$2 = null;
let FixedOffsetZone$1 = class FixedOffsetZone extends Zone$1 {
  /**
   * Get a singleton instance of UTC
   * @return {FixedOffsetZone}
   */
  static get utcInstance() {
    if (singleton$2 === null) {
      singleton$2 = new FixedOffsetZone(0);
    }
    return singleton$2;
  }
  /**
   * Get an instance with a specified offset
   * @param {number} offset - The offset in minutes
   * @return {FixedOffsetZone}
   */
  static instance(offset2) {
    return offset2 === 0 ? FixedOffsetZone.utcInstance : new FixedOffsetZone(offset2);
  }
  /**
   * Get an instance of FixedOffsetZone from a UTC offset string, like "UTC+6"
   * @param {string} s - The offset string to parse
   * @example FixedOffsetZone.parseSpecifier("UTC+6")
   * @example FixedOffsetZone.parseSpecifier("UTC+06")
   * @example FixedOffsetZone.parseSpecifier("UTC-6:00")
   * @return {FixedOffsetZone}
   */
  static parseSpecifier(s2) {
    if (s2) {
      const r = s2.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);
      if (r) {
        return new FixedOffsetZone(signedOffset$1(r[1], r[2]));
      }
    }
    return null;
  }
  constructor(offset2) {
    super();
    this.fixed = offset2;
  }
  /** @override **/
  get type() {
    return "fixed";
  }
  /** @override **/
  get name() {
    return this.fixed === 0 ? "UTC" : `UTC${formatOffset$1(this.fixed, "narrow")}`;
  }
  get ianaName() {
    if (this.fixed === 0) {
      return "Etc/UTC";
    } else {
      return `Etc/GMT${formatOffset$1(-this.fixed, "narrow")}`;
    }
  }
  /** @override **/
  offsetName() {
    return this.name;
  }
  /** @override **/
  formatOffset(ts, format2) {
    return formatOffset$1(this.fixed, format2);
  }
  /** @override **/
  get isUniversal() {
    return true;
  }
  /** @override **/
  offset() {
    return this.fixed;
  }
  /** @override **/
  equals(otherZone) {
    return otherZone.type === "fixed" && otherZone.fixed === this.fixed;
  }
  /** @override **/
  get isValid() {
    return true;
  }
};
let InvalidZone$1 = class InvalidZone extends Zone$1 {
  constructor(zoneName) {
    super();
    this.zoneName = zoneName;
  }
  /** @override **/
  get type() {
    return "invalid";
  }
  /** @override **/
  get name() {
    return this.zoneName;
  }
  /** @override **/
  get isUniversal() {
    return false;
  }
  /** @override **/
  offsetName() {
    return null;
  }
  /** @override **/
  formatOffset() {
    return "";
  }
  /** @override **/
  offset() {
    return NaN;
  }
  /** @override **/
  equals() {
    return false;
  }
  /** @override **/
  get isValid() {
    return false;
  }
};
function normalizeZone$1(input, defaultZone2) {
  if (isUndefined$2(input) || input === null) {
    return defaultZone2;
  } else if (input instanceof Zone$1) {
    return input;
  } else if (isString$3(input)) {
    const lowered = input.toLowerCase();
    if (lowered === "default") return defaultZone2;
    else if (lowered === "local" || lowered === "system") return SystemZone$1.instance;
    else if (lowered === "utc" || lowered === "gmt") return FixedOffsetZone$1.utcInstance;
    else return FixedOffsetZone$1.parseSpecifier(lowered) || IANAZone$1.create(input);
  } else if (isNumber$3(input)) {
    return FixedOffsetZone$1.instance(input);
  } else if (typeof input === "object" && "offset" in input && typeof input.offset === "function") {
    return input;
  } else {
    return new InvalidZone$1(input);
  }
}
let now$1 = () => Date.now(), defaultZone$1 = "system", defaultLocale$1 = null, defaultNumberingSystem$1 = null, defaultOutputCalendar$1 = null, twoDigitCutoffYear$1 = 60, throwOnInvalid$1;
let Settings$1 = class Settings {
  /**
   * Get the callback for returning the current timestamp.
   * @type {function}
   */
  static get now() {
    return now$1;
  }
  /**
   * Set the callback for returning the current timestamp.
   * The function should return a number, which will be interpreted as an Epoch millisecond count
   * @type {function}
   * @example Settings.now = () => Date.now() + 3000 // pretend it is 3 seconds in the future
   * @example Settings.now = () => 0 // always pretend it's Jan 1, 1970 at midnight in UTC time
   */
  static set now(n2) {
    now$1 = n2;
  }
  /**
   * Set the default time zone to create DateTimes in. Does not affect existing instances.
   * Use the value "system" to reset this value to the system's time zone.
   * @type {string}
   */
  static set defaultZone(zone) {
    defaultZone$1 = zone;
  }
  /**
   * Get the default time zone object currently used to create DateTimes. Does not affect existing instances.
   * The default value is the system's time zone (the one set on the machine that runs this code).
   * @type {Zone}
   */
  static get defaultZone() {
    return normalizeZone$1(defaultZone$1, SystemZone$1.instance);
  }
  /**
   * Get the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultLocale() {
    return defaultLocale$1;
  }
  /**
   * Set the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultLocale(locale) {
    defaultLocale$1 = locale;
  }
  /**
   * Get the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultNumberingSystem() {
    return defaultNumberingSystem$1;
  }
  /**
   * Set the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultNumberingSystem(numberingSystem) {
    defaultNumberingSystem$1 = numberingSystem;
  }
  /**
   * Get the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultOutputCalendar() {
    return defaultOutputCalendar$1;
  }
  /**
   * Set the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultOutputCalendar(outputCalendar) {
    defaultOutputCalendar$1 = outputCalendar;
  }
  /**
   * Get the cutoff year after which a string encoding a year as two digits is interpreted to occur in the current century.
   * @type {number}
   */
  static get twoDigitCutoffYear() {
    return twoDigitCutoffYear$1;
  }
  /**
   * Set the cutoff year after which a string encoding a year as two digits is interpreted to occur in the current century.
   * @type {number}
   * @example Settings.twoDigitCutoffYear = 0 // cut-off year is 0, so all 'yy' are interpreted as current century
   * @example Settings.twoDigitCutoffYear = 50 // '49' -> 1949; '50' -> 2050
   * @example Settings.twoDigitCutoffYear = 1950 // interpreted as 50
   * @example Settings.twoDigitCutoffYear = 2050 // ALSO interpreted as 50
   */
  static set twoDigitCutoffYear(cutoffYear) {
    twoDigitCutoffYear$1 = cutoffYear % 100;
  }
  /**
   * Get whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static get throwOnInvalid() {
    return throwOnInvalid$1;
  }
  /**
   * Set whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static set throwOnInvalid(t) {
    throwOnInvalid$1 = t;
  }
  /**
   * Reset Luxon's global caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCaches() {
    Locale$1.resetCache();
    IANAZone$1.resetCache();
  }
};
function isUndefined$2(o) {
  return typeof o === "undefined";
}
function isNumber$3(o) {
  return typeof o === "number";
}
function isInteger$1(o) {
  return typeof o === "number" && o % 1 === 0;
}
function isString$3(o) {
  return typeof o === "string";
}
function isDate$1(o) {
  return Object.prototype.toString.call(o) === "[object Date]";
}
function hasRelative$1() {
  try {
    return typeof Intl !== "undefined" && !!Intl.RelativeTimeFormat;
  } catch (e) {
    return false;
  }
}
function maybeArray$1(thing) {
  return Array.isArray(thing) ? thing : [thing];
}
function bestBy$1(arr, by, compare) {
  if (arr.length === 0) {
    return void 0;
  }
  return arr.reduce((best, next) => {
    const pair = [by(next), next];
    if (!best) {
      return pair;
    } else if (compare(best[0], pair[0]) === best[0]) {
      return best;
    } else {
      return pair;
    }
  }, null)[1];
}
function pick$1(obj, keys) {
  return keys.reduce((a, k) => {
    a[k] = obj[k];
    return a;
  }, {});
}
function hasOwnProperty$1(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
function integerBetween$1(thing, bottom2, top2) {
  return isInteger$1(thing) && thing >= bottom2 && thing <= top2;
}
function floorMod$1(x2, n2) {
  return x2 - n2 * Math.floor(x2 / n2);
}
function padStart$1(input, n2 = 2) {
  const isNeg = input < 0;
  let padded;
  if (isNeg) {
    padded = "-" + ("" + -input).padStart(n2, "0");
  } else {
    padded = ("" + input).padStart(n2, "0");
  }
  return padded;
}
function parseInteger$1(string) {
  if (isUndefined$2(string) || string === null || string === "") {
    return void 0;
  } else {
    return parseInt(string, 10);
  }
}
function parseFloating$1(string) {
  if (isUndefined$2(string) || string === null || string === "") {
    return void 0;
  } else {
    return parseFloat(string);
  }
}
function parseMillis$1(fraction) {
  if (isUndefined$2(fraction) || fraction === null || fraction === "") {
    return void 0;
  } else {
    const f = parseFloat("0." + fraction) * 1e3;
    return Math.floor(f);
  }
}
function roundTo$1(number, digits, towardZero = false) {
  const factor = 10 ** digits, rounder = towardZero ? Math.trunc : Math.round;
  return rounder(number * factor) / factor;
}
function isLeapYear$1(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function daysInYear$1(year) {
  return isLeapYear$1(year) ? 366 : 365;
}
function daysInMonth$1(year, month) {
  const modMonth = floorMod$1(month - 1, 12) + 1, modYear = year + (month - modMonth) / 12;
  if (modMonth === 2) {
    return isLeapYear$1(modYear) ? 29 : 28;
  } else {
    return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][modMonth - 1];
  }
}
function objToLocalTS$1(obj) {
  let d = Date.UTC(
    obj.year,
    obj.month - 1,
    obj.day,
    obj.hour,
    obj.minute,
    obj.second,
    obj.millisecond
  );
  if (obj.year < 100 && obj.year >= 0) {
    d = new Date(d);
    d.setUTCFullYear(obj.year, obj.month - 1, obj.day);
  }
  return +d;
}
function weeksInWeekYear$1(weekYear) {
  const p1 = (weekYear + Math.floor(weekYear / 4) - Math.floor(weekYear / 100) + Math.floor(weekYear / 400)) % 7, last = weekYear - 1, p2 = (last + Math.floor(last / 4) - Math.floor(last / 100) + Math.floor(last / 400)) % 7;
  return p1 === 4 || p2 === 3 ? 53 : 52;
}
function untruncateYear$1(year) {
  if (year > 99) {
    return year;
  } else return year > Settings$1.twoDigitCutoffYear ? 1900 + year : 2e3 + year;
}
function parseZoneInfo$1(ts, offsetFormat, locale, timeZone = null) {
  const date = new Date(ts), intlOpts = {
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  };
  if (timeZone) {
    intlOpts.timeZone = timeZone;
  }
  const modified = { timeZoneName: offsetFormat, ...intlOpts };
  const parsed = new Intl.DateTimeFormat(locale, modified).formatToParts(date).find((m) => m.type.toLowerCase() === "timezonename");
  return parsed ? parsed.value : null;
}
function signedOffset$1(offHourStr, offMinuteStr) {
  let offHour = parseInt(offHourStr, 10);
  if (Number.isNaN(offHour)) {
    offHour = 0;
  }
  const offMin = parseInt(offMinuteStr, 10) || 0, offMinSigned = offHour < 0 || Object.is(offHour, -0) ? -offMin : offMin;
  return offHour * 60 + offMinSigned;
}
function asNumber$1(value2) {
  const numericValue = Number(value2);
  if (typeof value2 === "boolean" || value2 === "" || Number.isNaN(numericValue))
    throw new InvalidArgumentError$1(`Invalid unit value ${value2}`);
  return numericValue;
}
function normalizeObject$1(obj, normalizer) {
  const normalized = {};
  for (const u in obj) {
    if (hasOwnProperty$1(obj, u)) {
      const v = obj[u];
      if (v === void 0 || v === null) continue;
      normalized[normalizer(u)] = asNumber$1(v);
    }
  }
  return normalized;
}
function formatOffset$1(offset2, format2) {
  const hours = Math.trunc(Math.abs(offset2 / 60)), minutes = Math.trunc(Math.abs(offset2 % 60)), sign = offset2 >= 0 ? "+" : "-";
  switch (format2) {
    case "short":
      return `${sign}${padStart$1(hours, 2)}:${padStart$1(minutes, 2)}`;
    case "narrow":
      return `${sign}${hours}${minutes > 0 ? `:${minutes}` : ""}`;
    case "techie":
      return `${sign}${padStart$1(hours, 2)}${padStart$1(minutes, 2)}`;
    default:
      throw new RangeError(`Value format ${format2} is out of range for property format`);
  }
}
function timeObject$1(obj) {
  return pick$1(obj, ["hour", "minute", "second", "millisecond"]);
}
const monthsLong$1 = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const monthsShort$1 = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
const monthsNarrow$1 = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
function months$1(length2) {
  switch (length2) {
    case "narrow":
      return [...monthsNarrow$1];
    case "short":
      return [...monthsShort$1];
    case "long":
      return [...monthsLong$1];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    case "2-digit":
      return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    default:
      return null;
  }
}
const weekdaysLong$1 = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];
const weekdaysShort$1 = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekdaysNarrow$1 = ["M", "T", "W", "T", "F", "S", "S"];
function weekdays$1(length2) {
  switch (length2) {
    case "narrow":
      return [...weekdaysNarrow$1];
    case "short":
      return [...weekdaysShort$1];
    case "long":
      return [...weekdaysLong$1];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7"];
    default:
      return null;
  }
}
const meridiems$1 = ["AM", "PM"];
const erasLong$1 = ["Before Christ", "Anno Domini"];
const erasShort$1 = ["BC", "AD"];
const erasNarrow$1 = ["B", "A"];
function eras$1(length2) {
  switch (length2) {
    case "narrow":
      return [...erasNarrow$1];
    case "short":
      return [...erasShort$1];
    case "long":
      return [...erasLong$1];
    default:
      return null;
  }
}
function meridiemForDateTime$1(dt) {
  return meridiems$1[dt.hour < 12 ? 0 : 1];
}
function weekdayForDateTime$1(dt, length2) {
  return weekdays$1(length2)[dt.weekday - 1];
}
function monthForDateTime$1(dt, length2) {
  return months$1(length2)[dt.month - 1];
}
function eraForDateTime$1(dt, length2) {
  return eras$1(length2)[dt.year < 0 ? 0 : 1];
}
function formatRelativeTime$1(unit, count, numeric = "always", narrow = false) {
  const units = {
    years: ["year", "yr."],
    quarters: ["quarter", "qtr."],
    months: ["month", "mo."],
    weeks: ["week", "wk."],
    days: ["day", "day", "days"],
    hours: ["hour", "hr."],
    minutes: ["minute", "min."],
    seconds: ["second", "sec."]
  };
  const lastable = ["hours", "minutes", "seconds"].indexOf(unit) === -1;
  if (numeric === "auto" && lastable) {
    const isDay = unit === "days";
    switch (count) {
      case 1:
        return isDay ? "tomorrow" : `next ${units[unit][0]}`;
      case -1:
        return isDay ? "yesterday" : `last ${units[unit][0]}`;
      case 0:
        return isDay ? "today" : `this ${units[unit][0]}`;
    }
  }
  const isInPast = Object.is(count, -0) || count < 0, fmtValue = Math.abs(count), singular = fmtValue === 1, lilUnits = units[unit], fmtUnit = narrow ? singular ? lilUnits[1] : lilUnits[2] || lilUnits[1] : singular ? units[unit][0] : unit;
  return isInPast ? `${fmtValue} ${fmtUnit} ago` : `in ${fmtValue} ${fmtUnit}`;
}
function stringifyTokens$1(splits, tokenToString) {
  let s2 = "";
  for (const token of splits) {
    if (token.literal) {
      s2 += token.val;
    } else {
      s2 += tokenToString(token.val);
    }
  }
  return s2;
}
const macroTokenToFormatOpts$1 = {
  D: DATE_SHORT$1,
  DD: DATE_MED$1,
  DDD: DATE_FULL$1,
  DDDD: DATE_HUGE$1,
  t: TIME_SIMPLE$1,
  tt: TIME_WITH_SECONDS$1,
  ttt: TIME_WITH_SHORT_OFFSET$1,
  tttt: TIME_WITH_LONG_OFFSET$1,
  T: TIME_24_SIMPLE$1,
  TT: TIME_24_WITH_SECONDS$1,
  TTT: TIME_24_WITH_SHORT_OFFSET$1,
  TTTT: TIME_24_WITH_LONG_OFFSET$1,
  f: DATETIME_SHORT$1,
  ff: DATETIME_MED$1,
  fff: DATETIME_FULL$1,
  ffff: DATETIME_HUGE$1,
  F: DATETIME_SHORT_WITH_SECONDS$1,
  FF: DATETIME_MED_WITH_SECONDS$1,
  FFF: DATETIME_FULL_WITH_SECONDS$1,
  FFFF: DATETIME_HUGE_WITH_SECONDS$1
};
let Formatter$1 = class Formatter {
  static create(locale, opts = {}) {
    return new Formatter(locale, opts);
  }
  static parseFormat(fmt2) {
    let current = null, currentFull = "", bracketed = false;
    const splits = [];
    for (let i = 0; i < fmt2.length; i++) {
      const c = fmt2.charAt(i);
      if (c === "'") {
        if (currentFull.length > 0) {
          splits.push({ literal: bracketed || /^\s+$/.test(currentFull), val: currentFull });
        }
        current = null;
        currentFull = "";
        bracketed = !bracketed;
      } else if (bracketed) {
        currentFull += c;
      } else if (c === current) {
        currentFull += c;
      } else {
        if (currentFull.length > 0) {
          splits.push({ literal: /^\s+$/.test(currentFull), val: currentFull });
        }
        currentFull = c;
        current = c;
      }
    }
    if (currentFull.length > 0) {
      splits.push({ literal: bracketed || /^\s+$/.test(currentFull), val: currentFull });
    }
    return splits;
  }
  static macroTokenToFormatOpts(token) {
    return macroTokenToFormatOpts$1[token];
  }
  constructor(locale, formatOpts) {
    this.opts = formatOpts;
    this.loc = locale;
    this.systemLoc = null;
  }
  formatWithSystemDefault(dt, opts) {
    if (this.systemLoc === null) {
      this.systemLoc = this.loc.redefaultToSystem();
    }
    const df = this.systemLoc.dtFormatter(dt, { ...this.opts, ...opts });
    return df.format();
  }
  dtFormatter(dt, opts = {}) {
    return this.loc.dtFormatter(dt, { ...this.opts, ...opts });
  }
  formatDateTime(dt, opts) {
    return this.dtFormatter(dt, opts).format();
  }
  formatDateTimeParts(dt, opts) {
    return this.dtFormatter(dt, opts).formatToParts();
  }
  formatInterval(interval, opts) {
    const df = this.dtFormatter(interval.start, opts);
    return df.dtf.formatRange(interval.start.toJSDate(), interval.end.toJSDate());
  }
  resolvedOptions(dt, opts) {
    return this.dtFormatter(dt, opts).resolvedOptions();
  }
  num(n2, p2 = 0) {
    if (this.opts.forceSimple) {
      return padStart$1(n2, p2);
    }
    const opts = { ...this.opts };
    if (p2 > 0) {
      opts.padTo = p2;
    }
    return this.loc.numberFormatter(opts).format(n2);
  }
  formatDateTimeFromString(dt, fmt2) {
    const knownEnglish = this.loc.listingMode() === "en", useDateTimeFormatter = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory", string = (opts, extract) => this.loc.extract(dt, opts, extract), formatOffset2 = (opts) => {
      if (dt.isOffsetFixed && dt.offset === 0 && opts.allowZ) {
        return "Z";
      }
      return dt.isValid ? dt.zone.formatOffset(dt.ts, opts.format) : "";
    }, meridiem = () => knownEnglish ? meridiemForDateTime$1(dt) : string({ hour: "numeric", hourCycle: "h12" }, "dayperiod"), month = (length2, standalone) => knownEnglish ? monthForDateTime$1(dt, length2) : string(standalone ? { month: length2 } : { month: length2, day: "numeric" }, "month"), weekday = (length2, standalone) => knownEnglish ? weekdayForDateTime$1(dt, length2) : string(
      standalone ? { weekday: length2 } : { weekday: length2, month: "long", day: "numeric" },
      "weekday"
    ), maybeMacro = (token) => {
      const formatOpts = Formatter.macroTokenToFormatOpts(token);
      if (formatOpts) {
        return this.formatWithSystemDefault(dt, formatOpts);
      } else {
        return token;
      }
    }, era = (length2) => knownEnglish ? eraForDateTime$1(dt, length2) : string({ era: length2 }, "era"), tokenToString = (token) => {
      switch (token) {
        case "S":
          return this.num(dt.millisecond);
        case "u":
        case "SSS":
          return this.num(dt.millisecond, 3);
        case "s":
          return this.num(dt.second);
        case "ss":
          return this.num(dt.second, 2);
        case "uu":
          return this.num(Math.floor(dt.millisecond / 10), 2);
        case "uuu":
          return this.num(Math.floor(dt.millisecond / 100));
        case "m":
          return this.num(dt.minute);
        case "mm":
          return this.num(dt.minute, 2);
        case "h":
          return this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12);
        case "hh":
          return this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12, 2);
        case "H":
          return this.num(dt.hour);
        case "HH":
          return this.num(dt.hour, 2);
        case "Z":
          return formatOffset2({ format: "narrow", allowZ: this.opts.allowZ });
        case "ZZ":
          return formatOffset2({ format: "short", allowZ: this.opts.allowZ });
        case "ZZZ":
          return formatOffset2({ format: "techie", allowZ: this.opts.allowZ });
        case "ZZZZ":
          return dt.zone.offsetName(dt.ts, { format: "short", locale: this.loc.locale });
        case "ZZZZZ":
          return dt.zone.offsetName(dt.ts, { format: "long", locale: this.loc.locale });
        case "z":
          return dt.zoneName;
        case "a":
          return meridiem();
        case "d":
          return useDateTimeFormatter ? string({ day: "numeric" }, "day") : this.num(dt.day);
        case "dd":
          return useDateTimeFormatter ? string({ day: "2-digit" }, "day") : this.num(dt.day, 2);
        case "c":
          return this.num(dt.weekday);
        case "ccc":
          return weekday("short", true);
        case "cccc":
          return weekday("long", true);
        case "ccccc":
          return weekday("narrow", true);
        case "E":
          return this.num(dt.weekday);
        case "EEE":
          return weekday("short", false);
        case "EEEE":
          return weekday("long", false);
        case "EEEEE":
          return weekday("narrow", false);
        case "L":
          return useDateTimeFormatter ? string({ month: "numeric", day: "numeric" }, "month") : this.num(dt.month);
        case "LL":
          return useDateTimeFormatter ? string({ month: "2-digit", day: "numeric" }, "month") : this.num(dt.month, 2);
        case "LLL":
          return month("short", true);
        case "LLLL":
          return month("long", true);
        case "LLLLL":
          return month("narrow", true);
        case "M":
          return useDateTimeFormatter ? string({ month: "numeric" }, "month") : this.num(dt.month);
        case "MM":
          return useDateTimeFormatter ? string({ month: "2-digit" }, "month") : this.num(dt.month, 2);
        case "MMM":
          return month("short", false);
        case "MMMM":
          return month("long", false);
        case "MMMMM":
          return month("narrow", false);
        case "y":
          return useDateTimeFormatter ? string({ year: "numeric" }, "year") : this.num(dt.year);
        case "yy":
          return useDateTimeFormatter ? string({ year: "2-digit" }, "year") : this.num(dt.year.toString().slice(-2), 2);
        case "yyyy":
          return useDateTimeFormatter ? string({ year: "numeric" }, "year") : this.num(dt.year, 4);
        case "yyyyyy":
          return useDateTimeFormatter ? string({ year: "numeric" }, "year") : this.num(dt.year, 6);
        case "G":
          return era("short");
        case "GG":
          return era("long");
        case "GGGGG":
          return era("narrow");
        case "kk":
          return this.num(dt.weekYear.toString().slice(-2), 2);
        case "kkkk":
          return this.num(dt.weekYear, 4);
        case "W":
          return this.num(dt.weekNumber);
        case "WW":
          return this.num(dt.weekNumber, 2);
        case "o":
          return this.num(dt.ordinal);
        case "ooo":
          return this.num(dt.ordinal, 3);
        case "q":
          return this.num(dt.quarter);
        case "qq":
          return this.num(dt.quarter, 2);
        case "X":
          return this.num(Math.floor(dt.ts / 1e3));
        case "x":
          return this.num(dt.ts);
        default:
          return maybeMacro(token);
      }
    };
    return stringifyTokens$1(Formatter.parseFormat(fmt2), tokenToString);
  }
  formatDurationFromString(dur, fmt2) {
    const tokenToField = (token) => {
      switch (token[0]) {
        case "S":
          return "millisecond";
        case "s":
          return "second";
        case "m":
          return "minute";
        case "h":
          return "hour";
        case "d":
          return "day";
        case "w":
          return "week";
        case "M":
          return "month";
        case "y":
          return "year";
        default:
          return null;
      }
    }, tokenToString = (lildur) => (token) => {
      const mapped = tokenToField(token);
      if (mapped) {
        return this.num(lildur.get(mapped), token.length);
      } else {
        return token;
      }
    }, tokens2 = Formatter.parseFormat(fmt2), realTokens = tokens2.reduce(
      (found, { literal, val }) => literal ? found : found.concat(val),
      []
    ), collapsed = dur.shiftTo(...realTokens.map(tokenToField).filter((t) => t));
    return stringifyTokens$1(tokens2, tokenToString(collapsed));
  }
};
let Invalid$1 = class Invalid {
  constructor(reason, explanation) {
    this.reason = reason;
    this.explanation = explanation;
  }
  toMessage() {
    if (this.explanation) {
      return `${this.reason}: ${this.explanation}`;
    } else {
      return this.reason;
    }
  }
};
const ianaRegex$1 = /[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;
function combineRegexes$1(...regexes2) {
  const full = regexes2.reduce((f, r) => f + r.source, "");
  return RegExp(`^${full}$`);
}
function combineExtractors$1(...extractors) {
  return (m) => extractors.reduce(
    ([mergedVals, mergedZone, cursor], ex) => {
      const [val, zone, next] = ex(m, cursor);
      return [{ ...mergedVals, ...val }, zone || mergedZone, next];
    },
    [{}, null, 1]
  ).slice(0, 2);
}
function parse$2(s2, ...patterns) {
  if (s2 == null) {
    return [null, null];
  }
  for (const [regex, extractor] of patterns) {
    const m = regex.exec(s2);
    if (m) {
      return extractor(m);
    }
  }
  return [null, null];
}
function simpleParse$1(...keys) {
  return (match2, cursor) => {
    const ret = {};
    let i;
    for (i = 0; i < keys.length; i++) {
      ret[keys[i]] = parseInteger$1(match2[cursor + i]);
    }
    return [ret, null, cursor + i];
  };
}
const offsetRegex$1 = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)/;
const isoExtendedZone$1 = `(?:${offsetRegex$1.source}?(?:\\[(${ianaRegex$1.source})\\])?)?`;
const isoTimeBaseRegex$1 = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/;
const isoTimeRegex$1 = RegExp(`${isoTimeBaseRegex$1.source}${isoExtendedZone$1}`);
const isoTimeExtensionRegex$1 = RegExp(`(?:T${isoTimeRegex$1.source})?`);
const isoYmdRegex$1 = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/;
const isoWeekRegex$1 = /(\d{4})-?W(\d\d)(?:-?(\d))?/;
const isoOrdinalRegex$1 = /(\d{4})-?(\d{3})/;
const extractISOWeekData$1 = simpleParse$1("weekYear", "weekNumber", "weekDay");
const extractISOOrdinalData$1 = simpleParse$1("year", "ordinal");
const sqlYmdRegex$1 = /(\d{4})-(\d\d)-(\d\d)/;
const sqlTimeRegex$1 = RegExp(
  `${isoTimeBaseRegex$1.source} ?(?:${offsetRegex$1.source}|(${ianaRegex$1.source}))?`
);
const sqlTimeExtensionRegex$1 = RegExp(`(?: ${sqlTimeRegex$1.source})?`);
function int$1(match2, pos, fallback) {
  const m = match2[pos];
  return isUndefined$2(m) ? fallback : parseInteger$1(m);
}
function extractISOYmd$1(match2, cursor) {
  const item2 = {
    year: int$1(match2, cursor),
    month: int$1(match2, cursor + 1, 1),
    day: int$1(match2, cursor + 2, 1)
  };
  return [item2, null, cursor + 3];
}
function extractISOTime$1(match2, cursor) {
  const item2 = {
    hours: int$1(match2, cursor, 0),
    minutes: int$1(match2, cursor + 1, 0),
    seconds: int$1(match2, cursor + 2, 0),
    milliseconds: parseMillis$1(match2[cursor + 3])
  };
  return [item2, null, cursor + 4];
}
function extractISOOffset$1(match2, cursor) {
  const local = !match2[cursor] && !match2[cursor + 1], fullOffset = signedOffset$1(match2[cursor + 1], match2[cursor + 2]), zone = local ? null : FixedOffsetZone$1.instance(fullOffset);
  return [{}, zone, cursor + 3];
}
function extractIANAZone$1(match2, cursor) {
  const zone = match2[cursor] ? IANAZone$1.create(match2[cursor]) : null;
  return [{}, zone, cursor + 1];
}
const isoTimeOnly$1 = RegExp(`^T?${isoTimeBaseRegex$1.source}$`);
const isoDuration$1 = /^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;
function extractISODuration$1(match2) {
  const [s2, yearStr, monthStr, weekStr, dayStr, hourStr, minuteStr, secondStr, millisecondsStr] = match2;
  const hasNegativePrefix = s2[0] === "-";
  const negativeSeconds = secondStr && secondStr[0] === "-";
  const maybeNegate = (num, force = false) => num !== void 0 && (force || num && hasNegativePrefix) ? -num : num;
  return [
    {
      years: maybeNegate(parseFloating$1(yearStr)),
      months: maybeNegate(parseFloating$1(monthStr)),
      weeks: maybeNegate(parseFloating$1(weekStr)),
      days: maybeNegate(parseFloating$1(dayStr)),
      hours: maybeNegate(parseFloating$1(hourStr)),
      minutes: maybeNegate(parseFloating$1(minuteStr)),
      seconds: maybeNegate(parseFloating$1(secondStr), secondStr === "-0"),
      milliseconds: maybeNegate(parseMillis$1(millisecondsStr), negativeSeconds)
    }
  ];
}
const obsOffsets$1 = {
  GMT: 0,
  EDT: -4 * 60,
  EST: -5 * 60,
  CDT: -5 * 60,
  CST: -6 * 60,
  MDT: -6 * 60,
  MST: -7 * 60,
  PDT: -7 * 60,
  PST: -8 * 60
};
function fromStrings$1(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
  const result = {
    year: yearStr.length === 2 ? untruncateYear$1(parseInteger$1(yearStr)) : parseInteger$1(yearStr),
    month: monthsShort$1.indexOf(monthStr) + 1,
    day: parseInteger$1(dayStr),
    hour: parseInteger$1(hourStr),
    minute: parseInteger$1(minuteStr)
  };
  if (secondStr) result.second = parseInteger$1(secondStr);
  if (weekdayStr) {
    result.weekday = weekdayStr.length > 3 ? weekdaysLong$1.indexOf(weekdayStr) + 1 : weekdaysShort$1.indexOf(weekdayStr) + 1;
  }
  return result;
}
const rfc2822$1 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;
function extractRFC2822$1(match2) {
  const [
    ,
    weekdayStr,
    dayStr,
    monthStr,
    yearStr,
    hourStr,
    minuteStr,
    secondStr,
    obsOffset,
    milOffset,
    offHourStr,
    offMinuteStr
  ] = match2, result = fromStrings$1(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
  let offset2;
  if (obsOffset) {
    offset2 = obsOffsets$1[obsOffset];
  } else if (milOffset) {
    offset2 = 0;
  } else {
    offset2 = signedOffset$1(offHourStr, offMinuteStr);
  }
  return [result, new FixedOffsetZone$1(offset2)];
}
function preprocessRFC2822$1(s2) {
  return s2.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").trim();
}
const rfc1123$1 = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/, rfc850$1 = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/, ascii$1 = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;
function extractRFC1123Or850$1(match2) {
  const [, weekdayStr, dayStr, monthStr, yearStr, hourStr, minuteStr, secondStr] = match2, result = fromStrings$1(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
  return [result, FixedOffsetZone$1.utcInstance];
}
function extractASCII$1(match2) {
  const [, weekdayStr, monthStr, dayStr, hourStr, minuteStr, secondStr, yearStr] = match2, result = fromStrings$1(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
  return [result, FixedOffsetZone$1.utcInstance];
}
const isoYmdWithTimeExtensionRegex$1 = combineRegexes$1(isoYmdRegex$1, isoTimeExtensionRegex$1);
const isoWeekWithTimeExtensionRegex$1 = combineRegexes$1(isoWeekRegex$1, isoTimeExtensionRegex$1);
const isoOrdinalWithTimeExtensionRegex$1 = combineRegexes$1(isoOrdinalRegex$1, isoTimeExtensionRegex$1);
const isoTimeCombinedRegex$1 = combineRegexes$1(isoTimeRegex$1);
const extractISOYmdTimeAndOffset$1 = combineExtractors$1(
  extractISOYmd$1,
  extractISOTime$1,
  extractISOOffset$1,
  extractIANAZone$1
);
const extractISOWeekTimeAndOffset$1 = combineExtractors$1(
  extractISOWeekData$1,
  extractISOTime$1,
  extractISOOffset$1,
  extractIANAZone$1
);
const extractISOOrdinalDateAndTime$1 = combineExtractors$1(
  extractISOOrdinalData$1,
  extractISOTime$1,
  extractISOOffset$1,
  extractIANAZone$1
);
const extractISOTimeAndOffset$1 = combineExtractors$1(
  extractISOTime$1,
  extractISOOffset$1,
  extractIANAZone$1
);
function parseISODate$1(s2) {
  return parse$2(
    s2,
    [isoYmdWithTimeExtensionRegex$1, extractISOYmdTimeAndOffset$1],
    [isoWeekWithTimeExtensionRegex$1, extractISOWeekTimeAndOffset$1],
    [isoOrdinalWithTimeExtensionRegex$1, extractISOOrdinalDateAndTime$1],
    [isoTimeCombinedRegex$1, extractISOTimeAndOffset$1]
  );
}
function parseRFC2822Date$1(s2) {
  return parse$2(preprocessRFC2822$1(s2), [rfc2822$1, extractRFC2822$1]);
}
function parseHTTPDate$1(s2) {
  return parse$2(
    s2,
    [rfc1123$1, extractRFC1123Or850$1],
    [rfc850$1, extractRFC1123Or850$1],
    [ascii$1, extractASCII$1]
  );
}
function parseISODuration$1(s2) {
  return parse$2(s2, [isoDuration$1, extractISODuration$1]);
}
const extractISOTimeOnly$1 = combineExtractors$1(extractISOTime$1);
function parseISOTimeOnly$1(s2) {
  return parse$2(s2, [isoTimeOnly$1, extractISOTimeOnly$1]);
}
const sqlYmdWithTimeExtensionRegex$1 = combineRegexes$1(sqlYmdRegex$1, sqlTimeExtensionRegex$1);
const sqlTimeCombinedRegex$1 = combineRegexes$1(sqlTimeRegex$1);
const extractISOTimeOffsetAndIANAZone$1 = combineExtractors$1(
  extractISOTime$1,
  extractISOOffset$1,
  extractIANAZone$1
);
function parseSQL$1(s2) {
  return parse$2(
    s2,
    [sqlYmdWithTimeExtensionRegex$1, extractISOYmdTimeAndOffset$1],
    [sqlTimeCombinedRegex$1, extractISOTimeOffsetAndIANAZone$1]
  );
}
const INVALID$2$1 = "Invalid Duration";
const lowOrderMatrix$1 = {
  weeks: {
    days: 7,
    hours: 7 * 24,
    minutes: 7 * 24 * 60,
    seconds: 7 * 24 * 60 * 60,
    milliseconds: 7 * 24 * 60 * 60 * 1e3
  },
  days: {
    hours: 24,
    minutes: 24 * 60,
    seconds: 24 * 60 * 60,
    milliseconds: 24 * 60 * 60 * 1e3
  },
  hours: { minutes: 60, seconds: 60 * 60, milliseconds: 60 * 60 * 1e3 },
  minutes: { seconds: 60, milliseconds: 60 * 1e3 },
  seconds: { milliseconds: 1e3 }
}, casualMatrix$1 = {
  years: {
    quarters: 4,
    months: 12,
    weeks: 52,
    days: 365,
    hours: 365 * 24,
    minutes: 365 * 24 * 60,
    seconds: 365 * 24 * 60 * 60,
    milliseconds: 365 * 24 * 60 * 60 * 1e3
  },
  quarters: {
    months: 3,
    weeks: 13,
    days: 91,
    hours: 91 * 24,
    minutes: 91 * 24 * 60,
    seconds: 91 * 24 * 60 * 60,
    milliseconds: 91 * 24 * 60 * 60 * 1e3
  },
  months: {
    weeks: 4,
    days: 30,
    hours: 30 * 24,
    minutes: 30 * 24 * 60,
    seconds: 30 * 24 * 60 * 60,
    milliseconds: 30 * 24 * 60 * 60 * 1e3
  },
  ...lowOrderMatrix$1
}, daysInYearAccurate$1 = 146097 / 400, daysInMonthAccurate$1 = 146097 / 4800, accurateMatrix$1 = {
  years: {
    quarters: 4,
    months: 12,
    weeks: daysInYearAccurate$1 / 7,
    days: daysInYearAccurate$1,
    hours: daysInYearAccurate$1 * 24,
    minutes: daysInYearAccurate$1 * 24 * 60,
    seconds: daysInYearAccurate$1 * 24 * 60 * 60,
    milliseconds: daysInYearAccurate$1 * 24 * 60 * 60 * 1e3
  },
  quarters: {
    months: 3,
    weeks: daysInYearAccurate$1 / 28,
    days: daysInYearAccurate$1 / 4,
    hours: daysInYearAccurate$1 * 24 / 4,
    minutes: daysInYearAccurate$1 * 24 * 60 / 4,
    seconds: daysInYearAccurate$1 * 24 * 60 * 60 / 4,
    milliseconds: daysInYearAccurate$1 * 24 * 60 * 60 * 1e3 / 4
  },
  months: {
    weeks: daysInMonthAccurate$1 / 7,
    days: daysInMonthAccurate$1,
    hours: daysInMonthAccurate$1 * 24,
    minutes: daysInMonthAccurate$1 * 24 * 60,
    seconds: daysInMonthAccurate$1 * 24 * 60 * 60,
    milliseconds: daysInMonthAccurate$1 * 24 * 60 * 60 * 1e3
  },
  ...lowOrderMatrix$1
};
const orderedUnits$1$1 = [
  "years",
  "quarters",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
  "milliseconds"
];
const reverseUnits$1 = orderedUnits$1$1.slice(0).reverse();
function clone$1$1(dur, alts, clear = false) {
  const conf = {
    values: clear ? alts.values : { ...dur.values, ...alts.values || {} },
    loc: dur.loc.clone(alts.loc),
    conversionAccuracy: alts.conversionAccuracy || dur.conversionAccuracy,
    matrix: alts.matrix || dur.matrix
  };
  return new Duration$1(conf);
}
function durationToMillis$1(matrix, vals) {
  let sum = vals.milliseconds ?? 0;
  for (const unit of reverseUnits$1.slice(1)) {
    if (vals[unit]) {
      sum += vals[unit] * matrix[unit]["milliseconds"];
    }
  }
  return sum;
}
function normalizeValues$1(matrix, vals) {
  const factor = durationToMillis$1(matrix, vals) < 0 ? -1 : 1;
  orderedUnits$1$1.reduceRight((previous, current) => {
    if (!isUndefined$2(vals[current])) {
      if (previous) {
        const previousVal = vals[previous] * factor;
        const conv = matrix[current][previous];
        const rollUp = Math.floor(previousVal / conv);
        vals[current] += rollUp * factor;
        vals[previous] -= rollUp * conv * factor;
      }
      return current;
    } else {
      return previous;
    }
  }, null);
  orderedUnits$1$1.reduce((previous, current) => {
    if (!isUndefined$2(vals[current])) {
      if (previous) {
        const fraction = vals[previous] % 1;
        vals[previous] -= fraction;
        vals[current] += fraction * matrix[previous][current];
      }
      return current;
    } else {
      return previous;
    }
  }, null);
}
function removeZeroes$1(vals) {
  const newVals = {};
  for (const [key, value2] of Object.entries(vals)) {
    if (value2 !== 0) {
      newVals[key] = value2;
    }
  }
  return newVals;
}
let Duration$1 = class Duration {
  /**
   * @private
   */
  constructor(config) {
    const accurate = config.conversionAccuracy === "longterm" || false;
    let matrix = accurate ? accurateMatrix$1 : casualMatrix$1;
    if (config.matrix) {
      matrix = config.matrix;
    }
    this.values = config.values;
    this.loc = config.loc || Locale$1.create();
    this.conversionAccuracy = accurate ? "longterm" : "casual";
    this.invalid = config.invalid || null;
    this.matrix = matrix;
    this.isLuxonDuration = true;
  }
  /**
   * Create Duration from a number of milliseconds.
   * @param {number} count of milliseconds
   * @param {Object} opts - options for parsing
   * @param {string} [opts.locale='en-US'] - the locale to use
   * @param {string} opts.numberingSystem - the numbering system to use
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @return {Duration}
   */
  static fromMillis(count, opts) {
    return Duration.fromObject({ milliseconds: count }, opts);
  }
  /**
   * Create a Duration from a JavaScript object with keys like 'years' and 'hours'.
   * If this object is empty then a zero milliseconds duration is returned.
   * @param {Object} obj - the object to create the DateTime from
   * @param {number} obj.years
   * @param {number} obj.quarters
   * @param {number} obj.months
   * @param {number} obj.weeks
   * @param {number} obj.days
   * @param {number} obj.hours
   * @param {number} obj.minutes
   * @param {number} obj.seconds
   * @param {number} obj.milliseconds
   * @param {Object} [opts=[]] - options for creating this Duration
   * @param {string} [opts.locale='en-US'] - the locale to use
   * @param {string} opts.numberingSystem - the numbering system to use
   * @param {string} [opts.conversionAccuracy='casual'] - the preset conversion system to use
   * @param {string} [opts.matrix=Object] - the custom conversion system to use
   * @return {Duration}
   */
  static fromObject(obj, opts = {}) {
    if (obj == null || typeof obj !== "object") {
      throw new InvalidArgumentError$1(
        `Duration.fromObject: argument expected to be an object, got ${obj === null ? "null" : typeof obj}`
      );
    }
    return new Duration({
      values: normalizeObject$1(obj, Duration.normalizeUnit),
      loc: Locale$1.fromObject(opts),
      conversionAccuracy: opts.conversionAccuracy,
      matrix: opts.matrix
    });
  }
  /**
   * Create a Duration from DurationLike.
   *
   * @param {Object | number | Duration} durationLike
   * One of:
   * - object with keys like 'years' and 'hours'.
   * - number representing milliseconds
   * - Duration instance
   * @return {Duration}
   */
  static fromDurationLike(durationLike) {
    if (isNumber$3(durationLike)) {
      return Duration.fromMillis(durationLike);
    } else if (Duration.isDuration(durationLike)) {
      return durationLike;
    } else if (typeof durationLike === "object") {
      return Duration.fromObject(durationLike);
    } else {
      throw new InvalidArgumentError$1(
        `Unknown duration argument ${durationLike} of type ${typeof durationLike}`
      );
    }
  }
  /**
   * Create a Duration from an ISO 8601 duration string.
   * @param {string} text - text to parse
   * @param {Object} opts - options for parsing
   * @param {string} [opts.locale='en-US'] - the locale to use
   * @param {string} opts.numberingSystem - the numbering system to use
   * @param {string} [opts.conversionAccuracy='casual'] - the preset conversion system to use
   * @param {string} [opts.matrix=Object] - the preset conversion system to use
   * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
   * @example Duration.fromISO('P3Y6M1W4DT12H30M5S').toObject() //=> { years: 3, months: 6, weeks: 1, days: 4, hours: 12, minutes: 30, seconds: 5 }
   * @example Duration.fromISO('PT23H').toObject() //=> { hours: 23 }
   * @example Duration.fromISO('P5Y3M').toObject() //=> { years: 5, months: 3 }
   * @return {Duration}
   */
  static fromISO(text2, opts) {
    const [parsed] = parseISODuration$1(text2);
    if (parsed) {
      return Duration.fromObject(parsed, opts);
    } else {
      return Duration.invalid("unparsable", `the input "${text2}" can't be parsed as ISO 8601`);
    }
  }
  /**
   * Create a Duration from an ISO 8601 time string.
   * @param {string} text - text to parse
   * @param {Object} opts - options for parsing
   * @param {string} [opts.locale='en-US'] - the locale to use
   * @param {string} opts.numberingSystem - the numbering system to use
   * @param {string} [opts.conversionAccuracy='casual'] - the preset conversion system to use
   * @param {string} [opts.matrix=Object] - the conversion system to use
   * @see https://en.wikipedia.org/wiki/ISO_8601#Times
   * @example Duration.fromISOTime('11:22:33.444').toObject() //=> { hours: 11, minutes: 22, seconds: 33, milliseconds: 444 }
   * @example Duration.fromISOTime('11:00').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
   * @example Duration.fromISOTime('T11:00').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
   * @example Duration.fromISOTime('1100').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
   * @example Duration.fromISOTime('T1100').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
   * @return {Duration}
   */
  static fromISOTime(text2, opts) {
    const [parsed] = parseISOTimeOnly$1(text2);
    if (parsed) {
      return Duration.fromObject(parsed, opts);
    } else {
      return Duration.invalid("unparsable", `the input "${text2}" can't be parsed as ISO 8601`);
    }
  }
  /**
   * Create an invalid Duration.
   * @param {string} reason - simple string of why this datetime is invalid. Should not contain parameters or anything else data-dependent
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {Duration}
   */
  static invalid(reason, explanation = null) {
    if (!reason) {
      throw new InvalidArgumentError$1("need to specify a reason the Duration is invalid");
    }
    const invalid = reason instanceof Invalid$1 ? reason : new Invalid$1(reason, explanation);
    if (Settings$1.throwOnInvalid) {
      throw new InvalidDurationError$1(invalid);
    } else {
      return new Duration({ invalid });
    }
  }
  /**
   * @private
   */
  static normalizeUnit(unit) {
    const normalized = {
      year: "years",
      years: "years",
      quarter: "quarters",
      quarters: "quarters",
      month: "months",
      months: "months",
      week: "weeks",
      weeks: "weeks",
      day: "days",
      days: "days",
      hour: "hours",
      hours: "hours",
      minute: "minutes",
      minutes: "minutes",
      second: "seconds",
      seconds: "seconds",
      millisecond: "milliseconds",
      milliseconds: "milliseconds"
    }[unit ? unit.toLowerCase() : unit];
    if (!normalized) throw new InvalidUnitError$1(unit);
    return normalized;
  }
  /**
   * Check if an object is a Duration. Works across context boundaries
   * @param {object} o
   * @return {boolean}
   */
  static isDuration(o) {
    return o && o.isLuxonDuration || false;
  }
  /**
   * Get  the locale of a Duration, such 'en-GB'
   * @type {string}
   */
  get locale() {
    return this.isValid ? this.loc.locale : null;
  }
  /**
   * Get the numbering system of a Duration, such 'beng'. The numbering system is used when formatting the Duration
   *
   * @type {string}
   */
  get numberingSystem() {
    return this.isValid ? this.loc.numberingSystem : null;
  }
  /**
   * Returns a string representation of this Duration formatted according to the specified format string. You may use these tokens:
   * * `S` for milliseconds
   * * `s` for seconds
   * * `m` for minutes
   * * `h` for hours
   * * `d` for days
   * * `w` for weeks
   * * `M` for months
   * * `y` for years
   * Notes:
   * * Add padding by repeating the token, e.g. "yy" pads the years to two digits, "hhhh" pads the hours out to four digits
   * * Tokens can be escaped by wrapping with single quotes.
   * * The duration will be converted to the set of units in the format string using {@link Duration#shiftTo} and the Durations's conversion accuracy setting.
   * @param {string} fmt - the format string
   * @param {Object} opts - options
   * @param {boolean} [opts.floor=true] - floor numerical values
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("y d s") //=> "1 6 2"
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("yy dd sss") //=> "01 06 002"
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("M S") //=> "12 518402000"
   * @return {string}
   */
  toFormat(fmt2, opts = {}) {
    const fmtOpts = {
      ...opts,
      floor: opts.round !== false && opts.floor !== false
    };
    return this.isValid ? Formatter$1.create(this.loc, fmtOpts).formatDurationFromString(this, fmt2) : INVALID$2$1;
  }
  /**
   * Returns a string representation of a Duration with all units included.
   * To modify its behavior use the `listStyle` and any Intl.NumberFormat option, though `unitDisplay` is especially relevant.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
   * @param opts - On option object to override the formatting. Accepts the same keys as the options parameter of the native `Int.NumberFormat` constructor, as well as `listStyle`.
   * @example
   * ```js
   * var dur = Duration.fromObject({ days: 1, hours: 5, minutes: 6 })
   * dur.toHuman() //=> '1 day, 5 hours, 6 minutes'
   * dur.toHuman({ listStyle: "long" }) //=> '1 day, 5 hours, and 6 minutes'
   * dur.toHuman({ unitDisplay: "short" }) //=> '1 day, 5 hr, 6 min'
   * ```
   */
  toHuman(opts = {}) {
    if (!this.isValid) return INVALID$2$1;
    const l2 = orderedUnits$1$1.map((unit) => {
      const val = this.values[unit];
      if (isUndefined$2(val)) {
        return null;
      }
      return this.loc.numberFormatter({ style: "unit", unitDisplay: "long", ...opts, unit: unit.slice(0, -1) }).format(val);
    }).filter((n2) => n2);
    return this.loc.listFormatter({ type: "conjunction", style: opts.listStyle || "narrow", ...opts }).format(l2);
  }
  /**
   * Returns a JavaScript object with this Duration's values.
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toObject() //=> { years: 1, days: 6, seconds: 2 }
   * @return {Object}
   */
  toObject() {
    if (!this.isValid) return {};
    return { ...this.values };
  }
  /**
   * Returns an ISO 8601-compliant string representation of this Duration.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
   * @example Duration.fromObject({ years: 3, seconds: 45 }).toISO() //=> 'P3YT45S'
   * @example Duration.fromObject({ months: 4, seconds: 45 }).toISO() //=> 'P4MT45S'
   * @example Duration.fromObject({ months: 5 }).toISO() //=> 'P5M'
   * @example Duration.fromObject({ minutes: 5 }).toISO() //=> 'PT5M'
   * @example Duration.fromObject({ milliseconds: 6 }).toISO() //=> 'PT0.006S'
   * @return {string}
   */
  toISO() {
    if (!this.isValid) return null;
    let s2 = "P";
    if (this.years !== 0) s2 += this.years + "Y";
    if (this.months !== 0 || this.quarters !== 0) s2 += this.months + this.quarters * 3 + "M";
    if (this.weeks !== 0) s2 += this.weeks + "W";
    if (this.days !== 0) s2 += this.days + "D";
    if (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0 || this.milliseconds !== 0)
      s2 += "T";
    if (this.hours !== 0) s2 += this.hours + "H";
    if (this.minutes !== 0) s2 += this.minutes + "M";
    if (this.seconds !== 0 || this.milliseconds !== 0)
      s2 += roundTo$1(this.seconds + this.milliseconds / 1e3, 3) + "S";
    if (s2 === "P") s2 += "T0S";
    return s2;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this Duration, formatted as a time of day.
   * Note that this will return null if the duration is invalid, negative, or equal to or greater than 24 hours.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Times
   * @param {Object} opts - options
   * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
   * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
   * @param {boolean} [opts.includePrefix=false] - include the `T` prefix
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @example Duration.fromObject({ hours: 11 }).toISOTime() //=> '11:00:00.000'
   * @example Duration.fromObject({ hours: 11 }).toISOTime({ suppressMilliseconds: true }) //=> '11:00:00'
   * @example Duration.fromObject({ hours: 11 }).toISOTime({ suppressSeconds: true }) //=> '11:00'
   * @example Duration.fromObject({ hours: 11 }).toISOTime({ includePrefix: true }) //=> 'T11:00:00.000'
   * @example Duration.fromObject({ hours: 11 }).toISOTime({ format: 'basic' }) //=> '110000.000'
   * @return {string}
   */
  toISOTime(opts = {}) {
    if (!this.isValid) return null;
    const millis = this.toMillis();
    if (millis < 0 || millis >= 864e5) return null;
    opts = {
      suppressMilliseconds: false,
      suppressSeconds: false,
      includePrefix: false,
      format: "extended",
      ...opts,
      includeOffset: false
    };
    const dateTime = DateTime$1.fromMillis(millis, { zone: "UTC" });
    return dateTime.toISOTime(opts);
  }
  /**
   * Returns an ISO 8601 representation of this Duration appropriate for use in JSON.
   * @return {string}
   */
  toJSON() {
    return this.toISO();
  }
  /**
   * Returns an ISO 8601 representation of this Duration appropriate for use in debugging.
   * @return {string}
   */
  toString() {
    return this.toISO();
  }
  /**
   * Returns an milliseconds value of this Duration.
   * @return {number}
   */
  toMillis() {
    if (!this.isValid) return NaN;
    return durationToMillis$1(this.matrix, this.values);
  }
  /**
   * Returns an milliseconds value of this Duration. Alias of {@link toMillis}
   * @return {number}
   */
  valueOf() {
    return this.toMillis();
  }
  /**
   * Make this Duration longer by the specified amount. Return a newly-constructed Duration.
   * @param {Duration|Object|number} duration - The amount to add. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @return {Duration}
   */
  plus(duration2) {
    if (!this.isValid) return this;
    const dur = Duration.fromDurationLike(duration2), result = {};
    for (const k of orderedUnits$1$1) {
      if (hasOwnProperty$1(dur.values, k) || hasOwnProperty$1(this.values, k)) {
        result[k] = dur.get(k) + this.get(k);
      }
    }
    return clone$1$1(this, { values: result }, true);
  }
  /**
   * Make this Duration shorter by the specified amount. Return a newly-constructed Duration.
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @return {Duration}
   */
  minus(duration2) {
    if (!this.isValid) return this;
    const dur = Duration.fromDurationLike(duration2);
    return this.plus(dur.negate());
  }
  /**
   * Scale this Duration by the specified amount. Return a newly-constructed Duration.
   * @param {function} fn - The function to apply to each unit. Arity is 1 or 2: the value of the unit and, optionally, the unit name. Must return a number.
   * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnits(x => x * 2) //=> { hours: 2, minutes: 60 }
   * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnits((x, u) => u === "hours" ? x * 2 : x) //=> { hours: 2, minutes: 30 }
   * @return {Duration}
   */
  mapUnits(fn2) {
    if (!this.isValid) return this;
    const result = {};
    for (const k of Object.keys(this.values)) {
      result[k] = asNumber$1(fn2(this.values[k], k));
    }
    return clone$1$1(this, { values: result }, true);
  }
  /**
   * Get the value of unit.
   * @param {string} unit - a unit such as 'minute' or 'day'
   * @example Duration.fromObject({years: 2, days: 3}).get('years') //=> 2
   * @example Duration.fromObject({years: 2, days: 3}).get('months') //=> 0
   * @example Duration.fromObject({years: 2, days: 3}).get('days') //=> 3
   * @return {number}
   */
  get(unit) {
    return this[Duration.normalizeUnit(unit)];
  }
  /**
   * "Set" the values of specified units. Return a newly-constructed Duration.
   * @param {Object} values - a mapping of units to numbers
   * @example dur.set({ years: 2017 })
   * @example dur.set({ hours: 8, minutes: 30 })
   * @return {Duration}
   */
  set(values) {
    if (!this.isValid) return this;
    const mixed = { ...this.values, ...normalizeObject$1(values, Duration.normalizeUnit) };
    return clone$1$1(this, { values: mixed });
  }
  /**
   * "Set" the locale and/or numberingSystem.  Returns a newly-constructed Duration.
   * @example dur.reconfigure({ locale: 'en-GB' })
   * @return {Duration}
   */
  reconfigure({ locale, numberingSystem, conversionAccuracy, matrix } = {}) {
    const loc = this.loc.clone({ locale, numberingSystem });
    const opts = { loc, matrix, conversionAccuracy };
    return clone$1$1(this, opts);
  }
  /**
   * Return the length of the duration in the specified unit.
   * @param {string} unit - a unit such as 'minutes' or 'days'
   * @example Duration.fromObject({years: 1}).as('days') //=> 365
   * @example Duration.fromObject({years: 1}).as('months') //=> 12
   * @example Duration.fromObject({hours: 60}).as('days') //=> 2.5
   * @return {number}
   */
  as(unit) {
    return this.isValid ? this.shiftTo(unit).get(unit) : NaN;
  }
  /**
   * Reduce this Duration to its canonical representation in its current units.
   * Assuming the overall value of the Duration is positive, this means:
   * - excessive values for lower-order units are converted to higher-order units (if possible, see first and second example)
   * - negative lower-order units are converted to higher order units (there must be such a higher order unit, otherwise
   *   the overall value would be negative, see second example)
   * - fractional values for higher-order units are converted to lower-order units (if possible, see fourth example)
   *
   * If the overall value is negative, the result of this method is equivalent to `this.negate().normalize().negate()`.
   * @example Duration.fromObject({ years: 2, days: 5000 }).normalize().toObject() //=> { years: 15, days: 255 }
   * @example Duration.fromObject({ days: 5000 }).normalize().toObject() //=> { days: 5000 }
   * @example Duration.fromObject({ hours: 12, minutes: -45 }).normalize().toObject() //=> { hours: 11, minutes: 15 }
   * @example Duration.fromObject({ years: 2.5, days: 0, hours: 0 }).normalize().toObject() //=> { years: 2, days: 182, hours: 12 }
   * @return {Duration}
   */
  normalize() {
    if (!this.isValid) return this;
    const vals = this.toObject();
    normalizeValues$1(this.matrix, vals);
    return clone$1$1(this, { values: vals }, true);
  }
  /**
   * Rescale units to its largest representation
   * @example Duration.fromObject({ milliseconds: 90000 }).rescale().toObject() //=> { minutes: 1, seconds: 30 }
   * @return {Duration}
   */
  rescale() {
    if (!this.isValid) return this;
    const vals = removeZeroes$1(this.normalize().shiftToAll().toObject());
    return clone$1$1(this, { values: vals }, true);
  }
  /**
   * Convert this Duration into its representation in a different set of units.
   * @example Duration.fromObject({ hours: 1, seconds: 30 }).shiftTo('minutes', 'milliseconds').toObject() //=> { minutes: 60, milliseconds: 30000 }
   * @return {Duration}
   */
  shiftTo(...units) {
    if (!this.isValid) return this;
    if (units.length === 0) {
      return this;
    }
    units = units.map((u) => Duration.normalizeUnit(u));
    const built = {}, accumulated = {}, vals = this.toObject();
    let lastUnit;
    for (const k of orderedUnits$1$1) {
      if (units.indexOf(k) >= 0) {
        lastUnit = k;
        let own = 0;
        for (const ak in accumulated) {
          own += this.matrix[ak][k] * accumulated[ak];
          accumulated[ak] = 0;
        }
        if (isNumber$3(vals[k])) {
          own += vals[k];
        }
        const i = Math.trunc(own);
        built[k] = i;
        accumulated[k] = (own * 1e3 - i * 1e3) / 1e3;
      } else if (isNumber$3(vals[k])) {
        accumulated[k] = vals[k];
      }
    }
    for (const key in accumulated) {
      if (accumulated[key] !== 0) {
        built[lastUnit] += key === lastUnit ? accumulated[key] : accumulated[key] / this.matrix[lastUnit][key];
      }
    }
    normalizeValues$1(this.matrix, built);
    return clone$1$1(this, { values: built }, true);
  }
  /**
   * Shift this Duration to all available units.
   * Same as shiftTo("years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds")
   * @return {Duration}
   */
  shiftToAll() {
    if (!this.isValid) return this;
    return this.shiftTo(
      "years",
      "months",
      "weeks",
      "days",
      "hours",
      "minutes",
      "seconds",
      "milliseconds"
    );
  }
  /**
   * Return the negative of this Duration.
   * @example Duration.fromObject({ hours: 1, seconds: 30 }).negate().toObject() //=> { hours: -1, seconds: -30 }
   * @return {Duration}
   */
  negate() {
    if (!this.isValid) return this;
    const negated = {};
    for (const k of Object.keys(this.values)) {
      negated[k] = this.values[k] === 0 ? 0 : -this.values[k];
    }
    return clone$1$1(this, { values: negated }, true);
  }
  /**
   * Get the years.
   * @type {number}
   */
  get years() {
    return this.isValid ? this.values.years || 0 : NaN;
  }
  /**
   * Get the quarters.
   * @type {number}
   */
  get quarters() {
    return this.isValid ? this.values.quarters || 0 : NaN;
  }
  /**
   * Get the months.
   * @type {number}
   */
  get months() {
    return this.isValid ? this.values.months || 0 : NaN;
  }
  /**
   * Get the weeks
   * @type {number}
   */
  get weeks() {
    return this.isValid ? this.values.weeks || 0 : NaN;
  }
  /**
   * Get the days.
   * @type {number}
   */
  get days() {
    return this.isValid ? this.values.days || 0 : NaN;
  }
  /**
   * Get the hours.
   * @type {number}
   */
  get hours() {
    return this.isValid ? this.values.hours || 0 : NaN;
  }
  /**
   * Get the minutes.
   * @type {number}
   */
  get minutes() {
    return this.isValid ? this.values.minutes || 0 : NaN;
  }
  /**
   * Get the seconds.
   * @return {number}
   */
  get seconds() {
    return this.isValid ? this.values.seconds || 0 : NaN;
  }
  /**
   * Get the milliseconds.
   * @return {number}
   */
  get milliseconds() {
    return this.isValid ? this.values.milliseconds || 0 : NaN;
  }
  /**
   * Returns whether the Duration is invalid. Invalid durations are returned by diff operations
   * on invalid DateTimes or Intervals.
   * @return {boolean}
   */
  get isValid() {
    return this.invalid === null;
  }
  /**
   * Returns an error code if this Duration became invalid, or null if the Duration is valid
   * @return {string}
   */
  get invalidReason() {
    return this.invalid ? this.invalid.reason : null;
  }
  /**
   * Returns an explanation of why this Duration became invalid, or null if the Duration is valid
   * @type {string}
   */
  get invalidExplanation() {
    return this.invalid ? this.invalid.explanation : null;
  }
  /**
   * Equality check
   * Two Durations are equal iff they have the same units and the same values for each unit.
   * @param {Duration} other
   * @return {boolean}
   */
  equals(other) {
    if (!this.isValid || !other.isValid) {
      return false;
    }
    if (!this.loc.equals(other.loc)) {
      return false;
    }
    function eq(v1, v2) {
      if (v1 === void 0 || v1 === 0) return v2 === void 0 || v2 === 0;
      return v1 === v2;
    }
    for (const u of orderedUnits$1$1) {
      if (!eq(this.values[u], other.values[u])) {
        return false;
      }
    }
    return true;
  }
};
const INVALID$1$1 = "Invalid Interval";
function validateStartEnd$1(start2, end2) {
  if (!start2 || !start2.isValid) {
    return Interval$1.invalid("missing or invalid start");
  } else if (!end2 || !end2.isValid) {
    return Interval$1.invalid("missing or invalid end");
  } else if (end2 < start2) {
    return Interval$1.invalid(
      "end before start",
      `The end of an interval must be after its start, but you had start=${start2.toISO()} and end=${end2.toISO()}`
    );
  } else {
    return null;
  }
}
let Interval$1 = class Interval {
  /**
   * @private
   */
  constructor(config) {
    this.s = config.start;
    this.e = config.end;
    this.invalid = config.invalid || null;
    this.isLuxonInterval = true;
  }
  /**
   * Create an invalid Interval.
   * @param {string} reason - simple string of why this Interval is invalid. Should not contain parameters or anything else data-dependent
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {Interval}
   */
  static invalid(reason, explanation = null) {
    if (!reason) {
      throw new InvalidArgumentError$1("need to specify a reason the Interval is invalid");
    }
    const invalid = reason instanceof Invalid$1 ? reason : new Invalid$1(reason, explanation);
    if (Settings$1.throwOnInvalid) {
      throw new InvalidIntervalError$1(invalid);
    } else {
      return new Interval({ invalid });
    }
  }
  /**
   * Create an Interval from a start DateTime and an end DateTime. Inclusive of the start but not the end.
   * @param {DateTime|Date|Object} start
   * @param {DateTime|Date|Object} end
   * @return {Interval}
   */
  static fromDateTimes(start2, end2) {
    const builtStart = friendlyDateTime$1(start2), builtEnd = friendlyDateTime$1(end2);
    const validateError = validateStartEnd$1(builtStart, builtEnd);
    if (validateError == null) {
      return new Interval({
        start: builtStart,
        end: builtEnd
      });
    } else {
      return validateError;
    }
  }
  /**
   * Create an Interval from a start DateTime and a Duration to extend to.
   * @param {DateTime|Date|Object} start
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  static after(start2, duration2) {
    const dur = Duration$1.fromDurationLike(duration2), dt = friendlyDateTime$1(start2);
    return Interval.fromDateTimes(dt, dt.plus(dur));
  }
  /**
   * Create an Interval from an end DateTime and a Duration to extend backwards to.
   * @param {DateTime|Date|Object} end
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  static before(end2, duration2) {
    const dur = Duration$1.fromDurationLike(duration2), dt = friendlyDateTime$1(end2);
    return Interval.fromDateTimes(dt.minus(dur), dt);
  }
  /**
   * Create an Interval from an ISO 8601 string.
   * Accepts `<start>/<end>`, `<start>/<duration>`, and `<duration>/<end>` formats.
   * @param {string} text - the ISO string to parse
   * @param {Object} [opts] - options to pass {@link DateTime#fromISO} and optionally {@link Duration#fromISO}
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @return {Interval}
   */
  static fromISO(text2, opts) {
    const [s2, e] = (text2 || "").split("/", 2);
    if (s2 && e) {
      let start2, startIsValid;
      try {
        start2 = DateTime$1.fromISO(s2, opts);
        startIsValid = start2.isValid;
      } catch (e2) {
        startIsValid = false;
      }
      let end2, endIsValid;
      try {
        end2 = DateTime$1.fromISO(e, opts);
        endIsValid = end2.isValid;
      } catch (e2) {
        endIsValid = false;
      }
      if (startIsValid && endIsValid) {
        return Interval.fromDateTimes(start2, end2);
      }
      if (startIsValid) {
        const dur = Duration$1.fromISO(e, opts);
        if (dur.isValid) {
          return Interval.after(start2, dur);
        }
      } else if (endIsValid) {
        const dur = Duration$1.fromISO(s2, opts);
        if (dur.isValid) {
          return Interval.before(end2, dur);
        }
      }
    }
    return Interval.invalid("unparsable", `the input "${text2}" can't be parsed as ISO 8601`);
  }
  /**
   * Check if an object is an Interval. Works across context boundaries
   * @param {object} o
   * @return {boolean}
   */
  static isInterval(o) {
    return o && o.isLuxonInterval || false;
  }
  /**
   * Returns the start of the Interval
   * @type {DateTime}
   */
  get start() {
    return this.isValid ? this.s : null;
  }
  /**
   * Returns the end of the Interval
   * @type {DateTime}
   */
  get end() {
    return this.isValid ? this.e : null;
  }
  /**
   * Returns whether this Interval's end is at least its start, meaning that the Interval isn't 'backwards'.
   * @type {boolean}
   */
  get isValid() {
    return this.invalidReason === null;
  }
  /**
   * Returns an error code if this Interval is invalid, or null if the Interval is valid
   * @type {string}
   */
  get invalidReason() {
    return this.invalid ? this.invalid.reason : null;
  }
  /**
   * Returns an explanation of why this Interval became invalid, or null if the Interval is valid
   * @type {string}
   */
  get invalidExplanation() {
    return this.invalid ? this.invalid.explanation : null;
  }
  /**
   * Returns the length of the Interval in the specified unit.
   * @param {string} unit - the unit (such as 'hours' or 'days') to return the length in.
   * @return {number}
   */
  length(unit = "milliseconds") {
    return this.isValid ? this.toDuration(...[unit]).get(unit) : NaN;
  }
  /**
   * Returns the count of minutes, hours, days, months, or years included in the Interval, even in part.
   * Unlike {@link Interval#length} this counts sections of the calendar, not periods of time, e.g. specifying 'day'
   * asks 'what dates are included in this interval?', not 'how many days long is this interval?'
   * @param {string} [unit='milliseconds'] - the unit of time to count.
   * @return {number}
   */
  count(unit = "milliseconds") {
    if (!this.isValid) return NaN;
    const start2 = this.start.startOf(unit), end2 = this.end.startOf(unit);
    return Math.floor(end2.diff(start2, unit).get(unit)) + (end2.valueOf() !== this.end.valueOf());
  }
  /**
   * Returns whether this Interval's start and end are both in the same unit of time
   * @param {string} unit - the unit of time to check sameness on
   * @return {boolean}
   */
  hasSame(unit) {
    return this.isValid ? this.isEmpty() || this.e.minus(1).hasSame(this.s, unit) : false;
  }
  /**
   * Return whether this Interval has the same start and end DateTimes.
   * @return {boolean}
   */
  isEmpty() {
    return this.s.valueOf() === this.e.valueOf();
  }
  /**
   * Return whether this Interval's start is after the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */
  isAfter(dateTime) {
    if (!this.isValid) return false;
    return this.s > dateTime;
  }
  /**
   * Return whether this Interval's end is before the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */
  isBefore(dateTime) {
    if (!this.isValid) return false;
    return this.e <= dateTime;
  }
  /**
   * Return whether this Interval contains the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */
  contains(dateTime) {
    if (!this.isValid) return false;
    return this.s <= dateTime && this.e > dateTime;
  }
  /**
   * "Sets" the start and/or end dates. Returns a newly-constructed Interval.
   * @param {Object} values - the values to set
   * @param {DateTime} values.start - the starting DateTime
   * @param {DateTime} values.end - the ending DateTime
   * @return {Interval}
   */
  set({ start: start2, end: end2 } = {}) {
    if (!this.isValid) return this;
    return Interval.fromDateTimes(start2 || this.s, end2 || this.e);
  }
  /**
   * Split this Interval at each of the specified DateTimes
   * @param {...DateTime} dateTimes - the unit of time to count.
   * @return {Array}
   */
  splitAt(...dateTimes) {
    if (!this.isValid) return [];
    const sorted = dateTimes.map(friendlyDateTime$1).filter((d) => this.contains(d)).sort(), results = [];
    let { s: s2 } = this, i = 0;
    while (s2 < this.e) {
      const added = sorted[i] || this.e, next = +added > +this.e ? this.e : added;
      results.push(Interval.fromDateTimes(s2, next));
      s2 = next;
      i += 1;
    }
    return results;
  }
  /**
   * Split this Interval into smaller Intervals, each of the specified length.
   * Left over time is grouped into a smaller interval
   * @param {Duration|Object|number} duration - The length of each resulting interval.
   * @return {Array}
   */
  splitBy(duration2) {
    const dur = Duration$1.fromDurationLike(duration2);
    if (!this.isValid || !dur.isValid || dur.as("milliseconds") === 0) {
      return [];
    }
    let { s: s2 } = this, idx = 1, next;
    const results = [];
    while (s2 < this.e) {
      const added = this.start.plus(dur.mapUnits((x2) => x2 * idx));
      next = +added > +this.e ? this.e : added;
      results.push(Interval.fromDateTimes(s2, next));
      s2 = next;
      idx += 1;
    }
    return results;
  }
  /**
   * Split this Interval into the specified number of smaller intervals.
   * @param {number} numberOfParts - The number of Intervals to divide the Interval into.
   * @return {Array}
   */
  divideEqually(numberOfParts) {
    if (!this.isValid) return [];
    return this.splitBy(this.length() / numberOfParts).slice(0, numberOfParts);
  }
  /**
   * Return whether this Interval overlaps with the specified Interval
   * @param {Interval} other
   * @return {boolean}
   */
  overlaps(other) {
    return this.e > other.s && this.s < other.e;
  }
  /**
   * Return whether this Interval's end is adjacent to the specified Interval's start.
   * @param {Interval} other
   * @return {boolean}
   */
  abutsStart(other) {
    if (!this.isValid) return false;
    return +this.e === +other.s;
  }
  /**
   * Return whether this Interval's start is adjacent to the specified Interval's end.
   * @param {Interval} other
   * @return {boolean}
   */
  abutsEnd(other) {
    if (!this.isValid) return false;
    return +other.e === +this.s;
  }
  /**
   * Return whether this Interval engulfs the start and end of the specified Interval.
   * @param {Interval} other
   * @return {boolean}
   */
  engulfs(other) {
    if (!this.isValid) return false;
    return this.s <= other.s && this.e >= other.e;
  }
  /**
   * Return whether this Interval has the same start and end as the specified Interval.
   * @param {Interval} other
   * @return {boolean}
   */
  equals(other) {
    if (!this.isValid || !other.isValid) {
      return false;
    }
    return this.s.equals(other.s) && this.e.equals(other.e);
  }
  /**
   * Return an Interval representing the intersection of this Interval and the specified Interval.
   * Specifically, the resulting Interval has the maximum start time and the minimum end time of the two Intervals.
   * Returns null if the intersection is empty, meaning, the intervals don't intersect.
   * @param {Interval} other
   * @return {Interval}
   */
  intersection(other) {
    if (!this.isValid) return this;
    const s2 = this.s > other.s ? this.s : other.s, e = this.e < other.e ? this.e : other.e;
    if (s2 >= e) {
      return null;
    } else {
      return Interval.fromDateTimes(s2, e);
    }
  }
  /**
   * Return an Interval representing the union of this Interval and the specified Interval.
   * Specifically, the resulting Interval has the minimum start time and the maximum end time of the two Intervals.
   * @param {Interval} other
   * @return {Interval}
   */
  union(other) {
    if (!this.isValid) return this;
    const s2 = this.s < other.s ? this.s : other.s, e = this.e > other.e ? this.e : other.e;
    return Interval.fromDateTimes(s2, e);
  }
  /**
   * Merge an array of Intervals into a equivalent minimal set of Intervals.
   * Combines overlapping and adjacent Intervals.
   * @param {Array} intervals
   * @return {Array}
   */
  static merge(intervals) {
    const [found, final] = intervals.sort((a, b) => a.s - b.s).reduce(
      ([sofar, current], item2) => {
        if (!current) {
          return [sofar, item2];
        } else if (current.overlaps(item2) || current.abutsStart(item2)) {
          return [sofar, current.union(item2)];
        } else {
          return [sofar.concat([current]), item2];
        }
      },
      [[], null]
    );
    if (final) {
      found.push(final);
    }
    return found;
  }
  /**
   * Return an array of Intervals representing the spans of time that only appear in one of the specified Intervals.
   * @param {Array} intervals
   * @return {Array}
   */
  static xor(intervals) {
    let start2 = null, currentCount = 0;
    const results = [], ends = intervals.map((i) => [
      { time: i.s, type: "s" },
      { time: i.e, type: "e" }
    ]), flattened = Array.prototype.concat(...ends), arr = flattened.sort((a, b) => a.time - b.time);
    for (const i of arr) {
      currentCount += i.type === "s" ? 1 : -1;
      if (currentCount === 1) {
        start2 = i.time;
      } else {
        if (start2 && +start2 !== +i.time) {
          results.push(Interval.fromDateTimes(start2, i.time));
        }
        start2 = null;
      }
    }
    return Interval.merge(results);
  }
  /**
   * Return an Interval representing the span of time in this Interval that doesn't overlap with any of the specified Intervals.
   * @param {...Interval} intervals
   * @return {Array}
   */
  difference(...intervals) {
    return Interval.xor([this].concat(intervals)).map((i) => this.intersection(i)).filter((i) => i && !i.isEmpty());
  }
  /**
   * Returns a string representation of this Interval appropriate for debugging.
   * @return {string}
   */
  toString() {
    if (!this.isValid) return INVALID$1$1;
    return `[${this.s.toISO()} – ${this.e.toISO()})`;
  }
  /**
   * Returns a localized string representing this Interval. Accepts the same options as the
   * Intl.DateTimeFormat constructor and any presets defined by Luxon, such as
   * {@link DateTime.DATE_FULL} or {@link DateTime.TIME_SIMPLE}. The exact behavior of this method
   * is browser-specific, but in general it will return an appropriate representation of the
   * Interval in the assigned locale. Defaults to the system's locale if no locale has been
   * specified.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param {Object} [formatOpts=DateTime.DATE_SHORT] - Either a DateTime preset or
   * Intl.DateTimeFormat constructor options.
   * @param {Object} opts - Options to override the configuration of the start DateTime.
   * @example Interval.fromISO('2022-11-07T09:00Z/2022-11-08T09:00Z').toLocaleString(); //=> 11/7/2022 – 11/8/2022
   * @example Interval.fromISO('2022-11-07T09:00Z/2022-11-08T09:00Z').toLocaleString(DateTime.DATE_FULL); //=> November 7 – 8, 2022
   * @example Interval.fromISO('2022-11-07T09:00Z/2022-11-08T09:00Z').toLocaleString(DateTime.DATE_FULL, { locale: 'fr-FR' }); //=> 7–8 novembre 2022
   * @example Interval.fromISO('2022-11-07T17:00Z/2022-11-07T19:00Z').toLocaleString(DateTime.TIME_SIMPLE); //=> 6:00 – 8:00 PM
   * @example Interval.fromISO('2022-11-07T17:00Z/2022-11-07T19:00Z').toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }); //=> Mon, Nov 07, 6:00 – 8:00 p
   * @return {string}
   */
  toLocaleString(formatOpts = DATE_SHORT$1, opts = {}) {
    return this.isValid ? Formatter$1.create(this.s.loc.clone(opts), formatOpts).formatInterval(this) : INVALID$1$1;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this Interval.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime#toISO}
   * @return {string}
   */
  toISO(opts) {
    if (!this.isValid) return INVALID$1$1;
    return `${this.s.toISO(opts)}/${this.e.toISO(opts)}`;
  }
  /**
   * Returns an ISO 8601-compliant string representation of date of this Interval.
   * The time components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @return {string}
   */
  toISODate() {
    if (!this.isValid) return INVALID$1$1;
    return `${this.s.toISODate()}/${this.e.toISODate()}`;
  }
  /**
   * Returns an ISO 8601-compliant string representation of time of this Interval.
   * The date components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime#toISO}
   * @return {string}
   */
  toISOTime(opts) {
    if (!this.isValid) return INVALID$1$1;
    return `${this.s.toISOTime(opts)}/${this.e.toISOTime(opts)}`;
  }
  /**
   * Returns a string representation of this Interval formatted according to the specified format
   * string. **You may not want this.** See {@link Interval#toLocaleString} for a more flexible
   * formatting tool.
   * @param {string} dateFormat - The format string. This string formats the start and end time.
   * See {@link DateTime#toFormat} for details.
   * @param {Object} opts - Options.
   * @param {string} [opts.separator =  ' – '] - A separator to place between the start and end
   * representations.
   * @return {string}
   */
  toFormat(dateFormat, { separator = " – " } = {}) {
    if (!this.isValid) return INVALID$1$1;
    return `${this.s.toFormat(dateFormat)}${separator}${this.e.toFormat(dateFormat)}`;
  }
  /**
   * Return a Duration representing the time spanned by this interval.
   * @param {string|string[]} [unit=['milliseconds']] - the unit or units (such as 'hours' or 'days') to include in the duration.
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @example Interval.fromDateTimes(dt1, dt2).toDuration().toObject() //=> { milliseconds: 88489257 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration('days').toObject() //=> { days: 1.0241812152777778 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration(['hours', 'minutes']).toObject() //=> { hours: 24, minutes: 34.82095 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration(['hours', 'minutes', 'seconds']).toObject() //=> { hours: 24, minutes: 34, seconds: 49.257 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration('seconds').toObject() //=> { seconds: 88489.257 }
   * @return {Duration}
   */
  toDuration(unit, opts) {
    if (!this.isValid) {
      return Duration$1.invalid(this.invalidReason);
    }
    return this.e.diff(this.s, unit, opts);
  }
  /**
   * Run mapFn on the interval start and end, returning a new Interval from the resulting DateTimes
   * @param {function} mapFn
   * @return {Interval}
   * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.toUTC())
   * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.plus({ hours: 2 }))
   */
  mapEndpoints(mapFn) {
    return Interval.fromDateTimes(mapFn(this.s), mapFn(this.e));
  }
};
let Info$1 = class Info {
  /**
   * Return whether the specified zone contains a DST.
   * @param {string|Zone} [zone='local'] - Zone to check. Defaults to the environment's local zone.
   * @return {boolean}
   */
  static hasDST(zone = Settings$1.defaultZone) {
    const proto = DateTime$1.now().setZone(zone).set({ month: 12 });
    return !zone.isUniversal && proto.offset !== proto.set({ month: 6 }).offset;
  }
  /**
   * Return whether the specified zone is a valid IANA specifier.
   * @param {string} zone - Zone to check
   * @return {boolean}
   */
  static isValidIANAZone(zone) {
    return IANAZone$1.isValidZone(zone);
  }
  /**
   * Converts the input into a {@link Zone} instance.
   *
   * * If `input` is already a Zone instance, it is returned unchanged.
   * * If `input` is a string containing a valid time zone name, a Zone instance
   *   with that name is returned.
   * * If `input` is a string that doesn't refer to a known time zone, a Zone
   *   instance with {@link Zone#isValid} == false is returned.
   * * If `input is a number, a Zone instance with the specified fixed offset
   *   in minutes is returned.
   * * If `input` is `null` or `undefined`, the default zone is returned.
   * @param {string|Zone|number} [input] - the value to be converted
   * @return {Zone}
   */
  static normalizeZone(input) {
    return normalizeZone$1(input, Settings$1.defaultZone);
  }
  /**
   * Return an array of standalone month names.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param {string} [length='long'] - the length of the month representation, such as "numeric", "2-digit", "narrow", "short", "long"
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @param {string} [opts.outputCalendar='gregory'] - the calendar
   * @example Info.months()[0] //=> 'January'
   * @example Info.months('short')[0] //=> 'Jan'
   * @example Info.months('numeric')[0] //=> '1'
   * @example Info.months('short', { locale: 'fr-CA' } )[0] //=> 'janv.'
   * @example Info.months('numeric', { locale: 'ar' })[0] //=> '١'
   * @example Info.months('long', { outputCalendar: 'islamic' })[0] //=> 'Rabiʻ I'
   * @return {Array}
   */
  static months(length2 = "long", { locale = null, numberingSystem = null, locObj = null, outputCalendar = "gregory" } = {}) {
    return (locObj || Locale$1.create(locale, numberingSystem, outputCalendar)).months(length2);
  }
  /**
   * Return an array of format month names.
   * Format months differ from standalone months in that they're meant to appear next to the day of the month. In some languages, that
   * changes the string.
   * See {@link Info#months}
   * @param {string} [length='long'] - the length of the month representation, such as "numeric", "2-digit", "narrow", "short", "long"
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @param {string} [opts.outputCalendar='gregory'] - the calendar
   * @return {Array}
   */
  static monthsFormat(length2 = "long", { locale = null, numberingSystem = null, locObj = null, outputCalendar = "gregory" } = {}) {
    return (locObj || Locale$1.create(locale, numberingSystem, outputCalendar)).months(length2, true);
  }
  /**
   * Return an array of standalone week names.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param {string} [length='long'] - the length of the weekday representation, such as "narrow", "short", "long".
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @example Info.weekdays()[0] //=> 'Monday'
   * @example Info.weekdays('short')[0] //=> 'Mon'
   * @example Info.weekdays('short', { locale: 'fr-CA' })[0] //=> 'lun.'
   * @example Info.weekdays('short', { locale: 'ar' })[0] //=> 'الاثنين'
   * @return {Array}
   */
  static weekdays(length2 = "long", { locale = null, numberingSystem = null, locObj = null } = {}) {
    return (locObj || Locale$1.create(locale, numberingSystem, null)).weekdays(length2);
  }
  /**
   * Return an array of format week names.
   * Format weekdays differ from standalone weekdays in that they're meant to appear next to more date information. In some languages, that
   * changes the string.
   * See {@link Info#weekdays}
   * @param {string} [length='long'] - the length of the month representation, such as "narrow", "short", "long".
   * @param {Object} opts - options
   * @param {string} [opts.locale=null] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @return {Array}
   */
  static weekdaysFormat(length2 = "long", { locale = null, numberingSystem = null, locObj = null } = {}) {
    return (locObj || Locale$1.create(locale, numberingSystem, null)).weekdays(length2, true);
  }
  /**
   * Return an array of meridiems.
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @example Info.meridiems() //=> [ 'AM', 'PM' ]
   * @example Info.meridiems({ locale: 'my' }) //=> [ 'နံနက်', 'ညနေ' ]
   * @return {Array}
   */
  static meridiems({ locale = null } = {}) {
    return Locale$1.create(locale).meridiems();
  }
  /**
   * Return an array of eras, such as ['BC', 'AD']. The locale can be specified, but the calendar system is always Gregorian.
   * @param {string} [length='short'] - the length of the era representation, such as "short" or "long".
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @example Info.eras() //=> [ 'BC', 'AD' ]
   * @example Info.eras('long') //=> [ 'Before Christ', 'Anno Domini' ]
   * @example Info.eras('long', { locale: 'fr' }) //=> [ 'avant Jésus-Christ', 'après Jésus-Christ' ]
   * @return {Array}
   */
  static eras(length2 = "short", { locale = null } = {}) {
    return Locale$1.create(locale, null, "gregory").eras(length2);
  }
  /**
   * Return the set of available features in this environment.
   * Some features of Luxon are not available in all environments. For example, on older browsers, relative time formatting support is not available. Use this function to figure out if that's the case.
   * Keys:
   * * `relative`: whether this environment supports relative time formatting
   * @example Info.features() //=> { relative: false }
   * @return {Object}
   */
  static features() {
    return { relative: hasRelative$1() };
  }
};
function dayDiff$1(earlier, later) {
  const utcDayStart = (dt) => dt.toUTC(0, { keepLocalTime: true }).startOf("day").valueOf(), ms = utcDayStart(later) - utcDayStart(earlier);
  return Math.floor(Duration$1.fromMillis(ms).as("days"));
}
function highOrderDiffs$1(cursor, later, units) {
  const differs = [
    ["years", (a, b) => b.year - a.year],
    ["quarters", (a, b) => b.quarter - a.quarter + (b.year - a.year) * 4],
    ["months", (a, b) => b.month - a.month + (b.year - a.year) * 12],
    [
      "weeks",
      (a, b) => {
        const days = dayDiff$1(a, b);
        return (days - days % 7) / 7;
      }
    ],
    ["days", dayDiff$1]
  ];
  const results = {};
  const earlier = cursor;
  let lowestOrder, highWater;
  for (const [unit, differ] of differs) {
    if (units.indexOf(unit) >= 0) {
      lowestOrder = unit;
      results[unit] = differ(cursor, later);
      highWater = earlier.plus(results);
      if (highWater > later) {
        results[unit]--;
        cursor = earlier.plus(results);
        if (cursor > later) {
          highWater = cursor;
          results[unit]--;
          cursor = earlier.plus(results);
        }
      } else {
        cursor = highWater;
      }
    }
  }
  return [cursor, results, highWater, lowestOrder];
}
function diff$1(earlier, later, units, opts) {
  let [cursor, results, highWater, lowestOrder] = highOrderDiffs$1(earlier, later, units);
  const remainingMillis = later - cursor;
  const lowerOrderUnits = units.filter(
    (u) => ["hours", "minutes", "seconds", "milliseconds"].indexOf(u) >= 0
  );
  if (lowerOrderUnits.length === 0) {
    if (highWater < later) {
      highWater = cursor.plus({ [lowestOrder]: 1 });
    }
    if (highWater !== cursor) {
      results[lowestOrder] = (results[lowestOrder] || 0) + remainingMillis / (highWater - cursor);
    }
  }
  const duration2 = Duration$1.fromObject(results, opts);
  if (lowerOrderUnits.length > 0) {
    return Duration$1.fromMillis(remainingMillis, opts).shiftTo(...lowerOrderUnits).plus(duration2);
  } else {
    return duration2;
  }
}
const numberingSystems$1 = {
  arab: "[٠-٩]",
  arabext: "[۰-۹]",
  bali: "[᭐-᭙]",
  beng: "[০-৯]",
  deva: "[०-९]",
  fullwide: "[０-９]",
  gujr: "[૦-૯]",
  hanidec: "[〇|一|二|三|四|五|六|七|八|九]",
  khmr: "[០-៩]",
  knda: "[೦-೯]",
  laoo: "[໐-໙]",
  limb: "[᥆-᥏]",
  mlym: "[൦-൯]",
  mong: "[᠐-᠙]",
  mymr: "[၀-၉]",
  orya: "[୦-୯]",
  tamldec: "[௦-௯]",
  telu: "[౦-౯]",
  thai: "[๐-๙]",
  tibt: "[༠-༩]",
  latn: "\\d"
};
const numberingSystemsUTF16$1 = {
  arab: [1632, 1641],
  arabext: [1776, 1785],
  bali: [6992, 7001],
  beng: [2534, 2543],
  deva: [2406, 2415],
  fullwide: [65296, 65303],
  gujr: [2790, 2799],
  khmr: [6112, 6121],
  knda: [3302, 3311],
  laoo: [3792, 3801],
  limb: [6470, 6479],
  mlym: [3430, 3439],
  mong: [6160, 6169],
  mymr: [4160, 4169],
  orya: [2918, 2927],
  tamldec: [3046, 3055],
  telu: [3174, 3183],
  thai: [3664, 3673],
  tibt: [3872, 3881]
};
const hanidecChars$1 = numberingSystems$1.hanidec.replace(/[\[|\]]/g, "").split("");
function parseDigits$1(str) {
  let value2 = parseInt(str, 10);
  if (isNaN(value2)) {
    value2 = "";
    for (let i = 0; i < str.length; i++) {
      const code2 = str.charCodeAt(i);
      if (str[i].search(numberingSystems$1.hanidec) !== -1) {
        value2 += hanidecChars$1.indexOf(str[i]);
      } else {
        for (const key in numberingSystemsUTF16$1) {
          const [min2, max2] = numberingSystemsUTF16$1[key];
          if (code2 >= min2 && code2 <= max2) {
            value2 += code2 - min2;
          }
        }
      }
    }
    return parseInt(value2, 10);
  } else {
    return value2;
  }
}
function digitRegex$1({ numberingSystem }, append = "") {
  return new RegExp(`${numberingSystems$1[numberingSystem || "latn"]}${append}`);
}
const MISSING_FTP$1 = "missing Intl.DateTimeFormat.formatToParts support";
function intUnit$1(regex, post = (i) => i) {
  return { regex, deser: ([s2]) => post(parseDigits$1(s2)) };
}
const NBSP$1 = String.fromCharCode(160);
const spaceOrNBSP$1 = `[ ${NBSP$1}]`;
const spaceOrNBSPRegExp$1 = new RegExp(spaceOrNBSP$1, "g");
function fixListRegex$1(s2) {
  return s2.replace(/\./g, "\\.?").replace(spaceOrNBSPRegExp$1, spaceOrNBSP$1);
}
function stripInsensitivities$1(s2) {
  return s2.replace(/\./g, "").replace(spaceOrNBSPRegExp$1, " ").toLowerCase();
}
function oneOf$1(strings, startIndex) {
  if (strings === null) {
    return null;
  } else {
    return {
      regex: RegExp(strings.map(fixListRegex$1).join("|")),
      deser: ([s2]) => strings.findIndex((i) => stripInsensitivities$1(s2) === stripInsensitivities$1(i)) + startIndex
    };
  }
}
function offset$3(regex, groups) {
  return { regex, deser: ([, h, m]) => signedOffset$1(h, m), groups };
}
function simple$1(regex) {
  return { regex, deser: ([s2]) => s2 };
}
function escapeToken$1(value2) {
  return value2.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}
function unitForToken$1(token, loc) {
  const one = digitRegex$1(loc), two = digitRegex$1(loc, "{2}"), three = digitRegex$1(loc, "{3}"), four = digitRegex$1(loc, "{4}"), six = digitRegex$1(loc, "{6}"), oneOrTwo = digitRegex$1(loc, "{1,2}"), oneToThree = digitRegex$1(loc, "{1,3}"), oneToSix = digitRegex$1(loc, "{1,6}"), oneToNine = digitRegex$1(loc, "{1,9}"), twoToFour = digitRegex$1(loc, "{2,4}"), fourToSix = digitRegex$1(loc, "{4,6}"), literal = (t) => ({ regex: RegExp(escapeToken$1(t.val)), deser: ([s2]) => s2, literal: true }), unitate = (t) => {
    if (token.literal) {
      return literal(t);
    }
    switch (t.val) {
      case "G":
        return oneOf$1(loc.eras("short"), 0);
      case "GG":
        return oneOf$1(loc.eras("long"), 0);
      case "y":
        return intUnit$1(oneToSix);
      case "yy":
        return intUnit$1(twoToFour, untruncateYear$1);
      case "yyyy":
        return intUnit$1(four);
      case "yyyyy":
        return intUnit$1(fourToSix);
      case "yyyyyy":
        return intUnit$1(six);
      case "M":
        return intUnit$1(oneOrTwo);
      case "MM":
        return intUnit$1(two);
      case "MMM":
        return oneOf$1(loc.months("short", true), 1);
      case "MMMM":
        return oneOf$1(loc.months("long", true), 1);
      case "L":
        return intUnit$1(oneOrTwo);
      case "LL":
        return intUnit$1(two);
      case "LLL":
        return oneOf$1(loc.months("short", false), 1);
      case "LLLL":
        return oneOf$1(loc.months("long", false), 1);
      case "d":
        return intUnit$1(oneOrTwo);
      case "dd":
        return intUnit$1(two);
      case "o":
        return intUnit$1(oneToThree);
      case "ooo":
        return intUnit$1(three);
      case "HH":
        return intUnit$1(two);
      case "H":
        return intUnit$1(oneOrTwo);
      case "hh":
        return intUnit$1(two);
      case "h":
        return intUnit$1(oneOrTwo);
      case "mm":
        return intUnit$1(two);
      case "m":
        return intUnit$1(oneOrTwo);
      case "q":
        return intUnit$1(oneOrTwo);
      case "qq":
        return intUnit$1(two);
      case "s":
        return intUnit$1(oneOrTwo);
      case "ss":
        return intUnit$1(two);
      case "S":
        return intUnit$1(oneToThree);
      case "SSS":
        return intUnit$1(three);
      case "u":
        return simple$1(oneToNine);
      case "uu":
        return simple$1(oneOrTwo);
      case "uuu":
        return intUnit$1(one);
      case "a":
        return oneOf$1(loc.meridiems(), 0);
      case "kkkk":
        return intUnit$1(four);
      case "kk":
        return intUnit$1(twoToFour, untruncateYear$1);
      case "W":
        return intUnit$1(oneOrTwo);
      case "WW":
        return intUnit$1(two);
      case "E":
      case "c":
        return intUnit$1(one);
      case "EEE":
        return oneOf$1(loc.weekdays("short", false), 1);
      case "EEEE":
        return oneOf$1(loc.weekdays("long", false), 1);
      case "ccc":
        return oneOf$1(loc.weekdays("short", true), 1);
      case "cccc":
        return oneOf$1(loc.weekdays("long", true), 1);
      case "Z":
      case "ZZ":
        return offset$3(new RegExp(`([+-]${oneOrTwo.source})(?::(${two.source}))?`), 2);
      case "ZZZ":
        return offset$3(new RegExp(`([+-]${oneOrTwo.source})(${two.source})?`), 2);
      case "z":
        return simple$1(/[a-z_+-/]{1,256}?/i);
      case " ":
        return simple$1(/[^\S\n\r]/);
      default:
        return literal(t);
    }
  };
  const unit = unitate(token) || {
    invalidReason: MISSING_FTP$1
  };
  unit.token = token;
  return unit;
}
const partTypeStyleToTokenVal$1 = {
  year: {
    "2-digit": "yy",
    numeric: "yyyyy"
  },
  month: {
    numeric: "M",
    "2-digit": "MM",
    short: "MMM",
    long: "MMMM"
  },
  day: {
    numeric: "d",
    "2-digit": "dd"
  },
  weekday: {
    short: "EEE",
    long: "EEEE"
  },
  dayperiod: "a",
  dayPeriod: "a",
  hour12: {
    numeric: "h",
    "2-digit": "hh"
  },
  hour24: {
    numeric: "H",
    "2-digit": "HH"
  },
  minute: {
    numeric: "m",
    "2-digit": "mm"
  },
  second: {
    numeric: "s",
    "2-digit": "ss"
  },
  timeZoneName: {
    long: "ZZZZZ",
    short: "ZZZ"
  }
};
function tokenForPart$1(part, formatOpts, resolvedOpts) {
  const { type, value: value2 } = part;
  if (type === "literal") {
    const isSpace = /^\s+$/.test(value2);
    return {
      literal: !isSpace,
      val: isSpace ? " " : value2
    };
  }
  const style2 = formatOpts[type];
  let actualType = type;
  if (type === "hour") {
    if (formatOpts.hour12 != null) {
      actualType = formatOpts.hour12 ? "hour12" : "hour24";
    } else if (formatOpts.hourCycle != null) {
      if (formatOpts.hourCycle === "h11" || formatOpts.hourCycle === "h12") {
        actualType = "hour12";
      } else {
        actualType = "hour24";
      }
    } else {
      actualType = resolvedOpts.hour12 ? "hour12" : "hour24";
    }
  }
  let val = partTypeStyleToTokenVal$1[actualType];
  if (typeof val === "object") {
    val = val[style2];
  }
  if (val) {
    return {
      literal: false,
      val
    };
  }
  return void 0;
}
function buildRegex$1(units) {
  const re = units.map((u) => u.regex).reduce((f, r) => `${f}(${r.source})`, "");
  return [`^${re}$`, units];
}
function match$1(input, regex, handlers) {
  const matches = input.match(regex);
  if (matches) {
    const all = {};
    let matchIndex = 1;
    for (const i in handlers) {
      if (hasOwnProperty$1(handlers, i)) {
        const h = handlers[i], groups = h.groups ? h.groups + 1 : 1;
        if (!h.literal && h.token) {
          all[h.token.val[0]] = h.deser(matches.slice(matchIndex, matchIndex + groups));
        }
        matchIndex += groups;
      }
    }
    return [matches, all];
  } else {
    return [matches, {}];
  }
}
function dateTimeFromMatches$1(matches) {
  const toField = (token) => {
    switch (token) {
      case "S":
        return "millisecond";
      case "s":
        return "second";
      case "m":
        return "minute";
      case "h":
      case "H":
        return "hour";
      case "d":
        return "day";
      case "o":
        return "ordinal";
      case "L":
      case "M":
        return "month";
      case "y":
        return "year";
      case "E":
      case "c":
        return "weekday";
      case "W":
        return "weekNumber";
      case "k":
        return "weekYear";
      case "q":
        return "quarter";
      default:
        return null;
    }
  };
  let zone = null;
  let specificOffset;
  if (!isUndefined$2(matches.z)) {
    zone = IANAZone$1.create(matches.z);
  }
  if (!isUndefined$2(matches.Z)) {
    if (!zone) {
      zone = new FixedOffsetZone$1(matches.Z);
    }
    specificOffset = matches.Z;
  }
  if (!isUndefined$2(matches.q)) {
    matches.M = (matches.q - 1) * 3 + 1;
  }
  if (!isUndefined$2(matches.h)) {
    if (matches.h < 12 && matches.a === 1) {
      matches.h += 12;
    } else if (matches.h === 12 && matches.a === 0) {
      matches.h = 0;
    }
  }
  if (matches.G === 0 && matches.y) {
    matches.y = -matches.y;
  }
  if (!isUndefined$2(matches.u)) {
    matches.S = parseMillis$1(matches.u);
  }
  const vals = Object.keys(matches).reduce((r, k) => {
    const f = toField(k);
    if (f) {
      r[f] = matches[k];
    }
    return r;
  }, {});
  return [vals, zone, specificOffset];
}
let dummyDateTimeCache$1 = null;
function getDummyDateTime$1() {
  if (!dummyDateTimeCache$1) {
    dummyDateTimeCache$1 = DateTime$1.fromMillis(1555555555555);
  }
  return dummyDateTimeCache$1;
}
function maybeExpandMacroToken$1(token, locale) {
  if (token.literal) {
    return token;
  }
  const formatOpts = Formatter$1.macroTokenToFormatOpts(token.val);
  const tokens2 = formatOptsToTokens$1(formatOpts, locale);
  if (tokens2 == null || tokens2.includes(void 0)) {
    return token;
  }
  return tokens2;
}
function expandMacroTokens$1(tokens2, locale) {
  return Array.prototype.concat(...tokens2.map((t) => maybeExpandMacroToken$1(t, locale)));
}
function explainFromTokens$1(locale, input, format2) {
  const tokens2 = expandMacroTokens$1(Formatter$1.parseFormat(format2), locale), units = tokens2.map((t) => unitForToken$1(t, locale)), disqualifyingUnit = units.find((t) => t.invalidReason);
  if (disqualifyingUnit) {
    return { input, tokens: tokens2, invalidReason: disqualifyingUnit.invalidReason };
  } else {
    const [regexString, handlers] = buildRegex$1(units), regex = RegExp(regexString, "i"), [rawMatches, matches] = match$1(input, regex, handlers), [result, zone, specificOffset] = matches ? dateTimeFromMatches$1(matches) : [null, null, void 0];
    if (hasOwnProperty$1(matches, "a") && hasOwnProperty$1(matches, "H")) {
      throw new ConflictingSpecificationError$1(
        "Can't include meridiem when specifying 24-hour format"
      );
    }
    return { input, tokens: tokens2, regex, rawMatches, matches, result, zone, specificOffset };
  }
}
function parseFromTokens$1(locale, input, format2) {
  const { result, zone, specificOffset, invalidReason } = explainFromTokens$1(locale, input, format2);
  return [result, zone, specificOffset, invalidReason];
}
function formatOptsToTokens$1(formatOpts, locale) {
  if (!formatOpts) {
    return null;
  }
  const formatter = Formatter$1.create(locale, formatOpts);
  const df = formatter.dtFormatter(getDummyDateTime$1());
  const parts = df.formatToParts();
  const resolvedOpts = df.resolvedOptions();
  return parts.map((p2) => tokenForPart$1(p2, formatOpts, resolvedOpts));
}
const nonLeapLadder$1 = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], leapLadder$1 = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
function unitOutOfRange$1(unit, value2) {
  return new Invalid$1(
    "unit out of range",
    `you specified ${value2} (of type ${typeof value2}) as a ${unit}, which is invalid`
  );
}
function dayOfWeek$1(year, month, day) {
  const d = new Date(Date.UTC(year, month - 1, day));
  if (year < 100 && year >= 0) {
    d.setUTCFullYear(d.getUTCFullYear() - 1900);
  }
  const js = d.getUTCDay();
  return js === 0 ? 7 : js;
}
function computeOrdinal$1(year, month, day) {
  return day + (isLeapYear$1(year) ? leapLadder$1 : nonLeapLadder$1)[month - 1];
}
function uncomputeOrdinal$1(year, ordinal) {
  const table3 = isLeapYear$1(year) ? leapLadder$1 : nonLeapLadder$1, month0 = table3.findIndex((i) => i < ordinal), day = ordinal - table3[month0];
  return { month: month0 + 1, day };
}
function gregorianToWeek$1(gregObj) {
  const { year, month, day } = gregObj, ordinal = computeOrdinal$1(year, month, day), weekday = dayOfWeek$1(year, month, day);
  let weekNumber = Math.floor((ordinal - weekday + 10) / 7), weekYear;
  if (weekNumber < 1) {
    weekYear = year - 1;
    weekNumber = weeksInWeekYear$1(weekYear);
  } else if (weekNumber > weeksInWeekYear$1(year)) {
    weekYear = year + 1;
    weekNumber = 1;
  } else {
    weekYear = year;
  }
  return { weekYear, weekNumber, weekday, ...timeObject$1(gregObj) };
}
function weekToGregorian$1(weekData) {
  const { weekYear, weekNumber, weekday } = weekData, weekdayOfJan4 = dayOfWeek$1(weekYear, 1, 4), yearInDays = daysInYear$1(weekYear);
  let ordinal = weekNumber * 7 + weekday - weekdayOfJan4 - 3, year;
  if (ordinal < 1) {
    year = weekYear - 1;
    ordinal += daysInYear$1(year);
  } else if (ordinal > yearInDays) {
    year = weekYear + 1;
    ordinal -= daysInYear$1(weekYear);
  } else {
    year = weekYear;
  }
  const { month, day } = uncomputeOrdinal$1(year, ordinal);
  return { year, month, day, ...timeObject$1(weekData) };
}
function gregorianToOrdinal$1(gregData) {
  const { year, month, day } = gregData;
  const ordinal = computeOrdinal$1(year, month, day);
  return { year, ordinal, ...timeObject$1(gregData) };
}
function ordinalToGregorian$1(ordinalData) {
  const { year, ordinal } = ordinalData;
  const { month, day } = uncomputeOrdinal$1(year, ordinal);
  return { year, month, day, ...timeObject$1(ordinalData) };
}
function hasInvalidWeekData$1(obj) {
  const validYear = isInteger$1(obj.weekYear), validWeek = integerBetween$1(obj.weekNumber, 1, weeksInWeekYear$1(obj.weekYear)), validWeekday = integerBetween$1(obj.weekday, 1, 7);
  if (!validYear) {
    return unitOutOfRange$1("weekYear", obj.weekYear);
  } else if (!validWeek) {
    return unitOutOfRange$1("week", obj.week);
  } else if (!validWeekday) {
    return unitOutOfRange$1("weekday", obj.weekday);
  } else return false;
}
function hasInvalidOrdinalData$1(obj) {
  const validYear = isInteger$1(obj.year), validOrdinal = integerBetween$1(obj.ordinal, 1, daysInYear$1(obj.year));
  if (!validYear) {
    return unitOutOfRange$1("year", obj.year);
  } else if (!validOrdinal) {
    return unitOutOfRange$1("ordinal", obj.ordinal);
  } else return false;
}
function hasInvalidGregorianData$1(obj) {
  const validYear = isInteger$1(obj.year), validMonth = integerBetween$1(obj.month, 1, 12), validDay = integerBetween$1(obj.day, 1, daysInMonth$1(obj.year, obj.month));
  if (!validYear) {
    return unitOutOfRange$1("year", obj.year);
  } else if (!validMonth) {
    return unitOutOfRange$1("month", obj.month);
  } else if (!validDay) {
    return unitOutOfRange$1("day", obj.day);
  } else return false;
}
function hasInvalidTimeData$1(obj) {
  const { hour, minute, second, millisecond } = obj;
  const validHour = integerBetween$1(hour, 0, 23) || hour === 24 && minute === 0 && second === 0 && millisecond === 0, validMinute = integerBetween$1(minute, 0, 59), validSecond = integerBetween$1(second, 0, 59), validMillisecond = integerBetween$1(millisecond, 0, 999);
  if (!validHour) {
    return unitOutOfRange$1("hour", hour);
  } else if (!validMinute) {
    return unitOutOfRange$1("minute", minute);
  } else if (!validSecond) {
    return unitOutOfRange$1("second", second);
  } else if (!validMillisecond) {
    return unitOutOfRange$1("millisecond", millisecond);
  } else return false;
}
const INVALID$3 = "Invalid DateTime";
const MAX_DATE$1 = 864e13;
function unsupportedZone$1(zone) {
  return new Invalid$1("unsupported zone", `the zone "${zone.name}" is not supported`);
}
function possiblyCachedWeekData$1(dt) {
  if (dt.weekData === null) {
    dt.weekData = gregorianToWeek$1(dt.c);
  }
  return dt.weekData;
}
function clone$3(inst, alts) {
  const current = {
    ts: inst.ts,
    zone: inst.zone,
    c: inst.c,
    o: inst.o,
    loc: inst.loc,
    invalid: inst.invalid
  };
  return new DateTime$1({ ...current, ...alts, old: current });
}
function fixOffset$1(localTS, o, tz) {
  let utcGuess = localTS - o * 60 * 1e3;
  const o2 = tz.offset(utcGuess);
  if (o === o2) {
    return [utcGuess, o];
  }
  utcGuess -= (o2 - o) * 60 * 1e3;
  const o3 = tz.offset(utcGuess);
  if (o2 === o3) {
    return [utcGuess, o2];
  }
  return [localTS - Math.min(o2, o3) * 60 * 1e3, Math.max(o2, o3)];
}
function tsToObj$1(ts, offset2) {
  ts += offset2 * 60 * 1e3;
  const d = new Date(ts);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    second: d.getUTCSeconds(),
    millisecond: d.getUTCMilliseconds()
  };
}
function objToTS$1(obj, offset2, zone) {
  return fixOffset$1(objToLocalTS$1(obj), offset2, zone);
}
function adjustTime$1(inst, dur) {
  const oPre = inst.o, year = inst.c.year + Math.trunc(dur.years), month = inst.c.month + Math.trunc(dur.months) + Math.trunc(dur.quarters) * 3, c = {
    ...inst.c,
    year,
    month,
    day: Math.min(inst.c.day, daysInMonth$1(year, month)) + Math.trunc(dur.days) + Math.trunc(dur.weeks) * 7
  }, millisToAdd = Duration$1.fromObject({
    years: dur.years - Math.trunc(dur.years),
    quarters: dur.quarters - Math.trunc(dur.quarters),
    months: dur.months - Math.trunc(dur.months),
    weeks: dur.weeks - Math.trunc(dur.weeks),
    days: dur.days - Math.trunc(dur.days),
    hours: dur.hours,
    minutes: dur.minutes,
    seconds: dur.seconds,
    milliseconds: dur.milliseconds
  }).as("milliseconds"), localTS = objToLocalTS$1(c);
  let [ts, o] = fixOffset$1(localTS, oPre, inst.zone);
  if (millisToAdd !== 0) {
    ts += millisToAdd;
    o = inst.zone.offset(ts);
  }
  return { ts, o };
}
function parseDataToDateTime$1(parsed, parsedZone, opts, format2, text2, specificOffset) {
  const { setZone, zone } = opts;
  if (parsed && Object.keys(parsed).length !== 0 || parsedZone) {
    const interpretationZone = parsedZone || zone, inst = DateTime$1.fromObject(parsed, {
      ...opts,
      zone: interpretationZone,
      specificOffset
    });
    return setZone ? inst : inst.setZone(zone);
  } else {
    return DateTime$1.invalid(
      new Invalid$1("unparsable", `the input "${text2}" can't be parsed as ${format2}`)
    );
  }
}
function toTechFormat$1(dt, format2, allowZ = true) {
  return dt.isValid ? Formatter$1.create(Locale$1.create("en-US"), {
    allowZ,
    forceSimple: true
  }).formatDateTimeFromString(dt, format2) : null;
}
function toISODate$1(o, extended) {
  const longFormat = o.c.year > 9999 || o.c.year < 0;
  let c = "";
  if (longFormat && o.c.year >= 0) c += "+";
  c += padStart$1(o.c.year, longFormat ? 6 : 4);
  if (extended) {
    c += "-";
    c += padStart$1(o.c.month);
    c += "-";
    c += padStart$1(o.c.day);
  } else {
    c += padStart$1(o.c.month);
    c += padStart$1(o.c.day);
  }
  return c;
}
function toISOTime$1(o, extended, suppressSeconds, suppressMilliseconds, includeOffset, extendedZone) {
  let c = padStart$1(o.c.hour);
  if (extended) {
    c += ":";
    c += padStart$1(o.c.minute);
    if (o.c.millisecond !== 0 || o.c.second !== 0 || !suppressSeconds) {
      c += ":";
    }
  } else {
    c += padStart$1(o.c.minute);
  }
  if (o.c.millisecond !== 0 || o.c.second !== 0 || !suppressSeconds) {
    c += padStart$1(o.c.second);
    if (o.c.millisecond !== 0 || !suppressMilliseconds) {
      c += ".";
      c += padStart$1(o.c.millisecond, 3);
    }
  }
  if (includeOffset) {
    if (o.isOffsetFixed && o.offset === 0 && !extendedZone) {
      c += "Z";
    } else if (o.o < 0) {
      c += "-";
      c += padStart$1(Math.trunc(-o.o / 60));
      c += ":";
      c += padStart$1(Math.trunc(-o.o % 60));
    } else {
      c += "+";
      c += padStart$1(Math.trunc(o.o / 60));
      c += ":";
      c += padStart$1(Math.trunc(o.o % 60));
    }
  }
  if (extendedZone) {
    c += "[" + o.zone.ianaName + "]";
  }
  return c;
}
const defaultUnitValues$1 = {
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, defaultWeekUnitValues$1 = {
  weekNumber: 1,
  weekday: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, defaultOrdinalUnitValues$1 = {
  ordinal: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
};
const orderedUnits$2 = ["year", "month", "day", "hour", "minute", "second", "millisecond"], orderedWeekUnits$1 = [
  "weekYear",
  "weekNumber",
  "weekday",
  "hour",
  "minute",
  "second",
  "millisecond"
], orderedOrdinalUnits$1 = ["year", "ordinal", "hour", "minute", "second", "millisecond"];
function normalizeUnit$1(unit) {
  const normalized = {
    year: "year",
    years: "year",
    month: "month",
    months: "month",
    day: "day",
    days: "day",
    hour: "hour",
    hours: "hour",
    minute: "minute",
    minutes: "minute",
    quarter: "quarter",
    quarters: "quarter",
    second: "second",
    seconds: "second",
    millisecond: "millisecond",
    milliseconds: "millisecond",
    weekday: "weekday",
    weekdays: "weekday",
    weeknumber: "weekNumber",
    weeksnumber: "weekNumber",
    weeknumbers: "weekNumber",
    weekyear: "weekYear",
    weekyears: "weekYear",
    ordinal: "ordinal"
  }[unit.toLowerCase()];
  if (!normalized) throw new InvalidUnitError$1(unit);
  return normalized;
}
function quickDT$1(obj, opts) {
  const zone = normalizeZone$1(opts.zone, Settings$1.defaultZone), loc = Locale$1.fromObject(opts), tsNow = Settings$1.now();
  let ts, o;
  if (!isUndefined$2(obj.year)) {
    for (const u of orderedUnits$2) {
      if (isUndefined$2(obj[u])) {
        obj[u] = defaultUnitValues$1[u];
      }
    }
    const invalid = hasInvalidGregorianData$1(obj) || hasInvalidTimeData$1(obj);
    if (invalid) {
      return DateTime$1.invalid(invalid);
    }
    const offsetProvis = zone.offset(tsNow);
    [ts, o] = objToTS$1(obj, offsetProvis, zone);
  } else {
    ts = tsNow;
  }
  return new DateTime$1({ ts, zone, loc, o });
}
function diffRelative$1(start2, end2, opts) {
  const round2 = isUndefined$2(opts.round) ? true : opts.round, format2 = (c, unit) => {
    c = roundTo$1(c, round2 || opts.calendary ? 0 : 2, true);
    const formatter = end2.loc.clone(opts).relFormatter(opts);
    return formatter.format(c, unit);
  }, differ = (unit) => {
    if (opts.calendary) {
      if (!end2.hasSame(start2, unit)) {
        return end2.startOf(unit).diff(start2.startOf(unit), unit).get(unit);
      } else return 0;
    } else {
      return end2.diff(start2, unit).get(unit);
    }
  };
  if (opts.unit) {
    return format2(differ(opts.unit), opts.unit);
  }
  for (const unit of opts.units) {
    const count = differ(unit);
    if (Math.abs(count) >= 1) {
      return format2(count, unit);
    }
  }
  return format2(start2 > end2 ? -0 : 0, opts.units[opts.units.length - 1]);
}
function lastOpts$1(argList) {
  let opts = {}, args;
  if (argList.length > 0 && typeof argList[argList.length - 1] === "object") {
    opts = argList[argList.length - 1];
    args = Array.from(argList).slice(0, argList.length - 1);
  } else {
    args = Array.from(argList);
  }
  return [opts, args];
}
let DateTime$1 = class DateTime {
  /**
   * @access private
   */
  constructor(config) {
    const zone = config.zone || Settings$1.defaultZone;
    let invalid = config.invalid || (Number.isNaN(config.ts) ? new Invalid$1("invalid input") : null) || (!zone.isValid ? unsupportedZone$1(zone) : null);
    this.ts = isUndefined$2(config.ts) ? Settings$1.now() : config.ts;
    let c = null, o = null;
    if (!invalid) {
      const unchanged = config.old && config.old.ts === this.ts && config.old.zone.equals(zone);
      if (unchanged) {
        [c, o] = [config.old.c, config.old.o];
      } else {
        const ot = zone.offset(this.ts);
        c = tsToObj$1(this.ts, ot);
        invalid = Number.isNaN(c.year) ? new Invalid$1("invalid input") : null;
        c = invalid ? null : c;
        o = invalid ? null : ot;
      }
    }
    this._zone = zone;
    this.loc = config.loc || Locale$1.create();
    this.invalid = invalid;
    this.weekData = null;
    this.c = c;
    this.o = o;
    this.isLuxonDateTime = true;
  }
  // CONSTRUCT
  /**
   * Create a DateTime for the current instant, in the system's time zone.
   *
   * Use Settings to override these default values if needed.
   * @example DateTime.now().toISO() //~> now in the ISO format
   * @return {DateTime}
   */
  static now() {
    return new DateTime({});
  }
  /**
   * Create a local DateTime
   * @param {number} [year] - The calendar year. If omitted (as in, call `local()` with no arguments), the current time will be used
   * @param {number} [month=1] - The month, 1-indexed
   * @param {number} [day=1] - The day of the month, 1-indexed
   * @param {number} [hour=0] - The hour of the day, in 24-hour time
   * @param {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
   * @param {number} [second=0] - The second of the minute, meaning a number between 0 and 59
   * @param {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
   * @example DateTime.local()                                  //~> now
   * @example DateTime.local({ zone: "America/New_York" })      //~> now, in US east coast time
   * @example DateTime.local(2017)                              //~> 2017-01-01T00:00:00
   * @example DateTime.local(2017, 3)                           //~> 2017-03-01T00:00:00
   * @example DateTime.local(2017, 3, 12, { locale: "fr" })     //~> 2017-03-12T00:00:00, with a French locale
   * @example DateTime.local(2017, 3, 12, 5)                    //~> 2017-03-12T05:00:00
   * @example DateTime.local(2017, 3, 12, 5, { zone: "utc" })   //~> 2017-03-12T05:00:00, in UTC
   * @example DateTime.local(2017, 3, 12, 5, 45)                //~> 2017-03-12T05:45:00
   * @example DateTime.local(2017, 3, 12, 5, 45, 10)            //~> 2017-03-12T05:45:10
   * @example DateTime.local(2017, 3, 12, 5, 45, 10, 765)       //~> 2017-03-12T05:45:10.765
   * @return {DateTime}
   */
  static local() {
    const [opts, args] = lastOpts$1(arguments), [year, month, day, hour, minute, second, millisecond] = args;
    return quickDT$1({ year, month, day, hour, minute, second, millisecond }, opts);
  }
  /**
   * Create a DateTime in UTC
   * @param {number} [year] - The calendar year. If omitted (as in, call `utc()` with no arguments), the current time will be used
   * @param {number} [month=1] - The month, 1-indexed
   * @param {number} [day=1] - The day of the month
   * @param {number} [hour=0] - The hour of the day, in 24-hour time
   * @param {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
   * @param {number} [second=0] - The second of the minute, meaning a number between 0 and 59
   * @param {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
   * @param {Object} options - configuration options for the DateTime
   * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
   * @param {string} [options.outputCalendar] - the output calendar to set on the resulting DateTime instance
   * @param {string} [options.numberingSystem] - the numbering system to set on the resulting DateTime instance
   * @example DateTime.utc()                                              //~> now
   * @example DateTime.utc(2017)                                          //~> 2017-01-01T00:00:00Z
   * @example DateTime.utc(2017, 3)                                       //~> 2017-03-01T00:00:00Z
   * @example DateTime.utc(2017, 3, 12)                                   //~> 2017-03-12T00:00:00Z
   * @example DateTime.utc(2017, 3, 12, 5)                                //~> 2017-03-12T05:00:00Z
   * @example DateTime.utc(2017, 3, 12, 5, 45)                            //~> 2017-03-12T05:45:00Z
   * @example DateTime.utc(2017, 3, 12, 5, 45, { locale: "fr" })          //~> 2017-03-12T05:45:00Z with a French locale
   * @example DateTime.utc(2017, 3, 12, 5, 45, 10)                        //~> 2017-03-12T05:45:10Z
   * @example DateTime.utc(2017, 3, 12, 5, 45, 10, 765, { locale: "fr" }) //~> 2017-03-12T05:45:10.765Z with a French locale
   * @return {DateTime}
   */
  static utc() {
    const [opts, args] = lastOpts$1(arguments), [year, month, day, hour, minute, second, millisecond] = args;
    opts.zone = FixedOffsetZone$1.utcInstance;
    return quickDT$1({ year, month, day, hour, minute, second, millisecond }, opts);
  }
  /**
   * Create a DateTime from a JavaScript Date object. Uses the default zone.
   * @param {Date} date - a JavaScript Date object
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @return {DateTime}
   */
  static fromJSDate(date, options2 = {}) {
    const ts = isDate$1(date) ? date.valueOf() : NaN;
    if (Number.isNaN(ts)) {
      return DateTime.invalid("invalid input");
    }
    const zoneToUse = normalizeZone$1(options2.zone, Settings$1.defaultZone);
    if (!zoneToUse.isValid) {
      return DateTime.invalid(unsupportedZone$1(zoneToUse));
    }
    return new DateTime({
      ts,
      zone: zoneToUse,
      loc: Locale$1.fromObject(options2)
    });
  }
  /**
   * Create a DateTime from a number of milliseconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
   * @param {number} milliseconds - a number of milliseconds since 1970 UTC
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
   * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @return {DateTime}
   */
  static fromMillis(milliseconds, options2 = {}) {
    if (!isNumber$3(milliseconds)) {
      throw new InvalidArgumentError$1(
        `fromMillis requires a numerical input, but received a ${typeof milliseconds} with value ${milliseconds}`
      );
    } else if (milliseconds < -MAX_DATE$1 || milliseconds > MAX_DATE$1) {
      return DateTime.invalid("Timestamp out of range");
    } else {
      return new DateTime({
        ts: milliseconds,
        zone: normalizeZone$1(options2.zone, Settings$1.defaultZone),
        loc: Locale$1.fromObject(options2)
      });
    }
  }
  /**
   * Create a DateTime from a number of seconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
   * @param {number} seconds - a number of seconds since 1970 UTC
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
   * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @return {DateTime}
   */
  static fromSeconds(seconds, options2 = {}) {
    if (!isNumber$3(seconds)) {
      throw new InvalidArgumentError$1("fromSeconds requires a numerical input");
    } else {
      return new DateTime({
        ts: seconds * 1e3,
        zone: normalizeZone$1(options2.zone, Settings$1.defaultZone),
        loc: Locale$1.fromObject(options2)
      });
    }
  }
  /**
   * Create a DateTime from a JavaScript object with keys like 'year' and 'hour' with reasonable defaults.
   * @param {Object} obj - the object to create the DateTime from
   * @param {number} obj.year - a year, such as 1987
   * @param {number} obj.month - a month, 1-12
   * @param {number} obj.day - a day of the month, 1-31, depending on the month
   * @param {number} obj.ordinal - day of the year, 1-365 or 366
   * @param {number} obj.weekYear - an ISO week year
   * @param {number} obj.weekNumber - an ISO week number, between 1 and 52 or 53, depending on the year
   * @param {number} obj.weekday - an ISO weekday, 1-7, where 1 is Monday and 7 is Sunday
   * @param {number} obj.hour - hour of the day, 0-23
   * @param {number} obj.minute - minute of the hour, 0-59
   * @param {number} obj.second - second of the minute, 0-59
   * @param {number} obj.millisecond - millisecond of the second, 0-999
   * @param {Object} opts - options for creating this DateTime
   * @param {string|Zone} [opts.zone='local'] - interpret the numbers in the context of a particular zone. Can take any value taken as the first argument to setZone()
   * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @example DateTime.fromObject({ year: 1982, month: 5, day: 25}).toISODate() //=> '1982-05-25'
   * @example DateTime.fromObject({ year: 1982 }).toISODate() //=> '1982-01-01'
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }) //~> today at 10:26:06
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'utc' }),
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'local' })
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'America/New_York' })
   * @example DateTime.fromObject({ weekYear: 2016, weekNumber: 2, weekday: 3 }).toISODate() //=> '2016-01-13'
   * @return {DateTime}
   */
  static fromObject(obj, opts = {}) {
    obj = obj || {};
    const zoneToUse = normalizeZone$1(opts.zone, Settings$1.defaultZone);
    if (!zoneToUse.isValid) {
      return DateTime.invalid(unsupportedZone$1(zoneToUse));
    }
    const tsNow = Settings$1.now(), offsetProvis = !isUndefined$2(opts.specificOffset) ? opts.specificOffset : zoneToUse.offset(tsNow), normalized = normalizeObject$1(obj, normalizeUnit$1), containsOrdinal = !isUndefined$2(normalized.ordinal), containsGregorYear = !isUndefined$2(normalized.year), containsGregorMD = !isUndefined$2(normalized.month) || !isUndefined$2(normalized.day), containsGregor = containsGregorYear || containsGregorMD, definiteWeekDef = normalized.weekYear || normalized.weekNumber, loc = Locale$1.fromObject(opts);
    if ((containsGregor || containsOrdinal) && definiteWeekDef) {
      throw new ConflictingSpecificationError$1(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    }
    if (containsGregorMD && containsOrdinal) {
      throw new ConflictingSpecificationError$1("Can't mix ordinal dates with month/day");
    }
    const useWeekData = definiteWeekDef || normalized.weekday && !containsGregor;
    let units, defaultValues, objNow = tsToObj$1(tsNow, offsetProvis);
    if (useWeekData) {
      units = orderedWeekUnits$1;
      defaultValues = defaultWeekUnitValues$1;
      objNow = gregorianToWeek$1(objNow);
    } else if (containsOrdinal) {
      units = orderedOrdinalUnits$1;
      defaultValues = defaultOrdinalUnitValues$1;
      objNow = gregorianToOrdinal$1(objNow);
    } else {
      units = orderedUnits$2;
      defaultValues = defaultUnitValues$1;
    }
    let foundFirst = false;
    for (const u of units) {
      const v = normalized[u];
      if (!isUndefined$2(v)) {
        foundFirst = true;
      } else if (foundFirst) {
        normalized[u] = defaultValues[u];
      } else {
        normalized[u] = objNow[u];
      }
    }
    const higherOrderInvalid = useWeekData ? hasInvalidWeekData$1(normalized) : containsOrdinal ? hasInvalidOrdinalData$1(normalized) : hasInvalidGregorianData$1(normalized), invalid = higherOrderInvalid || hasInvalidTimeData$1(normalized);
    if (invalid) {
      return DateTime.invalid(invalid);
    }
    const gregorian = useWeekData ? weekToGregorian$1(normalized) : containsOrdinal ? ordinalToGregorian$1(normalized) : normalized, [tsFinal, offsetFinal] = objToTS$1(gregorian, offsetProvis, zoneToUse), inst = new DateTime({
      ts: tsFinal,
      zone: zoneToUse,
      o: offsetFinal,
      loc
    });
    if (normalized.weekday && containsGregor && obj.weekday !== inst.weekday) {
      return DateTime.invalid(
        "mismatched weekday",
        `you can't specify both a weekday of ${normalized.weekday} and a date of ${inst.toISO()}`
      );
    }
    return inst;
  }
  /**
   * Create a DateTime from an ISO 8601 string
   * @param {string} text - the ISO string
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the time to this zone
   * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
   * @param {string} [opts.outputCalendar] - the output calendar to set on the resulting DateTime instance
   * @param {string} [opts.numberingSystem] - the numbering system to set on the resulting DateTime instance
   * @example DateTime.fromISO('2016-05-25T09:08:34.123')
   * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00')
   * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00', {setZone: true})
   * @example DateTime.fromISO('2016-05-25T09:08:34.123', {zone: 'utc'})
   * @example DateTime.fromISO('2016-W05-4')
   * @return {DateTime}
   */
  static fromISO(text2, opts = {}) {
    const [vals, parsedZone] = parseISODate$1(text2);
    return parseDataToDateTime$1(vals, parsedZone, opts, "ISO 8601", text2);
  }
  /**
   * Create a DateTime from an RFC 2822 string
   * @param {string} text - the RFC 2822 string
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - convert the time to this zone. Since the offset is always specified in the string itself, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
   * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @example DateTime.fromRFC2822('25 Nov 2016 13:23:12 GMT')
   * @example DateTime.fromRFC2822('Fri, 25 Nov 2016 13:23:12 +0600')
   * @example DateTime.fromRFC2822('25 Nov 2016 13:23 Z')
   * @return {DateTime}
   */
  static fromRFC2822(text2, opts = {}) {
    const [vals, parsedZone] = parseRFC2822Date$1(text2);
    return parseDataToDateTime$1(vals, parsedZone, opts, "RFC 2822", text2);
  }
  /**
   * Create a DateTime from an HTTP header date
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
   * @param {string} text - the HTTP header date
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - convert the time to this zone. Since HTTP dates are always in UTC, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
   * @param {boolean} [opts.setZone=false] - override the zone with the fixed-offset zone specified in the string. For HTTP dates, this is always UTC, so this option is equivalent to setting the `zone` option to 'utc', but this option is included for consistency with similar methods.
   * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @example DateTime.fromHTTP('Sun, 06 Nov 1994 08:49:37 GMT')
   * @example DateTime.fromHTTP('Sunday, 06-Nov-94 08:49:37 GMT')
   * @example DateTime.fromHTTP('Sun Nov  6 08:49:37 1994')
   * @return {DateTime}
   */
  static fromHTTP(text2, opts = {}) {
    const [vals, parsedZone] = parseHTTPDate$1(text2);
    return parseDataToDateTime$1(vals, parsedZone, opts, "HTTP", opts);
  }
  /**
   * Create a DateTime from an input string and format string.
   * Defaults to en-US if no locale has been specified, regardless of the system's locale. For a table of tokens and their interpretations, see [here](https://moment.github.io/luxon/#/parsing?id=table-of-tokens).
   * @param {string} text - the string to parse
   * @param {string} fmt - the format the string is expected to be in (see the link below for the formats)
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
   * @param {boolean} [opts.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
   * @param {string} opts.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @return {DateTime}
   */
  static fromFormat(text2, fmt2, opts = {}) {
    if (isUndefined$2(text2) || isUndefined$2(fmt2)) {
      throw new InvalidArgumentError$1("fromFormat requires an input string and a format");
    }
    const { locale = null, numberingSystem = null } = opts, localeToUse = Locale$1.fromOpts({
      locale,
      numberingSystem,
      defaultToEN: true
    }), [vals, parsedZone, specificOffset, invalid] = parseFromTokens$1(localeToUse, text2, fmt2);
    if (invalid) {
      return DateTime.invalid(invalid);
    } else {
      return parseDataToDateTime$1(vals, parsedZone, opts, `format ${fmt2}`, text2, specificOffset);
    }
  }
  /**
   * @deprecated use fromFormat instead
   */
  static fromString(text2, fmt2, opts = {}) {
    return DateTime.fromFormat(text2, fmt2, opts);
  }
  /**
   * Create a DateTime from a SQL date, time, or datetime
   * Defaults to en-US if no locale has been specified, regardless of the system's locale
   * @param {string} text - the string to parse
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
   * @param {boolean} [opts.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
   * @param {string} opts.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @example DateTime.fromSQL('2017-05-15')
   * @example DateTime.fromSQL('2017-05-15 09:12:34')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342+06:00')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles', { setZone: true })
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342', { zone: 'America/Los_Angeles' })
   * @example DateTime.fromSQL('09:12:34.342')
   * @return {DateTime}
   */
  static fromSQL(text2, opts = {}) {
    const [vals, parsedZone] = parseSQL$1(text2);
    return parseDataToDateTime$1(vals, parsedZone, opts, "SQL", text2);
  }
  /**
   * Create an invalid DateTime.
   * @param {string} reason - simple string of why this DateTime is invalid. Should not contain parameters or anything else data-dependent.
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {DateTime}
   */
  static invalid(reason, explanation = null) {
    if (!reason) {
      throw new InvalidArgumentError$1("need to specify a reason the DateTime is invalid");
    }
    const invalid = reason instanceof Invalid$1 ? reason : new Invalid$1(reason, explanation);
    if (Settings$1.throwOnInvalid) {
      throw new InvalidDateTimeError$1(invalid);
    } else {
      return new DateTime({ invalid });
    }
  }
  /**
   * Check if an object is an instance of DateTime. Works across context boundaries
   * @param {object} o
   * @return {boolean}
   */
  static isDateTime(o) {
    return o && o.isLuxonDateTime || false;
  }
  /**
   * Produce the format string for a set of options
   * @param formatOpts
   * @param localeOpts
   * @returns {string}
   */
  static parseFormatForOpts(formatOpts, localeOpts = {}) {
    const tokenList = formatOptsToTokens$1(formatOpts, Locale$1.fromObject(localeOpts));
    return !tokenList ? null : tokenList.map((t) => t ? t.val : null).join("");
  }
  /**
   * Produce the the fully expanded format token for the locale
   * Does NOT quote characters, so quoted tokens will not round trip correctly
   * @param fmt
   * @param localeOpts
   * @returns {string}
   */
  static expandFormat(fmt2, localeOpts = {}) {
    const expanded = expandMacroTokens$1(Formatter$1.parseFormat(fmt2), Locale$1.fromObject(localeOpts));
    return expanded.map((t) => t.val).join("");
  }
  // INFO
  /**
   * Get the value of unit.
   * @param {string} unit - a unit such as 'minute' or 'day'
   * @example DateTime.local(2017, 7, 4).get('month'); //=> 7
   * @example DateTime.local(2017, 7, 4).get('day'); //=> 4
   * @return {number}
   */
  get(unit) {
    return this[unit];
  }
  /**
   * Returns whether the DateTime is valid. Invalid DateTimes occur when:
   * * The DateTime was created from invalid calendar information, such as the 13th month or February 30
   * * The DateTime was created by an operation on another invalid date
   * @type {boolean}
   */
  get isValid() {
    return this.invalid === null;
  }
  /**
   * Returns an error code if this DateTime is invalid, or null if the DateTime is valid
   * @type {string}
   */
  get invalidReason() {
    return this.invalid ? this.invalid.reason : null;
  }
  /**
   * Returns an explanation of why this DateTime became invalid, or null if the DateTime is valid
   * @type {string}
   */
  get invalidExplanation() {
    return this.invalid ? this.invalid.explanation : null;
  }
  /**
   * Get the locale of a DateTime, such 'en-GB'. The locale is used when formatting the DateTime
   *
   * @type {string}
   */
  get locale() {
    return this.isValid ? this.loc.locale : null;
  }
  /**
   * Get the numbering system of a DateTime, such 'beng'. The numbering system is used when formatting the DateTime
   *
   * @type {string}
   */
  get numberingSystem() {
    return this.isValid ? this.loc.numberingSystem : null;
  }
  /**
   * Get the output calendar of a DateTime, such 'islamic'. The output calendar is used when formatting the DateTime
   *
   * @type {string}
   */
  get outputCalendar() {
    return this.isValid ? this.loc.outputCalendar : null;
  }
  /**
   * Get the time zone associated with this DateTime.
   * @type {Zone}
   */
  get zone() {
    return this._zone;
  }
  /**
   * Get the name of the time zone.
   * @type {string}
   */
  get zoneName() {
    return this.isValid ? this.zone.name : null;
  }
  /**
   * Get the year
   * @example DateTime.local(2017, 5, 25).year //=> 2017
   * @type {number}
   */
  get year() {
    return this.isValid ? this.c.year : NaN;
  }
  /**
   * Get the quarter
   * @example DateTime.local(2017, 5, 25).quarter //=> 2
   * @type {number}
   */
  get quarter() {
    return this.isValid ? Math.ceil(this.c.month / 3) : NaN;
  }
  /**
   * Get the month (1-12).
   * @example DateTime.local(2017, 5, 25).month //=> 5
   * @type {number}
   */
  get month() {
    return this.isValid ? this.c.month : NaN;
  }
  /**
   * Get the day of the month (1-30ish).
   * @example DateTime.local(2017, 5, 25).day //=> 25
   * @type {number}
   */
  get day() {
    return this.isValid ? this.c.day : NaN;
  }
  /**
   * Get the hour of the day (0-23).
   * @example DateTime.local(2017, 5, 25, 9).hour //=> 9
   * @type {number}
   */
  get hour() {
    return this.isValid ? this.c.hour : NaN;
  }
  /**
   * Get the minute of the hour (0-59).
   * @example DateTime.local(2017, 5, 25, 9, 30).minute //=> 30
   * @type {number}
   */
  get minute() {
    return this.isValid ? this.c.minute : NaN;
  }
  /**
   * Get the second of the minute (0-59).
   * @example DateTime.local(2017, 5, 25, 9, 30, 52).second //=> 52
   * @type {number}
   */
  get second() {
    return this.isValid ? this.c.second : NaN;
  }
  /**
   * Get the millisecond of the second (0-999).
   * @example DateTime.local(2017, 5, 25, 9, 30, 52, 654).millisecond //=> 654
   * @type {number}
   */
  get millisecond() {
    return this.isValid ? this.c.millisecond : NaN;
  }
  /**
   * Get the week year
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2014, 12, 31).weekYear //=> 2015
   * @type {number}
   */
  get weekYear() {
    return this.isValid ? possiblyCachedWeekData$1(this).weekYear : NaN;
  }
  /**
   * Get the week number of the week year (1-52ish).
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2017, 5, 25).weekNumber //=> 21
   * @type {number}
   */
  get weekNumber() {
    return this.isValid ? possiblyCachedWeekData$1(this).weekNumber : NaN;
  }
  /**
   * Get the day of the week.
   * 1 is Monday and 7 is Sunday
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2014, 11, 31).weekday //=> 4
   * @type {number}
   */
  get weekday() {
    return this.isValid ? possiblyCachedWeekData$1(this).weekday : NaN;
  }
  /**
   * Get the ordinal (meaning the day of the year)
   * @example DateTime.local(2017, 5, 25).ordinal //=> 145
   * @type {number|DateTime}
   */
  get ordinal() {
    return this.isValid ? gregorianToOrdinal$1(this.c).ordinal : NaN;
  }
  /**
   * Get the human readable short month name, such as 'Oct'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).monthShort //=> Oct
   * @type {string}
   */
  get monthShort() {
    return this.isValid ? Info$1.months("short", { locObj: this.loc })[this.month - 1] : null;
  }
  /**
   * Get the human readable long month name, such as 'October'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).monthLong //=> October
   * @type {string}
   */
  get monthLong() {
    return this.isValid ? Info$1.months("long", { locObj: this.loc })[this.month - 1] : null;
  }
  /**
   * Get the human readable short weekday, such as 'Mon'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).weekdayShort //=> Mon
   * @type {string}
   */
  get weekdayShort() {
    return this.isValid ? Info$1.weekdays("short", { locObj: this.loc })[this.weekday - 1] : null;
  }
  /**
   * Get the human readable long weekday, such as 'Monday'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).weekdayLong //=> Monday
   * @type {string}
   */
  get weekdayLong() {
    return this.isValid ? Info$1.weekdays("long", { locObj: this.loc })[this.weekday - 1] : null;
  }
  /**
   * Get the UTC offset of this DateTime in minutes
   * @example DateTime.now().offset //=> -240
   * @example DateTime.utc().offset //=> 0
   * @type {number}
   */
  get offset() {
    return this.isValid ? +this.o : NaN;
  }
  /**
   * Get the short human name for the zone's current offset, for example "EST" or "EDT".
   * Defaults to the system's locale if no locale has been specified
   * @type {string}
   */
  get offsetNameShort() {
    if (this.isValid) {
      return this.zone.offsetName(this.ts, {
        format: "short",
        locale: this.locale
      });
    } else {
      return null;
    }
  }
  /**
   * Get the long human name for the zone's current offset, for example "Eastern Standard Time" or "Eastern Daylight Time".
   * Defaults to the system's locale if no locale has been specified
   * @type {string}
   */
  get offsetNameLong() {
    if (this.isValid) {
      return this.zone.offsetName(this.ts, {
        format: "long",
        locale: this.locale
      });
    } else {
      return null;
    }
  }
  /**
   * Get whether this zone's offset ever changes, as in a DST.
   * @type {boolean}
   */
  get isOffsetFixed() {
    return this.isValid ? this.zone.isUniversal : null;
  }
  /**
   * Get whether the DateTime is in a DST.
   * @type {boolean}
   */
  get isInDST() {
    if (this.isOffsetFixed) {
      return false;
    } else {
      return this.offset > this.set({ month: 1, day: 1 }).offset || this.offset > this.set({ month: 5 }).offset;
    }
  }
  /**
   * Get those DateTimes which have the same local time as this DateTime, but a different offset from UTC
   * in this DateTime's zone. During DST changes local time can be ambiguous, for example
   * `2023-10-29T02:30:00` in `Europe/Berlin` can have offset `+01:00` or `+02:00`.
   * This method will return both possible DateTimes if this DateTime's local time is ambiguous.
   * @returns {DateTime[]}
   */
  getPossibleOffsets() {
    if (!this.isValid || this.isOffsetFixed) {
      return [this];
    }
    const dayMs = 864e5;
    const minuteMs = 6e4;
    const localTS = objToLocalTS$1(this.c);
    const oEarlier = this.zone.offset(localTS - dayMs);
    const oLater = this.zone.offset(localTS + dayMs);
    const o1 = this.zone.offset(localTS - oEarlier * minuteMs);
    const o2 = this.zone.offset(localTS - oLater * minuteMs);
    if (o1 === o2) {
      return [this];
    }
    const ts1 = localTS - o1 * minuteMs;
    const ts2 = localTS - o2 * minuteMs;
    const c1 = tsToObj$1(ts1, o1);
    const c2 = tsToObj$1(ts2, o2);
    if (c1.hour === c2.hour && c1.minute === c2.minute && c1.second === c2.second && c1.millisecond === c2.millisecond) {
      return [clone$3(this, { ts: ts1 }), clone$3(this, { ts: ts2 })];
    }
    return [this];
  }
  /**
   * Returns true if this DateTime is in a leap year, false otherwise
   * @example DateTime.local(2016).isInLeapYear //=> true
   * @example DateTime.local(2013).isInLeapYear //=> false
   * @type {boolean}
   */
  get isInLeapYear() {
    return isLeapYear$1(this.year);
  }
  /**
   * Returns the number of days in this DateTime's month
   * @example DateTime.local(2016, 2).daysInMonth //=> 29
   * @example DateTime.local(2016, 3).daysInMonth //=> 31
   * @type {number}
   */
  get daysInMonth() {
    return daysInMonth$1(this.year, this.month);
  }
  /**
   * Returns the number of days in this DateTime's year
   * @example DateTime.local(2016).daysInYear //=> 366
   * @example DateTime.local(2013).daysInYear //=> 365
   * @type {number}
   */
  get daysInYear() {
    return this.isValid ? daysInYear$1(this.year) : NaN;
  }
  /**
   * Returns the number of weeks in this DateTime's year
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2004).weeksInWeekYear //=> 53
   * @example DateTime.local(2013).weeksInWeekYear //=> 52
   * @type {number}
   */
  get weeksInWeekYear() {
    return this.isValid ? weeksInWeekYear$1(this.weekYear) : NaN;
  }
  /**
   * Returns the resolved Intl options for this DateTime.
   * This is useful in understanding the behavior of formatting methods
   * @param {Object} opts - the same options as toLocaleString
   * @return {Object}
   */
  resolvedLocaleOptions(opts = {}) {
    const { locale, numberingSystem, calendar } = Formatter$1.create(
      this.loc.clone(opts),
      opts
    ).resolvedOptions(this);
    return { locale, numberingSystem, outputCalendar: calendar };
  }
  // TRANSFORM
  /**
   * "Set" the DateTime's zone to UTC. Returns a newly-constructed DateTime.
   *
   * Equivalent to {@link DateTime#setZone}('utc')
   * @param {number} [offset=0] - optionally, an offset from UTC in minutes
   * @param {Object} [opts={}] - options to pass to `setZone()`
   * @return {DateTime}
   */
  toUTC(offset2 = 0, opts = {}) {
    return this.setZone(FixedOffsetZone$1.instance(offset2), opts);
  }
  /**
   * "Set" the DateTime's zone to the host's local zone. Returns a newly-constructed DateTime.
   *
   * Equivalent to `setZone('local')`
   * @return {DateTime}
   */
  toLocal() {
    return this.setZone(Settings$1.defaultZone);
  }
  /**
   * "Set" the DateTime's zone to specified zone. Returns a newly-constructed DateTime.
   *
   * By default, the setter keeps the underlying time the same (as in, the same timestamp), but the new instance will report different local times and consider DSTs when making computations, as with {@link DateTime#plus}. You may wish to use {@link DateTime#toLocal} and {@link DateTime#toUTC} which provide simple convenience wrappers for commonly used zones.
   * @param {string|Zone} [zone='local'] - a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the strings 'local' or 'utc'. You may also supply an instance of a {@link DateTime#Zone} class.
   * @param {Object} opts - options
   * @param {boolean} [opts.keepLocalTime=false] - If true, adjust the underlying time so that the local time stays the same, but in the target zone. You should rarely need this.
   * @return {DateTime}
   */
  setZone(zone, { keepLocalTime = false, keepCalendarTime = false } = {}) {
    zone = normalizeZone$1(zone, Settings$1.defaultZone);
    if (zone.equals(this.zone)) {
      return this;
    } else if (!zone.isValid) {
      return DateTime.invalid(unsupportedZone$1(zone));
    } else {
      let newTS = this.ts;
      if (keepLocalTime || keepCalendarTime) {
        const offsetGuess = zone.offset(this.ts);
        const asObj = this.toObject();
        [newTS] = objToTS$1(asObj, offsetGuess, zone);
      }
      return clone$3(this, { ts: newTS, zone });
    }
  }
  /**
   * "Set" the locale, numberingSystem, or outputCalendar. Returns a newly-constructed DateTime.
   * @param {Object} properties - the properties to set
   * @example DateTime.local(2017, 5, 25).reconfigure({ locale: 'en-GB' })
   * @return {DateTime}
   */
  reconfigure({ locale, numberingSystem, outputCalendar } = {}) {
    const loc = this.loc.clone({ locale, numberingSystem, outputCalendar });
    return clone$3(this, { loc });
  }
  /**
   * "Set" the locale. Returns a newly-constructed DateTime.
   * Just a convenient alias for reconfigure({ locale })
   * @example DateTime.local(2017, 5, 25).setLocale('en-GB')
   * @return {DateTime}
   */
  setLocale(locale) {
    return this.reconfigure({ locale });
  }
  /**
   * "Set" the values of specified units. Returns a newly-constructed DateTime.
   * You can only set units with this method; for "setting" metadata, see {@link DateTime#reconfigure} and {@link DateTime#setZone}.
   * @param {Object} values - a mapping of units to numbers
   * @example dt.set({ year: 2017 })
   * @example dt.set({ hour: 8, minute: 30 })
   * @example dt.set({ weekday: 5 })
   * @example dt.set({ year: 2005, ordinal: 234 })
   * @return {DateTime}
   */
  set(values) {
    if (!this.isValid) return this;
    const normalized = normalizeObject$1(values, normalizeUnit$1), settingWeekStuff = !isUndefined$2(normalized.weekYear) || !isUndefined$2(normalized.weekNumber) || !isUndefined$2(normalized.weekday), containsOrdinal = !isUndefined$2(normalized.ordinal), containsGregorYear = !isUndefined$2(normalized.year), containsGregorMD = !isUndefined$2(normalized.month) || !isUndefined$2(normalized.day), containsGregor = containsGregorYear || containsGregorMD, definiteWeekDef = normalized.weekYear || normalized.weekNumber;
    if ((containsGregor || containsOrdinal) && definiteWeekDef) {
      throw new ConflictingSpecificationError$1(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    }
    if (containsGregorMD && containsOrdinal) {
      throw new ConflictingSpecificationError$1("Can't mix ordinal dates with month/day");
    }
    let mixed;
    if (settingWeekStuff) {
      mixed = weekToGregorian$1({ ...gregorianToWeek$1(this.c), ...normalized });
    } else if (!isUndefined$2(normalized.ordinal)) {
      mixed = ordinalToGregorian$1({ ...gregorianToOrdinal$1(this.c), ...normalized });
    } else {
      mixed = { ...this.toObject(), ...normalized };
      if (isUndefined$2(normalized.day)) {
        mixed.day = Math.min(daysInMonth$1(mixed.year, mixed.month), mixed.day);
      }
    }
    const [ts, o] = objToTS$1(mixed, this.o, this.zone);
    return clone$3(this, { ts, o });
  }
  /**
   * Add a period of time to this DateTime and return the resulting DateTime
   *
   * Adding hours, minutes, seconds, or milliseconds increases the timestamp by the right number of milliseconds. Adding days, months, or years shifts the calendar, accounting for DSTs and leap years along the way. Thus, `dt.plus({ hours: 24 })` may result in a different time than `dt.plus({ days: 1 })` if there's a DST shift in between.
   * @param {Duration|Object|number} duration - The amount to add. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @example DateTime.now().plus(123) //~> in 123 milliseconds
   * @example DateTime.now().plus({ minutes: 15 }) //~> in 15 minutes
   * @example DateTime.now().plus({ days: 1 }) //~> this time tomorrow
   * @example DateTime.now().plus({ days: -1 }) //~> this time yesterday
   * @example DateTime.now().plus({ hours: 3, minutes: 13 }) //~> in 3 hr, 13 min
   * @example DateTime.now().plus(Duration.fromObject({ hours: 3, minutes: 13 })) //~> in 3 hr, 13 min
   * @return {DateTime}
   */
  plus(duration2) {
    if (!this.isValid) return this;
    const dur = Duration$1.fromDurationLike(duration2);
    return clone$3(this, adjustTime$1(this, dur));
  }
  /**
   * Subtract a period of time to this DateTime and return the resulting DateTime
   * See {@link DateTime#plus}
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   @return {DateTime}
   */
  minus(duration2) {
    if (!this.isValid) return this;
    const dur = Duration$1.fromDurationLike(duration2).negate();
    return clone$3(this, adjustTime$1(this, dur));
  }
  /**
   * "Set" this DateTime to the beginning of a unit of time.
   * @param {string} unit - The unit to go to the beginning of. Can be 'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', or 'millisecond'.
   * @example DateTime.local(2014, 3, 3).startOf('month').toISODate(); //=> '2014-03-01'
   * @example DateTime.local(2014, 3, 3).startOf('year').toISODate(); //=> '2014-01-01'
   * @example DateTime.local(2014, 3, 3).startOf('week').toISODate(); //=> '2014-03-03', weeks always start on Mondays
   * @example DateTime.local(2014, 3, 3, 5, 30).startOf('day').toISOTime(); //=> '00:00.000-05:00'
   * @example DateTime.local(2014, 3, 3, 5, 30).startOf('hour').toISOTime(); //=> '05:00:00.000-05:00'
   * @return {DateTime}
   */
  startOf(unit) {
    if (!this.isValid) return this;
    const o = {}, normalizedUnit = Duration$1.normalizeUnit(unit);
    switch (normalizedUnit) {
      case "years":
        o.month = 1;
      case "quarters":
      case "months":
        o.day = 1;
      case "weeks":
      case "days":
        o.hour = 0;
      case "hours":
        o.minute = 0;
      case "minutes":
        o.second = 0;
      case "seconds":
        o.millisecond = 0;
        break;
    }
    if (normalizedUnit === "weeks") {
      o.weekday = 1;
    }
    if (normalizedUnit === "quarters") {
      const q = Math.ceil(this.month / 3);
      o.month = (q - 1) * 3 + 1;
    }
    return this.set(o);
  }
  /**
   * "Set" this DateTime to the end (meaning the last millisecond) of a unit of time
   * @param {string} unit - The unit to go to the end of. Can be 'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', or 'millisecond'.
   * @example DateTime.local(2014, 3, 3).endOf('month').toISO(); //=> '2014-03-31T23:59:59.999-05:00'
   * @example DateTime.local(2014, 3, 3).endOf('year').toISO(); //=> '2014-12-31T23:59:59.999-05:00'
   * @example DateTime.local(2014, 3, 3).endOf('week').toISO(); // => '2014-03-09T23:59:59.999-05:00', weeks start on Mondays
   * @example DateTime.local(2014, 3, 3, 5, 30).endOf('day').toISO(); //=> '2014-03-03T23:59:59.999-05:00'
   * @example DateTime.local(2014, 3, 3, 5, 30).endOf('hour').toISO(); //=> '2014-03-03T05:59:59.999-05:00'
   * @return {DateTime}
   */
  endOf(unit) {
    return this.isValid ? this.plus({ [unit]: 1 }).startOf(unit).minus(1) : this;
  }
  // OUTPUT
  /**
   * Returns a string representation of this DateTime formatted according to the specified format string.
   * **You may not want this.** See {@link DateTime#toLocaleString} for a more flexible formatting tool. For a table of tokens and their interpretations, see [here](https://moment.github.io/luxon/#/formatting?id=table-of-tokens).
   * Defaults to en-US if no locale has been specified, regardless of the system's locale.
   * @param {string} fmt - the format string
   * @param {Object} opts - opts to override the configuration options on this DateTime
   * @example DateTime.now().toFormat('yyyy LLL dd') //=> '2017 Apr 22'
   * @example DateTime.now().setLocale('fr').toFormat('yyyy LLL dd') //=> '2017 avr. 22'
   * @example DateTime.now().toFormat('yyyy LLL dd', { locale: "fr" }) //=> '2017 avr. 22'
   * @example DateTime.now().toFormat("HH 'hours and' mm 'minutes'") //=> '20 hours and 55 minutes'
   * @return {string}
   */
  toFormat(fmt2, opts = {}) {
    return this.isValid ? Formatter$1.create(this.loc.redefaultToEN(opts)).formatDateTimeFromString(this, fmt2) : INVALID$3;
  }
  /**
   * Returns a localized string representing this date. Accepts the same options as the Intl.DateTimeFormat constructor and any presets defined by Luxon, such as `DateTime.DATE_FULL` or `DateTime.TIME_SIMPLE`.
   * The exact behavior of this method is browser-specific, but in general it will return an appropriate representation
   * of the DateTime in the assigned locale.
   * Defaults to the system's locale if no locale has been specified
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param formatOpts {Object} - Intl.DateTimeFormat constructor options and configuration options
   * @param {Object} opts - opts to override the configuration options on this DateTime
   * @example DateTime.now().toLocaleString(); //=> 4/20/2017
   * @example DateTime.now().setLocale('en-gb').toLocaleString(); //=> '20/04/2017'
   * @example DateTime.now().toLocaleString(DateTime.DATE_FULL); //=> 'April 20, 2017'
   * @example DateTime.now().toLocaleString(DateTime.DATE_FULL, { locale: 'fr' }); //=> '28 août 2022'
   * @example DateTime.now().toLocaleString(DateTime.TIME_SIMPLE); //=> '11:32 AM'
   * @example DateTime.now().toLocaleString(DateTime.DATETIME_SHORT); //=> '4/20/2017, 11:32 AM'
   * @example DateTime.now().toLocaleString({ weekday: 'long', month: 'long', day: '2-digit' }); //=> 'Thursday, April 20'
   * @example DateTime.now().toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }); //=> 'Thu, Apr 20, 11:27 AM'
   * @example DateTime.now().toLocaleString({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }); //=> '11:32'
   * @return {string}
   */
  toLocaleString(formatOpts = DATE_SHORT$1, opts = {}) {
    return this.isValid ? Formatter$1.create(this.loc.clone(opts), formatOpts).formatDateTime(this) : INVALID$3;
  }
  /**
   * Returns an array of format "parts", meaning individual tokens along with metadata. This is allows callers to post-process individual sections of the formatted output.
   * Defaults to the system's locale if no locale has been specified
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts
   * @param opts {Object} - Intl.DateTimeFormat constructor options, same as `toLocaleString`.
   * @example DateTime.now().toLocaleParts(); //=> [
   *                                   //=>   { type: 'day', value: '25' },
   *                                   //=>   { type: 'literal', value: '/' },
   *                                   //=>   { type: 'month', value: '05' },
   *                                   //=>   { type: 'literal', value: '/' },
   *                                   //=>   { type: 'year', value: '1982' }
   *                                   //=> ]
   */
  toLocaleParts(opts = {}) {
    return this.isValid ? Formatter$1.create(this.loc.clone(opts), opts).formatDateTimeParts(this) : [];
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime
   * @param {Object} opts - options
   * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
   * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {boolean} [opts.extendedZone=false] - add the time zone format extension
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @example DateTime.utc(1983, 5, 25).toISO() //=> '1982-05-25T00:00:00.000Z'
   * @example DateTime.now().toISO() //=> '2017-04-22T20:47:05.335-04:00'
   * @example DateTime.now().toISO({ includeOffset: false }) //=> '2017-04-22T20:47:05.335'
   * @example DateTime.now().toISO({ format: 'basic' }) //=> '20170422T204705.335-0400'
   * @return {string}
   */
  toISO({
    format: format2 = "extended",
    suppressSeconds = false,
    suppressMilliseconds = false,
    includeOffset = true,
    extendedZone = false
  } = {}) {
    if (!this.isValid) {
      return null;
    }
    const ext = format2 === "extended";
    let c = toISODate$1(this, ext);
    c += "T";
    c += toISOTime$1(this, ext, suppressSeconds, suppressMilliseconds, includeOffset, extendedZone);
    return c;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's date component
   * @param {Object} opts - options
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @example DateTime.utc(1982, 5, 25).toISODate() //=> '1982-05-25'
   * @example DateTime.utc(1982, 5, 25).toISODate({ format: 'basic' }) //=> '19820525'
   * @return {string}
   */
  toISODate({ format: format2 = "extended" } = {}) {
    if (!this.isValid) {
      return null;
    }
    return toISODate$1(this, format2 === "extended");
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's week date
   * @example DateTime.utc(1982, 5, 25).toISOWeekDate() //=> '1982-W21-2'
   * @return {string}
   */
  toISOWeekDate() {
    return toTechFormat$1(this, "kkkk-'W'WW-c");
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's time component
   * @param {Object} opts - options
   * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
   * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {boolean} [opts.extendedZone=true] - add the time zone format extension
   * @param {boolean} [opts.includePrefix=false] - include the `T` prefix
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime() //=> '07:34:19.361Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34, seconds: 0, milliseconds: 0 }).toISOTime({ suppressSeconds: true }) //=> '07:34Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ format: 'basic' }) //=> '073419.361Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ includePrefix: true }) //=> 'T07:34:19.361Z'
   * @return {string}
   */
  toISOTime({
    suppressMilliseconds = false,
    suppressSeconds = false,
    includeOffset = true,
    includePrefix = false,
    extendedZone = false,
    format: format2 = "extended"
  } = {}) {
    if (!this.isValid) {
      return null;
    }
    let c = includePrefix ? "T" : "";
    return c + toISOTime$1(
      this,
      format2 === "extended",
      suppressSeconds,
      suppressMilliseconds,
      includeOffset,
      extendedZone
    );
  }
  /**
   * Returns an RFC 2822-compatible string representation of this DateTime
   * @example DateTime.utc(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 +0000'
   * @example DateTime.local(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 -0400'
   * @return {string}
   */
  toRFC2822() {
    return toTechFormat$1(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", false);
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in HTTP headers. The output is always expressed in GMT.
   * Specifically, the string conforms to RFC 1123.
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
   * @example DateTime.utc(2014, 7, 13).toHTTP() //=> 'Sun, 13 Jul 2014 00:00:00 GMT'
   * @example DateTime.utc(2014, 7, 13, 19).toHTTP() //=> 'Sun, 13 Jul 2014 19:00:00 GMT'
   * @return {string}
   */
  toHTTP() {
    return toTechFormat$1(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in SQL Date
   * @example DateTime.utc(2014, 7, 13).toSQLDate() //=> '2014-07-13'
   * @return {string}
   */
  toSQLDate() {
    if (!this.isValid) {
      return null;
    }
    return toISODate$1(this, true);
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in SQL Time
   * @param {Object} opts - options
   * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {boolean} [opts.includeOffsetSpace=true] - include the space between the time and the offset, such as '05:15:16.345 -04:00'
   * @example DateTime.utc().toSQL() //=> '05:15:16.345'
   * @example DateTime.now().toSQL() //=> '05:15:16.345 -04:00'
   * @example DateTime.now().toSQL({ includeOffset: false }) //=> '05:15:16.345'
   * @example DateTime.now().toSQL({ includeZone: false }) //=> '05:15:16.345 America/New_York'
   * @return {string}
   */
  toSQLTime({ includeOffset = true, includeZone = false, includeOffsetSpace = true } = {}) {
    let fmt2 = "HH:mm:ss.SSS";
    if (includeZone || includeOffset) {
      if (includeOffsetSpace) {
        fmt2 += " ";
      }
      if (includeZone) {
        fmt2 += "z";
      } else if (includeOffset) {
        fmt2 += "ZZ";
      }
    }
    return toTechFormat$1(this, fmt2, true);
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in SQL DateTime
   * @param {Object} opts - options
   * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {boolean} [opts.includeOffsetSpace=true] - include the space between the time and the offset, such as '05:15:16.345 -04:00'
   * @example DateTime.utc(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 Z'
   * @example DateTime.local(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 -04:00'
   * @example DateTime.local(2014, 7, 13).toSQL({ includeOffset: false }) //=> '2014-07-13 00:00:00.000'
   * @example DateTime.local(2014, 7, 13).toSQL({ includeZone: true }) //=> '2014-07-13 00:00:00.000 America/New_York'
   * @return {string}
   */
  toSQL(opts = {}) {
    if (!this.isValid) {
      return null;
    }
    return `${this.toSQLDate()} ${this.toSQLTime(opts)}`;
  }
  /**
   * Returns a string representation of this DateTime appropriate for debugging
   * @return {string}
   */
  toString() {
    return this.isValid ? this.toISO() : INVALID$3;
  }
  /**
   * Returns the epoch milliseconds of this DateTime. Alias of {@link DateTime#toMillis}
   * @return {number}
   */
  valueOf() {
    return this.toMillis();
  }
  /**
   * Returns the epoch milliseconds of this DateTime.
   * @return {number}
   */
  toMillis() {
    return this.isValid ? this.ts : NaN;
  }
  /**
   * Returns the epoch seconds of this DateTime.
   * @return {number}
   */
  toSeconds() {
    return this.isValid ? this.ts / 1e3 : NaN;
  }
  /**
   * Returns the epoch seconds (as a whole number) of this DateTime.
   * @return {number}
   */
  toUnixInteger() {
    return this.isValid ? Math.floor(this.ts / 1e3) : NaN;
  }
  /**
   * Returns an ISO 8601 representation of this DateTime appropriate for use in JSON.
   * @return {string}
   */
  toJSON() {
    return this.toISO();
  }
  /**
   * Returns a BSON serializable equivalent to this DateTime.
   * @return {Date}
   */
  toBSON() {
    return this.toJSDate();
  }
  /**
   * Returns a JavaScript object with this DateTime's year, month, day, and so on.
   * @param opts - options for generating the object
   * @param {boolean} [opts.includeConfig=false] - include configuration attributes in the output
   * @example DateTime.now().toObject() //=> { year: 2017, month: 4, day: 22, hour: 20, minute: 49, second: 42, millisecond: 268 }
   * @return {Object}
   */
  toObject(opts = {}) {
    if (!this.isValid) return {};
    const base2 = { ...this.c };
    if (opts.includeConfig) {
      base2.outputCalendar = this.outputCalendar;
      base2.numberingSystem = this.loc.numberingSystem;
      base2.locale = this.loc.locale;
    }
    return base2;
  }
  /**
   * Returns a JavaScript Date equivalent to this DateTime.
   * @return {Date}
   */
  toJSDate() {
    return new Date(this.isValid ? this.ts : NaN);
  }
  // COMPARE
  /**
   * Return the difference between two DateTimes as a Duration.
   * @param {DateTime} otherDateTime - the DateTime to compare this one to
   * @param {string|string[]} [unit=['milliseconds']] - the unit or array of units (such as 'hours' or 'days') to include in the duration.
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @example
   * var i1 = DateTime.fromISO('1982-05-25T09:45'),
   *     i2 = DateTime.fromISO('1983-10-14T10:30');
   * i2.diff(i1).toObject() //=> { milliseconds: 43807500000 }
   * i2.diff(i1, 'hours').toObject() //=> { hours: 12168.75 }
   * i2.diff(i1, ['months', 'days']).toObject() //=> { months: 16, days: 19.03125 }
   * i2.diff(i1, ['months', 'days', 'hours']).toObject() //=> { months: 16, days: 19, hours: 0.75 }
   * @return {Duration}
   */
  diff(otherDateTime, unit = "milliseconds", opts = {}) {
    if (!this.isValid || !otherDateTime.isValid) {
      return Duration$1.invalid("created by diffing an invalid DateTime");
    }
    const durOpts = { locale: this.locale, numberingSystem: this.numberingSystem, ...opts };
    const units = maybeArray$1(unit).map(Duration$1.normalizeUnit), otherIsLater = otherDateTime.valueOf() > this.valueOf(), earlier = otherIsLater ? this : otherDateTime, later = otherIsLater ? otherDateTime : this, diffed = diff$1(earlier, later, units, durOpts);
    return otherIsLater ? diffed.negate() : diffed;
  }
  /**
   * Return the difference between this DateTime and right now.
   * See {@link DateTime#diff}
   * @param {string|string[]} [unit=['milliseconds']] - the unit or units units (such as 'hours' or 'days') to include in the duration
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @return {Duration}
   */
  diffNow(unit = "milliseconds", opts = {}) {
    return this.diff(DateTime.now(), unit, opts);
  }
  /**
   * Return an Interval spanning between this DateTime and another DateTime
   * @param {DateTime} otherDateTime - the other end point of the Interval
   * @return {Interval}
   */
  until(otherDateTime) {
    return this.isValid ? Interval$1.fromDateTimes(this, otherDateTime) : this;
  }
  /**
   * Return whether this DateTime is in the same unit of time as another DateTime.
   * Higher-order units must also be identical for this function to return `true`.
   * Note that time zones are **ignored** in this comparison, which compares the **local** calendar time. Use {@link DateTime#setZone} to convert one of the dates if needed.
   * @param {DateTime} otherDateTime - the other DateTime
   * @param {string} unit - the unit of time to check sameness on
   * @example DateTime.now().hasSame(otherDT, 'day'); //~> true if otherDT is in the same current calendar day
   * @return {boolean}
   */
  hasSame(otherDateTime, unit) {
    if (!this.isValid) return false;
    const inputMs = otherDateTime.valueOf();
    const adjustedToZone = this.setZone(otherDateTime.zone, { keepLocalTime: true });
    return adjustedToZone.startOf(unit) <= inputMs && inputMs <= adjustedToZone.endOf(unit);
  }
  /**
   * Equality check
   * Two DateTimes are equal if and only if they represent the same millisecond, have the same zone and location, and are both valid.
   * To compare just the millisecond values, use `+dt1 === +dt2`.
   * @param {DateTime} other - the other DateTime
   * @return {boolean}
   */
  equals(other) {
    return this.isValid && other.isValid && this.valueOf() === other.valueOf() && this.zone.equals(other.zone) && this.loc.equals(other.loc);
  }
  /**
   * Returns a string representation of a this time relative to now, such as "in two days". Can only internationalize if your
   * platform supports Intl.RelativeTimeFormat. Rounds down by default.
   * @param {Object} options - options that affect the output
   * @param {DateTime} [options.base=DateTime.now()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
   * @param {string} [options.style="long"] - the style of units, must be "long", "short", or "narrow"
   * @param {string|string[]} options.unit - use a specific unit or array of units; if omitted, or an array, the method will pick the best unit. Use an array or one of "years", "quarters", "months", "weeks", "days", "hours", "minutes", or "seconds"
   * @param {boolean} [options.round=true] - whether to round the numbers in the output.
   * @param {number} [options.padding=0] - padding in milliseconds. This allows you to round up the result if it fits inside the threshold. Don't use in combination with {round: false} because the decimal output will include the padding.
   * @param {string} options.locale - override the locale of this DateTime
   * @param {string} options.numberingSystem - override the numberingSystem of this DateTime. The Intl system may choose not to honor this
   * @example DateTime.now().plus({ days: 1 }).toRelative() //=> "in 1 day"
   * @example DateTime.now().setLocale("es").toRelative({ days: 1 }) //=> "dentro de 1 día"
   * @example DateTime.now().plus({ days: 1 }).toRelative({ locale: "fr" }) //=> "dans 23 heures"
   * @example DateTime.now().minus({ days: 2 }).toRelative() //=> "2 days ago"
   * @example DateTime.now().minus({ days: 2 }).toRelative({ unit: "hours" }) //=> "48 hours ago"
   * @example DateTime.now().minus({ hours: 36 }).toRelative({ round: false }) //=> "1.5 days ago"
   */
  toRelative(options2 = {}) {
    if (!this.isValid) return null;
    const base2 = options2.base || DateTime.fromObject({}, { zone: this.zone }), padding = options2.padding ? this < base2 ? -options2.padding : options2.padding : 0;
    let units = ["years", "months", "days", "hours", "minutes", "seconds"];
    let unit = options2.unit;
    if (Array.isArray(options2.unit)) {
      units = options2.unit;
      unit = void 0;
    }
    return diffRelative$1(base2, this.plus(padding), {
      ...options2,
      numeric: "always",
      units,
      unit
    });
  }
  /**
   * Returns a string representation of this date relative to today, such as "yesterday" or "next month".
   * Only internationalizes on platforms that supports Intl.RelativeTimeFormat.
   * @param {Object} options - options that affect the output
   * @param {DateTime} [options.base=DateTime.now()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
   * @param {string} options.locale - override the locale of this DateTime
   * @param {string} options.unit - use a specific unit; if omitted, the method will pick the unit. Use one of "years", "quarters", "months", "weeks", or "days"
   * @param {string} options.numberingSystem - override the numberingSystem of this DateTime. The Intl system may choose not to honor this
   * @example DateTime.now().plus({ days: 1 }).toRelativeCalendar() //=> "tomorrow"
   * @example DateTime.now().setLocale("es").plus({ days: 1 }).toRelative() //=> ""mañana"
   * @example DateTime.now().plus({ days: 1 }).toRelativeCalendar({ locale: "fr" }) //=> "demain"
   * @example DateTime.now().minus({ days: 2 }).toRelativeCalendar() //=> "2 days ago"
   */
  toRelativeCalendar(options2 = {}) {
    if (!this.isValid) return null;
    return diffRelative$1(options2.base || DateTime.fromObject({}, { zone: this.zone }), this, {
      ...options2,
      numeric: "auto",
      units: ["years", "months", "days"],
      calendary: true
    });
  }
  /**
   * Return the min of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the minimum
   * @return {DateTime} the min DateTime, or undefined if called with no argument
   */
  static min(...dateTimes) {
    if (!dateTimes.every(DateTime.isDateTime)) {
      throw new InvalidArgumentError$1("min requires all arguments be DateTimes");
    }
    return bestBy$1(dateTimes, (i) => i.valueOf(), Math.min);
  }
  /**
   * Return the max of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the maximum
   * @return {DateTime} the max DateTime, or undefined if called with no argument
   */
  static max(...dateTimes) {
    if (!dateTimes.every(DateTime.isDateTime)) {
      throw new InvalidArgumentError$1("max requires all arguments be DateTimes");
    }
    return bestBy$1(dateTimes, (i) => i.valueOf(), Math.max);
  }
  // MISC
  /**
   * Explain how a string would be parsed by fromFormat()
   * @param {string} text - the string to parse
   * @param {string} fmt - the format the string is expected to be in (see description)
   * @param {Object} options - options taken by fromFormat()
   * @return {Object}
   */
  static fromFormatExplain(text2, fmt2, options2 = {}) {
    const { locale = null, numberingSystem = null } = options2, localeToUse = Locale$1.fromOpts({
      locale,
      numberingSystem,
      defaultToEN: true
    });
    return explainFromTokens$1(localeToUse, text2, fmt2);
  }
  /**
   * @deprecated use fromFormatExplain instead
   */
  static fromStringExplain(text2, fmt2, options2 = {}) {
    return DateTime.fromFormatExplain(text2, fmt2, options2);
  }
  // FORMAT PRESETS
  /**
   * {@link DateTime#toLocaleString} format like 10/14/1983
   * @type {Object}
   */
  static get DATE_SHORT() {
    return DATE_SHORT$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983'
   * @type {Object}
   */
  static get DATE_MED() {
    return DATE_MED$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Fri, Oct 14, 1983'
   * @type {Object}
   */
  static get DATE_MED_WITH_WEEKDAY() {
    return DATE_MED_WITH_WEEKDAY$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983'
   * @type {Object}
   */
  static get DATE_FULL() {
    return DATE_FULL$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Tuesday, October 14, 1983'
   * @type {Object}
   */
  static get DATE_HUGE() {
    return DATE_HUGE$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_SIMPLE() {
    return TIME_SIMPLE$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SECONDS() {
    return TIME_WITH_SECONDS$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SHORT_OFFSET() {
    return TIME_WITH_SHORT_OFFSET$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_LONG_OFFSET() {
    return TIME_WITH_LONG_OFFSET$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_SIMPLE() {
    return TIME_24_SIMPLE$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_SECONDS() {
    return TIME_24_WITH_SECONDS$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 EDT', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_SHORT_OFFSET() {
    return TIME_24_WITH_SHORT_OFFSET$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 Eastern Daylight Time', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_LONG_OFFSET() {
    return TIME_24_WITH_LONG_OFFSET$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT() {
    return DATETIME_SHORT$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT_WITH_SECONDS() {
    return DATETIME_SHORT_WITH_SECONDS$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED() {
    return DATETIME_MED$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED_WITH_SECONDS() {
    return DATETIME_MED_WITH_SECONDS$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Fri, 14 Oct 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED_WITH_WEEKDAY() {
    return DATETIME_MED_WITH_WEEKDAY$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL() {
    return DATETIME_FULL$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30:33 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL_WITH_SECONDS() {
    return DATETIME_FULL_WITH_SECONDS$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE() {
    return DATETIME_HUGE$1;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30:33 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE_WITH_SECONDS() {
    return DATETIME_HUGE_WITH_SECONDS$1;
  }
};
function friendlyDateTime$1(dateTimeish) {
  if (DateTime$1.isDateTime(dateTimeish)) {
    return dateTimeish;
  } else if (dateTimeish && dateTimeish.valueOf && isNumber$3(dateTimeish.valueOf())) {
    return DateTime$1.fromJSDate(dateTimeish);
  } else if (dateTimeish && typeof dateTimeish === "object") {
    return DateTime$1.fromObject(dateTimeish);
  } else {
    throw new InvalidArgumentError$1(
      `Unknown datetime argument: ${dateTimeish}, of type ${typeof dateTimeish}`
    );
  }
}
const DEFAULT_QUERY_SETTINGS = {
  renderNullAs: "\\-",
  taskCompletionTracking: false,
  taskCompletionUseEmojiShorthand: false,
  taskCompletionText: "completion",
  taskCompletionDateFormat: "yyyy-MM-dd",
  recursiveSubTaskCompletion: false,
  warnOnEmptyResult: true,
  refreshEnabled: true,
  refreshInterval: 2500,
  defaultDateFormat: "MMMM dd, yyyy",
  defaultDateTimeFormat: "h:mm a - MMMM dd, yyyy",
  maxRecursiveRenderDepth: 4,
  tableIdColumnName: "File",
  tableGroupColumnName: "Group",
  showResultCount: true
};
const DEFAULT_EXPORT_SETTINGS = {
  allowHtml: true
};
({
  ...DEFAULT_QUERY_SETTINGS,
  ...DEFAULT_EXPORT_SETTINGS,
  ...{
    inlineQueryPrefix: "=",
    inlineJsQueryPrefix: "$=",
    inlineQueriesInCodeblocks: true,
    enableInlineDataview: true,
    enableDataviewJs: false,
    enableInlineDataviewJs: false,
    prettyRenderInlineFields: true,
    prettyRenderInlineFieldsInLivePreview: true,
    dataviewJsKeyword: "dataviewjs"
  }
});
class Success {
  constructor(value2) {
    __publicField(this, "value");
    __publicField(this, "successful");
    this.value = value2;
    this.successful = true;
  }
  map(f) {
    return new Success(f(this.value));
  }
  flatMap(f) {
    return f(this.value);
  }
  mapErr(f) {
    return this;
  }
  bimap(succ, _fail) {
    return this.map(succ);
  }
  orElse(_value) {
    return this.value;
  }
  cast() {
    return this;
  }
  orElseThrow(_message) {
    return this.value;
  }
}
class Failure {
  constructor(error2) {
    __publicField(this, "error");
    __publicField(this, "successful");
    this.error = error2;
    this.successful = false;
  }
  map(_f2) {
    return this;
  }
  flatMap(_f2) {
    return this;
  }
  mapErr(f) {
    return new Failure(f(this.error));
  }
  bimap(_succ, fail) {
    return this.mapErr(fail);
  }
  orElse(value2) {
    return value2;
  }
  cast() {
    return this;
  }
  orElseThrow(message) {
    if (message)
      throw new Error(message(this.error));
    else
      throw new Error("" + this.error);
  }
}
var Result;
(function(Result2) {
  function success(value2) {
    return new Success(value2);
  }
  Result2.success = success;
  function failure(error2) {
    return new Failure(error2);
  }
  Result2.failure = failure;
  function flatMap2(first, second, f) {
    if (first.successful) {
      if (second.successful)
        return f(first.value, second.value);
      else
        return failure(second.error);
    } else {
      return failure(first.error);
    }
  }
  Result2.flatMap2 = flatMap2;
  function map2(first, second, f) {
    return flatMap2(first, second, (a, b) => success(f(a, b)));
  }
  Result2.map2 = map2;
})(Result || (Result = {}));
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof commonjsGlobal$1 !== "undefined" ? commonjsGlobal$1 : typeof self !== "undefined" ? self : {};
var parsimmon_umd_min = { exports: {} };
(function(module, exports) {
  !function(n2, t) {
    module.exports = t();
  }("undefined" != typeof self ? self : commonjsGlobal, function() {
    return function(n2) {
      var t = {};
      function r(e) {
        if (t[e]) return t[e].exports;
        var u = t[e] = { i: e, l: false, exports: {} };
        return n2[e].call(u.exports, u, u.exports, r), u.l = true, u.exports;
      }
      return r.m = n2, r.c = t, r.d = function(n3, t2, e) {
        r.o(n3, t2) || Object.defineProperty(n3, t2, { configurable: false, enumerable: true, get: e });
      }, r.r = function(n3) {
        Object.defineProperty(n3, "__esModule", { value: true });
      }, r.n = function(n3) {
        var t2 = n3 && n3.__esModule ? function() {
          return n3.default;
        } : function() {
          return n3;
        };
        return r.d(t2, "a", t2), t2;
      }, r.o = function(n3, t2) {
        return Object.prototype.hasOwnProperty.call(n3, t2);
      }, r.p = "", r(r.s = 0);
    }([function(n2, t, r) {
      function e(n3) {
        if (!(this instanceof e)) return new e(n3);
        this._ = n3;
      }
      var u = e.prototype;
      function o(n3, t2) {
        for (var r2 = 0; r2 < n3; r2++) t2(r2);
      }
      function i(n3, t2, r2) {
        return function(n4, t3) {
          o(t3.length, function(r3) {
            n4(t3[r3], r3, t3);
          });
        }(function(r3, e2, u2) {
          t2 = n3(t2, r3, e2, u2);
        }, r2), t2;
      }
      function a(n3, t2) {
        return i(function(t3, r2, e2, u2) {
          return t3.concat([n3(r2, e2, u2)]);
        }, [], t2);
      }
      function f(n3, t2) {
        var r2 = { v: 0, buf: t2 };
        return o(n3, function() {
          var n4;
          r2 = { v: r2.v << 1 | (n4 = r2.buf, n4[0] >> 7), buf: function(n5) {
            var t3 = i(function(n6, t4, r3, e2) {
              return n6.concat(r3 === e2.length - 1 ? Buffer.from([t4, 0]).readUInt16BE(0) : e2.readUInt16BE(r3));
            }, [], n5);
            return Buffer.from(a(function(n6) {
              return (n6 << 1 & 65535) >> 8;
            }, t3));
          }(r2.buf) };
        }), r2;
      }
      function c() {
        return "undefined" != typeof Buffer;
      }
      function s2() {
        if (!c()) throw new Error("Buffer global does not exist; please use webpack if you need to parse Buffers in the browser.");
      }
      function l2(n3) {
        s2();
        var t2 = i(function(n4, t3) {
          return n4 + t3;
        }, 0, n3);
        if (t2 % 8 != 0) throw new Error("The bits [" + n3.join(", ") + "] add up to " + t2 + " which is not an even number of bytes; the total should be divisible by 8");
        var r2, u2 = t2 / 8, o2 = (r2 = function(n4) {
          return n4 > 48;
        }, i(function(n4, t3) {
          return n4 || (r2(t3) ? t3 : n4);
        }, null, n3));
        if (o2) throw new Error(o2 + " bit range requested exceeds 48 bit (6 byte) Number max.");
        return new e(function(t3, r3) {
          var e2 = u2 + r3;
          return e2 > t3.length ? x2(r3, u2.toString() + " bytes") : b(e2, i(function(n4, t4) {
            var r4 = f(t4, n4.buf);
            return { coll: n4.coll.concat(r4.v), buf: r4.buf };
          }, { coll: [], buf: t3.slice(r3, e2) }, n3).coll);
        });
      }
      function h(n3, t2) {
        return new e(function(r2, e2) {
          return s2(), e2 + t2 > r2.length ? x2(e2, t2 + " bytes for " + n3) : b(e2 + t2, r2.slice(e2, e2 + t2));
        });
      }
      function p2(n3, t2) {
        if ("number" != typeof (r2 = t2) || Math.floor(r2) !== r2 || t2 < 0 || t2 > 6) throw new Error(n3 + " requires integer length in range [0, 6].");
        var r2;
      }
      function d(n3) {
        return p2("uintBE", n3), h("uintBE(" + n3 + ")", n3).map(function(t2) {
          return t2.readUIntBE(0, n3);
        });
      }
      function v(n3) {
        return p2("uintLE", n3), h("uintLE(" + n3 + ")", n3).map(function(t2) {
          return t2.readUIntLE(0, n3);
        });
      }
      function g(n3) {
        return p2("intBE", n3), h("intBE(" + n3 + ")", n3).map(function(t2) {
          return t2.readIntBE(0, n3);
        });
      }
      function m(n3) {
        return p2("intLE", n3), h("intLE(" + n3 + ")", n3).map(function(t2) {
          return t2.readIntLE(0, n3);
        });
      }
      function y2(n3) {
        return n3 instanceof e;
      }
      function E(n3) {
        return "[object Array]" === {}.toString.call(n3);
      }
      function w(n3) {
        return c() && Buffer.isBuffer(n3);
      }
      function b(n3, t2) {
        return { status: true, index: n3, value: t2, furthest: -1, expected: [] };
      }
      function x2(n3, t2) {
        return E(t2) || (t2 = [t2]), { status: false, index: -1, value: null, furthest: n3, expected: t2 };
      }
      function B(n3, t2) {
        if (!t2) return n3;
        if (n3.furthest > t2.furthest) return n3;
        var r2 = n3.furthest === t2.furthest ? function(n4, t3) {
          if (function() {
            if (void 0 !== e._supportsSet) return e._supportsSet;
            var n5 = "undefined" != typeof Set;
            return e._supportsSet = n5, n5;
          }() && Array.from) {
            for (var r3 = new Set(n4), u2 = 0; u2 < t3.length; u2++) r3.add(t3[u2]);
            var o2 = Array.from(r3);
            return o2.sort(), o2;
          }
          for (var i2 = {}, a2 = 0; a2 < n4.length; a2++) i2[n4[a2]] = true;
          for (var f2 = 0; f2 < t3.length; f2++) i2[t3[f2]] = true;
          var c2 = [];
          for (var s3 in i2) ({}).hasOwnProperty.call(i2, s3) && c2.push(s3);
          return c2.sort(), c2;
        }(n3.expected, t2.expected) : t2.expected;
        return { status: n3.status, index: n3.index, value: n3.value, furthest: t2.furthest, expected: r2 };
      }
      var j = {};
      function S(n3, t2) {
        if (w(n3)) return { offset: t2, line: -1, column: -1 };
        n3 in j || (j[n3] = {});
        for (var r2 = j[n3], e2 = 0, u2 = 0, o2 = 0, i2 = t2; i2 >= 0; ) {
          if (i2 in r2) {
            e2 = r2[i2].line, 0 === o2 && (o2 = r2[i2].lineStart);
            break;
          }
          ("\n" === n3.charAt(i2) || "\r" === n3.charAt(i2) && "\n" !== n3.charAt(i2 + 1)) && (u2++, 0 === o2 && (o2 = i2 + 1)), i2--;
        }
        var a2 = e2 + u2, f2 = t2 - o2;
        return r2[t2] = { line: a2, lineStart: o2 }, { offset: t2, line: a2 + 1, column: f2 + 1 };
      }
      function _(n3) {
        if (!y2(n3)) throw new Error("not a parser: " + n3);
      }
      function L(n3, t2) {
        return "string" == typeof n3 ? n3.charAt(t2) : n3[t2];
      }
      function O(n3) {
        if ("number" != typeof n3) throw new Error("not a number: " + n3);
      }
      function k(n3) {
        if ("function" != typeof n3) throw new Error("not a function: " + n3);
      }
      function P(n3) {
        if ("string" != typeof n3) throw new Error("not a string: " + n3);
      }
      var q = 2, A = 3, I = 8, F = 5 * I, M = 4 * I, z = "  ";
      function R(n3, t2) {
        return new Array(t2 + 1).join(n3);
      }
      function U(n3, t2, r2) {
        var e2 = t2 - n3.length;
        return e2 <= 0 ? n3 : R(r2, e2) + n3;
      }
      function W(n3, t2, r2, e2) {
        return { from: n3 - t2 > 0 ? n3 - t2 : 0, to: n3 + r2 > e2 ? e2 : n3 + r2 };
      }
      function D(n3, t2) {
        var r2, e2, u2, o2, f2, c2 = t2.index, s3 = c2.offset, l3 = 1;
        if (s3 === n3.length) return "Got the end of the input";
        if (w(n3)) {
          var h2 = s3 - s3 % I, p3 = s3 - h2, d2 = W(h2, F, M + I, n3.length), v2 = a(function(n4) {
            return a(function(n5) {
              return U(n5.toString(16), 2, "0");
            }, n4);
          }, function(n4, t3) {
            var r3 = n4.length, e3 = [], u3 = 0;
            if (r3 <= t3) return [n4.slice()];
            for (var o3 = 0; o3 < r3; o3++) e3[u3] || e3.push([]), e3[u3].push(n4[o3]), (o3 + 1) % t3 == 0 && u3++;
            return e3;
          }(n3.slice(d2.from, d2.to).toJSON().data, I));
          o2 = function(n4) {
            return 0 === n4.from && 1 === n4.to ? { from: n4.from, to: n4.to } : { from: n4.from / I, to: Math.floor(n4.to / I) };
          }(d2), e2 = h2 / I, r2 = 3 * p3, p3 >= 4 && (r2 += 1), l3 = 2, u2 = a(function(n4) {
            return n4.length <= 4 ? n4.join(" ") : n4.slice(0, 4).join(" ") + "  " + n4.slice(4).join(" ");
          }, v2), (f2 = (8 * (o2.to > 0 ? o2.to - 1 : o2.to)).toString(16).length) < 2 && (f2 = 2);
        } else {
          var g2 = n3.split(/\r\n|[\n\r\u2028\u2029]/);
          r2 = c2.column - 1, e2 = c2.line - 1, o2 = W(e2, q, A, g2.length), u2 = g2.slice(o2.from, o2.to), f2 = o2.to.toString().length;
        }
        var m2 = e2 - o2.from;
        return w(n3) && (f2 = (8 * (o2.to > 0 ? o2.to - 1 : o2.to)).toString(16).length) < 2 && (f2 = 2), i(function(t3, e3, u3) {
          var i2, a2 = u3 === m2, c3 = a2 ? "> " : z;
          return i2 = w(n3) ? U((8 * (o2.from + u3)).toString(16), f2, "0") : U((o2.from + u3 + 1).toString(), f2, " "), [].concat(t3, [c3 + i2 + " | " + e3], a2 ? [z + R(" ", f2) + " | " + U("", r2, " ") + R("^", l3)] : []);
        }, [], u2).join("\n");
      }
      function N(n3, t2) {
        return ["\n", "-- PARSING FAILED " + R("-", 50), "\n\n", D(n3, t2), "\n\n", (r2 = t2.expected, 1 === r2.length ? "Expected:\n\n" + r2[0] : "Expected one of the following: \n\n" + r2.join(", ")), "\n"].join("");
        var r2;
      }
      function G(n3) {
        return void 0 !== n3.flags ? n3.flags : [n3.global ? "g" : "", n3.ignoreCase ? "i" : "", n3.multiline ? "m" : "", n3.unicode ? "u" : "", n3.sticky ? "y" : ""].join("");
      }
      function C() {
        for (var n3 = [].slice.call(arguments), t2 = n3.length, r2 = 0; r2 < t2; r2 += 1) _(n3[r2]);
        return e(function(r3, e2) {
          for (var u2, o2 = new Array(t2), i2 = 0; i2 < t2; i2 += 1) {
            if (!(u2 = B(n3[i2]._(r3, e2), u2)).status) return u2;
            o2[i2] = u2.value, e2 = u2.index;
          }
          return B(b(e2, o2), u2);
        });
      }
      function J() {
        var n3 = [].slice.call(arguments);
        if (0 === n3.length) throw new Error("seqMap needs at least one argument");
        var t2 = n3.pop();
        return k(t2), C.apply(null, n3).map(function(n4) {
          return t2.apply(null, n4);
        });
      }
      function T() {
        var n3 = [].slice.call(arguments), t2 = n3.length;
        if (0 === t2) return Y("zero alternates");
        for (var r2 = 0; r2 < t2; r2 += 1) _(n3[r2]);
        return e(function(t3, r3) {
          for (var e2, u2 = 0; u2 < n3.length; u2 += 1) if ((e2 = B(n3[u2]._(t3, r3), e2)).status) return e2;
          return e2;
        });
      }
      function V(n3, t2) {
        return H(n3, t2).or(X([]));
      }
      function H(n3, t2) {
        return _(n3), _(t2), J(n3, t2.then(n3).many(), function(n4, t3) {
          return [n4].concat(t3);
        });
      }
      function K(n3) {
        P(n3);
        var t2 = "'" + n3 + "'";
        return e(function(r2, e2) {
          var u2 = e2 + n3.length, o2 = r2.slice(e2, u2);
          return o2 === n3 ? b(u2, o2) : x2(e2, t2);
        });
      }
      function Q(n3, t2) {
        !function(n4) {
          if (!(n4 instanceof RegExp)) throw new Error("not a regexp: " + n4);
          for (var t3 = G(n4), r3 = 0; r3 < t3.length; r3++) {
            var e2 = t3.charAt(r3);
            if ("i" !== e2 && "m" !== e2 && "u" !== e2 && "s" !== e2) throw new Error('unsupported regexp flag "' + e2 + '": ' + n4);
          }
        }(n3), arguments.length >= 2 ? O(t2) : t2 = 0;
        var r2 = function(n4) {
          return RegExp("^(?:" + n4.source + ")", G(n4));
        }(n3), u2 = "" + n3;
        return e(function(n4, e2) {
          var o2 = r2.exec(n4.slice(e2));
          if (o2) {
            if (0 <= t2 && t2 <= o2.length) {
              var i2 = o2[0], a2 = o2[t2];
              return b(e2 + i2.length, a2);
            }
            return x2(e2, "valid match group (0 to " + o2.length + ") in " + u2);
          }
          return x2(e2, u2);
        });
      }
      function X(n3) {
        return e(function(t2, r2) {
          return b(r2, n3);
        });
      }
      function Y(n3) {
        return e(function(t2, r2) {
          return x2(r2, n3);
        });
      }
      function Z(n3) {
        if (y2(n3)) return e(function(t2, r2) {
          var e2 = n3._(t2, r2);
          return e2.index = r2, e2.value = "", e2;
        });
        if ("string" == typeof n3) return Z(K(n3));
        if (n3 instanceof RegExp) return Z(Q(n3));
        throw new Error("not a string, regexp, or parser: " + n3);
      }
      function $(n3) {
        return _(n3), e(function(t2, r2) {
          var e2 = n3._(t2, r2), u2 = t2.slice(r2, e2.index);
          return e2.status ? x2(r2, 'not "' + u2 + '"') : b(r2, null);
        });
      }
      function nn(n3) {
        return k(n3), e(function(t2, r2) {
          var e2 = L(t2, r2);
          return r2 < t2.length && n3(e2) ? b(r2 + 1, e2) : x2(r2, "a character/byte matching " + n3);
        });
      }
      function tn(n3, t2) {
        arguments.length < 2 && (t2 = n3, n3 = void 0);
        var r2 = e(function(n4, e2) {
          return r2._ = t2()._, r2._(n4, e2);
        });
        return n3 ? r2.desc(n3) : r2;
      }
      function rn() {
        return Y("fantasy-land/empty");
      }
      u.parse = function(n3) {
        if ("string" != typeof n3 && !w(n3)) throw new Error(".parse must be called with a string or Buffer as its argument");
        var t2, r2 = this.skip(an)._(n3, 0);
        return t2 = r2.status ? { status: true, value: r2.value } : { status: false, index: S(n3, r2.furthest), expected: r2.expected }, delete j[n3], t2;
      }, u.tryParse = function(n3) {
        var t2 = this.parse(n3);
        if (t2.status) return t2.value;
        var r2 = N(n3, t2), e2 = new Error(r2);
        throw e2.type = "ParsimmonError", e2.result = t2, e2;
      }, u.assert = function(n3, t2) {
        return this.chain(function(r2) {
          return n3(r2) ? X(r2) : Y(t2);
        });
      }, u.or = function(n3) {
        return T(this, n3);
      }, u.trim = function(n3) {
        return this.wrap(n3, n3);
      }, u.wrap = function(n3, t2) {
        return J(n3, this, t2, function(n4, t3) {
          return t3;
        });
      }, u.thru = function(n3) {
        return n3(this);
      }, u.then = function(n3) {
        return _(n3), C(this, n3).map(function(n4) {
          return n4[1];
        });
      }, u.many = function() {
        var n3 = this;
        return e(function(t2, r2) {
          for (var e2 = [], u2 = void 0; ; ) {
            if (!(u2 = B(n3._(t2, r2), u2)).status) return B(b(r2, e2), u2);
            if (r2 === u2.index) throw new Error("infinite loop detected in .many() parser --- calling .many() on a parser which can accept zero characters is usually the cause");
            r2 = u2.index, e2.push(u2.value);
          }
        });
      }, u.tieWith = function(n3) {
        return P(n3), this.map(function(t2) {
          if (function(n4) {
            if (!E(n4)) throw new Error("not an array: " + n4);
          }(t2), t2.length) {
            P(t2[0]);
            for (var r2 = t2[0], e2 = 1; e2 < t2.length; e2++) P(t2[e2]), r2 += n3 + t2[e2];
            return r2;
          }
          return "";
        });
      }, u.tie = function() {
        return this.tieWith("");
      }, u.times = function(n3, t2) {
        var r2 = this;
        return arguments.length < 2 && (t2 = n3), O(n3), O(t2), e(function(e2, u2) {
          for (var o2 = [], i2 = void 0, a2 = void 0, f2 = 0; f2 < n3; f2 += 1) {
            if (a2 = B(i2 = r2._(e2, u2), a2), !i2.status) return a2;
            u2 = i2.index, o2.push(i2.value);
          }
          for (; f2 < t2 && (a2 = B(i2 = r2._(e2, u2), a2), i2.status); f2 += 1) u2 = i2.index, o2.push(i2.value);
          return B(b(u2, o2), a2);
        });
      }, u.result = function(n3) {
        return this.map(function() {
          return n3;
        });
      }, u.atMost = function(n3) {
        return this.times(0, n3);
      }, u.atLeast = function(n3) {
        return J(this.times(n3), this.many(), function(n4, t2) {
          return n4.concat(t2);
        });
      }, u.map = function(n3) {
        k(n3);
        var t2 = this;
        return e(function(r2, e2) {
          var u2 = t2._(r2, e2);
          return u2.status ? B(b(u2.index, n3(u2.value)), u2) : u2;
        });
      }, u.contramap = function(n3) {
        k(n3);
        var t2 = this;
        return e(function(r2, e2) {
          var u2 = t2.parse(n3(r2.slice(e2)));
          return u2.status ? b(e2 + r2.length, u2.value) : u2;
        });
      }, u.promap = function(n3, t2) {
        return k(n3), k(t2), this.contramap(n3).map(t2);
      }, u.skip = function(n3) {
        return C(this, n3).map(function(n4) {
          return n4[0];
        });
      }, u.mark = function() {
        return J(en, this, en, function(n3, t2, r2) {
          return { start: n3, value: t2, end: r2 };
        });
      }, u.node = function(n3) {
        return J(en, this, en, function(t2, r2, e2) {
          return { name: n3, value: r2, start: t2, end: e2 };
        });
      }, u.sepBy = function(n3) {
        return V(this, n3);
      }, u.sepBy1 = function(n3) {
        return H(this, n3);
      }, u.lookahead = function(n3) {
        return this.skip(Z(n3));
      }, u.notFollowedBy = function(n3) {
        return this.skip($(n3));
      }, u.desc = function(n3) {
        E(n3) || (n3 = [n3]);
        var t2 = this;
        return e(function(r2, e2) {
          var u2 = t2._(r2, e2);
          return u2.status || (u2.expected = n3), u2;
        });
      }, u.fallback = function(n3) {
        return this.or(X(n3));
      }, u.ap = function(n3) {
        return J(n3, this, function(n4, t2) {
          return n4(t2);
        });
      }, u.chain = function(n3) {
        var t2 = this;
        return e(function(r2, e2) {
          var u2 = t2._(r2, e2);
          return u2.status ? B(n3(u2.value)._(r2, u2.index), u2) : u2;
        });
      }, u.concat = u.or, u.empty = rn, u.of = X, u["fantasy-land/ap"] = u.ap, u["fantasy-land/chain"] = u.chain, u["fantasy-land/concat"] = u.concat, u["fantasy-land/empty"] = u.empty, u["fantasy-land/of"] = u.of, u["fantasy-land/map"] = u.map;
      var en = e(function(n3, t2) {
        return b(t2, S(n3, t2));
      }), un = e(function(n3, t2) {
        return t2 >= n3.length ? x2(t2, "any character/byte") : b(t2 + 1, L(n3, t2));
      }), on = e(function(n3, t2) {
        return b(n3.length, n3.slice(t2));
      }), an = e(function(n3, t2) {
        return t2 < n3.length ? x2(t2, "EOF") : b(t2, null);
      }), fn2 = Q(/[0-9]/).desc("a digit"), cn = Q(/[0-9]*/).desc("optional digits"), sn = Q(/[a-z]/i).desc("a letter"), ln = Q(/[a-z]*/i).desc("optional letters"), hn = Q(/\s*/).desc("optional whitespace"), pn = Q(/\s+/).desc("whitespace"), dn = K("\r"), vn = K("\n"), gn = K("\r\n"), mn = T(gn, vn, dn).desc("newline"), yn = T(mn, an);
      e.all = on, e.alt = T, e.any = un, e.cr = dn, e.createLanguage = function(n3) {
        var t2 = {};
        for (var r2 in n3) ({}).hasOwnProperty.call(n3, r2) && function(r3) {
          t2[r3] = tn(function() {
            return n3[r3](t2);
          });
        }(r2);
        return t2;
      }, e.crlf = gn, e.custom = function(n3) {
        return e(n3(b, x2));
      }, e.digit = fn2, e.digits = cn, e.empty = rn, e.end = yn, e.eof = an, e.fail = Y, e.formatError = N, e.index = en, e.isParser = y2, e.lazy = tn, e.letter = sn, e.letters = ln, e.lf = vn, e.lookahead = Z, e.makeFailure = x2, e.makeSuccess = b, e.newline = mn, e.noneOf = function(n3) {
        return nn(function(t2) {
          return n3.indexOf(t2) < 0;
        }).desc("none of '" + n3 + "'");
      }, e.notFollowedBy = $, e.of = X, e.oneOf = function(n3) {
        for (var t2 = n3.split(""), r2 = 0; r2 < t2.length; r2++) t2[r2] = "'" + t2[r2] + "'";
        return nn(function(t3) {
          return n3.indexOf(t3) >= 0;
        }).desc(t2);
      }, e.optWhitespace = hn, e.Parser = e, e.range = function(n3, t2) {
        return nn(function(r2) {
          return n3 <= r2 && r2 <= t2;
        }).desc(n3 + "-" + t2);
      }, e.regex = Q, e.regexp = Q, e.sepBy = V, e.sepBy1 = H, e.seq = C, e.seqMap = J, e.seqObj = function() {
        for (var n3, t2 = {}, r2 = 0, u2 = (n3 = arguments, Array.prototype.slice.call(n3)), o2 = u2.length, i2 = 0; i2 < o2; i2 += 1) {
          var a2 = u2[i2];
          if (!y2(a2)) {
            if (E(a2) && 2 === a2.length && "string" == typeof a2[0] && y2(a2[1])) {
              var f2 = a2[0];
              if (Object.prototype.hasOwnProperty.call(t2, f2)) throw new Error("seqObj: duplicate key " + f2);
              t2[f2] = true, r2++;
              continue;
            }
            throw new Error("seqObj arguments must be parsers or [string, parser] array pairs.");
          }
        }
        if (0 === r2) throw new Error("seqObj expects at least one named parser, found zero");
        return e(function(n4, t3) {
          for (var r3, e2 = {}, i3 = 0; i3 < o2; i3 += 1) {
            var a3, f3;
            if (E(u2[i3]) ? (a3 = u2[i3][0], f3 = u2[i3][1]) : (a3 = null, f3 = u2[i3]), !(r3 = B(f3._(n4, t3), r3)).status) return r3;
            a3 && (e2[a3] = r3.value), t3 = r3.index;
          }
          return B(b(t3, e2), r3);
        });
      }, e.string = K, e.succeed = X, e.takeWhile = function(n3) {
        return k(n3), e(function(t2, r2) {
          for (var e2 = r2; e2 < t2.length && n3(L(t2, e2)); ) e2++;
          return b(e2, t2.slice(r2, e2));
        });
      }, e.test = nn, e.whitespace = pn, e["fantasy-land/empty"] = rn, e["fantasy-land/of"] = X, e.Binary = { bitSeq: l2, bitSeqObj: function(n3) {
        s2();
        var t2 = {}, r2 = 0, e2 = a(function(n4) {
          if (E(n4)) {
            var e3 = n4;
            if (2 !== e3.length) throw new Error("[" + e3.join(", ") + "] should be length 2, got length " + e3.length);
            if (P(e3[0]), O(e3[1]), Object.prototype.hasOwnProperty.call(t2, e3[0])) throw new Error("duplicate key in bitSeqObj: " + e3[0]);
            return t2[e3[0]] = true, r2++, e3;
          }
          return O(n4), [null, n4];
        }, n3);
        if (r2 < 1) throw new Error("bitSeqObj expects at least one named pair, got [" + n3.join(", ") + "]");
        var u2 = a(function(n4) {
          return n4[0];
        }, e2);
        return l2(a(function(n4) {
          return n4[1];
        }, e2)).map(function(n4) {
          return i(function(n5, t3) {
            return null !== t3[0] && (n5[t3[0]] = t3[1]), n5;
          }, {}, a(function(t3, r3) {
            return [t3, n4[r3]];
          }, u2));
        });
      }, byte: function(n3) {
        if (s2(), O(n3), n3 > 255) throw new Error("Value specified to byte constructor (" + n3 + "=0x" + n3.toString(16) + ") is larger in value than a single byte.");
        var t2 = (n3 > 15 ? "0x" : "0x0") + n3.toString(16);
        return e(function(r2, e2) {
          var u2 = L(r2, e2);
          return u2 === n3 ? b(e2 + 1, u2) : x2(e2, t2);
        });
      }, buffer: function(n3) {
        return h("buffer", n3).map(function(n4) {
          return Buffer.from(n4);
        });
      }, encodedString: function(n3, t2) {
        return h("string", t2).map(function(t3) {
          return t3.toString(n3);
        });
      }, uintBE: d, uint8BE: d(1), uint16BE: d(2), uint32BE: d(4), uintLE: v, uint8LE: v(1), uint16LE: v(2), uint32LE: v(4), intBE: g, int8BE: g(1), int16BE: g(2), int32BE: g(4), intLE: m, int8LE: m(1), int16LE: m(2), int32LE: m(4), floatBE: h("floatBE", 4).map(function(n3) {
        return n3.readFloatBE(0);
      }), floatLE: h("floatLE", 4).map(function(n3) {
        return n3.readFloatLE(0);
      }), doubleBE: h("doubleBE", 8).map(function(n3) {
        return n3.readDoubleBE(0);
      }), doubleLE: h("doubleLE", 8).map(function(n3) {
        return n3.readDoubleLE(0);
      }) }, n2.exports = e;
    }]);
  });
})(parsimmon_umd_min);
var parsimmon_umd_minExports = parsimmon_umd_min.exports;
var emojiRegex = () => {
  return /[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26F9(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC3\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC08\uDC26](?:\u200D\u2B1B)?|[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE])))?))?|\uDC6F(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDD75(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC2\uDECE-\uDEDB\uDEE0-\uDEE8]|\uDD3C(?:\u200D[\u2640\u2642]\uFE0F?|\uD83C[\uDFFB-\uDFFF])?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g;
};
function normalizeDuration(dur) {
  if (dur === void 0 || dur === null)
    return dur;
  return dur.shiftToAll().normalize();
}
function getFileTitle(path) {
  if (path.includes("/"))
    path = path.substring(path.lastIndexOf("/") + 1);
  if (path.endsWith(".md"))
    path = path.substring(0, path.length - 3);
  return path;
}
parsimmon_umd_minExports.alt(parsimmon_umd_minExports.regex(new RegExp(emojiRegex(), "")), parsimmon_umd_minExports.regex(/[0-9\p{Letter}_-]+/u).map((str) => str.toLocaleLowerCase()), parsimmon_umd_minExports.whitespace.map((_) => "-"), parsimmon_umd_minExports.any.map((_) => "")).many().map((result) => result.join(""));
const HEADER_CANONICALIZER = parsimmon_umd_minExports.alt(parsimmon_umd_minExports.regex(new RegExp(emojiRegex(), "")), parsimmon_umd_minExports.regex(/[0-9\p{Letter}_-]+/u), parsimmon_umd_minExports.whitespace.map((_) => " "), parsimmon_umd_minExports.any.map((_) => " ")).many().map((result) => {
  return result.join("").split(/\s+/).join(" ").trim();
});
function normalizeHeaderForLink(header) {
  return HEADER_CANONICALIZER.tryParse(header);
}
function renderMinimalDuration(dur) {
  dur = normalizeDuration(dur);
  dur = Duration$1.fromObject(Object.fromEntries(Object.entries(dur.toObject()).filter(([, quantity]) => quantity != 0)));
  return dur.toHuman();
}
var Values;
(function(Values2) {
  function toString(field, setting = DEFAULT_QUERY_SETTINGS, recursive = false) {
    let wrapped = wrapValue(field);
    if (!wrapped)
      return setting.renderNullAs;
    switch (wrapped.type) {
      case "null":
        return setting.renderNullAs;
      case "string":
        return wrapped.value;
      case "number":
      case "boolean":
        return "" + wrapped.value;
      case "html":
        return wrapped.value.outerHTML;
      case "widget":
        return wrapped.value.markdown();
      case "link":
        return wrapped.value.markdown();
      case "function":
        return "<function>";
      case "array":
        let result = "";
        if (recursive)
          result += "[";
        result += wrapped.value.map((f) => toString(f, setting, true)).join(", ");
        if (recursive)
          result += "]";
        return result;
      case "object":
        return "{ " + Object.entries(wrapped.value).map((e) => e[0] + ": " + toString(e[1], setting, true)).join(", ") + " }";
      case "date":
        if (wrapped.value.second == 0 && wrapped.value.hour == 0 && wrapped.value.minute == 0) {
          return wrapped.value.toFormat(setting.defaultDateFormat);
        }
        return wrapped.value.toFormat(setting.defaultDateTimeFormat);
      case "duration":
        return renderMinimalDuration(wrapped.value);
    }
  }
  Values2.toString = toString;
  function wrapValue(val) {
    if (isNull2(val))
      return { type: "null", value: val };
    else if (isNumber2(val))
      return { type: "number", value: val };
    else if (isString2(val))
      return { type: "string", value: val };
    else if (isBoolean(val))
      return { type: "boolean", value: val };
    else if (isDuration(val))
      return { type: "duration", value: val };
    else if (isDate2(val))
      return { type: "date", value: val };
    else if (isWidget(val))
      return { type: "widget", value: val };
    else if (isArray2(val))
      return { type: "array", value: val };
    else if (isLink2(val))
      return { type: "link", value: val };
    else if (isFunction2(val))
      return { type: "function", value: val };
    else if (isHtml(val))
      return { type: "html", value: val };
    else if (isObject2(val))
      return { type: "object", value: val };
    else
      return void 0;
  }
  Values2.wrapValue = wrapValue;
  function mapLeaves(val, func) {
    if (isObject2(val)) {
      let result = {};
      for (let [key, value2] of Object.entries(val))
        result[key] = mapLeaves(value2, func);
      return result;
    } else if (isArray2(val)) {
      let result = [];
      for (let value2 of val)
        result.push(mapLeaves(value2, func));
      return result;
    } else {
      return func(val);
    }
  }
  Values2.mapLeaves = mapLeaves;
  function compareValue(val1, val2, linkNormalizer) {
    if (val1 === void 0)
      val1 = null;
    if (val2 === void 0)
      val2 = null;
    if (val1 === null && val2 === null)
      return 0;
    else if (val1 === null)
      return -1;
    else if (val2 === null)
      return 1;
    let wrap1 = wrapValue(val1);
    let wrap2 = wrapValue(val2);
    if (wrap1 === void 0 && wrap2 === void 0)
      return 0;
    else if (wrap1 === void 0)
      return -1;
    else if (wrap2 === void 0)
      return 1;
    if (wrap1.type != wrap2.type)
      return wrap1.type.localeCompare(wrap2.type);
    if (wrap1.value === wrap2.value)
      return 0;
    switch (wrap1.type) {
      case "string":
        return wrap1.value.localeCompare(wrap2.value);
      case "number":
        if (wrap1.value < wrap2.value)
          return -1;
        else if (wrap1.value == wrap2.value)
          return 0;
        return 1;
      case "null":
        return 0;
      case "boolean":
        if (wrap1.value == wrap2.value)
          return 0;
        else
          return wrap1.value ? 1 : -1;
      case "link":
        let link1 = wrap1.value;
        let link2 = wrap2.value;
        let normalize = linkNormalizer ?? ((x2) => x2);
        let pathCompare = normalize(link1.path).localeCompare(normalize(link2.path));
        if (pathCompare != 0)
          return pathCompare;
        let typeCompare = link1.type.localeCompare(link2.type);
        if (typeCompare != 0)
          return typeCompare;
        if (link1.subpath && !link2.subpath)
          return 1;
        if (!link1.subpath && link2.subpath)
          return -1;
        if (!link1.subpath && !link2.subpath)
          return 0;
        return (link1.subpath ?? "").localeCompare(link2.subpath ?? "");
      case "date":
        return wrap1.value < wrap2.value ? -1 : wrap1.value.equals(wrap2.value) ? 0 : 1;
      case "duration":
        return wrap1.value < wrap2.value ? -1 : wrap1.value.equals(wrap2.value) ? 0 : 1;
      case "array":
        let f1 = wrap1.value;
        let f2 = wrap2.value;
        for (let index = 0; index < Math.min(f1.length, f2.length); index++) {
          let comp = compareValue(f1[index], f2[index]);
          if (comp != 0)
            return comp;
        }
        return f1.length - f2.length;
      case "object":
        let o1 = wrap1.value;
        let o2 = wrap2.value;
        let k1 = Array.from(Object.keys(o1));
        let k2 = Array.from(Object.keys(o2));
        k1.sort();
        k2.sort();
        let keyCompare = compareValue(k1, k2);
        if (keyCompare != 0)
          return keyCompare;
        for (let key of k1) {
          let comp = compareValue(o1[key], o2[key]);
          if (comp != 0)
            return comp;
        }
        return 0;
      case "widget":
      case "html":
      case "function":
        return 0;
    }
  }
  Values2.compareValue = compareValue;
  function typeOf(val) {
    var _a2;
    return (_a2 = wrapValue(val)) == null ? void 0 : _a2.type;
  }
  Values2.typeOf = typeOf;
  function isTruthy(field) {
    let wrapped = wrapValue(field);
    if (!wrapped)
      return false;
    switch (wrapped.type) {
      case "number":
        return wrapped.value != 0;
      case "string":
        return wrapped.value.length > 0;
      case "boolean":
        return wrapped.value;
      case "link":
        return !!wrapped.value.path;
      case "date":
        return wrapped.value.toMillis() != 0;
      case "duration":
        return wrapped.value.as("seconds") != 0;
      case "object":
        return Object.keys(wrapped.value).length > 0;
      case "array":
        return wrapped.value.length > 0;
      case "null":
        return false;
      case "html":
      case "widget":
      case "function":
        return true;
    }
  }
  Values2.isTruthy = isTruthy;
  function deepCopy(field) {
    if (field === null || field === void 0)
      return field;
    if (Values2.isArray(field)) {
      return [].concat(field.map((v) => deepCopy(v)));
    } else if (Values2.isObject(field)) {
      let result = {};
      for (let [key, value2] of Object.entries(field))
        result[key] = deepCopy(value2);
      return result;
    } else {
      return field;
    }
  }
  Values2.deepCopy = deepCopy;
  function isString2(val) {
    return typeof val == "string";
  }
  Values2.isString = isString2;
  function isNumber2(val) {
    return typeof val == "number";
  }
  Values2.isNumber = isNumber2;
  function isDate2(val) {
    return val instanceof DateTime$1;
  }
  Values2.isDate = isDate2;
  function isDuration(val) {
    return val instanceof Duration$1;
  }
  Values2.isDuration = isDuration;
  function isNull2(val) {
    return val === null || val === void 0;
  }
  Values2.isNull = isNull2;
  function isArray2(val) {
    return Array.isArray(val);
  }
  Values2.isArray = isArray2;
  function isBoolean(val) {
    return typeof val === "boolean";
  }
  Values2.isBoolean = isBoolean;
  function isLink2(val) {
    return val instanceof Link;
  }
  Values2.isLink = isLink2;
  function isWidget(val) {
    return val instanceof Widget;
  }
  Values2.isWidget = isWidget;
  function isHtml(val) {
    if (typeof HTMLElement !== "undefined") {
      return val instanceof HTMLElement;
    } else {
      return false;
    }
  }
  Values2.isHtml = isHtml;
  function isObject2(val) {
    return typeof val == "object" && !isHtml(val) && !isWidget(val) && !isArray2(val) && !isDuration(val) && !isDate2(val) && !isLink2(val) && val !== void 0 && !isNull2(val);
  }
  Values2.isObject = isObject2;
  function isFunction2(val) {
    return typeof val == "function";
  }
  Values2.isFunction = isFunction2;
})(Values || (Values = {}));
var Groupings;
(function(Groupings2) {
  function isElementGroup(entry2) {
    return Values.isObject(entry2) && Object.keys(entry2).length == 2 && "key" in entry2 && "rows" in entry2;
  }
  Groupings2.isElementGroup = isElementGroup;
  function isGrouping(entry2) {
    for (let element of entry2)
      if (!isElementGroup(element))
        return false;
    return true;
  }
  Groupings2.isGrouping = isGrouping;
  function count(elements2) {
    if (isGrouping(elements2)) {
      let result = 0;
      for (let subgroup of elements2)
        result += count(subgroup.rows);
      return result;
    } else {
      return elements2.length;
    }
  }
  Groupings2.count = count;
})(Groupings || (Groupings = {}));
class Link {
  constructor(fields) {
    /** The file path this link points to. */
    __publicField(this, "path");
    /** The display name associated with the link. */
    __publicField(this, "display");
    /** The block ID or header this link points to within a file, if relevant. */
    __publicField(this, "subpath");
    /** Is this link an embedded link (!)? */
    __publicField(this, "embed");
    /** The type of this link, which determines what 'subpath' refers to, if anything. */
    __publicField(this, "type");
    Object.assign(this, fields);
  }
  /** Create a link to a specific file. */
  static file(path, embed = false, display) {
    return new Link({
      path,
      embed,
      display,
      subpath: void 0,
      type: "file"
    });
  }
  static infer(linkpath, embed = false, display) {
    if (linkpath.includes("#^")) {
      let split = linkpath.split("#^");
      return Link.block(split[0], split[1], embed, display);
    } else if (linkpath.includes("#")) {
      let split = linkpath.split("#");
      return Link.header(split[0], split[1], embed, display);
    } else
      return Link.file(linkpath, embed, display);
  }
  /** Create a link to a specific file and header in that file. */
  static header(path, header, embed, display) {
    return new Link({
      path,
      embed,
      display,
      subpath: normalizeHeaderForLink(header),
      type: "header"
    });
  }
  /** Create a link to a specific file and block in that file. */
  static block(path, blockId, embed, display) {
    return new Link({
      path,
      embed,
      display,
      subpath: blockId,
      type: "block"
    });
  }
  static fromObject(object) {
    return new Link(object);
  }
  /** Checks for link equality (i.e., that the links are pointing to the same exact location). */
  equals(other) {
    if (other == void 0 || other == null)
      return false;
    return this.path == other.path && this.type == other.type && this.subpath == other.subpath;
  }
  /** Convert this link to it's markdown representation. */
  toString() {
    return this.markdown();
  }
  /** Convert this link to a raw object which is serialization-friendly. */
  toObject() {
    return { path: this.path, type: this.type, subpath: this.subpath, display: this.display, embed: this.embed };
  }
  /** Update this link with a new path. */
  //@ts-ignore; error appeared after updating Obsidian to 0.15.4; it also updated other packages but didn't say which
  withPath(path) {
    return new Link(Object.assign({}, this, { path }));
  }
  /** Return a new link which points to the same location but with a new display value. */
  withDisplay(display) {
    return new Link(Object.assign({}, this, { display }));
  }
  /** Convert a file link into a link to a specific header. */
  withHeader(header) {
    return Link.header(this.path, header, this.embed, this.display);
  }
  /** Convert any link into a link to its file. */
  toFile() {
    return Link.file(this.path, this.embed, this.display);
  }
  /** Convert this link into an embedded link. */
  toEmbed() {
    if (this.embed) {
      return this;
    } else {
      let link2 = new Link(this);
      link2.embed = true;
      return link2;
    }
  }
  /** Convert this link into a non-embedded link. */
  fromEmbed() {
    if (!this.embed) {
      return this;
    } else {
      let link2 = new Link(this);
      link2.embed = false;
      return link2;
    }
  }
  /** Convert this link to markdown so it can be rendered. */
  markdown() {
    let result = (this.embed ? "!" : "") + "[[" + this.obsidianLink();
    if (this.display) {
      result += "|" + this.display;
    } else {
      result += "|" + getFileTitle(this.path);
      if (this.type == "header" || this.type == "block")
        result += " > " + this.subpath;
    }
    result += "]]";
    return result;
  }
  /** Convert the inner part of the link to something that Obsidian can open / understand. */
  obsidianLink() {
    var _a2, _b2;
    const escaped = this.path.replaceAll("|", "\\|");
    if (this.type == "header")
      return escaped + "#" + ((_a2 = this.subpath) == null ? void 0 : _a2.replaceAll("|", "\\|"));
    if (this.type == "block")
      return escaped + "#^" + ((_b2 = this.subpath) == null ? void 0 : _b2.replaceAll("|", "\\|"));
    else
      return escaped;
  }
  /** The stripped name of the file this link points to. */
  fileName() {
    return getFileTitle(this.path).replace(".md", "");
  }
}
class Widget {
  constructor($widget) {
    __publicField(this, "$widget");
    this.$widget = $widget;
  }
}
class ListPairWidget extends Widget {
  constructor(key, value2) {
    super("dataview:list-pair");
    __publicField(this, "key");
    __publicField(this, "value");
    this.key = key;
    this.value = value2;
  }
  markdown() {
    return `${Values.toString(this.key)}: ${Values.toString(this.value)}`;
  }
}
class ExternalLinkWidget extends Widget {
  constructor(url, display) {
    super("dataview:external-link");
    __publicField(this, "url");
    __publicField(this, "display");
    this.url = url;
    this.display = display;
  }
  markdown() {
    return `[${this.display ?? this.url}](${this.url})`;
  }
}
var Widgets;
(function(Widgets2) {
  function listPair(key, value2) {
    return new ListPairWidget(key, value2);
  }
  Widgets2.listPair = listPair;
  function externalLink(url, display) {
    return new ExternalLinkWidget(url, display);
  }
  Widgets2.externalLink = externalLink;
  function isListPair(widget) {
    return widget.$widget === "dataview:list-pair";
  }
  Widgets2.isListPair = isListPair;
  function isExternalLink(widget) {
    return widget.$widget === "dataview:external-link";
  }
  Widgets2.isExternalLink = isExternalLink;
  function isBuiltin(widget) {
    return isListPair(widget) || isExternalLink(widget);
  }
  Widgets2.isBuiltin = isBuiltin;
})(Widgets || (Widgets = {}));
var Fields;
(function(Fields2) {
  function variable(name2) {
    return { type: "variable", name: name2 };
  }
  Fields2.variable = variable;
  function literal(value2) {
    return { type: "literal", value: value2 };
  }
  Fields2.literal = literal;
  function binaryOp(left2, op, right2) {
    return { type: "binaryop", left: left2, op, right: right2 };
  }
  Fields2.binaryOp = binaryOp;
  function index(obj, index2) {
    return { type: "index", object: obj, index: index2 };
  }
  Fields2.index = index;
  function indexVariable(name2) {
    let parts = name2.split(".");
    let result = Fields2.variable(parts[0]);
    for (let index2 = 1; index2 < parts.length; index2++) {
      result = Fields2.index(result, Fields2.literal(parts[index2]));
    }
    return result;
  }
  Fields2.indexVariable = indexVariable;
  function lambda(args, value2) {
    return { type: "lambda", arguments: args, value: value2 };
  }
  Fields2.lambda = lambda;
  function func(func2, args) {
    return { type: "function", func: func2, arguments: args };
  }
  Fields2.func = func;
  function list2(values) {
    return { type: "list", values };
  }
  Fields2.list = list2;
  function object(values) {
    return { type: "object", values };
  }
  Fields2.object = object;
  function negate(child) {
    return { type: "negated", child };
  }
  Fields2.negate = negate;
  function isCompareOp(op) {
    return op == "<=" || op == "<" || op == ">" || op == ">=" || op == "!=" || op == "=";
  }
  Fields2.isCompareOp = isCompareOp;
  Fields2.NULL = Fields2.literal(null);
})(Fields || (Fields = {}));
var Sources;
(function(Sources2) {
  function tag(tag2) {
    return { type: "tag", tag: tag2 };
  }
  Sources2.tag = tag;
  function csv2(path) {
    return { type: "csv", path };
  }
  Sources2.csv = csv2;
  function folder(prefix2) {
    return { type: "folder", folder: prefix2 };
  }
  Sources2.folder = folder;
  function link2(file, incoming) {
    return { type: "link", file, direction: incoming ? "incoming" : "outgoing" };
  }
  Sources2.link = link2;
  function binaryOp(left2, op, right2) {
    return { type: "binaryop", left: left2, op, right: right2 };
  }
  Sources2.binaryOp = binaryOp;
  function and2(left2, right2) {
    return { type: "binaryop", left: left2, op: "&", right: right2 };
  }
  Sources2.and = and2;
  function or2(left2, right2) {
    return { type: "binaryop", left: left2, op: "|", right: right2 };
  }
  Sources2.or = or2;
  function negate(child) {
    return { type: "negate", child };
  }
  Sources2.negate = negate;
  function empty() {
    return { type: "empty" };
  }
  Sources2.empty = empty;
})(Sources || (Sources = {}));
const EMOJI_REGEX = new RegExp(emojiRegex(), "");
const DURATION_TYPES = {
  year: Duration$1.fromObject({ years: 1 }),
  years: Duration$1.fromObject({ years: 1 }),
  yr: Duration$1.fromObject({ years: 1 }),
  yrs: Duration$1.fromObject({ years: 1 }),
  month: Duration$1.fromObject({ months: 1 }),
  months: Duration$1.fromObject({ months: 1 }),
  mo: Duration$1.fromObject({ months: 1 }),
  mos: Duration$1.fromObject({ months: 1 }),
  week: Duration$1.fromObject({ weeks: 1 }),
  weeks: Duration$1.fromObject({ weeks: 1 }),
  wk: Duration$1.fromObject({ weeks: 1 }),
  wks: Duration$1.fromObject({ weeks: 1 }),
  w: Duration$1.fromObject({ weeks: 1 }),
  day: Duration$1.fromObject({ days: 1 }),
  days: Duration$1.fromObject({ days: 1 }),
  d: Duration$1.fromObject({ days: 1 }),
  hour: Duration$1.fromObject({ hours: 1 }),
  hours: Duration$1.fromObject({ hours: 1 }),
  hr: Duration$1.fromObject({ hours: 1 }),
  hrs: Duration$1.fromObject({ hours: 1 }),
  h: Duration$1.fromObject({ hours: 1 }),
  minute: Duration$1.fromObject({ minutes: 1 }),
  minutes: Duration$1.fromObject({ minutes: 1 }),
  min: Duration$1.fromObject({ minutes: 1 }),
  mins: Duration$1.fromObject({ minutes: 1 }),
  m: Duration$1.fromObject({ minutes: 1 }),
  second: Duration$1.fromObject({ seconds: 1 }),
  seconds: Duration$1.fromObject({ seconds: 1 }),
  sec: Duration$1.fromObject({ seconds: 1 }),
  secs: Duration$1.fromObject({ seconds: 1 }),
  s: Duration$1.fromObject({ seconds: 1 })
};
const DATE_SHORTHANDS = {
  now: () => DateTime$1.local(),
  today: () => DateTime$1.local().startOf("day"),
  yesterday: () => DateTime$1.local().startOf("day").minus(Duration$1.fromObject({ days: 1 })),
  tomorrow: () => DateTime$1.local().startOf("day").plus(Duration$1.fromObject({ days: 1 })),
  sow: () => DateTime$1.local().startOf("week"),
  "start-of-week": () => DateTime$1.local().startOf("week"),
  eow: () => DateTime$1.local().endOf("week"),
  "end-of-week": () => DateTime$1.local().endOf("week"),
  soy: () => DateTime$1.local().startOf("year"),
  "start-of-year": () => DateTime$1.local().startOf("year"),
  eoy: () => DateTime$1.local().endOf("year"),
  "end-of-year": () => DateTime$1.local().endOf("year"),
  som: () => DateTime$1.local().startOf("month"),
  "start-of-month": () => DateTime$1.local().startOf("month"),
  eom: () => DateTime$1.local().endOf("month"),
  "end-of-month": () => DateTime$1.local().endOf("month")
};
const KEYWORDS = ["FROM", "WHERE", "LIMIT", "GROUP", "FLATTEN"];
function splitOnUnescapedPipe(link2) {
  let pipe = -1;
  while ((pipe = link2.indexOf("|", pipe + 1)) >= 0) {
    if (pipe > 0 && link2[pipe - 1] == "\\")
      continue;
    return [link2.substring(0, pipe).replace(/\\\|/g, "|"), link2.substring(pipe + 1)];
  }
  return [link2.replace(/\\\|/g, "|"), void 0];
}
function parseInnerLink(rawlink) {
  let [link2, display] = splitOnUnescapedPipe(rawlink);
  return Link.infer(link2, false, display);
}
function createBinaryParser(child, sep, combine) {
  return parsimmon_umd_minExports.seqMap(child, parsimmon_umd_minExports.seq(parsimmon_umd_minExports.optWhitespace, sep, parsimmon_umd_minExports.optWhitespace, child).many(), (first, rest) => {
    if (rest.length == 0)
      return first;
    let node2 = combine(first, rest[0][1], rest[0][3]);
    for (let index = 1; index < rest.length; index++) {
      node2 = combine(node2, rest[index][1], rest[index][3]);
    }
    return node2;
  });
}
function chainOpt(base2, ...funcs) {
  return parsimmon_umd_minExports.custom((success, failure) => {
    return (input, i) => {
      let result = base2._(input, i);
      if (!result.status)
        return result;
      for (let func of funcs) {
        let next = func(result.value)._(input, result.index);
        if (!next.status)
          return result;
        result = next;
      }
      return result;
    };
  });
}
const EXPRESSION = parsimmon_umd_minExports.createLanguage({
  // A floating point number; the decimal point is optional.
  number: (q) => parsimmon_umd_minExports.regexp(/-?[0-9]+(\.[0-9]+)?/).map((str) => Number.parseFloat(str)).desc("number"),
  // A quote-surrounded string which supports escape characters ('\').
  string: (q) => parsimmon_umd_minExports.string('"').then(parsimmon_umd_minExports.alt(q.escapeCharacter, parsimmon_umd_minExports.noneOf('"\\')).atLeast(0).map((chars) => chars.join(""))).skip(parsimmon_umd_minExports.string('"')).desc("string"),
  escapeCharacter: (_) => parsimmon_umd_minExports.string("\\").then(parsimmon_umd_minExports.any).map((escaped) => {
    if (escaped === '"')
      return '"';
    if (escaped === "\\")
      return "\\";
    else
      return "\\" + escaped;
  }),
  // A boolean true/false value.
  bool: (_) => parsimmon_umd_minExports.regexp(/true|false|True|False/).map((str) => str.toLowerCase() == "true").desc("boolean ('true' or 'false')"),
  // A tag of the form '#stuff/hello-there'.
  tag: (_) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string("#"), parsimmon_umd_minExports.alt(parsimmon_umd_minExports.regexp(/[^\u2000-\u206F\u2E00-\u2E7F'!"#$%&()*+,.:;<=>?@^`{|}~\[\]\\\s]/).desc("text")).many(), (start2, rest) => start2 + rest.join("")).desc("tag ('#hello/stuff')"),
  // A variable identifier, which is alphanumeric and must start with a letter or... emoji.
  identifier: (_) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.alt(parsimmon_umd_minExports.regexp(new RegExp("\\p{Letter}", "u")), parsimmon_umd_minExports.regexp(EMOJI_REGEX).desc("text")), parsimmon_umd_minExports.alt(parsimmon_umd_minExports.regexp(/[0-9\p{Letter}_-]/u), parsimmon_umd_minExports.regexp(EMOJI_REGEX).desc("text")).many(), (first, rest) => first + rest.join("")).desc("variable identifier"),
  // An Obsidian link of the form [[<link>]].
  link: (_) => parsimmon_umd_minExports.regexp(/\[\[([^\[\]]*?)\]\]/u, 1).map((linkInner) => parseInnerLink(linkInner)).desc("file link"),
  // An embeddable link which can start with '!'. This overlaps with the normal negation operator, so it is only
  // provided for metadata parsing.
  embedLink: (q) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string("!").atMost(1), q.link, (p2, l2) => {
    if (p2.length > 0)
      l2.embed = true;
    return l2;
  }).desc("file link"),
  // Binary plus or minus operator.
  binaryPlusMinus: (_) => parsimmon_umd_minExports.regexp(/\+|-/).map((str) => str).desc("'+' or '-'"),
  // Binary times or divide operator.
  binaryMulDiv: (_) => parsimmon_umd_minExports.regexp(/\*|\/|%/).map((str) => str).desc("'*' or '/' or '%'"),
  // Binary comparison operator.
  binaryCompareOp: (_) => parsimmon_umd_minExports.regexp(/>=|<=|!=|>|<|=/).map((str) => str).desc("'>=' or '<=' or '!=' or '=' or '>' or '<'"),
  // Binary boolean combination operator.
  binaryBooleanOp: (_) => parsimmon_umd_minExports.regexp(/and|or|&|\|/i).map((str) => {
    if (str.toLowerCase() == "and")
      return "&";
    else if (str.toLowerCase() == "or")
      return "|";
    else
      return str;
  }).desc("'and' or 'or'"),
  // A date which can be YYYY-MM[-DDTHH:mm:ss].
  rootDate: (_) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.regexp(/\d{4}/), parsimmon_umd_minExports.string("-"), parsimmon_umd_minExports.regexp(/\d{2}/), (year, _2, month) => {
    return DateTime$1.fromObject({ year: Number.parseInt(year), month: Number.parseInt(month) });
  }).desc("date in format YYYY-MM[-DDTHH-MM-SS.MS]"),
  dateShorthand: (_) => parsimmon_umd_minExports.alt(...Object.keys(DATE_SHORTHANDS).sort((a, b) => b.length - a.length).map(parsimmon_umd_minExports.string)),
  date: (q) => chainOpt(q.rootDate, (ym) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string("-"), parsimmon_umd_minExports.regexp(/\d{2}/), (_, day) => ym.set({ day: Number.parseInt(day) })), (ymd) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string("T"), parsimmon_umd_minExports.regexp(/\d{2}/), (_, hour) => ymd.set({ hour: Number.parseInt(hour) })), (ymdh) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string(":"), parsimmon_umd_minExports.regexp(/\d{2}/), (_, minute) => ymdh.set({ minute: Number.parseInt(minute) })), (ymdhm) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string(":"), parsimmon_umd_minExports.regexp(/\d{2}/), (_, second) => ymdhm.set({ second: Number.parseInt(second) })), (ymdhms) => parsimmon_umd_minExports.alt(
    parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string("."), parsimmon_umd_minExports.regexp(/\d{3}/), (_, millisecond) => ymdhms.set({ millisecond: Number.parseInt(millisecond) })),
    parsimmon_umd_minExports.succeed(ymdhms)
    // pass
  ), (dt) => parsimmon_umd_minExports.alt(parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string("+").or(parsimmon_umd_minExports.string("-")), parsimmon_umd_minExports.regexp(/\d{1,2}(:\d{2})?/), (pm, hr2) => dt.setZone("UTC" + pm + hr2, { keepLocalTime: true })), parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string("Z"), () => dt.setZone("utc", { keepLocalTime: true })), parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string("["), parsimmon_umd_minExports.regexp(/[0-9A-Za-z+-\/]+/u), parsimmon_umd_minExports.string("]"), (_a2, zone, _b2) => dt.setZone(zone, { keepLocalTime: true })))).assert((dt) => dt.isValid, "valid date").desc("date in format YYYY-MM[-DDTHH-MM-SS.MS]"),
  // A date, plus various shorthand times of day it could be.
  datePlus: (q) => parsimmon_umd_minExports.alt(q.dateShorthand.map((d) => DATE_SHORTHANDS[d]()), q.date).desc("date in format YYYY-MM[-DDTHH-MM-SS.MS] or in shorthand"),
  // A duration of time.
  durationType: (_) => parsimmon_umd_minExports.alt(...Object.keys(DURATION_TYPES).sort((a, b) => b.length - a.length).map(parsimmon_umd_minExports.string)),
  duration: (q) => parsimmon_umd_minExports.seqMap(q.number, parsimmon_umd_minExports.optWhitespace, q.durationType, (count, _, t) => DURATION_TYPES[t].mapUnits((x2) => x2 * count)).sepBy1(parsimmon_umd_minExports.string(",").trim(parsimmon_umd_minExports.optWhitespace).or(parsimmon_umd_minExports.optWhitespace)).map((durations) => durations.reduce((p2, c) => p2.plus(c))).desc("duration like 4hr2min"),
  // A raw null value.
  rawNull: (_) => parsimmon_umd_minExports.string("null"),
  // Source parsing.
  tagSource: (q) => q.tag.map((tag) => Sources.tag(tag)),
  csvSource: (q) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string("csv(").skip(parsimmon_umd_minExports.optWhitespace), q.string, parsimmon_umd_minExports.string(")"), (_1, path, _2) => Sources.csv(path)),
  linkIncomingSource: (q) => q.link.map((link2) => Sources.link(link2.path, true)),
  linkOutgoingSource: (q) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string("outgoing(").skip(parsimmon_umd_minExports.optWhitespace), q.link, parsimmon_umd_minExports.string(")"), (_1, link2, _2) => Sources.link(link2.path, false)),
  folderSource: (q) => q.string.map((str) => Sources.folder(str)),
  parensSource: (q) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string("("), parsimmon_umd_minExports.optWhitespace, q.source, parsimmon_umd_minExports.optWhitespace, parsimmon_umd_minExports.string(")"), (_1, _2, field, _3, _4) => field),
  negateSource: (q) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.alt(parsimmon_umd_minExports.string("-"), parsimmon_umd_minExports.string("!")), q.atomSource, (_, source) => Sources.negate(source)),
  atomSource: (q) => parsimmon_umd_minExports.alt(q.parensSource, q.negateSource, q.linkOutgoingSource, q.linkIncomingSource, q.folderSource, q.tagSource, q.csvSource),
  binaryOpSource: (q) => createBinaryParser(q.atomSource, q.binaryBooleanOp.map((s2) => s2), Sources.binaryOp),
  source: (q) => q.binaryOpSource,
  // Field parsing.
  variableField: (q) => q.identifier.chain((r) => {
    if (KEYWORDS.includes(r.toUpperCase())) {
      return parsimmon_umd_minExports.fail("Variable fields cannot be a keyword (" + KEYWORDS.join(" or ") + ")");
    } else {
      return parsimmon_umd_minExports.succeed(Fields.variable(r));
    }
  }).desc("variable"),
  numberField: (q) => q.number.map((val) => Fields.literal(val)).desc("number"),
  stringField: (q) => q.string.map((val) => Fields.literal(val)).desc("string"),
  boolField: (q) => q.bool.map((val) => Fields.literal(val)).desc("boolean"),
  dateField: (q) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string("date("), parsimmon_umd_minExports.optWhitespace, q.datePlus, parsimmon_umd_minExports.optWhitespace, parsimmon_umd_minExports.string(")"), (prefix2, _1, date, _2, postfix) => Fields.literal(date)).desc("date"),
  durationField: (q) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string("dur("), parsimmon_umd_minExports.optWhitespace, q.duration, parsimmon_umd_minExports.optWhitespace, parsimmon_umd_minExports.string(")"), (prefix2, _1, dur, _2, postfix) => Fields.literal(dur)).desc("duration"),
  nullField: (q) => q.rawNull.map((_) => Fields.NULL),
  linkField: (q) => q.link.map((f) => Fields.literal(f)),
  listField: (q) => q.field.sepBy(parsimmon_umd_minExports.string(",").trim(parsimmon_umd_minExports.optWhitespace)).wrap(parsimmon_umd_minExports.string("[").skip(parsimmon_umd_minExports.optWhitespace), parsimmon_umd_minExports.optWhitespace.then(parsimmon_umd_minExports.string("]"))).map((l2) => Fields.list(l2)).desc("list ('[1, 2, 3]')"),
  objectField: (q) => parsimmon_umd_minExports.seqMap(q.identifier.or(q.string), parsimmon_umd_minExports.string(":").trim(parsimmon_umd_minExports.optWhitespace), q.field, (name2, _sep, value2) => {
    return { name: name2, value: value2 };
  }).sepBy(parsimmon_umd_minExports.string(",").trim(parsimmon_umd_minExports.optWhitespace)).wrap(parsimmon_umd_minExports.string("{").skip(parsimmon_umd_minExports.optWhitespace), parsimmon_umd_minExports.optWhitespace.then(parsimmon_umd_minExports.string("}"))).map((vals) => {
    let res = {};
    for (let entry2 of vals)
      res[entry2.name] = entry2.value;
    return Fields.object(res);
  }).desc("object ('{ a: 1, b: 2 }')"),
  atomInlineField: (q) => parsimmon_umd_minExports.alt(q.date, q.duration.map((d) => normalizeDuration(d)), q.string, q.tag, q.embedLink, q.bool, q.number, q.rawNull),
  inlineFieldList: (q) => q.atomInlineField.sepBy(parsimmon_umd_minExports.string(",").trim(parsimmon_umd_minExports.optWhitespace).lookahead(q.atomInlineField)),
  inlineField: (q) => parsimmon_umd_minExports.alt(parsimmon_umd_minExports.seqMap(q.atomInlineField, parsimmon_umd_minExports.string(",").trim(parsimmon_umd_minExports.optWhitespace), q.inlineFieldList, (f, _s2, l2) => [f].concat(l2)), q.atomInlineField),
  atomField: (q) => parsimmon_umd_minExports.alt(
    // Place embed links above negated fields as they are the special parser case '![[thing]]' and are generally unambigious.
    q.embedLink.map((l2) => Fields.literal(l2)),
    q.negatedField,
    q.linkField,
    q.listField,
    q.objectField,
    q.lambdaField,
    q.parensField,
    q.boolField,
    q.numberField,
    q.stringField,
    q.dateField,
    q.durationField,
    q.nullField,
    q.variableField
  ),
  indexField: (q) => parsimmon_umd_minExports.seqMap(q.atomField, parsimmon_umd_minExports.alt(q.dotPostfix, q.indexPostfix, q.functionPostfix).many(), (obj, postfixes) => {
    let result = obj;
    for (let post of postfixes) {
      switch (post.type) {
        case "dot":
          result = Fields.index(result, Fields.literal(post.field));
          break;
        case "index":
          result = Fields.index(result, post.field);
          break;
        case "function":
          result = Fields.func(result, post.fields);
          break;
      }
    }
    return result;
  }),
  negatedField: (q) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string("!"), q.indexField, (_, field) => Fields.negate(field)).desc("negated field"),
  parensField: (q) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string("("), parsimmon_umd_minExports.optWhitespace, q.field, parsimmon_umd_minExports.optWhitespace, parsimmon_umd_minExports.string(")"), (_1, _2, field, _3, _4) => field),
  lambdaField: (q) => parsimmon_umd_minExports.seqMap(q.identifier.sepBy(parsimmon_umd_minExports.string(",").trim(parsimmon_umd_minExports.optWhitespace)).wrap(parsimmon_umd_minExports.string("(").trim(parsimmon_umd_minExports.optWhitespace), parsimmon_umd_minExports.string(")").trim(parsimmon_umd_minExports.optWhitespace)), parsimmon_umd_minExports.string("=>").trim(parsimmon_umd_minExports.optWhitespace), q.field, (ident, _ignore, value2) => {
    return { type: "lambda", arguments: ident, value: value2 };
  }),
  dotPostfix: (q) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string("."), q.identifier, (_, field) => {
    return { type: "dot", field };
  }),
  indexPostfix: (q) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string("["), parsimmon_umd_minExports.optWhitespace, q.field, parsimmon_umd_minExports.optWhitespace, parsimmon_umd_minExports.string("]"), (_, _2, field, _3, _4) => {
    return { type: "index", field };
  }),
  functionPostfix: (q) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.string("("), parsimmon_umd_minExports.optWhitespace, q.field.sepBy(parsimmon_umd_minExports.string(",").trim(parsimmon_umd_minExports.optWhitespace)), parsimmon_umd_minExports.optWhitespace, parsimmon_umd_minExports.string(")"), (_, _1, fields, _2, _3) => {
    return { type: "function", fields };
  }),
  // The precedence hierarchy of operators - multiply/divide, add/subtract, compare, and then boolean operations.
  binaryMulDivField: (q) => createBinaryParser(q.indexField, q.binaryMulDiv, Fields.binaryOp),
  binaryPlusMinusField: (q) => createBinaryParser(q.binaryMulDivField, q.binaryPlusMinus, Fields.binaryOp),
  binaryCompareField: (q) => createBinaryParser(q.binaryPlusMinusField, q.binaryCompareOp, Fields.binaryOp),
  binaryBooleanField: (q) => createBinaryParser(q.binaryCompareField, q.binaryBooleanOp, Fields.binaryOp),
  binaryOpField: (q) => q.binaryBooleanField,
  field: (q) => q.binaryOpField
});
function parseField(text2) {
  try {
    return Result.success(EXPRESSION.field.tryParse(text2));
  } catch (error2) {
    return Result.failure("" + error2);
  }
}
var QueryFields;
(function(QueryFields2) {
  function named(name2, field) {
    return { name: name2, field };
  }
  QueryFields2.named = named;
  function sortBy(field, dir) {
    return { field, direction: dir };
  }
  QueryFields2.sortBy = sortBy;
})(QueryFields || (QueryFields = {}));
function captureRaw(base2) {
  return parsimmon_umd_minExports.custom((success, failure) => {
    return (input, i) => {
      let result = base2._(input, i);
      if (!result.status)
        return result;
      return Object.assign({}, result, { value: [result.value, input.substring(i, result.index)] });
    };
  });
}
function stripNewlines(text2) {
  return text2.split(/[\r\n]+/).map((t) => t.trim()).join("");
}
function precededByWhitespaceIfNotEof(if_eof, parser2) {
  return parsimmon_umd_minExports.eof.map(if_eof).or(parsimmon_umd_minExports.whitespace.then(parser2));
}
const QUERY_LANGUAGE = parsimmon_umd_minExports.createLanguage({
  // Simple atom parsing, like words, identifiers, numbers.
  queryType: (q) => parsimmon_umd_minExports.alt(parsimmon_umd_minExports.regexp(/TABLE|LIST|TASK|CALENDAR/i)).map((str) => str.toLowerCase()).desc("query type ('TABLE', 'LIST', 'TASK', or 'CALENDAR')"),
  explicitNamedField: (q) => parsimmon_umd_minExports.seqMap(EXPRESSION.field.skip(parsimmon_umd_minExports.whitespace), parsimmon_umd_minExports.regexp(/AS/i).skip(parsimmon_umd_minExports.whitespace), EXPRESSION.identifier.or(EXPRESSION.string), (field, _as, ident) => QueryFields.named(ident, field)),
  comment: () => parsimmon_umd_minExports.Parser((input, i) => {
    let line = input.substring(i);
    if (!line.startsWith("//"))
      return parsimmon_umd_minExports.makeFailure(i, "Not a comment");
    line = line.split("\n")[0];
    let comment2 = line.substring(2).trim();
    return parsimmon_umd_minExports.makeSuccess(i + line.length, comment2);
  }),
  namedField: (q) => parsimmon_umd_minExports.alt(q.explicitNamedField, captureRaw(EXPRESSION.field).map(([value2, text2]) => QueryFields.named(stripNewlines(text2), value2))),
  sortField: (q) => parsimmon_umd_minExports.seqMap(EXPRESSION.field.skip(parsimmon_umd_minExports.optWhitespace), parsimmon_umd_minExports.regexp(/ASCENDING|DESCENDING|ASC|DESC/i).atMost(1), (field, dir) => {
    let direction = dir.length == 0 ? "ascending" : dir[0].toLowerCase();
    if (direction == "desc")
      direction = "descending";
    if (direction == "asc")
      direction = "ascending";
    return {
      field,
      direction
    };
  }),
  headerClause: (q) => q.queryType.chain((type) => {
    switch (type) {
      case "table": {
        return precededByWhitespaceIfNotEof(() => ({ type, fields: [], showId: true }), parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.regexp(/WITHOUT\s+ID/i).skip(parsimmon_umd_minExports.optWhitespace).atMost(1), parsimmon_umd_minExports.sepBy(q.namedField, parsimmon_umd_minExports.string(",").trim(parsimmon_umd_minExports.optWhitespace)), (withoutId, fields) => {
          return { type, fields, showId: withoutId.length == 0 };
        }));
      }
      case "list":
        return precededByWhitespaceIfNotEof(() => ({ type, format: void 0, showId: true }), parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.regexp(/WITHOUT\s+ID/i).skip(parsimmon_umd_minExports.optWhitespace).atMost(1), EXPRESSION.field.atMost(1), (withoutId, format2) => {
          return {
            type,
            format: format2.length == 1 ? format2[0] : void 0,
            showId: withoutId.length == 0
          };
        }));
      case "task":
        return parsimmon_umd_minExports.succeed({ type });
      case "calendar":
        return parsimmon_umd_minExports.whitespace.then(parsimmon_umd_minExports.seqMap(q.namedField, (field) => {
          return {
            type,
            showId: true,
            field
          };
        }));
      default:
        return parsimmon_umd_minExports.fail(`Unrecognized query type '${type}'`);
    }
  }).desc("TABLE or LIST or TASK or CALENDAR"),
  fromClause: (q) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.regexp(/FROM/i), parsimmon_umd_minExports.whitespace, EXPRESSION.source, (_1, _2, source) => source),
  whereClause: (q) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.regexp(/WHERE/i), parsimmon_umd_minExports.whitespace, EXPRESSION.field, (where, _, field) => {
    return { type: "where", clause: field };
  }).desc("WHERE <expression>"),
  sortByClause: (q) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.regexp(/SORT/i), parsimmon_umd_minExports.whitespace, q.sortField.sepBy1(parsimmon_umd_minExports.string(",").trim(parsimmon_umd_minExports.optWhitespace)), (sort, _1, fields) => {
    return { type: "sort", fields };
  }).desc("SORT field [ASC/DESC]"),
  limitClause: (q) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.regexp(/LIMIT/i), parsimmon_umd_minExports.whitespace, EXPRESSION.field, (limit, _1, field) => {
    return { type: "limit", amount: field };
  }).desc("LIMIT <value>"),
  flattenClause: (q) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.regexp(/FLATTEN/i).skip(parsimmon_umd_minExports.whitespace), q.namedField, (_, field) => {
    return { type: "flatten", field };
  }).desc("FLATTEN <value> [AS <name>]"),
  groupByClause: (q) => parsimmon_umd_minExports.seqMap(parsimmon_umd_minExports.regexp(/GROUP BY/i).skip(parsimmon_umd_minExports.whitespace), q.namedField, (_, field) => {
    return { type: "group", field };
  }).desc("GROUP BY <value> [AS <name>]"),
  // Full query parsing.
  clause: (q) => parsimmon_umd_minExports.alt(q.fromClause, q.whereClause, q.sortByClause, q.limitClause, q.groupByClause, q.flattenClause),
  query: (q) => parsimmon_umd_minExports.seqMap(q.headerClause.trim(optionalWhitespaceOrComment), q.fromClause.trim(optionalWhitespaceOrComment).atMost(1), q.clause.trim(optionalWhitespaceOrComment).many(), (header, from, clauses) => {
    return {
      header,
      source: from.length == 0 ? Sources.folder("") : from[0],
      operations: clauses,
      settings: DEFAULT_QUERY_SETTINGS
    };
  })
});
const optionalWhitespaceOrComment = parsimmon_umd_minExports.alt(parsimmon_umd_minExports.whitespace, QUERY_LANGUAGE.comment).many().map((arr) => arr.join(""));
const getAPI = (app2) => {
  var _a2;
  if (app2)
    return (_a2 = app2.plugins.plugins.dataview) == null ? void 0 : _a2.api;
  else
    return window.DataviewAPI;
};
const isPluginEnabled = (app2) => app2.plugins.enabledPlugins.has("dataview");
lib$1.DATE_SHORTHANDS = DATE_SHORTHANDS;
lib$1.DURATION_TYPES = DURATION_TYPES;
lib$1.EXPRESSION = EXPRESSION;
lib$1.KEYWORDS = KEYWORDS;
lib$1.QUERY_LANGUAGE = QUERY_LANGUAGE;
var getAPI_1 = lib$1.getAPI = getAPI;
lib$1.isPluginEnabled = isPluginEnabled;
lib$1.parseField = parseField;
const CLASSIFICATION = [
  "category",
  "category and subcategory",
  "categories",
  "grouped categories"
];
const TAG_HANDLING = [
  "Always move to Frontmatter",
  "Always move to Page",
  "Do not Change"
];
const LOG_LEVELS = [
  "debug",
  "info",
  "warn",
  "error"
];
const DEFAULT_SETTINGS = {
  kinds: {},
  types: {},
  kind_folder: "kind",
  cache: null,
  handle_tags: "Do not Change",
  default_classification: "category and subcategory",
  page_blocks: [],
  url_patterns: [],
  url_props: [],
  log_level: "warn"
};
const DEFAULT_KIND = {
  name: "",
  _classification_type: "category and subcategory",
  _filename_date_prefix: false,
  _folder_include_cwd: false,
  _folder_choices_sub_dirs: false,
  _folder_favorite: "",
  _show_sub_dirs: false,
  _relationships: [],
  tag: "",
  _metric_props: [],
  _aliases_lowercase: false,
  _aliases_plural: false
};
const FOLDER_DEFAULT = [
  "Favorite folder is default",
  "Current folder is default"
];
const UOM_TYPES = [
  "mass",
  "volume",
  "density",
  "speed",
  "currency",
  "distance",
  "duration_min",
  "duration_sec",
  "duration_ms"
];
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start$1 = "start";
var end$1 = "end";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
  return acc.concat([placement + "-" + start$1, placement + "-" + end$1]);
}, []);
var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start$1, placement + "-" + end$1]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
function getNodeName(element) {
  return element ? (element.nodeName || "").toLowerCase() : null;
}
function getWindow(node2) {
  if (node2 == null) {
    return window;
  }
  if (node2.toString() !== "[object Window]") {
    var ownerDocument2 = node2.ownerDocument;
    return ownerDocument2 ? ownerDocument2.defaultView || window : window;
  }
  return node2;
}
function isElement$1(node2) {
  var OwnElement = getWindow(node2).Element;
  return node2 instanceof OwnElement || node2 instanceof Element;
}
function isHTMLElement(node2) {
  var OwnElement = getWindow(node2).HTMLElement;
  return node2 instanceof OwnElement || node2 instanceof HTMLElement;
}
function isShadowRoot(node2) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node2).ShadowRoot;
  return node2 instanceof OwnElement || node2 instanceof ShadowRoot;
}
function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function(name2) {
    var style2 = state.styles[name2] || {};
    var attributes2 = state.attributes[name2] || {};
    var element = state.elements[name2];
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style2);
    Object.keys(attributes2).forEach(function(name3) {
      var value2 = attributes2[name3];
      if (value2 === false) {
        element.removeAttribute(name3);
      } else {
        element.setAttribute(name3, value2 === true ? "" : value2);
      }
    });
  });
}
function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state.elements).forEach(function(name2) {
      var element = state.elements[name2];
      var attributes2 = state.attributes[name2] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name2) ? state.styles[name2] : initialStyles[name2]);
      var style2 = styleProperties.reduce(function(style3, property) {
        style3[property] = "";
        return style3;
      }, {});
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style2);
      Object.keys(attributes2).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
const applyStyles$1 = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect: effect$2,
  requires: ["computeStyles"]
};
function getBasePlacement(placement) {
  return placement.split("-")[0];
}
var max$1 = Math.max;
var min = Math.min;
var round = Math.round;
function getUAString() {
  var uaData = navigator.userAgentData;
  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function(item2) {
      return item2.brand + "/" + item2.version;
    }).join(" ");
  }
  return navigator.userAgent;
}
function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}
function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }
  var _ref = isElement$1(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x2 = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y2 = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width2 = clientRect.width / scaleX;
  var height2 = clientRect.height / scaleY;
  return {
    width: width2,
    height: height2,
    top: y2,
    right: x2 + width2,
    bottom: y2 + height2,
    left: x2,
    x: x2,
    y: y2
  };
}
function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element);
  var width2 = element.offsetWidth;
  var height2 = element.offsetHeight;
  if (Math.abs(clientRect.width - width2) <= 1) {
    width2 = clientRect.width;
  }
  if (Math.abs(clientRect.height - height2) <= 1) {
    height2 = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width2,
    height: height2
  };
}
function contains(parent, child) {
  var rootNode2 = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode2 && isShadowRoot(rootNode2)) {
    var next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function isTableElement(element) {
  return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
}
function getDocumentElement(element) {
  return ((isElement$1(element) ? element.ownerDocument : (
    // $FlowFixMe[prop-missing]
    element.document
  )) || window.document).documentElement;
}
function getParentNode(element) {
  if (getNodeName(element) === "html") {
    return element;
  }
  return (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || // DOM Element detected
    (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element)
  );
}
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode);
    if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element) {
  var window2 = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}
function within(min$1, value2, max2) {
  return max$1(min$1, min(value2, max2));
}
function withinMaxClamp(min2, value2, max2) {
  var v = within(min2, value2, max2);
  return v > max2 ? max2 : v;
}
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}
function expandToHashMap(value2, keys) {
  return keys.reduce(function(hashMap, key) {
    hashMap[key] = value2;
    return hashMap;
  }, {});
}
var toPaddingObject = function toPaddingObject2(padding, state) {
  padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
  var _state$modifiersData$;
  var state = _ref.state, name2 = _ref.name, options2 = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? "height" : "width";
  if (!arrowElement || !popperOffsets2) {
    return;
  }
  var paddingObject = toPaddingObject(options2.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === "y" ? top : left;
  var maxProp = axis === "y" ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
  var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2;
  var min2 = paddingObject[minProp];
  var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset2 = within(min2, center, max2);
  var axisProp = axis;
  state.modifiersData[name2] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
}
function effect$1(_ref2) {
  var state = _ref2.state, options2 = _ref2.options;
  var _options$element = options2.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
  if (arrowElement == null) {
    return;
  }
  if (typeof arrowElement === "string") {
    arrowElement = state.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }
  state.elements.arrow = arrowElement;
}
const arrow$1 = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: arrow,
  effect: effect$1,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function getVariation(placement) {
  return placement.split("-")[1];
}
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref, win) {
  var x2 = _ref.x, y2 = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x2 * dpr) / dpr || 0,
    y: round(y2 * dpr) / dpr || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x, x2 = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y2 = _offsets$y === void 0 ? 0 : _offsets$y;
  var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
    x: x2,
    y: y2
  }) : {
    x: x2,
    y: y2
  };
  x2 = _ref3.x;
  y2 = _ref3.y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper2);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2);
      if (getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end$1) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        offsetParent[heightProp]
      );
      y2 -= offsetY - popperRect.height;
      y2 *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end$1) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        offsetParent[widthProp]
      );
      x2 -= offsetX - popperRect.width;
      x2 *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x2,
    y: y2
  }, getWindow(popper2)) : {
    x: x2,
    y: y2
  };
  x2 = _ref4.x;
  y2 = _ref4.y;
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x2 + "px, " + y2 + "px)" : "translate3d(" + x2 + "px, " + y2 + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y2 + "px" : "", _Object$assign2[sideX] = hasX ? x2 + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref5) {
  var state = _ref5.state, options2 = _ref5.options;
  var _options$gpuAccelerat = options2.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options2.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options2.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    isFixed: state.options.strategy === "fixed"
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-placement": state.placement
  });
}
const computeStyles$1 = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};
var passive = {
  passive: true
};
function effect(_ref) {
  var state = _ref.state, instance = _ref.instance, options2 = _ref.options;
  var _options$scroll = options2.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options2.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance.update, passive);
    }
  };
}
const eventListeners = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function fn() {
  },
  effect,
  data: {}
};
var hash$1 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash$1[matched];
  });
}
var hash = {
  start: "end",
  end: "start"
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function(matched) {
    return hash[matched];
  });
}
function getWindowScroll(node2) {
  var win = getWindow(node2);
  var scrollLeft2 = win.pageXOffset;
  var scrollTop2 = win.pageYOffset;
  return {
    scrollLeft: scrollLeft2,
    scrollTop: scrollTop2
  };
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}
function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width2 = html.clientWidth;
  var height2 = html.clientHeight;
  var x2 = 0;
  var y2 = 0;
  if (visualViewport) {
    width2 = visualViewport.width;
    height2 = visualViewport.height;
    var layoutViewport = isLayoutViewport();
    if (layoutViewport || !layoutViewport && strategy === "fixed") {
      x2 = visualViewport.offsetLeft;
      y2 = visualViewport.offsetTop;
    }
  }
  return {
    width: width2,
    height: height2,
    x: x2 + getWindowScrollBarX(element),
    y: y2
  };
}
function getDocumentRect(element) {
  var _element$ownerDocumen;
  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width2 = max$1(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height2 = max$1(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x2 = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y2 = -winScroll.scrollTop;
  if (getComputedStyle(body || html).direction === "rtl") {
    x2 += max$1(html.clientWidth, body ? body.clientWidth : 0) - width2;
  }
  return {
    width: width2,
    height: height2,
    x: x2,
    y: y2
  };
}
function isScrollParent(element) {
  var _getComputedStyle = getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
function getScrollParent(node2) {
  if (["html", "body", "#document"].indexOf(getNodeName(node2)) >= 0) {
    return node2.ownerDocument.body;
  }
  if (isHTMLElement(node2) && isScrollParent(node2)) {
    return node2;
  }
  return getScrollParent(getParentNode(node2));
}
function listScrollParents(element, list2) {
  var _element$ownerDocumen;
  if (list2 === void 0) {
    list2 = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target2 = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list2.concat(target2);
  return isBody ? updatedList : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    updatedList.concat(listScrollParents(getParentNode(target2)))
  );
}
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}
function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === "fixed");
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement$1(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
  var clippingParents2 = listScrollParents(getParentNode(element));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement$1(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement$1(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
  });
}
function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = max$1(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max$1(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}
function computeOffsets(_ref) {
  var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference2.x + reference2.width / 2 - element.width / 2;
  var commonY = reference2.y + reference2.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      };
      break;
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference2.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start$1:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
        break;
      case end$1:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
        break;
    }
  }
  return offsets;
}
function detectOverflow(state, options2) {
  if (options2 === void 0) {
    options2 = {};
  }
  var _options = options2, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement$1(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: "absolute",
    placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset;
  if (elementContext === popper && offsetData) {
    var offset2 = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function(key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
      overflowOffsets[key] += offset2[axis] * multiply;
    });
  }
  return overflowOffsets;
}
function computeAutoPlacement(state, options2) {
  if (options2 === void 0) {
    options2 = {};
  }
  var _options = options2, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
    return getVariation(placement2) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function(placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  }
  var overflows = allowedPlacements.reduce(function(acc, placement2) {
    acc[placement2] = detectOverflow(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement(placement2)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function(a, b) {
    return overflows[a] - overflows[b];
  });
}
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
function flip(_ref) {
  var state = _ref.state, options2 = _ref.options, name2 = _ref.name;
  if (state.modifiersData[name2]._skip) {
    return;
  }
  var _options$mainAxis = options2.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options2.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options2.fallbackPlacements, padding = options2.padding, boundary = options2.boundary, rootBoundary = options2.rootBoundary, altBoundary = options2.altBoundary, _options$flipVariatio = options2.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options2.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
    return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding,
      flipVariations,
      allowedAutoPlacements
    }) : placement2);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = /* @__PURE__ */ new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements2[0];
  for (var i = 0; i < placements2.length; i++) {
    var placement = placements2[i];
    var _basePlacement = getBasePlacement(placement);
    var isStartVariation = getVariation(placement) === start$1;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? "width" : "height";
    var overflow = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function(check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = function _loop2(_i2) {
      var fittingPlacement = placements2.find(function(placement2) {
        var checks2 = checksMap.get(placement2);
        if (checks2) {
          return checks2.slice(0, _i2).every(function(check) {
            return check;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };
    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);
      if (_ret === "break") break;
    }
  }
  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name2]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
}
const flip$1 = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};
function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function(side) {
    return overflow[side] >= 0;
  });
}
function hide(_ref) {
  var state = _ref.state, name2 = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: "reference"
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name2] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-reference-hidden": isReferenceHidden,
    "data-popper-escaped": hasPopperEscaped
  });
}
const hide$1 = {
  name: "hide",
  enabled: true,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: hide
};
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset$1(_ref2) {
  var state = _ref2.state, options2 = _ref2.options, name2 = _ref2.name;
  var _options$offset = options2.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data2 = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data2[state.placement], x2 = _data$state$placement.x, y2 = _data$state$placement.y;
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x2;
    state.modifiersData.popperOffsets.y += y2;
  }
  state.modifiersData[name2] = data2;
}
const offset$2 = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset$1
};
function popperOffsets(_ref) {
  var state = _ref.state, name2 = _ref.name;
  state.modifiersData[name2] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: "absolute",
    placement: state.placement
  });
}
const popperOffsets$1 = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};
function getAltAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function preventOverflow(_ref) {
  var state = _ref.state, options2 = _ref.options, name2 = _ref.name;
  var _options$mainAxis = options2.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options2.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options2.boundary, rootBoundary = options2.rootBoundary, altBoundary = options2.altBoundary, padding = options2.padding, _options$tether = options2.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options2.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data2 = {
    x: 0,
    y: 0
  };
  if (!popperOffsets2) {
    return;
  }
  if (checkMainAxis) {
    var _offsetModifierState$;
    var mainSide = mainAxis === "y" ? top : left;
    var altSide = mainAxis === "y" ? bottom : right;
    var len = mainAxis === "y" ? "height" : "width";
    var offset2 = popperOffsets2[mainAxis];
    var min$1 = offset2 + overflow[mainSide];
    var max2 = offset2 - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start$1 ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start$1 ? -popperRect[len] : -referenceRect[len];
    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide];
    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset2 + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset2, tether ? max$1(max2, tetherMax) : max2);
    popperOffsets2[mainAxis] = preventedOffset;
    data2[mainAxis] = preventedOffset - offset2;
  }
  if (checkAltAxis) {
    var _offsetModifierState$2;
    var _mainSide = mainAxis === "x" ? top : left;
    var _altSide = mainAxis === "x" ? bottom : right;
    var _offset = popperOffsets2[altAxis];
    var _len = altAxis === "y" ? "height" : "width";
    var _min = _offset + overflow[_mainSide];
    var _max = _offset - overflow[_altSide];
    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
    popperOffsets2[altAxis] = _preventedOffset;
    data2[altAxis] = _preventedOffset - _offset;
  }
  state.modifiersData[name2] = data2;
}
const preventOverflow$1 = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"]
};
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}
function getNodeScroll(node2) {
  if (node2 === getWindow(node2) || !isHTMLElement(node2)) {
    return getWindowScroll(node2);
  } else {
    return getHTMLElementScroll(node2);
  }
}
function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
function order(modifiers) {
  var map2 = /* @__PURE__ */ new Map();
  var visited = /* @__PURE__ */ new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map2.set(modifier.name, modifier);
  });
  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map2.get(dep);
        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}
function debounce(fn2) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve3) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve3(fn2());
        });
      });
    }
    return pending;
  };
}
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current) {
    var existing = merged2[current.name];
    merged2[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key) {
    return merged[key];
  });
}
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element) {
    return !(element && typeof element.getBoundingClientRect === "function");
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper2(reference2, popper2, options2) {
    if (options2 === void 0) {
      options2 = defaultOptions;
    }
    var state = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state,
      setOptions: function setOptions(setOptionsAction) {
        var options3 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options3);
        state.scrollParents = {
          reference: isElement$1(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
        state.orderedModifiers = orderedModifiers.filter(function(m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
        if (!areValidElements(reference3, popper3)) {
          return;
        }
        state.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
          popper: getLayoutRect(popper3)
        };
        state.reset = false;
        state.placement = state.options.placement;
        state.orderedModifiers.forEach(function(modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }
          var _state$orderedModifie = state.orderedModifiers[index], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name2 = _state$orderedModifie.name;
          if (typeof fn2 === "function") {
            state = fn2({
              state,
              options: _options,
              name: name2,
              instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function() {
        return new Promise(function(resolve3) {
          instance.forceUpdate();
          resolve3(state);
        });
      }),
      destroy: function destroy2() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference2, popper2)) {
      return instance;
    }
    instance.setOptions(options2).then(function(state2) {
      if (!isDestroyed && options2.onFirstUpdate) {
        options2.onFirstUpdate(state2);
      }
    });
    function runModifierEffects() {
      state.orderedModifiers.forEach(function(_ref) {
        var name2 = _ref.name, _ref$options = _ref.options, options3 = _ref$options === void 0 ? {} : _ref$options, effect2 = _ref.effect;
        if (typeof effect2 === "function") {
          var cleanupFn = effect2({
            state,
            name: name2,
            instance,
            options: options3
          });
          var noopFn = function noopFn2() {
          };
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn2) {
        return fn2();
      });
      effectCleanupFns = [];
    }
    return instance;
  };
}
var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$2, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /* @__PURE__ */ popperGenerator({
  defaultModifiers
});
const wrapAround = (value2, size) => {
  return (value2 % size + size) % size;
};
class Suggest {
  constructor(owner, containerEl, scope) {
    this.owner = owner;
    this.containerEl = containerEl;
    containerEl.on(
      "click",
      ".suggestion-item",
      this.onSuggestionClick.bind(this)
    );
    containerEl.on(
      "mousemove",
      ".suggestion-item",
      this.onSuggestionMouseover.bind(this)
    );
    scope.register([], "ArrowUp", (event) => {
      if (!event.isComposing) {
        this.setSelectedItem(this.selectedItem - 1, true);
        return false;
      }
    });
    scope.register([], "ArrowDown", (event) => {
      if (!event.isComposing) {
        this.setSelectedItem(this.selectedItem + 1, true);
        return false;
      }
    });
    scope.register([], "Enter", (event) => {
      if (!event.isComposing) {
        this.useSelectedItem(event);
        return false;
      }
    });
  }
  onSuggestionClick(event, el) {
    event.preventDefault();
    const item2 = this.suggestions.indexOf(el);
    this.setSelectedItem(item2, false);
    this.useSelectedItem(event);
  }
  onSuggestionMouseover(_event, el) {
    const item2 = this.suggestions.indexOf(el);
    this.setSelectedItem(item2, false);
  }
  setSuggestions(values) {
    this.containerEl.empty();
    const suggestionEls = [];
    values.forEach((value2) => {
      const suggestionEl = this.containerEl.createDiv("suggestion-item");
      this.owner.renderSuggestion(value2, suggestionEl);
      suggestionEls.push(suggestionEl);
    });
    this.values = values;
    this.suggestions = suggestionEls;
    this.setSelectedItem(0, false);
  }
  useSelectedItem(event) {
    const currentValue = this.values[this.selectedItem];
    if (currentValue) {
      this.owner.selectSuggestion(currentValue, event);
    }
  }
  setSelectedItem(selectedIndex, scrollIntoView) {
    const normalizedIndex = wrapAround(
      selectedIndex,
      this.suggestions.length
    );
    const prevSelectedSuggestion = this.suggestions[this.selectedItem];
    const selectedSuggestion = this.suggestions[normalizedIndex];
    prevSelectedSuggestion == null ? void 0 : prevSelectedSuggestion.removeClass("is-selected");
    selectedSuggestion == null ? void 0 : selectedSuggestion.addClass("is-selected");
    this.selectedItem = normalizedIndex;
    if (scrollIntoView) {
      selectedSuggestion.scrollIntoView(false);
    }
  }
}
class TextInputSuggest {
  constructor(inputEl) {
    this.inputEl = inputEl;
    this.scope = new Scope();
    this.suggestEl = createDiv("suggestion-container");
    const suggestion = this.suggestEl.createDiv("suggestion");
    this.suggest = new Suggest(this, suggestion, this.scope);
    this.scope.register([], "Escape", this.close.bind(this));
    this.inputEl.addEventListener("input", this.onInputChanged.bind(this));
    this.inputEl.addEventListener("focus", this.onInputChanged.bind(this));
    this.inputEl.addEventListener("blur", this.close.bind(this));
    this.suggestEl.on(
      "mousedown",
      ".suggestion-container",
      (event) => {
        event.preventDefault();
      }
    );
  }
  onInputChanged() {
    const inputStr = this.inputEl.value;
    const suggestions = this.getSuggestions(inputStr);
    if (!suggestions) {
      this.close();
      return;
    }
    if (suggestions.length > 0) {
      this.suggest.setSuggestions(suggestions);
      this.open(app.dom.appContainerEl, this.inputEl);
    } else {
      this.close();
    }
  }
  open(container, inputEl) {
    app.keymap.pushScope(this.scope);
    container.appendChild(this.suggestEl);
    this.popper = createPopper(inputEl, this.suggestEl, {
      placement: "bottom-start",
      modifiers: [
        {
          name: "sameWidth",
          enabled: true,
          fn: ({ state, instance }) => {
            const targetWidth = `${state.rects.reference.width}px`;
            if (state.styles.popper.width === targetWidth) {
              return;
            }
            state.styles.popper.width = targetWidth;
            instance.update();
          },
          phase: "beforeWrite",
          requires: ["computeStyles"]
        }
      ]
    });
  }
  close() {
    app.keymap.popScope(this.scope);
    this.suggest.setSuggestions([]);
    if (this.popper) this.popper.destroy();
    this.suggestEl.detach();
  }
}
class FolderSuggest extends TextInputSuggest {
  getSuggestions(inputStr) {
    const abstractFiles = app.vault.getAllLoadedFiles();
    const folders = [];
    const lowerCaseInputStr = inputStr.toLowerCase();
    abstractFiles.forEach((folder) => {
      if (folder instanceof TFolder && folder.path.toLowerCase().contains(lowerCaseInputStr)) {
        folders.push(folder);
      }
    });
    return folders;
  }
  renderSuggestion(file, el) {
    el.setText(file.path);
  }
  selectSuggestion(file) {
    this.inputEl.value = file.path;
    this.inputEl.trigger("input");
    this.close();
  }
}
const msg = (list2) => list2.find((i) => typeof i === "string");
const trunc = (s2) => typeof s2 === "string" ? s2.length > 12 ? `${s2.slice(0, 12).trim()}...` : `${s2}` : "";
const debug$1 = (level) => (...args) => {
  if (level !== "debug") {
    return;
  }
  console.groupCollapsed(`obsidian-kind-model (dbg: ${trunc(msg(args))})`);
  args.forEach((a) => {
    if (typeof a === "function") {
      console.log(a());
    } else if (typeof a === "object" && a !== null) {
      Object.keys(a).map((k) => console.info({ [k]: a[k] }));
    } else {
      console.log(a);
    }
  });
  console.groupEnd();
};
const info = (level) => (...args) => {
  if (["debug"].includes(level)) {
    return;
  }
  console.groupCollapsed(`obsidian-kind-model (info: ${trunc(msg(args))})`);
  args.forEach((a) => {
    if (typeof a === "function") {
      console.info(a);
    } else if (typeof a === "object" && a !== null) {
      Object.keys(a).map((k) => console.info({ [k]: a[k] }));
    } else {
      console.info(a);
    }
  });
  console.groupEnd();
};
const warn = (level) => (...args) => {
  if (["error"].includes(level)) {
    return;
  }
  console.group("obsidian-kind-model");
  args.forEach((a) => {
    console.warn(a);
  });
  console.groupEnd();
};
const error$3 = (level) => (...args) => {
  console.groupEnd();
  new Notification(`obsidian-kind-model (Error): ${msg(args) || ""}`, { body: "see developer console for more details" });
  class KindModelError extends Error {
    constructor(msg2) {
      super(msg2);
    }
  }
  throw new KindModelError(msg(args) || "Kind Model error");
};
const logger = (level, context) => {
  const api2 = {
    level,
    debug: debug$1(level),
    info: info(level),
    warn: warn(level),
    error: error$3()
  };
  return api2;
};
const isNotNull = (prop, base2) => {
  return prop === null ? false : prop in base2 ? true : false;
};
const resolve$1 = (val) => typeof val === "function" ? val() : val;
const contextApi = (el, base2, global_opt, log_level) => ({
  sectionHeading: (heading2, sub_text) => {
    const color = "rgba(15, 117, 224, .75) ";
    const headingText = createEl(
      "h2",
      {
        cls: "section-header",
        text: heading2,
        attr: { style: `font-size: larger; padding-bottom: 0; margin-bottom: 0; margin-top: 0.75rem` }
      }
    );
    const sub_text_el = sub_text ? createEl("div", {
      cls: "section-sub-text",
      text: sub_text,
      attr: { style: `font-size: smaller; border-left: 2px solid ${color}; padding-left: 8px;` }
    }) : void 0;
    const sectionInput = createEl("div", {
      cls: "input-section",
      text: "",
      attr: { style: `border-left: 2px solid ${color}; padding-left: 8px; ` }
    });
    const section_heading = createEl("div").appendChild(headingText);
    if (sub_text_el) {
      section_heading.appendChild(sub_text_el);
    }
    section_heading.appendChild(sectionInput);
    const bottom_pad = "padding-bottom: 0.25rem";
    el.createEl("h2", { text: heading2, attr: { style: `font-size: larger; padding-top: 0.75rem"; ${sub_text ? "" : bottom_pad}` } });
    if (sub_text) {
      el.createEl("p", { cls: "settings-desc", text: sub_text, attr: { style: `${bottom_pad}; font-size: smaller` } });
    }
    el.appendChild(sectionInput);
    const fn2 = inputRow(sectionInput, base2, global_opt, log_level);
    fn2["section"] = heading2;
    return fn2;
  },
  iterateOver: (prop, cb) => {
    const settings = [];
    base2[prop];
    return settings;
  }
});
const componentApi = (el, base2, global_opt, log_level) => (name2, desc, prop) => (s2) => {
  const { debug: debug2, info: info2, warn: warn2, error: error2 } = logger(log_level);
  return {
    addDropdown(choices) {
      s2.addDropdown((dd) => {
        const isKeyValueDict = !Array.isArray(choices);
        for (const opt2 of isKeyValueDict ? Object.keys(choices) : choices) {
          const value2 = isKeyValueDict ? String(choices[opt2]) : opt2;
          dd.addOption(value2, opt2);
          if (isNotNull(prop, base2) && value2 === base2[prop]) {
            dd.setValue(value2);
          }
        }
        dd.onChange((v) => {
          if (isNotNull(prop, base2)) {
            const prior_value = base2[prop];
            base2[prop] = isKeyValueDict ? choices[v] : v;
            debug2(`Updating ${name2} dropdown`, `new value is:
${JSON.stringify(v, null, 2)}`, `prior value was:
${JSON.stringify(prior_value, null, 2)}`);
            if ((global_opt == null ? void 0 : global_opt.saveState) && prop !== null) {
              if (typeof (global_opt == null ? void 0 : global_opt.saveState) !== "function") {
                error2(`saveState property was passed into UiBuilder but it's type is "${typeof (global_opt == null ? void 0 : global_opt.saveState)}" instead of being a function!`);
              } else {
                info2(`auto save`, `the dropdown "${String(prop)}" triggered saving state`, `the current state is: 
${JSON.stringify(base2, null, 2)}`);
                global_opt.saveState();
              }
            } else {
              debug2(`no auto save: state changed on "${name2}" property but state is not automatically save after state changes`);
            }
            s2.setName(resolve$1(name2));
            s2.setDesc(resolve$1(desc));
          } else {
            debug2(`the dropdown "${name2}" changed state but no property was set to record this.`, "this may be ok but is typically an error", `the new state is now: ${v}`);
          }
        });
      });
      return componentApi(el, base2, global_opt, log_level)(name2, desc, prop)(s2);
    },
    addToggleSwitch(opt2 = {}) {
      s2.addToggle((t) => {
        if (isNotNull(prop, base2)) {
          t.setValue(base2[prop]);
        }
        t.onChange((v) => {
          if (isNotNull(prop, base2)) {
            s2.setName(resolve$1(name2));
            s2.setDesc(resolve$1(desc));
            base2[prop] = v;
            if ((global_opt == null ? void 0 : global_opt.saveState) && prop !== null) {
              if (typeof (global_opt == null ? void 0 : global_opt.saveState) !== "function") {
                error2(`saveState property was passed into UiBuilder but it's type is "${typeof (global_opt == null ? void 0 : global_opt.saveState)}" instead of being a function!`);
              }
              info2("auto save", `the toggle switch for "${prop}" detected a change`, `the new value for "${prop}" is: ${v}`);
              global_opt.saveState();
            } else {
              debug2(`no auto save: state changed on "${name2}" on property`);
            }
          }
          if (opt2.refreshDomOnChange) {
            warn2("do not know how to refresh DOM yet");
          }
        });
      });
      return componentApi(el, base2, global_opt, log_level)(name2, desc, prop)(s2);
    },
    addTextInput(opt2 = {}) {
      s2.addText((t) => {
        if (isNotNull(prop, base2)) {
          t.setValue(base2[prop]);
        }
        t.onChange((v) => {
          if (isNotNull(prop, base2)) {
            base2[prop] = v;
          } else {
            debug2(`state changed on the property "${name2}" but because "prop" was null it will not be recorded.`);
          }
          s2.setName(resolve$1(name2));
          s2.setDesc(resolve$1(desc));
          if (opt2.refreshDomOnChange) {
            warn2("do not know how to refresh DOM yet");
          }
          if ((global_opt == null ? void 0 : global_opt.saveState) && prop !== null) {
            if (typeof (global_opt == null ? void 0 : global_opt.saveState) !== "function") {
              error2(`saveState property was passed into UiBuilder but it's type is "${typeof (global_opt == null ? void 0 : global_opt.saveState)}" instead of being a function!`);
            }
            debug2(`toggle switch for "${String(prop)}" saving state`);
            global_opt.saveState();
          } else {
            debug2(`no auto save: state changed on "${name2}" on property`);
          }
        });
      });
      return componentApi(el, base2, global_opt, log_level)(name2, desc, prop)(s2);
    },
    addFolderSearch(opt2 = {}) {
      s2.addSearch((t) => {
        new FolderSuggest(t.inputEl);
        t.setPlaceholder(opt2.placeholder || "Example: folder1/folder2");
        if (isNotNull(prop, base2)) {
          t.setValue(base2[prop]);
        }
        t.onChange((v) => {
          s2.setName(resolve$1(name2));
          s2.setDesc(resolve$1(desc));
          if (isNotNull(prop, base2)) {
            base2[prop] = v;
            if (global_opt == null ? void 0 : global_opt.saveState) {
              if (typeof (global_opt == null ? void 0 : global_opt.saveState) !== "function") {
                error2(`saveState property was passed into UiBuilder but it's type is "${typeof (global_opt == null ? void 0 : global_opt.saveState)}" instead of being a function!`);
              } else {
                info2(`auto save`, `folder prop ${name2} [${prop}] changed state to:`, v);
                global_opt.saveState();
              }
            } else {
              debug2(`no auto save: state changed on "${name2}" on property`);
            }
          }
          if (opt2.refreshDomOnChange) {
            warn2("do not know how to refresh DOM yet");
          }
        });
      });
      return componentApi(el, base2, global_opt, log_level)(name2, desc, prop)(s2);
    },
    addButton: (o) => {
      s2.addButton((b) => {
        b.setTooltip((o == null ? void 0 : o.tooltip) || resolve$1(desc)).setButtonText((o == null ? void 0 : o.buttonText) || "+").setCta().onClick((o == null ? void 0 : o.onClick) ? o.onClick : () => warn2(`${name2} button for "${String(o == null ? void 0 : o.buttonText)}" does not have a click handler`));
        if (o == null ? void 0 : o.backgroundColor) {
          b.setClass(`bg-${o.backgroundColor}`);
        }
        if (o == null ? void 0 : o.icon) {
          b.setIcon(o.icon);
        }
      });
      return componentApi(el, base2, global_opt, log_level)(name2, desc, prop)(s2);
    },
    done: () => s2
  };
};
const inputRow = (el, base2, global_opt, log_level) => (name2, desc, prop) => {
  const s2 = new Setting(el).setName(resolve$1(name2)).setDesc(resolve$1(desc));
  return componentApi(el, base2, global_opt, log_level)(name2, desc, prop)(s2);
};
const UiBuilder = (el, base2, log_level, global_opt = {}) => {
  const { h1, style: style2 } = global_opt;
  const context = contextApi(el, base2, global_opt, log_level);
  const settings = inputRow(el, base2, global_opt, log_level);
  el.empty();
  for (const prop of Object.keys(context)) {
    settings[prop] = context[prop];
  }
  if (h1) {
    const attrs = style2 ? { attrs: { style: style2 } } : {};
    el.createEl("h1", { text: h1, ...attrs, cls: "page-header" });
  }
  return settings;
};
class KindModal extends Modal {
  constructor(app2, kind, log_level) {
    super(app2);
    this.kind = kind;
    this.log_level = log_level;
  }
  onOpen() {
    const ui = UiBuilder(this.contentEl, this.kind, this.log_level, { h1: "New Kind model" });
    const core2 = ui.sectionHeading("Core Config");
    core2("Name", "the unique name for this Kind", "name").addTextInput();
    core2(
      "Tag",
      "the tag which will be used to identify this Kind; no need to include '#' symbol though you're free to.",
      "tag"
    ).addTextInput();
    core2(
      "Classification",
      () => classification(this.kind._classification_type).desc,
      "_classification_type"
    ).addDropdown(CLASSIFICATION);
    const filesAndFolders = ui.sectionHeading(
      "Filename and Folders",
      'When you use the "add kinded page" command, this will determine which folders are offered as possible locations'
    );
    filesAndFolders(
      "Favorite Folder",
      "the folder you most associate with this kind",
      "_folder_favorite"
    ).addTextInput();
    filesAndFolders(
      "Include Subdirectories",
      "whether the sub-directories under your favorite folder should be offered as options",
      "_show_sub_dirs"
    ).addToggleSwitch();
    filesAndFolders(
      "Current Directory",
      "whether to allow current directory to be a valid location",
      "_folder_include_cwd"
    ).addToggleSwitch({
      refreshDomOnChange: true
    });
    if (this.kind._folder_include_cwd) {
      filesAndFolders(
        "Default Directory",
        "whether the current directory or the favorite dir should be the default",
        "_classification_type"
      ).addDropdown(FOLDER_DEFAULT);
    }
    filesAndFolders(
      "Filename Date Prefix",
      "whether or not the file name should be prefixed with a date",
      "_filename_date_prefix"
    ).addToggleSwitch();
    const properties = ui.sectionHeading(
      "Properties",
      "In this section you can add Relationships and Metrics"
    );
    properties(
      "Add Relationship",
      "The classification strategy sets up an abstracted set of relationships but sometimes you want a direct relationship to another kind. You can add them here.",
      "_relationships"
    ).addButton({
      icon: "key",
      buttonText: "+",
      onClick: () => {
        this.kind._relationships.push({ prop: "", fk_kind: "", cardinality: "0:1" });
      }
    });
    properties(
      "Add Metric",
      'Metrics are numeric properties which are associated with a unit of measure. When added to a kind these properties will be added as properties to the page; you can fill them in manually or you can use the "Add Metrics" command to be brought through it via script.',
      "_metric_props"
    ).addButton({
      icon: "binary",
      buttonText: "+",
      onClick: () => {
        this.kind._metric_props.push({ name: "", uom_type: "mass" });
      }
    });
    const metrics = this.kind._metric_props;
    for (const key in this.kind._metric_props) {
      ui(
        metrics[key].name,
        () => metrics[key].name.trim() === "" ? "new property" : "existing property",
        "_metric_props",
        key
      ).addDropdown(UOM_TYPES);
    }
    const auto2 = ui.sectionHeading("Auto Aliases", "When you're working on a kind page -- or any classification of a kind page -- you configure whether the `aliases` assigned to that page are automatically added to in smart ways.");
    auto2(
      "Plural/Singular",
      "Ensure that both the singular and plural versions of a Kind page are available",
      "_aliases_plural"
    ).addToggleSwitch();
    auto2(
      "Casing",
      "Ensure that the page's name is available in lowercase as well as capitalized",
      "_aliases_lowercase"
    ).addToggleSwitch();
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
const ClassificationLookup = {
  category: [
    ["category"],
    {},
    "A 0:1 relationship to a category only"
  ],
  "category and subcategory": [
    ["category", "sub_category"],
    {},
    "A 0:1 hierarchical classification: a category and a sub-category of the parent category."
  ],
  categories: [
    ["categories"],
    {},
    "A 0:M relationship to any number of categories."
  ],
  "grouped categories": [
    ["categories"],
    { categories: "group" },
    "A 0:M relationship to any number of categories where the categories themselves have a 'group' property which organizes them."
  ]
};
const classification = (c) => ({
  name: c,
  kind_props: ClassificationLookup[c][0],
  other_props: ClassificationLookup[c][1],
  desc: ClassificationLookup[c][2]
});
class SettingsTab extends PluginSettingTab {
  constructor(app2, plugin4) {
    super(app2, plugin4);
    this.app = app2;
    this.plugin = plugin4;
  }
  display() {
    const { info: info2, debug: debug2 } = logger(this.plugin.settings.log_level);
    debug2(`The settings menu has been brought up and we start in this state: `, this.plugin.settings);
    const ui = UiBuilder(
      this.containerEl,
      this.plugin.settings,
      this.plugin.settings.log_level,
      { h1: "Kind Models", saveState: this.plugin.saveSettings.bind(this.plugin) }
    );
    ui(
      "Handle Tags",
      "how to manage tags between page and frontmatter",
      "handle_tags"
    ).addDropdown(TAG_HANDLING);
    ui(
      "Folder Location",
      "All 'kind', and 'type' definitions will be located here",
      "kind_folder"
    ).addFolderSearch();
    const kinds = ui.sectionHeading(
      "Kinds",
      'The basic building block this plugin provides is a Kind. Each Kind represents some sort of entity. These entities can be "classified ", grouped into broader "types", have relationships to other pages formalized, and have metrics added so that summary views of this kind can provide useful comparison metrics.'
    );
    kinds(
      "Default Classification",
      "Each kind gets to state it's classification model but here you can state the default choice",
      "default_classification"
    ).addDropdown(CLASSIFICATION);
    kinds(
      "List of Kind Models",
      "Existing kinds are listed below; use button to add another",
      "kinds"
    ).addButton({
      icon: "package-plus",
      onClick: () => {
        new KindModal(this.app, DEFAULT_KIND, this.plugin.settings.log_level).open();
      }
    });
    const types = ui.sectionHeading(
      "Types",
      `Types provide a grouping function for Kinds. You can specify as many as you like and then later map 1:M Kinds to these types. Each type will receive it's own page and the kinds related to it will have a "type" property which points to this page.`
    );
    types(
      "List of Types",
      'Add a new "type" by pressing button or manually by creating a file in `${}.',
      "types"
    ).addButton({
      icon: "plus-circle",
      onClick: () => {
        console.log("add new type");
      }
    });
    const urls = ui.sectionHeading(
      "URLs",
      "This section deals with understanding URLs in the body of content as well as what properties in frontmatter should be considered for URL links."
    );
    urls(
      "URL Properties",
      "Add a property that may reside in frontmatter and indicate a URL or list of URLs",
      "url_props"
    ).addButton({
      icon: "list-plus",
      onClick: () => console.log("add URL props")
    });
    urls(
      "URL Patterns",
      "Setup regular expressions to map links in the page to a property or to modify the icon for that link in summary views.",
      "url_patterns"
    ).addButton({
      icon: "git-branch-plus",
      onClick: () => console.log("add URL patterns", this.plugin.settings)
    });
    const blocks = ui.sectionHeading(
      "Page Blocks",
      'With page blocks you can map page template blocks to various kind types and by doing so that page will be updated with these sections whenever the "update page" command is run.'
    );
    blocks(
      "Page Blocks",
      "Add to the page blocks made available to kinds.",
      "page_blocks"
    ).addButton({
      icon: "file-plus"
    });
    const ops = ui.sectionHeading("Operations");
    ops(
      "Bulk Operations",
      "Use buttons to take desired action: sync, snapshot, restore, reset.",
      null
    ).addButton({
      icon: "refresh-ccw",
      buttonText: "Sync",
      backgroundColor: "indigo",
      tooltip: `Synchronize the kind definitions in your vault's "kind folder" with the settings here.`
    }).addButton({
      icon: "download",
      buttonText: "Snapshot",
      backgroundColor: "blue",
      tooltip: "Save current configuration as a Snapshot (which can be restored later)"
    }).addButton({
      icon: "clipboard-copy",
      buttonText: "Clipboard",
      backgroundColor: "blue",
      tooltip: "Copy your current configuration to the clipboard"
    }).addButton({
      icon: "upload",
      buttonText: "Restore",
      backgroundColor: "blue",
      tooltip: "Restore configuration from a snapshot or clipboard"
    }).addButton({
      icon: "reset",
      buttonText: "Reset",
      onClick: () => info2("reset clicked"),
      backgroundColor: "red",
      tooltip: "Restore configuration to Plugin Default"
    });
    ops(
      "Log Level",
      "if you're experiencing problems you think could be related to this plugin you can change the log level to get more info sent to the developer console.",
      "log_level"
    ).addDropdown(LOG_LEVELS);
  }
}
function createConstant$1(kind) {
  return {
    _type: "Constant",
    kind
  };
}
var NUMERIC_CHAR = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9"
];
var WideAssignment = {
  boolean: () => "<<boolean>>",
  string: () => "<<string>>",
  number: () => "<<number>>",
  symbol: () => "<<symbol>>",
  null: () => "<<null>>",
  function: () => "<<function>>",
  tuple: () => "<<tuple>>",
  singularTuple: () => ["<<tuple>>"],
  object: () => "<<object>>",
  emptyObject: () => "<<empty-object>>",
  undefined: () => "<<undefined>>",
  /**
   * run-time value is a type token for `unknown` and type is of course `unknown`
   */
  unknown: () => "<<unknown>>",
  nothing: () => "<<nothing>>",
  something: () => "<<something>>"
};
var wide = WideAssignment;
var entry = (refType, desc, ...params) => [
  refType(wide),
  desc,
  params.map(
    (i) => typeof i === "function" ? i(wide) : i
  )
];
({
  "Extends": entry((t) => t.unknown(), "extends the type", (t) => t.unknown()),
  "NotExtends": entry((t) => t.unknown(), "does not extent the type", (t) => t.unknown()),
  "Equals": entry((t) => t.unknown(), "equals the type", (t) => t.unknown()),
  "NotEqual": entry((t) => t.unknown(), "does not equal the type", (t) => t.unknown()),
  "Truthy": entry((t) => t.unknown(), "must be a truthy value"),
  "Falsy": entry((t) => t.unknown(), "must be a falsy value"),
  "IsSomething": entry((t) => t.unknown(), "must be 'something' (aka, not null or undefined)"),
  "IsNothing": entry((t) => t.unknown(), "must be 'nothing' (aka, null or undefined)"),
  "IsString": entry((t) => t.string(), "must extend a string type"),
  "IsNumber": entry((t) => t.number(), "must extend a number type"),
  "IsBoolean": entry((t) => t.boolean(), "must extend a boolean type"),
  // numeric
  "GreaterThan": entry((t) => t.number(), "must be a numeric literal greater than [[0]]", (t) => t.number()),
  "LessThan": entry((t) => t.number(), "must be a numeric literal less than [[0]]", (t) => t.number()),
  // string
  "StartsWith": entry((t) => t.string(), "must be a string literal that starts with '[[0]]'", (t) => t.string()),
  "EndsWith": entry((t) => t.string(), "must be a string literal that ends with '[[0]]'", (t) => t.string()),
  "Includes": entry((t) => t.string(), "must be a string literal that includes the substring '[[0]]'", (t) => t.string()),
  // function
  "ReturnsSomething": entry((t) => t.function(), "must be a function which returns 'something' (aka, not null or undefined)"),
  "ReturnsNothing": entry((t) => t.function(), "must be a function which returns 'nothing' (aka, null or undefined)"),
  "ReturnsTrue": entry((t) => t.function(), "must be a function which returns 'true'"),
  "ReturnsFalse": entry((t) => t.function(), "must be a function which returns 'false'"),
  "ReturnsTruthy": entry((t) => t.function(), "must be a function which returns a 'truthy' value"),
  "ReturnsFalsy": entry((t) => t.function(), "must be a function which returns a 'falsy' value"),
  "ReturnsExtends": entry((t) => t.unknown(), "must be a function which returns a value which extends [[0]]", (t) => t.unknown()),
  "ReturnsEquals": entry((t) => t.unknown(), "must be a function which returns a value which equals [[0]]", (t) => t.unknown()),
  "Contains": entry((t) => t.tuple(), "must be a tuple and have elements that extends the value [[0]]", (t) => t.unknown()),
  // TODO: get the below working`
  "ContainsSome": entry((t) => t.tuple(), "must be a tuple and have elements that extends the value [[0]]", (t) => t.singularTuple())
});
var Never$1 = createConstant$1("never");
var SIMPLE_SCALAR_TOKENS = [
  "string",
  "number",
  `string(TOKEN)`,
  `number(TOKEN)`,
  "boolean",
  "true",
  "false",
  "null",
  "undefined",
  "unknown",
  "any",
  "never"
];
var SIMPLE_OPT_SCALAR_TOKENS = [
  "Opt<string>",
  "Opt<number>",
  "Opt<boolean>",
  "Opt<true>",
  "Opt<false>",
  "Opt<null>",
  "Opt<undefined>",
  "Opt<unknown>",
  "Opt<any>",
  "Opt<string(TOKEN)>",
  "Opt<number(TOKEN)>",
  "Opt<undefined>"
];
var SIMPLE_UNION_TOKENS = [
  `Union(TOKEN)`
];
var SIMPLE_DICT_TOKENS = [
  "Dict",
  "Dict<string, string>",
  "Dict<string, number>",
  "Dict<string, boolean>",
  "Dict<string, unknown>",
  "Dict<string, Opt<string>>",
  "Dict<string, Opt<number>>",
  "Dict<string, Opt<boolean>>",
  "Dict<string, Opt<unknown>>",
  "Dict<{TOKEN: TOKEN}>",
  "Dict<{TOKEN: TOKEN, TOKEN: TOKEN}>"
];
var SIMPLE_ARRAY_TOKENS = [
  "Array",
  "Array<string>",
  "Array<string(TOKEN)>",
  "Array<number>",
  "Array<number(TOKEN)>",
  "Array<boolean>",
  "Array<unknown>",
  `Array<Dict>`,
  `Array<Set>`,
  `Array<Map>`
];
var SIMPLE_MAP_TOKENS = [
  "Map",
  "Map<TOKEN, TOKEN>",
  "WeakMap"
];
var SIMPLE_SET_TOKENS = [
  "Set",
  "Set<TOKEN>"
];
var SIMPLE_CONTAINER_TOKENS = [
  ...SIMPLE_DICT_TOKENS,
  ...SIMPLE_ARRAY_TOKENS,
  ...SIMPLE_MAP_TOKENS,
  ...SIMPLE_SET_TOKENS
];
var SIMPLE_TOKENS = [
  ...SIMPLE_SCALAR_TOKENS,
  ...SIMPLE_OPT_SCALAR_TOKENS,
  ...SIMPLE_CONTAINER_TOKENS,
  ...SIMPLE_UNION_TOKENS
];
var REPO_SOURCE_LOOKUP = {
  "github": [`github.com`, "github.io"],
  "bitbucket": ["bitbucket.com"],
  "gitlab": ["gitlab.com"],
  "codecommit": ["https://aws.amazon.com/codecommit/"],
  "local": []
};
var NETWORK_PROTOCOL_LOOKUP = {
  http: ["http", "https"],
  ftp: ["ftp", "sftp"],
  file: ["", "file"],
  ws: ["ws", "wss"],
  ssh: ["", "ssh"],
  "scp": ["", "scp"]
};
var toFinalizedConfig = (config) => {
  return { ...config, finalized: true };
};
toFinalizedConfig({
  input: "req",
  output: "opt",
  cardinality: "I -> O[]"
});
toFinalizedConfig({
  input: "req",
  output: "req",
  cardinality: "I -> O"
});
toFinalizedConfig({
  input: "req",
  output: "req",
  cardinality: "I[] -> O"
});
function isString$2(value2) {
  return typeof value2 === "string";
}
function isNumber$2(value2) {
  return typeof value2 === "number";
}
function isSymbol(value2) {
  return typeof value2 === "symbol";
}
function isNull(value2) {
  return value2 === null ? true : false;
}
function isScalar(value2) {
  return isString$2(value2) || isNumber$2(value2) || isSymbol(value2) || isNull(value2);
}
function keysOf(container) {
  const keys = Array.isArray(container) ? Object.keys(container).map((i) => Number(i)) : isObject(container) ? isRef(container) ? ["value"] : Object.keys(container) : [];
  return keys;
}
var valuesOf = (obj) => {
  const values = [];
  for (const k of Object.keys(obj)) {
    values.push(obj[k]);
  }
  return values;
};
function isUndefined$1(value2) {
  return typeof value2 === "undefined" ? true : false;
}
function isObject(value2) {
  return typeof value2 === "object" && value2 !== null && Array.isArray(value2) === false;
}
function isTrue(value2) {
  return value2 === true;
}
function isArray(value2) {
  return Array.isArray(value2) === true;
}
function isContainer$1(value2) {
  return Array.isArray(value2) || isObject(value2) ? true : false;
}
function isRef(value2) {
  return isObject(value2) && "value" in value2 && Array.from(Object.keys(value2)).includes("_value");
}
function isFunction$2(value2) {
  return typeof value2 === "function" ? true : false;
}
var isUrl = (val, ...protocols) => {
  const p2 = protocols.length === 0 ? ["http", "https"] : protocols;
  return isString$2(val) && p2.some((i) => val.startsWith(`${i}://`));
};
var tokens = [
  "1",
  "inherit",
  "initial",
  "revert",
  "revert-layer",
  "unset",
  "auto"
];
var isRatio = (val) => /[0-9]{1,4}\s*\/\s*[0-9]{1,4}/.test(val);
var isCssAspectRatio = (val) => {
  return isString$2(val) && val.split(/\s+/).every((i) => tokens.includes(i) || isRatio(i));
};
var isInlineSvg = (v) => {
  return isString$2(v) && v.trim().startsWith(`<svg`) && v.trim().endsWith(`</svg>`);
};
var isYouTubeShareUrl = (val) => {
  return isString$2(val) && val.startsWith(`https://youtu.be`);
};
var isYouTubeVideoUrl = (val) => {
  return isString$2(val) && (val.startsWith("https://www.youtube.com") || val.startsWith("https://youtube.com") || val.startsWith("https://youtu.be"));
};
var isYouTubeCreatorUrl = (url) => {
  return isString$2(url) && (url.startsWith(`https://www.youtube.com/@`) || url.startsWith(`https://youtube.com/@`) || url.startsWith(`https://www.youtube.com/channel/`));
};
var isRepoUrl = (val) => {
  const baseUrls = valuesOf(REPO_SOURCE_LOOKUP).flat();
  return isString$2(val) && baseUrls.every(
    (u) => val === u || val.startsWith(`${u}/`)
  );
};
var isGithubRepoUrl = (val) => {
  const baseUrls = [""];
  return isString$2(val) && baseUrls.every(
    (u) => val === u || val.startsWith(`${u}/`)
  );
};
var hasUrlQueryParameter = (val, prop) => {
  return isString$2(getUrlQueryParams(val, prop));
};
var asChars = (str) => {
  return str.split("");
};
SIMPLE_TOKENS.map((i) => i.split("TOKEN"));
SIMPLE_SCALAR_TOKENS.map((i) => i.split("TOKEN"));
function stripTrailing(content2, ...strip) {
  let output = String(content2);
  for (const s2 of strip) {
    if (output.endsWith(String(s2))) {
      output = output.slice(0, -1 * String(s2).length);
    }
  }
  return isNumber$2(content2) ? Number(output) : output;
}
function ensureTrailing(content2, ensure) {
  return (
    //
    content2.endsWith(ensure) ? content2 : `${content2}${ensure}`
  );
}
function ensureLeading(content2, ensure) {
  let output = String(content2);
  return output.startsWith(String(ensure)) ? content2 : isString$2(content2) ? `${ensure}${content2}` : Number(`${ensure}${content2}`);
}
function stripAfter(content2, find2) {
  return content2.split(find2).shift();
}
function stripBefore(content2, find2) {
  return content2.split(find2).slice(1).join(find2);
}
var stripUntil = (content2, ...until) => {
  const stopIdx = asChars(content2).findIndex((c) => until.includes(c));
  return content2.slice(stopIdx);
};
var retainWhile = (content2, ...retain2) => {
  const stopIdx = asChars(content2).findIndex((c) => !retain2.includes(c));
  return content2.slice(0, stopIdx);
};
function retainUntil(content2, ...find2) {
  const chars = asChars(content2);
  let idx = 0;
  while (!find2.includes(chars[idx]) && idx <= chars.length) {
    idx = idx + 1;
  }
  return idx === 0 ? "" : content2.slice(0, idx);
}
var createFnWithProps = (fn2, props, narrowing = false) => {
  let fnWithProps = fn2;
  for (let prop of Object.keys(props)) {
    fnWithProps[prop] = props[prop];
  }
  return isTrue(narrowing) ? fnWithProps : fnWithProps;
};
var youtubeEmbed = (url) => {
  if (hasUrlQueryParameter(url, "v")) {
    const id = getUrlQueryParams(url, "v");
    return `https://www.youtube.com/embed/${id}`;
  } else if (isYouTubeShareUrl(url)) {
    const id = url.split("/").pop();
    if (id) {
      return `https://www.youtube.com/embed/${id}`;
    } else {
      throw new Error(`Unexpected problem parsing share URL -- "${url}" -- into a YouTube embed URL`);
    }
  } else {
    throw new Error(`Unexpected URL structure; unable to convert "${url}" to a YouTube embed URL`);
  }
};
Object.values(NETWORK_PROTOCOL_LOOKUP).flat().filter((i) => i !== "");
var getUrlQueryParams = (url, specific = void 0) => {
  const qp = stripBefore(url, "?");
  if (specific) {
    return qp.includes(`${specific}=`) ? decodeURIComponent(
      stripAfter(
        stripBefore(qp, `${specific}=`),
        "&"
      ).replace(/\+/g, "%20")
    ) : void 0;
  }
  return qp === "" ? qp : `?${qp}`;
};
const isMarkdownView = (val) => {
  return typeof val === "object" && "getViewData" in val && typeof val.getViewData === "function" ? true : false;
};
const isTFile = (v) => {
  return typeof v === "object" && "path" in v;
};
const isFileLink = (val) => {
  return isLink(val) && "type" in val && val.type === "file";
};
const isLink = (val) => {
  return isObject(val) && "path" in val && isString$2(val.path) && "embed" in val && typeof val.embed === "boolean";
};
const isDataviewFile = (val) => {
  var _a2;
  return typeof val === "object" && val !== null && // eslint-disable-next-line @typescript-eslint/no-explicit-any
  "aliases" in val && ((_a2 = val == null ? void 0 : val.aliases) == null ? void 0 : _a2.where) ? true : false;
};
const isDataviewPage = (val) => {
  return typeof val === "object" && val !== null && // eslint-disable-next-line @typescript-eslint/no-explicit-any
  "file" in val && isDataviewFile(val.file) ? true : false;
};
const isDvPage = (val) => {
  return isObject(val) && "file" in val && isObject(val.file) && "link" in val.file && "name" in val.file && "path" in val.file;
};
const MARKDOWN_PAGE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M0 3.5A1.5 1.5 0 0 1 1.5 2h12A1.5 1.5 0 0 1 15 3.5v8a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 0 11.5zM10 5v3.293L8.854 7.146l-.708.708l2 2a.5.5 0 0 0 .708 0l2-2l-.707-.708L11 8.293V5zm-7.146.146A.5.5 0 0 0 2 5.5V10h1V6.707l1.5 1.5l1.5-1.5V10h1V5.5a.5.5 0 0 0-.854-.354L4.5 6.793z" clip-rule="evenodd"/></svg>`;
const WARN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>`;
const QUOTE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-quote"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>`;
const INFO_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-info"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`;
const TIP_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-flame"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>`;
const SUMMARY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="currentColor" d="M200.12 55.87A102 102 0 1 0 55.88 200.12A102 102 0 1 0 200.12 55.87M94 211.37V152a2 2 0 0 1 2-2h64a2 2 0 0 1 2 2v59.37a90.49 90.49 0 0 1-68 0M146 138h-36V99.71l36-18Zm45.64 53.64A90.93 90.93 0 0 1 174 205.39V152a14 14 0 0 0-14-14h-2V72a6 6 0 0 0-8.68-5.37l-48 24A6 6 0 0 0 98 96v42h-2a14 14 0 0 0-14 14v53.39a90.93 90.93 0 0 1-17.64-13.75a90 90 0 1 1 127.28 0"/></svg>`;
const BUG_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-bug"><path d="m8 2 1.88 1.88"></path><path d="M14.12 3.88 16 2"></path><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"></path><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"></path><path d="M12 20v-9"></path><path d="M6.53 9C4.6 8.8 3 7.1 3 5"></path><path d="M6 13H2"></path><path d="M3 21c0-2.1 1.7-3.9 3.8-4"></path><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"></path><path d="M22 13h-4"></path><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"></path></svg>`;
const EXAMPLE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`;
const QUESTION_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-help-circle"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>`;
const SUCCESS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-check"><path d="M20 6 9 17l-5-5"></path></svg>`;
const ERROR_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
const NOTE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>`;
const BOOK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M14 9.9V8.2q.825-.35 1.688-.525T17.5 7.5q.65 0 1.275.1T20 7.85v1.6q-.6-.225-1.213-.337T17.5 9q-.95 0-1.825.238T14 9.9m0 5.5v-1.7q.825-.35 1.688-.525T17.5 13q.65 0 1.275.1t1.225.25v1.6q-.6-.225-1.213-.338T17.5 14.5q-.95 0-1.825.225T14 15.4m0-2.75v-1.7q.825-.35 1.688-.525t1.812-.175q.65 0 1.275.1T20 10.6v1.6q-.6-.225-1.213-.338T17.5 11.75q-.95 0-1.825.238T14 12.65M6.5 16q1.175 0 2.288.263T11 17.05V7.2q-1.025-.6-2.175-.9T6.5 6q-.9 0-1.788.175T3 6.7v9.9q.875-.3 1.738-.45T6.5 16m6.5 1.05q1.1-.525 2.213-.787T17.5 16q.9 0 1.763.15T21 16.6V6.7q-.825-.35-1.713-.525T17.5 6q-1.175 0-2.325.3T13 7.2zM12 20q-1.2-.95-2.6-1.475T6.5 18q-1.05 0-2.062.275T2.5 19.05q-.525.275-1.012-.025T1 18.15V6.1q0-.275.138-.525T1.55 5.2q1.15-.6 2.4-.9T6.5 4q1.45 0 2.838.375T12 5.5q1.275-.75 2.663-1.125T17.5 4q1.3 0 2.55.3t2.4.9q.275.125.413.375T23 6.1v12.05q0 .575-.487.875t-1.013.025q-.925-.5-1.937-.775T17.5 18q-1.5 0-2.9.525T12 20m-5-8.35"/></svg>`;
const KINDLE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><circle cx="24" cy="24" r="21.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M6.944 37.03a56.3 56.3 0 0 1 9.696-.751c4.318 0 11.836 1.626 20.316 4.879"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M20.167 36.547c1.52-.212 3.833-2.679 3.833-2.679a15 15 0 0 0 2.237-1.57l2.179 2.124v1.24l1.29.885l3.589-2.96s-.379-1.293-1.262-1.64c-.042-.62-2.748-5.06-3-5.425m-6.589.533a15 15 0 0 0 2.44 1.542c.392.028 6.532-4.093 6.532-4.093a4.73 4.73 0 0 0 2.13-1.122a2.7 2.7 0 0 0 .225-1.15s.365-.476.365-.645s.28-1.01.28-1.093"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M24.855 24.504s.701.869.925.869s5.103-2.58 5.215-3.14m-10.828 6.532c.09-.084 2.644-1.444 2.644-1.444"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M18.154 21.868c.477 1.907 3.673 5.453 3.673 5.453l3.365-3.294s-2.832-3.028-3.169-3.953s-.785-2.524-1.682-2.916s-4.458-2.243-4.458-2.243l-.673 1.233a11.73 11.73 0 0 0-5.13 9.673c0 6.561.756 8.804.756 8.804s4.85-1.037 6.589-2.888s2.742-2.972 2.742-2.972l.353-3.004"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M11.597 34.44a3.44 3.44 0 0 0 1.423 1.93m19.701-2.31a15.5 15.5 0 0 0 3.391 4.532a17 17 0 0 0 2.25 1.304M30.03 36.28c.573.756 2.396 2.817 2.956 3.448M20.167 17.079l.454-.426s2.047 1.402 2.664 1.01s.589-.842.589-.842s1.01-.617.981-.925a1.7 1.7 0 0 1 0-.449h.841s-.532-1.598-.196-2.186l.336-.59l.401.365a2.6 2.6 0 0 0 1.03-2.58c-.393-1.57-2.776-4.037-3.87-4.205s-.953.196-.953.196s-1.99-1.177-3.224-.084s-2.692 2.356-2.663 4.599s.056 2.887.224 3.112a2.6 2.6 0 0 0 .766.481l-.494.964m17.924.738l3.028.2l-5.284 5.663l-2.511-.308z"/></svg>`;
const SEARCH_BOOK = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M11.724 7.447a2.276 2.276 0 1 0 0 4.553a2.276 2.276 0 0 0 0-4.553M4 4.5A2.5 2.5 0 0 1 6.5 2H18a2.5 2.5 0 0 1 2.5 2.5v14.25a.75.75 0 0 1-.75.75H5.5a1 1 0 0 0 1 1h13.25a.75.75 0 0 1 0 1.5H6.5A2.5 2.5 0 0 1 4 19.5zm10.819 7.295a3.724 3.724 0 1 0-1.024 1.024l2.476 2.475l.067.058l.008.006a.724.724 0 0 0 .942-1.093z"/></svg>`;
const AMAZON = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M15.93 17.09c-.18.16-.43.17-.63.06c-.89-.74-1.05-1.08-1.54-1.79c-1.47 1.5-2.51 1.95-4.42 1.95c-2.25 0-4.01-1.39-4.01-4.17c0-2.18 1.17-3.64 2.86-4.38c1.46-.64 3.49-.76 5.04-.93V7.5c0-.66.05-1.41-.33-1.96c-.32-.49-.95-.7-1.5-.7c-1.02 0-1.93.53-2.15 1.61c-.05.24-.25.48-.47.49l-2.6-.28c-.22-.05-.46-.22-.4-.56c.6-3.15 3.45-4.1 6-4.1c1.3 0 3 .35 4.03 1.33C17.11 4.55 17 6.18 17 7.95v4.17c0 1.25.5 1.81 1 2.48c.17.25.21.54 0 .71l-2.06 1.78h-.01m-2.7-6.53V10c-1.94 0-3.99.39-3.99 2.67c0 1.16.61 1.95 1.63 1.95c.76 0 1.43-.47 1.86-1.22c.52-.93.5-1.8.5-2.84m6.93 8.98C18 21.14 14.82 22 12.1 22c-3.81 0-7.25-1.41-9.85-3.76c-.2-.18-.02-.43.25-.29c2.78 1.63 6.25 2.61 9.83 2.61c2.41 0 5.07-.5 7.51-1.53c.37-.16.66.24.32.51m.91-1.04c-.28-.36-1.85-.17-2.57-.08c-.19.02-.22-.16-.03-.3c1.24-.88 3.29-.62 3.53-.33c.24.3-.07 2.35-1.24 3.32c-.18.16-.35.07-.26-.11c.26-.67.85-2.14.57-2.5z" fill="currentColor"/></svg>`;
const BOOK_CATALOG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M6.3 42.5h34.1m-34-2l7-.2l-.5-34.7l-6.3-.1Zm8.6-27l-.3 26.3l6.5-.2l.8-25.9Zm9-5.6l-1.4 32.2l8.7-.1L33 8.4Zm10 6.3l-1.5 26.3l7.8.1l1.4-26.3Zm1 0a8.5 8.5 0 0 1 5.7-3.7M12.9 5.6L14.8 9l.1 4.6m-1.5 26.7l1.3-.5"/></svg>`;
const style$1 = (opts) => {
  let fmt2 = [];
  if (opts == null ? void 0 : opts.pb) {
    fmt2.push(`padding-bottom: ${opts.pb}`);
  }
  if (opts == null ? void 0 : opts.pt) {
    fmt2.push(`padding-top: ${opts.pt}`);
  }
  if (opts == null ? void 0 : opts.py) {
    fmt2.push(`padding-top: ${opts.py}`);
    fmt2.push(`padding-bottom: ${opts.py}`);
  }
  if (opts == null ? void 0 : opts.px) {
    fmt2.push(`padding-left: ${opts.px}`);
    fmt2.push(`padding-right: ${opts.px}`);
  }
  if (opts == null ? void 0 : opts.pl) {
    fmt2.push(`padding-left: ${opts.pl}`);
  }
  if (opts == null ? void 0 : opts.pr) {
    fmt2.push(`padding-right: ${opts.pr}`);
  }
  if (opts == null ? void 0 : opts.p) {
    fmt2.push(`padding: ${opts.p}`);
  }
  if (opts == null ? void 0 : opts.m) {
    fmt2.push(`margin-top: ${opts.m}`);
    fmt2.push(`margin-bottom: ${opts.m}`);
    fmt2.push(`margin-left: ${opts.m}`);
    fmt2.push(`margin-right: ${opts.m}`);
  }
  if (opts == null ? void 0 : opts.mb) {
    fmt2.push(`margin-bottom: ${opts.mb}`);
  }
  if (opts == null ? void 0 : opts.mt) {
    fmt2.push(`margin-top: ${opts.mt}`);
  }
  if (opts == null ? void 0 : opts.my) {
    fmt2.push(`margin-top: ${opts.mx}`);
    fmt2.push(`margin-bottom: ${opts.mx}`);
  }
  if (opts == null ? void 0 : opts.mx) {
    fmt2.push(`margin-left: ${opts.mx}`);
    fmt2.push(`margin-right: ${opts.mx}`);
  }
  if (opts == null ? void 0 : opts.ml) {
    fmt2.push(`margin-left: ${opts.ml}`);
  }
  if (opts == null ? void 0 : opts.mr) {
    fmt2.push(`margin-right: ${opts.mr}`);
  }
  if (opts == null ? void 0 : opts.bespoke) {
    fmt2.push(...opts.bespoke);
  }
  if (opts == null ? void 0 : opts.w) {
    fmt2.push(`weight: ${opts.w}`);
  }
  if (opts == null ? void 0 : opts.fw) {
    fmt2.push(`font-weight: ${opts.fw}`);
  }
  if (opts == null ? void 0 : opts.fs) {
    fmt2.push(`font-style: ${opts.fs}`);
  }
  if (opts == null ? void 0 : opts.ts) {
    switch (opts.ts) {
      case "xs":
        fmt2.push(`font-size: 0.75rem`);
        fmt2.push(`line-height: 1rem`);
        break;
      case "sm":
        fmt2.push(`font-size: 0.875rem`);
        fmt2.push(`line-height: 1.25rem`);
        break;
      case "base":
        fmt2.push(`font-size: 1rem`);
        fmt2.push(`line-height: 1.5rem`);
        break;
      case "lg":
        fmt2.push(`font-size: 1.125rem`);
        fmt2.push(`line-height: 1.75rem`);
        break;
      case "xl":
        fmt2.push(`font-size: 1.25rem`);
        fmt2.push(`line-height: 1.75rem`);
        break;
      case "2xl":
        fmt2.push(`font-size: 1.5rem`);
        fmt2.push(`line-height: 2rem`);
        break;
      default:
        fmt2.push(`font-size: ${opts.ts}`);
        fmt2.push(`line-height: auto`);
    }
  }
  if (opts == null ? void 0 : opts.flex) {
    fmt2.push(`display: flex`);
  }
  if (opts == null ? void 0 : opts.direction) {
    fmt2.push(`flex-direction: ${opts.direction}`);
  }
  if (opts == null ? void 0 : opts.grow) {
    fmt2.push(`flex-grow: ${opts.grow}`);
  }
  if (opts == null ? void 0 : opts.gap) {
    fmt2.push(`gap: ${opts.gap}`);
  }
  if (opts == null ? void 0 : opts.cursor) {
    fmt2.push(`cursor: ${opts.cursor}`);
  }
  if (opts == null ? void 0 : opts.alignItems) {
    fmt2.push(`align-items: ${opts.alignItems}`);
  }
  if (opts == null ? void 0 : opts.justifyItems) {
    fmt2.push(`justify-items: ${opts.justifyItems}`);
  }
  if (opts == null ? void 0 : opts.justifyContent) {
    fmt2.push(`justify-content: ${opts.justifyContent}`);
  }
  if (opts == null ? void 0 : opts.position) {
    fmt2.push(`position: ${opts.position}`);
  }
  if (opts == null ? void 0 : opts.display) {
    fmt2.push(`display: ${opts.display}`);
  }
  if (opts == null ? void 0 : opts.opacity) {
    fmt2.push(`opacity: ${opts.opacity}`);
  }
  return fmt2.length === 0 ? `style=""` : `style="${fmt2.join("; ")}"`;
};
const listStyle = (opts = {}) => {
  let fmt2 = [];
  if ((opts == null ? void 0 : opts.indentation) && opts.indentation !== "default") {
    switch (opts.indentation) {
      case "24px":
        fmt2.push(`padding-inline-start: 24px`);
        break;
      case "20px":
        fmt2.push(`padding-inline-start: 20px`);
        break;
      case "16px":
        fmt2.push(`padding-inline-start: 16px`);
        break;
      case "12px":
        fmt2.push(`padding-inline-start: 12px`);
        break;
      case "none":
        fmt2.push(`padding-inline-start: 0px`);
        break;
    }
  }
  if ((opts == null ? void 0 : opts.mt) && opts.mt !== "default") {
    fmt2.push(`margin-block-start: ${opts.mt === "tight" ? "2px" : opts.mt === "none" ? "0px" : opts.mt === "spaced" ? "1.5rem" : opts.mt}`);
  }
  if ((opts == null ? void 0 : opts.mb) && opts.mb !== "default") {
    fmt2.push(`margin-block-end: ${opts.mb === "tight" ? "2px" : opts.mb === "none" ? "0px" : opts.mb === "spaced" ? "1.5rem" : opts.mb}`);
  }
  if ((opts == null ? void 0 : opts.my) && opts.my !== "default") {
    fmt2.push(`margin-block-start: ${opts.my === "tight" ? "2px" : opts.my === "none" ? "0px" : opts.my === "spaced" ? "1.5rem" : opts.my}`);
    fmt2.push(`margin-block-end: ${opts.my === "tight" ? "2px" : opts.my === "none" ? "0px" : opts.my === "spaced" ? "1.5rem" : opts.my}`);
  }
  return fmt2.length === 0 ? `style=""` : `style="${fmt2.join("; ")}"`;
};
const obsidian_blockquote = (kind, title, opts) => [
  `<div data-callout-metadata="" data-callout-fold="${(opts == null ? void 0 : opts.fold) || ""}" data-callout="${kind}" class="callout" ${style$1((opts == null ? void 0 : opts.style) || {})}>`,
  `<div class="callout-title" style="gap:15px; align-items: center">`,
  ...(opts == null ? void 0 : opts.icon) ? [`<div class="callout-icon">${opts == null ? void 0 : opts.icon}</div>`] : [],
  `<div class="callout-title-inner" style="display: flex; flex-direction: row;">${title}</div>`,
  ...(opts == null ? void 0 : opts.toRight) ? [
    `<div class="callout-title-right" style="display: flex; flex-grow: 1; justify-content: right">${opts.toRight}</div>`
  ] : [],
  `</div>`,
  ...(opts == null ? void 0 : opts.content) ? typeof opts.content === "string" ? [
    `<div class="callout-content" ${style$1(opts.contentStyle || {})}>`,
    `<p>${opts.content}</p>`,
    `</div>`
  ] : [
    `<div class="callout-content" style="display: flex; flex-direction: column; space-between: 4px;">`,
    ...opts.content.map((c) => `<div class="content-element" ${style$1({ flex: true, ...opts.contentStyle || {} })}>${c}</div>`),
    `</div>`
  ] : [],
  ...(opts == null ? void 0 : opts.belowTheFold) ? [`<div class="below-the-fold" ${style$1((opts == null ? void 0 : opts.belowTheFoldStyle) || {})}>${opts == null ? void 0 : opts.belowTheFold}</div>`] : [""],
  `</div>`
].filter((i) => i).join("\n");
const empty_callout = (fmt2) => [
  `<div class="callout" ${style$1(fmt2)}>`,
  `<div class="callout-title">&nbsp;</div>`,
  `<div class="callout-content">&nbsp;</div>`,
  `</div>`
].join("\n");
const blockquote$1 = (kind, title, opts) => {
  const iconLookup = {
    warning: WARN_ICON,
    quote: QUOTE_ICON,
    info: INFO_ICON,
    tip: TIP_ICON,
    summary: SUMMARY_ICON,
    bug: BUG_ICON,
    example: EXAMPLE_ICON,
    question: QUESTION_ICON,
    success: SUCCESS_ICON,
    error: ERROR_ICON,
    note: NOTE_ICON
  };
  return obsidian_blockquote(
    kind,
    title,
    (opts == null ? void 0 : opts.icon) && opts.icon in iconLookup ? { ...opts, icon: iconLookup[opts.icon] } : opts
  );
};
const list_items_api = (wrapper) => ({
  indent: (...items) => render_list_items(wrapper, items),
  done: createFnWithProps(() => "", { escape: true })
});
const wrap_ol = (items, opts) => `<ol ${listStyle(opts)}>${items}</ol>`;
const wrap_ul = (items, opts) => `<ul ${listStyle(opts)}>${items}</ul>`;
const render_list_items = (wrapper, items, opts) => wrapper(
  items.filter((i) => i !== void 0).map((i) => isFunction$2(i) ? isFunction$2(i(list_items_api)) ? "" : i(list_items_api) : `<li ${style$1((opts == null ? void 0 : opts.li) ? isFunction$2(opts == null ? void 0 : opts.li) ? opts.li(i ? i : "") : opts.li : {})}>${i}</li>`).filter((i) => i !== "").join("\n"),
  opts
);
const span = (text2, fmt2) => {
  return `<span ${style$1(fmt2 || { fw: "400" })}>${text2}</span>`;
};
const italics = (text2, fmt2) => {
  return `<span ${style$1({ ...fmt2 || { fw: "400" }, fs: "italic" })}>${text2}</span>`;
};
const bold = (text2, fmt2) => {
  return `<span ${style$1({ ...fmt2 || {}, fw: "700" })}>${text2}</span>`;
};
const light = (text2, fmt2) => {
  return `<span ${style$1({ ...fmt2 || {}, fw: "300" })}>${text2}</span>`;
};
const thin = (text2, fmt2) => {
  return `<span ${style$1({ ...fmt2 || {}, fw: "100" })}>${text2}</span>`;
};
const medium = (text2, fmt2) => {
  return `<span ${style$1({ ...fmt2 || {}, fw: "500" })}>${text2}</span>`;
};
const normal = (text2, fmt2) => {
  return `<span ${style$1({ ...fmt2 || {}, fw: "400" })}>${text2}</span>`;
};
const fmt = (p2) => (container, filePath) => ({
  async ul(...items) {
    return p2.dv.renderValue(
      render_list_items(wrap_ul, items),
      container,
      p2,
      filePath,
      false
    );
  },
  /**
   * Uses the underlying `renderValue()` functionality exposed by
   * dataview to render data to the page.
   */
  async render(data2) {
    await p2.dv.renderValue(data2, container, p2, filePath, false);
  },
  /**
   * returns the HTML for an unordered list but doesn't render
   */
  html_ul(items, opts) {
    return render_list_items(wrap_ul, items.filter((i) => i !== void 0), opts);
  },
  async ol(...items) {
    return p2.dv.renderValue(
      render_list_items(wrap_ol, items),
      container,
      p2,
      filePath,
      false
    );
  },
  code: (code2) => p2.dv.renderValue(
    `<code>${code2}</code>`,
    container,
    p2,
    filePath,
    true
  ),
  /**
   * **renderToRight**`(text)`
   * 
   * Takes text/html and renders it to the right.
   * 
   * Note: use `toRight` just to wrap this text in the appropriate HTML
   * to move content to right.
   */
  renderToRight: (text2) => p2.dv.renderValue(
    `<span class="to-right" style="display: flex; flex-direction: row; width: auto;"><span class="spacer" style="display: flex; flex-grow: 1">&nbsp;</span><span class="right-text" style: "display: flex; flex-grow: 0>${text2}</span></span>`,
    container,
    p2,
    filePath,
    true
  ),
  toRight: (content2, fmt2) => {
    const html = [
      `<div class="wrapper-to-right" style="display: relative">`,
      `<span class="block-to-right" style="position: absolute; right: 0">`,
      `<span ${style$1({ ...fmt2, position: "relative" })}>`,
      content2,
      `</span>`,
      `</div>`
    ].join("\n");
    return html;
  },
  /**
   * Adds an HTML link tag `<a></a>` to an internal resource in the vault.
   * 
   * Note: for external links use the `link` helper instead as the generated link
   * here provides the reference as meta-data other then the traditional `href` 
   * property.
   */
  internalLink: (ref, opt2) => {
    const link2 = (href, title) => `<a data-tooltip-position="top" aria-label="${href}" data-href="${href}" class="internal-link data-link-icon data-link-text" _target="_blank" rel="noopener" data-link-path="${href}" style="">${title}</a>`;
    return isDvPage(ref) ? link2(ref.file.path, (opt2 == null ? void 0 : opt2.title) || ref.file.name) : isLink(ref) ? link2(ref.path, (opt2 == null ? void 0 : opt2.title) || (ref == null ? void 0 : ref.hover) || "link") : "";
  },
  /**
   * Add a span element with optional formatting
   */
  span,
  italics,
  bold,
  light,
  thin,
  medium,
  normal,
  /**
   * Wrap children items with DIV element; gain formatting control for block
   */
  wrap: (children2, fmt2) => {
    return [
      `<div class="wrapped-content" ${style$1(fmt2 || {})}>`,
      ...children2.filter((i) => i !== void 0),
      `</div>`
    ].join("\n");
  },
  link: (title, url, opts) => {
    return [
      `<a href="${url}" >`,
      ...(opts == null ? void 0 : opts.iconUrl) || (opts == null ? void 0 : opts.svgInline) ? (opts == null ? void 0 : opts.titlePosition) === "top" ? [
        normal(title)
      ] : [
        `<span class="grouping" ${style$1((opts == null ? void 0 : opts.style) || { alignItems: "center", flex: true })}>`,
        (opts == null ? void 0 : opts.iconUrl) ? `<img src="${opts.iconUrl}" style="padding-right: 4px">` : opts == null ? void 0 : opts.svgInline,
        normal(title),
        `</span>`
      ] : [
        normal(title)
      ],
      `</a>`
    ].join("\n");
  },
  /**
   * **as_tag**`(text)`
   * 
   * Puts the provided text into a _code block_ and ensures that the
   * leading character is a `#` symbol.
   */
  as_tag: (text2) => `<code class="tag-reference">${ensureLeading(text2, "#")}</code>`,
  inline_codeblock: (text2) => `<code class="inline-codeblock" style="display: flex; flex-direction: row;">${text2}</code>`,
  /**
   * **blockquote**`(kind, title, opts)`
   * 
   * Produces the HTML for a callout.
   * 
   * **Note:** use `callout` for same functionality but 
   * with HTML _rendered_ rather than _returned_.
   */
  blockquote: (kind, title, opts) => blockquote$1(kind, title, opts),
  /**
   * **callout**`(kind, title, opts)`
   * 
   * Renders a callout to the current block.
   * 
   * **Note:** use `blockquote` for same functionality but 
   * with HTML returned rather than _rendered_.
   */
  callout: (kind, title, opts) => p2.dv.renderValue(
    blockquote$1(kind, title, opts),
    container,
    p2,
    filePath,
    false
  ),
  empty_callout
});
const DEFAULT_LINK = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="#a3a3a3" d="M134.71 189.19a4 4 0 0 1 0 5.66l-9.94 9.94a52 52 0 0 1-73.56-73.56l24.12-24.12a52 52 0 0 1 71.32-2.1a4 4 0 1 1-5.32 6A44 44 0 0 0 81 112.77l-24.13 24.12a44 44 0 0 0 62.24 62.24l9.94-9.94a4 4 0 0 1 5.66 0Zm70.08-138a52.07 52.07 0 0 0-73.56 0l-9.94 9.94a4 4 0 1 0 5.71 5.68l9.94-9.94a44 44 0 0 1 62.24 62.24L175 143.23a44 44 0 0 1-60.33 1.77a4 4 0 1 0-5.32 6a52 52 0 0 0 71.32-2.1l24.12-24.12a52.07 52.07 0 0 0 0-73.57Z"/></svg>`;
const isKeyOf = (container, key) => {
  return isContainer$1(container) && (isString$2(key) || isNumber$2(key)) && key in container ? true : false;
};
function extractTitle(s2) {
  return s2 && typeof s2 === "string" ? s2.replace(/\d{0,4}-\d{2}-\d{2}\s*/, "") : s2;
}
function get_classification(pg) {
  if (pg === void 0) {
    return { isCategory: false, isSubcategory: false, category: void 0, subcategory: void 0 };
  }
  const directCat = pg.file.etags.find(
    (t) => t == null ? void 0 : t.startsWith(`#category/`)
  );
  const directSubCat = pg.file.etags.find(
    (t) => t == null ? void 0 : t.startsWith(`#subcategory/`)
  );
  const indirectCat = pg.file.etags.find(
    (t) => (t == null ? void 0 : t.split("/").length) > 2 && (t == null ? void 0 : t.split("/")[1]) === "category"
  );
  const indirectSubCat = pg.file.etags.find(
    (t) => (t == null ? void 0 : t.split("/").length) > 2 && t.split("/")[1] === "subcategory"
  );
  const kindedPage = pg.file.etags.find(
    (t) => (t == null ? void 0 : t.split("/").length) > 1 && !["#category", "#subcategory"].includes(t.split("/")[0]) && !["category", "subcategory"].includes(t.split("/")[1])
  );
  return directCat ? {
    isCategory: true,
    isSubcategory: false,
    category: directCat.split("/")[1],
    subcategory: void 0
  } : directSubCat ? {
    isCategory: false,
    isSubcategory: true,
    category: directSubCat.split("/")[1],
    subcategory: directSubCat.split("/")[2]
  } : indirectCat ? {
    isCategory: true,
    isSubcategory: false,
    category: indirectCat.split("/")[2],
    subcategory: void 0
  } : indirectSubCat ? {
    isCategory: false,
    isSubcategory: true,
    category: indirectSubCat.split("/")[2],
    subcategory: indirectSubCat.split("/")[3]
  } : kindedPage ? {
    isCategory: false,
    isSubcategory: false,
    category: kindedPage.split("/")[1],
    subcategory: kindedPage.split("/")[2]
  } : {
    isCategory: false,
    isSubcategory: false,
    category: void 0,
    subcategory: void 0
  };
}
function removePound(tag) {
  return typeof tag === "string" && (tag == null ? void 0 : tag.startsWith("#")) ? tag.slice(1) : tag;
}
const extractPath = (path) => {
  return isDvPage(path) ? path.file.path : isLink(path) ? path.path : isString$2(path) ? path : Never$1;
};
const isKindedPage = (plugin4) => (pg, category, subcategory) => {
  var _a2, _b2, _c2, _d2;
  return isUndefined$1(pg) ? false : get_classification(pg).isCategory === false && get_classification(pg).isSubcategory === false && !pg.file.etags.find((i) => i.startsWith("#kind")) ? isUndefined$1(category) ? true : pg.category ? ((_b2 = (_a2 = plugin4.dv.page(pg.category)) == null ? void 0 : _a2.file) == null ? void 0 : _b2.path) === extractPath(category) ? isUndefined$1(subcategory) ? true : pg.subcategory && ((_d2 = (_c2 = plugin4.dv.page(pg.subcategory)) == null ? void 0 : _c2.file) == null ? void 0 : _d2.path) === extractPath(subcategory) : false : false : false;
};
function isKindDefnPage(pg) {
  return isUndefined$1(pg) ? false : pg.file.etags.find((t) => t.startsWith(`#kind/`));
}
const get_kind_prop = (p2) => (pg) => {
  if (!pg) {
    return { kind: void 0, tag: void 0 };
  }
  if (!isDvPage(pg)) {
    return get_kind_prop(p2)(p2.dv.page(pg));
  } else {
    let [_, kind] = get_prop(p2)(pg, "kind");
    return isDvPage(kind) ? {
      kind,
      tag: get_kind_tag(p2)(kind)
    } : {
      kind: {},
      tag: void 0
    };
  }
};
const get_kind_tag = (p2) => (pg) => {
  var _a2, _b2;
  return pg.file.etags.find((i) => i == null ? void 0 : i.startsWith(`#kind/`)) ? (_a2 = pg.file.etags.find((i) => i == null ? void 0 : i.startsWith(`#kind/`))) == null ? void 0 : _a2.split("/")[1] : removePound(
    (_b2 = pg.file.etags.find(
      (t) => !t.startsWith("#category") && !t.startsWith("#subcategory") && !(t.split("/")[1] === "category" || t.split("/")[1] === "subcategory")
    )) == null ? void 0 : _b2.split("/")[0]
  ) || get_kind_prop(p2)(pg).tag || "unknown";
};
const get_internal_links = (p2) => (pg, ...props) => {
  let links = [];
  for (const prop of props) {
    const pgProp = pg[prop];
    if (!pgProp) {
      break;
    }
    if (Array.isArray(pgProp)) {
      links = [...links, ...pgProp.filter((i) => isLink(i))];
    } else if (isLink(pgProp)) {
      links.push(pgProp);
    } else if (isDvPage(pgProp)) {
      links.push(pgProp.file.link);
    }
  }
  return links;
};
function show_tags(pg, ...exclude) {
  return pg.file.etags.filter((t) => !exclude.some((i) => t.startsWith(i) ? true : false)).map((t) => `\`${t}\``).join(", ") || "";
}
const show_links = (p2, icons) => (pg) => {
  const [_, pageIcon] = get_prop(p2)(pg, "icon", "svg_icon", "_icon", "_svg_icon");
  const link_props = {
    website: "website",
    wikipedia: "wikipedia",
    company: "company",
    retailer: "company",
    docs: "documentation",
    retail_urls: "retail",
    retail: "retail",
    url: "link",
    repo: "repo",
    review: "review",
    reviews: "review",
    blog: "blog",
    api: "api",
    map: "map",
    place: "pin",
    home: "home",
    office: "office",
    offices: "office",
    work: "office",
    employer: "office",
    playground: "playground",
    demo: "playground",
    support: "support",
    help: "support"
  };
  const create_lnk = (icon, url, prop) => {
    icon = prop === "website" && isString$2(pageIcon) ? pageIcon : /youtube.com/.test(url) ? "you_tube" : icon;
    p2.debug(prop, pageIcon);
    return `<a href="${url}" data-href="${url}" alt="${prop}" style="display: flex; align-items: baseline; padding-right: 2px" data-tooltip-position="top"><span class="link-icon" style="display: flex;width: auto; max-width: 24px; max-height: 24px; height: 24px">${icon}</span></a>`;
  };
  const links = [];
  for (const prop of keysOf(pg)) {
    if (prop in pg && isString$2(pg[prop])) {
      if (Array.isArray(pg[prop])) {
        pg[prop].forEach((p22) => {
          if (isString$2(p22) && /^http/.test(p22)) {
            links.push([prop, p22]);
          }
        });
      } else if (isString$2(pg[prop]) && !prop.startsWith("_") && /^http/.test(pg[prop])) {
        links.push([prop, pg[prop]]);
      }
    }
  }
  const prettify = (tuple) => {
    const [prop, url] = tuple;
    if (prop in link_props) {
      if (link_props[prop] in icons) {
        return create_lnk(icons[link_props[prop]], url, prop);
      } else {
        return create_lnk(DEFAULT_LINK, url, prop);
      }
    } else {
      return create_lnk(DEFAULT_LINK, url, prop);
    }
  };
  return `<span style='display: flex; flex-direction: row;'>${links.map(prettify).join(" ")}</span>`;
};
const get_prop = (plugin4) => (pg, ...props) => {
  var _a2;
  if (!((_a2 = pg == null ? void 0 : pg.file) == null ? void 0 : _a2.name)) {
    plugin4.error(`Call to get_prop(pg) passed in an invalid DvPage`, { pg, props });
    return [void 0, void 0];
  }
  const found = props.find((prop) => isKeyOf(pg, prop) && pg[prop] !== void 0);
  if (!found) {
    return [void 0, void 0];
  } else {
    const value2 = pg[found];
    return [
      found,
      isLink(value2) ? plugin4.dv.page(value2) : Array.isArray(value2) ? value2.map((i) => isLink(i) ? plugin4.dv.page(i) : i) : value2
    ];
  }
};
const show_prop = (plugin4) => (pg, ...props) => {
  var _a2;
  if (!((_a2 = pg == null ? void 0 : pg.file) == null ? void 0 : _a2.name)) {
    throw new Error(`Attempt to call get_prop(pg, ${props.join(", ")}) with an invalid page passed in!`);
  }
  const found = props.find((prop) => isKeyOf(pg, prop) && pg[prop] !== void 0);
  if (!found) {
    return "";
  }
  if (isKeyOf(pg, found)) {
    const value2 = pg[found];
    try {
      return isString$2(value2) ? value2 : isLink(value2) ? value2 : isDvPage(value2) ? value2.file.link : isArray(value2) ? value2.map((v) => isLink(v) ? v : isDvPage(v) ? v.file.link : "").filter((i) => i).join(", ") : "";
    } catch (e) {
      plugin4.error(`Ran into problem displaying the "${found}" property on the page "${pg.file.path}" passed in while calling show_prop().`, e);
      return "";
    }
  }
};
function show_created_date(pg, format2) {
  return format2 ? pg.file.cday.toFormat(format2) : pg.file.cday;
}
function show_modified_date(pg, format2) {
  return format2 ? pg.file.mday.toFormat(format2) : pg.file.mday;
}
const when = (_p2) => (pg, format2 = "LLL yyyy") => {
  if (pg) {
    const created = pg.file.cday;
    const modified = pg.file.mday;
    const deltaCreated = Math.abs(created.diffNow("days").days);
    const deltaModified = Math.abs(modified.diffNow("days").days);
    if (deltaCreated < 14) {
      const desc = created.toRelative();
      return `<span style="cursor: default"><i style="font-weight: 150">created</i> ${desc}</span>`;
    } else if (deltaModified < 14) {
      const desc = modified.toRelative();
      return `<span style="cursor: default"><i style="font-weight: 150">modified</i> ${desc}</span>`;
    } else {
      return `<span style="cursor: default">${modified.toFormat(format2)}</span>`;
    }
  } else {
    return "";
  }
};
const show_subcategories_for = (plg) => (pg) => {
  if (!pg) {
    return [];
  }
  if (get_classification(pg).isCategory) {
    const kindTag = get_kind_tag(plg)(pg);
    const category = get_classification(pg).category;
    const query2 = kindTag ? `#${kindTag}/subcategory/${category} OR #subcategory/${category}` : `#subcategory/${category}`;
    return plg.dv.pages(query2).map((i) => i.file.link);
  } else {
    return [];
  }
};
const dv_page = (plugin4) => (source, container, component, filePath) => {
  const current = plugin4.dv.page(filePath);
  if (!current) {
    throw new Error(`Attempt to initialize dv_page() with an invalid sourcePath: ${filePath}!`);
  }
  const linkIcons = plugin4.dv.page("Link Icons") || {};
  const metadata = () => {
  };
  return {
    /** the current page represented as a `DvPage` */
    current,
    /**
     * The designated page for _link icons_
     */
    linkIcons,
    /**
     * simply utility to ensure that a tag string has it's 
     * leading pound symbol removed.
     */
    removePound,
    /**
     * **get_kind_tag**`(page)`
     * 
     * Determines what the "kind tag" is for the passed in page:
     * 
     * - on a kind definition page of `#kind/foo` it returns "foo"
     * - on a _kinded_ page like `#foo` or `#foo/cat/subCat` it also
     * return "foo"
     * - on a category or subcategory page this will pickup two
     * variants:
     *   - **explicit** such as `#foo #category/uno`
     *   - **implicit** such as `#foo/category/uno`
     * - right now it does not consider the possibility of multiple
     * _kinds_ associated to a category/subcategory
     */
    get_kind_tag: get_kind_tag(plugin4),
    /**
     * **extractTitle**`(fileName)`
     * 
     * Simple utility meant to remove a leading date of the form YYYY-MM-DD from
     * a page's name to get more of a "title".
     */
    extractTitle,
    /**
     * **get_classification**`(page)`
     * 
     * Gets a page's classification {`isCategory`,`isSubcategory`,`category`,`subcategory`}
     */
    get_classification,
    // adds classification properties for current page
    ...get_classification(current),
    /**
     * **show_tags**`(page, ...exclude)`
     * 
     * Create a list of tags on a given `page` (with any exclusions you'd like to add).
     */
    show_tags,
    /**
     * **get_prop**`(page, prop, ...fallbacks) → [prop, value]` 
     * 
     * Returns the contents of a given page's property. If that property is
     * a link or an array of links then the property is converted to a 
     * `DvPage`.
     * 
     * ```ts
     * const [prop, val] = get_prop(pg, "kind");
     * ```
     */
    get_prop: get_prop(plugin4),
    /**
     * **get_kind_prop**`(page) → [page, tag]`
     * 
     * Gets the `kind` property on a given page. If the property was
     * a `Link` then it will be upgraded to a `DvPage`.
     * 
     * What is returned is a tuple containing the property value (if set)
     * as the first element and the "kindTag" (aka, tag name without leading
     * pound symbol) as the second.
     */
    get_kind_prop: get_kind_prop(plugin4),
    /**
     * **get_internal_links**
     * 
     * Gets any links to pages in the vault found across the various 
     * properties passed in.
     */
    get_internal_links: get_internal_links(),
    /**
     * **metadata**`()`
     * 
     * Provides a dictionary of key/values where:
     * - the keys are an element in the `PropertyType` union
     * - the values -- where defined -- are an array of Frontmatter keys which
     * are of the given type.
     */
    metadata,
    /**
     * **show_prop**`(page, prop, ...fallbacks)`
     * 
     * Show a property on the passed in page (optionally including _fallback_ properties to
     * find a value). If nothing is found across the relevant properties an empty string is
     * returned. 
     */
    show_prop: show_prop(plugin4),
    /**
     * **show_desc**`()`
     * 
     * Looks for a description in all common _description_
     * properties
     */
    show_desc: (pg) => {
      const desc = show_prop(plugin4)(pg, "about", "desc", "description");
      if (typeof desc == "string") {
        return `<span style="font-weight:200; font-size: 14px">${desc}</span>`;
      } else {
        return "";
      }
    },
    /**
     * **show_links**`(page)`
     * 
     * Shows a horizontal row of links that the given page has in it's frontmatter.
     */
    show_links: show_links(plugin4, linkIcons),
    /**
     * **show_created_date**`(page,[format])`
     * 
     * Shows the date a given page was created; optionally allowing 
     * you to specify the 
     * [Luxon format](https://github.com/moment/luxon/blob/master/docs/formatting.md#table-of-tokens) as a string.
     */
    show_created_date,
    /**
     * **show_modified_date**`(page,[format])`
     * 
     * Shows the date a given page was modified; optionally allowing 
     * you to specify the 
     * [Luxon format](https://github.com/moment/luxon/blob/master/docs/formatting.md#table-of-tokens) as a string.
     */
    show_modified_date,
    /**
     * **show_when**`(page,[format])`
     * 
     * A smart date format that considers recency
     * of both modified and created dates and displays
     * a compact but meaningful date.
     */
    show_when: when(),
    /** 
     * The current page's "kind tag"
     */
    kind_tag: get_kind_tag(plugin4)(current),
    /**
     * **isKindedPage**(page,[category])
     * 
     * Tests whether a given page is a _kinded_ page and _optionally_ if
     * the page is of a particular `category`.
     */
    isKindedPage: isKindedPage(plugin4),
    /**
     * **isKindDefnPage**(page)
     * 
     * Tests whether a given page is a _kind definition_ page.
     */
    isKindDefnPage,
    /**
     * **page**`(path, [originFile])`
     * 
     * Map a page path to the actual data contained within that page.
     */
    page(pg, originFile) {
      return plugin4.dv.page(pg, originFile);
    },
    pages(query2, originFile) {
      return plugin4.dv.pages(query2, originFile);
    },
    /**
     * **as_array**`(v)`
     * 
     * Utility function which ensures that the passed in value _is_ an array,
     * and that any DvArray[] proxy is converted to a normal JS array
     */
    as_array: (v) => {
      return plugin4.dv.isDataArray(v) ? Array.from(v.values) : isArray(v) ? v.map((i) => plugin4.dv.isDataArray(i) ? i.values : i) : [v];
    },
    /**
     * Return an array of paths (as strings) corresponding to pages 
     * which match the query.
     */
    pagePaths(query2, originFile) {
      return plugin4.dv.pagePaths(query2, originFile);
    },
    /**
     * **date**`(pathLike)`
     * 
     * Attempt to extract a date from a string, link or date.
     */
    date(pathLike) {
      return plugin4.dv.date(pathLike);
    },
    /**
     * **duration**`(pathLike)`
     * 
     * Attempt to extract a duration from a string or duration.
     */
    duration(str) {
      return plugin4.dv.duration(str);
    },
    /**
     * **createFileLink**`(pathLike,[embed],[display])`
     * 
     * A convenience method that can receive multiple inputs and 
     * convert them into a `FileLink`.
     */
    createFileLink(pathLike, embed, display) {
      if (isLink(pathLike)) {
        const pg = plugin4.dv.page(pathLike.path);
        if (!pg) {
          plugin4.error(`createFileLink() had issues creating a link from the passed in parameters`, { pathLike, embed, display });
          return "";
        }
        return plugin4.dv.fileLink(
          pg.file.path,
          isUndefined$1(embed) ? false : embed,
          isUndefined$1(display) ? extractTitle(pg.file.name) : display
        );
      } else if (isDvPage(pathLike)) {
        return plugin4.dv.fileLink(
          pathLike.file.path,
          isUndefined$1(embed) ? false : embed,
          isUndefined$1(display) ? extractTitle(pathLike.file.name) : display
        );
      } else if (isString$2(pathLike)) {
        const pg = plugin4.dv.page(pathLike);
        if (!pg) {
          plugin4.error(`createFileLink() had issues creating a link from the passed in string path`, { pathLike, embed, display });
          return "";
        }
        return plugin4.dv.fileLink(
          pg.file.path,
          isUndefined$1(embed) ? false : embed,
          isUndefined$1(display) ? extractTitle(pg.file.name) : display
        );
      }
    },
    /**
     * **fileLink**`(path, [embed],[display])`
     * 
     * Create a dataview file link to the given path.
     */
    fileLink(path, embed, displayAs) {
      return plugin4.dv.fileLink(path, embed, displayAs);
    },
    /**
     * **sectionLink**`(path, [embed],[display])`
     * 
     * Create a dataview section link to the given path.
     */
    sectionLink(path, embed, display) {
      return plugin4.dv.sectionLink(path, embed, display);
    },
    /**
     * **blockLink**`(path, [embed],[display])`
     * 
     * Create a dataview block link to the given path.
     */
    blockLink(path, embed, display) {
      return plugin4.dv.blockLink(path, embed, display);
    },
    /**
     * **table**`(headers,values,container,component,filePath)`
     * 
     * Render a dataview table with the given headers, and the 
     * 2D array of values.
     */
    async table(headers, values) {
      return plugin4.dv.table(headers, values, container, plugin4, filePath);
    },
    /**
     * **renderValue**`(value, [inline])`
     * 
     * Render an arbitrary value into a container.
     */
    async renderValue(value2, inline4 = false) {
      return plugin4.dv.renderValue(value2, container, plugin4, filePath, inline4);
    },
    /** 
     * **taskList**`(tasks,groupByFile)`
     * 
     * Render a dataview task view with the given tasks. 
     */
    async taskList(tasks, groupByFile) {
      return plugin4.dv.taskList(tasks, groupByFile, container, plugin4, filePath);
    },
    /**
     * **list**(values, container, component, filePath)
     * 
     * Render a dataview **list** of the given values by:
     * 
     * - adding a sub-container DIV to the passed in _container_
     * - using the `component`'s `addChild()` method to 
     * adding a child element which is given the sub-container
     * for rendering purposes
     */
    async list(values) {
      return plugin4.dv.list(values, container, plugin4, filePath);
    },
    async paragraph(text2) {
      return plugin4.dv.renderValue(text2, container, plugin4, filePath, false);
    },
    /**
     * **show_subcategories_for**`(page)`
     * 
     * Intended for category pages to be passed in and in return
     * will get a `DataArray<Link>` as response.
     */
    show_subcategories_for: show_subcategories_for(plugin4),
    async ul(...items) {
      const wrap_ul2 = (items2) => `<ul>${items2}</ul>`;
      const render_items = (items2) => items2.map((i) => isFunction$2(i) ? isFunction$2(i(ul_api)) ? "" : i(ul_api) : `<li>${i}</li>`).filter((i) => i !== "").join("\n");
      const ul_api = {
        indent: (...items2) => wrap_ul2(render_items(items2)),
        done: createFnWithProps(() => "", { escape: true })
      };
      return plugin4.dv.renderValue(
        wrap_ul2(render_items(items)),
        container,
        plugin4,
        filePath,
        false
      );
    },
    fmt: fmt(plugin4)(container, filePath)
  };
};
const back_links = (plg) => (source, container, component, filePath) => async (params_str = "") => {
  const {
    current,
    kind_tag,
    page,
    isCategory,
    isSubcategory,
    isKindedPage: isKindedPage2,
    isKindDefnPage: isKindDefnPage2,
    fmt: fmt2,
    ul,
    paragraph: paragraph2,
    category,
    table: table3,
    show_subcategories_for: show_subcategories_for2,
    get_classification: get_classification2,
    get_prop: get_prop2,
    createFileLink,
    show_links: show_links2,
    show_prop: show_prop2,
    show_created_date: show_created_date2,
    get_kind_prop: get_kind_prop2,
    show_modified_date: show_modified_date2,
    renderValue,
    subcategory
  } = plg.api.dv_page(source, container, component, filePath);
  const links = current.file.inlinks.sort((p2) => {
    var _a2;
    return (_a2 = page(p2)) == null ? void 0 : _a2.file.name;
  }).where((p2) => {
    var _a2;
    return ((_a2 = page(p2)) == null ? void 0 : _a2.file.path) !== current.file.path;
  });
  if (isCategory) {
    const subCategories = links.where(
      (p2) => {
        var _a2, _b2;
        return get_classification2(page(p2)).isSubcategory === true && ((_b2 = (_a2 = page(p2)) == null ? void 0 : _a2.category) == null ? void 0 : _b2.path) === current.file.path && !isKindedPage2(page(p2));
      }
    );
    const kindPages = links.where(
      (p2) => {
        var _a2;
        return isKindedPage2(page(p2)) && ((_a2 = get_classification2(page(p2))) == null ? void 0 : _a2.category) === category;
      }
    );
    const otherPages = links.where(
      (p2) => {
        var _a2, _b2;
        return !isKindedPage2(page(p2), current) && !(((_a2 = get_classification2(page(p2))) == null ? void 0 : _a2.isSubcategory) || ((_b2 = get_classification2(page(p2))) == null ? void 0 : _b2.category) === category);
      }
    );
    if (subCategories.length > 0) {
      fmt2.callout("info", "Subcategories", {
        style: {
          mt: "1rem",
          mb: "1rem"
        },
        content: `subcategory pages which are part of the ${fmt2.bold(category || "")} ${fmt2.italics("category")}.`
      });
      table3(
        ["Page", "Created", "Modified", "Desc", "Links"],
        subCategories.map((p2) => {
          const pg = page(p2);
          return [
            createFileLink(pg),
            show_created_date2(pg, "DD"),
            show_modified_date2(pg, "DD"),
            show_prop2(pg, "desc", "description", "about"),
            show_links2(pg)
          ];
        })
      ).catch((e) => plg.error(`Problems rendering subcategories table`, e));
    } else {
      ul(
        `no subcategories found for this category page`,
        `to be listed a page would need one of the following tags:`,
        (l2) => l2.indent(
          `\`#subcategory/${category}/[subcategory]\`, `,
          `\`#${kind_tag}/subcategory/${category}/[subcategory]`
        )
      );
    }
    if (kindPages.length > 0) {
      fmt2.callout("info", "Kinded Pages", {
        style: {
          mt: "1rem",
          mb: "1rem"
        },
        content: `pages that are kinded as ${fmt2.bold(kind_tag || "")} ${fmt2.italics("and")} are part of the ${fmt2.bold(category || "")} category.`
      });
      table3(
        ["Page", "Created", "Subcategory", "Desc", "Links"],
        kindPages.map((p2) => {
          const pg = page(p2);
          return [
            createFileLink(pg),
            show_created_date2(pg, "DD"),
            show_prop2(pg, "subcategory"),
            show_prop2(pg, "desc", "description", "about"),
            show_links2(pg)
          ];
        })
      ).catch((e) => plg.error(`Problems rendering table`, e));
    }
    if (otherPages.length > 0) {
      if (kindPages.length > 0 || subCategories.length > 0) {
        fmt2.callout("info", "Other Pages", {
          style: {
            mt: "1rem",
            mb: "1rem"
          },
          content: `other back links which aren't related directly via their classification`
        });
      }
      table3(
        ["Page", "Created", "Kind", "Category", "Links"],
        otherPages.map((p2) => {
          const pg = page(p2);
          return [
            createFileLink(pg),
            show_created_date2(pg, "DD"),
            show_prop2(pg, "kind"),
            show_prop2(pg, "category", "categories"),
            show_links2(pg)
          ];
        })
      ).catch((e) => plg.error(`Problems rendering otherPages table`, e));
    }
  } else if (isSubcategory) {
    const kinded = links.where(
      (p2) => {
        var _a2, _b2, _c2, _d2;
        return (
          // isKindedPage(page(p)) &&
          page(p2) && ((_a2 = page(p2)) == null ? void 0 : _a2.subcategory) && ((_d2 = (_c2 = page((_b2 = page(p2)) == null ? void 0 : _b2.subcategory)) == null ? void 0 : _c2.file) == null ? void 0 : _d2.path) === current.file.path
        );
      }
    );
    const other = links.where(
      (p2) => {
        var _a2, _b2, _c2, _d2;
        return !((_a2 = page(p2)) == null ? void 0 : _a2.subcategory) || ((_d2 = (_c2 = page((_b2 = page(p2)) == null ? void 0 : _b2.subcategory)) == null ? void 0 : _c2.file) == null ? void 0 : _d2.path) !== current.file.path;
      }
    );
    if (kinded.length > 0) {
      fmt2.callout("info", "Kinded Pages", {
        style: {
          mt: "1rem",
          mb: "1rem"
        },
        content: `pages that are kinded as ${fmt2.bold(kind_tag || "")} ${fmt2.italics("and")} are part of the ${fmt2.bold(current.file.name)} subcategory .`
      });
      table3(
        ["Page", "Created", "Modified", "Desc", "Links"],
        kinded.map((p2) => {
          const pg = page(p2);
          return [
            createFileLink(pg),
            show_created_date2(pg, "DD"),
            show_modified_date2(pg, "DD"),
            show_prop2(pg, "desc", "description", "about"),
            show_links2(pg)
          ];
        })
      );
    } else {
      paragraph2(`### Subcategory Page`);
      ul(
        `no pages which identify as being in this subcategory`,
        `to be listed, a page would need one of the following tag groups:`,
        (l2) => l2.indent(
          `<code>#${kind_tag}/${category}/${subcategory}</code>`,
          `<code>#${kind_tag} #subcategory/${category}/${subcategory}</code>`
        )
      );
    }
    if (other.length > 0) {
      paragraph2(`### Other Back Links`);
      table3(
        ["Page", "Created", "Kind", "Category", "Links"],
        other.map((p2) => {
          const pg = page(p2);
          return [
            createFileLink(pg),
            show_created_date2(pg, "DD"),
            show_prop2(pg, "kind"),
            show_prop2(pg, "category", "categories"),
            show_links2(pg)
          ];
        })
      );
    }
  } else if (isKindedPage2(current)) {
    let peering = "none";
    if (subcategory) {
      const peers = links.where(
        (p2) => {
          var _a2;
          return ((_a2 = get_classification2(page(p2))) == null ? void 0 : _a2.subcategory) === subcategory;
        }
      );
      if (peers.length > 0) {
        peering = "subcategory";
        fmt2.callout("info", "Peers", {
          content: `pages who share the same ${fmt2.bold(current.file.name)} ${fmt2.italics("subcategory")} as this page`,
          style: {
            mt: "1rem",
            mb: "1rem"
          },
          fold: ""
        });
        table3(
          ["Page", "Created", "Modified", "Desc", "Links"],
          peers.map((p2) => {
            const pg = page(p2);
            return [
              createFileLink(pg),
              show_created_date2(pg, "DD"),
              show_modified_date2(pg, "DD"),
              show_prop2(pg, "desc", "description", "about"),
              show_links2(pg)
            ];
          })
        );
      }
    } else if (category && peering === "none") {
      const peers = links.where(
        (p2) => {
          var _a2;
          return ((_a2 = get_classification2(page(p2))) == null ? void 0 : _a2.category) === category;
        }
      );
      if (peers.length > 0) {
        peering = "category";
        if (subcategory) {
          fmt2.callout("info", "Peers", {
            style: {
              pt: "1rem"
            },
            content: `no peers with your subcategory ${fmt2.bold(subcategory)} found but there are peers with your ${fmt2.italics("category")} ${fmt2.bold(category)}`
          });
          paragraph2(`> ![note] no peers with your subcategory ${subcategory} found but there are peers with your category of ${category}`);
        } else {
          fmt2.callout("info", "Peers", {
            style: {
              mt: "1rem",
              mb: "1rem"
            },
            content: `pages who share the same ${fmt2.bold(category)} ${fmt2.italics("category")} as this page`
          });
        }
        table3(
          ["Page", "Created", "Modified", "Desc", "Links"],
          peers.map((p2) => {
            const pg = page(p2);
            return [
              createFileLink(pg),
              show_created_date2(pg, "DD"),
              show_modified_date2(pg, "DD"),
              show_prop2(pg, "desc", "description", "about"),
              show_links2(pg)
            ];
          })
        );
      }
    } else {
      if (category && subcategory) {
        paragraph2(`- no peer pages with either your ${category} category or your ${subcategory} subcategory`);
      } else if (category) {
        paragraph2(`- no peer pages found with your ${category} category`);
      }
    }
    const other = links.where(
      (p2) => {
        var _a2, _b2;
        return peering === "category" && ((_a2 = get_classification2(page(p2))) == null ? void 0 : _a2.category) !== category || peering === "subcategory" && ((_b2 = get_classification2(page(p2))) == null ? void 0 : _b2.subcategory) !== subcategory || peering === "none";
      }
    );
    if (other.length > 0) {
      if (category || subcategory) {
        fmt2.callout("info", "Other Back Links", {
          style: {
            mt: "2rem",
            mb: "1rem"
          }
        });
      }
      table3(
        ["Page", "Created", "Kind", "Category", "Links"],
        other.map((p2) => {
          const pg = page(p2);
          return [
            createFileLink(pg),
            show_created_date2(pg, "DD"),
            show_prop2(pg, "kind"),
            show_prop2(pg, "category", "categories"),
            show_links2(pg)
          ];
        })
      );
    }
  } else if (isKindDefnPage2(current)) {
    const categoryPages = links.where(
      (p2) => {
        var _a2, _b2, _c2;
        return ((_a2 = get_classification2(page(p2))) == null ? void 0 : _a2.isCategory) && ((_c2 = (_b2 = get_kind_prop2(page(p2)).kind) == null ? void 0 : _b2.file) == null ? void 0 : _c2.path) === current.file.path;
      }
    );
    if (categoryPages.length > 0) {
      fmt2.callout("info", "Classification Pages", {
        style: {
          mt: "1rem",
          mb: "1rem"
        },
        content: `pages that are category pages of this ${fmt2.italics("kind definition")} page and their subcategories.`
      });
      table3(
        ["Category", "Tag", "Subcategories"],
        categoryPages.map((p2) => {
          const pg = page(p2);
          return [
            createFileLink(pg),
            get_classification2(pg).category,
            show_subcategories_for2(pg).join(`, `)
          ];
        })
      );
    }
    const kindPages = links.where(
      (p2) => {
        var _a2, _b2;
        return ((_b2 = (_a2 = get_kind_prop2(page(p2)).kind) == null ? void 0 : _a2.file) == null ? void 0 : _b2.path) === current.file.path && isKindedPage2(page(p2));
      }
    );
    if (kindPages.length > 0) {
      fmt2.callout("info", "Kinded Pages", {
        style: {
          mt: "1rem",
          mb: "1rem"
        },
        content: `pages who's "kind" is defined by this page.`
      });
      const [_, classification2] = get_prop2(current, "__classification");
      if (isString$2(classification2) && classification2 === "categories") {
        table3(
          ["Page", "Categories", "Links"],
          kindPages.map((p2) => {
            const pg = page(p2);
            return [
              createFileLink(pg),
              show_prop2(pg, "categories"),
              show_links2(pg)
            ];
          })
        );
      } else {
        table3(
          ["Page", "Category", "Subcategory", "Links"],
          kindPages.map((p2) => {
            const pg = page(p2);
            return [
              createFileLink(pg),
              show_prop2(pg, "category", "categories"),
              show_prop2(pg, "subcategory"),
              show_links2(pg)
            ];
          })
        );
      }
    }
  }
  if (links.length === 0) {
    renderValue(`- no back links found to this page`).catch((e) => plg.error(`Problem rendering paragraph WRT to no back links`, e));
  }
};
const isWikipediaUrl = (val) => {
  return isString$2(val) && val.startsWith("https://") && val.includes("wikipedia.org/");
};
const find_in = (tg) => (...values) => {
  const found = values.find((v) => tg(v));
  return found;
};
const page_entry_defn = {
  kind: "query-defn",
  type: "PageEntry",
  scalar: [],
  options: {
    verbose: "bool"
  }
};
const page_entry = (p2) => (source, container, component, filePath) => async (_scalar, _opt) => {
  const dv = p2.api.dv_page(source, container, component, filePath);
  const { fmt: fmt2, current } = dv;
  const banner_img = isUrl(dv.current["_banner"]) ? dv.current["_banner"] : void 0;
  const banner_aspect = isCssAspectRatio(dv.current["_banner_aspect"]) ? dv.current["_banner_aspect"] : "32/12";
  const hasBanner = isUrl(banner_img);
  let [_p1, icon] = dv.get_prop(dv.current, "icon", "_icon", "svgIcon", "_svgIcon");
  const hasIcon = isInlineSvg(icon);
  let [_p2, desc] = dv.get_prop(dv.current, "desc", "description", "about", "tagline", "summary");
  const hasDesc = isString$2(desc);
  const type = current.type ? dv.fmt.internalLink(dv.page(current.type)) : void 0;
  const kind = current.kind ? dv.fmt.internalLink(dv.page(current.kind)) : void 0;
  const category = current.category ? dv.fmt.internalLink(dv.page(current.category)) : void 0;
  const categories = current.categories ? current.categories.map((c) => dv.fmt.internalLink(dv.page(c))).join(fmt2.light(" | ", { opacity: 0.5 })) : void 0;
  const subcategory = current.subcategory ? dv.fmt.internalLink(dv.page(current.subcategory)) : void 0;
  const wiki = isWikipediaUrl(current.wiki) ? fmt2.link("Wikipedia", current.wiki) : isWikipediaUrl(current.wikipedia) ? fmt2.link("Wikipedia", current.wikipedia) : void 0;
  const siblings = dv.get_internal_links(dv.current, "about", "related", "competitors", "partners").map((i) => fmt2.internalLink(i));
  const parents = dv.get_internal_links(dv.current, "parent", "parents", "father", "mother", "belongs_to", "member_of", "child_of").map((i) => fmt2.internalLink(i));
  const children2 = dv.get_internal_links(dv.current, "child", "children", "son", "daughter").map((i) => fmt2.internalLink(i));
  const siblingsNoOthers = siblings.length > 0 && parents.length === 0 && children2.length === 0;
  const repo = find_in(isRepoUrl)(current.repo, current.github, current.git, current.homepage, current.url, current.home);
  const repo_lnk = repo ? fmt2.link("Repo", repo) : void 0;
  const shouldDisplay = hasIcon || hasDesc || type || kind || category || categories;
  if (shouldDisplay) {
    const breadcrumbs = [type, kind, category, categories, subcategory].filter((i) => i).join(
      fmt2.light("&nbsp;>&nbsp;", { opacity: 0.5 })
    );
    const ext_links = [wiki, repo_lnk].filter((i) => i).join(", ");
    const title = isString$2(desc) ? desc.length < 120 ? desc : ext_links : ext_links;
    const body = isString$2(desc) && desc.length >= 120 ? ensureTrailing(desc, ".") : void 0;
    const right2 = breadcrumbs.length > 0 ? siblingsNoOthers ? `${breadcrumbs} [ ${siblings} ]` : breadcrumbs : fmt2.light("<i>no classification</i>");
    await fmt2.callout("example", title, {
      style: {
        mt: "0.55rem",
        mb: "1rem"
      },
      icon: hasIcon ? icon : MARKDOWN_PAGE_ICON,
      content: body,
      toRight: right2,
      fold: "+"
    });
  }
  if (hasBanner) {
    dv.renderValue(`<img src="${banner_img}" style="width:100%;aspect-ratio:${banner_aspect}; object-fit: cover"> `);
  }
};
var _function = {};
(function(exports) {
  var __spreadArray = commonjsGlobal$1 && commonjsGlobal$1.__spreadArray || function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l2 = from.length, ar; i < l2; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.dual = exports.getEndomorphismMonoid = exports.SK = exports.hole = exports.constVoid = exports.constUndefined = exports.constNull = exports.constFalse = exports.constTrue = exports.unsafeCoerce = exports.apply = exports.getRing = exports.getSemiring = exports.getMonoid = exports.getSemigroup = exports.getBooleanAlgebra = void 0;
  exports.identity = identity;
  exports.constant = constant;
  exports.flip = flip2;
  exports.flow = flow;
  exports.tuple = tuple;
  exports.increment = increment2;
  exports.decrement = decrement;
  exports.absurd = absurd;
  exports.tupled = tupled;
  exports.untupled = untupled;
  exports.pipe = pipe;
  exports.not = not2;
  var getBooleanAlgebra = function(B) {
    return function() {
      return {
        meet: function(x2, y2) {
          return function(a) {
            return B.meet(x2(a), y2(a));
          };
        },
        join: function(x2, y2) {
          return function(a) {
            return B.join(x2(a), y2(a));
          };
        },
        zero: function() {
          return B.zero;
        },
        one: function() {
          return B.one;
        },
        implies: function(x2, y2) {
          return function(a) {
            return B.implies(x2(a), y2(a));
          };
        },
        not: function(x2) {
          return function(a) {
            return B.not(x2(a));
          };
        }
      };
    };
  };
  exports.getBooleanAlgebra = getBooleanAlgebra;
  var getSemigroup = function(S) {
    return function() {
      return {
        concat: function(f, g) {
          return function(a) {
            return S.concat(f(a), g(a));
          };
        }
      };
    };
  };
  exports.getSemigroup = getSemigroup;
  var getMonoid = function(M) {
    var getSemigroupM = (0, exports.getSemigroup)(M);
    return function() {
      return {
        concat: getSemigroupM().concat,
        empty: function() {
          return M.empty;
        }
      };
    };
  };
  exports.getMonoid = getMonoid;
  var getSemiring = function(S) {
    return {
      add: function(f, g) {
        return function(x2) {
          return S.add(f(x2), g(x2));
        };
      },
      zero: function() {
        return S.zero;
      },
      mul: function(f, g) {
        return function(x2) {
          return S.mul(f(x2), g(x2));
        };
      },
      one: function() {
        return S.one;
      }
    };
  };
  exports.getSemiring = getSemiring;
  var getRing = function(R) {
    var S = (0, exports.getSemiring)(R);
    return {
      add: S.add,
      mul: S.mul,
      one: S.one,
      zero: S.zero,
      sub: function(f, g) {
        return function(x2) {
          return R.sub(f(x2), g(x2));
        };
      }
    };
  };
  exports.getRing = getRing;
  var apply = function(a) {
    return function(f) {
      return f(a);
    };
  };
  exports.apply = apply;
  function identity(a) {
    return a;
  }
  exports.unsafeCoerce = identity;
  function constant(a) {
    return function() {
      return a;
    };
  }
  exports.constTrue = constant(true);
  exports.constFalse = constant(false);
  exports.constNull = constant(null);
  exports.constUndefined = constant(void 0);
  exports.constVoid = exports.constUndefined;
  function flip2(f) {
    return function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      if (args.length > 1) {
        return f(args[1], args[0]);
      }
      return function(a) {
        return f(a)(args[0]);
      };
    };
  }
  function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
    switch (arguments.length) {
      case 1:
        return ab;
      case 2:
        return function() {
          return bc(ab.apply(this, arguments));
        };
      case 3:
        return function() {
          return cd(bc(ab.apply(this, arguments)));
        };
      case 4:
        return function() {
          return de(cd(bc(ab.apply(this, arguments))));
        };
      case 5:
        return function() {
          return ef(de(cd(bc(ab.apply(this, arguments)))));
        };
      case 6:
        return function() {
          return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
        };
      case 7:
        return function() {
          return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
        };
      case 8:
        return function() {
          return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
        };
      case 9:
        return function() {
          return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
        };
    }
    return;
  }
  function tuple() {
    var t = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      t[_i] = arguments[_i];
    }
    return t;
  }
  function increment2(n2) {
    return n2 + 1;
  }
  function decrement(n2) {
    return n2 - 1;
  }
  function absurd(_) {
    throw new Error("Called `absurd` function which should be uncallable");
  }
  function tupled(f) {
    return function(a) {
      return f.apply(void 0, a);
    };
  }
  function untupled(f) {
    return function() {
      var a = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
      }
      return f(a);
    };
  }
  function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
    switch (arguments.length) {
      case 1:
        return a;
      case 2:
        return ab(a);
      case 3:
        return bc(ab(a));
      case 4:
        return cd(bc(ab(a)));
      case 5:
        return de(cd(bc(ab(a))));
      case 6:
        return ef(de(cd(bc(ab(a)))));
      case 7:
        return fg(ef(de(cd(bc(ab(a))))));
      case 8:
        return gh(fg(ef(de(cd(bc(ab(a)))))));
      case 9:
        return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
      default: {
        var ret = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
          ret = arguments[i](ret);
        }
        return ret;
      }
    }
  }
  exports.hole = absurd;
  var SK = function(_, b) {
    return b;
  };
  exports.SK = SK;
  function not2(predicate) {
    return function(a) {
      return !predicate(a);
    };
  }
  var getEndomorphismMonoid = function() {
    return {
      concat: function(first, second) {
        return flow(first, second);
      },
      empty: identity
    };
  };
  exports.getEndomorphismMonoid = getEndomorphismMonoid;
  var dual = function(arity, body) {
    var isDataFirst = typeof arity === "number" ? function(args) {
      return args.length >= arity;
    } : arity;
    return function() {
      var args = Array.from(arguments);
      if (isDataFirst(arguments)) {
        return body.apply(this, args);
      }
      return function(self2) {
        return body.apply(void 0, __spreadArray([self2], args, false));
      };
    };
  };
  exports.dual = dual;
})(_function);
var webidl2jsWrapper = {};
var URL$4 = {};
var lib = {};
(function(exports) {
  function makeException(ErrorType, message, options2) {
    if (options2.globals) {
      ErrorType = options2.globals[ErrorType.name];
    }
    return new ErrorType(`${options2.context ? options2.context : "Value"} ${message}.`);
  }
  function toNumber(value2, options2) {
    if (typeof value2 === "bigint") {
      throw makeException(TypeError, "is a BigInt which cannot be converted to a number", options2);
    }
    if (!options2.globals) {
      return Number(value2);
    }
    return options2.globals.Number(value2);
  }
  function evenRound(x2) {
    if (x2 > 0 && x2 % 1 === 0.5 && (x2 & 1) === 0 || x2 < 0 && x2 % 1 === -0.5 && (x2 & 1) === 1) {
      return censorNegativeZero(Math.floor(x2));
    }
    return censorNegativeZero(Math.round(x2));
  }
  function integerPart(n2) {
    return censorNegativeZero(Math.trunc(n2));
  }
  function sign(x2) {
    return x2 < 0 ? -1 : 1;
  }
  function modulo(x2, y2) {
    const signMightNotMatch = x2 % y2;
    if (sign(y2) !== sign(signMightNotMatch)) {
      return signMightNotMatch + y2;
    }
    return signMightNotMatch;
  }
  function censorNegativeZero(x2) {
    return x2 === 0 ? 0 : x2;
  }
  function createIntegerConversion(bitLength, { unsigned }) {
    let lowerBound, upperBound;
    if (unsigned) {
      lowerBound = 0;
      upperBound = 2 ** bitLength - 1;
    } else {
      lowerBound = -(2 ** (bitLength - 1));
      upperBound = 2 ** (bitLength - 1) - 1;
    }
    const twoToTheBitLength = 2 ** bitLength;
    const twoToOneLessThanTheBitLength = 2 ** (bitLength - 1);
    return (value2, options2 = {}) => {
      let x2 = toNumber(value2, options2);
      x2 = censorNegativeZero(x2);
      if (options2.enforceRange) {
        if (!Number.isFinite(x2)) {
          throw makeException(TypeError, "is not a finite number", options2);
        }
        x2 = integerPart(x2);
        if (x2 < lowerBound || x2 > upperBound) {
          throw makeException(
            TypeError,
            `is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`,
            options2
          );
        }
        return x2;
      }
      if (!Number.isNaN(x2) && options2.clamp) {
        x2 = Math.min(Math.max(x2, lowerBound), upperBound);
        x2 = evenRound(x2);
        return x2;
      }
      if (!Number.isFinite(x2) || x2 === 0) {
        return 0;
      }
      x2 = integerPart(x2);
      if (x2 >= lowerBound && x2 <= upperBound) {
        return x2;
      }
      x2 = modulo(x2, twoToTheBitLength);
      if (!unsigned && x2 >= twoToOneLessThanTheBitLength) {
        return x2 - twoToTheBitLength;
      }
      return x2;
    };
  }
  function createLongLongConversion(bitLength, { unsigned }) {
    const upperBound = Number.MAX_SAFE_INTEGER;
    const lowerBound = unsigned ? 0 : Number.MIN_SAFE_INTEGER;
    const asBigIntN = unsigned ? BigInt.asUintN : BigInt.asIntN;
    return (value2, options2 = {}) => {
      let x2 = toNumber(value2, options2);
      x2 = censorNegativeZero(x2);
      if (options2.enforceRange) {
        if (!Number.isFinite(x2)) {
          throw makeException(TypeError, "is not a finite number", options2);
        }
        x2 = integerPart(x2);
        if (x2 < lowerBound || x2 > upperBound) {
          throw makeException(
            TypeError,
            `is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`,
            options2
          );
        }
        return x2;
      }
      if (!Number.isNaN(x2) && options2.clamp) {
        x2 = Math.min(Math.max(x2, lowerBound), upperBound);
        x2 = evenRound(x2);
        return x2;
      }
      if (!Number.isFinite(x2) || x2 === 0) {
        return 0;
      }
      let xBigInt = BigInt(integerPart(x2));
      xBigInt = asBigIntN(bitLength, xBigInt);
      return Number(xBigInt);
    };
  }
  exports.any = (value2) => {
    return value2;
  };
  exports.undefined = () => {
    return void 0;
  };
  exports.boolean = (value2) => {
    return Boolean(value2);
  };
  exports.byte = createIntegerConversion(8, { unsigned: false });
  exports.octet = createIntegerConversion(8, { unsigned: true });
  exports.short = createIntegerConversion(16, { unsigned: false });
  exports["unsigned short"] = createIntegerConversion(16, { unsigned: true });
  exports.long = createIntegerConversion(32, { unsigned: false });
  exports["unsigned long"] = createIntegerConversion(32, { unsigned: true });
  exports["long long"] = createLongLongConversion(64, { unsigned: false });
  exports["unsigned long long"] = createLongLongConversion(64, { unsigned: true });
  exports.double = (value2, options2 = {}) => {
    const x2 = toNumber(value2, options2);
    if (!Number.isFinite(x2)) {
      throw makeException(TypeError, "is not a finite floating-point value", options2);
    }
    return x2;
  };
  exports["unrestricted double"] = (value2, options2 = {}) => {
    const x2 = toNumber(value2, options2);
    return x2;
  };
  exports.float = (value2, options2 = {}) => {
    const x2 = toNumber(value2, options2);
    if (!Number.isFinite(x2)) {
      throw makeException(TypeError, "is not a finite floating-point value", options2);
    }
    if (Object.is(x2, -0)) {
      return x2;
    }
    const y2 = Math.fround(x2);
    if (!Number.isFinite(y2)) {
      throw makeException(TypeError, "is outside the range of a single-precision floating-point value", options2);
    }
    return y2;
  };
  exports["unrestricted float"] = (value2, options2 = {}) => {
    const x2 = toNumber(value2, options2);
    if (isNaN(x2)) {
      return x2;
    }
    if (Object.is(x2, -0)) {
      return x2;
    }
    return Math.fround(x2);
  };
  exports.DOMString = (value2, options2 = {}) => {
    if (options2.treatNullAsEmptyString && value2 === null) {
      return "";
    }
    if (typeof value2 === "symbol") {
      throw makeException(TypeError, "is a symbol, which cannot be converted to a string", options2);
    }
    const StringCtor = options2.globals ? options2.globals.String : String;
    return StringCtor(value2);
  };
  exports.ByteString = (value2, options2 = {}) => {
    const x2 = exports.DOMString(value2, options2);
    let c;
    for (let i = 0; (c = x2.codePointAt(i)) !== void 0; ++i) {
      if (c > 255) {
        throw makeException(TypeError, "is not a valid ByteString", options2);
      }
    }
    return x2;
  };
  exports.USVString = (value2, options2 = {}) => {
    const S = exports.DOMString(value2, options2);
    const n2 = S.length;
    const U = [];
    for (let i = 0; i < n2; ++i) {
      const c = S.charCodeAt(i);
      if (c < 55296 || c > 57343) {
        U.push(String.fromCodePoint(c));
      } else if (56320 <= c && c <= 57343) {
        U.push(String.fromCodePoint(65533));
      } else if (i === n2 - 1) {
        U.push(String.fromCodePoint(65533));
      } else {
        const d = S.charCodeAt(i + 1);
        if (56320 <= d && d <= 57343) {
          const a = c & 1023;
          const b = d & 1023;
          U.push(String.fromCodePoint((2 << 15) + (2 << 9) * a + b));
          ++i;
        } else {
          U.push(String.fromCodePoint(65533));
        }
      }
    }
    return U.join("");
  };
  exports.object = (value2, options2 = {}) => {
    if (value2 === null || typeof value2 !== "object" && typeof value2 !== "function") {
      throw makeException(TypeError, "is not an object", options2);
    }
    return value2;
  };
  const abByteLengthGetter = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get;
  const sabByteLengthGetter = typeof SharedArrayBuffer === "function" ? Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, "byteLength").get : null;
  function isNonSharedArrayBuffer(value2) {
    try {
      abByteLengthGetter.call(value2);
      return true;
    } catch {
      return false;
    }
  }
  function isSharedArrayBuffer(value2) {
    try {
      sabByteLengthGetter.call(value2);
      return true;
    } catch {
      return false;
    }
  }
  function isArrayBufferDetached(value2) {
    try {
      new Uint8Array(value2);
      return false;
    } catch {
      return true;
    }
  }
  exports.ArrayBuffer = (value2, options2 = {}) => {
    if (!isNonSharedArrayBuffer(value2)) {
      if (options2.allowShared && !isSharedArrayBuffer(value2)) {
        throw makeException(TypeError, "is not an ArrayBuffer or SharedArrayBuffer", options2);
      }
      throw makeException(TypeError, "is not an ArrayBuffer", options2);
    }
    if (isArrayBufferDetached(value2)) {
      throw makeException(TypeError, "is a detached ArrayBuffer", options2);
    }
    return value2;
  };
  const dvByteLengthGetter = Object.getOwnPropertyDescriptor(DataView.prototype, "byteLength").get;
  exports.DataView = (value2, options2 = {}) => {
    try {
      dvByteLengthGetter.call(value2);
    } catch (e) {
      throw makeException(TypeError, "is not a DataView", options2);
    }
    if (!options2.allowShared && isSharedArrayBuffer(value2.buffer)) {
      throw makeException(TypeError, "is backed by a SharedArrayBuffer, which is not allowed", options2);
    }
    if (isArrayBufferDetached(value2.buffer)) {
      throw makeException(TypeError, "is backed by a detached ArrayBuffer", options2);
    }
    return value2;
  };
  const typedArrayNameGetter = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(Uint8Array).prototype,
    Symbol.toStringTag
  ).get;
  [
    Int8Array,
    Int16Array,
    Int32Array,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Uint8ClampedArray,
    Float32Array,
    Float64Array
  ].forEach((func) => {
    const { name: name2 } = func;
    const article = /^[AEIOU]/u.test(name2) ? "an" : "a";
    exports[name2] = (value2, options2 = {}) => {
      if (!ArrayBuffer.isView(value2) || typedArrayNameGetter.call(value2) !== name2) {
        throw makeException(TypeError, `is not ${article} ${name2} object`, options2);
      }
      if (!options2.allowShared && isSharedArrayBuffer(value2.buffer)) {
        throw makeException(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", options2);
      }
      if (isArrayBufferDetached(value2.buffer)) {
        throw makeException(TypeError, "is a view on a detached ArrayBuffer", options2);
      }
      return value2;
    };
  });
  exports.ArrayBufferView = (value2, options2 = {}) => {
    if (!ArrayBuffer.isView(value2)) {
      throw makeException(TypeError, "is not a view on an ArrayBuffer or SharedArrayBuffer", options2);
    }
    if (!options2.allowShared && isSharedArrayBuffer(value2.buffer)) {
      throw makeException(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", options2);
    }
    if (isArrayBufferDetached(value2.buffer)) {
      throw makeException(TypeError, "is a view on a detached ArrayBuffer", options2);
    }
    return value2;
  };
  exports.BufferSource = (value2, options2 = {}) => {
    if (ArrayBuffer.isView(value2)) {
      if (!options2.allowShared && isSharedArrayBuffer(value2.buffer)) {
        throw makeException(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", options2);
      }
      if (isArrayBufferDetached(value2.buffer)) {
        throw makeException(TypeError, "is a view on a detached ArrayBuffer", options2);
      }
      return value2;
    }
    if (!options2.allowShared && !isNonSharedArrayBuffer(value2)) {
      throw makeException(TypeError, "is not an ArrayBuffer or a view on one", options2);
    }
    if (options2.allowShared && !isSharedArrayBuffer(value2) && !isNonSharedArrayBuffer(value2)) {
      throw makeException(TypeError, "is not an ArrayBuffer, SharedArrayBuffer, or a view on one", options2);
    }
    if (isArrayBufferDetached(value2)) {
      throw makeException(TypeError, "is a detached ArrayBuffer", options2);
    }
    return value2;
  };
  exports.DOMTimeStamp = exports["unsigned long long"];
})(lib);
var utils$2 = { exports: {} };
(function(module, exports) {
  function isObject2(value2) {
    return typeof value2 === "object" && value2 !== null || typeof value2 === "function";
  }
  const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
  function define(target2, source) {
    for (const key of Reflect.ownKeys(source)) {
      const descriptor = Reflect.getOwnPropertyDescriptor(source, key);
      if (descriptor && !Reflect.defineProperty(target2, key, descriptor)) {
        throw new TypeError(`Cannot redefine property: ${String(key)}`);
      }
    }
  }
  function newObjectInRealm(globalObject, object) {
    const ctorRegistry = initCtorRegistry(globalObject);
    return Object.defineProperties(
      Object.create(ctorRegistry["%Object.prototype%"]),
      Object.getOwnPropertyDescriptors(object)
    );
  }
  const wrapperSymbol = Symbol("wrapper");
  const implSymbol = Symbol("impl");
  const sameObjectCaches = Symbol("SameObject caches");
  const ctorRegistrySymbol = Symbol.for("[webidl2js] constructor registry");
  const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
  }).prototype);
  function initCtorRegistry(globalObject) {
    if (hasOwn(globalObject, ctorRegistrySymbol)) {
      return globalObject[ctorRegistrySymbol];
    }
    const ctorRegistry = /* @__PURE__ */ Object.create(null);
    ctorRegistry["%Object.prototype%"] = globalObject.Object.prototype;
    ctorRegistry["%IteratorPrototype%"] = Object.getPrototypeOf(
      Object.getPrototypeOf(new globalObject.Array()[Symbol.iterator]())
    );
    try {
      ctorRegistry["%AsyncIteratorPrototype%"] = Object.getPrototypeOf(
        Object.getPrototypeOf(
          globalObject.eval("(async function* () {})").prototype
        )
      );
    } catch {
      ctorRegistry["%AsyncIteratorPrototype%"] = AsyncIteratorPrototype;
    }
    globalObject[ctorRegistrySymbol] = ctorRegistry;
    return ctorRegistry;
  }
  function getSameObject(wrapper, prop, creator) {
    if (!wrapper[sameObjectCaches]) {
      wrapper[sameObjectCaches] = /* @__PURE__ */ Object.create(null);
    }
    if (prop in wrapper[sameObjectCaches]) {
      return wrapper[sameObjectCaches][prop];
    }
    wrapper[sameObjectCaches][prop] = creator();
    return wrapper[sameObjectCaches][prop];
  }
  function wrapperForImpl(impl) {
    return impl ? impl[wrapperSymbol] : null;
  }
  function implForWrapper(wrapper) {
    return wrapper ? wrapper[implSymbol] : null;
  }
  function tryWrapperForImpl(impl) {
    const wrapper = wrapperForImpl(impl);
    return wrapper ? wrapper : impl;
  }
  function tryImplForWrapper(wrapper) {
    const impl = implForWrapper(wrapper);
    return impl ? impl : wrapper;
  }
  const iterInternalSymbol = Symbol("internal");
  function isArrayIndexPropName(P) {
    if (typeof P !== "string") {
      return false;
    }
    const i = P >>> 0;
    if (i === 2 ** 32 - 1) {
      return false;
    }
    const s2 = `${i}`;
    if (P !== s2) {
      return false;
    }
    return true;
  }
  const byteLengthGetter = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get;
  function isArrayBuffer(value2) {
    try {
      byteLengthGetter.call(value2);
      return true;
    } catch (e) {
      return false;
    }
  }
  function iteratorResult([key, value2], kind) {
    let result;
    switch (kind) {
      case "key":
        result = key;
        break;
      case "value":
        result = value2;
        break;
      case "key+value":
        result = [key, value2];
        break;
    }
    return { value: result, done: false };
  }
  const supportsPropertyIndex = Symbol("supports property index");
  const supportedPropertyIndices = Symbol("supported property indices");
  const supportsPropertyName = Symbol("supports property name");
  const supportedPropertyNames = Symbol("supported property names");
  const indexedGet = Symbol("indexed property get");
  const indexedSetNew = Symbol("indexed property set new");
  const indexedSetExisting = Symbol("indexed property set existing");
  const namedGet = Symbol("named property get");
  const namedSetNew = Symbol("named property set new");
  const namedSetExisting = Symbol("named property set existing");
  const namedDelete = Symbol("named property delete");
  const asyncIteratorNext = Symbol("async iterator get the next iteration result");
  const asyncIteratorReturn = Symbol("async iterator return steps");
  const asyncIteratorInit = Symbol("async iterator initialization steps");
  const asyncIteratorEOI = Symbol("async iterator end of iteration");
  module.exports = {
    isObject: isObject2,
    hasOwn,
    define,
    newObjectInRealm,
    wrapperSymbol,
    implSymbol,
    getSameObject,
    ctorRegistrySymbol,
    initCtorRegistry,
    wrapperForImpl,
    implForWrapper,
    tryWrapperForImpl,
    tryImplForWrapper,
    iterInternalSymbol,
    isArrayBuffer,
    isArrayIndexPropName,
    supportsPropertyIndex,
    supportedPropertyIndices,
    supportsPropertyName,
    supportedPropertyNames,
    indexedGet,
    indexedSetNew,
    indexedSetExisting,
    namedGet,
    namedSetNew,
    namedSetExisting,
    namedDelete,
    asyncIteratorNext,
    asyncIteratorReturn,
    asyncIteratorInit,
    asyncIteratorEOI,
    iteratorResult
  };
})(utils$2);
var utilsExports = utils$2.exports;
var URLImpl = {};
var urlStateMachine$1 = { exports: {} };
const maxInt = 2147483647;
const base = 36;
const tMin = 1;
const tMax = 26;
const skew = 38;
const damp = 700;
const initialBias = 72;
const initialN = 128;
const delimiter = "-";
const regexPunycode = /^xn--/;
const regexNonASCII = /[^\0-\x7F]/;
const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
const errors = {
  "overflow": "Overflow: input needs wider integers to process",
  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
  "invalid-input": "Invalid input"
};
const baseMinusTMin = base - tMin;
const floor = Math.floor;
const stringFromCharCode = String.fromCharCode;
function error$2(type) {
  throw new RangeError(errors[type]);
}
function map(array, callback) {
  const result = [];
  let length2 = array.length;
  while (length2--) {
    result[length2] = callback(array[length2]);
  }
  return result;
}
function mapDomain(domain, callback) {
  const parts = domain.split("@");
  let result = "";
  if (parts.length > 1) {
    result = parts[0] + "@";
    domain = parts[1];
  }
  domain = domain.replace(regexSeparators, ".");
  const labels = domain.split(".");
  const encoded = map(labels, callback).join(".");
  return result + encoded;
}
function ucs2decode(string) {
  const output = [];
  let counter = 0;
  const length2 = string.length;
  while (counter < length2) {
    const value2 = string.charCodeAt(counter++);
    if (value2 >= 55296 && value2 <= 56319 && counter < length2) {
      const extra = string.charCodeAt(counter++);
      if ((extra & 64512) == 56320) {
        output.push(((value2 & 1023) << 10) + (extra & 1023) + 65536);
      } else {
        output.push(value2);
        counter--;
      }
    } else {
      output.push(value2);
    }
  }
  return output;
}
const ucs2encode = (codePoints) => String.fromCodePoint(...codePoints);
const basicToDigit = function(codePoint) {
  if (codePoint >= 48 && codePoint < 58) {
    return 26 + (codePoint - 48);
  }
  if (codePoint >= 65 && codePoint < 91) {
    return codePoint - 65;
  }
  if (codePoint >= 97 && codePoint < 123) {
    return codePoint - 97;
  }
  return base;
};
const digitToBasic = function(digit, flag) {
  return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
};
const adapt = function(delta, numPoints, firstTime) {
  let k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor(delta / baseMinusTMin);
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};
const decode = function(input) {
  const output = [];
  const inputLength = input.length;
  let i = 0;
  let n2 = initialN;
  let bias = initialBias;
  let basic = input.lastIndexOf(delimiter);
  if (basic < 0) {
    basic = 0;
  }
  for (let j = 0; j < basic; ++j) {
    if (input.charCodeAt(j) >= 128) {
      error$2("not-basic");
    }
    output.push(input.charCodeAt(j));
  }
  for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
    const oldi = i;
    for (let w = 1, k = base; ; k += base) {
      if (index >= inputLength) {
        error$2("invalid-input");
      }
      const digit = basicToDigit(input.charCodeAt(index++));
      if (digit >= base) {
        error$2("invalid-input");
      }
      if (digit > floor((maxInt - i) / w)) {
        error$2("overflow");
      }
      i += digit * w;
      const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
      if (digit < t) {
        break;
      }
      const baseMinusT = base - t;
      if (w > floor(maxInt / baseMinusT)) {
        error$2("overflow");
      }
      w *= baseMinusT;
    }
    const out = output.length + 1;
    bias = adapt(i - oldi, out, oldi == 0);
    if (floor(i / out) > maxInt - n2) {
      error$2("overflow");
    }
    n2 += floor(i / out);
    i %= out;
    output.splice(i++, 0, n2);
  }
  return String.fromCodePoint(...output);
};
const encode = function(input) {
  const output = [];
  input = ucs2decode(input);
  const inputLength = input.length;
  let n2 = initialN;
  let delta = 0;
  let bias = initialBias;
  for (const currentValue of input) {
    if (currentValue < 128) {
      output.push(stringFromCharCode(currentValue));
    }
  }
  const basicLength = output.length;
  let handledCPCount = basicLength;
  if (basicLength) {
    output.push(delimiter);
  }
  while (handledCPCount < inputLength) {
    let m = maxInt;
    for (const currentValue of input) {
      if (currentValue >= n2 && currentValue < m) {
        m = currentValue;
      }
    }
    const handledCPCountPlusOne = handledCPCount + 1;
    if (m - n2 > floor((maxInt - delta) / handledCPCountPlusOne)) {
      error$2("overflow");
    }
    delta += (m - n2) * handledCPCountPlusOne;
    n2 = m;
    for (const currentValue of input) {
      if (currentValue < n2 && ++delta > maxInt) {
        error$2("overflow");
      }
      if (currentValue === n2) {
        let q = delta;
        for (let k = base; ; k += base) {
          const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
          if (q < t) {
            break;
          }
          const qMinusT = q - t;
          const baseMinusT = base - t;
          output.push(
            stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
          );
          q = floor(qMinusT / baseMinusT);
        }
        output.push(stringFromCharCode(digitToBasic(q, 0)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }
    ++delta;
    ++n2;
  }
  return output.join("");
};
const toUnicode$1 = function(input) {
  return mapDomain(input, function(string) {
    return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
  });
};
const toASCII$1 = function(input) {
  return mapDomain(input, function(string) {
    return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
  });
};
const punycode$1 = {
  /**
   * A string representing the current Punycode.js version number.
   * @memberOf punycode
   * @type String
   */
  "version": "2.3.1",
  /**
   * An object of methods to convert from JavaScript's internal character
   * representation (UCS-2) to Unicode code points, and back.
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode
   * @type Object
   */
  "ucs2": {
    "decode": ucs2decode,
    "encode": ucs2encode
  },
  "decode": decode,
  "encode": encode,
  "toASCII": toASCII$1,
  "toUnicode": toUnicode$1
};
const punycode_es6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode,
  default: punycode$1,
  encode,
  toASCII: toASCII$1,
  toUnicode: toUnicode$1,
  ucs2decode,
  ucs2encode
}, Symbol.toStringTag, { value: "Module" }));
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(punycode_es6);
const combiningMarks = /[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3C\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CF3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\u{101FD}\u{102E0}\u{10376}-\u{1037A}\u{10A01}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A0F}\u{10A38}-\u{10A3A}\u{10A3F}\u{10AE5}\u{10AE6}\u{10D24}-\u{10D27}\u{10EAB}\u{10EAC}\u{10EFD}-\u{10EFF}\u{10F46}-\u{10F50}\u{10F82}-\u{10F85}\u{11000}-\u{11002}\u{11038}-\u{11046}\u{11070}\u{11073}\u{11074}\u{1107F}-\u{11082}\u{110B0}-\u{110BA}\u{110C2}\u{11100}-\u{11102}\u{11127}-\u{11134}\u{11145}\u{11146}\u{11173}\u{11180}-\u{11182}\u{111B3}-\u{111C0}\u{111C9}-\u{111CC}\u{111CE}\u{111CF}\u{1122C}-\u{11237}\u{1123E}\u{11241}\u{112DF}-\u{112EA}\u{11300}-\u{11303}\u{1133B}\u{1133C}\u{1133E}-\u{11344}\u{11347}\u{11348}\u{1134B}-\u{1134D}\u{11357}\u{11362}\u{11363}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11435}-\u{11446}\u{1145E}\u{114B0}-\u{114C3}\u{115AF}-\u{115B5}\u{115B8}-\u{115C0}\u{115DC}\u{115DD}\u{11630}-\u{11640}\u{116AB}-\u{116B7}\u{1171D}-\u{1172B}\u{1182C}-\u{1183A}\u{11930}-\u{11935}\u{11937}\u{11938}\u{1193B}-\u{1193E}\u{11940}\u{11942}\u{11943}\u{119D1}-\u{119D7}\u{119DA}-\u{119E0}\u{119E4}\u{11A01}-\u{11A0A}\u{11A33}-\u{11A39}\u{11A3B}-\u{11A3E}\u{11A47}\u{11A51}-\u{11A5B}\u{11A8A}-\u{11A99}\u{11C2F}-\u{11C36}\u{11C38}-\u{11C3F}\u{11C92}-\u{11CA7}\u{11CA9}-\u{11CB6}\u{11D31}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D45}\u{11D47}\u{11D8A}-\u{11D8E}\u{11D90}\u{11D91}\u{11D93}-\u{11D97}\u{11EF3}-\u{11EF6}\u{11F00}\u{11F01}\u{11F03}\u{11F34}-\u{11F3A}\u{11F3E}-\u{11F42}\u{13440}\u{13447}-\u{13455}\u{16AF0}-\u{16AF4}\u{16B30}-\u{16B36}\u{16F4F}\u{16F51}-\u{16F87}\u{16F8F}-\u{16F92}\u{16FE4}\u{16FF0}\u{16FF1}\u{1BC9D}\u{1BC9E}\u{1CF00}-\u{1CF2D}\u{1CF30}-\u{1CF46}\u{1D165}-\u{1D169}\u{1D16D}-\u{1D172}\u{1D17B}-\u{1D182}\u{1D185}-\u{1D18B}\u{1D1AA}-\u{1D1AD}\u{1D242}-\u{1D244}\u{1DA00}-\u{1DA36}\u{1DA3B}-\u{1DA6C}\u{1DA75}\u{1DA84}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E08F}\u{1E130}-\u{1E136}\u{1E2AE}\u{1E2EC}-\u{1E2EF}\u{1E4EC}-\u{1E4EF}\u{1E8D0}-\u{1E8D6}\u{1E944}-\u{1E94A}\u{E0100}-\u{E01EF}]/u;
const combiningClassVirama = /[\u094D\u09CD\u0A4D\u0ACD\u0B4D\u0BCD\u0C4D\u0CCD\u0D3B\u0D3C\u0D4D\u0DCA\u0E3A\u0EBA\u0F84\u1039\u103A\u1714\u1715\u1734\u17D2\u1A60\u1B44\u1BAA\u1BAB\u1BF2\u1BF3\u2D7F\uA806\uA82C\uA8C4\uA953\uA9C0\uAAF6\uABED\u{10A3F}\u{11046}\u{11070}\u{1107F}\u{110B9}\u{11133}\u{11134}\u{111C0}\u{11235}\u{112EA}\u{1134D}\u{11442}\u{114C2}\u{115BF}\u{1163F}\u{116B6}\u{1172B}\u{11839}\u{1193D}\u{1193E}\u{119E0}\u{11A34}\u{11A47}\u{11A99}\u{11C3F}\u{11D44}\u{11D45}\u{11D97}\u{11F41}\u{11F42}]/u;
const validZWNJ = /[\u0620\u0626\u0628\u062A-\u062E\u0633-\u063F\u0641-\u0647\u0649\u064A\u066E\u066F\u0678-\u0687\u069A-\u06BF\u06C1\u06C2\u06CC\u06CE\u06D0\u06D1\u06FA-\u06FC\u06FF\u0712-\u0714\u071A-\u071D\u071F-\u0727\u0729\u072B\u072D\u072E\u074E-\u0758\u075C-\u076A\u076D-\u0770\u0772\u0775-\u0777\u077A-\u077F\u07CA-\u07EA\u0841-\u0845\u0848\u084A-\u0853\u0855\u0860\u0862-\u0865\u0868\u0886\u0889-\u088D\u08A0-\u08A9\u08AF\u08B0\u08B3-\u08B8\u08BA-\u08C8\u1807\u1820-\u1878\u1887-\u18A8\u18AA\uA840-\uA872\u{10AC0}-\u{10AC4}\u{10ACD}\u{10AD3}-\u{10ADC}\u{10ADE}-\u{10AE0}\u{10AEB}-\u{10AEE}\u{10B80}\u{10B82}\u{10B86}-\u{10B88}\u{10B8A}\u{10B8B}\u{10B8D}\u{10B90}\u{10BAD}\u{10BAE}\u{10D00}-\u{10D21}\u{10D23}\u{10F30}-\u{10F32}\u{10F34}-\u{10F44}\u{10F51}-\u{10F53}\u{10F70}-\u{10F73}\u{10F76}-\u{10F81}\u{10FB0}\u{10FB2}\u{10FB3}\u{10FB8}\u{10FBB}\u{10FBC}\u{10FBE}\u{10FBF}\u{10FC1}\u{10FC4}\u{10FCA}\u{10FCB}\u{1E900}-\u{1E943}][\xAD\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u061C\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u070F\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B55\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC6\u0CCC\u0CCD\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0D81\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200B\u200E\u200F\u202A-\u202E\u2060-\u2064\u206A-\u206F\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFEFF\uFFF9-\uFFFB\u{101FD}\u{102E0}\u{10376}-\u{1037A}\u{10A01}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A0F}\u{10A38}-\u{10A3A}\u{10A3F}\u{10AE5}\u{10AE6}\u{10D24}-\u{10D27}\u{10EAB}\u{10EAC}\u{10EFD}-\u{10EFF}\u{10F46}-\u{10F50}\u{10F82}-\u{10F85}\u{11001}\u{11038}-\u{11046}\u{11070}\u{11073}\u{11074}\u{1107F}-\u{11081}\u{110B3}-\u{110B6}\u{110B9}\u{110BA}\u{110C2}\u{11100}-\u{11102}\u{11127}-\u{1112B}\u{1112D}-\u{11134}\u{11173}\u{11180}\u{11181}\u{111B6}-\u{111BE}\u{111C9}-\u{111CC}\u{111CF}\u{1122F}-\u{11231}\u{11234}\u{11236}\u{11237}\u{1123E}\u{11241}\u{112DF}\u{112E3}-\u{112EA}\u{11300}\u{11301}\u{1133B}\u{1133C}\u{11340}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11438}-\u{1143F}\u{11442}-\u{11444}\u{11446}\u{1145E}\u{114B3}-\u{114B8}\u{114BA}\u{114BF}\u{114C0}\u{114C2}\u{114C3}\u{115B2}-\u{115B5}\u{115BC}\u{115BD}\u{115BF}\u{115C0}\u{115DC}\u{115DD}\u{11633}-\u{1163A}\u{1163D}\u{1163F}\u{11640}\u{116AB}\u{116AD}\u{116B0}-\u{116B5}\u{116B7}\u{1171D}-\u{1171F}\u{11722}-\u{11725}\u{11727}-\u{1172B}\u{1182F}-\u{11837}\u{11839}\u{1183A}\u{1193B}\u{1193C}\u{1193E}\u{11943}\u{119D4}-\u{119D7}\u{119DA}\u{119DB}\u{119E0}\u{11A01}-\u{11A0A}\u{11A33}-\u{11A38}\u{11A3B}-\u{11A3E}\u{11A47}\u{11A51}-\u{11A56}\u{11A59}-\u{11A5B}\u{11A8A}-\u{11A96}\u{11A98}\u{11A99}\u{11C30}-\u{11C36}\u{11C38}-\u{11C3D}\u{11C3F}\u{11C92}-\u{11CA7}\u{11CAA}-\u{11CB0}\u{11CB2}\u{11CB3}\u{11CB5}\u{11CB6}\u{11D31}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D45}\u{11D47}\u{11D90}\u{11D91}\u{11D95}\u{11D97}\u{11EF3}\u{11EF4}\u{11F00}\u{11F01}\u{11F36}-\u{11F3A}\u{11F40}\u{11F42}\u{13430}-\u{13440}\u{13447}-\u{13455}\u{16AF0}-\u{16AF4}\u{16B30}-\u{16B36}\u{16F4F}\u{16F8F}-\u{16F92}\u{16FE4}\u{1BC9D}\u{1BC9E}\u{1BCA0}-\u{1BCA3}\u{1CF00}-\u{1CF2D}\u{1CF30}-\u{1CF46}\u{1D167}-\u{1D169}\u{1D173}-\u{1D182}\u{1D185}-\u{1D18B}\u{1D1AA}-\u{1D1AD}\u{1D242}-\u{1D244}\u{1DA00}-\u{1DA36}\u{1DA3B}-\u{1DA6C}\u{1DA75}\u{1DA84}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E08F}\u{1E130}-\u{1E136}\u{1E2AE}\u{1E2EC}-\u{1E2EF}\u{1E4EC}-\u{1E4EF}\u{1E8D0}-\u{1E8D6}\u{1E944}-\u{1E94B}\u{E0001}\u{E0020}-\u{E007F}\u{E0100}-\u{E01EF}]*\u200C[\xAD\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u061C\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u070F\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B55\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC6\u0CCC\u0CCD\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0D81\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200B\u200E\u200F\u202A-\u202E\u2060-\u2064\u206A-\u206F\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFEFF\uFFF9-\uFFFB\u{101FD}\u{102E0}\u{10376}-\u{1037A}\u{10A01}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A0F}\u{10A38}-\u{10A3A}\u{10A3F}\u{10AE5}\u{10AE6}\u{10D24}-\u{10D27}\u{10EAB}\u{10EAC}\u{10EFD}-\u{10EFF}\u{10F46}-\u{10F50}\u{10F82}-\u{10F85}\u{11001}\u{11038}-\u{11046}\u{11070}\u{11073}\u{11074}\u{1107F}-\u{11081}\u{110B3}-\u{110B6}\u{110B9}\u{110BA}\u{110C2}\u{11100}-\u{11102}\u{11127}-\u{1112B}\u{1112D}-\u{11134}\u{11173}\u{11180}\u{11181}\u{111B6}-\u{111BE}\u{111C9}-\u{111CC}\u{111CF}\u{1122F}-\u{11231}\u{11234}\u{11236}\u{11237}\u{1123E}\u{11241}\u{112DF}\u{112E3}-\u{112EA}\u{11300}\u{11301}\u{1133B}\u{1133C}\u{11340}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11438}-\u{1143F}\u{11442}-\u{11444}\u{11446}\u{1145E}\u{114B3}-\u{114B8}\u{114BA}\u{114BF}\u{114C0}\u{114C2}\u{114C3}\u{115B2}-\u{115B5}\u{115BC}\u{115BD}\u{115BF}\u{115C0}\u{115DC}\u{115DD}\u{11633}-\u{1163A}\u{1163D}\u{1163F}\u{11640}\u{116AB}\u{116AD}\u{116B0}-\u{116B5}\u{116B7}\u{1171D}-\u{1171F}\u{11722}-\u{11725}\u{11727}-\u{1172B}\u{1182F}-\u{11837}\u{11839}\u{1183A}\u{1193B}\u{1193C}\u{1193E}\u{11943}\u{119D4}-\u{119D7}\u{119DA}\u{119DB}\u{119E0}\u{11A01}-\u{11A0A}\u{11A33}-\u{11A38}\u{11A3B}-\u{11A3E}\u{11A47}\u{11A51}-\u{11A56}\u{11A59}-\u{11A5B}\u{11A8A}-\u{11A96}\u{11A98}\u{11A99}\u{11C30}-\u{11C36}\u{11C38}-\u{11C3D}\u{11C3F}\u{11C92}-\u{11CA7}\u{11CAA}-\u{11CB0}\u{11CB2}\u{11CB3}\u{11CB5}\u{11CB6}\u{11D31}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D45}\u{11D47}\u{11D90}\u{11D91}\u{11D95}\u{11D97}\u{11EF3}\u{11EF4}\u{11F00}\u{11F01}\u{11F36}-\u{11F3A}\u{11F40}\u{11F42}\u{13430}-\u{13440}\u{13447}-\u{13455}\u{16AF0}-\u{16AF4}\u{16B30}-\u{16B36}\u{16F4F}\u{16F8F}-\u{16F92}\u{16FE4}\u{1BC9D}\u{1BC9E}\u{1BCA0}-\u{1BCA3}\u{1CF00}-\u{1CF2D}\u{1CF30}-\u{1CF46}\u{1D167}-\u{1D169}\u{1D173}-\u{1D182}\u{1D185}-\u{1D18B}\u{1D1AA}-\u{1D1AD}\u{1D242}-\u{1D244}\u{1DA00}-\u{1DA36}\u{1DA3B}-\u{1DA6C}\u{1DA75}\u{1DA84}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E08F}\u{1E130}-\u{1E136}\u{1E2AE}\u{1E2EC}-\u{1E2EF}\u{1E4EC}-\u{1E4EF}\u{1E8D0}-\u{1E8D6}\u{1E944}-\u{1E94B}\u{E0001}\u{E0020}-\u{E007F}\u{E0100}-\u{E01EF}]*[\u0620\u0622-\u063F\u0641-\u064A\u066E\u066F\u0671-\u0673\u0675-\u06D3\u06D5\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u077F\u07CA-\u07EA\u0840-\u0858\u0860\u0862-\u0865\u0867-\u086A\u0870-\u0882\u0886\u0889-\u088E\u08A0-\u08AC\u08AE-\u08C8\u1807\u1820-\u1878\u1887-\u18A8\u18AA\uA840-\uA871\u{10AC0}-\u{10AC5}\u{10AC7}\u{10AC9}\u{10ACA}\u{10ACE}-\u{10AD6}\u{10AD8}-\u{10AE1}\u{10AE4}\u{10AEB}-\u{10AEF}\u{10B80}-\u{10B91}\u{10BA9}-\u{10BAE}\u{10D01}-\u{10D23}\u{10F30}-\u{10F44}\u{10F51}-\u{10F54}\u{10F70}-\u{10F81}\u{10FB0}\u{10FB2}-\u{10FB6}\u{10FB8}-\u{10FBF}\u{10FC1}-\u{10FC4}\u{10FC9}\u{10FCA}\u{1E900}-\u{1E943}]/u;
const bidiDomain = /[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05EA\u05EF-\u05F4\u0600-\u0605\u0608\u060B\u060D\u061B-\u064A\u0660-\u0669\u066B-\u066F\u0671-\u06D5\u06DD\u06E5\u06E6\u06EE\u06EF\u06FA-\u070D\u070F\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u07FE-\u0815\u081A\u0824\u0828\u0830-\u083E\u0840-\u0858\u085E\u0860-\u086A\u0870-\u088E\u0890\u0891\u08A0-\u08C9\u08E2\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBC2\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFC\uFE70-\uFE74\uFE76-\uFEFC\u{10800}-\u{10805}\u{10808}\u{1080A}-\u{10835}\u{10837}\u{10838}\u{1083C}\u{1083F}-\u{10855}\u{10857}-\u{1089E}\u{108A7}-\u{108AF}\u{108E0}-\u{108F2}\u{108F4}\u{108F5}\u{108FB}-\u{1091B}\u{10920}-\u{10939}\u{1093F}\u{10980}-\u{109B7}\u{109BC}-\u{109CF}\u{109D2}-\u{10A00}\u{10A10}-\u{10A13}\u{10A15}-\u{10A17}\u{10A19}-\u{10A35}\u{10A40}-\u{10A48}\u{10A50}-\u{10A58}\u{10A60}-\u{10A9F}\u{10AC0}-\u{10AE4}\u{10AEB}-\u{10AF6}\u{10B00}-\u{10B35}\u{10B40}-\u{10B55}\u{10B58}-\u{10B72}\u{10B78}-\u{10B91}\u{10B99}-\u{10B9C}\u{10BA9}-\u{10BAF}\u{10C00}-\u{10C48}\u{10C80}-\u{10CB2}\u{10CC0}-\u{10CF2}\u{10CFA}-\u{10D23}\u{10D30}-\u{10D39}\u{10E60}-\u{10E7E}\u{10E80}-\u{10EA9}\u{10EAD}\u{10EB0}\u{10EB1}\u{10F00}-\u{10F27}\u{10F30}-\u{10F45}\u{10F51}-\u{10F59}\u{10F70}-\u{10F81}\u{10F86}-\u{10F89}\u{10FB0}-\u{10FCB}\u{10FE0}-\u{10FF6}\u{1E800}-\u{1E8C4}\u{1E8C7}-\u{1E8CF}\u{1E900}-\u{1E943}\u{1E94B}\u{1E950}-\u{1E959}\u{1E95E}\u{1E95F}\u{1EC71}-\u{1ECB4}\u{1ED01}-\u{1ED3D}\u{1EE00}-\u{1EE03}\u{1EE05}-\u{1EE1F}\u{1EE21}\u{1EE22}\u{1EE24}\u{1EE27}\u{1EE29}-\u{1EE32}\u{1EE34}-\u{1EE37}\u{1EE39}\u{1EE3B}\u{1EE42}\u{1EE47}\u{1EE49}\u{1EE4B}\u{1EE4D}-\u{1EE4F}\u{1EE51}\u{1EE52}\u{1EE54}\u{1EE57}\u{1EE59}\u{1EE5B}\u{1EE5D}\u{1EE5F}\u{1EE61}\u{1EE62}\u{1EE64}\u{1EE67}-\u{1EE6A}\u{1EE6C}-\u{1EE72}\u{1EE74}-\u{1EE77}\u{1EE79}-\u{1EE7C}\u{1EE7E}\u{1EE80}-\u{1EE89}\u{1EE8B}-\u{1EE9B}\u{1EEA1}-\u{1EEA3}\u{1EEA5}-\u{1EEA9}\u{1EEAB}-\u{1EEBB}]/u;
const bidiS1LTR = /[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02BB-\u02C1\u02D0\u02D1\u02E0-\u02E4\u02EE\u0370-\u0373\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0482\u048A-\u052F\u0531-\u0556\u0559-\u0589\u0903-\u0939\u093B\u093D-\u0940\u0949-\u094C\u094E-\u0950\u0958-\u0961\u0964-\u0980\u0982\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD-\u09C0\u09C7\u09C8\u09CB\u09CC\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09FA\u09FC\u09FD\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3E-\u0A40\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A76\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD-\u0AC0\u0AC9\u0ACB\u0ACC\u0AD0\u0AE0\u0AE1\u0AE6-\u0AF0\u0AF9\u0B02\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B3E\u0B40\u0B47\u0B48\u0B4B\u0B4C\u0B57\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE\u0BBF\u0BC1\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD0\u0BD7\u0BE6-\u0BF2\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C41-\u0C44\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C66-\u0C6F\u0C77\u0C7F\u0C80\u0C82-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD-\u0CC4\u0CC6-\u0CC8\u0CCA\u0CCB\u0CD5\u0CD6\u0CDD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1-\u0CF3\u0D02-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D4E\u0D4F\u0D54-\u0D61\u0D66-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCF-\u0DD1\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2-\u0DF4\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E4F-\u0E5B\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00-\u0F17\u0F1A-\u0F34\u0F36\u0F38\u0F3E-\u0F47\u0F49-\u0F6C\u0F7F\u0F85\u0F88-\u0F8C\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE-\u0FDA\u1000-\u102C\u1031\u1038\u103B\u103C\u103F-\u1057\u105A-\u105D\u1061-\u1070\u1075-\u1081\u1083\u1084\u1087-\u108C\u108E-\u109C\u109E-\u10C5\u10C7\u10CD\u10D0-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1360-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u167F\u1681-\u169A\u16A0-\u16F8\u1700-\u1711\u1715\u171F-\u1731\u1734-\u1736\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17B6\u17BE-\u17C5\u17C7\u17C8\u17D4-\u17DA\u17DC\u17E0-\u17E9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1923-\u1926\u1929-\u192B\u1930\u1931\u1933-\u1938\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A19\u1A1A\u1A1E-\u1A55\u1A57\u1A61\u1A63\u1A64\u1A6D-\u1A72\u1A80-\u1A89\u1A90-\u1A99\u1AA0-\u1AAD\u1B04-\u1B33\u1B35\u1B3B\u1B3D-\u1B41\u1B43-\u1B4C\u1B50-\u1B6A\u1B74-\u1B7E\u1B82-\u1BA1\u1BA6\u1BA7\u1BAA\u1BAE-\u1BE5\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2\u1BF3\u1BFC-\u1C2B\u1C34\u1C35\u1C3B-\u1C49\u1C4D-\u1C88\u1C90-\u1CBA\u1CBD-\u1CC7\u1CD3\u1CE1\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5-\u1CF7\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200E\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u214F\u2160-\u2188\u2336-\u237A\u2395\u249C-\u24E9\u26AC\u2800-\u28FF\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D70\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u302E\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3190-\u31BF\u31F0-\u321C\u3220-\u324F\u3260-\u327B\u327F-\u32B0\u32C0-\u32CB\u32D0-\u3376\u337B-\u33DD\u33E0-\u33FE\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA60C\uA610-\uA62B\uA640-\uA66E\uA680-\uA69D\uA6A0-\uA6EF\uA6F2-\uA6F7\uA722-\uA787\uA789-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA824\uA827\uA830-\uA837\uA840-\uA873\uA880-\uA8C3\uA8CE-\uA8D9\uA8F2-\uA8FE\uA900-\uA925\uA92E-\uA946\uA952\uA953\uA95F-\uA97C\uA983-\uA9B2\uA9B4\uA9B5\uA9BA\uA9BB\uA9BE-\uA9CD\uA9CF-\uA9D9\uA9DE-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA2F\uAA30\uAA33\uAA34\uAA40-\uAA42\uAA44-\uAA4B\uAA4D\uAA50-\uAA59\uAA5C-\uAA7B\uAA7D-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAAEB\uAAEE-\uAAF5\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB69\uAB70-\uABE4\uABE6\uABE7\uABE9-\uABEC\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uD800-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u{10000}-\u{1000B}\u{1000D}-\u{10026}\u{10028}-\u{1003A}\u{1003C}\u{1003D}\u{1003F}-\u{1004D}\u{10050}-\u{1005D}\u{10080}-\u{100FA}\u{10100}\u{10102}\u{10107}-\u{10133}\u{10137}-\u{1013F}\u{1018D}\u{1018E}\u{101D0}-\u{101FC}\u{10280}-\u{1029C}\u{102A0}-\u{102D0}\u{10300}-\u{10323}\u{1032D}-\u{1034A}\u{10350}-\u{10375}\u{10380}-\u{1039D}\u{1039F}-\u{103C3}\u{103C8}-\u{103D5}\u{10400}-\u{1049D}\u{104A0}-\u{104A9}\u{104B0}-\u{104D3}\u{104D8}-\u{104FB}\u{10500}-\u{10527}\u{10530}-\u{10563}\u{1056F}-\u{1057A}\u{1057C}-\u{1058A}\u{1058C}-\u{10592}\u{10594}\u{10595}\u{10597}-\u{105A1}\u{105A3}-\u{105B1}\u{105B3}-\u{105B9}\u{105BB}\u{105BC}\u{10600}-\u{10736}\u{10740}-\u{10755}\u{10760}-\u{10767}\u{10780}-\u{10785}\u{10787}-\u{107B0}\u{107B2}-\u{107BA}\u{11000}\u{11002}-\u{11037}\u{11047}-\u{1104D}\u{11066}-\u{1106F}\u{11071}\u{11072}\u{11075}\u{11082}-\u{110B2}\u{110B7}\u{110B8}\u{110BB}-\u{110C1}\u{110CD}\u{110D0}-\u{110E8}\u{110F0}-\u{110F9}\u{11103}-\u{11126}\u{1112C}\u{11136}-\u{11147}\u{11150}-\u{11172}\u{11174}-\u{11176}\u{11182}-\u{111B5}\u{111BF}-\u{111C8}\u{111CD}\u{111CE}\u{111D0}-\u{111DF}\u{111E1}-\u{111F4}\u{11200}-\u{11211}\u{11213}-\u{1122E}\u{11232}\u{11233}\u{11235}\u{11238}-\u{1123D}\u{1123F}\u{11240}\u{11280}-\u{11286}\u{11288}\u{1128A}-\u{1128D}\u{1128F}-\u{1129D}\u{1129F}-\u{112A9}\u{112B0}-\u{112DE}\u{112E0}-\u{112E2}\u{112F0}-\u{112F9}\u{11302}\u{11303}\u{11305}-\u{1130C}\u{1130F}\u{11310}\u{11313}-\u{11328}\u{1132A}-\u{11330}\u{11332}\u{11333}\u{11335}-\u{11339}\u{1133D}-\u{1133F}\u{11341}-\u{11344}\u{11347}\u{11348}\u{1134B}-\u{1134D}\u{11350}\u{11357}\u{1135D}-\u{11363}\u{11400}-\u{11437}\u{11440}\u{11441}\u{11445}\u{11447}-\u{1145B}\u{1145D}\u{1145F}-\u{11461}\u{11480}-\u{114B2}\u{114B9}\u{114BB}-\u{114BE}\u{114C1}\u{114C4}-\u{114C7}\u{114D0}-\u{114D9}\u{11580}-\u{115B1}\u{115B8}-\u{115BB}\u{115BE}\u{115C1}-\u{115DB}\u{11600}-\u{11632}\u{1163B}\u{1163C}\u{1163E}\u{11641}-\u{11644}\u{11650}-\u{11659}\u{11680}-\u{116AA}\u{116AC}\u{116AE}\u{116AF}\u{116B6}\u{116B8}\u{116B9}\u{116C0}-\u{116C9}\u{11700}-\u{1171A}\u{11720}\u{11721}\u{11726}\u{11730}-\u{11746}\u{11800}-\u{1182E}\u{11838}\u{1183B}\u{118A0}-\u{118F2}\u{118FF}-\u{11906}\u{11909}\u{1190C}-\u{11913}\u{11915}\u{11916}\u{11918}-\u{11935}\u{11937}\u{11938}\u{1193D}\u{1193F}-\u{11942}\u{11944}-\u{11946}\u{11950}-\u{11959}\u{119A0}-\u{119A7}\u{119AA}-\u{119D3}\u{119DC}-\u{119DF}\u{119E1}-\u{119E4}\u{11A00}\u{11A07}\u{11A08}\u{11A0B}-\u{11A32}\u{11A39}\u{11A3A}\u{11A3F}-\u{11A46}\u{11A50}\u{11A57}\u{11A58}\u{11A5C}-\u{11A89}\u{11A97}\u{11A9A}-\u{11AA2}\u{11AB0}-\u{11AF8}\u{11B00}-\u{11B09}\u{11C00}-\u{11C08}\u{11C0A}-\u{11C2F}\u{11C3E}-\u{11C45}\u{11C50}-\u{11C6C}\u{11C70}-\u{11C8F}\u{11CA9}\u{11CB1}\u{11CB4}\u{11D00}-\u{11D06}\u{11D08}\u{11D09}\u{11D0B}-\u{11D30}\u{11D46}\u{11D50}-\u{11D59}\u{11D60}-\u{11D65}\u{11D67}\u{11D68}\u{11D6A}-\u{11D8E}\u{11D93}\u{11D94}\u{11D96}\u{11D98}\u{11DA0}-\u{11DA9}\u{11EE0}-\u{11EF2}\u{11EF5}-\u{11EF8}\u{11F02}-\u{11F10}\u{11F12}-\u{11F35}\u{11F3E}\u{11F3F}\u{11F41}\u{11F43}-\u{11F59}\u{11FB0}\u{11FC0}-\u{11FD4}\u{11FFF}-\u{12399}\u{12400}-\u{1246E}\u{12470}-\u{12474}\u{12480}-\u{12543}\u{12F90}-\u{12FF2}\u{13000}-\u{1343F}\u{13441}-\u{13446}\u{14400}-\u{14646}\u{16800}-\u{16A38}\u{16A40}-\u{16A5E}\u{16A60}-\u{16A69}\u{16A6E}-\u{16ABE}\u{16AC0}-\u{16AC9}\u{16AD0}-\u{16AED}\u{16AF5}\u{16B00}-\u{16B2F}\u{16B37}-\u{16B45}\u{16B50}-\u{16B59}\u{16B5B}-\u{16B61}\u{16B63}-\u{16B77}\u{16B7D}-\u{16B8F}\u{16E40}-\u{16E9A}\u{16F00}-\u{16F4A}\u{16F50}-\u{16F87}\u{16F93}-\u{16F9F}\u{16FE0}\u{16FE1}\u{16FE3}\u{16FF0}\u{16FF1}\u{17000}-\u{187F7}\u{18800}-\u{18CD5}\u{18D00}-\u{18D08}\u{1AFF0}-\u{1AFF3}\u{1AFF5}-\u{1AFFB}\u{1AFFD}\u{1AFFE}\u{1B000}-\u{1B122}\u{1B132}\u{1B150}-\u{1B152}\u{1B155}\u{1B164}-\u{1B167}\u{1B170}-\u{1B2FB}\u{1BC00}-\u{1BC6A}\u{1BC70}-\u{1BC7C}\u{1BC80}-\u{1BC88}\u{1BC90}-\u{1BC99}\u{1BC9C}\u{1BC9F}\u{1CF50}-\u{1CFC3}\u{1D000}-\u{1D0F5}\u{1D100}-\u{1D126}\u{1D129}-\u{1D166}\u{1D16A}-\u{1D172}\u{1D183}\u{1D184}\u{1D18C}-\u{1D1A9}\u{1D1AE}-\u{1D1E8}\u{1D2C0}-\u{1D2D3}\u{1D2E0}-\u{1D2F3}\u{1D360}-\u{1D378}\u{1D400}-\u{1D454}\u{1D456}-\u{1D49C}\u{1D49E}\u{1D49F}\u{1D4A2}\u{1D4A5}\u{1D4A6}\u{1D4A9}-\u{1D4AC}\u{1D4AE}-\u{1D4B9}\u{1D4BB}\u{1D4BD}-\u{1D4C3}\u{1D4C5}-\u{1D505}\u{1D507}-\u{1D50A}\u{1D50D}-\u{1D514}\u{1D516}-\u{1D51C}\u{1D51E}-\u{1D539}\u{1D53B}-\u{1D53E}\u{1D540}-\u{1D544}\u{1D546}\u{1D54A}-\u{1D550}\u{1D552}-\u{1D6A5}\u{1D6A8}-\u{1D6DA}\u{1D6DC}-\u{1D714}\u{1D716}-\u{1D74E}\u{1D750}-\u{1D788}\u{1D78A}-\u{1D7C2}\u{1D7C4}-\u{1D7CB}\u{1D800}-\u{1D9FF}\u{1DA37}-\u{1DA3A}\u{1DA6D}-\u{1DA74}\u{1DA76}-\u{1DA83}\u{1DA85}-\u{1DA8B}\u{1DF00}-\u{1DF1E}\u{1DF25}-\u{1DF2A}\u{1E030}-\u{1E06D}\u{1E100}-\u{1E12C}\u{1E137}-\u{1E13D}\u{1E140}-\u{1E149}\u{1E14E}\u{1E14F}\u{1E290}-\u{1E2AD}\u{1E2C0}-\u{1E2EB}\u{1E2F0}-\u{1E2F9}\u{1E4D0}-\u{1E4EB}\u{1E4F0}-\u{1E4F9}\u{1E7E0}-\u{1E7E6}\u{1E7E8}-\u{1E7EB}\u{1E7ED}\u{1E7EE}\u{1E7F0}-\u{1E7FE}\u{1F110}-\u{1F12E}\u{1F130}-\u{1F169}\u{1F170}-\u{1F1AC}\u{1F1E6}-\u{1F202}\u{1F210}-\u{1F23B}\u{1F240}-\u{1F248}\u{1F250}\u{1F251}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B739}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{2EBF0}-\u{2EE5D}\u{2F800}-\u{2FA1D}\u{30000}-\u{3134A}\u{31350}-\u{323AF}\u{F0000}-\u{FFFFD}\u{100000}-\u{10FFFD}]/u;
const bidiS1RTL = /[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05EA\u05EF-\u05F4\u0608\u060B\u060D\u061B-\u064A\u066D-\u066F\u0671-\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u070D\u070F\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u07FE-\u0815\u081A\u0824\u0828\u0830-\u083E\u0840-\u0858\u085E\u0860-\u086A\u0870-\u088E\u08A0-\u08C9\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBC2\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFC\uFE70-\uFE74\uFE76-\uFEFC\u{10800}-\u{10805}\u{10808}\u{1080A}-\u{10835}\u{10837}\u{10838}\u{1083C}\u{1083F}-\u{10855}\u{10857}-\u{1089E}\u{108A7}-\u{108AF}\u{108E0}-\u{108F2}\u{108F4}\u{108F5}\u{108FB}-\u{1091B}\u{10920}-\u{10939}\u{1093F}\u{10980}-\u{109B7}\u{109BC}-\u{109CF}\u{109D2}-\u{10A00}\u{10A10}-\u{10A13}\u{10A15}-\u{10A17}\u{10A19}-\u{10A35}\u{10A40}-\u{10A48}\u{10A50}-\u{10A58}\u{10A60}-\u{10A9F}\u{10AC0}-\u{10AE4}\u{10AEB}-\u{10AF6}\u{10B00}-\u{10B35}\u{10B40}-\u{10B55}\u{10B58}-\u{10B72}\u{10B78}-\u{10B91}\u{10B99}-\u{10B9C}\u{10BA9}-\u{10BAF}\u{10C00}-\u{10C48}\u{10C80}-\u{10CB2}\u{10CC0}-\u{10CF2}\u{10CFA}-\u{10D23}\u{10E80}-\u{10EA9}\u{10EAD}\u{10EB0}\u{10EB1}\u{10F00}-\u{10F27}\u{10F30}-\u{10F45}\u{10F51}-\u{10F59}\u{10F70}-\u{10F81}\u{10F86}-\u{10F89}\u{10FB0}-\u{10FCB}\u{10FE0}-\u{10FF6}\u{1E800}-\u{1E8C4}\u{1E8C7}-\u{1E8CF}\u{1E900}-\u{1E943}\u{1E94B}\u{1E950}-\u{1E959}\u{1E95E}\u{1E95F}\u{1EC71}-\u{1ECB4}\u{1ED01}-\u{1ED3D}\u{1EE00}-\u{1EE03}\u{1EE05}-\u{1EE1F}\u{1EE21}\u{1EE22}\u{1EE24}\u{1EE27}\u{1EE29}-\u{1EE32}\u{1EE34}-\u{1EE37}\u{1EE39}\u{1EE3B}\u{1EE42}\u{1EE47}\u{1EE49}\u{1EE4B}\u{1EE4D}-\u{1EE4F}\u{1EE51}\u{1EE52}\u{1EE54}\u{1EE57}\u{1EE59}\u{1EE5B}\u{1EE5D}\u{1EE5F}\u{1EE61}\u{1EE62}\u{1EE64}\u{1EE67}-\u{1EE6A}\u{1EE6C}-\u{1EE72}\u{1EE74}-\u{1EE77}\u{1EE79}-\u{1EE7C}\u{1EE7E}\u{1EE80}-\u{1EE89}\u{1EE8B}-\u{1EE9B}\u{1EEA1}-\u{1EEA3}\u{1EEA5}-\u{1EEA9}\u{1EEAB}-\u{1EEBB}]/u;
const bidiS2 = /^[\0-\x08\x0E-\x1B!-@\[-`\{-\x84\x86-\xA9\xAB-\xB4\xB6-\xB9\xBB-\xBF\xD7\xF7\u02B9\u02BA\u02C2-\u02CF\u02D2-\u02DF\u02E5-\u02ED\u02EF-\u036F\u0374\u0375\u037E\u0384\u0385\u0387\u03F6\u0483-\u0489\u058A\u058D-\u058F\u0591-\u05C7\u05D0-\u05EA\u05EF-\u05F4\u0600-\u070D\u070F-\u074A\u074D-\u07B1\u07C0-\u07FA\u07FD-\u082D\u0830-\u083E\u0840-\u085B\u085E\u0860-\u086A\u0870-\u088E\u0890\u0891\u0898-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u09F2\u09F3\u09FB\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AF1\u0AFA-\u0AFF\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B55\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0BF3-\u0BFA\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C78-\u0C7E\u0C81\u0CBC\u0CCC\u0CCD\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0D81\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E3F\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39-\u0F3D\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1390-\u1399\u1400\u169B\u169C\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DB\u17DD\u17F0-\u17F9\u1800-\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1940\u1944\u1945\u19DE-\u19FF\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u200B-\u200D\u200F-\u2027\u202F-\u205E\u2060-\u2064\u206A-\u2070\u2074-\u207E\u2080-\u208E\u20A0-\u20C0\u20D0-\u20F0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u2150-\u215F\u2189-\u218B\u2190-\u2335\u237B-\u2394\u2396-\u2426\u2440-\u244A\u2460-\u249B\u24EA-\u26AB\u26AD-\u27FF\u2900-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2CEF-\u2CF1\u2CF9-\u2CFF\u2D7F\u2DE0-\u2E5D\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3001-\u3004\u3008-\u3020\u302A-\u302D\u3030\u3036\u3037\u303D-\u303F\u3099-\u309C\u30A0\u30FB\u31C0-\u31E3\u31EF\u321D\u321E\u3250-\u325F\u327C-\u327E\u32B1-\u32BF\u32CC-\u32CF\u3377-\u337A\u33DE\u33DF\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA60D-\uA60F\uA66F-\uA67F\uA69E\uA69F\uA6F0\uA6F1\uA700-\uA721\uA788\uA802\uA806\uA80B\uA825\uA826\uA828-\uA82C\uA838\uA839\uA874-\uA877\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uAB6A\uAB6B\uABE5\uABE8\uABED\uFB1D-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBC2\uFBD3-\uFD8F\uFD92-\uFDC7\uFDCF\uFDF0-\uFE19\uFE20-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFE70-\uFE74\uFE76-\uFEFC\uFEFF\uFF01-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFF9-\uFFFD\u{10101}\u{10140}-\u{1018C}\u{10190}-\u{1019C}\u{101A0}\u{101FD}\u{102E0}-\u{102FB}\u{10376}-\u{1037A}\u{10800}-\u{10805}\u{10808}\u{1080A}-\u{10835}\u{10837}\u{10838}\u{1083C}\u{1083F}-\u{10855}\u{10857}-\u{1089E}\u{108A7}-\u{108AF}\u{108E0}-\u{108F2}\u{108F4}\u{108F5}\u{108FB}-\u{1091B}\u{1091F}-\u{10939}\u{1093F}\u{10980}-\u{109B7}\u{109BC}-\u{109CF}\u{109D2}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A13}\u{10A15}-\u{10A17}\u{10A19}-\u{10A35}\u{10A38}-\u{10A3A}\u{10A3F}-\u{10A48}\u{10A50}-\u{10A58}\u{10A60}-\u{10A9F}\u{10AC0}-\u{10AE6}\u{10AEB}-\u{10AF6}\u{10B00}-\u{10B35}\u{10B39}-\u{10B55}\u{10B58}-\u{10B72}\u{10B78}-\u{10B91}\u{10B99}-\u{10B9C}\u{10BA9}-\u{10BAF}\u{10C00}-\u{10C48}\u{10C80}-\u{10CB2}\u{10CC0}-\u{10CF2}\u{10CFA}-\u{10D27}\u{10D30}-\u{10D39}\u{10E60}-\u{10E7E}\u{10E80}-\u{10EA9}\u{10EAB}-\u{10EAD}\u{10EB0}\u{10EB1}\u{10EFD}-\u{10F27}\u{10F30}-\u{10F59}\u{10F70}-\u{10F89}\u{10FB0}-\u{10FCB}\u{10FE0}-\u{10FF6}\u{11001}\u{11038}-\u{11046}\u{11052}-\u{11065}\u{11070}\u{11073}\u{11074}\u{1107F}-\u{11081}\u{110B3}-\u{110B6}\u{110B9}\u{110BA}\u{110C2}\u{11100}-\u{11102}\u{11127}-\u{1112B}\u{1112D}-\u{11134}\u{11173}\u{11180}\u{11181}\u{111B6}-\u{111BE}\u{111C9}-\u{111CC}\u{111CF}\u{1122F}-\u{11231}\u{11234}\u{11236}\u{11237}\u{1123E}\u{11241}\u{112DF}\u{112E3}-\u{112EA}\u{11300}\u{11301}\u{1133B}\u{1133C}\u{11340}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11438}-\u{1143F}\u{11442}-\u{11444}\u{11446}\u{1145E}\u{114B3}-\u{114B8}\u{114BA}\u{114BF}\u{114C0}\u{114C2}\u{114C3}\u{115B2}-\u{115B5}\u{115BC}\u{115BD}\u{115BF}\u{115C0}\u{115DC}\u{115DD}\u{11633}-\u{1163A}\u{1163D}\u{1163F}\u{11640}\u{11660}-\u{1166C}\u{116AB}\u{116AD}\u{116B0}-\u{116B5}\u{116B7}\u{1171D}-\u{1171F}\u{11722}-\u{11725}\u{11727}-\u{1172B}\u{1182F}-\u{11837}\u{11839}\u{1183A}\u{1193B}\u{1193C}\u{1193E}\u{11943}\u{119D4}-\u{119D7}\u{119DA}\u{119DB}\u{119E0}\u{11A01}-\u{11A06}\u{11A09}\u{11A0A}\u{11A33}-\u{11A38}\u{11A3B}-\u{11A3E}\u{11A47}\u{11A51}-\u{11A56}\u{11A59}-\u{11A5B}\u{11A8A}-\u{11A96}\u{11A98}\u{11A99}\u{11C30}-\u{11C36}\u{11C38}-\u{11C3D}\u{11C92}-\u{11CA7}\u{11CAA}-\u{11CB0}\u{11CB2}\u{11CB3}\u{11CB5}\u{11CB6}\u{11D31}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D45}\u{11D47}\u{11D90}\u{11D91}\u{11D95}\u{11D97}\u{11EF3}\u{11EF4}\u{11F00}\u{11F01}\u{11F36}-\u{11F3A}\u{11F40}\u{11F42}\u{11FD5}-\u{11FF1}\u{13440}\u{13447}-\u{13455}\u{16AF0}-\u{16AF4}\u{16B30}-\u{16B36}\u{16F4F}\u{16F8F}-\u{16F92}\u{16FE2}\u{16FE4}\u{1BC9D}\u{1BC9E}\u{1BCA0}-\u{1BCA3}\u{1CF00}-\u{1CF2D}\u{1CF30}-\u{1CF46}\u{1D167}-\u{1D169}\u{1D173}-\u{1D182}\u{1D185}-\u{1D18B}\u{1D1AA}-\u{1D1AD}\u{1D1E9}\u{1D1EA}\u{1D200}-\u{1D245}\u{1D300}-\u{1D356}\u{1D6DB}\u{1D715}\u{1D74F}\u{1D789}\u{1D7C3}\u{1D7CE}-\u{1D7FF}\u{1DA00}-\u{1DA36}\u{1DA3B}-\u{1DA6C}\u{1DA75}\u{1DA84}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E08F}\u{1E130}-\u{1E136}\u{1E2AE}\u{1E2EC}-\u{1E2EF}\u{1E2FF}\u{1E4EC}-\u{1E4EF}\u{1E800}-\u{1E8C4}\u{1E8C7}-\u{1E8D6}\u{1E900}-\u{1E94B}\u{1E950}-\u{1E959}\u{1E95E}\u{1E95F}\u{1EC71}-\u{1ECB4}\u{1ED01}-\u{1ED3D}\u{1EE00}-\u{1EE03}\u{1EE05}-\u{1EE1F}\u{1EE21}\u{1EE22}\u{1EE24}\u{1EE27}\u{1EE29}-\u{1EE32}\u{1EE34}-\u{1EE37}\u{1EE39}\u{1EE3B}\u{1EE42}\u{1EE47}\u{1EE49}\u{1EE4B}\u{1EE4D}-\u{1EE4F}\u{1EE51}\u{1EE52}\u{1EE54}\u{1EE57}\u{1EE59}\u{1EE5B}\u{1EE5D}\u{1EE5F}\u{1EE61}\u{1EE62}\u{1EE64}\u{1EE67}-\u{1EE6A}\u{1EE6C}-\u{1EE72}\u{1EE74}-\u{1EE77}\u{1EE79}-\u{1EE7C}\u{1EE7E}\u{1EE80}-\u{1EE89}\u{1EE8B}-\u{1EE9B}\u{1EEA1}-\u{1EEA3}\u{1EEA5}-\u{1EEA9}\u{1EEAB}-\u{1EEBB}\u{1EEF0}\u{1EEF1}\u{1F000}-\u{1F02B}\u{1F030}-\u{1F093}\u{1F0A0}-\u{1F0AE}\u{1F0B1}-\u{1F0BF}\u{1F0C1}-\u{1F0CF}\u{1F0D1}-\u{1F0F5}\u{1F100}-\u{1F10F}\u{1F12F}\u{1F16A}-\u{1F16F}\u{1F1AD}\u{1F260}-\u{1F265}\u{1F300}-\u{1F6D7}\u{1F6DC}-\u{1F6EC}\u{1F6F0}-\u{1F6FC}\u{1F700}-\u{1F776}\u{1F77B}-\u{1F7D9}\u{1F7E0}-\u{1F7EB}\u{1F7F0}\u{1F800}-\u{1F80B}\u{1F810}-\u{1F847}\u{1F850}-\u{1F859}\u{1F860}-\u{1F887}\u{1F890}-\u{1F8AD}\u{1F8B0}\u{1F8B1}\u{1F900}-\u{1FA53}\u{1FA60}-\u{1FA6D}\u{1FA70}-\u{1FA7C}\u{1FA80}-\u{1FA88}\u{1FA90}-\u{1FABD}\u{1FABF}-\u{1FAC5}\u{1FACE}-\u{1FADB}\u{1FAE0}-\u{1FAE8}\u{1FAF0}-\u{1FAF8}\u{1FB00}-\u{1FB92}\u{1FB94}-\u{1FBCA}\u{1FBF0}-\u{1FBF9}\u{E0001}\u{E0020}-\u{E007F}\u{E0100}-\u{E01EF}]*$/u;
const bidiS3 = /[0-9\xB2\xB3\xB9\u05BE\u05C0\u05C3\u05C6\u05D0-\u05EA\u05EF-\u05F4\u0600-\u0605\u0608\u060B\u060D\u061B-\u064A\u0660-\u0669\u066B-\u066F\u0671-\u06D5\u06DD\u06E5\u06E6\u06EE-\u070D\u070F\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u07FE-\u0815\u081A\u0824\u0828\u0830-\u083E\u0840-\u0858\u085E\u0860-\u086A\u0870-\u088E\u0890\u0891\u08A0-\u08C9\u08E2\u200F\u2070\u2074-\u2079\u2080-\u2089\u2488-\u249B\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBC2\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFC\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\u{102E1}-\u{102FB}\u{10800}-\u{10805}\u{10808}\u{1080A}-\u{10835}\u{10837}\u{10838}\u{1083C}\u{1083F}-\u{10855}\u{10857}-\u{1089E}\u{108A7}-\u{108AF}\u{108E0}-\u{108F2}\u{108F4}\u{108F5}\u{108FB}-\u{1091B}\u{10920}-\u{10939}\u{1093F}\u{10980}-\u{109B7}\u{109BC}-\u{109CF}\u{109D2}-\u{10A00}\u{10A10}-\u{10A13}\u{10A15}-\u{10A17}\u{10A19}-\u{10A35}\u{10A40}-\u{10A48}\u{10A50}-\u{10A58}\u{10A60}-\u{10A9F}\u{10AC0}-\u{10AE4}\u{10AEB}-\u{10AF6}\u{10B00}-\u{10B35}\u{10B40}-\u{10B55}\u{10B58}-\u{10B72}\u{10B78}-\u{10B91}\u{10B99}-\u{10B9C}\u{10BA9}-\u{10BAF}\u{10C00}-\u{10C48}\u{10C80}-\u{10CB2}\u{10CC0}-\u{10CF2}\u{10CFA}-\u{10D23}\u{10D30}-\u{10D39}\u{10E60}-\u{10E7E}\u{10E80}-\u{10EA9}\u{10EAD}\u{10EB0}\u{10EB1}\u{10F00}-\u{10F27}\u{10F30}-\u{10F45}\u{10F51}-\u{10F59}\u{10F70}-\u{10F81}\u{10F86}-\u{10F89}\u{10FB0}-\u{10FCB}\u{10FE0}-\u{10FF6}\u{1D7CE}-\u{1D7FF}\u{1E800}-\u{1E8C4}\u{1E8C7}-\u{1E8CF}\u{1E900}-\u{1E943}\u{1E94B}\u{1E950}-\u{1E959}\u{1E95E}\u{1E95F}\u{1EC71}-\u{1ECB4}\u{1ED01}-\u{1ED3D}\u{1EE00}-\u{1EE03}\u{1EE05}-\u{1EE1F}\u{1EE21}\u{1EE22}\u{1EE24}\u{1EE27}\u{1EE29}-\u{1EE32}\u{1EE34}-\u{1EE37}\u{1EE39}\u{1EE3B}\u{1EE42}\u{1EE47}\u{1EE49}\u{1EE4B}\u{1EE4D}-\u{1EE4F}\u{1EE51}\u{1EE52}\u{1EE54}\u{1EE57}\u{1EE59}\u{1EE5B}\u{1EE5D}\u{1EE5F}\u{1EE61}\u{1EE62}\u{1EE64}\u{1EE67}-\u{1EE6A}\u{1EE6C}-\u{1EE72}\u{1EE74}-\u{1EE77}\u{1EE79}-\u{1EE7C}\u{1EE7E}\u{1EE80}-\u{1EE89}\u{1EE8B}-\u{1EE9B}\u{1EEA1}-\u{1EEA3}\u{1EEA5}-\u{1EEA9}\u{1EEAB}-\u{1EEBB}\u{1F100}-\u{1F10A}\u{1FBF0}-\u{1FBF9}][\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B55\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CCC\u0CCD\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0D81\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\u{101FD}\u{102E0}\u{10376}-\u{1037A}\u{10A01}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A0F}\u{10A38}-\u{10A3A}\u{10A3F}\u{10AE5}\u{10AE6}\u{10D24}-\u{10D27}\u{10EAB}\u{10EAC}\u{10EFD}-\u{10EFF}\u{10F46}-\u{10F50}\u{10F82}-\u{10F85}\u{11001}\u{11038}-\u{11046}\u{11070}\u{11073}\u{11074}\u{1107F}-\u{11081}\u{110B3}-\u{110B6}\u{110B9}\u{110BA}\u{110C2}\u{11100}-\u{11102}\u{11127}-\u{1112B}\u{1112D}-\u{11134}\u{11173}\u{11180}\u{11181}\u{111B6}-\u{111BE}\u{111C9}-\u{111CC}\u{111CF}\u{1122F}-\u{11231}\u{11234}\u{11236}\u{11237}\u{1123E}\u{11241}\u{112DF}\u{112E3}-\u{112EA}\u{11300}\u{11301}\u{1133B}\u{1133C}\u{11340}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11438}-\u{1143F}\u{11442}-\u{11444}\u{11446}\u{1145E}\u{114B3}-\u{114B8}\u{114BA}\u{114BF}\u{114C0}\u{114C2}\u{114C3}\u{115B2}-\u{115B5}\u{115BC}\u{115BD}\u{115BF}\u{115C0}\u{115DC}\u{115DD}\u{11633}-\u{1163A}\u{1163D}\u{1163F}\u{11640}\u{116AB}\u{116AD}\u{116B0}-\u{116B5}\u{116B7}\u{1171D}-\u{1171F}\u{11722}-\u{11725}\u{11727}-\u{1172B}\u{1182F}-\u{11837}\u{11839}\u{1183A}\u{1193B}\u{1193C}\u{1193E}\u{11943}\u{119D4}-\u{119D7}\u{119DA}\u{119DB}\u{119E0}\u{11A01}-\u{11A06}\u{11A09}\u{11A0A}\u{11A33}-\u{11A38}\u{11A3B}-\u{11A3E}\u{11A47}\u{11A51}-\u{11A56}\u{11A59}-\u{11A5B}\u{11A8A}-\u{11A96}\u{11A98}\u{11A99}\u{11C30}-\u{11C36}\u{11C38}-\u{11C3D}\u{11C92}-\u{11CA7}\u{11CAA}-\u{11CB0}\u{11CB2}\u{11CB3}\u{11CB5}\u{11CB6}\u{11D31}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D45}\u{11D47}\u{11D90}\u{11D91}\u{11D95}\u{11D97}\u{11EF3}\u{11EF4}\u{11F00}\u{11F01}\u{11F36}-\u{11F3A}\u{11F40}\u{11F42}\u{13440}\u{13447}-\u{13455}\u{16AF0}-\u{16AF4}\u{16B30}-\u{16B36}\u{16F4F}\u{16F8F}-\u{16F92}\u{16FE4}\u{1BC9D}\u{1BC9E}\u{1CF00}-\u{1CF2D}\u{1CF30}-\u{1CF46}\u{1D167}-\u{1D169}\u{1D17B}-\u{1D182}\u{1D185}-\u{1D18B}\u{1D1AA}-\u{1D1AD}\u{1D242}-\u{1D244}\u{1DA00}-\u{1DA36}\u{1DA3B}-\u{1DA6C}\u{1DA75}\u{1DA84}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E08F}\u{1E130}-\u{1E136}\u{1E2AE}\u{1E2EC}-\u{1E2EF}\u{1E4EC}-\u{1E4EF}\u{1E8D0}-\u{1E8D6}\u{1E944}-\u{1E94A}\u{E0100}-\u{E01EF}]*$/u;
const bidiS4EN = /[0-9\xB2\xB3\xB9\u06F0-\u06F9\u2070\u2074-\u2079\u2080-\u2089\u2488-\u249B\uFF10-\uFF19\u{102E1}-\u{102FB}\u{1D7CE}-\u{1D7FF}\u{1F100}-\u{1F10A}\u{1FBF0}-\u{1FBF9}]/u;
const bidiS4AN = /[\u0600-\u0605\u0660-\u0669\u066B\u066C\u06DD\u0890\u0891\u08E2\u{10D30}-\u{10D39}\u{10E60}-\u{10E7E}]/u;
const bidiS5 = /^[\0-\x08\x0E-\x1B!-\x84\x86-\u0377\u037A-\u037F\u0384-\u038A\u038C\u038E-\u03A1\u03A3-\u052F\u0531-\u0556\u0559-\u058A\u058D-\u058F\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0606\u0607\u0609\u060A\u060C\u060E-\u061A\u064B-\u065F\u066A\u0670\u06D6-\u06DC\u06DE-\u06E4\u06E7-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07F6-\u07F9\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FE\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A76\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AF1\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B77\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BFA\u0C00-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3C-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C5D\u0C60-\u0C63\u0C66-\u0C6F\u0C77-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDD\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1-\u0CF3\u0D00-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4F\u0D54-\u0D63\u0D66-\u0D7F\u0D81-\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2-\u0DF4\u0E01-\u0E3A\u0E3F-\u0E5B\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECE\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00-\u0F47\u0F49-\u0F6C\u0F71-\u0F97\u0F99-\u0FBC\u0FBE-\u0FCC\u0FCE-\u0FDA\u1000-\u10C5\u10C7\u10CD\u10D0-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u137C\u1380-\u1399\u13A0-\u13F5\u13F8-\u13FD\u1400-\u167F\u1681-\u169C\u16A0-\u16F8\u1700-\u1715\u171F-\u1736\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17DD\u17E0-\u17E9\u17F0-\u17F9\u1800-\u1819\u1820-\u1878\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1940\u1944-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u19DE-\u1A1B\u1A1E-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA0-\u1AAD\u1AB0-\u1ACE\u1B00-\u1B4C\u1B50-\u1B7E\u1B80-\u1BF3\u1BFC-\u1C37\u1C3B-\u1C49\u1C4D-\u1C88\u1C90-\u1CBA\u1CBD-\u1CC7\u1CD0-\u1CFA\u1D00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FC4\u1FC6-\u1FD3\u1FD6-\u1FDB\u1FDD-\u1FEF\u1FF2-\u1FF4\u1FF6-\u1FFE\u200B-\u200E\u2010-\u2027\u202F-\u205E\u2060-\u2064\u206A-\u2071\u2074-\u208E\u2090-\u209C\u20A0-\u20C0\u20D0-\u20F0\u2100-\u218B\u2190-\u2426\u2440-\u244A\u2460-\u2B73\u2B76-\u2B95\u2B97-\u2CF3\u2CF9-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D70\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2E5D\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3001-\u303F\u3041-\u3096\u3099-\u30FF\u3105-\u312F\u3131-\u318E\u3190-\u31E3\u31EF-\u321E\u3220-\uA48C\uA490-\uA4C6\uA4D0-\uA62B\uA640-\uA6F7\uA700-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA82C\uA830-\uA839\uA840-\uA877\uA880-\uA8C5\uA8CE-\uA8D9\uA8E0-\uA953\uA95F-\uA97C\uA980-\uA9CD\uA9CF-\uA9D9\uA9DE-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA5C-\uAAC2\uAADB-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB6B\uAB70-\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uD800-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1E\uFB29\uFD3E-\uFD4F\uFDCF\uFDFD-\uFE19\uFE20-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFEFF\uFF01-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFF9-\uFFFD\u{10000}-\u{1000B}\u{1000D}-\u{10026}\u{10028}-\u{1003A}\u{1003C}\u{1003D}\u{1003F}-\u{1004D}\u{10050}-\u{1005D}\u{10080}-\u{100FA}\u{10100}-\u{10102}\u{10107}-\u{10133}\u{10137}-\u{1018E}\u{10190}-\u{1019C}\u{101A0}\u{101D0}-\u{101FD}\u{10280}-\u{1029C}\u{102A0}-\u{102D0}\u{102E0}-\u{102FB}\u{10300}-\u{10323}\u{1032D}-\u{1034A}\u{10350}-\u{1037A}\u{10380}-\u{1039D}\u{1039F}-\u{103C3}\u{103C8}-\u{103D5}\u{10400}-\u{1049D}\u{104A0}-\u{104A9}\u{104B0}-\u{104D3}\u{104D8}-\u{104FB}\u{10500}-\u{10527}\u{10530}-\u{10563}\u{1056F}-\u{1057A}\u{1057C}-\u{1058A}\u{1058C}-\u{10592}\u{10594}\u{10595}\u{10597}-\u{105A1}\u{105A3}-\u{105B1}\u{105B3}-\u{105B9}\u{105BB}\u{105BC}\u{10600}-\u{10736}\u{10740}-\u{10755}\u{10760}-\u{10767}\u{10780}-\u{10785}\u{10787}-\u{107B0}\u{107B2}-\u{107BA}\u{1091F}\u{10A01}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A0F}\u{10A38}-\u{10A3A}\u{10A3F}\u{10AE5}\u{10AE6}\u{10B39}-\u{10B3F}\u{10D24}-\u{10D27}\u{10EAB}\u{10EAC}\u{10EFD}-\u{10EFF}\u{10F46}-\u{10F50}\u{10F82}-\u{10F85}\u{11000}-\u{1104D}\u{11052}-\u{11075}\u{1107F}-\u{110C2}\u{110CD}\u{110D0}-\u{110E8}\u{110F0}-\u{110F9}\u{11100}-\u{11134}\u{11136}-\u{11147}\u{11150}-\u{11176}\u{11180}-\u{111DF}\u{111E1}-\u{111F4}\u{11200}-\u{11211}\u{11213}-\u{11241}\u{11280}-\u{11286}\u{11288}\u{1128A}-\u{1128D}\u{1128F}-\u{1129D}\u{1129F}-\u{112A9}\u{112B0}-\u{112EA}\u{112F0}-\u{112F9}\u{11300}-\u{11303}\u{11305}-\u{1130C}\u{1130F}\u{11310}\u{11313}-\u{11328}\u{1132A}-\u{11330}\u{11332}\u{11333}\u{11335}-\u{11339}\u{1133B}-\u{11344}\u{11347}\u{11348}\u{1134B}-\u{1134D}\u{11350}\u{11357}\u{1135D}-\u{11363}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11400}-\u{1145B}\u{1145D}-\u{11461}\u{11480}-\u{114C7}\u{114D0}-\u{114D9}\u{11580}-\u{115B5}\u{115B8}-\u{115DD}\u{11600}-\u{11644}\u{11650}-\u{11659}\u{11660}-\u{1166C}\u{11680}-\u{116B9}\u{116C0}-\u{116C9}\u{11700}-\u{1171A}\u{1171D}-\u{1172B}\u{11730}-\u{11746}\u{11800}-\u{1183B}\u{118A0}-\u{118F2}\u{118FF}-\u{11906}\u{11909}\u{1190C}-\u{11913}\u{11915}\u{11916}\u{11918}-\u{11935}\u{11937}\u{11938}\u{1193B}-\u{11946}\u{11950}-\u{11959}\u{119A0}-\u{119A7}\u{119AA}-\u{119D7}\u{119DA}-\u{119E4}\u{11A00}-\u{11A47}\u{11A50}-\u{11AA2}\u{11AB0}-\u{11AF8}\u{11B00}-\u{11B09}\u{11C00}-\u{11C08}\u{11C0A}-\u{11C36}\u{11C38}-\u{11C45}\u{11C50}-\u{11C6C}\u{11C70}-\u{11C8F}\u{11C92}-\u{11CA7}\u{11CA9}-\u{11CB6}\u{11D00}-\u{11D06}\u{11D08}\u{11D09}\u{11D0B}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D47}\u{11D50}-\u{11D59}\u{11D60}-\u{11D65}\u{11D67}\u{11D68}\u{11D6A}-\u{11D8E}\u{11D90}\u{11D91}\u{11D93}-\u{11D98}\u{11DA0}-\u{11DA9}\u{11EE0}-\u{11EF8}\u{11F00}-\u{11F10}\u{11F12}-\u{11F3A}\u{11F3E}-\u{11F59}\u{11FB0}\u{11FC0}-\u{11FF1}\u{11FFF}-\u{12399}\u{12400}-\u{1246E}\u{12470}-\u{12474}\u{12480}-\u{12543}\u{12F90}-\u{12FF2}\u{13000}-\u{13455}\u{14400}-\u{14646}\u{16800}-\u{16A38}\u{16A40}-\u{16A5E}\u{16A60}-\u{16A69}\u{16A6E}-\u{16ABE}\u{16AC0}-\u{16AC9}\u{16AD0}-\u{16AED}\u{16AF0}-\u{16AF5}\u{16B00}-\u{16B45}\u{16B50}-\u{16B59}\u{16B5B}-\u{16B61}\u{16B63}-\u{16B77}\u{16B7D}-\u{16B8F}\u{16E40}-\u{16E9A}\u{16F00}-\u{16F4A}\u{16F4F}-\u{16F87}\u{16F8F}-\u{16F9F}\u{16FE0}-\u{16FE4}\u{16FF0}\u{16FF1}\u{17000}-\u{187F7}\u{18800}-\u{18CD5}\u{18D00}-\u{18D08}\u{1AFF0}-\u{1AFF3}\u{1AFF5}-\u{1AFFB}\u{1AFFD}\u{1AFFE}\u{1B000}-\u{1B122}\u{1B132}\u{1B150}-\u{1B152}\u{1B155}\u{1B164}-\u{1B167}\u{1B170}-\u{1B2FB}\u{1BC00}-\u{1BC6A}\u{1BC70}-\u{1BC7C}\u{1BC80}-\u{1BC88}\u{1BC90}-\u{1BC99}\u{1BC9C}-\u{1BCA3}\u{1CF00}-\u{1CF2D}\u{1CF30}-\u{1CF46}\u{1CF50}-\u{1CFC3}\u{1D000}-\u{1D0F5}\u{1D100}-\u{1D126}\u{1D129}-\u{1D1EA}\u{1D200}-\u{1D245}\u{1D2C0}-\u{1D2D3}\u{1D2E0}-\u{1D2F3}\u{1D300}-\u{1D356}\u{1D360}-\u{1D378}\u{1D400}-\u{1D454}\u{1D456}-\u{1D49C}\u{1D49E}\u{1D49F}\u{1D4A2}\u{1D4A5}\u{1D4A6}\u{1D4A9}-\u{1D4AC}\u{1D4AE}-\u{1D4B9}\u{1D4BB}\u{1D4BD}-\u{1D4C3}\u{1D4C5}-\u{1D505}\u{1D507}-\u{1D50A}\u{1D50D}-\u{1D514}\u{1D516}-\u{1D51C}\u{1D51E}-\u{1D539}\u{1D53B}-\u{1D53E}\u{1D540}-\u{1D544}\u{1D546}\u{1D54A}-\u{1D550}\u{1D552}-\u{1D6A5}\u{1D6A8}-\u{1D7CB}\u{1D7CE}-\u{1DA8B}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1DF00}-\u{1DF1E}\u{1DF25}-\u{1DF2A}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E030}-\u{1E06D}\u{1E08F}\u{1E100}-\u{1E12C}\u{1E130}-\u{1E13D}\u{1E140}-\u{1E149}\u{1E14E}\u{1E14F}\u{1E290}-\u{1E2AE}\u{1E2C0}-\u{1E2F9}\u{1E2FF}\u{1E4D0}-\u{1E4F9}\u{1E7E0}-\u{1E7E6}\u{1E7E8}-\u{1E7EB}\u{1E7ED}\u{1E7EE}\u{1E7F0}-\u{1E7FE}\u{1E8D0}-\u{1E8D6}\u{1E944}-\u{1E94A}\u{1EEF0}\u{1EEF1}\u{1F000}-\u{1F02B}\u{1F030}-\u{1F093}\u{1F0A0}-\u{1F0AE}\u{1F0B1}-\u{1F0BF}\u{1F0C1}-\u{1F0CF}\u{1F0D1}-\u{1F0F5}\u{1F100}-\u{1F1AD}\u{1F1E6}-\u{1F202}\u{1F210}-\u{1F23B}\u{1F240}-\u{1F248}\u{1F250}\u{1F251}\u{1F260}-\u{1F265}\u{1F300}-\u{1F6D7}\u{1F6DC}-\u{1F6EC}\u{1F6F0}-\u{1F6FC}\u{1F700}-\u{1F776}\u{1F77B}-\u{1F7D9}\u{1F7E0}-\u{1F7EB}\u{1F7F0}\u{1F800}-\u{1F80B}\u{1F810}-\u{1F847}\u{1F850}-\u{1F859}\u{1F860}-\u{1F887}\u{1F890}-\u{1F8AD}\u{1F8B0}\u{1F8B1}\u{1F900}-\u{1FA53}\u{1FA60}-\u{1FA6D}\u{1FA70}-\u{1FA7C}\u{1FA80}-\u{1FA88}\u{1FA90}-\u{1FABD}\u{1FABF}-\u{1FAC5}\u{1FACE}-\u{1FADB}\u{1FAE0}-\u{1FAE8}\u{1FAF0}-\u{1FAF8}\u{1FB00}-\u{1FB92}\u{1FB94}-\u{1FBCA}\u{1FBF0}-\u{1FBF9}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B739}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{2EBF0}-\u{2EE5D}\u{2F800}-\u{2FA1D}\u{30000}-\u{3134A}\u{31350}-\u{323AF}\u{E0001}\u{E0020}-\u{E007F}\u{E0100}-\u{E01EF}\u{F0000}-\u{FFFFD}\u{100000}-\u{10FFFD}]*$/u;
const bidiS6 = /[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02BB-\u02C1\u02D0\u02D1\u02E0-\u02E4\u02EE\u0370-\u0373\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0482\u048A-\u052F\u0531-\u0556\u0559-\u0589\u06F0-\u06F9\u0903-\u0939\u093B\u093D-\u0940\u0949-\u094C\u094E-\u0950\u0958-\u0961\u0964-\u0980\u0982\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD-\u09C0\u09C7\u09C8\u09CB\u09CC\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09FA\u09FC\u09FD\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3E-\u0A40\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A76\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD-\u0AC0\u0AC9\u0ACB\u0ACC\u0AD0\u0AE0\u0AE1\u0AE6-\u0AF0\u0AF9\u0B02\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B3E\u0B40\u0B47\u0B48\u0B4B\u0B4C\u0B57\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE\u0BBF\u0BC1\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD0\u0BD7\u0BE6-\u0BF2\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C41-\u0C44\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C66-\u0C6F\u0C77\u0C7F\u0C80\u0C82-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD-\u0CC4\u0CC6-\u0CC8\u0CCA\u0CCB\u0CD5\u0CD6\u0CDD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1-\u0CF3\u0D02-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D4E\u0D4F\u0D54-\u0D61\u0D66-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCF-\u0DD1\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2-\u0DF4\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E4F-\u0E5B\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00-\u0F17\u0F1A-\u0F34\u0F36\u0F38\u0F3E-\u0F47\u0F49-\u0F6C\u0F7F\u0F85\u0F88-\u0F8C\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE-\u0FDA\u1000-\u102C\u1031\u1038\u103B\u103C\u103F-\u1057\u105A-\u105D\u1061-\u1070\u1075-\u1081\u1083\u1084\u1087-\u108C\u108E-\u109C\u109E-\u10C5\u10C7\u10CD\u10D0-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1360-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u167F\u1681-\u169A\u16A0-\u16F8\u1700-\u1711\u1715\u171F-\u1731\u1734-\u1736\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17B6\u17BE-\u17C5\u17C7\u17C8\u17D4-\u17DA\u17DC\u17E0-\u17E9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1923-\u1926\u1929-\u192B\u1930\u1931\u1933-\u1938\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A19\u1A1A\u1A1E-\u1A55\u1A57\u1A61\u1A63\u1A64\u1A6D-\u1A72\u1A80-\u1A89\u1A90-\u1A99\u1AA0-\u1AAD\u1B04-\u1B33\u1B35\u1B3B\u1B3D-\u1B41\u1B43-\u1B4C\u1B50-\u1B6A\u1B74-\u1B7E\u1B82-\u1BA1\u1BA6\u1BA7\u1BAA\u1BAE-\u1BE5\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2\u1BF3\u1BFC-\u1C2B\u1C34\u1C35\u1C3B-\u1C49\u1C4D-\u1C88\u1C90-\u1CBA\u1CBD-\u1CC7\u1CD3\u1CE1\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5-\u1CF7\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200E\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u214F\u2160-\u2188\u2336-\u237A\u2395\u2488-\u24E9\u26AC\u2800-\u28FF\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D70\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u302E\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3190-\u31BF\u31F0-\u321C\u3220-\u324F\u3260-\u327B\u327F-\u32B0\u32C0-\u32CB\u32D0-\u3376\u337B-\u33DD\u33E0-\u33FE\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA60C\uA610-\uA62B\uA640-\uA66E\uA680-\uA69D\uA6A0-\uA6EF\uA6F2-\uA6F7\uA722-\uA787\uA789-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA824\uA827\uA830-\uA837\uA840-\uA873\uA880-\uA8C3\uA8CE-\uA8D9\uA8F2-\uA8FE\uA900-\uA925\uA92E-\uA946\uA952\uA953\uA95F-\uA97C\uA983-\uA9B2\uA9B4\uA9B5\uA9BA\uA9BB\uA9BE-\uA9CD\uA9CF-\uA9D9\uA9DE-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA2F\uAA30\uAA33\uAA34\uAA40-\uAA42\uAA44-\uAA4B\uAA4D\uAA50-\uAA59\uAA5C-\uAA7B\uAA7D-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAAEB\uAAEE-\uAAF5\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB69\uAB70-\uABE4\uABE6\uABE7\uABE9-\uABEC\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uD800-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u{10000}-\u{1000B}\u{1000D}-\u{10026}\u{10028}-\u{1003A}\u{1003C}\u{1003D}\u{1003F}-\u{1004D}\u{10050}-\u{1005D}\u{10080}-\u{100FA}\u{10100}\u{10102}\u{10107}-\u{10133}\u{10137}-\u{1013F}\u{1018D}\u{1018E}\u{101D0}-\u{101FC}\u{10280}-\u{1029C}\u{102A0}-\u{102D0}\u{102E1}-\u{102FB}\u{10300}-\u{10323}\u{1032D}-\u{1034A}\u{10350}-\u{10375}\u{10380}-\u{1039D}\u{1039F}-\u{103C3}\u{103C8}-\u{103D5}\u{10400}-\u{1049D}\u{104A0}-\u{104A9}\u{104B0}-\u{104D3}\u{104D8}-\u{104FB}\u{10500}-\u{10527}\u{10530}-\u{10563}\u{1056F}-\u{1057A}\u{1057C}-\u{1058A}\u{1058C}-\u{10592}\u{10594}\u{10595}\u{10597}-\u{105A1}\u{105A3}-\u{105B1}\u{105B3}-\u{105B9}\u{105BB}\u{105BC}\u{10600}-\u{10736}\u{10740}-\u{10755}\u{10760}-\u{10767}\u{10780}-\u{10785}\u{10787}-\u{107B0}\u{107B2}-\u{107BA}\u{11000}\u{11002}-\u{11037}\u{11047}-\u{1104D}\u{11066}-\u{1106F}\u{11071}\u{11072}\u{11075}\u{11082}-\u{110B2}\u{110B7}\u{110B8}\u{110BB}-\u{110C1}\u{110CD}\u{110D0}-\u{110E8}\u{110F0}-\u{110F9}\u{11103}-\u{11126}\u{1112C}\u{11136}-\u{11147}\u{11150}-\u{11172}\u{11174}-\u{11176}\u{11182}-\u{111B5}\u{111BF}-\u{111C8}\u{111CD}\u{111CE}\u{111D0}-\u{111DF}\u{111E1}-\u{111F4}\u{11200}-\u{11211}\u{11213}-\u{1122E}\u{11232}\u{11233}\u{11235}\u{11238}-\u{1123D}\u{1123F}\u{11240}\u{11280}-\u{11286}\u{11288}\u{1128A}-\u{1128D}\u{1128F}-\u{1129D}\u{1129F}-\u{112A9}\u{112B0}-\u{112DE}\u{112E0}-\u{112E2}\u{112F0}-\u{112F9}\u{11302}\u{11303}\u{11305}-\u{1130C}\u{1130F}\u{11310}\u{11313}-\u{11328}\u{1132A}-\u{11330}\u{11332}\u{11333}\u{11335}-\u{11339}\u{1133D}-\u{1133F}\u{11341}-\u{11344}\u{11347}\u{11348}\u{1134B}-\u{1134D}\u{11350}\u{11357}\u{1135D}-\u{11363}\u{11400}-\u{11437}\u{11440}\u{11441}\u{11445}\u{11447}-\u{1145B}\u{1145D}\u{1145F}-\u{11461}\u{11480}-\u{114B2}\u{114B9}\u{114BB}-\u{114BE}\u{114C1}\u{114C4}-\u{114C7}\u{114D0}-\u{114D9}\u{11580}-\u{115B1}\u{115B8}-\u{115BB}\u{115BE}\u{115C1}-\u{115DB}\u{11600}-\u{11632}\u{1163B}\u{1163C}\u{1163E}\u{11641}-\u{11644}\u{11650}-\u{11659}\u{11680}-\u{116AA}\u{116AC}\u{116AE}\u{116AF}\u{116B6}\u{116B8}\u{116B9}\u{116C0}-\u{116C9}\u{11700}-\u{1171A}\u{11720}\u{11721}\u{11726}\u{11730}-\u{11746}\u{11800}-\u{1182E}\u{11838}\u{1183B}\u{118A0}-\u{118F2}\u{118FF}-\u{11906}\u{11909}\u{1190C}-\u{11913}\u{11915}\u{11916}\u{11918}-\u{11935}\u{11937}\u{11938}\u{1193D}\u{1193F}-\u{11942}\u{11944}-\u{11946}\u{11950}-\u{11959}\u{119A0}-\u{119A7}\u{119AA}-\u{119D3}\u{119DC}-\u{119DF}\u{119E1}-\u{119E4}\u{11A00}\u{11A07}\u{11A08}\u{11A0B}-\u{11A32}\u{11A39}\u{11A3A}\u{11A3F}-\u{11A46}\u{11A50}\u{11A57}\u{11A58}\u{11A5C}-\u{11A89}\u{11A97}\u{11A9A}-\u{11AA2}\u{11AB0}-\u{11AF8}\u{11B00}-\u{11B09}\u{11C00}-\u{11C08}\u{11C0A}-\u{11C2F}\u{11C3E}-\u{11C45}\u{11C50}-\u{11C6C}\u{11C70}-\u{11C8F}\u{11CA9}\u{11CB1}\u{11CB4}\u{11D00}-\u{11D06}\u{11D08}\u{11D09}\u{11D0B}-\u{11D30}\u{11D46}\u{11D50}-\u{11D59}\u{11D60}-\u{11D65}\u{11D67}\u{11D68}\u{11D6A}-\u{11D8E}\u{11D93}\u{11D94}\u{11D96}\u{11D98}\u{11DA0}-\u{11DA9}\u{11EE0}-\u{11EF2}\u{11EF5}-\u{11EF8}\u{11F02}-\u{11F10}\u{11F12}-\u{11F35}\u{11F3E}\u{11F3F}\u{11F41}\u{11F43}-\u{11F59}\u{11FB0}\u{11FC0}-\u{11FD4}\u{11FFF}-\u{12399}\u{12400}-\u{1246E}\u{12470}-\u{12474}\u{12480}-\u{12543}\u{12F90}-\u{12FF2}\u{13000}-\u{1343F}\u{13441}-\u{13446}\u{14400}-\u{14646}\u{16800}-\u{16A38}\u{16A40}-\u{16A5E}\u{16A60}-\u{16A69}\u{16A6E}-\u{16ABE}\u{16AC0}-\u{16AC9}\u{16AD0}-\u{16AED}\u{16AF5}\u{16B00}-\u{16B2F}\u{16B37}-\u{16B45}\u{16B50}-\u{16B59}\u{16B5B}-\u{16B61}\u{16B63}-\u{16B77}\u{16B7D}-\u{16B8F}\u{16E40}-\u{16E9A}\u{16F00}-\u{16F4A}\u{16F50}-\u{16F87}\u{16F93}-\u{16F9F}\u{16FE0}\u{16FE1}\u{16FE3}\u{16FF0}\u{16FF1}\u{17000}-\u{187F7}\u{18800}-\u{18CD5}\u{18D00}-\u{18D08}\u{1AFF0}-\u{1AFF3}\u{1AFF5}-\u{1AFFB}\u{1AFFD}\u{1AFFE}\u{1B000}-\u{1B122}\u{1B132}\u{1B150}-\u{1B152}\u{1B155}\u{1B164}-\u{1B167}\u{1B170}-\u{1B2FB}\u{1BC00}-\u{1BC6A}\u{1BC70}-\u{1BC7C}\u{1BC80}-\u{1BC88}\u{1BC90}-\u{1BC99}\u{1BC9C}\u{1BC9F}\u{1CF50}-\u{1CFC3}\u{1D000}-\u{1D0F5}\u{1D100}-\u{1D126}\u{1D129}-\u{1D166}\u{1D16A}-\u{1D172}\u{1D183}\u{1D184}\u{1D18C}-\u{1D1A9}\u{1D1AE}-\u{1D1E8}\u{1D2C0}-\u{1D2D3}\u{1D2E0}-\u{1D2F3}\u{1D360}-\u{1D378}\u{1D400}-\u{1D454}\u{1D456}-\u{1D49C}\u{1D49E}\u{1D49F}\u{1D4A2}\u{1D4A5}\u{1D4A6}\u{1D4A9}-\u{1D4AC}\u{1D4AE}-\u{1D4B9}\u{1D4BB}\u{1D4BD}-\u{1D4C3}\u{1D4C5}-\u{1D505}\u{1D507}-\u{1D50A}\u{1D50D}-\u{1D514}\u{1D516}-\u{1D51C}\u{1D51E}-\u{1D539}\u{1D53B}-\u{1D53E}\u{1D540}-\u{1D544}\u{1D546}\u{1D54A}-\u{1D550}\u{1D552}-\u{1D6A5}\u{1D6A8}-\u{1D6DA}\u{1D6DC}-\u{1D714}\u{1D716}-\u{1D74E}\u{1D750}-\u{1D788}\u{1D78A}-\u{1D7C2}\u{1D7C4}-\u{1D7CB}\u{1D7CE}-\u{1D9FF}\u{1DA37}-\u{1DA3A}\u{1DA6D}-\u{1DA74}\u{1DA76}-\u{1DA83}\u{1DA85}-\u{1DA8B}\u{1DF00}-\u{1DF1E}\u{1DF25}-\u{1DF2A}\u{1E030}-\u{1E06D}\u{1E100}-\u{1E12C}\u{1E137}-\u{1E13D}\u{1E140}-\u{1E149}\u{1E14E}\u{1E14F}\u{1E290}-\u{1E2AD}\u{1E2C0}-\u{1E2EB}\u{1E2F0}-\u{1E2F9}\u{1E4D0}-\u{1E4EB}\u{1E4F0}-\u{1E4F9}\u{1E7E0}-\u{1E7E6}\u{1E7E8}-\u{1E7EB}\u{1E7ED}\u{1E7EE}\u{1E7F0}-\u{1E7FE}\u{1F100}-\u{1F10A}\u{1F110}-\u{1F12E}\u{1F130}-\u{1F169}\u{1F170}-\u{1F1AC}\u{1F1E6}-\u{1F202}\u{1F210}-\u{1F23B}\u{1F240}-\u{1F248}\u{1F250}\u{1F251}\u{1FBF0}-\u{1FBF9}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B739}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{2EBF0}-\u{2EE5D}\u{2F800}-\u{2FA1D}\u{30000}-\u{3134A}\u{31350}-\u{323AF}\u{F0000}-\u{FFFFD}\u{100000}-\u{10FFFD}][\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B55\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CCC\u0CCD\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0D81\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\u{101FD}\u{102E0}\u{10376}-\u{1037A}\u{10A01}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A0F}\u{10A38}-\u{10A3A}\u{10A3F}\u{10AE5}\u{10AE6}\u{10D24}-\u{10D27}\u{10EAB}\u{10EAC}\u{10EFD}-\u{10EFF}\u{10F46}-\u{10F50}\u{10F82}-\u{10F85}\u{11001}\u{11038}-\u{11046}\u{11070}\u{11073}\u{11074}\u{1107F}-\u{11081}\u{110B3}-\u{110B6}\u{110B9}\u{110BA}\u{110C2}\u{11100}-\u{11102}\u{11127}-\u{1112B}\u{1112D}-\u{11134}\u{11173}\u{11180}\u{11181}\u{111B6}-\u{111BE}\u{111C9}-\u{111CC}\u{111CF}\u{1122F}-\u{11231}\u{11234}\u{11236}\u{11237}\u{1123E}\u{11241}\u{112DF}\u{112E3}-\u{112EA}\u{11300}\u{11301}\u{1133B}\u{1133C}\u{11340}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11438}-\u{1143F}\u{11442}-\u{11444}\u{11446}\u{1145E}\u{114B3}-\u{114B8}\u{114BA}\u{114BF}\u{114C0}\u{114C2}\u{114C3}\u{115B2}-\u{115B5}\u{115BC}\u{115BD}\u{115BF}\u{115C0}\u{115DC}\u{115DD}\u{11633}-\u{1163A}\u{1163D}\u{1163F}\u{11640}\u{116AB}\u{116AD}\u{116B0}-\u{116B5}\u{116B7}\u{1171D}-\u{1171F}\u{11722}-\u{11725}\u{11727}-\u{1172B}\u{1182F}-\u{11837}\u{11839}\u{1183A}\u{1193B}\u{1193C}\u{1193E}\u{11943}\u{119D4}-\u{119D7}\u{119DA}\u{119DB}\u{119E0}\u{11A01}-\u{11A06}\u{11A09}\u{11A0A}\u{11A33}-\u{11A38}\u{11A3B}-\u{11A3E}\u{11A47}\u{11A51}-\u{11A56}\u{11A59}-\u{11A5B}\u{11A8A}-\u{11A96}\u{11A98}\u{11A99}\u{11C30}-\u{11C36}\u{11C38}-\u{11C3D}\u{11C92}-\u{11CA7}\u{11CAA}-\u{11CB0}\u{11CB2}\u{11CB3}\u{11CB5}\u{11CB6}\u{11D31}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D45}\u{11D47}\u{11D90}\u{11D91}\u{11D95}\u{11D97}\u{11EF3}\u{11EF4}\u{11F00}\u{11F01}\u{11F36}-\u{11F3A}\u{11F40}\u{11F42}\u{13440}\u{13447}-\u{13455}\u{16AF0}-\u{16AF4}\u{16B30}-\u{16B36}\u{16F4F}\u{16F8F}-\u{16F92}\u{16FE4}\u{1BC9D}\u{1BC9E}\u{1CF00}-\u{1CF2D}\u{1CF30}-\u{1CF46}\u{1D167}-\u{1D169}\u{1D17B}-\u{1D182}\u{1D185}-\u{1D18B}\u{1D1AA}-\u{1D1AD}\u{1D242}-\u{1D244}\u{1DA00}-\u{1DA36}\u{1DA3B}-\u{1DA6C}\u{1DA75}\u{1DA84}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E08F}\u{1E130}-\u{1E136}\u{1E2AE}\u{1E2EC}-\u{1E2EF}\u{1E4EC}-\u{1E4EF}\u{1E8D0}-\u{1E8D6}\u{1E944}-\u{1E94A}\u{E0100}-\u{E01EF}]*$/u;
var regexes$1 = {
  combiningMarks,
  combiningClassVirama,
  validZWNJ,
  bidiDomain,
  bidiS1LTR,
  bidiS1RTL,
  bidiS2,
  bidiS3,
  bidiS4EN,
  bidiS4AN,
  bidiS5,
  bidiS6
};
const require$$2 = [
  [
    [
      0,
      44
    ],
    4
  ],
  [
    [
      45,
      46
    ],
    2
  ],
  [
    47,
    4
  ],
  [
    [
      48,
      57
    ],
    2
  ],
  [
    [
      58,
      64
    ],
    4
  ],
  [
    65,
    1,
    "a"
  ],
  [
    66,
    1,
    "b"
  ],
  [
    67,
    1,
    "c"
  ],
  [
    68,
    1,
    "d"
  ],
  [
    69,
    1,
    "e"
  ],
  [
    70,
    1,
    "f"
  ],
  [
    71,
    1,
    "g"
  ],
  [
    72,
    1,
    "h"
  ],
  [
    73,
    1,
    "i"
  ],
  [
    74,
    1,
    "j"
  ],
  [
    75,
    1,
    "k"
  ],
  [
    76,
    1,
    "l"
  ],
  [
    77,
    1,
    "m"
  ],
  [
    78,
    1,
    "n"
  ],
  [
    79,
    1,
    "o"
  ],
  [
    80,
    1,
    "p"
  ],
  [
    81,
    1,
    "q"
  ],
  [
    82,
    1,
    "r"
  ],
  [
    83,
    1,
    "s"
  ],
  [
    84,
    1,
    "t"
  ],
  [
    85,
    1,
    "u"
  ],
  [
    86,
    1,
    "v"
  ],
  [
    87,
    1,
    "w"
  ],
  [
    88,
    1,
    "x"
  ],
  [
    89,
    1,
    "y"
  ],
  [
    90,
    1,
    "z"
  ],
  [
    [
      91,
      96
    ],
    4
  ],
  [
    [
      97,
      122
    ],
    2
  ],
  [
    [
      123,
      127
    ],
    4
  ],
  [
    [
      128,
      159
    ],
    3
  ],
  [
    160,
    5,
    " "
  ],
  [
    [
      161,
      167
    ],
    2
  ],
  [
    168,
    5,
    " ̈"
  ],
  [
    169,
    2
  ],
  [
    170,
    1,
    "a"
  ],
  [
    [
      171,
      172
    ],
    2
  ],
  [
    173,
    7
  ],
  [
    174,
    2
  ],
  [
    175,
    5,
    " ̄"
  ],
  [
    [
      176,
      177
    ],
    2
  ],
  [
    178,
    1,
    "2"
  ],
  [
    179,
    1,
    "3"
  ],
  [
    180,
    5,
    " ́"
  ],
  [
    181,
    1,
    "μ"
  ],
  [
    182,
    2
  ],
  [
    183,
    2
  ],
  [
    184,
    5,
    " ̧"
  ],
  [
    185,
    1,
    "1"
  ],
  [
    186,
    1,
    "o"
  ],
  [
    187,
    2
  ],
  [
    188,
    1,
    "1⁄4"
  ],
  [
    189,
    1,
    "1⁄2"
  ],
  [
    190,
    1,
    "3⁄4"
  ],
  [
    191,
    2
  ],
  [
    192,
    1,
    "à"
  ],
  [
    193,
    1,
    "á"
  ],
  [
    194,
    1,
    "â"
  ],
  [
    195,
    1,
    "ã"
  ],
  [
    196,
    1,
    "ä"
  ],
  [
    197,
    1,
    "å"
  ],
  [
    198,
    1,
    "æ"
  ],
  [
    199,
    1,
    "ç"
  ],
  [
    200,
    1,
    "è"
  ],
  [
    201,
    1,
    "é"
  ],
  [
    202,
    1,
    "ê"
  ],
  [
    203,
    1,
    "ë"
  ],
  [
    204,
    1,
    "ì"
  ],
  [
    205,
    1,
    "í"
  ],
  [
    206,
    1,
    "î"
  ],
  [
    207,
    1,
    "ï"
  ],
  [
    208,
    1,
    "ð"
  ],
  [
    209,
    1,
    "ñ"
  ],
  [
    210,
    1,
    "ò"
  ],
  [
    211,
    1,
    "ó"
  ],
  [
    212,
    1,
    "ô"
  ],
  [
    213,
    1,
    "õ"
  ],
  [
    214,
    1,
    "ö"
  ],
  [
    215,
    2
  ],
  [
    216,
    1,
    "ø"
  ],
  [
    217,
    1,
    "ù"
  ],
  [
    218,
    1,
    "ú"
  ],
  [
    219,
    1,
    "û"
  ],
  [
    220,
    1,
    "ü"
  ],
  [
    221,
    1,
    "ý"
  ],
  [
    222,
    1,
    "þ"
  ],
  [
    223,
    6,
    "ss"
  ],
  [
    [
      224,
      246
    ],
    2
  ],
  [
    247,
    2
  ],
  [
    [
      248,
      255
    ],
    2
  ],
  [
    256,
    1,
    "ā"
  ],
  [
    257,
    2
  ],
  [
    258,
    1,
    "ă"
  ],
  [
    259,
    2
  ],
  [
    260,
    1,
    "ą"
  ],
  [
    261,
    2
  ],
  [
    262,
    1,
    "ć"
  ],
  [
    263,
    2
  ],
  [
    264,
    1,
    "ĉ"
  ],
  [
    265,
    2
  ],
  [
    266,
    1,
    "ċ"
  ],
  [
    267,
    2
  ],
  [
    268,
    1,
    "č"
  ],
  [
    269,
    2
  ],
  [
    270,
    1,
    "ď"
  ],
  [
    271,
    2
  ],
  [
    272,
    1,
    "đ"
  ],
  [
    273,
    2
  ],
  [
    274,
    1,
    "ē"
  ],
  [
    275,
    2
  ],
  [
    276,
    1,
    "ĕ"
  ],
  [
    277,
    2
  ],
  [
    278,
    1,
    "ė"
  ],
  [
    279,
    2
  ],
  [
    280,
    1,
    "ę"
  ],
  [
    281,
    2
  ],
  [
    282,
    1,
    "ě"
  ],
  [
    283,
    2
  ],
  [
    284,
    1,
    "ĝ"
  ],
  [
    285,
    2
  ],
  [
    286,
    1,
    "ğ"
  ],
  [
    287,
    2
  ],
  [
    288,
    1,
    "ġ"
  ],
  [
    289,
    2
  ],
  [
    290,
    1,
    "ģ"
  ],
  [
    291,
    2
  ],
  [
    292,
    1,
    "ĥ"
  ],
  [
    293,
    2
  ],
  [
    294,
    1,
    "ħ"
  ],
  [
    295,
    2
  ],
  [
    296,
    1,
    "ĩ"
  ],
  [
    297,
    2
  ],
  [
    298,
    1,
    "ī"
  ],
  [
    299,
    2
  ],
  [
    300,
    1,
    "ĭ"
  ],
  [
    301,
    2
  ],
  [
    302,
    1,
    "į"
  ],
  [
    303,
    2
  ],
  [
    304,
    1,
    "i̇"
  ],
  [
    305,
    2
  ],
  [
    [
      306,
      307
    ],
    1,
    "ij"
  ],
  [
    308,
    1,
    "ĵ"
  ],
  [
    309,
    2
  ],
  [
    310,
    1,
    "ķ"
  ],
  [
    [
      311,
      312
    ],
    2
  ],
  [
    313,
    1,
    "ĺ"
  ],
  [
    314,
    2
  ],
  [
    315,
    1,
    "ļ"
  ],
  [
    316,
    2
  ],
  [
    317,
    1,
    "ľ"
  ],
  [
    318,
    2
  ],
  [
    [
      319,
      320
    ],
    1,
    "l·"
  ],
  [
    321,
    1,
    "ł"
  ],
  [
    322,
    2
  ],
  [
    323,
    1,
    "ń"
  ],
  [
    324,
    2
  ],
  [
    325,
    1,
    "ņ"
  ],
  [
    326,
    2
  ],
  [
    327,
    1,
    "ň"
  ],
  [
    328,
    2
  ],
  [
    329,
    1,
    "ʼn"
  ],
  [
    330,
    1,
    "ŋ"
  ],
  [
    331,
    2
  ],
  [
    332,
    1,
    "ō"
  ],
  [
    333,
    2
  ],
  [
    334,
    1,
    "ŏ"
  ],
  [
    335,
    2
  ],
  [
    336,
    1,
    "ő"
  ],
  [
    337,
    2
  ],
  [
    338,
    1,
    "œ"
  ],
  [
    339,
    2
  ],
  [
    340,
    1,
    "ŕ"
  ],
  [
    341,
    2
  ],
  [
    342,
    1,
    "ŗ"
  ],
  [
    343,
    2
  ],
  [
    344,
    1,
    "ř"
  ],
  [
    345,
    2
  ],
  [
    346,
    1,
    "ś"
  ],
  [
    347,
    2
  ],
  [
    348,
    1,
    "ŝ"
  ],
  [
    349,
    2
  ],
  [
    350,
    1,
    "ş"
  ],
  [
    351,
    2
  ],
  [
    352,
    1,
    "š"
  ],
  [
    353,
    2
  ],
  [
    354,
    1,
    "ţ"
  ],
  [
    355,
    2
  ],
  [
    356,
    1,
    "ť"
  ],
  [
    357,
    2
  ],
  [
    358,
    1,
    "ŧ"
  ],
  [
    359,
    2
  ],
  [
    360,
    1,
    "ũ"
  ],
  [
    361,
    2
  ],
  [
    362,
    1,
    "ū"
  ],
  [
    363,
    2
  ],
  [
    364,
    1,
    "ŭ"
  ],
  [
    365,
    2
  ],
  [
    366,
    1,
    "ů"
  ],
  [
    367,
    2
  ],
  [
    368,
    1,
    "ű"
  ],
  [
    369,
    2
  ],
  [
    370,
    1,
    "ų"
  ],
  [
    371,
    2
  ],
  [
    372,
    1,
    "ŵ"
  ],
  [
    373,
    2
  ],
  [
    374,
    1,
    "ŷ"
  ],
  [
    375,
    2
  ],
  [
    376,
    1,
    "ÿ"
  ],
  [
    377,
    1,
    "ź"
  ],
  [
    378,
    2
  ],
  [
    379,
    1,
    "ż"
  ],
  [
    380,
    2
  ],
  [
    381,
    1,
    "ž"
  ],
  [
    382,
    2
  ],
  [
    383,
    1,
    "s"
  ],
  [
    384,
    2
  ],
  [
    385,
    1,
    "ɓ"
  ],
  [
    386,
    1,
    "ƃ"
  ],
  [
    387,
    2
  ],
  [
    388,
    1,
    "ƅ"
  ],
  [
    389,
    2
  ],
  [
    390,
    1,
    "ɔ"
  ],
  [
    391,
    1,
    "ƈ"
  ],
  [
    392,
    2
  ],
  [
    393,
    1,
    "ɖ"
  ],
  [
    394,
    1,
    "ɗ"
  ],
  [
    395,
    1,
    "ƌ"
  ],
  [
    [
      396,
      397
    ],
    2
  ],
  [
    398,
    1,
    "ǝ"
  ],
  [
    399,
    1,
    "ə"
  ],
  [
    400,
    1,
    "ɛ"
  ],
  [
    401,
    1,
    "ƒ"
  ],
  [
    402,
    2
  ],
  [
    403,
    1,
    "ɠ"
  ],
  [
    404,
    1,
    "ɣ"
  ],
  [
    405,
    2
  ],
  [
    406,
    1,
    "ɩ"
  ],
  [
    407,
    1,
    "ɨ"
  ],
  [
    408,
    1,
    "ƙ"
  ],
  [
    [
      409,
      411
    ],
    2
  ],
  [
    412,
    1,
    "ɯ"
  ],
  [
    413,
    1,
    "ɲ"
  ],
  [
    414,
    2
  ],
  [
    415,
    1,
    "ɵ"
  ],
  [
    416,
    1,
    "ơ"
  ],
  [
    417,
    2
  ],
  [
    418,
    1,
    "ƣ"
  ],
  [
    419,
    2
  ],
  [
    420,
    1,
    "ƥ"
  ],
  [
    421,
    2
  ],
  [
    422,
    1,
    "ʀ"
  ],
  [
    423,
    1,
    "ƨ"
  ],
  [
    424,
    2
  ],
  [
    425,
    1,
    "ʃ"
  ],
  [
    [
      426,
      427
    ],
    2
  ],
  [
    428,
    1,
    "ƭ"
  ],
  [
    429,
    2
  ],
  [
    430,
    1,
    "ʈ"
  ],
  [
    431,
    1,
    "ư"
  ],
  [
    432,
    2
  ],
  [
    433,
    1,
    "ʊ"
  ],
  [
    434,
    1,
    "ʋ"
  ],
  [
    435,
    1,
    "ƴ"
  ],
  [
    436,
    2
  ],
  [
    437,
    1,
    "ƶ"
  ],
  [
    438,
    2
  ],
  [
    439,
    1,
    "ʒ"
  ],
  [
    440,
    1,
    "ƹ"
  ],
  [
    [
      441,
      443
    ],
    2
  ],
  [
    444,
    1,
    "ƽ"
  ],
  [
    [
      445,
      451
    ],
    2
  ],
  [
    [
      452,
      454
    ],
    1,
    "dž"
  ],
  [
    [
      455,
      457
    ],
    1,
    "lj"
  ],
  [
    [
      458,
      460
    ],
    1,
    "nj"
  ],
  [
    461,
    1,
    "ǎ"
  ],
  [
    462,
    2
  ],
  [
    463,
    1,
    "ǐ"
  ],
  [
    464,
    2
  ],
  [
    465,
    1,
    "ǒ"
  ],
  [
    466,
    2
  ],
  [
    467,
    1,
    "ǔ"
  ],
  [
    468,
    2
  ],
  [
    469,
    1,
    "ǖ"
  ],
  [
    470,
    2
  ],
  [
    471,
    1,
    "ǘ"
  ],
  [
    472,
    2
  ],
  [
    473,
    1,
    "ǚ"
  ],
  [
    474,
    2
  ],
  [
    475,
    1,
    "ǜ"
  ],
  [
    [
      476,
      477
    ],
    2
  ],
  [
    478,
    1,
    "ǟ"
  ],
  [
    479,
    2
  ],
  [
    480,
    1,
    "ǡ"
  ],
  [
    481,
    2
  ],
  [
    482,
    1,
    "ǣ"
  ],
  [
    483,
    2
  ],
  [
    484,
    1,
    "ǥ"
  ],
  [
    485,
    2
  ],
  [
    486,
    1,
    "ǧ"
  ],
  [
    487,
    2
  ],
  [
    488,
    1,
    "ǩ"
  ],
  [
    489,
    2
  ],
  [
    490,
    1,
    "ǫ"
  ],
  [
    491,
    2
  ],
  [
    492,
    1,
    "ǭ"
  ],
  [
    493,
    2
  ],
  [
    494,
    1,
    "ǯ"
  ],
  [
    [
      495,
      496
    ],
    2
  ],
  [
    [
      497,
      499
    ],
    1,
    "dz"
  ],
  [
    500,
    1,
    "ǵ"
  ],
  [
    501,
    2
  ],
  [
    502,
    1,
    "ƕ"
  ],
  [
    503,
    1,
    "ƿ"
  ],
  [
    504,
    1,
    "ǹ"
  ],
  [
    505,
    2
  ],
  [
    506,
    1,
    "ǻ"
  ],
  [
    507,
    2
  ],
  [
    508,
    1,
    "ǽ"
  ],
  [
    509,
    2
  ],
  [
    510,
    1,
    "ǿ"
  ],
  [
    511,
    2
  ],
  [
    512,
    1,
    "ȁ"
  ],
  [
    513,
    2
  ],
  [
    514,
    1,
    "ȃ"
  ],
  [
    515,
    2
  ],
  [
    516,
    1,
    "ȅ"
  ],
  [
    517,
    2
  ],
  [
    518,
    1,
    "ȇ"
  ],
  [
    519,
    2
  ],
  [
    520,
    1,
    "ȉ"
  ],
  [
    521,
    2
  ],
  [
    522,
    1,
    "ȋ"
  ],
  [
    523,
    2
  ],
  [
    524,
    1,
    "ȍ"
  ],
  [
    525,
    2
  ],
  [
    526,
    1,
    "ȏ"
  ],
  [
    527,
    2
  ],
  [
    528,
    1,
    "ȑ"
  ],
  [
    529,
    2
  ],
  [
    530,
    1,
    "ȓ"
  ],
  [
    531,
    2
  ],
  [
    532,
    1,
    "ȕ"
  ],
  [
    533,
    2
  ],
  [
    534,
    1,
    "ȗ"
  ],
  [
    535,
    2
  ],
  [
    536,
    1,
    "ș"
  ],
  [
    537,
    2
  ],
  [
    538,
    1,
    "ț"
  ],
  [
    539,
    2
  ],
  [
    540,
    1,
    "ȝ"
  ],
  [
    541,
    2
  ],
  [
    542,
    1,
    "ȟ"
  ],
  [
    543,
    2
  ],
  [
    544,
    1,
    "ƞ"
  ],
  [
    545,
    2
  ],
  [
    546,
    1,
    "ȣ"
  ],
  [
    547,
    2
  ],
  [
    548,
    1,
    "ȥ"
  ],
  [
    549,
    2
  ],
  [
    550,
    1,
    "ȧ"
  ],
  [
    551,
    2
  ],
  [
    552,
    1,
    "ȩ"
  ],
  [
    553,
    2
  ],
  [
    554,
    1,
    "ȫ"
  ],
  [
    555,
    2
  ],
  [
    556,
    1,
    "ȭ"
  ],
  [
    557,
    2
  ],
  [
    558,
    1,
    "ȯ"
  ],
  [
    559,
    2
  ],
  [
    560,
    1,
    "ȱ"
  ],
  [
    561,
    2
  ],
  [
    562,
    1,
    "ȳ"
  ],
  [
    563,
    2
  ],
  [
    [
      564,
      566
    ],
    2
  ],
  [
    [
      567,
      569
    ],
    2
  ],
  [
    570,
    1,
    "ⱥ"
  ],
  [
    571,
    1,
    "ȼ"
  ],
  [
    572,
    2
  ],
  [
    573,
    1,
    "ƚ"
  ],
  [
    574,
    1,
    "ⱦ"
  ],
  [
    [
      575,
      576
    ],
    2
  ],
  [
    577,
    1,
    "ɂ"
  ],
  [
    578,
    2
  ],
  [
    579,
    1,
    "ƀ"
  ],
  [
    580,
    1,
    "ʉ"
  ],
  [
    581,
    1,
    "ʌ"
  ],
  [
    582,
    1,
    "ɇ"
  ],
  [
    583,
    2
  ],
  [
    584,
    1,
    "ɉ"
  ],
  [
    585,
    2
  ],
  [
    586,
    1,
    "ɋ"
  ],
  [
    587,
    2
  ],
  [
    588,
    1,
    "ɍ"
  ],
  [
    589,
    2
  ],
  [
    590,
    1,
    "ɏ"
  ],
  [
    591,
    2
  ],
  [
    [
      592,
      680
    ],
    2
  ],
  [
    [
      681,
      685
    ],
    2
  ],
  [
    [
      686,
      687
    ],
    2
  ],
  [
    688,
    1,
    "h"
  ],
  [
    689,
    1,
    "ɦ"
  ],
  [
    690,
    1,
    "j"
  ],
  [
    691,
    1,
    "r"
  ],
  [
    692,
    1,
    "ɹ"
  ],
  [
    693,
    1,
    "ɻ"
  ],
  [
    694,
    1,
    "ʁ"
  ],
  [
    695,
    1,
    "w"
  ],
  [
    696,
    1,
    "y"
  ],
  [
    [
      697,
      705
    ],
    2
  ],
  [
    [
      706,
      709
    ],
    2
  ],
  [
    [
      710,
      721
    ],
    2
  ],
  [
    [
      722,
      727
    ],
    2
  ],
  [
    728,
    5,
    " ̆"
  ],
  [
    729,
    5,
    " ̇"
  ],
  [
    730,
    5,
    " ̊"
  ],
  [
    731,
    5,
    " ̨"
  ],
  [
    732,
    5,
    " ̃"
  ],
  [
    733,
    5,
    " ̋"
  ],
  [
    734,
    2
  ],
  [
    735,
    2
  ],
  [
    736,
    1,
    "ɣ"
  ],
  [
    737,
    1,
    "l"
  ],
  [
    738,
    1,
    "s"
  ],
  [
    739,
    1,
    "x"
  ],
  [
    740,
    1,
    "ʕ"
  ],
  [
    [
      741,
      745
    ],
    2
  ],
  [
    [
      746,
      747
    ],
    2
  ],
  [
    748,
    2
  ],
  [
    749,
    2
  ],
  [
    750,
    2
  ],
  [
    [
      751,
      767
    ],
    2
  ],
  [
    [
      768,
      831
    ],
    2
  ],
  [
    832,
    1,
    "̀"
  ],
  [
    833,
    1,
    "́"
  ],
  [
    834,
    2
  ],
  [
    835,
    1,
    "̓"
  ],
  [
    836,
    1,
    "̈́"
  ],
  [
    837,
    1,
    "ι"
  ],
  [
    [
      838,
      846
    ],
    2
  ],
  [
    847,
    7
  ],
  [
    [
      848,
      855
    ],
    2
  ],
  [
    [
      856,
      860
    ],
    2
  ],
  [
    [
      861,
      863
    ],
    2
  ],
  [
    [
      864,
      865
    ],
    2
  ],
  [
    866,
    2
  ],
  [
    [
      867,
      879
    ],
    2
  ],
  [
    880,
    1,
    "ͱ"
  ],
  [
    881,
    2
  ],
  [
    882,
    1,
    "ͳ"
  ],
  [
    883,
    2
  ],
  [
    884,
    1,
    "ʹ"
  ],
  [
    885,
    2
  ],
  [
    886,
    1,
    "ͷ"
  ],
  [
    887,
    2
  ],
  [
    [
      888,
      889
    ],
    3
  ],
  [
    890,
    5,
    " ι"
  ],
  [
    [
      891,
      893
    ],
    2
  ],
  [
    894,
    5,
    ";"
  ],
  [
    895,
    1,
    "ϳ"
  ],
  [
    [
      896,
      899
    ],
    3
  ],
  [
    900,
    5,
    " ́"
  ],
  [
    901,
    5,
    " ̈́"
  ],
  [
    902,
    1,
    "ά"
  ],
  [
    903,
    1,
    "·"
  ],
  [
    904,
    1,
    "έ"
  ],
  [
    905,
    1,
    "ή"
  ],
  [
    906,
    1,
    "ί"
  ],
  [
    907,
    3
  ],
  [
    908,
    1,
    "ό"
  ],
  [
    909,
    3
  ],
  [
    910,
    1,
    "ύ"
  ],
  [
    911,
    1,
    "ώ"
  ],
  [
    912,
    2
  ],
  [
    913,
    1,
    "α"
  ],
  [
    914,
    1,
    "β"
  ],
  [
    915,
    1,
    "γ"
  ],
  [
    916,
    1,
    "δ"
  ],
  [
    917,
    1,
    "ε"
  ],
  [
    918,
    1,
    "ζ"
  ],
  [
    919,
    1,
    "η"
  ],
  [
    920,
    1,
    "θ"
  ],
  [
    921,
    1,
    "ι"
  ],
  [
    922,
    1,
    "κ"
  ],
  [
    923,
    1,
    "λ"
  ],
  [
    924,
    1,
    "μ"
  ],
  [
    925,
    1,
    "ν"
  ],
  [
    926,
    1,
    "ξ"
  ],
  [
    927,
    1,
    "ο"
  ],
  [
    928,
    1,
    "π"
  ],
  [
    929,
    1,
    "ρ"
  ],
  [
    930,
    3
  ],
  [
    931,
    1,
    "σ"
  ],
  [
    932,
    1,
    "τ"
  ],
  [
    933,
    1,
    "υ"
  ],
  [
    934,
    1,
    "φ"
  ],
  [
    935,
    1,
    "χ"
  ],
  [
    936,
    1,
    "ψ"
  ],
  [
    937,
    1,
    "ω"
  ],
  [
    938,
    1,
    "ϊ"
  ],
  [
    939,
    1,
    "ϋ"
  ],
  [
    [
      940,
      961
    ],
    2
  ],
  [
    962,
    6,
    "σ"
  ],
  [
    [
      963,
      974
    ],
    2
  ],
  [
    975,
    1,
    "ϗ"
  ],
  [
    976,
    1,
    "β"
  ],
  [
    977,
    1,
    "θ"
  ],
  [
    978,
    1,
    "υ"
  ],
  [
    979,
    1,
    "ύ"
  ],
  [
    980,
    1,
    "ϋ"
  ],
  [
    981,
    1,
    "φ"
  ],
  [
    982,
    1,
    "π"
  ],
  [
    983,
    2
  ],
  [
    984,
    1,
    "ϙ"
  ],
  [
    985,
    2
  ],
  [
    986,
    1,
    "ϛ"
  ],
  [
    987,
    2
  ],
  [
    988,
    1,
    "ϝ"
  ],
  [
    989,
    2
  ],
  [
    990,
    1,
    "ϟ"
  ],
  [
    991,
    2
  ],
  [
    992,
    1,
    "ϡ"
  ],
  [
    993,
    2
  ],
  [
    994,
    1,
    "ϣ"
  ],
  [
    995,
    2
  ],
  [
    996,
    1,
    "ϥ"
  ],
  [
    997,
    2
  ],
  [
    998,
    1,
    "ϧ"
  ],
  [
    999,
    2
  ],
  [
    1e3,
    1,
    "ϩ"
  ],
  [
    1001,
    2
  ],
  [
    1002,
    1,
    "ϫ"
  ],
  [
    1003,
    2
  ],
  [
    1004,
    1,
    "ϭ"
  ],
  [
    1005,
    2
  ],
  [
    1006,
    1,
    "ϯ"
  ],
  [
    1007,
    2
  ],
  [
    1008,
    1,
    "κ"
  ],
  [
    1009,
    1,
    "ρ"
  ],
  [
    1010,
    1,
    "σ"
  ],
  [
    1011,
    2
  ],
  [
    1012,
    1,
    "θ"
  ],
  [
    1013,
    1,
    "ε"
  ],
  [
    1014,
    2
  ],
  [
    1015,
    1,
    "ϸ"
  ],
  [
    1016,
    2
  ],
  [
    1017,
    1,
    "σ"
  ],
  [
    1018,
    1,
    "ϻ"
  ],
  [
    1019,
    2
  ],
  [
    1020,
    2
  ],
  [
    1021,
    1,
    "ͻ"
  ],
  [
    1022,
    1,
    "ͼ"
  ],
  [
    1023,
    1,
    "ͽ"
  ],
  [
    1024,
    1,
    "ѐ"
  ],
  [
    1025,
    1,
    "ё"
  ],
  [
    1026,
    1,
    "ђ"
  ],
  [
    1027,
    1,
    "ѓ"
  ],
  [
    1028,
    1,
    "є"
  ],
  [
    1029,
    1,
    "ѕ"
  ],
  [
    1030,
    1,
    "і"
  ],
  [
    1031,
    1,
    "ї"
  ],
  [
    1032,
    1,
    "ј"
  ],
  [
    1033,
    1,
    "љ"
  ],
  [
    1034,
    1,
    "њ"
  ],
  [
    1035,
    1,
    "ћ"
  ],
  [
    1036,
    1,
    "ќ"
  ],
  [
    1037,
    1,
    "ѝ"
  ],
  [
    1038,
    1,
    "ў"
  ],
  [
    1039,
    1,
    "џ"
  ],
  [
    1040,
    1,
    "а"
  ],
  [
    1041,
    1,
    "б"
  ],
  [
    1042,
    1,
    "в"
  ],
  [
    1043,
    1,
    "г"
  ],
  [
    1044,
    1,
    "д"
  ],
  [
    1045,
    1,
    "е"
  ],
  [
    1046,
    1,
    "ж"
  ],
  [
    1047,
    1,
    "з"
  ],
  [
    1048,
    1,
    "и"
  ],
  [
    1049,
    1,
    "й"
  ],
  [
    1050,
    1,
    "к"
  ],
  [
    1051,
    1,
    "л"
  ],
  [
    1052,
    1,
    "м"
  ],
  [
    1053,
    1,
    "н"
  ],
  [
    1054,
    1,
    "о"
  ],
  [
    1055,
    1,
    "п"
  ],
  [
    1056,
    1,
    "р"
  ],
  [
    1057,
    1,
    "с"
  ],
  [
    1058,
    1,
    "т"
  ],
  [
    1059,
    1,
    "у"
  ],
  [
    1060,
    1,
    "ф"
  ],
  [
    1061,
    1,
    "х"
  ],
  [
    1062,
    1,
    "ц"
  ],
  [
    1063,
    1,
    "ч"
  ],
  [
    1064,
    1,
    "ш"
  ],
  [
    1065,
    1,
    "щ"
  ],
  [
    1066,
    1,
    "ъ"
  ],
  [
    1067,
    1,
    "ы"
  ],
  [
    1068,
    1,
    "ь"
  ],
  [
    1069,
    1,
    "э"
  ],
  [
    1070,
    1,
    "ю"
  ],
  [
    1071,
    1,
    "я"
  ],
  [
    [
      1072,
      1103
    ],
    2
  ],
  [
    1104,
    2
  ],
  [
    [
      1105,
      1116
    ],
    2
  ],
  [
    1117,
    2
  ],
  [
    [
      1118,
      1119
    ],
    2
  ],
  [
    1120,
    1,
    "ѡ"
  ],
  [
    1121,
    2
  ],
  [
    1122,
    1,
    "ѣ"
  ],
  [
    1123,
    2
  ],
  [
    1124,
    1,
    "ѥ"
  ],
  [
    1125,
    2
  ],
  [
    1126,
    1,
    "ѧ"
  ],
  [
    1127,
    2
  ],
  [
    1128,
    1,
    "ѩ"
  ],
  [
    1129,
    2
  ],
  [
    1130,
    1,
    "ѫ"
  ],
  [
    1131,
    2
  ],
  [
    1132,
    1,
    "ѭ"
  ],
  [
    1133,
    2
  ],
  [
    1134,
    1,
    "ѯ"
  ],
  [
    1135,
    2
  ],
  [
    1136,
    1,
    "ѱ"
  ],
  [
    1137,
    2
  ],
  [
    1138,
    1,
    "ѳ"
  ],
  [
    1139,
    2
  ],
  [
    1140,
    1,
    "ѵ"
  ],
  [
    1141,
    2
  ],
  [
    1142,
    1,
    "ѷ"
  ],
  [
    1143,
    2
  ],
  [
    1144,
    1,
    "ѹ"
  ],
  [
    1145,
    2
  ],
  [
    1146,
    1,
    "ѻ"
  ],
  [
    1147,
    2
  ],
  [
    1148,
    1,
    "ѽ"
  ],
  [
    1149,
    2
  ],
  [
    1150,
    1,
    "ѿ"
  ],
  [
    1151,
    2
  ],
  [
    1152,
    1,
    "ҁ"
  ],
  [
    1153,
    2
  ],
  [
    1154,
    2
  ],
  [
    [
      1155,
      1158
    ],
    2
  ],
  [
    1159,
    2
  ],
  [
    [
      1160,
      1161
    ],
    2
  ],
  [
    1162,
    1,
    "ҋ"
  ],
  [
    1163,
    2
  ],
  [
    1164,
    1,
    "ҍ"
  ],
  [
    1165,
    2
  ],
  [
    1166,
    1,
    "ҏ"
  ],
  [
    1167,
    2
  ],
  [
    1168,
    1,
    "ґ"
  ],
  [
    1169,
    2
  ],
  [
    1170,
    1,
    "ғ"
  ],
  [
    1171,
    2
  ],
  [
    1172,
    1,
    "ҕ"
  ],
  [
    1173,
    2
  ],
  [
    1174,
    1,
    "җ"
  ],
  [
    1175,
    2
  ],
  [
    1176,
    1,
    "ҙ"
  ],
  [
    1177,
    2
  ],
  [
    1178,
    1,
    "қ"
  ],
  [
    1179,
    2
  ],
  [
    1180,
    1,
    "ҝ"
  ],
  [
    1181,
    2
  ],
  [
    1182,
    1,
    "ҟ"
  ],
  [
    1183,
    2
  ],
  [
    1184,
    1,
    "ҡ"
  ],
  [
    1185,
    2
  ],
  [
    1186,
    1,
    "ң"
  ],
  [
    1187,
    2
  ],
  [
    1188,
    1,
    "ҥ"
  ],
  [
    1189,
    2
  ],
  [
    1190,
    1,
    "ҧ"
  ],
  [
    1191,
    2
  ],
  [
    1192,
    1,
    "ҩ"
  ],
  [
    1193,
    2
  ],
  [
    1194,
    1,
    "ҫ"
  ],
  [
    1195,
    2
  ],
  [
    1196,
    1,
    "ҭ"
  ],
  [
    1197,
    2
  ],
  [
    1198,
    1,
    "ү"
  ],
  [
    1199,
    2
  ],
  [
    1200,
    1,
    "ұ"
  ],
  [
    1201,
    2
  ],
  [
    1202,
    1,
    "ҳ"
  ],
  [
    1203,
    2
  ],
  [
    1204,
    1,
    "ҵ"
  ],
  [
    1205,
    2
  ],
  [
    1206,
    1,
    "ҷ"
  ],
  [
    1207,
    2
  ],
  [
    1208,
    1,
    "ҹ"
  ],
  [
    1209,
    2
  ],
  [
    1210,
    1,
    "һ"
  ],
  [
    1211,
    2
  ],
  [
    1212,
    1,
    "ҽ"
  ],
  [
    1213,
    2
  ],
  [
    1214,
    1,
    "ҿ"
  ],
  [
    1215,
    2
  ],
  [
    1216,
    3
  ],
  [
    1217,
    1,
    "ӂ"
  ],
  [
    1218,
    2
  ],
  [
    1219,
    1,
    "ӄ"
  ],
  [
    1220,
    2
  ],
  [
    1221,
    1,
    "ӆ"
  ],
  [
    1222,
    2
  ],
  [
    1223,
    1,
    "ӈ"
  ],
  [
    1224,
    2
  ],
  [
    1225,
    1,
    "ӊ"
  ],
  [
    1226,
    2
  ],
  [
    1227,
    1,
    "ӌ"
  ],
  [
    1228,
    2
  ],
  [
    1229,
    1,
    "ӎ"
  ],
  [
    1230,
    2
  ],
  [
    1231,
    2
  ],
  [
    1232,
    1,
    "ӑ"
  ],
  [
    1233,
    2
  ],
  [
    1234,
    1,
    "ӓ"
  ],
  [
    1235,
    2
  ],
  [
    1236,
    1,
    "ӕ"
  ],
  [
    1237,
    2
  ],
  [
    1238,
    1,
    "ӗ"
  ],
  [
    1239,
    2
  ],
  [
    1240,
    1,
    "ә"
  ],
  [
    1241,
    2
  ],
  [
    1242,
    1,
    "ӛ"
  ],
  [
    1243,
    2
  ],
  [
    1244,
    1,
    "ӝ"
  ],
  [
    1245,
    2
  ],
  [
    1246,
    1,
    "ӟ"
  ],
  [
    1247,
    2
  ],
  [
    1248,
    1,
    "ӡ"
  ],
  [
    1249,
    2
  ],
  [
    1250,
    1,
    "ӣ"
  ],
  [
    1251,
    2
  ],
  [
    1252,
    1,
    "ӥ"
  ],
  [
    1253,
    2
  ],
  [
    1254,
    1,
    "ӧ"
  ],
  [
    1255,
    2
  ],
  [
    1256,
    1,
    "ө"
  ],
  [
    1257,
    2
  ],
  [
    1258,
    1,
    "ӫ"
  ],
  [
    1259,
    2
  ],
  [
    1260,
    1,
    "ӭ"
  ],
  [
    1261,
    2
  ],
  [
    1262,
    1,
    "ӯ"
  ],
  [
    1263,
    2
  ],
  [
    1264,
    1,
    "ӱ"
  ],
  [
    1265,
    2
  ],
  [
    1266,
    1,
    "ӳ"
  ],
  [
    1267,
    2
  ],
  [
    1268,
    1,
    "ӵ"
  ],
  [
    1269,
    2
  ],
  [
    1270,
    1,
    "ӷ"
  ],
  [
    1271,
    2
  ],
  [
    1272,
    1,
    "ӹ"
  ],
  [
    1273,
    2
  ],
  [
    1274,
    1,
    "ӻ"
  ],
  [
    1275,
    2
  ],
  [
    1276,
    1,
    "ӽ"
  ],
  [
    1277,
    2
  ],
  [
    1278,
    1,
    "ӿ"
  ],
  [
    1279,
    2
  ],
  [
    1280,
    1,
    "ԁ"
  ],
  [
    1281,
    2
  ],
  [
    1282,
    1,
    "ԃ"
  ],
  [
    1283,
    2
  ],
  [
    1284,
    1,
    "ԅ"
  ],
  [
    1285,
    2
  ],
  [
    1286,
    1,
    "ԇ"
  ],
  [
    1287,
    2
  ],
  [
    1288,
    1,
    "ԉ"
  ],
  [
    1289,
    2
  ],
  [
    1290,
    1,
    "ԋ"
  ],
  [
    1291,
    2
  ],
  [
    1292,
    1,
    "ԍ"
  ],
  [
    1293,
    2
  ],
  [
    1294,
    1,
    "ԏ"
  ],
  [
    1295,
    2
  ],
  [
    1296,
    1,
    "ԑ"
  ],
  [
    1297,
    2
  ],
  [
    1298,
    1,
    "ԓ"
  ],
  [
    1299,
    2
  ],
  [
    1300,
    1,
    "ԕ"
  ],
  [
    1301,
    2
  ],
  [
    1302,
    1,
    "ԗ"
  ],
  [
    1303,
    2
  ],
  [
    1304,
    1,
    "ԙ"
  ],
  [
    1305,
    2
  ],
  [
    1306,
    1,
    "ԛ"
  ],
  [
    1307,
    2
  ],
  [
    1308,
    1,
    "ԝ"
  ],
  [
    1309,
    2
  ],
  [
    1310,
    1,
    "ԟ"
  ],
  [
    1311,
    2
  ],
  [
    1312,
    1,
    "ԡ"
  ],
  [
    1313,
    2
  ],
  [
    1314,
    1,
    "ԣ"
  ],
  [
    1315,
    2
  ],
  [
    1316,
    1,
    "ԥ"
  ],
  [
    1317,
    2
  ],
  [
    1318,
    1,
    "ԧ"
  ],
  [
    1319,
    2
  ],
  [
    1320,
    1,
    "ԩ"
  ],
  [
    1321,
    2
  ],
  [
    1322,
    1,
    "ԫ"
  ],
  [
    1323,
    2
  ],
  [
    1324,
    1,
    "ԭ"
  ],
  [
    1325,
    2
  ],
  [
    1326,
    1,
    "ԯ"
  ],
  [
    1327,
    2
  ],
  [
    1328,
    3
  ],
  [
    1329,
    1,
    "ա"
  ],
  [
    1330,
    1,
    "բ"
  ],
  [
    1331,
    1,
    "գ"
  ],
  [
    1332,
    1,
    "դ"
  ],
  [
    1333,
    1,
    "ե"
  ],
  [
    1334,
    1,
    "զ"
  ],
  [
    1335,
    1,
    "է"
  ],
  [
    1336,
    1,
    "ը"
  ],
  [
    1337,
    1,
    "թ"
  ],
  [
    1338,
    1,
    "ժ"
  ],
  [
    1339,
    1,
    "ի"
  ],
  [
    1340,
    1,
    "լ"
  ],
  [
    1341,
    1,
    "խ"
  ],
  [
    1342,
    1,
    "ծ"
  ],
  [
    1343,
    1,
    "կ"
  ],
  [
    1344,
    1,
    "հ"
  ],
  [
    1345,
    1,
    "ձ"
  ],
  [
    1346,
    1,
    "ղ"
  ],
  [
    1347,
    1,
    "ճ"
  ],
  [
    1348,
    1,
    "մ"
  ],
  [
    1349,
    1,
    "յ"
  ],
  [
    1350,
    1,
    "ն"
  ],
  [
    1351,
    1,
    "շ"
  ],
  [
    1352,
    1,
    "ո"
  ],
  [
    1353,
    1,
    "չ"
  ],
  [
    1354,
    1,
    "պ"
  ],
  [
    1355,
    1,
    "ջ"
  ],
  [
    1356,
    1,
    "ռ"
  ],
  [
    1357,
    1,
    "ս"
  ],
  [
    1358,
    1,
    "վ"
  ],
  [
    1359,
    1,
    "տ"
  ],
  [
    1360,
    1,
    "ր"
  ],
  [
    1361,
    1,
    "ց"
  ],
  [
    1362,
    1,
    "ւ"
  ],
  [
    1363,
    1,
    "փ"
  ],
  [
    1364,
    1,
    "ք"
  ],
  [
    1365,
    1,
    "օ"
  ],
  [
    1366,
    1,
    "ֆ"
  ],
  [
    [
      1367,
      1368
    ],
    3
  ],
  [
    1369,
    2
  ],
  [
    [
      1370,
      1375
    ],
    2
  ],
  [
    1376,
    2
  ],
  [
    [
      1377,
      1414
    ],
    2
  ],
  [
    1415,
    1,
    "եւ"
  ],
  [
    1416,
    2
  ],
  [
    1417,
    2
  ],
  [
    1418,
    2
  ],
  [
    [
      1419,
      1420
    ],
    3
  ],
  [
    [
      1421,
      1422
    ],
    2
  ],
  [
    1423,
    2
  ],
  [
    1424,
    3
  ],
  [
    [
      1425,
      1441
    ],
    2
  ],
  [
    1442,
    2
  ],
  [
    [
      1443,
      1455
    ],
    2
  ],
  [
    [
      1456,
      1465
    ],
    2
  ],
  [
    1466,
    2
  ],
  [
    [
      1467,
      1469
    ],
    2
  ],
  [
    1470,
    2
  ],
  [
    1471,
    2
  ],
  [
    1472,
    2
  ],
  [
    [
      1473,
      1474
    ],
    2
  ],
  [
    1475,
    2
  ],
  [
    1476,
    2
  ],
  [
    1477,
    2
  ],
  [
    1478,
    2
  ],
  [
    1479,
    2
  ],
  [
    [
      1480,
      1487
    ],
    3
  ],
  [
    [
      1488,
      1514
    ],
    2
  ],
  [
    [
      1515,
      1518
    ],
    3
  ],
  [
    1519,
    2
  ],
  [
    [
      1520,
      1524
    ],
    2
  ],
  [
    [
      1525,
      1535
    ],
    3
  ],
  [
    [
      1536,
      1539
    ],
    3
  ],
  [
    1540,
    3
  ],
  [
    1541,
    3
  ],
  [
    [
      1542,
      1546
    ],
    2
  ],
  [
    1547,
    2
  ],
  [
    1548,
    2
  ],
  [
    [
      1549,
      1551
    ],
    2
  ],
  [
    [
      1552,
      1557
    ],
    2
  ],
  [
    [
      1558,
      1562
    ],
    2
  ],
  [
    1563,
    2
  ],
  [
    1564,
    3
  ],
  [
    1565,
    2
  ],
  [
    1566,
    2
  ],
  [
    1567,
    2
  ],
  [
    1568,
    2
  ],
  [
    [
      1569,
      1594
    ],
    2
  ],
  [
    [
      1595,
      1599
    ],
    2
  ],
  [
    1600,
    2
  ],
  [
    [
      1601,
      1618
    ],
    2
  ],
  [
    [
      1619,
      1621
    ],
    2
  ],
  [
    [
      1622,
      1624
    ],
    2
  ],
  [
    [
      1625,
      1630
    ],
    2
  ],
  [
    1631,
    2
  ],
  [
    [
      1632,
      1641
    ],
    2
  ],
  [
    [
      1642,
      1645
    ],
    2
  ],
  [
    [
      1646,
      1647
    ],
    2
  ],
  [
    [
      1648,
      1652
    ],
    2
  ],
  [
    1653,
    1,
    "اٴ"
  ],
  [
    1654,
    1,
    "وٴ"
  ],
  [
    1655,
    1,
    "ۇٴ"
  ],
  [
    1656,
    1,
    "يٴ"
  ],
  [
    [
      1657,
      1719
    ],
    2
  ],
  [
    [
      1720,
      1721
    ],
    2
  ],
  [
    [
      1722,
      1726
    ],
    2
  ],
  [
    1727,
    2
  ],
  [
    [
      1728,
      1742
    ],
    2
  ],
  [
    1743,
    2
  ],
  [
    [
      1744,
      1747
    ],
    2
  ],
  [
    1748,
    2
  ],
  [
    [
      1749,
      1756
    ],
    2
  ],
  [
    1757,
    3
  ],
  [
    1758,
    2
  ],
  [
    [
      1759,
      1768
    ],
    2
  ],
  [
    1769,
    2
  ],
  [
    [
      1770,
      1773
    ],
    2
  ],
  [
    [
      1774,
      1775
    ],
    2
  ],
  [
    [
      1776,
      1785
    ],
    2
  ],
  [
    [
      1786,
      1790
    ],
    2
  ],
  [
    1791,
    2
  ],
  [
    [
      1792,
      1805
    ],
    2
  ],
  [
    1806,
    3
  ],
  [
    1807,
    3
  ],
  [
    [
      1808,
      1836
    ],
    2
  ],
  [
    [
      1837,
      1839
    ],
    2
  ],
  [
    [
      1840,
      1866
    ],
    2
  ],
  [
    [
      1867,
      1868
    ],
    3
  ],
  [
    [
      1869,
      1871
    ],
    2
  ],
  [
    [
      1872,
      1901
    ],
    2
  ],
  [
    [
      1902,
      1919
    ],
    2
  ],
  [
    [
      1920,
      1968
    ],
    2
  ],
  [
    1969,
    2
  ],
  [
    [
      1970,
      1983
    ],
    3
  ],
  [
    [
      1984,
      2037
    ],
    2
  ],
  [
    [
      2038,
      2042
    ],
    2
  ],
  [
    [
      2043,
      2044
    ],
    3
  ],
  [
    2045,
    2
  ],
  [
    [
      2046,
      2047
    ],
    2
  ],
  [
    [
      2048,
      2093
    ],
    2
  ],
  [
    [
      2094,
      2095
    ],
    3
  ],
  [
    [
      2096,
      2110
    ],
    2
  ],
  [
    2111,
    3
  ],
  [
    [
      2112,
      2139
    ],
    2
  ],
  [
    [
      2140,
      2141
    ],
    3
  ],
  [
    2142,
    2
  ],
  [
    2143,
    3
  ],
  [
    [
      2144,
      2154
    ],
    2
  ],
  [
    [
      2155,
      2159
    ],
    3
  ],
  [
    [
      2160,
      2183
    ],
    2
  ],
  [
    2184,
    2
  ],
  [
    [
      2185,
      2190
    ],
    2
  ],
  [
    2191,
    3
  ],
  [
    [
      2192,
      2193
    ],
    3
  ],
  [
    [
      2194,
      2199
    ],
    3
  ],
  [
    [
      2200,
      2207
    ],
    2
  ],
  [
    2208,
    2
  ],
  [
    2209,
    2
  ],
  [
    [
      2210,
      2220
    ],
    2
  ],
  [
    [
      2221,
      2226
    ],
    2
  ],
  [
    [
      2227,
      2228
    ],
    2
  ],
  [
    2229,
    2
  ],
  [
    [
      2230,
      2237
    ],
    2
  ],
  [
    [
      2238,
      2247
    ],
    2
  ],
  [
    [
      2248,
      2258
    ],
    2
  ],
  [
    2259,
    2
  ],
  [
    [
      2260,
      2273
    ],
    2
  ],
  [
    2274,
    3
  ],
  [
    2275,
    2
  ],
  [
    [
      2276,
      2302
    ],
    2
  ],
  [
    2303,
    2
  ],
  [
    2304,
    2
  ],
  [
    [
      2305,
      2307
    ],
    2
  ],
  [
    2308,
    2
  ],
  [
    [
      2309,
      2361
    ],
    2
  ],
  [
    [
      2362,
      2363
    ],
    2
  ],
  [
    [
      2364,
      2381
    ],
    2
  ],
  [
    2382,
    2
  ],
  [
    2383,
    2
  ],
  [
    [
      2384,
      2388
    ],
    2
  ],
  [
    2389,
    2
  ],
  [
    [
      2390,
      2391
    ],
    2
  ],
  [
    2392,
    1,
    "क़"
  ],
  [
    2393,
    1,
    "ख़"
  ],
  [
    2394,
    1,
    "ग़"
  ],
  [
    2395,
    1,
    "ज़"
  ],
  [
    2396,
    1,
    "ड़"
  ],
  [
    2397,
    1,
    "ढ़"
  ],
  [
    2398,
    1,
    "फ़"
  ],
  [
    2399,
    1,
    "य़"
  ],
  [
    [
      2400,
      2403
    ],
    2
  ],
  [
    [
      2404,
      2405
    ],
    2
  ],
  [
    [
      2406,
      2415
    ],
    2
  ],
  [
    2416,
    2
  ],
  [
    [
      2417,
      2418
    ],
    2
  ],
  [
    [
      2419,
      2423
    ],
    2
  ],
  [
    2424,
    2
  ],
  [
    [
      2425,
      2426
    ],
    2
  ],
  [
    [
      2427,
      2428
    ],
    2
  ],
  [
    2429,
    2
  ],
  [
    [
      2430,
      2431
    ],
    2
  ],
  [
    2432,
    2
  ],
  [
    [
      2433,
      2435
    ],
    2
  ],
  [
    2436,
    3
  ],
  [
    [
      2437,
      2444
    ],
    2
  ],
  [
    [
      2445,
      2446
    ],
    3
  ],
  [
    [
      2447,
      2448
    ],
    2
  ],
  [
    [
      2449,
      2450
    ],
    3
  ],
  [
    [
      2451,
      2472
    ],
    2
  ],
  [
    2473,
    3
  ],
  [
    [
      2474,
      2480
    ],
    2
  ],
  [
    2481,
    3
  ],
  [
    2482,
    2
  ],
  [
    [
      2483,
      2485
    ],
    3
  ],
  [
    [
      2486,
      2489
    ],
    2
  ],
  [
    [
      2490,
      2491
    ],
    3
  ],
  [
    2492,
    2
  ],
  [
    2493,
    2
  ],
  [
    [
      2494,
      2500
    ],
    2
  ],
  [
    [
      2501,
      2502
    ],
    3
  ],
  [
    [
      2503,
      2504
    ],
    2
  ],
  [
    [
      2505,
      2506
    ],
    3
  ],
  [
    [
      2507,
      2509
    ],
    2
  ],
  [
    2510,
    2
  ],
  [
    [
      2511,
      2518
    ],
    3
  ],
  [
    2519,
    2
  ],
  [
    [
      2520,
      2523
    ],
    3
  ],
  [
    2524,
    1,
    "ড়"
  ],
  [
    2525,
    1,
    "ঢ়"
  ],
  [
    2526,
    3
  ],
  [
    2527,
    1,
    "য়"
  ],
  [
    [
      2528,
      2531
    ],
    2
  ],
  [
    [
      2532,
      2533
    ],
    3
  ],
  [
    [
      2534,
      2545
    ],
    2
  ],
  [
    [
      2546,
      2554
    ],
    2
  ],
  [
    2555,
    2
  ],
  [
    2556,
    2
  ],
  [
    2557,
    2
  ],
  [
    2558,
    2
  ],
  [
    [
      2559,
      2560
    ],
    3
  ],
  [
    2561,
    2
  ],
  [
    2562,
    2
  ],
  [
    2563,
    2
  ],
  [
    2564,
    3
  ],
  [
    [
      2565,
      2570
    ],
    2
  ],
  [
    [
      2571,
      2574
    ],
    3
  ],
  [
    [
      2575,
      2576
    ],
    2
  ],
  [
    [
      2577,
      2578
    ],
    3
  ],
  [
    [
      2579,
      2600
    ],
    2
  ],
  [
    2601,
    3
  ],
  [
    [
      2602,
      2608
    ],
    2
  ],
  [
    2609,
    3
  ],
  [
    2610,
    2
  ],
  [
    2611,
    1,
    "ਲ਼"
  ],
  [
    2612,
    3
  ],
  [
    2613,
    2
  ],
  [
    2614,
    1,
    "ਸ਼"
  ],
  [
    2615,
    3
  ],
  [
    [
      2616,
      2617
    ],
    2
  ],
  [
    [
      2618,
      2619
    ],
    3
  ],
  [
    2620,
    2
  ],
  [
    2621,
    3
  ],
  [
    [
      2622,
      2626
    ],
    2
  ],
  [
    [
      2627,
      2630
    ],
    3
  ],
  [
    [
      2631,
      2632
    ],
    2
  ],
  [
    [
      2633,
      2634
    ],
    3
  ],
  [
    [
      2635,
      2637
    ],
    2
  ],
  [
    [
      2638,
      2640
    ],
    3
  ],
  [
    2641,
    2
  ],
  [
    [
      2642,
      2648
    ],
    3
  ],
  [
    2649,
    1,
    "ਖ਼"
  ],
  [
    2650,
    1,
    "ਗ਼"
  ],
  [
    2651,
    1,
    "ਜ਼"
  ],
  [
    2652,
    2
  ],
  [
    2653,
    3
  ],
  [
    2654,
    1,
    "ਫ਼"
  ],
  [
    [
      2655,
      2661
    ],
    3
  ],
  [
    [
      2662,
      2676
    ],
    2
  ],
  [
    2677,
    2
  ],
  [
    2678,
    2
  ],
  [
    [
      2679,
      2688
    ],
    3
  ],
  [
    [
      2689,
      2691
    ],
    2
  ],
  [
    2692,
    3
  ],
  [
    [
      2693,
      2699
    ],
    2
  ],
  [
    2700,
    2
  ],
  [
    2701,
    2
  ],
  [
    2702,
    3
  ],
  [
    [
      2703,
      2705
    ],
    2
  ],
  [
    2706,
    3
  ],
  [
    [
      2707,
      2728
    ],
    2
  ],
  [
    2729,
    3
  ],
  [
    [
      2730,
      2736
    ],
    2
  ],
  [
    2737,
    3
  ],
  [
    [
      2738,
      2739
    ],
    2
  ],
  [
    2740,
    3
  ],
  [
    [
      2741,
      2745
    ],
    2
  ],
  [
    [
      2746,
      2747
    ],
    3
  ],
  [
    [
      2748,
      2757
    ],
    2
  ],
  [
    2758,
    3
  ],
  [
    [
      2759,
      2761
    ],
    2
  ],
  [
    2762,
    3
  ],
  [
    [
      2763,
      2765
    ],
    2
  ],
  [
    [
      2766,
      2767
    ],
    3
  ],
  [
    2768,
    2
  ],
  [
    [
      2769,
      2783
    ],
    3
  ],
  [
    2784,
    2
  ],
  [
    [
      2785,
      2787
    ],
    2
  ],
  [
    [
      2788,
      2789
    ],
    3
  ],
  [
    [
      2790,
      2799
    ],
    2
  ],
  [
    2800,
    2
  ],
  [
    2801,
    2
  ],
  [
    [
      2802,
      2808
    ],
    3
  ],
  [
    2809,
    2
  ],
  [
    [
      2810,
      2815
    ],
    2
  ],
  [
    2816,
    3
  ],
  [
    [
      2817,
      2819
    ],
    2
  ],
  [
    2820,
    3
  ],
  [
    [
      2821,
      2828
    ],
    2
  ],
  [
    [
      2829,
      2830
    ],
    3
  ],
  [
    [
      2831,
      2832
    ],
    2
  ],
  [
    [
      2833,
      2834
    ],
    3
  ],
  [
    [
      2835,
      2856
    ],
    2
  ],
  [
    2857,
    3
  ],
  [
    [
      2858,
      2864
    ],
    2
  ],
  [
    2865,
    3
  ],
  [
    [
      2866,
      2867
    ],
    2
  ],
  [
    2868,
    3
  ],
  [
    2869,
    2
  ],
  [
    [
      2870,
      2873
    ],
    2
  ],
  [
    [
      2874,
      2875
    ],
    3
  ],
  [
    [
      2876,
      2883
    ],
    2
  ],
  [
    2884,
    2
  ],
  [
    [
      2885,
      2886
    ],
    3
  ],
  [
    [
      2887,
      2888
    ],
    2
  ],
  [
    [
      2889,
      2890
    ],
    3
  ],
  [
    [
      2891,
      2893
    ],
    2
  ],
  [
    [
      2894,
      2900
    ],
    3
  ],
  [
    2901,
    2
  ],
  [
    [
      2902,
      2903
    ],
    2
  ],
  [
    [
      2904,
      2907
    ],
    3
  ],
  [
    2908,
    1,
    "ଡ଼"
  ],
  [
    2909,
    1,
    "ଢ଼"
  ],
  [
    2910,
    3
  ],
  [
    [
      2911,
      2913
    ],
    2
  ],
  [
    [
      2914,
      2915
    ],
    2
  ],
  [
    [
      2916,
      2917
    ],
    3
  ],
  [
    [
      2918,
      2927
    ],
    2
  ],
  [
    2928,
    2
  ],
  [
    2929,
    2
  ],
  [
    [
      2930,
      2935
    ],
    2
  ],
  [
    [
      2936,
      2945
    ],
    3
  ],
  [
    [
      2946,
      2947
    ],
    2
  ],
  [
    2948,
    3
  ],
  [
    [
      2949,
      2954
    ],
    2
  ],
  [
    [
      2955,
      2957
    ],
    3
  ],
  [
    [
      2958,
      2960
    ],
    2
  ],
  [
    2961,
    3
  ],
  [
    [
      2962,
      2965
    ],
    2
  ],
  [
    [
      2966,
      2968
    ],
    3
  ],
  [
    [
      2969,
      2970
    ],
    2
  ],
  [
    2971,
    3
  ],
  [
    2972,
    2
  ],
  [
    2973,
    3
  ],
  [
    [
      2974,
      2975
    ],
    2
  ],
  [
    [
      2976,
      2978
    ],
    3
  ],
  [
    [
      2979,
      2980
    ],
    2
  ],
  [
    [
      2981,
      2983
    ],
    3
  ],
  [
    [
      2984,
      2986
    ],
    2
  ],
  [
    [
      2987,
      2989
    ],
    3
  ],
  [
    [
      2990,
      2997
    ],
    2
  ],
  [
    2998,
    2
  ],
  [
    [
      2999,
      3001
    ],
    2
  ],
  [
    [
      3002,
      3005
    ],
    3
  ],
  [
    [
      3006,
      3010
    ],
    2
  ],
  [
    [
      3011,
      3013
    ],
    3
  ],
  [
    [
      3014,
      3016
    ],
    2
  ],
  [
    3017,
    3
  ],
  [
    [
      3018,
      3021
    ],
    2
  ],
  [
    [
      3022,
      3023
    ],
    3
  ],
  [
    3024,
    2
  ],
  [
    [
      3025,
      3030
    ],
    3
  ],
  [
    3031,
    2
  ],
  [
    [
      3032,
      3045
    ],
    3
  ],
  [
    3046,
    2
  ],
  [
    [
      3047,
      3055
    ],
    2
  ],
  [
    [
      3056,
      3058
    ],
    2
  ],
  [
    [
      3059,
      3066
    ],
    2
  ],
  [
    [
      3067,
      3071
    ],
    3
  ],
  [
    3072,
    2
  ],
  [
    [
      3073,
      3075
    ],
    2
  ],
  [
    3076,
    2
  ],
  [
    [
      3077,
      3084
    ],
    2
  ],
  [
    3085,
    3
  ],
  [
    [
      3086,
      3088
    ],
    2
  ],
  [
    3089,
    3
  ],
  [
    [
      3090,
      3112
    ],
    2
  ],
  [
    3113,
    3
  ],
  [
    [
      3114,
      3123
    ],
    2
  ],
  [
    3124,
    2
  ],
  [
    [
      3125,
      3129
    ],
    2
  ],
  [
    [
      3130,
      3131
    ],
    3
  ],
  [
    3132,
    2
  ],
  [
    3133,
    2
  ],
  [
    [
      3134,
      3140
    ],
    2
  ],
  [
    3141,
    3
  ],
  [
    [
      3142,
      3144
    ],
    2
  ],
  [
    3145,
    3
  ],
  [
    [
      3146,
      3149
    ],
    2
  ],
  [
    [
      3150,
      3156
    ],
    3
  ],
  [
    [
      3157,
      3158
    ],
    2
  ],
  [
    3159,
    3
  ],
  [
    [
      3160,
      3161
    ],
    2
  ],
  [
    3162,
    2
  ],
  [
    [
      3163,
      3164
    ],
    3
  ],
  [
    3165,
    2
  ],
  [
    [
      3166,
      3167
    ],
    3
  ],
  [
    [
      3168,
      3169
    ],
    2
  ],
  [
    [
      3170,
      3171
    ],
    2
  ],
  [
    [
      3172,
      3173
    ],
    3
  ],
  [
    [
      3174,
      3183
    ],
    2
  ],
  [
    [
      3184,
      3190
    ],
    3
  ],
  [
    3191,
    2
  ],
  [
    [
      3192,
      3199
    ],
    2
  ],
  [
    3200,
    2
  ],
  [
    3201,
    2
  ],
  [
    [
      3202,
      3203
    ],
    2
  ],
  [
    3204,
    2
  ],
  [
    [
      3205,
      3212
    ],
    2
  ],
  [
    3213,
    3
  ],
  [
    [
      3214,
      3216
    ],
    2
  ],
  [
    3217,
    3
  ],
  [
    [
      3218,
      3240
    ],
    2
  ],
  [
    3241,
    3
  ],
  [
    [
      3242,
      3251
    ],
    2
  ],
  [
    3252,
    3
  ],
  [
    [
      3253,
      3257
    ],
    2
  ],
  [
    [
      3258,
      3259
    ],
    3
  ],
  [
    [
      3260,
      3261
    ],
    2
  ],
  [
    [
      3262,
      3268
    ],
    2
  ],
  [
    3269,
    3
  ],
  [
    [
      3270,
      3272
    ],
    2
  ],
  [
    3273,
    3
  ],
  [
    [
      3274,
      3277
    ],
    2
  ],
  [
    [
      3278,
      3284
    ],
    3
  ],
  [
    [
      3285,
      3286
    ],
    2
  ],
  [
    [
      3287,
      3292
    ],
    3
  ],
  [
    3293,
    2
  ],
  [
    3294,
    2
  ],
  [
    3295,
    3
  ],
  [
    [
      3296,
      3297
    ],
    2
  ],
  [
    [
      3298,
      3299
    ],
    2
  ],
  [
    [
      3300,
      3301
    ],
    3
  ],
  [
    [
      3302,
      3311
    ],
    2
  ],
  [
    3312,
    3
  ],
  [
    [
      3313,
      3314
    ],
    2
  ],
  [
    3315,
    2
  ],
  [
    [
      3316,
      3327
    ],
    3
  ],
  [
    3328,
    2
  ],
  [
    3329,
    2
  ],
  [
    [
      3330,
      3331
    ],
    2
  ],
  [
    3332,
    2
  ],
  [
    [
      3333,
      3340
    ],
    2
  ],
  [
    3341,
    3
  ],
  [
    [
      3342,
      3344
    ],
    2
  ],
  [
    3345,
    3
  ],
  [
    [
      3346,
      3368
    ],
    2
  ],
  [
    3369,
    2
  ],
  [
    [
      3370,
      3385
    ],
    2
  ],
  [
    3386,
    2
  ],
  [
    [
      3387,
      3388
    ],
    2
  ],
  [
    3389,
    2
  ],
  [
    [
      3390,
      3395
    ],
    2
  ],
  [
    3396,
    2
  ],
  [
    3397,
    3
  ],
  [
    [
      3398,
      3400
    ],
    2
  ],
  [
    3401,
    3
  ],
  [
    [
      3402,
      3405
    ],
    2
  ],
  [
    3406,
    2
  ],
  [
    3407,
    2
  ],
  [
    [
      3408,
      3411
    ],
    3
  ],
  [
    [
      3412,
      3414
    ],
    2
  ],
  [
    3415,
    2
  ],
  [
    [
      3416,
      3422
    ],
    2
  ],
  [
    3423,
    2
  ],
  [
    [
      3424,
      3425
    ],
    2
  ],
  [
    [
      3426,
      3427
    ],
    2
  ],
  [
    [
      3428,
      3429
    ],
    3
  ],
  [
    [
      3430,
      3439
    ],
    2
  ],
  [
    [
      3440,
      3445
    ],
    2
  ],
  [
    [
      3446,
      3448
    ],
    2
  ],
  [
    3449,
    2
  ],
  [
    [
      3450,
      3455
    ],
    2
  ],
  [
    3456,
    3
  ],
  [
    3457,
    2
  ],
  [
    [
      3458,
      3459
    ],
    2
  ],
  [
    3460,
    3
  ],
  [
    [
      3461,
      3478
    ],
    2
  ],
  [
    [
      3479,
      3481
    ],
    3
  ],
  [
    [
      3482,
      3505
    ],
    2
  ],
  [
    3506,
    3
  ],
  [
    [
      3507,
      3515
    ],
    2
  ],
  [
    3516,
    3
  ],
  [
    3517,
    2
  ],
  [
    [
      3518,
      3519
    ],
    3
  ],
  [
    [
      3520,
      3526
    ],
    2
  ],
  [
    [
      3527,
      3529
    ],
    3
  ],
  [
    3530,
    2
  ],
  [
    [
      3531,
      3534
    ],
    3
  ],
  [
    [
      3535,
      3540
    ],
    2
  ],
  [
    3541,
    3
  ],
  [
    3542,
    2
  ],
  [
    3543,
    3
  ],
  [
    [
      3544,
      3551
    ],
    2
  ],
  [
    [
      3552,
      3557
    ],
    3
  ],
  [
    [
      3558,
      3567
    ],
    2
  ],
  [
    [
      3568,
      3569
    ],
    3
  ],
  [
    [
      3570,
      3571
    ],
    2
  ],
  [
    3572,
    2
  ],
  [
    [
      3573,
      3584
    ],
    3
  ],
  [
    [
      3585,
      3634
    ],
    2
  ],
  [
    3635,
    1,
    "ํา"
  ],
  [
    [
      3636,
      3642
    ],
    2
  ],
  [
    [
      3643,
      3646
    ],
    3
  ],
  [
    3647,
    2
  ],
  [
    [
      3648,
      3662
    ],
    2
  ],
  [
    3663,
    2
  ],
  [
    [
      3664,
      3673
    ],
    2
  ],
  [
    [
      3674,
      3675
    ],
    2
  ],
  [
    [
      3676,
      3712
    ],
    3
  ],
  [
    [
      3713,
      3714
    ],
    2
  ],
  [
    3715,
    3
  ],
  [
    3716,
    2
  ],
  [
    3717,
    3
  ],
  [
    3718,
    2
  ],
  [
    [
      3719,
      3720
    ],
    2
  ],
  [
    3721,
    2
  ],
  [
    3722,
    2
  ],
  [
    3723,
    3
  ],
  [
    3724,
    2
  ],
  [
    3725,
    2
  ],
  [
    [
      3726,
      3731
    ],
    2
  ],
  [
    [
      3732,
      3735
    ],
    2
  ],
  [
    3736,
    2
  ],
  [
    [
      3737,
      3743
    ],
    2
  ],
  [
    3744,
    2
  ],
  [
    [
      3745,
      3747
    ],
    2
  ],
  [
    3748,
    3
  ],
  [
    3749,
    2
  ],
  [
    3750,
    3
  ],
  [
    3751,
    2
  ],
  [
    [
      3752,
      3753
    ],
    2
  ],
  [
    [
      3754,
      3755
    ],
    2
  ],
  [
    3756,
    2
  ],
  [
    [
      3757,
      3762
    ],
    2
  ],
  [
    3763,
    1,
    "ໍາ"
  ],
  [
    [
      3764,
      3769
    ],
    2
  ],
  [
    3770,
    2
  ],
  [
    [
      3771,
      3773
    ],
    2
  ],
  [
    [
      3774,
      3775
    ],
    3
  ],
  [
    [
      3776,
      3780
    ],
    2
  ],
  [
    3781,
    3
  ],
  [
    3782,
    2
  ],
  [
    3783,
    3
  ],
  [
    [
      3784,
      3789
    ],
    2
  ],
  [
    3790,
    2
  ],
  [
    3791,
    3
  ],
  [
    [
      3792,
      3801
    ],
    2
  ],
  [
    [
      3802,
      3803
    ],
    3
  ],
  [
    3804,
    1,
    "ຫນ"
  ],
  [
    3805,
    1,
    "ຫມ"
  ],
  [
    [
      3806,
      3807
    ],
    2
  ],
  [
    [
      3808,
      3839
    ],
    3
  ],
  [
    3840,
    2
  ],
  [
    [
      3841,
      3850
    ],
    2
  ],
  [
    3851,
    2
  ],
  [
    3852,
    1,
    "་"
  ],
  [
    [
      3853,
      3863
    ],
    2
  ],
  [
    [
      3864,
      3865
    ],
    2
  ],
  [
    [
      3866,
      3871
    ],
    2
  ],
  [
    [
      3872,
      3881
    ],
    2
  ],
  [
    [
      3882,
      3892
    ],
    2
  ],
  [
    3893,
    2
  ],
  [
    3894,
    2
  ],
  [
    3895,
    2
  ],
  [
    3896,
    2
  ],
  [
    3897,
    2
  ],
  [
    [
      3898,
      3901
    ],
    2
  ],
  [
    [
      3902,
      3906
    ],
    2
  ],
  [
    3907,
    1,
    "གྷ"
  ],
  [
    [
      3908,
      3911
    ],
    2
  ],
  [
    3912,
    3
  ],
  [
    [
      3913,
      3916
    ],
    2
  ],
  [
    3917,
    1,
    "ཌྷ"
  ],
  [
    [
      3918,
      3921
    ],
    2
  ],
  [
    3922,
    1,
    "དྷ"
  ],
  [
    [
      3923,
      3926
    ],
    2
  ],
  [
    3927,
    1,
    "བྷ"
  ],
  [
    [
      3928,
      3931
    ],
    2
  ],
  [
    3932,
    1,
    "ཛྷ"
  ],
  [
    [
      3933,
      3944
    ],
    2
  ],
  [
    3945,
    1,
    "ཀྵ"
  ],
  [
    3946,
    2
  ],
  [
    [
      3947,
      3948
    ],
    2
  ],
  [
    [
      3949,
      3952
    ],
    3
  ],
  [
    [
      3953,
      3954
    ],
    2
  ],
  [
    3955,
    1,
    "ཱི"
  ],
  [
    3956,
    2
  ],
  [
    3957,
    1,
    "ཱུ"
  ],
  [
    3958,
    1,
    "ྲྀ"
  ],
  [
    3959,
    1,
    "ྲཱྀ"
  ],
  [
    3960,
    1,
    "ླྀ"
  ],
  [
    3961,
    1,
    "ླཱྀ"
  ],
  [
    [
      3962,
      3968
    ],
    2
  ],
  [
    3969,
    1,
    "ཱྀ"
  ],
  [
    [
      3970,
      3972
    ],
    2
  ],
  [
    3973,
    2
  ],
  [
    [
      3974,
      3979
    ],
    2
  ],
  [
    [
      3980,
      3983
    ],
    2
  ],
  [
    [
      3984,
      3986
    ],
    2
  ],
  [
    3987,
    1,
    "ྒྷ"
  ],
  [
    [
      3988,
      3989
    ],
    2
  ],
  [
    3990,
    2
  ],
  [
    3991,
    2
  ],
  [
    3992,
    3
  ],
  [
    [
      3993,
      3996
    ],
    2
  ],
  [
    3997,
    1,
    "ྜྷ"
  ],
  [
    [
      3998,
      4001
    ],
    2
  ],
  [
    4002,
    1,
    "ྡྷ"
  ],
  [
    [
      4003,
      4006
    ],
    2
  ],
  [
    4007,
    1,
    "ྦྷ"
  ],
  [
    [
      4008,
      4011
    ],
    2
  ],
  [
    4012,
    1,
    "ྫྷ"
  ],
  [
    4013,
    2
  ],
  [
    [
      4014,
      4016
    ],
    2
  ],
  [
    [
      4017,
      4023
    ],
    2
  ],
  [
    4024,
    2
  ],
  [
    4025,
    1,
    "ྐྵ"
  ],
  [
    [
      4026,
      4028
    ],
    2
  ],
  [
    4029,
    3
  ],
  [
    [
      4030,
      4037
    ],
    2
  ],
  [
    4038,
    2
  ],
  [
    [
      4039,
      4044
    ],
    2
  ],
  [
    4045,
    3
  ],
  [
    4046,
    2
  ],
  [
    4047,
    2
  ],
  [
    [
      4048,
      4049
    ],
    2
  ],
  [
    [
      4050,
      4052
    ],
    2
  ],
  [
    [
      4053,
      4056
    ],
    2
  ],
  [
    [
      4057,
      4058
    ],
    2
  ],
  [
    [
      4059,
      4095
    ],
    3
  ],
  [
    [
      4096,
      4129
    ],
    2
  ],
  [
    4130,
    2
  ],
  [
    [
      4131,
      4135
    ],
    2
  ],
  [
    4136,
    2
  ],
  [
    [
      4137,
      4138
    ],
    2
  ],
  [
    4139,
    2
  ],
  [
    [
      4140,
      4146
    ],
    2
  ],
  [
    [
      4147,
      4149
    ],
    2
  ],
  [
    [
      4150,
      4153
    ],
    2
  ],
  [
    [
      4154,
      4159
    ],
    2
  ],
  [
    [
      4160,
      4169
    ],
    2
  ],
  [
    [
      4170,
      4175
    ],
    2
  ],
  [
    [
      4176,
      4185
    ],
    2
  ],
  [
    [
      4186,
      4249
    ],
    2
  ],
  [
    [
      4250,
      4253
    ],
    2
  ],
  [
    [
      4254,
      4255
    ],
    2
  ],
  [
    [
      4256,
      4293
    ],
    3
  ],
  [
    4294,
    3
  ],
  [
    4295,
    1,
    "ⴧ"
  ],
  [
    [
      4296,
      4300
    ],
    3
  ],
  [
    4301,
    1,
    "ⴭ"
  ],
  [
    [
      4302,
      4303
    ],
    3
  ],
  [
    [
      4304,
      4342
    ],
    2
  ],
  [
    [
      4343,
      4344
    ],
    2
  ],
  [
    [
      4345,
      4346
    ],
    2
  ],
  [
    4347,
    2
  ],
  [
    4348,
    1,
    "ნ"
  ],
  [
    [
      4349,
      4351
    ],
    2
  ],
  [
    [
      4352,
      4441
    ],
    2
  ],
  [
    [
      4442,
      4446
    ],
    2
  ],
  [
    [
      4447,
      4448
    ],
    3
  ],
  [
    [
      4449,
      4514
    ],
    2
  ],
  [
    [
      4515,
      4519
    ],
    2
  ],
  [
    [
      4520,
      4601
    ],
    2
  ],
  [
    [
      4602,
      4607
    ],
    2
  ],
  [
    [
      4608,
      4614
    ],
    2
  ],
  [
    4615,
    2
  ],
  [
    [
      4616,
      4678
    ],
    2
  ],
  [
    4679,
    2
  ],
  [
    4680,
    2
  ],
  [
    4681,
    3
  ],
  [
    [
      4682,
      4685
    ],
    2
  ],
  [
    [
      4686,
      4687
    ],
    3
  ],
  [
    [
      4688,
      4694
    ],
    2
  ],
  [
    4695,
    3
  ],
  [
    4696,
    2
  ],
  [
    4697,
    3
  ],
  [
    [
      4698,
      4701
    ],
    2
  ],
  [
    [
      4702,
      4703
    ],
    3
  ],
  [
    [
      4704,
      4742
    ],
    2
  ],
  [
    4743,
    2
  ],
  [
    4744,
    2
  ],
  [
    4745,
    3
  ],
  [
    [
      4746,
      4749
    ],
    2
  ],
  [
    [
      4750,
      4751
    ],
    3
  ],
  [
    [
      4752,
      4782
    ],
    2
  ],
  [
    4783,
    2
  ],
  [
    4784,
    2
  ],
  [
    4785,
    3
  ],
  [
    [
      4786,
      4789
    ],
    2
  ],
  [
    [
      4790,
      4791
    ],
    3
  ],
  [
    [
      4792,
      4798
    ],
    2
  ],
  [
    4799,
    3
  ],
  [
    4800,
    2
  ],
  [
    4801,
    3
  ],
  [
    [
      4802,
      4805
    ],
    2
  ],
  [
    [
      4806,
      4807
    ],
    3
  ],
  [
    [
      4808,
      4814
    ],
    2
  ],
  [
    4815,
    2
  ],
  [
    [
      4816,
      4822
    ],
    2
  ],
  [
    4823,
    3
  ],
  [
    [
      4824,
      4846
    ],
    2
  ],
  [
    4847,
    2
  ],
  [
    [
      4848,
      4878
    ],
    2
  ],
  [
    4879,
    2
  ],
  [
    4880,
    2
  ],
  [
    4881,
    3
  ],
  [
    [
      4882,
      4885
    ],
    2
  ],
  [
    [
      4886,
      4887
    ],
    3
  ],
  [
    [
      4888,
      4894
    ],
    2
  ],
  [
    4895,
    2
  ],
  [
    [
      4896,
      4934
    ],
    2
  ],
  [
    4935,
    2
  ],
  [
    [
      4936,
      4954
    ],
    2
  ],
  [
    [
      4955,
      4956
    ],
    3
  ],
  [
    [
      4957,
      4958
    ],
    2
  ],
  [
    4959,
    2
  ],
  [
    4960,
    2
  ],
  [
    [
      4961,
      4988
    ],
    2
  ],
  [
    [
      4989,
      4991
    ],
    3
  ],
  [
    [
      4992,
      5007
    ],
    2
  ],
  [
    [
      5008,
      5017
    ],
    2
  ],
  [
    [
      5018,
      5023
    ],
    3
  ],
  [
    [
      5024,
      5108
    ],
    2
  ],
  [
    5109,
    2
  ],
  [
    [
      5110,
      5111
    ],
    3
  ],
  [
    5112,
    1,
    "Ᏸ"
  ],
  [
    5113,
    1,
    "Ᏹ"
  ],
  [
    5114,
    1,
    "Ᏺ"
  ],
  [
    5115,
    1,
    "Ᏻ"
  ],
  [
    5116,
    1,
    "Ᏼ"
  ],
  [
    5117,
    1,
    "Ᏽ"
  ],
  [
    [
      5118,
      5119
    ],
    3
  ],
  [
    5120,
    2
  ],
  [
    [
      5121,
      5740
    ],
    2
  ],
  [
    [
      5741,
      5742
    ],
    2
  ],
  [
    [
      5743,
      5750
    ],
    2
  ],
  [
    [
      5751,
      5759
    ],
    2
  ],
  [
    5760,
    3
  ],
  [
    [
      5761,
      5786
    ],
    2
  ],
  [
    [
      5787,
      5788
    ],
    2
  ],
  [
    [
      5789,
      5791
    ],
    3
  ],
  [
    [
      5792,
      5866
    ],
    2
  ],
  [
    [
      5867,
      5872
    ],
    2
  ],
  [
    [
      5873,
      5880
    ],
    2
  ],
  [
    [
      5881,
      5887
    ],
    3
  ],
  [
    [
      5888,
      5900
    ],
    2
  ],
  [
    5901,
    2
  ],
  [
    [
      5902,
      5908
    ],
    2
  ],
  [
    5909,
    2
  ],
  [
    [
      5910,
      5918
    ],
    3
  ],
  [
    5919,
    2
  ],
  [
    [
      5920,
      5940
    ],
    2
  ],
  [
    [
      5941,
      5942
    ],
    2
  ],
  [
    [
      5943,
      5951
    ],
    3
  ],
  [
    [
      5952,
      5971
    ],
    2
  ],
  [
    [
      5972,
      5983
    ],
    3
  ],
  [
    [
      5984,
      5996
    ],
    2
  ],
  [
    5997,
    3
  ],
  [
    [
      5998,
      6e3
    ],
    2
  ],
  [
    6001,
    3
  ],
  [
    [
      6002,
      6003
    ],
    2
  ],
  [
    [
      6004,
      6015
    ],
    3
  ],
  [
    [
      6016,
      6067
    ],
    2
  ],
  [
    [
      6068,
      6069
    ],
    3
  ],
  [
    [
      6070,
      6099
    ],
    2
  ],
  [
    [
      6100,
      6102
    ],
    2
  ],
  [
    6103,
    2
  ],
  [
    [
      6104,
      6107
    ],
    2
  ],
  [
    6108,
    2
  ],
  [
    6109,
    2
  ],
  [
    [
      6110,
      6111
    ],
    3
  ],
  [
    [
      6112,
      6121
    ],
    2
  ],
  [
    [
      6122,
      6127
    ],
    3
  ],
  [
    [
      6128,
      6137
    ],
    2
  ],
  [
    [
      6138,
      6143
    ],
    3
  ],
  [
    [
      6144,
      6149
    ],
    2
  ],
  [
    6150,
    3
  ],
  [
    [
      6151,
      6154
    ],
    2
  ],
  [
    [
      6155,
      6157
    ],
    7
  ],
  [
    6158,
    3
  ],
  [
    6159,
    7
  ],
  [
    [
      6160,
      6169
    ],
    2
  ],
  [
    [
      6170,
      6175
    ],
    3
  ],
  [
    [
      6176,
      6263
    ],
    2
  ],
  [
    6264,
    2
  ],
  [
    [
      6265,
      6271
    ],
    3
  ],
  [
    [
      6272,
      6313
    ],
    2
  ],
  [
    6314,
    2
  ],
  [
    [
      6315,
      6319
    ],
    3
  ],
  [
    [
      6320,
      6389
    ],
    2
  ],
  [
    [
      6390,
      6399
    ],
    3
  ],
  [
    [
      6400,
      6428
    ],
    2
  ],
  [
    [
      6429,
      6430
    ],
    2
  ],
  [
    6431,
    3
  ],
  [
    [
      6432,
      6443
    ],
    2
  ],
  [
    [
      6444,
      6447
    ],
    3
  ],
  [
    [
      6448,
      6459
    ],
    2
  ],
  [
    [
      6460,
      6463
    ],
    3
  ],
  [
    6464,
    2
  ],
  [
    [
      6465,
      6467
    ],
    3
  ],
  [
    [
      6468,
      6469
    ],
    2
  ],
  [
    [
      6470,
      6509
    ],
    2
  ],
  [
    [
      6510,
      6511
    ],
    3
  ],
  [
    [
      6512,
      6516
    ],
    2
  ],
  [
    [
      6517,
      6527
    ],
    3
  ],
  [
    [
      6528,
      6569
    ],
    2
  ],
  [
    [
      6570,
      6571
    ],
    2
  ],
  [
    [
      6572,
      6575
    ],
    3
  ],
  [
    [
      6576,
      6601
    ],
    2
  ],
  [
    [
      6602,
      6607
    ],
    3
  ],
  [
    [
      6608,
      6617
    ],
    2
  ],
  [
    6618,
    2
  ],
  [
    [
      6619,
      6621
    ],
    3
  ],
  [
    [
      6622,
      6623
    ],
    2
  ],
  [
    [
      6624,
      6655
    ],
    2
  ],
  [
    [
      6656,
      6683
    ],
    2
  ],
  [
    [
      6684,
      6685
    ],
    3
  ],
  [
    [
      6686,
      6687
    ],
    2
  ],
  [
    [
      6688,
      6750
    ],
    2
  ],
  [
    6751,
    3
  ],
  [
    [
      6752,
      6780
    ],
    2
  ],
  [
    [
      6781,
      6782
    ],
    3
  ],
  [
    [
      6783,
      6793
    ],
    2
  ],
  [
    [
      6794,
      6799
    ],
    3
  ],
  [
    [
      6800,
      6809
    ],
    2
  ],
  [
    [
      6810,
      6815
    ],
    3
  ],
  [
    [
      6816,
      6822
    ],
    2
  ],
  [
    6823,
    2
  ],
  [
    [
      6824,
      6829
    ],
    2
  ],
  [
    [
      6830,
      6831
    ],
    3
  ],
  [
    [
      6832,
      6845
    ],
    2
  ],
  [
    6846,
    2
  ],
  [
    [
      6847,
      6848
    ],
    2
  ],
  [
    [
      6849,
      6862
    ],
    2
  ],
  [
    [
      6863,
      6911
    ],
    3
  ],
  [
    [
      6912,
      6987
    ],
    2
  ],
  [
    6988,
    2
  ],
  [
    [
      6989,
      6991
    ],
    3
  ],
  [
    [
      6992,
      7001
    ],
    2
  ],
  [
    [
      7002,
      7018
    ],
    2
  ],
  [
    [
      7019,
      7027
    ],
    2
  ],
  [
    [
      7028,
      7036
    ],
    2
  ],
  [
    [
      7037,
      7038
    ],
    2
  ],
  [
    7039,
    3
  ],
  [
    [
      7040,
      7082
    ],
    2
  ],
  [
    [
      7083,
      7085
    ],
    2
  ],
  [
    [
      7086,
      7097
    ],
    2
  ],
  [
    [
      7098,
      7103
    ],
    2
  ],
  [
    [
      7104,
      7155
    ],
    2
  ],
  [
    [
      7156,
      7163
    ],
    3
  ],
  [
    [
      7164,
      7167
    ],
    2
  ],
  [
    [
      7168,
      7223
    ],
    2
  ],
  [
    [
      7224,
      7226
    ],
    3
  ],
  [
    [
      7227,
      7231
    ],
    2
  ],
  [
    [
      7232,
      7241
    ],
    2
  ],
  [
    [
      7242,
      7244
    ],
    3
  ],
  [
    [
      7245,
      7293
    ],
    2
  ],
  [
    [
      7294,
      7295
    ],
    2
  ],
  [
    7296,
    1,
    "в"
  ],
  [
    7297,
    1,
    "д"
  ],
  [
    7298,
    1,
    "о"
  ],
  [
    7299,
    1,
    "с"
  ],
  [
    [
      7300,
      7301
    ],
    1,
    "т"
  ],
  [
    7302,
    1,
    "ъ"
  ],
  [
    7303,
    1,
    "ѣ"
  ],
  [
    7304,
    1,
    "ꙋ"
  ],
  [
    [
      7305,
      7311
    ],
    3
  ],
  [
    7312,
    1,
    "ა"
  ],
  [
    7313,
    1,
    "ბ"
  ],
  [
    7314,
    1,
    "გ"
  ],
  [
    7315,
    1,
    "დ"
  ],
  [
    7316,
    1,
    "ე"
  ],
  [
    7317,
    1,
    "ვ"
  ],
  [
    7318,
    1,
    "ზ"
  ],
  [
    7319,
    1,
    "თ"
  ],
  [
    7320,
    1,
    "ი"
  ],
  [
    7321,
    1,
    "კ"
  ],
  [
    7322,
    1,
    "ლ"
  ],
  [
    7323,
    1,
    "მ"
  ],
  [
    7324,
    1,
    "ნ"
  ],
  [
    7325,
    1,
    "ო"
  ],
  [
    7326,
    1,
    "პ"
  ],
  [
    7327,
    1,
    "ჟ"
  ],
  [
    7328,
    1,
    "რ"
  ],
  [
    7329,
    1,
    "ს"
  ],
  [
    7330,
    1,
    "ტ"
  ],
  [
    7331,
    1,
    "უ"
  ],
  [
    7332,
    1,
    "ფ"
  ],
  [
    7333,
    1,
    "ქ"
  ],
  [
    7334,
    1,
    "ღ"
  ],
  [
    7335,
    1,
    "ყ"
  ],
  [
    7336,
    1,
    "შ"
  ],
  [
    7337,
    1,
    "ჩ"
  ],
  [
    7338,
    1,
    "ც"
  ],
  [
    7339,
    1,
    "ძ"
  ],
  [
    7340,
    1,
    "წ"
  ],
  [
    7341,
    1,
    "ჭ"
  ],
  [
    7342,
    1,
    "ხ"
  ],
  [
    7343,
    1,
    "ჯ"
  ],
  [
    7344,
    1,
    "ჰ"
  ],
  [
    7345,
    1,
    "ჱ"
  ],
  [
    7346,
    1,
    "ჲ"
  ],
  [
    7347,
    1,
    "ჳ"
  ],
  [
    7348,
    1,
    "ჴ"
  ],
  [
    7349,
    1,
    "ჵ"
  ],
  [
    7350,
    1,
    "ჶ"
  ],
  [
    7351,
    1,
    "ჷ"
  ],
  [
    7352,
    1,
    "ჸ"
  ],
  [
    7353,
    1,
    "ჹ"
  ],
  [
    7354,
    1,
    "ჺ"
  ],
  [
    [
      7355,
      7356
    ],
    3
  ],
  [
    7357,
    1,
    "ჽ"
  ],
  [
    7358,
    1,
    "ჾ"
  ],
  [
    7359,
    1,
    "ჿ"
  ],
  [
    [
      7360,
      7367
    ],
    2
  ],
  [
    [
      7368,
      7375
    ],
    3
  ],
  [
    [
      7376,
      7378
    ],
    2
  ],
  [
    7379,
    2
  ],
  [
    [
      7380,
      7410
    ],
    2
  ],
  [
    [
      7411,
      7414
    ],
    2
  ],
  [
    7415,
    2
  ],
  [
    [
      7416,
      7417
    ],
    2
  ],
  [
    7418,
    2
  ],
  [
    [
      7419,
      7423
    ],
    3
  ],
  [
    [
      7424,
      7467
    ],
    2
  ],
  [
    7468,
    1,
    "a"
  ],
  [
    7469,
    1,
    "æ"
  ],
  [
    7470,
    1,
    "b"
  ],
  [
    7471,
    2
  ],
  [
    7472,
    1,
    "d"
  ],
  [
    7473,
    1,
    "e"
  ],
  [
    7474,
    1,
    "ǝ"
  ],
  [
    7475,
    1,
    "g"
  ],
  [
    7476,
    1,
    "h"
  ],
  [
    7477,
    1,
    "i"
  ],
  [
    7478,
    1,
    "j"
  ],
  [
    7479,
    1,
    "k"
  ],
  [
    7480,
    1,
    "l"
  ],
  [
    7481,
    1,
    "m"
  ],
  [
    7482,
    1,
    "n"
  ],
  [
    7483,
    2
  ],
  [
    7484,
    1,
    "o"
  ],
  [
    7485,
    1,
    "ȣ"
  ],
  [
    7486,
    1,
    "p"
  ],
  [
    7487,
    1,
    "r"
  ],
  [
    7488,
    1,
    "t"
  ],
  [
    7489,
    1,
    "u"
  ],
  [
    7490,
    1,
    "w"
  ],
  [
    7491,
    1,
    "a"
  ],
  [
    7492,
    1,
    "ɐ"
  ],
  [
    7493,
    1,
    "ɑ"
  ],
  [
    7494,
    1,
    "ᴂ"
  ],
  [
    7495,
    1,
    "b"
  ],
  [
    7496,
    1,
    "d"
  ],
  [
    7497,
    1,
    "e"
  ],
  [
    7498,
    1,
    "ə"
  ],
  [
    7499,
    1,
    "ɛ"
  ],
  [
    7500,
    1,
    "ɜ"
  ],
  [
    7501,
    1,
    "g"
  ],
  [
    7502,
    2
  ],
  [
    7503,
    1,
    "k"
  ],
  [
    7504,
    1,
    "m"
  ],
  [
    7505,
    1,
    "ŋ"
  ],
  [
    7506,
    1,
    "o"
  ],
  [
    7507,
    1,
    "ɔ"
  ],
  [
    7508,
    1,
    "ᴖ"
  ],
  [
    7509,
    1,
    "ᴗ"
  ],
  [
    7510,
    1,
    "p"
  ],
  [
    7511,
    1,
    "t"
  ],
  [
    7512,
    1,
    "u"
  ],
  [
    7513,
    1,
    "ᴝ"
  ],
  [
    7514,
    1,
    "ɯ"
  ],
  [
    7515,
    1,
    "v"
  ],
  [
    7516,
    1,
    "ᴥ"
  ],
  [
    7517,
    1,
    "β"
  ],
  [
    7518,
    1,
    "γ"
  ],
  [
    7519,
    1,
    "δ"
  ],
  [
    7520,
    1,
    "φ"
  ],
  [
    7521,
    1,
    "χ"
  ],
  [
    7522,
    1,
    "i"
  ],
  [
    7523,
    1,
    "r"
  ],
  [
    7524,
    1,
    "u"
  ],
  [
    7525,
    1,
    "v"
  ],
  [
    7526,
    1,
    "β"
  ],
  [
    7527,
    1,
    "γ"
  ],
  [
    7528,
    1,
    "ρ"
  ],
  [
    7529,
    1,
    "φ"
  ],
  [
    7530,
    1,
    "χ"
  ],
  [
    7531,
    2
  ],
  [
    [
      7532,
      7543
    ],
    2
  ],
  [
    7544,
    1,
    "н"
  ],
  [
    [
      7545,
      7578
    ],
    2
  ],
  [
    7579,
    1,
    "ɒ"
  ],
  [
    7580,
    1,
    "c"
  ],
  [
    7581,
    1,
    "ɕ"
  ],
  [
    7582,
    1,
    "ð"
  ],
  [
    7583,
    1,
    "ɜ"
  ],
  [
    7584,
    1,
    "f"
  ],
  [
    7585,
    1,
    "ɟ"
  ],
  [
    7586,
    1,
    "ɡ"
  ],
  [
    7587,
    1,
    "ɥ"
  ],
  [
    7588,
    1,
    "ɨ"
  ],
  [
    7589,
    1,
    "ɩ"
  ],
  [
    7590,
    1,
    "ɪ"
  ],
  [
    7591,
    1,
    "ᵻ"
  ],
  [
    7592,
    1,
    "ʝ"
  ],
  [
    7593,
    1,
    "ɭ"
  ],
  [
    7594,
    1,
    "ᶅ"
  ],
  [
    7595,
    1,
    "ʟ"
  ],
  [
    7596,
    1,
    "ɱ"
  ],
  [
    7597,
    1,
    "ɰ"
  ],
  [
    7598,
    1,
    "ɲ"
  ],
  [
    7599,
    1,
    "ɳ"
  ],
  [
    7600,
    1,
    "ɴ"
  ],
  [
    7601,
    1,
    "ɵ"
  ],
  [
    7602,
    1,
    "ɸ"
  ],
  [
    7603,
    1,
    "ʂ"
  ],
  [
    7604,
    1,
    "ʃ"
  ],
  [
    7605,
    1,
    "ƫ"
  ],
  [
    7606,
    1,
    "ʉ"
  ],
  [
    7607,
    1,
    "ʊ"
  ],
  [
    7608,
    1,
    "ᴜ"
  ],
  [
    7609,
    1,
    "ʋ"
  ],
  [
    7610,
    1,
    "ʌ"
  ],
  [
    7611,
    1,
    "z"
  ],
  [
    7612,
    1,
    "ʐ"
  ],
  [
    7613,
    1,
    "ʑ"
  ],
  [
    7614,
    1,
    "ʒ"
  ],
  [
    7615,
    1,
    "θ"
  ],
  [
    [
      7616,
      7619
    ],
    2
  ],
  [
    [
      7620,
      7626
    ],
    2
  ],
  [
    [
      7627,
      7654
    ],
    2
  ],
  [
    [
      7655,
      7669
    ],
    2
  ],
  [
    [
      7670,
      7673
    ],
    2
  ],
  [
    7674,
    2
  ],
  [
    7675,
    2
  ],
  [
    7676,
    2
  ],
  [
    7677,
    2
  ],
  [
    [
      7678,
      7679
    ],
    2
  ],
  [
    7680,
    1,
    "ḁ"
  ],
  [
    7681,
    2
  ],
  [
    7682,
    1,
    "ḃ"
  ],
  [
    7683,
    2
  ],
  [
    7684,
    1,
    "ḅ"
  ],
  [
    7685,
    2
  ],
  [
    7686,
    1,
    "ḇ"
  ],
  [
    7687,
    2
  ],
  [
    7688,
    1,
    "ḉ"
  ],
  [
    7689,
    2
  ],
  [
    7690,
    1,
    "ḋ"
  ],
  [
    7691,
    2
  ],
  [
    7692,
    1,
    "ḍ"
  ],
  [
    7693,
    2
  ],
  [
    7694,
    1,
    "ḏ"
  ],
  [
    7695,
    2
  ],
  [
    7696,
    1,
    "ḑ"
  ],
  [
    7697,
    2
  ],
  [
    7698,
    1,
    "ḓ"
  ],
  [
    7699,
    2
  ],
  [
    7700,
    1,
    "ḕ"
  ],
  [
    7701,
    2
  ],
  [
    7702,
    1,
    "ḗ"
  ],
  [
    7703,
    2
  ],
  [
    7704,
    1,
    "ḙ"
  ],
  [
    7705,
    2
  ],
  [
    7706,
    1,
    "ḛ"
  ],
  [
    7707,
    2
  ],
  [
    7708,
    1,
    "ḝ"
  ],
  [
    7709,
    2
  ],
  [
    7710,
    1,
    "ḟ"
  ],
  [
    7711,
    2
  ],
  [
    7712,
    1,
    "ḡ"
  ],
  [
    7713,
    2
  ],
  [
    7714,
    1,
    "ḣ"
  ],
  [
    7715,
    2
  ],
  [
    7716,
    1,
    "ḥ"
  ],
  [
    7717,
    2
  ],
  [
    7718,
    1,
    "ḧ"
  ],
  [
    7719,
    2
  ],
  [
    7720,
    1,
    "ḩ"
  ],
  [
    7721,
    2
  ],
  [
    7722,
    1,
    "ḫ"
  ],
  [
    7723,
    2
  ],
  [
    7724,
    1,
    "ḭ"
  ],
  [
    7725,
    2
  ],
  [
    7726,
    1,
    "ḯ"
  ],
  [
    7727,
    2
  ],
  [
    7728,
    1,
    "ḱ"
  ],
  [
    7729,
    2
  ],
  [
    7730,
    1,
    "ḳ"
  ],
  [
    7731,
    2
  ],
  [
    7732,
    1,
    "ḵ"
  ],
  [
    7733,
    2
  ],
  [
    7734,
    1,
    "ḷ"
  ],
  [
    7735,
    2
  ],
  [
    7736,
    1,
    "ḹ"
  ],
  [
    7737,
    2
  ],
  [
    7738,
    1,
    "ḻ"
  ],
  [
    7739,
    2
  ],
  [
    7740,
    1,
    "ḽ"
  ],
  [
    7741,
    2
  ],
  [
    7742,
    1,
    "ḿ"
  ],
  [
    7743,
    2
  ],
  [
    7744,
    1,
    "ṁ"
  ],
  [
    7745,
    2
  ],
  [
    7746,
    1,
    "ṃ"
  ],
  [
    7747,
    2
  ],
  [
    7748,
    1,
    "ṅ"
  ],
  [
    7749,
    2
  ],
  [
    7750,
    1,
    "ṇ"
  ],
  [
    7751,
    2
  ],
  [
    7752,
    1,
    "ṉ"
  ],
  [
    7753,
    2
  ],
  [
    7754,
    1,
    "ṋ"
  ],
  [
    7755,
    2
  ],
  [
    7756,
    1,
    "ṍ"
  ],
  [
    7757,
    2
  ],
  [
    7758,
    1,
    "ṏ"
  ],
  [
    7759,
    2
  ],
  [
    7760,
    1,
    "ṑ"
  ],
  [
    7761,
    2
  ],
  [
    7762,
    1,
    "ṓ"
  ],
  [
    7763,
    2
  ],
  [
    7764,
    1,
    "ṕ"
  ],
  [
    7765,
    2
  ],
  [
    7766,
    1,
    "ṗ"
  ],
  [
    7767,
    2
  ],
  [
    7768,
    1,
    "ṙ"
  ],
  [
    7769,
    2
  ],
  [
    7770,
    1,
    "ṛ"
  ],
  [
    7771,
    2
  ],
  [
    7772,
    1,
    "ṝ"
  ],
  [
    7773,
    2
  ],
  [
    7774,
    1,
    "ṟ"
  ],
  [
    7775,
    2
  ],
  [
    7776,
    1,
    "ṡ"
  ],
  [
    7777,
    2
  ],
  [
    7778,
    1,
    "ṣ"
  ],
  [
    7779,
    2
  ],
  [
    7780,
    1,
    "ṥ"
  ],
  [
    7781,
    2
  ],
  [
    7782,
    1,
    "ṧ"
  ],
  [
    7783,
    2
  ],
  [
    7784,
    1,
    "ṩ"
  ],
  [
    7785,
    2
  ],
  [
    7786,
    1,
    "ṫ"
  ],
  [
    7787,
    2
  ],
  [
    7788,
    1,
    "ṭ"
  ],
  [
    7789,
    2
  ],
  [
    7790,
    1,
    "ṯ"
  ],
  [
    7791,
    2
  ],
  [
    7792,
    1,
    "ṱ"
  ],
  [
    7793,
    2
  ],
  [
    7794,
    1,
    "ṳ"
  ],
  [
    7795,
    2
  ],
  [
    7796,
    1,
    "ṵ"
  ],
  [
    7797,
    2
  ],
  [
    7798,
    1,
    "ṷ"
  ],
  [
    7799,
    2
  ],
  [
    7800,
    1,
    "ṹ"
  ],
  [
    7801,
    2
  ],
  [
    7802,
    1,
    "ṻ"
  ],
  [
    7803,
    2
  ],
  [
    7804,
    1,
    "ṽ"
  ],
  [
    7805,
    2
  ],
  [
    7806,
    1,
    "ṿ"
  ],
  [
    7807,
    2
  ],
  [
    7808,
    1,
    "ẁ"
  ],
  [
    7809,
    2
  ],
  [
    7810,
    1,
    "ẃ"
  ],
  [
    7811,
    2
  ],
  [
    7812,
    1,
    "ẅ"
  ],
  [
    7813,
    2
  ],
  [
    7814,
    1,
    "ẇ"
  ],
  [
    7815,
    2
  ],
  [
    7816,
    1,
    "ẉ"
  ],
  [
    7817,
    2
  ],
  [
    7818,
    1,
    "ẋ"
  ],
  [
    7819,
    2
  ],
  [
    7820,
    1,
    "ẍ"
  ],
  [
    7821,
    2
  ],
  [
    7822,
    1,
    "ẏ"
  ],
  [
    7823,
    2
  ],
  [
    7824,
    1,
    "ẑ"
  ],
  [
    7825,
    2
  ],
  [
    7826,
    1,
    "ẓ"
  ],
  [
    7827,
    2
  ],
  [
    7828,
    1,
    "ẕ"
  ],
  [
    [
      7829,
      7833
    ],
    2
  ],
  [
    7834,
    1,
    "aʾ"
  ],
  [
    7835,
    1,
    "ṡ"
  ],
  [
    [
      7836,
      7837
    ],
    2
  ],
  [
    7838,
    1,
    "ß"
  ],
  [
    7839,
    2
  ],
  [
    7840,
    1,
    "ạ"
  ],
  [
    7841,
    2
  ],
  [
    7842,
    1,
    "ả"
  ],
  [
    7843,
    2
  ],
  [
    7844,
    1,
    "ấ"
  ],
  [
    7845,
    2
  ],
  [
    7846,
    1,
    "ầ"
  ],
  [
    7847,
    2
  ],
  [
    7848,
    1,
    "ẩ"
  ],
  [
    7849,
    2
  ],
  [
    7850,
    1,
    "ẫ"
  ],
  [
    7851,
    2
  ],
  [
    7852,
    1,
    "ậ"
  ],
  [
    7853,
    2
  ],
  [
    7854,
    1,
    "ắ"
  ],
  [
    7855,
    2
  ],
  [
    7856,
    1,
    "ằ"
  ],
  [
    7857,
    2
  ],
  [
    7858,
    1,
    "ẳ"
  ],
  [
    7859,
    2
  ],
  [
    7860,
    1,
    "ẵ"
  ],
  [
    7861,
    2
  ],
  [
    7862,
    1,
    "ặ"
  ],
  [
    7863,
    2
  ],
  [
    7864,
    1,
    "ẹ"
  ],
  [
    7865,
    2
  ],
  [
    7866,
    1,
    "ẻ"
  ],
  [
    7867,
    2
  ],
  [
    7868,
    1,
    "ẽ"
  ],
  [
    7869,
    2
  ],
  [
    7870,
    1,
    "ế"
  ],
  [
    7871,
    2
  ],
  [
    7872,
    1,
    "ề"
  ],
  [
    7873,
    2
  ],
  [
    7874,
    1,
    "ể"
  ],
  [
    7875,
    2
  ],
  [
    7876,
    1,
    "ễ"
  ],
  [
    7877,
    2
  ],
  [
    7878,
    1,
    "ệ"
  ],
  [
    7879,
    2
  ],
  [
    7880,
    1,
    "ỉ"
  ],
  [
    7881,
    2
  ],
  [
    7882,
    1,
    "ị"
  ],
  [
    7883,
    2
  ],
  [
    7884,
    1,
    "ọ"
  ],
  [
    7885,
    2
  ],
  [
    7886,
    1,
    "ỏ"
  ],
  [
    7887,
    2
  ],
  [
    7888,
    1,
    "ố"
  ],
  [
    7889,
    2
  ],
  [
    7890,
    1,
    "ồ"
  ],
  [
    7891,
    2
  ],
  [
    7892,
    1,
    "ổ"
  ],
  [
    7893,
    2
  ],
  [
    7894,
    1,
    "ỗ"
  ],
  [
    7895,
    2
  ],
  [
    7896,
    1,
    "ộ"
  ],
  [
    7897,
    2
  ],
  [
    7898,
    1,
    "ớ"
  ],
  [
    7899,
    2
  ],
  [
    7900,
    1,
    "ờ"
  ],
  [
    7901,
    2
  ],
  [
    7902,
    1,
    "ở"
  ],
  [
    7903,
    2
  ],
  [
    7904,
    1,
    "ỡ"
  ],
  [
    7905,
    2
  ],
  [
    7906,
    1,
    "ợ"
  ],
  [
    7907,
    2
  ],
  [
    7908,
    1,
    "ụ"
  ],
  [
    7909,
    2
  ],
  [
    7910,
    1,
    "ủ"
  ],
  [
    7911,
    2
  ],
  [
    7912,
    1,
    "ứ"
  ],
  [
    7913,
    2
  ],
  [
    7914,
    1,
    "ừ"
  ],
  [
    7915,
    2
  ],
  [
    7916,
    1,
    "ử"
  ],
  [
    7917,
    2
  ],
  [
    7918,
    1,
    "ữ"
  ],
  [
    7919,
    2
  ],
  [
    7920,
    1,
    "ự"
  ],
  [
    7921,
    2
  ],
  [
    7922,
    1,
    "ỳ"
  ],
  [
    7923,
    2
  ],
  [
    7924,
    1,
    "ỵ"
  ],
  [
    7925,
    2
  ],
  [
    7926,
    1,
    "ỷ"
  ],
  [
    7927,
    2
  ],
  [
    7928,
    1,
    "ỹ"
  ],
  [
    7929,
    2
  ],
  [
    7930,
    1,
    "ỻ"
  ],
  [
    7931,
    2
  ],
  [
    7932,
    1,
    "ỽ"
  ],
  [
    7933,
    2
  ],
  [
    7934,
    1,
    "ỿ"
  ],
  [
    7935,
    2
  ],
  [
    [
      7936,
      7943
    ],
    2
  ],
  [
    7944,
    1,
    "ἀ"
  ],
  [
    7945,
    1,
    "ἁ"
  ],
  [
    7946,
    1,
    "ἂ"
  ],
  [
    7947,
    1,
    "ἃ"
  ],
  [
    7948,
    1,
    "ἄ"
  ],
  [
    7949,
    1,
    "ἅ"
  ],
  [
    7950,
    1,
    "ἆ"
  ],
  [
    7951,
    1,
    "ἇ"
  ],
  [
    [
      7952,
      7957
    ],
    2
  ],
  [
    [
      7958,
      7959
    ],
    3
  ],
  [
    7960,
    1,
    "ἐ"
  ],
  [
    7961,
    1,
    "ἑ"
  ],
  [
    7962,
    1,
    "ἒ"
  ],
  [
    7963,
    1,
    "ἓ"
  ],
  [
    7964,
    1,
    "ἔ"
  ],
  [
    7965,
    1,
    "ἕ"
  ],
  [
    [
      7966,
      7967
    ],
    3
  ],
  [
    [
      7968,
      7975
    ],
    2
  ],
  [
    7976,
    1,
    "ἠ"
  ],
  [
    7977,
    1,
    "ἡ"
  ],
  [
    7978,
    1,
    "ἢ"
  ],
  [
    7979,
    1,
    "ἣ"
  ],
  [
    7980,
    1,
    "ἤ"
  ],
  [
    7981,
    1,
    "ἥ"
  ],
  [
    7982,
    1,
    "ἦ"
  ],
  [
    7983,
    1,
    "ἧ"
  ],
  [
    [
      7984,
      7991
    ],
    2
  ],
  [
    7992,
    1,
    "ἰ"
  ],
  [
    7993,
    1,
    "ἱ"
  ],
  [
    7994,
    1,
    "ἲ"
  ],
  [
    7995,
    1,
    "ἳ"
  ],
  [
    7996,
    1,
    "ἴ"
  ],
  [
    7997,
    1,
    "ἵ"
  ],
  [
    7998,
    1,
    "ἶ"
  ],
  [
    7999,
    1,
    "ἷ"
  ],
  [
    [
      8e3,
      8005
    ],
    2
  ],
  [
    [
      8006,
      8007
    ],
    3
  ],
  [
    8008,
    1,
    "ὀ"
  ],
  [
    8009,
    1,
    "ὁ"
  ],
  [
    8010,
    1,
    "ὂ"
  ],
  [
    8011,
    1,
    "ὃ"
  ],
  [
    8012,
    1,
    "ὄ"
  ],
  [
    8013,
    1,
    "ὅ"
  ],
  [
    [
      8014,
      8015
    ],
    3
  ],
  [
    [
      8016,
      8023
    ],
    2
  ],
  [
    8024,
    3
  ],
  [
    8025,
    1,
    "ὑ"
  ],
  [
    8026,
    3
  ],
  [
    8027,
    1,
    "ὓ"
  ],
  [
    8028,
    3
  ],
  [
    8029,
    1,
    "ὕ"
  ],
  [
    8030,
    3
  ],
  [
    8031,
    1,
    "ὗ"
  ],
  [
    [
      8032,
      8039
    ],
    2
  ],
  [
    8040,
    1,
    "ὠ"
  ],
  [
    8041,
    1,
    "ὡ"
  ],
  [
    8042,
    1,
    "ὢ"
  ],
  [
    8043,
    1,
    "ὣ"
  ],
  [
    8044,
    1,
    "ὤ"
  ],
  [
    8045,
    1,
    "ὥ"
  ],
  [
    8046,
    1,
    "ὦ"
  ],
  [
    8047,
    1,
    "ὧ"
  ],
  [
    8048,
    2
  ],
  [
    8049,
    1,
    "ά"
  ],
  [
    8050,
    2
  ],
  [
    8051,
    1,
    "έ"
  ],
  [
    8052,
    2
  ],
  [
    8053,
    1,
    "ή"
  ],
  [
    8054,
    2
  ],
  [
    8055,
    1,
    "ί"
  ],
  [
    8056,
    2
  ],
  [
    8057,
    1,
    "ό"
  ],
  [
    8058,
    2
  ],
  [
    8059,
    1,
    "ύ"
  ],
  [
    8060,
    2
  ],
  [
    8061,
    1,
    "ώ"
  ],
  [
    [
      8062,
      8063
    ],
    3
  ],
  [
    8064,
    1,
    "ἀι"
  ],
  [
    8065,
    1,
    "ἁι"
  ],
  [
    8066,
    1,
    "ἂι"
  ],
  [
    8067,
    1,
    "ἃι"
  ],
  [
    8068,
    1,
    "ἄι"
  ],
  [
    8069,
    1,
    "ἅι"
  ],
  [
    8070,
    1,
    "ἆι"
  ],
  [
    8071,
    1,
    "ἇι"
  ],
  [
    8072,
    1,
    "ἀι"
  ],
  [
    8073,
    1,
    "ἁι"
  ],
  [
    8074,
    1,
    "ἂι"
  ],
  [
    8075,
    1,
    "ἃι"
  ],
  [
    8076,
    1,
    "ἄι"
  ],
  [
    8077,
    1,
    "ἅι"
  ],
  [
    8078,
    1,
    "ἆι"
  ],
  [
    8079,
    1,
    "ἇι"
  ],
  [
    8080,
    1,
    "ἠι"
  ],
  [
    8081,
    1,
    "ἡι"
  ],
  [
    8082,
    1,
    "ἢι"
  ],
  [
    8083,
    1,
    "ἣι"
  ],
  [
    8084,
    1,
    "ἤι"
  ],
  [
    8085,
    1,
    "ἥι"
  ],
  [
    8086,
    1,
    "ἦι"
  ],
  [
    8087,
    1,
    "ἧι"
  ],
  [
    8088,
    1,
    "ἠι"
  ],
  [
    8089,
    1,
    "ἡι"
  ],
  [
    8090,
    1,
    "ἢι"
  ],
  [
    8091,
    1,
    "ἣι"
  ],
  [
    8092,
    1,
    "ἤι"
  ],
  [
    8093,
    1,
    "ἥι"
  ],
  [
    8094,
    1,
    "ἦι"
  ],
  [
    8095,
    1,
    "ἧι"
  ],
  [
    8096,
    1,
    "ὠι"
  ],
  [
    8097,
    1,
    "ὡι"
  ],
  [
    8098,
    1,
    "ὢι"
  ],
  [
    8099,
    1,
    "ὣι"
  ],
  [
    8100,
    1,
    "ὤι"
  ],
  [
    8101,
    1,
    "ὥι"
  ],
  [
    8102,
    1,
    "ὦι"
  ],
  [
    8103,
    1,
    "ὧι"
  ],
  [
    8104,
    1,
    "ὠι"
  ],
  [
    8105,
    1,
    "ὡι"
  ],
  [
    8106,
    1,
    "ὢι"
  ],
  [
    8107,
    1,
    "ὣι"
  ],
  [
    8108,
    1,
    "ὤι"
  ],
  [
    8109,
    1,
    "ὥι"
  ],
  [
    8110,
    1,
    "ὦι"
  ],
  [
    8111,
    1,
    "ὧι"
  ],
  [
    [
      8112,
      8113
    ],
    2
  ],
  [
    8114,
    1,
    "ὰι"
  ],
  [
    8115,
    1,
    "αι"
  ],
  [
    8116,
    1,
    "άι"
  ],
  [
    8117,
    3
  ],
  [
    8118,
    2
  ],
  [
    8119,
    1,
    "ᾶι"
  ],
  [
    8120,
    1,
    "ᾰ"
  ],
  [
    8121,
    1,
    "ᾱ"
  ],
  [
    8122,
    1,
    "ὰ"
  ],
  [
    8123,
    1,
    "ά"
  ],
  [
    8124,
    1,
    "αι"
  ],
  [
    8125,
    5,
    " ̓"
  ],
  [
    8126,
    1,
    "ι"
  ],
  [
    8127,
    5,
    " ̓"
  ],
  [
    8128,
    5,
    " ͂"
  ],
  [
    8129,
    5,
    " ̈͂"
  ],
  [
    8130,
    1,
    "ὴι"
  ],
  [
    8131,
    1,
    "ηι"
  ],
  [
    8132,
    1,
    "ήι"
  ],
  [
    8133,
    3
  ],
  [
    8134,
    2
  ],
  [
    8135,
    1,
    "ῆι"
  ],
  [
    8136,
    1,
    "ὲ"
  ],
  [
    8137,
    1,
    "έ"
  ],
  [
    8138,
    1,
    "ὴ"
  ],
  [
    8139,
    1,
    "ή"
  ],
  [
    8140,
    1,
    "ηι"
  ],
  [
    8141,
    5,
    " ̓̀"
  ],
  [
    8142,
    5,
    " ̓́"
  ],
  [
    8143,
    5,
    " ̓͂"
  ],
  [
    [
      8144,
      8146
    ],
    2
  ],
  [
    8147,
    1,
    "ΐ"
  ],
  [
    [
      8148,
      8149
    ],
    3
  ],
  [
    [
      8150,
      8151
    ],
    2
  ],
  [
    8152,
    1,
    "ῐ"
  ],
  [
    8153,
    1,
    "ῑ"
  ],
  [
    8154,
    1,
    "ὶ"
  ],
  [
    8155,
    1,
    "ί"
  ],
  [
    8156,
    3
  ],
  [
    8157,
    5,
    " ̔̀"
  ],
  [
    8158,
    5,
    " ̔́"
  ],
  [
    8159,
    5,
    " ̔͂"
  ],
  [
    [
      8160,
      8162
    ],
    2
  ],
  [
    8163,
    1,
    "ΰ"
  ],
  [
    [
      8164,
      8167
    ],
    2
  ],
  [
    8168,
    1,
    "ῠ"
  ],
  [
    8169,
    1,
    "ῡ"
  ],
  [
    8170,
    1,
    "ὺ"
  ],
  [
    8171,
    1,
    "ύ"
  ],
  [
    8172,
    1,
    "ῥ"
  ],
  [
    8173,
    5,
    " ̈̀"
  ],
  [
    8174,
    5,
    " ̈́"
  ],
  [
    8175,
    5,
    "`"
  ],
  [
    [
      8176,
      8177
    ],
    3
  ],
  [
    8178,
    1,
    "ὼι"
  ],
  [
    8179,
    1,
    "ωι"
  ],
  [
    8180,
    1,
    "ώι"
  ],
  [
    8181,
    3
  ],
  [
    8182,
    2
  ],
  [
    8183,
    1,
    "ῶι"
  ],
  [
    8184,
    1,
    "ὸ"
  ],
  [
    8185,
    1,
    "ό"
  ],
  [
    8186,
    1,
    "ὼ"
  ],
  [
    8187,
    1,
    "ώ"
  ],
  [
    8188,
    1,
    "ωι"
  ],
  [
    8189,
    5,
    " ́"
  ],
  [
    8190,
    5,
    " ̔"
  ],
  [
    8191,
    3
  ],
  [
    [
      8192,
      8202
    ],
    5,
    " "
  ],
  [
    8203,
    7
  ],
  [
    [
      8204,
      8205
    ],
    6,
    ""
  ],
  [
    [
      8206,
      8207
    ],
    3
  ],
  [
    8208,
    2
  ],
  [
    8209,
    1,
    "‐"
  ],
  [
    [
      8210,
      8214
    ],
    2
  ],
  [
    8215,
    5,
    " ̳"
  ],
  [
    [
      8216,
      8227
    ],
    2
  ],
  [
    [
      8228,
      8230
    ],
    3
  ],
  [
    8231,
    2
  ],
  [
    [
      8232,
      8238
    ],
    3
  ],
  [
    8239,
    5,
    " "
  ],
  [
    [
      8240,
      8242
    ],
    2
  ],
  [
    8243,
    1,
    "′′"
  ],
  [
    8244,
    1,
    "′′′"
  ],
  [
    8245,
    2
  ],
  [
    8246,
    1,
    "‵‵"
  ],
  [
    8247,
    1,
    "‵‵‵"
  ],
  [
    [
      8248,
      8251
    ],
    2
  ],
  [
    8252,
    5,
    "!!"
  ],
  [
    8253,
    2
  ],
  [
    8254,
    5,
    " ̅"
  ],
  [
    [
      8255,
      8262
    ],
    2
  ],
  [
    8263,
    5,
    "??"
  ],
  [
    8264,
    5,
    "?!"
  ],
  [
    8265,
    5,
    "!?"
  ],
  [
    [
      8266,
      8269
    ],
    2
  ],
  [
    [
      8270,
      8274
    ],
    2
  ],
  [
    [
      8275,
      8276
    ],
    2
  ],
  [
    [
      8277,
      8278
    ],
    2
  ],
  [
    8279,
    1,
    "′′′′"
  ],
  [
    [
      8280,
      8286
    ],
    2
  ],
  [
    8287,
    5,
    " "
  ],
  [
    8288,
    7
  ],
  [
    [
      8289,
      8291
    ],
    3
  ],
  [
    8292,
    7
  ],
  [
    8293,
    3
  ],
  [
    [
      8294,
      8297
    ],
    3
  ],
  [
    [
      8298,
      8303
    ],
    3
  ],
  [
    8304,
    1,
    "0"
  ],
  [
    8305,
    1,
    "i"
  ],
  [
    [
      8306,
      8307
    ],
    3
  ],
  [
    8308,
    1,
    "4"
  ],
  [
    8309,
    1,
    "5"
  ],
  [
    8310,
    1,
    "6"
  ],
  [
    8311,
    1,
    "7"
  ],
  [
    8312,
    1,
    "8"
  ],
  [
    8313,
    1,
    "9"
  ],
  [
    8314,
    5,
    "+"
  ],
  [
    8315,
    1,
    "−"
  ],
  [
    8316,
    5,
    "="
  ],
  [
    8317,
    5,
    "("
  ],
  [
    8318,
    5,
    ")"
  ],
  [
    8319,
    1,
    "n"
  ],
  [
    8320,
    1,
    "0"
  ],
  [
    8321,
    1,
    "1"
  ],
  [
    8322,
    1,
    "2"
  ],
  [
    8323,
    1,
    "3"
  ],
  [
    8324,
    1,
    "4"
  ],
  [
    8325,
    1,
    "5"
  ],
  [
    8326,
    1,
    "6"
  ],
  [
    8327,
    1,
    "7"
  ],
  [
    8328,
    1,
    "8"
  ],
  [
    8329,
    1,
    "9"
  ],
  [
    8330,
    5,
    "+"
  ],
  [
    8331,
    1,
    "−"
  ],
  [
    8332,
    5,
    "="
  ],
  [
    8333,
    5,
    "("
  ],
  [
    8334,
    5,
    ")"
  ],
  [
    8335,
    3
  ],
  [
    8336,
    1,
    "a"
  ],
  [
    8337,
    1,
    "e"
  ],
  [
    8338,
    1,
    "o"
  ],
  [
    8339,
    1,
    "x"
  ],
  [
    8340,
    1,
    "ə"
  ],
  [
    8341,
    1,
    "h"
  ],
  [
    8342,
    1,
    "k"
  ],
  [
    8343,
    1,
    "l"
  ],
  [
    8344,
    1,
    "m"
  ],
  [
    8345,
    1,
    "n"
  ],
  [
    8346,
    1,
    "p"
  ],
  [
    8347,
    1,
    "s"
  ],
  [
    8348,
    1,
    "t"
  ],
  [
    [
      8349,
      8351
    ],
    3
  ],
  [
    [
      8352,
      8359
    ],
    2
  ],
  [
    8360,
    1,
    "rs"
  ],
  [
    [
      8361,
      8362
    ],
    2
  ],
  [
    8363,
    2
  ],
  [
    8364,
    2
  ],
  [
    [
      8365,
      8367
    ],
    2
  ],
  [
    [
      8368,
      8369
    ],
    2
  ],
  [
    [
      8370,
      8373
    ],
    2
  ],
  [
    [
      8374,
      8376
    ],
    2
  ],
  [
    8377,
    2
  ],
  [
    8378,
    2
  ],
  [
    [
      8379,
      8381
    ],
    2
  ],
  [
    8382,
    2
  ],
  [
    8383,
    2
  ],
  [
    8384,
    2
  ],
  [
    [
      8385,
      8399
    ],
    3
  ],
  [
    [
      8400,
      8417
    ],
    2
  ],
  [
    [
      8418,
      8419
    ],
    2
  ],
  [
    [
      8420,
      8426
    ],
    2
  ],
  [
    8427,
    2
  ],
  [
    [
      8428,
      8431
    ],
    2
  ],
  [
    8432,
    2
  ],
  [
    [
      8433,
      8447
    ],
    3
  ],
  [
    8448,
    5,
    "a/c"
  ],
  [
    8449,
    5,
    "a/s"
  ],
  [
    8450,
    1,
    "c"
  ],
  [
    8451,
    1,
    "°c"
  ],
  [
    8452,
    2
  ],
  [
    8453,
    5,
    "c/o"
  ],
  [
    8454,
    5,
    "c/u"
  ],
  [
    8455,
    1,
    "ɛ"
  ],
  [
    8456,
    2
  ],
  [
    8457,
    1,
    "°f"
  ],
  [
    8458,
    1,
    "g"
  ],
  [
    [
      8459,
      8462
    ],
    1,
    "h"
  ],
  [
    8463,
    1,
    "ħ"
  ],
  [
    [
      8464,
      8465
    ],
    1,
    "i"
  ],
  [
    [
      8466,
      8467
    ],
    1,
    "l"
  ],
  [
    8468,
    2
  ],
  [
    8469,
    1,
    "n"
  ],
  [
    8470,
    1,
    "no"
  ],
  [
    [
      8471,
      8472
    ],
    2
  ],
  [
    8473,
    1,
    "p"
  ],
  [
    8474,
    1,
    "q"
  ],
  [
    [
      8475,
      8477
    ],
    1,
    "r"
  ],
  [
    [
      8478,
      8479
    ],
    2
  ],
  [
    8480,
    1,
    "sm"
  ],
  [
    8481,
    1,
    "tel"
  ],
  [
    8482,
    1,
    "tm"
  ],
  [
    8483,
    2
  ],
  [
    8484,
    1,
    "z"
  ],
  [
    8485,
    2
  ],
  [
    8486,
    1,
    "ω"
  ],
  [
    8487,
    2
  ],
  [
    8488,
    1,
    "z"
  ],
  [
    8489,
    2
  ],
  [
    8490,
    1,
    "k"
  ],
  [
    8491,
    1,
    "å"
  ],
  [
    8492,
    1,
    "b"
  ],
  [
    8493,
    1,
    "c"
  ],
  [
    8494,
    2
  ],
  [
    [
      8495,
      8496
    ],
    1,
    "e"
  ],
  [
    8497,
    1,
    "f"
  ],
  [
    8498,
    3
  ],
  [
    8499,
    1,
    "m"
  ],
  [
    8500,
    1,
    "o"
  ],
  [
    8501,
    1,
    "א"
  ],
  [
    8502,
    1,
    "ב"
  ],
  [
    8503,
    1,
    "ג"
  ],
  [
    8504,
    1,
    "ד"
  ],
  [
    8505,
    1,
    "i"
  ],
  [
    8506,
    2
  ],
  [
    8507,
    1,
    "fax"
  ],
  [
    8508,
    1,
    "π"
  ],
  [
    [
      8509,
      8510
    ],
    1,
    "γ"
  ],
  [
    8511,
    1,
    "π"
  ],
  [
    8512,
    1,
    "∑"
  ],
  [
    [
      8513,
      8516
    ],
    2
  ],
  [
    [
      8517,
      8518
    ],
    1,
    "d"
  ],
  [
    8519,
    1,
    "e"
  ],
  [
    8520,
    1,
    "i"
  ],
  [
    8521,
    1,
    "j"
  ],
  [
    [
      8522,
      8523
    ],
    2
  ],
  [
    8524,
    2
  ],
  [
    8525,
    2
  ],
  [
    8526,
    2
  ],
  [
    8527,
    2
  ],
  [
    8528,
    1,
    "1⁄7"
  ],
  [
    8529,
    1,
    "1⁄9"
  ],
  [
    8530,
    1,
    "1⁄10"
  ],
  [
    8531,
    1,
    "1⁄3"
  ],
  [
    8532,
    1,
    "2⁄3"
  ],
  [
    8533,
    1,
    "1⁄5"
  ],
  [
    8534,
    1,
    "2⁄5"
  ],
  [
    8535,
    1,
    "3⁄5"
  ],
  [
    8536,
    1,
    "4⁄5"
  ],
  [
    8537,
    1,
    "1⁄6"
  ],
  [
    8538,
    1,
    "5⁄6"
  ],
  [
    8539,
    1,
    "1⁄8"
  ],
  [
    8540,
    1,
    "3⁄8"
  ],
  [
    8541,
    1,
    "5⁄8"
  ],
  [
    8542,
    1,
    "7⁄8"
  ],
  [
    8543,
    1,
    "1⁄"
  ],
  [
    8544,
    1,
    "i"
  ],
  [
    8545,
    1,
    "ii"
  ],
  [
    8546,
    1,
    "iii"
  ],
  [
    8547,
    1,
    "iv"
  ],
  [
    8548,
    1,
    "v"
  ],
  [
    8549,
    1,
    "vi"
  ],
  [
    8550,
    1,
    "vii"
  ],
  [
    8551,
    1,
    "viii"
  ],
  [
    8552,
    1,
    "ix"
  ],
  [
    8553,
    1,
    "x"
  ],
  [
    8554,
    1,
    "xi"
  ],
  [
    8555,
    1,
    "xii"
  ],
  [
    8556,
    1,
    "l"
  ],
  [
    8557,
    1,
    "c"
  ],
  [
    8558,
    1,
    "d"
  ],
  [
    8559,
    1,
    "m"
  ],
  [
    8560,
    1,
    "i"
  ],
  [
    8561,
    1,
    "ii"
  ],
  [
    8562,
    1,
    "iii"
  ],
  [
    8563,
    1,
    "iv"
  ],
  [
    8564,
    1,
    "v"
  ],
  [
    8565,
    1,
    "vi"
  ],
  [
    8566,
    1,
    "vii"
  ],
  [
    8567,
    1,
    "viii"
  ],
  [
    8568,
    1,
    "ix"
  ],
  [
    8569,
    1,
    "x"
  ],
  [
    8570,
    1,
    "xi"
  ],
  [
    8571,
    1,
    "xii"
  ],
  [
    8572,
    1,
    "l"
  ],
  [
    8573,
    1,
    "c"
  ],
  [
    8574,
    1,
    "d"
  ],
  [
    8575,
    1,
    "m"
  ],
  [
    [
      8576,
      8578
    ],
    2
  ],
  [
    8579,
    3
  ],
  [
    8580,
    2
  ],
  [
    [
      8581,
      8584
    ],
    2
  ],
  [
    8585,
    1,
    "0⁄3"
  ],
  [
    [
      8586,
      8587
    ],
    2
  ],
  [
    [
      8588,
      8591
    ],
    3
  ],
  [
    [
      8592,
      8682
    ],
    2
  ],
  [
    [
      8683,
      8691
    ],
    2
  ],
  [
    [
      8692,
      8703
    ],
    2
  ],
  [
    [
      8704,
      8747
    ],
    2
  ],
  [
    8748,
    1,
    "∫∫"
  ],
  [
    8749,
    1,
    "∫∫∫"
  ],
  [
    8750,
    2
  ],
  [
    8751,
    1,
    "∮∮"
  ],
  [
    8752,
    1,
    "∮∮∮"
  ],
  [
    [
      8753,
      8945
    ],
    2
  ],
  [
    [
      8946,
      8959
    ],
    2
  ],
  [
    8960,
    2
  ],
  [
    8961,
    2
  ],
  [
    [
      8962,
      9e3
    ],
    2
  ],
  [
    9001,
    1,
    "〈"
  ],
  [
    9002,
    1,
    "〉"
  ],
  [
    [
      9003,
      9082
    ],
    2
  ],
  [
    9083,
    2
  ],
  [
    9084,
    2
  ],
  [
    [
      9085,
      9114
    ],
    2
  ],
  [
    [
      9115,
      9166
    ],
    2
  ],
  [
    [
      9167,
      9168
    ],
    2
  ],
  [
    [
      9169,
      9179
    ],
    2
  ],
  [
    [
      9180,
      9191
    ],
    2
  ],
  [
    9192,
    2
  ],
  [
    [
      9193,
      9203
    ],
    2
  ],
  [
    [
      9204,
      9210
    ],
    2
  ],
  [
    [
      9211,
      9214
    ],
    2
  ],
  [
    9215,
    2
  ],
  [
    [
      9216,
      9252
    ],
    2
  ],
  [
    [
      9253,
      9254
    ],
    2
  ],
  [
    [
      9255,
      9279
    ],
    3
  ],
  [
    [
      9280,
      9290
    ],
    2
  ],
  [
    [
      9291,
      9311
    ],
    3
  ],
  [
    9312,
    1,
    "1"
  ],
  [
    9313,
    1,
    "2"
  ],
  [
    9314,
    1,
    "3"
  ],
  [
    9315,
    1,
    "4"
  ],
  [
    9316,
    1,
    "5"
  ],
  [
    9317,
    1,
    "6"
  ],
  [
    9318,
    1,
    "7"
  ],
  [
    9319,
    1,
    "8"
  ],
  [
    9320,
    1,
    "9"
  ],
  [
    9321,
    1,
    "10"
  ],
  [
    9322,
    1,
    "11"
  ],
  [
    9323,
    1,
    "12"
  ],
  [
    9324,
    1,
    "13"
  ],
  [
    9325,
    1,
    "14"
  ],
  [
    9326,
    1,
    "15"
  ],
  [
    9327,
    1,
    "16"
  ],
  [
    9328,
    1,
    "17"
  ],
  [
    9329,
    1,
    "18"
  ],
  [
    9330,
    1,
    "19"
  ],
  [
    9331,
    1,
    "20"
  ],
  [
    9332,
    5,
    "(1)"
  ],
  [
    9333,
    5,
    "(2)"
  ],
  [
    9334,
    5,
    "(3)"
  ],
  [
    9335,
    5,
    "(4)"
  ],
  [
    9336,
    5,
    "(5)"
  ],
  [
    9337,
    5,
    "(6)"
  ],
  [
    9338,
    5,
    "(7)"
  ],
  [
    9339,
    5,
    "(8)"
  ],
  [
    9340,
    5,
    "(9)"
  ],
  [
    9341,
    5,
    "(10)"
  ],
  [
    9342,
    5,
    "(11)"
  ],
  [
    9343,
    5,
    "(12)"
  ],
  [
    9344,
    5,
    "(13)"
  ],
  [
    9345,
    5,
    "(14)"
  ],
  [
    9346,
    5,
    "(15)"
  ],
  [
    9347,
    5,
    "(16)"
  ],
  [
    9348,
    5,
    "(17)"
  ],
  [
    9349,
    5,
    "(18)"
  ],
  [
    9350,
    5,
    "(19)"
  ],
  [
    9351,
    5,
    "(20)"
  ],
  [
    [
      9352,
      9371
    ],
    3
  ],
  [
    9372,
    5,
    "(a)"
  ],
  [
    9373,
    5,
    "(b)"
  ],
  [
    9374,
    5,
    "(c)"
  ],
  [
    9375,
    5,
    "(d)"
  ],
  [
    9376,
    5,
    "(e)"
  ],
  [
    9377,
    5,
    "(f)"
  ],
  [
    9378,
    5,
    "(g)"
  ],
  [
    9379,
    5,
    "(h)"
  ],
  [
    9380,
    5,
    "(i)"
  ],
  [
    9381,
    5,
    "(j)"
  ],
  [
    9382,
    5,
    "(k)"
  ],
  [
    9383,
    5,
    "(l)"
  ],
  [
    9384,
    5,
    "(m)"
  ],
  [
    9385,
    5,
    "(n)"
  ],
  [
    9386,
    5,
    "(o)"
  ],
  [
    9387,
    5,
    "(p)"
  ],
  [
    9388,
    5,
    "(q)"
  ],
  [
    9389,
    5,
    "(r)"
  ],
  [
    9390,
    5,
    "(s)"
  ],
  [
    9391,
    5,
    "(t)"
  ],
  [
    9392,
    5,
    "(u)"
  ],
  [
    9393,
    5,
    "(v)"
  ],
  [
    9394,
    5,
    "(w)"
  ],
  [
    9395,
    5,
    "(x)"
  ],
  [
    9396,
    5,
    "(y)"
  ],
  [
    9397,
    5,
    "(z)"
  ],
  [
    9398,
    1,
    "a"
  ],
  [
    9399,
    1,
    "b"
  ],
  [
    9400,
    1,
    "c"
  ],
  [
    9401,
    1,
    "d"
  ],
  [
    9402,
    1,
    "e"
  ],
  [
    9403,
    1,
    "f"
  ],
  [
    9404,
    1,
    "g"
  ],
  [
    9405,
    1,
    "h"
  ],
  [
    9406,
    1,
    "i"
  ],
  [
    9407,
    1,
    "j"
  ],
  [
    9408,
    1,
    "k"
  ],
  [
    9409,
    1,
    "l"
  ],
  [
    9410,
    1,
    "m"
  ],
  [
    9411,
    1,
    "n"
  ],
  [
    9412,
    1,
    "o"
  ],
  [
    9413,
    1,
    "p"
  ],
  [
    9414,
    1,
    "q"
  ],
  [
    9415,
    1,
    "r"
  ],
  [
    9416,
    1,
    "s"
  ],
  [
    9417,
    1,
    "t"
  ],
  [
    9418,
    1,
    "u"
  ],
  [
    9419,
    1,
    "v"
  ],
  [
    9420,
    1,
    "w"
  ],
  [
    9421,
    1,
    "x"
  ],
  [
    9422,
    1,
    "y"
  ],
  [
    9423,
    1,
    "z"
  ],
  [
    9424,
    1,
    "a"
  ],
  [
    9425,
    1,
    "b"
  ],
  [
    9426,
    1,
    "c"
  ],
  [
    9427,
    1,
    "d"
  ],
  [
    9428,
    1,
    "e"
  ],
  [
    9429,
    1,
    "f"
  ],
  [
    9430,
    1,
    "g"
  ],
  [
    9431,
    1,
    "h"
  ],
  [
    9432,
    1,
    "i"
  ],
  [
    9433,
    1,
    "j"
  ],
  [
    9434,
    1,
    "k"
  ],
  [
    9435,
    1,
    "l"
  ],
  [
    9436,
    1,
    "m"
  ],
  [
    9437,
    1,
    "n"
  ],
  [
    9438,
    1,
    "o"
  ],
  [
    9439,
    1,
    "p"
  ],
  [
    9440,
    1,
    "q"
  ],
  [
    9441,
    1,
    "r"
  ],
  [
    9442,
    1,
    "s"
  ],
  [
    9443,
    1,
    "t"
  ],
  [
    9444,
    1,
    "u"
  ],
  [
    9445,
    1,
    "v"
  ],
  [
    9446,
    1,
    "w"
  ],
  [
    9447,
    1,
    "x"
  ],
  [
    9448,
    1,
    "y"
  ],
  [
    9449,
    1,
    "z"
  ],
  [
    9450,
    1,
    "0"
  ],
  [
    [
      9451,
      9470
    ],
    2
  ],
  [
    9471,
    2
  ],
  [
    [
      9472,
      9621
    ],
    2
  ],
  [
    [
      9622,
      9631
    ],
    2
  ],
  [
    [
      9632,
      9711
    ],
    2
  ],
  [
    [
      9712,
      9719
    ],
    2
  ],
  [
    [
      9720,
      9727
    ],
    2
  ],
  [
    [
      9728,
      9747
    ],
    2
  ],
  [
    [
      9748,
      9749
    ],
    2
  ],
  [
    [
      9750,
      9751
    ],
    2
  ],
  [
    9752,
    2
  ],
  [
    9753,
    2
  ],
  [
    [
      9754,
      9839
    ],
    2
  ],
  [
    [
      9840,
      9841
    ],
    2
  ],
  [
    [
      9842,
      9853
    ],
    2
  ],
  [
    [
      9854,
      9855
    ],
    2
  ],
  [
    [
      9856,
      9865
    ],
    2
  ],
  [
    [
      9866,
      9873
    ],
    2
  ],
  [
    [
      9874,
      9884
    ],
    2
  ],
  [
    9885,
    2
  ],
  [
    [
      9886,
      9887
    ],
    2
  ],
  [
    [
      9888,
      9889
    ],
    2
  ],
  [
    [
      9890,
      9905
    ],
    2
  ],
  [
    9906,
    2
  ],
  [
    [
      9907,
      9916
    ],
    2
  ],
  [
    [
      9917,
      9919
    ],
    2
  ],
  [
    [
      9920,
      9923
    ],
    2
  ],
  [
    [
      9924,
      9933
    ],
    2
  ],
  [
    9934,
    2
  ],
  [
    [
      9935,
      9953
    ],
    2
  ],
  [
    9954,
    2
  ],
  [
    9955,
    2
  ],
  [
    [
      9956,
      9959
    ],
    2
  ],
  [
    [
      9960,
      9983
    ],
    2
  ],
  [
    9984,
    2
  ],
  [
    [
      9985,
      9988
    ],
    2
  ],
  [
    9989,
    2
  ],
  [
    [
      9990,
      9993
    ],
    2
  ],
  [
    [
      9994,
      9995
    ],
    2
  ],
  [
    [
      9996,
      10023
    ],
    2
  ],
  [
    10024,
    2
  ],
  [
    [
      10025,
      10059
    ],
    2
  ],
  [
    10060,
    2
  ],
  [
    10061,
    2
  ],
  [
    10062,
    2
  ],
  [
    [
      10063,
      10066
    ],
    2
  ],
  [
    [
      10067,
      10069
    ],
    2
  ],
  [
    10070,
    2
  ],
  [
    10071,
    2
  ],
  [
    [
      10072,
      10078
    ],
    2
  ],
  [
    [
      10079,
      10080
    ],
    2
  ],
  [
    [
      10081,
      10087
    ],
    2
  ],
  [
    [
      10088,
      10101
    ],
    2
  ],
  [
    [
      10102,
      10132
    ],
    2
  ],
  [
    [
      10133,
      10135
    ],
    2
  ],
  [
    [
      10136,
      10159
    ],
    2
  ],
  [
    10160,
    2
  ],
  [
    [
      10161,
      10174
    ],
    2
  ],
  [
    10175,
    2
  ],
  [
    [
      10176,
      10182
    ],
    2
  ],
  [
    [
      10183,
      10186
    ],
    2
  ],
  [
    10187,
    2
  ],
  [
    10188,
    2
  ],
  [
    10189,
    2
  ],
  [
    [
      10190,
      10191
    ],
    2
  ],
  [
    [
      10192,
      10219
    ],
    2
  ],
  [
    [
      10220,
      10223
    ],
    2
  ],
  [
    [
      10224,
      10239
    ],
    2
  ],
  [
    [
      10240,
      10495
    ],
    2
  ],
  [
    [
      10496,
      10763
    ],
    2
  ],
  [
    10764,
    1,
    "∫∫∫∫"
  ],
  [
    [
      10765,
      10867
    ],
    2
  ],
  [
    10868,
    5,
    "::="
  ],
  [
    10869,
    5,
    "=="
  ],
  [
    10870,
    5,
    "==="
  ],
  [
    [
      10871,
      10971
    ],
    2
  ],
  [
    10972,
    1,
    "⫝̸"
  ],
  [
    [
      10973,
      11007
    ],
    2
  ],
  [
    [
      11008,
      11021
    ],
    2
  ],
  [
    [
      11022,
      11027
    ],
    2
  ],
  [
    [
      11028,
      11034
    ],
    2
  ],
  [
    [
      11035,
      11039
    ],
    2
  ],
  [
    [
      11040,
      11043
    ],
    2
  ],
  [
    [
      11044,
      11084
    ],
    2
  ],
  [
    [
      11085,
      11087
    ],
    2
  ],
  [
    [
      11088,
      11092
    ],
    2
  ],
  [
    [
      11093,
      11097
    ],
    2
  ],
  [
    [
      11098,
      11123
    ],
    2
  ],
  [
    [
      11124,
      11125
    ],
    3
  ],
  [
    [
      11126,
      11157
    ],
    2
  ],
  [
    11158,
    3
  ],
  [
    11159,
    2
  ],
  [
    [
      11160,
      11193
    ],
    2
  ],
  [
    [
      11194,
      11196
    ],
    2
  ],
  [
    [
      11197,
      11208
    ],
    2
  ],
  [
    11209,
    2
  ],
  [
    [
      11210,
      11217
    ],
    2
  ],
  [
    11218,
    2
  ],
  [
    [
      11219,
      11243
    ],
    2
  ],
  [
    [
      11244,
      11247
    ],
    2
  ],
  [
    [
      11248,
      11262
    ],
    2
  ],
  [
    11263,
    2
  ],
  [
    11264,
    1,
    "ⰰ"
  ],
  [
    11265,
    1,
    "ⰱ"
  ],
  [
    11266,
    1,
    "ⰲ"
  ],
  [
    11267,
    1,
    "ⰳ"
  ],
  [
    11268,
    1,
    "ⰴ"
  ],
  [
    11269,
    1,
    "ⰵ"
  ],
  [
    11270,
    1,
    "ⰶ"
  ],
  [
    11271,
    1,
    "ⰷ"
  ],
  [
    11272,
    1,
    "ⰸ"
  ],
  [
    11273,
    1,
    "ⰹ"
  ],
  [
    11274,
    1,
    "ⰺ"
  ],
  [
    11275,
    1,
    "ⰻ"
  ],
  [
    11276,
    1,
    "ⰼ"
  ],
  [
    11277,
    1,
    "ⰽ"
  ],
  [
    11278,
    1,
    "ⰾ"
  ],
  [
    11279,
    1,
    "ⰿ"
  ],
  [
    11280,
    1,
    "ⱀ"
  ],
  [
    11281,
    1,
    "ⱁ"
  ],
  [
    11282,
    1,
    "ⱂ"
  ],
  [
    11283,
    1,
    "ⱃ"
  ],
  [
    11284,
    1,
    "ⱄ"
  ],
  [
    11285,
    1,
    "ⱅ"
  ],
  [
    11286,
    1,
    "ⱆ"
  ],
  [
    11287,
    1,
    "ⱇ"
  ],
  [
    11288,
    1,
    "ⱈ"
  ],
  [
    11289,
    1,
    "ⱉ"
  ],
  [
    11290,
    1,
    "ⱊ"
  ],
  [
    11291,
    1,
    "ⱋ"
  ],
  [
    11292,
    1,
    "ⱌ"
  ],
  [
    11293,
    1,
    "ⱍ"
  ],
  [
    11294,
    1,
    "ⱎ"
  ],
  [
    11295,
    1,
    "ⱏ"
  ],
  [
    11296,
    1,
    "ⱐ"
  ],
  [
    11297,
    1,
    "ⱑ"
  ],
  [
    11298,
    1,
    "ⱒ"
  ],
  [
    11299,
    1,
    "ⱓ"
  ],
  [
    11300,
    1,
    "ⱔ"
  ],
  [
    11301,
    1,
    "ⱕ"
  ],
  [
    11302,
    1,
    "ⱖ"
  ],
  [
    11303,
    1,
    "ⱗ"
  ],
  [
    11304,
    1,
    "ⱘ"
  ],
  [
    11305,
    1,
    "ⱙ"
  ],
  [
    11306,
    1,
    "ⱚ"
  ],
  [
    11307,
    1,
    "ⱛ"
  ],
  [
    11308,
    1,
    "ⱜ"
  ],
  [
    11309,
    1,
    "ⱝ"
  ],
  [
    11310,
    1,
    "ⱞ"
  ],
  [
    11311,
    1,
    "ⱟ"
  ],
  [
    [
      11312,
      11358
    ],
    2
  ],
  [
    11359,
    2
  ],
  [
    11360,
    1,
    "ⱡ"
  ],
  [
    11361,
    2
  ],
  [
    11362,
    1,
    "ɫ"
  ],
  [
    11363,
    1,
    "ᵽ"
  ],
  [
    11364,
    1,
    "ɽ"
  ],
  [
    [
      11365,
      11366
    ],
    2
  ],
  [
    11367,
    1,
    "ⱨ"
  ],
  [
    11368,
    2
  ],
  [
    11369,
    1,
    "ⱪ"
  ],
  [
    11370,
    2
  ],
  [
    11371,
    1,
    "ⱬ"
  ],
  [
    11372,
    2
  ],
  [
    11373,
    1,
    "ɑ"
  ],
  [
    11374,
    1,
    "ɱ"
  ],
  [
    11375,
    1,
    "ɐ"
  ],
  [
    11376,
    1,
    "ɒ"
  ],
  [
    11377,
    2
  ],
  [
    11378,
    1,
    "ⱳ"
  ],
  [
    11379,
    2
  ],
  [
    11380,
    2
  ],
  [
    11381,
    1,
    "ⱶ"
  ],
  [
    [
      11382,
      11383
    ],
    2
  ],
  [
    [
      11384,
      11387
    ],
    2
  ],
  [
    11388,
    1,
    "j"
  ],
  [
    11389,
    1,
    "v"
  ],
  [
    11390,
    1,
    "ȿ"
  ],
  [
    11391,
    1,
    "ɀ"
  ],
  [
    11392,
    1,
    "ⲁ"
  ],
  [
    11393,
    2
  ],
  [
    11394,
    1,
    "ⲃ"
  ],
  [
    11395,
    2
  ],
  [
    11396,
    1,
    "ⲅ"
  ],
  [
    11397,
    2
  ],
  [
    11398,
    1,
    "ⲇ"
  ],
  [
    11399,
    2
  ],
  [
    11400,
    1,
    "ⲉ"
  ],
  [
    11401,
    2
  ],
  [
    11402,
    1,
    "ⲋ"
  ],
  [
    11403,
    2
  ],
  [
    11404,
    1,
    "ⲍ"
  ],
  [
    11405,
    2
  ],
  [
    11406,
    1,
    "ⲏ"
  ],
  [
    11407,
    2
  ],
  [
    11408,
    1,
    "ⲑ"
  ],
  [
    11409,
    2
  ],
  [
    11410,
    1,
    "ⲓ"
  ],
  [
    11411,
    2
  ],
  [
    11412,
    1,
    "ⲕ"
  ],
  [
    11413,
    2
  ],
  [
    11414,
    1,
    "ⲗ"
  ],
  [
    11415,
    2
  ],
  [
    11416,
    1,
    "ⲙ"
  ],
  [
    11417,
    2
  ],
  [
    11418,
    1,
    "ⲛ"
  ],
  [
    11419,
    2
  ],
  [
    11420,
    1,
    "ⲝ"
  ],
  [
    11421,
    2
  ],
  [
    11422,
    1,
    "ⲟ"
  ],
  [
    11423,
    2
  ],
  [
    11424,
    1,
    "ⲡ"
  ],
  [
    11425,
    2
  ],
  [
    11426,
    1,
    "ⲣ"
  ],
  [
    11427,
    2
  ],
  [
    11428,
    1,
    "ⲥ"
  ],
  [
    11429,
    2
  ],
  [
    11430,
    1,
    "ⲧ"
  ],
  [
    11431,
    2
  ],
  [
    11432,
    1,
    "ⲩ"
  ],
  [
    11433,
    2
  ],
  [
    11434,
    1,
    "ⲫ"
  ],
  [
    11435,
    2
  ],
  [
    11436,
    1,
    "ⲭ"
  ],
  [
    11437,
    2
  ],
  [
    11438,
    1,
    "ⲯ"
  ],
  [
    11439,
    2
  ],
  [
    11440,
    1,
    "ⲱ"
  ],
  [
    11441,
    2
  ],
  [
    11442,
    1,
    "ⲳ"
  ],
  [
    11443,
    2
  ],
  [
    11444,
    1,
    "ⲵ"
  ],
  [
    11445,
    2
  ],
  [
    11446,
    1,
    "ⲷ"
  ],
  [
    11447,
    2
  ],
  [
    11448,
    1,
    "ⲹ"
  ],
  [
    11449,
    2
  ],
  [
    11450,
    1,
    "ⲻ"
  ],
  [
    11451,
    2
  ],
  [
    11452,
    1,
    "ⲽ"
  ],
  [
    11453,
    2
  ],
  [
    11454,
    1,
    "ⲿ"
  ],
  [
    11455,
    2
  ],
  [
    11456,
    1,
    "ⳁ"
  ],
  [
    11457,
    2
  ],
  [
    11458,
    1,
    "ⳃ"
  ],
  [
    11459,
    2
  ],
  [
    11460,
    1,
    "ⳅ"
  ],
  [
    11461,
    2
  ],
  [
    11462,
    1,
    "ⳇ"
  ],
  [
    11463,
    2
  ],
  [
    11464,
    1,
    "ⳉ"
  ],
  [
    11465,
    2
  ],
  [
    11466,
    1,
    "ⳋ"
  ],
  [
    11467,
    2
  ],
  [
    11468,
    1,
    "ⳍ"
  ],
  [
    11469,
    2
  ],
  [
    11470,
    1,
    "ⳏ"
  ],
  [
    11471,
    2
  ],
  [
    11472,
    1,
    "ⳑ"
  ],
  [
    11473,
    2
  ],
  [
    11474,
    1,
    "ⳓ"
  ],
  [
    11475,
    2
  ],
  [
    11476,
    1,
    "ⳕ"
  ],
  [
    11477,
    2
  ],
  [
    11478,
    1,
    "ⳗ"
  ],
  [
    11479,
    2
  ],
  [
    11480,
    1,
    "ⳙ"
  ],
  [
    11481,
    2
  ],
  [
    11482,
    1,
    "ⳛ"
  ],
  [
    11483,
    2
  ],
  [
    11484,
    1,
    "ⳝ"
  ],
  [
    11485,
    2
  ],
  [
    11486,
    1,
    "ⳟ"
  ],
  [
    11487,
    2
  ],
  [
    11488,
    1,
    "ⳡ"
  ],
  [
    11489,
    2
  ],
  [
    11490,
    1,
    "ⳣ"
  ],
  [
    [
      11491,
      11492
    ],
    2
  ],
  [
    [
      11493,
      11498
    ],
    2
  ],
  [
    11499,
    1,
    "ⳬ"
  ],
  [
    11500,
    2
  ],
  [
    11501,
    1,
    "ⳮ"
  ],
  [
    [
      11502,
      11505
    ],
    2
  ],
  [
    11506,
    1,
    "ⳳ"
  ],
  [
    11507,
    2
  ],
  [
    [
      11508,
      11512
    ],
    3
  ],
  [
    [
      11513,
      11519
    ],
    2
  ],
  [
    [
      11520,
      11557
    ],
    2
  ],
  [
    11558,
    3
  ],
  [
    11559,
    2
  ],
  [
    [
      11560,
      11564
    ],
    3
  ],
  [
    11565,
    2
  ],
  [
    [
      11566,
      11567
    ],
    3
  ],
  [
    [
      11568,
      11621
    ],
    2
  ],
  [
    [
      11622,
      11623
    ],
    2
  ],
  [
    [
      11624,
      11630
    ],
    3
  ],
  [
    11631,
    1,
    "ⵡ"
  ],
  [
    11632,
    2
  ],
  [
    [
      11633,
      11646
    ],
    3
  ],
  [
    11647,
    2
  ],
  [
    [
      11648,
      11670
    ],
    2
  ],
  [
    [
      11671,
      11679
    ],
    3
  ],
  [
    [
      11680,
      11686
    ],
    2
  ],
  [
    11687,
    3
  ],
  [
    [
      11688,
      11694
    ],
    2
  ],
  [
    11695,
    3
  ],
  [
    [
      11696,
      11702
    ],
    2
  ],
  [
    11703,
    3
  ],
  [
    [
      11704,
      11710
    ],
    2
  ],
  [
    11711,
    3
  ],
  [
    [
      11712,
      11718
    ],
    2
  ],
  [
    11719,
    3
  ],
  [
    [
      11720,
      11726
    ],
    2
  ],
  [
    11727,
    3
  ],
  [
    [
      11728,
      11734
    ],
    2
  ],
  [
    11735,
    3
  ],
  [
    [
      11736,
      11742
    ],
    2
  ],
  [
    11743,
    3
  ],
  [
    [
      11744,
      11775
    ],
    2
  ],
  [
    [
      11776,
      11799
    ],
    2
  ],
  [
    [
      11800,
      11803
    ],
    2
  ],
  [
    [
      11804,
      11805
    ],
    2
  ],
  [
    [
      11806,
      11822
    ],
    2
  ],
  [
    11823,
    2
  ],
  [
    11824,
    2
  ],
  [
    11825,
    2
  ],
  [
    [
      11826,
      11835
    ],
    2
  ],
  [
    [
      11836,
      11842
    ],
    2
  ],
  [
    [
      11843,
      11844
    ],
    2
  ],
  [
    [
      11845,
      11849
    ],
    2
  ],
  [
    [
      11850,
      11854
    ],
    2
  ],
  [
    11855,
    2
  ],
  [
    [
      11856,
      11858
    ],
    2
  ],
  [
    [
      11859,
      11869
    ],
    2
  ],
  [
    [
      11870,
      11903
    ],
    3
  ],
  [
    [
      11904,
      11929
    ],
    2
  ],
  [
    11930,
    3
  ],
  [
    [
      11931,
      11934
    ],
    2
  ],
  [
    11935,
    1,
    "母"
  ],
  [
    [
      11936,
      12018
    ],
    2
  ],
  [
    12019,
    1,
    "龟"
  ],
  [
    [
      12020,
      12031
    ],
    3
  ],
  [
    12032,
    1,
    "一"
  ],
  [
    12033,
    1,
    "丨"
  ],
  [
    12034,
    1,
    "丶"
  ],
  [
    12035,
    1,
    "丿"
  ],
  [
    12036,
    1,
    "乙"
  ],
  [
    12037,
    1,
    "亅"
  ],
  [
    12038,
    1,
    "二"
  ],
  [
    12039,
    1,
    "亠"
  ],
  [
    12040,
    1,
    "人"
  ],
  [
    12041,
    1,
    "儿"
  ],
  [
    12042,
    1,
    "入"
  ],
  [
    12043,
    1,
    "八"
  ],
  [
    12044,
    1,
    "冂"
  ],
  [
    12045,
    1,
    "冖"
  ],
  [
    12046,
    1,
    "冫"
  ],
  [
    12047,
    1,
    "几"
  ],
  [
    12048,
    1,
    "凵"
  ],
  [
    12049,
    1,
    "刀"
  ],
  [
    12050,
    1,
    "力"
  ],
  [
    12051,
    1,
    "勹"
  ],
  [
    12052,
    1,
    "匕"
  ],
  [
    12053,
    1,
    "匚"
  ],
  [
    12054,
    1,
    "匸"
  ],
  [
    12055,
    1,
    "十"
  ],
  [
    12056,
    1,
    "卜"
  ],
  [
    12057,
    1,
    "卩"
  ],
  [
    12058,
    1,
    "厂"
  ],
  [
    12059,
    1,
    "厶"
  ],
  [
    12060,
    1,
    "又"
  ],
  [
    12061,
    1,
    "口"
  ],
  [
    12062,
    1,
    "囗"
  ],
  [
    12063,
    1,
    "土"
  ],
  [
    12064,
    1,
    "士"
  ],
  [
    12065,
    1,
    "夂"
  ],
  [
    12066,
    1,
    "夊"
  ],
  [
    12067,
    1,
    "夕"
  ],
  [
    12068,
    1,
    "大"
  ],
  [
    12069,
    1,
    "女"
  ],
  [
    12070,
    1,
    "子"
  ],
  [
    12071,
    1,
    "宀"
  ],
  [
    12072,
    1,
    "寸"
  ],
  [
    12073,
    1,
    "小"
  ],
  [
    12074,
    1,
    "尢"
  ],
  [
    12075,
    1,
    "尸"
  ],
  [
    12076,
    1,
    "屮"
  ],
  [
    12077,
    1,
    "山"
  ],
  [
    12078,
    1,
    "巛"
  ],
  [
    12079,
    1,
    "工"
  ],
  [
    12080,
    1,
    "己"
  ],
  [
    12081,
    1,
    "巾"
  ],
  [
    12082,
    1,
    "干"
  ],
  [
    12083,
    1,
    "幺"
  ],
  [
    12084,
    1,
    "广"
  ],
  [
    12085,
    1,
    "廴"
  ],
  [
    12086,
    1,
    "廾"
  ],
  [
    12087,
    1,
    "弋"
  ],
  [
    12088,
    1,
    "弓"
  ],
  [
    12089,
    1,
    "彐"
  ],
  [
    12090,
    1,
    "彡"
  ],
  [
    12091,
    1,
    "彳"
  ],
  [
    12092,
    1,
    "心"
  ],
  [
    12093,
    1,
    "戈"
  ],
  [
    12094,
    1,
    "戶"
  ],
  [
    12095,
    1,
    "手"
  ],
  [
    12096,
    1,
    "支"
  ],
  [
    12097,
    1,
    "攴"
  ],
  [
    12098,
    1,
    "文"
  ],
  [
    12099,
    1,
    "斗"
  ],
  [
    12100,
    1,
    "斤"
  ],
  [
    12101,
    1,
    "方"
  ],
  [
    12102,
    1,
    "无"
  ],
  [
    12103,
    1,
    "日"
  ],
  [
    12104,
    1,
    "曰"
  ],
  [
    12105,
    1,
    "月"
  ],
  [
    12106,
    1,
    "木"
  ],
  [
    12107,
    1,
    "欠"
  ],
  [
    12108,
    1,
    "止"
  ],
  [
    12109,
    1,
    "歹"
  ],
  [
    12110,
    1,
    "殳"
  ],
  [
    12111,
    1,
    "毋"
  ],
  [
    12112,
    1,
    "比"
  ],
  [
    12113,
    1,
    "毛"
  ],
  [
    12114,
    1,
    "氏"
  ],
  [
    12115,
    1,
    "气"
  ],
  [
    12116,
    1,
    "水"
  ],
  [
    12117,
    1,
    "火"
  ],
  [
    12118,
    1,
    "爪"
  ],
  [
    12119,
    1,
    "父"
  ],
  [
    12120,
    1,
    "爻"
  ],
  [
    12121,
    1,
    "爿"
  ],
  [
    12122,
    1,
    "片"
  ],
  [
    12123,
    1,
    "牙"
  ],
  [
    12124,
    1,
    "牛"
  ],
  [
    12125,
    1,
    "犬"
  ],
  [
    12126,
    1,
    "玄"
  ],
  [
    12127,
    1,
    "玉"
  ],
  [
    12128,
    1,
    "瓜"
  ],
  [
    12129,
    1,
    "瓦"
  ],
  [
    12130,
    1,
    "甘"
  ],
  [
    12131,
    1,
    "生"
  ],
  [
    12132,
    1,
    "用"
  ],
  [
    12133,
    1,
    "田"
  ],
  [
    12134,
    1,
    "疋"
  ],
  [
    12135,
    1,
    "疒"
  ],
  [
    12136,
    1,
    "癶"
  ],
  [
    12137,
    1,
    "白"
  ],
  [
    12138,
    1,
    "皮"
  ],
  [
    12139,
    1,
    "皿"
  ],
  [
    12140,
    1,
    "目"
  ],
  [
    12141,
    1,
    "矛"
  ],
  [
    12142,
    1,
    "矢"
  ],
  [
    12143,
    1,
    "石"
  ],
  [
    12144,
    1,
    "示"
  ],
  [
    12145,
    1,
    "禸"
  ],
  [
    12146,
    1,
    "禾"
  ],
  [
    12147,
    1,
    "穴"
  ],
  [
    12148,
    1,
    "立"
  ],
  [
    12149,
    1,
    "竹"
  ],
  [
    12150,
    1,
    "米"
  ],
  [
    12151,
    1,
    "糸"
  ],
  [
    12152,
    1,
    "缶"
  ],
  [
    12153,
    1,
    "网"
  ],
  [
    12154,
    1,
    "羊"
  ],
  [
    12155,
    1,
    "羽"
  ],
  [
    12156,
    1,
    "老"
  ],
  [
    12157,
    1,
    "而"
  ],
  [
    12158,
    1,
    "耒"
  ],
  [
    12159,
    1,
    "耳"
  ],
  [
    12160,
    1,
    "聿"
  ],
  [
    12161,
    1,
    "肉"
  ],
  [
    12162,
    1,
    "臣"
  ],
  [
    12163,
    1,
    "自"
  ],
  [
    12164,
    1,
    "至"
  ],
  [
    12165,
    1,
    "臼"
  ],
  [
    12166,
    1,
    "舌"
  ],
  [
    12167,
    1,
    "舛"
  ],
  [
    12168,
    1,
    "舟"
  ],
  [
    12169,
    1,
    "艮"
  ],
  [
    12170,
    1,
    "色"
  ],
  [
    12171,
    1,
    "艸"
  ],
  [
    12172,
    1,
    "虍"
  ],
  [
    12173,
    1,
    "虫"
  ],
  [
    12174,
    1,
    "血"
  ],
  [
    12175,
    1,
    "行"
  ],
  [
    12176,
    1,
    "衣"
  ],
  [
    12177,
    1,
    "襾"
  ],
  [
    12178,
    1,
    "見"
  ],
  [
    12179,
    1,
    "角"
  ],
  [
    12180,
    1,
    "言"
  ],
  [
    12181,
    1,
    "谷"
  ],
  [
    12182,
    1,
    "豆"
  ],
  [
    12183,
    1,
    "豕"
  ],
  [
    12184,
    1,
    "豸"
  ],
  [
    12185,
    1,
    "貝"
  ],
  [
    12186,
    1,
    "赤"
  ],
  [
    12187,
    1,
    "走"
  ],
  [
    12188,
    1,
    "足"
  ],
  [
    12189,
    1,
    "身"
  ],
  [
    12190,
    1,
    "車"
  ],
  [
    12191,
    1,
    "辛"
  ],
  [
    12192,
    1,
    "辰"
  ],
  [
    12193,
    1,
    "辵"
  ],
  [
    12194,
    1,
    "邑"
  ],
  [
    12195,
    1,
    "酉"
  ],
  [
    12196,
    1,
    "釆"
  ],
  [
    12197,
    1,
    "里"
  ],
  [
    12198,
    1,
    "金"
  ],
  [
    12199,
    1,
    "長"
  ],
  [
    12200,
    1,
    "門"
  ],
  [
    12201,
    1,
    "阜"
  ],
  [
    12202,
    1,
    "隶"
  ],
  [
    12203,
    1,
    "隹"
  ],
  [
    12204,
    1,
    "雨"
  ],
  [
    12205,
    1,
    "靑"
  ],
  [
    12206,
    1,
    "非"
  ],
  [
    12207,
    1,
    "面"
  ],
  [
    12208,
    1,
    "革"
  ],
  [
    12209,
    1,
    "韋"
  ],
  [
    12210,
    1,
    "韭"
  ],
  [
    12211,
    1,
    "音"
  ],
  [
    12212,
    1,
    "頁"
  ],
  [
    12213,
    1,
    "風"
  ],
  [
    12214,
    1,
    "飛"
  ],
  [
    12215,
    1,
    "食"
  ],
  [
    12216,
    1,
    "首"
  ],
  [
    12217,
    1,
    "香"
  ],
  [
    12218,
    1,
    "馬"
  ],
  [
    12219,
    1,
    "骨"
  ],
  [
    12220,
    1,
    "高"
  ],
  [
    12221,
    1,
    "髟"
  ],
  [
    12222,
    1,
    "鬥"
  ],
  [
    12223,
    1,
    "鬯"
  ],
  [
    12224,
    1,
    "鬲"
  ],
  [
    12225,
    1,
    "鬼"
  ],
  [
    12226,
    1,
    "魚"
  ],
  [
    12227,
    1,
    "鳥"
  ],
  [
    12228,
    1,
    "鹵"
  ],
  [
    12229,
    1,
    "鹿"
  ],
  [
    12230,
    1,
    "麥"
  ],
  [
    12231,
    1,
    "麻"
  ],
  [
    12232,
    1,
    "黃"
  ],
  [
    12233,
    1,
    "黍"
  ],
  [
    12234,
    1,
    "黑"
  ],
  [
    12235,
    1,
    "黹"
  ],
  [
    12236,
    1,
    "黽"
  ],
  [
    12237,
    1,
    "鼎"
  ],
  [
    12238,
    1,
    "鼓"
  ],
  [
    12239,
    1,
    "鼠"
  ],
  [
    12240,
    1,
    "鼻"
  ],
  [
    12241,
    1,
    "齊"
  ],
  [
    12242,
    1,
    "齒"
  ],
  [
    12243,
    1,
    "龍"
  ],
  [
    12244,
    1,
    "龜"
  ],
  [
    12245,
    1,
    "龠"
  ],
  [
    [
      12246,
      12271
    ],
    3
  ],
  [
    [
      12272,
      12283
    ],
    3
  ],
  [
    [
      12284,
      12287
    ],
    3
  ],
  [
    12288,
    5,
    " "
  ],
  [
    12289,
    2
  ],
  [
    12290,
    1,
    "."
  ],
  [
    [
      12291,
      12292
    ],
    2
  ],
  [
    [
      12293,
      12295
    ],
    2
  ],
  [
    [
      12296,
      12329
    ],
    2
  ],
  [
    [
      12330,
      12333
    ],
    2
  ],
  [
    [
      12334,
      12341
    ],
    2
  ],
  [
    12342,
    1,
    "〒"
  ],
  [
    12343,
    2
  ],
  [
    12344,
    1,
    "十"
  ],
  [
    12345,
    1,
    "卄"
  ],
  [
    12346,
    1,
    "卅"
  ],
  [
    12347,
    2
  ],
  [
    12348,
    2
  ],
  [
    12349,
    2
  ],
  [
    12350,
    2
  ],
  [
    12351,
    2
  ],
  [
    12352,
    3
  ],
  [
    [
      12353,
      12436
    ],
    2
  ],
  [
    [
      12437,
      12438
    ],
    2
  ],
  [
    [
      12439,
      12440
    ],
    3
  ],
  [
    [
      12441,
      12442
    ],
    2
  ],
  [
    12443,
    5,
    " ゙"
  ],
  [
    12444,
    5,
    " ゚"
  ],
  [
    [
      12445,
      12446
    ],
    2
  ],
  [
    12447,
    1,
    "より"
  ],
  [
    12448,
    2
  ],
  [
    [
      12449,
      12542
    ],
    2
  ],
  [
    12543,
    1,
    "コト"
  ],
  [
    [
      12544,
      12548
    ],
    3
  ],
  [
    [
      12549,
      12588
    ],
    2
  ],
  [
    12589,
    2
  ],
  [
    12590,
    2
  ],
  [
    12591,
    2
  ],
  [
    12592,
    3
  ],
  [
    12593,
    1,
    "ᄀ"
  ],
  [
    12594,
    1,
    "ᄁ"
  ],
  [
    12595,
    1,
    "ᆪ"
  ],
  [
    12596,
    1,
    "ᄂ"
  ],
  [
    12597,
    1,
    "ᆬ"
  ],
  [
    12598,
    1,
    "ᆭ"
  ],
  [
    12599,
    1,
    "ᄃ"
  ],
  [
    12600,
    1,
    "ᄄ"
  ],
  [
    12601,
    1,
    "ᄅ"
  ],
  [
    12602,
    1,
    "ᆰ"
  ],
  [
    12603,
    1,
    "ᆱ"
  ],
  [
    12604,
    1,
    "ᆲ"
  ],
  [
    12605,
    1,
    "ᆳ"
  ],
  [
    12606,
    1,
    "ᆴ"
  ],
  [
    12607,
    1,
    "ᆵ"
  ],
  [
    12608,
    1,
    "ᄚ"
  ],
  [
    12609,
    1,
    "ᄆ"
  ],
  [
    12610,
    1,
    "ᄇ"
  ],
  [
    12611,
    1,
    "ᄈ"
  ],
  [
    12612,
    1,
    "ᄡ"
  ],
  [
    12613,
    1,
    "ᄉ"
  ],
  [
    12614,
    1,
    "ᄊ"
  ],
  [
    12615,
    1,
    "ᄋ"
  ],
  [
    12616,
    1,
    "ᄌ"
  ],
  [
    12617,
    1,
    "ᄍ"
  ],
  [
    12618,
    1,
    "ᄎ"
  ],
  [
    12619,
    1,
    "ᄏ"
  ],
  [
    12620,
    1,
    "ᄐ"
  ],
  [
    12621,
    1,
    "ᄑ"
  ],
  [
    12622,
    1,
    "ᄒ"
  ],
  [
    12623,
    1,
    "ᅡ"
  ],
  [
    12624,
    1,
    "ᅢ"
  ],
  [
    12625,
    1,
    "ᅣ"
  ],
  [
    12626,
    1,
    "ᅤ"
  ],
  [
    12627,
    1,
    "ᅥ"
  ],
  [
    12628,
    1,
    "ᅦ"
  ],
  [
    12629,
    1,
    "ᅧ"
  ],
  [
    12630,
    1,
    "ᅨ"
  ],
  [
    12631,
    1,
    "ᅩ"
  ],
  [
    12632,
    1,
    "ᅪ"
  ],
  [
    12633,
    1,
    "ᅫ"
  ],
  [
    12634,
    1,
    "ᅬ"
  ],
  [
    12635,
    1,
    "ᅭ"
  ],
  [
    12636,
    1,
    "ᅮ"
  ],
  [
    12637,
    1,
    "ᅯ"
  ],
  [
    12638,
    1,
    "ᅰ"
  ],
  [
    12639,
    1,
    "ᅱ"
  ],
  [
    12640,
    1,
    "ᅲ"
  ],
  [
    12641,
    1,
    "ᅳ"
  ],
  [
    12642,
    1,
    "ᅴ"
  ],
  [
    12643,
    1,
    "ᅵ"
  ],
  [
    12644,
    3
  ],
  [
    12645,
    1,
    "ᄔ"
  ],
  [
    12646,
    1,
    "ᄕ"
  ],
  [
    12647,
    1,
    "ᇇ"
  ],
  [
    12648,
    1,
    "ᇈ"
  ],
  [
    12649,
    1,
    "ᇌ"
  ],
  [
    12650,
    1,
    "ᇎ"
  ],
  [
    12651,
    1,
    "ᇓ"
  ],
  [
    12652,
    1,
    "ᇗ"
  ],
  [
    12653,
    1,
    "ᇙ"
  ],
  [
    12654,
    1,
    "ᄜ"
  ],
  [
    12655,
    1,
    "ᇝ"
  ],
  [
    12656,
    1,
    "ᇟ"
  ],
  [
    12657,
    1,
    "ᄝ"
  ],
  [
    12658,
    1,
    "ᄞ"
  ],
  [
    12659,
    1,
    "ᄠ"
  ],
  [
    12660,
    1,
    "ᄢ"
  ],
  [
    12661,
    1,
    "ᄣ"
  ],
  [
    12662,
    1,
    "ᄧ"
  ],
  [
    12663,
    1,
    "ᄩ"
  ],
  [
    12664,
    1,
    "ᄫ"
  ],
  [
    12665,
    1,
    "ᄬ"
  ],
  [
    12666,
    1,
    "ᄭ"
  ],
  [
    12667,
    1,
    "ᄮ"
  ],
  [
    12668,
    1,
    "ᄯ"
  ],
  [
    12669,
    1,
    "ᄲ"
  ],
  [
    12670,
    1,
    "ᄶ"
  ],
  [
    12671,
    1,
    "ᅀ"
  ],
  [
    12672,
    1,
    "ᅇ"
  ],
  [
    12673,
    1,
    "ᅌ"
  ],
  [
    12674,
    1,
    "ᇱ"
  ],
  [
    12675,
    1,
    "ᇲ"
  ],
  [
    12676,
    1,
    "ᅗ"
  ],
  [
    12677,
    1,
    "ᅘ"
  ],
  [
    12678,
    1,
    "ᅙ"
  ],
  [
    12679,
    1,
    "ᆄ"
  ],
  [
    12680,
    1,
    "ᆅ"
  ],
  [
    12681,
    1,
    "ᆈ"
  ],
  [
    12682,
    1,
    "ᆑ"
  ],
  [
    12683,
    1,
    "ᆒ"
  ],
  [
    12684,
    1,
    "ᆔ"
  ],
  [
    12685,
    1,
    "ᆞ"
  ],
  [
    12686,
    1,
    "ᆡ"
  ],
  [
    12687,
    3
  ],
  [
    [
      12688,
      12689
    ],
    2
  ],
  [
    12690,
    1,
    "一"
  ],
  [
    12691,
    1,
    "二"
  ],
  [
    12692,
    1,
    "三"
  ],
  [
    12693,
    1,
    "四"
  ],
  [
    12694,
    1,
    "上"
  ],
  [
    12695,
    1,
    "中"
  ],
  [
    12696,
    1,
    "下"
  ],
  [
    12697,
    1,
    "甲"
  ],
  [
    12698,
    1,
    "乙"
  ],
  [
    12699,
    1,
    "丙"
  ],
  [
    12700,
    1,
    "丁"
  ],
  [
    12701,
    1,
    "天"
  ],
  [
    12702,
    1,
    "地"
  ],
  [
    12703,
    1,
    "人"
  ],
  [
    [
      12704,
      12727
    ],
    2
  ],
  [
    [
      12728,
      12730
    ],
    2
  ],
  [
    [
      12731,
      12735
    ],
    2
  ],
  [
    [
      12736,
      12751
    ],
    2
  ],
  [
    [
      12752,
      12771
    ],
    2
  ],
  [
    [
      12772,
      12782
    ],
    3
  ],
  [
    12783,
    3
  ],
  [
    [
      12784,
      12799
    ],
    2
  ],
  [
    12800,
    5,
    "(ᄀ)"
  ],
  [
    12801,
    5,
    "(ᄂ)"
  ],
  [
    12802,
    5,
    "(ᄃ)"
  ],
  [
    12803,
    5,
    "(ᄅ)"
  ],
  [
    12804,
    5,
    "(ᄆ)"
  ],
  [
    12805,
    5,
    "(ᄇ)"
  ],
  [
    12806,
    5,
    "(ᄉ)"
  ],
  [
    12807,
    5,
    "(ᄋ)"
  ],
  [
    12808,
    5,
    "(ᄌ)"
  ],
  [
    12809,
    5,
    "(ᄎ)"
  ],
  [
    12810,
    5,
    "(ᄏ)"
  ],
  [
    12811,
    5,
    "(ᄐ)"
  ],
  [
    12812,
    5,
    "(ᄑ)"
  ],
  [
    12813,
    5,
    "(ᄒ)"
  ],
  [
    12814,
    5,
    "(가)"
  ],
  [
    12815,
    5,
    "(나)"
  ],
  [
    12816,
    5,
    "(다)"
  ],
  [
    12817,
    5,
    "(라)"
  ],
  [
    12818,
    5,
    "(마)"
  ],
  [
    12819,
    5,
    "(바)"
  ],
  [
    12820,
    5,
    "(사)"
  ],
  [
    12821,
    5,
    "(아)"
  ],
  [
    12822,
    5,
    "(자)"
  ],
  [
    12823,
    5,
    "(차)"
  ],
  [
    12824,
    5,
    "(카)"
  ],
  [
    12825,
    5,
    "(타)"
  ],
  [
    12826,
    5,
    "(파)"
  ],
  [
    12827,
    5,
    "(하)"
  ],
  [
    12828,
    5,
    "(주)"
  ],
  [
    12829,
    5,
    "(오전)"
  ],
  [
    12830,
    5,
    "(오후)"
  ],
  [
    12831,
    3
  ],
  [
    12832,
    5,
    "(一)"
  ],
  [
    12833,
    5,
    "(二)"
  ],
  [
    12834,
    5,
    "(三)"
  ],
  [
    12835,
    5,
    "(四)"
  ],
  [
    12836,
    5,
    "(五)"
  ],
  [
    12837,
    5,
    "(六)"
  ],
  [
    12838,
    5,
    "(七)"
  ],
  [
    12839,
    5,
    "(八)"
  ],
  [
    12840,
    5,
    "(九)"
  ],
  [
    12841,
    5,
    "(十)"
  ],
  [
    12842,
    5,
    "(月)"
  ],
  [
    12843,
    5,
    "(火)"
  ],
  [
    12844,
    5,
    "(水)"
  ],
  [
    12845,
    5,
    "(木)"
  ],
  [
    12846,
    5,
    "(金)"
  ],
  [
    12847,
    5,
    "(土)"
  ],
  [
    12848,
    5,
    "(日)"
  ],
  [
    12849,
    5,
    "(株)"
  ],
  [
    12850,
    5,
    "(有)"
  ],
  [
    12851,
    5,
    "(社)"
  ],
  [
    12852,
    5,
    "(名)"
  ],
  [
    12853,
    5,
    "(特)"
  ],
  [
    12854,
    5,
    "(財)"
  ],
  [
    12855,
    5,
    "(祝)"
  ],
  [
    12856,
    5,
    "(労)"
  ],
  [
    12857,
    5,
    "(代)"
  ],
  [
    12858,
    5,
    "(呼)"
  ],
  [
    12859,
    5,
    "(学)"
  ],
  [
    12860,
    5,
    "(監)"
  ],
  [
    12861,
    5,
    "(企)"
  ],
  [
    12862,
    5,
    "(資)"
  ],
  [
    12863,
    5,
    "(協)"
  ],
  [
    12864,
    5,
    "(祭)"
  ],
  [
    12865,
    5,
    "(休)"
  ],
  [
    12866,
    5,
    "(自)"
  ],
  [
    12867,
    5,
    "(至)"
  ],
  [
    12868,
    1,
    "問"
  ],
  [
    12869,
    1,
    "幼"
  ],
  [
    12870,
    1,
    "文"
  ],
  [
    12871,
    1,
    "箏"
  ],
  [
    [
      12872,
      12879
    ],
    2
  ],
  [
    12880,
    1,
    "pte"
  ],
  [
    12881,
    1,
    "21"
  ],
  [
    12882,
    1,
    "22"
  ],
  [
    12883,
    1,
    "23"
  ],
  [
    12884,
    1,
    "24"
  ],
  [
    12885,
    1,
    "25"
  ],
  [
    12886,
    1,
    "26"
  ],
  [
    12887,
    1,
    "27"
  ],
  [
    12888,
    1,
    "28"
  ],
  [
    12889,
    1,
    "29"
  ],
  [
    12890,
    1,
    "30"
  ],
  [
    12891,
    1,
    "31"
  ],
  [
    12892,
    1,
    "32"
  ],
  [
    12893,
    1,
    "33"
  ],
  [
    12894,
    1,
    "34"
  ],
  [
    12895,
    1,
    "35"
  ],
  [
    12896,
    1,
    "ᄀ"
  ],
  [
    12897,
    1,
    "ᄂ"
  ],
  [
    12898,
    1,
    "ᄃ"
  ],
  [
    12899,
    1,
    "ᄅ"
  ],
  [
    12900,
    1,
    "ᄆ"
  ],
  [
    12901,
    1,
    "ᄇ"
  ],
  [
    12902,
    1,
    "ᄉ"
  ],
  [
    12903,
    1,
    "ᄋ"
  ],
  [
    12904,
    1,
    "ᄌ"
  ],
  [
    12905,
    1,
    "ᄎ"
  ],
  [
    12906,
    1,
    "ᄏ"
  ],
  [
    12907,
    1,
    "ᄐ"
  ],
  [
    12908,
    1,
    "ᄑ"
  ],
  [
    12909,
    1,
    "ᄒ"
  ],
  [
    12910,
    1,
    "가"
  ],
  [
    12911,
    1,
    "나"
  ],
  [
    12912,
    1,
    "다"
  ],
  [
    12913,
    1,
    "라"
  ],
  [
    12914,
    1,
    "마"
  ],
  [
    12915,
    1,
    "바"
  ],
  [
    12916,
    1,
    "사"
  ],
  [
    12917,
    1,
    "아"
  ],
  [
    12918,
    1,
    "자"
  ],
  [
    12919,
    1,
    "차"
  ],
  [
    12920,
    1,
    "카"
  ],
  [
    12921,
    1,
    "타"
  ],
  [
    12922,
    1,
    "파"
  ],
  [
    12923,
    1,
    "하"
  ],
  [
    12924,
    1,
    "참고"
  ],
  [
    12925,
    1,
    "주의"
  ],
  [
    12926,
    1,
    "우"
  ],
  [
    12927,
    2
  ],
  [
    12928,
    1,
    "一"
  ],
  [
    12929,
    1,
    "二"
  ],
  [
    12930,
    1,
    "三"
  ],
  [
    12931,
    1,
    "四"
  ],
  [
    12932,
    1,
    "五"
  ],
  [
    12933,
    1,
    "六"
  ],
  [
    12934,
    1,
    "七"
  ],
  [
    12935,
    1,
    "八"
  ],
  [
    12936,
    1,
    "九"
  ],
  [
    12937,
    1,
    "十"
  ],
  [
    12938,
    1,
    "月"
  ],
  [
    12939,
    1,
    "火"
  ],
  [
    12940,
    1,
    "水"
  ],
  [
    12941,
    1,
    "木"
  ],
  [
    12942,
    1,
    "金"
  ],
  [
    12943,
    1,
    "土"
  ],
  [
    12944,
    1,
    "日"
  ],
  [
    12945,
    1,
    "株"
  ],
  [
    12946,
    1,
    "有"
  ],
  [
    12947,
    1,
    "社"
  ],
  [
    12948,
    1,
    "名"
  ],
  [
    12949,
    1,
    "特"
  ],
  [
    12950,
    1,
    "財"
  ],
  [
    12951,
    1,
    "祝"
  ],
  [
    12952,
    1,
    "労"
  ],
  [
    12953,
    1,
    "秘"
  ],
  [
    12954,
    1,
    "男"
  ],
  [
    12955,
    1,
    "女"
  ],
  [
    12956,
    1,
    "適"
  ],
  [
    12957,
    1,
    "優"
  ],
  [
    12958,
    1,
    "印"
  ],
  [
    12959,
    1,
    "注"
  ],
  [
    12960,
    1,
    "項"
  ],
  [
    12961,
    1,
    "休"
  ],
  [
    12962,
    1,
    "写"
  ],
  [
    12963,
    1,
    "正"
  ],
  [
    12964,
    1,
    "上"
  ],
  [
    12965,
    1,
    "中"
  ],
  [
    12966,
    1,
    "下"
  ],
  [
    12967,
    1,
    "左"
  ],
  [
    12968,
    1,
    "右"
  ],
  [
    12969,
    1,
    "医"
  ],
  [
    12970,
    1,
    "宗"
  ],
  [
    12971,
    1,
    "学"
  ],
  [
    12972,
    1,
    "監"
  ],
  [
    12973,
    1,
    "企"
  ],
  [
    12974,
    1,
    "資"
  ],
  [
    12975,
    1,
    "協"
  ],
  [
    12976,
    1,
    "夜"
  ],
  [
    12977,
    1,
    "36"
  ],
  [
    12978,
    1,
    "37"
  ],
  [
    12979,
    1,
    "38"
  ],
  [
    12980,
    1,
    "39"
  ],
  [
    12981,
    1,
    "40"
  ],
  [
    12982,
    1,
    "41"
  ],
  [
    12983,
    1,
    "42"
  ],
  [
    12984,
    1,
    "43"
  ],
  [
    12985,
    1,
    "44"
  ],
  [
    12986,
    1,
    "45"
  ],
  [
    12987,
    1,
    "46"
  ],
  [
    12988,
    1,
    "47"
  ],
  [
    12989,
    1,
    "48"
  ],
  [
    12990,
    1,
    "49"
  ],
  [
    12991,
    1,
    "50"
  ],
  [
    12992,
    1,
    "1月"
  ],
  [
    12993,
    1,
    "2月"
  ],
  [
    12994,
    1,
    "3月"
  ],
  [
    12995,
    1,
    "4月"
  ],
  [
    12996,
    1,
    "5月"
  ],
  [
    12997,
    1,
    "6月"
  ],
  [
    12998,
    1,
    "7月"
  ],
  [
    12999,
    1,
    "8月"
  ],
  [
    13e3,
    1,
    "9月"
  ],
  [
    13001,
    1,
    "10月"
  ],
  [
    13002,
    1,
    "11月"
  ],
  [
    13003,
    1,
    "12月"
  ],
  [
    13004,
    1,
    "hg"
  ],
  [
    13005,
    1,
    "erg"
  ],
  [
    13006,
    1,
    "ev"
  ],
  [
    13007,
    1,
    "ltd"
  ],
  [
    13008,
    1,
    "ア"
  ],
  [
    13009,
    1,
    "イ"
  ],
  [
    13010,
    1,
    "ウ"
  ],
  [
    13011,
    1,
    "エ"
  ],
  [
    13012,
    1,
    "オ"
  ],
  [
    13013,
    1,
    "カ"
  ],
  [
    13014,
    1,
    "キ"
  ],
  [
    13015,
    1,
    "ク"
  ],
  [
    13016,
    1,
    "ケ"
  ],
  [
    13017,
    1,
    "コ"
  ],
  [
    13018,
    1,
    "サ"
  ],
  [
    13019,
    1,
    "シ"
  ],
  [
    13020,
    1,
    "ス"
  ],
  [
    13021,
    1,
    "セ"
  ],
  [
    13022,
    1,
    "ソ"
  ],
  [
    13023,
    1,
    "タ"
  ],
  [
    13024,
    1,
    "チ"
  ],
  [
    13025,
    1,
    "ツ"
  ],
  [
    13026,
    1,
    "テ"
  ],
  [
    13027,
    1,
    "ト"
  ],
  [
    13028,
    1,
    "ナ"
  ],
  [
    13029,
    1,
    "ニ"
  ],
  [
    13030,
    1,
    "ヌ"
  ],
  [
    13031,
    1,
    "ネ"
  ],
  [
    13032,
    1,
    "ノ"
  ],
  [
    13033,
    1,
    "ハ"
  ],
  [
    13034,
    1,
    "ヒ"
  ],
  [
    13035,
    1,
    "フ"
  ],
  [
    13036,
    1,
    "ヘ"
  ],
  [
    13037,
    1,
    "ホ"
  ],
  [
    13038,
    1,
    "マ"
  ],
  [
    13039,
    1,
    "ミ"
  ],
  [
    13040,
    1,
    "ム"
  ],
  [
    13041,
    1,
    "メ"
  ],
  [
    13042,
    1,
    "モ"
  ],
  [
    13043,
    1,
    "ヤ"
  ],
  [
    13044,
    1,
    "ユ"
  ],
  [
    13045,
    1,
    "ヨ"
  ],
  [
    13046,
    1,
    "ラ"
  ],
  [
    13047,
    1,
    "リ"
  ],
  [
    13048,
    1,
    "ル"
  ],
  [
    13049,
    1,
    "レ"
  ],
  [
    13050,
    1,
    "ロ"
  ],
  [
    13051,
    1,
    "ワ"
  ],
  [
    13052,
    1,
    "ヰ"
  ],
  [
    13053,
    1,
    "ヱ"
  ],
  [
    13054,
    1,
    "ヲ"
  ],
  [
    13055,
    1,
    "令和"
  ],
  [
    13056,
    1,
    "アパート"
  ],
  [
    13057,
    1,
    "アルファ"
  ],
  [
    13058,
    1,
    "アンペア"
  ],
  [
    13059,
    1,
    "アール"
  ],
  [
    13060,
    1,
    "イニング"
  ],
  [
    13061,
    1,
    "インチ"
  ],
  [
    13062,
    1,
    "ウォン"
  ],
  [
    13063,
    1,
    "エスクード"
  ],
  [
    13064,
    1,
    "エーカー"
  ],
  [
    13065,
    1,
    "オンス"
  ],
  [
    13066,
    1,
    "オーム"
  ],
  [
    13067,
    1,
    "カイリ"
  ],
  [
    13068,
    1,
    "カラット"
  ],
  [
    13069,
    1,
    "カロリー"
  ],
  [
    13070,
    1,
    "ガロン"
  ],
  [
    13071,
    1,
    "ガンマ"
  ],
  [
    13072,
    1,
    "ギガ"
  ],
  [
    13073,
    1,
    "ギニー"
  ],
  [
    13074,
    1,
    "キュリー"
  ],
  [
    13075,
    1,
    "ギルダー"
  ],
  [
    13076,
    1,
    "キロ"
  ],
  [
    13077,
    1,
    "キログラム"
  ],
  [
    13078,
    1,
    "キロメートル"
  ],
  [
    13079,
    1,
    "キロワット"
  ],
  [
    13080,
    1,
    "グラム"
  ],
  [
    13081,
    1,
    "グラムトン"
  ],
  [
    13082,
    1,
    "クルゼイロ"
  ],
  [
    13083,
    1,
    "クローネ"
  ],
  [
    13084,
    1,
    "ケース"
  ],
  [
    13085,
    1,
    "コルナ"
  ],
  [
    13086,
    1,
    "コーポ"
  ],
  [
    13087,
    1,
    "サイクル"
  ],
  [
    13088,
    1,
    "サンチーム"
  ],
  [
    13089,
    1,
    "シリング"
  ],
  [
    13090,
    1,
    "センチ"
  ],
  [
    13091,
    1,
    "セント"
  ],
  [
    13092,
    1,
    "ダース"
  ],
  [
    13093,
    1,
    "デシ"
  ],
  [
    13094,
    1,
    "ドル"
  ],
  [
    13095,
    1,
    "トン"
  ],
  [
    13096,
    1,
    "ナノ"
  ],
  [
    13097,
    1,
    "ノット"
  ],
  [
    13098,
    1,
    "ハイツ"
  ],
  [
    13099,
    1,
    "パーセント"
  ],
  [
    13100,
    1,
    "パーツ"
  ],
  [
    13101,
    1,
    "バーレル"
  ],
  [
    13102,
    1,
    "ピアストル"
  ],
  [
    13103,
    1,
    "ピクル"
  ],
  [
    13104,
    1,
    "ピコ"
  ],
  [
    13105,
    1,
    "ビル"
  ],
  [
    13106,
    1,
    "ファラッド"
  ],
  [
    13107,
    1,
    "フィート"
  ],
  [
    13108,
    1,
    "ブッシェル"
  ],
  [
    13109,
    1,
    "フラン"
  ],
  [
    13110,
    1,
    "ヘクタール"
  ],
  [
    13111,
    1,
    "ペソ"
  ],
  [
    13112,
    1,
    "ペニヒ"
  ],
  [
    13113,
    1,
    "ヘルツ"
  ],
  [
    13114,
    1,
    "ペンス"
  ],
  [
    13115,
    1,
    "ページ"
  ],
  [
    13116,
    1,
    "ベータ"
  ],
  [
    13117,
    1,
    "ポイント"
  ],
  [
    13118,
    1,
    "ボルト"
  ],
  [
    13119,
    1,
    "ホン"
  ],
  [
    13120,
    1,
    "ポンド"
  ],
  [
    13121,
    1,
    "ホール"
  ],
  [
    13122,
    1,
    "ホーン"
  ],
  [
    13123,
    1,
    "マイクロ"
  ],
  [
    13124,
    1,
    "マイル"
  ],
  [
    13125,
    1,
    "マッハ"
  ],
  [
    13126,
    1,
    "マルク"
  ],
  [
    13127,
    1,
    "マンション"
  ],
  [
    13128,
    1,
    "ミクロン"
  ],
  [
    13129,
    1,
    "ミリ"
  ],
  [
    13130,
    1,
    "ミリバール"
  ],
  [
    13131,
    1,
    "メガ"
  ],
  [
    13132,
    1,
    "メガトン"
  ],
  [
    13133,
    1,
    "メートル"
  ],
  [
    13134,
    1,
    "ヤード"
  ],
  [
    13135,
    1,
    "ヤール"
  ],
  [
    13136,
    1,
    "ユアン"
  ],
  [
    13137,
    1,
    "リットル"
  ],
  [
    13138,
    1,
    "リラ"
  ],
  [
    13139,
    1,
    "ルピー"
  ],
  [
    13140,
    1,
    "ルーブル"
  ],
  [
    13141,
    1,
    "レム"
  ],
  [
    13142,
    1,
    "レントゲン"
  ],
  [
    13143,
    1,
    "ワット"
  ],
  [
    13144,
    1,
    "0点"
  ],
  [
    13145,
    1,
    "1点"
  ],
  [
    13146,
    1,
    "2点"
  ],
  [
    13147,
    1,
    "3点"
  ],
  [
    13148,
    1,
    "4点"
  ],
  [
    13149,
    1,
    "5点"
  ],
  [
    13150,
    1,
    "6点"
  ],
  [
    13151,
    1,
    "7点"
  ],
  [
    13152,
    1,
    "8点"
  ],
  [
    13153,
    1,
    "9点"
  ],
  [
    13154,
    1,
    "10点"
  ],
  [
    13155,
    1,
    "11点"
  ],
  [
    13156,
    1,
    "12点"
  ],
  [
    13157,
    1,
    "13点"
  ],
  [
    13158,
    1,
    "14点"
  ],
  [
    13159,
    1,
    "15点"
  ],
  [
    13160,
    1,
    "16点"
  ],
  [
    13161,
    1,
    "17点"
  ],
  [
    13162,
    1,
    "18点"
  ],
  [
    13163,
    1,
    "19点"
  ],
  [
    13164,
    1,
    "20点"
  ],
  [
    13165,
    1,
    "21点"
  ],
  [
    13166,
    1,
    "22点"
  ],
  [
    13167,
    1,
    "23点"
  ],
  [
    13168,
    1,
    "24点"
  ],
  [
    13169,
    1,
    "hpa"
  ],
  [
    13170,
    1,
    "da"
  ],
  [
    13171,
    1,
    "au"
  ],
  [
    13172,
    1,
    "bar"
  ],
  [
    13173,
    1,
    "ov"
  ],
  [
    13174,
    1,
    "pc"
  ],
  [
    13175,
    1,
    "dm"
  ],
  [
    13176,
    1,
    "dm2"
  ],
  [
    13177,
    1,
    "dm3"
  ],
  [
    13178,
    1,
    "iu"
  ],
  [
    13179,
    1,
    "平成"
  ],
  [
    13180,
    1,
    "昭和"
  ],
  [
    13181,
    1,
    "大正"
  ],
  [
    13182,
    1,
    "明治"
  ],
  [
    13183,
    1,
    "株式会社"
  ],
  [
    13184,
    1,
    "pa"
  ],
  [
    13185,
    1,
    "na"
  ],
  [
    13186,
    1,
    "μa"
  ],
  [
    13187,
    1,
    "ma"
  ],
  [
    13188,
    1,
    "ka"
  ],
  [
    13189,
    1,
    "kb"
  ],
  [
    13190,
    1,
    "mb"
  ],
  [
    13191,
    1,
    "gb"
  ],
  [
    13192,
    1,
    "cal"
  ],
  [
    13193,
    1,
    "kcal"
  ],
  [
    13194,
    1,
    "pf"
  ],
  [
    13195,
    1,
    "nf"
  ],
  [
    13196,
    1,
    "μf"
  ],
  [
    13197,
    1,
    "μg"
  ],
  [
    13198,
    1,
    "mg"
  ],
  [
    13199,
    1,
    "kg"
  ],
  [
    13200,
    1,
    "hz"
  ],
  [
    13201,
    1,
    "khz"
  ],
  [
    13202,
    1,
    "mhz"
  ],
  [
    13203,
    1,
    "ghz"
  ],
  [
    13204,
    1,
    "thz"
  ],
  [
    13205,
    1,
    "μl"
  ],
  [
    13206,
    1,
    "ml"
  ],
  [
    13207,
    1,
    "dl"
  ],
  [
    13208,
    1,
    "kl"
  ],
  [
    13209,
    1,
    "fm"
  ],
  [
    13210,
    1,
    "nm"
  ],
  [
    13211,
    1,
    "μm"
  ],
  [
    13212,
    1,
    "mm"
  ],
  [
    13213,
    1,
    "cm"
  ],
  [
    13214,
    1,
    "km"
  ],
  [
    13215,
    1,
    "mm2"
  ],
  [
    13216,
    1,
    "cm2"
  ],
  [
    13217,
    1,
    "m2"
  ],
  [
    13218,
    1,
    "km2"
  ],
  [
    13219,
    1,
    "mm3"
  ],
  [
    13220,
    1,
    "cm3"
  ],
  [
    13221,
    1,
    "m3"
  ],
  [
    13222,
    1,
    "km3"
  ],
  [
    13223,
    1,
    "m∕s"
  ],
  [
    13224,
    1,
    "m∕s2"
  ],
  [
    13225,
    1,
    "pa"
  ],
  [
    13226,
    1,
    "kpa"
  ],
  [
    13227,
    1,
    "mpa"
  ],
  [
    13228,
    1,
    "gpa"
  ],
  [
    13229,
    1,
    "rad"
  ],
  [
    13230,
    1,
    "rad∕s"
  ],
  [
    13231,
    1,
    "rad∕s2"
  ],
  [
    13232,
    1,
    "ps"
  ],
  [
    13233,
    1,
    "ns"
  ],
  [
    13234,
    1,
    "μs"
  ],
  [
    13235,
    1,
    "ms"
  ],
  [
    13236,
    1,
    "pv"
  ],
  [
    13237,
    1,
    "nv"
  ],
  [
    13238,
    1,
    "μv"
  ],
  [
    13239,
    1,
    "mv"
  ],
  [
    13240,
    1,
    "kv"
  ],
  [
    13241,
    1,
    "mv"
  ],
  [
    13242,
    1,
    "pw"
  ],
  [
    13243,
    1,
    "nw"
  ],
  [
    13244,
    1,
    "μw"
  ],
  [
    13245,
    1,
    "mw"
  ],
  [
    13246,
    1,
    "kw"
  ],
  [
    13247,
    1,
    "mw"
  ],
  [
    13248,
    1,
    "kω"
  ],
  [
    13249,
    1,
    "mω"
  ],
  [
    13250,
    3
  ],
  [
    13251,
    1,
    "bq"
  ],
  [
    13252,
    1,
    "cc"
  ],
  [
    13253,
    1,
    "cd"
  ],
  [
    13254,
    1,
    "c∕kg"
  ],
  [
    13255,
    3
  ],
  [
    13256,
    1,
    "db"
  ],
  [
    13257,
    1,
    "gy"
  ],
  [
    13258,
    1,
    "ha"
  ],
  [
    13259,
    1,
    "hp"
  ],
  [
    13260,
    1,
    "in"
  ],
  [
    13261,
    1,
    "kk"
  ],
  [
    13262,
    1,
    "km"
  ],
  [
    13263,
    1,
    "kt"
  ],
  [
    13264,
    1,
    "lm"
  ],
  [
    13265,
    1,
    "ln"
  ],
  [
    13266,
    1,
    "log"
  ],
  [
    13267,
    1,
    "lx"
  ],
  [
    13268,
    1,
    "mb"
  ],
  [
    13269,
    1,
    "mil"
  ],
  [
    13270,
    1,
    "mol"
  ],
  [
    13271,
    1,
    "ph"
  ],
  [
    13272,
    3
  ],
  [
    13273,
    1,
    "ppm"
  ],
  [
    13274,
    1,
    "pr"
  ],
  [
    13275,
    1,
    "sr"
  ],
  [
    13276,
    1,
    "sv"
  ],
  [
    13277,
    1,
    "wb"
  ],
  [
    13278,
    1,
    "v∕m"
  ],
  [
    13279,
    1,
    "a∕m"
  ],
  [
    13280,
    1,
    "1日"
  ],
  [
    13281,
    1,
    "2日"
  ],
  [
    13282,
    1,
    "3日"
  ],
  [
    13283,
    1,
    "4日"
  ],
  [
    13284,
    1,
    "5日"
  ],
  [
    13285,
    1,
    "6日"
  ],
  [
    13286,
    1,
    "7日"
  ],
  [
    13287,
    1,
    "8日"
  ],
  [
    13288,
    1,
    "9日"
  ],
  [
    13289,
    1,
    "10日"
  ],
  [
    13290,
    1,
    "11日"
  ],
  [
    13291,
    1,
    "12日"
  ],
  [
    13292,
    1,
    "13日"
  ],
  [
    13293,
    1,
    "14日"
  ],
  [
    13294,
    1,
    "15日"
  ],
  [
    13295,
    1,
    "16日"
  ],
  [
    13296,
    1,
    "17日"
  ],
  [
    13297,
    1,
    "18日"
  ],
  [
    13298,
    1,
    "19日"
  ],
  [
    13299,
    1,
    "20日"
  ],
  [
    13300,
    1,
    "21日"
  ],
  [
    13301,
    1,
    "22日"
  ],
  [
    13302,
    1,
    "23日"
  ],
  [
    13303,
    1,
    "24日"
  ],
  [
    13304,
    1,
    "25日"
  ],
  [
    13305,
    1,
    "26日"
  ],
  [
    13306,
    1,
    "27日"
  ],
  [
    13307,
    1,
    "28日"
  ],
  [
    13308,
    1,
    "29日"
  ],
  [
    13309,
    1,
    "30日"
  ],
  [
    13310,
    1,
    "31日"
  ],
  [
    13311,
    1,
    "gal"
  ],
  [
    [
      13312,
      19893
    ],
    2
  ],
  [
    [
      19894,
      19903
    ],
    2
  ],
  [
    [
      19904,
      19967
    ],
    2
  ],
  [
    [
      19968,
      40869
    ],
    2
  ],
  [
    [
      40870,
      40891
    ],
    2
  ],
  [
    [
      40892,
      40899
    ],
    2
  ],
  [
    [
      40900,
      40907
    ],
    2
  ],
  [
    40908,
    2
  ],
  [
    [
      40909,
      40917
    ],
    2
  ],
  [
    [
      40918,
      40938
    ],
    2
  ],
  [
    [
      40939,
      40943
    ],
    2
  ],
  [
    [
      40944,
      40956
    ],
    2
  ],
  [
    [
      40957,
      40959
    ],
    2
  ],
  [
    [
      40960,
      42124
    ],
    2
  ],
  [
    [
      42125,
      42127
    ],
    3
  ],
  [
    [
      42128,
      42145
    ],
    2
  ],
  [
    [
      42146,
      42147
    ],
    2
  ],
  [
    [
      42148,
      42163
    ],
    2
  ],
  [
    42164,
    2
  ],
  [
    [
      42165,
      42176
    ],
    2
  ],
  [
    42177,
    2
  ],
  [
    [
      42178,
      42180
    ],
    2
  ],
  [
    42181,
    2
  ],
  [
    42182,
    2
  ],
  [
    [
      42183,
      42191
    ],
    3
  ],
  [
    [
      42192,
      42237
    ],
    2
  ],
  [
    [
      42238,
      42239
    ],
    2
  ],
  [
    [
      42240,
      42508
    ],
    2
  ],
  [
    [
      42509,
      42511
    ],
    2
  ],
  [
    [
      42512,
      42539
    ],
    2
  ],
  [
    [
      42540,
      42559
    ],
    3
  ],
  [
    42560,
    1,
    "ꙁ"
  ],
  [
    42561,
    2
  ],
  [
    42562,
    1,
    "ꙃ"
  ],
  [
    42563,
    2
  ],
  [
    42564,
    1,
    "ꙅ"
  ],
  [
    42565,
    2
  ],
  [
    42566,
    1,
    "ꙇ"
  ],
  [
    42567,
    2
  ],
  [
    42568,
    1,
    "ꙉ"
  ],
  [
    42569,
    2
  ],
  [
    42570,
    1,
    "ꙋ"
  ],
  [
    42571,
    2
  ],
  [
    42572,
    1,
    "ꙍ"
  ],
  [
    42573,
    2
  ],
  [
    42574,
    1,
    "ꙏ"
  ],
  [
    42575,
    2
  ],
  [
    42576,
    1,
    "ꙑ"
  ],
  [
    42577,
    2
  ],
  [
    42578,
    1,
    "ꙓ"
  ],
  [
    42579,
    2
  ],
  [
    42580,
    1,
    "ꙕ"
  ],
  [
    42581,
    2
  ],
  [
    42582,
    1,
    "ꙗ"
  ],
  [
    42583,
    2
  ],
  [
    42584,
    1,
    "ꙙ"
  ],
  [
    42585,
    2
  ],
  [
    42586,
    1,
    "ꙛ"
  ],
  [
    42587,
    2
  ],
  [
    42588,
    1,
    "ꙝ"
  ],
  [
    42589,
    2
  ],
  [
    42590,
    1,
    "ꙟ"
  ],
  [
    42591,
    2
  ],
  [
    42592,
    1,
    "ꙡ"
  ],
  [
    42593,
    2
  ],
  [
    42594,
    1,
    "ꙣ"
  ],
  [
    42595,
    2
  ],
  [
    42596,
    1,
    "ꙥ"
  ],
  [
    42597,
    2
  ],
  [
    42598,
    1,
    "ꙧ"
  ],
  [
    42599,
    2
  ],
  [
    42600,
    1,
    "ꙩ"
  ],
  [
    42601,
    2
  ],
  [
    42602,
    1,
    "ꙫ"
  ],
  [
    42603,
    2
  ],
  [
    42604,
    1,
    "ꙭ"
  ],
  [
    [
      42605,
      42607
    ],
    2
  ],
  [
    [
      42608,
      42611
    ],
    2
  ],
  [
    [
      42612,
      42619
    ],
    2
  ],
  [
    [
      42620,
      42621
    ],
    2
  ],
  [
    42622,
    2
  ],
  [
    42623,
    2
  ],
  [
    42624,
    1,
    "ꚁ"
  ],
  [
    42625,
    2
  ],
  [
    42626,
    1,
    "ꚃ"
  ],
  [
    42627,
    2
  ],
  [
    42628,
    1,
    "ꚅ"
  ],
  [
    42629,
    2
  ],
  [
    42630,
    1,
    "ꚇ"
  ],
  [
    42631,
    2
  ],
  [
    42632,
    1,
    "ꚉ"
  ],
  [
    42633,
    2
  ],
  [
    42634,
    1,
    "ꚋ"
  ],
  [
    42635,
    2
  ],
  [
    42636,
    1,
    "ꚍ"
  ],
  [
    42637,
    2
  ],
  [
    42638,
    1,
    "ꚏ"
  ],
  [
    42639,
    2
  ],
  [
    42640,
    1,
    "ꚑ"
  ],
  [
    42641,
    2
  ],
  [
    42642,
    1,
    "ꚓ"
  ],
  [
    42643,
    2
  ],
  [
    42644,
    1,
    "ꚕ"
  ],
  [
    42645,
    2
  ],
  [
    42646,
    1,
    "ꚗ"
  ],
  [
    42647,
    2
  ],
  [
    42648,
    1,
    "ꚙ"
  ],
  [
    42649,
    2
  ],
  [
    42650,
    1,
    "ꚛ"
  ],
  [
    42651,
    2
  ],
  [
    42652,
    1,
    "ъ"
  ],
  [
    42653,
    1,
    "ь"
  ],
  [
    42654,
    2
  ],
  [
    42655,
    2
  ],
  [
    [
      42656,
      42725
    ],
    2
  ],
  [
    [
      42726,
      42735
    ],
    2
  ],
  [
    [
      42736,
      42737
    ],
    2
  ],
  [
    [
      42738,
      42743
    ],
    2
  ],
  [
    [
      42744,
      42751
    ],
    3
  ],
  [
    [
      42752,
      42774
    ],
    2
  ],
  [
    [
      42775,
      42778
    ],
    2
  ],
  [
    [
      42779,
      42783
    ],
    2
  ],
  [
    [
      42784,
      42785
    ],
    2
  ],
  [
    42786,
    1,
    "ꜣ"
  ],
  [
    42787,
    2
  ],
  [
    42788,
    1,
    "ꜥ"
  ],
  [
    42789,
    2
  ],
  [
    42790,
    1,
    "ꜧ"
  ],
  [
    42791,
    2
  ],
  [
    42792,
    1,
    "ꜩ"
  ],
  [
    42793,
    2
  ],
  [
    42794,
    1,
    "ꜫ"
  ],
  [
    42795,
    2
  ],
  [
    42796,
    1,
    "ꜭ"
  ],
  [
    42797,
    2
  ],
  [
    42798,
    1,
    "ꜯ"
  ],
  [
    [
      42799,
      42801
    ],
    2
  ],
  [
    42802,
    1,
    "ꜳ"
  ],
  [
    42803,
    2
  ],
  [
    42804,
    1,
    "ꜵ"
  ],
  [
    42805,
    2
  ],
  [
    42806,
    1,
    "ꜷ"
  ],
  [
    42807,
    2
  ],
  [
    42808,
    1,
    "ꜹ"
  ],
  [
    42809,
    2
  ],
  [
    42810,
    1,
    "ꜻ"
  ],
  [
    42811,
    2
  ],
  [
    42812,
    1,
    "ꜽ"
  ],
  [
    42813,
    2
  ],
  [
    42814,
    1,
    "ꜿ"
  ],
  [
    42815,
    2
  ],
  [
    42816,
    1,
    "ꝁ"
  ],
  [
    42817,
    2
  ],
  [
    42818,
    1,
    "ꝃ"
  ],
  [
    42819,
    2
  ],
  [
    42820,
    1,
    "ꝅ"
  ],
  [
    42821,
    2
  ],
  [
    42822,
    1,
    "ꝇ"
  ],
  [
    42823,
    2
  ],
  [
    42824,
    1,
    "ꝉ"
  ],
  [
    42825,
    2
  ],
  [
    42826,
    1,
    "ꝋ"
  ],
  [
    42827,
    2
  ],
  [
    42828,
    1,
    "ꝍ"
  ],
  [
    42829,
    2
  ],
  [
    42830,
    1,
    "ꝏ"
  ],
  [
    42831,
    2
  ],
  [
    42832,
    1,
    "ꝑ"
  ],
  [
    42833,
    2
  ],
  [
    42834,
    1,
    "ꝓ"
  ],
  [
    42835,
    2
  ],
  [
    42836,
    1,
    "ꝕ"
  ],
  [
    42837,
    2
  ],
  [
    42838,
    1,
    "ꝗ"
  ],
  [
    42839,
    2
  ],
  [
    42840,
    1,
    "ꝙ"
  ],
  [
    42841,
    2
  ],
  [
    42842,
    1,
    "ꝛ"
  ],
  [
    42843,
    2
  ],
  [
    42844,
    1,
    "ꝝ"
  ],
  [
    42845,
    2
  ],
  [
    42846,
    1,
    "ꝟ"
  ],
  [
    42847,
    2
  ],
  [
    42848,
    1,
    "ꝡ"
  ],
  [
    42849,
    2
  ],
  [
    42850,
    1,
    "ꝣ"
  ],
  [
    42851,
    2
  ],
  [
    42852,
    1,
    "ꝥ"
  ],
  [
    42853,
    2
  ],
  [
    42854,
    1,
    "ꝧ"
  ],
  [
    42855,
    2
  ],
  [
    42856,
    1,
    "ꝩ"
  ],
  [
    42857,
    2
  ],
  [
    42858,
    1,
    "ꝫ"
  ],
  [
    42859,
    2
  ],
  [
    42860,
    1,
    "ꝭ"
  ],
  [
    42861,
    2
  ],
  [
    42862,
    1,
    "ꝯ"
  ],
  [
    42863,
    2
  ],
  [
    42864,
    1,
    "ꝯ"
  ],
  [
    [
      42865,
      42872
    ],
    2
  ],
  [
    42873,
    1,
    "ꝺ"
  ],
  [
    42874,
    2
  ],
  [
    42875,
    1,
    "ꝼ"
  ],
  [
    42876,
    2
  ],
  [
    42877,
    1,
    "ᵹ"
  ],
  [
    42878,
    1,
    "ꝿ"
  ],
  [
    42879,
    2
  ],
  [
    42880,
    1,
    "ꞁ"
  ],
  [
    42881,
    2
  ],
  [
    42882,
    1,
    "ꞃ"
  ],
  [
    42883,
    2
  ],
  [
    42884,
    1,
    "ꞅ"
  ],
  [
    42885,
    2
  ],
  [
    42886,
    1,
    "ꞇ"
  ],
  [
    [
      42887,
      42888
    ],
    2
  ],
  [
    [
      42889,
      42890
    ],
    2
  ],
  [
    42891,
    1,
    "ꞌ"
  ],
  [
    42892,
    2
  ],
  [
    42893,
    1,
    "ɥ"
  ],
  [
    42894,
    2
  ],
  [
    42895,
    2
  ],
  [
    42896,
    1,
    "ꞑ"
  ],
  [
    42897,
    2
  ],
  [
    42898,
    1,
    "ꞓ"
  ],
  [
    42899,
    2
  ],
  [
    [
      42900,
      42901
    ],
    2
  ],
  [
    42902,
    1,
    "ꞗ"
  ],
  [
    42903,
    2
  ],
  [
    42904,
    1,
    "ꞙ"
  ],
  [
    42905,
    2
  ],
  [
    42906,
    1,
    "ꞛ"
  ],
  [
    42907,
    2
  ],
  [
    42908,
    1,
    "ꞝ"
  ],
  [
    42909,
    2
  ],
  [
    42910,
    1,
    "ꞟ"
  ],
  [
    42911,
    2
  ],
  [
    42912,
    1,
    "ꞡ"
  ],
  [
    42913,
    2
  ],
  [
    42914,
    1,
    "ꞣ"
  ],
  [
    42915,
    2
  ],
  [
    42916,
    1,
    "ꞥ"
  ],
  [
    42917,
    2
  ],
  [
    42918,
    1,
    "ꞧ"
  ],
  [
    42919,
    2
  ],
  [
    42920,
    1,
    "ꞩ"
  ],
  [
    42921,
    2
  ],
  [
    42922,
    1,
    "ɦ"
  ],
  [
    42923,
    1,
    "ɜ"
  ],
  [
    42924,
    1,
    "ɡ"
  ],
  [
    42925,
    1,
    "ɬ"
  ],
  [
    42926,
    1,
    "ɪ"
  ],
  [
    42927,
    2
  ],
  [
    42928,
    1,
    "ʞ"
  ],
  [
    42929,
    1,
    "ʇ"
  ],
  [
    42930,
    1,
    "ʝ"
  ],
  [
    42931,
    1,
    "ꭓ"
  ],
  [
    42932,
    1,
    "ꞵ"
  ],
  [
    42933,
    2
  ],
  [
    42934,
    1,
    "ꞷ"
  ],
  [
    42935,
    2
  ],
  [
    42936,
    1,
    "ꞹ"
  ],
  [
    42937,
    2
  ],
  [
    42938,
    1,
    "ꞻ"
  ],
  [
    42939,
    2
  ],
  [
    42940,
    1,
    "ꞽ"
  ],
  [
    42941,
    2
  ],
  [
    42942,
    1,
    "ꞿ"
  ],
  [
    42943,
    2
  ],
  [
    42944,
    1,
    "ꟁ"
  ],
  [
    42945,
    2
  ],
  [
    42946,
    1,
    "ꟃ"
  ],
  [
    42947,
    2
  ],
  [
    42948,
    1,
    "ꞔ"
  ],
  [
    42949,
    1,
    "ʂ"
  ],
  [
    42950,
    1,
    "ᶎ"
  ],
  [
    42951,
    1,
    "ꟈ"
  ],
  [
    42952,
    2
  ],
  [
    42953,
    1,
    "ꟊ"
  ],
  [
    42954,
    2
  ],
  [
    [
      42955,
      42959
    ],
    3
  ],
  [
    42960,
    1,
    "ꟑ"
  ],
  [
    42961,
    2
  ],
  [
    42962,
    3
  ],
  [
    42963,
    2
  ],
  [
    42964,
    3
  ],
  [
    42965,
    2
  ],
  [
    42966,
    1,
    "ꟗ"
  ],
  [
    42967,
    2
  ],
  [
    42968,
    1,
    "ꟙ"
  ],
  [
    42969,
    2
  ],
  [
    [
      42970,
      42993
    ],
    3
  ],
  [
    42994,
    1,
    "c"
  ],
  [
    42995,
    1,
    "f"
  ],
  [
    42996,
    1,
    "q"
  ],
  [
    42997,
    1,
    "ꟶ"
  ],
  [
    42998,
    2
  ],
  [
    42999,
    2
  ],
  [
    43e3,
    1,
    "ħ"
  ],
  [
    43001,
    1,
    "œ"
  ],
  [
    43002,
    2
  ],
  [
    [
      43003,
      43007
    ],
    2
  ],
  [
    [
      43008,
      43047
    ],
    2
  ],
  [
    [
      43048,
      43051
    ],
    2
  ],
  [
    43052,
    2
  ],
  [
    [
      43053,
      43055
    ],
    3
  ],
  [
    [
      43056,
      43065
    ],
    2
  ],
  [
    [
      43066,
      43071
    ],
    3
  ],
  [
    [
      43072,
      43123
    ],
    2
  ],
  [
    [
      43124,
      43127
    ],
    2
  ],
  [
    [
      43128,
      43135
    ],
    3
  ],
  [
    [
      43136,
      43204
    ],
    2
  ],
  [
    43205,
    2
  ],
  [
    [
      43206,
      43213
    ],
    3
  ],
  [
    [
      43214,
      43215
    ],
    2
  ],
  [
    [
      43216,
      43225
    ],
    2
  ],
  [
    [
      43226,
      43231
    ],
    3
  ],
  [
    [
      43232,
      43255
    ],
    2
  ],
  [
    [
      43256,
      43258
    ],
    2
  ],
  [
    43259,
    2
  ],
  [
    43260,
    2
  ],
  [
    43261,
    2
  ],
  [
    [
      43262,
      43263
    ],
    2
  ],
  [
    [
      43264,
      43309
    ],
    2
  ],
  [
    [
      43310,
      43311
    ],
    2
  ],
  [
    [
      43312,
      43347
    ],
    2
  ],
  [
    [
      43348,
      43358
    ],
    3
  ],
  [
    43359,
    2
  ],
  [
    [
      43360,
      43388
    ],
    2
  ],
  [
    [
      43389,
      43391
    ],
    3
  ],
  [
    [
      43392,
      43456
    ],
    2
  ],
  [
    [
      43457,
      43469
    ],
    2
  ],
  [
    43470,
    3
  ],
  [
    [
      43471,
      43481
    ],
    2
  ],
  [
    [
      43482,
      43485
    ],
    3
  ],
  [
    [
      43486,
      43487
    ],
    2
  ],
  [
    [
      43488,
      43518
    ],
    2
  ],
  [
    43519,
    3
  ],
  [
    [
      43520,
      43574
    ],
    2
  ],
  [
    [
      43575,
      43583
    ],
    3
  ],
  [
    [
      43584,
      43597
    ],
    2
  ],
  [
    [
      43598,
      43599
    ],
    3
  ],
  [
    [
      43600,
      43609
    ],
    2
  ],
  [
    [
      43610,
      43611
    ],
    3
  ],
  [
    [
      43612,
      43615
    ],
    2
  ],
  [
    [
      43616,
      43638
    ],
    2
  ],
  [
    [
      43639,
      43641
    ],
    2
  ],
  [
    [
      43642,
      43643
    ],
    2
  ],
  [
    [
      43644,
      43647
    ],
    2
  ],
  [
    [
      43648,
      43714
    ],
    2
  ],
  [
    [
      43715,
      43738
    ],
    3
  ],
  [
    [
      43739,
      43741
    ],
    2
  ],
  [
    [
      43742,
      43743
    ],
    2
  ],
  [
    [
      43744,
      43759
    ],
    2
  ],
  [
    [
      43760,
      43761
    ],
    2
  ],
  [
    [
      43762,
      43766
    ],
    2
  ],
  [
    [
      43767,
      43776
    ],
    3
  ],
  [
    [
      43777,
      43782
    ],
    2
  ],
  [
    [
      43783,
      43784
    ],
    3
  ],
  [
    [
      43785,
      43790
    ],
    2
  ],
  [
    [
      43791,
      43792
    ],
    3
  ],
  [
    [
      43793,
      43798
    ],
    2
  ],
  [
    [
      43799,
      43807
    ],
    3
  ],
  [
    [
      43808,
      43814
    ],
    2
  ],
  [
    43815,
    3
  ],
  [
    [
      43816,
      43822
    ],
    2
  ],
  [
    43823,
    3
  ],
  [
    [
      43824,
      43866
    ],
    2
  ],
  [
    43867,
    2
  ],
  [
    43868,
    1,
    "ꜧ"
  ],
  [
    43869,
    1,
    "ꬷ"
  ],
  [
    43870,
    1,
    "ɫ"
  ],
  [
    43871,
    1,
    "ꭒ"
  ],
  [
    [
      43872,
      43875
    ],
    2
  ],
  [
    [
      43876,
      43877
    ],
    2
  ],
  [
    [
      43878,
      43879
    ],
    2
  ],
  [
    43880,
    2
  ],
  [
    43881,
    1,
    "ʍ"
  ],
  [
    [
      43882,
      43883
    ],
    2
  ],
  [
    [
      43884,
      43887
    ],
    3
  ],
  [
    43888,
    1,
    "Ꭰ"
  ],
  [
    43889,
    1,
    "Ꭱ"
  ],
  [
    43890,
    1,
    "Ꭲ"
  ],
  [
    43891,
    1,
    "Ꭳ"
  ],
  [
    43892,
    1,
    "Ꭴ"
  ],
  [
    43893,
    1,
    "Ꭵ"
  ],
  [
    43894,
    1,
    "Ꭶ"
  ],
  [
    43895,
    1,
    "Ꭷ"
  ],
  [
    43896,
    1,
    "Ꭸ"
  ],
  [
    43897,
    1,
    "Ꭹ"
  ],
  [
    43898,
    1,
    "Ꭺ"
  ],
  [
    43899,
    1,
    "Ꭻ"
  ],
  [
    43900,
    1,
    "Ꭼ"
  ],
  [
    43901,
    1,
    "Ꭽ"
  ],
  [
    43902,
    1,
    "Ꭾ"
  ],
  [
    43903,
    1,
    "Ꭿ"
  ],
  [
    43904,
    1,
    "Ꮀ"
  ],
  [
    43905,
    1,
    "Ꮁ"
  ],
  [
    43906,
    1,
    "Ꮂ"
  ],
  [
    43907,
    1,
    "Ꮃ"
  ],
  [
    43908,
    1,
    "Ꮄ"
  ],
  [
    43909,
    1,
    "Ꮅ"
  ],
  [
    43910,
    1,
    "Ꮆ"
  ],
  [
    43911,
    1,
    "Ꮇ"
  ],
  [
    43912,
    1,
    "Ꮈ"
  ],
  [
    43913,
    1,
    "Ꮉ"
  ],
  [
    43914,
    1,
    "Ꮊ"
  ],
  [
    43915,
    1,
    "Ꮋ"
  ],
  [
    43916,
    1,
    "Ꮌ"
  ],
  [
    43917,
    1,
    "Ꮍ"
  ],
  [
    43918,
    1,
    "Ꮎ"
  ],
  [
    43919,
    1,
    "Ꮏ"
  ],
  [
    43920,
    1,
    "Ꮐ"
  ],
  [
    43921,
    1,
    "Ꮑ"
  ],
  [
    43922,
    1,
    "Ꮒ"
  ],
  [
    43923,
    1,
    "Ꮓ"
  ],
  [
    43924,
    1,
    "Ꮔ"
  ],
  [
    43925,
    1,
    "Ꮕ"
  ],
  [
    43926,
    1,
    "Ꮖ"
  ],
  [
    43927,
    1,
    "Ꮗ"
  ],
  [
    43928,
    1,
    "Ꮘ"
  ],
  [
    43929,
    1,
    "Ꮙ"
  ],
  [
    43930,
    1,
    "Ꮚ"
  ],
  [
    43931,
    1,
    "Ꮛ"
  ],
  [
    43932,
    1,
    "Ꮜ"
  ],
  [
    43933,
    1,
    "Ꮝ"
  ],
  [
    43934,
    1,
    "Ꮞ"
  ],
  [
    43935,
    1,
    "Ꮟ"
  ],
  [
    43936,
    1,
    "Ꮠ"
  ],
  [
    43937,
    1,
    "Ꮡ"
  ],
  [
    43938,
    1,
    "Ꮢ"
  ],
  [
    43939,
    1,
    "Ꮣ"
  ],
  [
    43940,
    1,
    "Ꮤ"
  ],
  [
    43941,
    1,
    "Ꮥ"
  ],
  [
    43942,
    1,
    "Ꮦ"
  ],
  [
    43943,
    1,
    "Ꮧ"
  ],
  [
    43944,
    1,
    "Ꮨ"
  ],
  [
    43945,
    1,
    "Ꮩ"
  ],
  [
    43946,
    1,
    "Ꮪ"
  ],
  [
    43947,
    1,
    "Ꮫ"
  ],
  [
    43948,
    1,
    "Ꮬ"
  ],
  [
    43949,
    1,
    "Ꮭ"
  ],
  [
    43950,
    1,
    "Ꮮ"
  ],
  [
    43951,
    1,
    "Ꮯ"
  ],
  [
    43952,
    1,
    "Ꮰ"
  ],
  [
    43953,
    1,
    "Ꮱ"
  ],
  [
    43954,
    1,
    "Ꮲ"
  ],
  [
    43955,
    1,
    "Ꮳ"
  ],
  [
    43956,
    1,
    "Ꮴ"
  ],
  [
    43957,
    1,
    "Ꮵ"
  ],
  [
    43958,
    1,
    "Ꮶ"
  ],
  [
    43959,
    1,
    "Ꮷ"
  ],
  [
    43960,
    1,
    "Ꮸ"
  ],
  [
    43961,
    1,
    "Ꮹ"
  ],
  [
    43962,
    1,
    "Ꮺ"
  ],
  [
    43963,
    1,
    "Ꮻ"
  ],
  [
    43964,
    1,
    "Ꮼ"
  ],
  [
    43965,
    1,
    "Ꮽ"
  ],
  [
    43966,
    1,
    "Ꮾ"
  ],
  [
    43967,
    1,
    "Ꮿ"
  ],
  [
    [
      43968,
      44010
    ],
    2
  ],
  [
    44011,
    2
  ],
  [
    [
      44012,
      44013
    ],
    2
  ],
  [
    [
      44014,
      44015
    ],
    3
  ],
  [
    [
      44016,
      44025
    ],
    2
  ],
  [
    [
      44026,
      44031
    ],
    3
  ],
  [
    [
      44032,
      55203
    ],
    2
  ],
  [
    [
      55204,
      55215
    ],
    3
  ],
  [
    [
      55216,
      55238
    ],
    2
  ],
  [
    [
      55239,
      55242
    ],
    3
  ],
  [
    [
      55243,
      55291
    ],
    2
  ],
  [
    [
      55292,
      55295
    ],
    3
  ],
  [
    [
      55296,
      57343
    ],
    3
  ],
  [
    [
      57344,
      63743
    ],
    3
  ],
  [
    63744,
    1,
    "豈"
  ],
  [
    63745,
    1,
    "更"
  ],
  [
    63746,
    1,
    "車"
  ],
  [
    63747,
    1,
    "賈"
  ],
  [
    63748,
    1,
    "滑"
  ],
  [
    63749,
    1,
    "串"
  ],
  [
    63750,
    1,
    "句"
  ],
  [
    [
      63751,
      63752
    ],
    1,
    "龜"
  ],
  [
    63753,
    1,
    "契"
  ],
  [
    63754,
    1,
    "金"
  ],
  [
    63755,
    1,
    "喇"
  ],
  [
    63756,
    1,
    "奈"
  ],
  [
    63757,
    1,
    "懶"
  ],
  [
    63758,
    1,
    "癩"
  ],
  [
    63759,
    1,
    "羅"
  ],
  [
    63760,
    1,
    "蘿"
  ],
  [
    63761,
    1,
    "螺"
  ],
  [
    63762,
    1,
    "裸"
  ],
  [
    63763,
    1,
    "邏"
  ],
  [
    63764,
    1,
    "樂"
  ],
  [
    63765,
    1,
    "洛"
  ],
  [
    63766,
    1,
    "烙"
  ],
  [
    63767,
    1,
    "珞"
  ],
  [
    63768,
    1,
    "落"
  ],
  [
    63769,
    1,
    "酪"
  ],
  [
    63770,
    1,
    "駱"
  ],
  [
    63771,
    1,
    "亂"
  ],
  [
    63772,
    1,
    "卵"
  ],
  [
    63773,
    1,
    "欄"
  ],
  [
    63774,
    1,
    "爛"
  ],
  [
    63775,
    1,
    "蘭"
  ],
  [
    63776,
    1,
    "鸞"
  ],
  [
    63777,
    1,
    "嵐"
  ],
  [
    63778,
    1,
    "濫"
  ],
  [
    63779,
    1,
    "藍"
  ],
  [
    63780,
    1,
    "襤"
  ],
  [
    63781,
    1,
    "拉"
  ],
  [
    63782,
    1,
    "臘"
  ],
  [
    63783,
    1,
    "蠟"
  ],
  [
    63784,
    1,
    "廊"
  ],
  [
    63785,
    1,
    "朗"
  ],
  [
    63786,
    1,
    "浪"
  ],
  [
    63787,
    1,
    "狼"
  ],
  [
    63788,
    1,
    "郎"
  ],
  [
    63789,
    1,
    "來"
  ],
  [
    63790,
    1,
    "冷"
  ],
  [
    63791,
    1,
    "勞"
  ],
  [
    63792,
    1,
    "擄"
  ],
  [
    63793,
    1,
    "櫓"
  ],
  [
    63794,
    1,
    "爐"
  ],
  [
    63795,
    1,
    "盧"
  ],
  [
    63796,
    1,
    "老"
  ],
  [
    63797,
    1,
    "蘆"
  ],
  [
    63798,
    1,
    "虜"
  ],
  [
    63799,
    1,
    "路"
  ],
  [
    63800,
    1,
    "露"
  ],
  [
    63801,
    1,
    "魯"
  ],
  [
    63802,
    1,
    "鷺"
  ],
  [
    63803,
    1,
    "碌"
  ],
  [
    63804,
    1,
    "祿"
  ],
  [
    63805,
    1,
    "綠"
  ],
  [
    63806,
    1,
    "菉"
  ],
  [
    63807,
    1,
    "錄"
  ],
  [
    63808,
    1,
    "鹿"
  ],
  [
    63809,
    1,
    "論"
  ],
  [
    63810,
    1,
    "壟"
  ],
  [
    63811,
    1,
    "弄"
  ],
  [
    63812,
    1,
    "籠"
  ],
  [
    63813,
    1,
    "聾"
  ],
  [
    63814,
    1,
    "牢"
  ],
  [
    63815,
    1,
    "磊"
  ],
  [
    63816,
    1,
    "賂"
  ],
  [
    63817,
    1,
    "雷"
  ],
  [
    63818,
    1,
    "壘"
  ],
  [
    63819,
    1,
    "屢"
  ],
  [
    63820,
    1,
    "樓"
  ],
  [
    63821,
    1,
    "淚"
  ],
  [
    63822,
    1,
    "漏"
  ],
  [
    63823,
    1,
    "累"
  ],
  [
    63824,
    1,
    "縷"
  ],
  [
    63825,
    1,
    "陋"
  ],
  [
    63826,
    1,
    "勒"
  ],
  [
    63827,
    1,
    "肋"
  ],
  [
    63828,
    1,
    "凜"
  ],
  [
    63829,
    1,
    "凌"
  ],
  [
    63830,
    1,
    "稜"
  ],
  [
    63831,
    1,
    "綾"
  ],
  [
    63832,
    1,
    "菱"
  ],
  [
    63833,
    1,
    "陵"
  ],
  [
    63834,
    1,
    "讀"
  ],
  [
    63835,
    1,
    "拏"
  ],
  [
    63836,
    1,
    "樂"
  ],
  [
    63837,
    1,
    "諾"
  ],
  [
    63838,
    1,
    "丹"
  ],
  [
    63839,
    1,
    "寧"
  ],
  [
    63840,
    1,
    "怒"
  ],
  [
    63841,
    1,
    "率"
  ],
  [
    63842,
    1,
    "異"
  ],
  [
    63843,
    1,
    "北"
  ],
  [
    63844,
    1,
    "磻"
  ],
  [
    63845,
    1,
    "便"
  ],
  [
    63846,
    1,
    "復"
  ],
  [
    63847,
    1,
    "不"
  ],
  [
    63848,
    1,
    "泌"
  ],
  [
    63849,
    1,
    "數"
  ],
  [
    63850,
    1,
    "索"
  ],
  [
    63851,
    1,
    "參"
  ],
  [
    63852,
    1,
    "塞"
  ],
  [
    63853,
    1,
    "省"
  ],
  [
    63854,
    1,
    "葉"
  ],
  [
    63855,
    1,
    "說"
  ],
  [
    63856,
    1,
    "殺"
  ],
  [
    63857,
    1,
    "辰"
  ],
  [
    63858,
    1,
    "沈"
  ],
  [
    63859,
    1,
    "拾"
  ],
  [
    63860,
    1,
    "若"
  ],
  [
    63861,
    1,
    "掠"
  ],
  [
    63862,
    1,
    "略"
  ],
  [
    63863,
    1,
    "亮"
  ],
  [
    63864,
    1,
    "兩"
  ],
  [
    63865,
    1,
    "凉"
  ],
  [
    63866,
    1,
    "梁"
  ],
  [
    63867,
    1,
    "糧"
  ],
  [
    63868,
    1,
    "良"
  ],
  [
    63869,
    1,
    "諒"
  ],
  [
    63870,
    1,
    "量"
  ],
  [
    63871,
    1,
    "勵"
  ],
  [
    63872,
    1,
    "呂"
  ],
  [
    63873,
    1,
    "女"
  ],
  [
    63874,
    1,
    "廬"
  ],
  [
    63875,
    1,
    "旅"
  ],
  [
    63876,
    1,
    "濾"
  ],
  [
    63877,
    1,
    "礪"
  ],
  [
    63878,
    1,
    "閭"
  ],
  [
    63879,
    1,
    "驪"
  ],
  [
    63880,
    1,
    "麗"
  ],
  [
    63881,
    1,
    "黎"
  ],
  [
    63882,
    1,
    "力"
  ],
  [
    63883,
    1,
    "曆"
  ],
  [
    63884,
    1,
    "歷"
  ],
  [
    63885,
    1,
    "轢"
  ],
  [
    63886,
    1,
    "年"
  ],
  [
    63887,
    1,
    "憐"
  ],
  [
    63888,
    1,
    "戀"
  ],
  [
    63889,
    1,
    "撚"
  ],
  [
    63890,
    1,
    "漣"
  ],
  [
    63891,
    1,
    "煉"
  ],
  [
    63892,
    1,
    "璉"
  ],
  [
    63893,
    1,
    "秊"
  ],
  [
    63894,
    1,
    "練"
  ],
  [
    63895,
    1,
    "聯"
  ],
  [
    63896,
    1,
    "輦"
  ],
  [
    63897,
    1,
    "蓮"
  ],
  [
    63898,
    1,
    "連"
  ],
  [
    63899,
    1,
    "鍊"
  ],
  [
    63900,
    1,
    "列"
  ],
  [
    63901,
    1,
    "劣"
  ],
  [
    63902,
    1,
    "咽"
  ],
  [
    63903,
    1,
    "烈"
  ],
  [
    63904,
    1,
    "裂"
  ],
  [
    63905,
    1,
    "說"
  ],
  [
    63906,
    1,
    "廉"
  ],
  [
    63907,
    1,
    "念"
  ],
  [
    63908,
    1,
    "捻"
  ],
  [
    63909,
    1,
    "殮"
  ],
  [
    63910,
    1,
    "簾"
  ],
  [
    63911,
    1,
    "獵"
  ],
  [
    63912,
    1,
    "令"
  ],
  [
    63913,
    1,
    "囹"
  ],
  [
    63914,
    1,
    "寧"
  ],
  [
    63915,
    1,
    "嶺"
  ],
  [
    63916,
    1,
    "怜"
  ],
  [
    63917,
    1,
    "玲"
  ],
  [
    63918,
    1,
    "瑩"
  ],
  [
    63919,
    1,
    "羚"
  ],
  [
    63920,
    1,
    "聆"
  ],
  [
    63921,
    1,
    "鈴"
  ],
  [
    63922,
    1,
    "零"
  ],
  [
    63923,
    1,
    "靈"
  ],
  [
    63924,
    1,
    "領"
  ],
  [
    63925,
    1,
    "例"
  ],
  [
    63926,
    1,
    "禮"
  ],
  [
    63927,
    1,
    "醴"
  ],
  [
    63928,
    1,
    "隸"
  ],
  [
    63929,
    1,
    "惡"
  ],
  [
    63930,
    1,
    "了"
  ],
  [
    63931,
    1,
    "僚"
  ],
  [
    63932,
    1,
    "寮"
  ],
  [
    63933,
    1,
    "尿"
  ],
  [
    63934,
    1,
    "料"
  ],
  [
    63935,
    1,
    "樂"
  ],
  [
    63936,
    1,
    "燎"
  ],
  [
    63937,
    1,
    "療"
  ],
  [
    63938,
    1,
    "蓼"
  ],
  [
    63939,
    1,
    "遼"
  ],
  [
    63940,
    1,
    "龍"
  ],
  [
    63941,
    1,
    "暈"
  ],
  [
    63942,
    1,
    "阮"
  ],
  [
    63943,
    1,
    "劉"
  ],
  [
    63944,
    1,
    "杻"
  ],
  [
    63945,
    1,
    "柳"
  ],
  [
    63946,
    1,
    "流"
  ],
  [
    63947,
    1,
    "溜"
  ],
  [
    63948,
    1,
    "琉"
  ],
  [
    63949,
    1,
    "留"
  ],
  [
    63950,
    1,
    "硫"
  ],
  [
    63951,
    1,
    "紐"
  ],
  [
    63952,
    1,
    "類"
  ],
  [
    63953,
    1,
    "六"
  ],
  [
    63954,
    1,
    "戮"
  ],
  [
    63955,
    1,
    "陸"
  ],
  [
    63956,
    1,
    "倫"
  ],
  [
    63957,
    1,
    "崙"
  ],
  [
    63958,
    1,
    "淪"
  ],
  [
    63959,
    1,
    "輪"
  ],
  [
    63960,
    1,
    "律"
  ],
  [
    63961,
    1,
    "慄"
  ],
  [
    63962,
    1,
    "栗"
  ],
  [
    63963,
    1,
    "率"
  ],
  [
    63964,
    1,
    "隆"
  ],
  [
    63965,
    1,
    "利"
  ],
  [
    63966,
    1,
    "吏"
  ],
  [
    63967,
    1,
    "履"
  ],
  [
    63968,
    1,
    "易"
  ],
  [
    63969,
    1,
    "李"
  ],
  [
    63970,
    1,
    "梨"
  ],
  [
    63971,
    1,
    "泥"
  ],
  [
    63972,
    1,
    "理"
  ],
  [
    63973,
    1,
    "痢"
  ],
  [
    63974,
    1,
    "罹"
  ],
  [
    63975,
    1,
    "裏"
  ],
  [
    63976,
    1,
    "裡"
  ],
  [
    63977,
    1,
    "里"
  ],
  [
    63978,
    1,
    "離"
  ],
  [
    63979,
    1,
    "匿"
  ],
  [
    63980,
    1,
    "溺"
  ],
  [
    63981,
    1,
    "吝"
  ],
  [
    63982,
    1,
    "燐"
  ],
  [
    63983,
    1,
    "璘"
  ],
  [
    63984,
    1,
    "藺"
  ],
  [
    63985,
    1,
    "隣"
  ],
  [
    63986,
    1,
    "鱗"
  ],
  [
    63987,
    1,
    "麟"
  ],
  [
    63988,
    1,
    "林"
  ],
  [
    63989,
    1,
    "淋"
  ],
  [
    63990,
    1,
    "臨"
  ],
  [
    63991,
    1,
    "立"
  ],
  [
    63992,
    1,
    "笠"
  ],
  [
    63993,
    1,
    "粒"
  ],
  [
    63994,
    1,
    "狀"
  ],
  [
    63995,
    1,
    "炙"
  ],
  [
    63996,
    1,
    "識"
  ],
  [
    63997,
    1,
    "什"
  ],
  [
    63998,
    1,
    "茶"
  ],
  [
    63999,
    1,
    "刺"
  ],
  [
    64e3,
    1,
    "切"
  ],
  [
    64001,
    1,
    "度"
  ],
  [
    64002,
    1,
    "拓"
  ],
  [
    64003,
    1,
    "糖"
  ],
  [
    64004,
    1,
    "宅"
  ],
  [
    64005,
    1,
    "洞"
  ],
  [
    64006,
    1,
    "暴"
  ],
  [
    64007,
    1,
    "輻"
  ],
  [
    64008,
    1,
    "行"
  ],
  [
    64009,
    1,
    "降"
  ],
  [
    64010,
    1,
    "見"
  ],
  [
    64011,
    1,
    "廓"
  ],
  [
    64012,
    1,
    "兀"
  ],
  [
    64013,
    1,
    "嗀"
  ],
  [
    [
      64014,
      64015
    ],
    2
  ],
  [
    64016,
    1,
    "塚"
  ],
  [
    64017,
    2
  ],
  [
    64018,
    1,
    "晴"
  ],
  [
    [
      64019,
      64020
    ],
    2
  ],
  [
    64021,
    1,
    "凞"
  ],
  [
    64022,
    1,
    "猪"
  ],
  [
    64023,
    1,
    "益"
  ],
  [
    64024,
    1,
    "礼"
  ],
  [
    64025,
    1,
    "神"
  ],
  [
    64026,
    1,
    "祥"
  ],
  [
    64027,
    1,
    "福"
  ],
  [
    64028,
    1,
    "靖"
  ],
  [
    64029,
    1,
    "精"
  ],
  [
    64030,
    1,
    "羽"
  ],
  [
    64031,
    2
  ],
  [
    64032,
    1,
    "蘒"
  ],
  [
    64033,
    2
  ],
  [
    64034,
    1,
    "諸"
  ],
  [
    [
      64035,
      64036
    ],
    2
  ],
  [
    64037,
    1,
    "逸"
  ],
  [
    64038,
    1,
    "都"
  ],
  [
    [
      64039,
      64041
    ],
    2
  ],
  [
    64042,
    1,
    "飯"
  ],
  [
    64043,
    1,
    "飼"
  ],
  [
    64044,
    1,
    "館"
  ],
  [
    64045,
    1,
    "鶴"
  ],
  [
    64046,
    1,
    "郞"
  ],
  [
    64047,
    1,
    "隷"
  ],
  [
    64048,
    1,
    "侮"
  ],
  [
    64049,
    1,
    "僧"
  ],
  [
    64050,
    1,
    "免"
  ],
  [
    64051,
    1,
    "勉"
  ],
  [
    64052,
    1,
    "勤"
  ],
  [
    64053,
    1,
    "卑"
  ],
  [
    64054,
    1,
    "喝"
  ],
  [
    64055,
    1,
    "嘆"
  ],
  [
    64056,
    1,
    "器"
  ],
  [
    64057,
    1,
    "塀"
  ],
  [
    64058,
    1,
    "墨"
  ],
  [
    64059,
    1,
    "層"
  ],
  [
    64060,
    1,
    "屮"
  ],
  [
    64061,
    1,
    "悔"
  ],
  [
    64062,
    1,
    "慨"
  ],
  [
    64063,
    1,
    "憎"
  ],
  [
    64064,
    1,
    "懲"
  ],
  [
    64065,
    1,
    "敏"
  ],
  [
    64066,
    1,
    "既"
  ],
  [
    64067,
    1,
    "暑"
  ],
  [
    64068,
    1,
    "梅"
  ],
  [
    64069,
    1,
    "海"
  ],
  [
    64070,
    1,
    "渚"
  ],
  [
    64071,
    1,
    "漢"
  ],
  [
    64072,
    1,
    "煮"
  ],
  [
    64073,
    1,
    "爫"
  ],
  [
    64074,
    1,
    "琢"
  ],
  [
    64075,
    1,
    "碑"
  ],
  [
    64076,
    1,
    "社"
  ],
  [
    64077,
    1,
    "祉"
  ],
  [
    64078,
    1,
    "祈"
  ],
  [
    64079,
    1,
    "祐"
  ],
  [
    64080,
    1,
    "祖"
  ],
  [
    64081,
    1,
    "祝"
  ],
  [
    64082,
    1,
    "禍"
  ],
  [
    64083,
    1,
    "禎"
  ],
  [
    64084,
    1,
    "穀"
  ],
  [
    64085,
    1,
    "突"
  ],
  [
    64086,
    1,
    "節"
  ],
  [
    64087,
    1,
    "練"
  ],
  [
    64088,
    1,
    "縉"
  ],
  [
    64089,
    1,
    "繁"
  ],
  [
    64090,
    1,
    "署"
  ],
  [
    64091,
    1,
    "者"
  ],
  [
    64092,
    1,
    "臭"
  ],
  [
    [
      64093,
      64094
    ],
    1,
    "艹"
  ],
  [
    64095,
    1,
    "著"
  ],
  [
    64096,
    1,
    "褐"
  ],
  [
    64097,
    1,
    "視"
  ],
  [
    64098,
    1,
    "謁"
  ],
  [
    64099,
    1,
    "謹"
  ],
  [
    64100,
    1,
    "賓"
  ],
  [
    64101,
    1,
    "贈"
  ],
  [
    64102,
    1,
    "辶"
  ],
  [
    64103,
    1,
    "逸"
  ],
  [
    64104,
    1,
    "難"
  ],
  [
    64105,
    1,
    "響"
  ],
  [
    64106,
    1,
    "頻"
  ],
  [
    64107,
    1,
    "恵"
  ],
  [
    64108,
    1,
    "𤋮"
  ],
  [
    64109,
    1,
    "舘"
  ],
  [
    [
      64110,
      64111
    ],
    3
  ],
  [
    64112,
    1,
    "並"
  ],
  [
    64113,
    1,
    "况"
  ],
  [
    64114,
    1,
    "全"
  ],
  [
    64115,
    1,
    "侀"
  ],
  [
    64116,
    1,
    "充"
  ],
  [
    64117,
    1,
    "冀"
  ],
  [
    64118,
    1,
    "勇"
  ],
  [
    64119,
    1,
    "勺"
  ],
  [
    64120,
    1,
    "喝"
  ],
  [
    64121,
    1,
    "啕"
  ],
  [
    64122,
    1,
    "喙"
  ],
  [
    64123,
    1,
    "嗢"
  ],
  [
    64124,
    1,
    "塚"
  ],
  [
    64125,
    1,
    "墳"
  ],
  [
    64126,
    1,
    "奄"
  ],
  [
    64127,
    1,
    "奔"
  ],
  [
    64128,
    1,
    "婢"
  ],
  [
    64129,
    1,
    "嬨"
  ],
  [
    64130,
    1,
    "廒"
  ],
  [
    64131,
    1,
    "廙"
  ],
  [
    64132,
    1,
    "彩"
  ],
  [
    64133,
    1,
    "徭"
  ],
  [
    64134,
    1,
    "惘"
  ],
  [
    64135,
    1,
    "慎"
  ],
  [
    64136,
    1,
    "愈"
  ],
  [
    64137,
    1,
    "憎"
  ],
  [
    64138,
    1,
    "慠"
  ],
  [
    64139,
    1,
    "懲"
  ],
  [
    64140,
    1,
    "戴"
  ],
  [
    64141,
    1,
    "揄"
  ],
  [
    64142,
    1,
    "搜"
  ],
  [
    64143,
    1,
    "摒"
  ],
  [
    64144,
    1,
    "敖"
  ],
  [
    64145,
    1,
    "晴"
  ],
  [
    64146,
    1,
    "朗"
  ],
  [
    64147,
    1,
    "望"
  ],
  [
    64148,
    1,
    "杖"
  ],
  [
    64149,
    1,
    "歹"
  ],
  [
    64150,
    1,
    "殺"
  ],
  [
    64151,
    1,
    "流"
  ],
  [
    64152,
    1,
    "滛"
  ],
  [
    64153,
    1,
    "滋"
  ],
  [
    64154,
    1,
    "漢"
  ],
  [
    64155,
    1,
    "瀞"
  ],
  [
    64156,
    1,
    "煮"
  ],
  [
    64157,
    1,
    "瞧"
  ],
  [
    64158,
    1,
    "爵"
  ],
  [
    64159,
    1,
    "犯"
  ],
  [
    64160,
    1,
    "猪"
  ],
  [
    64161,
    1,
    "瑱"
  ],
  [
    64162,
    1,
    "甆"
  ],
  [
    64163,
    1,
    "画"
  ],
  [
    64164,
    1,
    "瘝"
  ],
  [
    64165,
    1,
    "瘟"
  ],
  [
    64166,
    1,
    "益"
  ],
  [
    64167,
    1,
    "盛"
  ],
  [
    64168,
    1,
    "直"
  ],
  [
    64169,
    1,
    "睊"
  ],
  [
    64170,
    1,
    "着"
  ],
  [
    64171,
    1,
    "磌"
  ],
  [
    64172,
    1,
    "窱"
  ],
  [
    64173,
    1,
    "節"
  ],
  [
    64174,
    1,
    "类"
  ],
  [
    64175,
    1,
    "絛"
  ],
  [
    64176,
    1,
    "練"
  ],
  [
    64177,
    1,
    "缾"
  ],
  [
    64178,
    1,
    "者"
  ],
  [
    64179,
    1,
    "荒"
  ],
  [
    64180,
    1,
    "華"
  ],
  [
    64181,
    1,
    "蝹"
  ],
  [
    64182,
    1,
    "襁"
  ],
  [
    64183,
    1,
    "覆"
  ],
  [
    64184,
    1,
    "視"
  ],
  [
    64185,
    1,
    "調"
  ],
  [
    64186,
    1,
    "諸"
  ],
  [
    64187,
    1,
    "請"
  ],
  [
    64188,
    1,
    "謁"
  ],
  [
    64189,
    1,
    "諾"
  ],
  [
    64190,
    1,
    "諭"
  ],
  [
    64191,
    1,
    "謹"
  ],
  [
    64192,
    1,
    "變"
  ],
  [
    64193,
    1,
    "贈"
  ],
  [
    64194,
    1,
    "輸"
  ],
  [
    64195,
    1,
    "遲"
  ],
  [
    64196,
    1,
    "醙"
  ],
  [
    64197,
    1,
    "鉶"
  ],
  [
    64198,
    1,
    "陼"
  ],
  [
    64199,
    1,
    "難"
  ],
  [
    64200,
    1,
    "靖"
  ],
  [
    64201,
    1,
    "韛"
  ],
  [
    64202,
    1,
    "響"
  ],
  [
    64203,
    1,
    "頋"
  ],
  [
    64204,
    1,
    "頻"
  ],
  [
    64205,
    1,
    "鬒"
  ],
  [
    64206,
    1,
    "龜"
  ],
  [
    64207,
    1,
    "𢡊"
  ],
  [
    64208,
    1,
    "𢡄"
  ],
  [
    64209,
    1,
    "𣏕"
  ],
  [
    64210,
    1,
    "㮝"
  ],
  [
    64211,
    1,
    "䀘"
  ],
  [
    64212,
    1,
    "䀹"
  ],
  [
    64213,
    1,
    "𥉉"
  ],
  [
    64214,
    1,
    "𥳐"
  ],
  [
    64215,
    1,
    "𧻓"
  ],
  [
    64216,
    1,
    "齃"
  ],
  [
    64217,
    1,
    "龎"
  ],
  [
    [
      64218,
      64255
    ],
    3
  ],
  [
    64256,
    1,
    "ff"
  ],
  [
    64257,
    1,
    "fi"
  ],
  [
    64258,
    1,
    "fl"
  ],
  [
    64259,
    1,
    "ffi"
  ],
  [
    64260,
    1,
    "ffl"
  ],
  [
    [
      64261,
      64262
    ],
    1,
    "st"
  ],
  [
    [
      64263,
      64274
    ],
    3
  ],
  [
    64275,
    1,
    "մն"
  ],
  [
    64276,
    1,
    "մե"
  ],
  [
    64277,
    1,
    "մի"
  ],
  [
    64278,
    1,
    "վն"
  ],
  [
    64279,
    1,
    "մխ"
  ],
  [
    [
      64280,
      64284
    ],
    3
  ],
  [
    64285,
    1,
    "יִ"
  ],
  [
    64286,
    2
  ],
  [
    64287,
    1,
    "ײַ"
  ],
  [
    64288,
    1,
    "ע"
  ],
  [
    64289,
    1,
    "א"
  ],
  [
    64290,
    1,
    "ד"
  ],
  [
    64291,
    1,
    "ה"
  ],
  [
    64292,
    1,
    "כ"
  ],
  [
    64293,
    1,
    "ל"
  ],
  [
    64294,
    1,
    "ם"
  ],
  [
    64295,
    1,
    "ר"
  ],
  [
    64296,
    1,
    "ת"
  ],
  [
    64297,
    5,
    "+"
  ],
  [
    64298,
    1,
    "שׁ"
  ],
  [
    64299,
    1,
    "שׂ"
  ],
  [
    64300,
    1,
    "שּׁ"
  ],
  [
    64301,
    1,
    "שּׂ"
  ],
  [
    64302,
    1,
    "אַ"
  ],
  [
    64303,
    1,
    "אָ"
  ],
  [
    64304,
    1,
    "אּ"
  ],
  [
    64305,
    1,
    "בּ"
  ],
  [
    64306,
    1,
    "גּ"
  ],
  [
    64307,
    1,
    "דּ"
  ],
  [
    64308,
    1,
    "הּ"
  ],
  [
    64309,
    1,
    "וּ"
  ],
  [
    64310,
    1,
    "זּ"
  ],
  [
    64311,
    3
  ],
  [
    64312,
    1,
    "טּ"
  ],
  [
    64313,
    1,
    "יּ"
  ],
  [
    64314,
    1,
    "ךּ"
  ],
  [
    64315,
    1,
    "כּ"
  ],
  [
    64316,
    1,
    "לּ"
  ],
  [
    64317,
    3
  ],
  [
    64318,
    1,
    "מּ"
  ],
  [
    64319,
    3
  ],
  [
    64320,
    1,
    "נּ"
  ],
  [
    64321,
    1,
    "סּ"
  ],
  [
    64322,
    3
  ],
  [
    64323,
    1,
    "ףּ"
  ],
  [
    64324,
    1,
    "פּ"
  ],
  [
    64325,
    3
  ],
  [
    64326,
    1,
    "צּ"
  ],
  [
    64327,
    1,
    "קּ"
  ],
  [
    64328,
    1,
    "רּ"
  ],
  [
    64329,
    1,
    "שּ"
  ],
  [
    64330,
    1,
    "תּ"
  ],
  [
    64331,
    1,
    "וֹ"
  ],
  [
    64332,
    1,
    "בֿ"
  ],
  [
    64333,
    1,
    "כֿ"
  ],
  [
    64334,
    1,
    "פֿ"
  ],
  [
    64335,
    1,
    "אל"
  ],
  [
    [
      64336,
      64337
    ],
    1,
    "ٱ"
  ],
  [
    [
      64338,
      64341
    ],
    1,
    "ٻ"
  ],
  [
    [
      64342,
      64345
    ],
    1,
    "پ"
  ],
  [
    [
      64346,
      64349
    ],
    1,
    "ڀ"
  ],
  [
    [
      64350,
      64353
    ],
    1,
    "ٺ"
  ],
  [
    [
      64354,
      64357
    ],
    1,
    "ٿ"
  ],
  [
    [
      64358,
      64361
    ],
    1,
    "ٹ"
  ],
  [
    [
      64362,
      64365
    ],
    1,
    "ڤ"
  ],
  [
    [
      64366,
      64369
    ],
    1,
    "ڦ"
  ],
  [
    [
      64370,
      64373
    ],
    1,
    "ڄ"
  ],
  [
    [
      64374,
      64377
    ],
    1,
    "ڃ"
  ],
  [
    [
      64378,
      64381
    ],
    1,
    "چ"
  ],
  [
    [
      64382,
      64385
    ],
    1,
    "ڇ"
  ],
  [
    [
      64386,
      64387
    ],
    1,
    "ڍ"
  ],
  [
    [
      64388,
      64389
    ],
    1,
    "ڌ"
  ],
  [
    [
      64390,
      64391
    ],
    1,
    "ڎ"
  ],
  [
    [
      64392,
      64393
    ],
    1,
    "ڈ"
  ],
  [
    [
      64394,
      64395
    ],
    1,
    "ژ"
  ],
  [
    [
      64396,
      64397
    ],
    1,
    "ڑ"
  ],
  [
    [
      64398,
      64401
    ],
    1,
    "ک"
  ],
  [
    [
      64402,
      64405
    ],
    1,
    "گ"
  ],
  [
    [
      64406,
      64409
    ],
    1,
    "ڳ"
  ],
  [
    [
      64410,
      64413
    ],
    1,
    "ڱ"
  ],
  [
    [
      64414,
      64415
    ],
    1,
    "ں"
  ],
  [
    [
      64416,
      64419
    ],
    1,
    "ڻ"
  ],
  [
    [
      64420,
      64421
    ],
    1,
    "ۀ"
  ],
  [
    [
      64422,
      64425
    ],
    1,
    "ہ"
  ],
  [
    [
      64426,
      64429
    ],
    1,
    "ھ"
  ],
  [
    [
      64430,
      64431
    ],
    1,
    "ے"
  ],
  [
    [
      64432,
      64433
    ],
    1,
    "ۓ"
  ],
  [
    [
      64434,
      64449
    ],
    2
  ],
  [
    64450,
    2
  ],
  [
    [
      64451,
      64466
    ],
    3
  ],
  [
    [
      64467,
      64470
    ],
    1,
    "ڭ"
  ],
  [
    [
      64471,
      64472
    ],
    1,
    "ۇ"
  ],
  [
    [
      64473,
      64474
    ],
    1,
    "ۆ"
  ],
  [
    [
      64475,
      64476
    ],
    1,
    "ۈ"
  ],
  [
    64477,
    1,
    "ۇٴ"
  ],
  [
    [
      64478,
      64479
    ],
    1,
    "ۋ"
  ],
  [
    [
      64480,
      64481
    ],
    1,
    "ۅ"
  ],
  [
    [
      64482,
      64483
    ],
    1,
    "ۉ"
  ],
  [
    [
      64484,
      64487
    ],
    1,
    "ې"
  ],
  [
    [
      64488,
      64489
    ],
    1,
    "ى"
  ],
  [
    [
      64490,
      64491
    ],
    1,
    "ئا"
  ],
  [
    [
      64492,
      64493
    ],
    1,
    "ئە"
  ],
  [
    [
      64494,
      64495
    ],
    1,
    "ئو"
  ],
  [
    [
      64496,
      64497
    ],
    1,
    "ئۇ"
  ],
  [
    [
      64498,
      64499
    ],
    1,
    "ئۆ"
  ],
  [
    [
      64500,
      64501
    ],
    1,
    "ئۈ"
  ],
  [
    [
      64502,
      64504
    ],
    1,
    "ئې"
  ],
  [
    [
      64505,
      64507
    ],
    1,
    "ئى"
  ],
  [
    [
      64508,
      64511
    ],
    1,
    "ی"
  ],
  [
    64512,
    1,
    "ئج"
  ],
  [
    64513,
    1,
    "ئح"
  ],
  [
    64514,
    1,
    "ئم"
  ],
  [
    64515,
    1,
    "ئى"
  ],
  [
    64516,
    1,
    "ئي"
  ],
  [
    64517,
    1,
    "بج"
  ],
  [
    64518,
    1,
    "بح"
  ],
  [
    64519,
    1,
    "بخ"
  ],
  [
    64520,
    1,
    "بم"
  ],
  [
    64521,
    1,
    "بى"
  ],
  [
    64522,
    1,
    "بي"
  ],
  [
    64523,
    1,
    "تج"
  ],
  [
    64524,
    1,
    "تح"
  ],
  [
    64525,
    1,
    "تخ"
  ],
  [
    64526,
    1,
    "تم"
  ],
  [
    64527,
    1,
    "تى"
  ],
  [
    64528,
    1,
    "تي"
  ],
  [
    64529,
    1,
    "ثج"
  ],
  [
    64530,
    1,
    "ثم"
  ],
  [
    64531,
    1,
    "ثى"
  ],
  [
    64532,
    1,
    "ثي"
  ],
  [
    64533,
    1,
    "جح"
  ],
  [
    64534,
    1,
    "جم"
  ],
  [
    64535,
    1,
    "حج"
  ],
  [
    64536,
    1,
    "حم"
  ],
  [
    64537,
    1,
    "خج"
  ],
  [
    64538,
    1,
    "خح"
  ],
  [
    64539,
    1,
    "خم"
  ],
  [
    64540,
    1,
    "سج"
  ],
  [
    64541,
    1,
    "سح"
  ],
  [
    64542,
    1,
    "سخ"
  ],
  [
    64543,
    1,
    "سم"
  ],
  [
    64544,
    1,
    "صح"
  ],
  [
    64545,
    1,
    "صم"
  ],
  [
    64546,
    1,
    "ضج"
  ],
  [
    64547,
    1,
    "ضح"
  ],
  [
    64548,
    1,
    "ضخ"
  ],
  [
    64549,
    1,
    "ضم"
  ],
  [
    64550,
    1,
    "طح"
  ],
  [
    64551,
    1,
    "طم"
  ],
  [
    64552,
    1,
    "ظم"
  ],
  [
    64553,
    1,
    "عج"
  ],
  [
    64554,
    1,
    "عم"
  ],
  [
    64555,
    1,
    "غج"
  ],
  [
    64556,
    1,
    "غم"
  ],
  [
    64557,
    1,
    "فج"
  ],
  [
    64558,
    1,
    "فح"
  ],
  [
    64559,
    1,
    "فخ"
  ],
  [
    64560,
    1,
    "فم"
  ],
  [
    64561,
    1,
    "فى"
  ],
  [
    64562,
    1,
    "في"
  ],
  [
    64563,
    1,
    "قح"
  ],
  [
    64564,
    1,
    "قم"
  ],
  [
    64565,
    1,
    "قى"
  ],
  [
    64566,
    1,
    "قي"
  ],
  [
    64567,
    1,
    "كا"
  ],
  [
    64568,
    1,
    "كج"
  ],
  [
    64569,
    1,
    "كح"
  ],
  [
    64570,
    1,
    "كخ"
  ],
  [
    64571,
    1,
    "كل"
  ],
  [
    64572,
    1,
    "كم"
  ],
  [
    64573,
    1,
    "كى"
  ],
  [
    64574,
    1,
    "كي"
  ],
  [
    64575,
    1,
    "لج"
  ],
  [
    64576,
    1,
    "لح"
  ],
  [
    64577,
    1,
    "لخ"
  ],
  [
    64578,
    1,
    "لم"
  ],
  [
    64579,
    1,
    "لى"
  ],
  [
    64580,
    1,
    "لي"
  ],
  [
    64581,
    1,
    "مج"
  ],
  [
    64582,
    1,
    "مح"
  ],
  [
    64583,
    1,
    "مخ"
  ],
  [
    64584,
    1,
    "مم"
  ],
  [
    64585,
    1,
    "مى"
  ],
  [
    64586,
    1,
    "مي"
  ],
  [
    64587,
    1,
    "نج"
  ],
  [
    64588,
    1,
    "نح"
  ],
  [
    64589,
    1,
    "نخ"
  ],
  [
    64590,
    1,
    "نم"
  ],
  [
    64591,
    1,
    "نى"
  ],
  [
    64592,
    1,
    "ني"
  ],
  [
    64593,
    1,
    "هج"
  ],
  [
    64594,
    1,
    "هم"
  ],
  [
    64595,
    1,
    "هى"
  ],
  [
    64596,
    1,
    "هي"
  ],
  [
    64597,
    1,
    "يج"
  ],
  [
    64598,
    1,
    "يح"
  ],
  [
    64599,
    1,
    "يخ"
  ],
  [
    64600,
    1,
    "يم"
  ],
  [
    64601,
    1,
    "يى"
  ],
  [
    64602,
    1,
    "يي"
  ],
  [
    64603,
    1,
    "ذٰ"
  ],
  [
    64604,
    1,
    "رٰ"
  ],
  [
    64605,
    1,
    "ىٰ"
  ],
  [
    64606,
    5,
    " ٌّ"
  ],
  [
    64607,
    5,
    " ٍّ"
  ],
  [
    64608,
    5,
    " َّ"
  ],
  [
    64609,
    5,
    " ُّ"
  ],
  [
    64610,
    5,
    " ِّ"
  ],
  [
    64611,
    5,
    " ّٰ"
  ],
  [
    64612,
    1,
    "ئر"
  ],
  [
    64613,
    1,
    "ئز"
  ],
  [
    64614,
    1,
    "ئم"
  ],
  [
    64615,
    1,
    "ئن"
  ],
  [
    64616,
    1,
    "ئى"
  ],
  [
    64617,
    1,
    "ئي"
  ],
  [
    64618,
    1,
    "بر"
  ],
  [
    64619,
    1,
    "بز"
  ],
  [
    64620,
    1,
    "بم"
  ],
  [
    64621,
    1,
    "بن"
  ],
  [
    64622,
    1,
    "بى"
  ],
  [
    64623,
    1,
    "بي"
  ],
  [
    64624,
    1,
    "تر"
  ],
  [
    64625,
    1,
    "تز"
  ],
  [
    64626,
    1,
    "تم"
  ],
  [
    64627,
    1,
    "تن"
  ],
  [
    64628,
    1,
    "تى"
  ],
  [
    64629,
    1,
    "تي"
  ],
  [
    64630,
    1,
    "ثر"
  ],
  [
    64631,
    1,
    "ثز"
  ],
  [
    64632,
    1,
    "ثم"
  ],
  [
    64633,
    1,
    "ثن"
  ],
  [
    64634,
    1,
    "ثى"
  ],
  [
    64635,
    1,
    "ثي"
  ],
  [
    64636,
    1,
    "فى"
  ],
  [
    64637,
    1,
    "في"
  ],
  [
    64638,
    1,
    "قى"
  ],
  [
    64639,
    1,
    "قي"
  ],
  [
    64640,
    1,
    "كا"
  ],
  [
    64641,
    1,
    "كل"
  ],
  [
    64642,
    1,
    "كم"
  ],
  [
    64643,
    1,
    "كى"
  ],
  [
    64644,
    1,
    "كي"
  ],
  [
    64645,
    1,
    "لم"
  ],
  [
    64646,
    1,
    "لى"
  ],
  [
    64647,
    1,
    "لي"
  ],
  [
    64648,
    1,
    "ما"
  ],
  [
    64649,
    1,
    "مم"
  ],
  [
    64650,
    1,
    "نر"
  ],
  [
    64651,
    1,
    "نز"
  ],
  [
    64652,
    1,
    "نم"
  ],
  [
    64653,
    1,
    "نن"
  ],
  [
    64654,
    1,
    "نى"
  ],
  [
    64655,
    1,
    "ني"
  ],
  [
    64656,
    1,
    "ىٰ"
  ],
  [
    64657,
    1,
    "ير"
  ],
  [
    64658,
    1,
    "يز"
  ],
  [
    64659,
    1,
    "يم"
  ],
  [
    64660,
    1,
    "ين"
  ],
  [
    64661,
    1,
    "يى"
  ],
  [
    64662,
    1,
    "يي"
  ],
  [
    64663,
    1,
    "ئج"
  ],
  [
    64664,
    1,
    "ئح"
  ],
  [
    64665,
    1,
    "ئخ"
  ],
  [
    64666,
    1,
    "ئم"
  ],
  [
    64667,
    1,
    "ئه"
  ],
  [
    64668,
    1,
    "بج"
  ],
  [
    64669,
    1,
    "بح"
  ],
  [
    64670,
    1,
    "بخ"
  ],
  [
    64671,
    1,
    "بم"
  ],
  [
    64672,
    1,
    "به"
  ],
  [
    64673,
    1,
    "تج"
  ],
  [
    64674,
    1,
    "تح"
  ],
  [
    64675,
    1,
    "تخ"
  ],
  [
    64676,
    1,
    "تم"
  ],
  [
    64677,
    1,
    "ته"
  ],
  [
    64678,
    1,
    "ثم"
  ],
  [
    64679,
    1,
    "جح"
  ],
  [
    64680,
    1,
    "جم"
  ],
  [
    64681,
    1,
    "حج"
  ],
  [
    64682,
    1,
    "حم"
  ],
  [
    64683,
    1,
    "خج"
  ],
  [
    64684,
    1,
    "خم"
  ],
  [
    64685,
    1,
    "سج"
  ],
  [
    64686,
    1,
    "سح"
  ],
  [
    64687,
    1,
    "سخ"
  ],
  [
    64688,
    1,
    "سم"
  ],
  [
    64689,
    1,
    "صح"
  ],
  [
    64690,
    1,
    "صخ"
  ],
  [
    64691,
    1,
    "صم"
  ],
  [
    64692,
    1,
    "ضج"
  ],
  [
    64693,
    1,
    "ضح"
  ],
  [
    64694,
    1,
    "ضخ"
  ],
  [
    64695,
    1,
    "ضم"
  ],
  [
    64696,
    1,
    "طح"
  ],
  [
    64697,
    1,
    "ظم"
  ],
  [
    64698,
    1,
    "عج"
  ],
  [
    64699,
    1,
    "عم"
  ],
  [
    64700,
    1,
    "غج"
  ],
  [
    64701,
    1,
    "غم"
  ],
  [
    64702,
    1,
    "فج"
  ],
  [
    64703,
    1,
    "فح"
  ],
  [
    64704,
    1,
    "فخ"
  ],
  [
    64705,
    1,
    "فم"
  ],
  [
    64706,
    1,
    "قح"
  ],
  [
    64707,
    1,
    "قم"
  ],
  [
    64708,
    1,
    "كج"
  ],
  [
    64709,
    1,
    "كح"
  ],
  [
    64710,
    1,
    "كخ"
  ],
  [
    64711,
    1,
    "كل"
  ],
  [
    64712,
    1,
    "كم"
  ],
  [
    64713,
    1,
    "لج"
  ],
  [
    64714,
    1,
    "لح"
  ],
  [
    64715,
    1,
    "لخ"
  ],
  [
    64716,
    1,
    "لم"
  ],
  [
    64717,
    1,
    "له"
  ],
  [
    64718,
    1,
    "مج"
  ],
  [
    64719,
    1,
    "مح"
  ],
  [
    64720,
    1,
    "مخ"
  ],
  [
    64721,
    1,
    "مم"
  ],
  [
    64722,
    1,
    "نج"
  ],
  [
    64723,
    1,
    "نح"
  ],
  [
    64724,
    1,
    "نخ"
  ],
  [
    64725,
    1,
    "نم"
  ],
  [
    64726,
    1,
    "نه"
  ],
  [
    64727,
    1,
    "هج"
  ],
  [
    64728,
    1,
    "هم"
  ],
  [
    64729,
    1,
    "هٰ"
  ],
  [
    64730,
    1,
    "يج"
  ],
  [
    64731,
    1,
    "يح"
  ],
  [
    64732,
    1,
    "يخ"
  ],
  [
    64733,
    1,
    "يم"
  ],
  [
    64734,
    1,
    "يه"
  ],
  [
    64735,
    1,
    "ئم"
  ],
  [
    64736,
    1,
    "ئه"
  ],
  [
    64737,
    1,
    "بم"
  ],
  [
    64738,
    1,
    "به"
  ],
  [
    64739,
    1,
    "تم"
  ],
  [
    64740,
    1,
    "ته"
  ],
  [
    64741,
    1,
    "ثم"
  ],
  [
    64742,
    1,
    "ثه"
  ],
  [
    64743,
    1,
    "سم"
  ],
  [
    64744,
    1,
    "سه"
  ],
  [
    64745,
    1,
    "شم"
  ],
  [
    64746,
    1,
    "شه"
  ],
  [
    64747,
    1,
    "كل"
  ],
  [
    64748,
    1,
    "كم"
  ],
  [
    64749,
    1,
    "لم"
  ],
  [
    64750,
    1,
    "نم"
  ],
  [
    64751,
    1,
    "نه"
  ],
  [
    64752,
    1,
    "يم"
  ],
  [
    64753,
    1,
    "يه"
  ],
  [
    64754,
    1,
    "ـَّ"
  ],
  [
    64755,
    1,
    "ـُّ"
  ],
  [
    64756,
    1,
    "ـِّ"
  ],
  [
    64757,
    1,
    "طى"
  ],
  [
    64758,
    1,
    "طي"
  ],
  [
    64759,
    1,
    "عى"
  ],
  [
    64760,
    1,
    "عي"
  ],
  [
    64761,
    1,
    "غى"
  ],
  [
    64762,
    1,
    "غي"
  ],
  [
    64763,
    1,
    "سى"
  ],
  [
    64764,
    1,
    "سي"
  ],
  [
    64765,
    1,
    "شى"
  ],
  [
    64766,
    1,
    "شي"
  ],
  [
    64767,
    1,
    "حى"
  ],
  [
    64768,
    1,
    "حي"
  ],
  [
    64769,
    1,
    "جى"
  ],
  [
    64770,
    1,
    "جي"
  ],
  [
    64771,
    1,
    "خى"
  ],
  [
    64772,
    1,
    "خي"
  ],
  [
    64773,
    1,
    "صى"
  ],
  [
    64774,
    1,
    "صي"
  ],
  [
    64775,
    1,
    "ضى"
  ],
  [
    64776,
    1,
    "ضي"
  ],
  [
    64777,
    1,
    "شج"
  ],
  [
    64778,
    1,
    "شح"
  ],
  [
    64779,
    1,
    "شخ"
  ],
  [
    64780,
    1,
    "شم"
  ],
  [
    64781,
    1,
    "شر"
  ],
  [
    64782,
    1,
    "سر"
  ],
  [
    64783,
    1,
    "صر"
  ],
  [
    64784,
    1,
    "ضر"
  ],
  [
    64785,
    1,
    "طى"
  ],
  [
    64786,
    1,
    "طي"
  ],
  [
    64787,
    1,
    "عى"
  ],
  [
    64788,
    1,
    "عي"
  ],
  [
    64789,
    1,
    "غى"
  ],
  [
    64790,
    1,
    "غي"
  ],
  [
    64791,
    1,
    "سى"
  ],
  [
    64792,
    1,
    "سي"
  ],
  [
    64793,
    1,
    "شى"
  ],
  [
    64794,
    1,
    "شي"
  ],
  [
    64795,
    1,
    "حى"
  ],
  [
    64796,
    1,
    "حي"
  ],
  [
    64797,
    1,
    "جى"
  ],
  [
    64798,
    1,
    "جي"
  ],
  [
    64799,
    1,
    "خى"
  ],
  [
    64800,
    1,
    "خي"
  ],
  [
    64801,
    1,
    "صى"
  ],
  [
    64802,
    1,
    "صي"
  ],
  [
    64803,
    1,
    "ضى"
  ],
  [
    64804,
    1,
    "ضي"
  ],
  [
    64805,
    1,
    "شج"
  ],
  [
    64806,
    1,
    "شح"
  ],
  [
    64807,
    1,
    "شخ"
  ],
  [
    64808,
    1,
    "شم"
  ],
  [
    64809,
    1,
    "شر"
  ],
  [
    64810,
    1,
    "سر"
  ],
  [
    64811,
    1,
    "صر"
  ],
  [
    64812,
    1,
    "ضر"
  ],
  [
    64813,
    1,
    "شج"
  ],
  [
    64814,
    1,
    "شح"
  ],
  [
    64815,
    1,
    "شخ"
  ],
  [
    64816,
    1,
    "شم"
  ],
  [
    64817,
    1,
    "سه"
  ],
  [
    64818,
    1,
    "شه"
  ],
  [
    64819,
    1,
    "طم"
  ],
  [
    64820,
    1,
    "سج"
  ],
  [
    64821,
    1,
    "سح"
  ],
  [
    64822,
    1,
    "سخ"
  ],
  [
    64823,
    1,
    "شج"
  ],
  [
    64824,
    1,
    "شح"
  ],
  [
    64825,
    1,
    "شخ"
  ],
  [
    64826,
    1,
    "طم"
  ],
  [
    64827,
    1,
    "ظم"
  ],
  [
    [
      64828,
      64829
    ],
    1,
    "اً"
  ],
  [
    [
      64830,
      64831
    ],
    2
  ],
  [
    [
      64832,
      64847
    ],
    2
  ],
  [
    64848,
    1,
    "تجم"
  ],
  [
    [
      64849,
      64850
    ],
    1,
    "تحج"
  ],
  [
    64851,
    1,
    "تحم"
  ],
  [
    64852,
    1,
    "تخم"
  ],
  [
    64853,
    1,
    "تمج"
  ],
  [
    64854,
    1,
    "تمح"
  ],
  [
    64855,
    1,
    "تمخ"
  ],
  [
    [
      64856,
      64857
    ],
    1,
    "جمح"
  ],
  [
    64858,
    1,
    "حمي"
  ],
  [
    64859,
    1,
    "حمى"
  ],
  [
    64860,
    1,
    "سحج"
  ],
  [
    64861,
    1,
    "سجح"
  ],
  [
    64862,
    1,
    "سجى"
  ],
  [
    [
      64863,
      64864
    ],
    1,
    "سمح"
  ],
  [
    64865,
    1,
    "سمج"
  ],
  [
    [
      64866,
      64867
    ],
    1,
    "سمم"
  ],
  [
    [
      64868,
      64869
    ],
    1,
    "صحح"
  ],
  [
    64870,
    1,
    "صمم"
  ],
  [
    [
      64871,
      64872
    ],
    1,
    "شحم"
  ],
  [
    64873,
    1,
    "شجي"
  ],
  [
    [
      64874,
      64875
    ],
    1,
    "شمخ"
  ],
  [
    [
      64876,
      64877
    ],
    1,
    "شمم"
  ],
  [
    64878,
    1,
    "ضحى"
  ],
  [
    [
      64879,
      64880
    ],
    1,
    "ضخم"
  ],
  [
    [
      64881,
      64882
    ],
    1,
    "طمح"
  ],
  [
    64883,
    1,
    "طمم"
  ],
  [
    64884,
    1,
    "طمي"
  ],
  [
    64885,
    1,
    "عجم"
  ],
  [
    [
      64886,
      64887
    ],
    1,
    "عمم"
  ],
  [
    64888,
    1,
    "عمى"
  ],
  [
    64889,
    1,
    "غمم"
  ],
  [
    64890,
    1,
    "غمي"
  ],
  [
    64891,
    1,
    "غمى"
  ],
  [
    [
      64892,
      64893
    ],
    1,
    "فخم"
  ],
  [
    64894,
    1,
    "قمح"
  ],
  [
    64895,
    1,
    "قمم"
  ],
  [
    64896,
    1,
    "لحم"
  ],
  [
    64897,
    1,
    "لحي"
  ],
  [
    64898,
    1,
    "لحى"
  ],
  [
    [
      64899,
      64900
    ],
    1,
    "لجج"
  ],
  [
    [
      64901,
      64902
    ],
    1,
    "لخم"
  ],
  [
    [
      64903,
      64904
    ],
    1,
    "لمح"
  ],
  [
    64905,
    1,
    "محج"
  ],
  [
    64906,
    1,
    "محم"
  ],
  [
    64907,
    1,
    "محي"
  ],
  [
    64908,
    1,
    "مجح"
  ],
  [
    64909,
    1,
    "مجم"
  ],
  [
    64910,
    1,
    "مخج"
  ],
  [
    64911,
    1,
    "مخم"
  ],
  [
    [
      64912,
      64913
    ],
    3
  ],
  [
    64914,
    1,
    "مجخ"
  ],
  [
    64915,
    1,
    "همج"
  ],
  [
    64916,
    1,
    "همم"
  ],
  [
    64917,
    1,
    "نحم"
  ],
  [
    64918,
    1,
    "نحى"
  ],
  [
    [
      64919,
      64920
    ],
    1,
    "نجم"
  ],
  [
    64921,
    1,
    "نجى"
  ],
  [
    64922,
    1,
    "نمي"
  ],
  [
    64923,
    1,
    "نمى"
  ],
  [
    [
      64924,
      64925
    ],
    1,
    "يمم"
  ],
  [
    64926,
    1,
    "بخي"
  ],
  [
    64927,
    1,
    "تجي"
  ],
  [
    64928,
    1,
    "تجى"
  ],
  [
    64929,
    1,
    "تخي"
  ],
  [
    64930,
    1,
    "تخى"
  ],
  [
    64931,
    1,
    "تمي"
  ],
  [
    64932,
    1,
    "تمى"
  ],
  [
    64933,
    1,
    "جمي"
  ],
  [
    64934,
    1,
    "جحى"
  ],
  [
    64935,
    1,
    "جمى"
  ],
  [
    64936,
    1,
    "سخى"
  ],
  [
    64937,
    1,
    "صحي"
  ],
  [
    64938,
    1,
    "شحي"
  ],
  [
    64939,
    1,
    "ضحي"
  ],
  [
    64940,
    1,
    "لجي"
  ],
  [
    64941,
    1,
    "لمي"
  ],
  [
    64942,
    1,
    "يحي"
  ],
  [
    64943,
    1,
    "يجي"
  ],
  [
    64944,
    1,
    "يمي"
  ],
  [
    64945,
    1,
    "ممي"
  ],
  [
    64946,
    1,
    "قمي"
  ],
  [
    64947,
    1,
    "نحي"
  ],
  [
    64948,
    1,
    "قمح"
  ],
  [
    64949,
    1,
    "لحم"
  ],
  [
    64950,
    1,
    "عمي"
  ],
  [
    64951,
    1,
    "كمي"
  ],
  [
    64952,
    1,
    "نجح"
  ],
  [
    64953,
    1,
    "مخي"
  ],
  [
    64954,
    1,
    "لجم"
  ],
  [
    64955,
    1,
    "كمم"
  ],
  [
    64956,
    1,
    "لجم"
  ],
  [
    64957,
    1,
    "نجح"
  ],
  [
    64958,
    1,
    "جحي"
  ],
  [
    64959,
    1,
    "حجي"
  ],
  [
    64960,
    1,
    "مجي"
  ],
  [
    64961,
    1,
    "فمي"
  ],
  [
    64962,
    1,
    "بحي"
  ],
  [
    64963,
    1,
    "كمم"
  ],
  [
    64964,
    1,
    "عجم"
  ],
  [
    64965,
    1,
    "صمم"
  ],
  [
    64966,
    1,
    "سخي"
  ],
  [
    64967,
    1,
    "نجي"
  ],
  [
    [
      64968,
      64974
    ],
    3
  ],
  [
    64975,
    2
  ],
  [
    [
      64976,
      65007
    ],
    3
  ],
  [
    65008,
    1,
    "صلے"
  ],
  [
    65009,
    1,
    "قلے"
  ],
  [
    65010,
    1,
    "الله"
  ],
  [
    65011,
    1,
    "اكبر"
  ],
  [
    65012,
    1,
    "محمد"
  ],
  [
    65013,
    1,
    "صلعم"
  ],
  [
    65014,
    1,
    "رسول"
  ],
  [
    65015,
    1,
    "عليه"
  ],
  [
    65016,
    1,
    "وسلم"
  ],
  [
    65017,
    1,
    "صلى"
  ],
  [
    65018,
    5,
    "صلى الله عليه وسلم"
  ],
  [
    65019,
    5,
    "جل جلاله"
  ],
  [
    65020,
    1,
    "ریال"
  ],
  [
    65021,
    2
  ],
  [
    [
      65022,
      65023
    ],
    2
  ],
  [
    [
      65024,
      65039
    ],
    7
  ],
  [
    65040,
    5,
    ","
  ],
  [
    65041,
    1,
    "、"
  ],
  [
    65042,
    3
  ],
  [
    65043,
    5,
    ":"
  ],
  [
    65044,
    5,
    ";"
  ],
  [
    65045,
    5,
    "!"
  ],
  [
    65046,
    5,
    "?"
  ],
  [
    65047,
    1,
    "〖"
  ],
  [
    65048,
    1,
    "〗"
  ],
  [
    65049,
    3
  ],
  [
    [
      65050,
      65055
    ],
    3
  ],
  [
    [
      65056,
      65059
    ],
    2
  ],
  [
    [
      65060,
      65062
    ],
    2
  ],
  [
    [
      65063,
      65069
    ],
    2
  ],
  [
    [
      65070,
      65071
    ],
    2
  ],
  [
    65072,
    3
  ],
  [
    65073,
    1,
    "—"
  ],
  [
    65074,
    1,
    "–"
  ],
  [
    [
      65075,
      65076
    ],
    5,
    "_"
  ],
  [
    65077,
    5,
    "("
  ],
  [
    65078,
    5,
    ")"
  ],
  [
    65079,
    5,
    "{"
  ],
  [
    65080,
    5,
    "}"
  ],
  [
    65081,
    1,
    "〔"
  ],
  [
    65082,
    1,
    "〕"
  ],
  [
    65083,
    1,
    "【"
  ],
  [
    65084,
    1,
    "】"
  ],
  [
    65085,
    1,
    "《"
  ],
  [
    65086,
    1,
    "》"
  ],
  [
    65087,
    1,
    "〈"
  ],
  [
    65088,
    1,
    "〉"
  ],
  [
    65089,
    1,
    "「"
  ],
  [
    65090,
    1,
    "」"
  ],
  [
    65091,
    1,
    "『"
  ],
  [
    65092,
    1,
    "』"
  ],
  [
    [
      65093,
      65094
    ],
    2
  ],
  [
    65095,
    5,
    "["
  ],
  [
    65096,
    5,
    "]"
  ],
  [
    [
      65097,
      65100
    ],
    5,
    " ̅"
  ],
  [
    [
      65101,
      65103
    ],
    5,
    "_"
  ],
  [
    65104,
    5,
    ","
  ],
  [
    65105,
    1,
    "、"
  ],
  [
    65106,
    3
  ],
  [
    65107,
    3
  ],
  [
    65108,
    5,
    ";"
  ],
  [
    65109,
    5,
    ":"
  ],
  [
    65110,
    5,
    "?"
  ],
  [
    65111,
    5,
    "!"
  ],
  [
    65112,
    1,
    "—"
  ],
  [
    65113,
    5,
    "("
  ],
  [
    65114,
    5,
    ")"
  ],
  [
    65115,
    5,
    "{"
  ],
  [
    65116,
    5,
    "}"
  ],
  [
    65117,
    1,
    "〔"
  ],
  [
    65118,
    1,
    "〕"
  ],
  [
    65119,
    5,
    "#"
  ],
  [
    65120,
    5,
    "&"
  ],
  [
    65121,
    5,
    "*"
  ],
  [
    65122,
    5,
    "+"
  ],
  [
    65123,
    1,
    "-"
  ],
  [
    65124,
    5,
    "<"
  ],
  [
    65125,
    5,
    ">"
  ],
  [
    65126,
    5,
    "="
  ],
  [
    65127,
    3
  ],
  [
    65128,
    5,
    "\\"
  ],
  [
    65129,
    5,
    "$"
  ],
  [
    65130,
    5,
    "%"
  ],
  [
    65131,
    5,
    "@"
  ],
  [
    [
      65132,
      65135
    ],
    3
  ],
  [
    65136,
    5,
    " ً"
  ],
  [
    65137,
    1,
    "ـً"
  ],
  [
    65138,
    5,
    " ٌ"
  ],
  [
    65139,
    2
  ],
  [
    65140,
    5,
    " ٍ"
  ],
  [
    65141,
    3
  ],
  [
    65142,
    5,
    " َ"
  ],
  [
    65143,
    1,
    "ـَ"
  ],
  [
    65144,
    5,
    " ُ"
  ],
  [
    65145,
    1,
    "ـُ"
  ],
  [
    65146,
    5,
    " ِ"
  ],
  [
    65147,
    1,
    "ـِ"
  ],
  [
    65148,
    5,
    " ّ"
  ],
  [
    65149,
    1,
    "ـّ"
  ],
  [
    65150,
    5,
    " ْ"
  ],
  [
    65151,
    1,
    "ـْ"
  ],
  [
    65152,
    1,
    "ء"
  ],
  [
    [
      65153,
      65154
    ],
    1,
    "آ"
  ],
  [
    [
      65155,
      65156
    ],
    1,
    "أ"
  ],
  [
    [
      65157,
      65158
    ],
    1,
    "ؤ"
  ],
  [
    [
      65159,
      65160
    ],
    1,
    "إ"
  ],
  [
    [
      65161,
      65164
    ],
    1,
    "ئ"
  ],
  [
    [
      65165,
      65166
    ],
    1,
    "ا"
  ],
  [
    [
      65167,
      65170
    ],
    1,
    "ب"
  ],
  [
    [
      65171,
      65172
    ],
    1,
    "ة"
  ],
  [
    [
      65173,
      65176
    ],
    1,
    "ت"
  ],
  [
    [
      65177,
      65180
    ],
    1,
    "ث"
  ],
  [
    [
      65181,
      65184
    ],
    1,
    "ج"
  ],
  [
    [
      65185,
      65188
    ],
    1,
    "ح"
  ],
  [
    [
      65189,
      65192
    ],
    1,
    "خ"
  ],
  [
    [
      65193,
      65194
    ],
    1,
    "د"
  ],
  [
    [
      65195,
      65196
    ],
    1,
    "ذ"
  ],
  [
    [
      65197,
      65198
    ],
    1,
    "ر"
  ],
  [
    [
      65199,
      65200
    ],
    1,
    "ز"
  ],
  [
    [
      65201,
      65204
    ],
    1,
    "س"
  ],
  [
    [
      65205,
      65208
    ],
    1,
    "ش"
  ],
  [
    [
      65209,
      65212
    ],
    1,
    "ص"
  ],
  [
    [
      65213,
      65216
    ],
    1,
    "ض"
  ],
  [
    [
      65217,
      65220
    ],
    1,
    "ط"
  ],
  [
    [
      65221,
      65224
    ],
    1,
    "ظ"
  ],
  [
    [
      65225,
      65228
    ],
    1,
    "ع"
  ],
  [
    [
      65229,
      65232
    ],
    1,
    "غ"
  ],
  [
    [
      65233,
      65236
    ],
    1,
    "ف"
  ],
  [
    [
      65237,
      65240
    ],
    1,
    "ق"
  ],
  [
    [
      65241,
      65244
    ],
    1,
    "ك"
  ],
  [
    [
      65245,
      65248
    ],
    1,
    "ل"
  ],
  [
    [
      65249,
      65252
    ],
    1,
    "م"
  ],
  [
    [
      65253,
      65256
    ],
    1,
    "ن"
  ],
  [
    [
      65257,
      65260
    ],
    1,
    "ه"
  ],
  [
    [
      65261,
      65262
    ],
    1,
    "و"
  ],
  [
    [
      65263,
      65264
    ],
    1,
    "ى"
  ],
  [
    [
      65265,
      65268
    ],
    1,
    "ي"
  ],
  [
    [
      65269,
      65270
    ],
    1,
    "لآ"
  ],
  [
    [
      65271,
      65272
    ],
    1,
    "لأ"
  ],
  [
    [
      65273,
      65274
    ],
    1,
    "لإ"
  ],
  [
    [
      65275,
      65276
    ],
    1,
    "لا"
  ],
  [
    [
      65277,
      65278
    ],
    3
  ],
  [
    65279,
    7
  ],
  [
    65280,
    3
  ],
  [
    65281,
    5,
    "!"
  ],
  [
    65282,
    5,
    '"'
  ],
  [
    65283,
    5,
    "#"
  ],
  [
    65284,
    5,
    "$"
  ],
  [
    65285,
    5,
    "%"
  ],
  [
    65286,
    5,
    "&"
  ],
  [
    65287,
    5,
    "'"
  ],
  [
    65288,
    5,
    "("
  ],
  [
    65289,
    5,
    ")"
  ],
  [
    65290,
    5,
    "*"
  ],
  [
    65291,
    5,
    "+"
  ],
  [
    65292,
    5,
    ","
  ],
  [
    65293,
    1,
    "-"
  ],
  [
    65294,
    1,
    "."
  ],
  [
    65295,
    5,
    "/"
  ],
  [
    65296,
    1,
    "0"
  ],
  [
    65297,
    1,
    "1"
  ],
  [
    65298,
    1,
    "2"
  ],
  [
    65299,
    1,
    "3"
  ],
  [
    65300,
    1,
    "4"
  ],
  [
    65301,
    1,
    "5"
  ],
  [
    65302,
    1,
    "6"
  ],
  [
    65303,
    1,
    "7"
  ],
  [
    65304,
    1,
    "8"
  ],
  [
    65305,
    1,
    "9"
  ],
  [
    65306,
    5,
    ":"
  ],
  [
    65307,
    5,
    ";"
  ],
  [
    65308,
    5,
    "<"
  ],
  [
    65309,
    5,
    "="
  ],
  [
    65310,
    5,
    ">"
  ],
  [
    65311,
    5,
    "?"
  ],
  [
    65312,
    5,
    "@"
  ],
  [
    65313,
    1,
    "a"
  ],
  [
    65314,
    1,
    "b"
  ],
  [
    65315,
    1,
    "c"
  ],
  [
    65316,
    1,
    "d"
  ],
  [
    65317,
    1,
    "e"
  ],
  [
    65318,
    1,
    "f"
  ],
  [
    65319,
    1,
    "g"
  ],
  [
    65320,
    1,
    "h"
  ],
  [
    65321,
    1,
    "i"
  ],
  [
    65322,
    1,
    "j"
  ],
  [
    65323,
    1,
    "k"
  ],
  [
    65324,
    1,
    "l"
  ],
  [
    65325,
    1,
    "m"
  ],
  [
    65326,
    1,
    "n"
  ],
  [
    65327,
    1,
    "o"
  ],
  [
    65328,
    1,
    "p"
  ],
  [
    65329,
    1,
    "q"
  ],
  [
    65330,
    1,
    "r"
  ],
  [
    65331,
    1,
    "s"
  ],
  [
    65332,
    1,
    "t"
  ],
  [
    65333,
    1,
    "u"
  ],
  [
    65334,
    1,
    "v"
  ],
  [
    65335,
    1,
    "w"
  ],
  [
    65336,
    1,
    "x"
  ],
  [
    65337,
    1,
    "y"
  ],
  [
    65338,
    1,
    "z"
  ],
  [
    65339,
    5,
    "["
  ],
  [
    65340,
    5,
    "\\"
  ],
  [
    65341,
    5,
    "]"
  ],
  [
    65342,
    5,
    "^"
  ],
  [
    65343,
    5,
    "_"
  ],
  [
    65344,
    5,
    "`"
  ],
  [
    65345,
    1,
    "a"
  ],
  [
    65346,
    1,
    "b"
  ],
  [
    65347,
    1,
    "c"
  ],
  [
    65348,
    1,
    "d"
  ],
  [
    65349,
    1,
    "e"
  ],
  [
    65350,
    1,
    "f"
  ],
  [
    65351,
    1,
    "g"
  ],
  [
    65352,
    1,
    "h"
  ],
  [
    65353,
    1,
    "i"
  ],
  [
    65354,
    1,
    "j"
  ],
  [
    65355,
    1,
    "k"
  ],
  [
    65356,
    1,
    "l"
  ],
  [
    65357,
    1,
    "m"
  ],
  [
    65358,
    1,
    "n"
  ],
  [
    65359,
    1,
    "o"
  ],
  [
    65360,
    1,
    "p"
  ],
  [
    65361,
    1,
    "q"
  ],
  [
    65362,
    1,
    "r"
  ],
  [
    65363,
    1,
    "s"
  ],
  [
    65364,
    1,
    "t"
  ],
  [
    65365,
    1,
    "u"
  ],
  [
    65366,
    1,
    "v"
  ],
  [
    65367,
    1,
    "w"
  ],
  [
    65368,
    1,
    "x"
  ],
  [
    65369,
    1,
    "y"
  ],
  [
    65370,
    1,
    "z"
  ],
  [
    65371,
    5,
    "{"
  ],
  [
    65372,
    5,
    "|"
  ],
  [
    65373,
    5,
    "}"
  ],
  [
    65374,
    5,
    "~"
  ],
  [
    65375,
    1,
    "⦅"
  ],
  [
    65376,
    1,
    "⦆"
  ],
  [
    65377,
    1,
    "."
  ],
  [
    65378,
    1,
    "「"
  ],
  [
    65379,
    1,
    "」"
  ],
  [
    65380,
    1,
    "、"
  ],
  [
    65381,
    1,
    "・"
  ],
  [
    65382,
    1,
    "ヲ"
  ],
  [
    65383,
    1,
    "ァ"
  ],
  [
    65384,
    1,
    "ィ"
  ],
  [
    65385,
    1,
    "ゥ"
  ],
  [
    65386,
    1,
    "ェ"
  ],
  [
    65387,
    1,
    "ォ"
  ],
  [
    65388,
    1,
    "ャ"
  ],
  [
    65389,
    1,
    "ュ"
  ],
  [
    65390,
    1,
    "ョ"
  ],
  [
    65391,
    1,
    "ッ"
  ],
  [
    65392,
    1,
    "ー"
  ],
  [
    65393,
    1,
    "ア"
  ],
  [
    65394,
    1,
    "イ"
  ],
  [
    65395,
    1,
    "ウ"
  ],
  [
    65396,
    1,
    "エ"
  ],
  [
    65397,
    1,
    "オ"
  ],
  [
    65398,
    1,
    "カ"
  ],
  [
    65399,
    1,
    "キ"
  ],
  [
    65400,
    1,
    "ク"
  ],
  [
    65401,
    1,
    "ケ"
  ],
  [
    65402,
    1,
    "コ"
  ],
  [
    65403,
    1,
    "サ"
  ],
  [
    65404,
    1,
    "シ"
  ],
  [
    65405,
    1,
    "ス"
  ],
  [
    65406,
    1,
    "セ"
  ],
  [
    65407,
    1,
    "ソ"
  ],
  [
    65408,
    1,
    "タ"
  ],
  [
    65409,
    1,
    "チ"
  ],
  [
    65410,
    1,
    "ツ"
  ],
  [
    65411,
    1,
    "テ"
  ],
  [
    65412,
    1,
    "ト"
  ],
  [
    65413,
    1,
    "ナ"
  ],
  [
    65414,
    1,
    "ニ"
  ],
  [
    65415,
    1,
    "ヌ"
  ],
  [
    65416,
    1,
    "ネ"
  ],
  [
    65417,
    1,
    "ノ"
  ],
  [
    65418,
    1,
    "ハ"
  ],
  [
    65419,
    1,
    "ヒ"
  ],
  [
    65420,
    1,
    "フ"
  ],
  [
    65421,
    1,
    "ヘ"
  ],
  [
    65422,
    1,
    "ホ"
  ],
  [
    65423,
    1,
    "マ"
  ],
  [
    65424,
    1,
    "ミ"
  ],
  [
    65425,
    1,
    "ム"
  ],
  [
    65426,
    1,
    "メ"
  ],
  [
    65427,
    1,
    "モ"
  ],
  [
    65428,
    1,
    "ヤ"
  ],
  [
    65429,
    1,
    "ユ"
  ],
  [
    65430,
    1,
    "ヨ"
  ],
  [
    65431,
    1,
    "ラ"
  ],
  [
    65432,
    1,
    "リ"
  ],
  [
    65433,
    1,
    "ル"
  ],
  [
    65434,
    1,
    "レ"
  ],
  [
    65435,
    1,
    "ロ"
  ],
  [
    65436,
    1,
    "ワ"
  ],
  [
    65437,
    1,
    "ン"
  ],
  [
    65438,
    1,
    "゙"
  ],
  [
    65439,
    1,
    "゚"
  ],
  [
    65440,
    3
  ],
  [
    65441,
    1,
    "ᄀ"
  ],
  [
    65442,
    1,
    "ᄁ"
  ],
  [
    65443,
    1,
    "ᆪ"
  ],
  [
    65444,
    1,
    "ᄂ"
  ],
  [
    65445,
    1,
    "ᆬ"
  ],
  [
    65446,
    1,
    "ᆭ"
  ],
  [
    65447,
    1,
    "ᄃ"
  ],
  [
    65448,
    1,
    "ᄄ"
  ],
  [
    65449,
    1,
    "ᄅ"
  ],
  [
    65450,
    1,
    "ᆰ"
  ],
  [
    65451,
    1,
    "ᆱ"
  ],
  [
    65452,
    1,
    "ᆲ"
  ],
  [
    65453,
    1,
    "ᆳ"
  ],
  [
    65454,
    1,
    "ᆴ"
  ],
  [
    65455,
    1,
    "ᆵ"
  ],
  [
    65456,
    1,
    "ᄚ"
  ],
  [
    65457,
    1,
    "ᄆ"
  ],
  [
    65458,
    1,
    "ᄇ"
  ],
  [
    65459,
    1,
    "ᄈ"
  ],
  [
    65460,
    1,
    "ᄡ"
  ],
  [
    65461,
    1,
    "ᄉ"
  ],
  [
    65462,
    1,
    "ᄊ"
  ],
  [
    65463,
    1,
    "ᄋ"
  ],
  [
    65464,
    1,
    "ᄌ"
  ],
  [
    65465,
    1,
    "ᄍ"
  ],
  [
    65466,
    1,
    "ᄎ"
  ],
  [
    65467,
    1,
    "ᄏ"
  ],
  [
    65468,
    1,
    "ᄐ"
  ],
  [
    65469,
    1,
    "ᄑ"
  ],
  [
    65470,
    1,
    "ᄒ"
  ],
  [
    [
      65471,
      65473
    ],
    3
  ],
  [
    65474,
    1,
    "ᅡ"
  ],
  [
    65475,
    1,
    "ᅢ"
  ],
  [
    65476,
    1,
    "ᅣ"
  ],
  [
    65477,
    1,
    "ᅤ"
  ],
  [
    65478,
    1,
    "ᅥ"
  ],
  [
    65479,
    1,
    "ᅦ"
  ],
  [
    [
      65480,
      65481
    ],
    3
  ],
  [
    65482,
    1,
    "ᅧ"
  ],
  [
    65483,
    1,
    "ᅨ"
  ],
  [
    65484,
    1,
    "ᅩ"
  ],
  [
    65485,
    1,
    "ᅪ"
  ],
  [
    65486,
    1,
    "ᅫ"
  ],
  [
    65487,
    1,
    "ᅬ"
  ],
  [
    [
      65488,
      65489
    ],
    3
  ],
  [
    65490,
    1,
    "ᅭ"
  ],
  [
    65491,
    1,
    "ᅮ"
  ],
  [
    65492,
    1,
    "ᅯ"
  ],
  [
    65493,
    1,
    "ᅰ"
  ],
  [
    65494,
    1,
    "ᅱ"
  ],
  [
    65495,
    1,
    "ᅲ"
  ],
  [
    [
      65496,
      65497
    ],
    3
  ],
  [
    65498,
    1,
    "ᅳ"
  ],
  [
    65499,
    1,
    "ᅴ"
  ],
  [
    65500,
    1,
    "ᅵ"
  ],
  [
    [
      65501,
      65503
    ],
    3
  ],
  [
    65504,
    1,
    "¢"
  ],
  [
    65505,
    1,
    "£"
  ],
  [
    65506,
    1,
    "¬"
  ],
  [
    65507,
    5,
    " ̄"
  ],
  [
    65508,
    1,
    "¦"
  ],
  [
    65509,
    1,
    "¥"
  ],
  [
    65510,
    1,
    "₩"
  ],
  [
    65511,
    3
  ],
  [
    65512,
    1,
    "│"
  ],
  [
    65513,
    1,
    "←"
  ],
  [
    65514,
    1,
    "↑"
  ],
  [
    65515,
    1,
    "→"
  ],
  [
    65516,
    1,
    "↓"
  ],
  [
    65517,
    1,
    "■"
  ],
  [
    65518,
    1,
    "○"
  ],
  [
    [
      65519,
      65528
    ],
    3
  ],
  [
    [
      65529,
      65531
    ],
    3
  ],
  [
    65532,
    3
  ],
  [
    65533,
    3
  ],
  [
    [
      65534,
      65535
    ],
    3
  ],
  [
    [
      65536,
      65547
    ],
    2
  ],
  [
    65548,
    3
  ],
  [
    [
      65549,
      65574
    ],
    2
  ],
  [
    65575,
    3
  ],
  [
    [
      65576,
      65594
    ],
    2
  ],
  [
    65595,
    3
  ],
  [
    [
      65596,
      65597
    ],
    2
  ],
  [
    65598,
    3
  ],
  [
    [
      65599,
      65613
    ],
    2
  ],
  [
    [
      65614,
      65615
    ],
    3
  ],
  [
    [
      65616,
      65629
    ],
    2
  ],
  [
    [
      65630,
      65663
    ],
    3
  ],
  [
    [
      65664,
      65786
    ],
    2
  ],
  [
    [
      65787,
      65791
    ],
    3
  ],
  [
    [
      65792,
      65794
    ],
    2
  ],
  [
    [
      65795,
      65798
    ],
    3
  ],
  [
    [
      65799,
      65843
    ],
    2
  ],
  [
    [
      65844,
      65846
    ],
    3
  ],
  [
    [
      65847,
      65855
    ],
    2
  ],
  [
    [
      65856,
      65930
    ],
    2
  ],
  [
    [
      65931,
      65932
    ],
    2
  ],
  [
    [
      65933,
      65934
    ],
    2
  ],
  [
    65935,
    3
  ],
  [
    [
      65936,
      65947
    ],
    2
  ],
  [
    65948,
    2
  ],
  [
    [
      65949,
      65951
    ],
    3
  ],
  [
    65952,
    2
  ],
  [
    [
      65953,
      65999
    ],
    3
  ],
  [
    [
      66e3,
      66044
    ],
    2
  ],
  [
    66045,
    2
  ],
  [
    [
      66046,
      66175
    ],
    3
  ],
  [
    [
      66176,
      66204
    ],
    2
  ],
  [
    [
      66205,
      66207
    ],
    3
  ],
  [
    [
      66208,
      66256
    ],
    2
  ],
  [
    [
      66257,
      66271
    ],
    3
  ],
  [
    66272,
    2
  ],
  [
    [
      66273,
      66299
    ],
    2
  ],
  [
    [
      66300,
      66303
    ],
    3
  ],
  [
    [
      66304,
      66334
    ],
    2
  ],
  [
    66335,
    2
  ],
  [
    [
      66336,
      66339
    ],
    2
  ],
  [
    [
      66340,
      66348
    ],
    3
  ],
  [
    [
      66349,
      66351
    ],
    2
  ],
  [
    [
      66352,
      66368
    ],
    2
  ],
  [
    66369,
    2
  ],
  [
    [
      66370,
      66377
    ],
    2
  ],
  [
    66378,
    2
  ],
  [
    [
      66379,
      66383
    ],
    3
  ],
  [
    [
      66384,
      66426
    ],
    2
  ],
  [
    [
      66427,
      66431
    ],
    3
  ],
  [
    [
      66432,
      66461
    ],
    2
  ],
  [
    66462,
    3
  ],
  [
    66463,
    2
  ],
  [
    [
      66464,
      66499
    ],
    2
  ],
  [
    [
      66500,
      66503
    ],
    3
  ],
  [
    [
      66504,
      66511
    ],
    2
  ],
  [
    [
      66512,
      66517
    ],
    2
  ],
  [
    [
      66518,
      66559
    ],
    3
  ],
  [
    66560,
    1,
    "𐐨"
  ],
  [
    66561,
    1,
    "𐐩"
  ],
  [
    66562,
    1,
    "𐐪"
  ],
  [
    66563,
    1,
    "𐐫"
  ],
  [
    66564,
    1,
    "𐐬"
  ],
  [
    66565,
    1,
    "𐐭"
  ],
  [
    66566,
    1,
    "𐐮"
  ],
  [
    66567,
    1,
    "𐐯"
  ],
  [
    66568,
    1,
    "𐐰"
  ],
  [
    66569,
    1,
    "𐐱"
  ],
  [
    66570,
    1,
    "𐐲"
  ],
  [
    66571,
    1,
    "𐐳"
  ],
  [
    66572,
    1,
    "𐐴"
  ],
  [
    66573,
    1,
    "𐐵"
  ],
  [
    66574,
    1,
    "𐐶"
  ],
  [
    66575,
    1,
    "𐐷"
  ],
  [
    66576,
    1,
    "𐐸"
  ],
  [
    66577,
    1,
    "𐐹"
  ],
  [
    66578,
    1,
    "𐐺"
  ],
  [
    66579,
    1,
    "𐐻"
  ],
  [
    66580,
    1,
    "𐐼"
  ],
  [
    66581,
    1,
    "𐐽"
  ],
  [
    66582,
    1,
    "𐐾"
  ],
  [
    66583,
    1,
    "𐐿"
  ],
  [
    66584,
    1,
    "𐑀"
  ],
  [
    66585,
    1,
    "𐑁"
  ],
  [
    66586,
    1,
    "𐑂"
  ],
  [
    66587,
    1,
    "𐑃"
  ],
  [
    66588,
    1,
    "𐑄"
  ],
  [
    66589,
    1,
    "𐑅"
  ],
  [
    66590,
    1,
    "𐑆"
  ],
  [
    66591,
    1,
    "𐑇"
  ],
  [
    66592,
    1,
    "𐑈"
  ],
  [
    66593,
    1,
    "𐑉"
  ],
  [
    66594,
    1,
    "𐑊"
  ],
  [
    66595,
    1,
    "𐑋"
  ],
  [
    66596,
    1,
    "𐑌"
  ],
  [
    66597,
    1,
    "𐑍"
  ],
  [
    66598,
    1,
    "𐑎"
  ],
  [
    66599,
    1,
    "𐑏"
  ],
  [
    [
      66600,
      66637
    ],
    2
  ],
  [
    [
      66638,
      66717
    ],
    2
  ],
  [
    [
      66718,
      66719
    ],
    3
  ],
  [
    [
      66720,
      66729
    ],
    2
  ],
  [
    [
      66730,
      66735
    ],
    3
  ],
  [
    66736,
    1,
    "𐓘"
  ],
  [
    66737,
    1,
    "𐓙"
  ],
  [
    66738,
    1,
    "𐓚"
  ],
  [
    66739,
    1,
    "𐓛"
  ],
  [
    66740,
    1,
    "𐓜"
  ],
  [
    66741,
    1,
    "𐓝"
  ],
  [
    66742,
    1,
    "𐓞"
  ],
  [
    66743,
    1,
    "𐓟"
  ],
  [
    66744,
    1,
    "𐓠"
  ],
  [
    66745,
    1,
    "𐓡"
  ],
  [
    66746,
    1,
    "𐓢"
  ],
  [
    66747,
    1,
    "𐓣"
  ],
  [
    66748,
    1,
    "𐓤"
  ],
  [
    66749,
    1,
    "𐓥"
  ],
  [
    66750,
    1,
    "𐓦"
  ],
  [
    66751,
    1,
    "𐓧"
  ],
  [
    66752,
    1,
    "𐓨"
  ],
  [
    66753,
    1,
    "𐓩"
  ],
  [
    66754,
    1,
    "𐓪"
  ],
  [
    66755,
    1,
    "𐓫"
  ],
  [
    66756,
    1,
    "𐓬"
  ],
  [
    66757,
    1,
    "𐓭"
  ],
  [
    66758,
    1,
    "𐓮"
  ],
  [
    66759,
    1,
    "𐓯"
  ],
  [
    66760,
    1,
    "𐓰"
  ],
  [
    66761,
    1,
    "𐓱"
  ],
  [
    66762,
    1,
    "𐓲"
  ],
  [
    66763,
    1,
    "𐓳"
  ],
  [
    66764,
    1,
    "𐓴"
  ],
  [
    66765,
    1,
    "𐓵"
  ],
  [
    66766,
    1,
    "𐓶"
  ],
  [
    66767,
    1,
    "𐓷"
  ],
  [
    66768,
    1,
    "𐓸"
  ],
  [
    66769,
    1,
    "𐓹"
  ],
  [
    66770,
    1,
    "𐓺"
  ],
  [
    66771,
    1,
    "𐓻"
  ],
  [
    [
      66772,
      66775
    ],
    3
  ],
  [
    [
      66776,
      66811
    ],
    2
  ],
  [
    [
      66812,
      66815
    ],
    3
  ],
  [
    [
      66816,
      66855
    ],
    2
  ],
  [
    [
      66856,
      66863
    ],
    3
  ],
  [
    [
      66864,
      66915
    ],
    2
  ],
  [
    [
      66916,
      66926
    ],
    3
  ],
  [
    66927,
    2
  ],
  [
    66928,
    1,
    "𐖗"
  ],
  [
    66929,
    1,
    "𐖘"
  ],
  [
    66930,
    1,
    "𐖙"
  ],
  [
    66931,
    1,
    "𐖚"
  ],
  [
    66932,
    1,
    "𐖛"
  ],
  [
    66933,
    1,
    "𐖜"
  ],
  [
    66934,
    1,
    "𐖝"
  ],
  [
    66935,
    1,
    "𐖞"
  ],
  [
    66936,
    1,
    "𐖟"
  ],
  [
    66937,
    1,
    "𐖠"
  ],
  [
    66938,
    1,
    "𐖡"
  ],
  [
    66939,
    3
  ],
  [
    66940,
    1,
    "𐖣"
  ],
  [
    66941,
    1,
    "𐖤"
  ],
  [
    66942,
    1,
    "𐖥"
  ],
  [
    66943,
    1,
    "𐖦"
  ],
  [
    66944,
    1,
    "𐖧"
  ],
  [
    66945,
    1,
    "𐖨"
  ],
  [
    66946,
    1,
    "𐖩"
  ],
  [
    66947,
    1,
    "𐖪"
  ],
  [
    66948,
    1,
    "𐖫"
  ],
  [
    66949,
    1,
    "𐖬"
  ],
  [
    66950,
    1,
    "𐖭"
  ],
  [
    66951,
    1,
    "𐖮"
  ],
  [
    66952,
    1,
    "𐖯"
  ],
  [
    66953,
    1,
    "𐖰"
  ],
  [
    66954,
    1,
    "𐖱"
  ],
  [
    66955,
    3
  ],
  [
    66956,
    1,
    "𐖳"
  ],
  [
    66957,
    1,
    "𐖴"
  ],
  [
    66958,
    1,
    "𐖵"
  ],
  [
    66959,
    1,
    "𐖶"
  ],
  [
    66960,
    1,
    "𐖷"
  ],
  [
    66961,
    1,
    "𐖸"
  ],
  [
    66962,
    1,
    "𐖹"
  ],
  [
    66963,
    3
  ],
  [
    66964,
    1,
    "𐖻"
  ],
  [
    66965,
    1,
    "𐖼"
  ],
  [
    66966,
    3
  ],
  [
    [
      66967,
      66977
    ],
    2
  ],
  [
    66978,
    3
  ],
  [
    [
      66979,
      66993
    ],
    2
  ],
  [
    66994,
    3
  ],
  [
    [
      66995,
      67001
    ],
    2
  ],
  [
    67002,
    3
  ],
  [
    [
      67003,
      67004
    ],
    2
  ],
  [
    [
      67005,
      67071
    ],
    3
  ],
  [
    [
      67072,
      67382
    ],
    2
  ],
  [
    [
      67383,
      67391
    ],
    3
  ],
  [
    [
      67392,
      67413
    ],
    2
  ],
  [
    [
      67414,
      67423
    ],
    3
  ],
  [
    [
      67424,
      67431
    ],
    2
  ],
  [
    [
      67432,
      67455
    ],
    3
  ],
  [
    67456,
    2
  ],
  [
    67457,
    1,
    "ː"
  ],
  [
    67458,
    1,
    "ˑ"
  ],
  [
    67459,
    1,
    "æ"
  ],
  [
    67460,
    1,
    "ʙ"
  ],
  [
    67461,
    1,
    "ɓ"
  ],
  [
    67462,
    3
  ],
  [
    67463,
    1,
    "ʣ"
  ],
  [
    67464,
    1,
    "ꭦ"
  ],
  [
    67465,
    1,
    "ʥ"
  ],
  [
    67466,
    1,
    "ʤ"
  ],
  [
    67467,
    1,
    "ɖ"
  ],
  [
    67468,
    1,
    "ɗ"
  ],
  [
    67469,
    1,
    "ᶑ"
  ],
  [
    67470,
    1,
    "ɘ"
  ],
  [
    67471,
    1,
    "ɞ"
  ],
  [
    67472,
    1,
    "ʩ"
  ],
  [
    67473,
    1,
    "ɤ"
  ],
  [
    67474,
    1,
    "ɢ"
  ],
  [
    67475,
    1,
    "ɠ"
  ],
  [
    67476,
    1,
    "ʛ"
  ],
  [
    67477,
    1,
    "ħ"
  ],
  [
    67478,
    1,
    "ʜ"
  ],
  [
    67479,
    1,
    "ɧ"
  ],
  [
    67480,
    1,
    "ʄ"
  ],
  [
    67481,
    1,
    "ʪ"
  ],
  [
    67482,
    1,
    "ʫ"
  ],
  [
    67483,
    1,
    "ɬ"
  ],
  [
    67484,
    1,
    "𝼄"
  ],
  [
    67485,
    1,
    "ꞎ"
  ],
  [
    67486,
    1,
    "ɮ"
  ],
  [
    67487,
    1,
    "𝼅"
  ],
  [
    67488,
    1,
    "ʎ"
  ],
  [
    67489,
    1,
    "𝼆"
  ],
  [
    67490,
    1,
    "ø"
  ],
  [
    67491,
    1,
    "ɶ"
  ],
  [
    67492,
    1,
    "ɷ"
  ],
  [
    67493,
    1,
    "q"
  ],
  [
    67494,
    1,
    "ɺ"
  ],
  [
    67495,
    1,
    "𝼈"
  ],
  [
    67496,
    1,
    "ɽ"
  ],
  [
    67497,
    1,
    "ɾ"
  ],
  [
    67498,
    1,
    "ʀ"
  ],
  [
    67499,
    1,
    "ʨ"
  ],
  [
    67500,
    1,
    "ʦ"
  ],
  [
    67501,
    1,
    "ꭧ"
  ],
  [
    67502,
    1,
    "ʧ"
  ],
  [
    67503,
    1,
    "ʈ"
  ],
  [
    67504,
    1,
    "ⱱ"
  ],
  [
    67505,
    3
  ],
  [
    67506,
    1,
    "ʏ"
  ],
  [
    67507,
    1,
    "ʡ"
  ],
  [
    67508,
    1,
    "ʢ"
  ],
  [
    67509,
    1,
    "ʘ"
  ],
  [
    67510,
    1,
    "ǀ"
  ],
  [
    67511,
    1,
    "ǁ"
  ],
  [
    67512,
    1,
    "ǂ"
  ],
  [
    67513,
    1,
    "𝼊"
  ],
  [
    67514,
    1,
    "𝼞"
  ],
  [
    [
      67515,
      67583
    ],
    3
  ],
  [
    [
      67584,
      67589
    ],
    2
  ],
  [
    [
      67590,
      67591
    ],
    3
  ],
  [
    67592,
    2
  ],
  [
    67593,
    3
  ],
  [
    [
      67594,
      67637
    ],
    2
  ],
  [
    67638,
    3
  ],
  [
    [
      67639,
      67640
    ],
    2
  ],
  [
    [
      67641,
      67643
    ],
    3
  ],
  [
    67644,
    2
  ],
  [
    [
      67645,
      67646
    ],
    3
  ],
  [
    67647,
    2
  ],
  [
    [
      67648,
      67669
    ],
    2
  ],
  [
    67670,
    3
  ],
  [
    [
      67671,
      67679
    ],
    2
  ],
  [
    [
      67680,
      67702
    ],
    2
  ],
  [
    [
      67703,
      67711
    ],
    2
  ],
  [
    [
      67712,
      67742
    ],
    2
  ],
  [
    [
      67743,
      67750
    ],
    3
  ],
  [
    [
      67751,
      67759
    ],
    2
  ],
  [
    [
      67760,
      67807
    ],
    3
  ],
  [
    [
      67808,
      67826
    ],
    2
  ],
  [
    67827,
    3
  ],
  [
    [
      67828,
      67829
    ],
    2
  ],
  [
    [
      67830,
      67834
    ],
    3
  ],
  [
    [
      67835,
      67839
    ],
    2
  ],
  [
    [
      67840,
      67861
    ],
    2
  ],
  [
    [
      67862,
      67865
    ],
    2
  ],
  [
    [
      67866,
      67867
    ],
    2
  ],
  [
    [
      67868,
      67870
    ],
    3
  ],
  [
    67871,
    2
  ],
  [
    [
      67872,
      67897
    ],
    2
  ],
  [
    [
      67898,
      67902
    ],
    3
  ],
  [
    67903,
    2
  ],
  [
    [
      67904,
      67967
    ],
    3
  ],
  [
    [
      67968,
      68023
    ],
    2
  ],
  [
    [
      68024,
      68027
    ],
    3
  ],
  [
    [
      68028,
      68029
    ],
    2
  ],
  [
    [
      68030,
      68031
    ],
    2
  ],
  [
    [
      68032,
      68047
    ],
    2
  ],
  [
    [
      68048,
      68049
    ],
    3
  ],
  [
    [
      68050,
      68095
    ],
    2
  ],
  [
    [
      68096,
      68099
    ],
    2
  ],
  [
    68100,
    3
  ],
  [
    [
      68101,
      68102
    ],
    2
  ],
  [
    [
      68103,
      68107
    ],
    3
  ],
  [
    [
      68108,
      68115
    ],
    2
  ],
  [
    68116,
    3
  ],
  [
    [
      68117,
      68119
    ],
    2
  ],
  [
    68120,
    3
  ],
  [
    [
      68121,
      68147
    ],
    2
  ],
  [
    [
      68148,
      68149
    ],
    2
  ],
  [
    [
      68150,
      68151
    ],
    3
  ],
  [
    [
      68152,
      68154
    ],
    2
  ],
  [
    [
      68155,
      68158
    ],
    3
  ],
  [
    68159,
    2
  ],
  [
    [
      68160,
      68167
    ],
    2
  ],
  [
    68168,
    2
  ],
  [
    [
      68169,
      68175
    ],
    3
  ],
  [
    [
      68176,
      68184
    ],
    2
  ],
  [
    [
      68185,
      68191
    ],
    3
  ],
  [
    [
      68192,
      68220
    ],
    2
  ],
  [
    [
      68221,
      68223
    ],
    2
  ],
  [
    [
      68224,
      68252
    ],
    2
  ],
  [
    [
      68253,
      68255
    ],
    2
  ],
  [
    [
      68256,
      68287
    ],
    3
  ],
  [
    [
      68288,
      68295
    ],
    2
  ],
  [
    68296,
    2
  ],
  [
    [
      68297,
      68326
    ],
    2
  ],
  [
    [
      68327,
      68330
    ],
    3
  ],
  [
    [
      68331,
      68342
    ],
    2
  ],
  [
    [
      68343,
      68351
    ],
    3
  ],
  [
    [
      68352,
      68405
    ],
    2
  ],
  [
    [
      68406,
      68408
    ],
    3
  ],
  [
    [
      68409,
      68415
    ],
    2
  ],
  [
    [
      68416,
      68437
    ],
    2
  ],
  [
    [
      68438,
      68439
    ],
    3
  ],
  [
    [
      68440,
      68447
    ],
    2
  ],
  [
    [
      68448,
      68466
    ],
    2
  ],
  [
    [
      68467,
      68471
    ],
    3
  ],
  [
    [
      68472,
      68479
    ],
    2
  ],
  [
    [
      68480,
      68497
    ],
    2
  ],
  [
    [
      68498,
      68504
    ],
    3
  ],
  [
    [
      68505,
      68508
    ],
    2
  ],
  [
    [
      68509,
      68520
    ],
    3
  ],
  [
    [
      68521,
      68527
    ],
    2
  ],
  [
    [
      68528,
      68607
    ],
    3
  ],
  [
    [
      68608,
      68680
    ],
    2
  ],
  [
    [
      68681,
      68735
    ],
    3
  ],
  [
    68736,
    1,
    "𐳀"
  ],
  [
    68737,
    1,
    "𐳁"
  ],
  [
    68738,
    1,
    "𐳂"
  ],
  [
    68739,
    1,
    "𐳃"
  ],
  [
    68740,
    1,
    "𐳄"
  ],
  [
    68741,
    1,
    "𐳅"
  ],
  [
    68742,
    1,
    "𐳆"
  ],
  [
    68743,
    1,
    "𐳇"
  ],
  [
    68744,
    1,
    "𐳈"
  ],
  [
    68745,
    1,
    "𐳉"
  ],
  [
    68746,
    1,
    "𐳊"
  ],
  [
    68747,
    1,
    "𐳋"
  ],
  [
    68748,
    1,
    "𐳌"
  ],
  [
    68749,
    1,
    "𐳍"
  ],
  [
    68750,
    1,
    "𐳎"
  ],
  [
    68751,
    1,
    "𐳏"
  ],
  [
    68752,
    1,
    "𐳐"
  ],
  [
    68753,
    1,
    "𐳑"
  ],
  [
    68754,
    1,
    "𐳒"
  ],
  [
    68755,
    1,
    "𐳓"
  ],
  [
    68756,
    1,
    "𐳔"
  ],
  [
    68757,
    1,
    "𐳕"
  ],
  [
    68758,
    1,
    "𐳖"
  ],
  [
    68759,
    1,
    "𐳗"
  ],
  [
    68760,
    1,
    "𐳘"
  ],
  [
    68761,
    1,
    "𐳙"
  ],
  [
    68762,
    1,
    "𐳚"
  ],
  [
    68763,
    1,
    "𐳛"
  ],
  [
    68764,
    1,
    "𐳜"
  ],
  [
    68765,
    1,
    "𐳝"
  ],
  [
    68766,
    1,
    "𐳞"
  ],
  [
    68767,
    1,
    "𐳟"
  ],
  [
    68768,
    1,
    "𐳠"
  ],
  [
    68769,
    1,
    "𐳡"
  ],
  [
    68770,
    1,
    "𐳢"
  ],
  [
    68771,
    1,
    "𐳣"
  ],
  [
    68772,
    1,
    "𐳤"
  ],
  [
    68773,
    1,
    "𐳥"
  ],
  [
    68774,
    1,
    "𐳦"
  ],
  [
    68775,
    1,
    "𐳧"
  ],
  [
    68776,
    1,
    "𐳨"
  ],
  [
    68777,
    1,
    "𐳩"
  ],
  [
    68778,
    1,
    "𐳪"
  ],
  [
    68779,
    1,
    "𐳫"
  ],
  [
    68780,
    1,
    "𐳬"
  ],
  [
    68781,
    1,
    "𐳭"
  ],
  [
    68782,
    1,
    "𐳮"
  ],
  [
    68783,
    1,
    "𐳯"
  ],
  [
    68784,
    1,
    "𐳰"
  ],
  [
    68785,
    1,
    "𐳱"
  ],
  [
    68786,
    1,
    "𐳲"
  ],
  [
    [
      68787,
      68799
    ],
    3
  ],
  [
    [
      68800,
      68850
    ],
    2
  ],
  [
    [
      68851,
      68857
    ],
    3
  ],
  [
    [
      68858,
      68863
    ],
    2
  ],
  [
    [
      68864,
      68903
    ],
    2
  ],
  [
    [
      68904,
      68911
    ],
    3
  ],
  [
    [
      68912,
      68921
    ],
    2
  ],
  [
    [
      68922,
      69215
    ],
    3
  ],
  [
    [
      69216,
      69246
    ],
    2
  ],
  [
    69247,
    3
  ],
  [
    [
      69248,
      69289
    ],
    2
  ],
  [
    69290,
    3
  ],
  [
    [
      69291,
      69292
    ],
    2
  ],
  [
    69293,
    2
  ],
  [
    [
      69294,
      69295
    ],
    3
  ],
  [
    [
      69296,
      69297
    ],
    2
  ],
  [
    [
      69298,
      69372
    ],
    3
  ],
  [
    [
      69373,
      69375
    ],
    2
  ],
  [
    [
      69376,
      69404
    ],
    2
  ],
  [
    [
      69405,
      69414
    ],
    2
  ],
  [
    69415,
    2
  ],
  [
    [
      69416,
      69423
    ],
    3
  ],
  [
    [
      69424,
      69456
    ],
    2
  ],
  [
    [
      69457,
      69465
    ],
    2
  ],
  [
    [
      69466,
      69487
    ],
    3
  ],
  [
    [
      69488,
      69509
    ],
    2
  ],
  [
    [
      69510,
      69513
    ],
    2
  ],
  [
    [
      69514,
      69551
    ],
    3
  ],
  [
    [
      69552,
      69572
    ],
    2
  ],
  [
    [
      69573,
      69579
    ],
    2
  ],
  [
    [
      69580,
      69599
    ],
    3
  ],
  [
    [
      69600,
      69622
    ],
    2
  ],
  [
    [
      69623,
      69631
    ],
    3
  ],
  [
    [
      69632,
      69702
    ],
    2
  ],
  [
    [
      69703,
      69709
    ],
    2
  ],
  [
    [
      69710,
      69713
    ],
    3
  ],
  [
    [
      69714,
      69733
    ],
    2
  ],
  [
    [
      69734,
      69743
    ],
    2
  ],
  [
    [
      69744,
      69749
    ],
    2
  ],
  [
    [
      69750,
      69758
    ],
    3
  ],
  [
    69759,
    2
  ],
  [
    [
      69760,
      69818
    ],
    2
  ],
  [
    [
      69819,
      69820
    ],
    2
  ],
  [
    69821,
    3
  ],
  [
    [
      69822,
      69825
    ],
    2
  ],
  [
    69826,
    2
  ],
  [
    [
      69827,
      69836
    ],
    3
  ],
  [
    69837,
    3
  ],
  [
    [
      69838,
      69839
    ],
    3
  ],
  [
    [
      69840,
      69864
    ],
    2
  ],
  [
    [
      69865,
      69871
    ],
    3
  ],
  [
    [
      69872,
      69881
    ],
    2
  ],
  [
    [
      69882,
      69887
    ],
    3
  ],
  [
    [
      69888,
      69940
    ],
    2
  ],
  [
    69941,
    3
  ],
  [
    [
      69942,
      69951
    ],
    2
  ],
  [
    [
      69952,
      69955
    ],
    2
  ],
  [
    [
      69956,
      69958
    ],
    2
  ],
  [
    69959,
    2
  ],
  [
    [
      69960,
      69967
    ],
    3
  ],
  [
    [
      69968,
      70003
    ],
    2
  ],
  [
    [
      70004,
      70005
    ],
    2
  ],
  [
    70006,
    2
  ],
  [
    [
      70007,
      70015
    ],
    3
  ],
  [
    [
      70016,
      70084
    ],
    2
  ],
  [
    [
      70085,
      70088
    ],
    2
  ],
  [
    [
      70089,
      70092
    ],
    2
  ],
  [
    70093,
    2
  ],
  [
    [
      70094,
      70095
    ],
    2
  ],
  [
    [
      70096,
      70105
    ],
    2
  ],
  [
    70106,
    2
  ],
  [
    70107,
    2
  ],
  [
    70108,
    2
  ],
  [
    [
      70109,
      70111
    ],
    2
  ],
  [
    70112,
    3
  ],
  [
    [
      70113,
      70132
    ],
    2
  ],
  [
    [
      70133,
      70143
    ],
    3
  ],
  [
    [
      70144,
      70161
    ],
    2
  ],
  [
    70162,
    3
  ],
  [
    [
      70163,
      70199
    ],
    2
  ],
  [
    [
      70200,
      70205
    ],
    2
  ],
  [
    70206,
    2
  ],
  [
    [
      70207,
      70209
    ],
    2
  ],
  [
    [
      70210,
      70271
    ],
    3
  ],
  [
    [
      70272,
      70278
    ],
    2
  ],
  [
    70279,
    3
  ],
  [
    70280,
    2
  ],
  [
    70281,
    3
  ],
  [
    [
      70282,
      70285
    ],
    2
  ],
  [
    70286,
    3
  ],
  [
    [
      70287,
      70301
    ],
    2
  ],
  [
    70302,
    3
  ],
  [
    [
      70303,
      70312
    ],
    2
  ],
  [
    70313,
    2
  ],
  [
    [
      70314,
      70319
    ],
    3
  ],
  [
    [
      70320,
      70378
    ],
    2
  ],
  [
    [
      70379,
      70383
    ],
    3
  ],
  [
    [
      70384,
      70393
    ],
    2
  ],
  [
    [
      70394,
      70399
    ],
    3
  ],
  [
    70400,
    2
  ],
  [
    [
      70401,
      70403
    ],
    2
  ],
  [
    70404,
    3
  ],
  [
    [
      70405,
      70412
    ],
    2
  ],
  [
    [
      70413,
      70414
    ],
    3
  ],
  [
    [
      70415,
      70416
    ],
    2
  ],
  [
    [
      70417,
      70418
    ],
    3
  ],
  [
    [
      70419,
      70440
    ],
    2
  ],
  [
    70441,
    3
  ],
  [
    [
      70442,
      70448
    ],
    2
  ],
  [
    70449,
    3
  ],
  [
    [
      70450,
      70451
    ],
    2
  ],
  [
    70452,
    3
  ],
  [
    [
      70453,
      70457
    ],
    2
  ],
  [
    70458,
    3
  ],
  [
    70459,
    2
  ],
  [
    [
      70460,
      70468
    ],
    2
  ],
  [
    [
      70469,
      70470
    ],
    3
  ],
  [
    [
      70471,
      70472
    ],
    2
  ],
  [
    [
      70473,
      70474
    ],
    3
  ],
  [
    [
      70475,
      70477
    ],
    2
  ],
  [
    [
      70478,
      70479
    ],
    3
  ],
  [
    70480,
    2
  ],
  [
    [
      70481,
      70486
    ],
    3
  ],
  [
    70487,
    2
  ],
  [
    [
      70488,
      70492
    ],
    3
  ],
  [
    [
      70493,
      70499
    ],
    2
  ],
  [
    [
      70500,
      70501
    ],
    3
  ],
  [
    [
      70502,
      70508
    ],
    2
  ],
  [
    [
      70509,
      70511
    ],
    3
  ],
  [
    [
      70512,
      70516
    ],
    2
  ],
  [
    [
      70517,
      70655
    ],
    3
  ],
  [
    [
      70656,
      70730
    ],
    2
  ],
  [
    [
      70731,
      70735
    ],
    2
  ],
  [
    [
      70736,
      70745
    ],
    2
  ],
  [
    70746,
    2
  ],
  [
    70747,
    2
  ],
  [
    70748,
    3
  ],
  [
    70749,
    2
  ],
  [
    70750,
    2
  ],
  [
    70751,
    2
  ],
  [
    [
      70752,
      70753
    ],
    2
  ],
  [
    [
      70754,
      70783
    ],
    3
  ],
  [
    [
      70784,
      70853
    ],
    2
  ],
  [
    70854,
    2
  ],
  [
    70855,
    2
  ],
  [
    [
      70856,
      70863
    ],
    3
  ],
  [
    [
      70864,
      70873
    ],
    2
  ],
  [
    [
      70874,
      71039
    ],
    3
  ],
  [
    [
      71040,
      71093
    ],
    2
  ],
  [
    [
      71094,
      71095
    ],
    3
  ],
  [
    [
      71096,
      71104
    ],
    2
  ],
  [
    [
      71105,
      71113
    ],
    2
  ],
  [
    [
      71114,
      71127
    ],
    2
  ],
  [
    [
      71128,
      71133
    ],
    2
  ],
  [
    [
      71134,
      71167
    ],
    3
  ],
  [
    [
      71168,
      71232
    ],
    2
  ],
  [
    [
      71233,
      71235
    ],
    2
  ],
  [
    71236,
    2
  ],
  [
    [
      71237,
      71247
    ],
    3
  ],
  [
    [
      71248,
      71257
    ],
    2
  ],
  [
    [
      71258,
      71263
    ],
    3
  ],
  [
    [
      71264,
      71276
    ],
    2
  ],
  [
    [
      71277,
      71295
    ],
    3
  ],
  [
    [
      71296,
      71351
    ],
    2
  ],
  [
    71352,
    2
  ],
  [
    71353,
    2
  ],
  [
    [
      71354,
      71359
    ],
    3
  ],
  [
    [
      71360,
      71369
    ],
    2
  ],
  [
    [
      71370,
      71423
    ],
    3
  ],
  [
    [
      71424,
      71449
    ],
    2
  ],
  [
    71450,
    2
  ],
  [
    [
      71451,
      71452
    ],
    3
  ],
  [
    [
      71453,
      71467
    ],
    2
  ],
  [
    [
      71468,
      71471
    ],
    3
  ],
  [
    [
      71472,
      71481
    ],
    2
  ],
  [
    [
      71482,
      71487
    ],
    2
  ],
  [
    [
      71488,
      71494
    ],
    2
  ],
  [
    [
      71495,
      71679
    ],
    3
  ],
  [
    [
      71680,
      71738
    ],
    2
  ],
  [
    71739,
    2
  ],
  [
    [
      71740,
      71839
    ],
    3
  ],
  [
    71840,
    1,
    "𑣀"
  ],
  [
    71841,
    1,
    "𑣁"
  ],
  [
    71842,
    1,
    "𑣂"
  ],
  [
    71843,
    1,
    "𑣃"
  ],
  [
    71844,
    1,
    "𑣄"
  ],
  [
    71845,
    1,
    "𑣅"
  ],
  [
    71846,
    1,
    "𑣆"
  ],
  [
    71847,
    1,
    "𑣇"
  ],
  [
    71848,
    1,
    "𑣈"
  ],
  [
    71849,
    1,
    "𑣉"
  ],
  [
    71850,
    1,
    "𑣊"
  ],
  [
    71851,
    1,
    "𑣋"
  ],
  [
    71852,
    1,
    "𑣌"
  ],
  [
    71853,
    1,
    "𑣍"
  ],
  [
    71854,
    1,
    "𑣎"
  ],
  [
    71855,
    1,
    "𑣏"
  ],
  [
    71856,
    1,
    "𑣐"
  ],
  [
    71857,
    1,
    "𑣑"
  ],
  [
    71858,
    1,
    "𑣒"
  ],
  [
    71859,
    1,
    "𑣓"
  ],
  [
    71860,
    1,
    "𑣔"
  ],
  [
    71861,
    1,
    "𑣕"
  ],
  [
    71862,
    1,
    "𑣖"
  ],
  [
    71863,
    1,
    "𑣗"
  ],
  [
    71864,
    1,
    "𑣘"
  ],
  [
    71865,
    1,
    "𑣙"
  ],
  [
    71866,
    1,
    "𑣚"
  ],
  [
    71867,
    1,
    "𑣛"
  ],
  [
    71868,
    1,
    "𑣜"
  ],
  [
    71869,
    1,
    "𑣝"
  ],
  [
    71870,
    1,
    "𑣞"
  ],
  [
    71871,
    1,
    "𑣟"
  ],
  [
    [
      71872,
      71913
    ],
    2
  ],
  [
    [
      71914,
      71922
    ],
    2
  ],
  [
    [
      71923,
      71934
    ],
    3
  ],
  [
    71935,
    2
  ],
  [
    [
      71936,
      71942
    ],
    2
  ],
  [
    [
      71943,
      71944
    ],
    3
  ],
  [
    71945,
    2
  ],
  [
    [
      71946,
      71947
    ],
    3
  ],
  [
    [
      71948,
      71955
    ],
    2
  ],
  [
    71956,
    3
  ],
  [
    [
      71957,
      71958
    ],
    2
  ],
  [
    71959,
    3
  ],
  [
    [
      71960,
      71989
    ],
    2
  ],
  [
    71990,
    3
  ],
  [
    [
      71991,
      71992
    ],
    2
  ],
  [
    [
      71993,
      71994
    ],
    3
  ],
  [
    [
      71995,
      72003
    ],
    2
  ],
  [
    [
      72004,
      72006
    ],
    2
  ],
  [
    [
      72007,
      72015
    ],
    3
  ],
  [
    [
      72016,
      72025
    ],
    2
  ],
  [
    [
      72026,
      72095
    ],
    3
  ],
  [
    [
      72096,
      72103
    ],
    2
  ],
  [
    [
      72104,
      72105
    ],
    3
  ],
  [
    [
      72106,
      72151
    ],
    2
  ],
  [
    [
      72152,
      72153
    ],
    3
  ],
  [
    [
      72154,
      72161
    ],
    2
  ],
  [
    72162,
    2
  ],
  [
    [
      72163,
      72164
    ],
    2
  ],
  [
    [
      72165,
      72191
    ],
    3
  ],
  [
    [
      72192,
      72254
    ],
    2
  ],
  [
    [
      72255,
      72262
    ],
    2
  ],
  [
    72263,
    2
  ],
  [
    [
      72264,
      72271
    ],
    3
  ],
  [
    [
      72272,
      72323
    ],
    2
  ],
  [
    [
      72324,
      72325
    ],
    2
  ],
  [
    [
      72326,
      72345
    ],
    2
  ],
  [
    [
      72346,
      72348
    ],
    2
  ],
  [
    72349,
    2
  ],
  [
    [
      72350,
      72354
    ],
    2
  ],
  [
    [
      72355,
      72367
    ],
    3
  ],
  [
    [
      72368,
      72383
    ],
    2
  ],
  [
    [
      72384,
      72440
    ],
    2
  ],
  [
    [
      72441,
      72447
    ],
    3
  ],
  [
    [
      72448,
      72457
    ],
    2
  ],
  [
    [
      72458,
      72703
    ],
    3
  ],
  [
    [
      72704,
      72712
    ],
    2
  ],
  [
    72713,
    3
  ],
  [
    [
      72714,
      72758
    ],
    2
  ],
  [
    72759,
    3
  ],
  [
    [
      72760,
      72768
    ],
    2
  ],
  [
    [
      72769,
      72773
    ],
    2
  ],
  [
    [
      72774,
      72783
    ],
    3
  ],
  [
    [
      72784,
      72793
    ],
    2
  ],
  [
    [
      72794,
      72812
    ],
    2
  ],
  [
    [
      72813,
      72815
    ],
    3
  ],
  [
    [
      72816,
      72817
    ],
    2
  ],
  [
    [
      72818,
      72847
    ],
    2
  ],
  [
    [
      72848,
      72849
    ],
    3
  ],
  [
    [
      72850,
      72871
    ],
    2
  ],
  [
    72872,
    3
  ],
  [
    [
      72873,
      72886
    ],
    2
  ],
  [
    [
      72887,
      72959
    ],
    3
  ],
  [
    [
      72960,
      72966
    ],
    2
  ],
  [
    72967,
    3
  ],
  [
    [
      72968,
      72969
    ],
    2
  ],
  [
    72970,
    3
  ],
  [
    [
      72971,
      73014
    ],
    2
  ],
  [
    [
      73015,
      73017
    ],
    3
  ],
  [
    73018,
    2
  ],
  [
    73019,
    3
  ],
  [
    [
      73020,
      73021
    ],
    2
  ],
  [
    73022,
    3
  ],
  [
    [
      73023,
      73031
    ],
    2
  ],
  [
    [
      73032,
      73039
    ],
    3
  ],
  [
    [
      73040,
      73049
    ],
    2
  ],
  [
    [
      73050,
      73055
    ],
    3
  ],
  [
    [
      73056,
      73061
    ],
    2
  ],
  [
    73062,
    3
  ],
  [
    [
      73063,
      73064
    ],
    2
  ],
  [
    73065,
    3
  ],
  [
    [
      73066,
      73102
    ],
    2
  ],
  [
    73103,
    3
  ],
  [
    [
      73104,
      73105
    ],
    2
  ],
  [
    73106,
    3
  ],
  [
    [
      73107,
      73112
    ],
    2
  ],
  [
    [
      73113,
      73119
    ],
    3
  ],
  [
    [
      73120,
      73129
    ],
    2
  ],
  [
    [
      73130,
      73439
    ],
    3
  ],
  [
    [
      73440,
      73462
    ],
    2
  ],
  [
    [
      73463,
      73464
    ],
    2
  ],
  [
    [
      73465,
      73471
    ],
    3
  ],
  [
    [
      73472,
      73488
    ],
    2
  ],
  [
    73489,
    3
  ],
  [
    [
      73490,
      73530
    ],
    2
  ],
  [
    [
      73531,
      73533
    ],
    3
  ],
  [
    [
      73534,
      73538
    ],
    2
  ],
  [
    [
      73539,
      73551
    ],
    2
  ],
  [
    [
      73552,
      73561
    ],
    2
  ],
  [
    [
      73562,
      73647
    ],
    3
  ],
  [
    73648,
    2
  ],
  [
    [
      73649,
      73663
    ],
    3
  ],
  [
    [
      73664,
      73713
    ],
    2
  ],
  [
    [
      73714,
      73726
    ],
    3
  ],
  [
    73727,
    2
  ],
  [
    [
      73728,
      74606
    ],
    2
  ],
  [
    [
      74607,
      74648
    ],
    2
  ],
  [
    74649,
    2
  ],
  [
    [
      74650,
      74751
    ],
    3
  ],
  [
    [
      74752,
      74850
    ],
    2
  ],
  [
    [
      74851,
      74862
    ],
    2
  ],
  [
    74863,
    3
  ],
  [
    [
      74864,
      74867
    ],
    2
  ],
  [
    74868,
    2
  ],
  [
    [
      74869,
      74879
    ],
    3
  ],
  [
    [
      74880,
      75075
    ],
    2
  ],
  [
    [
      75076,
      77711
    ],
    3
  ],
  [
    [
      77712,
      77808
    ],
    2
  ],
  [
    [
      77809,
      77810
    ],
    2
  ],
  [
    [
      77811,
      77823
    ],
    3
  ],
  [
    [
      77824,
      78894
    ],
    2
  ],
  [
    78895,
    2
  ],
  [
    [
      78896,
      78904
    ],
    3
  ],
  [
    [
      78905,
      78911
    ],
    3
  ],
  [
    [
      78912,
      78933
    ],
    2
  ],
  [
    [
      78934,
      82943
    ],
    3
  ],
  [
    [
      82944,
      83526
    ],
    2
  ],
  [
    [
      83527,
      92159
    ],
    3
  ],
  [
    [
      92160,
      92728
    ],
    2
  ],
  [
    [
      92729,
      92735
    ],
    3
  ],
  [
    [
      92736,
      92766
    ],
    2
  ],
  [
    92767,
    3
  ],
  [
    [
      92768,
      92777
    ],
    2
  ],
  [
    [
      92778,
      92781
    ],
    3
  ],
  [
    [
      92782,
      92783
    ],
    2
  ],
  [
    [
      92784,
      92862
    ],
    2
  ],
  [
    92863,
    3
  ],
  [
    [
      92864,
      92873
    ],
    2
  ],
  [
    [
      92874,
      92879
    ],
    3
  ],
  [
    [
      92880,
      92909
    ],
    2
  ],
  [
    [
      92910,
      92911
    ],
    3
  ],
  [
    [
      92912,
      92916
    ],
    2
  ],
  [
    92917,
    2
  ],
  [
    [
      92918,
      92927
    ],
    3
  ],
  [
    [
      92928,
      92982
    ],
    2
  ],
  [
    [
      92983,
      92991
    ],
    2
  ],
  [
    [
      92992,
      92995
    ],
    2
  ],
  [
    [
      92996,
      92997
    ],
    2
  ],
  [
    [
      92998,
      93007
    ],
    3
  ],
  [
    [
      93008,
      93017
    ],
    2
  ],
  [
    93018,
    3
  ],
  [
    [
      93019,
      93025
    ],
    2
  ],
  [
    93026,
    3
  ],
  [
    [
      93027,
      93047
    ],
    2
  ],
  [
    [
      93048,
      93052
    ],
    3
  ],
  [
    [
      93053,
      93071
    ],
    2
  ],
  [
    [
      93072,
      93759
    ],
    3
  ],
  [
    93760,
    1,
    "𖹠"
  ],
  [
    93761,
    1,
    "𖹡"
  ],
  [
    93762,
    1,
    "𖹢"
  ],
  [
    93763,
    1,
    "𖹣"
  ],
  [
    93764,
    1,
    "𖹤"
  ],
  [
    93765,
    1,
    "𖹥"
  ],
  [
    93766,
    1,
    "𖹦"
  ],
  [
    93767,
    1,
    "𖹧"
  ],
  [
    93768,
    1,
    "𖹨"
  ],
  [
    93769,
    1,
    "𖹩"
  ],
  [
    93770,
    1,
    "𖹪"
  ],
  [
    93771,
    1,
    "𖹫"
  ],
  [
    93772,
    1,
    "𖹬"
  ],
  [
    93773,
    1,
    "𖹭"
  ],
  [
    93774,
    1,
    "𖹮"
  ],
  [
    93775,
    1,
    "𖹯"
  ],
  [
    93776,
    1,
    "𖹰"
  ],
  [
    93777,
    1,
    "𖹱"
  ],
  [
    93778,
    1,
    "𖹲"
  ],
  [
    93779,
    1,
    "𖹳"
  ],
  [
    93780,
    1,
    "𖹴"
  ],
  [
    93781,
    1,
    "𖹵"
  ],
  [
    93782,
    1,
    "𖹶"
  ],
  [
    93783,
    1,
    "𖹷"
  ],
  [
    93784,
    1,
    "𖹸"
  ],
  [
    93785,
    1,
    "𖹹"
  ],
  [
    93786,
    1,
    "𖹺"
  ],
  [
    93787,
    1,
    "𖹻"
  ],
  [
    93788,
    1,
    "𖹼"
  ],
  [
    93789,
    1,
    "𖹽"
  ],
  [
    93790,
    1,
    "𖹾"
  ],
  [
    93791,
    1,
    "𖹿"
  ],
  [
    [
      93792,
      93823
    ],
    2
  ],
  [
    [
      93824,
      93850
    ],
    2
  ],
  [
    [
      93851,
      93951
    ],
    3
  ],
  [
    [
      93952,
      94020
    ],
    2
  ],
  [
    [
      94021,
      94026
    ],
    2
  ],
  [
    [
      94027,
      94030
    ],
    3
  ],
  [
    94031,
    2
  ],
  [
    [
      94032,
      94078
    ],
    2
  ],
  [
    [
      94079,
      94087
    ],
    2
  ],
  [
    [
      94088,
      94094
    ],
    3
  ],
  [
    [
      94095,
      94111
    ],
    2
  ],
  [
    [
      94112,
      94175
    ],
    3
  ],
  [
    94176,
    2
  ],
  [
    94177,
    2
  ],
  [
    94178,
    2
  ],
  [
    94179,
    2
  ],
  [
    94180,
    2
  ],
  [
    [
      94181,
      94191
    ],
    3
  ],
  [
    [
      94192,
      94193
    ],
    2
  ],
  [
    [
      94194,
      94207
    ],
    3
  ],
  [
    [
      94208,
      100332
    ],
    2
  ],
  [
    [
      100333,
      100337
    ],
    2
  ],
  [
    [
      100338,
      100343
    ],
    2
  ],
  [
    [
      100344,
      100351
    ],
    3
  ],
  [
    [
      100352,
      101106
    ],
    2
  ],
  [
    [
      101107,
      101589
    ],
    2
  ],
  [
    [
      101590,
      101631
    ],
    3
  ],
  [
    [
      101632,
      101640
    ],
    2
  ],
  [
    [
      101641,
      110575
    ],
    3
  ],
  [
    [
      110576,
      110579
    ],
    2
  ],
  [
    110580,
    3
  ],
  [
    [
      110581,
      110587
    ],
    2
  ],
  [
    110588,
    3
  ],
  [
    [
      110589,
      110590
    ],
    2
  ],
  [
    110591,
    3
  ],
  [
    [
      110592,
      110593
    ],
    2
  ],
  [
    [
      110594,
      110878
    ],
    2
  ],
  [
    [
      110879,
      110882
    ],
    2
  ],
  [
    [
      110883,
      110897
    ],
    3
  ],
  [
    110898,
    2
  ],
  [
    [
      110899,
      110927
    ],
    3
  ],
  [
    [
      110928,
      110930
    ],
    2
  ],
  [
    [
      110931,
      110932
    ],
    3
  ],
  [
    110933,
    2
  ],
  [
    [
      110934,
      110947
    ],
    3
  ],
  [
    [
      110948,
      110951
    ],
    2
  ],
  [
    [
      110952,
      110959
    ],
    3
  ],
  [
    [
      110960,
      111355
    ],
    2
  ],
  [
    [
      111356,
      113663
    ],
    3
  ],
  [
    [
      113664,
      113770
    ],
    2
  ],
  [
    [
      113771,
      113775
    ],
    3
  ],
  [
    [
      113776,
      113788
    ],
    2
  ],
  [
    [
      113789,
      113791
    ],
    3
  ],
  [
    [
      113792,
      113800
    ],
    2
  ],
  [
    [
      113801,
      113807
    ],
    3
  ],
  [
    [
      113808,
      113817
    ],
    2
  ],
  [
    [
      113818,
      113819
    ],
    3
  ],
  [
    113820,
    2
  ],
  [
    [
      113821,
      113822
    ],
    2
  ],
  [
    113823,
    2
  ],
  [
    [
      113824,
      113827
    ],
    7
  ],
  [
    [
      113828,
      118527
    ],
    3
  ],
  [
    [
      118528,
      118573
    ],
    2
  ],
  [
    [
      118574,
      118575
    ],
    3
  ],
  [
    [
      118576,
      118598
    ],
    2
  ],
  [
    [
      118599,
      118607
    ],
    3
  ],
  [
    [
      118608,
      118723
    ],
    2
  ],
  [
    [
      118724,
      118783
    ],
    3
  ],
  [
    [
      118784,
      119029
    ],
    2
  ],
  [
    [
      119030,
      119039
    ],
    3
  ],
  [
    [
      119040,
      119078
    ],
    2
  ],
  [
    [
      119079,
      119080
    ],
    3
  ],
  [
    119081,
    2
  ],
  [
    [
      119082,
      119133
    ],
    2
  ],
  [
    119134,
    1,
    "𝅗𝅥"
  ],
  [
    119135,
    1,
    "𝅘𝅥"
  ],
  [
    119136,
    1,
    "𝅘𝅥𝅮"
  ],
  [
    119137,
    1,
    "𝅘𝅥𝅯"
  ],
  [
    119138,
    1,
    "𝅘𝅥𝅰"
  ],
  [
    119139,
    1,
    "𝅘𝅥𝅱"
  ],
  [
    119140,
    1,
    "𝅘𝅥𝅲"
  ],
  [
    [
      119141,
      119154
    ],
    2
  ],
  [
    [
      119155,
      119162
    ],
    3
  ],
  [
    [
      119163,
      119226
    ],
    2
  ],
  [
    119227,
    1,
    "𝆹𝅥"
  ],
  [
    119228,
    1,
    "𝆺𝅥"
  ],
  [
    119229,
    1,
    "𝆹𝅥𝅮"
  ],
  [
    119230,
    1,
    "𝆺𝅥𝅮"
  ],
  [
    119231,
    1,
    "𝆹𝅥𝅯"
  ],
  [
    119232,
    1,
    "𝆺𝅥𝅯"
  ],
  [
    [
      119233,
      119261
    ],
    2
  ],
  [
    [
      119262,
      119272
    ],
    2
  ],
  [
    [
      119273,
      119274
    ],
    2
  ],
  [
    [
      119275,
      119295
    ],
    3
  ],
  [
    [
      119296,
      119365
    ],
    2
  ],
  [
    [
      119366,
      119487
    ],
    3
  ],
  [
    [
      119488,
      119507
    ],
    2
  ],
  [
    [
      119508,
      119519
    ],
    3
  ],
  [
    [
      119520,
      119539
    ],
    2
  ],
  [
    [
      119540,
      119551
    ],
    3
  ],
  [
    [
      119552,
      119638
    ],
    2
  ],
  [
    [
      119639,
      119647
    ],
    3
  ],
  [
    [
      119648,
      119665
    ],
    2
  ],
  [
    [
      119666,
      119672
    ],
    2
  ],
  [
    [
      119673,
      119807
    ],
    3
  ],
  [
    119808,
    1,
    "a"
  ],
  [
    119809,
    1,
    "b"
  ],
  [
    119810,
    1,
    "c"
  ],
  [
    119811,
    1,
    "d"
  ],
  [
    119812,
    1,
    "e"
  ],
  [
    119813,
    1,
    "f"
  ],
  [
    119814,
    1,
    "g"
  ],
  [
    119815,
    1,
    "h"
  ],
  [
    119816,
    1,
    "i"
  ],
  [
    119817,
    1,
    "j"
  ],
  [
    119818,
    1,
    "k"
  ],
  [
    119819,
    1,
    "l"
  ],
  [
    119820,
    1,
    "m"
  ],
  [
    119821,
    1,
    "n"
  ],
  [
    119822,
    1,
    "o"
  ],
  [
    119823,
    1,
    "p"
  ],
  [
    119824,
    1,
    "q"
  ],
  [
    119825,
    1,
    "r"
  ],
  [
    119826,
    1,
    "s"
  ],
  [
    119827,
    1,
    "t"
  ],
  [
    119828,
    1,
    "u"
  ],
  [
    119829,
    1,
    "v"
  ],
  [
    119830,
    1,
    "w"
  ],
  [
    119831,
    1,
    "x"
  ],
  [
    119832,
    1,
    "y"
  ],
  [
    119833,
    1,
    "z"
  ],
  [
    119834,
    1,
    "a"
  ],
  [
    119835,
    1,
    "b"
  ],
  [
    119836,
    1,
    "c"
  ],
  [
    119837,
    1,
    "d"
  ],
  [
    119838,
    1,
    "e"
  ],
  [
    119839,
    1,
    "f"
  ],
  [
    119840,
    1,
    "g"
  ],
  [
    119841,
    1,
    "h"
  ],
  [
    119842,
    1,
    "i"
  ],
  [
    119843,
    1,
    "j"
  ],
  [
    119844,
    1,
    "k"
  ],
  [
    119845,
    1,
    "l"
  ],
  [
    119846,
    1,
    "m"
  ],
  [
    119847,
    1,
    "n"
  ],
  [
    119848,
    1,
    "o"
  ],
  [
    119849,
    1,
    "p"
  ],
  [
    119850,
    1,
    "q"
  ],
  [
    119851,
    1,
    "r"
  ],
  [
    119852,
    1,
    "s"
  ],
  [
    119853,
    1,
    "t"
  ],
  [
    119854,
    1,
    "u"
  ],
  [
    119855,
    1,
    "v"
  ],
  [
    119856,
    1,
    "w"
  ],
  [
    119857,
    1,
    "x"
  ],
  [
    119858,
    1,
    "y"
  ],
  [
    119859,
    1,
    "z"
  ],
  [
    119860,
    1,
    "a"
  ],
  [
    119861,
    1,
    "b"
  ],
  [
    119862,
    1,
    "c"
  ],
  [
    119863,
    1,
    "d"
  ],
  [
    119864,
    1,
    "e"
  ],
  [
    119865,
    1,
    "f"
  ],
  [
    119866,
    1,
    "g"
  ],
  [
    119867,
    1,
    "h"
  ],
  [
    119868,
    1,
    "i"
  ],
  [
    119869,
    1,
    "j"
  ],
  [
    119870,
    1,
    "k"
  ],
  [
    119871,
    1,
    "l"
  ],
  [
    119872,
    1,
    "m"
  ],
  [
    119873,
    1,
    "n"
  ],
  [
    119874,
    1,
    "o"
  ],
  [
    119875,
    1,
    "p"
  ],
  [
    119876,
    1,
    "q"
  ],
  [
    119877,
    1,
    "r"
  ],
  [
    119878,
    1,
    "s"
  ],
  [
    119879,
    1,
    "t"
  ],
  [
    119880,
    1,
    "u"
  ],
  [
    119881,
    1,
    "v"
  ],
  [
    119882,
    1,
    "w"
  ],
  [
    119883,
    1,
    "x"
  ],
  [
    119884,
    1,
    "y"
  ],
  [
    119885,
    1,
    "z"
  ],
  [
    119886,
    1,
    "a"
  ],
  [
    119887,
    1,
    "b"
  ],
  [
    119888,
    1,
    "c"
  ],
  [
    119889,
    1,
    "d"
  ],
  [
    119890,
    1,
    "e"
  ],
  [
    119891,
    1,
    "f"
  ],
  [
    119892,
    1,
    "g"
  ],
  [
    119893,
    3
  ],
  [
    119894,
    1,
    "i"
  ],
  [
    119895,
    1,
    "j"
  ],
  [
    119896,
    1,
    "k"
  ],
  [
    119897,
    1,
    "l"
  ],
  [
    119898,
    1,
    "m"
  ],
  [
    119899,
    1,
    "n"
  ],
  [
    119900,
    1,
    "o"
  ],
  [
    119901,
    1,
    "p"
  ],
  [
    119902,
    1,
    "q"
  ],
  [
    119903,
    1,
    "r"
  ],
  [
    119904,
    1,
    "s"
  ],
  [
    119905,
    1,
    "t"
  ],
  [
    119906,
    1,
    "u"
  ],
  [
    119907,
    1,
    "v"
  ],
  [
    119908,
    1,
    "w"
  ],
  [
    119909,
    1,
    "x"
  ],
  [
    119910,
    1,
    "y"
  ],
  [
    119911,
    1,
    "z"
  ],
  [
    119912,
    1,
    "a"
  ],
  [
    119913,
    1,
    "b"
  ],
  [
    119914,
    1,
    "c"
  ],
  [
    119915,
    1,
    "d"
  ],
  [
    119916,
    1,
    "e"
  ],
  [
    119917,
    1,
    "f"
  ],
  [
    119918,
    1,
    "g"
  ],
  [
    119919,
    1,
    "h"
  ],
  [
    119920,
    1,
    "i"
  ],
  [
    119921,
    1,
    "j"
  ],
  [
    119922,
    1,
    "k"
  ],
  [
    119923,
    1,
    "l"
  ],
  [
    119924,
    1,
    "m"
  ],
  [
    119925,
    1,
    "n"
  ],
  [
    119926,
    1,
    "o"
  ],
  [
    119927,
    1,
    "p"
  ],
  [
    119928,
    1,
    "q"
  ],
  [
    119929,
    1,
    "r"
  ],
  [
    119930,
    1,
    "s"
  ],
  [
    119931,
    1,
    "t"
  ],
  [
    119932,
    1,
    "u"
  ],
  [
    119933,
    1,
    "v"
  ],
  [
    119934,
    1,
    "w"
  ],
  [
    119935,
    1,
    "x"
  ],
  [
    119936,
    1,
    "y"
  ],
  [
    119937,
    1,
    "z"
  ],
  [
    119938,
    1,
    "a"
  ],
  [
    119939,
    1,
    "b"
  ],
  [
    119940,
    1,
    "c"
  ],
  [
    119941,
    1,
    "d"
  ],
  [
    119942,
    1,
    "e"
  ],
  [
    119943,
    1,
    "f"
  ],
  [
    119944,
    1,
    "g"
  ],
  [
    119945,
    1,
    "h"
  ],
  [
    119946,
    1,
    "i"
  ],
  [
    119947,
    1,
    "j"
  ],
  [
    119948,
    1,
    "k"
  ],
  [
    119949,
    1,
    "l"
  ],
  [
    119950,
    1,
    "m"
  ],
  [
    119951,
    1,
    "n"
  ],
  [
    119952,
    1,
    "o"
  ],
  [
    119953,
    1,
    "p"
  ],
  [
    119954,
    1,
    "q"
  ],
  [
    119955,
    1,
    "r"
  ],
  [
    119956,
    1,
    "s"
  ],
  [
    119957,
    1,
    "t"
  ],
  [
    119958,
    1,
    "u"
  ],
  [
    119959,
    1,
    "v"
  ],
  [
    119960,
    1,
    "w"
  ],
  [
    119961,
    1,
    "x"
  ],
  [
    119962,
    1,
    "y"
  ],
  [
    119963,
    1,
    "z"
  ],
  [
    119964,
    1,
    "a"
  ],
  [
    119965,
    3
  ],
  [
    119966,
    1,
    "c"
  ],
  [
    119967,
    1,
    "d"
  ],
  [
    [
      119968,
      119969
    ],
    3
  ],
  [
    119970,
    1,
    "g"
  ],
  [
    [
      119971,
      119972
    ],
    3
  ],
  [
    119973,
    1,
    "j"
  ],
  [
    119974,
    1,
    "k"
  ],
  [
    [
      119975,
      119976
    ],
    3
  ],
  [
    119977,
    1,
    "n"
  ],
  [
    119978,
    1,
    "o"
  ],
  [
    119979,
    1,
    "p"
  ],
  [
    119980,
    1,
    "q"
  ],
  [
    119981,
    3
  ],
  [
    119982,
    1,
    "s"
  ],
  [
    119983,
    1,
    "t"
  ],
  [
    119984,
    1,
    "u"
  ],
  [
    119985,
    1,
    "v"
  ],
  [
    119986,
    1,
    "w"
  ],
  [
    119987,
    1,
    "x"
  ],
  [
    119988,
    1,
    "y"
  ],
  [
    119989,
    1,
    "z"
  ],
  [
    119990,
    1,
    "a"
  ],
  [
    119991,
    1,
    "b"
  ],
  [
    119992,
    1,
    "c"
  ],
  [
    119993,
    1,
    "d"
  ],
  [
    119994,
    3
  ],
  [
    119995,
    1,
    "f"
  ],
  [
    119996,
    3
  ],
  [
    119997,
    1,
    "h"
  ],
  [
    119998,
    1,
    "i"
  ],
  [
    119999,
    1,
    "j"
  ],
  [
    12e4,
    1,
    "k"
  ],
  [
    120001,
    1,
    "l"
  ],
  [
    120002,
    1,
    "m"
  ],
  [
    120003,
    1,
    "n"
  ],
  [
    120004,
    3
  ],
  [
    120005,
    1,
    "p"
  ],
  [
    120006,
    1,
    "q"
  ],
  [
    120007,
    1,
    "r"
  ],
  [
    120008,
    1,
    "s"
  ],
  [
    120009,
    1,
    "t"
  ],
  [
    120010,
    1,
    "u"
  ],
  [
    120011,
    1,
    "v"
  ],
  [
    120012,
    1,
    "w"
  ],
  [
    120013,
    1,
    "x"
  ],
  [
    120014,
    1,
    "y"
  ],
  [
    120015,
    1,
    "z"
  ],
  [
    120016,
    1,
    "a"
  ],
  [
    120017,
    1,
    "b"
  ],
  [
    120018,
    1,
    "c"
  ],
  [
    120019,
    1,
    "d"
  ],
  [
    120020,
    1,
    "e"
  ],
  [
    120021,
    1,
    "f"
  ],
  [
    120022,
    1,
    "g"
  ],
  [
    120023,
    1,
    "h"
  ],
  [
    120024,
    1,
    "i"
  ],
  [
    120025,
    1,
    "j"
  ],
  [
    120026,
    1,
    "k"
  ],
  [
    120027,
    1,
    "l"
  ],
  [
    120028,
    1,
    "m"
  ],
  [
    120029,
    1,
    "n"
  ],
  [
    120030,
    1,
    "o"
  ],
  [
    120031,
    1,
    "p"
  ],
  [
    120032,
    1,
    "q"
  ],
  [
    120033,
    1,
    "r"
  ],
  [
    120034,
    1,
    "s"
  ],
  [
    120035,
    1,
    "t"
  ],
  [
    120036,
    1,
    "u"
  ],
  [
    120037,
    1,
    "v"
  ],
  [
    120038,
    1,
    "w"
  ],
  [
    120039,
    1,
    "x"
  ],
  [
    120040,
    1,
    "y"
  ],
  [
    120041,
    1,
    "z"
  ],
  [
    120042,
    1,
    "a"
  ],
  [
    120043,
    1,
    "b"
  ],
  [
    120044,
    1,
    "c"
  ],
  [
    120045,
    1,
    "d"
  ],
  [
    120046,
    1,
    "e"
  ],
  [
    120047,
    1,
    "f"
  ],
  [
    120048,
    1,
    "g"
  ],
  [
    120049,
    1,
    "h"
  ],
  [
    120050,
    1,
    "i"
  ],
  [
    120051,
    1,
    "j"
  ],
  [
    120052,
    1,
    "k"
  ],
  [
    120053,
    1,
    "l"
  ],
  [
    120054,
    1,
    "m"
  ],
  [
    120055,
    1,
    "n"
  ],
  [
    120056,
    1,
    "o"
  ],
  [
    120057,
    1,
    "p"
  ],
  [
    120058,
    1,
    "q"
  ],
  [
    120059,
    1,
    "r"
  ],
  [
    120060,
    1,
    "s"
  ],
  [
    120061,
    1,
    "t"
  ],
  [
    120062,
    1,
    "u"
  ],
  [
    120063,
    1,
    "v"
  ],
  [
    120064,
    1,
    "w"
  ],
  [
    120065,
    1,
    "x"
  ],
  [
    120066,
    1,
    "y"
  ],
  [
    120067,
    1,
    "z"
  ],
  [
    120068,
    1,
    "a"
  ],
  [
    120069,
    1,
    "b"
  ],
  [
    120070,
    3
  ],
  [
    120071,
    1,
    "d"
  ],
  [
    120072,
    1,
    "e"
  ],
  [
    120073,
    1,
    "f"
  ],
  [
    120074,
    1,
    "g"
  ],
  [
    [
      120075,
      120076
    ],
    3
  ],
  [
    120077,
    1,
    "j"
  ],
  [
    120078,
    1,
    "k"
  ],
  [
    120079,
    1,
    "l"
  ],
  [
    120080,
    1,
    "m"
  ],
  [
    120081,
    1,
    "n"
  ],
  [
    120082,
    1,
    "o"
  ],
  [
    120083,
    1,
    "p"
  ],
  [
    120084,
    1,
    "q"
  ],
  [
    120085,
    3
  ],
  [
    120086,
    1,
    "s"
  ],
  [
    120087,
    1,
    "t"
  ],
  [
    120088,
    1,
    "u"
  ],
  [
    120089,
    1,
    "v"
  ],
  [
    120090,
    1,
    "w"
  ],
  [
    120091,
    1,
    "x"
  ],
  [
    120092,
    1,
    "y"
  ],
  [
    120093,
    3
  ],
  [
    120094,
    1,
    "a"
  ],
  [
    120095,
    1,
    "b"
  ],
  [
    120096,
    1,
    "c"
  ],
  [
    120097,
    1,
    "d"
  ],
  [
    120098,
    1,
    "e"
  ],
  [
    120099,
    1,
    "f"
  ],
  [
    120100,
    1,
    "g"
  ],
  [
    120101,
    1,
    "h"
  ],
  [
    120102,
    1,
    "i"
  ],
  [
    120103,
    1,
    "j"
  ],
  [
    120104,
    1,
    "k"
  ],
  [
    120105,
    1,
    "l"
  ],
  [
    120106,
    1,
    "m"
  ],
  [
    120107,
    1,
    "n"
  ],
  [
    120108,
    1,
    "o"
  ],
  [
    120109,
    1,
    "p"
  ],
  [
    120110,
    1,
    "q"
  ],
  [
    120111,
    1,
    "r"
  ],
  [
    120112,
    1,
    "s"
  ],
  [
    120113,
    1,
    "t"
  ],
  [
    120114,
    1,
    "u"
  ],
  [
    120115,
    1,
    "v"
  ],
  [
    120116,
    1,
    "w"
  ],
  [
    120117,
    1,
    "x"
  ],
  [
    120118,
    1,
    "y"
  ],
  [
    120119,
    1,
    "z"
  ],
  [
    120120,
    1,
    "a"
  ],
  [
    120121,
    1,
    "b"
  ],
  [
    120122,
    3
  ],
  [
    120123,
    1,
    "d"
  ],
  [
    120124,
    1,
    "e"
  ],
  [
    120125,
    1,
    "f"
  ],
  [
    120126,
    1,
    "g"
  ],
  [
    120127,
    3
  ],
  [
    120128,
    1,
    "i"
  ],
  [
    120129,
    1,
    "j"
  ],
  [
    120130,
    1,
    "k"
  ],
  [
    120131,
    1,
    "l"
  ],
  [
    120132,
    1,
    "m"
  ],
  [
    120133,
    3
  ],
  [
    120134,
    1,
    "o"
  ],
  [
    [
      120135,
      120137
    ],
    3
  ],
  [
    120138,
    1,
    "s"
  ],
  [
    120139,
    1,
    "t"
  ],
  [
    120140,
    1,
    "u"
  ],
  [
    120141,
    1,
    "v"
  ],
  [
    120142,
    1,
    "w"
  ],
  [
    120143,
    1,
    "x"
  ],
  [
    120144,
    1,
    "y"
  ],
  [
    120145,
    3
  ],
  [
    120146,
    1,
    "a"
  ],
  [
    120147,
    1,
    "b"
  ],
  [
    120148,
    1,
    "c"
  ],
  [
    120149,
    1,
    "d"
  ],
  [
    120150,
    1,
    "e"
  ],
  [
    120151,
    1,
    "f"
  ],
  [
    120152,
    1,
    "g"
  ],
  [
    120153,
    1,
    "h"
  ],
  [
    120154,
    1,
    "i"
  ],
  [
    120155,
    1,
    "j"
  ],
  [
    120156,
    1,
    "k"
  ],
  [
    120157,
    1,
    "l"
  ],
  [
    120158,
    1,
    "m"
  ],
  [
    120159,
    1,
    "n"
  ],
  [
    120160,
    1,
    "o"
  ],
  [
    120161,
    1,
    "p"
  ],
  [
    120162,
    1,
    "q"
  ],
  [
    120163,
    1,
    "r"
  ],
  [
    120164,
    1,
    "s"
  ],
  [
    120165,
    1,
    "t"
  ],
  [
    120166,
    1,
    "u"
  ],
  [
    120167,
    1,
    "v"
  ],
  [
    120168,
    1,
    "w"
  ],
  [
    120169,
    1,
    "x"
  ],
  [
    120170,
    1,
    "y"
  ],
  [
    120171,
    1,
    "z"
  ],
  [
    120172,
    1,
    "a"
  ],
  [
    120173,
    1,
    "b"
  ],
  [
    120174,
    1,
    "c"
  ],
  [
    120175,
    1,
    "d"
  ],
  [
    120176,
    1,
    "e"
  ],
  [
    120177,
    1,
    "f"
  ],
  [
    120178,
    1,
    "g"
  ],
  [
    120179,
    1,
    "h"
  ],
  [
    120180,
    1,
    "i"
  ],
  [
    120181,
    1,
    "j"
  ],
  [
    120182,
    1,
    "k"
  ],
  [
    120183,
    1,
    "l"
  ],
  [
    120184,
    1,
    "m"
  ],
  [
    120185,
    1,
    "n"
  ],
  [
    120186,
    1,
    "o"
  ],
  [
    120187,
    1,
    "p"
  ],
  [
    120188,
    1,
    "q"
  ],
  [
    120189,
    1,
    "r"
  ],
  [
    120190,
    1,
    "s"
  ],
  [
    120191,
    1,
    "t"
  ],
  [
    120192,
    1,
    "u"
  ],
  [
    120193,
    1,
    "v"
  ],
  [
    120194,
    1,
    "w"
  ],
  [
    120195,
    1,
    "x"
  ],
  [
    120196,
    1,
    "y"
  ],
  [
    120197,
    1,
    "z"
  ],
  [
    120198,
    1,
    "a"
  ],
  [
    120199,
    1,
    "b"
  ],
  [
    120200,
    1,
    "c"
  ],
  [
    120201,
    1,
    "d"
  ],
  [
    120202,
    1,
    "e"
  ],
  [
    120203,
    1,
    "f"
  ],
  [
    120204,
    1,
    "g"
  ],
  [
    120205,
    1,
    "h"
  ],
  [
    120206,
    1,
    "i"
  ],
  [
    120207,
    1,
    "j"
  ],
  [
    120208,
    1,
    "k"
  ],
  [
    120209,
    1,
    "l"
  ],
  [
    120210,
    1,
    "m"
  ],
  [
    120211,
    1,
    "n"
  ],
  [
    120212,
    1,
    "o"
  ],
  [
    120213,
    1,
    "p"
  ],
  [
    120214,
    1,
    "q"
  ],
  [
    120215,
    1,
    "r"
  ],
  [
    120216,
    1,
    "s"
  ],
  [
    120217,
    1,
    "t"
  ],
  [
    120218,
    1,
    "u"
  ],
  [
    120219,
    1,
    "v"
  ],
  [
    120220,
    1,
    "w"
  ],
  [
    120221,
    1,
    "x"
  ],
  [
    120222,
    1,
    "y"
  ],
  [
    120223,
    1,
    "z"
  ],
  [
    120224,
    1,
    "a"
  ],
  [
    120225,
    1,
    "b"
  ],
  [
    120226,
    1,
    "c"
  ],
  [
    120227,
    1,
    "d"
  ],
  [
    120228,
    1,
    "e"
  ],
  [
    120229,
    1,
    "f"
  ],
  [
    120230,
    1,
    "g"
  ],
  [
    120231,
    1,
    "h"
  ],
  [
    120232,
    1,
    "i"
  ],
  [
    120233,
    1,
    "j"
  ],
  [
    120234,
    1,
    "k"
  ],
  [
    120235,
    1,
    "l"
  ],
  [
    120236,
    1,
    "m"
  ],
  [
    120237,
    1,
    "n"
  ],
  [
    120238,
    1,
    "o"
  ],
  [
    120239,
    1,
    "p"
  ],
  [
    120240,
    1,
    "q"
  ],
  [
    120241,
    1,
    "r"
  ],
  [
    120242,
    1,
    "s"
  ],
  [
    120243,
    1,
    "t"
  ],
  [
    120244,
    1,
    "u"
  ],
  [
    120245,
    1,
    "v"
  ],
  [
    120246,
    1,
    "w"
  ],
  [
    120247,
    1,
    "x"
  ],
  [
    120248,
    1,
    "y"
  ],
  [
    120249,
    1,
    "z"
  ],
  [
    120250,
    1,
    "a"
  ],
  [
    120251,
    1,
    "b"
  ],
  [
    120252,
    1,
    "c"
  ],
  [
    120253,
    1,
    "d"
  ],
  [
    120254,
    1,
    "e"
  ],
  [
    120255,
    1,
    "f"
  ],
  [
    120256,
    1,
    "g"
  ],
  [
    120257,
    1,
    "h"
  ],
  [
    120258,
    1,
    "i"
  ],
  [
    120259,
    1,
    "j"
  ],
  [
    120260,
    1,
    "k"
  ],
  [
    120261,
    1,
    "l"
  ],
  [
    120262,
    1,
    "m"
  ],
  [
    120263,
    1,
    "n"
  ],
  [
    120264,
    1,
    "o"
  ],
  [
    120265,
    1,
    "p"
  ],
  [
    120266,
    1,
    "q"
  ],
  [
    120267,
    1,
    "r"
  ],
  [
    120268,
    1,
    "s"
  ],
  [
    120269,
    1,
    "t"
  ],
  [
    120270,
    1,
    "u"
  ],
  [
    120271,
    1,
    "v"
  ],
  [
    120272,
    1,
    "w"
  ],
  [
    120273,
    1,
    "x"
  ],
  [
    120274,
    1,
    "y"
  ],
  [
    120275,
    1,
    "z"
  ],
  [
    120276,
    1,
    "a"
  ],
  [
    120277,
    1,
    "b"
  ],
  [
    120278,
    1,
    "c"
  ],
  [
    120279,
    1,
    "d"
  ],
  [
    120280,
    1,
    "e"
  ],
  [
    120281,
    1,
    "f"
  ],
  [
    120282,
    1,
    "g"
  ],
  [
    120283,
    1,
    "h"
  ],
  [
    120284,
    1,
    "i"
  ],
  [
    120285,
    1,
    "j"
  ],
  [
    120286,
    1,
    "k"
  ],
  [
    120287,
    1,
    "l"
  ],
  [
    120288,
    1,
    "m"
  ],
  [
    120289,
    1,
    "n"
  ],
  [
    120290,
    1,
    "o"
  ],
  [
    120291,
    1,
    "p"
  ],
  [
    120292,
    1,
    "q"
  ],
  [
    120293,
    1,
    "r"
  ],
  [
    120294,
    1,
    "s"
  ],
  [
    120295,
    1,
    "t"
  ],
  [
    120296,
    1,
    "u"
  ],
  [
    120297,
    1,
    "v"
  ],
  [
    120298,
    1,
    "w"
  ],
  [
    120299,
    1,
    "x"
  ],
  [
    120300,
    1,
    "y"
  ],
  [
    120301,
    1,
    "z"
  ],
  [
    120302,
    1,
    "a"
  ],
  [
    120303,
    1,
    "b"
  ],
  [
    120304,
    1,
    "c"
  ],
  [
    120305,
    1,
    "d"
  ],
  [
    120306,
    1,
    "e"
  ],
  [
    120307,
    1,
    "f"
  ],
  [
    120308,
    1,
    "g"
  ],
  [
    120309,
    1,
    "h"
  ],
  [
    120310,
    1,
    "i"
  ],
  [
    120311,
    1,
    "j"
  ],
  [
    120312,
    1,
    "k"
  ],
  [
    120313,
    1,
    "l"
  ],
  [
    120314,
    1,
    "m"
  ],
  [
    120315,
    1,
    "n"
  ],
  [
    120316,
    1,
    "o"
  ],
  [
    120317,
    1,
    "p"
  ],
  [
    120318,
    1,
    "q"
  ],
  [
    120319,
    1,
    "r"
  ],
  [
    120320,
    1,
    "s"
  ],
  [
    120321,
    1,
    "t"
  ],
  [
    120322,
    1,
    "u"
  ],
  [
    120323,
    1,
    "v"
  ],
  [
    120324,
    1,
    "w"
  ],
  [
    120325,
    1,
    "x"
  ],
  [
    120326,
    1,
    "y"
  ],
  [
    120327,
    1,
    "z"
  ],
  [
    120328,
    1,
    "a"
  ],
  [
    120329,
    1,
    "b"
  ],
  [
    120330,
    1,
    "c"
  ],
  [
    120331,
    1,
    "d"
  ],
  [
    120332,
    1,
    "e"
  ],
  [
    120333,
    1,
    "f"
  ],
  [
    120334,
    1,
    "g"
  ],
  [
    120335,
    1,
    "h"
  ],
  [
    120336,
    1,
    "i"
  ],
  [
    120337,
    1,
    "j"
  ],
  [
    120338,
    1,
    "k"
  ],
  [
    120339,
    1,
    "l"
  ],
  [
    120340,
    1,
    "m"
  ],
  [
    120341,
    1,
    "n"
  ],
  [
    120342,
    1,
    "o"
  ],
  [
    120343,
    1,
    "p"
  ],
  [
    120344,
    1,
    "q"
  ],
  [
    120345,
    1,
    "r"
  ],
  [
    120346,
    1,
    "s"
  ],
  [
    120347,
    1,
    "t"
  ],
  [
    120348,
    1,
    "u"
  ],
  [
    120349,
    1,
    "v"
  ],
  [
    120350,
    1,
    "w"
  ],
  [
    120351,
    1,
    "x"
  ],
  [
    120352,
    1,
    "y"
  ],
  [
    120353,
    1,
    "z"
  ],
  [
    120354,
    1,
    "a"
  ],
  [
    120355,
    1,
    "b"
  ],
  [
    120356,
    1,
    "c"
  ],
  [
    120357,
    1,
    "d"
  ],
  [
    120358,
    1,
    "e"
  ],
  [
    120359,
    1,
    "f"
  ],
  [
    120360,
    1,
    "g"
  ],
  [
    120361,
    1,
    "h"
  ],
  [
    120362,
    1,
    "i"
  ],
  [
    120363,
    1,
    "j"
  ],
  [
    120364,
    1,
    "k"
  ],
  [
    120365,
    1,
    "l"
  ],
  [
    120366,
    1,
    "m"
  ],
  [
    120367,
    1,
    "n"
  ],
  [
    120368,
    1,
    "o"
  ],
  [
    120369,
    1,
    "p"
  ],
  [
    120370,
    1,
    "q"
  ],
  [
    120371,
    1,
    "r"
  ],
  [
    120372,
    1,
    "s"
  ],
  [
    120373,
    1,
    "t"
  ],
  [
    120374,
    1,
    "u"
  ],
  [
    120375,
    1,
    "v"
  ],
  [
    120376,
    1,
    "w"
  ],
  [
    120377,
    1,
    "x"
  ],
  [
    120378,
    1,
    "y"
  ],
  [
    120379,
    1,
    "z"
  ],
  [
    120380,
    1,
    "a"
  ],
  [
    120381,
    1,
    "b"
  ],
  [
    120382,
    1,
    "c"
  ],
  [
    120383,
    1,
    "d"
  ],
  [
    120384,
    1,
    "e"
  ],
  [
    120385,
    1,
    "f"
  ],
  [
    120386,
    1,
    "g"
  ],
  [
    120387,
    1,
    "h"
  ],
  [
    120388,
    1,
    "i"
  ],
  [
    120389,
    1,
    "j"
  ],
  [
    120390,
    1,
    "k"
  ],
  [
    120391,
    1,
    "l"
  ],
  [
    120392,
    1,
    "m"
  ],
  [
    120393,
    1,
    "n"
  ],
  [
    120394,
    1,
    "o"
  ],
  [
    120395,
    1,
    "p"
  ],
  [
    120396,
    1,
    "q"
  ],
  [
    120397,
    1,
    "r"
  ],
  [
    120398,
    1,
    "s"
  ],
  [
    120399,
    1,
    "t"
  ],
  [
    120400,
    1,
    "u"
  ],
  [
    120401,
    1,
    "v"
  ],
  [
    120402,
    1,
    "w"
  ],
  [
    120403,
    1,
    "x"
  ],
  [
    120404,
    1,
    "y"
  ],
  [
    120405,
    1,
    "z"
  ],
  [
    120406,
    1,
    "a"
  ],
  [
    120407,
    1,
    "b"
  ],
  [
    120408,
    1,
    "c"
  ],
  [
    120409,
    1,
    "d"
  ],
  [
    120410,
    1,
    "e"
  ],
  [
    120411,
    1,
    "f"
  ],
  [
    120412,
    1,
    "g"
  ],
  [
    120413,
    1,
    "h"
  ],
  [
    120414,
    1,
    "i"
  ],
  [
    120415,
    1,
    "j"
  ],
  [
    120416,
    1,
    "k"
  ],
  [
    120417,
    1,
    "l"
  ],
  [
    120418,
    1,
    "m"
  ],
  [
    120419,
    1,
    "n"
  ],
  [
    120420,
    1,
    "o"
  ],
  [
    120421,
    1,
    "p"
  ],
  [
    120422,
    1,
    "q"
  ],
  [
    120423,
    1,
    "r"
  ],
  [
    120424,
    1,
    "s"
  ],
  [
    120425,
    1,
    "t"
  ],
  [
    120426,
    1,
    "u"
  ],
  [
    120427,
    1,
    "v"
  ],
  [
    120428,
    1,
    "w"
  ],
  [
    120429,
    1,
    "x"
  ],
  [
    120430,
    1,
    "y"
  ],
  [
    120431,
    1,
    "z"
  ],
  [
    120432,
    1,
    "a"
  ],
  [
    120433,
    1,
    "b"
  ],
  [
    120434,
    1,
    "c"
  ],
  [
    120435,
    1,
    "d"
  ],
  [
    120436,
    1,
    "e"
  ],
  [
    120437,
    1,
    "f"
  ],
  [
    120438,
    1,
    "g"
  ],
  [
    120439,
    1,
    "h"
  ],
  [
    120440,
    1,
    "i"
  ],
  [
    120441,
    1,
    "j"
  ],
  [
    120442,
    1,
    "k"
  ],
  [
    120443,
    1,
    "l"
  ],
  [
    120444,
    1,
    "m"
  ],
  [
    120445,
    1,
    "n"
  ],
  [
    120446,
    1,
    "o"
  ],
  [
    120447,
    1,
    "p"
  ],
  [
    120448,
    1,
    "q"
  ],
  [
    120449,
    1,
    "r"
  ],
  [
    120450,
    1,
    "s"
  ],
  [
    120451,
    1,
    "t"
  ],
  [
    120452,
    1,
    "u"
  ],
  [
    120453,
    1,
    "v"
  ],
  [
    120454,
    1,
    "w"
  ],
  [
    120455,
    1,
    "x"
  ],
  [
    120456,
    1,
    "y"
  ],
  [
    120457,
    1,
    "z"
  ],
  [
    120458,
    1,
    "a"
  ],
  [
    120459,
    1,
    "b"
  ],
  [
    120460,
    1,
    "c"
  ],
  [
    120461,
    1,
    "d"
  ],
  [
    120462,
    1,
    "e"
  ],
  [
    120463,
    1,
    "f"
  ],
  [
    120464,
    1,
    "g"
  ],
  [
    120465,
    1,
    "h"
  ],
  [
    120466,
    1,
    "i"
  ],
  [
    120467,
    1,
    "j"
  ],
  [
    120468,
    1,
    "k"
  ],
  [
    120469,
    1,
    "l"
  ],
  [
    120470,
    1,
    "m"
  ],
  [
    120471,
    1,
    "n"
  ],
  [
    120472,
    1,
    "o"
  ],
  [
    120473,
    1,
    "p"
  ],
  [
    120474,
    1,
    "q"
  ],
  [
    120475,
    1,
    "r"
  ],
  [
    120476,
    1,
    "s"
  ],
  [
    120477,
    1,
    "t"
  ],
  [
    120478,
    1,
    "u"
  ],
  [
    120479,
    1,
    "v"
  ],
  [
    120480,
    1,
    "w"
  ],
  [
    120481,
    1,
    "x"
  ],
  [
    120482,
    1,
    "y"
  ],
  [
    120483,
    1,
    "z"
  ],
  [
    120484,
    1,
    "ı"
  ],
  [
    120485,
    1,
    "ȷ"
  ],
  [
    [
      120486,
      120487
    ],
    3
  ],
  [
    120488,
    1,
    "α"
  ],
  [
    120489,
    1,
    "β"
  ],
  [
    120490,
    1,
    "γ"
  ],
  [
    120491,
    1,
    "δ"
  ],
  [
    120492,
    1,
    "ε"
  ],
  [
    120493,
    1,
    "ζ"
  ],
  [
    120494,
    1,
    "η"
  ],
  [
    120495,
    1,
    "θ"
  ],
  [
    120496,
    1,
    "ι"
  ],
  [
    120497,
    1,
    "κ"
  ],
  [
    120498,
    1,
    "λ"
  ],
  [
    120499,
    1,
    "μ"
  ],
  [
    120500,
    1,
    "ν"
  ],
  [
    120501,
    1,
    "ξ"
  ],
  [
    120502,
    1,
    "ο"
  ],
  [
    120503,
    1,
    "π"
  ],
  [
    120504,
    1,
    "ρ"
  ],
  [
    120505,
    1,
    "θ"
  ],
  [
    120506,
    1,
    "σ"
  ],
  [
    120507,
    1,
    "τ"
  ],
  [
    120508,
    1,
    "υ"
  ],
  [
    120509,
    1,
    "φ"
  ],
  [
    120510,
    1,
    "χ"
  ],
  [
    120511,
    1,
    "ψ"
  ],
  [
    120512,
    1,
    "ω"
  ],
  [
    120513,
    1,
    "∇"
  ],
  [
    120514,
    1,
    "α"
  ],
  [
    120515,
    1,
    "β"
  ],
  [
    120516,
    1,
    "γ"
  ],
  [
    120517,
    1,
    "δ"
  ],
  [
    120518,
    1,
    "ε"
  ],
  [
    120519,
    1,
    "ζ"
  ],
  [
    120520,
    1,
    "η"
  ],
  [
    120521,
    1,
    "θ"
  ],
  [
    120522,
    1,
    "ι"
  ],
  [
    120523,
    1,
    "κ"
  ],
  [
    120524,
    1,
    "λ"
  ],
  [
    120525,
    1,
    "μ"
  ],
  [
    120526,
    1,
    "ν"
  ],
  [
    120527,
    1,
    "ξ"
  ],
  [
    120528,
    1,
    "ο"
  ],
  [
    120529,
    1,
    "π"
  ],
  [
    120530,
    1,
    "ρ"
  ],
  [
    [
      120531,
      120532
    ],
    1,
    "σ"
  ],
  [
    120533,
    1,
    "τ"
  ],
  [
    120534,
    1,
    "υ"
  ],
  [
    120535,
    1,
    "φ"
  ],
  [
    120536,
    1,
    "χ"
  ],
  [
    120537,
    1,
    "ψ"
  ],
  [
    120538,
    1,
    "ω"
  ],
  [
    120539,
    1,
    "∂"
  ],
  [
    120540,
    1,
    "ε"
  ],
  [
    120541,
    1,
    "θ"
  ],
  [
    120542,
    1,
    "κ"
  ],
  [
    120543,
    1,
    "φ"
  ],
  [
    120544,
    1,
    "ρ"
  ],
  [
    120545,
    1,
    "π"
  ],
  [
    120546,
    1,
    "α"
  ],
  [
    120547,
    1,
    "β"
  ],
  [
    120548,
    1,
    "γ"
  ],
  [
    120549,
    1,
    "δ"
  ],
  [
    120550,
    1,
    "ε"
  ],
  [
    120551,
    1,
    "ζ"
  ],
  [
    120552,
    1,
    "η"
  ],
  [
    120553,
    1,
    "θ"
  ],
  [
    120554,
    1,
    "ι"
  ],
  [
    120555,
    1,
    "κ"
  ],
  [
    120556,
    1,
    "λ"
  ],
  [
    120557,
    1,
    "μ"
  ],
  [
    120558,
    1,
    "ν"
  ],
  [
    120559,
    1,
    "ξ"
  ],
  [
    120560,
    1,
    "ο"
  ],
  [
    120561,
    1,
    "π"
  ],
  [
    120562,
    1,
    "ρ"
  ],
  [
    120563,
    1,
    "θ"
  ],
  [
    120564,
    1,
    "σ"
  ],
  [
    120565,
    1,
    "τ"
  ],
  [
    120566,
    1,
    "υ"
  ],
  [
    120567,
    1,
    "φ"
  ],
  [
    120568,
    1,
    "χ"
  ],
  [
    120569,
    1,
    "ψ"
  ],
  [
    120570,
    1,
    "ω"
  ],
  [
    120571,
    1,
    "∇"
  ],
  [
    120572,
    1,
    "α"
  ],
  [
    120573,
    1,
    "β"
  ],
  [
    120574,
    1,
    "γ"
  ],
  [
    120575,
    1,
    "δ"
  ],
  [
    120576,
    1,
    "ε"
  ],
  [
    120577,
    1,
    "ζ"
  ],
  [
    120578,
    1,
    "η"
  ],
  [
    120579,
    1,
    "θ"
  ],
  [
    120580,
    1,
    "ι"
  ],
  [
    120581,
    1,
    "κ"
  ],
  [
    120582,
    1,
    "λ"
  ],
  [
    120583,
    1,
    "μ"
  ],
  [
    120584,
    1,
    "ν"
  ],
  [
    120585,
    1,
    "ξ"
  ],
  [
    120586,
    1,
    "ο"
  ],
  [
    120587,
    1,
    "π"
  ],
  [
    120588,
    1,
    "ρ"
  ],
  [
    [
      120589,
      120590
    ],
    1,
    "σ"
  ],
  [
    120591,
    1,
    "τ"
  ],
  [
    120592,
    1,
    "υ"
  ],
  [
    120593,
    1,
    "φ"
  ],
  [
    120594,
    1,
    "χ"
  ],
  [
    120595,
    1,
    "ψ"
  ],
  [
    120596,
    1,
    "ω"
  ],
  [
    120597,
    1,
    "∂"
  ],
  [
    120598,
    1,
    "ε"
  ],
  [
    120599,
    1,
    "θ"
  ],
  [
    120600,
    1,
    "κ"
  ],
  [
    120601,
    1,
    "φ"
  ],
  [
    120602,
    1,
    "ρ"
  ],
  [
    120603,
    1,
    "π"
  ],
  [
    120604,
    1,
    "α"
  ],
  [
    120605,
    1,
    "β"
  ],
  [
    120606,
    1,
    "γ"
  ],
  [
    120607,
    1,
    "δ"
  ],
  [
    120608,
    1,
    "ε"
  ],
  [
    120609,
    1,
    "ζ"
  ],
  [
    120610,
    1,
    "η"
  ],
  [
    120611,
    1,
    "θ"
  ],
  [
    120612,
    1,
    "ι"
  ],
  [
    120613,
    1,
    "κ"
  ],
  [
    120614,
    1,
    "λ"
  ],
  [
    120615,
    1,
    "μ"
  ],
  [
    120616,
    1,
    "ν"
  ],
  [
    120617,
    1,
    "ξ"
  ],
  [
    120618,
    1,
    "ο"
  ],
  [
    120619,
    1,
    "π"
  ],
  [
    120620,
    1,
    "ρ"
  ],
  [
    120621,
    1,
    "θ"
  ],
  [
    120622,
    1,
    "σ"
  ],
  [
    120623,
    1,
    "τ"
  ],
  [
    120624,
    1,
    "υ"
  ],
  [
    120625,
    1,
    "φ"
  ],
  [
    120626,
    1,
    "χ"
  ],
  [
    120627,
    1,
    "ψ"
  ],
  [
    120628,
    1,
    "ω"
  ],
  [
    120629,
    1,
    "∇"
  ],
  [
    120630,
    1,
    "α"
  ],
  [
    120631,
    1,
    "β"
  ],
  [
    120632,
    1,
    "γ"
  ],
  [
    120633,
    1,
    "δ"
  ],
  [
    120634,
    1,
    "ε"
  ],
  [
    120635,
    1,
    "ζ"
  ],
  [
    120636,
    1,
    "η"
  ],
  [
    120637,
    1,
    "θ"
  ],
  [
    120638,
    1,
    "ι"
  ],
  [
    120639,
    1,
    "κ"
  ],
  [
    120640,
    1,
    "λ"
  ],
  [
    120641,
    1,
    "μ"
  ],
  [
    120642,
    1,
    "ν"
  ],
  [
    120643,
    1,
    "ξ"
  ],
  [
    120644,
    1,
    "ο"
  ],
  [
    120645,
    1,
    "π"
  ],
  [
    120646,
    1,
    "ρ"
  ],
  [
    [
      120647,
      120648
    ],
    1,
    "σ"
  ],
  [
    120649,
    1,
    "τ"
  ],
  [
    120650,
    1,
    "υ"
  ],
  [
    120651,
    1,
    "φ"
  ],
  [
    120652,
    1,
    "χ"
  ],
  [
    120653,
    1,
    "ψ"
  ],
  [
    120654,
    1,
    "ω"
  ],
  [
    120655,
    1,
    "∂"
  ],
  [
    120656,
    1,
    "ε"
  ],
  [
    120657,
    1,
    "θ"
  ],
  [
    120658,
    1,
    "κ"
  ],
  [
    120659,
    1,
    "φ"
  ],
  [
    120660,
    1,
    "ρ"
  ],
  [
    120661,
    1,
    "π"
  ],
  [
    120662,
    1,
    "α"
  ],
  [
    120663,
    1,
    "β"
  ],
  [
    120664,
    1,
    "γ"
  ],
  [
    120665,
    1,
    "δ"
  ],
  [
    120666,
    1,
    "ε"
  ],
  [
    120667,
    1,
    "ζ"
  ],
  [
    120668,
    1,
    "η"
  ],
  [
    120669,
    1,
    "θ"
  ],
  [
    120670,
    1,
    "ι"
  ],
  [
    120671,
    1,
    "κ"
  ],
  [
    120672,
    1,
    "λ"
  ],
  [
    120673,
    1,
    "μ"
  ],
  [
    120674,
    1,
    "ν"
  ],
  [
    120675,
    1,
    "ξ"
  ],
  [
    120676,
    1,
    "ο"
  ],
  [
    120677,
    1,
    "π"
  ],
  [
    120678,
    1,
    "ρ"
  ],
  [
    120679,
    1,
    "θ"
  ],
  [
    120680,
    1,
    "σ"
  ],
  [
    120681,
    1,
    "τ"
  ],
  [
    120682,
    1,
    "υ"
  ],
  [
    120683,
    1,
    "φ"
  ],
  [
    120684,
    1,
    "χ"
  ],
  [
    120685,
    1,
    "ψ"
  ],
  [
    120686,
    1,
    "ω"
  ],
  [
    120687,
    1,
    "∇"
  ],
  [
    120688,
    1,
    "α"
  ],
  [
    120689,
    1,
    "β"
  ],
  [
    120690,
    1,
    "γ"
  ],
  [
    120691,
    1,
    "δ"
  ],
  [
    120692,
    1,
    "ε"
  ],
  [
    120693,
    1,
    "ζ"
  ],
  [
    120694,
    1,
    "η"
  ],
  [
    120695,
    1,
    "θ"
  ],
  [
    120696,
    1,
    "ι"
  ],
  [
    120697,
    1,
    "κ"
  ],
  [
    120698,
    1,
    "λ"
  ],
  [
    120699,
    1,
    "μ"
  ],
  [
    120700,
    1,
    "ν"
  ],
  [
    120701,
    1,
    "ξ"
  ],
  [
    120702,
    1,
    "ο"
  ],
  [
    120703,
    1,
    "π"
  ],
  [
    120704,
    1,
    "ρ"
  ],
  [
    [
      120705,
      120706
    ],
    1,
    "σ"
  ],
  [
    120707,
    1,
    "τ"
  ],
  [
    120708,
    1,
    "υ"
  ],
  [
    120709,
    1,
    "φ"
  ],
  [
    120710,
    1,
    "χ"
  ],
  [
    120711,
    1,
    "ψ"
  ],
  [
    120712,
    1,
    "ω"
  ],
  [
    120713,
    1,
    "∂"
  ],
  [
    120714,
    1,
    "ε"
  ],
  [
    120715,
    1,
    "θ"
  ],
  [
    120716,
    1,
    "κ"
  ],
  [
    120717,
    1,
    "φ"
  ],
  [
    120718,
    1,
    "ρ"
  ],
  [
    120719,
    1,
    "π"
  ],
  [
    120720,
    1,
    "α"
  ],
  [
    120721,
    1,
    "β"
  ],
  [
    120722,
    1,
    "γ"
  ],
  [
    120723,
    1,
    "δ"
  ],
  [
    120724,
    1,
    "ε"
  ],
  [
    120725,
    1,
    "ζ"
  ],
  [
    120726,
    1,
    "η"
  ],
  [
    120727,
    1,
    "θ"
  ],
  [
    120728,
    1,
    "ι"
  ],
  [
    120729,
    1,
    "κ"
  ],
  [
    120730,
    1,
    "λ"
  ],
  [
    120731,
    1,
    "μ"
  ],
  [
    120732,
    1,
    "ν"
  ],
  [
    120733,
    1,
    "ξ"
  ],
  [
    120734,
    1,
    "ο"
  ],
  [
    120735,
    1,
    "π"
  ],
  [
    120736,
    1,
    "ρ"
  ],
  [
    120737,
    1,
    "θ"
  ],
  [
    120738,
    1,
    "σ"
  ],
  [
    120739,
    1,
    "τ"
  ],
  [
    120740,
    1,
    "υ"
  ],
  [
    120741,
    1,
    "φ"
  ],
  [
    120742,
    1,
    "χ"
  ],
  [
    120743,
    1,
    "ψ"
  ],
  [
    120744,
    1,
    "ω"
  ],
  [
    120745,
    1,
    "∇"
  ],
  [
    120746,
    1,
    "α"
  ],
  [
    120747,
    1,
    "β"
  ],
  [
    120748,
    1,
    "γ"
  ],
  [
    120749,
    1,
    "δ"
  ],
  [
    120750,
    1,
    "ε"
  ],
  [
    120751,
    1,
    "ζ"
  ],
  [
    120752,
    1,
    "η"
  ],
  [
    120753,
    1,
    "θ"
  ],
  [
    120754,
    1,
    "ι"
  ],
  [
    120755,
    1,
    "κ"
  ],
  [
    120756,
    1,
    "λ"
  ],
  [
    120757,
    1,
    "μ"
  ],
  [
    120758,
    1,
    "ν"
  ],
  [
    120759,
    1,
    "ξ"
  ],
  [
    120760,
    1,
    "ο"
  ],
  [
    120761,
    1,
    "π"
  ],
  [
    120762,
    1,
    "ρ"
  ],
  [
    [
      120763,
      120764
    ],
    1,
    "σ"
  ],
  [
    120765,
    1,
    "τ"
  ],
  [
    120766,
    1,
    "υ"
  ],
  [
    120767,
    1,
    "φ"
  ],
  [
    120768,
    1,
    "χ"
  ],
  [
    120769,
    1,
    "ψ"
  ],
  [
    120770,
    1,
    "ω"
  ],
  [
    120771,
    1,
    "∂"
  ],
  [
    120772,
    1,
    "ε"
  ],
  [
    120773,
    1,
    "θ"
  ],
  [
    120774,
    1,
    "κ"
  ],
  [
    120775,
    1,
    "φ"
  ],
  [
    120776,
    1,
    "ρ"
  ],
  [
    120777,
    1,
    "π"
  ],
  [
    [
      120778,
      120779
    ],
    1,
    "ϝ"
  ],
  [
    [
      120780,
      120781
    ],
    3
  ],
  [
    120782,
    1,
    "0"
  ],
  [
    120783,
    1,
    "1"
  ],
  [
    120784,
    1,
    "2"
  ],
  [
    120785,
    1,
    "3"
  ],
  [
    120786,
    1,
    "4"
  ],
  [
    120787,
    1,
    "5"
  ],
  [
    120788,
    1,
    "6"
  ],
  [
    120789,
    1,
    "7"
  ],
  [
    120790,
    1,
    "8"
  ],
  [
    120791,
    1,
    "9"
  ],
  [
    120792,
    1,
    "0"
  ],
  [
    120793,
    1,
    "1"
  ],
  [
    120794,
    1,
    "2"
  ],
  [
    120795,
    1,
    "3"
  ],
  [
    120796,
    1,
    "4"
  ],
  [
    120797,
    1,
    "5"
  ],
  [
    120798,
    1,
    "6"
  ],
  [
    120799,
    1,
    "7"
  ],
  [
    120800,
    1,
    "8"
  ],
  [
    120801,
    1,
    "9"
  ],
  [
    120802,
    1,
    "0"
  ],
  [
    120803,
    1,
    "1"
  ],
  [
    120804,
    1,
    "2"
  ],
  [
    120805,
    1,
    "3"
  ],
  [
    120806,
    1,
    "4"
  ],
  [
    120807,
    1,
    "5"
  ],
  [
    120808,
    1,
    "6"
  ],
  [
    120809,
    1,
    "7"
  ],
  [
    120810,
    1,
    "8"
  ],
  [
    120811,
    1,
    "9"
  ],
  [
    120812,
    1,
    "0"
  ],
  [
    120813,
    1,
    "1"
  ],
  [
    120814,
    1,
    "2"
  ],
  [
    120815,
    1,
    "3"
  ],
  [
    120816,
    1,
    "4"
  ],
  [
    120817,
    1,
    "5"
  ],
  [
    120818,
    1,
    "6"
  ],
  [
    120819,
    1,
    "7"
  ],
  [
    120820,
    1,
    "8"
  ],
  [
    120821,
    1,
    "9"
  ],
  [
    120822,
    1,
    "0"
  ],
  [
    120823,
    1,
    "1"
  ],
  [
    120824,
    1,
    "2"
  ],
  [
    120825,
    1,
    "3"
  ],
  [
    120826,
    1,
    "4"
  ],
  [
    120827,
    1,
    "5"
  ],
  [
    120828,
    1,
    "6"
  ],
  [
    120829,
    1,
    "7"
  ],
  [
    120830,
    1,
    "8"
  ],
  [
    120831,
    1,
    "9"
  ],
  [
    [
      120832,
      121343
    ],
    2
  ],
  [
    [
      121344,
      121398
    ],
    2
  ],
  [
    [
      121399,
      121402
    ],
    2
  ],
  [
    [
      121403,
      121452
    ],
    2
  ],
  [
    [
      121453,
      121460
    ],
    2
  ],
  [
    121461,
    2
  ],
  [
    [
      121462,
      121475
    ],
    2
  ],
  [
    121476,
    2
  ],
  [
    [
      121477,
      121483
    ],
    2
  ],
  [
    [
      121484,
      121498
    ],
    3
  ],
  [
    [
      121499,
      121503
    ],
    2
  ],
  [
    121504,
    3
  ],
  [
    [
      121505,
      121519
    ],
    2
  ],
  [
    [
      121520,
      122623
    ],
    3
  ],
  [
    [
      122624,
      122654
    ],
    2
  ],
  [
    [
      122655,
      122660
    ],
    3
  ],
  [
    [
      122661,
      122666
    ],
    2
  ],
  [
    [
      122667,
      122879
    ],
    3
  ],
  [
    [
      122880,
      122886
    ],
    2
  ],
  [
    122887,
    3
  ],
  [
    [
      122888,
      122904
    ],
    2
  ],
  [
    [
      122905,
      122906
    ],
    3
  ],
  [
    [
      122907,
      122913
    ],
    2
  ],
  [
    122914,
    3
  ],
  [
    [
      122915,
      122916
    ],
    2
  ],
  [
    122917,
    3
  ],
  [
    [
      122918,
      122922
    ],
    2
  ],
  [
    [
      122923,
      122927
    ],
    3
  ],
  [
    122928,
    1,
    "а"
  ],
  [
    122929,
    1,
    "б"
  ],
  [
    122930,
    1,
    "в"
  ],
  [
    122931,
    1,
    "г"
  ],
  [
    122932,
    1,
    "д"
  ],
  [
    122933,
    1,
    "е"
  ],
  [
    122934,
    1,
    "ж"
  ],
  [
    122935,
    1,
    "з"
  ],
  [
    122936,
    1,
    "и"
  ],
  [
    122937,
    1,
    "к"
  ],
  [
    122938,
    1,
    "л"
  ],
  [
    122939,
    1,
    "м"
  ],
  [
    122940,
    1,
    "о"
  ],
  [
    122941,
    1,
    "п"
  ],
  [
    122942,
    1,
    "р"
  ],
  [
    122943,
    1,
    "с"
  ],
  [
    122944,
    1,
    "т"
  ],
  [
    122945,
    1,
    "у"
  ],
  [
    122946,
    1,
    "ф"
  ],
  [
    122947,
    1,
    "х"
  ],
  [
    122948,
    1,
    "ц"
  ],
  [
    122949,
    1,
    "ч"
  ],
  [
    122950,
    1,
    "ш"
  ],
  [
    122951,
    1,
    "ы"
  ],
  [
    122952,
    1,
    "э"
  ],
  [
    122953,
    1,
    "ю"
  ],
  [
    122954,
    1,
    "ꚉ"
  ],
  [
    122955,
    1,
    "ә"
  ],
  [
    122956,
    1,
    "і"
  ],
  [
    122957,
    1,
    "ј"
  ],
  [
    122958,
    1,
    "ө"
  ],
  [
    122959,
    1,
    "ү"
  ],
  [
    122960,
    1,
    "ӏ"
  ],
  [
    122961,
    1,
    "а"
  ],
  [
    122962,
    1,
    "б"
  ],
  [
    122963,
    1,
    "в"
  ],
  [
    122964,
    1,
    "г"
  ],
  [
    122965,
    1,
    "д"
  ],
  [
    122966,
    1,
    "е"
  ],
  [
    122967,
    1,
    "ж"
  ],
  [
    122968,
    1,
    "з"
  ],
  [
    122969,
    1,
    "и"
  ],
  [
    122970,
    1,
    "к"
  ],
  [
    122971,
    1,
    "л"
  ],
  [
    122972,
    1,
    "о"
  ],
  [
    122973,
    1,
    "п"
  ],
  [
    122974,
    1,
    "с"
  ],
  [
    122975,
    1,
    "у"
  ],
  [
    122976,
    1,
    "ф"
  ],
  [
    122977,
    1,
    "х"
  ],
  [
    122978,
    1,
    "ц"
  ],
  [
    122979,
    1,
    "ч"
  ],
  [
    122980,
    1,
    "ш"
  ],
  [
    122981,
    1,
    "ъ"
  ],
  [
    122982,
    1,
    "ы"
  ],
  [
    122983,
    1,
    "ґ"
  ],
  [
    122984,
    1,
    "і"
  ],
  [
    122985,
    1,
    "ѕ"
  ],
  [
    122986,
    1,
    "џ"
  ],
  [
    122987,
    1,
    "ҫ"
  ],
  [
    122988,
    1,
    "ꙑ"
  ],
  [
    122989,
    1,
    "ұ"
  ],
  [
    [
      122990,
      123022
    ],
    3
  ],
  [
    123023,
    2
  ],
  [
    [
      123024,
      123135
    ],
    3
  ],
  [
    [
      123136,
      123180
    ],
    2
  ],
  [
    [
      123181,
      123183
    ],
    3
  ],
  [
    [
      123184,
      123197
    ],
    2
  ],
  [
    [
      123198,
      123199
    ],
    3
  ],
  [
    [
      123200,
      123209
    ],
    2
  ],
  [
    [
      123210,
      123213
    ],
    3
  ],
  [
    123214,
    2
  ],
  [
    123215,
    2
  ],
  [
    [
      123216,
      123535
    ],
    3
  ],
  [
    [
      123536,
      123566
    ],
    2
  ],
  [
    [
      123567,
      123583
    ],
    3
  ],
  [
    [
      123584,
      123641
    ],
    2
  ],
  [
    [
      123642,
      123646
    ],
    3
  ],
  [
    123647,
    2
  ],
  [
    [
      123648,
      124111
    ],
    3
  ],
  [
    [
      124112,
      124153
    ],
    2
  ],
  [
    [
      124154,
      124895
    ],
    3
  ],
  [
    [
      124896,
      124902
    ],
    2
  ],
  [
    124903,
    3
  ],
  [
    [
      124904,
      124907
    ],
    2
  ],
  [
    124908,
    3
  ],
  [
    [
      124909,
      124910
    ],
    2
  ],
  [
    124911,
    3
  ],
  [
    [
      124912,
      124926
    ],
    2
  ],
  [
    124927,
    3
  ],
  [
    [
      124928,
      125124
    ],
    2
  ],
  [
    [
      125125,
      125126
    ],
    3
  ],
  [
    [
      125127,
      125135
    ],
    2
  ],
  [
    [
      125136,
      125142
    ],
    2
  ],
  [
    [
      125143,
      125183
    ],
    3
  ],
  [
    125184,
    1,
    "𞤢"
  ],
  [
    125185,
    1,
    "𞤣"
  ],
  [
    125186,
    1,
    "𞤤"
  ],
  [
    125187,
    1,
    "𞤥"
  ],
  [
    125188,
    1,
    "𞤦"
  ],
  [
    125189,
    1,
    "𞤧"
  ],
  [
    125190,
    1,
    "𞤨"
  ],
  [
    125191,
    1,
    "𞤩"
  ],
  [
    125192,
    1,
    "𞤪"
  ],
  [
    125193,
    1,
    "𞤫"
  ],
  [
    125194,
    1,
    "𞤬"
  ],
  [
    125195,
    1,
    "𞤭"
  ],
  [
    125196,
    1,
    "𞤮"
  ],
  [
    125197,
    1,
    "𞤯"
  ],
  [
    125198,
    1,
    "𞤰"
  ],
  [
    125199,
    1,
    "𞤱"
  ],
  [
    125200,
    1,
    "𞤲"
  ],
  [
    125201,
    1,
    "𞤳"
  ],
  [
    125202,
    1,
    "𞤴"
  ],
  [
    125203,
    1,
    "𞤵"
  ],
  [
    125204,
    1,
    "𞤶"
  ],
  [
    125205,
    1,
    "𞤷"
  ],
  [
    125206,
    1,
    "𞤸"
  ],
  [
    125207,
    1,
    "𞤹"
  ],
  [
    125208,
    1,
    "𞤺"
  ],
  [
    125209,
    1,
    "𞤻"
  ],
  [
    125210,
    1,
    "𞤼"
  ],
  [
    125211,
    1,
    "𞤽"
  ],
  [
    125212,
    1,
    "𞤾"
  ],
  [
    125213,
    1,
    "𞤿"
  ],
  [
    125214,
    1,
    "𞥀"
  ],
  [
    125215,
    1,
    "𞥁"
  ],
  [
    125216,
    1,
    "𞥂"
  ],
  [
    125217,
    1,
    "𞥃"
  ],
  [
    [
      125218,
      125258
    ],
    2
  ],
  [
    125259,
    2
  ],
  [
    [
      125260,
      125263
    ],
    3
  ],
  [
    [
      125264,
      125273
    ],
    2
  ],
  [
    [
      125274,
      125277
    ],
    3
  ],
  [
    [
      125278,
      125279
    ],
    2
  ],
  [
    [
      125280,
      126064
    ],
    3
  ],
  [
    [
      126065,
      126132
    ],
    2
  ],
  [
    [
      126133,
      126208
    ],
    3
  ],
  [
    [
      126209,
      126269
    ],
    2
  ],
  [
    [
      126270,
      126463
    ],
    3
  ],
  [
    126464,
    1,
    "ا"
  ],
  [
    126465,
    1,
    "ب"
  ],
  [
    126466,
    1,
    "ج"
  ],
  [
    126467,
    1,
    "د"
  ],
  [
    126468,
    3
  ],
  [
    126469,
    1,
    "و"
  ],
  [
    126470,
    1,
    "ز"
  ],
  [
    126471,
    1,
    "ح"
  ],
  [
    126472,
    1,
    "ط"
  ],
  [
    126473,
    1,
    "ي"
  ],
  [
    126474,
    1,
    "ك"
  ],
  [
    126475,
    1,
    "ل"
  ],
  [
    126476,
    1,
    "م"
  ],
  [
    126477,
    1,
    "ن"
  ],
  [
    126478,
    1,
    "س"
  ],
  [
    126479,
    1,
    "ع"
  ],
  [
    126480,
    1,
    "ف"
  ],
  [
    126481,
    1,
    "ص"
  ],
  [
    126482,
    1,
    "ق"
  ],
  [
    126483,
    1,
    "ر"
  ],
  [
    126484,
    1,
    "ش"
  ],
  [
    126485,
    1,
    "ت"
  ],
  [
    126486,
    1,
    "ث"
  ],
  [
    126487,
    1,
    "خ"
  ],
  [
    126488,
    1,
    "ذ"
  ],
  [
    126489,
    1,
    "ض"
  ],
  [
    126490,
    1,
    "ظ"
  ],
  [
    126491,
    1,
    "غ"
  ],
  [
    126492,
    1,
    "ٮ"
  ],
  [
    126493,
    1,
    "ں"
  ],
  [
    126494,
    1,
    "ڡ"
  ],
  [
    126495,
    1,
    "ٯ"
  ],
  [
    126496,
    3
  ],
  [
    126497,
    1,
    "ب"
  ],
  [
    126498,
    1,
    "ج"
  ],
  [
    126499,
    3
  ],
  [
    126500,
    1,
    "ه"
  ],
  [
    [
      126501,
      126502
    ],
    3
  ],
  [
    126503,
    1,
    "ح"
  ],
  [
    126504,
    3
  ],
  [
    126505,
    1,
    "ي"
  ],
  [
    126506,
    1,
    "ك"
  ],
  [
    126507,
    1,
    "ل"
  ],
  [
    126508,
    1,
    "م"
  ],
  [
    126509,
    1,
    "ن"
  ],
  [
    126510,
    1,
    "س"
  ],
  [
    126511,
    1,
    "ع"
  ],
  [
    126512,
    1,
    "ف"
  ],
  [
    126513,
    1,
    "ص"
  ],
  [
    126514,
    1,
    "ق"
  ],
  [
    126515,
    3
  ],
  [
    126516,
    1,
    "ش"
  ],
  [
    126517,
    1,
    "ت"
  ],
  [
    126518,
    1,
    "ث"
  ],
  [
    126519,
    1,
    "خ"
  ],
  [
    126520,
    3
  ],
  [
    126521,
    1,
    "ض"
  ],
  [
    126522,
    3
  ],
  [
    126523,
    1,
    "غ"
  ],
  [
    [
      126524,
      126529
    ],
    3
  ],
  [
    126530,
    1,
    "ج"
  ],
  [
    [
      126531,
      126534
    ],
    3
  ],
  [
    126535,
    1,
    "ح"
  ],
  [
    126536,
    3
  ],
  [
    126537,
    1,
    "ي"
  ],
  [
    126538,
    3
  ],
  [
    126539,
    1,
    "ل"
  ],
  [
    126540,
    3
  ],
  [
    126541,
    1,
    "ن"
  ],
  [
    126542,
    1,
    "س"
  ],
  [
    126543,
    1,
    "ع"
  ],
  [
    126544,
    3
  ],
  [
    126545,
    1,
    "ص"
  ],
  [
    126546,
    1,
    "ق"
  ],
  [
    126547,
    3
  ],
  [
    126548,
    1,
    "ش"
  ],
  [
    [
      126549,
      126550
    ],
    3
  ],
  [
    126551,
    1,
    "خ"
  ],
  [
    126552,
    3
  ],
  [
    126553,
    1,
    "ض"
  ],
  [
    126554,
    3
  ],
  [
    126555,
    1,
    "غ"
  ],
  [
    126556,
    3
  ],
  [
    126557,
    1,
    "ں"
  ],
  [
    126558,
    3
  ],
  [
    126559,
    1,
    "ٯ"
  ],
  [
    126560,
    3
  ],
  [
    126561,
    1,
    "ب"
  ],
  [
    126562,
    1,
    "ج"
  ],
  [
    126563,
    3
  ],
  [
    126564,
    1,
    "ه"
  ],
  [
    [
      126565,
      126566
    ],
    3
  ],
  [
    126567,
    1,
    "ح"
  ],
  [
    126568,
    1,
    "ط"
  ],
  [
    126569,
    1,
    "ي"
  ],
  [
    126570,
    1,
    "ك"
  ],
  [
    126571,
    3
  ],
  [
    126572,
    1,
    "م"
  ],
  [
    126573,
    1,
    "ن"
  ],
  [
    126574,
    1,
    "س"
  ],
  [
    126575,
    1,
    "ع"
  ],
  [
    126576,
    1,
    "ف"
  ],
  [
    126577,
    1,
    "ص"
  ],
  [
    126578,
    1,
    "ق"
  ],
  [
    126579,
    3
  ],
  [
    126580,
    1,
    "ش"
  ],
  [
    126581,
    1,
    "ت"
  ],
  [
    126582,
    1,
    "ث"
  ],
  [
    126583,
    1,
    "خ"
  ],
  [
    126584,
    3
  ],
  [
    126585,
    1,
    "ض"
  ],
  [
    126586,
    1,
    "ظ"
  ],
  [
    126587,
    1,
    "غ"
  ],
  [
    126588,
    1,
    "ٮ"
  ],
  [
    126589,
    3
  ],
  [
    126590,
    1,
    "ڡ"
  ],
  [
    126591,
    3
  ],
  [
    126592,
    1,
    "ا"
  ],
  [
    126593,
    1,
    "ب"
  ],
  [
    126594,
    1,
    "ج"
  ],
  [
    126595,
    1,
    "د"
  ],
  [
    126596,
    1,
    "ه"
  ],
  [
    126597,
    1,
    "و"
  ],
  [
    126598,
    1,
    "ز"
  ],
  [
    126599,
    1,
    "ح"
  ],
  [
    126600,
    1,
    "ط"
  ],
  [
    126601,
    1,
    "ي"
  ],
  [
    126602,
    3
  ],
  [
    126603,
    1,
    "ل"
  ],
  [
    126604,
    1,
    "م"
  ],
  [
    126605,
    1,
    "ن"
  ],
  [
    126606,
    1,
    "س"
  ],
  [
    126607,
    1,
    "ع"
  ],
  [
    126608,
    1,
    "ف"
  ],
  [
    126609,
    1,
    "ص"
  ],
  [
    126610,
    1,
    "ق"
  ],
  [
    126611,
    1,
    "ر"
  ],
  [
    126612,
    1,
    "ش"
  ],
  [
    126613,
    1,
    "ت"
  ],
  [
    126614,
    1,
    "ث"
  ],
  [
    126615,
    1,
    "خ"
  ],
  [
    126616,
    1,
    "ذ"
  ],
  [
    126617,
    1,
    "ض"
  ],
  [
    126618,
    1,
    "ظ"
  ],
  [
    126619,
    1,
    "غ"
  ],
  [
    [
      126620,
      126624
    ],
    3
  ],
  [
    126625,
    1,
    "ب"
  ],
  [
    126626,
    1,
    "ج"
  ],
  [
    126627,
    1,
    "د"
  ],
  [
    126628,
    3
  ],
  [
    126629,
    1,
    "و"
  ],
  [
    126630,
    1,
    "ز"
  ],
  [
    126631,
    1,
    "ح"
  ],
  [
    126632,
    1,
    "ط"
  ],
  [
    126633,
    1,
    "ي"
  ],
  [
    126634,
    3
  ],
  [
    126635,
    1,
    "ل"
  ],
  [
    126636,
    1,
    "م"
  ],
  [
    126637,
    1,
    "ن"
  ],
  [
    126638,
    1,
    "س"
  ],
  [
    126639,
    1,
    "ع"
  ],
  [
    126640,
    1,
    "ف"
  ],
  [
    126641,
    1,
    "ص"
  ],
  [
    126642,
    1,
    "ق"
  ],
  [
    126643,
    1,
    "ر"
  ],
  [
    126644,
    1,
    "ش"
  ],
  [
    126645,
    1,
    "ت"
  ],
  [
    126646,
    1,
    "ث"
  ],
  [
    126647,
    1,
    "خ"
  ],
  [
    126648,
    1,
    "ذ"
  ],
  [
    126649,
    1,
    "ض"
  ],
  [
    126650,
    1,
    "ظ"
  ],
  [
    126651,
    1,
    "غ"
  ],
  [
    [
      126652,
      126703
    ],
    3
  ],
  [
    [
      126704,
      126705
    ],
    2
  ],
  [
    [
      126706,
      126975
    ],
    3
  ],
  [
    [
      126976,
      127019
    ],
    2
  ],
  [
    [
      127020,
      127023
    ],
    3
  ],
  [
    [
      127024,
      127123
    ],
    2
  ],
  [
    [
      127124,
      127135
    ],
    3
  ],
  [
    [
      127136,
      127150
    ],
    2
  ],
  [
    [
      127151,
      127152
    ],
    3
  ],
  [
    [
      127153,
      127166
    ],
    2
  ],
  [
    127167,
    2
  ],
  [
    127168,
    3
  ],
  [
    [
      127169,
      127183
    ],
    2
  ],
  [
    127184,
    3
  ],
  [
    [
      127185,
      127199
    ],
    2
  ],
  [
    [
      127200,
      127221
    ],
    2
  ],
  [
    [
      127222,
      127231
    ],
    3
  ],
  [
    127232,
    3
  ],
  [
    127233,
    5,
    "0,"
  ],
  [
    127234,
    5,
    "1,"
  ],
  [
    127235,
    5,
    "2,"
  ],
  [
    127236,
    5,
    "3,"
  ],
  [
    127237,
    5,
    "4,"
  ],
  [
    127238,
    5,
    "5,"
  ],
  [
    127239,
    5,
    "6,"
  ],
  [
    127240,
    5,
    "7,"
  ],
  [
    127241,
    5,
    "8,"
  ],
  [
    127242,
    5,
    "9,"
  ],
  [
    [
      127243,
      127244
    ],
    2
  ],
  [
    [
      127245,
      127247
    ],
    2
  ],
  [
    127248,
    5,
    "(a)"
  ],
  [
    127249,
    5,
    "(b)"
  ],
  [
    127250,
    5,
    "(c)"
  ],
  [
    127251,
    5,
    "(d)"
  ],
  [
    127252,
    5,
    "(e)"
  ],
  [
    127253,
    5,
    "(f)"
  ],
  [
    127254,
    5,
    "(g)"
  ],
  [
    127255,
    5,
    "(h)"
  ],
  [
    127256,
    5,
    "(i)"
  ],
  [
    127257,
    5,
    "(j)"
  ],
  [
    127258,
    5,
    "(k)"
  ],
  [
    127259,
    5,
    "(l)"
  ],
  [
    127260,
    5,
    "(m)"
  ],
  [
    127261,
    5,
    "(n)"
  ],
  [
    127262,
    5,
    "(o)"
  ],
  [
    127263,
    5,
    "(p)"
  ],
  [
    127264,
    5,
    "(q)"
  ],
  [
    127265,
    5,
    "(r)"
  ],
  [
    127266,
    5,
    "(s)"
  ],
  [
    127267,
    5,
    "(t)"
  ],
  [
    127268,
    5,
    "(u)"
  ],
  [
    127269,
    5,
    "(v)"
  ],
  [
    127270,
    5,
    "(w)"
  ],
  [
    127271,
    5,
    "(x)"
  ],
  [
    127272,
    5,
    "(y)"
  ],
  [
    127273,
    5,
    "(z)"
  ],
  [
    127274,
    1,
    "〔s〕"
  ],
  [
    127275,
    1,
    "c"
  ],
  [
    127276,
    1,
    "r"
  ],
  [
    127277,
    1,
    "cd"
  ],
  [
    127278,
    1,
    "wz"
  ],
  [
    127279,
    2
  ],
  [
    127280,
    1,
    "a"
  ],
  [
    127281,
    1,
    "b"
  ],
  [
    127282,
    1,
    "c"
  ],
  [
    127283,
    1,
    "d"
  ],
  [
    127284,
    1,
    "e"
  ],
  [
    127285,
    1,
    "f"
  ],
  [
    127286,
    1,
    "g"
  ],
  [
    127287,
    1,
    "h"
  ],
  [
    127288,
    1,
    "i"
  ],
  [
    127289,
    1,
    "j"
  ],
  [
    127290,
    1,
    "k"
  ],
  [
    127291,
    1,
    "l"
  ],
  [
    127292,
    1,
    "m"
  ],
  [
    127293,
    1,
    "n"
  ],
  [
    127294,
    1,
    "o"
  ],
  [
    127295,
    1,
    "p"
  ],
  [
    127296,
    1,
    "q"
  ],
  [
    127297,
    1,
    "r"
  ],
  [
    127298,
    1,
    "s"
  ],
  [
    127299,
    1,
    "t"
  ],
  [
    127300,
    1,
    "u"
  ],
  [
    127301,
    1,
    "v"
  ],
  [
    127302,
    1,
    "w"
  ],
  [
    127303,
    1,
    "x"
  ],
  [
    127304,
    1,
    "y"
  ],
  [
    127305,
    1,
    "z"
  ],
  [
    127306,
    1,
    "hv"
  ],
  [
    127307,
    1,
    "mv"
  ],
  [
    127308,
    1,
    "sd"
  ],
  [
    127309,
    1,
    "ss"
  ],
  [
    127310,
    1,
    "ppv"
  ],
  [
    127311,
    1,
    "wc"
  ],
  [
    [
      127312,
      127318
    ],
    2
  ],
  [
    127319,
    2
  ],
  [
    [
      127320,
      127326
    ],
    2
  ],
  [
    127327,
    2
  ],
  [
    [
      127328,
      127337
    ],
    2
  ],
  [
    127338,
    1,
    "mc"
  ],
  [
    127339,
    1,
    "md"
  ],
  [
    127340,
    1,
    "mr"
  ],
  [
    [
      127341,
      127343
    ],
    2
  ],
  [
    [
      127344,
      127352
    ],
    2
  ],
  [
    127353,
    2
  ],
  [
    127354,
    2
  ],
  [
    [
      127355,
      127356
    ],
    2
  ],
  [
    [
      127357,
      127358
    ],
    2
  ],
  [
    127359,
    2
  ],
  [
    [
      127360,
      127369
    ],
    2
  ],
  [
    [
      127370,
      127373
    ],
    2
  ],
  [
    [
      127374,
      127375
    ],
    2
  ],
  [
    127376,
    1,
    "dj"
  ],
  [
    [
      127377,
      127386
    ],
    2
  ],
  [
    [
      127387,
      127404
    ],
    2
  ],
  [
    127405,
    2
  ],
  [
    [
      127406,
      127461
    ],
    3
  ],
  [
    [
      127462,
      127487
    ],
    2
  ],
  [
    127488,
    1,
    "ほか"
  ],
  [
    127489,
    1,
    "ココ"
  ],
  [
    127490,
    1,
    "サ"
  ],
  [
    [
      127491,
      127503
    ],
    3
  ],
  [
    127504,
    1,
    "手"
  ],
  [
    127505,
    1,
    "字"
  ],
  [
    127506,
    1,
    "双"
  ],
  [
    127507,
    1,
    "デ"
  ],
  [
    127508,
    1,
    "二"
  ],
  [
    127509,
    1,
    "多"
  ],
  [
    127510,
    1,
    "解"
  ],
  [
    127511,
    1,
    "天"
  ],
  [
    127512,
    1,
    "交"
  ],
  [
    127513,
    1,
    "映"
  ],
  [
    127514,
    1,
    "無"
  ],
  [
    127515,
    1,
    "料"
  ],
  [
    127516,
    1,
    "前"
  ],
  [
    127517,
    1,
    "後"
  ],
  [
    127518,
    1,
    "再"
  ],
  [
    127519,
    1,
    "新"
  ],
  [
    127520,
    1,
    "初"
  ],
  [
    127521,
    1,
    "終"
  ],
  [
    127522,
    1,
    "生"
  ],
  [
    127523,
    1,
    "販"
  ],
  [
    127524,
    1,
    "声"
  ],
  [
    127525,
    1,
    "吹"
  ],
  [
    127526,
    1,
    "演"
  ],
  [
    127527,
    1,
    "投"
  ],
  [
    127528,
    1,
    "捕"
  ],
  [
    127529,
    1,
    "一"
  ],
  [
    127530,
    1,
    "三"
  ],
  [
    127531,
    1,
    "遊"
  ],
  [
    127532,
    1,
    "左"
  ],
  [
    127533,
    1,
    "中"
  ],
  [
    127534,
    1,
    "右"
  ],
  [
    127535,
    1,
    "指"
  ],
  [
    127536,
    1,
    "走"
  ],
  [
    127537,
    1,
    "打"
  ],
  [
    127538,
    1,
    "禁"
  ],
  [
    127539,
    1,
    "空"
  ],
  [
    127540,
    1,
    "合"
  ],
  [
    127541,
    1,
    "満"
  ],
  [
    127542,
    1,
    "有"
  ],
  [
    127543,
    1,
    "月"
  ],
  [
    127544,
    1,
    "申"
  ],
  [
    127545,
    1,
    "割"
  ],
  [
    127546,
    1,
    "営"
  ],
  [
    127547,
    1,
    "配"
  ],
  [
    [
      127548,
      127551
    ],
    3
  ],
  [
    127552,
    1,
    "〔本〕"
  ],
  [
    127553,
    1,
    "〔三〕"
  ],
  [
    127554,
    1,
    "〔二〕"
  ],
  [
    127555,
    1,
    "〔安〕"
  ],
  [
    127556,
    1,
    "〔点〕"
  ],
  [
    127557,
    1,
    "〔打〕"
  ],
  [
    127558,
    1,
    "〔盗〕"
  ],
  [
    127559,
    1,
    "〔勝〕"
  ],
  [
    127560,
    1,
    "〔敗〕"
  ],
  [
    [
      127561,
      127567
    ],
    3
  ],
  [
    127568,
    1,
    "得"
  ],
  [
    127569,
    1,
    "可"
  ],
  [
    [
      127570,
      127583
    ],
    3
  ],
  [
    [
      127584,
      127589
    ],
    2
  ],
  [
    [
      127590,
      127743
    ],
    3
  ],
  [
    [
      127744,
      127776
    ],
    2
  ],
  [
    [
      127777,
      127788
    ],
    2
  ],
  [
    [
      127789,
      127791
    ],
    2
  ],
  [
    [
      127792,
      127797
    ],
    2
  ],
  [
    127798,
    2
  ],
  [
    [
      127799,
      127868
    ],
    2
  ],
  [
    127869,
    2
  ],
  [
    [
      127870,
      127871
    ],
    2
  ],
  [
    [
      127872,
      127891
    ],
    2
  ],
  [
    [
      127892,
      127903
    ],
    2
  ],
  [
    [
      127904,
      127940
    ],
    2
  ],
  [
    127941,
    2
  ],
  [
    [
      127942,
      127946
    ],
    2
  ],
  [
    [
      127947,
      127950
    ],
    2
  ],
  [
    [
      127951,
      127955
    ],
    2
  ],
  [
    [
      127956,
      127967
    ],
    2
  ],
  [
    [
      127968,
      127984
    ],
    2
  ],
  [
    [
      127985,
      127991
    ],
    2
  ],
  [
    [
      127992,
      127999
    ],
    2
  ],
  [
    [
      128e3,
      128062
    ],
    2
  ],
  [
    128063,
    2
  ],
  [
    128064,
    2
  ],
  [
    128065,
    2
  ],
  [
    [
      128066,
      128247
    ],
    2
  ],
  [
    128248,
    2
  ],
  [
    [
      128249,
      128252
    ],
    2
  ],
  [
    [
      128253,
      128254
    ],
    2
  ],
  [
    128255,
    2
  ],
  [
    [
      128256,
      128317
    ],
    2
  ],
  [
    [
      128318,
      128319
    ],
    2
  ],
  [
    [
      128320,
      128323
    ],
    2
  ],
  [
    [
      128324,
      128330
    ],
    2
  ],
  [
    [
      128331,
      128335
    ],
    2
  ],
  [
    [
      128336,
      128359
    ],
    2
  ],
  [
    [
      128360,
      128377
    ],
    2
  ],
  [
    128378,
    2
  ],
  [
    [
      128379,
      128419
    ],
    2
  ],
  [
    128420,
    2
  ],
  [
    [
      128421,
      128506
    ],
    2
  ],
  [
    [
      128507,
      128511
    ],
    2
  ],
  [
    128512,
    2
  ],
  [
    [
      128513,
      128528
    ],
    2
  ],
  [
    128529,
    2
  ],
  [
    [
      128530,
      128532
    ],
    2
  ],
  [
    128533,
    2
  ],
  [
    128534,
    2
  ],
  [
    128535,
    2
  ],
  [
    128536,
    2
  ],
  [
    128537,
    2
  ],
  [
    128538,
    2
  ],
  [
    128539,
    2
  ],
  [
    [
      128540,
      128542
    ],
    2
  ],
  [
    128543,
    2
  ],
  [
    [
      128544,
      128549
    ],
    2
  ],
  [
    [
      128550,
      128551
    ],
    2
  ],
  [
    [
      128552,
      128555
    ],
    2
  ],
  [
    128556,
    2
  ],
  [
    128557,
    2
  ],
  [
    [
      128558,
      128559
    ],
    2
  ],
  [
    [
      128560,
      128563
    ],
    2
  ],
  [
    128564,
    2
  ],
  [
    [
      128565,
      128576
    ],
    2
  ],
  [
    [
      128577,
      128578
    ],
    2
  ],
  [
    [
      128579,
      128580
    ],
    2
  ],
  [
    [
      128581,
      128591
    ],
    2
  ],
  [
    [
      128592,
      128639
    ],
    2
  ],
  [
    [
      128640,
      128709
    ],
    2
  ],
  [
    [
      128710,
      128719
    ],
    2
  ],
  [
    128720,
    2
  ],
  [
    [
      128721,
      128722
    ],
    2
  ],
  [
    [
      128723,
      128724
    ],
    2
  ],
  [
    128725,
    2
  ],
  [
    [
      128726,
      128727
    ],
    2
  ],
  [
    [
      128728,
      128731
    ],
    3
  ],
  [
    128732,
    2
  ],
  [
    [
      128733,
      128735
    ],
    2
  ],
  [
    [
      128736,
      128748
    ],
    2
  ],
  [
    [
      128749,
      128751
    ],
    3
  ],
  [
    [
      128752,
      128755
    ],
    2
  ],
  [
    [
      128756,
      128758
    ],
    2
  ],
  [
    [
      128759,
      128760
    ],
    2
  ],
  [
    128761,
    2
  ],
  [
    128762,
    2
  ],
  [
    [
      128763,
      128764
    ],
    2
  ],
  [
    [
      128765,
      128767
    ],
    3
  ],
  [
    [
      128768,
      128883
    ],
    2
  ],
  [
    [
      128884,
      128886
    ],
    2
  ],
  [
    [
      128887,
      128890
    ],
    3
  ],
  [
    [
      128891,
      128895
    ],
    2
  ],
  [
    [
      128896,
      128980
    ],
    2
  ],
  [
    [
      128981,
      128984
    ],
    2
  ],
  [
    128985,
    2
  ],
  [
    [
      128986,
      128991
    ],
    3
  ],
  [
    [
      128992,
      129003
    ],
    2
  ],
  [
    [
      129004,
      129007
    ],
    3
  ],
  [
    129008,
    2
  ],
  [
    [
      129009,
      129023
    ],
    3
  ],
  [
    [
      129024,
      129035
    ],
    2
  ],
  [
    [
      129036,
      129039
    ],
    3
  ],
  [
    [
      129040,
      129095
    ],
    2
  ],
  [
    [
      129096,
      129103
    ],
    3
  ],
  [
    [
      129104,
      129113
    ],
    2
  ],
  [
    [
      129114,
      129119
    ],
    3
  ],
  [
    [
      129120,
      129159
    ],
    2
  ],
  [
    [
      129160,
      129167
    ],
    3
  ],
  [
    [
      129168,
      129197
    ],
    2
  ],
  [
    [
      129198,
      129199
    ],
    3
  ],
  [
    [
      129200,
      129201
    ],
    2
  ],
  [
    [
      129202,
      129279
    ],
    3
  ],
  [
    [
      129280,
      129291
    ],
    2
  ],
  [
    129292,
    2
  ],
  [
    [
      129293,
      129295
    ],
    2
  ],
  [
    [
      129296,
      129304
    ],
    2
  ],
  [
    [
      129305,
      129310
    ],
    2
  ],
  [
    129311,
    2
  ],
  [
    [
      129312,
      129319
    ],
    2
  ],
  [
    [
      129320,
      129327
    ],
    2
  ],
  [
    129328,
    2
  ],
  [
    [
      129329,
      129330
    ],
    2
  ],
  [
    [
      129331,
      129342
    ],
    2
  ],
  [
    129343,
    2
  ],
  [
    [
      129344,
      129355
    ],
    2
  ],
  [
    129356,
    2
  ],
  [
    [
      129357,
      129359
    ],
    2
  ],
  [
    [
      129360,
      129374
    ],
    2
  ],
  [
    [
      129375,
      129387
    ],
    2
  ],
  [
    [
      129388,
      129392
    ],
    2
  ],
  [
    129393,
    2
  ],
  [
    129394,
    2
  ],
  [
    [
      129395,
      129398
    ],
    2
  ],
  [
    [
      129399,
      129400
    ],
    2
  ],
  [
    129401,
    2
  ],
  [
    129402,
    2
  ],
  [
    129403,
    2
  ],
  [
    [
      129404,
      129407
    ],
    2
  ],
  [
    [
      129408,
      129412
    ],
    2
  ],
  [
    [
      129413,
      129425
    ],
    2
  ],
  [
    [
      129426,
      129431
    ],
    2
  ],
  [
    [
      129432,
      129442
    ],
    2
  ],
  [
    [
      129443,
      129444
    ],
    2
  ],
  [
    [
      129445,
      129450
    ],
    2
  ],
  [
    [
      129451,
      129453
    ],
    2
  ],
  [
    [
      129454,
      129455
    ],
    2
  ],
  [
    [
      129456,
      129465
    ],
    2
  ],
  [
    [
      129466,
      129471
    ],
    2
  ],
  [
    129472,
    2
  ],
  [
    [
      129473,
      129474
    ],
    2
  ],
  [
    [
      129475,
      129482
    ],
    2
  ],
  [
    129483,
    2
  ],
  [
    129484,
    2
  ],
  [
    [
      129485,
      129487
    ],
    2
  ],
  [
    [
      129488,
      129510
    ],
    2
  ],
  [
    [
      129511,
      129535
    ],
    2
  ],
  [
    [
      129536,
      129619
    ],
    2
  ],
  [
    [
      129620,
      129631
    ],
    3
  ],
  [
    [
      129632,
      129645
    ],
    2
  ],
  [
    [
      129646,
      129647
    ],
    3
  ],
  [
    [
      129648,
      129651
    ],
    2
  ],
  [
    129652,
    2
  ],
  [
    [
      129653,
      129655
    ],
    2
  ],
  [
    [
      129656,
      129658
    ],
    2
  ],
  [
    [
      129659,
      129660
    ],
    2
  ],
  [
    [
      129661,
      129663
    ],
    3
  ],
  [
    [
      129664,
      129666
    ],
    2
  ],
  [
    [
      129667,
      129670
    ],
    2
  ],
  [
    [
      129671,
      129672
    ],
    2
  ],
  [
    [
      129673,
      129679
    ],
    3
  ],
  [
    [
      129680,
      129685
    ],
    2
  ],
  [
    [
      129686,
      129704
    ],
    2
  ],
  [
    [
      129705,
      129708
    ],
    2
  ],
  [
    [
      129709,
      129711
    ],
    2
  ],
  [
    [
      129712,
      129718
    ],
    2
  ],
  [
    [
      129719,
      129722
    ],
    2
  ],
  [
    [
      129723,
      129725
    ],
    2
  ],
  [
    129726,
    3
  ],
  [
    129727,
    2
  ],
  [
    [
      129728,
      129730
    ],
    2
  ],
  [
    [
      129731,
      129733
    ],
    2
  ],
  [
    [
      129734,
      129741
    ],
    3
  ],
  [
    [
      129742,
      129743
    ],
    2
  ],
  [
    [
      129744,
      129750
    ],
    2
  ],
  [
    [
      129751,
      129753
    ],
    2
  ],
  [
    [
      129754,
      129755
    ],
    2
  ],
  [
    [
      129756,
      129759
    ],
    3
  ],
  [
    [
      129760,
      129767
    ],
    2
  ],
  [
    129768,
    2
  ],
  [
    [
      129769,
      129775
    ],
    3
  ],
  [
    [
      129776,
      129782
    ],
    2
  ],
  [
    [
      129783,
      129784
    ],
    2
  ],
  [
    [
      129785,
      129791
    ],
    3
  ],
  [
    [
      129792,
      129938
    ],
    2
  ],
  [
    129939,
    3
  ],
  [
    [
      129940,
      129994
    ],
    2
  ],
  [
    [
      129995,
      130031
    ],
    3
  ],
  [
    130032,
    1,
    "0"
  ],
  [
    130033,
    1,
    "1"
  ],
  [
    130034,
    1,
    "2"
  ],
  [
    130035,
    1,
    "3"
  ],
  [
    130036,
    1,
    "4"
  ],
  [
    130037,
    1,
    "5"
  ],
  [
    130038,
    1,
    "6"
  ],
  [
    130039,
    1,
    "7"
  ],
  [
    130040,
    1,
    "8"
  ],
  [
    130041,
    1,
    "9"
  ],
  [
    [
      130042,
      131069
    ],
    3
  ],
  [
    [
      131070,
      131071
    ],
    3
  ],
  [
    [
      131072,
      173782
    ],
    2
  ],
  [
    [
      173783,
      173789
    ],
    2
  ],
  [
    [
      173790,
      173791
    ],
    2
  ],
  [
    [
      173792,
      173823
    ],
    3
  ],
  [
    [
      173824,
      177972
    ],
    2
  ],
  [
    [
      177973,
      177976
    ],
    2
  ],
  [
    177977,
    2
  ],
  [
    [
      177978,
      177983
    ],
    3
  ],
  [
    [
      177984,
      178205
    ],
    2
  ],
  [
    [
      178206,
      178207
    ],
    3
  ],
  [
    [
      178208,
      183969
    ],
    2
  ],
  [
    [
      183970,
      183983
    ],
    3
  ],
  [
    [
      183984,
      191456
    ],
    2
  ],
  [
    [
      191457,
      191471
    ],
    3
  ],
  [
    [
      191472,
      192093
    ],
    2
  ],
  [
    [
      192094,
      194559
    ],
    3
  ],
  [
    194560,
    1,
    "丽"
  ],
  [
    194561,
    1,
    "丸"
  ],
  [
    194562,
    1,
    "乁"
  ],
  [
    194563,
    1,
    "𠄢"
  ],
  [
    194564,
    1,
    "你"
  ],
  [
    194565,
    1,
    "侮"
  ],
  [
    194566,
    1,
    "侻"
  ],
  [
    194567,
    1,
    "倂"
  ],
  [
    194568,
    1,
    "偺"
  ],
  [
    194569,
    1,
    "備"
  ],
  [
    194570,
    1,
    "僧"
  ],
  [
    194571,
    1,
    "像"
  ],
  [
    194572,
    1,
    "㒞"
  ],
  [
    194573,
    1,
    "𠘺"
  ],
  [
    194574,
    1,
    "免"
  ],
  [
    194575,
    1,
    "兔"
  ],
  [
    194576,
    1,
    "兤"
  ],
  [
    194577,
    1,
    "具"
  ],
  [
    194578,
    1,
    "𠔜"
  ],
  [
    194579,
    1,
    "㒹"
  ],
  [
    194580,
    1,
    "內"
  ],
  [
    194581,
    1,
    "再"
  ],
  [
    194582,
    1,
    "𠕋"
  ],
  [
    194583,
    1,
    "冗"
  ],
  [
    194584,
    1,
    "冤"
  ],
  [
    194585,
    1,
    "仌"
  ],
  [
    194586,
    1,
    "冬"
  ],
  [
    194587,
    1,
    "况"
  ],
  [
    194588,
    1,
    "𩇟"
  ],
  [
    194589,
    1,
    "凵"
  ],
  [
    194590,
    1,
    "刃"
  ],
  [
    194591,
    1,
    "㓟"
  ],
  [
    194592,
    1,
    "刻"
  ],
  [
    194593,
    1,
    "剆"
  ],
  [
    194594,
    1,
    "割"
  ],
  [
    194595,
    1,
    "剷"
  ],
  [
    194596,
    1,
    "㔕"
  ],
  [
    194597,
    1,
    "勇"
  ],
  [
    194598,
    1,
    "勉"
  ],
  [
    194599,
    1,
    "勤"
  ],
  [
    194600,
    1,
    "勺"
  ],
  [
    194601,
    1,
    "包"
  ],
  [
    194602,
    1,
    "匆"
  ],
  [
    194603,
    1,
    "北"
  ],
  [
    194604,
    1,
    "卉"
  ],
  [
    194605,
    1,
    "卑"
  ],
  [
    194606,
    1,
    "博"
  ],
  [
    194607,
    1,
    "即"
  ],
  [
    194608,
    1,
    "卽"
  ],
  [
    [
      194609,
      194611
    ],
    1,
    "卿"
  ],
  [
    194612,
    1,
    "𠨬"
  ],
  [
    194613,
    1,
    "灰"
  ],
  [
    194614,
    1,
    "及"
  ],
  [
    194615,
    1,
    "叟"
  ],
  [
    194616,
    1,
    "𠭣"
  ],
  [
    194617,
    1,
    "叫"
  ],
  [
    194618,
    1,
    "叱"
  ],
  [
    194619,
    1,
    "吆"
  ],
  [
    194620,
    1,
    "咞"
  ],
  [
    194621,
    1,
    "吸"
  ],
  [
    194622,
    1,
    "呈"
  ],
  [
    194623,
    1,
    "周"
  ],
  [
    194624,
    1,
    "咢"
  ],
  [
    194625,
    1,
    "哶"
  ],
  [
    194626,
    1,
    "唐"
  ],
  [
    194627,
    1,
    "啓"
  ],
  [
    194628,
    1,
    "啣"
  ],
  [
    [
      194629,
      194630
    ],
    1,
    "善"
  ],
  [
    194631,
    1,
    "喙"
  ],
  [
    194632,
    1,
    "喫"
  ],
  [
    194633,
    1,
    "喳"
  ],
  [
    194634,
    1,
    "嗂"
  ],
  [
    194635,
    1,
    "圖"
  ],
  [
    194636,
    1,
    "嘆"
  ],
  [
    194637,
    1,
    "圗"
  ],
  [
    194638,
    1,
    "噑"
  ],
  [
    194639,
    1,
    "噴"
  ],
  [
    194640,
    1,
    "切"
  ],
  [
    194641,
    1,
    "壮"
  ],
  [
    194642,
    1,
    "城"
  ],
  [
    194643,
    1,
    "埴"
  ],
  [
    194644,
    1,
    "堍"
  ],
  [
    194645,
    1,
    "型"
  ],
  [
    194646,
    1,
    "堲"
  ],
  [
    194647,
    1,
    "報"
  ],
  [
    194648,
    1,
    "墬"
  ],
  [
    194649,
    1,
    "𡓤"
  ],
  [
    194650,
    1,
    "売"
  ],
  [
    194651,
    1,
    "壷"
  ],
  [
    194652,
    1,
    "夆"
  ],
  [
    194653,
    1,
    "多"
  ],
  [
    194654,
    1,
    "夢"
  ],
  [
    194655,
    1,
    "奢"
  ],
  [
    194656,
    1,
    "𡚨"
  ],
  [
    194657,
    1,
    "𡛪"
  ],
  [
    194658,
    1,
    "姬"
  ],
  [
    194659,
    1,
    "娛"
  ],
  [
    194660,
    1,
    "娧"
  ],
  [
    194661,
    1,
    "姘"
  ],
  [
    194662,
    1,
    "婦"
  ],
  [
    194663,
    1,
    "㛮"
  ],
  [
    194664,
    3
  ],
  [
    194665,
    1,
    "嬈"
  ],
  [
    [
      194666,
      194667
    ],
    1,
    "嬾"
  ],
  [
    194668,
    1,
    "𡧈"
  ],
  [
    194669,
    1,
    "寃"
  ],
  [
    194670,
    1,
    "寘"
  ],
  [
    194671,
    1,
    "寧"
  ],
  [
    194672,
    1,
    "寳"
  ],
  [
    194673,
    1,
    "𡬘"
  ],
  [
    194674,
    1,
    "寿"
  ],
  [
    194675,
    1,
    "将"
  ],
  [
    194676,
    3
  ],
  [
    194677,
    1,
    "尢"
  ],
  [
    194678,
    1,
    "㞁"
  ],
  [
    194679,
    1,
    "屠"
  ],
  [
    194680,
    1,
    "屮"
  ],
  [
    194681,
    1,
    "峀"
  ],
  [
    194682,
    1,
    "岍"
  ],
  [
    194683,
    1,
    "𡷤"
  ],
  [
    194684,
    1,
    "嵃"
  ],
  [
    194685,
    1,
    "𡷦"
  ],
  [
    194686,
    1,
    "嵮"
  ],
  [
    194687,
    1,
    "嵫"
  ],
  [
    194688,
    1,
    "嵼"
  ],
  [
    194689,
    1,
    "巡"
  ],
  [
    194690,
    1,
    "巢"
  ],
  [
    194691,
    1,
    "㠯"
  ],
  [
    194692,
    1,
    "巽"
  ],
  [
    194693,
    1,
    "帨"
  ],
  [
    194694,
    1,
    "帽"
  ],
  [
    194695,
    1,
    "幩"
  ],
  [
    194696,
    1,
    "㡢"
  ],
  [
    194697,
    1,
    "𢆃"
  ],
  [
    194698,
    1,
    "㡼"
  ],
  [
    194699,
    1,
    "庰"
  ],
  [
    194700,
    1,
    "庳"
  ],
  [
    194701,
    1,
    "庶"
  ],
  [
    194702,
    1,
    "廊"
  ],
  [
    194703,
    1,
    "𪎒"
  ],
  [
    194704,
    1,
    "廾"
  ],
  [
    [
      194705,
      194706
    ],
    1,
    "𢌱"
  ],
  [
    194707,
    1,
    "舁"
  ],
  [
    [
      194708,
      194709
    ],
    1,
    "弢"
  ],
  [
    194710,
    1,
    "㣇"
  ],
  [
    194711,
    1,
    "𣊸"
  ],
  [
    194712,
    1,
    "𦇚"
  ],
  [
    194713,
    1,
    "形"
  ],
  [
    194714,
    1,
    "彫"
  ],
  [
    194715,
    1,
    "㣣"
  ],
  [
    194716,
    1,
    "徚"
  ],
  [
    194717,
    1,
    "忍"
  ],
  [
    194718,
    1,
    "志"
  ],
  [
    194719,
    1,
    "忹"
  ],
  [
    194720,
    1,
    "悁"
  ],
  [
    194721,
    1,
    "㤺"
  ],
  [
    194722,
    1,
    "㤜"
  ],
  [
    194723,
    1,
    "悔"
  ],
  [
    194724,
    1,
    "𢛔"
  ],
  [
    194725,
    1,
    "惇"
  ],
  [
    194726,
    1,
    "慈"
  ],
  [
    194727,
    1,
    "慌"
  ],
  [
    194728,
    1,
    "慎"
  ],
  [
    194729,
    1,
    "慌"
  ],
  [
    194730,
    1,
    "慺"
  ],
  [
    194731,
    1,
    "憎"
  ],
  [
    194732,
    1,
    "憲"
  ],
  [
    194733,
    1,
    "憤"
  ],
  [
    194734,
    1,
    "憯"
  ],
  [
    194735,
    1,
    "懞"
  ],
  [
    194736,
    1,
    "懲"
  ],
  [
    194737,
    1,
    "懶"
  ],
  [
    194738,
    1,
    "成"
  ],
  [
    194739,
    1,
    "戛"
  ],
  [
    194740,
    1,
    "扝"
  ],
  [
    194741,
    1,
    "抱"
  ],
  [
    194742,
    1,
    "拔"
  ],
  [
    194743,
    1,
    "捐"
  ],
  [
    194744,
    1,
    "𢬌"
  ],
  [
    194745,
    1,
    "挽"
  ],
  [
    194746,
    1,
    "拼"
  ],
  [
    194747,
    1,
    "捨"
  ],
  [
    194748,
    1,
    "掃"
  ],
  [
    194749,
    1,
    "揤"
  ],
  [
    194750,
    1,
    "𢯱"
  ],
  [
    194751,
    1,
    "搢"
  ],
  [
    194752,
    1,
    "揅"
  ],
  [
    194753,
    1,
    "掩"
  ],
  [
    194754,
    1,
    "㨮"
  ],
  [
    194755,
    1,
    "摩"
  ],
  [
    194756,
    1,
    "摾"
  ],
  [
    194757,
    1,
    "撝"
  ],
  [
    194758,
    1,
    "摷"
  ],
  [
    194759,
    1,
    "㩬"
  ],
  [
    194760,
    1,
    "敏"
  ],
  [
    194761,
    1,
    "敬"
  ],
  [
    194762,
    1,
    "𣀊"
  ],
  [
    194763,
    1,
    "旣"
  ],
  [
    194764,
    1,
    "書"
  ],
  [
    194765,
    1,
    "晉"
  ],
  [
    194766,
    1,
    "㬙"
  ],
  [
    194767,
    1,
    "暑"
  ],
  [
    194768,
    1,
    "㬈"
  ],
  [
    194769,
    1,
    "㫤"
  ],
  [
    194770,
    1,
    "冒"
  ],
  [
    194771,
    1,
    "冕"
  ],
  [
    194772,
    1,
    "最"
  ],
  [
    194773,
    1,
    "暜"
  ],
  [
    194774,
    1,
    "肭"
  ],
  [
    194775,
    1,
    "䏙"
  ],
  [
    194776,
    1,
    "朗"
  ],
  [
    194777,
    1,
    "望"
  ],
  [
    194778,
    1,
    "朡"
  ],
  [
    194779,
    1,
    "杞"
  ],
  [
    194780,
    1,
    "杓"
  ],
  [
    194781,
    1,
    "𣏃"
  ],
  [
    194782,
    1,
    "㭉"
  ],
  [
    194783,
    1,
    "柺"
  ],
  [
    194784,
    1,
    "枅"
  ],
  [
    194785,
    1,
    "桒"
  ],
  [
    194786,
    1,
    "梅"
  ],
  [
    194787,
    1,
    "𣑭"
  ],
  [
    194788,
    1,
    "梎"
  ],
  [
    194789,
    1,
    "栟"
  ],
  [
    194790,
    1,
    "椔"
  ],
  [
    194791,
    1,
    "㮝"
  ],
  [
    194792,
    1,
    "楂"
  ],
  [
    194793,
    1,
    "榣"
  ],
  [
    194794,
    1,
    "槪"
  ],
  [
    194795,
    1,
    "檨"
  ],
  [
    194796,
    1,
    "𣚣"
  ],
  [
    194797,
    1,
    "櫛"
  ],
  [
    194798,
    1,
    "㰘"
  ],
  [
    194799,
    1,
    "次"
  ],
  [
    194800,
    1,
    "𣢧"
  ],
  [
    194801,
    1,
    "歔"
  ],
  [
    194802,
    1,
    "㱎"
  ],
  [
    194803,
    1,
    "歲"
  ],
  [
    194804,
    1,
    "殟"
  ],
  [
    194805,
    1,
    "殺"
  ],
  [
    194806,
    1,
    "殻"
  ],
  [
    194807,
    1,
    "𣪍"
  ],
  [
    194808,
    1,
    "𡴋"
  ],
  [
    194809,
    1,
    "𣫺"
  ],
  [
    194810,
    1,
    "汎"
  ],
  [
    194811,
    1,
    "𣲼"
  ],
  [
    194812,
    1,
    "沿"
  ],
  [
    194813,
    1,
    "泍"
  ],
  [
    194814,
    1,
    "汧"
  ],
  [
    194815,
    1,
    "洖"
  ],
  [
    194816,
    1,
    "派"
  ],
  [
    194817,
    1,
    "海"
  ],
  [
    194818,
    1,
    "流"
  ],
  [
    194819,
    1,
    "浩"
  ],
  [
    194820,
    1,
    "浸"
  ],
  [
    194821,
    1,
    "涅"
  ],
  [
    194822,
    1,
    "𣴞"
  ],
  [
    194823,
    1,
    "洴"
  ],
  [
    194824,
    1,
    "港"
  ],
  [
    194825,
    1,
    "湮"
  ],
  [
    194826,
    1,
    "㴳"
  ],
  [
    194827,
    1,
    "滋"
  ],
  [
    194828,
    1,
    "滇"
  ],
  [
    194829,
    1,
    "𣻑"
  ],
  [
    194830,
    1,
    "淹"
  ],
  [
    194831,
    1,
    "潮"
  ],
  [
    194832,
    1,
    "𣽞"
  ],
  [
    194833,
    1,
    "𣾎"
  ],
  [
    194834,
    1,
    "濆"
  ],
  [
    194835,
    1,
    "瀹"
  ],
  [
    194836,
    1,
    "瀞"
  ],
  [
    194837,
    1,
    "瀛"
  ],
  [
    194838,
    1,
    "㶖"
  ],
  [
    194839,
    1,
    "灊"
  ],
  [
    194840,
    1,
    "災"
  ],
  [
    194841,
    1,
    "灷"
  ],
  [
    194842,
    1,
    "炭"
  ],
  [
    194843,
    1,
    "𠔥"
  ],
  [
    194844,
    1,
    "煅"
  ],
  [
    194845,
    1,
    "𤉣"
  ],
  [
    194846,
    1,
    "熜"
  ],
  [
    194847,
    3
  ],
  [
    194848,
    1,
    "爨"
  ],
  [
    194849,
    1,
    "爵"
  ],
  [
    194850,
    1,
    "牐"
  ],
  [
    194851,
    1,
    "𤘈"
  ],
  [
    194852,
    1,
    "犀"
  ],
  [
    194853,
    1,
    "犕"
  ],
  [
    194854,
    1,
    "𤜵"
  ],
  [
    194855,
    1,
    "𤠔"
  ],
  [
    194856,
    1,
    "獺"
  ],
  [
    194857,
    1,
    "王"
  ],
  [
    194858,
    1,
    "㺬"
  ],
  [
    194859,
    1,
    "玥"
  ],
  [
    [
      194860,
      194861
    ],
    1,
    "㺸"
  ],
  [
    194862,
    1,
    "瑇"
  ],
  [
    194863,
    1,
    "瑜"
  ],
  [
    194864,
    1,
    "瑱"
  ],
  [
    194865,
    1,
    "璅"
  ],
  [
    194866,
    1,
    "瓊"
  ],
  [
    194867,
    1,
    "㼛"
  ],
  [
    194868,
    1,
    "甤"
  ],
  [
    194869,
    1,
    "𤰶"
  ],
  [
    194870,
    1,
    "甾"
  ],
  [
    194871,
    1,
    "𤲒"
  ],
  [
    194872,
    1,
    "異"
  ],
  [
    194873,
    1,
    "𢆟"
  ],
  [
    194874,
    1,
    "瘐"
  ],
  [
    194875,
    1,
    "𤾡"
  ],
  [
    194876,
    1,
    "𤾸"
  ],
  [
    194877,
    1,
    "𥁄"
  ],
  [
    194878,
    1,
    "㿼"
  ],
  [
    194879,
    1,
    "䀈"
  ],
  [
    194880,
    1,
    "直"
  ],
  [
    194881,
    1,
    "𥃳"
  ],
  [
    194882,
    1,
    "𥃲"
  ],
  [
    194883,
    1,
    "𥄙"
  ],
  [
    194884,
    1,
    "𥄳"
  ],
  [
    194885,
    1,
    "眞"
  ],
  [
    [
      194886,
      194887
    ],
    1,
    "真"
  ],
  [
    194888,
    1,
    "睊"
  ],
  [
    194889,
    1,
    "䀹"
  ],
  [
    194890,
    1,
    "瞋"
  ],
  [
    194891,
    1,
    "䁆"
  ],
  [
    194892,
    1,
    "䂖"
  ],
  [
    194893,
    1,
    "𥐝"
  ],
  [
    194894,
    1,
    "硎"
  ],
  [
    194895,
    1,
    "碌"
  ],
  [
    194896,
    1,
    "磌"
  ],
  [
    194897,
    1,
    "䃣"
  ],
  [
    194898,
    1,
    "𥘦"
  ],
  [
    194899,
    1,
    "祖"
  ],
  [
    194900,
    1,
    "𥚚"
  ],
  [
    194901,
    1,
    "𥛅"
  ],
  [
    194902,
    1,
    "福"
  ],
  [
    194903,
    1,
    "秫"
  ],
  [
    194904,
    1,
    "䄯"
  ],
  [
    194905,
    1,
    "穀"
  ],
  [
    194906,
    1,
    "穊"
  ],
  [
    194907,
    1,
    "穏"
  ],
  [
    194908,
    1,
    "𥥼"
  ],
  [
    [
      194909,
      194910
    ],
    1,
    "𥪧"
  ],
  [
    194911,
    3
  ],
  [
    194912,
    1,
    "䈂"
  ],
  [
    194913,
    1,
    "𥮫"
  ],
  [
    194914,
    1,
    "篆"
  ],
  [
    194915,
    1,
    "築"
  ],
  [
    194916,
    1,
    "䈧"
  ],
  [
    194917,
    1,
    "𥲀"
  ],
  [
    194918,
    1,
    "糒"
  ],
  [
    194919,
    1,
    "䊠"
  ],
  [
    194920,
    1,
    "糨"
  ],
  [
    194921,
    1,
    "糣"
  ],
  [
    194922,
    1,
    "紀"
  ],
  [
    194923,
    1,
    "𥾆"
  ],
  [
    194924,
    1,
    "絣"
  ],
  [
    194925,
    1,
    "䌁"
  ],
  [
    194926,
    1,
    "緇"
  ],
  [
    194927,
    1,
    "縂"
  ],
  [
    194928,
    1,
    "繅"
  ],
  [
    194929,
    1,
    "䌴"
  ],
  [
    194930,
    1,
    "𦈨"
  ],
  [
    194931,
    1,
    "𦉇"
  ],
  [
    194932,
    1,
    "䍙"
  ],
  [
    194933,
    1,
    "𦋙"
  ],
  [
    194934,
    1,
    "罺"
  ],
  [
    194935,
    1,
    "𦌾"
  ],
  [
    194936,
    1,
    "羕"
  ],
  [
    194937,
    1,
    "翺"
  ],
  [
    194938,
    1,
    "者"
  ],
  [
    194939,
    1,
    "𦓚"
  ],
  [
    194940,
    1,
    "𦔣"
  ],
  [
    194941,
    1,
    "聠"
  ],
  [
    194942,
    1,
    "𦖨"
  ],
  [
    194943,
    1,
    "聰"
  ],
  [
    194944,
    1,
    "𣍟"
  ],
  [
    194945,
    1,
    "䏕"
  ],
  [
    194946,
    1,
    "育"
  ],
  [
    194947,
    1,
    "脃"
  ],
  [
    194948,
    1,
    "䐋"
  ],
  [
    194949,
    1,
    "脾"
  ],
  [
    194950,
    1,
    "媵"
  ],
  [
    194951,
    1,
    "𦞧"
  ],
  [
    194952,
    1,
    "𦞵"
  ],
  [
    194953,
    1,
    "𣎓"
  ],
  [
    194954,
    1,
    "𣎜"
  ],
  [
    194955,
    1,
    "舁"
  ],
  [
    194956,
    1,
    "舄"
  ],
  [
    194957,
    1,
    "辞"
  ],
  [
    194958,
    1,
    "䑫"
  ],
  [
    194959,
    1,
    "芑"
  ],
  [
    194960,
    1,
    "芋"
  ],
  [
    194961,
    1,
    "芝"
  ],
  [
    194962,
    1,
    "劳"
  ],
  [
    194963,
    1,
    "花"
  ],
  [
    194964,
    1,
    "芳"
  ],
  [
    194965,
    1,
    "芽"
  ],
  [
    194966,
    1,
    "苦"
  ],
  [
    194967,
    1,
    "𦬼"
  ],
  [
    194968,
    1,
    "若"
  ],
  [
    194969,
    1,
    "茝"
  ],
  [
    194970,
    1,
    "荣"
  ],
  [
    194971,
    1,
    "莭"
  ],
  [
    194972,
    1,
    "茣"
  ],
  [
    194973,
    1,
    "莽"
  ],
  [
    194974,
    1,
    "菧"
  ],
  [
    194975,
    1,
    "著"
  ],
  [
    194976,
    1,
    "荓"
  ],
  [
    194977,
    1,
    "菊"
  ],
  [
    194978,
    1,
    "菌"
  ],
  [
    194979,
    1,
    "菜"
  ],
  [
    194980,
    1,
    "𦰶"
  ],
  [
    194981,
    1,
    "𦵫"
  ],
  [
    194982,
    1,
    "𦳕"
  ],
  [
    194983,
    1,
    "䔫"
  ],
  [
    194984,
    1,
    "蓱"
  ],
  [
    194985,
    1,
    "蓳"
  ],
  [
    194986,
    1,
    "蔖"
  ],
  [
    194987,
    1,
    "𧏊"
  ],
  [
    194988,
    1,
    "蕤"
  ],
  [
    194989,
    1,
    "𦼬"
  ],
  [
    194990,
    1,
    "䕝"
  ],
  [
    194991,
    1,
    "䕡"
  ],
  [
    194992,
    1,
    "𦾱"
  ],
  [
    194993,
    1,
    "𧃒"
  ],
  [
    194994,
    1,
    "䕫"
  ],
  [
    194995,
    1,
    "虐"
  ],
  [
    194996,
    1,
    "虜"
  ],
  [
    194997,
    1,
    "虧"
  ],
  [
    194998,
    1,
    "虩"
  ],
  [
    194999,
    1,
    "蚩"
  ],
  [
    195e3,
    1,
    "蚈"
  ],
  [
    195001,
    1,
    "蜎"
  ],
  [
    195002,
    1,
    "蛢"
  ],
  [
    195003,
    1,
    "蝹"
  ],
  [
    195004,
    1,
    "蜨"
  ],
  [
    195005,
    1,
    "蝫"
  ],
  [
    195006,
    1,
    "螆"
  ],
  [
    195007,
    3
  ],
  [
    195008,
    1,
    "蟡"
  ],
  [
    195009,
    1,
    "蠁"
  ],
  [
    195010,
    1,
    "䗹"
  ],
  [
    195011,
    1,
    "衠"
  ],
  [
    195012,
    1,
    "衣"
  ],
  [
    195013,
    1,
    "𧙧"
  ],
  [
    195014,
    1,
    "裗"
  ],
  [
    195015,
    1,
    "裞"
  ],
  [
    195016,
    1,
    "䘵"
  ],
  [
    195017,
    1,
    "裺"
  ],
  [
    195018,
    1,
    "㒻"
  ],
  [
    195019,
    1,
    "𧢮"
  ],
  [
    195020,
    1,
    "𧥦"
  ],
  [
    195021,
    1,
    "䚾"
  ],
  [
    195022,
    1,
    "䛇"
  ],
  [
    195023,
    1,
    "誠"
  ],
  [
    195024,
    1,
    "諭"
  ],
  [
    195025,
    1,
    "變"
  ],
  [
    195026,
    1,
    "豕"
  ],
  [
    195027,
    1,
    "𧲨"
  ],
  [
    195028,
    1,
    "貫"
  ],
  [
    195029,
    1,
    "賁"
  ],
  [
    195030,
    1,
    "贛"
  ],
  [
    195031,
    1,
    "起"
  ],
  [
    195032,
    1,
    "𧼯"
  ],
  [
    195033,
    1,
    "𠠄"
  ],
  [
    195034,
    1,
    "跋"
  ],
  [
    195035,
    1,
    "趼"
  ],
  [
    195036,
    1,
    "跰"
  ],
  [
    195037,
    1,
    "𠣞"
  ],
  [
    195038,
    1,
    "軔"
  ],
  [
    195039,
    1,
    "輸"
  ],
  [
    195040,
    1,
    "𨗒"
  ],
  [
    195041,
    1,
    "𨗭"
  ],
  [
    195042,
    1,
    "邔"
  ],
  [
    195043,
    1,
    "郱"
  ],
  [
    195044,
    1,
    "鄑"
  ],
  [
    195045,
    1,
    "𨜮"
  ],
  [
    195046,
    1,
    "鄛"
  ],
  [
    195047,
    1,
    "鈸"
  ],
  [
    195048,
    1,
    "鋗"
  ],
  [
    195049,
    1,
    "鋘"
  ],
  [
    195050,
    1,
    "鉼"
  ],
  [
    195051,
    1,
    "鏹"
  ],
  [
    195052,
    1,
    "鐕"
  ],
  [
    195053,
    1,
    "𨯺"
  ],
  [
    195054,
    1,
    "開"
  ],
  [
    195055,
    1,
    "䦕"
  ],
  [
    195056,
    1,
    "閷"
  ],
  [
    195057,
    1,
    "𨵷"
  ],
  [
    195058,
    1,
    "䧦"
  ],
  [
    195059,
    1,
    "雃"
  ],
  [
    195060,
    1,
    "嶲"
  ],
  [
    195061,
    1,
    "霣"
  ],
  [
    195062,
    1,
    "𩅅"
  ],
  [
    195063,
    1,
    "𩈚"
  ],
  [
    195064,
    1,
    "䩮"
  ],
  [
    195065,
    1,
    "䩶"
  ],
  [
    195066,
    1,
    "韠"
  ],
  [
    195067,
    1,
    "𩐊"
  ],
  [
    195068,
    1,
    "䪲"
  ],
  [
    195069,
    1,
    "𩒖"
  ],
  [
    [
      195070,
      195071
    ],
    1,
    "頋"
  ],
  [
    195072,
    1,
    "頩"
  ],
  [
    195073,
    1,
    "𩖶"
  ],
  [
    195074,
    1,
    "飢"
  ],
  [
    195075,
    1,
    "䬳"
  ],
  [
    195076,
    1,
    "餩"
  ],
  [
    195077,
    1,
    "馧"
  ],
  [
    195078,
    1,
    "駂"
  ],
  [
    195079,
    1,
    "駾"
  ],
  [
    195080,
    1,
    "䯎"
  ],
  [
    195081,
    1,
    "𩬰"
  ],
  [
    195082,
    1,
    "鬒"
  ],
  [
    195083,
    1,
    "鱀"
  ],
  [
    195084,
    1,
    "鳽"
  ],
  [
    195085,
    1,
    "䳎"
  ],
  [
    195086,
    1,
    "䳭"
  ],
  [
    195087,
    1,
    "鵧"
  ],
  [
    195088,
    1,
    "𪃎"
  ],
  [
    195089,
    1,
    "䳸"
  ],
  [
    195090,
    1,
    "𪄅"
  ],
  [
    195091,
    1,
    "𪈎"
  ],
  [
    195092,
    1,
    "𪊑"
  ],
  [
    195093,
    1,
    "麻"
  ],
  [
    195094,
    1,
    "䵖"
  ],
  [
    195095,
    1,
    "黹"
  ],
  [
    195096,
    1,
    "黾"
  ],
  [
    195097,
    1,
    "鼅"
  ],
  [
    195098,
    1,
    "鼏"
  ],
  [
    195099,
    1,
    "鼖"
  ],
  [
    195100,
    1,
    "鼻"
  ],
  [
    195101,
    1,
    "𪘀"
  ],
  [
    [
      195102,
      196605
    ],
    3
  ],
  [
    [
      196606,
      196607
    ],
    3
  ],
  [
    [
      196608,
      201546
    ],
    2
  ],
  [
    [
      201547,
      201551
    ],
    3
  ],
  [
    [
      201552,
      205743
    ],
    2
  ],
  [
    [
      205744,
      262141
    ],
    3
  ],
  [
    [
      262142,
      262143
    ],
    3
  ],
  [
    [
      262144,
      327677
    ],
    3
  ],
  [
    [
      327678,
      327679
    ],
    3
  ],
  [
    [
      327680,
      393213
    ],
    3
  ],
  [
    [
      393214,
      393215
    ],
    3
  ],
  [
    [
      393216,
      458749
    ],
    3
  ],
  [
    [
      458750,
      458751
    ],
    3
  ],
  [
    [
      458752,
      524285
    ],
    3
  ],
  [
    [
      524286,
      524287
    ],
    3
  ],
  [
    [
      524288,
      589821
    ],
    3
  ],
  [
    [
      589822,
      589823
    ],
    3
  ],
  [
    [
      589824,
      655357
    ],
    3
  ],
  [
    [
      655358,
      655359
    ],
    3
  ],
  [
    [
      655360,
      720893
    ],
    3
  ],
  [
    [
      720894,
      720895
    ],
    3
  ],
  [
    [
      720896,
      786429
    ],
    3
  ],
  [
    [
      786430,
      786431
    ],
    3
  ],
  [
    [
      786432,
      851965
    ],
    3
  ],
  [
    [
      851966,
      851967
    ],
    3
  ],
  [
    [
      851968,
      917501
    ],
    3
  ],
  [
    [
      917502,
      917503
    ],
    3
  ],
  [
    917504,
    3
  ],
  [
    917505,
    3
  ],
  [
    [
      917506,
      917535
    ],
    3
  ],
  [
    [
      917536,
      917631
    ],
    3
  ],
  [
    [
      917632,
      917759
    ],
    3
  ],
  [
    [
      917760,
      917999
    ],
    7
  ],
  [
    [
      918e3,
      983037
    ],
    3
  ],
  [
    [
      983038,
      983039
    ],
    3
  ],
  [
    [
      983040,
      1048573
    ],
    3
  ],
  [
    [
      1048574,
      1048575
    ],
    3
  ],
  [
    [
      1048576,
      1114109
    ],
    3
  ],
  [
    [
      1114110,
      1114111
    ],
    3
  ]
];
var statusMapping = {};
statusMapping.STATUS_MAPPING = {
  mapped: 1,
  valid: 2,
  disallowed: 3,
  disallowed_STD3_valid: 4,
  disallowed_STD3_mapped: 5,
  deviation: 6,
  ignored: 7
};
const punycode = require$$0;
const regexes = regexes$1;
const mappingTable = require$$2;
const { STATUS_MAPPING } = statusMapping;
function containsNonASCII(str) {
  return /[^\x00-\x7F]/u.test(str);
}
function findStatus(val, { useSTD3ASCIIRules }) {
  let start2 = 0;
  let end2 = mappingTable.length - 1;
  while (start2 <= end2) {
    const mid = Math.floor((start2 + end2) / 2);
    const target2 = mappingTable[mid];
    const min2 = Array.isArray(target2[0]) ? target2[0][0] : target2[0];
    const max2 = Array.isArray(target2[0]) ? target2[0][1] : target2[0];
    if (min2 <= val && max2 >= val) {
      if (useSTD3ASCIIRules && (target2[1] === STATUS_MAPPING.disallowed_STD3_valid || target2[1] === STATUS_MAPPING.disallowed_STD3_mapped)) {
        return [STATUS_MAPPING.disallowed, ...target2.slice(2)];
      } else if (target2[1] === STATUS_MAPPING.disallowed_STD3_valid) {
        return [STATUS_MAPPING.valid, ...target2.slice(2)];
      } else if (target2[1] === STATUS_MAPPING.disallowed_STD3_mapped) {
        return [STATUS_MAPPING.mapped, ...target2.slice(2)];
      }
      return target2.slice(1);
    } else if (min2 > val) {
      end2 = mid - 1;
    } else {
      start2 = mid + 1;
    }
  }
  return null;
}
function mapChars(domainName, { useSTD3ASCIIRules, transitionalProcessing }) {
  let processed = "";
  for (const ch of domainName) {
    const [status, mapping] = findStatus(ch.codePointAt(0), { useSTD3ASCIIRules });
    switch (status) {
      case STATUS_MAPPING.disallowed:
        processed += ch;
        break;
      case STATUS_MAPPING.ignored:
        break;
      case STATUS_MAPPING.mapped:
        if (transitionalProcessing && ch === "ẞ") {
          processed += "ss";
        } else {
          processed += mapping;
        }
        break;
      case STATUS_MAPPING.deviation:
        if (transitionalProcessing) {
          processed += mapping;
        } else {
          processed += ch;
        }
        break;
      case STATUS_MAPPING.valid:
        processed += ch;
        break;
    }
  }
  return processed;
}
function validateLabel(label, {
  checkHyphens,
  checkBidi,
  checkJoiners,
  transitionalProcessing,
  useSTD3ASCIIRules,
  isBidi
}) {
  if (label.length === 0) {
    return true;
  }
  if (label.normalize("NFC") !== label) {
    return false;
  }
  const codePoints = Array.from(label);
  if (checkHyphens) {
    if (codePoints[2] === "-" && codePoints[3] === "-" || (label.startsWith("-") || label.endsWith("-"))) {
      return false;
    }
  }
  if (label.includes(".")) {
    return false;
  }
  if (regexes.combiningMarks.test(codePoints[0])) {
    return false;
  }
  for (const ch of codePoints) {
    const [status] = findStatus(ch.codePointAt(0), { useSTD3ASCIIRules });
    if (transitionalProcessing) {
      if (status !== STATUS_MAPPING.valid) {
        return false;
      }
    } else if (status !== STATUS_MAPPING.valid && status !== STATUS_MAPPING.deviation) {
      return false;
    }
  }
  if (checkJoiners) {
    let last = 0;
    for (const [i, ch] of codePoints.entries()) {
      if (ch === "‌" || ch === "‍") {
        if (i > 0) {
          if (regexes.combiningClassVirama.test(codePoints[i - 1])) {
            continue;
          }
          if (ch === "‌") {
            const next = codePoints.indexOf("‌", i + 1);
            const test = next < 0 ? codePoints.slice(last) : codePoints.slice(last, next);
            if (regexes.validZWNJ.test(test.join(""))) {
              last = i + 1;
              continue;
            }
          }
        }
        return false;
      }
    }
  }
  if (checkBidi && isBidi) {
    let rtl;
    if (regexes.bidiS1LTR.test(codePoints[0])) {
      rtl = false;
    } else if (regexes.bidiS1RTL.test(codePoints[0])) {
      rtl = true;
    } else {
      return false;
    }
    if (rtl) {
      if (!regexes.bidiS2.test(label) || !regexes.bidiS3.test(label) || regexes.bidiS4EN.test(label) && regexes.bidiS4AN.test(label)) {
        return false;
      }
    } else if (!regexes.bidiS5.test(label) || !regexes.bidiS6.test(label)) {
      return false;
    }
  }
  return true;
}
function isBidiDomain(labels) {
  const domain = labels.map((label) => {
    if (label.startsWith("xn--")) {
      try {
        return punycode.decode(label.substring(4));
      } catch (err) {
        return "";
      }
    }
    return label;
  }).join(".");
  return regexes.bidiDomain.test(domain);
}
function processing(domainName, options2) {
  let string = mapChars(domainName, options2);
  string = string.normalize("NFC");
  const labels = string.split(".");
  const isBidi = isBidiDomain(labels);
  let error2 = false;
  for (const [i, origLabel] of labels.entries()) {
    let label = origLabel;
    let transitionalProcessingForThisLabel = options2.transitionalProcessing;
    if (label.startsWith("xn--")) {
      if (containsNonASCII(label)) {
        error2 = true;
        continue;
      }
      try {
        label = punycode.decode(label.substring(4));
      } catch {
        if (!options2.ignoreInvalidPunycode) {
          error2 = true;
          continue;
        }
      }
      labels[i] = label;
      transitionalProcessingForThisLabel = false;
    }
    if (error2) {
      continue;
    }
    const validation = validateLabel(label, {
      ...options2,
      transitionalProcessing: transitionalProcessingForThisLabel,
      isBidi
    });
    if (!validation) {
      error2 = true;
    }
  }
  return {
    string: labels.join("."),
    error: error2
  };
}
function toASCII(domainName, {
  checkHyphens = false,
  checkBidi = false,
  checkJoiners = false,
  useSTD3ASCIIRules = false,
  verifyDNSLength = false,
  transitionalProcessing = false,
  ignoreInvalidPunycode = false
} = {}) {
  const result = processing(domainName, {
    checkHyphens,
    checkBidi,
    checkJoiners,
    useSTD3ASCIIRules,
    transitionalProcessing,
    ignoreInvalidPunycode
  });
  let labels = result.string.split(".");
  labels = labels.map((l2) => {
    if (containsNonASCII(l2)) {
      try {
        return `xn--${punycode.encode(l2)}`;
      } catch (e) {
        result.error = true;
      }
    }
    return l2;
  });
  if (verifyDNSLength) {
    const total = labels.join(".").length;
    if (total > 253 || total === 0) {
      result.error = true;
    }
    for (let i = 0; i < labels.length; ++i) {
      if (labels[i].length > 63 || labels[i].length === 0) {
        result.error = true;
        break;
      }
    }
  }
  if (result.error) {
    return null;
  }
  return labels.join(".");
}
function toUnicode(domainName, {
  checkHyphens = false,
  checkBidi = false,
  checkJoiners = false,
  useSTD3ASCIIRules = false,
  transitionalProcessing = false,
  ignoreInvalidPunycode = false
} = {}) {
  const result = processing(domainName, {
    checkHyphens,
    checkBidi,
    checkJoiners,
    useSTD3ASCIIRules,
    transitionalProcessing,
    ignoreInvalidPunycode
  });
  return {
    domain: result.string,
    error: result.error
  };
}
var tr46 = {
  toASCII,
  toUnicode
};
function isASCIIDigit(c) {
  return c >= 48 && c <= 57;
}
function isASCIIAlpha(c) {
  return c >= 65 && c <= 90 || c >= 97 && c <= 122;
}
function isASCIIAlphanumeric(c) {
  return isASCIIAlpha(c) || isASCIIDigit(c);
}
function isASCIIHex$1(c) {
  return isASCIIDigit(c) || c >= 65 && c <= 70 || c >= 97 && c <= 102;
}
var infra = {
  isASCIIDigit,
  isASCIIAlpha,
  isASCIIAlphanumeric,
  isASCIIHex: isASCIIHex$1
};
const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder("utf-8", { ignoreBOM: true });
function utf8Encode$1(string) {
  return utf8Encoder.encode(string);
}
function utf8DecodeWithoutBOM(bytes) {
  return utf8Decoder.decode(bytes);
}
var encoding = {
  utf8Encode: utf8Encode$1,
  utf8DecodeWithoutBOM
};
const { isASCIIHex } = infra;
const { utf8Encode } = encoding;
function p(char) {
  return char.codePointAt(0);
}
function percentEncode(c) {
  let hex = c.toString(16).toUpperCase();
  if (hex.length === 1) {
    hex = `0${hex}`;
  }
  return `%${hex}`;
}
function percentDecodeBytes(input) {
  const output = new Uint8Array(input.byteLength);
  let outputIndex = 0;
  for (let i = 0; i < input.byteLength; ++i) {
    const byte = input[i];
    if (byte !== 37) {
      output[outputIndex++] = byte;
    } else if (byte === 37 && (!isASCIIHex(input[i + 1]) || !isASCIIHex(input[i + 2]))) {
      output[outputIndex++] = byte;
    } else {
      const bytePoint = parseInt(String.fromCodePoint(input[i + 1], input[i + 2]), 16);
      output[outputIndex++] = bytePoint;
      i += 2;
    }
  }
  return output.slice(0, outputIndex);
}
function percentDecodeString(input) {
  const bytes = utf8Encode(input);
  return percentDecodeBytes(bytes);
}
function isC0ControlPercentEncode(c) {
  return c <= 31 || c > 126;
}
const extraFragmentPercentEncodeSet = /* @__PURE__ */ new Set([p(" "), p('"'), p("<"), p(">"), p("`")]);
function isFragmentPercentEncode(c) {
  return isC0ControlPercentEncode(c) || extraFragmentPercentEncodeSet.has(c);
}
const extraQueryPercentEncodeSet = /* @__PURE__ */ new Set([p(" "), p('"'), p("#"), p("<"), p(">")]);
function isQueryPercentEncode(c) {
  return isC0ControlPercentEncode(c) || extraQueryPercentEncodeSet.has(c);
}
function isSpecialQueryPercentEncode(c) {
  return isQueryPercentEncode(c) || c === p("'");
}
const extraPathPercentEncodeSet = /* @__PURE__ */ new Set([p("?"), p("`"), p("{"), p("}")]);
function isPathPercentEncode(c) {
  return isQueryPercentEncode(c) || extraPathPercentEncodeSet.has(c);
}
const extraUserinfoPercentEncodeSet = /* @__PURE__ */ new Set([p("/"), p(":"), p(";"), p("="), p("@"), p("["), p("\\"), p("]"), p("^"), p("|")]);
function isUserinfoPercentEncode(c) {
  return isPathPercentEncode(c) || extraUserinfoPercentEncodeSet.has(c);
}
const extraComponentPercentEncodeSet = /* @__PURE__ */ new Set([p("$"), p("%"), p("&"), p("+"), p(",")]);
function isComponentPercentEncode(c) {
  return isUserinfoPercentEncode(c) || extraComponentPercentEncodeSet.has(c);
}
const extraURLEncodedPercentEncodeSet = /* @__PURE__ */ new Set([p("!"), p("'"), p("("), p(")"), p("~")]);
function isURLEncodedPercentEncode(c) {
  return isComponentPercentEncode(c) || extraURLEncodedPercentEncodeSet.has(c);
}
function utf8PercentEncodeCodePointInternal(codePoint, percentEncodePredicate) {
  const bytes = utf8Encode(codePoint);
  let output = "";
  for (const byte of bytes) {
    if (!percentEncodePredicate(byte)) {
      output += String.fromCharCode(byte);
    } else {
      output += percentEncode(byte);
    }
  }
  return output;
}
function utf8PercentEncodeCodePoint(codePoint, percentEncodePredicate) {
  return utf8PercentEncodeCodePointInternal(String.fromCodePoint(codePoint), percentEncodePredicate);
}
function utf8PercentEncodeString(input, percentEncodePredicate, spaceAsPlus = false) {
  let output = "";
  for (const codePoint of input) {
    if (spaceAsPlus && codePoint === " ") {
      output += "+";
    } else {
      output += utf8PercentEncodeCodePointInternal(codePoint, percentEncodePredicate);
    }
  }
  return output;
}
var percentEncoding$1 = {
  isC0ControlPercentEncode,
  isFragmentPercentEncode,
  isQueryPercentEncode,
  isSpecialQueryPercentEncode,
  isPathPercentEncode,
  isUserinfoPercentEncode,
  isURLEncodedPercentEncode,
  percentDecodeString,
  percentDecodeBytes,
  utf8PercentEncodeString,
  utf8PercentEncodeCodePoint
};
(function(module) {
  const tr46$1 = tr46;
  const infra$1 = infra;
  const { utf8DecodeWithoutBOM: utf8DecodeWithoutBOM2 } = encoding;
  const {
    percentDecodeString: percentDecodeString2,
    utf8PercentEncodeCodePoint: utf8PercentEncodeCodePoint2,
    utf8PercentEncodeString: utf8PercentEncodeString2,
    isC0ControlPercentEncode: isC0ControlPercentEncode2,
    isFragmentPercentEncode: isFragmentPercentEncode2,
    isQueryPercentEncode: isQueryPercentEncode2,
    isSpecialQueryPercentEncode: isSpecialQueryPercentEncode2,
    isPathPercentEncode: isPathPercentEncode2,
    isUserinfoPercentEncode: isUserinfoPercentEncode2
  } = percentEncoding$1;
  function p2(char) {
    return char.codePointAt(0);
  }
  const specialSchemes = {
    ftp: 21,
    file: null,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443
  };
  const failure = Symbol("failure");
  function countSymbols(str) {
    return [...str].length;
  }
  function at(input, idx) {
    const c = input[idx];
    return isNaN(c) ? void 0 : String.fromCodePoint(c);
  }
  function isSingleDot(buffer2) {
    return buffer2 === "." || buffer2.toLowerCase() === "%2e";
  }
  function isDoubleDot(buffer2) {
    buffer2 = buffer2.toLowerCase();
    return buffer2 === ".." || buffer2 === "%2e." || buffer2 === ".%2e" || buffer2 === "%2e%2e";
  }
  function isWindowsDriveLetterCodePoints(cp1, cp2) {
    return infra$1.isASCIIAlpha(cp1) && (cp2 === p2(":") || cp2 === p2("|"));
  }
  function isWindowsDriveLetterString(string) {
    return string.length === 2 && infra$1.isASCIIAlpha(string.codePointAt(0)) && (string[1] === ":" || string[1] === "|");
  }
  function isNormalizedWindowsDriveLetterString(string) {
    return string.length === 2 && infra$1.isASCIIAlpha(string.codePointAt(0)) && string[1] === ":";
  }
  function containsForbiddenHostCodePoint(string) {
    return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|\/|:|<|>|\?|@|\[|\\|\]|\^|\|/u) !== -1;
  }
  function containsForbiddenDomainCodePoint(string) {
    return containsForbiddenHostCodePoint(string) || string.search(/[\u0000-\u001F]|%|\u007F/u) !== -1;
  }
  function isSpecialScheme(scheme) {
    return specialSchemes[scheme] !== void 0;
  }
  function isSpecial(url) {
    return isSpecialScheme(url.scheme);
  }
  function isNotSpecial(url) {
    return !isSpecialScheme(url.scheme);
  }
  function defaultPort(scheme) {
    return specialSchemes[scheme];
  }
  function parseIPv4Number(input) {
    if (input === "") {
      return failure;
    }
    let R = 10;
    if (input.length >= 2 && input.charAt(0) === "0" && input.charAt(1).toLowerCase() === "x") {
      input = input.substring(2);
      R = 16;
    } else if (input.length >= 2 && input.charAt(0) === "0") {
      input = input.substring(1);
      R = 8;
    }
    if (input === "") {
      return 0;
    }
    let regex = /[^0-7]/u;
    if (R === 10) {
      regex = /[^0-9]/u;
    }
    if (R === 16) {
      regex = /[^0-9A-Fa-f]/u;
    }
    if (regex.test(input)) {
      return failure;
    }
    return parseInt(input, R);
  }
  function parseIPv4(input) {
    const parts = input.split(".");
    if (parts[parts.length - 1] === "") {
      if (parts.length > 1) {
        parts.pop();
      }
    }
    if (parts.length > 4) {
      return failure;
    }
    const numbers = [];
    for (const part of parts) {
      const n2 = parseIPv4Number(part);
      if (n2 === failure) {
        return failure;
      }
      numbers.push(n2);
    }
    for (let i = 0; i < numbers.length - 1; ++i) {
      if (numbers[i] > 255) {
        return failure;
      }
    }
    if (numbers[numbers.length - 1] >= 256 ** (5 - numbers.length)) {
      return failure;
    }
    let ipv4 = numbers.pop();
    let counter = 0;
    for (const n2 of numbers) {
      ipv4 += n2 * 256 ** (3 - counter);
      ++counter;
    }
    return ipv4;
  }
  function serializeIPv4(address) {
    let output = "";
    let n2 = address;
    for (let i = 1; i <= 4; ++i) {
      output = String(n2 % 256) + output;
      if (i !== 4) {
        output = `.${output}`;
      }
      n2 = Math.floor(n2 / 256);
    }
    return output;
  }
  function parseIPv6(input) {
    const address = [0, 0, 0, 0, 0, 0, 0, 0];
    let pieceIndex = 0;
    let compress = null;
    let pointer = 0;
    input = Array.from(input, (c) => c.codePointAt(0));
    if (input[pointer] === p2(":")) {
      if (input[pointer + 1] !== p2(":")) {
        return failure;
      }
      pointer += 2;
      ++pieceIndex;
      compress = pieceIndex;
    }
    while (pointer < input.length) {
      if (pieceIndex === 8) {
        return failure;
      }
      if (input[pointer] === p2(":")) {
        if (compress !== null) {
          return failure;
        }
        ++pointer;
        ++pieceIndex;
        compress = pieceIndex;
        continue;
      }
      let value2 = 0;
      let length2 = 0;
      while (length2 < 4 && infra$1.isASCIIHex(input[pointer])) {
        value2 = value2 * 16 + parseInt(at(input, pointer), 16);
        ++pointer;
        ++length2;
      }
      if (input[pointer] === p2(".")) {
        if (length2 === 0) {
          return failure;
        }
        pointer -= length2;
        if (pieceIndex > 6) {
          return failure;
        }
        let numbersSeen = 0;
        while (input[pointer] !== void 0) {
          let ipv4Piece = null;
          if (numbersSeen > 0) {
            if (input[pointer] === p2(".") && numbersSeen < 4) {
              ++pointer;
            } else {
              return failure;
            }
          }
          if (!infra$1.isASCIIDigit(input[pointer])) {
            return failure;
          }
          while (infra$1.isASCIIDigit(input[pointer])) {
            const number = parseInt(at(input, pointer));
            if (ipv4Piece === null) {
              ipv4Piece = number;
            } else if (ipv4Piece === 0) {
              return failure;
            } else {
              ipv4Piece = ipv4Piece * 10 + number;
            }
            if (ipv4Piece > 255) {
              return failure;
            }
            ++pointer;
          }
          address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
          ++numbersSeen;
          if (numbersSeen === 2 || numbersSeen === 4) {
            ++pieceIndex;
          }
        }
        if (numbersSeen !== 4) {
          return failure;
        }
        break;
      } else if (input[pointer] === p2(":")) {
        ++pointer;
        if (input[pointer] === void 0) {
          return failure;
        }
      } else if (input[pointer] !== void 0) {
        return failure;
      }
      address[pieceIndex] = value2;
      ++pieceIndex;
    }
    if (compress !== null) {
      let swaps = pieceIndex - compress;
      pieceIndex = 7;
      while (pieceIndex !== 0 && swaps > 0) {
        const temp = address[compress + swaps - 1];
        address[compress + swaps - 1] = address[pieceIndex];
        address[pieceIndex] = temp;
        --pieceIndex;
        --swaps;
      }
    } else if (compress === null && pieceIndex !== 8) {
      return failure;
    }
    return address;
  }
  function serializeIPv6(address) {
    let output = "";
    const compress = findLongestZeroSequence(address);
    let ignore0 = false;
    for (let pieceIndex = 0; pieceIndex <= 7; ++pieceIndex) {
      if (ignore0 && address[pieceIndex] === 0) {
        continue;
      } else if (ignore0) {
        ignore0 = false;
      }
      if (compress === pieceIndex) {
        const separator = pieceIndex === 0 ? "::" : ":";
        output += separator;
        ignore0 = true;
        continue;
      }
      output += address[pieceIndex].toString(16);
      if (pieceIndex !== 7) {
        output += ":";
      }
    }
    return output;
  }
  function parseHost(input, isNotSpecialArg = false) {
    if (input[0] === "[") {
      if (input[input.length - 1] !== "]") {
        return failure;
      }
      return parseIPv6(input.substring(1, input.length - 1));
    }
    if (isNotSpecialArg) {
      return parseOpaqueHost(input);
    }
    const domain = utf8DecodeWithoutBOM2(percentDecodeString2(input));
    const asciiDomain = domainToASCII(domain);
    if (asciiDomain === failure) {
      return failure;
    }
    if (containsForbiddenDomainCodePoint(asciiDomain)) {
      return failure;
    }
    if (endsInANumber(asciiDomain)) {
      return parseIPv4(asciiDomain);
    }
    return asciiDomain;
  }
  function endsInANumber(input) {
    const parts = input.split(".");
    if (parts[parts.length - 1] === "") {
      if (parts.length === 1) {
        return false;
      }
      parts.pop();
    }
    const last = parts[parts.length - 1];
    if (parseIPv4Number(last) !== failure) {
      return true;
    }
    if (/^[0-9]+$/u.test(last)) {
      return true;
    }
    return false;
  }
  function parseOpaqueHost(input) {
    if (containsForbiddenHostCodePoint(input)) {
      return failure;
    }
    return utf8PercentEncodeString2(input, isC0ControlPercentEncode2);
  }
  function findLongestZeroSequence(arr) {
    let maxIdx = null;
    let maxLen = 1;
    let currStart = null;
    let currLen = 0;
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i] !== 0) {
        if (currLen > maxLen) {
          maxIdx = currStart;
          maxLen = currLen;
        }
        currStart = null;
        currLen = 0;
      } else {
        if (currStart === null) {
          currStart = i;
        }
        ++currLen;
      }
    }
    if (currLen > maxLen) {
      return currStart;
    }
    return maxIdx;
  }
  function serializeHost(host2) {
    if (typeof host2 === "number") {
      return serializeIPv4(host2);
    }
    if (host2 instanceof Array) {
      return `[${serializeIPv6(host2)}]`;
    }
    return host2;
  }
  function domainToASCII(domain, beStrict = false) {
    const result = tr46$1.toASCII(domain, {
      checkBidi: true,
      checkHyphens: false,
      checkJoiners: true,
      useSTD3ASCIIRules: beStrict,
      verifyDNSLength: beStrict
    });
    if (result === null || result === "") {
      return failure;
    }
    return result;
  }
  function trimControlChars(url) {
    return url.replace(/^[\u0000-\u001F\u0020]+|[\u0000-\u001F\u0020]+$/ug, "");
  }
  function trimTabAndNewline(url) {
    return url.replace(/\u0009|\u000A|\u000D/ug, "");
  }
  function shortenPath(url) {
    const { path } = url;
    if (path.length === 0) {
      return;
    }
    if (url.scheme === "file" && path.length === 1 && isNormalizedWindowsDriveLetter(path[0])) {
      return;
    }
    path.pop();
  }
  function includesCredentials(url) {
    return url.username !== "" || url.password !== "";
  }
  function cannotHaveAUsernamePasswordPort(url) {
    return url.host === null || url.host === "" || url.scheme === "file";
  }
  function hasAnOpaquePath(url) {
    return typeof url.path === "string";
  }
  function isNormalizedWindowsDriveLetter(string) {
    return /^[A-Za-z]:$/u.test(string);
  }
  function URLStateMachine(input, base2, encodingOverride, url, stateOverride) {
    this.pointer = 0;
    this.input = input;
    this.base = base2 || null;
    this.encodingOverride = encodingOverride || "utf-8";
    this.stateOverride = stateOverride;
    this.url = url;
    this.failure = false;
    this.parseError = false;
    if (!this.url) {
      this.url = {
        scheme: "",
        username: "",
        password: "",
        host: null,
        port: null,
        path: [],
        query: null,
        fragment: null
      };
      const res2 = trimControlChars(this.input);
      if (res2 !== this.input) {
        this.parseError = true;
      }
      this.input = res2;
    }
    const res = trimTabAndNewline(this.input);
    if (res !== this.input) {
      this.parseError = true;
    }
    this.input = res;
    this.state = stateOverride || "scheme start";
    this.buffer = "";
    this.atFlag = false;
    this.arrFlag = false;
    this.passwordTokenSeenFlag = false;
    this.input = Array.from(this.input, (c) => c.codePointAt(0));
    for (; this.pointer <= this.input.length; ++this.pointer) {
      const c = this.input[this.pointer];
      const cStr = isNaN(c) ? void 0 : String.fromCodePoint(c);
      const ret = this[`parse ${this.state}`](c, cStr);
      if (!ret) {
        break;
      } else if (ret === failure) {
        this.failure = true;
        break;
      }
    }
  }
  URLStateMachine.prototype["parse scheme start"] = function parseSchemeStart(c, cStr) {
    if (infra$1.isASCIIAlpha(c)) {
      this.buffer += cStr.toLowerCase();
      this.state = "scheme";
    } else if (!this.stateOverride) {
      this.state = "no scheme";
      --this.pointer;
    } else {
      this.parseError = true;
      return failure;
    }
    return true;
  };
  URLStateMachine.prototype["parse scheme"] = function parseScheme(c, cStr) {
    if (infra$1.isASCIIAlphanumeric(c) || c === p2("+") || c === p2("-") || c === p2(".")) {
      this.buffer += cStr.toLowerCase();
    } else if (c === p2(":")) {
      if (this.stateOverride) {
        if (isSpecial(this.url) && !isSpecialScheme(this.buffer)) {
          return false;
        }
        if (!isSpecial(this.url) && isSpecialScheme(this.buffer)) {
          return false;
        }
        if ((includesCredentials(this.url) || this.url.port !== null) && this.buffer === "file") {
          return false;
        }
        if (this.url.scheme === "file" && this.url.host === "") {
          return false;
        }
      }
      this.url.scheme = this.buffer;
      if (this.stateOverride) {
        if (this.url.port === defaultPort(this.url.scheme)) {
          this.url.port = null;
        }
        return false;
      }
      this.buffer = "";
      if (this.url.scheme === "file") {
        if (this.input[this.pointer + 1] !== p2("/") || this.input[this.pointer + 2] !== p2("/")) {
          this.parseError = true;
        }
        this.state = "file";
      } else if (isSpecial(this.url) && this.base !== null && this.base.scheme === this.url.scheme) {
        this.state = "special relative or authority";
      } else if (isSpecial(this.url)) {
        this.state = "special authority slashes";
      } else if (this.input[this.pointer + 1] === p2("/")) {
        this.state = "path or authority";
        ++this.pointer;
      } else {
        this.url.path = "";
        this.state = "opaque path";
      }
    } else if (!this.stateOverride) {
      this.buffer = "";
      this.state = "no scheme";
      this.pointer = -1;
    } else {
      this.parseError = true;
      return failure;
    }
    return true;
  };
  URLStateMachine.prototype["parse no scheme"] = function parseNoScheme(c) {
    if (this.base === null || hasAnOpaquePath(this.base) && c !== p2("#")) {
      return failure;
    } else if (hasAnOpaquePath(this.base) && c === p2("#")) {
      this.url.scheme = this.base.scheme;
      this.url.path = this.base.path;
      this.url.query = this.base.query;
      this.url.fragment = "";
      this.state = "fragment";
    } else if (this.base.scheme === "file") {
      this.state = "file";
      --this.pointer;
    } else {
      this.state = "relative";
      --this.pointer;
    }
    return true;
  };
  URLStateMachine.prototype["parse special relative or authority"] = function parseSpecialRelativeOrAuthority(c) {
    if (c === p2("/") && this.input[this.pointer + 1] === p2("/")) {
      this.state = "special authority ignore slashes";
      ++this.pointer;
    } else {
      this.parseError = true;
      this.state = "relative";
      --this.pointer;
    }
    return true;
  };
  URLStateMachine.prototype["parse path or authority"] = function parsePathOrAuthority(c) {
    if (c === p2("/")) {
      this.state = "authority";
    } else {
      this.state = "path";
      --this.pointer;
    }
    return true;
  };
  URLStateMachine.prototype["parse relative"] = function parseRelative(c) {
    this.url.scheme = this.base.scheme;
    if (c === p2("/")) {
      this.state = "relative slash";
    } else if (isSpecial(this.url) && c === p2("\\")) {
      this.parseError = true;
      this.state = "relative slash";
    } else {
      this.url.username = this.base.username;
      this.url.password = this.base.password;
      this.url.host = this.base.host;
      this.url.port = this.base.port;
      this.url.path = this.base.path.slice();
      this.url.query = this.base.query;
      if (c === p2("?")) {
        this.url.query = "";
        this.state = "query";
      } else if (c === p2("#")) {
        this.url.fragment = "";
        this.state = "fragment";
      } else if (!isNaN(c)) {
        this.url.query = null;
        this.url.path.pop();
        this.state = "path";
        --this.pointer;
      }
    }
    return true;
  };
  URLStateMachine.prototype["parse relative slash"] = function parseRelativeSlash(c) {
    if (isSpecial(this.url) && (c === p2("/") || c === p2("\\"))) {
      if (c === p2("\\")) {
        this.parseError = true;
      }
      this.state = "special authority ignore slashes";
    } else if (c === p2("/")) {
      this.state = "authority";
    } else {
      this.url.username = this.base.username;
      this.url.password = this.base.password;
      this.url.host = this.base.host;
      this.url.port = this.base.port;
      this.state = "path";
      --this.pointer;
    }
    return true;
  };
  URLStateMachine.prototype["parse special authority slashes"] = function parseSpecialAuthoritySlashes(c) {
    if (c === p2("/") && this.input[this.pointer + 1] === p2("/")) {
      this.state = "special authority ignore slashes";
      ++this.pointer;
    } else {
      this.parseError = true;
      this.state = "special authority ignore slashes";
      --this.pointer;
    }
    return true;
  };
  URLStateMachine.prototype["parse special authority ignore slashes"] = function parseSpecialAuthorityIgnoreSlashes(c) {
    if (c !== p2("/") && c !== p2("\\")) {
      this.state = "authority";
      --this.pointer;
    } else {
      this.parseError = true;
    }
    return true;
  };
  URLStateMachine.prototype["parse authority"] = function parseAuthority(c, cStr) {
    if (c === p2("@")) {
      this.parseError = true;
      if (this.atFlag) {
        this.buffer = `%40${this.buffer}`;
      }
      this.atFlag = true;
      const len = countSymbols(this.buffer);
      for (let pointer = 0; pointer < len; ++pointer) {
        const codePoint = this.buffer.codePointAt(pointer);
        if (codePoint === p2(":") && !this.passwordTokenSeenFlag) {
          this.passwordTokenSeenFlag = true;
          continue;
        }
        const encodedCodePoints = utf8PercentEncodeCodePoint2(codePoint, isUserinfoPercentEncode2);
        if (this.passwordTokenSeenFlag) {
          this.url.password += encodedCodePoints;
        } else {
          this.url.username += encodedCodePoints;
        }
      }
      this.buffer = "";
    } else if (isNaN(c) || c === p2("/") || c === p2("?") || c === p2("#") || isSpecial(this.url) && c === p2("\\")) {
      if (this.atFlag && this.buffer === "") {
        this.parseError = true;
        return failure;
      }
      this.pointer -= countSymbols(this.buffer) + 1;
      this.buffer = "";
      this.state = "host";
    } else {
      this.buffer += cStr;
    }
    return true;
  };
  URLStateMachine.prototype["parse hostname"] = URLStateMachine.prototype["parse host"] = function parseHostName(c, cStr) {
    if (this.stateOverride && this.url.scheme === "file") {
      --this.pointer;
      this.state = "file host";
    } else if (c === p2(":") && !this.arrFlag) {
      if (this.buffer === "") {
        this.parseError = true;
        return failure;
      }
      if (this.stateOverride === "hostname") {
        return false;
      }
      const host2 = parseHost(this.buffer, isNotSpecial(this.url));
      if (host2 === failure) {
        return failure;
      }
      this.url.host = host2;
      this.buffer = "";
      this.state = "port";
    } else if (isNaN(c) || c === p2("/") || c === p2("?") || c === p2("#") || isSpecial(this.url) && c === p2("\\")) {
      --this.pointer;
      if (isSpecial(this.url) && this.buffer === "") {
        this.parseError = true;
        return failure;
      } else if (this.stateOverride && this.buffer === "" && (includesCredentials(this.url) || this.url.port !== null)) {
        this.parseError = true;
        return false;
      }
      const host2 = parseHost(this.buffer, isNotSpecial(this.url));
      if (host2 === failure) {
        return failure;
      }
      this.url.host = host2;
      this.buffer = "";
      this.state = "path start";
      if (this.stateOverride) {
        return false;
      }
    } else {
      if (c === p2("[")) {
        this.arrFlag = true;
      } else if (c === p2("]")) {
        this.arrFlag = false;
      }
      this.buffer += cStr;
    }
    return true;
  };
  URLStateMachine.prototype["parse port"] = function parsePort(c, cStr) {
    if (infra$1.isASCIIDigit(c)) {
      this.buffer += cStr;
    } else if (isNaN(c) || c === p2("/") || c === p2("?") || c === p2("#") || isSpecial(this.url) && c === p2("\\") || this.stateOverride) {
      if (this.buffer !== "") {
        const port = parseInt(this.buffer);
        if (port > 2 ** 16 - 1) {
          this.parseError = true;
          return failure;
        }
        this.url.port = port === defaultPort(this.url.scheme) ? null : port;
        this.buffer = "";
      }
      if (this.stateOverride) {
        return false;
      }
      this.state = "path start";
      --this.pointer;
    } else {
      this.parseError = true;
      return failure;
    }
    return true;
  };
  const fileOtherwiseCodePoints = /* @__PURE__ */ new Set([p2("/"), p2("\\"), p2("?"), p2("#")]);
  function startsWithWindowsDriveLetter(input, pointer) {
    const length2 = input.length - pointer;
    return length2 >= 2 && isWindowsDriveLetterCodePoints(input[pointer], input[pointer + 1]) && (length2 === 2 || fileOtherwiseCodePoints.has(input[pointer + 2]));
  }
  URLStateMachine.prototype["parse file"] = function parseFile(c) {
    this.url.scheme = "file";
    this.url.host = "";
    if (c === p2("/") || c === p2("\\")) {
      if (c === p2("\\")) {
        this.parseError = true;
      }
      this.state = "file slash";
    } else if (this.base !== null && this.base.scheme === "file") {
      this.url.host = this.base.host;
      this.url.path = this.base.path.slice();
      this.url.query = this.base.query;
      if (c === p2("?")) {
        this.url.query = "";
        this.state = "query";
      } else if (c === p2("#")) {
        this.url.fragment = "";
        this.state = "fragment";
      } else if (!isNaN(c)) {
        this.url.query = null;
        if (!startsWithWindowsDriveLetter(this.input, this.pointer)) {
          shortenPath(this.url);
        } else {
          this.parseError = true;
          this.url.path = [];
        }
        this.state = "path";
        --this.pointer;
      }
    } else {
      this.state = "path";
      --this.pointer;
    }
    return true;
  };
  URLStateMachine.prototype["parse file slash"] = function parseFileSlash(c) {
    if (c === p2("/") || c === p2("\\")) {
      if (c === p2("\\")) {
        this.parseError = true;
      }
      this.state = "file host";
    } else {
      if (this.base !== null && this.base.scheme === "file") {
        if (!startsWithWindowsDriveLetter(this.input, this.pointer) && isNormalizedWindowsDriveLetterString(this.base.path[0])) {
          this.url.path.push(this.base.path[0]);
        }
        this.url.host = this.base.host;
      }
      this.state = "path";
      --this.pointer;
    }
    return true;
  };
  URLStateMachine.prototype["parse file host"] = function parseFileHost(c, cStr) {
    if (isNaN(c) || c === p2("/") || c === p2("\\") || c === p2("?") || c === p2("#")) {
      --this.pointer;
      if (!this.stateOverride && isWindowsDriveLetterString(this.buffer)) {
        this.parseError = true;
        this.state = "path";
      } else if (this.buffer === "") {
        this.url.host = "";
        if (this.stateOverride) {
          return false;
        }
        this.state = "path start";
      } else {
        let host2 = parseHost(this.buffer, isNotSpecial(this.url));
        if (host2 === failure) {
          return failure;
        }
        if (host2 === "localhost") {
          host2 = "";
        }
        this.url.host = host2;
        if (this.stateOverride) {
          return false;
        }
        this.buffer = "";
        this.state = "path start";
      }
    } else {
      this.buffer += cStr;
    }
    return true;
  };
  URLStateMachine.prototype["parse path start"] = function parsePathStart(c) {
    if (isSpecial(this.url)) {
      if (c === p2("\\")) {
        this.parseError = true;
      }
      this.state = "path";
      if (c !== p2("/") && c !== p2("\\")) {
        --this.pointer;
      }
    } else if (!this.stateOverride && c === p2("?")) {
      this.url.query = "";
      this.state = "query";
    } else if (!this.stateOverride && c === p2("#")) {
      this.url.fragment = "";
      this.state = "fragment";
    } else if (c !== void 0) {
      this.state = "path";
      if (c !== p2("/")) {
        --this.pointer;
      }
    } else if (this.stateOverride && this.url.host === null) {
      this.url.path.push("");
    }
    return true;
  };
  URLStateMachine.prototype["parse path"] = function parsePath(c) {
    if (isNaN(c) || c === p2("/") || isSpecial(this.url) && c === p2("\\") || !this.stateOverride && (c === p2("?") || c === p2("#"))) {
      if (isSpecial(this.url) && c === p2("\\")) {
        this.parseError = true;
      }
      if (isDoubleDot(this.buffer)) {
        shortenPath(this.url);
        if (c !== p2("/") && !(isSpecial(this.url) && c === p2("\\"))) {
          this.url.path.push("");
        }
      } else if (isSingleDot(this.buffer) && c !== p2("/") && !(isSpecial(this.url) && c === p2("\\"))) {
        this.url.path.push("");
      } else if (!isSingleDot(this.buffer)) {
        if (this.url.scheme === "file" && this.url.path.length === 0 && isWindowsDriveLetterString(this.buffer)) {
          this.buffer = `${this.buffer[0]}:`;
        }
        this.url.path.push(this.buffer);
      }
      this.buffer = "";
      if (c === p2("?")) {
        this.url.query = "";
        this.state = "query";
      }
      if (c === p2("#")) {
        this.url.fragment = "";
        this.state = "fragment";
      }
    } else {
      if (c === p2("%") && (!infra$1.isASCIIHex(this.input[this.pointer + 1]) || !infra$1.isASCIIHex(this.input[this.pointer + 2]))) {
        this.parseError = true;
      }
      this.buffer += utf8PercentEncodeCodePoint2(c, isPathPercentEncode2);
    }
    return true;
  };
  URLStateMachine.prototype["parse opaque path"] = function parseOpaquePath(c) {
    if (c === p2("?")) {
      this.url.query = "";
      this.state = "query";
    } else if (c === p2("#")) {
      this.url.fragment = "";
      this.state = "fragment";
    } else {
      if (!isNaN(c) && c !== p2("%")) {
        this.parseError = true;
      }
      if (c === p2("%") && (!infra$1.isASCIIHex(this.input[this.pointer + 1]) || !infra$1.isASCIIHex(this.input[this.pointer + 2]))) {
        this.parseError = true;
      }
      if (!isNaN(c)) {
        this.url.path += utf8PercentEncodeCodePoint2(c, isC0ControlPercentEncode2);
      }
    }
    return true;
  };
  URLStateMachine.prototype["parse query"] = function parseQuery(c, cStr) {
    if (!isSpecial(this.url) || this.url.scheme === "ws" || this.url.scheme === "wss") {
      this.encodingOverride = "utf-8";
    }
    if (!this.stateOverride && c === p2("#") || isNaN(c)) {
      const queryPercentEncodePredicate = isSpecial(this.url) ? isSpecialQueryPercentEncode2 : isQueryPercentEncode2;
      this.url.query += utf8PercentEncodeString2(this.buffer, queryPercentEncodePredicate);
      this.buffer = "";
      if (c === p2("#")) {
        this.url.fragment = "";
        this.state = "fragment";
      }
    } else if (!isNaN(c)) {
      if (c === p2("%") && (!infra$1.isASCIIHex(this.input[this.pointer + 1]) || !infra$1.isASCIIHex(this.input[this.pointer + 2]))) {
        this.parseError = true;
      }
      this.buffer += cStr;
    }
    return true;
  };
  URLStateMachine.prototype["parse fragment"] = function parseFragment(c) {
    if (!isNaN(c)) {
      if (c === p2("%") && (!infra$1.isASCIIHex(this.input[this.pointer + 1]) || !infra$1.isASCIIHex(this.input[this.pointer + 2]))) {
        this.parseError = true;
      }
      this.url.fragment += utf8PercentEncodeCodePoint2(c, isFragmentPercentEncode2);
    }
    return true;
  };
  function serializeURL(url, excludeFragment) {
    let output = `${url.scheme}:`;
    if (url.host !== null) {
      output += "//";
      if (url.username !== "" || url.password !== "") {
        output += url.username;
        if (url.password !== "") {
          output += `:${url.password}`;
        }
        output += "@";
      }
      output += serializeHost(url.host);
      if (url.port !== null) {
        output += `:${url.port}`;
      }
    }
    if (url.host === null && !hasAnOpaquePath(url) && url.path.length > 1 && url.path[0] === "") {
      output += "/.";
    }
    output += serializePath(url);
    if (url.query !== null) {
      output += `?${url.query}`;
    }
    if (!excludeFragment && url.fragment !== null) {
      output += `#${url.fragment}`;
    }
    return output;
  }
  function serializeOrigin(tuple) {
    let result = `${tuple.scheme}://`;
    result += serializeHost(tuple.host);
    if (tuple.port !== null) {
      result += `:${tuple.port}`;
    }
    return result;
  }
  function serializePath(url) {
    if (hasAnOpaquePath(url)) {
      return url.path;
    }
    let output = "";
    for (const segment of url.path) {
      output += `/${segment}`;
    }
    return output;
  }
  module.exports.serializeURL = serializeURL;
  module.exports.serializePath = serializePath;
  module.exports.serializeURLOrigin = function(url) {
    switch (url.scheme) {
      case "blob": {
        const pathURL = module.exports.parseURL(serializePath(url));
        if (pathURL === null) {
          return "null";
        }
        if (pathURL.scheme !== "http" && pathURL.scheme !== "https") {
          return "null";
        }
        return module.exports.serializeURLOrigin(pathURL);
      }
      case "ftp":
      case "http":
      case "https":
      case "ws":
      case "wss":
        return serializeOrigin({
          scheme: url.scheme,
          host: url.host,
          port: url.port
        });
      case "file":
        return "null";
      default:
        return "null";
    }
  };
  module.exports.basicURLParse = function(input, options2) {
    if (options2 === void 0) {
      options2 = {};
    }
    const usm = new URLStateMachine(input, options2.baseURL, options2.encodingOverride, options2.url, options2.stateOverride);
    if (usm.failure) {
      return null;
    }
    return usm.url;
  };
  module.exports.setTheUsername = function(url, username) {
    url.username = utf8PercentEncodeString2(username, isUserinfoPercentEncode2);
  };
  module.exports.setThePassword = function(url, password) {
    url.password = utf8PercentEncodeString2(password, isUserinfoPercentEncode2);
  };
  module.exports.serializeHost = serializeHost;
  module.exports.cannotHaveAUsernamePasswordPort = cannotHaveAUsernamePasswordPort;
  module.exports.hasAnOpaquePath = hasAnOpaquePath;
  module.exports.serializeInteger = function(integer) {
    return String(integer);
  };
  module.exports.parseURL = function(input, options2) {
    if (options2 === void 0) {
      options2 = {};
    }
    return module.exports.basicURLParse(input, { baseURL: options2.baseURL, encodingOverride: options2.encodingOverride });
  };
})(urlStateMachine$1);
var urlStateMachineExports = urlStateMachine$1.exports;
var urlencoded;
var hasRequiredUrlencoded;
function requireUrlencoded() {
  if (hasRequiredUrlencoded) return urlencoded;
  hasRequiredUrlencoded = 1;
  const { utf8Encode: utf8Encode2, utf8DecodeWithoutBOM: utf8DecodeWithoutBOM2 } = encoding;
  const { percentDecodeBytes: percentDecodeBytes2, utf8PercentEncodeString: utf8PercentEncodeString2, isURLEncodedPercentEncode: isURLEncodedPercentEncode2 } = percentEncoding$1;
  function p2(char) {
    return char.codePointAt(0);
  }
  function parseUrlencoded(input) {
    const sequences = strictlySplitByteSequence(input, p2("&"));
    const output = [];
    for (const bytes of sequences) {
      if (bytes.length === 0) {
        continue;
      }
      let name2, value2;
      const indexOfEqual = bytes.indexOf(p2("="));
      if (indexOfEqual >= 0) {
        name2 = bytes.slice(0, indexOfEqual);
        value2 = bytes.slice(indexOfEqual + 1);
      } else {
        name2 = bytes;
        value2 = new Uint8Array(0);
      }
      name2 = replaceByteInByteSequence(name2, 43, 32);
      value2 = replaceByteInByteSequence(value2, 43, 32);
      const nameString = utf8DecodeWithoutBOM2(percentDecodeBytes2(name2));
      const valueString = utf8DecodeWithoutBOM2(percentDecodeBytes2(value2));
      output.push([nameString, valueString]);
    }
    return output;
  }
  function parseUrlencodedString(input) {
    return parseUrlencoded(utf8Encode2(input));
  }
  function serializeUrlencoded(tuples, encodingOverride = void 0) {
    let encoding2 = "utf-8";
    if (encodingOverride !== void 0) {
      encoding2 = encodingOverride;
    }
    let output = "";
    for (const [i, tuple] of tuples.entries()) {
      const name2 = utf8PercentEncodeString2(tuple[0], isURLEncodedPercentEncode2, true);
      let value2 = tuple[1];
      if (tuple.length > 2 && tuple[2] !== void 0) {
        if (tuple[2] === "hidden" && name2 === "_charset_") {
          value2 = encoding2;
        } else if (tuple[2] === "file") {
          value2 = value2.name;
        }
      }
      value2 = utf8PercentEncodeString2(value2, isURLEncodedPercentEncode2, true);
      if (i !== 0) {
        output += "&";
      }
      output += `${name2}=${value2}`;
    }
    return output;
  }
  function strictlySplitByteSequence(buf, cp) {
    const list2 = [];
    let last = 0;
    let i = buf.indexOf(cp);
    while (i >= 0) {
      list2.push(buf.slice(last, i));
      last = i + 1;
      i = buf.indexOf(cp, last);
    }
    if (last !== buf.length) {
      list2.push(buf.slice(last));
    }
    return list2;
  }
  function replaceByteInByteSequence(buf, from, to) {
    let i = buf.indexOf(from);
    while (i >= 0) {
      buf[i] = to;
      i = buf.indexOf(from, i + 1);
    }
    return buf;
  }
  urlencoded = {
    parseUrlencodedString,
    serializeUrlencoded
  };
  return urlencoded;
}
var URLSearchParams$2 = {};
var _Function = {};
const conversions = lib;
const utils$1 = utilsExports;
_Function.convert = (globalObject, value2, { context = "The provided value" } = {}) => {
  if (typeof value2 !== "function") {
    throw new globalObject.TypeError(context + " is not a function");
  }
  function invokeTheCallbackFunction(...args) {
    const thisArg = utils$1.tryWrapperForImpl(this);
    let callResult;
    for (let i = 0; i < args.length; i++) {
      args[i] = utils$1.tryWrapperForImpl(args[i]);
    }
    callResult = Reflect.apply(value2, thisArg, args);
    callResult = conversions["any"](callResult, { context, globals: globalObject });
    return callResult;
  }
  invokeTheCallbackFunction.construct = (...args) => {
    for (let i = 0; i < args.length; i++) {
      args[i] = utils$1.tryWrapperForImpl(args[i]);
    }
    let callResult = Reflect.construct(value2, args);
    callResult = conversions["any"](callResult, { context, globals: globalObject });
    return callResult;
  };
  invokeTheCallbackFunction[utils$1.wrapperSymbol] = value2;
  invokeTheCallbackFunction.objectReference = value2;
  return invokeTheCallbackFunction;
};
var URLSearchParamsImpl = {};
var hasRequiredURLSearchParamsImpl;
function requireURLSearchParamsImpl() {
  if (hasRequiredURLSearchParamsImpl) return URLSearchParamsImpl;
  hasRequiredURLSearchParamsImpl = 1;
  const urlencoded2 = requireUrlencoded();
  URLSearchParamsImpl.implementation = class URLSearchParamsImpl {
    constructor(globalObject, constructorArgs, { doNotStripQMark = false }) {
      let init = constructorArgs[0];
      this._list = [];
      this._url = null;
      if (!doNotStripQMark && typeof init === "string" && init[0] === "?") {
        init = init.slice(1);
      }
      if (Array.isArray(init)) {
        for (const pair of init) {
          if (pair.length !== 2) {
            throw new TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence's element does not contain exactly two elements.");
          }
          this._list.push([pair[0], pair[1]]);
        }
      } else if (typeof init === "object" && Object.getPrototypeOf(init) === null) {
        for (const name2 of Object.keys(init)) {
          const value2 = init[name2];
          this._list.push([name2, value2]);
        }
      } else {
        this._list = urlencoded2.parseUrlencodedString(init);
      }
    }
    _updateSteps() {
      if (this._url !== null) {
        let serializedQuery = urlencoded2.serializeUrlencoded(this._list);
        if (serializedQuery === "") {
          serializedQuery = null;
        }
        this._url._url.query = serializedQuery;
        if (serializedQuery === null) {
          this._url._potentiallyStripTrailingSpacesFromAnOpaquePath();
        }
      }
    }
    get size() {
      return this._list.length;
    }
    append(name2, value2) {
      this._list.push([name2, value2]);
      this._updateSteps();
    }
    delete(name2, value2) {
      let i = 0;
      while (i < this._list.length) {
        if (this._list[i][0] === name2 && (value2 === void 0 || this._list[i][1] === value2)) {
          this._list.splice(i, 1);
        } else {
          i++;
        }
      }
      this._updateSteps();
    }
    get(name2) {
      for (const tuple of this._list) {
        if (tuple[0] === name2) {
          return tuple[1];
        }
      }
      return null;
    }
    getAll(name2) {
      const output = [];
      for (const tuple of this._list) {
        if (tuple[0] === name2) {
          output.push(tuple[1]);
        }
      }
      return output;
    }
    has(name2, value2) {
      for (const tuple of this._list) {
        if (tuple[0] === name2 && (value2 === void 0 || tuple[1] === value2)) {
          return true;
        }
      }
      return false;
    }
    set(name2, value2) {
      let found = false;
      let i = 0;
      while (i < this._list.length) {
        if (this._list[i][0] === name2) {
          if (found) {
            this._list.splice(i, 1);
          } else {
            found = true;
            this._list[i][1] = value2;
            i++;
          }
        } else {
          i++;
        }
      }
      if (!found) {
        this._list.push([name2, value2]);
      }
      this._updateSteps();
    }
    sort() {
      this._list.sort((a, b) => {
        if (a[0] < b[0]) {
          return -1;
        }
        if (a[0] > b[0]) {
          return 1;
        }
        return 0;
      });
      this._updateSteps();
    }
    [Symbol.iterator]() {
      return this._list[Symbol.iterator]();
    }
    toString() {
      return urlencoded2.serializeUrlencoded(this._list);
    }
  };
  return URLSearchParamsImpl;
}
(function(exports) {
  const conversions2 = lib;
  const utils2 = utilsExports;
  const Function3 = _Function;
  const newObjectInRealm = utils2.newObjectInRealm;
  const implSymbol = utils2.implSymbol;
  const ctorRegistrySymbol = utils2.ctorRegistrySymbol;
  const interfaceName = "URLSearchParams";
  exports.is = (value2) => {
    return utils2.isObject(value2) && utils2.hasOwn(value2, implSymbol) && value2[implSymbol] instanceof Impl.implementation;
  };
  exports.isImpl = (value2) => {
    return utils2.isObject(value2) && value2 instanceof Impl.implementation;
  };
  exports.convert = (globalObject, value2, { context = "The provided value" } = {}) => {
    if (exports.is(value2)) {
      return utils2.implForWrapper(value2);
    }
    throw new globalObject.TypeError(`${context} is not of type 'URLSearchParams'.`);
  };
  exports.createDefaultIterator = (globalObject, target2, kind) => {
    const ctorRegistry = globalObject[ctorRegistrySymbol];
    const iteratorPrototype = ctorRegistry["URLSearchParams Iterator"];
    const iterator = Object.create(iteratorPrototype);
    Object.defineProperty(iterator, utils2.iterInternalSymbol, {
      value: { target: target2, kind, index: 0 },
      configurable: true
    });
    return iterator;
  };
  function makeWrapper(globalObject, newTarget) {
    let proto;
    if (newTarget !== void 0) {
      proto = newTarget.prototype;
    }
    if (!utils2.isObject(proto)) {
      proto = globalObject[ctorRegistrySymbol]["URLSearchParams"].prototype;
    }
    return Object.create(proto);
  }
  exports.create = (globalObject, constructorArgs, privateData) => {
    const wrapper = makeWrapper(globalObject);
    return exports.setup(wrapper, globalObject, constructorArgs, privateData);
  };
  exports.createImpl = (globalObject, constructorArgs, privateData) => {
    const wrapper = exports.create(globalObject, constructorArgs, privateData);
    return utils2.implForWrapper(wrapper);
  };
  exports._internalSetup = (wrapper, globalObject) => {
  };
  exports.setup = (wrapper, globalObject, constructorArgs = [], privateData = {}) => {
    privateData.wrapper = wrapper;
    exports._internalSetup(wrapper, globalObject);
    Object.defineProperty(wrapper, implSymbol, {
      value: new Impl.implementation(globalObject, constructorArgs, privateData),
      configurable: true
    });
    wrapper[implSymbol][utils2.wrapperSymbol] = wrapper;
    if (Impl.init) {
      Impl.init(wrapper[implSymbol]);
    }
    return wrapper;
  };
  exports.new = (globalObject, newTarget) => {
    const wrapper = makeWrapper(globalObject, newTarget);
    exports._internalSetup(wrapper, globalObject);
    Object.defineProperty(wrapper, implSymbol, {
      value: Object.create(Impl.implementation.prototype),
      configurable: true
    });
    wrapper[implSymbol][utils2.wrapperSymbol] = wrapper;
    if (Impl.init) {
      Impl.init(wrapper[implSymbol]);
    }
    return wrapper[implSymbol];
  };
  const exposed = /* @__PURE__ */ new Set(["Window", "Worker"]);
  exports.install = (globalObject, globalNames) => {
    if (!globalNames.some((globalName) => exposed.has(globalName))) {
      return;
    }
    const ctorRegistry = utils2.initCtorRegistry(globalObject);
    class URLSearchParams2 {
      constructor() {
        const args = [];
        {
          let curArg = arguments[0];
          if (curArg !== void 0) {
            if (utils2.isObject(curArg)) {
              if (curArg[Symbol.iterator] !== void 0) {
                if (!utils2.isObject(curArg)) {
                  throw new globalObject.TypeError(
                    "Failed to construct 'URLSearchParams': parameter 1 sequence is not an iterable object."
                  );
                } else {
                  const V = [];
                  const tmp = curArg;
                  for (let nextItem of tmp) {
                    if (!utils2.isObject(nextItem)) {
                      throw new globalObject.TypeError(
                        "Failed to construct 'URLSearchParams': parameter 1 sequence's element is not an iterable object."
                      );
                    } else {
                      const V2 = [];
                      const tmp2 = nextItem;
                      for (let nextItem2 of tmp2) {
                        nextItem2 = conversions2["USVString"](nextItem2, {
                          context: "Failed to construct 'URLSearchParams': parameter 1 sequence's element's element",
                          globals: globalObject
                        });
                        V2.push(nextItem2);
                      }
                      nextItem = V2;
                    }
                    V.push(nextItem);
                  }
                  curArg = V;
                }
              } else {
                if (!utils2.isObject(curArg)) {
                  throw new globalObject.TypeError(
                    "Failed to construct 'URLSearchParams': parameter 1 record is not an object."
                  );
                } else {
                  const result = /* @__PURE__ */ Object.create(null);
                  for (const key of Reflect.ownKeys(curArg)) {
                    const desc = Object.getOwnPropertyDescriptor(curArg, key);
                    if (desc && desc.enumerable) {
                      let typedKey = key;
                      typedKey = conversions2["USVString"](typedKey, {
                        context: "Failed to construct 'URLSearchParams': parameter 1 record's key",
                        globals: globalObject
                      });
                      let typedValue = curArg[key];
                      typedValue = conversions2["USVString"](typedValue, {
                        context: "Failed to construct 'URLSearchParams': parameter 1 record's value",
                        globals: globalObject
                      });
                      result[typedKey] = typedValue;
                    }
                  }
                  curArg = result;
                }
              }
            } else {
              curArg = conversions2["USVString"](curArg, {
                context: "Failed to construct 'URLSearchParams': parameter 1",
                globals: globalObject
              });
            }
          } else {
            curArg = "";
          }
          args.push(curArg);
        }
        return exports.setup(Object.create(new.target.prototype), globalObject, args);
      }
      append(name2, value2) {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError(
            "'append' called on an object that is not a valid instance of URLSearchParams."
          );
        }
        if (arguments.length < 2) {
          throw new globalObject.TypeError(
            `Failed to execute 'append' on 'URLSearchParams': 2 arguments required, but only ${arguments.length} present.`
          );
        }
        const args = [];
        {
          let curArg = arguments[0];
          curArg = conversions2["USVString"](curArg, {
            context: "Failed to execute 'append' on 'URLSearchParams': parameter 1",
            globals: globalObject
          });
          args.push(curArg);
        }
        {
          let curArg = arguments[1];
          curArg = conversions2["USVString"](curArg, {
            context: "Failed to execute 'append' on 'URLSearchParams': parameter 2",
            globals: globalObject
          });
          args.push(curArg);
        }
        return utils2.tryWrapperForImpl(esValue[implSymbol].append(...args));
      }
      delete(name2) {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError(
            "'delete' called on an object that is not a valid instance of URLSearchParams."
          );
        }
        if (arguments.length < 1) {
          throw new globalObject.TypeError(
            `Failed to execute 'delete' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`
          );
        }
        const args = [];
        {
          let curArg = arguments[0];
          curArg = conversions2["USVString"](curArg, {
            context: "Failed to execute 'delete' on 'URLSearchParams': parameter 1",
            globals: globalObject
          });
          args.push(curArg);
        }
        {
          let curArg = arguments[1];
          if (curArg !== void 0) {
            curArg = conversions2["USVString"](curArg, {
              context: "Failed to execute 'delete' on 'URLSearchParams': parameter 2",
              globals: globalObject
            });
          }
          args.push(curArg);
        }
        return utils2.tryWrapperForImpl(esValue[implSymbol].delete(...args));
      }
      get(name2) {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get' called on an object that is not a valid instance of URLSearchParams.");
        }
        if (arguments.length < 1) {
          throw new globalObject.TypeError(
            `Failed to execute 'get' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`
          );
        }
        const args = [];
        {
          let curArg = arguments[0];
          curArg = conversions2["USVString"](curArg, {
            context: "Failed to execute 'get' on 'URLSearchParams': parameter 1",
            globals: globalObject
          });
          args.push(curArg);
        }
        return esValue[implSymbol].get(...args);
      }
      getAll(name2) {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError(
            "'getAll' called on an object that is not a valid instance of URLSearchParams."
          );
        }
        if (arguments.length < 1) {
          throw new globalObject.TypeError(
            `Failed to execute 'getAll' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`
          );
        }
        const args = [];
        {
          let curArg = arguments[0];
          curArg = conversions2["USVString"](curArg, {
            context: "Failed to execute 'getAll' on 'URLSearchParams': parameter 1",
            globals: globalObject
          });
          args.push(curArg);
        }
        return utils2.tryWrapperForImpl(esValue[implSymbol].getAll(...args));
      }
      has(name2) {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'has' called on an object that is not a valid instance of URLSearchParams.");
        }
        if (arguments.length < 1) {
          throw new globalObject.TypeError(
            `Failed to execute 'has' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`
          );
        }
        const args = [];
        {
          let curArg = arguments[0];
          curArg = conversions2["USVString"](curArg, {
            context: "Failed to execute 'has' on 'URLSearchParams': parameter 1",
            globals: globalObject
          });
          args.push(curArg);
        }
        {
          let curArg = arguments[1];
          if (curArg !== void 0) {
            curArg = conversions2["USVString"](curArg, {
              context: "Failed to execute 'has' on 'URLSearchParams': parameter 2",
              globals: globalObject
            });
          }
          args.push(curArg);
        }
        return esValue[implSymbol].has(...args);
      }
      set(name2, value2) {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set' called on an object that is not a valid instance of URLSearchParams.");
        }
        if (arguments.length < 2) {
          throw new globalObject.TypeError(
            `Failed to execute 'set' on 'URLSearchParams': 2 arguments required, but only ${arguments.length} present.`
          );
        }
        const args = [];
        {
          let curArg = arguments[0];
          curArg = conversions2["USVString"](curArg, {
            context: "Failed to execute 'set' on 'URLSearchParams': parameter 1",
            globals: globalObject
          });
          args.push(curArg);
        }
        {
          let curArg = arguments[1];
          curArg = conversions2["USVString"](curArg, {
            context: "Failed to execute 'set' on 'URLSearchParams': parameter 2",
            globals: globalObject
          });
          args.push(curArg);
        }
        return utils2.tryWrapperForImpl(esValue[implSymbol].set(...args));
      }
      sort() {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'sort' called on an object that is not a valid instance of URLSearchParams.");
        }
        return utils2.tryWrapperForImpl(esValue[implSymbol].sort());
      }
      toString() {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError(
            "'toString' called on an object that is not a valid instance of URLSearchParams."
          );
        }
        return esValue[implSymbol].toString();
      }
      keys() {
        if (!exports.is(this)) {
          throw new globalObject.TypeError("'keys' called on an object that is not a valid instance of URLSearchParams.");
        }
        return exports.createDefaultIterator(globalObject, this, "key");
      }
      values() {
        if (!exports.is(this)) {
          throw new globalObject.TypeError(
            "'values' called on an object that is not a valid instance of URLSearchParams."
          );
        }
        return exports.createDefaultIterator(globalObject, this, "value");
      }
      entries() {
        if (!exports.is(this)) {
          throw new globalObject.TypeError(
            "'entries' called on an object that is not a valid instance of URLSearchParams."
          );
        }
        return exports.createDefaultIterator(globalObject, this, "key+value");
      }
      forEach(callback) {
        if (!exports.is(this)) {
          throw new globalObject.TypeError(
            "'forEach' called on an object that is not a valid instance of URLSearchParams."
          );
        }
        if (arguments.length < 1) {
          throw new globalObject.TypeError(
            "Failed to execute 'forEach' on 'iterable': 1 argument required, but only 0 present."
          );
        }
        callback = Function3.convert(globalObject, callback, {
          context: "Failed to execute 'forEach' on 'iterable': The callback provided as parameter 1"
        });
        const thisArg = arguments[1];
        let pairs = Array.from(this[implSymbol]);
        let i = 0;
        while (i < pairs.length) {
          const [key, value2] = pairs[i].map(utils2.tryWrapperForImpl);
          callback.call(thisArg, value2, key, this);
          pairs = Array.from(this[implSymbol]);
          i++;
        }
      }
      get size() {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError(
            "'get size' called on an object that is not a valid instance of URLSearchParams."
          );
        }
        return esValue[implSymbol]["size"];
      }
    }
    Object.defineProperties(URLSearchParams2.prototype, {
      append: { enumerable: true },
      delete: { enumerable: true },
      get: { enumerable: true },
      getAll: { enumerable: true },
      has: { enumerable: true },
      set: { enumerable: true },
      sort: { enumerable: true },
      toString: { enumerable: true },
      keys: { enumerable: true },
      values: { enumerable: true },
      entries: { enumerable: true },
      forEach: { enumerable: true },
      size: { enumerable: true },
      [Symbol.toStringTag]: { value: "URLSearchParams", configurable: true },
      [Symbol.iterator]: { value: URLSearchParams2.prototype.entries, configurable: true, writable: true }
    });
    ctorRegistry[interfaceName] = URLSearchParams2;
    ctorRegistry["URLSearchParams Iterator"] = Object.create(ctorRegistry["%IteratorPrototype%"], {
      [Symbol.toStringTag]: {
        configurable: true,
        value: "URLSearchParams Iterator"
      }
    });
    utils2.define(ctorRegistry["URLSearchParams Iterator"], {
      next() {
        const internal = this && this[utils2.iterInternalSymbol];
        if (!internal) {
          throw new globalObject.TypeError("next() called on a value that is not a URLSearchParams iterator object");
        }
        const { target: target2, kind, index } = internal;
        const values = Array.from(target2[implSymbol]);
        const len = values.length;
        if (index >= len) {
          return newObjectInRealm(globalObject, { value: void 0, done: true });
        }
        const pair = values[index];
        internal.index = index + 1;
        return newObjectInRealm(globalObject, utils2.iteratorResult(pair.map(utils2.tryWrapperForImpl), kind));
      }
    });
    Object.defineProperty(globalObject, interfaceName, {
      configurable: true,
      writable: true,
      value: URLSearchParams2
    });
  };
  const Impl = requireURLSearchParamsImpl();
})(URLSearchParams$2);
var hasRequiredURLImpl;
function requireURLImpl() {
  if (hasRequiredURLImpl) return URLImpl;
  hasRequiredURLImpl = 1;
  const usm = urlStateMachineExports;
  const urlencoded2 = requireUrlencoded();
  const URLSearchParams2 = URLSearchParams$2;
  URLImpl.implementation = class URLImpl {
    // Unlike the spec, we duplicate some code between the constructor and canParse, because we want to give useful error
    // messages in the constructor that distinguish between the different causes of failure.
    constructor(globalObject, constructorArgs) {
      const url = constructorArgs[0];
      const base2 = constructorArgs[1];
      let parsedBase = null;
      if (base2 !== void 0) {
        parsedBase = usm.basicURLParse(base2);
        if (parsedBase === null) {
          throw new TypeError(`Invalid base URL: ${base2}`);
        }
      }
      const parsedURL = usm.basicURLParse(url, { baseURL: parsedBase });
      if (parsedURL === null) {
        throw new TypeError(`Invalid URL: ${url}`);
      }
      const query2 = parsedURL.query !== null ? parsedURL.query : "";
      this._url = parsedURL;
      this._query = URLSearchParams2.createImpl(globalObject, [query2], { doNotStripQMark: true });
      this._query._url = this;
    }
    static canParse(url, base2) {
      let parsedBase = null;
      if (base2 !== void 0) {
        parsedBase = usm.basicURLParse(base2);
        if (parsedBase === null) {
          return false;
        }
      }
      const parsedURL = usm.basicURLParse(url, { baseURL: parsedBase });
      if (parsedURL === null) {
        return false;
      }
      return true;
    }
    get href() {
      return usm.serializeURL(this._url);
    }
    set href(v) {
      const parsedURL = usm.basicURLParse(v);
      if (parsedURL === null) {
        throw new TypeError(`Invalid URL: ${v}`);
      }
      this._url = parsedURL;
      this._query._list.splice(0);
      const { query: query2 } = parsedURL;
      if (query2 !== null) {
        this._query._list = urlencoded2.parseUrlencodedString(query2);
      }
    }
    get origin() {
      return usm.serializeURLOrigin(this._url);
    }
    get protocol() {
      return `${this._url.scheme}:`;
    }
    set protocol(v) {
      usm.basicURLParse(`${v}:`, { url: this._url, stateOverride: "scheme start" });
    }
    get username() {
      return this._url.username;
    }
    set username(v) {
      if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
        return;
      }
      usm.setTheUsername(this._url, v);
    }
    get password() {
      return this._url.password;
    }
    set password(v) {
      if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
        return;
      }
      usm.setThePassword(this._url, v);
    }
    get host() {
      const url = this._url;
      if (url.host === null) {
        return "";
      }
      if (url.port === null) {
        return usm.serializeHost(url.host);
      }
      return `${usm.serializeHost(url.host)}:${usm.serializeInteger(url.port)}`;
    }
    set host(v) {
      if (usm.hasAnOpaquePath(this._url)) {
        return;
      }
      usm.basicURLParse(v, { url: this._url, stateOverride: "host" });
    }
    get hostname() {
      if (this._url.host === null) {
        return "";
      }
      return usm.serializeHost(this._url.host);
    }
    set hostname(v) {
      if (usm.hasAnOpaquePath(this._url)) {
        return;
      }
      usm.basicURLParse(v, { url: this._url, stateOverride: "hostname" });
    }
    get port() {
      if (this._url.port === null) {
        return "";
      }
      return usm.serializeInteger(this._url.port);
    }
    set port(v) {
      if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
        return;
      }
      if (v === "") {
        this._url.port = null;
      } else {
        usm.basicURLParse(v, { url: this._url, stateOverride: "port" });
      }
    }
    get pathname() {
      return usm.serializePath(this._url);
    }
    set pathname(v) {
      if (usm.hasAnOpaquePath(this._url)) {
        return;
      }
      this._url.path = [];
      usm.basicURLParse(v, { url: this._url, stateOverride: "path start" });
    }
    get search() {
      if (this._url.query === null || this._url.query === "") {
        return "";
      }
      return `?${this._url.query}`;
    }
    set search(v) {
      const url = this._url;
      if (v === "") {
        url.query = null;
        this._query._list = [];
        this._potentiallyStripTrailingSpacesFromAnOpaquePath();
        return;
      }
      const input = v[0] === "?" ? v.substring(1) : v;
      url.query = "";
      usm.basicURLParse(input, { url, stateOverride: "query" });
      this._query._list = urlencoded2.parseUrlencodedString(input);
    }
    get searchParams() {
      return this._query;
    }
    get hash() {
      if (this._url.fragment === null || this._url.fragment === "") {
        return "";
      }
      return `#${this._url.fragment}`;
    }
    set hash(v) {
      if (v === "") {
        this._url.fragment = null;
        this._potentiallyStripTrailingSpacesFromAnOpaquePath();
        return;
      }
      const input = v[0] === "#" ? v.substring(1) : v;
      this._url.fragment = "";
      usm.basicURLParse(input, { url: this._url, stateOverride: "fragment" });
    }
    toJSON() {
      return this.href;
    }
    _potentiallyStripTrailingSpacesFromAnOpaquePath() {
      if (!usm.hasAnOpaquePath(this._url)) {
        return;
      }
      if (this._url.fragment !== null) {
        return;
      }
      if (this._url.query !== null) {
        return;
      }
      this._url.path = this._url.path.replace(/\u0020+$/u, "");
    }
  };
  return URLImpl;
}
(function(exports) {
  const conversions2 = lib;
  const utils2 = utilsExports;
  const implSymbol = utils2.implSymbol;
  const ctorRegistrySymbol = utils2.ctorRegistrySymbol;
  const interfaceName = "URL";
  exports.is = (value2) => {
    return utils2.isObject(value2) && utils2.hasOwn(value2, implSymbol) && value2[implSymbol] instanceof Impl.implementation;
  };
  exports.isImpl = (value2) => {
    return utils2.isObject(value2) && value2 instanceof Impl.implementation;
  };
  exports.convert = (globalObject, value2, { context = "The provided value" } = {}) => {
    if (exports.is(value2)) {
      return utils2.implForWrapper(value2);
    }
    throw new globalObject.TypeError(`${context} is not of type 'URL'.`);
  };
  function makeWrapper(globalObject, newTarget) {
    let proto;
    if (newTarget !== void 0) {
      proto = newTarget.prototype;
    }
    if (!utils2.isObject(proto)) {
      proto = globalObject[ctorRegistrySymbol]["URL"].prototype;
    }
    return Object.create(proto);
  }
  exports.create = (globalObject, constructorArgs, privateData) => {
    const wrapper = makeWrapper(globalObject);
    return exports.setup(wrapper, globalObject, constructorArgs, privateData);
  };
  exports.createImpl = (globalObject, constructorArgs, privateData) => {
    const wrapper = exports.create(globalObject, constructorArgs, privateData);
    return utils2.implForWrapper(wrapper);
  };
  exports._internalSetup = (wrapper, globalObject) => {
  };
  exports.setup = (wrapper, globalObject, constructorArgs = [], privateData = {}) => {
    privateData.wrapper = wrapper;
    exports._internalSetup(wrapper, globalObject);
    Object.defineProperty(wrapper, implSymbol, {
      value: new Impl.implementation(globalObject, constructorArgs, privateData),
      configurable: true
    });
    wrapper[implSymbol][utils2.wrapperSymbol] = wrapper;
    if (Impl.init) {
      Impl.init(wrapper[implSymbol]);
    }
    return wrapper;
  };
  exports.new = (globalObject, newTarget) => {
    const wrapper = makeWrapper(globalObject, newTarget);
    exports._internalSetup(wrapper, globalObject);
    Object.defineProperty(wrapper, implSymbol, {
      value: Object.create(Impl.implementation.prototype),
      configurable: true
    });
    wrapper[implSymbol][utils2.wrapperSymbol] = wrapper;
    if (Impl.init) {
      Impl.init(wrapper[implSymbol]);
    }
    return wrapper[implSymbol];
  };
  const exposed = /* @__PURE__ */ new Set(["Window", "Worker"]);
  exports.install = (globalObject, globalNames) => {
    if (!globalNames.some((globalName) => exposed.has(globalName))) {
      return;
    }
    const ctorRegistry = utils2.initCtorRegistry(globalObject);
    class URL3 {
      constructor(url) {
        if (arguments.length < 1) {
          throw new globalObject.TypeError(
            `Failed to construct 'URL': 1 argument required, but only ${arguments.length} present.`
          );
        }
        const args = [];
        {
          let curArg = arguments[0];
          curArg = conversions2["USVString"](curArg, {
            context: "Failed to construct 'URL': parameter 1",
            globals: globalObject
          });
          args.push(curArg);
        }
        {
          let curArg = arguments[1];
          if (curArg !== void 0) {
            curArg = conversions2["USVString"](curArg, {
              context: "Failed to construct 'URL': parameter 2",
              globals: globalObject
            });
          }
          args.push(curArg);
        }
        return exports.setup(Object.create(new.target.prototype), globalObject, args);
      }
      toJSON() {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'toJSON' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol].toJSON();
      }
      get href() {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get href' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol]["href"];
      }
      set href(V) {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set href' called on an object that is not a valid instance of URL.");
        }
        V = conversions2["USVString"](V, {
          context: "Failed to set the 'href' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol]["href"] = V;
      }
      toString() {
        const esValue = this;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'toString' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol]["href"];
      }
      get origin() {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get origin' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol]["origin"];
      }
      get protocol() {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get protocol' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol]["protocol"];
      }
      set protocol(V) {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set protocol' called on an object that is not a valid instance of URL.");
        }
        V = conversions2["USVString"](V, {
          context: "Failed to set the 'protocol' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol]["protocol"] = V;
      }
      get username() {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get username' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol]["username"];
      }
      set username(V) {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set username' called on an object that is not a valid instance of URL.");
        }
        V = conversions2["USVString"](V, {
          context: "Failed to set the 'username' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol]["username"] = V;
      }
      get password() {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get password' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol]["password"];
      }
      set password(V) {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set password' called on an object that is not a valid instance of URL.");
        }
        V = conversions2["USVString"](V, {
          context: "Failed to set the 'password' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol]["password"] = V;
      }
      get host() {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get host' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol]["host"];
      }
      set host(V) {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set host' called on an object that is not a valid instance of URL.");
        }
        V = conversions2["USVString"](V, {
          context: "Failed to set the 'host' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol]["host"] = V;
      }
      get hostname() {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get hostname' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol]["hostname"];
      }
      set hostname(V) {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set hostname' called on an object that is not a valid instance of URL.");
        }
        V = conversions2["USVString"](V, {
          context: "Failed to set the 'hostname' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol]["hostname"] = V;
      }
      get port() {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get port' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol]["port"];
      }
      set port(V) {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set port' called on an object that is not a valid instance of URL.");
        }
        V = conversions2["USVString"](V, {
          context: "Failed to set the 'port' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol]["port"] = V;
      }
      get pathname() {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get pathname' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol]["pathname"];
      }
      set pathname(V) {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set pathname' called on an object that is not a valid instance of URL.");
        }
        V = conversions2["USVString"](V, {
          context: "Failed to set the 'pathname' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol]["pathname"] = V;
      }
      get search() {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get search' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol]["search"];
      }
      set search(V) {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set search' called on an object that is not a valid instance of URL.");
        }
        V = conversions2["USVString"](V, {
          context: "Failed to set the 'search' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol]["search"] = V;
      }
      get searchParams() {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get searchParams' called on an object that is not a valid instance of URL.");
        }
        return utils2.getSameObject(this, "searchParams", () => {
          return utils2.tryWrapperForImpl(esValue[implSymbol]["searchParams"]);
        });
      }
      get hash() {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'get hash' called on an object that is not a valid instance of URL.");
        }
        return esValue[implSymbol]["hash"];
      }
      set hash(V) {
        const esValue = this !== null && this !== void 0 ? this : globalObject;
        if (!exports.is(esValue)) {
          throw new globalObject.TypeError("'set hash' called on an object that is not a valid instance of URL.");
        }
        V = conversions2["USVString"](V, {
          context: "Failed to set the 'hash' property on 'URL': The provided value",
          globals: globalObject
        });
        esValue[implSymbol]["hash"] = V;
      }
      static canParse(url) {
        if (arguments.length < 1) {
          throw new globalObject.TypeError(
            `Failed to execute 'canParse' on 'URL': 1 argument required, but only ${arguments.length} present.`
          );
        }
        const args = [];
        {
          let curArg = arguments[0];
          curArg = conversions2["USVString"](curArg, {
            context: "Failed to execute 'canParse' on 'URL': parameter 1",
            globals: globalObject
          });
          args.push(curArg);
        }
        {
          let curArg = arguments[1];
          if (curArg !== void 0) {
            curArg = conversions2["USVString"](curArg, {
              context: "Failed to execute 'canParse' on 'URL': parameter 2",
              globals: globalObject
            });
          }
          args.push(curArg);
        }
        return Impl.implementation.canParse(...args);
      }
    }
    Object.defineProperties(URL3.prototype, {
      toJSON: { enumerable: true },
      href: { enumerable: true },
      toString: { enumerable: true },
      origin: { enumerable: true },
      protocol: { enumerable: true },
      username: { enumerable: true },
      password: { enumerable: true },
      host: { enumerable: true },
      hostname: { enumerable: true },
      port: { enumerable: true },
      pathname: { enumerable: true },
      search: { enumerable: true },
      searchParams: { enumerable: true },
      hash: { enumerable: true },
      [Symbol.toStringTag]: { value: "URL", configurable: true }
    });
    Object.defineProperties(URL3, { canParse: { enumerable: true } });
    ctorRegistry[interfaceName] = URL3;
    Object.defineProperty(globalObject, interfaceName, {
      configurable: true,
      writable: true,
      value: URL3
    });
    if (globalNames.includes("Window")) {
      Object.defineProperty(globalObject, "webkitURL", {
        configurable: true,
        writable: true,
        value: URL3
      });
    }
  };
  const Impl = requireURLImpl();
})(URL$4);
const URL$3 = URL$4;
const URLSearchParams$1 = URLSearchParams$2;
webidl2jsWrapper.URL = URL$3;
webidl2jsWrapper.URLSearchParams = URLSearchParams$1;
const { URL: URL$2, URLSearchParams } = webidl2jsWrapper;
const urlStateMachine = urlStateMachineExports;
const percentEncoding = percentEncoding$1;
const sharedGlobalObject = { Array, Object, Promise, String, TypeError };
URL$2.install(sharedGlobalObject, ["Window"]);
URLSearchParams.install(sharedGlobalObject, ["Window"]);
var URL_1 = sharedGlobalObject.URL;
var URLSearchParams_1 = sharedGlobalObject.URLSearchParams;
urlStateMachine.parseURL;
urlStateMachine.basicURLParse;
urlStateMachine.serializeURL;
urlStateMachine.serializePath;
urlStateMachine.serializeHost;
urlStateMachine.serializeInteger;
urlStateMachine.serializeURLOrigin;
urlStateMachine.setTheUsername;
urlStateMachine.setThePassword;
urlStateMachine.cannotHaveAUsernamePasswordPort;
urlStateMachine.hasAnOpaquePath;
percentEncoding.percentDecodeString;
percentEncoding.percentDecodeBytes;
const activeElement = Symbol("activeElement");
const appendFormControlItem = Symbol("appendFormControlItem");
const appendNamedItem = Symbol("appendNamedItem");
const asyncTaskManager = Symbol("asyncTaskManager");
const buffer = Symbol("buffer");
const cacheID = Symbol("cacheID");
const callbacks = Symbol("callbacks");
const captureEventListenerCount = Symbol("captureEventListenerCount");
const checked = Symbol("checked");
const childNodes = Symbol("childNodes");
const children = Symbol("children");
const classList = Symbol("classList");
const computedStyle = Symbol("computedStyle");
const connectToNode = Symbol("connectToNode");
const cssText = Symbol("cssText");
const currentScript = Symbol("currentScript");
const currentTarget = Symbol("currentTarget");
const data = Symbol("data");
const defaultView = Symbol("defaultView");
const destroy = Symbol("destroy");
const dirtyness = Symbol("dirtyness");
const end = Symbol("end");
const evaluateCSS = Symbol("evaluateCSS");
const evaluateScript = Symbol("evaluateScript");
const exceptionObserver = Symbol("exceptionObserver");
const formNode = Symbol("formNode");
const getAttributeName = Symbol("getAttributeName");
const happyDOMSettingsID = Symbol("happyDOMSettingsID");
const height = Symbol("height");
const immediatePropagationStopped = Symbol("immediatePropagationStopped");
const isFirstWrite = Symbol("isFirstWrite");
const isFirstWriteAfterOpen = Symbol("isFirstWriteAfterOpen");
const isInPassiveEventListener = Symbol("isInPassiveEventListener");
const isValidPropertyName = Symbol("isValidPropertyName");
const isValue = Symbol("isValue");
const listenerOptions = Symbol("listenerOptions");
const listeners = Symbol("listeners");
const namedItems = Symbol("namedItems");
const nextActiveElement = Symbol("nextActiveElement");
const observe = Symbol("observe");
const observedAttributes = Symbol("observedAttributes");
const observers = Symbol("observers");
const ownerDocument = Symbol("ownerDocument");
const ownerElement = Symbol("ownerElement");
const propagationStopped = Symbol("propagationStopped");
const readyStateManager = Symbol("readyStateManager");
const referrer = Symbol("referrer");
const registry = Symbol("registry");
const relList = Symbol("relList");
const removeFormControlItem = Symbol("removeFormControlItem");
const removeNamedItem = Symbol("removeNamedItem");
const removeNamedItemIndex = Symbol("removeNamedItemIndex");
const removeNamedItemWithoutConsequences = Symbol("removeNamedItemWithoutConsequences");
const resetSelection = Symbol("resetSelection");
const rootNode = Symbol("rootNode");
const selectNode = Symbol("selectNode");
const selectedness = Symbol("selectedness");
const selection = Symbol("selection");
const setNamedItemWithoutConsequences = Symbol("setNamedItemWithoutConsequences");
const setupVMContext = Symbol("setupVMContext");
const shadowRoot = Symbol("shadowRoot");
const start = Symbol("start");
const style = Symbol("style");
const target = Symbol("target");
const textAreaNode = Symbol("textAreaNode");
const unobserve = Symbol("unobserve");
const updateIndices = Symbol("updateIndices");
const updateOptionItems = Symbol("updateOptionItems");
const value = Symbol("value");
const width = Symbol("width");
const window$1 = Symbol("window");
const windowResizeListener = Symbol("windowResizeListener");
const mutationObservers = Symbol("mutationObservers");
const openerFrame = Symbol("openerFrame");
const openerWindow = Symbol("openerFrame");
const popup = Symbol("popup");
const isConnected = Symbol("isConnected");
const parentNode = Symbol("parentNode");
const nodeType = Symbol("nodeType");
const tagName$1 = Symbol("tagName");
const prefix = Symbol("prefix");
const scrollHeight = Symbol("scrollHeight");
const scrollWidth = Symbol("scrollWidth");
const scrollTop = Symbol("scrollTop");
const scrollLeft = Symbol("scrollLeft");
const attributes = Symbol("attributes");
const namespaceURI = Symbol("namespaceURI");
const accessKey = Symbol("accessKey");
const contentEditable = Symbol("contentEditable");
const isContentEditable = Symbol("isContentEditable");
const offsetHeight = Symbol("offsetHeight");
const offsetWidth = Symbol("offsetWidth");
const offsetLeft = Symbol("offsetLeft");
const offsetTop = Symbol("offsetTop");
const clientHeight = Symbol("clientHeight");
const clientWidth = Symbol("clientWidth");
const clientLeft = Symbol("clientLeft");
const clientTop = Symbol("clientTop");
const name = Symbol("name");
const specified = Symbol("specified");
const adoptedStyleSheets = Symbol("adoptedStyleSheets");
const implementation = Symbol("implementation");
const readyState = Symbol("readyState");
const ownerWindow = Symbol("ownerWindow");
const publicId = Symbol("publicId");
const systemId = Symbol("systemId");
const validationMessage = Symbol("validationMessage");
const validity = Symbol("validity");
const returnValue = Symbol("returnValue");
const elements = Symbol("elements");
const length = Symbol("length");
const complete = Symbol("complete");
const naturalHeight = Symbol("naturalHeight");
const naturalWidth = Symbol("naturalWidth");
const loading = Symbol("loading");
const x = Symbol("x");
const y = Symbol("y");
const defaultChecked = Symbol("defaultChecked");
const files = Symbol("files");
const sheet = Symbol("sheet");
const volume = Symbol("volume");
const paused = Symbol("paused");
const currentTime = Symbol("currentTime");
const playbackRate = Symbol("playbackRate");
const defaultPlaybackRate = Symbol("defaultPlaybackRate");
const muted = Symbol("muted");
const defaultMuted = Symbol("defaultMuted");
const preservesPitch = Symbol("preservesPitch");
const buffered = Symbol("buffered");
const duration = Symbol("duration");
const error$1 = Symbol("error");
const ended = Symbol("ended");
const networkState = Symbol("networkState");
const textTracks = Symbol("textTracks");
const videoTracks = Symbol("videoTracks");
const seeking = Symbol("seeking");
const seekable = Symbol("seekable");
const played = Symbol("played");
const options = Symbol("options");
const content = Symbol("content");
const mode = Symbol("mode");
const host = Symbol("host");
const setURL = Symbol("setURL");
const localName = Symbol("localName");
const registedClass = Symbol("registedClass");
const location = Symbol("location");
const history = Symbol("history");
const navigator$1 = Symbol("navigator");
const screen = Symbol("screen");
const sessionStorage = Symbol("sessionStorage");
const localStorage = Symbol("localStorage");
const sandbox = Symbol("sandbox");
const cloneNode = Symbol("cloneNode");
const appendChild = Symbol("appendChild");
const removeChild = Symbol("removeChild");
const insertBefore = Symbol("insertBefore");
const replaceChild = Symbol("replaceChild");
const styleNode = Symbol("styleNode");
const updateSheet = Symbol("updateSheet");
class CookieExpireUtility {
  /**
   * Returns "true" if cookie has expired.
   *
   * @param cookie Cookie.
   * @returns "true" if cookie has expired.
   */
  static hasExpired(cookie) {
    return cookie.expires && cookie.expires.getTime() < Date.now();
  }
}
var CookieSameSiteEnum;
(function(CookieSameSiteEnum2) {
  CookieSameSiteEnum2["strict"] = "Strict";
  CookieSameSiteEnum2["lax"] = "Lax";
  CookieSameSiteEnum2["none"] = "None";
})(CookieSameSiteEnum || (CookieSameSiteEnum = {}));
const CookieSameSiteEnum$1 = CookieSameSiteEnum;
class CookieURLUtility {
  /**
   * Returns "true" if cookie matches URL.
   *
   * @param cookie Cookie.
   * @param url URL.
   * @returns "true" if cookie matches URL.
   */
  static cookieMatchesURL(cookie, url) {
    return (!cookie.secure || url.protocol === "https:") && (!cookie.domain || url.hostname.endsWith(cookie.domain)) && (!cookie.path || url.pathname.startsWith(cookie.path)) && // @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value
    (cookie.sameSite === CookieSameSiteEnum$1.none && cookie.secure || cookie.originURL.hostname === url.hostname);
  }
}
var __classPrivateFieldGet$N = function(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CookieContainer_cookies;
class CookieContainer {
  constructor() {
    _CookieContainer_cookies.set(this, []);
  }
  /**
   * Adds cookies.
   *
   * @param cookies Cookies.
   */
  addCookies(cookies) {
    const indexMap = {};
    const getKey = (cookie) => `${cookie.key}-${cookie.originURL.hostname}-${cookie.path}-${typeof cookie.value}`;
    for (let i = 0, max2 = __classPrivateFieldGet$N(this, _CookieContainer_cookies, "f").length; i < max2; i++) {
      indexMap[getKey(__classPrivateFieldGet$N(this, _CookieContainer_cookies, "f")[i])] = i;
    }
    for (const cookie of cookies) {
      if (cookie == null ? void 0 : cookie.key) {
        const index = indexMap[getKey(cookie)];
        if (index !== void 0) {
          __classPrivateFieldGet$N(this, _CookieContainer_cookies, "f").splice(index, 1);
        }
        if (!CookieExpireUtility.hasExpired(cookie)) {
          indexMap[getKey(cookie)] = __classPrivateFieldGet$N(this, _CookieContainer_cookies, "f").length;
          __classPrivateFieldGet$N(this, _CookieContainer_cookies, "f").push(cookie);
        }
      }
    }
  }
  /**
   * Returns cookies.
   *
   * @param [url] URL.
   * @param [httpOnly] "true" if only http cookies should be returned.
   * @returns Cookies.
   */
  getCookies(url = null, httpOnly = false) {
    const cookies = [];
    for (const cookie of __classPrivateFieldGet$N(this, _CookieContainer_cookies, "f")) {
      if (!CookieExpireUtility.hasExpired(cookie) && (!httpOnly || !cookie.httpOnly) && (!url || CookieURLUtility.cookieMatchesURL(cookie, url || cookie.originURL))) {
        cookies.push(cookie);
      }
    }
    return cookies;
  }
}
_CookieContainer_cookies = /* @__PURE__ */ new WeakMap();
};
var NodeTypeEnum;
   *