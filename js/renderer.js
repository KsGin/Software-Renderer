let SoftwareRenderer;
(function (SoftwareRenderer) {
    let Camera = (function () {
        function Camera() {
            this.Position = BABYLON.Vector3.Zero();
            this.Target = BABYLON.Vector3.Zero();
        }
        return Camera;
    })();
    SoftwareRenderer.Camera = Camera;
    let Mesh = (function () {
        function Mesh(name, verticesCount, facesCount) {
            this.name = name;
            this.Vertices = new Array(verticesCount);
            this.Faces = new Array(facesCount);
            this.Rotation = BABYLON.Vector3.Zero();
            this.Position = BABYLON.Vector3.Zero();
        }
        return Mesh;
    })();
    SoftwareRenderer.Mesh = Mesh;
    let Device = (function () {
        function Device(canvas) {
            this.workingCanvas = canvas;
            this.workingWidth = canvas.width;
            this.workingHeight = canvas.height;
            this.workingContext = this.workingCanvas.getContext("2d");
        }
        Device.prototype.clear = function () {
            this.workingContext.clearRect(0, 0, this.workingWidth, this.workingHeight);
            this.backbuffer = this.workingContext.getImageData(0, 0, this.workingWidth, this.workingHeight);
        };
        Device.prototype.present = function () {
            this.workingContext.putImageData(this.backbuffer, 0, 0);
        };
        Device.prototype.putPixel = function (x, y, color) {
            this.backbufferdata = this.backbuffer.data;
            let index = ((x >> 0) + (y >> 0) * this.workingWidth) * 4;
            this.backbufferdata[index] = color.r * 255;
            this.backbufferdata[index + 1] = color.g * 255;
            this.backbufferdata[index + 2] = color.b * 255;
            this.backbufferdata[index + 3] = color.a * 255;
        };
        Device.prototype.project = function (coord, transMat) {
            let point = BABYLON.Vector3.TransformCoordinates(coord, transMat);
            let x = -point.x * this.workingWidth + this.workingWidth / 2.0 >> 0;
            let y = -point.y * this.workingHeight + this.workingHeight / 2.0 >> 0;
            return (new BABYLON.Vector2(x, y));
        };
        Device.prototype.drawPoint = function (point) {
            if (point.x >= 0 && point.y >= 0 && point.x < this.workingWidth && point.y < this.workingHeight) {
                this.putPixel(point.x, point.y, new BABYLON.Color4(1, 1, 1, 1));
            }
        };
        Device.prototype.render = function (camera, meshes) {
            let viewMatrix = BABYLON.Matrix.LookAtLH(camera.Position, camera.Target, BABYLON.Vector3.Up());
            let projectionMatrix = BABYLON.Matrix.PerspectiveFovLH(0.78, this.workingWidth / this.workingHeight, 0.01, 10.0);
            meshes.forEach(mesh => {
                let worldMatrix = BABYLON.Matrix.RotationYawPitchRoll(mesh.Rotation.y, mesh.Rotation.x, mesh.Rotation.z).multiply(BABYLON.Matrix.Translation(mesh.Position.x, mesh.Position.y, mesh.Position.z));
                let transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);
                mesh.Faces.forEach(face => {
                    let p1 = this.project(mesh.Vertices[face.A], transformMatrix);
                    let p2 = this.project(mesh.Vertices[face.B], transformMatrix);
                    let p3 = this.project(mesh.Vertices[face.C], transformMatrix);

                    this.drawLine(p1, p2);
                    this.drawLine(p2, p3);
                    this.drawLine(p3, p1);
                });
            });
        };
        Device.prototype.drawLine = function (point0, point1) {
            let x0 = point0.x >> 0;
            let y0 = point0.y >> 0;
            let x1 = point1.x >> 0;
            let y1 = point1.y >> 0;
            let dx = Math.abs(x1 - x0);
            let dy = Math.abs(y1 - y0);
            let sx = (x0 < x1) ? 1 : -1;
            let sy = (y0 < y1) ? 1 : -1;
            let err = dx - dy;
            while (true) {
                this.drawPoint(new BABYLON.Vector2(x0, y0));
                if ((x0 == x1) && (y0 == y1)) break;
                let e2 = 2 * err;
                if (e2 > -dy) { err -= dy; x0 += sx; }
                if (e2 < dx) { err += dx; y0 += sy; }
            }
        };
        return Device;
    })();
    SoftwareRenderer.Device = Device;
})(SoftwareRenderer || (SoftwareRenderer = {}));
