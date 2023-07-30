let controller = 1;

/* Credit to the creators of APM for the broadcast parser and globalized protocol */
function rotator(packet) {
    return {
        i: 0,
        arr: packet,
        get(index) {
            return packet[index];
        },
        set(index, value) {
            return (packet[index] = value);
        },
        nex() {
            if (this.i === this.arr.length) {
                console.error(new Error('End reached'), this.arr)
                return -1;
            }
            return packet[this.i++];
        },
    };
};
Array.prototype.remove = function(index) {
    if (index === this.length - 1) return this.pop();
    this[index] = this.pop();
}
class BroadcastParser {
    constructor() {
        this.leaderboard = [];
        this.teamMinimap = [];
        this.globalMinimap = [];
    }

    parse(packet) {
        const rot = rotator(packet);

        if (rot.nex() !== 'b') throw new TypeError('Invalid packet header; expected packet `b`');

        this._array(rot, () => {
            const del = rot.nex();

            this.globalMinimap.remove(this.globalMinimap.findIndex(({
                id
            }) => id === del));
        });

        this._array(rot, () => {
            const dot = {
                id: rot.nex(),
                type: rot.nex(),
                x: rot.nex(),
                y: rot.nex(),
                color: rot.nex(),
                size: rot.nex()
            };

            let index = this.globalMinimap.findIndex(({
                id
            }) => id === dot.id);
            if (index === -1) index = this.globalMinimap.length;

            this.globalMinimap[index] = dot;
        });

        this._array(rot, () => {
            const del = rot.nex();

            this.teamMinimap.remove(this.teamMinimap.findIndex(({
                id
            }) => id === del));
        });

        this._array(rot, () => {
            const dot = {
                id: rot.nex(),
                x: rot.nex(),
                y: rot.nex(),
                color: rot.nex()
            };

            let index = this.teamMinimap.findIndex(({
                id
            }) => id === dot.id);
            if (index === -1) index = this.teamMinimap.length;

            this.teamMinimap[index] = dot;
        });

        this._array(rot, () => {
            const del = rot.nex();

            this.leaderboard.remove(this.leaderboard.findIndex(({
                id
            }) => id === del));
        });

        this._array(rot, () => {
            const champ = {
                id: rot.nex(),
                score: rot.nex(),
                index: rot.nex(),
                name: rot.nex(),
                color: rot.nex(),
                barColor: rot.nex()
            };

            let index = this.leaderboard.findIndex(({
                id
            }) => id === champ.id);
            if (index === -1) index = this.leaderboard.length;

            this.leaderboard[index] = champ;
        });

        this.leaderboard.sort((c1, c2) => c2.score - c1.score);

        return this;
    }

    _array(rot, read, length = rot.nex()) {
        const out = Array(Math.max(0, length));

        for (let i = 0; i < length; ++i) out[i] = read.call(this, i, rot);

        return out;
    }
};

class UpdateParser {
    constructor(doEntities = true) {
        this.camera = {
            x: null,
            y: null,
            vx: null,
            vy: null,
            fov: null
        };
        this.now = 0;
        this.tick = 0;
        this.player = {
            fps: 1,
            body: {
                type: null,
                color: null,
                id: null,
            },
            score: null,
            points: null,
            upgrades: [],
            stats: [],
            skills: null,
            accel: null,
            top: null,
            party: null
        }
        this.entities = doEntities ? [] : false;
    }

    parse(packet) {
        const rot = rotator(packet);

        if (rot.nex() !== 'u') throw new TypeError('Invalid packet header; expected packet `u`');
        this.tick += 1;
        this.now = rot.nex();

        const version = this.now === 0 ? 2 : 1;

        this.camera.x = rot.nex();
        this.camera.y = rot.nex();
        this.camera.fov = rot.nex();
        this.camera.vx = rot.nex();
        this.camera.vy = rot.nex();

        const flags = rot.nex();
        if (flags & 0x0001) this.player.fps = rot.nex();
        if (flags & 0x0002) {
            this.player.body.type = rot.nex();
            this.player.body.color = rot.nex();
            this.player.body.id = rot.nex();
        }
        if (flags & 0x0004) this.player.score = rot.nex();
        if (flags & 0x0008) this.player.points = rot.nex();
        if (flags & 0x0010) this.player.upgrades = Array(Math.max(0, rot.nex())).fill(-1).map(() => rot.nex());
        if (flags & 0x0020) this.player.stats = new Array(30).fill(0).map(() => rot.nex());
        if (flags & 0x0040) {

            const result = parseInt(rot.nex(), 36);

            this.player.skills = [
                (result / 0x1000000000 & 15),
                (result / 0x0100000000 & 15),
                (result / 0x0010000000 & 15),
                (result / 0x0001000000 & 15),
                (result / 0x0000100000 & 15),
                (result / 0x0000010000 & 15),
                (result / 0x0000001000 & 15),
                (result / 0x0000000100 & 15),
                (result / 0x0000000010 & 15),
                (result / 0x0000000001 & 15)
            ]
        }
        if (flags & 0x0080) this.player.accel = rot.nex();
        if (flags & 0x0100) this.player.top = rot.nex();
        if (flags & 0x0200) this.player.party = rot.nex();
        if (flags & 0x0400) this.player.speed = rot.nex();

        if (version === 2 && this.entities !== false) {
            this._parseEnts(rot)
        } else if (version !== 2 && this.entities !== false) {
            this.entities = false;
            console.error('Invalid version, expected version 2. Disabling entities');
        }
        return this;
    }
    _table(rot, read) {
        const out = [];
        for (let id = rot.nex(); id !== -1; id = rot.nex()) {
            out[out.length] = read.call(this, id, rot)
        }
        return out
    }

    _parseEnts(rot) {
        if (rot.nex() !== -1) return console.warn('Unknown stuff going on at index ' + (rot.i - 1) + '... Cancelling', rot.arr);

        // deletes
        this._table(rot, (id) => {
            const index = this.entities.findIndex(ent => ent.id === id);
            if (index === -1) {
                return console.warn('Possible desync, deletion of non existent entity ' + id);
            }
            this.entities[index] = this.entities[this.entities.length - 1]
                --this.entities.length;
        });

        // update / creations
        this._table(rot, (id) => {
            let index = this.entities.findIndex(ent => ent.id === id)
            if (index === -1) this.entities[index = this.entities.length] = {
                id
            };

            const ent = this.entities[index];
            this._parseEnt(ent, rot)
        });
    }
    _parseEnt(ent, rot) {
        const flags = rot.nex();

        if (!ent) console.log(this.entities.length, rot.get(rot.i - 1));
        if (flags & 0x0001) {
            let {
                x: lastX,
                y: lastY
            } = ent;
            ent.x = rot.nex() * 0.0625;
            ent.y = rot.nex() * 0.0625;

            // Not part of reversal, added separately
            if (typeof lastX !== 'undefined') {
                ent.vx = (ent.x - lastX);
                ent.vy = (ent.y - lastY);
            } else ent.vx = ent.vy = 0;
        }
        if (flags & 0x0002) ent.facing = rot.nex() * (360 / 256); // degrees instead of radians
        if (flags & 0x0004) ent.flags = rot.nex();
        if (flags & 0x0008) ent.health = rot.nex() / 255;
        if (flags & 0x0010) ent.shield = Math.max(0, rot.nex() / 255);
        if (flags & 0x0020) ent.alpha = rot.nex() / 255;
        if (flags & 0x0040) ent.size = rot.nex() * 0.0625;
        if (flags & 0x0080) ent.score = rot.nex();
        if (flags & 0x0100) ent.name = rot.nex();
        if (flags & 0x0200) ent.mockupIndex = rot.nex();
        if (flags & 0x0400) ent.color = rot.nex();
        if (flags & 0x0800) ent.layer = rot.nex();
        if (flags & 0x1000) {
            if (!ent.guns) ent.guns = []

            this._table(rot, (index) => {
                const flag = rot.nex();
                if (!ent.guns[index]) ent.guns[index] = {};
                if (flag & 1) ent.guns[index].time = rot.nex();
                if (flag & 2) ent.guns[index].power = Math.sqrt(rot.nex()) / 20;
            });
        }
        if (flags & 0x2000) {
            if (!ent.turrets) ent.turrets = [];

            ent.turrets = this._table(rot, (index) => {
                let i = ent.turrets.findIndex(ent => ent.index === index)
                if (i === -1) ent.turrets[i = ent.turrets.length] = {
                    index
                };
                const turret = ent.turrets[i];

                return this._parseEnt(turret, rot);
            });
        }

        return ent;
    }
};

let leader = false;

for (let count = 1; count <= 4; count++) {
    localStorage.setItem('array' + count, [])
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
