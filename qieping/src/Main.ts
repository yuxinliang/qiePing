class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     */
    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    private onAddToStage(event: egret.Event) {
        this.stage.dirtyRegionPolicy = egret.DirtyRegionPolicy.OFF;
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
        //egret.Profiler.getInstance().run();
        //var sprbg:egret.Sprite = new egret.Sprite();
        //sprbg.graphics.beginFill(0x000000,0.5);
        //sprbg.graphics.drawRect(0,0,160,100);
        //this.stage.addChild(sprbg);
    }
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("TestArmature");
    }
    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "TestArmature") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    }
    /**
    * 资源组加载出错
    */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        this.onResourceLoadComplete(event);
    }
    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "TestArmature") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }
    /**
     * 创建游戏场景
     */
    private createGameScene(): void {
        //this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this)
        this.createMotorcycleExp();
    }
    /**存放骨骼动画的容器**/
    private container;
    /**骨骼的实体数据**/
    private armature: dragonBones.Armature;
    /**骨骼的可视对象**/
    private armatureDisplay;

    private arrowArmature: dragonBones.Armature;
    private arrowArmatureDisplay;
    private comicData;
    /**创建骨骼模型**/
    private createMotorcycleExp(): void {

        this.container = new egret.DisplayObjectContainer();

        egret.MainContext.instance.stage.addChild(this.container);
        //this.container.x = 600;
        // this.container.y = 500;
        //读取一个骨骼数据,并创建实例显示到舞台
        var skeletonData = RES.getRes("skeleton_json");
        var textureData = RES.getRes("texture_json");
        var texture = RES.getRes("texture_png");
        // ComicDataParser
        var factory = new dragonBones.EgretFactory(new dragonBones.ComicDataParser());
        factory.parseDragonBonesData(skeletonData);

        var i = 0;
        while (RES.hasRes("texture_png" + i)) {
            textureData = RES.getRes("texture_json" + i)
            texture = RES.getRes("texture_png" + i);

            factory.parseTextureAtlasData(textureData, texture);
            i++;
        }

        //factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));

        this.armature = factory.buildArmature(skeletonData.armature[0].name);

        this.armatureDisplay = this.armature.display;
        dragonBones.WorldClock.clock.add(this.armature);
        this.container.addChild(this.armatureDisplay);

        //启动骨骼动画播放
        this.armature.animation.play(this.armature.animation.animationList[0], 1);
        this.armature.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.stopHandler, this)

        var arrowData = RES.getRes("arrow_json");
        var arrowtextureData = RES.getRes("arrowtexture_json");
        var arrowtexture = RES.getRes("arrowtexture_png");

        const arrowDBData = factory.parseDragonBonesData(arrowData, "__arrow");
        factory.parseTextureAtlasData(arrowtextureData, arrowtexture, "__arrow");
        this.arrowArmature = factory.buildArmature("Armature", "__arrow");
        this.arrowArmatureDisplay = this.arrowArmature.display;
        dragonBones.WorldClock.clock.add(this.arrowArmature);
        this.container.addChild(this.arrowArmatureDisplay);
        this.arrowArmature.animation.play(this.arrowArmature.animation.animationList[0], 1);
        this.arrowArmatureDisplay.x = this.armature.armatureData.aabb["width"] * 0.5;
        this.arrowArmatureDisplay.y = 900;
        this.arrowArmature.animation.play();


        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(0.015);//advancedTime / 1000
        }, this);
        this.halfStageHeight = this.armature.armatureData.aabb["height"];

        // Get comic data.
        this.comicData = dragonBones.ComicDataParser.getComicDataFormArmatureData(this.armature.armatureData);

        this.maxHeight = this.comicData.durings[this.comicData.durings.length - 1].height;
        this.maxFlag = this.maxHeight - this.armature.armatureData.aabb["height"];
        for (i = 0; i < this.comicData.durings.length; i++) {
            this.rePlay[i] = true;
        }
        this.playArmature(0)
        mySound.changeSoundBG();
    }
    private halfStageHeight: number = 790;//屏幕顶部到播放线的值
    private maxHeight: number;

    /*** 鼠标落下的位置 */
    private tempY = 0;
    /*** 鼠标落下时图形的位置 */
    private armeY = 0;
    //private tempPlay = false;//临时修改库文件的折中办法，为了是gotoAndPlay生效，忽略事件
    private lastduData;//记录上一个播放的during，为了防止频繁播放一个during
    private rePlay = [];//记录可否重播；0,无播放，1播放过不可再播，2，可以回播
    private onTouchBegin(evt: egret.TouchEvent): void {
        this.tempY = evt.stageY;
        this.armeY = this.armatureDisplay.y;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this)
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this)
    }
    private onTouchEnd(evt: egret.TouchEvent): void {
        if (this.stage.hasEventListener(egret.TouchEvent.TOUCH_MOVE)) {
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this)
        }
        if (this.stage.hasEventListener(egret.TouchEvent.TOUCH_END)) {
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this)
        }

    }
    private maxFlag = 0;//记录最后一张的标志线位置
    private onTouchMove(evt: egret.TouchEvent): void {
        this.armatureDisplay.y = this.armeY + (evt.stageY - this.tempY);
        if (this.armatureDisplay.y <= -this.maxFlag) {
            this.armatureDisplay.y = -this.maxFlag;
        }
        if (this.armatureDisplay.y >= 0) {
            this.armatureDisplay.y = 0;
        }
        var localTemp = 0
        if ((evt.stageY - this.tempY) < -40) {
            localTemp = - 900
            if (this.stage.hasEventListener(egret.TouchEvent.TOUCH_MOVE)) {
                this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this)
            }
            if (this.stage.hasEventListener(egret.TouchEvent.TOUCH_END)) {
                this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this)
            }
            if (this.currentPage == 2) {
                return
            }
        } else if ((evt.stageY - this.tempY) > 40) {
            localTemp = 900
            if (this.stage.hasEventListener(egret.TouchEvent.TOUCH_MOVE)) {
                this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this)
            }
            if (this.stage.hasEventListener(egret.TouchEvent.TOUCH_END)) {
                this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this)
            }
            if (this.currentPage == 1) {
                return
            }
        };
        if (localTemp == 0) {
            return;
        }
        egret.Tween.get(this.armatureDisplay).to({ "y": this.armeY + localTemp }, 300,egret.Ease.sineIn).call(() => {
            //this.armatureDisplay.y = this.armeY + localTemp//(evt.stageY - this.tempY);
            //console.log(evt.stageY-this.tempY)
            this.currentPage = 0;
            if (this.armatureDisplay.y <= -this.maxFlag) {
                this.armatureDisplay.y = -this.maxFlag;
                //console.log("zhegeshidaotoule");
                this.arrowArmatureDisplay.visible = false;
                this.currentPage = 2;
            } else {
                this.arrowArmatureDisplay.visible = true;
            }
            if (this.armatureDisplay.y >= 0) {
                this.armatureDisplay.y = 0;
                this.currentPage = 1;
            }

            this.setAllPlay();

            this.tempI = this.getDuringData();
            if (this.tempI < 0) {
                //console.log("numxiaoyu 0 ",num)
                return
            }

            this.playArmature(this.tempI)
        },this)


    }
    private currentPage = 1;

    private playArmature(num) {

        var duData = this.comicData.durings[num];//+(this.armature.armatureData.aabb["height"]/2));
        if (duData) {
            if (duData.height + this.armatureDisplay.y > 0 && duData.height + this.armatureDisplay.y < this.halfStageHeight) {//满足播放条件
                if (this.rePlay[num]) {
                    var timss;
                    var timeTTemp;
                    if (duData.frame == 0) {
                        timss = 0;
                        timeTTemp = 0;
                    } else {
                        timss = (duData.frame / this.armature.armatureData.frameRate)
                        timeTTemp = 0.001;
                    }
                    this.rePlay[num] = false;
                    for (var i = 0; i < num; i++) {
                        this.rePlay[i] = false;//之前的都不可重播
                    }
                    //console.log(this.rePlay)
                    this.armature.animation.gotoAndPlayByTime(this.armature.animation.animationList[0], timss + timeTTemp, 1);
                }
            }
        }
    }
    private loopStart = {};
    private loopEnd = {};
    private currentEnd: dragonBones.FrameEvent;
    private stopHandler(evt: dragonBones.FrameEvent): void {
        //console.log(evt.data.name)
        var eventString: string = evt.data.name;
        if (eventString == "stop") {
            this.currentEnd = evt;
            this.armature.animation.stop();
            this.tempI = this.tempI + 1;
            this.playArmature(this.tempI);
        } else if (eventString.substr(0, 7) == "loopSta") {
            if (!this.loopStart.hasOwnProperty(eventString.substr(9))) {
                this.loopStart[eventString.substr(9)] = evt.data.frame.position
                //console.log("循环开始点")
            }
        } else if (eventString.substr(0, 7) == "loopEnd") {
            this.loopEnd[eventString.substr(7)] = evt.animationState.currentTime;
            //console.log("循环结束点")

            if (this.currentEnd && this.currentEnd.data.frame.position == evt.data.frame.position) {
                var ttime = this.loopStart[this.currentEnd.data.name.substr(7)];
                this.armature.animation.gotoAndPlayByTime(this.armature.animation.animationList[0], ttime + 0.001, 1);
                //console.log("循环完了也不播放")
            }


        }
    }
    private getPlayNum(): number {
        for (var i = 0; i < this.rePlay.length; i++) {
            if (this.rePlay[i]) {
                return i;
            }
        }
        return this.rePlay.length;
    }
    private tempI = 0;//临时记录当前播放的位置，用于同屏播放多个符合条件的动画
    private getDuringData() {//根据armature高度确定要播哪段动画
        var i = 0;
        for (i = 0; i < this.rePlay.length; i++) {
            if (this.rePlay[i]) {
                this.tempI = i;
                return i;
            }
            // console.log("falsesssss",duringData.height,aheight,this.halfStageHeight)
        }
        return -1;//this.armature._duringList[this.armature._duringList.length-1];
    }
    /** 重置漫画，设置replay */
    private setAllPlay(): void {//重置漫画
        var i = 0;
        var aheight = -this.armatureDisplay.y;
        for (i = 0; i < this.comicData.durings.length; i++) {
            var duringData = this.comicData.durings[i];
            if (duringData.height > (aheight) && duringData.height < (aheight + this.armature.armatureData.aabb["height"])) {
                this.rePlay[i] = true;
            } else {
                this.rePlay[i] = false;
            }
        }

    }
}


