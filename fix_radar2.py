with open('src/components/visuals/RetrievalRadar.tsx', 'r') as f:
    content = f.read()

# Fix style jsx - replace jsx attribute but keep template literal
content = content.replace('<style jsx>{`', '<style>{`')
content = content.replace('`}</style>', '`}</style>')

with open('src/components/visuals/RetrievalRadar.tsx', 'w') as f:
    f.write(content)

print('Fixed RetrievalRadar')