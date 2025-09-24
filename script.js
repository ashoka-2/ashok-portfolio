function locomotive() {
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true ,
  });
  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },

    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },

    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();
}
locomotive();


const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

function resizeCanvas(){
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", function () {
  resizeCanvas();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render();
});

function files(index) {
  var data = `
     ./1.webp
     ./2.webp
     ./3.webp
     ./4.webp
     ./5.webp
     ./6.webp
     ./7.webp
     ./8.webp
     ./9.webp
     ./10.webp
     ./11.webp
     ./12.webp
     ./13.webp
     ./14.webp
     ./15.webp
     ./16.webp
     ./17.webp
     ./18.webp
     ./19.webp
     ./20.webp
     ./21.webp
     ./22.webp
     ./23.webp
     ./24.webp
     ./25.webp
     ./26.webp
     ./27.webp
     ./28.webp
     ./29.webp
     ./30.webp
     ./31.webp
     ./32.webp
     ./33.webp
     ./34.webp
     ./35.webp
     ./36.webp
     ./37.webp
     ./38.webp
     ./39.webp
     ./40.webp
     ./41.webp
     ./42.webp
     ./43.webp
     ./44.webp
     ./45.webp
     ./46.webp
     ./47.webp
     ./48.webp
     ./49.webp
     ./50.webp
     ./51.webp
     ./52.webp
     ./53.webp
     ./54.webp
     ./55.webp
     ./56.webp
     ./57.webp
     ./58.webp
     ./59.webp
     ./60.webp
     ./61.webp
     ./62.webp
     ./63.webp
     ./64.webp
     ./65.webp
     ./66.webp
     ./67.webp
     ./68.webp
     ./69.webp
     ./70.webp
     ./71.webp
     ./72.webp
     ./73.webp
     ./74.webp
     ./75.webp
     ./76.webp
     ./77.webp
     ./78.webp
     ./79.webp
     ./80.webp
     ./81.webp
     ./82.webp
     ./83.webp
     ./84.webp
     ./85.webp
     ./86.webp
     ./87.webp
     ./88.webp
     ./89.webp
     ./90.webp
     ./91.webp
     ./92.webp
     ./93.webp
     ./94.webp
     ./95.webp
     ./96.webp
     ./97.webp
     ./98.webp
     ./99.webp
     ./100.webp
     ./101.webp
     ./102.webp
     ./103.webp
     ./104.webp
     ./105.webp
     ./106.webp
     ./107.webp
     ./108.webp
     ./109.webp
     ./110.webp
     ./111.webp
     ./112.webp
     ./113.webp
     ./114.webp
     ./115.webp
     ./116.webp
     ./117.webp
     ./118.webp
     ./119.webp
     ./120.webp
     ./121.webp
     ./122.webp
     ./123.webp
     ./124.webp
     ./125.webp
     ./126.webp
     ./127.webp
     ./128.webp
     ./129.webp
     ./130.webp
     ./131.webp
     ./132.webp
     ./133.webp
     ./134.webp
     ./135.webp
     ./136.webp
     ./137.webp
     ./138.webp
     ./139.webp
     ./140.webp
     ./141.webp
     ./142.webp
     ./143.webp
     ./144.webp
     ./145.webp
     ./146.webp
     ./147.webp
     ./148.webp
     ./149.webp
     ./150.webp
     ./151.webp
     ./152.webp
     ./153.webp
     ./154.webp
     ./155.webp
     ./156.webp
     ./157.webp
     ./158.webp
     ./159.webp
     ./160.webp
     ./161.webp
     ./162.webp
     ./163.webp
     ./164.webp
     ./165.webp
     
 `;
  return data.split("\n")[index];
}

const frameCount = 165;

const images = [];
const imageSeq = {
  frame: 1,
};

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = files(i);
  images.push(img);
}

gsap.to(imageSeq, {
  frame: frameCount - 1,
  snap: "frame",
  ease: `none`,
  scrollTrigger: {
    scrub: 0.15,
    trigger: `#page>canvas`,
    start: `top top`,
    end: `600% top`,
    scroller: `#main`,
  },
  onUpdate: render,
});

images[1].onload = render;

function render() {
  scaleImage(images[imageSeq.frame], context);
}



function scaleImage(img, ctx) {
  const canvas = ctx.canvas;

  let ratio;
  let centerShift_x;
  let centerShift_y;

  // 📱 Mobile (max-width: 600px)
  if (window.matchMedia('(max-width: 600px)').matches) {
    // console.log("📱 Mobile");

    ratio = (canvas.width / img.width) * 1.6; // More zoom on mobile
    centerShift_x = (canvas.width - img.width * ratio) / 3;
    centerShift_y = canvas.height - img.height * ratio;

  }
  // 💻 Tablet (768px – 1024px)
  else if (window.matchMedia('(min-width: 601px) and (max-width: 1024px)').matches) {
    // console.log("💻 Tablet");

    ratio = (canvas.width / img.width) * 1.1; // Medium zoom on tablet
    centerShift_x = (canvas.width - img.width * ratio) / 2;
    centerShift_y = (canvas.height - img.height * ratio) ;
  }
  // 🖥 Desktop (above 1024px)
  else {
    // console.log("🖥 Desktop");

    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    ratio = Math.min(hRatio, vRatio)*0.8; // Fit on desktop (contain)
    centerShift_x = (canvas.width - img.width * ratio) / 1.5;
    centerShift_y = canvas.height - img.height * ratio;
  }

  // Clear and draw image to canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    centerShift_x,
    centerShift_y,
    img.width * ratio,
    img.height * ratio
  );
}











/* ********************************* SCROLL TRIGGER FOR ALL PAGES  SECTION ************************************* */


ScrollTrigger.create({
  trigger: "#page>canvas",
  pin: true,
  // markers:true,
  scroller: `#main`,
  start: `top top`,
  end: `600% top`,
});



gsap.to("#page1",{
  scrollTrigger:{
    trigger:`#page1`,
    start:`top top`,
    end:`bottom top`,
    pin:true,
    scroller:`#main`
  }
});
gsap.to("#page2",{
  scrollTrigger:{
    trigger:`#page2`,
    start:`top top`,
    end:`bottom top`,
    pin:true,
    scroller:`#main`
  }
});
gsap.to("#page3",{
  scrollTrigger:{
    trigger:`#page3`,
    start:`top top`,
    end:`bottom top`,
    pin:true,
    scroller:`#main`
  }
});


gsap.to("#page4",{
  scrollTrigger:{
    trigger:`#page4`,
    start:`top top`,
    end:`bottom top`,
    pin:true,
    scroller:`#main`
  }
});

/* ********************************* SCROLL TRIGGER FOR ALL PAGES  SECTION ************************************* */





/* ********************************* MOUSE FOLLOWER  SECTION ************************************* */

document.addEventListener("mousemove", function (e) {
  const trail = document.createElement("div");
  trail.className = "code-trail";

  const symbols = ["<", "/", "{", "}", ">", "=", ":", ";","HTML","CSS","JS"];
  trail.textContent = symbols[Math.floor(Math.random() * symbols.length)];

  // Set random color
  const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
  trail.style.color = randomColor;

  trail.style.left = e.pageX + "px";
  trail.style.top = e.pageY + "px";

  document.getElementById("trail-container").appendChild(trail);

  setTimeout(() => {
    trail.remove();
  }, 1000);
});

/* ********************************* MOUSE FOLLOWER  SECTION ************************************* */





/* ********************************* SHERY JS 3D  SECTION ************************************* */


// window.addEventListener("load", () => {
//   // Detect screen width (you can also use user agent for more accuracy)
//   const isDesktop = window.innerWidth >= 1024; // adjust breakpoint as needed

//   if (isDesktop) {
//     // Apply image effect to each .text img
//     document.querySelectorAll(".text img").forEach((el, i) => {
//       el.classList.add(`shery-img-${i}`);

//       Shery.imageEffect(`.shery-img-${i}`, {
//         style: 4,
//         debug: false,
//         gooey: false,
//         config: {
//           // your config stays here
//           "uColor": { "value": false },
//           "uSpeed": { "value": 0.56, "range": [0.1, 1], "rangep": [1, 10] },
//           "uAmplitude": { "value": 1.72, "range": [0, 5] },
//           "uFrequency": { "value": 1.37, "range": [0, 10] },
//           "geoVertex": { "range": [1, 64], "value": 32 },
//           "zindex": { "value": "9996999", "range": [-9999999, 9999999] },
//           "aspect": { "value": 1 },
//           "ignoreShapeAspect": { "value": true },
//           "shapePosition": { "value": { "x": 0, "y": 0 } },
//           "shapeScale": { "value": { "x": 0.5, "y": 0.5 } },
//           "shapeEdgeSoftness": { "value": 0, "range": [0, 0.5] },
//           "shapeRadius": { "value": 0, "range": [0, 2] },
//           "currentScroll": { "value": 0 },
//           "scrollLerp": { "value": 0.07 },
//           "gooey": { "value": false },
//           "infiniteGooey": { "value": false },
//           "growSize": { "value": 4, "range": [1, 15] },
//           "durationOut": { "value": 1, "range": [0.1, 5] },
//           "durationIn": { "value": 1.5, "range": [0.1, 5] },
//           "displaceAmount": { "value": 0.5 },
//           "masker": { "value": false },
//           "maskVal": { "value": 1, "range": [1, 5] },
//           "scrollType": { "value": 0 },
//           "noEffectGooey": { "value": true },
//           "onMouse": { "value": 1 },
//           "noise_speed": { "value": 0.2, "range": [0, 10] },
//           "metaball": { "value": 0.2, "range": [0, 2] },
//           "discard_threshold": { "value": 0.5, "range": [0, 1] },
//           "antialias_threshold": { "value": 0.002, "range": [0, 0.1] },
//           "noise_height": { "value": 0.5, "range": [0, 2] },
//           "noise_scale": { "value": 10, "range": [0, 100] }
//         }
//       });
//     });
//   } else {
//     // console.log("👋 Shery.js effect skipped on mobile");
//   }
// });




Shery.makeMagnet(".text" /* Element to target.*/, {
  //Parameters are optional.
  ease: "cubic-bezier(0.23, 1, 0.320, 1)",
  duration: 0.5,
});




setTimeout(() => {
  document.querySelectorAll("canvas").forEach((canvas) => {
    if (!canvas.classList.contains("canvas")) {
      canvas.style.background = "transparent";
      canvas.style.backgroundColor = "transparent";
      canvas.style.mixBlendMode = "multiply"; // Try "screen" or "overlay" too
    }
  });
}, 500);


/* ********************************* SHERY JS 3D  SECTION ************************************* */

















// Function to place images in a circular layout
function placeImages(container, imageURLs, radius) {
  let angleIncrement = Math.PI * 2 / imageURLs.length;
  let images = [];

  for (let i = 0; i < imageURLs.length; i++) {
    let image = new Image();
    images.push(image);
    container.appendChild(image);

    let angle = angleIncrement * i;
    gsap.set(image, {
      attr: { src: imageURLs[i] },
      position: "absolute",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      transformOrigin: "50% 50%",
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      width: 70,
      height: 70
    });
  }
  return images;
}

// ===================== FIRST CIRCLE =====================
/* -------------------------
   ICON IMAGE URLS
------------------------- */
const ICON_URLS = [
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
  "./images/icons8-tailwind-css-480.png",
  "./images/bootstrap-5-1.svg"
];

const circleEl = document.getElementById('circle');
const wrapperEl = document.getElementById('iconsWrapper');

// Read CSS variables
const iconSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--icon-size'));
const borderWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--border-width'));

// Create icons
ICON_URLS.forEach(url => {
  const img = document.createElement('img');
  img.src = url;
  wrapperEl.appendChild(img);
});

function positionIcons() {
  const rect = circleEl.getBoundingClientRect();
  const radius = rect.width / 1.75; // Distance from center to circle edge
  
  // Adjust so icons sit ON the border line
  const placementRadius = radius - (iconSize / 2) - (borderWidth / 2);

  const images = wrapperEl.querySelectorAll('img');
  const step = (Math.PI * 2) / images.length; // Equal angular spacing

  images.forEach((img, i) => {
    const angle = step * i;
    const x = Math.cos(angle) * placementRadius;
    const y = Math.sin(angle) * placementRadius;

    gsap.set(img, { x: x, y: y });
  });
}

positionIcons();

// Rotation animation
const spin = gsap.timeline({ repeat: -1, defaults:{ duration: 50, ease:'none' } })
  .to(wrapperEl, { rotation: 360 })
  .to(wrapperEl.querySelectorAll('img'), { rotation: -360 }, 0);

Draggable.create(wrapperEl, {
  type: "rotation",
  inertia: true,
  onPressInit: () => spin.pause(),
  onDrag: function(){
    const angle = (this.rotation + 360 * 100000) % 360;
    spin.progress(angle / 360);
  },
  onThrowUpdate: function(){
    const angle = (this.rotation + 360 * 100000) % 360;
    spin.progress(angle / 360);
  },
  onThrowComplete: () => spin.resume()
});

window.addEventListener('resize', positionIcons);






// const circle2 = document.querySelector(".icons-wrapper2");
// const imageURLs2 = [
//   "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
//   "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
//   "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
//   "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
//   "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
//   "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
//   "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
//   "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
//   "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
// ];

// const images2 = placeImages(circle2, imageURLs2, 200);
// const spin2 = gsap.timeline({ repeat: -1, defaults: { duration: 50, ease: "none" } })
//   .to(circle2, { rotation: -360 })
//   .to(images2, { rotation: 360 }, 0);

// Draggable.create(circle2, {
//   type: "rotation",
//   inertia: true,
//   onPressInit: () => spin2.pause(),
//   onDrag: function () {
//     let angle = (this.rotation + 360 * 100000) % 360;
//     spin2.progress(angle / 360);
//   },
//   onThrowUpdate: function () {
//     let angle = (this.rotation + 360 * 100000) % 360;
//     spin2.progress(angle / 360);
//   },
//   onThrowComplete: () => {
//     spin2.resume();
//     gsap.fromTo(spin2, { timeScale: 0 }, { duration: 1, timeScale: 1, ease: "power1.in" });
//   }
// });


