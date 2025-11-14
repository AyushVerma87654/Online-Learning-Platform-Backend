import { convertKeysToCamelCase } from "../services/normalizeData.js";
import { supabase } from "../services/supabase.js";
import { CourseModel } from "./courseModel.js";

export const ProgressModel = {
  async getProgress(userId, courseId) {
    const { data, error } = await supabase
      .from("user_courses_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .maybeSingle();
    if (error && error.code !== "PGRST116") throw new Error(error.message);
    if (data) {
      const normalizedData = convertKeysToCamelCase(data);
      return normalizedData;
    }
    return { message: "Not Enrolled" };
  },

  async update(userId, courseId, lessonId) {
    const { data: course, error: courseError } =
      await CourseModel.getCourseById(courseId);
    if (courseError) throw new Error(courseError.message);
    const totalVideos = course.lessons?.length || 0;
    const userProgress = await this.getProgress(userId, courseId);
    if (userProgress.id) {
      const existingWatchedVideos = userProgress.watchedVideos;
      if (!lessonId || existingWatchedVideos[lessonId]) return userProgress;
      const updatedExistingWatchedVideos = {
        ...existingWatchedVideos,
        [lessonId]: { watchedAt: new Date() },
      };
      const completionPercent = totalVideos
        ? Math.round(
            (Object.values(updatedExistingWatchedVideos).length / totalVideos) *
              100
          )
        : 0;
      const { data, error } = await supabase
        .from("user_courses_progress")
        .update({
          completion_percent: completionPercent,
          watched_videos: updatedExistingWatchedVideos,
        })
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .select();
      if (error) throw new Error(error.message);
      const normalizedData = convertKeysToCamelCase(data[0]);
      return normalizedData;
    } else {
      const { data, error } = await supabase
        .from("user_courses_progress")
        .insert({
          user_id: userId,
          course_id: courseId,
          completion_percent: 0,
          watched_videos: {},
        })
        .select();
      if (error) throw new Error(error.message);
      const normalizedData = convertKeysToCamelCase(data[0]);
      return normalizedData;
    }
  },

  async getAllUsersCoursesProgress() {
    const { data, error } = await supabase
      .from("user_courses_progress")
      .select("*");
    if (error) throw error;
    const normalizedData = data.map((item) => convertKeysToCamelCase(item));
    return { data: normalizedData };
  },
};
