function Device(canvas) {
    this.enableCCWCull = true;
    this.enableCWCull = false;
    this.enableDepthTest = true;
    this.enableWireFrame = false;
    this.workingCanvas = canvas;
    this.workingWidth = canvas.width;
    this.workingHeight = canvas.height;
    this.workingContext = this.workingCanvas.getContext("2d");
    this.depthBuffer = new Array(this.workingWidth * this.workingHeight);
}

Device.prototype.clearColorAndDepth = function () {
    this.workingContext.clearRect( 0 , 0 , this.workingWidth , this.workingHeight);
    this.backbuffer = this.workingContext.getImageData(0, 0, this.workingWidth, this.workingHeight);
    this.depthBuffer.fill(1000, 0, this.workingWidth * this.workingHeight);
};

Device.prototype.present = function () {
    this.workingContext.putImageData(this.backbuffer, 0, 0);
};

Device.prototype.drawPoint = function (point, color) {
    if (point.x >= 0 && point.y >= 0 && point.x < this.workingWidth && point.y < this.workingHeight) {
        let x = point.x;
        let y = point.y;
        let z = point.z;

        this.backbufferdata = this.backbuffer.data;
        let index = ((x >> 0) + (y >> 0) * this.workingWidth) * 4;

        // 深度测试
        if (this.enableDepthTest && this.depthBuffer[index / 4] < z) {
            return;
        }

        this.depthBuffer[index / 4] = z;

        this.backbufferdata[index] = color.r * 255;
        this.backbufferdata[index + 1] = color.g * 255;
        this.backbufferdata[index + 2] = color.b * 255;
        this.backbufferdata[index + 3] = color.a * 255;
    }
};

Device.prototype.render = function (model, worldMatrix, viewMatrix, projectionMatrix, texture, light) {

    let shader = new ShaderDevice(this);
    let raster = new Raster(this);

    model.meshes.forEach(mesh => {
        mesh.Faces.forEach(face => {

            let v1 = shader.DirectionLightShader_VS(mesh.Vertices[face.A] , worldMatrix , viewMatrix , projectionMatrix);
            let v2 = shader.DirectionLightShader_VS(mesh.Vertices[face.B] , worldMatrix , viewMatrix , projectionMatrix);
            let v3 = shader.DirectionLightShader_VS(mesh.Vertices[face.C] , worldMatrix , viewMatrix , projectionMatrix);

            if (this.enableWireFrame) {
                raster.WireFrameRaster(v1 , v2 , v3);
            } else {
                let res = raster.SolidRaster(v1 , v2 , v3);
                res.forEach(v => {
                   let color = shader.DirectionLightShader_PS(v , texture , light);
                   this.drawPoint(v.position , color);
                });
            }
        });
    });
};