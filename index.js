const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());

app.use(cors());

let persons = [
  {
    name: 'berna',
    tel: '3585645985',
    id: 1,
  },
  {
    name: 'Matias',
    tel: '3584168036',
    id: 2,
  },
  {
    name: 'Bruno',
    tel: 'putilin',
    id: 3,
  },
];

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = +request.params.id;

  const person = persons.find((person) => {
    return person.id === id;
  });

  if (person) {
    response.json(person);
  } else {
    response.status(404).end('404 not found');
  }
});

app.get('/info', (request, response) => {
  const fecha = new Date();
  const cantidad = persons.length;

  response.send(
    `La cantidad de personas en la genda es de ${cantidad} y la fecha actual ${fecha}`
  );
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.tel || !body.name) {
    return response.status(400).json({
      error: 'info missing',
    });
  } else if (persons.some((e) => e.name === body.name)) {
    return response.status(400).end('El nombre de usuario ya existe');
  }

  const person = {
    name: body.name,
    tel: body.tel,
    id: Math.floor(Math.random() * 5000),
  };

  persons = persons.concat(person);

  response.json(person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
