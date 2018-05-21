let count = 0;

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

let canvas;
let device;
let models;
let camera;
let viewMatrix;
let projectionMatrix;
let worldMatrix;
let startTime;
let endTime;
let rolation;
let preTime;
let cutTime;
let fps;
let frameCount;
let light;
let textures;

window.onload = function () {
    frameCount = 0;
    cutTime = 0;
    preTime = 0;
    rolation = 0;
    fps = 60;
    startTime = 0;
    endTime = 0;
    canvas = document.getElementById("frontBuffer");
    device = new Device(canvas);
    models = [];
    textures = [];

    document.getElementById("depthTestMode").checked = true;
    document.getElementById("ccwCullMode").checked = true;
    document.getElementById("directionLight").checked = true;
    document.getElementById("pointLight").checked = false;
    document.getElementById("lightDirectionX").value = 5;
    document.getElementById("lightDirectionY").value = -5;
    document.getElementById("lightDirectionZ").value = 0;
    document.getElementById("lightPositionX").value = -5;
    document.getElementById("lightPositionY").value = 0;
    document.getElementById("lightPositionZ").value = 0;
    document.getElementById("cameraLocationX").value = 0;
    document.getElementById("cameraLocationY").value = 3;
    document.getElementById("cameraLocationZ").value = -3;
    document.getElementById("cameraLookAtX").value = 0;
    document.getElementById("cameraLookAtY").value = 0;
    document.getElementById("cameraLookAtZ").value = 0;

    light = new Light();
    light.directionLight = new DirectionLight(5, -5, 0);
    light.pointLight = new PointLight(-5, 0, 0);

    camera = new Camera();
    camera.Position = new Vector3(0, 3, -3);
    camera.Target = new Vector3(0, 0, 0);
};

function StartConfigRender() {

    let cubeModel = new Model();
    cubeModel.InitCube();
    models.push(cubeModel);

    let groundModel = new Model();
    groundModel.InitGroundPlane();
    models.push(groundModel);

    let cubeTexture = new Texture("asserts/tex.png", 674, 706);
    textures.push(cubeTexture);

    let cudeTexture1 = new Texture("asserts/tex1.png", 256, 256);
    textures.push(cudeTexture1);

    let cudeTexture2 = new Texture("asserts/tex2.png", 308, 308);
    textures.push(cudeTexture2);

    worldMatrix = Matrix.Identity().multiply(Matrix.Scaling(0.5, 0.5, 0.5));
    viewMatrix = Matrix.LookAtLH(camera.Position, camera.Target, Vector3.Up());
    projectionMatrix = Matrix.PerspectiveFovLH(0.8, canvas.width / canvas.height, 0.01, 1000.0);

    requestAnimationFrame(Render);
}

function Render() {

    let world;

    rolation += 0.008;
    if (rolation > 360) {
        rolation -= 360;
    }

    device.clearColorAndDepth();

    world = worldMatrix.multiply(Matrix.RotationYawPitchRoll(rolation, rolation, 0))
        .multiply(Matrix.Translation(1, 1, 0))
        .multiply(Matrix.Scaling(0.2, 0.2, 0.2));
    device.render(models[0], world, viewMatrix, projectionMatrix, textures[1], light);

    world = worldMatrix.multiply(Matrix.RotationYawPitchRoll(0, rolation, rolation))
        .multiply(Matrix.Translation(-1, 1, 0))
        .multiply(Matrix.Scaling(0.2, 0.2, 0.2));
    device.render(models[0], world, viewMatrix, projectionMatrix, textures[0], light);

    world = worldMatrix.multiply(Matrix.RotationYawPitchRoll(0, rolation, rolation))
        .multiply(Matrix.Translation(0, -1, 0))
        .multiply(Matrix.Scaling(0.2, 0.2, 0.2));
    device.render(models[0], world, viewMatrix, projectionMatrix, textures[2], light);

    device.present();

    displayFPS();

    requestAnimationFrame(Render);
}


function displayFPS() {

    frameCount += 1;

    cutTime = new Date().getTime();
    if (cutTime - preTime > 1000) {
        preTime = cutTime;
        fps = frameCount;
        frameCount = 0;
    }

    document.getElementById("fpsDisplay").innerText = fps;
}

function UpdateWireFrameMode() {
    device.enableWireFrame = !device.enableWireFrame;
}

function UpdateDepthTestMode() {
    device.enableDepthTest = !device.enableDepthTest;
}

function UpdateLightDirection() {
    let x, y, z;
    x = Number(document.getElementById("lightDirectionX").value);
    y = Number(document.getElementById("lightDirectionY").value);
    z = Number(document.getElementById("lightDirectionZ").value);
    light.directionLight.direction.x = x;
    light.directionLight.direction.y = y;
    light.directionLight.direction.z = z;
}

function UpdateLightPosition() {
    let x, y, z;
    x = Number(document.getElementById("lightPositionX").value);
    y = Number(document.getElementById("lightPositionY").value);
    z = Number(document.getElementById("lightPositionZ").value);
    light.pointLight.position.x = x;
    light.pointLight.position.y = y;
    light.pointLight.position.z = z;
}

function UpdateCameraLocation() {
    let x, y, z;
    x = Number(document.getElementById("cameraLocationX").value);
    y = Number(document.getElementById("cameraLocationY").value);
    z = Number(document.getElementById("cameraLocationZ").value);
    camera.Position.x = x;
    camera.Position.y = y;
    camera.Position.z = z;
    viewMatrix = Matrix.LookAtLH(camera.Position, camera.Target, Vector3.Up());
}

function UpdateCameraLookAt() {
    let x, y, z;
    x = Number(document.getElementById("cameraLookAtX").value);
    y = Number(document.getElementById("cameraLookAtY").value);
    z = Number(document.getElementById("cameraLookAtZ").value);
    camera.Target.x = x;
    camera.Target.y = y;
    camera.Target.z = z;
    viewMatrix = Matrix.LookAtLH(camera.Position, camera.Target, Vector3.Up());
}

function UpdateCCWCullMode() {
    device.enableCCWCull = !device.enableCCWCull;
}

function UpdateCWCullMode() {
    device.enableCWCull = !device.enableCWCull;
}

function UpdateLightMode() {
    device.directionLight = !device.directionLight;
    device.pointLight = !device.pointLight;
    document.getElementById("directionLight").checked = device.directionLight;
    document.getElementById("pointLight").checked = device.pointLight;
}
