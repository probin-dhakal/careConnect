export const appointmentCreatedTemplate = (appointment) => {
  const { userData, docData, slotDate, slotTime, amount } = appointment
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#222">
    <h2 style="color:#0b5ed7">Appointment Confirmed</h2>
    <p>Hi ${userData.name || ''},</p>
    <p>Your appointment with <strong>${docData.name}</strong> is confirmed.</p>
    <ul>
      <li><strong>Date:</strong> ${slotDate}</li>
      <li><strong>Time:</strong> ${slotTime}</li>
      <li><strong>Fees:</strong> ${amount}</li>
    </ul>
    <p>Doctor: ${docData.speciality || ''} • ${docData.degree || ''}</p>
    <p style="margin-top:1rem">If you have any questions, reply to this email.</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <small style="color:#666">CareConnect</small>
  </div>
  `
}

export const appointmentCompletedTemplate = (appointment) => {
  const { userData, docData, slotDate, slotTime } = appointment
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#222">
    <h2 style="color:#198754">Thank you for visiting</h2>
    <p>Hi ${userData.name || ''},</p>
    <p>We hope your appointment with <strong>${docData.name}</strong> on ${slotDate} at ${slotTime} went well.</p>
    <p>Thank you for trusting CareConnect. We look forward to seeing you again.</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <small style="color:#666">CareConnect</small>
  </div>
  `
}

export const appointmentCancelledTemplate = (appointment, cancelledBy) => {
  const { userData, docData, slotDate, slotTime } = appointment
  const byText = cancelledBy ? ` by ${cancelledBy}` : ''
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#222">
    <h2 style="color:#dc3545">Appointment Cancelled</h2>
    <p>Hi ${userData.name || ''},</p>
    <p>Your appointment with <strong>${docData.name}</strong> on ${slotDate} at ${slotTime} has been cancelled${byText}.</p>
    <p>If you need to reschedule, please book a new appointment from the app.</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <small style="color:#666">CareConnect</small>
  </div>
  `
}

export default {
  appointmentCreatedTemplate,
  appointmentCompletedTemplate,
  appointmentCancelledTemplate,
}
