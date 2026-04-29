/* ============================================================
   China Trip 2026 — ARABIZE v9.0
   Egyptian Arabic content rebuild for ALL day sections + extras
   Loaded LAST (after quests.js).
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     DAY CONTENT — Arabic versions for all 14 days
     ───────────────────────────────────────────── */
  const DAYS = {
    1: {
      timeline: [
        { time: '20:05', text: 'إقلاع <strong>EK 924</strong> من القاهرة — إيرباص A380' },
        { time: '23:05', text: 'وصول دبي — ترانزيت ليلي في المطار' },
        { time: '~', text: 'استريحوا في الإيرميتس لاونج بترانسفير T3' },
      ],
      info: [
        { label: '✈ الطيران', title: 'EK 924 · القاهرة → دبي', detail: 'إيرباص A380 · 3 ساعات · حجز رقم 1653713358976673' },
      ],
      tip: '💡 مقاعد الـ A380 الدور الأعلى أهدى للنوم. حجز الـ 5 على نفس الصف (62A-62E لو متاحة) أحسن للعيلة. الإيرميتس لاونج في T3 (concourse A/B) فاتحة 24 ساعة.',
    },

    2: {
      timeline: [
        { time: '03:50', text: 'إقلاع <strong>EK 306</strong> من دبي — إيرباص A380' },
        { time: '15:25', text: 'هبوط مطار بكين الدولي (PEK) — أهلاً بكين! 🐉' },
        { time: '17:00', text: 'تسكين في فندق <strong>The Imperial Mansion · Marriott</strong>' },
        { time: '19:30', text: 'عشا في <strong>Capital M</strong> — مطعم أوروبي عصري بشرفة على ميدان تيانانمن' },
      ],
      stops: [
        {
          icon: '🏨',
          name: 'فندق Imperial Mansion · Marriott Executive Apartments',
          desc: 'سويت بغرفتين نوم · حي Dongcheng · 4 ليالي (19→23 يونيو) · حجز #6845.657.812 · CNY 13,183 (EGP 101,529 شامل فطار غربي يومياً)',
          mapsQuery: 'The+Imperial+Mansion+Beijing+Marriott+Executive+Apartments',
          extraLink: { href: 'https://www.marriott.com/hotels/travel/bjsim-the-imperial-mansion-beijing-marriott-executive-apartments', text: '🌐 موقع الفندق' },
        },
        {
          icon: '🍽️',
          name: 'Capital M (مطعم أوروبي عصري)',
          desc: 'بلكونة دايننج فوق Qianmen · مأكولات أسترالية-أوروبية للشيف Michelle Garnaut · سي فود، خروف، باستا، بط (بأسلوب غربي) · منظر تيانانمن وقت الغروب · مناسب للأولاد بقائمة محترمة',
          mapsQuery: 'Capital+M+restaurant+Beijing',
        },
      ],
      info: [
        { label: '✈ الطيران', title: 'EK 306 · دبي → بكين PEK', detail: 'إقلاع 03:50 · هبوط 15:25 · ~9 ساعات طيران' },
      ],
      tip: '💡 الجوازات في PEK ممكن تاخد 45-90 دقيقة. لو عندكم Priority Lane استخدموها. مطعم Capital M يحجز على OpenTable مقدماً — احجزوا واطلبوا البلكونة.',
      stripHeading: 'Wangfujing — أول إنطباع عن بكين',
    },

    3: {
      timeline: [
        { time: '09:00', text: 'القصر الإمبراطوري Forbidden City — دخول من بوابة المريديان' },
        { time: '12:00', text: 'مشي في ميدان تيانانمن (Tiananmen Square)' },
        { time: '13:00', text: 'غدا: <strong>Element Fresh</strong> (Oriental Plaza) — سلطات وساندوتش وباستا غربية · مثالي للأولاد' },
        { time: '14:00', text: 'حديقة Jingshan — منظر بانورامي على سقوف القصر الذهبية' },
        { time: '16:30', text: 'استراحة في الفندق' },
        { time: '19:00', text: 'عشا: <strong>Mio</strong> — مطعم إيطالي فاخر في Four Seasons Beijing' },
        { time: '21:00', text: 'مشي اختياري في شارع Wangfujing (الأولاد هيعوزوا يتفرجوا على المطاعم — كولوا خفيف)' },
      ],
      stops: [
        { icon: '🏰', name: 'Forbidden City (Palace Museum)', desc: 'أكبر مجمع قصور في العالم · 9,999 غرفة · سلالات Ming و Qing · 600 سنة من تاريخ الإمبراطوريات', mapsQuery: 'Forbidden+City+Beijing' },
        { icon: '🌅', name: 'ميدان Tiananmen', desc: 'أكبر ميدان عام في العالم · بوابة السلام السماوي · صورة Mao الشهيرة', mapsQuery: 'Tiananmen+Square+Beijing' },
        { icon: '🌿', name: 'حديقة Jingshan (تلة الفحم)', desc: 'أحسن مكان عالي يطل على سقوف Forbidden City الذهبية · مثالي للصور', mapsQuery: 'Jingshan+Park+Beijing' },
      ],
      info: [
        { label: '🍽️ ملاحظات أكل — أوروبي/غربي', title: 'غدا: Element Fresh · عشا: Mio (Four Seasons)', detail: 'Element Fresh = أحسن سلسلة Healthy Western في بكين (فروع جنب Wangfujing/Oriental Plaza). Mio = إيطالي فاخر داخل Four Seasons — باستا يدوي وبيتزا فرن خشب · مناسب للأولاد. لو عاوزين تجربة صينية خفيفة بأسلوب غربي: <strong>Jing Yaa Tang</strong> في The Opposite House.' },
      ],
      tip: '💡 احجزوا تذاكر Forbidden City أونلاين قبل ما تروحوا — التذاكر اللحظية محدودة. روحوا بدري قبل الزحمة. الحديقة الإمبراطورية الخلفية (Yuhuayuan) أهدأ وأجمل.',
      stripHeading: 'Forbidden City وميدان Tiananmen',
    },

    4: {
      timeline: [
        { time: '08:00', text: 'الانطلاق من فندق الـ Marriott بسيارة خاصة' },
        { time: '09:30', text: 'الوصول لـ Mutianyu (1.5 ساعة طريق)' },
        { time: '09:45', text: 'تلفريك للطلوع لسور الصين' },
        { time: '10:00', text: 'مشي 1.5 كيلو متر على السور — من برج لبرج' },
        { time: '12:00', text: 'غدا: <strong>The Schoolhouse at Mutianyu</strong> — بيتزا فرن خشب وقائمة غربية في مدرسة قديمة متجددة (مناسب للأولاد جداً، خدمة بالإنجليزي)' },
        { time: '13:30', text: 'النزول بالـ Toboggan (الزحلوقة) — اللعبة المفضلة للأولاد!' },
        { time: '14:30', text: 'الرجوع لبكين' },
        { time: '17:00', text: 'الرجوع للفندق · العشا في الفندق أو في <strong>Blue Frog Bar & Grill</strong> (أمريكي جنب الـ Marriott)' },
      ],
      stops: [
        { icon: '🧱', name: 'سور الصين العظيم — Mutianyu', desc: 'أحسن قطاع مرمم من السور · أقل زحمة من Badaling · مناظر جبلية خلابة · الزحلوقة Toboggan الشهيرة', mapsQuery: 'Mutianyu+Great+Wall+Beijing' },
        { icon: '🍕', name: 'The Schoolhouse · Mutianyu', desc: 'مدرسة قروية من الخمسينات تحولت لمطعم/كافيه · بيتزا فرن خشب، ساندوتش، سلطات، عيش طازة · بتديره عيلة أمريكية من 15 سنة · مثالي للغدا بعد ما تطلعوا السور', mapsQuery: 'The+Schoolhouse+Mutianyu' },
      ],
      tip: '🛝 الزحلوقة Toboggan (¥100/شخص) سلايد فولاذي حقيقي بينزل من فوق الجبل — فارس ويوسف وياسين هيفتكروها طول العمر. التذاكر من تحت، التلفريك يطلع، الزحلوقة تنزل. الحد الأدنى للطول: 1.20 متر (مع شخص بالغ).',
      stripHeading: 'سور Mutianyu',
    },

    5: {
      timeline: [
        { time: '09:00', text: 'مشي في حواري Hutongs Nanluogu Xiang — ركوب tuktuk + جولة في الفنا الصينية' },
        { time: '11:30', text: 'غدا: <strong>Wagas</strong> أو <strong>Pizza Marzano</strong> (منطقة Wudaoying Hutong — سلاسل غربية، مكيفة، نضيفة)' },
        { time: '13:30', text: 'القصر الصيفي (颐和园 Summer Palace) — بحيرة Kunming + الممر الطويل' },
        { time: '16:30', text: 'معبد السماء (天坛 Temple of Heaven) — قاعة الصلاة لحصاد جيد' },
        { time: '19:00', text: 'عشا: <strong>Hatsune</strong> (ياباني-غربي عصري، مناسب جداً للأولاد) — رولات سوشي، تيرياكي، تيمبورا' },
        { time: '21:00', text: 'تنبيه! حضّروا الشنط — قطار بكره الصبح من Beijing West الساعة 07:39!' },
      ],
      stops: [
        { icon: '🏘️', name: 'حواري Nanluogu Xiang (Hutongs)', desc: 'حواري 800 سنة من الفنا الصينية القديمة · روح بكين الأصيلة · بيوت شاي، محلات حِرف، بارات مخفية · اركبوا tuktuk في المتاهة', mapsQuery: 'Nanluoguxiang+Hutong+Beijing' },
        { icon: '🌸', name: 'القصر الصيفي (颐和园)', desc: 'معتزل إمبراطوري صيفي · 290 هكتار من بحيرة Kunming + تلة العمر الطويل · الممر الطويل (728 متر معرض رسم) · القارب الرخامي · موقع تراث عالمي UNESCO', mapsQuery: 'Summer+Palace+Beijing' },
        { icon: '⛩️', name: 'معبد السماء (天坛)', desc: 'مذبح من عصر Ming كان الإمبراطور بيصلي فيه عشان حصاد جيد · قاعة الصلاة الدائرية الشهيرة · المحليين بيمارسوا التاي تشي وقت الفجر · موقع UNESCO', mapsQuery: 'Temple+of+Heaven+Beijing' },
      ],
      info: [
        { label: '🏨 الفندق (آخر ليلة في بكين)', title: 'The Imperial Mansion · Marriott', detail: 'آخر ليلة في بكين · checkout بدري بكره ~06:00 لمحطة Beijing West' },
      ],
      tip: '🚆 حضروا الشنط الليلة! قطار G653 بكره من Beijing West (北京西) الساعة 07:39 بالظبط — البوابات بتقفل قبل القطار بـ 5 دقائق. خلوا 90 دقيقة: فندق → محطة → سيكيوريتي → الرصيف. احجزوا Didi أو ليموزين الفندق الساعة 06:00.',
      stripHeading: 'Hutongs · القصر الصيفي · معبد السماء',
    },

    6: {
      timeline: [
        { time: '06:00', text: 'Checkout من Imperial Mansion · سيارة لـ Beijing West (北京西)' },
        { time: '07:00', text: 'الوصول للمحطة · سيكيوريتي · إيجاد الرصيف · فطار في المحطة' },
        { time: '07:39', text: '<strong>قطار G653</strong> بيتحرك من Beijing West — مباشر لشيآن 🚄' },
        { time: '13:46', text: 'وصول Xi\'an North (西安北) — 6 ساعات و7 دقايق، 1,200 كم · مترو Line 2 جنوب لـ <strong>Provincial Stadium</strong> للفندق' },
        { time: '14:30', text: 'تسكين في <strong>Crowne Plaza Xi\'an by IHG</strong> — حجز مؤكد، فطار شامل، واي فاي ومواقف مجاناً' },
        { time: '17:30', text: 'سور المدينة القديم (古城墙) وقت الغروب — البوابة الجنوبية، مشي على فوق السور' },
        { time: '20:00', text: 'عشا: <strong>Le Grand</strong> في Sofitel (فرنسي) أو مطعم Crowne Plaza أو Westin Italian Trattoria — كلهم نضاف، قائمة غربية كاملة، مناسبين للأولاد' },
      ],
      stops: [
        { icon: '🚄', name: 'G653 · Beijing West → Xi\'an North', desc: 'قطار سريع مباشر · 07:39 → 13:46 (6 ساعات و7 دقايق) · درجة تانية US$75/شخص = ~US$377 لـ 5 · التذاكر تفتح 08:00 بتوقيت بكين يوم 9 يونيو (15 يوم قبل)', mapsQuery: 'Beijing+West+Railway+Station', extraLink: { href: 'https://us.trip.com/trains/china/beijing-to-xian/', text: '🎫 حجز Trip.com' } },
        { icon: '🏯', name: 'سور المدينة في شيآن (古城墙)', desc: 'أحسن سور مدينة قديم محفوظ في الصين · 14 كم محيط · 12 متر علو · بُني في عصر Ming 1370 · مشي أو إيجار عجل (¥45/3 ساعات) · الـ Golden Hour من البوابة الجنوبية لا ينسى', mapsQuery: 'Xian+City+Wall+South+Gate' },
        { icon: '🍷', name: 'Le Grand · Sofitel Legend People\'s Grand', desc: 'مطعم فرنسي فاخر داخل الفندق التراثي السوفياتي · ستيك مستورد، سي فود، قائمة نبيذ فرنسية · أمين عشا غربي في شيآن · بديل: Westin Xi\'an Italian Trattoria (ممتاز برضه)', mapsQuery: 'Sofitel+Legend+Peoples+Grand+Xian' },
      ],
      info: [
        { label: '🎫 التذاكر — احجزوا 9 يونيو!', title: 'G653 · درجة تانية × 5', detail: '~CNY 537/شخص (US$75) · ~US$377 إجمالي · المبيعات تفتح 08:00 بتوقيت بكين بالظبط 15 يوم قبل · بدائل: G89 (08:55→13:53), G655 (08:35→14:32), G801 (10:48→17:14)' },
        { label: '🏨 الفندق — 3 ليالي (23-26 يونيو) · ✅ مؤكد', title: 'Crowne Plaza Xi\'an by IHG', detail: 'No.1 Zhu Que Zhong Road, Beilin, Xi\'an 710061 · 📞 +86 29 8866 8888 · مترو Line 2 → Provincial Stadium · حجز 5489.642.171 · PIN 1418 · غرفتين (Twin + King) · فطار شامل · checkin يفتح 14:00 — القطار يوصل 13:46 يبقى نروح طوالي للفندق' },
      ],
      tip: '💡 احجزوا G653 لحظة فتح المبيعات — Beijing→Xi\'an أكتر خط HSR مزدحم في الصين والدرجة التانية بتنفد في ساعات. خدوا الجوازات معاكم — التذكرة المطبوعة/PDF بتتقرى عند البوابة. مفيش أكل في القطار، بس المحطة فيها فود كورت. مقابس كهربا في كل كرسي.',
      stripHeading: 'سور مدينة شيآن',
    },

    7: {
      timeline: [
        { time: '08:00', text: 'الخروج من الفندق — سيارة خاصة لـ Lintong (~1 ساعة / 40 كم شرق)' },
        { time: '09:00', text: 'الوصول لمقبرة Qin Shi Huang · دخول Pit 1' },
        { time: '09:30', text: 'Pit 1 — القاعة الكبيرة · 6,000 جندي في صفوف' },
        { time: '10:30', text: 'Pit 2 — فرسان ورماة · Pit 3 — مقر القيادة' },
        { time: '11:30', text: 'قاعة العربات البرونزية — عربات إمبراطورية بنص الحجم' },
        { time: '13:00', text: 'غدا: <strong>Wei Jia (魏家凉皮)</strong> — سلسلة نودلز نضيفة وعصرية · biangbiang noodles خفيفة + سمسم بارد (دي تجربة الأولاد "must-try" الصينية الخفيفة)' },
        { time: '14:30', text: 'قصر Huaqing (华清宫) — حمامات Tang الإمبراطورية الساخنة' },
        { time: '17:30', text: 'الرجوع لشيآن · العشا في مطعم <strong>Crowne Plaza</strong> (بوفيه غربي) أو مشي للـ Bell Tower لـ Vinotech / Pizza Hut' },
      ],
      stops: [
        { icon: '🗿', name: 'جيش الطين (兵马俑)', desc: '8,000 جندي طيني بحجم حقيقي بيحرسوا قبر الإمبراطور Qin Shi Huang (210 ق.م) · اكتشفهم فلاحين سنة 1974 وهما بيحفروا بير · موقع UNESCO · "العجيبة الثامنة في العالم"', mapsQuery: 'Terracotta+Army+Museum+Xian' },
        { icon: '♨️', name: 'قصر Huaqing (华清宫)', desc: 'منتجع حمامات إمبراطوري ساخن عمره 2,800 سنة · عش غرام الإمبراطور Xuanzong مع المحظية Yang Guifei · عرض مساءي "أغنية الحزن الأبدي" على جبل Li', mapsQuery: 'Huaqing+Palace+Xian' },
        { icon: '🍜', name: 'Wei Jia (魏家凉皮) — غدا صيني خفيف', desc: 'سلسلة نودلز عصرية ونضيفة · biangbiang noodles، نودلز سمسم بارد، دامبلنغ · آمن، مكيف، مناسب للأولاد · "must-try" الصيني في شيآن من غير مغامرات', mapsQuery: 'Wei+Jia+Liang+Pi+Xian' },
      ],
      info: [
        { label: '🎫 الجولة', title: 'جولة نص يوم لجيش الطين بدليل بالإنجليزي', detail: 'Klook / Trip.com: ~US$30-50/شخص · شامل النقل ذهاب وعودة + دخول + دليل · احجزوا مقدماً · ~US$150-250 لـ 5' },
      ],
      tip: '💡 استأجروا دليل — من غيره الـ Pits بتبان كأنها صفوف تماثيل مكسورة. مع الدليل كل تمثال له قصة (ضباط vs مشاة، تسريحات الشعر برتب، آثار الدهان الأصلي). Pit 1 الأكبر — ابدأوا بيه. خدوا مية، الموقع كبير والظل قليل.',
      stripHeading: 'جيش الطين',
    },

    8: {
      timeline: [
        { time: '09:30', text: 'باجودا الإوزة البرية الكبيرة (大雁塔) · ساحة معبد Da Ci\'en' },
        { time: '11:30', text: 'عرض النوافير في الساحة الشمالية — أكبر نافورة موسيقية في آسيا' },
        { time: '12:30', text: 'غدا: <strong>Vinotech</strong> (تاباس وبار نبيذ غربي جنب Bell Tower) أو Pizza Hut في King Town Plaza للأولاد' },
        { time: '14:30', text: 'حديقة Tang Paradise (大唐芙蓉园) — جنينة Tang إمبراطورية معاد إنشاؤها' },
        { time: '17:30', text: 'عشا خفيف بدري في <strong>Crowne Plaza</strong> — تجاهلوا بوفيه الدامبلنغ' },
        { time: '19:30', text: '<strong>عرض Tang Dynasty</strong> فقط (من غير وجبة) في مسرح Xi\'an Sunshine — 90 دقيقة موسيقى ورقص رائع' },
        { time: '21:30', text: 'الرجوع للفندق · حضّروا الشنط — قطار الفجر لشنغهاي بكره!' },
      ],
      stops: [
        { icon: '🏯', name: 'باجودا الإوزة البرية الكبيرة (大雁塔)', desc: 'باجودا 7 طوابق من عصر Tang، ارتفاعها 64 متر · بُنيت سنة 652 بعد الميلاد لحفظ المخطوطات البوذية اللي جابها الراهب Xuanzang من الهند · اطلعوا فوق لمنظر شيآن', mapsQuery: 'Big+Wild+Goose+Pagoda+Xian' },
        { icon: '🌸', name: 'حديقة Tang Paradise (大唐芙蓉园)', desc: 'إعادة إنشاء 66 هكتار لجنينة إمبراطورية من عصر Tang · أجنحة، بحيرات، عروض ضوئية مساءية · "مشي في عصر Tang" — عرض ملتيميديا على البحيرة الساعة 20:30', mapsQuery: 'Tang+Paradise+Xian' },
        { icon: '🎭', name: 'عرض Tang Dynasty — تذكرة عرض بس', desc: 'تجاهلوا بوفيه الدامبلنغ التقيل (18 طبق دامبلنغ كتير على المعدة الغربية). كولوا خفيف في الفندق قبل وروحوا 19:30 لتذكرة العرض بس. نفس عرض موسيقى ورقص Tang الرائع، نص الإرهاق.', mapsQuery: 'Tang+Dynasty+Show+Xian' },
      ],
      info: [
        { label: '🎭 عرض فقط — من غير وجبة', title: 'Tang Dynasty Show (تذكرة عرض)', detail: '~US$35/شخص للعرض بس · ~US$175 لـ 5 (بدل ~US$300 مع البوفيه). كولوا في الفندق قبل. احجزوا عبر Klook / Trip.com / كونسيرج الفندق.' },
      ],
      tip: '💡 Tang Paradise أحسن وقت لها وقت غروب الشمس لما الإضاءات تشتغل. بكره راكبين قطار النوم لشنغهاي — جهزوا شنطة ليلية خفيفة، الشنط الكبيرة تفضل في الفندق لحد المغادرة.',
      stripHeading: 'الباجودا · Tang Paradise · Bell Tower',
    },

    9: {
      timeline: [
        { time: '08:00', text: 'فطار في <strong>Crowne Plaza Xi\'an</strong> · حضّروا آخر شنطة' },
        { time: '09:00', text: 'إيجار عجل فوق سور المدينة — البوابة الجنوبية (¥45/3 ساعات)' },
        { time: '10:30', text: 'لفّة كاملة على السور (~14 كم، ~90 دقيقة بإيقاع مريح)' },
        { time: '11:45', text: '⚠️ <strong>Checkout من Crowne Plaza قبل 12:00</strong> — سيبوا الشنط في الـ Bell Desk، اتفسحوا لحد العصر' },
        { time: '12:30', text: 'غدا: <strong>مطعم Crowne Plaza</strong> أو Vinotech (تاباس غربي) جنب Bell Tower — غدا غربي نضيف قبل المتحف' },
        { time: '14:00', text: 'متحف تاريخ Shaanxi (陕西历史博物馆) — 370,000 قطعة أثرية على مدى 1.2 مليون سنة' },
        { time: '16:30', text: 'لفّة سريعة في <strong>سوق الحي المسلم</strong> كمحطة سياحية (شوف الفوانيس والمنتجات، من غير وجبة تقيلة)' },
        { time: '17:30', text: 'لمّوا الشنط من الـ Crowne Plaza · عشا غربي خفيف بدري (Pizza Hut / كافيه فندق / ساندوتش Starbucks)' },
        { time: '19:30', text: 'صعود قطار النوم · إيجاد الكابينة · الاستقرار' },
        { time: '20:00', text: '🛏️ ليلة من شيآن لشنغهاي · ناموا على القضبان، صحوا جنب الـ Bund' },
      ],
      stops: [
        { icon: '🚲', name: 'العجل على سور المدينة', desc: 'لفّة 14 كم فوق سور المدينة من عصر Ming · تجربة شيآن الأيقونية · عجل واحد ¥45/3 ساعات أو tandem ¥90/3 ساعات · خدوها بإيقاع وقفوا في الأبراج · سكاي لاين باجودات وأبراج طبول وشيآن العصرية', mapsQuery: 'Xian+City+Wall+Bike+Rental+South+Gate' },
        { icon: '🏺', name: 'متحف تاريخ Shaanxi', desc: 'واحد من أفضل 4 متاحف في الصين · كنوز ذهبية من عصر Tang، برونز Han، يشم Zhou · شيآن كانت عاصمة 13 سلالة فالمجموعة لا مثيل لها · الدخول مجاناً بس احجزوا أونلاين عبر WeChat 3 أيام قبل', mapsQuery: 'Shaanxi+History+Museum' },
        { icon: '🏮', name: 'الحي المسلم (回民街) — مشي سوق فقط', desc: 'أحسن استعمال له لفة 30 دقيقة سياحية (فوانيس، فاكهة مجففة، خط عربي، فرص صور) — مش وجهة أكل. الأكل ممكن يكون تقيل/غريب على المعدة الغربية. مثالي للجو، وبعدها رجعوا للفندق لعشا غربي نضيف.', mapsQuery: 'Xian+Muslim+Quarter+Huimin+Street' },
      ],
      info: [
        { label: '🛏️ القطار (مبيت)', title: 'شيآن → شنغهاي · Soft Sleeper', desc: 'D310 D-class sleeper ~19:30→07:30 (تقريباً) أو Z-class ~16 ساعة · Soft sleeper 4 سرير ¥900-1,200/سرير · الإجمالي ~¥4,500-6,000 (~US$650-900) لعيلة من 5 · التذاكر 15 يوم قبل عبر Trip.com / 12306', detail: 'D310 D-class sleeper ~19:30→07:30 (تقريباً) أو Z-class ~16 ساعة · Soft sleeper 4 سرير ¥900-1,200/سرير · الإجمالي ~¥4,500-6,000 (~US$650-900) لعيلة من 5 · التذاكر 15 يوم قبل عبر Trip.com / 12306' },
        { label: '🛌 استراتيجية الحجز', title: 'عيلة من 5 — احجزوا كابينة كاملة + سرير زيادة', detail: 'احجزوا كابينة Soft Sleeper كاملة (4 سراير، باب يقفل) + سرير في الكابينة الجنبيّة. أو لو متاح: 2 كابينات Deluxe (سريرين + حمام خاص)' },
      ],
      tip: '🛏️ Soft sleeper (软卧 ruǎnwò) = 4 سراير منجدة في كابينة بباب يقفل، شراشف، مخدة، بطانية، موزع مية ساخنة في آخر العربة. خدوا سناكس، مية، شبشب، أقنعة عيون، سدادات أذن. الأولاد هيحبوها — القطار بيهز هزة خفيفة وأنتم بتنامو وتصحوا في مدينة تانية. تجاهلوا hard sleeper (6 سراير مفتوحة) مع الأولاد.',
      stripHeading: 'متحف تاريخ Shaanxi والحي المسلم',
    },

    10: {
      timeline: [
        { time: '07:30', text: 'القطار يوصل محطة شنغهاي (上海站) · النزول' },
        { time: '08:00', text: 'فطار في <strong>Sunnyside Café · Toy Story Hotel</strong> — بوفيه غربي (بيض، بيكون، بانكيك، فاكهة طازة)' },
        { time: '09:30', text: 'سيب الشنط في Toy Story Hotel (تستلم بدري، الغرف جاهزة ~14:00)' },
        { time: '10:00', text: 'شاتل المنتجع لبوابات الديزني · ديزني يوم 1 يبدأ! 🏰' },
        { time: '10:30', text: 'استراتيجية: Rope Drop — TRON Lightcycle Power Run الأول' },
        { time: '12:30', text: 'غدا: <strong>Pinocchio Village Kitchen</strong> (إيطالي/غربي — بيتزا، باستا، أطباق رئيسية)' },
        { time: '14:00', text: 'Pirates of the Caribbean: Battle for the Sunken Treasure' },
        { time: '17:00', text: 'Roaring Rapids · Soaring Over the Horizon (قبة IMAX)' },
        { time: '19:30', text: 'عشا: <strong>World of Disney Café</strong> أو الرجوع لـ <strong>Sunnyside Café</strong> (غربي)' },
        { time: '20:00', text: 'إنارة القلعة + ختام الألعاب النارية 🎆' },
        { time: '22:00', text: 'الرجوع لـ Toy Story Hotel · ناموا!' },
      ],
      stops: [
        { icon: '🏰', name: 'شنغهاي ديزني لاند', desc: 'أكبر ديزني ريزورت في آسيا · القلعة المسحورة (أعلى قلعة في أي ديزني) · TRON Lightcycle، ركوبة Pirates، Roaring Rapids · منطقتين فريدتين لشنغهاي: Treasure Cove و Gardens of Imagination', mapsQuery: 'Shanghai+Disneyland' },
        { icon: '🤠', name: 'فندق Toy Story · شنغهاي ديزني ريزورت', desc: 'خيار budget-deluxe في الريزورت · واجهات بشخصيات Woody, Buzz, Jessie · 3 ليالي (27-30 يونيو) · شاتل مجاني كل 10 دقايق للبوابات · بوفيه Sunnyside Café غربي (بيض، بيكون، بانكيك، فاكهة)', mapsQuery: 'Toy+Story+Hotel+Shanghai+Disneyland' },
        { icon: '🍕', name: 'Pinocchio Village Kitchen — أكل غربي في الديزني', desc: 'مطعم تيمته إيطالية، خدمة سريعة · بيتزا، باستا، سلطات، بطاطا، آيس كريم · قوائم محددة بوضوح · أسهل غدا في الباركات للأولاد · جربوا كمان Aurora (أمريكي) و Lumière\'s Kitchen (فرنسي) في فندق ديزني لاند', mapsQuery: 'Pinocchio+Village+Kitchen+Shanghai+Disney' },
      ],
      info: [
        { label: '🎢 استراتيجية اليوم 1', title: 'تخطّوا الطوابير', detail: 'افتحوا أبليكيشن Shanghai Disney Resort · فعّلوا Premier Access لـ TRON + Pirates لو الميزانية تسمح (~¥120/ركوبة/شخص) · استخدموا الـ DPA للأعلى 2 ركوبتين فقط، ادخلوا الباقي مشي · ميكي وأصحابه meet-greet في الصبح' },
      ],
      tip: '🎢 Rope-drop TRON Lightcycle لحظة فتح الباركات — بحلول الـ 11:00 الانتظار 90 دقيقة. خدوا شواحن portable (هتنفدوا الموبايل بسبب الأبليكيشن). غدا غربي في Pinocchio Village Kitchen أأمن وجبة في الباركات. بعد 18:00 الطوابير أقصر، مثالي لإعادة الركوب.',
      stripHeading: 'شنغهاي ديزني لاند',
    },

    11: {
      timeline: [
        { time: '08:30', text: 'فطار الفندق (بوفيه Sunnyside غربي) · شاتل المنتجع للباركات' },
        { time: '09:30', text: 'Adventure Isle: Roaring Rapids (ركوبة مية، خدوا بونشو)' },
        { time: '11:00', text: 'تسلق Camp Discovery · Stitch Encounter' },
        { time: '12:30', text: 'غدا: <strong>Royal Banquet Hall</strong> — أكل شخصيات داخل القلعة (قائمة set غربية/دولية، ميكي وأصحابه يزورو الترابيزة — احجزوا قبل بـ 60 يوم)' },
        { time: '14:30', text: 'Tomorrowland: Buzz Lightyear · Jet Packs · TRON re-ride' },
        { time: '16:00', text: 'مسار باريد ميكي أفينيو (أحسن مكان: hub جنب القلعة)' },
        { time: '17:30', text: 'Fantasyland: Once Upon a Time Adventure (مشي في القلعة) · Seven Dwarfs Mine Train' },
        { time: '19:30', text: 'عشا: <strong>Aurora</strong> في فندق ديزني لاند (ستيك أمريكي) أو <strong>Lumière\'s Kitchen</strong> (فرنسي)' },
        { time: '20:30', text: 'ألعاب نارية القلعة "Ignite the Dream" 🎆' },
      ],
      stops: [
        { icon: '🏝️', name: 'Adventure Isle', desc: 'فريدة لشنغهاي · Roaring Rapids نهر ركوبة (هتطلعوا مبلولين) · Camp Discovery تسلق وحبال · Soaring Over the Horizon (قبة IMAX — رقم #1 في الصين)', mapsQuery: 'Adventure+Isle+Shanghai+Disneyland' },
        { icon: '🏰', name: 'Royal Banquet Hall — أكل شخصيات', desc: 'داخل القلعة المسحورة · قائمة pre-fixe غربية/دولية (~¥350/كبير) · ميكي، دونالد، سنو وايت يزورو كل ترابيزة · احجزوا قبل بـ 60 يوم عبر أبليكيشن ديزني' },
        { icon: '🥩', name: 'Aurora & Lumière\'s Kitchen — فندق ديزني لاند', desc: 'Aurora = ستيك أمريكي بمنظر سكاي لاين · Lumière\'s Kitchen = فرنسي كلاسيكي في الفندق الرئيسي · الاتنين عشا غربي مثالي بعد يوم في الباركات · مفتوح لكل الزوار (مش بس فندق ديزني لاند)' },
      ],
      tip: '🎆 يوم 2 = اتمشّوا براحة. اركبو اللي فاتكم يوم 1، وبعدين راحة في الفندق وقت الظهر (الشاتل ميقفش). ارجعوا للباريد + الألعاب النارية. Royal Banquet Hall التجربة اللي تستحق الحجز المسبق — قائمة غربية، شخصيات على الترابيزة.',
    },

    12: {
      timeline: [
        { time: '09:00', text: 'ديزني يوم 3 — آخر ضربات: TRON مرة كمان، Soaring re-ride، أي حاجة فاتت' },
        { time: '12:00', text: 'غدا في الباركات · صور أخيرة مع الشخصيات · تسوق سوفنير في Avenue M' },
        { time: '14:00', text: 'Checkout من Toy Story Hotel · تاكسي/Didi لـ Peninsula Shanghai (~50 دقيقة)' },
        { time: '15:30', text: 'تسكين في The Peninsula Shanghai · غرف منظرها على الـ Bund' },
        { time: '17:00', text: 'مشي في Nanjing Road East — شارع تسوق للمشاة' },
        { time: '19:00', text: 'عشا: <strong>Mr & Mrs Bund</strong> (Paul Pairet، فرنسي عصري — احجزوا!) أو <strong>M on the Bund</strong> (أوروبي عصري كلاسيكي بمنظر Bund)' },
        { time: '21:00', text: 'مشي ليلي على الـ Bund — سكاي لاين Pudong منور عبر نهر Huangpu 🌃' },
      ],
      stops: [
        { icon: '🏨', name: 'The Peninsula Shanghai', desc: 'فخامة Art Deco أيقونية على الـ Bund · بار Sir Elly\'s السطح بمنظر Pudong · 2 ليالي (29 يونيو → 1 يوليو) · غرفة عيلية Bund-view · فطار غربي كامل في The Lobby', mapsQuery: 'Peninsula+Shanghai' },
        { icon: '🍷', name: 'Mr & Mrs Bund (Paul Pairet)', desc: 'للشيف Michelin Paul Pairet (صاحب Ultraviolet) · بيسترو فرنسي عصري على الـ Bund · مطبخ مفتوح، خدمة لساعة متأخرة · احجزوا قبل بأسبوع-أسبوعين · بدائل: M on the Bund (الأصل الأوروبي العصري) أو 8 1/2 Otto e Mezzo Bombana (إيطالي 3 نجوم Michelin)', mapsQuery: 'Mr+and+Mrs+Bund+Shanghai' },
        { icon: '🛍️', name: 'Nanjing Road East', desc: 'شريان تسوق للمشاة 5.5 كم · لافتات نيون، مولات، عربيات سناكس · يمشي مباشرة من Peninsula لميدان People\'s Square', mapsQuery: 'Nanjing+Road+East+Shanghai' },
        { icon: '🌃', name: 'الـ Bund (外滩)', desc: 'الواجهة البحرية من الثلاثينيات · 52 مبنى Art Deco قبالة ناطحات سحاب Pudong · أحسن وقت 19:00-21:00 لما الناحيتين تنوّر', mapsQuery: 'The+Bund+Shanghai' },
      ],
      info: [
        { label: '🤔 نقطة قرار', title: 'ديزني يوم 3 ولا يوم شنغهاي كامل؟', detail: 'لو الأولاد لسه متحمسين → ضغطوا ديزني صبح + Peninsula عصر. لو مرهقين → checkout 11:00، عصر كامل في الـ Bund + Yu Garden + Tianzifang. حجز Peninsula ثابت.' },
      ],
      tip: '💡 بار Sir Elly\'s سطح Peninsula (الدور 14) لا غنى عنه لغروب الشمس على الـ Bund. Toy Story Hotel checkout 11:00 — اطلبوا من الريسبشن يحتفظوا بالشنط لو هترجعوا للباركات. احجزوا Mr & Mrs Bund قبل بأسبوع-أسبوعين — أوقات الجمعة/الويك إند بتنفد بسرعة.',
      stripHeading: 'الـ Bund و Nanjing Road',
    },

    13: {
      timeline: [
        { time: '09:00', text: 'حديقة Yu (豫园) + بازار البلد القديم — جنينة Ming الخاصة + سوق سوفنير' },
        { time: '11:30', text: 'غدا صيني خفيف must-try: <strong>Nanxiang Steamed Bun</strong> في Yu Garden (مولد الـ xiaolongbao، ساس باسكيت أو 2 لكل واحد — الأولاد هيموتوا في مسرح الدامبلنغ بالشوربة)' },
        { time: '13:30', text: 'Pudong: سطح برج شنغهاي (الدور 118، تاني أعلى مبنى في العالم) أو Oriental Pearl' },
        { time: '15:30', text: 'وقفة قهوة وكيك في <strong>Baker & Spice</strong> أو <strong>Wagas</strong> في Xintiandi (راحة كافيه غربي)' },
        { time: '16:00', text: 'Tianzifang أو Xintiandi — تسوق boutique في حواري Shikumen المرممة' },
        { time: '18:00', text: 'صورة عيلة أخيرة على الـ Bund وقت الـ Golden Hour · صورة Pudong skyline أخيرة 📸' },
        { time: '19:00', text: 'عشا الوداع: <strong>Lost Heaven on the Bund</strong> (Yunnan-Western fusion، أخف من الصيني العادي) أو <strong>Jean Georges</strong> (3 on the Bund، فرنسي عصري، مناسبة خاصة)' },
        { time: '21:30', text: 'الرجوع لـ Peninsula · حضّروا الشنط · ناموا بدري — الطيارة 00:05! ✈️' },
      ],
      stops: [
        { icon: '🌿', name: 'حديقة Yu (豫园)', desc: 'جنينة عمرها 450 سنة من عصر Ming في البلد القديم بشنغهاي · صخور، برك سمك Koi، حيطان تنانين · البازار المجاور = يشم، حرير، خط عربي', mapsQuery: 'Yu+Garden+Shanghai' },
        { icon: '🏙️', name: 'برج شنغهاي', desc: '632 متر · تاني أعلى مبنى في العالم · سطح مراقبة الدور 118 · أسرع أسانسير في العالم (74 كم/س، 55 ثانية لفوق) · ¥180/كبير', mapsQuery: 'Shanghai+Tower+Observation+Deck' },
        { icon: '🏘️', name: 'Tianzifang / Xintiandi', desc: 'حواري Shikumen مرممة من العشرينيات · كافيهات، بوتيكات، جاليريهات · Tianzifang أكثر طبيعية ومحلية · Xintiandi أنيقة وأغلى', mapsQuery: 'Tianzifang+Shanghai' },
        { icon: '🍴', name: 'Lost Heaven on the Bund / Jean Georges', desc: 'Lost Heaven = مطبخ Yunnan بأسلوب نضيف غربي (أخف من الصيني العادي، لحوم وخضار مشوية) · Jean Georges = 3 on the Bund فرنسي فاخر للوداع · بدائل فرنسية: <strong>Cuivre</strong> و <strong>Le Comptoir de Pierre Gagnaire</strong>', mapsQuery: 'Lost+Heaven+Bund+Shanghai' },
      ],
      tip: '🎑 الطيارة بكره EK 303 الساعة 00:05 — اخرجوا من الفندق 21:00 لمطار PVG (T1، Emirates). Online check-in بيفتح 24 ساعة قبل. خلوا 3 ساعات في المطار للطيارة الليلية.',
      stripHeading: 'حديقة Yu و Pudong',
    },

    14: {
      timeline: [
        { time: '00:05', text: 'إقلاع <strong>EK 303</strong> من شنغهاي PVG → دبي DXB · إيرباص A380' },
        { time: '08:15', text: '<strong>EK 927</strong> دبي DXB → القاهرة CAI · إيرباص A380' },
        { time: '11:05', text: 'الهبوط في القاهرة — البيت! 🎉' },
      ],
      info: [
        { label: '✈ الطيران', title: 'EK 303 + EK 927 · شنغهاي → القاهرة عبر دبي', detail: 'الرحلتين على إيرباص A380 · إجمالي السفر ~11 ساعة · حجز رقم 1653713358976673' },
      ],
      tip: '🛄 صرّحوا بأي قطع أثرية أو حاجات فوق ¥5,000 في جمارك PVG. Emirates بتسمح بـ 30 كيلو شحنة لكل واحد (Economy) / 40-50 كيلو (Business/First). إجمالي العيلة = سعة كبيرة للسوفنير.',
    },
  };

  /* ─────────────────────────────────────────────
     EXTRAS — Arabic versions of practical tips, plan B, transport
     ───────────────────────────────────────────── */
  const PRACTICAL_TIPS_AR = [
    'العملة: <strong>1 جنيه ≈ 0.14 يوان</strong> · بدّلوا في المطار أو البنك',
    'مفيش Google Maps في الصين — استخدموا <strong>Baidu Maps</strong> أو نزّلوا Google offline قبل الوصول',
    'محتاجين VPN لـ WhatsApp و Instagram و Gmail — ركّبوا <strong>قبل</strong> الوصول',
    'الدفع: خدوا <strong>كاش يوان</strong> + ركّبوا <strong>Alipay/WeChat Pay</strong> (نسخة الأجانب من 2024)',
    'شريحة: خدوا <strong>شريحة بيانات صينية</strong> في مطار PEK (China Unicom Tourist Card)',
    'الكهربا: <strong>220 فولت / 50 هرتز</strong> — خدوا محول Type A/C (مقابس صينية)',
    'مياه الشرب: متشربوش من الحنفية أبداً — خلوها مياه معبأة',
    '<strong>الأكل الغربي أولاً</strong> — أغلب الفنادق الفاخرة (Marriott، Westin، Sofitel، Peninsula، فنادق ديزني) عندها مطابخ غربية كاملة. هنعتمد عليها. <strong>وعي حلال</strong>: السي فود/السمك/النباتي الغربي دايماً آمن; وضّحوا "بدون بورك ولا كحول في الطبخ" بأدب.',
    'علامات الحلال: <strong>清真 (Qīngzhēn)</strong> بتعلّم على المطاعم الحلال المعتمدة — مفيد للاحتياط، مش للخطة الأساسية.',
    'البقشيش: مش عادة في الصين · خدمة عادة مشمولة في الفنادق الفاخرة',
    'طوارئ: اتصلوا <strong>110</strong> (شرطة) · <strong>120</strong> (إسعاف) · <strong>119</strong> (مطافي)',
  ];

  const TRANSPORT_TIPS_AR = [
    '<strong>بكين</strong> — المترو الأفضل (¥3-9/رحلة · لافتات إنجليزي). Didi للليل/المطار. تجاهلوا التاكسي اللي تركبوه من الشارع لو من غير عداد.',
    '<strong>شيآن</strong> — وسط البلد متراص · مترو Line 2 يربط سور المدينة + Bell Tower. Didi رخيص (¥15-30 معظم الرحلات). إيجار عجل على السور ¥45/3 ساعات.',
    '<strong>شنغهاي</strong> — المترو ممتاز (Line 11 لديزني من Hongqiao أو Pudong عبر تحويلة). Didi متاح بكتافة. Maglev من مطار Pudong (¥50، 8 دقايق، 431 كم/س).',
    '<strong>HSR (قطار سريع)</strong> — أسرع من الطيران لمسافات أقل من 1,500 كم. احجزوا Trip.com (إنجليزي) أو 12306. التذاكر تفتح <strong>15 يوم</strong> قبل المغادرة. خدوا الجوازات — التذكرة المطبوعة/PDF تتقرى عند البوابة.',
    '<strong>قطارات النوم</strong> — Soft Sleeper = 4 سراير/كابينة بباب يقفل. Deluxe Soft Sleeper = 2 سرير + حمام خاص (نادر). Hard Sleeper = 6 سراير مفتوحة (تجاهلوها مع الأولاد).',
    '<strong>نقل المطار</strong> — احجزوا قبل عبر الفندق أو Didi Premium. خلوا 90 دقيقة لـ Beijing PEK · 60 دقيقة Xi\'an XIY · 90 دقيقة Shanghai PVG.',
    '<strong>أمان المشي</strong> — خلوا الكاش في جيبين · جوازات في زيب آمن · النشالين بيستهدفوا السياح في المعالم الكبيرة.',
  ];

  const PLAN_B_AR = [
    '<strong>لو G653 نفد</strong> — قطارات HSR بديلة بكين→شيآن: G89 (08:55→13:53)، G655 (08:35→14:32)، G801 (10:48→17:14). احجزوا أول دقيقة بعد فتح المبيعات.',
    '<strong>لو قطار النوم شيآن→شنغهاي نفد</strong> — HSR نهاري G1972 / أي G-class ~6 ساعات · غادروا مساء 26 → وصلوا شنغهاي ليلاً متأخر → فندق جنب المحطة → النقلة لديزني صبح 27.',
    '<strong>لو Toy Story Hotel نفد</strong> — Shanghai Disneyland Hotel (أرقى ~$400+) · Wyndham / Holiday Inn Express قريبين من الريزورت.',
    '<strong>لو الفيزا اترفضت</strong> — هونج كونج + ماكاو (الجواز المصري بدون فيزا مع تذكرة عودة — تأكدوا في القنصلية) كرحلة آسيا بديلة.',
    '<strong>لو الأولاد مرضوا</strong> — عيادات International SOS: Beijing United Family Hospital · Shanghai United Family Hospital. خلوا صورة كارت التأمين على الموبايل.',
    '<strong>الأكل الغربي البديل</strong> — كل فندق 5 نجوم في خط الرحلة عنده مطبخ غربي كامل. لو حصل أي شك، كولوا في الفندق. Beijing Marriott، Crowne Plaza Xi\'an (Westin / Sofitel كبدائل عشا)، Toy Story Hotel، Peninsula Shanghai — كلهم غربي مضمون.',
    '<strong>احتياط حلال</strong> — Pinocchio Village Kitchen في ديزني + Sunnyside Café · حي Niujie في بكين لو عاوزين معتمد · الحي المسلم في شيآن لمشي السوق (سياحي، مش للأكل الأساسي).',
    '<strong>لو تلوث بكين زاد</strong> — كمامات N95 · يوم داخلي في متحف Capital Museum أو Universal Beijing Resort.',
    '<strong>لو طيارة اتأخرت</strong> — دعم Trip.com chat 24/7 إنجليزي · أرقام مكاتب Emirates في القاهرة/دبي في جهات الطوارئ.',
  ];

  /* ─────────────────────────────────────────────
     RENDER day content
     ───────────────────────────────────────────── */
  function renderDay(day, data) {
    const sec = document.querySelector(`.day-section[data-day="${day}"]`);
    if (!sec) return;

    sec.setAttribute('dir', 'rtl');
    sec.setAttribute('lang', 'ar');

    // Replace timeline
    const tl = sec.querySelector('.timeline');
    if (tl && data.timeline) {
      tl.innerHTML = data.timeline.map(item =>
        `<li><span class="time">${item.time}</span> ${item.text}</li>`
      ).join('');
    }

    // Replace stops
    const stopsContainer = sec.querySelector('.stops');
    if (stopsContainer && data.stops) {
      stopsContainer.innerHTML = data.stops.map(s => {
        const mapsLink = s.mapsQuery
          ? `<a href="https://www.google.com/maps/search/?api=1&query=${s.mapsQuery}" target="_blank" rel="noopener" class="btn-maps">📍 خريطة</a>`
          : '';
        const extra = s.extraLink
          ? `<a href="${s.extraLink.href}" target="_blank" rel="noopener" class="btn-maps">${s.extraLink.text}</a>`
          : '';
        return `
          <div class="stop">
            <div class="stop__icon">${s.icon}</div>
            <div class="stop__body">
              <div class="stop__name">${s.name}</div>
              <div class="stop__desc">${s.desc}</div>
              ${mapsLink} ${extra}
            </div>
          </div>
        `;
      }).join('');
    }

    // Info cards
    if (data.info) {
      const existingInfos = Array.from(sec.querySelectorAll('.info-card'));
      data.info.forEach((info, i) => {
        const card = existingInfos[i];
        if (!card) return;
        card.innerHTML = `
          <div class="info-card__label">${info.label}</div>
          <div class="info-card__title">${info.title}</div>
          <div class="info-card__detail">${info.detail}</div>
        `;
      });
    }

    // Tip box
    if (data.tip) {
      const tip = sec.querySelector('.tip-box');
      if (tip) {
        tip.innerHTML = `<span class="tip-box__icon">${data.tip.charAt(0)}</span> <span>${data.tip.slice(2)}</span>`;
      }
    }

    // Strip heading
    if (data.stripHeading) {
      const h = sec.querySelector('.strip-heading');
      if (h) h.textContent = data.stripHeading;
    }
  }

  /* ─────────────────────────────────────────────
     EXTRAS — translate panels
     ───────────────────────────────────────────── */
  function renderExtras() {
    // Practical tips panel
    const allLists = document.querySelectorAll('.tips-list');
    allLists.forEach(list => {
      // First check by surrounding h2 text content if available
      const h2 = list.previousElementSibling || list.parentElement.querySelector('h2');
      if (!h2) return;
      const heading = (h2.textContent || '').toLowerCase();

      if (heading.includes('practical tips') || heading.includes('نصائح')) {
        list.innerHTML = PRACTICAL_TIPS_AR.map(t => `<li>${t}</li>`).join('');
        list.setAttribute('dir', 'rtl');
      } else if (heading.includes('getting around') || heading.includes('مواصلات')) {
        list.innerHTML = TRANSPORT_TIPS_AR.map(t => `<li>${t}</li>`).join('');
        list.setAttribute('dir', 'rtl');
      } else if (heading.includes('plan b') || heading.includes('بدائل')) {
        list.innerHTML = PLAN_B_AR.map(t => `<li>${t}</li>`).join('');
        list.setAttribute('dir', 'rtl');
      }
    });

    // Translate panel headings
    const headingMap = {
      'Mandarin Phrasebook': 'كلمات صينية مهمة',
      'Practical Tips': 'نصائح عملية',
      'Emergency Contacts': 'أرقام طوارئ',
      'Before Leaving Cairo': 'قبل ما نسافر من القاهرة',
      'Estimated Costs': 'الميزانية التقديرية',
      'Apps to Install': 'تطبيقات لازمة',
      'Getting Around': 'المواصلات',
      'Plan B': 'الخطة البديلة',
      'Confirmed Bookings': 'الحجوزات المؤكدة',
    };
    document.querySelectorAll('.extras h2').forEach(h => {
      const txt = (h.textContent || '').split('·')[0].trim();
      if (headingMap[txt]) {
        const ar = headingMap[txt];
        const en = txt;
        h.innerHTML = `${ar} <span style="opacity:.5;font-size:.7em;">· ${en}</span>`;
        h.setAttribute('dir', 'rtl');
      }
    });

    // Extras tab labels in Arabic
    const tabMap = { 'Bookings': 'الحجوزات', 'Phrases': 'كلمات', 'Tips': 'نصائح', 'Emergency': 'طوارئ', 'Checklist': 'تشيك ليست', 'Costs': 'ميزانية', 'Apps': 'تطبيقات', 'Transport': 'مواصلات', 'Plan B': 'خطة بديلة' };
    document.querySelectorAll('.extras-tab').forEach(t => {
      const txt = t.textContent.trim();
      if (tabMap[txt]) t.textContent = tabMap[txt];
    });
  }

  /* ─────────────────────────────────────────────
     INIT
     ───────────────────────────────────────────── */
  function init() {
    // Render all 14 days
    Object.entries(DAYS).forEach(([day, data]) => renderDay(parseInt(day, 10), data));
    // Translate extras
    renderExtras();
    // Apply Cairo Play to all body content (already done via CSS, but ensure body lang)
    document.body.setAttribute('lang', 'ar');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Run after a tiny delay so quests.js + redesign.js have finished
    setTimeout(init, 80);
  }

})();
