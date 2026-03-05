/* asteroids/entities.js -- Ship, Asteroid, Bullet, UFO, Particle */
'use strict';

/* ---------- helpers ---------- */
const TWO_PI = Math.PI * 2;

function wrap(x, y, w, h) {
    if (x < 0) x += w;
    if (x > w) x -= w;
    if (y < 0) y += h;
    if (y > h) y -= h;
    return { x, y };
}

function dist(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function randRange(lo, hi) {
    return lo + Math.random() * (hi - lo);
}

/* ---------- Ship ---------- */
class Ship {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.angle = -Math.PI / 2; // pointing up
        this.radius = 15;
        this.thrusting = false;
        this.rotatingLeft = false;
        this.rotatingRight = false;
        this.shootCooldown = 0;
        this.invulnerable = 0; // frames of invulnerability
        this.dead = false;
        this.respawnTimer = 0;
    }

    update(w, h, dt) {
        const ROT_SPEED = 4.5; // rad/s
        const THRUST = 280;    // px/s^2
        const DRAG = 0.992;
        const MAX_SPEED = 500;

        if (this.dead) return;

        if (this.rotatingLeft) this.angle -= ROT_SPEED * dt;
        if (this.rotatingRight) this.angle += ROT_SPEED * dt;

        if (this.thrusting) {
            this.vx += Math.cos(this.angle) * THRUST * dt;
            this.vy += Math.sin(this.angle) * THRUST * dt;
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > MAX_SPEED) {
                this.vx = (this.vx / speed) * MAX_SPEED;
                this.vy = (this.vy / speed) * MAX_SPEED;
            }
        }

        this.vx *= DRAG;
        this.vy *= DRAG;
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        const p = wrap(this.x, this.y, w, h);
        this.x = p.x;
        this.y = p.y;

        if (this.shootCooldown > 0) this.shootCooldown -= dt;
        if (this.invulnerable > 0) this.invulnerable -= dt;
    }

    getVertices() {
        const a = this.angle;
        const r = this.radius;
        return [
            { x: this.x + Math.cos(a) * r * 1.4, y: this.y + Math.sin(a) * r * 1.4 },
            { x: this.x + Math.cos(a + 2.3) * r, y: this.y + Math.sin(a + 2.3) * r },
            { x: this.x + Math.cos(a + Math.PI) * r * 0.5, y: this.y + Math.sin(a + Math.PI) * r * 0.5 },
            { x: this.x + Math.cos(a - 2.3) * r, y: this.y + Math.sin(a - 2.3) * r },
        ];
    }

    shoot() {
        if (this.dead || this.shootCooldown > 0) return null;
        this.shootCooldown = 0.18;
        const speed = 500;
        return new Bullet(
            this.x + Math.cos(this.angle) * this.radius * 1.5,
            this.y + Math.sin(this.angle) * this.radius * 1.5,
            Math.cos(this.angle) * speed + this.vx * 0.3,
            Math.sin(this.angle) * speed + this.vy * 0.3,
            false
        );
    }
}

/* ---------- Asteroid ---------- */
const ASTEROID_SIZES = {
    large:  { radius: 40, score: 20 },
    medium: { radius: 22, score: 50 },
    small:  { radius: 10, score: 100 },
};

class Asteroid {
    constructor(x, y, size, w, h) {
        this.x = x;
        this.y = y;
        this.size = size; // 'large', 'medium', 'small'
        const info = ASTEROID_SIZES[size];
        this.radius = info.radius;
        this.score = info.score;

        const speed = size === 'large' ? randRange(40, 80) : size === 'medium' ? randRange(60, 120) : randRange(80, 160);
        const angle = Math.random() * TWO_PI;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.rotAngle = Math.random() * TWO_PI;
        this.rotSpeed = randRange(-1.5, 1.5);

        // generate jagged shape
        this.vertices = [];
        const verts = size === 'large' ? 12 : size === 'medium' ? 9 : 7;
        for (let i = 0; i < verts; i++) {
            const a = (TWO_PI / verts) * i;
            const r = this.radius * randRange(0.75, 1.15);
            this.vertices.push({ a, r });
        }
    }

    update(w, h, dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        const p = wrap(this.x, this.y, w, h);
        this.x = p.x;
        this.y = p.y;
        this.rotAngle += this.rotSpeed * dt;
    }

    getWorldVertices() {
        return this.vertices.map(v => ({
            x: this.x + Math.cos(v.a + this.rotAngle) * v.r,
            y: this.y + Math.sin(v.a + this.rotAngle) * v.r,
        }));
    }

    split() {
        if (this.size === 'small') return [];
        const nextSize = this.size === 'large' ? 'medium' : 'small';
        return [
            new Asteroid(this.x, this.y, nextSize, 0, 0),
            new Asteroid(this.x, this.y, nextSize, 0, 0),
        ];
    }
}

/* ---------- Bullet ---------- */
class Bullet {
    constructor(x, y, vx, vy, isEnemy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.isEnemy = isEnemy;
        this.life = isEnemy ? 2.0 : 1.5; // seconds
        this.radius = isEnemy ? 3 : 2;
    }

    update(w, h, dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        const p = wrap(this.x, this.y, w, h);
        this.x = p.x;
        this.y = p.y;
        this.life -= dt;
    }

    get alive() { return this.life > 0; }
}

/* ---------- UFO ---------- */
class UFO {
    constructor(w, h, small) {
        this.small = small;
        this.radius = small ? 12 : 22;
        this.score = small ? 1000 : 200;
        this.y = randRange(60, h - 60);
        this.direction = Math.random() < 0.5 ? 1 : -1;
        this.x = this.direction === 1 ? -this.radius : w + this.radius;
        this.speed = small ? 160 : 110;
        this.vx = this.direction * this.speed;
        this.vy = 0;
        this.zigTimer = 0;
        this.zigInterval = randRange(0.8, 2.0);
        this.shootTimer = small ? randRange(0.8, 1.5) : randRange(1.5, 3.0);
        this.alive = true;
        this.soundTimer = 0;
    }

    update(w, h, dt, shipX, shipY) {
        this.zigTimer += dt;
        if (this.zigTimer >= this.zigInterval) {
            this.zigTimer = 0;
            this.zigInterval = randRange(0.8, 2.0);
            this.vy = randRange(-80, 80);
        }
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // vertical wrap
        if (this.y < 0) this.y += h;
        if (this.y > h) this.y -= h;

        // off screen horizontally = gone
        if ((this.direction === 1 && this.x > w + this.radius * 2) ||
            (this.direction === -1 && this.x < -this.radius * 2)) {
            this.alive = false;
        }

        this.shootTimer -= dt;
        this.soundTimer -= dt;
    }

    tryShoot(shipX, shipY) {
        if (this.shootTimer > 0) return null;
        this.shootTimer = this.small ? randRange(0.6, 1.2) : randRange(1.2, 2.5);
        let angle;
        if (this.small) {
            // aimed at player with slight spread
            angle = Math.atan2(shipY - this.y, shipX - this.x) + randRange(-0.15, 0.15);
        } else {
            angle = Math.random() * TWO_PI;
        }
        const speed = 280;
        return new Bullet(
            this.x + Math.cos(angle) * this.radius,
            this.y + Math.sin(angle) * this.radius,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            true
        );
    }

    getVertices() {
        const r = this.radius;
        const x = this.x;
        const y = this.y;
        // classic UFO shape: dome + body
        return {
            body: [
                { x: x - r, y },
                { x: x - r * 0.6, y: y - r * 0.35 },
                { x: x + r * 0.6, y: y - r * 0.35 },
                { x: x + r, y },
                { x: x + r * 0.6, y: y + r * 0.3 },
                { x: x - r * 0.6, y: y + r * 0.3 },
            ],
            dome: [
                { x: x - r * 0.4, y: y - r * 0.35 },
                { x: x - r * 0.2, y: y - r * 0.7 },
                { x: x + r * 0.2, y: y - r * 0.7 },
                { x: x + r * 0.4, y: y - r * 0.35 },
            ]
        };
    }
}

/* ---------- Particle ---------- */
class Particle {
    constructor(x, y, vx, vy, life, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.maxLife = life;
        this.color = color || '#ffffff';
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life -= dt;
    }

    get alive() { return this.life > 0; }
    get alpha() { return Math.max(0, this.life / this.maxLife); }
}

/* ---------- Particle factories ---------- */
function makeExplosion(x, y, count, speed, color, lifeRange) {
    const particles = [];
    for (let i = 0; i < count; i++) {
        const a = Math.random() * TWO_PI;
        const s = randRange(speed * 0.3, speed);
        const life = randRange(lifeRange[0], lifeRange[1]);
        particles.push(new Particle(x, y, Math.cos(a) * s, Math.sin(a) * s, life, color));
    }
    return particles;
}

function makeShipExplosion(ship) {
    const particles = [];
    // ship lines break apart
    const verts = ship.getVertices();
    for (let i = 0; i < verts.length; i++) {
        const next = verts[(i + 1) % verts.length];
        const mx = (verts[i].x + next.x) / 2;
        const my = (verts[i].y + next.y) / 2;
        const a = Math.atan2(my - ship.y, mx - ship.x);
        const s = randRange(40, 120);
        particles.push(new Particle(mx, my, Math.cos(a) * s, Math.sin(a) * s, randRange(0.8, 1.5), '#ffffff'));
    }
    // sparks
    for (let i = 0; i < 20; i++) {
        const a = Math.random() * TWO_PI;
        const s = randRange(30, 200);
        particles.push(new Particle(ship.x, ship.y, Math.cos(a) * s, Math.sin(a) * s, randRange(0.3, 1.0), '#ffaa44'));
    }
    return particles;
}

function makeThrustParticle(ship) {
    const backAngle = ship.angle + Math.PI;
    const spread = randRange(-0.3, 0.3);
    const s = randRange(40, 100);
    const px = ship.x + Math.cos(backAngle) * ship.radius * 0.6;
    const py = ship.y + Math.sin(backAngle) * ship.radius * 0.6;
    return new Particle(
        px, py,
        Math.cos(backAngle + spread) * s + ship.vx * 0.3,
        Math.sin(backAngle + spread) * s + ship.vy * 0.3,
        randRange(0.15, 0.35),
        Math.random() < 0.5 ? '#ff6622' : '#ffcc33'
    );
}

/* ---------- Exports ---------- */
window.AsteroidsEntities = {
    Ship, Asteroid, Bullet, UFO, Particle,
    ASTEROID_SIZES,
    makeExplosion, makeShipExplosion, makeThrustParticle,
    wrap, dist, randRange, TWO_PI,
};
