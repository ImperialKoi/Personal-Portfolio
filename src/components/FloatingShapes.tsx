import { useEffect, useRef } from "react";

interface Shape {
  x: number;
  y: number;
  size: number;
  rotationSpeed: number;
  floatSpeed: number;
  opacity: number;
  rotation: number;  
  type: "circle" | "rectangle" | "triangle";
  direction: { x: number; y: number };
}

const FloatingShapes = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generate shapes
    const generateShapes = (): Shape[] => {
      const shapes: Shape[] = [];
      const totalShapes = 20;
      const types: Array<"circle" | "rectangle" | "triangle"> = ["circle", "rectangle", "triangle"];
      for (let i = 0; i < totalShapes; i++) {
        shapes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 15 + Math.random() * 70,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          floatSpeed: 0.1 + Math.random() * 0.2,
          opacity: 0.15 + Math.random() * 0.1,
          rotation: Math.random() * Math.PI * 2,
          type: types[Math.floor(Math.random() * types.length)],
          direction: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 }
        });
      }
      return shapes;
    };

    shapesRef.current = generateShapes();

    const drawShape = (shape: Shape) => {
      ctx.save();
      ctx.globalAlpha = shape.opacity;
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.fillStyle = '#4b76e5';
      switch (shape.type) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'rectangle':
          ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -shape.size / 2);
          ctx.lineTo(shape.size / 2, shape.size / 2);
          ctx.lineTo(-shape.size / 2, shape.size / 2);
          ctx.closePath();
          ctx.fill();
          break;
      }
      ctx.restore();
    };

    const updateShapes = () => {
      shapesRef.current.forEach(shape => {
        shape.x += shape.direction.x * shape.floatSpeed;
        shape.y += shape.direction.y * shape.floatSpeed;
        shape.rotation += shape.rotationSpeed;
        if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
        if (shape.y < -shape.size) shape.y = canvas.height + shape.size;
        if (shape.y > canvas.height + shape.size) shape.y = -shape.size;
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateShapes();
      shapesRef.current.forEach(drawShape);
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrameRef.current!);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

export default FloatingShapes;