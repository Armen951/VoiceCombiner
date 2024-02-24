import toWav from "audiobuffer-to-wav";

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

class AudioService {
    combinedAudioUrl;
    async combineAudio(audioData1,audioData2){
        try {

            const response1 = await fetch(audioData1.value);
            const arrayBuffer1 = await response1.arrayBuffer();
            const response2 = await fetch(audioData2.value);
            const arrayBuffer2 = await response2.arrayBuffer();


            const audioBuffer1 = await audioContext.decodeAudioData(arrayBuffer1);
            const audioBuffer2 = await audioContext.decodeAudioData(arrayBuffer2);


            const combinedAudioBuffer = audioContext.createBuffer(
                Math.max(audioBuffer1.numberOfChannels, audioBuffer2.numberOfChannels),
                audioBuffer1.length + audioBuffer2.length,
                audioBuffer1.sampleRate
            );

            for (let channel = 0; channel < audioBuffer1.numberOfChannels; channel++) {
                combinedAudioBuffer.getChannelData(channel).set(audioBuffer1.getChannelData(channel));
            }

            for (let channel = 0; channel < audioBuffer2.numberOfChannels; channel++) {
                combinedAudioBuffer.getChannelData(channel).set(audioBuffer2.getChannelData(channel), audioBuffer1.length);
            }

            const combinedBlob = await this.bufferToBlob(combinedAudioBuffer);
            this.combinedAudioUrl = URL.createObjectURL(combinedBlob);

            return this.combinedAudioUrl;
        } catch (error) {
            console.error('Error combining audio files:', error);
        }
    }

    async  bufferToBlob(audioBuffer) {
        const offlineContext = new OfflineAudioContext(
            audioBuffer.numberOfChannels,
            audioBuffer.length,
            audioBuffer.sampleRate
        );


        const bufferSource = offlineContext.createBufferSource();
        bufferSource.buffer = audioBuffer;

        bufferSource.connect(offlineContext.destination);

        bufferSource.start();


        const renderedBuffer = await offlineContext.startRendering();


        const wav = this.audioBufferToWav(renderedBuffer);
        const blob = new Blob([new Uint8Array(wav)], { type: 'audio/wav' });

        return blob;
    }


     audioBufferToWav(buffer) {
        return toWav(buffer);
    }

}


export default new AudioService();
