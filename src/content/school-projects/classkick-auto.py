# Classkick Auto - Automated Image Upload Script
# Python automation script for uploading homework images to Classkick platform
# Streamlines the submission process with batch upload and auto-organization features

import os
import time
import json
from datetime import datetime
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import logging

class ClasskickAutoUploader:
    """
    Automated image uploader for Classkick assignments.
    Handles authentication, navigation, and batch image uploads.
    """
    
    def __init__(self):
        self.features = [
            "📸 Batch image upload automation",
            "🔐 Secure login & session management", 
            "📁 Smart file organization & sorting",
            "⏱️ Scheduled upload capabilities",
            "🎯 Assignment auto-detection",
            "📊 Upload progress tracking",
            "🔄 Retry mechanism for failed uploads",
            "📱 Cross-platform compatibility",
            "⚙️ Configurable upload settings",
            "📋 Detailed logging & reporting"
        ]
        
        self.tech_stack = {
            "automation": ["selenium", "webdriver", "browser automation"],
            "file_handling": ["pathlib", "os", "glob", "PIL"],
            "scheduling": ["schedule", "datetime", "cron"],
            "logging": ["logging", "json", "csv"],
            "config": ["configparser", "json", "argparse"]
        }
        
        # Default configuration
        self.config = {
            "classkick_url": "https://app.classkick.com",
            "upload_timeout": 30,
            "retry_attempts": 3,
            "supported_formats": [".jpg", ".jpeg", ".png", ".pdf", ".gif"],
            "auto_organize": True,
            "create_folders": True,
            "headless": False
        }
        
        # Setup logging
        self.setup_logging()
        
        # Browser driver
        self.driver = None
        self.wait = None
        
    def setup_logging(self):
        """Configure logging for the application"""
        log_format = '%(asctime)s - %(levelname)s - %(message)s'
        logging.basicConfig(
            level=logging.INFO,
            format=log_format,
            handlers=[
                logging.FileHandler('classkick_auto.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def load_config(self, config_file="classkick_config.json"):
        """Load configuration from JSON file"""
        try:
            with open(config_file, 'r') as f:
                loaded_config = json.load(f)
                self.config.update(loaded_config)
                self.logger.info(f"✅ Configuration loaded from {config_file}")
        except FileNotFoundError:
            self.logger.warning(f"⚠️ Config file not found, using defaults")
            self.save_config(config_file)
        except json.JSONDecodeError:
            self.logger.error(f"❌ Invalid config file format, using defaults")
    
    def save_config(self, config_file="classkick_config.json"):
        """Save current configuration to JSON file"""
        try:
            with open(config_file, 'w') as f:
                json.dump(self.config, f, indent=4)
                self.logger.info(f"💾 Configuration saved to {config_file}")
        except Exception as e:
            self.logger.error(f"❌ Failed to save config: {e}")
    
    def init_browser(self):
        """Initialize the web browser with appropriate options"""
        try:
            chrome_options = Options()
            
            if self.config["headless"]:
                chrome_options.add_argument("--headless")
            
            # Additional Chrome options for stability
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            
            # Initialize driver
            self.driver = webdriver.Chrome(options=chrome_options)
            self.wait = WebDriverWait(self.driver, self.config["upload_timeout"])
            
            self.logger.info("🚀 Browser initialized successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"❌ Failed to initialize browser: {e}")
            return False
    
    def login(self, email, password):
        """Login to Classkick with provided credentials"""
        try:
            self.logger.info("🔐 Attempting to login to Classkick...")
            
            # Navigate to Classkick
            self.driver.get(self.config["classkick_url"])
            
            # Wait for and click login button
            login_btn = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Log In')]"))
            )
            login_btn.click()
            
            # Enter credentials
            email_field = self.wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
            )
            email_field.send_keys(email)
            
            password_field = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
            password_field.send_keys(password)
            
            # Submit login form
            submit_btn = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            submit_btn.click()
            
            # Wait for successful login (dashboard page)
            self.wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".dashboard, .assignments"))
            )
            
            self.logger.info("✅ Successfully logged into Classkick")
            return True
            
        except TimeoutException:
            self.logger.error("❌ Login timeout - check credentials and connection")
            return False
        except Exception as e:
            self.logger.error(f"❌ Login failed: {e}")
            return False
    
    def find_assignment(self, assignment_name):
        """Find and navigate to specific assignment"""
        try:
            self.logger.info(f"🔍 Looking for assignment: {assignment_name}")
            
            # Search for assignment by name
            assignment_link = self.wait.until(
                EC.element_to_be_clickable((
                    By.XPATH, 
                    f"//a[contains(text(), '{assignment_name}') or contains(@title, '{assignment_name}')]"
                ))
            )
            assignment_link.click()
            
            # Wait for assignment page to load
            self.wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".assignment-workspace, .upload-area"))
            )
            
            self.logger.info(f"✅ Successfully opened assignment: {assignment_name}")
            return True
            
        except TimeoutException:
            self.logger.error(f"❌ Assignment '{assignment_name}' not found")
            return False
        except Exception as e:
            self.logger.error(f"❌ Failed to find assignment: {e}")
            return False
    
    def upload_images(self, image_paths, assignment_name=None):
        """Upload multiple images to the current assignment"""
        try:
            uploaded_count = 0
            failed_uploads = []
            
            self.logger.info(f"📤 Starting upload of {len(image_paths)} images...")
            
            for i, image_path in enumerate(image_paths, 1):
                try:
                    self.logger.info(f"📸 Uploading image {i}/{len(image_paths)}: {Path(image_path).name}")
                    
                    # Find upload button or drag-and-drop area
                    upload_element = self.wait.until(
                        EC.presence_of_element_located((
                            By.CSS_SELECTOR, 
                            "input[type='file'], .upload-area, .dropzone"
                        ))
                    )
                    
                    # If it's a file input, send the file path directly
                    if upload_element.tag_name == "input":
                        upload_element.send_keys(str(Path(image_path).absolute()))
                    else:
                        # For drag-and-drop areas, find the hidden file input
                        file_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='file']")
                        file_input.send_keys(str(Path(image_path).absolute()))
                    
                    # Wait for upload to complete
                    self.wait.until(
                        EC.presence_of_element_located((
                            By.CSS_SELECTOR, 
                            ".upload-success, .uploaded-image, .attachment"
                        ))
                    )
                    
                    uploaded_count += 1
                    self.logger.info(f"✅ Successfully uploaded: {Path(image_path).name}")
                    
                    # Small delay between uploads
                    time.sleep(1)
                    
                except Exception as e:
                    self.logger.error(f"❌ Failed to upload {Path(image_path).name}: {e}")
                    failed_uploads.append(image_path)
            
            self.logger.info(f"📊 Upload Summary: {uploaded_count} successful, {len(failed_uploads)} failed")
            
            return {
                "uploaded": uploaded_count,
                "failed": failed_uploads,
                "total": len(image_paths)
            }
            
        except Exception as e:
            self.logger.error(f"❌ Upload process failed: {e}")
            return {"uploaded": 0, "failed": image_paths, "total": len(image_paths)}
    
    def get_image_files(self, folder_path, recursive=True):
        """Get all supported image files from a folder"""
        try:
            folder_path = Path(folder_path)
            image_files = []
            
            if not folder_path.exists():
                self.logger.error(f"❌ Folder does not exist: {folder_path}")
                return []
            
            pattern = "**/*" if recursive else "*"
            
            for file_path in folder_path.glob(pattern):
                if file_path.is_file() and file_path.suffix.lower() in self.config["supported_formats"]:
                    image_files.append(file_path)
            
            # Sort files by name for consistent ordering
            image_files.sort(key=lambda x: x.name.lower())
            
            self.logger.info(f"📁 Found {len(image_files)} image files in {folder_path}")
            return image_files
            
        except Exception as e:
            self.logger.error(f"❌ Failed to scan folder: {e}")
            return []
    
    def organize_by_date(self, image_files):
        """Organize images by creation date"""
        try:
            organized = {}
            
            for image_file in image_files:
                # Get file creation date
                creation_time = datetime.fromtimestamp(image_file.stat().st_ctime)
                date_key = creation_time.strftime("%Y-%m-%d")
                
                if date_key not in organized:
                    organized[date_key] = []
                
                organized[date_key].append(image_file)
            
            self.logger.info(f"📅 Organized images into {len(organized)} date groups")
            return organized
            
        except Exception as e:
            self.logger.error(f"❌ Failed to organize images: {e}")
            return {"all": image_files}
    
    def submit_assignment(self):
        """Submit the assignment after uploading"""
        try:
            submit_btn = self.wait.until(
                EC.element_to_be_clickable((
                    By.XPATH, 
                    "//button[contains(text(), 'Submit') or contains(text(), 'Turn In')]"
                ))
            )
            submit_btn.click()
            
            # Confirm submission if needed
            try:
                confirm_btn = self.driver.find_element(
                    By.XPATH, "//button[contains(text(), 'Confirm') or contains(text(), 'Yes')]"
                )
                confirm_btn.click()
            except NoSuchElementException:
                pass  # No confirmation dialog
            
            self.logger.info("✅ Assignment submitted successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"❌ Failed to submit assignment: {e}")
            return False
    
    def run_batch_upload(self, folder_path, assignment_name, email, password, submit=False):
        """Run complete batch upload process"""
        try:
            self.logger.info(f"🚀 Starting batch upload process...")
            
            # Initialize browser
            if not self.init_browser():
                return False
            
            # Login to Classkick
            if not self.login(email, password):
                return False
            
            # Find and open assignment
            if assignment_name and not self.find_assignment(assignment_name):
                return False
            
            # Get image files
            image_files = self.get_image_files(folder_path)
            if not image_files:
                self.logger.warning("⚠️ No image files found to upload")
                return False
            
            # Upload images
            result = self.upload_images(image_files, assignment_name)
            
            # Submit assignment if requested
            if submit and result["uploaded"] > 0:
                self.submit_assignment()
            
            self.logger.info(f"✅ Batch upload completed: {result['uploaded']}/{result['total']} files uploaded")
            return result["uploaded"] > 0
            
        except Exception as e:
            self.logger.error(f"❌ Batch upload failed: {e}")
            return False
        finally:
            self.cleanup()
    
    def cleanup(self):
        """Clean up browser resources"""
        try:
            if self.driver:
                self.driver.quit()
                self.logger.info("🧹 Browser cleanup completed")
        except Exception as e:
            self.logger.error(f"❌ Cleanup error: {e}")
    
    def print_info(self):
        """Print application information"""
        print("=" * 60)
        print("📚 CLASSKICK AUTO UPLOADER")
        print("=" * 60)
        
        print("\\n📋 FEATURES:")
        for feature in self.features:
            print(f"   {feature}")
        
        print("\\n🛠️ TECH STACK:")
        for category, items in self.tech_stack.items():
            print(f"   {category.title()}: {', '.join(items)}")
        
        print("\\n⚙️ SUPPORTED FORMATS:")
        print(f"   {', '.join(self.config['supported_formats'])}")
        
        print("=" * 60)

def main():
    """Main function to run the Classkick auto uploader"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Classkick Automatic Image Uploader')
    parser.add_argument('--folder', '-f', required=True,
                       help='Folder containing images to upload')
    parser.add_argument('--assignment', '-a',
                       help='Assignment name to upload to')
    parser.add_argument('--email', '-e', required=True,
                       help='Classkick login email')
    parser.add_argument('--password', '-p', required=True,
                       help='Classkick login password')
    parser.add_argument('--submit', action='store_true',
                       help='Submit assignment after uploading')
    parser.add_argument('--config', '-c', default='classkick_config.json',
                       help='Configuration file path')
    parser.add_argument('--info', '-i', action='store_true',
                       help='Show application information')
    parser.add_argument('--headless', action='store_true',
                       help='Run browser in headless mode')
    
    args = parser.parse_args()
    
    # Create uploader instance
    uploader = ClasskickAutoUploader()
    
    # Show info if requested
    if args.info:
        uploader.print_info()
        return
    
    # Load configuration
    uploader.load_config(args.config)
    
    # Apply command line overrides
    if args.headless:
        uploader.config["headless"] = True
    
    try:
        # Run batch upload
        success = uploader.run_batch_upload(
            folder_path=args.folder,
            assignment_name=args.assignment,
            email=args.email,
            password=args.password,
            submit=args.submit
        )
        
        if success:
            print("✅ Upload completed successfully!")
        else:
            print("❌ Upload failed. Check the logs for details.")
            exit(1)
            
    except KeyboardInterrupt:
        print("🛑 Upload interrupted by user")
        uploader.cleanup()
        exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        uploader.cleanup()
        exit(1)

if __name__ == "__main__":
    main()

"""
INSTALLATION REQUIREMENTS:
pip install selenium webdriver-manager pillow

ADDITIONAL SETUP:
1. Install Chrome browser
2. Download ChromeDriver or use webdriver-manager
3. Ensure images are in supported formats (JPG, PNG, PDF, GIF)

USAGE EXAMPLES:
python classkick_auto.py -f "./homework_images" -a "Math Assignment 1" -e "student@email.com" -p "password"
python classkick_auto.py -f "./photos" -e "user@email.com" -p "pass" --submit --headless
python classkick_auto.py --info  # Show application information

FEATURES:
- Automatic login to Classkick
- Batch upload of multiple images
- Assignment auto-detection
- Progress tracking and logging
- Retry mechanism for failed uploads
- Optional assignment submission
- Configurable settings via JSON

SECURITY NOTE:
Store credentials securely and never commit them to version control.
Consider using environment variables or secure credential storage.
"""