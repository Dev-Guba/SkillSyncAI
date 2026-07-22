from matcher import calculate_skill_gap


student = [
    "React",
    "JavaScript",
    "SQL"
]


job = [
    "React",
    "Node.js",
    "Docker",
    "AWS"
]


result = calculate_skill_gap(
    student,
    job
)


print(result)