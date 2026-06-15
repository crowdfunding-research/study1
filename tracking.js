const FINAL_SURVEY_URL = "https://tally.so/r/1ApgJW";
const DEFAULT_CONDITION = "1";

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);

  let participantId =
    params.get("participant_id") || sessionStorage.getItem("participant_id");

  let condition =
    params.get("condition") ||
    sessionStorage.getItem("condition") ||
    DEFAULT_CONDITION;

  if (!participantId) {
    if (window.crypto && crypto.randomUUID) {
      participantId = crypto.randomUUID();
    } else {
      participantId =
        "test_" + Date.now() + "_" + Math.random().toString(36).substring(2);
    }
  }

  const studyFolder =
    window.location.pathname.split("/").filter(Boolean)[0] || "unknown_study";

  const currentSessionKey =
    studyFolder + "_" + participantId + "_" + condition;

  const previousSessionKey = sessionStorage.getItem("study_session_key");

  if (previousSessionKey !== currentSessionKey) {
    sessionStorage.setItem("study_session_key", currentSessionKey);
    sessionStorage.setItem("participant_id", participantId);
    sessionStorage.setItem("condition", condition);
    sessionStorage.setItem("site_start_ts", new Date().toISOString());
    sessionStorage.setItem("site_start_ms", Date.now().toString());
  } else {
    sessionStorage.setItem("participant_id", participantId);
    sessionStorage.setItem("condition", condition);

    if (!sessionStorage.getItem("site_start_ts")) {
      sessionStorage.setItem("site_start_ts", new Date().toISOString());
      sessionStorage.setItem("site_start_ms", Date.now().toString());
    }
  }

  function goToFinalSurvey(event) {
    if (event) event.preventDefault();

    const siteEnd = new Date();
    const siteStartMs =
      Number(sessionStorage.getItem("site_start_ms")) || Date.now();

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

    finalSurveyUrl.searchParams.set("site_end_ts", siteEnd.toISOString());
    finalSurveyUrl.searchParams.set("site_duration_sec", siteDurationSec);
    finalSurveyUrl.searchParams.set(
      "final_survey_start_ts",
      new Date().toISOString()
    );

    window.location.href = finalSurveyUrl.toString();
  }

  const endEvaluationElements = Array.from(
    document.querySelectorAll("#endEvaluation, a, button")
  ).filter(function (el) {
    return (
      el.id === "endEvaluation" ||
      el.textContent.trim().toLowerCase().includes("end evaluation")
    );
  });

  endEvaluationElements.forEach(function (el) {
    el.addEventListener("click", goToFinalSurvey);
  });

  if (!document.getElementById("end-evaluation-fixed-style")) {
    const style = document.createElement("style");
    style.id = "end-evaluation-fixed-style";
    style.textContent = `
      #end-evaluation-fixed {
        position: fixed !important;
        right: 16px !important;
        bottom: calc(16px + env(safe-area-inset-bottom)) !important;
        z-index: 2147483647 !important;

        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;

        padding: 9px 13px !important;
        min-height: 38px !important;

        background: #05ce78 !important;
        color: white !important;

        font-size: 14px !important;
        font-weight: 700 !important;
        line-height: 1.2 !important;

        border-radius: 999px !important;
        border: none !important;
        text-decoration: none !important;
        text-align: center !important;

        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25) !important;
        cursor: pointer !important;
      }

      @media (max-width: 480px) {
        #end-evaluation-fixed {
          right: 12px !important;
          bottom: calc(12px + env(safe-area-inset-bottom)) !important;
          font-size: 13px !important;
          padding: 8px 12px !important;
          min-height: 36px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  if (!document.getElementById("end-evaluation-fixed")) {
    const fixedButton = document.createElement("a");
    fixedButton.id = "end-evaluation-fixed";
    fixedButton.href = FINAL_SURVEY_URL;
    fixedButton.textContent = "End evaluation";
    fixedButton.addEventListener("click", goToFinalSurvey);

    document.body.appendChild(fixedButton);
  }
});