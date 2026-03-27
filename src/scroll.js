const sections = document.querySelectorAll(".section");
const dots = document.querySelectorAll(".dot");
// const progressFill = document.getElementById("page-progress-fill");
// const sectionCounter = document.getElementById("section-counter");
// const progressColors = ["#c8ff00", "#7dd3fc", "#fca5a5", "#a78bfa"];

function updateActiveSection(index) {
  sections.forEach((s, i) => s.classList.toggle("active", i === index));
  dots.forEach((d, i) => d.classList.toggle("active", i === index));

//   const pct = ((index + 1) / sections.length) * 100;
//   progressFill.style.width = pct + "%";
//   progressFill.style.background = progressColors[index];
//   sectionCounter.textContent = String(index + 1).padStart(2, "0");
//   sectionCounter.style.color = progressColors[index];
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = [...sections].indexOf(entry.target);
        updateActiveSection(index);
        if(index === 2) {
          const dialog = document.querySelector("el-dialog");
          if (!dialog.hasAttribute("open")) {
            dialog.setAttribute("open", 1)
          }
        }
      }
    });
  },
  { threshold: 0.6 }
);

sections.forEach((s) => observer.observe(s));

// Click dots to scroll
const container = document.getElementById("scroll-container");
dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const idx = parseInt(dot.dataset.index);
    sections[idx].scrollIntoView({ behavior: "smooth" });
  });
});

document.getElementById("get-started-button").addEventListener("click", () => {
    sections[1].scrollIntoView({ behavior: "smooth" });
});

document.getElementById("info-button").addEventListener("click", () => {
    sections[2].scrollIntoView({ behavior: "smooth" });
});

document.getElementById("usage-button").addEventListener("click", () => {
    sections[3].scrollIntoView({ behavior: "smooth" });
});


// Init first section
updateActiveSection(0);
