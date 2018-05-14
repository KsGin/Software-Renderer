function Raster(device) {
    this.device = device;
}

Raster.prototype.SolidRaster = function (v1, v2, v3) {

    this.FixPosition2D(v1);
    this.FixPosition2D(v2);
    this.FixPosition2D(v3);

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
    vertex.position.x = -vertex.position.x * this.device.workingWidth + this.device.workingWidth / 2.0 >> 0;
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

// 过渡插值
Raster.prototype.interpolate = function (val1, val2, gradient) {
    return val1 + (val2 - val1) * this.clamp(gradient);
};

Raster.prototype.processScanLine = function (y, va, vb, vc, vd, res) {

    let pa = va.position;
    let pb = vb.position;
    let pc = vc.position;
    let pd = vd.position;

    let gradient1 = (pa.y !== pb.y) ? (y - pa.y) / (pb.y - pa.y) : 1;
    let gradient2 = (pc.y !== pd.y) ? (y - pc.y) / (pd.y - pc.y) : 1;

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

    let nxa = Number(va.normal.x);
    let nya = Number(va.normal.y);
    let nza = Number(va.normal.z);
    let nxb = Number(vb.normal.x);
    let nyb = Number(vb.normal.y);
    let nzb = Number(vb.normal.z);
    let nxc = Number(vc.normal.x);
    let nyc = Number(vc.normal.y);
    let nzc = Number(vc.normal.z);
    let nxd = Number(vd.normal.x);
    let nyd = Number(vd.normal.y);
    let nzd = Number(vd.normal.z);

    let snx = this.interpolate(nxa, nxb, gradient1);
    let enx = this.interpolate(nxc, nxd, gradient2);
    let sny = this.interpolate(nya, nyb, gradient1);
    let eny = this.interpolate(nyc, nyd, gradient2);
    let snz = this.interpolate(nza, nzb, gradient1);
    let enz = this.interpolate(nzc, nzd, gradient2);

    // 限定 sx < ex
    if (sx > ex) {
        let tmp;
        tmp = sx;
        sx = ex;
        ex = tmp;
        tmp = su;
        su = eu;
        eu = tmp;
        tmp = sv;
        sv = ev;
        ev = tmp;
        tmp = snx;
        snx = enx;
        enx = tmp;
        tmp = sny;
        sny = eny;
        eny = tmp;
        tmp = snz;
        snz = enz;
        enz = tmp;
    }

    for (let x = sx; x < ex; x++) {
        let gradient = (x - sx) / (ex - sx);
        let z = this.interpolate(z1, z2, gradient);
        let u = this.interpolate(su, eu, gradient);
        let v = this.interpolate(sv, ev, gradient);
        let nx = this.interpolate(snx, enx, gradient);
        let ny = this.interpolate(sny, eny, gradient);
        let nz = this.interpolate(snz, enz, gradient);

        res.push({
            position: new Vector3(x, y, z),
            texcoord: new Vector2(u, v),
            normal: new Vector3(nx, ny, nz)
        });
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
