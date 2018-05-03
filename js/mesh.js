function Mesh(name, verticesCount, facesCount) {
    this.name = name;
    this.Vertices = new Array(verticesCount);
    this.Texcoord = new Array(verticesCount);
    this.Faces = new Array(facesCount);
    this.Position = Vector3.Zero();
}