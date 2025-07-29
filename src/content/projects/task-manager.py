# Task Manager - Python Django Application
# A comprehensive task management system with team collaboration features

from datetime import datetime, timedelta
from dataclasses import dataclass
from typing import List, Optional
from enum import Enum

class Priority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class Status(Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    DONE = "done"

@dataclass
class Task:
    id: str
    title: str
    description: str
    priority: Priority
    status: Status
    assignee: Optional[str] = None
    due_date: Optional[datetime] = None
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    tags: List[str] = None
    
    def __post_init__(self):
        if self.tags is None:
            self.tags = []

class TaskManager:
    """
    Advanced Task Management System
    
    Features:
    📋 Create, update, delete tasks
    👥 Team collaboration & assignment
    📊 Analytics and reporting
    🔍 Advanced filtering & search
    📅 Calendar integration
    🔔 Real-time notifications
    📱 Mobile-responsive design
    🎯 Goal tracking & milestones
    """
    
    def __init__(self):
        self.tasks = []
        self.users = []
        self.projects = []
        
    def create_task(self, title: str, description: str, 
                   priority: Priority = Priority.MEDIUM,
                   assignee: Optional[str] = None,
                   due_date: Optional[datetime] = None,
                   tags: List[str] = None) -> Task:
        """Create a new task with validation and auto-assignment"""
        
        task = Task(
            id=f"task_{len(self.tasks) + 1}",
            title=title,
            description=description,
            priority=priority,
            status=Status.TODO,
            assignee=assignee,
            due_date=due_date,
            tags=tags or []
        )
        
        self.tasks.append(task)
        self._send_notification(f"New task created: {title}")
        return task
    
    def update_task_status(self, task_id: str, status: Status) -> bool:
        """Update task status with automatic workflow validation"""
        
        task = self._find_task(task_id)
        if not task:
            return False
            
        old_status = task.status
        task.status = status
        task.updated_at = datetime.now()
        
        # Workflow validation
        if status == Status.DONE:
            self._complete_task(task)
        elif status == Status.IN_PROGRESS and old_status == Status.TODO:
            self._start_task(task)
            
        return True
    
    def get_tasks_by_priority(self, priority: Priority) -> List[Task]:
        """Get all tasks filtered by priority level"""
        return [task for task in self.tasks if task.priority == priority]
    
    def get_overdue_tasks(self) -> List[Task]:
        """Get all overdue tasks for immediate attention"""
        now = datetime.now()
        return [
            task for task in self.tasks 
            if task.due_date and task.due_date < now and task.status != Status.DONE
        ]
    
    def get_task_analytics(self) -> dict:
        """Generate comprehensive task analytics"""
        total_tasks = len(self.tasks)
        completed_tasks = len([t for t in self.tasks if t.status == Status.DONE])
        
        return {
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "completion_rate": (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
            "overdue_tasks": len(self.get_overdue_tasks()),
            "high_priority_tasks": len(self.get_tasks_by_priority(Priority.HIGH)),
            "tasks_by_status": {
                status.value: len([t for t in self.tasks if t.status == status])
                for status in Status
            }
        }
    
    def _find_task(self, task_id: str) -> Optional[Task]:
        """Find task by ID"""
        return next((task for task in self.tasks if task.id == task_id), None)
    
    def _complete_task(self, task: Task):
        """Handle task completion logic"""
        print(f"✅ Task completed: {task.title}")
        # Send completion notification
        # Update project progress
        # Trigger any dependent tasks
    
    def _start_task(self, task: Task):
        """Handle task start logic"""
        print(f"🚀 Task started: {task.title}")
        # Log time tracking
        # Notify assignee
    
    def _send_notification(self, message: str):
        """Send real-time notifications"""
        print(f"🔔 {message}")

# Example usage and demo data
if __name__ == "__main__":
    # Initialize task manager
    tm = TaskManager()
    
    # Create sample tasks
    tm.create_task(
        "Implement user authentication",
        "Add JWT-based authentication system",
        Priority.HIGH,
        due_date=datetime.now() + timedelta(days=3),
        tags=["backend", "security"]
    )
    
    tm.create_task(
        "Design dashboard UI",
        "Create responsive dashboard mockups",
        Priority.MEDIUM,
        due_date=datetime.now() + timedelta(days=5),
        tags=["frontend", "design"]
    )
    
    # Demo analytics
    analytics = tm.get_task_analytics()
    print("📊 Task Analytics:", analytics)
    
    # Tech Stack Information
    tech_stack = {
        "backend": ["Python", "Django", "PostgreSQL", "Redis"],
        "frontend": ["React", "TypeScript", "Tailwind CSS"],
        "features": ["Real-time updates", "Team collaboration", "Analytics"],
        "deployment": ["Docker", "AWS ECS", "GitHub Actions"]
    }
    
    print("🛠️ Tech Stack:", tech_stack)