const prisma = require('../config/prisma');

const getAllEvents = async (req, res, next) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        venue: true,
        category: true,
        bookings: {
          include: {
            participant: true
          }
        }
      }
    });
    res.json(events);
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        venue: true,
        category: true,
        bookings: {
          include: {
            participant: true
          }
        }
      }
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, time, venueId, categoryId } = req.body;
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        time,
        venueId: venueId ? parseInt(venueId) : null,
        categoryId: categoryId ? parseInt(categoryId) : null
      },
      include: {
        venue: true,
        category: true
      }
    });
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, date, time, venueId, categoryId } = req.body;
    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        time,
        venueId: venueId !== undefined ? (venueId ? parseInt(venueId) : null) : undefined,
        categoryId: categoryId !== undefined ? (categoryId ? parseInt(categoryId) : null) : undefined
      },
      include: {
        venue: true,
        category: true
      }
    });
    res.json(event);
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
