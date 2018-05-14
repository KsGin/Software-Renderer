function Raster(device) {
    this.device = device;
}

Raster.prototype.Raster = function (v1 , v2 , v3 , texture , light) {
    this.RasterTriangle(v1 , v2 , v3 , texture , light);
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

Raster.prototype.processScanLine = function (data, va, vb, vc, vd, texture) {

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
        tmp = snl;
        snl = enl;
        enl = tmp;
        tmp = su;
        su = eu;
        eu = tmp;
        tmp = sv;
        sv = ev;
        ev = tmp;
    }

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

        device.drawPoint(
            new Vector3(x, data.y, z),
            new Color4(textureColor.r * notl, textureColor.g * notl, textureColor.b * notl, 1.0));
    }
};

Raster.prototype.RasterTriangle = function (v1, v2, v3, texture, light) {

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

    let nldot1, nldot2, nldot3;

    if (light.diffuseLight != null) {
        // 计算光向量和法线向量之间夹角的余弦
        // 它会返回介于0和1之间的值，该值将被用作颜色的亮度
        nldot1 = this.computeNDotL(v1.position3D, v1.normal3D, light.diffuseLight.direction);
        nldot2 = this.computeNDotL(v2.position3D, v2.normal3D, light.diffuseLight.direction);
        nldot3 = this.computeNDotL(v3.position3D, v3.normal3D, light.diffuseLight.direction);
    } else {
        nldot1 = 1;
        nldot2 = 1;
        nldot3 = 1;
    }

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
                this.processScanLine(data, v1, v3, v1, v2, texture);
            } else {
                data.nldotc = nldot2;
                data.nldotd = nldot3;
                this.processScanLine(data, v1, v3, v2, v3, texture);
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
                this.processScanLine(data, v1, v2, v1, v3, texture);
            } else {
                data.nldota = nldot2;
                data.nldotb = nldot3;
                this.processScanLine(data, v2, v3, v1, v3, texture);
            }
        }
    }
};

// 计算光向量和法线向量之间角度的余弦
// 返回0到1之间的值
Raster.prototype.computeNDotL = function (vertex, normal, lightDirection) {
    normal.normalize();
    lightDirection.normalize();
    return Math.max(0, Vector3.Dot(normal, lightDirection));
};