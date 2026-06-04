import { useForm } from 'react-hook-form';
import { teachersApi } from '../../api';
import { CrudPage } from '../../components/admin/CrudPage';
import type { Teacher } from '../../types';

function TeacherForm({ item, onClose, onSave }: { item: Teacher | null; onClose: () => void; onSave: () => void }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Omit<Teacher, 'id' | 'created_at'>>({
    defaultValues: item ?? { name: '', subject: '', experience: '', bio: '', image_url: '', is_active: true },
  });

  const onSubmit = async (data: Omit<Teacher, 'id' | 'created_at'>) => {
    if (item) await teachersApi.update(item.id, data);
    else await teachersApi.create(data);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-control">
        <label className="label label-text font-semibold">Ismi</label>
        <input {...register('name', { required: true })} className="input input-bordered rounded-2xl w-full" />
      </div>
      <div className="form-control">
        <label className="label label-text font-semibold">Fan</label>
        <input {...register('subject', { required: true })} className="input input-bordered rounded-2xl w-full" />
      </div>
      <div className="form-control">
        <label className="label label-text font-semibold">Tajriba</label>
        <input {...register('experience')} placeholder="12 yil tajriba" className="input input-bordered rounded-2xl w-full" />
      </div>
      <div className="form-control">
        <label className="label label-text font-semibold">Biografiya</label>
        <textarea {...register('bio')} className="textarea textarea-bordered rounded-2xl w-full" rows={3} />
      </div>
      <div className="form-control">
        <label className="label label-text font-semibold">Rasm URL</label>
        <input {...register('image_url')} className="input input-bordered rounded-2xl w-full" />
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

export function TeachersAdminPage() {
  return (
    <CrudPage<Teacher>
      title="O'qituvchilar"
      subtitle="O'qituvchilar ro'yxatini boshqaring"
      fetchAll={teachersApi.getAllAdmin}
      onDelete={(id) => teachersApi.delete(id)}
      columns={[
        { key: 'name', label: 'Ismi' },
        { key: 'subject', label: 'Fan' },
        { key: 'experience', label: 'Tajriba' },
        { key: 'is_active', label: 'Faol' },
      ]}
      renderForm={(item, onClose, onSave) => (
        <TeacherForm item={item} onClose={onClose} onSave={onSave} />
      )}
    />
  );
}
