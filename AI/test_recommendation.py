from skill_matching.skill_extractor import extract_skills


description = """
We are looking for a Software Developer with
experience in JavaScript, React, Node.js,
MySQL and Git.
Knowledge of PHP is also a plus.
"""


skills = [
    "JavaScript",
    "React",
    "Node.js",
    "MySQL",
    "Git",
    "PHP",
    "Python",
    "Laravel"
]


result = extract_skills(
    description,
    skills
)

print("Detected skills:")
print(result)