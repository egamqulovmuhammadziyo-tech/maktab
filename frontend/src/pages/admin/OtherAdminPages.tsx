import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { announcementsApi, achievementsApi, galleryApi } from '../../api';
import { fileToDataUrl } from '../../lib/localdb';
import { CrudPage } from '../../components/admin/CrudPage';
import type { Announcement, Achievement, GalleryImage } from '../../types';

// ── ANNOUNCEMENTS ──────────────────────────────────────────────────────────────
function AnnForm({ item, onClose, onSave }: { item: Announcement | null; onClose: () => void; onSave: () => void }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: item ?? { title: '', description: '', icon: '🔔', type: 'info', event_date: '', is_active: true },
  });
  const onSubmit = async (data: object) => {
    if (item) await announcementsApi.update(item.id, data);
    else await announcementsApi.create(data);
    onSave();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label label-text font-semibold">Sarlavha *</label>
          <input {...register('title', { required: true })} className="input input-bordered rounded-2xl w-full" />
        </div>
        <div className="form-control">
          <label className="label label-text font-semibold">Ikon (emoji)</label>
          <input {...register('icon')} className="input input-bordered rounded-2xl w-full" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label label-text font-semibold">Turi</label>
          <select {...register('type')} className="select select-bordered rounded-2xl w-full">
            <option value="info">Ma'lumot</option>
            <option value="urgent">Shoshilinch</option>
            <option value="event">Tadbir</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label label-text font-semibold">Sana</label>
          <input {...register('event_date')} placeholder="28 May 2026" className="input input-bordered rounded-2xl w-full" />
        </div>
      </div>
      <div className="form-control">
        <label className="label label-text font-semibold">Tavsif *</label>
        <textarea {...register('description', { required: true })} className="textarea textarea-bordered rounded-2xl w-full" rows={3} />
      </div>
      <div className="form-control flex-row items-center gap-3">
        <input type="checkbox" {...register('is_active')} className="toggle toggle-primary" />
        <label className="label-text font-semibold">Faol</label>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn flex-1 rounded-2xl btn-ghost">Bekor</button>
        <button type="submit" disabled={isSubmitting} className="btn flex-1 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white border-0">
          {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : 'Saqlash'}
        </button>
      </div>
    </form>
  );
}

export function AnnouncementsAdminPage() {
  return (
    <CrudPage<Announcement>
      title="E'lonlar"
      subtitle="Muhim xabarlar va tadbirlarni boshqaring"
      fetchAll={announcementsApi.getAllAdmin}
      onDelete={(id) => announcementsApi.delete(id)}
      columns={[
        { key: 'icon', label: '', render: (a) => <span className="text-xl">{a.icon}</span> },
        { key: 'title', label: 'Sarlavha' },
        { key: 'type', label: 'Turi', render: (a) => {
          const colors: Record<string, string> = { urgent: 'badge-error', info: 'badge-info', event: 'badge-warning' };
          return <span className={`badge rounded-xl ${colors[a.type] || ''}`}>{a.type}</span>;
        }},
        { key: 'event_date', label: 'Sana' },
        { key: 'is_active', label: 'Faol' },
      ]}
      renderForm={(item, onClose, onSave) => <AnnForm item={item} onClose={onClose} onSave={onSave} />}
    />
  );
}

// ── ACHIEVEMENTS ───────────────────────────────────────────────────────────────
function AchForm({ item, onClose, onSave }: { item: Achievement | null; onClose: () => void; onSave: () => void }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: item ?? { title: '', description: '', icon: '🏆', year: '' },
  });
  const onSubmit = async (data: object) => {
    if (item) await achievementsApi.update(item.id, data);
    else await achievementsApi.create(data);
    onSave();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control col-span-2">
          <label className="label label-text font-semibold">Sarlavha *</label>
          <input {...register('title', { required: true })} className="input input-bordered rounded-2xl w-full" />
        </div>
        <div className="form-control">
          <label className="label label-text font-semibold">Ikon</label>
          <input {...register('icon')} className="input input-bordered rounded-2xl w-full" />
        </div>
        <div className="form-control">
          <label className="label label-text font-semibold">Yil</label>
          <input {...register('year')} placeholder="2026" className="input input-bordered rounded-2xl w-full" />
        </div>
      </div>
      <div className="form-control">
        <label className="label label-text font-semibold">Tavsif</label>
        <textarea {...register('description')} className="textarea textarea-bordered rounded-2xl w-full" rows={3} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn flex-1 rounded-2xl btn-ghost">Bekor</button>
        <button type="submit" disabled={isSubmitting} className="btn flex-1 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white border-0">
          {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : 'Saqlash'}
        </button>
      </div>
    </form>
  );
}

export function AchievementsAdminPage() {
  return (
    <CrudPage<Achievement>
      title="Yutuqlar"
      subtitle="Maktab yutuqlari va mukofotlarini boshqaring"
      fetchAll={achievementsApi.getAll as any}
      onDelete={(id) => achievementsApi.delete(id)}
      columns={[
        { key: 'icon', label: '', render: (a) => <span className="text-xl">{a.icon}</span> },
        { key: 'title', label: 'Sarlavha' },
        { key: 'year', label: 'Yil' },
      ]}
      renderForm={(item, onClose, onSave) => <AchForm item={item} onClose={onClose} onSave={onSave} />}
    />
  );
}

// ── GALLERY ────────────────────────────────────────────────────────────────────
function GalleryForm({ item, onClose, onSave }: { item: GalleryImage | null; onClose: () => void; onSave: () => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const isEditing = !!item;

  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues: item ?? { title: '', image_url: '', category: 'Umumiy' },
  });

  const currentImageUrl = watch('image_url');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Rasm hajmi 3MB dan kichik bo'lishi kerak (sayt backendsiz, rasm brauzerda saqlanadi).");
      return;
    }

    try {
      setIsUploading(true);
      // Backend yo'q — rasm to'g'ridan-to'g'ri base64 ko'rinishida saqlanadi.
      const dataUrl = await fileToDataUrl(file);
      setValue('image_url', dataUrl);
    } catch (err) {
      console.error("Rasmni o'qishda xato:", err);
      alert("Rasmni yuklab bo'lmadi!");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: object) => {
    if (isEditing && item) {
      await galleryApi.delete(item.id); await galleryApi.add(data);
    } else {
      await galleryApi.add(data);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-control">
        <label className="label label-text font-semibold">Kompyuterdan rasm tanlash</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="file-input file-input-bordered rounded-2xl w-full file-input-primary" 
          disabled={isUploading}
        />
        {isUploading && <span className="text-xs text-primary mt-1 animate-pulse">Rasm serverga yuklanmoqda...</span>}
      </div>

      <div className="form-control">
        <label className="label label-text font-semibold">Rasm URL *</label>
        <input 
          {...register('image_url', { required: true })} 
          className="input input-bordered rounded-2xl w-full bg-base-200" 
          placeholder="Rasm yuklansa bu yerda havola paydo bo'ladi"
        />
      </div>

      {currentImageUrl && (
        <div className="mt-2 flex justify-center">
          <img src={currentImageUrl} alt="Preview" className="h-24 w-36 object-cover rounded-xl border" />
        </div>
      )}

      <div className="form-control">
        <label className="label label-text font-semibold">Sarlavha</label>
        <input {...register('title')} className="input input-bordered rounded-2xl w-full" />
      </div>
      
      <div className="form-control">
        <label className="label label-text font-semibold">Kategoriya</label>
        <select {...register('category')} className="select select-bordered rounded-2xl w-full">
          <option>Umumiy</option>
          <option>Sport</option>
          <option>Ta'lim</option>
          <option>Tadbirlar</option>
        </select>
      </div>
      
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn flex-1 rounded-2xl btn-ghost">Bekor</button>
        <button type="submit" disabled={isSubmitting || isUploading} className="btn flex-1 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white border-0">
          {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : isEditing ? 'Saqlash' : 'Qo\'shish'}
        </button>
      </div>
    </form>
  );
}

export function GalleryAdminPage() {
  return (
    <CrudPage<GalleryImage>
      title="Galereya"
      subtitle="Rasmlar to'plamini boshqaring"
      fetchAll={galleryApi.getAll as any}
      onDelete={(id) => galleryApi.delete(id)}
      columns={[
        { key: 'image_url', label: 'Rasm', render: (g) => (
          <img src={g.image_url} alt={g.title ?? ''} className="h-12 w-16 object-cover rounded-xl" onError={(e) => (e.currentTarget.style.display = 'none')} />
        )},
        { key: 'title', label: 'Sarlavha' },
        { key: 'category', label: 'Kategoriya', render: (g) => <span className="badge badge-outline rounded-xl">{g.category}</span> },
      ]}
      renderForm={(item, onClose, onSave) => <GalleryForm item={item} onClose={onClose} onSave={onSave} />}
    />
  );
}