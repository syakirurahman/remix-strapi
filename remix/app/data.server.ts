type ContactMutation = {
  id?: string;
  documentId?: string;
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite?: boolean;
};

export type ContactRecord = ContactMutation & {
  id: string;
  createdAt: string;
};

// For an odd reason, using localhost:1337 is not working
// https://stackoverflow.com/questions/71836634/strapi-fetcherror-request-to-http-localhost1337-api-events-failed-reason-c
const STRAPI_BASE_URL = process.env.STRAPI_BASE_URL || 'http://127.0.0.1:1337'

export async function getContacts(query?: string | null) {
  try {
    const response = await fetch(STRAPI_BASE_URL + "/api/contacts")
    const json = await response.json()
    return json.data
  } catch (err) {
    console.log(err)
  }
}

export async function createEmptyContact() {
}

export async function getContact(documentId: string) {
    try {
    const response = await fetch(STRAPI_BASE_URL + "/api/contacts/" + documentId);
    const json = await response.json()
    return json.data
  } catch (err) {
    console.log(err)
  }
}

export async function updateContact(id: string, updates: ContactMutation) {
}

export async function deleteContact(id: string) {
}

