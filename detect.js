// File: detect.js

// Variabel global untuk menyimpan file yang dipilih
let selectedFile = null;

// Elemen DOM
const fileInput = document.getElementById('fileInput');
const uploadZone = document.getElementById('uploadZone');
const previewZone = document.getElementById('previewZone');
const previewImg = document.getElementById('previewImg');
const fileNameSpan = document.getElementById('fileName');
const analyzeBtn = document.getElementById('analyzeBtn');
const loadingZone = document.getElementById('loadingZone');
const uploadPanel = document.getElementById('uploadPanel');
const resultPanel = document.getElementById('resultPanel');

// Data Penyakit Ikan (Indonesian translation, symptoms, and treatment recommendation)
const DISEASE_DETAILS = {
  'Bacterial infuction': {
    name: 'Infeksi Bakteri (Bacterial Infection)',
    severity: 'high',
    severityText: 'Tinggi',
    symptoms: [
      'Luka terbuka atau borok kemerahan pada permukaan kulit ikan.',
      'Sisik mengelupas atau rontok di area infeksi.',
      'Sirip gripis, robek, atau membusuk (Fin Rot).',
      'Perut membengkak (dropsy) atau mata menonjol (pop-eye).'
    ],
    treatment: [
      'Segera pisahkan ikan yang sakit ke tangki karantina.',
      'Lakukan pergantian air secara rutin (25-30% setiap hari) untuk menjaga sanitasi air.',
      'Berikan pengobatan antibakteri khusus ikan (seperti Oxytetracycline atau Enrofloxacin) sesuai dosis anjuran.',
      'Tambahkan garam ikan (1-3 gram per liter) guna mengurangi tingkat stres osmotik ikan.'
    ]
  },
  'Fungal infection': {
    name: 'Infeksi Jamur (Fungal Infection)',
    severity: 'medium',
    severityText: 'Sedang',
    symptoms: [
      'Tumbuh lapisan putih atau keabu-abuan menyerupai kapas pada kulit, sirip, atau mulut.',
      'Ikan terlihat sering menggosokkan badannya ke dekorasi atau dinding kolam.',
      'Gerakan renang melemah dan ikan cenderung menyendiri.',
      'Nafsu makan menurun drastis.'
    ],
    treatment: [
      'Karantina ikan ke tangki pengobatan mandiri.',
      'Berikan larutan anti-jamur (seperti Methylene Blue atau Malachite Green) sesuai dosis.',
      'Tingkatkan suhu air secara berkala hingga 28-30°C guna menghambat perkembangbiakan jamur.',
      'Bersihkan filter air dan pastikan sisa makanan tidak menumpuk di dasar wadah.'
    ]
  },
  'Healthy Fish': {
    name: 'Ikan Sehat (Healthy Fish)',
    severity: 'low',
    severityText: 'Rendah',
    symptoms: [
      'Kulit bersih tanpa bercak putih, lendir berlebih, atau luka kemerahan.',
      'Sirip utuh, tegak, dan bergerak aktif tanpa hambatan.',
      'Berenang dengan lincah, responsif, dan bernafsu makan tinggi.',
      'Napas teratur dan insang berwarna merah segar.'
    ],
    treatment: [
      'Pertahankan parameter air kolam dengan pembersihan teratur.',
      'Berikan pakan bergizi seimbang dengan porsi yang cukup dan tidak berlebihan.',
      'Lakukan tes kualitas air (pH, amonia, nitrit) secara berkala.',
      'Pastikan kepadatan ikan di dalam wadah tidak melebihi kapasitas.'
    ]
  },
  'Parasitic & viral infection': {
    name: 'Infeksi Parasit & Virus (Parasitic & Viral Infection)',
    severity: 'high',
    severityText: 'Tinggi',
    symptoms: [
      'Bintik-bintik putih halus seperti taburan garam di permukaan tubuh (White Spot/Ich).',
      'Lapisan kuning/keemasan seperti beludru tipis pada tubuh ikan (Velvet Disease).',
      'Ikan megap-megap di dekat pancuran air atau permukaan karena kesulitan bernapas.',
      'Lendir berlebih diproduksi pada permukaan tubuh.'
    ],
    treatment: [
      'Pindahkan ikan sakit segera; jenis infeksi ini menular dengan sangat cepat.',
      'Naikkan suhu air pelan-pelan ke 29-30°C untuk mempercepat siklus pelepasan parasit dari inang.',
      'Gunakan obat antiparasit khusus (misalnya campuran Formalin & Malachite Green atau Copper Sulfate).',
      'Matikan sistem pencahayaan akuarium saat masa karantina karena beberapa obat sensitif cahaya.'
    ]
  }
};

// Drag & Drop event listener
uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.style.borderColor = '#0066CC';
  uploadZone.style.background = '#f0f7ff';
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.style.borderColor = '#cbd5e1';
  uploadZone.style.background = '#fff';
});

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.style.borderColor = '#cbd5e1';
  uploadZone.style.background = '#fff';

  if (e.dataTransfer.files.length > 0) {
    handleFile(e.dataTransfer.files[0]);
  }
});

// File input change event
fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleFile(e.target.files[0]);
  }
});

// Click upload zone to trigger input click
uploadZone.addEventListener('click', (e) => {
  // Jika yang diklik adalah tombol .btn-upload, biarkan event handler tombol (onclick) yang bekerja sendiri
  // dan abaikan agar tidak mentrigger click untuk kedua kalinya.
  if (e.target.closest('.btn-upload')) {
    return;
  }
  fileInput.click();
});

// Handle the selected file
function handleFile(file) {
  // Validasi tipe file
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    alert('Format file tidak didukung! Pilih gambar JPG, PNG, atau WEBP.');
    return;
  }

  // Validasi ukuran (maksimal 16MB)
  if (file.size > 16 * 1024 * 1024) {
    alert('Ukuran gambar terlalu besar! Maksimal 16MB.');
    return;
  }

  selectedFile = file;
  fileNameSpan.textContent = file.name;

  // Tampilkan preview gambar
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    document.getElementById('resultImg').src = e.target.result;
    uploadZone.style.display = 'none';
    previewZone.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

// Ganti foto
function resetUpload() {
  selectedFile = null;
  fileInput.value = '';
  previewImg.src = '';
  fileNameSpan.textContent = '';
  previewZone.style.display = 'none';
  uploadZone.style.display = 'block';
}

// Memperbarui langkah visual loading panel
function updateLoadingStep(stepNum) {
  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById(`ls${i}`);
    if (i < stepNum) {
      stepEl.className = 'ls-item done';
    } else if (i === stepNum) {
      stepEl.className = 'ls-item active';
    } else {
      stepEl.className = 'ls-item';
    }
  }
}

// Jalankan analisis gambar
async function analyzeImage() {
  if (!selectedFile) return;

  // Tampilkan loading screen
  previewZone.style.display = 'none';
  loadingZone.style.display = 'block';
  updateLoadingStep(1);

  const formData = new FormData();
  formData.append('file', selectedFile);

  try {
    // Simulasi visual step loading (agar terkesan profesional & memberikan waktu bagi model memproses)
    setTimeout(() => updateLoadingStep(2), 500);
    setTimeout(() => updateLoadingStep(3), 1000);
    setTimeout(() => updateLoadingStep(4), 1600);

    // Request ke API Backend FastAPI menggunakan URL absolut lokal
    // Nanti ganti dengan URL Hugging Face Anda saat deployment (misal: https://namamu-api-fishscan-ai.hf.space/predict)
    const response = await fetch('https://khairulilham25-fishscan-api.hf.space/predict', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Terjadi kesalahan pada server saat melakukan prediksi.');
    }

    const data = await response.json();

    // Tunggu sedikit setelah langkah 4 untuk transisi mulus ke hasil
    setTimeout(() => {
      showResults(data);
    }, 2200);

  } catch (error) {
    console.error(error);
    alert('Gagal mendeteksi penyakit: ' + error.message);
    loadingZone.style.display = 'none';
    previewZone.style.display = 'block';
  }
}

// Menampilkan panel hasil
function showResults(data) {
  loadingZone.style.display = 'none';
  uploadPanel.style.display = 'none';
  resultPanel.style.display = 'block';

  const rawClass = data.predicted_class;
  const confidence = data.confidence_score;

  // Ambil detail penyakit
  const detail = DISEASE_DETAILS[rawClass] || {
    name: rawClass,
    severity: 'medium',
    severityText: 'Tidak Diketahui',
    symptoms: ['Gejala tidak terdaftar.'],
    treatment: ['Silakan hubungi ahli perikanan atau dokter hewan setempat.']
  };

  // Set teks hasil
  document.getElementById('diseaseName').textContent = detail.name;
  document.getElementById('confPct').textContent = `${confidence}%`;
  document.getElementById('confBar').style.width = `${confidence}%`;

  // Set Severity Badge
  const severityBadge = document.getElementById('severityBadge');
  severityBadge.className = `severity-result ${detail.severity}`;
  severityBadge.textContent = `Tingkat Keparahan: ${detail.severityText}`;

  // Render list gejala
  const symptomsList = document.getElementById('symptomsList');
  symptomsList.innerHTML = '';
  detail.symptoms.forEach(sym => {
    const li = document.createElement('li');
    li.textContent = sym;
    symptomsList.appendChild(li);
  });

  // Render list rekomendasi penanganan
  const treatmentList = document.getElementById('treatmentList');
  treatmentList.innerHTML = '';
  detail.treatment.forEach(treat => {
    const li = document.createElement('li');
    li.textContent = treat;
    treatmentList.appendChild(li);
  });

  // Render chart probabilitas (semua kelas)
  const topPredictions = document.getElementById('topPredictions');
  topPredictions.innerHTML = '';

  // Mengurutkan prediksi dari nilai tertinggi ke terendah
  const sortedPredictions = Object.entries(data.raw_predictions)
    .sort((a, b) => b[1] - a[1]);

  sortedPredictions.forEach(([clsName, pctValue]) => {
    const mappedInfo = DISEASE_DETAILS[clsName] || { name: clsName };

    const predItem = document.createElement('div');
    predItem.className = 'pred-item';

    predItem.innerHTML = `
      <div class="pred-name">${mappedInfo.name || clsName}</div>
      <div class="pred-bar-track">
        <div class="pred-bar-fill" style="width: ${pctValue}%"></div>
      </div>
      <div class="pred-pct">${pctValue}%</div>
    `;

    topPredictions.appendChild(predItem);
  });
}

// Reset halaman kembali ke beranda upload
function resetAll() {
  resultPanel.style.display = 'none';
  uploadPanel.style.display = 'block';
  resetUpload();
}

// Mencetak hasil diagnosis
function printResult() {
  window.print();
}