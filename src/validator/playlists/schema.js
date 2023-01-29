const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string(),
  owner: Joi.string(),
});

module.exports = { PlaylistPayloadSchema };
