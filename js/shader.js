function ShaderDevice(device) {
    this.device = device;
}

ShaderDevice.prototype.DirectionLightShader_VS = function (vsInput, worldMatrix, viewMatrix, projectionMatrix) {

    let transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);

    let position2D = Vector3.TransformCoordinates(vsInput.position, transformMatrix);

    let normal = Vector3.TransformNormal(vsInput.normal, worldMatrix);

    return ({
        position: position2D,
        normal: normal,
        texcoord: vsInput.texcoord
    });
};

ShaderDevice.prototype.DirectionLightShader_PS = function (psInput, texture, light) {

    let normal = psInput.normal;
    let lightd = light.diffuseLight.direction;

    normal.normalize();
    lightd.normalize();

    let nd = Math.max(0, Vector3.Dot(normal, lightd));

    let textureColor;

    if (texture) {
        textureColor = texture.TextureMap(psInput.texcoord.x, psInput.texcoord.y);
    } else {
        textureColor = new Color4(1, 1, 1, 1);
    }

    textureColor = new Color4(nd * textureColor.r, nd * textureColor.g, nd * textureColor.b, textureColor.a);

    return textureColor;
};