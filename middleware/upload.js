const AWS = require("aws-sdk");

const multer = require("multer");

const upload = multer({
  fileFilter: (req, file, cb) => {
    // Accept only PDF and DOC files
    const allowedMimeTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]; // Add more types if needed
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOC files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB size limit
  },
}).array("files"); // Update multer to accept multiple files with the name 'files'

const spacesEndpoint = new AWS.Endpoint("https://nyc3.digitaloceanspaces.com");

const s3 = new AWS.S3({
  endpoint: spacesEndpoint,

  accessKeyId: "DO00ZXMDVE2PJR73VHEG",

  secretAccessKey: "63GUWpOPubBA20tJ4Ym+RUrB/iak5ovlnoYhe+EfOxQ",
});

const uploadFileToS3 = (files, id) => {
  console.log("+++++++++", files);

  const uploadPromises = files.map((file) => {
    const fileContent = file.buffer;

    const fileName = file.originalname + id;

    const params = {
      Bucket: "simuka",

      Key: fileName,

      Body: fileContent,

      ACL: "public-read",

      ContentType: file.mimetype, // Set the ContentType to preserve the original file type
    };

    return s3.upload(params).promise();
  });

  return Promise.all(uploadPromises)

    .then((responses) => {
      const links = responses.map((response) => {
        const viewLink = response.Location; // View link for direct view in browser

        console.log("$$$$$$$", viewLink);

        const downloadLink = `${
          response.Location
        }?response-content-disposition=attachment;filename=${encodeURIComponent(
          response.Key
        )}`; // Download link with specified filename

        return { viewLink, downloadLink };
      });

      return links;
    })

    .catch((error) => {
      throw error;
    });
};

module.exports = { upload, uploadFileToS3 };
