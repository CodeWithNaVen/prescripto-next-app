import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export const generateReceipt = async (userData, docInfo, slotDate, slotTime, appointmentId) => {
  const doc = new jsPDF();

  // 1. Add Header / Branding
  doc.setFontSize(22);
  doc.setTextColor(40, 116, 240); // Primary color
  doc.text("APPOINTMENT RECEIPT", 105, 20, { align: "center" });

  // 2. Add Content
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Appointment ID: ${appointmentId}`, 20, 40);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
  
  doc.line(20, 55, 190, 55); // Horizontal line

  doc.setFont(undefined, 'bold');
  doc.text("Patient Details:", 20, 65);
  doc.setFont(undefined, 'normal');
  doc.text(`Name: ${userData.name}`, 20, 72);
  doc.text(`Email: ${userData.email}`, 20, 79);

  doc.setFont(undefined, 'bold');
  doc.text("Doctor Details:", 20, 95);
  doc.setFont(undefined, 'normal');
  doc.text(`Doctor: ${docInfo.name}`, 20, 102);
  doc.text(`Speciality: ${docInfo.speciality}`, 20, 109);

  doc.setFont(undefined, 'bold');
  doc.text("Schedule:", 20, 125);
  doc.setFont(undefined, 'normal');
  doc.text(`Date: ${slotDate}`, 20, 132);
  doc.text(`Time: ${slotTime}`, 20, 139);
  doc.text(`Fees: ${docInfo.fees}`, 20, 146);

  // 3. Generate and Add QR Code
  // The QR contains a JSON string of the appointment info
  const qrData = JSON.stringify({
    appointmentId,
    patient: userData.name,
    doctor: docInfo.name,
    date: slotDate,
    time: slotTime,
    fees: docInfo.fees,
    speciality: docInfo.speciality,
  });

  try {
    const qrCodeDataUri = await QRCode.toDataURL(qrData);
    doc.addImage(qrCodeDataUri, 'PNG', 75, 160, 60, 60);
    doc.setFontSize(10);
    doc.text("Scan this QR at the reception", 105, 225, { align: "center" });
  } catch (err) {
    console.error("QR Generation Error", err);
  }

  // 4. Footer
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("Thank you for booking with us!", 105, 280, { align: "center" });

  // 5. Save/Download
  doc.save(`Appointment_${appointmentId}.pdf`);
};