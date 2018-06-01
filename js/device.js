function Device(canvas) {
    this.directionLight = true;
    this.pointLight = false;
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
    this.workingContext.clearRect(0, 0, this.workingWidth, this.workingHeight);
    this.backbuffer = this.workingContext.getImageData(0, 0, this.workingWidth, this.workingHeight);
    this.depthBuffer.fill(10000, 0, this.workingWidth * this.workingHeight);
};

Device.prototype.present = function () {
    this.workingContext.putImageData(this.backbuffer, 0, 0);
};

Device.prototype.setRenderTarget = function (texture) {
    this.backbuffer = texture.internalBuffer;
};

Device.prototype.resetRenderTarget = function () {
    this.backbuffer = this.workingContext.getImageData(0, 0, this.workingWidth, this.workingHeight);
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
    if (this.directionLight) {
        this.renderDirectionLightShader(model, worldMatrix, viewMatrix, projectionMatrix, texture, light);
    } else {
        this.renderPointLightShader(model, worldMatrix, viewMatrix, projectionMatrix, texture, light);
    }
};

Device.prototype.renderDirectionLightShader = function (model, worldMatrix, viewMatrix, projectionMatrix, texture, light) {

    let shader = new ShaderDevice(this);
    let raster = new Raster(this);

    let vertexs = [];

    model.meshes.forEach(mesh => {
        mesh.Faces.forEach(face => {

            let v1 = shader.DirectionLightShader_VS(mesh.Vertices[face.A], worldMatrix, viewMatrix, projectionMatrix);
            let v2 = shader.DirectionLightShader_VS(mesh.Vertices[face.B], worldMatrix, viewMatrix, projectionMatrix);
            let v3 = shader.DirectionLightShader_VS(mesh.Vertices[face.C], worldMatrix, viewMatrix, projectionMatrix);

            vertexs.push(v1);
            vertexs.push(v2);
            vertexs.push(v3);
        });
    });

    for (let i = 0; i < vertexs.length / 3; ++i) {

        let v1 = vertexs[i * 3];
        let v2 = vertexs[i * 3 + 1];
        let v3 = vertexs[i * 3 + 2];

        if (this.enableWireFrame) {
            raster.WireFrameRaster(v1, v2, v3);
        } else {
            let res = raster.SolidRaster(v1, v2, v3);
            res.forEach(v => {
                let color = shader.DirectionLightShader_PS(v, texture, light);
                this.drawPoint(v.position, color);
            });
        }
    }

};

Device.prototype.renderPointLightShader = function (model, worldMatrix, viewMatrix, projectionMatrix, texture, light) {

    let shader = new ShaderDevice(this);
    let raster = new Raster(this);

    let vertexs = [];

    model.meshes.forEach(mesh => {
        mesh.Faces.forEach(face => {

            let v1 = shader.PointLightShader_VS(mesh.Vertices[face.A], worldMatrix, viewMatrix, projectionMatrix);
            let v2 = shader.PointLightShader_VS(mesh.Vertices[face.B], worldMatrix, viewMatrix, projectionMatrix);
            let v3 = shader.PointLightShader_VS(mesh.Vertices[face.C], worldMatrix, viewMatrix, projectionMatrix);

            vertexs.push(v1);
            vertexs.push(v2);
            vertexs.push(v3);
        });
    });

    for (let i = 0; i < vertexs.length / 3; ++i) {

        let v1 = vertexs[i * 3];
        let v2 = vertexs[i * 3 + 1];
        let v3 = vertexs[i * 3 + 2];

        if (this.enableWireFrame) {
            raster.WireFrameRaster(v1, v2, v3);
        } else {
            let res = raster.SolidRaster(v1, v2, v3);
            res.forEach(v => {
                let color = shader.PointLightShader_PS(v, texture, light);
                this.drawPoint(v.position, color);
            });
        }
    }
};

// 限制数值范围在0和1之间
Device.prototype.clamp = function (value, min, max) {
    if (typeof min === "undefined") {
        min = 0;
    }
    if (typeof max === "undefined") {
        max = 1;
    }
    return Math.max(min, Math.min(value, max));
};
