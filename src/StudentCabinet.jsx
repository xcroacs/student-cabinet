import React, { useState, useEffect } from 'react';
import { Sun, Moon, LogOut, Settings, Calendar, BookOpen, User, Bell, Edit3, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_USER = {
  username: 'Алексей',
  password: '123456',
  name: 'Алексей Иванов',
  group: 'ПИ-21-1',
  faculty: 'Факультет информатики'
};

const BASE_PAIRS = [
  { course: 'Алгебра и геометрия', type: 'Лекция', place: '6-106', teacher: 'Белова А.С.' },
  { course: 'Математический анализ', type: 'Лекция', place: '7-206', teacher: 'Кужаев А.Ф.' },
  { course: 'Языки и методы программирования', type: 'Практика', place: '7-206', teacher: 'Хасанов А.Ю.' },
  { course: 'Иностранный язык', type: 'Семинар', place: '1-304', teacher: 'Белова А.С.' },
  { course: 'Физкультура', type: 'Практика', place: 'Спортзал', teacher: '—' },
  { course: 'Основы ИТ', type: 'Семинар', place: '6-415', teacher: 'Сметанина О.Н.' }
];

const TIME_SLOTS = ['08:00–09:20', '09:35–10:55', '11:35–12:55', '13:10–14:30', '15:10–16:30', '16:45–18:05'];
const DAY_COUNTS = { Понедельник: 6, Вторник: 4, Среда: 6, Четверг: 4, Пятница: 6, Суббота: 3 };
const DAYS = Object.keys(DAY_COUNTS);

function createRng(seed = 1) {
  let s = seed >>> 0;
  return () => ((s = (1664525 * s + 1013904223) >>> 0) / 0xffffffff);
}

function generateSchedule(seed = 10) {
  const rng = createRng(seed);
  const data = [];
  let id = 1;
  for (const day of DAYS) {
    const count = DAY_COUNTS[day];
    for (let i = 0; i < count; i++) {
      const p = BASE_PAIRS[Math.floor(rng() * BASE_PAIRS.length)];
      data.push({ id: id++, day, time: TIME_SLOTS[i], ...p });
    }
  }
  return data;
}

export default function StudentCabinet() {
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [section, setSection] = useState('profile');
  const [language, setLanguage] = useState('ru');
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Завтра контрольная по математике в 9:00' },
    { id: 2, text: 'Изменение аудитории по предмету "Основы ИТ"' }
  ]);

  useEffect(() => { setSchedule(generateSchedule(5)); }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const loginHandler = () => {
    if (login === MOCK_USER.username && password === MOCK_USER.password) {
      setUser(MOCK_USER);
      setError('');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { id: Date.now(), text: newNote }]);
      setNewNote('');
    }
  };

  const grouped = DAYS.map(day => ({
    day,
    items: Array.isArray(schedule) ? schedule.filter(s => s.day === day) : []
  }));

  const sessionData = [
    { subject: 'Алгебра и геометрия', type: 'Экзамен', progress: 80 },
    { subject: 'Математический анализ', type: 'Экзамен', progress: 65 },
    { subject: 'Основы ИТ', type: 'Зачёт', progress: 100 },
    { subject: 'Физкультура', type: 'Зачёт', progress: 100 }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-gray-50' : 'bg-indigo-50 text-gray-900'}`}>
      <header className={`p-4 flex justify-between items-center shadow-lg transition-colors duration-500 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-indigo-600 text-white'}`}>
        <h1 className="text-3xl font-bold tracking-tight">Личный кабинет студента</h1>
        {user && (
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(prev => !prev)} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setUser(null)} className={`px-3 py-1 rounded-md flex items-center gap-1 transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' : 'bg-white text-indigo-600 hover:bg-gray-100'}`}>
              <LogOut size={16} /> Выйти
            </button>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {!user ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`max-w-sm mx-auto mt-20 p-8 rounded-2xl shadow-2xl transition-all duration-500 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <h2 className="text-2xl font-semibold mb-6 text-center">Вход в систему</h2>
            <input value={login} onChange={e => setLogin(e.target.value)} placeholder="Логин" className={`w-full mb-4 p-3 border rounded-xl outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'}`} />
            <input value={password} type="password" onChange={e => setPassword(e.target.value)} placeholder="Пароль" className={`w-full mb-4 p-3 border rounded-xl outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'}`} />
            {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
            <button onClick={loginHandler} className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition-all font-medium">Войти</button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-5 gap-6">
            <aside className={`md:col-span-1 rounded-2xl shadow-lg p-4 space-y-3 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
              {['profile', 'schedule', 'session', 'notes', 'notifications', 'stats', 'settings'].map(key => (
                <button key={key} onClick={() => setSection(key)} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${section === key ? 'bg-indigo-600 text-white shadow-md' : darkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-100'}`}>
                  {key === 'profile' && <User size={18} />}
                  {key === 'schedule' && <Calendar size={18} />}
                  {key === 'session' && <BookOpen size={18} />}
                  {key === 'notes' && <Edit3 size={18} />}
                  {key === 'notifications' && <Bell size={18} />}
                  {key === 'stats' && <BarChart2 size={18} />}
                  {key === 'settings' && <Settings size={18} />}
                  {key === 'profile' ? 'Профиль' : key === 'schedule' ? 'Расписание' : key === 'session' ? 'Сессия' : key === 'notes' ? 'Заметки' : key === 'notifications' ? 'Уведомления' : key === 'stats' ? 'Статистика' : 'Настройки'}
                </button>
              ))}
            </aside>

            <section className="md:col-span-4">
              <AnimatePresence mode="wait">

                {/* ==== Профиль ==== */}
                {section === 'profile' && (
                  <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                    <h2 className="text-2xl font-bold">Добро пожаловать, {user.name}</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className={`rounded-xl p-4 shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <p className="text-sm text-gray-500">Группа</p>
                        <p className="text-lg font-semibold">{user.group}</p>
                      </div>
                      <div className={`rounded-xl p-4 shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <p className="text-sm text-gray-500">Факультет</p>
                        <p className="text-lg font-semibold">{user.faculty}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ==== Расписание ==== */}
                {section === 'schedule' && (
                  <motion.div key="sched" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                    {grouped.map(g => (
                      <div key={g.day} className="space-y-2">
                        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 border-b pb-1">{g.day}</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {g.items.map(pair => (
                            <div key={pair.id} className={`p-4 rounded-2xl shadow hover:shadow-lg transition-all ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                              <div className="font-semibold text-indigo-600 dark:text-indigo-400">{pair.time}</div>
                              <div className="text-lg font-medium">{pair.course}</div>
                              <div className="text-sm text-gray-500">{pair.teacher}</div>
                              <div className="text-sm text-gray-500">{pair.place}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* ==== Сессия ==== */}
                {section === 'session' && (
                  <motion.div key="session" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                    <h2 className="text-2xl font-semibold mb-4">Сессия</h2>
                    {sessionData.map((item, i) => (
                      <div key={i} className={`p-5 rounded-2xl shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-lg">{item.subject}</span>
                          <span className="text-sm text-gray-500">{item.type}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="text-gray-400">Прогресс</span>
                          <span className="text-indigo-500 font-semibold">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                          <motion.div className="bg-indigo-600 h-3 rounded-full" initial={{ width: 0 }} animate={{ width: `${item.progress}%` }} transition={{ duration: 0.8 }} />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* ==== Заметки ==== */}
                {section === 'notes' && (
                  <motion.div key="notes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                    <h2 className="text-2xl font-semibold mb-4">Заметки</h2>
                    <div className={`p-5 rounded-2xl shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex gap-2 mb-4">
                        <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Введите заметку..." className={`flex-1 p-2 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'}`} />
                        <button onClick={addNote} className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition">Добавить</button>
                      </div>
                      <ul className="space-y-2">
                        {notes.map(n => (
                          <li key={n.id} className={`p-3 rounded-xl shadow-sm ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>{n.text}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {/* ==== Уведомления ==== */}
                {section === 'notifications' && (
                  <motion.div key="notifications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                    <h2 className="text-2xl font-semibold mb-4">Уведомления</h2>
                    {notifications.map(note => (
                      <div key={note.id} className={`p-4 rounded-2xl shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>{note.text}</div>
                    ))}
                  </motion.div>
                )}

                {/* ==== Статистика ==== */}
                {section === 'stats' && (
                  <motion.div key="stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                    <h2 className="text-2xl font-semibold mb-4">Статистика успеваемости</h2>
                    <div className={`p-5 rounded-2xl shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <p className="text-lg font-medium mb-2">Средний прогресс сессии: {Math.round(sessionData.reduce((a, b) => a + b.progress, 0) / sessionData.length)}%</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <motion.div className="bg-indigo-600 h-3 rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.round(sessionData.reduce((a, b) => a + b.progress, 0) / sessionData.length)}%` }} transition={{ duration: 0.8 }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ==== Настройки ==== */}
                {section === 'settings' && (
                  <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                    <h2 className="text-2xl font-semibold mb-4">Настройки</h2>
                    <div className={`p-5 rounded-2xl shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <span>Тёмная тема</span>
                        <button
                          onClick={() => setDarkMode(!darkMode)}
                          className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-900'} transition`}
                        >
                          {darkMode ? 'Включена' : 'Выключена'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span>Язык интерфейса</span>
                        <select
                          value={language}
                          onChange={e => setLanguage(e.target.value)}
                          className={`px-4 py-2 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'}`}
                        >
                          <option value="ru">Русский</option>
                          <option value="en">English</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setNotes([])}
                          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                        >
                          Очистить заметки
                        </button>
                        <button
                          onClick={() => setUser(null)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition"
                        >
                          Выйти из аккаунта
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
