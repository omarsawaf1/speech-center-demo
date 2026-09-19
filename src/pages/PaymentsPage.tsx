import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/state/AppContext';
import { Card, CardContent } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { formatCurrency } from '@/lib/utils';
import { CreditCard, Plus, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/Button';
import { Payment } from '@/types';

export const PaymentsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { state, addPayment } = useApp();
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false);

  const isRtl = i18n.language.startsWith('ar');
  const role = state.currentRole;

  // STRICT RULE: Therapist has ZERO financial visibility
  if (role === 'THERAPIST') {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-lg mx-auto space-y-4 my-10">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          المعلومات المالية والمدفوعات مقيدة
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          وفقاً لسياسة الخصوصية بالمركز، فإن البيانات المالية والخزينة غير متاحة للأخصائيين والمعالجين الإكلينيكيين وتقتصر على موظفي الاستقبال وإدارة المركز.
        </p>
      </div>
    );
  }

  // Parent visibility: ONLY their own payments
  let displayedPayments = [...state.payments];
  if (role === 'PARENT') {
    const parentId = state.currentUserId.startsWith('parent-') ? state.currentUserId : 'parent-1';
    const myChildren = state.children.filter((c) => c.parentId === parentId).map((c) => c.id);
    displayedPayments = state.payments.filter((p) => p.parentId === parentId || myChildren.includes(p.childId));
  }

  const getChildName = (id: string) => {
    const c = state.children.find((ch) => ch.id === id);
    return isRtl ? c?.nameAr : c?.nameEn;
  };

  const getParentName = (id: string) => {
    const p = state.parents.find((pr) => pr.id === id);
    return isRtl ? p?.nameAr : p?.nameEn;
  };

  // Quick payment recording state
  const [newPayChildId, setNewPayChildId] = useState(state.children[0]?.id || '');
  const [newPayAmount, setNewPayAmount] = useState('350');
  const [newPayMethod, setNewPayMethod] = useState<'CASH' | 'INSTAPAY' | 'FAWRY' | 'CARD'>('CASH');

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const child = state.children.find((c) => c.id === newPayChildId);
    const amt = parseFloat(newPayAmount) || 350;

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      childId: newPayChildId,
      parentId: child?.parentId || 'parent-1',
      amount: amt,
      paidAmount: amt,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: newPayMethod,
      status: 'PAID',
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      notes: 'سداد مسجل من شاشة المدفوعات',
      createdAt: new Date().toISOString(),
    };

    addPayment(newPayment);
    setShowNewPaymentModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 text-white p-6 rounded-2xl shadow-md">
        <div>
          <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold mb-1">
            <CreditCard className="w-4 h-4" />
            <span>{t('nav.payments')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {role === 'PARENT' ? 'سجل الفواتير والمدفوعات الخاصة بأطفالي' : 'إدارة الخزينة والمدفوعات'}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-xl">
            {role === 'PARENT'
              ? 'استعراض الإيصالات، الجلسات المسددة، والرصيد المتبقي للدفع.'
              : 'متابعة المدفوعات، الباقات، الفواتير، وطرق السداد (كاش، إنستاباي، فوري، بطاقة بنكية).'}
          </p>
        </div>

        {role !== 'PARENT' && (
          <Button
            onClick={() => setShowNewPaymentModal(true)}
            variant="secondary"
            size="sm"
            className="bg-white/15 text-white hover:bg-white/25 border-white/20 text-xs font-bold gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t('payments.newPayment')}</span>
          </Button>
        )}
      </div>

      <Card className="border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4 text-start">{isRtl ? 'رقم الإيصال والتاريخ' : 'Invoice & Date'}</th>
                  <th className="py-3 px-4 text-start">{t('appointments.child')}</th>
                  {role !== 'PARENT' && <th className="py-3 px-4 text-start">{t('nav.parents')}</th>}
                  <th className="py-3 px-4 text-start">{t('payments.amount')}</th>
                  <th className="py-3 px-4 text-start">{t('payments.method')}</th>
                  <th className="py-3 px-4 text-start">{t('common.status')}</th>
                  <th className="py-3 px-4 text-start">{isRtl ? 'ملاحظات' : 'Notes'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-800">{p.invoiceNumber}</div>
                      <div className="text-[10px] text-slate-400">{p.date}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {getChildName(p.childId)}
                    </td>
                    {role !== 'PARENT' && (
                      <td className="py-3 px-4 text-slate-600">
                        {getParentName(p.parentId)}
                      </td>
                    )}
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">
                        {formatCurrency(p.paidAmount)}
                      </span>
                      {p.paidAmount < p.amount && (
                        <span className="text-[10px] text-amber-600 block">
                          {isRtl ? 'من إجمالي' : 'of'} {formatCurrency(p.amount)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[10px]">
                        {t('payments.' + p.paymentMethod.toLowerCase())}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          p.status === 'PAID'
                            ? 'success'
                            : p.status === 'PARTIAL'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {t('payments.' + p.status.toLowerCase())}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                      {p.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Record Payment Modal */}
      {showNewPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              تسجيل إيصال سداد جديد
            </h3>

            <form onSubmit={handleCreatePayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">الطفل</label>
                <select
                  value={newPayChildId}
                  onChange={(e) => setNewPayChildId(e.target.value)}
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
                <label className="block font-bold text-slate-700 mb-1">المبلغ المسدد (ج.م)</label>
                <input
                  type="number"
                  value={newPayAmount}
                  onChange={(e) => setNewPayAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">طريقة الدفع</label>
                <select
                  value={newPayMethod}
                  onChange={(e) => setNewPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="CASH">نقداً في الاستقبال (Cash)</option>
                  <option value="INSTAPAY">إنستاباي (InstaPay)</option>
                  <option value="CARD">بطاقة بنكية (Card)</option>
                  <option value="FAWRY">فوري (Fawry)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewPaymentModal(false)}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  حفظ الإيصال
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
