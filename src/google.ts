import {google} from "googleapis";
const sheets = google.sheets('v4');
const path = require('path');

// Scopes we require.
const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
export const sheetId = "1A8DtGaMWRQLwMGbuuk_6u7FQRAa_KZ70nKfFkA1MiBo";
// Name of the sheet we use for data.
export const dataSheetName = "Data";
// Location within the sheet of the coffeetime.
export const coffeeTimeLocation = dataSheetName + "!B1";
// Stores the amount of current connections.
export const currentConnectionsLocation = dataSheetName + "!B2";

const getAuthFromEnv = () => {
    const credentials = process.env.NAME;
    // console.log(`name: ${process.env.GOOGLE}`);
    if (!credentials) {
        console.log("Google env not set!");
        console.log("--Found the following env variables--")
        var env = process.env;
        Object.keys(env).forEach(function(key) {
            console.log(`${key}="${env[key]}"`);
        });
        return false;
    }

    const {private_key, client_email} = JSON.parse(credentials);
    if (!private_key || !client_email) {
        console.log("Google env object is not in correct json format: google={private_key, client_email}");
        return false;
    }

    return JSON.parse(credentials);
}

const createAuth2Client = async () => {
    const googleAuthData = getAuthFromEnv();
    if (!googleAuthData) {
        return null;
    }

    const {private_key, client_email} = googleAuthData;
    const auth = new google.auth.GoogleAuth({
        scopes: scopes,
        projectId: "koffieknop-1601480696686",
        credentials: {
            client_email: client_email,
            private_key: private_key
        }
    });
    return await auth.getClient();
}

export const retrieveSheet = async (spreadSheetId: string) => {
    return await retrieveValue(spreadSheetId, "Data");
}

export const updateValue = async (spreadSheetId: string, sheetId: string, data: any[][]) => {
    const params = {
        spreadsheetId: spreadSheetId,
        valueInputOption: "USER_ENTERED",
        range: sheetId,
        resource: {
            values: data
        },
        auth: await createAuth2Client()
    }
    return await sheets.spreadsheets.values.update(params);
}

export const retrieveValue = async (spreadSheetId: string, range: string) => {
    return await sheets.spreadsheets.values.get({
        spreadsheetId: spreadSheetId,
        range: range,
        auth: await createAuth2Client()
    });
}