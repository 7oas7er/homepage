(function () {
  "use strict";

  window.Homepage = window.Homepage || {};

  var COUNTER_KEY = "homepage-visitor-count";

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function padCounter(n) {
    var s = String(Math.max(0, n | 0));
    while (s.length < 6) {
      s = "0" + s;
    }
    return s;
  }

  function externalLink(href, label) {
    return (
      '<a href="' +
      escapeHtml(href) +
      '" target="_blank" rel="noopener noreferrer">' +
      escapeHtml(label) +
      "</a>"
    );
  }

  window.Homepage.bumpVisitorCounter = function bumpVisitorCounter(storage) {
    var store = storage || window.localStorage;
    var next = 1;
    try {
      var prev = parseInt(store.getItem(COUNTER_KEY) || "0", 10);
      if (!isNaN(prev) && prev >= 0) {
        next = prev + 1;
      }
      store.setItem(COUNTER_KEY, String(next));
    } catch (err) {
      next = 1;
    }
    return padCounter(next);
  };

  window.Homepage.renderProjects = function renderProjects(projects) {
    if (!Array.isArray(projects)) {
      throw new Error("projects must be an array");
    }
    return projects
      .map(function (p, index) {
        var name = escapeHtml(p.name || p.id || "Untitled");
        var desc = escapeHtml(p.description || "");
        var links = [];
        if (p.production) {
          links.push(externalLink(String(p.production), "production"));
        }
        if (p.staging) {
          links.push(externalLink(String(p.staging), "staging"));
        }
        if (p.repository) {
          links.push(externalLink(String(p.repository), "repository"));
        }
        var sep = index === 0 ? "" : '<hr width="60%" size="1" noshade>\n';
        return (
          sep +
          "<h2>" +
          '<font face="Times New Roman, Times, serif">' +
          name +
          "</font>" +
          "</h2>\n" +
          "<p>" +
          '<font face="Verdana, Arial, Helvetica, sans-serif" size="2">' +
          desc +
          "</font>" +
          "</p>\n" +
          "<p>" +
          '<font face="Courier New, Courier, monospace" size="2">' +
          (links.join(" &nbsp;|&nbsp; ") || "&mdash;") +
          "</font>" +
          "</p>"
        );
      })
      .join("\n");
  };

  window.Homepage.boot = function boot() {
    var counterEl = document.getElementById("visitor-counter");
    if (counterEl) {
      counterEl.textContent = window.Homepage.bumpVisitorCounter();
    }

    var root = document.getElementById("projects");
    if (!root) {
      return;
    }

    fetch("projects.json?v=3")
      .then(function (res) {
        if (!res.ok) {
          throw new Error("HTTP " + res.status);
        }
        return res.json();
      })
      .then(function (projects) {
        root.innerHTML = window.Homepage.renderProjects(projects);
      })
      .catch(function () {
        root.innerHTML =
          '<p><font face="Verdana, Arial, Helvetica, sans-serif" size="2" color="#990000">Could not load projects.json</font></p>';
      });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.Homepage.boot);
  } else {
    window.Homepage.boot();
  }
})();
