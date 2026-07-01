const fs = require('fs');
const path = require('path');

// تحديد المسارات داخل نفس المجلد
const jsonPath = path.join(__dirname, 'plants.json');
const outputPath = path.join(__dirname, 'stories_to_shakkal.txt');

try {
    // 1. قراءة ملف الأطلس
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const plants = JSON.parse(rawData);

    let outputText = '';

    // 2. استخراج النصوص وهيكلتها
    plants.forEach(plant => {
        const code = plant.character_code || '';
        const story = plant.story_ar || '';
        outputText += `[${code}] -> ${story}\n\n`;
    });

    // 3. كتابة الملف النصي
    fs.writeFileSync(outputPath, outputText, 'utf8');
    console.log("✅ نجاح! تم استخراج النصوص في ملف: stories_to_shakkal.txt");

} catch (error) {
    console.error("❌ حدث خطأ أثناء الاستخراج:", error.message);
}