const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0, canvas.width, canvas.height);

const gravity = 0.2
class Sprite{
    constructor({position, velocity}){

        this.position = position;
        this.velocity = velocity;
        this.height = 150;
    }


draw() {
    c.fillStyle = 'red';
    c.fillRect(this.position.x , this.position.y, 50, this.height);
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
    }
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
}

let lastKey;         // lastKey conserva l'ultima key premuta tra  'a' o 'd' perche' viene riaggiornata tramite il keydown event listener
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
    player.velocity.x = 0;
    
    if(keys.a.pressed && lastKey === 'a'){
        player.velocity.x = -1;
    } else if(keys.d.pressed && lastKey === 'd'){
        player.velocity.x = 1;
    }
}
animate();



window.addEventListener('keydown',(event) => {// premi il tasto e succede qualcosa;
    console.log('keydown:', event.key);

   switch(event.key){
    case 'd':
        keys.d.pressed = true;   // "muoviti un pixel sull'asse x per ogni volta che fai loop over animate";
                               //player.velocity.x = 0.001;
        lastKey = 'd';
        break;
    case 'a':
        keys.a.pressed = true;
        lastKey = 'a';
        break;
    case 'w':
        player.velocity.y = -10;
        break;
   }
})

window.addEventListener('keyup', (event) => {   // alzi il tasto,  succede qualcosa.
    console.log('keyup:', event.key);

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
})