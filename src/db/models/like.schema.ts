import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patternId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pattern',
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model('Like', likeSchema);
