import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export default function FAQPage() {
  const { content } = useStore();
  const items = content.faq?.items || [];
  const [open, setOpen] = useState(0);

  return (
    <div className="ge-wrap narrow">
      <div className="ge-sech">Frequently asked questions</div>
      <div className="ge-secsub">Answers to the things customers ask us most</div>

      {items.length === 0 && <div className="ge-empty">No FAQs have been added yet.</div>}

      <div>
        {items.map((item, i) => (
          <div key={i} className="ge-faqitem">
            <button className="ge-faqq" onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{item.question}</span>
              <ChevronDown size={18} className={'ge-faqchevron' + (open === i ? ' on' : '')} />
            </button>
            {open === i && <div className="ge-faqa">{item.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
