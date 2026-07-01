import os
import requests

# --- إعدادات الحساب والمسارات ---
# استبدل هذا المتغير بمفتاح الـ API الخاص بك من حسابك في ElevenLabs
ELEVENLABS_API_KEY = "sk_efd19b3444a648b0e6e2934bebb47ed51ed923df9090a043"

# مجلد المخرجات
OUTPUT_DIR = r"C:\Users\h\Desktop\اطلس النباتات\atlas-kids\audio"

# تم التغيير إلى صوت Liam الافتراضي المتاح في جميع الحسابات لدعم العربية الفصحى
VOICE_ID = "pNInz6obpgmA5EAMZuPo" 

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# --- بيانات العينة المَشْكُولَة للتجربة ---
test_plants = [
    {
        "character_code": "cyclamen_persicum",
        "title": "بَخُورُ مَرْيَم الذَّكِيّ",
        "text": "أَهْلًا بِكُمْ يَا أَصْدِقَاءُ! أَنَا زَهْرَةُ بَخُورِ مَرْيَمَ، الرَّمْزُ البَرِّيُّ لِلصُّمُودِ وَالجَمَالِ فِي جِبَالِنَا. سِرِّي الشُّجَاعُ يَكْمُنُ تَحْتَ الأَرْضِ، حَيْثُ أَمْلِكُ جُذُورًا قَوِيَّةً عَلَى شَكْلِ دَرَنَاتٍ مُعَمَّرَةٍ تَخْتَبِئُ فِي التُّرْبَةِ لِسَنَوَاتٍ طَوِيلَةٍ!"
    },
    {
        "character_code": "vicia_sativa",
        "title": "بَسِيلَة.. المُتَسَلِّقَة المَاهِرَة",
        "text": "مَرْحَبًا أَيُّهَا المُسْتَكْشِفُونَ! أَنَا بَسِيلَةُ، النَّبْتَةُ العُشْبِيَّةُ المُتَسَلِّقَةُ وَالذَّكِيَّةُ جِدًّا. أَنَا لَا أَمْلِكُ جُذُوعًا خَشَبِيَّةً ضَخْمَةً، لَكِنِّي أَسْتَخْدِمُ خُيُوطًا سِحْرِيَّةً صَغِيرَةً وَدَقِيقَةً تُسَمَّى المَحَالِيقَ الخَيْطِيَّةَ لِكَيْ أَمْتَطِيَ الأَعْشَابَ المُجَاوِرَةَ!"
    }
]

def generate_samples():
    tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }

    print("🚀 البدء في توليد عينات الصوت للتجربة...")

    for plant in test_plants:
        code = plant["character_code"]
        output_file = os.path.join(OUTPUT_DIR, f"{code}.mp3")
        
        data = {
            "text": plant["text"],
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.45,       
                "similarity_boost": 0.85, 
                "style": 0.15,            
                "use_speaker_boost": True
            }
        }

        print(f"🎙️ جاري إنشاء ملف الصوت لنبتة: {plant['title']}...")
        response = requests.post(tts_url, json=data, headers=headers)

        if response.status_code == 200:
            with open(output_file, 'wb') as f:
                f.write(response.content)
            print(f"✅ تم الحفظ بنجاح في: {code}.mp3")
        else:
            print(f"❌ فشل التوليد لـ {code}. رمز الخطأ: {response.status_code}")
            print(response.text)

    print("\n✨ انتهت التجربة! اذهب للمجلد واستمع للملفات الناتجة.")

if __name__ == "__main__":
    generate_samples()