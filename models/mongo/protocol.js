'use strict';

const SEnum = require('libs/enum'),
    schema = require('./schema');

module.exports = exports = function(mongoose, conn) {
    const Schema = mongoose.Schema;
    class Protocol {
        static transform(doc, ret, options) {
            ret.created_at = doc.created_at.getTime();
            ret.updated_at = doc.updated_at.getTime();
        }
    }

    const protocolSchema = new Schema({
        protocol_id : {type : String, required : true},
        parties_id : {type : Number, required : true, default : 1},
        protocol_type : {type : Number, required : true, default : SEnum.PROTOCOL_TYPE_GENERATE_KEY},
        share_count : {type : Number, required : true, default : 2},
        threshold : {type : Number, required : true, default : 1}
    }, {
        virtuals: true,
        toJSON : {transform : Protocol.transform},
        toObject : {transform : Protocol.transform},
        timestamps : {createdAt : 'created_at', updatedAt : 'updated_at'}
    });

    protocolSchema.index({protocol_id : 1}, {unique : true});
    //protocolSchema.index({protocol_id : 1, parties_id : 1}, {unique : true});

    protocolSchema.loadClass(Protocol);

    return conn.model('Protocol', protocolSchema);
};
