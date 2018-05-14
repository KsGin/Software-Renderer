function ShaderDevice(device) {
    this.device = device;
}

ShaderDevice.prototype.DirectionLightShader_VS = function (vertex , worldMatrix , viewMatrix , projectionMatrix) {

    let transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);

    let position2D = Vector3.TransformCoordinates(vertex.position, transformMatrix);

    let x = -position2D.x * this.device.workingWidth + this.device.workingWidth / 2.0 >> 0;
    let y = -position2D.y * this.device.workingHeight + this.device.workingHeight / 2.0 >> 0;

    let position3D = Vector3.TransformCoordinates(vertex.position, worldMatrix);
    let normal3D = Vector3.TransformNormal(vertex.normal, worldMatrix);

    return ({
        position2D: new Vector3(x, y, position2D.z),
        position3D: position3D,
        normal3D: normal3D,
        texcoord: vertex.texcoord
    });
};



ShaderDevice.prototype.DirectionLightShader_PS = function (psInput , texture) {

};