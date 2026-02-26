// Pinball Physics Engine
// Handles ball movement, collision detection, and response
(function() {
    'use strict';

    var GRAVITY = 980;        // pixels/s^2
    var FRICTION = 0.998;     // per-frame velocity damping
    var RESTITUTION = 0.45;   // wall/flipper bounce
    var BUMPER_RESTITUTION = 1.5; // bumpers give energy back
    var MAX_SPEED = 2400;
    var SUBSTEPS = 4;         // physics substeps per frame for accuracy

    function Vec2(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    Vec2.prototype.add = function(v) { return new Vec2(this.x + v.x, this.y + v.y); };
    Vec2.prototype.sub = function(v) { return new Vec2(this.x - v.x, this.y - v.y); };
    Vec2.prototype.scale = function(s) { return new Vec2(this.x * s, this.y * s); };
    Vec2.prototype.dot = function(v) { return this.x * v.x + this.y * v.y; };
    Vec2.prototype.len = function() { return Math.sqrt(this.x * this.x + this.y * this.y); };
    Vec2.prototype.norm = function() {
        var l = this.len();
        return l > 0.0001 ? new Vec2(this.x / l, this.y / l) : new Vec2(0, 0);
    };
    Vec2.prototype.reflect = function(normal) {
        var d = 2 * this.dot(normal);
        return new Vec2(this.x - d * normal.x, this.y - d * normal.y);
    };
    Vec2.prototype.rotate = function(angle) {
        var c = Math.cos(angle), s = Math.sin(angle);
        return new Vec2(this.x * c - this.y * s, this.x * s + this.y * c);
    };

    // Ball object
    function Ball(x, y, radius) {
        this.pos = new Vec2(x, y);
        this.vel = new Vec2(0, 0);
        this.radius = radius || 10;
        this.active = false;
        this.trail = [];      // for neon trail rendering
        this.trailMax = 20;
    }

    Ball.prototype.update = function(dt, tableWidth, tableHeight, walls) {
        if (!this.active) return;

        var subDt = dt / SUBSTEPS;
        for (var s = 0; s < SUBSTEPS; s++) {
            // Gravity
            this.vel.y += GRAVITY * subDt;

            // Friction
            this.vel.x *= FRICTION;
            this.vel.y *= FRICTION;

            // Clamp speed
            var speed = this.vel.len();
            if (speed > MAX_SPEED) {
                this.vel = this.vel.norm().scale(MAX_SPEED);
            }

            // Move
            this.pos.x += this.vel.x * subDt;
            this.pos.y += this.vel.y * subDt;

            // Wall collisions
            this._collideWalls(walls);
        }

        // Update trail
        this.trail.unshift({ x: this.pos.x, y: this.pos.y });
        if (this.trail.length > this.trailMax) {
            this.trail.pop();
        }
    };

    Ball.prototype._collideWalls = function(walls) {
        for (var i = 0; i < walls.length; i++) {
            var w = walls[i];
            if (w.type === 'segment') {
                this._collideSegment(w);
            } else if (w.type === 'arc') {
                this._collideArc(w);
            }
        }
    };

    Ball.prototype._collideSegment = function(seg) {
        var ax = seg.x1, ay = seg.y1, bx = seg.x2, by = seg.y2;
        var dx = bx - ax, dy = by - ay;
        var len2 = dx * dx + dy * dy;
        if (len2 < 0.001) return;

        var t = ((this.pos.x - ax) * dx + (this.pos.y - ay) * dy) / len2;
        t = Math.max(0, Math.min(1, t));

        var closestX = ax + t * dx;
        var closestY = ay + t * dy;
        var distX = this.pos.x - closestX;
        var distY = this.pos.y - closestY;
        var dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < this.radius) {
            var normal = new Vec2(distX, distY).norm();
            var overlap = this.radius - dist;
            this.pos.x += normal.x * overlap;
            this.pos.y += normal.y * overlap;

            var velDotNormal = this.vel.dot(normal);
            if (velDotNormal < 0) {
                var bounce = seg.restitution || RESTITUTION;
                this.vel.x -= (1 + bounce) * velDotNormal * normal.x;
                this.vel.y -= (1 + bounce) * velDotNormal * normal.y;
            }
        }
    };

    Ball.prototype._collideArc = function(arc) {
        var dx = this.pos.x - arc.cx;
        var dy = this.pos.y - arc.cy;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (arc.inside) {
            // Collide with inside of arc (e.g., curved wall)
            if (dist + this.radius > arc.radius) {
                var normal = new Vec2(-dx, -dy).norm();
                var overlap = (dist + this.radius) - arc.radius;
                this.pos.x += normal.x * overlap;
                this.pos.y += normal.y * overlap;

                var velDotNormal = this.vel.dot(normal);
                if (velDotNormal < 0) {
                    var bounce = arc.restitution || RESTITUTION;
                    this.vel.x -= (1 + bounce) * velDotNormal * normal.x;
                    this.vel.y -= (1 + bounce) * velDotNormal * normal.y;
                }
            }
        }
    };

    // Collision with circular bumper
    Ball.prototype.collideBumper = function(bumper) {
        var dx = this.pos.x - bumper.x;
        var dy = this.pos.y - bumper.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var minDist = this.radius + bumper.radius;

        if (dist < minDist) {
            var normal = new Vec2(dx, dy).norm();
            var overlap = minDist - dist;
            this.pos.x += normal.x * overlap;
            this.pos.y += normal.y * overlap;

            var bounce = bumper.restitution || BUMPER_RESTITUTION;
            var velDotNormal = this.vel.dot(normal);
            this.vel.x -= (1 + bounce) * velDotNormal * normal.x;
            this.vel.y -= (1 + bounce) * velDotNormal * normal.y;

            // Minimum bounce speed for bumpers
            var newSpeed = this.vel.len();
            if (newSpeed < 400) {
                this.vel = this.vel.norm().scale(400);
            }

            return true;
        }
        return false;
    };

    // Collision with flipper (simplified as rotating segment)
    Ball.prototype.collideFlipper = function(flipper) {
        var angle = flipper.currentAngle;
        var cos = Math.cos(angle), sin = Math.sin(angle);
        var ex = flipper.x + cos * flipper.length;
        var ey = flipper.y + sin * flipper.length;

        // Segment collision with flipper
        var ax = flipper.x, ay = flipper.y;
        var dx = ex - ax, dy = ey - ay;
        var len2 = dx * dx + dy * dy;
        if (len2 < 0.001) return false;

        var t = ((this.pos.x - ax) * dx + (this.pos.y - ay) * dy) / len2;
        t = Math.max(0, Math.min(1, t));

        var closestX = ax + t * dx;
        var closestY = ay + t * dy;
        var distX = this.pos.x - closestX;
        var distY = this.pos.y - closestY;
        var dist = Math.sqrt(distX * distX + distY * distY);

        var effectiveRadius = this.radius + flipper.width / 2;

        if (dist < effectiveRadius) {
            var normal = new Vec2(distX, distY).norm();
            var overlap = effectiveRadius - dist;
            this.pos.x += normal.x * overlap;
            this.pos.y += normal.y * overlap;

            // Flipper angular velocity contribution
            var contactPoint = new Vec2(closestX - flipper.x, closestY - flipper.y);
            var flipperVelAtContact = new Vec2(
                -contactPoint.y * flipper.angularVel,
                contactPoint.x * flipper.angularVel
            );

            var relVel = new Vec2(
                this.vel.x - flipperVelAtContact.x,
                this.vel.y - flipperVelAtContact.y
            );

            var velDotNormal = relVel.dot(normal);
            if (velDotNormal < 0) {
                var bounce = RESTITUTION;
                this.vel.x -= (1 + bounce) * velDotNormal * normal.x;
                this.vel.y -= (1 + bounce) * velDotNormal * normal.y;

                // Add flipper velocity
                this.vel.x += flipperVelAtContact.x * 0.8;
                this.vel.y += flipperVelAtContact.y * 0.8;
            }

            return true;
        }

        // Also check pivot and tip as circles
        var pivotDist = Math.sqrt(
            (this.pos.x - flipper.x) * (this.pos.x - flipper.x) +
            (this.pos.y - flipper.y) * (this.pos.y - flipper.y)
        );
        if (pivotDist < this.radius + flipper.width / 2) {
            var n = new Vec2(this.pos.x - flipper.x, this.pos.y - flipper.y).norm();
            var ov = (this.radius + flipper.width / 2) - pivotDist;
            this.pos.x += n.x * ov;
            this.pos.y += n.y * ov;
            var vdn = this.vel.dot(n);
            if (vdn < 0) {
                this.vel.x -= (1 + RESTITUTION) * vdn * n.x;
                this.vel.y -= (1 + RESTITUTION) * vdn * n.y;
            }
            return true;
        }

        return false;
    };

    // Collision with drop target (rectangle)
    Ball.prototype.collideRect = function(rect) {
        if (!rect.active) return false;

        var closestX = Math.max(rect.x, Math.min(this.pos.x, rect.x + rect.w));
        var closestY = Math.max(rect.y, Math.min(this.pos.y, rect.y + rect.h));
        var dx = this.pos.x - closestX;
        var dy = this.pos.y - closestY;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.radius) {
            var normal = dist > 0.001 ? new Vec2(dx / dist, dy / dist) : new Vec2(0, -1);
            var overlap = this.radius - dist;
            this.pos.x += normal.x * overlap;
            this.pos.y += normal.y * overlap;

            var vdn = this.vel.dot(normal);
            if (vdn < 0) {
                this.vel.x -= (1 + RESTITUTION) * vdn * normal.x;
                this.vel.y -= (1 + RESTITUTION) * vdn * normal.y;
            }
            return true;
        }
        return false;
    };

    // Flipper object
    function Flipper(x, y, length, side) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.width = 14;
        this.side = side; // 'left' or 'right'
        this.restAngle = side === 'left' ? 0.45 : Math.PI - 0.45;
        this.activeAngle = side === 'left' ? -0.55 : Math.PI + 0.55;
        this.currentAngle = this.restAngle;
        this.angularVel = 0;
        this.pressed = false;
        this.speed = 18; // radians/s for snappy response
    }

    Flipper.prototype.update = function(dt) {
        var targetAngle = this.pressed ? this.activeAngle : this.restAngle;
        var diff = targetAngle - this.currentAngle;
        var prevAngle = this.currentAngle;

        if (Math.abs(diff) > 0.01) {
            this.currentAngle += diff * Math.min(1, this.speed * dt);
        } else {
            this.currentAngle = targetAngle;
        }

        this.angularVel = dt > 0.0001 ? (this.currentAngle - prevAngle) / dt : 0;
    };

    window.PinballPhysics = {
        Vec2: Vec2,
        Ball: Ball,
        Flipper: Flipper,
        GRAVITY: GRAVITY
    };
})();
