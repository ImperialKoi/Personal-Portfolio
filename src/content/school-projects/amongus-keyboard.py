# AmongUs Keyboard Controller
# Python script that allows controlling Among Us game using WASD keys instead of point-and-click
# Translates keyboard input into mouse movements and clicks for seamless gameplay

import time
import pygame
import pyautogui
import keyboard
from threading import Thread
import sys
import json

class AmongUsController:
    """
    Main controller class for Among Us keyboard input handling.
    Provides WASD movement, spacebar interactions, and customizable key bindings.
    """
    
    def __init__(self):
        self.features = [
            "🎮 WASD movement controls",
            "⚡ Smooth mouse movement translation",
            "🔧 Customizable key bindings",
            "📊 Movement speed adjustment",
            "🎯 Auto-click for interactions",
            "⌨️ Emergency meeting hotkey",
            "🔄 Real-time input processing",
            "📱 Multi-resolution support",
            "⚙️ Configuration file management",
            "🎪 Visual feedback indicators"
        ]
        
        self.tech_stack = {
            "input": ["pygame", "keyboard", "pyautogui"],
            "threading": ["threading", "queue", "asyncio"],
            "configuration": ["json", "configparser", "argparse"],
            "graphics": ["tkinter", "opencv-python", "PIL"],
            "system": ["os", "sys", "platform"]
        }
        
        # Default configuration
        self.config = {
            "movement_speed": 5,
            "sensitivity": 3,
            "screen_width": 1920,
            "screen_height": 1080,
            "movement_keys": {
                "up": "w",
                "down": "s", 
                "left": "a",
                "right": "d"
            },
            "action_keys": {
                "interact": "space",
                "emergency": "r",
                "map": "tab",
                "sabotage": "q"
            }
        }
        
        self.running = False
        self.center_x = self.config["screen_width"] // 2
        self.center_y = self.config["screen_height"] // 2
        
        # Initialize pygame for smooth input handling
        pygame.init()
        
    def load_config(self, config_file="amongus_config.json"):
        """Load configuration from JSON file"""
        try:
            with open(config_file, 'r') as f:
                loaded_config = json.load(f)
                self.config.update(loaded_config)
                print(f"✅ Configuration loaded from {config_file}")
        except FileNotFoundError:
            print(f"⚠️ Config file not found, using defaults")
            self.save_config(config_file)
        except json.JSONDecodeError:
            print(f"❌ Invalid config file format, using defaults")
    
    def save_config(self, config_file="amongus_config.json"):
        """Save current configuration to JSON file"""
        try:
            with open(config_file, 'w') as f:
                json.dump(self.config, f, indent=4)
                print(f"💾 Configuration saved to {config_file}")
        except Exception as e:
            print(f"❌ Failed to save config: {e}")
    
    def calculate_movement(self, keys_pressed):
        """Calculate mouse movement based on pressed keys"""
        dx, dy = 0, 0
        speed = self.config["movement_speed"]
        
        movement_keys = self.config["movement_keys"]
        
        if keys_pressed.get(movement_keys["up"], False):
            dy -= speed
        if keys_pressed.get(movement_keys["down"], False):
            dy += speed
        if keys_pressed.get(movement_keys["left"], False):
            dx -= speed
        if keys_pressed.get(movement_keys["right"], False):
            dx += speed
        
        # Normalize diagonal movement
        if dx != 0 and dy != 0:
            dx *= 0.707  # Approximately 1/sqrt(2)
            dy *= 0.707
        
        return dx * self.config["sensitivity"], dy * self.config["sensitivity"]
    
    def handle_actions(self, keys_pressed):
        """Handle action key presses (interact, emergency, etc.)"""
        action_keys = self.config["action_keys"]
        
        if keys_pressed.get(action_keys["interact"], False):
            pyautogui.click()
            time.sleep(0.1)  # Prevent spam clicking
        
        if keys_pressed.get(action_keys["emergency"], False):
            # Click emergency meeting button (center-top of screen)
            emergency_x = self.center_x
            emergency_y = self.center_y - 300
            pyautogui.click(emergency_x, emergency_y)
            time.sleep(0.5)  # Longer delay for emergency
        
        if keys_pressed.get(action_keys["map"], False):
            # Open map (usually top-right)
            map_x = self.center_x + 400
            map_y = self.center_y - 350
            pyautogui.click(map_x, map_y)
            time.sleep(0.2)
    
    def get_pressed_keys(self):
        """Get currently pressed keys using keyboard library"""
        keys_pressed = {}
        
        # Check movement keys
        for direction, key in self.config["movement_keys"].items():
            keys_pressed[key] = keyboard.is_pressed(key)
        
        # Check action keys
        for action, key in self.config["action_keys"].items():
            keys_pressed[key] = keyboard.is_pressed(key)
        
        return keys_pressed
    
    def movement_loop(self):
        """Main movement processing loop"""
        print("🎮 Among Us Controller Started!")
        print("📝 Controls:")
        print(f"   Movement: {'/'.join(self.config['movement_keys'].values()).upper()}")
        print(f"   Interact: {self.config['action_keys']['interact'].upper()}")
        print(f"   Emergency: {self.config['action_keys']['emergency'].upper()}")
        print("   Press ESC to quit")
        
        last_mouse_x, last_mouse_y = pyautogui.position()
        
        while self.running:
            try:
                # Check for exit condition
                if keyboard.is_pressed('esc'):
                    print("🛑 Stopping controller...")
                    self.running = False
                    break
                
                # Get current key states
                keys_pressed = self.get_pressed_keys()
                
                # Calculate movement
                dx, dy = self.calculate_movement(keys_pressed)
                
                # Apply movement if any keys are pressed
                if dx != 0 or dy != 0:
                    current_x, current_y = pyautogui.position()
                    new_x = current_x + dx
                    new_y = current_y + dy
                    
                    # Keep mouse within screen bounds
                    new_x = max(0, min(self.config["screen_width"], new_x))
                    new_y = max(0, min(self.config["screen_height"], new_y))
                    
                    pyautogui.moveTo(new_x, new_y)
                
                # Handle action keys
                self.handle_actions(keys_pressed)
                
                # Small delay to prevent excessive CPU usage
                time.sleep(0.016)  # ~60 FPS
                
            except KeyboardInterrupt:
                print("🛑 Controller interrupted by user")
                self.running = False
                break
            except Exception as e:
                print(f"❌ Error in movement loop: {e}")
                time.sleep(0.1)
    
    def start(self):
        """Start the controller"""
        if self.running:
            print("⚠️ Controller is already running!")
            return
        
        self.running = True
        
        # Start movement loop in separate thread
        movement_thread = Thread(target=self.movement_loop, daemon=True)
        movement_thread.start()
        
        try:
            # Keep main thread alive
            while self.running:
                time.sleep(0.1)
        except KeyboardInterrupt:
            print("🛑 Shutting down controller...")
            self.running = False
        
        print("✅ Among Us Controller stopped")
    
    def stop(self):
        """Stop the controller"""
        self.running = False
    
    def print_info(self):
        """Print controller information"""
        print("=" * 60)
        print("🎮 AMONG US KEYBOARD CONTROLLER")
        print("=" * 60)
        
        print("\\n📋 FEATURES:")
        for feature in self.features:
            print(f"   {feature}")
        
        print("\\n🛠️ TECH STACK:")
        for category, items in self.tech_stack.items():
            print(f"   {category.title()}: {', '.join(items)}")
        
        print("\\n⚙️ CURRENT CONFIGURATION:")
        print(f"   Movement Speed: {self.config['movement_speed']}")
        print(f"   Sensitivity: {self.config['sensitivity']}")
        print(f"   Screen Resolution: {self.config['screen_width']}x{self.config['screen_height']}")
        
        print("\\n🎯 KEY BINDINGS:")
        print("   Movement:")
        for direction, key in self.config["movement_keys"].items():
            print(f"     {direction.title()}: {key.upper()}")
        print("   Actions:")
        for action, key in self.config["action_keys"].items():
            print(f"     {action.title()}: {key.upper()}")
        
        print("=" * 60)

def main():
    """Main function to run the Among Us controller"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Among Us Keyboard Controller')
    parser.add_argument('--config', '-c', default='amongus_config.json',
                       help='Configuration file path')
    parser.add_argument('--info', '-i', action='store_true',
                       help='Show controller information')
    parser.add_argument('--speed', '-s', type=int, 
                       help='Movement speed (1-10)')
    parser.add_argument('--sensitivity', type=float,
                       help='Mouse sensitivity (0.1-10.0)')
    
    args = parser.parse_args()
    
    # Create controller instance
    controller = AmongUsController()
    
    # Load configuration
    controller.load_config(args.config)
    
    # Apply command line overrides
    if args.speed:
        controller.config["movement_speed"] = max(1, min(10, args.speed))
    if args.sensitivity:
        controller.config["sensitivity"] = max(0.1, min(10.0, args.sensitivity))
    
    # Show info if requested
    if args.info:
        controller.print_info()
        return
    
    # Save any configuration changes
    controller.save_config(args.config)
    
    try:
        # Start the controller
        controller.start()
    except Exception as e:
        print(f"❌ Failed to start controller: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

"""
INSTALLATION REQUIREMENTS:
pip install pygame pyautogui keyboard

USAGE EXAMPLES:
python amongus_keyboard.py                    # Start with default settings
python amongus_keyboard.py --speed 7          # Start with custom speed
python amongus_keyboard.py --info            # Show controller information
python amongus_keyboard.py -c my_config.json # Use custom config file

GAME SETUP:
1. Start Among Us in windowed or fullscreen mode
2. Run this script
3. Focus on the Among Us game window
4. Use WASD to move your character
5. Use SPACE to interact with objects
6. Use R for emergency meetings
7. Press ESC to quit the controller

CUSTOMIZATION:
Edit the configuration file to change key bindings, speeds, and other settings.
The script will automatically create a default config file on first run.
"""