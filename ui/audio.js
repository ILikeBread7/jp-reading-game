'use strict';

var $kt = $kt || {};

(() => {

    const EVENTS = $kt.settings.eventNames;
    const EFFECT_COOLDOWN_TIME = 50;

    class KantoreAudio {

        constructor() {
            this._events = new EventTarget();
            this._eventNames = Object.freeze({ BGM_STARTED: 'bgmStarted' });
            this._lastEffectPlayedTime = -EFFECT_COOLDOWN_TIME;
            this._currentBgmTrack = null;
            this._latestBgmIndex = 0;
            this._lastEventBgmTrack = null;
            
            this._player = new AudioPlayer();
            this.seTracks = {
                CORRECT: { name: '決定ボタンを押す3.ogg', speed: 1.5 },
                CONFIRM: { name: '決定ボタンを押す3.ogg', speed: 1.2 },
                SELECT: { name: '決定ボタンを押す3.ogg' },
                CANCEL: { name: '決定ボタンを押す3.ogg', speed: 0.8 },
                EXP_GROW: { name: '成功音.ogg' },
                EXP_MAX: { name: '決定ボタンを押す1.ogg' },
                LEVEL_UP: { name: '決定ボタンを押す4.ogg' }
            };

            this._bgmTracks = $kt.utils.shuffle([
                { displayName: '虹ヲ駆ル舞', author: '秦暁', name: '虹ヲ駆ル舞.ogg', volume: 0.45 },
                { displayName: '和響バースト -Wakyo Burst-', author: 'alaki paca', name: '和響バースト_-Wakyo_Burst-.ogg', volume: 0.4 },
                { displayName: 'Miyabi break', author: 'マニーラ', name: 'Miyabi_break.ogg', volume: 0.65 },
                { displayName: 'Acid Fuji', author: 'MFP【Marron Fields Production】', name: 'Acid_Fuji.ogg', volume: 0.4 },
                { displayName: '86', author: '伊藤ケイスケ', name: '86.ogg', volume: 0.3 },
                { displayName: '竜宮城', author: '伊藤ケイスケ', name: '竜宮城.ogg', volume: 0.3 },
                { displayName: 'monstruo', author: '伊藤ケイスケ', name: 'monstruo.ogg', volume: 0.3 },
                { displayName: 'Rainy', author: '伊藤ケイスケ', name: 'Rainy.ogg', volume: 0.325 }
            ]);

            [ ...Object.values(this.seTracks), ...this._bgmTracks ]
                .forEach(trackData => {
                    // Setting default parameters when missing
                    trackData.volume ??= 1;
                    trackData.speed ??= 1;
                });
            
            this._connectSettings();
        }

        get events() {
            return this._events;
        }

        get eventNames() {
            return this._eventNames;
        }

        preloadAudio() {
            const tracksPromiseMap = new Map();
            const trackEntries = Object.values(this.seTracks);

            this._preloadTrack(trackEntries[0], tracksPromiseMap);
            this._preloadTrack(this._bgmTracks[0], tracksPromiseMap);

            trackEntries
                .slice(1)
                .forEach(trackData => this._preloadTrack(trackData, tracksPromiseMap));
        }

        _preloadTrack(trackData, tracksPromiseMap) {
            trackData.promise = this._getOrCreateTrackPromise(trackData.name, tracksPromiseMap)
                .then(buffer => {
                    trackData.buffer = buffer;
                    delete trackData.promise;

                    // Has to return buffer so subsequent
                    // .then calls on this promise can also
                    // access it
                    return buffer;
                });
        }

        async startBgms() {
            this._player.suspendMutedAudoContexts();

            this._latestBgmIndex = 0;
            
            const loop = false;
            const bgmPromise = this.playBgm(this._bgmTracks[0], loop);

            return bgmPromise.then(track => {
                if (this._bgmTracks.length > 1) {
                    this._preloadTrack(this._bgmTracks[1]);
                }

                track.source.addEventListener('ended', this._startNextBgm.bind(this));
                this._dispatchBgmStartedEvent();
            });
        }

        _startNextBgm() {
            this._latestBgmIndex++;

            let newBgm = this._bgmTracks[this._latestBgmIndex];
            // If there is no next bgm reshuffle the bgm list
            // and restart from the beginning
            if (!newBgm) {
                this._latestBgmIndex = 0;
                const lastBgm = this._bgmTracks[this._bgmTracks.length - 1];
                $kt.utils.shuffle(this._bgmTracks);
                
                if (lastBgm === this._bgmTracks[0] && this._bgmTracks.length > 1) {
                    const randomIndex = Math.floor(Math.random() * (this._bgmTracks.length - 1)) + 1;
                    const tmp = this._bgmTracks[0];
                    this._bgmTracks[0] = this._bgmTracks[randomIndex];
                    this._bgmTracks[randomIndex] = tmp;
                }
                newBgm = this._bgmTracks[0];
            }

            // If the bgm wasn't loaded in time pick a random
            // already loaded bgm instead
            if (!newBgm.buffer) {
                this._latestBgmIndex--;
                newBgm = this._getRandomBackupBgm();
            }

            const loop = false;
            this.playBgm(newBgm, loop)
                .then(({ source }) => {
                        // Preload the next bgm if not already loaded or loading
                        const nextIndex = this._latestBgmIndex + 1;
                        if (
                            this._bgmTracks[nextIndex]
                            && !this._bgmTracks[nextIndex].buffer
                            && !this._bgmTracks[nextIndex].promise
                        ) {
                            this._preloadTrack(this._bgmTracks[nextIndex]);
                        }

                        source.addEventListener('ended', this._startNextBgm.bind(this));
                        this._dispatchBgmStartedEvent();
                    }
                );
        }

        _getRandomBackupBgm() {
            const noCurrentBgmModifier = this._currentBgmTrack ? 0 : 1;
            const numberOfEligibleBgms = this._latestBgmIndex + noCurrentBgmModifier;

            const randomBgmIndex = Math.floor(Math.random() * numberOfEligibleBgms);
            const randomBgm = this._bgmTracks[randomBgmIndex];

            return randomBgm === this._currentBgmTrack
                ? this._bgmTracks[this._latestBgmIndex]
                : randomBgm;
        }

        /**
         * 
         * @param { { buffer: Promise<AudioBuffer>, volume: number, speed: number } } track 
         * @param {boolean} [loop=true] 
         * @param {number} [volume=1] 
         * @param {number} [speed=1] 
         * @returns {Promise<{source: AudioBufferSourceNode, gain: AudioParam}>}
         */
        async playBgm(track, loop = true, volume = 1, speed = 1) {
            this._currentBgmTrack = track;
            const playFunc = buffer =>
                this._player.playBgm(buffer, loop, track.volume * volume, track.speed * speed);
            
            const buffer = track.buffer;
            if (buffer) {
                return playFunc(buffer);
            } else {
                if (!track.promise) {
                    return Promise.reject();
                }
                return track.promise.then(buffer => {
                    if (track === this._currentBgmTrack) {
                        return playFunc(buffer);
                    }
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
                this._addEffectCooldown();
                return this._player.playEffect(buffer, track.volume * volume, track.speed * speed);
            }
        }

        /**
         * 
         * @param { { buffer: Promise<AudioBuffer>, volume: number, speed: number } } track 
         * @param {number} [volume=1] 
         * @param {number} [speed=1] 
         */
        playEffectWithCooldown(track, volume = 1, speed = 1) {
            if (this._isEffectCooldownPeriod()) {
                return;
            }

            this.playEffect(track, volume, speed);
        }

        _addEffectCooldown() {
            this._lastEffectPlayedTime = performance.now();
        }

        _isEffectCooldownPeriod() {
            return performance.now() - this._lastEffectPlayedTime < EFFECT_COOLDOWN_TIME;
        }

        _getOrCreateTrackPromise(trackName, tracksPromiseMap) {
            const promiseFromMap = tracksPromiseMap && tracksPromiseMap.get(trackName);
            if (promiseFromMap) {
                return promiseFromMap;
            }

            const promise = this._player.loadTrack(trackName);
            tracksPromiseMap && tracksPromiseMap.set(trackName, promise);
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
            this._dispatchBgmStartedEvent();
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

        _dispatchBgmStartedEvent() {
            if (this._player.bgmMuted || this._lastEventBgmTrack === this._currentBgmTrack) {
                return;
            }

            this._lastEventBgmTrack = this._currentBgmTrack;
            this._events.dispatchEvent(new CustomEvent(this._eventNames.BGM_STARTED, { detail: this._currentBgmTrack }));
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
            this._bgmAudioCtx = new AudioContext();
            this._seAudioCtx = new AudioContext();
            this._currentBgm = null;
        }

        suspendMutedAudoContexts() {
            if (this._bgmVolume <= 0) {
                this._bgmAudioCtx.suspend();
            }

            if (this._seVolume <= 0) {
                this._seAudioCtx.suspend();
            }
        }

        get bgmMuted() {
            return this._bgmVolume <= 0;
        }

        /**
         * 
         * @param {string} trackName 
         * @returns {Promise<AudioBuffer>}
         */
        async loadTrack(trackName) {
            const response = await fetch(`audio/${trackName}`);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this._seAudioCtx.decodeAudioData(arrayBuffer);
            return audioBuffer;
        }

        playBgm(track, loop, volume, speed) {
            if (this._currentBgm !== null) {
                this._currentBgm.source.stop();
            }

            this._currentBgm = this._playSound(track, loop, this._bgmAudioCtx, volume * this._bgmVolume, speed);
            this._currentBgmBaseVolume = volume;
            return this._currentBgm;
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
            this._resumeOrSuspendCtx(this._bgmAudioCtx, newVolume);
            this._bgmVolume = newVolume;
            if (this._currentBgm !== null) {
                this._currentBgm.gain.value = this._currentBgmBaseVolume * newVolume, this._bgmAudioCtx.currentTime;
            }
        }

        /**
         * 
         * @param {number} newVolume in range 0-1
         */
        seVolumeChange(newVolume) {
            this._resumeOrSuspendCtx(this._seAudioCtx, newVolume);
            this._seVolume = newVolume;
        }

        /**
         * 
         * @param {AudioContext} ctx 
         * @param {number} volume 
         */
        _resumeOrSuspendCtx(ctx, volume) {
            if (volume > 0) {
                if (ctx.state === 'suspended') {
                    ctx.resume();
                }
                return;
            }

            if (volume <= 0) {
                if (ctx.state === 'running') {
                    ctx.suspend();
                }
                return;
            }
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
            void this._playSound(track, loop, this._seAudioCtx, volume, newSpeed);
        }

        /**
         * 
         * @param {AudioBuffer} track 
         * @param {boolean} [loop=false] 
         * @param {AudioContext} ctx 
         * @param {number} [volume=1] 
         * @param {number} [speed=1] 
         * @returns {{source: AudioBufferSourceNode, gain: AudioParam}}
         */
        _playSound(track, loop = false, ctx, volume = 1, speed = 1) {
            const audioBuffer = track;
            const trackSource = ctx.createBufferSource();

            const gainNode = ctx.createGain();
            trackSource.loop = loop;
            trackSource.buffer = audioBuffer;
            trackSource.connect(gainNode).connect(ctx.destination);

            gainNode.gain.value = volume;

            trackSource.playbackRate.value = speed;
            trackSource.start();
            return { source: trackSource, gain: gainNode.gain };
        }

    }

    $kt.audio = new KantoreAudio();

})();