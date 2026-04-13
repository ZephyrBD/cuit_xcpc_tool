/**
 * ISO8601 String.
 * @example
 * '2019-01-01T00:00:00Z'
 * '2019-01-01T08:00:00+08:00'
 * '2019-01-01T00:00:00.000Z'
 */
type DateTimeISO8601String = string;
type Lang = "en" | "zh-CN";
/**
 * Color HEX.
 * @example
 * '#FFFFFF'
 */
type ColorHEX = string;
/**
 * Color RGB.
 * @example
 * 'rgb(255, 255, 255)'
 */
type ColorRGB = string;
/**
 * Color RGBA.
 * @example
 * 'rgba(255, 255, 255, 0.75)'
 */
type ColorRGBA = string;
/** General color format. */
type Color = ColorHEX | ColorRGB | ColorRGBA;
type ThemeColor = Color | {
    light: Color;
    dark: Color;
};
interface Style {
    /**
     * Text color.
     * @defaultValue Determined by renderer.
     */
    text_color?: ThemeColor;
    /**
     * Background color.
     * @defaultValue Determined by renderer.
     */
    background_color?: ThemeColor;
}
interface BalloonColor {
    color: Color;
    background_color: Color;
}
/**
 * i18n string set.
 * @example
 * { "en": 'English', "zh-CN": '中文', fallback: 'English' }
 * { "en": 'English', "zh-CN": '中文', fallback_lang: 'en' }
 */
interface I18NStringSet {
    /**
     * The fallback string if renderer cannot determine the language to use.
     */
    fallback?: string;
    /**
     * The fallback language to use if the requested language is not available.
     */
    fallback_lang?: Lang;
    /**
     * Language-specific text mappings.
     */
    texts?: Partial<Record<Lang, string>>;
}
/**
 * Text (i18n supported).
 */
type Text = string | I18NStringSet;
/**
 * Contributor field. The email and url are optional.
 * @example
 * 'bLue <mail@example.com> (https://example.com/)'
 */
type Contributor = string;
type Base64 = string;
type LinkString = string;
type UrlString = string;
type ImagePreset = "ICPC" | "CCPC" | "HUNAN_CPC";
interface Link {
    link: LinkString;
    title?: string;
}
interface Image {
    url?: string;
    mime?: string;
    base64?: Base64;
    type?: "png" | "svg" | "jpg" | "jpeg";
    width?: number;
    height?: number;
    preset?: ImagePreset;
}
interface StatusTimeDisplay {
    correct: boolean;
    incorrect: boolean;
    pending: boolean;
}
type TimeUnit = "second" | "millisecond" | "microsecond" | "nanosecond";
interface DataItem {
    url: UrlString;
    version?: string;
}
interface Organization {
    id: string;
    name: Text;
    logo?: Image;
    icpc_id?: string;
}
type Organizations = Array<Organization>;

interface Problem {
    id: string;
    label: string;
    name?: Text;
    time_limit?: string;
    memory_limit?: string;
    balloon_color?: BalloonColor;
}
type Problems = Array<Problem>;

interface SeatMapSection {
    title?: Text;
    rowLabels?: Array<string | null>;
    grid: Array<Array<string | null>>;
}
interface SeatMap {
    sections: Array<SeatMapSection>;
}

declare enum ContestState {
    PENDING = "PENDING",
    RUNNING = "RUNNING",
    FROZEN = "FROZEN",
    FINISHED = "FINISHED",
    PAUSED = "PAUSED"
}
type CalculationOfPenalty = "in_minutes" | "in_seconds" | "accumulate_in_seconds_and_finally_to_the_minute";
interface ContestOptions {
    enable_organization?: boolean;
    calculation_of_penalty?: CalculationOfPenalty;
    submission_timestamp_unit?: TimeUnit;
    has_reaction_videos?: boolean;
    reaction_video_url_template?: string;
    team_photo_url_template?: Image;
    team_webcam_stream_url_template?: string;
    team_screen_stream_url_template?: string;
    submission_external_url_template?: string;
    submission_source_code_url_template?: string;
    realtime_reaction_webcam_stream_url_template?: string;
    realtime_reaction_screen_stream_url_template?: string;
    disable_pending_page?: boolean;
}
type MedalPreset = "ccpc" | "icpc";
type BannerMode = "ONLY_BANNER" | "ALL";
interface SocialMedia {
    bilibili?: string;
    youtube?: string;
}
interface Contest {
    contest_name: Text;
    description?: Text;
    og_image?: Image;
    start_time: number | DateTimeISO8601String;
    end_time: number | DateTimeISO8601String;
    penalty: number;
    freeze_time?: number | DateTimeISO8601String;
    frozen_time?: number;
    problems?: Array<Problem>;
    problem_id?: Array<string>;
    balloon_color?: Array<BalloonColor>;
    status_time_display?: StatusTimeDisplay;
    medal?: Record<string, Record<string, number>> | MedalPreset;
    group?: Record<string, string>;
    tag?: Record<string, string>;
    logo?: Image;
    banner?: Image;
    banner_mode?: BannerMode;
    options?: ContestOptions;
    organizations?: DataItem | Organizations;
    seat_map?: DataItem | SeatMap;
    board_link?: string;
    version?: string;
    social_media?: SocialMedia;
}

interface ContestIndexConfig {
    contest_name: Text;
    start_time: number;
    end_time: number;
    frozen_time: number;
    logo: Image;
}
interface ContestIndex {
    config: ContestIndexConfig;
    board_link: string;
}

interface Person {
    name: Text;
    cf_id?: string;
    icpc_id?: string;
}
type Persons = Array<Person>;

interface IRatingIndex {
    id: string;
    name: string;
}
interface IRatingHistory {
    rank: number;
    rating: number;
    teamName: Text;
    organization: string;
    members: Persons;
    coaches: Persons;
    contestID: string;
    contestName: Text;
    contestLink: string;
    contestTime: Date;
}
interface IRatingUser {
    id: string;
    name: Text;
    organization: string;
    members: Persons;
    coaches: Persons;
    rating: number;
    minRating: number;
    maxRating: number;
    ratingHistories: IRatingHistory[];
}
interface IRating {
    id: string;
    name: Text;
    baseRating: number;
    contestIDs: string[];
    users: IRatingUser[];
}

declare enum SubmissionStatus {
    PENDING = "PENDING",
    WAITING = "WAITING",
    PREPARING = "PREPARING",
    COMPILING = "COMPILING",
    RUNNING = "RUNNING",
    JUDGING = "JUDGING",
    FROZEN = "FROZEN",
    ACCEPTED = "ACCEPTED",
    CORRECT = "CORRECT",
    PARTIALLY_CORRECT = "PARTIALLY_CORRECT",
    REJECTED = "REJECTED",
    WRONG_ANSWER = "WRONG_ANSWER",
    NO_OUTPUT = "NO_OUTPUT",
    COMPILATION_ERROR = "COMPILATION_ERROR",
    PRESENTATION_ERROR = "PRESENTATION_ERROR",
    RUNTIME_ERROR = "RUNTIME_ERROR",
    TIME_LIMIT_EXCEEDED = "TIME_LIMIT_EXCEEDED",
    MEMORY_LIMIT_EXCEEDED = "MEMORY_LIMIT_EXCEEDED",
    OUTPUT_LIMIT_EXCEEDED = "OUTPUT_LIMIT_EXCEEDED",
    IDLENESS_LIMIT_EXCEEDED = "IDLENESS_LIMIT_EXCEEDED",
    HACKED = "HACKED",
    JUDGEMENT_FAILED = "JUDGEMENT_FAILED",
    CONFIGURATION_ERROR = "CONFIGURATION_ERROR",
    FILE_ERROR = "FILE_ERROR",
    SYSTEM_ERROR = "SYSTEM_ERROR",
    CANCELED = "CANCELED",
    SKIPPED = "SKIPPED",
    SECURITY_VIOLATED = "SECURITY_VIOLATED",
    DENIAL_OF_JUDGEMENT = "DENIAL_OF_JUDGEMENT",
    UNKNOWN = "UNKNOWN",
    UNDEFINED = "UNDEFINED"
}
declare const SubmissionStatusToString: {
    [key in SubmissionStatus]: string;
};
declare const SubmissionStatusToSimpleString: {
    [key in SubmissionStatus]: string;
};

interface SubmissionReaction {
    url: string;
}
interface Submission {
    id?: string;
    submission_id?: string;
    team_id: string;
    problem_id: number | string;
    timestamp: number;
    status: SubmissionStatus | string;
    time?: number;
    language?: string;
    is_ignore?: boolean;
    reaction?: SubmissionReaction;
    missing_reaction?: boolean;
}
type Submissions = Array<Submission> | Record<string, Submission>;

interface Team {
    id?: string;
    team_id?: string;
    name?: Text;
    team_name?: Text;
    description?: Text;
    organization?: string;
    organization_id?: string;
    group?: Array<string>;
    tag?: Array<string>;
    coach?: Text | Array<Text> | Persons;
    coaches?: Text | Array<Text> | Persons;
    members?: Text | Array<Text> | Persons;
    official?: boolean;
    unofficial?: boolean;
    girl?: boolean;
    badge?: Image;
    missing_photo?: boolean;
    photo?: Image;
    location?: string;
    icpc_id?: string;
    ip?: string;
}
type Teams = Array<Team> | Record<string, Team>;

export { ContestState, SubmissionStatus, SubmissionStatusToSimpleString, SubmissionStatusToString };
export type { BalloonColor, BannerMode, Base64, CalculationOfPenalty, Color, ColorHEX, ColorRGB, ColorRGBA, Contest, ContestIndex, ContestIndexConfig, ContestOptions, Contributor, DataItem, DateTimeISO8601String, I18NStringSet, IRating, IRatingHistory, IRatingIndex, IRatingUser, Image, ImagePreset, Lang, Link, LinkString, MedalPreset, Organization, Organizations, Person, Persons, Problem, Problems, SeatMap, SeatMapSection, SocialMedia, StatusTimeDisplay, Style, Submission, SubmissionReaction, Submissions, Team, Teams, Text, ThemeColor, TimeUnit, UrlString };
