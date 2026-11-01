import re

for f in ['src/components/visuals/DrawerSplit.tsx', 'src/components/visuals/MemoryDiagram.tsx']:
    with open(f, 'rb') as fp:
        content = fp.read()
    
    # Protect template literals
    content = re.sub(rb"' > 4\.8 km'", rb"> PLACEHOLDER", content)
    content = re.sub(rb"' > 4\.8 km'", rb"> PLACEHOLDER", content)
    
    # Replace in text content
    content = content.replace(b"> 4.8 km", b"> 4.8 km")
    content = content.replace(b"\xe2\x89\xa4 4.8 km", b"&le; 4.8 km")
    
    # Restore
    content = content.replace(b"> PLACEHOLDER", b"> 4.8 km")
    content = content.replace(b"> PLACEHOLDER", b"> 4.8 km")
    
    with open(f, 'wb') as fp:
        fp.write(content)
    
    print(f"Fixed {f}")

print("Done")