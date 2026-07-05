const prisma = require('../config/prisma');

const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        event: {
          include: {
            venue: true,
            category: true
          }
        },
        participant: true
      }
    });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: {
        event: {
          include: {
            venue: true,
            category: true
          }
        },
        participant: true
      }
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const { eventId, participantId } = req.body;
    const booking = await prisma.booking.create({
      data: {
        eventId: parseInt(eventId),
        participantId: parseInt(participantId)
      },
      include: {
        event: true,
        participant: true
      }
    });
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { eventId, participantId } = req.body;
    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: {
        eventId: eventId ? parseInt(eventId) : undefined,
        participantId: participantId ? parseInt(participantId) : undefined
      },
      include: {
        event: true,
        participant: true
      }
    });
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.booking.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
};
