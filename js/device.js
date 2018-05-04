function Device(canvas) {
    this.isDepthTest = false;
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

Device.prototype.putPixel = function (x, y, z, color) {
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
};

Device.prototype.project = function (vertex, transMat, worldMat) {
    let position2D = Vector3.TransformCoordinates(vertex.position, transMat);

    let x = -position2D.x * this.workingWidth + this.workingWidth / 2.0 >> 0;
    let y = -position2D.y * this.workingHeight + this.workingHeight / 2.0 >> 0;

    let position3D = Vector3.TransformCoordinates(vertex.position, worldMat);
    let normal3D = Vector3.TransformNormal(vertex.normal, worldMat);

    return ({
        position2D : new Vector3(x , y , position2D.z) ,
        position3D : position3D ,
        normal3D : normal3D ,
        texcoord : vertex.texcoord
    });
};

Device.prototype.drawPoint = function (point, color) {
    if (point.x >= 0 && point.y >= 0 && point.x < this.workingWidth && point.y < this.workingHeight) {
        this.putPixel(point.x, point.y, point.z, color);
    }
};

Device.prototype.render = function (camera, model, worldMatrix, viewMatrix, projectionMatrix) {
    let transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);
    model.meshes.forEach(mesh => {
        let idx = 0;
        mesh.Faces.forEach(face => {
            let v1 = this.project(mesh.Vertices[face.A], transformMatrix, worldMatrix);
            let v2 = this.project(mesh.Vertices[face.B], transformMatrix, worldMatrix);
            let v3 = this.project(mesh.Vertices[face.C], transformMatrix, worldMatrix);

            let color = 0.25 + ((idx % mesh.Faces.length) / mesh.Faces.length) * 0.75;
            let finalColor = new Color4(color, color, 0, 1);

            if (this.isWireFrame) {
                this.drawLine(v1, v2, finalColor);
                this.drawLine(v2, v3, finalColor);
                this.drawLine(v3, v1, finalColor);
            } else {
                this.drawTriangle(v1, v2, v3, finalColor);
            }
            idx++;
        });
    });
};

Device.prototype.drawLine = function (v0, v1, color) {
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
        this.drawPoint(new Vector2(x0, y0, 1.0), color);
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

// 过渡插值
Device.prototype.interpolate = function (min, max, gradient) {
    return min + (max - min) * this.clamp(gradient);
};

Device.prototype.processScanLine = function (y, va, vb, vc, vd, color) {

    let pa = va.position2D;
    let pb = vb.position2D;
    let pc = vc.position2D;
    let pd = vd.position2D;

    let gradient1 = (pa.y !== pb.y) ? (y - pa.y) / (pb.y - pa.y) : 1;
    let gradient2 = (pc.y !== pd.y) ? (y - pc.y) / (pd.y - pc.y) : 1;

    let sx = this.interpolate(pa.x, pb.x, gradient1) >> 0;
    let ex = this.interpolate(pc.x, pd.x, gradient2) >> 0;

    // 限定 sx < ex
    if (sx > ex) {
        let tmp = sx;
        sx = ex;
        ex = tmp;
    }

    // 计算 开始Z值 和 结束Z值
    let z1 = this.interpolate(pa.z, pb.z, gradient1);
    let z2 = this.interpolate(pc.z, pd.z, gradient2);

    for (let x = sx; x < ex; x++) {
        let gradient = (x - sx) / (ex - sx);
        let z = this.interpolate(z1, z2, gradient);
        this.drawPoint(new Vector3(x, y, z), color);
    }
};

Device.prototype.drawTriangle = function (p1, p2, p3, color) {

    let y;
    let temp;
    if (p1.position2D.y > p2.position2D.y) {
        temp = p2;
        p2 = p1;
        p1 = temp;
    }
    if (p2.position2D.y > p3.position2D.y) {
        temp = p2;
        p2 = p3;
        p3 = temp;
    }
    if (p1.position2D.y > p2.position2D.y) {
        temp = p2;
        p2 = p1;
        p1 = temp;
    }

    // 反向斜率
    let dP1P2;
    let dP1P3;

    if (p2.position2D.y - p1.position2D.y > 0) {
        dP1P2 = (p2.position2D.x - p1.position2D.x) / (p2.position2D.y - p1.position2D.y);
    } else {
        dP1P2 = 0;
    }

    if (p3.position2D.y - p1.position2D.y > 0) {
        dP1P3 = (p3.position2D.x - p1.position2D.x) / (p3.position2D.y - p1.position2D.y);
    } else {
        dP1P3 = 0;
    }

    if (dP1P2 > dP1P3) {
        for (y = p1.position2D.y >> 0; y <= p3.position2D.y >> 0; y++) {
            if (y < p2.position2D.y) {
                this.processScanLine(y, p1, p3, p1, p2, color);
            } else {
                this.processScanLine(y, p1, p3, p2, p3, color);
            }
        }
    } else {
        for (y = p1.position2D.y >> 0; y <= p3.position2D.y >> 0; y++) {
            if (y < p2.position2D.y) {
                this.processScanLine(y, p1, p2, p1, p3, color);
            } else {
                this.processScanLine(y, p2, p3, p1, p3, color);
            }
        }
    }
};
