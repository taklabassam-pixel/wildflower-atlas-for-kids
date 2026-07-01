from PIL import Image, ImageDraw

def make_circular_watermark(image_path, output_png_path):
    img = Image.open(image_path).convert("RGBA")
    width, height = img.size
    
    mask = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(mask)
    
    # ترك هامش 15 بكسل لتجنب الإطار الأخضر الخارجي
    offset = 15 
    draw.ellipse((offset, offset, width - offset, height - offset), fill=255)
    
    img.putalpha(mask)
    img.save(output_png_path, "PNG")
    print("تم تجهيز الشعار بخلفية شفافة بنجاح كملف PNG!")

make_circular_watermark('atlas_logo.png', 'app_logo_transparent.png')