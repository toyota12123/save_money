// ========================================
// Node.js Server - Expense Tracker
// ========================================

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('.')); // Serve static files
app.use(express.json()); // Parse JSON requests

// Store data file
const dataFile = path.join(__dirname, 'records.json');

// Ensure records.json exists
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([], null, 2));
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint: Submit expense record
app.post('/api/expense', (req, res) => {
    try {
        const data = req.body;

        // Server-side validation
        const errors = [];

        if (!data.date) {
            errors.push('วันที่ไม่ถูกต้อง');
        }
        if (!data.type || !['income', 'expense'].includes(data.type)) {
            errors.push('ประเภทไม่ถูกต้อง');
        }
        if (!data.category) {
            errors.push('หมวดหมู่ไม่ถูกต้อง');
        }
        if (!data.amount || isNaN(parseFloat(data.amount)) || parseFloat(data.amount) <= 0) {
            errors.push('จำนวนเงินไม่ถูกต้อง');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'ข้อมูลไม่ถูกต้อง: ' + errors.join(', ')
            });
        }

        // Read existing records
        let records = [];
        if (fs.existsSync(dataFile)) {
            const fileContent = fs.readFileSync(dataFile, 'utf-8');
            records = JSON.parse(fileContent || '[]');
        }

        // Add new record
        const record = {
            id: Date.now(),
            date: data.date,
            type: data.type,
            category: data.category,
            amount: parseFloat(data.amount),
            description: data.description || '',
            createdAt: new Date().toISOString()
        };

        records.push(record);

        // Save to file
        fs.writeFileSync(dataFile, JSON.stringify(records, null, 2));

        console.log('✅ Record saved:', record);

        res.status(200).json({
            success: true,
            message: 'บันทึกข้อมูลสำเร็จ',
            data: record
        });

    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์'
        });
    }
});

// API endpoint: Get all records
app.get('/api/records', (req, res) => {
    try {
        if (fs.existsSync(dataFile)) {
            const fileContent = fs.readFileSync(dataFile, 'utf-8');
            const records = JSON.parse(fileContent || '[]');
            res.status(200).json({
                success: true,
                count: records.length,
                data: records
            });
        } else {
            res.status(200).json({
                success: true,
                count: 0,
                data: []
            });
        }
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('🚀 Server is running!');
    console.log(`📍 http://localhost:${PORT}`);
    console.log('');
    console.log('📊 Endpoints:');
    console.log(`  - GET  http://localhost:${PORT}/                (Main page)`);
    console.log(`  - POST http://localhost:${PORT}/api/expense    (Add expense)`);
    console.log(`  - GET  http://localhost:${PORT}/api/records    (Get all records)`);
    console.log('');
});
