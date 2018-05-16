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
    let lightd = light.directionLight.direction;
    let lightf = new Vector3(-lightd.x, -lightd.y, -lightd.z);

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

ShaderDevice.prototype.DirectionLightShadowShader_VS = function (vsInput, worldMatrix, viewMatrix, projectionMatrix, lightViewMatrix, lightProjectionMatrix) {

    let transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);
    let lightViewTransformMatrix = worldMatrix.multiply(lightViewMatrix).multiply(lightProjectionMatrix);

    let lightViewPosition = Vector3.TransformCoordinates(vsInput.position, lightViewTransformMatrix);
    let position = Vector3.TransformCoordinates(vsInput.position, transformMatrix);

    let normal = Vector3.TransformNormal(vsInput.normal, worldMatrix);

    return ({
        position: position,
        normal: normal,
        texcoord: vsInput.texcoord,
        lightViewPosition: lightViewPosition
    });
};

ShaderDevice.prototype.DirectionLightShadowShader_PS = function (psInput, texture, depthMap, light) {

    let normal = psInput.normal;
    let lightd = light.directionLight.direction;
    let lightf = new Vector3(-lightd.x, -lightd.y, -lightd.z);

    normal.normalize();
    lightf.normalize();

    let textureColor;

    if (texture) {
        textureColor = texture.TextureMap(psInput.texcoord.x, psInput.texcoord.y);
    } else {
        textureColor = new Color4(1, 1, 1, 1);
    }

    let bias = 0.01;
    let tu = psInput.lightViewPosition.x / 2.0 + 0.5;
    let tv = -psInput.lightViewPosition.y / 2.0 + 0.5;

    let ambient = 0.1;
    let diffuseIntensity = 0;

    if (device.clamp(tu) === tu && device.clamp(tv) === tv) {
        let mapZ = depthMap.TextureMapClamp(tu, tv).r;

        if (psInput.lightViewPosition.z - bias < mapZ) {
            diffuseIntensity = device.clamp(Vector3.Dot(normal, lightf));
        } else {
            diffuseIntensity = 0;
        }
    }

    textureColor = textureColor.multiply(diffuseIntensity + ambient);

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

ShaderDevice.prototype.RenderDepthMap_VS = function (vsInput, worldMatrix, viewMatrix, projectionMatrix) {

    let transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);

    let position = Vector3.TransformCoordinates(vsInput.position, transformMatrix);

    return ({
        position: position,
    });
};

ShaderDevice.prototype.RenderDepthMap_PS = function (psInput) {
    return new Color4(psInput.position.z, psInput.position.z, psInput.position.z, 1);
};