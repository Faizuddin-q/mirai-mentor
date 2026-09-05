// Helper function to format date from "yyyy-MM" to "DD MMM yyyy"
function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const [year, month] = dateString.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = months[parseInt(month) - 1] || "";
    // For resume, we'll use "01" as default day, but you can customize
    return `${monthName} ${year}`;
  } catch {
    return dateString;
  }
}

// Helper function to convert entries to markdown
export function entriesToMarkdown(entries, type) {
  if (!entries?.length) return "";

  const formattedEntries = entries
    .map((entry) => {
      const startDate = formatDate(entry.startDate);
      const endDate = entry.current ? "Present" : formatDate(entry.endDate);
      const dateRange = `${startDate} - ${endDate}`;
      
      // Format with title and organization on same line, date range on next line
      return `**${entry.title} @ ${entry.organization}**\n${dateRange}\n\n${entry.description}`;
    })
    .join("\n\n");

  return `## ${type}\n\n${formattedEntries}`;
}

// Helper function to parse markdown back into form data
export function parseMarkdownToFormData(markdown) {
  if (!markdown) return null;

  // Helper to convert "MMM yyyy" to "yyyy-MM" format
  const parseDateToFormFormat = (dateString) => {
    if (!dateString || dateString === "Present") return "";
    try {
      // Handle "MMM yyyy" format (e.g., "Jan 2020")
      const months = {
        Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
        Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
      };
      const parts = dateString.trim().split(" ");
      if (parts.length === 2 && months[parts[0]]) {
        return `${parts[1]}-${months[parts[0]]}`;
      }
      // If already in yyyy-MM format, return as is
      if (/^\d{4}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      return "";
    } catch {
      return "";
    }
  };

  const data = {
    contactInfo: {},
    summary: "",
    skills: "",
    experience: [],
    education: [],
    projects: [],
  };

  // Parse contact info (name and contact details in centered div)
  // Try multiple patterns to match different markdown formats
  let contactMatch = markdown.match(/## <div align="center">([^<]+)<\/div>\s*\n\n<div align="center">\n\n([^<]+)\n\n<\/div>/);
  if (!contactMatch) {
    // Try new format with # for name
    contactMatch = markdown.match(/<div align="center">\n\n# ([^\n]+)\n\n([^<]+)\n\n<\/div>/);
  }
  if (!contactMatch) {
    // Try without the name div
    contactMatch = markdown.match(/<div align="center">\n\n([^<]+)\n\n<\/div>/);
  }
  
  if (contactMatch) {
    const contactText = contactMatch[contactMatch.length - 1]; // Get the last match group
    const contactDetails = contactText.split("|").map((s) => s.trim()).filter(Boolean);
    
    contactDetails.forEach((detail) => {
      const trimmed = detail.trim();
      // Check for email (contains @ and doesn't start with [)
      if (trimmed.includes("@") && !trimmed.startsWith("[") && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        data.contactInfo.email = trimmed;
      } 
      // Check for phone number (Indian 10-digit mobile number)
      else {
        // Normalize phone number: remove spaces, dashes, parentheses, country code
        const normalized = trimmed.replace(/[\s()-]/g, '').replace(/^\+91/, '').replace(/^91/, '');
        // Validate: 10 digits starting with 6, 7, 8, or 9
        if (/^[6-9]\d{9}$/.test(normalized)) {
          data.contactInfo.mobile = normalized;
        }
        // If not a valid phone, check for LinkedIn
        else if (trimmed.includes("linkedin.com") || trimmed.includes("[LinkedIn]")) {
          const linkedinMatch = trimmed.match(/\[LinkedIn\]\(([^)]+)\)/);
          if (linkedinMatch) {
            data.contactInfo.linkedin = linkedinMatch[1];
          } else if (trimmed.includes("http")) {
            data.contactInfo.linkedin = trimmed;
          }
        }
        // Check for Twitter/LeetCode/GitHub (coding profiles)
        else if (trimmed.includes("twitter.com") || trimmed.includes("leetcode.com") || trimmed.includes("github.com") || trimmed.includes("[Twitter]")) {
          const twitterMatch = trimmed.match(/\[Twitter\]\(([^)]+)\)/);
          if (twitterMatch) {
            data.contactInfo.twitter = twitterMatch[1];
          } else if (trimmed.includes("http")) {
            data.contactInfo.twitter = trimmed;
          }
        }
      }
    });
  }

  // Parse Professional Summary (handle both old and new format)
  const summaryMatch = markdown.match(/## (?:PROFESSIONAL SUMMARY|Professional Summary)\n\n([\s\S]*?)(?=\n---|\n## |$)/);
  if (summaryMatch) {
    data.summary = summaryMatch[1].trim();
  }

  // Parse Skills (handle both old and new format)
  const skillsMatch = markdown.match(/## (?:TECHNICAL SKILLS|Skills)\n\n([\s\S]*?)(?=\n---|\n## |$)/);
  if (skillsMatch) {
    data.skills = skillsMatch[1].trim();
  }

  // Helper to parse date from "MMM yyyy" format back to "yyyy-MM"
  const parseDateFromFormatted = (dateString) => {
    if (!dateString || dateString === "Present") return "";
    try {
      const months = {
        Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
        Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
      };
      const parts = dateString.trim().split(" ");
      if (parts.length === 2 && months[parts[0]]) {
        return `${parts[1]}-${months[parts[0]]}`;
      }
      // If already in yyyy-MM format, return as is
      if (/^\d{4}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      return "";
    } catch {
      return "";
    }
  };

  // Parse entries (Work Experience, Education, Projects) - handle both old and new formats
  const parseEntries = (sectionName) => {
    // Try new format first (ALL CAPS), then old format
    const sectionMatch = markdown.match(new RegExp(`## (?:${sectionName}|${sectionName.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')})\\n\\n([\\s\\S]*?)(?=\\n---|\\n## |$)`));
    if (!sectionMatch) return [];

    const entries = [];
    // Split by double newlines, then look for bold entries (new format) or ### entries (old format)
    const entryBlocks = sectionMatch[1].split(/\n\n(?=\*\*|### )/);

    entryBlocks.forEach((block) => {
      // Try new format: **Title @ Organization**
      let titleMatch = block.match(/\*\*(.+?) @ (.+?)\*\*/);
      let isNewFormat = true;
      
      // If not found, try old format: ### Title @ Organization
      if (!titleMatch) {
        titleMatch = block.match(/### (.+?) @ (.+?)\n/);
        isNewFormat = false;
      }
      
      if (!titleMatch) return;

      const title = titleMatch[1].trim();
      const organization = titleMatch[2].trim();
      
      // Get date range (next line after title)
      const dateRangeMatch = block.match(/\n(.+?)\n\n/);
      
      if (!dateRangeMatch) return;

      const dateRange = dateRangeMatch[1].trim();
      const isCurrent = dateRange.includes("Present");
      const dateParts = dateRange.split(" - ");

      const description = block.substring(dateRangeMatch.index + dateRangeMatch[0].length).trim();

      entries.push({
        title,
        organization,
        startDate: parseDateFromFormatted(dateParts[0]?.trim() || ""),
        endDate: isCurrent ? "" : parseDateFromFormatted(dateParts[1]?.trim() || ""),
        description,
        current: isCurrent,
      });
    });

    return entries;
  };

  data.experience = parseEntries("EXPERIENCE");
  data.education = parseEntries("EDUCATION");
  data.projects = parseEntries("PERSONAL PROJECTS");

  return data;
}
