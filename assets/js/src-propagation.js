(function () {
  const url = new URL(window.location.href);
  const currentSrc = url.searchParams.get("src") || sessionStorage.getItem("site_src");
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

    if (!target.searchParams.has("src")) {
      target.searchParams.set("src", currentSrc);
      a.href = target.pathname + target.search + target.hash;
    }
  });
})();