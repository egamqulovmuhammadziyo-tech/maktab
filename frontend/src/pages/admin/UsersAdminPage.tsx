import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiPlus, HiUser, HiShieldCheck } from 'react-icons/hi';
import { authApi } from '../../api';
import type { User } from '../../types';

interface CreateUserForm {
  username: string;
  email: string;
  full_name: string;
  password: string;
  is_admin: boolean;
}

export function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<CreateUserForm>({
    defaultValues: { is_admin: false },
  });

  const load = async () => {
    try {
      const res = await authApi.listUsers();
      setUsers(res.data);
    } catch { /* ignore */ }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data: CreateUserForm) => {
    await authApi.createUser(data);
    reset();
    setShowForm(false);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-slate-800">Foydalanuvchilar</h1>
          <p className="text-slate-500 text-sm">Admin va moderatorlarni boshqaring</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white border-0 shadow-lg gap-2">
          <HiPlus className="w-5 h-5" /> Qo'shish
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-heading font-bold text-lg text-slate-800 mb-5">Yangi foydalanuvchi</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label label-text font-semibold">Username *</label>
              <input {...register('username', { required: true })} className="input input-bordered rounded-2xl" />
            </div>
            <div className="form-control">
              <label className="label label-text font-semibold">Email *</label>
              <input {...register('email', { required: true })} type="email" className="input input-bordered rounded-2xl" />
            </div>
            <div className="form-control">
              <label className="label label-text font-semibold">To'liq ism *</label>
              <input {...register('full_name', { required: true })} className="input input-bordered rounded-2xl" />
            </div>
            <div className="form-control">
              <label className="label label-text font-semibold">Parol *</label>
              <input {...register('password', { required: true })} type="password" className="input input-bordered rounded-2xl" />
            </div>
            <div className="form-control flex-row items-center gap-3 sm:col-span-2">
              <input type="checkbox" {...register('is_admin')} className="toggle toggle-primary" />
              <label className="label-text font-semibold">Admin huquqlari</label>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn flex-1 rounded-2xl btn-ghost">Bekor</button>
              <button type="submit" disabled={isSubmitting} className="btn flex-1 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white border-0">
                {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : 'Yaratish'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-xs font-bold text-slate-500 uppercase">Foydalanuvchi</th>
              <th className="text-xs font-bold text-slate-500 uppercase">Email</th>
              <th className="text-xs font-bold text-slate-500 uppercase">Rol</th>
              <th className="text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="text-xs font-bold text-slate-500 uppercase">Sana</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="w-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                        <span className="text-sm font-bold">{u.full_name[0]}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{u.full_name}</p>
                      <p className="text-xs text-slate-400">@{u.username}</p>
                    </div>
                  </div>
                </td>
                <td className="text-sm text-slate-600">{u.email}</td>
                <td>
                  {u.is_admin ? (
                    <span className="badge gap-1 bg-gradient-to-r from-brand-500 to-accent-500 text-white border-0 rounded-xl">
                      <HiShieldCheck className="w-3 h-3" /> Admin
                    </span>
                  ) : (
                    <span className="badge badge-ghost rounded-xl gap-1">
                      <HiUser className="w-3 h-3" /> Moderator
                    </span>
                  )}
                </td>
                <td>
                  <span className={`badge rounded-xl ${u.is_active ? 'badge-success' : 'badge-error'}`}>
                    {u.is_active ? 'Faol' : 'Nofaol'}
                  </span>
                </td>
                <td className="text-xs text-slate-400">{new Date(u.created_at).toLocaleDateString('uz')}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
