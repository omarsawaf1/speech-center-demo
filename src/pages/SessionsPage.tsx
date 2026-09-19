import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { FileText, Plus, Clock, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/Button';
import { Session } from '@/types';

export const SessionsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { state, addSession } = useApp();
  const [showModal, setShowModal] = useState(false);

  const isRtl = i18n.language.startsWith('ar');
  const role = state.currentRole;

  // Scope sessions by role
  let scopedSessions = [...state.sessions];
  if (role === 'PARENT') {
    const parentId = state.currentUserId.startsWith('parent-') ? state.currentUserId : 'parent-1';
    const myChildren = state.children.filter((c) => c.parentId === parentId).map((c) => c.id);
    scopedSessions = state.sessions.filter((s) => myChildren.includes(s.childId));
  } else if (role === 'THERAPIST') {
    const staffId = state.currentUserId.startsWith('staff-') ? state.currentUserId : 'staff-2';
    scopedSessions = state.sessions.filter((s) => s.staffId === staffId);
  }

  const getChildName = (id: string) => {
    const c = state.children.find((ch) => ch.id === id);
    return isRtl ? c?.nameAr : c?.nameEn;
  };

  const getStaffName = (id: string) => {
    const s = state.staff.find((st) => st.id === id);
    return isRtl ? s?.nameAr : s?.nameEn;
  };

  // New session modal state
  const [targetChildId, setTargetChildId] = useState(state.children[0]?.id || '');
  const [objective, setObjective] = useState('');
  const [notes, setNotes] = useState('');
  const [homeRecs, setHomeRecs] = useState('');
  const [progress, setProgress] = useState<'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'NEEDS_WORK'>('GOOD');

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    const staffId = state.currentUserId.startsWith('staff-') ? state.currentUserId : 'staff-2';

    const newSession: Session = {
      id: `sess-${Date.now()}`,
      childId: targetChildId,
      staffId: staffId,
      date: new Date().toISOString().split('T')[0],
      durationMinutes: 45,
      sessionObjective: objective || 'جلسة تدريب على مهارات النطق والتواصل',
      notes: notes || 'أظهر الطفل تجاوباً إيجابياً خلال الجلسة.',
      progressAssessment: progress,
      homeRecommendations: homeRecs,
      createdAt: new Date().toISOString(),
    };

    addSession(newSession);
    setShowModal(false);
    setObjective('');
    setNotes('');
    setHomeRecs('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 text-white p-6 rounded-2xl shadow-md">
        <div>
          <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold mb-1">
            <FileText className="w-4 h-4" />
            <span>{t('nav.sessions')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {role === 'PARENT' ? 'ملاحظات وتوصيات الجلسات الإكلينيكية' : 'سجل الجلسات والملاحظات الإكلينيكية'}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-xl">
            {isRtl
              ? 'سجل الملاحظات الإكلينيكية، أهداف الجلسة، وتوصيات المتابعة والتدريب المنزلي.'
              : 'Clinical session notes, objectives, and home practice recommendations.'}
          </p>
        </div>

        {(role === 'ADMINISTRATOR' || role === 'THERAPIST') && (
          <Button
            onClick={() => setShowModal(true)}
            variant="secondary"
            size="sm"
            className="bg-white/15 text-white hover:bg-white/25 border-white/20 text-xs font-bold gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t('sessions.newSession')}</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scopedSessions.map((session) => (
          <Card key={session.id} className="hover:shadow-md transition-shadow border-slate-200">
            <CardHeader className="bg-slate-50/80 p-4 border-b border-slate-100">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-600" />
                  <span className="font-bold text-slate-900 text-xs">
                    {getChildName(session.childId)}
                  </span>
                </div>
                <Badge
                  variant={
                    session.progressAssessment === 'EXCELLENT'
                      ? 'success'
                      : session.progressAssessment === 'GOOD'
                      ? 'info'
                      : 'warning'
                  }
                  className="text-[10px]"
                >
                  {session.progressAssessment === 'EXCELLENT' ? 'ممتاز' : session.progressAssessment === 'GOOD' ? 'جيد جداً' : 'متوسط'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-500 text-[11px] pb-2 border-b border-slate-100">
                <span>{isRtl ? 'الأخصائي:' : 'Specialist:'} {getStaffName(session.staffId)}</span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{session.date} ({session.durationMinutes} {isRtl ? 'دقيقة' : 'min'})</span>
                </span>
              </div>

              <div>
                <p className="font-bold text-teal-900 text-xs mb-1">
                  {isRtl ? 'الهدف الإكلينيكي:' : 'Objective:'} {session.sessionObjective}
                </p>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-line">
                  {session.notes}
                </p>
              </div>

              {session.homeRecommendations && (
                <div className="pt-2 border-t border-slate-100 text-[11px] bg-amber-50/60 p-2.5 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-900 flex items-center gap-1 mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    {t('sessions.recommendations')}:
                  </span>
                  <p className="text-amber-800 italic">
                    {session.homeRecommendations}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Record Session Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 max-w-lg w-full space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              تدوين جلسة وملاحظات إكلينيكية جديدة
            </h3>

            <form onSubmit={handleSaveSession} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">الطفل</label>
                <select
                  value={targetChildId}
                  onChange={(e) => setTargetChildId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {state.children.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isRtl ? c.nameAr : c.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الهدف الإكلينيكي للجلسة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تثبيت نطق حرف الكاف والتهيئة الصوتية"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الملاحظات وتجاوب الطفل</label>
                <textarea
                  rows={3}
                  required
                  placeholder="أدخل الملاحظات السلوكية واللغوية أثناء الجلسة..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">تقييم تقدم الجلسة</label>
                <select
                  value={progress}
                  onChange={(e) => setProgress(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="EXCELLENT">ممتاز (استجابة سريعة للهدف)</option>
                  <option value="GOOD">جيد جداً (تحسن مستمر)</option>
                  <option value="AVERAGE">متوسط (يحتاج مزيد تدريب)</option>
                  <option value="NEEDS_WORK">يحتاج تركيز إضافي</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">توصيات المتابعة المنزلية للأهل</label>
                <textarea
                  rows={2}
                  placeholder="تمارين يومية موجهة لولي الأمر..."
                  value={homeRecs}
                  onChange={(e) => setHomeRecs(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(false)}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  حفظ الجلسة
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
