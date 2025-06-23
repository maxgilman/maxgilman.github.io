const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
const audioElement = document.querySelector("audio");
const track = audioContext.createMediaElementSource(audioElement);
track.connect(audioContext.destination);
//track.load();
document.addEventListener(
    "click",
    () => {
      // Check if context is in suspended state (autoplay policy)
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }
      audioElement.currentTime=0;
    audioElement.play();
    },
    false,
  );
/*function playSound(sound){
    sound.currentTime = 0;
    sound.play();
}*/