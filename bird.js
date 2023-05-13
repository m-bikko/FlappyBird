let score = 0;
let max_score = 0;

const flapSound = {
    flapAudio: new Audio('flappy-bird-assets-master/audio/wing.wav'),
    play: function() {
        this.flapAudio.play();
    }
};

const dieSound = {
    dieAudio: new Audio('flappy-bird-assets-master/audio/hit.wav'),
    play: function() {
        this.dieAudio.play();
    }
};

const bird = {
    x: 50,
    y: 50,
    radius: 20,
    gravity: 0.5,
    velocity: 0,
    jump: 10,
    flap: function() {
        this.velocity = -this.jump;
        flapSound.play();
    },
};

let game_state = "Start";
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && game_state === "Start") {
        start_game();
    } else if (game_state === "Play") {
        bird.flap();
    }
});

function start_game() {
    game_state = "Play";
    const tapText = document.querySelector('.tap')
    tapText.style.display = 'none';
    generateColumn();
    update();
}

function update() {
    if (game_state === "Play") {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
        bird.y = Math.min(bird.y, 550);
        if (bird.y >= 550) {
            score++;
            gameOver();
            dieSound.play();
            bird.y = 550;
        }
        const birdElement = document.getElementById('bird');
        birdElement.style.top = bird.y + 'px';
    }
}

function generateColumn() {
    const gameArea = document.querySelector('.game-area');
    gameArea.style.display = 'flex';
    gameArea.style.flexDirection = 'row';
    let columnCount = 0;


    setInterval(()=>{
        const div1 = document.querySelector('.bird');
        const div2 = document.querySelectorAll('.top');
        const div3 = document.querySelectorAll('.bottom');

        function doDivsOverlap(div1, div2) {
            const rect1 = div1.getBoundingClientRect();
            for (let i = 0; i < div2.length; i++) {
                const rect2 = div2[i].getBoundingClientRect();
                if (!(rect1.right < rect2.left ||
                    rect1.left > rect2.right ||
                    rect1.bottom < rect2.top ||
                    rect1.top > rect2.bottom)) {
                    return true;
                }
            }
            return false;
        }

        if (doDivsOverlap(div1, div2) || doDivsOverlap(div1, div3)) {
            gameOver();
        }

    }, 20);

    setInterval(() => {
        setInterval(() => {
            const columns = document.querySelectorAll('.column');

            columns.forEach((column) => {
                let margin = parseInt(column.style.marginLeft) || 0;
                setInterval(() => {
                    margin += 5;
                    column.style.marginLeft = `${margin}px`;
                }, 30);
            });
        }, 2000);

        const Column = document.createElement('div');

        const topColumn = document.createElement('div');
        topColumn.classList.add('column', 'top');
        topColumn.style.height = `${Math.random() * 250 + 10}px`;
        topColumn.style.width = '80px';
        topColumn.style.backgroundColor = 'red';
        topColumn.style.marginBottom = '180px';
        Column.appendChild(topColumn);

        const bottomColumn = document.createElement('div');
        bottomColumn.classList.add('column', 'bottom');
        bottomColumn.style.width = '80px';
        bottomColumn.style.height = `calc(100% - ${topColumn.style.height} - 200px)`;
        bottomColumn.style.backgroundColor = 'red';
        Column.appendChild(bottomColumn);
        gameArea.appendChild(Column);
        gameArea.style.justifyContent = 'flex-end'
        columnCount++;
        score++;

    }, 2000);
}

function gameOver() {
    game_state = "GameOver";
    const go = document.querySelector('.game_over');
    go.style.display = 'block'

    const sc = document.querySelector('.score');
    const msc = document.querySelector('.max_score');
    sc.textContent = score - 1 + '';
    msc.textContent = max_score + '';
}

setInterval(update, 20);
