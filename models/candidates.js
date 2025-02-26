const mongoose = require("mongoose");

const candidatesSchema = new mongoose.Schema(
  {
    candidateID: {
      type: Number,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    surName: {
      type: String,
      default: "",
    },
    contactNo: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    noticePeriod: {
      type: String,
      default: "",
    },
    currentRole: {
      type: String,
      default: "",
    },
    currentCTC: {
      type: String,
      default: "",
    },
    expectedCTC: {
      type: String,
      default: "",
    },
    relocate: {
      type: String,
      default: "",
    },
    workingModel: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
    screeningNotes: {
      type: String,
    },
    screeningOutcome: {
      type: String,
    },
    internalInterviewNotes: {
      type: String,
    },
    internalRAG: {
      type: String,
      default: "",
    },
    clientFeedback: {
      type: String,
    },
    lastComms: {
      type: Array,
    },
    experience: {
      type: String,
      default: "",
    },
    alternateContactNo: {
      type: String,
      default: "",
    },
    currentLocation: {
      type: String,
      default: "",
    },
    screenedBy: {
      type: String,
      default: "",
    },
    expectedRole: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "",
    },
    paymentType: {
      type: String,
      default: "",
    },
    interviewer: {
      type: String,
    },
    clientsInterviewDate: {
      type: Date,
      default: "",
    },
    createdBy: {
      type: String,
      default: "",
    },
    resume: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const candidates = mongoose.model("candidates", candidatesSchema);

module.exports = candidates;
