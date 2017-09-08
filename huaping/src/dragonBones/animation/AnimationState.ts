namespace dragonBones {
    /**
     * @language zh_CN
     * 动画状态，播放动画时产生，可以对单个动画的播放进行更细致的控制和调节。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     */
    export class AnimationState extends BaseObject {
		/**
		 * @private
		 */
        public static actionEnabled: boolean = true;

        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.AnimationState]";
        }

        /**
         * @language zh_CN
         * 是否对插槽的颜色，显示序列索引，深度排序，行为等拥有控制的权限。
         * @see dragonBones.Slot#displayController
         * @version DragonBones 3.0
         */
        public displayControl: boolean;
        /**
         * @language zh_CN
         * 是否以叠加的方式混合动画。
         * @version DragonBones 3.0
         */
        public additiveBlending: boolean;
		/**
		 * @private
		 */
        public actionEnabled: boolean;
        /**
         * @language zh_CN
         * 需要播放的次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 3.0
         */
        public playTimes: number;
        /**
         * @language zh_CN
         * 播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1
         * @version DragonBones 3.0
         */
        public timeScale: number;
        /**
         * @language zh_CN
         * 进行动画混合时的权重。
         * @default 1
         * @version DragonBones 3.0
         */
        public weight: number;
        /**
         * @language zh_CN
         * 自动淡出时需要的时间，当设置一个大于等于 0 的值，动画状态将会在播放完成后自动淡出。 (以秒为单位)
         * @default -1
         * @version DragonBones 3.0
         */
        public autoFadeOutTime: number;
        /**
         * @private
         */
        public fadeTotalTime: number;
        /**
         * @private Animation
         */
        public _isFadeOutComplete: boolean;
        /**
         * @private Animation
         */
        public _layer: number;
        /**
         * @private TimelineState
         */
        public _position: number;
        /**
         * @private TimelineState
         */
        public _duration: number;
        /**
         * @private Animation, TimelineState
         */
        public _weightResult: number;
        /**
         * @private Animation, TimelineState
         */
        public _fadeProgress: number;
        /**
         * @private Animation TimelineState
         */
        public _group: string;
        /**
         * @private TimelineState
         */
        public _timeline: AnimationTimelineState;
        /**
         * @private
         */
        private _isPlaying: boolean;
        /**
         * @private
         */
        private _isPausePlayhead: boolean;
        /**
         * @private
         */
        private _isFadeOut: boolean;
        /**
         * @private
         */
        private _currentPlayTimes: number;
        /**
         * @private
         */
        private _fadeTime: number;
        /**
         * @private
         */
        private _time: number;
        /**
         * @private
         */
        private _name: string;
        /**
         * @private
         */
        private _armature: Armature;
        /**
         * @private
         */
        private _animationData: AnimationData;
        /**
         * @private
         */
        private _boneMask: Array<string> = [];
        /**
         * @private
         */
        private _boneTimelines: Array<BoneTimelineState> = [];
        /**
         * @private
         */
        private _slotTimelines: Array<SlotTimelineState> = [];
        /**
         * @private
         */
        private _ffdTimelines: Array<FFDTimelineState> = [];
        /**
         * @private
         */
        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            this.displayControl = true;
            this.additiveBlending = false;
            this.actionEnabled = false;
            this.playTimes = 1;
            this.timeScale = 1;
            this.weight = 1;
            this.autoFadeOutTime = -1;
            this.fadeTotalTime = 0;

            this._isFadeOutComplete = false;
            this._layer = 0;
            this._position = 0;
            this._duration = 0;
            this._weightResult = 0;
            this._fadeProgress = 0;
            this._group = null;

            if (this._timeline) {
                this._timeline.returnToPool();
                this._timeline = null;
            }

            this._isPlaying = true;
            this._isPausePlayhead = false;
            this._isFadeOut = false;
            this._currentPlayTimes = 0;
            this._fadeTime = 0;
            this._time = 0;
            this._name = null;
            this._armature = null;
            this._animationData = null;

            if (this._boneMask.length) {
                this._boneMask.length = 0;
            }

            for (let i = 0, l = this._boneTimelines.length; i < l; ++i) {
                this._boneTimelines[i].returnToPool();
            }

            for (let i = 0, l = this._slotTimelines.length; i < l; ++i) {
                this._slotTimelines[i].returnToPool();
            }

            for (let i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                this._ffdTimelines[i].returnToPool();
            }

            this._boneTimelines.length = 0;
            this._slotTimelines.length = 0;
            this._ffdTimelines.length = 0;
        }
        /**
         * @private
         */
        private _advanceFadeTime(passedTime: number): void {
            const self = this;

            if (passedTime < 0) {
                passedTime = -passedTime;
            }

            self._fadeTime += passedTime;

            let fadeProgress = 0;
            if (self._fadeTime >= self.fadeTotalTime) { // Fade complete.
                fadeProgress = self._isFadeOut ? 0 : 1;
            } else if (self._fadeTime > 0) { // Fading.
                fadeProgress = self._isFadeOut ? (1 - self._fadeTime / self.fadeTotalTime) : (self._fadeTime / self.fadeTotalTime);
            } else { // Before fade.
                fadeProgress = self._isFadeOut ? 1 : 0;
            }

            if (self._fadeProgress != fadeProgress) {
                self._fadeProgress = fadeProgress;

                const eventDispatcher = self._armature._display;

                if (self._fadeTime <= passedTime) {
                    if (self._isFadeOut) {
                        if (eventDispatcher.hasEvent(EventObject.FADE_OUT)) {
                            const event = BaseObject.borrowObject(EventObject);
                            event.animationState = this;
                            self._armature._bufferEvent(event, EventObject.FADE_OUT);
                        }
                    } else {
                        if (eventDispatcher.hasEvent(EventObject.FADE_IN)) {
                            const event = BaseObject.borrowObject(EventObject);
                            event.animationState = this;
                            self._armature._bufferEvent(event, EventObject.FADE_IN);
                        }
                    }
                }

                if (self._fadeTime >= self.fadeTotalTime) {
                    if (self._isFadeOut) {
                        self._isFadeOutComplete = true;

                        if (eventDispatcher.hasEvent(EventObject.FADE_OUT_COMPLETE)) {
                            const event = BaseObject.borrowObject(EventObject);
                            event.animationState = this;
                            self._armature._bufferEvent(event, EventObject.FADE_OUT_COMPLETE);
                        }
                    } else {
                        self._isPausePlayhead = false;

                        if (eventDispatcher.hasEvent(EventObject.FADE_IN_COMPLETE)) {
                            const event = BaseObject.borrowObject(EventObject);
                            event.animationState = this;
                            self._armature._bufferEvent(event, EventObject.FADE_IN_COMPLETE);
                        }
                    }
                }
            }
        }
        /**
         * @private
         */
        public _isDisabled(slot: Slot): boolean {
            if (
                this.displayControl &&
                (
                    !slot.displayController ||
                    slot.displayController == this._name ||
                    slot.displayController == this._group
                )
            ) {
                return false;
            }

            return true;
        }
        /**
         * @private
         */
        public _fadeIn(
            armature: Armature, clip: AnimationData, animationName: string,
            playTimes: number, position: number, duration: number, time: number, timeScale: number, fadeInTime: number,
            pausePlayhead: boolean
        ): void {
            this._armature = armature;
            this._animationData = clip;
            this._name = animationName;

            this.playTimes = playTimes;
            this.timeScale = timeScale;
            this.fadeTotalTime = fadeInTime;

            this._position = position;
            this._duration = duration;
            this._time = time;
            this._isPausePlayhead = pausePlayhead;
            if (this.fadeTotalTime == 0) {
                this._fadeProgress = 0.999999;
            }

            this._timeline = BaseObject.borrowObject(AnimationTimelineState);
            this._timeline.fadeIn(this._armature, this, this._animationData, this._time);

            this._updateTimelineStates();

            this.actionEnabled = AnimationState.actionEnabled;
        }
        /**
         * @private
         */
        public _updateTimelineStates(): void {
            let time = this._time;
            if (!this._animationData.hasAsynchronyTimeline) {
                time = this._timeline._currentTime;
            }

            const boneTimelineStates: Map<BoneTimelineState> = {};
            const slotTimelineStates: Map<SlotTimelineState> = {};

            for (let i = 0, l = this._boneTimelines.length; i < l; ++i) { // Creat bone timelines map.
                const boneTimelineState = this._boneTimelines[i];
                boneTimelineStates[boneTimelineState.bone.name] = boneTimelineState;
            }

            const bones = this._armature.getBones();
            for (let i = 0, l = bones.length; i < l; ++i) {
                const bone = bones[i];
                const boneTimelineName = bone.name;
                const boneTimelineData = this._animationData.getBoneTimeline(boneTimelineName);

                if (boneTimelineData && this.containsBoneMask(boneTimelineName)) {
                    let boneTimelineState = boneTimelineStates[boneTimelineName];
                    if (boneTimelineState) { // Remove bone timeline from map.
                        delete boneTimelineStates[boneTimelineName];
                    } else { // Create new bone timeline.
                        boneTimelineState = BaseObject.borrowObject(BoneTimelineState);
                        boneTimelineState.bone = bone;
                        boneTimelineState.fadeIn(this._armature, this, boneTimelineData, time);
                        this._boneTimelines.push(boneTimelineState);
                    }
                }
            }

            for (let i in boneTimelineStates) { // Remove bone timelines.
                const boneTimelineState = boneTimelineStates[i];
                boneTimelineState.bone.invalidUpdate();
                this._boneTimelines.splice(this._boneTimelines.indexOf(boneTimelineState), 1);
                boneTimelineState.returnToPool();
            }

            for (let i = 0, l = this._slotTimelines.length; i < l; ++i) { // Create slot timelines map.
                const slotTimelineState = this._slotTimelines[i];
                slotTimelineStates[slotTimelineState.slot.name] = slotTimelineState;
            }

            const slots = this._armature.getSlots();
            for (let i = 0, l = slots.length; i < l; ++i) {
                const slot = slots[i];
                const slotTimelineName = slot.name;
                const parentTimelineName = slot.parent.name;
                const slotTimelineData = this._animationData.getSlotTimeline(slotTimelineName);

                if (slotTimelineData && this.containsBoneMask(parentTimelineName) && !this._isFadeOut) {
                    let slotTimelineState = slotTimelineStates[slotTimelineName];
                    if (slotTimelineState) { // Remove slot timeline from map.
                        delete slotTimelineStates[slotTimelineName];
                    } else { // Create new slot timeline.
                        slotTimelineState = BaseObject.borrowObject(SlotTimelineState);
                        slotTimelineState.slot = slot;
                        slotTimelineState.fadeIn(this._armature, this, slotTimelineData, time);
                        this._slotTimelines.push(slotTimelineState);
                    }
                }
            }

            for (let i in slotTimelineStates) { // Remove slot timelines.
                const slotTimelineState = slotTimelineStates[i];
                this._slotTimelines.splice(this._slotTimelines.indexOf(slotTimelineState), 1);
                slotTimelineState.returnToPool();
            }

            this._updateFFDTimelineStates();
        }
        /**
         * @private
         */
        public _updateFFDTimelineStates(): void {
            let time = this._time;
            if (!this._animationData.hasAsynchronyTimeline) {
                time = this._timeline._currentTime;
            }

            const ffdTimelineStates: Map<FFDTimelineState> = {};

            for (let i = 0, l = this._ffdTimelines.length; i < l; ++i) { // Create ffd timelines map.
                const ffdTimelineState = this._ffdTimelines[i];
                ffdTimelineStates[ffdTimelineState.slot.name] = ffdTimelineState;
            }

            const slots = this._armature.getSlots();
            for (let i = 0, l = slots.length; i < l; ++i) {
                const slot = slots[i];
                const slotTimelineName = slot.name;
                const parentTimelineName = slot.parent.name;

                if (slot._meshData) {
                    const ffdTimelineData = this._animationData.getFFDTimeline(this._armature._skinData.name, slotTimelineName, slot.displayIndex);
                    if (ffdTimelineData && this.containsBoneMask(parentTimelineName)) { // && !_isFadeOut
                        let ffdTimelineState = ffdTimelineStates[slotTimelineName];
                        if (ffdTimelineState) { // Remove ffd timeline from map.
                            delete ffdTimelineStates[slotTimelineName];
                        } else { // Create new ffd timeline.
                            ffdTimelineState = BaseObject.borrowObject(FFDTimelineState);
                            ffdTimelineState.slot = slot;
                            ffdTimelineState.fadeIn(this._armature, this, ffdTimelineData, time);
                            this._ffdTimelines.push(ffdTimelineState);
                        }
                    } else { // Clear slot ffd.
                        for (let iF = 0, lF = slot._ffdVertices.length; iF < lF; ++iF) {
                            slot._ffdVertices[iF] = 0;
                        }

                        slot._ffdDirty = true;
                    }
                }
            }

            for (let i in ffdTimelineStates) { // Remove ffd timelines.
                const ffdTimelineState = ffdTimelineStates[i];
                ffdTimelineState.slot._ffdDirty = true;
                this._ffdTimelines.splice(this._ffdTimelines.indexOf(ffdTimelineState), 1);
                ffdTimelineState.returnToPool();
            }
        }
        /**
         * @private
         */
        public _advanceTime(passedTime: number, weightLeft: number, index: number): void {
            const self = this;

            if (passedTime != 0) { // Fading.
                self._advanceFadeTime(passedTime);
            }

            // Update time.
            passedTime *= self.timeScale;
            if (passedTime != 0 && self._isPlaying && !self._isPausePlayhead) {
                self._time += passedTime;
            }

            // Blend weight.
            self._weightResult = self.weight * self._fadeProgress * weightLeft;

            if (self._weightResult != 0) {
                const isCacheEnabled = self._fadeProgress >= 1 && index == 0 && self._armature.cacheFrameRate > 0;
                const cacheTimeToFrameScale = self._animationData.cacheTimeToFrameScale;
                let isUpdatesTimeline = true;
                let isUpdatesBoneTimeline = true;
                let time = cacheTimeToFrameScale * 2;
                time = isCacheEnabled ? (Math.floor(self._time * time) / time) : self._time; // Cache time internval.

                // Update main timeline.                
                self._timeline.update(time);
                if (!self._animationData.hasAsynchronyTimeline) {
                    time = self._timeline._currentTime;
                }

                if (isCacheEnabled) {
                    const cacheFrameIndex = Math.floor(self._timeline._currentTime * cacheTimeToFrameScale); // uint

                    if (self._armature._cacheFrameIndex == cacheFrameIndex) { // Same cache.
                        isUpdatesTimeline = false;
                        isUpdatesBoneTimeline = false;
                    } else {
                        self._armature._cacheFrameIndex = cacheFrameIndex;

                        if (self._armature._animation._animationStateDirty) { // Update _cacheFrames.
                            self._armature._animation._animationStateDirty = false;

                            for (let i = 0, l = self._boneTimelines.length; i < l; ++i) {
                                const boneTimeline = self._boneTimelines[i];
                                boneTimeline.bone._cacheFrames = (<BoneTimelineData>boneTimeline._timeline).cachedFrames;
                            }

                            for (let i = 0, l = self._slotTimelines.length; i < l; ++i) {
                                const slotTimeline = self._slotTimelines[i];
                                slotTimeline.slot._cacheFrames = (<SlotTimelineData>slotTimeline._timeline).cachedFrames;
                            }
                        }

                        if (self._animationData.cachedFrames[cacheFrameIndex]) { // Cached.
                            isUpdatesBoneTimeline = false;
                        } else { // Cache.
                            self._animationData.cachedFrames[cacheFrameIndex] = true;
                        }
                    }
                } else {
                    self._armature._cacheFrameIndex = -1;
                }

                if (isUpdatesTimeline) {
                    if (isUpdatesBoneTimeline) {
                        for (let i = 0, l = self._boneTimelines.length; i < l; ++i) {
                            self._boneTimelines[i].update(time);
                        }
                    }

                    for (let i = 0, l = self._slotTimelines.length; i < l; ++i) {
                        self._slotTimelines[i].update(time);
                    }

                    for (let i = 0, l = self._ffdTimelines.length; i < l; ++i) {
                        self._ffdTimelines[i].update(time);
                    }
                }
            }

            if (self.autoFadeOutTime >= 0 && self._fadeProgress >= 1 && self._timeline._isCompleted) {
                self.fadeOut(self.autoFadeOutTime);
            }
        }
        /**
         * @language zh_CN
         * 继续播放。
         * @version DragonBones 3.0
         */
        public play(): void {
            this._isPlaying = true;
        }
        /**
         * @language zh_CN
         * 暂停播放。
         * @version DragonBones 3.0
         */
        public stop(): void {
            this._isPlaying = false;
        }

        /**
         * @language zh_CN
         * 淡出动画。
         * @param fadeOutTime 淡出时间。 (以秒为单位)
         * @param pausePlayhead 淡出时是否暂停动画。 [true: 暂停, false: 不暂停]
         * @version DragonBones 3.0
         */
        public fadeOut(fadeOutTime: number, pausePlayhead: boolean = true): void {
            if (fadeOutTime < 0 || fadeOutTime != fadeOutTime) {
                fadeOutTime = 0;
            }

            this._isPausePlayhead = pausePlayhead;

            if (this._isFadeOut) {
                if (fadeOutTime > fadeOutTime - this._fadeTime) {
                    // If the animation is already in fade out, the new fade out will be ignored.
                    return;
                }
            } else {
                this._isFadeOut = true;

                if (fadeOutTime == 0 || this._fadeProgress <= 0) {
                    this._fadeProgress = 0.000001;
                }

                for (let i = 0, l = this._boneTimelines.length; i < l; ++i) {
                    this._boneTimelines[i].fadeOut();
                }

                for (let i = 0, l = this._slotTimelines.length; i < l; ++i) {
                    this._slotTimelines[i].fadeOut();
                }
            }

            this.displayControl = false;
            this.fadeTotalTime = this._fadeProgress > 0.000001 ? fadeOutTime / this._fadeProgress : 0;
            this._fadeTime = this.fadeTotalTime * (1 - this._fadeProgress);
        }
        /**
         * @language zh_CN
         * 是否包含指定的骨骼遮罩。
         * @param name 指定的骨骼名称。
         * @version DragonBones 3.0
         */
        public containsBoneMask(name: string): boolean {
            return !this._boneMask.length || this._boneMask.indexOf(name) >= 0;
        }
        /**
         * @language zh_CN
         * 添加指定的骨骼遮罩。
         * @param boneName 指定的骨骼名称。
         * @param recursive 是否为该骨骼的子骨骼添加遮罩。
         * @version DragonBones 3.0
         */
        public addBoneMask(name: string, recursive: boolean = true): void {
            const currentBone = this._armature.getBone(name);
            if (!currentBone) {
                return;
            }

            if (
                this._boneMask.indexOf(name) < 0 &&
                this._animationData.getBoneTimeline(name)
            ) { // Add mixing
                this._boneMask.push(name);
            }

            if (recursive) {
                const bones = this._armature.getBones();
                for (let i = 0, l = bones.length; i < l; ++i) {
                    const bone = bones[i];
                    const boneName = bone.name;
                    if (
                        this._boneMask.indexOf(boneName) < 0 &&
                        this._animationData.getBoneTimeline(boneName) &&
                        currentBone.contains(bone)
                    ) { // Add recursive mixing.
                        this._boneMask.push(boneName)
                    }
                }
            }

            this._updateTimelineStates();
        }
        /**
         * @language zh_CN
         * 删除指定的骨骼遮罩。
         * @param boneName 指定的骨骼名称。
         * @param recursive 是否删除该骨骼的子骨骼遮罩。
         * @version DragonBones 3.0
         */
        public removeBoneMask(name: string, recursive: boolean = true): void {
            const index = this._boneMask.indexOf(name);
            if (index >= 0) { // Remove mixing.
                this._boneMask.splice(index, 1);
            }

            if (recursive) {
                const currentBone = this._armature.getBone(name);
                if (currentBone) {
                    const bones = this._armature.getBones();
                    for (let i = 0, l = bones.length; i < l; ++i) {
                        const bone = bones[i];
                        const boneName = bone.name;
                        const index = this._boneMask.indexOf(boneName);
                        if (
                            index >= 0 &&
                            currentBone.contains(bone)
                        ) { // Remove recursive mixing.
                            this._boneMask.splice(index, 1);
                        }
                    }
                }
            }

            this._updateTimelineStates();
        }
        /**
         * @language zh_CN
         * 删除所有骨骼遮罩。
         * @version DragonBones 3.0
         */
        public removeAllBoneMask(): void {
            this._boneMask.length = 0;
            this._updateTimelineStates();
        }
        /**
         * @language zh_CN
         * 动画图层。
         * @see dragonBones.Animation#fadeIn()
         * @version DragonBones 3.0
         */
        public get layer(): number {
            return this._layer;
        }
        /**
         * @language zh_CN
         * 动画组。
         * @see dragonBones.Animation#fadeIn()
         * @version DragonBones 3.0
         */
        public get group(): string {
            return this._group;
        }
        /**
         * @language zh_CN
         * 动画名称。
         * @see dragonBones.AnimationData#name
         * @version DragonBones 3.0
         */
        public get name(): string {
            return this._name;
        }
        /**
         * @language zh_CN
         * 动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        public get animationData(): AnimationData {
            return this._animationData;
        }
        /**
         * @language zh_CN
         * 是否播放完毕。
         * @version DragonBones 3.0
         */
        public get isCompleted(): Boolean {
            return this._timeline._isCompleted;
        }

        /**
         * @language zh_CN
         * 是否正在播放。
         * @version DragonBones 3.0
         */
        public get isPlaying(): Boolean {
            return (this._isPlaying && !this._timeline._isCompleted);
        }

        /**
         * @language zh_CN
         * 当前动画的播放次数。
         * @version DragonBones 3.0
         */
        public get currentPlayTimes(): number {
            return this._currentPlayTimes;
        }

        /**
         * @language zh_CN
         * 当前动画的总时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        public get totalTime(): number {
            return this._duration;
        }
        /**
         * @language zh_CN
         * 当前动画的播放时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        public get currentTime(): number {
            return this._timeline._currentTime;
        }
        public set currentTime(value: number) {
            if (value < 0 || value != value) {
                value = 0;
            }

            this._time = value;
            this._timeline.setCurrentTime(this._time);

            if (this._weightResult != 0) {
                let time = this._time;
                if (!this._animationData.hasAsynchronyTimeline) {
                    time = this._timeline._currentTime;
                }

                for (let i = 0, l = this._boneTimelines.length; i < l; ++i) {
                    this._boneTimelines[i].setCurrentTime(time);
                }

                for (let i = 0, l = this._slotTimelines.length; i < l; ++i) {
                    this._slotTimelines[i].setCurrentTime(time);
                }

                for (let i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                    this._ffdTimelines[i].setCurrentTime(time);
                }
            }
        }

        /**
         * @deprecated
         */
        public autoTween: boolean = false;

        /**
         * @deprecated
         * @see #animationData
         */
        public get clip(): AnimationData {
            return this._animationData;
        }
    }
}