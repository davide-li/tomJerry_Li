// 生成一个随机值函数，用于生成随机的坐标
function genValue() {
    // 生成一个介于 -55 和 55 之间的随机整数（包括55）
    return Math.floor(Math.random() * (55 - (-55) + 1)) + (-55);
}

// 初始化敌人位置的 x 和 z 坐标
var xz = [
    [genValue()],  // 随机生成 x 坐标
    [genValue()]   // 随机生成 z 坐标
];

// 初始化三个jerry的 x 和 z 坐标
var jerry1xz = [
    genValue(),  // 随机生成jerry1的 x 坐标
    genValue()   // 随机生成jerry1的 z 坐标
];

var jerry2xz = [
    genValue(),  // 随机生成jerry2的 x 坐标
    genValue()   // 随机生成jerry2的 z 坐标
];

var jerry3xz = [
    genValue(),  // 随机生成jerry3的 x 坐标
    genValue()   // 随机生成jerry3的 z 坐标
];

// 刷新所有jerry位置的函数
function refreshJerrys(){
    // 生成新的随机位置，重新设置jerry1的 x 和 z 坐标
    jerry1xz = [
        genValue(),  // 随机生成jerry1的新 x 坐标
        genValue()   // 随机生成jerry1的新 z 坐标
    ];

    // 生成新的随机位置，重新设置jerry2的 x 和 z 坐标
    jerry2xz = [
        genValue(),  // 随机生成jerry2的新 x 坐标
        genValue()   // 随机生成jerry2的新 z 坐标
    ];

    // 生成新的随机位置，重新设置jerry3的 x 和 z 坐标
    jerry3xz = [
        genValue(),  // 随机生成jerry3的新 x 坐标
        genValue()   // 随机生成jerry3的新 z 坐标
    ];
}
