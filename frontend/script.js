
// Select HTML elements
const fileInput = document.getElementById("fileInput");
const browseBtn = document.getElementById("browseBtn");
const previewContainer = document.getElementById("previewContainer");

// Open file selector
browseBtn.addEventListener("click", function () {
    fileInput.click();
});

// Handle selected images
fileInput.addEventListener("change", function () {

    const files = fileInput.files;

    // Clear previous previews
    previewContainer.innerHTML = "";

    // Process each selected file
    Array.from(files).forEach(function (file) {

        // Check whether file is an image
        if (!file.type.startsWith("image/")) {
            return;
        }

        // Create image URL
        const imageURL = URL.createObjectURL(file);

        // Create image element
        const img = document.createElement("img");

        img.src = imageURL;
        img.alt = file.name;

        // Add image to gallery
        previewContainer.appendChild(img);

    });

});
