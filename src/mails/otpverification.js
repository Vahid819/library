import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export default function OtpEmail({ otp, appName = "Library Management System" }) {
  return (
    <Html>
      <Head />
      <Preview>Your OTP Code</Preview>

      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>🔐 OTP Verification</Heading>

          <Text style={text}>
            Use the following One-Time Password (OTP) to verify your email:
          </Text>

          <Section style={otpContainer}>
            <Text style={otpText}>{otp}</Text>
          </Section>

          <Text style={text}>
            This OTP is valid for <strong>5 minutes</strong>.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            If you didn’t request this, you can safely ignore this email.
          </Text>

          <Text style={footer}>— {appName}</Text>
        </Container>
      </Body>
    </Html>
  );
}

/* ---------------- STYLES ---------------- */

const main = {
  backgroundColor: "#f8fafc",
  padding: "20px",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  padding: "30px",
  maxWidth: "480px",
  margin: "0 auto",
};

const heading = {
  color: "#2563eb",
  fontSize: "22px",
  marginBottom: "10px",
};

const text = {
  color: "#111827",
  fontSize: "14px",
  lineHeight: "22px",
};

const otpContainer = {
  backgroundColor: "#f1f5f9",
  borderRadius: "6px",
  padding: "15px",
  textAlign: "center",
  margin: "20px 0",
};

const otpText = {
  fontSize: "28px",
  letterSpacing: "6px",
  fontWeight: "700",
  color: "#1e40af",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};

const footer = {
  fontSize: "12px",
  color: "#6b7280",
};
