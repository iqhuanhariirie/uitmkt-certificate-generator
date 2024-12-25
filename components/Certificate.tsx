import { Document, Page, Image, Text, View, StyleSheet } from "@react-pdf/renderer";

interface CertificateProps {
  certificateTemplate: string;
  guestName: string;
  namePosition: {
    top: number;
    left: number;
    fontSize: number;
  };
}

const Certificate = ({ certificateTemplate, guestName, namePosition }: CertificateProps) => {
  const styles = StyleSheet.create({
    page: {
      
      position: 'relative',
      width: '842pt',
      height: '595pt',
      overflow: 'hidden',
    },
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    nameContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    
    name: {
      position: 'absolute',
      left: `${namePosition.left}%`,
      top: `${namePosition.top}%`,
      fontSize: namePosition.fontSize,
      fontFamily: 'Helvetica-Bold',
      color: '#000000',
      transform: `translate(-50%, -50%)`,
      textAlign: 'center',
    },
    
  });

  return (
    <Document>
      <Page size={[842, 595]} style={styles.page} orientation="landscape">
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image src={certificateTemplate} style={styles.background} />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{guestName}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Certificate;
