const Event = require('../models/Event');
const Pass = require('../models/Pass');

exports.createEvent = async (req, res) => {
    const { name, date } = req.body;
    try {
        const newEvent = new Event({ name, date, createdBy: req.user.id });
        const event = await newEvent.save();
        res.status(201).json(event);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'Aap is naam se event pehle hi bana chuke hain.' });
        }
        res.status(500).send('Server error');
    }
};

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find({ date: { $gte: new Date().setHours(0,0,0,0) } }).sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.getEventAnalytics = async (req, res) => {
     try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ msg: 'Event nahi mila.' });
        
    
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Aap is event ke analytics nahi dekh sakte.' });
        }

        const totalPasses = await Pass.countDocuments({ event: eventId });
        const checkedInPasses = await Pass.countDocuments({ event: eventId, isCheckedIn: true });
        
        // BUG FIX: Ab hum attendees ki poori list bhi bhej rahe hain.
        const attendees = await Pass.find({ event: eventId }).select('name rollNumber email isCheckedIn checkedInAt');
        
        res.json({ 
            eventName: event.name, 
            totalRegistered: totalPasses, 
            totalCheckedIn: checkedInPasses,
            attendees: attendees 
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
