import { LandscapeJS } from '../lib/landscape';
import { getComplementaryColor } from '../lib/color'
import '@tailwindplus/elements';


function callback(landscape) {
  const highlight = landscape.moon ? landscape.moon.light : landscape.sun.color.hex();

  let css = `background: linear-gradient(to bottom, ${landscape.skyColor2} 15%, ${landscape.skyColor1} 30%, ${highlight} 40%, ${landscape.colorPalette[0].rgba()} 50%, ${landscape.colorPalette[1].rgba()} 55%, ${landscape.groundColor1} 70%, ${landscape.groundColor2} 95%); background-clip: text; z-index: 12; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;`;

  const title = document.querySelector(".hero-title");
  title.setAttribute("style", css + " animation: titleReveal 1s cubic-bezier(0.16, 1, 0.3, 1) both");

  css += "animation: reflectionReveal 1.25s cubic-bezier(0.16, 1, 0.3, 1) both; opacity: .3;";
  const reflection = document.querySelector(".hero-title-reflection");
  reflection.setAttribute("style", css.replace('z-index: 12', 'z-index: 11'));

  const corners = document.getElementsByClassName("corner");
  let color = null;
  [].forEach.call(corners, function (el) {
    const rect = el.getBoundingClientRect();
    console.log("X: " + rect.x + ", Y: " + rect.y);
    const pixel = landscape.ctx.getImageData(rect.x, rect.y, 1, 1);
    color = getComplementaryColor(pixel.data[0], pixel.data[1], pixel.data[2]);
    console.log(`from: ${pixel.data[0]}, ${pixel.data[1]}, ${pixel.data[2]}`);
    console.log(`to: ${color.rgb()}`);
    css = `animation: cornerReveal 5s both; color: ${color.hex()} !important;`;
    el.setAttribute("style", css);
    console.log(el.className);
  });

  // let el = document.querySelector(".scroll-line");
  // css = `background: linear-gradient(to bottom, ${color.hex()}, transparent); animation: scrollDrop 2s ease-in-out infinite;`;
  // el.setAttribute("style", css);

  // el = document.querySelector(".scroll-hint");
  // css = `animation: cornerReveal 5s both; color: ${color.hex()} !important;`;
  // el.setAttribute("style", css);

  const el = document.querySelector(".tagline");
  el.setAttribute("style", `animation: fadeUp 2.5s 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; color: ${color.hex()} !important;`);
}

function fillForm(landscape) {
  document.getElementById("seed-field").value = landscape.seed;

  if (landscape.underwater) {
    document.getElementById("underwater-fieldset").classList.remove("hidden");
    document.getElementById("default-fieldset").classList.add("hidden");
  } else {
    document.getElementById("underwater-fieldset").classList.add("hidden");
    document.getElementById("default-fieldset").classList.remove("hidden");
  }

  document.getElementById("daylight-field").checked = landscape.dayTime;
  document.getElementById("sky-field").checked = landscape.drawSky;
  document.getElementById("moon-field").checked = landscape.drawMoon;
  document.getElementById("sun-field").checked = landscape.drawSun;

  document.getElementById("stars-field").max = landscape.maxNumberOfStars;
  document.getElementById("stars-field").value = landscape.numberOfStars;
  document.getElementById("stars-field-value").textContent = landscape.numberOfStars;

  document.getElementById("shooting-stars-field").value = landscape.numberOfShootingStars;
  document.getElementById("shooting-stars-field-value").textContent = landscape.numberOfShootingStars;

  document.getElementById("poly-stars-field").value = landscape.numberOfPolyStars;
  document.getElementById("poly-stars-field-value").textContent = landscape.numberOfPolyStars;

  document.getElementById("mountains-field").max = landscape.maxNumberOfMountains;
  document.getElementById("mountains-field").value = landscape.numberOfMountains;
  document.getElementById("mountains-field-value").textContent = landscape.numberOfMountains;

  document.getElementById("horizon-field").value = landscape.horizontLine * 100;
  document.getElementById("horizon-field-value").textContent = landscape.horizontLine * 100;

  document.getElementById("sky-color-1-field").value = landscape.skyColor1;
  document.getElementById("sky-color-2-field").value = landscape.skyColor2;
  document.getElementById("ground-color-1-field").value = landscape.groundColor1;
  document.getElementById("ground-color-2-field").value = landscape.groundColor2;
}

function applyForm() {
  const playground = new LandscapeJS({
    container: "#playCanvas",
    callback: fillForm,
    underwater: document.getElementById("underwater-fieldset").checked,
    dayTime: document.getElementById("daylight-field").checked,
    drawSky: document.getElementById("sky-field").checked,
    drawMoon: document.getElementById("moon-field").checked,
    drawSun: document.getElementById("sun-field").checked,
    numberOfStars: document.getElementById("stars-field").value,
    numberOfShootingStars: document.getElementById("shooting-stars-field").value,
    numberOfPolyStars: document.getElementById("poly-stars-field").value,
    numberOfMountains: document.getElementById("mountains-field").value,
    horizontLine: document.getElementById("horizon-field").value / 100,
    skyColor1: document.getElementById("sky-color-1-field").value,
    skyColor2: document.getElementById("sky-color-2-field").value,
    groundColor1: document.getElementById("ground-color-1-field").value,
    groundColor2: document.getElementById("ground-color-2-field").value,
  });
  playground.render();
}

function loadSeed() {
  const playground = new LandscapeJS({
    container: "#playCanvas",
    callback: fillForm,
    seed: document.getElementById("seed-field").value,
  });
  playground.render();
}

function init() {
  const landscape = new LandscapeJS({
    container: "#landscapejs",
    callback: callback,
    seed: ""
  });
  landscape.render();

  const playground = new LandscapeJS({
    container: "#playCanvas",
    callback: fillForm,
  });
  playground.render();
}

document.addEventListener("DOMContentLoaded", function () {
  init();
  document.getElementById("apply-button").addEventListener("click", (event) => {
    applyForm();
  });
  document.getElementById("load-button").addEventListener("click", (event) => {
    loadSeed();
  });
});

window.toggleDrawer = function () {
  const el = document.querySelector("#playground .glass");
  const h = document.querySelector("#drawerHandle");
  console.log(el.getBoundingClientRect().left)
  if (el.getBoundingClientRect().left > 0) {
    console.log('out')
    button.style.transform = 'rotate(180deg)';
    el.classList.remove("slide-in");
    el.classList.add("slide-out");
  }
  else {
    button.style.transform = 'rotate(0deg)';
    console.log('in')
    el.classList.remove("slide-out");
    el.classList.add("slide-in");
  }
}

window.onresize = init;

// function init() { 
//   const canvas = document.getElementById('landscapejs');
//   console.log(canvas);
//   console.log(document.querySelector('#landscapejs'));
//   const ctx = canvas.getContext('2d');
//   const dpr = window.devicePixelRatio || 1;
//   const width = window.innerWidth;
//   const height = window.innerHeight;
//   canvas.width = Math.floor(width * dpr);
//   canvas.height = Math.floor(height * dpr);
//   canvas.style.width = width + 'px';
//   canvas.style.height = height + 'px';
//   ctx.scale(dpr, dpr);

//   // const landscape = new Landscape(
//   //   canvas, 
//   //   null,     // seed
//   //   null,     // callback
//   //   true,     // drawSky
//   //   true,     // drawStars
//   //   true,     // drawMoon
//   //   true,     // drawSun
//   //   true,     // drawMountains
//   //   true,     // drawWaves
//   //   true,     // drawGround
//   //   true,     // drawWater
//   //   true,     // drawBubbles
//   //   0,        // numberOfMountains
//   //   0,        // numberOfWaves
//   //   true,     // dayTime
//   //   false,    // underwater
//   // );

//   // eyJob3Jpem9udExpbmUiOjAuNywicmFuZG9tU2VlZCI6NTgxNTUwNjUwNDk3OTIzNywiZGF5VGltZSI6dHJ1ZX0
//   // eyJkYXlUaW1lIjpmYWxzZSwibnVtYmVyT2ZNb3VudGFpbnMiOjcsInJhbmRvbVNlZWQiOjc0NzAyMjAwMTQ1MDEyNjB9
//   // eyJob3Jpem9udExpbmUiOjAuNywic2t5Q29sb3IxIjoiIzJjOTA2MCIsInNreUNvbG9yMiI6IiM1OTNjN2EiLCJyYW5kb21TZWVkIjo1NzQ4MDI3MTM0NzAwNDA0LCJkYXlUaW1lIjpmYWxzZX0=
//   // eyJyYW5kb21TZWVkIjo2NjQ3ODc2NzI1Mzk2NzY2LCJkYXlUaW1lIjp0cnVlfQ==
//   // eyJyYW5kb21TZWVkIjo2NDY3NDA3MTk1MDA4NTc2LCJkYXlUaW1lIjpmYWxzZX0=
//   // eyJyYW5kb21TZWVkIjo1MTI0Mjg5NzE4NTcxNzg5LCJkYXlUaW1lIjp0cnVlfQ==
//   // eyJyYW5kb21TZWVkIjoyNzUwNzk4Nzc1MzM4MjE5LCJkYXlUaW1lIjpmYWxzZX0=
//   // eyJyYW5kb21TZWVkIjozMzQwNTc0NzQxMDkwODA2LCJkYXlUaW1lIjp0cnVlfQ==
//   // eyJyYW5kb21TZWVkIjo2MDUxOTQzNDc3MDM0NzQxLCJkYXlUaW1lIjpmYWxzZX0=
//   // eyJyYW5kb21TZWVkIjoyMDgzOTU4Mzk3NzE1NjIsImRheVRpbWUiOmZhbHNlfQ==
//   // eyJyYW5kb21TZWVkIjoyNjU5NDA1MjA5ODA1MjE1LCJkYXlUaW1lIjpmYWxzZX0=
//   // eyJyYW5kb21TZWVkIjo3ODQ4MTIwNzcyODUwMDE3LCJkYXlUaW1lIjpmYWxzZX0=
//   // eyJyYW5kb21TZWVkIjo1NTA4NTMzNjI0NjcwNTE1LCJkYXlUaW1lIjp0cnVlfQ==


//   // const landscape = new Landscape(canvas, {"horizontLine":.7, "skyColor1": "#2c9060", "skyColor2": "#593c7a", "groundColor1": "#072517", "groundColor2": "#5b820e"});
//   const landscape = new LandscapeJS({
//     canvas: "#landscapejs"
//   });
// }

// document.addEventListener("DOMContentLoaded", function() {
//   init();
// });