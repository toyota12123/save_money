// ========================================
// ระบบบันทึกรายรับ-รายจ่าย (เวอร์ชันลื่นไหล)
// ========================================

let records = [];

// ดึง Elements (ใช้ฟังก์ชันเพื่อความแม่นยำ)
const getEl = (id) => document.getElementById(id);

// 1. เริ่มต้นระบบ
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEvents();
    setDefaultDate();
    render();
});

// 2. ฟังก์ชันหลัก (Render) - วาดตารางและสรุปผล
function render(data = records) {
    const tbody = document.querySelector('#recordsTable tbody');
    const emptyMsg = getEl('emptyMessage');
    
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        emptyMsg.style.display = 'block';
    } else {
        emptyMsg.style.display = 'none';
        // เรียงลำดับเอาอันใหม่ขึ้นบนสุด (Optional)
        const sortedData = [...data].reverse(); 
        
        sortedData.forEach(item => {
            const row = document.createElement('tr');
            row.className = `${item.type}-row`;
            row.innerHTML = `
                <td>${formatDate(item.date)}</td>
                <td><span class="badge ${item.type}">${item.type === 'income' ? 'รายรับ' : 'รายจ่าย'}</span></td>
                <td>${getCatName(item.category)}</td>
                <td class="amount ${item.type}">${Number(item.amount).toLocaleString()} บาท</td>
                <td>${item.description || '-'}</td>
                <td><button class="btn-delete" onclick="removeRecord(${item.id})">ลบ</button></td>
            `;
            tbody.appendChild(row);
        });
    }
    updateTotal(data);
}

// 3. จัดการการบันทึก (No Alert)
function handleSave(e) {
    e.preventDefault();
    
    const typeEl = document.querySelector('input[name="type"]:checked');
    const amount = parseFloat(getEl('amount').value);

    if (!typeEl || isNaN(amount)) return; // ถ้าข้อมูลไม่ครบก็ไม่ทำอะไร

    const newRecord = {
        id: Date.now(),
        date: getEl('date').value,
        type: typeEl.value,
        category: getEl('category').value,
        amount: amount,
        description: getEl('description').value
    };

    // เพิ่มเข้าตัวแปร และเซฟลงเครื่อง
    records.push(newRecord);
    saveData();
    
    // อัปเดตหน้าจอทันที
    render();
    
    // ล้างฟอร์ม
    getEl('expenseForm').reset();
    setDefaultDate();
    
    // ส่ง API แบบเงียบๆ (Background Sync)
    silentSync(newRecord);
}

// 4. สรุปยอดเงิน
function updateTotal(data) {
    const income = data.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
    const expense = data.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
    const balance = income - expense;

    getEl('totalIncome').textContent = `${income.toLocaleString()} บาท`;
    getEl('totalExpense').textContent = `${expense.toLocaleString()} บาท`;
    
    const balanceEl = getEl('totalBalance');
    balanceEl.textContent = `${balance.toLocaleString()} บาท`;
    balanceEl.style.color = balance >= 0 ? '#10b981' : '#ef4444';
}

// 5. ฟังก์ชัน Filter
function applyFilter() {
    const month = getEl('monthFilter').value;
    const type = getEl('typeFilter').value;

    let filtered = records;
    if (month) filtered = filtered.filter(r => r.date.startsWith(month));
    if (type) filtered = filtered.filter(r => r.type === type);

    render(filtered);
}

// --- ฟังก์ชันเสริม (Utilities) ---

function setupEvents() {
    getEl('expenseForm').addEventListener('submit', handleSave);
    getEl('monthFilter').addEventListener('change', applyFilter);
    getEl('typeFilter').addEventListener('change', applyFilter);
}

function removeRecord(id) {
    // ลบยังใช้ confirm เพื่อป้องกันการกดพลาด
    if (confirm('ลบรายการนี้ใช่ไหม?')) {
        records = records.filter(r => r.id !== id);
        saveData();
        applyFilter(); // รีเฟรชหน้าจอตามฟิลเตอร์ปัจจุบัน
    }
}

function loadData() {
    const saved = localStorage.getItem('expenseRecords');
    records = saved ? JSON.parse(saved) : [];
}

function saveData() {
    localStorage.setItem('expenseRecords', JSON.stringify(records));
}

function setDefaultDate() {
    getEl('date').valueAsDate = new Date();
}

function formatDate(str) {
    const d = new Date(str);
    return d.toLocaleDateString('th-TH');
}

function getCatName(val) {
    const cats = {
        salary: 'เงินเดือน', bonus: 'โบนัส', investment: 'เงินลงทุน',
        food: 'อาหาร', transport: 'ค่าเดินทาง', utilities: 'ค่าน้ำ-ไฟ',
        entertainment: 'บันเทิง', medical: 'สุขภาพ', education: 'การศึกษา',
        shopping: 'ช้อปปิ้ง', other: 'อื่นๆ'
    };
    return cats[val] || val;
}

async function silentSync(data) {
    try {
        fetch('/api/expense', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (e) { /* เงียบไว้ ไม่ต้องบอกผู้ใช้ */ }
}