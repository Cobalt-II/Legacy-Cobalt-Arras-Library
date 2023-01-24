let leader = false;

for (let count = 1; count <= 4; count++) {
    localStorage.setItem('array' + count, [])
};

for (let count = 1; count <= 4; count++) {
    localStorage.setItem('ids' + count, [])
};

let take = [];
const table = ['#7adbbc', '#b9e87e', '#e7896d', '#fdf380', '#b58efd', '#ef99c3', '#e8ebf7', '#aa9f9e', '#ffffff', '#484848', '#3ca4cb', '#8abc3f', '#e03e41', '#efc74b', '#8d6adf', '#cc669c', '#a7a7af', '#726f6f', '#dbdbdb', '#000000'];
let broad = new BroadcastParser();
let miniWidth = 0;
let miniHeight = 0;
let xs = 0;
let ys = 0;
let id = [];
const world = new UpdateParser();

document.addEventListener('keydown', function(event) {
    if (event.code === 'KeyX') {
        leader = !leader;
    };
});

Array.prototype.shift = new Proxy(Array.prototype.shift, {
    apply(shift, array, args) {
        if (array[0] === 'u') {
            world.parse(array);
            for (let count in world.entities) {
                if (id.indexOf(world.entities[count].id) === -1 && world.entities[count].score > 1000000) {
                    id.push(world.entities[count].id)
                }
            };
            localStorage.setItem('ids' + controller, id);
        };
        if (array[0] === 'b') {
            broad.parse(array);
            if (!leader) {

                let set = [];

                for (let count in broad.teamMinimap) {
                    switch (broad.teamMinimap[count].color) {
                        case 10:
                            controller = 1;
                            break;
                        case 11:
                            controller = 2;
                            break;
                        case 12:
                            controller = 3;
                            break;
                        case 15:
                            controller = 4;
                            break;
                    }
                    
                    if (localStorage.getItem('ids' + controller).split(',').indexOf(`${broad.teamMinimap[count].id}`) !== -1) {
                        broad.teamMinimap[count].color = 3;
                    };
                    
                    set.push(broad.teamMinimap[count].id, broad.teamMinimap[count].x, broad.teamMinimap[count].y, broad.teamMinimap[count].color);
                };
                set.splice(set.length - 4, set.length);
                localStorage.setItem('array' + controller, set);

            } else {

                localStorage.setItem('array' + controller, []);
                take = [
                    [],
                    [],
                    [],
                    []
                ];

                for (let count = 1; count <= 4; count++) {
                    let h = localStorage.getItem('array' + count).split(',');
                    for (let count = 0; count < h.length; count += 4) {
                        take[controller - 1].push([parseInt(h[count + 1]), parseInt(h[count + 2]), parseInt(h[count + 3])]);
                    }
                }
            }
        };
        return shift.apply(array, args);
    }
});

let colors = ["#3ca4cb", "#8abc3f", "#e03e41", "#cc669c", "#8d6adf", "#dbdbdb"];
let dra = [];

const rect = CanvasRenderingContext2D.prototype.fillRect
CanvasRenderingContext2D.prototype.fillRect = function(...args) {
    for (let count in colors) {
        // 51 is the only unautomated part of this script, however it's simply the value of one of the grid tile sizes in sandbox mode. This is similar for most pcs (so it still should be fine for most), however for smaller devices you can edit it still. Not a GUI guru so I admittedly don't really care about automating this one small thing.
        if (this.fillStyle === colors[count] && args[3] < 51) {
            dra.push([...args, this.fillStyle]);
        }
    }
    rect.call(this, ...args);
};

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

requestAnimationFrame(function draw() {
    for (let co in take) {
        for (let count in take[co]) {
            ctx.fillStyle = table[take[co][count][2]];
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(take[co][count][0] / 255 * miniWidth + xs * window.innerWidth, take[co][count][1] / 255 * miniHeight + ys * window.innerHeight, 2, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }
    };

    dra = dra.sort((a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]));
    xs = dra[0][0] / window.innerWidth;
    ys = dra[0][1] / window.innerHeight;
    miniWidth = dra[dra.length - 1][0] + dra[dra.length - 1][3] - dra[0][0];
    miniHeight = dra[dra.length - 1][1] + dra[dra.length - 1][3] - dra[0][1];

    dra.splice(0, dra.length);
    requestAnimationFrame(draw);
});
