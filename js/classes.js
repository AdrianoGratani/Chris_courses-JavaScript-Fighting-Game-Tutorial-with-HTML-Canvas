class Sprite{
    constructor({position, velocity, color = 'red', offset}){    // !!!!!!!! se non mandi le proprieta' come parametri, lo scope interno non le sa leggere === ricevi un errore 'undefined' nel browser

        this.position = position;
        this.velocity = velocity;
        // assegno width per creare le giuste condizioni di esistenza della collisione tra il braccio di player ed il body di enemy, finche' la position di player e' <= enemy.position.x + enemy.WIDTH;
        this.width = 50;  // ora che ho un this.width posso riassegnare width come this. nel draw() di Sprite
        this.height = 150;
        this.lastKey                 // e' nel constructor: vale per ogni istanza;
        // corpo: ATTACK
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },                                                      // il pugno segue la posizione nello spazio del corpo == non si 'stacca'  // va bene pure lo shorthand `offset,` per non ripertersi    // un altra proprieta' dinamica: per gestire la posizione del braccio per i due personaggi (player: braccio verso dx / enemy: braccio verso sinistra) // offset, ovviamente, viene creato nella classe, ma gestito ed 'iniializzato' nell'istanza  ...player o enemy
            offset: offset,

            width: 100,
            height: 50,
        }
        // il colore default dell'istanza BODY:
        this.color = color;
        this.isAttacking;    // lo do a player. una funzione attack() lo trasforma in true. se sei vicino a enemy fa danno. altrimenti is attacking e' true ma non fa danno. attack() ha un timeout a 100 ms === isAttacking torna false al termine di esso.
       
        // health
        this.health = 100;
    }

draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x , this.position.y, this.width, this.height);    // replace 50 usando this.width

    
    // conditional per far comparire il pugno quando il giocatore preme ' ';
    // premi ' ' / isAttacking e' true con timeout 100ms : 1. si attiva questo draw() => compare il pugno  // 2. la funzione attack() viene chiamata [SE VENGONO SODDISFATTE ANCHE LE SUE ALTRE CONDIZIONI];
    if(this.isAttacking){
        // attack-color: IL fillStyle va SEMPRE SOPRA fillRect;
        c.fillStyle = 'green';
        // disegna il tuo attacco attackBox usando fillRect:
        c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);  // adesso hai un 'pugno perenne'
    }
}

update(){
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x           // devi riaggiornare la posizione del pugno accordinlgy alla posizione del corpo // offset serve per posizionare i due bracci dei personaggi
    this.attackBox.position.y = this.position.y

    this.position.x += this.velocity.x      // aggiorna la posizione su x dell'istanza 'player' o 'enemy' basandoty sul valore della velocity dell'istanza su y.
    this.position.y += this.velocity.y;     // aggiorna la posizione su y dell'istanza 'player' o 'enemy' basato sul valore della velocity dell'istanza su y
    
    if(this.position.y + this.height + this.velocity.y >= canvas.height){
        this.velocity.y = 0
    } else this.velocity.y += gravity;
    // `y` sarebbe la testa del rettangolo. height l'altezza ragginunta in salto === i piedi  // gli do canvas.height perche' canvas HTML inizia a calcolare dal TOP verso il bottom
    }

attack(){
    console.log('attack()')             // for debugging
    this.isAttacking = true;
    setTimeout(()=> {
        this.isAttacking = false;
    }, 100)                     // ricorda che in attack() hai sttato subito isAttacking su false === a prescindere di questo Settimeout l'animazione del braccio e' brevissima quando le condizioni di collisione sono soddisfatte;
}
}

class Fighter{
    constructor({position}){
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        }

    draw() {}

    update(){
        this.draw();
        }
}
