import { db } from "@/lib/db";

export interface LeadInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  leadSource: string;
  courseInterest?: string;
  serviceInterest?: string;
  qualifyingAnswer?: string;
  message?: string;
}

export async function upsertLead(input: LeadInput, scoreIncrement = 0) {
  const existing = await db.lead.findUnique({ where: { email: input.email } });

  if (existing) {
    return db.lead.update({
      where: { email: input.email },
      data: {
        name: input.name,
        phone: input.phone ?? existing.phone,
        company: input.company ?? existing.company,
        leadSource: input.leadSource,
        courseInterest: input.courseInterest ?? existing.courseInterest,
        serviceInterest: input.serviceInterest ?? existing.serviceInterest,
        qualifyingAnswer: input.qualifyingAnswer ?? existing.qualifyingAnswer,
        message: input.message ?? existing.message,
        leadScore: existing.leadScore + scoreIncrement,
      },
    });
  }

  return db.lead.create({
    data: {
      ...input,
      leadScore: scoreIncrement,
    },
  });
}

export async function addLeadNote(
  leadId: string,
  content: string,
  type: "note" | "call" | "email" = "note",
  createdBy?: string
) {
  return db.note.create({
    data: { leadId, content, type, createdBy },
  });
}
