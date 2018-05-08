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
        position2D: new Vector3(x, y, position2D.z),
        position3D: position3D,
        normal3D: normal3D,
        texcoord: vertex.texcoord
    });
};

Device.prototype.drawPoint = function (point, color) {
    if (point.x >= 0 && point.y >= 0 && point.x < this.workingWidth && point.y < this.workingHeight) {
        this.putPixel(point.x, point.y, point.z, color);
    }
};

Device.prototype.render = function (camera, model, worldMatrix, viewMatrix, projectionMatrix, texture) {
    let transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);
    model.meshes.forEach(mesh => {
        let idx = 0;
        mesh.Faces.forEach(face => {
            let v1 = this.project(mesh.Vertices[face.A], transformMatrix, worldMatrix);
            let v2 = this.project(mesh.Vertices[face.B], transformMatrix, worldMatrix);
            let v3 = this.project(mesh.Vertices[face.C], transformMatrix, worldMatrix);

            let finalColor = new Color4(1, 1, 1, 1);

            if (this.isWireFrame) {
                this.drawLine(v1, v2, finalColor);
                this.drawLine(v2, v3, finalColor);
                this.drawLine(v3, v1, finalColor);
            } else {
                this.drawTriangle(v1, v2, v3, finalColor, texture);
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
Device.prototype.interpolate = function (val1, val2, gradient) {
    if (val1 > val2) {
        return val1 - (val1 - val2) * this.clamp(gradient);
    } else {
        return val1 + (val2 - val1) * this.clamp(gradient);
    }
};

Device.prototype.processScanLine = function (data, va, vb, vc, vd, color, texture) {

    let pa = va.position2D;
    let pb = vb.position2D;
    let pc = vc.position2D;
    let pd = vd.position2D;

    let gradient1 = (pa.y !== pb.y) ? (data.y - pa.y) / (pb.y - pa.y) : 1;
    let gradient2 = (pc.y !== pd.y) ? (data.y - pc.y) / (pd.y - pc.y) : 1;

    let sx = this.interpolate(pa.x, pb.x, gradient1) >> 0;
    let ex = this.interpolate(pc.x, pd.x, gradient2) >> 0;

    // 计算 开始Z值 和 结束Z值
    let z1 = this.interpolate(pa.z, pb.z, gradient1);
    let z2 = this.interpolate(pc.z, pd.z, gradient2);

    let tua = Number(va.texcoord.x);
    let tub = Number(vb.texcoord.x);
    let tuc = Number(vc.texcoord.x);
    let tud = Number(vd.texcoord.x);
    let tva = Number(va.texcoord.y);
    let tvb = Number(vb.texcoord.y);
    let tvc = Number(vc.texcoord.y);
    let tvd = Number(vd.texcoord.y);

    let su = this.interpolate(tua, tub, gradient1);
    let eu = this.interpolate(tuc, tud, gradient2);
    let sv = this.interpolate(tva, tvb, gradient1);
    let ev = this.interpolate(tvc, tvd, gradient2);

    let snl = this.interpolate(data.nldota, data.nldotb, gradient1);
    let enl = this.interpolate(data.nldotc, data.nldotd, gradient2);

    // 限定 sx < ex
    if (sx > ex) {
        let tmp = sx;
        sx = ex;
        ex = tmp;
    }

    if (snl > enl) {
        let tmp = snl;
        snl = enl;
        enl = tmp;
    }

    // if (su > eu) console.log(su , eu);

    for (let x = sx; x < ex; x++) {
        let gradient = (x - sx) / (ex - sx);
        let z = this.interpolate(z1, z2, gradient);
        let u = this.interpolate(su, eu, gradient);
        let v = this.interpolate(sv, ev, gradient);
        let notl = this.interpolate(snl, enl, gradient);

        let textureColor;

        if (texture)
            textureColor = texture.TextureMap(u, v);
        else
            textureColor = new Color4(1, 1, 1, 1);

        this.drawPoint(new Vector3(x, data.y, z), new Color4(
            color.r * textureColor.r * notl,
            color.g * textureColor.g * notl,
            color.b * textureColor.b * notl, 1.0));
    }
};

Device.prototype.drawTriangle = function (v1, v2, v3, color, texture) {

    let y;
    let temp;
    if (v1.position2D.y > v2.position2D.y) {
        temp = v2;
        v2 = v1;
        v1 = temp;
    }
    if (v2.position2D.y > v3.position2D.y) {
        temp = v2;
        v2 = v3;
        v3 = temp;
    }
    if (v1.position2D.y > v2.position2D.y) {
        temp = v2;
        v2 = v1;
        v1 = temp;
    }

    // 光照位置
    let lightPos = new Vector3(0, 10, 10);

    // 计算光向量和法线向量之间夹角的余弦
    // 它会返回介于0和1之间的值，该值将被用作颜色的亮度
    let nldot1 = this.computeNDotL(v1.position3D, v1.normal3D, lightPos);
    let nldot2 = this.computeNDotL(v2.position3D, v2.normal3D, lightPos);
    let nldot3 = this.computeNDotL(v3.position3D, v3.normal3D, lightPos);

    let data = {};

    // 反向斜率
    let dP1P2;
    let dP1P3;

    if (v2.position2D.y - v1.position2D.y > 0) {
        dP1P2 = (v2.position2D.x - v1.position2D.x) / (v2.position2D.y - v1.position2D.y);
    } else {
        dP1P2 = 0;
    }

    if (v3.position2D.y - v1.position2D.y > 0) {
        dP1P3 = (v3.position2D.x - v1.position2D.x) / (v3.position2D.y - v1.position2D.y);
    } else {
        dP1P3 = 0;
    }

    if (dP1P2 > dP1P3) {
        for (y = v1.position2D.y >> 0; y <= v3.position2D.y >> 0; y++) {
            data.y = y;
            data.nldota = nldot1;
            data.nldotb = nldot3;
            if (y < v2.position2D.y) {
                data.nldotc = nldot1;
                data.nldotd = nldot2;
                this.processScanLine(data, v1, v3, v1, v2, color, texture);
            } else {
                data.nldotc = nldot2;
                data.nldotd = nldot3;
                this.processScanLine(data, v1, v3, v2, v3, color, texture);
            }

        }
    } else {
        for (y = v1.position2D.y >> 0; y <= v3.position2D.y >> 0; y++) {
            data.y = y;
            data.nldotc = nldot1;
            data.nldotd = nldot3;
            if (y < v2.position2D.y) {
                data.nldota = nldot1;
                data.nldotb = nldot2;
                this.processScanLine(data, v1, v2, v1, v3, color, texture);
            } else {
                data.nldota = nldot2;
                data.nldotb = nldot3;
                this.processScanLine(data, v2, v3, v1, v3, color, texture);
            }
        }
    }
};

// 计算光向量和法线向量之间角度的余弦
// 返回0到1之间的值
Device.prototype.computeNDotL = function (vertex, normal, lightPosition) {
    let lightDirection = lightPosition.subtract(vertex);

    normal.normalize();
    lightDirection.normalize();

    return Math.max(0, Vector3.Dot(normal, lightDirection));
};