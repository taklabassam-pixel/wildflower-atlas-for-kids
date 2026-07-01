import os
from PIL import Image

def apply_watermark(image_path, watermark_path, output_path):
    base_image = Image.open(image_path).convert("RGBA")
    watermark = Image.open(watermark_path).convert("RGBA")
    
    base_width, base_height = base_image.size
    
    # حساب حجم الشعار ليكون 14% من عرض الصورة الأصلية بشكل ديناميكي
    target_width = int(base_width * 0.14)
    w_ratio = target_width / float(watermark.size[0])
    target_height = int(float(watermark.size[1]) * float(w_ratio))
    
    resized_watermark = watermark.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # الهوامش (3% من أبعاد الصورة) لترك مسافة أنيقة في الزاوية اليمنى السفلية
    margin_x = int(base_width * 0.03)
    margin_y = int(base_height * 0.03)
    
    position_x = base_width - target_width - margin_x
    position_y = base_height - target_height - margin_y
    
    # دمج الطبقات
    transparent_layer = Image.new("RGBA", base_image.size, (0, 0, 0, 0))
    transparent_layer.paste(base_image, (0, 0))
    transparent_layer.paste(resized_watermark, (position_x, position_y), mask=resized_watermark)
    
    # الحفظ كـ JPG بجودة عالية
    final_image = transparent_layer.convert("RGB")
    final_image.save(output_path, "JPEG", quality=92)

def process_all_images(input_folder, watermark_file, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        
    for file_name in os.listdir(input_folder):
        if file_name.lower().endswith(('.jpg', '.jpeg', '.png')):
            input_img_path = os.path.join(input_folder, file_name)
            output_img_path = os.path.join(output_folder, file_name)
            
            try:
                apply_watermark(input_img_path, watermark_file, output_img_path)
                print(f"تم بنجاح وسم وحفظ: {file_name}")
            except Exception as e:
                print(f"فشل معالجة الصورة {file_name}: {e}")

# تشغيل الأتمتة على المجلدات
process_all_images('images_original', 'app_logo_transparent.png', 'images_watermarked')