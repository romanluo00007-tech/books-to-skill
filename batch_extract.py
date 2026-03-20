#!/usr/bin/env python3
"""
Batch processor — run extract_cases.py on all raw JSONs in the raw/ folder.

Usage:
    python batch_extract.py [--dry-run]

Expects:
    raw/*.json          — raw book files from S3
    skills/case-library/scripts/extract_cases.py — the extraction script

Outputs to:
    skills/case-library/data/{book_id}_cases.json
"""

import os
import subprocess
import sys
import json

RAW_DIR = "raw"
OUTPUT_DIR = "skills/case-library/data"
SCRIPT = "skills/case-library/scripts/extract_cases.py"

# Map filename → book_id (used in case_id generation)
# Add new books here as you download them
BOOK_REGISTRY = {
    "zero_to_one.json":                 "zero_to_one_thiel",
    "shoe_dog.json":                    "shoe_dog_knight",
    "the_everything_store.json":        "everything_store_bezos",
    "steve_jobs.json":                  "steve_jobs_isaacson",
    "hard_thing_about_hard_things.json":"hard_things_horowitz",
    "creativity_inc.json":              "creativity_inc_catmull",
    "ride_of_a_lifetime.json":          "ride_of_lifetime_iger",
    "snowball.json":                    "snowball_buffett",
    "sam_walton.json":                  "sam_walton",
    "delivering_happiness.json":        "delivering_happiness_hsieh",
    "that_will_never_work.json":        "netflix_randolph",
    "high_output_management.json":      "high_output_grove",
    "bad_blood.json":                   "bad_blood_theranos",
    "working_backwards.json":           "working_backwards_amazon",
    "no_rules_rules.json":              "no_rules_netflix",
    # Elon Musk was already processed from the sample
    "elon_musk.json":                   "elon_musk_isaacson",
}


def get_book_id(filename):
    """Look up book_id from registry, or generate from filename."""
    if filename in BOOK_REGISTRY:
        return BOOK_REGISTRY[filename]
    # Fallback: strip .json and use as id
    return filename.replace(".json", "").replace(" ", "_")


def main():
    dry_run = "--dry-run" in sys.argv

    if not os.path.exists(RAW_DIR):
        print(f"❌ No {RAW_DIR}/ directory found. Create it and add raw book JSONs.")
        sys.exit(1)

    if not os.path.exists(SCRIPT):
        print(f"❌ Extraction script not found at {SCRIPT}")
        sys.exit(1)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    raw_files = sorted([f for f in os.listdir(RAW_DIR) if f.endswith(".json")])
    if not raw_files:
        print(f"❌ No .json files found in {RAW_DIR}/")
        sys.exit(1)

    # Check which are already processed
    existing = set(os.listdir(OUTPUT_DIR))

    print(f"📚 Found {len(raw_files)} raw book files\n")

    for i, filename in enumerate(raw_files, 1):
        book_id = get_book_id(filename)
        output_file = f"{book_id}_cases.json"
        input_path = os.path.join(RAW_DIR, filename)
        output_path = os.path.join(OUTPUT_DIR, output_file)

        # Skip if already processed
        if output_file in existing:
            print(f"  [{i}/{len(raw_files)}] ⏭  {filename} → already have {output_file}")
            continue

        print(f"  [{i}/{len(raw_files)}] 📖 {filename} → {output_file} (book_id: {book_id})")

        cmd = [
            sys.executable, SCRIPT,
            "--input", input_path,
            "--output", output_path,
            "--book-id", book_id,
        ]
        if dry_run:
            cmd.append("--dry-run")

        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
            if result.returncode == 0:
                # Count cases in output
                if not dry_run and os.path.exists(output_path):
                    with open(output_path) as f:
                        data = json.load(f)
                    count = data.get("total_cases", len(data.get("cases", [])))
                    print(f"       ✅ {count} cases extracted\n")
                else:
                    print(f"       ✅ Dry run complete\n")
            else:
                print(f"       ❌ Failed: {result.stderr[:200]}\n")
        except subprocess.TimeoutExpired:
            print(f"       ❌ Timeout (>10 min)\n")
        except Exception as e:
            print(f"       ❌ Error: {e}\n")

    # Summary
    print("\n" + "=" * 50)
    print("📊 Summary")
    final_files = [f for f in os.listdir(OUTPUT_DIR) if f.endswith("_cases.json")]
    total_cases = 0
    for f in sorted(final_files):
        try:
            with open(os.path.join(OUTPUT_DIR, f)) as fh:
                data = json.load(fh)
            n = data.get("total_cases", len(data.get("cases", [])))
            total_cases += n
            print(f"  {f}: {n} cases")
        except:
            print(f"  {f}: (couldn't read)")

    print(f"\n  Total: {len(final_files)} books, {total_cases} cases")
    print("=" * 50)


if __name__ == "__main__":
    main()
