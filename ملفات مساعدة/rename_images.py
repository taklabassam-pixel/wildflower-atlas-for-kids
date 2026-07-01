import os

# المسار الخاص بمجلد الصور لديك
folder_path = r"C:\Users\h\Desktop\اطلس النباتات\atlas-kids\images"

# المرور على جميع الملفات داخل المجلد
for filename in os.listdir(folder_path):
    # التأكد من أن الملف بامتداد png ولم يتم تعديله من قبل
    if filename.endswith(".png") and not filename.endswith("_cartoon.png"):
        # فصل الاسم عن الامتداد
        name_without_ext, ext = os.path.splitext(filename)
        
        # إنشاء الاسم الجديد
        new_filename = f"{name_without_ext}_cartoon{ext}"
        
        # تجهيز المسار الكامل للملف القديم والجديد
        old_file = os.path.join(folder_path, filename)
        new_file = os.path.join(folder_path, new_filename)
        
        # تنفيذ عملية إعادة التسمية
        os.rename(old_file, new_file)
        print(f"تم تغيير: {filename} -> {new_filename}")

print("✨ اكتملت عملية إعادة تسمية جميع الملفات بنجاح!")