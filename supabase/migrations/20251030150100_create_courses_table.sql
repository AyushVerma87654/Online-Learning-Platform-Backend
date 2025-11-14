create table courses (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    instructor_id uuid references users(id) not null,
    modules jsonb[] not null,
    is_premium_course boolean not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);
