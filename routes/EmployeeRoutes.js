const express = require("express");
const EmployeeRouter = express.Router();
const { upload } = require("../middleware/upload");
const {
  createEmployee,
  
  getEmployee,
  getEmployeeById,
  updateEmployee,
  
  uploadDocument,
  uploadindependentDocument,
} = require("../controllers/employeeController");
const authMiddleware = require("../middleware/auth");

EmployeeRouter.post("/create", authMiddleware, createEmployee);


EmployeeRouter.get("/get", authMiddleware, getEmployee);



EmployeeRouter.get("/getById/:id", authMiddleware, getEmployeeById);

EmployeeRouter.patch("/update/:_id", authMiddleware, updateEmployee);

EmployeeRouter.post("/updateDoc", uploadDocument);

EmployeeRouter.post("/uploadindependentDocument", uploadindependentDocument);


module.exports = EmployeeRouter;
