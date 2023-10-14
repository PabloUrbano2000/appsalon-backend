import Services from "../models/Services.js";
import { handleNotFoundError, validateObjectId } from "../utils/index.js";

const createService = async (req, res) => {
  try {
    if (Object.values(req.body).includes("")) {
      const error = new Error("Todos los campos son obligatorios");
      return res.status(400).json({
        msg: error.message,
      });
    }
    const service = new Services(req.body);
    await service.save();

    res.json({
      msg: "El Servicio se creó correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: error.message,
    });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await Services.find();
    return res.json(services);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: error.message,
    });
  }
};

const getServiceById = async (req, res, next) => {
  const { id } = req.params;

  if (!validateObjectId(id, res)) return;

  const service = await Services.findById(id);

  if (!service) {
    return handleNotFoundError("El Servicio no existe", res);
  }

  return res.json(service);
};

const updateService = async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id, res)) return;

  const service = await Services.findById(id);

  if (!service) {
    return handleNotFoundError("El Servicio no existe", res);
  }

  service.name = req.body.name || service.name;
  service.price = req.body.price || service.price;

  try {
    await service.save();

    return res.json({
      msg: "El Servicio se actualizó correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: error.message,
    });
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id, res)) return;

  const service = await Services.findById(id);

  if (!service) {
    return handleNotFoundError("El Servicio no existe", res);
  }

  try {
    await service.deleteOne();
    res.json({
      msg: "El Servicio se eliminó correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: error.message,
    });
  }
};

export {
  getServices,
  createService,
  getServiceById,
  updateService,
  deleteService,
};
