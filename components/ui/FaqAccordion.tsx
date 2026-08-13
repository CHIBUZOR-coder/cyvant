"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <dl className="divide-y divide-gray-200">
      {items.map((item, index) => (
        <div key={index} className="py-5">
          <dt>
            <button
              type="button"
              className="flex w-full items-start justify-between text-left gap-4 group"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
              id={`faq-question-${index}`}
              onClick={() => toggle(index)}
            >
              <span className="text-base font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                {item.question}
              </span>
              <span
                className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 group-hover:bg-blue-50 transition-colors text-gray-500 group-hover:text-blue-700"
                aria-hidden="true"
              >
                {openIndex === index ? (
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                )}
              </span>
            </button>
          </dt>
          <dd
            id={`faq-answer-${index}`}
            role="region"
            aria-labelledby={`faq-question-${index}`}
            hidden={openIndex !== index}
            className="mt-3 pr-10"
          >
            <p className="text-base text-gray-600 leading-7">{item.answer}</p>
          </dd>
        </div>
      ))}
    </dl>
  );
}
