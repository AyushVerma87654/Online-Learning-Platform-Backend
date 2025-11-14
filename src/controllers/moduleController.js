import { CourseModel } from "../models/courseModel.js";
import { uploadVideoService } from "../services/videoService.js";

export const fetchAllModules = async (req, res) => {
  const { courseId } = req.params;
  try {
    const { data, error } = await CourseModel.getCourseById(courseId);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ responseDetails: { lessons: data.lessons || [] } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchModuleById = async (req, res) => {
  const { courseId, moduleId } = req.params;

  try {
    const { data, error } = await CourseModel.getCourseById(courseId);
    if (error) return res.status(404).json({ error: error.message });

    const module = data.modules.find((module) => module.id === moduleId);
    if (!module) return res.status(404).json({ error: "Module not found" });

    res.status(200).json({
      responseDetails: {
        module,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const uploadModuleVideo = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No video file found" });
    const videoUrl = await uploadVideoService(req.file);
    return res
      .status(200)
      .json({ responseDetails: { id: +req.body.id, videoUrl } });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
};
