const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
  owner: Joi.string(),
});

const addPlaylistSongSchema = Joi.object({
  playlistId: Joi.string(),
  songId: Joi.string().required(),
});

const deletePlaylistSongSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PlaylistPayloadSchema, addPlaylistSongSchema, deletePlaylistSongSchema };
