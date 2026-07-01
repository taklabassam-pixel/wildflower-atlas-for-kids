// 1. استيراد ملف البيانات (تأكد أن مسار ملف data.js صحيح بالنسبة لهذا السكربت)
// ملاحظة: إذا كان ملف data.js يصدر البيانات بصيغة (export default) أو (module.exports)، تأكد من مطابقتها.
const fs = require('fs');
const path = require('path');

try {
    // قراءة ملف data.js كنص لمعالجته بأمان في حال لم يكن مصمماً كـ CommonJS Module
    const filePath = path.join(__dirname, 'data.js');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    console.log("=== جاري فحص واستخراج أسماء النباتات من ملف data.js ===\n");

    // محاكاة سريعة لتشغيل الكود واستخراج المصفوفة برمجياً
    // إذا كانت البيانات مخزنة في متغير باسم plants أو ما شابه
    // هنا سنستخدم تعبير نمطي (Regex) ذكي وآمن لاستخراج أسماء الحقول مباشرة دون الاعتماد على صيغة التصدير
    
    // التعبيرات النمطية للبحث عن حقول الأسماء العربية والفرنسية (عدلها لو كانت أسماء الحقول مختلفة لديك)
    const nameArRegex = /title_real\s*:\s*["'`]([^"'`]+)["'`]/g;
    const nameFrRegex = /title_fr\s*:\s*["'`]([^"'`]+)["'`]/g; // أو الاسم العلمي الفرنسي المعتمد لديك

    let matchesAr = [];
    let match;
    
    // استخراج كافة الأسماء العربية الحقيقية
    while ((match = nameArRegex.exec(fileContent)) !== null) {
        matchesAr.push(match[1].trim());
    }

    // إذا كنت تفضل استخراج الأسماء بطريقة برمجية كاملة عبر عمل require للملف (في حال كان يستخدم module.exports)
    // يمكنك تفعيل السطرين التاليين:
    // const plantsData = require('./data.js');
    // plantsData.forEach(plant => console.log(`العربي: ${plant.title_real} | الفرنسي: ${plant.title_fr}`));

    if (matchesAr.length === 0) {
        console.log("⚠️ لم يتم العثور على حقول 'title_real' باستخدام التعبير النمطي.");
        console.log("تأكد من مسميات الحقول داخل ملف data.js الخاص بك.");
    } else {
        console.log(`✅ تم العثور على (${matchesAr.length}) نبتة بنجاح:\n`);
        
        // طباعة النتيجة بشكل منظم وجدول مريح للعين
        matchesAr.forEach((nameAr, index) => {
            console.log(`${index + 1}. الاسم العربي الحقيقي: ${nameAr}`);
            // هنا يمكنك إضافة منطق استخراج الفرنسي المقابل لها مباشرة
        });
    }

} catch (error) {
    console.error("❌ حدث خطأ أثناء قراءة ملف data.js:", error.message);
}