const { Pool } = require('pg');

const pool = new Pool();

/*
 * Effectue une requête sur la base de données
 */
module.exports.query = (queryText, params) => {
    return new Promise((resolve, reject) => {
      pool.query(queryText, params).then((results) => {
          resolve(results);
        }).catch((error) => {
          reject(error);
        });
    });
};