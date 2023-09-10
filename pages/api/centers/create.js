import prisma from "../../../prisma/prisma";
import auth from "../../../middleware/auth";

export default auth(async function handler(req, res) {
  if (req.method == "POST") {
    const {
      centerName,
      city,
      workingHours,
      slotsLeft,
      covaxin,
      covishield,
      pfizer,
    } = req.body;

    try {
      const vaccinationCenter = await prisma.vaccinationCenter.create({
        data: {
          centerName,
          city,
          workingHours,
          slotsLeft,
          covaxin,
          covishield,
          pfizer,
        },
      });

      res.status(201).json(vaccinationCenter);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          error: "An error occurred while saving the vaccination center.",
        });
    }
  } else {
    res.status(404).json({ error: "Invalid request method." });
  }
})