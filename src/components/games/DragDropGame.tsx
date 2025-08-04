import { useState } from 'react';

interface DragDropGameProps {
  challenge: {
    items: string[];
    correctOrder: number[];
  };
  onComplete: (success: boolean) => void;
}

interface DragItem {
  id: number;
  text: string;
  originalIndex: number;
  currentIndex: number;
}

export const DragDropGame = ({ challenge, onComplete }: DragDropGameProps) => {
  const [items, setItems] = useState<DragItem[]>(
    challenge.items.map((item, index) => ({ 
      id: index, 
      text: item, 
      originalIndex: index,
      currentIndex: index 
    })).sort(() => Math.random() - 0.5) // Start shuffled
  );
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, item: DragItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOver(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOver(targetIndex);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    const newItems = [...items];
    const draggedIndex = newItems.findIndex(item => item.id === draggedItem.id);
    
    // Remove the dragged item and insert it at the target position
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, removed);
    
    // Update current indices
    newItems.forEach((item, index) => {
      item.currentIndex = index;
    });

    setItems(newItems);
    setDraggedItem(null);
    setDragOver(null);

    // Check if in correct order
    const isCorrect = newItems.every((item, index) => 
      item.originalIndex === challenge.correctOrder[index]
    );
    
    if (isCorrect) {
      setTimeout(() => onComplete(true), 500);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-lg mb-2">Drag to arrange in correct order:</p>
        <p className="text-sm text-muted-foreground mb-4">
          Expected: {challenge.correctOrder.map(i => challenge.items[i]).join(' → ')}
        </p>
        <div className="space-y-3 max-w-md mx-auto">
          {items.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              className={`p-4 border-2 rounded-lg font-mono text-sm transition-all duration-200 select-none ${
                draggedItem?.id === item.id 
                  ? 'opacity-50 scale-95 bg-primary/10 border-primary' 
                  : dragOver === index 
                    ? 'border-primary bg-primary/5 scale-105' 
                    : 'border-border bg-background hover:bg-primary/5 hover:border-primary/50'
              } cursor-grab active:cursor-grabbing`}
            >
              <div className="flex items-center justify-between">
                <span>{item.text}</span>
                <span className="text-xs text-muted-foreground">⋮⋮</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-primary/5 rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 Drag the code blocks to match the correct React component structure
          </p>
        </div>
      </div>
    </div>
  );
};