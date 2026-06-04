import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiSave } from 'react-icons/hi';
import { settingsApi } from '../../api';

const SECTIONS = [
  {
    title: "🏫 Maktab ma'lumotlari",
    fields: [
      { key: 'school_name', label: 'Maktab nomi', type: 'text' },
      { key: 'school_subtitle', label: 'Tagline', type: 'text' },
      { key: 'school_description', label: 'Tavsif', type: 'textarea' },
    ]
  },
  {
    title: '📊 Statistika raqamlari',
    fields: [
      { key: 'students_count', label: "O'quvchilar soni", type: 'text' },
      { key: 'teachers_count', label: "O'qituvchilar soni", type: 'text' },
      { key: 'experience_years', label: 'Tajriba yillari', type: 'text' },
      { key: 'subjects_count', label: 'Fanlar soni', type: 'text' },
    ]
  },
  {
    title: '🦸 Hero qism',
    fields: [
      { key: 'hero_title', label: 'Asosiy sarlavha', type: 'text' },
      { key: 'hero_subtitle', label: 'Kichik sarlavha', type: 'text' },
    ]
  },
  {
    title: '📞 Aloqa ma\'lumotlari',
    fields: [
      { key: 'phone', label: 'Telefon', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'address', label: 'Manzil', type: 'text' },
    ]
  },
  {
    title: '🌐 Ijtimoiy tarmoqlar',
    fields: [
      { key: 'facebook', label: 'Facebook URL', type: 'text' },
      { key: 'instagram', label: 'Instagram URL', type: 'text' },
      { key: 'telegram', label: 'Telegram URL', type: 'text' },
      { key: 'youtube', label: 'YouTube URL', type: 'text' },
    ]
  },
  {
    title: '🗺️ Xarita',
    fields: [
      { key: 'map_embed', label: 'Google Maps Embed URL', type: 'textarea' },
    ]
  },
];

export function SettingsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, reset } = useForm<Record<string, string>>();

  useEffect(() => {
    settingsApi.getAll().then(res => {
      reset(res.data);
      setLoading(false);
    });
  }, [reset]);

  const onSubmit = async (data: Record<string, string>) => {
    setSaving(true);
    try {
      await settingsApi.update(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <span className="loading loading-spinner loading-lg text-brand-500" />
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-slate-800">Sayt sozlamalari</h1>
          <p className="text-slate-500 text-sm mt-0.5">Saytning barcha matnlari va ma'lumotlarini shu yerdan boshqaring</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className={`btn rounded-2xl border-0 shadow-lg gap-2 transition-all ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-brand-500/25'
          }`}
        >
          {saving ? (
            <span className="loading loading-spinner loading-sm" />
          ) : saved ? (
            <><HiSave className="w-5 h-5" /> Saqlandi!</>
          ) : (
            <><HiSave className="w-5 h-5" /> Saqlash</>
          )}
        </button>
      </div>

      {SECTIONS.map((section, si) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.07 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6"
        >
          <h2 className="font-heading font-bold text-base text-slate-700 mb-5">{section.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {section.fields.map(field => (
              <div
                key={field.key}
                className={field.type === 'textarea' ? 'sm:col-span-2' : ''}
              >
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    {...register(field.key)}
                    rows={3}
                    className="textarea textarea-bordered w-full rounded-2xl text-sm focus:textarea-primary resize-none"
                  />
                ) : (
                  <input
                    {...register(field.key)}
                    type="text"
                    className="input input-bordered w-full rounded-2xl text-sm focus:input-primary"
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <div className="flex justify-end pb-6">
        <button
          type="submit"
          disabled={saving}
          className="btn rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white border-0 shadow-lg shadow-brand-500/25 gap-2 px-8"
        >
          {saving ? <span className="loading loading-spinner loading-sm" /> : <><HiSave className="w-5 h-5" /> Barcha o'zgarishlarni saqlash</>}
        </button>
      </div>
    </form>
  );
}
