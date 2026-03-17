const toppings = document.querySelectorAll(".topping");
const parfaitArea = document.getElementById("parfait-area");
const resetBtn = document.getElementById("resetBtn");
const undoBtn = document.getElementById("undoBtn");
const rotateBtn = document.getElementById("rotateBtn");
const rotateSlider = document.getElementById("rotateSlider");
const sizeSlider = document.getElementById("sizeSlider");
const deleteBtn = document.getElementById("deleteBtn");
const finishBtn = document.getElementById("finishBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");


let selectedTopping = null;

// Click topping to add a clone
let distributionOffset = 0; // keeps rotation between clicks

toppings.forEach(topping => {
  topping.addEventListener("click", () => {

    const totalPieces = 18;

    const areaWidth = parfaitArea.clientWidth;
    const areaHeight = parfaitArea.clientHeight;

    const centerX = areaWidth / 2;
    const centerY = areaHeight / 2 - 12;

    const pizzaRadius = Math.min(areaWidth, areaHeight) / 2 - 45;

    const pieces = [];
    
    // 🟢 1️⃣ Center piece
    pieces.push({ x: centerX, y: centerY });

    // 🟢 2️⃣ Inner ring
    const innerCount = 6;
    const innerRadius = pizzaRadius * 0.45;
    
    for (let i = 0; i < innerCount; i++) {
      const angle = (i / innerCount) * Math.PI * 2 + distributionOffset;
      pieces.push({
        x: centerX + innerRadius * Math.cos(angle),
        y: centerY + innerRadius * Math.sin(angle)
      });
    }

    // 🟢 3️⃣ Outer ring
    const outerCount = totalPieces - innerCount - 1;
    const outerRadius = pizzaRadius * 0.85;

    for (let i = 0; i < outerCount; i++) {
      const angle = (i / outerCount) * Math.PI * 2 + distributionOffset;
      pieces.push({
        x: centerX + outerRadius * Math.cos(angle),
        y: centerY + outerRadius * Math.sin(angle)
      });
    }

    // 🔥 Create toppings
    // 🔥 Create toppings
pieces.forEach((pos, i) => {
  const clone = topping.cloneNode(true);
  clone.classList.add("draggable");

  const randomShift = 12;
  const toppingSize = topping.clientWidth;
  const halfSize = toppingSize / 2;

  clone.style.left =
    pos.x - halfSize + (Math.random() - 0.5) * randomShift + "px";
  clone.style.top =
    pos.y - halfSize + (Math.random() - 0.5) * randomShift + "px";

  clone.style.zIndex = Date.now() + i;

  // ✅ Set default scale
  let defaultScale = 0.8;

  // ✅ Increase size automatically for specific toppings
  const srcName = topping.src.split("/").pop(); // extract filename
  if (srcName === "cabbage_scatter.png" || srcName === "cheese.png" || srcName === "corn.png"|| srcName === "bacon.png") {
    defaultScale = 1.2; // increase size (adjust as needed)
  }
 const srcNamesmall = topping.src.split("/").pop(); // extract filename
  if (srcNamesmall === "carrots.png" || srcName === "mushroom.png" ) {
    defaultScale = .75; // increase size (adjust as needed)
  }
  clone.dataset.scale = defaultScale;

  // Random rotation as before
  clone.dataset.rotation = Math.random() * 360;

  makeDraggable(clone);
  applyTransform(clone);

  clone.addEventListener("mousedown", () => {
    document.querySelectorAll(".selected").forEach(el =>
      el.classList.remove("selected")
    );
    clone.classList.add("selected");
    selectedTopping = clone;
    rotateSlider.value = clone.dataset.rotation;
    sizeSlider.value = clone.dataset.scale;
  });

  parfaitArea.appendChild(clone);
});

    // Rotate pattern for next vegetable
    distributionOffset += Math.PI / 2; 
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

// Drag behavior + bring to front
function makeDraggable(element) {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  element.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;

    // 🔄 Bring to front when clicked
    element.style.zIndex = Date.now();
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
function toggleFullscreen(){

  if(!document.fullscreenElement){
    document.documentElement.requestFullscreen();
    document.body.classList.add("fullscreen-mode");
  }else{
    document.exitFullscreen();
    document.body.classList.remove("fullscreen-mode");
  }

}
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


//rotate slicder
rotateSlider.addEventListener("input", () => {
  if (!selectedTopping) return;

  selectedTopping.dataset.rotation = rotateSlider.value;
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
/***finishBtn.addEventListener("click", () => {
  html2canvas(parfaitArea).then(canvas => {
    const imageData = canvas.toDataURL("image/png");

    // Save image temporarily
    sessionStorage.setItem("parfaitImage", imageData);

    // Go to finished page
    window.location.href = "finished.html";
     // 🆕 Open finished page in new tab
   // window.open("finished.html", "_blank");
  });
});**/
// --- Fullscreen button ---
fullscreenBtn.addEventListener("click", () => {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().then(() => {
      document.body.classList.add("fullscreen-mode"); // scale pizza & controls
    });
  }
});

// --- Done button ---
// --- Done button ---
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
    document.documentElement.requestFullscreen().then(() => {
      window.location.href = "finished.html";
    });

  });

});

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
