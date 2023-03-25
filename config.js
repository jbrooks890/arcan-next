const apiUrls = {
  production: "", //TODO
  development: "http://localhost:3005/api",
};

export default apiUrl =
  window.location.hostname === "localhost"
    ? apiUrls.development
    : apiUrls.production;
