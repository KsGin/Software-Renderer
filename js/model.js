function Vertex(position, texcoord, normal) {
    this.position = position;
    this.texcoord = texcoord;
    this.normal = normal;
}

function Mesh(name, verticesCount, facesCount) {
    this.name = name;
    this.Vertices = new Array(verticesCount);
    this.Faces = new Array(facesCount);
}

function Model() {
    this.meshes = [];
}

Model.prototype.LoadModelFromMyModelTypeFile = function () {

    let meshes = [];

    let mesh = new Mesh;
    // get file
    let modelFile = document.getElementById("modelFile").files[0];
    let reader = new FileReader();

    reader.onload = function (res) {
        let text = res.target.result;
        let texArray = text.split(/\s+|\r+\n+/);

        mesh = new Mesh(modelFile.name.replace(/\..+/, ''), texArray[0], texArray[0] / 3);

        meshes.push(mesh);

        let vertex;
        let position;
        let texcoord;
        let normal;
        for (let i = 0; i < (texArray.length - 1) / 24; ++i) {
            for (let j = 0 ; j < 3 ; ++j){
                position = new Vector3(texArray[i * 24 + 8 * j + 1], texArray[i * 24 + 8 * j + 1 + 1], texArray[i * 24 + 8 * j + 2 + 1]);
                texcoord = new Vector2(texArray[i * 24 + 8 * j + 3 + 1] , texArray[i * 24 + 8 * j + 4 + 1]);
                normal   = new Vector3(texArray[i * 24 + 8 * j + 5 + 1] , texArray[i * 24 + 8 * j + 6 + 1] , texArray[i * 24 + 8 * j + 7 + 1]);
                vertex = new Vertex(position , texcoord , normal);
                mesh.Vertices[i * 3 + j] = vertex;
            }
            mesh.Faces[i] = {A: i * 3, B: i * 3 + 1, C: i * 3 + 2};
        }

    };
    reader.readAsText(modelFile);
    
    this.meshes = meshes;
};

