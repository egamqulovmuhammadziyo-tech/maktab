import { useState, useEffect } from 'react';
import { scheduleApi } from '../../api';
import type { ScheduleEntry } from '../../types';

const DAYS = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
const CLASSES = ['5-A', '9-A', '11-A'];
const LESSON_COLORS: Record<string, string> = {
  'Matematika': 'bg-blue-100 text-blue-700',
  'Algebra': 'bg-blue-100 text-blue-700',
  'Fizika': 'bg-cyan-100 text-cyan-700',
  'Kimyo': 'bg-emerald-100 text-emerald-700',
  'Biologiya': 'bg-green-100 text-green-700',
  'Ingliz tili': 'bg-violet-100 text-violet-700',
  'Tarix': 'bg-amber-100 text-amber-700',
  'Informatika': 'bg-purple-100 text-purple-700',
};

export function ScheduleAdminPage() {
  const [selectedClass, setSelectedClass] = useState('5-A');
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editCell, setEditCell] = useState<{ day: string; order: number } | null>(null);
  const [editValue, setEditValue] = useState('');

  const load = async (cls: string) => {
    setLoading(true);
    try {
      const res = await scheduleApi.getClass(cls);
      setSchedule(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(selectedClass); }, [selectedClass]);

  const getSubject = (day: string, order: number) => {
    return schedule.find((s) => s.day === day && s.lesson_order === order)?.subject || '';
  };

  const handleEdit = (day: string, order: number) => {
    setEditCell({ day, order });
    setEditValue(getSubject(day, order));
  };

  const handleSaveCell = () => {
    if (!editCell) return;
    setSchedule((prev) => {
      const filtered = prev.filter((s) => !(s.day === editCell.day && s.lesson_order === editCell.order));
      if (editValue.trim()) {
        return [...filtered, { id: Date.now(), class_name: selectedClass, day: editCell.day, lesson_order: editCell.order, subject: editValue.trim() }];
      }
      return filtered;
    });
    setEditCell(null);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await scheduleApi.update({ entries: schedule.map(({ day, lesson_order, subject }) => ({ class_name: selectedClass, day, lesson_order, subject })) });
      alert('Jadval saqlandi!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-slate-800">Dars jadvali</h1>
          <p className="text-slate-500 text-sm mt-0.5">Sinf bo'yicha dars jadvalini tahrirlang</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {CLASSES.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`btn btn-sm rounded-xl font-bold ${selectedClass === cls ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white border-0 shadow-lg' : 'btn-ghost border border-slate-200'}`}
              >
                {cls}
              </button>
            ))}
          </div>
          <button onClick={handleSaveAll} disabled={saving} className="btn rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white border-0 shadow-lg gap-2">
            {saving ? <span className="loading loading-spinner loading-sm" /> : '💾 Saqlash'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-brand-500" /></div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase w-12">Dars</th>
                  {DAYS.map((day) => (
                    <th key={day} className="p-4 text-left text-xs font-bold text-slate-500 uppercase">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6].map((order) => (
                  <tr key={order} className="border-t border-slate-100 hover:bg-slate-50/50">
                    <td className="p-4">
                      <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white text-xs font-bold">
                        {order}
                      </span>
                    </td>
                    {DAYS.map((day) => {
                      const subj = getSubject(day, order);
                      const isEditing = editCell?.day === day && editCell?.order === order;
                      const colorClass = LESSON_COLORS[subj] || (subj ? 'bg-slate-100 text-slate-600' : '');
                      return (
                        <td key={day} className="p-2">
                          {isEditing ? (
                            <input
                              autoFocus
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={handleSaveCell}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveCell(); if (e.key === 'Escape') setEditCell(null); }}
                              className="input input-bordered input-sm rounded-xl w-full text-sm"
                            />
                          ) : (
                            <button
                              onClick={() => handleEdit(day, order)}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80 min-h-[32px] ${
                                subj ? colorClass : 'text-slate-300 hover:bg-slate-100 hover:text-slate-500'
                              }`}
                            >
                              {subj || "+ qo'shish"}
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <p className="text-xs text-slate-400">💡 Katakchani bosib tahrirlang. Enter — saqlash, Esc — bekor qilish. Keyin "Saqlash" tugmasini bosing.</p>
          </div>
        </div>
      )}
    </div>
  );
}
