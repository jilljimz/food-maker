document.addEventListener("paste", (event) => {
  const items = event.clipboardData.items;

  for (const item of items) {
    if (item.type.startsWith("image/")) {
      const blob = item.getAsFile();
      const url = URL.createObjectURL(blob);

      // Clear page
      document.body.innerHTML = "";

      // Create image
      const img = document.createElement("img");
      img.src = url;
      img.id = "preview";

      document.body.appendChild(img);
      break;
    }
  }
});
