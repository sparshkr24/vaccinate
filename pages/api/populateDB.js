// pages/api/populate.js

import prisma from '../../prisma/prisma';

export default async function handler(req, res) {
    const deletedVaccinationCenters = await prisma.vaccinationCenter.deleteMany({});
  // Function to generate random integer within a range
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

 const hospitalNames = [
  "Apollo Hospitals",
  "Fortis Hospitals",
  "Max Super Speciality Hospital",
  "Columbia Asia Hospital",
  "Manipal Hospital",
  "Narayana Health",
  "AIIMS (All India Institute of Medical Sciences)",
  "Artemis Hospitals",
  "Medanta - The Medicity",
  "KIMS (Krishna Institute of Medical Sciences)",
  "Ruby Hall Clinic",
  "Lilavati Hospital and Research Centre",
  "Sri Ramachandra Medical Centre",
  "Sakra World Hospital",
  "Kokilaben Dhirubhai Ambani Hospital",
  "Ganga Ram Hospital",
  "Nanavati Hospital",
  "Aster Medcity",
  "Global Hospitals",
  "Moolchand Medcity",
  "Sparsh Hospitals",
  "Kauvery Hospital",
  "CARE Hospitals",
  "BLK Super Speciality Hospital",
  "Metro Hospitals",
  "NIMS (Nizam's Institute of Medical Sciences)",
  "Sir H.N. Reliance Foundation Hospital and Research Centre",
  "Paras Hospitals",
  "Amri Hospitals",
  "Aster CMI Hospital",
  "Ramaiah Memorial Hospital",
  "Gleneagles Global Hospitals",
  "Sir Ganga Ram Kolmet Hospital",
  "Breach Candy Hospital",
  "HCG Cancer Centre",
  "CMI Hospital",
  "Hinduja Hospital",
  "Hiranandani Hospital",
  "Fernandez Hospital",
  "Jaslok Hospital",
  "Tata Memorial Hospital",
  "Wockhardt Hospitals",
  "Sahyadri Hospitals",
  "Shroff Eye Hospital",
  "Kailash Hospital",
  "Noble Hospitals",
  "Ardent Ganpati",
  "Inlaks Budhrani Hospital",
  "City Hospital",
];

  // Function to generate random working hours (6 hours duration between 8 AM and 6 PM)
  function generateRandomWorkingHours() {
    const startHour = getRandomInt(8, 12); // Random start hour between 8 AM and 12 PM
    const endHour = startHour + 6; // Ensure 6 hours duration
    const formattedStartHour = startHour < 10 ? `0${startHour}` : `${startHour}`;
    const formattedEndHour = endHour < 10 ? `0${endHour}` : `${endHour}`;
    return `${formattedStartHour}:00 H - ${formattedEndHour}:00 H`;
  }

  // Function to populate random VaccinationCenter records
  async function populateRandomVaccinationCenters() {
    const indianCities = [
        "mumbai",
        "delhi",
        "bangalore",
        "chennai",
        "kolkata",
        "hyderabad",
        "pune",
        "ahmedabad",
        "jaipur",
        "surat",
        "lucknow",
        "kanpur",
        "nagpur",
        "patna",
        "indore",
        "thane",
        "bhopal",
        "visakhapatnam",
        "vadodara",
        "firozabad",
        "ludhiana",
        "rajkot",
        "agra",
        "siliguri",
        "nashik",
        "faridabad",
        "patiala",
        "meerut",
        "kalyan-dombivali",
        "vasai-virar",
        "varanasi",
        "srinagar",
        "dhanbad",
        "amritsar",
        "navi mumbai",
        "allahabad",
        "ranchi",
        "howrah",
        "coimbatore",
        "meerut"
      ];

    const vaccinationCenters = [];

    for (let i = 0; i < 200; i++) {
      const randomCity = indianCities[Math.floor(Math.random() * indianCities.length)];

      vaccinationCenters.push({
        centerName: hospitalNames[i % hospitalNames.length], // Cycle through hospital names
        city: randomCity,
        workingHours: generateRandomWorkingHours(), // Generate random working hours
        slotsLeft: getRandomInt(5, 15),
        covaxin: getRandomInt(20, 80),
        covishield: getRandomInt(20, 80),
        pfizer: getRandomInt(20, 80),
      });
    }

    await prisma.vaccinationCenter.createMany({
      data: vaccinationCenters,
    });

    console.log("Random Vaccination Centers populated successfully.");
  }

  // Main function to populate the database with random VaccinationCenters
  try {
    await populateRandomVaccinationCenters();
    res.status(200).json({ message: "Random Vaccination Centers populated successfully." });
  } catch (error) {
    console.error("Error populating Vaccination Centers:", error);
    res.status(500).json({ error: "Error populating Vaccination Centers" });
  } finally {
    await prisma.$disconnect();
  }
}
