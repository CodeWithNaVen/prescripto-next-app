const calculateAge = (dob) => {
  // Parse the BS date string: "2059-05-21"
  const bsYear = parseInt(dob.substring(0, 4));
  const bsMonth = parseInt(dob.substring(5, 7));
  const bsDay = parseInt(dob.substring(8, 10));

  // ✅ Manual BS to AD approximation
  // BS is approx. 56 years and 8.5 months ahead of AD
  let adYear = bsYear - 56;
  let adMonth = bsMonth - 8;
  let adDay = bsDay;

  if (adMonth <= 0) {
    adMonth += 12;
    adYear -= 1;
  }

  // Create AD birth date object
  const birthDate = new Date(adYear, adMonth - 1, adDay); // Month is 0-indexed in JS
  const today = new Date();

  // Age calculation with month/day adjustment
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

export default calculateAge;
