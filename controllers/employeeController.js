const employees = require("../models/employee");
const mongoose = require("mongoose");

const { generateAndUploadDocument } = require("../middleware/upload1");
const{generateAndindependentUploadDocument} =  require("../middleware/upload2");
const fs = require("fs");

const createEmployee = async (req, res) => {
  try {
    const {
        contractType,
        name,
        idNumber,
        address,
        jobTitle,
        cDate,
        remuniration  ,
       sigAuth,
        country,
       endDate,
        contract,
        registrationNumber,
        postalAddress,
        telNumber,
        cellNumber,
        servicesDel,
        email,
        entityName,
    } = req.body;
    
    

    const newEmployees = new employees({
        contractType,
        name,
        idNumber,
        address,
        jobTitle,
        cDate,
        remuniration   ,
       sigAuth,
        country,
        endDate,
        contract,
    registrationNumber,
    postalAddress,
    telNumber,
    cellNumber,
    servicesDel,
    email,
    entityName,
    });

       const savedEmployees = await newEmployees.save();
  
    
    res.status(201).json({
      success: true,

      message: "Employees created successfully",

      data: savedEmployees,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Failed to create savedEmployees",

      error: error.message,
    });
  }
};

const getEmployee = async (req, res) => {
  try {
    const EmployeesData = await employees.find();

    const Employees = EmployeesData.map((item) => {
      
      const startDate = new Date(item.cDate);
      const endDate = new Date(item.endDate);

      const differenceInMilliseconds = endDate - startDate;

     
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const totalDays = differenceInMilliseconds / millisecondsPerDay;

      
      const totalDaysInYear = 365.25;
      const years = Math.floor(totalDays / totalDaysInYear);
      const days = Math.floor(totalDays % totalDaysInYear);

      const periods = `${years} years and ${days} days`;

      return {
        id:item._id,
        contractType: item.contractType,
        name: item.name,
        idNumber: item.idNumber,
        address: item.address,
        jobTitle: item.jobTitle,
        cDate: item.cDate,
        remuniration: item.remuniration,
        sigAuth: item.sigAuth,
        country: item.country,
        endDate: item.endDate,
        contract: item.contract,
        periods: periods,
      };
    });

    res.status(200).json({
      success: true,
      message: "Employees retrieved successfully",
      data: Employees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to get Employees",
      error: error.message,
    });
  }
};



const getEmployeeById = async (req, res) => {
  try {
    const Employees = await employees.findById(req.params.id);

    if (!Employees) {
      return res
        .status(404)
        .json({ success: false, message: "Employees not found" });
    }

    res.status(200).json({
      success: true,
      message: "Employees retrieved successfully",
      data: Employees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to get Employees",
      error: error.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const updates = req.body;
    console.log(">>>>>>>>>>>", req.body);

    
      
      const updatedEmployees = await employees.updateOne(
        { _id: req.params._id },
        {
          $set: updates,
        }
      );
      res.status(200).json({
        success: true,
        message: "Employees updated successfully",
        data: updatedEmployees,
      });
    }
   catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update Employees",
      error: error.message,
    });
  }
};







const uploadDocument = async (req, res) => {
  try {
    const obj = req.body;

    console.log("!!!!!!!!!!!!!!!!11",obj)

    const driveResponses = await generateAndUploadDocument(obj);

    console.log("************", driveResponses);

  

    res.status(200).json({
      success: true,

      message: "Candidates documents upload successfully",

      data: driveResponses,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Failed to upload documents",

      error: error.message,
    });
  }
};


const uploadindependentDocument = async (req, res) => {
  try {
    const obj = req.body;

    console.log("!!!!!!!!!!!!!!!!11",obj)

    const driveResponses = await generateAndindependentUploadDocument(obj);

    console.log("************", driveResponses);

  

    res.status(200).json({
      success: true,

      message: "Candidates documents upload successfully",

      data: driveResponses,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Failed to upload documents",

      error: error.message,
    });
  }
};


module.exports = {
    createEmployee,
  
    getEmployee,
    getEmployeeById,
    updateEmployee,
 
  uploadDocument,
  uploadindependentDocument,
  
};
