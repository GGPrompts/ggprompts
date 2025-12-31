# Canvas Design Skill - Setup Guide

## Prerequisites

- Python 3.x
- pip (Python package manager)

## Installation

### Option 1: Using Virtual Environment (Recommended)

A virtual environment is already set up in `.venv/`. To use it:

```bash
# Activate the virtual environment
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# When done, deactivate
deactivate
```

### Option 2: Global Installation

```bash
# Install dependencies globally
pip install -r requirements.txt
```

## Dependencies

The skill requires the following Python packages:

- **Pillow (>=12.0.0)** - Image manipulation library for creating and editing canvases

Standard library modules used (no installation needed):
- `math` - Mathematical operations
- `random` - Random number generation

## Verifying Installation

To verify that dependencies are correctly installed:

```bash
python3 -c "from PIL import Image, ImageDraw, ImageFont; print('Dependencies OK')"
```

## Fonts

The skill uses fonts from the `canvas-fonts/` directory. Make sure this directory exists and contains the necessary font files.

## Usage

Once dependencies are installed, the skill can be invoked through Claude Code by asking to create posters, designs, or visual art.

## Troubleshooting

### Pillow Installation Issues

If you encounter issues installing Pillow, you may need system dependencies:

**Ubuntu/Debian:**
```bash
sudo apt-get install python3-dev python3-pip libjpeg-dev zlib1g-dev
```

**macOS:**
```bash
brew install libjpeg
```

**Windows:**
Pillow usually installs without additional dependencies. If issues persist, download the wheel from [https://pypi.org/project/Pillow/](https://pypi.org/project/Pillow/)

### Font Issues

If fonts are missing, check the `canvas-fonts/` directory exists. The skill may download additional fonts as needed.

## Projects

Completed projects are stored in `projects/`. See `projects/README.md` for details.
