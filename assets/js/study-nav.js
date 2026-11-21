// Study pages: contents drawer (button toggle + smooth scroll), and in-text
// "#heading" links open the cross-reference <details> in that section.
(function () {
  var nv = document.getElementById("nv"), nb = document.getElementById("nb");
  if (!nv || !nb) return;

  nb.addEventListener("click", function (e) {
    e.stopPropagation();
    nv.classList.toggle("open");
  });
  document.addEventListener("click", function (e) {
    if (!nv.contains(e.target)) nv.classList.remove("open");
  });

  nv.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var id = a.getAttribute("href").slice(1);
      var t = id == "top" ? document.body : document.getElementById(id);
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
      nv.classList.remove("open");
    });
  });

  document.querySelectorAll('.study-body a[href^="#"]').forEach(function (a) {
    if (nv.contains(a)) return;
    a.addEventListener("click", function (e) {
      var t = document.getElementById(a.getAttribute("href").slice(1));
      if (!t) return;
      e.preventDefault();
      for (var n = t.nextElementSibling; n && !/^H[1-3]$/.test(n.tagName); n = n.nextElementSibling) {
        if (n.matches("details.xr")) n.open = true;
        if (n.querySelectorAll) n.querySelectorAll("details.xr").forEach(function (d) { d.open = true; });
      }
      t.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
