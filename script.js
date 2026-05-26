let currentImage = null;
let currentPreset = 'original';

const uploadArea = document.getElementById('uploadArea');
const imageUpload = document.getElementById('imageUpload');
const previewSection = document.getElementById('previewSection');
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');
const printBtn = document.getElementById('printBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const presets = document.querySelectorAll('.preset-card');

// Subir imagen
uploadArea.addEventListener('click', () => imageUpload.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.background = '#e8eaff';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.background = '#f8f9ff';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.background = '#f8f9ff';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    }
});

imageUpload.addEventListener('change', (e) => {
    if (e.target.files[0]) loadImage(e.target.files[0]);
});

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            currentImage = img;
            canvas.width = img.width;
            canvas.height = img.height;
            applyPreset(currentPreset);
            previewSection.style.display = 'block';
            previewSection.scrollIntoView({ behavior: 'smooth' });
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Presets
presets.forEach(preset => {
    preset.addEventListener('click', () => {
        presets.forEach(p => {
            p.classList.remove('active');
        });
        preset.classList.add('active');
        currentPreset = preset.dataset.preset;
        applyPreset(currentPreset);
    });
});

function applyPreset(preset) {
    if (!currentImage) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
    
    if (preset !== 'original') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            
            switch(preset) {
                // Presets profesionales para estudio fotográfico
                case 'studio':
                    // Retrato profesional
                    r = Math.min(255, r * 1.08);
                    g = Math.min(255, g * 1.06);
                    b = Math.min(255, b * 1.04);
                    break;
                    
                case 'golden':
                    // Hora dorada - cálido
                    r = Math.min(255, r * 1.12);
                    g = Math.min(255, g * 1.08);
                    b = Math.min(255, b * 0.92);
                    break;
                    
                case 'fresh':
                    // Limpio y fresco
                    r = Math.min(255, r * 1.05);
                    g = Math.min(255, g * 1.05);
                    b = Math.min(255, b * 1.1);
                    break;
                    
                case 'dreamy':
                    // Suave y soñador
                    r = Math.min(255, r * 1.07);
                    g = Math.min(255, g * 1.05);
                    b = Math.min(255, b * 1.07);
                    break;
                    
                case 'moody':
                    // Elegante y dramático
                    r = Math.min(255, r * 0.95);
                    g = Math.min(255, g * 0.92);
                    b = Math.min(255, b * 0.9);
                    break;
                    
                case 'vintage':
                    // Estilo vintage
                    r = Math.min(255, r * 1.12);
                    g = Math.min(255, g * 0.98);
                    b = Math.min(255, b * 0.88);
                    break;
                    
                case 'bw':
                    // Blanco y negro clásico
                    const gray = (r + g + b) / 3;
                    r = gray;
                    g = gray;
                    b = gray;
                    break;
                    
                case 'bwDramatic':
                    // Blanco y negro dramático
                    const gray2 = (r * 0.3 + g * 0.59 + b * 0.11);
                    r = Math.min(255, gray2 * 1.15);
                    g = Math.min(255, gray2 * 1.15);
                    b = Math.min(255, gray2 * 1.15);
                    break;
                    
                case 'summer':
                    // Vibrante veraniego
                    r = Math.min(255, r * 1.1);
                    g = Math.min(255, g * 1.12);
                    b = Math.min(255, b * 0.95);
                    break;
                    
                case 'matte':
                    // Acabado mate
                    r = Math.min(255, r * 1.05);
                    g = Math.min(255, g * 1.05);
                    b = Math.min(255, b * 1.05);
                    break;
                    
                case 'rose':
                    // Rose gold
                    r = Math.min(255, r * 1.1);
                    g = Math.min(255, g * 1.02);
                    b = Math.min(255, b * 0.95);
                    break;
                    
                // Mantén los originales por compatibilidad
                case 'glam':
                    r = Math.min(255, r * 1.1);
                    g = Math.min(255, g * 1.08);
                    b = Math.min(255, b * 1.05);
                    break;
                case 'soft':
                    r = Math.min(255, r * 1.05);
                    g = Math.min(255, g * 1.05);
                    b = Math.min(255, b * 1.08);
                    break;
                case 'bright':
                    r = Math.min(255, r * 1.2);
                    g = Math.min(255, g * 1.15);
                    b = Math.min(255, b * 1.1);
                    break;
                case 'warm':
                    r = Math.min(255, r * 1.15);
                    g = Math.min(255, g * 1.05);
                    b = Math.min(255, b * 0.9);
                    break;
            }
            
            data[i] = r;
            data[i+1] = g;
            data[i+2] = b;
        }
        ctx.putImageData(imageData, 0, 0);
    }
}

resetBtn.addEventListener('click', () => {
    if (currentImage) {
        currentPreset = 'original';
        presets.forEach(p => {
            p.classList.remove('active');
        });
        document.querySelector('.preset-card').classList.add('active');
        applyPreset('original');
    }
});

printBtn.addEventListener('click', () => {
    if (!currentImage) return;
    const win = window.open('', '_blank');
    win.document.write(`
        <html>
        <head>
            <title>Imprimir Foto</title>
            <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: white; }
                img { max-width: 100%; height: auto; }
                @media print {
                    body { margin: 0; padding: 0; }
                    img { max-width: 100%; }
                }
            </style>
        </head>
        <body>
            <img src="${canvas.toDataURL('image/jpeg', 1.0)}">
            <script>
                window.onload = () => {
                    setTimeout(() => {
                        window.print();
                        window.onafterprint = () => window.close();
                    }, 100);
                };
            <\/script>
        </body>
        </html>
    `);
    win.document.close();
});

downloadBtn.addEventListener('click', () => {
    if (!currentImage) return;
    const link = document.createElement('a');
    link.download = `sesionglam-${Date.now()}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
});