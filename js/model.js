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

Model.prototype.LoadModelFromMyModelTypeFile = function (i) {

    let meshes = [];

    let mesh = new Mesh;
    // get file
    let modelFile = document.getElementById("modelFile").files[i];
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
            for (let j = 0; j < 3; ++j) {
                position = new Vector3(texArray[i * 24 + 8 * j + 1], texArray[i * 24 + 8 * j + 1 + 1], texArray[i * 24 + 8 * j + 2 + 1]);
                texcoord = new Vector2(texArray[i * 24 + 8 * j + 3 + 1], texArray[i * 24 + 8 * j + 4 + 1]);
                normal = new Vector3(texArray[i * 24 + 8 * j + 5 + 1], texArray[i * 24 + 8 * j + 6 + 1], texArray[i * 24 + 8 * j + 7 + 1]);
                vertex = new Vertex(position, texcoord, normal);
                mesh.Vertices[i * 3 + j] = vertex;
            }
            mesh.Faces[i] = {A: i * 3, B: i * 3 + 1, C: i * 3 + 2};
        }

    };
    reader.readAsText(modelFile);

    this.meshes = meshes;
};


Model.prototype.InitGroundPlane = function () {
    let meshes = [];
    let mesh = new Mesh("ground", 6, 2);
    meshes.push(mesh);

    let positions = [];
    let texcoord;
    let normal;

    positions[0] = new Vector3(-1, 0, 1);
    positions[1] = new Vector3(-1, 0, -1);
    positions[2] = new Vector3(1, 0, -1);
    positions[3] = new Vector3(-1, 0, 1);
    positions[4] = new Vector3(1, 0, -1);
    positions[5] = new Vector3(1, 0, 1);

    texcoord = new Vector2(0, 0);
    normal = new Vector3(0, 1, 0);

    for (let i = 0; i < 6; i++) {
        mesh.Vertices[i] = new Vertex(positions[i], texcoord, normal);
    }

    mesh.Faces[0] = {A: 2, B: 1, C: 0};
    mesh.Faces[1] = {A: 5, B: 4, C: 3};

    this.meshes = meshes;
};

Model.prototype.InitCube = function () {
    let meshes = [];
    let mesh = new Mesh("cube", 36, 12);
    meshes.push(mesh);

    let positions = [];
    let texcoords = [];
    let normals = [];

    positions[0] = new Vector3(-1.0, 1.0, -1.0);
    positions[1] = new Vector3(1.0, 1.0, -1.0);
    positions[2] = new Vector3(-1.0, -1.0, -1.0);
    positions[3] = new Vector3(-1.0, -1.0, -1.0);
    positions[4] = new Vector3(1.0, 1.0, -1.0);
    positions[5] = new Vector3(1.0, -1.0, -1.0);
    positions[6] = new Vector3(1.0, 1.0, -1.0);
    positions[7] = new Vector3(1.0, 1.0, 1.0);
    positions[8] = new Vector3(1.0, -1.0, -1.0);
    positions[9] = new Vector3(1.0, -1.0, -1.0);
    positions[10] = new Vector3(1.0, 1.0, 1.0);
    positions[11] = new Vector3(1.0, -1.0, 1.0);
    positions[12] = new Vector3(1.0, 1.0, 1.0);
    positions[13] = new Vector3(-1.0, 1.0, 1.0);
    positions[14] = new Vector3(1.0, -1.0, 1.0);
    positions[15] = new Vector3(1.0, -1.0, 1.0);
    positions[16] = new Vector3(-1.0, 1.0, 1.0);
    positions[17] = new Vector3(-1.0, -1.0, 1.0);
    positions[18] = new Vector3(-1.0, 1.0, 1.0);
    positions[19] = new Vector3(-1.0, 1.0, -1.0);
    positions[20] = new Vector3(-1.0, -1.0, 1.0);
    positions[21] = new Vector3(-1.0, -1.0, 1.0);
    positions[22] = new Vector3(-1.0, 1.0, -1.0);
    positions[23] = new Vector3(-1.0, -1.0, -1.0);
    positions[24] = new Vector3(-1.0, 1.0, 1.0);
    positions[25] = new Vector3(1.0, 1.0, 1.0);
    positions[26] = new Vector3(-1.0, 1.0, -1.0);
    positions[27] = new Vector3(-1.0, 1.0, -1.0);
    positions[28] = new Vector3(1.0, 1.0, 1.0);
    positions[29] = new Vector3(1.0, 1.0, -1.0);
    positions[30] = new Vector3(-1.0, -1.0, -1.0);
    positions[31] = new Vector3(1.0, -1.0, -1.0);
    positions[32] = new Vector3(-1.0, -1.0, 1.0);
    positions[33] = new Vector3(-1.0, -1.0, 1.0);
    positions[34] = new Vector3(1.0, -1.0, -1.0);
    positions[35] = new Vector3(1.0, -1.0, 1.0);

    texcoords[0] = new Vector2(0.0, 0.0);
    texcoords[1] = new Vector2(1.0, 0.0);
    texcoords[2] = new Vector2(0.0, 1.0);
    texcoords[3] = new Vector2(0.0, 1.0);
    texcoords[4] = new Vector2(1.0, 0.0);
    texcoords[5] = new Vector2(1.0, 1.0);
    texcoords[6] = new Vector2(0.0, 0.0);
    texcoords[7] = new Vector2(1.0, 0.0);
    texcoords[8] = new Vector2(0.0, 1.0);
    texcoords[9] = new Vector2(0.0, 1.0);
    texcoords[10] = new Vector2(1.0, 0.0);
    texcoords[11] = new Vector2(1.0, 1.0);
    texcoords[12] = new Vector2(0.0, 0.0);
    texcoords[13] = new Vector2(1.0, 0.0);
    texcoords[14] = new Vector2(0.0, 1.0);
    texcoords[15] = new Vector2(0.0, 1.0);
    texcoords[16] = new Vector2(1.0, 0.0);
    texcoords[17] = new Vector2(1.0, 1.0);
    texcoords[18] = new Vector2(0.0, 0.0);
    texcoords[19] = new Vector2(1.0, 0.0);
    texcoords[20] = new Vector2(0.0, 1.0);
    texcoords[21] = new Vector2(0.0, 1.0);
    texcoords[22] = new Vector2(1.0, 0.0);
    texcoords[23] = new Vector2(1.0, 1.0);
    texcoords[24] = new Vector2(0.0, 0.0);
    texcoords[25] = new Vector2(1.0, 0.0);
    texcoords[26] = new Vector2(0.0, 1.0);
    texcoords[27] = new Vector2(0.0, 1.0);
    texcoords[28] = new Vector2(1.0, 0.0);
    texcoords[29] = new Vector2(1.0, 1.0);
    texcoords[30] = new Vector2(0.0, 0.0);
    texcoords[31] = new Vector2(1.0, 0.0);
    texcoords[32] = new Vector2(0.0, 1.0);
    texcoords[33] = new Vector2(0.0, 1.0);
    texcoords[34] = new Vector2(1.0, 0.0);
    texcoords[35] = new Vector2(1.0, 1.0);

    normals[0] = new Vector3(0.0, 0.0, -1.0);
    normals[1] = new Vector3(0.0, 0.0, -1.0);
    normals[2] = new Vector3(0.0, 0.0, -1.0);
    normals[3] = new Vector3(0.0, 0.0, -1.0);
    normals[4] = new Vector3(0.0, 0.0, -1.0);
    normals[5] = new Vector3(0.0, 0.0, -1.0);
    normals[6] = new Vector3(1.0, 0.0, 0.0);
    normals[7] = new Vector3(1.0, 0.0, 0.0);
    normals[8] = new Vector3(1.0, 0.0, 0.0);
    normals[9] = new Vector3(1.0, 0.0, 0.0);
    normals[10] = new Vector3(1.0, 0.0, 0.0);
    normals[11] = new Vector3(1.0, 0.0, 0.0);
    normals[12] = new Vector3(0.0, 0.0, 1.0);
    normals[13] = new Vector3(0.0, 0.0, 1.0);
    normals[14] = new Vector3(0.0, 0.0, 1.0);
    normals[15] = new Vector3(0.0, 0.0, 1.0);
    normals[16] = new Vector3(0.0, 0.0, 1.0);
    normals[17] = new Vector3(0.0, 0.0, 1.0);
    normals[18] = new Vector3(-1.0, 0.0, 0.0);
    normals[19] = new Vector3(-1.0, 0.0, 0.0);
    normals[20] = new Vector3(-1.0, 0.0, 0.0);
    normals[21] = new Vector3(-1.0, 0.0, 0.0);
    normals[22] = new Vector3(-1.0, 0.0, 0.0);
    normals[23] = new Vector3(-1.0, 0.0, 0.0);
    normals[24] = new Vector3(0.0, 1.0, 0.0);
    normals[25] = new Vector3(0.0, 1.0, 0.0);
    normals[26] = new Vector3(0.0, 1.0, 0.0);
    normals[27] = new Vector3(0.0, 1.0, 0.0);
    normals[28] = new Vector3(0.0, 1.0, 0.0);
    normals[29] = new Vector3(0.0, 1.0, 0.0);
    normals[30] = new Vector3(0.0, -1.0, 0.0);
    normals[31] = new Vector3(0.0, -1.0, 0.0);
    normals[32] = new Vector3(0.0, -1.0, 0.0);
    normals[33] = new Vector3(0.0, -1.0, 0.0);
    normals[34] = new Vector3(0.0, -1.0, 0.0);
    normals[35] = new Vector3(0.0, -1.0, 0.0);

    for (let i = 0; i < 36; ++i) {
        mesh.Vertices[i] = new Vertex(positions[i], texcoords[i], normals[i]);
    }

    for (let i = 0; i < 12; ++i) {
        mesh.Faces[i] = {A: i * 3, B: i * 3 + 1, C: i * 3 + 2}
    }

    this.meshes = meshes;
};

