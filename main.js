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
let model;
let camera;
let viewMatrix;
let projectionMatrix;
let worldMatrix;
let startTime;
let endTime;
let rolation;
let texture;
let preTime;
let cutTime;
let fps;
let frameCount;
let light;

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


    document.getElementById("lightDirectionX").value = 0;
    document.getElementById("lightDirectionY").value = 10;
    document.getElementById("lightDirectionZ").value = 0;

    light = new Light();
    light.diffuseLight = new DiffuseLight(0 , 10 , 0);
};

function StartConfigRender() {

    camera = new Camera();
    camera.Position = new Vector3(0, 10, 10);
    camera.Target = new Vector3(0, 0, 0);

    model = new Model();
    model.LoadModelFromMyModelTypeFile();

    texture = new Texture("asserts/tex1.png" , 1364 , 764);

    worldMatrix = Matrix.Identity().multiply(Matrix.Scaling(0.5, 0.5, 0.5));
    viewMatrix = Matrix.LookAtLH(camera.Position, camera.Target, Vector3.Up());
    projectionMatrix = Matrix.PerspectiveFovLH(0.78, canvas.width / canvas.height, 0.01, 10.0);

    requestAnimationFrame(Render);
}

function Render() {

    let world;

    rolation += 0.005;
    if (rolation > 360){
        rolation -= 360;
    }

    device.clearColorAndDepth();
    world = worldMatrix.multiply(Matrix.RotationYawPitchRoll(rolation,rolation, 0));
    device.render(camera, model, world, viewMatrix, projectionMatrix , texture , light);
    device.present();

    displayFPS();

    requestAnimationFrame(Render);
}


function displayFPS() {

    frameCount += 1;

    cutTime = new Date().getTime();
    if (cutTime - preTime > 1000){
        preTime = cutTime;
        fps = frameCount;
        frameCount = 0;
    }

    document.getElementById("fpsDisplay").innerText = fps;
}

function UpdateWireFrameMode() {
    device.isWireFrame = !device.isWireFrame;
}

function UpdateDepthTestMode() {
    device.isDepthTest = !device.isDepthTest;
}

function UpdateLightDirection() {
    let x , y , z;
    x = Number(document.getElementById("lightDirectionX").value);
    y = Number(document.getElementById("lightDirectionY").value);
    z = Number(document.getElementById("lightDirectionZ").value);
    light.diffuseLight.direction.x = x;
    light.diffuseLight.direction.y = y;
    light.diffuseLight.direction.z = z;
}