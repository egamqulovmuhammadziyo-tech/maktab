import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => ReactNode;
}

interface CrudPageProps<T extends { id: number }> {
  title: string;
  subtitle?: string;
  columns: Column<T>[];
  fetchAll: () => Promise<{ data: T[] }>;
  onDelete: (id: number) => Promise<unknown>;
  renderForm: (item: T | null, onClose: () => void, onSave: () => void) => ReactNode;
  emptyMessage?: string;
}

export function CrudPage<T extends { id: number }>({
  title,
  subtitle,
  columns,
  fetchAll,
  onDelete,
  renderForm,
  emptyMessage = "Ma'lumot yo'q",
}: CrudPageProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<T | null | undefined>(undefined); // undefined = closed, null = new
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchAll();
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    setDeleting(id);
    try {
      await onDelete(id);
      await load();
    } finally {
      setDeleting(null);
    }
  };

  const getCellValue = (item: T, key: keyof T | string): ReactNode => {
    const val = item[key as keyof T];
    if (typeof val === 'boolean') return val ? '✅' : '❌';
    if (typeof val === 'string' && val.length > 60) return val.slice(0, 60) + '…';
    return val as ReactNode;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-slate-800">{title}</h1>
          {subtitle && <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>}
        </div>
        <button
          onClick={() => setEditing(null)}
          className="btn rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white border-0 shadow-lg shadow-brand-500/25 hover:-translate-y-0.5 transition-transform gap-2"
        >
          <HiPlus className="w-5 h-5" />
          Qo'shish
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-brand-500" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg font-semibold">{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-xs font-bold text-slate-500 uppercase">#</th>
                  {columns.map((c) => (
                    <th key={String(c.key)} className="text-xs font-bold text-slate-500 uppercase">{c.label}</th>
                  ))}
                  <th className="text-xs font-bold text-slate-500 uppercase">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-brand-50/50 transition-colors"
                  >
                    <td className="text-slate-400 text-sm font-medium">{i + 1}</td>
                    {columns.map((c) => (
                      <td key={String(c.key)} className="text-sm text-slate-700">
                        {c.render ? c.render(item) : getCellValue(item, c.key)}
                      </td>
                    ))}
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditing(item)}
                          className="btn btn-ghost btn-xs rounded-xl text-blue-600 hover:bg-blue-50 gap-1"
                        >
                          <HiPencil className="w-3.5 h-3.5" /> Tahrir
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleting === item.id}
                          className="btn btn-ghost btn-xs rounded-xl text-red-500 hover:bg-red-50 gap-1"
                        >
                          {deleting === item.id ? <span className="loading loading-spinner loading-xs" /> : <HiTrash className="w-3.5 h-3.5" />}
                          O'chir
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {editing !== undefined && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setEditing(undefined)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="font-heading font-bold text-lg text-slate-800">
                  {editing === null ? "Yangi qo'shish" : 'Tahrirlash'}
                </h2>
                <button onClick={() => setEditing(undefined)} className="btn btn-ghost btn-sm btn-square rounded-xl">
                  <HiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                {renderForm(
                  editing,
                  () => setEditing(undefined),
                  () => { setEditing(undefined); load(); }
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
