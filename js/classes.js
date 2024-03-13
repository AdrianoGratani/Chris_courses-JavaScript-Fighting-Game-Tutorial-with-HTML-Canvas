
class Sprite{
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}}){    // 1 e' un valore di fallback, per chi non lo usa//  inizializza scale nell'istanza per maggiore precisione
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image()                   // create a new HTML image but within js properties da dare al draw() , poi la devi implementare in index.js come istanza e mandarla al drw() o update()
        this.image.src = imageSrc
        this.scale = scale                       // mandalo 2.5 per shop
        this.framesMax = framesMax               // sara' 6 per shop in quanto ne hai sei
        this.framesCurrent = 0    // background ha un solo frame quindi moltiplico 0 per frames = 0 altrimenti mostrerebbe lo schermo nero
        this.framesElapsed = 0
        this.framesHold = 10
        this.offset = offset
        }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),                // per mostrare perfetttamente un solo frame dello shops
            0,
            
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,              // dato che voglio ridimensionare shop, devo aggiungere un modo per farlo tramite draw() . non usare data statico che affetta pure le altre istanze
            this.image.height * this.scale
            )
    }

    animateFrames() {
        this.framesElapsed++

        if(this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1 ){
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    update(){
        this.draw();
        this.framesElapsed++
        this.animateFrames()
    }
}

class Fighter extends Sprite{
    constructor({
        
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1, framesMax = 1,
        offset = {x: 0, y: 0}})
        {   // !!!!!!!! se non mandi le proprieta' come parametri, lo scope interno non le sa leggere === ricevi un errore 'undefined' nel browser
        super({     // super is meant specifically for constructor inheritance from the class you're 'extend' from
            position,
            imageSrc,  // this.image, from Sprite constructor()
            scale,
            framesMax,
            offset
        })

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
        // from the extended class. not parametered properties so the super() created errors
        this.framesCurrent = 0    // background ha un solo frame quindi moltiplico 0 per frames = 0 altrimenti mostrerebbe lo schermo nero
        this.framesElapsed = 0
        this.framesHold = 10
    }

   

    update(){
        this.draw();
        this.animateFrames()
        
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x           // devi riaggiornare la posizione del pugno accordinlgy alla posizione del corpo // offset serve per posizionare i due bracci dei personaggi
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x      // aggiorna la posizione su x dell'istanza 'player' o 'enemy' basandoty sul valore della velocity dell'istanza su y.
        this.position.y += this.velocity.y;     // aggiorna la posizione su y dell'istanza 'player' o 'enemy' basato sul valore della velocity dell'istanza su y
        
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 94){
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
