(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.getElementById("siteHeader");
  var toggle = document.getElementById("navToggle");
  var navLinks = document.querySelectorAll(".nav-links a[data-section]");

  /* Smooth in-page navigation */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = this.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      if (header && header.classList.contains("nav-open")) {
        header.classList.remove("nav-open");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* Header scroll state */
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* Mobile menu */
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = !header.classList.contains("nav-open");
      header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* Scroll spy */
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute("data-section");
    var section = document.getElementById(id);
    if (section) sections.push({ id: id, el: section, link: link });
  });

  function updateScrollSpy() {
    var scrollPos = window.scrollY + header.offsetHeight + 80;
    var current = sections[0];

    sections.forEach(function (item) {
      if (item.el.offsetTop <= scrollPos) current = item;
    });

    navLinks.forEach(function (link) {
      link.classList.remove("is-active");
    });

    if (current && current.link) {
      current.link.classList.add("is-active");
    }
  }

  window.addEventListener("scroll", updateScrollSpy, { passive: true });
  updateScrollSpy();

  /* Fade-in-up on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduced) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });

    /* Hero: show immediately */
    requestAnimationFrame(function () {
      document.querySelectorAll("#hero .reveal").forEach(function (el) {
        el.classList.add("is-visible");
      });
    });
  }
})();
