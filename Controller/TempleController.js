const TempleDetails = require('../Model/TempleDetails');



const createTemple = async (req, res) => {
    try {
        // Create a new TempleDetails document with data from request body
        const temple = new TempleDetails(req.body);
        console.log(temple);

        // Save the document to the database
        await temple.save();

        // Respond with success message
        res.status(201).json({ message: 'Temple details added successfully!', temple });
    } catch (error) {
        // Handle any errors
        res.status(500).json({ error: error.message });
    }
}

const getAllTemples=async (req, res) => {
    try {
        const temples = await TempleDetails.find(); // Retrieve all documents
        res.status(200).json(temples); // Send response with status 200 and the list of temples
    } catch (error) {
        console.error('Server error:', error); // Log the error
        res.status(500).json({ message: 'Server error' }); // Send response with status 500
    }
}

const templeDetails = async (req, res) => {
    try {
        const { name, poojaname } = req.body;
        
        if (!name || !poojaname) {
            return res.status(400).json({ message: 'Pincode and date are required' });
        }
        console.log('Searching for temples with name:', name);
        console.log('Searching for poojaname in relatedPooja:', poojaname);
        //   const Temples = await TempleDetails.find({
        //     name,
        //     poojaname: { $elemMatch: { $eq: poojaname } }
        //   });
        const temples = await TempleDetails.find({
            name,
            relatedPooja: poojaname // Check if poojaname is in the relatedPooja array
        });
        console.log('Temples found:', temples);
        if (temples.length === 0) {
            return res.status(404).json({ message: 'No Temple found' });
        }
        res.status(200).json(temples);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
module.exports = { templeDetails, createTemple ,getAllTemples};