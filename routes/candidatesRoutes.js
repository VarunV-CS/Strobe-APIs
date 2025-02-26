const express = require("express");
const CandidatesRouter = express.Router();
const { upload } = require("../middleware/upload");
const {
  createCandidates,
  bulkUploadCandidates,
  getCandidates,
  getCandidatesById,
  updateCandidates,
  getCandidatesTable,
  getCandidatesStatusCount,
  getCandidatesRoleCount,
  uploadDocument,
  deleteCandidate,
  updateCandidates1,
  createCandidates1,
  getCandidates1
} = require("../controllers/candidatesController");
const authMiddleware = require("../middleware/auth");

CandidatesRouter.post("/create", upload, createCandidates1);
CandidatesRouter.post("/create1", upload, createCandidates1);

CandidatesRouter.post("/bulkUpload", bulkUploadCandidates);

CandidatesRouter.get("/get", getCandidates);
CandidatesRouter.get("/get1", getCandidates1);

CandidatesRouter.get("/getTable", getCandidatesTable);

CandidatesRouter.get("/getById/:id", getCandidatesById);

CandidatesRouter.patch("/update/:_id", updateCandidates);
CandidatesRouter.patch("/update1/:_id", updateCandidates1);

CandidatesRouter.get("/getStatusCount", getCandidatesStatusCount);

CandidatesRouter.get("/getRoleCount", getCandidatesRoleCount);

CandidatesRouter.patch("/updateDoc/:_id", upload, uploadDocument);


CandidatesRouter.delete("/deleteById/:id", deleteCandidate );

module.exports = CandidatesRouter;
