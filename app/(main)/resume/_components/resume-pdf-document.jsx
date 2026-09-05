import { Document, Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";
import { formatDate } from "@/backend/features/resume/helper";

const HEADING_COLOR = "#2c3e50";
const BODY_COLOR = "#333333";
const LINK_COLOR = "#2980b9";

const styles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingHorizontal: 40,
    paddingBottom: 24,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: BODY_COLOR,
    lineHeight: 1.4,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 24,
    color: HEADING_COLOR,
    textAlign: "center",
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 8,
  },
  contactText: {
    fontSize: 9.5,
    color: BODY_COLOR,
  },
  contactLink: {
    fontSize: 9.5,
    color: LINK_COLOR,
    textDecoration: "none",
  },
  contactSeparator: {
    fontSize: 9.5,
    color: BODY_COLOR,
    marginHorizontal: 4,
  },
  headerDivider: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#000000",
    marginBottom: 10,
  },
  section: {
    marginTop: 2,
    marginBottom: 2,
  },
  sectionHeading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11.5,
    color: HEADING_COLOR,
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingBottom: 2,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#999999",
  },
  paragraph: {
    fontSize: 10,
    color: BODY_COLOR,
    marginBottom: 4,
  },
  entry: {
    marginBottom: 8,
  },
  entryHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  entryTitleLine: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    color: BODY_COLOR,
  },
  entryTitleRegular: {
    fontFamily: "Helvetica",
    fontSize: 10.5,
    color: BODY_COLOR,
  },
  entryDateRange: {
    fontFamily: "Helvetica-Oblique",
    fontSize: 9,
    color: "#666666",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 1,
    paddingLeft: 2,
  },
  bulletChar: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.35,
  },
});

// Splits "some **bold** text" into plain/bold Text runs.
function parseInlineBold(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={key} style={{ fontFamily: "Helvetica-Bold" }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return <Text key={key}>{part}</Text>;
  });
}

// Renders freeform AI-generated text: lines starting with "- "/"* " become
// bullet rows, everything else is a plain paragraph line; "**bold**" markdown
// is parsed inline either way.
function RichText({ text }) {
  if (!text) return null;

  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

  return lines.map((line, index) => {
    const isBullet = line.startsWith("- ") || line.startsWith("* ");
    const content = isBullet ? line.slice(2).trim() : line;
    const runs = parseInlineBold(content, index);

    if (isBullet) {
      return (
        <View key={index} style={styles.bulletRow}>
          <Text style={styles.bulletChar}>•</Text>
          <Text style={styles.bulletText}>{runs}</Text>
        </View>
      );
    }

    return (
      <Text key={index} style={styles.paragraph}>
        {runs}
      </Text>
    );
  });
}

function EntryTitleLine({ entry, variant }) {
  if (variant === "project") {
    return <Text style={styles.entryTitleLine}>{entry.title}</Text>;
  }

  // Experience and education both read as "Organization | Role/Degree".
  return (
    <Text style={styles.entryTitleLine}>
      {entry.organization}
      <Text style={styles.entryTitleRegular}> | {entry.title}</Text>
    </Text>
  );
}

function EntrySection({ heading, entries, variant }) {
  if (!entries?.length) return null;

  return (
    <View style={styles.section}>
      {entries.map((entry, index) => {
        const dateRange = `${formatDate(entry.startDate)} - ${
          entry.current ? "Present" : formatDate(entry.endDate)
        }`;

        return (
          <View key={index} style={styles.entry}>
            {/* Heading (first entry only) stays glued to that entry's title/date
                row so the heading can never be orphaned alone at a page break.
                The description below is left free to wrap across pages, so a
                long bullet list doesn't drag the whole entry - and any empty
                space left on the page - onto the next page with it. */}
            <View wrap={false}>
              {index === 0 && <Text style={styles.sectionHeading}>{heading}</Text>}
              <View style={styles.entryHeaderRow}>
                <EntryTitleLine entry={entry} variant={variant} />
                <Text style={styles.entryDateRange}>{dateRange}</Text>
              </View>
            </View>
            <RichText text={entry.description} />
          </View>
        );
      })}
    </View>
  );
}

function ContactRow({ contactInfo }) {
  const parts = [];
  if (contactInfo?.email) parts.push({ text: contactInfo.email, href: `mailto:${contactInfo.email}` });
  if (contactInfo?.mobile) parts.push({ text: contactInfo.mobile, href: `tel:${contactInfo.mobile}` });
  if (contactInfo?.linkedin) parts.push({ text: "LinkedIn", href: contactInfo.linkedin });
  if (contactInfo?.github) parts.push({ text: "GitHub", href: contactInfo.github });

  if (!parts.length) return null;

  return (
    <View style={styles.contactRow}>
      {parts.map((part, index) => (
        <View key={index} style={{ flexDirection: "row" }}>
          {index > 0 && <Text style={styles.contactSeparator}>|</Text>}
          {part.href ? (
            <Link src={part.href} style={styles.contactLink}>
              {part.text}
            </Link>
          ) : (
            <Text style={styles.contactText}>{part.text}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

export default function ResumePDFDocument({
  name,
  contactInfo,
  summary,
  skills,
  experience,
  education,
  projects,
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{name || "Your Name"}</Text>
        <ContactRow contactInfo={contactInfo} />
        <View style={styles.headerDivider} />

        {summary && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionHeading}>Professional Summary</Text>
            <RichText text={summary} />
          </View>
        )}

        {skills && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionHeading}>Technical Skills</Text>
            <RichText text={skills} />
          </View>
        )}

        <EntrySection heading="Experience" entries={experience} variant="experience" />
        <EntrySection heading="Education" entries={education} />
        <EntrySection heading="Personal Projects" entries={projects} variant="project" />
      </Page>
    </Document>
  );
}
