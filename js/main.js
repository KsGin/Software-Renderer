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
let mera;

function loadModel() {

    // get file
    let modelFile = document.getElementById("modelFile").files[0];
    let reader = new FileReader();

    // init data
    meshes = [];
    canvas = document.getElementById("frontBuffer");
    mera = new SoftwareRenderer.Camera();
    device = new SoftwareRenderer.Device(canvas);

    reader.onload = function (res) {
        let text = res.target.result;
        let texArray = text.split(/\s+|\r+\n+/);
        console.log(texArray);

        mesh = new SoftwareRenderer.Mesh("Cube", texArray[0], texArray[0]);
        meshes.push(mesh);

        for (let i = 0 ; i < (texArray.length-1) / 24 ; ++i){
            mesh.Vertices[i * 3] = new BABYLON.Vector3(texArray[i * 24 + 1] , texArray[i * 24 + 1 + 1] , texArray[i * 24 + 2 + 1]);
            mesh.Vertices[i * 3 + 1] = new BABYLON.Vector3(texArray[i * 24 + 8 + 1] , texArray[i * 24 + 8 + 1 + 1] , texArray[i * 24 + 8 + 2 + 1]);
            mesh.Vertices[i * 3 + 2] = new BABYLON.Vector3(texArray[i * 24 + 16 + 1] , texArray[i * 24 + 16 + 1 + 1] , texArray[i * 24 + 16 + 2 + 1]);
            mesh.Faces[i * 3] = {A:i * 3 , B:i*3+1 , C:i*3+2};
        }

        mera.Position = new BABYLON.Vector3(0, 0, 10);
        mera.Target = new BABYLON.Vector3(0, 0, 0);
        requestAnimationFrame(drawingLoop);
    };
    reader.readAsText(modelFile);
}

function drawingLoop() {
    device.clear();
    mesh.Rotation.x += 0.01;
    mesh.Rotation.y += 0.01;
    device.render(mera, meshes);
    device.present();
    requestAnimationFrame(drawingLoop);
}
