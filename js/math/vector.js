//// class vector2
function Vector2(initialX, initialY) {
    this.x = initialX;
    this.y = initialY;
}

Vector2.prototype.toString = function () {
    return "{X: " + this.x + " Y:" + this.y + "}";
};
Vector2.prototype.add = function (otherVector) {
    return new Vector2(this.x + otherVector.x, this.y + otherVector.y);
};
Vector2.prototype.subtract = function (otherVector) {
    return new Vector2(this.x - otherVector.x, this.y - otherVector.y);
};
Vector2.prototype.negate = function () {
    return new Vector2(-this.x, -this.y);
};
Vector2.prototype.scale = function (scale) {
    return new Vector2(this.x * scale, this.y * scale);
};
Vector2.prototype.equals = function (otherVector) {
    return this.x === otherVector.x && this.y === otherVector.y;
};
Vector2.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};
Vector2.prototype.lengthSquared = function () {
    return (this.x * this.x + this.y * this.y);
};
Vector2.prototype.normalize = function () {
    let len = this.length();
    if (len === 0) {
        return;
    }
    let num = 1.0 / len;
    this.x *= num;
    this.y *= num;
};
Vector2.Zero = function Zero() {
    return new Vector2(0, 0);
};
Vector2.Copy = function Copy(source) {
    return new Vector2(source.x, source.y);
};
Vector2.Normalize = function Normalize(vector) {
    let newVector = Vector2.Copy(vector);
    newVector.normalize();
    return newVector;
};
Vector2.Minimize = function Minimize(left, right) {
    let x = (left.x < right.x) ? left.x : right.x;
    let y = (left.y < right.y) ? left.y : right.y;
    return new Vector2(x, y);
};
Vector2.Maximize = function Maximize(left, right) {
    let x = (left.x > right.x) ? left.x : right.x;
    let y = (left.y > right.y) ? left.y : right.y;
    return new Vector2(x, y);
};
Vector2.Transform = function Transform(vector, transformation) {
    let x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]);
    let y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]);
    return new Vector2(x, y);
};
Vector2.Distance = function Distance(value1, value2) {
    return Math.sqrt(Vector2.DistanceSquared(value1, value2));
};
Vector2.DistanceSquared = function DistanceSquared(value1, value2) {
    let x = value1.x - value2.x;
    let y = value1.y - value2.y;
    return (x * x) + (y * y);
};

//// class vector3
function Vector3(initialX, initialY, initialZ) {
    this.x = initialX;
    this.y = initialY;
    this.z = initialZ;
}

Vector3.prototype.toString = function () {
    return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + "}";
};
Vector3.prototype.add = function (otherVector) {
    return new Vector3(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z);
};
Vector3.prototype.subtract = function (otherVector) {
    return new Vector3(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z);
};
Vector3.prototype.negate = function () {
    return new Vector3(-this.x, -this.y, -this.z);
};
Vector3.prototype.scale = function (scale) {
    return new Vector3(this.x * scale, this.y * scale, this.z * scale);
};
Vector3.prototype.equals = function (otherVector) {
    return this.x === otherVector.x && this.y === otherVector.y && this.z === otherVector.z;
};
Vector3.prototype.multiply = function (otherVector) {
    return new Vector3(this.x * otherVector.x, this.y * otherVector.y, this.z * otherVector.z);
};
Vector3.prototype.divide = function (otherVector) {
    return new Vector3(this.x / otherVector.x, this.y / otherVector.y, this.z / otherVector.z);
};
Vector3.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};
Vector3.prototype.lengthSquared = function () {
    return (this.x * this.x + this.y * this.y + this.z * this.z);
};
Vector3.prototype.normalize = function () {
    let len = this.length();
    if (len === 0) {
        return;
    }
    let num = 1.0 / len;
    this.x *= num;
    this.y *= num;
    this.z *= num;
};
Vector3.FromArray = function FromArray(array, offset) {
    if (!offset) {
        offset = 0;
    }
    return new Vector3(array[offset], array[offset + 1], array[offset + 2]);
};
Vector3.Zero = function Zero() {
    return new Vector3(0, 0, 0);
};
Vector3.Up = function Up() {
    return new Vector3(0, 1.0, 0);
};
Vector3.Copy = function Copy(source) {
    return new Vector3(source.x, source.y, source.z);
};
Vector3.TransformCoordinates = function TransformCoordinates(vector, transformation) {
    let x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
    let y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
    let z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
    let w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];
    return new Vector3(x / w, y / w, z / w);
};
Vector3.TransformNormal = function TransformNormal(vector, transformation) {
    let x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]);
    let y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]);
    let z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]);
    return new Vector3(x, y, z);
};
Vector3.Dot = function Dot(left, right) {
    return (left.x * right.x + left.y * right.y + left.z * right.z);
};
Vector3.Cross = function Cross(left, right) {
    let x = left.y * right.z - left.z * right.y;
    let y = left.z * right.x - left.x * right.z;
    let z = left.x * right.y - left.y * right.x;
    return new Vector3(x, y, z);
};
Vector3.Normalize = function Normalize(vector) {
    let newVector = Vector3.Copy(vector);
    newVector.normalize();
    return newVector;
};
Vector3.Distance = function Distance(value1, value2) {
    return Math.sqrt(Vector3.DistanceSquared(value1, value2));
};
Vector3.DistanceSquared = function DistanceSquared(value1, value2) {
    let x = value1.x - value2.x;
    let y = value1.y - value2.y;
    let z = value1.z - value2.z;
    return (x * x) + (y * y) + (z * z);
};