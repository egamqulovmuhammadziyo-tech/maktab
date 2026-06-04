import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiLockClosed, HiUser, HiEye, HiEyeOff } from 'react-icons/hi';
import { authApi } from '../../api';
import { useAuthStore } from '../../store/auth';

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login(data.username, data.password);
      const token = res.data.access_token;
      // Avval tokenni saqlash kerak, keyin /me ga so'rov yuborish
      localStorage.setItem('token', token);
      const meRes = await authApi.me();
      setAuth(token, meRes.data);
      navigate('/admin');
    } catch {
      setError("Username yoki parol noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-brand-900/30 p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-500/30 mb-4">
              <HiLockClosed className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-slate-900">Admin Panel</h1>
            <p className="text-slate-500 text-sm mt-1">17-Maktab boshqaruv tizimi</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-semibold text-slate-700">Username</span>
              </label>
              <div className="relative">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  {...register('username', { required: "Username kiriting" })}
                  type="text"
                  placeholder="admin"
                  className="input input-bordered w-full pl-11 rounded-2xl bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
              {errors.username && <p className="text-error text-xs mt-1">{errors.username.message}</p>}
            </div>

            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-semibold text-slate-700">Parol</span>
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  {...register('password', { required: "Parol kiriting" })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-11 pr-11 rounded-2xl bg-slate-50 focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="alert alert-error rounded-2xl py-3">
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn w-full rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white border-0 shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5 transition-all duration-200 font-bold text-base h-12"
            >
              {loading ? <span className="loading loading-spinner" /> : 'Kirish'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Demo: admin / admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
}
