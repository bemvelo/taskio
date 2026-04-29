import subprocess
import sys
import os

def run():
    root = os.path.dirname(os.path.abspath(__file__))
    
    backend_dir = os.path.join(root, "backend")
    frontend_dir = os.path.join(root, "frontend")

    print("🚀 Starting Taskio...")
    print("Backend  → http://localhost:8000")
    print("Frontend → http://localhost:5173")
    print("Press Ctrl+C to stop both\n")

    # Start backend
    backend = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--reload", "--port", "8000"],
        cwd=backend_dir
    )

    # Start frontend
    frontend = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=frontend_dir,
        shell=True
    )

    try:
        backend.wait()
        frontend.wait()
    except KeyboardInterrupt:
        print("\n⛔ Shutting down Taskio...")
        backend.terminate()
        frontend.terminate()
        print("✅ Stopped cleanly.")

if __name__ == "__main__":
    run()