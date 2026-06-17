// In backend/src/controllers/property.controller.js
import { fetchPropertyData } from '../services/scraper.service.js';

export const getPropertyDetails = async (req, res) => {
    try {
        const { pin } = req.params;
        if (!pin || pin.length < 10) {
            return res.status(400).json({ success: false, message: "Valid PIN required" });
        }

        // Call the newly upgraded function
        const data = await fetchPropertyData(pin); 
        
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Scraping Error:", error);
        res.status(500).json({ success: false, message: "Failed to extract property data" });
    }
};