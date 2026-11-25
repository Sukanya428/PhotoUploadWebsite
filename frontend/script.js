const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const uploadBox = document.getElementById('uploadBox');
const previewContainer = document.getElementById('previewContainer');
const veilAllBtn = document.getElementById('veilAllBtn');
const aiVisionToggle = document.getElementById('aiVisionToggle');
const modeButtons = document.querySelectorAll('.mode-btn');

let currentMode = 'Balanced';

// 1. Protection Mode Selector (Subtle / Balanced / Max Shield)
modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        modeButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.textContent.trim();
    });
});

// 2. Browse & Drag-Drop File Upload
browseBtn.addEventListener('click', () => fileInput.click());

uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = '#7c3aed';
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.style.borderColor = '';
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = '';
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

// 3. Render Uploaded Images with Before/After Slider Ready
function handleFiles(files) {
    if (!files.length) return;
    veilAllBtn.style.display = 'inline-flex';

    Array.from(files).forEach((file) => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            createPhotoCard(event.target.result, file.name);
        };
        reader.readAsDataURL(file);
    });

    // Smooth scroll to gallery
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
}

function createPhotoCard(imgSrc, fileName) {
    const card = document.createElement('div');
    card.className = 'photo-card';

    card.innerHTML = `
        <div class="pv-compare-box">
            <!-- AFTER (Base Layer) -->
            <img src="${imgSrc}" class="pv-after-img" alt="Shielded Photo">
            <span class="pv-badge pv-badge-after" style="display: none;">SHIELDED (${currentMode.toUpperCase()})</span>

            <!-- BEFORE (Clipped Overlay Layer) -->
            <div class="pv-before-overlay" style="width: 100%;">
                <img src="${imgSrc}" class="pv-before-img" alt="Original Photo">
                <span class="pv-badge pv-badge-before">ORIGINAL</span>
            </div>

            <!-- Draggable Slider Line (Hidden until Veiled) -->
            <div class="pv-slider-line" style="display: none; left: 50%;">
                <div class="pv-slider-handle">‹ ›</div>
            </div>
        </div>

        <div class="pv-card-footer">
            <button type="button" class="pv-action-btn">🛡️ Apply PixelVeil (${currentMode})</button>
            <a href="${imgSrc}" download="pixelveil_${fileName}" class="pv-download-btn" style="display: none;" title="Download Protected Photo">⬇</a>
        </div>
    `;

    previewContainer.appendChild(card);

    const compareBox = card.querySelector('.pv-compare-box');
    const beforeOverlay = card.querySelector('.pv-before-overlay');
    const beforeImg = card.querySelector('.pv-before-img');
    const sliderLine = card.querySelector('.pv-slider-line');
    const afterBadge = card.querySelector('.pv-badge-after');
    const veilBtn = card.querySelector('.pv-action-btn');
    const downloadBtn = card.querySelector('.pv-download-btn');

    // Sync Before image width so it never squishes while sliding
    const syncWidth = () => {
        beforeImg.style.width = `${compareBox.offsetWidth}px`;
    };
    syncWidth();
    window.addEventListener('resize', syncWidth);

    // Apply PixelVeil Shield Action
    const applyShield = () => {
        if (veilBtn.classList.contains('shielded')) return;

        veilBtn.textContent = '⏳ Cloaking Pixels...';
        veilBtn.disabled = true;

        // Note: Yahan future mein tumhara FastAPI/Python backend fetch call lagega
        setTimeout(() => {
            syncWidth();
            beforeOverlay.style.width = '50%';
            sliderLine.style.left = '50%';
            sliderLine.style.display = 'block';
            afterBadge.style.display = 'block';
            afterBadge.textContent = `SHIELDED • ${currentMode.toUpperCase()}`;

            veilBtn.disabled = false;
            veilBtn.classList.add('shielded');
            veilBtn.textContent = '✓ Protected — Drag Slider';
            downloadBtn.style.display = 'inline-block';
        }, 900);
    };

    veilBtn.addEventListener('click', applyShield);
    card.applyShield = applyShield; // Store reference for "Veil All" button

    // Interactive Drag Logic (Mouse + Touch)
    let isDragging = false;

    const updatePosition = (clientX) => {
        if (!veilBtn.classList.contains('shielded')) return;
        const rect = compareBox.getBoundingClientRect();
        const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        beforeOverlay.style.width = `${percent}%`;
        sliderLine.style.left = `${percent}%`;
    };

    compareBox.addEventListener('mousedown', (e) => {
        isDragging = true;
        updatePosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        if (isDragging) updatePosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    compareBox.addEventListener('touchstart', (e) => {
        isDragging = true;
        updatePosition(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', (e) => {
        if (isDragging) updatePosition(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// 4. Veil All Selected Photos at Once
veilAllBtn.addEventListener('click', () => {
    document.querySelectorAll('.photo-card').forEach((card) => {
        if (card.applyShield) card.applyShield();
    });
});

// 5. Simulate AI Neural Vision Toggle
aiVisionToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        previewContainer.classList.add('ai-vision-mode');
    } else {
        previewContainer.classList.remove('ai-vision-mode');
    }
});