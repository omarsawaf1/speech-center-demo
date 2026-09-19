import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Users, 
  Award, 
  Brain, 
  Mic, 
  Smile, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  X,
  Phone,
  Send,
  HelpCircle,
  FileText,
  Clock,
  ShieldCheck,
  Star,
  Heart,
  MapPin
} from 'lucide-react';
import { ASSETS } from '@/lib/assets';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';

export const PublicHomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRtl = i18n.language === 'ar';

  // Video modal state
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Auto-scroll when navigating to public sub-routes (e.g. /about, /services)
  React.useEffect(() => {
    const sectionId = location.pathname.replace('/', '');
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  // Contact form state
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    childAge: '',
    serviceInterest: 'SPEECH_THERAPY',
    notes: '',
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setFormData({
        parentName: '',
        phone: '',
        childAge: '',
        serviceInterest: 'SPEECH_THERAPY',
        notes: '',
      });
    }, 4000);
  };

  const services = [
    {
      id: 'speech',
      titleAr: 'جلسات التخاطب وعلاج اضطرابات النطق',
      titleEn: 'Speech & Language Therapy',
      descAr: 'علاج اللدغات، التأتأة (التلعثم)، تأخر نمو اللغة، والعيوب النطقية بأحدث أساليب التحفيز الصوتي واللساني.',
      descEn: 'Comprehensive interventions for stuttering, articulation disorders, language delays, and phonological issues.',
      icon: Mic,
      color: 'from-teal-500 to-emerald-600',
      bgColor: 'bg-teal-50/70 border-teal-200/80',
      badge: 'تخاطب ونطق',
      features: ['تقييم مخارج الأصوات', 'تدريبات عضلات النطق', 'توسيع الحصيلة اللغوية', 'علاج التأتأة والخنف']
    },
    {
      id: 'skills',
      titleAr: 'تنمية المهارات وتعديل السلوك',
      titleEn: 'Skills Development & Behavior',
      descAr: 'برامج متخصصة لزيادة التركيز والانتباه، الذاكرة البصرية والسمعية، والتعامل مع فرط الحركة وتشتت الانتباه (ADHD).',
      descEn: 'Specialized programs enhancing sustained attention, visual memory, and managing hyperactivity and impulsivity.',
      icon: Brain,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50/70 border-purple-200/80',
      badge: 'مهارات وسلوك',
      features: ['تعديل السلوك الإيجابي', 'زيادة مدى الانتباه والجلوس', 'التمييز السمعي والبصري', 'التآزر الحركي البصري']
    },
    {
      id: 'occupational',
      titleAr: 'العلاج الوظيفي والتكامل الحسي',
      titleEn: 'Occupational & Sensory Therapy',
      descAr: 'غرف مجهزة بأحدث أدوات التكامل الحسي لمساعدة الأطفال الذين يعانون من اضطراب المعالجة الحسية وصعوبات الحركة الدقيقة.',
      descEn: 'Sensory integration equipment addressing sensory processing disorders and fine motor coordination difficulties.',
      icon: Activity,
      color: 'from-sky-500 to-blue-600',
      bgColor: 'bg-sky-50/70 border-sky-200/80',
      badge: 'تكامل حسي',
      features: ['تنظيم المدخلات الحسية', 'تطوير مسكة القلم والمهام الدقيقة', 'التوازن والتخطيط الحركي', 'الاستقلالية في رعاية الذات']
    },
    {
      id: 'iq',
      titleAr: 'اختبارات الذكاء والمقاييس النفسية',
      titleEn: 'IQ & Psychological Assessments',
      descAr: 'تطبيق مقاييس مقننة وموثوقة مثل ستانفورد بينيه (الصورة الخامسة)، وفاينلاند، ومقاييس التوحد (CARS / GARS).',
      descEn: 'Standardized testing including Stanford-Binet 5, Vineland Adaptive Behavior Scales, and Autism assessments.',
      icon: Award,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50/70 border-amber-200/80',
      badge: 'مقاييس معتمدة',
      features: ['تحديد العمر العقلي واللغوي', 'اكتشاف صعوبات التعلم مبكراً', 'تقارير رسمية مفصلة', 'جلسة استشارية وتوجيه لولي الأمر']
    },
    {
      id: 'learning',
      titleAr: 'صعوبات التعلم والتأهيل الأكاديمي',
      titleEn: 'Learning Difficulties Remediation',
      descAr: 'استراتيجيات تعليمية علاجية لمعالجة عسر القراءة (ديسلكسيا)، وصعوبات الكتابة، والرياضيات قبل وأثناء المرحلة الدراسية.',
      descEn: 'Remediation strategies for dyslexia, dysgraphia, and dyscalculia, boosting academic resilience.',
      icon: FileText,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'bg-rose-50/70 border-rose-200/80',
      badge: 'تأهيل أكاديمي',
      features: ['تأسيس القراءة بالتهجئة الصوتية', 'معالجة بطء الاستيعاب', 'تنمية مهارات التفكير المنطقي', 'تهيئة الطفل للدمج المدرسي']
    },
    {
      id: 'autism',
      titleAr: 'برامج طيف التوحد والتواصل البديل',
      titleEn: 'Autism & AAC Communication',
      descAr: 'تطبيق أساليب التواصل المعزز والبديل (PECS)، وبرامج بورتيدج وتيتش، لتعزيز التواصل اللفظي وغير اللفظي.',
      descEn: 'AAC (PECS), Portage, and structured teaching empowering verbal and non-verbal interactive communication.',
      icon: Smile,
      color: 'from-emerald-500 to-teal-700',
      bgColor: 'bg-emerald-50/70 border-emerald-200/80',
      badge: 'تواصل ودعم',
      features: ['برامج بيكس (PECS) المصورة', 'تحفيز التواصل البصري والتفاعل', 'الحد من نوبات الغضب', 'الدمج الاجتماعي التدريجي']
    }
  ];

  const steps = [
    {
      num: '01',
      titleAr: 'حجز الموعد والاستقبال',
      titleEn: 'Appointment Booking',
      descAr: 'التواصل الأولي مع مكتب الاستقبال لحجز موعد جلسة تشخيصية تناسب جدول الأسرة وتحديد الشكوى المبدئية.',
      icon: Calendar,
      color: 'bg-teal-600'
    },
    {
      num: '02',
      titleAr: 'التقييم الشامل والتشخيص',
      titleEn: 'Diagnostic Assessment',
      descAr: 'جلسة تقييمية إكلينيكية مع الاستشاري لتطبيق المقاييس اللغوية والنفسية وتحديد العمر اللغوي ونقاط القوة والضعف.',
      icon: Award,
      color: 'bg-cyan-600'
    },
    {
      num: '03',
      titleAr: 'وضع الخطة الفردية (IEP)',
      titleEn: 'Individualized Treatment Plan',
      descAr: 'تصميم خطة علاجية مخصصة للطفل بأهداف محددة وقابلة للقياس خلال فترات زمنية واضحة تشارك فيها الأسرة.',
      icon: Brain,
      color: 'bg-purple-600'
    },
    {
      num: '04',
      titleAr: 'الجلسات التأهيلية المنتظمة',
      titleEn: 'Regular Therapy Sessions',
      descAr: 'تنفيذ الجلسات الفردية أو الجماعية بمعدل (2 إلى 3 جلسات أسبوعياً) مع تسجيل دقيق للملاحظات واستجابة الطفل.',
      icon: Activity,
      color: 'bg-blue-600'
    },
    {
      num: '05',
      titleAr: 'المتابعة والإرشاد المنزلي',
      titleEn: 'Progress Tracking & Guidance',
      descAr: 'تزويد ولي الأمر بتمارين منزلية وتحديث دوري في ملف الطفل على بوابة المركز الرقمية لمشاهدة التطور المستمر.',
      icon: CheckCircle2,
      color: 'bg-emerald-600'
    }
  ];

  const team = [
    {
      nameAr: 'د. خالد منصور القاضي',
      nameEn: 'Dr. Khaled Mansour El-Kady',
      roleAr: 'استشاري التخاطب وأمراض الصوت والرنين',
      roleEn: 'Consultant of Phonetics & Speech Disorders',
      exp: 'خبرة 16 عاماً',
      qualifications: 'دكتوراه أمراض التخاطب والصوت، عضو الجمعية المصرية للتخاطب',
      img: ASSETS.doctorBoy,
      color: 'border-teal-500'
    },
    {
      nameAr: 'أ. سارة أحمد رضوان',
      nameEn: 'Ms. Sara Ahmed Radwan',
      roleAr: 'أخصائية التخاطب وعيوب النطق وتأخر الكلام',
      roleEn: 'Senior Speech-Language Therapist',
      exp: 'خبرة 8 أعوام',
      qualifications: 'ماجستير في علوم التخاطب، متخصصة في تأهيل زارعي القوقعة واللدغات',
      img: ASSETS.doctorGirl,
      color: 'border-blue-500'
    },
    {
      nameAr: 'أ. محمد علي عثمان',
      nameEn: 'Mr. Mohamed Ali Othman',
      roleAr: 'أخصائي تنمية المهارات وصعوبات التعلم',
      roleEn: 'Cognitive Skills & Learning Specialist',
      exp: 'خبرة 10 أعوام',
      qualifications: 'دبلوم مهني في التربية الخاصة، خبير اختبارات الذكاء ومقاييس الانتباه',
      img: ASSETS.doctorBoy,
      color: 'border-purple-500'
    },
    {
      nameAr: 'أ. مريم حسن كمال',
      nameEn: 'Ms. Maryam Hassan Kamal',
      roleAr: 'أخصائية العلاج الوظيفي والتكامل الحسي',
      roleEn: 'Occupational & Sensory Integration Specialist',
      exp: 'خبرة 7 أعوام',
      qualifications: 'معتمدة دولياً في غرف التكامل الحسي وبرامج تعديل السلوك المعرفي',
      img: ASSETS.doctorGirl,
      color: 'border-amber-500'
    }
  ];

  const packages = [
    {
      id: 'single',
      nameAr: 'الجلسة الفردية الواحدة',
      nameEn: 'Single Individual Session',
      price: '350',
      period: 'لكل جلسة (45 دقيقة)',
      popular: false,
      features: [
        'جلسة فردية مباشرة 1:1 مع الأخصائي',
        'تدريب مكثف على الهدف اللغوي أو السلوكي',
        'تقرير شفهي وتوصيات بعد الجلسة مباشرة',
        'مرونة كاملة في المواعيد'
      ],
      cta: 'حجز جلسة واحدة',
      color: 'border-slate-200 bg-white'
    },
    {
      id: 'monthly',
      nameAr: 'باقة الانطلاق الشهرية',
      nameEn: 'Monthly Progress Package',
      price: '1,300',
      period: '4 جلسات شهرياً + تقرير دوري',
      popular: true,
      features: [
        '4 جلسات تأهيلية فردية متخصصة',
        'متابعة دورية لقياس التطور والتحسن',
        'كراسة التدريبات والأنشطة المنزلية',
        'حساب ولي أمر للمتابعة على النظام الرقمي',
        'خصم 10% على جلسات التقييم الإضافية'
      ],
      cta: 'اشتراك الباقة الأكثر طلباً',
      color: 'border-teal-500 bg-gradient-to-b from-teal-50/70 to-white ring-2 ring-teal-500/20 shadow-lg'
    },
    {
      id: 'intensive',
      nameAr: 'باقة التأهيل المكثف',
      nameEn: 'Intensive Rehab Package',
      price: '2,400',
      period: '8 جلسات شهرياً (جلستان أسبوعياً)',
      popular: false,
      features: [
        '8 جلسات مكثفة شهرياً للتسريع العلاجي',
        'خطة فردية متكاملة تجمع التخاطب والمهارات',
        'جلسة إرشاد أسري شهرية مع الاستشاري',
        'أولوية اختيار مواعيد الذروة المسائية',
        'دعم وتواصل مباشر مع الأخصائي عبر المنصة'
      ],
      cta: 'طلب الباقة المكثفة',
      color: 'border-slate-200 bg-white'
    },
    {
      id: 'assessment',
      nameAr: 'جلسة التقييم الشامل المبدئي',
      nameEn: 'Initial Comprehensive Evaluation',
      price: '500',
      period: 'جلسة تشخيصية (60-75 دقيقة)',
      popular: false,
      features: [
        'فحص شامل لأعضاء النطق والمخارج الصوتية',
        'تطبيق اختبار لغوي واختبار ذكاء مقنن',
        'تقرير تشخيصي مكتوب ومختوم للمدارس أو التأمين',
        'مناقشة تفصيلية مع ولي الأمر ووضع الخطة'
      ],
      cta: 'حجز موعد التقييم',
      color: 'border-slate-200 bg-white'
    }
  ];

  const faqs = [
    {
      q: 'متى يجب أن أقلق بشأن تأخر الكلام عند طفلي واستشارة المركز؟',
      a: 'إذا بلغ الطفل عمر سنتين ولم ينطق سوى كلمات معدودة، أو لا يستطيع تكوين جملة بسيطة من كلمتين عند عمر سنتين ونصف، أو كان يعاني من عدم وضوح مخارج الحروف الشديد مقارنة بأقرانه، يُنصح بالتوجه لجلسة تقييم مبكر تفادياً لتراكم المشكلة.'
    },
    {
      q: 'كم مدة الجلسة العلاجية الواحدة؟',
      a: 'تستغرق الجلسة الفردية المعتادة 45 دقيقة من التدريب المركز، تليها 5 إلى 10 دقائق لمناقشة ولي الأمر وتقديم النصائح والتوصيات المنزلية اللازمة.'
    },
    {
      q: 'هل يحضر ولي الأمر داخل غرفة الجلسة مع الطفل؟',
      a: 'في الجلسات التقييمية الأولى يفضل تواجد ولي الأمر لبث الطمأنينة في نفس الطفل. لاحقاً، يتم تقييم استجابة الطفل؛ فغالباً ما يكون استيعاب الطفل وتركيزه مع الأخصائي أعلى عند خروج ولي الأمر، مع إمكانية المراقبة من خلال شاشات المتابعة أو الحضور في الدقائق الختامية.'
    },
    {
      q: 'كم عدد الجلسات التي يحتاجها طفلي للوصول للتحسن التام؟',
      a: 'تختلف الاستجابة وفترة التأهيل من طفل لآخر تبعاً للعمر، ونوع الاضطراب (لدغات بسيطة تستغرق أسابيع، بينما تأخر النمو اللغوي أو التوحد قد يتطلب خططاً ممتدة)، ومدى التزام الأسرة بالتدريب اليومي في المنزل.'
    },
    {
      q: 'هل يقبل المركز الأطفال المشخصين بطيف التوحد أو فرط الحركة؟',
      a: 'نعم، يمتلك المركز قسماً متكاملاً لرعاية أطفال طيف التوحد ومتلازمة داون وتشتت الانتباه وفرط الحركة (ADHD) ببرامج دمج سلوكي وتكامل حسي متطورة.'
    },
    {
      q: 'ما هي طرق الدفع المتاحة بالمركز؟',
      a: 'نقبل الدفع النقدي في الاستقبال، والبطاقات البنكية، بالإضافة إلى التحويل الفوري عبر إنستاباي (InstaPay) والمحافظ الإلكترونية.'
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-gradient-to-b from-teal-50/60 via-cyan-50/20 to-white">
        {/* Soft decorative background circles */}
        <div className="absolute top-0 end-0 -mt-24 -me-24 w-96 h-96 rounded-full bg-teal-200/30 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 start-0 -ms-24 w-80 h-80 rounded-full bg-cyan-200/30 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left/Text column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs sm:text-sm font-bold border border-teal-200 shadow-sm">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>{t('public.heroBadge')}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                {t('public.heroTitle')}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t('public.heroSubtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a href="#contact" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    variant="primary" 
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-teal-700/20 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 gap-2.5"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>{t('public.bookAssessment')}</span>
                  </Button>
                </a>

                <Link to="/login" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-base border-2 border-teal-600 text-teal-700 hover:bg-teal-50 gap-2.5 bg-white shadow-sm"
                  >
                    <ShieldCheck className="w-5 h-5 text-teal-600" />
                    <span>{t('public.enterPortal')}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </Button>
                </Link>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-slate-600 font-medium">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  أخصائيون معتمدون ومرخصون
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  خطط علاجية فردية مخصصة
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  متابعة رقمية وتقارير مستمرة
                </span>
              </div>
            </div>

            {/* Right/Asset column */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Image Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-teal-500 to-cyan-700 group">
                  <img 
                    src={ASSETS.doctorBoy} 
                    alt="Therapist with boy learning to speak" 
                    className="w-full h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      جلسات إكلينيكية مباشرة
                    </span>
                    <h3 className="text-lg font-bold">بيئة دافئة محفزة للأطفال</h3>
                    <p className="text-xs text-slate-300 mt-1">تجهيزات حديثة تدمج التعلم باللعب التفاعلي</p>
                  </div>

                  {/* Play Video Trigger Button */}
                  <button
                    onClick={() => setVideoModalOpen(true)}
                    className="absolute top-4 end-4 w-12 h-12 rounded-full bg-white/90 text-teal-700 shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all focus:outline-none group/btn"
                    title="مشاهدة نبذة فيديو عن المركز"
                  >
                    <Play className="w-5 h-5 ms-0.5 fill-teal-600 text-teal-600" />
                  </button>
                </div>

                {/* Floating Floating Stat Badge */}
                <div className="absolute -bottom-6 -start-4 bg-white p-4 rounded-2xl shadow-xl border border-teal-100 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-extrabold text-xl">
                    98%
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">معدل التحسن والرضا</div>
                    <div className="text-sm font-extrabold text-slate-800">بشهادة أولياء الأمور</div>
                  </div>
                </div>

                {/* Floating Badge Top */}
                <div className="absolute -top-4 -start-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg border border-teal-100 text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  فروعنا تستقبلكم يومياً
                </div>
              </div>
            </div>
          </div>

          {/* Stat Counters Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-teal-100 shadow-md">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-teal-700">1,200+</div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">{t('public.statChildren')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-cyan-700">8+</div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">{t('public.statSpecialties')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-purple-700">98%</div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">{t('public.statSatisfaction')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-emerald-700">15,000+</div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">{t('public.statSessions')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT US SECTION */}
      <section id="about" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Column with Second Asset */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative mx-auto max-w-md">
                <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-teal-50 bg-teal-50">
                  <img 
                    src={ASSETS.doctorGirl} 
                    alt="Therapist with girl in session" 
                    className="w-full h-96 object-cover object-center hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Secondary Accent Card */}
                <div className="absolute -bottom-6 -end-4 bg-gradient-to-br from-teal-700 to-cyan-800 text-white p-5 rounded-2xl shadow-xl max-w-xs">
                  <div className="flex items-center gap-2 mb-1.5 font-bold text-sm">
                    <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
                    رعاية تركز على الأسرة
                  </div>
                  <p className="text-xs text-teal-100 leading-relaxed">
                    نعتبر الوالدين شركاء أساسيين في خطة التأهيل بتدريبات منزلية سهلة التطبيق.
                  </p>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
                <Award className="w-3.5 h-3.5" />
                <span>{t('public.aboutBadge')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                {t('public.aboutTitle')}
              </h2>

              <p className="text-base text-slate-600 leading-relaxed">
                {t('public.aboutDesc1')}
              </p>

              <p className="text-base text-slate-600 leading-relaxed">
                {t('public.aboutDesc2')}
              </p>

              {/* Core Values / Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100">
                  <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    المقاييس الإكلينيكية المقننة
                  </h4>
                  <p className="text-xs text-slate-600">
                    تشخيص دقيق مبني على اختبارات لغة واختبارات ذكاء معترف بها دولياً ومحلياً.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-cyan-50/60 border border-cyan-100">
                  <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                    بيئة آمنة ومبهجة
                  </h4>
                  <p className="text-xs text-slate-600">
                    غرف علاجية مجهزة بأدوات تفاعلية وألعاب ذكاء تجعل الطفل مقبلاً على التعلم.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section id="services" className="py-20 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold">
              <Brain className="w-3.5 h-3.5 text-cyan-600" />
              <span>{t('public.servicesBadge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
              {t('public.servicesTitle')}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t('public.servicesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc) => {
              const IconComp = svc.icon;
              return (
                <div 
                  key={svc.id}
                  className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${svc.bgColor} flex flex-col justify-between`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${svc.color} text-white flex items-center justify-center shadow-md`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <Badge variant="outline" className="text-xs font-semibold bg-white/80">
                        {svc.badge}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {svc.titleAr}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {svc.descAr}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200/60 space-y-2">
                      {svc.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-4">
                    <a href="#contact" className="block">
                      <Button variant="outline" size="sm" className="w-full justify-center bg-white font-bold text-xs rounded-xl hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-colors">
                        طلب استشارة في هذا التخصص
                      </Button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>{t('public.howBadge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
              {t('public.howTitle')}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t('public.howSubtitle')}
            </p>
          </div>

          <div className="relative">
            {/* Step cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {steps.map((step) => {
                const IconComp = step.icon;
                return (
                  <div 
                    key={step.num}
                    className="relative bg-gradient-to-b from-slate-50 to-teal-50/30 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-extrabold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-lg">
                          الخطوة {step.num}
                        </span>
                        <div className={`w-10 h-10 rounded-xl ${step.color} text-white flex items-center justify-center shadow`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base mb-2">
                        {step.titleAr}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.descAr}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-medium text-teal-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-teal-600" />
                      إشراف إكلينيكي مباشر
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center text-xs text-slate-500 font-medium">
              * هذا المسار هو نموذج استرشادي لتوضيح خطوات تجربة ولي الأمر بالمركز.
            </div>
          </div>
        </div>
      </section>

      {/* 5. SPECIALISTS / TEAM SECTION */}
      <section id="team" className="py-20 bg-gradient-to-b from-teal-50/40 via-white to-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
              <Users className="w-3.5 h-3.5 text-teal-600" />
              <span>{t('public.teamBadge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
              {t('public.teamTitle')}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t('public.teamSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col"
              >
                <div className="h-56 overflow-hidden bg-teal-100 relative group">
                  <img 
                    src={member.img} 
                    alt={member.nameAr} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 end-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-teal-800 shadow-sm">
                    {member.exp}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {member.nameAr}
                    </h3>
                    <p className="text-xs font-semibold text-teal-700 mt-0.5">
                      {member.roleAr}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {member.qualifications}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      مواعيد منتظمة
                    </span>
                    <Badge variant="success" className="text-[10px]">
                      متاح للحجز
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PRICING & PACKAGES SECTION */}
      <section id="pricing" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('public.pricingBadge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
              {t('public.pricingTitle')}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t('public.pricingSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${pkg.color} ${
                  pkg.popular ? 'scale-105 shadow-xl relative' : 'shadow-sm hover:shadow-md'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 start-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md">
                    الأكثر طلباً واختياراً
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{pkg.nameAr}</h3>
                  <div className="text-xs text-slate-500 mb-4">{pkg.period}</div>

                  <div className="flex items-baseline gap-1 my-4">
                    <span className="text-3xl font-extrabold text-teal-700">{pkg.price}</span>
                    <span className="text-sm font-bold text-slate-600">{t('common.currency')}</span>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-slate-200/60">
                    {pkg.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <a href="#contact" className="block">
                    <Button 
                      variant={pkg.popular ? 'primary' : 'outline'}
                      className="w-full justify-center rounded-xl font-bold text-xs py-2.5"
                    >
                      {pkg.cta}
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-xs text-slate-400">
            * الأسعار المذكورة أعلاه استرشادية للعرض التجريبي ويمكن للإدارة تخصيص خطط الدفع.
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>{t('public.faqBadge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('public.faqTitle')}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-start p-5 font-bold text-slate-900 flex items-center justify-between gap-4 hover:text-teal-700 focus:outline-none"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-teal-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. CONTACT & LOCATION SECTION */}
      <section id="contact" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span>{t('public.contactBadge')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {t('public.contactTitle')}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {t('public.contactDesc')}
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-teal-50/60 border border-teal-100">
                  <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">فرع مدينة نصر (الرئيسي)</h4>
                    <p className="text-xs text-slate-600 mt-0.5">شارع عباس العقاد، بجوار مستشفى دار الحكمة، القاهرة</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-50/60 border border-cyan-100">
                  <div className="w-9 h-9 rounded-lg bg-cyan-600 text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">فرع التجمع الخامس</h4>
                    <p className="text-xs text-slate-600 mt-0.5">شارع التسعين الشمالي، مجمع العيادات التخصصية، القاهرة الجديدة</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-50/60 border border-purple-100">
                  <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">الخط الساخن والحجز المباشر</h4>
                    <p className="text-xs text-slate-600 mt-0.5" dir="ltr">0100 111 2223 / 0111 222 3334</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Booking & Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  طلب حجز موعد تقييم استرشادي
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  املأ البيانات وسيقوم فريق الاستقبال بالتواصل معك لتأكيد الموعد المناسب.
                </p>

                {contactSubmitted ? (
                  <div className="p-6 rounded-2xl bg-teal-600 text-white text-center space-y-2 animate-in fade-in">
                    <CheckCircle2 className="w-12 h-12 mx-auto text-teal-200" />
                    <h4 className="text-lg font-bold">تم استلام طلبكم بنجاح!</h4>
                    <p className="text-xs text-teal-100">
                      هذا نموذج تفاعلي تجريبي. سيتم حفظ الملاحظة وإدراجها ضمن استفسارات العرض.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          اسم ولي الأمر
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.parentName}
                          onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                          placeholder="مثال: أحمد محمود"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          رقم الهاتف / واتساب
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="010xxxxxxxx"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          عمر الطفل
                        </label>
                        <input
                          type="text"
                          value={formData.childAge}
                          onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                          placeholder="مثال: 4 سنوات و6 أشهر"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          نوع الخدمة المطلوبة
                        </label>
                        <select
                          value={formData.serviceInterest}
                          onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        >
                          <option value="SPEECH_THERAPY">علاج نطق وتخاطب (تأخر كلام / لدغات)</option>
                          <option value="SKILLS_DEVELOPMENT">تنمية مهارات وتعديل سلوك</option>
                          <option value="OCCUPATIONAL_THERAPY">علاج وظيفي وتكامل حسي</option>
                          <option value="IQ_ASSESSMENT">اختبار ذكاء وتقييم شامل</option>
                          <option value="AUTISM_SUPPORT">برامج طيف التوحد (تواصل وتأهيل)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ملاحظات إضافية حول حالة الطفل
                      </label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="أدخل أية تفاصيل حول مخاوفك أو تقارير سابقة..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      ></textarea>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full justify-center py-3 rounded-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-sm gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{t('public.sendMessage')}</span>
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO PREVIEW MODAL */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full border border-slate-700 relative">
            <div className="p-4 flex items-center justify-between border-b border-slate-800 text-white">
              <span className="text-sm font-bold flex items-center gap-2">
                <Play className="w-4 h-4 text-teal-400" />
                نبذة مرئية عن المركز والجلسات
              </span>
              <button 
                onClick={() => setVideoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-black flex justify-center">
              <video 
                src={ASSETS.snippetsVideo} 
                controls 
                autoPlay 
                className="w-full max-h-96 rounded-xl object-contain"
              >
                متصفحك لا يدعم تشغيل مقاطع الفيديو.
              </video>
            </div>
            <div className="p-3 bg-slate-900 text-center text-xs text-slate-400">
              تسجيل توضيحي من الأنشطة الحركية والتفاعلية للأطفال داخل المركز.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
