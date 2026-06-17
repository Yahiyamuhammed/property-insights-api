import { fetchProfileTab } from '../services/scraper.service.js';

export const getPropertyDetails = async (req, res) => {
    try {
        const { pin } = req.params;
        if (!pin || pin.length < 10) {
            return res.status(400).json({ success: false, message: "Valid PIN required" });
        }

        const data = await fetchProfileTab(pin);
        
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Scraping Error:", error);
        res.status(500).json({ success: false, message: "Failed to extract property data" });
    }
};