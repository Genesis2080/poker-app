-- Tablas para almacenar datos de la app de póker
-- Cada tabla tiene user_id para vincular datos al usuario autenticado

-- Sesiones
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  modality TEXT NOT NULL,
  tournament_name TEXT,
  buy_in NUMERIC NOT NULL,
  cash_out NUMERIC NOT NULL,
  time_played_minutes INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Manos
CREATE TABLE IF NOT EXISTS hands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  position TEXT NOT NULL,
  result TEXT NOT NULL,
  hero_hand TEXT NOT NULL,
  villain_range TEXT DEFAULT '',
  preflop_action TEXT DEFAULT '',
  street TEXT DEFAULT 'preflop',
  board TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  hero_name TEXT DEFAULT 'Hero',
  hero_stack NUMERIC DEFAULT 0,
  pot_size NUMERIC DEFAULT 0,
  pot_won NUMERIC DEFAULT 0,
  stakes TEXT DEFAULT '',
  table_name TEXT DEFAULT '',
  table_format TEXT DEFAULT '6-max',
  game_type TEXT DEFAULT 'cash',
  raw_text TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Plan de estudio
CREATE TABLE IF NOT EXISTS study_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  description TEXT NOT NULL,
  street TEXT NOT NULL,
  category TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Flashcards
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty INTEGER NOT NULL,
  interval NUMERIC DEFAULT 0,
  ease_factor NUMERIC DEFAULT 2.5,
  next_review NUMERIC DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hands ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Políticas: cada usuario solo ve/modifica sus propios datos
CREATE POLICY "users own sessions" ON sessions
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users own hands" ON hands
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users own study_plan" ON study_plan
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users own flashcards" ON flashcards
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
