const FINAL_SURVEY_URL = "https://tally.so/r/1ApgJW";

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);

  let participantId =
    params.get("participant_id") || sessionStorage.getItem("participant_id");

  let condition =
    params.get("condition") || sessionStorage.getItem("condition") || "1";

  if (!participantId) {
    if (crypto.randomUUID) {
      participantId = crypto.randomUUID();
    } else {
      participantId =
        "test_" + Date.now() + "_" + Math.random().toString(36).substring(2);
    }
  }

  sessionStorage.setItem("participant_id", participantId);
  sessionStorage.setItem("condition", condition);

  if (!sessionStorage.getItem("site_start_ts")) {
    sessionStorage.setItem("site_start_ts", new Date().toISOString());
    sessionStorage.setItem("site_start_ms", Date.now().toString());
  }

  const endEvaluationElements = Array.from(
    document.querySelectorAll("a, button")
  ).filter(function (el) {
    return el.textContent.trim().toLowerCase().includes("end evaluation");
  });

  endEvaluationElements.forEach(function (el) {
    el.addEventListener("click", function (event) {
      event.preventDefault();

      const siteEnd = new Date();
      const siteStartMs = Number(sessionStorage.getItem("site_start_ms"));
      const siteDurationSec = Math.round((Date.now() - siteStartMs) / 1000);

      const finalSurveyUrl = new URL(FINAL_SURVEY_URL);

      finalSurveyUrl.searchParams.set(
        "participant_id",
        sessionStorage.getItem("participant_id")
      );

      finalSurveyUrl.searchParams.set(
        "condition",
        sessionStorage.getItem("condition")
      );

      finalSurveyUrl.searchParams.set(
        "site_start_ts",
        sessionStorage.getItem("site_start_ts")
      );

      finalSurveyUrl.searchParams.set(
        "site_end_ts",
        siteEnd.toISOString()
      );

      finalSurveyUrl.searchParams.set(
        "site_duration_sec",
        siteDurationSec
      );

      finalSurveyUrl.searchParams.set(
        "final_survey_start_ts",
        new Date().toISOString()
      );

      window.location.href = finalSurveyUrl.toString();
    });
  });
});
