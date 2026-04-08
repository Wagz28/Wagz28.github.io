(function () {
  const match = window.location.pathname.match(/^\/s\/([^/]+)/);
  const currentSrc = match ? decodeURIComponent(match[1]) : sessionStorage.getItem("site_src");

  if (!currentSrc) return;

  sessionStorage.setItem("site_src", currentSrc);

  document.addEventListener("click", function (e) {
    const a = e.target.closest("a");
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href) return;

    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:")
    ) return;

    const target = new URL(a.href, window.location.origin);
    if (target.origin !== window.location.origin) return;

    // already tagged
    if (target.pathname.startsWith(`/s/${currentSrc}`)) return;

    const newPath = `/s/${currentSrc}${target.pathname}`;

    a.href = newPath + target.search + target.hash;
  });
})();