#### Software Renderer

项目具体描述：1000行 JavaScript 实现的简易软件渲染器

时间：2018.5.1 - 2018.5.21（拖拖拉拉这么久）

部分截图：

1. 线框渲染

   ![image-20180521192811947](https://image.ibb.co/mugCao/r1.png)

2. 开启深度测试，背面剔除，平行光的渲染结果
    ![image-20180521192611977](https://image.ibb.co/g3isao/r2.png)

3. 开启深度测试，背面剔除，点光源的渲染结果

   ![image-20180521192953149](https://image.ibb.co/c6uXao/r3.png)

已实现：

+ 线框模式渲染
+ 纹理模式渲染
+ 二次渲染：render to texture
+ 背面剔除：cw + ccw
+ 基础光照：ambient + diffuse 
+ 深度测试

留坑：

+ Tessellation
+ Deferred Rendering
+ PBR

项目文件结构：

+ `asserts` ：资源部分
+ `js` ：JavaScript 代码
    + `math`
        + `color.js` : Color 类 ， RGBA 操作
        + `matrix.js` : Matrix 类 ，矩阵基本运算 ，三维中运算矩阵（投影，变换等。。。）
        + `vector.js` : Vector 类 ，向量基本运算 ，向量变换

    + `camera.js` ：摄像机类，封装摄像机数据
    + `device.js` ：核心类 `Device` ，三角形遍历，操作 `Shader` 渲染 ，设置渲染目标等
    + `light.js` ：光照数据封装
    + `model.js` ：模型数据封装，内置 `cube` , `plane` 模板数据生成，以及简单的模型文件读取
    + `raster.js` ：核心类 `Raster` ，实现顶点插值 `Interpolate` ，画线算法 `Bresenham` ，三角形扫描线算法 `ScanLine` 等
    + `shader.js` : 模拟渲染管道可编程部分，支持顶点着色器(Vertex Shader) ，像素着色器 (Pixel Shader) ，内置定向光照着色器 (Direction Light Shader)，点光源着色器(Point Light Shader)等。
    + `texture.js` ：核心类 `Texture` ，实现纹理映射，`Wrap` 和 `Clamp` 方式。
+ `main.js` ：启动文件
+ `index.html` : html 文件    



（ 留坑待填 ）。。。。。。。。。。。。。。。。。。。。。。


