const express = require('express');
const sample = require('../services/sample');

const router = new express.Router();


/**
 * Submit a new timeseries sample from an IoT endpoint.
 */
router.post('/', async (req, res, next) => {
  const options = {
    body: req.body['body']
  };

  try {
    const result = await sample.putIoTSample(options);
    res.setHeader('Content-Type', 'application/json');
    res.status(201).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Get historical fleet values at given time
 */
router.get('/:ts', async (req, res, next) => {
  const options = {
    ts: req.params['ts']
  };

  try {
    const result = await sample.getFleetSample(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
