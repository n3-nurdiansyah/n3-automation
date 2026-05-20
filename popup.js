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