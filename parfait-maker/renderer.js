const toppings = document.querySelectorAll(".topping");
const parfaitArea = document.getElementById("parfait-area");
const resetBtn = document.getElementById("resetBtn");
const undoBtn = document.getElementById("undoBtn");
const rotateBtn = document.getElementById("rotateBtn");
const rotateSlider = document.getElementById("rotateSlider");
const sizeSlider = document.getElementById("sizeSlider");
const deleteBtn = document.getElementById("deleteBtn");
const finishBtn = document.getElementById("finishBtn");
const bringForwardBtn = document.getElementById("bringForwardBtn");
const sendBackwardBtn = document.getElementById("sendBackwardBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");


let selectedTopping = null;
let zCounter = 1; // incremental z-index counter
// Click topping to add a clone
// Track current max zIndex


// When you click a topping to add it:
// Click topping to add a clone
toppings.forEach(topping => {
  topping.addEventListener("click", () => {

    const clone = topping.cloneNode(true);
    clone.classList.add("draggable"); // drop-in effect

    // Controlled horizontal scatter
    const centerX = parfaitArea.clientWidth / 2 - 50; // center minus half topping width
    const spread = 80; // max deviation left/right
    const randomX = centerX + (Math.random() * 2 - 1) * spread;
    clone.style.left = `${randomX}px`;
    clone.style.top = `110px`;

    // Set initial transform data
    clone.dataset.rotation = "0";
    clone.dataset.scale = "0.8";
    clone.style.zIndex = Date.now(); // initial z-index
    applyTransform(clone);
    makeDraggable(clone);

    // Select topping when clicked
    clone.addEventListener("mousedown", () => {
      document.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));
      clone.classList.add("selected");
      selectedTopping = clone;

      rotateSlider.value = clone.dataset.rotation;
      sizeSlider.value = clone.dataset.scale;
    });

    parfaitArea.appendChild(clone);
  });
});

// Undo last topping
undoBtn.addEventListener("click", () => {
  const layers = parfaitArea.querySelectorAll(".draggable");
  if (layers.length > 0) {
    layers[layers.length - 1].remove();
  }
});

// Reset parfait
resetBtn.addEventListener("click", () => {
  const draggedToppings = parfaitArea.querySelectorAll(".draggable");
  draggedToppings.forEach(topping => topping.remove());
});

// --- DRAGGING ---
function makeDraggable(element) {
  let offsetX = 0, offsetY = 0, isDragging = false;

  element.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    element.style.zIndex = zCounter++; // bring to top on drag
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const rect = parfaitArea.getBoundingClientRect();
    element.style.left = e.clientX - rect.left - offsetX + "px";
    element.style.top = e.clientY - rect.top - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

// --- TRANSFORM ---
function applyTransform(element) {
  const rotation = element.dataset.rotation || 0;
  const scale = element.dataset.scale || 1;
  element.style.transform = `rotate(${rotation}deg) scale(${scale})`;
}
//rotate button
/*rotateBtn.addEventListener("click", () => {
  if (!selectedTopping) return;

  let currentRotation = parseInt(selectedTopping.dataset.rotation);
  currentRotation += 15;

  selectedTopping.dataset.rotation = currentRotation;
  selectedTopping.style.transform = `rotate(${currentRotation}deg)`;
});*/
// Bring selected topping forward
// Swap z-index with next layer
// --- LAYER MOVEMENT ---
function moveLayer(selected, direction) {
  if (!selected) return;
  const layers = Array.from(parfaitArea.querySelectorAll(".draggable"));
  layers.sort((a, b) => parseInt(a.style.zIndex) - parseInt(b.style.zIndex));
  const index = layers.indexOf(selected);
  if (index === -1) return;

  if (direction === "up" && index < layers.length - 1) {
    const above = layers[index + 1];
    const temp = selected.style.zIndex;
    selected.style.zIndex = above.style.zIndex;
    above.style.zIndex = temp;
  } else if (direction === "down" && index > 0) {
    const below = layers[index - 1];
    const temp = selected.style.zIndex;
    selected.style.zIndex = below.style.zIndex;
    below.style.zIndex = temp;
  }
}


// --- BUTTONS ---
bringForwardBtn.addEventListener("click", () => moveLayer(selectedTopping, "up"));
sendBackwardBtn.addEventListener("click", () => moveLayer(selectedTopping, "down"));
deleteBtn.addEventListener("click", () => {
  if (!selectedTopping) return;
  selectedTopping.remove();
  selectedTopping = null;
});

// Arrow keys for rotation & layer swap
// --- KEYBOARD CONTROLS ---
document.addEventListener("keydown", (e) => {
  if (!selectedTopping) return;

  switch(e.key) {
    case "ArrowUp":
      moveLayer(selectedTopping, "up");
      e.preventDefault();
      break;
    case "ArrowDown":
      moveLayer(selectedTopping, "down");
      e.preventDefault();
      break;
    case "ArrowRight":
      selectedTopping.dataset.rotation = (parseFloat(selectedTopping.dataset.rotation) || 0) + 15;
      applyTransform(selectedTopping);
      e.preventDefault();
      break;
    case "ArrowLeft":
      selectedTopping.dataset.rotation = (parseFloat(selectedTopping.dataset.rotation) || 0) - 15;
      applyTransform(selectedTopping);
      e.preventDefault();
      break;
  }
});
fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    // Enter fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Safari
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE11
      document.documentElement.msRequestFullscreen();
    }
    document.body.classList.add("fullscreen-mode"); // optional: add a class for styling
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Safari
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE11
      document.msExitFullscreen();
    }
    document.body.classList.remove("fullscreen-mode"); // remove class
  }
});

//rotate slicder
rotateSlider.addEventListener("input", () => {
  if (!selectedTopping) return;

  selectedTopping.dataset.rotation = rotateSlider.value;
  applyTransform(selectedTopping);
});
// 🌟 Rotate selected topping with Left/Right arrow keys
document.addEventListener("keydown", (e) => {
  if (!selectedTopping) return;

  let rotation = parseFloat(selectedTopping.dataset.rotation) || 0;
  const step = 15; // degrees per key press

  if (e.key === "ArrowRight") {
    rotation += step; // clockwise
  } else if (e.key === "ArrowLeft") {
    rotation -= step; // counterclockwise
  } else {
    return; // exit if other key
  }

  e.preventDefault(); // prevent scrolling

  // Save and apply rotation
  selectedTopping.dataset.rotation = rotation;
  applyTransform(selectedTopping);
});
sizeSlider.addEventListener("input", () => {
  if (!selectedTopping) return;

  const scale = sizeSlider.value;
  selectedTopping.dataset.scale = scale;

  applyTransform(selectedTopping);
});
let lastWheelTime = 0;
// 🌟 Scale selected topping with pinch gesture (Ctrl + trackpad)
document.addEventListener("wheel", (e) => {
  if (!selectedTopping) return;

  // Only handle trackpad pinch gestures, not normal scroll
  const now = Date.now();
  if (now - lastWheelTime < 10) return; // simple throttle
  lastWheelTime = now;

  // Check if the event looks like a pinch (small deltaX, deltaY)
  // Most browsers report pinch as a wheel event with deltaMode = 0 (pixels)
  if (Math.abs(e.deltaY) < 0.5 && Math.abs(e.deltaX) < 0.5) return;

  e.preventDefault(); // Prevent page zoom

  let scale = parseFloat(selectedTopping.dataset.scale) || 1;
  const step = 0.05;

  if (e.deltaY < 0) {
    // Pinch out → increase size
    scale += step;
  } else if (e.deltaY > 0) {
    // Pinch in → decrease size
    scale -= step;
  }

  // Clamp scale
  scale = Math.min(Math.max(scale, 0.3), 3);

  selectedTopping.dataset.scale = scale;
  sizeSlider.value = scale; // keep slider in sync
  applyTransform(selectedTopping);
});
// Pinch-to-zoom on trackpad for selected topping
parfaitArea.addEventListener("wheel", (e) => {
  if (!selectedTopping) return;

  // Only handle pinch (usually ctrlKey is true)
  if (!e.ctrlKey) return;

  e.preventDefault(); // Prevent browser zoom

  let scale = parseFloat(selectedTopping.dataset.scale) || 1;
  const step = 0.05;

  // e.deltaY < 0 means pinch out (zoom in)
  if (e.deltaY < 0) {
    scale += step;
  } else {
    scale -= step;
  }

  // Clamp scale
  scale = Math.min(Math.max(scale, 0.3), 3);

  selectedTopping.dataset.scale = scale;
  sizeSlider.value = scale; // keep slider synced
  applyTransform(selectedTopping);
}, { passive: false });

deleteBtn.addEventListener("click", () => {
  if (!selectedTopping) return;

  selectedTopping.remove();
  selectedTopping = null;
});

finishBtn.addEventListener("click", () => {
  const target = document.getElementById("capture-frame");

  // stop animations (prevents ghosting)
  document.querySelectorAll(".draggable").forEach(t => {
    t.style.animation = "none";
    t.style.opacity = "1";
  });

  setTimeout(() => {
    html2canvas(document.getElementById("capture-frame"), {
      backgroundColor: null,
      useCORS: true,
      scale: 2
    }).then(canvas => {

      const finalImage = canvas.toDataURL("image/png");
      sessionStorage.setItem("parfaitImage", finalImage);

      window.location.href = "finished.html";
    });

  }, 100);
});
/*
finishBtn.addEventListener("click", () => {
  saveParfaitState();

  const target = document.getElementById("capture-frame");

  // 👇 WAIT for browser to finish rendering
  setTimeout(() => {

    html2canvas(target, {
      backgroundColor: null,
      useCORS: true,
      scale: 2
    }).then(canvas => {

      const padding = 80;

      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = canvas.width + padding * 2;
      finalCanvas.height = canvas.height + padding * 2;

      const ctx = finalCanvas.getContext("2d");

      ctx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);

      const x = (finalCanvas.width - canvas.width) / 2;
      const y = (finalCanvas.height - canvas.height) / 2;

      ctx.drawImage(canvas, x, y);

      sessionStorage.setItem("parfaitImage", finalCanvas.toDataURL("image/png"));

      window.location.href = "finished.html";
    });

  }, 100); // 👈 key fix (try 100–200ms)
});




/*
finishBtn.addEventListener("click", () => {
  saveParfaitState();

  const container = document.getElementById("container");
  const originalTransform = container.style.transform;
  container.style.transform = "scale(1)";
  container.style.transformOrigin = "center";

  const rect = parfaitArea.getBoundingClientRect();

  html2canvas(parfaitArea, {
    backgroundColor: null,
    useCORS: true,
    width: rect.width,
    height: rect.height,
    scale: 1
  }).then(canvas => {

    sessionStorage.setItem("parfaitImage", canvas.toDataURL("image/png"));

    // restore scale
    container.style.transform = originalTransform;

    // reset toppings
    const allToppings = parfaitArea.querySelectorAll(".draggable");
    allToppings.forEach(t => t.remove());

    // ENTER fullscreen then open finished page
      window.location.href = "finished.html";
  

  });

});*/

function saveParfaitState() {
  const toppings = [];

  document.querySelectorAll(".draggable").forEach(t => {
    toppings.push({
      src: t.src,
      left: t.style.left,
      top: t.style.top,
      rotation: t.dataset.rotation,
      scale: t.dataset.scale,
      zIndex: t.style.zIndex
    });
  });

  sessionStorage.setItem("parfaitState", JSON.stringify(toppings));
}

