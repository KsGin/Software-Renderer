function Raster(device) {
    this.device = device;
}

Raster.prototype.SolidRaster = function (v1, v2, v3) {

    this.FixPosition2D(v1);
    this.FixPosition2D(v2);
    this.FixPosition2D(v3);

    if(device.enableCCWCull && this.ccwJudge(v1 , v2 , v3)){
        return [];
    }

    if(device.enableCWCull && !this.ccwJudge(v1 , v2 , v3)){
        return [];
    }

    return this.RasterTriangle(v1, v2, v3);
};

Raster.prototype.WireFrameRaster = function (v1, v2, v3) {

    this.FixPosition2D(v1);
    this.FixPosition2D(v2);
    this.FixPosition2D(v3);

    this.drawLine(v1 , v2);
    this.drawLine(v2 , v3);
    this.drawLine(v3 , v1);
};

Raster.prototype.FixPosition2D = function (vertex) {
    vertex.position.x = vertex.position.x * this.device.workingWidth + this.device.workingWidth / 2.0 >> 0;
    vertex.position.y = -vertex.position.y * this.device.workingHeight + this.device.workingHeight / 2.0 >> 0;
};

// 限制数值范围在0和1之间
Raster.prototype.clamp = function (value, min, max) {
    if (typeof min === "undefined") {
        min = 0;
    }
    if (typeof max === "undefined") {
        max = 1;
    }
    return Math.max(min, Math.min(value, max));
};

Raster.prototype.processScanLine = function (y, va, vb, vc, vd, res) {

    let pa = va.position;
    let pb = vb.position;
    let pc = vc.position;
    let pd = vd.position;

    let gradient1 = (pa.y !== pb.y) ? (y - pa.y) / (pb.y - pa.y) : 1;
    let gradient2 = (pc.y !== pd.y) ? (y - pc.y) / (pd.y - pc.y) : 1;

    let sv = this.interpolateVertex(va , vb , gradient1);
    let ev = this.interpolateVertex(vc , vd , gradient2);

    // 限定 sx < ex
    if (sv.position.x > ev.position.x) {
        let tmp;
        tmp = sv;
        sv = ev;
        ev = tmp;
    }

    for (let x = sv.position.x; x < ev.position.x; x++) {
        let gradient = (x - sv.position.x) / (ev.position.x - sv.position.x);
        let v = this.interpolateVertex(sv , ev , gradient);
        res.push(v);
    }
};

Raster.prototype.RasterTriangle = function (v1, v2, v3) {

    let y;
    let temp;
    if (v1.position.y > v2.position.y) {
        temp = v2;
        v2 = v1;
        v1 = temp;
    }
    if (v2.position.y > v3.position.y) {
        temp = v2;
        v2 = v3;
        v3 = temp;
    }
    if (v1.position.y > v2.position.y) {
        temp = v2;
        v2 = v1;
        v1 = temp;
    }

    // 反向斜率
    let dP1P2;
    let dP1P3;

    if (v2.position.y - v1.position.y > 0) {
        dP1P2 = (v2.position.x - v1.position.x) / (v2.position.y - v1.position.y);
    } else {
        dP1P2 = 0;
    }

    if (v3.position.y - v1.position.y > 0) {
        dP1P3 = (v3.position.x - v1.position.x) / (v3.position.y - v1.position.y);
    } else {
        dP1P3 = 0;
    }

    let res = [];

    if (dP1P2 > dP1P3) {
        for (y = v1.position.y >> 0; y <= v3.position.y >> 0; y++) {
            if (y < v2.position.y) {
                this.processScanLine(y, v1, v3, v1, v2, res);
            } else {
                this.processScanLine(y, v1, v3, v2, v3, res);
            }

        }

    } else {
        for (y = v1.position.y >> 0; y <= v3.position.y >> 0; y++) {
            if (y < v2.position.y) {
                this.processScanLine(y, v1, v2, v1, v3, res);
            } else {
                this.processScanLine(y, v2, v3, v1, v3, res);
            }
        }
    }

    return res;
};


Raster.prototype.drawLine = function (v0, v1) {
    let x0 = v0.position.x >> 0;
    let y0 = v0.position.y >> 0;
    let x1 = v1.position.x >> 0;
    let y1 = v1.position.y >> 0;
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

Raster.prototype.ccwJudge = function (v1 , v2 , v3) {
    let d1 = v2.position.subtract(v1.position);
    let d2 = v3.position.subtract(v1.position);
    d1.z = 0;
    d2.z = 0;

    let d = Vector3.Cross(d1 , d2);

    d.normalize();

    let lhr = new Vector3(0 , 0 , 1);

    return Vector3.Dot(d , lhr) < 0;
};


// 过渡插值
Raster.prototype.interpolate = function (val1, val2, gradient) {
    return val1 + (val2 - val1) * this.clamp(gradient);
};

Raster.prototype.interpolateVertex = function(v1 , v2 , gradient){
    let res = {};
    res.position = this.interpolateVector3(v1.position , v2.position , gradient);
    res.normal = this.interpolateVector3(v1.normal , v2.normal , gradient);
    res.texcoord = this.interpolateVector2(v1.texcoord , v2.texcoord , gradient);
    if(v1.worldPosition){
        res.worldPosition = this.interpolateVector3(v1.worldPosition, v2.worldPosition, gradient);
    }
    return res;
};

Raster.prototype.interpolateVector3 = function(v1 , v2 , gradient){
    let vx = this.interpolate(v1.x , v2.x , gradient);
    let vy = this.interpolate(v1.y , v2.y , gradient);
    let vz = this.interpolate(v1.z , v2.z , gradient);
    return new Vector3(vx , vy , vz);
};

Raster.prototype.interpolateVector2 = function(v1 , v2 , gradient){
    let vx = this.interpolate(v1.x , v2.x , gradient);
    let vy = this.interpolate(v1.y , v2.y , gradient);
    return new Vector2(vx , vy);
};
