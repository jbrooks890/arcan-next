const apiUrls = {
  production: "", //TODO
  development: "http://localhost:3005/api",
};

const apiUrl =
  window.location.hostname === "localhost"
    ? apiUrls.development
    : apiUrls.production;

export default apiUrl;
