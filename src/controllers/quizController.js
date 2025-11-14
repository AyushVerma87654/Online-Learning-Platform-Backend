import { QuizModel } from "../models/quizModel.js";
import { QuizResultsModel } from "../models/quizResultsModel.js";
import { createIds } from "../services/createIds.js";

export const getQuiz = async (req, res) => {
  const { quizId } = req.params;
  try {
    const { data, error } = await QuizModel.getQuizById(quizId);
    if (error) return res.status(404).json({ error: "Quiz not found" });
    const questions = data.questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
    }));
    res.json({ responseDetails: { quiz: { ...data, questions } } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body;
  console.log("req.authUser", req.authUser);
  const userId = req.authUser.id;
  try {
    const { data, error } = await QuizModel.getQuizById(quizId);
    if (error) return res.status(404).json({ error: "Quiz not found" });
    let score = 0;
    const questions = data.questions;
    questions.forEach((question) => {
      if (question.correctAnswer === answers[question.id]) score++;
    });
    const scorePercentage = Math.round((score / questions.length) * 100);
    const { data: quizResult, error: quizResultError } =
      await QuizResultsModel.createQuizResult({
        user_id: userId,
        quiz_id: quizId,
        score: scorePercentage,
        submitted_at: new Date(),
      });
    if (quizResultError)
      return res.status(500).json({ error: quizResultError.message });

    res.json({ responseDetails: { quizResult } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createQuiz = async (req, res) => {
  const { courseId } = req.params;
  const { title, description, questions } = req.body.quiz;
  try {
    const questionsWithIds = createIds(questions, "question");
    const data = await QuizModel.createQuiz({
      title,
      description,
      questions: questionsWithIds,
      course_id: courseId,
    });
    res.status(201).json({
      message: "Quiz created successfully",
      quiz: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { title, description, questions, courseId } = req.body.quiz;
  const formattedQuestions = formatData("question", questions);

  try {
    const data = await QuizModel.editQuiz(quizId, {
      title,
      description,
      questions: formattedQuestions,
      course_id: courseId,
    });
    res.status(200).json({
      message: "Quiz updated successfully",
      quiz: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await QuizModel.deleteQuiz(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const djangoQuizzes = [
  {
    course_id: "b75f70b5-9096-4c5d-985d-7f9e3b1e83ef",
    module_id: "module-1",
    title: "Quiz: Django Basics",
    description: "Test your understanding of Django setup, apps, and models.",
    questions: [
      {
        question: "What command is used to create a new Django project?",
        options: [
          "django startproject",
          "django createproject",
          "python startproject",
          "django newproject",
        ],
        correctAnswer: "django startproject",
      },
      {
        question: "Which file defines models for a Django app?",
        options: ["views.py", "urls.py", "models.py", "admin.py"],
        correctAnswer: "models.py",
      },
      {
        question: "Which command runs the Django development server?",
        options: [
          "python manage.py runserver",
          "django runserver",
          "python runserver",
          "django startserver",
        ],
        correctAnswer: "python manage.py runserver",
      },
      {
        question: "What is the default database used by Django?",
        options: ["PostgreSQL", "MySQL", "SQLite", "MongoDB"],
        correctAnswer: "SQLite",
      },
      {
        question:
          "Which method is used to register models with the admin site?",
        options: [
          "admin.site.register()",
          "models.register()",
          "register.admin()",
          "admin.registerModel()",
        ],
        correctAnswer: "admin.site.register()",
      },
    ],
  },
  {
    course_id: "b75f70b5-9096-4c5d-985d-7f9e3b1e83ef",
    module_id: "module-2",
    title: "Quiz: Views & Templates",
    description: "Assess your knowledge of Django views and templates.",
    questions: [
      {
        question: "Which type of view is defined using a Python function?",
        options: [
          "Class-based view",
          "Function-based view",
          "Template view",
          "Admin view",
        ],
        correctAnswer: "Function-based view",
      },
      {
        question: "Which template tag is used to include another template?",
        options: [
          "{% include %}",
          "{% import %}",
          "{% load %}",
          "{% extend %}",
        ],
        correctAnswer: "{% include %}",
      },
      {
        question: "How do you pass data from a view to a template?",
        options: [
          "Using context dictionary",
          "Using request object",
          "Using models.py",
          "Using urls.py",
        ],
        correctAnswer: "Using context dictionary",
      },
      {
        question: "Which template tag loops through a list of items?",
        options: ["{% for %}", "{% loop %}", "{% iterate %}", "{% each %}"],
        correctAnswer: "{% for %}",
      },
      {
        question:
          "Which type of view can be reused and extended via inheritance?",
        options: [
          "Function-based view",
          "Class-based view",
          "Template view",
          "API view",
        ],
        correctAnswer: "Class-based view",
      },
    ],
  },
  {
    course_id: "b75f70b5-9096-4c5d-985d-7f9e3b1e83ef",
    module_id: "module-3",
    title: "Quiz: Forms & Validation",
    description: "Check your understanding of Django forms and validation.",
    questions: [
      {
        question: "Which class is used to create a Django form?",
        options: ["forms.Form", "Form", "models.Form", "FormModel"],
        correctAnswer: "forms.Form",
      },
      {
        question: "Which field is used to accept an email in a form?",
        options: ["CharField", "EmailField", "TextField", "URLField"],
        correctAnswer: "EmailField",
      },
      {
        question: "What method is used to validate a Django form?",
        options: ["is_valid()", "validate()", "check_form()", "form_valid()"],
        correctAnswer: "is_valid()",
      },
      {
        question: "Which widget is used for password input?",
        options: ["TextInput", "PasswordInput", "HiddenInput", "EmailInput"],
        correctAnswer: "PasswordInput",
      },
      {
        question: "How do you handle form errors in a template?",
        options: [
          "{{ form.errors }}",
          "{{ errors }}",
          "{{ form.validate }}",
          "{{ form.check }}",
        ],
        correctAnswer: "{{ form.errors }}",
      },
    ],
  },
  {
    course_id: "b75f70b5-9096-4c5d-985d-7f9e3b1e83ef",
    module_id: "module-4",
    title: "Quiz: REST APIs",
    description: "Test your knowledge of Django REST Framework.",
    questions: [
      {
        question:
          "Which class is used to create an API view in Django REST Framework?",
        options: ["APIView", "RestView", "ApiClass", "DjangoView"],
        correctAnswer: "APIView",
      },
      {
        question: "Which module helps in serializing Django models?",
        options: ["serializers", "forms", "views", "urls"],
        correctAnswer: "serializers",
      },
      {
        question: "Which HTTP method is used to update data partially?",
        options: ["PUT", "PATCH", "POST", "DELETE"],
        correctAnswer: "PATCH",
      },
      {
        question: "Which authentication method can be used for APIs?",
        options: ["JWT", "Session", "Token", "All of the above"],
        correctAnswer: "All of the above",
      },
      {
        question: "Which decorator is used for permission checks?",
        options: [
          "@permission_classes",
          "@login_required",
          "@api_view",
          "@csrf_exempt",
        ],
        correctAnswer: "@permission_classes",
      },
    ],
  },
  {
    course_id: "b75f70b5-9096-4c5d-985d-7f9e3b1e83ef",
    module_id: "module-5",
    title: "Quiz: Deployment",
    description: "Evaluate your knowledge of deploying Django apps.",
    questions: [
      {
        question: "Which platform is commonly used to deploy Django apps?",
        options: ["Heroku", "GitHub", "Netlify", "Firebase"],
        correctAnswer: "Heroku",
      },
      {
        question: "Which command collects static files for deployment?",
        options: ["collectstatic", "makemigrations", "migrate", "runserver"],
        correctAnswer: "collectstatic",
      },
      {
        question: "Which setting should be True in production?",
        options: ["DEBUG", "ALLOWED_HOSTS", "INSTALLED_APPS", "SECRET_KEY"],
        correctAnswer: "ALLOWED_HOSTS",
      },
      {
        question: "Which file stores production configurations?",
        options: ["settings.py", "urls.py", "wsgi.py", "manage.py"],
        correctAnswer: "settings.py",
      },
      {
        question: "Which WSGI server is commonly used in production?",
        options: ["Gunicorn", "DjangoServer", "ApacheServer", "NginxServer"],
        correctAnswer: "Gunicorn",
      },
    ],
  },
];
