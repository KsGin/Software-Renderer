function Color4(initialR, initialG, initialB, initialA) {
    this.r = initialR;
    this.g = initialG;
    this.b = initialB;
    this.a = initialA;
}

Color4.prototype.multiply = function (n) {
    this.r *= n;
    this.g *= n;
    this.b *= n;

    this.r = Math.max(0, Math.min(this.r, 1));
    this.g = Math.max(0, Math.min(this.g, 1));
    this.b = Math.max(0, Math.min(this.b, 1));

    return this;
};

Color4.prototype.toString = function () {
    return "{R: " + this.r + " G:" + this.g + " B:" + this.b + " A:" + this.a + "}";
};