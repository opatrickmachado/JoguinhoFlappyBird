let move_speed = 3, grativy = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

let ranking = [];

if(localStorage.getItem('ranking')){
    ranking = JSON.parse(localStorage.getItem('ranking'));
}

let bird_dy = 0;

document.addEventListener('keydown', (e) => {
    if(e.key == 'ArrowUp' || e.key == ' '){
        img.src = 'images/Bird-2.png';
        bird_dy = -7.6;
    }
});

document.addEventListener('keyup', (e) => {
    if(e.key == 'ArrowUp' || e.key == ' '){
        img.src = 'images/Bird.png';
    }
});

document.addEventListener('touchstart', (e) => {
    img.src = 'images/Bird-2.png';
    bird_dy = -7.6;
});

document.addEventListener('touchend', (e) => {
    img.src = 'images/Bird.png';
});

function startGame(e) {
    if(game_state != 'Play'){
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });
        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        play();
    }
}

document.addEventListener('touchstart', startGame);
document.addEventListener('keydown', (e) => {
    if(e.key == 'Enter') {
        startGame(e);
    }
});

function play(){
    function move(){
        if(game_state != 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if(pipe_sprite_props.right <= 0){
                element.remove();
            }else{
                if(bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width && bird_props.left + bird_props.width > pipe_sprite_props.left && bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height && bird_props.top + bird_props.height > pipe_sprite_props.top){
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Pressione Enter Para Recomeçar';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
                    updateRanking(parseInt(score_val.innerHTML));
                    return;
                }else{
                    if(pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == '1'){
                        score_val.innerHTML =+ score_val.innerHTML + 1;
                        sound_point.play();
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    function apply_gravity(){
        if(game_state != 'Play') return;
        bird_dy = bird_dy + grativy;

        if(bird_props.top <= 0 || bird_props.bottom >= background.bottom){
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;
    let pipe_gap = 35;

    function create_pipe(){
        if(game_state != 'Play') return;

        if(pipe_seperation > 115){
            pipe_seperation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite);
        }
        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}

function updateRanking(score){
    ranking.push(score);

    ranking.sort(function(a, b){
        return b - a;
    });

    if(ranking.length > 5){
        ranking.pop();
    }

    localStorage.setItem('ranking', JSON.stringify(ranking));
    displayRanking(); // Atualiza o ranking na página
}

function displayRanking() {
    let rankingList = document.querySelector('.ranking_list');
    rankingList.innerHTML = ''; // Limpar a lista atual

    ranking.forEach((score, index) => {
        let listItem = document.createElement('li');
        listItem.textContent = `Posição ${index + 1}: ${score}`;
        rankingList.appendChild(listItem);
    });
}

// Chame essa função sempre que atualizar o ranking
displayRanking();
