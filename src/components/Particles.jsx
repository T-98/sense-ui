import React, { useRef, useEffect } from "react";
import { useMousePosition } from "../util/mouse";

export default function Particles({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  refresh = false,
}) {
  const canvasRef = useRef(null);
  const context = useRef(null);
  const circles = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });
  const canvasSize = useRef({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  useEffect(() => {
    if (!canvasRef.current) return;
    context.current = canvasRef.current.getContext("2d");
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, []);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  function initCanvas() {
    resizeCanvas();
    drawParticles();
  }

  function resizeCanvas() {
    if (!canvasRef.current || !context.current) return;
    circles.current = [];
    canvasSize.current.w = window.innerWidth;
    canvasSize.current.h = window.innerHeight;
    canvasRef.current.width = canvasSize.current.w * dpr;
    canvasRef.current.height = canvasSize.current.h * dpr;
    canvasRef.current.style.width = `${canvasSize.current.w}px`;
    canvasRef.current.style.height = `${canvasSize.current.h}px`;
    context.current.scale(dpr, dpr);
  }

  function circleParams() {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const size = Math.floor(Math.random() * 2) + 0.1;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.2;
    const dy = (Math.random() - 0.5) * 0.2;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  }

  function drawCircle(circle) {
    if (!context.current) return;
    context.current.beginPath();
    context.current.arc(
      circle.x + circle.translateX,
      circle.y + circle.translateY,
      circle.size,
      0,
      2 * Math.PI
    );
    context.current.fillStyle = `rgba(255, 255, 255, ${circle.alpha})`;
    context.current.fill();
    context.current.closePath();
  }

  function clearContext() {
    if (!context.current || !canvasSize.current) return;
    context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
  }

  function drawParticles() {
    clearContext();
    for (let i = 0; i < quantity; i++) {
      const circle = circleParams();
      circles.current.push(circle);
      drawCircle(circle);
    }
  }

  function remapValue(value, start1, end1, start2, end2) {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  }

  function animate() {
    clearContext();
    circles.current.forEach((circle, i) => {
      // Handle edge cases
      const edge = [
        circle.x + circle.translateX - circle.size, // Distance to left edge
        canvasSize.current.w - circle.x - circle.translateX - circle.size, // Distance to right edge
        circle.y + circle.translateY - circle.size, // Distance to top edge
        canvasSize.current.h - circle.y - circle.translateY - circle.size, // Distance to bottom edge
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
      );

      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha)
          circle.alpha = circle.targetAlpha;
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx;
      circle.y += circle.dy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease;

      // Handle boundary conditions
      if (
        circle.x + circle.translateX < -50 ||
        circle.x + circle.translateX > canvasSize.current.w + 50 ||
        circle.y + circle.translateY < -50 ||
        circle.y + circle.translateY > canvasSize.current.h + 50
      ) {
        circles.current[i] = circleParams();
        return;
      }
      drawCircle(circle);
    });
    window.requestAnimationFrame(animate);
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
