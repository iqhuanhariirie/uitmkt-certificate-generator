import { Document, Page, Image, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    position: 'relative',
    width: '842pt',
    height: '595pt',
    overflow: 'hidden',
  },
  contentWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  nameContainer: {
    position: 'relative',
    width: '100%',
    top: '50%', // Adjust this to match your template
    left: 0,
    textAlign: 'center',
  },
  name: {
    fontSize: 24,
    color: '#000000',
    fontFamily: 'Helvetica-Bold',
  },
});

interface CertificateProps {
  certificateTemplate: string;
  guestName: string;
}

const Certificate = ({ certificateTemplate, guestName }: CertificateProps) => {
  return (
    <Document>
      <Page size={[842, 595]} style={styles.page} orientation="landscape">
        <Image src={certificateTemplate} style={styles.background} />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{guestName}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Certificate;
