#!/usr/bin/env python3
"""Consolidate all tools JSON files into one for better performance"""

import json
import os

data_dir = "C:/Users/abdel/Desktop/my_sites/Jabarai/assets/data"

# Load all tool files
all_tools = []
files_loaded = []
files_to_delete = []

for i in range(1, 6):
    filepath = f"{data_dir}/tools{i}.json"
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                tools = json.load(f)
                if isinstance(tools, list):
                    all_tools.extend(tools)
                    files_loaded.append(f"tools{i}.json ({len(tools)} tools)")
                    if i > 1:
                        files_to_delete.append(filepath)
        except Exception as e:
            print(f"Error loading tools{i}.json: {e}")

print(f"Loaded: {', '.join(files_loaded)}")
print(f"Total tools: {len(all_tools)}")

# Write consolidated file
consolidated_path = f"{data_dir}/tools.json"
with open(consolidated_path, 'w', encoding='utf-8') as f:
    json.dump(all_tools, f, indent=2)

print(f"\nCreated: tools.json ({len(all_tools)} tools)")

# Delete old files 2-5
for filepath in files_to_delete:
    try:
        os.remove(filepath)
        print(f"Deleted: {os.path.basename(filepath)}")
    except Exception as e:
        print(f"Error deleting {filepath}: {e}")

# Rename tools1.json to tools.json backup
old_tools1 = f"{data_dir}/tools1.json"
if os.path.exists(old_tools1):
    try:
        os.remove(old_tools1)
        print(f"Deleted old tools1.json")
    except Exception as e:
        print(f"Error deleting tools1.json: {e}")

print("\nDone! All tools consolidated into assets/data/tools.json")
