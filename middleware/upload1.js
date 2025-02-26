const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const AWS = require('aws-sdk');
const fs = require("fs");
const path = require("path");
const axios = require('axios');

const spacesEndpoint = new AWS.Endpoint('https://nyc3.digitaloceanspaces.com');
AWS.config.update({
    accessKeyId: 'DO00ZXMDVE2PJR73VHEG',
    secretAccessKey: '63GUWpOPubBA20tJ4Ym+RUrB/iak5ovlnoYhe+EfOxQ'
});

const s3 = new AWS.S3({
    endpoint: spacesEndpoint
});

function generateDocx(Name, starteEndDate, Identity, Address, JobTitle, commencementDate, ID, perHour,authorityName,authorityRole,authorityPhone,contractType) {
   if(contractType == 'Hourly')
    {
        const content = fs.readFileSync(
        path.resolve(__dirname, "Cetsasoft FTE Contract Hourly.docx"),
        "binary"
    );
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    doc.render({
        Name: Name,
        Identity: Identity,
        Address: Address,
        JobTitle: JobTitle,
        commencementDate: commencementDate,
        starteEndDate: starteEndDate,
        ID: ID,
        perHour: perHour,
        authorityName:authorityName,
        authorityRole:authorityRole,
        authorityPhone:authorityPhone,
    });

    const buf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
    });
    
    return buf;
}
    else{
        const content = fs.readFileSync(
            path.resolve(__dirname, "Cetsasoft FTE Contract Monthly.docx"),
            "binary"
        );
        const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    doc.render({
        Name: Name,
        Identity: Identity,
        Address: Address,
        JobTitle: JobTitle,
        commencementDate: commencementDate,
        starteEndDate: starteEndDate,
        ID: ID,
        perHour: perHour,
        authorityName:authorityName,
        authorityRole:authorityRole,
        authorityPhone:authorityPhone,
    });

    const buf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
    });
    
    return buf;
    }

    
}

async function uploadBufferToSpaces(buffer, fileName) {
    const params = {
        Bucket: 'simuka',
        Key: fileName,
        Body: buffer,
        ACL: "public-read",
        ContentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };

    try {
        const data = await s3.upload(params).promise();
        console.log("File uploaded successfully. Spaces URL:", data.Location);
        return data.Location;
    } catch (error) {
        console.error("Error uploading file to Spaces:", error);
        throw error;
    }
}

async function uploadPdfBufferToSpaces(buffer, fileName) {
    const params = {
        Bucket: 'simuka',
        Key: fileName,
        Body: buffer,
        ACL: "public-read",
        ContentType: 'application/pdf'
    };

    try {
        const data = await s3.upload(params).promise();
        console.log("PDF uploaded successfully. Spaces URL:", data.Location);
        return data.Location;
    } catch (error) {
        console.error("Error uploading PDF to Spaces:", error);
        throw error;
    }
}

async function convertDocxToPdf(docURL, outputFileName) {
    const apiURL = 'https://api.apyhub.com/convert/word-url/pdf-url';
    const requestData = {
        url: docURL 
    };
    const options = {
        method: 'POST',
        url: apiURL,
        params: { output: `${outputFileName}.pdf`, landscape: 'false' },
        headers: {
            'apy-token': 'APY0FfgOkC8i67uTf35wpdCsoHiCbblfQ6XDsQENjcRId3cdcVhtKiF1FP6MwHCZFRA', 
            'Content-Type': 'application/json'
        },
        data: requestData
    };

    try {
        const response = await axios.request(options);
        console.log("PDF conversion successful! Here's the PDF URL:", response.data);
        return response.data; 
    } catch (error) {
        console.error("An error occurred during the conversion:", error.message);
        throw error; 
    }
}

const generateAndUploadDocument = async (documentData) => {
    const { Name, starteEndDate, Identity, Address, JobTitle, commencementDate, ID, perHour ,authorityName,authorityRole,authorityPhone,contractType} = documentData;
  
    console.log("##################", JobTitle, commencementDate);
    
    // Step 1: Generate the DOCX file buffer
    const buffer = generateDocx(Name, starteEndDate, Identity, Address, JobTitle, commencementDate, ID, perHour,authorityName,authorityRole,authorityPhone,contractType);
    const date = new Date();
    const fileName = `${date}${Name}.docx`;
    console.log("@@@@@@@@@@@@@@@@@@", fileName);
    
    // Step 2: Upload DOCX file to Spaces
    const docxUrl = await uploadBufferToSpaces(buffer, fileName);
    
    // Step 3: Convert DOCX to PDF
    const pdfData = await convertDocxToPdf(docxUrl, fileName);
    
    // Step 4: Fetch the PDF file from the conversion service
    const pdfResponse = await axios.get(pdfData.data, { responseType: 'arraybuffer' });
    const pdfBuffer = Buffer.from(pdfResponse.data);
    
    // Step 5: Upload the PDF file to Spaces
    const pdfUrl = await uploadPdfBufferToSpaces(pdfBuffer, `${Name}.pdf`);
    
    return { docxUrl, pdfUrl };
};

const obj = {
    Name: "Name", 
    starteEndDate: "Surname", 
    Identity: "Identity", 
    Address: "Address", 
    JobTitle: "JobTitle", 
    commencementDate: "commencementDate", 
    ID: "ID", 
    perHour: "perHour"
};

module.exports = { generateAndUploadDocument };
