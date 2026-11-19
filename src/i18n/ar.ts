/** Every piece of text the site shows, in Arabic. */
import type { ColourKey } from '../pages/solver/entry.ts'
import type { MethodId } from '../core/methods/index.ts'
import { beginnerText } from './ar/beginner.ts'
import { keyholeText } from './ar/keyhole.ts'
import { cfopText } from './ar/cfop.ts'
import { rouxText } from './ar/roux.ts'
import { zzText } from './ar/zz.ts'
import { petrusText } from './ar/petrus.ts'
import { beforeYouStartText } from './ar/before-you-start.ts'
import { solverAboutText } from './ar/solver-about.ts'
import type { Messages } from './en.ts'
import type { MethodText } from './method-text.ts'
import { ltr } from './notation.ts'

const colourNames: Record<ColourKey, string> = {
  W: 'أبيض',
  Y: 'أصفر',
  R: 'أحمر',
  O: 'برتقالي',
  B: 'أزرق',
  G: 'أخضر',
}

/** The colour as a definite masculine adjective, as after «المركز». */
const theColour = (colour: ColourKey) => `ال${colourNames[colour]}`

const faceNames = ['العلوي', 'الأيمن', 'الأمامي', 'السفلي', 'الأيسر', 'الخلفي']

/** The text of every method, in the order of `METHOD_IDS`. */
const methods: Record<MethodId, MethodText> = {
  beginner: beginnerText,
  keyhole: keyholeText,
  cfop: cfopText,
  roux: rouxText,
  zz: zzText,
  petrus: petrusText,
}

/**
 * Arabic counts: `zero`, `one` and `two` are whole phrases; `few` (3 to 10)
 * takes the plural noun and `many` (11 and up) the singular, each after the number.
 */
const plural = (
  count: number,
  forms: { zero: string; one: string; two: string; few: string; many: string },
) => {
  if (count === 0) return forms.zero
  if (count === 1) return forms.one
  if (count === 2) return forms.two
  const rest = count % 100
  return rest >= 3 && rest <= 10 ? `${count} ${forms.few}` : `${count} ${forms.many}`
}

export const ar: Messages = {
  site: {
    name: 'Cubewise',
    tagline: 'حُلّ مكعبك وتعلّم حلّه في الوقت نفسه.',
    description:
      'أدخِل ألوان مكعبك 3×3 المخلوط واحصل في ثوانٍ على حل قصير متحرك. ثم تعلّم أن تحله بنفسك، خطوة بخطوة.',
    nav: { solver: 'حل المكعب', learn: 'تعلّم' },
    menu: { open: 'افتح القائمة', close: 'أغلق القائمة' },
    language: 'اللغة',
    theme: { label: 'المظهر', system: 'مثل جهازك', light: 'فاتح', dark: 'داكن' },
    footer: 'صُنع لمن على مكتبه مكعب مخلوط.',
    builtBy: 'من إنجاز',
    author: 'Ahmed Zougari',
    notFound: {
      title: 'الصفحة غير موجودة',
      body: 'هذه الصفحة غير موجودة. أداة الحل ما زالت هنا.',
      action: 'اذهب إلى الصفحة الرئيسية',
    },
  },

  colourNames,
  faceNames,

  home: {
    title: 'حل مكعب روبيك 3×3 خطوة بخطوة ودروس لتعلّمه | Cubewise',
    heading: 'حُلّ مكعبك وتعلّم حلّه في الوقت نفسه.',
    lead: 'أدخِل ألوان مكعبك 3×3 المخلوط وشاهده يُحَلّ حركة بعد حركة. وعندما تكون مستعداً، تعلّم الطريقة وحُلّه بنفسك.',
    solveAction: 'حُلّ مكعبي',
    learnAction: 'تعلّم حلّه',
    cubeAlt: 'مكعب 3×3 محلول',
    load3d: 'اضغط لتحميل المكعب بالأبعاد الثلاثة',
    /** Short reassurances under the hero buttons. */
    perks: ['مجاني', 'بلا حساب', 'يُحَلّ داخل متصفحك'],
    how: {
      heading: 'كيف يعمل',
      steps: [
        {
          title: 'أدخِل ألوانك',
          body: 'أمسك المكعب وانقل ألوانه، وجهاً بعد وجه. على لوحة المفاتيح، اضغط رقم الملصق ثم حرف اللون. على الهاتف، اختر لوناً ثم المس الملصق.',
        },
        {
          title: 'احصل على الحل',
          body: 'يتحقق Cubewise من خلوّ المكعب من الأخطاء، ثم يحله داخل متصفحك. اختر الحل القصير من نحو 21 حركة، أو طريقة تتعلّمها، محلولة مرحلة بعد مرحلة.',
        },
        {
          title: 'تابع الحل',
          body: 'شغّل الحل على مكعب بالأبعاد الثلاثة، أوقفه مؤقتاً، أو تقدّم حركة بعد حركة وأنت تدير المكعب في يديك.',
        },
      ],
    },
    roadmap: {
      heading: 'من أين تبدأ، وإلى أين تمضي بعد ذلك',
      lead: 'كل طريقة يعلّمها Cubewise محطة على هذا المسار، وأداة الحل تستطيع حل مكعبك بأي واحدة منها. اقطع المحطات الأولى بالترتيب. وحيث يتفرّع المسار تكون الطرق بدائل: اختر ما يناسبك منها، ولا حاجة إلى تعلّمها كلها.',
      /** Signs on the road: where it starts, where it forks, and between two methods that are alternatives. */
      signs: { start: 'البداية', fork: 'ثم اختر واحدة', or: 'أو' },
      moves: (count: number) =>
        `نحو ${plural(count, { zero: 'لا حركات', one: 'حركة واحدة', two: 'حركتين', few: 'حركات', many: 'حركة' })}`,
      action: 'شاهد المراحل',
      movesNote: 'أعداد الحركات هي تقريباً ما تحتاجه أداة الحل في Cubewise مع كل طريقة.',
      allMethods: 'شاهد كل الطرق',
    },
    learn: {
      heading: 'تعلّم طريقة المبتدئين',
      lead: 'طريقة المبتدئين تحل المكعب طبقة بعد طبقة في سبع مراحل. لكل مرحلة هدف واحد ومتتاليات قليلة تحفظها.',
      action: 'شاهد كل المراحل',
    },
    faq: {
      heading: 'أسئلة وأجوبة',
      items: [
        {
          question: 'هل يمكن حل أي مكعب مخلوط؟',
          answer:
            'نعم، ما دام قد خُلط بتدوير أوجهه. أي مكعب كهذا يمكن حله في 20 حركة أو أقل. أما إذا لُويت زاوية باليد أو فُكّك المكعب وأُعيد تركيبه خطأ، فقد يكون حله مستحيلاً، وسيخبرك Cubewise بذلك.',
        },
        {
          question: 'كم حركة سيكون الحل؟',
          answer:
            'في العادة 21 حركة أو أقل، وأحياناً 22. أقصر حل ممكن لا يحتاج أبداً إلى أكثر من 20 حركة، لكن إيجاده بالضبط يأخذ وقتاً أطول بكثير من إيجاد حل يكاد يكون بقصره.',
        },
        {
          question: 'يقول الموقع إن مكعبي لا يمكن حله. ماذا أفعل؟',
          answer:
            'في أغلب الأحيان أُدخل ملصق أو ملصقان خطأ. يُبرز Cubewise الملصقات التي يشكّ فيها. قارنها بمكعبك، صحّحها واضغط «حُلّ» من جديد.',
        },
        {
          question: 'ألوان مكعبي مختلفة. هل سيعمل مع ذلك؟',
          answer:
            'نعم. لوّن مركز كل وجه بلون مختلف ليطابق مكعبك، ثم لوّن الباقي. أي ستة ألوان تصلح، ما دمت تستخدم اللون نفسه للون نفسه في كل مرة.',
        },
        {
          question: 'هل أحتاج إلى حساب، وهل يُرفع أي شيء؟',
          answer:
            'لا. لا توجد حسابات، والمكعب يُحَلّ داخل متصفحك. ألوانك تُحفظ على جهازك فقط، فلا تضيع عند تحديث الصفحة.',
        },
        {
          question: 'ماذا تعني الحروف في الحل؟',
          answer:
            'كل حرف وجه، وهو أول حرف من اسمه بالإنجليزية: R الأيمن (Right)، وL الأيسر (Left)، وU العلوي (Up)، وD السفلي (Down)، وF الأمامي (Front)، وB الخلفي (Back). الحرف وحده يعني ربع دورة باتجاه عقارب الساعة وأنت تنظر إلى ذلك الوجه، والفاصلة العليا تعني عكس عقارب الساعة، والرقم 2 يعني نصف دورة.',
        },
      ],
    },
    closing: {
      heading: 'أمسك مكعبك',
      body: 'أدخِل ألوانه وتابع الحل حركة بعد حركة، أو افتح الدرس الأول وتعلّم حلّه بنفسك.',
      learnAction: 'ابدأ طريقة المبتدئين',
    },
  },

  solver: {
    title: 'حل مكعب روبيك أونلاين بالألوان أو بالكاميرا | Cubewise',
    description:
      'أداة مجانية لحل مكعب روبيك 3×3 أونلاين. أدخِل ألوان مكعبك أو امسحه بالكاميرا، ثم تابع الحل خطوة بخطوة: الحل القصير أو الطريقة التي تتعلّمها.',
    heading: 'أداة حل مكعب روبيك',
    lead: 'انقل ألوان مكعبك 3×3 المخلوط، وجهاً بعد وجه، أو امسحه بالكاميرا. ثم اضغط «حُلّ» وتابع الحركات.',
    /** The text under the tool. */
    about: solverAboutText,
    loading3d: 'جارٍ تحميل المكعب بالأبعاد الثلاثة…',

    entry: {
      colours: 'الألوان',
      coloursHint: 'اختر لوناً، ثم انقر الملصقات على الوجه الأمامي.',
      paletteLabel: (colour: ColourKey, count: number) =>
        `${colourNames[colour]}، لُوّن ${count} من 9`,
      keyboard: 'لوحة المفاتيح',
      keyboardSteps: [
        { keys: ['1', '–', '9'], text: 'اختر ملصقاً على الوجه الأمامي' },
        { keys: ['W', 'Y', 'R', 'O', 'B', 'G'], text: 'لوّنه وانتقل إلى التالي' },
        { keys: ['←', '↑', '↓', '→'], text: 'اجلب وجهاً آخر إلى الأمام' },
      ],
      allFaces: 'الأوجه الستة كلها',
      allFacesHint: 'انقر وجهاً لتجلبه إلى الأمام.',
      stickerLabel: (face: number, number: number, colour: ColourKey | null) =>
        `الوجه ${faceNames[face]}، الملصق ${number}، ${colour === null ? 'غير ملوّن' : colourNames[colour]}`,
      turn: { left: 'أظهِر الوجه الأيسر', right: 'أظهِر الوجه الأيمن', up: 'أظهِر الوجه العلوي', down: 'أظهِر الوجه السفلي' },
      undo: 'تراجع',
      redo: 'إعادة',
      clearFace: 'امسح الوجه',
      reset: 'ابدأ المكعب من جديد',
      solve: 'حُلّ',
      solving: 'جارٍ الحل…',
    },

    scan: {
      open: 'امسح بالكاميرا',
      heading: 'امسح مكعبك',
      progress: (face: number) => `الوجه ${face} من 6`,
      steps: [
        'أرِ الكاميرا وجهاً واحداً من المكعب. هذا هو الوجه الأمامي. لاحظ أي وجه في الأعلى.',
        'أدِر المكعب ليأتي الوجه الذي على اليمين إلى الأمام. أبقِ الوجه نفسه في الأعلى.',
        'أدِره بالاتجاه نفسه مرة أخرى، إلى الوجه الجانبي التالي.',
        'أدِره بالاتجاه نفسه مرة أخيرة، إلى آخر وجه جانبي.',
        'الآن أمِل المكعب ليأتي الوجه العلوي إلى الأمام.',
        'أمِله في الاتجاه المعاكس، ربعَي دورة، ليأتي الوجه السفلي إلى الأمام.',
      ],
      tips: 'استخدم إضاءة متساوية وتجنّب الانعكاس. أمسك الوجه مستقيماً ومواجهاً للكاميرا: يُلتقط تلقائياً بعد العثور عليه وتثبيته. إن لم يُعثر على المكعب، حاذِ الوجه مع المربع واضغط «التقط».',
      starting: 'جارٍ تشغيل الكاميرا…',
      looking: 'جارٍ البحث عن المكعب…',
      holdStill: 'اثبت…',
      turnNow: 'تم الالتقاط. الآن أدِر المكعب.',
      capture: 'التقط',
      retake: 'أعد التقاط الوجه الأخير',
      cancel: 'إلغاء',
      tryAgain: 'حاول من جديد',
      videoLabel: 'صورة الكاميرا؛ تُرسم شبكة فوق وجه المكعب عند العثور عليه',
      reviewHeading: 'تحقّق من الألوان',
      check: 'قارن كل وجه بصورته. إن كان ملصق خطأ، فاختر لونه في الأسفل ثم المس الملصق.',
      pictureLabel: (face: number) => `الصورة الملتقطة للوجه ${face}`,
      checkSticker: (face: number, number: number, colour: ColourKey) =>
        `الوجه ${face}، الملصق ${number}، ${colourNames[colour]}`,
      use: 'استخدم هذه الألوان',
      again: 'امسح من جديد',
      done: 'تم المسح. قارن الألوان بمكعبك، صحّح الخطأ منها، ثم اضغط «حُلّ».',
      copyReport: 'انسخ تقرير المسح',
      reportCopied: 'تم النسخ',
      guide: {
        open: 'كيف تمسح',
        title: 'كيف تمسح مكعبك',
        intro: 'تُري الكاميرا وجهاً واحداً في كل مرة، ستة أوجه في المجموع. ثبّت كل وجه حتى ترى علامة الصح، ثم أدِر المكعب.',
        laptop: {
          title: 'على الحاسوب المحمول',
          picture: 'شخص يجلس أمام حاسوب محمول ويرفع مكعباً أمام كاميرته، يثبت، ثم يدير المكعب إلى الوجه التالي، ست مرات.',
          hold: 'اجلس مواجهاً للشاشة وارفع المكعب أمام الكاميرا، ووجه واحد منه مستوٍ نحوها.',
        },
        phone: {
          title: 'على الهاتف',
          picture: 'شخص يمسك هاتفاً بيد ومكعباً باليد الأخرى، يوجّه الكاميرا الخلفية نحو المكعب، ثم يدير المكعب إلى الوجه التالي، ست مرات.',
          hold: 'أمسك الهاتف بيد والمكعب باليد الأخرى، وبينهما نحو شبر. أدِر المكعب، لا الهاتف.',
        },
        stepsTitle: 'الأوجه الستة بالترتيب',
        steps: [
          'أظهِر الوجه الأمامي.',
          'أدِر المكعب إلى الوجه الجانبي التالي.',
          'أدِره بالاتجاه نفسه مرة أخرى.',
          'ومرة أخيرة، لآخر وجه جانبي.',
          'أمِل المكعب لتُظهر الوجه العلوي.',
          'أمِله إلى الجهة المعاكسة تماماً لتُظهر الوجه السفلي.',
        ],
        light: 'الإضاءة من الجانب هي الأفضل. المصباح فوق المكعب مباشرة يجعل الملصقات تلمع.',
        close: 'فهمت',
      },
      errors: {
        unsupported: 'هذا المتصفح لا يستطيع استخدام الكاميرا. أدخِل الألوان يدوياً.',
        denied: 'تم حجب الكاميرا. اسمح لهذا الموقع باستخدام الكاميرا من متصفحك، ثم حاول من جديد.',
        missing: 'لم يُعثر على كاميرا في هذا الجهاز.',
        failed: 'تعذّر تشغيل الكاميرا. أغلق التطبيقات الأخرى التي تستخدمها، ثم حاول من جديد.',
      },
    },

    method: {
      label: 'الطريقة',
      short: 'الحل القصير',
      shortHint: 'نحو 21 حركة. أسرع طريق إلى مكعب محلول، بلا مراحل تتابعها.',
      methodsGroup: 'طرق يمكنك تعلّمها',
    },

    problems: {
      title: 'هذا المكعب لا يمكن حله بعد',
      unpainted: (count: number) =>
        plural(count, {
          zero: 'لا يوجد ملصق بلا لون.',
          one: 'ملصق واحد ما زال بلا لون.',
          two: 'ملصقان ما زالا بلا لون.',
          few: 'ملصقات ما زالت بلا لون.',
          many: 'ملصقاً ما زالت بلا لون.',
        }),
      'wrong-sticker-count': 'في المكعب ملصقات ناقصة. ابدأه من جديد وأدخِل الألوان مرة أخرى.',
      'duplicate-centres':
        'مركزان لهما اللون نفسه. كل وجه يحتاج إلى مركز بلون مختلف.',
      'unknown-colour':
        'الملصقات المُبرَزة لها لون ليس لأي مركز. تحقّق منها، أو أعد تلوين مركز.',
      'wrong-colour-count': (wrong: { colour: ColourKey; count: number }[]) =>
        `كل لون يجب أن يظهر 9 مرات. الآن: ${wrong
          .map(({ colour, count }) => `${colourNames[colour]} ${count}`)
          .join('، ')}.`,
      'impossible-piece':
        'القطعة المُبرَزة لا توجد في أي مكعب. واحد على الأقل من ملصقاتها خطأ.',
      'duplicate-piece':
        'القطعة نفسها تظهر مرتين. واحد على الأقل من الملصقات المُبرَزة خطأ.',
      'twisted-corner':
        'كل القطع موجودة، لكن هناك زاوية ملتوية. تحقّق من ملصقات الزوايا، أو أن الزاوية لُويت باليد على المكعب الحقيقي.',
      'flipped-edge':
        'كل القطع موجودة، لكن هناك حافة مقلوبة. ابحث في ملصقات الحواف عن لونين متبادلين.',
      'swapped-pieces':
        'كل القطع موجودة، لكن هناك قطعتان متبادلتان. ابحث عن ملصقين أُدخلا معكوسين.',
      failed: 'حدث خطأ أثناء الحل. حاول من جديد من فضلك.',
    },

    report: {
      question: 'واجهت مشكلة؟',
      action: 'أبلِغ عنها',
    },

    playback: {
      heading: 'الحل',
      moveCount: (count: number) =>
        plural(count, {
          zero: 'لا حركات',
          one: 'حركة واحدة',
          two: 'حركتان',
          few: 'حركات',
          many: 'حركة',
        }),
      alreadySolved: 'هذا المكعب محلول أصلاً. لا شيء تفعله!',
      hold: (front: ColourKey, up: ColourKey) =>
        `أمسك المكعب والمركز ${theColour(front)} يواجهك والمركز ${theColour(up)} في الأعلى.`,
      progress: (done: number, total: number) => `الحركة ${done} من ${total}`,
      play: 'تشغيل',
      pause: 'إيقاف مؤقت',
      back: 'خطوة إلى الوراء',
      forward: 'خطوة إلى الأمام',
      restart: 'العودة إلى البداية',
      pauseLabel: 'التوقف بين الحركات',
      pauseValue: (pauseMs: number) => (pauseMs === 0 ? 'بلا توقف' : `${(pauseMs / 1000).toFixed(1)} ث`),
      edit: 'عدّل المكعب',
      done: 'تم الحل!',
      keys: [
        { keys: ['المسافة'], text: 'تشغيل أو إيقاف مؤقت' },
        { keys: ['←', '→'], text: 'حركة إلى الوراء أو إلى الأمام' },
        { keys: ['E'], text: 'تعديل المكعب' },
      ],
      notation:
        'الحرف ربع دورة باتجاه عقارب الساعة وأنت تنظر إلى ذلك الوجه (R الأيمن، L الأيسر، U العلوي، D السفلي، F الأمامي، B الخلفي). الفاصلة العليا تعني عكس عقارب الساعة، والرقم 2 يعني نصف دورة.',
      wholeCubeNotation:
        'الحرف x أو y أو z بخط متقطع يعني تدوير المكعب كاملاً، لا وجهاً واحداً: x كما يدور R، وy كما يدور U، وz كما يدور F.',
      wideNotation:
        'الحرف الصغير دورة عريضة: ذلك الوجه والطبقة الوسطى التي خلفه معاً. M وE وS تدير طبقة وسطى وحدها: M كما يدور L، وE كما يدور D، وS كما يدور F.',
      lesson: 'الدرس',
      stageDone: 'منتهية أصلاً.',
    },
  },

  methods,

  learn: {
    title: 'تعلّم حل مكعب روبيك: اختر طريقة | Cubewise',
    description:
      'دروس في طرق حل مكعب روبيك 3×3، من طريقة المبتدئين إلى CFOP وRoux وZZ. اختر طريقة وتعلّمها مرحلة بعد مرحلة.',
    heading: 'تعلّم حل المكعب',
    lead: 'للمكعب أكثر من طريقة حل. اختر طريقة وتعلّمها مرحلة بعد مرحلة: لكل مرحلة هدف واحد، وصور لما تبحث عنه، ومتتاليات تشاهدها بالأبعاد الثلاثة.',
    methodsHeading: 'اختر طريقة',
    stageCount: (count: number) =>
      plural(count, {
        zero: 'لا مراحل',
        one: 'مرحلة واحدة',
        two: 'مرحلتان',
        few: 'مراحل',
        many: 'مرحلة',
      }),
    progress: (done: number, total: number) => `اكتمل ${done} من ${total}`,
    stageNumber: (number: number) => `المرحلة ${number}`,
    suggestUpdate: 'اقترح تعديلاً',
    beforeYouStart: beforeYouStartText,
    method: {
      pageTitle: (name: string) => `${name}: تعلّمها مرحلة بعد مرحلة | Cubewise`,
      allMethods: 'كل الطرق',
      stagesHeading: 'المراحل',
    },
    practice: {
      heading: 'تمرّن على مكعبك',
      body: (name: string) =>
        `في أداة الحل، اختر «${name}» طريقةً للحل. تحل مكعبك بهذه المراحل نفسها، فتتابع كل مرحلة والمكعب في يديك.`,
      action: 'افتح أداة الحل',
    },
    lesson: {
      pageTitle: (name: string, method: string, number: number) =>
        `${name}: ${method}، المرحلة ${number} | Cubewise`,
      allStages: 'كل المراحل',
      backToStages: (method: string) => `${method}: كل المراحل`,
      stageOf: (number: number, total: number) => `المرحلة ${number} من ${total}`,
      goal: 'الهدف',
      steps: 'طريقة التنفيذ',
      cases: 'كيف تبدو',
      tip: 'نصيحة',
      watch: 'شاهد بالأبعاد الثلاثة',
      copyMarkdown: 'انسخ بصيغة Markdown',
      markdownCopied: 'تم النسخ',
      markdownCopyFailed: 'تعذّر النسخ',
      /** Before the address of the lesson, on the last line of the copied Markdown. */
      markdownSource: 'المصدر:',
      markComplete: 'علّمها مكتملة',
      completed: 'مكتملة',
      tryIt: 'جرّبها على مكعبك',
      notation:
        'قراءة الحركات: الحرف ربع دورة باتجاه عقارب الساعة وأنت تنظر إلى ذلك الوجه (R الأيمن، L الأيسر، U العلوي، D السفلي، F الأمامي، B الخلفي). الفاصلة العليا تعني عكس عقارب الساعة، والرقم 2 يعني نصف دورة. في الصور، الملصقات الرمادية هي التي لا تهمّ الآن.',
      wideNotation: `الحرف الصغير (${ltr('r, u, f')}) دورة عريضة: ذلك الوجه والطبقة الوسطى التي خلفه معاً. M وE وS تدير طبقة وسطى وحدها: M كما يدور L، وE كما يدور D، وS كما يدور F. أما x وy وz فتدير المكعب كاملاً: x كما يدور R، وy كما يدور U، وz كما يدور F.`,
    },
  },
}
