
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0, canvas.width, canvas.height);

const gravity = 0.7;  // a 0.2 salta tanto / a 0.7 salta poco, e atterra in fretta. we don't jump as high as before and we fall pretty quicly


const background = new Sprite({           // devi mandarlo in animate() e fare il suo .update()
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})


const player = new Fighter({
    
    position:{
         x: 0,
         y: 0,
        },
    velocity:{
        x: 0,
        y: 0,
    },
    offset: {   //bug solved HAI BUTTATO DUE ORE PERCHE TI SEI DIMENTICATO `.x` di offset in `update()           // lo crei nel constructor della classe, lo inizializzi nelle istanze, lo mandi ad update() per animare la posizione del braccio.
        x: 0,
        y: 0,
    }
});

const enemy = new Fighter({
    
    position:{
         x: 400,
         y: 100,
        },
    velocity:{
        x: 0,
        y: 0,
    },
    offset: {
        x: -50,       // valore negativo, ma non lasciarti fuorviare dall'uso in update(): si usaa `+` per questioni di sintassi
        y: 0,
    },
    color : 'blue'    // this.color e' red di default nel constructor. ma puoi cambiarlo nell'istanza
});

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
}

// let lastKey; [got rid of it since I appointed player.lastKey from the class to take care of it]        // lastKey conserva l'ultima key premuta tra  'a' o 'd' perche' viene riaggiornata tramite il keydown event listener
                     // a che serve? se premo 'a' && 'a' e' lastKey, allora si verifica il movimento su asse X. stesso discorso per 'd'. altrimenti, senza lastKey,
                     // se premo 'd' e poi 'a' il personaggio si sposta a sinistra. ma se premo PRIMA 'a' e poi 'd' 'd' non viene ascoltato, perche' animate() presenta
                     // come prima condizione 'a' premuto. e dato che mentre premo 'd' sto sempre tenendo premuto 'a', viene accessa solo la condizione 'a' e non l'else if.


function rectangularCollision({ rectangle1, rectangle2 }){   // !!!per far funzionare questa funzione, ha bisogno di una reference a `player.attackBox` ed `enemy.position` : `rectangle1` = player / `rectangle2` = enemy
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}


// TIMER AND CONDITIONALS FOR WINNING TEXT DISPLAY AND TIMER

function determineWinner({player, enemy, timerId}) {
    document.querySelector('#displayText').style.display = 'flex';
    clearTimeout(timerId);
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = "Tie";
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player Wins';
    } else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Enemy Wins';
    }
}

let timer = 60;
let timerId;
function decreaseTimer(){
    if (timer >  0){
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer;
    }
    if (timer === 0) {
        determineWinner({player, enemy, timerId})
    }
}
decreaseTimer();


// GAME ANIMATION: MOVEMENTS, AND CANVAS FRAME-BY-FRAME REFACTORING FOR UPDATES

function animate(){
    window.requestAnimationFrame(animate);     // crei un --- infinite  loop --- di animate()
    c.fillStyle = 'black'
    c.fillRect(0,0, canvas.width, canvas.height);

    background.update()
    player.update();
    enemy.update();
    // console.log(player.position.x)
    player.velocity.x = 0; // altrimenti va avanti all'infinito. keyup non basta a fermarlo
    enemy.velocity.x = 0; // mine
    
    // player right left movement animation. conditional to check the last key pressed:
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5;
    } else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5;
    }

    // enemy right left movement animation. conditional to check the last key pressed:
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5;
    } else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5;
    }
    // CONDITIONAL FOR player
    // detect for collision: SE la position del lato sinistro ,PIU' la lunghezza braccio, di player, tocca il lato destro di enemy ...
    // ma questa condizione e' vera SEMPRE anche se player supera il body di enemy. quindi la collisione avviene a prescindere del contatto!!!
    // serve una condizione aggiuntiva &&.  il player.attackBox.position.x NON DEVE ESSERE >= a enemy.position.x + la sua ampiezza === il suo lato sinistro.
    //  && player.attackBox.position.x <= enemy.position.x // se aggiungo + enemy.width e' false di default
    // questo errore avviene perche' non hai assegnato in precedenza un this.width al constructor. width adesso ci e' necessario assegnarlo ad enemy. una volta definito il this. di width nel constructor, puoi procedere ad assegnare width ad enemy come parametro in questo if statement.
    // il code viene eseguito fino a che il corpo lato sinistro di player non oltrepassa di un px il corpo lato destro di enemy;
    // nuovo problema, SE SALTO, E LA POSIZIONE E' TRUE, LA COLLISIONE E' TRUE ANCHE SE NON STO TOCCANDO IL NEMICO. devo aggiungere &&: il position.y bottom del braccio di player deve essere <= al position.y top del braccio di enemy
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        })    // dagli come parametro un oggetto, dove alla kwy parametro1 affidi il suo valore `player`/ alla key parametro2 affidi `enemy
        && player.isAttacking
        ) {
            player.isAttacking = false;                 // cosi' attack vale uno altrimenti si ripete all'infinito.
            enemy.health -= 20;
            document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    };
    // enemy CONDITIONAL FOR COLLISION:
    if (
        rectangularCollision({ rectangle1: enemy, rectangle2: player })     // basta che inverti i parametri
        && enemy.isAttacking
        ) {
            enemy.isAttacking = false;
            player.health -= 20;
            document.querySelector('#playerHealth').style.width = player.health + '%';
    }

    // end game based on health:
    if (player.health <= 0 || enemy.health <= 0){
        determineWinner({player, enemy, timerId});
    }
}
animate();



window.addEventListener('keydown',(event) => {// premi il tasto e succede qualcosa;
    // console.log('keydown:', event.key);   // ti mostra in console il tasto che premi

   switch(event.key){
    case 'd':
        keys.d.pressed = true;   // "muoviti un pixel sull'asse x per ogni volta che fai loop over animate";
                               //player.velocity.x = 0.001;
        player.lastKey = 'd';
        
        break;
    case 'a':
        keys.a.pressed = true;
        player.lastKey = 'a';
        break;
    case 'w':
        player.velocity.y = -20;
        break;
    case ' ':
        console.log('case space')                                                                                    // for debugging purposes;
        player.attack();
        break;

        // enemy keydown buttons:
    case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight'
        break;
    case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastKey= 'ArrowLeft';
        break;
    case 'ArrowUp':
        enemy.velocity.y = -20;
        break;
        case 'ArrowDown':
        enemy.isAttacking = true;
        console.log('enemy_attacks')                                                                                // for debugging
        enemy.attack();
        break;
   }
})

window.addEventListener('keyup', (event) => {   // alzi il tasto,  succede qualcosa.
    // console.log('keyup:', event.key);   // ti mostra in console il tasto che alzi

   switch(event.key){                   // se alzi il dito da `d` succede qualcosa.
    case 'd':
        keys.d.pressed = false;
        // lastKey = 'a';     se alzi 'd' ma il tasto 'a' resta premuto, allora 'a' if statement e' true
        break;
    
    case 'a':
        keys.a.pressed = false;
        // lastKey = 'd';     se alzi 'a' ma 'd' continui a premerlo, allora 'd' else if statement e' true;
        break;
     case 'w':
        keys.w.pressed = false;
        break;
   }

//    enemy keyup buttons:
   switch(event.key){
    case 'ArrowRight':
        keys.ArrowRight.pressed = false;
        // enemy.lastKey = 'ArrowLeft'; // mine
        break;
    case 'ArrowLeft':
        keys.ArrowLeft.pressed = false;
        // enemy.lastKey = 'ArrowRight';  //mine
        break;
   }
})