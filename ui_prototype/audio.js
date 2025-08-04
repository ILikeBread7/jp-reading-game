'use strict';

var $kt = $kt || {};

(() => {

    const EVENTS = $kt.settings.eventNames;

    class KantoreAudio {

        constructor() {
            this._currentBgmTrack = null;
            
            this._player = new AudioPlayer();
            this.tracks = {
                BGM_TRACK: { name: 'Juhani Junkala [Retro Game Music Pack] Level 1.ogg', volume: 0.3 },
                SE_TEST_1: { name: '7.ogg' },
                SE_TEST_2: { name: 'Jingle_Achievement_01.ogg' },
                SE_TEST_2_HIGH: { name: 'Jingle_Achievement_01.ogg', speed: 1.2 },
                SE_TEST_2_LOW: { name: 'Jingle_Achievement_01.ogg', speed: 0.8 }
            };
            
            const tracksPromiseMap = new Map();
            Object.entries(this.tracks).forEach(([, trackData]) => {
                // Settings default parameters when missing
                trackData.volume ??= 1;
                trackData.speed ??= 1;

                // Preload all audio files
                trackData.promise = this._getOrCreateTrackPromise(trackData.name, tracksPromiseMap)
                    .then(buffer => {
                        trackData.buffer = buffer;
                        delete trackData.promise;

                        // Has to return buffer so subsequent
                        // .then calls on this promise can also
                        // access it
                        return buffer;
                    });
            });

            this._connectSettings();
        }

        /**
         * 
         * @param { { buffer: Promise<AudioBuffer>, volume: number, speed: number } } track 
         * @param {number} [volume=1] 
         * @param {number} [speed=1] 
         */
        async playBgm(track, volume = 1, speed = 1) {
            this._currentBgmTrack = track;
            const playFunc = buffer =>
                this._player.playBgm(buffer, track.volume * volume, track.speed * speed);
            
            const buffer = track.buffer;
            if (buffer) {
                return playFunc(buffer);
            } else {
                return track.promise.then(buffer => {
                    if (track === this._currentBgmTrack) {
                        playFunc(buffer);
                    }

                    // Has to return buffer so subsequent
                    // .then calls on this promise can also
                    // access it
                    return buffer;
                });
            }
        }

        /**
         * 
         * @param { { buffer: Promise<AudioBuffer>, volume: number, speed: number } } track 
         * @param {number} [volume=1] 
         * @param {number} [speed=1] 
         */
        playEffect(track, volume = 1, speed = 1) {
            const buffer = track.buffer;
            
            if (buffer) {
                return this._player.playEffect(buffer, track.volume * volume, track.speed * speed);
            }
        }

        _getOrCreateTrackPromise(trackName, tracksPromiseMap) {
            const promiseFromMap = tracksPromiseMap.get(trackName);
            if (promiseFromMap) {
                return promiseFromMap;
            }

            const promise = this._player.loadTrack(trackName);
            tracksPromiseMap.set(trackName, promise);
            return promise;
        }

        stopBgm() {
            this._currentBgmTrack = null;
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

        _connectSettings() {
            $kt.uiHelper.connectSettingToListener(EVENTS.BGM_VOLUME, this.bgmVolumeChange.bind(this));
            $kt.uiHelper.connectSettingToListener(EVENTS.SE_VOLUME, this.seVolumeChange.bind(this));
        }

    }

    class AudioPlayer {

        /**
         * 
         * @param {number} [bgmVolume=1] range 0-1, default 1
         * @param {number} [seVolume=1] range 0-1, default 1
         */
        constructor(bgmVolume = 1, seVolume = 1) {
            this._bgmVolume = bgmVolume;
            this._seVolume = seVolume;
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