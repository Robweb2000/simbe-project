const express = require('express');
const knex = require('../../../db/knex.js');
const config = require('../../lib/config');

const router = new express.Router();


/**
 * Submit a new timeseries sample from an IoT endpoint.
 */
router.post('/', async (req, res, next) => {

  try {
    // IoT endpoints use basicAuth.
    auth = req.headers.authorization
    if (!auth || (auth.indexOf('Basic ') != 0)) {
      return res.status(401).json({ message: 'Requires basicAuth'})
    }
    // string manipulation code from https://jasonwatmore.com/post/2018/09/24/nodejs-basic-authentication-tutorial-with-example-api
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [user, pass] = credentials.split(':');
    // TODO: replace hardcoded user/pass with User store in postgres
    if ((user != config.iot_auth.user) || (pass != config.iot_auth.pass)) {
      return res.status(401).json({ message: 'Bad basicAuth credentials'})      
    }

    // Write sample to db
    knex('samples').insert({
      ts: req.body.ts,
      endpoint_id: req.body.endpoint_id,
      value: req.body.value
    }).then( function(result) {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).send({ message: 'okay'});

    })
    
  } catch (err) {
    next(err);
  }
});

/**
 * Get historical fleet values at given time
 */
router.get('/:ts', async (req, res, next) => {

  try {
    // data access clients use an api_key header.
    auth = req.headers.api_key
    if (!auth) {
      return res.status(401).json({ message: 'Requires api_key in header'})
    }
    // TODO: replace hard-coded API key with secret store.
    if (auth != config.api_key) {
      return res.status(401).json({ message: 'Invalid API key'})
    }

    // Retrieve IoT samples that match the provided timstamp.
    knex('samples').select('ts', 'endpoint_id', 'value')
      .where({ ts: req.params['ts'] })
      .then(rows => {
        payload = { 'ts' : req.params['ts']}
        for (row of rows) {
            // Data must be transformed to FleetSample schema.
            // keys are endpoint_ids.
            payload[row['endpoint_id']] = row['value']
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(payload);
      });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
