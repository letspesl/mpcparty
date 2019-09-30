'use strict';

const express = require('express'),
    Protocol = require('libs/api/protocol'),
    SErr = require('libs/error');

const router = express.Router();

const invite = function(req, res, next) {
    let protocolId = req.params.protocol_id;
    Protocol.invite(protocolId, req.body)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            SErr.sendRes(res, err);
        });
};

const broadcast = function(req, res, next) {
    let protocolId = req.params.protocol_id;
    console.log(protocolId);
    Protocol.broadcast(protocolId, req.body)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            SErr.sendRes(res, err);
        });
};

router.post('/1/protocols/:protocol_id/invite', invite);
router.post('/1/protocols/:protocol_id/broadcast', broadcast);

module.exports = exports = router;
