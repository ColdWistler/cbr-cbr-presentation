import re

with open('src/components/visuals/MemoryDiagram.tsx', 'r') as f:
    content = f.read()

# Fix .map((i) => ( patterns by wrapping array in parentheses
# Pattern 1: [0, 1, 2].map((i) => ( -> ([0, 1, 2]).map((i) => (
content = re.sub(r'(\[[\d,\s]+\])\.map\(\((\w)\) => \(', r'(\1).map((\2) => (', content)

# Pattern 2: ['a', 'b'].map((i) => ( -> (['a', 'b']).map((i) => (
content = re.sub(r"(\['[^']+'(?:, '[^']+')*\])" + r"\.map\(\((\w)\) => \(", r'(\1).map((\2) => (', content)

with open('src/components/visuals/MemoryDiagram.tsx', 'w') as f:
    f.write(content)

print('Fixed')