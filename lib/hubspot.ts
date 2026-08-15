const HUBSPOT_API = "https://api.hubapi.com";

interface ContactProperties {
  email: string;
  firstname?: string;
  phone?: string;
  company?: string;
  lead_source?: string;
  course_interest?: string;
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

export async function upsertContact(
  properties: ContactProperties,
  scoreIncrement = 0
): Promise<{ id: string }> {
  const searchRes = await hubspotRequest("/crm/v3/objects/contacts/search", {
    filterGroups: [
      {
        filters: [{ propertyName: "email", operator: "EQ", value: properties.email }],
      },
    ],
    properties: ["cyvant_lead_score"],
  });

  const existing = searchRes.results?.[0];

  if (existing) {
    const currentScore = parseInt(existing.properties?.cyvant_lead_score ?? "0", 10);
    const newScore = currentScore + scoreIncrement;

    await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/${existing.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: { ...properties, cyvant_lead_score: String(newScore) },
      }),
    });

    return { id: existing.id as string };
  }

  const created = await hubspotRequest("/crm/v3/objects/contacts", {
    properties: { ...properties, cyvant_lead_score: String(scoreIncrement) },
  });

  return { id: created.id as string };
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
