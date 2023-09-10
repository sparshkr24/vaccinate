import auth from '@/middleware/auth';
import prisma from '../../prisma/prisma';

export default auth(async function handler(req, res) {
  if (req.method != 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId, vaccinationCenterId, timeSlot } = req.body;
//   console.log('bookslot: ', userId, vaccinationCenterId, timeSlot);

  try {
    // Check if the user and vaccination center exist
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const vaccinationCenter = await prisma.vaccinationCenter.findUnique({ where: { id: vaccinationCenterId } });

    if (!user || !vaccinationCenter) {
      return res.status(404).json({ message: 'User or Vaccination Center not found' });
    }

    // Check if there are available slots in the vaccination center
    if (vaccinationCenter.slotsLeft <= 0) {
      return res.status(400).json({ message: 'No available slots in the Vaccination Center' });
    }

    // Decrement slotsLeft by 1
    const updatedVaccinationCenter = await prisma.vaccinationCenter.update({
      where: { id: vaccinationCenterId },
      data: { slotsLeft: vaccinationCenter.slotsLeft - 1 },
    });

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        user: { connect: { id: userId } },
        vaccinationCenter: { connect: { id: vaccinationCenterId } },
        appointmentTime: timeSlot,
      },
    });

    res.status(200).json({ message: 'Appointment fixed successfully', appointment, updatedVaccinationCenter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
)