// ─────────────────────────────────────────────────────────────────────────────
// 17-Maktab — TO'LIQ STATIK API QATLAMI (backend YO'Q).
// Sayt Netlify'da statik fayl sifatida ishlaydi. Barcha "server" amallari
// aslida brauzer localStorage'i bilan ishlaydi, lekin App komponentlari uchun
// xuddi avvalgi (axios asosidagi) API bilan bir xil interfeys taqdim etadi —
// shu sababli sahifalarning birortasini o'zgartirish shart emas.
// ─────────────────────────────────────────────────────────────────────────────
import { readSeeded, write, nextId, delay, nowIso } from '../lib/localdb';
import type {
  User,
  Teacher,
  News,
  Announcement,
  Contact,
  ScheduleEntry,
  Achievement,
  GalleryImage,
} from '../types';

type ApiResult<T> = Promise<{ data: T }>;

// ── Boshlang'ich (seed) ma'lumotlar ────────────────────────────────────────────
const SEED_SETTINGS: Record<string, string> = {
  school_name: '17-MAKTAB',
  school_subtitle: "Umumiy O'rta Ta'lim Maktabi",
  school_description:
    "Farg'ona viloyati Beshariq tumani 17-umumiy o'rta ta'lim maktabi — bilim, innovatsiya va kelajak uchun!",
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
};

const SEED_TEACHERS: Teacher[] = [
  { id: 1, name: 'Nilufar Karimova', subject: 'Matematika', experience: '12 yil tajriba', bio: "Yetuk matematik, olimpiada g'oliblari tayyorlovchi murabbiy.", image_url: 'https://i.pravatar.cc/300?img=47', is_active: true, created_at: nowIso() },
  { id: 2, name: 'Bekzod Ergashev', subject: 'Fizika', experience: '9 yil tajriba', bio: 'Amaliy fizikadan chuqur bilim beruvchi tajribali o\'qituvchi.', image_url: 'https://i.pravatar.cc/300?img=12', is_active: true, created_at: nowIso() },
  { id: 3, name: 'Dilnoza Akhmedova', subject: 'Ingliz tili', experience: '15 yil tajriba', bio: 'IELTS va Cambridge imtihonlariga tayyorgarlik bo\'yicha mutaxassis.', image_url: 'https://i.pravatar.cc/300?img=48', is_active: true, created_at: nowIso() },
  { id: 4, name: 'Ozodbek Ismoilov', subject: 'Tarix', experience: '8 yil tajriba', bio: 'O\'zbekiston tarixi va jahon tarixi bo\'yicha ekspert pedagog.', image_url: 'https://i.pravatar.cc/300?img=15', is_active: true, created_at: nowIso() },
  { id: 5, name: 'Madina Tursunova', subject: 'Biologiya', experience: '11 yil tajriba', bio: 'Tibbiy biologiya va ekologiya yo\'nalishida ilmiy izlanuvchi.', image_url: 'https://i.pravatar.cc/300?img=49', is_active: true, created_at: nowIso() },
  { id: 6, name: "Sardor G'aniyev", subject: 'Informatika', experience: '7 yil tajriba', bio: 'Python, web dasturlash va robototexnika bo\'yicha o\'qituvchi.', image_url: 'https://i.pravatar.cc/300?img=11', is_active: true, created_at: nowIso() },
];

const SEED_NEWS: News[] = [
  { id: 1, title: "Respublika fanlar olimpiadasida 1-o'rin", tag: 'Yutuq', excerpt: "17-maktab o'quvchisi matematika olimpiadasida respublika bo'yicha birinchi o'rinni egalladi.", content: '', image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80', published: true, created_at: '2026-05-01' },
  { id: 2, title: 'Yangi STEM laboratoriyasi ochildi', tag: 'Yangilik', excerpt: "Zamonaviy uskunalar bilan jihozlangan innovatsion laboratoriya barcha o'quvchilarga xizmat ko'rsatadi.", content: '', image_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80', published: true, created_at: '2026-04-15' },
  { id: 3, title: 'Xalqaro matematika tanlovida sovrin', tag: 'Yutuq', excerpt: "O'quvchilarimiz xalqaro IYMC tanlovida bronza medal qo'lga kiritdi.", content: '', image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80', published: true, created_at: '2026-03-20' },
];

const SEED_ANNOUNCEMENTS: Announcement[] = [
  { id: 1, title: 'Ota-onalar majlisi', description: "Barcha sinf ota-onalari uchun muhim majlis soat 18:00 da bo'lib o'tadi. Ishtirok etish majburiy.", icon: '🔔', type: 'urgent', event_date: '28 May 2026', is_active: true, created_at: nowIso() },
  { id: 2, title: "Yozgi ta'til jadvali", description: "Yozgi ta'til 1-iyundan boshlanadi. O'quvchilar 1-sentabrda darsga qaytadilar.", icon: '📚', type: 'info', event_date: '1 Iyun 2026', is_active: true, created_at: nowIso() },
  { id: 3, title: 'Sport musobaqasi', description: "Maktablararo futbol turniri. 17-maktab jamoasi yarim finalga chiqdi!", icon: '⚽', type: 'event', event_date: '5 Iyun 2026', is_active: true, created_at: nowIso() },
];

const SEED_ACHIEVEMENTS: Achievement[] = [
  { id: 1, title: "STEM Olimpiadasida 1-o'rin", description: "O'quvchilarimiz mintaqaviy STEM tanlovida birinchi o'rinni egalladi.", icon: '🥇', year: '2026', created_at: nowIso() },
  { id: 2, title: 'ISO Sertifikatsiyasi', description: "Maktab xalqaro ta'lim standartlari bo'yicha sertifikatsiyalandi.", icon: '📜', year: '2025', created_at: nowIso() },
  { id: 3, title: 'Eng yaxshi maktab unvoni', description: "Farg'ona viloyati bo'yicha eng yaxshi maktab mukofotini oldik.", icon: '🏆', year: '2025', created_at: nowIso() },
  { id: 4, title: 'Robototexnika musobaqasi', description: 'Mintaqaviy robototexnika tanlovida 2-o\'rin.', icon: '🤖', year: '2024', created_at: nowIso() },
];

const SEED_GALLERY: GalleryImage[] = [
  { id: 1, image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80', title: 'Maktab binosi', category: 'Umumiy', created_at: nowIso() },
  { id: 2, image_url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=600&q=80', title: 'Dars jarayoni', category: "Ta'lim", created_at: nowIso() },
  { id: 3, image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80', title: 'Olimpiada', category: "Ta'lim", created_at: nowIso() },
  { id: 4, image_url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80', title: 'Sport', category: 'Sport', created_at: nowIso() },
  { id: 5, image_url: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=600&q=80', title: 'Laboratoriya', category: "Ta'lim", created_at: nowIso() },
  { id: 6, image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80', title: 'Kutubxona', category: 'Umumiy', created_at: nowIso() },
  { id: 7, image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80', title: "O'quvchilar", category: 'Tadbirlar', created_at: nowIso() },
  { id: 8, image_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80', title: 'Tadbir', category: 'Tadbirlar', created_at: nowIso() },
];

interface StoredUser extends User {
  password: string;
}

const SEED_USERS: StoredUser[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@17maktab.uz',
    full_name: 'Bosh Administrator',
    is_admin: true,
    is_active: true,
    created_at: nowIso(),
    password: 'admin123',
  },
];

// ── Kolleksiyalarni o'qish/yozish yordamchilari ────────────────────────────────
function loadUsers(): StoredUser[] {
  return readSeeded('users', SEED_USERS);
}
function saveUsers(v: StoredUser[]) {
  write('users', v);
}
function loadSessions(): Record<string, number> {
  return readSeeded('sessions', {});
}
function saveSessions(v: Record<string, number>) {
  write('sessions', v);
}
function loadTeachers(): Teacher[] {
  return readSeeded('teachers', SEED_TEACHERS);
}
function saveTeachers(v: Teacher[]) {
  write('teachers', v);
}
function loadNews(): News[] {
  return readSeeded('news', SEED_NEWS);
}
function saveNews(v: News[]) {
  write('news', v);
}
function loadAnnouncements(): Announcement[] {
  return readSeeded('announcements', SEED_ANNOUNCEMENTS);
}
function saveAnnouncements(v: Announcement[]) {
  write('announcements', v);
}
function loadAchievements(): Achievement[] {
  return readSeeded('achievements', SEED_ACHIEVEMENTS);
}
function saveAchievements(v: Achievement[]) {
  write('achievements', v);
}
function loadGallery(): GalleryImage[] {
  return readSeeded('gallery', SEED_GALLERY);
}
function saveGallery(v: GalleryImage[]) {
  write('gallery', v);
}
function loadContacts(): Contact[] {
  return readSeeded('contacts', [] as Contact[]);
}
function saveContacts(v: Contact[]) {
  write('contacts', v);
}
function loadSchedule(): ScheduleEntry[] {
  return readSeeded('schedule', [] as ScheduleEntry[]);
}
function saveSchedule(v: ScheduleEntry[]) {
  write('schedule', v);
}
function loadSettings(): Record<string, string> {
  return readSeeded('settings', SEED_SETTINGS);
}
function saveSettings(v: Record<string, string>) {
  write('settings', v);
}

function stripPassword(u: StoredUser): User {
  const rest: Record<string, unknown> = { ...u };
  delete rest.password;
  return rest as unknown as User;
}

function randomToken(): string {
  return 'tok_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ── AUTH ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: async (username: string, password: string): ApiResult<{ access_token: string; token_type: string }> => {
    const user = loadUsers().find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );
    if (!user || !user.is_active) {
      await delay(null, 300);
      throw new Error("Username yoki parol noto'g'ri");
    }
    const token = randomToken();
    const sessions = loadSessions();
    sessions[token] = user.id;
    saveSessions(sessions);
    return delay({ data: { access_token: token, token_type: 'bearer' } });
  },
  me: async (): ApiResult<User> => {
    const token = localStorage.getItem('token');
    const sessions = loadSessions();
    const userId = token ? sessions[token] : undefined;
    const user = userId ? loadUsers().find((u) => u.id === userId) : undefined;
    if (!user) throw new Error('Sessiya topilmadi');
    return delay({ data: stripPassword(user) });
  },
  createUser: async (data: { username: string; email: string; full_name: string; password: string; is_admin?: boolean }): ApiResult<User> => {
    const users = loadUsers();
    if (users.some((u) => u.username.toLowerCase() === data.username.toLowerCase())) {
      throw new Error("Bu username band");
    }
    const created: StoredUser = {
      id: nextId(users),
      username: data.username,
      email: data.email,
      full_name: data.full_name,
      is_admin: !!data.is_admin,
      is_active: true,
      created_at: nowIso(),
      password: data.password,
    };
    users.push(created);
    saveUsers(users);
    return delay({ data: stripPassword(created) });
  },
  listUsers: async (): ApiResult<User[]> => {
    return delay({ data: loadUsers().map(stripPassword) });
  },
  deleteUser: async (id: number): ApiResult<{ ok: true }> => {
    saveUsers(loadUsers().filter((u) => u.id !== id));
    return delay({ data: { ok: true } });
  },
  changePassword: async (userId: number, oldPassword: string, newPassword: string): ApiResult<{ ok: true }> => {
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1 || users[idx].password !== oldPassword) {
      throw new Error("Joriy parol noto'g'ri");
    }
    users[idx] = { ...users[idx], password: newPassword };
    saveUsers(users);
    return delay({ data: { ok: true } });
  },
};

// ── TEACHERS ──────────────────────────────────────────────────────────────────
export const teachersApi = {
  getAll: async (): ApiResult<Teacher[]> => delay({ data: loadTeachers().filter((t) => t.is_active) }),
  getAllAdmin: async (): ApiResult<Teacher[]> => delay({ data: loadTeachers() }),
  create: async (data: Record<string, unknown>): ApiResult<Teacher> => {
    const items = loadTeachers();
    const created = { ...data, id: nextId(items), created_at: nowIso() } as Teacher;
    items.push(created);
    saveTeachers(items);
    return delay({ data: created });
  },
  update: async (id: number, data: Record<string, unknown>): ApiResult<Teacher | null> => {
    const items = loadTeachers();
    const idx = items.findIndex((t) => t.id === id);
    if (idx === -1) return delay({ data: null });
    items[idx] = { ...items[idx], ...data };
    saveTeachers(items);
    return delay({ data: items[idx] });
  },
  delete: async (id: number): ApiResult<{ ok: true }> => {
    saveTeachers(loadTeachers().filter((t) => t.id !== id));
    return delay({ data: { ok: true } });
  },
};

// ── NEWS ──────────────────────────────────────────────────────────────────────
export const newsApi = {
  getAll: async (): ApiResult<News[]> => delay({ data: loadNews().filter((n) => n.published) }),
  getAllAdmin: async (): ApiResult<News[]> => delay({ data: loadNews() }),
  getOne: async (id: number): ApiResult<News | null> => delay({ data: loadNews().find((n) => n.id === id) ?? null }),
  create: async (data: Record<string, unknown>): ApiResult<News> => {
    const items = loadNews();
    const created = { ...data, id: nextId(items), created_at: nowIso() } as News;
    items.unshift(created);
    saveNews(items);
    return delay({ data: created });
  },
  update: async (id: number, data: Record<string, unknown>): ApiResult<News | null> => {
    const items = loadNews();
    const idx = items.findIndex((n) => n.id === id);
    if (idx === -1) return delay({ data: null });
    items[idx] = { ...items[idx], ...data };
    saveNews(items);
    return delay({ data: items[idx] });
  },
  delete: async (id: number): ApiResult<{ ok: true }> => {
    saveNews(loadNews().filter((n) => n.id !== id));
    return delay({ data: { ok: true } });
  },
};

// ── ANNOUNCEMENTS ─────────────────────────────────────────────────────────────
export const announcementsApi = {
  getAll: async (): ApiResult<Announcement[]> => delay({ data: loadAnnouncements().filter((a) => a.is_active) }),
  getAllAdmin: async (): ApiResult<Announcement[]> => delay({ data: loadAnnouncements() }),
  create: async (data: object): ApiResult<Announcement> => {
    const items = loadAnnouncements();
    const created = { ...data, id: nextId(items), created_at: nowIso() } as Announcement;
    items.unshift(created);
    saveAnnouncements(items);
    return delay({ data: created });
  },
  update: async (id: number, data: object): ApiResult<Announcement | null> => {
    const items = loadAnnouncements();
    const idx = items.findIndex((a) => a.id === id);
    if (idx === -1) return delay({ data: null });
    items[idx] = { ...items[idx], ...data };
    saveAnnouncements(items);
    return delay({ data: items[idx] });
  },
  delete: async (id: number): ApiResult<{ ok: true }> => {
    saveAnnouncements(loadAnnouncements().filter((a) => a.id !== id));
    return delay({ data: { ok: true } });
  },
};

// ── CONTACT ───────────────────────────────────────────────────────────────────
export const contactApi = {
  send: async (data: { name: string; email: string; phone?: string; subject?: string; message: string }): ApiResult<{ ok: true }> => {
    const items = loadContacts();
    const created: Contact = {
      id: nextId(items),
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      is_read: false,
      created_at: nowIso(),
    };
    items.unshift(created);
    saveContacts(items);
    return delay({ data: { ok: true } });
  },
  getAll: async (): ApiResult<Contact[]> => delay({ data: loadContacts() }),
  markRead: async (id: number): ApiResult<{ ok: true }> => {
    const items = loadContacts();
    const idx = items.findIndex((c) => c.id === id);
    if (idx !== -1) items[idx] = { ...items[idx], is_read: true };
    saveContacts(items);
    return delay({ data: { ok: true } });
  },
  delete: async (id: number): ApiResult<{ ok: true }> => {
    saveContacts(loadContacts().filter((c) => c.id !== id));
    return delay({ data: { ok: true } });
  },
};

// ── SCHEDULE ──────────────────────────────────────────────────────────────────
export const scheduleApi = {
  getAll: async (): ApiResult<ScheduleEntry[]> => delay({ data: loadSchedule() }),
  getClass: async (cls: string): ApiResult<ScheduleEntry[]> =>
    delay({ data: loadSchedule().filter((s) => s.class_name === cls) }),
  update: async (data: { entries: Omit<ScheduleEntry, 'id'>[] }): ApiResult<{ ok: true }> => {
    const className = data.entries[0]?.class_name;
    const current = loadSchedule();
    const rest = className ? current.filter((s) => s.class_name !== className) : current;
    let idCounter = nextId(current);
    const withIds: ScheduleEntry[] = data.entries.map((e) => ({ ...e, id: idCounter++ }));
    saveSchedule([...rest, ...withIds]);
    return delay({ data: { ok: true } });
  },
};

// ── ACHIEVEMENTS ──────────────────────────────────────────────────────────────
export const achievementsApi = {
  getAll: async (): ApiResult<Achievement[]> => delay({ data: loadAchievements() }),
  create: async (data: object): ApiResult<Achievement> => {
    const items = loadAchievements();
    const created = { ...data, id: nextId(items), created_at: nowIso() } as Achievement;
    items.unshift(created);
    saveAchievements(items);
    return delay({ data: created });
  },
  update: async (id: number, data: object): ApiResult<Achievement | null> => {
    const items = loadAchievements();
    const idx = items.findIndex((a) => a.id === id);
    if (idx === -1) return delay({ data: null });
    items[idx] = { ...items[idx], ...data };
    saveAchievements(items);
    return delay({ data: items[idx] });
  },
  delete: async (id: number): ApiResult<{ ok: true }> => {
    saveAchievements(loadAchievements().filter((a) => a.id !== id));
    return delay({ data: { ok: true } });
  },
};

// ── GALLERY ───────────────────────────────────────────────────────────────────
export const galleryApi = {
  getAll: async (): ApiResult<GalleryImage[]> => delay({ data: loadGallery() }),
  add: async (data: object): ApiResult<GalleryImage> => {
    const items = loadGallery();
    const created = { category: 'Umumiy', ...data, id: nextId(items), created_at: nowIso() } as GalleryImage;
    items.unshift(created);
    saveGallery(items);
    return delay({ data: created });
  },
  delete: async (id: number): ApiResult<{ ok: true }> => {
    saveGallery(loadGallery().filter((g) => g.id !== id));
    return delay({ data: { ok: true } });
  },
};

// ── SETTINGS ──────────────────────────────────────────────────────────────────
export const settingsApi = {
  getAll: async (): ApiResult<Record<string, string>> => delay({ data: loadSettings() }),
  update: async (data: Record<string, string>): ApiResult<Record<string, string>> => {
    const merged = { ...loadSettings(), ...data };
    saveSettings(merged);
    return delay({ data: merged });
  },
};
