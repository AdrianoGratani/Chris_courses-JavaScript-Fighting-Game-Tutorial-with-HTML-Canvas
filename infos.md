### JavaScript Fighting Game Tutorial with HTML Canvas

### https://www.youtube.com/watch?v=vyqbNFMDRGQ

## description
    Here you'll learn how to create your very first fighting game with JavaScript and HTML canvas. We'll start by coding some basic fighting game mechanics, then we'll take things to the next level by adding in professional sprite sheets and graphics.

    Google Drive Assets: https://drive.google.com/drive/folder...

    Finished Demo: https://chriscourses-fighting-game.ne...
    Source Code: https://github.com/chriscourses/fight...

    Oak Woods Assets: https://brullov.itch.io/oak-woods
    Fighter Asset #1: https://luizmelo.itch.io/martial-hero
    Fighter Asset #2: https://luizmelo.itch.io/martial-hero-2

# step-by-step:

  PROJECT SETUP
  CREATE PLAYER AND ENEMY
  ATTACKS
  HEALTH BAR INTERFACE
  GAME TIMERS AND GAME OVER

    0:00 Introduction
    0:43 Project Setup
    8:07 Create Player and Enemy
    28:00 Move Characters with Event Listeners
    50:12 Attacks
    1:11:31 Health Bar Interface
    1:34:27 Game Timers and Game Over
    1:51:27 Background Sprite
    2:05:10 Shop Sprite with Animation
    2:23:08 Player Sprite - Idle
    2:36:24 Player Sprite - Run
    2:43:39 Player Sprite - Jump
    2:58:03 Player Sprite - Attack
    3:01:53 Enemy Sprite - Kenji
    3:07:04 React to Sprite Attacks
    3:20:32 Receive Hit Animation
    3:29:11 Death Animation
    3:35:32 Interface Design and Animation
    3:49:55 Push Live
    3:55:57 End




### NOTES
   HELLO
   ricorda di includer lo script di js in HTML, SOTTO canvas

   const canvas prende il canvas da html
   cons c seleziona il contesto come gli sprite etc e gli da un 2d
   usa il metodo .getContext()
   la dimensione dello schermo del gioco la gestisci con .width ed .height

   .fillRect()definisce il canva a livello visivo = lo fa 'esistere'
   .fillRect() e' un API
   0,0 e' in alto a sinistra, parte da li' poi gli da' width full e height full
   e' come se si espandesse;

   //////////
   CREATE PLAYER AND ENEMY
   inizia con rettangoli
   perche' e' difficile altrimenit
   usi i 'rettangoli' per esercitarti

   abbiamo bisogno che quetsi rettangoli interagiscano tra di loro
   perquesto usiamo object oriented prohramming
   ovvero usiamo le classi ed istanze
   usi la class come blueprint
   e la chiami Sprite anche se all'inizio sar' solou n rettangolo
   DAGLI la position
   crea una property position e dala ad un this.
   qindi position verra' passato come parametro, al constructor

   crey un nuov sprite e lo affidi a un player
   questa e' una STANZA della classe
   gli dauy una posizione con x ed y keys
   per verificare che il to istance della clase
   sia stata creat a con successo,
   fai consolelog della variabile che la contiene
   
   now we have to decide what the player should looks like
   use the draw() method (random name)
   e dentro usi c.fillRect(this.position.x)
   fai reference di x ed y ed un colore
   con fill STyle
   adesso con tali cordinate esiste un
   ponte tra l'istanza e il draw()
   quindi puoi fare player.draw()
   e il tuo 'personaggio'' comparira' nello schermo
    
    poi crei una nuova istanza con enemy
    che prende un new Sprite
    e dagli  x ed y anche a lui

    poi fai enemydraw();

    /// FAI MUOVERE IL PERSONAGGIO
    usa requeestAnimationFrame() e dallo a
    window
    dai questo ad una funzione che si
    chiama animate(){}
    is an INFNITE LOOP
    for a FRAME A FRAME
    YOU CAN TEST HOW IT WORKS BY APPLYING A  `CONSOLE.LOG()` TO the function


  // creare l'evvetto di gravita;
     usa la key velocity ed affidala al constructor
     poi mandala alle istanze.
     velocity, come position, ha due keys `x` ed `y` with both values set to 0 by default.
     mentreposition `x` ed `y` di enemey sono in un luogo del canva diverso per non sovrapporsi

     
     // MUOVI IL PERSONAGGIO
     aggiungi nella CLASSE un metodo e chiamlo update()
     METTI draw() ed update() DENTRO animate()
     BASTA CHE CHIAMI update()
     in quanto update() contiene entrambi()
     so that they will get calleddd for
     EVERY FRAME of the game
