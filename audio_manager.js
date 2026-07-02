/**
 * 🎵 نظام إدارة الصوت التفاعلي لأطلس النباتات والزهور البرية
 * يتكفل بتشغيل ملفات الـ MP3 ومنع تداخلها عند تنقل الطفل بين الواجهات
 */

class AtlasAudioManager {
    constructor() {
        this.currentAudio = null;       // يحتفظ بكائن الصوت الحالي
        this.currentPlantCode = null;  // يحتفظ بشفرة النبتة الحالية
        this.isPlaying = false;        // حالة التشغيل الحالية
    }

    /**
     * الدالة الرئيسية لتشغيل أو إيقاف صوت قصة النبتة
     * @param {string} characterCode - المعرف الفريد للنبتة (مثل: cyclamen_persicum)
     * @param {HTMLElement} buttonElement - عنصر الزر البرتقالي لتحديث شكله بصرياً
     */
    togglePlay(characterCode, buttonElement) {
        // 1. إذا كان الطفل يضغط على زر نفس النبتة التي تعمل حالياً (إيقاف مؤقت / استئناف)
        if (this.currentAudio && this.currentPlantCode === characterCode) {
            if (this.isPlaying) {
                this.pauseTrack(buttonElement);
            } else {
                this.playTrack(buttonElement);
            }
            return;
        }

        // 2. إذا كان هناك صوت لنبتة أخرى يعمل، نقوم بإيقافه وتصفيره فوراً لمنع التداخل
        this.stopCurrentTrack();

        // 3. تحديد مسار ملف الـ MP3 بناءً على معرف النبتة داخل مجلد audio
        this.currentPlantCode = characterCode;
        const audioSource = `audio/${characterCode}.mp3`;
        
        // 4. إنشاء كائن صوتي جديد
        this.currentAudio = new Audio(audioSource);

        // إضافة حدث استماع عند انتهاء الملف الصوتي تلقائياً لإعادة الزر لحالته الأصلية
        this.currentAudio.addEventListener('ended', () => {
            this.handleAudioEnded(buttonElement);
        });

        // التعامل مع أخطاء التحميل (مثلاً إذا كان الملف غير موجود في المجلد)
        this.currentAudio.addEventListener('error', (e) => {
            console.error(`❌ عذراً، تعذر تحميل أو تشغيل ملف الصوت: ${audioSource}`);
            this.resetManager(buttonElement);
        });

        // 5. البدء بالتشغيل
        this.playTrack(buttonElement);
    }

    // دالة بدء التشغيل وتحديث واجهة الزر
    playTrack(buttonElement) {
        if (!this.currentAudio) return;

        this.currentAudio.play()
            .then(() => {
                this.isPlaying = true;
                if (buttonElement) {
                    buttonElement.classList.add('audio-playing');
                    // تلميح مظهر: يمكنك استخدام CSS لتغيير أيقونة الزر البرتقالي إلى شكل إيقاف مؤقت ⏸️
                }
                console.log(`🔊 يعمل الآن: audio/${this.currentPlantCode}.mp3`);
            })
            .catch(error => {
                console.error("⚠️ فشل تشغيل الصوت تلقائياً بسبب سياسات المتصفح الأمني:", error);
            });
    }

    // دالة الإيقاف المؤقت
    pauseTrack(buttonElement) {
        if (!this.currentAudio) return;
        this.currentAudio.pause();
        this.isPlaying = false;
        if (buttonElement) {
            buttonElement.classList.remove('audio-playing');
        }
        console.log(`⏸️ تم إيقاف الصوت مؤقتاً لـ: ${this.currentPlantCode}`);
    }

    // دالة قطع الصوت تماماً وتصفيره (تُستدعى عند الانتقال للتالي أو السابق)
    stopCurrentTrack() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
        this.isPlaying = false;
        
        // إزالة تأثير التشغيل من جميع أزرار الصوت في الواجهة
        document.querySelectorAll('.audio-playing').forEach(btn => {
            btn.classList.remove('audio-playing');
        });
    }

    // معالجة انتهاء الصوت طبيعياً
    handleAudioEnded(buttonElement) {
        console.log(`✨ انتهى الاستماع لقصة: ${this.currentPlantCode}`);
        this.resetManager(buttonElement);
    }

    // إعادة ضبط المدير للحالة الافتراضية
    resetManager(buttonElement) {
        this.currentAudio = null;
        this.isPlaying = false;
        this.currentPlantCode = null;
        if (buttonElement) {
            buttonElement.classList.remove('audio-playing');
        }
    }
}

// إنشاء نسخة عالمية واحدة ثابتة من مدير الصوت لتعمل عبر التطبيق
const atlasAudio = new AtlasAudioManager();