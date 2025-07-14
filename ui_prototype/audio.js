var $kt = $kt || {};

(() => {

    class KantoreAudio {

        constructor() {
            this._player = new AudioPlayer(1, 1);
            this.tracks = {
                BGM_TRACK: { name: 'Juhani Junkala [Retro Game Music Pack] Level 1.ogg', volume: 0.3 },
                SE_TEST_1: { name: '7.ogg' },
                SE_TEST_2: { name: 'Jingle_Achievement_01.ogg' },
                SE_TEST_2_HIGH: { name: 'Jingle_Achievement_01.ogg', speed: 1.2 },
                SE_TEST_2_LOW: { name: 'Jingle_Achievement_01.ogg', speed: 0.8 }
            };

            // Settings default parameters when missing
            Object.entries(this.tracks).forEach(([track, trackData]) => {
                trackData.volume ??= 1;
                trackData.speed ??= 1;
                trackData.buffer = this._player.loadTrack(trackData.name);
            });

            this._restoreSavedSettings();
        }

        /**
         * 
         * @param { { buffer: Promise<AudioBuffer>, volume: number, speed: number } } track 
         * @param {number} [volume=1] 
         * @param {number} [speed=1] 
         */
        async playBgm(track, volume = 1, speed = 1) {
            return track.buffer.then(buffer => this._player.playBgm(buffer, track.volume * volume, track.speed * speed));
        }

        /**
         * 
         * @param { { buffer: Promise<AudioBuffer>, volume: number, speed: number } } track 
         * @param {number} [volume=1] 
         * @param {number} [speed=1] 
         */
        async playEffect(track, volume = 1, speed = 1) {
            return track.buffer.then(buffer => this._player.playEffect(buffer, track.volume * volume, track.speed * speed));
        }

        stopBgm() {
            this._player.stopBgm();
        }

        /**
         * 
         * @param {number} newVolume in range 0-1
         */
        bgmVolumeChange(newVolume) {
            this._player.bgmVolumeChange(newVolume);
        }

        /**
         * 
         * @param {number} newVolume in range 0-1
         */
        seVolumeChange(newVolume) {
            this._player.seVolumeChange(newVolume);
        }

        _restoreSavedSettings() {
            this.bgmVolumeChange($kt.settings.bgmVolume);
            this.seVolumeChange($kt.settings.seVolume);
        }

    }

    class AudioPlayer {

        /**
         * 
         * @param {number} bgmVolume range 0-1
         * @param {number} seVolume range 0-1
         */
        constructor(bgmVolume, seVolume) {
            this._bgmVolume = bgmVolume;
            this._seVolume = seVolume;
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this._audioCtx = new AudioContext();
            this._currentBgm = null;
        }

        /**
         * 
         * @param {string} trackName 
         * @returns {Promise<AudioBuffer>}
         */
        async loadTrack(trackName) {
            const response = await fetch(`audio/${trackName}`);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this._audioCtx.decodeAudioData(arrayBuffer);
            return audioBuffer;
        }

        playBgm(track, volume, speed) {
            if (this._currentBgm !== null && this._isSameTrack(track, this._currentBgm.source)) {
                return;
            }

            if (this._currentBgm !== null) {
                this._currentBgm.source.stop();
            }

            this._currentBgm = this._playSound(track, true, volume * this._bgmVolume, speed);
            this._currentBgmBaseVolume = volume;
        }

        playEffect(track, volume, speed) {
            this._playVariedPitchSound(track, false, volume * this._seVolume, speed);
        }

        stopBgm() {
            if (this._currentBgm !== null) {
                this._currentBgm.source.stop();
                this._currentBgm = null;
            }
        }

        /**
         * 
         * @param {number} newVolume in range 0-1
         */
        bgmVolumeChange(newVolume) {
            this._bgmVolume = newVolume;
            if (this._currentBgm !== null) {
                this._currentBgm.gain.value = this._currentBgmBaseVolume * newVolume, this._audioCtx.currentTime;
            }
        }

        /**
         * 
         * @param {number} newVolume in range 0-1
         */
        seVolumeChange(newVolume) {
            this._seVolume = newVolume;
        }

        /**
         * 
         * @param {AudioBuffer} track 
         * @param {boolean} [loop=false] 
         * @param {number} [volume=1] 
         * @param {number} [speed=1] 
         * @returns 
         */
        _playVariedPitchSound(track, loop = false, volume = 1, speed = 1) {
            const newSpeed = speed * (0.95 + Math.random() * 0.1);
            void this._playSound(track, loop, volume, newSpeed);
        }

        /**
         * 
         * @param {AudioBuffer} track 
         * @param {boolean} [loop=false] 
         * @param {number} [volume=1] 
         * @param {number} [speed=1] 
         * @returns {{source: AudioBufferSourceNode, gain: AudioParam}}
         */
        _playSound(track, loop = false, volume = 1, speed = 1) {
            const audioBuffer = track;
            const trackSource = this._audioCtx.createBufferSource();

            const gainNode = this._audioCtx.createGain();
            trackSource.loop = loop;
            trackSource.buffer = audioBuffer;
            trackSource.connect(gainNode).connect(this._audioCtx.destination);

            gainNode.gain.value = volume;

            trackSource.playbackRate.value = speed;
            trackSource.start();
            return { source: trackSource, gain: gainNode.gain };
        }

        /**
         * 
         * @param {AudioBuffer} trackBuffer 
         * @param {AudioBufferSourceNode} playingTrack 
         * @returns 
         */
        _isSameTrack(trackBuffer, playingTrack) {
            return playingTrack && playingTrack.buffer === trackBuffer;
        }

    }

    $kt.audio = new KantoreAudio();

})();