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
Device.prototype.project = function (coord, transMat) {
    let point = Vector3.TransformCoordinates(coord, transMat);
    let x = -point.x * this.workingWidth + this.workingWidth / 2.0 >> 0;
    let y = -point.y * this.workingHeight + this.workingHeight / 2.0 >> 0;
    return (new Vector3(x, y, point.z));
};
Device.prototype.drawPoint = function (point, color) {
    if (point.x >= 0 && point.y >= 0 && point.x < this.workingWidth && point.y < this.workingHeight) {
        this.putPixel(point.x, point.y, point.z, color);
    }
};

Device.prototype.render = function (camera, model , worldMatrix, viewMatrix, projectionMatrix) {
    let transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);
    model.meshes.forEach(mesh => {
        let idx = 0;
        mesh.Faces.forEach(face => {
            let p1 = this.project(mesh.Vertices[face.A].position, transformMatrix);
            let p2 = this.project(mesh.Vertices[face.B].position, transformMatrix);
            let p3 = this.project(mesh.Vertices[face.C].position, transformMatrix);
            let color = 0.25 + ((idx % mesh.Faces.length) / mesh.Faces.length) * 0.75;
            let finalColor = new Color4(color, color, 0, 1);
            if (this.isWireFrame) {
                this.drawLine(p1, p2, finalColor);
                this.drawLine(p2, p3, finalColor);
                this.drawLine(p3, p1, finalColor);
            } else {
                this.drawTriangle(p1, p2, p3, finalColor);
            }
            idx++;
        });
    });
};

Device.prototype.drawLine = function (point0, point1, color) {
    let x0 = point0.x >> 0;
    let y0 = point0.y >> 0;
    let x1 = point1.x >> 0;
    let y1 = point1.y >> 0;
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

Device.prototype.processScanLine = function (y, pa, pb, pc, pd, color) {

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
    if (p1.y > p2.y) {
        temp = p2;
        p2 = p1;
        p1 = temp;
    }
    if (p2.y > p3.y) {
        temp = p2;
        p2 = p3;
        p3 = temp;
    }
    if (p1.y > p2.y) {
        temp = p2;
        p2 = p1;
        p1 = temp;
    }

    // 反向斜率
    let dP1P2;
    let dP1P3;

    if (p2.y - p1.y > 0) {
        dP1P2 = (p2.x - p1.x) / (p2.y - p1.y);
    } else {
        dP1P2 = 0;
    }

    if (p3.y - p1.y > 0) {
        dP1P3 = (p3.x - p1.x) / (p3.y - p1.y);
    } else {
        dP1P3 = 0;
    }

    if (dP1P2 > dP1P3) {
        for (y = p1.y >> 0; y <= p3.y >> 0; y++) {
            if (y < p2.y) {
                this.processScanLine(y, p1, p3, p1, p2, color);
            } else {
                this.processScanLine(y, p1, p3, p2, p3, color);
            }
        }
    } else {
        for (y = p1.y >> 0; y <= p3.y >> 0; y++) {
            if (y < p2.y) {
                this.processScanLine(y, p1, p2, p1, p3, color);
            } else {
                this.processScanLine(y, p2, p3, p1, p3, color);
            }
        }
    }
};
