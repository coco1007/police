import mongoose from 'mongoose';

const examRecordSchema = new mongoose.Schema({
  examId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  answers: {
    type: Map,
    of: String,
    required: true,
  },
  submissionReason: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  idNumber: {
    type: String,
    required: true,
  },
});

export default mongoose.models.ExamRecord || mongoose.model('ExamRecord', examRecordSchema); 