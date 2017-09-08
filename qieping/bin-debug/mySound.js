var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var mySound = (function () {
    function mySound() {
    }
    mySound.init = function () {
    };
    /** 目前 戰鬥音樂和背景音樂一起處理，只可播放其一。戰鬥完成後，自動切回到背景音樂，可擴展為每張地圖一個音樂
     * 音樂列表中，0，為城市背景音樂，1,為副本音樂，2，為戰鬥音樂。
    */
    mySound.changeSoundBG = function (num) {
        if (num === void 0) { num = 0; }
        try {
            //创建 URLLoader 对象
            var loader = new egret.URLLoader();
            //设置加载方式为声音
            loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
            //添加加载完成侦听
            loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
            loader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this);
            //音频资源放在resource文件夹下
            var url = "resource/life.mp3";
            var request = new egret.URLRequest(url);
            //开始加载
            loader.load(request);
        }
        catch (error) {
        }
    };
    mySound.onLoadComplete = function (event) {
        this.sound = event.currentTarget.data;
        this.updataSoundBg();
    };
    mySound.onLoadError = function (event) {
    };
    /***刷新背景音樂應該有的狀態 */
    mySound.updataSoundBg = function () {
        this.channel = this.sound.play();
    };
    mySound.destory = function () {
        if (this.channel) {
            this.channel.stop();
            this.channel = null;
        }
        this.sound = null;
    };
    return mySound;
}());
mySound.soundBg = true;
mySound.soundList = ["left"];
mySound.isPlaying = false;
__reflect(mySound.prototype, "mySound");
//# sourceMappingURL=mySound.js.map