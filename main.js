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

window.onload = function () {
    fps = 60;
    startTime = 0;
    endTime = 0;
    canvas = document.getElementById("frontBuffer");
    device = new Device(canvas);
};

function StartRenderModel() {

    camera = new Camera();
    camera.Position = new Vector3(0, 5, 10);
    camera.Target = new Vector3(0, 0, 0);

    model = new Model();
    model.LoadModelFromMyModelTypeFile();

    worldMatrix = Matrix.Identity();
    worldMatrix = worldMatrix.multiply(Matrix.Scaling(0.3, 0.3, 0.3));
    viewMatrix = Matrix.LookAtLH(camera.Position, camera.Target, Vector3.Up());
    projectionMatrix = Matrix.PerspectiveFovLH(0.78, canvas.width / canvas.height, 0.01, 10.0);

    requestAnimationFrame(Render);
}

function Render() {
    startTime = new Date().getTime();
    device.clearColorAndDepth();
    worldMatrix = worldMatrix.multiply(Matrix.RotationYawPitchRoll(0.01, 0.01, 0));
    device.render(camera, model, worldMatrix, viewMatrix, projectionMatrix);
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