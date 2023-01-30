/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
    },
    song_id: {
      type: 'VARCHAR(50)',
    },
    user_id: {
      type: 'VARCHAR(50)',
    },
    action: {
      type: 'VARCHAR(50)',
    },
    time: {
      type: 'VARCHAR(50)',
    },
  });

  pgm.addConstraint('playlist_song_activities', 'fk_activities.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_song_activities', 'fk_activities.song_id_songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id)');
  pgm.addConstraint('playlist_song_activities', 'fk_activities.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id)');
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
};
