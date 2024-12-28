"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { FileSpreadsheet, Mail, ScrollText, Zap } from "lucide-react";
import { motion } from "framer-motion";

export const FeatureCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-300 hover:scale-105 dark:hover:bg-secondary/20 backdrop-blur-sm"
          >
            <CardHeader className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                {feature.icon}
              </div>
              <CardTitle className="text-center text-foreground">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

const features = [
  {
    icon: <Zap size={24} className="text-primary dark:text-primary/80" />,
    title: "Instant Certificate Generation",
    description: "Generate professional certificates on demand, saving time and effort."
  },
  {
    icon: <FileSpreadsheet size={24} className="text-primary dark:text-primary/80" />,
    title: "Seamless Data Import",
    description: "Import participant data from CSV files for quick certificate generation."
  },
  {
    icon: <ScrollText size={24} className="text-primary dark:text-primary/80" />,
    title: "Digital Signature Integration",
    description: "Implement Digital Signature (RSA) to ensure integrity, confidentiality and authenticity of certificates."
  },
  {
    icon: <Mail size={24} className="text-primary dark:text-primary/80" />,
    title: "Simple Certificate Distribution",
    description: "Distribute signed certificates to participants via email, ensuring efficient and timely delivery."
  }
];
