import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  text: String,
  correctCategory: String,
});

const ClozeSchema = new mongoose.Schema({
  options: [String],
  answer: String,
});

const ComprehensionQuestionSchema = new mongoose.Schema({
  q: String,
  type: { type: String, enum: ['mcq', 'short_answer'], default: 'mcq' },
  options: [String],
  answer: String,
});

const ComprehensionSchema = new mongoose.Schema({
  paragraph: String,
  questions: [ComprehensionQuestionSchema],
});

const QuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['categorise', 'cloze', 'comprehension'],
    required: true,
  },
  question: String,
  image: String, 
  categories: [String], 
  options: [OptionSchema],
  cloze: ClozeSchema,
  comprehension: ComprehensionSchema,
  marks: { type: Number, default: 1 } 
});

const FormSchema = new mongoose.Schema({
  title: String,
  description: String,
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now },
});

const Form = mongoose.model("Form", FormSchema);
export default Form;
