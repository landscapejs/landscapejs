import { LandscapeJS } from "../lib/landscape";
import { getComplementaryColor } from '../lib/color.js'

function callback(landscape) {
  const highlight = landscape.moon ? landscape.moon.light : landscape.sun.color.toHex();

  let css = `background: linear-gradient(to bottom, ${landscape.skyColor2.rgba()} 15%, ${landscape.skyColor1.rgba()} 30%, ${highlight} 40%, ${landscape.colorPallete[0].rgba()} 50%, ${landscape.colorPallete[1].rgba()} 55%, ${landscape.groundColor1} 70%, ${landscape.groundColor2} 95%); background-clip: text; z-index: 12; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;`;

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
    css = `animation: cornerReveal 5s both; color: ${color.toHex()} !important;`;
    el.setAttribute("style", css);
    console.log(el.className);
  });

  let el = document.querySelector(".scroll-line");
  css = `background: linear-gradient(to bottom, ${color.toHex()}, transparent); animation: scrollDrop 2s ease-in-out infinite;`;
  el.setAttribute("style", css);
  el = document.querySelector(".scroll-hint");
  css = `animation: cornerReveal 5s both; color: ${color.toHex()} !important;`;
  el.setAttribute("style", css);
}

function init() {

  const landscape = new LandscapeJS({
    container: "#landscapejs",
    callback: callback,
    seed: ""
  });
  landscape.render();
}

document.addEventListener("DOMContentLoaded", function () {
  init();
});

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

//   // const landscape = new Landscape(canvas, {"horizontLine":.7, "skyColor1": "#2c9060", "skyColor2": "#593c7a", "groundColor1": "#072517", "groundColor2": "#5b820e"});
//   const landscape = new LandscapeJS({
//     canvas: "#landscapejs"
//   });
// }

// document.addEventListener("DOMContentLoaded", function() {
//   init();
// });