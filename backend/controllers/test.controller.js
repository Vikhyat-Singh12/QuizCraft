import TestSubmission from "../models/test.model.js";
import Form from "../models/form.model.js";
import User from "../models/user.model.js";

export const submitTest = async (req, res) => {
  try {
    const { formId, answers } = req.body;
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    let totalScore = 0;
    const maxScore = form.questions.reduce((sum, q) => sum + (q.marks || 0), 0);

    const evaluatedAnswers = form.questions.map((q) => {
      const userAnswer = answers[q._id];
      let isCorrect = false;
      let marksAwarded = 0;

      if (q.type === "categorise") {
        const correctCount = q.options.filter(opt => 
          userAnswer && userAnswer[opt.text] === opt.correctCategory
        ).length;

        if (correctCount === q.options.length) {
          isCorrect = true;
          marksAwarded = q.marks || 0;
        }
      } 
      else if (q.type === "cloze") {
        if (userAnswer && userAnswer.trim() === q.cloze.answer) {
          isCorrect = true;
          marksAwarded = q.marks || 0;
        }
      } 
      else if (q.type === "comprehension") {
        let subScore = 0;
        let subMax = q.marks || 0;
        const subQuestions = q.comprehension.questions;
        const perSubQMark = subMax / subQuestions.length;

        subQuestions.forEach((subQ) => {
          const ans = userAnswer ? userAnswer[subQ._id] : null;
          if (ans && ans.trim() === subQ.answer) {
            subScore += perSubQMark;
          }
        });

        marksAwarded = subScore;
        if (subScore === subMax) isCorrect = true;
      }

      totalScore += marksAwarded;

      return {
        questionId: q._id,
        answer: userAnswer,
        isCorrect,
        marksAwarded
      };
    });

    const submission = await TestSubmission.create({
      form: formId,
      user: req.user._id,
      answers: evaluatedAnswers,
      score: totalScore,
      maxScore
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        testsGiven: {
          form: formId,
          heading: form.title,
          score: totalScore,
          maxScore,
          submittedAt: new Date()
        }
      }
    });

    res.status(201).json({
      message: "Test submitted successfully",
      score: totalScore,
      maxScore,
      submission
    });

  } catch (err) {
    console.error("Error submitting test:", err);
    res.status(500).json({ error: err.message });
  }
};
