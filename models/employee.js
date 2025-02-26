const mongoose = require("mongoose");

const employeesSchema = new mongoose.Schema(
  {
 
    name: {
      type: String,
      default: "",
    },
    contractType: {
      type: String,
      default: "",
    },
    idNumber: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    jobTitle: {
      type: String,
      default: "",
    },
    cDate: {
      type: Date,
      default: "",
    },
    remuniration: {
      type: String,
      default: "",
    },
    sigAuth: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    endDate: {
      type: Date,
      default: "",
    },
    contract: {
      type: String,
      default: "",
    },
    servicesDel: {
      type: String,
      default: "",
    },
    registrationNumber: {
      type: String,
      default: "",
    },
    postalAddress: {
      type: String,
      default: "",
    },
    telNumber: {
      type: String,
      default: "",
    },
    cellNumber: {
      type: String,
      default: "",
    },
    servicesDel: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    entityName: {
      type: String,
      default: "",
    },
   
  },
  {
    timestamps: true,
  }
);

const employees = mongoose.model("employees", employeesSchema);

module.exports = employees;
