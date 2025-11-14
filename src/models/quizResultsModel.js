import { convertKeysToCamelCase } from "../services/normalizeData.js";
import { supabase } from "../services/supabase.js";

export const QuizResultsModel = {
  async createQuizResult(quizResult) {
    const { data, error } = await supabase
      .from("quiz_results")
      .insert(quizResult)
      .select();
    if (error) throw error;
    return { data: convertKeysToCamelCase(data) };
  },

  async getQuizResult(userId, quizId) {
    const { data, error } = await supabase
      .from("quiz_results")
      .select("*")
      .eq("user_id", userId)
      .eq("quiz_id", quizId)
      .order("submitted_at", { ascending: true });
    if (error) throw error;
    const normalizeData = data.map((item) => convertKeysToCamelCase(item));
    return { data: normalizeData };
  },

  async getAllQuizResults() {
    const { data, error } = await supabase.from("quiz_results").select("*");
    if (error) throw error;
    const normalizeData = data.map((item) => convertKeysToCamelCase(item));
    return { data: normalizeData };
  },
};
