CREATE TABLE quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) on delete cascade,
  quiz_id uuid REFERENCES quizzes(id) on delete cascade,
  score numeric(5,2) CHECK (score >= 0 AND score <= 100),
  submitted_at timestamp with time zone default now()
);
