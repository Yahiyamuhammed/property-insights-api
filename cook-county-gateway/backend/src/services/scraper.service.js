import axios from 'axios';
import * as cheerio from 'cheerio';

async function fetchSubPage(pin, mode) {
    const url = `https://assessorpropertydetails.cookcountyil.gov/Datalets/Datalet.aspx?mode=${mode}&UseSearch=no&pin=${pin}`;
    try {
        const response = await axios.get(url, { timeout: 8000 });
        return { mode, html: response.data };
    } catch (error) {
        console.error(`Failed to fetch ${mode} tab for PIN ${pin}`);
        return { mode, html: null };
    }
}

export async function fetchPropertyData(pin) {
    // Add all the tabs you want to aggressively fetch
    const modes = [
        'profileall_cc', 
        'maildetail', 
        'full_legal_cd', 
        'sales', 
        'permit_ck_cc'
    ];
    
    const results = await Promise.all(modes.map(mode => fetchSubPage(pin, mode)));
    
    const fullProfile = { 
        parcelId: pin,
        tabs: {} // We will store dynamic data here
    };

    results.forEach(({ mode, html }) => {
        if (!html) return;
        
        // Skip tabs that are empty
        if (html.includes("No Data") || html.includes("-- No Data --")) return;
        
        const $ = cheerio.load(html);
        const tabData = {};
        
        $('td.DataletSideHeading').each((_, el) => {
            const rawLabel = $(el).text().replace(/\s+/g, " ").trim();
            // Clean the key (remove trailing colons for cleaner JSON)
            const cleanLabel = rawLabel.replace(/:$/, '').trim();

            const value = $(el)
                .next('td')
                .text()
                .replace(/\u00a0/g, ' ') 
                .replace(/\s+/g, ' ')    
                .trim();

            // Ignore empty values or Cook County's blank '----' strings
            if (cleanLabel && value !== '----' && value !== '') {
                tabData[cleanLabel] = value;
            }
        });
        
        // If we found valid fields, attach this mode to our final payload
        if (Object.keys(tabData).length > 0) {
             fullProfile.tabs[mode] = tabData;
        }
    });

    return fullProfile;
}