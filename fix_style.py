with open('src/components/visuals/SimilarityChart.tsx', 'r') as f:
    content = f.read()

content = content.replace('<style jsx>{`', '<style>{`')
content = content.replace('`}</style>', '`}</style>')

with open('src/components/visuals/SimilarityChart.tsx', 'w') as f:
    f.write(content)

print('Fixed SimilarityChart')