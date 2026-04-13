var ContestState = /* @__PURE__ */ ((ContestState2) => {
  ContestState2["PENDING"] = "PENDING";
  ContestState2["RUNNING"] = "RUNNING";
  ContestState2["FROZEN"] = "FROZEN";
  ContestState2["FINISHED"] = "FINISHED";
  ContestState2["PAUSED"] = "PAUSED";
  return ContestState2;
})(ContestState || {});

var SubmissionStatus = /* @__PURE__ */ ((SubmissionStatus2) => {
  SubmissionStatus2["PENDING"] = "PENDING";
  SubmissionStatus2["WAITING"] = "WAITING";
  SubmissionStatus2["PREPARING"] = "PREPARING";
  SubmissionStatus2["COMPILING"] = "COMPILING";
  SubmissionStatus2["RUNNING"] = "RUNNING";
  SubmissionStatus2["JUDGING"] = "JUDGING";
  SubmissionStatus2["FROZEN"] = "FROZEN";
  SubmissionStatus2["ACCEPTED"] = "ACCEPTED";
  SubmissionStatus2["CORRECT"] = "CORRECT";
  SubmissionStatus2["PARTIALLY_CORRECT"] = "PARTIALLY_CORRECT";
  SubmissionStatus2["REJECTED"] = "REJECTED";
  SubmissionStatus2["WRONG_ANSWER"] = "WRONG_ANSWER";
  SubmissionStatus2["NO_OUTPUT"] = "NO_OUTPUT";
  SubmissionStatus2["COMPILATION_ERROR"] = "COMPILATION_ERROR";
  SubmissionStatus2["PRESENTATION_ERROR"] = "PRESENTATION_ERROR";
  SubmissionStatus2["RUNTIME_ERROR"] = "RUNTIME_ERROR";
  SubmissionStatus2["TIME_LIMIT_EXCEEDED"] = "TIME_LIMIT_EXCEEDED";
  SubmissionStatus2["MEMORY_LIMIT_EXCEEDED"] = "MEMORY_LIMIT_EXCEEDED";
  SubmissionStatus2["OUTPUT_LIMIT_EXCEEDED"] = "OUTPUT_LIMIT_EXCEEDED";
  SubmissionStatus2["IDLENESS_LIMIT_EXCEEDED"] = "IDLENESS_LIMIT_EXCEEDED";
  SubmissionStatus2["HACKED"] = "HACKED";
  SubmissionStatus2["JUDGEMENT_FAILED"] = "JUDGEMENT_FAILED";
  SubmissionStatus2["CONFIGURATION_ERROR"] = "CONFIGURATION_ERROR";
  SubmissionStatus2["FILE_ERROR"] = "FILE_ERROR";
  SubmissionStatus2["SYSTEM_ERROR"] = "SYSTEM_ERROR";
  SubmissionStatus2["CANCELED"] = "CANCELED";
  SubmissionStatus2["SKIPPED"] = "SKIPPED";
  SubmissionStatus2["SECURITY_VIOLATED"] = "SECURITY_VIOLATED";
  SubmissionStatus2["DENIAL_OF_JUDGEMENT"] = "DENIAL_OF_JUDGEMENT";
  SubmissionStatus2["UNKNOWN"] = "UNKNOWN";
  SubmissionStatus2["UNDEFINED"] = "UNDEFINED";
  return SubmissionStatus2;
})(SubmissionStatus || {});
const SubmissionStatusToString = {
  ["PENDING" /* PENDING */]: "Pending",
  ["WAITING" /* WAITING */]: "Waiting",
  ["PREPARING" /* PREPARING */]: "Preparing",
  ["COMPILING" /* COMPILING */]: "Compiling",
  ["RUNNING" /* RUNNING */]: "Running",
  ["JUDGING" /* JUDGING */]: "Judging",
  ["FROZEN" /* FROZEN */]: "Frozen",
  ["ACCEPTED" /* ACCEPTED */]: "Accepted",
  ["CORRECT" /* CORRECT */]: "Correct",
  ["PARTIALLY_CORRECT" /* PARTIALLY_CORRECT */]: "Partially Correct",
  ["REJECTED" /* REJECTED */]: "Rejected",
  ["WRONG_ANSWER" /* WRONG_ANSWER */]: "Wrong Answer",
  ["NO_OUTPUT" /* NO_OUTPUT */]: "No Output",
  ["COMPILATION_ERROR" /* COMPILATION_ERROR */]: "Compilation Error",
  ["PRESENTATION_ERROR" /* PRESENTATION_ERROR */]: "Presentation Error",
  ["RUNTIME_ERROR" /* RUNTIME_ERROR */]: "Runtime Error",
  ["TIME_LIMIT_EXCEEDED" /* TIME_LIMIT_EXCEEDED */]: "Time Limit Exceeded",
  ["MEMORY_LIMIT_EXCEEDED" /* MEMORY_LIMIT_EXCEEDED */]: "Memory Limit Exceeded",
  ["OUTPUT_LIMIT_EXCEEDED" /* OUTPUT_LIMIT_EXCEEDED */]: "Output Limit Exceeded",
  ["IDLENESS_LIMIT_EXCEEDED" /* IDLENESS_LIMIT_EXCEEDED */]: "Idleness Limit Exceeded",
  ["HACKED" /* HACKED */]: "Hacked",
  ["JUDGEMENT_FAILED" /* JUDGEMENT_FAILED */]: "Judgement Failed",
  ["CONFIGURATION_ERROR" /* CONFIGURATION_ERROR */]: "Configuration Error",
  ["FILE_ERROR" /* FILE_ERROR */]: "File Error",
  ["SYSTEM_ERROR" /* SYSTEM_ERROR */]: "System Error",
  ["CANCELED" /* CANCELED */]: "Canceled",
  ["SKIPPED" /* SKIPPED */]: "Skipped",
  ["SECURITY_VIOLATED" /* SECURITY_VIOLATED */]: "Security Violated",
  ["DENIAL_OF_JUDGEMENT" /* DENIAL_OF_JUDGEMENT */]: "Denial Of Judgement",
  ["UNKNOWN" /* UNKNOWN */]: "Unknown",
  ["UNDEFINED" /* UNDEFINED */]: "Undefined"
};
const SubmissionStatusToSimpleString = {
  ["PENDING" /* PENDING */]: "PD",
  ["WAITING" /* WAITING */]: "PD",
  ["PREPARING" /* PREPARING */]: "PD",
  ["COMPILING" /* COMPILING */]: "PD",
  ["RUNNING" /* RUNNING */]: "PD",
  ["JUDGING" /* JUDGING */]: "PD",
  ["FROZEN" /* FROZEN */]: "?",
  ["ACCEPTED" /* ACCEPTED */]: "AC",
  ["CORRECT" /* CORRECT */]: "AC",
  ["PARTIALLY_CORRECT" /* PARTIALLY_CORRECT */]: "RJ",
  ["REJECTED" /* REJECTED */]: "RJ",
  ["WRONG_ANSWER" /* WRONG_ANSWER */]: "WA",
  ["NO_OUTPUT" /* NO_OUTPUT */]: "NO",
  ["COMPILATION_ERROR" /* COMPILATION_ERROR */]: "CE",
  ["PRESENTATION_ERROR" /* PRESENTATION_ERROR */]: "PE",
  ["RUNTIME_ERROR" /* RUNTIME_ERROR */]: "RTE",
  ["TIME_LIMIT_EXCEEDED" /* TIME_LIMIT_EXCEEDED */]: "TLE",
  ["MEMORY_LIMIT_EXCEEDED" /* MEMORY_LIMIT_EXCEEDED */]: "MLE",
  ["OUTPUT_LIMIT_EXCEEDED" /* OUTPUT_LIMIT_EXCEEDED */]: "OLE",
  ["IDLENESS_LIMIT_EXCEEDED" /* IDLENESS_LIMIT_EXCEEDED */]: "ILE",
  ["HACKED" /* HACKED */]: "RJ",
  ["JUDGEMENT_FAILED" /* JUDGEMENT_FAILED */]: "RJ",
  ["CONFIGURATION_ERROR" /* CONFIGURATION_ERROR */]: "RJ",
  ["FILE_ERROR" /* FILE_ERROR */]: "RJ",
  ["SYSTEM_ERROR" /* SYSTEM_ERROR */]: "RJ",
  ["CANCELED" /* CANCELED */]: "RJ",
  ["SKIPPED" /* SKIPPED */]: "RJ",
  ["SECURITY_VIOLATED" /* SECURITY_VIOLATED */]: "RJ",
  ["DENIAL_OF_JUDGEMENT" /* DENIAL_OF_JUDGEMENT */]: "RJ",
  ["UNKNOWN" /* UNKNOWN */]: "RJ",
  ["UNDEFINED" /* UNDEFINED */]: "RJ"
};

export { ContestState, SubmissionStatus, SubmissionStatusToSimpleString, SubmissionStatusToString };
