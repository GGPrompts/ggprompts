// ── Stick Fight Engine ─────────────────────────────────────────────
// Shared skeleton + pose + ragdoll toolkit for stick-figure music videos.
// Load via <script src="stick-fight-engine.js"></script> before your renderer.
// ES5 IIFE — exposes window.StickFight
//
// Usage:
//   var fig = StickFight.create({ x: 100, y: 400, figH: 120, facing: 1, color: '#8898c8' });
//   StickFight.setPose(fig, 'guard');
//   StickFight.updateAll([fig], dt);
//   StickFight.drawAll(ctx, [fig]);

(function() {
    "use strict";

    // ── Bone proportions (fractions of figH) ──────────────────────────
    var BONE = {
        headR:    0.07,
        neck:     0.06,
        shoulder: 0.09,
        torso:    0.28,
        upperArm: 0.13,
        forearm:  0.12,
        thigh:    0.20,
        shin:     0.19
    };

    // ── Pose parameter defaults ───────────────────────────────────────
    function defaultParams() {
        return {
            bounce:    0,      // -1..1  vertical bob
            lean:      0,      // -1..1  torso lean (positive = forward)
            armLAngle: 0.4,    // radians from shoulder-down, left arm
            armRAngle: 0.4,    // radians from shoulder-down, right arm
            elbowLBend: 0.3,   // 0..1  forearm bend
            elbowRBend: 0.3,
            legSpread:  0,     // 0..1  stance width
            kneeL:      0,     // -1..1 knee offset (negative = forward)
            kneeR:      0,
            legLStride: 0,     // -1..1 left foot forward/back (positive = forward in facing dir)
            legRStride: 0,     // -1..1 right foot forward/back
            legLLift:   0,     // 0..1  left foot lift off ground
            legRLift:   0,     // 0..1  right foot lift off ground
            torsoTwist: 0,     // -1..1  shoulder twist around spine axis
            hipShift:   0,     // -1..1  lateral hip displacement
            headTilt:   0,     // -1..1  head tilt left/right
            headBob:    0,     // -1..1  head nod up/down
            swordAngle: 0,     // radians, if the figure holds a weapon
            swordLen:   0      // 0 = no sword, fraction of figH
        };
    }

    // ── Named pose library ────────────────────────────────────────────
    var POSES = {
        idle: {
            bounce: 0, lean: 0,
            armLAngle: 0.4, armRAngle: 0.4,
            elbowLBend: 0.3, elbowRBend: 0.3,
            legSpread: 0.1, kneeL: 0, kneeR: 0
        },
        guard: {
            bounce: -0.05, lean: 0.15,
            armLAngle: -0.8, armRAngle: -0.6,
            elbowLBend: 0.6, elbowRBend: 0.5,
            legSpread: 0.3, kneeL: -0.1, kneeR: 0,
            swordAngle: -0.8
        },
        lunge: {
            bounce: -0.1, lean: 0.5,
            armLAngle: -0.1, armRAngle: 0.2,
            elbowLBend: 0.15, elbowRBend: 0.2,
            legSpread: 0.6, kneeL: -0.3, kneeR: 0.1,
            swordAngle: -0.1
        },
        punch: {
            bounce: -0.05, lean: 0.35,
            armLAngle: -0.5, armRAngle: -0.9,
            elbowLBend: 0.4, elbowRBend: 0.05,
            legSpread: 0.35, kneeL: -0.15, kneeR: 0
        },
        kick: {
            bounce: 0.05, lean: -0.15,
            armLAngle: -0.3, armRAngle: -0.2,
            elbowLBend: 0.4, elbowRBend: 0.5,
            legSpread: 0.5, kneeL: -0.6, kneeR: 0.1
        },
        block: {
            bounce: -0.05, lean: 0.05,
            armLAngle: -1.1, armRAngle: -0.5,
            elbowLBend: 0.85, elbowRBend: 0.4,
            legSpread: 0.25, kneeL: -0.05, kneeR: 0.05,
            swordAngle: -1.5
        },
        recoil: {
            bounce: 0.05, lean: -0.2,
            armLAngle: -0.3, armRAngle: -0.3,
            elbowLBend: 0.5, elbowRBend: 0.4,
            legSpread: 0.2, kneeL: 0.05, kneeR: 0.1,
            swordAngle: 0.3
        },
        dance_basic: {
            bounce: 0.2, lean: 0,
            armLAngle: -0.3, armRAngle: -0.3,
            elbowLBend: 0.5, elbowRBend: 0.5,
            legSpread: 0.15, kneeL: -0.1, kneeR: -0.1
        },
        arms_up: {
            bounce: 0.1, lean: 0,
            armLAngle: -1.2, armRAngle: -1.2,
            elbowLBend: 0.3, elbowRBend: 0.3,
            legSpread: 0.1, kneeL: 0, kneeR: 0
        },
        kneel: {
            bounce: -0.3, lean: 0.1,
            armLAngle: 0.5, armRAngle: 0.3,
            elbowLBend: 0.4, elbowRBend: 0.5,
            legSpread: 0.2, kneeL: 0.4, kneeR: 0.5
        },
        fallen: {
            bounce: -0.5, lean: 0.6,
            armLAngle: 0.8, armRAngle: 1.0,
            elbowLBend: 0.2, elbowRBend: 0.1,
            legSpread: 0.4, kneeL: 0.3, kneeR: 0.2
        },
        salute: {
            bounce: 0, lean: 0,
            armLAngle: -1.0, armRAngle: 0.3,
            elbowLBend: 0.15, elbowRBend: 0.4,
            legSpread: 0.05, kneeL: 0, kneeR: 0,
            swordAngle: -1.5
        },

        // ── Run cycle (4 key poses, alternate L/R for full cycle) ────
        run_contact: {
            // Front foot plants, back leg trailing
            bounce: -0.08, lean: 0.25,
            armLAngle: -0.9, armRAngle: 0.6,
            elbowLBend: 0.6, elbowRBend: 0.5,
            legSpread: 0.05, kneeL: -0.2, kneeR: 0.15,
            legLStride: 0.7, legRStride: -0.6,
            legLLift: 0, legRLift: 0.05
        },
        run_down: {
            // Absorbing impact, body dips on front leg
            bounce: -0.2, lean: 0.2,
            armLAngle: -0.6, armRAngle: 0.3,
            elbowLBend: 0.5, elbowRBend: 0.5,
            legSpread: 0.05, kneeL: -0.3, kneeR: 0.1,
            legLStride: 0.4, legRStride: -0.35,
            legLLift: 0, legRLift: 0.1
        },
        run_pass: {
            // Legs crossing under body, back leg swings forward
            bounce: -0.05, lean: 0.15,
            armLAngle: -0.2, armRAngle: -0.2,
            elbowLBend: 0.5, elbowRBend: 0.5,
            legSpread: 0.02, kneeL: -0.1, kneeR: -0.3,
            legLStride: 0.05, legRStride: 0.05,
            legLLift: 0, legRLift: 0.35
        },
        run_flight: {
            // Both feet off ground, body at highest point
            bounce: 0.1, lean: 0.2,
            armLAngle: 0.5, armRAngle: -0.8,
            elbowLBend: 0.5, elbowRBend: 0.6,
            legSpread: 0.03, kneeL: 0.1, kneeR: -0.25,
            legLStride: -0.5, legRStride: 0.6,
            legLLift: 0.15, legRLift: 0.25
        },

        // ── Walk cycle (4 key poses) ─────────────────────────────────
        walk_contact: {
            // Front heel strikes, arms opposite to legs
            bounce: 0, lean: 0.1,
            armLAngle: -0.5, armRAngle: 0.4,
            elbowLBend: 0.35, elbowRBend: 0.3,
            legSpread: 0.05, kneeL: -0.05, kneeR: 0.05,
            legLStride: 0.45, legRStride: -0.4,
            legLLift: 0, legRLift: 0
        },
        walk_down: {
            // Weight transfers onto front foot, slight dip
            bounce: -0.08, lean: 0.08,
            armLAngle: -0.3, armRAngle: 0.2,
            elbowLBend: 0.35, elbowRBend: 0.3,
            legSpread: 0.05, kneeL: -0.15, kneeR: 0.05,
            legLStride: 0.3, legRStride: -0.25,
            legLLift: 0, legRLift: 0
        },
        walk_pass: {
            // Back leg passes under body
            bounce: 0.04, lean: 0.05,
            armLAngle: -0.1, armRAngle: -0.1,
            elbowLBend: 0.3, elbowRBend: 0.3,
            legSpread: 0.02, kneeL: -0.05, kneeR: -0.15,
            legLStride: 0.05, legRStride: 0.05,
            legLLift: 0, legRLift: 0.15
        },
        walk_push: {
            // Back foot pushes off, front leg reaches
            bounce: 0.02, lean: 0.1,
            armLAngle: 0.3, armRAngle: -0.4,
            elbowLBend: 0.3, elbowRBend: 0.35,
            legSpread: 0.05, kneeL: 0.05, kneeR: -0.05,
            legLStride: -0.35, legRStride: 0.4,
            legLLift: 0.05, legRLift: 0
        }
    };

    // ── Helpers ────────────────────────────────────────────────────────
    function lerpExp(cur, tgt, speed, dt) {
        return cur + (tgt - cur) * (1 - Math.exp(-speed * dt));
    }

    // ── Segment-vs-segment closest point distance ─────────────────────
    // Returns { dist, pointA: {x,y}, pointB: {x,y} } where pointA is on
    // segment (a1→a2) and pointB is on segment (b1→b2).
    function segmentDistance(a1, a2, b1, b2) {
        var dAx = a2.x - a1.x, dAy = a2.y - a1.y;
        var dBx = b2.x - b1.x, dBy = b2.y - b1.y;
        var rABx = a1.x - b1.x, rABy = a1.y - b1.y;

        var lenA2 = dAx * dAx + dAy * dAy;
        var lenB2 = dBx * dBx + dBy * dBy;
        var f = dBx * rABx + dBy * rABy;

        var s, t;
        var EPS = 1e-8;

        if (lenA2 < EPS && lenB2 < EPS) {
            // Both degenerate to points
            s = 0; t = 0;
        } else if (lenA2 < EPS) {
            // Segment A is a point
            s = 0;
            t = f / lenB2;
            if (t < 0) t = 0; else if (t > 1) t = 1;
        } else {
            var c = dAx * rABx + dAy * rABy;
            if (lenB2 < EPS) {
                // Segment B is a point
                t = 0;
                s = -c / lenA2;
                if (s < 0) s = 0; else if (s > 1) s = 1;
            } else {
                // General case
                var b = dAx * dBx + dAy * dBy;
                var denom = lenA2 * lenB2 - b * b;

                if (denom > EPS) {
                    s = (b * f - c * lenB2) / denom;
                    if (s < 0) s = 0; else if (s > 1) s = 1;
                } else {
                    s = 0;
                }

                t = (b * s + f) / lenB2;

                if (t < 0) {
                    t = 0;
                    s = -c / lenA2;
                    if (s < 0) s = 0; else if (s > 1) s = 1;
                } else if (t > 1) {
                    t = 1;
                    s = (b - c) / lenA2;
                    if (s < 0) s = 0; else if (s > 1) s = 1;
                }
            }
        }

        var pAx = a1.x + dAx * s;
        var pAy = a1.y + dAy * s;
        var pBx = b1.x + dBx * t;
        var pBy = b1.y + dBy * t;
        var dx = pAx - pBx;
        var dy = pAy - pBy;

        return {
            dist: Math.sqrt(dx * dx + dy * dy),
            pointA: { x: pAx, y: pAy },
            pointB: { x: pBx, y: pBy }
        };
    }

    // ── Point-to-segment distance ─────────────────────────────────────
    // Returns { dist, closest: {x,y} } — closest point on segment (s1→s2) to point p.
    function pointSegmentDist(p, s1, s2) {
        var dx = s2.x - s1.x, dy = s2.y - s1.y;
        var len2 = dx * dx + dy * dy;
        var t;
        if (len2 < 1e-8) {
            t = 0;
        } else {
            t = ((p.x - s1.x) * dx + (p.y - s1.y) * dy) / len2;
            if (t < 0) t = 0; else if (t > 1) t = 1;
        }
        var cx = s1.x + dx * t;
        var cy = s1.y + dy * t;
        var ex = p.x - cx, ey = p.y - cy;
        return {
            dist: Math.sqrt(ex * ex + ey * ey),
            closest: { x: cx, y: cy }
        };
    }

    // ── Stance / handedness helpers ──────────────────────────────────
    // resolveHand(fig, 'lead') → 'L' or 'R' based on fig.leadSide
    // resolveHand(fig, 'rear') → opposite of lead
    function resolveHand(fig, which) {
        var leadIsLeft = (fig.leadSide || 'left') === 'left';
        if (which === 'lead') return leadIsLeft ? 'L' : 'R';
        return leadIsLeft ? 'R' : 'L';  // rear
    }

    // Swap L↔R references in pose property names within keyframes.
    // e.g. { armLAngle: -0.1, elbowRBend: 0.4 }
    //    → { armRAngle: -0.1, elbowLBend: 0.4 }
    // Returns a new array (does not mutate the original).
    var _mirrorMap = {
        armLAngle: 'armRAngle', armRAngle: 'armLAngle',
        elbowLBend: 'elbowRBend', elbowRBend: 'elbowLBend',
        kneeL: 'kneeR', kneeR: 'kneeL',
        legLStride: 'legRStride', legRStride: 'legLStride',
        legLLift: 'legRLift', legRLift: 'legLLift'
    };

    function mirrorKeyframes(keyframes) {
        var out = [];
        for (var i = 0; i < keyframes.length; i++) {
            var kf = keyframes[i];
            var newPose = {};
            for (var k in kf.pose) {
                if (kf.pose.hasOwnProperty(k)) {
                    var mapped = _mirrorMap[k] || k;
                    newPose[mapped] = kf.pose[k];
                }
            }
            out.push({ t: kf.t, pose: newPose });
        }
        return out;
    }

    // ── Locomotion constants ────────────────────────────────────────
    var GAIT = {
        velocityThreshold: 2,     // px/s below which gait influence fades out
        velocityFadeRange: 20,    // px/s range over which gait blends in (threshold to threshold+range)
        strideLength:      0.45,  // fraction of figH per full gait cycle
        pelvisSwayAmount:  0.018, // fraction of figH for lateral hip offset
        shoulderTwistAmount: 0.012, // fraction of figH for shoulder y offset
        legLiftHeight:     0.06,  // fraction of figH for swing foot lift
        kneeForward:       0.12,  // fraction of figH for knee forward push
        footPlantBlend:    12     // lerp speed for foot-plant correction
    };

    // ── Create figure ─────────────────────────────────────────────────
    function create(opts) {
        opts = opts || {};
        var p = defaultParams();
        var t = defaultParams();
        return {
            // position & identity
            x:      opts.x      || 0,
            y:      opts.y      || 0,       // ground-level y (feet)
            figH:   opts.figH   || 100,
            facing: opts.facing || 1,       // 1 = right, -1 = left
            color:  opts.color  || '#ffffff',
            lineWidth: opts.lineWidth || 3,

            // pose animation
            params:  p,
            targets: t,
            poseSpeed: opts.poseSpeed || 10,   // lerp speed (higher = snappier)

            // mode: 'pose' or 'ragdoll'
            mode: 'pose',
            ragdoll: null,

            // locomotion state
            velocity:    0,       // current lateral velocity (px/s), computed each frame
            lastX:       opts.x || 0,  // previous frame x for velocity computation
            gaitPhase:   0,       // 0..1 gait cycle position
            gaitInfluence: 0,     // 0..1 blend weight (fades in/out with velocity)
            plantFootLX: opts.x || 0,  // world-x of left foot plant position
            plantFootRX: opts.x || 0,  // world-x of right foot plant position

            // stance / handedness
            weaponHand:  opts.weaponHand || 'left',   // 'left' or 'right' — which hand holds the weapon
            leadSide:    opts.leadSide   || 'left',   // 'left' or 'right' — forward foot/arm in stance

            // combat state
            hp:          opts.hp || 100,
            attacking:   null,
            combo:       0,
            lastHitTime: 0,
            lastContact: null
        };
    }

    // ── Compute 13 joint positions ────────────────────────────────────
    // Returns positions relative to (0,0) at the figure's feet.
    // y-axis: negative is up (canvas convention).
    function computeJoints(fig) {
        var p = fig.params;
        var fH = fig.figH;
        var facing = fig.facing;

        // Scaled bone lengths
        var headR    = BONE.headR    * fH;
        var neckLen  = BONE.neck     * fH;
        var shouldW  = BONE.shoulder * fH;
        var torsoLen = BONE.torso    * fH;
        var uArm     = BONE.upperArm * fH;
        var fArm     = BONE.forearm  * fH;
        var thigh    = BONE.thigh    * fH;
        var shin     = BONE.shin     * fH;

        var bounceOff = p.bounce * fH * 0.06;
        var leanOff   = p.lean   * fH * 0.08 * facing;

        // Leg spread in pixels
        var spread = p.legSpread * fH * 0.15;

        // ── Locomotion gait computation ──────────────────────────
        // gaitInfluence is 0 when stationary, blending to 1 at speed.
        // When 0, all gait offsets are zero → identical to old behavior.
        var gi = fig.gaitInfluence || 0;
        var phase = fig.gaitPhase || 0;
        var twoPi = Math.PI * 2;

        // Sine waves for gait cycle
        // phase 0..1 maps to one full stride (two steps).
        // Left foot plants during phase 0..0.5, right during 0.5..1.
        var sinPhase  = Math.sin(phase * twoPi);       // oscillates +-1
        var cosPhase  = Math.cos(phase * twoPi);       // for secondary motion
        var sinHalf   = Math.sin(phase * twoPi * 2);   // double-frequency for vertical bob

        // Movement direction: +1 if moving in facing dir, -1 if backing up
        var moveDir = (fig.velocity || 0) >= 0 ? 1 : -1;
        // Flip stride direction based on actual movement vs facing
        var strideDir = facing * moveDir;

        // Per-foot stride offsets (forward/back from neutral ankle position)
        // Left foot: forward during phase 0.25, back during 0.75
        // Right foot: opposite (forward during 0.75, back during 0.25)
        var strideAmount = GAIT.kneeForward * fH * gi;
        var liftAmount   = GAIT.legLiftHeight * fH * gi;

        // Left foot: sinPhase positive = forward swing, negative = planted
        var leftSwingFwd  =  sinPhase;   // +1 at phase=0.25, -1 at phase=0.75
        var rightSwingFwd = -sinPhase;   // opposite

        // Foot lift: only when swinging forward (positive half of sin)
        // Use sin^2 for smoother lift shape, only during swing
        var leftLift  = Math.max(0, sinPhase)  * Math.max(0, sinPhase);
        var rightLift = Math.max(0, -sinPhase) * Math.max(0, -sinPhase);

        // Pelvis lateral sway: shift over the planted foot
        var pelvisSwayPx = GAIT.pelvisSwayAmount * fH * gi * sinPhase;

        // Shoulder counter-rotation: opposite to pelvis
        var shoulderTwistPx = GAIT.shoulderTwistAmount * fH * gi * sinPhase;

        // Vertical bob from gait (subtle, double-frequency)
        var gaitBounce = -Math.abs(sinHalf) * 0.015 * fH * gi;

        // ── Per-leg stride & lift from pose params ────────────────
        var poseStrideL = (p.legLStride || 0) * fH * 0.18 * facing;
        var poseStrideR = (p.legRStride || 0) * fH * 0.18 * facing;
        var poseLiftL   = (p.legLLift   || 0) * fH * 0.15;
        var poseLiftR   = (p.legRLift   || 0) * fH * 0.15;

        // ── Base ankle positions ─────────────────────────────────
        var ankleL = {
            x: -spread - fH * 0.02 + leftSwingFwd  * strideAmount * strideDir + poseStrideL,
            y: 0 - leftLift * liftAmount - poseLiftL
        };
        var ankleR = {
            x:  spread + fH * 0.02 + rightSwingFwd * strideAmount * strideDir + poseStrideR,
            y: 0 - rightLift * liftAmount - poseLiftR
        };

        // ── Anti-slide: foot planting ────────────────────────────
        // During each foot's plant phase, lock its world-x to where it
        // first touched down, then express that as a local offset.
        if (gi > 0.01) {
            // Left foot plants when sinPhase < 0 (phase 0.5..1.0 region)
            var leftPlanting  = sinPhase < -0.05;
            var rightPlanting = sinPhase >  0.05;

            // Max correction distance — prevents extreme stretching from
            // stale plant positions (e.g. after resize or scene teleport)
            var maxPlant = fH * 0.3;

            if (leftPlanting) {
                // Correct ankle local-x so world-x stays at plantFootLX
                var desiredLocalLX = fig.plantFootLX - fig.x;
                if (desiredLocalLX < -maxPlant) desiredLocalLX = -maxPlant;
                if (desiredLocalLX >  maxPlant) desiredLocalLX =  maxPlant;
                ankleL.x = ankleL.x * (1 - gi) + desiredLocalLX * gi;
            } else {
                // Foot is swinging — update plant position for when it next lands
                fig.plantFootLX = fig.x + ankleL.x;
            }

            if (rightPlanting) {
                var desiredLocalRX = fig.plantFootRX - fig.x;
                if (desiredLocalRX < -maxPlant) desiredLocalRX = -maxPlant;
                if (desiredLocalRX >  maxPlant) desiredLocalRX =  maxPlant;
                ankleR.x = ankleR.x * (1 - gi) + desiredLocalRX * gi;
            } else {
                fig.plantFootRX = fig.x + ankleR.x;
            }
        }

        // ── Knees ────────────────────────────────────────────────
        var kneeBaseY = -shin + bounceOff + gaitBounce;
        var kneeL = {
            x: ankleL.x * 0.6 + leanOff * 0.3 - p.kneeL * fH * 0.06 * facing,
            y: kneeBaseY + Math.abs(p.kneeL) * fH * 0.03
                - leftLift * liftAmount * 0.7
        };
        var kneeR = {
            x: ankleR.x * 0.6 + leanOff * 0.3 - p.kneeR * fH * 0.06 * facing,
            y: kneeBaseY + Math.abs(p.kneeR) * fH * 0.03
                - rightLift * liftAmount * 0.7
        };

        // ── Hip (with pelvis sway + hipShift) ─────────────────────
        var hipY = kneeBaseY - thigh + bounceOff + gaitBounce;
        var hipShiftPx = p.hipShift * fH * 0.05;
        var hip = { x: leanOff + pelvisSwayPx + hipShiftPx, y: hipY };

        // ── Neck ─────────────────────────────────────────────────
        var neckY = hipY - torsoLen;
        var neck = { x: leanOff * 1.2 + pelvisSwayPx * 0.3, y: neckY };

        // Head (with headTilt + headBob)
        var headTiltPx = p.headTilt * fH * 0.04;
        var headBobPx  = p.headBob  * fH * 0.03;
        var head = { x: leanOff * 1.3 + pelvisSwayPx * 0.2 + headTiltPx, y: neckY - neckLen - headR + headBobPx };

        // ── Shoulders (with counter-rotation + torsoTwist) ────────
        var twistPx = p.torsoTwist * shouldW * 0.5;
        var shY = neckY + neckLen * 0.3;
        var shoulderL = { x: neck.x - shouldW + twistPx, y: shY + shoulderTwistPx };
        var shoulderR = { x: neck.x + shouldW - twistPx, y: shY - shoulderTwistPx };

        // Arms — angles from straight-down (0 = hanging), negative = forward/up
        var laAng = p.armLAngle;
        var raAng = p.armRAngle;

        var elbowL = {
            x: shoulderL.x - Math.sin(laAng) * uArm * facing,
            y: shoulderL.y + Math.cos(laAng) * uArm
        };
        var elbowR = {
            x: shoulderR.x - Math.sin(raAng) * uArm * facing,
            y: shoulderR.y + Math.cos(raAng) * uArm
        };

        var lBend = laAng + p.elbowLBend * 1.2;
        var rBend = raAng + p.elbowRBend * 1.2;
        var handL = {
            x: elbowL.x - Math.sin(lBend) * fArm * facing,
            y: elbowL.y + Math.cos(lBend) * fArm
        };
        var handR = {
            x: elbowR.x - Math.sin(rBend) * fArm * facing,
            y: elbowR.y + Math.cos(rBend) * fArm
        };

        return {
            head: head, headR: headR,
            neck: neck,
            shoulderL: shoulderL, shoulderR: shoulderR,
            elbowL: elbowL, elbowR: elbowR,
            handL: handL, handR: handR,
            hip: hip,
            kneeL: kneeL, kneeR: kneeR,
            ankleL: ankleL, ankleR: ankleR
        };
    }

    // ── Draw a posed figure ───────────────────────────────────────────
    function drawFigure(ctx, fig, joints) {
        if (!joints) joints = computeJoints(fig);
        var color = fig.color;
        var lw = fig.lineWidth;

        ctx.save();
        ctx.translate(fig.x, fig.y);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;

        function line(a, b) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        }

        // Torso
        line(joints.hip, joints.neck);

        // Legs
        line(joints.hip,   joints.kneeL);
        line(joints.kneeL, joints.ankleL);
        line(joints.hip,   joints.kneeR);
        line(joints.kneeR, joints.ankleR);

        // Shoulders
        line(joints.shoulderL, joints.shoulderR);

        // Arms
        line(joints.shoulderL, joints.elbowL);
        line(joints.elbowL,    joints.handL);
        line(joints.shoulderR, joints.elbowR);
        line(joints.elbowR,    joints.handR);

        // Head
        ctx.beginPath();
        ctx.arc(joints.head.x, joints.head.y, joints.headR, 0, Math.PI * 2);
        ctx.stroke();

        // Weapon (if any)
        if (fig.params.swordLen > 0) {
            var sLen = fig.params.swordLen * fig.figH;
            var sAng = fig.params.swordAngle;
            var hand = (fig.weaponHand === 'right') ? joints.handR : joints.handL;
            var tipX = hand.x + Math.cos(sAng) * sLen * fig.facing;
            var tipY = hand.y + Math.sin(sAng) * sLen;

            ctx.strokeStyle = '#c0c8e0';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#e0e8ff';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.moveTo(hand.x, hand.y);
            ctx.lineTo(tipX, tipY);
            ctx.stroke();

            // Guard crossbar
            var gLen = fig.figH * 0.03;
            var gAng = sAng + Math.PI * 0.5;
            ctx.lineWidth = 2;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(hand.x + Math.cos(gAng) * gLen, hand.y + Math.sin(gAng) * gLen);
            ctx.lineTo(hand.x - Math.cos(gAng) * gLen, hand.y - Math.sin(gAng) * gLen);
            ctx.stroke();
        }

        ctx.restore();
    }

    // ── Set a named pose ──────────────────────────────────────────────
    function setPose(fig, name) {
        var pose = POSES[name];
        if (!pose) return;
        var t = fig.targets;
        for (var k in pose) {
            if (pose.hasOwnProperty(k)) {
                t[k] = pose[k];
            }
        }
    }

    // ── Set individual target parameter ───────────────────────────────
    function setTarget(fig, key, val) {
        fig.targets[key] = val;
    }

    // ── Update (lerp params toward targets) ───────────────────────────
    function updateFigure(fig, dt) {
        if (fig.mode === 'ragdoll') {
            if (fig.ragdoll) stepRagdoll(fig.ragdoll, dt);
            return;
        }

        // ── Locomotion: compute velocity and advance gait ──
        var dx = fig.x - fig.lastX;
        fig.velocity = dt > 0 ? dx / dt : 0;
        fig.lastX = fig.x;

        var absVel = Math.abs(fig.velocity);
        var threshold = GAIT.velocityThreshold;
        var fadeRange = GAIT.velocityFadeRange;

        // Compute target gait influence (0..1 blend)
        var targetInfluence = 0;
        if (absVel > threshold) {
            targetInfluence = Math.min((absVel - threshold) / fadeRange, 1);
        }
        // Smooth the influence to avoid popping
        fig.gaitInfluence = lerpExp(fig.gaitInfluence, targetInfluence, 8, dt);

        // Advance gait phase proportional to distance traveled
        if (fig.gaitInfluence > 0.01) {
            var stridePixels = GAIT.strideLength * fig.figH;
            var distThisFrame = Math.abs(dx);
            fig.gaitPhase += distThisFrame / stridePixels;
            fig.gaitPhase -= Math.floor(fig.gaitPhase); // wrap to 0..1
        }

        // Drive attack animation if active
        if (fig.attacking) {
            updateAttack(fig, dt);
        }
        var speed = fig.poseSpeed;
        var p = fig.params;
        var t = fig.targets;
        for (var k in p) {
            if (p.hasOwnProperty(k) && t.hasOwnProperty(k) && typeof p[k] === 'number') {
                p[k] = lerpExp(p[k], t[k], speed, dt);
            }
        }
    }

    // ── Batch helpers ─────────────────────────────────────────────────
    function updateAll(figs, dt) {
        for (var i = 0; i < figs.length; i++) {
            updateFigure(figs[i], dt);
        }
    }

    function drawAll(ctx, figs) {
        for (var i = 0; i < figs.length; i++) {
            var fig = figs[i];
            if (fig.mode === 'ragdoll' && fig.ragdoll) {
                drawRagdoll(ctx, fig);
            } else {
                drawFigure(ctx, fig, computeJoints(fig));
            }
        }
    }

    // ══════════════════════════════════════════════════════════════════
    //  PHASE 2 — Ragdoll Physics (Verlet point-mass)
    // ══════════════════════════════════════════════════════════════════

    // Joint name order — must match constraint pairs
    var JOINT_NAMES = [
        'head', 'neck', 'shoulderL', 'shoulderR',
        'elbowL', 'elbowR', 'handL', 'handR',
        'hip', 'kneeL', 'kneeR', 'ankleL', 'ankleR'
    ];

    // Constraint pairs: indices into JOINT_NAMES
    var CONSTRAINTS = [
        [0, 1],   // head-neck
        [1, 2],   // neck-shoulderL
        [1, 3],   // neck-shoulderR
        [2, 4],   // shoulderL-elbowL
        [3, 5],   // shoulderR-elbowR
        [4, 6],   // elbowL-handL
        [5, 7],   // elbowR-handR
        [1, 8],   // neck-hip  (torso)
        [8, 9],   // hip-kneeL
        [8, 10],  // hip-kneeR
        [9, 11],  // kneeL-ankleL
        [10, 12]  // kneeR-ankleR
    ];

    function createPoint(x, y) {
        return { x: x, y: y, px: x, py: y };
    }

    // ── Go ragdoll ────────────────────────────────────────────────────
    // Snapshots current joint positions into Verlet point masses.
    function goRagdoll(fig, groundY, impulseX, impulseY) {
        var joints = computeJoints(fig);
        var pts = [];
        var dists = [];

        // Create points (world coords)
        for (var i = 0; i < JOINT_NAMES.length; i++) {
            var name = JOINT_NAMES[i];
            var j = joints[name];
            var pt = createPoint(fig.x + j.x, fig.y + j.y);
            // Apply impulse (slightly random per point for tumble)
            var jitter = 0.7 + Math.random() * 0.6;
            pt.px = pt.x - (impulseX || 0) * 0.016 * jitter;
            pt.py = pt.y - (impulseY || 0) * 0.016 * jitter;
            pts.push(pt);
        }

        // Measure rest distances for each constraint
        for (var c = 0; c < CONSTRAINTS.length; c++) {
            var a = pts[CONSTRAINTS[c][0]];
            var b = pts[CONSTRAINTS[c][1]];
            var dx = b.x - a.x;
            var dy = b.y - a.y;
            dists.push(Math.sqrt(dx * dx + dy * dy));
        }

        var rdoll = {
            pts: pts,
            dists: dists,
            groundY: groundY,
            gravity: 1200,
            bounce: 0.3,
            friction: 0.85,
            headR: joints.headR,
            settled: false,
            settleTimer: 0
        };

        fig.mode = 'ragdoll';
        fig.ragdoll = rdoll;
        return rdoll;
    }

    // ── Step ragdoll ──────────────────────────────────────────────────
    function stepRagdoll(rdoll, dt) {
        if (rdoll.settled) return;

        var pts = rdoll.pts;
        var g = rdoll.gravity;
        var groundY = rdoll.groundY;
        var bounce = rdoll.bounce;
        var friction = rdoll.friction;

        // Verlet integration
        for (var i = 0; i < pts.length; i++) {
            var p = pts[i];
            var vx = p.x - p.px;
            var vy = p.y - p.py;
            p.px = p.x;
            p.py = p.y;
            p.x += vx * 0.99;   // slight damping
            p.y += vy * 0.99 + g * dt * dt;
        }

        // Constraint projection (6 iterations)
        for (var iter = 0; iter < 6; iter++) {
            for (var c = 0; c < CONSTRAINTS.length; c++) {
                var ai = CONSTRAINTS[c][0];
                var bi = CONSTRAINTS[c][1];
                var a = pts[ai];
                var b = pts[bi];
                var dx = b.x - a.x;
                var dy = b.y - a.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                var target = rdoll.dists[c];
                if (dist < 0.001) dist = 0.001;
                var diff = (dist - target) / dist * 0.5;
                var ox = dx * diff;
                var oy = dy * diff;
                a.x += ox;
                a.y += oy;
                b.x -= ox;
                b.y -= oy;
            }
        }

        // Ground collision
        var totalVel = 0;
        for (var gi = 0; gi < pts.length; gi++) {
            var p2 = pts[gi];
            if (p2.y > groundY) {
                p2.y = groundY;
                var vy2 = p2.y - p2.py;
                p2.py = p2.y + vy2 * bounce;
                // Friction on horizontal
                var vx2 = p2.x - p2.px;
                p2.px = p2.x - vx2 * friction;
            }
            // Measure total velocity for settle detection
            var dvx = p2.x - p2.px;
            var dvy = p2.y - p2.py;
            totalVel += dvx * dvx + dvy * dvy;
        }

        // Settle detection
        if (totalVel < 0.5) {
            rdoll.settleTimer += dt;
            if (rdoll.settleTimer > 0.5) {
                rdoll.settled = true;
            }
        } else {
            rdoll.settleTimer = 0;
        }
    }

    // ── Draw ragdoll ──────────────────────────────────────────────────
    function drawRagdoll(ctx, fig) {
        var rdoll = fig.ragdoll;
        if (!rdoll) return;
        var pts = rdoll.pts;
        var color = fig.color;
        var lw = fig.lineWidth;

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;

        // Draw each constraint as a line
        for (var c = 0; c < CONSTRAINTS.length; c++) {
            var a = pts[CONSTRAINTS[c][0]];
            var b = pts[CONSTRAINTS[c][1]];
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        }

        // Head circle
        var headPt = pts[0];
        ctx.beginPath();
        ctx.arc(headPt.x, headPt.y, rdoll.headR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    // ══════════════════════════════════════════════════════════════════
    //  PHASE 3 — Combat System
    // ══════════════════════════════════════════════════════════════════

    // ── Target hit zones ─────────────────────────────────────────────
    // Each zone defines one or more body segments on the target, plus
    // a damage multiplier.  Segments reference joint names from computeJoints.
    // 'radius' (optional) adds a sphere test around the endpoint (for head).
    var HIT_ZONES = {
        head:  { segments: [['neck', 'head']], radiusJoint: 'head', radiusKey: 'headR', dmgMul: 1.5 },
        torso: { segments: [['hip', 'neck']], dmgMul: 1.0 },
        armL:  { segments: [['shoulderL', 'elbowL'], ['elbowL', 'handL']], dmgMul: 0.7 },
        armR:  { segments: [['shoulderR', 'elbowR'], ['elbowR', 'handR']], dmgMul: 0.7 },
        legL:  { segments: [['hip', 'kneeL'], ['kneeL', 'ankleL']], dmgMul: 0.7 },
        legR:  { segments: [['hip', 'kneeR'], ['kneeR', 'ankleR']], dmgMul: 0.7 }
    };

    // Zone check order — head first so headshots are prioritised when equidistant
    var HIT_ZONE_ORDER = ['head', 'torso', 'armL', 'armR', 'legL', 'legR'];

    // ── Move Library ─────────────────────────────────────────────────
    var MOVES = {
        punch_r: {
            duration: 0.22, hitAt: 0.12, hitRange: 0.18,
            damage: 15, impulseX: 400, impulseY: -150,
            keyframes: [
                { t: 0.0,  pose: { lean: 0.1, armRAngle: -0.4, elbowRBend: 0.7 } },
                { t: 0.45, pose: { lean: 0.35, armRAngle: -0.9, elbowRBend: 0.05 } },
                { t: 0.75, pose: { lean: 0.35, armRAngle: -0.9, elbowRBend: 0.05 } },
                { t: 1.0,  pose: { lean: 0.1, armRAngle: -0.4, elbowRBend: 0.3 } }
            ]
        },
        punch_l: {
            duration: 0.22, hitAt: 0.12, hitRange: 0.18,
            damage: 15, impulseX: 400, impulseY: -150,
            keyframes: [
                { t: 0.0,  pose: { lean: 0.1, armLAngle: -0.4, elbowLBend: 0.7 } },
                { t: 0.45, pose: { lean: 0.35, armLAngle: -0.9, elbowLBend: 0.05 } },
                { t: 0.75, pose: { lean: 0.35, armLAngle: -0.9, elbowLBend: 0.05 } },
                { t: 1.0,  pose: { lean: 0.1, armLAngle: -0.4, elbowLBend: 0.3 } }
            ]
        },
        kick_high: {
            duration: 0.30, hitAt: 0.18, hitRange: 0.22,
            damage: 20, impulseX: 300, impulseY: -250,
            keyframes: [
                { t: 0.0,  pose: { bounce: 0, lean: -0.1, legSpread: 0.2, kneeL: 0 } },
                { t: 0.35, pose: { bounce: 0.05, lean: -0.15, legSpread: 0.5, kneeL: -0.6 } },
                { t: 0.7,  pose: { bounce: 0.05, lean: -0.15, legSpread: 0.5, kneeL: -0.6 } },
                { t: 1.0,  pose: { bounce: 0, lean: 0, legSpread: 0.2, kneeL: 0 } }
            ]
        },
        slash: {
            duration: 0.28, hitAt: 0.14, hitRange: 0.25,
            damage: 25, impulseX: 500, impulseY: -200,
            keyframes: [
                { t: 0.0,  pose: { lean: 0.15, armLAngle: -0.8, elbowLBend: 0.2, armRAngle: -0.5, elbowRBend: 0.4, swordAngle: -1.2 } },
                { t: 0.4,  pose: { lean: 0.4, armLAngle: 0.2, elbowLBend: 0.1, armRAngle: 0.3, elbowRBend: 0.25, swordAngle: 0.5 } },
                { t: 0.7,  pose: { lean: 0.35, armLAngle: 0.3, elbowLBend: 0.15, armRAngle: 0.2, elbowRBend: 0.3, swordAngle: 0.6 } },
                { t: 1.0,  pose: { lean: 0.15, armLAngle: -0.4, elbowLBend: 0.3, armRAngle: -0.5, elbowRBend: 0.4, swordAngle: 0 } }
            ]
        },
        lunge: {
            duration: 0.35, hitAt: 0.20, hitRange: 0.30,
            damage: 30, impulseX: 600, impulseY: -180,
            keyframes: [
                { t: 0.0,  pose: { lean: 0.15, legSpread: 0.2, armLAngle: -0.3, elbowLBend: 0.4, armRAngle: -0.4, elbowRBend: 0.4, swordAngle: -0.6 } },
                { t: 0.5,  pose: { lean: 0.5, legSpread: 0.6, armLAngle: -0.1, elbowLBend: 0.15, armRAngle: 0.3, elbowRBend: 0.15, swordAngle: -0.1 } },
                { t: 0.75, pose: { lean: 0.5, legSpread: 0.6, armLAngle: -0.1, elbowLBend: 0.15, armRAngle: 0.3, elbowRBend: 0.15, swordAngle: -0.1 } },
                { t: 1.0,  pose: { lean: 0.15, legSpread: 0.3, armLAngle: -0.3, elbowLBend: 0.3, armRAngle: -0.4, elbowRBend: 0.4, swordAngle: -0.4 } }
            ]
        },
        block: {
            duration: 0.40,
            keyframes: [
                { t: 0.0, pose: { lean: 0.05, armLAngle: -1.1, armRAngle: -0.5, elbowLBend: 0.85, elbowRBend: 0.4, swordAngle: -1.5 } },
                { t: 0.3, pose: { lean: 0.0, armLAngle: -1.1, armRAngle: -0.5, elbowLBend: 0.85, elbowRBend: 0.4, swordAngle: -1.5 } },
                { t: 1.0, pose: { lean: 0.1, armLAngle: -0.8, armRAngle: -0.5, elbowLBend: 0.6, elbowRBend: 0.4, swordAngle: -0.8 } }
            ]
        },
        grab: {
            duration: 0.50, hitAt: 0.25, hitRange: 0.12,
            damage: 10, impulseX: 200, impulseY: -100,
            keyframes: [
                { t: 0.0,  pose: { lean: 0.2, armLAngle: -0.3, armRAngle: -0.3, elbowLBend: 0.4, elbowRBend: 0.4 } },
                { t: 0.4,  pose: { lean: 0.4, armLAngle: -0.7, armRAngle: -0.7, elbowLBend: 0.2, elbowRBend: 0.2 } },
                { t: 0.6,  pose: { lean: 0.4, armLAngle: -0.7, armRAngle: -0.7, elbowLBend: 0.5, elbowRBend: 0.5 } },
                { t: 1.0,  pose: { lean: 0.1, armLAngle: -0.3, armRAngle: -0.3, elbowLBend: 0.3, elbowRBend: 0.3 } }
            ]
        },
        uppercut: {
            duration: 0.28, hitAt: 0.16, hitRange: 0.20,
            damage: 22, impulseX: 200, impulseY: -400,
            keyframes: [
                { t: 0.0,  pose: { bounce: -0.15, lean: 0.2, armRAngle: 0.4, elbowRBend: 0.7, legSpread: 0.3, kneeR: -0.1 } },
                { t: 0.45, pose: { bounce: 0.1, lean: 0.15, armRAngle: -1.3, elbowRBend: 0.1, legSpread: 0.25, kneeR: 0 } },
                { t: 0.7,  pose: { bounce: 0.1, lean: 0.1, armRAngle: -1.4, elbowRBend: 0.05, legSpread: 0.2, kneeR: 0 } },
                { t: 1.0,  pose: { bounce: 0, lean: 0, armRAngle: -0.4, elbowRBend: 0.3, legSpread: 0.15, kneeR: 0 } }
            ]
        },
        haymaker: {
            duration: 0.32, hitAt: 0.18, hitRange: 0.22,
            damage: 25, impulseX: 550, impulseY: -120,
            keyframes: [
                { t: 0.0,  pose: { bounce: 0, lean: -0.3, armRAngle: 0.6, elbowRBend: 0.2, legSpread: 0.35, kneeR: 0.1 } },
                { t: 0.35, pose: { bounce: -0.05, lean: 0.45, armRAngle: -0.7, elbowRBend: 0.15, legSpread: 0.4, kneeL: -0.15 } },
                { t: 0.65, pose: { bounce: -0.05, lean: 0.4, armRAngle: -0.8, elbowRBend: 0.2, legSpread: 0.35, kneeL: -0.1 } },
                { t: 1.0,  pose: { bounce: 0, lean: 0, armRAngle: -0.4, elbowRBend: 0.3, legSpread: 0.15, kneeL: 0 } }
            ]
        },
        overhead: {
            duration: 0.34, hitAt: 0.20, hitRange: 0.22,
            damage: 28, impulseX: 350, impulseY: -80,
            keyframes: [
                { t: 0.0,  pose: { bounce: 0.05, lean: -0.2, armRAngle: -1.5, armLAngle: -1.3, elbowRBend: 0.3, elbowLBend: 0.3, legSpread: 0.2 } },
                { t: 0.25, pose: { bounce: 0.1, lean: -0.15, armRAngle: -1.6, armLAngle: -1.4, elbowRBend: 0.25, elbowLBend: 0.25, legSpread: 0.25 } },
                { t: 0.5,  pose: { bounce: -0.15, lean: 0.5, armRAngle: -0.4, armLAngle: -0.3, elbowRBend: 0.1, elbowLBend: 0.1, legSpread: 0.35, kneeL: -0.2 } },
                { t: 0.75, pose: { bounce: -0.15, lean: 0.45, armRAngle: -0.3, armLAngle: -0.2, elbowRBend: 0.15, elbowLBend: 0.15, legSpread: 0.3, kneeL: -0.15 } },
                { t: 1.0,  pose: { bounce: 0, lean: 0, armRAngle: -0.3, armLAngle: -0.3, elbowRBend: 0.3, elbowLBend: 0.3, legSpread: 0.15, kneeL: 0 } }
            ]
        }
    };

    // ── Interpolate keyframes at a given progress (0..1) ─────────────
    function sampleKeyframes(keyframes, progress) {
        if (progress <= 0) return keyframes[0].pose;
        if (progress >= 1) return keyframes[keyframes.length - 1].pose;

        // Find surrounding keyframes
        var i;
        for (i = 0; i < keyframes.length - 1; i++) {
            if (progress < keyframes[i + 1].t) break;
        }
        var kA = keyframes[i];
        var kB = keyframes[i + 1];
        var segLen = kB.t - kA.t;
        var localT = segLen > 0 ? (progress - kA.t) / segLen : 0;

        // Lerp pose values between kA and kB
        var result = {};
        var k;
        for (k in kA.pose) {
            if (kA.pose.hasOwnProperty(k)) {
                var a = kA.pose[k];
                var b = kB.pose.hasOwnProperty(k) ? kB.pose[k] : a;
                result[k] = a + (b - a) * localT;
            }
        }
        // Include any keys only in kB
        for (k in kB.pose) {
            if (kB.pose.hasOwnProperty(k) && !result.hasOwnProperty(k)) {
                result[k] = kB.pose[k];
            }
        }
        return result;
    }

    // ── Start an attack ──────────────────────────────────────────────
    function attack(attacker, moveName, target) {
        if (attacker.attacking) return false;
        var move = MOVES[moveName];
        if (!move) return false;
        attacker.attacking = {
            move: move,
            moveName: moveName,
            target: target || null,
            elapsed: 0,
            hit: false
        };
        return true;
    }

    // ── Update attack animation ──────────────────────────────────────
    function updateAttack(fig, dt) {
        var atk = fig.attacking;
        if (!atk) return;

        atk.elapsed += dt;
        var move = atk.move;
        var progress = Math.min(atk.elapsed / move.duration, 1);

        // Drive pose targets from keyframes
        // Mirror L↔R when the figure's lead side is right
        if (move.keyframes) {
            var kfs = move.keyframes;
            if ((fig.leadSide || 'left') === 'right') {
                kfs = mirrorKeyframes(kfs);
            }
            var posed = sampleKeyframes(kfs, progress);
            for (var k in posed) {
                if (posed.hasOwnProperty(k)) {
                    fig.targets[k] = posed[k];
                }
            }
        }

        // Check hit at the hitAt timing (once)
        if (!atk.hit && move.hitAt && atk.elapsed >= move.hitAt && atk.target) {
            var contact = checkHit(fig, atk.target);
            if (contact) {
                applyHit(atk.target, move, fig, contact);
            }
            atk.hit = true;
        }

        // Attack finished
        if (atk.elapsed >= move.duration) {
            fig.attacking = null;
        }
    }

    // ── Resolve the attacking limb segment (world coords) ───────────
    // Returns { p1: {x,y}, p2: {x,y} } — the segment of the attacking limb.
    function getAttackSegment(attacker, aJoints, moveName) {
        var leadE = (attacker.leadSide === 'right') ? 'elbowR' : 'elbowL';
        var rearE = (attacker.leadSide === 'right') ? 'elbowL' : 'elbowR';
        var leadH = (attacker.leadSide === 'right') ? 'handR' : 'handL';
        var rearH = (attacker.leadSide === 'right') ? 'handL' : 'handR';
        var leadK = (attacker.leadSide === 'right') ? 'kneeR' : 'kneeL';
        var leadA = (attacker.leadSide === 'right') ? 'ankleR' : 'ankleL';
        var weaponH = (attacker.weaponHand === 'right') ? 'handR' : 'handL';
        var weaponE = (attacker.weaponHand === 'right') ? 'elbowR' : 'elbowL';

        var ax = attacker.x, ay = attacker.y;
        var p1, p2;

        if ((moveName === 'slash' || moveName === 'lunge') && attacker.params.swordLen > 0) {
            // Sword: hand → tip
            var sLen = attacker.params.swordLen * attacker.figH;
            var sAng = attacker.params.swordAngle;
            var hand = aJoints[weaponH];
            p1 = { x: ax + hand.x, y: ay + hand.y };
            p2 = { x: p1.x + Math.cos(sAng) * sLen * attacker.facing,
                    y: p1.y + Math.sin(sAng) * sLen };
        } else if (moveName === 'punch_r' || moveName === 'uppercut' || moveName === 'haymaker' || moveName === 'overhead') {
            // Rear-hand punch: elbow → hand
            p1 = { x: ax + aJoints[rearE].x, y: ay + aJoints[rearE].y };
            p2 = { x: ax + aJoints[rearH].x, y: ay + aJoints[rearH].y };
        } else if (moveName === 'punch_l') {
            // Lead-hand punch: elbow → hand
            p1 = { x: ax + aJoints[leadE].x, y: ay + aJoints[leadE].y };
            p2 = { x: ax + aJoints[leadH].x, y: ay + aJoints[leadH].y };
        } else if (moveName === 'kick_high') {
            // Kick: knee → ankle
            p1 = { x: ax + aJoints[leadK].x, y: ay + aJoints[leadK].y };
            p2 = { x: ax + aJoints[leadA].x, y: ay + aJoints[leadA].y };
        } else if (moveName === 'grab') {
            // Grab uses both hands — use lead elbow → hand
            p1 = { x: ax + aJoints[leadE].x, y: ay + aJoints[leadE].y };
            p2 = { x: ax + aJoints[leadH].x, y: ay + aJoints[leadH].y };
        } else {
            // Default: lead elbow → hand
            p1 = { x: ax + aJoints[leadE].x, y: ay + aJoints[leadE].y };
            p2 = { x: ax + aJoints[leadH].x, y: ay + aJoints[leadH].y };
        }

        return { p1: p1, p2: p2 };
    }

    // ── Hit detection (swept segment) ─────────────────────────────────
    // Returns a contact event object or null.
    function checkHit(attacker, target) {
        if (target.mode === 'ragdoll') return null;

        var atk = attacker.attacking;
        if (!atk) return null;
        var move = atk.move;
        var range = move.hitRange * attacker.figH;

        var aJoints = computeJoints(attacker);
        var tJoints = computeJoints(target);
        var tx = target.x, ty = target.y;

        // Get the attacking limb segment in world coords
        var atkSeg = getAttackSegment(attacker, aJoints, atk.moveName);

        // ── Swept segment test against all target zones ──
        var bestDist = Infinity;
        var bestZone = null;
        var bestPoint = null;    // contact point on target body
        var bestAtkPt = null;    // contact point on attacking limb
        var bestMul = 1.0;

        for (var zi = 0; zi < HIT_ZONE_ORDER.length; zi++) {
            var zoneName = HIT_ZONE_ORDER[zi];
            var zone = HIT_ZONES[zoneName];
            var segs = zone.segments;

            for (var si = 0; si < segs.length; si++) {
                var jA = tJoints[segs[si][0]];
                var jB = tJoints[segs[si][1]];
                // Convert to world coords
                var b1 = { x: tx + jA.x, y: ty + jA.y };
                var b2 = { x: tx + jB.x, y: ty + jB.y };

                var result = segmentDistance(atkSeg.p1, atkSeg.p2, b1, b2);
                if (result.dist < bestDist) {
                    bestDist = result.dist;
                    bestZone = zoneName;
                    bestPoint = result.pointB;
                    bestAtkPt = result.pointA;
                    bestMul = zone.dmgMul;
                }
            }

            // Head sphere: also test attack segment vs head center point
            if (zone.radiusJoint) {
                var headJ = tJoints[zone.radiusJoint];
                var headW = { x: tx + headJ.x, y: ty + headJ.y };
                var headR = tJoints[zone.radiusKey] || 0;
                var psd = pointSegmentDist(headW, atkSeg.p1, atkSeg.p2);
                var effective = psd.dist - headR;
                if (effective < 0) effective = 0;
                if (effective < bestDist) {
                    bestDist = effective;
                    bestZone = zoneName;
                    bestPoint = headW;
                    bestAtkPt = psd.closest;
                    bestMul = zone.dmgMul;
                }
            }
        }

        // ── Check if best zone hit is within range ──
        if (bestDist < range && bestZone) {
            return buildContact(attacker, atk, bestPoint, bestAtkPt, bestZone, bestMul, move);
        }

        // ── Fallback: legacy torso-center check ──
        var tHip = tJoints.hip;
        var tNeck = tJoints.neck;
        var tcX = tx + (tHip.x + tNeck.x) * 0.5;
        var tcY = ty + (tHip.y + tNeck.y) * 0.5;
        // Use midpoint of attack segment as the test point for fallback
        var midAx = (atkSeg.p1.x + atkSeg.p2.x) * 0.5;
        var midAy = (atkSeg.p1.y + atkSeg.p2.y) * 0.5;
        var dx = midAx - tcX;
        var dy = midAy - tcY;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < range) {
            var fallbackPt = { x: tcX, y: tcY };
            return buildContact(attacker, atk, fallbackPt, { x: midAx, y: midAy }, 'torso', 1.0, move);
        }

        return null;
    }

    // ── Build a contact event object ──────────────────────────────────
    function buildContact(attacker, atk, contactPt, atkPt, zoneName, dmgMul, move) {
        // Normal: direction from attacker's strike point toward target contact
        var nx = contactPt.x - atkPt.x;
        var ny = contactPt.y - atkPt.y;
        var nLen = Math.sqrt(nx * nx + ny * ny);
        if (nLen > 1e-6) { nx /= nLen; ny /= nLen; }
        else { nx = attacker.facing; ny = 0; }

        // Strength: peak at hitAt, fall off before/after
        var progress = atk.elapsed / move.duration;
        var hitNorm = move.hitAt / move.duration;
        var strength = 1 - Math.abs(progress - hitNorm) / Math.max(hitNorm, 1 - hitNorm);
        if (strength < 0) strength = 0;

        // Block check
        var t = atk.target ? atk.target.targets : null;
        var isBlocking = t && (
            t.armLAngle < -0.4 && t.armRAngle < -0.3 &&
            t.elbowLBend > 0.5 && t.elbowRBend > 0.4 &&
            t.lean < 0
        );
        var baseDamage = move.damage * dmgMul;
        if (isBlocking) baseDamage *= 0.4;
        var damage = Math.round(baseDamage);

        return {
            point:    { x: contactPt.x, y: contactPt.y },
            normal:   { x: nx, y: ny },
            strength: strength,
            moveName: atk.moveName,
            zone:     zoneName,
            damage:   damage
        };
    }

    // ── Apply hit damage and reactions ───────────────────────────────
    function applyHit(target, move, attacker, contact) {
        var damage = contact ? contact.damage : move.damage;

        // If no contact provided, do legacy block check
        if (!contact) {
            var t = target.targets;
            var isBlocking = (
                t.armLAngle < -0.4 && t.armRAngle < -0.3 &&
                t.elbowLBend > 0.5 && t.elbowRBend > 0.4 &&
                t.lean < 0
            );
            if (isBlocking) {
                damage = Math.round(damage * 0.4);
            }
        }

        target.hp -= damage;

        // Update attacker combo
        var now = (typeof performance !== 'undefined') ? performance.now() / 1000 : Date.now() / 1000;
        if (now - attacker.lastHitTime < 0.8) {
            attacker.combo += 1;
        } else {
            attacker.combo = 1;
        }
        attacker.lastHitTime = now;

        // Store contact on attacker for video FX
        if (contact) {
            attacker.lastContact = contact;
        }

        // Apply recoil pose to target (if not already ragdolled)
        if (target.hp <= 0) {
            var dir = attacker.facing;
            goRagdoll(target, target.y, move.impulseX * dir, move.impulseY);
        } else {
            setPose(target, 'recoil');
        }
    }

    // ══════════════════ PHASE 4 — Gore & Effects ══════════════════

    // ── Blood particle pool ────────────────────────────────────────
    var _bloodParticles = [];

    function spawnBlood(x, y, count, impulseX, impulseY) {
        for (var i = 0; i < count; i++) {
            var spread = 0.6 + Math.random() * 0.8;
            var angle = Math.random() * Math.PI * 2;
            _bloodParticles.push({
                x: x,
                y: y,
                vx: (impulseX || 0) * spread + Math.cos(angle) * 60 * Math.random(),
                vy: (impulseY || 0) * spread + Math.sin(angle) * 60 * Math.random(),
                radius: 1 + Math.random() * 2,
                alpha: 1,
                grounded: false,
                life: 3
            });
        }
    }

    function updateBloodParticles(dt, groundY) {
        var gravity = 1200;
        var i = _bloodParticles.length;
        while (i--) {
            var p = _bloodParticles[i];
            if (p.grounded) {
                p.life -= dt;
                p.alpha = Math.max(0, p.life / 3);
                if (p.life <= 0) {
                    _bloodParticles.splice(i, 1);
                }
                continue;
            }
            p.vy += gravity * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            if (p.y >= groundY) {
                p.y = groundY;
                p.grounded = true;
                p.vx = 0;
                p.vy = 0;
            }
        }
    }

    function drawBloodParticles(ctx) {
        for (var i = 0; i < _bloodParticles.length; i++) {
            var p = _bloodParticles[i];
            ctx.fillStyle = 'rgba(180, 20, 20, ' + p.alpha + ')';
            if (p.grounded) {
                // Flatten to ellipse splat
                ctx.beginPath();
                ctx.ellipse(p.x, p.y, p.radius * 2, p.radius * 0.5, 0, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // ── Dismemberment system ───────────────────────────────────────
    var _detachedLimbs = [];

    // Limb definitions: which joints form each limb
    var LIMB_JOINTS = {
        armR:  ['shoulderR', 'elbowR', 'handR'],
        armL:  ['shoulderL', 'elbowL', 'handL'],
        legR:  ['hip', 'kneeR', 'ankleR'],
        legL:  ['hip', 'kneeL', 'ankleL'],
        head:  ['neck', 'head']
    };

    function detachLimb(fig, limbName, groundY) {
        var jointNames = LIMB_JOINTS[limbName];
        if (!jointNames) return;

        var joints = computeJoints(fig);
        var pts = [];
        var dists = [];

        for (var i = 0; i < jointNames.length; i++) {
            var j = joints[jointNames[i]];
            var pt = createPoint(fig.x + j.x, fig.y + j.y);
            // Random detach impulse
            pt.px = pt.x - (Math.random() - 0.5) * 3;
            pt.py = pt.y + Math.random() * 2;
            pts.push(pt);
        }

        for (var c = 0; c < pts.length - 1; c++) {
            var a = pts[c];
            var b = pts[c + 1];
            var dx = b.x - a.x;
            var dy = b.y - a.y;
            dists.push(Math.sqrt(dx * dx + dy * dy));
        }

        _detachedLimbs.push({
            pts: pts,
            dists: dists,
            groundY: groundY,
            gravity: 1200,
            bounce: 0.3,
            friction: 0.85,
            color: fig.color,
            lineWidth: fig.lineWidth,
            headR: (limbName === 'head') ? joints.headR : 0,
            settled: false,
            settleTimer: 0
        });

        // Spawn blood at detach point
        var base = pts[0];
        spawnBlood(base.x, base.y, 8, (Math.random() - 0.5) * 100, -150);
    }

    function updateDetachedLimbs(dt) {
        for (var li = 0; li < _detachedLimbs.length; li++) {
            var limb = _detachedLimbs[li];
            if (limb.settled) continue;

            var pts = limb.pts;
            var g = limb.gravity;
            var groundY = limb.groundY;

            // Verlet integration
            for (var i = 0; i < pts.length; i++) {
                var p = pts[i];
                var vx = p.x - p.px;
                var vy = p.y - p.py;
                p.px = p.x;
                p.py = p.y;
                p.x += vx * 0.99;
                p.y += vy * 0.99 + g * dt * dt;
            }

            // Constraint projection (4 iterations)
            for (var iter = 0; iter < 4; iter++) {
                for (var c = 0; c < limb.dists.length; c++) {
                    var a = pts[c];
                    var b = pts[c + 1];
                    var dx = b.x - a.x;
                    var dy = b.y - a.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    var target = limb.dists[c];
                    if (dist < 0.001) dist = 0.001;
                    var diff = (dist - target) / dist * 0.5;
                    var ox = dx * diff;
                    var oy = dy * diff;
                    a.x += ox;
                    a.y += oy;
                    b.x -= ox;
                    b.y -= oy;
                }
            }

            // Ground collision + settle detection
            var totalVel = 0;
            for (var gi = 0; gi < pts.length; gi++) {
                var p2 = pts[gi];
                if (p2.y > groundY) {
                    p2.y = groundY;
                    var vy2 = p2.y - p2.py;
                    p2.py = p2.y + vy2 * limb.bounce;
                    var vx2 = p2.x - p2.px;
                    p2.px = p2.x - vx2 * limb.friction;
                }
                var dvx = p2.x - p2.px;
                var dvy = p2.y - p2.py;
                totalVel += dvx * dvx + dvy * dvy;
            }

            if (totalVel < 0.5) {
                limb.settleTimer += dt;
                if (limb.settleTimer > 0.5) limb.settled = true;
            } else {
                limb.settleTimer = 0;
            }
        }
    }

    function drawDetachedLimbs(ctx) {
        for (var li = 0; li < _detachedLimbs.length; li++) {
            var limb = _detachedLimbs[li];
            var pts = limb.pts;

            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = limb.color;
            ctx.lineWidth = limb.lineWidth;
            ctx.shadowColor = limb.color;
            ctx.shadowBlur = 8;

            for (var c = 0; c < pts.length - 1; c++) {
                ctx.beginPath();
                ctx.moveTo(pts[c].x, pts[c].y);
                ctx.lineTo(pts[c + 1].x, pts[c + 1].y);
                ctx.stroke();
            }

            // Draw head circle if this is a detached head
            if (limb.headR > 0) {
                var headPt = pts[pts.length - 1];
                ctx.beginPath();
                ctx.arc(headPt.x, headPt.y, limb.headR, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.restore();
        }
    }

    // ── Death types ────────────────────────────────────────────────
    function applyDeath(fig, type, groundY) {
        var limbNames = ['armR', 'armL', 'legR', 'legL', 'head'];

        if (type === 'collapse') {
            spawnBlood(fig.x, fig.y - fig.figH * 0.4, 5, 0, -80);
            goRagdoll(fig, groundY, 50, -100);

        } else if (type === 'flung') {
            spawnBlood(fig.x, fig.y - fig.figH * 0.4, 15,
                fig.facing * -200, -150);
            // Maybe detach a random limb
            if (Math.random() < 0.6) {
                var pick = limbNames[Math.floor(Math.random() * limbNames.length)];
                detachLimb(fig, pick, groundY);
            }
            goRagdoll(fig, groundY, 400 * fig.facing * -1, -350);

        } else if (type === 'dramatic') {
            spawnBlood(fig.x, fig.y - fig.figH * 0.4, 8, 0, -60);
            setPose(fig, 'kneel');
            // Delayed ragdoll via a closure-based timer flag
            fig._dramaticTimer = 0.5;
            fig._dramaticGroundY = groundY;
            // The actual ragdoll trigger happens in updateEffects

        } else {
            // Default: treat as collapse
            spawnBlood(fig.x, fig.y - fig.figH * 0.4, 5, 0, -80);
            goRagdoll(fig, groundY, 50, -100);
        }
    }

    // Track dramatic-death figures
    var _dramaticDeaths = [];

    // ── Batch update / draw ────────────────────────────────────────
    function updateEffects(dt, groundY) {
        updateBloodParticles(dt, groundY);
        updateDetachedLimbs(dt);

        // Process dramatic death timers
        var i = _dramaticDeaths.length;
        while (i--) {
            var fig = _dramaticDeaths[i];
            if (fig._dramaticTimer !== undefined && fig._dramaticTimer > 0) {
                fig._dramaticTimer -= dt;
                if (fig._dramaticTimer <= 0) {
                    fig._dramaticTimer = undefined;
                    goRagdoll(fig, fig._dramaticGroundY, 30, -60);
                    fig._dramaticGroundY = undefined;
                    _dramaticDeaths.splice(i, 1);
                }
            } else {
                _dramaticDeaths.splice(i, 1);
            }
        }
    }

    function drawEffects(ctx) {
        drawBloodParticles(ctx);
        drawDetachedLimbs(ctx);
    }

    // Patch applyDeath to register dramatic deaths for timer processing
    var _origApplyDeath = applyDeath;
    function applyDeathWrapped(fig, type, groundY) {
        _origApplyDeath(fig, type, groundY);
        if (type === 'dramatic') {
            _dramaticDeaths.push(fig);
        }
    }

    // ══════════════════════════════════════════════════════════════════
    //  PHASE 5 — Battle Direction (Choreography, Camera, Contact FX)
    // ══════════════════════════════════════════════════════════════════

    // ── 5a. Choreography layer ──────────────────────────────────────
    // Plays a scripted exchange between two figures.
    //
    // sequence = [
    //   { beat: 0, attacker: 'A', move: 'slash', defender: 'block' },
    //   { beat: 1, attacker: 'B', move: 'punch_r', defender: 'recoil' },
    //   { beat: 3, attacker: 'A', move: 'lunge', result: 'hit' },
    //   { beat: 4, spacing: true },  // both return to guard
    // ]

    function choreograph(figA, figB, sequence) {
        return {
            figA: figA,
            figB: figB,
            sequence: sequence,
            currentBeat: -1,
            elapsed: 0,
            beatDuration: 0,       // set by advanceChoreography caller or defaults to dt-based
            isActive: true,
            lastContact: null,
            _stepIndex: 0          // which sequence entry we're on
        };
    }

    function advanceChoreography(choreo, dt) {
        if (!choreo.isActive) return;

        choreo.elapsed += dt;

        // Walk through sequence entries whose beat has arrived
        while (choreo._stepIndex < choreo.sequence.length) {
            var step = choreo.sequence[choreo._stepIndex];
            var beatTime = step.beat;

            // If beatDuration is set, convert beat index to elapsed time
            // Otherwise treat beats as already-elapsed seconds (caller manages timing)
            var stepTime = choreo.beatDuration > 0 ? beatTime * choreo.beatDuration : beatTime;

            if (choreo.elapsed < stepTime) break;  // not yet

            choreo.currentBeat = step.beat;

            // Resolve attacker/defender figures
            var attacker = step.attacker === 'B' ? choreo.figB : choreo.figA;
            var defender = step.attacker === 'B' ? choreo.figA : choreo.figB;

            if (step.spacing) {
                // Both return to guard, breathing room
                setPose(choreo.figA, 'guard');
                setPose(choreo.figB, 'guard');
            } else if (step.move) {
                // Attacker performs the move
                attack(attacker, step.move, defender);

                // Defender reaction
                if (step.defender) {
                    setPose(defender, step.defender);
                }

                // Whiff: defender dodges back, no contact
                if (step.result === 'whiff') {
                    // Cancel hit detection by clearing the target
                    if (attacker.attacking) {
                        attacker.attacking.target = null;
                        attacker.attacking.hit = true;  // prevent hit check
                    }
                    setPose(defender, 'recoil');
                }

                // Explicit hit: let normal hit detection run (target stays set)
                // result: 'hit' is just documentation — the engine already does hit checks
            }

            choreo._stepIndex++;
        }

        // Check if we've processed all steps and last attack is finished
        if (choreo._stepIndex >= choreo.sequence.length) {
            var aAtk = choreo.figA.attacking;
            var bAtk = choreo.figB.attacking;
            if (!aAtk && !bAtk) {
                choreo.isActive = false;
            }
        }

        // Track last contact from either figure
        if (choreo.figA.lastContact) {
            choreo.lastContact = choreo.figA.lastContact;
        }
        if (choreo.figB.lastContact) {
            choreo.lastContact = choreo.figB.lastContact;
        }
    }

    // ── 5b. Camera / director helpers ───────────────────────────────

    // hitStop: freezes a figure's pose lerp for N frames
    function hitStop(fig, frames) {
        fig._hitStop = {
            originalSpeed: fig.poseSpeed,
            framesRemaining: frames
        };
        fig.poseSpeed = 0;
    }

    // Patch updateFigure to handle hitStop countdown
    var _origUpdateFigure = updateFigure;
    updateFigure = function(fig, dt) {
        // Tick hitStop
        if (fig._hitStop) {
            fig._hitStop.framesRemaining--;
            if (fig._hitStop.framesRemaining <= 0) {
                fig.poseSpeed = fig._hitStop.originalSpeed;
                fig._hitStop = null;
            }
        }

        // Tick freezeFrame
        if (fig._freeze) {
            fig._freeze.remaining -= dt;
            if (fig._freeze.remaining <= 0) {
                fig.poseSpeed = fig._freeze.originalSpeed;
                fig._freeze = null;
            } else {
                // Still frozen — skip normal update but still step ragdoll
                if (fig.mode === 'ragdoll' && fig.ragdoll) {
                    stepRagdoll(fig.ragdoll, dt);
                }
                return;
            }
        }

        _origUpdateFigure(fig, dt);
    };

    // screenShake: returns a shake object that the video reads for canvas translate
    function screenShake(intensity, duration) {
        return {
            intensity: intensity,
            duration: duration,
            elapsed: 0,
            x: 0,
            y: 0,
            active: true
        };
    }

    function updateShake(shake, dt) {
        if (!shake.active) return;
        shake.elapsed += dt;
        if (shake.elapsed >= shake.duration) {
            shake.x = 0;
            shake.y = 0;
            shake.active = false;
            return;
        }
        var decay = 1 - (shake.elapsed / shake.duration);
        var mag = shake.intensity * decay;
        shake.x = (Math.random() * 2 - 1) * mag;
        shake.y = (Math.random() * 2 - 1) * mag;
    }

    // freezeFrame: pauses all figures temporarily
    function freezeFrame(figs, duration) {
        for (var i = 0; i < figs.length; i++) {
            var fig = figs[i];
            if (!fig._freeze) {
                fig._freeze = {
                    originalSpeed: fig.poseSpeed,
                    remaining: duration
                };
                fig.poseSpeed = 0;
            }
        }
    }

    // ── 5c. Contact-driven FX callbacks ─────────────────────────────
    var _contactCallbacks = [];

    function onContact(callback) {
        _contactCallbacks.push(callback);
    }

    // Patch applyHit to fire contact callbacks
    var _origApplyHit = applyHit;
    applyHit = function(target, move, attacker, contact) {
        _origApplyHit(target, move, attacker, contact);

        // Fire all registered contact callbacks
        if (contact) {
            for (var i = 0; i < _contactCallbacks.length; i++) {
                _contactCallbacks[i](contact, attacker, target);
            }
        }
    };

    // ── Public API ────────────────────────────────────────────────────
    window.StickFight = {
        BONE:       BONE,
        POSES:      POSES,
        MOVES:      MOVES,
        GAIT:       GAIT,

        create:         create,
        computeJoints:  computeJoints,
        drawFigure:     drawFigure,
        setPose:        setPose,
        setTarget:      setTarget,
        updateFigure:   updateFigure,
        updateAll:      updateAll,
        drawAll:        drawAll,

        goRagdoll:      goRagdoll,
        attack:         attack,
        checkHit:       checkHit,
        segmentDistance: segmentDistance,
        HIT_ZONES:      HIT_ZONES,

        // Phase 4 — Gore & Effects
        spawnBlood:     spawnBlood,
        detachLimb:     detachLimb,
        applyDeath:     applyDeathWrapped,
        updateEffects:  updateEffects,
        drawEffects:    drawEffects,

        // Stance / handedness helpers
        resolveHand:    resolveHand,
        mirrorKeyframes: mirrorKeyframes,

        // Phase 5 — Battle Direction
        choreograph:          choreograph,
        advanceChoreography:  advanceChoreography,
        hitStop:              hitStop,
        screenShake:          screenShake,
        updateShake:          updateShake,
        freezeFrame:          freezeFrame,
        onContact:            onContact,

        // Expose for custom use
        lerpExp:        lerpExp,
        defaultParams:  defaultParams
    };
})();
