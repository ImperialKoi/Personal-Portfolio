# Task Manager Application
# Python CLI-based task management system

import json
import os
from datetime import datetime
from typing import List, Dict, Optional

class Task:
    def __init__(self, id: int, title: str, description: str = "", priority: str = "medium", completed: bool = False):
        self.id = id
        self.title = title
        self.description = description
        self.priority = priority  # low, medium, high
        self.completed = completed
        self.created_at = datetime.now().isoformat()
        self.completed_at = None
    
    def to_dict(self) -> Dict:
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'priority': self.priority,
            'completed': self.completed,
            'created_at': self.created_at,
            'completed_at': self.completed_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'Task':
        task = cls(
            id=data['id'],
            title=data['title'],
            description=data.get('description', ''),
            priority=data.get('priority', 'medium'),
            completed=data.get('completed', False)
        )
        task.created_at = data.get('created_at', datetime.now().isoformat())
        task.completed_at = data.get('completed_at')
        return task

class TaskManager:
    def __init__(self, data_file: str = "tasks.json"):
        self.data_file = data_file
        self.tasks: List[Task] = []
        self.next_id = 1
        self.load_tasks()
    
    def load_tasks(self):
        """Load tasks from JSON file"""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r') as f:
                    data = json.load(f)
                    self.tasks = [Task.from_dict(task_data) for task_data in data.get('tasks', [])]
                    self.next_id = data.get('next_id', 1)
            except (json.JSONDecodeError, KeyError):
                print("Warning: Could not load tasks from file. Starting fresh.")
    
    def save_tasks(self):
        """Save tasks to JSON file"""
        data = {
            'tasks': [task.to_dict() for task in self.tasks],
            'next_id': self.next_id
        }
        with open(self.data_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def add_task(self, title: str, description: str = "", priority: str = "medium") -> Task:
        """Add a new task"""
        task = Task(self.next_id, title, description, priority)
        self.tasks.append(task)
        self.next_id += 1
        self.save_tasks()
        return task
    
    def complete_task(self, task_id: int) -> bool:
        """Mark a task as completed"""
        task = self.get_task(task_id)
        if task and not task.completed:
            task.completed = True
            task.completed_at = datetime.now().isoformat()
            self.save_tasks()
            return True
        return False
    
    def delete_task(self, task_id: int) -> bool:
        """Delete a task"""
        task = self.get_task(task_id)
        if task:
            self.tasks.remove(task)
            self.save_tasks()
            return True
        return False
    
    def get_task(self, task_id: int) -> Optional[Task]:
        """Get a task by ID"""
        return next((task for task in self.tasks if task.id == task_id), None)
    
    def list_tasks(self, show_completed: bool = True, priority_filter: Optional[str] = None) -> List[Task]:
        """List tasks with optional filters"""
        filtered_tasks = self.tasks
        
        if not show_completed:
            filtered_tasks = [task for task in filtered_tasks if not task.completed]
        
        if priority_filter:
            filtered_tasks = [task for task in filtered_tasks if task.priority == priority_filter]
        
        return filtered_tasks
    
    def get_stats(self) -> Dict:
        """Get task statistics"""
        total = len(self.tasks)
        completed = len([task for task in self.tasks if task.completed])
        pending = total - completed
        
        priority_count = {}
        for task in self.tasks:
            if not task.completed:
                priority_count[task.priority] = priority_count.get(task.priority, 0) + 1
        
        return {
            'total': total,
            'completed': completed,
            'pending': pending,
            'priority_breakdown': priority_count
        }

def display_tasks(tasks: List[Task]):
    """Display tasks in a formatted table"""
    if not tasks:
        print("No tasks found.")
        return
    
    print(f"{'ID':<3} {'Title':<30} {'Priority':<8} {'Status':<10} {'Created':<12}")
    print("-" * 75)
    
    for task in tasks:
        status = "✓ Done" if task.completed else "○ Pending"
        created = datetime.fromisoformat(task.created_at).strftime("%Y-%m-%d")
        print(f"{task.id:<3} {task.title[:29]:<30} {task.priority:<8} {status:<10} {created:<12}")

def main():
    """Main CLI interface"""
    tm = TaskManager()
    
    print("🚀 Task Manager CLI")
    print("Commands: add, list, complete, delete, stats, quit")
    
    while True:
        command = input("\n> ").strip().lower()
        
        if command == 'quit' or command == 'q':
            print("Goodbye! 👋")
            break
        
        elif command == 'add':
            title = input("Task title: ").strip()
            if not title:
                print("Title cannot be empty!")
                continue
            
            description = input("Description (optional): ").strip()
            priority = input("Priority (low/medium/high) [medium]: ").strip().lower()
            if priority not in ['low', 'medium', 'high']:
                priority = 'medium'
            
            task = tm.add_task(title, description, priority)
            print(f"✅ Task #{task.id} added successfully!")
        
        elif command == 'list':
            show_completed = input("Show completed tasks? (y/n) [y]: ").strip().lower()
            show_completed = show_completed != 'n'
            
            priority_filter = input("Filter by priority (low/medium/high) or press Enter for all: ").strip().lower()
            if priority_filter not in ['low', 'medium', 'high']:
                priority_filter = None
            
            tasks = tm.list_tasks(show_completed, priority_filter)
            display_tasks(tasks)
        
        elif command == 'complete':
            try:
                task_id = int(input("Task ID to complete: "))
                if tm.complete_task(task_id):
                    print(f"✅ Task #{task_id} marked as completed!")
                else:
                    print("❌ Task not found or already completed!")
            except ValueError:
                print("❌ Please enter a valid task ID!")
        
        elif command == 'delete':
            try:
                task_id = int(input("Task ID to delete: "))
                if tm.delete_task(task_id):
                    print(f"🗑️ Task #{task_id} deleted!")
                else:
                    print("❌ Task not found!")
            except ValueError:
                print("❌ Please enter a valid task ID!")
        
        elif command == 'stats':
            stats = tm.get_stats()
            print("\n📊 Task Statistics:")
            print(f"Total tasks: {stats['total']}")
            print(f"Completed: {stats['completed']}")
            print(f"Pending: {stats['pending']}")
            
            if stats['priority_breakdown']:
                print("\nPending tasks by priority:")
                for priority, count in stats['priority_breakdown'].items():
                    print(f"  {priority.capitalize()}: {count}")
        
        else:
            print("❌ Unknown command. Try: add, list, complete, delete, stats, quit")

if __name__ == "__main__":
    main()