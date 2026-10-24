import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Matter from "matter-js";
import gsap from "gsap";
import TechLamp from "../../components/tech/TechLamp.jsx";

export default function PhysicsField({ items }) {
  const field = useRef(null);
  const bodies = useRef([]);
  const engineRef = useRef(null);
  const mouseConstraint = useRef(null);
  const gesture = useRef(null);
  const gravityEnabled = useRef(true);

  // Escaped / Special interaction state
  const [isEscaped, setIsEscaped] = useState(false);
  const escapedStateRef = useRef("inside_card"); // 'inside_card' | 'falling_to_footer' | 'in_footer' | 'floating_to_top' | 'returning_to_card'
  const escapedLampsRef = useRef([]);
  const floatingTweensRef = useRef([]);
  const insideShakeClicksRef = useRef(0);
  const insideShakeTimerRef = useRef(null);
  const outsideShakeClicksRef = useRef(0);
  const outsideShakeTimerRef = useRef(null);

  // Portal container for full-page escaped lamps
  const [portalTarget, setPortalTarget] = useState(null);

  useEffect(() => {
    let container = document.getElementById("physics-escaped-root");
    if (!container) {
      container = document.createElement("div");
      container.id = "physics-escaped-root";
      container.style.position = "absolute";
      container.style.top = "0px";
      container.style.left = "0px";
      container.style.width = "100%";
      container.style.pointerEvents = "none";
      container.style.zIndex = "9999";
      document.body.appendChild(container);
    }
    setPortalTarget(container);

    return () => {
      // Clean up floating tweens on unmount
      floatingTweensRef.current.forEach((t) => t?.kill?.());
      floatingTweensRef.current = [];
      if (insideShakeTimerRef.current)
        clearTimeout(insideShakeTimerRef.current);
      if (outsideShakeTimerRef.current)
        clearTimeout(outsideShakeTimerRef.current);
    };
  }, []);

  // Matter.js engine & Physics Card logic
  useEffect(() => {
    const node = field.current;
    if (!node) return;
    const compact = window.matchMedia("(max-width: 720px)").matches;
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: compact ? 0.8 : 1.05, scale: 0.001 },
    });
    engineRef.current = engine;
    const els = [...node.querySelectorAll("[data-physics-item]")];
    const mouse = Matter.Mouse.create(node);
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    const drag = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.18, damping: 0.1, render: { visible: false } },
    });
    mouseConstraint.current = drag;
    Matter.Composite.add(engine.world, drag);

    const handleTouchMove = (e) => {
      if (drag.constraint.bodyB && e.cancelable) {
        e.preventDefault();
      }
    };
    node.addEventListener("touchmove", handleTouchMove, { passive: false });

    let walls = [];
    const build = () => {
      const { width, height } = node.getBoundingClientRect();
      const compactLayout = width <= 720;
      engine.gravity.y = gravityEnabled.current
        ? compactLayout
          ? 0.95
          : 1.05
        : 0;
      const itemWidth = els[0]?.offsetWidth || (compactLayout ? 46 : 82);
      const itemHeight = els[0]?.offsetHeight || (compactLayout ? 55 : 98);
      const compactGutter = 4;
      const columns = compactLayout
        ? Math.min(
            6,
            Math.max(4, Math.floor((width - 16) / (itemWidth + compactGutter))),
          )
        : Math.max(1, Math.floor(width / (itemWidth + 10)));
      const rows = Math.ceil(els.length / columns);
      const neededHeight = compactLayout
        ? Math.min(320, Math.max(270, rows * 40 + 46))
        : Math.max(420, rows * 73 + 50);
      if (Math.abs(height - neededHeight) > 1)
        node.style.setProperty("--physics-field-height", `${neededHeight}px`);
      walls.forEach((wall) => Matter.Composite.remove(engine.world, wall));
      walls = [
        Matter.Bodies.rectangle(width / 2, height + 300, width + 1200, 600, {
          isStatic: true,
          friction: 0.1,
        }),
        Matter.Bodies.rectangle(-200, height / 2, 400, height * 6, {
          isStatic: true,
        }),
        Matter.Bodies.rectangle(width + 200, height / 2, 400, height * 6, {
          isStatic: true,
        }),
      ];
      Matter.Composite.add(engine.world, walls);
      if (bodies.current.length) {
        bodies.current.forEach((body, index) => {
          const el = body.plugin.el || els[index];
          const halfH = (el?.offsetHeight || (compactLayout ? 55 : 98)) / 2;
          const maxY = height - halfH - 2;
          Matter.Body.setPosition(body, {
            x: Math.min(width - 24, Math.max(24, body.position.x)),
            y: Math.min(maxY, Math.max(28, body.position.y)),
          });
          if (els[index]) {
            body.plugin.el = els[index];
          }
        });
      }
    };
    const width = node.clientWidth;
    const compactLayout = width <= 720;
    const itemWidth = els[0]?.offsetWidth || (compactLayout ? 46 : 82);
    const itemHeight = els[0]?.offsetHeight || (compactLayout ? 55 : 98);
    const compactGutter = 4;
    const columns = compactLayout
      ? Math.min(
          6,
          Math.max(4, Math.floor((width - 16) / (itemWidth + compactGutter))),
        )
      : Math.max(1, Math.floor(width / (itemWidth + 10)));
    const rows = Math.ceil(els.length / columns);
    const neededHeight = compactLayout
      ? Math.min(320, Math.max(270, rows * 40 + 46))
      : Math.max(420, rows * 73 + 50);
    const totalWidth = columns * (itemWidth + compactGutter);
    const startX = compactLayout
      ? Math.max(itemWidth / 2 + 8, (width - totalWidth) / 2 + itemWidth / 2)
      : 44;
    const compactRowStep = compactLayout
      ? Math.min(38, (neededHeight - 44) / Math.max(rows, 1))
      : 73;
    bodies.current = els.map((el, index) => {
      const w = compactLayout
        ? el.offsetWidth || 46
        : Math.max(66, el.offsetWidth || 82);
      const h = compactLayout
        ? el.offsetHeight || 55
        : Math.max(66, el.offsetHeight || 98);
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = compactLayout
        ? startX + col * (itemWidth + compactGutter)
        : 44 + col * (width / columns);
      const y = compactLayout
        ? 12 + row * (compactRowStep || 36) + h / 2
        : 30 + row * 73;
      const body = Matter.Bodies.rectangle(
        x,
        y,
        w * (compactLayout ? 0.72 : 0.84),
        h * (compactLayout ? 0.72 : 0.84),
        {
          restitution: compactLayout ? 0.35 : 0.65,
          friction: compactLayout ? 0.05 : 0.04,
          frictionAir: compactLayout ? 0.012 : 0.009,
          chamfer: { radius: compactLayout ? 6 : 14 },
        },
      );
      body.plugin.el = el;
      return body;
    });
    Matter.Composite.add(engine.world, bodies.current);
    build();

    const constrainDragAndFloor = () => {
      if (escapedStateRef.current !== "inside_card") return;
      const { width, height } = node.getBoundingClientRect();
      const compactLayout = width <= 720;
      if (drag.constraint.bodyB) {
        const body = drag.constraint.bodyB;
        const el = body.plugin.el;
        const halfH = (el?.offsetHeight || (compactLayout ? 55 : 98)) / 2;
        const maxY = height - halfH - 2;
        if (mouse.position.y > maxY) {
          mouse.position.y = maxY;
        }
        if (drag.constraint.pointA && drag.constraint.pointA.y > maxY) {
          drag.constraint.pointA.y = maxY;
        }
        if (body.position.y > maxY) {
          Matter.Body.setPosition(body, { x: body.position.x, y: maxY });
          if (body.velocity.y > 0)
            Matter.Body.setVelocity(body, { x: body.velocity.x, y: 0 });
        }
        if (mouse.position.y > height + 50) {
          drag.constraint.bodyB = null;
        }
      }
    };
    Matter.Events.on(engine, "beforeUpdate", constrainDragAndFloor);

    let frame;
    const tick = () => {
      if (escapedStateRef.current === "inside_card") {
        Matter.Engine.update(engine, 1000 / 60);
        const { width, height } = node.getBoundingClientRect();
        const compactLayout = width <= 720;
        bodies.current.forEach((body) => {
          const el = body.plugin.el;
          const halfH = (el?.offsetHeight || (compactLayout ? 55 : 98)) / 2;
          const halfW = (el?.offsetWidth || (compactLayout ? 46 : 82)) / 2;
          const maxY = height - halfH - 2;
          if (body.position.y > maxY) {
            Matter.Body.setPosition(body, { x: body.position.x, y: maxY });
            if (body.velocity.y > 0) {
              Matter.Body.setVelocity(body, { x: body.velocity.x, y: 0 });
            }
          }
          if (body.position.x < halfW) {
            Matter.Body.setPosition(body, { x: halfW, y: body.position.y });
            if (body.velocity.x < 0) {
              Matter.Body.setVelocity(body, { x: 0, y: body.velocity.y });
            }
          } else if (body.position.x > width - halfW) {
            Matter.Body.setPosition(body, {
              x: width - halfW,
              y: body.position.y,
            });
            if (body.velocity.x > 0) {
              Matter.Body.setVelocity(body, { x: 0, y: body.velocity.y });
            }
          }
          if (el) {
            el.style.transform = `translate3d(${body.position.x - el.offsetWidth / 2}px, ${body.position.y - el.offsetHeight / 2}px, 0) rotate(${body.angle}rad)`;
          }
        });
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const resize = new ResizeObserver(build);
    resize.observe(node);

    // =========================================================================
    // ESCAPE AND RETURN CHOREOGRAPHY
    // =========================================================================

    // =========================================================================
    // ESCAPE AND RETURN CHOREOGRAPHY
    // =========================================================================

    // Trigger 1: Escape from card and smoothly fall into footer (DESKTOP ONLY)
    const triggerEscapeToFooter = () => {
      if (window.innerWidth < 1024) return;
      if (escapedStateRef.current !== "inside_card") return;
      escapedStateRef.current = "falling_to_footer";
      setIsEscaped(true);

      const node = field.current;
      if (!node) return;

      const fieldRect = node.getBoundingClientRect();
      const fieldPageLeft = fieldRect.left + window.scrollX;
      const fieldPageTop = fieldRect.top + window.scrollY;

      // Find the footer container or page bottom
      const footer =
        document.getElementById("contact") || document.querySelector("footer");
      const footerRect = footer ? footer.getBoundingClientRect() : null;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        window.innerHeight,
      );

      const footerPageLeft = footerRect ? footerRect.left + window.scrollX : 0;
      const footerPageTop = footerRect
        ? footerRect.top + window.scrollY
        : docHeight - 600;
      const footerW = footerRect ? footerRect.width : window.innerWidth;
      const footerHeight = footer ? footer.offsetHeight : 500;
      const footerFloorY = footerRect
        ? footerPageTop + footerHeight - 95
        : docHeight - 120;

      // Stop matter constraint
      if (mouseConstraint.current)
        mouseConstraint.current.constraint.bodyB = null;

      // Wait a frame for portal nodes to mount
      requestAnimationFrame(() => {
        const portalNodes = document.querySelectorAll(".physics-portal-lamp");
        if (!portalNodes.length) return;

        let landedCount = 0;

        portalNodes.forEach((lampEl, i) => {
          lampEl.classList.remove("lamp-floating-glow");
          const body = bodies.current[i];
          const startX = body
            ? fieldPageLeft + body.position.x - 41
            : fieldPageLeft + 50;
          const startY = body
            ? fieldPageTop + body.position.y - 49
            : fieldPageTop + 50;
          const startAngle = body ? (body.angle * 180) / Math.PI : 0;

          // Calculate random destination across full footer width
          const targetX =
            footerPageLeft + 45 + Math.random() * Math.max(120, footerW - 90);
          const targetY = footerFloorY - (Math.random() * 40 + 15);
          const targetAngle = (Math.random() - 0.5) * 55;

          // Set starting position at card
          gsap.set(lampEl, {
            x: startX,
            y: startY,
            rotation: startAngle,
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
          });

          // Smooth gravitational fall: pop up slightly then accelerate down to footer with gentle settle
          const popY = startY - (25 + Math.random() * 35);
          const popX = startX + (Math.random() - 0.5) * 60;

          const tl = gsap.timeline({
            delay: i * 0.05 + Math.random() * 0.08,
            onComplete: () => {
              landedCount++;
              lampEl._footerX = targetX;
              lampEl._footerY = targetY;
              lampEl._footerAngle = targetAngle;
              if (landedCount >= portalNodes.length) {
                escapedStateRef.current = "in_footer";
              }
            },
          });

          tl.to(lampEl, {
            x: popX,
            y: popY,
            rotation: startAngle + (Math.random() - 0.5) * 25,
            duration: 0.45,
            ease: "sine.out",
          })
            .to(lampEl, {
              x: targetX,
              y: targetY,
              rotation: targetAngle,
              duration: 2.2 + Math.random() * 0.5,
              ease: "power2.in",
            })
            .to(lampEl, {
              y: targetY - 14,
              duration: 0.22,
              ease: "power1.out",
            })
            .to(lampEl, {
              y: targetY,
              duration: 0.24,
              ease: "power1.in",
            });

          floatingTweensRef.current.push(tl);
        });
      });
    };

    // Trigger 2: Float from footer to top (random places, random order, slow dreamy speed, subtle glow)
    const triggerFloatToTop = () => {
      // Kill any previous tweens
      floatingTweensRef.current.forEach((t) => t?.kill?.());
      floatingTweensRef.current = [];

      escapedStateRef.current = "floating_to_top";
      const portalNodes = Array.from(
        document.querySelectorAll(".physics-portal-lamp"),
      );
      if (!portalNodes.length) return;

      // Randomize array order so they don't launch in a predictable sequence
      const shuffledLamps = portalNodes.slice().sort(() => Math.random() - 0.5);
      const pageWidth = window.innerWidth;

      shuffledLamps.forEach((lampEl, idx) => {
        // Clear footer nudge markers so it doesn't nudge while launching
        lampEl._footerX = undefined;
        lampEl._footerY = undefined;
        lampEl._footerAngle = undefined;

        // Pair launch cadence requested by user:
        // 1st lamp moves -> after 2 seconds, 2nd lamp moves
        // Then 5 seconds delay after the 2nd lamp -> 3rd lamp moves
        // After 2 seconds -> 4th lamp moves
        // Then 5 seconds delay -> 5th lamp moves, and so on.
        const pairIndex = Math.floor(idx / 2);
        const isSecondInPair = idx % 2 === 1;
        const launchDelay = pairIndex * 7 + (isSecondInPair ? 2 : 0);

        // Starting X position is the lamp's current resting X position in the footer
        const startX =
          gsap.getProperty(lampEl, "x") ||
          50 + Math.random() * Math.max(100, pageWidth - 120);

        // Slow, serene, and dreamy upward floating speed (52s to 68s across the entire page)
        const slowFloatDuration = 52 + Math.random() * 16;

        // Horizontal sway parameters
        const swayAmp = 35 + Math.random() * 45;
        const swayDuration = 4.2 + Math.random() * 2.0;
        const swayDirection = Math.random() > 0.5 ? 1 : -1;

        const floatTween = gsap.to(lampEl, {
          y: -220, // floats above the hero section
          duration: slowFloatDuration,
          delay: launchDelay,
          ease: "power1.inOut",
          onStart: () => {
            // Activate subtle luminous glow on the lamp and its inner logo
            lampEl.classList.add("lamp-floating-glow");

            // Natural organic horizontal swaying drift while ascending
            const swayTween = gsap.to(lampEl, {
              x: startX + swayDirection * swayAmp,
              duration: swayDuration,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
            floatingTweensRef.current.push(swayTween);
          },
          onUpdate: function () {
            // When crossing above hero (y <= 300px), smoothly fade and blur out
            const currentPosY = gsap.getProperty(lampEl, "y");
            if (currentPosY <= 300) {
              const blurProgress = Math.min(
                1,
                Math.max(0, (300 - currentPosY) / 380),
              );
              gsap.set(lampEl, {
                filter: `blur(${blurProgress * 20}px)`,
                opacity: Math.max(0, 1 - blurProgress),
                scale: 1 + blurProgress * 0.18,
              });
            }
          },
          onComplete: () => {
            gsap.set(lampEl, { opacity: 0, filter: "blur(20px)" });
            lampEl.classList.remove("lamp-floating-glow");
          },
        });

        floatingTweensRef.current.push(floatTween);
      });
    };

    // Trigger 3: Fall back down from wherever to Physics Card (when gravity turns ON)
    const triggerFallBackToCard = () => {
      // Kill all floating tweens
      floatingTweensRef.current.forEach((t) => t?.kill?.());
      floatingTweensRef.current = [];

      escapedStateRef.current = "returning_to_card";
      const portalNodes = document.querySelectorAll(".physics-portal-lamp");
      if (!portalNodes.length) {
        escapedStateRef.current = "inside_card";
        setIsEscaped(false);
        return;
      }

      const fieldRect = node.getBoundingClientRect();
      const fieldPageLeft = fieldRect.left + window.scrollX;
      const fieldPageTop = fieldRect.top + window.scrollY;
      const fieldW = fieldRect.width;
      const fieldH = fieldRect.height;

      let finishedCount = 0;

      portalNodes.forEach((lampEl, i) => {
        // Remove glow and reset appearance
        lampEl.classList.remove("lamp-floating-glow");
        gsap.set(lampEl, { opacity: 1, filter: "blur(0px)", scale: 1 });

        const targetX = fieldPageLeft + 45 + Math.random() * (fieldW - 90);
        const targetY = fieldPageTop + 30 + Math.random() * (fieldH - 80);
        const targetAngle = (Math.random() - 0.5) * 40;

        gsap.to(lampEl, {
          x: targetX,
          y: targetY,
          rotation: targetAngle,
          duration: 1.3 + Math.random() * 0.4,
          delay: Math.random() * 0.15,
          ease: "power2.in",
          onComplete: () => {
            finishedCount++;
            // Place Matter.js body back in card at landing point
            const body = bodies.current[i];
            if (body) {
              Matter.Body.setPosition(body, {
                x: targetX - fieldPageLeft,
                y: targetY - fieldPageTop,
              });
              Matter.Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 6,
                y: 4 + Math.random() * 6,
              });
              Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);
            }

            if (finishedCount === portalNodes.length) {
              escapedStateRef.current = "inside_card";
              setIsEscaped(false);
              insideShakeClicksRef.current = 0;
              outsideShakeClicksRef.current = 0;
            }
          },
        });
      });
    };

    // Trigger 4: Swoop back to card on 2 shake clicks when outside
    const triggerReturnToCard = () => {
      // Kill all floating tweens
      floatingTweensRef.current.forEach((t) => t?.kill?.());
      floatingTweensRef.current = [];

      escapedStateRef.current = "returning_to_card";
      const portalNodes = document.querySelectorAll(".physics-portal-lamp");
      if (!portalNodes.length) {
        escapedStateRef.current = "inside_card";
        setIsEscaped(false);
        return;
      }

      const fieldRect = node.getBoundingClientRect();
      const fieldPageLeft = fieldRect.left + window.scrollX;
      const fieldPageTop = fieldRect.top + window.scrollY;
      const fieldW = fieldRect.width;
      const fieldH = fieldRect.height;

      let finishedCount = 0;

      portalNodes.forEach((lampEl, i) => {
        lampEl.classList.remove("lamp-floating-glow");
        gsap.set(lampEl, { opacity: 1, filter: "blur(0px)", scale: 1 });

        const targetX = fieldPageLeft + 45 + Math.random() * (fieldW - 90);
        const targetY = fieldPageTop + 30 + Math.random() * (fieldH - 80);
        const targetAngle = (Math.random() - 0.5) * 40;

        gsap.to(lampEl, {
          x: targetX,
          y: targetY,
          rotation: targetAngle,
          duration: 1.1 + Math.random() * 0.25,
          delay: i * 0.025,
          ease: "power3.out",
          onComplete: () => {
            finishedCount++;
            const body = bodies.current[i];
            if (body) {
              Matter.Body.setPosition(body, {
                x: targetX - fieldPageLeft,
                y: targetY - fieldPageTop,
              });
              Matter.Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 4,
                y: (Math.random() - 0.5) * 4,
              });
            }

            if (finishedCount === portalNodes.length) {
              escapedStateRef.current = "inside_card";
              setIsEscaped(false);
              insideShakeClicksRef.current = 0;
              outsideShakeClicksRef.current = 0;
            }
          },
        });
      });
    };

    // Shake event dispatcher listener
    const handleShake = () => {
      if (escapedStateRef.current === "inside_card") {
        // Normal in-card shake
        bodies.current.forEach((body) => {
          Matter.Body.setVelocity(body, {
            x: (Math.random() - 0.5) * 24,
            y: -(8 + Math.random() * 15),
          });
          Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.3);
        });

        // Track clicks towards 3
        insideShakeClicksRef.current += 1;
        if (insideShakeTimerRef.current)
          clearTimeout(insideShakeTimerRef.current);
        insideShakeTimerRef.current = setTimeout(() => {
          insideShakeClicksRef.current = 0;
        }, 3500);

        if (insideShakeClicksRef.current >= 3) {
          insideShakeClicksRef.current = 0;
          if (insideShakeTimerRef.current)
            clearTimeout(insideShakeTimerRef.current);
          if (gravityEnabled.current) {
            triggerEscapeToFooter();
          }
        }
      } else {
        // Outside of physics card: Track clicks towards 2 to return
        outsideShakeClicksRef.current += 1;
        if (outsideShakeTimerRef.current)
          clearTimeout(outsideShakeTimerRef.current);
        outsideShakeTimerRef.current = setTimeout(() => {
          outsideShakeClicksRef.current = 0;
        }, 3500);

        if (outsideShakeClicksRef.current >= 2) {
          outsideShakeClicksRef.current = 0;
          if (outsideShakeTimerRef.current)
            clearTimeout(outsideShakeTimerRef.current);
          triggerReturnToCard();
        }
      }
    };

    // Gravity event dispatcher listener
    const handleGravity = (event) => {
      const enabled = Boolean(event.detail?.enabled);
      gravityEnabled.current = enabled;
      engine.gravity.y = enabled ? (node.clientWidth <= 720 ? 0.8 : 1.05) : 0;

      if (escapedStateRef.current !== "inside_card") {
        if (!enabled && escapedStateRef.current !== "floating_to_top") {
          // Gravity turned OFF while lamps are outside -> Float to top!
          triggerFloatToTop();
        } else if (enabled && escapedStateRef.current === "floating_to_top") {
          // Gravity turned ON while floating -> Fall back to Physics Card!
          triggerFallBackToCard();
        }
      }
    };

    // Interactive mouse nudge over fallen lamps in the footer (mirroring physics card cursor repel)
    const handleFooterNudge = (event) => {
      if (escapedStateRef.current !== "in_footer") return;
      if (event.pointerType === "touch") return;

      const mousePageX = event.pageX ?? event.clientX + window.scrollX;
      const mousePageY = event.pageY ?? event.clientY + window.scrollY;

      const portalNodes = document.querySelectorAll(".physics-portal-lamp");
      if (!portalNodes.length) return;

      portalNodes.forEach((lampEl) => {
        if (lampEl._footerX === undefined || lampEl._footerY === undefined)
          return;

        // Center of compact lamp (82px x 98px)
        const lampCenterX = lampEl._footerX + 41;
        const lampCenterY = lampEl._footerY + 49;

        const dx = lampCenterX - mousePageX;
        const dy = lampCenterY - mousePageY;
        const dist = Math.hypot(dx, dy);

        // 180px distance threshold, matching physics card nudge
        if (dist < 180) {
          const power = Math.pow((180 - dist) / 180, 1.4);
          const pushX = (dx / (dist || 1)) * power * 65;
          const pushY = (dy / (dist || 1)) * power * 40;
          const pushRot = (dx / (dist || 1)) * power * 28;

          gsap.to(lampEl, {
            x: lampEl._footerX + pushX,
            y: Math.min(lampEl._footerY + 14, lampEl._footerY + pushY),
            rotation: lampEl._footerAngle + pushRot,
            duration: 0.22,
            ease: "power2.out",
            overwrite: "auto",
            onComplete: () => {
              if (escapedStateRef.current === "in_footer") {
                gsap.to(lampEl, {
                  x: lampEl._footerX,
                  y: lampEl._footerY,
                  rotation: lampEl._footerAngle,
                  duration: 1.25,
                  ease: "elastic.out(1.1, 0.42)",
                  overwrite: "auto",
                });
              }
            },
          });
        }
      });
    };

    window.addEventListener("reference-physics-shake", handleShake);
    window.addEventListener("reference-physics-gravity", handleGravity);
    window.addEventListener("pointermove", handleFooterNudge, {
      passive: true,
    });

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      Matter.Events.off(engine, "beforeUpdate", constrainDragAndFloor);
      node.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("reference-physics-shake", handleShake);
      window.removeEventListener("reference-physics-gravity", handleGravity);
      window.removeEventListener("pointermove", handleFooterNudge);
      Matter.Engine.clear(engine);
      Matter.Composite.clear(engine.world);
      bodies.current = [];
      mouseConstraint.current = null;
    };
  }, [items]);

  const nudge = (event) => {
    if (isEscaped) return;
    if (event.pointerType === "touch") return;
    if (mouseConstraint.current?.constraint?.bodyB) return;
    const bounds = field.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    bodies.current.forEach((body) => {
      const d = Matter.Vector.sub(body.position, { x, y });
      const distance = Matter.Vector.magnitude(d);
      if (distance < 180) {
        const force = Matter.Vector.mult(
          Matter.Vector.normalise(d),
          (180 - distance) * 0.00015,
        );
        Matter.Body.applyForce(body, body.position, force);
      }
    });
  };

  const startGesture = (event, tech) => {
    gesture.current = {
      id: tech.id,
      x: event.clientX,
      y: event.clientY,
      moved: false,
    };
  };

  const trackGesture = (event, tech) => {
    const current = gesture.current;
    if (!current || current.id !== tech.id) return;
    if (Math.hypot(event.clientX - current.x, event.clientY - current.y) > 8)
      current.moved = true;
  };

  const suppressDragClick = (event, tech) => {
    if (gesture.current?.id === tech.id && gesture.current.moved) {
      event.preventDefault();
      event.stopPropagation();
    }
    gesture.current = null;
  };

  return (
    <div className="physics-field-viewport">
      <div
        className="physics-field"
        ref={field}
        style={{ "--physics-field-height": "460px" }}
        onPointerMove={nudge}
        aria-label="Interactive physics field of technology icons"
      >
        <span className="physics-corner">A TOOLBOX, IN MOTION</span>
        {items.map((tech, index) => (
          <span
            className="physics-item"
            key={tech.id}
            data-physics-item
            style={{
              "--item-index": index,
              opacity: isEscaped ? 0 : 1,
              pointerEvents: isEscaped ? "none" : "auto",
              transition: "opacity 0.2s",
            }}
            onPointerDown={(event) => startGesture(event, tech)}
            onPointerMove={(event) => trackGesture(event, tech)}
            onClickCapture={(event) => suppressDragClick(event, tech)}
            onPointerCancel={() => {
              gesture.current = null;
            }}
          >
            <TechLamp
              tech={tech}
              compact
              className="!rounded-none border-0 bg-transparent shadow-none"
            />
          </span>
        ))}
        <span className="physics-floor">
          {isEscaped
            ? "CLICK SHAKE TWICE TO RECALL LAMPS"
            : "DRAG TO DROP · CLICK TO OPEN"}
        </span>
      </div>

      {/* Full-Page Escaped Lamps Portal */}
      {isEscaped &&
        portalTarget &&
        createPortal(
          <div
            className="physics-escaped-layer pointer-events-none absolute inset-0 z-[9999]"
            aria-hidden="true"
          >
            {items.map((tech) => (
              <div
                key={tech.id}
                className="physics-portal-lamp absolute left-0 top-0 will-change-transform pointer-events-auto"
                style={{
                  transform: "translate3d(-999px, -999px, 0)",
                  "--lamp-color": tech.color || "#62A8E8",
                }}
              >
                <TechLamp
                  tech={tech}
                  compact
                  className="drop-shadow-[0_14px_28px_rgba(0,0,0,0.65)] hover:scale-110 transition-transform cursor-pointer"
                />
              </div>
            ))}
          </div>,
          portalTarget,
        )}
    </div>
  );
}
