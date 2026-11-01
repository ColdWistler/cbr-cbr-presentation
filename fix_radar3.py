with open('src/components/visuals/RetrievalRadar.tsx', 'r') as f:
    content = f.read()

# Fix the style tag - replace template literal with regular string
old_style = '''      <style>{
        @media ${prefersReducedMotion} {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>'''

new_style = '''      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>'''

content = content.replace(old_style, new_style)

with open('src/components/visuals/RetrievalRadar.tsx', 'w') as f:
    f.write(content)

print('Fixed RetrievalRadar')