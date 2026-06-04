import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiMail, HiPhone, HiTrash, HiCheck, HiRefresh } from 'react-icons/hi';
import { contactApi } from '../../api';
import type { Contact } from '../../types';

export function ContactsAdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await contactApi.getAll();
      setContacts(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: number) => {
    await contactApi.markRead(id);
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, is_read: true } : c));
  };

  const del = async (id: number) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    await contactApi.delete(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const unread = contacts.filter((c) => !c.is_read).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-slate-800">Xabarlar</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {unread > 0 && <span className="text-brand-600 font-bold">{unread} o'qilmagan · </span>}
            Jami {contacts.length} ta xabar
          </p>
        </div>
        <button onClick={load} className="btn btn-ghost btn-sm rounded-xl gap-2">
          <HiRefresh className="w-4 h-4" /> Yangilash
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-brand-500" /></div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <HiMail className="w-16 h-16 mx-auto mb-3 text-slate-200" />
          <p className="font-semibold">Xabar yo'q</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`bg-white rounded-3xl border shadow-sm p-5 transition-all duration-200 ${
                !c.is_read ? 'border-brand-200 bg-brand-50/30' : 'border-slate-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-heading font-bold text-slate-900">{c.name}</span>
                    {!c.is_read && <span className="badge badge-primary badge-sm">Yangi</span>}
                    {c.subject && <span className="text-xs text-slate-500 bg-slate-100 rounded-lg px-2 py-0.5">{c.subject}</span>}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-3 flex-wrap">
                    <span className="flex items-center gap-1"><HiMail className="w-4 h-4" />{c.email}</span>
                    {c.phone && <span className="flex items-center gap-1"><HiPhone className="w-4 h-4" />{c.phone}</span>}
                    <span className="text-xs text-slate-400">{new Date(c.created_at).toLocaleDateString('uz')}</span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 rounded-2xl px-4 py-3">{c.message}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {!c.is_read && (
                    <button onClick={() => markRead(c.id)} className="btn btn-ghost btn-sm rounded-xl text-green-600 hover:bg-green-50 gap-1">
                      <HiCheck className="w-4 h-4" /> O'qildi
                    </button>
                  )}
                  <button onClick={() => del(c.id)} className="btn btn-ghost btn-sm rounded-xl text-red-500 hover:bg-red-50 gap-1">
                    <HiTrash className="w-4 h-4" /> O'chir
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
