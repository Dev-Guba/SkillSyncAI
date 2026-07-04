import { 
    addUserInterest,
    suggestInterestsFromSkills,
 } from "../services/userInterestServices.js";

export async function addInterestController(req, res) {
  try {
    const userId = req.user.user_id; // 🔥 from JWT
    const { interestId } = req.body;

    const result = await addUserInterest(userId, interestId);

    return res.status(201).json({
      message: "Interest added",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
exp