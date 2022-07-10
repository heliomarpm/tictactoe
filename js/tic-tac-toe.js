const tic_tac_toe = {
    container_el: null,
    gameover: false,
    board: ['', '', '', '', '', '', '', '', ''],

    symbols: {
        options: ['X', "O"],
        turn_index: 0,
        change () {
            this.turn_index = (this.turn_index === 0 ? 1 : 0);
        },

        get(){
            let symbol = this.options[this.turn_index];
            this.turn_index = (this.turn_index === 0 ? 1 : 0);

            return symbol;
        }
    },

    win_sequences: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
      
        [0, 4, 8],
        [2, 4, 6]
    ],

    init (container) {
        this.container_el = container;
    },

    make_play (position) { 
        if (this.gameover || this.board[position] !== '')
            return false;
        
        let symbol = this.symbols.get();
        this.board[position] = symbol;
        this.draw();

        if (this.isFullMarkBoard())
            this.gameIsOver();
        
        const win_sequence_index = this.check_winner(symbol);

        if (win_sequence_index > -1) {
            this.gameIsOver();
            this.stylize_winner_sequence(this.win_sequences[win_sequence_index]);
        }

        console.log("turn:" + this.symbols.turn_index);

        return true;
        
    },

    gameIsOver () {
        this.gameover = true;
        console.log("GAME OVER");
    },
    isFullMarkBoard() {
        //Se todos as posicoes já foram selecionadas
        return !this.board.includes('');
    },
    check_winner (symbol) {
        for (i in this.win_sequences) {
            if (this.board[this.win_sequences[i][0]] == symbol &&
                this.board[this.win_sequences[i][1]] == symbol &&
                this.board[this.win_sequences[i][2]] == symbol) {
                console.log('Sequencia Vencedora:' + i);
                return i;
            }              
        };

        return -1;
    },
    stylize_winner_sequence(winner_sequence) {
        winner_sequence.forEach((position) => {
            this.container_el
                .querySelector(`div:nth-child(${position + 1})`)
                .classList.add('winner');
        });
    },
    draw () {
        /*
        let content = '';
        
        for (let i in this.board) {
            content += '<div onclick="tic_tac_toe.make_play('+i+')">'+ this.board[i] +'</div>';
        }

        this.container_el.innerHTML = content;
        */

        this.container_el.innerHTML = this.board.map((element, index) => `<div onclick="tic_tac_toe.make_play('${index}')"><span>${element}</span></div>`)
                                                .reduce((content, current) => content + current);
    },

    start () {
        this.board.fill('');
        this.draw();
        this.gameover = false;            
    },
    restart() {
        if (this.isFullMarkBoard() || this.gameover) {
            this.start();
            console.log('this game has been restarted!')
        } else if (confirm('Tem certeza de que deseja reiniciar este jogo?')) {
            this.start();
            console.log('this game has been restarted!')
        }
    }
}