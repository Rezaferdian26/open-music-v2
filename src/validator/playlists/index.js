const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistPayloadSchema, addPlaylistSongSchema, deletePlaylistSongSchema } = require('./schema');

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateAddSongToPlaylist: (payload) => {
    const validationResult = addPlaylistSongSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteSongsFromPlaylist: (payload) => {
    const validationResult = deletePlaylistSongSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
