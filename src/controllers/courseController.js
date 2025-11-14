import { CourseModel } from "../models/courseModel.js";
import { createIds } from "../services/createIds.js";

export const fetchAllCourses = async (_, res) => {
  const { data, error } = await CourseModel.getAllCourses();
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ responseDetails: { allCourses: data } });
};

export const fetchCourseById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await CourseModel.getCourseById(id);
  if (error) return res.status(404).json({ error: "Course not found" });
  res.json({ responseDetails: { course: data } });
};

export const addCourse = async (req, res) => {
  const { title, description, modules, isPremiumCourse } = req.body.course;
  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required" });
  }
  const modulesWithIds = createIds(modules, "module");
  const { data, error } = await CourseModel.createCourse({
    title,
    description,
    instructor_id: req.authUser.id,
    modules: modulesWithIds,
    is_premium_course: isPremiumCourse,
  });
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ responseDetails: { course: data } });
};

export const editCourse = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };
  const updatedData = { ...updates, modules: createIds(updates.modules) };
  const { data, error } = await CourseModel.updateCourse(id, updatedData);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ responseDetails: { course: data } });
};

export const removeCourse = async (req, res) => {
  const { id } = req.params;
  const { error } = await CourseModel.deleteCourse(id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ responseDetails: { message: "Course deleted successfully" } });
};
