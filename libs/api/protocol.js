'use strict';

const Promise = require('bluebird'),
    _ = require('lodash'),
    Nblocks = require('external_apis/party'),
    mongo = require('models/mongo'),
    SEnum = require('libs/enum'),
    SUtil = require('libs/util'),
    SErr = require('libs/error');

const Protocol = mongo.Protocol;
const PartyId = "5d8daf940b11f220a67cf9ed";
const PollRetries = 20;

async function round1() {
    return "server_value1";
}

async function round2() {
    return "server_value2";
}

async function execute(protocol) {
    // round1
    let value = await round1();
    
    // send broadcast
    let body = {
        party_id: PartyId,
        party_idx: protocol.parties_id,
        round: 1,
        value: value
    };
    await Nblocks.sendBroadcast("http://localhost:3000", protocol.protocol_id, body);    
    
    // poll broadcast
    body = {
        party_id: PartyId,
        round: 1
    };
    for(let i=0; i<PollRetries; i++) {
        let res = await Nblocks.pollBroadcast("http://localhost:3000", protocol.protocol_id, body);
        if(res.size == protocol.share_count-1) {
            console.log(res);
            break;
        }
    }
    
    //round2
    value = await round2();
     
    // send peer
    body = {
        party_idx: protocol.parties_id,
        round: 2,
        value: value,
        to_idx: 1,
    };
    await Nblocks.sendPeer("http://localhost:3000", protocol.protocol_id, body);    

    body = {
        party_idx: protocol.parties_id,
        round: 2,
        value: value,
        to_idx: 3,
    };
    await Nblocks.sendPeer("http://localhost:3000", protocol.protocol_id, body);    

    
    // poll peer
    body = {
        party_id: PartyId,
        round: 2
    };
    for(let i=0; i<PollRetries; i++) {
        let res = await Nblocks.pollPeer("http://localhost:3000", protocol.protocol_id, body);
        if(res.size == protocol.share_count-1) {
            console.log(res);
            break;
        }
    }
    
}

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
        new Promise(function(resolve, reject) {
            execute(protocol)
            .then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        });

        return protocol;
    }).catch((err) => {
        throw SErr.create('BAD_REQUEST', {err : err, reqBody : this.reqBody});
    });
}

module.exports = exports = {invite};
