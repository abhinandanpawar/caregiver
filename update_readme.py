import re

readme_path = "README.md"
with open(readme_path, "r") as f:
    content = f.read()

# Update the description of Personal Dashboard
content = re.sub(
    r"\*\*Personal Dashboard \(React \+ Bottle API\):\*\* A private, interactive dashboard for employees, featuring a mood journal, goal tracker, and Kanban board\. The UI is built with \*\*React, TypeScript, and MUI\*\*, enhanced with \*\*Framer Motion\*\* for smooth animations\. The backend is a lightweight \*\*Bottle\*\* server\.",
    "**Personal Dashboard (React + Bottle API):** A private, interactive dashboard for employees, featuring a mood journal, goal tracker, and Kanban board. The UI is built with **React, TypeScript, and MUI**, enhanced with **Framer Motion** for smooth animations and `@dnd-kit` for drag-and-drop capabilities. The backend is a lightweight **Bottle** server.",
    content
)

with open(readme_path, "w") as f:
    f.write(content)
