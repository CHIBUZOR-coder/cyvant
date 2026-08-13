const HUBSPOT_API = "https://api.hubapi.com";

interface ContactProperties {
  email: string;
  firstname?: string;
  phone?: string;
  [key: string]: string | undefined;
}

interface HubSpotNote {
  body: string;
  associations: { contactId: number };
}

async function hubspotRequest(path: string, body: object) {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) throw new Error("HUBSPOT_ACCESS_TOKEN is not configured");

  const res = await fetch(`${HUBSPOT_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HubSpot API error ${res.status}: ${err}`);
  }

  return res.json();
}

export async function upsertContact(properties: ContactProperties): Promise<{ id: string }> {
  return hubspotRequest("/crm/v3/objects/contacts/search", {
    filterGroups: [
      {
        filters: [{ propertyName: "email", operator: "EQ", value: properties.email }],
      },
    ],
  }).then(async (searchRes) => {
    const existing = searchRes.results?.[0];
    if (existing) {
      // Update existing contact
      await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/${existing.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ properties }),
      });
      return { id: existing.id as string };
    }
    // Create new contact
    const created = await hubspotRequest("/crm/v3/objects/contacts", { properties });
    return { id: created.id as string };
  });
}

export async function addNote(note: HubSpotNote) {
  const engagementBody = {
    properties: {
      hs_note_body: note.body,
      hs_timestamp: Date.now(),
    },
    associations: [
      {
        to: { id: note.associations.contactId },
        types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }],
      },
    ],
  };
  return hubspotRequest("/crm/v3/objects/notes", engagementBody);
}
