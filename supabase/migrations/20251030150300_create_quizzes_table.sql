create table quizzes (
    id uuid primary key default gen_random_uuid(),
    course_id uuid references courses(id) on delete cascade,
    module_id NOT NULL,
    title text NOT NULL,
    description text,
    questions jsonb not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);
