export const sanitizeUrl = (urlString) => {
  let parsedUrlString = urlString;
  if (parsedUrlString.split("://").length === 1) {
    // protocol is not specified, assume https
    parsedUrlString = "https://" + parsedUrlString;
  }
  // remove www. so users can't generate 2 hashs for the same website, e.g. www.google.com == google.com
  parsedUrlString = parsedUrlString.replace("www.", "");
  return parsedUrlString;
};

export const convertToUrlObject = (urlString) => {
  try {
    return new URL(urlString);
  } catch (e) {
    return null;
  }
};
