const express = require('express');
const fs = require('fs-extra');
const app = express();

app.use('/api/components.json', (req, response) => {
  fs.readFile('../pca/components.txt').then((file) => {
    response.send(file.toString().trim().split("\n").map(l => l.split(' ').map(n => parseFloat(n))));
  });
});

app.use('/api/means.json', (req, response) => {
  fs.readFile('../pca/means.txt').then((file) => {
    response.send(file.toString().trim().split("\n").map(l => parseFloat(l)));
  });
});

app.use(express.static('static'));


app.listen(8000);