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
let fps;
let startTime;
let endTime;

let rolation;

window.onload = function () {
    rolation = 0;
    fps = 60;
    startTime = 0;
    endTime = 0;
    canvas = document.getElementById("frontBuffer");
    device = new Device(canvas);
};

function StartConfigRender() {

    camera = new Camera();
    camera.Position = new Vector3(0, 10, 10);
    camera.Target = new Vector3(0, 0, 0);

    model = new Model();
    model.LoadModelFromMyModelTypeFile();

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

    startTime = new Date().getTime();
    device.clearColorAndDepth();
    world = worldMatrix.multiply(Matrix.RotationYawPitchRoll(rolation,0, 0));
    device.render(camera, model, world, viewMatrix, projectionMatrix);
    device.present();
    endTime = new Date().getTime();

    fps = (1000 / (endTime - startTime)) >> 0;

    displayFPS();

    requestAnimationFrame(Render);
}


function displayFPS() {

    document.getElementById("fpsDisplay").innerText = fps;
}

function UpdateWireFrameMode() {
    device.isWireFrame = !device.isWireFrame;
}

function UpdateDepthTestMode() {
    device.isDepthTest = !device.isDepthTest;
}