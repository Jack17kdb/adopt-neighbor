export const neighborWelcomeEmail = (name) => ({
  subject: "Welcome to Adopt a Neighbor",
  html: `
    <p>Dear ${name},</p>

    <p>Welcome to Adopt a Neighbor! Thank you for signing up.</p>

    <p>We are working to match you with a volunteer who will help you with your needs.</p>

    <p>We will be in touch soon once a match is found.</p>

    <p>Take care and stay safe.</p>
  `
});

export const certifiedVolunteerWelcomeEmail = (name) => ({
  subject: "Welcome to Adopt a Neighbor",
  html: `
    <p>Dear ${name},</p>

    <p>Thank you for volunteering to help your community.</p>

    <p>We are working to match you with a neighbor who needs assistance.</p>

    <p>We will contact you soon with more details.</p>

    <p>Take care and stay safe.</p>
  `
});

export const uncertifiedVolunteerEmail = (name) => ({
  subject: "Welcome to Adopt a Neighbor",
  html: `
    <p>Dear ${name},</p>

    <p>Thank you for volunteering to help your community.</p>

    <p>At this time, we cannot match you with neighbors for errands due to safety guidelines.</p>

    <p>However, there may be other ways to help from home.</p>

    <p>We will reach out if opportunities arise.</p>

    <p>Take care and stay safe.</p>
  `
});

export const volunteerMatchEmail = (volunteerName, neighbor) => ({
  subject: "You’ve been matched with a neighbor",
  html: `
    <p>Dear ${volunteerName},</p>

    <p>Good news! You have been matched with a neighbor who needs help:</p>

    <p>
      Name: ${neighbor.name}<br/>
      Address: ${neighbor.address}<br/>
      Phone: ${neighbor.phone}<br/>
      Email: ${neighbor.email || "N/A"}
    </p>

    <p>Please reach out to them and introduce yourself.</p>

    <p>Thank you for helping your community.</p>
  `
});

export const neighborMatchEmail = (neighborName, volunteer) => ({
  subject: "You’ve been matched with a volunteer",
  html: `
    <p>Dear ${neighborName},</p>

    <p>Good news! You have been matched with a volunteer who will assist you:</p>

    <p>
      Name: ${volunteer.name}<br/>
      Address: ${volunteer.address}<br/>
      Phone: ${volunteer.phone}<br/>
      Email: ${volunteer.email}
    </p>

    <p>They will reach out to you shortly.</p>

    <p>Take care and stay safe.</p>
  `
});

export const volunteerCheckInEmail = (name, link) => ({
  subject: "Check-in Reminder",
  html: `
    <p>Dear ${name},</p>

    <p>Please check in and let us know how things are going with your neighbor.</p>

    <p>
      <a href="${link}">Submit Check-In</a>
    </p>

    <p>Thank you for your help.</p>
  `
});

export const neighborCheckEmail = (name) => ({
  subject: "Do you need anything else?",
  html: `
    <p>Dear ${name},</p>

    <p>We are checking in to see how things are going.</p>

    <p>Please let us know if you need any additional help or have any concerns.</p>

    <p>We are here to support you.</p>

    <p>Take care and stay safe.</p>
  `
});


