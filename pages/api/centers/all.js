import prisma from "../../../prisma/prisma";
import auth from "../../../middleware/auth";

const centersAll = async (req, res) => {
  try {
    if (req.method == "DELETE") {
      const { centerId } = req.query;

      if (!centerId) {
        return res
          .status(400)
          .json({ message: "centerId is required in the request body" });
      }
      console.log("centerId: ", centerId);

      await prisma.VaccinationCenter.delete({
        where: {
          id: centerId,
        },
      });

      return res.status(200).json({ message: "Record deleted successfully" });
    }

    if (Object.keys(req.query).length === 0) {
      const vaccinationCenters = await prisma.VaccinationCenter.findMany();
      return res.status(200).json(vaccinationCenters);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Number of items per page
    const offset = (page - 1) * limit;

    const vaccinationCenters = await prisma.VaccinationCenter.findMany({
      take: limit,
      skip: offset,
    });

    return res.status(200).json(vaccinationCenters);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Internal Server Error` });
  }
};

export default auth(centersAll);
