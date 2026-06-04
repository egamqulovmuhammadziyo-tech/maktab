import { useForm } from 'react-hook-form';
import { newsApi } from '../../api';
import { CrudPage } from '../../components/admin/CrudPage';
import type { News } from '../../types';

function NewsForm({ item, onClose, onSave }: { item: News | null; onClose: () => void; onSave: () => void }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Omit<News, 'id' | 'created_at'>>({
    defaultValues: item ?? { title: '', excerpt: '', content: '', tag: 'Yangilik', image_url: '', published: true },
  });

  const onSubmit = async (data: Omit<News, 'id' | 'created_at'>) => {
    if (item) await newsApi.update(item.id, data);
    else await newsApi.create(data);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-control">
        <label className="label label-text font-semibold">Sarlavha *</label>
        <input {...register('title', { required: true })} className="input input-bordered rounded-2xl w-full" />
      </div>
      <div className="form-control">
        <label className="label label-text font-semibold">Tag</label>
        <select {...register('tag')} className="select select-bordered rounded-2xl w-full">
          <option>Yangilik</option>
          <option>Yutuq</option>
          <option>Ta'lim</option>
          <option>Tadbirlar</option>
          <option>Boshqa</option>
        </select>
      </div>
      <div className="form-control">
        <label className="label label-text font-semibold">Qisqa matn</label>
        <textarea {...register('excerpt')} className="textarea textarea-bordered rounded-2xl w-full" rows={2} />
      </div>
      <div className="form-control">
        <label className="label label-text font-semibold">To'liq matn</label>
        <textarea {...register('content')} className="textarea textarea-bordered rounded-2xl w-full" rows={5} />
      </div>
      <div className="form-control">
        <label className="label label-text font-semibold">Rasm URL</label>
        <input {...register('image_url')} className="input input-bordered rounded-2xl w-full" />
      </div>
      <div className="form-control flex-row items-center gap-3">
        <input type="checkbox" {...register('published')} className="toggle toggle-primary" />
        <label className="label-text font-semibold">Nashr etilgan</label>
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

export function NewsAdminPage() {
  return (
    <CrudPage<News>
      title="Yangiliklar"
      subtitle="Maktab yangiliklar bo'limini boshqaring"
      fetchAll={newsApi.getAllAdmin}
      onDelete={(id) => newsApi.delete(id)}
      columns={[
        { key: 'title', label: 'Sarlavha' },
        { key: 'tag', label: 'Tag', render: (n) => <span className="badge badge-outline rounded-xl">{n.tag}</span> },
        { key: 'published', label: 'Nashr' },
      ]}
      renderForm={(item, onClose, onSave) => (
        <NewsForm item={item} onClose={onClose} onSave={onSave} />
      )}
    />
  );
}
