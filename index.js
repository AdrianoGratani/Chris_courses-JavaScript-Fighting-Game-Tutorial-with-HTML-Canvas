const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0, canvas.width, canvas.height);

const gravity = 0.7;  // a 0.2 salta tanto / a 0.7 salta poco, e atterra in fretta. we don't jump as high as before and we fall pretty quicly
class Sprite{
    constructor({position, velocity, color = 'red'}){

        this.position = position;
        this.velocity = velocity;
        // assegno width per creare le giuste condizioni di esistenza della collisione tra il braccio di player ed il body di enemy, finche' la position di player e' <= enemy.position.x + enemy.WIDTH;
        this.width = 50;  // ora che ho un this.width posso riassegnare width come this. nel draw() di Sprite
        this.height = 150;
        this.lastKey                 // e' nel constructor: vale per ogni istanza;
        // corpo: ATTACK
        this.attackBox = {
            position: this.position,    // il pugno segue la posizione nello spazio del corpo == non si 'stacca'
            width: 100,
            height: 50,
        }
        // il colore default dell'istanza BODY:
        this.color = color;
        this.isAttacking;    // lo do a player. una funzione attack() lo trasforma in true. se sei vicino a enemy fa danno. altrimenti is attacking e' true ma non fa danno. attack() ha un timeout a 100 ms === isAttacking torna false al termine di esso.
    }


draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x , this.position.y, this.width, this.height);
    // attack-color: IL fillStyle va SEMPRE SOPRA fillRect;
    c.fillStyle = 'green';
    // disegna il tuo attacco attackBox usando fillRect:
    c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);  // adesso hai un 'pugno perenne'
}

update(){
    this.draw();
    this.position.x += this.velocity.x      // aggiorna la posizione su x dell'istanza 'player' o 'enemy' basandoty sul valore della velocity dell'istanza su y.
    this.position.y += this.velocity.y;     // aggiorna la posizione su y dell'istanza 'player' o 'enemy' basato sul valore della velocity dell'istanza su y
    
    if(this.position.y + this.height + this.velocity.y >= canvas.height){
        this.velocity.y = 0
    } else this.velocity.y += gravity;
    // `y` sarebbe la testa del rettangolo. height l'altezza ragginunta in salto === i piedi  // gli do canvas.height perche' canvas HTML inizia a calcolare dal TOP verso il bottom
    }

attack(){
    this.isAttacking = true;
    setTimeout(()=> {
        this.isAttacking = false;
    }, 100)
}
}

const player = new Sprite({
    
    position:{
         x: 0,
         y: 0,
        },
    velocity:{
        x: 0,
        y: 0,
    }
});

const enemy = new Sprite({
    
    position:{
         x: 400,
         y: 100,
        },
    velocity:{
        x: 0,
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


function animate(){
    window.requestAnimationFrame(animate);     // crei un infinite loop di animate()
    c.fillStyle = 'black'
    c.fillRect(0,0, canvas.width, canvas.height);
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
    // CONDITIONAL FOR DETECTION
    // detect for collision: SE la position del lato sinistro ,PIU' la lunghezza braccio, di player, tocca il lato destro di enemy ...
    // ma questa condizione e' vera SEMPRE anche se player supera il body di enemy. quindi la collisione avviene a prescindere del contatto!!!
    // serve una condizione aggiuntiva &&.  il player.attackBox.position.x NON DEVE ESSERE >= a enemy.position.x + la sua ampiezza === il suo lato sinistro.
    //  && player.attackBox.position.x <= enemy.position.x // se aggiungo + enemy.width e' false di default
    // questo errore avviene perche' non hai assegnato in precedenza un this.width al constructor. width adesso ci e' necessario assegnarlo ad enemy. una volta definito il this. di width nel constructor, puoi procedere ad assegnare width ad enemy come parametro in questo if statement.
    // il code viene eseguito fino a che il corpo lato sinistro di player non oltrepassa di un px il corpo lato destro di enemy;
    // nuovo problema, SE SALTO, E LA POSIZIONE E' TRUE, LA COLLISIONE E' TRUE ANCHE SE NON STO TOCCANDO IL NEMICO. devo aggiungere &&: il position.y bottom del braccio di player deve essere <= al position.y top del braccio di enemy
    if (
        player.attackBox.position.x + player.attackBox.width >= enemy.position.x
        && player.attackBox.position.x <= enemy.position.x + enemy.width
        && player.attackBox.position.y + player.attackBox.height >= enemy.position.y
        && player.attackBox.position.y <= enemy.position.y + enemy.height
        && player.isAttacking
        ) {
            player.isAttacking = false;                 // cosi' attack vale uno altrimenti si ripete all'infinito.m
            console.log('player_attack');
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