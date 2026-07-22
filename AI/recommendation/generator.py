def generate_recommendation(missing_skills):

    recommendations = []

    for skill in missing_skills:

        skill = skill.lower()

        if skill == "node.js":
            recommendations.append(
                "Learn backend API development using Node.js and Express."
            )

        elif skill == "docker":
            recommendations.append(
                "Learn containerization basics using Docker."
            )

        elif skill == "aws":
            recommendations.append(
                "Study cloud fundamentals and AWS deployment."
            )

        else:
            recommendations.append(
                f"Improve your knowledge in {skill}."
            )


    return {
        "learning_recommendations": recommendations
    }