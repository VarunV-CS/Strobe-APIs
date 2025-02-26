const candidates = require("../models/candidates");
const mongoose = require("mongoose");

const { uploadFileToS3 } = require("../middleware/upload");

const fs = require("fs");

const createCandidates = async (req, res) => {
  try {
    const {
      name,

      lastName,

      contactNo,

      email,

      noticePeriod,

      currentRole,

      currentCTC,

      expectedCTC,

      relocate,

      workingModel,

      status,

      screeningNotes,

      screeningOutcome,

      internalInterviewNotes,

      internalRAG,

      clientFeedback,

      lastComms,

      experience,

      alternateContactNo,

      currentLocation,

      screenedBy,

      expectedRole,

      currency,

      paymentType,

      interviewer,

      clientsInterviewDate,

      createdBy,
      surName,
    } = req.body;
    if(req.body.screeningNotes !== '' ){
      screeningNotesData={
        Notes: screeningNotes,
        createdBy: createdBy,
      };
    } 

    const candidateID = Math.floor(Math.random() * 100000);

    const newCandidates = new candidates({
      candidateID,

      name,

      lastName,

      contactNo,

      email,

      noticePeriod,

      currentRole,

      currentCTC,

      expectedCTC,

      relocate,

      workingModel,

      status,

      screeningNotes: screeningNotesData,

      screeningOutcome,

      internalInterviewNotes,

      internalRAG,

      clientFeedback,

      lastComms,

      experience,

      alternateContactNo,

      currentLocation,

      screenedBy,

      expectedRole,

      currency,

      paymentType,

      interviewer,

      clientsInterviewDate,

      createdBy,
      surName,
    });

       const savedCandidates = await newCandidates.save();
    if (req.files) {
      const files = req.files; // Access the uploaded files from req.files

      console.log("##############", files);

      const driveResponses = await uploadFileToS3(files, savedCandidates._id);

      const uploadedFileURLs = driveResponses.map((response) => response.viewLink);

      console.log("************", driveResponses);

      savedCandidates.resume = uploadedFileURLs; 

      await savedCandidates.save();
    }
    await savedCandidates.save();

    res.status(201).json({
      success: true,

      message: "Candidates created successfully",

      data: savedCandidates,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Failed to create Candidates",

      error: error.message,
    });
  }
};

const getCandidates = async (req, res) => {
  try {
    const CandidatesData = await candidates.find();
    const Candidates = CandidatesData.map((item) => ({
      FirstName: item.name,
      LastName: item.surName,
      ContactNumber: item.contactNo,
      AlternateContactNumber: item.alternateContactNo,
      Experience: item.experience,
      NoticePeriod: item.noticePeriod,
      CandidateEmailAddress: item.email,
      CurrentLocation: item.currentLocation,
      ScreenedBy: item.screenedBy,
      WorkingModel: item.workingModel,
      CurrentRole: item.currentRole,
      ExpectedRole: item.expectedRole,
      WillingToRelocate: item.relocate,
      Currency: item.currency,
      CurrentCTC: item.currentCTC,
      ExpectedCTC: item.expectedCTC,
      PaymentModel: item.paymentType,
      Interviewer: item.interviewer,
      Status: item.status,
      ScreeningNotes: item.screeningNotes,
      ScreeningOutcome: item.screeningOutcome,
      InternalInterviewNotes: item.internalInterviewNotes,
      InternalRAG: item.internalRAG,
      ClientsInterviewDate: item.clientsInterviewDate,
      ClientsFeedback: item.clientFeedback,
      LastComms: item.lastComms,
    }));

    res.status(200).json({
      success: true,
      message: "Candidates retrieved successfully",
      data: Candidates,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to get Candidates",
      error: error.message,
    });
  }
};

const getCandidatesTable = async (req, res) => {
  try {
    const CandidatesData = await candidates.find();

    // console.log("CCCCCCCCCCCCCCC", CandidatesData);

    const Candidates = CandidatesData.map((item) => ({
      Name: item.name + " " + item.surName,

      createdAt: item.createdAt,

      currentRole: item.currentRole,

      currency: item.currency,

      expectedCTC: item.expectedCTC,

      paymentType: item.paymentType,

      status: item.status,

      clientsInterviewDate: item.clientsInterviewDate,

      internalRAG: item.internalRAG,

      _id: item._id,
      email: item.email,
    }));

    res.status(200).json({
      success: true,

      message: "Candidates retrieved successfully",

      data: Candidates,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Failed to get Candidates",

      error: error.message,
    });
  }
};

const getCandidatesById = async (req, res) => {
  try {
    const Candidates = await candidates.findById(req.params.id);

    if (!Candidates) {
      return res
        .status(404)
        .json({ success: false, message: "Candidates not found" });
    }

    res.status(200).json({
      success: true,
      message: "Candidates retrieved successfully",
      data: Candidates,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to get Candidates",
      error: error.message,
    });
  }
};

const updateCandidates = async (req, res) => {
  try {
    const updates = req.body;
    console.log(">>>>>>>>>>>", req.body);

    const screeningNotes = req.body.screeningNotes;
    const internalInterviewNotes = req.body.internalInterviewNotes;

    // Delete screeningNotes and internalInterviewNotes from updates to avoid duplication
    delete updates.screeningNotes;
    delete updates.internalInterviewNotes;

    if (screeningNotes && internalInterviewNotes) {
      // Both screeningNotes and internalInterviewNotes are present
      console.log("Both screeningNotes and internalInterviewNotes are present");
      const screeningData = {
        Notes: screeningNotes,
        createdBy: updates.createdBy,
      };
      const updatedCandidates = await candidates.updateOne(
        { _id: req.params._id },
        {
          $set: updates,
          $push: {
            screeningNotes: screeningData,
            internalInterviewNotes: internalInterviewNotes,
          },
        }
      );
      res.status(200).json({
        success: true,
        message: "Candidates updated successfully",
        data: updatedCandidates,
      });
    } else if (screeningNotes) {
      // Only screeningNotes is present
      console.log("Only screeningNotes is present");
      const screeningData = {
        Notes: screeningNotes,
        createdBy: updates.createdBy,
      };
      const updatedCandidates = await candidates.updateOne(
        { _id: req.params._id },
        {
          $set: updates,
          $push: {
            screeningNotes: screeningData,
          },
        }
      );
      res.status(200).json({
        success: true,
        message: "Candidates updated successfully",
        data: updatedCandidates,
      });
    } else if (internalInterviewNotes) {
      // Only internalInterviewNotes is present
      console.log("Only internalInterviewNotes is present");
      const updatedCandidates = await candidates.updateOne(
        { _id: req.params._id },
        {
          $set: updates,
          $push: {
            internalInterviewNotes: internalInterviewNotes,
          },
        }
      );
      res.status(200).json({
        success: true,
        message: "Candidates updated successfully",
        data: updatedCandidates,
      });
    } else {
      // Neither screeningNotes nor internalInterviewNotes are present
      console.log("Neither screeningNotes nor internalInterviewNotes are present");
      const updatedCandidates = await candidates.updateOne(
        { _id: req.params._id },
        {
          $set: updates,
        }
      );
      res.status(200).json({
        success: true,
        message: "Candidates updated successfully",
        data: updatedCandidates,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update Candidates",
      error: error.message,
    });
  }
};


const bulkUploadCandidates = async (req, res) => {
  try {
    const candidatesDataArray = req.body;

    const candidatesToCreate = candidatesDataArray.map((candidatesData) => {
      const {
        FirstName,
        LastName,
        ContactNumber,
        AlternateContactNumber,
        Experience,
        NoticePeriod,
        CandidateEmailAddress,
        CurrentLocation,
        ScreenedBy,
        WorkingModel,
        CurrentRole,
        ExpectedRole,
        WillingToRelocate,
        Currency,
        CurrentCTC,
        ExpectedCTC,
        PaymentModel,
        Interviewer,
        Status,
        ScreeningNotes,
        ScreeningOutcome,
        InternalInterviewNotes,
        InternalRAG,
        ClientsInterviewDate,
        ClientsFeedback,
        LastComms,
      } = candidatesData;

      const modifiedData = {
        name: FirstName,
        surName: LastName,
        contactNo: ContactNumber,
        alternateContactNo: AlternateContactNumber,
        experience: Experience,
        noticePeriod: NoticePeriod,
        email: CandidateEmailAddress,
        currentLocation: CurrentLocation,
        screenedBy: ScreenedBy,
        workingModel: WorkingModel,
        currentRole: CurrentRole,
        expectedRole: ExpectedRole,
        relocate: WillingToRelocate,
        currency: Currency,
        currentCTC: CurrentCTC,
        expectedCTC: ExpectedCTC,
        paymentType: PaymentModel,
        interviewer: Interviewer,
        status: Status,
        screeningNotes: ScreeningNotes,
        screeningOutcome: ScreeningOutcome,
        internalInterviewNotes: InternalInterviewNotes,
        internalRAG: InternalRAG,
        clientsInterviewDate: ClientsInterviewDate,
        clientFeedback: ClientsFeedback,
        lastComms: LastComms,
      };

      return new candidates(modifiedData);
    });

    const savedCandidates = await candidates.create(candidatesToCreate);

    res.status(201).json({
      success: true,
      message: "Candidates bulk upload successfully created",
      data: savedCandidates,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create bulk upload",
      error: error.message,
    });
  }
};

const getCandidatesStatusCount = async (req, res) => {
  try {
    const allCandidatesCount = await candidates.countDocuments({});

    const shortlistedCandidatesCount = await candidates.countDocuments({
      status: "Shortlisted",
    });

    const rejectedCandidatesCount = await candidates.countDocuments({
      status: "Reject",
    });

    res.status(200).json({
      success: true,

      message: "Candidates count retrieved successfully",

      allCandidates: allCandidatesCount,

      shortlistedCandidates: shortlistedCandidatesCount,

      rejectedCandidatesCount: rejectedCandidatesCount,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Failed to get Candidates count",

      error: error.message,
    });
  }
};

const getCandidatesRoleCount = async (req, res) => {
  try {
    const allCandidatesCount = await candidates.countDocuments({});

    const testerCandidatesCount = await candidates.countDocuments({
      currentRole: "Tester",
    });

    const developerCandidatesCount = await candidates.countDocuments({
      currentRole: "developer",
    });

    res.status(200).json({
      success: true,

      message: "Candidates count retrieved successfully",

      allCandidates: allCandidatesCount,

      testerCandidatesCount: testerCandidatesCount,

      developerCandidatesCount: developerCandidatesCount,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Failed to get Candidates count",

      error: error.message,
    });
  }
};

const uploadDocument = async (req, res) => {
  try {
    const files = req.files;

    console.log("&&&&&&&&&&&&&&&&&", files);

    const driveResponses = await uploadFileToS3(files, req.params._id);

    console.log("************", driveResponses);

    const updatedCandidates = await candidates.updateOne(
      { _id: req.params._id },

      {
        $push: {
          resume: {
            $each: driveResponses.map((response) => response.viewLink),
          },
        },
      }
    );

    res.status(200).json({
      success: true,

      message: "Candidates documents updated successfully",

      data: updatedCandidates,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Failed to update documents",

      error: error.message,
    });
  }
};
const updateCandidates1 = async (req, res) => {
  try {
    const updates = req.body;
    console.log("Received update request:", updates);

    const updateQuery = { $set: { ...updates } };

    // 🛠️ Ensure lastComms is properly structured before updating
    if (updates.lastComms) {
      console.log("Updating lastComms...");

      const formattedLastComms = updates.lastComms.map((comm) => ({
        message: typeof comm.message === "string" ? comm.message : "",
        createdBy: comm.createdBy || "Unknown",
        timeStamp: comm.timeStamp || new Date().toISOString(),
      }));

      updateQuery.$set.lastComms = formattedLastComms; // ✅ Replace instead of pushing
    }

    const updatedCandidates = await candidates.updateOne(
      { _id: req.params._id },
      updateQuery
    );

    res.status(200).json({
      success: true,
      message: "Candidate updated successfully",
      data: updatedCandidates,
    });
  } catch (error) {
    console.error("Error updating candidate:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update candidate",
      error: error.message,
    });
  }
};

const createCandidates1 = async (req, res) => {
  try {
    const {
      name,

      lastName,

      contactNo,

      email,

      noticePeriod,

      currentRole,

      currentCTC,

      expectedCTC,

      relocate,

      workingModel,

      status,

      screeningNotes,

      screeningOutcome,

      internalInterviewNotes,

      internalRAG,

      clientFeedback,

      lastComms,

      experience,

      alternateContactNo,

      currentLocation,

      screenedBy,

      expectedRole,

      currency,

      paymentType,

      interviewer,

      clientsInterviewDate,

      createdBy,
      surName,
    } = req.body;
    if(req.body.lastComms !== '' ){
      lastComms={
        lastComms: lastComms,
        createdBy: createdBy,
        timeStamp: new Date(),
      };
    } 

    const candidateID = Math.floor(Math.random() * 100000);

    const newCandidates = new candidates({
      candidateID,

      name,

      lastName,

      contactNo,

      email,

      noticePeriod,

      currentRole,

      currentCTC,

      expectedCTC,

      relocate,

      workingModel,

      status,

      screeningNotes,

      screeningOutcome,

      internalInterviewNotes,

      internalRAG,

      clientFeedback,

      lastComms : lastComms ,

      experience,

      alternateContactNo,

      currentLocation,

      screenedBy,

      expectedRole,

      currency,

      paymentType,

      interviewer,

      clientsInterviewDate,

      createdBy,
      surName,
    });

       const savedCandidates = await newCandidates.save();
    if (req.files) {
      const files = req.files; // Access the uploaded files from req.files

      console.log("##############", files);

      const driveResponses = await uploadFileToS3(files, savedCandidates._id);

      const uploadedFileURLs = driveResponses.map((response) => response.viewLink);

      console.log("************", driveResponses);

      savedCandidates.resume = uploadedFileURLs; 

      await savedCandidates.save();
    }
    await savedCandidates.save();

    res.status(201).json({
      success: true,

      message: "Candidates created successfully",

      data: savedCandidates,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Failed to create Candidates",

      error: error.message,
    });
  }
};

const getCandidates1 = async (req, res) => {
  try {
    const CandidatesData = await candidates.find();
    // const Candidates = CandidatesData.map((item) => ({
    //   FirstName: item.name,
    //   LastName: item.surName,
    //   ContactNumber: item.contactNo,
    //   AlternateContactNumber: item.alternateContactNo,
    //   Experience: item.experience,
    //   NoticePeriod: item.noticePeriod,
    //   CandidateEmailAddress: item.email,
    //   CurrentLocation: item.currentLocation,
    //   ScreenedBy: item.screenedBy,
    //   WorkingModel: item.workingModel,
    //   CurrentRole: item.currentRole,
    //   ExpectedRole: item.expectedRole,
    //   WillingToRelocate: item.relocate,
    //   Currency: item.currency,
    //   CurrentCTC: item.currentCTC,
    //   ExpectedCTC: item.expectedCTC,
    //   PaymentModel: item.paymentType,
    //   Interviewer: item.interviewer,
    //   Status: item.status,
    //   ScreeningNotes: item.screeningNotes,
    //   ScreeningOutcome: item.screeningOutcome,
    //   InternalInterviewNotes: item.internalInterviewNotes,
    //   InternalRAG: item.internalRAG,
    //   ClientsInterviewDate: item.clientsInterviewDate,
    //   ClientsFeedback: item.clientFeedback,
    //   LastComms: item.lastComms,
    // }));

    res.status(200).json({
      success: true,
      message: "Candidates retrieved successfully",
      data: CandidatesData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to get Candidates",
      error: error.message,
    });
  }
};

const deleteCandidate= async (req, res) => {
  const { id } = req.params;

  try {
    const Candidates = await candidates.findByIdAndRemove(id);

    if (!Candidates) {
      return res.status(404).json({ success: false, message: 'candidates not found' });
    }

    res.status(200).json({ success: true, message: 'candidates deleted successfully', data: Candidates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete candidates', error: error.message });
  }
};



module.exports = {
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
};
