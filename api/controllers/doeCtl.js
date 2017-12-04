'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
var PDFDocument = require('pdfkit');
var fs = require('fs');
var path = require('path');
var Docxtemplater = require('docxtemplater');
var JSZip = require('jszip');
const { exec } = require('child_process');
/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  getDOE
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */

function getDOE(req, res) {
  //Load the docx file as a binary
  var content = fs.readFileSync(path.resolve(__dirname, '../data/doe.docx'), 'binary');
  var zip = new JSZip(content);
  
  var doc = new Docxtemplater();
  doc.loadZip(zip);
  
  //set the templateVariables
  doc.setData({
      date: 'FEVRIER 2017',
      titres:[
        {ligne:'CONSTRUCTION D\'UNE IME'},
        {ligne:'Site de Kerlouen'},
        {ligne:'LANDERNAU'}
      ],
      nommoa: 'AIGUILLON CONSTRUCTION',
      adressemoa: '171 rue du vern',
      villemoa: '35200 - RENNES',
      nommoe: 'AUA STRUCTURES',
      adressemoe: '71, rue des fdsfs',
      villemoe : '29200 - QUIMPER',
      lot: 'LOT12 - REVETEMENTS DE SOLS',
      materiaux: [
        {
          categorie: 'CHAPE',
          marque: 'SIKA',
          references:[{
            ref: 'Sikaviscochape'}
          ]
        },
        {
          categorie: 'CHAPE',
          marque: 'SIKA',
          references:[{
            ref: 'Sikaviscochape'}
          ]
        },
        {
          categorie: 'CHAPE',
          marque: 'SIKA',
          references:[{
            ref: 'Sikaviscochape'}
          ]
        },
        {
          categorie: 'CHAPE',
          marque: 'SIKA',
          references:[{
            ref: 'Sikaviscochape'}
          ]
        },
        {
          categorie: 'CHAPE',
          marque: 'SIKA',
          references:[{
            ref: 'Sikaviscochape'}
          ]
        },
        {
          categorie: 'CHAPE',
          marque: 'SIKA',
          references:[{
            ref: 'Sikaviscochape'}
          ]
        },
        {
          categorie: 'CHAPE',
          marque: '',
          references: [
            {ref: 'Sable'},
            {ref: 'ciment'}
          ]
        },
        {
          categorie: 'CHAPE',
          marque: '',
          references: [
            {ref: 'Sable'},
            {ref: 'ciment'}
          ]
        },        {
          categorie: 'CHAPE',
          marque: '',
          references: [
            {ref: 'Sable'},
            {ref: 'ciment'}
          ]
        },        {
          categorie: 'CHAPE',
          marque: '',
          references: [
            {ref: 'Sable'},
            {ref: 'ciment'}
          ]
        },        {
          categorie: 'CHAPE',
          marque: '',
          references: [
            {ref: 'Sable'},
            {ref: 'ciment'}
          ]
        },        {
          categorie: 'CHAPE',
          marque: '',
          references: [
            {ref: 'Sable'},
            {ref: 'ciment'}
          ]
        },        {
          categorie: 'CHAPE',
          marque: '',
          references: [
            {ref: 'Sable'},
            {ref: 'ciment'}
          ]
        },        {
          categorie: 'CHAPE',
          marque: '',
          references: [
            {ref: 'Sable'},
            {ref: 'ciment'}
          ]
        },        {
          categorie: 'CHAPE',
          marque: '',
          references: [
            {ref: 'Sable'},
            {ref: 'ciment'}
          ]
        },        {
          categorie: 'CHAPE',
          marque: '',
          references: [
            {ref: 'Sable'},
            {ref: 'ciment'}
          ]
        },        {
          categorie: 'CHAPE',
          marque: '',
          references: [
            {ref: 'Sable'},
            {ref: 'ciment'}
          ]
        },
        {
          categorie: 'ETANCHEITE sous carrelage',
          marque: 'PAREXLANKO',
          references: [
            {ref: 'Lanko 588'}
          ]
        }
      ]
  });
  
  try {
      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render()
  }
  catch (error) {
      var e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties,
      }
      console.log(JSON.stringify({error: e}));
      // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
      throw error;
  }
  
  var buf = doc.getZip()
               .generate({type: 'nodebuffer'});
  
  // buf is a nodejs buffer, you can either write it to a file or do anything else with it.

  let writeStream = fs.createWriteStream('output.docx');

  writeStream.write(buf); 

  // the finish event is emitted when all data has been flushed from the stream
  writeStream.on('finish', () => {  
    exec('libreoffice --headless --convert-to odt output.docx  && libreoffice --headless --convert-to pdf --outdir api/data/ output.odt && rm output.odt && rm output.docx', 
    (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        return;
      }
    
      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    })
  });

  // close the stream
  writeStream.end();

  


  res.status(200).send();
}
