import mongoose from 'mongoose';
import Form from '../models/form.model.js';
import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js';

export const createFullForm = async (req, res) => {
  try {
    let { title, description, questions } = req.body;

    if (typeof questions === 'string') {
      questions = JSON.parse(questions);
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions array is required" });
    }

    for (let i = 0; i < questions.length; i++) {
      let file;
      if (Array.isArray(req.files)) {
        file = req.files.find(f => f.fieldname === `image_${i}`);
      } else if (req.files && req.files[`image_${i}`]) {
        file = req.files[`image_${i}`][0];
      }
      if (file) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });

        questions[i].image = uploadResult?.secure_url || "";
      } else {
        questions[i].image = ""; // ensure it's always a string
      }
    }

    // Create new form
    const newForm = new Form({
      title,
      description,
      questions
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { formsCreated: { form: newForm._id, heading: title } }
    });



    await newForm.save();
    res.status(201).json(newForm);

  } catch (err) {
    console.error("Error creating form:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getFullForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.status(200).json(form);
  } catch (err) {
    console.error("Error fetching form:", err);
    res.status(500).json({ error: err.message });
  }
};

export const testForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).lean(); 
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const sanitizedQuestions = form.questions.map((q) => {
      const cleanQ = { ...q };

      if (cleanQ.type === "categorise" && cleanQ.options) {
        cleanQ.options = cleanQ.options.map(({ text }) => ({ text }));
      }

      if (cleanQ.type === "cloze" && cleanQ.cloze) {
        cleanQ.cloze = {
          options: cleanQ.cloze.options,
        };
      }

      if (cleanQ.type === "comprehension" && cleanQ.comprehension) {
        cleanQ.comprehension = {
          paragraph: cleanQ.comprehension.paragraph,
          questions: cleanQ.comprehension.questions.map((cq) => ({
            q: cq.q,
            type: cq.type,
            options: cq.options || []
          }))
        };
      }

      return cleanQ;
    });

    res.status(200).json({
      _id: form._id,
      title: form.title,
      description: form.description,
      createdAt: form.createdAt,
      questions: sanitizedQuestions
    });

  } catch (err) {
    console.error("Error fetching form:", err);
    res.status(500).json({ error: err.message });
  }
};



export const deleteForm = async (req, res) => {
  try {
    const formId = new mongoose.Types.ObjectId(req.params.id);

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    await Form.findByIdAndDelete(formId);

    await User.updateMany(
      {},
      { $pull: { formsCreated: { form: formId } } }
    );

    res.status(200).json({ message: "Form deleted successfully" });
  } catch (err) {
    console.error("Error deleting form:", err);
    res.status(500).json({ error: err.message });
  }
};
