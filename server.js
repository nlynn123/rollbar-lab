const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

app.use(express.json())
app.use(cors())
// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '5dba882e56024bc382a0cfd5068f96a9',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const movies = ['Shrek', 'The Bee Movie', 'The Exorcist']

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/movies', (req, res) => {
    res.status(200).send(movies)
})

app.post('/api/movies', (req, res) => {
   let {name} = req.body

   const index = movies.findIndex(movie => {
       return movie === name
   })

   try {
       if (index === -1 && name !== '') {
           movies.push(name)
           rollbar.log('Movie was added successfully')
           res.status(200).send(movies)
       } else if (name === ''){
            rollbar.error('No movie was provided')
           res.status(400).send('You must enter a movie.')
       } else {
           res.status(400).send('That movie already exists.')
           rollbar.warning('That movie exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/movies/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    movies.splice(targetIndex, 1)
    res.status(200).send(movies)
})

const port = process.env.PORT || 4949

app.listen(port, () => console.log(`Server listening on ${port}`))
