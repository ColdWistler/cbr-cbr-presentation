# Case-Based Reasoning for Smart Navigation & Delivery System

A GitHub Pages-ready presentation exploring CBR concepts applied to a last-mile delivery scenario.

## Preview

Open `cbr-presentation.html` in any modern browser to view the presentation.

## Features

- **CBR Cycle Visualization**: Interactive, clickable diagrams showing Retrieve → Reuse → Revise → Retain
- **Case Memory Design**: Both tabular and discrimination tree representations with SVG illustrations
- **Tabular vs Tree-Based Retrieval**: Side-by-side comparison
- **Worked Example**: Step-by-step route adaptation demonstration
- **Case Base Management**: Strategies for preventing growth and handling stale data

## Design Inspiration

- **Anatomy** (anatomy.wheresryan.sh): SVG-based isometric illustrations
- **OriginKit** (originkit.dev): Glassmorphism UI patterns and dark/light themes
- **ReactBits** (reactbits.dev): Interactive component behaviors

## Deployment to GitHub Pages

### Option 1: Main Branch (Recommended for simple sites)
```bash
git init
git add .
git commit -m "Initial CBR presentation"
git branch -M main
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

Settings → Pages → Source: "main branch" → "/ (root)"

### Option 2: gh-pages Branch
```bash
npx gh-pages -d .
```

### Option 3: Custom Domain
Add a `CNAME` file with your domain name, then configure DNS per GitHub Pages docs.

## Technical Details

- Single-file HTML presentation (no build step)
- Pure HTML/CSS/JavaScript (no frameworks)
- Responsive grid layout
- Dark/light theme toggle ready
- Keyboard navigation (Arrow keys)
- SVG-based illustrations

## File Structure

```
presentation/
├── cbr-presentation.html  # Main presentation file
├── README.md              # This file
└── (optional) CNAME        # For custom domains
```

## Key Concepts Covered

### The CBR Cycle
1. **Retrieve**: Find similar past cases
2. **Reuse**: Adapt the solution to new conditions
3. **Revise**: Refine if needed
4. **Retain**: Store the new knowledge

### Index Attributes
- Destination coordinates (x, y, z)
- Time of day (morning, afternoon, evening, night)
- Traffic conditions (light, moderate, heavy)
- Route length and historical success rate

### Case Base Management
- Periodic pruning
- Similarity thresholding
- Versioning
- Caching
- Automatic archiving

## Browser Support

Modern browsers: Chrome, Firefox, Safari, Edge
No external dependencies required.