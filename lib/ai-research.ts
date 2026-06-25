import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Search categories for accessibility-focused companies
const SEARCH_CATEGORIES = [
  {
    category: 'mobility_equipment',
    searchTerms: [
      'power wheelchair manufacturers',
      'manual wheelchair companies',
      'mobility scooter brands',
      'walking aids accessibility'
    ]
  },
  {
    category: 'accessible_vehicles',
    searchTerms: [
      'wheelchair accessible van conversion',
      'handicap vehicle modifications',
      'adaptive driving equipment'
    ]
  },
  {
    category: 'adaptive_clothing',
    searchTerms: [
      'adaptive clothing brands',
      'wheelchair fashion',
      'disability inclusive clothing'
    ]
  },
  {
    category: 'assistive_technology',
    searchTerms: [
      'voice control technology',
      'eye tracking devices',
      'adaptive computer equipment'
    ]
  },
  {
    category: 'home_accessibility',
    searchTerms: [
      'home accessibility modifications',
      'wheelchair ramp companies',
      'accessible bathroom fixtures'
    ]
  },
  {
    category: 'service_dog_equipment',
    searchTerms: [
      'service dog gear brands',
      'assistance dog equipment',
      'working dog accessories'
    ]
  },
  {
    category: 'digital_accessibility',
    searchTerms: [
      'web accessibility tools',
      'screen reader software',
      'digital inclusion platforms'
    ]
  },
  {
    category: 'health_wellness',
    searchTerms: [
      'disability fitness programs',
      'adaptive exercise equipment',
      'chronic pain management products'
    ]
  }
];

interface ResearchResult {
  company_name: string;
  website_url: string;
  category: string;
  subcategory: string;
  brand_summary: string;
  accessibility_relevance: number;
  service_dog_relevance: number;
  priority_level: string;
  contact_name?: string;
  contact_email?: string;
  contact_title?: string;
  has_ambassador_program: boolean;
  has_affiliate_program: boolean;
}

export async function researchCompanies(count: number = 10): Promise<ResearchResult[]> {
  const results: ResearchResult[] = [];
  
  // Randomly select search categories for variety
  const shuffledCategories = [...SEARCH_CATEGORIES].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < count; i++) {
    const categoryGroup = shuffledCategories[i % shuffledCategories.length];
    const searchTerm = categoryGroup.searchTerms[Math.floor(Math.random() * categoryGroup.searchTerms.length)];
    
    try {
      const result = await researchSingleCompany(searchTerm, categoryGroup.category);
      if (result) {
        results.push(result);
      }
    } catch (error) {
      console.error(`Error researching company for "${searchTerm}":`, error);
    }
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}

async function researchSingleCompany(searchTerm: string, category: string): Promise<ResearchResult | null> {
  const prompt = `Research and find ONE specific company in the accessibility/disability space based on this search: "${searchTerm}"

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "company_name": "Company Name",
  "website_url": "https://company.com",
  "subcategory": "Specific product type",
  "brand_summary": "2-3 sentence description of what they do and why they serve people with disabilities",
  "accessibility_relevance": 8,
  "service_dog_relevance": 3,
  "priority_level": "B",
  "contact_name": "Contact Person Name (if known)",
  "contact_email": "email@company.com (if known)",
  "contact_title": "Partnerships Manager / Marketing Director (if known)",
  "has_ambassador_program": true/false,
  "has_affiliate_program": true/false
}

Scoring guidelines:
- accessibility_relevance: 1-10 (how well do they serve quadriplegic/disability community)
- service_dog_relevance: 1-10 (how relevant to service dog users)
- priority_level: "A" (exceptional fit), "B" (good fit), "C" (decent fit), "D" (low priority)

Find a REAL company that exists. Do not make up companies.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a research assistant specializing in finding accessibility-focused companies and products. Always return valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    // Parse the JSON response
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanContent);
    
    return {
      ...data,
      category
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return null;
  }
}

export async function scoreOpportunity(companyData: ResearchResult): Promise<{
  overall_score: number;
  fit_score: number;
  revenue_score: number;
  brand_alignment_score: number;
  response_probability_score: number;
  relationship_value_score: number;
  pitch_angle: string;
  content_concept: string;
}> {
  const prompt = `Score this company for a quadriplegic accessibility creator (Babs) and her service dog (Beau) partnership:

Company: ${companyData.company_name}
Category: ${companyData.category}
Summary: ${companyData.brand_summary}
Accessibility Relevance: ${companyData.accessibility_relevance}/10
Service Dog Relevance: ${companyData.service_dog_relevance}/10

Return ONLY JSON:
{
  "overall_score": 75,
  "fit_score": 8,
  "revenue_score": 7,
  "brand_alignment_score": 9,
  "response_probability_score": 6,
  "relationship_value_score": 8,
  "pitch_angle": "Specific angle for outreach - why Babs + Beau are perfect for this brand",
  "content_concept": "Specific content idea that would showcase this product"
}

Scoring (0-100 for overall, 1-10 for others):
- fit_score: How well does this serve quadriplegic users?
- revenue_score: Likely commission/flat fee potential
- brand_alignment_score: Values alignment with accessibility advocacy
- response_probability_score: Likelihood they'll respond to outreach
- relationship_value_score: Long-term partnership potential`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at evaluating brand partnership opportunities for disability advocates.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return getDefaultScores();
    }

    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanContent);
  } catch (error) {
    console.error('Scoring error:', error);
    return getDefaultScores();
  }
}

function getDefaultScores() {
  return {
    overall_score: 50,
    fit_score: 5,
    revenue_score: 5,
    brand_alignment_score: 5,
    response_probability_score: 5,
    relationship_value_score: 5,
    pitch_angle: 'Babs and Beau can showcase how this product makes life more accessible for quadriplegic users.',
    content_concept: 'A day-in-the-life video showing the product in real-world use.'
  };
}

// Validate that a company doesn't already exist
export async function validateCompanyUnique(
  companyName: string,
  websiteUrl: string,
  supabase: any
): Promise<boolean> {
  const { data } = await supabase
    .from('companies')
    .select('id')
    .or(`company_name.ilike.${companyName},website_url.ilike.${websiteUrl}`)
    .limit(1);
  
  return !data || data.length === 0;
}
