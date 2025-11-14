import { ProgressModel } from "../models/progressModel.js";

export const getProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.authUser.id;
    const userCourseProgress = await ProgressModel.getProgress(
      userId,
      courseId
    );
    res.status(200).json({ responseDetails: { userCourseProgress } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { courseId, moduleId } = req.body;
    const userId = req.authUser.id;
    const data = await ProgressModel.update(userId, courseId, moduleId);
    res.status(200).json({ responseDetails: { userCourseProgress: data } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchAllUsersCoursesProgress = async (req, res) => {
  try {
    const { data, error } = await ProgressModel.getAllUsersCoursesProgress();
    if (error) return res.status(400).json({ error: error.message });
    res.json({
      responseDetails: { allUsersProgress: data },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
