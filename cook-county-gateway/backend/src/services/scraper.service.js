import axios from 'axios';
import * as cheerio from 'cheerio';

// 1. Helper function to fetch any individual tab statelessly
async function fetchSubPage(pin, mode) {
    const url = `https://assessorpropertydetails.cookcountyil.gov/Datalets/Datalet.aspx?mode=${mode}&UseSearch=no&pin=${pin}`;
    try {
        const response = await axios.get(url, { timeout: 8000 });
        return { mode, html: response.data };
    } catch (error) {
        console.error(`Failed to fetch ${mode} tab for PIN ${pin}`);
        return { mode, html: null }; // Fail gracefully if a tab is down
    }
}

// 2. Main function that aggregates all data
export async function fetchPropertyData(pin) {
    // Define the tabs we want to scrape concurrently
    const modes = ['profileall_cc', 'maildetail', 'sales'];
    
    // Fire all HTTP requests at the same time for maximum speed
    const results = await Promise.all(modes.map(mode => fetchSubPage(pin, mode)));
    
    // The master JSON object we will return to the React frontend
    const fullProfile = { 
        parcelId: pin, 
        meta: {}, 
        taxpayer: {}, 
        latestSale: null 
    };

    // 3. Parse each tab's HTML as it comes back
    results.forEach(({ mode, html }) => {
        if (!html) return;
        
        const $ = cheerio.load(html);
        
        const getValueByLabel = (label) => {
            return $('td.DataletSideHeading')
                .filter((_, el) => $(el).text().trim() === label)
                .next('td')
                .text()
                .replace(/\u00a0/g, ' ') 
                .replace(/\s+/g, ' ')    
                .trim();
        };

        // Extract Profile Data
        if (mode === 'profileall_cc') {
            const propertyClass = getValueByLabel('Class');
            fullProfile.meta = {
                taxYear: getValueByLabel('Tax Year'),
                payYear: getValueByLabel('Pay Year'),
                address: getValueByLabel('Property Address'),
                buildingUnit: getValueByLabel('Building/Unit #:'),
                city: getValueByLabel('City & Zip Code'), 
                multipleAddresses: getValueByLabel('Multiple Addresses:'),
                propertyClass: propertyClass,
                isExempt: propertyClass ? propertyClass.includes('EX') : false,
                neighborhood: getValueByLabel('Neighborhood'),
                taxDistrict: getValueByLabel('Tax District'),
                keyPin: getValueByLabel('Key PIN'),
                townName: getValueByLabel('Town Name'),
                triTown: getValueByLabel('Tri-Town')
            };
        }

        // Extract Taxpayer Data
        if (mode === 'maildetail') {
            fullProfile.taxpayer = {
                name: getValueByLabel('Taxpayer Name'),
                name2: getValueByLabel('Taxpayer Name 2'),
                addressType: getValueByLabel('Address Type:'),
                address: getValueByLabel('Address:'),
                city: getValueByLabel('City:'),
                state: getValueByLabel('State'),
                zip: getValueByLabel('Zip')
            };
        }

        // Extract Sales Data
        if (mode === 'sales') {
            const salePrice = getValueByLabel('Sale Price');
            
            // Only populate if a sale actually exists (prevents empty cards for Exempt properties)
            if (salePrice && salePrice !== '----') {
                fullProfile.latestSale = {
                    date: getValueByLabel('Instrument/Sale Date:'),
                    price: salePrice.replace(/[^0-9.]/g, ''), // Strips the $ and commas to make it a clean number
                    type: getValueByLabel('Instrument Type'),
                    documentNumber: getValueByLabel('Document #:'),
                    seller: getValueByLabel('Grantor/Seller'),
                    buyer: getValueByLabel('Grantee/Buyer')
                };
            }
        }
    });
console.log(fullProfile);

    return fullProfile;
}