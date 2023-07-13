function animcurve_channel_reverse(animcurve_channel) {
    animcurve_channel.points.reverse();

    animcurve_channel.points.forEach(point => {
        point.x = 1 - point.x;

        var t = point.th0;
        point.th0 = -point.th1;
        point.th1 = -t;

        var t = point.tv0;
        point.tv0 = point.tv1;
        point.tv1 = t;
    });
}

function animcurve_channel_render(context, curve, x, y, width, height, onCenter) {
    context.strokeStyle = rgbaToCss(gmColorToRgba(curve.colour));
    context.lineWidth = 2;

    var points = curve.points;
    var min_y = Infinity;
    var max_y = -Infinity;

    for (var i = 0; i < points.length - 1; i++) {
        var point1 = points[i];
        var point2 = points[i + 1];
        var extremum;

        for (var j = 0; j < 10; j++) {
            extremum = getBezierPointT(point1, point2, j / 10);
            min_y = Math.min(min_y, extremum.y);
            max_y = Math.max(max_y, extremum.y);
        }
    }

    var scale_x = width;
    var scale_y, center, offset;

    if (onCenter) {
        scale_y = height / (Math.max(max_y, 1) - Math.min(min_y, -1));
        center = min_y + (max_y - min_y) / 2;
        offset = height / 2;
    } else {
        scale_y = height / (max_y - min_y);
        center = max_y;
        offset = 0;
    }

    for (var i = 0; i < points.length; i++) {
        var point1 = points[i];

        var x1 = point1.x * scale_x;
        var y1 = offset + (center - point1.y) * scale_y;

        context.beginPath();
        context.arc(x + x1, y + y1, 1.5, 0, 2 * Math.PI);
        context.stroke();
        
        if (i < points.length - 1) {
            var point2 = points[i + 1];
            var h1 = point1.th1 * scale_x;
            var v1 = -point1.tv1 * scale_y;
            var x2 = point2.x * scale_x;
            var y2 = offset + (center - point2.y) * scale_y;
            var h2 = point2.th0 * scale_x;
            var v2 = -point2.tv0 * scale_y;

            context.beginPath();
            context.moveTo(x + x1, y + y1);
            context.bezierCurveTo(x + x1 + h1, y + y1 + v1, x + x2 + h2, y + y2 + v2, x + x2, y + y2);
            //ctx.bezierCurveTo(x1, y1, x2, y2, x2, y2);
            context.stroke();
        }
    }
}

function getBezierPointT(point1, point2, T) {
    // De Casteljau's algorithm which calculates points along a cubic Bezier curve
    
    var x = bezier(point1.x, point1.x + point1.th1, point2.x + point2.th0, point2.x, T);
    var y = bezier(point1.y, point1.y + point1.tv1, point2.y + point2.tv0, point2.y, T);
    return({ x:x, y:y });
}

function bezier(a, b, c, d, T) {
    var t2 = T * T;
    var t3 = t2 * T;
    return a + (-a * 3 + T * (3 * a - a * T)) * T
    + (3 * b + T * (-6 * b + b * 3 * T)) * T
    + (c * 3 - c * 3 * T) * t2
    + d * t3;
}