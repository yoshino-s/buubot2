import Axios from "axios";

(async () => {
  const resp = await Axios.get("https://api.isoyu.com/mm_images.php", {
    maxRedirects: 0,
  }).catch((r) => {
    return r.response.headers.location;
  });
  console.log(resp);
})();
