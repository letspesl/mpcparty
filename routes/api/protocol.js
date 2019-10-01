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

router.post('/1/protocols/:protocol_id/invite', invite);

module.exports = exports = router;
