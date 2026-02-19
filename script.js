// --- 1. XỬ LÝ ẢNH (Upload, Zoom, Drag) ---
const fileInput = document.getElementById('upload-input');
const imgElement = document.getElementById('student-photo');

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => { 
            imgElement.src = e.target.result; 
            resetImage();
        };
        reader.readAsDataURL(file);
    }
});

let scale = 1; 
let isDragging = false;
let startX, startY;
let currentLeft = 0; 
let currentTop = 0;

function updateZoom() {
    scale = parseFloat(document.getElementById('zoom-range').value);
    document.getElementById('zoom-val').innerText = Math.round(scale * 100) + "%";
    applyTransform();
}

function applyTransform() {
    imgElement.style.transform = `translate(${currentLeft}px, ${currentTop}px) scale(${scale})`;
}

function startDrag(e) {
    if (e.target.className === 'overlay-hint') return;
    isDragging = true;
    startX = e.clientX - currentLeft;
    startY = e.clientY - currentTop;
    imgElement.style.transition = 'none';
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    currentLeft = e.clientX - startX;
    currentTop = e.clientY - startY;
    applyTransform();
}

function endDrag() {
    isDragging = false;
    imgElement.style.transition = 'transform 0.1s ease-out';
}

function resetImage() {
    scale = 1; 
    currentLeft = 0; 
    currentTop = 0;
    document.getElementById('zoom-range').value = 1;
    document.getElementById('zoom-val').innerText = "100%";
    applyTransform();
}

// --- 2. CÁC CHỨC NĂNG KHÁC ---
let starCount = 3;
function changeStars() {
    starCount = (starCount % 5) + 1;
    document.querySelector('.rating-stars').innerText = '★'.repeat(starCount);
}

// --- 3. ĐỒNG BỘ MÃ SỐ VÀ MÃ VẠCH ---
const idInput = document.getElementById('id-input');
const barcodeDisplay = document.getElementById('barcode-display');

idInput.addEventListener('input', function() {
    // Lấy text đang gõ, xóa khoảng trắng thừa ở hai đầu và bọc trong dấu *
    const currentID = this.innerText.trim();
    barcodeDisplay.innerText = '*' + currentID + '*';
});

// --- 4. XUẤT ẢNH ---
function downloadCard(side) {
    const cardElement = (side === 'front') ? document.getElementById('cardFront') : document.getElementById('cardBack');
    const nameText = document.querySelector('.student-name').innerText.trim();
    const fileName = nameText.replace(/\s+/g, '_') || 'student';
    
    html2canvas(cardElement, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: null,
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `ID_${fileName}_${side}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}