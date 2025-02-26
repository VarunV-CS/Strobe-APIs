const express = require("express");
const http = require("http");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Productiondb_url } = require("./config/production");
const { Developmentdb_url, isProd } = require("./config/development");
const userRouter = require("./routes/userRoutes");
const CandidatesRouter = require("./routes/candidatesRoutes");
const ActivityRouter = require("./routes/activityRoutes");
const EmployeeRouter = require("./routes/EmployeeRoutes");
const candidates = require("./models/candidates");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

app.use(cors());
const portsTwo = 80;

const port = 5000;
app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log("HTTP Method - " + req.method + ", URL -" + req.url);
  next();
});

app.use("/users", userRouter);
app.use("/candidates", CandidatesRouter);
app.use("/activity", ActivityRouter);
app.use("/employee", EmployeeRouter);

const db_url =
  process.env.NODE_ENV === "production" ? Productiondb_url : Developmentdb_url;

mongoose
  .connect(db_url, {
    dbName: "CestaIntra",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongoose is now connected at:", db_url);
  })
  .catch((err) => {
    console.log("DB error:", err.message);
  });

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
      user: 'teamcesta1@gmail.com',
      pass: 'oujt xjla ykgl xhuv'
  },
});

const sendMail = async (candidates) => {
  const mailOptions = {
    from: "teamcesta1@gmail.com", // Sender address
    to: "moipone.raphahlelo@cestasoft.com", // Recipient email address
    cc: 'muofhe.mudau@cestasoft.com',
    subject: " Candidates Created Before  30 Days",
    text: `The following candidates were created in the before 30 days:\n${candidates.map(
      (candidate) => `- ${candidate.name} ${candidate.surName}, Created on: ${candidate.createdAt}`
    ).join("\n")}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};




cron.schedule("0 0 * * *", async () => {
  console.log("Running candidate check every 5 minutes");
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const recentCandidates = await candidates.find({ createdAt: { $lte: thirtyDaysAgo } });
    if (recentCandidates.length > 0) {
      console.log("Found candidates created within the last 30 days:", recentCandidates);
      sendMail(recentCandidates);
    } else {
      console.log("No candidates created in the last 30 days.");
    }
  } catch (error) {
    console.error("Error fetching candidates:", error);
  }
});


const httpServer = http.createServer(app);

httpServer.listen(portsTwo, () => {
  console.log(`Now listening on port ${portsTwo}`);
});


// const express = require("express");
// const http = require("http");
// const app = express();
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const { Productiondb_url } = require("./config/production");
// const { Developmentdb_url, isProd } = require("./config/development");
// const userRouter = require("./routes/userRoutes");
// const CandidatesRouter = require("./routes/candidatesRoutes");
// const ActivityRouter = require("./routes/activityRoutes");
// const EmployeeRouter = require("./routes/EmployeeRoutes");
// app.use(cors());
// const portsTwo = 80;

// const port = 5000;
// app.use(express.json());
// app.use(bodyParser.json());

// app.use((req, res, next) => {
//   console.log("HTTP Method - " + req.method + ", URL -" + req.url);
//   next();
// });

// app.use("/users", userRouter);
// app.use("/candidates", CandidatesRouter);
// app.use("/activity", ActivityRouter);
// app.use("/employee", EmployeeRouter);

// const db_url =
//   process.env.NODE_ENV === "production" ? Productiondb_url : Developmentdb_url;

// mongoose
//   .connect(db_url, {
//     dbName: "CestaIntra",
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Mongoose is now connected at:", db_url);
//   })
//   .catch((err) => {
//     console.log("DB error:", err.message);
//   });

// // app.listen(port, () => {
// //   console.log(`Now listening on port ${port}`);
// // });
// const httpServer = http.createServer(app);

// httpServer.listen(portsTwo, () => {
//   console.log(`Now listening on port ${portsTwo}`);
// });
