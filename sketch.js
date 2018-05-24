//-----------------
// Variables
//-----------------
var song;
var particleSystems = [];
var amp;
var mesmers = []
var oldBeats = [0, 0, 0, 0]
var diff = .06
let bool = true;
let p;
var backgroundCol = 245;
let songs = [ 
  {
    loc: 'Feel.mp3',
    name: 'Feel it Still',
    artist: 'Portugal. The Man'
  },
  {
    loc:'Paris.mp3',
    name: 'Paris',
    artist: 'The Chainsmokers'
  },
  {
    loc: 'Ooka.mp3',
    name: 'Hooked on a Feeling',
    artist: 'Blue Swede'
  },
  {
    loc: 'Gooey.mp3',
    name: 'Gooey',
    artist: 'Glass Animals'
  },
  {
    loc: 'Flori.mp3',
    name: 'Floridada',
    artist: 'Animal Collective'
  },
  {
    loc: 'Blue.mp3',
    name: 'Mr.Blue Sky',
    artist: 'Electric Light Orchestra'
  },
  {
    loc: 'Gud.mp3',
    name: 'Feel Good Inc.',
    artist: 'Gorillaz'
  },
  ];
let currSong = 0;
let currSongName = 'Feel it Still';

//-----------------
// p5 Built-Ins
//-----------------
function preload() {
  song = loadSound('Feel.mp3');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  // Drag n drop stuff

  createCanvas(window.innerWidth, window.innerHeight);
  angleMode(RADIANS);
  frameRate(30);
  colorMode(HSB, 255, 255, 255, 1)
  background(backgroundCol)

  // Music Logic
  amp = new p5.Amplitude();
  song.play(); // song is ready to play during setup() because it was loaded during preload

  // song.onended(() => {
  //   newSong(songs[++currSong % songs.length])
  // });

  // Drag n Drop Zone
  let dropzone = createP('Drag your own mp3 file here!')
  dropzone.addClass('dropzone')
  dropzone.dragOver(hilight);
  dropzone.dragLeave(unhilight);
  dropzone.drop(handleDrop, unhilight);

  // Song Info
  p = createP(`Feel It Still - Portugal. The Man`);

  // Change Style
  let changeStyle = createButton("Change Style")
  changeStyle.mousePressed(() => {
    background(backgroundCol);
    bool = !bool;
  });

  // Change Current Song
  let last = createButton("Last Song");
  last.mousePressed(
    () => {
      newSong(songs[--currSong % songs.length])
    }
  );

  let next = createButton("Next Song");
  next.mousePressed(() => {
    newSong(songs[++currSong % songs.length])
    }
  );

  sel = createSelect();
  for(var i=0; i<songs.length; i++) {
    sel.option(`${i+1}. ${songs[i].name} - ${songs[i].artist}`);
  }

  sel.changed(() => {
    newSongIdx = (+sel.value()[0]) - 1;
    if(currSong !== newSongIdx) {
      currSong = newSongIdx;
      newSong(songs[currSong]);
    }
  });

  createP(`Press the left and right arrows or drag an mp3 above to change songs. On mobile you might have to tap the space above a couple of times in order to first start the song. Enjoy!`);
}

function draw() {
  // Case 1 = Run ParticleSystems
  //----------------------------------
  if (!bool) {
    let frames = frameCount;
    let level = amp.getLevel();

    // Clear frames to scale growth later
    if (particleSystems.length >= 36) {
      particleSystems.slice(18);
    }

    // Create new systems every 90 frames (3 seconds)
    if (frames % 90 === 1) {
      for (var i = 0; i < 7; i++) {
        createSystem(0, width, 0, height, true);
      }
      for(var i=0; i<5; i++) {
        createSystem(0, width, 0, height, false);
      }
    }

    // Refresh systems already in place
    for (var i = 0; i < particleSystems.length; i++) {
      particleSystems[i].resize(level);
    }

  }

  // Case 2 = Run Mesmer Bloom (default)
  //----------------------------------
  if (bool) {
    background(0, 0, backgroundCol);

    let beat = amp.getLevel()
    let averageDiff = 0

    for (let i = 0; i < oldBeats.length - 1; i++) {
      averageDiff += abs(oldBeats[i] - oldBeats[i + 1])
    }
    let sum = 0
    for (let i = 0; i < oldBeats.length; i++) {
      sum += oldBeats[i]
    }
    let average = sum / 4
    averageDiff = averageDiff / 4
    if (beat - average > averageDiff) {
      mesmers.push(new Mesmer(beat * 10))
      mesmers[mesmers.length - 1].init(beat * 10 % 15 + 3)
    }
    oldBeats.push(beat)
    oldBeats = oldBeats.slice(-4)



    mesmers = mesmers.filter((mes) => {
      return mes.age < 1
    })
    mesmers.forEach((mes) => {
      mes.draw()
    })
  }

}

// Pause/play on click
function mousePressed() {
  if (song.isPlaying()) { // .isPlaying() returns a boolean
    song.pause(); // .play() will resume from .pause() position
  } else {
    song.play();
  }
}

function keyPressed() {
  if (key == ' ') {
    background(0, 0, 215)
    bool = !bool
  }
  if (keyCode == RIGHT_ARROW) {
    newSong(songs[++currSong % songs.length]);
  }
  if (keyCode == LEFT_ARROW) {
    newSong(songs[--currSong % songs.length]);
  }
}

//----------------------------
// Helper Functions
//----------------------------
function hilight() {
  dropzone.style("background-color", "#ccc");
}

function unhilight() {
  dropzone.style("background-color", "#fff");
}

function handleDrop(mp3) {
  p.html(mp3.name);
  song.stop();
  loadSound(mp3.data, (newSong) => {
    song.stop();
    song = newSong;
    song.play();
  })
}

function newSong (newSongObj) {
  if(newSongObj.name !== currSongName) {
    currSongName = newSong.name;
    p.html(newSongObj.name + '-' + newSongObj.artist);

    loadSound(newSongObj.loc, (newSong) => {
      song.stop();
      song = newSong;
    })
  }
}

function createSystem(xStart, xEnd, yStart, yEnd, alt) {
  let size = Math.floor(random(200, 755));
  let rWidth = Math.floor(random(xStart + size / 8, xEnd - size / 8));
  let rHeight = Math.floor(random(yStart + size / 8, yEnd - size / 8));
  let rSides = Math.floor(random(3, 6));
  let currSystem = alt ?
    new altParticleSystem(rWidth, rHeight, 100, rSides) :
    new ParticleSystem(rWidth, rHeight, 100, rSides);
  currSystem.init();
  particleSystems.push(currSystem);
}
