with open('src/components/visuals/RetrievalRadar.tsx', 'r') as f:
    content = f.read()

# Fix transition on SVG element - remove transition prop
content = content.replace('transition="opacity 0.3s ease"', '')

# Fix style jsx
content = content.replace('<style jsx>{`', '<style>{')
content = content.replace('`}</style>', '`}</style>')

with open('src/components/visuals/RetrievalRadar.tsx', 'w') as f:
    f.write(content)

print('Fixed RetrievalRadar')