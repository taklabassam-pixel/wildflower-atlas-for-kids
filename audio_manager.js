/**
 * 🎵 نظام إدارة الصوت التفاعلي المطور لأطلس النباتات والزهور البرية
 * يتكفل بتشغيل ملفات الـ MP3 من المسار العربي المحدث ومطابقتها حتمياً مع سرعة النص
 */

class AtlasAudioManager {
    constructor() {
        this.currentAudio = null;       // يحتفظ بكائن الصوت الحالي
        this.currentPlantCode = null;  // يحتفظ بشفرة النبتة الحالية
        this.isPlaying = false;        // حالة التشغيل الحالية
        this.TARGET_CPS = 12.0;        // 🎯 معيار الاتزان الرياضي المعتمد (حرف في الثانية)
        this.AUDIO_BASE_PATH = 'audio/ar/'; // 🌟 المسار الموجه الصحيح داخل حزمة الأندرويد
    }

    /**
     * الدالة الرئيسية لتشغيل أو إيقاف صوت قصة النبتة مع مزامنة حركة النص بصرياً
     * @param {string} characterCode - المعرف الفريد للنبتة (مثل: cyclamen_persicum)
     * @param {string} storyText - النص العربي الكامل للقصة المستخرج من الـ JSON
     * @param {HTMLElement} animatedTextElement - عنصر الواجهة الذكي الذي يتحرك برمجياً
     * @param {HTMLElement} buttonElement - عنصر الزر لتحديث شكله بصرياً
     */
    togglePlay(characterCode, storyText, animatedTextElement, buttonElement) {
        // 1. إذا كان الطفل يضغط على زر نفس النبتة التي تعمل حالياً (إيقاف مؤقت / استئناف)
        if (this.currentAudio && this.currentPlantCode === characterCode) {
            if (this.isPlaying) {
                this.pauseTrack(buttonElement, animatedTextElement);
            } else {
                this.playTrack(buttonElement, animatedTextElement);
            }
            return;
        }

        // 2. إذا كان هناك صوت لنبتة أخرى يعمل، نقوم بإيقافه وتصفيره فوراً لمنع التداخل والحركة
        this.stopCurrentTrack(animatedTextElement);

        // 3. تحديد مسار ملف الـ MP3 بناءً على التوجيه الهيكلي الجديد
        this.currentPlantCode = characterCode;
        const audioSource = `${this.AUDIO_BASE_PATH}${characterCode}.mp3`;
        
        // 4. إنشاء كائن صوتي جديد وتجهيز النص داخل الصندوق
        this.currentAudio = new Audio(audioSource);
        if (animatedTextElement) {
            animatedTextElement.innerText = storyText;
            animatedTextElement.style.animationName = 'none'; // تصفير الأنميشن مؤقتاً لحين تحميل الميتادات
        }

        // حساب وإعداد معاملات المزامنة فور قراءة متصفح الأندرويد لبيانات الملف الصوتي
        this.currentAudio.addEventListener('loadedmetadata', () => {
            const textLength = storyText.length;
            
            // حساب المدة المثالية المطلوبة للاتزان التعليمي للأطفال
            const idealDuration = textLength / this.TARGET_CPS;
            const actualAudioDuration = this.currentAudio.duration; 

            // حساب معامل تعديل السرعة لإجبار الصوت على التلاقي مع حافة النص
            let calculatedPlaybackRate = actualAudioDuration / idealDuration;

            // صمام أمان سمعي خفيف لمنع التشوه الحاد في الصوت
            if (calculatedPlaybackRate < 0.85) calculatedPlaybackRate = 0.85;
            if (calculatedPlaybackRate > 1.75) calculatedPlaybackRate = 1.75;

            this.currentAudio.playbackRate = calculatedPlaybackRate;

            // حساب الوقت الفعلي لحركة الأنميشن بعد تعديل سرعة تشغيل الميديا
            const finalAnimationDuration = actualAudioDuration / calculatedPlaybackRate;

            if (animatedTextElement) {
                void animatedTextElement.offsetWidth; // إجبار المتصفح على إعادة بناء الـ DOM هندسياً
                animatedTextElement.style.animationDuration = `${finalAnimationDuration}s`;
            }
        });

        // 🏁 [ضبط لحظة الصفر]: ربط انطلاق عداد حركة النص بالخروج الفعلي والذاتي للصوت من السماعة
        this.currentAudio.addEventListener('playing', () => {
            if (animatedTextElement) {
                animatedTextElement.style.animationName = 'marqueeEffect';
                animatedTextElement.style.animationPlayState = 'running';
            }
        });

        // إضافة حدث استماع عند انتهاء الملف الصوتي تلقائياً لإعادة العناصر لحالتها الأصلية
        this.currentAudio.addEventListener('ended', () => {
            this.handleAudioEnded(buttonElement, animatedTextElement);
        });

        // التعامل مع أخطاء التحميل (مثلاً إذا كان الملف غائباً عن مجلد ar/)
        this.currentAudio.addEventListener('error', (e) => {
            console.error(`❌ عذراً، تعذر تحميل أو تشغيل ملف الصوت من المسار المصحح: ${audioSource}`);
            this.resetManager(buttonElement, animatedTextElement);
        });

        // 5. البدء بالتشغيل الفعلي
        this.playTrack(buttonElement, animatedTextElement);
    }

    // دالة بدء التشغيل وتحديث واجهة الزر واستئناف الحركة النصية
    playTrack(buttonElement, animatedTextElement) {
        if (!this.currentAudio) return;

        this.currentAudio.play()
            .then(() => {
                this.isPlaying = true;
                if (buttonElement) {
                    buttonElement.classList.add('audio-playing');
                }
                if (animatedTextElement && animatedTextElement.style.animationName !== 'none') {
                    animatedTextElement.style.animationPlayState = 'running';
                }
                console.log(`🔊 يعمل الآن تحت معيار الاتزان: ${this.AUDIO_BASE_PATH}${this.currentPlantCode}.mp3 بشاكلة سرعة ${this.currentAudio.playbackRate.toFixed(2)}x`);
            })
            .catch(error => {
                console.error("⚠️ فشل تشغيل الصوت تلقائياً بسبب سياسات المشغل الأمني للأندرويد:", error);
            });
    }

    // دالة الإيقاف المؤقت للصوت وحركة شريط النص معاً
    pauseTrack(buttonElement, animatedTextElement) {
        if (!this.currentAudio) return;
        this.currentAudio.pause();
        this.isPlaying = false;
        
        if (buttonElement) {
            buttonElement.classList.remove('audio-playing');
        }
        if (animatedTextElement) {
            animatedTextElement.style.animationPlayState = 'paused'; // تجميد الحرف الحالي في مكانه تماماً
        }
        console.log(`⏸️ تم تجميد الصوت والحركة مؤقتاً لـ: ${this.currentPlantCode}`);
    }

    // دالة قطع الصوت تماماً وتصفيره وإلغاء حركات النص فوراً
    stopCurrentTrack(animatedTextElement) {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
        this.isPlaying = false;
        
        if (animatedTextElement) {
            animatedTextElement.style.animationName = 'none';
        }

        // إزالة تأثير التشغيل من جميع أزرار الصوت في الواجهة
        document.querySelectorAll('.audio-playing').forEach(btn => {
            btn.classList.remove('audio-playing');
        });
    }

    // معالجة انتهاء الصوت طبيعياً عند خط النهاية المتطابق
    handleAudioEnded(buttonElement, animatedTextElement) {
        console.log(`✨ بنجاح وتطابق تام.. انتهى الاستماع لقصة: ${this.currentPlantCode}`);
        this.resetManager(buttonElement, animatedTextElement);
    }

    // إعادة ضبط المدير للحالة الافتراضية المستقرة
    resetManager(buttonElement, animatedTextElement) {
        this.currentAudio = null;
        this.isPlaying = false;
        this.currentPlantCode = null;
        
        if (buttonElement) {
            buttonElement.classList.remove('audio-playing');
        }
        if (animatedTextElement) {
            animatedTextElement.style.animationName = 'none';
        }
    }
}

// إنشاء نسخة عالمية واحدة ثابتة من مدير الصوت لتعمل عبر التطبيق
const atlasAudio = new AtlasAudioManager();