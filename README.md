# Mini Workshop Form - ฟอร์มลงทะเบียน

## 📋 รายละเอียดโปรเจกต์

โปรเจกต์นี้เป็นแอปพลิเคชันเว็บที่มีลักษณะดังนี้:

### ✅ ส่วนประกอบหลัก:

1. **HTML/CSS Form** - ฟอร์มลงทะเบียนแบบ 2 คอลัมน์
   - ชื่อ (2 ช่อง: ชื่อ + นามสกุล)
   - อีเมล
   - เบอร์โทรศัพท์
   - อายุ
   - จังหวัด (Dropdown)
   - ข้อความ (Textarea)

2. **JavaScript Validation** ✨ (ส่วนที่ 2)
   - ตรวจสอบ Required field
   - ตรวจสอบความยาว (minLength, maxLength)
   - ตรวจสอบ Pattern (Regex)
     - ชื่อ: ต้องเป็นตัวอักษรไทยเท่านั้น
     - อีเมล: รูปแบบมาตรฐาน
     - เบอร์โทร: 10 หลัก ขึ้นต้นด้วย 0
     - อายุ: 18-100 ปี
   - Real-time validation (ตรวจสอบขณะพิมพ์)
   - Error messages ที่ชัดเจน

3. **Node.js Server** - Backend ที่รับข้อมูล
   - API endpoint: `POST /api/submit`
   - Server-side validation
   - บันทึกข้อมูลลงไฟล์ `submissions.json`
   - API endpoint: `GET /api/submissions` (ดูข้อมูลทั้งหมด)

4. **Responsive Design** - ออกแบบที่ตอบสนองต่อขนาดหน้าจอ

---

## 🚀 วิธีการใช้งาน

### ขั้นตอนที่ 1: ติดตั้ง Dependencies
```bash
npm install
```

### ขั้นตอนที่ 2: รันเซิร์ฟเวอร์
```bash
npm start
```

หรือ

```bash
node server.js
```

### ขั้นตอนที่ 3: เปิดเบราว์เซอร์
```
http://localhost:3000
```

---

## 📁 โครงสร้างไฟล์

```
Mini-Workshop Web App/
├── index.html          # ฟอร์ม HTML
├── style.css           # การออกแบบ CSS
├── script.js           # JavaScript Validation
├── server.js           # Node.js Server (Express)
├── package.json        # Dependencies
├── submissions.json    # ไฟล์เก็บข้อมูลที่ได้รับ (สร้างอัตโนมัติ)
└── README.md          # ไฟล์นี้
```

---

## 🔍 Validation Rules

| ฟิลด์ | ตัวอักษรต่ำสุด | ตัวอักษรสูงสุด | Pattern | หมายเหตุ |
|------|------------|-----------|---------|---------|
| ชื่อ | 2 | 50 | ไทยเท่านั้น | ต้องเป็นตัวอักษรไทยเท่านั้น |
| นามสกุล | 2 | 50 | ไทยเท่านั้น | ต้องเป็นตัวอักษรไทยเท่านั้น |
| อีเมล | - | - | `^[^\s@]+@[^\s@]+\.[^\s@]+$` | รูปแบบ email มาตรฐาน |
| เบอร์โทร | - | - | `^0[0-9]{9}$` | 10 หลัก เริ่มต้นด้วย 0 |
| อายุ | - | - | 18 - 100 | ต้อง >= 18 ปี |
| จังหวัด | - | - | - | ต้องเลือก |
| ข้อความ | 10 | 500 | - | ข้อมูลละเอียด |

---

## 🧪 การทดสอบ

### 1. ทดสอบ Frontend Validation
- ลองกรอกข้อมูลไม่ครบถ้วน → ควรแสดง Error
- ลองกรอกอายุน้อยกว่า 18 → ควรแสดง Error
- ลองกรอกอีเมลผิดรูปแบบ → ควรแสดง Error ทันที

### 2. ทดสอบ Backend Validation
```bash
# ดูข้อมูลทั้งหมด
curl http://localhost:3000/api/submissions
```

### 3. ทดสอบกับ Postman หรือ cURL
```bash
curl -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "สมชาย",
    "lastName": "ใจดี",
    "email": "somchai@gmail.com",
    "phone": "0812345678",
    "age": 25,
    "city": "bangkok",
    "message": "สวัสดีพวกเขาทั่วโลก"
  }'
```

---

## 📊 Output Data

ข้อมูลที่ได้รับจะถูกบันทึกในไฟล์ `submissions.json`:

```json
[
  {
    "id": 1,
    "firstName": "สมชาย",
    "lastName": "ใจดี",
    "email": "somchai@gmail.com",
    "phone": "0812345678",
    "age": 25,
    "city": "bangkok",
    "message": "สวัสดีพวกเขาทั่วโลก",
    "timestamp": "2026-02-23T10:30:45.123Z",
    "receivedAt": "2026-02-23T10:30:46.456Z"
  }
]
```

---

## ✨ Features

✅ Frontend Validation (ตรวจสอบก่อนส่ง)
✅ Backend Validation (ตรวจสอบที่เซิร์ฟเวอร์)
✅ Real-time Error Messages
✅ Responsive Design (รองรับมือถือ)
✅ Data Persistence (บันทึกข้อมูล)
✅ Clear Error Feedback

---

## 🎯 ข้อมูลเพิ่มเติม

- **ฟอร์มจำนวนฟิลด์**: 7 ฟิลด์
- **Validation Type**: 6 ประเภท (required, minLength, maxLength, pattern, min, max)
- **Server Framework**: Express.js
- **Port**: 3000
- **Data Storage**: JSON file

---

## ⚠️ หมายเหตุ

- ตรวจสอบให้แน่ใจว่ามี Node.js ติดตั้งอยู่แล้ว
- Express.js จำเป็นต้องติดตั้ง (`npm install`)
- เซิร์ฟเวอร์จะสร้างไฟล์ `submissions.json` อัตโนมัติ
- ใช้พอร์ต 3000 (สามารถเปลี่ยนได้ในไฟล์ server.js)

---

**สร้างโดย**: Mini Workshop
**เวอร์ชัน**: 1.0.0
