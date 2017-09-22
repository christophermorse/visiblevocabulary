var express       = require('express'),        // call express
    settings      = require('./settings'),
    app           = express(),                 // define our app using express
    port          = settings.port || process.env.PORT || 3333,
    bodyParser    = require('body-parser'),

    neo4j    = require('neo4j-driver').v1,
    driver   = neo4j.driver(settings.neo4j.server, neo4j.auth.basic(settings.neo4j.auth.user, settings.neo4j.auth.password));
    

driver.onCompleted =  function() {
  // proceed with using the driver, it was successfully instantiated
  console.log('neo4j driver ready.');
};

// Register a callback to know if driver creation failed.
// This could happen due to wrong credentials or database unavailability:
driver.onError =  function(error){
  console.log('Driver instantiation failed', error);
};

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app
  .get('/api', (req, res) => {
    res.status(200).json({message:'send POST data'})
  })
  .post('/api', (req, res) => {
    console.log(req.body);    
    session  = driver.session()
    
    session
      .run('MATCH (a:lemma) RETURN a', {}).then(results => {
        console.log('results!', results);
        session.close();
        res.status(200).json(results.records)
      }).catch(err => {
        console.log(err)
        session.close();
        res.status(400).json({message: 'error!!!'})
      });
});


app.listen(port, () => {
  console.log('app listening on port', port)
});

