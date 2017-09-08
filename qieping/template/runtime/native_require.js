
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/res/res.js",
	"libs/modules/tween/tween.js",
	"polyfill/promise.js",
	"bin-debug/dragonBones/core/BaseObject.js",
	"bin-debug/dragonBones/textures/TextureData.js",
	"bin-debug/dragonBones/armature/TransformObject.js",
	"bin-debug/dragonBones/parsers/DataParser.js",
	"bin-debug/dragonBones/armature/Slot.js",
	"bin-debug/dragonBones/egret/EgretTextureData.js",
	"bin-debug/dragonBones/animation/BaseTimelineState.js",
	"bin-debug/dragonBones/geom/ColorTransform.js",
	"bin-debug/dragonBones/model/TimelineData.js",
	"bin-debug/dragonBones/factories/BaseFactory.js",
	"bin-debug/dragonBones/parsers/ObjectDataParser.js",
	"bin-debug/dragonBones/events/EventObject.js",
	"bin-debug/dragonBones/egret/EgretArmatureDisplay.js",
	"bin-debug/dragonBones/egret/EgretFactory.js",
	"bin-debug/dragonBones/egret/EgretSlot.js",
	"bin-debug/dragonBones/armature/Armature.js",
	"bin-debug/dragonBones/armature/Bone.js",
	"bin-debug/dragonBones/animation/AnimationState.js",
	"bin-debug/dragonBones/armature/IArmatureDisplay.js",
	"bin-debug/dragonBones/geom/Matrix.js",
	"bin-debug/dragonBones/geom/Point.js",
	"bin-debug/dragonBones/geom/Rectangle.js",
	"bin-debug/dragonBones/geom/Transform.js",
	"bin-debug/dragonBones/model/AnimationData.js",
	"bin-debug/dragonBones/model/ArmatureData.js",
	"bin-debug/dragonBones/model/DragonBonesData.js",
	"bin-debug/dragonBones/model/FrameData.js",
	"bin-debug/dragonBones/animation/Animation.js",
	"bin-debug/dragonBones/animation/TimelineState.js",
	"bin-debug/dragonBones/animation/WorldClock.js",
	"bin-debug/dragonBones/core/DragonBones.js",
	"bin-debug/extensions/comic.js",
	"bin-debug/LoadingUI.js",
	"bin-debug/Main.js",
	"bin-debug/mySound.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    if(egret_native.featureEnable) {
        //控制一些优化方案是否开启
        var result = egret_native.featureEnable({
            
        });
    }
    egret_native.requireFiles();
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 30,
		scaleMode: "showAll",
		contentWidth: 600,
		contentHeight: 900,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel("/system/fonts/DroidSansFallback.ttf", 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};