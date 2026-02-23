/* ======================================================================
   Animator Engine — Figure management, IK solver, keyframe interpolation,
   save/load for the Stick Figure Animation Studio.
   Depends on: StickFight (stick-fight-engine.js), video-utils.js
====================================================================== */
(function() {
    "use strict";

    var BONE = StickFight.BONE;

    // ── Unique ID generator ──────────────────────────────────────────
    function uid(prefix) {
        return (prefix || 'id') + '-' + Math.random().toString(36).slice(2, 7);
    }

    // ── Deep clone ───────────────────────────────────────────────────
    function deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // ── Easing functions ─────────────────────────────────────────────
    var EASINGS = {
        linear: function(t) { return t; },
        smooth: function(t) { return t * t * (3 - 2 * t); },  // smoothstep
        snap:   function(t) { return t < 1 ? 0 : 1; }
    };

    // ── Figure CRUD ──────────────────────────────────────────────────
    function createFigure(opts) {
        opts = opts || {};
        var fig = StickFight.create({
            x: opts.x || 400,
            y: opts.y || 450,
            figH: opts.figH || 120,
            facing: opts.facing || 1,
            color: opts.color || '#c43c3c',
            lineWidth: opts.lineWidth || 3,
            weaponHand: opts.weaponHand || 'left',
            poseSpeed: 10
        });
        // Disable gait for editor (we control poses directly)
        fig.gaitInfluence = 0;
        fig.velocity = 0;

        // Animator metadata
        fig._animId = opts.id || uid('fig');
        fig._animName = opts.name || 'Figure ' + fig._animId.slice(4);
        fig._swordLen = opts.swordLen || 0;

        // Set sword if provided
        fig.params.swordLen = fig._swordLen;
        fig.targets.swordLen = fig._swordLen;

        return fig;
    }

    // ── Capture figure state (position + all params) ─────────────────
    function captureFigureState(fig) {
        return {
            x: fig.x,
            y: fig.y,
            facing: fig.facing,
            params: deepClone(fig.params)
        };
    }

    // ── Apply state to figure ────────────────────────────────────────
    function applyFigureState(fig, state) {
        fig.x = state.x;
        fig.y = state.y;
        fig.facing = state.facing;
        var p = state.params;
        for (var k in p) {
            if (p.hasOwnProperty(k)) {
                fig.params[k] = p[k];
                fig.targets[k] = p[k];
            }
        }
    }

    // ── Interpolate between two figure states ────────────────────────
    function interpolateStates(stateA, stateB, t) {
        var result = {
            x: stateA.x + (stateB.x - stateA.x) * t,
            y: stateA.y + (stateB.y - stateA.y) * t,
            facing: t < 0.5 ? stateA.facing : stateB.facing,
            params: {}
        };
        var pA = stateA.params;
        var pB = stateB.params;
        for (var k in pA) {
            if (pA.hasOwnProperty(k)) {
                var a = pA[k];
                var b = pB.hasOwnProperty(k) ? pB[k] : a;
                result.params[k] = a + (b - a) * t;
            }
        }
        // Include keys only in B
        for (var k2 in pB) {
            if (pB.hasOwnProperty(k2) && !result.params.hasOwnProperty(k2)) {
                result.params[k2] = pB[k2];
            }
        }
        return result;
    }

    // ── Joint handle hit-testing ─────────────────────────────────────
    var JOINT_NAMES = [
        'head', 'neck', 'shoulderL', 'shoulderR',
        'elbowL', 'elbowR', 'handL', 'handR',
        'hip', 'kneeL', 'kneeR', 'ankleL', 'ankleR'
    ];

    var HANDLE_RADIUS = 7;

    function getJointHandles(fig) {
        var joints = StickFight.computeJoints(fig);
        var handles = [];
        for (var i = 0; i < JOINT_NAMES.length; i++) {
            var name = JOINT_NAMES[i];
            var j = joints[name];
            handles.push({
                name: name,
                worldX: fig.x + j.x,
                worldY: fig.y + j.y,
                localX: j.x,
                localY: j.y
            });
        }
        return handles;
    }

    function hitTestJoint(fig, mx, my) {
        var handles = getJointHandles(fig);
        var best = null;
        var bestDist = HANDLE_RADIUS + 4;
        for (var i = 0; i < handles.length; i++) {
            var h = handles[i];
            var dx = mx - h.worldX;
            var dy = my - h.worldY;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < bestDist) {
                bestDist = dist;
                best = h;
            }
        }
        return best;
    }

    // ── Hit-test figure body (bounding box) ──────────────────────────
    function hitTestFigure(fig, mx, my) {
        var joints = StickFight.computeJoints(fig);
        // Simple bounding box around all joints
        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (var i = 0; i < JOINT_NAMES.length; i++) {
            var j = joints[JOINT_NAMES[i]];
            var wx = fig.x + j.x;
            var wy = fig.y + j.y;
            if (wx < minX) minX = wx;
            if (wy < minY) minY = wy;
            if (wx > maxX) maxX = wx;
            if (wy > maxY) maxY = wy;
        }
        var pad = 10;
        return mx >= minX - pad && mx <= maxX + pad &&
               my >= minY - pad && my <= maxY + pad;
    }

    // ── Draw joint handles ───────────────────────────────────────────
    function drawHandles(ctx, fig, selectedJoint) {
        var handles = getJointHandles(fig);
        for (var i = 0; i < handles.length; i++) {
            var h = handles[i];
            var isSelected = selectedJoint && selectedJoint.name === h.name;
            ctx.beginPath();
            ctx.arc(h.worldX, h.worldY, isSelected ? HANDLE_RADIUS + 2 : HANDLE_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = isSelected ? 'rgba(217, 69, 69, 0.9)' : 'rgba(139, 30, 30, 0.6)';
            ctx.fill();
            ctx.strokeStyle = isSelected ? '#d94545' : '#8b1e1e';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            // Inner glow
            if (isSelected) {
                ctx.beginPath();
                ctx.arc(h.worldX, h.worldY, HANDLE_RADIUS + 6, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(217, 69, 69, 0.3)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    }

    // ── IK Solver ────────────────────────────────────────────────────
    // Solves for pose params given a joint being dragged to a target position.
    function solveIK(fig, jointName, targetWX, targetWY) {
        var fH = fig.figH;
        var facing = fig.facing;
        var joints = StickFight.computeJoints(fig);

        // Convert target to local coords (relative to fig feet)
        var tx = targetWX - fig.x;
        var ty = targetWY - fig.y;

        if (jointName === 'hip') {
            // Move hip = adjust lean, bounce, hipShift
            var hipRef = joints.hip;
            var dy = ty - hipRef.y;
            var dx = tx - hipRef.x;
            fig.params.bounce = clamp(fig.params.bounce + dy / (fH * 0.06) * 0.1, -1, 1);
            fig.params.lean = clamp(fig.params.lean + dx / (fH * 0.08 * facing) * 0.1, -1, 1);
            fig.targets.bounce = fig.params.bounce;
            fig.targets.lean = fig.params.lean;
        }
        else if (jointName === 'head') {
            // Head drag adjusts headTilt and headBob
            var neckJ = joints.neck;
            var dx2 = tx - neckJ.x;
            var dy2 = ty - (neckJ.y - BONE.neck * fH);
            fig.params.headTilt = clamp(dx2 / (fH * 0.04), -1, 1);
            fig.params.headBob = clamp(dy2 / (fH * 0.03), -1, 1);
            fig.targets.headTilt = fig.params.headTilt;
            fig.targets.headBob = fig.params.headBob;
        }
        else if (jointName === 'handL' || jointName === 'elbowL') {
            solveArmIK(fig, 'L', tx, ty, joints);
        }
        else if (jointName === 'handR' || jointName === 'elbowR') {
            solveArmIK(fig, 'R', tx, ty, joints);
        }
        else if (jointName === 'shoulderL' || jointName === 'shoulderR') {
            // Shoulder drag adjusts torsoTwist
            var side = jointName === 'shoulderL' ? -1 : 1;
            var shouldW = BONE.shoulder * fH;
            var neckX = joints.neck.x;
            var offset = tx - neckX;
            fig.params.torsoTwist = clamp(offset / (shouldW * 0.5) * side, -1, 1);
            fig.targets.torsoTwist = fig.params.torsoTwist;
        }
        else if (jointName === 'kneeL' || jointName === 'ankleL') {
            solveLegIK(fig, 'L', tx, ty, joints);
        }
        else if (jointName === 'kneeR' || jointName === 'ankleR') {
            solveLegIK(fig, 'R', tx, ty, joints);
        }
        else if (jointName === 'neck') {
            // Neck drag adjusts lean
            var hipJ = joints.hip;
            var dx3 = tx - hipJ.x;
            fig.params.lean = clamp(dx3 / (fH * 0.08 * facing), -1, 1);
            fig.targets.lean = fig.params.lean;
        }
    }

    function solveArmIK(fig, side, tx, ty, joints) {
        var fH = fig.figH;
        var facing = fig.facing;
        var uArm = BONE.upperArm * fH;
        var fArm = BONE.forearm * fH;

        var shoulder = joints['shoulder' + side];
        var dx = tx - shoulder.x;
        var dy = ty - shoulder.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        // Clamp distance to arm reach
        var maxReach = uArm + fArm - 1;
        if (dist > maxReach) {
            dist = maxReach;
            var scale = maxReach / Math.sqrt(dx * dx + dy * dy);
            dx *= scale;
            dy *= scale;
        }

        // Angle from shoulder to target (relative to straight down)
        var angle = Math.atan2(-dx * facing, dy);

        // Law of cosines for elbow bend
        var elbowAngle = 0;
        if (dist > 0.01) {
            var cosAngle = (uArm * uArm + fArm * fArm - dist * dist) / (2 * uArm * fArm);
            cosAngle = clamp(cosAngle, -1, 1);
            elbowAngle = Math.PI - Math.acos(cosAngle);
        }

        // Convert to param space
        var armAngle = angle;
        var elbowBend = elbowAngle / 1.2;  // engine multiplies by 1.2

        fig.params['arm' + side + 'Angle'] = armAngle;
        fig.params['elbow' + side + 'Bend'] = clamp(elbowBend, 0, 1);
        fig.targets['arm' + side + 'Angle'] = armAngle;
        fig.targets['elbow' + side + 'Bend'] = clamp(elbowBend, 0, 1);
    }

    function solveLegIK(fig, side, tx, ty, joints) {
        var fH = fig.figH;
        var facing = fig.facing;
        var hipJ = joints.hip;

        // Knee offset: horizontal displacement from hip-to-ankle midpoint
        var dx = tx - hipJ.x;
        var kneeVal = clamp(-dx * facing / (fH * 0.06), -1, 1);

        fig.params['knee' + side] = kneeVal;
        fig.targets['knee' + side] = kneeVal;

        // Leg spread from ankle horizontal distance
        var ankleBase = side === 'L' ? -fH * 0.02 : fH * 0.02;
        var spread = Math.abs(tx - ankleBase) / (fH * 0.15);
        // Only adjust spread if dragging ankle
        fig.params.legSpread = clamp(spread, 0, 1);
        fig.targets.legSpread = clamp(spread, 0, 1);
    }

    function clamp(v, min, max) {
        return v < min ? min : v > max ? max : v;
    }

    // ── Onion Skinning ───────────────────────────────────────────────
    function drawOnionSkin(ctx, fig, state, tint, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        // Create a temporary figure copy at the onion state
        var tempFig = StickFight.create({
            x: state.x, y: state.y, figH: fig.figH,
            facing: state.facing, color: tint,
            lineWidth: fig.lineWidth
        });
        for (var k in state.params) {
            if (state.params.hasOwnProperty(k)) {
                tempFig.params[k] = state.params[k];
            }
        }
        StickFight.drawFigure(ctx, tempFig);
        ctx.restore();
    }

    // ── Animation Data Format ────────────────────────────────────────
    function createAnimation(name) {
        return {
            version: 1,
            name: name || 'My Animation',
            canvas: { width: 800, height: 600, bgColor: '#0d0a08' },
            figures: [],
            keyframes: []
        };
    }

    function serializeFigure(fig) {
        return {
            id: fig._animId,
            name: fig._animName,
            figH: fig.figH,
            color: fig.color,
            lineWidth: fig.lineWidth,
            facing: fig.facing,
            weaponHand: fig.weaponHand || 'left',
            swordLen: fig._swordLen || 0
        };
    }

    function createKeyframe(time, figures) {
        var states = {};
        for (var i = 0; i < figures.length; i++) {
            var fig = figures[i];
            states[fig._animId] = captureFigureState(fig);
        }
        return {
            id: uid('kf'),
            time: time,
            duration: 0.5,
            easing: 'smooth',
            figureStates: states
        };
    }

    // ── Playback: interpolate animation at a given time ──────────────
    function sampleAnimation(animation, time, figures) {
        var kfs = animation.keyframes;
        if (kfs.length === 0) return;

        // Sort by time
        kfs.sort(function(a, b) { return a.time - b.time; });

        for (var fi = 0; fi < figures.length; fi++) {
            var fig = figures[fi];
            var figId = fig._animId;

            // Find surrounding keyframes for this figure
            var prev = null, next = null;
            for (var ki = 0; ki < kfs.length; ki++) {
                var kf = kfs[ki];
                if (!kf.figureStates[figId]) continue;
                if (kf.time <= time) prev = kf;
                if (kf.time > time && !next) next = kf;
            }

            if (!prev && !next) continue;

            if (!prev) {
                // Before first keyframe
                applyFigureState(fig, next.figureStates[figId]);
            } else if (!next) {
                // After last keyframe
                applyFigureState(fig, prev.figureStates[figId]);
            } else {
                // Between two keyframes — interpolate
                var stateA = prev.figureStates[figId];
                var stateB = next.figureStates[figId];
                var segStart = prev.time + prev.duration;
                var segEnd = next.time;

                if (time <= prev.time + prev.duration) {
                    // In hold zone of prev keyframe
                    applyFigureState(fig, stateA);
                } else if (segEnd <= segStart) {
                    // No interpolation zone
                    applyFigureState(fig, stateA);
                } else {
                    var rawT = (time - segStart) / (segEnd - segStart);
                    rawT = clamp(rawT, 0, 1);
                    var easingFn = EASINGS[prev.easing] || EASINGS.smooth;
                    var t = easingFn(rawT);
                    var interpolated = interpolateStates(stateA, stateB, t);
                    applyFigureState(fig, interpolated);
                }
            }
        }
    }

    // ── Get total animation duration ─────────────────────────────────
    function getAnimationDuration(animation) {
        var kfs = animation.keyframes;
        if (kfs.length === 0) return 0;
        var maxTime = 0;
        for (var i = 0; i < kfs.length; i++) {
            var end = kfs[i].time + kfs[i].duration;
            if (end > maxTime) maxTime = end;
        }
        return maxTime;
    }

    // ── Undo/Redo History ────────────────────────────────────────────
    var HISTORY_LIMIT = 80;
    var _history = [];
    var _historyIndex = -1;

    function makeHistoryState(animation, figures) {
        var figStates = [];
        for (var i = 0; i < figures.length; i++) {
            figStates.push({
                animId: figures[i]._animId,
                state: captureFigureState(figures[i])
            });
        }
        return {
            animation: deepClone(animation),
            figStates: figStates
        };
    }

    function pushHistory(animation, figures) {
        var state = makeHistoryState(animation, figures);
        // Truncate future
        if (_historyIndex < _history.length - 1) {
            _history = _history.slice(0, _historyIndex + 1);
        }
        _history.push(state);
        if (_history.length > HISTORY_LIMIT) {
            _history.shift();
        } else {
            _historyIndex++;
        }
        if (_historyIndex >= _history.length) _historyIndex = _history.length - 1;
    }

    function resetHistory(animation, figures) {
        _history = [makeHistoryState(animation, figures)];
        _historyIndex = 0;
    }

    function undo() {
        if (_historyIndex <= 0) return null;
        _historyIndex--;
        return deepClone(_history[_historyIndex]);
    }

    function redo() {
        if (_historyIndex >= _history.length - 1) return null;
        _historyIndex++;
        return deepClone(_history[_historyIndex]);
    }

    function canUndo() { return _historyIndex > 0; }
    function canRedo() { return _historyIndex < _history.length - 1; }

    // ── Save/Load ────────────────────────────────────────────────────
    var AUTOSAVE_KEY = 'animator-autosave';

    function saveToJSON(animation, figures) {
        var data = deepClone(animation);
        data.figures = [];
        for (var i = 0; i < figures.length; i++) {
            data.figures.push(serializeFigure(figures[i]));
        }
        return JSON.stringify(data, null, 2);
    }

    function loadFromJSON(jsonStr) {
        return JSON.parse(jsonStr);
    }

    function autosave(animation, figures) {
        try {
            localStorage.setItem(AUTOSAVE_KEY, saveToJSON(animation, figures));
        } catch(e) { /* quota exceeded — ignore */ }
    }

    function loadAutosave() {
        try {
            var data = localStorage.getItem(AUTOSAVE_KEY);
            return data ? loadFromJSON(data) : null;
        } catch(e) { return null; }
    }

    // ── Pose Presets (delegate to StickFight) ────────────────────────
    var POSE_PRESETS = Object.keys(StickFight.POSES);

    // ── Move Sequence Names (combat moves from StickFight) ─────────
    var MOVE_NAMES = Object.keys(StickFight.MOVES);

    function applyPose(fig, poseName) {
        var pose = StickFight.POSES[poseName];
        if (!pose) return;
        for (var k in pose) {
            if (pose.hasOwnProperty(k)) {
                fig.params[k] = pose[k];
                fig.targets[k] = pose[k];
            }
        }
    }

    // ── Insert Move Sequence ──────────────────────────────────────────
    // Converts a StickFight.MOVES attack into animator keyframes at insertTime.
    function insertMoveSequence(animation, figures, figIdx, moveName, insertTime) {
        var move = StickFight.MOVES[moveName];
        if (!move || figIdx < 0 || figIdx >= figures.length) return [];

        var fig = figures[figIdx];
        var figId = fig._animId;
        var baseState = captureFigureState(fig);
        var generatedIds = [];

        for (var i = 0; i < move.keyframes.length; i++) {
            var mkf = move.keyframes[i];
            var absTime = insertTime + (mkf.t * move.duration);

            // Start from a full clone of the current figure state
            var poseParams = deepClone(baseState.params);

            // Overlay the move's sparse pose onto the full params
            var pose = mkf.pose;
            for (var k in pose) {
                if (pose.hasOwnProperty(k)) {
                    poseParams[k] = pose[k];
                }
            }

            // Build figureStates: selected figure gets the move pose,
            // other figures hold their current state
            var figureStates = {};
            for (var fi = 0; fi < figures.length; fi++) {
                if (fi === figIdx) {
                    figureStates[figId] = {
                        x: baseState.x,
                        y: baseState.y,
                        facing: baseState.facing,
                        params: poseParams
                    };
                } else {
                    figureStates[figures[fi]._animId] = captureFigureState(figures[fi]);
                }
            }

            var kf = {
                id: uid('kf'),
                time: absTime,
                duration: 0,
                easing: 'linear',
                figureStates: figureStates
            };

            animation.keyframes.push(kf);
            generatedIds.push(kf.id);
        }

        return generatedIds;
    }

    // ── Public API ───────────────────────────────────────────────────
    window.AnimatorEngine = {
        uid: uid,
        deepClone: deepClone,
        EASINGS: EASINGS,
        JOINT_NAMES: JOINT_NAMES,
        HANDLE_RADIUS: HANDLE_RADIUS,
        POSE_PRESETS: POSE_PRESETS,
        MOVE_NAMES: MOVE_NAMES,

        createFigure: createFigure,
        captureFigureState: captureFigureState,
        applyFigureState: applyFigureState,
        interpolateStates: interpolateStates,
        getJointHandles: getJointHandles,
        hitTestJoint: hitTestJoint,
        hitTestFigure: hitTestFigure,
        drawHandles: drawHandles,
        solveIK: solveIK,
        drawOnionSkin: drawOnionSkin,
        applyPose: applyPose,
        insertMoveSequence: insertMoveSequence,
        serializeFigure: serializeFigure,

        createAnimation: createAnimation,
        createKeyframe: createKeyframe,
        sampleAnimation: sampleAnimation,
        getAnimationDuration: getAnimationDuration,

        pushHistory: pushHistory,
        resetHistory: resetHistory,
        undo: undo,
        redo: redo,
        canUndo: canUndo,
        canRedo: canRedo,

        saveToJSON: saveToJSON,
        loadFromJSON: loadFromJSON,
        autosave: autosave,
        loadAutosave: loadAutosave
    };
})();
