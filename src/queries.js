const { Pool } = require('pg');
const io = require('./socket').getIo();

const pool = new Pool();

/*
 * List all games and return them in json.
 */
const getGames = (req, res) => {
    pool.query('SELECT * FROM games ORDER BY created_at ASC', (error, results) => {
        if (error) {
            res.status(500).send('Database error');
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

/*
 * Create a new game, return his id and send the event to all connected clients.
 */
const createGame = (req, res) => {
    const name = req.body.name;

    if (!name) {
        res.status(400).send('Empty argument');
        return;
    } else if (name.length > 300) {
        res.status(400).send('Game\'s name must be lower than 300');
        return;
    }

    pool.query('INSERT INTO games (game_name) VALUES ($1) RETURNING game_id', [name],
    (error, results) => {
        if (error) {
            res.status(500).send('Database error');
            throw error;
        }
        res.status(201).send(results.rows[0].game_id.toString());
        io.emit('new game', {
            game_name: name,
            game_id: results.rows[0].game_id.toString(),
            finish: false
        });
    });
};

/*
 * Finish or relaunch a game, return his id and send the event to all connected clients.
 */
const finishGame = (req, res) => {
    const game_id = parseInt(req.params.game_id);

    if (isNaN(game_id)) {
        res.status(400).send('Game\'s id must be an integer');
        return;
    }

    pool.query('UPDATE games SET finish = NOT finish WHERE game_id = $1 RETURNING game_id, finish', [game_id],
    (error, results) => {
        if (error) {
            res.status(500).send('Database error');
            throw error;
        }
        if (!results.rows[0]) {
            res.status(404).send('Couldn\'t find the game');
            return;
        }
        res.status(200).send(results.rows[0].game_id.toString());
        io.emit('finish game', {
            game_id: results.rows[0].game_id.toString(),
            finish: results.rows[0].finish
        });
    });
};

/*
 * Delete a game, return his id and send the event to all connected clients.
 */
const deleteGame = (req, res) => {
    const game_id = parseInt(req.params.game_id);

    if (isNaN(game_id)) {
        res.status(400).send('Game\'s id must be an integer');
        return;
    }

    pool.query('DELETE FROM games WHERE game_id = $1 RETURNING game_id', [game_id],
    (error, results) => {
        if (error) {
            res.status(500).send('Database error');
            throw error;
        }
        if (!results.rows[0]) {
            res.status(404).send('Couldn\'t find the game');
            return;
        }
        res.status(200).send(results.rows[0].game_id.toString());
        io.emit('delete game', { game_id: results.rows[0].game_id.toString() });
    });
};

module.exports = {
    getGames,
    createGame,
    finishGame,
    deleteGame
};