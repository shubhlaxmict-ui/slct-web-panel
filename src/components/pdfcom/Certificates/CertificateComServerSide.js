import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font,
  Image,
} from '@react-pdf/renderer';
import NotoSansDevanagari from '@/app/api/helperfile/static/font/NotoSansDevanagari';
import NotoSansDevanagariBold from '@/app/api/helperfile/static/font/NotoSansDevanagariBold';
import logo from '@/app/api/helperfile/Images/logo';
import krinshnaImage from '@/app/api/helperfile/Images/KrinshnaImage';
import { TrsutData } from '@/lib/constentData';

// Register Devanagari Font
Font.register({
  family: 'NotoSansDevanagari',
  fonts: [
    { src: NotoSansDevanagari, fontWeight: 'normal' },
    { src: NotoSansDevanagariBold, fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'NotoSansDevanagari',
    padding: 0,
    width: '148mm',
    height: '210mm',
    position: 'relative',
  },
  frame: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

  // ---- Registration No. value (frame already prints the "Registration No.:" label) ----
  regNoValue: {
    position: 'absolute',
    top: '19.3%',
    left: '40%',
    width: '32%',
    fontSize: 8,
    color: '#1a1a1a',
  },

  // ---- Program subtitle, e.g. (Suraksha Sahyog Yojana) ----
  subtitle: {
    position: 'absolute',
    top: '23.8%',
    left: '20%',
    width: '60%',
    textAlign: 'center',
    fontSize: 9,
    // fontStyle: 'italic',
    color: '#8B1E1E',
    fontWeight: 'bold',
  },

  // ---- Passport-style photo box, top right ----
  photoBox: {
    position: 'absolute',
    top: '15.8%',
    left: '77%',
    width: '18%',
    height: '15%',
    border: '1pt solid #1B3B2F',
    borderRadius: 2,
  },
  photoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
  },

  // ---- Two-column form grid ----
  fieldRow: {
    position: 'absolute',
    left: '6%',
    width: '88%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fieldCol: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  fieldLabel: {
    fontSize: 8.5,
    color: '#1a1a1a',
  },
  fieldLine: {
    flexGrow: 1,
    borderBottom: '0.75pt solid #1a1a1a',
    marginLeft: 3,
    paddingBottom: 1,
  },
  fieldValue: {
    fontSize: 8.5,
    color: '#1a1a1a',
  },

  addressRow: {
    position: 'absolute',
    left: '6%',
    width: '88%',
  },
  addressLine: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  addressLineNoLabel: {
    borderBottom: '0.75pt solid #1a1a1a',
    height: 10,
    marginTop: 2,
  },

  certifyBlock: {
    position: 'absolute',
    top: '75%',
    left: '10%',
    width: '80%',
    textAlign: 'center',
  },
  certifyText: {
    fontSize: 9,
    // fontStyle: 'italic',
    color: '#1a1a1a',
    lineHeight: 1.5,
  },
  certifyNameLine: {
    borderBottom: '0.75pt solid #1a1a1a',
    marginTop: 2,
    marginBottom: 2,
    width: '70%',
    alignSelf: 'center',
  },
  agentNameBox:{
position: 'absolute',
bottom: 105,
left: -80,
width: '80%',
  },
  agentNameText:{
    fontSize: 9,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  founderNameBox:{
    position: 'absolute',
bottom: 105,
right: -50,
width: '80%',
  }
});

const Field = ({ label, value, style }) => (
  <View style={[styles.fieldCol, style]}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.fieldLine}>
      <Text style={styles.fieldValue}>{value || ''}</Text>
    </View>
  </View>
);

const Certificate = ({ data, selectedProgram, fontPath }) => {
  return (
    <Page size={{ width: '148mm', height: '210mm' }} style={styles.page}>
      {/* Static frame / background artwork */}
      <Image src={TrsutData.frameImg} style={styles.frame} />

      {/* Registration number value, next to the printed "Registration No.:" label */}
      {/* <Text style={styles.regNoValue}>{data?.registrationNumber}</Text> */}

      {/* Program subtitle */}
      {selectedProgram?.name && (
        <Text style={styles.subtitle}>({selectedProgram.name})</Text>
      )}

      {/* Photo box */}
      <View style={styles.photoBox}>
        {data?.photoURL ? (
          <Image src={data.photoURL} style={styles.photoImg} />
        ) : null}
      </View>

      {/* Row 1: Reg No. / Date */}
      <View style={[styles.fieldRow, { top: '53.5%' }]}>
        <Field label="Reg No. :" value={data?.registrationNumber} />
        <Field label="Date :" value={data?.dateJoin} />
      </View>

      {/* Row 2: Name / Nominee Name */}
      <View style={[styles.fieldRow, { top: '57.3%' }]}>
        <Field label="Name :" value={data?.displayName +" "+ data?.fatherName} />
        <Field label={selectedProgram?.isSuraksha ? "Nominee Name :" : "Guardian Name :"} value={data?.guardian} />
      </View>

      {/* Row 3: Phone No. / Date of Birth */}
      <View style={[styles.fieldRow, { top: '61.1%' }]}>
        <Field label="Phone No. :" value={data?.phone} />
        <Field label="Date of Birth :" value={data?.bobDate} />
      </View>

      {/* Row 4: State / Suraksha Sahyog Donation */}
      <View style={[styles.fieldRow, { top: '64.9%' }]}>
        <Field label="State :" value={data?.state} />
        <Field label="Donation :" value={data?.payAmount} />
      </View>

      {/* Address (label + two blank/continuation lines) */}
      <View style={[styles.addressRow, { top: '68.7%' }]}>
        <View style={styles.addressLine}>
          <Text style={styles.fieldLabel}>Address :</Text>
          <View style={styles.fieldLine}>
            <Text style={styles.fieldValue}>{data?.currentAddress}</Text>
          </View>
        </View>
        <View style={styles.addressLineNoLabel} />
      </View>

      {/* Certify paragraph */}
      <View style={styles.certifyBlock}>
        <Text style={styles.certifyText}>This is to certify that  {data?.displayName}</Text>
        <Text style={styles.certifyText}>
          has been registered under our {selectedProgram?.name || 'Sahyog Yojana'} program.
        </Text>
      </View>
      <View style={
        styles.agentNameBox
      }>
        <Text style={styles.agentNameText}>{data.addedByName}</Text>
      </View>
            <View style={
        styles.founderNameBox
      }>
        {/* <Text style={styles.agentNameText}>{data.addedByName}</Text> */}
      </View>
    </Page>
  );
};

const CertificateComServerSide = ({ data, selectedProgram }) => {
  const membersArray = Array.isArray(data) ? data : [data];
  return (
    <Document>
      {membersArray.map((member, index) => (
        <Certificate
          key={member?.id || member?.registrationNumber || index}
          data={member}
          selectedProgram={selectedProgram}
          index={index}
        />
      ))}
    </Document>
  );
};

export default CertificateComServerSide;

/* ------------------------------------------------------------------ */
/* Dummy data + local preview (for testing outside the server route)   */
/* ------------------------------------------------------------------ */

export const dummyMember = {
  id: 'SL-0001',
  registrationNumber: 'SLCT/2025/00124',
  date: '02/07/2026',
  name: 'Rohit Sharma',
  nomineeName: 'Sunita Sharma',
  phone: '+91 98923 11810',
  dob: '15/08/1990',
  state: 'Maharashtra',
  donation: '₹ 1,100',
  address: '15, Shanti Nagar Society, Andheri West, Mumbai - 400058, Maharashtra',
  photo: null, // supply a base64/URL image if available
};

export const dummyProgram = { name: 'Suraksha Sahyog Yojana' };

export const CertificatePreview = () => (
  <PDFViewer style={{ width: '100%', height: '100vh' }}>
    <CertificateComServerSide data={dummyMember} selectedProgram={dummyProgram} />
  </PDFViewer>
);