create table user_courses_progress (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    course_id uuid references courses(id) on delete cascade,
    completion_percent numeric default 0 not null,
    watched_videos jsonb not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);
