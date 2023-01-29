const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapSongDB } = require('../../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, performer, genre, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    let filteredSongs = await this._pool.query('SELECT id, title, performer FROM songs');

    if (title !== undefined) {
      const query = {
        text: 'SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE $1',
        values: [`%${title}%`],
      };
      filteredSongs = await this._pool.query(query);
    }

    if (performer !== undefined) {
      filteredSongs = await this._pool.query(`SELECT id, title, performer FROM songs WHERE LOWER(performer) LIKE '%${performer}%'`);
    }

    return filteredSongs.rows.map(mapSongDB);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(mapSongDB)[0];
  }

  async getSongsInPlaylist(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlist_songs 
      INNER JOIN songs ON songs.id = playlist_songs.song_id
      WHERE playlist_id = $1
      `,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak dapat ditemukan. Id playlist tidak ada');
    }
    return result.rows;
  }

  async editSongById(id, {
    title, year, performer, genre, duration,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id',
      values: [title, year, performer, genre, duration, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifySong(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }
}

module.exports = SongsService;
