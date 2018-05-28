function ShaderDevice(device, camera) {
    this.device = device;
    this.camera = camera;
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
    let lightf = light.directionLight.direction.negate();

    normal.normalize();
    lightf.normalize();

    let nd = Math.min(Math.max(0, Vector3.Dot(normal, lightf)), 1);

    let textureColor;

    if (texture) {
        textureColor = texture.TextureMap(psInput.texcoord.x, psInput.texcoord.y);
    } else {
        textureColor = new Color4(1, 1, 1, 1);
    }

    let ambient = 0.1;

    textureColor = textureColor.multiply(nd + ambient);

    return textureColor;
};

ShaderDevice.prototype.PointLightShader_VS = function (vsInput, worldMatrix, viewMatrix, projectionMatrix) {

    let transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);

    let position2D = Vector3.TransformCoordinates(vsInput.position, transformMatrix);

    let worldPos = Vector3.TransformCoordinates(vsInput.position, worldMatrix);
    let normal = Vector3.TransformNormal(vsInput.normal, worldMatrix);

    return ({
        worldPosition: worldPos,
        position: position2D,
        normal: normal,
        texcoord: vsInput.texcoord
    });
};

ShaderDevice.prototype.PointLightShader_PS = function (psInput, texture, light) {

    let normal = psInput.normal;
    let lightp = light.pointLight.position;

    let lightd = lightp.subtract(psInput.worldPosition);

    normal.normalize();
    lightd.normalize();

    let nd = Math.max(0, Vector3.Dot(normal, lightd));

    let textureColor;

    if (texture) {
        textureColor = texture.TextureMap(psInput.texcoord.x, psInput.texcoord.y);
    } else {
        textureColor = new Color4(1, 1, 1, 1);
    }

    let ambient = 0.1;

    textureColor = textureColor.multiply(nd + ambient);

    return textureColor;
};
