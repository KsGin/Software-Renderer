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
let mesh;
let meshes;
let camera;
let viewMatrix;
let projectionMatrix;
let worldMatrix;
let fps;
let startTime;
let endTime;

function loadModel() {

    fps = 60;
    startTime = 0;
    endTime = 0;

    // get file
    let modelFile = document.getElementById("modelFile").files[0];
    let reader = new FileReader();

    // init data
    meshes = [];
    canvas = document.getElementById("frontBuffer");

    camera = new SoftwareRenderer.Camera();
    device = new SoftwareRenderer.Device(canvas);

    reader.onload = function (res) {
        let text = res.target.result;
        let texArray = text.split(/\s+|\r+\n+/);

        mesh = new SoftwareRenderer.Mesh("Model", texArray[0], texArray[0] / 3);
        meshes.push(mesh);

        for (let i = 0; i < (texArray.length - 1) / 24; ++i) {
            mesh.Vertices[i * 3] = new BABYLON.Vector3(texArray[i * 24 + 1], texArray[i * 24 + 1 + 1], texArray[i * 24 + 2 + 1]);
            mesh.Vertices[i * 3 + 1] = new BABYLON.Vector3(texArray[i * 24 + 8 + 1], texArray[i * 24 + 8 + 1 + 1], texArray[i * 24 + 8 + 2 + 1]);
            mesh.Vertices[i * 3 + 2] = new BABYLON.Vector3(texArray[i * 24 + 16 + 1], texArray[i * 24 + 16 + 1 + 1], texArray[i * 24 + 16 + 2 + 1]);
            mesh.Faces[i] = {A: i * 3, B: i * 3 + 1, C: i * 3 + 2};
        }

        camera.Position = new BABYLON.Vector3(0, 5, 10);
        camera.Target = new BABYLON.Vector3(0, 0, 0);

        worldMatrix = BABYLON.Matrix.Translation(mesh.Position.x, mesh.Position.y, mesh.Position.z);
        worldMatrix = worldMatrix.multiply(BABYLON.Matrix.Scaling(0.3 , 0.3 , 0.3));
        viewMatrix = BABYLON.Matrix.LookAtLH(camera.Position, camera.Target, BABYLON.Vector3.Up());
        projectionMatrix = BABYLON.Matrix.PerspectiveFovLH(0.78, canvas.width / canvas.height, 0.01, 10.0);

        requestAnimationFrame(Render);
    };

    reader.readAsText(modelFile);
}

function Render() {
    startTime = new Date().getTime();
    device.clearColorAndDepth();
    worldMatrix = worldMatrix.multiply(BABYLON.Matrix.RotationYawPitchRoll(0.01, 0.01 , 0));
    device.render(camera, meshes, worldMatrix, viewMatrix, projectionMatrix);
    device.present();
    endTime = new Date().getTime();

    fps =  (1000 / (endTime - startTime)) >> 0;

    displayFPS();

    requestAnimationFrame(Render);
}


function displayFPS() {

    document.getElementById("fpsDisplay").innerText = fps;
}

function UpdateWireFrameMode() {
    device.isWireFrame = !device.isWireFrame;
}

function UpdateDepthTestMode(){
    device.isDepthTest = !device.isDepthTest;
}