import express from 'express';          // npm install express
import path from 'path';
import https from 'https';              // for forming external get requests
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded({extended: true}));  // this is for parsing data from html form

// __dirname is only available with CJS. Since I am using ESM I need to get it another way
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// static items like other js or css files will not load unless you define where the server should 
//      start looking for those files.
app.use(express.static(path.join(__dirname, "/public")));

// -----------------------------------------------------------------------------------
// ---------------------------------- Listening --------------------------------------
// -----------------------------------------------------------------------------------
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// -----------------------------------------------------------------------------------
// --------------------------------- Get Requests ------------------------------------
// -----------------------------------------------------------------------------------
app.get('/', (req, res) => {
    console.log("Server is up and running.");

    const homepage = "index.html";
    res.sendFile(path.join(__dirname, "/src/" + homepage));
    console.log('Sent:', __dirname + "/src/" + homepage);
    
});

// -----------------------------------------------------------------------------------
// -------------------------------- Post Requests ------------------------------------
// -----------------------------------------------------------------------------------
//  main functionality
app.post('/', (req, res) => {

});