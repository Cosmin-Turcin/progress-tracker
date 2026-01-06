-- Migration: Enhanced professional_data JSONB structure
-- Description: Updates professional_data column with richer schema for CV builder

-- The column already exists, we just need to ensure the default is updated
-- and document the new structure for the application

COMMENT ON COLUMN public.user_profiles.professional_data IS 
'Enhanced professional CV data with structure:
{
  "headline": "string - Professional headline/tagline",
  "summary": "string - Professional summary",
  "experience": [{
    "id": "uuid",
    "title": "string - Job title",
    "company": "string - Company name",
    "location": "string - City, State/Country",
    "type": "full-time|part-time|contract|freelance|internship",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM or null if current",
    "current": "boolean",
    "description": "string - Job description",
    "highlights": ["array of key achievements"]
  }],
  "education": [{
    "id": "uuid",
    "degree": "string - Degree type",
    "field": "string - Field of study",
    "school": "string - Institution name",
    "location": "string - Location",
    "startYear": "number",
    "endYear": "number",
    "gpa": "number or null",
    "honors": "string - Honors/awards"
  }],
  "skills": [{
    "name": "string - Skill name",
    "category": "programming|design|business|language|tools|other",
    "level": "beginner|intermediate|advanced|expert",
    "yearsExp": "number"
  }],
  "certifications": [{
    "id": "uuid",
    "name": "string - Certification name",
    "issuer": "string - Issuing organization",
    "issueDate": "YYYY-MM",
    "expiryDate": "YYYY-MM or null",
    "credentialId": "string"
  }],
  "languages": [{
    "language": "string - Language name",
    "proficiency": "native|fluent|professional|intermediate|basic"
  }],
  "projects": [{
    "id": "uuid",
    "name": "string - Project name",
    "description": "string",
    "url": "string - Project URL",
    "technologies": ["array of tech used"],
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM"
  }],
  "interests": ["array of professional interests"],
  "availability": "open|looking|not-looking",
  "preferredRoles": ["array of role types"],
  "remotePreference": "remote|hybrid|onsite|flexible"
}';

-- Update default value to include new fields
ALTER TABLE public.user_profiles 
ALTER COLUMN professional_data 
SET DEFAULT '{
  "headline": "",
  "summary": "",
  "experience": [],
  "education": [],
  "skills": [],
  "certifications": [],
  "languages": [],
  "projects": [],
  "interests": [],
  "availability": "not-looking",
  "preferredRoles": [],
  "remotePreference": "flexible"
}'::jsonb;
