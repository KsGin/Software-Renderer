function DirectionLight(x, y, z) {
    this.direction = new Vector3(x , y , z);
}

function PointLight(x , y , z) {
    this.position = new Vector3(x , y , z);
}

function Light() {
    this.directionLight = null;
    this.pointLight = null;
}