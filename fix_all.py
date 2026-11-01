# Fix all > 4.8 km and ≤ 4.8 km in text content by wrapping in expressions

def fix_file(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()

    new_lines = []
    for line in lines:
        # Replace > 4.8 km in text content (not in expressions)
        if '> 4.8 km' in line:
            # Replace only if it's in text content (not in expressions)
            if '> 4.8 km' in line and '{`' not in line:
                line = line.replace('> 4.8 km', '{` > 4.8 km`}')
        # Fix ≤ 4.8 km
        if '≤ 4.8 km' in line:
            line = line.replace('≤ 4.8 km', '{`&le; 4.8 km`}')
        # Fix &le; 4.8 km if not already wrapped
        if '&le; 4.8 km' in line and '{`' not in line:
            line = line.replace('&le; 4.8 km', '{`&le; 4.8 km`}')
        new_lines.append(line)

    with open(filepath, 'w') as f:
        f.writelines(new_lines)
    print(f'Fixed {filepath}')

fix_file('src/components/visuals/DrawerSplit.tsx')
fix_file('src/components/visuals/MemoryDiagram.tsx')
print('Done')