import db from '../db';
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const Photos = {

  // Create a photo
  async create(req, res) {

    try {

      // If user is not signed in, return unauthorized
      if (!req.user) {
        return res.status(401).json({ error: 'You must be signed in to upload a photo.' });
      }

      const result = await cloudinary.v2.uploader.upload(
        req.file.path,
        {
          categorization: "google_tagging",
          auto_tagging: 0.85,
        }
      );
      const createPhotoQuery = `INSERT INTO
      photos(id, filename, url, created, width, height, tags, userid)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      returning *`;
      const values = [
        result.public_id,
        result.original_filename,
        result.secure_url,
        result.created_at,
        result.width,
        result.height,
        result.tags.join(','),
        req.user.id
      ];
      const { rows } = await db.query(createPhotoQuery, values);
      return res.status(200).json(rows[0]);
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  // Get all photos
  async getAll(req, res) {
    const findAllPhotosWithUserAndLikesQuery = `
      SELECT photos.*, users.username, users.avatar, count(likes.photoid) AS likes
      FROM photos
      LEFT OUTER JOIN users on photos.userid = users.id
      FULL OUTER JOIN likes on photos.id = likes.photoid
      GROUP BY photos.id, users.username, users.avatar
      ORDER BY photos.created DESC
    `;

    try {
      const { rows: photos } = await db.query(findAllPhotosWithUserAndLikesQuery);

      // A user is signed in (from jwt authentication)
      if (req.user) {

        // Find all the photos the signed in user has liked
        const findPhotosUserLikedQuery = 'SELECT photoid FROM likes WHERE userid = $1';
        const { rows: likedPhotos } = await db.query(findPhotosUserLikedQuery, [ req.user.id ]);

        // Create array of just photoids of photos signed in user has liked
        const photosLikedByUser = likedPhotos.map(row => row.photoid);

        // Map over all of the photos and add a boolean property likedByUser if the photo id is found in the array above
        const newPhotos = photos.map(photo => {
          photo.likedByUser = photosLikedByUser.includes(photo.id);
          return photo;
        });

        return res.status(200).json({
          user: req.user,
          photos: newPhotos,
        });
      }

      // User is not signed is so just return the photos
      return res.status(200).json({ photos });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  // Get a photo
  async getOne(req, res) {
    const findOnePhotoWithUserAndLikesQuery = `
      SELECT photos.*, users.username, users.avatar, count(likes.photoid) AS likes
      FROM photos
      FULL OUTER JOIN users on photos.userid = users.id
      FULL OUTER JOIN likes on photos.id = likes.photoid
      WHERE photos.id = $1
      GROUP BY photos.id, users.username, users.avatar
    `;

    try {
      const { rows } = await db.query(findOnePhotoWithUserAndLikesQuery, [ req.params.id ]);
      const photo = rows[0];

      // If nothing comes back from the database, send 404 not found
      if (!photo) {
        return res.status(404).send('Photo not found');
      }

      // A user is signed in (from jwt authentication)
      if (req.user) {

        // Find if the user has liked the photo
        const findUserAndPhotoInLikesQuery = `
          SELECT *
          FROM likes
          WHERE userid = $1
          AND photoid = $2
        `;
        const { rows: likedPhotos } = await db.query(findUserAndPhotoInLikesQuery, [ req.user.id, req.params.id ]);

        if (!likedPhotos[0]) {

          // Nothing came back from the database so the user has not liked the photo
          photo.likedByUser = false;
        } else {

          // There was a match so the user has liked the photo
          photo.likedByUser = true;
        }

        return res.status(200).json({
          photo,
          user: req.user,
        });
      }

      // User is not signed in so just return the photo data
      return res.status(200).json({ photo });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  // Update a photo
  async update(req, res) {
    const findOneQuery = 'SELECT * FROM photos WHERE id = $1';
    const updateOneQuery = `UPDATE photos
      SET location = $1, description = $2
      WHERE id = $3
      returning *`;

    // A user must be signed in to edit information
    // Signed in user must also be requesting their own photo data.
    if (!req.user || req.user.username !== req.body.creator) {
      return res.status(403).send('You are not allowed to edit this photo');
    }

    try {

      // First, get the correct row to update from the database
      const { rows } = await db.query(findOneQuery, [ req.params.id ]);
      const photo = rows[0];

      // If nothing comes back from the database, send 404 not found
      if (!photo) {
        return res.status(404).send('Photo not found');
      }

      const values = [
        req.body.location || photo.location,
        req.body.description || photo.description,
        req.params.id
      ];

      // Update the row in the database with the new data in the values array
      const { rows: newRows } = await db.query(updateOneQuery, values);
      const updatedPhoto = newRows[0];
      const { location, description } = updatedPhoto;
      return res.status(200).json({ location, description });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  // Delete a photo
  async delete(req, res) {
    const findOneQuery = 'SELECT * FROM photos WHERE id = $1';
    const deleteQuery = 'DELETE FROM photos WHERE id = $1 returning *';

    try {

      // First find photo in the database
      const { rows } = await db.query(findOneQuery, [ req.params.id ]);
      const foundPhoto = rows[0];

      // If nothing comes back from the database, send 404 not found
      if (!foundPhoto) {
        return res.status(404).send('Photo not found');
      }

      // A user must be signed in to edit information
      // Signed in user must also be requesting their own photo data.
      if (!req.user || req.user.id !== foundPhoto.userid) {
        return res.status(403).send('You are not allowed to edit this photo');
      }

      await cloudinary.v2.uploader.destroy(req.params.id);
      const { rows: deletedRows } = await db.query(deleteQuery, [ req.params.id ]);

      // If nothing comes back from the database, send 404 not found
      if (!deletedRows[0]) {
        return res.status(404).send('Photo not found');
      }

      return res.status(204).send('Photo deleted');
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  // Like a photo
  async like(req, res) {

    // User is not signed in or user doesn't exist in database
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }

    const { id: userID } = req.user;
    const { id: photoID } = req.params;
    try {

      // Check if photo exists and if the user has liked the photo
      const findPhotoAndUserInLikesQuery = `
        SELECT photos.id, likes.userid
        FROM photos
        LEFT OUTER JOIN likes
        ON photos.id = likes.photoid
        AND likes.userid = $1
        WHERE photos.id = $2
      `;
      const { rows } = await db.query(findPhotoAndUserInLikesQuery, [ userID, photoID ]);

      // If an entry was not found, the photo doesn't exist so return
      if (!rows[0]) {
        return res.status(404).send('Photo not found');
      }

      // If an entry was found, and user id is not null (the user has liked the photo) so return
      if (rows[0].userid) {
        return res.status(403).send('Cannot like an already liked photo');
      }

      // Add the like
      const addLikeQuery = 'INSERT INTO likes(photoid, userid) VALUES($1, $2) returning *';
      const { rows: likeResponse } = await db.query(addLikeQuery, [ photoID, userID ]);

      // Refresh data for photo
      const findOnePhotoWithUserAndLikesQuery = `
        SELECT photos.*, users.username, count(likes.photoid) AS likes
        FROM photos
        FULL OUTER JOIN users on photos.userid = users.id
        FULL OUTER JOIN likes on photos.id = likes.photoid
        WHERE photos.id = $1
        GROUP BY photos.id, users.username
      `;
      const { rows: photoRows } = await db.query(findOnePhotoWithUserAndLikesQuery, [ photoID ]);
      const photo = photoRows[0];

      return res.status(200).json({
        photo,
        user: req.user,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  // Remove like from photo
  async removeLike(req, res) {

    // User is not signed in or user doesn't exist in database
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }

    const { id: userID } = req.user;
    const { id: photoID } = req.params;

    try {

      // Check if photo exists and if the user has liked the photo
      const findPhotoAndUserInLikesQuery = `
        SELECT photos.id, likes.userid
        FROM photos
        LEFT OUTER JOIN likes
        ON photos.id = likes.photoid
        AND likes.userid = $1
        WHERE photos.id = $2
      `;
      const { rows } = await db.query(findPhotoAndUserInLikesQuery, [ userID, photoID ]);

      // If an entry was not found, the photo doesn't exist so return
      if (!rows[0]) {
        return res.status(404).send('Photo not found');
      }

      // If an entry was found, and user id is null (the user has not liked the photo) so return
      if (!rows[0].userid) {
        return res.status(403).send('Cannot unlike a photo that user has not liked');
      }

      // Remove the like
      const removeLikeQuery = 'DELETE FROM likes WHERE photoid= $1 AND userid = $2 returning *';
      const { rows: likeResponse } = await db.query(removeLikeQuery, [ photoID, userID ]);

      // Refresh data for photo
      const findOnePhotoWithUserAndLikesQuery = `
        SELECT photos.*, users.username, count(likes.photoid) AS likes
        FROM photos
        FULL OUTER JOIN users on photos.userid = users.id
        FULL OUTER JOIN likes on photos.id = likes.photoid
        WHERE photos.id = $1
        GROUP BY photos.id, users.username
      `;
      const { rows: photoRows } = await db.query(findOnePhotoWithUserAndLikesQuery, [ photoID ]);
      const photo = photoRows[0];

      return res.status(200).json({
        photo,
        user: req.user,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  }
};

export default Photos;