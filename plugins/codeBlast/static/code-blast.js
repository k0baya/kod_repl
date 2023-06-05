/*
Based on Joel Besada's lovely experiment
https://twitter.com/JoelBesada/status/670343885655293952
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.codeBlastAce = factory();
  }
}(this, function () {
  return function (ace) {
	function codeBlast(editor, effect,shakeTimes) {
		var editorCtn = editor.container;

		var shakeTime = 0,
			shakeTimeMax = 0,
			shakeIntensity = 5,
			lastTime = 0,
			particles = [],
			particlePointer = 0,
			MAX_PARTICLES = 500,
			PARTICLE_NUM_RANGE = { min: 5, max: 10 },
			PARTICLE_GRAVITY = 0.08,
			PARTICLE_ALPHA_FADEOUT = 0.96,
			PARTICLE_VELOCITY_RANGE = {
				x: [-1, 1],
				y: [-3.5, -1.5]
			},
			w = window.innerWidth,
			h = window.innerHeight,
			effect,
			isActive = false;

		if(shakeTimes != undefined){
			shakeIntensity = shakeTimes;
		}

		var canvas, ctx;
		var throttledShake = throttle(shake, 100);
		var throttledSpawnParticles = throttle(spawnParticles, 100);

		function getRGBComponents(node) {
			var color = getComputedStyle(node).color;
			if (color) {
				try {
					return color.match(/(\d+), (\d+), (\d+)/).slice(1);
				} catch(e) {
					return [255, 255, 255];
				}
			} else {
				return [255, 255, 255];
			}
		}

		function intersects(r1, r2) {
			return r1.left < r2.right && r2.left < r1.right &&
	           r1.top < r2.bottom && r2.top < r1.bottom;
		}

		function getCursorPosition() {
			var pos = editor.renderer.$cursorLayer.getPixelPosition();
    	pos.left += editor.renderer.gutterWidth + editorCtn.getClientRects()[0].left - editor.renderer.scrollLeft;
    	pos.top += editorCtn.getClientRects()[0].top - editor.renderer.scrollTop;
	    return pos;
		}

		function spawnParticles(type) {
			var pos = getCursorPosition();
			var classes = '.ace_' + type.split('.').join('.ace_');
			var node = editorCtn.querySelector(classes); //a node that is the same token as ours

			var numParticles = random(PARTICLE_NUM_RANGE.min, PARTICLE_NUM_RANGE.max);
			var color = node ? getRGBComponents(node) : [255,255,255];
			for (var i = numParticles; i--;) {
				particles[particlePointer] = createParticle(pos.left, pos.top, color);
				particlePointer = (particlePointer + 1) % MAX_PARTICLES;
			}
		}

		function createParticle(x, y, color) {
			var p = {
				x: x,
				y: y + 10,
				alpha: 1,
				color: color
			};
			if (effect === 1) {
				p.size = random(2, 4);
				p.vx = PARTICLE_VELOCITY_RANGE.x[0] + Math.random() *
						(PARTICLE_VELOCITY_RANGE.x[1] - PARTICLE_VELOCITY_RANGE.x[0]);
				p.vy = PARTICLE_VELOCITY_RANGE.y[0] + Math.random() *
						(PARTICLE_VELOCITY_RANGE.y[1] - PARTICLE_VELOCITY_RANGE.y[0]);
			} else if (effect === 2) {
				p.size = random(2, 8);
				p.drag = 0.92;
				p.vx = random(-3, 3);
				p.vy = random(-3, 3);
				p.wander = 0.15;
				p.theta = random(0, 360) * Math.PI / 180;
			}
			return p;
		}

		function effect1(particle) {
			particle.vy += PARTICLE_GRAVITY;
			particle.x += particle.vx;
			particle.y += particle.vy;

			particle.alpha *= PARTICLE_ALPHA_FADEOUT;

			ctx.fillStyle = 'rgba('+ particle.color[0] +','+ particle.color[1] +','+ particle.color[2] + ',' + particle.alpha + ')';
			ctx.fillRect(Math.round(particle.x - 1), Math.round(particle.y - 1), particle.size, particle.size);
		}

		// Effect based on Soulwire's demo: http://codepen.io/soulwire/pen/foktm
		function effect2(particle) {
			particle.x += particle.vx;
			particle.y += particle.vy;
			particle.vx *= particle.drag;
			particle.vy *= particle.drag;
			particle.theta += random( -0.5, 0.5 );
			particle.vx += Math.sin( particle.theta ) * 0.1;
			particle.vy += Math.cos( particle.theta ) * 0.1;
			particle.size *= 0.96;

			ctx.fillStyle = 'rgba('+ particle.color[0] +','+ particle.color[1] +','+ particle.color[2] + ',' + particle.alpha + ')';
			ctx.beginPath();
			ctx.arc(Math.round(particle.x - 1), Math.round(particle.y - 1), particle.size, 0, 2 * Math.PI);
			ctx.fill();
		}

		function drawParticles(timeDelta) {
			var particle;
			for (var i = particles.length; i--;) {
    		particle = particles[i];
				if (!particle || particle.alpha < 0.01 || particle.size <= 0.5) {
					continue;
				}

				switch (effect) {
					case 1:
						effect1(particle);
						break;
					case 2:
						effect2(particle);
						break;
				}
			}

			if (particles.length > 200) {
				//cleanup old particles (only when > 200, to prevent frequent copying)
				particles = particles.filter(function (particle) {
					return particle.alpha >= 0.01 && particle.size > 0.5;
				});
			}
		}

		function shake(time) {
			shakeTime = shakeTimeMax = time;
		}

		function random(min, max) {
			if (!max) { max = min; min = 0; }
			return min + ~~(Math.random() * (max - min + 1))
		}

		function throttle (callback, limit) {
			var wait = false;
			return function () {
				if (!wait) {
					callback.apply(this, arguments);
					wait = true;
					setTimeout(function () {
						wait = false;
					}, limit);
				}
			}
		}

		function loop() {
			if (!isActive) { return; }

			ctx.clearRect(0, 0, w, h);

			// get the time past the previous frame
			var current_time = new Date().getTime();
			if(!lastTime) last_time = current_time;
			var dt = (current_time - lastTime) / 1000;
			lastTime = current_time;

			if (shakeTime > 0) {
				shakeTime -= dt;
				var magnitude = (shakeTime / shakeTimeMax) * shakeIntensity;
				var shakeX = random(-magnitude, magnitude);
				var shakeY = random(-magnitude, magnitude);
				editorCtn.style.transform = 'translate(' + shakeX + 'px,' + shakeY + 'px)';
			}
			drawParticles();
			requestAnimationFrame(loop);
		}

		function onCodeMirrorChange(e) {
			setTimeout(function() {
				if (!e) e = { start: editor.getCursorPosition() };
				throttledShake(0.3);
				var pos = e.action == 'insert' ? e.end : e.start;
				var token = editor.session.getTokenAt(pos.row, pos.column);
				if (token) {
					throttledSpawnParticles(token.type);
				}
			});
		}


		function init() {
			canvas = document.createElement('canvas');
			ctx = canvas.getContext('2d'),

			canvas.id = 'code-blast-canvas'
			canvas.style.position = 'fixed';
			canvas.style.top = 0;
			canvas.style.left = 0;
			canvas.style.zIndex = 2147483647;
			canvas.style.pointerEvents = 'none';
			canvas.width = w;
			canvas.height = h;

			document.body.appendChild(canvas);
			window.addEventListener('resize', resizeCanvas);

			isActive = true;
			loop();

			editor.on("change", onCodeMirrorChange);
		}
		function resizeCanvas() {
			canvas.width = w = window.innerWidth;
			canvas.height = h = window.innerHeight;
		}

		function destroy() {
			isActive = false;
			editor.off('change', onCodeMirrorChange);
			window.removeEventListener('resize', resizeCanvas);
			editorCtn.style.transform = '';
			if (canvas) { canvas.remove(); }
		}

		init();
		return {
			destroy: destroy,
			blastAway: onCodeMirrorChange
		};
	};

	var Editor = (ace.require || ace.acequire)('ace/editor').Editor;
	var config = (ace.require || ace.acequire)('ace/config');
	config.defineOptions(Editor.prototype, 'editor', {
		blastCode: {
			set: function (val) {
				if (this._codeBlast) {
					this._codeBlast.destroy();
					this._codeBlast = null;
				}
				if (val) {
					var effect = val == true ? 2 : (val || {}).effect || 2;
					var shakeTimes = val == true ? 5 : (val || {}).shakeTimes;
					this._codeBlast = codeBlast(this, effect,shakeTimes);
				} 
			},
			value: false
		}
	});
  }
}));
