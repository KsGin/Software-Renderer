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
    document.getElementById("lightDirectionX").value = 0;
    document.getElementById("lightDirectionY").value = 10;
    document.getElementById("lightDirectionZ").value = 10;

    light = new Light();
    light.diffuseLight = new DiffuseLight(0, 10, 10);
};

function StartConfigRender() {

    camera = new Camera();
    camera.Position = new Vector3(0, 3, 3);
    camera.Target = new Vector3(0, 0, 0);

    let cubeModel = new Model();
    cubeModel.InitCube();
    models.push(cubeModel);

    let groundModel = new Model();
    groundModel.InitGroundPlane();
    models.push(groundModel);

    let cubeTexture = new Texture("asserts/tex.png", 674, 706);
    textures.push(cubeTexture);

    let planeTexture = new Texture("asserts/tex1.png", 1364, 764);
    textures.push(planeTexture);


    worldMatrix = Matrix.Identity().multiply(Matrix.Scaling(0.5, 0.5, 0.5));
    viewMatrix = Matrix.LookAtLH(camera.Position, camera.Target, Vector3.Up());
    projectionMatrix = Matrix.PerspectiveFovLH(0.78, canvas.width / canvas.height, 0.01, 10.0);

    requestAnimationFrame(Render);
}

function Render() {

    let world;

    rolation += 0.008;
    if (rolation > 360) {
        rolation -= 360;
    }

    device.clearColorAndDepth();
    //
    // world = worldMatrix.multiply(Matrix.Translation(0 , 0 , 0));
    // device.render(models[1], world, viewMatrix, projectionMatrix, textures[2], light);

    world = worldMatrix.multiply(Matrix.RotationYawPitchRoll(rolation, rolation, 0))
        .multiply(Matrix.Translation(1, 0, 0))
        .multiply(Matrix.Scaling(0.2 , 0.2 , 0.2));
    device.render(models[0], world, viewMatrix, projectionMatrix, textures[1], light);

    world = worldMatrix.multiply(Matrix.RotationYawPitchRoll(-rolation, -rolation, 0))
        .multiply(Matrix.Translation(-1, 0, 0))
        .multiply(Matrix.Scaling(0.2 , 0.2 , 0.2));
    device.render(models[0], world, viewMatrix, projectionMatrix, textures[0], light);

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
    light.diffuseLight.direction.x = x;
    light.diffuseLight.direction.y = y;
    light.diffuseLight.direction.z = z;
}