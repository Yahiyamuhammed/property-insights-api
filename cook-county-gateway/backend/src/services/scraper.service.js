import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchProfileTab(pin) {
    const targetUrl = `https://assessorpropertydetails.cookcountyil.gov/Datalets/Datalet.aspx?mode=profileall_cc&UseSearch=no&pin=${pin}`;
    const response = await axios.get(targetUrl);
    const $ = cheerio.load(response.data);
    
    // Your Cheerio extraction logic here...
    return {
        pin: pin,
        address: $('td:contains("Property Address")').next('td').text().trim(),
        // ... other fields
    };
}