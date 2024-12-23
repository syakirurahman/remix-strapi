import qs from "qs"

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

export async function getContacts(q?: string | null) {
  const query = qs.stringify({
    sort: 'createdAt:desc',
    filters: {
      $or: [
        { first: { $contains: q }},
        { last: { $contains: q }},
        { twitter: { $contains: q }},
      ]
    },
    pagination: {
      pageSize: 50,
      page: 1,
    },
  })

  try {
    const response = await fetch(STRAPI_BASE_URL + "/api/contacts?" + query)
    const json = await response.json()
    return json.data as ContactMutation[]
  } catch (err) {
    console.log(err)
  }
}

export async function createContact(data: Record<string, unknown>) {
  try {
    const response = await fetch(STRAPI_BASE_URL + "/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    const json = await response.json()
    return json.data
  } catch (err) {
    console.log(err)
  }
}

export async function getContact(documentId: string) {
  try {
    const response = await fetch(STRAPI_BASE_URL + "/api/contacts/" + documentId);
    const json = await response.json()
    if (response.ok) {
      return json.data
    } else {
      // fetch wont throw an error for 40X and 50X  errors
      throw new Response("Strapi error message: "+ json.error?.message || '', { status: json.error.status, statusText: json.error.name })
    }

  } catch (err) {
    console.log(err)
    // re-throw the err to the function caller
    throw err
  }
}

export async function updateContact(documentId: string, updates: ContactMutation) {
  try {
    const response = await fetch(STRAPI_BASE_URL + "/api/contacts/" + documentId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { ...updates} }),
    });
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteContact(documentId: string) {
  try {
    const response = await fetch(STRAPI_BASE_URL + "/api/contacts/" + documentId, {
      method: "DELETE",
    });
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log(error);
  }
}

