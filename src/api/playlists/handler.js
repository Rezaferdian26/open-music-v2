const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload);

      const { name, owner } = request.payload;

      const playlistId = await this._service.addPlaylist({ name, owner });

      const response = h.response({
        status: 'success',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistsHandler() {
    const playlists = await this._service.getPlaylists();

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }
}

module.exports = PlaylistsHandler;
