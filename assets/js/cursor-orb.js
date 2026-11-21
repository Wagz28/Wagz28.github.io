// Cursor Orb: circle that trails the mouse. Shared by every page.
(function () {
  let orb = document.querySelector(".cursor-orb");
  if (!orb) {
    orb = document.createElement("div");
    orb.className = "cursor-orb";
    document.body.appendChild(orb);
  }

  let mouseX = 0;
  let mouseY = 0;
  let orbX = 0;
  let orbY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    // easing factor (lower = more delay)
    const speed = 0.2;

    orbX += (mouseX - orbX) * speed;
    orbY += (mouseY - orbY) * speed;

    orb.style.left = orbX + "px";
    orb.style.top = orbY + "px";

    requestAnimationFrame(animate);
  }

  animate();

  /* Slight enlarge on links (delegated, so dynamically added links work) */
  const hoverSel = "a, button";

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest && e.target.closest(hoverSel)) {
      orb.style.width = "46px";
      orb.style.height = "46px";
      orb.style.border = "1px solid rgba(45,58,140,0.5)";
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest && e.target.closest(hoverSel)) {
      orb.style.width = "28px";
      orb.style.height = "28px";
      orb.style.border = "1px solid rgba(0,0,0,0.25)";
    }
  });
})();
