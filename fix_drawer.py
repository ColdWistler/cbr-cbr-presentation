with open('src/components/visuals/DrawerSplit.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # Fix > 4.8 km in text content (but not in expressions)
    if '> 4.8 km' in line:
        # Check if this is a text content line (contains <text or just text)
        if '<text' in line or (line.strip().startswith('>') and '</text>' in line):
            line = line.replace('> 4.8 km', '{` > 4.8 km`}')
    if '&le; 4.8 km' in line and '{' not in line:
        line = line.replace('&le; 4.8 km', '{`&le; 4.8 km`}')
    if '≤ 4.8 km' in line:
        line = line.replace('≤ 4.8 km', '{`&le; 4.8 km`}')
    # Also fix the template literal
    if 'inLow ? "&le; 4.8 km" : " > 4.8 km"' in line:
        line = line.replace('inLow ? "&le; 4.8 km" : " > 4.8 km"', 'inLow ? " &le; 4.8 km" : " > 4.8 km"')
    new_lines.append(line)

with open('src/components/visuals/DrawerSplit.tsx', 'w') as f:
    f.writelines(lines)

print('Fixed DrawerSplit')