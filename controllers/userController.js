import Appointment from "../models/Appointments.js";

const getUserAppointments = async (req, res) => {
  const { user } = req.params;

  const role = "user";

  if (user !== req.user._id.toString()) {
    const error = new Error("Acceso denegado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const query = req.user.isAdmin
      ? {
          date: {
            $gte: new Date(),
          },
        }
      : {
          user,
          date: {
            $gte: new Date(),
          },
        };
    const appointments = await Appointment.find(query)
      .populate("services")
      .populate({ path: "user", select: "name email" })
      .sort({
        date: "asc",
      });

    res.status(200).json(appointments);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: error.message,
    });
  }
};

export { getUserAppointments };
