import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Form.questions" },
  answer: mongoose.Schema.Types.Mixed, 
  isCorrect: { type: Boolean, default: false },
  marksAwarded: { type: Number, default: 0 }
});

const TestSubmissionSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  answers: [AnswerSchema],
  totalScore: { type: Number, default: 0 },
  maxScore: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
});

TestSubmissionSchema.pre("save", function (next) {
  if (this.answers && this.answers.length) {
    this.totalScore = this.answers.reduce((sum, ans) => sum + (ans.marksAwarded || 0), 0);
  }
  next();
});

export default mongoose.model("TestSubmission", TestSubmissionSchema);
