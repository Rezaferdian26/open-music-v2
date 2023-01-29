const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan.');
    }

    return result.rows[0].id;
  }

  async getPlaylists() {
    const result = await this._pool.query('SELECT * FROM playlists');

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menampilkan playlist. id tidak ditemukan');
    }

    return result.rows;
  }
}

module.exports = PlaylistsService;
