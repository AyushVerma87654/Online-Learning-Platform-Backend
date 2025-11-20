import { convertKeysToCamelCase } from "../services/normalizeData.js";
import { supabase } from "../services/supabase.js";
import { QuizModel } from "./quizModel.js";

export const CourseModel = {
  async createCourse(course) {
    const { data, error } = await supabase
      .from("courses")
      .insert({ ...course })
      .select();
    if (error) throw error;
    const { data: courseData, error: courseError } = await this.getCourseById(
      data.id
    );
    if (courseError) throw courseError;
    return { data: courseData };
  },

  async getAllCourses() {
    const { data, error } = await supabase.from("courses").select(`
      *,
      instructor:instructor_id(name)
    `);
    if (error) throw error;
    if (!data) return { data: [] };
    const coursesWithQuiz = await Promise.all(
      data.map(async (course) => {
        const modules = await Promise.all(
          course.modules.map(async (module) => {
            const quiz = await QuizModel.getQuizByCourseId(
              course.id,
              module.id
            );
            return { ...module, quizId: quiz?.data?.id };
          })
        );
        const { instructor, ...rest } = convertKeysToCamelCase(course);
        return { ...rest, instructorName: instructor.name, modules };
      })
    );
    return { data: coursesWithQuiz };
  },

  async getCourseById(id) {
    const { data, error } = await supabase
      .from("courses")
      .select(
        `
      *,
      instructor:instructor_id(name)
    `
      )
      .eq("id", id)
      .single();
    if (error) throw error;
    const modules = await Promise.all(
      data.modules.map(async (module) => {
        const quiz = await QuizModel.getQuizByCourseId(data.id, module.id);
        return { ...module, quizId: quiz?.data?.id };
      })
    );
    const { instructor, ...rest } = convertKeysToCamelCase(data);
    return {
      data: {
        ...rest,
        instructorName: instructor.name,
        modules,
      },
    };
  },

  async updateCourse(id, course) {
    console.log("id,course", id, course);
    const { data, error } = await supabase
      .from("courses")
      .update({
        title: course.title,
        description: course.description,
        modules: course.modules,
        is_premium_course: course.is_premium_course,
      })
      .eq("id", id)
      .select()
      .single();
    console.log("error", error);
    console.log("data", data);
    if (error) return { error };

    const { data: courseData, error: courseError } = await this.getCourseById(
      data.id
    );
    console.log("courseError", courseError);
    if (courseError) throw courseError;
    return { data: courseData };
  },

  async deleteCourse(id) {
    return supabase.from("courses").delete().eq("id", id).select().single();
  },
};
