import Preloader from "@/scenes/Preloader";
import GardenScene from "@/scenes/Scene";
export const getScene = (mapId: string) => {
  const res = [];
  res.push(Preloader);
  switch (mapId) {
    case "garden":
      res.push(GardenScene);
      break;
    default:
      break;
  }
  return res
};
