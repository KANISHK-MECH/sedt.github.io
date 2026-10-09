import math
import random
import subprocess
import os

width = 1200
height = 800

# Deterministic seed for reproducible crisp structure
random.seed(42)

# Thermal Ironbow / Inferno palette mapping with continuous smooth interpolation
# 0.0 (Coldest - ~25°C): Deep Navy / Black-Purple
# 0.2 (~35°C): Deep Indigo / Violet (Standard operational PV cell)
# 0.4 (~45°C): Vibrant Magenta / Purple (Elevated baseline)
# 0.6 (~55°C): Crimson / Fiery Orange-Red (Ground / mounting rack)
# 0.8 (~68°C): Glowing Golden Amber / Yellow (Hot ground / moderate hotspot)
# 1.0 (~85°C+): Intense White-Yellow (Severe hotspot anomaly / diode failure)

PALETTE_STOPS = [
    (0.00, (12, 3, 28)),
    (0.08, (24, 5, 52)),
    (0.18, (48, 8, 92)),
    (0.28, (82, 10, 118)),
    (0.40, (138, 14, 112)),
    (0.52, (196, 32, 68)),
    (0.65, (238, 86, 16)),
    (0.78, (254, 158, 6)),
    (0.88, (255, 218, 28)),
    (0.96, (255, 248, 140)),
    (1.00, (255, 255, 255)),
]

def get_color(val):
    val = max(0.0, min(1.0, val))
    for i in range(len(PALETTE_STOPS) - 1):
        v1, c1 = PALETTE_STOPS[i]
        v2, c2 = PALETTE_STOPS[i+1]
        if v1 <= val <= v2:
            t = (val - v1) / (v2 - v1)
            r = int(c1[0] + t * (c2[0] - c1[0]))
            g = int(c1[1] + t * (c2[1] - c1[1]))
            b = int(c1[2] + t * (c2[2] - c1[2]))
            return (r, g, b)
    return PALETTE_STOPS[-1][1]

# Setup Temperature grid
temp_map = [0.0] * (width * height)

# 1. Background Ground Temperature (warm dirt/gravel reflecting high ambient sun)
# Base ground value is high (around 0.68 - 0.78), glowing orange/amber
for y in range(height):
    for x in range(width):
        noise = (math.sin(x * 0.08) * math.cos(y * 0.08) * 0.04 +
                 math.sin(x * 0.025 + y * 0.015) * 0.05 +
                 (random.random() - 0.5) * 0.06)
        temp_map[y * width + x] = 0.72 + noise

# 2. Add Vertical Road Corridor at X = 285 to 330
for y in range(height):
    for x in range(width):
        # Road center ~ 308
        dist_road = abs(x - 308)
        if dist_road < 28:
            road_noise = (random.random() - 0.5) * 0.05
            track = 0.05 if (dist_road in (8, 9, 10, 18, 19, 20)) else 0.0
            temp_map[y * width + x] = max(temp_map[y * width + x], 0.78 + track + road_noise)

# 3. Far right boundary path
for y in range(height):
    for x in range(1160, width):
        temp_map[y * width + x] = 0.58 + (random.random() - 0.5) * 0.08

# 4. Solar Panel Rows (18 Rows)
num_rows = 18
start_y = 12
row_pitch = 43.5 # row height (~28) + gap (~15.5)
row_height = 28.0

# Table segments along X:
# Left block: X = 18 to 288
# Right block 1: X = 332 to 740
# Right block 2: X = 744 to 1158

panels = []

for r in range(num_rows):
    ry = int(start_y + r * row_pitch)
    rh = int(row_height)
    if ry + rh >= height:
        break
    
    # Left segment
    panels.append((18, ry, 288, ry + rh, r))
    # Right segment 1
    panels.append((332, ry, 740, ry + rh, r))
    # Right segment 2
    panels.append((744, ry, 1158, ry + rh, r))

# Render normal solar panels (cold/operational purple/indigo)
for (x1, y1, x2, y2, r_idx) in panels:
    # Cell pitch: individual PV cell width is ~10-12px
    for y in range(y1, y2):
        if y < 0 or y >= height:
            continue
        # Distance to top/bottom edge of panel
        edge_dist_y = min(y - y1, y2 - 1 - y)
        for x in range(x1, x2):
            if x < 0 or x >= width:
                continue
            
            # Module spacing: every 55px there is a module gap
            mod_pos_x = (x - x1) % 55
            cell_pos_x = (x - x1) % 11
            
            # Normal cell baseline temp: ~0.19 (Dark purple/indigo)
            cell_noise = ((x * 17 + y * 29) % 13 - 6) * 0.003
            t_cell = 0.20 + cell_noise
            
            # Busbars and cell edges: thin dark lines
            if cell_pos_x == 0 or cell_pos_x == 10:
                t_cell -= 0.04
            
            # Module frame (metal aluminum frame reflecting rack thermal gradient)
            if mod_pos_x == 0 or mod_pos_x == 1:
                t_cell = 0.35 # Cooler frame gap
            
            # Panel top and bottom edges (rack heat leak)
            if edge_dist_y == 0 or edge_dist_y == 1:
                t_cell = 0.42
            elif edge_dist_y == 2:
                t_cell = 0.28
                
            temp_map[y * width + x] = max(0.12, min(0.48, t_cell))

# 5. Hotspots and Thermal Faults matching the real image
# Hotspots are localized temperature spikes (0.85 - 1.0) with Gaussian thermal bleed
HOTSPOTS = [
    # (x, y, radius, intensity, shape)
    # Row 1-3
    (92, int(start_y + 1 * row_pitch + 14), 6, 0.96, 'cell'),
    (185, int(start_y + 1 * row_pitch + 14), 4, 0.88, 'cell'),
    (780, int(start_y + 0 * row_pitch + 12), 4, 0.82, 'cell'),
    # Row 4-6
    (742, int(start_y + 3 * row_pitch + 14), 7, 0.98, 'cell'),
    (170, int(start_y + 3 * row_pitch + 12), 5, 0.90, 'cell'),
    (135, int(start_y + 5 * row_pitch + 14), 6, 0.95, 'cell'),
    (610, int(start_y + 5 * row_pitch + 14), 4, 0.84, 'cell'),
    # Row 7-9
    (885, int(start_y + 6 * row_pitch + 14), 8, 0.97, 'cell'),
    (738, int(start_y + 7 * row_pitch + 14), 7, 0.98, 'cell'),
    (88, int(start_y + 8 * row_pitch + 14), 7, 0.96, 'cell'),
    (158, int(start_y + 8 * row_pitch + 14), 5, 0.88, 'cell'),
    # Row 10-12
    (105, int(start_y + 9 * row_pitch + 14), 8, 0.99, 'cell'),
    (88, int(start_y + 10 * row_pitch + 14), 6, 0.94, 'cell'),
    (162, int(start_y + 10 * row_pitch + 14), 7, 0.95, 'cell'),
    (805, int(start_y + 11 * row_pitch + 14), 7, 0.95, 'cell'),
    # Row 13-15 (Includes bypass diode failure - vertical string of 3 cells)
    (125, int(start_y + 12 * row_pitch + 8), 6, 0.92, 'diode'),
    (125, int(start_y + 12 * row_pitch + 16), 6, 0.95, 'diode'),
    (125, int(start_y + 12 * row_pitch + 22), 6, 0.92, 'diode'),
    (115, int(start_y + 13 * row_pitch + 14), 7, 0.96, 'cell'),
    (835, int(start_y + 14 * row_pitch + 14), 8, 0.98, 'cell'),
    (850, int(start_y + 14 * row_pitch + 14), 5, 0.88, 'cell'),
    # Row 16-18
    (88, int(start_y + 15 * row_pitch + 14), 7, 0.97, 'cell'),
    (430, int(start_y + 16 * row_pitch + 14), 6, 0.91, 'cell'),
    (425, int(start_y + 17 * row_pitch + 14), 7, 0.95, 'cell'),
    (880, int(start_y + 16 * row_pitch + 14), 5, 0.89, 'cell'),
]

for (hx, hy, hr, h_int, h_type) in HOTSPOTS:
    for dy in range(-hr * 3, hr * 3 + 1):
        py = hy + dy
        if py < 0 or py >= height:
            continue
        for dx in range(-hr * 3, hr * 3 + 1):
            px = hx + dx
            if px < 0 or px >= width:
                continue
            
            dist_sq = dx * dx + dy * dy
            sigma_sq = (hr * 0.9) ** 2
            boost = h_int * math.exp(-dist_sq / (2.0 * sigma_sq))
            idx = py * width + px
            temp_map[idx] = max(temp_map[idx], min(1.0, temp_map[idx] + boost))

# 6. Weeds & Vegetation Encroachment (dark patches at bottom center/right)
for y in range(int(height * 0.55), height):
    for x in range(int(width * 0.35), int(width * 0.85)):
        # Scattered organic weed shapes
        w_noise = math.sin(x * 0.06) * math.cos(y * 0.08) + math.sin(x * 0.02 + y * 0.04)
        if w_noise > 0.85 and (y % int(row_pitch)) > int(row_height):
            # Ground weed is cooler than dry soil (around 0.22 - 0.35)
            idx = y * width + x
            temp_map[idx] = min(temp_map[idx], 0.28 + (random.random() - 0.5) * 0.05)

# Convert all pixels to RGB bytes
raw_bytes = bytearray(width * height * 3)
b_idx = 0
for val in temp_map:
    r, g, b = get_color(val)
    raw_bytes[b_idx] = r
    raw_bytes[b_idx + 1] = g
    raw_bytes[b_idx + 2] = b
    b_idx += 3

# Write to PPM file
ppm_path = "thermal_temp.ppm"
with open(ppm_path, "wb") as f:
    header = f"P6\n{width} {height}\n255\n".encode("ascii")
    f.write(header)
    f.write(raw_bytes)

print(f"PPM written: {len(raw_bytes)} bytes")

# Convert to PNG using ImageMagick
dest_paths = [
    "/app/applet/public/images/thermal-image.png",
    "/app/applet/public/images/thermal image.png",
    "/app/applet/public/images/image.png",
    "/app/applet/public/thermal-image.png",
    "/app/applet/public/thermal image.png",
    "/app/applet/public/image.png",
]

for p in dest_paths:
    os.makedirs(os.path.dirname(p), exist_ok=True)
    subprocess.run(["convert", ppm_path, p], check=True)
    print(f"Generated {p}")

os.remove(ppm_path)
print("Done generating all thermal images!")
