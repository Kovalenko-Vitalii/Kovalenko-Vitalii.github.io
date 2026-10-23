const projects = [
  { title: "MediAlert", kind: "IoT and cloud", img: "",
    summary: "A Raspberry Pi medication reminder with its own Azure telemetry pipeline.",
    detail: "An IoT medication reminder and monitoring system on a Raspberry Pi. Reminders, sensor polling and connectivity run on three separate threads, so a slow network call can’t block a time-critical alert. Telemetry flows through Azure IoT Hub, Stream Analytics and Power BI, with retry logic and local logging so device state survives restarts and failed cloud sends. Debugging it surfaced two real data-integrity bugs, including a temperature sensor silently reporting Fahrenheit while the rest of the pipeline assumed Celsius.",
    stack: "Python, Raspberry Pi, Azure IoT Hub, Power BI",
    links: [["Source", "https://github.com/Kovalenko-Vitalii/MediAlert"]] },
  { title: "NOMO", kind: "Game development", img: "",
    summary: "A Unity survival game built around an event-driven architecture.",
    detail: "Built to learn the full game development pipeline end to end, not just gameplay but the architecture underneath it. Systems communicate through events rather than direct references, so player state, inventory, quests, status effects and AI can be extended or swapped without touching unrelated code. That same decoupling made it possible to add a slot-based save system that serialises the entire world state without every system needing to know how saving works.",
    stack: "C#, Unity",
    links: [["Source", "https://github.com/Kovalenko-Vitalii/FinalYearProject"]] },
  { title: "Lost &amp; Found", kind: "Mobile", img: "",
    summary: "An Android app for reporting and finding lost property.",
    detail: "Users sign in with Google through Firebase Authentication, browse reported items, and add their own, with a Room database handling local storage alongside Firebase. Built on MVVM: Compose screens own the UI, view models hold state and logic, and a repository layer sits between them and Room and Firebase so neither has to know about the other directly.",
    stack: "Kotlin, Jetpack Compose, MVVM, Room, Firebase",
    links: [["Source", "https://github.com/Kovalenko-Vitalii/LostFound"]] },
  { title: "Modular Gameplay Framework", kind: "Tooling, in progress", img: "",
    summary: "Reusable Unity modules for state, UI and saving.",
    detail: "A set of plug-and-play Unity modules (state management, UI, save and load) built to be dropped into any new project instead of rebuilt from scratch each time. The focus is reusability: each module is self-contained and configurable, so it works for whatever a future project needs rather than one game’s specific rules. Still in progress.",
    stack: "C#, Unity, Raycast",
    links: [["Source, in development", "https://github.com/Kovalenko-Vitalii/Modular-Gameplay-Framework"]] }
];

const $ = (s) => document.querySelector(s);
// Give a project an "img" path (e.g. "image/medialert.jpg") and it replaces the blank frame.
const pic = (src, label, cls = "") => src
  ? `<img class="pic ${cls}" src="${src}" alt="${label}">`
  : `<div class="frame ${cls}"><span>${label}</span></div>`;

/* Carousel */
const track = $("#track"), bar = $("#bar"), count = $("#count");
track.innerHTML = projects.map((p, i) => `
  <li class="card">
    ${pic(p.img, "Screenshot")}
    <p class="kind">${p.kind}</p>
    <h3><button type="button" class="open" data-i="${i}">${p.title}</button></h3>
    <p>${p.summary}</p>
  </li>`).join("");

const step = () => track.children[1].offsetLeft - track.children[0].offsetLeft;
const sync = () => {
  const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  const i = end ? projects.length - 1 : Math.round(track.scrollLeft / step());
  count.textContent = `${i + 1} of ${projects.length}`;
  bar.style.width = ((i + 1) / projects.length * 100) + "%";
  $("#left").disabled = track.scrollLeft < 2;
  $("#right").disabled = end;
};
$("#left").onclick = () => track.scrollBy({ left: -step(), behavior: "smooth" });
$("#right").onclick = () => track.scrollBy({ left: step(), behavior: "smooth" });
track.addEventListener("scroll", sync, { passive: true });
addEventListener("resize", sync);
sync();

/* Project page */
const view = $("#view"), body = $("#vbody");
let cur = 0;
const show = (i) => {
  cur = (i + projects.length) % projects.length;
  const p = projects[cur];
  body.innerHTML = `
    <p class="kind">${p.kind}</p>
    <h2 class="vtitle">${p.title}</h2>
    <div class="shots">
      ${pic(p.img, "Main image", "wide")}
      ${pic("", "Image")}
      ${pic("", "Image")}
    </div>
    <div class="two vtext">
      <p>${p.detail}</p>
      <div><p class="kind">Built with</p><p>${p.stack}</p>
      <p>${p.links.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`).join("<br>")}</p></div>
    </div>`;
  view.scrollTop = 0;
};
track.addEventListener("click", (e) => {
  const b = e.target.closest(".open");
  if (!b) return;
  show(+b.dataset.i);
  view.showModal();
});
$("#vclose").onclick = () => view.close();
$("#vprev").onclick = () => show(cur - 1);
$("#vnext").onclick = () => show(cur + 1);
view.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") show(cur - 1);
  if (e.key === "ArrowRight") show(cur + 1);
});

/* Current section in the nav */
const links = [...document.querySelectorAll(".bar nav a")];
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    links.forEach((a) => a.toggleAttribute("aria-current", a.hash === "#" + en.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));