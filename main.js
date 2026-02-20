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