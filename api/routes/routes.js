const express = require('express')
const db = require('../lib/db')
const routes = express.Router()
const fetch = require('node-fetch')

routes.get('/games', (req, res) => {
  db(`SELECT * FROM games ORDER BY score DESC`)
    .then(results => {
      if (results.error) {
        res.status(400).send({ message: 'There was an error' })
      }
      res.send(results.data)
    })
    .catch(err => res.status(500).send(err))
})

routes.get('/games/:gameId', (req, res) => {
  const { gameId } = req.params
  db(`SELECT * FROM games WHERE gameId=${gameId};`)
    .then(results => {
      if (results.data[0]) {
        return res.send(results.data[0])
      }
      return res.status(404).send({ message: 'No game found' })
    })
    .catch(err => res.status(500).send(err))
})

routes.post('/games', (req, res) => {
  const { score, user } = req.body

  db(`INSERT INTO games (score, user) VALUES('${score}', '${user}');`)
    .then(results => {
      //console.log({ results })
      if (!results.error) {
        return res.status(201).send({ message: 'Succesfully created' })
      }
      throw Error({ error: 'Cannot create' })
    })
    .catch(err => res.status(500).send(err))
})

routes.delete('/games/:gameId', (req, res) => {
  const { gameId } = req.params
  db(`DELETE FROM games WHERE gameId=${gameId};`)
    .then(results => {
      //console.log({ results })
      if (!results.error) {
        return res.status(200).send({ message: `Game ${gameId} was deleted` })
      }
      return res.status(404).send({ message: 'No game found' })
    })
    .catch(err => res.status(500).send(err))
})

routes.get('/categories', (req, res) => {
  fetch('https://opentdb.com/api_category.php')
    .then(response => response.json())
    .then(response => {
      const parsedData = response.trivia_categories.map(({ id, name }) => {
        return {
          id,
          name,
        }
      })
      res.send(parsedData)
    })
})

module.exports = routes
