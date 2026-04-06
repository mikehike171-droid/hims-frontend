import backpain from "@/assets/treatment-backpain.jpg";
import kidney from "@/assets/treatment-kidney.jpg";
import spondylitis from "@/assets/treatment-spondylitis.jpg";
import sinusitis from "@/assets/treatment-sinusitis.jpg";
import thyroid from "@/assets/treatment-thyroid.jpg";
import pcos from "@/assets/treatment-pcos.jpg";

export interface TreatmentContent {
  id: string;
  title: string;
  shortDesc: string;
  heroImage: any;
  featuredImage: any;
  longDesc: string;
  sections: {
    title: string;
    content: string | string[];
    type: 'text' | 'list' | 'image' | 'faq';
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const treatmentsData: Record<string, TreatmentContent> = {
  "low-back-pain": {
    id: "low-back-pain",
    title: "Low Back Pain (Backache)",
    shortDesc: "Comprehensive homeopathic treatment for chronic and acute low back pain, targeting the root cause naturally.",
    heroImage: backpain,
    featuredImage: backpain,
    longDesc: "Experience a natural way to heal your back. Our specialized homeopathic remedies target inflammation and strengthen spinal health without side effects.",
    sections: [
      {
        title: "Understanding the Growing Problem of Low Back Pain",
        type: "text",
        content: "Low back pain is incredibly common, affecting people from all walks of life. Whether you spend your days at a desk, perform physically demanding jobs, or lead a sedentary lifestyle, the lumbar spine does a lot of heavy lifting. It supports your weight, helps you move, keeps your posture upright, and ensures flexibility. When this part of your back is strained or begins to wear down, it can cause real discomfort and stiffness, making everyday movements a challenge."
      },
      {
        title: "What Causes Low Back Pain?",
        type: "list",
        content: [
          "Poor posture while sitting or standing",
          "Muscle strain due to lifting heavy objects",
          "Sedentary lifestyle and weak core muscles",
          "Degenerative disc disease",
          "Herniated or slipped disc",
          "Sciatica and nerve compression",
          "Age-related spinal degeneration"
        ]
      },
      {
        title: "Why Homeopathy is Effective for Low Back Pain",
        type: "text",
        content: "Homeopathy takes a different approach to low back pain. Instead of simply covering up the discomfort with painkillers, homeopathic remedies work to rebalance your body's natural healing processes, aiming for deeper, lasting relief. It targets the root cause and supports the body's self-healing, using natural substances that act gently with minimal side effects."
      },
      {
        title: "Common Symptoms Treated",
        type: "list",
        content: [
          "Persistent lower back pain",
          "Stiffness in the lumbar region",
          "Difficulty bending or lifting objects",
          "Pain radiating to the legs (sciatica)",
          "Muscle tightness and inflammation",
          "Reduced spinal flexibility"
        ]
      },
      {
        title: "Specific Homeopathic Remedies",
        type: "text",
        content: "Homeopathy uses several remedies to address spinal inflammation, nerve pain, and muscle strain. Commonly used medicines include Rhus Toxicodendron (for strain), Bryonia Alba (when pain worsens with movement), Arnica Montana (for trauma-related soreness), and Hypericum (for nerve pain)."
      },
      {
        title: "Lifestyle Tips for Spinal Health",
        type: "list",
        content: [
          "Maintain proper posture while sitting",
          "Engage in regular stretching and strengthening exercises",
          "Use ergonomic workstations",
          "Maintain a healthy body weight",
          "Avoid prolonged sitting - take short breaks"
        ]
      }
    ],
    faqs: [
      {
        question: "Can homeopathy provide long-term relief for back pain?",
        answer: "Yes, homeopathy can provide long-term relief by addressing the root cause—such as spinal inflammation, nerve compression, or muscle weakness—rather than just masking the pain."
      },
      {
        question: "Is homeopathy effective for a slipped disc?",
        answer: "Homeopathy is a highly effective non-invasive treatment for slipped discs. Remedies like Hypericum and Colocynthis help reduce nerve inflammation and ease the shooting pain associated with sciatica."
      },
      {
        question: "How long does it take for results?",
        answer: "Acute pain often improves within 24 to 48 hours. Chronic conditions like spondylosis or long-term disc issues typically show visible improvement in mobility and pain reduction within 4 to 8 weeks."
      }
    ]
  },
  "kidney-stones": {
    id: "kidney-stones",
    title: "Kidney Stones",
    shortDesc: "Holistic homeopathic treatment for all stages of kidney stones, offering natural relief and prevention of recurrence.",
    heroImage: kidney,
    featuredImage: kidney,
    longDesc: "Gentle yet powerful treatment for kidney stones. Our remedies help in natural stone passage and prevent future occurrences by balancing your metabolism.",
    sections: [
      {
        title: "Natural Relief for Kidney Stones",
        type: "text",
        content: "Kidney stones can be extremely painful and recurring. Homeopathy offer a non-invasive way to manage small stones and prevent future formation by addressing the metabolic imbalances in the body."
      }
    ],
    faqs: []
  },
  "spondylitis": {
    id: "spondylitis",
    title: "Spondylitis",
    shortDesc: "Lasting relief from spondylitis through personalized homeopathic care and inflammation management.",
    heroImage: spondylitis,
    featuredImage: spondylitis,
    longDesc: "Restore your mobility and find lasting relief from spinal stiffness. We focus on long-term spinal health through individualised homeopathic care.",
    sections: [
      {
        title: "Managing Spondylitis Naturally",
        type: "text",
        content: "Spondylitis involves inflammation of the vertebrae. Homeopathic treatment focuses on reducing inflammation, improving flexibility, and managing pain without the side effects of long-term NSAID use."
      }
    ],
    faqs: []
  },
  "sinusitis": {
    id: "sinusitis",
    title: "Sinusitis",
    shortDesc: "Heal sinusitis symptoms naturally and reduce recurring allergies with specialized homeopathic care.",
    heroImage: sinusitis,
    featuredImage: sinusitis,
    longDesc: "Breathe freely again. Our treatment addresses the root cause of your sinus issues and boosts your natural immunity against allergens.",
    sections: [
      {
        title: "Breathe Better with Homeopathy",
        type: "text",
        content: "Chronic sinusitis can be debilitating. Homeopathy addresses the underlying allergic tendency and boosts immunity to provide long-term relief from congestion, headaches, and recurring infections."
      }
    ],
    faqs: []
  },
  "thyroid": {
    id: "thyroid",
    title: "Thyroid Disorders",
    shortDesc: "Expert care for thyroid conditions using individualized homeopathic treatment plans for hormonal balance.",
    heroImage: thyroid,
    featuredImage: thyroid,
    longDesc: "Natural hormonal balance for your thyroid. We provide specialized care to regulate your gland's function and improve your overall energy levels.",
    sections: [
      {
        title: "Restoring Hormonal Balance",
        type: "text",
        content: "Whether it's Hypothyroidism or Hyperthyroidism, homeopathy aims to regulate the thyroid gland's function by addressing the mind-body connection and systemic imbalances."
      }
    ],
    faqs: []
  },
  "pcos": {
    id: "pcos",
    title: "PCOS / PCOD",
    shortDesc: "Specialized treatment for PCOS naturally, restoring hormonal balance and improving overall well-being.",
    heroImage: pcos,
    featuredImage: pcos,
    longDesc: "Empowering women's health through natural restoration. Our PCOS treatment focuses on regularizing cycles and restoring hormonal harmony.",
    sections: [
      {
        title: "Natural Approach to PCOS",
        type: "text",
        content: "PCOS is a complex hormonal condition. Homeopathy offers a holistic approach to restore regular cycles, manage weight, reduce hair growth, and improve fertility by treating the root cause."
      }
    ],
    faqs: []
  }
};
