import os
from PIL import Image

SEQUENCE_DIR = "public/images/sequence"

def convert_to_webp():
    if not os.path.exists(SEQUENCE_DIR):
        print(f"Error: {SEQUENCE_DIR} does not exist")
        return

    files = [f for f in os.listdir(SEQUENCE_DIR) if f.endswith('.png')]
    files.sort()
    
    print(f"Found {len(files)} PNG frames. Converting to WebP...")
    
    for filename in files:
        png_path = os.path.join(SEQUENCE_DIR, filename)
        webp_filename = filename.replace('.png', '.webp')
        webp_path = os.path.join(SEQUENCE_DIR, webp_filename)
        
        try:
            with Image.open(png_path) as img:
                # Save as WebP, quality=80 (good balance)
                img.save(webp_path, 'webp', quality=80)
                # Removing original PNG to clean up
                os.remove(png_path)
                # print(f"Converted {filename} -> {webp_filename}")
        except Exception as e:
            print(f"Failed to convert {filename}: {e}")
            
    print(f"Successfully converted {len(files)} frames to WebP.")

if __name__ == "__main__":
    convert_to_webp()
