const Pass = require('../models/Pass');
const Event = require('../models/Event');
const qrcode = require('qrcode');

exports.verifyPass = async (req, res) => {
    const { qrString } = req.body;
    try {
        const pass = await Pass.findOne({ qrString }).populate('event');

        if (!pass) {
            return res.status(404).json({ status: 'INVALID', msg: 'Invalid Pass.' });
        }

        if (pass.event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ status: 'UNAUTHORIZED', msg: `You Cannot enter this event.` });
        }
        
        if (pass.isCheckedIn) {
            return res.status(200).json({ status: 'ALREADY_CHECKED_IN', msg: `${pass.name} is already chacked in.`});
        }

        pass.isCheckedIn = true;
        pass.checkedInAt = new Date();
        await pass.save();

        res.json({ status: 'SUCCESS', msg: `Welcome, ${pass.name}! "For the ${pass.event.name}"check-in successful.` });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.generatePass = async (req, res) => {
    const { name, rollNumber, email, eventId } = req.body;
    if (!name || !rollNumber || !email || !eventId) {
        return res.status(400).json({ msg: 'Please fill all details.' });
    }
    try {
        const event = await Event.findById(eventId);
        if (!event) {
             return res.status(404).json({ msg: 'Event not found.' });
        }

        let pass = await Pass.findOne({ email, event: eventId });
        if (pass) {
             const qrCodeImage = await qrcode.toDataURL(pass.qrString);
             return res.json({ qrCodeUrl: qrCodeImage, msg: 'Pass Already generated.' });
        }
        const uniqueString = `${rollNumber}-${eventId}-${Date.now()}`;
        pass = new Pass({ name, rollNumber, email, event: eventId, qrString: uniqueString });
        await pass.save();
        const qrCodeImage = await qrcode.toDataURL(uniqueString);
        res.status(201).json({ qrCodeUrl: qrCodeImage });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

