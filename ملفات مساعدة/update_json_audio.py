import json
import os

def add_audio_paths_to_json():
    # 1. حدد اسم ملف الـ JSON الخاص بمشروعك هنا (مثلاً: data.json أو flowers.json)
    # إذا كان كود الـ JSON مدمجاً داخل ملف JS، يرجى إخباري لأعطيك سكربت مخصصاً له.
    json_file_path = "data.js" 
    
    if not os.path.exists(json_file_path):
        print(f"❌ لم يتم العثور على الملف: {json_file_path}. يرجى التأكد من الاسم والمسار.")
        return

    # 2. قراءة البيانات الحالية
    with open(json_file_path, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            print("❌ خطأ في قراءة ملف الـ JSON، تأكد من سلامة صياغته البرمجية.")
            return

    print("⏳ جاري حقن مسارات المكتبة الصوتية داخل البطاقات...")

    # 3. المرور على كل نبتة وتوليد المسارات الصامتة والنظامية لها
    for flower in data:
        if "scientific_name" in flower:
            # تنظيف الاسم العلمي (تحويل لأحرف صغيرة، استبدال الفراغات بشرطة سفلية، وإزالة النقاط)
            clean_name = flower["scientific_name"].lower().strip().replace(" ", "_").replace(".", "")
            
            # إضافة حقول الصوت بأسماء الملفات القياسية المتفق عليها
            flower["audio_ar"] = f"audio/arabic/{clean_name}_ar.mp3"
            flower["audio_lat"] = f"audio/latin/{clean_name}_lat.mp3"

    # 4. حفظ الملف المحدث مع الحفاظ على اللغة العربية وتنسيق الأسطر (Indent)
    with open(json_file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print(f"🎉 تم تحديث ملف {json_file_path} بنجاح! تم ربط جميع النباتات بمساراتها الصوتية البشرية.")

if __name__ == "__main__":
    add_audio_paths_to_json()