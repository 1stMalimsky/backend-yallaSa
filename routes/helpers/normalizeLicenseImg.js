const normaillizeLicenseImg = (licenseImg) => {
  const normalizedLicenseImg = {
    filename: licenseImg.filename,
    path: licenseImg.path,
    contentType: licenseImg.contentType,
  };

  return normalizedLicenseImg;
};

module.exports = normaillizeLicenseImg;
