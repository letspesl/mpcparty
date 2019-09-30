'use strict';

const Promise = require('bluebird'),
    _ = require('lodash'),
    Nblocks = require('external_apis/party'),
    mongo = require('models/mongo'),
    SEnum = require('libs/enum'),
    SUtil = require('libs/util'),
    SErr = require('libs/error');

const Protocol = mongo.Protocol;

async function invite(protocolId, reqBody) {
    let partiesId = parseInt(reqBody.parties_count, 10) + 1;
    let protocolType = reqBody.protocol_type;
    let shareCount = reqBody.share_count;
    let threshold = reqBody.threshold;

    return Protocol.create({
        protocol_id: protocolId,
        parties_id: partiesId,
        protocol_type: protocolType,
        share_count: shareCount,
        threshold: threshold,
    }).then((protocol) => {
        execute(protocol);
        return protocol;
    }).catch((err) => {
        throw SErr.create('BAD_REQUEST', {err : err, reqBody : this.reqBody});
    });
}

async function execute(protocol) {
    console.log(protocol);
    
    // round 1

    // broadcast
    const body = {
        party_id: "5d8daf940b11f220a67cf9ed",
        party_idx: protocol.parties_id,
        round: 1,
        value: "value"
    };

    let res = await Nblocks.sendBroadcast("http://localhost:3000", protocol.protocol_id, body);

    console.log(res);
    // poll broadcast

    // ...

}

module.exports = exports = {invite};
