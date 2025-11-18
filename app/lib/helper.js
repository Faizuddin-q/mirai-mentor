// Helper function to convert entries to markdown
export function entriesToMarkdown(entries, type) {
  if (!entries?.length) return "";

  return (
    `## ${type}\n\n` +
    entries
      .map((entry) => {
        const dateRange = entry.current
          ? `${entry.startDate} - Present`
          : `${entry.startDate} - ${entry.endDate}`;
        return `### ${entry.title} @ ${entry.organization}\n${dateRange}\n\n${entry.description}`;
      })
      .join("\n\n")
  );
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
      // Check for phone number
      else if (/^\+?[0-9\s()-]{7,20}$/.test(trimmed)) {
        data.contactInfo.mobile = trimmed;
      } 
      // Check for LinkedIn
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
    });
  }

  // Parse Professional Summary
  const summaryMatch = markdown.match(/## Professional Summary\n\n([\s\S]*?)(?=\n## |$)/);
  if (summaryMatch) {
    data.summary = summaryMatch[1].trim();
  }

  // Parse Skills
  const skillsMatch = markdown.match(/## Skills\n\n([\s\S]*?)(?=\n## |$)/);
  if (skillsMatch) {
    data.skills = skillsMatch[1].trim();
  }

  // Parse entries (Work Experience, Education, Projects)
  const parseEntries = (sectionName) => {
    const sectionMatch = markdown.match(new RegExp(`## ${sectionName}\\n\\n([\\s\\S]*?)(?=\\n## |$)`));
    if (!sectionMatch) return [];

    const entries = [];
    const entryBlocks = sectionMatch[1].split(/\n\n(?=### )/);

    entryBlocks.forEach((block) => {
      const titleMatch = block.match(/### (.+?) @ (.+?)\n/);
      if (!titleMatch) return;

      const title = titleMatch[1].trim();
      const organization = titleMatch[2].trim();
      const dateRangeMatch = block.match(/\n(.+?)\n\n/);
      const description = block.split(/\n\n/).slice(2).join("\n\n").trim();

      if (!dateRangeMatch) return;

      const dateRange = dateRangeMatch[1].trim();
      const isCurrent = dateRange.includes("Present");
      const dateParts = dateRange.split(" - ");

      entries.push({
        title,
        organization,
        startDate: parseDateToFormFormat(dateParts[0]?.trim() || ""),
        endDate: isCurrent ? "" : parseDateToFormFormat(dateParts[1]?.trim() || ""),
        description,
        current: isCurrent,
      });
    });

    return entries;
  };

  data.experience = parseEntries("Work Experience");
  data.education = parseEntries("Education");
  data.projects = parseEntries("Projects");

  return data;
}
