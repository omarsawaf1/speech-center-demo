import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import { Card, CardContent } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Users, Search, Plus, ArrowRight, ArrowLeft } from 'lucide-react';

export const ChildrenPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const isRtl = i18n.language.startsWith('ar');
  const role = state.currentRole;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Scope children by role
  let scopedChildren = [...state.children];
  if (role === 'PARENT') {
    const parentId = state.currentUserId.startsWith('parent-') ? state.currentUserId : 'parent-1';
    scopedChildren = state.children.filter((c) => c.parentId === parentId);
  } else if (role === 'THERAPIST') {
    const staffId = state.currentUserId.startsWith('staff-') ? state.currentUserId : 'staff-2';
    scopedChildren = state.children.filter((c) => c.assignedStaffIds.includes(staffId));
  }

  const filteredChildren = scopedChildren.filter((child) => {
    const term = searchTerm.toLowerCase();
    return (
      child.nameAr.toLowerCase().includes(term) ||
      child.nameEn.toLowerCase().includes(term) ||
      (child.diagnosisSummary && child.diagnosisSummary.toLowerCase().includes(term))
    );
  });

  const getParentName = (parentId: string) => {
    const parent = state.parents.find((p) => p.id === parentId);
    return isRtl ? parent?.nameAr : parent?.nameEn;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 text-white p-6 rounded-2xl shadow-md">
        <div>
          <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold mb-1">
            <Users className="w-4 h-4" />
            <span>
              {role === 'PARENT' ? 'ملفات أطفالي' : role === 'THERAPIST' ? 'حالاتي المسندة' : t('nav.children')}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {role === 'PARENT' ? 'أطفالي المسجلين بالمركز' : role === 'THERAPIST' ? 'قائمة الحالات العلاجية المسندة' : 'إدارة ملفات الأطفال'}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-xl">
            {role === 'PARENT'
              ? 'متابعة بيانات أطفالك، التقييم الإكلينيكي المبدئي، والأخصائيين المشرفين.'
              : 'سجل تفصيلي للأطفال، بيانات التشخيص اللغوي والسلوكي، ومعلومات التواصل.'}
          </p>
        </div>

        {(role === 'ADMINISTRATOR' || role === 'RECEPTIONIST') && (
          <Button
            onClick={() => alert(isRtl ? 'تسجيل طفل متاح في العرض' : 'Child registration modal')}
            variant="secondary"
            size="sm"
            className="bg-white/15 text-white hover:bg-white/25 border-white/20 text-xs font-bold gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t('common.create')}</span>
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isRtl ? 'ابحث باسم الطفل أو التشخيص...' : 'Search by child name or diagnosis...'}
            className="w-full text-xs ps-9 pe-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
          />
        </div>
        <div className="text-xs text-slate-500 font-bold px-2">
          {filteredChildren.length} {isRtl ? 'أطفال' : 'Children'}
        </div>
      </div>

      {/* Children Grid/List */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4 text-start">{t('appointments.child')}</th>
                  <th className="py-3 px-4 text-start">{isRtl ? 'تاريخ الميلاد / النوع' : 'DOB / Gender'}</th>
                  {role !== 'PARENT' && <th className="py-3 px-4 text-start">{t('nav.parents')}</th>}
                  <th className="py-3 px-4 text-start">{isRtl ? 'التشخيص والبرنامج' : 'Diagnosis'}</th>
                  <th className="py-3 px-4 text-start">{t('common.status')}</th>
                  <th className="py-3 px-4 text-end">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredChildren.map((child) => (
                  <tr key={child.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {isRtl ? child.nameAr : child.nameEn}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {child.id}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{child.birthDate}</div>
                      <span className="text-[10px] text-slate-400">
                        {child.gender === 'MALE' ? (isRtl ? 'ذكر' : 'Male') : (isRtl ? 'أنثى' : 'Female')}
                      </span>
                    </td>
                    {role !== 'PARENT' && (
                      <td className="py-3 px-4 text-slate-600">
                        {getParentName(child.parentId)}
                      </td>
                    )}
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                      {child.diagnosisSummary || (isRtl ? 'قيد التقييم الأولي' : 'Initial assessment')}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          child.status === 'ACTIVE'
                            ? 'success'
                            : child.status === 'ASSESSMENT'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {child.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <Link
                        to={`/children/${child.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900"
                      >
                        <span>{t('common.view')}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
