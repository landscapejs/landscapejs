class x {
  constructor(t, i, e, s = 1) {
    this.r = t < 0 ? 0 : parseInt(t), this.g = i < 0 ? 0 : parseInt(i), this.b = e < 0 ? 0 : parseInt(e), this.a = s;
  }
  rgb() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }
  rgba() {
    return `rgb(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
  toHex() {
    return G(this.r, this.g, this.b);
  }
}
function $(f) {
  if (String(f).charAt(0) !== "#" && (f = "#" + f), f.length !== 7)
    throw console.log(f), new Error("Parameter is not a valid hex color code!");
  const t = parseInt(f.slice(1, 3), 16), i = parseInt(f.slice(3, 5), 16), e = parseInt(f.slice(5, 7), 16);
  return new x(t, i, e);
}
function z(f = 0, t) {
  const i = (n) => Math.max(0, Math.min(255, n)), e = Math.round(f * 100), s = i(Math.floor(t.random() * 40) + Math.round(e * 0.3)), o = i(Math.floor(t.random() * 100) + e), r = i(Math.floor(t.random() * 106) + 150 + e);
  return console.log(G(s, o, r)), new x(s, o, r);
}
function J(f = 0, t) {
  const i = (d) => Math.max(0, Math.min(255, d)), e = (d, c) => Math.floor(t.random() * (c - d + 1)) + d, s = [
    "white",
    "white",
    "white",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "orange",
    "orange",
    "orange",
    "orange",
    "red",
    "red",
    "red",
    "blue",
    "green"
  ], o = s[Math.floor(t.random() * s.length)];
  let r, n, h;
  switch (o) {
    case "white":
      r = e(240, 255), n = e(240, 255), h = e(240, 255);
      break;
    case "yellow":
      r = e(220, 255), n = e(190, 220), h = e(0, 40);
      break;
    case "orange":
      r = e(220, 255), n = e(80, 140), h = e(0, 30);
      break;
    case "red":
      r = e(180, 255), n = e(20, 60), h = e(0, 20);
      break;
    case "blue":
      r = e(0, 60), n = e(80, 140), h = e(180, 255);
      break;
    case "green":
      r = e(0, 60), n = e(180, 255), h = e(40, 100);
      break;
  }
  const l = (d) => Math.round(d + (255 - d) * f);
  return new x(i(l(r)), i(l(n)), i(l(h)));
}
function _(f) {
  var t = f.toString(16);
  return t.length == 1 ? "0" + t : t;
}
function G(f, t, i) {
  return "#" + _(f) + _(t) + _(i);
}
const U = 0.1, Y = 1.1, Z = 1.2, q = 1.8, X = 3e-3;
class R {
  constructor(t, i, e, s) {
    this.canvas = t, this.random = i, this.x = e, this.y = s;
  }
  draw(t = !1, i = !1, e = !1) {
    let s = this.canvas.getContext("2d"), o = this.random.random() < X;
    t && (o = !1);
    let r = this.random.float(U, Y), n = this.random.random() * 0.7 + 0.2, h = new x(this.random.int(225, 255), this.random.int(225, 255), this.random.int(225, 255), n);
    if (s.fillStyle = h.rgba(), s.strokeStyle = h.rgba(), o) {
      console.log("isABigStar!"), r = this.random.float(Z, q), s.save();
      const l = s.createRadialGradient(this.x, this.y, 0, this.x, this.y, r * 6);
      l.addColorStop(0, `rgba(${h.r}, ${h.g}, ${h.b}, 0.55)`), l.addColorStop(1, `rgba(${h.r}, ${h.g}, ${h.b}, 0)`), s.fillStyle = l, s.beginPath(), s.arc(this.x, this.y, r * 6, 0, Math.PI * 2), s.closePath(), s.fill(), s.restore();
    }
    if (s.save(), s.beginPath(), s.arc(this.x, this.y, r, 0, Math.PI * 2), s.closePath(), s.fill(), i && this.polyStar(
      s,
      this.x,
      this.y,
      r * this.random.int(4, 8),
      this.random.int(4, 5),
      // number of sides
      this.random.float(0.7, 0.9),
      // pointyness
      this.random.random() * 360
      // rotation of the star
    ), t) {
      console.log("shooting star"), h = $("#FFFFFF"), s.fillStyle = h.rgb(), s.strokeStyle = h.rgb(), s.beginPath(), s.moveTo(this.x, this.y);
      let l = this.random.int(this.x - 50, this.x + 50), d = this.random.int(this.y - 50, this.y + 50);
      s.lineTo(l, d);
      let c = s.createLinearGradient(this.x, this.y, l, d);
      c.addColorStop(0, h.rgba()), c.addColorStop(1, `rgba(${h.r},${h.g},${h.b},0)`), s.strokeStyle = c, s.closePath(), s.stroke();
    }
    s.restore();
  }
  polyStar(t, h, l, d, m, r, c) {
    t.save();
    var h = this.x, l = this.y, d = d, c = (c || 0) / 180 * Math.PI, m = m, w = 1 - (r || 0), u = Math.PI / m;
    t.moveTo(h + Math.cos(c) * d, l + Math.sin(c) * d), t.beginPath();
    for (var g = 0; g < m; g++)
      c += u, w != 1 && t.lineTo(h + Math.cos(c) * d * w, l + Math.sin(c) * d * w), c += u, t.lineTo(h + Math.cos(c) * d, l + Math.sin(c) * d);
    t.closePath(), t.fillStyle = "rgba(255, 255, 255, 1)", t.fill(), t.restore();
  }
}
class N {
  constructor(t, i, e, s, o, r, n, h, l, d = 0, c = !0, m = 1) {
    this.random = i, this.time = this.random.random() * 99, this.currentMin = s, this.currentMax = o, this.newMin = r, this.newMax = n, this.timeInterval = h, this.lengthInterval = m, this.mLength = 0, this.canvas = t, this.scale = window.devicePixelRatio || 1, this.ctx = t.getContext("2d"), this.baseHeight = this.canvas.height * 0.05, this.height = e - this.baseHeight, this.width = t.width, this.color = l, this.blur = d, this.fill = c;
  }
  getVertex() {
    this.time += this.timeInterval, this.mLength += this.lengthInterval;
    let t = this.random.noise(this.time), i = this.map(t, this.currentMin, this.currentMax, this.newMin, -this.height + this.newMax);
    return [this.mLength + 1, this.height - -i];
  }
  draw() {
    console.log("draw mountain"), this.ctx.save(), this.ctx.fillStyle = this.color.rgba(), this.ctx.strokeStyle = this.color.rgba(), this.ctx.filter = `blur(${this.blur}px)`;
    let t = new Path2D();
    t.moveTo(-100 * this.lengthInterval, this.height + this.baseHeight);
    for (let i = 0; i < this.width; i++) {
      let e = this.getVertex();
      t.lineTo(e[0], e[1]);
    }
    this.fill && (t.lineTo(this.width, this.height + this.baseHeight), t.closePath(), this.ctx.fill(t)), this.ctx.stroke(t), this.ctx.restore();
  }
  map(t, i, e, s, o, r) {
    const n = (t - i) / (e - i) * (o - s) + s;
    return r ? s < o ? this.constrain(n, s, o) : this.constrain(n, o, s) : n;
  }
  constrain(t, i, e) {
    return Math.max(Math.min(t, e), i);
  }
}
const p = Math.PI / 180;
class j {
  constructor(t, i, e = 0, s = 0, o = 0, r = 0, n = "#fff", h = "#000") {
    this.random = i, this.phase = 360 * e, this.lineWidth = 0, this.x = s > 0 ? s : t.width / 2, this.y = o > 0 ? o : t.height / 2, this.r = r > 0 ? r : 100, this.light = n, this.dark = h, this.offset = this.lineWidth / 2, this.canvas = t, this.ctx = t.getContext("2d"), this.glow = this.r / 2, console.log(`Moon phase: ${this.phase}`), console.log(`Moon position: ${this.x}, ${this.y}`);
  }
  drawMoon() {
    this.ctx.translate(this.offset, this.offset), this.random.random() < 0.2 && this.ctx.rotate(this.random.int(0, 360) * Math.PI / 180), this.ctx.beginPath(), this.ctx.arc(this.r, this.r, this.r, 0, 2 * Math.PI, !0), this.ctx.closePath(), this.ctx.fillStyle = this.dark, this.ctx.fill();
  }
  /*
  drawMoon2() {
      this.ctx.translate(this.offset, this.offset);
      this.ctx.beginPath();
      this.ctx.arc(this.r, this.r, this.r, 0, 2 * Math.PI, true);
      this.ctx.closePath();
      this.ctx.fillStyle = this.light;
      // this.ctx.strokeStyle = this.light;
      // this.ctx.lineWidth = this.lineWidth;
      this.ctx.shadowBlur = this.glow;
      this.ctx.shadowColor = this.light;
      this.ctx.fill();
      // this.ctx.stroke();
      this.ctx.shadowBlur = 0;
      this.ctx.shadowColor = 'transparent';
  }
  */
  drawShadow(t) {
    this.ctx.fillStyle = this.light;
    const i = Math.cos(t * p);
    this.ctx.lineWidth = 0, this.ctx.beginPath();
    let e = i * this.r * Math.cos(0) + this.r, s = this.r * Math.sin(0) + this.r;
    if (this.ctx.moveTo(e, s), t <= 180)
      for (let o = 0; o <= 360; o++)
        Math.cos(o * p) > 0 ? e = i * this.r * Math.cos(o * p) + this.r : e = this.r * Math.cos(o * p) + this.r, s = this.r * Math.sin(o * p) + this.r - 1, this.ctx.lineTo(e, s + 1);
    else
      for (let o = 0; o <= 360; o++)
        Math.cos(o * p) < 0 ? e = i * this.r * Math.cos(o * p) + this.r : e = this.r * Math.cos(o * p) + this.r, s = this.r * Math.sin(o * p) + this.r - 1, this.ctx.lineTo(e, s + 1);
    this.ctx.closePath(), this.ctx.shadowBlur = this.glow, this.ctx.shadowColor = this.light, this.ctx.fill();
  }
  /*
      drawShadow2(phase) {
          // console.log(`Shadow phase: ${phase}`);
          this.ctx.beginPath();
          this.ctx.arc(this.r, this.r, this.r, -Math.PI / 2, Math.PI / 2, true);
          this.ctx.closePath();
          this.ctx.fillStyle = this.dark;
          this.ctx.fill();
  
          this.ctx.translate(this.r, this.r);
          this.ctx.scale(phase, 1);
          this.ctx.translate(-this.r, -this.r);
          this.ctx.beginPath();
          this.ctx.arc(this.r, this.r, this.r, -Math.PI / 2, Math.PI / 2, true);
          this.ctx.closePath();
          this.ctx.fillStyle = phase > 0 ? this.light : this.dark;
          this.ctx.fill();
      }
      */
  draw() {
    this.ctx.save(), this.ctx.translate(this.x, this.y), this.drawMoon(), this.drawShadow(this.phase), this.ctx.restore();
  }
  /*
  drawComplex2() {
      this.ctx.save();
      this.ctx.translate(this.x, this.y);
      if (this.phase <= 0.5) {
          this.drawMoon();
          this.drawShadow(4 * this.phase - 1);
      } else {
          this.ctx.translate(this.r + 2 * this.offset, this.r + 2 * this.offset);
          this.ctx.rotate(Math.PI);
          this.ctx.translate(-this.r, -this.r);
          this.drawMoon();
          this.drawShadow(4 * (1 - this.phase) - 1);
      }
      this.ctx.restore();
  }
  */
  /*
  drawSimple() {
      this.ctx.save();
      this.ctx.fillStyle = this.light;
      this.ctx.beginPath();
      this.ctx.ellipse(this.x, this.y, this.r, this.r, 0, 0, 2 * Math.PI);
      if (this.phase > 0.8) {
          this.ctx.shadowBlur = this.glow;
          this.ctx.shadowColor = this.light;
      }
      this.ctx.fill();
      if (this.phase <= 0.8) {
          let side = Math.random() >= 0.5 ? 1 : -1
          this.ctx.fillStyle = this.dark;
          this.ctx.beginPath();
          this.ctx.ellipse(this.x + this.phase * this.r * side, this.y, this.r, this.r, 0, 0, 2 * Math.PI);
          this.ctx.fill();
      }
      this.ctx.restore();
  }
  */
}
class K {
  constructor(t, i, e = 0, s = 0, o = 0, r = 0) {
    this.canvas = t, this.ctx = t.getContext("2d"), this.random = i, this.phase = e, this.lineWidth = 0, this.x = s > 0 ? s : t.width / 2, this.y = o > 0 ? o : t.height / 2, this.r = r > 0 ? r : 100, this.offset = this.lineWidth / 2, this.glow = this.r * 10, this.color = J(this.phase, this.random), console.log(`Sun phase: ${this.phase}`);
  }
  drawSun() {
    this.ctx.translate(this.offset, this.offset);
    const t = this.random.float(0.1, 0.9), i = this.random.int(1, 8), e = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * i);
    e.addColorStop(0, this.color.rgb().replace(")", `, ${t})`).replace("rgb", "rgba")), e.addColorStop(1, this.color.rgb().replace(")", ", 0)").replace("rgb", "rgba")), this.ctx.beginPath(), this.ctx.arc(0, 0, this.r * i, 0, 2 * Math.PI), this.ctx.closePath(), this.ctx.fillStyle = e, this.ctx.fill(), this.ctx.beginPath(), this.ctx.arc(0, 0, this.r, 0, 2 * Math.PI), this.ctx.closePath(), this.ctx.shadowBlur = this.glow, this.ctx.fillStyle = this.color.rgba(), this.ctx.shadowColor = this.color.rgba(), this.ctx.fill();
  }
  draw() {
    console.log("Drawing sun!!!!"), this.ctx.save(), this.ctx.translate(this.x, this.y), this.drawSun(), this.ctx.restore();
  }
}
const D = 4, T = 1 << D, V = 8, Q = 1 << V, C = 4095;
let tt = 4, it = 0.5;
const H = (f) => 0.5 * (1 - Math.cos(f * Math.PI));
let v;
class et {
  constructor(t) {
    this.seed = t, this.rnd = this.splitmix32(this.seed);
  }
  noise(t, i = 0, e = 0) {
    if (v == null) {
      v = new Array(C + 1);
      for (let y = 0; y < C + 1; y++)
        v[y] = this.rnd();
    }
    t < 0 && (t = -t), i < 0 && (i = -i), e < 0 && (e = -e);
    let s = Math.floor(t), o = Math.floor(i), r = Math.floor(e), n = t - s, h = i - o, l = e - r, d, c, m = 0, w = 0.5, u, g, M;
    for (let y = 0; y < tt; y++) {
      let S = s + (o << D) + (r << V);
      d = H(n), c = H(h), u = v[S & C], u += d * (v[S + 1 & C] - u), g = v[S + T & C], g += d * (v[S + T + 1 & C] - g), u += c * (g - u), S += Q, g = v[S & C], g += d * (v[S + 1 & C] - g), M = v[S + T & C], M += d * (v[S + T + 1 & C] - M), g += c * (M - g), u += H(l) * (g - u), m += u * w, w *= it, s <<= 1, n *= 2, o <<= 1, h *= 2, r <<= 1, l *= 2, n >= 1 && (s++, n--), h >= 1 && (o++, h--), l >= 1 && (r++, l--);
    }
    return m;
  }
  float(t, i) {
    return this.rnd() * (i - t) + t;
  }
  int(t, i) {
    const e = Math.ceil(t), s = Math.floor(i);
    return Math.floor(this.rnd() * (s - e) + e);
  }
  random() {
    return this.rnd();
  }
  mulberry32(t) {
    return function() {
      t |= 0, t = t + 1831565813 | 0;
      let i = Math.imul(t ^ t >>> 15, 1 | t);
      return i = i + Math.imul(i ^ i >>> 7, 61 | i) ^ i, ((i ^ i >>> 14) >>> 0) / 4294967296;
    };
  }
  splitmix32(t) {
    return function() {
      t |= 0, t = t + 2654435769 | 0;
      var i = t ^ t >>> 16;
      return i = Math.imul(i, 569420461), i = i ^ i >>> 15, i = Math.imul(i, 1935289751), ((i = i ^ i >>> 15) >>> 0) / 4294967296;
    };
  }
}
class st {
  encode(t) {
    const e = new TextEncoder().encode(t), s = String.fromCharCode.apply(null, e);
    return btoa(s);
  }
  decode(t) {
    const i = atob(t), e = new Uint8Array(i.length);
    for (let o = 0; o < i.length; o++)
      e[o] = i.charCodeAt(o);
    return new TextDecoder().decode(e);
  }
}
let E = 3, P = 25, A = 3, F = 12;
class ot {
  constructor({ container: t, seed: i = 0, callback: e = null, randomSeed: s = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER), drawSky: o = !0, drawStars: r = !0, drawMoon: n = !0, drawSun: h = !0, drawMountains: l = !0, drawWaves: d = !0, drawGround: c = !0, drawWater: m = !0, drawBubbles: w = !0, numberOfMountains: u = 0, numberOfWaves: g = 0, dayTime: M = Math.random() < 0.5, underwater: y = !1, horizontLine: S = 0.5, skyColor1: k = null, skyColor2: I = null, groundColor1: L = null, groundColor2: b = null } = {}) {
    try {
      const a = document.querySelector(t);
      this.canvas = document.createElement("canvas"), a.appendChild(this.canvas), this.ctx = this.canvas.getContext("2d", { willReadFrequently: !0 }), this.scale = window.devicePixelRatio || 1;
      const W = a.offsetWidth, O = a.offsetHeight;
      console.log(`${W},${O}`), this.canvas.style.width = `${W}px`, this.canvas.style.height = `${O}px`, this.canvas.width = Math.floor(W * this.scale), this.canvas.height = Math.floor(O * this.scale);
    } catch (a) {
      throw a;
    }
    if (this.callback = e, this.codec = new st(), this.moon = null, this.sun = null, this.stars = [], this.bubbles = [], this.mountains = [], this.waves = [], typeof arguments[1] > "u" && (arguments[1] = {}), i) {
      console.log(`seed: ${i}`), console.log(this.codec.decode(i));
      let a;
      try {
        a = JSON.parse(this.codec.decode(i)), "randomSeed" in a && (s = a.randomSeed), "drawSky" in a && (o = a.drawSky), "drawStars" in a && (r = a.drawStars), "drawMoon" in a && (n = a.drawMoon), "drawSun" in a && (h = a.drawSun), "drawMountains" in a && (l = a.drawMountains), "drawWaves" in a && (d = a.drawWaves), "drawGround" in a && (c = a.drawGround), "drawWater" in a && (m = a.drawWater), "drawBubbles" in a && (w = a.drawBubbles), "numberOfMountains" in a && (u = a.numberOfMountains), "numberOfWaves" in a && (g = a.numberOfWaves), "dayTime" in a && (M = a.dayTime), "underwater" in a && (y = a.underwater), "horizontLine" in a && (S = a.horizontLine), "skyColor1" in a && (k = a.skyColor1), "skyColor2" in a && (I = a.skyColor2), "groundColor1" in a && (L = a.groundColor1), "groundColor2" in a && (b = a.groundColor2);
      } catch {
        console.error(`Invalid seed: ${i}`);
      }
    }
    "seed" in arguments[1] && delete arguments[1].seed, arguments[1].randomSeed = s, arguments[1].dayTime = M, this.randomSeed = s, this.random = new et(this.randomSeed), console.log(`seed: ${i}`), console.log(JSON.stringify(arguments[1])), this.seed = this.codec.encode(JSON.stringify(arguments[1])), console.log(this.seed), this.numberOfMountains = u || this.random.int(E, P), this.numberOfWaves = g || this.random.int(A, F), this.drawSky = o, this.drawStars = r, this.drawMoon = n, this.drawSun = h, this.drawMountains = l, this.drawGround = c, this.drawWater = m, this.drawBubbles = w, this.dayTime = M, this.underwater = y, this.drawWaves = d, this.horizontLine = S, this.skyColor1 = k, this.skyColor2 = I, this.groundColor1 = L, this.groundColor2 = b, this.init();
  }
  init() {
    this.width = this.canvas.width, this.height = this.canvas.height, this.horizontLineHeight = this.height * this.horizontLine, this.baseLineHeight = this.height, this.underwater && (this.baseLineHeight = this.horizontLineHeight + 50), this.numberOfMountains > P ? this.numberOfMountains = P : this.numberOfMountains < E && (this.numberOfMountains = E), this.numberOfWaves > F ? this.numberOfWaves = F : this.numberOfWaves < A && (this.numberOfWaves = A), console.log(`Day time: ${this.dayTime}`), console.log(`HorizontLine: ${this.horizontLine}`), this.createColorPallete(), this.underwater ? (console.log(`Under water: ${this.underwater}`), this.drawWaves && this.createWaves(), this.drawStars && this.createStars(), this.drawBubbles && this.createBubbles(), this.drawMoon && this.createMoon()) : (console.log(`Number of mountains: ${this.numberOfMountains}`), this.drawMountains && this.createMountains(), this.drawStars && this.createStars(), !this.dayTime && this.drawMoon && this.createMoon(), this.dayTime && this.drawSun && this.createSun());
  }
  createColorPallete() {
    const t = this.random.random() < 0.25, i = this.random.random() < 0.5;
    let e = this.dayTime ? 150 : 0, s = this.dayTime ? 150 : 0, o = this.dayTime ? 150 : 0, r = this.dayTime ? 255 : 200, n = this.dayTime ? 255 : 200, h = this.dayTime ? 255 : 200, l = i ? 200 : -185, d = i ? 200 : -175, c = i ? 60 : -55;
    this.underwater && (console.log("underwater!!!!"), e = 100, s = 100, o = 100, r = 255, n = 255, h = 255);
    let m = this.random.int(e, r), w = this.random.int(s, n), u = this.random.int(o, h);
    if (t) {
      let b = this.dayTime ? this.random.random() : this.random.random() * -1;
      i && (console.log("morning!!!!"), b = 1);
      let a = z(b, this.random);
      console.log("Sky is blue!"), m = a.r, w = a.g, u = a.b;
    }
    let g = m + l, M = w + d, y = u + c;
    if (this.skyColor1)
      try {
        let b = $(this.skyColor1);
        m = b.r, w = b.g, u = b.b;
      } catch {
        console.error(`Invalid color code: ${this.skyColor1}`);
      }
    if (this.skyColor2)
      try {
        let b = $(this.skyColor2);
        g = b.r, M = b.g, y = b.b;
      } catch {
        console.error(`Invalid color code: ${this.skyColor2}`);
      }
    console.log(`Sky 1 - red: ${m}, green: ${w}, blue: ${u}`), console.log(`Sky 2 - red: ${g}, green: ${M}, blue: ${y}`);
    let S = this.underwater ? this.numberOfWaves : this.numberOfMountains;
    this.colorPallete = [];
    let k = (r - m) / S, I = (n - w) / S, L = (h - u) / S;
    for (let b = 0; b < S; b++) {
      let a = 1;
      this.colorPallete.push(new x(m + b * k, w + b * I, u + b * L, a));
    }
    i ? (this.skyColor1 = new x(g, M, y, 1), this.colorPallete.push(this.skyColor1), this.skyColor2 = new x(m, w, u, 1), this.colorPallete.push(this.skyColor2)) : (this.skyColor1 = new x(m, w, u, 1), this.colorPallete.push(new x(m, w, u, 1)), this.skyColor2 = new x(g, M, y, 1), this.colorPallete.push(new x(g, M, y, 1))), console.log(this.colorPallete);
  }
  createMountains() {
    let t = this.random.float(3e-3, 0.03), i = this.random.float(3.3, 7), e = this.random.float(0.1, 0.26);
    e = 0.324 - this.numberOfMountains / P * 100 * 16e-4 - 0.064, console.log(`heightSeed: ${i}`), console.log(`mountainSeed: ${t}`), console.log(`heightSub: ${e}`);
    let s = i, o = t;
    for (let r = 0; r < this.numberOfMountains; r++) {
      let n = 0;
      r > 0 && (s = i - e * r, o = t / r), this.mountains.push(new N(this.canvas, this.random, this.horizontLineHeight, 0, s, 0, 4, o, this.colorPallete[r], n, !0, 1));
    }
    console.log(this.mountains);
  }
  createWaves() {
    let t = this.random.float(3e-3, 0.08), i = this.random.float(3.3, 7), e = this.random.float(0.1, 0.26);
    e = 0.324 - this.numberOfMountains / P * 100 * 16e-4 - 0.064, i = 4, t = 4e-3, e = 10, console.log(`heightSeed: ${i}`), console.log(`mountainSeed: ${t}`), console.log(`heightSub: ${e}`);
    let s = i, o = t, r = this.horizontLineHeight;
    r = r + r * 2, console.log(`horizontLineHeight: ${r}`);
    for (let n = 0; n < this.numberOfWaves; n++) {
      if (n > 0) {
        let h = e * (n * 0.1);
        this.underwater && (h = h * -1), s = i + h, r -= h;
      }
      this.waves.push(new N(this.canvas, this.random, r, 0, s, 0, 4, o, new x(255, 255, 255), 0, !1, 3));
    }
    console.log(this.waves);
  }
  createStars() {
    let t = this.random.int(this.width * 0.1, this.width);
    for (let i = 0; i < t; i++)
      this.stars.push(new R(this.canvas, this.random, this.random.int(0, this.width), this.random.int(0, this.horizontLineHeight)));
  }
  createBubbles() {
    let t = this.random.int(this.width * 0.02, this.width * 0.05);
    console.log(`Number of bubbles: ${t}`);
    for (let i = 0; i < t; i++)
      this.bubbles.push(new R(this.canvas, this.random, this.random.int(0, this.width), this.random.int(this.horizontLineHeight + this.baseLineHeight, this.height)));
  }
  createMoon() {
    let t = this.random.int(this.height / 70, this.height / 7), i = this.random.int(2 * t, this.width - 2 * t), e = parseInt(this.random.random() * this.height / 6 + t), s = ["#ffffff", "#fffefd", "#fff0f0", "#ffcdcd"], o = s[this.random.int(0, s.length - 1)], r = this.colorPallete[this.colorPallete.length - 1].rgb();
    this.moon = new j(this.canvas, this.random, this.random.random(), i, e, t, o, r);
  }
  createSun() {
    let t = this.random.int(this.height / 70, this.height / 7), i = this.random.int(2 * t, this.width - 2 * t), e = parseInt(this.random.random() * this.height / 6 + t);
    this.sun = new K(this.canvas, this.random, this.random.random(), i, e, t);
  }
  render() {
    this.underwater ? this.drawUnderWater() : this.drawLandscape();
  }
  drawUnderWater() {
    if (this._drawSky(), !this.drawWaves)
      for (let t = this.waves.length - 1; t >= 0; t--)
        this.waves[t].draw();
    if (this.drawWater) {
      let t = new x(255, 255, 255, 1), i = new x(255, 255, 255, 1);
      B(this.canvas, 0, this.horizontLineHeight, this.width, this.height - this.horizontLineHeight, i, t);
      let e = this.width / 2, s = this.width / 2, o = this.ctx.createRadialGradient(e, this.horizontLineHeight, s / 10, e, this.horizontLineHeight, s);
      o.addColorStop(0, i.rgba()), o.addColorStop(1, t.rgba()), this.ctx.fillStyle = o;
    }
    if (this.drawBubbles)
      for (let t of this.bubbles)
        t.draw(!1, !0);
  }
  _drawSky() {
    if (B(this.canvas, 0, 0, this.width, this.horizontLineHeight, this.colorPallete[this.colorPallete.length - 1], this.colorPallete[this.colorPallete.length - 2]), this.dayTime)
      this.drawSun && this.sun.draw();
    else {
      if (this.drawStars) {
        for (let i of this.stars)
          i.draw();
        for (let i = this.random.int(1, 5); i > 0; i--) {
          var t = new R(this.canvas, this.random, this.random.int(0, this.width), this.random.int(0, this.horizontLineHeight));
          t.draw(!0, !1, !1);
        }
        for (let i = this.random.int(3, 10); i > 0; i--) {
          var t = new R(this.canvas, this.random, this.random.int(0, this.width), this.random.int(0, this.horizontLineHeight));
          t.draw(!1, !0, !1);
        }
      }
      this.drawMoon && this.moon.draw();
    }
  }
  _drawGround(t = 0) {
    t === 0 && (t = this.horizontLineHeight);
    let i = ["#FFA500", "#C4A484", "#B7CCA9", "#E2D03B", "#800020", "#829FAD", "#93C572", "#4CBB17", "#32CD32", "#228B22", "#016403", "#6C8E68", "#3F9B0B", "#7CFC00", "#814f3e", "#96776e", "#c1a89a", "#a6e156", "#8d9f40", "#263525", "#301a17", "#1e281e", "#495846", "#121510", "#7f6f55", "#54534f", "#879b35", "#9c9495", "#e7e5ec", "#a47d5d", "#bfc0bd", "#ad8c89", "#d5adb3", "#9d8563", "#e3d3b8", "#435654"], e = i[this.random.int(0, i.length - 1)], s = i[this.random.int(0, i.length - 1)];
    if (this.groundColor1)
      try {
        e = $(this.groundColor1);
      } catch {
        console.error(`Invalid color code: ${this.groundColor1}`);
      }
    if (this.groundColor2)
      try {
        s = $(this.groundColor2);
      } catch {
        console.error(`Invalid color code: ${this.groundColor2}`);
      }
    let o = this.colorPallete[0];
    this.groundColor1 = e, this.groundColor2 = s, this.ctx.fillStyle = o, this.ctx.fillRect(0, t, this.width, this.height - t);
    let r = this.ctx.createLinearGradient(0, t, 0, this.baseLineHeight), n = 2;
    r.addColorStop(0, o.rgb()), r.addColorStop(0.2, e), r.addColorStop(1, s), this.ctx.fillStyle = r, this.ctx.filter = `blur(${n}px)`, this.ctx.fillRect(-n, t - n, this.width + n, this.baseLineHeight - t + n), this.ctx.fillRect(0, t, this.width, this.baseLineHeight - t);
    let h = this.width / 2, l = t, d = this.width / 2, c = this.canvas.getContext("2d"), m = c.createRadialGradient(h, l, d / 5, h, l, d), w = new x(255, 255, 255, 0.3), u = new x(255, 255, 255, 0);
    m.addColorStop(0, w.rgba()), m.addColorStop(1, u.rgba()), c.fillStyle = m, c.fillRect(0, l, this.width, this.height - this.baseLineHeight), c.fillRect(0, l, this.width, this.baseLineHeight - t), B(this.canvas, 0, t, this.width, t - t * 1.07, new x(255, 255, 255, 0.3), new x(255, 255, 255, 0)), B(this.canvas, 0, t, this.width, t - this.baseLineHeight, new x(255, 255, 255, 0.3), new x(255, 255, 255, 0));
  }
  drawLandscape() {
    if (this.drawSky && this._drawSky(), this.drawMountains)
      for (let t = this.mountains.length - 1; t >= 0; t--)
        this.mountains[t].draw();
    this.drawGround && this._drawGround(), this.done();
  }
  done() {
    this.callback && this.callback(this);
  }
  // resize() {
  //     console.log("resizing...");
  //     console.log(this.canvas);
  //     const ctx = this.canvas.getContext('2d');
  //     const dpr = window.devicePixelRatio || 1;
  //     const width = window.innerWidth;
  //     const height = window.innerHeight;
  //     this.width = width;
  //     this.height = height;
  //     this.canvas.width = Math.floor(width * dpr);
  //     this.canvas.height = Math.floor(height * dpr);
  //     this.canvas.style.width = width + 'px';
  //     this.canvas.style.height = height + 'px';
  //     ctx.scale(dpr, dpr);
  // }
}
function B(f, t, i, e, s, o, r, n) {
  let h = f.getContext("2d"), l = h.createLinearGradient(t, i, t, i + s);
  l.addColorStop(0, o.rgba()), l.addColorStop(1, r.rgba()), h.fillStyle = l, h.fillRect(t, i, e, s);
}
export {
  ot as LandscapeJS
};
