import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import multer from "multer";
import { isTheUserInstructor } from "./middleware/verifyInstructor.js";
import {
  fetchAllUsers,
  fetchMe,
  login,
  logout,
  paymentCheckout,
  paymentWebhook,
  signup,
} from "./controllers/userController.js";
import {
  fetchAllCourses,
  fetchCourseById,
  addCourse,
  editCourse,
  removeCourse,
} from "./controllers/courseController.js";
import {
  createQuiz,
  deleteQuiz,
  editQuiz,
  getQuiz,
  submitQuiz,
} from "./controllers/quizController.js";
import {
  fetchAllUsersCoursesProgress,
  getProgress,
  updateProgress,
} from "./controllers/progressController.js";
import {
  fetchAllQuizResults,
  getQuizResult,
} from "./controllers/quizResultController.js";
import { verifyAccessToken } from "./middleware/verifyAccessToken.js";
import bodyParser from "body-parser";
import {
  fetchAllModules,
  fetchModuleById,
  uploadModuleVideo,
} from "./controllers/moduleController.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: "https://online-learning-platform-frontend.netlify.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.post(
  "/payment/webhook",
  bodyParser.raw({ type: "application/json" }),
  paymentWebhook
);

app.use(express.json());

app.post("/signup", signup);
app.post("/login", login);
app.get("/me", fetchMe);
app.get("/logout", logout);
app.get("/all-users", fetchAllUsers);

app.post("/courses/add", isTheUserInstructor, addCourse);
app.get("/courses", fetchAllCourses);
app.get("/courses/:id", fetchCourseById);
app.put("/courses/:id", isTheUserInstructor, editCourse);
app.delete("/courses/:id", isTheUserInstructor, removeCourse);

app.get("/module/:courseId", fetchAllModules);
app.get("/module/:id", fetchModuleById);
app.post("/upload-video", upload.single("video"), uploadModuleVideo);

app.post("/quiz/submit", verifyAccessToken, submitQuiz);
app.post("/quiz/:courseId", isTheUserInstructor, createQuiz);
app.put("/quiz/:quizId", isTheUserInstructor, editQuiz);
app.delete("/quiz/:quizId", isTheUserInstructor, deleteQuiz);
app.get("/quiz/:quizId", getQuiz);

app.get("/progress/:userId/:courseId", verifyAccessToken, getProgress);
app.post("/progress/update", verifyAccessToken, updateProgress);
app.get("/all-users-courses-progress", fetchAllUsersCoursesProgress);

app.get("/quiz-result/:userId/:quizId", verifyAccessToken, getQuizResult);
app.get("/all-quiz-results", fetchAllQuizResults);

app.get("/payment", paymentCheckout);

export default app;
