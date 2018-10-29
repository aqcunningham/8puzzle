var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        log = document.getElementById('log'),
        log2 = document.getElementById('log2'),
        sol = document.getElementById('sol'),
        lastTime;

    canvas.width = 302;
    canvas.height = 302;
    ctx.font = "30px Arial";
    doc.body.appendChild(canvas);

    global.ctx = ctx;

    function render() {
        dist = [[0,3,6], [1,4,7], [2,5,8]];
        ctx.strokeRect(0, 0, 302, 302);
        ctx.fillRect(0, 0, 302, 302);
        for (i = 0; i < 3; i += 1) {
            for (j = 0; j < 3; j += 1) {
                ctx.clearRect(2 + i * 100, 2 + j * 100, 98, 98);
                if (i*3+j != 0)
                    ctx.fillText(dist[i][j], 42 + i * 100, 62 + j * 100);
                else {
                    ctx.strokeRect(6 + i * 100, 6 + j * 100, 90, 90);
                    ctx.fillText(' ', 42 + i * 100, 62 + j * 100);
                }
            }
        }
    };

    render();
})(this);