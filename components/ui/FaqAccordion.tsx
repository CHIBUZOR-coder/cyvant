"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <dl className="divide-y divide-gray-200 dark:divide-gray-700">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <motion.div
            key={index}
            className="py-5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
          >
            <dt>
              <button
                type="button"
                className="cursor-pointer flex w-full items-start justify-between text-left gap-4 group"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
                onClick={() => toggle(index)}
              >
                <span className={`text-base font-semibold transition-colors duration-200 ${isOpen ? "text-[#007dff] dark:text-blue-400" : "text-gray-900 dark:text-white group-hover:text-[#007dff] dark:group-hover:text-blue-400"}`}>
                  {item.question}
                </span>
                <motion.span
                  className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-200 ${isOpen ? "bg-[#007dff] text-white" : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-[#007dff] dark:group-hover:text-blue-400"}`}
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  aria-hidden="true"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                </motion.span>
              </button>
            </dt>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.dd
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 pr-10 text-base text-gray-600 dark:text-gray-400 leading-7 pb-2">
                    {item.answer}
                  </p>
                </motion.dd>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </dl>
  );
}
