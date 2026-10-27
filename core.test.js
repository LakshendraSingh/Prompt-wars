// Runs the real app script in a sandbox with a stubbed DOM, so tests cover the shipped code.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const file = ["index.html", "fairshift.html"]
  .map((f) => path.join(__dirname, "..", f))
  .find(fs.existsSync);
const src = fs.readFileSync(file, "utf8").match(/<script>([\s\S]*)<\/script>/)[1];

function load() {
  const handlers = {}, els = {};
  const get = (s) => els[s] || (els[s] = { innerHTML: "", value: "", checked: false, textContent: "", focus() {} });
  const ctx = {
    document: { querySelector: get, addEventListener: (t, f) => { handlers[t] = f; }, documentElement: {}, activeElement: null },
    setTimeout: () => 0,
    alert() {},
  };
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  const click = (id) => handlers.click({ target: { closest: () => ({ id, dataset: {} }) } });
  return { ctx, get, click };
}
const near = (a, b) => assert.ok(Math.abs(a - b) < 0.01, `${a} is not close to ${b}`);

test("payslip: construction worker is calculated correctly", () => {
  const { ctx } = load();
  const p = ctx.pay(ctx.D.c);
  near(p.reg, 17280);
  near(p.otp, 2970);
  near(p.g, 21750);
  near(p.pf, 2073.6);
  near(p.esi, 163.125);
  near(p.net, 19513.275);
});

test("payslip: net pay equals gross minus deductions for both industries", () => {
  const { ctx } = load();
  for (const k of ["c", "u"]) {
    const p = ctx.pay(ctx.D[k]);
    near(p.net, p.g - p.pf - p.esi);
  }
});

test("fatigue: weekly hours and rest-day streak", () => {
  const { ctx } = load();
  assert.equal(ctx.sum(ctx.D.c.wk), 73);
  assert.equal(ctx.streak(ctx.D.c.wk), 7);
  assert.equal(ctx.streak(ctx.D.u.wk), 0);
  assert.equal(ctx.streak([0, 0, 5, 5]), 2);
});

test("leave risk score follows the documented rules", () => {
  const { ctx } = load();
  assert.equal(ctx.risk(["Murugan S", 73, 96, 2, 7]), 75);
  assert.equal(ctx.risk(["Selvi P", 48, 97, 4, 3]), 0);
  assert.equal(ctx.risk(["Imran A", 58, 79, 2, 3]), 55);
});

test("esc neutralises HTML and quote characters", () => {
  const { ctx } = load();
  const out = ctx.esc(`<img src=x onerror="a('b')">`);
  assert.ok(!/[<>"']/.test(out));
});

test("clean strips control characters, collapses spaces and caps length", () => {
  const { ctx } = load();
  assert.equal(ctx.clean("  Gas \u0000 leak\n\n near  gate "), "Gas leak near gate");
  assert.equal(ctx.clean("a".repeat(2000)).length, 500);
  assert.equal(ctx.clean(null), "");
});

test("rate limit allows 5 submissions per minute, then blocks", () => {
  const { ctx } = load();
  for (let i = 0; i < 5; i++) assert.equal(ctx.allowed(), true);
  assert.equal(ctx.allowed(), false);
});

test("employer view renders malicious report text as inert text", () => {
  const { ctx } = load();
  ctx.S.reports.push({ id: 99, ind: "c", type: "grv", text: "<img src=x onerror=alert(1)>", anon: false, who: "<b>x</b>", status: "open" });
  ctx.S.role = "e";
  const html = ctx.employer();
  assert.ok(!html.includes("<img src=x"));
  assert.ok(!html.includes("<b>x</b>"));
});

test("anonymous report never stores the reporter's name", () => {
  const { ctx, get, click } = load();
  Object.assign(get("#txt"), { value: "  Loose   plank\non level 3 " });
  get("#anon").checked = true;
  click("sendR");
  const r = ctx.S.reports[ctx.S.reports.length - 1];
  assert.equal(r.anon, true);
  assert.equal(r.who, null);
  assert.equal(r.text, "Loose plank on level 3");
  assert.equal(r.mine, true);
});

test("named report keeps the reporter's name", () => {
  const { ctx, get, click } = load();
  Object.assign(get("#txt"), { value: "Overtime missing" });
  get("#anon").checked = false;
  click("sendR");
  assert.equal(ctx.S.reports[ctx.S.reports.length - 1].who, "Murugan S");
});

test("anonymous feedback stores no identity fields", () => {
  const { ctx, get, click } = load();
  ctx.S.rate = 3;
  Object.assign(get("#fbt"), { value: "Helmets are old" });
  click("sendF");
  const f = ctx.S.fb[ctx.S.fb.length - 1];
  assert.deepEqual(Object.keys(f).sort(), ["ind", "rate", "text", "topic"]);
});

test("every UI string exists in English, Tamil and Hindi", () => {
  const { ctx } = load();
  for (const [k, v] of Object.entries(ctx.T)) {
    assert.equal(v.length, 3, `${k} needs 3 languages`);
    v.forEach((s, i) => assert.ok(s && s.length, `${k}[${i}] is empty`));
  }
});

test("worker view renders for every tab, language and industry", () => {
  const { ctx } = load();
  for (const ind of ["c", "u"])
    for (let lang = 0; lang < 3; lang++)
      for (const tab of ["today", "pay", "rep", "fb", "sk"]) {
        ctx.S.ind = ind; ctx.S.lang = lang; ctx.S.tab = tab;
        assert.ok(ctx.worker().length > 100);
      }
});
