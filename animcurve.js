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