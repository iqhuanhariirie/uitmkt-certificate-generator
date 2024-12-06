import { Document, Page, Image, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  nameContainer: {
    position: 'absolute',
    width: '100%',
    top: '50%', // Adjust this to match your template
    textAlign: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

interface CertificateProps {
  certificateTemplate: string;
  guestName: string;
}

const Certificate = ({ certificateTemplate, guestName }: CertificateProps) => {
  return (
    <Document>
      <Page style={styles.page}>
        <Image src={certificateTemplate} style={styles.background} />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{guestName}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Certificate;
