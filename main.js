const orbs = Array.from(document.querySelectorAll(".orb"));
const halo = document.querySelector(".orb-halo");
const sections = orbs
  .map(a => document.getElementById(a.getAttribute("href").slice(1)))
  .filter(Boolean);

function setActive(id){
  orbs.forEach(a => a.classList.toggle("active", a.dataset.section === id));

  const active = orbs.find(a => a.dataset.section === id);
  if(!active) return;

  // Move halo to active orb with a slight lag (handled by CSS transition)
  const navRect = active.parentElement.getBoundingClientRect();
  const orbRect = active.getBoundingClientRect();
  const x = orbRect.left - navRect.left;
  const y = orbRect.top - navRect.top;
  halo.style.transform = `translate(${x - 8}px, ${y - 8}px)`;
}

// Scroll tracking: active = last section whose top has passed 40% of the viewport.
// (The old IntersectionObserver used per-section ratios, so tall sections such as
// Experience and Projects never crossed the threshold.)
let lastId = null;
function track(){
  const line = window.innerHeight * 0.4;
  let id = sections[0] && sections[0].id;
  for (const sec of sections) {
    if (sec.getBoundingClientRect().top <= line) id = sec.id;
  }
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (atBottom && sections.length) id = sections[sections.length - 1].id;
  if (id && id !== lastId) { lastId = id; setActive(id); }
}
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; track(); }); }
}, { passive: true });
window.addEventListener("resize", track);

// click: keep it snappy and still smooth
orbs.forEach(a => {
  a.addEventListener("click", () => {
    lastId = a.dataset.section;
    setActive(a.dataset.section);
  });
});

track();


// Cursor Orb: moved to assets/js/cursor-orb.js (shared by all pages)


// ------------------------------------------
// Laptop Slideshow

const laptopImages = [
  "assets/simplify-laptop-shot-0.png",
  "assets/simplify-laptop-shot-1.png",
  // "assets/simplify-laptop-shot-2.png",
  // "assets/simplify-laptop-shot-3.png",
  // I need to remember to add here when adding more!!!
];

const slideshow = document.getElementById("laptop-slideshow");

if (slideshow && laptopImages.length > 0) {
  laptopImages.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = "laptop-slide";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Simplify laptop screenshot ${i + 1}`;
    img.loading = i === 0 ? "eager" : "lazy";

    slide.appendChild(img);
    slideshow.appendChild(slide);
  });

  let currentIndex = 0;

  function showSlide(index) {
    slideshow.style.transform = `translateX(-${index * 100}%)`;
  }

  if (laptopImages.length > 1) {
    setInterval(() => {
      currentIndex = (currentIndex + 1) % laptopImages.length;
      showSlide(currentIndex);
    }, 9100);
  }
}

// -------------------------
// Downloading APK

const disclaimerBtn = document.getElementById("download-btn");
const disclaimerBox = document.getElementById("download-warning");
const form = document.getElementById("download-form");
const submitBtn = document.getElementById("download-submit-btn");
const note = document.getElementById("download-note");

const APK_URL = "/downloads/simplify-android-v1.0.8.apk";
const APK_VERSION = "v1.0.8";
const APK_SHA256 = "E8777914D7C6EC22C280FE4B1353156C8271898A6057ED96C27B597C86E6E649";

if (disclaimerBtn && disclaimerBox) {
  disclaimerBtn.addEventListener("click", () => {
    disclaimerBox.classList.toggle("hidden");
  });
}

if (form && submitBtn && note) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    note.textContent = "Submitting...";
    note.classList.remove("download-error");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      form.reset();
      note.textContent = "Thanks. Your request has been submitted.";
      submitBtn.textContent = "Sent";

      setTimeout(() => {
        openDownloadModal();
        submitBtn.disabled = false;
        submitBtn.textContent = "Email me the APK";
        note.textContent = "You can submit another email if needed.";
      }, 1800);

    } catch (err) {
      note.textContent = "Something went wrong. Please try again.";
      note.classList.add("download-error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Email me the APK";
    }
  });
}

// --------------------