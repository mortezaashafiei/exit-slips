/*
 * mortezashafiei.com — progressive enhancement only.
 * The page is fully readable without this file. It never builds HTML from strings
 * (no innerHTML / eval), so it runs under the site's Trusted Types CSP.
 */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  root.classList.add("js");

  var reduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Email addresses: kept out of the HTML source to frustrate address harvesters. */
  function wireEmails() {
    var nodes = doc.querySelectorAll("[data-u][data-d]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var user = el.getAttribute("data-u");
      var domain = el.getAttribute("data-d");
      if (!/^[A-Za-z0-9._%+-]+$/.test(user) || !/^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(domain)) {
        continue;
      }
      var address = user + "@" + domain;
      if (el.tagName === "A") {
        el.setAttribute("href", "mailto:" + address);
      }
      if (!el.hasAttribute("data-keep-label")) {
        el.textContent = address;
      }
    }
  }

  /* 2. Mobile navigation. */
  function wireNav() {
    var toggle = doc.querySelector(".menu-toggle");
    var nav = doc.getElementById("site-nav");
    if (!toggle || !nav) return;
    toggle.hidden = false;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("is-open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest && event.target.closest("a")) setOpen(false);
    });

    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    var wide = window.matchMedia("(min-width: 1100px)");
    var onChange = function () {
      if (wide.matches) setOpen(false);
    };
    if (wide.addEventListener) wide.addEventListener("change", onChange);
  }

  /* 3. Highlight the section currently in view. */
  function wireScrollSpy() {
    if (!("IntersectionObserver" in window)) return;
    var links = doc.querySelectorAll('.site-nav a[href^="#"]');
    var map = {};
    var sections = [];
    for (var i = 0; i < links.length; i++) {
      var id = links[i].getAttribute("href").slice(1);
      var section = id && doc.getElementById(id);
      if (section) {
        map[id] = links[i];
        sections.push(section);
      }
    }
    if (!sections.length) return;

    var current = null;
    var observer = new IntersectionObserver(
      function (entries) {
        for (var j = 0; j < entries.length; j++) {
          if (entries[j].isIntersecting) {
            var link = map[entries[j].target.id];
            if (current && current !== link) current.removeAttribute("aria-current");
            if (link) {
              link.setAttribute("aria-current", "true");
              current = link;
            }
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      observer.observe(s);
    });
  }

  /* 4. Animate figures once they scroll into view. */
  function wireFigures() {
    var figures = doc.querySelectorAll("[data-animate]");
    if (!figures.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      for (var i = 0; i < figures.length; i++) figures[i].classList.add("is-visible");
      return;
    }
    var observer = new IntersectionObserver(
      function (entries, obs) {
        for (var j = 0; j < entries.length; j++) {
          if (entries[j].isIntersecting) {
            entries[j].target.classList.add("is-visible");
            obs.unobserve(entries[j].target);
          }
        }
      },
      { threshold: 0.35 }
    );
    for (var k = 0; k < figures.length; k++) observer.observe(figures[k]);
  }

  /* 5. "Copy BibTeX" buttons. */
  function wireCopy() {
    if (!navigator.clipboard || !window.isSecureContext) return;
    var buttons = doc.querySelectorAll("[data-copy]");
    for (var i = 0; i < buttons.length; i++) {
      (function (btn) {
        var source = doc.getElementById(btn.getAttribute("data-copy"));
        if (!source) return;
        var label = btn.textContent;
        btn.hidden = false;
        btn.addEventListener("click", function () {
          navigator.clipboard.writeText(source.textContent.trim()).then(
            function () {
              btn.textContent = "Copied";
              setTimeout(function () {
                btn.textContent = label;
              }, 1800);
            },
            function () {
              btn.textContent = "Select & copy";
            }
          );
        });
      })(buttons[i]);
    }
  }

  /* 6. Light / dark theme. Light is the default; a visitor's choice is kept in their own browser only. */
  function wireTheme() {
    var button = doc.querySelector(".theme-toggle");
    if (!button) return;
    var metaTheme = doc.querySelector('meta[name="theme-color"]');

    function isDark() {
      return root.getAttribute("data-theme") === "dark";
    }

    function sync() {
      var dark = isDark();
      button.setAttribute("aria-pressed", dark ? "true" : "false");
      if (metaTheme) metaTheme.setAttribute("content", dark ? "#0a111d" : "#fbfcfe");
    }

    button.hidden = false;
    button.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      if (next === "dark") {
        root.setAttribute("data-theme", "dark");
      } else {
        root.removeAttribute("data-theme");
      }
      try {
        window.localStorage.setItem("theme", next);
      } catch (e) {
        /* storage unavailable (private mode, blocked): the choice simply is not remembered */
      }
      sync();
    });
    sync();
  }

  /* 7. Print button on the CV page. */
  function wirePrint() {
    var buttons = doc.querySelectorAll("[data-print]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].hidden = false;
      buttons[i].addEventListener("click", function () {
        window.print();
      });
    }
  }

  function init() {
    wireEmails();
    wireNav();
    wireScrollSpy();
    wireFigures();
    wireCopy();
    wireTheme();
    wirePrint();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
