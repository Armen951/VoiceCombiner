<template>
  <div id="app">
    <RecordingButton @triggerRecording="record" :isRecording="isRecording1" :item-index="1" />
    <RecordingButton v-if="audioData1" @triggerRecording="record" :isRecording="isRecording2" :item-index="2"  />
    <button @click="combineAudios" v-if="audioData1 && audioData2">Combine</button>
    <audio v-if="combinedAudioUrl" :src="combinedAudioUrl" controls></audio>
  </div>
</template>

<script>
import { ref } from 'vue';
import AudioService from "@/services/AudioService";
import RecordingButton from "@/components/RecordingButton.vue";
export default {
  name: 'AudiosCombiner',
  components: {
    RecordingButton
  },
  setup() {
    const isRecording1 = ref(false);
    const isRecording2 = ref(false);
    const audioData1 = ref(null);
    const audioData2 = ref(null);
    const combinedAudioUrl = ref(null);
    const mediaRecorder = ref(null);

    const record = async (trackNumber) => {
      if(trackNumber === 1) {
        if(isRecording1.value) {
          stopRecording(trackNumber);
        } else {
          startRecording(trackNumber)
        }
      } else {
        if(isRecording2.value) {
          stopRecording(trackNumber);
        } else {
          startRecording(trackNumber)
        }
      }
    }
    const startRecording = async (trackNumber) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        mediaRecorder.value = new MediaRecorder(stream);

        const audioChunks = [];

        mediaRecorder.value.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.value.onstop = () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          if (trackNumber === 1) {
            audioData1.value = audioUrl;
          } else {
            audioData2.value = audioUrl;
          }
        };

        mediaRecorder.value.start();
        if (trackNumber === 1) {
          isRecording1.value = true;
        } else {
          isRecording2.value = true;
        }
      } catch (error) {
        console.error('Error starting audio recording:', error);
      }
    };

    const stopRecording = (trackNumber) => {
      mediaRecorder.value.stop();
      if (trackNumber === 1) {
        isRecording1.value = false;
      } else {
        isRecording2.value = false;
      }
    };

    const combineAudios = async () => {
      let combined =  await AudioService.combineAudio(audioData1,audioData2);
      combinedAudioUrl.value = combined;
    }

    return {
      isRecording1,
      isRecording2,
      audioData1,
      audioData2,
      combinedAudioUrl,
      startRecording,
      stopRecording,
      combineAudios,
      record
    };
  }
}
</script>

<style>

button {
  margin: 5px;
  padding: 10px;
  font-size: 16px;
}

audio {
  margin-top: 15px;
}
</style>
