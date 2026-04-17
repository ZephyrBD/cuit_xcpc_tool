'use strict';

const _ = require('lodash');
const chroma = require('chroma-js');
const colorDiff = require('color-diff');
const types = require('@xcpcio/types');
const jsBase64 = require('js-base64');
const dayjs = require('dayjs');
const advancedFormat = require('dayjs/plugin/advancedFormat');
const duration = require('dayjs/plugin/duration');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const minMax = require('dayjs/plugin/minMax');
const relativeTime = require('dayjs/plugin/relativeTime');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
const stringWidth = require('string-width');
const XLSX = require('xlsx-js-style');
const ordinal = require('ordinal');
const Papa = require('papaparse');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

function _interopNamespaceCompat(e) {
  if (e && typeof e === 'object' && 'default' in e) return e;
  const n = Object.create(null);
  if (e) {
    for (const k in e) {
      n[k] = e[k];
    }
  }
  n.default = e;
  return n;
}

const ___default = /*#__PURE__*/_interopDefaultCompat(_);
const chroma__default = /*#__PURE__*/_interopDefaultCompat(chroma);
const dayjs__default = /*#__PURE__*/_interopDefaultCompat(dayjs);
const advancedFormat__default = /*#__PURE__*/_interopDefaultCompat(advancedFormat);
const duration__default = /*#__PURE__*/_interopDefaultCompat(duration);
const isSameOrAfter__default = /*#__PURE__*/_interopDefaultCompat(isSameOrAfter);
const isSameOrBefore__default = /*#__PURE__*/_interopDefaultCompat(isSameOrBefore);
const minMax__default = /*#__PURE__*/_interopDefaultCompat(minMax);
const relativeTime__default = /*#__PURE__*/_interopDefaultCompat(relativeTime);
const timezone__default = /*#__PURE__*/_interopDefaultCompat(timezone);
const utc__default = /*#__PURE__*/_interopDefaultCompat(utc);
const stringWidth__default = /*#__PURE__*/_interopDefaultCompat(stringWidth);
const XLSX__namespace = /*#__PURE__*/_interopNamespaceCompat(XLSX);
const ordinal__default = /*#__PURE__*/_interopDefaultCompat(ordinal);
const Papa__default = /*#__PURE__*/_interopDefaultCompat(Papa);

var MedalType = /* @__PURE__ */ ((MedalType2) => {
  MedalType2["UNKNOWN"] = "Unknown";
  MedalType2["GOLD"] = "Gold";
  MedalType2["SILVER"] = "Silver";
  MedalType2["BRONZE"] = "Bronze";
  MedalType2["HONORABLE"] = "Honorable";
  return MedalType2;
})(MedalType || {});
class Award {
  medalType;
  minRank;
  maxRank;
  constructor() {
    this.medalType = "Unknown" /* UNKNOWN */;
    this.minRank = 0;
    this.maxRank = 0;
  }
}
function isValidMedalType(medal) {
  const validMedalType = [
    "Gold" /* GOLD */,
    "Silver" /* SILVER */,
    "Bronze" /* BRONZE */,
    "Honorable" /* HONORABLE */
  ];
  return validMedalType.includes(medal);
}

class I18nText {
  texts;
  fallback;
  fallbackLang;
  constructor() {
    this.texts = /* @__PURE__ */ new Map();
  }
  get(lang) {
    return this.texts.get(lang);
  }
  getOrDefault(lang) {
    return (lang ? this.texts.get(lang) : void 0) || (this.fallbackLang ? this.texts.get(this.fallbackLang) : void 0) || this.fallback || "";
  }
  set(lang, text) {
    this.texts.set(lang, text);
  }
  has(lang) {
    return this.texts.has(lang);
  }
  static fromI18NStringSet(stringSet) {
    const i18nText = new I18nText();
    i18nText.fallback = stringSet.fallback;
    i18nText.fallbackLang = stringSet.fallback_lang;
    if (stringSet.texts) {
      for (const [lang, text] of Object.entries(stringSet.texts)) {
        i18nText.set(lang, text);
      }
    }
    return i18nText;
  }
  static fromIText(text) {
    if (typeof text === "string") {
      const i18nText = new I18nText();
      i18nText.fallback = text;
      return i18nText;
    }
    return I18nText.fromI18NStringSet(text);
  }
  toI18NStringSet() {
    const result = {};
    if (this.fallback !== void 0) {
      result.fallback = this.fallback;
    }
    if (this.fallbackLang !== void 0) {
      result.fallback_lang = this.fallbackLang;
    }
    if (this.texts.size > 0) {
      result.texts = {};
      for (const [lang, text] of this.texts.entries()) {
        result.texts[lang] = text;
      }
    }
    return result;
  }
  valueOf() {
    return this.getOrDefault();
  }
}

function calcDirt(attemptedNum, solvedNum) {
  if (solvedNum === 0) {
    return 0;
  }
  return Math.floor((attemptedNum - solvedNum) * 100 / attemptedNum);
}

function getWhiteOrBlackColorV1(background) {
  const [R, G, B] = chroma__default(background).rgb();
  const color = { R, G, B };
  const palette = [
    { R: 0, G: 0, B: 0 },
    { R: 255, G: 255, B: 255 }
  ];
  const f = colorDiff.furthest(color, palette);
  if (f.R === 0 && f.G === 0 && f.B === 0) {
    return "#000";
  } else {
    return "#fff";
  }
}
function getWhiteOrBlackColor(background) {
  const [R, G, B] = chroma__default(background).rgb();
  const brightness = (R * 299 + G * 587 + B * 114) / 1e3;
  const threshold = 148;
  return brightness <= threshold ? "#fff" : "#000";
}

dayjs__default.extend(duration__default);
dayjs__default.extend(utc__default);
dayjs__default.extend(timezone__default);
dayjs__default.extend(advancedFormat__default);
dayjs__default.extend(isSameOrBefore__default);
dayjs__default.extend(isSameOrAfter__default);
dayjs__default.extend(minMax__default);
dayjs__default.extend(relativeTime__default);
function createDayJS(time = void 0) {
  if (time === void 0) {
    return dayjs__default();
  }
  if (typeof time == "number" && String(time).length === 10) {
    return dayjs__default.unix(time);
  }
  return dayjs__default(time);
}
function getTimestamp(time) {
  if (typeof time === "number") {
    return time;
  }
  return time.unix();
}
function getTimeDiff(seconds) {
  const two = (a) => {
    if (a < 10) {
      return `0${a}`;
    }
    return String(a);
  };
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = seconds % 60;
  return [two(h), two(m), two(s)].join(":");
}

function normalizePath(path) {
  while (path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return `${path}/`;
}

class ProblemStatistics {
  acceptedNum;
  rejectedNum;
  pendingNum;
  submittedNum;
  attemptedNum;
  ignoreNum;
  firstSolveSubmissions;
  lastSolveSubmissions;
  se;
  constructor() {
    this.acceptedNum = 0;
    this.rejectedNum = 0;
    this.pendingNum = 0;
    this.submittedNum = 0;
    this.attemptedNum = 0;
    this.ignoreNum = 0;
    this.se = 0;
    this.firstSolveSubmissions = [];
    this.lastSolveSubmissions = [];
  }
  reset() {
    this.acceptedNum = 0;
    this.rejectedNum = 0;
    this.pendingNum = 0;
    this.submittedNum = 0;
    this.attemptedNum = 0;
    this.ignoreNum = 0;
    this.se = 0;
    this.firstSolveSubmissions = [];
    this.lastSolveSubmissions = [];
  }
  get dirt() {
    if (this.acceptedNum === 0) {
      return 0;
    }
    return calcDirt(this.attemptedNum, this.acceptedNum);
  }
  calcSE(totalTeams) {
    const res = (totalTeams - this.acceptedNum) / totalTeams;
    this.se = Math.round(res * 100) / 100;
    return this.se;
  }
}
class Problem {
  id;
  label;
  name;
  timeLimit;
  memoryLimit;
  balloonColor;
  statistics;
  constructor() {
    this.id = "";
    this.label = "";
    this.statistics = new ProblemStatistics();
    this.balloonColor = {
      background_color: "#a0f0a0",
      color: "#000"
    };
  }
}
function createProblem(problemJSON) {
  const p = new Problem();
  p.id = String(problemJSON.id);
  p.label = problemJSON.label;
  if (problemJSON.name) {
    p.name = I18nText.fromIText(problemJSON.name);
  }
  p.timeLimit = problemJSON.time_limit;
  p.memoryLimit = problemJSON.memory_limit;
  if (problemJSON.balloon_color) {
    p.balloonColor = ___default.cloneDeep(problemJSON.balloon_color);
  }
  p.balloonColor.color = getWhiteOrBlackColor(p.balloonColor.background_color);
  return p;
}
function createProblems(problemsJSON) {
  return problemsJSON.map((pJSON) => createProblem(pJSON));
}
function createProblemsByProblemIds(problemIds, balloonColors) {
  const problems = problemIds.map((label, index) => {
    const p = new Problem();
    p.id = index.toString();
    p.label = label;
    return p;
  });
  if (balloonColors !== void 0 && balloonColors !== null) {
    for (const index in balloonColors) {
      problems[index].balloonColor = ___default.cloneDeep(balloonColors[index]);
    }
  }
  problems.forEach((p) => {
    p.balloonColor.color = getWhiteOrBlackColor(p.balloonColor.background_color);
  });
  return problems;
}
class TeamProblemStatistics {
  isFirstSolved;
  isSolved;
  solvedTimestamp;
  isSubmitted;
  lastSubmitTimestamp;
  failedCount;
  pendingCount;
  ignoreCount;
  totalCount;
  submissions;
  problem;
  contestPenalty;
  constructor(options) {
    this.isFirstSolved = options?.teamProblemStatistics?.isFirstSolved ?? false;
    this.isSolved = options?.teamProblemStatistics?.isSolved ?? false;
    this.solvedTimestamp = options?.teamProblemStatistics?.solvedTimestamp ?? 0;
    this.isSubmitted = options?.teamProblemStatistics?.isSubmitted ?? false;
    this.lastSubmitTimestamp = options?.teamProblemStatistics?.lastSubmitTimestamp ?? 0;
    this.failedCount = options?.teamProblemStatistics?.failedCount ?? 0;
    this.pendingCount = options?.teamProblemStatistics?.pendingCount ?? 0;
    this.ignoreCount = options?.teamProblemStatistics?.ignoreCount ?? 0;
    this.totalCount = options?.teamProblemStatistics?.totalCount ?? 0;
    this.submissions = options?.teamProblemStatistics?.submissions ?? [];
    this.problem = options?.teamProblemStatistics?.problem ?? new Problem();
    this.contestPenalty = options?.teamProblemStatistics?.contestPenalty ?? 20 * 60;
  }
  get isAccepted() {
    return this.isSolved;
  }
  get isWrongAnswer() {
    return !this.isSolved && this.pendingCount === 0 && this.failedCount > 0;
  }
  get isPending() {
    return !this.isSolved && this.pendingCount > 0;
  }
  get isUnSubmitted() {
    return this.totalCount === 0;
  }
  get solvedTimestampToMinute() {
    return Math.floor(this.solvedTimestamp / 60);
  }
  get penalty() {
    if (this.isSolved === false) {
      return 0;
    }
    return this.solvedTimestampToMinute * 60 + this.failedCount * this.contestPenalty;
  }
  get penaltyToMinute() {
    return Math.floor(this.penalty / 60);
  }
  get penaltyInSecond() {
    if (this.isSolved === false) {
      return 0;
    }
    return this.solvedTimestamp + this.failedCount * this.contestPenalty;
  }
}

function stringToSubmissionStatus(status) {
  status = status.toUpperCase().replace(" ", "_");
  if (["OK", "AC", types.SubmissionStatus.ACCEPTED.toString()].includes(status)) {
    return types.SubmissionStatus.ACCEPTED;
  }
  if ([types.SubmissionStatus.CORRECT.toString()].includes(status)) {
    return types.SubmissionStatus.ACCEPTED;
  }
  if ([types.SubmissionStatus.PARTIALLY_CORRECT.toString()].includes(status)) {
    return types.SubmissionStatus.PARTIALLY_CORRECT;
  }
  if (["WA", types.SubmissionStatus.WRONG_ANSWER.toString()].includes(status)) {
    return types.SubmissionStatus.WRONG_ANSWER;
  }
  if (["RJ", "INCORRECT", types.SubmissionStatus.REJECTED.toString()].includes(status)) {
    return types.SubmissionStatus.REJECTED;
  }
  if (["NO", types.SubmissionStatus.NO_OUTPUT.toString()].includes(status)) {
    return types.SubmissionStatus.NO_OUTPUT;
  }
  if (["PD", types.SubmissionStatus.PENDING.toString()].includes(status)) {
    return types.SubmissionStatus.PENDING;
  }
  if ([types.SubmissionStatus.WAITING.toString()].includes(status)) {
    return types.SubmissionStatus.WAITING;
  }
  if ([types.SubmissionStatus.JUDGING.toString()].includes(status)) {
    return types.SubmissionStatus.JUDGING;
  }
  if ([types.SubmissionStatus.FROZEN.toString()].includes(status)) {
    return types.SubmissionStatus.FROZEN;
  }
  if (["CE", types.SubmissionStatus.COMPILATION_ERROR.toString()].includes(status)) {
    return types.SubmissionStatus.COMPILATION_ERROR;
  }
  if (["PE", types.SubmissionStatus.PRESENTATION_ERROR.toString()].includes(status)) {
    return types.SubmissionStatus.PRESENTATION_ERROR;
  }
  if (["TL", "TLE", types.SubmissionStatus.TIME_LIMIT_EXCEEDED.toString()].includes(status)) {
    return types.SubmissionStatus.TIME_LIMIT_EXCEEDED;
  }
  if (["ML", "MLE", types.SubmissionStatus.MEMORY_LIMIT_EXCEEDED.toString()].includes(status)) {
    return types.SubmissionStatus.MEMORY_LIMIT_EXCEEDED;
  }
  if (["OL", "OLE", types.SubmissionStatus.OUTPUT_LIMIT_EXCEEDED.toString()].includes(status)) {
    return types.SubmissionStatus.OUTPUT_LIMIT_EXCEEDED;
  }
  if (["IL", "ILE", types.SubmissionStatus.IDLENESS_LIMIT_EXCEEDED.toString()].includes(status)) {
    return types.SubmissionStatus.IDLENESS_LIMIT_EXCEEDED;
  }
  if (["RT", "RE", "RTE", types.SubmissionStatus.RUNTIME_ERROR.toString()].includes(status)) {
    return types.SubmissionStatus.RUNTIME_ERROR;
  }
  if (["JE", types.SubmissionStatus.JUDGEMENT_FAILED.toString()].includes(status)) {
    return types.SubmissionStatus.JUDGEMENT_FAILED;
  }
  if (["SE", types.SubmissionStatus.SYSTEM_ERROR.toString()].includes(status)) {
    return types.SubmissionStatus.SYSTEM_ERROR;
  }
  if ([types.SubmissionStatus.HACKED.toString()].includes(status)) {
    return types.SubmissionStatus.HACKED;
  }
  if ([types.SubmissionStatus.CONFIGURATION_ERROR.toString()].includes(status)) {
    return types.SubmissionStatus.CONFIGURATION_ERROR;
  }
  if ([types.SubmissionStatus.CANCELED.toString()].includes(status)) {
    return types.SubmissionStatus.CANCELED;
  }
  if ([types.SubmissionStatus.SKIPPED.toString()].includes(status)) {
    return types.SubmissionStatus.SKIPPED;
  }
  if ([types.SubmissionStatus.SECURITY_VIOLATED.toString()].includes(status)) {
    return types.SubmissionStatus.SECURITY_VIOLATED;
  }
  if ([types.SubmissionStatus.DENIAL_OF_JUDGEMENT.toString()].includes(status)) {
    return types.SubmissionStatus.DENIAL_OF_JUDGEMENT;
  }
  return types.SubmissionStatus.UNKNOWN;
}
function isAccepted(status) {
  const acceptedArray = [types.SubmissionStatus.ACCEPTED, types.SubmissionStatus.CORRECT];
  return acceptedArray.includes(status);
}
function isRejected(status) {
  const rejectArray = [
    types.SubmissionStatus.RUNTIME_ERROR,
    types.SubmissionStatus.TIME_LIMIT_EXCEEDED,
    types.SubmissionStatus.MEMORY_LIMIT_EXCEEDED,
    types.SubmissionStatus.OUTPUT_LIMIT_EXCEEDED,
    types.SubmissionStatus.IDLENESS_LIMIT_EXCEEDED,
    types.SubmissionStatus.WRONG_ANSWER,
    types.SubmissionStatus.REJECTED,
    types.SubmissionStatus.NO_OUTPUT,
    types.SubmissionStatus.JUDGEMENT_FAILED,
    types.SubmissionStatus.HACKED
  ];
  return rejectArray.includes(status);
}
function isPending(status) {
  const pendingArray = [
    types.SubmissionStatus.PENDING,
    types.SubmissionStatus.WAITING,
    types.SubmissionStatus.COMPILING,
    types.SubmissionStatus.JUDGING,
    types.SubmissionStatus.FROZEN
  ];
  return pendingArray.includes(status);
}
function isNotCalculatedPenaltyStatus(status) {
  const isNotCalculatedPenaltyArray = [
    types.SubmissionStatus.COMPILATION_ERROR,
    types.SubmissionStatus.PRESENTATION_ERROR,
    types.SubmissionStatus.CONFIGURATION_ERROR,
    types.SubmissionStatus.SYSTEM_ERROR,
    types.SubmissionStatus.CANCELED,
    types.SubmissionStatus.SKIPPED,
    types.SubmissionStatus.UNKNOWN,
    types.SubmissionStatus.UNDEFINED
  ];
  return isNotCalculatedPenaltyArray.includes(status);
}

class Submission {
  id;
  teamId;
  problemId;
  timestamp;
  timestampUnit;
  time;
  language;
  reaction;
  externalUrl;
  status = types.SubmissionStatus.UNKNOWN;
  isIgnore = false;
  isSolved = false;
  isFirstSolved = false;
  constructor() {
    this.id = "";
    this.teamId = "";
    this.problemId = "";
    this.timestamp = 0;
    this.timestampUnit = "second";
  }
  isAccepted() {
    return isAccepted(this.status);
  }
  isRejected() {
    return isRejected(this.status);
  }
  isPending() {
    return isPending(this.status);
  }
  isNotCalculatedPenaltyStatus() {
    return isNotCalculatedPenaltyStatus(this.status);
  }
  get timestampToMinute() {
    if (this.timestampUnit === "nanosecond") {
      return Math.floor(this.timestamp / 60 / 1e3 / 1e3 / 1e3);
    }
    if (this.timestampUnit === "microsecond") {
      return Math.floor(this.timestamp / 60 / 1e3 / 1e3);
    }
    if (this.timestampUnit === "millisecond") {
      return Math.floor(this.timestamp / 60 / 1e3);
    }
    return Math.floor(this.timestamp / 60);
  }
  get timestampToSecond() {
    if (this.timestampUnit === "nanosecond") {
      return Math.floor(this.timestamp / 1e3 / 1e3 / 1e3);
    }
    if (this.timestampUnit === "microsecond") {
      return Math.floor(this.timestamp / 1e3 / 1e3);
    }
    if (this.timestampUnit === "millisecond") {
      return Math.floor(this.timestamp / 1e3);
    }
    return this.timestamp;
  }
  get timestampDisplayFormatWithSecond() {
    const second = this.timestampToSecond;
    const h = Math.floor(second / 3600);
    const m = Math.floor(second % 3600 / 60);
    const s = second % 60;
    const f = (x) => x.toString().padStart(2, "0");
    const res = `${f(h)}:${f(m)}:${f(s)}`;
    return res;
  }
  get timestampDisplayFormatWithMilliSecond() {
    let res = this.timestampDisplayFormatWithSecond;
    if (this.timestampUnit === "millisecond") {
      const fl = (this.timestamp % 1e3).toString().padStart(3, "0");
      res += `.${fl}`;
    }
    return res;
  }
  static compare(lhs, rhs) {
    if (lhs.timestamp !== rhs.timestamp) {
      return lhs.timestamp - rhs.timestamp;
    }
    if (lhs.teamId === rhs.teamId) {
      if (lhs.isAccepted() && !rhs.isAccepted()) {
        return -1;
      }
      if (!lhs.isAccepted() && rhs.isAccepted()) {
        return 1;
      }
    }
    if (lhs.id < rhs.id) {
      return -1;
    } else if (lhs.id === rhs.id) {
      return 0;
    } else {
      return 1;
    }
  }
}
function createSubmission(submissionJSON, contest) {
  const s = new Submission();
  s.id = String(submissionJSON.id ?? submissionJSON.submission_id ?? "");
  s.teamId = String(submissionJSON.team_id);
  s.problemId = String(submissionJSON.problem_id);
  s.timestamp = submissionJSON.timestamp;
  s.status = stringToSubmissionStatus(submissionJSON.status);
  s.isIgnore = submissionJSON.is_ignore ?? false;
  if (submissionJSON.time) {
    s.time = submissionJSON.time;
  }
  if (submissionJSON.language) {
    s.language = submissionJSON.language;
  }
  if (submissionJSON.reaction) {
    s.reaction = submissionJSON.reaction;
  } else if (contest?.options.reactionVideoUrlTemplate && !submissionJSON.missing_reaction) {
    s.reaction = {
      url: contest.options.reactionVideoUrlTemplate.replace(/\$\{submission_id\}/, s.id)
    };
  }
  if (contest?.options.submissionExternalUrlTemplate) {
    s.externalUrl = contest.options.submissionExternalUrlTemplate.replace(/\$\{submission_id\}/, s.id);
  }
  return s;
}
function createSubmissions(submissionsJSON, contest) {
  if (Array.isArray(submissionsJSON)) {
    return submissionsJSON.map((s, index) => createSubmission({ ...s, id: s.id ?? s.submission_id ?? String(index) }, contest));
  } else {
    const submissions = Object.entries(submissionsJSON).map(
      ([submissionId, s]) => createSubmission({ ...s, id: s.id ?? s.submission_id ?? String(submissionId) }, contest)
    );
    return submissions;
  }
}

class Person {
  name;
  cfID;
  icpcID;
  constructor(name) {
    this.name = name ?? new I18nText();
  }
  toIPerson() {
    return {
      name: this.name.toI18NStringSet(),
      cf_id: this.cfID,
      icpc_id: this.icpcID
    };
  }
  static fromIPerson(iPerson) {
    const person = new Person();
    person.name = I18nText.fromIText(iPerson.name);
    person.cfID = iPerson.cf_id;
    person.icpcID = iPerson.icpc_id;
    return person;
  }
}
function createPersons(iPersons) {
  if (!iPersons) {
    return [];
  }
  if (typeof iPersons === "string") {
    for (const c of " ,\u3001|") {
      if (iPersons.includes(c)) {
        return iPersons.split(c).map((name) => new Person(I18nText.fromIText(name)));
      }
    }
    return [new Person(I18nText.fromIText(iPersons))];
  }
  if (Array.isArray(iPersons)) {
    if (iPersons.length > 0 && typeof iPersons[0] === "object" && "name" in iPersons[0]) {
      return iPersons.map((iPerson) => Person.fromIPerson(iPerson));
    }
    return iPersons.map((name) => new Person(I18nText.fromIText(name)));
  }
  return [new Person(I18nText.fromIText(iPersons))];
}

class PlaceChartPointData {
  timePoint;
  rank;
  lastSolvedProblem;
  constructor() {
    this.timePoint = 0;
    this.rank = 0;
    this.lastSolvedProblem = null;
  }
}
class Team {
  id;
  name;
  description;
  organizationId;
  organizationName;
  organization;
  isFirstRankOfOrganization;
  group;
  tag;
  coaches;
  members;
  rank;
  originalRank;
  solvedProblemNum;
  attemptedProblemNum;
  lastSolvedProblem;
  lastSolvedProblemStatistics;
  penalty;
  problemStatistics;
  problemStatisticsMap;
  submissions;
  placeChartPoints;
  awards;
  badge;
  missingPhoto;
  photo;
  location;
  icpcID;
  ip;
  se;
  constructor() {
    this.id = "";
    this.name = new I18nText();
    this.isFirstRankOfOrganization = false;
    this.group = [];
    this.tag = [];
    this.coaches = [];
    this.members = [];
    this.rank = 0;
    this.originalRank = 0;
    this.solvedProblemNum = 0;
    this.attemptedProblemNum = 0;
    this.lastSolvedProblem = null;
    this.lastSolvedProblemStatistics = null;
    this.penalty = 0;
    this.problemStatistics = [];
    this.problemStatisticsMap = /* @__PURE__ */ new Map();
    this.submissions = [];
    this.placeChartPoints = [];
    this.awards = [];
    this.missingPhoto = false;
    this.se = 0;
  }
  reset() {
    this.isFirstRankOfOrganization = false;
    this.rank = 0;
    this.originalRank = 0;
    this.solvedProblemNum = 0;
    this.attemptedProblemNum = 0;
    this.lastSolvedProblem = null;
    this.lastSolvedProblemStatistics = null;
    this.penalty = 0;
    this.problemStatistics = [];
    this.problemStatisticsMap = /* @__PURE__ */ new Map();
    this.submissions = [];
    this.placeChartPoints = [];
    this.awards = [];
    this.se = 0;
  }
  get penaltyToMinute() {
    return Math.floor(this.penalty / 60);
  }
  get isUnofficial() {
    return this.group.includes("unofficial");
  }
  get isGirl() {
    return this.group.includes("girl");
  }
  get isEffectiveTeam() {
    return this.solvedProblemNum > 0;
  }
  get dirt() {
    const attemptedNum = this.attemptedProblemNum;
    const solvedNum = this.solvedProblemNum;
    return calcDirt(attemptedNum, solvedNum);
  }
  membersToString(lang) {
    return this.members.map((member) => member.name.getOrDefault(lang)).join(", ");
  }
  coachesToString(lang) {
    return this.coaches.map((member) => member.name.getOrDefault(lang)).join(", ");
  }
  calcSE(totalTeams) {
    let acceptedProblemNums = 0;
    let total = 0;
    this.problemStatistics.forEach((p) => {
      if (p.isSolved) {
        acceptedProblemNums += 1;
        total += p.problem.statistics.acceptedNum;
      }
    });
    if (totalTeams === 0 || acceptedProblemNums === 0) {
      return 0;
    }
    const res = (acceptedProblemNums * totalTeams - total) / totalTeams / acceptedProblemNums;
    this.se = Math.round(res * 100) / 100;
    return this.se;
  }
  calcSolvedData(options) {
    this.solvedProblemNum = 0;
    this.attemptedProblemNum = 0;
    this.penalty = 0;
    for (const p of this.problemStatistics) {
      if (p.isAccepted) {
        this.solvedProblemNum++;
        this.attemptedProblemNum += p.failedCount + 1;
        if (options?.calculationOfPenalty === "in_seconds" || options?.calculationOfPenalty === "accumulate_in_seconds_and_finally_to_the_minute") {
          this.penalty += p.penaltyInSecond;
        } else {
          this.penalty += p.penalty;
        }
      }
    }
    if (options?.calculationOfPenalty === "accumulate_in_seconds_and_finally_to_the_minute") {
      this.penalty = Math.floor(this.penalty / 60) * 60;
    }
  }
  calcAwards(awards) {
    if (!awards) {
      return;
    }
    for (const award of awards) {
      if (this.rank >= award.minRank && this.rank <= award.maxRank) {
        this.awards.push(award.medalType);
      }
    }
  }
  isEqualRank(otherTeam) {
    return this.solvedProblemNum === otherTeam.solvedProblemNum && this.penalty === otherTeam.penalty && this.lastSolvedProblemStatistics?.solvedTimestampToMinute === otherTeam.lastSolvedProblemStatistics?.solvedTimestampToMinute;
  }
  postProcessPlaceChartPoints() {
    if (this.placeChartPoints.length === 0) {
      return;
    }
    const res = [];
    res.push(this.placeChartPoints[0]);
    for (let i = 1; i < this.placeChartPoints.length - 1; i++) {
      const p = this.placeChartPoints[i];
      const preP = res[res.length - 1];
      if (p.rank !== preP.rank || p.lastSolvedProblem !== preP.lastSolvedProblem) {
        res.push(p);
      }
    }
    if (this.placeChartPoints.length > 1) {
      res.push(this.placeChartPoints[this.placeChartPoints.length - 1]);
    }
    this.placeChartPoints = res;
  }
  static compare(lhs, rhs) {
    if (lhs.solvedProblemNum !== rhs.solvedProblemNum) {
      return rhs.solvedProblemNum - lhs.solvedProblemNum;
    }
    if (lhs.penalty !== rhs.penalty) {
      return lhs.penalty - rhs.penalty;
    }
    if (lhs.lastSolvedProblemStatistics && rhs.lastSolvedProblemStatistics) {
      return lhs.lastSolvedProblemStatistics.solvedTimestampToMinute - rhs.lastSolvedProblemStatistics.solvedTimestampToMinute;
    }
    if (lhs.name < rhs.name) {
      return -1;
    } else if (lhs.name > rhs.name) {
      return 1;
    }
    return 0;
  }
}
function createTeam(teamJSON) {
  const t = new Team();
  t.id = teamJSON.id ?? teamJSON.team_id ?? "";
  t.name = I18nText.fromIText(teamJSON.name ?? teamJSON.team_name ?? "");
  if (teamJSON.description) {
    t.description = I18nText.fromIText(teamJSON.description);
  }
  if (teamJSON.organization) {
    t.organizationId = teamJSON.organization;
    t.organizationName = teamJSON.organization;
  } else {
    t.organizationId = teamJSON.organization_id;
  }
  t.group = ___default.cloneDeep(teamJSON.group ?? []);
  t.tag = ___default.cloneDeep(teamJSON.tag ?? []);
  t.members = createPersons(teamJSON.members);
  if (teamJSON.coach) {
    t.coaches = createPersons(teamJSON.coach);
  } else {
    t.coaches = createPersons(teamJSON.coaches);
  }
  if (Boolean(teamJSON.official) === true) {
    t.group.push("official");
  }
  if (Boolean(teamJSON.unofficial) === true) {
    t.group.push("unofficial");
  }
  if (Boolean(teamJSON.girl) === true) {
    t.group.push("girl");
  }
  {
    const tt = teamJSON;
    for (const key of Object.keys(tt)) {
      if (key === "missing_photo") {
        continue;
      }
      if (tt[key] === 1 || tt[key] === true) {
        t.group.push(key);
      }
    }
  }
  t.group = [...new Set(t.group)];
  t.group.sort();
  t.badge = teamJSON.badge;
  if (teamJSON.missing_photo) {
    t.missingPhoto = true;
  }
  t.photo = teamJSON.photo;
  if (teamJSON.location) {
    t.location = teamJSON.location;
  }
  if (teamJSON.icpc_id) {
    t.icpcID = teamJSON.icpc_id;
  }
  if (teamJSON.ip) {
    t.ip = teamJSON.ip;
  }
  return t;
}
function createTeams(teamsJSON) {
  if (Array.isArray(teamsJSON)) {
    return teamsJSON.map((t) => createTeam(t));
  } else {
    const teams = Object.entries(teamsJSON).map(
      ([teamId, team]) => createTeam({ ...team, id: team.id ?? team.team_id ?? String(teamId) })
    );
    return teams;
  }
}

class Balloon {
  problem;
  team;
  submission;
  constructor() {
    this.problem = new Problem();
    this.team = new Team();
    this.submission = new Submission();
  }
  get key() {
    return `balloon-${this.team.id}-${this.problem.id}`;
  }
  static compare(lhs, rhs) {
    return Submission.compare(lhs.submission, rhs.submission);
  }
}

var GiantsType = /* @__PURE__ */ ((GiantsType2) => {
  GiantsType2[GiantsType2["BLUE"] = 0] = "BLUE";
  GiantsType2[GiantsType2["RED"] = 1] = "RED";
  return GiantsType2;
})(GiantsType || {});
class Giants {
  type;
  name;
  filterOrganizations;
  filterOrganizationMap;
  filterTeams;
  filterTeamMap;
  teams;
  constructor(type = 0 /* BLUE */) {
    this.type = type;
    this.name = `${type === 0 /* BLUE */ ? "Blue" : "Red"} Team`;
    this.teams = [];
    this.filterOrganizations = [];
    this.filterOrganizationMap = /* @__PURE__ */ new Map();
    this.filterTeams = [];
    this.filterTeamMap = /* @__PURE__ */ new Map();
  }
  setFilterOrganizations(filterOrganizations) {
    const m = /* @__PURE__ */ new Map();
    filterOrganizations.forEach((item) => {
      m.set(item.value, item);
    });
    this.filterOrganizations = filterOrganizations;
    this.filterOrganizationMap = m;
  }
  setFilterTeams(filterTeams) {
    const m = /* @__PURE__ */ new Map();
    filterTeams.forEach((item) => {
      m.set(item.value, item);
    });
    this.filterTeams = filterTeams;
    this.filterTeamMap = m;
  }
  refreshName() {
    if (this.filterOrganizations.length > 0) {
      this.name = this.filterOrganizations[0].text;
    } else {
      this.name = `${this.type === 0 /* BLUE */ ? "Blue" : "Red"} Team`;
    }
    return this.name;
  }
  get totalSolvedProblemNum() {
    let total = 0;
    this.teams.forEach((team) => {
      total += team.solvedProblemNum;
    });
    return total;
  }
  get totalPenalty() {
    let total = 0;
    this.teams.forEach((team) => {
      total += team.penaltyToMinute;
    });
    return total;
  }
  get totalPenaltyToString() {
    const penalty = this.totalPenalty;
    const two = (a) => {
      if (a < 10) {
        return `0${a}`;
      }
      return String(a);
    };
    const h = Math.floor(penalty / 60);
    const m = Math.floor(penalty % 60);
    return [two(h), two(m)].join(":");
  }
  toJSON() {
    return {
      type: this.type,
      name: this.name,
      filterOrganizations: this.filterOrganizations,
      filterTeams: this.filterTeams
    };
  }
}
class BattleOfGiants {
  enable;
  topX;
  equalTeams;
  persist;
  blueTeam;
  redTeam;
  constructor() {
    this.enable = false;
    this.topX = 5;
    this.equalTeams = true;
    this.persist = false;
    this.blueTeam = new Giants(0 /* BLUE */);
    this.redTeam = new Giants(1 /* RED */);
  }
  ToBase64() {
    return jsBase64.Base64.encode(JSON.stringify(this));
  }
  FromBase64(base64) {
    if (base64.length === 0) {
      return;
    }
    if (jsBase64.Base64.isValid(base64) === false) {
      return;
    }
    const j = JSON.parse(jsBase64.Base64.decode(base64));
    this.enable = j.enable;
    this.topX = j.topX;
    this.equalTeams = j.equalTeams;
    this.persist = j.persist;
    this.blueTeam = new Giants(0 /* BLUE */);
    this.blueTeam.name = j.blueTeam.name;
    this.blueTeam.setFilterOrganizations(j.blueTeam.filterOrganizations);
    this.blueTeam.setFilterTeams(j.blueTeam.filterTeams);
    this.redTeam = new Giants(1 /* RED */);
    this.redTeam.name = j.redTeam.name;
    this.redTeam.setFilterOrganizations(j.redTeam.filterOrganizations);
    this.redTeam.setFilterTeams(j.redTeam.filterTeams);
  }
}

class Organization {
  id;
  name;
  logo;
  icpcID;
  // Teams belonging to this organization
  teams;
  rank;
  constructor() {
    this.id = "";
    this.name = new I18nText();
    this.teams = [];
    this.rank = -1;
  }
  reset() {
    this.rank = -1;
  }
  static compare(lhs, rhs) {
    if (lhs.id < rhs.id) {
      return -1;
    } else if (lhs.id > rhs.id) {
      return 1;
    }
    return 0;
  }
}
function createOrganization(orgJSON) {
  const org = new Organization();
  org.id = orgJSON.id;
  org.name = I18nText.fromIText(orgJSON.name);
  org.logo = orgJSON.logo;
  org.icpcID = orgJSON.icpc_id;
  return org;
}
function createOrganizations(orgsJSON) {
  return orgsJSON.map((org) => createOrganization(org));
}

class SeatMapSection {
  title;
  rowLabels;
  grid;
  constructor() {
    this.title = new I18nText();
    this.rowLabels = [];
    this.grid = [];
  }
}
class SeatMap {
  sections;
  constructor() {
    this.sections = [];
  }
  /**
   * Build a map from seat IDs (from team.location) to teams
   */
  buildSeatToTeamMap(teams) {
    const map = /* @__PURE__ */ new Map();
    for (const team of teams) {
      if (team.location) {
        map.set(team.location, team);
      }
    }
    return map;
  }
}
function createSeatMapSection(sectionJSON) {
  const s = new SeatMapSection();
  s.title = I18nText.fromIText(sectionJSON.title ?? "");
  s.rowLabels = sectionJSON.rowLabels ?? [];
  s.grid = sectionJSON.grid ?? [];
  return s;
}
function createSeatMap(seatMapJSON) {
  const sm = new SeatMap();
  sm.sections = (seatMapJSON.sections ?? []).map(createSeatMapSection);
  return sm;
}

class ContestOptions {
  enableOrganization;
  calculationOfPenalty;
  submissionTimestampUnit;
  submissionHasTimeField;
  submissionHasLanguageField;
  submissionEnableActionField;
  submissionHasReactionField;
  submissionHasExternalUrlField;
  submissionHasRealtimeReactionStreamField;
  reactionVideoUrlTemplate;
  submissionExternalUrlTemplate;
  teamPhotoTemplate;
  teamWebcamStreamUrlTemplate;
  teamScreenStreamUrlTemplate;
  realtimeReactionWebcamStreamUrlTemplate;
  realtimeReactionScreenStreamUrlTemplate;
  disablePendingPage;
  constructor() {
    this.enableOrganization = false;
    this.calculationOfPenalty = "in_minutes";
    this.submissionTimestampUnit = "second";
    this.submissionHasTimeField = false;
    this.submissionHasLanguageField = false;
    this.submissionEnableActionField = false;
    this.submissionHasReactionField = false;
    this.submissionHasExternalUrlField = false;
    this.submissionHasRealtimeReactionStreamField = false;
    this.disablePendingPage = false;
  }
}
function createContestOptions(contestOptionsJSON = {}) {
  const j = contestOptionsJSON;
  const o = new ContestOptions();
  o.enableOrganization = !!j.enable_organization;
  if (j.calculation_of_penalty) {
    o.calculationOfPenalty = j.calculation_of_penalty;
  }
  if (j.submission_timestamp_unit) {
    o.submissionTimestampUnit = j.submission_timestamp_unit;
  }
  if (j.has_reaction_videos) {
    o.submissionHasReactionField = true;
  }
  if (j.submission_external_url_template) {
    o.submissionHasExternalUrlField = true;
    o.submissionExternalUrlTemplate = j.submission_external_url_template;
  }
  if (j.realtime_reaction_webcam_stream_url_template || j.realtime_reaction_screen_stream_url_template) {
    o.submissionHasRealtimeReactionStreamField = true;
    o.realtimeReactionWebcamStreamUrlTemplate = j.realtime_reaction_webcam_stream_url_template;
    o.realtimeReactionScreenStreamUrlTemplate = j.realtime_reaction_screen_stream_url_template;
  }
  o.submissionEnableActionField = o.submissionHasReactionField || o.submissionHasExternalUrlField || o.submissionHasRealtimeReactionStreamField;
  o.reactionVideoUrlTemplate = j.reaction_video_url_template;
  o.teamPhotoTemplate = j.team_photo_url_template;
  o.teamWebcamStreamUrlTemplate = j.team_webcam_stream_url_template;
  o.teamScreenStreamUrlTemplate = j.team_screen_stream_url_template;
  o.disablePendingPage = !!j.disable_pending_page;
  return o;
}

class Group {
  name;
  isDefault;
  constructor() {
    this.name = new I18nText();
    this.isDefault = false;
  }
}

class Contest {
  id = "";
  name;
  startTime;
  endTime;
  freezeTime;
  replayStartTime;
  replayEndTime;
  replayFreezeTime;
  replayNowTime;
  replayContestStartTimestamp;
  totalDurationTimestamp;
  freezeDurationTimestamp;
  unFreezeDurationTimestamp;
  penalty;
  problems;
  problemsMap;
  statusTimeDisplay;
  medal;
  awards;
  group;
  tag;
  logo;
  banner;
  bannerMode;
  boardLink;
  socialMedia;
  options;
  organizations;
  seatMap;
  constructor() {
    this.name = new I18nText();
    this.startTime = createDayJS();
    this.endTime = createDayJS();
    this.freezeTime = createDayJS();
    this.totalDurationTimestamp = 0;
    this.freezeDurationTimestamp = 0;
    this.unFreezeDurationTimestamp = 0;
    this.penalty = 20 * 60;
    this.problems = [];
    this.problemsMap = /* @__PURE__ */ new Map();
    this.statusTimeDisplay = {
      correct: true,
      incorrect: true,
      pending: true
    };
    this.group = /* @__PURE__ */ new Map();
    this.tag = /* @__PURE__ */ new Map();
    this.options = new ContestOptions();
  }
  getStartTime() {
    return this.replayStartTime ?? this.startTime;
  }
  getEndTime() {
    return this.replayEndTime ?? this.endTime;
  }
  getFreezeTime() {
    return this.replayFreezeTime ?? this.freezeTime;
  }
  getContestDuration(timeFormat = "HH:mm:ss") {
    return dayjs__default.duration(this.getEndTime().diff(this.getStartTime())).format(timeFormat);
  }
  getContestState(nowTime) {
    const now = createDayJS(nowTime);
    if (now.isBefore(this.getStartTime())) {
      return types.ContestState.PENDING;
    }
    if (now.isSameOrAfter(this.getEndTime())) {
      return types.ContestState.FINISHED;
    }
    if (now.isSameOrAfter(this.getFreezeTime())) {
      return types.ContestState.FROZEN;
    }
    return types.ContestState.RUNNING;
  }
  getContestPendingTime(nowTime) {
    let baseTime = createDayJS(nowTime);
    if (baseTime.isAfter(this.getStartTime())) {
      baseTime = this.getStartTime();
    }
    return getTimeDiff(Math.floor(dayjs__default.duration(this.getStartTime().diff(baseTime)).asSeconds()));
  }
  getContestElapsedTime(nowTime) {
    let baseTime = createDayJS(nowTime);
    if (baseTime.isAfter(this.getEndTime())) {
      baseTime = this.getEndTime();
    }
    if (baseTime.isBefore(this.getStartTime())) {
      baseTime = this.getStartTime();
    }
    return getTimeDiff(Math.floor(dayjs__default.duration(baseTime.diff(this.getStartTime())).asSeconds()));
  }
  getContestRemainingTime(nowTime) {
    let baseTime = createDayJS(nowTime);
    if (baseTime.isAfter(this.getEndTime())) {
      baseTime = this.getEndTime();
    }
    if (baseTime.isBefore(this.getStartTime())) {
      baseTime = this.getStartTime();
    }
    return getTimeDiff(Math.floor(dayjs__default.duration(this.getEndTime().diff(baseTime)).asSeconds()));
  }
  getContestProgressRatio(nowTime) {
    const baseTime = createDayJS(nowTime);
    if (this.getStartTime().isSameOrAfter(baseTime)) {
      return 0;
    }
    if (this.getEndTime().isSameOrBefore(baseTime)) {
      return 100;
    }
    const total = this.getEndTime().diff(this.getStartTime(), "s");
    const pass = baseTime.diff(this.getStartTime(), "s");
    return Math.round(pass * 100 / total);
  }
  isEnableAwards(group) {
    if (!this.awards) {
      return false;
    }
    if (!this.awards.has(group)) {
      return false;
    }
    return true;
  }
  resetReplayTime() {
    this.replayStartTime = void 0;
    this.replayEndTime = void 0;
    this.replayFreezeTime = void 0;
    this.replayNowTime = void 0;
    this.replayContestStartTimestamp = void 0;
  }
  setReplayTime(replayStartTimestamp) {
    if (replayStartTimestamp === 0) {
      this.resetReplayTime();
      return;
    }
    const replayStartTime = createDayJS(replayStartTimestamp);
    const diff = replayStartTime.diff(this.startTime, "s");
    this.replayStartTime = this.startTime.add(diff, "s");
    this.replayEndTime = this.endTime.add(diff, "s");
    this.replayFreezeTime = this.freezeTime.add(diff, "s");
    this.replayNowTime = createDayJS();
    this.replayContestStartTimestamp = this.replayNowTime.diff(this.replayStartTime, "s");
  }
}
function createContest(contestJSON) {
  const c = new Contest();
  c.name = I18nText.fromIText(contestJSON.contest_name);
  c.startTime = createDayJS(contestJSON.start_time);
  c.endTime = createDayJS(contestJSON.end_time);
  c.totalDurationTimestamp = c.endTime.unix() - c.startTime.unix();
  {
    c.freezeTime = c.endTime;
    c.freezeDurationTimestamp = 0;
    if (contestJSON.frozen_time !== void 0 && contestJSON.frozen_time != null) {
      const frozenTime = Number(contestJSON.frozen_time);
      c.freezeTime = createDayJS(c.endTime.unix() - frozenTime);
      c.freezeDurationTimestamp = frozenTime;
    }
    if (contestJSON.freeze_time !== void 0 && contestJSON.freeze_time !== null) {
      c.freezeTime = createDayJS(contestJSON.freeze_time);
      c.freezeDurationTimestamp = c.endTime.unix() - c.freezeTime.unix();
    }
    c.unFreezeDurationTimestamp = c.totalDurationTimestamp - c.freezeDurationTimestamp;
  }
  c.penalty = contestJSON.penalty;
  {
    if (contestJSON.problem_id !== void 0 && contestJSON.problem_id !== null) {
      c.problems = createProblemsByProblemIds(contestJSON.problem_id, contestJSON.balloon_color);
    }
    if (contestJSON.problems !== void 0 && contestJSON.problems !== null) {
      c.problems = createProblems(contestJSON.problems);
    }
    c.problemsMap = new Map(c.problems.map((p) => [p.id, p]));
  }
  if (contestJSON.status_time_display !== void 0 && contestJSON.status_time_display !== null) {
    c.statusTimeDisplay = {
      correct: Boolean(contestJSON.status_time_display.correct ?? false),
      incorrect: Boolean(contestJSON.status_time_display.incorrect ?? false),
      pending: Boolean(contestJSON.status_time_display.pending ?? false)
    };
  }
  c.medal = contestJSON.medal;
  (() => {
    if (contestJSON.medal === void 0 || contestJSON.medal === null) {
      return;
    }
    c.awards = /* @__PURE__ */ new Map();
    if (typeof contestJSON.medal === "string") ; else {
      for (const k in contestJSON.medal) {
        const v = contestJSON.medal[k];
        {
          const award = [];
          let rank = 1;
          const work = (key, medalType) => {
            if (Object.keys(v).includes(key)) {
              const a = new Award();
              a.medalType = medalType;
              a.minRank = rank;
              rank += Number(v[key]);
              a.maxRank = rank - 1;
              award.push(a);
            }
          };
          work("gold", MedalType.GOLD);
          work("silver", MedalType.SILVER);
          work("bronze", MedalType.BRONZE);
          {
            const a = new Award();
            a.medalType = MedalType.HONORABLE;
            a.minRank = rank;
            a.maxRank = 1061109567;
            award.push(a);
          }
          c.awards.set(k, award);
        }
      }
    }
  })();
  {
    const g = new Group();
    g.name.fallbackLang = "zh-CN";
    g.name.set("en", "All");
    g.name.set("zh-CN", "\u6240\u6709\u961F\u4F0D");
    g.isDefault = true;
    c.group.set("all", g);
  }
  for (const [k, v] of Object.entries(contestJSON?.group ?? {})) {
    let key = k;
    const g = new Group();
    g.name.fallbackLang = "zh-CN";
    g.name.set("zh-CN", v);
    if (k === "official") {
      g.name.set("en", "Official");
    }
    if (k === "unofficial") {
      g.name.set("en", "Unofficial");
    }
    if (k === "girl" || k === "girls") {
      g.name.set("en", "Girls");
      key = "girl";
    }
    c.group.set(key, g);
  }
  c.banner = contestJSON.banner;
  if (c.banner) {
    c.bannerMode = contestJSON.banner_mode ?? "ALL";
  }
  c.logo = contestJSON.logo;
  c.boardLink = contestJSON.board_link;
  c.socialMedia = contestJSON.social_media;
  if (contestJSON.options) {
    c.options = createContestOptions(contestJSON.options);
  }
  if (contestJSON.organizations) {
    c.organizations = createOrganizations(contestJSON.organizations);
  }
  if (contestJSON.seat_map && !("url" in contestJSON.seat_map)) {
    c.seatMap = createSeatMap(contestJSON.seat_map);
  }
  return c;
}

class ContestIndexConfig {
  contestName;
  startTime;
  endTime;
  freezeTime;
  totalDurationTimestamp;
  freezeDurationTimestamp;
  unFreezeDurationTimestamp;
  logo;
  constructor() {
    this.contestName = new I18nText();
    this.startTime = createDayJS();
    this.endTime = createDayJS();
    this.freezeTime = createDayJS();
    this.totalDurationTimestamp = 0;
    this.freezeDurationTimestamp = 0;
    this.unFreezeDurationTimestamp = 0;
  }
}
class ContestIndex {
  contest;
  boardLink;
  constructor() {
    this.contest = new Contest();
    this.boardLink = "";
  }
}
function createContestIndex(contestIndexJSON) {
  const c = new ContestIndex();
  const cjc = contestIndexJSON.config;
  c.contest = createContest(cjc);
  c.boardLink = contestIndexJSON.board_link;
  return c;
}
function createContestIndexList(contestListJSON) {
  const contestIndexList = [];
  const dfs = (contestList) => {
    if (Object.prototype.hasOwnProperty.call(contestList, "config")) {
      contestIndexList.push(createContestIndex(contestList));
    } else {
      for (const k in contestList) {
        dfs(contestList[k]);
      }
    }
  };
  dfs(contestListJSON);
  contestIndexList.sort((a, b) => {
    if (a.contest.startTime.isBefore(b.contest.startTime)) {
      return 1;
    }
    if (a.contest.startTime.isAfter(b.contest.startTime)) {
      return -1;
    }
    if (a.contest.endTime.isBefore(b.contest.endTime)) {
      return 1;
    }
    if (a.contest.endTime.isAfter(b.contest.endTime)) {
      return -1;
    }
    if (a.contest.name < b.contest.name) {
      return 1;
    }
    if (a.contest.name > b.contest.name) {
      return -1;
    }
    return 0;
  });
  return contestIndexList;
}

class CodeforcesGymGhostDATConverter {
  constructor() {
  }
  convert(rank, options) {
    const includeFakeRussianTeams = options?.includeFakeRussianTeams ?? false;
    const fakeTeamsCount = includeFakeRussianTeams ? 100 : 0;
    let res = "";
    res += `@contest "${rank.contest.name.getOrDefault()}"
@contlen ${Math.floor(dayjs__default.duration(rank.contest.endTime.diff(rank.contest.startTime)).asMinutes())}
@problems ${rank.contest.problems.length}
@teams ${rank.teams.length + fakeTeamsCount}
@submissions ${rank.submissions.length}
`;
    rank.contest.problems.forEach((p) => {
      res += `@p ${p.label},${p.label},20,0
`;
    });
    let teamIndex = 1;
    const teamIdMap = /* @__PURE__ */ new Map();
    const submissionsIdMap = /* @__PURE__ */ new Map();
    rank.teams.forEach((team) => {
      let name = team.name.getOrDefault();
      if (team.organization) {
        name = `${team.organization.name.getOrDefault()} - ${name}`;
      }
      if (team.members) {
        name = `${name} - ${team.membersToString()}`;
      }
      res += `@t ${teamIndex},0,1,"${name}"
`;
      teamIdMap.set(team.id, teamIndex);
      teamIndex++;
      {
        const mp = /* @__PURE__ */ new Map();
        rank.contest.problems.forEach((p) => {
          mp.set(p.id, 0);
        });
        submissionsIdMap.set(team.id, mp);
      }
    });
    if (includeFakeRussianTeams) {
      for (let i = 0; i < 100; i++) {
        res += `@t ${teamIndex},0,1,"\u041F\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u043A\u043E\u043C\u0430\u043D\u0434\u0443"
`;
        teamIndex++;
      }
    }
    rank.getSubmissions().forEach((submission) => {
      const teamId = submission.teamId;
      const problemId = submission.problemId;
      const problem = rank.contest.problemsMap.get(problemId);
      const teamIndex2 = teamIdMap.get(teamId);
      if (!problem) {
        return;
      }
      if (!teamIndex2) {
        return;
      }
      const status = this.submissionStatusToCodeforcesGymDatStatus(submission.status);
      submissionsIdMap.get(teamId).set(problemId, submissionsIdMap.get(teamId).get(problemId) + 1);
      res += `@s ${teamIndex2},${problem.label},${submissionsIdMap.get(teamId)?.get(problemId)},${submission.timestampToSecond},${status}
`;
    });
    return res;
  }
  submissionStatusToCodeforcesGymDatStatus(status) {
    if (isAccepted(status)) {
      return "OK";
    }
    if (status === types.SubmissionStatus.WRONG_ANSWER) {
      return "WA";
    }
    if (status === types.SubmissionStatus.TIME_LIMIT_EXCEEDED) {
      return "TL";
    }
    if (status === types.SubmissionStatus.MEMORY_LIMIT_EXCEEDED) {
      return "ML";
    }
    if (status === types.SubmissionStatus.OUTPUT_LIMIT_EXCEEDED) {
      return "IL";
    }
    if (status === types.SubmissionStatus.PRESENTATION_ERROR) {
      return "PE";
    }
    if (status === types.SubmissionStatus.RUNTIME_ERROR) {
      return "RT";
    }
    if (status === types.SubmissionStatus.COMPILATION_ERROR || isNotCalculatedPenaltyStatus(status)) {
      return "CE";
    }
    if (isPending(status)) {
      return "PD";
    }
    return "RJ";
  }
}

class GeneralExcelConverter {
  lang;
  constructor(lang) {
    this.lang = lang;
  }
  convert(oriRank) {
    const rank = ___default.cloneDeep(oriRank);
    rank.options.disableFilterTeamsByGroup();
    rank.options.disableFilterSubmissionByTimestamp();
    const workbook = XLSX__namespace.utils.book_new();
    for (const [k, v] of rank.contest.group) {
      rank.options.setGroup(k);
      rank.buildRank();
      const sheet = this.convertToSheet(rank);
      XLSX__namespace.utils.book_append_sheet(workbook, sheet, v.name.getOrDefault(this.lang));
    }
    return workbook;
  }
  convertAndWrite(rank, filename) {
    return XLSX__namespace.writeFile(
      this.convert(rank),
      filename,
      {
        compression: true
      }
    );
  }
  convertToSheet(rank) {
    const aoa = this.convertToAoa(rank);
    const sheet = XLSX__namespace.utils.aoa_to_sheet(aoa.aoa);
    const cols = [];
    const head = aoa.aoa[1];
    for (let j = 0; j < head.length; j++) {
      let wch = 10;
      for (let i = 1; i < aoa.aoa.length; i++) {
        wch = Math.max(wch, stringWidth__default(aoa.aoa[i][j]) + 2);
      }
      cols.push({
        wch
      });
    }
    sheet["!cols"] = cols;
    {
      const mergeRange = { s: { r: 0, c: 0 }, e: { r: 0, c: head.length - 1 } };
      const merges = [{ s: mergeRange.s, e: mergeRange.e }];
      sheet["!merges"] = merges;
    }
    const font = {
      name: "Arial Unicode MS",
      bold: false,
      italic: false,
      sz: 12
    };
    const borderStyle = {
      style: "thin"
    };
    const cellStyle = {
      alignment: {
        vertical: "center",
        horizontal: "center"
      },
      border: {
        top: borderStyle,
        bottom: borderStyle,
        left: borderStyle,
        right: borderStyle
      },
      font
    };
    const firstSolvedCellStyle = {
      ...cellStyle,
      fill: {
        fgColor: { rgb: "009900" }
      }
    };
    for (let i = 1; i < aoa.aoa.length; i++) {
      for (let j = 0; j < aoa.aoa[i].length; j++) {
        const cellAddress = XLSX__namespace.utils.encode_cell({ r: i, c: j });
        const cell = sheet[cellAddress];
        const specialCell = aoa.specialCells.find((sc) => sc.row === i && sc.col === j);
        if (specialCell?.type === "firstSolved" /* FIRST_SOLVED */) {
          cell.s = firstSolvedCellStyle;
        } else {
          cell.s = cellStyle;
        }
      }
    }
    {
      const cellAddress = XLSX__namespace.utils.encode_cell({ r: 0, c: 0 });
      const cell = sheet[cellAddress];
      const titleStyle = ___default.cloneDeep(cellStyle);
      titleStyle.font.sz = 28;
      titleStyle.font.bold = true;
      cell.s = titleStyle;
    }
    return sheet;
  }
  convertToAoa(rank) {
    const aoa = [];
    const specialCells = [];
    const enableAwards = rank.contest.isEnableAwards(rank.options.group);
    const enableMembers = rank.teams[0]?.members.length > 0;
    const enableCoach = rank.teams[0]?.coaches.length > 0;
    {
      aoa.push([rank.contest.name.getOrDefault(this.lang)]);
    }
    {
      const head = [];
      head.push("Rank");
      if (rank.contest.options.enableOrganization) {
        head.push("Organization Rank");
        head.push("Organization");
      }
      head.push("Team", "Solved", "Penalty", ...rank.contest.problems.map((p) => p.label), "Dirt");
      if (enableAwards) {
        head.push("Medal");
      }
      if (enableMembers) {
        head.push("Member1", "Member2", "Member3");
      }
      if (enableCoach) {
        head.push("Coaches");
      }
      head.push("Unofficial");
      head.push("Girl");
      head.push("ICPC ID");
      aoa.push(head);
    }
    for (const team of rank.teams) {
      const arr = [];
      arr.push(team.rank.toString());
      if (team.organization) {
        if (team.isFirstRankOfOrganization) {
          arr.push(team.organization.rank.toString());
        } else {
          arr.push("");
        }
        arr.push(team.organization.name.getOrDefault(this.lang));
      }
      arr.push(team.name.getOrDefault(this.lang), team.solvedProblemNum.toString(), team.penaltyToMinute.toString());
      for (const p of team.problemStatistics) {
        if (p.isUnSubmitted) {
          arr.push("-");
        }
        if (p.isSolved) {
          arr.push(`+${p.totalCount}(${p.solvedTimestampToMinute})`);
          if (p.isFirstSolved) {
            specialCells.push({
              row: aoa.length,
              col: arr.length - 1,
              type: "firstSolved" /* FIRST_SOLVED */
            });
          }
        }
        if (p.isWrongAnswer) {
          arr.push(`-${p.failedCount}`);
        }
        if (p.isPending) {
          arr.push(`? ${p.failedCount} + ${p.pendingCount}`);
        }
      }
      arr.push(`${team.dirt}%`);
      if (enableAwards) {
        const medals = team.awards.filter((a) => isValidMedalType(a)).map((a) => a.toString());
        arr.push(medals.join(", "));
      }
      if (enableMembers) {
        const members = team.members;
        if (Array.isArray(members)) {
          arr.push(members[0]?.name.getOrDefault(this.lang) ?? "");
          arr.push(members[1]?.name.getOrDefault(this.lang) ?? "");
          arr.push(members[2]?.name.getOrDefault(this.lang) ?? "");
        } else {
          arr.push("", "", "");
        }
      }
      if (enableCoach) {
        arr.push(team.coachesToString());
      }
      arr.push(team.isUnofficial ? "Y" : "N");
      arr.push(team.isGirl ? "Y" : "N");
      arr.push(team.icpcID ?? "");
      aoa.push(arr);
    }
    return { aoa, specialCells };
  }
}

class ICPCStandingsCsvConverter {
  constructor() {
  }
  convert(oriRank) {
    const rank = ___default.cloneDeep(oriRank);
    rank.options.disableFilterTeamsByGroup();
    rank.options.disableFilterSubmissionByTimestamp();
    rank.options.setGroup("official");
    rank.buildRank();
    const resList = [];
    for (const team of rank.teams) {
      const res = {
        teamId: team.icpcID ?? "",
        rank: team.rank,
        medalCitation: this.getMedalCitation(team),
        problemsSolved: team.solvedProblemNum,
        totalTime: team.penaltyToMinute,
        lastProblemTime: team.lastSolvedProblemStatistics?.solvedTimestampToMinute ?? 0,
        siteCitation: "",
        citation: ordinal__default(team.rank),
        teamName: team.name.getOrDefault(),
        institution: team.organization?.name.getOrDefault() ?? ""
      };
      resList.push(res);
    }
    const csv = Papa__default.unparse(resList);
    return csv;
  }
  getMedalCitation(team) {
    if (team.solvedProblemNum === 0) {
      return "";
    }
    const medals = team.awards.filter((a) => isValidMedalType(a)).map((a) => a.toString());
    if (medals.length === 1) {
      const medal = medals[0];
      if (medal === "Gold") {
        return "Gold Medal";
      }
      if (medal === "Silver") {
        return "Silver Medal";
      }
      if (medal === "Bronze") {
        return "Bronze Medal";
      }
      if (medal === "Honorable") {
        return "Honorable Mention";
      }
    }
    return "";
  }
}

function getImageSource(image, data_host) {
  if (image?.url) {
    if (!data_host) {
      return image.url;
    }
    if (image.url.startsWith("http")) {
      return image.url;
    }
    if (image.url.startsWith("/")) {
      return image.url;
    }
    return `${normalizePath(data_host)}${image.url}`;
  }
  if (image?.base64) {
    if (image.mime) {
      return `data:${image.mime};base64,${image.base64}`;
    }
    return `data:image/${image.type ?? "png"};base64,${image.base64}`;
  }
  return "";
}

class RankStatistics {
  teamSolvedNum;
  teamSolvedNumIndex;
  maxSolvedProblems;
  effectiveTeamNum;
  totalTeamNum;
  constructor() {
    this.teamSolvedNum = [];
    this.teamSolvedNumIndex = [];
    this.maxSolvedProblems = 0;
    this.effectiveTeamNum = 0;
    this.totalTeamNum = 0;
  }
  reset() {
    this.teamSolvedNum = [];
    this.teamSolvedNumIndex = [];
    this.maxSolvedProblems = 0;
    this.effectiveTeamNum = 0;
    this.totalTeamNum = 0;
  }
  getTeamSolvedNumIndex(solvedNum) {
    return this.teamSolvedNumIndex[solvedNum] ?? 0;
  }
}

class RankOptions {
  enableFilterSubmissionsByTimestamp;
  width;
  timestamp;
  enableFilterTeamsByGroup;
  group;
  filterOrganizations;
  filterOrganizationMap;
  filterTeams;
  filterTeamMap;
  filterTeamIds;
  filterTeamIdMap;
  enableAnimatedSubmissions;
  battleOfGiants;
  constructor() {
    this.enableFilterSubmissionsByTimestamp = false;
    this.width = 0;
    this.timestamp = 0;
    this.enableFilterTeamsByGroup = false;
    this.group = "all";
    this.filterOrganizations = [];
    this.filterOrganizationMap = /* @__PURE__ */ new Map();
    this.filterTeams = [];
    this.filterTeamMap = /* @__PURE__ */ new Map();
    this.filterTeamIds = [];
    this.filterTeamIdMap = /* @__PURE__ */ new Map();
    this.enableAnimatedSubmissions = false;
    this.battleOfGiants = new BattleOfGiants();
  }
  setSelf(self) {
    this.enableFilterSubmissionsByTimestamp = self.enableFilterSubmissionsByTimestamp;
    this.width = self.width;
    this.timestamp = self.timestamp;
    this.enableFilterTeamsByGroup = self.enableFilterTeamsByGroup;
    this.group = self.group;
    this.filterOrganizations = self.filterOrganizations;
    this.filterOrganizationMap = self.filterOrganizationMap;
    this.filterTeams = self.filterTeams;
    this.filterTeamMap = self.filterTeamMap;
    this.filterTeamIds = self.filterTeamIds;
    this.filterTeamIdMap = self.filterTeamIdMap;
    this.enableAnimatedSubmissions = self.enableAnimatedSubmissions;
    this.battleOfGiants = self.battleOfGiants;
  }
  setWidth(width, contest) {
    this.width = width;
    this.timestamp = Math.floor((contest.getEndTime().unix() - contest.getStartTime().unix()) * this.width * 1e-4);
    this.enableFilterSubmissionsByTimestamp = true;
  }
  disableFilterSubmissionByTimestamp() {
    this.enableFilterSubmissionsByTimestamp = false;
  }
  setGroup(group) {
    this.group = group;
    this.enableFilterTeamsByGroup = true;
    if (this.group === "all") {
      this.disableFilterTeamsByGroup();
    }
  }
  disableFilterTeamsByGroup() {
    this.enableFilterTeamsByGroup = false;
    this.group = "all";
  }
  setFilterOrganizations(filterOrganizations) {
    const m = /* @__PURE__ */ new Map();
    filterOrganizations.forEach((item) => {
      m.set(item.value, item);
    });
    this.filterOrganizations = filterOrganizations;
    this.filterOrganizationMap = m;
  }
  setFilterTeams(filterTeams) {
    const m = /* @__PURE__ */ new Map();
    filterTeams.forEach((item) => {
      m.set(item.value, item);
    });
    this.filterTeams = filterTeams;
    this.filterTeamMap = m;
  }
  setFilterTeamIds(filterTeamIds) {
    const m = /* @__PURE__ */ new Map();
    filterTeamIds.forEach((item) => {
      m.set(item.value, item);
    });
    this.filterTeamIds = filterTeamIds;
    this.filterTeamIdMap = m;
  }
  isNeedReBuildRank(nextRankOptions) {
    if (this.enableFilterSubmissionsByTimestamp !== nextRankOptions.enableFilterSubmissionsByTimestamp) {
      return true;
    }
    if (this.width !== nextRankOptions.width) {
      return true;
    }
    if (this.timestamp !== nextRankOptions.timestamp) {
      return true;
    }
    if (this.enableFilterTeamsByGroup !== nextRankOptions.enableFilterTeamsByGroup) {
      return true;
    }
    if (this.group !== nextRankOptions.group) {
      return true;
    }
    return false;
  }
}
class Rank {
  contest;
  teams;
  teamsMap;
  submissions;
  submissionsMap;
  organizations;
  organizationsMap;
  originTeams;
  rankStatistics;
  options;
  balloons;
  languages;
  statuses;
  constructor(contest, teams, submissions) {
    this.contest = contest;
    this.teams = ___default.cloneDeep(teams);
    this.teamsMap = new Map(this.teams.map((t) => [t.id, t]));
    this.submissions = ___default.cloneDeep(submissions).sort(Submission.compare);
    {
      const o = this.contest.options;
      const timestampUnit = ___default.cloneDeep(o.submissionTimestampUnit);
      this.submissions.forEach((s) => {
        s.timestampUnit = timestampUnit;
        if (s.time) {
          o.submissionHasTimeField = true;
        }
        if (s.language) {
          o.submissionHasLanguageField = true;
        }
      });
    }
    this.submissionsMap = new Map(this.submissions.map((s) => [s.id, s]));
    if (this.contest.organizations) {
      this.organizations = this.contest.organizations;
      this.organizationsMap = new Map(
        this.organizations.map((org) => [org.id, org])
      );
      this.linkTeamAndOrg();
    } else {
      this.organizationsMap = this.buildOrganizationsMap();
      this.organizations = [...this.organizationsMap.values()];
    }
    this.organizations.sort(Organization.compare);
    this.originTeams = this.teams.map((t) => t);
    this.originTeams.sort(Team.compare);
    this.rankStatistics = new RankStatistics();
    this.options = new RankOptions();
    this.balloons = [];
    {
      const se = /* @__PURE__ */ new Set();
      this.submissions.forEach((s) => {
        if (s.language) {
          se.add(s.language);
        }
      });
      this.languages = [...se].sort();
    }
    {
      const se = /* @__PURE__ */ new Set();
      this.submissions.forEach((s) => {
        se.add(s.status);
      });
      this.statuses = [...se].sort();
    }
  }
  linkTeamAndOrg() {
    this.teams.forEach((t) => {
      if (!t.organizationId) {
        return;
      }
      t.organization = this.organizationsMap.get(t.organizationId);
    });
  }
  buildOrganizationsMap() {
    if (!this.contest.options.enableOrganization) {
      return /* @__PURE__ */ new Map();
    }
    const res = /* @__PURE__ */ new Map();
    this.teams.forEach((t) => {
      if (!t.organizationId) {
        return;
      }
      if (res.has(t.organizationId)) {
        const org2 = res.get(t.organizationId);
        org2?.teams.push(t);
        t.organization = org2;
        return;
      }
      const org = new Organization();
      org.id = t.organizationId;
      org.name = new I18nText();
      org.name.fallback = t.organizationName;
      org.teams.push(t);
      t.organization = org;
      res.set(org.id, org);
    });
    return res;
  }
  cleanRank() {
    (() => {
      this.teams = [];
      for (const [_k, v] of this.teamsMap) {
        if (this.filterTeamByOrg(v)) {
          continue;
        }
        this.teams.push(v);
      }
    })();
    for (const o of this.organizations) {
      o.reset();
    }
    for (const t of this.teams) {
      t.reset();
      t.problemStatistics = this.contest.problems.map((p) => {
        const ps = new TeamProblemStatistics();
        ps.problem = p;
        ps.contestPenalty = this.contest.penalty;
        return ps;
      });
      t.problemStatisticsMap = new Map(t.problemStatistics.map((ps) => [ps.problem.id, ps]));
    }
    this.contest.problems.forEach((p) => {
      p.statistics.reset();
    });
  }
  buildRank() {
    (() => {
      this.cleanRank();
      this.teams.forEach(
        (t) => t.placeChartPoints.push({
          timePoint: 0,
          rank: 1,
          lastSolvedProblem: null
        })
      );
      (() => {
        this.rankStatistics.reset();
        this.rankStatistics.teamSolvedNum = Array.from({ length: this.contest.problems.length + 1 }).fill(0);
        this.rankStatistics.teamSolvedNumIndex = Array.from({ length: this.contest.problems.length + 1 }).fill(0);
      })();
      let preSubmissionTimestampToMinute = 0;
      const allSubmissions = this.getSubmissions();
      for (let ix = 0; ix < allSubmissions.length; ix++) {
        const s = allSubmissions[ix];
        const teamId = s.teamId;
        const problemId = s.problemId;
        const team = this.teamsMap.get(teamId);
        const problem = this.contest.problemsMap.get(problemId);
        (() => {
          if (team === void 0 || this.filterTeamByOrg(team) || problem === void 0) {
            return;
          }
          const problemStatistics = team.problemStatisticsMap.get(problemId);
          const submissions = problemStatistics.submissions;
          submissions.push(s);
          team.submissions.push(s);
          problem.statistics.submittedNum++;
          if (problemStatistics.isSolved) {
            s.isSolved = false;
            s.isFirstSolved = false;
            return;
          }
          if (s.isIgnore || s.isNotCalculatedPenaltyStatus()) {
            problem.statistics.ignoreNum++;
            problemStatistics.ignoreCount++;
            return;
          }
          problemStatistics.isSubmitted = true;
          problemStatistics.lastSubmitTimestamp = s.timestampToSecond;
          problemStatistics.totalCount++;
          if (s.isAccepted()) {
            s.isSolved = true;
            problemStatistics.isSolved = true;
            problemStatistics.solvedTimestamp = s.timestampToSecond;
            problem.statistics.acceptedNum++;
            problem.statistics.attemptedNum += problemStatistics.failedCount + 1;
            if (problem.statistics.firstSolveSubmissions.length === 0 || problem.statistics.firstSolveSubmissions[problem.statistics.firstSolveSubmissions.length - 1].timestamp === s.timestamp) {
              s.isFirstSolved = true;
              problemStatistics.isFirstSolved = true;
              problem.statistics.firstSolveSubmissions.push(s);
            }
            while (problem.statistics.lastSolveSubmissions.length > 0) {
              problem.statistics.lastSolveSubmissions.pop();
            }
            problem.statistics.lastSolveSubmissions.push(s);
            team.lastSolvedProblem = problem;
            team.lastSolvedProblemStatistics = problemStatistics;
          }
          if (s.isRejected()) {
            problemStatistics.failedCount++;
            problem.statistics.rejectedNum++;
          }
          if (s.isPending()) {
            problemStatistics.pendingCount++;
            problem.statistics.pendingNum++;
          }
        })();
        if (s.timestampToMinute > preSubmissionTimestampToMinute || ix === allSubmissions.length - 1) {
          this.teams.forEach((t) => t.calcSolvedData(this.contest.options));
          this.teams.sort(Team.compare);
          this.buildTeamRank();
          this.teams.forEach(
            (t) => t.placeChartPoints.push(
              {
                timePoint: s.timestampToMinute,
                rank: t.rank,
                lastSolvedProblem: t.lastSolvedProblem
              }
            )
          );
        }
        preSubmissionTimestampToMinute = s.timestampToMinute;
      }
      this.teams.forEach((t) => t.calcSolvedData(this.contest.options));
      this.teams.sort(Team.compare);
      this.buildTeamRank();
      this.buildOrgRank();
      this.rankStatistics.effectiveTeamNum = this.teams.filter((t) => t.isEffectiveTeam).length;
      this.rankStatistics.totalTeamNum = this.teams.length;
      this.teams.forEach((t) => t.calcSE(this.rankStatistics.totalTeamNum));
      this.contest.problems.forEach((p) => p.statistics.calcSE(this.rankStatistics.totalTeamNum));
      this.buildAwards();
      this.teams.forEach((t) => t.calcAwards(this.contest.awards?.get(this.options.group)));
      this.teams.forEach((t) => t.postProcessPlaceChartPoints());
    })();
    (() => {
      for (const t of this.teams) {
        this.rankStatistics.teamSolvedNum[t.solvedProblemNum]++;
      }
      {
        let current = 0;
        const teamSolvedNum = this.rankStatistics.teamSolvedNum;
        const teamSolvedNumIndex = this.rankStatistics.teamSolvedNumIndex;
        for (let i = teamSolvedNumIndex.length - 1; i >= 0; i--) {
          current += teamSolvedNum[i] > 0 ? 1 : 0;
          teamSolvedNumIndex[i] = current;
        }
      }
      if (this.teams.length > 0) {
        this.rankStatistics.maxSolvedProblems = this.teams[0].solvedProblemNum;
      }
    })();
    return this;
  }
  buildTeamRank() {
    let rank = 1;
    let originalRank = 1;
    let preTeam = null;
    for (const t of this.teams) {
      t.rank = rank++;
      t.originalRank = originalRank++;
      if (preTeam !== null) {
        if (t.isEqualRank(preTeam)) {
          t.rank = preTeam.rank;
        }
      }
      preTeam = t;
    }
  }
  buildOrgRank() {
    if (!this.contest.options.enableOrganization) {
      return;
    }
    let rank = 1;
    let preTeam = null;
    for (const t of this.teams) {
      const org = t.organization;
      if (!org || org.rank > -1) {
        continue;
      }
      org.rank = rank++;
      t.isFirstRankOfOrganization = true;
      if (preTeam) {
        if (t.isEqualRank(preTeam)) {
          org.rank = preTeam.organization.rank;
        }
      }
      preTeam = t;
    }
  }
  buildAwards() {
    if (this.contest.medal === "ccpc") {
      this.contest.awards = /* @__PURE__ */ new Map();
      const tot = this.rankStatistics.effectiveTeamNum;
      const award = [];
      const gold = new Award();
      const silver = new Award();
      const bronze = new Award();
      const honorable = new Award();
      {
        gold.medalType = MedalType.GOLD;
        gold.minRank = 1;
        gold.maxRank = Math.ceil(tot * 0.1);
        if (gold.maxRank >= gold.minRank) {
          award.push(gold);
        }
      }
      {
        silver.medalType = MedalType.SILVER;
        silver.minRank = gold.maxRank + 1;
        silver.maxRank = Math.ceil(tot * 0.3);
        if (silver.maxRank >= silver.minRank) {
          award.push(silver);
        }
      }
      {
        bronze.medalType = MedalType.BRONZE;
        bronze.minRank = silver.maxRank + 1;
        bronze.maxRank = Math.ceil(tot * 0.6);
        if (bronze.maxRank >= bronze.minRank) {
          award.push(bronze);
        }
      }
      {
        honorable.medalType = MedalType.HONORABLE;
        honorable.minRank = bronze.maxRank + 1;
        this.teams.forEach((t) => {
          if (t.solvedProblemNum > 0) {
            honorable.maxRank = Math.max(honorable.maxRank, t.rank);
          }
        });
        if (honorable.maxRank >= honorable.minRank) {
          award.push(honorable);
        }
      }
      this.contest.awards.set("official", award);
    }
  }
  filterTeamByOrg(team) {
    const o = this.options;
    if (o.enableFilterTeamsByGroup) {
      if (!team.group?.includes(o.group)) {
        return true;
      }
    }
    return false;
  }
  getSubmissions() {
    if (this.contest.replayContestStartTimestamp === void 0 && this.options.enableFilterSubmissionsByTimestamp === false) {
      return this.submissions;
    }
    return this.submissions.filter((s) => {
      if (this.contest.replayContestStartTimestamp !== void 0) {
        if (s.timestampToSecond > this.contest.replayContestStartTimestamp) {
          return false;
        }
      }
      if (this.options.enableFilterSubmissionsByTimestamp) {
        if (s.timestampToSecond > this.options.timestamp) {
          return false;
        }
      }
      return true;
    });
  }
  buildBalloons() {
    this.balloons = [];
    this.cleanRank();
    const allSubmissions = this.getSubmissions();
    for (let ix = 0; ix < allSubmissions.length; ix++) {
      const s = allSubmissions[ix];
      const teamId = s.teamId;
      const problemId = s.problemId;
      const team = this.teamsMap.get(teamId);
      const problem = this.contest.problemsMap.get(problemId);
      (() => {
        if (team === void 0 || problem === void 0) {
          return;
        }
        const problemStatistics = team.problemStatisticsMap.get(problemId);
        if (problemStatistics.isSolved) {
          return;
        }
        if (s.isAccepted()) {
          problemStatistics.isSolved = true;
          problemStatistics.solvedTimestamp = s.timestampToSecond;
          const b = new Balloon();
          b.team = team;
          b.problem = problem;
          b.submission = s;
          this.balloons.push(b);
        }
      })();
    }
  }
  setReplayTime(replayStartTimestamp) {
    this.contest.setReplayTime(replayStartTimestamp);
  }
}

class RatingHistory {
  rank;
  rating;
  teamName;
  organization;
  members;
  coaches;
  contestID;
  contestName;
  contestLink;
  contestTime;
  constructor() {
    this.rank = 0;
    this.rating = 0;
    this.teamName = new I18nText();
    this.organization = "";
    this.members = [];
    this.coaches = [];
    this.contestID = "";
    this.contestName = new I18nText();
    this.contestLink = "";
    this.contestTime = createDayJS();
  }
  toJSON() {
    return {
      rank: this.rank,
      rating: this.rating,
      teamName: this.teamName.toI18NStringSet(),
      organization: this.organization,
      members: this.members.map((member) => member.toIPerson()),
      coaches: this.coaches.map((coach) => coach.toIPerson()),
      contestID: this.contestID,
      contestName: this.contestName.toI18NStringSet(),
      contestLink: this.contestLink,
      contestTime: this.contestTime.toDate()
    };
  }
  static fromJSON(iRatingHistory) {
    if (typeof iRatingHistory === "string") {
      iRatingHistory = JSON.parse(iRatingHistory);
    }
    const ratingHistory = new RatingHistory();
    ratingHistory.rank = iRatingHistory.rank;
    ratingHistory.rating = iRatingHistory.rating;
    ratingHistory.teamName = I18nText.fromIText(iRatingHistory.teamName);
    ratingHistory.organization = iRatingHistory.organization;
    ratingHistory.members = createPersons(iRatingHistory.members);
    ratingHistory.coaches = createPersons(iRatingHistory.coaches);
    ratingHistory.contestID = iRatingHistory.contestID;
    ratingHistory.contestName = I18nText.fromIText(iRatingHistory.contestName);
    ratingHistory.contestLink = iRatingHistory.contestLink;
    ratingHistory.contestTime = createDayJS(iRatingHistory.contestTime);
    return ratingHistory;
  }
}

class RatingUser {
  id;
  name;
  organization;
  members;
  coaches;
  rating;
  minRating;
  maxRating;
  rank;
  oldRating;
  seed;
  delta;
  ratingHistories;
  constructor() {
    this.id = "";
    this.name = new I18nText();
    this.organization = "";
    this.members = [];
    this.coaches = [];
    this.rating = 0;
    this.minRating = 1061109567;
    this.maxRating = -1061109567;
    this.rank = 0;
    this.oldRating = 0;
    this.seed = 1;
    this.delta = 0;
    this.ratingHistories = [];
  }
  UpdateRating(rating) {
    this.rating = rating;
    this.minRating = Math.min(this.minRating, rating);
    this.maxRating = Math.max(this.maxRating, rating);
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name.toI18NStringSet(),
      organization: this.organization,
      members: this.members.map((member) => member.toIPerson()),
      coaches: this.coaches.map((coach) => coach.toIPerson()),
      rating: this.rating,
      minRating: this.minRating,
      maxRating: this.maxRating,
      ratingHistories: this.ratingHistories.map((ratingHistory) => ratingHistory.toJSON())
    };
  }
  static fromJSON(iRatingUser) {
    if (typeof iRatingUser === "string") {
      iRatingUser = JSON.parse(iRatingUser);
    }
    const ratingUser = new RatingUser();
    ratingUser.id = iRatingUser.id;
    ratingUser.name = I18nText.fromIText(iRatingUser.name);
    ratingUser.organization = iRatingUser.organization;
    ratingUser.members = iRatingUser.members.map((member) => Person.fromIPerson(member));
    ratingUser.coaches = iRatingUser.coaches.map((coach) => Person.fromIPerson(coach));
    ratingUser.rating = iRatingUser.rating;
    ratingUser.minRating = iRatingUser.minRating;
    ratingUser.maxRating = iRatingUser.maxRating;
    for (const iRatingHistory of iRatingUser.ratingHistories) {
      ratingUser.ratingHistories.push(RatingHistory.fromJSON(iRatingHistory));
    }
    return ratingUser;
  }
}

class RatingCalculator {
  users;
  constructor() {
    this.users = [];
  }
  calculate() {
    this.calculateInternal();
  }
  calcP(userA, userB) {
    return 1 / (1 + 10 ** ((userB.oldRating - userA.oldRating) / 400));
  }
  getExSeed(users, rating, ownUser) {
    const exUser = new RatingUser();
    exUser.oldRating = rating;
    let res = 0;
    users.forEach((user) => {
      if (user.id !== ownUser.id) {
        res += this.calcP(user, exUser);
      }
    });
    return res;
  }
  calcRating(users, rank, user) {
    let left = 1;
    let right = 8e3;
    while (right - left > 1) {
      const mid = Math.floor((left + right) / 2);
      if (this.getExSeed(users, mid, user) < rank) {
        right = mid;
      } else {
        left = mid;
      }
    }
    return left;
  }
  calculateInternal() {
    for (let i = 0; i < this.users.length; i++) {
      const u = this.users[i];
      u.seed = 1;
      for (let j = 0; j < this.users.length; j++) {
        if (i !== j) {
          const otherUser = this.users[j];
          u.seed += this.calcP(otherUser, u);
        }
      }
    }
    let sumDelta = 0;
    for (let i = 0; i < this.users.length; i++) {
      const u = this.users[i];
      u.delta = Math.floor(
        (this.calcRating(this.users, Math.sqrt(u.rank * u.seed), u) - u.oldRating) / 2
      );
      sumDelta += u.delta;
    }
    let inc = Math.floor(-sumDelta / this.users.length) - 1;
    for (let i = 0; i < this.users.length; i++) {
      const u = this.users[i];
      u.delta += inc;
    }
    this.users = this.users.sort((a, b) => b.oldRating - a.oldRating);
    const s = Math.min(this.users.length, Math.floor(4 * Math.round(Math.sqrt(this.users.length))));
    let sumS = 0;
    for (let i = 0; i < s; i++) {
      sumS += this.users[i].delta;
    }
    inc = Math.min(Math.max(Math.floor(-sumS / s), -10), 0);
    this.users.forEach((u) => {
      u.delta += inc;
      u.UpdateRating(u.oldRating + u.delta);
    });
    this.users = this.users.sort((a, b) => a.rank - b.rank);
  }
}

class Rating {
  id;
  name;
  baseRating;
  contestIDs;
  users;
  ranks;
  userMap;
  constructor() {
    this.id = "";
    this.name = new I18nText();
    this.baseRating = 1500;
    this.contestIDs = [];
    this.users = [];
    this.ranks = [];
    this.userMap = /* @__PURE__ */ new Map();
  }
  buildRating() {
    for (const rank of this.ranks) {
      rank.buildRank();
      const ratingCalculator = new RatingCalculator();
      for (const t of rank.teams) {
        const id = this.generateTeamId(t);
        let u = null;
        if (!this.userMap.has(id)) {
          u = new RatingUser();
          u.id = id;
          u.name = t.name;
          u.organization = t.organizationName ?? "";
          u.members = t.members;
          u.coaches = t.coaches;
          u.rank = t.rank;
          u.oldRating = this.baseRating;
          u.UpdateRating(this.baseRating);
          this.userMap.set(id, u);
          this.users.push(u);
          ratingCalculator.users.push(u);
        } else {
          u = this.userMap.get(id);
          u.rank = t.rank;
          u.oldRating = u.rating;
          ratingCalculator.users.push(u);
        }
        {
          const h = new RatingHistory();
          h.rank = t.rank;
          h.rating = u.rating;
          h.teamName = t.name;
          h.organization = t.organizationName ?? "";
          h.members = t.members;
          h.coaches = t.coaches;
          h.contestID = rank.contest.id;
          h.contestLink = h.contestID;
          h.contestName = rank.contest.name;
          h.contestTime = rank.contest.startTime;
          u.ratingHistories.push(h);
        }
      }
      ratingCalculator.calculate();
      for (const u of ratingCalculator.users) {
        u.ratingHistories.at(-1).rating = u.rating;
      }
    }
  }
  generateTeamId(t) {
    const persons = t.members;
    if (persons.length > 0) {
      return persons.map((person) => person.name.getOrDefault().trim()).sort().join("|");
    }
    return `${t.organizationName ?? ""}-${t.name}`;
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name.toI18NStringSet(),
      baseRating: this.baseRating,
      contestIDs: this.contestIDs,
      users: this.users.map((ratingUser) => ratingUser.toJSON())
    };
  }
  static fromJSON(iRating) {
    if (typeof iRating === "string") {
      iRating = JSON.parse(iRating);
    }
    const rating = new Rating();
    rating.id = iRating.id;
    rating.name = I18nText.fromIText(iRating.name);
    rating.baseRating = iRating.baseRating;
    rating.contestIDs = iRating.contestIDs;
    for (const iUser of iRating.users) {
      rating.users.push(RatingUser.fromJSON(iUser));
    }
    return rating;
  }
}

var RatingLevel = /* @__PURE__ */ ((RatingLevel2) => {
  RatingLevel2["NEWBIE"] = "NEWBIE";
  RatingLevel2["PUPIL"] = "PUPIL";
  RatingLevel2["SPECIALIST"] = "SPECIALIST";
  RatingLevel2["EXPERT"] = "EXPERT";
  RatingLevel2["CANDIDATE_MASTER"] = "CANDIDATE_MASTER";
  RatingLevel2["MASTER"] = "MASTER";
  RatingLevel2["INTERNATIONAL_MASTER"] = "INTERNATIONAL_MASTER";
  RatingLevel2["GRANDMASTER"] = "GRANDMASTER";
  RatingLevel2["INTERNATIONAL_GRANDMASTER"] = "INTERNATIONAL_GRANDMASTER";
  RatingLevel2["LEGENDARY_GRANDMASTER"] = "LEGENDARY_GRANDMASTER";
  return RatingLevel2;
})(RatingLevel || {});
const RatingLevelToString = {
  ["NEWBIE" /* NEWBIE */]: "Newbie",
  ["PUPIL" /* PUPIL */]: "Pupil",
  ["SPECIALIST" /* SPECIALIST */]: "Specialist",
  ["EXPERT" /* EXPERT */]: "Expert",
  ["CANDIDATE_MASTER" /* CANDIDATE_MASTER */]: "Candidate Master",
  ["MASTER" /* MASTER */]: "Master",
  ["INTERNATIONAL_MASTER" /* INTERNATIONAL_MASTER */]: "International Master",
  ["GRANDMASTER" /* GRANDMASTER */]: "Grandmaster",
  ["INTERNATIONAL_GRANDMASTER" /* INTERNATIONAL_GRANDMASTER */]: "International Grandmaster",
  ["LEGENDARY_GRANDMASTER" /* LEGENDARY_GRANDMASTER */]: "Legendary Grandmaster"
};
class RatingUtility {
  static getRatingLevel(rating) {
    if (rating >= 3e3) {
      return "LEGENDARY_GRANDMASTER" /* LEGENDARY_GRANDMASTER */;
    } else if (rating >= 2600) {
      return "INTERNATIONAL_GRANDMASTER" /* INTERNATIONAL_GRANDMASTER */;
    } else if (rating >= 2400) {
      return "GRANDMASTER" /* GRANDMASTER */;
    } else if (rating >= 2300) {
      return "INTERNATIONAL_MASTER" /* INTERNATIONAL_MASTER */;
    } else if (rating >= 2100) {
      return "MASTER" /* MASTER */;
    } else if (rating >= 1900) {
      return "CANDIDATE_MASTER" /* CANDIDATE_MASTER */;
    } else if (rating >= 1600) {
      return "EXPERT" /* EXPERT */;
    } else if (rating >= 1400) {
      return "SPECIALIST" /* SPECIALIST */;
    } else if (rating >= 1200) {
      return "PUPIL" /* PUPIL */;
    }
    return "NEWBIE" /* NEWBIE */;
  }
  static getRatingLevelClass(ratingLevel) {
    if (typeof ratingLevel === "number") {
      return this.getRatingLevelClass(this.getRatingLevel(ratingLevel));
    }
    switch (ratingLevel) {
      case "NEWBIE" /* NEWBIE */:
        return "user-gray";
      case "PUPIL" /* PUPIL */:
        return "user-green";
      case "SPECIALIST" /* SPECIALIST */:
        return "user-cyan";
      case "EXPERT" /* EXPERT */:
        return "user-blue";
      case "CANDIDATE_MASTER" /* CANDIDATE_MASTER */:
        return "user-violet";
      case "MASTER" /* MASTER */:
        return "user-orange";
      case "INTERNATIONAL_MASTER" /* INTERNATIONAL_MASTER */:
        return "user-orange";
      case "GRANDMASTER" /* GRANDMASTER */:
        return "user-red";
      case "INTERNATIONAL_GRANDMASTER" /* INTERNATIONAL_GRANDMASTER */:
        return "user-red";
      case "LEGENDARY_GRANDMASTER" /* LEGENDARY_GRANDMASTER */:
        return "user-legendary";
    }
  }
}

class ResolverOperation {
  id;
  team;
  problemIx;
  beforeTeamProblemStatistics;
  afterTeamProblemStatistics;
  constructor() {
    this.id = 0;
    this.team = new Team();
    this.problemIx = 0;
    this.beforeTeamProblemStatistics = new TeamProblemStatistics();
    this.afterTeamProblemStatistics = new TeamProblemStatistics();
  }
}

class Resolver extends Rank {
  finalRank;
  operations;
  beforeFreezeSubmissions;
  afterFreezeSubmissions;
  constructor(contest, teams, submissions) {
    submissions.sort(Submission.compare);
    let beforeFreezeSubmissions = submissions;
    let afterFreezeSubmissions = submissions;
    {
      let unFreezeDurationTimestamp = contest.unFreezeDurationTimestamp;
      if (contest.options.submissionTimestampUnit === "millisecond") {
        unFreezeDurationTimestamp *= 1e3;
      }
      if (contest.options.submissionTimestampUnit === "microsecond") {
        unFreezeDurationTimestamp *= 1e6;
      }
      if (contest.options.submissionTimestampUnit === "nanosecond") {
        unFreezeDurationTimestamp *= 1e9;
      }
      const ix = ___default.sortedIndex(
        submissions.map((s) => s.timestamp),
        unFreezeDurationTimestamp
      );
      beforeFreezeSubmissions = submissions.slice(0, ix + 1);
      afterFreezeSubmissions = submissions.slice(ix, -1);
    }
    super(contest, teams, beforeFreezeSubmissions);
    this.finalRank = new Rank(contest, teams, submissions);
    this.operations = [];
    this.beforeFreezeSubmissions = beforeFreezeSubmissions;
    this.afterFreezeSubmissions = afterFreezeSubmissions;
  }
  buildResolver() {
    this.buildRank();
    this.finalRank.buildRank();
    this.teams.forEach((t) => t.rank = t.originalRank);
    this.finalRank.teams.forEach((t) => t.rank = t.originalRank);
    for (const s of this.afterFreezeSubmissions) {
      const teamId = s.teamId;
      const problemId = s.problemId;
      const team = this.teamsMap.get(teamId);
      const problem = this.contest.problemsMap.get(problemId);
      if (team === void 0 || problem === void 0) {
        continue;
      }
      const problemStatistics = team.problemStatisticsMap.get(problemId);
      problemStatistics.pendingCount++;
      problemStatistics.totalCount++;
      if (!problemStatistics.isAccepted) {
        problemStatistics.lastSubmitTimestamp = s.timestamp;
      }
    }
    {
      const teams_ = ___default.cloneDeep(this.teams);
      for (let i = this.teams.length - 1; i >= 0; ) {
        const team = teams_[i];
        const teamId = team.id;
        let handleCnt = 0;
        let problemIx = -1;
        for (const p of team.problemStatistics) {
          problemIx++;
          if (!p.isPending) {
            continue;
          }
          handleCnt++;
          const beforeTeamProblemStatistics = this.teamsMap.get(teamId)?.problemStatistics[problemIx];
          const afterTeamProblemStatistics = this.finalRank.teamsMap.get(teamId)?.problemStatistics[problemIx];
          const op = new ResolverOperation();
          op.id = this.operations.length;
          op.team = this.teamsMap.get(teamId);
          op.problemIx = problemIx;
          op.beforeTeamProblemStatistics = beforeTeamProblemStatistics;
          op.afterTeamProblemStatistics = afterTeamProblemStatistics;
          this.operations.push(op);
          team.problemStatistics[problemIx] = afterTeamProblemStatistics;
          team.calcSolvedData(this.contest.options);
          break;
        }
        {
          let j = i;
          while (j > 0 && Team.compare(teams_[j], teams_[j - 1]) < 0) {
            [teams_[j], teams_[j - 1]] = [teams_[j - 1], teams_[j]];
            j--;
          }
        }
        if (handleCnt === 0) {
          i--;
        }
      }
    }
  }
}

class ResolverVue extends Resolver {
  FLASHING_TIME_MS = 100;
  ROLLING_TIME_MS = 600;
  maxIndex;
  currentIndex;
  maxOpIndex;
  currentOpIndex;
  oldRank;
  newRank;
  currentTeamId;
  currentProblemIndex;
  problemFlashingEnded;
  duringAnimation;
  startScrollUp;
  startScrollDown;
  constructor(contest, teams, submissions) {
    super(contest, teams, submissions);
    this.maxIndex = 0;
    this.currentIndex = 0;
    this.maxOpIndex = 0;
    this.currentOpIndex = 0;
    this.oldRank = -1;
    this.newRank = -1;
    this.currentTeamId = "";
    this.currentProblemIndex = -1;
    this.problemFlashingEnded = true;
    this.duringAnimation = false;
    this.startScrollUp = false;
    this.startScrollDown = false;
  }
  buildResolver() {
    super.buildResolver();
    this.maxIndex = this.teams.length - 1;
    this.currentIndex = this.maxIndex;
    this.maxOpIndex = this.operations.length - 1;
    this.currentOpIndex = 0;
    this.oldRank = -1;
    this.newRank = -1;
    this.currentTeamId = "";
    this.currentProblemIndex = -1;
    this.problemFlashingEnded = true;
    this.duringAnimation = false;
    this.startScrollUp = false;
    this.startScrollDown = false;
  }
  next() {
    if (this.duringAnimation) {
      return;
    }
    if (this.currentOpIndex > this.maxOpIndex) {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
      return;
    }
    const op = this.operations[this.currentOpIndex];
    const pIx = op.problemIx;
    const teamId = op.team.id;
    const team = this.teamsMap.get(teamId);
    const currentRank = team.rank;
    if (this.currentIndex + 1 > currentRank) {
      this.currentIndex--;
      return;
    }
    if (this.currentIndex + 1 !== currentRank) {
      return;
    }
    team.problemStatistics[pIx] = op.afterTeamProblemStatistics;
    team.calcSolvedData(this.contest.options);
    this.currentProblemIndex = pIx;
    this.currentTeamId = teamId;
    {
      this.oldRank = team.rank;
      this.newRank = this.oldRank;
      for (let j = this.currentIndex - 1; j >= 0; j--) {
        if (Team.compare(team, this.teams[j]) < 0) {
          this.newRank = this.teams[j].rank;
        } else {
          break;
        }
      }
    }
    this.currentOpIndex++;
    {
      let j = this.oldRank - 1;
      while (j >= 0 && Team.compare(this.teams[j], this.teams[j - 1]) < 0) {
        [this.teams[j], this.teams[j - 1]] = [this.teams[j - 1], this.teams[j]];
        this.teams[j].rank = j + 1;
        this.teams[j - 1].rank = j;
        j--;
      }
    }
  }
  rewind() {
    if (this.duringAnimation) {
      return;
    }
    if (this.currentOpIndex < 1) {
      return;
    }
    this.currentOpIndex--;
    const op = this.operations[this.currentOpIndex];
    const pIx = op.problemIx;
    const teamId = op.team.id;
    const team = this.teamsMap.get(teamId);
    team.problemStatistics[pIx] = op.beforeTeamProblemStatistics;
    team.calcSolvedData(this.contest.options);
    this.currentProblemIndex = pIx;
    this.currentTeamId = teamId;
    {
      this.oldRank = team.rank;
      this.newRank = this.oldRank;
      for (let j = this.currentIndex + 1; j <= this.maxIndex; j++) {
        if (Team.compare(team, this.teams[j]) > 0) {
          this.newRank = this.teams[j].rank;
        } else {
          break;
        }
      }
    }
    {
      let j = this.oldRank - 1;
      let newIndex = j;
      while (j < this.maxIndex && Team.compare(this.teams[j], this.teams[j + 1]) > 0) {
        [this.teams[j], this.teams[j + 1]] = [this.teams[j + 1], this.teams[j]];
        this.teams[j].rank = j + 1;
        this.teams[j + 1].rank = j + 2;
        newIndex = j + 1;
        j++;
      }
      this.currentIndex = newIndex;
    }
  }
}

exports.dayjs = dayjs__default;
exports.Award = Award;
exports.Balloon = Balloon;
exports.BattleOfGiants = BattleOfGiants;
exports.CodeforcesGymGhostDATConverter = CodeforcesGymGhostDATConverter;
exports.Contest = Contest;
exports.ContestIndex = ContestIndex;
exports.ContestIndexConfig = ContestIndexConfig;
exports.ContestOptions = ContestOptions;
exports.GeneralExcelConverter = GeneralExcelConverter;
exports.Giants = Giants;
exports.GiantsType = GiantsType;
exports.I18nText = I18nText;
exports.ICPCStandingsCsvConverter = ICPCStandingsCsvConverter;
exports.MedalType = MedalType;
exports.Organization = Organization;
exports.Person = Person;
exports.PlaceChartPointData = PlaceChartPointData;
exports.Problem = Problem;
exports.ProblemStatistics = ProblemStatistics;
exports.Rank = Rank;
exports.RankOptions = RankOptions;
exports.RankStatistics = RankStatistics;
exports.Rating = Rating;
exports.RatingCalculator = RatingCalculator;
exports.RatingHistory = RatingHistory;
exports.RatingLevel = RatingLevel;
exports.RatingLevelToString = RatingLevelToString;
exports.RatingUser = RatingUser;
exports.RatingUtility = RatingUtility;
exports.Resolver = Resolver;
exports.ResolverVue = ResolverVue;
exports.SeatMap = SeatMap;
exports.SeatMapSection = SeatMapSection;
exports.Submission = Submission;
exports.Team = Team;
exports.TeamProblemStatistics = TeamProblemStatistics;
exports.calcDirt = calcDirt;
exports.createContest = createContest;
exports.createContestIndex = createContestIndex;
exports.createContestIndexList = createContestIndexList;
exports.createDayJS = createDayJS;
exports.createOrganization = createOrganization;
exports.createOrganizations = createOrganizations;
exports.createPersons = createPersons;
exports.createProblem = createProblem;
exports.createProblems = createProblems;
exports.createProblemsByProblemIds = createProblemsByProblemIds;
exports.createSeatMap = createSeatMap;
exports.createSeatMapSection = createSeatMapSection;
exports.createSubmission = createSubmission;
exports.createSubmissions = createSubmissions;
exports.createTeam = createTeam;
exports.createTeams = createTeams;
exports.getImageSource = getImageSource;
exports.getTimeDiff = getTimeDiff;
exports.getTimestamp = getTimestamp;
exports.getWhiteOrBlackColor = getWhiteOrBlackColor;
exports.getWhiteOrBlackColorV1 = getWhiteOrBlackColorV1;
exports.isAccepted = isAccepted;
exports.isNotCalculatedPenaltyStatus = isNotCalculatedPenaltyStatus;
exports.isPending = isPending;
exports.isRejected = isRejected;
exports.isValidMedalType = isValidMedalType;
exports.normalizePath = normalizePath;
exports.stringToSubmissionStatus = stringToSubmissionStatus;
