import os
import shutil
import re

SOURCE_DIR = "frames new"
DEST_DIR = "public/images/sequence"

def migrate():
    if not os.path.exists(SOURCE_DIR):
        print(f"Error: {SOURCE_DIR} does not exist")
        return

    # Ensure dest dir is clean/exists (already ran rm -rf, but good to be safe)
    if not os.path.exists(DEST_DIR):
        os.makedirs(DEST_DIR)

    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith('.png')]
    
    # Sort by the number in the filename frame_XXX
    def extract_number(f):
        match = re.search(r'frame_(\d+)', f)
        return int(match.group(1)) if match else 0
    
    files.sort(key=extract_number)
    
    print(f"Found {len(files)} frames. Starting migration...")
    
    for i, filename in enumerate(files):
        # New name: frame_0000.png, frame_0001.png, ...
        new_name = f"frame_{str(i).zfill(4)}.png"
        src_path = os.path.join(SOURCE_DIR, filename)
        dest_path = os.path.join(DEST_DIR, new_name)
        
        shutil.copy2(src_path, dest_path)
        # print(f"Migrated {filename} -> {new_name}")
        
    print(f"Successfully migrated {len(files)} frames to {DEST_DIR}")

if __name__ == "__main__":
    migrate()
