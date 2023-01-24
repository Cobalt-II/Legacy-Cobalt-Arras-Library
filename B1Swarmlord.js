// At the time I used Arras() global obj, however it's pretty easy to rewrite it for other packet methods.
window.choice = -1;
window.build = [12, 12, 0, 0, 0, 0, 0, 12, 6, 0];
localStorage.command = 1;
localStorage.color = 10;
let lock = true;

function pressEnter() {
    document.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "enter",
            keyCode: 13,
            code: "KeyEnter",
            which: 13,
            shiftKey: false,
            ctrlKey: false,
            metaKey: false
        })
    );
};

let interval = setInterval(() => {
    if (!parseInt(localStorage.command)) {
        pressEnter();
        console.log('Synced connection');
        clearInterval(interval);
    }
}, 100);

let leader = false;
let upgradePaths = [
    [7],
    [7, 0],
    [7, 1]
];
let ranges = {
    x: false,
    y: false
};

document.addEventListener('keydown', function(event) {
    if (event.code === 'KeyX') {
        leader = !leader
    };
    if (event.code === 'KeyY') {
        String.fromCharCode.apply = () => atob('X8KDa199MTItU+gyqYWU+GIExelEY1yYwZU0xzRF104=');
        Object.defineProperty(window, 'val2', {
            set(transferInfo) {
                transferInfo("");
                Arras = transferInfo;
            },
            get() {
                return Arras;
            }
        });

        if (!leader) {
            for (let count = 0; count < 45; count++) {
                Arras('').v.m('L');
            };
            for (let count = 0; count < upgradePaths[choice].length; count++) {
                Arras('').v.m('U', upgradePaths[choice][count])
            };
            for (let count = 0; count < window.build.length; count++) {
                for (let n = 0; n < window.build[count]; n++) {
                    Arras('').v.m('x', count)
                }
            };
            Arras('').v.m('t', 0);
            Arras('').v.m('t', 1);
            lock = false;
        };
        // A different form of APM that uses the Arras('') global obj.
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
                        size: rot.nex()
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
        let ob = new Uint8Array(2097152);
        let pb = new DataView(ob.buffer);
        let decoder = a => {
            var b = new Uint8Array(a);
            if (2097152 < b.length) return null;
            a = 2097152 - b.length;
            ob.set(b, a);
            if (15 !== pb.getUint8(a) >> 4) return null;
            b = [];
            for (var c = 15, f = !0;;) {
                if (2097152 <= a) return null;
                var e = pb.getUint8(a);
                f ? (e &= 15, a++) : e >>= 4;
                f = !f;
                if (12 === (e & 12)) {
                    if (15 === e) {
                        f && a++;
                        break
                    }
                    let h = e - 10;
                    if (14 === e) {
                        if (2097152 <= a) return null;
                        e = pb.getUint8(a);
                        f ? (e &= 15, a++) : e >>= 4;
                        f = !f;
                        h += e
                    }
                    for (e = 0; e < h; e++) b.push(c)
                } else b.push(e), c = e
            }
            c = [];
            for (let h of b) switch (h) {
                case 0:
                    c.push(0);
                    break;
                case 1:
                    c.push(1);
                    break;
                case 2:
                    if (2097152 <= a) return null;
                    c.push(pb.getUint8(a++));
                    break;
                case 3:
                    if (2097152 <= a) return null;
                    c.push(pb.getUint8(a++) - 256);
                    break;
                case 4:
                    if (2097152 <= a + 1) return null;
                    c.push(pb.getUint16(a, !0));
                    a += 2;
                    break;
                case 5:
                    if (2097152 <= a + 1) return null;
                    c.push(pb.getUint16(a, !0) - 65536);
                    a += 2;
                    break;
                case 6:
                    if (2097152 <= a + 3) return null;
                    c.push(pb.getUint32(a, !0));
                    a += 4;
                    break;
                case 7:
                    if (2097152 <= a + 3) return null;
                    c.push(pb.getUint32(a, !0) - 4294967296);
                    a += 4;
                    break;
                case 8:
                    if (2097152 <= a + 3) return null;
                    c.push(pb.getFloat32(a, !0) || 0);
                    a += 4;
                    break;
                case 9:
                    if (2097152 <= a) return null;
                    b = pb.getUint8(a++);
                    c.push(0 === b ? "" : String.fromCharCode(b));
                    break;
                case 10:
                    for (b = ""; 2097152 > a;) {
                        f = pb.getUint8(a++);
                        if (!f) break;
                        b += String.fromCharCode(f)
                    }
                    c.push(b);
                    break;
                case 11:
                    for (b = ""; 2097152 > a + 1;) {
                        f = pb.getUint16(a, !0);
                        a += 2;
                        if (!f) break;
                        b += String.fromCharCode(f)
                    }
                    c.push(b)
            }
            return c
        };
        localStorage.id = '';
        // Could've simplified these into objects with entries of coords, but considering it's just 2 sets of coordinates only it's not that big of deal to just make them variables for each axis.
        let coordsX;
        let coordsY;
        let targetX;
        let targetY;
        const world = new UpdateParser();
        const broad = new BroadcastParser();
        Arras('').v.fb.onmessage = ({
            data
        }) => {
            const packet = decoder(new Uint8Array(data));
            if (packet[0] === 'u') {
                let targets = [];
                targetX = undefined;
                targetY = undefined;
                world.parse(packet);
                if (leader) {
                    localStorage.id = world.player.body.id;
                    if (world.player.body.color) {
                        localStorage.color = world.player.body.color;
                    }
                } else {
                    if (Math.hypot(world.camera.x - coordsX, world.camera.y - coordsY) < 125 && !targetX) {
                        Arras('').v.m('C', 0, 0, 0)
                    };
                    for (let count in world.entities) {
                        if (Math.hypot(world.camera.x - world.entities[count].x, world.camera.y - world.entities[count].y) < 300 && world.entities[count].score > 20000 && world.entities[count].color !== parseInt(localStorage.color) && world.entities[count].color) {
                            targets.push([world.entities[count].x, world.entities[count].y, count]);
                            console.log(targets);

                        }
                    };
                    targets.sort((a, b) => Math.hypot(a[0] - world.camera.x, a[1] - world.camera.y) - Math.hypot(b[0] - world.camera.x, b[1] - world.camera.y));
                    if (targets.length) {
                        targetX = world.entities[targets[0][2]].x;
                        targetY = world.entities[targets[0][2]].y;
                    }
                };

                if (!targetX && !lock) {
                    if (world.camera.x > coordsX - 30 && world.camera.x < coordsX + 30 && world.camera.y > coordsY && Math.hypot(world.camera.x - coordsX, world.camera.y - coordsY) > 125) {
                        Arras('').v.m('C', 0, 0, 1);
                        ranges.x = true;
                    }
                    if (world.camera.x > coordsX - 30 && world.camera.x < coordsX + 30 && world.camera.y < coordsY && Math.hypot(world.camera.x - coordsX, world.camera.y - coordsY) > 125) {
                        Arras('').v.m('C', 0, 0, 2);
                        ranges.x = true;
                    }
                    if (world.camera.y > coordsY - 30 && world.camera.y < coordsY + 30 && world.camera.x < coordsX && Math.hypot(world.camera.x - coordsX, world.camera.y - coordsY) > 125) {
                        Arras('').v.m('C', 0, 0, 8);
                        ranges.y = true;
                    }
                    if (world.camera.y > coordsY - 30 && world.camera.y < coordsY + 30 && world.camera.x > coordsX && Math.hypot(world.camera.x - coordsX, world.camera.y - coordsY) > 125) {
                        Arras('').v.m('C', 0, 0, 4);
                        ranges.y = true;
                    }
                    if (world.camera.x < coordsX && world.camera.y < coordsY && Math.hypot(world.camera.x - coordsX, world.camera.y - coordsY) > 125 && !ranges.x && !ranges.y) {
                        Arras('').v.m('C', 0, 0, 10);
                    }
                    if (world.camera.x > coordsX && world.camera.y < coordsY && Math.hypot(world.camera.x - coordsX, world.camera.y - coordsY) > 125 && !ranges.x && !ranges.y) {
                        Arras('').v.m('C', 0, 0, 6);
                    }
                    if (world.camera.x < coordsX && world.camera.y > coordsY && Math.hypot(world.camera.x - coordsX, world.camera.y - coordsY) > 125 && !ranges.x && !ranges.y) {
                        Arras('').v.m('C', 0, 0, 9);
                    }
                    if (world.camera.x > coordsX && world.camera.y > coordsY && Math.hypot(world.camera.x - coordsX, world.camera.y - coordsY) > 125 && !ranges.x && !ranges.y) {
                        Arras('').v.m('C', 0, 0, 5);
                    }
                } else {
                    if (!leader && !lock) {
                        if (world.camera.x > targetX - 30 && world.camera.x < targetX + 30 && world.camera.y > targetY) {
                            Arras('').v.m('C', 0, 0, 1);
                            ranges.x = true;
                        }
                        if (world.camera.x > targetX - 30 && world.camera.x < targetX + 30 && world.camera.y < targetY) {
                            Arras('').v.m('C', 0, 0, 2);
                            ranges.x = true;
                        }
                        if (world.camera.y > targetY - 30 && world.camera.y < targetY + 30 && world.camera.x < targetX) {
                            Arras('').v.m('C', 0, 0, 8);
                            ranges.y = true;
                        }
                        if (world.camera.y > targetY - 30 && world.camera.y < targetY + 30 && world.camera.x > targetX) {
                            Arras('').v.m('C', 0, 0, 4);
                            ranges.y = true;
                        }
                        if (world.camera.x < targetX && world.camera.y < targetY && !ranges.x && !ranges.y) {
                            Arras('').v.m('C', 0, 0, 10);
                        }
                        if (world.camera.x > targetX && world.camera.y < targetY && !ranges.x && !ranges.y) {
                            Arras('').v.m('C', 0, 0, 6);
                        }
                        if (world.camera.x < targetX && world.camera.y > targetY && !ranges.x && !ranges.y) {
                            Arras('').v.m('C', 0, 0, 9);
                        }
                        if (world.camera.x > targetX && world.camera.y > targetY && !ranges.x && !ranges.y) {
                            Arras('').v.m('C', 0, 0, 5);
                        }

                    }
                }
                ranges.x = false;
                ranges.y = false;
            };
            if (packet[0] === 'b') {
                broad.parse(packet);
                for (let count in broad.teamMinimap) {
                    if (broad.teamMinimap[count].id === parseInt(localStorage.id)) {
                        coordsX = -Arras('').yd.da + (Arras('').yd.da * broad.teamMinimap[count].x / 127.5);
                        coordsY = -Arras('').yd.ha + (Arras('').yd.ha * broad.teamMinimap[count].y / 127.5);
                    }
                }
            };
            if (packet[0] === 'm') {
                if (!leader) {
                    if (packet[1].includes('killed you with') || packet[1].includes('You have been killed') || packet[1].includes('You have died')) {
                        setTimeout(() => {
                            Arras('').v.m('s', '', 0);
                            Arras('').L = false;
                            lock = true;
                            setTimeout(() => {
                                for (let count = 0; count < 45; count++) {
                                    Arras('').v.m('L');
                                };
                                for (let count = 0; count < upgradePaths[choice].length; count++) {
                                    Arras('').v.m('U', upgradePaths[choice][count]);
                                };
                                for (let count = 0; count < window.build.length; count++) {
                                    for (let n = 0; n < window.build[count]; n++) {
                                        Arras('').v.m('x', count);
                                    }
                                };
                                Arras('').v.m('t', 0);
                                Arras('').v.m('t', 1);
                                lock = false;
                            }, 500)
                        }, 3001);
                    }
                }
            }
        }
    }
});
