import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-600" />
          <span>{t('nav.reports')}</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isRtl
            ? 'مؤشرات الأداء، إحصائيات الجلسات الشهرية، وتحصيل الإيرادات'
            : 'Operational metrics, monthly therapy sessions, and revenue summaries'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {isRtl ? 'نسبة حضور الجلسات' : 'Session Attendance Rate'}
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">92.4%</h3>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-brand-50 text-brand-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {isRtl ? 'الأطفال قيد التقييم' : 'Under Assessment'}
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">4</h3>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-sky-50 text-sky-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {isRtl ? 'جلسات الشهر الحالي' : 'Sessions Completed This Month'}
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">48</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            {isRtl ? 'نظرة عامة على التقارير التفصيلية' : 'Comprehensive Reports Summary'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center text-slate-500 text-xs">
          <p>
            {isRtl
              ? 'الرسوم البيانية التفاعلية ومخططات المقارنة الشهرية مجدولة للإضافة في مرحلة متقدمة من النموذج.'
              : 'Interactive charts and historical reporting will be refined in later stages.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
