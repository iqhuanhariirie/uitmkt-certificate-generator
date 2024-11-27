"use client";

import { fetchImageSize } from "@/utils/fetchImageSize";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { fetchDominantColorFromImage } from "@/utils/fetchDominantColorFromImage";
import { getTextColor } from "@/utils/getTextColor";
import { Timestamp } from "firebase/firestore";

const Certificate = ({
  eventDate,
  certificateTemplate,
  guestName,
  studentID,
  course,
  part,
  group
}: {
  eventDate: Timestamp;
  certificateTemplate: string;
  guestName: string;
  studentID: string;
  course: string;
  part: number;
  group: string;
}) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [backgroundColor, setBackgroundColor] = useState({ r: 0, g: 0, b: 0 });

  useEffect(() => {
    const getImageSize = async () => {
      const size = await fetchImageSize(certificateTemplate);
      setImageSize(size);
    };
    const getBackgroundColor = async () => {
      const color = await fetchDominantColorFromImage(certificateTemplate);
      setBackgroundColor(color);
    };
    getImageSize(); // Gets image size of certificate from Firebase URL
    getBackgroundColor(); // Gets dominant color of the certificate to ensure the text is better as black or white design-wise
  }, [certificateTemplate]);

  if (imageSize.width === 0 || imageSize.height === 0) {
    return null; // Render nothing until imageSize is fetched
  }

  const { width, height } = imageSize;
  const scaleFactor = Math.min(width, height) / 1500; // Adjust this factor as needed
  const textColor = getTextColor(
    backgroundColor.r,
    backgroundColor.g,
    backgroundColor.b
  );

  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#ffffff",
    },
    wrapper: {
      flex: 1,
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    textContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      textAlign: "center",
      fontSize: 120 * scaleFactor,
      fontWeight: "bold",
      color: textColor,
    },
  });

  return (
    <Document>
      <Page size={[width, height]} style={styles.page}>
        <View style={styles.wrapper}>
          <Image src={certificateTemplate} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.text}>{guestName}</Text>
            <Text style={styles.text}>{studentID}</Text>
            <Text style={styles.text}>{course}</Text>
            <Text style={styles.text}>{part}</Text>
            <Text style={styles.text}>{group}</Text>
            <Text style={styles.text}>{eventDate.toDate().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Certificate;
