function Color4(initialR, initialG, initialB, initialA) {
    this.r = initialR;
    this.g = initialG;
    this.b = initialB;
    this.a = initialA;
}
Color4.prototype.toString = function () {
    return "{R: " + this.r + " G:" + this.g + " B:" + this.b + " A:" + this.a + "}";
};