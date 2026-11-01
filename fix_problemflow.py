with open('src/components/visuals/ProblemFlow.tsx', 'r') as f:
    content = f.read()

# Fix style jsx
content = content.replace('<style jsx>{`', '<style>{')
content = content.replace('`}</style>', '`}</style>')

with open('src/components/visuals/ProblemFlow.tsx', 'w') as f:
    f.write(content)

print('Fixed ProblemFlow')