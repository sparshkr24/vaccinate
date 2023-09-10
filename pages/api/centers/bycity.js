import prisma from "../../../prisma/prisma";
import auth from "../../../middleware/auth";

export default auth(async function handler(req, res) {
  try {
    let { city } = req.query;
    city = city.toLowerCase();

    const centersByCity = await prisma.VaccinationCenter.findMany({
      where: {
        city,
      },
    });

    res.status(200).json(centersByCity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
