import { CalculationOfPenalty, TimeUnit, Image, Lang, I18NStringSet, Text, Person as Person$1, Persons as Persons$1, Team as Team$1, Teams as Teams$1, Organization as Organization$1, Organizations as Organizations$1, SeatMapSection as SeatMapSection$1, SeatMap as SeatMap$1, StatusTimeDisplay, MedalPreset, BannerMode, SocialMedia, ContestState, Contest as Contest$1, SubmissionReaction, SubmissionStatus, Submission as Submission$1, Submissions as Submissions$1, BalloonColor, Problem as Problem$1, Problems as Problems$1, ContestIndex as ContestIndex$1, IRatingHistory, IRatingUser, IRating } from '@xcpcio/types';
import dayjs from 'dayjs';
export { default as dayjs } from 'dayjs';
import * as XLSX from 'xlsx-js-style';

declare enum MedalType {
    UNKNOWN = "Unknown",
    GOLD = "Gold",
    SILVER = "Silver",
    BRONZE = "Bronze",
    HONORABLE = "Honorable"
}
declare class Award {
    medalType: MedalType;
    minRank: number;
    maxRank: number;
    constructor();
}
declare function isValidMedalType(medal: MedalType): boolean;
type Awards = Map<string, Award[]>;

declare class ContestOptions {
    enableOrganization: boolean;
    calculationOfPenalty: CalculationOfPenalty;
    submissionTimestampUnit: TimeUnit;
    submissionHasTimeField: boolean;
    submissionHasLanguageField: boolean;
    submissionEnableActionField: boolean;
    submissionHasReactionField: boolean;
    submissionHasExternalUrlField: boolean;
    submissionHasRealtimeReactionStreamField: boolean;
    reactionVideoUrlTemplate?: string;
    submissionExternalUrlTemplate?: string;
    teamPhotoTemplate?: Image;
    teamWebcamStreamUrlTemplate?: string;
    teamScreenStreamUrlTemplate?: string;
    realtimeReactionWebcamStreamUrlTemplate?: string;
    realtimeReactionScreenStreamUrlTemplate?: string;
    disablePendingPage: boolean;
    constructor();
}

interface SelectOptionItem {
    value: string;
    text: string;
}
declare class I18nText {
    texts: Map<Lang, string>;
    fallback?: string;
    fallbackLang?: Lang;
    constructor();
    get(lang: Lang): string | undefined;
    getOrDefault(lang?: Lang): string;
    set(lang: Lang, text: string): void;
    has(lang: Lang): boolean;
    static fromI18NStringSet(stringSet: I18NStringSet): I18nText;
    static fromIText(text: Text): I18nText;
    toI18NStringSet(): I18NStringSet;
    valueOf(): string;
}

declare class Person {
    name: I18nText;
    cfID?: string;
    icpcID?: string;
    constructor(name?: I18nText);
    toIPerson(): Person$1;
    static fromIPerson(iPerson: Person$1): Person;
}
type Persons = Array<Person>;
declare function createPersons(iPersons?: Text | Array<Text> | Persons$1): Persons;

declare class PlaceChartPointData {
    timePoint: number;
    rank: number;
    lastSolvedProblem: Problem | null;
    constructor();
}
declare class Team {
    id: string;
    name: I18nText;
    description?: I18nText;
    organizationId?: string;
    organizationName?: string;
    organization?: Organization;
    isFirstRankOfOrganization: boolean;
    group: Array<string>;
    tag: Array<string>;
    coaches: Persons;
    members: Persons;
    rank: number;
    originalRank: number;
    solvedProblemNum: number;
    attemptedProblemNum: number;
    lastSolvedProblem: Problem | null;
    lastSolvedProblemStatistics: TeamProblemStatistics | null;
    penalty: number;
    problemStatistics: Array<TeamProblemStatistics>;
    problemStatisticsMap: Map<string, TeamProblemStatistics>;
    submissions: Submissions;
    placeChartPoints: Array<PlaceChartPointData>;
    awards: MedalType[];
    badge?: Image;
    missingPhoto: boolean;
    photo?: Image;
    location?: string;
    icpcID?: string;
    ip?: string;
    se: number;
    constructor();
    reset(): void;
    get penaltyToMinute(): number;
    get isUnofficial(): boolean;
    get isGirl(): boolean;
    get isEffectiveTeam(): boolean;
    get dirt(): number;
    membersToString(lang?: Lang): string;
    coachesToString(lang?: Lang): string;
    calcSE(totalTeams: number): number;
    calcSolvedData(options: ContestOptions): void;
    calcAwards(awards?: Award[]): void;
    isEqualRank(otherTeam: Team): boolean;
    postProcessPlaceChartPoints(): void;
    static compare(lhs: Team, rhs: Team): number;
}
type Teams = Array<Team>;
declare function createTeam(teamJSON: Team$1): Team;
declare function createTeams(teamsJSON: Teams$1): Teams;

declare class Organization {
    id: string;
    name: I18nText;
    logo?: Image;
    icpcID?: string;
    teams: Teams;
    rank: number;
    constructor();
    reset(): void;
    static compare(lhs: Organization, rhs: Organization): number;
}
type Organizations = Array<Organization>;
declare function createOrganization(orgJSON: Organization$1): Organization;
declare function createOrganizations(orgsJSON: Organizations$1): Organizations;

declare class SeatMapSection {
    title: I18nText;
    rowLabels: Array<string | null>;
    grid: Array<Array<string | null>>;
    constructor();
}
declare class SeatMap {
    sections: Array<SeatMapSection>;
    constructor();
    /**
     * Build a map from seat IDs (from team.location) to teams
     */
    buildSeatToTeamMap(teams: Teams): Map<string, Team>;
}
declare function createSeatMapSection(sectionJSON: SeatMapSection$1): SeatMapSection;
declare function createSeatMap(seatMapJSON: SeatMap$1): SeatMap;

declare class Group {
    name: I18nText;
    isDefault: boolean;
    constructor();
}

declare function calcDirt(attemptedNum: number, solvedNum: number): number;

declare function getWhiteOrBlackColorV1(background: string): "#000" | "#fff";
declare function getWhiteOrBlackColor(background: string): "#000" | "#fff";

declare function createDayJS(time?: Date | string | number | undefined): dayjs.Dayjs;
declare function getTimestamp(time: number | dayjs.Dayjs): number;
declare function getTimeDiff(seconds: number): string;

declare function normalizePath(path: string): string;

declare class Contest {
    id: string;
    name: I18nText;
    startTime: dayjs.Dayjs;
    endTime: dayjs.Dayjs;
    freezeTime: dayjs.Dayjs;
    replayStartTime?: dayjs.Dayjs;
    replayEndTime?: dayjs.Dayjs;
    replayFreezeTime?: dayjs.Dayjs;
    replayNowTime?: dayjs.Dayjs;
    replayContestStartTimestamp?: number;
    totalDurationTimestamp: number;
    freezeDurationTimestamp: number;
    unFreezeDurationTimestamp: number;
    penalty: number;
    problems: Problems;
    problemsMap: Map<string, Problem>;
    statusTimeDisplay: StatusTimeDisplay;
    medal?: Record<string, Record<string, number>> | MedalPreset;
    awards?: Awards;
    group: Map<string, Group>;
    tag: Map<string, string>;
    logo?: Image;
    banner?: Image;
    bannerMode?: BannerMode;
    boardLink?: string;
    socialMedia?: SocialMedia;
    options: ContestOptions;
    organizations?: Organizations;
    seatMap?: SeatMap;
    constructor();
    getStartTime(): dayjs.Dayjs;
    getEndTime(): dayjs.Dayjs;
    getFreezeTime(): dayjs.Dayjs;
    getContestDuration(timeFormat?: string): string;
    getContestState(nowTime?: Date): ContestState;
    getContestPendingTime(nowTime?: Date): string;
    getContestElapsedTime(nowTime?: Date): string;
    getContestRemainingTime(nowTime?: Date): string;
    getContestProgressRatio(nowTime?: Date): number;
    isEnableAwards(group: string): boolean;
    resetReplayTime(): void;
    setReplayTime(replayStartTimestamp: number): void;
}
declare function createContest(contestJSON: Contest$1): Contest;

declare class Submission {
    id: string;
    teamId: string;
    problemId: string;
    timestamp: number;
    timestampUnit: TimeUnit;
    time?: number;
    language?: string;
    reaction?: SubmissionReaction;
    externalUrl?: string;
    status: SubmissionStatus;
    isIgnore: boolean;
    isSolved: boolean;
    isFirstSolved: boolean;
    constructor();
    isAccepted(): boolean;
    isRejected(): boolean;
    isPending(): boolean;
    isNotCalculatedPenaltyStatus(): boolean;
    get timestampToMinute(): number;
    get timestampToSecond(): number;
    get timestampDisplayFormatWithSecond(): string;
    get timestampDisplayFormatWithMilliSecond(): string;
    static compare(lhs: Submission, rhs: Submission): number;
}
type Submissions = Array<Submission>;
declare function createSubmission(submissionJSON: Submission$1, contest?: Contest): Submission;
declare function createSubmissions(submissionsJSON: Submissions$1, contest?: Contest): Submissions;

declare class ProblemStatistics {
    acceptedNum: number;
    rejectedNum: number;
    pendingNum: number;
    submittedNum: number;
    attemptedNum: number;
    ignoreNum: number;
    firstSolveSubmissions: Submissions;
    lastSolveSubmissions: Submissions;
    se: number;
    constructor();
    reset(): void;
    get dirt(): number;
    calcSE(totalTeams: number): number;
}
declare class Problem {
    id: string;
    label: string;
    name?: I18nText;
    timeLimit?: string;
    memoryLimit?: string;
    balloonColor: BalloonColor;
    statistics: ProblemStatistics;
    constructor();
}
type Problems = Array<Problem>;
declare function createProblem(problemJSON: Problem$1): Problem;
declare function createProblems(problemsJSON: Problems$1): Problems;
declare function createProblemsByProblemIds(problemIds: string[], balloonColors?: BalloonColor[]): Problems;
declare class TeamProblemStatistics {
    isFirstSolved: boolean;
    isSolved: boolean;
    solvedTimestamp: number;
    isSubmitted: boolean;
    lastSubmitTimestamp: number;
    failedCount: number;
    pendingCount: number;
    ignoreCount: number;
    totalCount: number;
    submissions: Submissions;
    problem: Problem;
    contestPenalty: number;
    constructor(options?: {
        teamProblemStatistics?: TeamProblemStatistics;
    });
    get isAccepted(): boolean;
    get isWrongAnswer(): boolean;
    get isPending(): boolean;
    get isUnSubmitted(): boolean;
    get solvedTimestampToMinute(): number;
    get penalty(): number;
    get penaltyToMinute(): number;
    get penaltyInSecond(): number;
}

declare class Balloon {
    problem: Problem;
    team: Team;
    submission: Submission;
    constructor();
    get key(): string;
    static compare(lhs: Balloon, rhs: Balloon): number;
}
type Balloons = Array<Balloon>;

declare enum GiantsType {
    BLUE = 0,
    RED = 1
}
declare class Giants {
    type: GiantsType;
    name: string;
    filterOrganizations: Array<SelectOptionItem>;
    filterOrganizationMap: Map<string, SelectOptionItem>;
    filterTeams: Array<SelectOptionItem>;
    filterTeamMap: Map<string, SelectOptionItem>;
    teams: Array<Team>;
    constructor(type?: GiantsType);
    setFilterOrganizations(filterOrganizations: Array<SelectOptionItem>): void;
    setFilterTeams(filterTeams: Array<SelectOptionItem>): void;
    refreshName(): string;
    get totalSolvedProblemNum(): number;
    get totalPenalty(): number;
    get totalPenaltyToString(): string;
    toJSON(): {
        type: GiantsType;
        name: string;
        filterOrganizations: SelectOptionItem[];
        filterTeams: SelectOptionItem[];
    };
}
declare class BattleOfGiants {
    enable: boolean;
    topX: number;
    equalTeams: boolean;
    persist: boolean;
    blueTeam: Giants;
    redTeam: Giants;
    constructor();
    ToBase64(): string;
    FromBase64(base64: string): void;
}

declare class ContestIndexConfig {
    contestName: I18nText;
    startTime: dayjs.Dayjs;
    endTime: dayjs.Dayjs;
    freezeTime: dayjs.Dayjs;
    totalDurationTimestamp: number;
    freezeDurationTimestamp: number;
    unFreezeDurationTimestamp: number;
    logo?: Image;
    constructor();
}
declare class ContestIndex {
    contest: Contest;
    boardLink: string;
    constructor();
}
type ContestIndexList = Array<ContestIndex>;
declare function createContestIndex(contestIndexJSON: ContestIndex$1): ContestIndex;
declare function createContestIndexList(contestListJSON: any): ContestIndexList;

declare class RankStatistics {
    teamSolvedNum: Array<number>;
    teamSolvedNumIndex: Array<number>;
    maxSolvedProblems: number;
    effectiveTeamNum: number;
    totalTeamNum: number;
    constructor();
    reset(): void;
    getTeamSolvedNumIndex(solvedNum: number): number;
}

declare class RankOptions {
    enableFilterSubmissionsByTimestamp: boolean;
    width: number;
    timestamp: number;
    enableFilterTeamsByGroup: boolean;
    group: string;
    filterOrganizations: Array<SelectOptionItem>;
    filterOrganizationMap: Map<string, SelectOptionItem>;
    filterTeams: Array<SelectOptionItem>;
    filterTeamMap: Map<string, SelectOptionItem>;
    filterTeamIds: Array<SelectOptionItem>;
    filterTeamIdMap: Map<string, SelectOptionItem>;
    enableAnimatedSubmissions: boolean;
    battleOfGiants: BattleOfGiants;
    constructor();
    setSelf(self: RankOptions): void;
    setWidth(width: number, contest: Contest): void;
    disableFilterSubmissionByTimestamp(): void;
    setGroup(group: string): void;
    disableFilterTeamsByGroup(): void;
    setFilterOrganizations(filterOrganizations: Array<SelectOptionItem>): void;
    setFilterTeams(filterTeams: Array<SelectOptionItem>): void;
    setFilterTeamIds(filterTeamIds: Array<SelectOptionItem>): void;
    isNeedReBuildRank(nextRankOptions: RankOptions): boolean;
}
declare class Rank {
    readonly contest: Contest;
    teams: Teams;
    teamsMap: Map<string, Team>;
    submissions: Submissions;
    submissionsMap: Map<string, Submission>;
    organizations: Organizations;
    organizationsMap: Map<string, Organization>;
    originTeams: Teams;
    rankStatistics: RankStatistics;
    options: RankOptions;
    balloons: Balloons;
    languages: Array<string>;
    statuses: Array<SubmissionStatus>;
    constructor(contest: Contest, teams: Teams, submissions: Submissions);
    linkTeamAndOrg(): void;
    buildOrganizationsMap(): Map<string, Organization>;
    cleanRank(): void;
    buildRank(): this;
    buildTeamRank(): void;
    buildOrgRank(): void;
    buildAwards(): void;
    filterTeamByOrg(team: Team): boolean;
    getSubmissions(): Submissions;
    buildBalloons(): void;
    setReplayTime(replayStartTimestamp: number): void;
}
type Ranks = Array<Rank>;

interface Options {
    includeFakeRussianTeams?: boolean;
}
declare class CodeforcesGymGhostDATConverter {
    constructor();
    convert(rank: Rank, options?: Options): string;
    private submissionStatusToCodeforcesGymDatStatus;
}

declare class GeneralExcelConverter {
    lang?: Lang;
    constructor(lang?: Lang);
    convert(oriRank: Rank): XLSX.WorkBook;
    convertAndWrite(rank: Rank, filename: string): any;
    private convertToSheet;
    private convertToAoa;
}

declare class ICPCStandingsCsvConverter {
    constructor();
    convert(oriRank: Rank): string;
    private getMedalCitation;
}

declare function getImageSource(image: Image, data_host?: string): string;

declare class RatingHistory {
    rank: number;
    rating: number;
    teamName: I18nText;
    organization: string;
    members: Persons;
    coaches: Persons;
    contestID: string;
    contestName: I18nText;
    contestLink: string;
    contestTime: dayjs.Dayjs;
    constructor();
    toJSON(): IRatingHistory;
    static fromJSON(iRatingHistory: IRatingHistory | string): RatingHistory;
}
type RatingHistories = Array<RatingHistory>;

declare class RatingUser {
    id: string;
    name: I18nText;
    organization: string;
    members: Persons;
    coaches: Persons;
    rating: number;
    minRating: number;
    maxRating: number;
    rank: number;
    oldRating: number;
    seed: number;
    delta: number;
    ratingHistories: RatingHistories;
    constructor();
    UpdateRating(rating: number): void;
    toJSON(): IRatingUser;
    static fromJSON(iRatingUser: IRatingUser | string): RatingUser;
}
type RatingUsers = Array<RatingUser>;
type RatingUserMap = Map<string, RatingUser>;

declare class Rating {
    id: string;
    name: I18nText;
    baseRating: number;
    contestIDs: string[];
    users: RatingUsers;
    ranks: Ranks;
    userMap: RatingUserMap;
    constructor();
    buildRating(): void;
    generateTeamId(t: Team): string;
    toJSON(): IRating;
    static fromJSON(iRating: IRating | string): Rating;
}

declare class RatingCalculator {
    users: RatingUsers;
    constructor();
    calculate(): void;
    private calcP;
    private getExSeed;
    private calcRating;
    private calculateInternal;
}

declare enum RatingLevel {
    NEWBIE = "NEWBIE",
    PUPIL = "PUPIL",
    SPECIALIST = "SPECIALIST",
    EXPERT = "EXPERT",
    CANDIDATE_MASTER = "CANDIDATE_MASTER",
    MASTER = "MASTER",
    INTERNATIONAL_MASTER = "INTERNATIONAL_MASTER",
    GRANDMASTER = "GRANDMASTER",
    INTERNATIONAL_GRANDMASTER = "INTERNATIONAL_GRANDMASTER",
    LEGENDARY_GRANDMASTER = "LEGENDARY_GRANDMASTER"
}
declare const RatingLevelToString: {
    [key in RatingLevel]: string;
};
declare class RatingUtility {
    static getRatingLevel(rating: number): RatingLevel;
    static getRatingLevelClass(ratingLevel: RatingLevel | number): string;
}

declare class ResolverOperation {
    id: number;
    team: Team;
    problemIx: number;
    beforeTeamProblemStatistics: TeamProblemStatistics;
    afterTeamProblemStatistics: TeamProblemStatistics;
    constructor();
}

declare class Resolver extends Rank {
    finalRank: Rank;
    operations: Array<ResolverOperation>;
    beforeFreezeSubmissions: Submissions;
    afterFreezeSubmissions: Submissions;
    constructor(contest: Contest, teams: Teams, submissions: Submissions);
    buildResolver(): void;
}

declare class ResolverVue extends Resolver {
    readonly FLASHING_TIME_MS = 100;
    readonly ROLLING_TIME_MS = 600;
    maxIndex: number;
    currentIndex: number;
    maxOpIndex: number;
    currentOpIndex: number;
    oldRank: number;
    newRank: number;
    currentTeamId: string;
    currentProblemIndex: number;
    problemFlashingEnded: boolean;
    duringAnimation: boolean;
    startScrollUp: boolean;
    startScrollDown: boolean;
    constructor(contest: Contest, teams: Teams, submissions: Submissions);
    buildResolver(): void;
    next(): void;
    rewind(): void;
}

declare function stringToSubmissionStatus(status: string): SubmissionStatus;
declare function isAccepted(status: SubmissionStatus): boolean;
declare function isRejected(status: SubmissionStatus): boolean;
declare function isPending(status: SubmissionStatus): boolean;
declare function isNotCalculatedPenaltyStatus(status: SubmissionStatus): boolean;

export { Award, Balloon, BattleOfGiants, CodeforcesGymGhostDATConverter, Contest, ContestIndex, ContestIndexConfig, ContestOptions, GeneralExcelConverter, Giants, GiantsType, I18nText, ICPCStandingsCsvConverter, MedalType, Organization, Person, PlaceChartPointData, Problem, ProblemStatistics, Rank, RankOptions, RankStatistics, Rating, RatingCalculator, RatingHistory, RatingLevel, RatingLevelToString, RatingUser, RatingUtility, Resolver, ResolverVue, SeatMap, SeatMapSection, Submission, Team, TeamProblemStatistics, calcDirt, createContest, createContestIndex, createContestIndexList, createDayJS, createOrganization, createOrganizations, createPersons, createProblem, createProblems, createProblemsByProblemIds, createSeatMap, createSeatMapSection, createSubmission, createSubmissions, createTeam, createTeams, getImageSource, getTimeDiff, getTimestamp, getWhiteOrBlackColor, getWhiteOrBlackColorV1, isAccepted, isNotCalculatedPenaltyStatus, isPending, isRejected, isValidMedalType, normalizePath, stringToSubmissionStatus };
export type { Awards, Balloons, ContestIndexList, Options, Organizations, Persons, Problems, Ranks, RatingHistories, RatingUserMap, RatingUsers, SelectOptionItem, Submissions, Teams };
