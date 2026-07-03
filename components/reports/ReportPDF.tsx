import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: "#ffffff" },
  title: { fontSize: 24, marginBottom: 20 },
  section: { marginBottom: 10 },
  heading: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  text: { fontSize: 12, marginBottom: 4 },
});

export function ReportPDF({ user }: { user: any }) {
  const totalClicks = user.links.reduce((sum: number, link: any) => sum + link.clickLogs.length, 0);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>NexGen Affilates Weekly Report</Text>
        <View style={styles.section}>
          <Text style={styles.heading}>User: {user.name || user.email}</Text>
          <Text style={styles.text}>Total Clicks (last 7 days): {totalClicks}</Text>
          <Text style={styles.text}>Active Links: {user.links.length}</Text>
        </View>
        {user.links.map((link: any) => (
          <View key={link.id} style={styles.section}>
            <Text style={styles.heading}>{link.name}</Text>
            <Text style={styles.text}>Clicks: {link.clickLogs.length}</Text>
            <Text style={styles.text}>Slug: {link.slug}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}