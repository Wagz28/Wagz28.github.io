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

// IntersectionObserver for clean “which section am I in?”
const io = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if(visible) setActive(visible.target.id);
}, { rootMargin: "-35% 0px -55% 0px", threshold: [0.12, 0.22, 0.35] });

sections.forEach(sec => io.observe(sec));

// click: keep it snappy and still smooth
orbs.forEach(a => {
  a.addEventListener("click", () => {
    setActive(a.dataset.section);
  });
});

if(sections[0]) setActive(sections[0].id);


// Cursor Orb ---------------------------


const orb = document.querySelector(".cursor-orb");

let mouseX = 0;
let mouseY = 0;
let orbX = 0;
let orbY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animate(){
  // easing factor (lower = more delay)
  const speed = 0.2;

  orbX += (mouseX - orbX) * speed;
  orbY += (mouseY - orbY) * speed;

  orb.style.left = orbX + "px";
  orb.style.top = orbY + "px";

  requestAnimationFrame(animate);
}

animate();

/* Slight enlarge on links */
document.querySelectorAll("a, button").forEach(el => {
  el.addEventListener("mouseenter", () => {
    orb.style.width = "46px";
    orb.style.height = "46px";
    orb.style.border = "1px solid rgba(45,58,140,0.5)";
  });

  el.addEventListener("mouseleave", () => {
    orb.style.width = "28px";
    orb.style.height = "28px";
    orb.style.border = "1px solid rgba(0,0,0,0.25)";
  });
});

//  ----------------------------------------
// Download Double Check

const donwloadbtn = document.getElementById("download-btn");
const warning = document.getElementById("download-warning");

if (donwloadbtn && warning) {
  donwloadbtn.addEventListener("click", () => {
    warning.classList.toggle("hidden");
  });
}


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


const disclaimerBtn = document.getElementById("download-btn");
const disclaimerBox = document.getElementById("download-warning");
const form = document.getElementById("download-form");
const submitBtn = document.getElementById("download-submit-btn");
const note = document.getElementById("download-note");

const APK_URL = "/downloads/simplify-android-v1.0.8.apk";
const APK_VERSION = "v1.0.8";
const APK_SHA256 = "E8777914D7C6EC22C280FE4B1353156C8271898A6057ED96C27B597C86E6E649";

disclaimerBtn.addEventListener("click", () => {
  disclaimerBox.classList.toggle("hidden");
});

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
    note.textContent = "Thank you. Preparing download...";
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

function openDownloadModal() {
  const existing = document.getElementById("download-modal-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "download-modal-overlay";
  overlay.className = "download-modal-overlay";

  overlay.innerHTML = `
    <div class="download-modal" role="dialog" aria-modal="true" aria-labelledby="download-modal-title">
      <button class="download-modal-close" type="button" aria-label="Close">×</button>

      <h3 id="download-modal-title">Your download is ready</h3>

      <p>
        Thank you. You can now download <strong>Simplify Android ${APK_VERSION}</strong>.
      </p>

      <a class="download-btn" href="${APK_URL}" download>
        Download APK
      </a>

      <div class="checksum-inline modal-checksum">
        <span class="checksum-label">SHA256</span>
        <code>${APK_SHA256}</code>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.classList.add("modal-open");

  const closeBtn = overlay.querySelector(".download-modal-close");

  function closeModal() {
    overlay.remove();
    document.body.classList.remove("modal-open");
  }

  closeBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", function escHandler(e) {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", escHandler);
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const src = params.get("src") || localStorage.getItem("src");

  if (!src) return;

  // store it once if present
  if (params.get("src")) {
    localStorage.setItem("src", params.get("src"));
  }

  const links = document.querySelectorAll("a[href]");

  links.forEach(link => {
    const rawHref = link.getAttribute("href");
    if (!rawHref) return;

    // Skip anchors, mail, tel, JS
    if (
      rawHref.startsWith("#") ||
      rawHref.startsWith("mailto:") ||
      rawHref.startsWith("tel:") ||
      rawHref.startsWith("javascript:")
    ) return;

    const url = new URL(rawHref, window.location.origin);

    // 🔑 KEY LINE: only modify same-origin links
    if (url.origin !== window.location.origin) return;

    if (!url.searchParams.has("src")) {
      url.searchParams.set("src", src);
    }

    link.setAttribute(
      "href",
      url.pathname + url.search + url.hash
    );
  });
});