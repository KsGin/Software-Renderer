function Texture(filename , width , height) {
    this.width = width;
    this.height = height;
    this.internalBuffer = null;
    if(filename)
        this.LoadTexture(filename);
    else
        this.InitTexture();
}

Texture.prototype.LoadTexture = function(filename){
    let _this = this;
    let imageTexture = new Image();
    imageTexture.crossOrigin = "Anonymous";
    imageTexture.height = this.height;
    imageTexture.width = this.width;
    imageTexture.onload = function () {
        let internalCanvas = document.createElement("canvas");
        internalCanvas.width = _this.width;
        internalCanvas.height = _this.height;
        let internalContext = internalCanvas.getContext("2d");
        internalContext.drawImage(imageTexture, 0, 0);
        _this.internalBuffer = internalContext.getImageData(0, 0, _this.width, _this.height);
    };
    imageTexture.src = filename;
};

Texture.prototype.InitTexture = function(){
    let imageTexture = new Image();
    imageTexture.crossOrigin = "Anonymous";
    imageTexture.height = this.height;
    imageTexture.width = this.width;

    let internalCanvas = document.createElement("canvas");
    internalCanvas.width = this.width;
    internalCanvas.height = this.height;
    let internalContext = internalCanvas.getContext("2d");
    internalContext.drawImage(imageTexture, 0, 0);

    this.internalBuffer = internalContext.getImageData(0, 0, this.width, this.height);
};


Texture.prototype.TextureMap = function(tu , tv){

    if (this.internalBuffer) {
        let u = Math.abs(((tu * this.width) % this.width)) >> 0;
        let v = Math.abs(((tv * this.height) % this.height)) >> 0;

        let pos = (u + v * this.width) * 4;

        let r = this.internalBuffer.data[pos];
        let g = this.internalBuffer.data[pos + 1];
        let b = this.internalBuffer.data[pos + 2];
        let a = this.internalBuffer.data[pos + 3];

        return new Color4(r / 255.0, g / 255.0, b / 255.0, a / 255.0);
    } else {
        return new Color4(1, 1, 1, 1);
    }
};

Texture.prototype.TextureMapClamp = function(tu , tv){

    if (this.internalBuffer) {

        tu = Math.max(0 , Math.min(tu , 1));
        tv = Math.max(0 , Math.min(tv , 1));

        let u = tu * this.width >> 0;
        let v = tv * this.height >> 0;

        let pos = (u + v * this.width) * 4;

        let r = this.internalBuffer.data[pos];
        let g = this.internalBuffer.data[pos + 1];
        let b = this.internalBuffer.data[pos + 2];
        let a = this.internalBuffer.data[pos + 3];

        return new Color4(r / 255.0, g / 255.0, b / 255.0, a / 255.0);
    } else {
        return new Color4(1, 1, 1, 1);
    }
};