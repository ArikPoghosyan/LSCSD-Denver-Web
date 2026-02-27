import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Создаем клиент Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Инициализация базы данных (заглушка для совместимости)
 */
export const initDatabase = async () => {
  console.log('Supabase initialized');
  return true;
}

/**
 * Загрузка данных из таблицы officers
 */
export const loadData = async () => {
  const { data, error } = await supabase
    .from('officers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error loading data:', error);
    throw error;
  }
  return data || [];
}

/**
 * Сохранение или обновление данных офицера
 */
export const saveData = async (officerData) => {
  const { data, error } = await supabase
    .from('officers')
    .upsert(officerData)
    .select();
  
  if (error) {
    console.error('Error saving data:', error);
    throw error;
  }
  return data;
}

/**
 * Подписка на изменения в реальном времени
 */
export const subscribeToChanges = (callback) => {
  return supabase
    .channel('public:officers')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'officers' },
      (payload) => callback(payload)
    )
    .subscribe();
}
