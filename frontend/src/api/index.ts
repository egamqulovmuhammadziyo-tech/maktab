import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Static fallback data (Netlify uchun) ──────────────────────────────────────
const STATIC: Record<string, unknown> = {
  settings: {
    school_name: '17-MAKTAB',
    school_subtitle: "Umumiy O'rta Ta'lim Maktabi",
    school_description: "Farg'ona viloyati Beshariq tumani 17-umumiy o'rta ta'lim maktabi — bilim, innovatsiya va kelajak uchun!",
    students_count: '1200+',
    teachers_count: '80+',
    experience_years: '30+',
    subjects_count: '25+',
    hero_title: 'Bilim va Kelajak',
    hero_subtitle: "Zamonaviy ta'lim, innovatsion yondashuv, yorqin kelajak",
    phone: '+998 73 540-12-34',
    email: 'info@17maktab.uz',
    address: "Farg'ona viloyati, Beshariq tumani",
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    telegram: 'https://t.me',
    youtube: 'https://youtube.com',
    map_embed: '',
  },
  teachers: [
    { id:1, name:'Nilufar Karimova', subject:'Matematika', experience:'12 yil tajriba', bio:'Yetuk matematik, olimpiada g\'oliblari tayyorlovchi murabbiy.', image_url:'https://i.pravatar.cc/150?img=47', is_active:true },
    { id:2, name:'Bekzod Ergashev', subject:'Fizika', experience:'9 yil tajriba', bio:'Amaliy fizikadan chuqur bilim beruvchi tajribali o\'qituvchi.', image_url:'https://i.pravatar.cc/150?img=12', is_active:true },
    { id:3, name:'Dilnoza Akhmedova', subject:'Ingliz tili', experience:'15 yil tajriba', bio:'IELTS va Cambridge imtihonlariga tayyorgarlik bo\'yicha mutaxassis.', image_url:'https://i.pravatar.cc/150?img=48', is_active:true },
    { id:4, name:'Ozodbek Ismoilov', subject:'Tarix', experience:'8 yil tajriba', bio:'O\'zbekiston tarixi va jahon tarixi bo\'yicha expert pedagog.', image_url:'https://i.pravatar.cc/150?img=15', is_active:true },
    { id:5, name:'Madina Tursunova', subject:'Biologiya', experience:'11 yil tajriba', bio:'Tibbiy biologiya va ekologiya yo\'nalishida ilmiy izlanuvchi.', image_url:'https://i.pravatar.cc/150?img=49', is_active:true },
    { id:6, name:'Sardor G\'aniyev', subject:'Informatika', experience:'7 yil tajriba', bio:'Python, web dasturlash va robototexnika bo\'yicha o\'qituvchi.', image_url:'https://i.pravatar.cc/150?img=11', is_active:true },
  ],
  news: [
    { id:1, title:"Respublika fanlar olimpiadasida 1-o'rin", tag:'Yutuq', excerpt:"17-maktab o'quvchisi matematika olimpiadasida respublika bo'yicha birinchi o'rinni egalladi.", image_url:'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80', is_published:true, created_at:'2026-05-01' },
    { id:2, title:"Yangi STEM laboratoriyasi ochildi", tag:'Yangilik', excerpt:"Zamonaviy uskunalar bilan jihozlangan innovatsion laboratoriya barcha o'quvchilarga xizmat ko'rsatadi.", image_url:'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80', is_published:true, created_at:'2026-04-15' },
    { id:3, title:"Xalqaro matematika tanlovida sovrin", tag:'Yutuq', excerpt:"O'quvchilarimiz xalqaro IYMC tanlovida bronza medal qo'lga kiritdi.", image_url:'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80', is_published:true, created_at:'2026-03-20' },
  ],
  announcements: [
    { id:1, title:"Ota-onalar majlisi", description:"Barcha sinf ota-onalari uchun muhim majlis soat 18:00 da bo'lib o'tadi. Ishtirok etish majburiy.", icon:'🔔', type:'urgent', event_date:'28 May 2026' },
    { id:2, title:"Yozgi ta'til jadvali", description:"Yozgi ta'til 1-iyundan boshlanadi. O'quvchilar 1-sentabrda darsga qaytadilar.", icon:'📚', type:'info', event_date:'1 Iyun 2026' },
    { id:3, title:"Sport musobaqasi", description:"Maktablararo futbol turniri. 17-maktab jamoasi yarim finalga chiqdi!", icon:'⚽', type:'event', event_date:'5 Iyun 2026' },
  ],
  achievements: [
    { id:1, title:"STEM Olimpiadasida 1-o'rin", description:"O'quvchilarimiz mintaqaviy STEM tanlovida birinchi o'rinni egalladi.", icon:'🥇', year:'2026' },
    { id:2, title:"ISO Sertifikatsiyasi", description:"Maktab xalqaro ta'lim standartlari bo'yicha sertifikatsiyalandi.", icon:'📜', year:'2025' },
    { id:3, title:"Eng yaxshi maktab unvoni", description:"Farg'ona viloyati bo'yicha eng yaxshi maktab mukofotini oldik.", icon:'🏆', year:'2025' },
    { id:4, title:"Robototexnika musobaqasi", description:"Mintaqaviy robototexnika tanlovida 2-o'rin.", icon:'🤖', year:'2024' },
  ],
  gallery: [
    { id:1, image_url:'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80', title:'Maktab binosi' },
    { id:2, image_url:'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=400&q=80', title:'Dars jarayoni' },
    { id:3, image_url:'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80', title:'Olimpiada' },
    { id:4, image_url:'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=80', title:'Sport' },
    { id:5, image_url:'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=400&q=80', title:'Laboratoriya' },
    { id:6, image_url:'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80', title:'Kutubxona' },
    { id:7, image_url:'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80', title:'Talaba' },
    { id:8, image_url:'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400&q=80', title:'Tadbir' },
  ],
};

async function withFallback(fn: () => Promise<{ data: any }>, key: string): Promise<{ data: any }> {
  try {
    if (!BACKEND_URL) throw new Error('no backend');
    return await fn();
  } catch {
    return { data: STATIC[key] ?? [] };
  }
}

export const authApi = {
  login: (username: string, password: string) => {
    const form = new URLSearchParams();
    form.append('username', username);
    form.append('password', password);
    return api.post('/api/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  me: () => api.get('/api/auth/me'),
  createUser: (data: object) => api.post('/api/auth/users', data),
  listUsers: () => api.get('/api/auth/users'),
  deleteUser: (id: number) => api.delete(`/api/auth/users/${id}`),
};

export const teachersApi = {
  getAll: () => withFallback(() => api.get('/api/teachers'), 'teachers'),
  getAllAdmin: () => api.get('/api/teachers/all'),
  create: (data: object) => api.post('/api/teachers', data),
  update: (id: number, data: object) => api.put(`/api/teachers/${id}`, data),
  delete: (id: number) => api.delete(`/api/teachers/${id}`),
};
export const newsApi = {
  getAll: () => withFallback(() => api.get('/api/news'), 'news'),
  getAllAdmin: () => api.get('/api/news/all'),
  getOne: (id: number) => api.get(`/api/news/${id}`),
  create: (data: object) => api.post('/api/news', data),
  update: (id: number, data: object) => api.put(`/api/news/${id}`, data),
  delete: (id: number) => api.delete(`/api/news/${id}`),
};
export const announcementsApi = {
  getAll: () => withFallback(() => api.get('/api/announcements'), 'announcements'),
  getAllAdmin: () => api.get('/api/announcements/all'),
  create: (data: object) => api.post('/api/announcements', data),
  update: (id: number, data: object) => api.put(`/api/announcements/${id}`, data),
  delete: (id: number) => api.delete(`/api/announcements/${id}`),
};
export const contactApi = {
  send: (data: object) => api.post('/api/contact', data).catch(() => ({ data: { ok: true } })),
  getAll: () => api.get('/api/contact'),
  markRead: (id: number) => api.patch(`/api/contact/${id}/read`),
  delete: (id: number) => api.delete(`/api/contact/${id}`),
};
export const scheduleApi = {
  getAll: () => api.get('/api/schedule'),
  getClass: (cls: string) => api.get(`/api/schedule/${cls}`).catch(() => ({ data: [] })),
  update: (data: object) => api.put('/api/schedule', data),
};
export const achievementsApi = {
  getAll: () => withFallback(() => api.get('/api/achievements'), 'achievements'),
  create: (data: object) => api.post('/api/achievements', data),
  update: (id: number, data: object) => api.put(`/api/achievements/${id}`, data),
  delete: (id: number) => api.delete(`/api/achievements/${id}`),
};
export const galleryApi = {
  getAll: () => withFallback(() => api.get('/api/gallery'), 'gallery'),
  add: (data: object) => api.post('/api/gallery', data),
  delete: (id: number) => api.delete(`/api/gallery/${id}`),
};
export const settingsApi = {
  getAll: () => withFallback(() => api.get('/api/settings'), 'settings'),
  update: (data: Record<string, string>) => api.put('/api/settings', data),
};
