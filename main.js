document.addEventListener("DOMContentLoaded", () => {
  console.log("CommBridge WebApp Ready ✅");

  // === Speech-to-Text ===
  let recognition;
  const startSpeech = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join("");
      document.querySelector("#speechOutput").innerText = transcript;
    };
    recognition.start();
  };
  const stopSpeech = () => recognition?.stop();
  document.querySelector("#startSpeechBtn")?.addEventListener("click", startSpeech);
  document.querySelector("#stopSpeechBtn")?.addEventListener("click", stopSpeech);

  // === Translation ===
  document.querySelector("#translateBtn")?.addEventListener("click", () => {
    const text = document.querySelector("#translateInput").value.trim();
    const lang = document.querySelector("#targetLang").value;
    if (!text) return;
    document.querySelector("#translateOutput").innerText = `[${lang.toUpperCase()}] ${text}`;
    updateAnalytics("translationsCount");
  });

  // === Sign-to-Text ===
  document.querySelector("#processSignBtn")?.addEventListener("click", () => {
    document.querySelector("#signOutput").innerText = "Sign video processed (mock).";
    updateAnalytics("signsProcessed");
  });
  document.querySelector("#signUpload")?.addEventListener("change", () => {
    document.querySelector("#signOutput").innerText = "Video uploaded. Ready to process.";
  });

  // === Analytics Counter ===
  function updateAnalytics(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = (parseInt(el.textContent) || 0) + 1;
  }

  // === Chart.js Analytics ===
  const ctx = document.getElementById("userChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{
        label: "Active Users",
        data: [120, 150, 200, 180, 230, 270, 310],
        borderColor: "#1E40AF",
        backgroundColor: "rgba(30,64,175,0.1)",
        fill: true,
        tension: 0.4
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
});
