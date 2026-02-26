/**
 * physics.js — 2D rigid body physics for Slingshot Siege
 * Gravity, AABB collision, impulse resolution, friction
 */
'use strict';

const Physics = (() => {
    const GRAVITY = 980;
    const SUBSTEPS = 4;
    const RESTITUTION = 0.3;
    const FRICTION = 0.4;
    const SLEEP_THRESHOLD = 2;
    const SLEEP_FRAMES = 30;
    const DAMPING = 0.998;
    const ANGULAR_DAMPING = 0.995;

    class Body {
        constructor(x, y, w, h, opts = {}) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.vx = opts.vx || 0;
            this.vy = opts.vy || 0;
            this.angle = opts.angle || 0;
            this.angularVel = 0;
            this.mass = Math.max(0.01, opts.mass || (w * h * 0.01));
            this.invMass = opts.isStatic ? 0 : 1 / this.mass;
            this.isStatic = opts.isStatic || false;
            this.restitution = opts.restitution !== undefined ? opts.restitution : RESTITUTION;
            this.friction = opts.friction !== undefined ? opts.friction : FRICTION;
            this.type = opts.type || 'block';
            this.hp = opts.hp || 100;
            this.maxHp = this.hp;
            this.material = opts.material || 'wood';
            this.isProjectile = opts.isProjectile || false;
            this.isEnemy = opts.isEnemy || false;
            this.alive = true;
            this.sleepCounter = 0;
            this.sleeping = false;
            this.radius = opts.radius || 0;
            this.isCircle = opts.isCircle || false;
            this.id = Body._nextId++;
            this.onDestroy = opts.onDestroy || null;
            this.damageMultiplier = opts.damageMultiplier || 1;
            this.userData = opts.userData || {};
        }

        get left() { return this.x - this.w / 2; }
        get right() { return this.x + this.w / 2; }
        get top() { return this.y - this.h / 2; }
        get bottom() { return this.y + this.h / 2; }

        get speed() {
            return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        }

        wake() {
            this.sleeping = false;
            this.sleepCounter = 0;
        }

        applyImpulse(ix, iy) {
            if (this.isStatic) return;
            this.wake();
            this.vx += ix * this.invMass;
            this.vy += iy * this.invMass;
        }

        damage(amount) {
            if (this.isStatic || !this.alive) return;
            this.hp -= amount * this.damageMultiplier;
            if (this.hp <= 0) {
                this.alive = false;
                if (this.onDestroy) this.onDestroy(this);
            }
        }
    }
    Body._nextId = 0;

    class World {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.bodies = [];
            this.particles = [];
            this.groundY = height - 60;
            this.callbacks = { collision: [], destroy: [] };
        }

        on(event, fn) {
            if (this.callbacks[event]) this.callbacks[event].push(fn);
        }

        emit(event, ...args) {
            (this.callbacks[event] || []).forEach(fn => fn(...args));
        }

        addBody(body) {
            this.bodies.push(body);
            return body;
        }

        removeBody(body) {
            const idx = this.bodies.indexOf(body);
            if (idx !== -1) this.bodies.splice(idx, 1);
        }

        addParticle(p) {
            this.particles.push(p);
        }

        step(dt) {
            const subDt = dt / SUBSTEPS;
            for (let s = 0; s < SUBSTEPS; s++) {
                this._integrate(subDt);
                this._detectCollisions();
                this._constrainBounds();
            }
            this._updateSleep();
            this._updateParticles(dt);
            this._cleanup();
        }

        _integrate(dt) {
            for (const b of this.bodies) {
                if (b.isStatic || b.sleeping) continue;
                b.vy += GRAVITY * dt;
                b.x += b.vx * dt;
                b.y += b.vy * dt;
                b.angle += b.angularVel * dt;
                b.vx *= DAMPING;
                b.vy *= DAMPING;
                b.angularVel *= ANGULAR_DAMPING;
            }
        }

        _detectCollisions() {
            const bodies = this.bodies;
            const len = bodies.length;
            for (let i = 0; i < len; i++) {
                for (let j = i + 1; j < len; j++) {
                    const a = bodies[i];
                    const b = bodies[j];
                    if (a.sleeping && b.sleeping) continue;
                    if (a.isStatic && b.isStatic) continue;
                    if (!a.alive || !b.alive) continue;

                    if (a.isCircle && b.isCircle) {
                        this._circleCircle(a, b);
                    } else if (a.isCircle) {
                        this._circleRect(a, b);
                    } else if (b.isCircle) {
                        this._circleRect(b, a);
                    } else {
                        this._rectRect(a, b);
                    }
                }
            }
        }

        _rectRect(a, b) {
            const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
            const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
            if (overlapX <= 0 || overlapY <= 0) return;

            let nx, ny, overlap;
            if (overlapX < overlapY) {
                overlap = overlapX;
                nx = a.x < b.x ? -1 : 1;
                ny = 0;
            } else {
                overlap = overlapY;
                nx = 0;
                ny = a.y < b.y ? -1 : 1;
            }

            this._resolveCollision(a, b, nx, ny, overlap);
        }

        _circleCircle(a, b) {
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = a.radius + b.radius;
            if (dist >= minDist || dist === 0) return;

            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;
            this._resolveCollision(a, b, nx, ny, overlap);
        }

        _circleRect(circle, rect) {
            const cx = Math.max(rect.left, Math.min(circle.x, rect.right));
            const cy = Math.max(rect.top, Math.min(circle.y, rect.bottom));
            const dx = circle.x - cx;
            const dy = circle.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist >= circle.radius || dist === 0) return;

            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = circle.radius - dist;
            this._resolveCollision(circle, rect, nx, ny, overlap);
        }

        _resolveCollision(a, b, nx, ny, overlap) {
            // Separate
            const totalInvMass = a.invMass + b.invMass;
            if (totalInvMass === 0) return;

            const sep = overlap / totalInvMass;
            a.x -= nx * sep * a.invMass;
            a.y -= ny * sep * a.invMass;
            b.x += nx * sep * b.invMass;
            b.y += ny * sep * b.invMass;

            // Relative velocity
            const rvx = a.vx - b.vx;
            const rvy = a.vy - b.vy;
            const velAlongNormal = rvx * nx + rvy * ny;

            if (velAlongNormal > 0) return; // Moving apart

            const e = Math.min(a.restitution, b.restitution);
            let j = -(1 + e) * velAlongNormal / totalInvMass;

            a.vx += j * nx * a.invMass;
            a.vy += j * ny * a.invMass;
            b.vx -= j * nx * b.invMass;
            b.vy -= j * ny * b.invMass;

            // Friction
            const tvx = rvx - velAlongNormal * nx;
            const tvy = rvy - velAlongNormal * ny;
            const tLen = Math.sqrt(tvx * tvx + tvy * tvy);
            if (tLen > 0.001) {
                const ftx = tvx / tLen;
                const fty = tvy / tLen;
                const mu = Math.sqrt(a.friction * b.friction);
                const jt = Math.max(-j * mu, Math.min(j * mu,
                    -(tvx * ftx + tvy * fty) / totalInvMass));
                a.vx += jt * ftx * a.invMass;
                a.vy += jt * fty * a.invMass;
                b.vx -= jt * ftx * b.invMass;
                b.vy -= jt * fty * b.invMass;
            }

            // Angular response
            const impactSpeed = Math.abs(velAlongNormal);
            if (!a.isStatic) a.angularVel += (ny * (b.x - a.x) - nx * (b.y - a.y)) * 0.002;
            if (!b.isStatic) b.angularVel -= (ny * (a.x - b.x) - nx * (a.y - b.y)) * 0.002;

            // Wake sleeping bodies
            a.wake();
            b.wake();

            // Damage from impact
            const dmg = impactSpeed * 0.08;
            if (dmg > 2) {
                if (!a.isStatic && !a.isProjectile) a.damage(dmg * (b.isProjectile ? 3 : 1));
                if (!b.isStatic && !b.isProjectile) b.damage(dmg * (a.isProjectile ? 3 : 1));
                this.emit('collision', a, b, impactSpeed);
            }
        }

        _constrainBounds() {
            for (const b of this.bodies) {
                if (b.isStatic || b.sleeping) continue;

                // Ground
                if (!b.isCircle && b.bottom > this.groundY) {
                    b.y = this.groundY - b.h / 2;
                    b.vy = -b.vy * b.restitution;
                    b.vx *= 0.9;
                    b.angularVel *= 0.9;
                } else if (b.isCircle && b.y + b.radius > this.groundY) {
                    b.y = this.groundY - b.radius;
                    b.vy = -b.vy * b.restitution;
                    b.vx *= 0.9;
                }

                // Walls
                if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx) * 0.5; }
                if (b.x > this.width) { b.x = this.width; b.vx = -Math.abs(b.vx) * 0.5; }
                if (b.y < -500) { b.y = -500; b.vy = Math.abs(b.vy) * 0.5; }
            }
        }

        _updateSleep() {
            for (const b of this.bodies) {
                if (b.isStatic) continue;
                if (b.speed < SLEEP_THRESHOLD && Math.abs(b.angularVel) < 0.01) {
                    b.sleepCounter++;
                    if (b.sleepCounter > SLEEP_FRAMES) {
                        b.sleeping = true;
                        b.vx = 0;
                        b.vy = 0;
                        b.angularVel = 0;
                    }
                } else {
                    b.sleepCounter = 0;
                    b.sleeping = false;
                }
            }
        }

        _updateParticles(dt) {
            for (const p of this.particles) {
                p.vy += 400 * dt;
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.life -= dt;
                p.alpha = Math.max(0, p.life / p.maxLife);
                if (p.rotation !== undefined) p.rotation += p.rotSpeed * dt;
            }
        }

        _cleanup() {
            for (let i = this.bodies.length - 1; i >= 0; i--) {
                const b = this.bodies[i];
                if (!b.alive) {
                    this.emit('destroy', b);
                    this.bodies.splice(i, 1);
                }
            }
            this.particles = this.particles.filter(p => p.life > 0);
        }

        /** Spawn debris particles for a destroyed body */
        spawnDebris(body, count = 8) {
            const colors = {
                wood: ['#c4883c', '#a06828', '#daa06d', '#8b5e3c'],
                stone: ['#8a8a8a', '#6b6b6b', '#a0a0a0', '#555555'],
                glass: ['#7ec8e3', '#a8e6cf', '#b3e5fc', '#e0f7fa'],
                ice: ['#b3e5fc', '#e1f5fe', '#ffffff', '#81d4fa'],
                metal: ['#b0b0b0', '#888888', '#d0d0d0', '#707070']
            };
            const palette = colors[body.material] || colors.wood;
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 80 + Math.random() * 200;
                this.addParticle({
                    x: body.x + (Math.random() - 0.5) * body.w,
                    y: body.y + (Math.random() - 0.5) * body.h,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 100,
                    size: 2 + Math.random() * (body.isCircle ? 4 : 6),
                    color: palette[Math.floor(Math.random() * palette.length)],
                    life: 0.5 + Math.random() * 1.0,
                    maxLife: 1.5,
                    alpha: 1,
                    rotation: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 10
                });
            }
        }

        /** Explosion: damage and push nearby bodies */
        explode(x, y, radius, power) {
            for (const b of this.bodies) {
                if (b.isStatic) continue;
                const dx = b.x - x;
                const dy = b.y - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < radius && dist > 0) {
                    const factor = 1 - dist / radius;
                    const nx = dx / dist;
                    const ny = dy / dist;
                    b.applyImpulse(nx * power * factor * b.mass, ny * power * factor * b.mass);
                    b.damage(power * factor * 0.5);
                }
            }
            // Explosion particles
            for (let i = 0; i < 20; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 100 + Math.random() * 300;
                this.addParticle({
                    x: x, y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 80,
                    size: 3 + Math.random() * 6,
                    color: ['#ff6600', '#ff3300', '#ffcc00', '#ff9900'][Math.floor(Math.random() * 4)],
                    life: 0.3 + Math.random() * 0.7,
                    maxLife: 1.0,
                    alpha: 1,
                    rotation: 0,
                    rotSpeed: 0
                });
            }
        }

        /** Simple trajectory prediction */
        predictTrajectory(x, y, vx, vy, steps = 40) {
            const points = [];
            const dt = 1 / 60;
            let px = x, py = y, pvx = vx, pvy = vy;
            for (let i = 0; i < steps; i++) {
                pvy += GRAVITY * dt;
                px += pvx * dt;
                py += pvy * dt;
                if (py > this.groundY) break;
                if (i % 2 === 0) points.push({ x: px, y: py });
            }
            return points;
        }
    }

    return { Body, World };
})();
