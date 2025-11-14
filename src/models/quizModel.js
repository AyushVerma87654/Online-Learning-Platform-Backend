import { convertKeysToCamelCase } from "../services/normalizeData.js";
import { supabase } from "../services/supabase.js";

export const QuizModel = {
  async createQuiz(quiz) {
    const { data, error } = await supabase
      .from("quizzes")
      .insert(quiz)
      .select();
    console.log("data,error", data, error);
    if (error) throw error;
    return { data: convertKeysToCamelCase(data) };
  },

  async editQuiz(id, quiz) {
    const { data, error } = await supabase
      .from("quizzes")
      .update(quiz)
      .eq("id", id)
      .select();
    if (error) throw error;
    return { data: convertKeysToCamelCase(data) };
  },

  async deleteQuiz(id) {
    const { error } = await supabase.from("quizzes").delete().eq("id", id);
    if (error) throw error;
    return { message: "Quiz deleted successfully" };
  },

  async getQuizByCourseId(course_id, module_id) {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("course_id", course_id)
      .eq("module_id", module_id)
      .maybeSingle();
    console.log("error", error);
    if (error) throw error;
    if (data) return { data: convertKeysToCamelCase(data) };
  },

  async getQuizById(id) {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return { data: convertKeysToCamelCase(data) };
  },
};
