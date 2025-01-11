import {
  Html,
  Body,
  Container,
  Head,
  Heading,
  Link,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import { Participant } from './ui/participant-columns';

interface CertificateEmailProps {
  recipientName: string;
  eventName: string;
  certificateUrl: string;
}

export default function CertificateEmail({
  recipientName,
  eventName,
  certificateUrl,
}: CertificateEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Your Certificate is Ready
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Dear Participant,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Your certificate for <strong>{eventName}</strong> has been issued and is now available.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Click the button below to view and download your certificate:
            </Text>
            <Text className="text-blue-600 text-center my-[32px]">
              <Link
                href={certificateUrl}
                className="text-blue-600 bg-blue-100 rounded-md px-6 py-3"
              >
                View Certificate
              </Link>
            </Text>
            <Text className="text-gray-500 text-[12px] leading-[24px]">
              This is an automated message. Please do not reply to this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}