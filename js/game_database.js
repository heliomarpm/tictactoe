const game_database = {};

(function () {
    let game_id = false;
    
    function newGame(player1, board) {
        const gameData = {
            player1: player1,
            board: board,
            gameover: false,
            createdat: firebase.database.ServerValue.TIMESTAMP
        };

        if (!game_id) {
            game_id = firebase.database().ref().child('db_tictactoe').push().key;
        }

        let updates = {};
        updates['/db_tictactoe/' + game_id] = gameData;

        let db_ref = firebase.database().ref();

        db_ref.update(updates)
            .then(function () {
                return { sucess: true, message: 'Game created' };
            })
            .catch(function (error) {
                return { sucess: false, message: `Creation failed ${error.message}` };
            });
    }
    
    function removeGame() { 
        if (!game_id)
            return { sucess: false, message: 'Invalid game!' };
        
        let db_ref = firebase.database().ref('/db_tictactoe/' + game_id);

        db_ref.remove()
            .then(function () {
                return { sucess: true, message: 'Game removed' };
            })
            .catch(function (error) {
                return { sucess: false, message: `Remove failed ${error.message}` };
            });
    }

    function updateGame(board) { 
        if (!game_id)
            return { sucess: false, message: 'Invalid game!' };
        
        let updates = {};
        updates['/board/'] = board;
        updates['last_update'] = firebase.database.ServerValue.TIMESTAMP;

        let db_ref = firebase.database().ref('/db_tictactoe/' + game_id);

        db_ref.update(updates)
            .then(function () {
                return { sucess: true, message: 'Game updated' };
            })
            .catch(function (error) {
                return { sucess: false, message: `Update failed ${error.message}` };
            });
    }

    function resetGame() { 
        if (!game_id)
            return { sucess: false, message: 'Invalid game!' };
        
        game_id = false;
        return { sucess: false, message: 'Game reset!' };
    }

    async function listenGame() {
        if (!game_id)
            return { sucess: false, message: 'Invalid game!' };
        
        let db_ref = firebase.database().ref('/db_tictactoe/' + game_id); 
        db_ref.once('child_changed')
            .then(function (snapshot) {
                if (snapshot.key === 'board') {
                    console.log('board changed', snapshot.val());                
                    return { sucess: true, message: 'Board changed', data: snapshot.val() };
                }
                else if (snapshot.key === 'gameover'){
                    console.log('gameover changed', snapshot.val());

                    return { sucess: true, message: 'Game is Over', data: snapshot.val() };
                }
            })
            .catch(function (error) {
                return { sucess: false, message: `Update failed ${error.message}` };
            });
    }
    game_database.new = newGame;
    game_database.remove = removeGame;
    game_database.update = updateGame;
    game_database.reset = resetGame;
    game_database.listen = listenGame;
})()