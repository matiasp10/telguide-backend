require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const Person = require('../models/person');

// Middlewares

app.use(express.static('public'));
app.use(cors());
app.use(express.json());

// Conexion mongoose

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

// GET ALL PERSONS

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// GET PERSONA POR ID

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

// GET Informacion

app.get('/info', (request, response) => {
  Person.find({}).then((persons) => {
    response.send(
      'Phonebook has info for ' +
        persons.length +
        ' people' +
        '<br></br>' +
        new Date().toLocaleString('fi-FI', { timeZone: 'Europe/Helsinki' })
    );
  });
});

// DELETE persona por ID

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// POST personas nuevas

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    tel: body.tel,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

// MODIFICAR PERSONAS

app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    name: req.body.name,
    tel: req.body.tel,
  };
  Person.findByIdAndUpdate({ _id: req.params.id }, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// ERROR 404

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

// Controlador de errores middleware

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: 'Error de validacion' });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
