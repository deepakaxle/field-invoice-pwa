// dynamicForm.js
// Handles offline form logic: localStorage sync, file preview, dynamic dropdowns

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('offlineInvoiceForm');
  const fileInput = document.getElementById('fileInput');
  const fileList = document.getElementById('fileList');

  // 1️⃣ Restore draft data if available
  const saved = JSON.parse(localStorage.getItem('fieldInvoiceDraft') || '{}');
  for (const [id, val] of Object.entries(saved)) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  // 2️⃣ Watch all inputs for changes and save locally
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      saved[input.id] = input.value;
      localStorage.setItem('fieldInvoiceDraft', JSON.stringify(saved));
    });
  });

  // 3️⃣ File handling
  fileInput.addEventListener('change', () => {
    fileList.innerHTML = '';
    Array.from(fileInput.files).forEach(file => {
      const pill = document.createElement('div');
      pill.className = 'file-pill';
      pill.textContent = file.name;
      fileList.appendChild(pill);
    });
  });

  // 4️⃣ Submit handler (offline)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('✅ Invoice saved offline. It will sync when back online.');
    // Optional: Store sync queue in localStorage
    const draft = {};
    inputs.forEach(input => draft[input.id] = input.value);
    draft.timestamp = new Date().toISOString();
    localStorage.setItem('fieldInvoiceDraft', JSON.stringify(draft));
  });

  // 5️⃣ Detect going online
  window.addEventListener('online', () => {
    const draft = JSON.parse(localStorage.getItem('fieldInvoiceDraft') || '{}');
    if (Object.keys(draft).length > 0) {
      console.log('🟢 Back online! Ready to sync invoice:', draft);
      // You can implement Apex Remoting or REST POST from here.
    }
  });

  // 6️⃣ Contact dropdown logic
  const contactSelect = document.getElementById('contactSelect');
  contactSelect.addEventListener('change', () => {
    const newFields = document.getElementById('newContactFields');
    if (contactSelect.value === 'new') {
      newFields.style.display = 'block';
    } else {
      newFields.style.display = 'none';
    }
  });

  // 7️⃣ Optional: preload dropdowns
  // Simulate company/contact lists if offline:
  const companySelect = document.getElementById('companySelect');
  const dummyCompanies = [
    { id: 'acc1', name: 'Acme Corp' },
    { id: 'acc2', name: 'Globex Ltd' },
    { id: 'acc3', name: 'Initech' },
  ];
  dummyCompanies.forEach(co => {
    const opt = document.createElement('option');
    opt.value = co.id;
    opt.textContent = co.name;
    companySelect.appendChild(opt);
  });
});// END DOMContentLoaded
