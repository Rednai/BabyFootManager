const app = require('../src/app');
const db = require('../src/query');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe ('Games routes', () => {
    beforeEach((done) => {
        db.query('DELETE FROM games').then(() => {
            done();
        }).catch((error) => {
            done(error);
        });
    });

    describe('GET /games -> getGames()', function() {
        it('list 0 games', (done) => {
            chai.request(app)
            .get('/games')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
        });

        it('list 2 games', (done) => {
            db.query("INSERT INTO games (game_name) VALUES ('First game'), ('Second game')")
            .then(() => {
                chai.request(app)
                .get('/games')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    done();
                });                
            })
            .catch((error) => {
                done(error);
            });
        });
    });

    describe('POST /games -> createGame()', function() {
        it('create 1 game', (done) => {
            let game = { name: "New game" }
            
            chai.request(app)
            .post('/games')
            .send(game)
            .end((err, res) => {
                res.should.have.status(201);
                db.query("SELECT * FROM games")
                .then((results) => {
                    results.rows.length.should.be.eql(1);
                    results.rows[0].game_name.should.be.eql("New game");
                    done();
                })
                .catch((error) => {
                    done(error);
                });
            });
        });

        it('empty name', (done) => {
            let game = { name: "" }
            
            chai.request(app)
            .post('/games')
            .send(game)
            .end((err, res) => {
                res.should.have.status(400);
                db.query("SELECT * FROM games")
                .then((results) => {
                    results.rows.length.should.be.eql(0);
                    done();
                })
                .catch((error) => {
                    done(error);
                });
            });
        });

        it('too long name', (done) => {
            let game = { name: 'a'.repeat(301) }
            
            chai.request(app)
            .post('/games')
            .send(game)
            .end((err, res) => {
                res.should.have.status(400);
                db.query("SELECT * FROM games")
                .then((results) => {
                    results.rows.length.should.be.eql(0);
                    done();
                })
                .catch((error) => {
                    done(error);
                });
            });
        });
    });

    describe('PUT /games/:game_id -> finishGame()', function() {
        it('finish a game', (done) => {
            db.query("INSERT INTO games (game_name) VALUES ('game') RETURNING game_id")
            .then((firstResults) => {
                chai.request(app)
                .put('/games/' + firstResults.rows[0].game_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    db.query("SELECT * FROM games")
                    .then((secondResults) => {
                        secondResults.rows[0].finish.should.be.eql(true);
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
                });    
            }).catch((error) => {
                done(error);
            });
        });

        it('relaunch a game', (done) => {
            db.query("INSERT INTO games (game_name, finish) VALUES ('game', TRUE) RETURNING game_id")
            .then((firstResults) => {
                chai.request(app)
                .put('/games/' + firstResults.rows[0].game_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    db.query("SELECT * FROM games")
                    .then((secondResults) => {
                        secondResults.rows[0].finish.should.be.eql(false);
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
                });    
            }).catch((error) => {
                done(error);
            });
        });

        it('wrong game_id', (done) => {
            chai.request(app)
            .put('/games/azerty')
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
        });

        it('unknown game_id', (done) => {
            chai.request(app)
            .put('/games/10')
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });

    describe('DELETE /games/:game_id -> deleteGame()', function() {
        it('Delete a game', (done) => {
            db.query("INSERT INTO games (game_name) VALUES ('game') RETURNING game_id")
            .then((firstResults) => {
                chai.request(app)
                .delete('/games/' + firstResults.rows[0].game_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    db.query("SELECT * FROM games")
                    .then((secondResults) => {
                        secondResults.rows.length.should.be.eql(0);
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
                });    
            }).catch((error) => {
                done(error);
            });
        });

        it('wrong game_id', (done) => {
            chai.request(app)
            .delete('/games/azerty')
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
        });

        it('unkown game_id', (done) => {
            chai.request(app)
            .delete('/games/10')
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });
});