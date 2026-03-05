/**
 * player.js — Player controller for Infinite Runner
 * Jump, double-jump, slide, collision, animation states
 */
'use strict';

const Player = (() => {
    const WIDTH = 28;
    const HEIGHT = 48;
    const SLIDE_HEIGHT = 24;
    const GRAVITY = 0.65;
    const JUMP_FORCE = -13.5;
    const DOUBLE_JUMP_FORCE = -11;
    const MAX_FALL_SPEED = 18;
    const SLIDE_DURATION = 500; // ms
    const SLIDE_COOLDOWN = 200; // ms

    let x, y, vy;
    let onGround;
    let jumpsLeft;
    let sliding;
    let slideTimer;
    let slideCooldown;
    let dead;
    let deathY;
    let groundY;
    let animFrame;
    let animTimer;
    let trailParticles;
    let invincibleTimer;

    // Running animation
    const RUN_FRAME_SPEED = 80; // ms per frame

    function init(gY) {
        groundY = gY;
        x = 120;
        y = groundY - HEIGHT;
        vy = 0;
        onGround = true;
        jumpsLeft = 2;
        sliding = false;
        slideTimer = 0;
        slideCooldown = 0;
        dead = false;
        deathY = 0;
        animFrame = 0;
        animTimer = 0;
        trailParticles = [];
        invincibleTimer = 0;
    }

    function jump() {
        if (dead) return false;
        if (sliding) return false;

        if (jumpsLeft === 2) {
            // First jump
            vy = JUMP_FORCE;
            jumpsLeft = 1;
            onGround = false;
            spawnJumpParticles();
            return true;
        } else if (jumpsLeft === 1) {
            // Double jump
            vy = DOUBLE_JUMP_FORCE;
            jumpsLeft = 0;
            spawnJumpParticles();
            return true;
        }
        return false;
    }

    function slide() {
        if (dead) return false;
        if (!onGround) return false;
        if (sliding) return false;
        if (slideCooldown > 0) return false;

        sliding = true;
        slideTimer = SLIDE_DURATION;
        return true;
    }

    function spawnJumpParticles() {
        for (let i = 0; i < 6; i++) {
            trailParticles.push({
                x: x,
                y: y + getHeight(),
                vx: -2 + Math.random() * -3,
                vy: Math.random() * -2,
                life: 1,
                size: 3 + Math.random() * 3
            });
        }
    }

    function getHeight() {
        return sliding ? SLIDE_HEIGHT : HEIGHT;
    }

    function getWidth() {
        return WIDTH;
    }

    function getBounds() {
        const h = getHeight();
        return {
            x: x - WIDTH / 2 + 4,
            y: y + (sliding ? HEIGHT - SLIDE_HEIGHT : 0),
            width: WIDTH - 8,
            height: h - 4
        };
    }

    function setWorldX(wx) {
        x = wx;
    }

    function update(dt, speed, segments) {
        if (dead) return;

        const dtMs = dt * 1000;

        // Slide timer
        if (sliding) {
            slideTimer -= dtMs;
            if (slideTimer <= 0) {
                sliding = false;
                slideCooldown = SLIDE_COOLDOWN;
            }
        }
        if (slideCooldown > 0) {
            slideCooldown -= dtMs;
        }

        // Invincibility
        if (invincibleTimer > 0) {
            invincibleTimer -= dtMs;
        }

        // Gravity
        vy += GRAVITY;
        if (vy > MAX_FALL_SPEED) vy = MAX_FALL_SPEED;
        y += vy;

        // Ground collision
        onGround = false;
        const bounds = getBounds();
        const playerLeft = x - WIDTH / 2;
        const playerRight = x + WIDTH / 2;

        for (let i = 0; i < segments.length; i++) {
            const seg = segments[i];

            if (seg.type === Terrain.GROUND) {
                // Check if player is above this ground segment
                if (playerRight > seg.x && playerLeft < seg.x + seg.width) {
                    if (y + HEIGHT >= seg.groundY && vy >= 0) {
                        y = seg.groundY - HEIGHT;
                        vy = 0;
                        onGround = true;
                        jumpsLeft = 2;
                    }
                }
            } else if (seg.type === Terrain.BARRIER) {
                // Collision with barrier
                const bx = seg.x;
                const bw = seg.width;
                const bh = seg.extra.height;
                const by = seg.groundY - bh;

                if (bounds.x + bounds.width > bx &&
                    bounds.x < bx + bw &&
                    bounds.y + bounds.height > by &&
                    bounds.y < by + bh) {
                    if (invincibleTimer <= 0) {
                        die();
                        return;
                    }
                }
            } else if (seg.type === Terrain.LOW_CEILING) {
                const ceilY = seg.extra.ceilingY;
                // If player is in ceiling zone and not sliding, die
                if (playerRight > seg.x + 10 && playerLeft < seg.x + seg.width - 10) {
                    if (!sliding && bounds.y < ceilY) {
                        if (invincibleTimer <= 0) {
                            die();
                            return;
                        }
                    }
                }
            } else if (seg.type === Terrain.GAP) {
                // Check if player is fully over gap
                if (playerLeft > seg.x && playerRight < seg.x + seg.width) {
                    // Player is over gap, no ground to land on
                    if (y + HEIGHT > seg.groundY + 20) {
                        die();
                        return;
                    }
                }
            }
        }

        // Fell off screen
        if (y > groundY + 200) {
            die();
            return;
        }

        // Running animation
        if (onGround && !sliding) {
            animTimer += dtMs;
            if (animTimer >= RUN_FRAME_SPEED) {
                animTimer -= RUN_FRAME_SPEED;
                animFrame = (animFrame + 1) % 4;
            }
        }

        // Trail particles (speed-based)
        if (speed > 6 && Math.random() < 0.3) {
            trailParticles.push({
                x: x - WIDTH / 2,
                y: y + HEIGHT / 2 + Math.random() * HEIGHT / 2 - HEIGHT / 4,
                vx: -speed * 0.3,
                vy: (Math.random() - 0.5) * 0.5,
                life: 1,
                size: 2 + Math.random() * 2
            });
        }

        // Update trail particles
        for (let i = trailParticles.length - 1; i >= 0; i--) {
            const p = trailParticles[i];
            p.x += p.vx * dt * 60;
            p.y += p.vy * dt * 60;
            p.life -= dt * 3;
            if (p.life <= 0) {
                trailParticles.splice(i, 1);
            }
        }
    }

    function die() {
        dead = true;
        deathY = y;
        vy = JUMP_FORCE * 0.7;
    }

    function updateDeath(dt) {
        if (!dead) return;
        vy += GRAVITY * 0.5;
        deathY += vy;
    }

    function isAlive() {
        return !dead;
    }

    function getState() {
        return {
            x, y, vy,
            width: WIDTH,
            height: HEIGHT,
            slideHeight: SLIDE_HEIGHT,
            onGround,
            sliding,
            dead,
            deathY,
            animFrame,
            jumpsLeft,
            trailParticles,
            invincibleTimer
        };
    }

    return {
        init,
        jump,
        slide,
        setWorldX,
        update,
        updateDeath,
        isAlive,
        getBounds,
        getHeight,
        getWidth,
        getState
    };
})();
