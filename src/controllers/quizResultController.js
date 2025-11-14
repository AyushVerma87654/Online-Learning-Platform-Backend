import { QuizResultsModel } from "../models/quizResultsModel.js";

export const getQuizResult = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.authUser.id;
    const { data: quizResults, error } = await QuizResultsModel.getQuizResult(
      userId,
      quizId
    );
    if (error) return res.status(400).json({ error: error.message });
    res.json({ responseDetails: { quizResults } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchAllQuizResults = async (req, res) => {
  try {
    const { data, error } = await QuizResultsModel.getAllQuizResults();
    if (error) return res.status(400).json({ error: error.message });
    res.json({
      responseDetails: { allQuizResults: data },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
