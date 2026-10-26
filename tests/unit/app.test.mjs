import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const appJs = fs.readFileSync(path.join(root, "homepage/js/app.js"), "utf8");
const projects = JSON.parse(
  fs.readFileSync(path.join(root, "homepage/projects.json"), "utf8")
);

function loadHomepage() {
  const document = {
    readyState: "complete",
    getElementById() {
      return null;
    },
    addEventListener() {},
  };
  const window = { Homepage: undefined, localStorage: memoryStorage() };
  window.document = document;
  const context = { window, document };
  vm.createContext(context);
  vm.runInContext(appJs, context);
  return context.window.Homepage;
}

function memoryStorage() {
  const map = new Map();
  return {
    getItem(k) {
      return map.has(k) ? map.get(k) : null;
    },
    setItem(k, v) {
      map.set(k, String(v));
    },
  };
}

test("projects.json lists known sibling apps with real hosts", () => {
  assert.ok(Array.isArray(projects));
  assert.ok(projects.length >= 3);
  const byId = Object.fromEntries(projects.map((p) => [p.id, p]));
  assert.equal(byId["block-drop"].production, "https://blockdrop.7oas7er.com");
  assert.equal(byId["block-drop"].staging, "https://blockdrop-stg.7oas7er.com");
  assert.equal(byId.dressme.production, "https://dressme.7oas7er.com");
  assert.equal(byId.netrunner.production, "https://netrunner.7oas7er.com");
});

test("Homepage.renderProjects emits name, description, and env links", () => {
  const Homepage = loadHomepage();
  const html = Homepage.renderProjects([
    {
      id: "demo",
      name: "Demo <App>",
      description: "A & B",
      production: "https://example.com",
      staging: "https://stg.example.com",
    },
  ]);
  assert.match(html, /Demo &lt;App&gt;/);
  assert.match(html, /A &amp; B/);
  assert.match(html, /href="https:\/\/example.com"/);
  assert.match(html, /href="https:\/\/stg\.example\.com"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, />production</);
  assert.match(html, />staging</);
  assert.match(html, /<font face="Verdana/);
  assert.match(html, /bgcolor="#eeeeee"/);
});

test("Homepage.bumpVisitorCounter increments local storage", () => {
  const Homepage = loadHomepage();
  const store = memoryStorage();
  assert.equal(Homepage.bumpVisitorCounter(store), "000001");
  assert.equal(Homepage.bumpVisitorCounter(store), "000002");
});
