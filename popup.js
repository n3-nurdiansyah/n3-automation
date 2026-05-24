// --- FITUR 1: ISI INPUT TEXT ---
document.getElementById('fillBtn').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({ target: { tabId: tab.id }, func: fillInputs });
});

function fillInputs() {
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.value = 'oke';
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
}

// --- FITUR 2: KLIK VIEW BUKTI ---
document.getElementById('clickBtn').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({ target: { tabId: tab.id }, func: clickViewBukti });
});

function clickViewBukti() {
    const elements = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
    elements.forEach(el => {
        const text = (el.innerText || el.value || '').trim().toLowerCase();
        if (text.includes('view bukti')) el.click();
    });
}

// --- FITUR 3: CENTANG IYA / TIDAK BERDASARKAN URUTAN KOLOM ---
document.getElementById('checkIyaBtn').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({ target: { tabId: tab.id }, func: checkOptions, args: ['iya'] });
});

document.getElementById('checkTidakBtn').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({ target: { tabId: tab.id }, func: checkOptions, args: ['tidak'] });
});

function checkOptions(kataKunci) {
    const rows = document.querySelectorAll('tr');
    rows.forEach(row => {
        const checkboxes = row.querySelectorAll('input[type="checkbox"]');
        if (checkboxes.length >= 2) {
            if (kataKunci === 'iya' && !checkboxes[0].checked) {
                checkboxes[0].click();
            } else if (kataKunci === 'tidak' && !checkboxes[1].checked) {
                checkboxes[1].click();
            }
        }
    });
}

// --- FITUR 4: ISI TEXTAREA ---
document.getElementById('fillTextareaBtn').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({ target: { tabId: tab.id }, func: fillTextareas });
});

function fillTextareas() {
    // Cari semua elemen <textarea> di halaman
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.value = 'Sudah terwakilkan saat observasi';
        // Memicu event agar perubahan terdeteksi oleh sistem website
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
    });
}

//fitur 5
document.getElementById('checkMatriksBtn').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Mengirimkan array [0, 4] yang mewakili kolom ke-1 dan ke-5
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: checkMultipleColumns,
        args: [[0, 4]]
    });
});

function checkMultipleColumns(indices) {
    const rows = document.querySelectorAll('tr');

    rows.forEach(row => {
        // Cari semua checkbox dalam satu baris (mengabaikan kolom teks di awal)
        const checkboxes = row.querySelectorAll('input[type="checkbox"]');

        if (checkboxes.length >= 5) {
            indices.forEach(index => {
                if (checkboxes[index] && !checkboxes[index].checked) {

                    // 1. Hapus paksa status 'disabled' agar bisa diubah
                    checkboxes[index].removeAttribute('disabled');

                    // 2. Ubah statusnya menjadi tercentang
                    checkboxes[index].checked = true;

                    // 3. Picu event agar framework website menyadari perubahan ini
                    checkboxes[index].dispatchEvent(new Event('change', { bubbles: true }));
                    checkboxes[index].dispatchEvent(new Event('click', { bubbles: true }));
                }
            });
        }
    });
}

// --- FITUR 6: PROSES OTOMATIS AK06 ---
document.getElementById('btnAk06').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({ target: { tabId: tab.id }, func: prosesAk06 });
});

function prosesAk06() {
    // 1. Ceklis semua checkbox di halaman (termasuk membuka paksa jika statusnya disabled)
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (!cb.checked) {
            cb.removeAttribute('disabled');
            cb.checked = true;
            cb.dispatchEvent(new Event('change', { bubbles: true }));
            cb.dispatchEvent(new Event('click', { bubbles: true }));
        }
    });

    // 2. Isi semua textarea dengan tanda "-"
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.value = '-';
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // 3. Pilih opsi ke-2 pada setiap tag <select>
    document.querySelectorAll('select').forEach(select => {
        // Memastikan dropdown memiliki minimal 2 opsi agar tidak error
        if (select.options.length > 1) {
            // Dalam array/index JavaScript, 0 adalah opsi pertama ("Pilih..."), 
            // 1 adalah opsi kedua ("L/IA.03 - T/DPT")
            select.selectedIndex = 1;
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });

    // 4. Klik tombol yang bertipe "button"
    const btnTypeButton = document.querySelector('button[type="button"]');
    if (btnTypeButton) {
        btnTypeButton.click();
    }
}

// --- FITUR 7: PILIH TUK ---
document.getElementById('btnPilihTuk').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({ target: { tabId: tab.id }, func: prosesPilihTuk });
});

function prosesPilihTuk() {
    // Cari semua elemen dropdown <select>
    document.querySelectorAll('select').forEach(select => {
        // Cari opsi di dalam dropdown tersebut yang nilainya persis "Sesuai"
        const opsiSesuai = Array.from(select.options).find(opt => opt.value === 'Sesuai');

        // Jika opsi "Sesuai" ditemukan, pilih opsi tersebut
        if (opsiSesuai) {
            select.value = 'Sesuai';
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
}

// --- FITUR 8: SAVE TUK ---
document.getElementById('btnSaveTuk').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({ target: { tabId: tab.id }, func: prosesSaveTuk });
});

function prosesSaveTuk() {
    // 1. Lakukan proses yang persis sama dengan "Pilih TUK"
    document.querySelectorAll('select').forEach(select => {
        const opsiSesuai = Array.from(select.options).find(opt => opt.value === 'Sesuai');
        if (opsiSesuai) {
            select.value = 'Sesuai';
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });

    // 2. Cari tombol dengan atribut type="submit"
    const btnSubmit = document.querySelector('button[type="submit"]');

    if (btnSubmit) {
        // 3. Klik tombol submit
        btnSubmit.click();

        // 4. Tunggu 3 detik (3000 milidetik), lalu jalankan perintah kembali ke halaman sebelumnya
        setTimeout(() => {
            window.history.back();
        }, 3000);

    } else {
        // Beri peringatan jika tombol submit tidak ada di halaman tersebut
        alert('Tombol Submit tidak ditemukan!');
    }
}