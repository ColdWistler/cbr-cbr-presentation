with open('src/components/visuals/MemoryDiagram.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # Fix > 4.8 km in text content
    if '> 4.8 km' in line and '&le;' not in line:
        if '<text' in line or (line.strip().startswith('>') and '</text>' in line):
            line = line.replace('> 4.8 km', '{` > 4.8 km`}')
    if '&le; 4.8 km' in line and '{' not in line:
        line = line.replace('&le; 4.8 km', '{`&le; 4.8 km`}')
    if '≤ 4.8 km' in line:
        line = line.replace('≤ 4.8 km', '{`&le; 4.8 km`}')
    new_lines.append(line)

with open('src/components/visuals/MemoryDiagram.tsx', 'w') as f:
    f.writelines(lines)

print('Fixed MemoryDiagram')