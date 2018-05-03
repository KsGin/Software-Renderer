function Matrix() {
    this.m = [];
}
Matrix.prototype.isIdentity = function () {
    if(this.m[0] != 1.0 || this.m[5] != 1.0 || this.m[10] != 1.0 || this.m[15] != 1.0) {
        return false;
    }
    if(this.m[12] != 0.0 || this.m[13] != 0.0 || this.m[14] != 0.0 || this.m[4] != 0.0 || this.m[6] != 0.0 || this.m[7] != 0.0 || this.m[8] != 0.0 || this.m[9] != 0.0 || this.m[11] != 0.0 || this.m[12] != 0.0 || this.m[13] != 0.0 || this.m[14] != 0.0) {
        return false;
    }
    return true;
};
Matrix.prototype.determinant = function () {
    let temp1 = (this.m[10] * this.m[15]) - (this.m[11] * this.m[14]);
    let temp2 = (this.m[9] * this.m[15]) - (this.m[11] * this.m[13]);
    let temp3 = (this.m[9] * this.m[14]) - (this.m[10] * this.m[13]);
    let temp4 = (this.m[8] * this.m[15]) - (this.m[11] * this.m[12]);
    let temp5 = (this.m[8] * this.m[14]) - (this.m[10] * this.m[12]);
    let temp6 = (this.m[8] * this.m[13]) - (this.m[9] * this.m[12]);
    return ((((this.m[0] * (((this.m[5] * temp1) - (this.m[6] * temp2)) + (this.m[7] * temp3))) - (this.m[1] * (((this.m[4] * temp1) - (this.m[6] * temp4)) + (this.m[7] * temp5)))) + (this.m[2] * (((this.m[4] * temp2) - (this.m[5] * temp4)) + (this.m[7] * temp6)))) - (this.m[3] * (((this.m[4] * temp3) - (this.m[5] * temp5)) + (this.m[6] * temp6))));
};
Matrix.prototype.toArray = function () {
    return this.m;
};
Matrix.prototype.invert = function () {
    let l1 = this.m[0];
    let l2 = this.m[1];
    let l3 = this.m[2];
    let l4 = this.m[3];
    let l5 = this.m[4];
    let l6 = this.m[5];
    let l7 = this.m[6];
    let l8 = this.m[7];
    let l9 = this.m[8];
    let l10 = this.m[9];
    let l11 = this.m[10];
    let l12 = this.m[11];
    let l13 = this.m[12];
    let l14 = this.m[13];
    let l15 = this.m[14];
    let l16 = this.m[15];
    let l17 = (l11 * l16) - (l12 * l15);
    let l18 = (l10 * l16) - (l12 * l14);
    let l19 = (l10 * l15) - (l11 * l14);
    let l20 = (l9 * l16) - (l12 * l13);
    let l21 = (l9 * l15) - (l11 * l13);
    let l22 = (l9 * l14) - (l10 * l13);
    let l23 = ((l6 * l17) - (l7 * l18)) + (l8 * l19);
    let l24 = -(((l5 * l17) - (l7 * l20)) + (l8 * l21));
    let l25 = ((l5 * l18) - (l6 * l20)) + (l8 * l22);
    let l26 = -(((l5 * l19) - (l6 * l21)) + (l7 * l22));
    let l27 = 1.0 / ((((l1 * l23) + (l2 * l24)) + (l3 * l25)) + (l4 * l26));
    let l28 = (l7 * l16) - (l8 * l15);
    let l29 = (l6 * l16) - (l8 * l14);
    let l30 = (l6 * l15) - (l7 * l14);
    let l31 = (l5 * l16) - (l8 * l13);
    let l32 = (l5 * l15) - (l7 * l13);
    let l33 = (l5 * l14) - (l6 * l13);
    let l34 = (l7 * l12) - (l8 * l11);
    let l35 = (l6 * l12) - (l8 * l10);
    let l36 = (l6 * l11) - (l7 * l10);
    let l37 = (l5 * l12) - (l8 * l9);
    let l38 = (l5 * l11) - (l7 * l9);
    let l39 = (l5 * l10) - (l6 * l9);
    this.m[0] = l23 * l27;
    this.m[4] = l24 * l27;
    this.m[8] = l25 * l27;
    this.m[12] = l26 * l27;
    this.m[1] = -(((l2 * l17) - (l3 * l18)) + (l4 * l19)) * l27;
    this.m[5] = (((l1 * l17) - (l3 * l20)) + (l4 * l21)) * l27;
    this.m[9] = -(((l1 * l18) - (l2 * l20)) + (l4 * l22)) * l27;
    this.m[13] = (((l1 * l19) - (l2 * l21)) + (l3 * l22)) * l27;
    this.m[2] = (((l2 * l28) - (l3 * l29)) + (l4 * l30)) * l27;
    this.m[6] = -(((l1 * l28) - (l3 * l31)) + (l4 * l32)) * l27;
    this.m[10] = (((l1 * l29) - (l2 * l31)) + (l4 * l33)) * l27;
    this.m[14] = -(((l1 * l30) - (l2 * l32)) + (l3 * l33)) * l27;
    this.m[3] = -(((l2 * l34) - (l3 * l35)) + (l4 * l36)) * l27;
    this.m[7] = (((l1 * l34) - (l3 * l37)) + (l4 * l38)) * l27;
    this.m[11] = -(((l1 * l35) - (l2 * l37)) + (l4 * l39)) * l27;
    this.m[15] = (((l1 * l36) - (l2 * l38)) + (l3 * l39)) * l27;
};
Matrix.prototype.multiply = function (other) {
    let result = new Matrix();
    result.m[0] = this.m[0] * other.m[0] + this.m[1] * other.m[4] + this.m[2] * other.m[8] + this.m[3] * other.m[12];
    result.m[1] = this.m[0] * other.m[1] + this.m[1] * other.m[5] + this.m[2] * other.m[9] + this.m[3] * other.m[13];
    result.m[2] = this.m[0] * other.m[2] + this.m[1] * other.m[6] + this.m[2] * other.m[10] + this.m[3] * other.m[14];
    result.m[3] = this.m[0] * other.m[3] + this.m[1] * other.m[7] + this.m[2] * other.m[11] + this.m[3] * other.m[15];
    result.m[4] = this.m[4] * other.m[0] + this.m[5] * other.m[4] + this.m[6] * other.m[8] + this.m[7] * other.m[12];
    result.m[5] = this.m[4] * other.m[1] + this.m[5] * other.m[5] + this.m[6] * other.m[9] + this.m[7] * other.m[13];
    result.m[6] = this.m[4] * other.m[2] + this.m[5] * other.m[6] + this.m[6] * other.m[10] + this.m[7] * other.m[14];
    result.m[7] = this.m[4] * other.m[3] + this.m[5] * other.m[7] + this.m[6] * other.m[11] + this.m[7] * other.m[15];
    result.m[8] = this.m[8] * other.m[0] + this.m[9] * other.m[4] + this.m[10] * other.m[8] + this.m[11] * other.m[12];
    result.m[9] = this.m[8] * other.m[1] + this.m[9] * other.m[5] + this.m[10] * other.m[9] + this.m[11] * other.m[13];
    result.m[10] = this.m[8] * other.m[2] + this.m[9] * other.m[6] + this.m[10] * other.m[10] + this.m[11] * other.m[14];
    result.m[11] = this.m[8] * other.m[3] + this.m[9] * other.m[7] + this.m[10] * other.m[11] + this.m[11] * other.m[15];
    result.m[12] = this.m[12] * other.m[0] + this.m[13] * other.m[4] + this.m[14] * other.m[8] + this.m[15] * other.m[12];
    result.m[13] = this.m[12] * other.m[1] + this.m[13] * other.m[5] + this.m[14] * other.m[9] + this.m[15] * other.m[13];
    result.m[14] = this.m[12] * other.m[2] + this.m[13] * other.m[6] + this.m[14] * other.m[10] + this.m[15] * other.m[14];
    result.m[15] = this.m[12] * other.m[3] + this.m[13] * other.m[7] + this.m[14] * other.m[11] + this.m[15] * other.m[15];
    return result;
};
Matrix.prototype.equals = function (value) {
    return (this.m[0] === value.m[0] && this.m[1] === value.m[1] && this.m[2] === value.m[2] && this.m[3] === value.m[3] && this.m[4] === value.m[4] && this.m[5] === value.m[5] && this.m[6] === value.m[6] && this.m[7] === value.m[7] && this.m[8] === value.m[8] && this.m[9] === value.m[9] && this.m[10] === value.m[10] && this.m[11] === value.m[11] && this.m[12] === value.m[12] && this.m[13] === value.m[13] && this.m[14] === value.m[14] && this.m[15] === value.m[15]);
};
Matrix.FromValues = function FromValues(initialM11, initialM12, initialM13, initialM14, initialM21, initialM22, initialM23, initialM24, initialM31, initialM32, initialM33, initialM34, initialM41, initialM42, initialM43, initialM44) {
    let result = new Matrix();
    result.m[0] = initialM11;
    result.m[1] = initialM12;
    result.m[2] = initialM13;
    result.m[3] = initialM14;
    result.m[4] = initialM21;
    result.m[5] = initialM22;
    result.m[6] = initialM23;
    result.m[7] = initialM24;
    result.m[8] = initialM31;
    result.m[9] = initialM32;
    result.m[10] = initialM33;
    result.m[11] = initialM34;
    result.m[12] = initialM41;
    result.m[13] = initialM42;
    result.m[14] = initialM43;
    result.m[15] = initialM44;
    return result;
};
Matrix.Identity = function Identity() {
    return Matrix.FromValues(1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0);
};
Matrix.Zero = function Zero() {
    return Matrix.FromValues(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
};
Matrix.Copy = function Copy(source) {
    return Matrix.FromValues(source.m[0], source.m[1], source.m[2], source.m[3], source.m[4], source.m[5], source.m[6], source.m[7], source.m[8], source.m[9], source.m[10], source.m[11], source.m[12], source.m[13], source.m[14], source.m[15]);
};
Matrix.RotationX = function RotationX(angle) {
    let result = Matrix.Zero();
    let s = Math.sin(angle);
    let c = Math.cos(angle);
    result.m[0] = 1.0;
    result.m[15] = 1.0;
    result.m[5] = c;
    result.m[10] = c;
    result.m[9] = -s;
    result.m[6] = s;
    return result;
};
Matrix.RotationY = function RotationY(angle) {
    let result = Matrix.Zero();
    let s = Math.sin(angle);
    let c = Math.cos(angle);
    result.m[5] = 1.0;
    result.m[15] = 1.0;
    result.m[0] = c;
    result.m[2] = -s;
    result.m[8] = s;
    result.m[10] = c;
    return result;
};
Matrix.RotationZ = function RotationZ(angle) {
    let result = Matrix.Zero();
    let s = Math.sin(angle);
    let c = Math.cos(angle);
    result.m[10] = 1.0;
    result.m[15] = 1.0;
    result.m[0] = c;
    result.m[1] = s;
    result.m[4] = -s;
    result.m[5] = c;
    return result;
};
Matrix.RotationAxis = function RotationAxis(axis, angle) {
    let s = Math.sin(-angle);
    let c = Math.cos(-angle);
    let c1 = 1 - c;
    axis.normalize();
    let result = Matrix.Zero();
    result.m[0] = (axis.x * axis.x) * c1 + c;
    result.m[1] = (axis.x * axis.y) * c1 - (axis.z * s);
    result.m[2] = (axis.x * axis.z) * c1 + (axis.y * s);
    result.m[3] = 0.0;
    result.m[4] = (axis.y * axis.x) * c1 + (axis.z * s);
    result.m[5] = (axis.y * axis.y) * c1 + c;
    result.m[6] = (axis.y * axis.z) * c1 - (axis.x * s);
    result.m[7] = 0.0;
    result.m[8] = (axis.z * axis.x) * c1 - (axis.y * s);
    result.m[9] = (axis.z * axis.y) * c1 + (axis.x * s);
    result.m[10] = (axis.z * axis.z) * c1 + c;
    result.m[11] = 0.0;
    result.m[15] = 1.0;
    return result;
};
Matrix.RotationYawPitchRoll = function RotationYawPitchRoll(yaw, pitch, roll) {
    return Matrix.RotationZ(roll).multiply(Matrix.RotationX(pitch)).multiply(Matrix.RotationY(yaw));
};
Matrix.Scaling = function Scaling(x, y, z) {
    let result = Matrix.Zero();
    result.m[0] = x;
    result.m[5] = y;
    result.m[10] = z;
    result.m[15] = 1.0;
    return result;
};
Matrix.Translation = function Translation(x, y, z) {
    let result = Matrix.Identity();
    result.m[12] = x;
    result.m[13] = y;
    result.m[14] = z;
    return result;
};
Matrix.LookAtLH = function LookAtLH(eye, target, up) {
    let zAxis = target.subtract(eye);
    zAxis.normalize();
    let xAxis = Vector3.Cross(up, zAxis);
    xAxis.normalize();
    let yAxis = Vector3.Cross(zAxis, xAxis);
    yAxis.normalize();
    let ex = -Vector3.Dot(xAxis, eye);
    let ey = -Vector3.Dot(yAxis, eye);
    let ez = -Vector3.Dot(zAxis, eye);
    return Matrix.FromValues(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, ex, ey, ez, 1);
};
Matrix.PerspectiveLH = function PerspectiveLH(width, height, znear, zfar) {
    let matrix = Matrix.Zero();
    matrix.m[0] = (2.0 * znear) / width;
    matrix.m[1] = matrix.m[2] = matrix.m[3] = 0.0;
    matrix.m[5] = (2.0 * znear) / height;
    matrix.m[4] = matrix.m[6] = matrix.m[7] = 0.0;
    matrix.m[10] = -zfar / (znear - zfar);
    matrix.m[8] = matrix.m[9] = 0.0;
    matrix.m[11] = 1.0;
    matrix.m[12] = matrix.m[13] = matrix.m[15] = 0.0;
    matrix.m[14] = (znear * zfar) / (znear - zfar);
    return matrix;
};
Matrix.PerspectiveFovLH = function PerspectiveFovLH(fov, aspect, znear, zfar) {
    let matrix = Matrix.Zero();
    let tan = 1.0 / (Math.tan(fov * 0.5));
    matrix.m[0] = tan / aspect;
    matrix.m[1] = matrix.m[2] = matrix.m[3] = 0.0;
    matrix.m[5] = tan;
    matrix.m[4] = matrix.m[6] = matrix.m[7] = 0.0;
    matrix.m[8] = matrix.m[9] = 0.0;
    matrix.m[10] = -zfar / (znear - zfar);
    matrix.m[11] = 1.0;
    matrix.m[12] = matrix.m[13] = matrix.m[15] = 0.0;
    matrix.m[14] = (znear * zfar) / (znear - zfar);
    return matrix;
};
Matrix.Transpose = function Transpose(matrix) {
    let result = new Matrix();
    result.m[0] = matrix.m[0];
    result.m[1] = matrix.m[4];
    result.m[2] = matrix.m[8];
    result.m[3] = matrix.m[12];
    result.m[4] = matrix.m[1];
    result.m[5] = matrix.m[5];
    result.m[6] = matrix.m[9];
    result.m[7] = matrix.m[13];
    result.m[8] = matrix.m[2];
    result.m[9] = matrix.m[6];
    result.m[10] = matrix.m[10];
    result.m[11] = matrix.m[14];
    result.m[12] = matrix.m[3];
    result.m[13] = matrix.m[7];
    result.m[14] = matrix.m[11];
    result.m[15] = matrix.m[15];
    return result;
};