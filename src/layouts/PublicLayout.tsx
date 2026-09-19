import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Globe, 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Clock, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { ASSETS } from '@/lib/assets';
import { Button } from '@/components/Button';

export const PublicLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRtl = i18n.language === 'ar';

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  const navLinks = [
    { label: t('public.home'), href: '/', hash: '' },
    { label: t('public.about'), href: '/about', hash: '#about' },
    { label: t('public.services'), href: '/services', hash: '#services' },
    { label: t('public.howItWorks'), href: '/how-it-works', hash: '#how-it-works' },
    { label: t('public.team'), href: '/team', hash: '#team' },
    { label: t('public.pricing'), href: '/pricing', hash: '#pricing' },
    { label: t('public.faq'), href: '/faq', hash: '#faq' },
    { label: t('public.contact'), href: '/contact', hash: '#contact' },
  ];

  const handleNavClick = (href: string, hash: string) => {
    setMobileMenuOpen(false);
    navigate(href);
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-teal-50/40 via-white to-slate-50 text-slate-800 selection:bg-teal-200 selection:text-teal-900 font-sans">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 text-white text-xs sm:text-sm py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white font-medium px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              {t('common.prototypeNotice')}
            </span>
          </div>
          <div className="flex items-center gap-4 text-teal-100 hidden sm:flex">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-200" />
              السبت - الخميس: 9:00 ص - 8:00 م
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-teal-200" />
              01001112223
            </span>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-teal-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-xs border border-teal-500/20 group-hover:scale-105 transition-transform bg-teal-50/60 flex items-center justify-center p-1.5">
                <img 
                  src={ASSETS.logo} 
                  alt="Ofok Center Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to text if image not loaded
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    {t('common.appName')}
                  </span>
                </span>
                <span className="text-xs text-teal-700 font-medium">
                  للتخاطب وتأهيل وتنمية مهارات الأطفال
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href, link.hash)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive 
                        ? 'text-teal-700 bg-teal-50 font-bold' 
                        : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Actions: Language & Portal CTA */}
            <div className="hidden sm:flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-slate-600 hover:text-teal-700 gap-1.5 rounded-full px-3 text-xs"
              >
                <Globe className="w-4 h-4 text-teal-600" />
                <span>{t('common.languageSwitcher')}</span>
              </Button>

              <Link to="/login">
                <Button 
                  variant="primary" 
                  size="md"
                  className="shadow-md shadow-teal-700/20 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 border-none font-bold rounded-xl gap-2 text-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('public.enterPortal')}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggleLanguage}
                className="p-2 text-slate-600 hover:text-teal-600 rounded-lg"
                title={t('common.languageSwitcher')}
              >
                <Globe className="w-5 h-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-teal-600 rounded-xl hover:bg-teal-50 focus:outline-none transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-teal-100 bg-white/98 px-4 pt-3 pb-6 shadow-xl space-y-2 animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href, link.hash)}
                  className="w-full text-start px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full justify-center rounded-xl py-3 font-bold bg-gradient-to-r from-teal-600 to-cyan-600 gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('public.enterPortal')}</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white p-1 overflow-hidden">
                  <img src={ASSETS.logo} alt="Ofok" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-bold text-white tracking-wide">
                  {t('common.appName')}
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                صرح تأهيلي ورعاية إكلينيكية متخصصة لمساعدة الأطفال على النطق والتواصل الواثق وبناء المهارات الحركية والنفسية بأحدث المقاييس في القاهرة.
              </p>
              <div className="flex items-center gap-2 text-xs text-teal-400 font-medium bg-teal-950/60 border border-teal-800/60 p-2.5 rounded-xl">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t('public.demoNotice')}</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                روابط سريعة
              </h3>
              <ul className="space-y-2.5 text-sm">
                {navLinks.slice(0, 5).map((l) => (
                  <li key={l.href}>
                    <button 
                      onClick={() => handleNavClick(l.href, l.hash)}
                      className="text-slate-400 hover:text-teal-400 transition-colors"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                البرامج التأهيلية
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-teal-300">علاج اضطرابات النطق والكلام</li>
                <li className="hover:text-teal-300">تنمية المهارات والتركيز والذاكرة</li>
                <li className="hover:text-teal-300">تعديل السلوك والتربية الخاصة</li>
                <li className="hover:text-teal-300">العلاج الوظيفي والتكامل الحسي</li>
                <li className="hover:text-teal-300">اختبارات الذكاء والمقاييس النفسية</li>
              </ul>
            </div>

            {/* Branches & Contact */}
            <div>
              <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                الفروع ومواعيد العمل
              </h3>
              <div className="space-y-3 text-sm text-slate-400">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-teal-400 mt-1 shrink-0" />
                  <span>فرع 1: مدينة نصر - شارع عباس العقاد، القاهرة</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-teal-400 mt-1 shrink-0" />
                  <span>فرع 2: التجمع الخامس - التسعين الشمالي، القاهرة الجديدة</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                  <span dir="ltr">0100 111 2223 / 0111 222 3334</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>السبت إلى الخميس (9:00 ص - 8:00 م)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 {t('common.appName')}. جميع الحقوق محفوظة - نموذج تجريبي تفاعلي.</p>
            <div className="flex items-center gap-1 text-slate-400">
              <span>صُمم بعناية لدعم أطفالنا وأولياء أمورهم</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-1" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
