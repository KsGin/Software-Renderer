function Device(canvas) {
    this.isDepthTest = true;
    this.isWireFrame = false;
    this.workingCanvas = canvas;
    this.workingWidth = canvas.width;
    this.workingHeight = canvas.height;
    this.workingContext = this.workingCanvas.getContext("2d");
    this.depthBuffer = new Array(this.workingWidth * this.workingHeight);
}

Device.prototype.clearColorAndDepth = function () {
    this.workingContext.clearRect(0, 0, this.workingWidth, this.workingHeight);
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
        if (this.isDepthTest && this.depthBuffer[index / 4] < z) {
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


            if (this.isWireFrame) {
                this.drawLine(v1, v2);
                this.drawLine(v2, v3);
                this.drawLine(v3, v1);
            } else {
                raster.Raster(v1 , v2 , v3 , texture , light);
            }
        });
    });
};


Device.prototype.drawLine = function (v0, v1) {
    let x0 = v0.position2D.x >> 0;
    let y0 = v0.position2D.y >> 0;
    let x1 = v1.position2D.x >> 0;
    let y1 = v1.position2D.y >> 0;
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;
    while (true) {
        this.device.drawPoint(new Vector2(x0, y0, 1.0), new Color4(1 , 1 , 1, 1));
        if ((x0 === x1) && (y0 === y1)) break;
        let e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
};