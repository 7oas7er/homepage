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
      .map(function (p) {
        var name = escapeHtml(p.name || p.id || "Untitled");
        var desc = escapeHtml(p.description || "");
        var prod = p.production ? String(p.production) : "";
        var stg = p.staging ? String(p.staging) : "";
        var links = [];
        if (prod) {
          links.push(
            '<a href="' +
              escapeHtml(prod) +
              '" rel="noopener noreferrer">production</a>'
          );
        }
        if (stg) {
          links.push(
            '<a href="' +
              escapeHtml(stg) +
              '" rel="noopener noreferrer">staging</a>'
          );
        }
        return (
          "<tr>" +
          '<td class="name">' +
          name +
          "</td>" +
          '<td class="desc">' +
          desc +
          "</td>" +
          '<td class="links">' +
          (links.join(" ") || "—") +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  };

  window.Homepage.boot = function boot() {
    var counterEl = document.getElementById("visitor-counter");
    if (counterEl) {
      counterEl.textContent = window.Homepage.bumpVisitorCounter();
    }

    var body = document.getElementById("projects-body");
    if (!body) {
      return;
    }

    fetch("projects.json?v=1")
      .then(function (res) {
        if (!res.ok) {
          throw new Error("HTTP " + res.status);
        }
        return res.json();
      })
      .then(function (projects) {
        body.innerHTML = window.Homepage.renderProjects(projects);
      })
      .catch(function () {
        body.innerHTML =
          '<tr><td colspan="3" class="error">Could not load projects.json</td></tr>';
      });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.Homepage.boot);
  } else {
    window.Homepage.boot();
  }
})();
