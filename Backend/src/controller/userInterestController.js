import {
  addUserInterest,
  suggestInterestsFromSkills,
} from "../services/userInterestServices.js";

/**
 * Add a new interest for the authenticated user
 */
export async function addInterestController(req, res) {
  try {
    const userId = req.user.user_id; // From JWT middleware
    const { interestId } = req.body;

    if (!interestId) {
      return res.status(400).json({
        message: "interestId is required",
      });
    }

    const result = await addUserInterest(userId, interestId);

    return res.status(201).json({
      message: "Interest added successfully",
      data: result,
    });
  } catch (error) {
    console.error("Add Interest Error:", error);

    return res.status(500).json({
      message: error.message || "Failed to add interest",
    });
  }
}

/**
 * Get AI-suggested interests based on the user's skills
 */
export async function getSuggestedInterests(req, res) {
  try {
    const userId = req.user.user_id; // From JWT middleware

    const suggestions = await suggestInterestsFromSkills(userId);

    return res.status(200).json({
      message: "Suggested interests retrieved successfully",
      data: suggestions,
    });
  } catch (error) {
    console.error("Get Suggested Interests Error:", error);

    return res.status(500).json({
      message: error.message || "Failed to retrieve suggested interests",
    });
  }
}