/* ui.js — DOM rendering, particles, animations for Idle Mine */
'use strict';

(function(G) {

    G.ui = {};

    var $ = function(id) { return document.getElementById(id); };

    /* ─── Particle system (gold sparkles on click) ─── */
    var particles = [];
    var particleCanvas, particleCtx;

    G.ui.initParticles = function() {
        particleCanvas = $('particle-canvas');
        particleCtx = particleCanvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    };

    function resizeCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }

    function spawnParticles(x, y, count, amount) {
        for (var i = 0; i < count; i++) {
            var angle = Math.random() * Math.PI * 2;
            var speed = 1 + Math.random() * 3;
            particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                life: 1,
                decay: 0.015 + Math.random() * 0.02,
                size: 2 + Math.random() * 4,
                gold: Math.random() > 0.3
            });
        }
        // Floating number
        spawnFloatingText(x, y, '+' + G.formatNumber(amount));
    }

    function spawnFloatingText(x, y, text) {
        var el = document.createElement('div');
        el.className = 'floating-text';
        el.textContent = text;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        document.body.appendChild(el);
        setTimeout(function() { el.remove(); }, 1000);
    }

    function updateParticles() {
        particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        for (var i = particles.length - 1; i >= 0; i--) {
            var p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.08; // gravity
            p.life -= p.decay;
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
            particleCtx.globalAlpha = p.life;
            particleCtx.fillStyle = p.gold ? '#ffd700' : '#fff8dc';
            particleCtx.shadowColor = '#ffd700';
            particleCtx.shadowBlur = p.gold ? 6 : 2;
            particleCtx.beginPath();
            particleCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            particleCtx.fill();
        }
        particleCtx.globalAlpha = 1;
        particleCtx.shadowBlur = 0;
    }

    /* ─── Ambient particles (floating dust/gold in the mine) ─── */
    var ambientParticles = [];

    function initAmbientParticles() {
        for (var i = 0; i < 30; i++) {
            ambientParticles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: 1 + Math.random() * 2,
                speed: 0.2 + Math.random() * 0.5,
                opacity: 0.1 + Math.random() * 0.3,
                wobble: Math.random() * Math.PI * 2
            });
        }
    }

    function updateAmbientParticles() {
        for (var i = 0; i < ambientParticles.length; i++) {
            var p = ambientParticles[i];
            p.y -= p.speed;
            p.wobble += 0.02;
            p.x += Math.sin(p.wobble) * 0.3;
            if (p.y < -10) {
                p.y = window.innerHeight + 10;
                p.x = Math.random() * window.innerWidth;
            }
            particleCtx.globalAlpha = p.opacity;
            particleCtx.fillStyle = '#ffd700';
            particleCtx.shadowColor = '#ffd700';
            particleCtx.shadowBlur = 4;
            particleCtx.beginPath();
            particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            particleCtx.fill();
        }
        particleCtx.globalAlpha = 1;
        particleCtx.shadowBlur = 0;
    }

    /* ─── Mine rock click handler ─── */
    G.ui.initClickArea = function() {
        var rock = $('mine-rock');
        rock.addEventListener('click', function(e) {
            var amount = G.doClick();
            rock.classList.add('hit');
            setTimeout(function() { rock.classList.remove('hit'); }, 100);
            spawnParticles(e.clientX, e.clientY, 6 + Math.min(amount / 10, 20), amount);

            // Check for new achievements from click
            var newAch = G.checkAchievements();
            newAch.forEach(function(a) {
                G.ui.showAchievement(a);
            });
        });
    };

    /* ─── Build upgrade buttons ─── */
    G.ui.buildUpgradePanel = function() {
        var panel = $('upgrade-list');
        panel.innerHTML = '';

        // Workers first
        var wBtn = createUpgradeButton('worker', G.workerData, true);
        panel.appendChild(wBtn);

        // Then upgrades
        var order = ['pickaxe', 'mineCart', 'dynamite', 'drillMachine', 'excavator'];
        order.forEach(function(key) {
            var btn = createUpgradeButton(key, G.upgradeData[key], false);
            panel.appendChild(btn);
        });
    };

    function createUpgradeButton(key, data, isWorker) {
        var div = document.createElement('div');
        div.className = 'upgrade-btn';
        div.dataset.key = key;
        div.dataset.worker = isWorker ? '1' : '0';
        div.innerHTML =
            '<div class="upgrade-icon">' + data.icon + '</div>' +
            '<div class="upgrade-info">' +
                '<div class="upgrade-name">' + data.name + '</div>' +
                '<div class="upgrade-desc">' + data.desc + '</div>' +
                '<div class="upgrade-cost">Cost: <span class="cost-val"></span></div>' +
                '<div class="upgrade-owned">Owned: <span class="owned-val"></span></div>' +
            '</div>';
        div.addEventListener('click', function() {
            if (isWorker) {
                G.buyWorker();
            } else {
                G.buyUpgrade(key);
            }
            G.ui.updateAll();
        });
        return div;
    }

    /* ─── Build achievements panel ─── */
    G.ui.buildAchievementsPanel = function() {
        var panel = $('achievements-list');
        panel.innerHTML = '';
        G.achievementDefs.forEach(function(a) {
            var div = document.createElement('div');
            div.className = 'achievement-item' + (G.state.achievements[a.id] ? ' unlocked' : '');
            div.innerHTML =
                '<div class="ach-icon">' + a.icon + '</div>' +
                '<div class="ach-info">' +
                    '<div class="ach-name">' + a.name + '</div>' +
                    '<div class="ach-desc">' + a.desc + '</div>' +
                    (a.bonus ? '<div class="ach-bonus">' + a.bonus + '</div>' : '') +
                '</div>';
            panel.appendChild(div);
        });
    };

    /* ─── Update all UI ─── */
    G.ui.updateAll = function() {
        var s = G.state;

        // Header stats
        $('gold-display').textContent = G.formatNumber(s.gold);
        $('gps-display').textContent = G.formatNumber(G.getGoldPerSecond()) + '/sec';
        $('click-power-display').textContent = G.formatNumber(G.getClickPower()) + '/click';

        // Update upgrade buttons
        var btns = document.querySelectorAll('.upgrade-btn');
        btns.forEach(function(btn) {
            var key = btn.dataset.key;
            var isWorker = btn.dataset.worker === '1';
            var cost, owned;
            if (isWorker) {
                cost = G.getWorkerCost();
                owned = s.workers;
            } else {
                cost = G.getUpgradeCost(key);
                owned = s.upgrades[key];
            }
            btn.querySelector('.cost-val').textContent = G.formatNumber(cost);
            btn.querySelector('.owned-val').textContent = owned;
            if (s.gold >= cost) {
                btn.classList.add('affordable');
                btn.classList.remove('locked');
            } else {
                btn.classList.remove('affordable');
                btn.classList.add('locked');
            }
        });

        // Prestige info
        var reward = G.getPrestigeReward();
        $('prestige-reward').textContent = reward;
        $('prestige-stardust').textContent = s.starDust;
        $('prestige-multiplier').textContent = s.prestigeMultiplier.toFixed(2) + 'x';
        $('prestige-count').textContent = s.prestigeCount;
        var prestigeBtn = $('prestige-btn');
        if (reward > 0) {
            prestigeBtn.classList.add('available');
            prestigeBtn.classList.remove('locked');
        } else {
            prestigeBtn.classList.remove('available');
            prestigeBtn.classList.add('locked');
        }

        // Stats panel
        $('stat-clicks').textContent = G.formatNumber(s.clickCount);
        $('stat-total-gold').textContent = G.formatNumber(s.totalGoldAllTime);
        $('stat-prestiges').textContent = s.prestigeCount;
        $('stat-achievements').textContent = Object.keys(s.achievements).length + '/' + G.achievementDefs.length;

        // Miner visual - show/hide based on workers
        updateMineVisual();
    };

    /* ─── Mine visual upgrades ─── */
    function updateMineVisual() {
        var s = G.state;
        var scene = $('mine-scene');
        // Toggle visual classes based on upgrades
        scene.classList.toggle('has-workers', s.workers > 0);
        scene.classList.toggle('has-carts', s.upgrades.mineCart > 0);
        scene.classList.toggle('has-dynamite', s.upgrades.dynamite > 0);
        scene.classList.toggle('has-drills', s.upgrades.drillMachine > 0);
        scene.classList.toggle('has-excavators', s.upgrades.excavator > 0);
    }

    /* ─── Achievement toast ─── */
    G.ui.showAchievement = function(a) {
        var toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.innerHTML =
            '<div class="toast-icon">' + a.icon + '</div>' +
            '<div class="toast-text">' +
                '<div class="toast-title">Achievement Unlocked!</div>' +
                '<div class="toast-name">' + a.name + '</div>' +
            '</div>';
        $('toast-container').appendChild(toast);
        setTimeout(function() { toast.classList.add('show'); }, 10);
        setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() { toast.remove(); }, 500);
        }, 3000);

        // Refresh achievements panel
        G.ui.buildAchievementsPanel();
    };

    G.ui.showToast = function(msg) {
        var toast = document.createElement('div');
        toast.className = 'simple-toast';
        toast.textContent = msg;
        $('toast-container').appendChild(toast);
        setTimeout(function() { toast.classList.add('show'); }, 10);
        setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() { toast.remove(); }, 500);
        }, 2000);
    };

    /* ─── Offline progress modal ─── */
    G.ui.showOfflineProgress = function(result) {
        if (!result || result.earned < 1) return;
        var modal = $('offline-modal');
        $('offline-time').textContent = G.formatTime(result.elapsed);
        $('offline-earned').textContent = G.formatNumber(result.earned);
        modal.classList.add('show');
        $('offline-close').onclick = function() {
            modal.classList.remove('show');
        };
    };

    /* ─── Prestige confirmation ─── */
    G.ui.initPrestige = function() {
        $('prestige-btn').addEventListener('click', function() {
            var reward = G.getPrestigeReward();
            if (reward <= 0) return;
            var modal = $('prestige-modal');
            $('prestige-modal-reward').textContent = reward;
            $('prestige-modal-new-mult').textContent =
                G.getPrestigeMultiplier(G.state.starDust + reward).toFixed(2) + 'x';
            modal.classList.add('show');
        });

        $('prestige-confirm').addEventListener('click', function() {
            var result = G.doPrestige();
            if (result) {
                $('prestige-modal').classList.remove('show');
                G.ui.buildUpgradePanel();
                G.ui.buildAchievementsPanel();
                G.ui.updateAll();
                G.save();
                G.ui.showToast('Cave In! Star Dust +' + result.reward);
            }
        });

        $('prestige-cancel').addEventListener('click', function() {
            $('prestige-modal').classList.remove('show');
        });
    };

    /* ─── Tab switching ─── */
    G.ui.initTabs = function() {
        var tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                tabs.forEach(function(t) { t.classList.remove('active'); });
                tab.classList.add('active');
                var target = tab.dataset.tab;
                document.querySelectorAll('.tab-panel').forEach(function(p) {
                    p.classList.toggle('active', p.id === target);
                });
            });
        });
    };

    /* ─── Settings ─── */
    G.ui.initSettings = function() {
        $('save-btn').addEventListener('click', function() {
            G.save();
            G.ui.showToast('Game saved!');
        });

        $('export-btn').addEventListener('click', function() {
            var data = G.exportSave();
            navigator.clipboard.writeText(data).then(function() {
                G.ui.showToast('Save exported to clipboard!');
            }).catch(function() {
                prompt('Copy this save data:', data);
            });
        });

        $('import-btn').addEventListener('click', function() {
            var data = prompt('Paste save data:');
            if (data && G.importSave(data)) {
                G.ui.buildUpgradePanel();
                G.ui.buildAchievementsPanel();
                G.ui.updateAll();
                G.ui.showToast('Save imported!');
            } else if (data) {
                G.ui.showToast('Invalid save data');
            }
        });

        $('reset-btn').addEventListener('click', function() {
            if (confirm('Are you sure? This will delete ALL progress permanently!')) {
                G.deleteSave();
                G.state = G.defaultState();
                G.ui.buildUpgradePanel();
                G.ui.buildAchievementsPanel();
                G.ui.updateAll();
                G.ui.showToast('Game reset');
            }
        });
    };

    /* ─── Main game loop ─── */
    G.ui.startLoop = function() {
        initAmbientParticles();
        var lastUiUpdate = 0;

        function loop(now) {
            G.tick(now);
            updateParticles();
            updateAmbientParticles();

            // Update UI at 10fps for performance
            if (now - lastUiUpdate > 100) {
                G.ui.updateAll();
                lastUiUpdate = now;
            }

            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    };

    /* ─── Boot ─── */
    G.ui.init = function() {
        G.ui.initParticles();
        G.ui.initClickArea();
        G.ui.buildUpgradePanel();
        G.ui.buildAchievementsPanel();
        G.ui.initPrestige();
        G.ui.initTabs();
        G.ui.initSettings();
        G.ui.updateAll();
        G.ui.startLoop();
        G.startAutoSave();
    };

})(window.IdleMine);
