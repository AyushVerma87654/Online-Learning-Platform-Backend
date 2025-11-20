CREATE OR REPLACE FUNCTION update_updatedAt_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updated_at" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS set_updatedAt_users ON users;
CREATE TRIGGER set_updatedAt_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updatedAt_column();


DROP TRIGGER IF EXISTS set_updatedAt_courses ON courses;
CREATE TRIGGER set_updatedAt_courses
BEFORE UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION update_updatedAt_column();


DROP TRIGGER IF EXISTS set_updatedAt_user_courses_progress ON user_courses_progress;
CREATE TRIGGER set_updatedAt_user_courses_progress
BEFORE UPDATE ON user_courses_progress
FOR EACH ROW
EXECUTE FUNCTION update_updatedAt_column();


DROP TRIGGER IF EXISTS set_updatedAt_quizzes ON quizzes;
CREATE TRIGGER set_updatedAt_quizzes
BEFORE UPDATE ON quizzes
FOR EACH ROW
EXECUTE FUNCTION update_updatedAt_column();
